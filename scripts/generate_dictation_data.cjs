// scripts/generate_dictation_data.cjs
const fs = require('fs');
const path = require('path');

const DICTATION_DATA = [
  // ==================== HSK 1 (10 sentences) ====================
  {
    id: "dict_hsk1_01",
    level: 1,
    zh: "明天下午我想去商店买水。",
    pinyin: "Míngtiān xiàwǔ wǒ xiǎng qù shāngdiàn mǎi shuǐ.",
    vi: "Chiều mai tôi muốn đi cửa hàng mua nước.",
    grammarPoint: "Trạng ngữ thời gian đứng trước chủ ngữ/vị ngữ + Trợ động từ 想",
    pauseMarks: "明天下午 / 我想去商店 // 买水。",
    chunks: [
      { text: "明天下午", pinyin: "míngtiān xiàwǔ" },
      { text: "我想去商店", pinyin: "wǒ xiǎng qù shāngdiàn" },
      { text: "买水", pinyin: "mǎi shuǐ" }
    ],
    difficulty: "Dễ"
  },
  {
    id: "dict_hsk1_02",
    level: 1,
    zh: "桌子上有一本书和一个杯子。",
    pinyin: "Zhuōzi shang yǒu yì běn shū hé yí ge bēizi.",
    vi: "Trên bàn có một quyển sách và một chiếc cốc.",
    grammarPoint: "Câu tồn tại với động từ 有 + Phương vị từ 上",
    pauseMarks: "桌子上 / 有一本书 // 和一个杯子。",
    chunks: [
      { text: "桌子上", pinyin: "zhuōzi shang" },
      { text: "有一本书", pinyin: "yǒu yì běn shū" },
      { text: "和一个杯子", pinyin: "hé yí ge bēizi" }
    ],
    difficulty: "Dễ"
  },
  {
    id: "dict_hsk1_03",
    level: 1,
    zh: "我们学校里有二十多位老师。",
    pinyin: "Wǒmen xuéxiào lǐ yǒu èrshí duō wèi lǎoshī.",
    vi: "Trong trường học của chúng tôi có hơn hai mươi thầy cô giáo.",
    grammarPoint: "Lượng từ tôn kính 位 + Từ chỉ số lượng ước chừng 多",
    pauseMarks: "我们学校里 / 有二十多位 // 老师。",
    chunks: [
      { text: "我们学校里", pinyin: "wǒmen xuéxiào lǐ" },
      { text: "有二十多位", pinyin: "yǒu èrshí duō wèi" },
      { text: "老师", pinyin: "lǎoshī" }
    ],
    difficulty: "Dễ"
  },
  {
    id: "dict_hsk1_04",
    level: 1,
    zh: "今天是星期日，天气非常好。",
    pinyin: "Jīntiān shì xīngqīrì, tiānqì fēicháng hǎo.",
    vi: "Hôm nay là Chủ nhật, thời tiết vô cùng tốt.",
    grammarPoint: "Phó từ chỉ mức độ 非常 + Tính từ làm vị ngữ",
    pauseMarks: "今天是星期日，// 天气 // 非常好。",
    chunks: [
      { text: "今天是星期日", pinyin: "jīntiān shì xīngqīrì" },
      { text: "天气", pinyin: "tiānqì" },
      { text: "非常好", pinyin: "fēicháng hǎo" }
    ],
    difficulty: "Dễ"
  },
  {
    id: "dict_hsk1_05",
    level: 1,
    zh: "王先生今天没有去北京出差。",
    pinyin: "Wáng xiānsheng jīntiān méiyǒu qù Běijīng chūchāi.",
    vi: "Ông Vương hôm nay không đi Bắc Kinh công tác.",
    grammarPoint: "Phủ định hành động trong quá khứ / hiện tại với 没有",
    pauseMarks: "王先生 / 今天没有去北京 // 出差。",
    chunks: [
      { text: "王先生", pinyin: "Wáng xiānsheng" },
      { text: "今天没有去北京", pinyin: "jīntiān méiyǒu qù Běijīng" },
      { text: "出差", pinyin: "chūchāi" }
    ],
    difficulty: "Dễ"
  },
  {
    id: "dict_hsk1_06",
    level: 1,
    zh: "请问这件衣服多少钱一件？",
    pinyin: "Qǐngwèn zhè jiàn yīfu duōshao qián yí jiàn?",
    vi: "Xin hỏi chiếc áo này bao nhiêu tiền một chiếc?",
    grammarPoint: "Đại từ nghi vấn 多少 + Lượng từ trang phục 件",
    pauseMarks: "请问 / 这件衣服 // 多少钱一件？",
    chunks: [
      { text: "请问", pinyin: "qǐngwèn" },
      { text: "这件衣服", pinyin: "zhè jiàn yīfu" },
      { text: "多少钱一件", pinyin: "duōshao qián yí jiàn" }
    ],
    difficulty: "Dễ"
  },
  {
    id: "dict_hsk1_07",
    level: 1,
    zh: "我朋友会说一点儿汉语。",
    pinyin: "Wǒ péngyou huì shuō yìdiǎnr Hànyǔ.",
    vi: "Bạn tôi biết nói một chút tiếng Hán.",
    grammarPoint: "Trợ động từ 会 (kỹ năng qua học tập) + Cụm 一点儿",
    pauseMarks: "我朋友 / 会说 // 一点儿汉语。",
    chunks: [
      { text: "我朋友", pinyin: "wǒ péngyou" },
      { text: "会说", pinyin: "huì shuō" },
      { text: "一点儿汉语", pinyin: "yìdiǎnr Hànyǔ" }
    ],
    difficulty: "Dễ"
  },
  {
    id: "dict_hsk1_08",
    level: 1,
    zh: "这是我昨天买的苹果，很甜。",
    pinyin: "Zhè shì wǒ zuótiān mǎi de píngguǒ, hěn tián.",
    vi: "Đây là táo hôm qua tôi mua, rất ngọt.",
    grammarPoint: "Định ngữ chỉ thời gian nối bằng trợ từ kết cấu 的",
    pauseMarks: "这是我昨天买的苹果，// 很甜。",
    chunks: [
      { text: "这是我昨天买的苹果", pinyin: "zhè shì wǒ zuótiān mǎi de píngguǒ" },
      { text: "很甜", pinyin: "hěn tián" }
    ],
    difficulty: "Dễ"
  },
  {
    id: "dict_hsk1_09",
    level: 1,
    zh: "你现在在哪儿？我去找你。",
    pinyin: "Nǐ xiànzài zài nǎr? Wǒ qù zhǎo nǐ.",
    vi: "Bây giờ bạn đang ở đâu? Tôi đi tìm bạn.",
    grammarPoint: "Đại từ chỉ địa điểm 哪儿 + Động từ liên hoàn 去 + V",
    pauseMarks: "你现在在哪儿？// 我去找你。",
    chunks: [
      { text: "你现在在哪儿", pinyin: "nǐ xiànzài zài nǎr" },
      { text: "我去找你", pinyin: "wǒ qù zhǎo nǐ" }
    ],
    difficulty: "Dễ"
  },
  {
    id: "dict_hsk1_10",
    level: 1,
    zh: "我们一起坐出租车去火车站吧。",
    pinyin: "Wǒmen yìqǐ zuò chūzūchē qù huǒchēzhàn ba.",
    vi: "Chúng ta cùng nhau đi xe taxi đến ga tàu hỏa nhé.",
    grammarPoint: "Phó từ 一起 + Phương tiện di chuyển 坐 + Trợ từ ngữ khí 吧",
    pauseMarks: "我们一起 / 坐出租车 // 去火车站吧。",
    chunks: [
      { text: "我们一起", pinyin: "wǒmen yìqǐ" },
      { text: "坐出租车", pinyin: "zuò chūzūchē" },
      { text: "去火车站吧", pinyin: "qù huǒchēzhàn ba" }
    ],
    difficulty: "Dễ"
  },

  // ==================== HSK 2 (10 sentences) ====================
  {
    id: "dict_hsk2_01",
    level: 2,
    zh: "因为今天下大雨，所以我们不去踢足球了。",
    pinyin: "Yīnwèi jīntiān xià dàyǔ, suǒyǐ wǒmen bú qù tī zúqiú le.",
    vi: "Bởi vì hôm nay trời mưa to, cho nên chúng tôi không đi đá bóng nữa.",
    grammarPoint: "Cặp liên từ chỉ nguyên nhân kết quả 因为...所以...",
    pauseMarks: "因为今天下大雨，// 所以我们 / 不去踢足球了。",
    chunks: [
      { text: "因为今天下大雨", pinyin: "yīnwèi jīntiān xià dàyǔ" },
      { text: "所以我们", pinyin: "suǒyǐ wǒmen" },
      { text: "不去踢足球了", pinyin: "bú qù tī zúqiú le" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk2_02",
    level: 2,
    zh: "妹妹比姐姐长得高，跑得也更快。",
    pinyin: "Mèimei bǐ jiějie zhǎng de gāo, pǎo de yě gèng kuài.",
    vi: "Em gái cao hơn chị gái, và chạy cũng nhanh hơn.",
    grammarPoint: "Câu so sánh chữ 比 kết hợp bổ ngữ trạng thái 得 và phó từ 更",
    pauseMarks: "妹妹比姐姐长得高，// 跑得也更快。",
    chunks: [
      { text: "妹妹比姐姐长得高", pinyin: "mèimei bǐ jiějie zhǎng de gāo" },
      { text: "跑得也更快", pinyin: "pǎo de yě gèng kuài" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk2_03",
    level: 2,
    zh: "从我家到公司走路只需要十分钟。",
    pinyin: "Cóng wǒ jiā dào gōngsī zǒulù zhǐ xūyào shí fēnzhōng.",
    vi: "Từ nhà tôi đến công ty đi bộ chỉ cần mười phút.",
    grammarPoint: "Cấu trúc khoảng cách giới từ 从...到...",
    pauseMarks: "从我家到公司，// 走路 / 只需要十分钟。",
    chunks: [
      { text: "从我家到公司", pinyin: "cóng wǒ jiā dào gōngsī" },
      { text: "走路", pinyin: "zǒulù" },
      { text: "只需要十分钟", pinyin: "zhǐ xūyào shí fēnzhōng" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk2_04",
    level: 2,
    zh: "服务员，请给我们拿两杯热牛奶。",
    pinyin: "Fúwùyuán, qǐng gěi wǒmen ná liǎng bēi rè niúnǎi.",
    vi: "Phục vụ ơi, xin hãy lấy cho chúng tôi hai cốc sữa nóng.",
    grammarPoint: "Giới từ 给 (cho ai) + Lượng từ đồ uống 杯",
    pauseMarks: "服务员，// 请给我们 / 拿两杯热牛奶。",
    chunks: [
      { text: "服务员", pinyin: "fúwùyuán" },
      { text: "请给我们", pinyin: "qǐng gěi wǒmen" },
      { text: "拿两杯热牛奶", pinyin: "ná liǎng bēi rè niúnǎi" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk2_05",
    level: 2,
    zh: "医生说吃了药以后要多休息。",
    pinyin: "Yīshēng shuō chī le yào yǐhòu yào duō xiūxi.",
    vi: "Bác sĩ nói sau khi uống thuốc phải nghỉ ngơi nhiều.",
    grammarPoint: "Cấu trúc thời gian ...以后 + Phó từ 多 đặt trước động từ",
    pauseMarks: "医生说 / 吃了药以后，// 要多休息。",
    chunks: [
      { text: "医生说", pinyin: "yīshēng shuō" },
      { text: "吃了药以后", pinyin: "chī le yào yǐhòu" },
      { text: "要多休息", pinyin: "yào duō xiūxi" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk2_06",
    level: 2,
    zh: "我虽然学了两年中文，但是水平还不够高。",
    pinyin: "Wǒ suīrán xué le liǎng nián Zhōngwén, dànshì shuǐpíng hái bú gòu gāo.",
    vi: "Tôi tuy học tiếng Trung hai năm rồi, nhưng trình độ vẫn chưa đủ cao.",
    grammarPoint: "Cặp liên từ chuyển ý 虽然...但是... + Bổ ngữ thời lượng 两年",
    pauseMarks: "我虽然学了两年中文，// 但是水平 / 还不够高。",
    chunks: [
      { text: "我虽然学了两年中文", pinyin: "wǒ suīrán xué le liǎng nián Zhōngwén" },
      { text: "但是水平", pinyin: "dànshì shuǐpíng" },
      { text: "还不够高", pinyin: "hái bú gòu gāo" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk2_07",
    level: 2,
    zh: "门外站着一个穿红衣服的女孩子。",
    pinyin: "Mén wài zhàn zhe yí ge chuān hóng yīfu de nǚ háizi.",
    vi: "Bên ngoài cửa đang đứng một cô bé mặc áo đỏ.",
    grammarPoint: "Câu tồn tại trạng thái động từ + 着",
    pauseMarks: "门外站着 / 一个穿红衣服的 // 女孩子。",
    chunks: [
      { text: "门外站着", pinyin: "mén wài zhàn zhe" },
      { text: "一个穿红衣服的", pinyin: "yí ge chuān hóng yīfu de" },
      { text: "女孩子", pinyin: "nǚ háizi" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk2_08",
    level: 2,
    zh: "你以前去过中国北京旅游吗？",
    pinyin: "Nǐ yǐqián qù guo Zhōngguó Běijīng lǚyóu ma?",
    vi: "Trước đây bạn từng đi du lịch Bắc Kinh Trung Quốc chưa?",
    grammarPoint: "Trợ từ động thái 过 biểu thị kinh nghiệm đã trải qua",
    pauseMarks: "你以前 / 去过中国北京 // 旅游吗？",
    chunks: [
      { text: "你以前", pinyin: "nǐ yǐqián" },
      { text: "去过中国北京", pinyin: "qù guo Zhōngguó Běijīng" },
      { text: "旅游吗", pinyin: "lǚyóu ma" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk2_09",
    level: 2,
    zh: "请大家别在公共场所大声说话。",
    pinyin: "Qǐng dàjiā bié zài gōnggòng chǎngsuǒ dà shēng shuōhuà.",
    vi: "Xin mọi người đừng nói chuyện lớn tiếng ở nơi công cộng.",
    grammarPoint: "Phó từ phủ định mệnh lệnh 别 + Giới từ địa điểm 在",
    pauseMarks: "请大家 / 别在公共场所 // 大声说话。",
    chunks: [
      { text: "请大家", pinyin: "qǐng dàjiā" },
      { text: "别在公共场所", pinyin: "bié zài gōnggòng chǎngsuǒ" },
      { text: "大声说话", pinyin: "dà shēng shuōhuà" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk2_10",
    level: 2,
    zh: "这本汉语词典对我学习很有帮助。",
    pinyin: "Zhè běn Hànyǔ cídiǎn duì wǒ xuéxí hěn yǒu bāngzhù.",
    vi: "Cuốn từ điển tiếng Hán này rất có ích cho việc học của tôi.",
    grammarPoint: "Cấu trúc giới từ 对...有帮助 (Có ích đối với cái gì)",
    pauseMarks: "这本汉语词典，// 对我学习 // 很有帮助。",
    chunks: [
      { text: "这本汉语词典", pinyin: "zhè běn Hànyǔ cídiǎn" },
      { text: "对我学习", pinyin: "duì wǒ xuéxí" },
      { text: "很有帮助", pinyin: "hěn yǒu bāngzhù" }
    ],
    difficulty: "Trung bình"
  },

  // ==================== HSK 3 (10 sentences) ====================
  {
    id: "dict_hsk3_01",
    level: 3,
    zh: "请你先把房间打扫干净，然后再去玩儿电脑。",
    pinyin: "Qǐng nǐ xiān bǎ fángjiān dǎsǎo gānjìng, ránhòu zài qù wánr diànnǎo.",
    vi: "Bạn hãy dọn dẹp phòng sạch sẽ trước, rồi sau đó hãy đi chơi máy tính.",
    grammarPoint: "Câu chữ 把 kết hợp bổ ngữ kết quả 干净 + Liên từ 先...然后...",
    pauseMarks: "请你先把房间打扫干净，// 然后再去 // 玩儿电脑。",
    chunks: [
      { text: "请你先把房间打扫干净", pinyin: "qǐng nǐ xiān bǎ fángjiān dǎsǎo gānjìng" },
      { text: "然后再去", pinyin: "ránhòu zài qù" },
      { text: "玩儿电脑", pinyin: "wánr diànnǎo" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk3_02",
    level: 3,
    zh: "我的自行车被弟弟骑出去了。",
    pinyin: "Wǒ de zìxíngchē bèi dìdi qí chūqu le.",
    vi: "Xe đạp của tôi bị em trai cưỡi ra ngoài rồi.",
    grammarPoint: "Câu bị động chữ 被 kết hợp bổ ngữ xu hướng kép 出去",
    pauseMarks: "我的自行车 / 被弟弟 // 骑出去了。",
    chunks: [
      { text: "我的自行车", pinyin: "wǒ de zìxíngchē" },
      { text: "被弟弟", pinyin: "bèi dìdi" },
      { text: "骑出去了", pinyin: "qí chūqu le" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk3_03",
    level: 3,
    zh: "这本书太难了，我看了三遍也没看懂。",
    pinyin: "Zhè běn shū tài nán le, wǒ kàn le sān biàn yě méi kàndǒng.",
    vi: "Cuốn sách này khó quá, tôi đọc ba lượt rồi cũng không hiểu được.",
    grammarPoint: "Bổ ngữ động lượng 三遍 + Bổ ngữ kết quả phủ định 没看懂",
    pauseMarks: "这本书太难了，// 我看了三遍 / 也没看懂。",
    chunks: [
      { text: "这本书太难了", pinyin: "zhè běn shū tài nán le" },
      { text: "我看了三遍", pinyin: "wǒ kàn le sān biàn" },
      { text: "也没看懂", pinyin: "yě méi kàndǒng" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk3_04",
    level: 3,
    zh: "随着天气变暖，公园里的花开得越来越漂亮了。",
    pinyin: "Suízhe tiānqì biàn nuǎn, gōngyuán lǐ de huā kāi de yuè lái yuè piàoliang le.",
    vi: "Cùng với tiết trời ấm lên, hoa trong công viên nở càng lúc càng đẹp.",
    grammarPoint: "Giới từ 随着 (cùng với) + Cấu trúc cấp tiến 越来越...",
    pauseMarks: "随着天气变暖，// 公园里的花 // 开得越来越漂亮了。",
    chunks: [
      { text: "随着天气变暖", pinyin: "suízhe tiānqì biàn nuǎn" },
      { text: "公园里的花", pinyin: "gōngyuán lǐ de huā" },
      { text: "开得越来越漂亮了", pinyin: "kāi de yuè lái yuè piàoliang le" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk3_05",
    level: 3,
    zh: "为了准备明天的考试，他一整天都在图书馆复习。",
    pinyin: "Wèile zhǔnbèi míngtiān de kǎoshì, tā yì zhěng tiān dōu zài túshūguǎn fùxí.",
    vi: "Để chuẩn bị cho kỳ thi ngày mai, anh ấy cả ngày đều ở thư viện ôn bài.",
    grammarPoint: "Giới từ mục đích 为了 đứng đầu câu + Cụm thời lượng 一整天",
    pauseMarks: "为了准备明天的考试，// 他一整天 / 都在图书馆复习。",
    chunks: [
      { text: "为了准备明天的考试", pinyin: "wèile zhǔnbèi míngtiān de kǎoshì" },
      { text: "他一整天", pinyin: "tā yì zhěng tiān" },
      { text: "都在图书馆复习", pinyin: "dōu zài túshūguǎn fùxí" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk3_06",
    level: 3,
    zh: "只有坚持每天锻炼，身体才能真正健康起来。",
    pinyin: "Zhǐyǒu jiānchí měitiān duànliàn, shēntǐ cái néng zhēnzhèng jiànkāng qǐlai.",
    vi: "Chỉ khi kiên trì rèn luyện mỗi ngày, cơ thể mới có thể thực sự khỏe mạnh lên được.",
    grammarPoint: "Cặp liên từ điều kiện duy nhất 只有...才... + Bổ ngữ xu hướng 起来",
    pauseMarks: "只有坚持每天锻炼，// 身体才能 // 真正健康起来。",
    chunks: [
      { text: "只有坚持每天锻炼", pinyin: "zhǐyǒu jiānchí měitiān duànliàn" },
      { text: "身体才能", pinyin: "shēntǐ cái néng" },
      { text: "真正健康起来", pinyin: "zhēnzhèng jiànkāng qǐlai" }
    ],
    difficulty: "Khá"
  },
  {
    id: "dict_hsk3_07",
    level: 3,
    zh: "他不但聪明好学，而且对人非常有礼貌。",
    pinyin: "Tā búdàn cōngmíng hàoxué, érqiě duì rén fēicháng yǒu lǐmào.",
    vi: "Cậu ấy không những thông minh hiếu học, mà còn vô cùng lễ phép với mọi người.",
    grammarPoint: "Cặp liên từ tăng tiến 不但...而且...",
    pauseMarks: "他不但聪明好学，// 而且对人 // 非常有礼貌。",
    chunks: [
      { text: "他不但聪明好学", pinyin: "tā búdàn cōngmíng hàoxué" },
      { text: "而且对人", pinyin: "érqiě duì rén" },
      { text: "非常有礼貌", pinyin: "fēicháng yǒu lǐmào" }
    ],
    difficulty: "Khá"
  },
  {
    id: "dict_hsk3_08",
    level: 3,
    zh: "遇到困难的时候，我们一定要相信自己。",
    pinyin: "Yùdào kùnnan de shíhou, wǒmen yídìng yào xiāngxìn zìjǐ.",
    vi: "Khi gặp phải khó khăn, chúng ta nhất định phải tin tưởng vào bản thân.",
    grammarPoint: "Bổ ngữ kết quả 到 + Cấu trúc thời điểm ...的时候",
    pauseMarks: "遇到困难的时候，// 我们一定要 / 相信自己。",
    chunks: [
      { text: "遇到困难的时候", pinyin: "yùdào kùnnan de shíhou" },
      { text: "我们一定要", pinyin: "wǒmen yídìng yào" },
      { text: "相信自己", pinyin: "xiāngxìn zìjǐ" }
    ],
    difficulty: "Trung bình"
  },
  {
    id: "dict_hsk3_09",
    level: 3,
    zh: "听到这个好消息，大家高兴得跳了起来。",
    pinyin: "Tīngdào zhè ge hǎo xiāoxi, dàjiā gāoxìng de tiào le qǐlai.",
    vi: "Nghe được tin tốt này, mọi người vui mừng đến mức nhảy cẫng lên.",
    grammarPoint: "Bổ ngữ trạng thái kết hợp bổ ngữ xu hướng 跳了起来",
    pauseMarks: "听到这个好消息，// 大家高兴得 // 跳了起来。",
    chunks: [
      { text: "听到这个好消息", pinyin: "tīngdào zhè ge hǎo xiāoxi" },
      { text: "大家高兴得", pinyin: "dàjiā gāoxìng de" },
      { text: "跳了起来", pinyin: "tiào le qǐlai" }
    ],
    difficulty: "Khá"
  },
  {
    id: "dict_hsk3_10",
    level: 3,
    zh: "只要我们齐心协力，就一定能按时完成这项任务。",
    pinyin: "Zhǐyào wǒmen qíxīnxiélì, jiù yídìng néng ànshí wánchéng zhè xiàng rènwu.",
    vi: "Chỉ cần chúng ta đồng tâm hiệp lực, thì nhất định có thể hoàn thành nhiệm vụ này đúng hạn.",
    grammarPoint: "Cặp liên từ điều kiện đủ 只要...就... + Lượng từ công việc 项",
    pauseMarks: "只要我们齐心协力，// 就一定能 / 按时完成这项任务。",
    chunks: [
      { text: "只要我们齐心协力", pinyin: "zhǐyào wǒmen qíxīnxiélì" },
      { text: "就一定能", pinyin: "jiù yídìng néng" },
      { text: "按时完成这项任务", pinyin: "ànshí wánchéng zhè xiàng rènwu" }
    ],
    difficulty: "Khá"
  },

  // ==================== HSK 4 (10 sentences) ====================
  {
    id: "dict_hsk4_01",
    level: 4,
    zh: "无论遇到多么复杂的挑战，我们都要保持冷静乐观的心态。",
    pinyin: "Wúlùn yùdào duōme fùzá de tiǎozhàn, wǒmen dōu yào bǎochí lěngjìng lèguān de xīntài.",
    vi: "Bất kể gặp phải thử thách phức tạp đến đâu, chúng ta đều phải giữ vững tâm thái bình tĩnh lạc quan.",
    grammarPoint: "Cặp liên từ vô điều kiện 无论...都... + Cấu trúc 多么 + Adj",
    pauseMarks: "无论遇到多么复杂的挑战，// 我们都要 // 保持冷静乐观的心态。",
    chunks: [
      { text: "无论遇到多么复杂的挑战", pinyin: "wúlùn yùdào duōme fùzá de tiǎozhàn" },
      { text: "我们都要", pinyin: "wǒmen dōu yào" },
      { text: "保持冷静乐观的心态", pinyin: "bǎochí lěngjìng lèguān de xīntài" }
    ],
    difficulty: "Khá"
  },
  {
    id: "dict_hsk4_02",
    level: 4,
    zh: "对于现代职场人士来说，合理安排时间显得尤为重要。",
    pinyin: "Duìyú xiàndài zhíchǎng rénshì lái shuō, hélǐ ānpái shíjiān xiǎnde yóuwéi zhòngyào.",
    vi: "Đối với người đi làm hiện đại mà nói, việc sắp xếp thời gian hợp lý tỏ ra đặc biệt quan trọng.",
    grammarPoint: "Cụm giới từ 对于...来说 + Động từ phán đoán 显得 + Phó từ 尤为",
    pauseMarks: "对于现代职场人士来说，// 合理安排时间 // 显得尤为重要。",
    chunks: [
      { text: "对于现代职场人士来说", pinyin: "duìyú xiàndài zhíchǎng rénshì lái shuō" },
      { text: "合理安排时间", pinyin: "hélǐ ānpái shíjiān" },
      { text: "显得尤为重要", pinyin: "xiǎnde yóuwéi zhòngyào" }
    ],
    difficulty: "Khá"
  },
  {
    id: "dict_hsk4_03",
    level: 4,
    zh: "他一口气把整篇长文章背得滚瓜烂熟，真令人佩服。",
    pinyin: "Tā yì kǒu qì bǎ zhěng piān cháng wénzhāng bèi de gǔnguālànshú, zhēn lìng rén pèifú.",
    vi: "Cậu ấy một hơi đọc thuộc làu cả bài văn dài, thật khiến người ta khâm phục.",
    grammarPoint: "Câu chữ 把 kết hợp thành ngữ làm bổ ngữ trình độ 滚瓜烂熟 + Động từ kiêm ngữ 令",
    pauseMarks: "他一口气 / 把整篇长文章 // 背得滚瓜烂熟，// 真令人佩服。",
    chunks: [
      { text: "他一口气", pinyin: "tā yì kǒu qì" },
      { text: "把整篇长文章", pinyin: "bǎ zhěng piān cháng wénzhāng" },
      { text: "背得滚瓜烂熟", pinyin: "bèi de gǔnguālànshú" },
      { text: "真令人佩服", pinyin: "zhēn lìng rén pèifú" }
    ],
    difficulty: "Khó"
  },
  {
    id: "dict_hsk4_04",
    level: 4,
    zh: "与其在这里无休止地抱怨，不如主动想办法去解决问题。",
    pinyin: "Yǔqí zài zhèlǐ wúxiūzhǐ de bàoyuàn, bùrú zhǔdòng xiǎng bànfǎ qù jiějué wèntí.",
    vi: "Thay vì ở đây phàn nàn không dứt, chi bằng chủ động nghĩ cách đi giải quyết vấn đề.",
    grammarPoint: "Cặp liên từ lựa chọn xả - thủ 与其...不如... + Trợ từ kết cấu 地",
    pauseMarks: "与其在这里无休止地抱怨，// 不如主动想办法 // 去解决问题。",
    chunks: [
      { text: "与其在这里无休止地抱怨", pinyin: "yǔqí zài zhèlǐ wúxiūzhǐ de bàoyuàn" },
      { text: "不如主动想办法", pinyin: "bùrú zhǔdòng xiǎng bànfǎ" },
      { text: "去解决问题", pinyin: "qù jiějué wèntí" }
    ],
    difficulty: "Khó"
  },
  {
    id: "dict_hsk4_05",
    level: 4,
    zh: "由于突发大雾天气，原本预定起飞的航班不得不推迟。",
    pinyin: "Yóuyú tūfā dàwù tiānqì, yuánběn yùdìng qǐfēi de hángbān bùdébù tuīchí.",
    vi: "Do thời tiết sương mù bất ngờ bùng phát, chuyến bay dự kiến cất cánh ban đầu buộc phải hoãn lại.",
    grammarPoint: "Liên từ nguyên nhân 由于 + Phó từ tất yếu 不得不",
    pauseMarks: "由于突发大雾天气，// 原本预定起飞的航班 // 不得不推迟。",
    chunks: [
      { text: "由于突发大雾天气", pinyin: "yóuyú tūfā dàwù tiānqì" },
      { text: "原本预定起飞的航班", pinyin: "yuánběn yùdìng qǐfēi de hángbān" },
      { text: "不得不推迟", pinyin: "bùdébù tuīchí" }
    ],
    difficulty: "Khá"
  },
  {
    id: "dict_hsk4_06",
    level: 4,
    zh: "经过反复的讨论与修改，双方终于顺利达成了商业合作协议。",
    pinyin: "Jīngguò fǎnfù de tǎolùn yǔ xiūgǎi, shuāngfāng zhōngyú shùnlì dáchéng le shāngyè hézuò xiéyì.",
    vi: "Trải qua thảo luận và sửa đổi nhiều lần, hai bên rốt cuộc đã thuận lợi đạt được thỏa thuận hợp tác thương mại.",
    grammarPoint: "Giới từ quá trình 经过 + Bổ ngữ kết quả 达成 + Phó từ 终于",
    pauseMarks: "经过反复的讨论与修改，// 双方终于顺利 // 达成了商业合作协议。",
    chunks: [
      { text: "经过反复的讨论与修改", pinyin: "jīngguò fǎnfù de tǎolùn yǔ xiūgǎi" },
      { text: "双方终于顺利", pinyin: "shuāngfāng zhōngyú shùnlì" },
      { text: "达成了商业合作协议", pinyin: "dáchéng le shāngyè hézuò xiéyì" }
    ],
    difficulty: "Khá"
  },
  {
    id: "dict_hsk4_07",
    level: 4,
    zh: "尽管这份工作薪水不高，但他却从中积累了宝贵的实践经验。",
    pinyin: "Jǐnguǎn zhè fèn gōngzuò xīnshuǐ bù gāo, dàn tā què cóngzhōng jīlěi le bǎoguì de shíjiàn jīngyàn.",
    vi: "Mặc dù công việc này lương không cao, nhưng anh ấy lại tích lũy được kinh nghiệm thực tiễn quý giá từ đó.",
    grammarPoint: "Cặp liên từ nhượng bộ 尽管...但...却... + Cụm 从中",
    pauseMarks: "尽管这份工作薪水不高，// 但他却从中 // 积累了宝贵的实践经验。",
    chunks: [
      { text: "尽管这份工作薪水不高", pinyin: "jǐnguǎn zhè fèn gōngzuò xīnshuǐ bù gāo" },
      { text: "但他却从中", pinyin: "dàn tā què cóngzhōng" },
      { text: "积累了宝贵的实践经验", pinyin: "jīlěi le bǎoguì de shíjiàn jīngyàn" }
    ],
    difficulty: "Khá"
  },
  {
    id: "dict_hsk4_08",
    level: 4,
    zh: "养成良好的阅读习惯，不仅能开阔眼界，更能丰富精神世界。",
    pinyin: "Yǎngchéng liánghǎo de yuèdú xíguàn, bùjǐn néng kāikuò yǎnjiè, gèng néng fēngfù jīngshén shìjiè.",
    vi: "Tạo thói quen đọc sách tốt, không chỉ giúp mở rộng tầm mắt, mà càng có thể làm phong phú thế giới tinh thần.",
    grammarPoint: "Cặp liên từ tăng tiến đẳng cấp 不仅能...更能... + Động tân 开阔眼界",
    pauseMarks: "养成良好的阅读习惯，// 不仅能开阔眼界，// 更能丰富精神世界。",
    chunks: [
      { text: "养成良好的阅读习惯", pinyin: "yǎngchéng liánghǎo de yuèdú xíguàn" },
      { text: "不仅能开阔眼界", pinyin: "bùjǐn néng kāikuò yǎnjiè" },
      { text: "更能丰富精神世界", pinyin: "gèng néng fēngfù jīngshén shìjiè" }
    ],
    difficulty: "Khá"
  },
  {
    id: "dict_hsk4_09",
    level: 4,
    zh: "按照目前的研究进度，这个科研项目年底前完全可以顺利收尾。",
    pinyin: "Ànzhào mùqián de yánjiū jìndù, zhè ge kēyán xiàngmù niándǐ qián wánquán kěyǐ shùnlì shōuwěi.",
    vi: "Căn cứ theo tiến độ nghiên cứu hiện tại, đề tài nghiên cứu khoa học này hoàn toàn có thể kết thúc êm đẹp trước cuối năm.",
    grammarPoint: "Giới từ căn cứ 按照 + Cụm thời gian 年底前 + Phó từ 完全",
    pauseMarks: "按照目前的研究进度，// 这个科研项目 // 年底前完全可以顺利收尾。",
    chunks: [
      { text: "按照目前的研究进度", pinyin: "ànzhào mùqián de yánjiū jìndù" },
      { text: "这个科研项目", pinyin: "zhè ge kēyán xiàngmù" },
      { text: "年底前完全可以顺利收尾", pinyin: "niándǐ qián wánquán kěyǐ shùnlì shōuwěi" }
    ],
    difficulty: "Khá"
  },
  {
    id: "dict_hsk4_10",
    level: 4,
    zh: "为了不辜负父母的期望，他日日夜夜勤奋苦读。",
    pinyin: "Wèile bù gūfù fùmǔ de qīwàng, tā rìrì-yèyè qínfèn kǔdú.",
    vi: "Để không phụ sự kỳ vọng của cha mẹ, cậu ấy ngày đêm chăm chỉ dùi mài kinh sử.",
    grammarPoint: "Từ láy 4 chữ AABB 日日夜夜 + Cụm động tân 辜负期望",
    pauseMarks: "为了不辜负父母的期望，// 他日日夜夜 // 勤奋苦读。",
    chunks: [
      { text: "为了不辜负父母的期望", pinyin: "wèile bù gūfù fùmǔ de qīwàng" },
      { text: "他日日夜夜", pinyin: "tā rìrì-yèyè" },
      { text: "勤奋苦读", pinyin: "qínfèn kǔdú" }
    ],
    difficulty: "Khó"
  },

  // ==================== HSK 5 (10 sentences) ====================
  {
    id: "dict_hsk5_01",
    level: 5,
    zh: "在激烈的市场竞争中，唯有坚持自主创新，企业才能立于不败之地。",
    pinyin: "Zài jīliè de shìchǎng jìngzhēng zhōng, wéiyǒu jiānchí zìzhǔ chuàngxīn, qǐyè cái néng lì yú bú bài zhī dì.",
    vi: "Trong cuộc cạnh tranh thị trường khốc liệt, duy chỉ có kiên trì đổi mới tự chủ, doanh nghiệp mới có thể đứng ở thế bất bại.",
    grammarPoint: "Cấu trúc điều kiện duy nhất thư diện 唯有...才... + Cụm thành ngữ 立于不败之地",
    pauseMarks: "在激烈的市场竞争中，// 唯有坚持自主创新，// 企业才能立于不败之地。",
    chunks: [
      { text: "在激烈的市场竞争中", pinyin: "zài jīliè de shìchǎng jìngzhēng zhōng" },
      { text: "唯有坚持自主创新", pinyin: "wéiyǒu jiānchí zìzhǔ chuàngxīn" },
      { text: "企业才能立于不败之地", pinyin: "qǐyè cái néng lì yú bú bài zhī dì" }
    ],
    difficulty: "Khó"
  },
  {
    id: "dict_hsk5_02",
    level: 5,
    zh: "面对突如其来的危机，团队负责人必须沉着应变，切忌盲目慌乱。",
    pinyin: "Miànduì tūrúqílái de wēijī, tuánduì fùzérén bìxū chénzhuó yìngbiàn, qièjì mángmù huāngluàn.",
    vi: "Đối mặt với cơn khủng hoảng ập đến bất ngờ, người phụ trách đội ngũ phải bình tĩnh ứng biến, kiêng kỵ tuyệt đối việc hoảng loạn mù quáng.",
    grammarPoint: "Thành ngữ 突如其来 + Phó từ cảnh cáo thư diện 切忌 (tuyệt đối tránh)",
    pauseMarks: "面对突如其来的危机，// 团队负责人必须沉着应变，// 切忌盲目慌乱。",
    chunks: [
      { text: "面对突如其来的危机", pinyin: "miànduì tūrúqílái de wēijī" },
      { text: "团队负责人必须沉着应变", pinyin: "tuánduì fùzérén bìxū chénzhuó yìngbiàn" },
      { text: "切忌盲目慌乱", pinyin: "qièjì mángmù huāngluàn" }
    ],
    difficulty: "Khó"
  },
  {
    id: "dict_hsk5_03",
    level: 5,
    zh: "文化交流不仅能消除彼此之间的隔阂，进而促进各国人民的相互理解。",
    pinyin: "Wénhuà jiāoliú bùjǐn néng xiāochú bǐcǐ zhī jiān de géhé, jìn'ér cùjìn gè guó rénmín de xiānghù lǐjiě.",
    vi: "Giao lưu văn hóa không chỉ xóa bỏ khoảng cách rào cản giữa đôi bên, mà xa hơn nữa còn thúc đẩy sự hiểu biết lẫn nhau giữa nhân dân các nước.",
    grammarPoint: "Liên từ chuyển tiếp sâu sắc 进而 (và thế là / từ đó tiến thêm một bước)",
    pauseMarks: "文化交流不仅能消除彼此之间的隔阂，// 进而促进 // 各国人民的相互理解。",
    chunks: [
      { text: "文化交流不仅能消除彼此之间的隔阂", pinyin: "wénhuà jiāoliú bùjǐn néng xiāochú bǐcǐ zhī jiān de géhé" },
      { text: "进而促进", pinyin: "jìn'ér cùjìn" },
      { text: "各国人民的相互理解", pinyin: "gè guó rénmín de xiānghù lǐjiě" }
    ],
    difficulty: "Khó"
  },
  {
    id: "dict_hsk5_04",
    level: 5,
    zh: "父母的一言一行往往会对子女的性格塑造产生潜移默化的深远影响。",
    pinyin: "Fùmǔ de yìyán-yìxíng wǎngwǎng huì duì zǐnǚ de xìnggé shùzào chǎnshēng qiányímòhuà de shēnyuǎn yǐngxiǎng.",
    vi: "Mỗi lời nói hành vi của cha mẹ thường sẽ tạo nên ảnh hưởng sâu sắc, ngấm ngầm thấm dần đối với việc uốn nắn tính cách con cái.",
    grammarPoint: "Thành ngữ 潜移默化 (thấm dần dần một cách tự nhiên) + Cụm 产生深远影响",
    pauseMarks: "父母的一言一行，// 往往会对子女的性格塑造 // 产生潜移默化的深远影响。",
    chunks: [
      { text: "父母的一言一行", pinyin: "fùmǔ de yìyán-yìxíng" },
      { text: "往往会对子女的性格塑造", pinyin: "wǎngwǎng huì duì zǐnǚ de xìnggé shùzào" },
      { text: "产生潜移默化的深远影响", pinyin: "chǎnshēng qiányímòhuà de shēnyuǎn yǐngxiǎng" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk5_05",
    level: 5,
    zh: "任何科学理论都必须经受住实践的严格检验，否则就毫无立足之地。",
    pinyin: "Rènhé kēxué lǐlùn dōu bìxū jīngshòuzhù shíjiàn de yángé jiǎnyàn, fǒuzé jiù háowú lìzú zhī dì.",
    vi: "Bất kỳ lý luận khoa học nào cũng đều phải chịu đựng được thử thách nghiêm ngặt của thực tiễn, nếu không thì chẳng hề có chỗ đứng.",
    grammarPoint: "Bổ ngữ khả năng/kết quả 经受住 + Phó từ phủ định tuyệt đối 毫无 + Liên từ 否则",
    pauseMarks: "任何科学理论 / 都必须经受住实践的严格检验，// 否则就毫 vacuum无立足之地。",
    chunks: [
      { text: "任何科学理论", pinyin: "rènhé kēxué lǐlùn" },
      { text: "都必须经受住实践的严格检验", pinyin: "dōu bìxū jīngshòuzhù shíjiàn de yángé jiǎnyàn" },
      { text: "否则就毫无立足之地", pinyin: "fǒuzé jiù háowú lìzú zhī dì" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk5_06",
    level: 5,
    zh: "即使前方的道路充满未知与险阻，他也决不会轻言放弃最初的梦想。",
    pinyin: "Jíshǐ qiánfāng de dàolù chōngmǎn wèizhī yǔ xiǎnzǔ, tā yě jué bú huì qīng yán fàngqì zuìchū de mèngxiǎng.",
    vi: "Cho dù con đường phía trước tràn đầy điều chưa biết và hiểm trở, cậu ấy cũng tuyệt đối không dễ dàng từ bỏ ước mơ ban đầu.",
    grammarPoint: "Cặp liên từ giả thiết nhượng bộ 即使...也... + Phó từ kiên quyết 决不",
    pauseMarks: "即使前方的道路充满未知与险阻，// 他也决不会 // 轻言放弃最初的梦想。",
    chunks: [
      { text: "即使前方的道路充满未知与险阻", pinyin: "jíshǐ qiánfāng de dàolù chōngmǎn wèizhī yǔ xiǎnzǔ" },
      { text: "他也决不会", pinyin: "tā yě jué bú huì" },
      { text: "轻言放弃最初的梦想", pinyin: "qīng yán fàngqì zuìchū de mèngxiǎng" }
    ],
    difficulty: "Khó"
  },
  {
    id: "dict_hsk5_07",
    level: 5,
    zh: "针对这一突发社会舆论热点，相关职能部门迅速启动了应急预案。",
    pinyin: "Zhēnduì zhè yì tūfā shèhuì yúlùn rèdiǎn, xiāngguān zhínéng bùmén xùnsù qǐdòng le yìngjí yù'àn.",
    vi: "Nhằm vào điểm nóng dư luận xã hội bùng phát bất ngờ này, cơ quan chức năng hữu quan đã nhanh chóng kích hoạt phương án khẩn cấp.",
    grammarPoint: "Giới từ đối tượng 针对 + Thuật ngữ hành chính thư diện 应急预案",
    pauseMarks: "针对这一突发社会舆论热点，// 相关职能部门 // 迅速启动了应急预案。",
    chunks: [
      { text: "针对这一突发社会舆论热点", pinyin: "zhēnduì zhè yì tūfā shèhuì yúlùn rèdiǎn" },
      { text: "相关职能部门", pinyin: "xiāngguān zhínéng bùmén" },
      { text: "迅速启动了应急预案", pinyin: "xùnsù qǐdòng le yìngjí yù'àn" }
    ],
    difficulty: "Khó"
  },
  {
    id: "dict_hsk5_08",
    level: 5,
    zh: "随着经济全球化的深入推进，各国之间的利益关系日益紧密相连。",
    pinyin: "Suízhe jīngjì quánqiúhuà de shēnrù tuījìn, gè guó zhī jiān de lìyì guānxi rìyì jǐnmì xiānglián.",
    vi: "Cùng với sự thúc đẩy sâu rộng của toàn cầu hóa kinh tế, mối quan hệ lợi ích giữa các nước ngày một gắn kết chặt chẽ.",
    grammarPoint: "Phó từ cấp độ thời gian 日益 (ngày càng) + Cụm 紧密相连",
    pauseMarks: "随着经济全球化的深入推进，// 各国之间的利益关系 // 日益紧密相连。",
    chunks: [
      { text: "随着经济全球化的深入推进", pinyin: "suízhe jīngjì quánqiúhuà de shēnrù tuījìn" },
      { text: "各国之间的利益关系", pinyin: "gè guó zhī jiān de lìyì guānxi" },
      { text: "日益紧密相连", pinyin: "rìyì jǐnmì xiānglián" }
    ],
    difficulty: "Khó"
  },
  {
    id: "dict_hsk5_09",
    level: 5,
    zh: "专家指出，适度承受压力能激发人的潜能，但过载则适得其反。",
    pinyin: "Zhuānjiā zhǐchū, shìdù chéngshòu yālì néng jīfā rén de qiánnéng, dàn guòzài zé shìdéqífǎn.",
    vi: "Chuyên gia chỉ ra rằng, chịu áp lực ở mức độ vừa phải có thể khơi dậy tiềm năng con người, nhưng quá tải thì lại phản tác dụng.",
    grammarPoint: "Thành ngữ 适得其反 (kết quả đi ngược mong muốn ban đầu) + Liên từ đối lập 则",
    pauseMarks: "专家指出，// 适度承受压力能激发人的潜能，// 但过载则适得其反。",
    chunks: [
      { text: "专家指出", pinyin: "zhuānjiā zhǐchū" },
      { text: "适度承受压力能激发人的潜能", pinyin: "shìdù chéngshòu yālì néng jīfā rén de qiánnéng" },
      { text: "但过载则适得其反", pinyin: "dàn guòzài zé shìdéqífǎn" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk5_10",
    level: 5,
    zh: "保护历史文化遗产并不等同于固步自封，而应当在传承中谋求创新。",
    pinyin: "Bǎohù lìshǐ wénhuà yíchǎn bìng bù děngtóng yú gùbùzìfēng, ér yīngdāng zài chuánchéng zhōng móuqiú chuàngxīn.",
    vi: "Bảo tồn di sản văn hóa lịch sử hoàn toàn không đồng nghĩa với việc tự trói buộc dậm chân tại chỗ, mà cần mưu cầu đổi mới trong dòng chảy kế thừa.",
    grammarPoint: "Cấu trúc 并不同等 + Thành ngữ 固步自封 + Cặp liên từ 并不...而应当...",
    pauseMarks: "保护历史文化遗产并不等同于固步自封，// 而应当在传承中 // 谋求创新。",
    chunks: [
      { text: "保护历史文化遗产并不等同于固步自封", pinyin: "bǎohù lìshǐ wénhuà yíchǎn bìng bù děngtóng yú gùbùzìfēng" },
      { text: "而应当在传承中", pinyin: "ér yīngdāng zài chuánchéng zhōng" },
      { text: "谋求创新", pinyin: "móuqiú chuàngxīn" }
    ],
    difficulty: "Rất khó"
  },

  // ==================== HSK 6 (10 sentences) ====================
  {
    id: "dict_hsk6_01",
    level: 6,
    zh: "鉴于当前极其错综复杂的国际经济局势，我们务必树立底线思维以防患于未然。",
    pinyin: "Jiànyú dāngqián jíqí cuòzōng-fùzá de guójì jīngjì júshì, wǒmen wùbì shùlì dǐxiàn sīwéi yǐ fánghuàn yú wèirán.",
    vi: "Xét thấy cục diện kinh tế quốc tế hết sức phức tạp đan xen hiện nay, chúng ta nhất định phải xác lập tư duy giới hạn để phòng ngừa rủi ro từ trước.",
    grammarPoint: "Giới từ trang trọng 鉴于 + Thành ngữ 错综复杂 & 防患于未然 + Liên từ mục đích 以",
    pauseMarks: "鉴于当前极其错综复杂的国际经济局势，// 我们务必树立底线思维，// 以防患于未然。",
    chunks: [
      { text: "鉴于当前极其错综复杂的国际经济局势", pinyin: "jiànyú dāngqián jíqí cuòzōng-fùzá de guójì jīngjì júshì" },
      { text: "我们务必树立底线思维", pinyin: "wǒmen wùbì shùlì dǐxiàn sīwéi" },
      { text: "以防患于未然", pinyin: "yǐ fánghuàn yú wèirán" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk6_02",
    level: 6,
    zh: "毋庸置疑，人工智能大模型的迅猛崛起必将对传统教育格局产生颠覆性的重塑。",
    pinyin: "Wúyōngzhìyí, réngōng zhìnéng dà móxíng de xùnměng juéqǐ bìjiāng duì chuántǒng jiàoyù géjú chǎnshēng diānfùxìng de zhòngsù.",
    vi: "Không còn nghi ngờ gì nữa, sự trỗi dậy vũ bão của các mô hình trí tuệ nhân tạo lớn tất sẽ tạo nên sự định hình lại mang tính lật đổ đối với cục diện giáo dục truyền thống.",
    grammarPoint: "Thành ngữ khẳng định 毋庸置疑 + Phó từ tương lai tất yếu 必将 + Định ngữ 颠覆性",
    pauseMarks: "毋庸置疑，// 人工智能大模型的迅猛崛起，// 必将对传统教育格局产生颠覆性的重塑。",
    chunks: [
      { text: "毋庸置疑", pinyin: "wúyōngzhìyí" },
      { text: "人工智能大模型的迅猛崛起", pinyin: "réngōng zhìnéng dà móxíng de xùnměng juéqǐ" },
      { text: "必将对传统教育格局产生颠覆性的重塑", pinyin: "bìjiāng duì chuántǒng jiàoyù géjú chǎnshēng diānfùxìng de zhòngsù" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk6_03",
    level: 6,
    zh: "生态文明建设关乎人民福祉与民族未来，容不得丝毫的侥幸心理与懈怠情绪。",
    pinyin: "Shēngtài wénmíng jiànshè guānhū rénmín fúzhǐ yǔ mínzú wèilái, róngbùdé sīháo de jiǎoxìng xīnlǐ yǔ xièdài qíngxù.",
    vi: "Xây dựng văn minh sinh thái gắn liền với phúc lợi nhân dân và tương lai dân tộc, không cho phép mảy may tâm lý cầu may và tâm trạng trễ nải.",
    grammarPoint: "Động từ cổ 关乎 (liên quan đến) + Cụm 容不得 (không dung thứ) + Thành ngữ 丝毫",
    pauseMarks: "生态文明建设关乎人民福祉与民族未来，// 容不得丝毫的侥幸心理 // 与懈怠情绪。",
    chunks: [
      { text: "生态文明建设关乎人民福祉与民族未来", pinyin: "shēngtài wénmíng jiànshè guānhū rénmín fúzhǐ yǔ mínzú wèilái" },
      { text: "容不得丝毫的侥幸心理", pinyin: "róngbùdé sīháo de jiǎoxìng xīnlǐ" },
      { text: "与懈怠情绪", pinyin: "yǔ xièdài qíngxù" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk6_04",
    level: 6,
    zh: "真正的学术研究崇尚求真务实，断不可为了博取名利而投机取巧、弄虚作假。",
    pinyin: "Zhēnzhèng de xuéshù yánjiū chóngshàng qiúzhēn-wùshí, duàn bùkě wèile bóqǔ mínglì ér tóujī-qǔqiǎo, nòngxū-zuòjiǎ.",
    vi: "Nghiên cứu học thuật đích thực tôn sùng tinh thần cầu thị chuộng thực, tuyệt đối không được vì trục lợi danh tiếng mà đầu cơ chụp giật, làm trò giả dối.",
    grammarPoint: "Phó từ nghiêm cấm 断不可 (tuyệt đối không thể) + Thành ngữ đôi 投机取巧 & 弄虚作假",
    pauseMarks: "真正的学术研究崇尚求真务实，// 断不可为了博取名利 // 而投机取巧、弄虚作假。",
    chunks: [
      { text: "真正的学术研究崇尚求真务实", pinyin: "zhēnzhèng de xuéshù yánjiū chóngshàng qiúzhēn-wùshí" },
      { text: "断不可为了博取名利", pinyin: "duàn bùkě wèile bóqǔ mínglì" },
      { text: "而投机取巧、弄虚作假", pinyin: "ér tóujī-qǔqiǎo, nòngxū-zuòjiǎ" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk6_05",
    level: 6,
    zh: "古典文学名著之所以历经千年沧桑而经久不衰，关键在于其蕴含着永恒的人性光辉。",
    pinyin: "Gǔdiǎn wénxué míngzhù zhī suǒyǐ lìjīng qiān nián cāngsāng ér jīngjiǔ-bùshuāi, guānjiàn zàiyú qí yùnhán zhe yǒnghéng de rénxìng guānghuī.",
    vi: "Các danh tác văn học cổ điển sở dĩ trải qua nghìn năm dâu bể mà vẫn trường tồn không suy chuyển, mấu chốt nằm ở chỗ chúng chứa đựng ánh hào quang nhân tính vĩnh hằng.",
    grammarPoint: "Cấu trúc giải thích nguyên do 之所以...关键在于... + Thành ngữ 经久不衰 & 千年沧桑",
    pauseMarks: "古典文学名著之所以历经千年沧桑而经久不衰，// 关键在于 // 其蕴含着永恒的人性光辉。",
    chunks: [
      { text: "古典文学名著之所以历经千年沧桑而经久不衰", pinyin: "gǔdiǎn wénxué míngzhù zhī suǒyǐ lìjīng qiān nián cāngsāng ér jīngjiǔ-bùshuāi" },
      { text: "关键在于", pinyin: "guānjiàn zàiyú" },
      { text: "其蕴含着永恒的人性光辉", pinyin: "qí yùnhán zhe yǒnghéng de rénxìng guānghuī" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk6_06",
    level: 6,
    zh: "科技伦理的边界一旦被肆意突破，势必引发难以预料的灾难性社会后果。",
    pinyin: "Kējì lúnlǐ de biānjiè yídàn bèi sìyì tūpò, shìbì yǐnfā nǎnyǐ yùliào de zāinànxìng shèhuì hòuguǒ.",
    vi: "Ranh giới của đạo đức khoa học một khi bị tùy tiện phá vỡ, chắc chắn sẽ khơi mào cho những hậu quả xã hội thảm khốc khó lòng lường trước.",
    grammarPoint: "Cặp liên từ giả định nguy cơ 一旦...势必... + Thành ngữ 难以预料",
    pauseMarks: "科技伦理的边界一旦被肆意突破，// 势必引发 // 难以预料的灾难性社会后果。",
    chunks: [
      { text: "科技伦理的边界一旦被肆意突破", pinyin: "kējì lúnlǐ de biānjiè yídàn bèi sìyì tūpò" },
      { text: "势必引发", pinyin: "shìbì yǐnfā" },
      { text: "难以预料的灾难性社会后果", pinyin: "nǎnyǐ yùliào de zāinànxìng shèhuì hòuguǒ" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk6_07",
    level: 6,
    zh: "在这场史无前例的技术革新浪潮中，故步自封者终将被时代的滚滚车轮无情淘汰。",
    pinyin: "Zài zhè chǎng shǐwúqiánlì de jìshù géxīn làngcháo zhōng, gùbùzìfēng zhě zhōng jiāng bèi shídài de gǔngǔn chēlún wúqíng táotài.",
    vi: "Trong làn sóng cách tân công nghệ chưa từng có trong lịch sử này, những kẻ khép mình tự mãn cuối cùng sẽ bị bánh xe cuồn cuộn của thời đại đào thải không thương tiếc.",
    grammarPoint: "Thành ngữ 史无前例 + Cụm danh từ hóa 故步自封者 + Phó từ tương lai kết quả 终将",
    pauseMarks: "在这场史无前例的技术革新浪潮中，// 故步自封者 // 终将被时代的滚滚车轮无情淘汰。",
    chunks: [
      { text: "在这场史无前例的技术革新浪潮中", pinyin: "zài zhè chǎng shǐwúqiánlì de jìshù géxīn làngcháo zhōng" },
      { text: "故步自封者", pinyin: "gùbùzìfēng zhě" },
      { text: "终将被时代的滚滚车轮无情淘汰", pinyin: "zhōng jiāng bèi shídài de gǔngǔn chēlún wúqíng táotài" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk6_08",
    level: 6,
    zh: "跨文化交际的精髓不仅在于语言的准确转换，更在于对异质文化心理的深度共情。",
    pinyin: "Kuà wénhuà jiāojì de jīngsuǐ bùjǐn zàiyú yǔyán de zhǔnquè zhuǎnhuàn, gèng zàiyú duì yìzhì wénhuà xīnlǐ de shēndù gòngqíng.",
    vi: "Tinh hoa của giao tiếp liên văn hóa không chỉ nằm ở việc chuyển ngữ chuẩn xác, mà càng nằm ở sự thấu cảm sâu sắc đối với tâm lý của nền văn hóa dị biệt.",
    grammarPoint: "Cấu trúc song hành 不仅在于...更在于... + Thuật ngữ ngôn ngữ học 深度共情",
    pauseMarks: "跨文化交际的精髓不仅在于语言的准确转换，// 更在于 // 对异质文化心理的深度共情。",
    chunks: [
      { text: "跨文化交际的精髓不仅在于语言的准确转换", pinyin: "kuà wénhuà jiāojì de jīngsuǐ bùjǐn zàiyú yǔyán de zhǔnquè zhuǎnhuàn" },
      { text: "更在于", pinyin: "gèng zàiyú" },
      { text: "对异质文化心理的深度共情", pinyin: "duì yìzhì wénhuà xīnlǐ de shēndù gòngqíng" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk6_09",
    level: 6,
    zh: "纵观人类文明的发展长河，和平与合作始终是顺应历史潮流的人心所向。",
    pinyin: "Zòngguān rénlèi wénmíng de fāzhǎn chánghé, hépíng yǔ hézuò shǐzhōng shì shùnyìng lìshǐ cháoliú de rénxīn-suǒxiàng.",
    vi: "Nhìn bao quát dòng chảy phát triển của văn minh nhân loại, hòa bình và hợp tác từ đầu chí cuối luôn là điều lòng người hướng tới thuận theo trào lưu lịch sử.",
    grammarPoint: "Cụm phân từ quan sát 纵观 + Thành ngữ 人心所向 (nguyện vọng chung của muôn người)",
    pauseMarks: "纵观人类文明的发展长河，// 和平与合作 // 始终是顺应历史潮流的人心所向。",
    chunks: [
      { text: "纵观人类文明的发展长河", pinyin: "zòngguān rénlèi wénmíng de fāzhǎn chánghé" },
      { text: "和平与合作", pinyin: "hépíng yǔ hézuò" },
      { text: "始终是顺应历史潮流的人心所向", pinyin: "shǐzhōng shì shùnyìng lìshǐ cháoliú de rénxīn-suǒxiàng" }
    ],
    difficulty: "Rất khó"
  },
  {
    id: "dict_hsk6_10",
    level: 6,
    zh: "青年学子应当胸怀远大抱负，切莫在物欲横流的浮躁风气中迷失自我。",
    pinyin: "Qīngnián xuézǐ yīngdāng xiōnghuái yuǎndà bàofù, qiè mò zài wùyù-héngliú de fúzào fēngqì zhōng míshī zìwǒ.",
    vi: "Tuổi trẻ học trò nên ôm ấp hoài bão lớn lao, chớ có đánh mất bản thân giữa bầu không khí xốc nổi của dòng xoáy dục vọng vật chất.",
    grammarPoint: "Phó từ khuyên can 切莫 (chớ nên, tuyệt đối không) + Thành ngữ 胸怀大志 & 物欲横流",
    pauseMarks: "青年学子应当胸怀远大抱负，// 切莫在物欲横流的浮躁风气中 // 迷失自我。",
    chunks: [
      { text: "青年学子应当胸怀远大抱负", pinyin: "qīngnián xuézǐ yīngdāng xiōnghuái yuǎndà bàofù" },
      { text: "切莫在物欲横流的浮躁风气中", pinyin: "qiè mò zài wùyù-héngliú de fúzào fēngqì zhōng" },
      { text: "迷失自我", pinyin: "míshī zìwǒ" }
    ],
    difficulty: "Rất khó"
  }
];

const outPath = path.join(__dirname, '..', 'public', 'data', 'dictation_sentences.json');
fs.writeFileSync(outPath, JSON.stringify(DICTATION_DATA, null, 2), 'utf8');
console.log(`✓ Successfully generated ${DICTATION_DATA.length} dictation sentences at ${outPath}`);
