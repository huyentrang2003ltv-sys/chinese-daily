// scripts/add_more_polyphonic.cjs
const fs = require('fs');
const path = require('path');

const polyPath = path.join(__dirname, '../public/data/polyphonic_words.json');
const currentList = JSON.parse(fs.readFileSync(polyPath, 'utf8'));

const NEW_WORDS = [
  {
    id: 'poly_zhi',
    char: '只',
    hanviet: 'Chỉ / Chích',
    strokes: 5,
    radical: '口 (Khẩu)',
    summaryMnemonic: 'Phó từ "chỉ có" đọc "zhǐ" (thanh 3); Lượng từ con vật, chiếc đơn lẻ đọc "zhī" (thanh 1)!',
    readings: [
      {
        pinyin: 'zhǐ',
        tone: 'Thanh 3 (chỉ)',
        pos: 'Phó từ',
        meaning: 'chỉ, chỉ có, chỉ là',
        collocations: ['只要', '只有', '只是', '只不过'],
        example: {
          zh: '只要坚持每天练习口语，就一定能说一口纯正流利的汉语。',
          py: 'Zhǐyào jiānchí měitiān liànxí kǒuyǔ, jiù yídìng néng shuō yì kǒu chúnzhèng liúlì de Hànyǔ.',
          vi: 'Chỉ cần kiên trì luyện khẩu ngữ mỗi ngày thì nhất định có thể nói một giọng tiếng Trung chuẩn xác và lưu loát.'
        }
      },
      {
        pinyin: 'zhī',
        tone: 'Thanh 1 (chi)',
        pos: 'Lượng từ',
        meaning: 'con (động vật), chiếc/cái (một bên trong cặp đối xứng hoặc vật hình que)',
        collocations: ['一只猫', '一只鸟', '一只手', '一只鞋'],
        example: {
          zh: '树枝上停着一只羽毛极其鲜艳的小鸟。',
          py: 'Shùzhī shang tíng zhe yì zhī yǔmáo jíqí xiānyàn de xiǎoniǎo.',
          vi: 'Trên cành cây có một chú chim nhỏ với bộ lông vô cùng sặc sỡ đang đậu.'
        }
      }
    ],
    quiz: {
      question: 'Trong câu "我家里养了一____可爱的小花猫。" chữ "只" phát âm là gì?',
      options: ['zhī (thanh 1)', 'zhǐ (thanh 3)'],
      answer: 0,
      explain: 'Khi làm lượng từ chỉ con vật (chú mèo), "只" phát âm thanh 1: zhī.'
    }
  },
  {
    id: 'poly_fa',
    char: '发',
    hanviet: 'Phát / Phát',
    strokes: 5,
    radical: '又 (Hựu)',
    summaryMnemonic: 'Mái tóc (头发) đọc "fà" (thanh 4); Phát sinh, xuất phát, phát triển đọc "fā" (thanh 1)!',
    readings: [
      {
        pinyin: 'fā',
        tone: 'Thanh 1 (pha)',
        pos: 'Động từ',
        meaning: 'xuất phát, phát biểu, phát triển, gửi đi',
        collocations: ['出发', '发生', '发展', '发电子邮件', '发现'],
        example: {
          zh: '随着现代科技的飞速发展，人工智能正在深刻改变世界。',
          py: 'Suízhe xiàndài kējì de fēisù fāzhǎn, réngōng zhìnéng zhèngzài shēnkè gǎibiàn shìjiè.',
          vi: 'Cùng với sự phát triển thần tốc của khoa học kỹ thuật hiện đại, trí tuệ nhân tạo đang thay đổi sâu sắc thế giới.'
        }
      },
      {
        pinyin: 'fà',
        tone: 'Thanh 4 (phạ)',
        pos: 'Danh từ',
        meaning: 'tóc, mái tóc',
        collocations: ['头发', '理发', '白发', '假发'],
        example: {
          zh: '为了准备明天的面试，他特意去理发店修剪了头发。',
          py: 'Wèile zhǔnbèi míngtiān de miànshì, tā tèyì qù lǐfàdiàn xiūjiǎn le tóufa.',
          vi: 'Để chuẩn bị cho buổi phỏng vấn ngày mai, anh ấy đặc ý đi tiệm cắt tóc để tỉa tót mái tóc.'
        }
      }
    ],
    quiz: {
      question: 'Từ "理发" (cắt tóc) chữ "发" phát âm là gì?',
      options: ['fà (thanh 4)', 'fā (thanh 1)'],
      answer: 0,
      explain: 'Khi chỉ tóc ("tóc" trong 理发, 头发, 白发), "发" đọc thanh 4 là fà.'
    }
  },
  {
    id: 'poly_dao',
    char: '倒',
    hanviet: 'Đảo / Đảo',
    strokes: 10,
    radical: '亻 (Nhân đứng)',
    summaryMnemonic: 'Ngã xuống, đổ sập đọc "dǎo" (thanh 3); Rót nước, đảo ngược, lùi xe đọc "dào" (thanh 4)!',
    readings: [
      {
        pinyin: 'dǎo',
        tone: 'Thanh 3 (đảo)',
        pos: 'Động từ',
        meaning: 'ngã, đổ, sập, phá sản',
        collocations: ['跌倒', '倒下', '倒闭', '摔倒'],
        example: {
          zh: '狂风大作把路旁的一棵大树吹倒了。',
          py: 'Kuángfēng dàzuò bǎ lùpáng de yì kē dàshù chuīdǎo le.',
          vi: 'Gió giật mạnh đã thổi ngã rạp một cái cây to bên lề đường.'
        }
      },
      {
        pinyin: 'dào',
        tone: 'Thanh 4 (đáo)',
        pos: 'Động từ / Phó từ',
        meaning: 'rót (chất lỏng), lùi xe, đảo ngược, ngược lại',
        collocations: ['倒水', '倒车', '倒立', '反倒'],
        example: {
          zh: '有客人进门时，按照礼节应该先给他倒上一杯热茶。',
          py: 'Yǒu kèrén jìnmén shí, ànzhào lǐjié yīnggāi xiān gěi tā dào shàng yì bēi rèchá.',
          vi: 'Khi có khách vào nhà, theo phép lịch sự nên rót cho khách một chén trà nóng trước.'
        }
      }
    ],
    quiz: {
      question: 'Trong câu "司机正在小心翼翼地把卡车往后____车。" chữ "倒" phát âm là gì?',
      options: ['dào (thanh 4)', 'dǎo (thanh 3)'],
      answer: 0,
      explain: 'Trong cụm "倒车" (lùi xe, đảo chiều xe), "倒" đọc thanh 4 là dào.'
    }
  },
  {
    id: 'poly_jiao',
    char: '教',
    hanviet: 'Giáo / Giao',
    strokes: 11,
    radical: '攵 (Phác)',
    summaryMnemonic: 'Động từ dạy học đọc "jiāo" (thanh 1); Giáo dục, phòng học, tôn giáo đọc "jiào" (thanh 4)!',
    readings: [
      {
        pinyin: 'jiāo',
        tone: 'Thanh 1 (giao)',
        pos: 'Động từ',
        meaning: 'dạy, truyền thụ kiến thức kỹ năng',
        collocations: ['教书', '教汉语', '教唱歌', '教我做菜'],
        example: {
          zh: '王老师在这所重点中学教了三十年高中语文。',
          py: 'Wáng lǎoshī zài zhè suǒ zhòngdiǎn zhōngxué jiāo le sānshí nián gāozhōng yǔwén.',
          vi: 'Thầy Vương đã dạy ngữ văn cấp ba ở ngôi trường trọng điểm này suốt ba mươi năm.'
        }
      },
      {
        pinyin: 'jiào',
        tone: 'Thanh 4 (giáo)',
        pos: 'Danh từ',
        meaning: 'giáo dục, phòng học, tôn giáo, giáo viên',
        collocations: ['教育', '教室', '教师', '宗教'],
        example: {
          zh: '父母的言传身教对孩子的品格养成有着深远的教育意义。',
          py: 'Fùmǔ de yánchuán-shēnjiào duì háizi de pǐngé yǎngchéng yǒu zhe shēnyuǎn de jiàoyù yìyì.',
          vi: 'Lời nói và việc làm làm gương của cha mẹ có ý nghĩa giáo dục sâu sắc đối với sự hình thành phẩm cách của con cái.'
        }
      }
    ],
    quiz: {
      question: 'Từ "教室" (phòng học) chữ "教" phát âm là gì?',
      options: ['jiào (thanh 4)', 'jiāo (thanh 1)'],
      answer: 0,
      explain: 'Trong danh từ "教室" (phòng học) và "教育" (giáo dục), "教" phát âm là jiào.'
    }
  },
  {
    id: 'poly_kan',
    char: '看',
    hanviet: 'Khán',
    strokes: 9,
    radical: '目 (Mục)',
    summaryMnemonic: 'Nhìn, xem, đọc sách đọc "kàn" (thanh 4); Trông nom, canh gác, coi giữ đọc "kān" (thanh 1)!',
    readings: [
      {
        pinyin: 'kàn',
        tone: 'Thanh 4 (khán)',
        pos: 'Động từ',
        meaning: 'nhìn, xem, đọc, thăm hỏi, nhận định',
        collocations: ['看书', '看电影', '看病', '看法'],
        example: {
          zh: '周末在阳光明媚的阳台上看一本好书是最惬意的事。',
          py: 'Zhōumò zài yángguāng míngmèi de yángtái shang kàn yì běn hǎo shū shì zuì qièyì de shì.',
          vi: 'Cuối tuần đọc một cuốn sách hay trên ban công tràn ngập ánh nắng là điều khoan khoái nhất.'
        }
      },
      {
        pinyin: 'kān',
        tone: 'Thanh 1 (khan)',
        pos: 'Động từ',
        meaning: 'trông nom, canh giữ, coi sóc, bảo quản',
        collocations: ['看守', '看门', '看护', '照看'],
        example: {
          zh: '爷爷退休后在社区里义务帮忙照看孩子们放学后的安全。',
          py: 'Yéye tuìxiū hòu zài shèqū lǐ yìwù bāngmáng zhàokān háizimen fàngxué hòu de ānquán.',
          vi: 'Sau khi nghỉ hưu, ông nội tình nguyện giúp chăm nom sự an toàn của lũ trẻ sau giờ tan học trong khu dân cư.'
        }
      }
    ],
    quiz: {
      question: 'Trong từ "看门" (trông cửa, gác cổng) chữ "看" phát âm là gì?',
      options: ['kān (thanh 1)', 'kàn (thanh 4)'],
      answer: 0,
      explain: 'Nghĩa canh gác, trông nom (看门, 看守, 照看) phát âm là kān.'
    }
  },
  {
    id: 'poly_shu',
    char: '数',
    hanviet: 'Số / Sổ',
    strokes: 13,
    radical: '攵 (Phác)',
    summaryMnemonic: 'Danh từ con số, toán học đọc "shù" (thanh 4); Động từ đếm, liệt kê đọc "shǔ" (thanh 3)!',
    readings: [
      {
        pinyin: 'shù',
        tone: 'Thanh 4 (thú)',
        pos: 'Danh từ',
        meaning: 'con số, số lượng, toán học',
        collocations: ['数学', '数字', '数量', '数据'],
        example: {
          zh: '现代大数据分析需要扎实的数学理论功底。',
          py: 'Xiàndài dàshùjù fēnxī xūyào zhāshi de shùxué lǐlùn gōngdǐ.',
          vi: 'Phân tích dữ liệu lớn hiện đại đòi hỏi nền tảng lý thuyết toán học vững chắc.'
        }
      },
      {
        pinyin: 'shǔ',
        tone: 'Thanh 3 (thủ)',
        pos: 'Động từ',
        meaning: 'đếm, tính toán lần lượt, xếp vào hàng',
        collocations: ['数数', '数不清', '倒数', '数一数二'],
        example: {
          zh: '夏天的夜空晴朗清澈，满天繁星数也数不清。',
          py: 'Xiàtiān de yèkōng qínglǎng qīngchè, mǎntiān fánxīng shǔ yě shǔ bù qīng.',
          vi: 'Bầu trời đêm mùa hè trong vắt, ngàn vì sao sáng đếm mãi không xuể.'
        }
      }
    ],
    quiz: {
      question: 'Thành ngữ "数一数二" (thuộc hàng nhất nhì) hai chữ "数" phát âm là gì?',
      options: ['shǔ (thanh 3)', 'shù (thanh 4)'],
      answer: 0,
      explain: 'Trong thành ngữ 数一数二 nghĩa là đếm từ trên xuống thì đứng thứ nhất thứ nhì, đọc là shǔ.'
    }
  },
  {
    id: 'poly_luo',
    char: '落',
    hanviet: 'Lạc',
    strokes: 12,
    radical: '艹 (Thảo)',
    summaryMnemonic: 'Rơi rụng, hạ xuống đọc "luò"; Bỏ quên, bỏ sót đọc "là" (trong 丢三落四)!',
    readings: [
      {
        pinyin: 'luò',
        tone: 'Thanh 4 (loạc)',
        pos: 'Động từ',
        meaning: 'rơi, rụng, hạ xuống, lắng xuống',
        collocations: ['落下', '降落', '秋风落叶', '落后'],
        example: {
          zh: '秋天到了，金黄的树叶纷纷从枝头随风飘落。',
          py: 'Qiūtiān dào le, jīnhuáng de shùyè fēnfēn cóng zhītóu suí fēng piāoluò.',
          vi: 'Mùa thu đã đến, những chiếc lá vàng óng ả đua nhau theo gió bay rụng khỏi cành.'
        }
      },
      {
        pinyin: 'là',
        tone: 'Thanh 4 (lạ)',
        pos: 'Động từ',
        meaning: 'bỏ quên, bỏ sót lại phía sau',
        collocations: ['丢三落四', '落下东西', '别落下'],
        example: {
          zh: '他出门总是丢三落四，不是忘了钥匙就是忘了带手机。',
          py: 'Tā chūmén zǒngshì diūsān-làsì, búshì wàng le yàoshi jiùshì wàng le dài shǒujī.',
          vi: 'Anh ấy ra khỏi cửa toàn hay đãng trí bỏ quên đồ, không phải quên chìa khóa thì cũng là quên mang điện thoại.'
        }
      }
    ],
    quiz: {
      question: 'Thành ngữ "丢三落四" (hay quên, đãng trí) chữ "落" phát âm chuẩn là gì?',
      options: ['là (thanh 4)', 'luò (thanh 4)', 'lào (thanh 4)'],
      answer: 0,
      explain: 'Khi mang nghĩa bỏ quên, bỏ sót lại (đặc biệt trong thành ngữ 丢三落四), chữ 落 phát âm là là.'
    }
  },
  {
    id: 'poly_shao',
    char: '少',
    hanviet: 'Thiểu / Thiếu',
    strokes: 4,
    radical: '小 (Tiểu)',
    summaryMnemonic: 'Ít ỏi, thiếu hụt đọc "shǎo" (thanh 3); Tuổi trẻ, thanh thiếu niên đọc "shào" (thanh 4)!',
    readings: [
      {
        pinyin: 'shǎo',
        tone: 'Thanh 3 (thảo)',
        pos: 'Tính từ / Động từ',
        meaning: 'ít, số lượng ít, thiếu thốn',
        collocations: ['很少', '多少', '减少', '少见'],
        example: {
          zh: '每天多走步锻炼，少吃高糖油腻食物，有益身体健康。',
          py: 'Měitiān duō zǒubù duànliàn, shǎo chī gāotáng yóunì shíwù, yǒuyì shēntǐ jiànkāng.',
          vi: 'Mỗi ngày đi bộ nhiều hơn để rèn luyện, ăn ít đồ ngọt dầu mỡ sẽ rất tốt cho sức khỏe.'
        }
      },
      {
        pinyin: 'shào',
        tone: 'Thanh 4 (thạo)',
        pos: 'Danh từ / Tính từ',
        meaning: 'trẻ tuổi, thanh thiếu niên, thiếu gia',
        collocations: ['少年', '青少年', '少女', '少爷'],
        example: {
          zh: '青少年时期是树立崇高理想与形成正确世界观的关键阶段。',
          py: 'Qīngshàonián shíqī shì shùlì chónggāo lǐxiǎng yǔ xíngchéng zhèngquè shìjièguān de guānjiàn jiēduàn.',
          vi: 'Thời kỳ thanh thiếu niên là giai đoạn then chốt để xây dựng lý tưởng cao đẹp và hình thành thế giới quan đúng đắn.'
        }
      }
    ],
    quiz: {
      question: 'Từ "少年" (thanh thiếu niên) chữ "少" phát âm là gì?',
      options: ['shào (thanh 4)', 'shǎo (thanh 3)'],
      answer: 0,
      explain: 'Chỉ lứa tuổi trẻ nhỏ (少年, 青少年, 少女) đọc thanh 4 là shào.'
    }
  },
  {
    id: 'poly_jie',
    char: '结',
    hanviet: 'Kết',
    strokes: 9,
    radical: '纟 (Mịch)',
    summaryMnemonic: 'Kết hôn, kết quả, thắt nút đọc "jié" (thanh 2); Ra hoa kết quả, chắc nịch rắn rỏi đọc "jiē" (thanh 1)!',
    readings: [
      {
        pinyin: 'jié',
        tone: 'Thanh 2 (kiệt)',
        pos: 'Động từ / Danh từ',
        meaning: 'thắt nút, liên kết, kết thúc, kết quả',
        collocations: ['结婚', '结果 (thành quả)', '结束', '总结'],
        example: {
          zh: '他们携手经历了许多生活风雨，终于在上周登记结婚了。',
          py: 'Tāmen xiéshǒu jīnglì le xǔduō shēnghuó fēngyǔ, zhōngyú zài shàng zhōu dēngjì jiéhūn le.',
          vi: 'Họ nắm tay cùng trải qua bao sóng gió cuộc đời, cuối cùng tuần trước đã đăng ký kết hôn.'
        }
      },
      {
        pinyin: 'jiē',
        tone: 'Thanh 1 (khe)',
        pos: 'Động từ / Tính từ',
        meaning: 'ra trái, đơm hoa kết quả; chắc chắn, rắn chắc (结实)',
        collocations: ['结果 (cây kết trái)', '结实', '开花结果'],
        example: {
          zh: '院子里的那棵苹果树今年秋天结满了红彤彤的果实。',
          py: 'Yuànzi lǐ de nà kē píngguǒshù jīnnián qiūtiān jiē mǎn le hóngtōngtōng de guǒshí.',
          vi: 'Cây táo trong sân mùa thu năm nay đã kết đầy những quả đỏ mọng.'
        }
      }
    ],
    quiz: {
      question: 'Khi khen ai đó có cơ thể cường tráng, rắn chắc ("身体很结实"), chữ "结" phát âm là gì?',
      options: ['jiē (thanh 1)', 'jié (thanh 2)'],
      answer: 0,
      explain: 'Trong từ 结实 (chắc chắn, vạm vỡ, bền bỉ) và nghĩa cây cối ra trái, 结 phát âm thanh 1: jiē.'
    }
  },
  {
    id: 'poly_kong',
    char: '空',
    hanviet: 'Không',
    strokes: 8,
    radical: '穴 (Huyệt)',
    summaryMnemonic: 'Không gian, bầu trời, trống rỗng đọc "kōng" (thanh 1); Thời gian rảnh, chỗ trống đọc "kòng" (thanh 4)!',
    readings: [
      {
        pinyin: 'kōng',
        tone: 'Thanh 1 (khung)',
        pos: 'Danh từ / Tính từ',
        meaning: 'bầu trời, không gian, trống rỗng, hư ảo',
        collocations: ['天空', '空间', '空调', '空气', '空虚'],
        example: {
          zh: '雨后的天空呈现出一抹绚丽多彩的七色彩虹。',
          py: 'Yǔ hòu de tiānkōng chéngxiàn chū yì mǒ xuànlì-duōcǎi de qīsè cǎihóng.',
          vi: 'Bầu trời sau cơn mưa hiện ra một dải cầu vồng bảy sắc rực rỡ tuyệt đẹp.'
        }
      },
      {
        pinyin: 'kòng',
        tone: 'Thanh 4 (khộng)',
        pos: 'Danh từ / Động từ',
        meaning: 'thời gian rảnh rỗi, vị trí còn trống, để trống',
        collocations: ['有空', '没空', '空闲', '空白', '空地'],
        example: {
          zh: '要是你今晚有空的话，不妨来我家品尝地道的四川火锅。',
          py: 'Yàoshi nǐ jīnwǎn yǒu kòng dehuà, bùfáng lái wǒ jiā pǐncháng dìdào de Sìchuān huǒguō.',
          vi: 'Nếu tối nay bạn rảnh rỗi, chi bằng ghé qua nhà tôi thưởng thức món lẩu Tứ Xuyên chính gốc.'
        }
      }
    ],
    quiz: {
      question: 'Trong câu hỏi lịch sự "请问你明天有____吗？" chữ "空" phát âm là gì?',
      options: ['kòng (thanh 4)', 'kōng (thanh 1)'],
      answer: 0,
      explain: 'Khi mang nghĩa có thời gian rảnh rỗi ("有空"), chữ 空 đọc là kòng.'
    }
  },
  {
    id: 'poly_jia',
    char: '假',
    hanviet: 'Giả / Giá',
    strokes: 11,
    radical: '亻 (Nhân đứng)',
    summaryMnemonic: 'Giả dối, nếu như đọc "jiǎ" (thanh 3); Nghỉ phép, kỳ nghỉ đọc "jià" (thanh 4)!',
    readings: [
      {
        pinyin: 'jiǎ',
        tone: 'Thanh 3 (giả)',
        pos: 'Tính từ / Liên từ',
        meaning: 'giả, không thật, nếu như',
        collocations: ['假装', '真假', '假话', '假如'],
        example: {
          zh: '做人应当襟怀坦白，绝不能说虚伪敷衍的假话。',
          py: 'Zuòrén yīngdāng jīnhuái-tǎnbái, jué bù néng shuō xūwěi fūyǎn de jiǎhuà.',
          vi: 'Làm người nên quang minh chính đại, tuyệt đối không được nói những lời dối trá qua loa.'
        }
      },
      {
        pinyin: 'jià',
        tone: 'Thanh 4 (giá)',
        pos: 'Danh từ',
        meaning: 'kỳ nghỉ, ngày nghỉ, phép nghỉ',
        collocations: ['放假', '假期', '暑假', '寒假', '请假'],
        example: {
          zh: '今年暑假，我打算同全家人一起前往云南丽江旅游度假。',
          py: 'Jīnnián shǔjià, wǒ dǎsuàn tóng quán jiārén yìqǐ qiánwǎng Yúnnán Lìjiāng lǚyóu dùjià.',
          vi: 'Kỳ nghỉ hè năm nay, tôi dự định cùng cả gia đình đến Lệ Giang Vân Nam du lịch nghỉ dưỡng.'
        }
      }
    ],
    quiz: {
      question: 'Cụm từ "暑假" (kỳ nghỉ hè) chữ "假" phát âm là gì?',
      options: ['jià (thanh 4)', 'jiǎ (thanh 3)'],
      answer: 0,
      explain: 'Khi chỉ kỳ nghỉ (放假, 假期, 暑假, 寒假, 请假), chữ 假 phát âm là jià.'
    }
  }
];

// Check unique IDs
const existingIds = new Set(currentList.map(x => x.id));
const existingChars = new Set(currentList.map(x => x.char));

NEW_WORDS.forEach(word => {
  if (!existingIds.has(word.id) && !existingChars.has(word.char)) {
    currentList.push(word);
  }
});

fs.writeFileSync(polyPath, JSON.stringify(currentList, null, 2), 'utf8');
console.log(`✓ Đã cập nhật Chữ đa âm đa nghĩa: Tổng cộng ${currentList.length} chữ.`);
