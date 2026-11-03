const { scrapedFile } = require('./paths');
const fs = require('fs');

const html = fs.readFileSync(scrapedFile('thuonghai_detail.html'), 'utf8');

// Find the entry-content div
const contentMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<!-- \.entry-content -->/i) ||
                     html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

if (contentMatch) {
  const text = contentMatch[1]
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, '\n### $2\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  console.log('Main Content Preview:\n');
  console.log(text.slice(0, 3000));
  fs.writeFileSync(scrapedFile('article_text.txt'), text, 'utf8');
} else {
  console.log('No entry-content match found');
}
