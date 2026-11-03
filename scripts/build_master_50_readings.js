const fs = require('fs');
const path = require('path');

const buildPart1 = require('./generate_readings_part1.js');
const buildPart2 = require('./generate_readings_part2.js');
const buildPart3 = require('./generate_readings_part3.js');

const p1 = buildPart1();
const p2 = buildPart2();
const p3 = buildPart3();

const all50 = [...p1, ...p2, ...p3];

console.log('Total articles assembled:', all50.length);

if (all50.length !== 50) {
  console.error('ERROR: Total count is not 50! Got:', all50.length);
  process.exit(1);
}

// Old ID mapping
const oldIdMap = {
  'reading_10': 'reading_cp_5',
  'reading_11': 'reading_culture_3',
  'reading_12': 'reading_culture_4',
  'reading_13': 'reading_1',
  'reading_14': 'reading_cp_2',
  'reading_17': 'reading_cp_1',
  'reading_18': 'reading_cp_3',
  'reading_19': 'reading_2',
  'reading_20': 'reading_news_2',
  'reading_30': 'reading_cp_4',
  'reading_31': 'reading_news_1',
  'reading_32': 'reading_news_5',
  'reading_38': 'reading_news_3',
  'reading_39': 'reading_news_4'
};

// Validate each article
all50.forEach((item, idx) => {
  if (oldIdMap[item.id]) {
    item.oldId = oldIdMap[item.id];
  }

  // Ensure categoryName matches category cleanly
  if (item.category === 'life' && !item.categoryName) {
    item.categoryName = 'Đời Sống Thường Nhật';
  } else if (item.category === 'inspiration' && !item.categoryName) {
    item.categoryName = 'Chuyện Chữa Lành & Trưởng Thành';
  } else if (item.category === 'culture' && !item.categoryName) {
    item.categoryName = 'Ngụ Ngôn & Cổ Điển';
  } else if (item.category === 'news' && !item.categoryName) {
    item.categoryName = 'Báo Chí Thời Sự & Khoa Học';
  } else if (item.category === 'philosophy' && !item.categoryName) {
    item.categoryName = 'Triết Lý Xử Thế & Cổ Học';
  }

  // Check required keys
  const reqKeys = ['id', 'title', 'pinyin', 'hanviet', 'level', 'category', 'categoryName', 'source', 'summary', 'vocab', 'paragraphs', 'moral', 'quiz'];
  reqKeys.forEach(k => {
    if (!item[k]) {
      console.warn(`Article ${item.id} (${item.title}) missing key: ${k}`);
    }
  });

  // Verify quiz
  if (!item.quiz || !item.quiz.question || !Array.isArray(item.quiz.options) || item.quiz.answer === undefined || !item.quiz.explanation) {
    console.warn(`Article ${item.id} has invalid quiz!`);
  }

  // Verify paragraphs
  if (!Array.isArray(item.paragraphs) || item.paragraphs.length === 0) {
    console.error(`Article ${item.id} has no paragraphs!`);
    process.exit(1);
  }
});

const outputPath = path.join(__dirname, 'data', 'readings.json');
fs.writeFileSync(outputPath, JSON.stringify(all50, null, 2), 'utf8');

console.log('SUCCESS! Successfully wrote 50 master readings to:', outputPath);

// Print summary breakdown
const levelCounts = {};
const catCounts = {};
all50.forEach(s => {
  levelCounts[s.level] = (levelCounts[s.level] || 0) + 1;
  catCounts[s.category] = (catCounts[s.category] || 0) + 1;
});
console.log('Level counts:', levelCounts);
console.log('Category counts:', catCounts);
