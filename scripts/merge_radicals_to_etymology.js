const fs = require('fs');
const path = require('path');

const etymoPath = path.join(__dirname, '../data/etymology.json');
const radsPath = path.join(__dirname, '../data/radicals.json');

const currentList = JSON.parse(fs.readFileSync(etymoPath, 'utf8'));
const radicalsList = JSON.parse(fs.readFileSync(radsPath, 'utf8'));

const existingChars = new Set(currentList.map(item => item.hanzi));

let addedCount = 0;
for (const rad of radicalsList) {
  if (!existingChars.has(rad.char)) {
    const entry = {
      hanzi: rad.char,
      pinyin: rad.pinyin,
      hanviet: rad.hanviet ? rad.hanviet.replace(/^Bộ\s+/i, '').trim() : '',
      meaning: rad.meaning || `Bộ thủ ${rad.hanviet}`,
      level: 1,
      strokeCount: rad.strokes || 1,
      radicals: [
        {
          char: rad.char,
          name: rad.hanviet ? rad.hanviet.replace(/^Bộ\s+/i, '').trim() : 'Gốc',
          meaning: rad.meaning || 'Bộ thủ nguyên thủy'
        }
      ],
      etymologyStory: `Chữ ${rad.char} là một trong 214 Bộ Thủ Khang Hy cốt lõi (${rad.hanviet}). Vốn là chữ tượng hình nguyên thủy mô phỏng trực tiếp hình thái của sự vật trong tự nhiên: ${rad.meaning}. Đóng vai trò là gốc rễ cấu tạo nên hàng ngàn chữ Hán phái sinh mang nét nghĩa hoặc thuộc tính liên quan.`,
      memoryTip: `Chữ ${rad.char} là Bộ ${rad.hanviet} (${rad.meaning}) - gốc rễ tượng hình nền tảng gồm ${rad.strokes} nét.`,
      family: (rad.examples || []).slice(0, 4).map(ex => ({
        char: ex.char,
        pinyin: ex.pinyin || '',
        meaning: ex.meaning || 'Chữ ghép từ bộ thủ'
      })),
      commonWords: (rad.examples || []).map(ex => `${ex.char} (${ex.pinyin}: ${ex.meaning})`),
      example: {
        hanzi: (rad.examples && rad.examples.length) ? `这个汉字包含了「${rad.char}」字旁。` : `「${rad.char}」是常用的汉字部首。`,
        pinyin: (rad.examples && rad.examples.length) ? `Zhè ge hànzì bāohán le "${rad.char}" zìpáng.` : `"${rad.char}" shì chángyòng de hànzì bùshǒu.`,
        vi: `Chữ Hán này chứa bộ thủ 「${rad.char}」 (${rad.hanviet}).`
      }
    };

    currentList.push(entry);
    existingChars.add(rad.char);
    addedCount++;
  }
}

fs.writeFileSync(etymoPath, JSON.stringify(currentList, null, 2), 'utf8');
console.log(`Successfully merged ${addedCount} radicals into etymology. Total etymology entries now: ${currentList.length}`);
