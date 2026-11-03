const https = require('https');
const fs = require('fs');
const path = require('path');

const botToken = '8928499760:AAFuVTM2dTjz3qrf7u-wX5e_Iqzp48z2gto';
const chatId = '8806102051';

let activeUrl = 'https://vip-identifier-brook-chronicle.trycloudflare.com';
try {
  const urlFromFile = fs.readFileSync(path.join(__dirname, '..', 'active_url.txt'), 'utf8').trim();
  if (urlFromFile.startsWith('http')) activeUrl = urlFromFile;
} catch (e) {}

const message = `🏮 [HỌC TIẾNG TRUNG MỖI NGÀY - BẢN CẬP NHẬT HOÀN THIỆN TRƯỚC KHI TẮT MÁY] 🚀

Chào bạn! Toàn bộ các yêu cầu của bạn đã được lập trình, kiểm thử và đồng bộ thành công:

🧩 1. SỬA LỖI & HOÀN THIỆN MINIGAME XẾP KHỐI GỖ (汉语积木 - 60 CẤP):
   - Đã xử lý triệt để lỗi ReferenceError tải trang, game tải 0ms siêu tốc.
   - Hỗ trợ hoàn hảo 2 chế độ: Kéo - Thả (Chuột máy tính) & Chạm chọn - Chạm đặt (Cảm ứng điện thoại / Smartphone).
   - Chữ Hán được phân bổ chuẩn xác từng nét vào từng ô khối gỗ vân mộc cao cấp.
   - Đầy đủ 60 màn chơi chia làm 3 chặng: Sơ Cấp (1-20), Trung Cấp (21-40), Cao Cấp (41-60).

📝 2. NÂNG CẤP HỆ THỐNG ĐĂNG KÝ HỌC VIÊN CÁ NHÂN HÓA:
   - Thêm 3 trường thông tin chuyên sâu:
     + 🌐 Bạn chọn ngôn ngữ nào: Giản thể, Phồn thể, Song ngữ Trung-Anh, Khẩu ngữ giao tiếp cấp tốc.
     + 💼 Bạn đang làm nghề gì: Học sinh/Sinh viên, Nhân viên văn phòng, Kinh doanh / Xuất nhập khẩu / Logistics, Buôn bán / Đánh hàng Taobao 1688, Biên phiên dịch / Giáo viên, CNTT / Kỹ sư, v.v.
     + 🎯 Mục đích của việc học: Thi HSK 3.0 & HSKK, Thăng tiến sự nghiệp, Du học & Săn học bổng, Đánh hàng & Đàm phán buôn bán, Đam mê văn hóa Hoa ngữ, Du lịch tự túc...
   - Tặng ngay +50 EXP tân thủ khi đăng ký thành công.
   - Hiển thị dải huy hiệu cá nhân hóa người học trực tiếp trên Bảng điều khiển Trang Chủ Dashboard!

🌐 Đường link trực tiếp trải nghiệm ngay bây giờ:
${activeUrl}

Toàn bộ mã nguồn đã được Git commit & Push an toàn lên GitHub main branch! Bạn hoàn toàn có thể yên tâm tắt máy nghỉ ngơi! Chúc bạn buổi tối an lành! 🏮`;

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
