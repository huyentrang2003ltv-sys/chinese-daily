'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const http = require('http');

const accounts = require('../server/accounts');
const { handleApi } = require('../server/api');

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
      }
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

test('Dual Admin Account Architecture (hoangpham1618 & huyentrang2003ltv)', async (t) => {

  await t.test('1. accounts.isSystemAdminEmail recognizes both administrator accounts', () => {
    assert.equal(typeof accounts.isSystemAdminEmail, 'function');
    assert.equal(accounts.isSystemAdminEmail('hoangpham1618@gmail.com'), true);
    assert.equal(accounts.isSystemAdminEmail('HOANGPHAM1618@GMAIL.COM'), true);
    assert.equal(accounts.isSystemAdminEmail(' huyentrang2003ltv@gmail.com '), true);
    assert.equal(accounts.isSystemAdminEmail('HUYENTRANG2003LTV@GMAIL.COM'), true);
    assert.equal(accounts.isSystemAdminEmail('student@example.com'), false);
    assert.equal(accounts.isSystemAdminEmail(null), false);
  });

  await t.test('2. huyentrang2003ltv@gmail.com is fully upgraded to Admin, Lifetime VIP and unlocked in store', () => {
    const user = accounts.findByEmail('huyentrang2003ltv@gmail.com');
    assert.ok(user, 'User huyentrang2003ltv@gmail.com must exist in users database');
    assert.equal(user.role, 'admin', 'Role must be admin');
    assert.equal(user.vipTier, 'lifetime', 'vipTier must be lifetime');
    assert.equal(user.isLocked, false, 'Account must not be locked');
    assert.equal(user.lockReason, null);

    const pub = accounts.publicUser(user);
    assert.equal(pub.role, 'admin');
    assert.equal(pub.vipInfo.isVip, true);
    assert.equal(pub.vipInfo.label, '👑 VIP Trọn Đời');
    assert.equal(pub.isLocked, false);
  });

  await t.test('3. checkInactivityLock never locks huyentrang2003ltv@gmail.com', () => {
    const user = accounts.findByEmail('huyentrang2003ltv@gmail.com');
    const oldActive = user.lastActiveAt;
    user.lastActiveAt = '2020-01-01T00:00:00.000Z'; // ancient date
    const locked = accounts.checkInactivityLock(user);
    assert.equal(locked, false, 'Admin must never be locked due to inactivity');
    assert.equal(user.isLocked, false);
    user.lastActiveAt = oldActive;
  });

  await t.test('4. accounts.findOrCreateSocialUser maintains admin status for huyentrang2003ltv@gmail.com', () => {
    const { user, isNew } = accounts.findOrCreateSocialUser({
      provider: 'google',
      email: 'huyentrang2003ltv@gmail.com',
      name: 'Huyền Trang',
      avatar: 'https://example.com/avatar.jpg'
    });
    assert.equal(user.role, 'admin');
    assert.equal(user.vipTier, 'lifetime');
    assert.equal(user.isLocked, false);
  });

  await t.test('5. POST /api/auth/social-quick creates valid admin session for huyentrang2003ltv@gmail.com', async () => {
    const res = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/auth/social-quick',
      body: {
        provider: 'google',
        email: 'huyentrang2003ltv@gmail.com',
        name: 'Huyền Trang'
      }
    });

    assert.equal(res.status, 200);
    assert.equal(res.json.ok, true);
    assert.equal(res.json.user.role, 'admin');
    assert.equal(res.json.user.email, 'huyentrang2003ltv@gmail.com');
    assert.ok(res.headers['set-cookie'], 'Must issue signed session cookie');
  });

  await t.test('6. huyentrang2003ltv@gmail.com has full access to /api/admin/users', async () => {
    const adminUser = accounts.findByEmail('huyentrang2003ltv@gmail.com');
    const token = accounts.createSessionToken(adminUser);

    const res = await makeRequest(handleApi, {
      method: 'GET',
      url: '/api/admin/users',
      headers: {
        cookie: `yh_session=${token}`
      }
    });

    assert.equal(res.status, 200);
    assert.equal(res.json.ok, true);
    assert.ok(Array.isArray(res.json.users));
    assert.ok(res.json.users.length > 0);
  });

  await t.test('7. Leaderboard excludes huyentrang2003ltv@gmail.com', async () => {
    const res = await makeRequest(handleApi, {
      method: 'GET',
      url: '/api/leaderboard'
    });

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.json.top));
    const inLeaderboard = res.json.top.some(u => u.name === 'trang' || u.email === 'huyentrang2003ltv@gmail.com');
    assert.equal(inLeaderboard, false, 'Admin must not appear in student leaderboard');
  });

  await t.test('8. Client integration: quick modal has 1-click button for huyentrang2003ltv@gmail.com', () => {
    const accountJs = fs.readFileSync(path.join(__dirname, '../public/js/core/account.js'), 'utf8');
    assert.ok(accountJs.includes('huyentrang2003ltv@gmail.com'), 'account.js must include huyentrang2003ltv@gmail.com');
    assert.ok(accountJs.includes('Huyền Trang'), 'account.js must include Huyền Trang');

    const adminPortalJs = fs.readFileSync(path.join(__dirname, '../public/js/features/admin_portal.js'), 'utf8');
    assert.ok(adminPortalJs.includes('huyentrang2003ltv@gmail.com'), 'admin_portal.js must reference huyentrang2003ltv@gmail.com');
  });

});
