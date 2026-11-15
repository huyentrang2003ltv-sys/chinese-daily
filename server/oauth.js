'use strict';

// Sign in with Google: OpenID Connect authorization-code flow with PKCE, handled entirely on
// the server. The browser only ever follows redirects; it never sees Google's tokens.
//
//   GET /api/auth/google            -> sets a short-lived signed flow cookie, redirects to Google
//   GET /api/auth/google/callback   -> checks state, exchanges the code (+ PKCE verifier),
//                                      validates the ID token, starts our own session
const crypto = require('crypto');
const config = require('./config');
const accounts = require('./accounts');
const { send, isHttps, parseCookies, clientIp, createRateLimiter } = require('./http');

const FLOW_COOKIE = 'yh_oauth';
const FLOW_COOKIE_PATH = '/api/auth/google';
const FLOW_TTL_MS = 10 * 60 * 1000;
const CLOCK_SKEW_MS = 2 * 60 * 1000;
const AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_ISSUERS = new Set(['https://accounts.google.com', 'accounts.google.com']);
// Tab names the app may return to after sign-in (anything else falls back to home).
const NEXT_TAB_RE = /^[a-z0-9-]{1,32}$/;

const startLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 30 });

/** Token endpoint; tests point it at a local fake Google. */
const tokenUrl = () => (config.IS_TEST && process.env.GOOGLE_TOKEN_URL) || 'https://oauth2.googleapis.com/token';

function redirectUri() {
  if (config.GOOGLE_CALLBACK_URL) return config.GOOGLE_CALLBACK_URL;
  // Local development only; production must register an exact HTTPS callback.
  return config.IS_PROD ? '' : `http://localhost:${config.PORT}/api/auth/google/callback`;
}

const isGoogleEnabled = () => Boolean(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET && redirectUri());

const base64url = buf => buf.toString('base64url');
const randomToken = (bytes = 32) => base64url(crypto.randomBytes(bytes));
const sha256 = value => crypto.createHash('sha256').update(value).digest();

function sameString(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length > 0 && x.length === y.length && crypto.timingSafeEqual(x, y);
}

function flowCookie(req, value, maxAgeSeconds) {
  const parts = [
    `${FLOW_COOKIE}=${value}`,
    `Path=${FLOW_COOKIE_PATH}`,
    'HttpOnly',
    // Lax is sent on the top-level GET redirect back from Google.
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`
  ];
  if (isHttps(req)) parts.push('Secure');
  return parts.join('; ');
}

/** Back to the app with a short result code (never free text in the URL). */
function finish(res, req, { code, next = 'home', cookies = [] }) {
  const tab = NEXT_TAB_RE.test(next) ? next : 'home';
  send(res, 302, {
    Location: `/#/${tab}?oauth=${code}`,
    'Set-Cookie': [flowCookie(req, '', 0), ...cookies],
    'Cache-Control': 'no-store'
  });
}

async function startGoogleSignIn(req, res, url) {
  const next = url.searchParams.get('next') || 'home';
  if (!isGoogleEnabled()) return finish(res, req, { code: 'unavailable', next });
  if (startLimiter(clientIp(req))) return finish(res, req, { code: 'busy', next });

  const state = randomToken(16);
  const nonce = randomToken(16);
  const verifier = randomToken(32);
  const flow = accounts.createSignedToken({ typ: 'oauth', state, nonce, verifier, next }, FLOW_TTL_MS);

  const params = new URLSearchParams({
    client_id: config.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    nonce,
    code_challenge: base64url(sha256(verifier)),
    code_challenge_method: 'S256',
    prompt: 'select_account'
  });
  send(res, 302, {
    Location: `${AUTHORIZE_URL}?${params}`,
    'Set-Cookie': flowCookie(req, flow, FLOW_TTL_MS / 1000),
    'Cache-Control': 'no-store'
  });
}

/** Decode the ID token's claims. Its signature is not checked: the token comes straight from
 * Google's token endpoint over TLS, which OpenID Connect Core §3.1.3.7 accepts in its place. */
function decodeIdToken(idToken) {
  const parts = String(idToken || '').split('.');
  if (parts.length !== 3) throw new Error('ID token không hợp lệ');
  return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
}

/** Returns the verified identity, or throws an Error whose `code` is the result shown to the user. */
function validateClaims(claims, flow) {
  const fail = (code, reason) => Object.assign(new Error(reason), { code });
  const now = Date.now();
  if (!GOOGLE_ISSUERS.has(claims.iss)) throw fail('failed', 'issuer');
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(config.GOOGLE_CLIENT_ID)) throw fail('failed', 'audience');
  if (audiences.length > 1 && claims.azp !== config.GOOGLE_CLIENT_ID) throw fail('failed', 'azp');
  if (typeof claims.exp !== 'number' || claims.exp * 1000 < now - CLOCK_SKEW_MS) throw fail('failed', 'expired');
  if (typeof claims.iat === 'number' && claims.iat * 1000 > now + CLOCK_SKEW_MS) throw fail('failed', 'iat');
  if (!sameString(claims.nonce, flow.nonce)) throw fail('failed', 'nonce');
  if (typeof claims.sub !== 'string' || !claims.sub) throw fail('failed', 'sub');
  if (typeof claims.email !== 'string' || !claims.email.includes('@')) throw fail('failed', 'email');
  if (claims.email_verified !== true && claims.email_verified !== 'true') throw fail('unverified', 'email not verified');
  return { sub: claims.sub, email: claims.email, name: claims.name || claims.given_name || '', picture: claims.picture || '' };
}

async function exchangeCode(code, verifier) {
  const res = await fetch(tokenUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.GOOGLE_CLIENT_ID,
      client_secret: config.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri(),
      grant_type: 'authorization_code',
      code_verifier: verifier
    }),
    signal: AbortSignal.timeout(10000)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id_token) throw new Error(`token endpoint ${res.status} ${data.error || ''}`.trim());
  return data.id_token;
}

async function finishGoogleSignIn(req, res, url) {
  const flow = accounts.readSignedToken(parseCookies(req)[FLOW_COOKIE], 'oauth');
  const next = (flow && flow.next) || 'home';

  const error = url.searchParams.get('error');
  if (error) return finish(res, req, { code: error === 'access_denied' ? 'cancelled' : 'failed', next });
  // Missing/expired flow cookie or a state we did not issue: possible login CSRF, never continue.
  if (!flow || !sameString(url.searchParams.get('state'), flow.state)) return finish(res, req, { code: 'expired', next });
  const code = url.searchParams.get('code');
  if (!code || !isGoogleEnabled()) return finish(res, req, { code: 'failed', next });

  let identity;
  try {
    identity = validateClaims(decodeIdToken(await exchangeCode(code, flow.verifier)), flow);
  } catch (err) {
    console.warn('[oauth] Google sign-in rejected:', err.message);
    return finish(res, req, { code: err.code || 'failed', next });
  }

  const { user, isNew, linked } = accounts.signInWithGoogle(identity);
  accounts.touchUserActivity(user);
  const session = accounts.sessionCookie(accounts.createSessionToken(user), { secure: isHttps(req) });
  finish(res, req, { code: isNew ? 'welcome' : linked ? 'linked' : 'success', next, cookies: [session] });
}

module.exports = { startGoogleSignIn, finishGoogleSignIn, isGoogleEnabled };
