const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/hanyu_jiaocheng.json');
const jiaocheng = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const vol2Narratives = {
  // BÀI 31: 我骑车骑得比较慢
  "jc_2_1_31": {
    titleHanzi: "北京胡同里的骑行体验",
    titlePinyin: "Běijīng hútòng lǐ de qíxíng tǐyàn",
    titleVi: "Trải nghiệm đạp xe khám phá các ngõ hẻm Hồ Đồng Bắc Kinh",
    summary: "Đạp xe ngắm nhìn cuộc sống bình dị của người dân Bắc Kinh qua các ngõ hẻm lịch sử, chú ý an toàn giao thông đường bộ.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "周末的早晨，阳光洒在什刹海的水面上，波光粼粼。麦克和田芳相约骑自行车去什刹海附近的古老胡同游览。",
        pinyin: "Zhōumò de zǎoshang, yángguāng sǎ zài Shíchàhǎi de shuǐmiàn shang, bōguāng-línlín. Màikè hé Tián Fāng xiāngyuē qí zìxíngchē qù Shíchàhǎi fùjìn de gǔlǎo hútòng yóulǎn.",
        vi: "Sáng cuối tuần, ánh nắng chiếu rọi trên mặt nước Thập Sát Hải, lấp lánh lăn tăn. Mike và Điền Phương hẹn nhau đạp xe đi dạo qua những con ngõ Hồ Đồng cổ kính gần Thập Sát Hải."
      },
      {
        paraNum: 2,
        hanzi: "胡同里的路有些狭窄，拐角也多。麦克骑得比较慢，他说：“胡同里散步的爷爷奶奶和小孩子很多，我骑得慢一点儿，既安全，又能慢慢欣赏四合院的砖雕门楼。” 田芳赞同地放慢了车速，两个人一边悠闲地骑行，一边感受着老北京独有的慢节奏生活韵味。",
        pinyin: "Hútòng lǐ de lù yǒuxiē xiázhǎi, guǎijiǎo yě duō. Màikè qí de bǐjiào màn, tā shuō: “Hútòng lǐ sànbù de yéye nǎinai hé xiǎoháizi hěn duō, wǒ qí de màn yìdiǎnr, jì ānquán, yòu néng mànmàn xīnshǎng sìhéyuàn de zhuāndiāo ménlóu.” Tián Fāng zàntóng de fàngmàn le chēsù, liǎng ge rén yìbiān yōuxián de qíxíng, yìbiān gǎnshòu zhe lǎo Běijīng dúyǒu de màn jiézòu shēnghuó yùnwèi.",
        vi: "Đường trong ngõ hẻm có phần chật hẹp, lại nhiều khúc cua. Mike đạp xe tương đối chậm, cậu nói: 'Trong ngõ có nhiều ông bà già và trẻ nhỏ đi dạo, mình đi chậm một chút, vừa an toàn, lại vừa có thể thong thả chiêm ngưỡng cổng gạch điêu khắc của những ngôi nhà Tứ Hợp Viện.' Điền Phương đồng tình giảm tốc độ, hai người vừa thong thả đạp xe vừa cảm nhận nét thi vị của nhịp sống chậm rãi đặc trưng của đất Bắc Kinh xưa."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "麦克为什么在胡同里骑车骑得比较慢？",
        qPinyin: "Màikè wèishénme zài hútòng lǐ qíchē qí de bǐjiào màn?",
        qVi: "Tại sao Mike đạp xe trong ngõ hẻm lại tương đối chậm?",
        aHanzi: "因为人多路窄，骑慢一点儿既安全，又能欣赏四合院风景。",
        aVi: "Bởi vì đông người đường hẹp, đạp chậm vừa an toàn lại vừa thưởng ngoạn được phong cảnh Tứ Hợp Viện."
      }
    ]
  },

  // BÀI 32: 玛丽哭了
  "jc_2_1_32": {
    titleHanzi: "远隔重洋的亲情与温暖",
    titlePinyin: "Yuǎn gé chóngyáng de qīnqíng yǔ wēnnuǎn",
    titleVi: "Tình thân cách trở trùng dương và sự ấm áp tình người",
    summary: "Mary ốm nhẹ và nhớ nhà rơi nước mắt, nhưng được cô giáo và bạn bè đến tận phòng chăm sóc thuốc men, nấu cháo.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "这几天北京突然降温，下了一场大雨。玛丽不小心着凉感冒了，发烧躺在床上。听着窗外淅淅沥沥的雨声，想到生病的自己独自在千里之外的异国他乡，玛丽忍不住难过地哭了。",
        pinyin: "Zhè jǐ tiān Běijīng tūrán jiàngwēn, xià le yì chǎng dàyǔ. Mǎlì bù xiǎoxīn zháoliáng gǎnmào le, fāshāo tǎng zài chuáng shang. Tīng zhe chuāngwài xīxī-lìlì de yǔshēng, xiǎng dào shēngbìng de zìjǐ dúzì zài qiānlǐ zhī wài de yìguó-tāxiāng, Mǎlì rěnbuzhù nánguò de kū le.",
        vi: "Mấy hôm nay Bắc Kinh đột ngột trở lạnh, trút xuống một cơn mưa lớn. Mary bất cẩn bị nhiễm lạnh cảm sốt, nằm li bì trên giường. Nghe tiếng mưa rả rích ngoài khung cửa, nghĩ tới cảnh bản thân ốm đau đơn độc nơi đất khách quê người cách xa ngàn dặm, Mary không kìm được tủi thân khóc nức nở."
      },
      {
        paraNum: 2,
        hanzi: "就在这时，敲门声响了。王老师和同屋的田芳冒雨赶了过来。王老师端来了热腾腾的姜汤和小米粥，亲切地摸着她的额头安慰她：“别哭，好孩子，吃了药好好睡一觉，很快就会好起来的。” 玛丽擦干眼泪，感受到了如同家人一般的温暖。",
        pinyin: "Jiù zài zhè shí, qiāomén shēng xiǎng le. Wáng lǎoshī hé tóngwū de Tián Fāng màoyǔ gǎn le guòlái. Wáng lǎoshī duān lái le rèténgténg de jiāngtāng hé xiǎomǐzhōu, qīnqiè de mō zhe tā de étóu ānwèi tā: “Bié kū, hǎo háizi, chī le yào hǎohǎo shuì yí jiào, hěn kuài jiù huì hǎo qǐlái de.” Mǎlì cā gān yǎnlèi, gǎnshòu dào le rútóng jiārén yībān de wēnnuǎn.",
        vi: "Đúng lúc đó tiếng gõ cửa vang lên. Thầy Vương cùng cô bạn Điền Phương đội mưa vội vã chạy đến. Thầy Vương bưng bát canh gừng nóng hổi và cháo kê, ân cần đặt tay lên trán cô an ủi: 'Đừng khóc, đứa con ngoan, uống thuốc xong ngủ một giấc thật ngon, con sẽ mau chóng khỏe lại thôi.' Mary lau khô nước mắt, cảm nhận được hơi ấm chan chứa tựa như gia đình ruột thịt."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "玛丽为什么哭了？老师和同学是怎样关心她的？",
        qPinyin: "Mǎlì wèishénme kū le? Lǎoshī hé tóngxué shì zěnyàng guānxīn tā de?",
        qVi: "Tại sao Mary lại khóc? Thầy giáo và bạn bè quan tâm cô thế nào?",
        aHanzi: "因为她生病思乡。老师和同学冒雨给她送来了姜汤、小米粥并安慰她。",
        aVi: "Bởi vì cô bị ốm nhớ nhà. Thầy và bạn đội mưa đem canh gừng, cháo kê đến và an ủi cô."
      }
    ]
  },

  // BÀI 33: 我买了一本书
  "jc_2_1_33": {
    titleHanzi: "王府井新华书店的淘书之旅",
    titlePinyin: "Wángfǔjǐng Xīnhuá Shūdiàn de táoshū zhī lǚ",
    titleVi: "Chuyến tìm mua sách tại Hiệu sách Tân Hoa Vương Phủ Tỉnh",
    summary: "Thăm hiệu sách lớn nhất thủ đô, lựa chọn sách học Hán ngữ, từ điển đối chiếu và truyện ngắn dân gian có phiên âm.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "王府井新华书店是北京规模最大、藏书最全的书店之一。书店共有六层，每天都吸引着成千上万的中外读者前来购书阅读。",
        pinyin: "Wángfǔjǐng Xīnhuá Shūdiàn shì Běijīng guīmó zuì dà, cángshū zuì quán de shūdiàn zhī yī. Shūdiàn gòng yǒu liù céng, měitiān dōu xīyǐn zhe chéngqiān-shàngwàn de Zhōng-wài dúzhě qiánlái gòushū yuèdú.",
        vi: "Hiệu sách Tân Hoa ở Vương Phủ Tỉnh là một trong những nhà sách quy mô lớn nhất và đầy đủ đầu sách nhất tại Bắc Kinh. Nhà sách gồm 6 tầng, mỗi ngày thu hút hàng vạn độc giả trong và ngoài nước đến chọn sách và đọc sách."
      },
      {
        paraNum: 2,
        hanzi: "保罗在四楼的对外汉语专区精挑细选，买了一本带拼音注解的《中国古代成语故事选》和一本最新的实用汉英词典。他兴奋地说：“这本书的语言通俗易懂，故事生动有趣，对我提高阅读理解和积累词汇非常有帮助。”",
        pinyin: "Bǎoluó zài sì lóu de duìwài Hànyǔ zhuānqū jīngtiāo-xìxuǎn, mǎi le yì běn dài pīnyīn zhùjiě de “Zhōngguó Gǔdài Chéngyǔ Gùshì Xuǎn” hé yì běn zuìxīn de shíyòng Hàn-Yīng cídiǎn. Tā xīngfèn de shuō: “Zhè běn shū de yǔyán tōngsú-yìdǒng, gùshì shēngdòng yǒuqù, duì wǒ tígāo yuèdú lǐjiě hé jīlěi cíhuì fēicháng yǒu bāngzhù.”",
        vi: "Paul tại khu vực chuyên ngành Hán ngữ đối ngoại tầng 4 đã cẩn thận chọn lựa, mua được cuốn 'Tuyển chọn điển tích thành ngữ cổ đại Trung Hoa' có chú giải Pinyin và một cuốn từ điển Hán-Anh thực dụng mới nhất. Cậu hào hứng nói: 'Ngôn từ quyển sách này dễ hiểu gần gũi, câu chuyện sinh động lôi cuốn, giúp ích rất nhiều cho việc nâng cao khả năng đọc hiểu và tích lũy vốn từ của mình.'"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "保罗在新华书店买了什么书？",
        qPinyin: "Bǎoluó zài Xīnhuá Shūdiàn mǎi le shénme shū?",
        qVi: "Paul mua những cuốn sách nào ở hiệu sách Tân Hoa?",
        aHanzi: "买了一本《中国古代成语故事选》和一本汉英词典。",
        aVi: "Mua một cuốn 'Tuyển tập chuyện thành ngữ cổ đại Trung Quốc' và một cuốn từ điển Hán-Anh."
      }
    ]
  },

  // BÀI 34: 我打算请老师辅导
  "jc_2_1_34": {
    titleHanzi: "寻找语言辅导与互相学习",
    titlePinyin: "Xúnzhǎo yǔyán fǔdǎo yǔ hùxiāng xuéxí",
    titleVi: "Tìm gia sư ngôn ngữ và cùng nhau học tập",
    summary: "Nhu cầu nâng cao khả năng khẩu ngữ và nghe hiểu chuyên sâu, hình thức bạn cùng tiến (Language Exchange) giữa các sinh viên.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "进入中级阶段后，汉语的语法结构变得更加严谨，生词量也成倍增加。爱德华感到仅仅依靠课堂上的时间已经不够用了，他打算找一位辅导老师。",
        pinyin: "Jìnrù zhōngjí jiēduàn hòu, Hànyǔ de yǔfǎ jiégòu biàn de gèngjiā yánjǐn, shēngcíliàng yě chéng bèi zēngjiā. Àidéhuá gǎndào jǐnjǐn yīkào kètáng shang de shíjiān yǐjīng bú gòuyòng le, tā dǎsuan zhǎo yí wèi fǔdǎo lǎoshī.",
        vi: "Bước vào giai đoạn trung cấp, cấu trúc ngữ pháp tiếng Hán trở nên chặt chẽ hơn, lượng từ mới cũng tăng gấp bội. Edward cảm thấy chỉ dựa vào thời lượng trên lớp thôi là chưa đủ, cậu dự định tìm một người kèm cặp phụ đạo."
      },
      {
        paraNum: 2,
        hanzi: "中文系的研究生小李得知后，主动提出与爱德华结成“一帮一”语言学习伙伴。每周二、周四晚上，小李辅导爱德华的汉语写作与发音纠错，而爱德华则辅导小李的德语口语。这种互帮互助的学习模式让两人在学业上都取得了长足的进步。",
        pinyin: "Zhōngwénxì de yánjiūshēng Xiǎo Lǐ dézhī hòu, zhǔdòng tíchū yǔ Àidéhuá jiéchéng “yībāngyī” yǔyán xuéxí huǒbàn. Měi zhōu'èr, zhōusì wǎnshang, Xiǎo Lǐ fǔdǎo Àidéhuá de Hànyǔ xiězuò yǔ fāyīn jiūcuò, ér Àidéhuá zé fǔdǎo Xiǎo Lǐ de Déyǔ kǒuyǔ. Zhè zhǒng hùbāng-hùzhù de xuéxí móshì ràng liǎng rén zài xuéyè shang dōu qǔdé le chángzú de jìnbù.",
        vi: "Nghiên cứu sinh khoa Trung văn Tiểu Lý biết chuyện liền chủ động đề xuất kết đôi làm bạn học tập 'đôi bạn cùng tiến' với Edward. Mỗi tối thứ ba và thứ năm, Tiểu Lý kèm Edward tập viết văn và sửa phát âm, đổi lại Edward hướng dẫn khẩu ngữ tiếng Đức cho Tiểu Lý. Mô hình học tập tương trợ này giúp cả hai gặt hái được những bước tiến vượt bậc trong học tập."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "爱德华和小李是怎样互相辅导的？",
        qPinyin: "Àidéhuá hé Xiǎo Lǐ shì zěnyàng hùxiāng fǔdǎo de?",
        qVi: "Edward và Tiểu Lý đã phụ đạo lẫn nhau như thế nào?",
        aHanzi: "小李辅导爱德华汉语写作和发音，爱德华辅导小李德语口语。",
        aVi: "Tiểu Lý phụ đạo Edward viết văn và phát âm tiếng Hán, Edward phụ đạo Tiểu Lý khẩu ngữ tiếng Đức."
      }
    ]
  },

  // BÀI 35: 现在的天气比以前暖和了
  "jc_2_1_35": {
    titleHanzi: "北京的四季流转与春意萌动",
    titlePinyin: "Běijīng de sìjì liúzhuǎn yǔ chūnyì méngdòng",
    titleVi: "Bốn mùa chuyển vần ở Bắc Kinh và sắc xuân hé nở",
    summary: "Sử dụng mẫu câu so sánh chữ 比 miêu tả thời tiết ấm lên khi mùa xuân về, cây cối đâm chồi nảy lộc tại Di Hòa Viên.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "三月的北京迎来了初春。冬天的严寒与干燥逐渐退去，白天的气温回升到了十几度。现在的天气比以前暖和多了，微风拂面，令人心旷神怡。",
        pinyin: "Sān yuè de Běijīng yínglái le chūchūn. Dōngtiān de yánhán yǔ gānzào zhújiàn tuìqù, báitiān de qìwēn huíshēng dào le shíjǐ dù. Xiànzài de tiānqì bǐ yǐqián nuǎnhuo duō le, wēifēng fú miàn, lìng rén xīnhuàng-shényí.",
        vi: "Tháng ba Bắc Kinh đón chào những ngày đầu xuân. Cái rét buốt hanh khô của mùa đông dần dần tan biến, nhiệt độ ban ngày tăng lên trên mười mấy độ. Tiết trời lúc này ấm áp hơn trước rất nhiều, gió nhẹ thoảng qua mặt làm người ta sảng khoái dễ chịu."
      },
      {
        paraNum: 2,
        hanzi: "校园里的柳树抽出细长的嫩芽，桃花和玉兰花竞相吐蕊，景色比冬天美丽得多。同学们脱下了笨重的羽绒服，换上轻便的外套，纷纷走出宿舍到户外打球、晒太阳，尽情享受春天的美好阳光。",
        pinyin: "Xiàoyuán lǐ de liǔshù chōuchū xìcháng de nènyá, táohuā hé yùlánhuā jìngxiāng tǔruǐ, jǐngsè bǐ dōngtiān měilì de duō. Tóngxuémen tuō xià le bènzhòng de yǔróngfú, huàn shàng qīngbiàn de wàitào, fēnfēn zǒu chū sùshè dào hùwài dǎqiú, shài tàiyáng, jìnqíng xiǎngshòu chūntiān de měihǎo yángguāng.",
        vi: "Rặng liễu trong sân trường đâm ra những chồi non mảnh mai, hoa đào và hoa mộc lan đua nhau khoe sắc thắm, phong cảnh diễm lệ hơn mùa đông nhiều. Các bạn sinh viên trút bỏ những chiếc áo khoác phao nặng trịch, thay bằng áo khoác mỏng nhẹ, nô nức rủ nhau ra ngoài sân chơi bóng, sưởi ấm, đắm mình trong ánh nắng rực rỡ chan hòa của mùa xuân."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "三月的北京天气和景色发生了什么变化？",
        qPinyin: "Sān yuè de Běijīng tiānqì hé jǐngsè fāshēng le shénme biànhuà?",
        qVi: "Thời tiết và cảnh sắc Bắc Kinh tháng 3 có những chuyển biến gì?",
        aHanzi: "气温回升暖和了，花草发芽吐蕊，比冬天美丽多了。",
        aVi: "Nhiệt độ ấm lên, hoa cỏ đâm chồi nở hoa, đẹp hơn mùa đông rất nhiều."
      }
    ]
  },

  // BÀI 36: 他比我跑得快
  "jc_2_1_36": {
    titleHanzi: "校春季田径运动会上的拼搏",
    titlePinyin: "Xiào chūnjì tiánjìng yùndònghuì shang de pīnbó",
    titleVi: "Nỗ lực thi đấu tại Đại hội điền kinh mùa xuân trường",
    summary: "Cuộc thi chạy cự ly 100 mét và 800 mét, tinh thần thể thao đoàn kết, so sánh thể lực giữa các vận động viên sinh viên.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "每年四月，学校都会举办盛大的春季田径运动会。跑道旁彩旗飘扬，加油助威的锣鼓声震耳欲聋，运动场上洋溢着青春的激情与活力。",
        pinyin: "Měi nián sì yuè, xuéxiào dōu huì jǔbàn shèngdà de chūnjì tiánjìng yùndònghuì. Pǎodào páng cǎiqí piāoyáng, jiāyóu zhùwēi de luógǔ shēng zhèn'ěr-yùlóng, yùndòngchǎng shang yángyì zhe qīngchūn de jīqíng yǔ huólì.",
        vi: "Tháng 4 hằng năm trường đều tổ chức đại hội thể thao điền kinh mùa xuân hoành tráng. Bên đường chạy cờ hoa phấp phới, tiếng trống chiêng reo hò cổ vũ rền vang, sân thể thao rực cháy nhiệt huyết và sức sống thanh xuân."
      },
      {
        paraNum: 2,
        hanzi: "在男子一百米短跑决赛中，麦克发挥出色，起跑飞快，但来自非洲的留学生约翰冲刺更有力，他比麦克跑得还要快半步，最终夺得了冠军。麦克真诚地上前拥抱约翰祝贺他，他说：“友谊第一，比赛第二，向强者学习才能跑得更快！”",
        pinyin: "Zài nánzǐ yībǎi mǐ duǎnpǎo juésài zhōng, Màikè fāhuī chūsè, qǐpǎo fēikuài, dàn láizì Fēizhōu de liúxuéshēng Yuēhàn chōngcì gèng yǒu lì, tā bǐ Màikè pǎo de hái yào kuài bàn bù, zuìzhōng duóde le guànjūn. Màikè zhēnchéng de shàngqián yōngbào Yuēhàn zhùhè tā, tā shuō: “Yǒuyì dì-yī, bǐsài dì-èr, xiàng qiángzhě xuéxí cái néng pǎo de gèng kuài!”",
        vi: "Trong trận chung kết chạy nước rút 100 mét nam, Mike xuất phát thần tốc, nhưng lưu học sinh John đến từ Châu Phi có cú bứt tốc dũng mãnh hơn, cậu chạy nhanh hơn Mike nửa bước chân và giành ngôi vô địch. Mike chân thành tiến tới ôm chầm chúc mừng John, cậu nói: 'Hữu nghị là trên hết, thi đấu xếp thứ hai, học hỏi người giỏi mới có thể chạy nhanh hơn nữa!'"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "谁获得了一百米短跑比赛的冠军？麦克说了什么？",
        qPinyin: "Shéi huòdé le yībǎi mǐ duǎnpǎo bǐsài de guànjūn? Màikè shuō le shénme?",
        qVi: "Ai đã giành chức vô địch chạy 100m? Mike đã nói gì?",
        aHanzi: "约翰夺冠。麦克说：“友谊第一，比赛第二。”",
        aVi: "John giành quán quân. Mike nói: 'Hữu nghị thứ nhất, thi đấu thứ hai.'"
      }
    ]
  },

  // BÀI 37: 我把行李准备好了
  "jc_2_1_37": {
    titleHanzi: "毕业旅行前的行装清点",
    titlePinyin: "Bìyè lǚxíng qián de xíngzhuāng qīngdiǎn",
    titleVi: "Kiểm tra hành lý trước chuyến du lịch tốt nghiệp",
    summary: "Vận dụng câu chữ 把 miêu tả quá trình sắp xếp quần áo, vé máy bay, máy ảnh và quà lưu niệm vào vali du lịch.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "明天早晨，大卫就要启程前往云南进行为期一周的旅行。为了确保旅程万无一失，今晚他在宿舍把所有的行李物品仔细检查了一遍。",
        pinyin: "Míngtiān zǎochén, Dàwèi jiù yào qǐchéng qiánwǎng Yúnnán jìnxíng wéi qī yì zhōu de lǚxíng. Wèile quèbǎo lǚchéng wànwú-yīshī, jīnwǎn tā zài sùshè bǎ suǒyǒu de xínglǐ wùpǐn zǐxì jiǎnchá le yí biàn.",
        vi: "Sáng mai, David sẽ lên đường đến Vân Nam thực hiện chuyến du lịch kéo dài một tuần. Để đảm bảo hành trình suôn sẻ không sai sót, tối nay tại ký túc xá cậu cẩn thận kiểm tra lại toàn bộ đồ đạc hành lý."
      },
      {
        paraNum: 2,
        hanzi: "他把厚外套和换洗衣物叠得整整齐齐放进了行李箱；把护照、身份证和机票放进了胸前的小挎包里；又把相机电池充满了电，把充电宝也装了进去。最后，他把房间的门窗锁好，安心地定好了早晨六点的闹钟。",
        pinyin: "Tā bǎ hòu wàitào hé huànxǐ yīwù dié de zhěngzhěng-qíqí fàng jìn le xínglǐxiāng; bǎ hùzhào, shēnfènzhèng hé jīpiào fàng jìn le xiōngqián de xiǎo kuàbāo lǐ; yòu bǎ xiàngjī diànchí chōngmǎn le diàn, bǎ chōngdiànbǎo yě zhuāng le jìnqu. Zuìhòu, tā bǎ fángjiān de ménchuāng suǒ hǎo, ānxīn de dìng hǎo le zǎochén liù diǎn de nàozhōng.",
        vi: "Cậu gấp áo ấm và quần áo thay đổi thật ngay ngắn xếp vào vali; đem hộ chiếu, căn cước và vé máy bay cất vào chiếc túi đeo nhỏ trước ngực; lại sạc đầy pin máy ảnh và bỏ cục sạc dự phòng vào trong túi. Cuối cùng, cậu khóa chặt cửa sổ và cửa phòng, yên tâm cài báo thức lúc 6 giờ sáng."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "大卫把护照和机票放在了哪里？",
        qPinyin: "Dàwèi bǎ hùzhào hé jīpiào fàng zài le nǎli?",
        qVi: "David đã để hộ chiếu và vé máy bay ở đâu?",
        aHanzi: "放进了胸前的小挎包里。",
        aVi: "Bỏ vào trong túi đeo nhỏ trước ngực."
      }
    ]
  },

  // BÀI 38: 请把窗户打开
  "jc_2_1_38": {
    titleHanzi: "初夏大扫除与开窗通风",
    titlePinyin: "Chūxià dàsǎochú yǔ kāichuāng tōngfēng",
    titleVi: "Buổi tổng vệ sinh đầu hạ và mở cửa thông gió",
    summary: "Dọn dẹp phòng ký túc xá, quét dọn rác, lau bàn ghế và mở tung cửa sổ đón luồng không khí trong lành đầu hè.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "五月的初夏，微风和煦。连续几天阴雨过后，天空放晴，阳光透过树梢洒进宿舍，空气中弥漫着泥土和青草的芬芳。",
        pinyin: "Wǔ yuè de chūxià, wēifēng héxù. Liánxù jǐ tiān yīnyǔ guòhòu, tiānkōng fàngqíng, yángguāng tòuguò shùshāo sǎ jìn sùshè, kōngqì zhōng mímàn zhe nítǔ hé qīngcǎo de fēnfāng.",
        vi: "Đầu mùa hạ tháng năm làn gió thổi nhẹ ấm áp. Sau chuỗi ngày mưa âm u rả rích, bầu trời hửng nắng, ánh dương xuyên qua cành lá chiếu rọi vào ký túc xá, không gian lan tỏa hương cỏ cây đất trời tinh khôi."
      },
      {
        paraNum: 2,
        hanzi: "保罗对同屋的大卫说：“今天天气这么好，我们来做一次彻底的大扫除吧！请你先把窗户打开通风，我把地板扫一扫。” 两个人分工合作，大卫把桌子上的书本码得整整齐齐，把垃圾扔进了楼道的垃圾桶；保罗把地面拖得干干净净。清风拂过窗帘，房间顿时焕然一新。",
        pinyin: "Bǎoluó duì tóngwū de Dàwèi shuō: “Jīntiān tiānqì zhème hǎo, wǒmen lái zuò yí cì chèdǐ de dàsǎochú ba! Qǐng nǐ xiān bǎ chuānghu dǎkāi tōngfēng, wǒ bǎ dìbǎn sǎo yi sǎo.” Liǎng ge rén fēngōng hézuò, Dàwèi bǎ zhuōzi shang de shūběn mǎ de zhěngzhěng-qíqí, bǎ lājī rēng jìn le lóudào de lājītǒng; Bǎoluó bǎ dīmiàn tuō de gāngān-jìngjìng. Qīngfēng fú guò chuānglián, fángjiān dùnshí huànrán-yīxīn.",
        vi: "Paul bảo bạn cùng phòng David: 'Hôm nay trời đẹp thế này, tụi mình làm một buổi đại tổng vệ sinh nhé! Cậu mở cửa sổ ra cho thoáng gió trước đi, mình quét nhà.' Hai người phân chia công việc, David xếp sách vở trên bàn ngay ngắn thẳng tắp, đem rác vứt vào thùng rác hành lang; Paul lau sàn nhà sạch bóng không tì vết. Ngọn gió thanh mát lướt qua rèm cửa, căn phòng thoáng chốc bừng sáng tinh tươm."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "保罗和大卫是怎样分工做大扫除的？",
        qPinyin: "Bǎoluó hé Dàwèi shì zěnyàng fēngōng zuò dàsǎochú de?",
        qVi: "Paul và David phân công làm tổng vệ sinh ra sao?",
        aHanzi: "大卫开窗通风、整理书本并扔垃圾；保罗扫地和拖地。",
        aVi: "David mở cửa sổ thông gió, xếp sách và đổ rác; Paul quét và lau sàn nhà."
      }
    ]
  },

  // BÀI 39: 房间被他收拾得干干净净
  "jc_2_1_39": {
    titleHanzi: "田芳的惊喜之作",
    titlePinyin: "Tián Fāng de jīngxǐ zhī zuò",
    titleVi: "Món quà bất ngờ của Điền Phương",
    summary: "Vận dụng câu bị động chữ 被 miêu tả căn phòng được sắp đặt ngăn nắp, ga trải giường và rèm cửa được giặt sạch thơm phức.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "玛丽外出参加汉语演讲比赛整整两天。由于走得太匆忙，临走时宿舍的桌上散落着讲义，衣服也堆在椅子上，显得十分凌乱。",
        pinyin: "Mǎlì wàichū cānjiā Hànyǔ yǎnjiǎng bǐsài zhěngzhěng liǎng tiān. Yóuyú zǒu de tài cōngmáng, línzǒu shí sùshè de zhuō shang sànluò zhe jiǎngyì, yīfu yě duī zài yǐzi shang, xiǎnde shífēn língluàn.",
        vi: "Mary ra ngoài tham gia cuộc thi diễn thuyết tiếng Hán suốt 2 ngày ròng. Vì lúc đi quá vội vàng nên mặt bàn bừa bãi tài liệu, quần áo cũng chất đống trên ghế, trông vô cùng lộn xộn."
      },
      {
        paraNum: 2,
        hanzi: "周日傍晚，获奖归来的玛丽推开房门，不禁惊呆了：原本杂乱的书桌被田芳收拾得井井有条，脏衣服被洗得干干净净挂在阳台上，桌角还插着一束散发着清香的百合花。玛丽紧紧抱住田芳，心里充满了无限的感激。",
        pinyin: "Zhōurì bàngwǎn, huòjiǎng guīlái de Mǎlì tuī kāi fángmén, bùjīn jīngdāi le: yuánběn záluàn de shūzhuō bèi Tián Fāng shōushi de jǐngjǐng-yǒutiáo, zāng yīfu bèi xǐ de gāngān-jìngjìng guà zài yángtái shang, zhuōjiǎo hái chā zhe yí shù sànfā zhe qīngxiāng de bǎihéhuā. Mǎlì jǐnjǐn bàozhù Tián Fāng, xīnlǐ chōngmǎn le wúxiàn de gǎnjī.",
        vi: "Chiều chủ nhật mang giải thưởng trở về mở cửa phòng, Mary không khỏi sững sờ: bàn học bừa bộn ban đầu đã được Điền Phương dọn dẹp ngăn nắp đâu ra đấy, quần áo bẩn đã được giặt sạch phơi thơm ngoài ban công, góc bàn còn cắm một đóa hoa bách hợp ngát hương. Mary ôm chầm lấy Điền Phương, trong lòng dâng trào niềm cảm kích khôn nguôi."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "玛丽回到房间后看到了什么变化？",
        qPinyin: "Mǎlì huí dào fángjiān hòu kàndào le shénme biànhuà?",
        qVi: "Mary trở về phòng thấy được sự thay đổi gì?",
        aHanzi: "桌子被收拾得整齐，衣服被洗干净了，桌上还有鲜花。",
        aVi: "Bàn học được thu dọn ngăn nắp, quần áo được giặt sạch sẽ và trên bàn có hoa tươi."
      }
    ]
  },

  // BÀI 40: 我的自行车被偷了
  "jc_2_1_40": {
    titleHanzi: "虚惊一场的“失车”事件",
    titlePinyin: "Xūjīng yì chǎng de “shī chē” shìjiàn",
    titleVi: "Vụ việc 'mất trộm xe' một phen hú vía",
    summary: "Chiếc xe đạp tưởng như bị trộm mất, hóa ra được nhân viên an ninh dắt vào bãi đỗ xe quy định để tránh lấn chiếm lối đi cứu hỏa.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "中午放学后，爱德华匆匆忙忙跑到底楼车棚，却发现自己停在过道旁的山地自行车不见了踪影。他急得满头大汗：“我的车明明锁在这里，难道被小偷偷走了吗？”",
        pinyin: "Zhōngwǔ fàngxué hòu, Àidéhuá cōngcōng-mángmáng pǎo dào dǐlóu chēpéng, què fāxiàn zìjǐ tíng zài guòdào páng de shāndì zìxíngchē bújiàn le zōngyǐng. Tā jí de mǎntóu-dàhàn: “Wǒ de chē míngmíng suǒ zài zhèlǐ, nándào bèi xiǎotōu tōu zǒu le ma?”",
        vi: "Tan học buổi trưa, Edward hớt hải chạy xuống lán xe tầng một, bỗng phát hiện chiếc xe đạp địa hình đỗ bên lối đi đã biến mất tăm. Cậu hoảng hốt mồ hôi ướt đẫm trán: 'Xe mình rõ ràng khóa ở đây, chẳng lẽ đã bị quân trộm cắp lấy mất rồi ư?'"
      },
      {
        paraNum: 2,
        hanzi: "爱德华连忙跑到保卫处报案。保安队长听了具体描述后笑着说：“同学，别着急，你的车没有被偷。因为你把车停在了消防应急通道上，被值班保安移到了地下规范停车区。” 爱德华去地下车库找到了爱车，连连向保安叔叔道歉并道谢，表示今后一定规范停车。",
        pinyin: "Àidéhuá liánmáng pǎo dào bǎowèichù bào'àn. Bǎowān duìzhǎng tīng le jùtǐ miáoshù hòu xiào zhe shuō: “Tóngxué, bié zháojí, nǐ de chē méiyǒu bèi tōu. Yīnwèi nǐ bǎ chē tíng zài le xiāofáng yīngjí tōngdào shang, bèi zhíbān bǎo'ān yí dào le dìxià guīfàn tíngchēqū.” Àidéhuá qù dìxià chēkù zhǎodào le àichē, liánlián xiàng bǎo'ān shūshu dàoqiàn bìng dàoxiè, biǎoshì jīnhòu yídìng guīfàn tíngchē.",
        vi: "Edward vội vàng chạy tới phòng bảo vệ trình báo. Bác đội trưởng bảo vệ nghe miêu tả chi tiết liền cười nói: 'Này cháu, chớ lo, xe cháu không bị mất trộm đâu. Vì cháu đỗ chắn ngay lối thoát hiểm cứu hỏa nên đã được bảo vệ ca trực chuyển vào khu để xe tầng hầm đúng quy định rồi.' Edward xuống hầm tìm thấy xe, rối rít xin lỗi và cảm ơn chú bảo vệ, cam kết từ nay về sau nhất định đỗ xe đúng nơi quy định."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "爱德华的自行车真的被小偷偷走了吗？真相是什么？",
        qPinyin: "Àidéhuá de zìxíngchē zhēn de bèi xiǎotōu tōu zǒu le ma? Zhēnxiàng shì shénme?",
        qVi: "Xe đạp của Edward có thực sự bị kẻ trộm lấy cắp không? Chân tướng sự thật là gì?",
        aHanzi: "没有被偷，是因为挡了通道被保安移到了地下车库。",
        aVi: "Không bị trộm, do chắn lối thoát hiểm nên được bảo vệ dắt xuống bãi xe tầng hầm."
      }
    ]
  },

  // BÀI 41: 汽车开过来了
  "jc_2_2_41": {
    titleHanzi: "校门口的大巴与春游启程",
    titlePinyin: "Xiào ménkǒu de dàbā yǔ chūnyóu qǐchéng",
    titleVi: "Chuyến xe buýt lớn trước cổng trường và giờ xuất phát dã ngoại xuân",
    summary: "Vận dụng bổ ngữ xu hướng '开过来', '走过去': chiếc xe buýt du lịch từ từ lăn bánh tới đón đoàn sinh viên đi cắm trại.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "清晨七点，学校大门前停满了整装待发的旅游大巴。阳光穿透薄雾，将金色的光芒洒在欢呼雀跃的留学生们身上。",
        pinyin: "Qīngchén qī diǎn, xuéxiào dàmén qián tíng mǎn le zhěngzhuāng-dàifā de lǚyóu dàbā. Yángguāng chuāntòu báowù, jiāng jīnsè de guāngmáng sǎ zài huānhū-quèyuè de liúxuéshēngmen shēn shang.",
        vi: "7 giờ sáng sớm, trước cổng lớn của trường đỗ đầy những chiếc xe buýt du lịch chuẩn bị lăn bánh. Ánh nắng xuyên qua màn sương mỏng, rải những tia sáng vàng ấm áp lên đoàn lưu học sinh đang hân hoan rạng rỡ."
      },
      {
        paraNum: 2,
        hanzi: "随着一声喇叭声，一辆红色大巴缓缓开过来了。导游老师微笑着从车上走下来，向大家招手：“同学们，车开过来了，大家排好队走过去，注意安全！” 同学们秩序井然地上车，期待着今天的野外露营之旅。",
        pinyin: "Suízhe yì shēng lǎba shēng, yí liàng hóngsè dàbā huǎnhuǎn kāi guòlái le. Dǎoyóu lǎoshī wēixiào zhe cóng chē shang zǒu xiàlái, xiàng dàjiā zhāoshǒu: “Tóngxuémen, chē kāi guòlái le, dàjiā pái hǎo duì zǒu guòqù, zhùyì ānquán!” Tóngxuémen zhìxù-jǐngrán de shàngchē, qīdài zhe jīntiān de yěwài lùyíng zhī lǚ.",
        vi: "Kèm theo một tiếng còi xe, chiếc xe buýt lớn màu đỏ từ từ lăn bánh tới nơi. Cô giáo hướng dẫn viên mỉm cười bước xuống xe, vẫy tay gọi mọi người: 'Các em ơi, xe chạy tới rồi, mọi người xếp hàng ngay ngắn bước sang nhé, chú ý an toàn!' Các bạn học trật tự bước lên xe, tràn đầy niềm háo hức cho chuyến cắm trại dã ngoại hôm nay."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "大巴车开过来后，老师对大家说了什么？",
        qPinyin: "Dàbā chē kāi guòlái hòu, lǎoshī duì dàjiā shuō le shénme?",
        qVi: "Sau khi xe buýt lăn bánh tới nơi, giáo viên đã nói gì với mọi người?",
        aHanzi: "老师让大家排好队走过去，注意安全上车。",
        aVi: "Cô giáo bảo mọi người xếp hàng ngay ngắn bước sang, chú ý an toàn khi lên xe."
      }
    ]
  },

  // BÀI 42: 他走进来坐下了
  "jc_2_2_42": {
    titleHanzi: "语言学泰斗的学术讲座",
    titlePinyin: "Yǔyánxué tàidǒu de xuéshù jiǎngzuò",
    titleVi: "Buổi thuyết trình học thuật của bậc thầy ngôn ngữ học",
    summary: "Vận dụng bổ ngữ xu hướng kép '走进来', '坐下来': không khí trang nghiêm khi vị giáo sư khả kính bước vào giảng đường lớn.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "今天下午，学校第一报告厅座无虚席。著名汉语言学专家张教授受邀前来讲授《现代汉字演变与跨文化传播》的专题讲座。",
        pinyin: "Jīntiān xiàwǔ, xuéxiào dì-yī bàogàotīng zuòwúxūxí. Zhùmíng Hàn-yǔyánxué zhuānjiā Zhāng jiàoshòu shòuyāo qiánlái jiǎngshòu “Xiàndài Hànzì Yǎnbiàn yǔ Kuà Wénhuà Chuánbō” de zhuāntí jiǎngzuò.",
        vi: "Chiều nay, hội trường báo cáo số 1 của trường không còn một chỗ trống. Giáo sư Trương - chuyên gia ngôn ngữ Hán nổi tiếng được mời đến giảng chuyên đề 'Sự phát triển của chữ Hán hiện đại và giao lưu văn hóa xuyên quốc gia'."
      },
      {
        paraNum: 2,
        hanzi: "两点整，头发斑白的张教授精神矍铄地走进了大厅。全场立刻响起了热烈的掌声。教授走到讲台前，和蔼地向大家示意，随后微笑着坐下了。他拿起麦克风，用洪亮温和的声音开始了精彩的讲授，同学们听得如痴如醉。",
        pinyin: "Liǎng diǎn zhěng, tóufa bānbái de Zhāng jiàoshòu jīngshén-juéshuò de zǒu jìn le dàtīng. Quánchǎng lìkè xiǎngqǐ le rèliè de zhǎngshēng. Jiàoshòu zǒu dào jiǎngtái qián, hé'ǎi de xiàng dàjiā shìyì, suíhòu wēixiào zhe zuò xià le. Tā ná qǐ màikèfēng, yòng hóngliàng wēnhé de shēngyīn kāishǐ le jīngcǎi de jiǎngshòu, tóngxuémen tīng de rúchī-rùzuì.",
        vi: "Đúng 2 giờ, Giáo sư Trương mái tóc điểm bạc nhưng tinh anh quắc thước bước vào đại sảnh. Toàn hội trường lập tức vang lên tràng vỗ tay nồng nhiệt. Vị giáo sư bước tới trước bục giảng, hòa nhã ra hiệu chào mọi người, rồi mỉm cười ngồi xuống. Thầy cầm micro, dùng giọng nói ấm áp hào sảng bắt đầu bài giảng tuyệt vời, các bạn sinh viên lắng nghe say sưa mê mẩn."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "张教授走进来后，全场做出了什么反应？",
        qPinyin: "Zhāng jiàoshòu zǒu jìnlái hòu, quánchǎng zuò chū le shénme fǎnyìng?",
        qVi: "Khi Giáo sư Trương bước vào, toàn thể hội trường đã có phản ứng ra sao?",
        aHanzi: "全场立刻响起了热烈的掌声。",
        aVi: "Toàn thể hội trường lập tức vang lên tràng pháo tay nồng nhiệt."
      }
    ]
  },

  // BÀI 43: 我看得懂中文报纸
  "jc_2_2_43": {
    titleHanzi: "跨越阅读障碍的里程碑",
    titlePinyin: "Kuàyuè yuèdú zhàng'ài de lǐchéngbēi",
    titleVi: "Cột mốc vượt qua rào cản đọc hiểu văn bản chữ Hán",
    summary: "Vận dụng bổ ngữ khả năng '看得懂 / 看不懂': hành trình từ chỗ đọc từng chữ chật vật đến việc đọc trơn báo chí tiếng Trung.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "对于外国留学生来说，能独立阅读中文报刊是汉语水平迈上新台阶的重要标志。半年前，玛丽看见报纸上密密麻麻的方块字，几乎一个长句子也看不懂。",
        pinyin: "Duìyú wàiguó liúxuéshēng láishuō, néng dúlì yuèdú Zhōngwén bàokān shì Hànyǔ shuǐpíng mài shàng xīn táijiē de zhòngyào biāozhì. Bàn nián qián, Mǎlì kànjiàn bàozhǐ shang mìmì-mámá de fāngkuàizì, jīhū yí ge cháng jùzi yě kàn bu dǒng.",
        vi: "Đối với du học sinh nước ngoài, việc có thể tự đọc báo chí tiếng Trung là cột mốc quan trọng đánh dấu trình độ tiếng Hán bước lên tầm cao mới. Nửa năm trước, Mary nhìn những hàng chữ Hán vuông vức san sát trên mặt báo hầu như chẳng hiểu nổi một câu dài nào."
      },
      {
        paraNum: 2,
        hanzi: "经过每天早晨坚持朗读和积累新闻词汇，今天的她已经能轻松看懂《人民日报》上的文化与科技新闻了。即使偶尔遇到生词，也能根据上下文猜出大概意思。玛丽欣喜地感叹：“只要找对方法并坚持下去，世界上就没有学不会的语言！”",
        pinyin: "Jīngguò měitiān zǎochén jiānchí lǎngdú hé jīlěi xīnwén cíhuì, jīntiān de tā yǐjīng néng qīngsōng kàndǒng “Rénmín Rìbào” shang de wénhuà yǔ kējì xīnwén le. Jíshǐ ǒu'ěr yù dào shēngcí, yě néng gēnjù shàngxiàwén cāi chū dàgài yìsi. Mǎlì xīnxǐ de gǎntàn: “Zhǐyào zhǎo duì fāngfǎ bìng jiānchí xiàqu, shìjiè shang jiù méiyǒu xué bu huì de yǔyán!”",
        vi: "Nhờ kiên trì đọc to mỗi sáng và tích lũy từ vựng thời sự, hôm nay cô đã có thể dễ dàng đọc hiểu các tin tức văn hóa và công nghệ trên tờ 'Nhân Dân Nhật Báo'. Dù thỉnh thoảng có gặp từ mới, cô cũng đoán được nghĩa đại khái dựa vào ngữ cảnh. Mary vui mừng thốt lên: 'Chỉ cần tìm đúng phương pháp và kiên trì theo đuổi, trên đời này không có ngôn ngữ nào là không học được!'"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "玛丽现在能看懂什么报纸上的文章？",
        qPinyin: "Mǎlì xiànzài néng kàndǒng shénme bàozhǐ shang de wénzhāng?",
        qVi: "Hiện tại Mary có thể đọc hiểu bài báo nào?",
        aHanzi: "能看懂《人民日报》上的文化与科技新闻。",
        aVi: "Có thể đọc hiểu tin tức văn hóa và khoa học công nghệ trên báo Nhân Dân Nhật Báo."
      }
    ]
  },

  // BÀI 44: 这个礼堂坐得下一千人
  "jc_2_2_44": {
    titleHanzi: "现代化国际学术大礼堂",
    titlePinyin: "Xiàndàihuà guójì xuéshù dà lǐtáng",
    titleVi: "Đại lễ đường học thuật quốc tế hiện đại",
    summary: "Vận dụng bổ ngữ khả năng biểu thị dung lượng '坐得下 / 坐不下': miêu tả quy mô to lớn của trung tâm hội nghị đa năng trường.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "为了迎接建校六十周年庆典，学校新建成了一座气势恢宏的现代化多功能学术礼堂。红白相间的流线型外观在绿树掩映下格外引人注目。",
        pinyin: "Wèile yíngjiē jiànxiào liùshí zhōunián qìngdiǎn, xuéxiào xīn jiànchéng le yí zuò qìshì-huīhóng de xiàndàihuà duō gōngnéng xuéshù lǐtáng. Hóng bái xiāngjiàn de liúxiànxíng wàiguān zài lǜshù yǎnyìng xià géwài yǐnrénzhùmù.",
        vi: "Để chào mừng lễ kỷ niệm 60 năm thành lập trường, một đại lễ đường học thuật đa năng hiện đại với khí thế nguy nga vừa được khánh thành. Kiểu dáng uốn lượn đan xen giữa sắc đỏ và trắng nổi bật giữa rặng cây xanh biếc."
      },
      {
        paraNum: 2,
        hanzi: "礼堂内部设计极其宽敞，音响和灯光设备也是国际一流的。礼堂上下两层共有超过一千二百个舒适的软座，即便是一千多名师生同时入座，也完全坐得下。在这座气派的礼堂里举行开学典礼和文艺晚会，每个人都能享受到绝佳的视听盛宴。",
        pinyin: "Lǐtáng nèibù shèjì jíqí kuānchǎng, yīnxiǎng hé dēngguāng shèbèi yě shì guójì yīliú de. Lǐtáng shàngxià liǎng céng gòng yǒu chāoguò yiqīan èrbǎi ge shūshì de ruǎnzuò, jíbiàn shì yìqiān duō míng shīshēng tóngshí rùzuò, yě wánquán zuò de xià. Zài zhè zuò qìpài de lǐtáng lǐ jǔxíng kāixué diǎnlǐ hé wényì wǎnhuì, měi ge rén dōu néng xiǎngshòu dào juéjiā de shìtīng shèngyàn.",
        vi: "Thiết kế bên trong lễ đường vô cùng rộng rãi, trang thiết bị âm thanh ánh sáng đạt đẳng cấp quốc tế. Hai tầng trên dưới của lễ đường có hơn 1200 ghế bọc nệm êm ái, cho dù hơn một nghìn thầy trò cùng lúc ngồi vào cũng hoàn toàn chứa đủ. Tổ chức lễ khai giảng và dạ hội văn nghệ trong khán phòng hoành tráng này, ai nấy đều được tận hưởng bữa tiệc nghe nhìn tuyệt đỉnh."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "新建的大学礼堂能容纳多少人？",
        qPinyin: "Xīn jiàn de dàxué lǐtáng néng róngnà duōshao rén?",
        qVi: "Đại lễ đường mới xây của trường có thể chứa được bao nhiêu người?",
        aHanzi: "有一千二百多个座位，完全坐得下一千多人。",
        aVi: "Có hơn 1200 chỗ ngồi, hoàn toàn ngồi vừa hơn một nghìn người."
      }
    ]
  },

  // BÀI 45: 不仅会说汉语，还会写汉字
  "jc_2_2_45": {
    titleHanzi: "外国留学生的汉字书法情缘",
    titlePinyin: "Wàiguó liúxuéshēng de Hànzì shūfǎ qíngyuán",
    titleVi: "Mối duyên bút mực thư pháp chữ Hán của lưu học sinh",
    summary: "Vận dụng mẫu câu tăng tiến '不仅...而且 / 还...': lưu học sinh không chỉ nói lưu loát mà còn say mê nét bút thư pháp lông cừu.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "爱德华不仅日常汉语口语表达流利，而且对古老神秘的中国汉字有着极其浓厚的兴趣。在他看来，每一个汉字都是一幅生动优美的图画。",
        pinyin: "Àidéhuá bùjǐn rìcháng Hànyǔ kǒuyǔ biǎodá liúlì, érqiě duì gǔlǎo shénmì de Zhōngguó Hànzì yǒu zhe jíqí nónghòu de xìngqù. Zài tā kànlái, měi yí ge Hànzì dōu shì yì fú shēngdòng yōuměi de túhuà.",
        vi: "Edward không những diễn đạt khẩu ngữ tiếng Hán hằng ngày lưu loát, mà còn ấp ủ niềm hứng thú vô cùng sâu sắc đối với chữ Hán cổ xưa huyền diệu. Trong mắt cậu, mỗi một chữ Hán đều là một bức họa sống động mỹ miều."
      },
      {
        paraNum: 2,
        hanzi: "他报名参加了学校的书法社团。每个周末，他都手握毛笔，在宣纸上凝神静气地临摹颜真卿的楷书字帖。经过近一年的苦练，爱德华不仅字迹工整端庄，还能写出一手漂亮的对联。在全校留学生书法展览中，他的作品《天道酬勤》荣获了一等奖。",
        pinyin: "Tā bàomíng cānjiā le xuéxiào de shūfǎ shètuán. Měi ge zhōumò, tā dōu shǒu wò máobǐ, zài xuānzhǐ shang níngshén-jìngqì de línmó Yán Zhēnqīng de kǎishū zìtiè. Jīngguò jìn yì nián de kǔliàn, Àidéhuá bùjǐn zìjì gōngzhěng duānzhuāng, hái néng xiě chū yì shǒu piàoliang de duìlián. Zài quánxiào liúxuéshēng shūfǎ zhǎnlǎn zhōng, tā de zuòpǐn “Tiān Dào Chóu Qín” rónghuò le yīděngjiǎng.",
        vi: "Cậu ghi danh gia nhập câu lạc bộ thư pháp của trường. Mỗi dịp cuối tuần, cậu đều cầm chắc bút lông, định tâm tĩnh khí trên giấy tuyên mô phỏng theo mẫu chữ Khải của Nhan Chân Khanh. Trải qua gần một năm khổ luyện, nét chữ của Edward chẳng những ngay ngắn đoan trang, mà còn viết được những câu đối tuyệt mỹ. Trong triển lãm thư pháp lưu học sinh toàn trường, tác phẩm 'Thiên Đạo Thù Cần' của cậu đã vinh dự đạt giải nhất."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "爱德华的书法作品获得了什么奖项？",
        qPinyin: "Àidéhuá de shūfǎ zuòpǐn huòdé le shénme jiǎngxiàng?",
        qVi: "Tác phẩm thư pháp của Edward đã giành được giải thưởng gì?",
        aHanzi: "他的作品《天道酬勤》荣获了一等奖。",
        aVi: "Tác phẩm 'Thiên Đạo Thù Cần' của cậu đã đạt giải nhất."
      }
    ]
  },

  // BÀI 46: 无论刮风下雨他都来
  "jc_2_2_46": {
    titleHanzi: "求学路上的坚毅与执着",
    titlePinyin: "Qiúxué lù shang de jiānyì yǔ zhízhuó",
    titleVi: "Sự kiên nghị và bền bỉ trên con đường tầm sư học đạo",
    summary: "Vận dụng cấu trúc vô điều kiện '无论...都...': tấm gương chuyên cần của người bạn học không quản gió mưa rét mướt.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在语言大学的一年级班里，来自泰国的留学生颂猜是公认的“全勤模范”。从开学的第一天起，他的出勤记录本上从来没有出现过一次迟到或旷课。",
        pinyin: "Zài Yǔyán Dàxué de yī niánjí bān lǐ, láizì Tàiguó de liúxuéshēng Sòngchāi shì gōngrèn de “quánqín mófàn”. Cóng kāixué de dì-yī tiān qǐ, tā de chūqín jìlùběn shang cónglái méiyǒu chūxiàn guo yí cì chídào huò kuàngkè.",
        vi: "Trong lớp năm thứ nhất Đại học Ngôn ngữ, bạn lưu học sinh Somchai đến từ Thái Lan là 'tấm gương chuyên cần tuyệt đối' được cả lớp công nhận. Từ ngày đầu khai giảng đến nay, sổ điểm danh của cậu chưa từng có một lần đi muộn hay nghỉ học."
      },
      {
        paraNum: 2,
        hanzi: "无论是冬天的刺骨寒风、鹅毛大雪，还是夏天的倾盆大雨，颂猜总是早晨七点半就准时背着书包出现在第一排座位上。老师和同学们问他为什么这么自律，颂猜谦逊地说：“家里供我出国留学非常不容易，只有克服一切困难努力求学，才对得起父母的殷切期盼。”",
        pinyin: "Wúlùn shì dōngtiān de cìgǔ hánfēng, émáo-dàxuě, háishi xiàtiān de qīngpén-dàyǔ, Sòngchāi zǒngshì zǎochén qī diǎn bàn jiù zhǔnshí bēi zhe shūbāo chūxiàn zài dì-yī pái zuòwèi shang. Lǎoshī hé tóngxuémen wèn tā wèishénme zhème zìlǜ, Sòngchāi qiānxùn de shuō: “Jiālǐ gōng wǒ chūguó liúxué fēicháng bù róngyì, zhǐyǒu kèfú yíqiè kùnnan nǔlì qiúxué, cái duìdeqǐ fùmǔ de yīnqiè qīpàn.”",
        vi: "Dù là gió lạnh thấu xương, tuyết rơi trắng xóa mùa đông, hay mưa rào tầm tã như trút nước mùa hạ, Somchai luôn mang ba lô có mặt đúng 7 giờ rưỡi sáng tại dãy bàn đầu tiên. Thầy cô và bạn bè hỏi tại sao cậu có thể kỷ luật bản thân đến vậy, Somchai khiêm tốn nói: 'Gia đình nuôi em ra nước ngoài du học rất đỗi nhọc nhằn, chỉ có vượt qua muôn vàn trắc trở gắng công dùi mài kinh sử mới xứng đáng với kỳ vọng tha thiết của mẹ cha.'"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "为什么颂猜无论刮风下雨都坚持准时上课？",
        qPinyin: "Wèishénme Sòngchāi wúlùn guāfēng-xiàyǔ dōu jiānchí zhǔnshí shàngkè?",
        qVi: "Tại sao Somchai dù gió mưa bão bùng đều kiên trì lên lớp đúng giờ?",
        aHanzi: "为了不辜负家里供他出国留学的付出与父母的期盼。",
        aVi: "Để không phụ công ơn gia đình nuôi du học và kỳ vọng tha thiết của bố mẹ."
      }
    ]
  },

  // BÀI 47: 越来越好，越学越有意思
  "jc_2_2_47": {
    titleHanzi: "渐入佳境的中华文化探索",
    titlePinyin: "Jiàn rù jiājìng de Zhōnghuá wénhuà tànsuǒ",
    titleVi: "Càng khám phá văn hóa Trung Hoa càng say mê cuốn hút",
    summary: "Vận dụng mẫu câu '越来越...' và '越...越...': cảm nhận sâu sắc sự tiến bộ ngôn ngữ mở ra chân trời văn hóa rộng lớn.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "学汉语就像爬山，刚起步时往往觉得坡陡路滑、吃力辛苦；但只要坚持爬上山腰，眼前的视野就会越来越宽广，风光也会越来越壮丽。",
        pinyin: "Xué Hànyǔ jiù xiàng páshān, gāng qǐbù shí wǎngwǎng juéde pō dǒu lù huá, chīlì xīnkǔ; dàn zhǐyào jiānchí pá shàng shānyāo, yǎnqián de shìyě jiù huì yuè lái yuè kuānguǎng, fēngguāng yě huì yuè lái yuè zhuànglì.",
        vi: "Học tiếng Hán cũng giống như leo núi, khi mới cất bước thường cảm thấy dốc cao trơn trượt, nhọc nhằn vất vả; nhưng một khi kiên trì leo lên sườn núi, tầm mắt trước mắt sẽ càng lúc càng thênh thang, cảnh quan cũng càng thêm hùng vĩ tráng lệ."
      },
      {
        paraNum: 2,
        hanzi: "随着生词量和历史知识的积累，麦克对汉语的感情从最初的“不得不学”转变成了“热爱入迷”。他发现，汉语成语背后蕴藏着智慧的寓言，诗词歌赋中跳动着优美的韵律。他由衷地赞叹：“汉语越学越有意思，我对中国文化的理解也越来越深刻了！”",
        pinyin: "Suízhe shēngcíliàng hé lìshǐ zhīshi de jīlěi, Màikè duì Hànyǔ de gǎnqíng cóng zuìchū de “bùdébù xué” zhuǎnbiàn chéng le “rè'ài rùmí”. Tā fāxiàn, Hànyǔ chéngyǔ bèihòu yùncáng zhe zhìhuì de yùyán, shīcí gēfù zhōng tiàodòng zhe yōuměi de yùnlǜ. Tā yóuzhōng de zàntàn: “Hànyǔ yuè xué yuè yǒuyìsi, wǒ duì Zhōngguó wénhuà de lǐjiě yě yuè lái yuè shēnkè le!”",
        vi: "Cùng với việc tích lũy vốn từ và kiến thức lịch sử, tình cảm của Mike dành cho tiếng Hán từ chỗ 'phải học' ban đầu đã chuyển hóa thành 'đam mê mê mẩn'. Cậu nhận ra sau mỗi câu thành ngữ là một câu chuyện ngụ ngôn đầy triết lý, trong từng vần thơ câu từ đều ngân vang giai điệu tuyệt mỹ. Cậu tự đáy lòng thốt lên: 'Tiếng Hán càng học càng thấy hay, và sự thấu hiểu của mình đối với văn hóa Trung Hoa cũng ngày một sâu sắc hơn!'"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "麦克为什么觉得汉语越学越有意思？",
        qPinyin: "Màikè wèishénme juéde Hànyǔ yuè xué yuè yǒuyìsi?",
        qVi: "Tại sao Mike lại thấy tiếng Hán càng học càng thú vị?",
        aHanzi: "因为他发现了成语背后的智慧寓言与优美韵律，理解越来越深。",
        aVi: "Bởi vì cậu khám phá ra những ngụ ngôn trí tuệ và âm điệu tuyệt vời sau các thành ngữ, nhận thức ngày càng sâu sắc."
      }
    ]
  },

  // BÀI 48: 虽然很累，但是很开心
  "jc_2_2_48": {
    titleHanzi: "香山红叶节的秋游远足",
    titlePinyin: "Xiāngshān Hóngyè Jié de qiūyóu yuǎnzú",
    titleVi: "Chuyến dã ngoại ngắm lá đỏ Hương Sơn tiết thu",
    summary: "Vận dụng cặp từ liên kết '虽然...但是...': leo lên đỉnh Quỷ Kiến Sầu tuy mệt mỏi nhưng ngắm nhìn biển lá đỏ rực rỡ ngập tràn niềm vui.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "金秋十月是北京最宜人的季节，也是香山红叶最为绚丽夺目的时刻。留学生班三十多名师生利用周六组织了一次香山登山徒步活动。",
        pinyin: "Jīnqiū shí yuè shì Běijīng zuì yírén de jìjié, yě shì Xiāngshān hóngyè zuìwéi xuànlì-duómù de shíkè. Liúxuéshēng bān sānshí duō míng shīshēng lìyòng zhōuliù zǔzhī le yí cì Xiāngshān dēngshān túbù huódòng.",
        vi: "Mùa thu vàng tháng 10 là thời điểm dễ chịu nhất ở Bắc Kinh, cũng là khoảnh khắc lá đỏ Hương Sơn rực rỡ lộng lẫy nhất. Hơn 30 thầy trò lớp lưu học sinh đã tận dụng ngày thứ bảy tổ chức chuyến đi bộ leo núi Hương Sơn."
      },
      {
        paraNum: 2,
        hanzi: "香山的石阶陡峭曲折，攀登了近两个小时后，许多同学满头大汗、双腿发酸。然而，当大家终于登上最高峰“鬼见愁”，极目远眺那漫山遍野如烈火般绚烂的红叶时，所有的疲倦瞬间烟消云散。大家开心地合影欢呼：“虽然登山过程很累，但是饱览这大自然的鬼斧神工，我们心里无比开心！”",
        pinyin: "Xiāngshān de shíjiē dǒuqiào qūzhé, pāndēng le jìn liǎng ge xiǎoshí hòu, xǔduō tóngxué mǎntóu-dàhàn, shuāng tuǐ fā suān. Rán'ér, dāng dàjiā zhōngyú dēng shàng zuì gāofēng “Guǐjiànchóu”, jímù-yuǎntiào nà mànshān-biànyě rú lièhuǒ bān xuànlàn de hóngyè shí, suǒyǒu de píjuàn shùnjiān yānxiāo-yúnsàn. Dàjiā kāixīn de héyǐng huānhū: “Suīrán dēngshān guòchéng hěn lèi, dànshì bǎolǎn zhè dàzìrán de guǐfǔ-shéngōng, wǒmen xīnlǐ wúbǐ kāixīn!”",
        vi: "Những bậc đá Hương Sơn dốc đứng khúc khuỷu, sau gần 2 giờ leo trèo, nhiều bạn mồ hôi đầm đìa, hai chân mỏi nhừ. Thế nhưng, khi mọi người chạm đỉnh cao nhất 'Quỷ Kiến Sầu', phóng tầm mắt ngắm bạt ngàn sắc lá đỏ rực như lửa cháy khắp các sườn đồi, mọi nỗi mệt mỏi tức thì tan thành mây khói. Cả lớp cùng hân hoan chụp ảnh reo hò: 'Tuy leo núi rất mệt, nhưng ngắm nhìn tuyệt tác kỳ vĩ này của thiên nhiên, trong lòng chúng mình vô cùng hạnh phúc!'"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "登上香山顶峰后，大家的感觉是什么？",
        qPinyin: "Dēng shàng Xiāngshān dǐngfēng hòu, dàjiā de gǎnjué shì shénme?",
        qVi: "Sau khi lên đến đỉnh núi Hương Sơn, cảm giác của mọi người là gì?",
        aHanzi: "虽然身体很累，但是看到了漫山红叶，心里非常开心。",
        aVi: "Dù cơ thể mỏi mệt nhưng ngắm nhìn biển lá đỏ bạt ngàn, trong lòng rất đỗi vui sướng."
      }
    ]
  },

  // BÀI 49: 如果明天下雨，我们就不去
  "jc_2_2_49": {
    titleHanzi: "郊外烧烤聚会的备用方案",
    titlePinyin: "Jiāowài shāokǎo jùhuì de bèiyòng fāng'àn",
    titleVi: "Phương án dự phòng cho buổi liên hoan thịt nướng ngoại ô",
    summary: "Vận dụng câu điều kiện giả thiết '如果...就...': lập kế hoạch linh hoạt theo diễn biến dự báo thời tiết khí tượng thủy văn.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "周五下午，同学们聚在学生活动中心商量周末的野餐聚会。班长提出去郊区的怀柔雁栖湖湖畔举行户外烧烤。",
        pinyin: "Zhōuwǔ xiàwǔ, tóngxuémen jù zài xuéshēng huódòng zhōngxīn shāngliang zhōumò de yěcān jùhuì. Bānzhǎng tíchū qù jiāoqū de Huáiróu Yànqī Hú húpàn jǔxíng hùwài shāokǎo.",
        vi: "Chiều thứ sáu, các bạn tập trung tại trung tâm sinh hoạt sinh viên bàn bạc kế hoạch dã ngoại cuối tuần. Lớp trưởng đề xuất đến bên bờ hồ Nhạn Tê huyện Hoài Nhu ngoại ô tổ chức nướng thịt ngoài trời."
      },
      {
        paraNum: 2,
        hanzi: "这时，有人查看天气预报发现明后两天可能伴有雷阵雨。副班长认真地说：“如果明天下雨或者大风，露天烧烤就不安全，我们就不去了；我们改成在校内的多功能厅举办室内音乐茶话会。如果明天晴天，原计划照常进行。” 大家纷纷称赞这个周密稳妥的备选方案。",
        pinyin: "Zhè shí, yǒu rén chákàn tiānqì yùbào fāxiàn mínghòu liǎng tiān kěnéng bànyǒu léizhènyǔ. Fù-bānzhǎng rènzhēn de shuō: “Rúguǒ míngtiān xiàyǔ huòzhě dàfēng, lùtiān shāokǎo jiù bù ānquán, wǒmen jiù bú qù le; wǒmen gǎichéng zài xiàonèi de duōgōngnéngtīng jǔbàn shìnèi yīnyuè cháhuàhuì. Rúguǒ míngtiān qíngtiān, yuán jìhuà zhàocháng jìnxíng.” Dàjiā fēnfēn chēngzàn zhè ge zhōumì wěntuǒ de bèixuǎn fāng'àn.",
        vi: "Lúc này có bạn tra cứu dự báo thời tiết thấy hai ngày tới có khả năng có mưa rào kèm dông. Lớp phó nghiêm túc đề xuất: 'Nếu ngày mai trời mưa hoặc gió lớn, nướng thịt ngoài trời sẽ không an toàn, chúng mình sẽ không đi nữa; chúng mình đổi sang tổ chức buổi tiệc trà ca nhạc trong hội trường đa năng trường. Nếu trời quang đãng, kế hoạch ban đầu giữ nguyên.' Mọi người tấm tắc khen ngợi phương án dự phòng chu đáo thấu đáo này."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "如果明天下雨，同学们的备用活动是什么？",
        qPinyin: "Rúguǒ míngtiān xiàyǔ, tóngxuémen de bèiyòng huódòng shì shénme?",
        qVi: "Nếu ngày mai trời đổ mưa, hoạt động dự phòng của các bạn là gì?",
        aHanzi: "改在校内多功能厅举办室内音乐茶话会。",
        aVi: "Chuyển sang tổ chức tiệc trà âm nhạc trong nhà tại hội trường đa năng trường."
      }
    ]
  },

  // BÀI 50: 既然来了，就多玩几天
  "jc_2_2_50": {
    titleHanzi: "远方来客与古都待客之道",
    titlePinyin: "Yuǎnfāng láikè yǔ gǔdū dàikè zhī dào",
    titleVi: "Khách quý phương xa và đạo đãi khách của người kinh kỳ",
    summary: "Vận dụng mẫu câu '既然...就...': đón gia đình từ nước ngoài sang thăm, khuyên người thân ở lại khám phá danh lam thắng cảnh Bắc Kinh.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "保罗的父母趁着休假，特意从澳大利亚悉尼乘飞机来到北京探望儿子。看到儿子能讲一口地道流利的普通话，父母感到无比骄傲与欣慰。",
        pinyin: "Bǎoluó de fùmǔ chèn zhe xiūjià, tèyì cóng Àodàlìyà Xīní chéng fēijī lái dào Běijīng tànwàng érzi. Kàndào érzi néng jiǎng yì kǒu dìdao liúlì de pǔtōnghuà, fùmǔ gǎndào wúbǐ jiāo'ào yǔ xīnwèi.",
        vi: "Bố mẹ Paul nhân kỳ nghỉ phép, đặc biệt từ Sydney nước Úc bay sang Bắc Kinh thăm con trai. Nhìn thấy con trai nói được thứ tiếng phổ thông lưu loát chuẩn xác, bố mẹ cảm thấy vô cùng tự hào và an tâm."
      },
      {
        paraNum: 2,
        hanzi: "由于工作繁忙，父母原本打算只停留三天就回国。保罗诚恳地劝父母：“爸爸妈妈，既然千里迢迢来了中国，就多玩几天吧！北京不仅有故宫、颐和园，还有现代化的鸟巢和水立方，我还要带你们去尝尝正宗的全聚德烤鸭呢！” 父母高兴地接受了保罗的建议，决定把返程机票改签，多留一周好好领略这座城市的魅力。",
        pinyin: "Yóuyú gōngzuò fánmáng, fùmǔ yuánběn dǎsuan zhǐ tíngliú sān tiān jiù huíguó. Bǎoluó chéngkěn de quàn fùmǔ: “Bàba māma, jìrán qiānlǐ-tiáotiáo lái le Zhōngguó, jiù duō wán jǐ tiān ba! Běijīng bùjǐn yǒu Gùgōng, Yíhéyuán, hái yǒu xiàndàihuà de Niǎocháo hé Shuǐlìfāng, wǒ hái yào dài nǐmen qù chángchang zhèngzōng de Quánjùdé kǎoyā ne!” Fùmǔ gāoxìng de jiēshòu le Bǎoluó de jiànyì, juédìng bǎ fǎnchéng jīpiào gǎiqiān, duō liú yì zhōu hǎohǎo lǐnglüè zhè zuò chéngshì de mèilì.",
        vi: "Do công việc bận rộn, ban đầu bố mẹ chỉ dự định lưu lại 3 ngày rồi bay về nước. Paul tha thiết khuyên nhủ bố mẹ: 'Bố mẹ ơi, một khi đã lặn lội ngàn dặm đến Trung Quốc rồi thì ở lại chơi thêm ít ngày nữa đi ạ! Bắc Kinh không chỉ có Cố Cung, Di Hòa Viên mà còn có Tổ Chim, Thủy Lập Phương hiện đại, con còn muốn dẫn bố mẹ đi nếm thử vịt quay Toàn Tụ Đức chính hiệu nữa cơ!' Bố mẹ vui vẻ nghe theo lời con trai, quyết định đổi vé máy bay về sau, ở lại thêm một tuần để thưởng ngoạn vẻ quyến rũ của thành phố này."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "保罗是怎样劝说父母多在国外留几天的？",
        qPinyin: "Bǎoluó shì zěnyàng quànshuō fùmǔ duō zài guówài liú jǐ tiān de?",
        qVi: "Paul đã khuyên bố mẹ ở lại chơi thêm vài ngày như thế nào?",
        aHanzi: "保罗说既然来了就多玩几天，带他们游故宫、吃烤鸭。",
        aVi: "Paul nói đã đến đây rồi thì ở lại chơi thêm ít ngày, để cậu dẫn đi thăm Cố Cung, ăn vịt quay."
      }
    ]
  }
};

// Update data
let updatedCount = 0;
for (const lesson of jiaocheng.lessons) {
  if (vol2Narratives[lesson.id]) {
    lesson.narrative = vol2Narratives[lesson.id];
    updatedCount++;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(jiaocheng, null, 2), 'utf8');
console.log(`[Vol 2 Narratives] Updated ${updatedCount} lessons with authentic narrative reading texts.`);
