const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../server/api.js');
let code = fs.readFileSync(filePath, 'utf8');

// Update config import
code = code.replace(
  "const { PAYMENT, VIP_PRICES } = require('./config');",
  "const config = require('./config');\nconst { PAYMENT, VIP_PRICES } = config;"
);

const socialRoutes = `
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
`;

// Insert social routes right before 'POST /api/auth/logout':
code = code.replace("  'POST /api/auth/logout':", socialRoutes + "\n  'POST /api/auth/logout':");

fs.writeFileSync(filePath, code, 'utf8');
console.log('server/api.js patched for social auth routes successfully!');
