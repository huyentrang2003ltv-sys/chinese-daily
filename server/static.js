'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { PUBLIC_DIR } = require('./config');
const { send } = require('./http');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

const COMPRESSIBLE_EXT = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt', '.webmanifest']);
const fileCache = new Map();

/** Read a file once and keep it with precompressed gzip/brotli variants until it changes on disk. */
function loadFile(filePath, ext) {
  let stats;
  try {
    stats = fs.statSync(filePath);
  } catch (e) {
    return null;
  }
  if (!stats.isFile()) return null;

  const cached = fileCache.get(filePath);
  if (cached && cached.mtimeMs === stats.mtimeMs && cached.size === stats.size) return cached;

  const raw = fs.readFileSync(filePath);
  const compressible = COMPRESSIBLE_EXT.has(ext) && raw.length > 1024;
  const entry = {
    mtimeMs: stats.mtimeMs,
    size: stats.size,
    raw,
    gzip: compressible ? zlib.gzipSync(raw, { level: 9 }) : null,
    br: compressible
      ? zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } })
      : null,
    etag: `W/"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`,
    lastModified: stats.mtime.toUTCString()
  };
  fileCache.set(filePath, entry);
  return entry;
}

/** Resolve a URL pathname to a file inside PUBLIC_DIR, or null if it escapes or is hidden. */
function resolvePublicPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch (e) {
    return null;
  }
  if (decoded.includes('\0')) return null;
  if (decoded.endsWith('/')) decoded += 'index.html';

  const resolved = path.resolve(PUBLIC_DIR, '.' + path.posix.normalize('/' + decoded));
  if (resolved !== PUBLIC_DIR && !resolved.startsWith(PUBLIC_DIR + path.sep)) return null;

  // Never serve dotfiles (.env, .git, ...)
  const rel = path.relative(PUBLIC_DIR, resolved);
  if (rel.split(path.sep).some(seg => seg.startsWith('.'))) return null;
  return resolved;
}

function serveStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }, 'Method Not Allowed');
    return;
  }

  const filePath = resolvePublicPath(pathname);
  const ext = filePath ? path.extname(filePath).toLowerCase() : '';
  const file = filePath && MIME_TYPES[ext] ? loadFile(filePath, ext) : null;
  if (!file) {
    send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, '404 Not Found');
    return;
  }

  // Assets are not fingerprinted, so always revalidate (cheap 304 via ETag).
  const headers = {
    'Content-Type': MIME_TYPES[ext],
    ETag: file.etag,
    'Last-Modified': file.lastModified,
    'Cache-Control': 'no-cache',
    Vary: 'Accept-Encoding'
  };

  if (req.headers['if-none-match'] === file.etag) {
    send(res, 304, headers);
    return;
  }

  const accept = req.headers['accept-encoding'] || '';
  let body = file.raw;
  if (file.br && /\bbr\b/.test(accept)) {
    body = file.br;
    headers['Content-Encoding'] = 'br';
  } else if (file.gzip && /\bgzip\b/.test(accept)) {
    body = file.gzip;
    headers['Content-Encoding'] = 'gzip';
  }
  headers['Content-Length'] = body.length;
  send(res, 200, headers, req.method === 'HEAD' ? undefined : body);
}

module.exports = { serveStatic };
