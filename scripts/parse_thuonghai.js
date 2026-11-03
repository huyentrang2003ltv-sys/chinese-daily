const fs = require('fs');

const html = fs.readFileSync('scripts/thuonghai_hsk30.html', 'utf8');

// Extract post titles, links, excerpts, images
const postRegex = /<article[^>]*>([\s\S]*?)<\/article>/gi;
let match;
const posts = [];

while ((match = postRegex.exec(html)) !== null) {
  const content = match[1];
  const titleMatch = content.match(/<h[23][^>]*class="[^"]*entry-title[^"]*"[^>]*><a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/h[23]>/i) ||
                     content.match(/<h[23][^>]*><a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/h[23]>/i);
  const excerptMatch = content.match(/<div class="[^"]*entry-summary[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                       content.match(/<p>([\s\S]*?)<\/p>/i);
  
  if (titleMatch) {
    posts.push({
      link: titleMatch[1],
      title: titleMatch[2].replace(/<[^>]+>/g, '').trim(),
      excerpt: excerptMatch ? excerptMatch[1].replace(/<[^>]+>/g, '').trim() : ''
    });
  }
}

console.log('Total articles found in category page:', posts.length);
posts.forEach((p, idx) => {
  console.log(`\n[${idx + 1}] ${p.title}`);
  console.log(`Link: ${p.link}`);
  console.log(`Excerpt: ${p.excerpt.slice(0, 150)}...`);
});

// Also check pagination or sub-categories
const paginationMatch = html.match(/class="[^"]*pagination[^"]*"[\s\S]*?<\/nav>/i) || html.match(/class="page-numbers"[\s\S]*?<\/ul>/i);
if (paginationMatch) {
  console.log('\nPagination links:', paginationMatch[0].match(/href="([^"]+)"/g));
}
