'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const RADICALS_PATH = path.join(ROOT, 'public', 'data', 'radicals.json');
const HANVIET_PATH = path.join(ROOT, 'public', 'data', 'hanviet_chars.json');
const OUTPUT_PATH = path.join(ROOT, 'public', 'data', 'hanzi_decompositions.json');

// Map of 214 radicals for quick component lookup
const radicalsData = JSON.parse(fs.readFileSync(RADICALS_PATH, 'utf8'));
const radicalMap = new Map();

radicalsData.forEach(r => {
  radicalMap.set(r.char, {
    char: r.char,
    name: r.hanviet ? r.hanviet.replace(/^Bộ\s+/i, '').trim() : 'Bộ',
    meaning: r.meaning || 'Bộ thủ gốc'
  });
  if (r.variants && Array.isArray(r.variants)) {
    r.variants.forEach(v => {
      radicalMap.set(v, {
        char: v,
        name: r.hanviet ? r.hanviet.replace(/^Bộ\s+/i, '').trim() : 'Bộ',
        meaning: r.meaning || 'Biến thể bộ thủ'
      });
    });
  }
});

// Common component extra lookup
const EXTRA_COMPONENTS = {
  '巴': { char: '巴', name: 'Ba', meaning: 'Con trăn uốn khúc / Âm đọc Ba' },
  '相': { char: '相', name: 'Tương', meaning: 'Quan sát, tương hỗ' },
  '与': { char: '与', name: 'Dữ', meaning: 'Cùng với, tham gia' },
  '乞': { char: '乞', name: 'Khất', meaning: 'Xin ăn, cầu khẩn' },
  '曷': { char: '曷', name: 'Hạt', meaning: 'Sao, sao lại / Âm đọc Hạt' },
  '豕': { char: '豕', name: 'Thỉ', meaning: 'Con heo, gia súc' },
  '卖': { char: '卖', name: 'Mại', meaning: 'Bán ra, phô diễn' },
  '耳': { char: '耳', name: 'Nhĩ', meaning: 'Cái tai, lắng nghe' },
  '见': { char: '见', name: 'Kiến', meaning: 'Nhìn thấy, đôi mắt' },
  '完': { char: '完', name: 'Hoàn', meaning: 'Trọn vẹn, hoàn hảo' },
  '景': { char: '景', name: 'Cảnh', meaning: 'Ánh nắng mặt trời, phong cảnh' },
  '彡': { char: '彡', name: 'Sam', meaning: 'Lông tóc dài, tia sáng rực rỡ' },
  '礻': { char: '礻', name: 'Thị', meaning: 'Bàn thờ, thần linh, chúc phúc' },
  '覀': { char: '覀', name: 'Á', meaning: 'Che đậy, phương Tây' },
  '又': { char: '又', name: 'Hựu', meaning: 'Bàn tay phải, lặp lại' },
  '己': { char: '己', name: 'Kỷ', meaning: 'Bản thân mình' },
  '各': { char: '各', name: 'Các', meaning: 'Mỗi người, từng phần' },
  '夕': { char: '夕', name: 'Tịch', meaning: 'Buổi chiều tối, hoàng hôn' },
  '卜': { char: '卜', name: 'Bốc', meaning: 'Bói toán, vết nứt mai rùa' },
  '亥': { char: '亥', name: 'Hợi', meaning: 'Ngôi thứ 12 địa chi' },
  '⺍': { char: '⺍', name: 'Bát (biến thể)', meaning: 'Hào toán học, ánh sáng' },
  '爻': { char: '爻', name: 'Hào', meaning: 'Quẻ bát quái, vạch toán tri thức' },
  '隹': { char: '隹', name: 'Chuy', meaning: 'Chim đuôi ngắn' },
  '页': { char: '页', name: 'Hiệt', meaning: 'Đầu người, trang giấy' },
  '戈': { char: '戈', name: 'Qua', meaning: 'Binh khí, cây giáo bảo vệ' }
};

Object.entries(EXTRA_COMPONENTS).forEach(([k, v]) => {
  if (!radicalMap.has(k)) radicalMap.set(k, v);
});

// Load Hán Việt lookup
let hanvietMap = new Map();
try {
  const hv = JSON.parse(fs.readFileSync(HANVIET_PATH, 'utf8'));
  if (Array.isArray(hv)) {
    hv.forEach(([c, r]) => hanvietMap.set(c, r));
  } else {
    Object.entries(hv).forEach(([c, r]) => hanvietMap.set(c, r));
  }
} catch (e) {
  console.warn('Could not load hanviet_chars.json', e.message);
}

// Ideographic Description Characters to strip for component extraction
const IDC_REGEX = /[\u2FF0-\u2FFB\u31EF？?]/g;

async function run() {
  console.log('Fetching MakeMeAHanzi dictionary...');
  const res = await fetch('https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt');
  if (!res.ok) throw new Error('Failed to fetch dictionary: ' + res.status);
  const text = await res.text();
  const lines = text.trim().split('\n');
  console.log('Fetched', lines.length, 'entries from MakeMeAHanzi.');

  const decompMap = {};

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      const ch = entry.character;
      if (!ch || ch.length !== 1) continue;

      const decompStr = entry.decomposition || '';
      // Extract unique constituent components
      const rawComponents = decompStr.replace(IDC_REGEX, '').split('');
      const uniqueComponents = [...new Set(rawComponents)].filter(c => c !== ch);

      // If radical property exists and not in components, add it
      if (entry.radical && entry.radical !== ch && !uniqueComponents.includes(entry.radical)) {
        uniqueComponents.unshift(entry.radical);
      }

      // Etymology type in Vietnamese
      const etym = entry.etymology || null;
      let etymTypeVi = 'Hội ý (会意)';
      if (etym && etym.type) {
        if (etym.type === 'pictographic') etymTypeVi = 'Tượng hình (象形)';
        else if (etym.type === 'ideographic') etymTypeVi = 'Hội ý (会意)';
        else if (etym.type === 'pictophonetic') etymTypeVi = 'Hình thanh (形声)';
        else if (etym.type === 'indicative') etymTypeVi = 'Chỉ sự (指事)';
      }

      decompMap[ch] = {
        c: uniqueComponents,
        r: entry.radical || '',
        d: decompStr,
        t: etymTypeVi,
        h: etym ? (etym.hint || '') : '',
        p: etym && etym.phonetic ? etym.phonetic : null,
        s: etym && etym.semantic ? etym.semantic : null,
        m: entry.definition || ''
      };
    } catch (e) {
      // ignore
    }
  }

  const keys = Object.keys(decompMap);
  console.log(`Processed ${keys.length} valid Chinese character decompositions.`);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(decompMap), 'utf8');
  console.log(`Saved to ${OUTPUT_PATH} (${(fs.statSync(OUTPUT_PATH).size / 1024 / 1024).toFixed(2)} MB).`);
}

run().catch(err => {
  console.error('Build error:', err);
  process.exit(1);
});
