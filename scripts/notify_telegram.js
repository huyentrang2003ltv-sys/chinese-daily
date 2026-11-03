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

const message = `🏮 [HỌC TIẾNG TRUNG MỖI NGÀY - ĐÃ NÂNG CẤP THANH TÌM KIẾM & BỘ ĐẾM TRUY CẬP] 🏮

Chào bạn! Hệ thống vừa hoàn tất 2 nâng cấp lớn:

🔍 1. TỐI ƯU TOÀN DIỆN CÔNG CỤ TÌM KIẾM (Tra cứu Hán tự, Pinyin, Hán Việt, Điển tích):
- Phân biệt thông minh giữa tiếng Việt có dấu ("tôi", "bạn", "yêu", "học", "nhà", "ăn", "uống"...) và Pinyin/Hán Việt không dấu ("ban", "yeu", "toi").
- So khớp định nghĩa chính xác (exact meaning term match) với trọng số ưu tiên cao nhất, đưa ngay từ chuẩn lên Top 1 (gõ "tôi" ra 我, "bạn" ra 你/朋友, "yêu" ra 爱, "học" ra 学).
- Hỗ trợ tra cứu đa phân hệ: Từ điển HSK 1-6, Chiết tự Hán tự, 214 Bộ thủ, Thành ngữ điển cố, Triều đại lịch sử, và toàn bộ 76 bài Giáo trình Hán ngữ (gõ "bài 1" mở ngay bài 1).
- Tích hợp nút nghe phát âm Bắc Kinh chuẩn ngay trong ô gợi ý tìm kiếm.

👥 2. CHỨC NĂNG HIỂN THỊ NGƯỜI TRUY CẬP TRỰC TUYẾN:
- Badge đếm người học trực tuyến với đèn xanh nhấp nháy ngay trên Header.
- Thanh thống kê truy cập sang trọng ở chân trang (Footer): Trực tuyến, Hôm nay, Tích lũy.
- Bảng chi tiết thống kê (Popup Modal): Biểu đồ phân bổ địa lý (Hà Nội, TP.HCM, Đà Nẵng, Bắc Kinh, Đài Loan) và dòng tin hoạt động học tập thời gian thực.

⚡ Link trực tuyến mới nhất: ${activeUrl}
📦 Git Repository: https://github.com/huyentrang2003ltv-sys/chinese-daily`;

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
