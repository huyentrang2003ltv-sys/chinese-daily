const fs = require('fs');
const path = require('path');

const dict = require('./data/dictionary.json');
const lessons = require('./data/lessons.json');
const readings = require('./data/readings.json');
const hanyu = require('./data/hanyu_jiaocheng.json');
const etym = require('./data/etymology.json');

const vocabMap = new Map();

function addWord(word, pinyin, vi) {
  if (!word || !pinyin) return;
  const w = word.trim();
  if (!w) return;
  if (!vocabMap.has(w) || (vi && !vocabMap.get(w).vi)) {
    vocabMap.set(w, { hanzi: w, pinyin: pinyin.trim(), vi: (vi || '').trim() });
  }
}

// 1. Existing readings tokens
readings.forEach(r => {
  if (r.vocab) r.vocab.forEach(v => addWord(v.hanzi, v.pinyin, v.vi));
  if (r.paragraphs) r.paragraphs.forEach(p => {
    if (p.tokens) p.tokens.forEach(t => {
      if (t.hanzi && t.pinyin) addWord(t.hanzi, t.pinyin, t.vi);
    });
  });
});

// 2. Dictionary
dict.forEach(d => addWord(d.title, d.pinyin, d.meaning));

// 3. Lessons
lessons.forEach(l => {
  if (l.words) l.words.forEach(w => addWord(w.title, w.pinyin, w.meaning));
});

// 4. Hanyu Jiaocheng
if (hanyu.lessons) {
  hanyu.lessons.forEach(l => {
    if (l.vocabulary) l.vocabulary.forEach(v => addWord(v.hanzi, v.pinyin, v.meaning));
  });
}

// 5. Etymology
etym.forEach(e => {
  if (e.character) addWord(e.character, e.pinyin, e.meaning || e.vietnamese || '');
});

// 6. Curated Supplemental lexicon for high-frequency words, classical particles, idioms
const supplemental = [
  // Đại từ, liên từ, hư từ cổ ngữ & hiện đại
  { hanzi: "之", pinyin: "zhī", vi: "của, điều đó, đi đến" },
  { hanzi: "者", pinyin: "zhě", vi: "người, kẻ, cái" },
  { hanzi: "也", pinyin: "yě", vi: "cũng, vậy (trợ từ)" },
  { hanzi: "而", pinyin: "ér", vi: "mà, lại, và" },
  { hanzi: "于", pinyin: "yú", vi: "ở, tại, đối với" },
  { hanzi: "以", pinyin: "yǐ", vi: "lấy, dùng, để" },
  { hanzi: "其", pinyin: "qí", vi: "của nó, họ, ấy" },
  { hanzi: "则", pinyin: "zé", vi: "thì, là, quy tắc" },
  { hanzi: "为", pinyin: "wéi", vi: "làm, vì, là" },
  { hanzi: "所", pinyin: "suǒ", vi: "nơi chốn, chỗ (trợ từ)" },
  { hanzi: "若", pinyin: "ruò", vi: "nếu, như, dường như" },
  { hanzi: "善", pinyin: "shàn", vi: "lành, tốt thiện, giỏi" },
  { hanzi: "水", pinyin: "shuǐ", vi: "nước" },
  { hanzi: "利", pinyin: "lì", vi: "lợi ích, thuận lợi" },
  { hanzi: "万物", pinyin: "wànwù", vi: "vạn vật, muôn loài" },
  { hanzi: "不争", pinyin: "bù zhēng", vi: "không tranh giành" },
  { hanzi: "众人", pinyin: "zhòngrén", vi: "mọi người, số đông" },
  { hanzi: "恶", pinyin: "wù", vi: "ghét, xấu, ghê sợ" },
  { hanzi: "故", pinyin: "gù", vi: "cho nên, cố ý, cũ" },
  { hanzi: "几于道", pinyin: "jǐ yú dào", vi: "gần với Đạo" },
  { hanzi: "居善地", pinyin: "jū shàn dì", vi: "ở chọn đất lành" },
  { hanzi: "心善渊", pinyin: "xīn shàn yuān", vi: "lòng giữ tĩnh sâu" },
  { hanzi: "与善仁", pinyin: "yǔ shàn rén", vi: "đối đãi giữ lòng nhân" },
  { hanzi: "言善信", pinyin: "yán shàn xìn", vi: "lời nói giữ chữ tín" },
  { hanzi: "正善治", pinyin: "zhèng shàn zhì", vi: "trị lý giữ công bình" },
  { hanzi: "事善能", pinyin: "shì shàn néng", vi: "làm việc phát huy năng lực" },
  { hanzi: "动善时", pinyin: "dòng shàn shí", vi: "hành động thuận thời thế" },
  { hanzi: "夫", pinyin: "fú", vi: "phàm là, người" },
  { hanzi: "唯", pinyin: "wéi", vi: "chỉ vì, duy nhất" },
  { hanzi: "无尤", pinyin: "wú yóu", vi: "không lầm lỗi oán trách" },
  { hanzi: "道德经", pinyin: "Dàodé Jīng", vi: "Đạo Đức Kinh" },
  { hanzi: "老子", pinyin: "Lǎozǐ", vi: "Lão Tử" },
  { hanzi: "孔子", pinyin: "Kǒngzǐ", vi: "Khổng Tử" },
  { hanzi: "庄子", pinyin: "Zhuāngzǐ", vi: "Trang Tử" },
  { hanzi: "论语", pinyin: "Lúnyǔ", vi: "Luận Ngữ" },
  { hanzi: "孟子", pinyin: "Mèngzǐ", vi: "Mạnh Tử" },
  { hanzi: "己所不欲", pinyin: "jǐ suǒ bú yù", vi: "điều mình không muốn" },
  { hanzi: "勿施于人", pinyin: "wù shī yú rén", vi: "chớ đem áp đặt cho người" },
  { hanzi: "仁", pinyin: "rén", vi: "nhân từ, lòng nhân" },
  { hanzi: "恕", pinyin: "shù", vi: "tha thứ, khoan dung, suy bụng ta ra bụng người" },
  { hanzi: "知行合一", pinyin: "zhī xíng hé yī", vi: "tri hành hợp nhất (biết và làm đi đôi)" },
  { hanzi: "王阳明", pinyin: "Wáng Yángmíng", vi: "Vương Dương Minh" },
  { hanzi: "天人合一", pinyin: "tiān rén hé yī", vi: "thiên nhân hợp nhất (người và tự nhiên hòa làm một)" },
  { hanzi: "逍遥游", pinyin: "Xiāoyáo Yóu", vi: "Tiêu Dao Du" },
  { hanzi: "北冥有鱼", pinyin: "Běi míng yǒu yú", vi: "Biển Bắc có con cá" },
  { hanzi: "其名为鲲", pinyin: "qí míng wéi kūn", vi: "tên nó là Côn" },
  { hanzi: "鲲之大", pinyin: "kūn zhī dà", vi: "con cá Côn to lớn" },
  { hanzi: "不知其几千里也", pinyin: "bù zhī qí jǐ qiān lǐ yě", vi: "không biết rộng mấy ngàn dặm" },
  { hanzi: "化而为鸟", pinyin: "huà ér wéi niǎo", vi: "hóa thành loài chim" },
  { hanzi: "其名为鹏", pinyin: "qí míng wéi péng", vi: "tên gọi là chim Bằng" },
  { hanzi: "水击三千里", pinyin: "shuǐ jī sān qiān lǐ", vi: "vỗ cánh tung sóng ba ngàn dặm" },
  { hanzi: "抟扶摇而上者九万里", pinyin: "tuán fúyáo ér shàng zhě jiǔ wàn lǐ", vi: "cưỡi gió lốc bay lên chín vạn dặm" },
  { hanzi: "桃花源记", pinyin: "Táo Huā Yuán Jì", vi: "Đào Hoa Nguyên Ký" },
  { hanzi: "陶渊明", pinyin: "Táo Yuānmíng", vi: "Đào Uyên Minh (Đào Tiềm)" },
  { hanzi: "豁然开朗", pinyin: "huò rán kāi lǎng", vi: "bỗng nhiên sáng tỏ, mở mang thông thoáng" },
  { hanzi: "落英缤纷", pinyin: "luò yīng bīn fēn", vi: "cánh hoa rụng lả tả thơm ngát" },
  { hanzi: "怡然自乐", pinyin: "yí rán zì lè", vi: "vui vẻ an nhiên tự tại" },
  { hanzi: "世外桃源", pinyin: "shì wài táo yuán", vi: "chốn bồng lai tiên cảnh ngoài trần thế" },
  { hanzi: "新质生产力", pinyin: "xīnzhì shēngchǎnlì", vi: "lực lượng sản xuất chất lượng mới" },
  { hanzi: "高质量发展", pinyin: "gāo zhìliàng fāzhǎn", vi: "phát triển chất lượng cao" },
  { hanzi: "量子计算", pinyin: "liàngzǐ jìsuàn", vi: "điện toán lượng tử" },
  { hanzi: "九章", pinyin: "Jiǔzhāng", vi: "máy tính lượng tử Cửu Chương" },
  { hanzi: "祖冲之", pinyin: "Zǔ Chōngzhī", vi: "Tổ Xung Chi" },
  { hanzi: "敦煌莫高窟", pinyin: "Dūnhuáng Mògāokū", vi: "Hang Mạc Cao Đôn Hoàng" },
  { hanzi: "丝绸之路", pinyin: "Sīchóu zhī Lù", vi: "Con đường Tơ lụa" },
  { hanzi: "二十四节气", pinyin: "èrshísì jiéqì", vi: "24 Tiết khí" },
  { hanzi: "人类命运共同体", pinyin: "rénlèi mìngyùn gòngtóngtǐ", vi: "Cộng đồng chung vận mệnh nhân loại" },
  { hanzi: "文明互鉴", pinyin: "wénmíng hù jiàn", vi: "văn minh học hỏi lẫn nhau" },
  { hanzi: "苏轼", pinyin: "Sū Shì", vi: "Tô Thức (Tô Đông Pha)" },
  { hanzi: "定风波", pinyin: "Dìng Fēng Bō", vi: "từ bài Định Phong Ba" },
  { hanzi: "一蓑烟雨任平生", pinyin: "yì suō yānyǔ rèn píngshēng", vi: "một áo tơi đón gió mưa mặc sự đời" },
  { hanzi: "也无风雨也无晴", pinyin: "yě wú fēngyǔ yě wú qíng", vi: "cũng chẳng bão giông cũng chẳng nắng" },
  { hanzi: "工匠精神", pinyin: "gōngjiàng jīngshén", vi: "tinh thần nghệ nhân, tay nghề tinh hoa" },
  { hanzi: "故宫", pinyin: "Gùgōng", vi: "Cố Cung (Tử Cấm Thành)" },
  { hanzi: "修复", pinyin: "xiūfù", vi: "tu bổ, phục chế" },
  { hanzi: "茶道", pinyin: "chádào", vi: "trà đạo" },
  { hanzi: "品茗", pinyin: "pǐnmíng", vi: "thưởng trà, nhấp trà" },
  { hanzi: "浮躁", pinyin: "fúzào", vi: "nóng nảy, xốc nổi xô bồ" },
  { hanzi: "执着", pinyin: "zhízhuó", vi: "chấp niệm, kiên trì, đam mê bền bỉ" },
  { hanzi: "宁静致远", pinyin: "níngjìng zhì yuǎn", vi: "lòng tĩnh lặng mới nhìn xa trông rộng" },
  { hanzi: "厚德载物", pinyin: "hòudé zàiwù", vi: "đức dày nâng đỡ vạn vật" },
  { hanzi: "自强不息", pinyin: "zìqiáng bùxī", vi: "tự lực tự cường không ngừng nghỉ" }
];

supplemental.forEach(s => addWord(s.hanzi, s.pinyin, s.vi));

// Unigram character fallback (character -> { pinyin, vi })
const charMap = new Map();
vocabMap.forEach((val, key) => {
  if (key.length === 1 && !charMap.has(key)) {
    charMap.set(key, { pinyin: val.pinyin, vi: val.vi });
  }
});

// Segmenter: Maximum Matching
function tokenizeParagraph(text) {
  const tokens = [];
  let i = 0;
  const maxLen = 8;
  const puncts = "，。！？；：“”‘’（）《》、—…· \t\n.,!?;:'\"()";

  while (i < text.length) {
    const ch = text[i];
    if (puncts.includes(ch)) {
      tokens.push({ hanzi: ch, pinyin: '', vi: '' });
      i++;
      continue;
    }

    let matched = null;
    let matchLen = 1;

    for (let len = Math.min(maxLen, text.length - i); len >= 1; len--) {
      const sub = text.substr(i, len);
      if (vocabMap.has(sub)) {
        matched = vocabMap.get(sub);
        matchLen = len;
        break;
      }
    }

    if (matched) {
      tokens.push({ hanzi: matched.hanzi, pinyin: matched.pinyin, vi: matched.vi });
      i += matchLen;
    } else {
      // Fallback single character
      const fallback = charMap.get(ch) || { pinyin: '', vi: '' };
      tokens.push({ hanzi: ch, pinyin: fallback.pinyin, vi: fallback.vi });
      i++;
    }
  }
  return tokens;
}

module.exports = {
  vocabMap,
  addWord,
  tokenizeParagraph
};
