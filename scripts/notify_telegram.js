const https = require('https');

const botToken = '8928499760:AAFuVTM2dTjz3qrf7u-wX5e_Iqzp48z2gto';
const chatId = '8806102051';

const message = `🎨 [HOÀN TẤT ĐỔI GIAO DIỆN SÁNG / TỐI / HỆ THỐNG & PUSH GIT] 🎨

Chào bạn! Hệ thống Học Tiếng Trung Mỗi Ngày đã được cập nhật toàn diện tính năng đổi giao diện theo đúng yêu cầu:

✨ CHI TIẾT CẬP NHẬT GIAO DIỆN:
1. ☀️ Giao diện Sáng (Light Mode):
   - Phong cách Đông Phương Mỹ Học kinh điển: Màu giấy xuyến cổ, lụa hoàng gia, son đỏ Chu Sa và viền vàng kim quý phái.

2. 🌙 Giao diện Tối (Oriental Midnight Dark Mode):
   - Thiết kế Dạ Nguyệt huyền bí dịu mắt: Tông nền đen sâu thẳm, thẻ nội dung đá phiến đêm, điểm nhấn Chu Sa và Hoàng Kim phát sáng nhẹ nhàng, tương phản cao hoàn hảo khi học đêm.

3. 💻 Giao diện Theo Hệ Thống (System Mode):
   - Tự động đồng bộ thời gian thực theo cấu hình giao diện của hệ điều hành (Windows, macOS, iOS, Android). Tự động chuyển ngày/đêm không cần tải lại trang.

4. ⚡ Công Nghệ Khởi Động Không Chớp Trắng (Zero-Flash Inline Boot):
   - Lưu trữ lựa chọn người dùng vào LocalStorage (appTheme), áp dụng class ngay trong thẻ <head> trước khi trang dựng hình.
   - Menu dropdown tiện lợi trên thanh Header với biểu tượng và dấu tích trực quan.

📦 Mã nguồn GitHub đã push:
https://github.com/huyentrang2003ltv-sys/chinese-daily.git

🌐 Trải nghiệm trực tuyến:
https://holdem-disclaimer-cheers-meat.trycloudflare.com`;

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
    console.log('Body:', body);
  });
});

req.on('error', err => {
  console.error('Telegram error:', err.message);
});

req.write(payload);
req.end();
