const https = require('https');

const botToken = '8928499760:AAFuVTM2dTjz3qrf7u-wX5e_Iqzp48z2gto';
const chatId = '8806102051';

const message = `✍️ [TÍCH HỢP LUYỆN VIẾT NÉT TRỰC TIẾP KHI NHẤP VÀO CHỮ] ✍️

Chào bạn! Phần luyện viết nét chữ Hán đã được tối ưu hóa toàn diện theo đúng yêu cầu:

✨ CÁC CẢI TIẾN NỔI BẬT:
1. 🚫 Lược bỏ nút "Luyện Viết Nét" riêng lẻ trên thanh menu chính, giúp thanh menu thoáng mắt, gọn gàng và tập trung vào các luồng học tập chính.
2. 🎯 Tích hợp trực tiếp vào chữ Hán trên toàn hệ thống:
   - Kho Từ Điển (HSK 1-6 & Theo Chủ Đề): Nhấp trực tiếp vào chữ Hán hoặc nút bút viết ✍️ để mở bảng luyện viết.
   - 214 Bộ Thủ Khang Hy: Nhấp vào ô bộ thủ hoặc chữ mẫu tiêu biểu để xem thứ tự bút thuận.
   - Giáo Trình Hán Ngữ 6 Quyển: Nhấp vào từng từ mới trong bài để xem và tập viết từng nét ngay tại chỗ mà không bị mất trang bài học đang xem.
   - Sổ Tay Từ Vựng & Flashcard: Nhấp vào chữ Hán để mở bảng tập viết nét tức thì.
   - Kho Thành Ngữ 4 Chữ: Hỗ trợ chuyển tab nhanh giữa 4 chữ trong câu thành ngữ để luyện viết từng chữ một.
3. 📱 Hộp thoại Luyện Viết Nét (Writing Modal) tiện dụng:
   - Ô kẻ điền tự cách (田字格/米字格) tương tác chuẩn bút thuận HanziWriter.
   - Chế độ "Xem hoạt họa nét" & "Tự luyện viết (Quiz)".
   - Tự động nhận diện nét đúng/sai, gợi ý nét và chấm điểm thưởng EXP.
   - Tích hợp phát âm song giọng 👩 Nữ & 👨 Nam cho từng chữ.
   - Hỗ trợ nhập chữ Hán bất kỳ hoặc chọn nhanh 25+ chữ nền tảng ngay trong modal.

🌐 Trải nghiệm trực tuyến:
https://holdem-disclaimer-cheers-meat.trycloudflare.com
📦 Mã nguồn GitHub:
https://github.com/huyentrang2003ltv-sys/chinese-daily.git (Commit: ddbb4e4)`;

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
  console.error('Error sending Telegram notification:', err);
});

req.write(payload);
req.end();
