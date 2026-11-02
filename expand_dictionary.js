const fs = require('fs');
const path = require('path');

const dictPath = path.join(__dirname, 'data', 'dictionary.json');
const currentDict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// HSK 4, 5, 6 & Specialized Vocabulary
const advancedVocab = [
  // HSK 4 Core
  { title: "不仅", pinyin: "bùjǐn", meaning: "không những, không chỉ", pos: "liên từ", level: 4, topic: "Ngữ pháp HSK 4", exampleSentence: "他不仅会唱歌，还会跳舞。", examplePinyin: "Tā bùjǐn huì chànggē, hái huì tiàowǔ.", exampleMeaning: "Anh ấy không những biết hát mà còn biết nhảy." },
  { title: "甚至", pinyin: "shènzhì", meaning: "thậm chí, ngay cả", pos: "phó từ", level: 4, topic: "Ngữ pháp HSK 4", exampleSentence: "他太忙了，甚至连午饭都没吃。", examplePinyin: "Tā tài máng le, shènzhì lián wǔfàn dōu méi chī.", exampleMeaning: "Anh ấy bận quá, thậm chí cơm trưa còn chưa ăn." },
  { title: "究竟", pinyin: "jiūjìng", meaning: "rốt cuộc, suy cho cùng", pos: "phó từ", level: 4, topic: "Giao tiếp nâng cao", exampleSentence: "你究竟打算什么时候回国？", examplePinyin: "Nǐ jiūjìng dǎsuàn shénme shíhou huí guó?", exampleMeaning: "Rốt cuộc bạn dự định khi nào về nước?" },
  { title: "尽管", pinyin: "jǐnguǎn", meaning: "cho dù, mặc dù; cứ việc", pos: "liên từ", level: 4, topic: "Ngữ pháp HSK 4", exampleSentence: "尽管下着大雨，他还是按时到了。", examplePinyin: "Jǐnguǎn xià zhe dàyǔ, tā háishì ànshí dào le.", exampleMeaning: "Cho dù mưa to, anh ấy vẫn đến đúng giờ." },
  { title: "坚持", pinyin: "jiānchí", meaning: "kiên trì, bền chí", pos: "động từ", level: 4, topic: "Ý chí & Hành động", exampleSentence: "只有坚持到底，才能取得最后的胜利。", examplePinyin: "Zhǐyǒu jiānchí dàodǐ, cái néng qǔdé zuìhòu de shènglì.", exampleMeaning: "Chỉ khi kiên trì đến cùng mới có thể giành thắng lợi cuối cùng." },
  { title: "稍微", pinyin: "shāowēi", meaning: "hơi hơi, một chút", pos: "phó từ", level: 4, topic: "Mức độ", exampleSentence: "请你稍微等我一下，我马上就来。", examplePinyin: "Qǐng nǐ shāowēi děng wǒ yíxià, wǒ mǎshàng jiù lái.", exampleMeaning: "Xin bạn đợi tôi một lát, tôi tới ngay đây." },
  { title: "整理", pinyin: "zhěnglǐ", meaning: "thu dọn, chỉnh lý, sắp xếp", pos: "động từ", level: 4, topic: "Đời sống hàng ngày", exampleSentence: "我需要花时间整理一下这些文件。", examplePinyin: "Wǒ xūyào huā shíjiān zhěnglǐ yíxià zhèxiē wénjiàn.", exampleMeaning: "Tôi cần dành thời gian sắp xếp lại những tài liệu này." },
  { title: "适合", pinyin: "shìhé", meaning: "phù hợp, thích hợp", pos: "động từ", level: 4, topic: "Tính chất", exampleSentence: "这件衣服的风格非常适合你。", examplePinyin: "Zhè jiàn yīfu de fēnggé fēicháng shìhé nǐ.", exampleMeaning: "Phong cách của bộ quần áo này rất phù hợp với bạn." },

  // HSK 5 Core
  { title: "不仅如此", pinyin: "bùjǐn rúcǐ", meaning: "không dừng lại ở đó, chẳng những thế", pos: "cụm liên từ", level: 5, topic: "Hành văn nâng cao", exampleSentence: "他工作认真，不仅如此，还很有领导才能。", examplePinyin: "Tā gōngzuò rènzhēn, bùjǐn rúcǐ, hái hěn yǒu lǐngdǎo cáinéng.", exampleMeaning: "Anh ấy làm việc cẩn thận, không những thế còn rất có tài lãnh đạo." },
  { title: "所谓", pinyin: "suǒwèi", meaning: "cái gọi là", pos: "tính từ", level: 5, topic: "Học thuật", exampleSentence: "所谓的成功，其实就是坚持不懈的努力。", examplePinyin: "Suǒwèi de chénggōng, qíshí jiù shì jiānchíbúxiè de nǔlì.", exampleMeaning: "Cái gọi là thành công, thực chất là nỗ lực không ngừng nghỉ." },
  { title: "趋势", pinyin: "qūshì", meaning: "xu hướng, chiều hướng phát triển", pos: "danh từ", level: 5, topic: "Kinh tế & Xã hội", exampleSentence: "人工智能是未来科技发展的重要趋势。", examplePinyin: "Réngōng zhìnéng shì wèilái kējì fāzhǎn de zhòngyào qūshì.", exampleMeaning: "Trí tuệ nhân tạo là xu hướng phát triển trọng yếu của công nghệ tương lai." },
  { title: "资源", pinyin: "zīyuán", meaning: "tài nguyên, nguồn lực", pos: "danh từ", level: 5, topic: "Kinh tế & Môi trường", exampleSentence: "水是地球上最宝贵的自然资源之一。", examplePinyin: "Shuǐ shì dìqiú shang zuì bǎoguì de zìrán zīyuán zhī yī.", exampleMeaning: "Nước là một trong những tài nguyên thiên nhiên quý giá nhất trên trái đất." },
  { title: "矛盾", pinyin: "máodùn", meaning: "mâu thuẫn, xung đột", pos: "danh từ", level: 5, topic: "Triết học & Đời sống", exampleSentence: "他们两人性格不合，经常产生矛盾。", examplePinyin: "Tāmen liǎng rén xìnggé bù hé, jīngcháng chǎnshēng máodùn.", exampleMeaning: "Tính cách hai người họ không hợp nhau, thường nảy sinh mâu thuẫn." },
  { title: "投资", pinyin: "tóuzī", meaning: "đầu tư, nguồn vốn đầu tư", pos: "động từ/danh từ", level: 5, topic: "Kinh tế thương mại", exampleSentence: "投资有风险，入市需谨慎。", examplePinyin: "Tóuzī yǒu fēngxiǎn, rùshì xū jǐnshèn.", exampleMeaning: "Đầu tư luôn có rủi ro, tham gia thị trường cần cẩn trọng." },

  // HSK 6 & Specialized
  { title: "贯彻", pinyin: "guànchè", meaning: "quán triệt, thực hiện đến cùng", pos: "động từ", level: 6, topic: "Chính trị & Quản trị", exampleSentence: "公司必须坚决贯彻以客户为中心的发展战略。", examplePinyin: "Gōngsī bìxū jiānjué guànchè yǐ kèhù wéi zhōngxīn de fāzhǎn zhànlüè.", exampleMeaning: "Công ty phải kiên quyết quán triệt chiến lược phát triển lấy khách hàng làm trung tâm." },
  { title: "宏观", pinyin: "hóngguān", meaning: "vĩ mô, bao quát tầm vĩ mô", pos: "tính từ", level: 6, topic: "Kinh tế học", exampleSentence: "政府正通过宏观调控措施稳定房地产市场。", examplePinyin: "Zhèngfǔ zhèng tōngguò hóngguān tiáokòng cuòshī wěndìng fángdìchǎn shìchǎng.", exampleMeaning: "Chính phủ đang thông qua các biện pháp điều tiết vĩ mô để bình ổn thị trường bất động sản." },
  { title: "微观", pinyin: "wēiguān", meaning: "vi mô, chi tiết cụ thể", pos: "tính từ", level: 6, topic: "Kinh tế học", exampleSentence: "从微观角度分析消费者的心理变化。", examplePinyin: "Cóng wēiguān jiǎodù fēnxī xiāofèizhě de xīnlǐ biànhuà.", exampleMeaning: "Phân tích biến đổi tâm lý của người tiêu dùng từ góc độ vi mô." },
  { title: "契约", pinyin: "qìyuē", meaning: "khế ước, hợp đồng pháp lý", pos: "danh từ", level: 6, topic: "Thương mại & Pháp luật", exampleSentence: "签署正式契约前，请务必仔细阅读各项条款。", examplePinyin: "Qiānshǔ zhèngshì qìyuē qián, qǐng wùbì zǐxì yuèdú gè xiàng tiáokuǎn.", exampleMeaning: "Trước khi ký khế ước chính thức, nhất định phải đọc kỹ các điều khoản." },
  { title: "算法", pinyin: "suànfǎ", meaning: "thuật toán", pos: "danh từ", level: 5, topic: "Công nghệ thông tin", exampleSentence: "这个推荐算法极大地提升了用户停留时间。", examplePinyin: "Zhè ge tuījiàn suànfǎ jídà de tíshēng le yònghù tíngliú shíjiān.", exampleMeaning: "Thuật toán gợi ý này đã nâng cao đáng kể thời gian lưu lại của người dùng." },
  { title: "供应链", pinyin: "gōngyìngliàn", meaning: "chuỗi cung ứng", pos: "danh từ", level: 6, topic: "Thương mại quốc tế", exampleSentence: "全球供应链的稳定对跨国企业至关重要。", examplePinyin: "Quánqiú gōngyìngliàn de wěndìng duì kuàguó qǐyè zhìguān zhòngyào.", exampleMeaning: "Sự ổn định của chuỗi cung ứng toàn cầu có ý nghĩa sống còn đối với các tập đoàn đa quốc gia." },
  { title: "谈判", pinyin: "tánpàn", meaning: "đàm phán, thương lượng", pos: "động từ/danh từ", level: 5, topic: "Thương mại quốc tế", exampleSentence: "双方代表正在就关税问题进行闭门谈判。", examplePinyin: "Shuāngfāng dàibiǎo zhèngzài jiù guānshuì wèntí jìnxíng bìmén tánpàn.", exampleMeaning: "Đại diện hai bên đang tiến hành đàm phán kín về vấn đề thuế quan." },
  { title: "云计算", pinyin: "yúnsuàn", meaning: "điện toán đám mây", pos: "danh từ", level: 5, topic: "Công nghệ thông tin", exampleSentence: "云计算技术为企业节省了大量的服务器成本。", examplePinyin: "Yúnsuàn jīshù wèi qǐyè jiéshěng le dàliàng de fúwùqì chéngběn.", exampleMeaning: "Công nghệ điện toán đám mây giúp doanh nghiệp tiết kiệm rất nhiều chi phí máy chủ." }
];

// Append unique words
let addedCount = 0;
advancedVocab.forEach(item => {
  const exists = currentDict.some(w => w.title === item.title);
  if (!exists) {
    currentDict.push(item);
    addedCount++;
  }
});

fs.writeFileSync(dictPath, JSON.stringify(currentDict, null, 2), 'utf8');
console.log(`Đã mở rộng từ điển thành công! Thêm ${addedCount} từ vựng HSK 4-6 & Chuyên ngành. Tổng cộng: ${currentDict.length} mục từ.`);
