'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(PUBLIC, 'dist');
fs.mkdirSync(DIST, { recursive: true });

const html = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');

const scriptSrcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)]
  .map(m => m[1])
  .filter(src => !/^https?:/.test(src));

console.log(`Found ${scriptSrcs.length} frontend scripts to bundle...`);

let combinedCode = '/* Hi HSK - Học Tiếng Trung Mỗi Ngày Unified Production Bundle */\n';
let totalOriginalBytes = 0;

for (const src of scriptSrcs) {
  const filePath = path.join(PUBLIC, src.split('?')[0]);
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Missing file ${filePath}`);
    continue;
  }
  const code = fs.readFileSync(filePath, 'utf8');
  totalOriginalBytes += code.length;
  combinedCode += `\n/* --- FILE: ${src} --- */\n(function(){\n${code}\n})();\n`;
}

const bundlePath = path.join(DIST, 'app.bundle.js');
fs.writeFileSync(bundlePath, combinedCode, 'utf8');

console.log(`✓ Generated ${bundlePath}`);
console.log(`  Original total size: ${(totalOriginalBytes / 1024).toFixed(1)} KB`);
console.log(`  Combined bundle size: ${(combinedCode.length / 1024).toFixed(1)} KB`);
