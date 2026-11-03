const { scrapedFile } = require('./paths');
const fs = require('fs');

const html = fs.readFileSync(scrapedFile('thuonghai_hsk30.html'), 'utf8');

const regex = /<div class="baiViet__content">[\s\S]*?<h4><a href="([^"]+)">([\s\S]*?)<\/a><\/h4>[\s\S]*?<p>([\s\S]*?)<\/p>/gi;

let match;
let count = 0;
const articles = [];
while ((match = regex.exec(html)) !== null) {
  count++;
  articles.push({
    num: count,
    url: match[1],
    title: match[2].trim(),
    excerpt: match[3].replace(/&hellip;/g, '...').trim()
  });
}

console.log('Total HSK 3.0 articles in category:', count);
articles.forEach(a => {
  console.log(`\n[${a.num}] ${a.title}`);
  console.log(`URL: ${a.url}`);
  console.log(`Excerpt: ${a.excerpt}`);
});
