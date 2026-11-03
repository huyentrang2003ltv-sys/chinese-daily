const fs = require('fs');
const topics = JSON.parse(fs.readFileSync('data/topics.json', 'utf8'));
console.log('Total topics:', topics.length);
topics.slice(0, 20).forEach((t, i) => {
  console.log(`${i+1}. ${t.icon} ${t.name}: ${t.count} từ`);
});
