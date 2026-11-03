const { dataFile } = require('./paths');
const fs = require('fs');

const dictPath = dataFile('dictionary.json');
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// 1. Fix 漂亮
const piaoliang = dict.find(d => d.title === '漂亮');
if (piaoliang) {
  piaoliang.hanviet = 'Phiêu Lượng';
  console.log('Fixed 漂亮 hanviet to Phiêu Lượng');
}

// 2. Add 火车站 if missing
if (!dict.some(d => d.title === '火车站')) {
  dict.push({
    title: '火车站',
    pinyin: 'huǒchēzhàn',
    meaning: 'ga tàu, nhà ga, ga xe lửa',
    pos: 'danh từ',
    level: 2,
    lesson: 2,
    exampleSentence: '我现在在火车站等你。',
    examplePinyin: 'Wǒ xiànzài zài huǒchēzhàn děng nǐ.',
    exampleMeaning: 'Bây giờ tôi đang ở ga tàu đợi bạn.',
    topicId: 'travel',
    topicName: 'Du Lịch & Khách Sạn',
    topicZh: '旅游住宿',
    topicIcon: '🚆',
    hanviet: 'Hỏa Xa Trạm'
  });
  console.log('Added 火车站 to dictionary');
}

// 3. Add 飞机场 if missing
if (!dict.some(d => d.title === '飞机场')) {
  dict.push({
    title: '飞机场',
    pinyin: 'fēijīchǎng',
    meaning: 'sân bay, phi trường',
    pos: 'danh từ',
    level: 2,
    lesson: 2,
    exampleSentence: '我们开车去飞机场接他。',
    examplePinyin: 'Wǒmen kāichē qù fēijīchǎng jiē tā.',
    exampleMeaning: 'Chúng tôi lái xe ra sân bay đón anh ấy.',
    topicId: 'travel',
    topicName: 'Du Lịch & Khách Sạn',
    topicZh: '旅游住宿',
    topicIcon: '✈️',
    hanviet: 'Phi Cơ Trường'
  });
  console.log('Added 飞机场 to dictionary');
}

fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log('Updated dictionary.json successfully. Total words:', dict.length);
