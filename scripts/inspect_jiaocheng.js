const fs = require('fs');

const jc = JSON.parse(fs.readFileSync('data/hanyu_jiaocheng.json', 'utf8'));
console.log('Hanyu Jiaocheng keys:', Object.keys(jc));
if (Array.isArray(jc)) {
  console.log('Jiaocheng length:', jc.length);
  console.log('First entry:', jc[0]);
} else {
  console.log('First key:', Object.keys(jc)[0], jc[Object.keys(jc)[0]]);
}
