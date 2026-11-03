const fs = require('fs');

const l = JSON.parse(fs.readFileSync('data/lessons.json', 'utf8'));
const levels = {};
l.forEach(x => levels[x.level] = (levels[x.level] || 0) + 1);
console.log('Levels distribution in lessons.json:', levels);
console.log('Total lessons:', l.length);
