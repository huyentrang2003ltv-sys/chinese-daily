const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/hanyu_jiaocheng.json');
const jiaocheng = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const vol1Narratives = {
  // BÀI 1: 你好
  "jc_1_1_1": {
    titleHanzi: "初次相识与问好",
    titlePinyin: "Chū cì xiāngshí yǔ wènhǎo",
    titleVi: "Lần đầu gặp gỡ và chào hỏi",
    summary: "Đoạn văn giới thiệu về các lưu học sinh ngày đầu tiên nhập học tại Đại học Ngôn ngữ Bắc Kinh, gặp gỡ thầy cô và các bạn mới.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "今天我们在北京语言大学上第一节汉语课。教室里有很多来自世界各地的同学。大家初次见面，都热情地打招呼说：“你好！”",
        pinyin: "Jīntiān wǒmen zài Běijīng Yǔyán Dàxué shàng dì-yī jié Hànyǔ kè. Jiàoshì lǐ yǒu hěn duō láizì shìjiè gèdì de tóngxué. Dàjiā chū cì jiànmiàn, dōu rèqíng de dǎ zhāohu shuō: “Nǐ hǎo!”",
        vi: "Hôm nay chúng tôi học tiết tiếng Hán đầu tiên tại Đại học Ngôn ngữ Bắc Kinh. Trong phòng học có rất nhiều bạn học đến từ khắp nơi trên thế giới. Mọi người lần đầu gặp mặt đều nhiệt tình chào nhau: 'Xin chào!'"
      },
      {
        paraNum: 2,
        hanzi: "王老师走进教室，微笑着对大家说：“同学们好，欢迎大家来中国学习汉语！” 同学们齐声回答：“老师，您好！” 友好的问候让大家感到十分温暖。",
        pinyin: "Wáng lǎoshī zǒu jìn jiàoshì, wēixiào zhe duì dàjiā shuō: “Tóngxuémen hǎo, huānyíng dàjiā lái Zhōngguó xuéxí Hànyǔ!” Tóngxuémen qí shēng huídá: “Lǎoshī, nín hǎo!” Yǒuhǎo de wènhòu ràng dàjiā gǎndào shífēn wēnnuǎn.",
        vi: "Thầy Vương bước vào lớp học, mỉm cười nói với mọi người: 'Chào các em, hoan nghênh các em đến Trung Quốc học tiếng Hán!' Cả lớp đồng thanh đáp lại: 'Em chào thầy ạ!' Lời chào thân thiện khiến mọi người cảm thấy vô cùng ấm áp."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "同学们在哪里上第一节汉语课？",
        qPinyin: "Tóngxuémen zài nǎli shàng dì-yī jié Hànyǔ kè?",
        qVi: "Các bạn học tiết tiếng Hán đầu tiên ở đâu?",
        aHanzi: "在北京语言大学。",
        aVi: "Tại Đại học Ngôn ngữ Bắc Kinh."
      },
      {
        qHanzi: "王老师对同学们说了什么？",
        qPinyin: "Wáng lǎoshī duì tóngxuémen shuō le shénme?",
        qVi: "Thầy Vương đã nói gì với các bạn học?",
        aHanzi: "王老师说：“同学们好，欢迎大家来中国学习汉语！”",
        aVi: "Thầy Vương nói: 'Chào các em, hoan nghênh các em đến Trung Quốc học tiếng Hán!'"
      }
    ]
  },

  // BÀI 2: 汉语不太难
  "jc_1_1_2": {
    titleHanzi: "我们的汉语学习生活",
    titlePinyin: "Wǒmen de Hànyǔ xuéxí shēnghuó",
    titleVi: "Cuộc sống học tiếng Hán của chúng tôi",
    summary: "Đoạn văn ngắn miêu tả việc học phát âm, thanh điệu và nhận xét về độ khó của tiếng Hán đối với du học sinh.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "麦克和玛丽都是新留学生。他们每天早上八点去教室上课。现在他们的汉语学习生活很忙，但是很有趣。",
        pinyin: "Màikè hé Mǎlì dōu shì xīn liúxuéshēng. Tāmen měitiān zǎoshang bā diǎn qù jiàoshì shàngkè. Xiànzài tāmen de Hànyǔ xuéxí shēnghuó hěn máng, dànshì hěn yǒuqù.",
        vi: "Mike và Mary đều là tân lưu học sinh. Mỗi buổi sáng 8 giờ họ đều đến lớp học. Hiện tại cuộc sống học tập tiếng Hán của họ rất bận, nhưng rất thú vị."
      },
      {
        paraNum: 2,
        hanzi: "很多人问他们：“汉语难不难？” 麦克说：“汉语的发音不太难，声调也很有意思，不过写汉字有一点儿难。” 玛丽也觉得，只要每天认真练习，汉语就都不难。",
        pinyin: "Hěn duō rén wèn tāmen: “Hànyǔ nán bu nán?” Màikè shuō: “Hànyǔ de fāyīn bú tài nán, shēngdiào yě hěn yǒuyìsi, búguò xiě Hànzì yǒu yìdiǎnr nán.” Mǎlì yě juéde, zhǐyào měitiān rènzhēn liànxí, Hànyǔ jiù dōu bù nán.",
        vi: "Nhiều người hỏi họ: 'Tiếng Hán có khó không?' Mike nói: 'Phát âm tiếng Hán không khó lắm, thanh điệu cũng rất thú vị, nhưng viết chữ Hán thì hơi khó một chút.' Mary cũng cảm thấy, chỉ cần mỗi ngày chăm chỉ luyện tập thì tiếng Hán đều không khó."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "麦克觉得汉语什么难，什么不太难？",
        qPinyin: "Màikè juéde Hànyǔ shénme nán, shénme bú tài nán?",
        qVi: "Mike cảm thấy điều gì trong tiếng Hán khó, điều gì không khó lắm?",
        aHanzi: "麦克觉得发音不太难，写汉字有一点儿难。",
        aVi: "Mike cảm thấy phát âm không khó lắm, viết chữ Hán thì hơi khó một chút."
      }
    ]
  },

  // BÀI 3: 明天见
  "jc_1_1_3": {
    titleHanzi: "学期初的一周日程",
    titlePinyin: "Xuéqī chū de yì zhōu rìchéng",
    titleVi: "Lịch trình một tuần đầu học kỳ",
    summary: "Lịch học từ thứ hai đến thứ sáu và kế hoạch nghỉ ngơi, hẹn gặp bạn bè vào cuối tuần.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "从星期一到星期五，留学生们每天上午都有汉语课。大家认真听老师讲课，大声读生词和课文。",
        pinyin: "Cóng xīngqīyī dào xīngqīwǔ, liúxuéshēngmen měitiān shàngwǔ dōu yǒu Hànyǔ kè. Dàjiā rènzhēn tīng lǎoshī jiǎngkè, dà shēng dú shēngcí hé kèwén.",
        vi: "Từ thứ hai đến thứ sáu, các bạn lưu học sinh mỗi buổi sáng đều có tiết học tiếng Hán. Mọi người chăm chú nghe thầy giáo giảng bài, đọc to từ mới và bài khóa."
      },
      {
        paraNum: 2,
        hanzi: "星期五下午放学后，王老师在教室门口对大家说：“明天是星期六，大家可以好好休息。星期一见！” 同学们微笑着挥手：“老师，星期一见！”",
        pinyin: "Xīngqīwǔ xiàwǔ fàngxué hòu, Wáng lǎoshī zài jiàoshì ménkǒu duì dàjiā shuō: “Míngtiān shì xīngqīliù, dàjiā kěyǐ hǎohǎo xiūxi. Xīngqīyī jiàn!” Tóngxuémen wēixiào zhe huīshǒu: “Lǎoshī, xīngqīyī jiàn!”",
        vi: "Chiều thứ sáu sau khi tan học, thầy Vương đứng ở cửa lớp nói với mọi người: 'Ngày mai là thứ bảy, các em có thể nghỉ ngơi thật tốt. Hẹn gặp lại vào thứ hai nhé!' Các bạn học mỉm cười vẫy tay: 'Thưa thầy, hẹn thứ hai gặp lại ạ!'"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "留学生星期几有课？",
        qPinyin: "Liúxuéshēng xīngqījǐ yǒu kè?",
        qVi: "Lưu học sinh có tiết học vào những thứ mấy?",
        aHanzi: "从星期一到星期五上午都有课。",
        aVi: "Từ thứ hai đến thứ sáu buổi sáng đều có lớp."
      }
    ]
  },

  // BÀI 4: 你去哪儿
  "jc_1_1_4": {
    titleHanzi: "下课后的校园漫步",
    titlePinyin: "Xiàkè hòu de xiàoyuán mànbù",
    titleVi: "Dạo bước trong khuôn viên trường sau giờ học",
    summary: "Gặp gỡ bạn bè trên đường đến thư viện, bưu điện và sân vận động trong khuôn viên trường đại học.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "下午四点，下课铃响了。校园里十分热闹，同学们三三两两地走出教学楼。张东在路上碰见了同班同学李明。",
        pinyin: "Xiàwǔ sì diǎn, xiàkè líng xiǎng le. Xiàoyuán lǐ shífēn rènao, tóngxuémen sānsān-liǎngliǎng de zǒu chū jiàoxuélóu. Zhāng Dōng zài lùshang pèngjiàn le tóngbān tóngxué Lǐ Míng.",
        vi: "4 giờ chiều, chuông tan học reo lên. Khuôn viên trường vô cùng nhộn nhịp, các bạn học từng tốp hai ba người bước ra khỏi tòa nhà giảng đường. Trương Đông trên đường bắt gặp người bạn cùng lớp Lý Minh."
      },
      {
        paraNum: 2,
        hanzi: "张东问李明：“你去哪儿？” 李明回答：“我去图书馆借中文书。你去不去？” 张东说：“我不去图书馆，我要去天安门附近的邮局寄信。” 他们在路口互相道别，各自前去。",
        pinyin: "Zhāng Dōng wèn Lǐ Míng: “Nǐ qù nǎr?” Lǐ Míng huídá: “Wǒ qù túshūguǎn jiè Zhōngwén shū. Nǐ qù bu qù?” Zhāng Dōng shuō: “Wǒ bú qù túshūguǎn, wǒ yào qù Tiān'ānmén fùjìn de yóujú jì xìn.” Tāmen zài lùkǒu hùxiāng dàobié, gèzì qiánqù.",
        vi: "Trương Đông hỏi Lý Minh: 'Cậu đi đâu thế?' Lý Minh đáp: 'Mình đến thư viện mượn sách tiếng Trung. Cậu đi không?' Trương Đông nói: 'Mình không đi thư viện, mình muốn đến bưu điện gần Thiên An Môn để gửi thư.' Họ chào tạm biệt nhau ở ngã rẽ rồi ai đi đường nấy."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "李明去图书馆做什么？",
        qPinyin: "Lǐ Míng qù túshūguǎn zuò shénme?",
        qVi: "Lý Minh đến thư viện làm gì?",
        aHanzi: "李明去图书馆借中文书。",
        aVi: "Lý Minh đến thư viện mượn sách tiếng Trung."
      }
    ]
  },

  // BÀI 5: 这是王老师
  "jc_1_1_5": {
    titleHanzi: "拜访王老师",
    titlePinyin: "Bàifǎng Wáng lǎoshī",
    titleVi: "Đến thăm thầy giáo Vương",
    summary: "Lưu học sinh mang trà và sách đến văn phòng gặp thầy Vương, giới thiệu gia đình và bạn bè.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "王老师是留学生班的班主任，教大家汉语精读。今天下午，大卫和他的朋友一起去办公室看望王老师。",
        pinyin: "Wáng lǎoshī shì liúxuéshēng bān de bānzhǔrèn, jiāo dàjiā Hànyǔ jīngdú. Jīntiān xiàwǔ, Dàwèi hé tā de péngyou yìqǐ qù bàngōngshì kànwàng Wáng lǎoshī.",
        vi: "Thầy Vương là chủ nhiệm lớp lưu học sinh, dạy mọi người môn Đọc hiểu tiếng Hán. Chiều nay, David cùng bạn của cậu ấy cùng đến văn phòng thăm thầy Vương."
      },
      {
        paraNum: 2,
        hanzi: "进了办公室，大卫恭敬地介绍说：“王老师，这是我的好朋友，他叫爱德华。” 王老师热情地请他们坐下，并微笑着问：“请进，请坐！请喝茶！” 大家都非常喜欢这位和蔼可亲的老师。",
        pinyin: "Jìn le bàngōngshì, Dàwèi gōngjìng de jièshào shuō: “Wáng lǎoshī, zhè shì wǒ de hǎo péngyou, tā jiào Àidéhuá.” Wáng lǎoshī rèqíng de qǐng tāmen zuò xia, bìng wēixiào zhe wèn: “Qǐng jìn, qǐng zuò! Qǐng hē chá!” Dàjiā dōu fēicháng xǐhuan zhè wèi hé'ǎi-kěqīn de lǎoshī.",
        vi: "Vào văn phòng, David cung kính giới thiệu: 'Thầy Vương, đây là người bạn thân của em, cậu ấy tên là Edward.' Thầy Vương nhiệt tình mời họ ngồi và mỉm cười nói: 'Mời vào, mời ngồi! Mời uống trà!' Mọi người ai cũng vô cùng yêu quý người thầy hòa nhã, thân thiện này."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "大卫给王老师介绍了谁？",
        qPinyin: "Dàwèi gěi Wáng lǎoshī jièshào le shéi?",
        qVi: "David đã giới thiệu ai cho thầy Vương?",
        aHanzi: "大卫介绍了他的好朋友爱德华。",
        aVi: "David đã giới thiệu người bạn thân Edward."
      }
    ]
  },

  // BÀI 6: 我学习汉语
  "jc_1_1_6": {
    titleHanzi: "我们班的国际大家庭",
    titlePinyin: "Wǒmen bān de guójì dà jiātíng",
    titleVi: "Đại gia đình quốc tế ở lớp chúng tôi",
    summary: "Đoạn văn giới thiệu các thành viên trong lớp học tiếng Hán đến từ nhiều quốc gia khác nhau và sự gắn kết bạn bè.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在语言大学的一年级三班，有十五个留学生。他们来自美国、英国、加拿大、德国、日本和韩国等不同的国家。虽然国籍不同，但大家都有一个共同的目标，那就是学好汉语。",
        pinyin: "Zài Yǔyán Dàxué de yī niánjí sān bān, yǒu shíwǔ ge liúxuéshēng. Tāmen láizì Měiguó, Yīngguó, Jiānádà, Déguó, Rìběn hé Hánguó děng bùtóng de guójiā. Suīrán guójí bùtóng, dàn dàjiā dōu yǒu yí ge gòngtóng de mùbiāo, nà jiù shì xuéhǎo Hànyǔ.",
        vi: "Ở lớp 3 năm thứ nhất Đại học Ngôn ngữ, có 15 bạn lưu học sinh. Họ đến từ các quốc gia khác nhau như Mỹ, Anh, Canada, Đức, Nhật Bản và Hàn Quốc. Tuy quốc tịch khác nhau nhưng mọi người đều có chung một mục tiêu, đó là học giỏi tiếng Hán."
      },
      {
        paraNum: 2,
        hanzi: "平时上课时，大家互相帮助，一起练习会话；课后，大家常常一起去中国餐馆尝美食。班里的中国同学也很热情，经常给他们当语言伙伴，大家相处得像一家人一样。",
        pinyin: "Píngshí shàngkè shí, dàjiā hùxiāng bāngzhù, yìqǐ liànxí huìhuà; kè hòu, dàjiā chángcháng yìqǐ qù Zhōngguó cānguǎn cháng měishí. Bān lǐ de Zhōngguó tóngxué yě hěn rèqíng, jīngcháng gěi tāmen dāng yǔyán huǒbàn, dàjiā xiāngchǔ de xiàng yì jiā rén yíyàng.",
        vi: "Ngày thường khi lên lớp, mọi người giúp đỡ lẫn nhau cùng luyện hội thoại; sau giờ học thường cùng đến các quán ăn Trung Quốc nếm thử món ngon. Các bạn sinh viên Trung Quốc cũng rất nhiệt tình, thường xuyên làm bạn đồng hành luyện ngôn ngữ, mọi người hòa thuận như người trong một nhà."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "三班一共有多少个留学生？",
        qPinyin: "Sān bān yígòng yǒu duōshao ge liúxuéshēng?",
        qVi: "Lớp 3 có tổng cộng bao nhiêu lưu học sinh?",
        aHanzi: "一共有十五个留学生。",
        aVi: "Tổng cộng có 15 bạn lưu học sinh."
      }
    ]
  },

  // BÀI 7: 你吃什么
  "jc_1_1_7": {
    titleHanzi: "大学食堂里的午餐",
    titlePinyin: "Dàxué shítáng lǐ de wǔcān",
    titleVi: "Bữa trưa trong nhà ăn trường đại học",
    summary: "Trải nghiệm văn hóa ẩm thực Trung Quốc: bánh bao, sủi cảo, mì sợi và món canh trứng cà chua tại nhà ăn trường.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "中午十二点，大学的第一学生食堂热闹非凡。橱窗里摆满了各种各样美味的中式饭菜：热气腾腾的包子、香喷喷的米饭、金黄的炒菜，还有鲜美的鸡蛋汤。",
        pinyin: "Zhōngwǔ shí'èr diǎn, dàxué de dì-yī xuéshēng shítáng rènao fēifán. Chúchuāng lǐ bǎi mǎn le gè zhǒng gè yàng měiwèi de Zhōngshì fàncài: rèqì-téngténg de bāozi, xiāngpēnpēn de mǐfàn, jīnhuáng de chǎocài, hái yǒu xiānměi de jīdàntāng.",
        vi: "12 giờ trưa, nhà ăn sinh viên số 1 của trường đại học nhộn nhịp khác thường. Trong các ô tủ kính bày đầy đủ các món ăn Trung Hoa thơm ngon: bánh bao bốc khói nghi ngút, cơm trắng thơm phức, thức ăn xào vàng ươm và món canh trứng thơm ngọt."
      },
      {
        paraNum: 2,
        hanzi: "麦克问玛丽：“今天中午你吃什么？” 玛丽说：“我想吃四个大包子，还要一碗西红柿鸡蛋汤。你呢？” 麦克笑着说：“我喜欢吃北方饺子，今天我要吃二十个猪肉水饺！” 大家一边品尝美食，一边愉快地交谈。",
        pinyin: "Màikè wèn Mǎlì: “Jīntiān zhōngwǔ nǐ chī shénme?” Mǎlì shuō: “Wǒ xiǎng chī sì ge dà bāozi, hái yào yì wǎn xīhóngshì jīdàntāng. Nǐ ne?” Màikè xiào zhe shuō: “Wǒ xǐhuan chī běifāng jiǎozi, jīntiān wǒ yào chī èrshí ge zhūròu shuǐjiǎo!” Dàjiā yìbiān pǐncháng měishí, yìbiān yúkuài de jiāotán.",
        vi: "Mike hỏi Mary: 'Trưa nay bạn ăn gì?' Mary đáp: 'Mình muốn ăn 4 chiếc bánh bao lớn, và cần thêm một bát canh trứng cà chua. Còn bạn?' Mike cười nói: 'Mình thích ăn sủi cảo phương Bắc, hôm nay mình muốn ăn 20 cái sủi cảo nhân thịt heo!' Mọi người vừa thưởng thức món ngon vừa trò chuyện vui vẻ."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "玛丽午饭想吃什么？",
        qPinyin: "Mǎlì wǔfàn xiǎng chī shénme?",
        qVi: "Bữa trưa Mary muốn ăn gì?",
        aHanzi: "玛丽想吃四个包子和一碗西红柿鸡蛋汤。",
        aVi: "Mary muốn ăn 4 chiếc bánh bao và 1 bát canh trứng cà chua."
      }
    ]
  },

  // BÀI 8: 苹果一斤多少钱
  "jc_1_1_8": {
    titleHanzi: "校门口的水果摊",
    titlePinyin: "Xiào ménkǒu de shuǐguǒ tān",
    titleVi: "Quầy hoa quả trước cổng trường",
    summary: "Kinh nghiệm đi chợ mua sắm hoa quả tươi, hỏi giá cả bằng tiền tệ nhân dân tệ (cân, đồng, hào, xu).",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "学校东门外有一条热闹的街道，那里有许多新鲜的水果摊。摊位上摆着红彤彤的苹果、黄澄澄的香蕉和紫色的葡萄，散发着诱人的果香。",
        pinyin: "Xuéxiào dōng mén wài yǒu yì tiáo rènao de jiēdào, nàli yǒu xǔduō xīnxiān de shuǐguǒ tān. Tānwèi shang bǎi zhe hóngtōngtōng de píngguǒ, huángdēngdēng de xiāngjiāo hé zǐsè de pútao, sànfā zhe yòurén de guǒxiāng.",
        vi: "Phía ngoài cổng đông của trường có một con phố nhộn nhịp, ở đó có rất nhiều sạp hoa quả tươi ngon. Trên các sạp bày những quả táo đỏ au, chuối vàng ươm và nho tím, tỏa ra hương thơm hoa quả hấp dẫn."
      },
      {
        paraNum: 2,
        hanzi: "大卫走到一个摊位前，问老板：“师傅，苹果一斤多少钱？” 老板笑着说：“红富士苹果五块钱一斤。” 大卫挑选了三斤苹果和两斤香蕉，一共二十块钱。大卫觉得中国的水果既新鲜又便宜。",
        pinyin: "Dàwèi zǒu dào yí ge tānwèi qián, wèn lǎobǎn: “Shīfu, píngguǒ yì jīn duōshao qián?” Lǎobǎn xiào zhe shuō: “Hóngfùshì píngguǒ wǔ kuài qián yì jīn.” Dàwèi tiāoxuǎn le sān jīn píngguǒ hé liǎng jīn xiāngjiāo, yígòng èrshí kuài qián. Dàwèi juéde Zhōngguó de shuǐguǒ jì xīnxiān yòu piányi.",
        vi: "David bước đến trước một quầy hàng, hỏi ông chủ: 'Bác ơi, táo bao nhiêu tiền một cân ạ?' Ông chủ cười nói: 'Táo Hồng Phú Sĩ 5 đồng một cân.' David chọn 3 cân táo và 2 cân chuối, tổng cộng 20 đồng. David cảm thấy hoa quả ở Trung Quốc vừa tươi lại vừa rẻ."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "大卫买了多少苹果和香蕉？",
        qPinyin: "Dàwèi mǎi le duōshao píngguǒ hé xiāngjiāo?",
        qVi: "David đã mua bao nhiêu táo và chuối?",
        aHanzi: "大卫买了三斤苹果和两斤香蕉。",
        aVi: "David đã mua 3 cân táo và 2 cân chuối."
      }
    ]
  },

  // BÀI 9: 我换人民币
  "jc_1_1_9": {
    titleHanzi: "中国银行的兑换业务",
    titlePinyin: "Zhōngguó Yínháng de duìhuàn yèwù",
    titleVi: "Nghiệp vụ đổi tiền tại Ngân hàng Trung Quốc",
    summary: "Thủ tục đến ngân hàng điền phiếu đổi ngoại tệ sang nhân dân tệ của lưu học sinh nước ngoài.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "为了平时的生活消费和交书本费，麦克今天下午拿着五百美元去学校对面的中国银行营业厅换人民币。",
        pinyin: "Wèile píngshí de shēnghuó xiāofèi hé jiāo shūběnfèi, Màikè jīntiān xiàwǔ ná zhe wǔbǎi Měiyuán qù xuéxiào duìmiàn de Zhōngguó Yínháng yíngyètīng huàn Rénmínbì.",
        vi: "Để chi tiêu sinh hoạt hằng ngày và đóng tiền sách vở, chiều nay Mike mang theo 500 đô la Mỹ đến quầy giao dịch Ngân hàng Trung Quốc đối diện trường để đổi nhân dân tệ."
      },
      {
        paraNum: 2,
        hanzi: "银行大厅里十分明亮整洁。工作人员礼貌地递给他一张兑换单，麦克认真填好了自己的姓名、国籍和护照号码。营业员数好钱递给麦克：“请数一数，这是三千五百元人民币。” 麦克说：“谢谢，数额正对。”",
        pinyin: "Yínháng dàtīng lǐ shífēn míngliàng zhěngjié. Gōngzuò rényuán lǐmào de dì gěi tā yì zhāng duìhuàndān, Màikè rènzhēn tiánhǎo le zìjǐ de xìngmíng, guójí hé hùzhào hàomǎ. Yíngyèyuán shǔ hǎo qián dì gěi Màikè: “Qǐng shǔ yi shǔ, zhè shì sānqiān wǔbǎi yuán Rénmínbì.” Màikè shuō: “Xièxie, shù'é zhèng duì.”",
        vi: "Sảnh ngân hàng vô cùng sáng sủa, ngăn nắp. Nhân viên lịch sự đưa cho cậu một phiếu đổi tiền, Mike cẩn thận điền họ tên, quốc tịch và số hộ chiếu. Giao dịch viên đếm tiền rồi đưa cho Mike: 'Mời bạn đếm lại, đây là 3500 nhân dân tệ.' Mike nói: 'Cảm ơn, số tiền hoàn toàn chính xác.'"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "麦克用多少美元换了人民币？",
        qPinyin: "Màikè yòng duōshao Měiyuán huàn le Rénmínbì?",
        qVi: "Mike dùng bao nhiêu đô la Mỹ để đổi nhân dân tệ?",
        aHanzi: "麦克用五百美元换了人民币。",
        aVi: "Mike dùng 500 đô la Mỹ đổi nhân dân tệ."
      }
    ]
  },

  // BÀI 10: 他住哪儿
  "jc_1_1_10": {
    titleHanzi: "留学生公寓与宿管阿姨",
    titlePinyin: "Liúxuéshēng gōngyù yǔ sùguǎn āyí",
    titleVi: "Ký túc xá lưu học sinh và cô quản lý",
    summary: "Cơ sở vật chất tại ký túc xá du học sinh, số tầng, số phòng và sự quan tâm chu đáo của ban quản lý ký túc.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "留学生楼坐落在校园的西北角，周围绿树成荫，环境十分优美。这里的每一栋宿舍楼都有电梯和公共洗衣房，生活非常方便。",
        pinyin: "Liúxuéshēng lóu zuòluò zài xiàoyuán de xīběi jiǎo, zhōuwéi lǜshù chéng yīn, huánjìng shífēn yōuměi. Zhèlǐ de měi yí dòng sùshè lóu dōu yǒu diàntī hé gōnggòng xǐyīfáng, shēnghuó fēicháng fāngbiàn.",
        vi: "Tòa nhà ký túc xá lưu học sinh tọa lạc ở góc tây bắc của khuôn viên trường, xung quanh cây xanh rợp bóng, môi trường rất thanh bình và đẹp đẽ. Mỗi tòa ký túc xá ở đây đều có thang máy và phòng giặt chung, sinh hoạt vô cùng thuận tiện."
      },
      {
        paraNum: 2,
        hanzi: "王老师来宿舍看望学生。宿管阿姨热情地告诉他：“麦克住在九号楼八层八零八号房间；保罗住在九层九一二号。” 敲开房门，学生们看见老师亲自来探望，心里都感到格外温暖。",
        pinyin: "Wáng lǎoshī lái sùshè kànwàng xuéshēng. Sùguǎn āyí rèqíng de gàosu tā: “Màikè zhù zài jiǔ hào lóu bā céng bā líng bā hào fángjiān; Bǎoluó zhù zài jiǔ céng jiǔ yī èr hào.” Qiāo kāi fángmén, xuéshēngmen kànjiàn lǎoshī qīnzì lái tànwàng, xīnlǐ dōu gǎndào géwài wēnnuǎn.",
        vi: "Thầy Vương đến ký túc xá thăm học sinh. Cô quản lý nhiệt tình chỉ dẫn: 'Mike ở phòng 808 tầng 8 tòa nhà số 9; Paul ở phòng 912 tầng 9.' Gõ cửa phòng, nhìn thấy thầy giáo đích thân đến thăm, các học trò đều cảm thấy trong lòng vô cùng ấm áp."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "麦克住在几号楼几层？",
        qPinyin: "Màikè zhù zài jǐ hào lóu jǐ céng?",
        qVi: "Mike sống ở tầng mấy tòa nhà số mấy?",
        aHanzi: "麦克住在九号楼八层八零八号房间。",
        aVi: "Mike sống ở phòng 808 tầng 8 tòa nhà số 9."
      }
    ]
  },

  // BÀI 11: 我们都是留学生
  "jc_1_1_11": {
    titleHanzi: "在汉语角相识的年轻朋友",
    titlePinyin: "Zài Hànyǔ jiǎo xiāngshí de niánqīng péngyou",
    titleVi: "Những người bạn trẻ quen nhau tại Góc tiếng Hán",
    summary: "Hoạt động giao lưu cuối tuần tại Góc Tiếng Hán của trường, các sinh viên tự giới thiệu ngành học và cùng kết bạn.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "每周五晚上，图书馆前面的小花园都会举办“汉语角”活动。许多中国学生和外国留学生都会来到这里，大家聚在一起开心地聊天。",
        pinyin: "Měi zhōu wǔ wǎnshang, túshūguǎn qiánmiàn de xiǎo huāyuán dōu huì jǔbàn “Hànyǔ jiǎo” huódòng. Xǔduō Zhōngguó xuéshēng hé wàiguó liúxuéshēng dōu huì lái dào zhèlǐ, dàjiā jù zài yìqǐ kāixīn de liáotiān.",
        vi: "Mỗi tối thứ sáu, khu vườn nhỏ trước thư viện đều tổ chức hoạt động 'Góc tiếng Hán'. Rất nhiều sinh viên Trung Quốc và lưu học sinh nước ngoài đều đến đây tụ họp trò chuyện vui vẻ."
      },
      {
        paraNum: 2,
        hanzi: "罗兰向大家介绍自己：“我是法国留学生，来中国学习中国文学。他们也是留学生，保罗来自澳大利亚，学习国际贸易。我们都是在北京语言大学学习的留学生。” 大家纷纷鼓掌，欢笑声在花园里久久回荡。",
        pinyin: "Luólán xiàng dàjiā jièshào zìjǐ: “Wǒ shì Fǎguó liúxuéshēng, lái Zhōngguó xuéxí Zhōngguó wénxué. Tāmen yě shì liúxuéshēng, Bǎoluó láizì Àodàlìyà, xuéxí guójì màoyì. Wǒmen dōu shì zài Běijīng Yǔyán Dàxué xuéxí de liúxuéshēng.” Dàjiā fēnfēn gǔzhǎng, huānxiàoshēng zài huāyuán lǐ jiǔjiǔ huídàng.",
        vi: "Roland giới thiệu bản thân trước mọi người: 'Tôi là du học sinh Pháp, đến Trung Quốc để học văn học Trung Quốc. Các bạn ấy cũng là lưu học sinh, Paul đến từ Úc, học ngành thương mại quốc tế. Chúng tôi đều là lưu học sinh đang theo học tại ĐH Ngôn ngữ Bắc Kinh.' Mọi người nhiệt liệt vỗ tay, tiếng cười rộn rã vang vọng trong vườn."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "罗兰来自哪个国家？她学习什么专业？",
        qPinyin: "Luólán láizì nǎge guójiā? Tā xuéxí shénme zhuānyè?",
        qVi: "Roland đến từ nước nào? Cô ấy học chuyên ngành gì?",
        aHanzi: "罗兰来自法国，她学习中国文学。",
        aVi: "Roland đến từ Pháp, cô ấy học văn học Trung Quốc."
      }
    ]
  },

  // BÀI 12: 你在哪儿学习
  "jc_1_1_12": {
    titleHanzi: "北京语言大学的求学生活",
    titlePinyin: "Běijīng Yǔyán Dàxué de qiúxué shēnghuó",
    titleVi: "Đời sống học tập tại Đại học Ngôn ngữ Bắc Kinh",
    summary: "Đặc điểm môi trường học tập đa văn hóa, các thầy cô giáo giảng dạy tận tình và trang thiết bị hiện đại.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "北京语言大学是一所著名的国际化大学，被誉为“小小联合国”。来自一百四十多个国家和地区的留学生在这里共同学习和生活。",
        pinyin: "Běijīng Yǔyán Dàxué shì yì suǒ zhùmíng de guójìhuà dàxué, bèi yù wéi “Xiǎoxiǎo Liánhéguó”. Láizì yībǎi sìshí duō ge guójiā hé dìqū de liúxuéshēng zài zhèlǐ gòngtóng xuéxí hé shēnghuó.",
        vi: "Đại học Ngôn ngữ Bắc Kinh là trường đại học quốc tế hóa nổi tiếng, được ví như một 'Liên Hợp Quốc thu nhỏ'. Lưu học sinh từ hơn 140 quốc gia và vùng lãnh thổ cùng nhau học tập và sinh hoạt tại đây."
      },
      {
        paraNum: 2,
        hanzi: "这里的老师教学经验十分丰富，对学生既严格又关心。学校图书馆藏书丰富，还配有现代化的多媒体语音教室。留学生们不仅学到了标准流利的汉语，还结识了来自世界各地的好朋友。",
        pinyin: "Zhèlǐ de lǎoshī jiàoxué jīngyàn shífēn fēngfù, duì xuéshēng jì yángé yòu guānxīn. Xuéxiào túshūguǎn cángshū fēngfù, hái pèi yǒu xiàndàihuà de duōméitǐ yǔyīn jiàoshì. Liúxuéshēngmen bùjǐn xuédào le biāozhǔn liúlì de Hànyǔ, hái jiéshí le láizì shìjiè gèdì de hǎo péngyou.",
        vi: "Các thầy cô ở đây có kinh nghiệm giảng dạy vô cùng phong phú, với học sinh vừa nghiêm khắc vừa ân cần. Thư viện trường sách vở dồi dào, lại trang bị phòng học âm ngữ đa phương tiện hiện đại. Du học sinh không chỉ học được tiếng Hán chuẩn mực trôi chảy mà còn kết giao được nhiều bạn tốt bốn phương."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "为什么北京语言大学被称为“小小联合国”？",
        qPinyin: "Wèishénme Běijīng Yǔyán Dàxué bèi chēng wéi “Xiǎoxiǎo Liánhéguó”?",
        qVi: "Tại sao ĐH Ngôn ngữ Bắc Kinh được mệnh danh là 'Liên Hợp Quốc thu nhỏ'?",
        aHanzi: "因为这里有来自一百四十多个国家和地区的留学生。",
        aVi: "Bởi vì nơi đây có du học sinh đến từ hơn 140 quốc gia và vùng lãnh thổ."
      }
    ]
  },

  // BÀI 13: 这是不是中药
  "jc_1_1_13": {
    titleHanzi: "海关行李检查趣事",
    titlePinyin: "Hǎiguān xínglǐ jiǎnchá qùshì",
    titleVi: "Chuyện vui khi kiểm tra hành lý hải quan",
    summary: "Hộp hành lý của sinh viên mang theo trà, từ điển, đĩa nhạc và một hộp thảo dược đông y cổ truyền gây tò mò.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "玛丽从家乡回到北京，行李箱沉甸甸的。在海关检查口，工作人员礼貌地请她打开箱子进行例行安全检查。",
        pinyin: "Mǎlì cóng jiāxiāng huí dào Běijīng, xínglǐxiāng chéndiàndiàn de. Zài hǎiguān jiǎnchákǒu, gōngzuò rényuán lǐmào de qǐng tā dǎkāi xiāngzi jìnxíng lìxíng ānquán jiǎnchá.",
        vi: "Mary từ quê nhà trở lại Bắc Kinh, vali hành lý nặng trĩu. Tại cửa kiểm tra hải quan, nhân viên lịch sự mời cô mở vali để làm thủ tục kiểm tra an ninh thường lệ."
      },
      {
        paraNum: 2,
        hanzi: "箱子里有几件厚衣服、两本厚厚的中英词典，还有一盒散发着草药香味的小纸包。检查员好奇地问：“这是不是中药？” 玛丽笑着解释：“这不是西药，这是我妈妈在中国买的中药草茶，对胃很好。” 检查员笑着点头祝她在中国生活愉快。",
        pinyin: "Xiāngzi lǐ yǒu jǐ jiàn hòu yīfu, liǎng běn hòuhòu de Zhōng-Yīng cídiǎn, hái yǒu yì hé sànfā zhe cǎoyào xiāngwèi de xiǎo zhǐbāo. Jiǎncháyuán hàoqí de wèn: “Zhè shì bu shì zhōngyào?” Mǎlì xiào zhe jiěshì: “Zhè bú shì xīyào, zhè shì wǒ māma zài Zhōngguó mǎi de zhōngyàocǎochá, duì wèi hěn hǎo.” Jiǎncháyuán xiào zhe diǎntóu zhù tā zài Zhōngguó shēnghuó yúkuài.",
        vi: "Trong vali có vài bộ quần áo dày, hai cuốn từ điển Trung-Anh dày cộm, cùng một hộp gói giấy nhỏ tỏa hương thảo mộc. Người kiểm tra tò mò hỏi: 'Đây có phải thuốc bắc không?' Mary mỉm cười giải thích: 'Đây không phải thuốc tây, đây là trà thảo dược đông y mẹ em mua ở Trung Quốc, rất tốt cho dạ dày ạ.' Người kiểm tra mỉm cười gật đầu chúc cô có cuộc sống vui vẻ tại Trung Quốc."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "玛丽箱子里的小纸包是什么？",
        qPinyin: "Mǎlì xiāngzi lǐ de xiǎo zhǐbāo shì shénme?",
        qVi: "Gói giấy nhỏ trong vali Mary là gì?",
        aHanzi: "是她妈妈买的中药草茶。",
        aVi: "Là trà thảo dược đông y mẹ cô ấy mua."
      }
    ]
  },

  // BÀI 14: 你的车是新的还是旧的
  "jc_1_1_14": {
    titleHanzi: "大学校园里的自行车之海",
    titlePinyin: "Dàxué xiàoyuán lǐ de zìxíngchē zhī hǎi",
    titleVi: "Biển xe đạp trong khuôn viên đại học",
    summary: "Phương tiện đi lại phổ biến của sinh viên Trung Quốc và lưu học sinh, câu chuyện tìm chiếc xe đạp xanh bị dựng lẫn.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "北京的大学校园非常大，从宿舍到教学楼要走二十多分钟。因此，骑自行车是老师和同学们最喜欢的代步方式。教学楼前整整齐齐地停放着几百辆各种颜色的自行车。",
        pinyin: "Běijīng de dàxué xiàoyuán fēicháng dà, cóng sùshè dào jiàoxuélóu yào zǒu èrshí duō fēnzhōng. Yīncǐ, qí zìxíngchē shì lǎoshī hé tóngxuémen zuì xǐhuan de dàibù fāngshì. Jiàoxuélóu qián zhěngzhěng-qíqí de tíngfàng zhe jǐ bǎi liàng gè zhǒng yánsè de zìxíngchē.",
        vi: "Khuôn viên các trường đại học ở Bắc Kinh rất rộng lớn, đi bộ từ ký túc xá đến khu giảng đường mất hơn 20 phút. Vì vậy, đạp xe là phương tiện di chuyển được thầy cô và sinh viên ưa chuộng nhất. Trước giảng đường xếp ngay ngắn hàng trăm chiếc xe đạp đủ màu sắc."
      },
      {
        paraNum: 2,
        hanzi: "下课后，田芳陪爱德华在车棚找车。爱德华的车是一辆蓝色的旧自行车。田芳指着前面问：“你的车是那辆崭新的还是这辆旧的？” 爱德华指着角落：“那辆蓝色的旧车才是我的，旧车不容易丢！” 两人相视而笑。",
        pinyin: "Xiàkè hòu, Tián Fāng péi Àidéhuá zài chēpéng zhǎo chē. Àidéhuá de chē shì yí liàng lánsè de jiù zìxíngchē. Tián Fāng zhǐ zhe qiánmiàn wèn: “Nǐ de chē shì nà liàng zhǎnxīn de háishi zhè liàng jiù de?” Àidéhuá zhǐ zhe jiǎoluò: “Nà liàng lánsè de jiù chē cái shì wǒ de, jiù chē bù róngyì diū!” Liǎng rén xiāng shì ér xiào.",
        vi: "Sau khi tan học, Điền Phương cùng Edward đến nhà xe tìm xe. Xe của Edward là một chiếc xe đạp cũ màu xanh lam. Điền Phương chỉ về phía trước hỏi: 'Xe của cậu là chiếc mới toanh đằng kia hay chiếc cũ này?' Edward chỉ vào góc: 'Chiếc xe cũ màu xanh kia mới là của mình, xe cũ khó bị mất cắp hơn!' Cả hai cùng nhìn nhau cười."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "爱德华的自行车是什么颜色？是新的还是旧的？",
        qPinyin: "Àidéhuá de zìxíngchē shì shénme yánsè? Shì xīn de háishi jiù de?",
        qVi: "Xe đạp của Edward màu gì? Là xe mới hay xe cũ?",
        aHanzi: "爱德华的自行车是蓝色的，是旧的。",
        aVi: "Xe đạp của Edward màu xanh lam, là xe cũ."
      }
    ]
  },

  // BÀI 15: 你们公司有多少职员
  "jc_1_1_15": {
    titleHanzi: "跨国贸易公司的拜访",
    titlePinyin: "Kuàguó màoyì gōngsī de bàifǎng",
    titleVi: "Chuyến thăm công ty thương mại đa quốc gia",
    summary: "Thực tập sinh tham quan văn phòng công ty thương mại Trung - Ngoại, tìm hiểu cơ cấu nhân sự và các phòng ban.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "为了把课堂学到的汉语知识应用到实践中，保罗和麦克今天去参观了一家中美合资的进出口贸易公司。公司坐落在北京朝阳区的高档写字楼里。",
        pinyin: "Wèile bǎ kètáng xuédào de Hànyǔ zhīshi yìngyòng dào shíjiàn zhōng, Bǎoluó hé Màikè jīntiān qù cānguān le yì jiā Zhōng-Měi hézī de jìnchūkǒu màoyì gōngsī. Gōngsī zuòluò zài Běijīng Cháoyáng Qū de gāodàng xièzìlóu lǐ.",
        vi: "Để ứng dụng kiến thức tiếng Hán học trên lớp vào thực tiễn, hôm nay Paul và Mike đã đến tham quan một công ty thương mại xuất nhập khẩu liên doanh Trung - Mỹ. Công ty tọa lạc trong tòa cao ốc văn phòng cao cấp tại quận Triều Dương, Bắc Kinh."
      },
      {
        paraNum: 2,
        hanzi: "公司的人事部经理热情地接待了他们。经理解绍说：“我们公司规模不算太大，一共有大约一百个员工。中国职员有八十多个，外国专家有十多个。大家用中英双语工作，合作非常愉快。” 两位同学对现代中国的商务发展留下了深刻的印象。",
        pinyin: "Gōngsī de rénshìbù jīnglǐ rèqíng de jiēdài le tāmen. Jīnglǐ jièshào shuō: “Wǒmen gōngsī guīmó bú suàn tài dà, yígòng yǒu dàyuē yìbǎi ge yuángōng. Zhōngguó zhíyuán yǒu bāshí duō ge, wàiguó zhuānjiā yǒu shí duō ge. Dàjiā yòng Zhōng-Yīng shuāngyǔ gōngzuò, hézuò fēicháng yúkuài.” Liǎng wèi tóngxué duì xiàndài Zhōngguó de shāngwù fāzhǎn liúxià le shēnkè de yìnxiàng.",
        vi: "Trưởng phòng nhân sự của công ty đã nhiệt tình đón tiếp họ. Người quản lý giới thiệu: 'Quy mô công ty chúng tôi không quá lớn, có tổng cộng khoảng 100 nhân viên. Nhân viên Trung Quốc có hơn 80 người, chuyên gia nước ngoài có hơn 10 người. Mọi người làm việc bằng song ngữ Trung - Anh, hợp tác vô cùng ăn ý.' Hai bạn học đã có ấn tượng sâu sắc về sự phát triển thương mại của Trung Quốc hiện đại."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "这家合资公司一共有多少员工？",
        qPinyin: "Zhè jiā hézī gōngsī yígòng yǒu duōshao yuángōng?",
        qVi: "Công ty liên doanh này có tổng cộng bao nhiêu nhân viên?",
        aHanzi: "大约有一百个员工。",
        aVi: "Khoảng 100 nhân viên."
      }
    ]
  },

  // BÀI 16: 你常去图书馆吗
  "jc_1_2_16": {
    titleHanzi: "图书馆里的自习时光",
    titlePinyin: "Túshūguǎn lǐ de zìxí shíguāng",
    titleVi: "Thời gian tự học trong thư viện",
    summary: "Thói quen đến thư viện mượn tài liệu, tra cứu từ điển và tự học buổi tối của lưu học sinh.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "语言大学的图书馆是一座六层高的大楼，里面宽敞安静，藏书丰富。每天下午和晚上，自习室里都坐满了认真学习的学生。",
        pinyin: "Yǔyán Dàxué de túshūguǎn shì yí zuò liù céng gāo de dàlóu, lǐmiàn kuānchǎng ānjìng, cángshū fēngfù. Měitiān xiàwǔ hé wǎnshang, zìxíshì lǐ dōu zuò mǎn le rènzhēn xuéxí de xuéshēng.",
        vi: "Thư viện Đại học Ngôn ngữ là tòa nhà 6 tầng, bên trong rộng rãi yên tĩnh, sách báo phong phú. Mỗi buổi chiều và buổi tối, các phòng tự học đều chật kín sinh viên đang chăm chú học tập."
      },
      {
        paraNum: 2,
        hanzi: "玛丽和麦克经常一起来这里。玛丽喜欢在二楼阅览室读中文报刊和杂志，遇到不认识的生词就用电子词典查一查；麦克则喜欢借中国历史和地理方面的书籍。他们觉得，在安静的图书馆里学习，效率比在宿舍高得多。",
        pinyin: "Mǎlì hé Màikè jīngcháng yìqǐ lái zhèlǐ. Mǎlì xǐhuan zài èr céng yuèlǎnshì dú Zhōngwén bàokān hé zázhì, yù dào bù rènshi de shēngcí jiù yòng diànzǐ cídiǎn chá yi chá; Màikè zé xǐhuan jiè Zhōngguó lìshǐ hé dìlǐ fāngmiàn de shūjí. Tāmen juéde, zài ānjìng de túshūguǎn lǐ xuéxí, xiàolǜ bǐ zài sùshè gāo de duō.",
        vi: "Mary và Mike thường xuyên cùng nhau đến đây. Mary thích đọc báo chí và tạp chí tiếng Trung ở phòng đọc tầng 2, gặp từ mới không biết liền dùng từ điển điện tử tra cứu; còn Mike thích mượn sách về lịch sử và địa lý Trung Quốc. Họ nhận thấy, học trong thư viện yên tĩnh hiệu quả cao hơn ở ký túc xá rất nhiều."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "玛丽在图书馆二楼阅览室做什么？",
        qPinyin: "Mǎlì zài túshūguǎn èr céng yuèlǎnshì zuò shénme?",
        qVi: "Mary làm gì ở phòng đọc tầng hai của thư viện?",
        aHanzi: "玛丽读中文报刊和杂志，遇到生词查词典。",
        aVi: "Mary đọc báo chí và tạp chí tiếng Trung, gặp từ mới thì tra từ điển."
      }
    ]
  },

  // BÀI 17: 他在做什么呢
  "jc_1_2_17": {
    titleHanzi: "宿舍楼里的周五夜晚",
    titlePinyin: "Sùshè lóu lǐ de zhōuwǔ yèwǎn",
    titleVi: "Đêm thứ sáu trong khu ký túc xá",
    summary: "Những hoạt động phong phú của sinh viên khi bước vào kỳ nghỉ cuối tuần: nghe nhạc, chat video với gia đình, giặt đồ.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "星期五的晚上，大家没有课业负担，留学生宿舍楼里充满了欢声笑语。走廊里弥漫着咖啡和中国绿茶的清香。",
        pinyin: "Xīngqīwǔ de wǎnshang, dàjiā méiyǒu kèyè fùdān, liúxuéshēng sùshè lóu lǐ chōngmǎn le huānshēng-xiàoyǔ. Zǒuláng lǐ mímàn zhe kāfēi hé Zhōngguó lǜchá de qīngxiāng.",
        vi: "Tối thứ sáu không còn gánh nặng bài vở, khu ký túc xá lưu học sinh tràn ngập tiếng cười nói. Hành lang thoang thoảng hương cà phê và trà xanh Trung Quốc dịu mát."
      },
      {
        paraNum: 2,
        hanzi: "保罗去找同伴玩。他推开爱德华的房门，爱德华正在戴着耳机听中国流行音乐呢；走进麦克的房间，麦克正坐在电脑前跟远在加拿大的父母视频通话；而隔壁的田芳正在水房洗衣服。每个人都在愉快地享受着属于自己的周末时光。",
        pinyin: "Bǎoluó qù zhǎo tóngbàn wán. Tā tuī kāi Àidéhuá de fángmén, Àidéhuá zhèngzài dài zhe ěrjī tīng Zhōngguó liúxíng yīnyuè ne; zǒu jìn Màikè de fángjiān, Màikè zhèng zuò zài diànnǎo qián gēn yuǎn zài Jiānádà de fùmǔ shìpín tōnghuà; ér gébì de Tián Fāng zhèngzài shuǐfáng xǐ yīfu. Měi ge rén dōu zài yúkuài de xiǎngshòu zhe shǔyú zìjǐ de zhōumò shíguāng.",
        vi: "Paul đi tìm bạn chơi. Cậu đẩy cửa phòng Edward, Edward đang đeo tai nghe thưởng thức nhạc pop Trung Quốc; bước vào phòng Mike, Mike đang ngồi trước máy tính gọi video với bố mẹ ở tận Canada; còn bạn Điền Phương bên cạnh thì đang giặt đồ ở phòng nước. Mọi người ai nấy đều đang tận hưởng khoảng thời gian cuối tuần của riêng mình."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "爱德华和麦克周五晚上分别在做什么？",
        qPinyin: "Àidéhuá hé Màikè zhōuwǔ wǎnshang fēnbié zài zuò shénme?",
        qVi: "Tối thứ sáu Edward và Mike đang làm gì?",
        aHanzi: "爱德华在听音乐，麦克在跟父母视频通话。",
        aVi: "Edward đang nghe nhạc, Mike đang gọi video nói chuyện với bố mẹ."
      }
    ]
  },

  // BÀI 18: 我去邮局寄包裹
  "jc_1_2_18": {
    titleHanzi: "寄往家乡的包裹与祝福",
    titlePinyin: "Jì wǎng jiāxiāng de bāoguǒ yǔ zhùfú",
    titleVi: "Bưu phẩm gửi về quê nhà và lời chúc phúc",
    summary: "Đóng gói đặc sản Trung Quốc, trà Long Tỉnh và đồ thủ công để gửi bưu điện hàng không quốc tế về gia đình.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "圣诞节快到了，玛丽打算给远在美国的父母寄一个包裹。包裹里有她在王府井买的杭州西湖龙井茶、景德镇陶瓷茶杯，还有几件有特色的中国剪纸艺术品。",
        pinyin: "Shèngdàn Jié kuài dào le, Mǎlì dǎsuan gěi yuǎn zài Měiguó de fùmǔ jì yí ge bāoguǒ. Bāoguǒ lǐ yǒu tā zài Wángfǔjǐng mǎi de Hángzhōu Xīhú Lóngjǐng chá, Jǐngdézhèn táocí chábēi, hái yǒu jǐ jiàn yǒu tèsè de Zhōngguó jiǎnzhǐ yìshùpǐn.",
        vi: "Lễ Giáng sinh sắp đến, Mary dự định gửi một bưu kiện cho bố mẹ ở Mỹ. Trong bưu kiện có trà Long Tỉnh Tây Hồ Hàng Châu cô mua ở Vương Phủ Tỉnh, tách trà gốm sứ Cảnh Đức Trấn và vài tác phẩm cắt giấy nghệ thuật độc đáo của Trung Quốc."
      },
      {
        paraNum: 2,
        hanzi: "来到邮局，工作人员热心地帮她把物品装进坚固的纸箱里，并用胶带封好。玛丽填写了国际航空特快专递单。工作人员称重后告诉她：“包裹两公斤半，邮费一共两百三十元，大约一周就能寄到。” 玛丽放心地笑了，期待着父母收到礼物时的喜悦。",
        pinyin: "Lái dào yóujú, gōngzuò rényuán rèxīn de bāng tā bǎ wùpǐn zhuāng jìn jiāngù de zhǐxiāng lǐ, bìng yòng jiāodài fēng hǎo. Mǎlì tiánxiě le guójì hángkōng tèkuài zhuāndì dān. Gōngzuò rényuán chēng zhòng hòu gàosu tā: “Bāoguǒ liǎng gōngjīn bàn, yóufèi yígòng liǎngbǎi sānshí yuán, dàyuē yì zhōu jiù néng jì dào.” Mǎlì fàngxīn de xiào le, qīdài zhe fùmǔ shōudào lǐwù shí de xǐyuè.",
        vi: "Đến bưu điện, nhân viên nhiệt tình giúp cô xếp đồ đạc vào thùng carton chắc chắn và dán băng dính kỹ lưỡng. Mary điền vào phiếu chuyển phát nhanh hàng không quốc tế. Nhân viên cân xong báo với cô: 'Kiện hàng nặng 2,5 kg, cước bưu điện tổng cộng 230 đồng, khoảng một tuần là gửi tới nơi.' Mary yên tâm mỉm cười, háo hức chờ đợi niềm vui của bố mẹ khi nhận quà."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "玛丽的包裹里装了哪些中国礼物？",
        qPinyin: "Mǎlì de bāoguǒ lǐ zhuāng le nǎxiē Zhōngguó lǐwù?",
        qVi: "Bưu phẩm của Mary chứa những món quà Trung Quốc nào?",
        aHanzi: "装了西湖龙井茶、陶瓷茶杯和中国剪纸艺术品。",
        aVi: "Chứa trà Long Tỉnh Tây Hồ, chén trà gốm sứ và tác phẩm nghệ thuật cắt giấy Trung Quốc."
      }
    ]
  },

  // BÀI 19: 可以试试吗
  "jc_1_2_19": {
    titleHanzi: "商场里的试穿与挑选",
    titlePinyin: "Shāngchǎng lǐ de shìchuān yǔ tiāoxuǎn",
    titleVi: "Thử đồ và lựa chọn trong trung tâm thương mại",
    summary: "Thời tiết Bắc Kinh chuyển lạnh vào đầu đông, du học sinh đi mua sắm áo len, áo phao và hỏi cách thử kích cỡ.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "十一月的北京，天气渐渐转冷了，秋风吹在脸上带来丝丝凉意。留学生罗兰只带了薄衣服，所以星期天下午她拉着好朋友田芳一起去百货商场买冬衣。",
        pinyin: "Shíyī yuè de Běijīng, tiānqì jiànjiàn zhuǎn lěng le, qiūfēng chuī zài liǎn shang dàilái sīsī liángyì. Liúxuéshēng Luólán zhǐ dài le báo yīfu, suǒyǐ xīngqītiān xiàwǔ tā lā zhe hǎo péngyou Tián Fāng yìqǐ qù bǎihuò shāngchǎng mǎi dōngyī.",
        vi: "Tháng 11 ở Bắc Kinh, thời tiết dần dần chuyển lạnh, gió thu thổi vào mặt mang theo những đợt se lạnh. Lưu học sinh Roland chỉ mang quần áo mỏng, vì vậy chiều chủ nhật cô rủ người bạn thân Điền Phương cùng đến trung tâm bách hóa mua đồ mùa đông."
      },
      {
        paraNum: 2,
        hanzi: "在服装专柜，罗兰看中了一件红色的纯羊毛毛衣。售货员热情地走上前：“小姐，这件毛衣质地很好，您可以试穿一下。” 罗兰穿上后走到镜子前照了照，田芳连连赞叹：“颜色真好看，大小也非常合适！” 罗兰高兴地买下了这件温暖的新毛衣。",
        pinyin: "Zài fúzhuāng zhuānguì, Luólán kànzhòng le yí jiàn hóngsè de chún yángmáo máoyī. Shòuhuòyuán rèqíng de zǒu shàngqián: “Xiǎojiě, zhè jiàn máoyī zhìdì hěn hǎo, nín kěyǐ shìchuān yíxià.” Luólán chuān shàng hòu zǒu dào jìngzi qián zhào le zhào, Tián Fāng liánlián zàntàn: “Yánsè zhēn hǎokàn, dàxiǎo yě fēicháng héshì!” Luólán gāoxìng de mǎixià le zhè jiàn wēnnuǎn de xīn máoyī.",
        vi: "Tại quầy trang phục, Roland vừa mắt một chiếc áo len lông cừu màu đỏ. Nhân viên bán hàng nhiệt tình bước tới: 'Thưa cô, chiếc áo len này chất liệu rất tốt, cô có thể mặc thử một chút.' Roland mặc vào rồi đứng trước gương ngắm nghía, Điền Phương tấm tắc khen: 'Màu sắc đẹp thật đấy, kích cỡ cũng vừa vặn vô cùng!' Roland vui sướng thanh toán chiếc áo len ấm áp này."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "罗兰在百货商场买了什么颜色的毛衣？",
        qPinyin: "Luólán zài bǎihuò shāngchǎng mǎi le shénme yánsè de máoyī?",
        qVi: "Roland mua áo len màu gì ở trung tâm thương mại?",
        aHanzi: "罗兰买了一件红色的纯羊毛毛衣。",
        aVi: "Roland đã mua một chiếc áo len lông cừu nguyên chất màu đỏ."
      }
    ]
  },

  // BÀI 20: 祝你生日快乐
  "jc_1_2_20": {
    titleHanzi: "难忘的二十岁生日晚会",
    titlePinyin: "Nánwàng de èrshí suì shēngrì wǎnhuì",
    titleVi: "Bữa tiệc sinh nhật tuổi 20 khó quên",
    summary: "Bữa tiệc sinh nhật bất ngờ của Mary với nến, bánh ngọt, mì trường thọ và những lời chúc tốt đẹp từ thầy cô, bè bạn.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "十月二十八日是玛丽的二十岁生日。同学们在宿舍里为她悄悄准备了一个惊喜派对。大家把房间装饰得五彩缤纷，墙上挂满了彩带和气球。",
        pinyin: "Shí yuè èrshíbā rì shì Mǎlì de èrshí suì shēngrì. Tóngxuémen zài sùshè lǐ wèi tā qiāoqiāo zhǔnbèi le yí ge jīngxǐ pàiduì. Dàjiā bǎ fángjiān zhuāngshì de wǔcǎi-bīnfēn, qiáng shang guà mǎn le cǎidài hé qìqiú.",
        vi: "Ngày 28 tháng 10 là sinh nhật tròn 20 tuổi của Mary. Các bạn học trong ký túc xá đã âm thầm chuẩn bị một bữa tiệc bất ngờ cho cô. Căn phòng được trang trí rực rỡ sắc màu, trên tường treo đầy dây ruy băng và bóng bay."
      },
      {
        paraNum: 2,
        hanzi: "当玛丽推开门时，大家齐声唱起《祝你生日快乐》歌。张东送上了专门为她煮的中国“长寿面”，象征健康长寿；麦克端出了插着蜡烛的巧克力大蛋糕。玛丽闭上眼睛许愿，吹灭了蜡烛。她激动地说：“这是我一生中最难忘的生日！”",
        pinyin: "Dāng Mǎlì tuī kāi mén shí, dàjiā qí shēng chàng qǐ “Zhù nǐ shēngrì kuàilè” gē. Zhāng Dōng sòng shàng le zhuānmén wèi tā zhǔ de Zhōngguó “chángshòumiàn”, xiàngzhēng jiànkāng chángshòu; Màikè duān chū le chā zhe làzhú de qiǎokèlì dà dàngāo. Mǎlì bì shàng yǎnjing xǔyuàn, chuī miè le làzhú. Tā jīdòng de shuō: “Zhè shì wǒ yì shēng zhōng zuì nánwàng de shēngrì!”",
        vi: "Khi Mary mở cửa, cả phòng đồng thanh cất vang bài hát 'Chúc mừng sinh nhật'. Trương Đông bưng tới bát 'Mì trường thọ' Trung Hoa đặc biệt nấu riêng cho cô biểu thị sức khỏe trường thọ; Mike bê ra chiếc bánh kem sô-cô-la lớn cắm nến lung linh. Mary nhắm mắt ước nguyện rồi thổi tắt nến. Cô xúc động nói: 'Đây là sinh nhật đáng nhớ nhất trong cuộc đời mình!'"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "中国朋友送给玛丽什么传统的生日祝福食品？",
        qPinyin: "Zhōngguó péngyou sòng gěi Mǎlì shénme chuántǒng de shēngrì zhùfú shípǐn?",
        qVi: "Người bạn Trung Quốc tặng Mary món ăn chúc thọ truyền thống nào?",
        aHanzi: "送给她一碗象征长寿的中国“长寿面”。",
        aVi: "Tặng cô ấy một bát 'Mì trường thọ' tượng trưng cho sống lâu trăm tuổi."
      }
    ]
  },

  // BÀI 21: 明天我们七点一刻出发
  "jc_1_2_21": {
    titleHanzi: "登长城的出发准备",
    titlePinyin: "Dēng Chángchéng de chūfā zhǔnbèi",
    titleVi: "Chuẩn bị xuất phát leo Vạn Lý Trường Thành",
    summary: "Cả lớp tổ chức đi tham quan Bát Đạt Lĩnh - Trường Thành, hẹn giờ tập trung, xe đưa đón và đồ dùng cần mang theo.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "中国有句古话叫：“不到长城非好汉。” 这个星期六，留学生学院组织全体同学去八达岭登长城。大家都兴奋极了，纷纷提前做好各项准备。",
        pinyin: "Zhōngguó yǒu jù gǔhuà jiào: “Bú dào Chángchéng fēi hǎohàn.” Zhè ge xīngqīliù, liúxuéshēng xuéyuàn zǔzhī quántǐ tóngxué qù Bādǎlǐng dēng Chángchéng. Dàjiā dōu xīngfèn jí le, fēnfēn tíqián zuò hǎo gè xiàng zhǔnbèi.",
        vi: "Trung Quốc có câu ngạn ngữ cổ: 'Bất đáo Trường Thành phi hảo hán' (Chưa tới Trường Thành chưa phải trang hảo hán). Thứ bảy tuần này, viện lưu học sinh tổ chức cho toàn thể học viên đi leo Trường Thành Bát Đạt Lĩnh. Mọi người đều háo hức khôn xiết, ai nấy đều chuẩn bị chu đáo từ trước."
      },
      {
        paraNum: 2,
        hanzi: "班长在班会上叮嘱大家：“明天早晨七点一刻准时在教学楼前集合上车，大家千万不要迟到。长城上风大路陡，请穿舒适的运动鞋，带好保暖外套和水。” 同学们都牢记在心，期待着明天饱览壮丽的长城风光。",
        pinyin: "Bānzhǎng zài bānhuì shang dīngzhǔ dàjiā: “Míngtiān zǎochén qī diǎn yí kè zhǔnshí zài jiàoxuélóu qián jíhé shàngchē, dàjiā qiānwàn bú yào chídào. Chángchéng shang fēng dà lù dǒu, qǐng chuān shūshì de yùndòngxié, dài hǎo bǎonuǎn wàitào hé shuǐ.” Tóngxuémen dōu láojì zài xīn, qīdài zhe míngtiān bǎolǎn zhuànglì de Chángchéng fēngguāng.",
        vi: "Lớp trưởng dặn dò cả lớp trong buổi họp: 'Sáng mai đúng 7 giờ 15 phút tập trung lên xe trước giảng đường, mọi người tuyệt đối không được đến muộn. Trên Trường Thành gió lớn và dốc cao, xin hãy đi giày thể thao thoải mái, mang theo áo khoác ấm và nước uống.' Các bạn học đều ghi nhớ trong lòng, mong chờ ngày mai được chiêm ngưỡng phong cảnh hùng vĩ của Trường Thành."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "明天大家集合的时间是几点几分？去什么地方？",
        qPinyin: "Míngtiān dàjiā jíhé de shíjiān shì jǐ diǎn jǐ fēn? Qù shénme dìfang?",
        qVi: "Thời gian tập trung ngày mai là mấy giờ mấy phút? Đi đến địa điểm nào?",
        aHanzi: "明早七点一刻集合，去八达岭长城。",
        aVi: "Sáng mai 7 giờ 15 tập trung, đi Vạn Lý Trường Thành Bát Đạt Lĩnh."
      }
    ]
  },

  // BÀI 22: 我打算去旅行
  "jc_1_2_22": {
    titleHanzi: "寒假古都旅行计划",
    titlePinyin: "Hánjià gǔdū lǚxíng jìhuà",
    titleVi: "Kế hoạch du lịch cố đô trong kỳ nghỉ đông",
    summary: "Lựa chọn các điểm đến nổi tiếng: Tây An, Thượng Hải, Quế Lâm và trải nghiệm đi lại bằng tàu hỏa cao tốc hiện đại.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "还有一个星期就要放寒假了。留学生们都在热烈地讨论着假期的旅行计划。有人想去南方的海南岛享受温暖的阳光，有人想去哈尔滨看冰灯雪雕。",
        pinyin: "Hái yǒu yí ge xīngqī jiù yào fàng hánjià le. Liúxuéshēngmen dōu zài rèliè de tǎolùn zhe jiàqī de lǚxíng jìhuà. Yǒu rén xiǎng qù nánfāng de Hǎinándǎo xiǎngshòu wēnnuǎn de yángguāng, yǒu rén xiǎng qù Hā'ěrbīn kàn bīngdēng xuědiāo.",
        vi: "Chỉ còn một tuần nữa là được nghỉ đông. Các bạn lưu học sinh đang hào hứng bàn luận về kế hoạch du lịch cho kỳ nghỉ. Có bạn muốn đến đảo Hải Nam phương nam để tận hưởng nắng ấm, có bạn muốn đi Cáp Nhĩ Tân ngắm đèn băng và tượng điêu khắc tuyết."
      },
      {
        paraNum: 2,
        hanzi: "麦克和爱德华决定结伴去历史名城西安旅行。他们打算坐高铁去，亲自看看举世闻名的秦始皇兵马俑和大雁塔，顺便品尝地道的西安羊肉泡馍。爱德华说：“通过旅行，我们能更深入地了解中国悠久的历史和文化。”",
        pinyin: "Màikè hé Àidéhuá juédìng jiébàn qù lìshǐ míngchéng Xī'ān lǚxíng. Tāmen dǎsuan zuò gāotiě qù, qīnzì kànkan jǔshì-wénmíng de Qínshǐhuáng bīngmǎyǒng hé Dàyàntǎ, shùnbiàn pǐncháng dìdao de Xī'ān yángròupàomó. Àidéhuá shuō: “Tōngguò lǚxíng, wǒmen néng gèng shēnrù de liǎojiě Zhōngguó yōujiǔ de lìshǐ hé wénhuà.”",
        vi: "Mike và Edward quyết định cùng nhau đi du lịch cố đô lịch sử Tây An. Họ dự định đi bằng tàu cao tốc, tận mắt chiêm ngưỡng Binh Mã Dũng Tần Thủy Hoàng và Tháp Đại Nhạn vang danh thế giới, tiện thể nếm thử món canh thịt cừu bánh mì ngâm Tây An chính gốc. Edward nói: 'Thông qua du lịch, chúng mình có thể hiểu sâu sắc hơn về lịch sử và văn hóa lâu đời của Trung Hoa.'"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "麦克和爱德华打算去哪里旅行？他们想看什么？",
        qPinyin: "Màikè hé Àidéhuá dǎsuan qù nǎli lǚxíng? Tāmen xiǎng kàn shénme?",
        qVi: "Mike và Edward dự định đi du lịch ở đâu? Họ muốn xem gì?",
        aHanzi: "他们打算去西安，想看秦始皇兵马俑和大雁塔。",
        aVi: "Họ dự định đi Tây An, muốn xem Binh Mã Dũng Tần Thủy Hoàng và Tháp Đại Nhạn."
      }
    ]
  },

  // BÀI 23: 学校里边有邮局
  "jc_1_2_23": {
    titleHanzi: "大学校园方位与便民设施",
    titlePinyin: "Dàxué xiàoyuán fāngwèi yǔ biànmín shèshī",
    titleVi: "Phương hướng và cơ sở tiện ích trong khuôn viên đại học",
    summary: "Chỉ dẫn đường đi đến bưu điện, siêu thị mini, ngân hàng và sân bóng trong khuôn viên rộng lớn của trường.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "语言大学的校园布局合理，各种生活服务设施一应俱全。新来的留学生只要熟悉了校园方位，日常生活就会感到非常方便。",
        pinyin: "Yǔyán Dàxué de xiàoyuán bùjú hélǐ, gè zhǒng shēnghuó fúwù shèshī yíyīng-jùquán. Xīn lái de liúxuéshēng zhǐyào shúxī le xiàoyuán fāngwèi, rìcháng shēnghuó jiù huì gǎndào fēicháng fāngbiàn.",
        vi: "Khuôn viên Đại học Ngôn ngữ được bố trí rất khoa học, các tiện ích dịch vụ sinh hoạt phục vụ đầy đủ mọi nhu cầu. Tân lưu học sinh chỉ cần quen thuộc với phương hướng khuôn viên trường thì sinh hoạt thường ngày sẽ vô cùng tiện lợi."
      },
      {
        paraNum: 2,
        hanzi: "图书馆的东边是宽阔的田径运动场；运动场的对面是学生第二餐厅。留学生宿舍楼下有校园小超市和洗衣店，而在办公主楼的西侧就有一家中国邮政局。大家寄信、取快递、办业务都无需走出校门，学习和生活环境格外舒适。",
        pinyin: "Túshūguǎn de dōngbian shì kuānkuò de tiánjìng yùndòngchǎng; yùndòngchǎng de duìmiàn shì xuéshēng dì-èr cāntīng. Liúxuéshēng sùshè lóu xià yǒu xiàoyuán xiǎo chāoshì hé xǐyīdiàn, ér zài bàngōng zhǔlóu de xī cè jiù yǒu yì jiā Zhōngguó Yóuzhèngjú. Dàjiā jì xìn, qǔ kuàidì, bàn yèwù dōu wúxū zǒu chū xiàomén, xuéxí hé shēnghuó huánjìng géwài shūshì.",
        vi: "Phía đông thư viện là sân vận động điền kinh rộng lớn; đối diện sân vận động là nhà ăn số 2. Dưới tầng trệt ký túc xá lưu học sinh có siêu thị mini và tiệm giặt ủi, còn phía tây tòa nhà hành chính chính là bưu điện Bưu chính Trung Quốc. Gửi thư, nhận bưu kiện, giao dịch đều không cần rời khỏi cổng trường, môi trường học tập và sinh hoạt rất đỗi tiện nghi."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "学校的邮局在什么位置？",
        qPinyin: "Xuéxiào de yóujú zài shénme wèizhi?",
        qVi: "Bưu điện của trường nằm ở vị trí nào?",
        aHanzi: "在办公主楼的西侧。",
        aVi: "Ở phía tây của tòa nhà hành chính."
      }
    ]
  },

  // BÀI 24: 我想学太极拳
  "jc_1_2_24": {
    titleHanzi: "晨光中的太极拳晨练",
    titlePinyin: "Chénguāng zhōng de tàijíquán chénliàn",
    titleVi: "Buổi sáng luyện tập Thái Cực Quyền trong ánh bình minh",
    summary: "Lợi ích sức khỏe và sự uyển chuyển của Thái Cực Quyền, lưu học sinh bái sư học võ tại sân thể thao buổi sớm.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "每天清晨六点半，校园的小树林里总能看到许多中国老人在打太极拳。他们的动作舒展轻柔，如行云流水，身姿十分优美。",
        pinyin: "Měitiān qīngchén liù diǎn bàn, xiàoyuán de xiǎo shùlín lǐ zǒng néng kàndào xǔduō Zhōngguó lǎorén zài dǎ tàijíquán. Tāmen de dòngzuò shūzhǎn qīngróu, rú xíngyún-liúshuǐ, shēnzī shífēn yōuměi.",
        vi: "Mỗi sáng sớm 6 giờ rưỡi, trong rặng cây nhỏ của khuôn viên trường luôn bắt gặp nhiều người cao tuổi Trung Quốc đang luyện Thái Cực Quyền. Các động tác của họ thư thái nhẹ nhàng, như mây trôi nước chảy, tư thế vô cùng thanh thoát."
      },
      {
        paraNum: 2,
        hanzi: "保罗对中国功夫非常着迷，他主动向一位白胡子的太极师傅请教：“师傅，我想学太极拳，您可以教我吗？” 师傅微笑着说：“太极拳不仅能强身健体，还能修身养性。只要持之以恒，我一定好好教你。” 从那以后，保罗每天早起练拳，不仅体魄健壮了，汉语听说水平也突飞猛进。",
        pinyin: "Bǎoluó duì Zhōngguó gōngfu fēicháng zháomí, tā zhǔdòng xiàng yí wèi bái húzi de tàijí shīfu qǐngjiào: “Shīfu, wǒ xiǎng xué tàijíquán, nín kěyǐ jiāo wǒ ma?” Shīfu wēixiào zhe shuō: “Tàijíquán bùjǐn néng qiángshēn-jiàntǐ, hái néng xiūshēn-yǎngxìng. Zhǐyào chízhīyǐhéng, wǒ yídìng hǎohǎo jiāo nǐ.” Cóng nà yǐhòu, Bǎoluó měitiān zǎoqǐ liànquán, bùjǐn tǐpò jiànzhuàng le, Hànyǔ tīngshuō shuǐpíng yě tūfēi-měngjìn.",
        vi: "Paul rất say mê võ thuật Trung Hoa, cậu chủ động đến thỉnh giáo một vị võ sư râu tóc bạc phơ: 'Thưa sư phụ, con muốn học Thái Cực Quyền, sư phụ có thể dạy con không ạ?' Sư phụ mỉm cười: 'Thái Cực Quyền không chỉ giúp tăng cường thể chất mà còn tu dưỡng tâm tính. Chỉ cần con kiên trì bền bỉ, ta nhất định sẽ chỉ dạy tận tình.' Kể từ đó, Paul ngày nào cũng dậy sớm luyện quyền, không những cơ thể khỏe khoắn mà trình độ nghe nói tiếng Hán cũng tiến bộ vượt bậc."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "师傅说学习太极拳有什么好处？",
        qPinyin: "Shīfu shuō xuéxí tàijíquán yǒu shénme hǎochu?",
        qVi: "Sư phụ nói học Thái Cực Quyền có những lợi ích gì?",
        aHanzi: "不仅能强身健体，还能修身养性。",
        aVi: "Không chỉ tăng cường sức khỏe mà còn bồi dưỡng tâm tính."
      }
    ]
  },

  // BÀI 25: 她学得很好
  "jc_1_2_25": {
    titleHanzi: "留学生才艺汇演上的京剧新星",
    titlePinyin: "Liúxuéshēng cáiyì huìyǎn shang de Jīngjù xīnxīng",
    titleVi: "Ngôi sao Kinh Kịch tại hội diễn tài năng lưu học sinh",
    summary: "Roland luyện tập hát Kinh Kịch Trung Quốc, sử dụng bổ ngữ trạng thái miêu tả sự chăm chỉ và thành công trên sân khấu.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在每年一度的国际文化节才艺汇演中，法国留学生罗兰代表语言学院表演了一段经典的中国京剧选段《贵妃醉酒》。",
        pinyin: "Zài měi nián yí dù de guójì wénhuà jié cáiyì huìyǎn zhōng, Fǎguó liúxuéshēng Luólán dàibiǎo yǔyán xuéyuàn biǎoyǎn le yí duàn jīngdiǎn de Zhōngguó Jīngjù xuǎnduàn “Guìfēi Zuì Jiǔ”.",
        vi: "Trong hội diễn tài năng Lễ hội Văn hóa Quốc tế thường niên, lưu học sinh Pháp Roland đã đại diện viện ngôn ngữ biểu diễn một trích đoạn Kinh Kịch kinh điển mang tên 'Quý Phi Say Rượu'."
      },
      {
        paraNum: 2,
        hanzi: "舞台上，罗兰身着华丽的戏服，唱得字正腔圆，身段动作演得十分传神，赢得了全场师生雷鸣般的掌声。王老师夸赞道：“她平时练得非常刻苦，不仅台词背得熟，唱腔也掌握得极其纯正，真是下足了功夫！” 大家纷纷向她翘起大拇指。",
        pinyin: "Wǔtái shang, Luólán shēnzhuó huálì de xìfú, chàng de zìzhèng-qiāngyuán, shēnduàn dòngzuò yǎn de shífēn chuánshén, yíngdé le quánchǎng shīshēng léimíng bān de zhǎngshēng. Wáng lǎoshī kuāzàn dào: “Tā píngshí liàn de fēicháng kèkǔ, bùjǐn táicí bèi de shú, chàngqiāng yě zhǎngwò de jíqí chúnzhèng, zhēn shì xià zú le gōngfu!” Dàjiā fēnfēn xiàng tā qiào qǐ dàmǔzhǐ.",
        vi: "Trên sân khấu, Roland khoác lên bộ trang phục lộng lẫy, hát tròn vành rõ chữ, từng dáng điệu cử chỉ đều sống động như thật, nhận được những tràng pháo tay giòn giã như sấm dậy của toàn trường. Thầy Vương khen ngợi: 'Em ấy ngày thường tập luyện rất chịu khó, không những học thuộc làu lời thoại mà làn điệu hát cũng nắm bắt vô cùng chuẩn xác, thật là bỏ nhiều công sức!' Mọi người thi nhau giơ ngón tay cái thán phục cô."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "王老师是怎样评价罗兰的京剧表演的？",
        qPinyin: "Wáng lǎoshī shì zěnyàng píngjià Luólán de Jīngjù biǎoyǎn de?",
        qVi: "Thầy Vương đã đánh giá thế nào về màn biểu diễn Kinh Kịch của Roland?",
        aHanzi: "王老师夸她练得刻苦，唱得字正腔圆，动作很传神。",
        aVi: "Thầy Vương khen cô tập luyện chăm chỉ, hát tròn vành rõ chữ, động tác rất có hồn."
      }
    ]
  },

  // BÀI 26: 田芳去哪儿了
  "jc_1_2_26": {
    titleHanzi: "周末寻找好朋友",
    titlePinyin: "Zhōumò xúnzhǎo hǎo péngyou",
    titleVi: "Tìm người bạn tốt vào dịp cuối tuần",
    summary: "Trương Đông và Mary tìm Điền Phương đi nghe hòa nhạc, để lại lời nhắn khi bạn ra ngoài tham gia câu lạc bộ.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "星期六下午，张东买到了两张国家大剧院的民乐音乐会门票，想约田芳一起去欣赏。可是张东打了好几个电话，田芳的手机都处于关机状态。",
        pinyin: "Xīngqīliù xiàwǔ, Zhāng Dōng mǎi dào le liǎng zhāng Guójiā Dà Jùyuàn de mínyuè yīnyuèhuì ménpiào, xiǎng yuē Tián Fāng yìqǐ qù xīnshǎng. Kěshì Zhāng Dōng dǎ le hǎo jǐ ge diànhuà, Tián Fāng de shǒujī dōu chǔyú guānjī zhuàngtài.",
        vi: "Chiều thứ bảy, Trương Đông mua được hai vé hòa nhạc dân tộc tại Nhà hát Lớn Quốc gia, muốn hẹn Điền Phương cùng đi thưởng thức. Nhưng Trương Đông gọi mấy cuộc liền mà điện thoại của Điền Phương đều tắt máy."
      },
      {
        paraNum: 2,
        hanzi: "张东来到田芳的宿舍门口，同屋的玛丽告诉他：“田芳一个小时前去广播电台录制汉语节目了，可能要到傍晚才回来。” 张东拿出一张便条写道：“我买到了今晚七点的民乐演奏会门票，请你回来后立刻给我回电！” 玛丽微笑着答应一定转交。",
        pinyin: "Zhāng Dōng lái dào Tián Fāng de sùshè ménkǒu, tóngwū de Mǎlì gàosu tā: “Tián Fāng yí ge xiǎoshí qián qù guǎngbō diàntái lùzhì Hànyǔ jiémù le, kěnéng yào dào bàngwǎn cái huílái.” Zhāng Dōng ná chū yì zhāng biàntiáo xiě dào: “Wǒ mǎi dào le jīnwǎn qī diǎn de mínyuè yǎnzòuhuì ménpiào, qǐng nǐ huílái hòu lìkè gěi wǒ huídiàn!” Mǎlì wēixiào zhe dāying yídìng zhuǎnjiāo.",
        vi: "Trương Đông đến trước cửa phòng ký túc xá của Điền Phương, Mary bạn cùng phòng nói với cậu: 'Điền Phương một tiếng trước đã đến đài phát thanh ghi hình chương trình tiếng Hán rồi, có thể đến sẩm tối mới về.' Trương Đông lấy ra một tờ giấy nhắn viết: 'Mình mua được vé hòa nhạc dân tộc tối nay 7 giờ, khi về cậu hãy gọi lại ngay cho mình nhé!' Mary mỉm cười nhận lời nhất định chuyển lời giúp."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "田芳去哪里了？什么时候回来？",
        qPinyin: "Tián Fāng qù nǎli le? Shénme shíhou huílái?",
        qVi: "Điền Phương đã đi đâu? Khi nào sẽ về?",
        aHanzi: "田芳去广播电台录节目了，可能傍晚才回来。",
        aVi: "Điền Phương đến đài phát thanh thu âm chương trình, có thể sẩm tối mới về."
      }
    ]
  },

  // BÀI 27: 我也去过北京
  "jc_1_2_27": {
    titleHanzi: "昔日重游与北京的新变化",
    titlePinyin: "Xīrì chóng yóu yǔ Běijīng de xīn biànhuà",
    titleVi: "Thăm lại chốn cũ và những đổi thay mới của Bắc Kinh",
    summary: "Kể về trải nghiệm từng đến Bắc Kinh nhiều năm trước và so sánh sự hiện đại, tiện nghi của thành phố hôm nay.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "爱德华早在五年前就曾经跟随父母来过北京旅游。那时候，他参观了故宫、颐和园和天坛，对这座有着悠久历史的古城留下了极佳的印象。",
        pinyin: "Àidéhuá zǎo zài wǔ nián qián jiù céngjīng gēnsuí fùmǔ lái guo Běijīng lǚyóu. Nà shíhou, tā cānguān le Gùgōng, Yíhéyuán hé Tiāntán, duì zhè zuò yǒu zhe yōujiǔ lìshǐ de gǔchéng liúxià le jí jiā de yìnxiàng.",
        vi: "Edward từ 5 năm trước đã từng theo bố mẹ đến Bắc Kinh du lịch. Khi ấy, cậu đã tham quan Cố Cung, Di Hòa Viên và Thiên Đàn, để lại ấn tượng vô cùng tốt đẹp về thành phố cổ kính mang bề dày lịch sử này."
      },
      {
        paraNum: 2,
        hanzi: "如今再次来到北京长期留学，他发现这座古老都市发生了巨大的变化：纵横交错的高速地铁网络贯通全城，街道旁拔地而起的高楼大厦气势磅礴，到处都可以使用手机便捷地租借单车和移动支付。古老的胡同与现代化的都市风貌在这里完美地融为一体。",
        pinyin: "Rújīn zàicì lái dào Běijīng chángqī liúxué, tā fāxiàn zhè zuò gǔlǎo dūshì fāshēng le jùdà de biànhuà: zònghéng-jiāocuò de gāosù dìtiě wǎngluò guàntōng quánchéng, jiēdào páng bádì-érqǐ de gāolóu-dàshà qìshì pángbó, dàochù dōu kěyǐ yòng shǒujī biànjié de zūjiè dānchē hé yídòng zhīfù. Gǔlǎo de hútòng yǔ xiàndàihuà de dūshì fēngmào zài zhèlǐ wánměi de róng wéi yītǐ.",
        vi: "Nay trở lại Bắc Kinh du học lâu dài, cậu nhận thấy thành phố cổ xưa này đã có những bước chuyển mình to lớn: mạng lưới tàu điện ngầm cao tốc đan xen kết nối toàn đô thị, những tòa nhà cao tầng chọc trời mọc lên sừng sững bên các con phố, khắp nơi đều có thể dùng điện thoại thuê xe đạp và thanh toán điện tử dễ dàng. Những con ngõ Hồ Đồng cổ kính và dáng dấp đô thị hiện đại hòa quyện vào nhau một cách hoàn hảo."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "爱德华以前去过北京吗？现在的北京有哪些新变化？",
        qPinyin: "Àidéhuá yǐqián qù guo Běijīng ma? Xiànzài de Běijīng yǒu nǎxiē xīn biànhuà?",
        qVi: "Edward trước đây từng đến Bắc Kinh chưa? Bắc Kinh ngày nay có những thay đổi mới nào?",
        aHanzi: "他五年前去过。现在地铁四通八达，高楼林立，移动支付非常方便。",
        aVi: "Cậu ấy từng đi 5 năm trước. Giờ đây tàu điện ngầm kết nối khắp nơi, nhà cao tầng mọc lên như nấm, thanh toán di động rất tiện lợi."
      }
    ]
  },

  // BÀI 28: 我吃了早饭就去
  "jc_1_2_28": {
    titleHanzi: "高效充实的一日作息",
    titlePinyin: "Gāoxiào chōngshí de yí rì zuòxī",
    titleVi: "Thời gian biểu một ngày hiệu quả và tràn đầy năng lượng",
    summary: "Sử dụng cấu trúc 'ăn sáng xong liền đi' miêu tả nhịp sống năng động, sắp xếp việc học và sinh hoạt khoa học.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "麦克在北京的学习生活非常有规律。他每天早晨六点半准时起床，洗漱完毕后就去操场晨跑二十分钟，呼吸新鲜空气。",
        pinyin: "Màikè zài Běijīng de xuéxí shēnghuó fēicháng yǒu guīlǜ. Tā měitiān zǎochén liù diǎn bàn zhǔnshí qǐchuáng, xǐshù wánbì hòu jiù qù cāochǎng chénpǎo èrshí fēnzhōng, hūxī xīnxiān kōngqì.",
        vi: "Cuộc sống học tập của Mike ở Bắc Kinh rất có quy củ. Cậu thức dậy đúng 6 giờ rưỡi mỗi sáng, vệ sinh cá nhân xong liền ra sân chạy bộ 20 phút hít thở bầu không khí trong lành."
      },
      {
        paraNum: 2,
        hanzi: "早晨七点半，他在食堂吃了两根油条和一碗热豆浆，吃了早饭就立刻拿着书包去教室预习生词。下午下了课，他就去图书馆看书；晚上一回到宿舍就抓紧复习功课。虽然生活节奏紧凑，但他感到每一天都过得格外充实而快乐。",
        pinyin: "Zǎochén qī diǎn bàn, tā zài shítáng chī le liǎng gēn yóutiáo hé yì wǎn rè dòujiāng, chī le zǎofàn jiù lìkè ná zhe shūbāo qù jiàoshì yùxí shēngcí. Xiàwǔ xià le kè, tā jiù qù túshūguǎn kànshū; wǎnshang yì huí dào sùshè jiù zhuājǐn fùxí gōngkè. Suīrán shēnghuó jiézòu jǐncòu, dàn tā gǎndào měi yì tiān dōu guò de géwài chōngshí ér kuàilè.",
        vi: "7 giờ rưỡi sáng, cậu ăn hai chiếc quẩy và bát sữa đậu nành nóng tại nhà ăn, ăn sáng xong là lập tức mang ba lô tới giảng đường chuẩn bị bài trước. Buổi chiều tan học là đến thư viện đọc sách; tối vừa về tới ký túc xá là tranh thủ ôn tập bài vở ngay. Dù nhịp sống gấp gáp, nhưng cậu cảm thấy mỗi ngày trôi qua đều vô cùng phong phú và tràn đầy niềm vui."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "麦克吃了早饭以后去做什么？",
        qPinyin: "Màikè chī le zǎofàn yǐhòu qù zuò shénme?",
        qVi: "Mike sau khi ăn bữa sáng xong thì đi làm gì?",
        aHanzi: "他吃了早饭就去教室预习生词。",
        aVi: "Cậu ấy ăn sáng xong là đến lớp chuẩn bị từ mới ngay."
      }
    ]
  },

  // BÀI 29: 我都听懂了
  "jc_1_2_29": {
    titleHanzi: "听力考试后的喜悦",
    titlePinyin: "Tīnglì kǎoshì hòu de xǐyuè",
    titleVi: "Niềm vui sau giờ kiểm tra kỹ năng nghe",
    summary: "Quá trình kiên trì luyện nghe từ lúc bỡ ngỡ không hiểu đến khi hoàn toàn nghe hiểu hết các đoạn ghi âm bài thi.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "今天上午，留学生中级一班举行了期中汉语听力考试。刚来中国时，很多同学连老师平时的慢速提问都听得似懂非懂，心里非常着急。",
        pinyin: "Jīntiān shàngwǔ, liúxuéshēng zhōngjí yī bān jǔxíng le qīzhōng Hànyǔ tīnglì kǎoshì. Gāng lái Zhōngguó shí, hěn duō tóngxué lián lǎoshī píngshí de mànsù tíwèn dōu tīng de sì dǒng fēi dǒng, xīnlǐ fēicháng zháojí.",
        vi: "Sáng nay, lớp trung cấp 1 lưu học sinh đã tổ chức kỳ thi nghe tiếng Hán giữa kỳ. Hồi mới sang Trung Quốc, rất nhiều bạn ngay cả câu hỏi tốc độ chậm của giáo viên cũng chỉ nghe bập bõm, trong lòng vô cùng sốt ruột."
      },
      {
        paraNum: 2,
        hanzi: "经过半学期的刻苦训练，今天听录音时，玛丽发现磁带里的每一句对话和短文她都能听得清清楚楚。走出考场，她兴奋地对麦克说：“今天录音里的内容我都听懂了，题目也都做完了！” 努力付出的汗水终于换来了沉甸甸的收获。",
        pinyin: "Jīngguò bàn xuéqī de kèkǔ xùnliàn, jīntiān tīng lùyīn shí, Mǎlì fāxiàn cídài lǐ de měi yí jù duìhuà hé duǎnwén tā dōu néng tīng de qīngqīng-chǔchǔ. Zǒu chū kǎochǎng, tā xīngfèn de duì Màikè shuō: “Jīntiān lùyīn lǐ de nèiróng wǒ dōu tīng dǒng le, tímù yě dōu zuò wán le!” Nǔlì fùchū de hànshuǐ zhōngyú huàn lái le chéndiàndiàn de shōuhuò.",
        vi: "Trải qua nửa học kỳ khổ luyện, hôm nay khi nghe băng ghi âm, Mary nhận thấy từng câu hội thoại và bài văn ngắn trong bài cô đều nghe được rõ mồn một. Bước ra khỏi phòng thi, cô hào hứng nói với Mike: 'Hôm nay toàn bộ nội dung trong bài ghi âm mình đều nghe hiểu hết rồi, câu hỏi cũng làm xong cả rồi!' Mồ hôi công sức nỗ lực cuối cùng đã đổi lại quả ngọt xứng đáng."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "玛丽考完听力考试后心情怎么样？为什么？",
        qPinyin: "Mǎlì kǎo wán tīnglì kǎoshì hòu xīnlíng zěnmeyàng? Wèishénme?",
        qVi: "Tâm trạng của Mary sau khi thi xong môn nghe thế nào? Tại sao?",
        aHanzi: "她非常兴奋，因为录音内容她全都听懂了。",
        aVi: "Cô ấy vô cùng phấn khởi, bởi vì nội dung trong băng ghi âm cô đều nghe hiểu hết."
      }
    ]
  },

  // BÀI 30: 我来了两个月了
  "jc_1_2_30": {
    titleHanzi: "初到北京两个月的回顾与感悟",
    titlePinyin: "Chū dào Běijīng liǎng ge yuè de huígù yǔ gǎnwù",
    titleVi: "Nhìn lại hai tháng đầu đặt chân đến Bắc Kinh và những chiêm nghiệm",
    summary: "Đoạn văn tổng kết học kỳ 1: từ bỡ ngỡ làm quen đồ ăn, thời tiết, đến nói tiếng Hán tự tin và tình bạn nồng ấm.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "不知不觉，大卫来北京语言大学留学已经整整两个月了。回想起刚到机场的那一天，面对陌生的环境和完全听不懂的快节奏对话，他还曾感到有些胆怯和思乡。",
        pinyin: "Bùzhī-bùjué, Dàwèi lái Běijīng Yǔyán Dàxué liúxué yǐjīng zhěngzhěng liǎng ge yuè le. Huíxiǎng qǐ gāng dào jīchǎng de nà yì tiān, miànduì mòshēng de huánjìng hé wánquán tīng bu dǒng de kuài jiézòu duìhuà, tā hái céng gǎndào yǒuxiē dǎnqiè hé sīxiāng.",
        vi: "Thoáng chốc thoăn thoắt, David đến ĐH Ngôn ngữ Bắc Kinh du học tròn hai tháng. Nhớ lại ngày đầu tiên đặt chân xuống sân bay, đối diện với môi trường xa lạ và những câu đối thoại tiết tấu nhanh hoàn toàn không hiểu nổi, cậu từng cảm thấy có chút rụt rè và nhớ nhà."
      },
      {
        paraNum: 2,
        hanzi: "现在的他已经完全适应了这里的生活。他习惯了吃北方的馒头和饺子，结交了许多热情的中国朋友，还能流利地用汉语去商店买东西、在餐馆点菜、跟出租车司机聊天。大卫在日记里写道：“中国就像我的第二个家，接下来的学期我一定会学得更好！”",
        pinyin: "Xiànzài de tā yǐjīng wánquán shìyìng le zhèlǐ de shēnghuó. Tā xíguàn le chī běifāng de mántou hé jiǎozi, jiéjiāo le xǔduō rèqíng de Zhōngguó péngyou, hái néng liúlì de yòng Hànyǔ qù shāngdiàn mǎi dōngxi, zài cānguǎn diǎncài, gēn chūzūchē sījī liáotiān. Dàwèi zài rìjì lǐ xiě dào: “Zhōngguó jiù xiàng wǒ de dì-èr ge jiā, jiēxiàlái de xuéqī wǒ yídìng huì xué de gèng hǎo!”",
        vi: "Giờ đây cậu đã hoàn toàn thích nghi với nhịp sống nơi này. Cậu đã quen ăn màn thầu và sủi cảo phương bắc, kết bạn với nhiều người bạn Trung Quốc nhiệt tình, còn có thể dùng tiếng Hán lưu loát đi mua đồ, gọi món ở quán ăn, bắt chuyện với tài xế taxi. David viết trong nhật ký: 'Trung Quốc như ngôi nhà thứ hai của mình, những học kỳ sắp tới mình nhất định sẽ học tập giỏi hơn nữa!'"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "大卫来北京多长时间了？他现在适应得怎么样？",
        qPinyin: "Dàwèi lái Běijīng duō cháng shíjiān le? Tā xiànzài shìyìng de zěnmeyàng?",
        qVi: "David đến Bắc Kinh được bao lâu rồi? Hiện tại cậu ấy thích nghi thế nào?",
        aHanzi: "大卫来了两个月了，他已经完全适应了这里的生活。",
        aVi: "David đã đến được 2 tháng, cậu ấy đã hoàn toàn thích nghi với cuộc sống nơi đây."
      }
    ]
  }
};

// Update data
let updatedCount = 0;
for (const lesson of jiaocheng.lessons) {
  if (vol1Narratives[lesson.id]) {
    lesson.narrative = vol1Narratives[lesson.id];
    updatedCount++;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(jiaocheng, null, 2), 'utf8');
console.log(`[Vol 1 Narratives] Updated ${updatedCount} lessons with authentic narrative reading texts.`);
