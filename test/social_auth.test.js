'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const http = require('http');

const accounts = require('../server/accounts');
const { handleApi } = require('../server/api');
const { ROOT } = require('../server/config');

// Helper to simulate HTTP requests against handleApi
function makeRequest(handler, { method = 'GET', url = '/', headers = {}, body = null }) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url, 'http://localhost:3005');
    const req = new http.IncomingMessage(null);
    req.socket = { remoteAddress: '127.0.0.1', encrypted: false };
    req.method = method;
    req.url = url;
    req.headers = { ...headers };

    if (body !== null) {
      const jsonBody = typeof body === 'string' ? body : JSON.stringify(body);
      req.headers['content-type'] = 'application/json';
      req.headers['content-length'] = Buffer.byteLength(jsonBody);
      req.push(jsonBody);
    }
    req.push(null);

    let statusCode = 200;
    const responseHeaders = {};
    let responseData = '';

    const res = {
      setHeader(name, val) {
        responseHeaders[name.toLowerCase()] = val;
      },
      writeHead(code, hdrs) {
        statusCode = code;
        if (hdrs) {
          for (const k of Object.keys(hdrs)) {
            responseHeaders[k.toLowerCase()] = hdrs[k];
          }
        }
      },
      end(chunk) {
        if (chunk) responseData += chunk.toString();
        let json = null;
        try {
          json = JSON.parse(responseData);
        } catch (e) {
          json = null;
        }
        resolve({
          status: statusCode,
          headers: responseHeaders,
          text: responseData,
          json
        });
      },
      headersSent: false
    };

    handler(req, res, parsedUrl).catch((err) => {
      resolve({
        status: 500,
        headers: responseHeaders,
        text: err.message,
        json: { ok: false, error: err.message }
      });
    });
  });
}

test('Social Auth & 1-Click Login Suite (Google & Facebook)', async (t) => {
  const testGoogleEmail = 'google_learner_test@gmail.com';
  const testFbEmail = 'fb_learner_test@facebook.user';

  t.after(() => {
    // Cleanup test users from memory store
    const list = accounts.users();
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].email && (list[i].email.includes('_learner_test@') || list[i].email.includes('quick_test@'))) {
        list.splice(i, 1);
      }
    }
  });

  await t.test('1. accounts.findOrCreateSocialUser registers new Google user with +50 EXP and trial', () => {
    const { user, isNew } = accounts.findOrCreateSocialUser({
      email: testGoogleEmail,
      name: 'Google Learner Test',
      provider: 'google',
      providerId: 'google_sub_12345',
      avatar: 'https://lh3.googleusercontent.com/test_avatar.jpg'
    });

    assert.equal(isNew, true);
    assert.ok(user);
    assert.equal(user.email, testGoogleEmail);
    assert.equal(user.authProvider, 'google');
    assert.equal(user.providerId, 'google_sub_12345');
    assert.equal(user.avatar, 'https://lh3.googleusercontent.com/test_avatar.jpg');
    assert.equal(user.role, 'student');
    assert.equal(user.progress.exp, 50); // Welcome bonus!
    assert.equal(user.passwordHash, null); // No manual password required
  });

  await t.test('2. accounts.findOrCreateSocialUser logs in existing user seamlessly', () => {
    const { user, isNew } = accounts.findOrCreateSocialUser({
      email: testGoogleEmail,
      name: 'Google Learner Test Updated',
      provider: 'google',
      providerId: 'google_sub_12345'
    });

    assert.equal(isNew, false);
    assert.equal(user.email, testGoogleEmail);
  });

  await t.test('3. accounts.findOrCreateSocialUser grants Super Admin role to hoangpham1618@gmail.com', () => {
    const { user } = accounts.findOrCreateSocialUser({
      email: 'hoangpham1618@gmail.com',
      name: 'Hoàng Phạm',
      provider: 'google',
      providerId: 'google_sub_admin'
    });

    assert.equal(user.role, 'admin');
    assert.equal(user.email, 'hoangpham1618@gmail.com');
  });

  await t.test('4. GET /api/auth/oauth-config returns oauth availability info', async () => {
    const res = await makeRequest(handleApi, { method: 'GET', url: '/api/auth/oauth-config' });
    assert.equal(res.status, 200);
    assert.equal(res.json.ok, true);
    assert.equal(typeof res.json.googleEnabled, 'boolean');
    assert.equal(typeof res.json.facebookEnabled, 'boolean');
  });

  await t.test('5. POST /api/auth/social-quick creates session and logs in user in 1 click', async () => {
    const res = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/auth/social-quick',
      body: {
        provider: 'google',
        email: 'quick_test_student@gmail.com',
        name: 'Trần Văn Quick',
        avatar: 'https://images.unsplash.com/avatar'
      }
    });

    assert.equal(res.status, 200);
    assert.equal(res.json.ok, true);
    assert.equal(res.json.user.email, 'quick_test_student@gmail.com');
    assert.equal(res.json.user.name, 'Trần Văn Quick');
    assert.equal(res.json.user.authProvider, 'google');
    assert.match(res.json.message, /Chào mừng/);
    assert.ok(res.headers['set-cookie']);
    assert.match(res.headers['set-cookie'], /yh_session=/);
  });

  await t.test('6. POST /api/auth/social-quick validates email and provider', async () => {
    // Invalid provider
    const badProvider = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/auth/social-quick',
      body: { provider: 'twitter', email: 'test@gmail.com' }
    });
    assert.equal(badProvider.status, 400);

    // Invalid email format
    const badEmail = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/auth/social-quick',
      body: { provider: 'google', email: 'notanemail' }
    });
    assert.equal(badEmail.status, 400);
    assert.match(badEmail.json.error, /email/i);
  });

  await t.test('7. Markup verification: Google & Facebook buttons and quick modal in index.html', () => {
    const html = fs.readFileSync(path.join(ROOT, 'public/index.html'), 'utf8');
    assert.match(html, /handleSocialAuth\('google'\)/);
    assert.match(html, /handleSocialAuth\('facebook'\)/);
    assert.match(html, /id="socialAuthQuickModal"/);
    assert.match(html, /id="socialQuickModalIcon"/);
    assert.match(html, /id="socialQuickAccountsList"/);
  });
});
