// scripts/data/compile_150_dialogues.js
const fs = require('fs');
const path = require('path');

const d1 = require('./topic_data_01_03.js');
const d2 = require('./topic_data_04_06.js');
const d3 = require('./topic_data_06_08.js');
const d4 = require('./topic_data_07_09.js');
const d5 = require('./topic_data_10_12.js');
const d6 = require('./topic_data_13_15.js');

const rawAll = [...d1, ...d2, ...d3, ...d4, ...d5, ...d6];

const TOPICS_META = [
  { id: 1, name: '1. Chào hỏi và giới thiệu bản thân', short: 'Chào hỏi & Giới thiệu', icon: '👋' },
  { id: 2, name: '2. Giao tiếp hàng ngày', short: 'Giao tiếp hàng ngày', icon: '☕' },
  { id: 3, name: '3. Gia đình và bạn bè', short: 'Gia đình & Bạn bè', icon: '👨‍👩‍👧‍👦' },
  { id: 4, name: '4. Ăn uống và nhà hàng', short: 'Ăn uống & Nhà hàng', icon: '🍜' },
  { id: 5, name: '5. Mua sắm', short: 'Mua sắm & Giá cả', icon: '🛍️' },
  { id: 6, name: '6. Du lịch và phương tiện di chuyển', short: 'Du lịch & Di chuyển', icon: '✈️' },
  { id: 7, name: '7. Khách sạn và lưu trú', short: 'Khách sạn & Lưu trú', icon: '🏨' },
  { id: 8, name: '8. Học tập và trường học', short: 'Học tập & Trường học', icon: '🎓' },
  { id: 9, name: '9. Công việc và nghề nghiệp', short: 'Công việc & Phỏng vấn', icon: '💼' },
  { id: 10, name: '10. Sức khỏe và bệnh viện', short: 'Sức khỏe & Y tế', icon: '🏥' },
  { id: 11, name: '11. Giải trí và sở thích', short: 'Giải trí & Sở thích', icon: '🎬' },
  { id: 12, name: '12. Công nghệ và Internet', short: 'Công nghệ & Internet', icon: '💻' },
  { id: 13, name: '13. Giao tiếp xã hội', short: 'Giao tiếp xã hội', icon: '🤝' },
  { id: 14, name: '14. Tình huống khẩn cấp và dịch vụ công cộng', short: 'Khẩn cấp & Công cộng', icon: '🚨' },
  { id: 15, name: '15. Các tình huống nâng cao', short: 'Chuyên sâu & Nâng cao', icon: '🌟' }
];

const normalized = rawAll.map((item, idx) => {
  const num = item.number || item.num || (idx + 1);
  const topicId = item.topicId || item.top || Math.min(15, Math.floor((num - 1) / 10) + 1);
  const topMeta = TOPICS_META.find(t => t.id === topicId) || TOPICS_META[0];

  // Characters
  const rawChars = item.characters || item.c || [];
  const characters = rawChars.map(c => ({
    name: c.name || c.n || 'Nhân vật',
    role: c.role || c.r || 'Người nói',
    gender: c.gender || c.g || 'female',
    avatar: c.avatar || c.a || (c.gender === 'male' || c.g === 'male' ? '👨' : '👩')
  }));

  // Dialogue
  const rawD = item.dialogue || item.d || [];
  const dialogue = rawD.map(line => ({
    speaker: line.speaker || line.s || characters[0]?.name || 'Người nói',
    gender: line.gender || line.g || 'female',
    hanzi: line.hanzi || line.hz || '',
    pinyin: line.pinyin || line.py || '',
    vi: line.vi || line.m || ''
  }));

  // Vocabulary
  const rawV = item.vocabulary || item.v || [];
  const vocabulary = rawV.map(v => ({
    hanzi: v.hanzi || v.hz || '',
    pinyin: v.pinyin || v.py || '',
    meaning: v.meaning || v.m || v.vi || '',
    hsk: v.hsk || v.lvl || item.level || item.lvl || 'HSK 3'
  }));

  // Grammar
  const rawG = item.grammar || item.g || [];
  const grammar = Array.isArray(rawG) ? rawG.map(g => ({
    title: g.title || g.t || 'Điểm ngữ pháp trọng tâm',
    structure: g.structure || g.s || '',
    explanation: g.explanation || g.exp || g.e || '',
    example: typeof g.example === 'object' && g.example ? (g.example.hanzi || g.example.hz || JSON.stringify(g.example)) : (g.example || g.ex || g.e || '')
  })) : [];

  // Quiz
  const rawQ = item.quiz || item.q || item.qz || [];
  const quiz = Array.isArray(rawQ) ? rawQ.map(q => {
    const opts = q.options || q.opts || q.o || ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'];
    return {
      question: q.question || q.q || 'Câu hỏi thấu hiểu nội dung hội thoại?',
      options: opts,
      answer: typeof q.answer === 'number' ? q.answer : (typeof q.a === 'number' ? q.a : 0),
      explanation: q.explanation || q.exp || ''
    };
  }) : [];

  // Speaking Practice
  const rawSp = item.speakingPractice || item.sp || {};
  const speakingPractice = {
    targetHanzi: rawSp.targetHanzi || rawSp.hz || (dialogue[0]?.hanzi || ''),
    targetPinyin: rawSp.targetPinyin || rawSp.py || (dialogue[0]?.pinyin || ''),
    targetVi: rawSp.targetVi || rawSp.vi || (dialogue[0]?.vi || ''),
    tip: rawSp.tip || 'Chú ý phát âm chuẩn thanh điệu, ngữ điệu tự nhiên và ngắt nghỉ đúng cụm từ.'
  };

  return {
    id: `conv_${num}`,
    number: num,
    topicId: topicId,
    topic: topMeta.name,
    topicShort: topMeta.short,
    topicIcon: topMeta.icon,
    level: item.level || item.lvl || 'HSK 3',
    title: item.title || `Bài ${num}`,
    titleHanzi: item.titleHanzi || item.hz || '',
    titlePinyin: item.titlePinyin || item.py || '',
    situation: item.situation || item.sit || '',
    characters: characters,
    dialogue: dialogue,
    vocabulary: vocabulary,
    grammar: grammar,
    quiz: quiz,
    speakingPractice: speakingPractice
  };
});

// Sort by number strictly
normalized.sort((a, b) => a.number - b.number);

console.log(`Successfully compiled ${normalized.length} situational dialogues!`);
console.log(`First item: #${normalized[0].number} - ${normalized[0].title} (${normalized[0].titleHanzi})`);
console.log(`Last item: #${normalized[normalized.length - 1].number} - ${normalized[normalized.length - 1].title} (${normalized[normalized.length - 1].titleHanzi})`);

// Validation
const missing = [];
for (let i = 1; i <= 150; i++) {
  if (!normalized.find(x => x.number === i)) missing.push(i);
}
if (missing.length > 0) {
  console.error('ERROR: Missing numbers:', missing);
  process.exit(1);
}

const outputPath = path.resolve(__dirname, '../../public/data/conversations_150.json');
fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2), 'utf-8');
console.log(`Written ${normalized.length} lessons to ${outputPath}`);
console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
