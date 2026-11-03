const https = require('https');

const options = {
  hostname: 'quantri.tiengtrunggioi.vn',
  path: '/api/public/v1/vocabularytopics/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Total topics returned:', (json.data || []).length);
      (json.data || []).forEach(t => {
        console.log(`- [${t.code || t.id}] ${t.name} (Vocabs: ${t.totalVocabularies}, isFree: ${t.isFree})`);
      });
    } catch (e) {
      console.error(e);
    }
  });
});

req.on('error', console.error);
req.write(JSON.stringify({ pageSize: 100, pageIndex: 1 }));
req.end();
