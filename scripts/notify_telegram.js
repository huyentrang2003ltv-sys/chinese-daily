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

const message = `👑 [HỌC TIẾNG TRUNG MỖI NGÀY - PHÂN QUYỀN 👑 SUPER ADMIN & BẢNG ĐIỀU KHIỂN QUẢN TRỊ] 👑

Chào bạn! Quyền Quản trị Tối cao (Super Admin) đã được gán và kích hoạt thành công cho 2 tài khoản:

👑 DANH SÁCH SUPER ADMIN:
1. Phạm Hoàng: hoangpham1618@gmail.com
2. Huyền Trang: huyentrang2003ltv@gmail.com

🌟 CÁC ĐẶC QUYỀN & TÍNH NĂNG QUẢN TRỊ ĐƯỢC KÍCH HOẠT:
✨ Biểu tượng Vương miện Vàng 👑 & Huy hiệu "👑 Super Admin" VIP hiển thị nổi bật trên thanh tiêu đề Header và trong Menu hồ sơ cá nhân.
✨ Đăng nhập nhanh 1-chạm (Quick Login) dành riêng cho cả 2 Super Admin trong hộp thoại đăng nhập.
✨ Bảng Điều Khiển Quản Trị Tối Cao (Super Admin Dashboard Modal):
   - Chuyển đổi nhanh 1-click giữa 2 tài khoản Admin.
   - Thống kê Realtime KPIs: Số người online, 14.605 từ vựng, 76 bài Giáo trình Hán ngữ, 48 bài HSK 3.0 Standard Course.
   - Công cụ kiểm tra kết nối & gửi thông báo Telegram tức thì.
   - Công cụ làm mới cache & đồng bộ lại dữ liệu.
   - Nút tải bản sao lưu mã nguồn website (chinese-daily.zip) ngoại tuyến.
   - Lối tắt mở Bảng Phân Tích Người Học & Lưu Lượng Truy Cập.

🌐 Trải nghiệm trực tiếp tại:
${activeUrl}

Chúc bạn và bạn học có trải nghiệm quản trị và học tập tuyệt vời nhất! 🏮`;

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
    console.log('Response body:', body);
  });
});

req.on('error', (e) => {
  console.error('Telegram notification error:', e.message);
});

req.write(data);
req.end();
