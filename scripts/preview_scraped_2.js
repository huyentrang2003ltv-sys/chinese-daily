const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scripts/thuonghai_scraped_roadmaps.json', 'utf8'));

console.log('=== 4. TRỌNG TÂM NGỮ PHÁP HSK 3.0 (Preview) ===');
console.log(data.trong_tam_ngu_phap.slice(0, 1500));

console.log('\n=== 5. CẤU TRÚC PHẦN DỊCH TRONG HSK 3.0 (Preview) ===');
console.log(data.cau_truc_phan_dich.slice(0, 1500));

console.log('\n=== 6. CHỦ ĐỀ TỪ VỰNG MỚI TRONG HSK 3.0 (Preview) ===');
console.log(data.chu_de_moi.slice(0, 1500));
