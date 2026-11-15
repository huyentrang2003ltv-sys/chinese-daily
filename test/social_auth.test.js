'use strict';

// Sign in with Google: full redirect flow against a fake Google token endpoint.
// Runs on a throwaway STORAGE_DIR so it never touches real accounts.
const os = require('os');
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');

const STORAGE = fs.mkdtempSync(path.join(os.tmpdir(), 'yh-oauth-'));
Object.assign(process.env, {
  NODE_ENV: 'test',
  STORAGE_DIR: STORAGE,
  GOOGLE_CLIENT_ID: 'test-client.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: 'test-secret',
  GOOGLE_CALLBACK_URL: 'https://hoc.example/api/auth/google/callback',
  ADMIN_EMAILS: 'boss@example.com'
});

const test = require('node:test');
const assert = require('node:assert/strict');
const config = require('../server/config');
const accounts = require('../server/accounts');
const { handleApi } = require('../server/api');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function call({ method = 'GET', url, cookie, body, ip = '198.51.100.7' }) {
  return new Promise(resolve => {
    const req = new http.IncomingMessage(null);
    req.socket = { remoteAddress: ip, encrypted: false };
    req.method = method;
    req.url = url;
    req.headers = cookie ? { cookie } : {};
    if (body) {
      const json = JSON.stringify(body);
      req.headers['content-type'] = 'application/json';
      req.headers['content-length'] = Buffer.byteLength(json);
      req.push(json);
    }
    req.push(null);

    const res = {
      headersSent: false,
      status: 200,
      headers: {},
      writeHead(status, headers = {}) {
        this.status = status;
        for (const [k, v] of Object.entries(headers)) this.headers[k.toLowerCase()] = v;
      },
      end(chunk) {
        const text = chunk ? chunk.toString() : '';
        let json = null;
        try { json = JSON.parse(text); } catch (e) { /* redirect */ }
        resolve({ status: this.status, headers: this.headers, json });
      }
    };
    handleApi(req, res, new URL(url, 'http://localhost')).catch(err => resolve({ status: 500, error: err }));
  });
}

const setCookies = res => [].concat(res.headers['set-cookie'] || []);
const cookieValue = (res, name) => {
  const line = setCookies(res).find(c => c.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).split(';')[0] : null;
};

// Fake Google token endpoint: checks PKCE like Google does, returns an ID token with `claims`.
const fakeGoogle = { claims: null, lastRequest: null, challenge: null, status: 200 };
const tokenServer = http.createServer((req, res) => {
  let raw = '';
  req.on('data', c => { raw += c; });
  req.on('end', () => {
    const form = new URLSearchParams(raw);
    fakeGoogle.lastRequest = Object.fromEntries(form);
    const verifierOk = fakeGoogle.challenge ===
      crypto.createHash('sha256').update(form.get('code_verifier') || '').digest('base64url');
    if (fakeGoogle.status !== 200 || !verifierOk) {
      res.writeHead(fakeGoogle.status !== 200 ? fakeGoogle.status : 400, { 'Content-Type': 'application/json', Connection: 'close' });
      res.end(JSON.stringify({ error: 'invalid_grant' }));
      return;
    }
    const enc = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');
    res.writeHead(200, { 'Content-Type': 'application/json', Connection: 'close' });
    res.end(JSON.stringify({ access_token: 'at', id_token: `${enc({ alg: 'RS256' })}.${enc(fakeGoogle.claims)}.sig` }));
  });
});

/**
 * Run the whole redirect flow. `claims` override the ID token; `tweak` can alter the
 * callback request (drop the cookie, change state, ...). Returns the callback response.
 */
async function googleSignIn({ claims = {}, next = 'home', tweak = r => r } = {}) {
  const start = await call({ url: `/api/auth/google?next=${encodeURIComponent(next)}` });
  assert.equal(start.status, 302);
  const location = new URL(start.headers.location);
  const params = location.searchParams;
  fakeGoogle.challenge = params.get('code_challenge');
  fakeGoogle.claims = {
    iss: 'https://accounts.google.com',
    aud: config.GOOGLE_CLIENT_ID,
    sub: 'google-sub-1',
    email: 'learner@gmail.com',
    email_verified: true,
    name: 'Người Học',
    picture: 'https://lh3.googleusercontent.com/a/photo',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    nonce: params.get('nonce'),
    ...claims
  };
  const request = tweak({
    url: `/api/auth/google/callback?code=auth-code&state=${params.get('state')}`,
    cookie: `yh_oauth=${cookieValue(start, 'yh_oauth')}`
  });
  return { start, params, callback: await call(request) };
}

const resultCode = res => new URL(res.headers.location, 'http://x').hash.split('oauth=')[1];

async function me(sessionToken) {
  const res = await call({ url: '/api/auth/me', cookie: sessionToken ? `yh_session=${sessionToken}` : undefined });
  return res.json.user;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
test('Sign in with Google (OAuth code flow + PKCE)', async t => {
  await new Promise(resolve => tokenServer.listen(0, '127.0.0.1', resolve));
  process.env.GOOGLE_TOKEN_URL = `http://127.0.0.1:${tokenServer.address().port}/token`;
  t.after(() => {
    tokenServer.closeAllConnections();
    tokenServer.close();
    accounts.flushUsers();
    try { fs.rmSync(STORAGE, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch (_) {}
  });

  await t.test('start redirects to Google with state, nonce and an S256 PKCE challenge', async () => {
    const start = await call({ url: '/api/auth/google?next=dictionary' });
    assert.equal(start.status, 302);
    const loc = new URL(start.headers.location);
    assert.equal(loc.origin + loc.pathname, 'https://accounts.google.com/o/oauth2/v2/auth');
    const p = loc.searchParams;
    assert.equal(p.get('client_id'), config.GOOGLE_CLIENT_ID);
    assert.equal(p.get('redirect_uri'), config.GOOGLE_CALLBACK_URL);
    assert.equal(p.get('response_type'), 'code');
    assert.equal(p.get('scope'), 'openid email profile');
    assert.equal(p.get('code_challenge_method'), 'S256');
    assert.match(p.get('code_challenge'), /^[\w-]{43}$/);
    assert.ok(p.get('state').length >= 20 && p.get('nonce').length >= 20);

    const flow = setCookies(start).find(c => c.startsWith('yh_oauth='));
    assert.match(flow, /HttpOnly/);
    assert.match(flow, /SameSite=Lax/);
    assert.match(flow, /Path=\/api\/auth\/google/);
    assert.match(flow, /Max-Age=600/);
  });

  await t.test('first sign-in creates a student account and a working session', async () => {
    const { params, callback } = await googleSignIn({ next: 'dictionary' });
    assert.equal(callback.status, 302);
    assert.equal(callback.headers.location, '/#/dictionary?oauth=welcome');
    assert.equal(fakeGoogle.lastRequest.code, 'auth-code');
    assert.equal(fakeGoogle.lastRequest.redirect_uri, config.GOOGLE_CALLBACK_URL);
    assert.ok(fakeGoogle.lastRequest.code_verifier, 'PKCE verifier sent to Google');
    assert.equal(params.get('code_verifier'), null, 'verifier never leaves the server');
    assert.match(setCookies(callback).find(c => c.startsWith('yh_oauth=')), /Max-Age=0/, 'flow cookie cleared');

    const user = await me(cookieValue(callback, 'yh_session'));
    assert.equal(user.email, 'learner@gmail.com');
    assert.equal(user.name, 'Người Học');
    assert.equal(user.role, 'student');
    assert.equal(user.vipInfo.tier, 'trial');
    assert.equal(accounts.findByEmail('learner@gmail.com').googleSub, 'google-sub-1');
  });

  await t.test('signing in again finds the same account by Google sub', async () => {
    const before = accounts.users().length;
    const { callback } = await googleSignIn({ claims: { email: 'renamed@gmail.com' } });
    assert.equal(resultCode(callback), 'success');
    const user = await me(cookieValue(callback, 'yh_session'));
    assert.equal(user.email, 'learner@gmail.com', 'account keyed by sub, email not taken from the token');
    assert.equal(accounts.users().length, before);
  });

  await t.test('missing, forged or mismatched state never signs anyone in', async () => {
    const noCookie = await googleSignIn({ tweak: r => ({ ...r, cookie: undefined }) });
    const wrongState = await googleSignIn({ tweak: r => ({ ...r, url: r.url.replace(/state=[^&]+/, 'state=attacker') }) });
    const forged = await googleSignIn({ tweak: r => ({ ...r, cookie: r.cookie.replace(/.$/, c => (c === 'A' ? 'B' : 'A')) }) });
    for (const { callback } of [noCookie, wrongState, forged]) {
      assert.equal(resultCode(callback), 'expired');
      assert.equal(cookieValue(callback, 'yh_session'), null);
    }
  });

  await t.test('a session cookie cannot be replayed as a flow cookie', async () => {
    const session = accounts.createSessionToken(accounts.findByEmail('learner@gmail.com'));
    const { callback } = await googleSignIn({ tweak: r => ({ ...r, cookie: `yh_oauth=${session}` }) });
    assert.equal(resultCode(callback), 'expired');
  });

  await t.test('user cancelling at Google returns "cancelled"', async () => {
    const { callback } = await googleSignIn({ tweak: r => ({ ...r, url: '/api/auth/google/callback?error=access_denied' }) });
    assert.equal(resultCode(callback), 'cancelled');
  });

  await t.test('unverified Google email is refused and creates nothing', async () => {
    const before = accounts.users().length;
    const { callback } = await googleSignIn({ claims: { sub: 'google-sub-2', email: 'new@gmail.com', email_verified: false } });
    assert.equal(resultCode(callback), 'unverified');
    assert.equal(cookieValue(callback, 'yh_session'), null);
    assert.equal(accounts.users().length, before);
  });

  await t.test('ID tokens for another app, issuer, nonce or already expired are rejected', async () => {
    const bad = [
      { aud: 'someone-else.apps.googleusercontent.com' },
      { iss: 'https://evil.example' },
      { nonce: 'replayed-nonce' },
      { exp: Math.floor(Date.now() / 1000) - 3600 },
      { sub: '' }
    ];
    for (const claims of bad) {
      const { callback } = await googleSignIn({ claims: { sub: 'google-sub-3', email: 'x@gmail.com', ...claims } });
      assert.equal(resultCode(callback), 'failed', JSON.stringify(claims));
      assert.equal(cookieValue(callback, 'yh_session'), null);
    }
    assert.equal(accounts.findByEmail('x@gmail.com'), null);
  });

  await t.test('token endpoint errors fail closed', async () => {
    fakeGoogle.status = 500;
    try {
      const { callback } = await googleSignIn({ claims: { sub: 'google-sub-4' } });
      assert.equal(resultCode(callback), 'failed');
    } finally {
      fakeGoogle.status = 200;
    }
  });

  await t.test('linking a password account drops the unverified password and old sessions', async () => {
    const reg = await call({
      method: 'POST',
      url: '/api/auth/register',
      ip: '198.51.100.20',
      body: { name: 'Pre Registered', email: 'owner@gmail.com', password: 'squatter-pass-1' }
    });
    assert.equal(reg.status, 201);
    const oldSession = cookieValue(reg, 'yh_session');
    assert.ok(await me(oldSession));

    const { callback } = await googleSignIn({ claims: { sub: 'google-sub-owner', email: 'owner@gmail.com' } });
    assert.equal(resultCode(callback), 'linked');
    assert.equal((await me(cookieValue(callback, 'yh_session'))).email, 'owner@gmail.com');
    assert.equal(await me(oldSession), null, 'sessions from before the link are revoked');

    const login = await call({
      method: 'POST',
      url: '/api/auth/login',
      ip: '198.51.100.21',
      body: { email: 'owner@gmail.com', password: 'squatter-pass-1' }
    });
    assert.equal(login.status, 403);
    assert.match(login.json.error, /Google/);
  });

  await t.test('admin-list emails get admin only after Google proves ownership', async () => {
    const reg = await call({
      method: 'POST',
      url: '/api/auth/register',
      ip: '198.51.100.30',
      body: { name: 'Not The Boss', email: 'boss@example.com', password: 'guessing-pass-1' }
    });
    assert.equal(reg.status, 201);
    assert.equal(reg.json.user.role, 'student', 'password sign-up never grants admin');
    accounts.ensureAdminAccounts();
    assert.equal(accounts.findByEmail('boss@example.com').role, 'student', 'unverified account not promoted at startup');

    const { callback } = await googleSignIn({ claims: { sub: 'google-sub-boss', email: 'boss@example.com' } });
    const boss = await me(cookieValue(callback, 'yh_session'));
    assert.equal(boss.role, 'admin');
    assert.equal(boss.vipInfo.tier, 'lifetime');
  });

  await t.test('the old "type an email to sign in" endpoint is gone', async () => {
    const res = await call({ method: 'POST', url: '/api/auth/social-quick', body: { provider: 'google', email: 'boss@example.com' } });
    assert.equal(res.status, 404);
    assert.equal(cookieValue(res, 'yh_session'), null);
  });

  await t.test('return tab is restricted to app tabs', async () => {
    const { callback } = await googleSignIn({ next: '//evil.example/x' });
    assert.match(callback.headers.location, /^\/#\/home\?oauth=/);
  });

  await t.test('reports "unavailable" when Google is not configured', async () => {
    const saved = config.GOOGLE_CLIENT_SECRET;
    config.GOOGLE_CLIENT_SECRET = '';
    try {
      const cfg = await call({ url: '/api/auth/oauth-config' });
      assert.deepEqual(cfg.json, { ok: true, googleEnabled: false });
      const start = await call({ url: '/api/auth/google' });
      assert.equal(start.headers.location, '/#/home?oauth=unavailable');
    } finally {
      config.GOOGLE_CLIENT_SECRET = saved;
    }
  });
});
