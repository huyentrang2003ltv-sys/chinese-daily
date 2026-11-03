const https = require('https');

const botToken = '8928499760:AAFuVTM2dTjz3qrf7u-wX5e_Iqzp48z2gto';
const chatId = '8806102051';

const message = `🔍 [TỐI ƯU HÓA TOÀN DIỆN BỘ CÔNG CỤ TÌM KIẾM ĐA NĂNG & TRA TỪ THÔNG MINH] 🔍

Chào bạn! Hệ thống Học Tiếng Trung Mỗi Ngày đã được nâng cấp triệt để công cụ Tra cứu Hán tự, Pinyin, Hán Việt, Điển tích theo đúng góp ý của bạn:

✨ CHI TIẾT CẢI TIẾN CÔNG CỤ TRA CỨU:
1. 🔤 Đồng Hóa Âm Thanh & Dấu (Tone-less Pinyin & Accent-less Vietnamese):
   - Hỗ trợ gõ Pinyin KHÔNG CẦN DẤU: gõ "nihao", "xiexie", "laoshi", "zhongguo", "shui", "chifan" sẽ tự động tìm thấy chính xác "nǐhǎo (你好)", "xièxie (谢谢)", "lǎoshī (老师)", "zhōngguó (中国)".
   - Hỗ trợ gõ Tiếng Việt KHÔNG DẤU: gõ "xin chao", "cam on", "an com", "tam biet", "yeu" sẽ tìm thấy ngay từ vựng tương ứng.

2. 📜 Bổ Sung 100% Âm Hán Việt & Dữ Liệu 3.400+ Chữ:
   - Toàn bộ từ vựng từ điển nay đã có phiên âm Hán Việt chuẩn xác (VD: [Nhĩ Hảo], [Tạ Tạ], [Trung Quốc], [Bắc Kinh], [Ái]...).
   - Bổ sung ngay các từ giao tiếp cốt lõi HSK bị thiếu: 你好, 早上好, 晚上好, 晚安, 没关系, 不客气, 不用谢, 请问, 多少钱, 二, 九, 零, 分钟, 年, 读, 少, 看见...

3. 🏮 Tìm Kiếm Đa Phân Hệ (Omnisearch 5 Trong 1):
   - Tra cứu chéo tức thì giữa 5 kho dữ liệu: Từ Điển HSK 1-6 & Chủ Đề, 214 Bộ Thủ Khang Hy, Thành Ngữ Điển Tích, Chiết Tự Gốc Từ, và Lịch Sử Văn Hóa Triều Đại (Tần Thủy Hoàng, Nhà Đường, Tam Quốc...).

4. ⌨️ Điều Hướng Bàn Phím & Menu Gợi Ý Đẳng Cấp:
   - Dùng phím ↑ ↓ để di chuyển giữa các từ gợi ý, nhấn Enter để mở xem chi tiết ngay lập tức, Esc để đóng.
   - Bổ sung nút nghe phát âm giọng Nữ chuẩn ngay trên thanh gợi ý.
   - Hộp thoại chi tiết từ vựng hiển thị đầy đủ Hán Việt, nút Tập Viết Nét và nút Lưu Sổ Tay.

📦 Mã nguồn GitHub đã cập nhật:
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
