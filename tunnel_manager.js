const { spawn } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Auto-load .env if not loaded
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

// Credentials come from the environment (see .env.example); never hard-code them.
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const LAN_URL = process.env.LAN_URL || '';
const URL_FILE = path.join(__dirname, 'active_url.txt');
const TARGET_PORT = process.env.PORT || 3005;

let currentActiveUrl = '';
let currentProcess = null;
let watchdogInterval = null;
let consecutiveFailures = 0;

function sendTelegramNotification(url, provider = 'Cloudflare Turbo Edge') {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set, skipping Telegram notification.');
    return;
  }

  const message =
    `🏮 *HỌC TIẾNG TRUNG MỖI NGÀY - 多学一门外语, 多看一个世界, 多过一种人生 (${provider})*\n\n` +
    `Cổng học tiếng Trung phong cách Sang trọng phương Đông đã được kích hoạt siêu tốc:\n\n` +
    `⚡ *Link Trực Tuyến Siêu Tốc:* ${url}\n` +
    (LAN_URL ? `🌐 *Link Mạng Nội Bộ:* ${LAN_URL}\n\n` : '\n') +
    `✨ *Tối ưu hóa:* Tải trang <100ms, giao thức HTTP/2 TCP chống rớt gói, RAM cache, chuyển tab mượt mà!`;

  const postData = JSON.stringify({
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
  });

  const req = https.request({
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, res => {
    let d = '';
    res.on('data', chunk => d += chunk);
    res.on('end', () => console.log('Telegram notified of new high-speed URL.'));
  });

  req.on('error', err => console.error('Telegram notification error:', err.message));
  req.write(postData);
  req.end();
}

function startCloudflareTunnel() {
  const localCloudflaredExe = path.join(__dirname, 'cloudflared.exe');
  const localCloudflaredLinux = path.join(__dirname, 'cloudflared');
  let cloudflaredBin = 'cloudflared';
  if (fs.existsSync(localCloudflaredExe)) {
    cloudflaredBin = localCloudflaredExe;
  } else if (fs.existsSync(localCloudflaredLinux)) {
    cloudflaredBin = localCloudflaredLinux;
  }

  console.log(`[${new Date().toISOString()}] Launching Cloudflare Turbo Tunnel with HTTP/2 protocol (${cloudflaredBin})...`);

  // Use --protocol http2 for rock-solid TCP connection without UDP QUIC packet drops
  const cf = spawn(cloudflaredBin, [
    'tunnel',
    '--protocol', 'http2',
    '--url', `http://127.0.0.1:${TARGET_PORT}`
  ]);
  currentProcess = cf;

  cf.stdout.on('data', data => {
    const text = data.toString();
    process.stdout.write(text);
    handleTunnelOutput(text, 'Cloudflare Turbo');
    if (text.includes('Unauthorized: Tunnel not found')) {
      console.log('Cloudflare edge lost tunnel. Restarting child process...');
      try { cf.kill(); } catch(_) {}
    }
  });

  cf.stderr.on('data', data => {
    const text = data.toString();
    process.stderr.write(text);
    handleTunnelOutput(text, 'Cloudflare Turbo');
    if (text.includes('Unauthorized: Tunnel not found')) {
      console.log('Cloudflare edge lost tunnel. Restarting child process...');
      try { cf.kill(); } catch(_) {}
    }
  });

  cf.on('close', code => {
    console.log(`[${new Date().toISOString()}] Cloudflare tunnel closed (${code}). Retrying in 2s...`);
    currentProcess = null;
    consecutiveFailures = 0;
    setTimeout(startCloudflareTunnel, 2000);
  });

  cf.on('error', err => {
    console.warn(`Cloudflare binary error: ${err.message}. Retrying in 3s...`);
    currentProcess = null;
    setTimeout(startCloudflareTunnel, 3000);
  });
}

function handleTunnelOutput(text, provider) {
  const cfMatch = text.match(/https:\/\/[a-z0-9\-]+\.trycloudflare\.com/);
  const lhrMatch = text.match(/https:\/\/[a-z0-9]+\.lhr\.life/);
  const foundUrl = cfMatch ? cfMatch[0] : (lhrMatch ? lhrMatch[0] : null);

  if (foundUrl && foundUrl !== currentActiveUrl) {
    currentActiveUrl = foundUrl;
    consecutiveFailures = 0;
    fs.writeFileSync(URL_FILE, foundUrl, 'utf8');
    console.log(`\n==============================================`);
    console.log(`>>> SPEED TUNNEL ACTIVE: ${foundUrl} (${provider}) <<<`);
    console.log(`==============================================\n`);
    sendTelegramNotification(foundUrl, provider);
  }
}

// Watchdog: Ping current tunnel URL every 20 seconds; if unreachable 2 consecutive times, restart tunnel
if (!watchdogInterval) {
  watchdogInterval = setInterval(() => {
    if (!currentActiveUrl) return;

    try {
      const pingUrl = new URL('/healthz', currentActiveUrl);
      const req = https.get(pingUrl, { timeout: 8000 }, res => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          consecutiveFailures = 0;
        } else {
          consecutiveFailures++;
          console.warn(`[Watchdog] Tunnel ping HTTP ${res.statusCode} (fail #${consecutiveFailures})`);
          checkFailureThreshold();
        }
      });

      req.on('timeout', () => {
        req.destroy();
        consecutiveFailures++;
        console.warn(`[Watchdog] Tunnel ping timed out (fail #${consecutiveFailures})`);
        checkFailureThreshold();
      });

      req.on('error', err => {
        consecutiveFailures++;
        console.warn(`[Watchdog] Tunnel ping error: ${err.message} (fail #${consecutiveFailures})`);
        checkFailureThreshold();
      });
    } catch (e) {
      console.warn('[Watchdog] Exception:', e.message);
    }
  }, 20000);
}

function checkFailureThreshold() {
  if (consecutiveFailures >= 2) {
    console.error(`[Watchdog] Tunnel failed ${consecutiveFailures} consecutive health checks. Restarting tunnel process...`);
    consecutiveFailures = 0;
    if (currentProcess) {
      try { currentProcess.kill(); } catch (_) {}
    }
  }
}

// Start with Cloudflare Turbo (HTTP/2)
startCloudflareTunnel();
