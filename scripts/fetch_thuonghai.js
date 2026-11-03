const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
    const html = await fetchUrl('https://tiengtrungthuonghai.vn/tuhoc_mucluc/tai-lieu-hsk-3-0/');
    console.log('Fetched successfully! HTML length:', html.length);
    // Extract title, headings, links
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    console.log('Page Title:', titleMatch ? titleMatch[1] : 'No title');
    
    // Save to scratch file for inspection
    const fs = require('fs');
    fs.writeFileSync('scripts/thuonghai_hsk30.html', html, 'utf8');
    console.log('Saved to scripts/thuonghai_hsk30.html');
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
}

run();
