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

const message = `🧩 [HỌC TIẾNG TRUNG MỖI NGÀY - RA MẮT MINIGAME XẾP KHỐI GỖ 汉语积木] 🏮

Chào bạn! Trò chơi "Xếp khối gỗ tiếng Trung (汉语积木)" với 60 cấp độ đã chính thức được phát hành:

🌟 ĐẶC ĐIỂM NỔI BẬT CỦA TRÒ CHƠI:
🪵 1. GIAO DIỆN KHỐI GỖ CHÂN THỰC 3D:
   - Bàn cờ gỗ mun, gỗ óc chó và khay gỗ sồi tự nhiên với độ sâu và bóng đổ chân thực.
   - Các khối gỗ đa hình dạng (hình vuông, thanh dài, chữ L, chữ T) khắc chữ Hán nhũ vàng.
   - Hiệu ứng âm thanh va chạm gỗ tự nhiên "lách cách" bằng Web Audio API cực kỳ thỏa mãn!

🗺️ 2. HỆ THỐNG 60 LEVEL PHÂN HÓA RÕ RỆT:
   - 🟢 Sơ Cấp (Level 1 - 20): Ghép câu ngắn, từ vựng nền tảng HSK 1 - 2, chào hỏi, đời sống.
   - 🟡 Trung Cấp (Level 21 - 40): Ghép câu phức có liên từ (虽然...但是, 因为...所以), câu chữ 把/被, HSK 3 - 4.
   - 🔴 Cao Cấp (Level 41 - 60): Ghép đoạn văn dài, thành ngữ điển cố (Chày sắt mài kim, Tái ông thất mã, Thư sơn hữu lộ), HSK 5 - 6.

🎯 3. CƠ CHẾ CHƠI LINH HOẠT & THÔNG MINH:
   - Kéo thả siêu mượt hoặc Chạm chọn khối rồi chạm ô cờ để đặt (tối ưu hoàn hảo cho cả điện thoại và máy tính).
   - Kiểm tra đáp án tự động / thủ công (验答), chấm điểm 3 sao ⭐⭐⭐ và thưởng EXP.
   - Đọc phát âm chuẩn giọng Bắc Kinh toàn bộ câu/đoạn văn khi giải xong.
   - Công cụ trợ giúp: Xem trước Nghĩa Tiếng Việt, Gợi ý tự đặt khối, và Xếp lại từ đầu.

🌐 Trải nghiệm trò chơi ngay tại:
${activeUrl}

Chúc bạn có những giờ phút vừa chơi xếp hình vừa thẩm thấu tiếng Trung đầy hứng khởi! 🏮`;

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
