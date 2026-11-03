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

const message = `🏮 [HỌC TIẾNG TRUNG MỖI NGÀY - RA MẮT HỆ THỐNG ĐĂNG KÝ & ĐĂNG NHẬP HOÀN CHỈNH] 🏮

Chào bạn! Hệ thống Đăng Ký (Register) và Đăng Nhập (Login) tài khoản học viên chính thức đã được tích hợp toàn diện:

✨ CÁC TÍNH NĂNG ĐĂNG KÝ & ĐĂNG NHẬP MỚI:
1. 🔑 TAB ĐĂNG NHẬP (LOGIN):
   - Đăng nhập nhanh 1-chạm (Quick Login) dành riêng cho 2 Super Admin: Phạm Hoàng & Huyền Trang.
   - Đăng nhập bằng Email & Mật khẩu cho học viên toàn hệ thống.
   - Nút ẩn/hiện mật khẩu trực quan.

2. ✨ TAB ĐĂNG KÝ HỌC VIÊN MỚI (REGISTER):
   - Nhập Họ & Tên hiển thị, Email, Mật khẩu (tối thiểu 6 ký tự) & Xác nhận mật khẩu.
   - Lựa chọn Mục tiêu học tập (Nhập môn HSK 1-2, Ôn thi HSK 3-4, HSK 5-6 cao cấp, Giao tiếp công việc...).
   - 🎁 Quà tặng tân thủ: Tự động cộng ngay +50 EXP khi đăng ký thành công!

3. 🛡️ BACKEND DATABASE & BẢO MẬT:
   - Lưu trữ danh sách học viên trong cơ sở dữ liệu data/users.json trên máy chủ.
   - Mã hóa bảo mật mật khẩu bằng SHA-256.
   - API endpoints: /api/auth/register, /api/auth/login, /api/auth/users.

🌐 Trải nghiệm đăng ký & đăng nhập ngay tại:
${activeUrl}

Chúc bạn và các học viên có hành trình tu luyện Hán ngữ hứng khởi và thành công! 🏮`;

const data = JSON.stringify({
  chat_id: chatId,
  text: message
});

const options = {
  hostname: 'api.telegram.org',
  port: 443,
  path: `/bot${botToken}/sendMessage`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Telegram response status:', res.statusCode);
  });
});

req.on('error', (e) => {
  console.error('Telegram notification error:', e.message);
});

req.write(data);
req.end();
