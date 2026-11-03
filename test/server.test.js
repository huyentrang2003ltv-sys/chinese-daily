'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const zlib = require('node:zlib');

const ROOT = path.join(__dirname, '..');
const sha256 = s => crypto.createHash('sha256').update(s).digest('hex');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitFor(fn, timeoutMs = 5000) {
  const start = Date.now();
  for (;;) {
    const value = await fn();
    if (value) return value;
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await sleep(50);
  }
}

async function startServer(storageDir, extraEnv = {}) {
  const port = await freePort();
  const env = {
    ...process.env,
    PORT: String(port),
    HOST: '127.0.0.1',
    STORAGE_DIR: storageDir,
    NODE_ENV: 'test',
    TRUST_PROXY: '1', // lets each helper call use its own fake client IP, so rate limits don't interfere
    SESSION_SECRET: '',
    TELEGRAM_BOT_TOKEN: '',
    TELEGRAM_CHAT_ID: '',
    PAYMENT_BANK_BIN: '',
    PAYMENT_ACCOUNT_NO: '',
    ...extraEnv
  };
  const child = spawn(process.execPath, ['server.js'], { cwd: ROOT, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  child.stdout.on('data', d => { log += d; });
  child.stderr.on('data', d => { log += d; });
  const exited = new Promise(resolve => child.once('exit', resolve));
  const base = `http://127.0.0.1:${port}`;
  await waitFor(async () => {
    if (child.exitCode !== null) throw new Error('server exited early:\n' + log);
    try {
      return (await fetch(base + '/healthz')).ok;
    } catch (e) {
      return false;
    }
  });
  return {
    port,
    base,
    child,
    getLog: () => log,
    async stop(signal) {
      if (child.exitCode === null) child.kill(signal);
      await exited;
    }
  };
}

let ipCounter = 10;
const nextIp = () => `10.1.${Math.floor(ipCounter / 250)}.${ipCounter++ % 250}`;

function cookieFrom(res) {
  const set = res.headers.getSetCookie().find(c => c.startsWith('yh_session='));
  return set ? set.split(';')[0] : null;
}

function api(srv) {
  return async function call(method, url, { body, cookie, ip, headers = {}, raw } = {}) {
    const res = await fetch(srv.base + url, {
      method,
      redirect: 'manual',
      headers: {
        'X-Forwarded-For': ip || nextIp(),
        ...(body !== undefined && raw === undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
        ...headers
      },
      body: raw !== undefined ? raw : body !== undefined ? JSON.stringify(body) : undefined
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch (e) { /* not JSON */ }
    return { status: res.status, headers: res.headers, text, json, cookie: cookieFrom(res), setCookies: res.headers.getSetCookie() };
  };
}

/** Raw HTTP request that sends the path exactly as given (fetch would normalise ".." segments). */
function rawGet(srv, rawPath, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: srv.port, method: 'GET', path: rawPath, headers }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    req.end();
  });
}

function readUsers(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, 'users.json'), 'utf8'));
  } catch (e) {
    return null;
  }
}

function adminCli(storageDir, ...args) {
  return spawnSync(process.execPath, ['scripts/admin.js', ...args], {
    cwd: ROOT,
    env: { ...process.env, STORAGE_DIR: storageDir, NODE_ENV: 'test', SESSION_SECRET: '' },
    encoding: 'utf8'
  });
}

const GOOD = { name: 'Học viên A', email: 'a@example.com', password: 'password123' };

// ---------------------------------------------------------------------------
describe('server', () => {
  let dir;
  let srv;
  let call;
  const state = {};

  before(async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yuhan-test-'));
    fs.writeFileSync(path.join(dir, 'legacy-users.json'), JSON.stringify([
      { id: 'usr-s', name: 'Legacy Student', email: 'Student@Legacy.com', passwordHash: sha256('secret123'), role: 'student', exp: 500, streak: 3, savedWords: [] },
      { id: 'usr-a', name: 'Legacy Admin', email: 'admin@legacy.com', passwordHash: sha256('admin123'), role: 'super_admin', exp: 9999, streak: 1, savedWords: [] }
    ]));
    srv = await startServer(dir);
    call = api(srv);
  });

  after(async () => {
    if (srv) await srv.stop();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  describe('static files', () => {
    it('serves index.html at /', async () => {
      const res = await call('GET', '/');
      assert.equal(res.status, 200);
      assert.match(res.headers.get('content-type'), /text\/html/);
      assert.equal(res.text, fs.readFileSync(path.join(ROOT, 'public', 'index.html'), 'utf8'));
      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      assert.ok(res.headers.get('content-security-policy'));
    });

    for (const p of ['/server.js', '/.env', '/../package.json', '/%2e%2e/package.json', '/data/../../server.js',
      '/..%2fpackage.json', '/..%5cpackage.json', '/..\\package.json', '/server/accounts.js', '/%00', '/nope.html']) {
      it(`returns 404 for ${p}`, async () => {
        const res = await rawGet(srv, p);
        assert.equal(res.status, 404, `${p} -> ${res.status}`);
        assert.doesNotMatch(res.body.toString(), /yuhan-hsk|require\(/);
      });
    }

    it('rejects non-GET methods with 405', async () => {
      assert.equal((await call('POST', '/', { body: {} })).status, 405);
    });

    it('serves brotli when requested', async () => {
      const res = await rawGet(srv, '/', { 'Accept-Encoding': 'br' });
      assert.equal(res.status, 200);
      assert.equal(res.headers['content-encoding'], 'br');
      assert.equal(zlib.brotliDecompressSync(res.body).toString(), fs.readFileSync(path.join(ROOT, 'public', 'index.html'), 'utf8'));
    });

    it('serves gzip when only gzip is accepted', async () => {
      const res = await rawGet(srv, '/', { 'Accept-Encoding': 'gzip' });
      assert.equal(res.headers['content-encoding'], 'gzip');
    });

    it('answers 304 for a matching ETag', async () => {
      const first = await rawGet(srv, '/');
      assert.ok(first.headers.etag);
      const second = await rawGet(srv, '/', { 'If-None-Match': first.headers.etag });
      assert.equal(second.status, 304);
      assert.equal(second.body.length, 0);
    });

    it('serves /healthz', async () => {
      assert.equal((await call('GET', '/healthz')).json.ok, true);
    });
  });

  describe('auth', () => {
    it('rejects invalid registrations with 400', async () => {
      const bad = [
        { ...GOOD, name: '   ' },
        { ...GOOD, email: 'not-an-email' },
        { ...GOOD, email: 'a b@example.com' },
        { ...GOOD, password: 'short' },
        { ...GOOD, password: 'x'.repeat(201) },
        { ...GOOD, password: 12345678 },
        {}
      ];
      for (const body of bad) {
        const res = await call('POST', '/api/auth/register', { body });
        assert.equal(res.status, 400, JSON.stringify(body).slice(0, 80));
        assert.equal(res.json.ok, false);
      }
      const json = { 'Content-Type': 'application/json' };
      assert.equal((await call('POST', '/api/auth/register', { raw: '[]', headers: json })).status, 400);
      assert.equal((await call('POST', '/api/auth/register', { raw: '{oops', headers: json })).status, 400);
    });

    it('registers a user (201) with an HttpOnly SameSite=Lax cookie', async () => {
      const res = await call('POST', '/api/auth/register', { body: { ...GOOD, language: 'vi', profession: 'dev', purpose: 'HSK' } });
      assert.equal(res.status, 201);
      assert.equal(res.json.ok, true);
      assert.equal(res.json.user.email, GOOD.email);
      assert.equal(res.json.user.role, 'student');
      assert.equal(res.json.user.vipInfo.isTrial, true);
      const set = res.setCookies.find(c => c.startsWith('yh_session='));
      assert.match(set, /HttpOnly/i);
      assert.match(set, /SameSite=Lax/i);
      assert.match(set, /Path=\//);
      assert.doesNotMatch(set, /Secure/i);
      state.studentCookie = res.cookie;
    });

    it('marks the cookie Secure behind an HTTPS proxy', async () => {
      const res = await call('POST', '/api/auth/register', {
        body: { ...GOOD, email: 'https@example.com' }, headers: { 'X-Forwarded-Proto': 'https' }
      });
      assert.match(res.setCookies[0], /Secure/);
    });

    it('rejects a duplicate email (409), case-insensitively', async () => {
      const res = await call('POST', '/api/auth/register', { body: { ...GOOD, email: 'A@Example.com' } });
      assert.equal(res.status, 409);
    });

    it('GET /api/auth/me: user with cookie, null without', async () => {
      const anon = await call('GET', '/api/auth/me');
      assert.equal(anon.status, 200);
      assert.equal(anon.json.user, null);
      const me = await call('GET', '/api/auth/me', { cookie: state.studentCookie });
      assert.equal(me.json.user.email, GOOD.email);
      assert.equal(me.json.user.name, GOOD.name);
    });

    it('rejects a wrong password (401) and an unknown email (401, same message)', async () => {
      const wrong = await call('POST', '/api/auth/login', { body: { email: GOOD.email, password: 'nope-nope' } });
      assert.equal(wrong.status, 401);
      assert.equal(wrong.cookie, null);
      const unknown = await call('POST', '/api/auth/login', { body: { email: 'ghost@example.com', password: 'password123' } });
      assert.equal(unknown.status, 401);
      assert.equal(unknown.json.error, wrong.json.error);
    });

    it('logs in with the right password (case-insensitive email)', async () => {
      const res = await call('POST', '/api/auth/login', { body: { email: 'A@EXAMPLE.COM', password: GOOD.password } });
      assert.equal(res.status, 200);
      assert.ok(res.cookie);
      const me = await call('GET', '/api/auth/me', { cookie: res.cookie });
      assert.equal(me.json.user.email, GOOD.email);
    });

    it('logout clears the cookie', async () => {
      const res = await call('POST', '/api/auth/logout', { cookie: state.studentCookie, body: {} });
      assert.equal(res.status, 200);
      const set = res.setCookies.find(c => c.startsWith('yh_session='));
      assert.match(set, /^yh_session=;/);
      assert.match(set, /Max-Age=0/);
    });

    it('treats tampered and malformed cookies as logged out (never 500)', async () => {
      const [payload, sig] = state.studentCookie.slice('yh_session='.length).split('.');
      const secret = fs.readFileSync(path.join(dir, 'session.key'), 'utf8').trim();
      const signed = p => `${p}.${crypto.createHmac('sha256', secret).update(p).digest('base64url')}`;
      const b64 = obj => Buffer.from(typeof obj === 'string' ? obj : JSON.stringify(obj)).toString('base64url');
      const future = Date.now() + 1e9;
      const tokens = [
        `${b64({ uid: 'usr-a', v: 1, exp: future })}.${sig}`,
        `${payload}.${sig.slice(0, -2)}AA`,
        `${payload}.`,
        `.${sig}`,
        payload,
        `${payload}.${sig}.extra`,
        `${payload}.${'é'.repeat(sig.length)}`, // same string length, different byte length
        '....',
        'garbage',
        signed('!!!not-base64!!!'),
        signed(b64('not json')),
        signed(b64('null')),
        signed(b64('"str"')),
        signed(b64({ uid: 'usr-s', v: 1, exp: Date.now() - 1000 })), // expired
        signed(b64({ uid: 'usr-s', v: 999, exp: future })), // stale session version
        signed(b64({ uid: 'usr-s', v: 1, exp: 'never' }))
      ];
      for (const t of tokens) {
        const res = await call('GET', '/api/auth/me', { cookie: 'yh_session=' + encodeURIComponent(t) });
        assert.equal(res.status, 200, `token ${t.slice(0, 40)}`);
        assert.equal(res.json.user, null, `token ${t.slice(0, 40)}`);
      }
      // Sanity check of the forging helper: a correctly signed token for a real user is accepted.
      const ok = signed(b64({ uid: 'usr-s', v: 1, exp: future }));
      const res = await call('GET', '/api/auth/me', { cookie: 'yh_session=' + ok });
      assert.equal(res.json.user && res.json.user.email, 'student@legacy.com');
    });

    it('survives a malformed Cookie header', async () => {
      const res = await call('GET', '/api/auth/me', { cookie: 'yh_session=%E0%A4%A; ;=x; foo' });
      assert.equal(res.status, 200);
      assert.equal(res.json.user, null);
    });

    it('stores scrypt hashes and never returns them', async () => {
      const users = await waitFor(() => {
        const u = readUsers(dir);
        return u && u.find(x => x.email === GOOD.email) && u;
      });
      const stored = users.find(x => x.email === GOOD.email);
      assert.match(stored.passwordHash, /^scrypt\$/);
      assert.ok(!stored.passwordHash.includes(GOOD.password));

      const hashes = users.map(u => u.passwordHash).filter(Boolean);
      const login = await call('POST', '/api/auth/login', { body: { email: GOOD.email, password: GOOD.password } });
      const outputs = [
        login.text,
        (await call('GET', '/api/auth/me', { cookie: login.cookie })).text,
        (await call('GET', '/api/leaderboard')).text,
        (await call('GET', '/api/visitors')).text
      ];
      for (const text of outputs) {
        assert.doesNotMatch(text, /scrypt\$|passwordHash/);
        for (const h of hashes) assert.ok(!text.includes(h));
      }
    });
  });

  describe('legacy import', () => {
    it('lets a legacy student in with the old password and upgrades the hash to scrypt', async () => {
      const res = await call('POST', '/api/auth/login', { body: { email: 'student@legacy.com', password: 'secret123' } });
      assert.equal(res.status, 200);
      assert.equal(res.json.user.role, 'student');
      assert.equal(res.json.user.progress.exp, 500);

      const users = await waitFor(() => {
        const u = readUsers(dir);
        return u && u.find(x => x.email === 'student@legacy.com' && x.passwordHash.startsWith('scrypt$')) && u;
      });
      assert.match(users.find(x => x.email === 'student@legacy.com').passwordHash, /^scrypt\$/);

      assert.equal((await call('POST', '/api/auth/login', { body: { email: 'student@legacy.com', password: 'secret123' } })).status, 200);
      assert.equal((await call('POST', '/api/auth/login', { body: { email: 'student@legacy.com', password: 'secret124' } })).status, 401);
    });

    it('refuses the legacy default admin123 account with 403 until reset', async () => {
      const res = await call('POST', '/api/auth/login', { body: { email: 'admin@legacy.com', password: 'admin123' } });
      assert.equal(res.status, 403);
      assert.equal(res.cookie, null);
      assert.equal((await call('POST', '/api/auth/login', { body: { email: 'admin@legacy.com', password: 'other-pass' } })).status, 403);
    });

    it('verifyPassword fails cleanly (no throw) on malformed stored hashes', () => {
      const script = `
        const a = require('./server/accounts');
        const bad = ['scrypt$', 'scrypt$x$y$z', 'scrypt$16384$$', 'scrypt$16384$AAAA$', 'scrypt$0$AAAA$AAAA',
          'scrypt$3$AAAA$AAAAAAAAAAAAAAAAAAAAAAAA', 'scrypt$1073741824$AAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          'scrypt$16384$AAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA$extra', 'zzz', '', null, undefined, 42, {}];
        for (const s of bad) {
          const r = a.verifyPassword('whatever', s);
          if (r !== 'fail') { console.log('BAD ' + JSON.stringify(s) + ' -> ' + r); process.exit(1); }
        }
        const good = a.DUMMY_HASH;
        if (a.verifyPassword('dummy-password-for-timing', good) !== 'ok') process.exit(2);
        console.log('fine');`;
      const res = spawnSync(process.execPath, ['-e', script], {
        cwd: ROOT, encoding: 'utf8',
        env: { ...process.env, STORAGE_DIR: fs.mkdtempSync(path.join(os.tmpdir(), 'yuhan-unit-')), NODE_ENV: 'test' }
      });
      assert.equal(res.status, 0, res.stdout + res.stderr);
      assert.match(res.stdout, /fine/);
    });
  });

  describe('content-type, size, methods', () => {
    it('rejects non-JSON POST bodies with 415', async () => {
      const text = await call('POST', '/api/auth/login', {
        raw: JSON.stringify({ email: GOOD.email, password: GOOD.password }), headers: { 'Content-Type': 'text/plain' }
      });
      assert.equal(text.status, 415);
      const form = await call('POST', '/api/visitors/ping', { raw: 'cid=abcdefgh', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      assert.equal(form.status, 415);
      assert.equal((await call('POST', '/api/visitors/ping', { raw: '{}', headers: { 'Content-Type': '' } })).status, 415);
    });

    it('rejects an oversized body with 413 and still delivers the response', async () => {
      const res = await call('POST', '/api/auth/login', { body: { email: 'x@example.com', password: 'p'.repeat(20 * 1024) } });
      assert.equal(res.status, 413);
      assert.equal(res.json.ok, false);
    });

    it('rejects an oversized chunked body with 413', async () => {
      const status = await new Promise((resolve, reject) => {
        const req = http.request({
          host: '127.0.0.1', port: srv.port, method: 'POST', path: '/api/auth/login',
          headers: { 'Content-Type': 'application/json', 'Transfer-Encoding': 'chunked' }
        }, res => {
          res.resume();
          res.on('end', () => resolve(res.statusCode));
        });
        req.on('error', reject);
        req.write('{"email":"x@example.com","password":"' + 'p'.repeat(10 * 1024));
        req.write('p'.repeat(10 * 1024));
        setTimeout(() => req.end('"}'), 100);
      });
      assert.equal(status, 413);
    });

    it('stays healthy after oversized requests', async () => {
      assert.equal((await call('GET', '/healthz')).status, 200);
    });

    it('unknown /api path -> 404 JSON, wrong method -> 405 JSON', async () => {
      const missing = await call('GET', '/api/x');
      assert.equal(missing.status, 404);
      assert.equal(missing.json.ok, false);
      assert.equal((await call('GET', '/api/__proto__')).status, 404);
      const wrong = await call('GET', '/api/auth/login');
      assert.equal(wrong.status, 405);
      assert.equal(wrong.json.ok, false);
      assert.equal((await call('DELETE', '/api/auth/me')).status, 405);
    });
  });

  describe('progress & leaderboard', () => {
    it('requires login for PUT /api/me/progress', async () => {
      assert.equal((await call('PUT', '/api/me/progress', { body: { exp: 5 } })).status, 401);
    });

    it('sanitizes, persists and returns progress', async () => {
      const reg = await call('POST', '/api/auth/register', { body: { name: 'Progress P', email: 'p@example.com', password: 'password123' } });
      const cookie = reg.cookie;
      const put = await call('PUT', '/api/me/progress', {
        cookie,
        body: {
          exp: 123.9, streak: -5, lastStudyDate: 'yesterday', dailyGoal: 0,
          savedWords: [
            { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'xin chào', hsk: 99, extra: '<script>' },
            null, 'x', { hanzi: 5 }, { pinyin: 'no hanzi' },
            { hanzi: 'x'.repeat(100), meaning: 'm'.repeat(1000) }
          ],
          activity: { '2026-01-01': 3 }, srs: [1, 2], lastLesson: 'not an object', evil: 'dropped'
        }
      });
      assert.equal(put.status, 200);
      const prog = (await call('GET', '/api/auth/me', { cookie })).json.user.progress;
      assert.equal(prog.exp, 123);
      assert.equal(prog.streak, 0);
      assert.equal(prog.lastStudyDate, undefined);
      assert.equal(prog.savedWords.length, 2);
      assert.deepEqual(prog.savedWords[0], { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'xin chào', hsk: 9 });
      assert.equal(prog.savedWords[1].hanzi.length, 40);
      assert.equal(prog.savedWords[1].meaning.length, 400);
      assert.deepEqual(prog.activity, { '2026-01-01': 3 });
      assert.equal(prog.lastLesson, undefined);
      assert.equal(prog.evil, undefined);

      const stored = await waitFor(() => {
        const u = readUsers(dir);
        const rec = u && u.find(x => x.email === 'p@example.com');
        return rec && rec.progress.exp === 123 && rec;
      });
      assert.equal(stored.progress.exp, 123);

      assert.equal((await call('PUT', '/api/me/progress', { cookie, body: { exp: 1e15, streak: 1e15 } })).status, 200);
      const capped = (await call('GET', '/api/auth/me', { cookie })).json.user.progress;
      assert.equal(capped.exp, 10_000_000);
      assert.equal(capped.streak, 100_000);
    });

    it('keeps (sanitized) progress sent at registration', async () => {
      const reg = await call('POST', '/api/auth/register', {
        body: { name: 'Early Bird', email: 'early@example.com', password: 'password123', progress: { exp: 42, streak: 2, savedWords: [] } }
      });
      assert.equal(reg.json.user.progress.exp, 42);
    });

    it('leaderboard excludes admins and never leaks emails', async () => {
      const res = await call('GET', '/api/leaderboard');
      assert.equal(res.status, 200);
      assert.match(res.headers.get('cache-control'), /max-age/);
      const names = res.json.top.map(t => t.name);
      assert.ok(names.includes('Legacy Student'));
      assert.ok(!names.includes('Legacy Admin'));
      assert.ok(res.json.top.length <= 5);
      assert.doesNotMatch(res.text, /@|email|passwordHash|usr[-_]/);
      for (let i = 1; i < res.json.top.length; i++) assert.ok(res.json.top[i - 1].exp >= res.json.top[i].exp);
      assert.deepEqual(Object.keys(res.json.top[0]).sort(), ['exp', 'name', 'streak']);
    });
  });

  describe('visitors', () => {
    it('counts each cid once per day and ignores invalid cids', async () => {
      const before = (await call('GET', '/api/visitors')).json;
      const cid = 'cid-' + crypto.randomBytes(8).toString('hex');
      const first = await call('POST', '/api/visitors/ping', { body: { cid } });
      assert.equal(first.json.today, before.today + 1);
      assert.equal(first.json.total, before.total + 1);
      const second = await call('POST', '/api/visitors/ping', { body: { cid } });
      assert.equal(second.json.today, before.today + 1);
      assert.equal(second.json.total, before.total + 1);
      const other = await call('POST', '/api/visitors/ping', { body: { cid: 'cid-' + crypto.randomBytes(8).toString('hex') } });
      assert.equal(other.json.today, before.today + 2);

      for (const bad of ['', 'short', 'has spaces here!', '<script>alert(1)</script>', 123, null]) {
        const res = await call('POST', '/api/visitors/ping', { body: { cid: bad } });
        assert.equal(res.status, 200);
        assert.equal(res.json.today, before.today + 2, `cid ${JSON.stringify(bad)}`);
      }
      const stats = (await call('GET', '/api/visitors')).json;
      assert.equal(stats.total, before.total + 2);
      assert.ok(stats.online >= 2);
      assert.ok(stats.peak >= stats.online);
    });
  });

  describe('tts', () => {
    it('rejects empty text (400) and text over 1000 chars (413)', async () => {
      assert.equal((await call('GET', '/api/tts')).status, 400);
      assert.equal((await call('GET', '/api/tts?text=%20%20')).status, 400);
      assert.equal((await call('GET', '/api/tts?text=' + 'a'.repeat(1001))).status, 413);
    });
    it('rejects other methods with 405', async () => {
      assert.equal((await call('POST', '/api/tts', { body: { text: 'a' } })).status, 405);
    });
  });

  describe('feedback, ai-chat, vip request validation', () => {
    it('validates empty messages', async () => {
      assert.equal((await call('POST', '/api/ai-chat', { body: { message: '   ' } })).status, 400);
      assert.equal((await call('POST', '/api/ai-chat', { body: {} })).status, 400);
      assert.equal((await call('POST', '/api/feedback', { body: { message: '' } })).status, 400);
    });
    it('vip upgrade request needs login', async () => {
      assert.equal((await call('POST', '/api/vip/upgrade-request', { body: { packageTier: 'yearly' } })).status, 401);
    });
    it('vip upgrade request ignores prototype-key tiers', async () => {
      const reg = await call('POST', '/api/auth/register', { body: { name: 'Vip V', email: 'vipreq@example.com', password: 'password123' } });
      const res = await call('POST', '/api/vip/upgrade-request', { cookie: reg.cookie, body: { packageTier: 'toString', txNote: 'hi' } });
      assert.equal(res.status, 200);
      const users = await waitFor(() => {
        const u = readUsers(dir);
        const rec = u && u.find(x => x.email === 'vipreq@example.com');
        return rec && rec.vipRequest && u;
      });
      assert.equal(users.find(x => x.email === 'vipreq@example.com').vipRequest.tier, 'yearly');
    });
  });

  describe('payment info', () => {
    it('is public and reports unconfigured by default', async () => {
      const res = await call('GET', '/api/payment-info');
      assert.equal(res.status, 200);
      assert.equal(res.json.configured, false);
      assert.deepEqual([res.json.bankBin, res.json.bankName, res.json.accountNo, res.json.accountName], ['', '', '', '']);
      assert.deepEqual(res.json.prices, { monthly: 99000, yearly: 499000, lifetime: 899000 });
      assert.equal(res.headers.get('cache-control'), 'public, max-age=300');
    });
  });

  describe('shutdown', () => {
    it('flushes pending stores on SIGTERM', { skip: process.platform === 'win32' && 'POSIX signals only' }, async () => {
      const d = fs.mkdtempSync(path.join(os.tmpdir(), 'yuhan-flush-'));
      const s = await startServer(d);
      try {
        await api(s)('POST', '/api/visitors/ping', { body: { cid: 'flush-test-cid-1' } });
        await s.stop('SIGTERM'); // the visitor store delays writes by 5 s, so only the shutdown hook can have written it
        assert.equal(JSON.parse(fs.readFileSync(path.join(d, 'visitors.json'), 'utf8')).total, 1);
      } finally {
        await s.stop();
        fs.rmSync(d, { recursive: true, force: true });
      }
    });
  });

  // Own IPs and emails, so these cannot disturb other tests.
  describe('rate limiting', () => {
    it('returns 429 on the 11th failed login from one IP', async () => {
      const ip = '203.0.113.77';
      for (let i = 1; i <= 10; i++) {
        const res = await call('POST', '/api/auth/login', { ip, body: { email: `victim${i}@example.com`, password: 'wrong-password' } });
        assert.equal(res.status, 401, `attempt ${i}`);
      }
      const res = await call('POST', '/api/auth/login', { ip, body: { email: 'victim11@example.com', password: 'wrong-password' } });
      assert.equal(res.status, 429);
    });

    it('limits per email across different IPs (looser than per IP)', async () => {
      const email = 'target@example.com';
      for (let i = 1; i <= 30; i++) {
        assert.equal((await call('POST', '/api/auth/login', { body: { email, password: 'wrong-password' } })).status, 401);
      }
      assert.equal((await call('POST', '/api/auth/login', { body: { email, password: 'wrong-password' } })).status, 429);
    });

    it('limits registrations per IP', async () => {
      const ip = '203.0.113.88';
      let last;
      for (let i = 0; i < 6; i++) last = await call('POST', '/api/auth/register', { ip, body: { name: '', email: 'x', password: '' } });
      assert.equal(last.status, 429);
    });
  });

  // Admin rights only come from the CLI and accounts are cached in server memory,
  // so: register, stop the server, `admin.js grant`, then start a fresh instance on the same storage.
  describe('authorization', () => {
    let srv2;
    let call2;
    let adminCookie;
    let studentCookie;

    before(async () => {
      const boss = await call('POST', '/api/auth/register', { body: { name: 'Boss', email: 'boss@example.com', password: 'bosspass123' } });
      const stud = await call('POST', '/api/auth/register', { body: { name: 'Stud', email: 'stud@example.com', password: 'studpass123' } });
      studentCookie = stud.cookie;
      await waitFor(() => {
        const u = readUsers(dir);
        return u && u.some(x => x.email === 'boss@example.com') && u.some(x => x.email === 'stud@example.com');
      });
      await sleep(400); // let any in-flight write settle before the process is stopped
      await srv.stop();
      srv = null;

      const list = adminCli(dir, 'list');
      assert.equal(list.status, 0, list.stderr);
      assert.match(list.stdout, /boss@example\.com/);
      assert.match(list.stdout, /CẦN ĐẶT MẬT KHẨU/);

      assert.notEqual(adminCli(dir, 'grant', 'nobody@example.com').status, 0);
      const grant = adminCli(dir, 'grant', 'boss@example.com');
      assert.equal(grant.status, 0, grant.stderr);
      assert.match(grant.stdout, /admin/);

      srv2 = await startServer(dir, {
        PAYMENT_BANK_BIN: '970422', PAYMENT_BANK_NAME: 'MB Bank', PAYMENT_ACCOUNT_NO: '0123456789', PAYMENT_ACCOUNT_NAME: 'NGUYEN VAN A'
      });
      call2 = api(srv2);
      adminCookie = boss.cookie; // still valid: the signing key persists in STORAGE_DIR
    });

    after(async () => {
      if (srv2) await srv2.stop();
    });

    it('persisted accounts and sessions survive the restart', async () => {
      const me = await call2('GET', '/api/auth/me', { cookie: studentCookie });
      assert.equal(me.json.user.email, 'stud@example.com');
      assert.equal((await call2('POST', '/api/auth/login', { body: { email: 'stud@example.com', password: 'studpass123' } })).status, 200);
    });

    it('admin endpoints answer 401 without login', async () => {
      assert.equal((await call2('GET', '/api/admin/users')).status, 401);
      assert.equal((await call2('POST', '/api/admin/set-vip', { body: { targetEmail: 'stud@example.com', tier: 'monthly' } })).status, 401);
      assert.equal((await call2('POST', '/api/admin/test-notify', { body: {} })).status, 401);
    });

    it('admin endpoints answer 403 for a student', async () => {
      assert.equal((await call2('GET', '/api/admin/users', { cookie: studentCookie })).status, 403);
      const res = await call2('POST', '/api/admin/set-vip', { cookie: studentCookie, body: { targetEmail: 'stud@example.com', tier: 'lifetime' } });
      assert.equal(res.status, 403);
      const me = await call2('GET', '/api/auth/me', { cookie: studentCookie });
      assert.equal(me.json.user.vipInfo.tier, 'trial');
    });

    it('GET /api/admin/users works for the admin, without password hashes', async () => {
      const res = await call2('GET', '/api/admin/users', { cookie: adminCookie });
      assert.equal(res.status, 200);
      assert.ok(res.json.count >= 4);
      assert.doesNotMatch(res.text, /scrypt\$|passwordHash/);
      assert.equal(res.json.users.find(u => u.email === 'admin@legacy.com').needsPasswordReset, true);
      assert.equal(res.json.users.find(u => u.email === 'boss@example.com').role, 'admin');
    });

    it('set-vip validates input', async () => {
      const post = body => call2('POST', '/api/admin/set-vip', { cookie: adminCookie, body });
      assert.equal((await post({ targetEmail: 'ghost@example.com', tier: 'monthly' })).status, 404);
      assert.equal((await post({ targetEmail: 'stud@example.com', tier: 'platinum' })).status, 400);
      assert.equal((await post({ targetEmail: 'stud@example.com', tier: 'toString' })).status, 400);
      assert.equal((await post({ targetEmail: 'stud@example.com', tier: 'constructor' })).status, 400);
      assert.equal((await post({ targetEmail: 'stud@example.com' })).status, 400);
    });

    it('set-vip changes vipInfo returned by /api/auth/me', async () => {
      const post = tier => call2('POST', '/api/admin/set-vip', { cookie: adminCookie, body: { targetEmail: 'Stud@Example.com', tier } });
      const meTier = async () => (await call2('GET', '/api/auth/me', { cookie: studentCookie })).json.user.vipInfo;

      assert.equal((await post('monthly')).status, 200);
      let info = await meTier();
      assert.equal(info.tier, 'monthly');
      assert.equal(info.isVip, true);
      assert.ok(info.daysRemaining >= 29 && info.daysRemaining <= 30);

      assert.equal((await post('yearly')).status, 200);
      assert.equal((await meTier()).tier, 'yearly');

      assert.equal((await post('lifetime')).status, 200);
      info = await meTier();
      assert.equal(info.tier, 'lifetime');
      assert.equal(info.daysRemaining, null);

      assert.equal((await post('expire')).status, 200);
      info = await meTier();
      assert.equal(info.isVip, false);
      assert.equal(info.isExpired, true);

      assert.equal((await post('trial')).status, 200);
      info = await meTier();
      assert.equal(info.tier, 'trial');
      assert.equal(info.isVip, true);
    });

    it('public payment info reflects the configuration', async () => {
      const res = await call2('GET', '/api/payment-info');
      assert.equal(res.status, 200);
      assert.deepEqual(res.json, {
        ok: true, configured: true, bankBin: '970422', bankName: 'MB Bank', accountNo: '0123456789', accountName: 'NGUYEN VAN A',
        prices: { monthly: 99000, yearly: 499000, lifetime: 899000 }
      });
    });
  });
});
