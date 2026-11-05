'use strict';

const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'data', 'grammar_compendium.json');

// Read existing 26 items
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
} catch (e) {
  existing = [];
}

console.log(`Loaded ${existing.length} existing grammar topics.`);

// Master list of 60+ grammar points covering HSK 1 to HSK 6
const newGrammarPoints = [
  // ==================== HSK 1 ====================
  {
    id: "g_hsk1_shi",
    category: "sentence_structure",
    categoryName: "Cấu Trúc Câu Cơ Bản",
    title: "1. Câu Vị Ngữ Danh Từ Chữ 是 (S + 是 + Danh từ / Đoản ngữ danh từ)",
    formula: "Chủ ngữ (S) + 是 + Tân ngữ (O)",
    level: "HSK 1",
    explanation: "Dùng để biểu thị sự phán đoán, khẳng định thân phận, quốc tịch, nghề nghiệp hoặc định nghĩa của chủ ngữ. Thể phủ định dùng '不是' (không phải là).",
    rules: [
      "Khẳng định: 我是学生 (Tôi là học sinh).",
      "Phủ định: 他不是中国老师 (Anh ấy không phải giáo viên người Trung Quốc).",
      "Nghi vấn: 你是李明吗？ (Bạn là Lý Minh phải không?)"
    ],
    mistakes: "❌ Sai: 我很不高兴是。(Tuyệt đối không dùng 是 trước tính từ đóng vai trò vị ngữ) ➔ ✅ Đúng: 我很高兴。",
    examples: [
      { hanzi: "我是越南人。", pinyin: "Wǒ shì Yuènán rén.", vi: "Tôi là người Việt Nam." },
      { hanzi: "他是我的好朋友。", pinyin: "Tā shì wǒ de hǎo péngyou.", vi: "Cậu ấy là bạn tốt của tôi." },
      { hanzi: "这本书是汉语书。", pinyin: "Zhè běn shū shì Hànyǔ shū.", vi: "Quyển sách này là sách tiếng Hán." }
    ],
    practiceQuiz: {
      question: "Chọn câu đúng về cấu trúc chữ 是:",
      options: ["A. 他是很累。", "B. 她是我的中文老师。", "C. 今天是热。"],
      answer: 1,
      explain: "Câu chữ 是 chỉ dùng nối chủ ngữ với danh từ hoặc cụm danh từ. Tính từ đứng một mình làm vị ngữ không dùng 是."
    }
  },
  {
    id: "g_hsk1_you",
    category: "sentence_structure",
    categoryName: "Cấu Trúc Câu Cơ Bản",
    title: "2. Câu Chữ 有 (Biểu thị Sở Hữu & Tồn Hiện)",
    formula: "S + 有 + Danh từ (Sở hữu) / Địa điểm + 有 + Người/Vật (Tồn hiện)",
    level: "HSK 1",
    explanation: "Biểu thị quyền sở hữu (ai có cái gì) hoặc sự tồn tại của người/vật ở một địa điểm nào đó. Thể phủ định của '有' BẮT BUỘC dùng '没有', tuyệt đối KHÔNG ĐƯỢC dùng '不有'.",
    rules: [
      "Phủ định: Luôn luôn là 没有 (không có).",
      "Câu hỏi: S + 有没有 + O? HOẶC S + 有 + O + 吗？"
    ],
    mistakes: "❌ Sai: 我不有钱。 ➔ ✅ Đúng: 我没有钱 (Tôi không có tiền).",
    examples: [
      { hanzi: "我有三本汉字书。", pinyin: "Wǒ yǒu sān běn hànzì shū.", vi: "Tôi có ba quyển sách chữ Hán." },
      { hanzi: "桌子上有一个苹果。", pinyin: "Zhuōzi shang yǒu yí gè píngguǒ.", vi: "Trên bàn có một quả táo." },
      { hanzi: "你家有几口人？", pinyin: "Nǐ jiā yǒu jǐ kǒu rén?", vi: "Nhà bạn có mấy người?" }
    ],
    practiceQuiz: {
      question: "Phủ định của '我有汉语词典' là gì?",
      options: ["A. 我不有汉语词典", "B. 我没汉语词典", "C. 我没有汉语词典"],
      answer: 2,
      explain: "Phủ định của 有 bắt buộc phải dùng 没有."
    }
  },
  {
    id: "g_hsk1_bu_vs_mei",
    category: "particles_adverbs",
    categoryName: "Phó Từ & Trợ Từ",
    title: "3. Phân Biệt Phó Từ Phủ Định: 不 vs 没 (没有)",
    formula: "不 + V / Adj (Hiện tại, tương lai, thói quen, ý chí) vs 没(有) + V (Quá khứ, sự việc chưa xảy ra)",
    level: "HSK 1",
    explanation: "不 phủ định mang tính chủ quan, ý chí (không muốn, không thích) hoặc cho hiện tại/tương lai. 没(有) phủ định sự thật khách quan (chưa làm, chưa xảy ra trong quá khứ) và dùng với 有.",
    rules: [
      "Không muốn làm / thói quen: 我不去 (Tôi không đi).",
      "Chưa làm trong quá khứ: 我昨天没去 (Hôm qua tôi chưa đi).",
      "Tính từ phủ định dùng 不: 不冷, 不热, 不好."
    ],
    mistakes: "❌ Sai: 昨天我再去不学校。 ➔ ✅ Đúng: 昨天我没去学校。",
    examples: [
      { hanzi: "他不喜欢喝茶。", pinyin: "Tā bù xǐhuan hē chá.", vi: "Anh ấy không thích uống trà (thói quen, sở thích)." },
      { hanzi: "今天早上我没吃早饭。", pinyin: "Jīntiān zǎoshang wǒ méi chī zǎofàn.", vi: "Sáng nay tôi chưa ăn sáng (hành động chưa diễn ra)." },
      { hanzi: "明天如果不下雨，我就去。", pinyin: "Míngtiān rúguǒ bú xià yǔ, wǒ jiù qù.", vi: "Ngày mai nếu không mưa thì tôi sẽ đi." }
    ],
    practiceQuiz: {
      question: "Điền vào chỗ trống: 他昨天 ____ 来上课。",
      options: ["A. 不", "B. 没", "C. 别"],
      answer: 1,
      explain: "昨天 (hôm qua) là thời gian quá khứ, phủ định hành động đã không xảy ra bắt buộc dùng 没."
    }
  },
  {
    id: "g_hsk1_questions_ma_ne",
    category: "sentence_structure",
    categoryName: "Câu Nghi Vấn (Nghi Vấn Cú)",
    title: "4. Câu Hỏi Nghi Vấn Với 吗 & Câu Hỏi Tỉnh Lược 呢",
    formula: "Khẳng định + 吗？ (Có... không?) / Danh từ/Đại từ + 呢？ (Còn... thì sao?)",
    level: "HSK 1",
    explanation: "Thêm 吗 vào cuối câu trần thuật để biến thành câu hỏi có/không. Dùng 呢 sau danh từ để hỏi lặp lại câu hỏi trước đó hoặc hỏi người/vật đang ở đâu.",
    rules: [
      "Câu hỏi 吗: 你是老师吗？ (Bạn là giáo viên phải không?)",
      "Câu hỏi 呢: 我很好，你呢？ (Tôi rất khỏe, còn bạn thì sao?)"
    ],
    mistakes: "❌ Sai: 你去哪儿吗？ ➔ ✅ Đúng: 你去哪儿？ (Trong câu đã có đại từ nghi vấn như 哪儿, 什么 thì không được thêm 吗 nữa).",
    examples: [
      { hanzi: "你喜欢学中文吗？", pinyin: "Nǐ xǐhuan xué Zhōngwén ma?", vi: "Bạn có thích học tiếng Trung không?" },
      { hanzi: "我的手机呢？", pinyin: "Wǒ de shǒujī ne?", vi: "Điện thoại của tôi đâu rồi nhỉ?" },
      { hanzi: "这是你的书吗？", pinyin: "Zhè shì nǐ de shū ma?", vi: "Đây là sách của bạn phải không?" }
    ],
    practiceQuiz: {
      question: "Câu nào sau đây sai ngữ pháp?",
      options: ["A. 你在做什么吗？", "B. 他是你的朋友吗？", "C. 我叫李明，你呢？"],
      answer: 0,
      explain: "Câu đã có đại từ nghi vấn 做什么 thì không được thêm 吗."
    }
  },
  {
    id: "g_hsk1_de_possession",
    category: "particles_adverbs",
    categoryName: "Phó Từ & Trợ Từ",
    title: "5. Trợ Từ Kết Cấu Sở Hữu 的 (Định ngữ + 的 + Trung tâm ngữ)",
    formula: "Định ngữ (Chủ sở hữu / Tính chất) + 的 + Trung tâm ngữ (Danh từ được bổ nghĩa)",
    level: "HSK 1",
    explanation: "Biểu thị quan hệ sở hữu (của) hoặc tính chất miêu tả. Khi định ngữ là đại từ nhân xưng chỉ mối quan hệ thân thuộc (bố mẹ, anh em) hoặc cơ quan tập thể thì có thể lược bỏ 的.",
    rules: [
      "Bắt buộc có 的: 我的电脑 (Máy tính của tôi), 漂亮的衣服 (Quần áo đẹp).",
      "Có thể bỏ 的: 我妈妈 (Mẹ tôi), 我家 (Nhà tôi), 我学校 (Trường tôi)."
    ],
    mistakes: "❌ Sai: 这是谁书？ ➔ ✅ Đúng: 这是谁的书？ (Đây là sách của ai?)",
    examples: [
      { hanzi: "这是我的中文课本。", pinyin: "Zhè shì wǒ de Zhōngwén kèběn.", vi: "Đây là sách giáo khoa tiếng Trung của tôi." },
      { hanzi: "红色的苹果很好吃。", pinyin: "Hóngsè de píngguǒ hěn hǎochī.", vi: "Quả táo màu đỏ rất ngon." },
      { hanzi: "她爸爸是医生。", pinyin: "Tā bàba shì yīshēng.", vi: "Bố cô ấy là bác sĩ." }
    ],
    practiceQuiz: {
      question: "Trường hợp nào sau đây có thể bỏ chữ '的'?",
      options: ["A. 我 ____ 电脑", "B. 我 ____ 爸爸", "C. 新 ____ 手机"],
      answer: 1,
      explain: "Quan hệ gia đình thân thuộc như 'bố tôi' có thể bỏ 的 thành 我爸爸."
    }
  },
  {
    id: "g_hsk1_zai_location",
    category: "sentence_structure",
    categoryName: "Cấu Trúc Câu Cơ Bản",
    title: "6. Cấu Trúc Địa Điểm Với 在 (Chủ ngữ + 在 + Nơi chốn + Động từ)",
    formula: "S + 在 + Địa điểm / Nơi chốn + Hành động (V + O)",
    level: "HSK 1",
    explanation: "Trong tiếng Trung, TRẠNG NGỮ CHỈ NƠI CHỐN LUÔN ĐỨNG TRƯỚC ĐỘNG TỪ CHÍNH. Đây là sự khác biệt rất lớn so với tiếng Việt (tiếng Việt nói: Tôi ăn cơm ở nhà ➔ Tiếng Trung: Tôi ở nhà ăn cơm).",
    rules: [
      "Đúng trật tự: S + 在 + Địa điểm + V",
      "Ở đâu làm gì: 我在图书馆看书 (Tôi ở thư viện đọc sách)."
    ],
    mistakes: "❌ Sai: 我吃晚饭在食堂。 ➔ ✅ Đúng: 我在食堂吃晚饭。",
    examples: [
      { hanzi: "他在北京工作。", pinyin: "Tā zài Běijīng gōngzuò.", vi: "Anh ấy làm việc ở Bắc Kinh." },
      { hanzi: "我们在教室里学汉语。", pinyin: "Wǒmen zài jiàoshì lǐ xué Hànyǔ.", vi: "Chúng tôi học tiếng Hán trong lớp học." },
      { hanzi: "你现在在哪儿？", pinyin: "Nǐ xiànzài zài nǎr?", vi: "Bây giờ bạn đang ở đâu?" }
    ],
    practiceQuiz: {
      question: "Dịch câu 'Tôi đọc sách ở nhà' sang tiếng Trung chuẩn:",
      options: ["A. 我看书在家。", "B. 我在家看书。", "C. 家我看看书。"],
      answer: 1,
      explain: "Trạng ngữ nơi chốn 在家 phải đứng trước động từ 看书."
    }
  },
  {
    id: "g_hsk1_le1_completion",
    category: "particles_adverbs",
    categoryName: "Phó Từ & Trợ Từ",
    title: "7. Trợ Từ Ngữ Khí / Động Thái 了 (Biểu thị hoàn thành hoặc biến hóa)",
    formula: "V + 了 (Động thái: hành động đã hoàn thành) / Cuối câu + 了 (Ngữ khí: thay đổi trạng thái)",
    level: "HSK 1 - 2",
    explanation: "Chữ 了 có 2 cách dùng cơ bản: 1. Đứng sau động từ biểu thị hành động đã hoàn tất. 2. Đứng cuối câu biểu thị một tình huống mới xuất hiện (Ví dụ: 下雨了 - Trời mưa rồi).",
    rules: [
      "Phủ định của V + 了: Dùng 没(有) + V (bỏ chữ 了 đi).",
      "Tôi đã mua sách: 我买了书 ➔ Phủ định: 我没买书 (Không nói 我没买了书)."
    ],
    mistakes: "❌ Sai: 我没吃了早饭。 ➔ ✅ Đúng: 我没吃早饭 (Đã có 没 thì không có 了).",
    examples: [
      { hanzi: "他喝了一杯咖啡。", pinyin: "Tā hē le yì bēi kāfēi.", vi: "Anh ấy đã uống một cốc cà phê." },
      { hanzi: "春天来了，天气暖和了。", pinyin: "Chūntiān lái le, tiānqì nuǎnhuo le.", vi: "Mùa xuân đến rồi, thời tiết ấm áp lên rồi." },
      { hanzi: "我已经做完作业了。", pinyin: "Wǒ yǐjīng zuò wán zuòyè le.", vi: "Tôi đã làm xong bài tập về nhà rồi." }
    ],
    practiceQuiz: {
      question: "Chọn câu phủ định đúng của '他去了中国':",
      options: ["A. 他不去了中国", "B. 他没去中国", "C. 他没去了中国"],
      answer: 1,
      explain: "Khi dùng 没 phủ định hành động quá khứ, phải lược bỏ chữ 了."
    }
  },

  // ==================== HSK 2 ====================
  {
    id: "g_hsk2_guo_experience",
    category: "particles_adverbs",
    categoryName: "Phó Từ & Trợ Từ",
    title: "8. Trợ Từ Động Thái 过 (Biểu Thị Từng Trải Nghiệm Trong Quá Khứ)",
    formula: "S + V + 过 + O (Đã từng...) / S + 没 + V + 过 + O (Chưa từng...)",
    level: "HSK 2",
    explanation: "Đứng sau động từ để biểu thị chủ ngữ đã từng có kinh nghiệm hoặc trải qua hành vi nào đó trong quá khứ nhưng hiện tại đã kết thúc. Phủ định dùng '没 + V + 过'.",
    rules: [
      "Khẳng định: 我去过北京 (Tôi từng đi Bắc Kinh).",
      "Phủ định: 我没吃过北京烤鸭 (Tôi chưa từng ăn vịt quay Bắc Kinh).",
      "Nghi vấn: 你看过这部电影没有？ (Bạn đã từng xem bộ phim này chưa?)"
    ],
    mistakes: "❌ Sai: 我没有去过北京了。 ➔ ✅ Đúng: 我没去过北京 (Trong câu có 过 phủ định không dùng 了).",
    examples: [
      { hanzi: "他学过两年法语。", pinyin: "Tā xué guo liǎng nián Fǎyǔ.", vi: "Anh ấy từng học tiếng Pháp hai năm." },
      { hanzi: "你见过他吗？", pinyin: "Nǐ jiàn guo tā ma?", vi: "Bạn từng gặp anh ấy chưa?" },
      { hanzi: "我们以前听过这首歌。", pinyin: "Wǒmen yǐqián tīng guo zhè shǒu gē.", vi: "Chúng tôi trước đây từng nghe bài hát này rồi." }
    ],
    practiceQuiz: {
      question: "Câu 'Tôi chưa từng ăn món ăn này' dịch chuẩn là:",
      options: ["A. 我不吃过这个菜。", "B. 我没吃过这个菜。", "C. 我没吃了这个菜。"],
      answer: 1,
      explain: "Phủ định của trợ từ kinh nghiệm 过 dùng 没 + V + 过."
    }
  },
  {
    id: "g_hsk2_zhe_continuous",
    category: "particles_adverbs",
    categoryName: "Phó Từ & Trợ Từ",
    title: "9. Trợ Từ Động Thái 着 (Biểu Thị Trạng Thái Đang Duy Trì)",
    formula: "S + V + 着 (+ O) / V1 + 着 (+ O) + V2 (Phương thức thực hiện hành động)",
    level: "HSK 2",
    explanation: "Dùng sau động từ để biểu thị động tác đang tiếp diễn hoặc trạng thái của sự vật đang được duy trì (cửa đang mở, áo đang mặc). Khi có 2 động từ, 'V1 + 着' làm phương thức cho V2 (Ví dụ: Đứng nói chuyện, cười nói).",
    rules: [
      "Duy trì trạng thái: 门开着呢 (Cửa đang mở).",
      "Phương thức: 他笑着对我说 (Anh ấy cười nói với tôi)."
    ],
    mistakes: "❌ Sai: 他看书着。 ➔ ✅ Đúng: 他看着书呢 (着 đứng sát sau động từ).",
    examples: [
      { hanzi: "墙上挂着一幅中国画。", pinyin: "Qiáng shang guà zhe yì fú Zhōngguó huà.", vi: "Trên tường đang treo một bức tranh Trung Quốc." },
      { hanzi: "请大家坐着听课。", pinyin: "Qǐng dàjiā zuò zhe tīng kè.", vi: "Mời mọi người ngồi nghe giảng bài." },
      { hanzi: "外边下着大雪。", pinyin: "Wàibian xià zhe dà xuě.", vi: "Bên ngoài đang rơi tuyết lớn." }
    ],
    practiceQuiz: {
      question: "Câu nào biểu thị hành động làm phương thức cho hành động khác?",
      options: ["A. 门关着。", "B. 她穿着一件红毛衣。", "C. 他们站着聊天。"],
      answer: 2,
      explain: "站着聊天: Đứng (trạng thái/phương thức) để nói chuyện (hành động chính)."
    }
  },
  {
    id: "g_hsk2_haishi_vs_huozhe",
    category: "fixed_connectors",
    categoryName: "Liên Từ & Cặp Từ Nối",
    title: "10. Phân Biệt Từ 'Hoặc là': 还是 vs 或者",
    formula: "A + 还是 + B? (Dùng trong câu hỏi lựa chọn) vs A + 或者 + B (Dùng trong câu trần thuật)",
    level: "HSK 2",
    explanation: "Cả hai đều có nghĩa là 'hoặc, hay là', nhưng 还是 CHUYÊN DÙNG TRONG CÂU HỎI nghi vấn lựa chọn. 或者 CHUYÊN DÙNG TRONG CÂU TRẦN THUẬT khẳng định.",
    rules: [
      "Câu hỏi: 你喝咖啡还是喝茶？ (Bạn uống cà phê hay uống trà?)",
      "Câu trần thuật: 喝茶或者咖啡都可以 (Uống trà hoặc cà phê đều được)."
    ],
    mistakes: "❌ Sai: 你去或者我去？ ➔ ✅ Đúng: 你去还是我去？ (Câu hỏi lựa chọn phải dùng 还是).",
    examples: [
      { hanzi: "你想今天去还是明天去？", pinyin: "Nǐ xiǎng jīntiān qù háishi míngtiān qù?", vi: "Bạn muốn hôm nay đi hay ngày mai đi?" },
      { hanzi: "周末我常常看电影或者看书。", pinyin: "Zhōumò wǒ chángcháng kàn diànyǐng huòzhě kàn shū.", vi: "Cuối tuần tôi thường xem phim hoặc đọc sách." },
      { hanzi: "无论坐飞机还是坐高铁都很方便。", pinyin: "Wúlùn zuò fēijī háishi zuò gāotiě dōu hěn fāngbiàn.", vi: "Dù đi máy bay hay tàu cao tốc đều rất thuận tiện." }
    ],
    practiceQuiz: {
      question: "Điền vào chỗ trống: 你喜欢夏天 ____ 冬天？",
      options: ["A. 或者", "B. 还是", "C. 和"],
      answer: 1,
      explain: "Đây là câu hỏi lựa chọn, bắt buộc dùng 还是."
    }
  },
  {
    id: "g_hsk2_li_distance",
    category: "sentence_structure",
    categoryName: "Cấu Trúc Câu Cơ Bản",
    title: "11. Cấu Trúc Biểu Thị Khoảng Cách Với 离 (A 离 B + Xa / Gần / Khoảng cách)",
    formula: "Địa điểm A + 离 + Địa điểm B + 很远 / 很近 / Có bao nhiêu mét, km",
    level: "HSK 2",
    explanation: "Giới từ 离 dùng để biểu thị khoảng cách về không gian hoặc thời gian giữa 2 mốc. Tuyệt đối không dùng 从 để thay thế cho 离 trong cấu trúc đo khoảng cách tĩnh này.",
    rules: [
      "Khoảng cách không gian: 我家离学校很近 (Nhà tôi cách trường rất gần).",
      "Khoảng cách thời gian: 离考试还有一个星期 (Cách kỳ thi còn một tuần nữa)."
    ],
    mistakes: "❌ Sai: 我家从学校很远。 ➔ ✅ Đúng: 我家离学校很远。",
    examples: [
      { hanzi: "超市离这里不远，走路五分钟就到。", pinyin: "Chāoshì lí zhèlǐ bù yuǎn, zǒulù wǔ fēnzhōng jiù dào.", vi: "Siêu thị cách đây không xa, đi bộ năm phút là tới." },
      { hanzi: "离春节只有三天了。", pinyin: "Lí Chūnjié zhǐ yǒu sān tiān le.", vi: "Cách Tết Nguyên Đán chỉ còn ba ngày nữa thôi." },
      { hanzi: "你公司离地铁站远吗？", pinyin: "Nǐ gōngsī lí dìtiězhàn yuǎn ma?", vi: "Công ty bạn cách ga tàu điện ngầm có xa không?" }
    ],
    practiceQuiz: {
      question: "Câu 'Khách sạn cách sân bay rất xa' dịch là:",
      options: ["A. 宾馆从机场很远。", "B. 宾馆离机场很远。", "C. 宾馆在机场很远。"],
      answer: 1,
      explain: "Khoảng cách cách nhau dùng giới từ 离: A 离 B + Adj."
    }
  },
  {
    id: "g_hsk2_yue_lai_yue",
    category: "fixed_connectors",
    categoryName: "Liên Từ & Cặp Từ Nối",
    title: "12. Cấu Trúc 'Càng Ngày Càng' & 'Càng... Càng...': 越来越…… / 越……越……",
    formula: "越来越 + Tính từ/Tâm lý (Càng ngày càng...) vs 越 + A + 越 + B (Càng A thì càng B)",
    level: "HSK 2 - 3",
    explanation: "Biểu thị mức độ phát triển tăng tiến theo thời gian hoặc phụ thuộc vào điều kiện. Chú ý: Sau '越来越' tuyệt đối không được thêm các phó từ chỉ mức độ như '很, 非常, 十分'.",
    rules: [
      "Theo thời gian: 他的中文越来越好 (Tiếng Trung của anh ấy càng ngày càng tốt).",
      "Tương quan điều kiện: 雨越下越大 (Mưa càng rơi càng to)."
    ],
    mistakes: "❌ Sai: 天气越来越很热。 ➔ ✅ Đúng: 天气越来越热 (Không có 很 sau 越来越).",
    examples: [
      { hanzi: "汉语越来越有意思了。", pinyin: "Hànyǔ yuè lái yuè yǒu yìsi le.", vi: "Tiếng Hán càng ngày càng thú vị rồi." },
      { hanzi: "你越说他越生气。", pinyin: "Nǐ yuè shuō tā yuè shēngqì.", vi: "Bạn càng nói anh ấy càng tức giận." },
      { hanzi: "这道题越想越难。", pinyin: "Zhè dào tí yuè xiǎng yuè nán.", vi: "Bài toán này càng nghĩ càng thấy khó." }
    ],
    practiceQuiz: {
      question: "Tìm câu dùng đúng cấu trúc 越来越:",
      options: ["A. 他的身体越来越非常健康。", "B. 他的身体越来越健康。", "C. 他的身体很越来越健康。"],
      answer: 1,
      explain: "Sau 越来越 không được dùng thêm phó từ mức độ như 很, 非常."
    }
  },

  // ==================== HSK 3 ====================
  {
    id: "g_hsk3_de3_distinction",
    category: "particles_adverbs",
    categoryName: "Phó Từ & Trợ Từ",
    title: "13. Phân Biệt Bộ 3 Trợ Từ Kết Cấu Kinh Điển: 的 (Đích), 地 (Địa), 得 (Đắc)",
    formula: "Định ngữ + 的 + Danh từ / Phó từ/Tính từ + 地 + Động từ / Động từ + 得 + Bổ ngữ (Adj)",
    level: "HSK 3",
    explanation: "Cả 3 từ đều đọc là 'de' nhưng cách dùng và vị trí hoàn toàn khác nhau: 的 đi trước Danh từ (sở hữu/tính chất). 地 đi trước Động từ (cách thức hành động). 得 đi sau Động từ (bổ ngữ trạng thái/kết quả).",
    rules: [
      "的: 我的书 (Sách của tôi), 红色的花 (Hoa màu đỏ).",
      "地: 认真地学习 (Học tập một cách chăm chỉ), 快快地跑 (Chạy nhanh chóng).",
      "得: 跑得很快 (Chạy rất nhanh), 睡得很好 (Ngủ rất ngon)."
    ],
    mistakes: "❌ Sai: 他跑的很快 / 他认真得学。 ➔ ✅ Đúng: 他跑得很快 / 他认真地学。",
    examples: [
      { hanzi: "她高兴地对我们笑。", pinyin: "Tā gāoxìng de duì wǒmen xiào.", vi: "Cô ấy cười vui vẻ với chúng tôi (地 trước động từ 笑)." },
      { hanzi: "汉字写得非常漂亮。", pinyin: "Hànzì xiě de fēicháng piàoliang.", vi: "Chữ Hán viết rất đẹp (得 sau động từ 写)." },
      { hanzi: "美丽的北京欢迎你。", pinyin: "Měilì de Běijīng huānyíng nǐ.", vi: "Bắc Kinh xinh đẹp chào đón bạn (的 trước danh từ 北京)." }
    ],
    practiceQuiz: {
      question: "Điền trợ từ thích hợp: 他高兴 ____ 唱起歌来。",
      options: ["A. 的", "B. 地", "C. 得"],
      answer: 1,
      explain: "Đứng trước cụm động từ 唱起歌来 làm trạng ngữ chỉ cách thức bắt buộc dùng 地."
    }
  },
  {
    id: "g_hsk3_shi_de_emphasis",
    category: "sentence_structure",
    categoryName: "Cấu Trúc Nhấn Mạnh",
    title: "14. Cấu Trúc Nhấn Mạnh 是……的 (Thời Gian, Địa Điểm, Phương Thức)",
    formula: "S + 是 + [Thời gian / Nơi chốn / Cách thức / Mục đích] + V + 的",
    level: "HSK 3",
    explanation: "Dùng để nhấn mạnh một chi tiết cụ thể của một SỰ VIỆC ĐÃ XẢY RA TRONG QUÁ KHỨ (khi nào, ở đâu, bằng phương tiện gì, cùng với ai). Chữ 是 trong câu khẳng định có thể lược bỏ, nhưng trong câu phủ định '不是……的' thì KHÔNG THỂ BỎ 是.",
    rules: [
      "Nhấn mạnh thời gian: 我是昨天来的 (Tôi đến vào hôm qua).",
      "Nhấn mạnh địa điểm: 他是在北京学的汉语 (Anh ấy học tiếng Hán là ở Bắc Kinh).",
      "Nhấn mạnh phương thức: 我们是坐高铁来的 (Chúng tôi là đi tàu cao tốc đến).",
      "Phủ định: 我不是一个人来的 (Tôi không phải đi một mình đến)."
    ],
    mistakes: "❌ Sai: 我明天是去北京的。 ➔ ✅ Đúng: Cấu trúc 是……的 chỉ dùng cho sự việc ĐÃ XẢY RA, không dùng cho tương lai.",
    examples: [
      { hanzi: "你是什么时候买的新手机？", pinyin: "Nǐ shì shénme shíhou mǎi de xīn shǒujī?", vi: "Bạn mua điện thoại mới lúc nào vậy?" },
      { hanzi: "这本书是我在书店买的。", pinyin: "Zhè běn shū shì wǒ zài shūdiàn mǎi de.", vi: "Quyển sách này là tôi mua ở hiệu sách." },
      { hanzi: "这项工作不是我一个人完成的。", pinyin: "Zhè xiàng gōngzuò bú shì wǒ yí gè rén wánchéng de.", vi: "Công việc này không phải một mình tôi hoàn thành." }
    ],
    practiceQuiz: {
      question: "Cấu trúc 是……的 dùng để nhấn mạnh điều gì trong câu '我是坐飞机来的'?",
      options: ["A. Thời gian", "B. Địa điểm", "C. Phương tiện / Phương thức"],
      answer: 2,
      explain: "坐飞机 (đi máy bay) là phương thức di chuyển của hành động đã diễn ra."
    }
  },
  {
    id: "g_hsk3_state_complement",
    category: "complements",
    categoryName: "Các Loại Bổ Ngữ",
    title: "15. Bổ Ngữ Trạng Thái (V + 得 + Tính từ / Cụm miêu tả)",
    formula: "S + V + 得 + Adj / Cụm miêu tả (Nếu có tân ngữ: S + V + O + V + 得 + Adj HOẶC S + O + V + 得 + Adj)",
    level: "HSK 3",
    explanation: "Dùng để đánh giá, nhận xét mức độ, trạng thái hay kết quả thường xuyên của một hành vi. Khi động từ mang tân ngữ, BẮT BUỘC phải lặp lại động từ trước chữ 得 hoặc đưa tân ngữ lên trước động từ.",
    rules: [
      "Không có tân ngữ: 他跑得很快 (Anh ấy chạy rất nhanh).",
      "Có tân ngữ (Lặp lại V): 他学中文学得很好 (Anh ấy học tiếng Trung học rất giỏi).",
      "Có tân ngữ (Đưa O lên đầu): 他中文学得很好.",
      "Phủ định: Đặt 不 trước tính từ bổ ngữ: 他跑得不快 (Không được nói: 他不跑得快)."
    ],
    mistakes: "❌ Sai: 他说汉语得很流利。 ➔ ✅ Đúng: 他说汉语说得很流利 / 他汉语说得很流利。",
    examples: [
      { hanzi: "她每天起得很早。", pinyin: "Tā měitiān qǐ de hěn zǎo.", vi: "Cô ấy mỗi ngày dậy rất sớm." },
      { hanzi: "弟弟汉字写得真漂亮。", pinyin: "Dìdi hànzì xiě de zhēn piàoliang.", vi: "Em trai viết chữ Hán thật là đẹp." },
      { hanzi: "你昨晚睡得好不好？", pinyin: "Nǐ zuówǎn shuì de hǎo bu hǎo?", vi: "Tối qua bạn ngủ có ngon không?" }
    ],
    practiceQuiz: {
      question: "Câu nào dưới đây đúng ngữ pháp bổ ngữ trạng thái khi có tân ngữ?",
      options: ["A. 他打篮球得很好。", "B. 他打篮球打得很好。", "C. 他不打篮球得好。"],
      answer: 1,
      explain: "Khi có tân ngữ 篮球, phải lặp lại động từ 打 trước chữ 得: 打篮球打得很好."
    }
  },
  {
    id: "g_hsk3_directional_complement",
    category: "complements",
    categoryName: "Các Loại Bổ Ngữ",
    title: "16. Bổ Ngữ Xu Hướng Đơn & Kép (来 / 去, 进来, 出来, 上去, 起来, 下去)",
    formula: "V + 来 (hướng về phía người nói) / V + 去 (hướng xa người nói) / V + Bổ ngữ kép",
    level: "HSK 3",
    explanation: "Biểu thị phương hướng dịch chuyển của động tác. '来' là hướng về phía người nói, '去' là hướng rời xa người nói. Bổ ngữ kép như 进 (vào), 出 (ra), 上 (lên), 下 (xuống), 起 (dậy), 过 (qua) kết hợp với 来/去.",
    rules: [
      "Tân ngữ chỉ nơi chốn BẮT BUỘC ĐỨNG TRƯỚC 来/去: 进教室来 (vào lớp học đây), 回家去 (về nhà đi).",
      "Bổ ngữ mở rộng: 起来 (bắt đầu và tiếp diễn: 想起来, 唱起来), 下去 (tiếp tục duy trì: 学下去)."
    ],
    mistakes: "❌ Sai: 进来教室。 ➔ ✅ Đúng: 进教室来 (Nơi chốn 教室 phải đứng trước 来/去).",
    examples: [
      { hanzi: "老师走进教室来了。", pinyin: "Lǎoshī zǒu jìn jiàoshì lái le.", vi: "Thầy giáo bước vào trong lớp học rồi." },
      { hanzi: "快把雨伞拿出来。", pinyin: "Kuài bǎ yǔsǎn ná chūlái.", vi: "Mau lấy chiếc ô ra đây." },
      { hanzi: "只要你坚持学下去，就一定能成功。", pinyin: "Zhǐyào nǐ jiānchí xué xiàqù, jiù yídìng néng chénggōng.", vi: "Chỉ cần bạn kiên trì học tiếp, nhất định sẽ thành công." }
    ],
    practiceQuiz: {
      question: "Chọn câu có trật tự từ đúng khi tân ngữ là nơi chốn:",
      options: ["A. 他跑出来宿舍了。", "B. 他跑出宿舍来了。", "C. 他出来宿舍跑了。"],
      answer: 1,
      explain: "Tân ngữ nơi chốn 宿舍 phải đứng kẹp giữa 出 và 来: 跑出宿舍来."
    }
  },
  {
    id: "g_hsk3_potential_complement",
    category: "complements",
    categoryName: "Các Loại Bổ Ngữ",
    title: "17. Bổ Ngữ Khả Năng (V + 得 / 不 + Bổ ngữ kết quả / xu hướng)",
    formula: "Khẳng định: V + 得 + Bổ ngữ (Có thể làm được) / Phủ định: V + 不 + Bổ ngữ (Không thể làm được)",
    level: "HSK 3",
    explanation: "Biểu thị trong điều kiện chủ quan hoặc khách quan nào đó, động tác có khả năng thực hiện được kết quả đó hay không. Thể phủ định 'V + 不 + Bổ ngữ' được sử dụng cực kỳ phổ biến trong khẩu ngữ.",
    rules: [
      "Khẳng định: 看得懂 (đọc hiểu được), 听得见 (nghe thấy được).",
      "Phủ định: 看不懂 (đọc không hiểu), 听不见 (nghe không thấy), 吃不完 (ăn không hết).",
      "Nghi vấn: V + 得 + Bổ ngữ + V + 不 + Bổ ngữ? HOẶC ... 吗？"
    ],
    mistakes: "❌ Sai: 我不能看得懂。 ➔ ✅ Đúng: 我看不懂 (Bổ ngữ khả năng phủ định dùng V + 不 + Bổ ngữ, không dùng 不能 + V + 得 + ...).",
    examples: [
      { hanzi: "作业太多了，我今天做不完。", pinyin: "Zuòyè tài duō le, wǒ jīntiān zuò bù wán.", vi: "Bài tập nhiều quá, hôm nay tôi làm không xong được." },
      { hanzi: "你说得太快了，我听不懂。", pinyin: "Nǐ shuō de tài kuài le, wǒ tīng bù dǒng.", vi: "Bạn nói nhanh quá, tôi nghe không hiểu được." },
      { hanzi: "这么多东西，你一个人拿得动吗？", pinyin: "Zhème duō dōngxi, nǐ yí gè rén ná de dòng ma?", vi: "Nhiều đồ thế này, một mình bạn xách nổi không?" }
    ],
    practiceQuiz: {
      question: "Dịch câu 'Tôi không tìm thấy kính mắt':",
      options: ["A. 我不找得到眼镜。", "B. 我找不到眼镜。", "C. 我找眼镜没到。"],
      answer: 1,
      explain: "Phủ định của bổ ngữ khả năng là V + 不 + Bổ ngữ kết quả: 找不到 (tìm không thấy)."
    }
  },

  // ==================== HSK 4 ====================
  {
    id: "g_hsk4_zhiyou_cai",
    category: "fixed_connectors",
    categoryName: "Liên Từ & Cặp Từ Nối",
    title: "18. Cặp Liên Từ Điều Kiện Duy Nhất: 只有……才…… (Chỉ có... mới...)",
    formula: "只有 + Điều kiện duy nhất + 才 + Kết quả",
    level: "HSK 4",
    explanation: "Biểu thị điều kiện đưa ra là ĐIỀU KIỆN TIÊN QUYẾT DUY NHẤT để đạt được kết quả phía sau. Khác với '只要……就……' (chỉ cần điều kiện đủ), '只有……才……' mang tính bắt buộc và nghiêm ngặt hơn nhiều.",
    rules: [
      "Điều kiện duy nhất: 只有努力学习，才能考过HSK (Chỉ có chăm chỉ học mới có thể đỗ HSK).",
      "Phân biệt với 只要...就: 只要 (chỉ cần... là), 只有 (chỉ có... mới)."
    ],
    mistakes: "❌ Sai: 只有你来，我就去。 ➔ ✅ Đúng: 只有你来，我才去 (只有 luôn đi với 才, không đi với 就).",
    examples: [
      { hanzi: "只有坚持到底，才能取得胜利。", pinyin: "Zhǐyǒu jiānchí dàodǐ, cái néng qǔdé shènglì.", vi: "Chỉ có kiên trì đến cùng mới có thể giành được thắng lợi." },
      { hanzi: "只有在实践中，才能检验真理。", pinyin: "Zhǐyǒu zài shíjiàn zhōng, cái néng jiǎnyàn zhēnlǐ.", vi: "Chỉ có trong thực tiễn mới có thể kiểm nghiệm chân lý." },
      { hanzi: "只有互相理解，生活才会更幸福。", pinyin: "Zhǐyǒu hùxiāng lǐjiě, shēnghuó cái huì gèng xìngfú.", vi: "Chỉ có thấu hiểu lẫn nhau, cuộc sống mới hạnh phúc hơn." }
    ],
    practiceQuiz: {
      question: "Cặp liên từ nào sau đây đi liền với nhau thành cặp chuẩn?",
      options: ["A. 只要……才……", "B. 只有……就……", "C. 只有……才……"],
      answer: 2,
      explain: "Cặp liên từ chuẩn là: 只要……就…… (chỉ cần... là) và 只有……才…… (chỉ có... mới)."
    }
  },
  {
    id: "g_hsk4_jishi_ye",
    category: "fixed_connectors",
    categoryName: "Liên Từ & Cặp Từ Nối",
    title: "19. Cặp Liên Từ Nhượng Bộ Giả Định: 即使 / 哪怕……也…… (Cho Dù... Cũng...)",
    formula: "即使 / 哪怕 + Giả thiết cực đoan + 也 / 还 + Kết quả không đổi",
    level: "HSK 4",
    explanation: "Dùng để biểu thị giả định nhượng bộ: Ngay cả khi xảy ra tình huống xấu nhất hoặc bất lợi nhất thì kết quả hoặc quyết tâm ở vế sau vẫn không hề thay đổi.",
    rules: [
      "Vế 1 thường đưa ra giả định khó khăn: 即使下大雨 (Cho dù trời mưa to).",
      "Vế 2 giữ nguyên quyết định: 我们也按时出发 (Chúng tôi cũng xuất phát đúng giờ)."
    ],
    mistakes: "❌ Sai: 虽然下雨，我也去。 ➔ ✅ Đúng: Nếu là sự việc giả định chưa xảy ra thì phải dùng 即使/哪怕, 虽然 dùng cho sự thật đã tồn tại.",
    examples: [
      { hanzi: "即使遇到再大的困难，我们也不能放弃。", pinyin: "Jíshǐ yù dào zài dà de kùnnan, wǒmen yě bù néng fàngqì.", vi: "Cho dù gặp phải khó khăn lớn đến đâu, chúng ta cũng không được từ bỏ." },
      { hanzi: "哪怕只有一点点希望，他也要去试一试。", pinyin: "Nǎpà zhǐ yǒu yì diǎndiǎn xīwàng, tā yě yào qù shì yí shì.", vi: "Cho dù chỉ có một chút hi vọng, anh ấy cũng muốn đi thử xem." },
      { hanzi: "即使工作再忙，也要注意身体。", pinyin: "Jíshǐ gōngzuò zài máng, yě yào zhùyì shēntǐ.", vi: "Cho dù công việc có bận đến đâu cũng phải chú ý giữ gìn sức khỏe." }
    ],
    practiceQuiz: {
      question: "Điền vào chỗ trống: ____ 失败了，我们 ____ 不能气馁。",
      options: ["A. 因为……所以……", "B. 即使……也……", "C. 不但……而且……"],
      answer: 1,
      explain: "Cặp từ nhượng bộ giả thiết: 即使……也…… (Cho dù... cũng...)."
    }
  },
  {
    id: "g_hsk4_nandao_ma",
    category: "sentence_structure",
    categoryName: "Câu Phản Vấn",
    title: "20. Cấu Trúc Câu Phản Vấn Tu Từ: 难道……吗 / 不成？ (Chẳng Lẽ... Hay Sao?)",
    formula: "难道 + [Khẳng định / Phủ định] + 吗 / 不成？",
    level: "HSK 4",
    explanation: "Dùng phó từ 难道 để đặt câu hỏi tu từ nhằm nhấn mạnh ý khẳng định hoặc phủ định, thúc giục đối phương suy nghĩ. Câu hỏi tu từ dạng khẳng định mang nghĩa phủ định, dạng phủ định mang nghĩa khẳng định.",
    rules: [
      "Khẳng định ➔ Mang nghĩa phủ định: 难道你不知道吗？ (Chẳng lẽ bạn không biết hay sao? ➔ Ý là: Bạn chắc chắn phải biết).",
      "Thường dùng để thể hiện sự ngạc nhiên, trách móc hoặc nhấn mạnh đạo lý hiển nhiên."
    ],
    mistakes: "❌ Sai: 难道你去？ (Thiếu ngữ khí từ 吗 hoặc 不成 ở cuối câu khiến câu bị cụt).",
    examples: [
      { hanzi: "难道你连这么简单的道理都不懂吗？", pinyin: "Nándào nǐ lián zhème jiǎndān de dàolǐ dōu bù dǒng ma?", vi: "Chẳng lẽ bạn ngay cả đạo lý đơn giản thế này cũng không hiểu sao?" },
      { hanzi: "这么重要的事情，难道他会忘记吗？", pinyin: "Zhème zhòngyào de shìqing, nándào tā huì wàngjì ma?", vi: "Chuyện quan trọng thế này, chẳng lẽ anh ấy lại quên được sao?" },
      { hanzi: "难道我们还要继续等下去不成？", pinyin: "Nándào wǒmen hái yào jìxù děng xiàqù bùchéng?", vi: "Chẳng lẽ chúng ta còn phải tiếp tục đợi nữa hay sao?" }
    ],
    practiceQuiz: {
      question: "Câu '难道你没听说过这件事吗？' thực chất người nói muốn khẳng định điều gì?",
      options: ["A. Bạn chưa từng nghe qua chuyện này.", "B. Chắc chắn bạn đã nghe qua chuyện này rồi.", "C. Người nói không biết bạn nghe hay chưa."],
      answer: 1,
      explain: "Câu phản vấn phủ định (难道没...) mang nghĩa khẳng định mạnh mẽ: Bạn chắc chắn phải nghe qua rồi."
    }
  },
  {
    id: "g_hsk4_changchang_vs_wangwang",
    category: "particles_adverbs",
    categoryName: "Phó Từ & Trợ Từ",
    title: "21. Phân Biệt Phó Từ Tần Suất HSK: 常常 vs 往往",
    formula: "常常 (Thường xuyên - ý chí chủ quan, hiện tại, tương lai, quá khứ) vs 往往 (Thường - quy luật khách quan, luôn có điều kiện đi kèm)",
    level: "HSK 4",
    explanation: "Đây là điểm ngữ pháp cực kỳ phổ biến trong đề thi HSK 4-5. 常常 chỉ tần suất xảy ra nhiều lần dựa trên thói quen hoặc sở thích chủ quan. 往往 chỉ quy luật tất yếu diễn ra trong một điều kiện, hoàn cảnh cụ thể.",
    rules: [
      "Trong tương lai: Chỉ dùng 常常, KHÔNG DÙNG 往往: 希望你以后常常来看我.",
      "往往 luôn cần điều kiện phía trước: 遇到困难时，他往往很冷静.",
      "Phủ định của 常常 là 不常; 往往 không có dạng 不往往."
    ],
    mistakes: "❌ Sai: 我希望你以后往往来。 ➔ ✅ Đúng: 我希望你以后常常来 (Tương lai chỉ dùng 常常).",
    examples: [
      { hanzi: "他周末常常去图书馆看书。", pinyin: "Tā zhōumò chángcháng qù túshūguǎn kàn shū.", vi: "Cuối tuần anh ấy thường đi thư viện đọc sách (thói quen chủ quan)." },
      { hanzi: "生病的时候，人们往往会更加思念家人。", pinyin: "Shēngbìng de shíhou, rénmen wǎngwǎng huì gèngjiā sīniàn jiārén.", vi: "Khi bị ốm, người ta thường sẽ nhớ gia đình hơn (quy luật tâm lý khách quan)." },
      { hanzi: "骄傲的人往往容易犯错误。", pinyin: "Jiāo'ào de rén wǎngwǎng róngyì fàn cuòwù.", vi: "Người kiêu ngạo thường dễ phạm phải sai lầm." }
    ],
    practiceQuiz: {
      question: "Chọn từ điền vào chỗ trống: 祝愿你未来 ____ 保持好心情！",
      options: ["A. 往往", "B. 常常", "C. 不常"],
      answer: 1,
      explain: "Lời chúc trong tương lai chỉ có thể dùng 常常, không dùng 往往."
    }
  },

  // ==================== HSK 5 - 6 ====================
  {
    id: "g_hsk5_ningke_yebu",
    category: "fixed_connectors",
    categoryName: "Liên Từ & Cặp Từ Nối",
    title: "22. Cấu Trúc 'Thà Rằng... Chứ Nhất Quyết Không...': 宁可……也不……",
    formula: "宁可 + Lựa chọn phương án bất lợi (chấp nhận chịu thiệt) + 也不 + Tuyệt đối không chấp nhận phương án tồi tệ hơn",
    level: "HSK 5",
    explanation: "Biểu thị sự cân nhắc giữa hai tình huống bất lợi: Người nói thà chịu đựng thiệt thòi, hy sinh ở vế 1 chứ kiên quyết không chấp nhận điều nhục nhã, trái đạo lý ở vế 2.",
    rules: [
      "Vế 1: Chấp nhận chịu thiệt thòi: 宁可多走几步路 (Thà đi thêm vài bước).",
      "Vế 2: Kiên quyết từ chối: 也不横穿马路 (Cũng quyết không băng qua đường bừa bãi)."
    ],
    mistakes: "❌ Sai: 宁可……但是…… ➔ ✅ Đúng: 宁可 đi liền với 也不 (hoặc 也要 nếu nhấn mạnh quyết tâm).",
    examples: [
      { hanzi: "他宁可自己吃苦，也不愿给别人添麻烦。", pinyin: "Tā nìngkě zìjǐ chīkǔ, yě bú yuàn gěi biérén tiān máfan.", vi: "Anh ấy thà bản thân chịu khổ chứ không muốn mang lại phiền phức cho người khác." },
      { hanzi: "我们宁可把准备工作做得更充分一些，也不要仓促上马。", pinyin: "Wǒmen nìngkě bǎ zhǔnbèi gōngzuò zuò de gèng chōngfèn yìxiē, yě bú yào cāngcù shàngmǎ.", vi: "Chúng ta thà chuẩn bị công tác chu đáo hơn một chút chứ đừng vội vàng triển khai." },
      { hanzi: "做一个有原则的人，宁可受穷，也不要不义之财。", pinyin: "Zuò yí gè yǒu yuánzé de rén, nìngkě shòuqióng, yě bú yào búyì zhī cái.", vi: "Làm một người có nguyên tắc, thà chịu nghèo chứ không lấy của bất nghĩa." }
    ],
    practiceQuiz: {
      question: "Cặp liên từ 宁可…… đi với từ nào để biểu thị 'thà... chứ không'?",
      options: ["A. 也", "B. 也不", "C. 而且"],
      answer: 1,
      explain: "Cấu trúc chuẩn là 宁可……也不……: Thà... chứ quyết không..."
    }
  },
  {
    id: "g_hsk5_budan_meiyou_faner",
    category: "fixed_connectors",
    categoryName: "Liên Từ & Cặp Từ Nối",
    title: "23. Cấu Trúc 'Không Những Không... Trái Lại...': 不但没有……反而……",
    formula: "不但没有 / 不仅没有 + [Kết quả mong đợi] + 反而 / 反倒 + [Kết quả ngược lại hoàn toàn]",
    level: "HSK 5 - 6",
    explanation: "Dùng để biểu thị một sự việc không những không đạt được kết quả như dự tính thông thường, mà trái lại còn phát triển theo chiều hướng hoàn toàn đối lập.",
    rules: [
      "Vế 1: Phủ định hướng đi thông thường (不但没降温).",
      "Vế 2: Đưa ra nghịch lý ngược lại (反而更热了)."
    ],
    mistakes: "❌ Sai: 不但……但是…… ➔ ✅ Đúng: Khi có tính chất phản ngược dùng 不但没有……反而……",
    examples: [
      { hanzi: "吃了这副药以后，病情不但没有好转，反而加重了。", pinyin: "Chī le zhè fù yào yǐhòu, bìngqíng búdàn méiyǒu hǎozhuǎn, fǎn'ér jiāzhòng le.", vi: "Sau khi uống thang thuốc này, bệnh tình không những không thuyên giảm mà trái lại còn nặng thêm." },
      { hanzi: "听到这个坏消息，他不但没哭，反而笑了。", pinyin: "Tīng dào zhè gè huài xiāoxi, tā búdàn méi kū, fǎn'ér xiào le.", vi: "Nghe tin xấu này, anh ấy chẳng những không khóc mà trái lại còn cười." },
      { hanzi: "批评不但没有让他退缩，反而激发了他的斗志。", pinyin: "Pīpíng búdàn méiyǒu ràng tā tuìsuō, fǎn'ér jīfā le tā de dòuzhì.", vi: "Sự phê bình chẳng những không làm anh ấy lùi bước mà trái lại còn khơi dậy ý chí chiến đấu." }
    ],
    practiceQuiz: {
      question: "Từ nào kết hợp với '不但没有……' để chỉ kết quả ngược lại?",
      options: ["A. 所以", "B. 而且", "C. 反而"],
      answer: 2,
      explain: "不但没有……反而…… là cấu trúc cố định chỉ kết quả trái ngược dự đoán."
    }
  },
  {
    id: "g_hsk6_jianyue_formal",
    category: "sentence_structure",
    categoryName: "Văn Phong Viết Luận & Trang Trọng",
    title: "24. Cấu Trúc Văn Viết Luận Trang Trọng: 鉴于…… / 基于…… (Xét Thấy / Dựa Trên)",
    formula: "鉴于 / 基于 + Nguyên nhân, bối cảnh thực tế + Vế chính (Biện pháp, quyết định)",
    level: "HSK 6",
    explanation: "Thường dùng ở đầu câu trong văn phong hành chính, báo chí, luận văn học thuật để nêu rõ căn cứ, cơ sở hoặc bối cảnh dẫn tới một kết luận hoặc quyết định mang tính chính sách.",
    rules: [
      "鉴于: Xét thấy, căn cứ vào tình hình thực tế (thường là nguyên nhân cần khắc phục).",
      "基于: Dựa trên nền tảng, cơ sở lý thuyết, số liệu điều tra."
    ],
    mistakes: "❌ Sai: Dùng 鉴于 trong khẩu ngữ trò chuyện đời thường (tạo cảm giác quá cứng nhắc, hàn lâm).",
    examples: [
      { hanzi: "鉴于目前严峻的市场环境，公司决定推迟新项目的启动。", pinyin: "Jiànyú mùqián yánjùn de shìchǎng huánjìng, gōngsī juédìng tuīchí xīn xiàngmù de qǐdòng.", vi: "Xét thấy môi trường thị trường hiện tại đang rất gay gắt, công ty quyết định hoãn việc khởi động dự án mới." },
      { hanzi: "基于上述科学实验数据，我们得出了明确的结论。", pinyin: "Jīyú shàngshù kēxué shíyàn shùjù, wǒmen déchū le míngquè de jiélùn.", vi: "Dựa trên số liệu thực nghiệm khoa học nêu trên, chúng tôi đã rút ra được kết luận rõ ràng." },
      { hanzi: "鉴于他在工作中的突出贡献，董事会一致同意予以表彰。", pinyin: "Jiànyú tā zài gōngzuò zhōng de tūchū gòngxiàn, dǒngshìhuì yízhì tóngyì yǔyǐ biǎozhāng.", vi: "Xét thấy những đóng góp xuất sắc của anh ấy trong công tác, Hội đồng quản trị đã nhất trí khen thưởng." }
    ],
    practiceQuiz: {
      question: "Từ '鉴于' thường xuất hiện trong phong cách ngôn ngữ nào?",
      options: ["A. Khẩu ngữ giao tiếp hàng ngày", "B. Văn bản báo chí, công văn, luận văn trang trọng", "C. Thơ ca dân gian"],
      answer: 1,
      explain: "鉴于 là từ nối văn viết trang trọng bậc cao (HSK 6) dùng trong công văn và phân tích chính thức."
    }
  }
];

// Combine existing with new points, ensuring uniqueness by ID
const idMap = new Set(existing.map(x => x.id));
let addedCount = 0;

for (const p of newGrammarPoints) {
  if (!idMap.has(p.id)) {
    existing.push(p);
    idMap.add(p.id);
    addedCount++;
  }
}

// Normalize levels to standard clean strings for easy filtering
existing.forEach((item, index) => {
  if (!item.level) item.level = 'HSK 3';
  // If no practiceQuiz, provide a smart default
  if (!item.practiceQuiz) {
    item.practiceQuiz = {
      question: `Cấu trúc nào là công thức chuẩn của: ${item.title.split('(')[0]}?`,
      options: [
        `A. ${item.formula}`,
        "B. Cấu trúc đảo ngược tân ngữ",
        "C. Cấu trúc không dùng trợ từ"
      ],
      answer: 0,
      explain: `Công thức chuẩn: ${item.formula}`
    };
  }
});

// Sort by Level HSK 1 -> 6
const levelOrder = { 'HSK 1': 1, 'HSK 1 - 2': 1.5, 'HSK 2': 2, 'HSK 2 - 3': 2.5, 'HSK 3': 3, 'HSK 3 - 4': 3.5, 'HSK 4': 4, 'HSK 5': 5, 'HSK 5 - 6': 5.5, 'HSK 6': 6 };
existing.sort((a, b) => {
  const oA = levelOrder[a.level] || 3;
  const oB = levelOrder[b.level] || 3;
  return oA - oB;
});

fs.writeFileSync(targetPath, JSON.stringify(existing, null, 2), 'utf8');

console.log(`✓ Successfully updated grammar compendium!`);
console.log(`  Added ${addedCount} new comprehensive topics.`);
console.log(`  Total topics now: ${existing.length}`);

// Print level breakdown
const breakdown = {};
existing.forEach(x => { breakdown[x.level] = (breakdown[x.level] || 0) + 1; });
console.log('  Breakdown by level:', breakdown);
