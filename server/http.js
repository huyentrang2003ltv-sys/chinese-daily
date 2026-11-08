'use strict';

const { TRUST_PROXY } = require('./config');

// Inline handlers (onclick="...") are still used throughout the UI, so
// 'unsafe-inline' is required for scripts; external origins are pinned.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://api.vietqr.io https://images.unsplash.com",
  "media-src 'self' blob: https://dict.youdao.com",
  "connect-src 'self' https://cdn.jsdelivr.net",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'"
].join('; ');

const BASE_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'microphone=(self), camera=(), geolocation=()',
  'Content-Security-Policy': CSP
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function send(res, status, headers, body) {
  res.writeHead(status, { ...BASE_HEADERS, ...headers });
  res.end(body);
}

function sendJson(res, status, payload, headers = {}) {
  send(res, status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers
  }, JSON.stringify(payload));
}

/**
 * Read and parse a JSON request body.
 * Requiring the JSON content type also blocks cross-site form posts (CSRF):
 * a browser cannot send it cross-origin without a CORS preflight, which we never grant.
 */
function readJson(req, maxBytes = 16 * 1024) {
  return new Promise((resolve, reject) => {
    if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) {
      reject(new HttpError(415, 'Yêu cầu phải gửi dạng JSON.'));
      return;
    }
    if (Number(req.headers['content-length']) > maxBytes) {
      reject(new HttpError(413, 'Dữ liệu gửi lên quá lớn.'));
      req.resume();
      return;
    }
    let size = 0;
    let tooLarge = false;
    const chunks = [];
    req.on('data', chunk => {
      if (tooLarge) return;
      size += chunk.length;
      if (size > maxBytes) {
        // Do not destroy the socket here: the 413 response could never be delivered.
        // The error handler adds "Connection: close", so the socket ends after the reply.
        tooLarge = true;
        chunks.length = 0;
        reject(new HttpError(413, 'Dữ liệu gửi lên quá lớn.'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (tooLarge) return;
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        const data = text ? JSON.parse(text) : {};
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('not an object');
        resolve(data);
      } catch (e) {
        reject(new HttpError(400, 'Dữ liệu JSON không hợp lệ.'));
      }
    });
    req.on('error', reject);
  });
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (TRUST_PROXY && forwarded) return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

function isHttps(req) {
  if (req.socket.encrypted) return true;
  return TRUST_PROXY && String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() === 'https';
}

function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    const key = part.slice(0, idx).trim();
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(part.slice(idx + 1).trim());
    } catch (e) {
      // Ignore malformed cookie values.
    }
  }
  return out;
}

/** Fixed-window limiter: returns true when `key` exceeded `max` hits within `windowMs`. */
function createRateLimiter({ windowMs, max }) {
  const buckets = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now - bucket.start > windowMs) buckets.delete(key);
    }
  }, windowMs).unref();

  return function isLimited(key) {
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || now - bucket.start > windowMs) {
      buckets.set(key, { start: now, count: 1 });
      return false;
    }
    bucket.count += 1;
    return bucket.count > max;
  };
}

/** Trimmed string limited to `max` characters ('' for non-strings). */
function str(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

module.exports = {
  HttpError,
  send,
  sendJson,
  readJson,
  clientIp,
  isHttps,
  parseCookies,
  createRateLimiter,
  str
};
