const { dataFile } = require('./paths');
const fs = require('fs');
const path = require('path');

const dictFile = dataFile('dictionary.json');
const topicsFile = dataFile('topics.json');

let d = JSON.parse(fs.readFileSync(dictFile, 'utf8'));

// Filter out punctuation characters
d = d.filter(w => !['：', '“', '”', '，', '。', '！', '？'].includes(w.title.trim()));

// Meanings and pos map for the phrases
const phraseMap = {
  '第十二': { meaning: 'thứ mười hai', pos: 'số thứ tự', topicId: 'education' },
  '几日': { meaning: 'mấy ngày, ngày nào', pos: 'danh từ', topicId: 'society' },
  '来晚': { meaning: 'đến muộn, tới trễ', pos: 'cụm động từ', topicId: 'society' },
  '通通风': { meaning: 'mở cửa cho thoáng khí, thông gió', pos: 'động từ', topicId: 'daily' },
  '想进': { meaning: 'muốn vào', pos: 'cụm động từ', topicId: 'society' },
  '想买': { meaning: 'muốn mua', pos: 'cụm động từ', topicId: 'shopping' },
  '想去': { meaning: 'muốn đi', pos: 'cụm động từ', topicId: 'travel' },
  '坐车到': { meaning: 'ngồi xe/đi xe đến...', pos: 'cụm động từ', topicId: 'traffic' },
  '查字典': { meaning: 'tra từ điển', pos: 'cụm động từ', topicId: 'education' },
  '会用': { meaning: 'biết sử dụng, biết dùng', pos: 'cụm động từ', topicId: 'education' },
  '市里': { meaning: 'trong thành phố, nội thành', pos: 'danh từ', topicId: 'traffic' },
  '祝你平安': { meaning: 'chúc bạn bình an, thượng lộ bình an', pos: 'cụm chúc mừng', topicId: 'society' },
  '被骗': { meaning: 'bị lừa, bị lừa gạt', pos: 'động từ bị động', topicId: 'emotions' },
  '陈女士': { meaning: 'bà Trần, cô Trần (cách gọi lịch sự)', pos: 'danh từ xưng hô', topicId: 'family' },
  '分组讨论': { meaning: 'chia nhóm thảo luận', pos: 'cụm danh/động từ', topicId: 'education' },
  '网速': { meaning: 'tốc độ mạng, tốc độ đường truyền internet', pos: 'danh từ', topicId: 'tech' },
  '弯弯': { meaning: 'cong cong, uốn lượn', pos: 'tính từ', topicId: 'appearance' },
  '想送': { meaning: 'muốn tặng, muốn tiễn', pos: 'cụm động từ', topicId: 'society' },
  '新纪录': { meaning: 'kỷ lục mới', pos: 'danh từ', topicId: 'society' }
};

d.forEach(w => {
  if (phraseMap[w.title]) {
    w.meaning = phraseMap[w.title].meaning;
    if (phraseMap[w.title].pos) w.pos = phraseMap[w.title].pos;
    if (phraseMap[w.title].topicId) w.topicId = phraseMap[w.title].topicId;
  }
});

fs.writeFileSync(dictFile, JSON.stringify(d, null, 2), 'utf8');

// Also update topics.json counts
const topics = JSON.parse(fs.readFileSync(topicsFile, 'utf8'));
topics.forEach(t => {
  t.count = d.filter(w => w.topicId === t.id).length;
});
fs.writeFileSync(topicsFile, JSON.stringify(topics, null, 2), 'utf8');

const remainingWithoutMeaning = d.filter(w => !w.meaning || !w.meaning.trim());
console.log('Finished cleanup. Total words:', d.length);
console.log('Remaining without meaning:', remainingWithoutMeaning.length);
