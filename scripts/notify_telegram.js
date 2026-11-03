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

const message = `🏮 [HỌC TIẾNG TRUNG MỖI NGÀY - TỐI ƯU TOÀN DIỆN HSK 3.0 THEO TIẾNG TRUNG THƯỢNG HẢI] 🏮

Chào bạn! Hệ thống vừa được nghiên cứu và tối ưu hóa vượt bậc phần học HSK 3.0 dựa trên toàn bộ tài liệu giáo trình chính thống từ https://tiengtrungthuonghai.vn/:

📚 1. BỘ 48 BÀI HỌC GIÁO TRÌNH CHUẨN HSK 3.0 SƠ CẤP (STANDARD COURSE):
- Tích hợp trọn vẹn 48 bài học chuẩn khảo thí BLCU: HSK 1 (15 bài), HSK 2 (15 bài) & HSK 3 (18 bài).
- Đầy đủ tiêu đề Trung - Pinyin - Việt, Ngữ pháp nguyên mẫu, Chủ điểm từ vựng, Đoạn hội thoại mẫu nòng cốt kèm nghe giọng Bắc Kinh (Nữ/Nam) và Mẹo văn hóa thực tế thời đại số 4.0.
- Tìm kiếm tức thì và lọc bài theo từng cấp độ HSK 1, 2, 3.

📊 2. MA TRẬN ĐỔI MỚI CẤU TRÚC ĐỀ THI HSK 3.0 & HSKK:
- Bảng đối chiếu chi tiết giữa HSK 2.0 và HSK 3.0 qua từng cấp độ (HSK 1 đến HSK 7-9 và HSKK 3-6).
- Phân tích số câu hỏi, thời gian làm bài, yêu cầu viết đoạn 80-200 từ và chiến thuật phòng thi điểm cao từ giảng viên Tiếng Trung Thượng Hải.

📖 3. CẨM NANG SO SÁNH 4 BỘ GIÁO TRÌNH KINH ĐIỂN:
- Đặt lên bàn cân: Giáo trình Chuẩn HSK 3.0 vs Hán ngữ 6 quyển (BLCU) vs Boya (PKU) vs Phát triển Hán ngữ.
- Phân tích ưu/nhược điểm và lộ trình phối hợp sách giúp người tự học đạt hiệu quả tối đa.

🌐 4. PHÒNG LUYỆN DỊCH THỰC CHIẾN 6 TÌNH HUỐNG (HSK 3.0 TRANSLATION LAB):
- Thực hành kỹ năng Dịch hai chiều (Trung - Việt & Việt - Trung) - chốt chặn đột phá mới của HSK 3.0.
- Chấm điểm tức thì, phân tích công thức câu nòng cốt (S-V-O, định ngữ trước 的, trạng ngữ thời gian/địa điểm, câu chữ 把 & 被).

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
