const https = require('https');

const botToken = '8928499760:AAFuVTM2dTjz3qrf7u-wX5e_Iqzp48z2gto';
const chatId = '8806102051';

const message = `🎓 [HOÀN TẤT NÂNG CẤP LỘ TRÌNH HSK 3.0 TOÀN DIỆN TỪ TIẾNG TRUNG THƯỢNG HẢI] 🎓

Chào bạn! Hệ thống Học Tiếng Trung Mỗi Ngày đã tích hợp toàn bộ kho tài liệu chuyên sâu và lộ trình chuẩn HSK 3.0 (3 Cấp 9 Bậc) theo phương pháp Tiếng Trung Thượng Hải:

🧭 CHI TIẾT NÂNG CẤP TAB "LỘ TRÌNH HSK 3.0" (6 PHÂN HỆ CHUYÊN SÂU):
1. 🧭 Lộ Trình 6 Giai Đoạn Khoa Học (Từ Con Số 0 Đến HSK 6 & 7-9):
   - Phân bổ chi tiết thời gian (tháng/tuần), thời gian biểu 90-150 phút/ngày.
   - Nêu rõ chuẩn đầu ra, số lượng từ vựng, chữ viết tay cho từng cấp độ.
   - Nút hành động "Vào học ngay" chuyển hướng tức thì tới bài học tương ứng.

2. 📊 Bảng Chuẩn Đối Chiếu 3 Cấp 9 Bậc:
   - Ma trận so sánh chi tiết HSK 2.0 (cũ) vs HSK 3.0 (mới) từ HSK 1 đến HSK 7-9.
   - Tích hợp số lượng từ vựng mới (11.092 từ), chữ viết tay (3.000 chữ), điểm ngữ pháp và quy đổi chuẩn khung CEFR (A1 đến C2+).
   - Thẻ phân tích triết lý 3 Cấp (Sơ cấp - Trung cấp - Cao cấp).

3. 📐 Trọng Tâm Ngữ Pháp Chuẩn (48 Cấu Trúc Toàn Diện):
   - Phân hạng 4 cấp độ: HSK 1 (14 cấu trúc), HSK 2 (12 cấu trúc), HSK 3 (8 cấu trúc), HSK 4-6 (14 cấu trúc nâng cao).
   - Đầy đủ công thức, giải thích tỉ mỉ, câu ví dụ chữ Hán, Pinyin, Tiếng Việt và nút phát âm kép giọng Nữ 👩 & Nam 👨.

4. 🌐 Kỹ Năng Dịch Thuật & Từ Vựng Thời Đại Mới:
   - Phân tích cấu trúc phần thi Dịch thuật mới (Biên dịch viết vs Phiên dịch nói phản xạ <3s).
   - Liên kết trực tiếp tới module thực hành tương tác HiHSK Pro.
   - Cung cấp 4 cụm từ vựng mới: Kỷ nguyên số & Mạng xã hội, AI & Công nghệ cao, Kinh tế số & Logistics, Môi trường xanh & Sống bền vững (kèm audio Nữ/Nam).

5. 📚 Kho Bài Học Từng Cấp Độ (HSK 1 Đến HSK 6):
   - Mở rộng bộ lọc đủ 6 cấp độ (HSK 1 - 6), tích hợp 1.040 bài học thực tế kèm từ vựng then chốt, ngữ pháp và phát âm giọng Nữ/Nam.

6. 📥 Tài Liệu & Đề Thi Miễn Phí:
   - Cung cấp liên kết chính thức tới trọn bộ Giáo trình HSK Standard Course (PDF + MP3), đề thi mô phỏng, sổ tay từ vựng.

📦 Mã nguồn GitHub đã cập nhật và push:
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
  });
});

req.on('error', err => {
  console.error('Telegram error:', err.message);
});

req.write(payload);
req.end();
