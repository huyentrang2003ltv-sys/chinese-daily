'use strict';

// Quick Vietnamese <-> Chinese translation for the floating assistant, plus the HSK words it contains.
const fs = require('fs');
const path = require('path');
const { PUBLIC_DIR } = require('./config');

const dictMap = new Map();
try {
  const dict = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'data', 'dictionary.json'), 'utf8'));
  for (const d of dict) {
    if (d.title && d.pinyin && d.title.length >= 2) {
      dictMap.set(d.title, { word: d.title, pinyin: d.pinyin, vi: d.meaning || '' });
    }
  }
} catch (e) {
  console.warn('Không nạp được từ điển cho trợ lý dịch:', e.message);
}

async function translate(text) {
  const isChinese = /[一-龥]/.test(text);
  const target = isChinese ? 'vi' : 'zh-CN';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&dt=rm&q=${encodeURIComponent(text)}`;

  let translated = '';
  let pinyin = '';
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    if (Array.isArray(data && data[0])) {
      translated = data[0].map(item => (item && item[0]) || '').join('').trim();
      const romanization = data[0][data[0].length - 1];
      if (Array.isArray(romanization) && romanization[2]) pinyin = romanization[2];
    }
  } catch (e) {
    console.warn('Dịch tự động lỗi:', e.message);
  }

  const chinese = isChinese ? text : translated;
  const vocab = [];
  for (const [word, entry] of dictMap) {
    if (chinese.includes(word)) vocab.push(entry);
    if (vocab.length >= 6) break;
  }

  return {
    sourceText: text,
    translated: translated || 'Chưa dịch được câu này, vui lòng thử lại.',
    pinyin,
    isChineseTarget: !isChinese,
    vocab
  };
}

module.exports = { translate };
