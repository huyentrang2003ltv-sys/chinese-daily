'use strict';

const http = require('http');
const { PORT, HOST, IS_PROD } = require('./server/config');
const { send, sendJson } = require('./server/http');
const { serveStatic } = require('./server/static');
const { handleTts } = require('./server/tts');
const { handleApi } = require('./server/api');
const accounts = require('./server/accounts');
const visitors = require('./server/visitors');

const server = http.createServer(async (req, res) => {
  let url;
  try {
    url = new URL(req.url, 'http://localhost');
  } catch (e) {
    send(res, 400, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Bad Request');
    return;
  }

  try {
    if (url.pathname === '/healthz') {
      sendJson(res, 200, { ok: true, uptime: Math.round(process.uptime()) });
    } else if (url.pathname === '/api/tts') {
      await handleTts(req, res, url);
    } else if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res, url);
    } else {
      serveStatic(req, res, url.pathname);
    }
  } catch (err) {
    console.error('Request error:', err);
    if (!res.headersSent) sendJson(res, 500, { ok: false, error: IS_PROD ? 'Internal Server Error' : err.message });
    else res.destroy();
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Học Tiếng Trung Mỗi Ngày (每日中文) server running at http://localhost:${PORT}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  accounts.flushUsers();
  visitors.flush();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
