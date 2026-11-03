const fs = require('fs');
const path = require('path');
const { tokenizeParagraph } = require('./reading_tokenizer_helper.js');

const dataPath = path.join(__dirname, '../data/hanyu_jiaocheng.json');
const jiaocheng = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let totalParagraphs = 0;
let totalTokens = 0;

for (const lesson of jiaocheng.lessons) {
  if (lesson.narrative && lesson.narrative.paragraphs) {
    for (const p of lesson.narrative.paragraphs) {
      p.tokens = tokenizeParagraph(p.hanzi);
      totalParagraphs++;
      totalTokens += p.tokens.length;
    }
  }
}

fs.writeFileSync(dataPath, JSON.stringify(jiaocheng, null, 2), 'utf8');
console.log(`[Tokenization Complete] Processed ${totalParagraphs} paragraphs across ${jiaocheng.lessons.length} lessons with ${totalTokens} rich clickable tokens.`);
