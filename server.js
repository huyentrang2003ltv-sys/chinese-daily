const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');
let EdgeTTS = null;
try {
  EdgeTTS = require('node-edge-tts').EdgeTTS;
} catch (e) {
  console.warn('node-edge-tts not loaded:', e.message);
}

const PORT = process.env.PORT || 3005;
const PUBLIC_DIR = __dirname;
const audioCache = new Map();

// Preload Dictionary for AI Assistant
let dictMap = new Map();
try {
  const dictData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'dictionary.json'), 'utf8'));
  dictData.forEach(d => {
    if (d.title && d.pinyin) {
      dictMap.set(d.title, { word: d.title, pinyin: d.pinyin, vi: d.meaning || '' });
    }
  });
} catch (e) {
  console.warn('Could not preload dictionary in server:', e.message);
}

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

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API: Studio Neural Beijing TTS (Microsoft Natural Voices: Xiaoxiao Female & Yunxi Male)
  if (req.url.startsWith('/api/tts')) {
    try {
      const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const text = urlObj.searchParams.get('text');
      const gender = urlObj.searchParams.get('gender') || 'female';
      const speed = parseFloat(urlObj.searchParams.get('speed')) || 0.85;

      if (!text || !text.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Thiếu nội dung cần phát âm (text)' }));
        return;
      }

      const voice = gender === 'male' ? 'zh-CN-YunxiNeural' : 'zh-CN-XiaoxiaoNeural';
      let rateStr = '+0%';
      if (speed <= 0.75) rateStr = '-20%';
      else if (speed <= 0.85) rateStr = '-10%';
      else if (speed >= 1.1) rateStr = '+15%';

      const cleanText = text.trim();
      const cacheKey = `${voice}:${rateStr}:${cleanText}`;

      if (audioCache.has(cacheKey)) {
        const audioBuf = audioCache.get(cacheKey);
        res.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuf.length,
          'Cache-Control': 'public, max-age=604800, immutable'
        });
        res.end(audioBuf);
        return;
      }

      if (EdgeTTS) {
        const tts = new EdgeTTS({ voice, rate: rateStr });
        const tempName = path.join(__dirname, `tts_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.mp3`);
        await tts.ttsPromise(cleanText, tempName);

        if (fs.existsSync(tempName)) {
          const audioBuf = fs.readFileSync(tempName);
          try { fs.unlinkSync(tempName); } catch (e) {}

          if (audioCache.size < 600) {
            audioCache.set(cacheKey, audioBuf);
          }

          res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuf.length,
            'Cache-Control': 'public, max-age=604800, immutable'
          });
          res.end(audioBuf);
          return;
        }
      }

      // Fallback redirect to Youdao TTS if EdgeTTS is unavailable
      const youdaoUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanText)}&le=zh`;
      res.writeHead(302, { 'Location': youdaoUrl });
      res.end();
    } catch (err) {
      console.error('TTS Endpoint Error:', err);
      const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const text = urlObj.searchParams.get('text') || '';
      res.writeHead(302, { 'Location': `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=zh` });
      res.end();
    }
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

  // API: AI Chat & Translation Assistant
  if (req.url === '/api/ai-chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { message, mode } = JSON.parse(body || '{}');
        const text = (message || '').trim();
        if (!text) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Thiếu nội dung tin nhắn' }));
          return;
        }

        const isChinese = /[\u4e00-\u9fa5]/.test(text);
        const targetLang = isChinese ? 'vi' : 'zh-CN';
        const gtUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&dt=rm&q=${encodeURIComponent(text)}`;

        let gtData = null;
        try {
          const resp = await fetch(gtUrl);
          gtData = await resp.json();
        } catch (fetchErr) {
          console.warn('Google Translate API fetch warning:', fetchErr.message);
        }

        let translated = '';
        let pinyin = '';

        if (gtData && Array.isArray(gtData[0])) {
          translated = gtData[0].map(item => item && item[0] ? item[0] : '').join('').trim();
          if (gtData[0][1] && gtData[0][1][2]) {
            pinyin = gtData[0][1][2];
          }
        }

        // Contextual breakdown
        const chineseStr = isChinese ? text : translated;
        const vocabList = [];
        dictMap.forEach((val, word) => {
          if (word.length >= 2 && chineseStr.includes(word) && vocabList.length < 6) {
            vocabList.push(val);
          }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          mode: mode || 'translate',
          sourceText: text,
          translated: translated || 'Đã ghi nhận câu dịch.',
          pinyin: pinyin || '',
          isChineseTarget: !isChinese,
          vocab: vocabList
        }));
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
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end();
    return;
  }

  const acceptEncoding = req.headers['accept-encoding'] || '';
  const canGzip = acceptEncoding.includes('gzip') && file.gzippedBuffer !== null;

  const headers = {
    'Content-Type': contentType,
    'ETag': file.etag,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
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
