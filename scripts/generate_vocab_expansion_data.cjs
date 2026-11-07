const fs = require('fs');
const path = require('path');

const vocabExpansionRoots = [
  {
    id: "root_bu",
    char: "不",
    pinyin: "bù",
    hanviet: "BẤT",
    meaning: "Không, chẳng (phủ định, trái ngược)",
    category: "auxiliary",
    strokeCount: 4,
    radical: "一 (Nhất)",
    tip: "Gốc phủ định quan trọng nhất tiếng Trung. Biến điệu: đọc thanh 2 (bú) khi đứng trước âm tiết mang thanh 4.",
    compounds: [
      {
        word: "不是",
        pinyin: "bú shì",
        hanviet: "Bất thị",
        meaning: "Không phải là",
        pos: "Phó từ / Liên từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "这不是我的手机，是小李的。",
          pinyin: "Zhè bú shì wǒ de shǒujī, shì Xiǎo Lǐ de.",
          vi: "Đây không phải là điện thoại của tôi, là của Tiểu Lý."
        }
      },
      {
        word: "不能",
        pinyin: "bù néng",
        hanviet: "Bất năng",
        meaning: "Không thể, không được phép",
        pos: "Động từ năng nguyện",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "公共场所不能大声喧哗。",
          pinyin: "Gōnggòng chǎngsuǒ bù néng dàshēng xuānhuá.",
          vi: "Nơi công cộng không được làm ồn."
        }
      },
      {
        word: "不要",
        pinyin: "bú yào",
        hanviet: "Bất yếu",
        meaning: "Đừng, không cần, không muốn",
        pos: "Phó từ mệnh lệnh",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "请大家不要担心，一切都很顺利。",
          pinyin: "Qǐng dàjiā bú yào dānxīn, yíqiè dōu hěn shùnlì.",
          vi: "Xin mọi người đừng lo lắng, mọi việc đều rất thuận lợi."
        }
      },
      {
        word: "不用",
        pinyin: "bú yòng",
        hanviet: "Bất dụng",
        meaning: "Không cần thiết, không phải",
        pos: "Phó từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "今天不下雨，你不用带雨伞。",
          pinyin: "Jīntiān bú xiàyǔ, nǐ bú yòng dài yǔsǎn.",
          vi: "Hôm nay trời không mưa, bạn không cần mang ô."
        }
      },
      {
        word: "不但",
        pinyin: "bú dàn",
        hanviet: "Bất đán",
        meaning: "Không những, không chỉ (thường đi với 而且)",
        pos: "Liên từ",
        structure: "Phụ gia (附加)",
        example: {
          zh: "他不但汉语流利，而且字也写得很漂亮。",
          pinyin: "Tā búdàn hànyǔ liúlì, érqiě zì yě xiě de hěn piàoliang.",
          vi: "Anh ấy không những tiếng Trung lưu loát mà chữ viết cũng rất đẹp."
        }
      },
      {
        word: "不断",
        pinyin: "bú duàn",
        hanviet: "Bất đoạn",
        meaning: "Không ngừng, liên tục",
        pos: "Phó từ / Tính từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "我们要不断学习新知识以适应社会发展。",
          pinyin: "Wǒmen yào búduàn xuéxí xīn zhīshi yǐ shìyìng shèhuì fāzhǎn.",
          vi: "Chúng ta cần không ngừng học kiến thức mới để thích ứng với sự phát triển của xã hội."
        }
      },
      {
        word: "不管",
        pinyin: "bù guǎn",
        hanviet: "Bất quản",
        meaning: "Bất kể, cho dù (thường đi với 都/也)",
        pos: "Liên từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "不管天气如何，比赛都会照常举行。",
          pinyin: "Bùguǎn tiānqì rúhé, bǐsài dōu huì zhàocháng jǔxíng.",
          vi: "Bất kể thời tiết thế nào, cuộc thi vẫn diễn ra như bình thường."
        }
      },
      {
        word: "不好意思",
        pinyin: "bù hǎoyìsi",
        hanviet: "Bất hảo ý tứ",
        meaning: "Ngại ngùng, áy náy, xin lỗi",
        pos: "Tính từ",
        structure: "Cụm cố định",
        example: {
          zh: "真不好意思，让您久等了！",
          pinyin: "Zhēn bù hǎoyìsi, ràng nín jiǔ děng le!",
          vi: "Thật ngại quá, để bác phải đợi lâu!"
        }
      }
    ]
  },
  {
    id: "root_you",
    char: "有",
    pinyin: "yǒu",
    hanviet: "HỮU",
    meaning: "Có, sở hữu, tồn tại",
    category: "action",
    strokeCount: 6,
    radical: "月 (Nguyệt)",
    tip: "Gốc từ biểu thị sự tồn tại hoặc sở hữu. Ghép với danh từ/tính từ để tạo từ chỉ đặc điểm tích cực.",
    compounds: [
      {
        word: "有名",
        pinyin: "yǒu míng",
        hanviet: "Hữu danh",
        meaning: "Nổi tiếng, có tiếng tăm",
        pos: "Tính từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "北京烤鸭是一道世界闻名的菜肴。",
          pinyin: "Běijīng kǎoyā shì yídào shìjiè yǒumíng de càiyáo.",
          vi: "Vịt quay Bắc Kinh là một món ăn nổi tiếng khắp thế giới."
        }
      },
      {
        word: "有钱",
        pinyin: "yǒu qián",
        hanviet: "Hữu tiền",
        meaning: "Giàu có, lắm tiền nhiều của",
        pos: "Tính từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "他很有钱，但生活非常简朴。",
          pinyin: "Tā hěn yǒuqián, dàn shēnghuó fēicháng jiǎnpǔ.",
          vi: "Anh ấy rất giàu có nhưng cuộc sống lại vô cùng giản dị."
        }
      },
      {
        word: "有意思",
        pinyin: "yǒu yìsi",
        hanviet: "Hữu ý tứ",
        meaning: "Hay, thú vị, có ý nghĩa",
        pos: "Tính từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "这本中文小说很有意思，情节引人入胜。",
          pinyin: "Zhè běn zhōngwén xiǎoshuō hěn yǒuyìsi, qíngjié yǐnrénrùshèng.",
          vi: "Cuốn tiểu thuyết tiếng Trung này rất thú vị, tình tiết hấp dẫn."
        }
      },
      {
        word: "有效",
        pinyin: "yǒu xiào",
        hanviet: "Hữu hiệu",
        meaning: "Hiệu quả, có hiệu lực",
        pos: "Tính từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "这种学习方法非常有效，提高了我的词汇量。",
          pinyin: "Zhè zhǒng xuéxí fāngfǎ fēicháng yǒuxiào, tígāo le wǒ de cíhuìliàng.",
          vi: "Phương pháp học này rất hiệu quả, đã nâng cao vốn từ vựng của tôi."
        }
      },
      {
        word: "有空",
        pinyin: "yǒu kòng",
        hanviet: "Hữu không",
        meaning: "Có thời gian rảnh, rảnh rỗi",
        pos: "Động từ / Tính từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "这个周末你有空一起去图书馆吗？",
          pinyin: "Zhège zhōumò nǐ yǒukòng yìqǐ qù túshūguǎn ma?",
          vi: "Cuối tuần này bạn có rảnh cùng đi thư viện không?"
        }
      },
      {
        word: "有用",
        pinyin: "yǒu yòng",
        hanviet: "Hữu dụng",
        meaning: "Hữu ích, có ích, hữu dụng",
        pos: "Tính từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "老师给的建议对我的考试复习非常有用。",
          pinyin: "Lǎoshī gěi de jiànyì duì wǒ de kǎoshì fùxí fēicháng yǒuyòng.",
          vi: "Lời khuyên của thầy cô rất hữu ích cho việc ôn thi của tôi."
        }
      },
      {
        word: "有关",
        pinyin: "yǒu guān",
        hanviet: "Hữu quan",
        meaning: "Liên quan đến, có quan hệ",
        pos: "Động từ / Giới từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "我们讨论了与环境保护有关的问题。",
          pinyin: "Wǒmen tǎolùn le yǔ huánjìng bǎohù yǒuguān de wèntí.",
          vi: "Chúng tôi đã thảo luận về các vấn đề liên quan đến bảo vệ môi trường."
        }
      },
      {
        word: "有限",
        pinyin: "yǒu xiàn",
        hanviet: "Hữu hạn",
        meaning: "Có hạn, hạn chế",
        pos: "Tính từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "人的时间是有限的，我们要好好珍惜。",
          pinyin: "Rén de shíjiān shì yǒuxiàn de, wǒmen yào hǎohǎo zhēnxī.",
          vi: "Thời gian của con người là hữu hạn, chúng ta cần phải trân trọng."
        }
      }
    ]
  },
  {
    id: "root_hui",
    char: "回",
    pinyin: "huí",
    hanviet: "HỒI",
    meaning: "Trở về, quay lại, hồi đáp, hồi âm",
    category: "action",
    strokeCount: 6,
    radical: "囗 (Vi)",
    tip: "Hình tượng vòng xoay hướng vào tâm, biểu thị sự trở về hoặc phản hồi qua lại.",
    compounds: [
      {
        word: "回来",
        pinyin: "huí lai",
        hanviet: "Hồi lai",
        meaning: "Trở về (hướng về phía người nói)",
        pos: "Động từ xu hướng",
        structure: "Động bổ (动补)",
        example: {
          zh: "爸爸出差一个星期，今天下午终于回来了。",
          pinyin: "Bàba chūchāi yí gè xīngqī, jīntiān xiàwǔ zhōngyú huí lai le.",
          vi: "Bố đi công tác một tuần, chiều nay cuối cùng đã trở về rồi."
        }
      },
      {
        word: "回去",
        pinyin: "huí qu",
        hanviet: "Hồi khứ",
        meaning: "Đi về (rời xa người nói)",
        pos: "Động từ xu hướng",
        structure: "Động bổ (动补)",
        example: {
          zh: "天色已晚，请大家快点回去休息吧。",
          pinyin: "Tiānsè yǐ wǎn, qǐng dàjiā kuài diǎn huí qu xiūxi ba.",
          vi: "Trời đã tối muộn, xin mọi người hãy mau về nghỉ ngơi."
        }
      },
      {
        word: "回家",
        pinyin: "huí jiā",
        hanviet: "Hồi gia",
        meaning: "Về nhà",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "春节是中国人回家团圆的最重要的节日。",
          pinyin: "Chūnjié shì Zhōngguórén huíjiā tuányuán de zuì zhòngyào de jiérì.",
          vi: "Tết Nguyên Đán là ngày lễ quan trọng nhất để người Trung Quốc về nhà đoàn tụ."
        }
      },
      {
        word: "回答",
        pinyin: "huí dá",
        hanviet: "Hồi đáp",
        meaning: "Trả lời, giải đáp",
        pos: "Động từ / Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "王老师提出了一个问题，请小明回答。",
          pinyin: "Wáng lǎoshī tíchū le yí gè wèntí, qǐng Xiǎo Míng huídá.",
          vi: "Thầy Vương nêu một câu hỏi, mời Tiểu Minh trả lời."
        }
      },
      {
        word: "回忆",
        pinyin: "huí yì",
        hanviet: "Hồi ức",
        meaning: "Hồi ức, nhớ lại, ký ức",
        pos: "Động từ / Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "童年的回忆总是充满了欢声笑语。",
          pinyin: "Tóngnián de huíyì zǒngshì chōngmǎn le huānshēng xiàoyǔ.",
          vi: "Ký ức tuổi thơ luôn ngập tràn tiếng cười đùa."
        }
      },
      {
        word: "回复",
        pinyin: "huí fù",
        hanviet: "Hồi phục / Hồi phúc",
        meaning: "Hồi đáp, trả lời thư tín / tin nhắn",
        pos: "Động từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "我刚收到客户的邮件，马上就给他回复。",
          pinyin: "Wǒ gāng shōudào kèhù de yóujiàn, mǎshàng jiù gěi tā huífù.",
          vi: "Tôi vừa nhận được email của khách hàng, sẽ hồi đáp ngay cho anh ấy."
        }
      },
      {
        word: "回头",
        pinyin: "huí tóu",
        hanviet: "Hồi đầu",
        meaning: "Quay đầu lại; lát nữa, dịp khác",
        pos: "Động từ / Phó từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "现在我有点忙，回头再跟你细聊。",
          pinyin: "Xiànzài wǒ yǒudiǎn máng, huítóu zài gēn nǐ xì liáo.",
          vi: "Bây giờ tôi hơi bận, lát nữa sẽ nói chuyện kỹ với bạn sau."
        }
      },
      {
        word: "回信",
        pinyin: "huí xìn",
        hanviet: "Hồi tín",
        meaning: "Viết thư trả lời, hồi âm",
        pos: "Động từ / Danh từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "我期待着早日收到你的回信。",
          pinyin: "Wǒ qīdàizhe zǎorì shōudào nǐ de huíxìn.",
          vi: "Tôi mong đợi sớm nhận được hồi âm của bạn."
        }
      }
    ]
  },
  {
    id: "root_fa",
    char: "发",
    pinyin: "fā",
    hanviet: "PHÁT",
    meaning: "Phát ra, phát triển, sinh sôi, gửi đi",
    category: "action",
    strokeCount: 5,
    radical: "又 (Hựu)",
    tip: "Chữ biểu trưng cho việc phóng tên, bắn ra, phát ra, lan tỏa mở rộng.",
    compounds: [
      {
        word: "发现",
        pinyin: "fā xiàn",
        hanviet: "Phát hiện",
        meaning: "Phát hiện, tìm ra, nhận thấy",
        pos: "Động từ",
        structure: "Động bổ (动补)",
        example: {
          zh: "科学家在深海中发现了全新的生物物种。",
          pinyin: "Kēxuéjiā zài shēnhǎi zhōng fāxiàn le quánxīn de shēngwù wùzhǒng.",
          vi: "Các nhà khoa học đã phát hiện ra loài sinh vật hoàn toàn mới dưới đáy biển sâu."
        }
      },
      {
        word: "发展",
        pinyin: "fā zhǎn",
        hanviet: "Phát triển",
        meaning: "Phát triển, mở rộng",
        pos: "Động từ / Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "随着经济的高速发展，人民生活水平显著提高。",
          pinyin: "Suízhe jīngjì de gāosù fāzhǎn, rénmín shēnghuó shuǐpíng xiǎozhù tígāo.",
          vi: "Cùng với sự phát triển nhanh chóng của kinh tế, mức sống người dân được nâng cao rõ rệt."
        }
      },
      {
        word: "发明",
        pinyin: "fā míng",
        hanviet: "Phát minh",
        meaning: "Phát minh, sáng chế",
        pos: "Động từ / Danh từ",
        structure: "Động bổ (动补)",
        example: {
          zh: "造纸术是中国古代四大发明之一。",
          pinyin: "Zàozhǐshù shì Zhōngguó gǔdài sì dà fāmíng zhīyī.",
          vi: "Kỹ thuật làm giấy là một trong bốn phát minh vĩ đại của Trung Quốc cổ đại."
        }
      },
      {
        word: "发生",
        pinyin: "fā shēng",
        hanviet: "Phát sinh",
        meaning: "Xảy ra, nảy sinh",
        pos: "Động từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "路上发生了一起交通事故，导致交通严重堵塞。",
          pinyin: "Lù shang fāshēng le yì qǐ jiāotōng shìgù, dǎozhì jiāotōng yánzhòng dǔsè.",
          vi: "Trên đường xảy ra một vụ tai nạn giao thông dẫn đến ùn tắc nghiêm trọng."
        }
      },
      {
        word: "发送",
        pinyin: "fā sòng",
        hanviet: "Phát tống",
        meaning: "Gửi đi, phát đi (email, tin nhắn, bưu kiện)",
        pos: "Động từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "我已经把合同方案通过电子邮件发送给您了。",
          pinyin: "Wǒ yǐjīng bǎ hétong fāng'àn tōngguò diànzǐ yóujiàn fāsòng gěi nín le.",
          vi: "Tôi đã gửi bản thảo hợp đồng qua thư điện tử cho ngài rồi."
        }
      },
      {
        word: "发表",
        pinyin: "fā biǎo",
        hanviet: "Phát biểu",
        meaning: "Phát biểu, đăng tải, công bố (bài báo, ý kiến)",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "这位学者在国际知名学术期刊上发表了论文。",
          pinyin: "Zhè wèi xuézhě zài guójì zhīmíng xuéshù qīkān shang fābiǎo le lùnwén.",
          vi: "Vị học giả này đã đăng tải luận văn trên tạp chí học thuật quốc tế nổi tiếng."
        }
      },
      {
        word: "发音",
        pinyin: "fā yīn",
        hanviet: "Phát âm",
        meaning: "Phát âm, cách đọc",
        pos: "Động từ / Danh từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "学习汉语拼音能帮助我们练就标准的发音。",
          pinyin: "Xuéxí hànyǔ pīnyīn néng bāngzhù wǒmen liàn jiù biāozhǔn de fāyīn.",
          vi: "Học bính âm tiếng Hán giúp chúng ta rèn luyện cách phát âm chuẩn xác."
        }
      },
      {
        word: "发财",
        pinyin: "fā cái",
        hanviet: "Phát tài",
        meaning: "Phát tài, làm giàu",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "过年的时候，大家常常互祝‘恭喜发财’。",
          pinyin: "Guònián de shíhou, dàjiā chángcháng hù zhù ‘Gōngxǐ fācái’.",
          vi: "Vào dịp Tết, mọi người thường chúc nhau 'Cung hỉ phát tài'."
        }
      }
    ]
  },
  {
    id: "root_da",
    char: "大",
    pinyin: "dà",
    hanviet: "ĐẠI",
    meaning: "To lớn, rộng lớn, quy mô lớn",
    category: "modifier",
    strokeCount: 3,
    radical: "大 (Đại)",
    tip: "Hình tượng người giang rộng hai tay hai chân, biểu thị tầm vóc to lớn, bao quát.",
    compounds: [
      {
        word: "大家",
        pinyin: "dà jiā",
        hanviet: "Đại gia",
        meaning: "Mọi người, tất cả mọi người",
        pos: "Đại từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "欢迎大家来到我们美丽的校园！",
          pinyin: "Huānyíng dàjiā láidào wǒmen měilì de xiàoyuán!",
          vi: "Nhiệt liệt chào mừng mọi người đến với khuôn viên tươi đẹp của chúng tôi!"
        }
      },
      {
        word: "大学",
        pinyin: "dà xué",
        hanviet: "Đại học",
        meaning: "Trường đại học",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "经过三年的努力，他如愿考上了北京大学。",
          pinyin: "Jīngguò sān nián de nǔlì, tā rúyuàn kǎoshàng le Běijīng Dàxué.",
          vi: "Trải qua ba năm nỗ lực, anh ấy đã đỗ vào Đại học Bắc Kinh như mong ước."
        }
      },
      {
        word: "大概",
        pinyin: "dà gài",
        hanviet: "Đại khái",
        meaning: "Khoảng chừng, có lẽ, đại khái",
        pos: "Phó từ / Tính từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "从这里坐高铁到上海大概需要四个小时。",
          pinyin: "Cóng zhèlǐ zuò gāotiě dào Shànghǎi dàgài xūyào sì gè xiǎoshí.",
          vi: "Từ đây đi tàu cao tốc đến Thượng Hải ước chừng mất bốn tiếng."
        }
      },
      {
        word: "大声",
        pinyin: "dà shēng",
        hanviet: "Đại thanh",
        meaning: "To tiếng, lớn giọng",
        pos: "Tính từ / Phó từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "请你大声朗读课文，以便老师纠正发音。",
          pinyin: "Qǐng nǐ dàshēng lǎngdú kèwén, yǐbiàn lǎoshī jiūzhèng fāyīn.",
          vi: "Em hãy đọc to bài khóa lên để thầy sửa phát âm nhé."
        }
      },
      {
        word: "大厦",
        pinyin: "dà shà",
        hanviet: "Đại hạ",
        meaning: "Tòa nhà chọc trời, cao ốc lớn",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "市中心耸立着许多现代化的大厦。",
          pinyin: "Shìzhōngxīn sǒnglìzhe xǔduō xiàndàihuà de dàshà.",
          vi: "Trung tâm thành phố sừng sững nhiều tòa nhà cao ốc hiện đại."
        }
      },
      {
        word: "大方",
        pinyin: "dà fang",
        hanviet: "Đại phương",
        meaning: "Hào phóng, phóng khoáng, tự nhiên",
        pos: "Tính từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "他在待人接物上非常大方得体。",
          pinyin: "Tā zài dàirén jiēwù shang fēicháng dàfang détǐ.",
          vi: "Anh ấy trong cách đối nhân xử thế rất hào phóng, nhã nhặn."
        }
      },
      {
        word: "大多数",
        pinyin: "dà duō shù",
        hanviet: "Đại đa số",
        meaning: "Đại đa số, phần lớn",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "大多数学生都赞成周末去郊游。",
          pinyin: "Dàduōshù xuésheng dōu zànchéng zhōumò qù jiāoyóu.",
          vi: "Đại đa số học sinh đều tán thành việc đi dã ngoại vào cuối tuần."
        }
      },
      {
        word: "大陆",
        pinyin: "dà lù",
        hanviet: "Đại lục",
        meaning: "Đại lục, lục địa lớn",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "亚洲是世界上面积最大的大陆。",
          pinyin: "Yàzhōu shì shìjiè shang miànjī zuì dà de dàlù.",
          vi: "Châu Á là lục địa có diện tích lớn nhất trên thế giới."
        }
      }
    ]
  },
  {
    id: "root_xue",
    char: "学",
    pinyin: "xué",
    hanviet: "HỌC",
    meaning: "Học tập, kiến thức, nghiên cứu, bắt chước",
    category: "action",
    strokeCount: 8,
    radical: "子 (Tử)",
    tip: "Chữ biểu trưng cho đứa trẻ (Tử) dưới mái nhà (Miên) tiếp thu tri thức văn hóa.",
    compounds: [
      {
        word: "学习",
        pinyin: "xué xí",
        hanviet: "Học tập",
        meaning: "Học tập, rèn luyện kiến thức",
        pos: "Động từ / Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "认真学习是取得优异成绩的关键。",
          pinyin: "Rènzhēn xuéxí shì qǔdé yōuyì chéngjì de guānjiàn.",
          vi: "Học tập chăm chỉ là mấu chốt để đạt thành tích xuất sắc."
        }
      },
      {
        word: "学校",
        pinyin: "xué xiào",
        hanviet: "Học hiệu",
        meaning: "Trường học",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "我们的学校环境优美，师资力量雄厚。",
          pinyin: "Wǒmen de xuéxiào huánjìng yōuměi, shīzī lìliang xiónghòu.",
          vi: "Trường học của chúng tôi môi trường tươi đẹp, đội ngũ giáo viên vững mạnh."
        }
      },
      {
        word: "学生",
        pinyin: "xué sheng",
        hanviet: "Học sinh",
        meaning: "Học sinh, sinh viên",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "作为一名学生，要尊师重道、友爱互助。",
          pinyin: "Zuòwéi yì míng xuésheng, yào zūnshī zhòngdào, yǒu'ài hùzhù.",
          vi: "Là một học sinh, cần tôn sư trọng đạo, yêu thương tương trợ lẫn nhau."
        }
      },
      {
        word: "学历",
        pinyin: "xué lì",
        hanviet: "Học lịch",
        meaning: "Học vấn, trình độ bằng cấp",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "招聘单位不仅看重学历，更看重实际工作能力。",
          pinyin: "Zhāopìn dānwèi bùjǐn kànzhòng xuélì, gèng kànzhòng shíjì gōngzuò nénglì.",
          vi: "Đơn vị tuyển dụng không chỉ coi trọng bằng cấp mà càng coi trọng năng lực thực tế."
        }
      },
      {
        word: "学问",
        pinyin: "xué wen",
        hanviet: "Học vấn",
        meaning: "Học vấn, kiến thức sâu rộng",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "做人做事都是一门高深的学问。",
          pinyin: "Zuòrén zuòshì dōu shì yì mén gāoshēn de xuéwen.",
          vi: "Làm người và làm việc đều là một môn học vấn cao sâu."
        }
      },
      {
        word: "学者",
        pinyin: "xué zhě",
        hanviet: "Học giả",
        meaning: "Học giả, nhà nghiên cứu",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "许多知名学者出席了这次国际经济研讨会。",
          pinyin: "Xǔduō zhīmíng xuézhě chūxí le zhè cì guójì jīngjì yántǎohuì.",
          vi: "Nhiều học giả tên tuổi đã tham dự hội thảo kinh tế quốc tế lần này."
        }
      },
      {
        word: "学费",
        pinyin: "xué fèi",
        hanviet: "Học phí",
        meaning: "Học phí",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "大学通过奖学金项目帮助贫困生减免学费。",
          pinyin: "Dàxué tōngguò jiǎngxuéjīn xiàngmù bāngzhù pínkùnshēng jiǎnmiǎn xuéfèi.",
          vi: "Trường đại học qua các dự án học bổng giúp học sinh nghèo miễn giảm học phí."
        }
      },
      {
        word: "学院",
        pinyin: "xué yuàn",
        hanviet: "Học viện",
        meaning: "Học viện, khoa viện chuyên ngành",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "他在外国语学院攻读汉语言文学专业。",
          pinyin: "Tā zài Wàiguóyǔ Xuéyuàn gōngdú Hànyǔ yán wénxué zhuānyè.",
          vi: "Anh ấy theo học chuyên ngành Hán ngữ ngôn văn học tại Học viện Ngoại ngữ."
        }
      }
    ]
  },
  {
    id: "root_xin",
    char: "心",
    pinyin: "xīn",
    hanviet: "TÂM",
    meaning: "Trái tim, tâm trí, cảm xúc, trung tâm",
    category: "entity",
    strokeCount: 4,
    radical: "心 (Tâm)",
    tip: "Bộ thủ chỉ cảm xúc, tinh thần, suy nghĩ và tấm lòng bên trong con người.",
    compounds: [
      {
        word: "心情",
        pinyin: "xīn qíng",
        hanviet: "Tâm tình",
        meaning: "Tâm trạng, tâm tình",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "漫步在阳光明媚的公园里，心情格外舒畅。",
          pinyin: "Mànbù zài yángguāng míngmèi de gōngyuán lǐ, xīnqíng géwài shūchàng.",
          vi: "Dạo bước trong công viên ngập tràn ánh nắng, tâm trạng đặc biệt khoan khoái."
        }
      },
      {
        word: "小心",
        pinyin: "xiǎo xīn",
        hanviet: "Tiểu tâm",
        meaning: "Cẩn thận, chú ý",
        pos: "Động từ / Tính từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "地面湿滑，走路时请格外小心。",
          pinyin: "Dìmiàn shīhuá, zǒulù shí qǐng géwài xiǎoxīn.",
          vi: "Mặt đất trơn trượt, khi đi bộ xin hãy hết sức cẩn thận."
        }
      },
      {
        word: "关心",
        pinyin: "guān xīn",
        hanviet: "Quan tâm",
        meaning: "Quan tâm, săn sóc, để ý",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "感谢父母多年来对我无微不至的关心与照料。",
          pinyin: "Gǎnxiè fùmǔ duōnián lái duì wǒ wúwēibúzhì de guānxīn yǔ zhàoliào.",
          vi: "Cảm ơn cha mẹ bao năm qua đã quan tâm và chăm sóc chu đáo cho con."
        }
      },
      {
        word: "放心",
        pinyin: "fàng xīn",
        hanviet: "Phóng tâm",
        meaning: "Yên tâm, an lòng",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "请您放心，这项任务我一定会按时完成。",
          pinyin: "Qǐng nín fàngxīn, zhè xiàng rènwu wǒ yídìng huì ànshí wánchéng.",
          vi: "Xin ngài hãy yên tâm, nhiệm vụ này tôi nhất định sẽ hoàn thành đúng hạn."
        }
      },
      {
        word: "耐心",
        pinyin: "nài xīn",
        hanviet: "Nại tâm",
        meaning: "Kiên nhẫn, nhẫn nại",
        pos: "Tính từ / Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "老师非常耐心地为学生解答每一道难题。",
          pinyin: "Lǎoshī fēicháng nàixīn de wèi xuésheng jiědá měi yí dào nántí.",
          vi: "Thầy giáo rất kiên nhẫn giải đáp từng câu hỏi khó cho học sinh."
        }
      },
      {
        word: "信心",
        pinyin: "xìn xīn",
        hanviet: "Tín tâm",
        meaning: "Lòng tin, sự tự tin",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "充分的准备让我们对明天的比赛充满信心。",
          pinyin: "Chōngfèn de zhǔnbèi ràng wǒmen duì míngtiān de bǐsài chōngmǎn xìnxīn.",
          vi: "Sự chuẩn bị đầy đủ giúp chúng tôi tràn đầy tự tin vào trận đấu ngày mai."
        }
      },
      {
        word: "热心",
        pinyin: "rè xīn",
        hanviet: "Nhiệt tâm",
        meaning: "Nhiệt tình, sốt sắng giúp đỡ",
        pos: "Tính từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "他是个热心肠的人，总喜欢帮助有困难的邻居。",
          pinyin: "Tā shì gè rèxīncháng de rén, zǒng xǐhuan bāngzhù yǒu kùnnan de línjū.",
          vi: "Anh ấy là người rất nhiệt tình, luôn thích giúp đỡ những người hàng xóm gặp khó khăn."
        }
      },
      {
        word: "中心",
        pinyin: "zhōng xīn",
        hanviet: "Trung tâm",
        meaning: "Trung tâm, trọng tâm cốt lõi",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "这栋写字楼位于繁华的城市商务中心。",
          pinyin: "Zhè dòng xiězìlóu wèiyú fánhuá de chéngshì shāngwù zhōngxīn.",
          vi: "Tòa nhà văn phòng này tọa lạc tại trung tâm thương mại sầm uất của thành phố."
        }
      }
    ]
  },
  {
    id: "root_sheng",
    char: "生",
    pinyin: "shēng",
    hanviet: "SINH",
    meaning: "Sinh ra, sinh sống, sức sống, học trò, lạ lẫm",
    category: "action",
    strokeCount: 5,
    radical: "生 (Sinh)",
    tip: "Hình tượng mầm cây vươn lên từ mặt đất, biểu thị sự sống, sinh sôi, nảy nở.",
    compounds: [
      {
        word: "生活",
        pinyin: "shēng huó",
        hanviet: "Sinh hoạt",
        meaning: "Cuộc sống, đời sống; sinh hoạt",
        pos: "Danh từ / Động từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "乐观的心态能让我们的生活充满阳光。",
          pinyin: "Lèguān de xīntài néng ràng wǒmen de shēnghuó chōngmǎn yángguāng.",
          vi: "Thái độ lạc quan có thể khiến cuộc sống của chúng ta tràn ngập ánh nắng."
        }
      },
      {
        word: "生日",
        pinyin: "shēng rì",
        hanviet: "Sinh nhật",
        meaning: "Ngày sinh nhật",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "祝你生日快乐，身体健康，万事如意！",
          pinyin: "Zhù nǐ shēngrì kuàilè, shēntǐ jiànkāng, wànshì rúyì!",
          vi: "Chúc bạn sinh nhật vui vẻ, dồi dào sức khỏe, vạn sự như ý!"
        }
      },
      {
        word: "生气",
        pinyin: "shēng qì",
        hanviet: "Sinh khí",
        meaning: "Tức giận, giận hờn; sức sống",
        pos: "Động từ / Tính từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "别为一点小事生气，对身体不好。",
          pinyin: "Bié wèi yì diǎn xiǎoshì shēngqì, duì shēntǐ bù hǎo.",
          vi: "Đừng vì chút chuyện vặt vãnh mà tức giận, không tốt cho sức khỏe đâu."
        }
      },
      {
        word: "生病",
        pinyin: "shēng bìng",
        hanviet: "Sinh bệnh",
        meaning: "Bị ốm, ngã bệnh",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "天气转凉了，大家要注意保暖，别生病了。",
          pinyin: "Tiānqì zhuǎn liáng le, dàjiā yào zhùyì bǎonuǎn, bié shēngbìng le.",
          vi: "Trời trở lạnh rồi, mọi người chú ý giữ ấm kẻo bị ốm nhé."
        }
      },
      {
        word: "生命",
        pinyin: "shēng mìng",
        hanviet: "Sinh mệnh",
        meaning: "Sự sống, sinh mạng",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "水是生命之源，我们要爱护水资源。",
          pinyin: "Shuǐ shì shēngmìng zhī yuán, wǒmen yào àihù shuǐ zīyuán.",
          vi: "Nước là cội nguồn của sự sống, chúng ta cần phải yêu quý tài nguyên nước."
        }
      },
      {
        word: "生意",
        pinyin: "shēng yi",
        hanviet: "Sinh ý",
        meaning: "Kinh doanh, buôn bán, việc làm ăn",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "经过几年的诚信经营，他们家的餐馆生意非常红火。",
          pinyin: "Jīngguò jǐ nián de chéngxìn jīngyíng, tāmen jiā de cānguǎn shēngyi fēicháng hónghuo.",
          vi: "Trải qua vài năm kinh doanh uy tín, quán ăn nhà họ buôn bán rất phát đạt."
        }
      },
      {
        word: "生产",
        pinyin: "shēng chǎn",
        hanviet: "Sinh sản",
        meaning: "Sản xuất, chế tạo",
        pos: "Động từ / Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "这家工厂引进了自动化生产线，提高了生产效率。",
          pinyin: "Zhè jiā gōngchǎng yǐnjìn le zìdònghuà shēngchǎnxiàn, tígāo le shēngchǎn xiàolǜ.",
          vi: "Nhà máy này đã đưa vào dây chuyền sản xuất tự động, nâng cao hiệu suất sản xuất."
        }
      },
      {
        word: "生词",
        pinyin: "shēng cí",
        hanviet: "Sinh từ",
        meaning: "Từ mới (trong bài học)",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "课前预习生词有助于加深对课文的理解。",
          pinyin: "Kè qián yùxí shēngcí yǒuzhùyú jiāshēn duì kèwén de lǐjiě.",
          vi: "Chuẩn bị từ mới trước giờ học giúp hiểu sâu bài khóa hơn."
        }
      }
    ]
  },
  {
    id: "root_dian",
    char: "电",
    pinyin: "diàn",
    hanviet: "ĐIỆN",
    meaning: "Điện, luồng điện, thiết bị điện tử",
    category: "entity",
    strokeCount: 5,
    radical: "田 (Điền)",
    tip: "Hình tượng tia chớp trên cánh đồng. Thời hiện đại dùng làm tiền tố tạo ra chuỗi từ vựng công nghệ số.",
    compounds: [
      {
        word: "电脑",
        pinyin: "diàn nǎo",
        hanviet: "Điện não",
        meaning: "Máy vi tính (máy tính điện tử)",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "他每天用电脑处理各种公司业务数据。",
          pinyin: "Tā měitiān yòng diànnǎo chǔlǐ gèzhǒng gōngsī yèwù shùjù.",
          vi: "Hàng ngày anh ấy dùng máy tính để xử lý nhiều loại dữ liệu công việc của công ty."
        }
      },
      {
        word: "电视",
        pinyin: "diàn shì",
        hanviet: "Điện thị",
        meaning: "Tivi, truyền hình",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "一家人吃完晚饭坐在客厅里看电视。",
          pinyin: "Yì jiā rén chī wán wǎnfàn zuò zài kètīng lǐ kàn diànshì.",
          vi: "Cả nhà ăn tối xong cùng ngồi ở phòng khách xem tivi."
        }
      },
      {
        word: "电话",
        pinyin: "diàn huà",
        hanviet: "Điện thoại",
        meaning: "Điện thoại, cuộc gọi",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "有紧急事情可以直接给我打电话。",
          pinyin: "Yǒu jǐnjí shìqing kěyǐ zhíjiē gěi wǒ dǎ diànhuà.",
          vi: "Có việc khẩn cấp bạn có thể trực tiếp gọi điện thoại cho tôi."
        }
      },
      {
        word: "电影",
        pinyin: "diàn yǐng",
        hanviet: "Điện ảnh",
        meaning: "Phim ảnh, bộ phim",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "今晚电影院上映了一部备受好评的科幻电影。",
          pinyin: "Jīnwǎn diànyǐngyuàn shàngyìng le yí bù bèishòuhǎopíng de kēhuàn diànyǐng.",
          vi: "Tối nay rạp chiếu phim công chiếu một bộ phim khoa học viễn tưởng rất được khen ngợi."
        }
      },
      {
        word: "电梯",
        pinyin: "diàn tī",
        hanviet: "Điện thê",
        meaning: "Thang máy",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "请乘电梯直达大楼第十五层。",
          pinyin: "Qǐng chéng diàntī zhídá dàlóu dì shíwǔ céng.",
          vi: "Xin mời đi thang máy thẳng lên tầng 15 của tòa nhà."
        }
      },
      {
        word: "电子邮件",
        pinyin: "diàn zǐ yóu jiàn",
        hanviet: "Điện tử bưu kiện",
        meaning: "Thư điện tử, email",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "收到回复后，请及时转发这封电子邮件。",
          pinyin: "Shōudào huífù hòu, qǐng jíshí zhuǎnfā zhè fēng diànzǐ yóujiàn.",
          vi: "Sau khi nhận được hồi âm, hãy kịp thời chuyển tiếp thư điện tử này."
        }
      },
      {
        word: "电池",
        pinyin: "diàn chí",
        hanviet: "Điện trì",
        meaning: "Pin, ắc quy",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "我的手机快没电了，需要换一块电池。",
          pinyin: "Wǒ de shǒujī kuài méi diàn le, xūyào huàn yí kuài diànchí.",
          vi: "Điện thoại của tôi sắp hết pin rồi, cần phải thay một cục pin."
        }
      },
      {
        word: "电力",
        pinyin: "diàn lì",
        hanviet: "Điện lực",
        meaning: "Điện lực, nguồn năng lượng điện",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "绿色电力是未来清洁能源发展的主要方向。",
          pinyin: "Lǜsè diànlì shì wèilái qīngjié néngyuán fāzhǎn de zhǔyào fāngxiàng.",
          vi: "Điện lực xanh là phương hướng phát triển chủ yếu của năng lượng sạch trong tương lai."
        }
      }
    ]
  },
  {
    id: "root_shou",
    char: "手",
    pinyin: "shǒu",
    hanviet: "THỦ",
    meaning: "Bàn tay, nắm giữ, người thành thạo/chuyên gia",
    category: "entity",
    strokeCount: 4,
    radical: "手 (Thủ)",
    tip: "Bộ thủ chỉ bàn tay và các thao tác thủ công, kỹ năng và tài nghệ của con người.",
    compounds: [
      {
        word: "手机",
        pinyin: "shǒu jī",
        hanviet: "Thủ cơ",
        meaning: "Điện thoại di động (cầm tay)",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "在现代社会中，智能手机已经成为必不可少的工具。",
          pinyin: "Zài xiàndài shèhuì zhōng, zhìnéng shǒujī yǐjīng chéngwéi bìbùkěshǎo de gōngjù.",
          vi: "Trong xã hội hiện đại, điện thoại thông minh đã trở thành công cụ không thể thiếu."
        }
      },
      {
        word: "手表",
        pinyin: "shǒu biǎo",
        hanviet: "Thủ biểu",
        meaning: "Đồng hồ đeo tay",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "这块精美的手表是他大学毕业时父亲赠送的礼物。",
          pinyin: "Zhè kuài jīngměi de shǒubiǎo shì tā dàxué bìyè shí fùqīn zèngsòng de lǐwù.",
          vi: "Chiếc đồng hồ đeo tay tinh xảo này là món quà người cha tặng khi anh ấy tốt nghiệp đại học."
        }
      },
      {
        word: "手续",
        pinyin: "shǒu xù",
        hanviet: "Thủ tục",
        meaning: "Thủ tục, quy trình giấy tờ",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "出国留学需要提前办理护照和签证等相关手续。",
          pinyin: "Chūguó liúxué xūyào tíqián bànlǐ hùzhào hé qiānzhèng děng xiāngguān shǒuxù.",
          vi: "Đi du học cần làm trước các thủ tục liên quan như hộ chiếu và thị thực."
        }
      },
      {
        word: "手术",
        pinyin: "shǒu shù",
        hanviet: "Thủ thuật",
        meaning: "Phẫu thuật, ca mổ",
        pos: "Danh từ / Động từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "经过长达五个小时的手术，病人的情况终于稳定下来。",
          pinyin: "Jīngguò cháng dá wǔ gè xiǎoshí de shǒushù, bìngrén de qíngkuàng zhōngyú wěndìng xiàlai.",
          vi: "Trải qua ca phẫu thuật kéo dài 5 tiếng, tình trạng của bệnh nhân cuối cùng đã ổn định."
        }
      },
      {
        word: "手段",
        pinyin: "shǒu duàn",
        hanviet: "Thủ đoạn",
        meaning: "Biện pháp, phương sách, phương thức",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "我们要用法律手段切实保护消费者的合法权益。",
          pinyin: "Wǒmen yào yòng fǎlǜ shǒuduàn qièshí bǎohù xiāofèizhě de héfǎ quányì.",
          vi: "Chúng ta cần dùng biện pháp pháp luật để bảo vệ thiết thực quyền lợi hợp pháp của người tiêu dùng."
        }
      },
      {
        word: "拿手",
        pinyin: "ná shǒu",
        hanviet: "Nã thủ",
        meaning: "Sở trường, lành nghề, chuyên môn cao",
        pos: "Tính từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "红烧肉是他最拿手的一道家常招牌菜。",
          pinyin: "Hóngshāoròu shì tā zuì náshǒu de yí dào jiācháng zhāopái cài.",
          vi: "Thịt kho tàu là món ăn tủ sở trường nhất của anh ấy."
        }
      },
      {
        word: "助手",
        pinyin: "zhù shǒu",
        hanviet: "Trợ thủ",
        meaning: "Trợ lý, người phụ tá",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "他是总经理非常信任且得力的工作助手。",
          pinyin: "Tā shì zǒngjīnglǐ fēicháng xìnrèn qiě délì de gōngzuò zhùshǒu.",
          vi: "Anh ấy là một trợ lý công việc đắc lực và rất được tổng giám đốc tin cậy."
        }
      },
      {
        word: "亲手",
        pinyin: "qīn shǒu",
        hanviet: "Thân thủ",
        meaning: "Tự tay, đích thân làm",
        pos: "Phó từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "母亲亲手织了一条温暖的围巾送给我。",
          pinyin: "Mǔqīn qīnshǒu zhī le yì tiáo wēnnuǎn de wéijīn sòng gěi wǒ.",
          vi: "Mẹ đã tự tay đan một chiếc khăn quàng ấm áp tặng cho tôi."
        }
      }
    ]
  },
  {
    id: "root_dao",
    char: "道",
    pinyin: "dào",
    hanviet: "ĐẠO",
    meaning: "Con đường, đạo lý, phương pháp, nói",
    category: "modifier",
    strokeCount: 12,
    radical: "辶 (Xước)",
    tip: "Bộ Quai xước chỉ bước đi, chữ Thủ chỉ cái đầu. Đạo là con đường dẫn dắt trí tuệ và phương hướng hành động.",
    compounds: [
      {
        word: "知道",
        pinyin: "zhī dào",
        hanviet: "Tri đạo",
        meaning: "Biết, hiểu rõ",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "你知道明天中文演讲比赛在几点开始吗？",
          pinyin: "Nǐ zhīdào míngtiān zhōngwén yǎnjiǎng bǐsài zài jǐ diǎn kāishǐ ma?",
          vi: "Bạn có biết cuộc thi hùng biện tiếng Trung ngày mai bắt đầu lúc mấy giờ không?"
        }
      },
      {
        word: "道路",
        pinyin: "dào lù",
        hanviet: "Đạo lộ",
        meaning: "Con đường, nẻo đường",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "追求梦想的道路上难免会遇到坎坷。",
          pinyin: "Zhuīqiú mèngxiǎng de dàolù shang nánmiǎn huì yùdào kǎnkě.",
          vi: "Trên con đường theo đuổi ước mơ khó tránh khỏi gặp phải trắc trở."
        }
      },
      {
        word: "道理",
        pinyin: "dào li",
        hanviet: "Đạo lý",
        meaning: "Đạo lý, lý lẽ",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "实践是检验真理的唯一标准，这话很有道理。",
          pinyin: "Shíjiàn shì jiǎnyàn zhēnlǐ de wéiyī biāozhǔn, zhè huà hěn yǒu dàoli.",
          vi: "Thực tiễn là tiêu chuẩn duy nhất kiểm nghiệm chân lý, câu này rất có đạo lý."
        }
      },
      {
        word: "道歉",
        pinyin: "dào qiàn",
        hanviet: "Đạo khiểm",
        meaning: "Xin lỗi, tạ lỗi",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "意识到自己的失误后，他真诚地向对方道歉。",
          pinyin: "Yìshí dào zìjǐ de shīwù hòu, tā zhēnchéng de xiàng duìfāng dàoqiàn.",
          vi: "Sau khi nhận ra sai sót của mình, anh ấy đã chân thành xin lỗi đối phương."
        }
      },
      {
        word: "报道",
        pinyin: "bào dào",
        hanviet: "Báo đạo",
        meaning: "Đưa tin, bài báo, phóng sự",
        pos: "Động từ / Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "各大主流媒体纷纷报道了这届科技博览会的盛况。",
          pinyin: "Gè dà zhǔliú méitǐ fēnfēn bàodào le zhè jiè kējì bólǎnhuì de shèngkuàng.",
          vi: "Các phương tiện truyền thông chính thống đều đồng loạt đưa tin về sự kiện hội chợ triển lãm công nghệ lần này."
        }
      },
      {
        word: "味道",
        pinyin: "wèi dào",
        hanviet: "Vị đạo",
        meaning: "Mùi vị, hương vị",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "妈妈亲手煲的排骨汤味道特别鲜美。",
          pinyin: "Māma qīnshǒu bāo de páigǔtāng wèidào tèbié xiānměi.",
          vi: "Món canh sườn mẹ tự tay hầm hương vị đặc biệt thơm ngọt."
        }
      },
      {
        word: "道德",
        pinyin: "dào dé",
        hanviet: "Đạo đức",
        meaning: "Đạo đức, luân lý",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "遵纪守法和恪守职业道德是每个公民的责任。",
          pinyin: "Zūnjì-shǒufǎ hé kèshǒu zhíyè dàodé shì měi gè gōngmín de zérèn.",
          vi: "Tuân thủ pháp luật và giữ vững đạo đức nghề nghiệp là trách nhiệm của mỗi công dân."
        }
      },
      {
        word: "难道",
        pinyin: "nán dào",
        hanviet: "Nan đạo",
        meaning: "Chẳng lẽ, há lẽ (trong câu phản vấn)",
        pos: "Phó từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "这么重要的事情，难道你事先一点都不知道吗？",
          pinyin: "Zhème zhòngyào de shìqing, nándào nǐ shìxiān yìdiǎn dōu bù zhīdào ma?",
          vi: "Chuyện quan trọng nhường này, chẳng lẽ bạn từ trước không hề hay biết chút nào sao?"
        }
      }
    ]
  },
  {
    id: "root_chu",
    char: "出",
    pinyin: "chū",
    hanviet: "XUẤT",
    meaning: "Ra ngoài, xuất hiện, phát sinh, vượt trội",
    category: "action",
    strokeCount: 5,
    radical: "凵 (Khảm)",
    tip: "Hình tượng mầm cây hoặc ngọn núi này chồng lên ngọn núi khác vươn lên ra ngoài.",
    compounds: [
      {
        word: "出发",
        pinyin: "chū fā",
        hanviet: "Xuất phát",
        meaning: "Xuất phát, khởi hành",
        pos: "Động từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "旅行团明天早晨七点准时在酒店大堂集合出发。",
          pinyin: "Lǚxíngtuán míngtiān zǎochén qī diǎn zhǔnshí zài jiǔdiàn dàtáng jíhé chūfā.",
          vi: "Đoàn du lịch đúng 7 giờ sáng mai tập trung tại sảnh khách sạn để xuất phát."
        }
      },
      {
        word: "出现",
        pinyin: "chū xiàn",
        hanviet: "Xuất hiện",
        meaning: "Xuất hiện, nảy sinh",
        pos: "Động từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "雨过天晴，天空中出现了一道绚丽的彩虹。",
          pinyin: "Yǔ guò tiān qíng, tiānkōng zhōng chūxiàn le yí dào xuànlì de cǎihóng.",
          vi: "Mưa tan trời hửng sáng, trên bầu trời xuất hiện một dải cầu vồng rực rỡ."
        }
      },
      {
        word: "出色",
        pinyin: "chū sè",
        hanviet: "Xuất sắc",
        meaning: "Xuất sắc, vượt trội, nổi bật",
        pos: "Tính từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "他在本次项目中表现出色，获得了全体董事的嘉奖。",
          pinyin: "Tā zài běn cì xiàngmù zhōng biǎoxiàn chūsè, huòdé le quántǐ dǒngshì de jiājiǎng.",
          vi: "Anh ấy thể hiện xuất sắc trong dự án lần này, nhận được lời khen ngợi của toàn thể ban giám đốc."
        }
      },
      {
        word: "出版",
        pinyin: "chū bǎn",
        hanviet: "Xuất bản",
        meaning: "Xuất bản sách báo",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "这部具有历史价值的长篇小说将于下个月正式出版。",
          pinyin: "Zhè bù jùyǒu lìshǐ jiàzhí de chángpiān xiǎoshuō jiāng yú xià gè yuè zhèngshì chūbǎn.",
          vi: "Cuốn tiểu thuyết trường thiên có giá trị lịch sử này sẽ chính thức xuất bản vào tháng sau."
        }
      },
      {
        word: "出差",
        pinyin: "chū chāi",
        hanviet: "Xuất sai",
        meaning: "Đi công tác",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "经理下周要前往广州出差洽谈商务合作。",
          pinyin: "Jīnglǐ xià zhōu yào qiánwǎng Guǎngzhōu chūchāi qiàtán shāngwù hézuò.",
          vi: "Giám đốc tuần sau sẽ tới Quảng Châu đi công tác bàn thảo hợp tác kinh doanh."
        }
      },
      {
        word: "出口",
        pinyin: "chū kǒu",
        hanviet: "Xuất khẩu",
        meaning: "Lối ra; xuất khẩu hàng hóa",
        pos: "Danh từ / Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "请顺着绿色安全指示标志寻找紧急疏散出口。",
          pinyin: "Qǐng shùnzhe lǜsè ānquán zhǐshì biāozhì xúnzhǎo jǐnjí shūsàn chūkǒu.",
          vi: "Xin hãy men theo biển chỉ dẫn an toàn màu xanh để tìm lối thoát hiểm khẩn cấp."
        }
      },
      {
        word: "出席",
        pinyin: "chū xí",
        hanviet: "Xuất tịch",
        meaning: "Tham dự, có mặt tại cuộc họp/hội nghị",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "来自全球各国的代表齐聚一堂出席气候峰会。",
          pinyin: "Láizì quánqiú gè guó de dàibiǎo qíjù yītáng chūxí qìhòu fēnghuì.",
          vi: "Các đại biểu đến từ các quốc gia trên toàn cầu tề tựu đông đủ để tham dự hội nghị thượng đỉnh khí hậu."
        }
      },
      {
        word: "出租车",
        pinyin: "chū zū chē",
        hanviet: "Xuất tô xa",
        meaning: "Xe taxi",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "在机场门口打一辆出租车半小时就能抵达酒店。",
          pinyin: "Zài jīchǎng ménkǒu dǎ yí liàng chūzūchē bàn xiǎoshí jiù néng dǐdá jiǔdiàn.",
          vi: "Bắt một chiếc taxi ở cổng sân bay nửa tiếng là có thể tới khách sạn."
        }
      }
    ]
  },
  {
    id: "root_zuo",
    char: "作",
    pinyin: "zuò",
    hanviet: "TÁC",
    meaning: "Làm, sáng tác, công việc, hành vi",
    category: "action",
    strokeCount: 7,
    radical: "亻 (Nhân đứng)",
    tip: "Bộ Nhân kết hợp với chữ Sạ (làm), biểu thị sự lao động, sáng tạo và chế tác của con người.",
    compounds: [
      {
        word: "工作",
        pinyin: "gōng zuò",
        hanviet: "Công tác",
        meaning: "Công việc, làm việc",
        pos: "Động từ / Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "他在一家知名跨国互联网科技公司工作。",
          pinyin: "Tā zài yì jiā zhīmíng kuàguó hùliánwǎng kējì gōngsī gōngzuò.",
          vi: "Anh ấy làm việc tại một công ty công nghệ internet đa quốc gia nổi tiếng."
        }
      },
      {
        word: "作业",
        pinyin: "zuò yè",
        hanviet: "Tác nghiệp",
        meaning: "Bài tập về nhà; làm bài tập",
        pos: "Danh từ / Động từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "同学们每天放学后都认真按时完成家庭作业。",
          pinyin: "Tóngxuémen měitiān fàngxué hòu dōu rènzhēn ànshí wánchéng jiātíng zuòyè.",
          vi: "Các bạn học sinh mỗi ngày sau khi tan trường đều nghiêm túc hoàn thành bài tập về nhà đúng giờ."
        }
      },
      {
        word: "作品",
        pinyin: "zuò pǐn",
        hanviet: "Tác phẩm",
        meaning: "Tác phẩm nghệ thuật, văn học",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "美术馆正在展出齐白石先生的经典水墨画作品。",
          pinyin: "Měishùguǎn zhèngzài zhǎnchū Qí Báishí xiānsheng de jīngdiǎn shuǐmòhuà zuòpǐn.",
          vi: "Bảo tàng mỹ thuật đang triển lãm các tác phẩm tranh thủy mặc kinh điển của danh họa Tề Bạch Thạch."
        }
      },
      {
        word: "合作",
        pinyin: "hé zuò",
        hanviet: "Hợp tác",
        meaning: "Hợp tác, chung sức",
        pos: "Động từ / Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "双方本着平等互利的原则达成了长远战略合作。",
          pinyin: "Shuāngfāng běnzhe píngděng hùlì de yuánzé dáchéng le chángyuǎn zhànlüè hézuò.",
          vi: "Hai bên trên nguyên tắc bình đẳng cùng có lợi đã đạt được thỏa thuận hợp tác chiến lược lâu dài."
        }
      },
      {
        word: "作用",
        pinyin: "zuò yòng",
        hanviet: "Tác dụng",
        meaning: "Tác dụng, hiệu quả, ảnh hưởng",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "早睡早起的健康习惯对调节人体机能起到了积极作用。",
          pinyin: "Zǎoshuì zǎoqǐ de jiànkāng xíguàn duì tiáojié réntǐ jīnéng qǐdào le jījí zuòyòng.",
          vi: "Thói quen ngủ sớm dậy sớm lành mạnh đóng tác dụng tích cực đối với việc điều hòa chức năng cơ thể."
        }
      },
      {
        word: "操作",
        pinyin: "cāo zuò",
        hanviet: "Thao tác",
        meaning: "Thao tác, vận hành máy móc",
        pos: "Động từ / Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "这款智能手机的操作界面简洁直观，很容易上手。",
          pinyin: "Zhè kuǎn zhìnéng shǒujī de cāozuò jièmiàn jiǎnjié zhíguān, hěn róngyì shàngshǒu.",
          vi: "Giao diện thao tác của chiếc điện thoại thông minh này đơn giản trực quan, rất dễ làm quen."
        }
      },
      {
        word: "作息",
        pinyin: "zuò xī",
        hanviet: "Tác tức",
        meaning: "Làm việc và nghỉ ngơi (chế độ sinh hoạt)",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "保持规律的日常作息是保持充沛精力的秘诀。",
          pinyin: "Bǎochí guīlǜ de rìcháng zuòxī shì bǎochí chōngpèi jīnglì de mìjué.",
          vi: "Duy trì chế độ sinh hoạt làm việc và nghỉ ngơi điều độ là bí quyết giữ năng lượng tràn đầy."
        }
      },
      {
        word: "作文",
        pinyin: "zuò wén",
        hanviet: "Tác văn",
        meaning: "Bài văn, viết văn",
        pos: "Danh từ / Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "多读书、多积累优美词句能够显著提高作文水平。",
          pinyin: "Duō dúshū, duō jīlěi yōuměi cíjù nénggòu xiǎozhù tígāo zuòwén shuǐpíng.",
          vi: "Đọc nhiều sách, tích lũy nhiều câu từ hay có thể nâng cao rõ rệt trình độ viết văn."
        }
      }
    ]
  },
  {
    id: "root_dian2",
    char: "点",
    pinyin: "diǎn",
    hanviet: "ĐIỂM",
    meaning: "Điểm, dấu chấm, chút xíu, giờ đồng hồ, gọi món, thắp lửa",
    category: "modifier",
    strokeCount: 9,
    radical: "灬 (Hỏa)",
    tip: "Chữ Chiêm kết hợp bốn chấm Hỏa bên dưới, ban đầu là thắp lửa, sau mở rộng thành điểm nút, giờ giấc, khía cạnh.",
    compounds: [
      {
        word: "重点",
        pinyin: "zhòng diǎn",
        hanviet: "Trọng điểm",
        meaning: "Trọng điểm, điểm mấu chốt",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "复习备考时一定要牢牢把握考试大纲的重点内容。",
          pinyin: "Fùxí bèikǎo shí yídìng yào láoláo bǎwò kǎoshì dàgāng de zhòngdiǎn nèiróng.",
          vi: "Khi ôn thi nhất định phải nắm thật chắc các nội dung trọng điểm của đề cương thi."
        }
      },
      {
        word: "观点",
        pinyin: "guān diǎn",
        hanviet: "Quan điểm",
        meaning: "Quan điểm, góc nhìn",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "在学术讨论会上，每个人都可以自由表达自己的学术观点。",
          pinyin: "Zài xuéshù tǎolùnhuì shang, měi gè rén dōu kěyǐ zìyóu biǎodá zìjǐ de xuéshù guāndiǎn.",
          vi: "Tại buổi tọa đàm học thuật, mỗi người đều có thể tự do bày tỏ quan điểm học thuật của mình."
        }
      },
      {
        word: "特点",
        pinyin: "tè diǎn",
        hanviet: "Đặc điểm",
        meaning: "Đặc điểm, nét đặc trưng",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "汉字的最大特点是形、音、义三者紧密结合。",
          pinyin: "Hànzì de zuì dà tèdiǎn shì xíng, yīn, yì sān zhě jǐnmì jiéhé.",
          vi: "Đặc điểm lớn nhất của chữ Hán là hình, âm và nghĩa kết hợp chặt chẽ với nhau."
        }
      },
      {
        word: "点心",
        pinyin: "diǎn xin",
        hanviet: "Điểm tâm",
        meaning: "Món điểm tâm, bánh ngọt ăn nhẹ",
        pos: "Danh từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "下午三点，同事们一起在茶水间品尝传统中式点心。",
          pinyin: "Xiàwǔ sān diǎn, tóngshìmen yìqǐ zài cháshuǐjiān pǐncháng chuántǒng zhōngshì diǎnxin.",
          vi: "3 giờ chiều, các đồng nghiệp cùng nhau thưởng thức điểm tâm Trung hoa truyền thống tại phòng trà."
        }
      },
      {
        word: "点头",
        pinyin: "diǎn tóu",
        hanviet: "Điểm đầu",
        meaning: "Gật đầu (đồng ý)",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "听完他的汇报，经理微笑着点头表示赞许。",
          pinyin: "Tīng wán tā de huìbào, jīnglǐ wēixiàozhe diǎntóu biǎoshì zànxǔ.",
          vi: "Nghe xong báo cáo của anh ấy, giám đốc mỉm cười gật đầu tán thưởng."
        }
      },
      {
        word: "优点",
        pinyin: "yōu diǎn",
        hanviet: "Ưu điểm",
        meaning: "Ưu điểm, điểm mạnh",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "虚心学习别人的优点，才能不断完善自己。",
          pinyin: "Xūxīn xuéxí biérén de yōudiǎn, cáinéng búduàn wánshàn zìjǐ.",
          vi: "Khiêm tốn học hỏi ưu điểm của người khác mới có thể không ngừng hoàn thiện bản thân."
        }
      },
      {
        word: "缺点",
        pinyin: "quē diǎn",
        hanviet: "Khuyết điểm",
        meaning: "Khuyết điểm, điểm yếu",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "勇于正视自己的缺点是取得进步的第一步。",
          pinyin: "Yǒngyú zhèngshì zìjǐ de quēdiǎn shì qǔdé jìnbù de dì-yī bù.",
          vi: "Dũng cảm nhìn nhận khuyết điểm của mình là bước đầu tiên để tiến bộ."
        }
      },
      {
        word: "点菜",
        pinyin: "diǎn cài",
        hanviet: "Điểm thái",
        meaning: "Gọi món ăn tại nhà hàng",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "服务员热情地拿来菜单请顾客点菜。",
          pinyin: "Fúwùyuán rèqíng de nálái càidān qǐng gùkè diǎncài.",
          vi: "Nhân viên phục vụ niềm nở mang thực đơn đến mời khách gọi món."
        }
      }
    ]
  },
  {
    id: "root_zhong",
    char: "重",
    pinyin: "zhòng / chóng",
    hanviet: "TRỌNG / TRÙNG",
    meaning: "Nặng, quan trọng (zhòng) / Trùng lặp, làm lại (chóng)",
    category: "modifier",
    strokeCount: 9,
    radical: "里 (Lý)",
    tip: "Đa âm tự cốt lõi: zhòng (nặng, quý trọng) vs chóng (trùng lặp, lặp lại nhiều lần).",
    compounds: [
      {
        word: "重要",
        pinyin: "zhòng yào",
        hanviet: "Trọng yếu",
        meaning: "Quan trọng, cốt yếu",
        pos: "Tính từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "健康比金钱更加重要，千万不要忽视休息。",
          pinyin: "Jiànkāng bǐ jīnqián gèngjiā zhòngyào, qiānwàn bú yào hūshì xiūxi.",
          vi: "Sức khỏe quan trọng hơn tiền bạc, vạn lần chớ nên xem nhẹ việc nghỉ ngơi."
        }
      },
      {
        word: "重视",
        pinyin: "zhòng shì",
        hanviet: "Trọng thị",
        meaning: "Coi trọng, chú trọng",
        pos: "Động từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "学校高度重视培养学生的创新思维与实践能力。",
          pinyin: "Xuéxiào gāodù zhòngshì péiyǎng xuésheng de chuàngxīn sīwéi yǔ shíjiàn nénglì.",
          vi: "Nhà trường hết sức coi trọng việc bồi dưỡng tư duy sáng tạo và năng lực thực hành của học sinh."
        }
      },
      {
        word: "尊重",
        pinyin: "zūn zhòng",
        hanviet: "Tôn trọng",
        meaning: "Tôn trọng, kính trọng",
        pos: "Động từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "互相尊重彼此的文化传统是国际交往的重要礼仪。",
          pinyin: "Hùxiāng zūnzhòng bǐcǐ de wénhuà chuántǒng shì guójì jiāowǎng de zhòngyào lǐyí.",
          vi: "Tôn trọng truyền thống văn hóa của nhau là lễ nghi quan trọng trong giao lưu quốc tế."
        }
      },
      {
        word: "重新",
        pinyin: "chóng xīn",
        hanviet: "Trùng tân",
        meaning: "Làm lại từ đầu, bắt đầu lại",
        pos: "Phó từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "电脑死机了，保存文件后我们需要重新启动。",
          pinyin: "Diànnǎo sǐjī le, bǎocún wénjiàn hòu wǒmen xūyào chóngxīn qǐdòng.",
          vi: "Máy tính bị đơ rồi, sau khi lưu tệp tin chúng ta cần khởi động lại."
        }
      },
      {
        word: "重复",
        pinyin: "chóng fù",
        hanviet: "Trùng phục",
        meaning: "Lặp lại, trùng lặp",
        pos: "Động từ / Tính từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "请老师把刚才那句生词的发音再重复一遍。",
          pinyin: "Qǐng lǎoshī bǎ gāngcái nà jù shēngcí de fāyīn zài chóngfù yí biàn.",
          vi: "Xin thầy nhắc lại phát âm của từ mới vừa rồi thêm một lần nữa."
        }
      },
      {
        word: "重量",
        pinyin: "zhòng liàng",
        hanviet: "Trọng lượng",
        meaning: "Cân nặng, trọng lượng",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "乘飞机托运行李的重量不能超过二十公斤。",
          pinyin: "Chéng fēijī tuōyùn xíngli de zhòngliàng bù néng chāoguò èrshí gōngjīn.",
          vi: "Trọng lượng hành lý ký gửi khi đi máy bay không được vượt quá 20 cân."
        }
      },
      {
        word: "重心",
        pinyin: "zhòng xīn",
        hanviet: "Trọng tâm",
        meaning: "Trọng tâm, điểm thăng bằng cốt cán",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "公司决定把接下来的工作重心放在开拓海外市场上。",
          pinyin: "Gōngsī juédìng bǎ jiēxiàlái de gōngzuò zhòngxīn fàng zài kāituò hǎiwài shìchǎng shang.",
          vi: "Công ty quyết định đặt trọng tâm công việc tiếp theo vào việc khai phá thị trường hải ngoại."
        }
      },
      {
        word: "重活",
        pinyin: "zhòng huó",
        hanviet: "Trọng hoạt",
        meaning: "Công việc nặng nhọc",
        pos: "Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "男同学主动上前帮忙搬运箱子等重活。",
          pinyin: "Nán tóngxué zhǔdòng shàngqián bāngmáng bānyùn xiāngzi děng zhònghuó.",
          vi: "Các bạn nam chủ động tiến lên giúp khuân vác hòm xiểng và các việc nặng."
        }
      }
    ]
  },
  {
    id: "root_yi",
    char: "意",
    pinyin: "yì",
    hanviet: "Ý",
    meaning: "Ý nghĩa, ý nghĩ, tâm ý, dự định",
    category: "modifier",
    strokeCount: 13,
    radical: "心 (Tâm)",
    tip: "Gồm chữ Âm (tiếng nói) đè lên chữ Tâm (lòng dạ): tiếng nói thốt ra từ tận đáy lòng chính là Ý niệm, ý chí.",
    compounds: [
      {
        word: "意思",
        pinyin: "yì si",
        hanviet: "Ý tư",
        meaning: "Ý nghĩa, ý định; thú vị",
        pos: "Danh từ / Tính từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "请问这个成语在现代汉语中是什么意思？",
          pinyin: "Qǐngwèn zhège chéngyǔ zài xiàndài hànyǔ zhōng shì shénme yìsi?",
          vi: "Xin hỏi thành ngữ này trong tiếng Hán hiện đại có nghĩa là gì?"
        }
      },
      {
        word: "意见",
        pinyin: "yì jiàn",
        hanviet: "Ý kiến",
        meaning: "Ý kiến, quan điểm đóng góp",
        pos: "Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "领导广泛征求了全体员工对改进制度的宝贵意见。",
          pinyin: "Lǐngdǎo guǎngfàn zhēngqiú le quántǐ yuángōng duì gǎijìn zhìdù de bǎoguì yìjiàn.",
          vi: "Lãnh đạo đã trưng cầu rộng rãi ý kiến quý báu của toàn thể nhân viên về việc cải tiến chế độ."
        }
      },
      {
        word: "注意",
        pinyin: "zhù yì",
        hanviet: "Chú ý",
        meaning: "Chú ý, để tâm, cẩn trọng",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "过马路时要特别注意观察左右两边的车辆。",
          pinyin: "Guò mǎlù shí yào tèbié zhùyì guānchá zuǒyòu liǎngbiān de chēliàng.",
          vi: "Khi qua đường cần đặc biệt chú ý quan sát xe cộ hai bên trái phải."
        }
      },
      {
        word: "同意",
        pinyin: "tóng yì",
        hanviet: "Đồng ý",
        meaning: "Đồng ý, tán thành",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "大家都一致同意这个兼具创意与可行性的活动策划。",
          pinyin: "Dàjiā dōu yízhì tóngyì zhège jiānjù chuàngyì yǔ kěxíngxìng de huódòng cèhuà.",
          vi: "Mọi người đều nhất trí đồng ý bản kế hoạch hoạt động vừa sáng tạo vừa có tính khả thi này."
        }
      },
      {
        word: "满意",
        pinyin: "mǎn yì",
        hanviet: "Mãn ý",
        meaning: "Hài lòng, vừa ý",
        pos: "Tính từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "客户对我们团队提供的优质设计服务非常满意。",
          pinyin: "Kèhù duì wǒmen tuánduì tígōng de yōuzhì shèjì fúwù fēicháng mǎnyì.",
          vi: "Khách hàng rất hài lòng với dịch vụ thiết kế chất lượng cao do đội ngũ chúng tôi cung cấp."
        }
      },
      {
        word: "愿意",
        pinyin: "yuàn yì",
        hanviet: "Nguyện ý",
        meaning: "Sẵn lòng, tình nguyện, bằng lòng",
        pos: "Động từ năng nguyện",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "很多热心青年愿意利用业余时间参加志愿者社区服务。",
          pinyin: "Hěn duō rèxīn qīngnián yuànyì lìyòng yèyú shíjiān cānjiā zhìyuànzhě shèqū fúwù.",
          vi: "Rất nhiều thanh niên nhiệt huyết sẵn lòng tận dụng thời gian rảnh rỗi tham gia dịch vụ tình nguyện cộng đồng."
        }
      },
      {
        word: "故意",
        pinyin: "gù yì",
        hanviet: "Cố ý",
        meaning: "Cố ý, chủ tâm làm",
        pos: "Phó từ / Tính từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "我不小心踩了你的鞋，真不是故意的，对不起！",
          pinyin: "Wǒ bù xiǎoxīn cǎi le nǐ de xié, zhēn bú shì gùyì de, duìbuqǐ!",
          vi: "Tôi sơ ý giẫm vào giày bạn, thật sự không phải cố ý đâu, xin lỗi nhé!"
        }
      },
      {
        word: "意外",
        pinyin: "yì wài",
        hanviet: "Ý ngoại",
        meaning: "Bất ngờ, ngoài ý muốn; tai nạn",
        pos: "Tính từ / Danh từ",
        structure: "Chính phụ (偏正)",
        example: {
          zh: "在这个异国他乡的街头偶遇老同学，让我感到十分意外。",
          pinyin: "Zài zhège yìguó-tāxiāng de jiētóu ǒuyù lǎo tóngxué, ràng wǒ gǎndào shífēn yìwài.",
          vi: "Tình cờ gặp lại bạn học cũ trên góc phố xứ người này khiến tôi vô cùng bất ngờ."
        }
      }
    ]
  },
  {
    id: "root_da2",
    char: "打",
    pinyin: "dǎ",
    hanviet: "ĐẢ",
    meaning: "Đánh, gõ, bắt (xe), gọi (điện), phát động",
    category: "action",
    strokeCount: 5,
    radical: "扌 (Thủ)",
    tip: "Động từ đa dụng bậc nhất tiếng Trung. Ghép với hàng loạt danh từ để biểu thị hành vi thao tác chuyên biệt.",
    compounds: [
      {
        word: "打电话",
        pinyin: "dǎ diàn huà",
        hanviet: "Đả điện thoại",
        meaning: "Gọi điện thoại",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "我刚下飞机，马上给妈妈打电话报平安。",
          pinyin: "Wǒ gāng xià fēijī, mǎshàng gěi māma dǎ diànhuà bào píng'ān.",
          vi: "Tôi vừa xuống máy bay, lập tức gọi điện thoại cho mẹ báo bình an."
        }
      },
      {
        word: "打算",
        pinyin: "dǎ suan",
        hanviet: "Đả toán",
        meaning: "Dự định, tính toán kế hoạch",
        pos: "Động từ / Danh từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "今年暑假你有什么旅行打算吗？",
          pinyin: "Jīnnián shǔjià nǐ yǒu shénme lǚxíng dǎsuan ma?",
          vi: "Kỳ nghỉ hè năm nay bạn có dự định du lịch gì không?"
        }
      },
      {
        word: "打折",
        pinyin: "dǎ zhé",
        hanviet: "Đả chiết",
        meaning: "Giảm giá, chiết khấu",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "商场周末全场商品打八折优惠促销。",
          pinyin: "Shāngchǎng zhōumò quánchǎng shāngpǐn dǎ bā zhé yōuhuì cùxiāo.",
          vi: "Trung tâm thương mại cuối tuần giảm giá toàn bộ sản phẩm 20% (bán 80% giá gốc)."
        }
      },
      {
        word: "打工",
        pinyin: "dǎ gōng",
        hanviet: "Đả công",
        meaning: "Làm thêm, đi làm thuê",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "很多大学生在课余时间通过勤工俭学打工积累社会经验。",
          pinyin: "Hěn duō dàxuéshēng zài kèyú shíjiān tōngguò qíngōng-jiǎnxué dǎgōng jīlěi shèhuì jīngyàn.",
          vi: "Nhiều sinh viên đại học trong thời gian rảnh đi làm thêm để tích lũy kinh nghiệm xã hội."
        }
      },
      {
        word: "打车",
        pinyin: "dǎ chē",
        hanviet: "Đả xa",
        meaning: "Bắt taxi, gọi xe",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "下雨天公交车太挤，我们还是用手机软件打车吧。",
          pinyin: "Xiàyǔtiān gōngjiāochē tài jǐ, wǒmen háishì yòng shǒujī ruǎnjiàn dǎchē ba.",
          vi: "Trời mưa xe buýt chen chúc quá, chúng mình bắt xe qua ứng dụng điện thoại đi."
        }
      },
      {
        word: "打扫",
        pinyin: "dǎ sǎo",
        hanviet: "Đả tảo",
        meaning: "Dọn dẹp, quét tước vệ sinh",
        pos: "Động từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "周末全家人一起动手把房间打扫得干干净净。",
          pinyin: "Zhōumò quán jiā rén yìqǐ dòngshǒu bǎ fángjiān dǎsǎo de gāngānjìngjìng.",
          vi: "Cuối tuần cả nhà cùng nhau dọn dẹp phòng ốc sạch bong sáng bóng."
        }
      },
      {
        word: "打印",
        pinyin: "dǎ yìn",
        hanviet: "Đả ấn",
        meaning: "In ấn tài liệu",
        pos: "Động từ",
        structure: "Song nghĩa (联合)",
        example: {
          zh: "请帮我把这份会议纪要打印三份备用。",
          pinyin: "Qǐng bāng wǒ bǎ zhè fèn huìyì jìyào dǎyìn sān fèn bèiyòng.",
          vi: "Xin in giúp tôi biên bản cuộc họp này thành 3 bản để dùng."
        }
      },
      {
        word: "打球",
        pinyin: "dǎ qiú",
        hanviet: "Đả cầu",
        meaning: "Chơi bóng (bóng bàn, cầu lông, bóng rổ)",
        pos: "Động từ",
        structure: "Động tân (动宾)",
        example: {
          zh: "每天下午放学后，操场上都有很多同学在打球健身。",
          pinyin: "Měitiān xiàwǔ fàngxué hòu, cāochǎng shang dōu yǒu hěn duō tóngxué zài dǎqiú jiànshēn.",
          vi: "Mỗi buổi chiều sau khi tan học, trên sân bóng đều có rất nhiều bạn học chơi bóng rèn luyện thân thể."
        }
      }
    ]
  }
];

const outPath = path.resolve(__dirname, '../public/data/vocab_expansion.json');
fs.writeFileSync(outPath, JSON.stringify(vocabExpansionRoots, null, 2), 'utf8');
console.log(`Generated rich vocab_expansion.json with ${vocabExpansionRoots.length} roots and ${vocabExpansionRoots.reduce((acc, r) => acc + r.compounds.length, 0)} compounds at: ${outPath}`);
