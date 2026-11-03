const fs = require('fs');

const html = fs.readFileSync('scripts/thuonghai_detail.html', 'utf8');

// Find all article or post or content containers
const matches = html.match(/class="([^"]*(content|post|article|body)[^"]*)"/gi);
console.log('Class matches:', Array.from(new Set(matches)).slice(0, 20));

// Find where "Đang tìm hiểu về HSK 3.0" is located
const idx = html.indexOf('Đang tìm hiểu về HSK 3.0');
console.log('Index of excerpt in html:', idx);
if (idx !== -1) {
  console.log('Snippet around excerpt:\n', html.slice(idx - 100, idx + 2000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}
