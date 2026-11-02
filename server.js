const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');

const PORT = process.env.PORT || 3005;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.zip': 'application/zip'
};

const COMPRESSIBLE = new Set([
  'text/html; charset=utf-8',
  'text/css; charset=utf-8',
  'application/javascript; charset=utf-8',
  'application/json; charset=utf-8',
  'image/svg+xml'
]);

// In-Memory Static File Cache
const fileCache = new Map();

function getCachedFile(filePath, contentType) {
  try {
    const stats = fs.statSync(filePath);
    const mtime = stats.mtimeMs;
    const cached = fileCache.get(filePath);

    if (cached && cached.mtime === mtime) {
      return cached;
    }

    const rawBuffer = fs.readFileSync(filePath);
    const isCompressible = COMPRESSIBLE.has(contentType);
    const gzippedBuffer = isCompressible ? zlib.gzipSync(rawBuffer, { level: 6 }) : null;
    const etag = `W/"${stats.size.toString(16)}-${mtime.toString(16)}"`;

    const entry = {
      mtime,
      rawBuffer,
      gzippedBuffer,
      etag,
      contentType
    };

    fileCache.set(filePath, entry);
    return entry;
  } catch (e) {
    return null;
  }
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API: Send Telegram Message
  if (req.url === '/api/send-telegram' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { botToken, chatId, message } = JSON.parse(body);
        if (!botToken || !chatId || !message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Thiếu thông tin gửi Telegram' }));
          return;
        }

        const postData = JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        });

        const tgReq = https.request({
          hostname: 'api.telegram.org',
          port: 443,
          path: `/bot${botToken}/sendMessage`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        }, tgRes => {
          let tgData = '';
          tgRes.on('data', c => tgData += c);
          tgRes.on('end', () => {
            res.writeHead(tgRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(tgData);
          });
        });

        tgReq.on('error', err => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: err.message }));
        });

        tgReq.write(postData);
        tgReq.end();
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const file = getCachedFile(filePath, contentType);
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  // Check 304 If-None-Match ETag
  const clientEtag = req.headers['if-none-match'];
  if (clientEtag && clientEtag === file.etag) {
    res.writeHead(304, {
      'ETag': file.etag,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400, stale-while-revalidate=604800'
    });
    res.end();
    return;
  }

  const acceptEncoding = req.headers['accept-encoding'] || '';
  const canGzip = acceptEncoding.includes('gzip') && file.gzippedBuffer !== null;

  const headers = {
    'Content-Type': contentType,
    'ETag': file.etag,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400, stale-while-revalidate=604800'
  };

  if (canGzip) {
    headers['Content-Encoding'] = 'gzip';
    headers['Vary'] = 'Accept-Encoding';
    headers['Content-Length'] = file.gzippedBuffer.length;
    res.writeHead(200, headers);
    res.end(file.gzippedBuffer);
  } else {
    headers['Content-Length'] = file.rawBuffer.length;
    res.writeHead(200, headers);
    res.end(file.rawBuffer);
  }
});

server.listen(PORT, () => {
  console.log(`Học Tiếng Trung Mỗi Ngày (每日中文) Turbo Server running at http://localhost:${PORT}`);
});
