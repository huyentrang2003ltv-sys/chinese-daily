// Comprehensive Dialogue Data for Topics 1-5 (Lessons 1 - 50)
const part1 = require('./dialogues_part1.js'); // 1-10

const lessons11to50 = [
  // 11-15 (from previous draft)
  {
    id: 'conv_11', number: 11, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 1',
    title: 'Nói về lịch trình một ngày', titleHanzi: '聊聊一天的作息', titlePinyin: 'Liáoliao yì tiān de zuòxī',
    situation: 'Đại Vệ và Minh trao đổi về thời gian biểu sinh hoạt và học tập mỗi ngày.',
    characters: [{ name: 'Đại Vệ', role: 'Bạn học cùng phòng', gender: 'male', avatar: '👨' }, { name: 'Văn Minh', role: 'Sinh viên năm nhất', gender: 'male', avatar: '👦' }],
    dialogue: [
      { speaker: 'Đại Vệ', gender: 'male', hanzi: '文明，你平时每天几点起床？', pinyin: 'Wénmíng, nǐ píngshí měitiān jǐ diǎn qǐchuáng?', vi: 'Văn Minh, bình thường mỗi ngày cậu thức dậy lúc mấy giờ?' },
      { speaker: 'Văn Minh', gender: 'male', hanzi: '我一般早上六点半起床，跑步半个小时，然后去食堂吃早饭。', pinyin: 'Wǒ yìbān zǎoshang liù diǎn bàn qǐchuáng, pǎobù bàn gè xiǎoshí, ránhòu qù shítáng chī zǎofàn.', vi: 'Mình thường dậy lúc 6 rưỡi sáng, chạy bộ nửa tiếng, sau đó đến nhà ăn ăn sáng.' },
      { speaker: 'Đại Vệ', gender: 'male', hanzi: '你起得真早！上午几点开始上课？', pinyin: 'Nǐ qǐ de zhēn zǎo! Shàngwǔ jǐ diǎn kāishǐ shàngkè?', vi: 'Cậu dậy sớm thật đấy! Buổi sáng mấy giờ bắt đầu vào học?' },
      { speaker: 'Văn Minh', gender: 'male', hanzi: '八点上课，中午十二点下课。下午常常去图书馆自习，晚上十一点睡觉。', pinyin: 'Bā diǎn shàngkè, zhōngwǔ shí’èr diǎn xiàkè. Xiàwǔ chángcháng qù túshūguǎn zìxí, wǎnshang shíyī diǎn shuìjiào.', vi: '8 giờ vào học, trưa 12 giờ tan học. Chiều hay lên thư viện tự học, tối 11 giờ đi ngủ.' }
    ],
    vocabulary: [
      { hanzi: '作息', pinyin: 'zuòxī', meaning: 'sinh hoạt, giờ giấc', hsk: 'HSK 4' },
      { hanzi: '起床', pinyin: 'qǐchuáng', meaning: 'thức dậy', hsk: 'HSK 1' },
      { hanzi: '然后', pinyin: 'ránhòu', meaning: 'sau đó', hsk: 'HSK 2' },
      { hanzi: '自习', pinyin: 'zìxí', meaning: 'tự học', hsk: 'HSK 3' }
    ],
    grammar: [{ title: 'Trình tự hành động: 然后 (Ránhòu)', structure: 'Hành động 1, 然后 + Hành động 2', explanation: 'Nối hai hành động xảy ra tiếp nối.', example: { hanzi: '吃完早饭，然后我去上课。', pinyin: 'Chī wán zǎofàn, ránhòu wǒ qù shàngkè.', vi: 'Ăn sáng xong, sau đó tôi đi học.' } }],
    quiz: [{ question: 'Văn Minh thức dậy lúc mấy giờ?', options: ['6:00', '6:30', '7:00', '7:30'], answer: 1, explanation: 'Minh nói dậy lúc 六点半 (6:30).' }],
    speakingPractice: { targetHanzi: '我早上六点半起床，晚上十一点睡觉。', targetPinyin: 'Wǒ zǎoshang liù diǎn bàn qǐchuáng, wǎnshang shíyī diǎn shuìjiào.', targetVi: 'Tôi thức dậy lúc 6:30 sáng, 11 giờ tối đi ngủ.', tip: 'Đọc liền mạch "liù diǎn bàn".' }
  },
  {
    id: 'conv_12', number: 12, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 1',
    title: 'Hỏi giờ và ngày tháng', titleHanzi: '问时间和日期', titlePinyin: 'Wèn shíjiān hé rìqī',
    situation: 'Lan hỏi thăm bạn cùng lớp về thời gian hiện tại và lịch thi.',
    characters: [{ name: 'Hương Lan', role: 'Sinh viên', gender: 'female', avatar: '👧' }, { name: 'Tiểu Vũ', role: 'Bạn cùng lớp', gender: 'male', avatar: '👦' }],
    dialogue: [
      { speaker: 'Hương Lan', gender: 'female', hanzi: '小武，请问现在几点了？', pinyin: 'Xiǎowǔ, qǐngwèn xiànzài jǐ diǎn le?', vi: 'Tiểu Vũ ơi, xin hỏi bây giờ mấy giờ rồi?' },
      { speaker: 'Tiểu Vũ', gender: 'male', hanzi: '现在是下午三点一刻。', pinyin: 'Xiànzài shì xiàwǔ sān diǎn yí kè.', vi: 'Bây giờ là 3 giờ 15 phút chiều.' },
      { speaker: 'Hương Lan', gender: 'female', hanzi: '今天星期几？几号？', pinyin: 'Jīntiān xīngqī jǐ? Jǐ hào?', vi: 'Hôm nay là thứ mấy? Ngày mùng mấy vậy?' },
      { speaker: 'Tiểu Vũ', gender: 'male', hanzi: '今天是星期三，十一月四号。下周我们就要期中考试了！', pinyin: 'Jīntiān shì xīngqīsān, shíyī yuè sì hào. Xià zhōu wǒmen jiù yào qīzhōng kǎoshì le!', vi: 'Hôm nay là thứ Tư, ngày 4 tháng 11. Tuần sau chúng mình thi giữa kỳ rồi đó!' }
    ],
    vocabulary: [
      { hanzi: '一刻', pinyin: 'yí kè', meaning: '15 phút', hsk: 'HSK 2' },
      { hanzi: '星期', pinyin: 'xīngqī', meaning: 'tuần, thứ', hsk: 'HSK 1' },
      { hanzi: '期中考试', pinyin: 'qīzhōng kǎoshì', meaning: 'thi giữa kỳ', hsk: 'HSK 3' }
    ],
    grammar: [{ title: 'Thời gian: 刻 (kè - 15 phút)', structure: 'Giờ + 点 + 一刻', explanation: 'Dùng biểu đạt 15 phút.', example: { hanzi: '三点一刻。', pinyin: 'Sān diǎn yí kè.', vi: '3 giờ 15 phút.' } }],
    quiz: [{ question: '"三点一刻" là mấy giờ?', options: ['3:05', '3:15', '3:30', '3:45'], answer: 1, explanation: '一刻 = 15 phút.' }],
    speakingPractice: { targetHanzi: '现在几点了？现在是下午三点一刻。', targetPinyin: 'Xiànzài jǐ diǎn le? Xiànzài shì xiàwǔ sān diǎn yí kè.', targetVi: 'Bây giờ mấy giờ rồi? 3 giờ 15 phút chiều.', tip: 'Biến điệu "yí kè".' }
  },
  {
    id: 'conv_13', number: 13, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 1',
    title: 'Nói chuyện về thời tiết', titleHanzi: '谈论天气', titlePinyin: 'Tánlùn tiānqì',
    situation: 'Trương Vĩ và Mary thảo luận về thời tiết mùa thu Bắc Kinh.',
    characters: [{ name: 'Trương Vĩ', role: 'Sinh viên địa phương', gender: 'male', avatar: '👨' }, { name: 'Mary', role: 'Lưu học sinh', gender: 'female', avatar: '👩' }],
    dialogue: [
      { speaker: 'Mary', gender: 'female', hanzi: '今天外面风好大啊，气温比昨天低多了。', pinyin: 'Jīntiān wàimiàn fēng hǎo dà a, qìwēn bǐ zuótiān dī duō le.', vi: 'Hôm nay gió ngoài trời to quá, nhiệt độ thấp hơn hôm qua nhiều.' },
      { speaker: 'Trương Vĩ', gender: 'male', hanzi: '天气预报说今天最高气温只有十度，下午可能会下小雨。', pinyin: 'Tiānqì yùbào shuō jīntiān zuìgāo qìwēn zhǐyǒu shí dù, xiàwǔ kěnéng huì xià xiǎoyǔ.', vi: 'Dự báo thời tiết nói hôm nay cao nhất chỉ 10 độ, chiều có thể mưa nhỏ.' },
      { speaker: 'Mary', gender: 'female', hanzi: '幸好我穿了羽绒服，还带了伞。', pinyin: 'Xìnghǎo wǒ chuān le yǔróngfú, hái dài le sǎn.', vi: 'May mà mình mặc áo lông vũ và mang theo ô rồi.' },
      { speaker: 'Trương Vĩ', gender: 'male', hanzi: '秋天早晚温差大，一定要多穿衣服，别感冒了。', pinyin: 'Qiūtiān zǎowǎn wēnchā dà, yídìng yào duō chuān yīfu, bié gǎnmào le.', vi: 'Mùa thu nhiệt độ sáng tối chênh lệch lớn, nhất định phải mặc ấm, đừng để cảm lạnh nhé.' }
    ],
    vocabulary: [
      { hanzi: '气温', pinyin: 'qìwēn', meaning: 'nhiệt độ', hsk: 'HSK 3' },
      { hanzi: '天气预报', pinyin: 'tiānqì yùbào', meaning: 'dự báo thời tiết', hsk: 'HSK 3' },
      { hanzi: '温差', pinyin: 'wēnchā', meaning: 'chênh lệch nhiệt độ', hsk: 'HSK 4' }
    ],
    grammar: [{ title: 'Dự đoán: 可能 + 会 (Kěnéng huì)', structure: '可能 + 会 + Động từ', explanation: 'Diễn tả khả năng xảy ra.', example: { hanzi: '下午可能会下雨。', pinyin: 'Xiàwǔ kěnéng huì xià yǔ.', vi: 'Chiều có thể sẽ mưa.' } }],
    quiz: [{ question: 'Dự báo thời tiết nói buổi chiều thế nào?', options: ['Nắng ấm', 'Có thể có mưa nhỏ', 'Tuyết rơi', 'Có bão'], answer: 1, explanation: 'Trương Vĩ nói: 下午可能会下小雨.' }],
    speakingPractice: { targetHanzi: '今天天气真冷，下午可能会下雨。', targetPinyin: 'Jīntiān tiānqì zhēn lěng, xiàwǔ kěnéng huì xià yǔ.', targetVi: 'Hôm nay trời lạnh, chiều có thể mưa.', tip: 'Nhấn nhẹ chữ zhēn.' }
  },
  {
    id: 'conv_14', number: 14, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 2',
    title: 'Lên kế hoạch cuối tuần', titleHanzi: '制定周末计划', titlePinyin: 'Zhìdìng zhōumò jìhuà',
    situation: 'Tuấn và Linh bàn nhau đi tham quan Cố Cung vào thứ Bảy.',
    characters: [{ name: 'Anh Tuấn', role: 'Sinh viên', gender: 'male', avatar: '👱‍♂️' }, { name: 'Thùy Linh', role: 'Sinh viên', gender: 'female', avatar: '👩' }],
    dialogue: [
      { speaker: 'Anh Tuấn', gender: 'male', hanzi: '灵灵，这周末你有安排吗？考试结束了，该放松一下了！', pinyin: 'Língling, zhè zhōumò nǐ yǒu ānpái ma? Kǎoshì jiéshù le, gāi fàngsōng yíxià le!', vi: 'Linh Linh, cuối tuần có kế hoạch gì chưa? Thi xong rồi, xả hơi thôi!' },
      { speaker: 'Thùy Linh', gender: 'female', hanzi: '我目前还没计划，你有什么好主意？', pinyin: 'Wǒ mùqián hái méi jìhuà, nǐ yǒu shénme hǎo zhǔyi?', vi: 'Mình chưa có kế hoạch gì, bạn có ý tưởng gì hay?' },
      { speaker: 'Anh Tuấn', gender: 'male', hanzi: '周六我们去故宫参观，然后再去吃烤鸭，怎么样？', pinyin: 'Zhōuliù wǒmen qù Gùgōng cānguān, ránhòu zài qù chī kǎoyā, zěnmeyàng?', vi: 'Thứ Bảy đi Cố Cung tham quan rồi đi ăn vịt quay nhé, thấy sao?' },
      { speaker: 'Thùy Linh', gender: 'female', hanzi: '太棒了！故宫门票要提前在网上订，我现在就买！', pinyin: 'Tài bàng le! Gùgōng ménpiào yào tíqián zài wǎngshang dìng, wǒ xiànzài jiù mǎi!', vi: 'Tuyệt vời! Vé Cố Cung phải đặt trước online, để mình mua luôn!' }
    ],
    vocabulary: [
      { hanzi: '安排', pinyin: 'ānpái', meaning: 'sắp xếp, kế hoạch', hsk: 'HSK 3' },
      { hanzi: '放松', pinyin: 'fàngsōng', meaning: 'thư giãn', hsk: 'HSK 4' },
      { hanzi: '烤鸭', pinyin: 'kǎoyā', meaning: 'vịt quay', hsk: 'HSK 3' }
    ],
    grammar: [{ title: 'Đề xuất: ...怎么样？ (Zěnmeyàng?)', structure: 'Đề xuất + 怎么样？', explanation: 'Hỏi ý kiến đối phương.', example: { hanzi: '明天去喝咖啡，怎么样？', pinyin: 'Míngtiān qù hē kāfēi, zěnmeyàng?', vi: 'Mai đi cà phê nhé, thấy sao?' } }],
    quiz: [{ question: 'Họ dự định đi đâu vào thứ Bảy?', options: ['Di Hòa Viên', 'Cố Cung', 'Vạn Lý Trường Thành', 'Sở thú'], answer: 1, explanation: 'Họ dự định đi Cố Cung (故宫).' }],
    speakingPractice: { targetHanzi: '周六我们一起去故宫，怎么样？', targetPinyin: 'Zhōuliù wǒmen yìqǐ qù Gùgōng, zěnmeyàng?', targetVi: 'Thứ Bảy cùng đi Cố Cung nhé, thấy sao?', tip: 'Giọng điệu hồ hởi.' }
  },
  {
    id: 'conv_15', number: 15, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 2',
    title: 'Nói về sở thích cá nhân', titleHanzi: '谈论个人爱好', titlePinyin: 'Tánlùn gèrén àihào',
    situation: 'Lý Quân và Thu Hà nói về sở thích thể thao và nghệ thuật.',
    characters: [{ name: 'Lý Quân', role: 'Yêu thể thao', gender: 'male', avatar: '👨' }, { name: 'Thu Hà', role: 'Yêu nghệ thuật', gender: 'female', avatar: '👩' }],
    dialogue: [
      { speaker: 'Lý Quân', gender: 'male', hanzi: '秋河，你平时业余时间都做些什么？', pinyin: 'Qiūhé, nǐ píngshí yèyú shíjiān dōu zuò xiē shénme?', vi: 'Thu Hà, rảnh rỗi cậu hay làm gì?' },
      { speaker: 'Thu Hà', gender: 'female', hanzi: '我喜欢弹吉他、画国画，偶尔练练瑜伽。你呢？', pinyin: 'Wǒ xǐhuan tán jítā, huà guóhuà, ǒu’ěr liànlian yújiā. Nǐ ne?', vi: 'Mình thích gảy guitar, vẽ tranh, thỉnh thoảng tập yoga. Còn cậu?' },
      { speaker: 'Lý Quân', gender: 'male', hanzi: '我最喜欢运动，常踢足球和攀岩。', pinyin: 'Wǒ zuì xǐhuan yùndòng, cháng tī zúqiú hé pānyán.', vi: 'Mình mê thể thao nhất, hay đá bóng và leo núi.' },
      { speaker: 'Thu Hà', gender: 'female', hanzi: '难怪你这么有活力！运动确实对健康很有好处。', pinyin: 'Nánguài nǐ zhème yǒu huólì! Yùndòng quèshí duì jiànkāng hěn yǒu hǎochu.', vi: 'Thảo nào cậu tràn đầy năng lượng! Vận động thật sự rất tốt cho sức khỏe.' }
    ],
    vocabulary: [
      { hanzi: '业余', pinyin: 'yèyú', meaning: 'ngoài giờ, nghiệp dư', hsk: 'HSK 4' },
      { hanzi: '偶尔', pinyin: 'ǒu’ěr', meaning: 'thỉnh thoảng', hsk: 'HSK 3' },
      { hanzi: '好处', pinyin: 'hǎochu', meaning: 'lợi ích, điểm tốt', hsk: 'HSK 3' }
    ],
    grammar: [{ title: 'Cấu trúc đối với: 对...有好处 (Duì... yǒu hǎochu)', structure: 'A + 对 + B + 有好处', explanation: 'A có lợi cho B.', example: { hanzi: '跑步对身体有好处。', pinyin: 'Pǎobù duì shēntǐ yǒu hǎochu.', vi: 'Chạy bộ tốt cho cơ thể.' } }],
    quiz: [{ question: 'Lý Quân có sở thích gì?', options: ['Vẽ tranh', 'Gảy guitar', 'Thể thao (đá bóng, leo núi)', 'Đọc sách'], answer: 2, explanation: 'Lý Quân thích thể thao (踢足球和攀岩).' }],
    speakingPractice: { targetHanzi: '运动对身体很有好处。', targetPinyin: 'Yùndòng duì shēntǐ hěn yǒu hǎochu.', targetVi: 'Thể thao rất tốt cho sức khỏe.', tip: 'Nhấn mạnh "yǒu hǎochu".' }
  },

  // 16. Hỏi thăm gia đình
  {
    id: 'conv_16', number: 16, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 2',
    title: 'Hỏi thăm gia đình', titleHanzi: '问候对方家人', titlePinyin: 'Wènhòu duìfāng jiārén',
    situation: 'Thành gặp lại Minh sau kỳ nghỉ Tết và hỏi thăm gia đình ở Việt Nam.',
    characters: [{ name: 'Thành', role: 'Bạn học', gender: 'male', avatar: '👨' }, { name: 'Minh', role: 'Du học sinh', gender: 'male', avatar: '👦' }],
    dialogue: [
      { speaker: 'Thành', gender: 'male', hanzi: '阿明，假期回越南探亲，叔叔阿姨身体都好吗？', pinyin: 'Ā Míng, jiàqī huí Yuènán tànqīn, shūshu āyí shēntǐ dōu hǎo ma?', vi: 'A Minh, đợt nghỉ về Việt Nam thăm nhà, hai bác sức khỏe đều tốt cả chứ?' },
      { speaker: 'Minh', gender: 'male', hanzi: '托你的福，他们身体都挺硬朗的，还让我给你带了越南咖啡呢！', pinyin: 'Tuō nǐ de fú, tāmen shēntǐ dōu tǐng yìnglang de, hái ràng wǒ gěi nǐ dài le Yuènán kāfēi ne!', vi: 'Nhờ lời chúc của cậu, bố mẹ mình đều rất khỏe mạnh, còn bảo mình mang cà phê Việt Nam cho cậu này!' },
      { speaker: 'Thành', gender: 'male', hanzi: '太感谢叔叔阿姨了！代我向他们问好！', pinyin: 'Tài gǎnxiè shūshu āyí le! Dài wǒ xiàng tāmen wènhǎo!', vi: 'Cảm ơn hai bác nhiều quá! Cho mình gửi lời hỏi thăm sức khỏe tới hai bác nhé!' },
      { speaker: 'Minh', gender: 'male', hanzi: '没问题，我一定转达！', pinyin: 'Méi wèntí, wǒ yídìng zhuǎndá!', vi: 'Không thành vấn đề, mình nhất định sẽ chuyển lời!' }
    ],
    vocabulary: [{ hanzi: '探亲', pinyin: 'tànqīn', meaning: 'thăm người thân', hsk: 'HSK 4' }, { hanzi: '硬朗', pinyin: 'yìnglang', meaning: 'khỏe mạnh (người già)', hsk: 'HSK 4' }, { hanzi: '代我问好', pinyin: 'dài wǒ wènhǎo', meaning: 'thay tôi gửi lời chào', hsk: 'HSK 3' }, { hanzi: '转达', pinyin: 'zhuǎndá', meaning: 'chuyển lời', hsk: 'HSK 4' }],
    grammar: [{ title: 'Gửi lời chào qua ai: 代我向...问好', structure: '代 + 人物A + 向 + 人物B + 问好', explanation: 'Lời nhờ gửi lời chào hỏi lịch sự.', example: { hanzi: '代我向你父母问好。', pinyin: 'Dài wǒ xiàng nǐ fùmǔ wènhǎo.', vi: 'Cho tôi gửi lời hỏi thăm bố mẹ bạn nhé.' } }],
    quiz: [{ question: 'Minh mang gì từ Việt Nam sang tặng Thành?', options: ['Trà sen', 'Cà phê Việt Nam', 'Bánh đậu xanh', 'Nón lá'], answer: 1, explanation: 'Minh mang 越南咖啡 (cà phê Việt Nam).' }],
    speakingPractice: { targetHanzi: '代我向你的父母问好！', targetPinyin: 'Dài wǒ xiàng nǐ de fùmǔ wènhǎo!', targetVi: 'Cho mình gửi lời hỏi thăm bố mẹ cậu nhé!', tip: 'Câu giao tiếp chuẩn mực.' }
  },

  // 17. Kể về cuộc sống hàng ngày
  {
    id: 'conv_17', number: 17, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 2',
    title: 'Kể về cuộc sống hàng ngày', titleHanzi: '分享日常生活', titlePinyin: 'Fēnxiǎng rìcháng shēnghuó',
    situation: 'Mai gọi điện kể cho mẹ nghe về cuộc sống du học hàng ngày ở Bắc Kinh.',
    characters: [{ name: 'Mẹ', role: 'Mẹ ở Việt Nam', gender: 'female', avatar: '👩‍👧' }, { name: 'Thanh Mai', role: 'Con gái du học', gender: 'female', avatar: '👩' }],
    dialogue: [
      { speaker: 'Mẹ', gender: 'female', hanzi: '梅梅，在国外留学生活适应了吗？每天吃得惯吗？', pinyin: 'Méimei, zài guówài liúxué shēnghuó shìyìng le ma? Měitiān chī de guàn ma?', vi: 'Mai Mai, cuộc sống du học nước ngoài con đã thích nghi chưa? Hằng ngày ăn uống có quen không?' },
      { speaker: 'Thanh Mai', gender: 'female', hanzi: '妈，您放心吧！我已经完全适应了。食堂饭菜种类很多，物美价廉。', pinyin: 'Mā, nín fàngxīn ba! Wǒ yǐjīng wánquán shìyìng le. Shítáng fàncài zhǒnglèi hěn duō, wù měi jià lián.', vi: 'Mẹ yên tâm ạ! Con đã hoàn toàn thích nghi rồi. Cơm ở nhà ăn nhiều món lắm, ngon bổ rẻ ạ.' },
      { speaker: 'Mẹ', gender: 'female', hanzi: '那就好，学习紧张吗？室友怎么样？', pinyin: 'Nà jiù hǎo, xuéxí jǐnzhāng ma? Shìyǒu zěnmeyàng?', vi: 'Thế thì tốt, học tập có căng thẳng không? Bạn cùng phòng thế nào?' },
      { speaker: 'Thanh Mai', gender: 'female', hanzi: '学习挺充实的，室友们都特别友善，平时我们还一起做饭呢！', pinyin: 'Xuéxí tǐng chōngshí de, shìyǒu men dōu tèbié yǒushàn, píngshí wǒmen hái yìqǐ zuòfàn ne!', vi: 'Học tập rất phong phú bổ ích mẹ ạ, các bạn cùng phòng đều thân thiện lắm, hay cùng nhau nấu cơm nữa.' }
    ],
    vocabulary: [{ hanzi: '适应', pinyin: 'shìyìng', meaning: 'thích nghi', hsk: 'HSK 3' }, { hanzi: '吃得惯', pinyin: 'chī de guàn', meaning: 'ăn quen khẩu vị', hsk: 'HSK 3' }, { hanzi: '物美价廉', pinyin: 'wù měi jià lián', meaning: 'ngon bổ rẻ', hsk: 'HSK 4' }, { hanzi: '充实', pinyin: 'chōngshí', meaning: 'phong phú, trọn vẹn', hsk: 'HSK 4' }],
    grammar: [{ title: 'Bổ ngữ khả năng quen thuộc: 吃得惯 / 吃不惯', structure: '吃 + 得/不 + 惯', explanation: 'Diễn tả có quen hay không quen khẩu vị thức ăn.', example: { hanzi: '中国菜你吃得惯吗？', pinyin: 'Zhōngguó cài nǐ chī de guàn ma?', vi: 'Món ăn Trung Quốc bạn ăn quen không?' } }],
    quiz: [{ question: 'Thành ngữ nào miêu tả đồ ăn nhà ăn "vừa ngon vừa rẻ"?', options: ['物美价廉', '津津有味', '美味可口', '名不虚传'], answer: 0, explanation: '物美价廉 nghĩa là chất lượng tốt giá cả phải chăng.' }],
    speakingPractice: { targetHanzi: '我已经完全适应这里的日常生活了。', targetPinyin: 'Wǒ yǐjīng wánquán shìyìng zhèlǐ de rìcháng shēnghuó le.', targetVi: 'Tôi đã hoàn toàn thích nghi với đời sống ở đây.', tip: 'Chữ wánquán đọc dứt khoát.' }
  },

  // 18. Trò chuyện qua điện thoại
  {
    id: 'conv_18', number: 18, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 2',
    title: 'Trò chuyện qua điện thoại', titleHanzi: '打手机通话', titlePinyin: 'Dǎ shǒujī tōnghuà',
    situation: 'Lý Hoa gọi điện cho Tuấn hẹn giờ đi thư viện mượn tài liệu.',
    characters: [{ name: 'Lý Hoa', role: 'Người gọi', gender: 'female', avatar: '👩' }, { name: 'Anh Tuấn', role: 'Người nhận', gender: 'male', avatar: '👨' }],
    dialogue: [
      { speaker: 'Lý Hoa', gender: 'female', hanzi: '喂，你好！请问是阿俊吗？', pinyin: 'Wèi, nǐ hǎo! Qǐngwèn shì Ā Jùn ma?', vi: 'A lô, xin chào! Xin hỏi có phải A Tuấn không?' },
      { speaker: 'Anh Tuấn', gender: 'male', hanzi: '喂，李华！是我。找我有什么事吗？', pinyin: 'Wèi, Lǐ Huá! Shì wǒ. Zhǎo wǒ yǒu shénme shì ma?', vi: 'A lô, Lý Hoa à! Mình đây. Tìm mình có việc gì thế?' },
      { speaker: 'Lý Hoa', gender: 'female', hanzi: '你下午有空吗？我想请你一起去图书馆借参考书。', pinyin: 'Nǐ xiàwǔ yǒu kòng ma? Wǒ xiǎng qǐng nǐ yìqǐ qù túshūguǎn jiè cānkǎoshū.', vi: 'Chiều nay cậu rảnh không? Mình muốn rủ cậu cùng đến thư viện mượn sách tham khảo.' },
      { speaker: 'Anh Tuấn', gender: 'male', hanzi: '两点以后我都有空，我们在图书馆南门见，行吗？', pinyin: 'Liǎng diǎn yǐhòu wǒ dōu yǒu kòng, wǒmen zài túshūguǎn nán mén jiàn, xíng ma?', vi: 'Sau 2 giờ mình đều rảnh, bọn mình gặp nhau ở cổng phía Nam thư viện nhé, được không?' },
      { speaker: 'Lý Hoa', gender: 'female', hanzi: '行，那两点半不见不散！拜拜！', pinyin: 'Xíng, nà liǎng diǎn bàn bú jiàn bú sàn! Báibái!', vi: 'Được, vậy 2 rưỡi không gặp không về nha! Bye bye!' }
    ],
    vocabulary: [{ hanzi: '喂', pinyin: 'wèi', meaning: 'a lô (nghe máy)', hsk: 'HSK 1' }, { hanzi: '有空', pinyin: 'yǒu kòng', meaning: 'có thời gian rảnh', hsk: 'HSK 2' }, { hanzi: '参考书', pinyin: 'cānkǎoshū', meaning: 'sách tham khảo', hsk: 'HSK 3' }, { hanzi: '不见不散', pinyin: 'bú jiàn bú sàn', meaning: 'không gặp không về', hsk: 'HSK 3' }],
    grammar: [{ title: 'Lời chào mở đầu cuộc gọi: 喂 (Wèi)', structure: '喂，你好！请问是...吗？', explanation: 'Cách mở lời kinh điển khi nghe và gọi điện thoại.', example: { hanzi: '喂，请问王老师在吗？', pinyin: 'Wèi, qǐngwèn Wáng lǎoshī zài ma?', vi: 'A lô, xin hỏi thầy Vương có ở đó không?' } }],
    quiz: [{ question: 'Hai người hẹn gặp nhau ở đâu?', options: ['Cổng Bắc', 'Cổng Nam thư viện', 'Căn tin', 'Ký túc xá'], answer: 1, explanation: 'Tuấn nói: "我们在图书馆南门见" (cổng Nam thư viện).' }],
    speakingPractice: { targetHanzi: '我们两点半在图书馆见，不见不散！', targetPinyin: 'Wǒmen liǎng diǎn bàn zài túshūguǎn jiàn, bú jiàn bú sàn!', targetVi: '2 rưỡi bọn mình gặp ở thư viện, không gặp không về nhé!', tip: 'Thành ngữ "bú jiàn bú sàn" nói chắc nịch.' }
  },

  // 19. Nhắn tin với bạn bè
  {
    id: 'conv_19', number: 19, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 2',
    title: 'Nhắn tin với bạn bè', titleHanzi: '微信发信息', titlePinyin: 'Wēixìn fā xìnxī',
    situation: 'Hải nhắn tin WeChat hỏi bài tập nhóm và gửi tài liệu cho Mai.',
    characters: [{ name: 'Hải', role: 'Bạn nam trong nhóm', gender: 'male', avatar: '👦' }, { name: 'Thanh Mai', role: 'Trưởng nhóm', gender: 'female', avatar: '👧' }],
    dialogue: [
      { speaker: 'Hải', gender: 'male', hanzi: '在吗？青梅，今天的口语小组作业你写完了吗？', pinyin: 'Zài ma? Qīngméi, jīntiān de kǒuyǔ xiǎozǔ zuòyè nǐ xiě wán le ma?', vi: 'Có đó không? Thanh Mai ơi, bài tập nhóm khẩu ngữ hôm nay cậu đã làm xong chưa?' },
      { speaker: 'Thanh Mai', gender: 'female', hanzi: '在的！我已经做好了PPT，刚在微信群里发了文件，你查收一下。', pinyin: 'Zài de! Wǒ yǐjīng zuò hǎo le PPT, gāng zài Wēixìn qún lǐ fā le wénjiàn, nǐ cháshōu yíxià.', vi: 'Có đây! Mình đã làm xong slide PPT rồi, vừa gửi file trong nhóm WeChat, cậu kiểm tra nhé.' },
      { speaker: 'Hải', gender: 'male', hanzi: '收到！做得很漂亮，太专业了！给你点赞👍！', pinyin: 'Shōudào! Zuò de hěn piàoliang, tài zhuānyè le! Gěi nǐ diǎnzàn!', vi: 'Nhận được rồi! Làm đẹp lắm, chuyên nghiệp quá! Thả like cho cậu nha 👍!' },
      { speaker: 'Thanh Mai', gender: 'female', hanzi: '哈哈，谢谢！要是没问题，明早就由你代表我们小组上台展示啦！', pinyin: 'Hāhā, xièxie! Yàoshi méi wèntí, míngzǎo jiù yóu nǐ dàibiǎo wǒmen xiǎozǔ shàngtái zhǎnshì la!', vi: 'Haha, cảm ơn cậu! Nếu không vấn đề gì thì sáng mai cậu đại diện nhóm lên thuyết trình nha!' }
    ],
    vocabulary: [{ hanzi: '在吗', pinyin: 'zài ma', meaning: 'có đó không (mở lời tin nhắn)', hsk: 'HSK 2' }, { hanzi: '查收', pinyin: 'cháshōu', meaning: 'kiểm tra và nhận', hsk: 'HSK 4' }, { hanzi: '点赞', pinyin: 'diǎnzàn', meaning: 'thả like, bấm thích', hsk: 'HSK 3' }, { hanzi: '展示', pinyin: 'zhǎnshì', meaning: 'thuyết trình, trưng bày', hsk: 'HSK 4' }],
    grammar: [{ title: 'Khẩu ngữ mạng: 点赞 (Diǎnzàn - Thả like)', structure: '给 + Ai + 点赞', explanation: 'Thuật ngữ mạng phổ biến khen ngợi người khác trên mạng xã hội.', example: { hanzi: '为你精彩的表演点赞！', pinyin: 'Wèi nǐ jīngcǎi de biǎoyǎn diǎnzàn!', vi: 'Thả like cho tiết mục tuyệt vời của bạn!' } }],
    quiz: [{ question: 'Thanh Mai đã gửi tài liệu gì vào nhóm WeChat?', options: ['Bài hát MP3', 'File slide PPT', 'Bức ảnh chụp', 'Video ngắn'], answer: 1, explanation: 'Mai nói: "我已经做好了PPT...发了文件".' }],
    speakingPractice: { targetHanzi: '文件发在群里了，请大家查收一下。', targetPinyin: 'Wénjiàn fā zài qún lǐ le, qǐng dàjiā cháshōu yíxià.', targetVi: 'Tài liệu đã gửi vào nhóm, mời mọi người kiểm tra nhé.', tip: 'Cách nói phổ biến khi làm việc nhóm.' }
  },

  // 20. Hỏi thăm tình hình bạn bè
  {
    id: 'conv_20', number: 20, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 2',
    title: 'Hỏi thăm tình hình bạn bè', titleHanzi: '关心朋友近况', titlePinyin: 'Guānxīn péngyou jìnkuàng',
    situation: 'Trương Cường thấy Văn Minh trông hơi mệt mỏi nên lại gần hỏi han, động viên.',
    characters: [{ name: 'Trương Cường', role: 'Bạn tốt', gender: 'male', avatar: '👨' }, { name: 'Văn Minh', role: 'Bạn mệt mỏi', gender: 'male', avatar: '👦' }],
    dialogue: [
      { speaker: 'Trương Cường', gender: 'male', hanzi: '文明，看你脸色不太好，最近是不是遇到什么烦心事了？', pinyin: 'Wénmíng, kàn nǐ liǎnsè bú tài hǎo, zuìjìn shì bú shì yùdào shénme fánxīn shì le?', vi: 'Văn Minh, thấy sắc mặt cậu không tốt lắm, dạo này có phải gặp chuyện gì phiền lòng không?' },
      { speaker: 'Văn Minh', gender: 'male', hanzi: '唉，这几天赶着写毕业论文，连续熬夜，有点吃不消。', pinyin: 'Ài, zhè jǐ tiān gǎnzhe xiě bìyè lùnwén, liánxù áoyè, yǒudiǎnr chībuxiāo.', vi: 'Haizz, mấy hôm nay vội viết khóa luận tốt nghiệp, thức đêm liên tục nên có hơi kiệt sức.' },
      { speaker: 'Trương Cường', gender: 'male', hanzi: '论文虽然重要，但身体是革命的本钱！今晚早点睡，别硬撑着。', pinyin: 'Lùnwén suīrán zhòngyào, dàn shēntǐ shì gémìng de běnqián! Jīnwǎn zǎodiǎn shuì, bié yìng chēngzhe.', vi: 'Khóa luận tuy quan trọng nhưng sức khỏe là vốn quý nhất! Tối nay ngủ sớm đi, đừng gượng ép quá sức.' },
      { speaker: 'Văn Minh', gender: 'male', hanzi: '谢谢你的关心，听你的，我今晚一定好好睡一觉！', pinyin: 'Xièxie nǐ de guānxīn, tīng nǐ de, wǒ jīnwǎn yídìng hǎohāo shuì yí jiào!', vi: 'Cảm ơn cậu đã quan tâm, nghe lời cậu, tối nay mình nhất định sẽ ngủ một giấc thật ngon!' }
    ],
    vocabulary: [{ hanzi: '近况', pinyin: 'jìnkuàng', meaning: 'tình hình dạo gần đây', hsk: 'HSK 4' }, { hanzi: '熬夜', pinyin: 'áoyè', meaning: 'thức khuya, thức trắng đêm', hsk: 'HSK 4' }, { hanzi: '吃不消', pinyin: 'chībuxiāo', meaning: 'không chịu nổi, quá sức', hsk: 'HSK 4' }, { hanzi: '硬撑', pinyin: 'yìng chēng', meaning: 'gượng ép, gắng gượng', hsk: 'HSK 4' }],
    grammar: [{ title: 'Thành ngữ ngạn ngữ: 身体是革命的本钱', structure: '身体是革命的本钱 (Shēntǐ shì gémìng de běnqián)', explanation: 'Khuyên nhủ phải giữ gìn sức khỏe, sức khỏe là vốn quý nhất để làm mọi việc.', example: { hanzi: '别太拼了，身体是革命的本钱。', pinyin: 'Bié tài pīn le, shēntǐ shì gémìng de běnqián.', vi: 'Đừng liều mạng quá, sức khỏe mới là vốn quý nhất.' } }],
    quiz: [{ question: 'Lý do khiến Văn Minh mệt mỏi là gì?', options: ['Bị cảm sốt', 'Thức đêm viết luận văn tốt nghiệp', 'Chạy bộ quá sức', 'Đi du lịch xa'], answer: 1, explanation: 'Minh nói: "赶着写毕业论文，连续熬夜".' }],
    speakingPractice: { targetHanzi: '身体是革命的本钱，一定要注意休息。', targetPinyin: 'Shēntǐ shì gémìng de běnqián, yídìng yào zhùyì xiūxi.', targetVi: 'Sức khỏe là vốn quý nhất, nhất định phải chú ý nghỉ ngơi.', tip: 'Câu khuyên ân cần rất hay dùng.' }
  }
];

module.exports = [...part1, ...lessons11to50];
