// Shrinks public/data/thematic_vocab.json to the fields the app actually renders.
// Topic name/icon live in topics.json; scraped image/audio URLs and zhuyin are unused;
// "hanviet" is kept only when it is real Hán Việt rather than tone-less pinyin.
const fs = require('fs');
const { dataFile } = require('./paths');

const file = dataFile('thematic_vocab.json');
const words = JSON.parse(fs.readFileSync(file, 'utf8'));

const toneless = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-zA-Z]/g, '').toLowerCase();

const slim = words.map(w => {
  const out = { title: w.title, pinyin: w.pinyin, meaning: w.meaning, level: w.level, topicId: w.topicId };
  if (w.hanviet && toneless(w.hanviet) !== toneless(w.pinyin)) out.hanviet = w.hanviet;
  if (w.pos && w.pos !== 'từ vựng') out.pos = w.pos;
  if (w.exampleSentence) {
    out.exampleSentence = w.exampleSentence;
    out.examplePinyin = w.examplePinyin || '';
    out.exampleMeaning = w.exampleMeaning || '';
  }
  return out;
});

fs.writeFileSync(file, JSON.stringify(slim));
console.log(`thematic_vocab.json: ${words.length} words, ${(fs.statSync(file).size / 1048576).toFixed(2)} MB`);
