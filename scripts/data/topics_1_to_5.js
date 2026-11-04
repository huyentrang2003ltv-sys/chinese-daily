// Topics 1 - 5 (Lessons 1 - 50)
const part1 = require('./dialogues_part1.js'); // Contains lessons 1 - 10

const lessons11to50 = [
  // ==================== TOPIC 2: GIAO TIẾP HÀNG NGÀY (11 - 20) ====================
  {
    id: 'conv_11', number: 11, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 1',
    title: 'Nói về lịch trình một ngày', titleHanzi: '聊聊一天的作息', titlePinyin: 'Liáoliao yì tiān de zuòxī',
    situation: 'Đại Vệ và Minh trao đổi về thời gian biểu sinh hoạt và học tập mỗi ngày.',
    characters: [{ name: 'Đại Vệ', role: 'Bạn học cùng phòng', gender: 'male', avatar: '👨' }, { name: 'Văn Minh', role: 'Sinh viên năm nhất', gender: 'male', avatar: '👦' }],
    dialogue: [
      { speaker: 'Đại Vệ', gender: 'male', hanzi: '文明，你平时每天几点起床？', pinyin: 'Wénmíng, nǐ píngshí měitiān jǐ diǎn qǐchuáng?', vi: 'Văn Minh, bình thường mỗi ngày cậu thức dậy lúc mấy giờ?' },
      { speaker: 'Văn Minh', gender: 'male', hanzi: '我一般早上六点半起床，跑步半个小时，然后去食堂吃早饭。', pinyin: 'Wǒ yìbān zǎoshang liù diǎn bàn qǐchuáng, pǎobù bàn gè xiǎoshí, ránhòu qù shítáng chī zǎofàn.', vi: 'Mình thường dậy lúc 6 rưỡi sáng, chạy bộ nửa tiếng, sau đó đến nhà ăn ăn sáng.' },
      { speaker: 'Đại Vệ', gender: 'male', hanzi: '你起得真早！上午几点开始上课？', pinyin: 'Nǐ qǐ de zhēn zǎo! Shàngwǔ jǐ diǎn kāishǐ shàngkè?', vi: 'Cậu dậy sớm thật đấy! Buổi sáng mấy giờ bắt đầu vào học?' },
      { speaker: 'Văn Minh', gender: 'male', hanzi: '八点上课，中午十二点下课。下午我常常在图书馆自习，晚上十一点睡觉。', pinyin: 'Bā diǎn shàngkè, zhōngwǔ shí’èr diǎn xiàkè. Xiàwǔ wǒ chángcháng zài túshūguǎn zìxí, wǎnshang shíyī diǎn shuìjiào.', vi: '8 giờ vào học, trưa 12 giờ tan học. Buổi chiều mình hay tự học ở thư viện, tối 11 giờ đi ngủ.' }
    ],
    vocabulary: [
      { hanzi: '作息', pinyin: 'zuòxī', meaning: 'sinh hoạt, giờ giấc nghỉ ngơi', hsk: 'HSK 4' },
      { hanzi: '起床', pinyin: 'qǐchuáng', meaning: 'thức dậy', hsk: 'HSK 1' },
      { hanzi: '一般', pinyin: 'yìbān', meaning: 'thông thường, phổ biến', hsk: 'HSK 2' },
      { hanzi: '自习', pinyin: 'zìxí', meaning: 'tự học', hsk: 'HSK 3' }
    ],
    grammar: [
      {
        title: 'Cấu trúc trình tự thời gian: 然后 (Ránhòu - Sau đó)',
        structure: 'Hành động 1, 然后 + Hành động 2',
        explanation: 'Dùng để kết nối hai sự việc diễn ra theo trình tự trước sau.',
        example: { hanzi: '吃完早饭，然后我去上课。', pinyin: 'Chī wán zǎofàn, ránhòu wǒ qù shàngkè.', vi: 'Ăn xong bữa sáng, sau đó tôi đi học.' }
      }
    ],
    quiz: [
      { question: 'Văn Minh thức dậy lúc mấy giờ mỗi sáng?', options: ['6:00', '6:30', '7:00', '7:30'], answer: 1, explanation: 'Minh nói: "我一般早上六点半起床" (6:30).' }
    ],
    speakingPractice: {
      targetHanzi: '我早上六点半起床，晚上十一点睡觉。', targetPinyin: 'Wǒ zǎoshang liù diǎn bàn qǐchuáng, wǎnshang shíyī diǎn shuìjiào.',
      targetVi: 'Tôi thức dậy lúc 6 rưỡi sáng và đi ngủ lúc 11 giờ tối.', tip: 'Chú ý cách đọc số giờ trong tiếng Trung: liù diǎn bàn (6 rưỡi).'
    }
  },
  {
    id: 'conv_12', number: 12, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 1',
    title: 'Hỏi giờ và ngày tháng', titleHanzi: '问时间和日期', titlePinyin: 'Wèn shíjiān hé rìqī',
    situation: 'Lan hỏi thăm bạn cùng lớp về thời gian hiện tại và lịch thi cuối kỳ.',
    characters: [{ name: 'Hương Lan', role: 'Sinh viên', gender: 'female', avatar: '👧' }, { name: 'Tiểu Vũ', role: 'Bạn cùng lớp', gender: 'male', avatar: '👦' }],
    dialogue: [
      { speaker: 'Hương Lan', gender: 'female', hanzi: '小武，请问现在几点了？我的手机没电了。', pinyin: 'Xiǎowǔ, qǐngwèn xiànzài jǐ diǎn le? Wǒ de shǒujī méi diàn le.', vi: 'Tiểu Vũ ơi, xin hỏi bây giờ mấy giờ rồi? Điện thoại mình hết pin rồi.' },
      { speaker: 'Tiểu Vũ', gender: 'male', hanzi: '现在是下午三点一刻。', pinyin: 'Xiànzài shì xiàwǔ sān diǎn yí kè.', vi: 'Bây giờ là 3 giờ 15 phút chiều.' },
      { speaker: 'Hương Lan', gender: 'female', hanzi: '今天星期几？几号？', pinyin: 'Jīntiān xīngqī jǐ? Jǐ hào?', vi: 'Hôm nay là thứ mấy? Ngày mùng mấy vậy cậu?' },
      { speaker: 'Tiểu Vũ', gender: 'male', hanzi: '今天是星期三，十一月四号。怎么了？', pinyin: 'Jīntiān shì xīngqīsān, shíyī yuè sì hào. Zěnme le?', vi: 'Hôm nay là thứ Tư, ngày 4 tháng 11. Sao thế cậu?' },
      { speaker: 'Hương Lan', gender: 'female', hanzi: '下周五我们就要期中考试了，我得抓紧时间复习！', pinyin: 'Xià zhōuwǔ wǒmen jiù yào qīzhōng kǎoshì le, wǒ děi zhuājǐn shíjiān fùxí!', vi: 'Thứ Sáu tuần sau là chúng mình thi giữa kỳ rồi, mình phải tranh thủ thời gian ôn tập thôi!' }
    ],
    vocabulary: [
      { hanzi: '一刻', pinyin: 'yí kè', meaning: '15 phút (1 khắc)', hsk: 'HSK 2' },
      { hanzi: '没电', pinyin: 'méi diàn', meaning: 'hết pin, mất điện', hsk: 'HSK 2' },
      { hanzi: '抓紧', pinyin: 'zhuājǐn', meaning: 'tranh thủ, khẩn trương', hsk: 'HSK 4' },
      { hanzi: '期中考试', pinyin: 'qīzhōng kǎoshì', meaning: 'thi giữa kỳ', hsk: 'HSK 3' }
    ],
    grammar: [
      {
        title: 'Cách diễn đạt thời gian: 刻 (kè - 15 phút)',
        structure: 'Số giờ + 点 + 一刻 (15 phút) / 三刻 (45 phút)',
        explanation: 'Người Trung Quốc thường dùng "一刻" thay cho 15 phút.',
        example: { hanzi: '现在三点一刻。', pinyin: 'Xiànzài sān diǎn yí kè.', vi: 'Bây giờ là 3 giờ 15 phút.' }
      }
    ],
    quiz: [
      { question: '"三点一刻" có nghĩa là mấy giờ?', options: ['3 giờ 5 phút', '3 giờ 15 phút', '3 giờ 30 phút', '3 giờ 45 phút'], answer: 1, explanation: '一刻 = 15 phút, nên 三点一刻 = 3 giờ 15 phút.' }
    ],
    speakingPractice: {
      targetHanzi: '现在几点了？现在是下午三点一刻。', targetPinyin: 'Xiànzài jǐ diǎn le? Xiànzài shì xiàwǔ sān diǎn yí kè.',
      targetVi: 'Bây giờ mấy giờ rồi? Bây giờ là 3 giờ 15 phút chiều.', tip: 'Phát âm "yí kè" biến điệu thanh 2 cho chữ yí.'
    }
  },
  {
    id: 'conv_13', number: 13, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 1',
    title: 'Nói chuyện về thời tiết', titleHanzi: '谈论天气', titlePinyin: 'Tánlùn tiānqì',
    situation: 'Trương Vĩ và Mary nhìn ra ngoài cửa sổ lớp học thảo luận về thời tiết Bắc Kinh hôm nay.',
    characters: [{ name: 'Trương Vĩ', role: 'Sinh viên địa phương', gender: 'male', avatar: '👨' }, { name: 'Mary', role: 'Lưu học sinh', gender: 'female', avatar: '👩' }],
    dialogue: [
      { speaker: 'Mary', gender: 'female', hanzi: '今天外面风好大啊，气温比昨天低多了。', pinyin: 'Jīntiān wàimiàn fēng hǎo dà a, qìwēn bǐ zuótiān dī duō le.', vi: 'Hôm nay gió ngoài trời to quá, nhiệt độ thấp hơn hôm qua nhiều.' },
      { speaker: 'Trương Vĩ', gender: 'male', hanzi: '是啊，天气预报说今天最高气温只有十度，下午可能会下小雨。', pinyin: 'Shì a, tiānqì yùbào shuō jīntiān zuìgāo qìwēn zhǐyǒu shí dù, xiàwǔ kěnéng huì xià xiǎoyǔ.', vi: 'Đúng thế, dự báo thời tiết nói hôm nay nhiệt độ cao nhất chỉ 10 độ, buổi chiều có thể sẽ mưa nhỏ.' },
      { speaker: 'Mary', gender: 'female', hanzi: '幸好我出门前带了伞，还穿了羽绒服。', pinyin: 'Xìnghǎo wǒ chūmén qián dài le sǎn, hái chuān le yǔróngfú.', vi: 'May mà trước khi ra cửa mình đã mang theo ô và mặc cả áo phao lông vũ.' },
      { speaker: 'Trương Vĩ', gender: 'male', hanzi: '北京的秋天就是这样，早晚温差特别大，容易感冒。', pinyin: 'Běijīng de qiūtiān jiù shì zhèyàng, zǎowǎn wēnchā tèbié dà, róngyì gǎnmào.', vi: 'Mùa thu ở Bắc Kinh chính là như vậy, chênh lệch nhiệt độ sáng tối rất lớn, dễ bị cảm cúm.' }
    ],
    vocabulary: [
      { hanzi: '气温', pinyin: 'qìwēn', meaning: 'nhiệt độ không khí', hsk: 'HSK 3' },
      { hanzi: '天气预报', pinyin: 'tiānqì yùbào', meaning: 'dự báo thời tiết', hsk: 'HSK 3' },
      { hanzi: '幸好', pinyin: 'xìnghǎo', meaning: 'may mắn thay', hsk: 'HSK 4' },
      { hanzi: '温差', pinyin: 'wēnchā', meaning: 'chênh lệch nhiệt độ', hsk: 'HSK 4' }
    ],
    grammar: [
      {
        title: 'Mẫu câu biểu thị khả năng: 可能 + 会 (Kěnéng huì)',
        structure: 'Chủ ngữ + 可能 + 会 + Động từ/Hiện tượng',
        explanation: 'Diễn tả dự đoán một sự việc có khả năng cao sẽ xảy ra.',
        example: { hanzi: '下午可能会下雨。', pinyin: 'Xiàwǔ kěnéng huì xià yǔ.', vi: 'Buổi chiều có thể sẽ mưa.' }
      }
    ],
    quiz: [
      { question: 'Dự báo thời tiết nói buổi chiều có thể xảy ra hiện tượng gì?', options: ['Có bão lớn', 'Trời nắng gắt', 'Có thể có mưa nhỏ', 'Tuyết rơi dày'], answer: 2, explanation: 'Trương Vĩ nói: "下午可能会下小雨" (buổi chiều có thể sẽ mưa nhỏ).' }
    ],
    speakingPractice: {
      targetHanzi: '今天天气真冷，下午可能会下雨。', targetPinyin: 'Jīntiān tiānqì zhēn lěng, xiàwǔ kěnéng huì xià yǔ.',
      targetVi: 'Hôm nay thời tiết thật lạnh, buổi chiều có thể sẽ mưa.', tip: 'Chữ "kěnéng" đọc nhẹ thanh 3 và thanh 2 liền mạch.'
    }
  },
  {
    id: 'conv_14', number: 14, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 2',
    title: 'Lên kế hoạch cuối tuần', titleHanzi: '制定周末计划', titlePinyin: 'Zhìdìng zhōumò jìhuà',
    situation: 'Tuấn và Linh bàn bạc xem cuối tuần này nên đi đâu chơi thư giãn sau tuần thi căng thẳng.',
    characters: [{ name: 'Anh Tuấn', role: 'Sinh viên', gender: 'male', avatar: '👱‍♂️' }, { name: 'Thùy Linh', role: 'Sinh viên', gender: 'female', avatar: '👩' }],
    dialogue: [
      { speaker: 'Anh Tuấn', gender: 'male', hanzi: '灵灵，这周末你有安排吗？考试终于结束了，该好好放松一下了！', pinyin: 'Língling, zhè zhōumò nǐ yǒu ānpái ma? Kǎoshì zhōngyú jiéshù le, gāi hǎohǎo fàngsōng yíxià le!', vi: 'Linh Linh, cuối tuần này cậu có kế hoạch gì chưa? Thi cử rốt cuộc cũng xong rồi, nên thả lỏng một chút thôi!' },
      { speaker: 'Thùy Linh', gender: 'female', hanzi: '我目前还没什么计划。你有什么好主意吗？', pinyin: 'Wǒ mùqián hái méi shénme jìhuà. Nǐ yǒu shénme hǎo zhǔyi ma?', vi: 'Hiện tại mình vẫn chưa có kế hoạch gì. Cậu có ý kiến hay nào không?' },
      { speaker: 'Anh Tuấn', gender: 'male', hanzi: '听说故宫最近办了个特别展览，周六我们一起去参观，然后再去王府井吃烤鸭，怎么样？', pinyin: 'Tīngshuō Gùgōng zuìjìn bàn le gè tèbié zhǎnlǎn, zhōuliù wǒmen yìqǐ qù cānguān, ránhòu zài qù Wángfǔjǐng chī kǎoyā, zěnmeyàng?', vi: 'Nghe nói Cố Cung dạo này tổ chức triển lãm đặc biệt, thứ Bảy chúng mình cùng đi tham quan, rồi sau đó đến Vương Phủ Tỉnh ăn vịt quay, thấy thế nào?' },
      { speaker: 'Thùy Linh', gender: 'female', hanzi: '太棒了！故宫的门票需要提前在网上预订，我现在就打开手机买票！', pinyin: 'Tài bàng le! Gùgōng de ménpiào xūyào tíqián zài wǎngshang yùdìng, wǒ xiànzài jiù dǎkāi shǒujī mǎi piào!', vi: 'Tuyệt vời quá! Vé vào Cố Cung cần đặt trước trên mạng, để mình mở điện thoại ra đặt vé ngay bây giờ!' }
    ],
    vocabulary: [
      { hanzi: '放松', pinyin: 'fàngsōng', meaning: 'thả lỏng, thư giãn', hsk: 'HSK 4' },
      { hanzi: '主意', pinyin: 'zhǔyi', meaning: 'ý kiến, ý tưởng', hsk: 'HSK 3' },
      { hanzi: '展览', pinyin: 'zhǎnlǎn', meaning: 'triển lãm', hsk: 'HSK 4' },
      { hanzi: '预订', pinyin: 'yùdìng', meaning: 'đặt trước', hsk: 'HSK 3' }
    ],
    grammar: [
      {
        title: 'Mẫu câu đề xuất kế hoạch: ...怎么样？ (Zěnmeyàng?)',
        structure: 'Mệnh đề đề xuất + 怎么样 / 怎么样？',
        explanation: 'Dùng ở cuối câu để hỏi ý kiến đối phương về một kế hoạch, gợi ý.',
        example: { hanzi: '我们周六去喝咖啡，怎么样？', pinyin: 'Wǒmen zhōuliù qù hē kāfēi, zěnmeyàng?', vi: 'Thứ Bảy bọn mình đi uống cà phê nhé, thấy thế nào?' }
      }
    ],
    quiz: [
      { question: 'Anh Tuấn gợi ý đi đâu tham quan vào thứ Bảy?', options: ['Di Hòa Viên', 'Vạn Lý Trường Thành', 'Cố Cung', 'Thiên Đàn'], answer: 2, explanation: 'Tuấn nói: "周六我们一起去故宫参观" (Thứ Bảy cùng đi Cố Cung tham quan).' }
    ],
    speakingPractice: {
      targetHanzi: '周六我们一起去参观故宫，怎么样？', targetPinyin: 'Zhōuliù wǒmen yìqǐ qù cānguān Gùgōng, zěnmeyàng?',
      targetVi: 'Thứ Bảy chúng mình cùng đi tham quan Cố Cung nhé, thấy thế nào?', tip: 'Giọng điệu ở cuối câu "zěnmeyàng" lên nhẹ nhàng tạo cảm giác thân mật, tôn trọng.'
    }
  },
  {
    id: 'conv_15', number: 15, topicId: 2, topic: '2. Giao tiếp hàng ngày', topicShort: 'Giao tiếp', level: 'HSK 2',
    title: 'Nói về sở thích cá nhân', titleHanzi: '谈论个人爱好', titlePinyin: 'Tánlùn gèrén àihào',
    situation: 'Lý Quân và Thu Hà trò chuyện về những hoạt động yêu thích vào lúc rảnh rỗi.',
    characters: [{ name: 'Lý Quân', role: 'Bạn nam năng động', gender: 'male', avatar: '👨' }, { name: 'Thu Hà', role: 'Bạn nữ yêu nghệ thuật', gender: 'female', avatar: '👩' }],
    dialogue: [
      { speaker: 'Lý Quân', gender: 'male', hanzi: '秋河，你平时业余时间都做些什么？', pinyin: 'Qiūhé, nǐ píngshí yèyú shíjiān dōu zuò xiē shénme?', vi: 'Thu Hà, bình thường thời gian rảnh cậu hay làm những việc gì?' },
      { speaker: 'Thu Hà', gender: 'female', hanzi: '我平时喜欢弹吉他、画国画，偶尔也会练练瑜伽。你呢？', pinyin: 'Wǒ píngshí xǐhuan tán jítā, huà guóhuà, ǒu’ěr yě huì liànlian yújiā. Nǐ ne?', vi: 'Mình thường thích gảy đàn guitar, vẽ tranh thủy mặc, thỉnh thoảng cũng tập yoga. Còn cậu thì sao?' },
      { speaker: 'Lý Quân', gender: 'male', hanzi: '我和你正好相反，我是个运动狂热者！我最喜欢踢足球和攀岩。', pinyin: 'Wǒ hé nǐ zhènghǎo xiāngfǎn, wǒ shì gè yùndòng kuángrè zhě! Wǒ zuì xǐhuan tī zúqiú hé pānyán.', vi: 'Mình thì hoàn toàn ngược lại với cậu, mình là tín đồ cuồng thể thao! Mình thích nhất là đá bóng và leo núi nhân tạo.' },
      { speaker: 'Thu Hà', gender: 'female', hanzi: '难怪你看起来这么有活力！运动能让人保持健康。', pinyin: 'Nánguài nǐ kàn qǐlái zhème yǒu huólì! Yùndòng néng ràng rén bǎochí jiànkāng.', vi: 'Hảo nào trông cậu tràn đầy sức sống như vậy! Vận động giúp con người ta duy trì sức khỏe tốt.' }
    ],
    vocabulary: [
      { hanzi: '业余时间', pinyin: 'yèyú shíjiān', meaning: 'thời gian rảnh rỗi, ngoài giờ', hsk: 'HSK 4' },
      { hanzi: '偶尔', pinyin: 'ǒu’ěr', meaning: 'thỉnh thoảng', hsk: 'HSK 3' },
      { hanzi: '相反', pinyin: 'xiāngfǎn', meaning: 'ngược lại, tương phản', hsk: 'HSK 4' },
      { hanzi: '难怪', pinyin: 'nánguài', meaning: 'thảo nào, chẳng trách', hsk: 'HSK 4' }
    ],
    grammar: [
      {
        title: 'Phó từ chỉ sự thấu hiểu: 难怪 (Nánguài - Thảo nào)',
        structure: '难怪 + [Hiện tượng/Kết quả quan sát được]',
        explanation: 'Dùng khi biết được nguyên nhân của một sự việc và hiểu ra lý do.',
        example: { hanzi: '难怪你这么高兴，原来通过考试了！', pinyin: 'Nánguài nǐ zhème gāoxìng, yuánlái tōngguò kǎoshì le!', vi: 'Thảo nào cậu vui thế, hóa ra là thi đỗ rồi!' }
      }
    ],
    quiz: [
      { question: 'Thu Hà có sở thích nào sau đây?', options: ['Đá bóng và leo núi', 'Gảy guitar và vẽ tranh', 'Chơi game điện tử', 'Lái xe moto'], answer: 1, explanation: 'Thu Hà nói: "我平时喜欢弹吉他、画国画" (thích gảy đàn guitar và vẽ tranh).' }
    ],
    speakingPractice: {
      targetHanzi: '我平时喜欢运动，运动能让人保持健康。', targetPinyin: 'Wǒ píngshí xǐhuan yùndòng, yùndòng néng ràng rén bǎochí jiànkāng.',
      targetVi: 'Bình thường tôi thích thể thao, vận động giúp duy trì sức khỏe.', tip: 'Âm "bǎochí" giữ hơi dài, thanh 3 và thanh 2 dõng dạc.'
    }
  }
];

// Combine full array
const allTopic1to5 = [...part1, ...lessons11to50];
module.exports = allTopic1to5;
