const { spawn } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = '8928499760:AAFuVTM2dTjz3qrf7u-wX5e_Iqzp48z2gto';
const CHAT_ID = '8806102051';
const URL_FILE = path.join(__dirname, 'active_url.txt');
const TARGET_PORT = process.env.PORT || 3005;

let currentActiveUrl = '';

function sendTelegramNotification(url, provider = 'Cloudflare Turbo Edge') {
  const message = 
    `🏮 *HỌC TIẾNG TRUNG MỖI NGÀY - 多学一门外语, 多看一个世界, 多过一种人生 (${provider})*\n\n` +
    `Cổng học tiếng Trung phong cách Sang trọng phương Đông đã được kích hoạt siêu tốc:\n\n` +
    `⚡ *Link Trực Tuyến Siêu Tốc:* ${url}\n` +
    `🌐 *Link Mạng Nội Bộ (Tailscale):* http://100.126.30.1:${TARGET_PORT}\n\n` +
    `✨ *Tối ưu hóa:* Tải trang <100ms, nén Gzip, bộ nhớ đệm RAM, chuyển tab không độ trễ, triệt tiêu hoàn toàn giật lag!`;

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

  console.log(`[${new Date().toISOString()}] Launching Cloudflare Turbo Tunnel (${cloudflaredBin})...`);

  const cf = spawn(cloudflaredBin, [
    'tunnel',
    '--url', `http://127.0.0.1:${TARGET_PORT}`
  ]);

  cf.stdout.on('data', data => {
    const text = data.toString();
    process.stdout.write(text);
    handleTunnelOutput(text, 'Cloudflare Turbo');
  });

  cf.stderr.on('data', data => {
    const text = data.toString();
    process.stderr.write(text);
    handleTunnelOutput(text, 'Cloudflare Turbo');
  });

  cf.on('close', code => {
    console.log(`[${new Date().toISOString()}] Cloudflare tunnel closed (${code}). Falling back / restarting in 3s...`);
    setTimeout(startFallbackSshTunnel, 3000);
  });

  cf.on('error', err => {
    console.warn(`Cloudflare binary unavailable: ${err.message}. Using SSH tunnel fallback...`);
    startFallbackSshTunnel();
  });
}

function handleTunnelOutput(text, provider) {
  const cfMatch = text.match(/https:\/\/[a-z0-9\-]+\.trycloudflare\.com/);
  const lhrMatch = text.match(/https:\/\/[a-z0-9]+\.lhr\.life/);
  const foundUrl = cfMatch ? cfMatch[0] : (lhrMatch ? lhrMatch[0] : null);

  if (foundUrl && foundUrl !== currentActiveUrl) {
    currentActiveUrl = foundUrl;
    fs.writeFileSync(URL_FILE, foundUrl, 'utf8');
    console.log(`\n==============================================`);
    console.log(`>>> SPEED TUNNEL ACTIVE: ${foundUrl} (${provider}) <<<`);
    console.log(`==============================================\n`);
    sendTelegramNotification(foundUrl, provider);
  }
}

function startFallbackSshTunnel() {
  console.log(`[${new Date().toISOString()}] Starting fallback SSH tunnel to localhost.run...`);

  const ssh = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=15',
    '-o', 'ServerAliveCountMax=3',
    '-R', `80:localhost:${TARGET_PORT}`,
    'nokey@localhost.run'
  ]);

  ssh.stdout.on('data', data => handleTunnelOutput(data.toString(), 'localhost.run'));
  ssh.stderr.on('data', data => handleTunnelOutput(data.toString(), 'localhost.run'));

  ssh.on('close', code => {
    console.log(`[${new Date().toISOString()}] SSH tunnel closed (${code}). Retrying Cloudflare in 3s...`);
    setTimeout(startCloudflareTunnel, 3000);
  });

  ssh.on('error', err => {
    console.error('SSH process error:', err.message);
    setTimeout(startCloudflareTunnel, 5000);
  });
}

// Start with Cloudflare Turbo for maximum speed in Vietnam
startCloudflareTunnel();
