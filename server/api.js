'use strict';

// JSON API routes: accounts, progress sync, leaderboard, VIP, admin, feedback, visitors, translation.
const accounts = require('./accounts');
const { PAYMENT, VIP_PRICES } = require('./config');
const visitors = require('./visitors');
const { translate } = require('./translate');
const { handleAiChat } = require('./ai_tutor');
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
    const name = str(body.name, 60);
    const email = str(body.email, 254).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!name) throw new HttpError(400, 'Vui lòng nhập họ và tên hiển thị.');
    if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Địa chỉ email không hợp lệ.');
    if (password.length < PASSWORD_MIN || password.length > 200) {
      throw new HttpError(400, `Mật khẩu cần từ ${PASSWORD_MIN} ký tự trở lên.`);
    }
    if (accounts.findByEmail(email)) throw new HttpError(409, 'Email này đã được đăng ký. Vui lòng đăng nhập.');

    const user = accounts.createUser({
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

    startSession(req, res, user, 200, { message: `Chào mừng ${user.name}!` });
  },

  'POST /api/auth/logout': async (req, res) => {
    sendJson(res, 200, { ok: true }, { 'Set-Cookie': accounts.sessionCookie('', { secure: isHttps(req), clear: true }) });
  },

  'GET /api/auth/me': async (req, res) => {
    sendJson(res, 200, { ok: true, user: accounts.publicUser(currentUser(req)) });
  },

  'PUT /api/me/progress': async (req, res) => {
    const user = requireUser(req);
    const body = await readJson(req, 512 * 1024);
    user.progress = sanitizeProgress(body);
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
