const https = require('https');

const botToken = '8928499760:AAFuVTM2dTjz3qrf7u-wX5e_Iqzp48z2gto';
const chatId = '8806102051';

const message = `🤝 [ĐÃ MỜI COLLABORATOR & CẬP NHẬT GITHUB EMAIL THÀNH CÔNG] 🤝

Chào bạn! Hệ thống đã hoàn tất cập nhật tài khoản GitHub cho email hoangpham1618@gmail.com:

1. 📧 Đã gửi lời mời Cộng tác viên (Collaborator - Quyền Write/Push) tới tài khoản GitHub:
   - Username: PhamHoang16 (Phạm Hoàng)
   - Email liên kết: hoangpham1618@gmail.com
   - Repository: huyentrang2003ltv-sys/chinese-daily
   - Link chấp nhận lời mời: https://github.com/huyentrang2003ltv-sys/chinese-daily/invitations

2. ⚙️ Cập nhật cấu hình Git (Local & Global):
   - user.name = PhamHoang16
   - user.email = hoangpham1618@gmail.com`;

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
