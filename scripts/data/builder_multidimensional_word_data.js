// scripts/data/builder_multidimensional_word_data.js
// Compiles comprehensive multidimensional data for all Chinese vocabulary:
// 1. Cách dùng (Grammar, Sentence Patterns, Collocations • 常搭配)
// 2. Nghĩa (Definitions, Hán Việt, Từ loại POS, Cấp độ HSK)
// 3. Từ đồng nghĩa (Synonyms • 近义词 - Bidirectional, Clickable)
// 4. Từ trái nghĩa (Antonyms • 反义词 - Bidirectional, Clickable)
// 5. Từ đồng âm (Homophones • 同音词 - Phonetic Clusters, Clickable)
// 6. Hình ảnh mô tả (Visual Illustration / Graphic Card + Educational Caption)

const fs = require('fs');
const path = require('path');

const dictPath = path.join(__dirname, '../../public/data/dictionary.json');
const flipPath = path.join(__dirname, '../../public/data/flip_card_levels.json');
const etymPath = path.join(__dirname, '../../public/data/etymology.json');
const convPath = path.join(__dirname, '../../public/data/conversations_150.json');

const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
const flip = JSON.parse(fs.readFileSync(flipPath, 'utf8'));
const etym = JSON.parse(fs.readFileSync(etymPath, 'utf8'));
const conv = fs.existsSync(convPath) ? JSON.parse(fs.readFileSync(convPath, 'utf8')) : [];

console.log(`Loaded ${dict.length} dict words, ${flip.length} flip levels, ${etym.length} etym entries, ${conv.length} conversations.`);

// -------------------------------------------------------------
// 1. Hanviet Character Dictionary for Accurate Word Synthesis
// -------------------------------------------------------------
const charHanvietMap = {};
etym.forEach(e => {
  if (e.hanzi && e.hanviet) charHanvietMap[e.hanzi] = e.hanviet.trim();
});
dict.forEach(d => {
  if (d.title && d.title.length === 1 && d.hanviet) {
    charHanvietMap[d.title] = d.hanviet.trim();
  }
});

function resolveHanviet(word, existingHv) {
  if (existingHv && existingHv.trim() && !existingHv.includes('undefined')) {
    return existingHv.trim();
  }
  // Try synthesizing from single characters
  const parts = word.split('').map(c => charHanvietMap[c] || '');
  if (parts.every(p => p.length > 0)) {
    return parts.join(' ');
  }
  return existingHv || 'Đang cập nhật';
}

// -------------------------------------------------------------
// 2. Index Synonyms, Antonyms, and Images from Flip Card Levels
// -------------------------------------------------------------
const synonymsMap = {};
const antonymsMap = {};
const imagesMap = {};
const extraFlipWords = new Map();

flip.forEach(lvl => {
  (lvl.pairs || []).forEach(p => {
    if (p.type === 'synonym') {
      const a = p.wordA.hanzi;
      const b = p.wordB.hanzi;
      if (a && b) {
        if (!synonymsMap[a]) synonymsMap[a] = [];
        if (!synonymsMap[a].some(x => x.hanzi === b)) {
          synonymsMap[a].push({
            hanzi: b,
            pinyin: p.wordB.pinyin || '',
            meaning: p.wordB.meaning || '',
            desc: p.relationDesc || 'Từ đồng nghĩa tương đương'
          });
        }
        if (!synonymsMap[b]) synonymsMap[b] = [];
        if (!synonymsMap[b].some(x => x.hanzi === a)) {
          synonymsMap[b].push({
            hanzi: a,
            pinyin: p.wordA.pinyin || '',
            meaning: p.wordA.meaning || '',
            desc: p.relationDesc || 'Từ đồng nghĩa tương đương'
          });
        }
        if (!extraFlipWords.has(a)) extraFlipWords.set(a, { ...p.wordA, exampleSentence: p.exampleSentence });
        if (!extraFlipWords.has(b)) extraFlipWords.set(b, { ...p.wordB, exampleSentence: p.exampleSentence });
      }
    } else if (p.type === 'antonym') {
      const a = p.wordA.hanzi;
      const b = p.wordB.hanzi;
      if (a && b) {
        if (!antonymsMap[a]) antonymsMap[a] = [];
        if (!antonymsMap[a].some(x => x.hanzi === b)) {
          antonymsMap[a].push({
            hanzi: b,
            pinyin: p.wordB.pinyin || '',
            meaning: p.wordB.meaning || '',
            desc: p.relationDesc || 'Từ trái nghĩa đối lập'
          });
        }
        if (!antonymsMap[b]) antonymsMap[b] = [];
        if (!antonymsMap[b].some(x => x.hanzi === a)) {
          antonymsMap[b].push({
            hanzi: a,
            pinyin: p.wordA.pinyin || '',
            meaning: p.wordA.meaning || '',
            desc: p.relationDesc || 'Từ trái nghĩa đối lập'
          });
        }
        if (!extraFlipWords.has(a)) extraFlipWords.set(a, { ...p.wordA, exampleSentence: p.exampleSentence });
        if (!extraFlipWords.has(b)) extraFlipWords.set(b, { ...p.wordB, exampleSentence: p.exampleSentence });
      }
    } else if (p.type === 'image') {
      const w = p.wordA.hanzi;
      if (w) {
        imagesMap[w] = {
          image: p.wordA.image || '🖼️',
          caption: p.wordA.meaning || '',
          desc: p.relationDesc || ''
        };
        if (!extraFlipWords.has(w)) extraFlipWords.set(w, { ...p.wordA, exampleSentence: p.exampleSentence });
      }
    }
  });
});

// Foundational Synonyms & Antonyms for High Frequency Words
const curatedFoundationalSynonyms = [
  ['好看', '漂亮', 'đều chỉ ngoại hình ưa nhìn, đẹp đẽ'],
  ['漂亮', '美丽', 'đều miêu tả vẻ đẹp cuốn hút'],
  ['高兴', '开心', 'đều biểu đạt tâm trạng phấn khởi, vui sướng'],
  ['开心', '快乐', 'đều chỉ niềm vui, hạnh phúc ngập tràn'],
  ['快乐', '愉快', 'đều diễn tả trạng thái hân hoan, thoải mái'],
  ['非常', '十分', 'phó từ chỉ mức độ rất cao'],
  ['十分', '特别', 'phó từ nhấn mạnh đặc biệt, rất'],
  ['常常', '经常', 'phó từ tần suất thường xuyên'],
  ['马上', '立刻', 'phó từ thời gian ngay tức khắc'],
  ['忽然', '突然', 'phó từ bất ngờ, đột ngột'],
  ['大概', '大约', 'phó từ ước lượng khoảng chừng'],
  ['也许', '可能', 'phó từ có lẽ, có khả năng'],
  ['帮助', '帮忙', 'đều mang nghĩa giúp đỡ người khác'],
  ['希望', '盼望', 'đều chỉ mong ước, kỳ vọng điều tốt lành'],
  ['著名', '有名', 'đều chỉ sự nổi tiếng, được nhiều người biết đến'],
  ['认真', '仔细', 'đều chỉ thái độ chăm chỉ, cẩn thận'],
  ['办法', '方法', 'đều chỉ cách thức, giải pháp xử lý vấn đề'],
  ['喜欢', '喜爱', 'đều biểu đạt tình cảm yêu thích'],
  ['害怕', '担忧', 'đều chỉ tâm trạng lo lắng, sợ hãi'],
  ['现在', '目前', 'đều chỉ thời điểm hiện tại, bây giờ'],
  ['开始', '起初', 'đều chỉ thời điểm ban đầu, khởi điểm'],
  ['结束', '完成', 'đều chỉ sự hoàn thành, khép lại sự việc']
];

const curatedFoundationalAntonyms = [
  ['好', '坏', 'tốt đẹp vs xấu xa, hư hỏng'],
  ['来', '去', 'đến vs đi'],
  ['爱', '恨', 'yêu thương vs căm ghét'],
  ['对', '错', 'đúng đắn vs sai trái'],
  ['前', '后', 'phía trước vs phía sau'],
  ['上', '下', 'ở trên vs ở dưới'],
  ['左', '右', 'bên trái vs bên phải'],
  ['开', '关', 'mở ra vs đóng lại, tắt'],
  ['问', '答', 'hỏi han vs trả lời, đáp lại'],
  ['进', '出', 'đi vào vs đi ra'],
  ['轻', '重', 'nhẹ nhàng vs nặng nề'],
  ['长', '短', 'dài vs ngắn'],
  ['早', '晚', 'sớm vs muộn, tối'],
  ['明', '暗', 'sáng sủa vs tối tăm'],
  ['真', '假', 'chân thật vs giả tạo'],
  ['甜', '苦', 'ngọt ngào vs cay đắng'],
  ['贵', '便宜', 'đắt đỏ vs giá rẻ'],
  ['难', '容易', 'khó khăn vs dễ dàng'],
  ['聪明', '笨', 'thông minh vs ngốc nghếch'],
  ['胖', '瘦', 'mập mạp vs gầy gò'],
  ['安静', '热闹', 'yên tĩnh vs náo nhiệt, ồn ào'],
  ['安全', '危险', 'an toàn vs nguy hiểm'],
  ['简单', '复杂', 'đơn giản vs phức tạp'],
  ['成功', '失败', 'thành công vs thất bại'],
  ['同意', '反对', 'đồng ý vs phản đối'],
  ['生', '死', 'sự sống vs cái chết']
];

curatedFoundationalSynonyms.forEach(([a, b, desc]) => {
  synonymsMap[a] = synonymsMap[a] || [];
  if (!synonymsMap[a].some(x => x.hanzi === b)) {
    synonymsMap[a].push({ hanzi: b, pinyin: '', meaning: '', desc });
  }
  synonymsMap[b] = synonymsMap[b] || [];
  if (!synonymsMap[b].some(x => x.hanzi === a)) {
    synonymsMap[b].push({ hanzi: a, pinyin: '', meaning: '', desc });
  }
});

curatedFoundationalAntonyms.forEach(([a, b, desc]) => {
  antonymsMap[a] = antonymsMap[a] || [];
  if (!antonymsMap[a].some(x => x.hanzi === b)) {
    antonymsMap[a].push({ hanzi: b, pinyin: '', meaning: '', desc });
  }
  antonymsMap[b] = antonymsMap[b] || [];
  if (!antonymsMap[b].some(x => x.hanzi === a)) {
    antonymsMap[b].push({ hanzi: a, pinyin: '', meaning: '', desc });
  }
});

// Additional Rich Visual Illustrations for Core Words
const curatedImages = {
  "书": { image: "📚", caption: "sách vở, tài liệu tri thức" },
  "看书": { image: "📖", caption: "đọc sách, mở mang hiểu biết" },
  "学校": { image: "🏫", caption: "ngôi trường, giảng đường" },
  "老师": { image: "👨‍🏫", caption: "thầy cô giáo dạy học" },
  "学生": { image: "🧑‍🎓", caption: "học sinh, sinh viên học tập" },
  "电脑": { image: "💻", caption: "máy vi tính, laptop" },
  "手机": { image: "📱", caption: "điện thoại di động" },
  "医院": { image: "🏥", caption: "bệnh viện chăm sóc sức khỏe" },
  "医生": { image: "👨‍⚕️", caption: "bác sĩ chữa bệnh cứu người" },
  "飞机": { image: "✈️", caption: "máy bay hàng không" },
  "火车站": { image: "🚉", caption: "nhà ga xe lửa" },
  "公共汽车": { image: "🚌", caption: "xe buýt công cộng" },
  "出租车": { image: "🚕", caption: "xe taxi đưa đón" },
  "家": { image: "🏡", caption: "mái ấm gia đình yêu thương" },
  "爸爸": { image: "👨", caption: "người bố trụ cột gia đình" },
  "妈妈": { image: "👩", caption: "người mẹ hiền từ" },
  "中国": { image: "🇨🇳", caption: "đất nước Trung Hoa" },
  "北京": { image: "🏯", caption: "thủ đô Bắc Kinh lịch sử" },
  "茶": { image: "🍵", caption: "tách trà xanh thanh tao" },
  "咖啡": { image: "☕", caption: "tách cà phê thơm ngát" },
  "水": { image: "💧", caption: "giọt nước trong lành mát lạnh" },
  "米饭": { image: "🍚", caption: "bát cơm trắng dẻo thơm" },
  "菜": { image: "🥗", caption: "món ăn đậm đà hương vị" },
  "钱": { image: "💰", caption: "tiền bạc, của cải" },
  "商店": { image: "🏪", caption: "cửa hàng mua bán tiện ích" },
  "下雨": { image: "🌧️", caption: "cơn mưa rào rơi nhẹ" },
  "太阳": { image: "☀️", caption: "ánh mặt trời ban mai ấm áp" },
  "月亮": { image: "🌙", caption: "vầng trăng đêm rằm sáng tỏ" },
  "高兴": { image: "😄", caption: "nụ cười rạng rỡ, vui tươi" },
  "开心": { image: "🥰", caption: "tràn ngập niềm vui hạnh phúc" },
  "美丽": { image: "🌺", caption: "vẻ đẹp diễm lệ như đóa hoa" },
  "漂亮": { image: "✨", caption: "xinh đẹp, lấp lánh cuốn hút" },
  "喜欢": { image: "❤️", caption: "yêu thích, mến mộ tha thiết" },
  "爱": { image: "💖", caption: "trái tim yêu thương đong đầy" },
  "大": { image: "🐘", caption: "to lớn, khổng lồ như voi" },
  "小": { image: "🐜", caption: "nhỏ bé, thanh mảnh như kiến" },
  "多": { image: "🌟", caption: "ngàn sao đông đúc nhiều vô kể" },
  "少": { image: "🪙", caption: "ít ỏi, thưa thớt, hiếm có" },
  "冷": { image: "🥶", caption: "băng giá lạnh buốt run người" },
  "热": { image: "🥵", caption: "nắng gắt, nóng bức oi ả" },
  "快": { image: "⚡", caption: "tia chớp nhanh như bay" },
  "慢": { image: "🐢", caption: "từng bước chậm rãi như rùa" },
  "远": { image: "🔭", caption: "xa xôi tít tắp nơi chân trời" },
  "近": { image: "📍", caption: "ngay trước mắt, cận kề bên cạnh" },
  "高": { image: "🦒", caption: "cao vút ngút ngàn như hươu cao cổ" },
  "矮": { image: "🌱", caption: "mầm cây nhỏ bé, thấp lùn" },
  "新": { image: "🆕", caption: "mới mẻ, tinh khôi vừa mở" },
  "旧": { image: "📦", caption: "cũ kỹ, lưu giữ dấu ấn thời gian" },
  "吃": { image: "🥢", caption: "cầm đũa dùng bữa ngon lành" },
  "喝": { image: "🥤", caption: "uống nước giải khát đã khát" },
  "睡": { image: "😴", caption: "giấc ngủ sâu êm đềm bình yên" },
  "写": { image: "✍️", caption: "ngòi bút nắn nót từng con chữ" },
  "听": { image: "🎧", caption: "lắng nghe âm thanh giai điệu" },
  "说": { image: "🗣️", caption: "lời ăn tiếng nói giao tiếp thân thiện" },
  "走": { image: "🚶", caption: "sải bước đi thong dong trên phố" },
  "跑": { image: "🏃", caption: "chạy nước rút rèn luyện thể lực" }
};
Object.assign(imagesMap, curatedImages);

// -------------------------------------------------------------
// 3. Comprehensive Curated Homophones Catalog (Từ đồng âm kinh điển)
// -------------------------------------------------------------
const curatedHomophones = {
  "shì": [
    { hanzi: "是", meaning: "là, vâng, phải", pinyin: "shì" },
    { hanzi: "事", meaning: "sự việc, công chuyện", pinyin: "shì" },
    { hanzi: "市", meaning: "thành phố, thị trường", pinyin: "shì" },
    { hanzi: "试", meaning: "thử nghiệm, thi cử", pinyin: "shì" },
    { hanzi: "室", meaning: "căn phòng (phòng học, làm việc)", pinyin: "shì" },
    { hanzi: "视", meaning: "thị giác, nhìn ngắm (电视, 视觉)", pinyin: "shì" },
    { hanzi: "适", meaning: "thích hợp, vừa vặn (适合)", pinyin: "shì" }
  ],
  "yī": [
    { hanzi: "一", meaning: "số một (1)", pinyin: "yī" },
    { hanzi: "医", meaning: "y tế, bác sĩ (医生, 医院)", pinyin: "yī" },
    { hanzi: "衣", meaning: "quần áo, trang phục (衣服)", pinyin: "yī" },
    { hanzi: "依", meaning: "nương tựa, y theo (依靠, 依然)", pinyin: "yī" }
  ],
  "yì": [
    { hanzi: "意", meaning: "ý nghĩ, ý kiến, tâm ý (意思, 意见)", pinyin: "yì" },
    { hanzi: "义", meaning: "nghĩa khí, ý nghĩa (意义, 正义)", pinyin: "yì" },
    { hanzi: "易", meaning: "dễ dàng, biến dịch (容易, 交易)", pinyin: "yì" },
    { hanzi: "艺", meaning: "nghệ thuật, tài nghệ (艺术, 文艺)", pinyin: "yì" },
    { hanzi: "议", meaning: "thảo luận, nghị sự (会议, 建议)", pinyin: "yì" }
  ],
  "gōng": [
    { hanzi: "工", meaning: "công việc, công nhân (工作, 工人)", pinyin: "gōng" },
    { hanzi: "公", meaning: "công cộng, của chung (公共, 公园)", pinyin: "gōng" },
    { hanzi: "功", meaning: "công phu, công lao (功课, 成功)", pinyin: "gōng" },
    { hanzi: "弓", meaning: "cây cung (cung tên)", pinyin: "gōng" }
  ],
  "bǐ": [
    { hanzi: "比", meaning: "so sánh, đọ sức (比赛, 比如)", pinyin: "bǐ" },
    { hanzi: "笔", meaning: "cây bút viết (铅笔, 毛笔)", pinyin: "bǐ" },
    { hanzi: "彼", meaning: "bên kia, đối phương (彼此)", pinyin: "bǐ" }
  ],
  "zài": [
    { hanzi: "在", meaning: "ở tại, đang diễn ra (在家, 正在)", pinyin: "zài" },
    { hanzi: "再", meaning: "lại, thêm lần nữa (再见, 再来)", pinyin: "zài" },
    { hanzi: "载", meaning: "chở, đăng tải (下载, 记载)", pinyin: "zài" }
  ],
  "tā": [
    { hanzi: "他", meaning: "anh ấy, ông ấy (ngôi 3 nam)", pinyin: "tā" },
    { hanzi: "她", meaning: "cô ấy, bà ấy (ngôi 3 nữ)", pinyin: "tā" },
    { hanzi: "它", meaning: "nó (ngôi 3 động vật, đồ vật)", pinyin: "tā" }
  ],
  "xiàng": [
    { hanzi: "像", meaning: "giống như, bức tượng (画像, 好像)", pinyin: "xiàng" },
    { hanzi: "向", meaning: "hướng về, phương hướng (向前, 方向)", pinyin: "xiàng" },
    { hanzi: "相", meaning: "tướng mạo, hình ảnh (照相, 相片)", pinyin: "xiàng" },
    { hanzi: "象", meaning: "con voi, hiện tượng (大象, 现象)", pinyin: "xiàng" }
  ],
  "huà": [
    { hanzi: "话", meaning: "lời nói, đàm thoại (说话, 汉语)", pinyin: "huà" },
    { hanzi: "画", meaning: "vẽ tranh, bức họa (画画, 画家)", pinyin: "huà" },
    { hanzi: "化", meaning: "biến hóa, hóa giải (文化, 变化)", pinyin: "huà" }
  ],
  "shēng": [
    { hanzi: "生", meaning: "sinh ra, học sinh, sống (学生, 生日)", pinyin: "shēng" },
    { hanzi: "声", meaning: "âm thanh, tiếng vang (声音, 声明)", pinyin: "shēng" },
    { hanzi: "升", meaning: "thăng tiến, lên cao (升高, 升旗)", pinyin: "shēng" }
  ],
  "xīn": [
    { hanzi: "心", meaning: "trái tim, tâm hồn (心情, 开心)", pinyin: "xīn" },
    { hanzi: "新", meaning: "mới mẻ, tinh khôi (新年, 新鲜)", pinyin: "xīn" },
    { hanzi: "辛", meaning: "vất vả, cay đắng (辛苦)", pinyin: "xīn" },
    { hanzi: "薪", meaning: "tiền lương, thù lao (薪水)", pinyin: "xīn" }
  ],
  "qī": [
    { hanzi: "七", meaning: "số bảy (7)", pinyin: "qī" },
    { hanzi: "期", meaning: "kỳ hạn, thời kỳ (星期, 学期)", pinyin: "qī" },
    { hanzi: "妻", meaning: "người vợ (妻子)", pinyin: "qī" }
  ],
  "bā": [
    { hanzi: "八", meaning: "số tám (8)", pinyin: "bā" },
    { hanzi: "吧", meaning: "trợ từ ngữ khí 'nhé', 'đi'", pinyin: "ba" }
  ],
  "jiāo": [
    { hanzi: "交", meaning: "giao lưu, kết bạn, nộp (交朋友, 交谈)", pinyin: "jiāo" },
    { hanzi: "教", meaning: "dạy dỗ, giáo dục (教书, 教授)", pinyin: "jiāo" },
    { hanzi: "焦", meaning: "sốt ruột, tiêu điểm (焦点, 焦急)", pinyin: "jiāo" },
    { hanzi: "蕉", meaning: "quả chuối (香蕉)", pinyin: "jiāo" }
  ],
  "dào": [
    { hanzi: "到", meaning: "đến nơi, đạt được (到达, 得到)", pinyin: "dào" },
    { hanzi: "道", meaning: "con đường, đạo lý (知道, 道理)", pinyin: "dào" },
    { hanzi: "倒", meaning: "rót nước, đảo ngược (倒水, 倒车)", pinyin: "dào" }
  ],
  "míng": [
    { hanzi: "明", meaning: "sáng sủa, ngày mai (明天, 明白)", pinyin: "míng" },
    { hanzi: "名", meaning: "tên gọi, danh tiếng (名字, 名气)", pinyin: "míng" }
  ],
  "kè": [
    { hanzi: "课", meaning: "bài học, tiết học (上课, 课本)", pinyin: "kè" },
    { hanzi: "客", meaning: "khách khứa, khách hàng (客人, 客气)", pinyin: "kè" },
    { hanzi: "刻", meaning: "khắc, 15 phút (刻钟, 刻苦)", pinyin: "kè" }
  ],
  "zhōng": [
    { hanzi: "中", meaning: "ở giữa, trung tâm (中国, 中间)", pinyin: "zhōng" },
    { hanzi: "钟", meaning: "đồng hồ, chuông (时钟, 钟头)", pinyin: "zhōng" },
    { hanzi: "终", meaning: "kết thúc, chung cuộc (终于, 最终)", pinyin: "zhōng" }
  ],
  "jiàn": [
    { hanzi: "见", meaning: "gặp gỡ, nhìn thấy (看见, 再见)", pinyin: "jiàn" },
    { hanzi: "件", meaning: "lượng từ áo quần, sự việc (一件衣服, 条件)", pinyin: "jiàn" },
    { hanzi: "建", meaning: "xây dựng, kiến thiết (建设, 建议)", pinyin: "jiàn" },
    { hanzi: "健", meaning: "khỏe mạnh, thể thao (健康, 健身)", pinyin: "jiàn" }
  ],
  "lì": [
    { hanzi: "力", meaning: "sức lực, khả năng (力量, 能力)", pinyin: "lì" },
    { hanzi: "丽", meaning: "xinh đẹp, lộng lẫy (美丽, 靓丽)", pinyin: "lì" },
    { hanzi: "利", meaning: "lợi ích, thuận lợi (胜利, 顺利)", pinyin: "lì" },
    { hanzi: "立", meaning: "đứng thẳng, thành lập (独立, 起立)", pinyin: "lì" },
    { hanzi: "历", meaning: "lịch sử, trải qua (历史, 经历)", pinyin: "lì" }
  ],
  "bàn": [
    { hanzi: "半", meaning: "một nửa, rưỡi (一半, 半天)", pinyin: "bàn" },
    { hanzi: "办", meaning: "làm, xử lý (办法, 办事)", pinyin: "bàn" },
    { hanzi: "伴", meaning: "bạn đồng hành (伴侣, 陪伴)", pinyin: "bàn" }
  ],
  "fú": [
    { hanzi: "福", meaning: "hạnh phúc, phúc khí (幸福, 祝福)", pinyin: "fú" },
    { hanzi: "服", meaning: "quần áo, phục vụ (衣服, 服务)", pinyin: "fú" },
    { hanzi: "幅", meaning: "lượng từ bức tranh (一幅画)", pinyin: "fú" }
  ],
  "zhù": [
    { hanzi: "住", meaning: "cư trú, ở (住在, 宿舍)", pinyin: "zhù" },
    { hanzi: "祝", meaning: "chúc mừng (祝贺, 祝你)", pinyin: "zhù" },
    { hanzi: "注", meaning: "chú ý, rót vào (注意, 注重)", pinyin: "zhù" },
    { hanzi: "助", meaning: "giúp đỡ, tương trợ (帮助, 助理)", pinyin: "zhù" }
  ],
  "yuán": [
    { hanzi: "元", meaning: "đồng nhân dân tệ, nguồn gốc (元旦, 一元)", pinyin: "yuán" },
    { hanzi: "原", meaning: "nguyên bản, nguyên nhân (原来, 原因)", pinyin: "yuán" },
    { hanzi: "园", meaning: "khu vườn, công viên (公园, 校园)", pinyin: "yuán" },
    { hanzi: "圆", meaning: "tròn trịa, đoàn viên (圆圈, 团圆)", pinyin: "yuán" },
    { hanzi: "员", meaning: "thành viên, nhân viên (学员, 演员)", pinyin: "yuán" }
  ],
  "kuài": [
    { hanzi: "快", meaning: "nhanh chóng, sắp sửa (快乐, 飞快)", pinyin: "kuài" },
    { hanzi: "块", meaning: "đồng, cục, miếng (一块钱, 肉块)", pinyin: "kuài" }
  ]
};

// -------------------------------------------------------------
// 4. Clean Etymology Common Words (Filter out undefined)
// -------------------------------------------------------------
const etymCleanMap = {};
etym.forEach(e => {
  if (e.hanzi) {
    let words = (e.commonWords || []).filter(w => w && typeof w === 'string' && !w.includes('undefined'));
    etymCleanMap[e.hanzi] = words;
  }
});

// -------------------------------------------------------------
// 5. Build Unified Vocabulary Registry
// -------------------------------------------------------------
const multidimensionalWords = {};
const allWordKeys = new Set();

// A. Register Core Dictionary Words
dict.forEach(w => {
  const hanzi = w.title;
  allWordKeys.add(hanzi);
  const py = w.pinyin || '';
  const cleanPy = py.toLowerCase().replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, '');

  // Usage Builder
  const usagePoints = [];
  const pos = w.pos || 'từ vựng';
  if (pos.includes('động từ')) {
    usagePoints.push(`🔹 [Động từ] + Tân ngữ: cấu trúc '${hanzi} + ...' thường dùng biểu đạt hành động hoặc trạng thái.`);
    usagePoints.push(`🔹 Thường kết hợp phó từ phủ định: '不${hanzi}' (không ${w.meaning}) hoặc '没${hanzi}' (chưa ${w.meaning}).`);
  } else if (pos.includes('tính từ')) {
    usagePoints.push(`🔹 Kết hợp phó từ mức độ: '很${hanzi}', '非常${hanzi}', '特别${hanzi}' (rất / vô cùng ${w.meaning}).`);
    usagePoints.push(`🔹 Làm định ngữ trước danh từ: '${hanzi}的 + [Danh từ]'.`);
  } else if (pos.includes('danh từ')) {
    usagePoints.push(`🔹 Đi kèm lượng từ chỉ lượng: '这 / 那 / [Số từ] + Lượng từ + ${hanzi}'.`);
    usagePoints.push(`🔹 Đảm nhiệm vai trò chủ ngữ đứng đầu câu hoặc làm tân ngữ sau động từ.`);
  } else if (pos.includes('phó từ')) {
    usagePoints.push(`🔹 Vị trí ngữ pháp: Đứng trước Động từ hoặc Tính từ để bổ nghĩa (ví dụ: '${hanzi} + V/Adj').`);
  } else if (pos.includes('lượng từ')) {
    usagePoints.push(`🔹 Cấu trúc chuẩn: 'Số từ + ${hanzi} + Danh từ'.`);
  } else {
    usagePoints.push(`🔹 Từ vựng giao tiếp cốt lõi HSK ${w.level || 1}.`);
  }

  // Collocations from cleaned etymology
  const cleanWords = etymCleanMap[hanzi] || [];
  if (cleanWords.length > 0) {
    usagePoints.push(`🔹 Cụm từ hay gặp (常搭配): ${cleanWords.slice(0, 4).join(', ')}.`);
  } else if (hanzi.length > 1) {
    // Check characters inside
    const subClean = [];
    hanzi.split('').forEach(ch => {
      if (etymCleanMap[ch]) subClean.push(...etymCleanMap[ch]);
    });
    const uniq = Array.from(new Set(subClean.filter(x => !x.includes(hanzi))));
    if (uniq.length > 0) {
      usagePoints.push(`🔹 Cụm từ họ chữ liên quan: ${uniq.slice(0, 3).join(', ')}.`);
    }
  }

  // Synonyms & Antonyms
  const syns = synonymsMap[hanzi] || [];
  const ants = antonymsMap[hanzi] || [];

  // Homophones
  let homos = [];
  for (const [keyPy, list] of Object.entries(curatedHomophones)) {
    if (cleanPy === keyPy || cleanPy.startsWith(keyPy)) {
      homos = list.filter(item => item.hanzi !== hanzi);
      break;
    }
  }

  // Visual Image
  const imgData = imagesMap[hanzi] || null;

  multidimensionalWords[hanzi] = {
    hanzi: hanzi,
    pinyin: py,
    hanviet: resolveHanviet(hanzi, w.hanviet),
    meaning: w.meaning || '',
    pos: pos,
    level: w.level || 1,
    usage: usagePoints,
    exampleSentence: w.exampleSentence || `${hanzi}很好。`,
    examplePinyin: w.examplePinyin || '',
    exampleMeaning: w.exampleMeaning || '',
    synonyms: syns,
    antonyms: ants,
    homophones: homos.slice(0, 5),
    image: imgData ? imgData.image : (w.topicIcon || '🏮'),
    imageCaption: imgData ? imgData.caption : (w.meaning || 'Minh họa trực quan')
  };
});

// B. Register Extra Words from Flip Card Levels (so all 1000 pairs have full profiles)
extraFlipWords.forEach((wordInfo, hanzi) => {
  if (multidimensionalWords[hanzi]) {
    // Update missing synonyms/antonyms/images if any
    const existing = multidimensionalWords[hanzi];
    if ((!existing.synonyms || existing.synonyms.length === 0) && synonymsMap[hanzi]) {
      existing.synonyms = synonymsMap[hanzi];
    }
    if ((!existing.antonyms || existing.antonyms.length === 0) && antonymsMap[hanzi]) {
      existing.antonyms = antonymsMap[hanzi];
    }
    if ((!existing.image || existing.image === '🏮') && imagesMap[hanzi]) {
      existing.image = imagesMap[hanzi].image;
      existing.imageCaption = imagesMap[hanzi].caption;
    }
    return;
  }

  allWordKeys.add(hanzi);
  const py = wordInfo.pinyin || '';
  const cleanPy = py.toLowerCase().replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, '');
  const meaning = wordInfo.meaning || '';

  const usagePoints = [
    `🔹 Cấu trúc sử dụng chuẩn trong giao tiếp và kỳ thi HSK.`,
    `🔹 Thường dùng phối hợp với các từ ngữ tương đương hoặc đối lập.`
  ];
  if (synonymsMap[hanzi] && synonymsMap[hanzi].length > 0) {
    const s = synonymsMap[hanzi][0];
    usagePoints.push(`🔹 So sánh gần nghĩa: '${hanzi}' có nghĩa tương đương với '${s.hanzi}' (${s.pinyin}: ${s.meaning}).`);
  }
  if (antonymsMap[hanzi] && antonymsMap[hanzi].length > 0) {
    const a = antonymsMap[hanzi][0];
    usagePoints.push(`🔹 Phản nghĩa đối lập: '${hanzi}' đối lập ý nghĩa với '${a.hanzi}' (${a.pinyin}: ${a.meaning}).`);
  }

  // Homophones
  let homos = [];
  for (const [keyPy, list] of Object.entries(curatedHomophones)) {
    if (cleanPy === keyPy || cleanPy.startsWith(keyPy)) {
      homos = list.filter(item => item.hanzi !== hanzi);
      break;
    }
  }

  const imgData = imagesMap[hanzi] || null;

  multidimensionalWords[hanzi] = {
    hanzi: hanzi,
    pinyin: py,
    hanviet: resolveHanviet(hanzi, ''),
    meaning: meaning,
    pos: 'từ vựng mở rộng',
    level: 2,
    usage: usagePoints,
    exampleSentence: wordInfo.exampleSentence || `大家都很熟悉${hanzi}。`,
    examplePinyin: '',
    exampleMeaning: wordInfo.exampleSentence ? 'Câu ứng dụng giao tiếp thực tế.' : `Mọi người đều rất quen thuộc với ${hanzi}.`,
    synonyms: synonymsMap[hanzi] || [],
    antonyms: antonymsMap[hanzi] || [],
    homophones: homos.slice(0, 5),
    image: imgData ? imgData.image : (wordInfo.image || '✨'),
    imageCaption: imgData ? imgData.caption : (meaning || 'Thẻ từ vựng tương tác')
  };
});

// C. Register Vocabulary from Conversations 150
conv.forEach(c => {
  (c.vocabulary || []).forEach(v => {
    const hanzi = v.hanzi;
    if (!hanzi) return;
    if (multidimensionalWords[hanzi]) return;

    allWordKeys.add(hanzi);
    const py = v.pinyin || '';
    const cleanPy = py.toLowerCase().replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, '');
    const lvlNum = parseInt((v.hsk || 'HSK 2').replace(/\D/g, '')) || 2;

    const usagePoints = [
      `🔹 Xuất hiện trong bài hội thoại thực chiến số ${c.id}: "${c.title}".`,
      `🔹 Chủ đề ngữ cảnh: ${c.topic || 'Giao tiếp hàng ngày'}.`
    ];

    let homos = [];
    for (const [keyPy, list] of Object.entries(curatedHomophones)) {
      if (cleanPy === keyPy || cleanPy.startsWith(keyPy)) {
        homos = list.filter(item => item.hanzi !== hanzi);
        break;
      }
    }

    const imgData = imagesMap[hanzi] || null;

    multidimensionalWords[hanzi] = {
      hanzi: hanzi,
      pinyin: py,
      hanviet: resolveHanviet(hanzi, ''),
      meaning: v.meaning || '',
      pos: 'từ vựng hội thoại',
      level: lvlNum,
      usage: usagePoints,
      exampleSentence: (c.dialogue && c.dialogue[0]) ? c.dialogue[0].hanzi : `${hanzi}。`,
      examplePinyin: (c.dialogue && c.dialogue[0]) ? c.dialogue[0].pinyin : py,
      exampleMeaning: (c.dialogue && c.dialogue[0]) ? c.dialogue[0].vi : v.meaning,
      synonyms: synonymsMap[hanzi] || [],
      antonyms: antonymsMap[hanzi] || [],
      homophones: homos.slice(0, 5),
      image: imgData ? imgData.image : '💬',
      imageCaption: imgData ? imgData.caption : (v.meaning || 'Từ vựng hội thoại tình huống')
    };
  });
});

// -------------------------------------------------------------
// 6. Cross-fill Homophones Across the Entire Dataset
// -------------------------------------------------------------
const pinyinBuckets = {};
for (const [w, obj] of Object.entries(multidimensionalWords)) {
  const clean = (obj.pinyin || '').toLowerCase().replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, '');
  if (clean && clean.length <= 6) {
    if (!pinyinBuckets[clean]) pinyinBuckets[clean] = [];
    pinyinBuckets[clean].push({ hanzi: obj.hanzi, pinyin: obj.pinyin, meaning: obj.meaning });
  }
}

for (const [w, obj] of Object.entries(multidimensionalWords)) {
  if (!obj.homophones || obj.homophones.length === 0) {
    const clean = (obj.pinyin || '').toLowerCase().replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, '');
    if (pinyinBuckets[clean] && pinyinBuckets[clean].length > 1) {
      obj.homophones = pinyinBuckets[clean]
        .filter(x => x.hanzi !== w)
        .slice(0, 5);
    }
  }
}

// Cross-fill missing pinyin & meaning in synonyms and antonyms
for (const [w, obj] of Object.entries(multidimensionalWords)) {
  if (obj.synonyms && obj.synonyms.length > 0) {
    obj.synonyms.forEach(s => {
      if ((!s.pinyin || !s.meaning) && multidimensionalWords[s.hanzi]) {
        s.pinyin = s.pinyin || multidimensionalWords[s.hanzi].pinyin;
        s.meaning = s.meaning || multidimensionalWords[s.hanzi].meaning;
      }
    });
  }
  if (obj.antonyms && obj.antonyms.length > 0) {
    obj.antonyms.forEach(a => {
      if ((!a.pinyin || !a.meaning) && multidimensionalWords[a.hanzi]) {
        a.pinyin = a.pinyin || multidimensionalWords[a.hanzi].pinyin;
        a.meaning = a.meaning || multidimensionalWords[a.hanzi].meaning;
      }
    });
  }
}

console.log(`Successfully compiled multidimensional dataset: ${Object.keys(multidimensionalWords).length} words.`);

let synCount = 0, antCount = 0, homoCount = 0, imgCount = 0;
for (const [k, v] of Object.entries(multidimensionalWords)) {
  if (v.synonyms && v.synonyms.length > 0) synCount++;
  if (v.antonyms && v.antonyms.length > 0) antCount++;
  if (v.homophones && v.homophones.length > 0) homoCount++;
  if (v.image) imgCount++;
}
console.log({ totalWords: Object.keys(multidimensionalWords).length, synCount, antCount, homoCount, imgCount });

// Write output
const outPath = path.join(__dirname, '../../public/data/multidimensional_words.json');
fs.writeFileSync(outPath, JSON.stringify(multidimensionalWords, null, 2), 'utf8');
console.log(`Saved output to ${outPath}`);
