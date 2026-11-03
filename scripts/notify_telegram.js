const https = require('https');

const botToken = '8928499760:AAFuVTM2dTjz3qrf7u-wX5e_Iqzp48z2gto';
const chatId = '8806102051';

const message = `🔍 [BỔ SUNG CÔNG CỤ TÌM KIẾM & PHÂN RÃ CHIẾT TỰ THÔNG MINH] 🔍

Chào bạn! Tab "Chiết Tự & Gốc Từ" (Tab 1) đã được trang bị bộ công cụ tìm kiếm và phân rã Hán tự thông minh theo đúng yêu cầu:

🏮 TÍNH NĂNG NỔI BẬT VỪA CẬP NHẬT:
1. 🔎 Thanh Tìm Kiếm Đa Năng Trực Tiếp Trong Tab Chiết Tự:
   - Tra cứu tức thì bằng Hán tự (想, 学, 爱...), Pinyin không dấu (xiang, xue, ai...), âm Hán Việt (tưởng, học, ái...) hoặc nghĩa tiếng Việt (nhớ, học, yêu, nước...).
   - Hỗ trợ phím Enter để mở ngay kết quả đầu tiên, phím Esc hoặc nút ✕ để xóa nhanh.

2. ⚡ Mở Rộng Kho Chiết Tự Lên 531+ Chữ & 214 Bộ Thủ Khang Hy:
   - Tích hợp toàn diện 214 Bộ Thủ nguyên thủy và hàng trăm chữ Hán tần suất cao HSK 1 - HSK 6.
   - Thể hiện đầy đủ: Câu chuyện chiết tự, mẹo nhớ nhanh, cây phả hệ họ hàng, từ ghép thông dụng và mẫu câu ứng dụng.

3. 🤖 Bộ Phân Tích & Chiết Tự Tự Động (Auto-Decomposer):
   - Khi tra cứu BẤT KỲ TỪ NÀO từ kho từ điển (như 猫 - con mèo, 苹果 - quả táo, 电脑 - máy vi tính...):
   - Hệ thống tự động phân rã chữ thành các bộ thủ cấu thành, phân tích nguồn gốc hình thanh/hội ý, tạo câu chuyện gợi nhớ và câu ví dụ để hiển thị ngay lập tức!

4. 🔗 Liên Kết Đa Chiều Từ Cửa Sổ Tra Cứu (Word Modal):
   - Thêm nút "Xem Chiết Tự" trực tiếp trong hộp thoại tra từ, giúp chuyển hướng xem chiết tự chỉ với 1 cú nhấp chuột.

📦 Mã nguồn GitHub đã cập nhật:
https://github.com/huyentrang2003ltv-sys/chinese-daily.git

🌐 Trải nghiệm trực tuyến:
https://loading-diana-contractor-qty.trycloudflare.com`;

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
