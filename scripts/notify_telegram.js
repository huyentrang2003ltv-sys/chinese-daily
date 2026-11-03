const https = require('https');
const fs = require('fs');
const path = require('path');

const botToken = '8928499760:AAFuVTM2dTjz3qrf7u-wX5e_Iqzp48z2gto';
const chatId = '8806102051';

let activeUrl = 'https://reel-trustees-supplements-map.trycloudflare.com';
try {
  const urlFromFile = fs.readFileSync(path.join(__dirname, '..', 'active_url.txt'), 'utf8').trim();
  if (urlFromFile.startsWith('http')) activeUrl = urlFromFile;
} catch (e) {}

const message = `🏮 [HỌC TIẾNG TRUNG MỖI NGÀY - TỐI ƯU CỤM TRỢ LÝ & HỖ TRỢ GÓC PHẢI] 🏮

Chào bạn! Hệ thống vừa được tối ưu hóa theo yêu cầu người dùng:

✨ CÁC CẢI TIẾN NỔI BẬT:
1. 🎯 Thu nhỏ kích thước:
   - Hai biểu tượng (Hỗ trợ 24/7 & Trợ lý Dịch AI 3D) được tinh chỉnh gọn gàng (42px) thanh thoát, không che khuất nội dung học tập.
2. 📍 Quy tụ về góc phải (Right Dock):
   - Đưa biểu tượng Hỗ trợ từ góc trái màn hình về góc phải cùng Trợ lý AI, tạo thành cụm floating dock gọn gàng, liền mạch.
3. 👁️ Cho phép Ẩn/Hiện linh hoạt:
   - Thêm nút [Ẩn ✕] ngay trên đầu dock để người dùng có thể ẩn đi bất cứ lúc nào nếu thấy vướng víu.
   - Khi ẩn, cụm trợ lý thu gọn thành nút nhỏ tinh tế [🟢 Trợ lý] ở góc phải dưới; bấm vào sẽ mở lại ngay.
   - Tự động ghi nhớ trạng thái (Ẩn/Hiện) qua localStorage cho những lần truy cập sau.
4. 🔄 Đóng/Mở tương hỗ (Mutual Exclusion):
   - Mở cửa sổ Hỗ trợ sẽ tự động thu gọn Trợ lý AI và ngược lại, đảm bảo giao diện luôn thoáng đãng.

⚡ Trải nghiệm ngay tại: ${activeUrl}
📦 GitHub: https://github.com/huyentrang2003ltv-sys/chinese-daily`;

const payload = JSON.stringify({
  chat_id: chatId,
  text: message
});

const req = https.request({
  hostname: 'api.telegram.org',
  port: 443,
  path: `/bot${botToken}/sendMessage`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Telegram response status:', res.statusCode);
  });
});

req.on('error', err => {
  console.error('Telegram error:', err.message);
});

req.write(payload);
req.end();
