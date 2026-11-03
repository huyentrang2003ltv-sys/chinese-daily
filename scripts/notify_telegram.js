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

const message = `🏮 [HỌC TIẾNG TRUNG MỖI NGÀY - RA MẮT TRANG CHỦ DASHBOARD THÔNG MINH] 🏮

Chào bạn! Giao diện Trang Chủ (Home Dashboard) theo phong cách Sang Trọng Phương Đông đã chính thức được triển khai hoàn tất:

🌟 5 KHỐI TÍNH NĂNG ĐẶC SẮC TRÊN TRANG CHỦ MỚI:
1. ☀️ BANNER CHÀO BUỔI & NHIỆM VỤ HÔM NAY:
   - Lời chào cá nhân hóa theo thời gian trong ngày (Sáng, Trưa, Chiều, Tối).
   - Danh ngôn phương Đông mỗi ngày (每日一言) kèm audio phát âm chuẩn.
   - Chuỗi học tập (Streak 🔥) kèm nút "Điểm Danh Nhận Thưởng" (+20 EXP).
   - 3 Nhiệm vụ ngày (Daily Quests) có thanh tiến trình nhận tới +75 EXP.

2. 📚 KHỐI TIẾP TỤC BÀI ĐANG HỌC (RESUME LEARNING):
   - Tự động ghi nhớ bài học gần nhất (ví dụ: Hán Ngữ 1 - Bài 4: 你去哪儿？).
   - Nút 1-click "Mở Bài Học Tiếp Tục" đưa thẳng vào nội dung bài đang học dở.

3. ✍️ KHỐI CHỮ HÁN CỦA NGÀY (今日一字):
   - Tích hợp HanziWriter tương tác vẽ nét chữ Phúc (福) trên ô Mễ tự (米字格).
   - Nút xem mô phỏng nét bút thư pháp, tự tập viết chấm điểm, và phát âm pinyin chuẩn.

4. 🧭 4 TRỤ CỘT HỌC TẬP TRỌNG TÂM:
   - 🧭 Lộ trình chuẩn HSK 3.0 (48 bài Standard Course).
   - 📖 Giáo trình Hán ngữ 6 quyển BLCU (76 bài toàn tập).
   - 🌐 Luyện dịch thực chiến HiHSK & Trợ lý AI đàm thoại.
   - ✍️ Chiết tự, 214 Bộ thủ & 14.605 từ vựng 125 chủ đề.

5. 🏆 THI ĐUA CỘNG ĐỒNG & MINI QUIZ:
   - Bảng Vàng Học Viên Tuần (Top 5 Thư Sinh Xuất Sắc dẫn đầu bởi Phạm Hoàng & Huyền Trang).
   - Câu đố nhanh ngữ pháp hôm nay (+15 EXP) phản hồi đúng sai tức thì.

🌐 Trải nghiệm trực tiếp ngay tại:
${activeUrl}

Chúc bạn có những giờ phút học tập và tu luyện tiếng Trung đầy cảm hứng! 🏮`;

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
