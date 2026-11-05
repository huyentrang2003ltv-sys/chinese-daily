// scripts/expand_practice_bank.js
// Generates and merges comprehensive 4-skills practice questions into public/data/practice.json
const fs = require('fs');
const path = require('path');

const practicePath = path.join(__dirname, '..', 'public', 'data', 'practice.json');
const existing = JSON.parse(fs.readFileSync(practicePath, 'utf8'));

// High quality curated question templates per HSK level and skill
const newQuestions = [
  // ==================== HSK 1 ====================
  // LISTENING
  {
    id: "hsk1_listen_qa_2",
    level: 1,
    skill: "listening",
    subType: "listening_qa",
    category: "Nghe hiểu hội thoại ngắn",
    title: "Hỏi tuổi và sinh nhật",
    audioText: "男：你的女儿今年几岁了？女：她今年五岁了，非常可爱。",
    passageText: "男：你的女儿今年几岁了？\n女：她今年五岁了，非常可爱。",
    pinyin: "Nán: Nǐ de nǚ'ér jīnnián jǐ suì le? Nǚ: Tā jīnnián wǔ suì le, fēicháng kě'ài.",
    vietnamese: "Nam: Con gái của bạn năm nay mấy tuổi rồi? Nữ: Bé năm nay năm tuổi rồi, rất đáng yêu.",
    question: "问：女儿今年几岁？(Hỏi: Con gái năm nay mấy tuổi?)",
    options: [
      { text: "五岁 (wǔ suì - 5 tuổi)", isCorrect: true },
      { text: "四岁 (sì suì - 4 tuổi)", isCorrect: false },
      { text: "六岁 (liù suì - 6 tuổi)", isCorrect: false },
      { text: "三岁 (sān suì - 3 tuổi)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 五岁 (wǔ suì).\n• Người nữ trả lời trực tiếp: 「她今年五岁了」 (Bé năm nay 5 tuổi rồi)."
  },
  {
    id: "hsk1_listen_qa_3",
    level: 1,
    skill: "listening",
    subType: "listening_qa",
    category: "Nghe hiểu hội thoại ngắn",
    title: "Mua sắm hoa quả",
    audioText: "男：请问，这个苹果多少钱一斤？女：三块钱一斤，很甜。",
    passageText: "男：请问，这个苹果多少钱一斤？\n女：三块钱一斤，很甜。",
    pinyin: "Nán: Qǐngwèn, zhè ge píngguǒ duōshao qián yì jīn? Nǚ: Sān kuài qián yì jīn, hěn tián.",
    vietnamese: "Nam: Xin hỏi, táo này bao nhiêu tiền một cân? Nữ: Ba tệ một cân, ngọt lắm.",
    question: "问：苹果多少钱一斤？(Hỏi: Táo bao nhiêu tiền một cân?)",
    options: [
      { text: "三块 (sān kuài - 3 tệ)", isCorrect: true },
      { text: "五块 (wǔ kuài - 5 tệ)", isCorrect: false },
      { text: "十块 (shí kuài - 10 tệ)", isCorrect: false },
      { text: "两块 (liǎng kuài - 2 tệ)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 三块 (sān kuài).\n• Người bán hàng đáp: 「三块钱一斤」 (3 tệ một cân)."
  },
  {
    id: "hsk1_listen_qa_4",
    level: 1,
    skill: "listening",
    subType: "listening_qa",
    category: "Nghe hiểu hội thoại ngắn",
    title: "Thời tiết hôm nay",
    audioText: "男：今天天气怎么样？冷不冷？女：今天不冷，很暖和。",
    passageText: "男：今天天气怎么样？冷不冷？\n女：今天不冷，很暖和。",
    pinyin: "Nán: Jīntiān tiānqì zěnmeyàng? Lěng bù lěng? Nǚ: Jīntiān bù lěng, hěn nuǎnhuo.",
    vietnamese: "Nam: Hôm nay thời tiết thế nào? Có lạnh không? Nữ: Hôm nay không lạnh, rất ấm áp.",
    question: "问：今天天气怎么样？(Hỏi: Thời tiết hôm nay thế nào?)",
    options: [
      { text: "不冷 (bù lěng - không lạnh)", isCorrect: true },
      { text: "很冷 (hěn lěng - rất lạnh)", isCorrect: false },
      { text: "下雨 (xià yǔ - mưa)", isCorrect: false },
      { text: "下雪 (xià xuě - tuyết rơi)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 不冷 (bù lěng).\n• Người nữ khẳng định: 「今天不冷，很暖和」."
  },
  {
    id: "hsk1_listen_truefalse_1",
    level: 1,
    skill: "listening",
    subType: "listening_truefalse",
    category: "Nghe hiểu phán đoán Đúng / Sai",
    title: "Phương tiện đi làm",
    audioText: "王先生每天坐出租车去公司上班。",
    passageText: "王先生每天坐出租车去公司上班。",
    pinyin: "Wáng xiānsheng měitiān zuò chūzūchē qù gōngsī shàngbān.",
    vietnamese: "Ông Vương mỗi ngày đều đi taxi đến công ty đi làm.",
    question: "判断正误：王先生坐出租车上班。(Phán đoán Đúng/Sai: Ông Vương đi taxi đi làm.)",
    options: [
      { text: "正确 (Đúng - 正确)", isCorrect: true },
      { text: "错误 (Sai - 错误)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 正确 (Đúng).\n• Câu nghe nói rõ: 「坐出租车去公司上班」."
  },

  // SPEAKING
  {
    id: "hsk1_speak_2",
    level: 1,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Cảm ơn và đáp lại",
    audioText: "不客气，明天见！",
    targetText: "不客气明天见",
    targetPinyin: "Bú kèqi, míngtiān jiàn!",
    vietnamese: "Đừng khách sáo, ngày mai gặp lại!",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: Từ 「不」(bù) khi đứng trước âm tiết mang thanh 4 「客」(kè) sẽ biến điệu thành thanh 2 (bú kèqi)."
  },
  {
    id: "hsk1_speak_3",
    level: 1,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Hỏi địa điểm làm việc",
    audioText: "你在哪儿工作？",
    targetText: "你在哪儿工作",
    targetPinyin: "Nǐ zài nǎr gōngzuò?",
    vietnamese: "Bạn làm việc ở đâu?",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: 「哪儿」(nǎr) có âm uốn lưỡi cuốn nhẹ đầu lưỡi chạm vòm miệng cứng. 「工作」(gōngzuò) thanh 1 đi kèm thanh 4."
  },
  {
    id: "hsk1_speak_4",
    level: 1,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Hỏi thời gian",
    audioText: "现在几点了？",
    targetText: "现在几点了",
    targetPinyin: "Xiànzài jǐ diǎn le?",
    vietnamese: "Bây giờ mấy giờ rồi?",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: 「现在」(xiànzài) đều là thanh 4 dứt khoát. 「几点」(jǐ diǎn) hai thanh 3 đi liền nhau, chữ 「几」(jǐ) biến điệu thành thanh 2 (jí diǎn)."
  },
  {
    id: "hsk1_speak_5",
    level: 1,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Bày tỏ sở thích ăn uống",
    audioText: "我很喜欢吃中国菜。",
    targetText: "我很喜欢吃中国菜",
    targetPinyin: "Wǒ hěn xǐhuan chī Zhōngguó cài.",
    vietnamese: "Tôi rất thích ăn món Trung Quốc.",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: Cụm ba thanh 3 「我很喜」(wǒ hěn xǐ) đọc biến điệu tự nhiên: wó hén xǐhuan. Âm 「吃」(chī) bật hơi cong lưỡi."
  },

  // READING
  {
    id: "hsk1_read_main_2",
    level: 1,
    skill: "reading",
    subType: "reading_main_idea",
    category: "Đọc hiểu tìm ý chính",
    title: "Giới thiệu gia đình",
    passageText: "我家有三口人：爸爸、妈妈和我。爸爸是医生，妈妈是老师，我是在校学生。",
    pinyin: "Wǒ jiā yǒu sān kǒu rén: bàba, māma hé wǒ. Bàba shì yīshēng, māma shì lǎoshī, wǒ shì zàixiào xuésheng.",
    vietnamese: "Nhà tôi có 3 người: bố, mẹ và tôi. Bố là bác sĩ, mẹ là giáo viên, tôi là học sinh đang đi học.",
    question: "这段话主要讲什么？(Đoạn văn này chủ yếu nói về điều gì?)",
    options: [
      { text: "我家的三口人和职业 (Gia đình 3 người và nghề nghiệp)", isCorrect: true },
      { text: "我和朋友去医院 (Tôi và bạn đi bệnh viện)", isCorrect: false },
      { text: "爸爸妈妈在买菜 (Bố mẹ đang mua thức ăn)", isCorrect: false },
      { text: "学校有很多老师 (Trường học có rất nhiều thầy cô)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 我家的三口人和职业.\n• Đoạn văn tóm lược thành viên trong gia đình và nghề nghiệp của từng người."
  },
  {
    id: "hsk1_read_qa_1",
    level: 1,
    skill: "reading",
    subType: "reading_qa",
    category: "Đọc hiểu chi tiết",
    title: "Hẹn gặp bạn bè",
    passageText: "大卫：小明，今天晚上你有时间吗？我们一起去看电影吧。小明：对不起，今天晚上我要在家做作业。",
    pinyin: "Dàwèi: Xiǎomíng, jīntiān wǎnshang nǐ yǒu shíjiān ma? Wǒmen yìqǐ qù kàn diànyǐng ba. Xiǎomíng: Duìbuqǐ, jīntiān wǎnshang wǒ yào zài jiā zuò zuòyè.",
    vietnamese: "David: Tiểu Minh, tối nay bạn có rảnh không? Chúng mình cùng đi xem phim nhé. Tiểu Minh: Xin lỗi, tối nay mình phải ở nhà làm bài tập.",
    question: "小明今天晚上要做什么？(Tiểu Minh tối nay làm gì?)",
    options: [
      { text: "在家做作业 (Ở nhà làm bài tập)", isCorrect: true },
      { text: "和大卫去看电影 (Đi xem phim cùng David)", isCorrect: false },
      { text: "去学校看书 (Đến trường đọc sách)", isCorrect: false },
      { text: "去商店买东西 (Đến cửa hàng mua đồ)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 在家做作业.\n• Tiểu Minh nói rõ: 「今天晚上我要在家做作业」."
  },
  {
    id: "hsk1_read_qa_2",
    level: 1,
    skill: "reading",
    subType: "reading_qa",
    category: "Đọc hiểu chi tiết",
    title: "Vật nuôi yêu thích",
    passageText: "桌子下面有一只小猫，它是白色的。小猫正在睡觉，非常漂亮。",
    pinyin: "Zhuōzi xiàmiàn yǒu yì zhī xiǎo māo, tā shì báisè de. Xiǎo māo zhèngzài shuìjiào, fēicháng piàoliang.",
    vietnamese: "Dưới bàn có một con mèo nhỏ, nó màu trắng. Mèo con đang ngủ, vô cùng xinh xắn.",
    question: "小猫在哪儿？(Mèo con đang ở đâu?)",
    options: [
      { text: "桌子下面 (Dưới cái bàn)", isCorrect: true },
      { text: "椅子上面 (Trên cái ghế)", isCorrect: false },
      { text: "房间外面 (Ngoài căn phòng)", isCorrect: false },
      { text: "床上面 (Ở trên giường)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 桌子下面.\n• Câu mở đầu nêu rõ vị trí: 「桌子下面有一只小猫」."
  },

  // WRITING
  {
    id: "hsk1_write_reorder_2",
    level: 1,
    skill: "writing",
    subType: "reorder",
    category: "连词成句 (Sắp xếp trật tự từ)",
    title: "Sắp xếp câu chỉ thời gian",
    question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
    vietnamese: "Ngày mai tôi đi Bắc Kinh.",
    words: ["去北京", "明天", "我"],
    correctOrder: ["我", "明天", "去北京"],
    hanzi: "我明天去北京。",
    pinyin: "Wǒ míngtiān qù Běijīng.",
    explanation: "• Trạng từ thời gian 「明天」 có thể đứng sau chủ ngữ hoặc trước chủ ngữ: 「S + Thời gian + V + O」."
  },
  {
    id: "hsk1_write_reorder_3",
    level: 1,
    skill: "writing",
    subType: "reorder",
    category: "连词成句 (Sắp xếp trật tự từ)",
    title: "Sắp xếp câu chữ 的 (Sở hữu)",
    question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
    vietnamese: "Đây là sách của thầy giáo.",
    words: ["老师的", "这是", "书"],
    correctOrder: ["这是", "老师的", "书"],
    hanzi: "这是老师的书。",
    pinyin: "Zhè shì lǎoshī de shū.",
    explanation: "• Cấu trúc: 「这是 + Định ngữ + 的 + Trung tâm ngữ (Danh từ)」."
  },
  {
    id: "hsk1_write_reorder_4",
    level: 1,
    skill: "writing",
    subType: "reorder",
    category: "连词成句 (Sắp xếp trật tự từ)",
    title: "Sắp xếp câu hỏi số lượng",
    question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
    vietnamese: "Bạn có bao nhiêu quyển sách tiếng Trung?",
    words: ["汉语书", "你有", "多少本"],
    correctOrder: ["你有", "多少本", "汉语书"],
    hanzi: "你有多少本汉语书？",
    pinyin: "Nǐ yǒu duōshao běn Hànyǔ shū?",
    explanation: "• Cấu trúc câu hỏi số lượng: 「Chủ ngữ + 有 + 多少 + Lượng từ + Danh từ」."
  },

  // ==================== HSK 2 ====================
  // LISTENING
  {
    id: "hsk2_listen_qa_2",
    level: 2,
    skill: "listening",
    subType: "listening_qa",
    category: "Nghe hiểu hội thoại thường nhật",
    title: "Chọn món tại nhà hàng",
    audioText: "男：服务员，我们想要两杯咖啡和一份牛肉面。女：好的先生，请您稍等十分钟。",
    passageText: "男：服务员，我们想要两杯咖啡和一份牛肉面。\n女：好的先生，请您稍等十分钟。",
    pinyin: "Nán: Fúwùyuán, wǒmen xiǎng yào liǎng bēi kāfēi hé yí fèn niúròumiàn. Nǚ: Hǎo de xiānsheng, qǐng nín shāoděng shí fēnzhōng.",
    vietnamese: "Nam: Phục vụ ơi, chúng tôi muốn gọi 2 tách cà phê và 1 bát mì bò. Nữ: Vâng thưa anh, xin anh đợi khoảng 10 phút ạ.",
    question: "问：这位男士点了什么？(Hỏi: Người nam này đã gọi món gì?)",
    options: [
      { text: "咖啡和牛肉面 (Cà phê và mì bò)", isCorrect: true },
      { text: "茶和米饭 (Trà và cơm trắng)", isCorrect: false },
      { text: "啤酒和鱼 (Bia và cá)", isCorrect: false },
      { text: "水和面包 (Nước lọc và bánh mì)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 咖啡和牛肉面.\n• Người nam nói rõ: 「两杯咖啡和一份牛肉面」."
  },
  {
    id: "hsk2_listen_qa_3",
    level: 2,
    skill: "listening",
    subType: "listening_qa",
    category: "Nghe hiểu hội thoại thường nhật",
    title: "Hỏi đường đến bưu điện",
    audioText: "男：请问邮局怎么走？女：往前面走五百米，路右边就是。",
    passageText: "男：请问邮局怎么走？\n女：往前面走五百米，路右边就是。",
    pinyin: "Nán: Qǐngwèn yóujú zěnme zǒu? Nǚ: Wǎng qiánmiàn zǒu wǔbǎi mǐ, lù yòubiān jiù shì.",
    vietnamese: "Nam: Xin hỏi bưu điện đi như thế nào? Nữ: Đi về phía trước 500 mét, bên phải đường là tới.",
    question: "问：邮局在哪儿？(Hỏi: Bưu điện ở đâu?)",
    options: [
      { text: "路右边 (Bên phải đường)", isCorrect: true },
      { text: "路左边 (Bên trái đường)", isCorrect: false },
      { text: "后面 (Phía sau)", isCorrect: false },
      { text: "火车站旁边 (Cạnh ga tàu hỏa)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 路右边.\n• Người nữ chỉ dẫn: 「往前面走五百米，路右边就是」."
  },
  {
    id: "hsk2_listen_truefalse_1",
    level: 2,
    skill: "listening",
    subType: "listening_truefalse",
    category: "Nghe hiểu phán đoán Đúng / Sai",
    title: "Thói quen tập thể dục",
    audioText: "我姐姐虽然很忙，但每天早上都坚持跑步半个小时。",
    passageText: "我姐姐虽然很忙，但每天早上都坚持跑步半个小时。",
    pinyin: "Wǒ jiějie suīrán hěn máng, dàn měitiān zǎoshang dōu jiānchí pǎobù bàn ge xiǎoshí.",
    vietnamese: "Chị gái tôi tuy rất bận, nhưng mỗi sáng đều kiên trì chạy bộ nửa tiếng đồng hồ.",
    question: "判断正误：姐姐每天早上跑步。(Phán đoán Đúng/Sai: Chị gái mỗi sáng đều chạy bộ.)",
    options: [
      { text: "正确 (Đúng - 正确)", isCorrect: true },
      { text: "错误 (Sai - 错误)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 正确 (Đúng).\n• Câu nói: 「每天早上都坚持跑步半个小时」."
  },

  // SPEAKING
  {
    id: "hsk2_speak_2",
    level: 2,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Hỏi thăm sức khỏe",
    audioText: "你身体好点儿了吗？",
    targetText: "你身体好点儿了吗",
    targetPinyin: "Nǐ shēntǐ hǎo diǎnr le ma?",
    vietnamese: "Sức khỏe của bạn đã đỡ hơn chút nào chưa?",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: 「身体」(shēntǐ thanh 1 + thanh 3). 「点儿」(diǎnr) uốn lưỡi tự nhiên nhẹ nhàng, biểu thị một chút."
  },
  {
    id: "hsk2_speak_3",
    level: 2,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Đề nghị giúp đỡ",
    audioText: "需要我帮你拿行李吗？",
    targetText: "需要我帮你拿行李吗",
    targetPinyin: "Xūyào wǒ bāng nǐ ná xíngli ma?",
    vietnamese: "Có cần tôi giúp bạn xách hành lý không?",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: 「需要」(xūyào) âm 'x' phát âm bằng cách nâng mặt lưỡi ép nhẹ vào ngạc cứng. 「行李」(xíngli) chữ thứ hai thanh nhẹ."
  },
  {
    id: "hsk2_speak_4",
    level: 2,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Bày tỏ kế hoạch cuối tuần",
    audioText: "这个周末我和朋友去打篮球。",
    targetText: "这个周末我和朋友去打篮球",
    targetPinyin: "Zhè ge zhōumò wǒ hé péngyou qù dǎ lánqiú.",
    vietnamese: "Cuối tuần này tôi cùng bạn bè đi chơi bóng rổ.",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: 「周末」(zhōumò) thanh 1 + thanh 4. 「打篮球」(dǎ lánqiú) chữ 「打」 thanh 3, 「篮」 thanh 2, 「球」 thanh 2."
  },

  // READING
  {
    id: "hsk2_read_qa_1",
    level: 2,
    skill: "reading",
    subType: "reading_qa",
    category: "Đọc hiểu chi tiết",
    title: "Mua vé tàu hỏa",
    passageText: "去上海的火车票已经买好了。因为路有点儿远，所以我们坐下午两点的高铁去。",
    pinyin: "Qù Shànghǎi de huǒchēpiào yǐjīng mǎi hǎo le. Yīnwèi lù yǒudiǎnr yuǎn, suǒyǐ wǒmen zuò xiàwǔ liǎng diǎn de gāotiě qù.",
    vietnamese: "Vé tàu hỏa đi Thượng Hải đã mua xong rồi. Bởi vì đường hơi xa, nên chúng tôi đi chuyến tàu cao tốc lúc 2 giờ chiều.",
    question: "他们什么时候出发？(Họ xuất phát lúc nào?)",
    options: [
      { text: "下午两点 (2 giờ chiều)", isCorrect: true },
      { text: "上午十点 (10 giờ sáng)", isCorrect: false },
      { text: "晚上八点 (8 giờ tối)", isCorrect: false },
      { text: "明天早上 (Sáng mai)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 下午两点.\n• Đoạn văn nêu: 「坐下午两点的高铁去」."
  },
  {
    id: "hsk2_read_qa_2",
    level: 2,
    skill: "reading",
    subType: "reading_qa",
    category: "Đọc hiểu chi tiết",
    title: "Món quà sinh nhật",
    passageText: "今天是小雨的生日。妈妈送给她一块非常漂亮的手表，小雨非常高兴。",
    pinyin: "Jīntiān shì Xiǎoyǔ de shēngrì. Māma sòng gěi tā yí kuài fēicháng piàoliang de shǒubiǎo, Xiǎoyǔ fēicháng gāoxìng.",
    vietnamese: "Hôm nay là sinh nhật Tiểu Vũ. Mẹ tặng cho cô ấy một chiếc đồng hồ đeo tay rất đẹp, Tiểu Vũ vô cùng vui sướng.",
    question: "妈妈送给小雨什么礼物？(Mẹ tặng Tiểu Vũ món quà gì?)",
    options: [
      { text: "一块手表 (Một chiếc đồng hồ)", isCorrect: true },
      { text: "一件衣服 (Một bộ quần áo)", isCorrect: false },
      { text: "一本书 (Một quyển sách)", isCorrect: false },
      { text: "一部手机 (Một chiếc điện thoại)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 一块手表.\n• Trong bài viết: 「送给她一块非常漂亮的手表」."
  },

  // WRITING
  {
    id: "hsk2_write_reorder_2",
    level: 2,
    skill: "writing",
    subType: "reorder",
    category: "连词成句 (Sắp xếp trật tự từ)",
    title: "Sắp xếp câu so sánh 比",
    question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
    vietnamese: "Hôm nay lạnh hơn hôm qua nhiều.",
    words: ["今天", "冷得多", "比昨天"],
    correctOrder: ["今天", "比昨天", "冷得多"],
    hanzi: "今天比昨天冷得多。",
    pinyin: "Jīntiān bǐ zuótiān lěng de duō.",
    explanation: "• Cấu trúc so sánh chữ 比: 「A + 比 + B + Tính từ + 得多 / 多了」."
  },
  {
    id: "hsk2_write_reorder_3",
    level: 2,
    skill: "writing",
    subType: "reorder",
    category: "连词成句 (Sắp xếp trật tự từ)",
    title: "Sắp xếp câu liên kết 因为...所以...",
    question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
    vietnamese: "Vì trời mưa nên tôi không đi đá bóng.",
    words: ["我没去踢足球", "下雨", "因为", "所以"],
    correctOrder: ["因为", "下雨", "所以", "我没去踢足球"],
    hanzi: "因为下雨，所以我没去踢足球。",
    pinyin: "Yīnwèi xiàyǔ, suǒyǐ wǒ méi qù tī zúqiú.",
    explanation: "• Cấu trúc nguyên nhân kết quả: 「因为 + Nguyên nhân, 所以 + Kết quả」."
  },

  // ==================== HSK 3 ====================
  // LISTENING
  {
    id: "hsk3_listen_qa_2",
    level: 3,
    skill: "listening",
    subType: "listening_qa",
    category: "Nghe hiểu đối thoại công sở & đời sống",
    title: "Phỏng vấn xin việc",
    audioText: "男：请问您是从哪所大学毕业的？学什么专业？女：我两年前从北京语言大学毕业，学的是中文专业。",
    passageText: "男：请问您是从哪所大学毕业的？学什么专业？\n女：我两年前从北京语言大学毕业，学的是中文专业。",
    pinyin: "Nán: Qǐngwèn nín shì cóng nǎ suǒ dàxué bìyè de? Xué shénme zhuānyè? Nǚ: Wǒ liǎng nián qián cóng Běijīng Yǔyán Dàxué bìyè, xué de shì Zhōngwén zhuānyè.",
    vietnamese: "Nam: Xin hỏi bạn tốt nghiệp trường đại học nào? Học chuyên ngành gì? Nữ: Tôi tốt nghiệp Đại học Ngôn ngữ Bắc Kinh hai năm trước, chuyên ngành học là tiếng Trung.",
    question: "问：这位女士学什么专业？(Hỏi: Người phụ nữ này học chuyên ngành gì?)",
    options: [
      { text: "中文专业 (Chuyên ngành tiếng Trung)", isCorrect: true },
      { text: "英语专业 (Chuyên ngành tiếng Anh)", isCorrect: false },
      { text: "历史专业 (Chuyên ngành Lịch sử)", isCorrect: false },
      { text: "计算机专业 (Chuyên ngành Tin học)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 中文专业.\n• Người nữ nói: 「学的是中文专业」."
  },
  {
    id: "hsk3_listen_qa_3",
    level: 3,
    skill: "listening",
    subType: "listening_qa",
    category: "Nghe hiểu đối thoại công sở & đời sống",
    title: "Đặt phòng khách sạn",
    audioText: "男：我想预订一间双人房，住两个晚上。女：好的，每晚四百元，包含双人早餐。",
    passageText: "男：我想预订一间双人房，住两个晚上。\n女：好的，每晚四百元，包含双人早餐。",
    pinyin: "Nán: Wǒ xiǎng yùdìng yì jiān shuāngrén fáng, zhù liǎng ge wǎnshang. Nǚ: Hǎo de, měi wǎn sìbǎi yuán, bāohán shuāngrén zǎocān.",
    vietnamese: "Nam: Tôi muốn đặt một phòng đôi, ở hai đêm. Nữ: Vâng được ạ, mỗi đêm 400 tệ, bao gồm bữa sáng cho 2 người.",
    question: "问：房间价格包含什么？(Hỏi: Giá phòng bao gồm dịch vụ gì?)",
    options: [
      { text: "双人早餐 (Bữa sáng cho hai người)", isCorrect: true },
      { text: "机场接送 (Đưa đón sân bay)", isCorrect: false },
      { text: "免费晚餐 (Bữa tối miễn phí)", isCorrect: false },
      { text: "游泳票 (Vé bơi lội)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 双人早餐.\n• Lời thoại người nữ: 「包含双人早餐」."
  },

  // SPEAKING
  {
    id: "hsk3_speak_2",
    level: 3,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Đưa ra lời khuyên",
    audioText: "你最近工作太累了，应该多注意休息。",
    targetText: "你最近工作太累了应该多注意休息",
    targetPinyin: "Nǐ zuìjìn gōngzuò tài lèi le, yīnggāi duō zhùyì xiūxi.",
    vietnamese: "Dạo gần đây bạn làm việc mệt quá rồi, nên chú ý nghỉ ngơi nhiều hơn.",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: 「应该」(yīnggāi) thanh 1 + thanh 1. 「注意」(zhùyì) hai thanh 4 liên tiếp, dứt khoát và rõ ràng."
  },
  {
    id: "hsk3_speak_3",
    level: 3,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Bày tỏ quan điểm cá nhân",
    audioText: "我认为学好外语最重要的是多听多说。",
    targetText: "我认为学好外语最重要的是多听多说",
    targetPinyin: "Wǒ rènwéi xuéhǎo wàiyǔ zuì zhòngyào de shì duō tīng duō shuō.",
    vietnamese: "Tôi cho rằng điều quan trọng nhất khi học tốt ngoại ngữ là nghe nhiều nói nhiều.",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: Cụm 「我认为」(wǒ rènwéi) là khẩu ngữ mở đầu thể hiện quan điểm. 「最重要」(zuì zhòngyào) nhấn giọng rõ ở trọng âm."
  },

  // READING
  {
    id: "hsk3_read_qa_1",
    level: 3,
    skill: "reading",
    subType: "reading_qa",
    category: "Đọc hiểu đoạn văn",
    title: "Văn hóa trà Trung Hoa",
    passageText: "中国人喝茶的历史非常悠久。不仅口渴时喝茶，客人来家里做客时，主人也会热情地泡上一杯好茶表示欢迎。",
    pinyin: "Zhōngguó rén hē chá de lìshǐ fēicháng yōujiǔ. Bùjǐn kǒukě shí hē chá, kèrén lái jiālǐ zuòkè shí, zhǔrén yě huì rèqíng de pào shang yì bēi hǎo chá biǎoshì huānyíng.",
    vietnamese: "Lịch sử uống trà của người Trung Quốc vô cùng lâu đời. Không chỉ uống trà khi khát nước, mà khi khách đến nhà chơi, chủ nhà cũng sẽ nhiệt tình pha một chén trà ngon để tỏ lòng hoan nghênh.",
    question: "客人来家里时，主人通常会做什么？(Khi khách đến nhà, chủ nhà thường làm gì?)",
    options: [
      { text: "热情地泡好茶表示欢迎 (Nhiệt tình pha trà ngon đón khách)", isCorrect: true },
      { text: "请客人喝酒 (Mời khách uống rượu)", isCorrect: false },
      { text: "送给客人贵重礼物 (Tặng khách quà đắt tiền)", isCorrect: false },
      { text: "带客人去饭馆 (Dẫn khách ra nhà hàng)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 热情地泡好茶表示欢迎.\n• Bài đọc chỉ rõ: 「客人来家里做客时，主人也会热情地泡上一杯好茶表示欢迎」."
  },

  // WRITING
  {
    id: "hsk3_write_reorder_2",
    level: 3,
    skill: "writing",
    subType: "reorder",
    category: "连词成句 (Sắp xếp trật tự từ)",
    title: "Sắp xếp câu chữ 把",
    question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
    vietnamese: "Anh ấy đã đặt quyển sách lên bàn.",
    words: ["放", "把书", "他", "在桌子上", "了"],
    correctOrder: ["他", "把书", "放", "在桌子上", "了"],
    hanzi: "他把书放在桌子上了。",
    pinyin: "Tā bǎ shū fàng zài zhuōzi shang le.",
    explanation: "• Cấu trúc câu chữ 把: 「Chủ ngữ + 把 + Tân ngữ + Động từ + Bổ ngữ kết quả/địa điểm (在/到) + 了」."
  },
  {
    id: "hsk3_write_reorder_3",
    level: 3,
    skill: "writing",
    subType: "reorder",
    category: "连词成句 (Sắp xếp trật tự từ)",
    title: "Sắp xếp câu liên kết 不但...而且...",
    question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
    vietnamese: "Cô ấy không những biết nói tiếng Trung mà còn biết viết chữ Hán.",
    words: ["而且会写汉字", "不但会说中文", "她"],
    correctOrder: ["她", "不但会说中文", "而且会写汉字"],
    hanzi: "她不但会说中文，而且会写汉字。",
    pinyin: "Tā búdàn huì shuō Zhōngwén, érqiě huì xiě Hànzì.",
    explanation: "• Cấu trúc tăng tiến: 「Chủ ngữ + 不但... 而且...」 (Không những... mà còn...)."
  },

  // ==================== HSK 4 ====================
  // LISTENING
  {
    id: "hsk4_listen_qa_2",
    level: 4,
    skill: "listening",
    subType: "listening_qa",
    category: "Nghe hiểu đoạn hội thoại công việc & xã hội",
    title: "Kế hoạch quảng cáo sản phẩm",
    audioText: "男：王经理，关于新产品的网络推广方案，我们打算下周一正式上线。女：很好，但务必在上线前做好所有安全测试，确保万无一失。",
    passageText: "男：王经理，关于新产品的网络推广方案，我们打算下周一正式上线。\n女：很好，但务必在上线前做好所有安全测试，确保万无一失。",
    pinyin: "Nán: Wáng jīnglǐ, guānyú xīn chǎnpǐn de wǎngluò tuīguǎng fāng'àn, wǒmen dǎsuàn xià zhōuyī zhèngshì shàngxiàn. Nǚ: Hěn hǎo, dàn wùbì zài shàngxiàn qián zuò hǎo suǒyǒu ānquán cèshì, quèbǎo wànwúyīshī.",
    vietnamese: "Nam: Thưa giám đốc Vương, về phương án quảng bá sản phẩm mới trên mạng, chúng tôi dự định thứ Hai tuần sau sẽ chính thức vận hành. Nữ: Rất tốt, nhưng nhất định phải hoàn tất mọi bài kiểm tra an toàn trước khi lên sóng, đảm bảo vạn phần chu đáo không sai sót.",
    question: "问：王经理要求上线前做什么？(Hỏi: Giám đốc Vương yêu cầu làm gì trước khi lên mạng?)",
    options: [
      { text: "做好安全测试 (Làm tốt kiểm tra an toàn)", isCorrect: true },
      { text: "降低产品价格 (Hạ giá sản phẩm)", isCorrect: false },
      { text: "更换项目负责人 (Thay đổi người phụ trách)", isCorrect: false },
      { text: "推迟到下个月 (Hoãn lại sang tháng sau)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 做好安全测试.\n• Giám đốc Vương dặn: 「务必在上线前做好所有安全测试」."
  },
  {
    id: "hsk4_listen_qa_3",
    level: 4,
    skill: "listening",
    subType: "listening_qa",
    category: "Nghe hiểu đoạn hội thoại công việc & xã hội",
    title: "Kinh nghiệm du lịch tự túc",
    audioText: "男：听说你上个月一个人去云南旅行了？感觉怎么样？女：风景美极了，尤其是当地人的热情和特色小吃，让我印象深刻。",
    passageText: "男：听说你上个月一个人去云南旅行了？感觉怎么样？\n女：风景美极了，尤其是当地人的热情和特色小吃，让我印象深刻。",
    pinyin: "Nán: Tīngshuō nǐ shàng ge yuè yí ge rén qù Yúnnán lǚxíng le? Gǎnjué zěnmeyàng? Nǚ: Fēngjǐng měi jí le, yóuqí shì dāngdì rén de rèqíng hé tèsè xiǎochī, ràng wǒ yìnxiàng shēnkè.",
    vietnamese: "Nam: Nghe nói tháng trước bạn đi du lịch một mình ở Vân Nam à? Cảm giác thế nào? Nữ: Cảnh sắc đẹp vô cùng, đặc biệt là sự hiếu khách của người dân địa phương và các món ăn vặt đặc sắc khiến mình ấn tượng sâu sắc.",
    question: "问：什么让这位女士印象深刻？(Hỏi: Điều gì khiến người phụ nữ ấn tượng sâu sắc?)",
    options: [
      { text: "当地人的热情和特色小吃 (Sự nhiệt tình và món ăn đặc sắc)", isCorrect: true },
      { text: "昂贵的酒店费用 (Chi phí khách sạn đắt đỏ)", isCorrect: false },
      { text: "交通非常不方便 (Giao thông rất bất tiện)", isCorrect: false },
      { text: "复杂的天气变化 (Thời tiết thay đổi phức tạp)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 当地人的热情和特色小吃.\n• Lời thoại người nữ: 「尤其是当地人的热情和特色小吃，让我印象深刻」."
  },

  // SPEAKING
  {
    id: "hsk4_speak_2",
    level: 4,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Thuyết trình và lập luận",
    audioText: "面对困难时，坚持往往比能力更为关键。",
    targetText: "面对困难时坚持往往比能力更为关键",
    targetPinyin: "Miànduì kùnnan shí, jiānchí wǎngwǎng bǐ nénglì gèng wéi guānjiàn.",
    vietnamese: "Khi đối mặt với khó khăn, sự kiên trì thường mang tính then chốt hơn cả năng lực.",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: 「困难」(kùnnan) âm sau đọc nhẹ. 「坚持」(jiānchí) thanh 1 + thanh 2 bật hơi âm 'ch'. 「关键」(guānjiàn) thanh 1 + thanh 4."
  },
  {
    id: "hsk4_speak_3",
    level: 4,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Thương lượng và đàm phán",
    audioText: "如果贵公司能提供技术支持，我们愿意长期合作。",
    targetText: "如果贵公司能提供技术支持我们愿意长期合作",
    targetPinyin: "Rúguǒ guì gōngsī néng tígōng jìshù zhīchí, wǒmen yuànyì chángqī hézuò.",
    vietnamese: "Nếu quý công ty có thể cung cấp hỗ trợ kỹ thuật, chúng tôi sẵn lòng hợp tác lâu dài.",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: Câu đàm phán thương mại chuẩn mực. Chú ý ngắt nghỉ sau vế điều kiện 「提供技术支持」(tígōng jìshù zhīchí)."
  },

  // READING
  {
    id: "hsk4_read_qa_1",
    level: 4,
    skill: "reading",
    subType: "reading_qa",
    category: "Đọc hiểu nghị luận & xã hội",
    title: "Ý nghĩa của việc đọc sách",
    passageText: "现代社会节奏很快，许多人忙于工作而忽略了阅读。事实上，每天抽出半小时静心读书，不仅能开拓视野，更能帮助我们缓解压力，保持内心的平静。",
    pinyin: "Xiàndài shèhuì jiézòu hěn kuài, xǔduō rén máng yú gōngzuò ér hūlüè le yuèdú. Shìshí shang, měitiān chōuchū bàn xiǎoshí jìngxīn dúshū, bùjǐn néng kāituò shìyě, gèng néng bāngzhù wǒmen huǎnjiě yālì, bǎochí nèixīn de píngjìng.",
    vietnamese: "Nhịp sống xã hội hiện đại rất nhanh, nhiều người bận rộn với công việc mà lơ là việc đọc sách. Trên thực tế, mỗi ngày dành ra nửa giờ tĩnh tâm đọc sách không chỉ mở rộng tầm nhìn, mà còn giúp chúng ta giải tỏa áp lực và duy trì sự bình yên trong nội tâm.",
    question: "根据这段话，每天静心读书有什么好处？(Theo đoạn văn, đọc sách mỗi ngày có ích lợi gì?)",
    options: [
      { text: "开拓视野并缓解压力 (Mở rộng tầm mắt và giải tỏa áp lực)", isCorrect: true },
      { text: "提高跑步速度 (Tăng tốc độ chạy bộ)", isCorrect: false },
      { text: "增加工作薪水 (Tăng lương bổng)", isCorrect: false },
      { text: "减少睡眠时间 (Giảm thời gian ngủ)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 开拓视野并缓解压力.\n• Bài viết khẳng định: 「不仅能开拓视野，更能帮助我们缓解压力」."
  },

  // WRITING
  {
    id: "hsk4_write_reorder_2",
    level: 4,
    skill: "writing",
    subType: "reorder",
    category: "连词成句 (Sắp xếp trật tự từ)",
    title: "Sắp xếp câu chữ 被 (Bị động)",
    question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
    vietnamese: "Máy tính của tôi đã bị em trai làm hỏng rồi.",
    words: ["弄坏了", "被弟弟", "我的电脑"],
    correctOrder: ["我的电脑", "被弟弟", "弄坏了"],
    hanzi: "我的电脑被弟弟弄坏了。",
    pinyin: "Wǒ de diànnǎo bèi dìdi nòng huài le.",
    explanation: "• Cấu trúc câu bị động chữ 被: 「Chủ ngữ (vật chịu tác động) + 被 + Tác nhân + Động từ + Thành phần khác」."
  },
  {
    id: "hsk4_write_reorder_3",
    level: 4,
    skill: "writing",
    subType: "reorder",
    category: "连词成句 (Sắp xếp trật tự từ)",
    title: "Sắp xếp câu đảo ngữ tân ngữ với 把",
    question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
    vietnamese: "Xin hãy nộp bản báo cáo này trước thứ Sáu.",
    words: ["请把", "周五前", "交上来", "这份报告"],
    correctOrder: ["请把", "这份报告", "周五前", "交上来"],
    hanzi: "请把这份报告周五前交上来。",
    pinyin: "Qǐng bǎ zhè fèn bàogào zhōuwǔ qián jiāo shànglái.",
    explanation: "• Cấu trúc câu mệnh lệnh chữ 把: 「请把 + Tân ngữ + Thời gian + Động từ + Bổ ngữ xu hướng」."
  },

  // ==================== HSK 5 ====================
  // LISTENING
  {
    id: "hsk5_listen_qa_2",
    level: 5,
    skill: "listening",
    subType: "listening_qa",
    category: "Nghe hiểu chuyên sâu & Báo cáo",
    title: "Chiến lược chuyển đổi số doanh nghiệp",
    audioText: "男：各位董事，我们在过去一年的数字化转型中，通过云计算和智能分析，使得仓储物流周转效率提升了百分之三十五。女：这个成效非常显著，下一步我们要加快客户服务终端的智能化改造。",
    passageText: "男：各位董事，我们在过去一年的数字化转型中，通过云计算和智能分析，使得仓储物流周转效率提升了百分之三十五。\n女：这个成效非常显著，下一步我们要加快客户服务终端的智能化改造。",
    pinyin: "Nán: Gèwèi dǒngshì, wǒmen zài guòqù yì nián de shùzìhuà zhuǎnxíng zhōng, tōngguò yúnjìsuàn hé zhìnéng fēnxī, shǐdé cāngchǔ wùliú zhōuzhuǎn xiàolǜ tíshēng le bǎifēnzhī sānshíwǔ. Nǚ: Zhè ge chéngxiào fēicháng xiǎnzhù, xià yí bù wǒmen yào jiākuài kèhù fúwù duānzhuāng de zhìnénghuà gǎizào.",
    vietnamese: "Nam: Thưa các quý vị thành viên hội đồng quản trị, trong công cuộc chuyển đổi số một năm qua, thông qua điện toán đám mây và phân tích thông minh, chúng ta đã giúp hiệu suất quay vòng kho vận tăng lên 35%. Nữ: Thành quả này rất nổi bật, bước tiếp theo chúng ta cần đẩy nhanh cải tạo thông minh ở các đầu mối dịch vụ khách hàng.",
    question: "问：数字化转型取得了什么具体成效？(Hỏi: Việc chuyển đổi số đã thu được hiệu quả cụ thể gì?)",
    options: [
      { text: "仓储物流周转效率提升了35% (Hiệu suất kho vận tăng 35%)", isCorrect: true },
      { text: "全体员工工资翻倍 (Lương toàn thể nhân viên tăng gấp đôi)", isCorrect: false },
      { text: "关闭了所有线下门店 (Đóng cửa toàn bộ cửa hàng trực tiếp)", isCorrect: false },
      { text: "减少了百分之五十的研发投入 (Cắt giảm 50% chi phí R&D)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 仓储物流周转效率提升了35%.\n• Số liệu được nêu trực tiếp và chính xác trong báo cáo."
  },

  // SPEAKING
  {
    id: "hsk5_speak_2",
    level: 5,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Diễn thuyết truyền cảm hứng",
    audioText: "真正的智慧，不在于知晓所有答案，而在于懂得提出深刻的问题。",
    targetText: "真正的智慧不在于知晓所有答案而在于懂得提出深刻的问题",
    targetPinyin: "Zhēnzhèng de zhìhuì, bú zàiyú zhīxiǎo suǒyǒu dá'àn, ér zàiyú dǒngdé tíchū shēnkè de wèntí.",
    vietnamese: "Trí tuệ chân chính không nằm ở chỗ biết hết mọi đáp án, mà nằm ở việc biết cách đặt ra những câu hỏi sâu sắc.",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: Mẫu câu đối lập chuẩn văn viết: 「不在于... 而在于...」(Không nằm ở... mà ở...). Yêu cầu ngữ điệu trầm ấm, dứt khoát ở các từ then chốt 「智慧」(zhìhuì), 「深刻」(shēnkè)."
  },

  // READING
  {
    id: "hsk5_read_qa_1",
    level: 5,
    skill: "reading",
    subType: "reading_qa",
    category: "Đọc hiểu văn hóa & Triết lý",
    title: "Triết lý Đạo Đức Kinh: Thượng thiện nhược thủy",
    passageText: "老子在《道德经》中写道：“上善若水，水善利万物而不争。”水滋养万物却从不夸耀功劳，总是处在众人不愿停留的低处。这种谦逊包容、顺应自然的品质，千百年来一直被中国人奉为人格修养的崇高境界。",
    pinyin: "Lǎozǐ zài 《Dàodé Jīng》 zhōng xiě dào: “Shàng shàn ruò shuǐ, shuǐ shàn lì wànwù ér bù zhēng.” Shuǐ zīyǎng wànwù què cóng bù kuāyào gōngláo, zǒngshì chǔ zài zhòngrén bú yuàn tíngliú de dīchù. Zhè zhǒng qiānxùn bāoróng, shùnyìng zìrán de pǐnzhì, qiānbǎi nián lái yìzhí bèi Zhōngguó rén fèng wéi réngé xiūyǎng de chónggāo jìngjiè.",
    vietnamese: "Lão Tử trong cuốn 'Đạo Đức Kinh' đã viết: 'Thượng thiện nhược thủy, thủy thiện lợi vạn vật nhi bất tranh' (Điều thiện tột cùng giống như nước, nước làm lợi cho vạn vật mà chẳng tranh giành). Nước nuôi dưỡng muôn loài nhưng chưa bao giờ khoe khoang công lao, luôn khiêm nhường ở chỗ trũng mà người đời không muốn ở lại. Phẩm chất khiêm cung, bao dung, thuận theo tự nhiên này suốt hàng ngàn năm qua luôn được người Trung Hoa tôn vinh là cảnh giới cao quý của tu dưỡng nhân cách.",
    question: "“上善若水”强调的主要精神品质是什么？(Tinh thần phẩm chất chính mà 'Thượng thiện nhược thủy' nhấn mạnh là gì?)",
    options: [
      { text: "谦逊包容与顺应自然 (Khiêm cung bao dung và thuận theo tự nhiên)", isCorrect: true },
      { text: "勇猛争夺与寸步不让 (Dũng mãnh tranh giành và không nhường nửa bước)", isCorrect: false },
      { text: "追逐名利与炫耀功绩 (Theo đuổi danh lợi và khoe khoang công tích)", isCorrect: false },
      { text: "孤芳自赏与避世隐居 (Tự phụ cô độc và trốn tránh thế sự)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 谦逊包容与顺应自然.\n• Bài luận chỉ rõ: 「这种谦逊包容、顺应自然的品质，千百年来一直被中国人奉为人格修养的崇高境界」."
  },

  // WRITING
  {
    id: "hsk5_write_reorder_2",
    level: 5,
    skill: "writing",
    subType: "reorder",
    category: "连词成句 (Sắp xếp trật tự từ)",
    title: "Sắp xếp câu văn bản học thuật",
    question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
    vietnamese: "Báo cáo này đã phân tích sâu sắc xu thế phát triển kinh tế tương lai.",
    words: ["深刻地", "这份报告", "未来的经济发展趋势", "分析了"],
    correctOrder: ["这份报告", "深刻地", "分析了", "未来的经济发展趋势"],
    hanzi: "这份报告深刻地分析了未来的经济发展趋势。",
    pinyin: "Zhè fèn bàogào shēnkè de fēnxī le wèilái de jīngjì fāzhǎn qūshì.",
    explanation: "• Cấu trúc chuẩn: 「Chủ ngữ + Trạng từ (深刻地) + Động từ + 了 + Cụm tân ngữ phức hợp」."
  },

  // ==================== HSK 6 ====================
  // LISTENING
  {
    id: "hsk6_listen_qa_2",
    level: 6,
    skill: "listening",
    subType: "listening_qa",
    category: "Nghe hiểu học thuật & Diễn đàn kinh tế quốc tế",
    title: "Kinh tế tuần hoàn và phát triển bền vững",
    audioText: "男：在全球碳中和愿景下，单纯依靠末端治理已无法应对严峻的气候挑战。我们必须在全产业链构建闭环式的循环经济模式，将资源消耗与经济增长彻底解耦。女：确实如此，这意味着制造业必须重塑从原材料甄选、工艺改良到产品报废回收的整个生命周期管理体系。",
    passageText: "男：在全球碳中和愿景下，单纯依靠末端治理已无法应对严峻的气候挑战。我们必须在全产业链构建闭环式的循环经济模式，将资源消耗与经济增长彻底解耦。\n女：确实如此，这意味着制造业必须重塑从原材料甄选、工艺改良到产品报废回收的整个生命周期管理体系。",
    pinyin: "Nán: Zài quánqiú tànzhōnghé yuànjǐng xià, dānchún yīkào mòduān zhìlǐ yǐ wúfǎ yìngduì yánjùn de qìhòu tiǎozhàn. Wǒmen bìxū zài quán chǎnyèliàn gòujiàn bìhuánshì de xúnhuán jīngjì móshì, jiāng zīyuán xiāohào yǔ jīngjì zēngzhǎng chèdǐ jiě'ǒu. Nǚ: Quèshí rúcǐ, zhè yìwèizhe zhìzàoyè bìxū chóngshù cóng yuáncáiliào zhēnxuǎn, gōngyì gǎiliáng dào chǎnpǐn bàofèi huíshōu de zhěnggè shēngmìng zhōuqī guǎnlǐ tǐxì.",
    vietnamese: "Nam: Dưới viễn cảnh trung hòa carbon toàn cầu, việc chỉ đơn thuần dựa vào xử lý phần ngọn đã không còn đáp ứng nổi các thách thức khí hậu khắc nghiệt. Chúng ta bắt buộc phải xây dựng mô hình kinh tế tuần hoàn khép kín trên toàn chuỗi công nghiệp, tách rời triệt để mức tiêu hao tài nguyên khỏi tăng trưởng kinh tế. Nữ: Quả đúng như vậy, điều này đồng nghĩa với việc ngành chế tạo phải tái định hình toàn bộ hệ thống quản lý vòng đời từ khâu tuyển chọn nguyên vật liệu, cải tiến công nghệ tới thu hồi phế phẩm.",
    question: "问：对话中强调应对气候挑战的关键举措是什么？(Hỏi: Biện pháp mấu chốt được nhấn mạnh trong đối thoại để ứng phó thách thức khí hậu là gì?)",
    options: [
      { text: "构建闭环循环经济并解耦资源消耗与经济增长 (Xây dựng kinh tế tuần hoàn khép kín)", isCorrect: true },
      { text: "全面停止一切工业制造业生产 (Ngừng toàn bộ sản xuất công nghiệp)", isCorrect: false },
      { text: "仅依靠末端排污治理 (Chỉ phụ thuộc vào xử lý chất thải cuối nguồn)", isCorrect: false },
      { text: "无限度增加化石燃料开采 (Khai thác nhiên liệu hóa thạch không giới hạn)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 构建闭环循环经济并解耦资源消耗与经济增长.\n• Lời thoại nêu rõ giải pháp cốt lõi: 「必须在全产业链构建闭环式的循环经济模式，将资源消耗与经济增长彻底解耦」."
  },

  // SPEAKING
  {
    id: "hsk6_speak_2",
    level: 6,
    skill: "speaking",
    subType: "speaking_shadowing",
    category: "Luyện phát âm & Giao tiếp phản xạ",
    title: "Khẩu ngữ ngoại giao & Luận biện cao cấp",
    audioText: "文明因多样而交流，因交流而互鉴，因互鉴而发展。",
    targetText: "文明因多样而交流因交流而互鉴因互鉴而发展",
    targetPinyin: "Wénmíng yīn duōyàng ér jiāoliú, yīn jiāoliú ér hùjiàn, yīn hùjiàn ér fāzhǎn.",
    vietnamese: "Văn minh vì đa dạng mà giao lưu, vì giao lưu mà học hỏi lẫn nhau, vì học hỏi lẫn nhau mà phát triển.",
    question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
    options: [],
    explanation: "• Điểm lưu ý: Câu châm ngôn triết học văn hóa đối ngẫu đỉnh cao. Cần duy trì nhịp thở vững vàng, ngắt đúng từng phân đoạn điệp từ 「因...而...」 với thanh điệu chuẩn xác."
  },

  // READING
  {
    id: "hsk6_read_qa_1",
    level: 6,
    skill: "reading",
    subType: "reading_qa",
    category: "Đọc hiểu văn nghệ & Khảo cứu",
    title: "Nghệ thuật Thư pháp và Đạo lý hội họa Trung Hoa",
    passageText: "中国书法之所以被誉为“无言之诗，无图之画”，根源在于其以黑白线条的干湿浓淡、疾徐涩畅，具象化地展现了创作者的心性涵养与生命节律。书家笔下的提按转折，不仅是技法的运筹，更暗合天地万物的生克变化。",
    pinyin: "Zhōngguó shūfǎ zhī suǒyǐ bèi yù wéi “wúyán zhī shī, wútú zhī huà”, gēnyuán zàiyú qí yǐ hēibái xiàntiáo de gān shī nóng dàn, jí xú sè chàng, jùxiànghuà de zhǎnxiàn le chuàngzuòzhě de xīnxìng hánhyǎng yǔ shēngmìng jiélǜ. Shūjiā bǐxià de tí àn zhuǎn zhé, bùjǐn shì jìfǎ de yùnchóu, gèng ànhé tiāndì wànwù de shēngkè biànhuà.",
    vietnamese: "Thư pháp Trung Hoa sở dĩ được ngợi ca là 'thơ không lời, họa không hình', căn nguyên là vì nó dùng độ khô ướt, đậm nhạt, nhanh chậm, rít thoát của những đường nét đen trắng để thể hiện một cách cụ tượng phẩm hạnh tâm tính cùng nhịp điệu sinh mệnh của người sáng tạo. Nét nhấn thả, chuyển ngoặt dưới ngòi bút của bậc thư pháp gia không chỉ là sự vận trù kỹ pháp, mà còn thầm ứng hợp với quy luật sinh khắc biến hóa của vạn vật trong trời đất.",
    question: "中国书法被誉为“无言之诗，无图之画”的核心原因是什么？(Nguyên nhân cốt lõi khiến thư pháp Trung Hoa được ví là 'thơ không lời, họa không hình' là gì?)",
    options: [
      { text: "通过黑白线条具象化展现心性涵养与生命节律 (Thể hiện tâm tính và nhịp điệu sinh mệnh qua nét đen trắng)", isCorrect: true },
      { text: "所有毛笔均用最名贵的纯金制成 (Tất cả bút lông đều đúc bằng vàng ròng)", isCorrect: false },
      { text: "只允许在宫廷内部秘传而不外传 (Chỉ lưu truyền bí mật trong hoàng cung)", isCorrect: false },
      { text: "书写时绝对不能使用任何墨汁 (Khi viết tuyệt đối không dùng mực)", isCorrect: false }
    ],
    explanation: "• Đáp án đúng: 通过黑白线条具象化展现心性涵养与生命节律.\n• Bài văn nêu rõ: 「根源在于其以黑白线条的干湿浓淡、疾徐涩畅，具象化地展现了创作者的心性涵养与生命节律」."
  },

  // WRITING
  {
    id: "hsk6_write_reorder_2",
    level: 6,
    skill: "writing",
    subType: "reorder",
    category: "连词成句 (Sắp xếp trật tự từ)",
    title: "Sắp xếp câu nghị luận học thuật HSK 6",
    question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
    vietnamese: "Nghiên cứu này đã làm sáng tỏ cơ chế tác động tương hỗ giữa các biến số.",
    words: ["阐明了", "各项变量之间的", "这项研究", "相互作用机制"],
    correctOrder: ["这项研究", "阐明了", "各项变量之间的", "相互作用机制"],
    hanzi: "这项研究阐明了各项变量之间的相互作用机制。",
    pinyin: "Zhè xiàng yánjiū chǎnmíng le gèxiàng biànliàng zhījiān de xiānghù zuòyòng jīzhì.",
    explanation: "• Cấu trúc câu chuẩn mực văn phong nghiên cứu khoa học HSK 6: 「Chủ ngữ (这项研究) + Vị ngữ (阐明了) + Định ngữ (各项变量之间的) + Trung tâm ngữ (相互作用机制)」."
  }
];

// Append non-duplicate questions
const existingIds = new Set(existing.map(x => x.id));
let addedCount = 0;
for (const q of newQuestions) {
  if (!existingIds.has(q.id)) {
    existing.push(q);
    existingIds.add(q.id);
    addedCount++;
  }
}

fs.writeFileSync(practicePath, JSON.stringify(existing, null, 2), 'utf8');
console.log(`Successfully merged ${addedCount} curated questions. Total questions now: ${existing.length}`);
