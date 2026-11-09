'use strict';

// JSON API routes: accounts, progress sync, leaderboard, VIP, admin, feedback, visitors, translation.
const accounts = require('./accounts');
const config = require('./config');
const { PAYMENT, VIP_PRICES } = config;
const visitors = require('./visitors');
const { translate } = require('./translate');
const { handleAiChat, gradeWritingSubmission } = require('./ai_tutor');
const { notifyAdmin, isNotifyConfigured } = require('./notify');
const { syncUser, recordFeedbackTicket, recordSyncEvent } = require('./db');
const crypto = require('crypto');
const {
  HttpError, sendJson, readJson, clientIp, isHttps, parseCookies, createRateLimiter, str
} = require('./http');

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const PASSWORD_MIN = 8;

const loginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });
// Per-account cap is looser so a stranger cannot easily lock someone else out.
const accountLoginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 30 });
const pingLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 20 });
const registerLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 });
const vipRequestLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 3 });
const feedbackLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });
const translateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 30 });

function currentUser(req) {
  return accounts.userFromSessionToken(parseCookies(req)[accounts.SESSION_COOKIE]);
}

function requireUser(req) {
  const user = currentUser(req);
  if (!user) throw new HttpError(401, 'Vui lòng đăng nhập để tiếp tục.');
  return user;
}

function requireAdmin(req) {
  const user = requireUser(req);
  if (user.role !== 'admin') throw new HttpError(403, 'Chỉ quản trị viên mới có quyền này.');
  return user;
}

function limit(limiter, key) {
  if (limiter(key)) throw new HttpError(429, 'Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút.');
}

function startSession(req, res, user, status, payload) {
  const cookie = accounts.sessionCookie(accounts.createSessionToken(user), { secure: isHttps(req) });
  sendJson(res, status, { ok: true, ...payload, user: accounts.publicUser(user) }, { 'Set-Cookie': cookie });
}

// ---------------------------------------------------------------------------
// Progress sync: what the browser keeps in localStorage, mirrored for logged-in users
// ---------------------------------------------------------------------------
const MAX_SAVED_WORDS = 5000;

function sanitizeProgress(input) {
  const num = (v, max) => Math.max(0, Math.min(max, Math.floor(Number(v) || 0)));
  const out = {
    exp: num(input.exp, 10_000_000),
    streak: num(input.streak, 100_000),
    lastStudyDate: /^\d{4}-\d{2}-\d{2}$/.test(input.lastStudyDate) ? input.lastStudyDate : undefined,
    dailyGoal: num(input.dailyGoal, 10_000) || undefined,
    savedWords: Array.isArray(input.savedWords)
      ? input.savedWords.slice(0, MAX_SAVED_WORDS).filter(w => w && typeof w.hanzi === 'string').map(w => ({
        hanzi: str(w.hanzi, 40),
        pinyin: str(w.pinyin, 120),
        meaning: str(w.meaning, 400),
        hsk: num(w.hsk, 9) || 1,
        addedAt: str(w.addedAt, 40) || undefined
      }))
      : [],
    updatedAt: new Date().toISOString()
  };
  // Opaque client-side blobs (activity calendar, spaced-repetition deck, last lesson).
  for (const key of ['activity', 'srs', 'lastLesson']) {
    if (input[key] && typeof input[key] === 'object') out[key] = input[key];
  }
  return out;
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------
const routes = {
  'POST /api/auth/register': async (req, res) => {
    limit(registerLimiter, clientIp(req));
    const body = await readJson(req, 512 * 1024);
    const rawUsername = str(body.username, 60);
    const name = str(body.name, 60) || rawUsername;
    const username = rawUsername || name;
    const email = str(body.email, 254).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!name && !username) throw new HttpError(400, 'Vui lòng nhập tên tài khoản hoặc họ tên hiển thị.');
    if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Địa chỉ email không hợp lệ.');
    if (password.length < PASSWORD_MIN || password.length > 200) {
      throw new HttpError(400, `Mật khẩu cần từ ${PASSWORD_MIN} ký tự trở lên.`);
    }
    if (accounts.findByEmail(email)) throw new HttpError(409, 'Email này đã được đăng ký. Mỗi Gmail chỉ có 1 tài khoản duy nhất.');
    if (rawUsername && accounts.findByUsername(rawUsername)) {
      throw new HttpError(409, 'Tên tài khoản này đã có người sử dụng. Vui lòng chọn một tên khác (tiếng Trung hoặc tiếng Việt).');
    }

    const user = accounts.createUser({
      username,
      name,
      email,
      password,
      language: str(body.language, 100),
      profession: str(body.profession, 100),
      purpose: str(body.purpose, 150),
      // Keep what the visitor already earned before signing up.
      progress: body.progress && typeof body.progress === 'object' ? sanitizeProgress(body.progress) : undefined
    });
    startSession(req, res, user, 201, { message: 'Đăng ký thành công!' });
  },

  'POST /api/auth/login': async (req, res) => {
    const body = await readJson(req);
    const email = str(body.email, 254).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';
    limit(loginLimiter, clientIp(req));
    limit(accountLoginLimiter, email);

    const user = accounts.findByEmail(email);
    if (user && !user.passwordHash) {
      throw new HttpError(403, 'Tài khoản cần đặt lại mật khẩu. Vui lòng liên hệ quản trị viên.');
    }
    // Unknown email: still run a hash so response time does not reveal which emails exist.
    const result = accounts.verifyPassword(password, user ? user.passwordHash : accounts.DUMMY_HASH);
    if (!user) throw new HttpError(401, 'Email hoặc mật khẩu không đúng.');
    if (result === 'fail') throw new HttpError(401, 'Email hoặc mật khẩu không đúng.');
    if (result === 'ok-legacy') accounts.setPassword(user, password.trim());
    accounts.touchUserActivity(user);

    startSession(req, res, user, 200, { message: `Chào mừng ${user.name}!` });
  },


  'GET /api/auth/oauth-config': async (req, res) => {
    sendJson(res, 200, {
      ok: true,
      googleEnabled: Boolean(config.GOOGLE_CLIENT_ID),
      googleClientId: config.GOOGLE_CLIENT_ID,
      facebookEnabled: Boolean(config.FACEBOOK_APP_ID),
      facebookAppId: config.FACEBOOK_APP_ID
    });
  },

  'GET /api/auth/google': async (req, res, url) => {
    if (!config.GOOGLE_CLIENT_ID) {
      res.writeHead(302, { Location: '/#/home?oauth_notice=google_setup_needed' });
      res.end();
      return;
    }
    const host = req.headers.host || ('localhost:' + config.PORT);
    const proto = isHttps(req) ? 'https' : 'http';
    const redirectUri = config.GOOGLE_CALLBACK_URL || (proto + '://' + host + '/api/auth/google/callback');
    const state = crypto.randomBytes(16).toString('hex');
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      'client_id=' + encodeURIComponent(config.GOOGLE_CLIENT_ID) +
      '&redirect_uri=' + encodeURIComponent(redirectUri) +
      '&response_type=code' +
      '&scope=' + encodeURIComponent('openid email profile') +
      '&state=' + state +
      '&prompt=select_account';
    res.writeHead(302, { Location: googleAuthUrl });
    res.end();
  },

  'GET /api/auth/google/callback': async (req, res, url) => {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    if (error || !code) {
      res.writeHead(302, { Location: '/#/home?oauth_error=' + encodeURIComponent(error || 'Hủy đăng nhập Google') });
      res.end();
      return;
    }
    try {
      const host = req.headers.host || ('localhost:' + config.PORT);
      const proto = isHttps(req) ? 'https' : 'http';
      const redirectUri = config.GOOGLE_CALLBACK_URL || (proto + '://' + host + '/api/auth/google/callback');

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: config.GOOGLE_CLIENT_ID,
          client_secret: config.GOOGLE_CLIENT_SECRET,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) throw new Error(tokenData.error_description || 'Không lấy được access token từ Google');

      const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: 'Bearer ' + tokenData.access_token }
      });
      const profile = await profileRes.json();
      if (!profile.email) throw new Error('Google không trả về địa chỉ email');

      const { user, isNew } = accounts.findOrCreateSocialUser({
        email: profile.email,
        name: profile.name || profile.given_name,
        provider: 'google',
        providerId: profile.sub,
        avatar: profile.picture
      });
      accounts.touchUserActivity(user);
      const cookie = accounts.sessionCookie(accounts.createSessionToken(user), { secure: isHttps(req) });
      res.writeHead(302, {
        'Set-Cookie': cookie,
        Location: '/#/home?oauth_login=success&provider=google&new=' + (isNew ? 1 : 0)
      });
      res.end();
    } catch (err) {
      res.writeHead(302, { Location: '/#/home?oauth_error=' + encodeURIComponent(err.message) });
      res.end();
    }
  },

  'GET /api/auth/facebook': async (req, res, url) => {
    if (!config.FACEBOOK_APP_ID) {
      res.writeHead(302, { Location: '/#/home?oauth_notice=facebook_setup_needed' });
      res.end();
      return;
    }
    const host = req.headers.host || ('localhost:' + config.PORT);
    const proto = isHttps(req) ? 'https' : 'http';
    const redirectUri = config.FACEBOOK_CALLBACK_URL || (proto + '://' + host + '/api/auth/facebook/callback');
    const state = crypto.randomBytes(16).toString('hex');
    const fbAuthUrl = 'https://www.facebook.com/v19.0/dialog/oauth?' +
      'client_id=' + encodeURIComponent(config.FACEBOOK_APP_ID) +
      '&redirect_uri=' + encodeURIComponent(redirectUri) +
      '&state=' + state +
      '&scope=' + encodeURIComponent('email,public_profile');
    res.writeHead(302, { Location: fbAuthUrl });
    res.end();
  },

  'GET /api/auth/facebook/callback': async (req, res, url) => {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error_message') || url.searchParams.get('error');
    if (error || !code) {
      res.writeHead(302, { Location: '/#/home?oauth_error=' + encodeURIComponent(error || 'Hủy đăng nhập Facebook') });
      res.end();
      return;
    }
    try {
      const host = req.headers.host || ('localhost:' + config.PORT);
      const proto = isHttps(req) ? 'https' : 'http';
      const redirectUri = config.FACEBOOK_CALLBACK_URL || (proto + '://' + host + '/api/auth/facebook/callback');

      const tokenRes = await fetch(
        'https://graph.facebook.com/v19.0/oauth/access_token?' +
        'client_id=' + encodeURIComponent(config.FACEBOOK_APP_ID) +
        '&redirect_uri=' + encodeURIComponent(redirectUri) +
        '&client_secret=' + encodeURIComponent(config.FACEBOOK_APP_SECRET) +
        '&code=' + encodeURIComponent(code)
      );
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) throw new Error(tokenData.error?.message || 'Không lấy được access token từ Facebook');

      const meRes = await fetch(
        'https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=' + encodeURIComponent(tokenData.access_token)
      );
      const fbProfile = await meRes.json();
      const email = fbProfile.email || (fbProfile.id + '@facebook.user');

      const { user, isNew } = accounts.findOrCreateSocialUser({
        email,
        name: fbProfile.name,
        provider: 'facebook',
        providerId: fbProfile.id,
        avatar: fbProfile.picture?.data?.url
      });
      accounts.touchUserActivity(user);
      const cookie = accounts.sessionCookie(accounts.createSessionToken(user), { secure: isHttps(req) });
      res.writeHead(302, {
        'Set-Cookie': cookie,
        Location: '/#/home?oauth_login=success&provider=facebook&new=' + (isNew ? 1 : 0)
      });
      res.end();
    } catch (err) {
      res.writeHead(302, { Location: '/#/home?oauth_error=' + encodeURIComponent(err.message) });
      res.end();
    }
  },

  'POST /api/auth/social-quick': async (req, res) => {
    limit(loginLimiter, clientIp(req));
    const body = await readJson(req);
    const provider = String(body.provider || 'google').toLowerCase();
    if (provider !== 'google' && provider !== 'facebook') {
      throw new HttpError(400, 'Nhà cung cấp đăng nhập không hợp lệ.');
    }
    const email = str(body.email, 254).toLowerCase().trim();
    if (!EMAIL_RE.test(email)) {
      throw new HttpError(400, 'Địa chỉ email không hợp lệ (ví dụ: name@gmail.com).');
    }
    const name = str(body.name, 100) || email.split('@')[0];
    const avatar = str(body.avatar, 500) || null;
    const providerId = str(body.providerId, 100) || null;

    const { user, isNew } = accounts.findOrCreateSocialUser({
      email,
      name,
      provider,
      providerId,
      avatar
    });
    accounts.touchUserActivity(user);

    startSession(req, res, user, 200, {
      message: isNew
        ? 'Chào mừng ' + user.name + '! Bạn được tặng +50 EXP và 7 ngày VIP dùng thử.'
        : 'Chào mừng ' + user.name + ' quay lại!',
      isNew
    });
  },

  'POST /api/auth/logout': async (req, res) => {
    sendJson(res, 200, { ok: true }, { 'Set-Cookie': accounts.sessionCookie('', { secure: isHttps(req), clear: true }) });
  },

  'GET /api/auth/me': async (req, res) => {
    sendJson(res, 200, { ok: true, user: accounts.publicUser(currentUser(req)) });
  },

  'PUT /api/me/progress': async (req, res) => {
    const user = requireUser(req);
    if (accounts.checkInactivityLock(user)) {
      throw new HttpError(403, 'Tài khoản của bạn đang bị khóa do không học tập quá 3 ngày liên tục. Vui lòng liên hệ Admin qua email hoangpham1618@gmail.com để được hỗ trợ mở khóa.');
    }
    const body = await readJson(req, 512 * 1024);
    user.progress = sanitizeProgress(body);
    accounts.touchUserActivity(user);
    accounts.saveUsers();
    sendJson(res, 200, { ok: true, updatedAt: user.progress.updatedAt });
  },

  'GET /api/payment-info': async (req, res) => {
    const configured = Boolean(PAYMENT.bankBin && PAYMENT.accountNo);
    sendJson(res, 200, {
      ok: true,
      configured,
      bankBin: configured ? PAYMENT.bankBin : '',
      bankName: configured ? PAYMENT.bankName : '',
      accountNo: configured ? PAYMENT.accountNo : '',
      accountName: configured ? PAYMENT.accountName : '',
      prices: VIP_PRICES
    }, { 'Cache-Control': 'public, max-age=300' });
  },

  'GET /api/leaderboard': async (req, res) => {
    const top = accounts.users()
      .filter(u => u.role !== 'admin' && u.progress && u.progress.exp > 0)
      .sort((a, b) => b.progress.exp - a.progress.exp)
      .slice(0, 5)
      .map(u => ({ name: u.name, exp: u.progress.exp, streak: u.progress.streak || 0 }));
    sendJson(res, 200, { ok: true, top }, { 'Cache-Control': 'public, max-age=60' });
  },

  'POST /api/vip/upgrade-request': async (req, res) => {
    const user = requireUser(req);
    limit(vipRequestLimiter, user.id);
    const body = await readJson(req);
    const tier = Object.hasOwn(accounts.VIP_TIERS, body.packageTier) ? body.packageTier : 'yearly';
    const note = str(body.txNote, 120);
    user.vipRequest = { tier, note, at: new Date().toISOString() };
    accounts.saveUsers();
    await notifyAdmin(
      `💰 Yêu cầu nâng cấp VIP\n👤 ${user.name} <${user.email}>\n📦 Gói: ${tier}\n📝 Nội dung CK: ${note || '(trống)'}\n` +
      '👉 Kiểm tra sao kê rồi kích hoạt trong Bảng quản trị.'
    );
    sendJson(res, 200, {
      ok: true,
      message: 'Đã gửi yêu cầu! Quản trị viên sẽ kích hoạt VIP sau khi xác nhận chuyển khoản.'
    });
  },

  'GET /api/admin/users': async (req, res) => {
    requireAdmin(req);
    const list = accounts.users().map(u => ({
      ...accounts.publicUser(u),
      progress: undefined,
      exp: (u.progress && u.progress.exp) || 0,
      streak: (u.progress && u.progress.streak) || 0,
      vipRequest: u.vipRequest || null,
      needsPasswordReset: !u.passwordHash
    }));
    sendJson(res, 200, { ok: true, count: list.length, users: list });
  },

  'POST /api/admin/set-vip': async (req, res) => {
    requireAdmin(req);
    const body = await readJson(req);
    const target = accounts.findByEmail(body.targetEmail);
    if (!target) throw new HttpError(404, 'Không tìm thấy học viên với email này.');
    const tier = String(body.tier || '');
    if (!Object.hasOwn(accounts.VIP_TIERS, tier) && tier !== 'trial' && tier !== 'expire') {
      throw new HttpError(400, 'Gói VIP không hợp lệ.');
    }
    accounts.setVipTier(target, tier);
    if (Object.hasOwn(accounts.VIP_TIERS, tier)) delete target.vipRequest;
    accounts.saveUsers();
    sendJson(res, 200, {
      ok: true,
      message: `Đã cập nhật VIP cho ${target.name}: ${accounts.vipInfo(target).label}`,
      user: accounts.publicUser(target)
    });
  },

  'POST /api/admin/unlock-user': async (req, res) => {
    requireAdmin(req);
    const body = await readJson(req);
    const target = accounts.findByEmail(body.email) || accounts.findById(body.userId);
    if (!target) throw new HttpError(404, 'Không tìm thấy tài khoản học viên.');
    accounts.unlockUser(target);
    sendJson(res, 200, {
      ok: true,
      message: `Đã mở khóa tài khoản thành công cho học viên ${target.name}.`,
      user: accounts.publicUser(target)
    });
  },

  'POST /api/admin/reset-password': async (req, res) => {
    requireAdmin(req);
    const body = await readJson(req);
    const target = accounts.findByEmail(body.email) || accounts.findById(body.userId);
    if (!target) throw new HttpError(404, 'Không tìm thấy tài khoản học viên.');
    const newPass = str(body.newPassword, 100);
    if (!newPass || newPass.length < 8) {
      throw new HttpError(400, 'Mật khẩu mới phải có ít nhất 8 ký tự.');
    }
    accounts.setPassword(target, newPass);
    sendJson(res, 200, {
      ok: true,
      message: `Đã cập nhật mật khẩu mới cho học viên ${target.name}.`
    });
  },

  'GET /api/system/broadcast': async (req, res) => {
    sendJson(res, 200, { ok: true, broadcast: accounts.getBroadcast() });
  },

  'POST /api/admin/broadcast': async (req, res) => {
    requireAdmin(req);
    const body = await readJson(req);
    const broadcast = accounts.setBroadcast({
      enabled: Boolean(body.enabled),
      message: str(body.message, 500),
      type: body.type
    });
    sendJson(res, 200, { ok: true, broadcast, message: 'Đã cập nhật thông báo toàn hệ thống.' });
  },

  'POST /api/admin/test-notify': async (req, res) => {
    const admin = requireAdmin(req);
    if (!isNotifyConfigured()) throw new HttpError(503, 'Chưa cấu hình TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID trên máy chủ.');
    const ok = await notifyAdmin(`✅ Kiểm tra thông báo từ Bảng quản trị (${admin.name}).`);
    if (!ok) throw new HttpError(502, 'Telegram không nhận tin nhắn, hãy kiểm tra token và chat ID.');
    sendJson(res, 200, { ok: true });
  },

  'POST /api/feedback': async (req, res) => {
    limit(feedbackLimiter, clientIp(req));
    const body = await readJson(req);
    const message = str(body.message, 1000);
    if (!message) throw new HttpError(400, 'Vui lòng nhập nội dung.');
    const user = currentUser(req);
    const from = user ? `${user.name} <${user.email}>` : (body.email ? `${str(body.name, 100) || 'Khách'} <${str(body.email, 190)}>` : 'Khách');
    await notifyAdmin(`📩 Phản hồi / Khiếu nại mới\n👤 ${from}\n💬 ${message}`);
    sendJson(res, 200, { ok: true });
  },

  'POST /api/visitors/ping': async (req, res) => {
    limit(pingLimiter, clientIp(req));
    const body = await readJson(req);
    sendJson(res, 200, { ok: true, ...visitors.ping(str(body.cid, 64)) });
  },

  'GET /api/visitors': async (req, res) => {
    sendJson(res, 200, { ok: true, ...visitors.stats() });
  },

  'POST /api/ai-chat': async (req, res) => {
    limit(translateLimiter, clientIp(req));
    const body = await readJson(req);
    const text = str(body.message, 500);
    if (!text) throw new HttpError(400, 'Thiếu nội dung tin nhắn.');
    const mode = str(body.mode, 20) || 'chat';
    const tutorResponse = await handleAiChat({ message: text, mode });
    sendJson(res, 200, { ok: true, ...tutorResponse });
  },

  'POST /api/ai-grade-writing': async (req, res) => {
    limit(translateLimiter, clientIp(req));
    const body = await readJson(req, 256 * 1024);
    const text = str(body.text, 2000);
    if (!text) throw new HttpError(400, 'Thiếu nội dung bài viết cần chấm.');
    const prompt = str(body.prompt, 500);
    const targetLevel = Number(body.targetLevel) || 5;
    const keywords = Array.isArray(body.keywords) ? body.keywords.map(k => str(k, 30)).filter(Boolean) : [];
    const evaluation = await gradeWritingSubmission({ text, prompt, targetLevel, keywords });
    sendJson(res, 200, evaluation);
  }
};

async function handleApi(req, res, url) {
  const handler = routes[`${req.method} ${url.pathname}`];
  if (!handler) {
    const known = Object.keys(routes).some(key => key.endsWith(' ' + url.pathname));
    sendJson(res, known ? 405 : 404, { ok: false, error: known ? 'Method Not Allowed' : 'Not found' });
    return;
  }
  try {
    await handler(req, res, url);
  } catch (err) {
    if (err instanceof HttpError) {
      if (!res.headersSent) {
        sendJson(res, err.status, { ok: false, error: err.message }, err.status === 413 ? { Connection: 'close' } : {});
      }
      return;
    }
    throw err;
  }
}

module.exports = { handleApi };
