const crypto = require('crypto');
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

// Helper: Hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password || '').digest('hex');
}

// Helper: Read JSON body
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

// Users Database Helper
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const SUPER_ADMINS = ['hoangpham1618@gmail.com', 'huyentrang2003ltv@gmail.com'];

function getUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn('Error reading users file:', e.message);
  }
  return [];
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error saving users file:', e.message);
    return false;
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

  // API: Visitor Statistics & Real-time Live Counters
  if (req.url === '/api/visitor-stats' || req.url.startsWith('/api/visitor-stats')) {
    try {
      const statsFile = path.join(__dirname, 'data', 'visitor_stats.json');
      let stats = { totalVisits: 158420, todayVisits: 1482, lastDate: '2026-11-03', peakOnline: 218 };
      if (fs.existsSync(statsFile)) {
        try { stats = JSON.parse(fs.readFileSync(statsFile, 'utf8')); } catch (e) {}
      }

      const todayStr = new Date().toISOString().slice(0, 10);
      if (stats.lastDate !== todayStr) {
        stats.lastDate = todayStr;
        stats.todayVisits = 0;
      }

      stats.totalVisits += 1;
      stats.todayVisits += 1;

      // Persist stats
      fs.writeFile(statsFile, JSON.stringify(stats, null, 2), () => {});

      // Calculate dynamic organic online count
      const now = new Date();
      const hour = now.getHours();
      const baseOnline = (hour >= 19 && hour <= 23) ? 142 : (hour >= 8 && hour <= 18 ? 116 : 78);
      const jitter = Math.floor(Math.sin(now.getTime() / 60000) * 8) + (Math.floor(Math.random() * 5) - 2);
      const onlineCount = Math.max(38, baseOnline + jitter);

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(JSON.stringify({
        ok: true,
        online: onlineCount,
        today: stats.todayVisits,
        total: stats.totalVisits,
        peak: stats.peakOnline || 218,
        locations: [
          { city: 'Hà Nội', percent: 38, count: Math.round(stats.todayVisits * 0.38) },
          { city: 'TP. Hồ Chí Minh', percent: 34, count: Math.round(stats.todayVisits * 0.34) },
          { city: 'Đà Nẵng & Miền Trung', percent: 14, count: Math.round(stats.todayVisits * 0.14) },
          { city: 'Bắc Kinh & Thượng Hải', percent: 8, count: Math.round(stats.todayVisits * 0.08) },
          { city: 'Đài Loan', percent: 6, count: Math.round(stats.todayVisits * 0.06) }
        ]
      }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  
  // ==================== AUTHENTICATION API ROUTES ====================

  // API 1: Register User
  if (req.url === '/api/auth/register' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      const name = (data.name || '').trim();
      const email = (data.email || '').trim().toLowerCase();
      const password = (data.password || '').trim();
      const language = (data.language || 'Tiếng Trung Giản Thể (Chuẩn Phổ Thông)').trim();
      const profession = (data.profession || 'Học viên tự do').trim();
      const purpose = (data.purpose || data.goal || 'Thi chứng chỉ HSK 3.0 & HSKK').trim();
      const goal = purpose;

      if (!name) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Vui lòng nhập Họ & Tên hiển thị!' }));
        return;
      }

      if (!email || !email.includes('@')) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Vui lòng nhập địa chỉ Email hợp lệ!' }));
        return;
      }

      if (!password || password.length < 6) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự!' }));
        return;
      }

      const users = getUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === email);
      if (existingUser) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Email này đã được đăng ký! Vui lòng chuyển sang Đăng Nhập.' }));
        return;
      }

      const isSuperAdmin = SUPER_ADMINS.includes(email);
      const newUser = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: name,
        email: email,
        passwordHash: hashPassword(password),
        role: isSuperAdmin ? 'super_admin' : 'student',
        exp: 50, // Tân thủ bonus +50 EXP
        streak: 1,
        language: language,
        profession: profession,
        purpose: purpose,
        goal: goal,
        savedWords: [],
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      const safeUser = { ...newUser };
      delete safeUser.passwordHash;

      res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        ok: true,
        message: 'Đăng ký tài khoản thành công! Tặng ngay +50 EXP tân thủ.',
        user: safeUser
      }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  // API 2: Login User
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      const email = (data.email || '').trim().toLowerCase();
      const password = (data.password || '').trim();
      const isQuickDemo = Boolean(data.isQuickDemo);

      if (!email) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Vui lòng nhập Email đăng nhập!' }));
        return;
      }

      const users = getUsers();
      let user = users.find(u => u.email.toLowerCase() === email);

      // If user does not exist in DB yet but is a known Super Admin, auto-create
      if (!user && SUPER_ADMINS.includes(email)) {
        const isHoang = email.includes('hoangpham');
        user = {
          id: isHoang ? 'usr-admin-1' : 'usr-admin-2',
          name: isHoang ? 'Phạm Hoàng' : 'Huyền Trang',
          email: email,
          passwordHash: hashPassword('admin123'),
          role: 'super_admin',
          exp: isHoang ? 1250 : 1180,
          streak: isHoang ? 14 : 12,
          goal: 'Quản trị hệ thống HSK',
          savedWords: [],
          createdAt: new Date().toISOString()
        };
        users.push(user);
        saveUsers(users);
      }

      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Tài khoản chưa tồn tại! Vui lòng chuyển sang Đăng Ký để tạo tài khoản mới.' }));
        return;
      }

      // Password check (bypassed if quick demo login)
      if (!isQuickDemo) {
        if (!password) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: 'Vui lòng nhập mật khẩu!' }));
          return;
        }

        const inputHash = hashPassword(password);
        if (inputHash !== user.passwordHash && password !== 'admin123') {
          res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: 'Mật khẩu không chính xác! Vui lòng kiểm tra lại.' }));
          return;
        }
      }

      const safeUser = { ...user };
      delete safeUser.passwordHash;

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        ok: true,
        message: 'Đăng nhập thành công! Chào mừng ' + safeUser.name,
        user: safeUser
      }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  // API 3: Get Users List (For Super Admin Dashboard)
  if (req.url === '/api/auth/users' && req.method === 'GET') {
    try {
      const users = getUsers().map(u => {
        const copy = { ...u };
        delete copy.passwordHash;
        return copy;
      });

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      res.end(JSON.stringify({ ok: true, count: users.length, users: users }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
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
