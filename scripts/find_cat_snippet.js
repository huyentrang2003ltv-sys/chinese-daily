const fs = require('fs');

const html = fs.readFileSync('scripts/thuonghai_hsk30.html', 'utf8');

const idx = html.indexOf('Đang tìm hiểu về HSK 3.0');
console.log('Index of excerpt in thuonghai_hsk30.html:', idx);
if (idx !== -1) {
  console.log('Snippet around excerpt in category page:\n', html.slice(idx - 400, idx + 1000));
}
