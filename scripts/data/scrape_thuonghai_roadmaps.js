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

function cleanHtmlToMarkdown(html) {
  // Extract between <div class="baiViet__detail ..."> or similar article content
  const startIdx = html.indexOf('class="baiViet__detail') !== -1 ? html.indexOf('class="baiViet__detail') :
                   html.indexOf('class="entry-content') !== -1 ? html.indexOf('class="entry-content') :
                   html.indexOf('<article');
  
  let slice = html;
  if (startIdx !== -1) {
    slice = html.slice(startIdx);
    const endIdx = slice.indexOf('class="binhLuan') !== -1 ? slice.indexOf('class="binhLuan') :
                   slice.indexOf('class="baiViet__lienQuan') !== -1 ? slice.indexOf('class="baiViet__lienQuan') :
                   slice.indexOf('</article>');
    if (endIdx !== -1) {
      slice = slice.slice(0, endIdx);
    }
  }

  return slice
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
    .replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, '\n| $1 |')
    .replace(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi, ' $1 |')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '...')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function scrapeKeyArticles() {
  const urls = [
    { key: 'lo_trinh_tu_hoc', url: 'https://tiengtrungthuonghai.vn/tuhoctiengtrung/lo-trinh-tu-hoc-hsk-3-0-tu-0-den-hsk-6/' },
    { key: 'chi_tiet_9_cap_bac', url: 'https://tiengtrungthuonghai.vn/tuhoctiengtrung/chi-tiet-9-cap-bac-hsk-3-0-tu-so-cap-den-cao-cap/' },
    { key: 'tu_vung_can_bao_nhieu', url: 'https://tiengtrungthuonghai.vn/tuhoctiengtrung/tu-vung-hsk-3-0-can-bao-nhieu/' },
    { key: 'trong_tam_ngu_phap', url: 'https://tiengtrungthuonghai.vn/tuhoctiengtrung/trong-tam-ngu-phap-hsk-3-0-co-ban/' },
    { key: 'cau_truc_phan_dich', url: 'https://tiengtrungthuonghai.vn/tuhoctiengtrung/cau-truc-phan-dich-trong-hsk-3-0/' },
    { key: 'chu_de_moi', url: 'https://tiengtrungthuonghai.vn/tuhoctiengtrung/tong-hop-cac-chu-de-tu-vung-moi-trong-hsk-3-0/' }
  ];

  const results = {};
  for (const item of urls) {
    try {
      console.log(`Scraping: ${item.key} (${item.url})...`);
      const rawHtml = await fetchUrl(item.url);
      const text = cleanHtmlToMarkdown(rawHtml);
      results[item.key] = text;
      console.log(`-> Scraped ${item.key}: ${text.length} chars`);
    } catch (e) {
      console.error(`Error scraping ${item.key}:`, e.message);
    }
  }

  fs.writeFileSync(scrapedFile('thuonghai_scraped_roadmaps.json'), JSON.stringify(results, null, 2), 'utf8');
  console.log('Saved all scraped roadmaps to scripts/thuonghai_scraped_roadmaps.json');
}

scrapeKeyArticles();
