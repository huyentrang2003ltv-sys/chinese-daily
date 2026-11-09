'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
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

test('Admin Portal & RBAC Security Suite', async (t) => {
  // Setup test users
  const adminEmail = 'admin_portal_test@hihsk.com';
  const studentEmail = 'student_portal_test@hihsk.com';

  let adminUser = accounts.findByEmail(adminEmail);
  if (!adminUser) {
    adminUser = accounts.createUser({
      name: 'Admin Tester',
      username: 'admintester',
      email: adminEmail,
      password: 'password12345'
    });
  }
  adminUser.role = 'admin';
  adminUser.vipTier = 'lifetime';

  let studentUser = accounts.findByEmail(studentEmail);
  if (!studentUser) {
    studentUser = accounts.createUser({
      name: 'Học Viên Test',
      username: 'studenttester',
      email: studentEmail,
      password: 'password12345'
    });
  }
  studentUser.role = 'student';
  studentUser.progress = { exp: 450, streak: 5 };

  const adminToken = accounts.createSessionToken(adminUser);
  const studentToken = accounts.createSessionToken(studentUser);
  const adminCookie = `${accounts.SESSION_COOKIE}=${adminToken}`;
  const studentCookie = `${accounts.SESSION_COOKIE}=${studentToken}`;

  t.after(() => {
    // Clean up test accounts from memory store
    const list = accounts.users();
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].email && list[i].email.includes('_portal_test@hihsk.com')) {
        list.splice(i, 1);
      }
    }
  });

  await t.test('1. RBAC: Student & Guest are strictly forbidden from /api/admin/*', async () => {
    // Guest (no cookie)
    const guestUsers = await makeRequest(handleApi, { method: 'GET', url: '/api/admin/users' });
    assert.equal(guestUsers.status, 401);

    const guestSetVip = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/admin/set-vip',
      body: { targetEmail: studentEmail, tier: 'yearly' }
    });
    assert.equal(guestSetVip.status, 401);

    // Student (role = student)
    const studentUsers = await makeRequest(handleApi, {
      method: 'GET',
      url: '/api/admin/users',
      headers: { cookie: studentCookie }
    });
    assert.equal(studentUsers.status, 403);
    assert.match(studentUsers.json.error, /quản trị viên/i);

    const studentSetVip = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/admin/set-vip',
      headers: { cookie: studentCookie },
      body: { targetEmail: studentEmail, tier: 'lifetime' }
    });
    assert.equal(studentSetVip.status, 403);
  });

  await t.test('2. Admin: GET /api/admin/users returns user list with exp, streak, and no password hashes', async () => {
    const res = await makeRequest(handleApi, {
      method: 'GET',
      url: '/api/admin/users',
      headers: { cookie: adminCookie }
    });

    assert.equal(res.status, 200);
    assert.equal(res.json.ok, true);
    assert.ok(Array.isArray(res.json.users));
    assert.ok(res.json.count >= 2);

    // No passwordHash leaked
    assert.doesNotMatch(res.text, /passwordHash/);
    assert.doesNotMatch(res.text, /scrypt\$/);

    // Verified fields on student
    const foundStudent = res.json.users.find(u => u.email === studentEmail);
    assert.ok(foundStudent);
    assert.equal(foundStudent.name, 'Học Viên Test');
    assert.equal(foundStudent.exp, 450);
    assert.equal(foundStudent.streak, 5);
  });

  await t.test('3. Admin: POST /api/admin/set-vip updates VIP and clears pending request', async () => {
    // Add fake pending request to student
    studentUser.vipRequest = { tier: 'yearly', at: new Date().toISOString() };

    const res = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/admin/set-vip',
      headers: { cookie: adminCookie },
      body: { targetEmail: studentEmail, tier: 'yearly' }
    });

    assert.equal(res.status, 200);
    assert.equal(res.json.ok, true);
    assert.match(res.json.message, /VIP/i);
    assert.equal(res.json.user.vipInfo.tier, 'yearly');
    assert.equal(res.json.user.vipInfo.isVip, true);
    assert.equal(studentUser.vipRequest, undefined);
  });

  await t.test('4. Admin: POST /api/admin/unlock-user unlocks inactive locked accounts', async () => {
    // Lock student
    studentUser.isLocked = true;
    studentUser.lockReason = 'Tài khoản bị tạm khóa do quá 3 ngày liên tục chưa hoàn thành 10 phút học tập mỗi ngày.';

    const res = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/admin/unlock-user',
      headers: { cookie: adminCookie },
      body: { email: studentEmail }
    });

    assert.equal(res.status, 200);
    assert.equal(res.json.ok, true);
    assert.equal(res.json.user.isLocked, false);
    assert.equal(studentUser.isLocked, false);
  });

  await t.test('5. Admin: POST /api/admin/reset-password updates password and enforces ≥ 8 chars', async () => {
    // Too short password
    const shortRes = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/admin/reset-password',
      headers: { cookie: adminCookie },
      body: { email: studentEmail, newPassword: 'short' }
    });
    assert.equal(shortRes.status, 400);

    // Valid password
    const validRes = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/admin/reset-password',
      headers: { cookie: adminCookie },
      body: { email: studentEmail, newPassword: 'newStrongPassword999' }
    });
    assert.equal(validRes.status, 200);
    assert.equal(validRes.json.ok, true);

    // Verify student can authenticate with new password
    const loginRes = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/auth/login',
      body: { email: studentEmail, password: 'newStrongPassword999' }
    });
    assert.equal(loginRes.status, 200);
  });

  await t.test('6. Broadcast API: GET is public, POST requires admin and persists', async () => {
    // Refresh student cookie after password change
    const freshStudentToken = accounts.createSessionToken(studentUser);
    const freshStudentCookie = `${accounts.SESSION_COOKIE}=${freshStudentToken}`;

    // Public GET
    const getRes = await makeRequest(handleApi, { method: 'GET', url: '/api/system/broadcast' });
    assert.equal(getRes.status, 200);
    assert.equal(getRes.json.ok, true);

    // Student POST fails
    const failPost = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/admin/broadcast',
      headers: { cookie: freshStudentCookie },
      body: { enabled: true, message: 'Hack banner', type: 'promo' }
    });
    assert.equal(failPost.status, 403);

    // Admin POST succeeds
    const adminPost = await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/admin/broadcast',
      headers: { cookie: adminCookie },
      body: { enabled: true, message: '🎉 Chúc mừng kỳ thi HSK sắp tới!', type: 'promo' }
    });
    assert.equal(adminPost.status, 200);
    assert.equal(adminPost.json.broadcast.enabled, true);
    assert.equal(adminPost.json.broadcast.type, 'promo');

    // Subsequent GET returns updated broadcast
    const checkGet = await makeRequest(handleApi, { method: 'GET', url: '/api/system/broadcast' });
    assert.equal(checkGet.json.broadcast.message, '🎉 Chúc mừng kỳ thi HSK sắp tới!');

    // Reset broadcast
    await makeRequest(handleApi, {
      method: 'POST',
      url: '/api/admin/broadcast',
      headers: { cookie: adminCookie },
      body: { enabled: false, message: '', type: 'info' }
    });
  });

  await t.test('7. Client Feature: admin_portal.js compiles and exports all handlers', () => {
    const code = fs.readFileSync(path.join(ROOT, 'public/js/features/admin_portal.js'), 'utf8');

    const sandbox = {
      window: {
        escapeHtml: str => str,
        showToast: () => {},
        apiRequest: async () => ({ ok: true })
      },
      document: {
        readyState: 'complete',
        getElementById: () => null,
        addEventListener: () => {}
      },
      setTimeout: () => {},
      console
    };
    sandbox.globalThis = sandbox.window;

    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);

    // Check exported functions
    assert.equal(typeof sandbox.window.renderAdminPortal, 'function');
    assert.equal(typeof sandbox.window.loadAdminPortalData, 'function');
    assert.equal(typeof sandbox.window.setAdminSubTab, 'function');
    assert.equal(typeof sandbox.window.setAdminFilter, 'function');
    assert.equal(typeof sandbox.window.handleAdminSearch, 'function');
    assert.equal(typeof sandbox.window.adminSetUserVip, 'function');
    assert.equal(typeof sandbox.window.adminUnlockUser, 'function');
    assert.equal(typeof sandbox.window.adminPromptResetPassword, 'function');
    assert.equal(typeof sandbox.window.adminSendTelegramPing, 'function');
    assert.equal(typeof sandbox.window.adminSaveBroadcast, 'function');
    assert.equal(typeof sandbox.window.adminExportUsersJson, 'function');
    assert.equal(typeof sandbox.window.checkAndRenderSiteBroadcast, 'function');
  });

  await t.test('8. Router & HTML Integration: TABS, TAB_ALIASES, header button, section exist', () => {
    const routerCode = fs.readFileSync(path.join(ROOT, 'public/js/core/router.js'), 'utf8');
    assert.match(routerCode, /admin:\s*\{[^}]*label:\s*'Quản trị hệ thống'/);
    assert.match(routerCode, /admin:\s*'admin'/);
    assert.match(routerCode, /'admin-portal':\s*'admin'/);
    assert.match(routerCode, /quantri:\s*'admin'/);

    const html = fs.readFileSync(path.join(ROOT, 'public/index.html'), 'utf8');
    assert.match(html, /<section id="tab-admin"/);
    assert.match(html, /id="adminPortalContainer"/);
    assert.match(html, /id="headerAdminLink"/);
    assert.match(html, /id="siteBroadcastBanner"/);
    assert.match(html, /src="js\/features\/admin_portal\.js"/);
  });
});
