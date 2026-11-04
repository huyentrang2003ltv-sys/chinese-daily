// scripts/data/compile_flip_card_1000.js
// Compiles 1,000 card pairs into public/data/flip_card_levels.json
// Exactly 200 levels:
// - Levels 1 - 70: Synonym Match (350 pairs)
// - Levels 71 - 130: Antonym Match (300 pairs)
// - Levels 131 - 200: Image Match (350 pairs)
// Total = 1,000 pairs!

const fs = require('fs');
const path = require('path');

const imgData = require('./flip_image_pairs.js');
const synData = require('./flip_synonym_pairs.js');
const antData = require('./flip_antonym_pairs.js');

console.log(`Loaded ${synData.length} synonyms, ${antData.length} antonyms, ${imgData.length} image pairs.`);

const levels = [];

// ==================== 1. SYNONYM LEVELS (1 - 70, 350 PAIRS) ====================
// Level 1 must preserve exact configuration for game_simulation.test.js
levels.push({
  level: 1,
  title: "Cặp từ Vui Vẻ & Đẹp Đẽ (Sơ Cấp)",
  tier: "easy",
  mode: "synonym",
  description: "Tìm các cặp từ đồng nghĩa cơ bản chỉ cảm xúc và ngoại hình",
  pairs: [
    {
      id: "syn_1_1",
      type: "synonym",
      typeLabel: "Đồng nghĩa",
      wordA: { hanzi: "高兴", pinyin: "gāoxìng", meaning: "vui vẻ" },
      wordB: { hanzi: "开心", pinyin: "kāixīn", meaning: "hạnh phúc, tươi vui" },
      relationDesc: "Đều dùng để miêu tả tâm trạng phấn khởi, vui sướng.",
      exampleSentence: "今天见到老朋友，我很高兴，大家都很开心。"
    },
    {
      id: "syn_1_2",
      type: "synonym",
      typeLabel: "Đồng nghĩa",
      wordA: { hanzi: "美丽", pinyin: "měilì", meaning: "xinh đẹp, diễm lệ" },
      wordB: { hanzi: "漂亮", pinyin: "piàoliang", meaning: "đẹp đẽ, ưa nhìn" },
      relationDesc: "Đều chỉ vẻ đẹp ưa nhìn; 漂亮 thường dùng trong khẩu ngữ, 美丽 trang trọng hơn.",
      exampleSentence: "这件衣服很漂亮，这里的风景很美丽。"
    },
    {
      id: "syn_1_3",
      type: "synonym",
      typeLabel: "Đồng nghĩa",
      wordA: { hanzi: "喜欢", pinyin: "xǐhuan", meaning: "thích, yêu thích" },
      wordB: { hanzi: "喜爱", pinyin: "xǐ'ài", meaning: "yêu mến, chuộng" },
      relationDesc: "Đều thể hiện tình cảm quý mến, có hứng thú với ai đó hoặc điều gì.",
      exampleSentence: "他很喜欢中国茶，深受大家的喜爱。"
    }
  ]
});

// Level 2 (7 pairs from index 3 to 9)
const lvl2Pairs = [];
for (let i = 3; i <= 9; i++) {
  const item = synData[i];
  lvl2Pairs.push({
    id: `syn_2_${lvl2Pairs.length + 1}`,
    type: "synonym",
    typeLabel: "Đồng nghĩa",
    wordA: { hanzi: item[0], pinyin: item[1], meaning: item[2] },
    wordB: { hanzi: item[3], pinyin: item[4], meaning: item[5] },
    relationDesc: item[6],
    exampleSentence: item[7]
  });
}
levels.push({
  level: 2,
  title: "Đồng Nghĩa Màn 2: Lời Nói & Thời Gian (Sơ Cấp)",
  tier: "easy",
  mode: "synonym",
  description: "Ghép các cặp từ đồng nghĩa cơ bản về thời gian, lời nói và hành động hàng ngày",
  pairs: lvl2Pairs
});

// Levels 3 to 70 (5 pairs each, index 10 to 349)
let synCursor = 10;
for (let lvlNum = 3; lvlNum <= 70; lvlNum++) {
  const pList = [];
  const tier = lvlNum <= 25 ? 'easy' : (lvlNum <= 50 ? 'medium' : 'hard');
  const tierLabel = tier === 'easy' ? 'Sơ Cấp' : (tier === 'medium' ? 'Trung Cấp' : 'Cao Cấp');

  for (let pIdx = 0; pIdx < 5; pIdx++) {
    const item = synData[synCursor++];
    pList.push({
      id: `syn_${lvlNum}_${pIdx + 1}`,
      type: "synonym",
      typeLabel: "Đồng nghĩa",
      wordA: { hanzi: item[0], pinyin: item[1], meaning: item[2] },
      wordB: { hanzi: item[3], pinyin: item[4], meaning: item[5] },
      relationDesc: item[6],
      exampleSentence: item[7]
    });
  }

  const sampleWords = `${pList[0].wordA.hanzi} & ${pList[1].wordA.hanzi}`;
  levels.push({
    level: lvlNum,
    title: `Đồng Nghĩa Màn ${lvlNum}: ${sampleWords} (${tierLabel})`,
    tier: tier,
    mode: "synonym",
    description: `Ghép 5 cặp từ đồng nghĩa HSK tương đương ý nghĩa: ${pList.map(p => p.wordA.hanzi).join(', ')}`,
    pairs: pList
  });
}

// ==================== 2. ANTONYM LEVELS (71 - 130, 300 PAIRS) ====================
let antCursor = 0;
for (let lvlNum = 71; lvlNum <= 130; lvlNum++) {
  const pList = [];
  const tier = lvlNum <= 90 ? 'easy' : (lvlNum <= 115 ? 'medium' : 'hard');
  const tierLabel = tier === 'easy' ? 'Sơ Cấp' : (tier === 'medium' ? 'Trung Cấp' : 'Cao Cấp');

  for (let pIdx = 0; pIdx < 5; pIdx++) {
    const item = antData[antCursor++];
    pList.push({
      id: `ant_${lvlNum}_${pIdx + 1}`,
      type: "antonym",
      typeLabel: "Trái nghĩa",
      wordA: { hanzi: item[0], pinyin: item[1], meaning: item[2] },
      wordB: { hanzi: item[3], pinyin: item[4], meaning: item[5] },
      relationDesc: item[6],
      exampleSentence: item[7]
    });
  }

  const samplePairs = `${pList[0].wordA.hanzi} ↔ ${pList[0].wordB.hanzi}`;
  levels.push({
    level: lvlNum,
    title: `Trái Nghĩa Màn ${lvlNum - 70}: Cặp đối lập ${samplePairs} (${tierLabel})`,
    tier: tier,
    mode: "antonym",
    description: `Thử thách phản xạ các cặp từ trái nghĩa đối lập: ${pList.map(p => `${p.wordA.hanzi}≠${p.wordB.hanzi}`).join(', ')}`,
    pairs: pList
  });
}

// ==================== 3. IMAGE MATCH LEVELS (131 - 200, 350 PAIRS) ====================
let imgCursor = 0;
for (let lvlNum = 131; lvlNum <= 200; lvlNum++) {
  const pList = [];
  const tier = lvlNum <= 155 ? 'easy' : (lvlNum <= 180 ? 'medium' : 'hard');
  const tierLabel = tier === 'easy' ? 'Sơ Cấp' : (tier === 'medium' ? 'Trung Cấp' : 'Cao Cấp');

  for (let pIdx = 0; pIdx < 5; pIdx++) {
    const item = imgData[imgCursor++];
    // item: [hanzi, pinyin, meaning, emoji, relationDesc, exampleSentence]
    pList.push({
      id: `img_${lvlNum}_${pIdx + 1}`,
      type: "image",
      typeLabel: "Hình ảnh",
      wordA: {
        hanzi: item[0],
        pinyin: item[1],
        meaning: item[2],
        image: item[3],
        isImage: false
      },
      wordB: {
        hanzi: item[0],
        pinyin: item[1],
        meaning: item[2],
        image: item[3],
        isImage: true
      },
      relationDesc: item[4],
      exampleSentence: item[5]
    });
  }

  const sampleImg = `${pList[0].wordA.image} ${pList[0].wordA.hanzi}`;
  levels.push({
    level: lvlNum,
    title: `Hình Ảnh Màn ${lvlNum - 130}: Ghép chữ & hình ${sampleImg} (${tierLabel})`,
    tier: tier,
    mode: "image",
    description: `Lật mở và kết nối chữ Hán với hình minh họa trực quan: ${pList.map(p => `${p.wordA.image} ${p.wordA.hanzi}`).join(', ')}`,
    pairs: pList
  });
}

// Summary Verification
let totalPairs = 0;
levels.forEach(l => {
  totalPairs += l.pairs.length;
});

console.log(`Compiled ${levels.length} levels with a total of ${totalPairs} card pairs.`);
if (totalPairs !== 1000) {
  throw new Error(`Expected 1000 pairs, but got ${totalPairs}!`);
}

const outputPath = path.join(__dirname, '../../public/data/flip_card_levels.json');
fs.writeFileSync(outputPath, JSON.stringify(levels, null, 2), 'utf8');
console.log(`Saved successfully to ${outputPath}`);
