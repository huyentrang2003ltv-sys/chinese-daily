const https = require('https');

const botToken = '8928499760:AAFuVTM2dTjz3qrf7u-wX5e_Iqzp48z2gto';
const chatId = '8806102051';

const message = `🎉 [HOÀN TẤT CẬP NHẬT KHO TỪ ĐIỂN 2 MỤC LỚN & ĐỒNG BỘ GIỌNG ĐỌC] 🎉

Chào bạn! Kho từ điển trên hệ thống Học Tiếng Trung Mỗi Ngày đã được nâng cấp hoàn thiện chia thành 2 mục lớn theo đúng yêu cầu:

📚 MỤC 1: TỪ MỚI HSK 1 - HSK 6 (1,672 từ)
- Phân tầng chuẩn hóa cấp độ HSK 1 đến HSK 6
- Bộ lọc linh hoạt: Tất cả cấp độ, HSK 1, 2, 3, 4, 5, 6
- Tìm kiếm tức thì theo chữ Hán, Pinyin và nghĩa tiếng Việt
- Thẻ từ vựng hiển thị chữ Hán lớn, Pinyin, từ loại, phân tích ý nghĩa
- Nút tính năng: Lưu vào sổ tay, Tập viết nét chữ
- Song giọng đọc chuẩn Bắc Kinh: 👩 Nữ (Xiaoxiao) & 👨 Nam (Yunxi) cho cả từ vựng và câu ví dụ ngữ cảnh

🏷️ MỤC 2: TỪ VỰNG THEO CHỦ ĐỀ (14 Chủ đề đời sống thực tế)
1. 🍜 Ẩm Thực & Đồ Ăn (108 từ)
2. 👨‍👩‍👧‍👦 Gia Đình & Xưng Hô (64 từ)
3. ✈️ Du Lịch & Khách Sạn (20 từ)
4. 💼 Công Sở & Kinh Doanh (25 từ)
5. 🎓 Giáo Dục & Trường Học (56 từ)
6. 🛍️ Mua Sắm & Thời Trang (34 từ)
7. 🏥 Sức Khỏe & Y Tế (26 từ)
8. 🏠 Đời Sống & Nhà Cửa (39 từ)
9. 🚗 Giao Thông & Đi Lại (37 từ)
10. 📱 Công Nghệ & Kỹ Thuật Số (20 từ)
11. 🌦️ Thời Tiết & Thiên Nhiên (23 từ)
12. 💬 Cảm Xúc & Tâm Lý (20 từ)
13. 🎨 Tính Cách & Ngoại Hình (156 từ)
14. 🌐 Giao Tiếp & Xã Hội (1,044 từ)

🎙️ ĐỒNG BỘ 100% GIỌNG ĐỌC NAM & NỮ:
- Bất cứ nơi nào có biểu tượng loa, người học đều có thể chọn ngay giữa 👩 Nữ (Xiaoxiao) và 👨 Nam (Yunxi).
- Thanh chọn giọng đọc trên header đã được lược bỏ tinh gọn.

🌐 Trải nghiệm trực tuyến:
https://holdem-disclaimer-cheers-meat.trycloudflare.com
📦 Mã nguồn GitHub:
https://github.com/huyentrang2003ltv-sys/chinese-daily.git (Commit: bf4200f)`;

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
    console.log('Telegram response body:', body);
  });
});

req.on('error', err => {
  console.error('Error sending Telegram notification:', err);
});

req.write(payload);
req.end();
