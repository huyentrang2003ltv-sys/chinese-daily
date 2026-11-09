const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../server/http.js');
let code = fs.readFileSync(filePath, 'utf8');

const oldCsp = code.match(/const CSP = \[[\s\S]*?\]\.join\('; '\);/)[0];
const newCsp = `const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://accounts.google.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://api.vietqr.io https://images.unsplash.com https://*.googleusercontent.com https://*.fbcdn.net https://platform-lookaside.fbsbx.com",
  "media-src 'self' blob: https://dict.youdao.com",
  "connect-src 'self' https://cdn.jsdelivr.net https://accounts.google.com https://www.googleapis.com https://graph.facebook.com",
  "frame-src 'self' https://accounts.google.com https://www.facebook.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com https://www.facebook.com",
  "object-src 'none'"
].join('; ');`;

code = code.replace(oldCsp, newCsp);
fs.writeFileSync(filePath, code, 'utf8');
console.log('CSP updated successfully!');
