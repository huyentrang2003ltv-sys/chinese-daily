const fs = require('fs');

const jc = JSON.parse(fs.readFileSync('data/hanyu_jiaocheng.json', 'utf8'));

console.log('Keys of lesson 0:', Object.keys(jc.lessons[0]));
console.log('Sample lesson 0:', jc.lessons[0].lessonNum, jc.lessons[0].lessonName, jc.lessons[0].volume);
console.log('Keys of lesson 50:', Object.keys(jc.lessons[50]));
console.log('Sample lesson 50:', jc.lessons[50].lessonNum, jc.lessons[50].lessonName, jc.lessons[50].volume);
