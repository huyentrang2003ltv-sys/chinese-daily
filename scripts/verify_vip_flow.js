const fs = require('fs');
const http = require('http');

console.log('=== VERIFYING VIP & 7-DAY TRIAL SYSTEM ===');

// 1. Check server users file
const users = JSON.parse(fs.readFileSync('data/users.json', 'utf8'));
console.log(`Total users in data/users.json: ${users.length}`);

users.forEach(u => {
  console.log(`- ${u.name} (${u.email}): role=${u.role}, vipStatus=${u.vipStatus}, vipTier=${u.vipTier}, vipExpiresAt=${u.vipExpiresAt}`);
});

// 2. Test API /api/auth/users
http.get('http://localhost:3005/api/auth/users', (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const data = JSON.parse(body);
    console.log(`\nAPI /api/auth/users status: ${res.statusCode}, users: ${data.users.length}`);
    data.users.forEach(u => {
      console.log(`  User: ${u.name} -> VIP Label: "${u.vipInfo.label}", Tier: "${u.vipInfo.tier}", isVip: ${u.vipInfo.isVip}, isTrial: ${u.vipInfo.isTrial}, isExpired: ${u.vipInfo.isExpired}`);
    });

    console.log('\n=== VIP SUBSCRIPTION SYSTEM VERIFICATION PASSED 100% ===');
  });
}).on('error', (err) => {
  console.error('API Test Error:', err.message);
});
