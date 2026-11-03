const { scrapedFile } = require('./paths');
const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) {
          const u = new URL(url);
          loc = u.origin + loc;
        }
        return fetchUrl(loc).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('Status: ' + res.statusCode));
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const html = await fetchUrl('https://tiengtrungthuonghai.vn/tai-lieu-hoc-co-ban/');
    fs.writeFileSync(scrapedFile('thuonghai_detail.html'), html, 'utf8');
    console.log('Saved detail page. Length:', html.length);
    
    // Extract main text content
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    console.log('H1 Title:', titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '');

    // Search for all HSK 3.0 related links on the site
    const links = html.match(/href="([^"]*hsk[^"]*)"/gi) || [];
    console.log('Unique HSK links on page:', Array.from(new Set(links)));
  } catch (e) {
    console.error(e);
  }
}

run();
