const fs = require('fs');
const path = require('path');

const dict = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dictionary.json'), 'utf8'));
const topics = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/topics.json'), 'utf8'));
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

console.log('Dictionary count:', dict.length);
console.log('Topics count:', topics.length);

const requiredIds = [
  'btn-dict-mode-hsk',
  'btn-dict-mode-topic',
  'dictSectionHsk',
  'dictSectionTopic',
  'dictFilteredCount',
  'dictTotalCountLabel',
  'dictSearchInput',
  'dictClearSearchBtn',
  'dictGridContainer',
  'loadMoreDictBtn',
  'topicFilteredCount',
  'topicTotalCountLabel',
  'activeTopicLabel',
  'topicFilterPills',
  'topicSearchInput',
  'topicClearSearchBtn',
  'topicGridContainer',
  'loadMoreTopicBtn'
];

let allOk = true;
requiredIds.forEach(id => {
  const exists = html.includes(`id="${id}"`);
  if (!exists) {
    console.error('MISSING ID:', id);
    allOk = false;
  }
});

if (allOk) {
  console.log('All required IDs present in index.html!');
}

// Check sample words per topic
topics.forEach(t => {
  const sample = dict.filter(w => w.topicId === t.id);
  console.log(`${t.icon} ${t.name}: ${sample.length} words (recorded: ${t.count})`);
});
