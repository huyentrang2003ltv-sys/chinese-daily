const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scripts/thuonghai_scraped_roadmaps.json', 'utf8'));

console.log('=== 1. LỘ TRÌNH TỰ HỌC TỪ 0 ĐẾN HSK 6 (Preview) ===');
console.log(data.lo_trinh_tu_hoc.slice(0, 1500));

console.log('\n=== 2. CHI TIẾT 9 CẤP BẬC HSK 3.0 (Preview) ===');
console.log(data.chi_tiet_9_cap_bac.slice(0, 1500));

console.log('\n=== 3. TỪ VỰNG HSK 3.0 CẦN BAO NHIÊU (Preview) ===');
console.log(data.tu_vung_can_bao_nhieu.slice(0, 1500));
