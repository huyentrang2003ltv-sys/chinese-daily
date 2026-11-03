const fs = require('fs');

const lessons = JSON.parse(fs.readFileSync('data/lessons.json', 'utf8'));
const jc = JSON.parse(fs.readFileSync('data/hanyu_jiaocheng.json', 'utf8'));

const volumeToLevel = {
  '2-2': 4,
  '3-1': 5,
  '3-2': 6
};

let nextId = Math.max(...lessons.map(l => l.id)) + 1;
const newLessons = [];

jc.lessons.forEach(l => {
  const lvl = volumeToLevel[l.volume];
  if (!lvl) return;

  const grammarSummary = (l.grammarPoints || []).map(g => `• ${g.pointName}: ${g.formula} (${g.explanation})`).join('\n');
  const vocabWords = (l.vocabulary || []).map(v => ({
    title: v.hanzi || v.title,
    pinyin: v.pinyin,
    meaning: v.vietnamese || v.meaning,
    pos: v.pos || 'từ vựng'
  }));

  // Create lessons from dialogues
  (l.dialogues || []).forEach((d, idx) => {
    if (!d.hanzi || !d.vi) return;
    newLessons.push({
      id: nextId++,
      level: lvl,
      lesson: l.lessonNum || (idx + 1),
      vietnamese: d.vi,
      hanzi: d.hanzi,
      pinyin: d.pinyin,
      explanation: `• Ngữ cảnh: ${d.sectionTitle || l.titleMeaning}\n• Người nói: ${d.displayName || d.speaker} (${d.role || ''})\n${grammarSummary ? '• Ngữ pháp trọng tâm:\n' + grammarSummary : ''}`,
      words: vocabWords.slice(0, 5)
    });
  });
});

console.log('New lessons created for levels 4, 5, 6:', newLessons.length);
console.log('Level 4 count:', newLessons.filter(l => l.level === 4).length);
console.log('Level 5 count:', newLessons.filter(l => l.level === 5).length);
console.log('Level 6 count:', newLessons.filter(l => l.level === 6).length);
