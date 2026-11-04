// scripts/notify_telegram.js
const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) process.exit(0);

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(l => {
  const t = l.trim();
  if (!t || t.startsWith('#')) return;
  const idx = t.indexOf('=');
  if (idx > 0) env[t.slice(0, idx).trim()] = t.slice(idx + 1).trim();
});

const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = env.TELEGRAM_CHAT_ID;
const activeUrl = fs.existsSync(path.join(__dirname, '../active_url.txt'))
  ? fs.readFileSync(path.join(__dirname, '../active_url.txt'), 'utf8').trim()
  : '';

if (!BOT_TOKEN || !CHAT_ID) {
  console.log('No Telegram bot credentials found.');
  process.exit(0);
}

const msg = 
`🏮 *TÍNH NĂNG MỚI ĐÃ HOÀN TẤT: TRA TỪ VỰNG ĐA CHIỀU 6-TRONG-1 (MULTIDIMENSIONAL WORD LOOKUP)* 🏮\n\n` +
`✨ Khi chạm hoặc chọn bất kỳ từ vựng nào trên hệ thống, modal thông minh sẽ hiển thị trọn vẹn 6 khía cạnh cốt lõi:\n` +
`1. 💡 *Cách Dùng (Usage & Collocations):* Cấu trúc ngữ pháp, mẫu câu, cụm từ kết hợp hay gặp (常搭配).\n` +
`2. 📖 *Định Nghĩa (Meanings):* Nghĩa tiếng Việt, Hán Việt chuẩn, từ loại (POS), cấp độ HSK.\n` +
`3. 🤝 *Từ Đồng Nghĩa (近义词):* Cặp từ tương đương, bấm trực tiếp để tra cứu liên hoàn.\n` +
`4. ⚖️ *Từ Trái Nghĩa (反义词):* Cặp từ đối lập tương phản, bấm trực tiếp để tra cứu liên hoàn.\n` +
`5. 🔔 *Từ Đồng Âm (同音词):* Hệ thống cụm từ đồng âm (shì, yī, yì, gōng, bǐ, zài, tā...) giúp tránh nhầm lẫn.\n` +
`6. 🖼️ *Hình Ảnh Minh Họa (Visual Card):* Icon/Emoji trực quan và caption giải nghĩa cho 3.592 từ vựng!\n\n` +
`⚡ *Chạm mọi nơi (Global Tap & Selection):* Bôi đen bất kỳ chữ Hán nào trên màn hình đều xuất hiện nút tra cứu nổi tức thì.\n\n` +
`🌐 *Trải Nghiệm Trực Tuyến Siêu Tốc:* ${activeUrl}`;

const postData = JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'Markdown' });
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
  res.on('data', c => d += c);
  res.on('end', () => console.log('Telegram notified successfully!'));
});
req.on('error', e => console.error(e));
req.write(postData);
req.end();
