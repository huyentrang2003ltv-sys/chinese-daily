const fs = require('fs');

const jc = JSON.parse(fs.readFileSync('data/hanyu_jiaocheng.json', 'utf8'));
const v22 = jc.lessons.find(l => l.volume === '2-2');
console.log('Dialogues[0] keys:', Object.keys(v22.dialogues[0]));
console.log('Dialogues[0]:', v22.dialogues[0]);
