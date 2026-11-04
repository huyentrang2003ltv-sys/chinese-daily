// Dialogues Part 1: Topics 1-5 (Lessons 1 - 50)
module.exports = [
  // ==================== TOPIC 1: CHÀO HỎI VÀ GIỚI THIỆU BẢN THÂN (1 - 10) ====================
  {
    id: 'conv_1',
    number: 1,
    topicId: 1,
    topic: '1. Chào hỏi và giới thiệu bản thân',
    topicShort: 'Chào hỏi',
    level: 'HSK 1',
    title: 'Chào hỏi lần đầu gặp mặt',
    titleHanzi: '初次见面问好',
    titlePinyin: 'Chūcì jiànmiàn wènhǎo',
    situation: 'Minh (du học sinh Việt Nam) lần đầu gặp Lý Hoa tại sảnh trường Đại học Bắc Kinh.',
    characters: [
      { name: 'Minh', role: 'Du học sinh Việt Nam', gender: 'male', avatar: '👨‍🎓' },
      { name: 'Lý Hoa', role: 'Sinh viên Trung Quốc', gender: 'female', avatar: '👩‍🎓' }
    ],
    dialogue: [
      { speaker: 'Minh', gender: 'male', hanzi: '你好！请问这是留学生宿舍吗？', pinyin: 'Nǐ hǎo! Qǐngwèn zhè shì liúxuéshēng sùshè ma?', vi: 'Chào bạn! Xin hỏi đây có phải là ký túc xá lưu học sinh không?' },
      { speaker: 'Lý Hoa', gender: 'female', hanzi: '你好！是的，这里就是。你是新来的留学生吧？', pinyin: 'Nǐ hǎo! Shì de, zhèlǐ jiù shì. Nǐ shì xīn lái de liúxuéshēng ba?', vi: 'Chào bạn! Đúng rồi, chính là đây. Bạn là du học sinh mới đến phải không?' },
      { speaker: 'Minh', gender: 'male', hanzi: '对，我是阮文明，来自越南。很高兴认识你！', pinyin: 'Duì, wǒ shì Ruǎn Wénmíng, láizì Yuènán. Hěn gāoxìng rènshi nǐ!', vi: 'Đúng vậy, tôi là Nguyễn Văn Minh, đến từ Việt Nam. Rất vui được làm quen với bạn!' },
      { speaker: 'Lý Hoa', gender: 'female', hanzi: '我叫李华，认识你我也很高兴！欢迎你来中国！', pinyin: 'Wǒ jiào Lǐ Huá, rènshi nǐ wǒ yě hěn gāoxìng! Huānyíng nǐ lái Zhōngguó!', vi: 'Tôi tên là Lý Hoa, quen biết bạn tôi cũng rất vui! Chào mừng bạn đến Trung Quốc!' }
    ],
    vocabulary: [
      { hanzi: '初次', pinyin: 'chūcì', meaning: 'lần đầu tiên', hsk: 'HSK 3' },
      { hanzi: '留学生', pinyin: 'liúxuéshēng', meaning: 'du học sinh', hsk: 'HSK 2' },
      { hanzi: '宿舍', pinyin: 'sùshè', meaning: 'ký túc xá', hsk: 'HSK 2' },
      { hanzi: '来自', pinyin: 'láizì', meaning: 'đến từ', hsk: 'HSK 3' },
      { hanzi: '高兴', pinyin: 'gāoxìng', meaning: 'vui vẻ', hsk: 'HSK 1' }
    ],
    grammar: [
      {
        title: 'Cấu trúc câu hỏi lịch sự: 请问 (Qǐngwèn) + Mệnh đề',
        structure: '请问 + [Nội dung cần hỏi]?',
        explanation: 'Dùng để mở đầu câu hỏi một cách lịch sự, nhã nhặn trong giao tiếp.',
        example: { hanzi: '请问洗手间在哪儿？', pinyin: 'Qǐngwèn xǐshǒujiān zài nǎr?', vi: 'Xin hỏi nhà vệ sinh ở đâu ạ?' }
      },
      {
        title: 'Mẫu câu biểu đạt cảm xúc: 很高兴认识你',
        structure: '很高兴 + 认识 + Người',
        explanation: 'Lời chào xã giao chuẩn mực khi hai người gặp gỡ lần đầu tiên.',
        example: { hanzi: '认识你我也很高兴。', pinyin: 'Rènshi nǐ wǒ yě hěn gāoxìng.', vi: 'Quen biết bạn tôi cũng rất vui.' }
      }
    ],
    quiz: [
      {
        question: 'Minh đến từ quốc gia nào?',
        options: ['Trung Quốc', 'Việt Nam', 'Hàn Quốc', 'Nhật Bản'],
        answer: 1,
        explanation: 'Minh nói: "我是阮文明，来自越南" (Tôi là Nguyễn Văn Minh, đến từ Việt Nam).'
      },
      {
        question: 'Từ nào mang nghĩa "ký túc xá" trong tiếng Trung?',
        options: ['教室', '饭馆', '宿舍', '商店'],
        answer: 2,
        explanation: '宿舍 (sùshè) có nghĩa là ký túc xá.'
      }
    ],
    speakingPractice: {
      targetHanzi: '你好，我是阮文明，很高兴认识你！',
      targetPinyin: 'Nǐ hǎo, wǒ shì Ruǎn Wénmíng, hěn gāoxìng rènshi nǐ!',
      targetVi: 'Chào bạn, tôi là Nguyễn Văn Minh, rất vui được làm quen với bạn!',
      tip: 'Nhấn giọng tự nhiên ở cụm "hěn gāoxìng", âm "rènshi" đọc nhẹ ở chữ shi (thanh nhẹ).'
    }
  },
  {
    id: 'conv_2',
    number: 2,
    topicId: 1,
    topic: '1. Chào hỏi và giới thiệu bản thân',
    topicShort: 'Chào hỏi',
    level: 'HSK 1',
    title: 'Giới thiệu bản thân',
    titleHanzi: '自我介绍',
    titlePinyin: 'Zìwǒ jièshào',
    situation: 'Trong buổi họp lớp đầu năm, Trang đứng lên tự giới thiệu bản thân trước thầy giáo và các bạn.',
    characters: [
      { name: 'Thầy Vương', role: 'Giáo viên chủ nhiệm', gender: 'male', avatar: '👨‍🏫' },
      { name: 'Huyền Trang', role: 'Học viên Việt Nam', gender: 'female', avatar: '👩‍🎓' }
    ],
    dialogue: [
      { speaker: 'Thầy Vương', gender: 'male', hanzi: '下一位同学，请你做一下自我介绍。', pinyin: 'Xià yí wèi tóngxué, qǐng nǐ zuò yíxià zìwǒ jièshào.', vi: 'Bạn học tiếp theo, xin mời em tự giới thiệu một chút.' },
      { speaker: 'Huyền Trang', gender: 'female', hanzi: '老师好，大家好！我叫玄庄，今年二十岁。', pinyin: 'Lǎoshī hǎo, dàjiā hǎo! Wǒ jiào Xuán Zhuāng, jīnnián èrshí suì.', vi: 'Chào thầy, chào cả lớp! Em tên là Huyền Trang, năm nay 20 tuổi.' },
      { speaker: 'Huyền Trang', gender: 'female', hanzi: '我的爱好是听中文歌和看电影。希望能和大家成为好朋友！', pinyin: 'Wǒ de àihào shì tīng zhōngwén gē hé kàn diànyǐng. Xīwàng néng hé dàjiā chéngwéi hǎo péngyou!', vi: 'Sở thích của em là nghe nhạc Trung và xem phim. Rất mong được làm bạn tốt với mọi người!' },
      { speaker: 'Thầy Vương', gender: 'male', hanzi: '很好，汉语发音很标准！请坐吧。', pinyin: 'Hěn hǎo, hànyǔ fāyīn hěn biāozhǔn! Qǐng zuò ba.', vi: 'Rất tốt, phát âm tiếng Trung rất chuẩn! Mời em ngồi.' }
    ],
    vocabulary: [
      { hanzi: '自我介绍', pinyin: 'zìwǒ jièshào', meaning: 'tự giới thiệu', hsk: 'HSK 3' },
      { hanzi: '爱好', pinyin: 'àihào', meaning: 'sở thích', hsk: 'HSK 2' },
      { hanzi: '发音', pinyin: 'fāyīn', meaning: 'phát âm', hsk: 'HSK 3' },
      { hanzi: '标准', pinyin: 'biāozhǔn', meaning: 'tiêu chuẩn, chuẩn mực', hsk: 'HSK 3' }
    ],
    grammar: [
      {
        title: 'Cấu trúc diễn đạt ước muốn: 希望 + 能 (Xīwàng néng)',
        structure: 'Chủ ngữ + 希望 + 能 + Động từ',
        explanation: 'Diễn tả kỳ vọng, ước muốn làm được điều gì đó tích cực.',
        example: { hanzi: '我希望能学好中文。', pinyin: 'Wǒ xīwàng néng xuéhǎo zhōngwén.', vi: 'Tôi hy vọng có thể học tốt tiếng Trung.' }
      }
    ],
    quiz: [
      {
        question: 'Sở thích của Huyền Trang là gì?',
        options: ['Đọc sách và viết chữ', 'Nghe nhạc Trung và xem phim', 'Chạy bộ và bơi lội', 'Đi du lịch và nấu ăn'],
        answer: 1,
        explanation: 'Trang giới thiệu: "我的爱好是听中文歌和看电影".'
      }
    ],
    speakingPractice: {
      targetHanzi: '老师好，我叫玄庄，今年二十岁。',
      targetPinyin: 'Lǎoshī hǎo, wǒ jiào Xuán Zhuāng, jīnnián èrshí suì.',
      targetVi: 'Chào thầy, em tên là Huyền Trang, năm nay 20 tuổi.',
      tip: 'Chữ "èrshí" cong lưỡi rõ ràng ở âm r, suì bật hơi nhẹ thanh 4.'
    }
  },
  {
    id: 'conv_3',
    number: 3,
    topicId: 1,
    topic: '1. Chào hỏi và giới thiệu bản thân',
    topicShort: 'Chào hỏi',
    level: 'HSK 1',
    title: 'Hỏi tên và tuổi',
    titleHanzi: '询问姓名与年龄',
    titlePinyin: 'Xúnwèn xìngmíng yǔ niánlíng',
    situation: 'Trương Cường và Tuấn gặp nhau ở thư viện và làm quen, hỏi tên và tuổi tác.',
    characters: [
      { name: 'Trương Cường', role: 'Sinh viên năm nhất', gender: 'male', avatar: '👨' },
      { name: 'Tuấn', role: 'Học viên trao đổi', gender: 'male', avatar: '👱‍♂️' }
    ],
    dialogue: [
      { speaker: 'Trương Cường', gender: 'male', hanzi: '同学，你好！请问你叫什么名字？', pinyin: 'Tóngxué, nǐ hǎo! Qǐngwèn nǐ jiào shénme míngzi?', vi: 'Chào bạn học! Xin hỏi bạn tên là gì?' },
      { speaker: 'Tuấn', gender: 'male', hanzi: '你好！我姓阮，叫阮英俊。你呢？', pinyin: 'Nǐ hǎo! Wǒ xìng Ruǎn, jiào Ruǎn Yīngjùn. Nǐ ne?', vi: 'Chào bạn! Tôi họ Nguyễn, tên là Nguyễn Anh Tuấn. Còn bạn?' },
      { speaker: 'Trương Cường', gender: 'male', hanzi: '我叫张强。你今年多大了？', pinyin: 'Wǒ jiào Zhāng Qiáng. Nǐ jīnnián duō dà le?', vi: 'Tôi là Trương Cường. Năm nay bạn bao nhiêu tuổi rồi?' },
      { speaker: 'Tuấn', gender: 'male', hanzi: '我今年二十一岁，你也是二十一岁吗？', pinyin: 'Wǒ jīnnián èrshíyī suì, nǐ yě shì èrshíyī suì ma?', vi: 'Năm nay tôi 21 tuổi, bạn cũng 21 tuổi à?' },
      { speaker: 'Trương Cường', gender: 'male', hanzi: '不，我比你大一岁，我二十二岁。', pinyin: 'Bù, wǒ bǐ nǐ dà yí suì, wǒ èrshí’èr suì.', vi: 'Không, mình lớn hơn bạn một tuổi, mình 22 tuổi.' }
    ],
    vocabulary: [
      { hanzi: '姓名', pinyin: 'xìngmíng', meaning: 'họ tên', hsk: 'HSK 2' },
      { hanzi: '年龄', pinyin: 'niánlíng', meaning: 'tuổi tác', hsk: 'HSK 3' },
      { hanzi: '多大', pinyin: 'duō dà', meaning: 'bao nhiêu tuổi (dùng cho thanh niên/bằng vai)', hsk: 'HSK 1' },
      { hanzi: '比', pinyin: 'bǐ', meaning: 'so với', hsk: 'HSK 2' }
    ],
    grammar: [
      {
        title: 'Cấu trúc so sánh hơn: A + 比 + B + Tính từ (+ Số lượng)',
        structure: 'A + 比 + B + 形容词 (+ 差异数量)',
        explanation: 'Dùng để so sánh độ chênh lệch giữa hai đối tượng.',
        example: { hanzi: '我比你大一岁。', pinyin: 'Wǒ bǐ nǐ dà yí suì.', vi: 'Tôi lớn hơn bạn 1 tuổi.' }
      }
    ],
    quiz: [
      {
        question: 'Trương Cường bao nhiêu tuổi?',
        options: ['20 tuổi', '21 tuổi', '22 tuổi', '23 tuổi'],
        answer: 2,
        explanation: 'Tuấn 21 tuổi, Cường lớn hơn Tuấn 1 tuổi nên Cường 22 tuổi (我二十二岁).'
      }
    ],
    speakingPractice: {
      targetHanzi: '你今年多大了？我今年二十一岁。',
      targetPinyin: 'Nǐ jīnnián duō dà le? Wǒ jīnnián èrshíyī suì.',
      targetVi: 'Năm nay bạn bao nhiêu tuổi rồi? Năm nay tôi 21 tuổi.',
      tip: 'Âm "duō dà" đọc rõ thanh 1 và thanh 4 dứt khoát.'
    }
  },
  {
    id: 'conv_4',
    number: 4,
    topicId: 1,
    topic: '1. Chào hỏi và giới thiệu bản thân',
    topicShort: 'Chào hỏi',
    level: 'HSK 1',
    title: 'Giới thiệu quê quán',
    titleHanzi: '介绍家乡与籍贯',
    titlePinyin: 'Jièshào jiāxiāng yǔ jíguàn',
    situation: 'Vương Lực và An trò chuyện trong quán trà về quê hương của mỗi người.',
    characters: [
      { name: 'Vương Lực', role: 'Bạn học người Bắc Kinh', gender: 'male', avatar: '👨' },
      { name: 'An', role: 'Học viên người Đà Nẵng', gender: 'female', avatar: '👩' }
    ],
    dialogue: [
      { speaker: 'Vương Lực', gender: 'male', hanzi: '安安，你的家乡在越南哪里？', pinyin: 'Ān’an, nǐ de jiāxiāng zài Yuènán nǎlǐ?', vi: 'An An, quê hương của bạn ở đâu tại Việt Nam?' },
      { speaker: 'An', gender: 'female', hanzi: '我的家乡是岘港，那是一座美丽的海滨城市。', pinyin: 'Wǒ de jiāxiāng shì Xiàngǎng, nà shì yí zuò měilì de hǎibīn chéngshì.', vi: 'Quê mình là Đà Nẵng, đó là một thành phố ven biển rất xinh đẹp.' },
      { speaker: 'Vương Lực', gender: 'male', hanzi: '我听说过岘港，那里的海滩很有名！气候怎么样？', pinyin: 'Wǒ tīngshuō guo Xiàngǎng, nàlǐ de hǎitān hěn yǒumíng! Qìhòu zěnmeyàng?', vi: 'Mình từng nghe về Đà Nẵng rồi, bãi biển ở đó rất nổi tiếng! Khí hậu thế nào?' },
      { speaker: 'An', gender: 'female', hanzi: '气候很温暖，一年四季都很适合旅游。王力，你是北京本地人吗？', pinyin: 'Qìhòu hěn wēnnuǎn, yì nián sì jì dōu hěn shìhé lǚyóu. Wáng Lì, nǐ shì Běijīng běndì rén ma?', vi: 'Khí hậu rất ấm áp, bốn mùa đều rất thích hợp du lịch. Vương Lực, bạn là người bản địa Bắc Kinh à?' },
      { speaker: 'Vương Lực', gender: 'male', hanzi: '对，我是地道的北京人。欢迎你以后去我家做客！', pinyin: 'Duì, wǒ shì dìdào de Běijīng rén. Huānyíng nǐ yǐhòu qù wǒ jiā zuòkè!', vi: 'Đúng vậy, mình là người Bắc Kinh chính gốc. Rất hoan nghênh bạn sau này đến nhà mình chơi!' }
    ],
    vocabulary: [
      { hanzi: '家乡', pinyin: 'jiāxiāng', meaning: 'quê hương', hsk: 'HSK 3' },
      { hanzi: '海滨', pinyin: 'hǎibīn', meaning: 'ven biển', hsk: 'HSK 4' },
      { hanzi: '气候', pinyin: 'qìhòu', meaning: 'khí hậu', hsk: 'HSK 3' },
      { hanzi: '地道', pinyin: 'dìdào', meaning: 'chính gốc, thuần túy', hsk: 'HSK 4' }
    ],
    grammar: [
      {
        title: 'Mẫu câu nghe nói về điều gì: 听说过 (Tīngshuō guo)',
        structure: 'Chủ ngữ + 听说过 + Danh từ/Sự việc',
        explanation: 'Dùng để biểu thị đã từng nghe người khác nhắc tới địa điểm, sự việc nào đó.',
        example: { hanzi: '我听说过这个地方。', pinyin: 'Wǒ tīngshuō guo zhège dìfang.', vi: 'Tôi từng nghe nói về địa danh này rồi.' }
      }
    ],
    quiz: [
      {
        question: 'Quê hương của An ở đâu?',
        options: ['Hà Nội', 'Đà Nẵng', 'Hồ Chí Minh', 'Hải Phòng'],
        answer: 1,
        explanation: 'An nói: "我的家乡是岘港" (岘港 = Đà Nẵng).'
      }
    ],
    speakingPractice: {
      targetHanzi: '我的家乡是一座美丽的海滨城市。',
      targetPinyin: 'Wǒ de jiāxiāng shì yí zuò měilì de hǎibīn chéngshì.',
      targetVi: 'Quê hương của tôi là một thành phố ven biển xinh đẹp.',
      tip: 'Lượng từ của thành phố là "座" (zuò), phát âm tròn vành rõ chữ.'
    }
  },
  {
    id: 'conv_5',
    number: 5,
    topicId: 1,
    topic: '1. Chào hỏi và giới thiệu bản thân',
    topicShort: 'Chào hỏi',
    level: 'HSK 1',
    title: 'Giới thiệu nghề nghiệp',
    titleHanzi: '介绍职业与工作',
    titlePinyin: 'Jièshào zhíyè yǔ gōngzuò',
    situation: 'Trần Bình và Lan gặp nhau ở một sự kiện giao lưu văn hóa và hỏi thăm về công việc.',
    characters: [
      { name: 'Trần Bình', role: 'Kỹ sư phần mềm', gender: 'male', avatar: '👨‍💻' },
      { name: 'Hương Lan', role: 'Phiên dịch viên tiếng Trung', gender: 'female', avatar: '👩‍💼' }
    ],
    dialogue: [
      { speaker: 'Trần Bình', gender: 'male', hanzi: '你好，香兰！请问你现在从事什么工作？', pinyin: 'Nǐ hǎo, Xiānglán! Qǐngwèn nǐ xiànzài cóngshì shénme gōngzuò?', vi: 'Chào Hương Lan! Xin hỏi hiện tại bạn đang làm nghề gì?' },
      { speaker: 'Hương Lan', gender: 'female', hanzi: '我是一名中文翻译，在一家中越贸易公司上班。陈平，你呢？', pinyin: 'Wǒ shì yì míng zhōngwén fānyì, zài yì jiā Zhōng-Yuè màoyì gōngsī shàngbān. Chén Píng, nǐ ne?', vi: 'Tôi là phiên dịch viên tiếng Trung, làm việc tại một công ty thương mại Trung - Việt. Còn anh Trần Bình?' },
      { speaker: 'Trần Bình', gender: 'male', hanzi: '我是软件工程师，在一家科技公司开发手机软件。', pinyin: 'Wǒ shì ruǎnjiàn gōngchéngshī, zài yì jiā kējì gōngsī kāifā shǒujī ruǎnjiàn.', vi: 'Tôi là kỹ sư phần mềm, phát triển ứng dụng di động tại một công ty công nghệ.' },
      { speaker: 'Hương Lan', gender: 'female', hanzi: '哇，程序员很厉害！平时工作一定很辛苦吧？', pinyin: 'Wā, chéngxùyuán hěn lìhai! Píngshí gōngzuò yídìng hěn xīnkǔ ba?', vi: 'Oa, lập trình viên giỏi thật đấy! Bình thường công việc chắc vất vả lắm nhỉ?' },
      { speaker: 'Trần Bình', gender: 'male', hanzi: '虽然有点忙，但我很喜欢写代码。', pinyin: 'Suīrán yǒudiǎnr máng, dàn wǒ hěn xǐhuan xiě dàimǎ.', vi: 'Tuy có hơi bận rộn, nhưng tôi rất thích viết code.' }
    ],
    vocabulary: [
      { hanzi: '从事', pinyin: 'cóngshì', meaning: 'làm việc trong lĩnh vực, theo nghề', hsk: 'HSK 4' },
      { hanzi: '贸易', pinyin: 'màoyì', meaning: 'thương mại', hsk: 'HSK 4' },
      { hanzi: '软件工程师', pinyin: 'ruǎnjiàn gōngchéngshī', meaning: 'kỹ sư phần mềm', hsk: 'HSK 4' },
      { hanzi: '虽然...但是...', pinyin: 'suīrán... dànshì...', meaning: 'tuy... nhưng...', hsk: 'HSK 2' }
    ],
    grammar: [
      {
        title: 'Cặp liên từ nhượng bộ: 虽然...但是/但...',
        structure: '虽然 + Phân câu 1, 但是/但 + Phân câu 2',
        explanation: 'Dùng để nối hai vế mang ý đối lập hoặc nhượng bộ.',
        example: { hanzi: '工作虽然辛苦，但他很快乐。', pinyin: 'Gōngzuò suīrán xīnkǔ, dàn tā hěn kuàilè.', vi: 'Công việc tuy vất vả nhưng anh ấy rất vui vẻ.' }
      }
    ],
    quiz: [
      {
        question: 'Hương Lan làm công việc gì?',
        options: ['Giáo viên', 'Phiên dịch viên tiếng Trung', 'Kỹ sư phần mềm', 'Bác sĩ'],
        answer: 1,
        explanation: 'Lan nói: "我是一名中文翻译" (Tôi là một phiên dịch viên tiếng Trung).'
      }
    ],
    speakingPractice: {
      targetHanzi: '我是一名中文翻译，在贸易公司上班。',
      targetPinyin: 'Wǒ shì yì míng zhōngwén fānyì, zài màoyì gōngsī shàngbān.',
      targetVi: 'Tôi là một phiên dịch viên tiếng Trung, làm việc ở công ty thương mại.',
      tip: 'Lượng từ danh giá chỉ người nghề nghiệp dùng "名" (míng).'
    }
  },
  {
    id: 'conv_6',
    number: 6,
    topicId: 1,
    topic: '1. Chào hỏi và giới thiệu bản thân',
    topicShort: 'Chào hỏi',
    level: 'HSK 1',
    title: 'Hỏi thăm sức khỏe',
    titleHanzi: '问候身体与健康',
    titlePinyin: 'Wènhòu shēntǐ yǔ jiànkāng',
    situation: 'Tiểu Vũ gặp lại bà Vương hàng xóm và ân cần hỏi thăm sức khỏe của bà.',
    characters: [
      { name: 'Tiểu Vũ', role: 'Thanh niên lễ phép', gender: 'male', avatar: '👦' },
      { name: 'Bà Vương', role: 'Bà lão hàng xóm', gender: 'female', avatar: '👵' }
    ],
    dialogue: [
      { speaker: 'Tiểu Vũ', gender: 'male', hanzi: '王奶奶，早上好！您最近身体怎么样？', pinyin: 'Wáng nǎinai, zǎoshang hǎo! Nín zuìjìn shēntǐ zěnmeyàng?', vi: 'Bà Vương, chào buổi sáng ạ! Dạo này sức khỏe của bà thế nào ạ?' },
      { speaker: 'Bà Vương', gender: 'female', hanzi: '是小武啊！托你的福，我身体挺好的，每天早上都去公园散步。', pinyin: 'Shì Xiǎowǔ a! Tuō nǐ de fú, wǒ shēntǐ tǐng hǎo de, měitiān zǎoshang dōu qù gōngyuán sànbù.', vi: 'Là Tiểu Vũ đấy à! Nhờ phúc của cháu, sức khỏe bà khá tốt, sáng nào bà cũng ra công viên đi dạo.' },
      { speaker: 'Tiểu Vũ', gender: 'male', hanzi: '那就好！这几天天气转凉了，您要多穿点衣服，别着凉了。', pinyin: 'Nà jiù hǎo! Zhè jǐ tiān tiānqì zhuǎn liáng le, nín yào duō chuān diǎnr yīfu, bié zháoliáng le.', vi: 'Thế thì tốt quá ạ! Mấy hôm nay trời trở lạnh rồi, bà nhớ mặc thêm áo, đừng để bị cảm lạnh nhé.' },
      { speaker: 'Bà Vương', gender: 'female', hanzi: '谢谢小武关心，你真是个懂事的孩子！', pinyin: 'Xièxie Xiǎowǔ guānxīn, nǐ zhēn shì gè dǒngshì de háizi!', vi: 'Cảm ơn Tiểu Vũ đã quan tâm, cháu thật là đứa trẻ ngoan và hiểu chuyện!' }
    ],
    vocabulary: [
      { hanzi: '身体', pinyin: 'shēntǐ', meaning: 'sức khỏe, thân thể', hsk: 'HSK 1' },
      { hanzi: '散步', pinyin: 'sànbù', meaning: 'đi dạo', hsk: 'HSK 3' },
      { hanzi: '转凉', pinyin: 'zhuǎn liáng', meaning: 'chuyển lạnh', hsk: 'HSK 3' },
      { hanzi: '懂事', pinyin: 'dǒngshì', meaning: 'hiểu chuyện, ngoan ngoãn', hsk: 'HSK 4' }
    ],
    grammar: [
      {
        title: 'Mẫu câu khuyên nhủ ân cần: 要多 + Động từ (Yào duō...)',
        structure: '要多 + 动词 (+ 宾语)',
        explanation: 'Khuyên người khác nên làm nhiều hơn hành động có lợi cho sức khỏe.',
        example: { hanzi: '多喝水，多休息。', pinyin: 'Duō hē shuǐ, duō xiūxi.', vi: 'Uống nhiều nước và nghỉ ngơi nhiều nhé.' }
      }
    ],
    quiz: [
      {
        question: 'Bà Vương làm gì vào mỗi buổi sáng?',
        options: ['Tập yoga tại nhà', 'Đi dạo ở công viên', 'Đi chợ mua rau', 'Xem tivi'],
        answer: 1,
        explanation: 'Bà Vương nói: "每天早上都去公园散步" (mỗi buổi sáng đều đi dạo ở công viên).'
      }
    ],
    speakingPractice: {
      targetHanzi: '您最近身体怎么样？天冷了要多穿衣服。',
      targetPinyin: 'Nín zuìjìn shēntǐ zěnmeyàng? Tiān lěng le yào duō chuān yīfu.',
      targetVi: 'Dạo này sức khỏe của bác thế nào ạ? Trời lạnh rồi bác nhớ mặc ấm nhé.',
      tip: 'Dùng kính ngữ "您" (nín) khi nói chuyện với người lớn tuổi để thể hiện sự lễ độ.'
    }
  },
  {
    id: 'conv_7',
    number: 7,
    topicId: 1,
    topic: '1. Chào hỏi và giới thiệu bản thân',
    topicShort: 'Chào hỏi',
    level: 'HSK 2',
    title: 'Gặp lại người quen cũ',
    titleHanzi: '偶遇老朋友',
    titlePinyin: 'Ǒuyù lǎo péngyou',
    situation: 'Đại Vệ và Mã Lệ tình cờ gặp lại nhau ở ga tàu sau ba năm không liên lạc.',
    characters: [
      { name: 'Đại Vệ', role: 'Kỹ sư', gender: 'male', avatar: '👨' },
      { name: 'Mã Lệ', role: 'Nhà báo', gender: 'female', avatar: '👩' }
    ],
    dialogue: [
      { speaker: 'Đại Vệ', gender: 'male', hanzi: '玛丽！真的是你吗？太巧了！', pinyin: 'Mǎlì! Zhēn de shì nǐ ma? Tài qiǎo le!', vi: 'Mã Lệ! Thật sự là cậu sao? Khéo quá đi mất!' },
      { speaker: 'Mã Lệ', gender: 'female', hanzi: '天哪，大卫！好久不见！你一点儿也没变！', pinyin: 'Tiān na, Dàwèi! Hǎojiǔ bú jiàn! Nǐ yìdiǎnr yě méi biàn!', vi: 'Trời ơi, Đại Vệ! Lâu lắm không gặp! Cậu chẳng thay đổi chút nào cả!' },
      { speaker: 'Đại Vệ', gender: 'male', hanzi: '我们有三年没见了吧？你最近在忙什么？', pinyin: 'Wǒmen yǒu sān nián méi jiàn le ba? Nǐ zuìjìn zài máng shénme?', vi: 'Bọn mình chắc phải ba năm chưa gặp nhau rồi nhỉ? Dạo này cậu đang bận rộn gì thế?' },
      { speaker: 'Mã Lệ', gender: 'female', hanzi: '我调到上海工作了，今天正好回北京出差。我们加个微信吧，改天一起吃饭！', pinyin: 'Wǒ diào dào Shànghǎi gōngzuò le, jīntiān zhènghǎo huí Běijīng chūchāi. Wǒmen jiā gè Wēixìn ba, gǎitiān yìqǐ chīfàn!', vi: 'Mình chuyển công tác sang Thượng Hải rồi, hôm nay vừa vặn về Bắc Kinh công tác. Bọn mình kết bạn WeChat đi, hôm nào rảnh cùng đi ăn cơm!' },
      { speaker: 'Đại Vệ', gender: 'male', hanzi: '太好了，我扫你的二维码！保持联系！', pinyin: 'Tài hǎo le, wǒ sǎo nǐ de èrwéimǎ! Bǎochí liánxì!', vi: 'Tuyệt quá, mình quét mã QR của cậu nhé! Giữ liên lạc nha!' }
    ],
    vocabulary: [
      { hanzi: '太巧了', pinyin: 'tài qiǎo le', meaning: 'trùng hợp quá, khéo quá', hsk: 'HSK 3' },
      { hanzi: '好久不见', pinyin: 'hǎojiǔ bú jiàn', meaning: 'lâu ngày không gặp', hsk: 'HSK 2' },
      { hanzi: '出差', pinyin: 'chūchāi', meaning: 'đi công tác', hsk: 'HSK 3' },
      { hanzi: '二维码', pinyin: 'èrwéimǎ', meaning: 'mã QR', hsk: 'HSK 3' }
    ],
    grammar: [
      {
        title: 'Mẫu câu phủ định hoàn toàn: 一点儿也/都不 (Yìdiǎnr yě/dōu bù)',
        structure: '一点儿 + 也/都 + 不/没 + Tính từ/Động từ',
        explanation: 'Nhấn mạnh sự phủ định tuyệt đối: không... một chút nào.',
        example: { hanzi: '你一点儿也没变。', pinyin: 'Nǐ yìdiǎnr yě méi biàn.', vi: 'Cậu chẳng hề thay đổi chút nào cả.' }
      }
    ],
    quiz: [
      {
        question: 'Mã Lệ hiện đang làm việc ở thành phố nào?',
        options: ['Bắc Kinh', 'Thượng Hải', 'Quảng Châu', 'Thâm Quyến'],
        answer: 1,
        explanation: 'Mã Lệ nói: "我调到上海工作了" (Mình chuyển công tác sang Thượng Hải rồi).'
      }
    ],
    speakingPractice: {
      targetHanzi: '好久不见！我们加个微信，保持联系吧！',
      targetPinyin: 'Hǎojiǔ bú jiàn! Wǒmen jiā gè Wēixìn, bǎochí liánxì ba!',
      targetVi: 'Lâu rồi không gặp! Chúng ta kết bạn WeChat, giữ liên lạc nhé!',
      tip: 'Cụm "Hǎojiǔ bú jiàn" đọc liền mạch và tươi vui thể hiện sự bất ngờ khi gặp lại.'
    }
  },
  {
    id: 'conv_8',
    number: 8,
    topicId: 1,
    topic: '1. Chào hỏi và giới thiệu bản thân',
    topicShort: 'Chào hỏi',
    level: 'HSK 1',
    title: 'Chào tạm biệt',
    titleHanzi: '道别与告别',
    titlePinyin: 'Dàobié yǔ gàobié',
    situation: 'Cuối buổi tiệc tối, Lâm Phong tiễn Mai ra bến xe và nói lời tạm biệt.',
    characters: [
      { name: 'Lâm Phong', role: 'Chủ nhà hiếu khách', gender: 'male', avatar: '👨' },
      { name: 'Thanh Mai', role: 'Khách dự tiệc', gender: 'female', avatar: '👩' }
    ],
    dialogue: [
      { speaker: 'Thanh Mai', gender: 'female', hanzi: '时间不早了，我得走了，明天还要早起上班呢。', pinyin: 'Shíjiān bù zǎo le, wǒ děi zǒu le, míngtiān hái yào zǎoqǐ shàngbān ne.', vi: 'Thời gian không còn sớm nữa rồi, mình phải về thôi, mai còn phải dậy sớm đi làm.' },
      { speaker: 'Lâm Phong', gender: 'male', hanzi: '今天玩得开心吗？谢谢你来参加聚会！', pinyin: 'Jīntiān wán de kāixīn ma? Xièxie nǐ lái cānjiā jùhuì!', vi: 'Hôm nay chơi có vui không? Cảm ơn bạn đã đến tham gia bữa tiệc nhé!' },
      { speaker: 'Thanh Mai', gender: 'female', hanzi: '非常开心！饭菜特别好吃，辛苦你们了。', pinyin: 'Fēicháng kāixīn! Fàncài tèbié hǎochī, xīnkǔ nǐmen le.', vi: 'Vô cùng vui! Đồ ăn ngon đặc biệt, vất vả cho mọi người quá.' },
      { speaker: 'Lâm Phong', gender: 'male', hanzi: '外面天黑路滑，路上慢点儿，到家了发个消息报平安。', pinyin: 'Wàimiàn tiānhēi lù huá, lùshang màn diǎnr, dào jiā le fā gè xiāoxi bào píng’ān.', vi: 'Bên ngoài trời tối đường trơn, đi đường chậm một chút nhé, về đến nhà thì nhắn tin báo bình an nha.' },
      { speaker: 'Thanh Mai', gender: 'female', hanzi: '好的，快请留步吧。再见！', pinyin: 'Hǎo de, kuài qǐng liúbù ba. Zàijiàn!', vi: 'Vâng, xin anh dừng bước đừng tiễn nữa ạ. Tạm biệt anh!' }
    ],
    vocabulary: [
      { hanzi: '聚会', pinyin: 'jùhuì', meaning: 'bữa tiệc, buổi tụ họp', hsk: 'HSK 3' },
      { hanzi: '报平安', pinyin: 'bào píng’ān', meaning: 'báo tin bình an, báo về đến nơi', hsk: 'HSK 4' },
      { hanzi: '留步', pinyin: 'liúbù', meaning: 'dừng bước (lời khách nói với chủ nhà khi tiễn)', hsk: 'HSK 4' },
      { hanzi: '再见', pinyin: 'zàijiàn', meaning: 'tạm biệt', hsk: 'HSK 1' }
    ],
    grammar: [
      {
        title: 'Động từ năng nguyện bắt buộc: 得 (děi) + Động từ',
        structure: 'Chủ ngữ + 得 (děi) + 动词',
        explanation: 'Biểu thị sự cần thiết, phải làm việc gì đó.',
        example: { hanzi: '太晚了，我得回家了。', pinyin: 'Tài wǎn le, wǒ děi huí jiā le.', vi: 'Muộn quá rồi, tôi phải về nhà thôi.' }
      }
    ],
    quiz: [
      {
        question: 'Cụm từ "请留步" (Qǐng liúbù) được dùng trong hoàn cảnh nào?',
        options: ['Khi chào mừng khách đến', 'Khi khách đề nghị chủ nhà đừng tiễn xa hơn', 'Khi hỏi đường', 'Khi gọi món'],
        answer: 1,
        explanation: '"请留步" là câu lịch sự khách nói khi ra về, ngụ ý "xin chủ nhà dừng bước, không cần tiễn thêm".'
      }
    ],
    speakingPractice: {
      targetHanzi: '路上慢点儿，到家了给我发个消息。',
      targetPinyin: 'Lùshang màn diǎnr, dào jiā le gěi wǒ fā gè xiāoxi.',
      targetVi: 'Đi đường cẩn thận nhé, về đến nhà thì gửi tin nhắn cho mình.',
      tip: '"Màn diǎnr" là lời chúc đi đường an toàn đặc trưng của người Trung Quốc.'
    }
  },
  {
    id: 'conv_9',
    number: 9,
    topicId: 1,
    topic: '1. Chào hỏi và giới thiệu bản thân',
    topicShort: 'Chào hỏi',
    level: 'HSK 2',
    title: 'Giới thiệu bạn bè',
    titleHanzi: '引荐与介绍朋友',
    titlePinyin: 'Yǐnjiàn yǔ jièshào péngyou',
    situation: 'Hải giới thiệu bạn thân cùng phòng là Tuấn cho Tiểu Mẫn làm quen.',
    characters: [
      { name: 'Hải', role: 'Người kết nối', gender: 'male', avatar: '👦' },
      { name: 'Tiểu Mẫn', role: 'Bạn nữ cùng câu lạc bộ', gender: 'female', avatar: '👧' },
      { name: 'Tuấn', role: 'Bạn cùng phòng', gender: 'male', avatar: '👨' }
    ],
    dialogue: [
      { speaker: 'Hải', gender: 'male', hanzi: '小敏，我来给你介绍一下，这位是我的室友阿俊。', pinyin: 'Xiǎomǐn, wǒ lái gěi nǐ jièshào yíxià, zhè wèi shì wǒ de shìyǒu Ā Jùn.', vi: 'Tiểu Mẫn, mình giới thiệu với cậu một chút, vị này là bạn cùng phòng của mình - A Tuấn.' },
      { speaker: 'Tiểu Mẫn', gender: 'female', hanzi: '你好，阿俊！经常听阿海提起你，说你篮球打得特别好。', pinyin: 'Nǐ hǎo, Ā Jùn! Jīngcháng tīng Ā Hǎi tíqǐ nǐ, shuō nǐ lánqiú dǎ de tèbié hǎo.', vi: 'Chào A Tuấn! Thường xuyên nghe A Hải nhắc tới bạn, bảo là bạn chơi bóng rổ cừ lắm.' },
      { speaker: 'Tuấn', gender: 'male', hanzi: '你好，小敏！哪里哪里，只是平时喜欢运动而已。阿海也常夸你学习好。', pinyin: 'Nǐ hǎo, Xiǎomǐn! Nǎlǐ nǎlǐ, zhǐshì píngshí xǐhuan yùndòng éryǐ. Ā Hǎi yě cháng kuā nǐ xuéxí hǎo.', vi: 'Chào Tiểu Mẫn! Đâu có đâu có, chỉ là bình thường thích vận động thôi. A Hải cũng hay khen bạn học giỏi.' },
      { speaker: 'Tiểu Mẫn', gender: 'female', hanzi: '这周末我们打算去奥林匹克公园，你和阿海一起来吧？', pinyin: 'Zhè zhōumò wǒmen dǎsuàn qù Àolínpǐkè Gōngyuán, nǐ hé Ā Hǎi yìqǐ lái ba?', vi: 'Cuối tuần này bọn mình định đi công viên Olympic, bạn cùng đi với A Hải nhé?' },
      { speaker: 'Tuấn', gender: 'male', hanzi: '太好了，非常荣幸！周末见！', pinyin: 'Tài hǎo le, fēicháng róngxìng! Zhōumò jiàn!', vi: 'Tuyệt quá, rất vinh hạnh! Hẹn cuối tuần gặp nhé!' }
    ],
    vocabulary: [
      { hanzi: '室友', pinyin: 'shìyǒu', meaning: 'bạn cùng phòng', hsk: 'HSK 3' },
      { hanzi: '提起', pinyin: 'tíqǐ', meaning: 'nhắc tới, đề cập', hsk: 'HSK 3' },
      { hanzi: '哪里哪里', pinyin: 'nǎlǐ nǎlǐ', meaning: 'đâu có đâu có (lời khiêm tốn)', hsk: 'HSK 2' },
      { hanzi: '荣幸', pinyin: 'róngxìng', meaning: 'vinh hạnh', hsk: 'HSK 4' }
    ],
    grammar: [
      {
        title: 'Mẫu câu khiêm tốn truyền thống Trung Quốc: 哪里哪里 (Nǎlǐ nǎlǐ)',
        structure: 'Khi nhận được lời khen: Đáp lại bằng "哪里哪里" hoặc "您过奖了"',
        explanation: 'Thể hiện đức tính khiêm tốn của người phương Đông khi nhận được lời tán thưởng.',
        example: { hanzi: '你的中文真好！- 哪里哪里，还在学习呢。', pinyin: 'Nǐ de zhōngwén zhēn hǎo! - Nǎlǐ nǎlǐ, hái zài xuéxí ne.', vi: 'Tiếng Trung của bạn giỏi quá! - Đâu có đâu có, tôi vẫn đang học thôi.' }
      }
    ],
    quiz: [
      {
        question: 'Tuấn và Hải có mối quan hệ gì?',
        options: ['Đồng nghiệp', 'Bạn cùng phòng (室友)', 'Thầy trò', 'Anh em ruột'],
        answer: 1,
        explanation: 'Hải giới thiệu: "这位是我的室友阿俊" (Vị này là bạn cùng phòng của mình).'
      }
    ],
    speakingPractice: {
      targetHanzi: '我来给你介绍一下，这位是我的好朋友。',
      targetPinyin: 'Wǒ lái gěi nǐ jièshào yíxià, zhè wèi shì wǒ de hǎo péngyou.',
      targetVi: 'Để mình giới thiệu với bạn một chút, đây là người bạn tốt của mình.',
      tip: 'Dùng từ "这位" (zhè wèi) thay vì "这个" để tỏ lòng tôn trọng người bạn được giới thiệu.'
    }
  },
  {
    id: 'conv_10',
    number: 10,
    topicId: 1,
    topic: '1. Chào hỏi và giới thiệu bản thân',
    topicShort: 'Chào hỏi',
    level: 'HSK 2',
    title: 'Làm quen với hàng xóm',
    titleHanzi: '结识邻居',
    titlePinyin: 'Jiéshí línjū',
    situation: 'Mai vừa chuyển đến khu chung cư mới, mang ít trái cây sang chào hỏi gia đình bác Trương đối diện.',
    characters: [
      { name: 'Thanh Mai', role: 'Người mới chuyển đến', gender: 'female', avatar: '👩' },
      { name: 'Bác Trương', role: 'Hàng xóm đối diện', gender: 'male', avatar: '👨' }
    ],
    dialogue: [
      { speaker: 'Thanh Mai', gender: 'female', hanzi: '张叔叔，您好！我是今天刚搬到对门502的新邻居，我叫青梅。', pinyin: 'Zhāng shūshu, nín hǎo! Wǒ shì jīntiān gāng bān dào duìmén wǔ líng èr de xīn línjū, wǒ jiào Qīngméi.', vi: 'Bác Trương, cháu chào bác ạ! Cháu là Thanh Mai, hàng xóm mới vừa chuyển đến phòng 502 đối diện hôm nay.' },
      { speaker: 'Bác Trương', gender: 'male', hanzi: '哎呀，欢迎新邻居！快请进坐坐！搬家挺累的吧？', pinyin: 'Āiyā, huānyíng xīn línjū! Kuài qǐng jìn zuòzuo! Bānjiā tǐng lèi de ba?', vi: 'Ái chà, hoan nghênh hàng xóm mới! Mau vào nhà ngồi chơi! Dọn nhà chắc mệt lắm nhỉ?' },
      { speaker: 'Thanh Mai', gender: 'female', hanzi: '谢谢叔叔，这是我买的一点新鲜水果，请您和阿姨尝尝。以后还请多关照！', pinyin: 'Xièxie shūshu, zhè shì wǒ mǎi de yìdiǎn xīnxiān shuǐguǒ, qǐng nín hé āyí chángchang. Yǐhòu hái qǐng duō guānzhào!', vi: 'Dạ cảm ơn bác, đây là chút hoa quả tươi cháu mua biếu bác và bác gái nếm thử. Sau này mong bác giúp đỡ nhiều ạ!' },
      { speaker: 'Bác Trương', gender: 'male', hanzi: '你太客气了！俗话说“远亲不如近邻”，平时有什么需要帮忙的，随时敲门！', pinyin: 'Nǐ tài kèqi le! Súhuà shuō “yuǎnqīn bùrú jìnlín”, píngshí yǒu shénme xūyào bāngmáng de, suíshí qiāomén!', vi: 'Cháu khách sáo quá! Tục ngữ có câu "Bà con xa không bằng láng giềng gần", ngày thường có việc gì cần giúp thì cứ việc gõ cửa nhé!' }
    ],
    vocabulary: [
      { hanzi: '邻居', pinyin: 'línjū', meaning: 'hàng xóm', hsk: 'HSK 3' },
      { hanzi: '搬家', pinyin: 'bānjiā', meaning: 'chuyển nhà', hsk: 'HSK 3' },
      { hanzi: '多关照', pinyin: 'duō guānzhào', meaning: 'chiếu cố, giúp đỡ nhiều', hsk: 'HSK 4' },
      { hanzi: '远亲不如近邻', pinyin: 'yuǎnqīn bùrú jìnlín', meaning: 'bà con xa không bằng láng giềng gần', hsk: 'HSK 5' }
    ],
    grammar: [
      {
        title: 'Thành ngữ tục ngữ đối nhân xử thế: 远亲不如近邻',
        structure: '远亲 (Bà con xa) + 不如 (Không bằng) + 近邻 (Láng giềng gần)',
        explanation: 'Nhấn mạnh tầm quan trọng của tình nghĩa làng xóm láng giềng trong văn hóa phương Đông.',
        example: { hanzi: '大家要互相帮助，毕竟远亲不如近邻。', pinyin: 'Dàjiā yào hùxiāng bāngzhù, bìjìng yuǎnqīn bùrú jìnlín.', vi: 'Mọi người nên giúp đỡ lẫn nhau, dẫu sao bà con xa cũng chẳng bằng láng giềng gần.' }
      }
    ],
    quiz: [
      {
        question: 'Câu tục ngữ nào được bác Trương nhắc đến khi chào đón hàng xóm mới?',
        options: ['入乡随俗', '远亲不如近邻', '塞翁失马', '同甘共苦'],
        answer: 1,
        explanation: 'Bác Trương nói: 俗话说“远亲不如近邻” (Tục ngữ có câu: Bà con xa không bằng láng giềng gần).'
      }
    ],
    speakingPractice: {
      targetHanzi: '我是新搬来的邻居，以后请多关照！',
      targetPinyin: 'Wǒ shì xīn bān lái de línjū, yǐhòu qǐng duō guānzhào!',
      targetVi: 'Tôi là hàng xóm mới chuyển đến, sau này xin được chỉ giáo và giúp đỡ nhiều ạ!',
      tip: '"Qǐng duō guānzhào" là câu nói xã giao lịch sự rất chuẩn mực khi đến môi trường mới.'
    }
  }
];
