// scripts/expand_linguistic_datasets.cjs
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const clfPath = path.join(ROOT, 'public/data/classifiers.json');
const polyPath = path.join(ROOT, 'public/data/polyphonic_words.json');

const currentClf = JSON.parse(fs.readFileSync(clfPath, 'utf8'));
const currentPoly = JSON.parse(fs.readFileSync(polyPath, 'utf8'));

// Additional 20 measure words to reach 45 comprehensive classifiers
const MORE_CLASSIFIERS = [
  {
    id: 'clf_ding',
    char: '顶',
    pinyin: 'dǐng',
    hanviet: 'Đỉnh',
    meaning: 'chiếc, cái (vật có chóp đỉnh, dùng đội trên đầu hoặc che chụp từ trên xuống)',
    category: 'items',
    categoryName: 'Đồ Dùng & Vật Dụng',
    applicableObjects: 'Mũ nón, màn ngủ, lều bạt cắm trại...',
    collocations: [
      { zh: '一顶帽子', py: 'yì dǐng màozi', vi: 'một chiếc mũ' },
      { zh: '一顶草帽', py: 'yì dǐng cǎomào', vi: 'một chiếc mũ cói' },
      { zh: '一顶帐篷', py: 'yì dǐng zhàngpeng', vi: 'một chiếc lều bạt' },
      { zh: '一顶蚊帐', py: 'yì dǐng wénzhàng', vi: 'một chiếc màn ngủ' }
    ],
    example: {
      zh: '野外露营时，我们在绿树成荫的草地上搭起了一顶防风帐篷。',
      py: 'Yěwài lùyíng shí, wǒmen zài lǜshù-chéngyīn de cǎodì shang dā qǐ le yì dǐng fángfēng zhàngpeng.',
      vi: 'Khi cắm trại dã ngoại, chúng tôi dựng một chiếc lều chắn gió trên bãi cỏ rợp bóng cây xanh.'
    },
    tip: '💡 Bẫy HSK: Mũ nón (帽子) và Lều bạt (帐篷) bắt buộc dùng 顶, không dùng 个 hay 把!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 夏天在烈日下劳作需要戴上一____草帽遮阳。',
      options: ['顶 (dǐng)', '把 (bǎ)', '张 (zhāng)', '件 (jiàn)'],
      answer: 0,
      explain: 'Mũ nón (草帽) dùng lượng từ 顶 (dǐng).'
    }
  },
  {
    id: 'clf_ping',
    char: '瓶',
    pinyin: 'píng',
    hanviet: 'Bình',
    meaning: 'chai, lọ, bình (đồ uống, chất lỏng chứa trong bình chai)',
    category: 'items',
    categoryName: 'Đồ Dùng & Vật Dụng',
    applicableObjects: 'Nước khoáng, rượu vang, bia, sữa, nước ngọt, thuốc nước...',
    collocations: [
      { zh: '一瓶水', py: 'yì píng shuǐ', vi: 'một chai nước' },
      { zh: '一瓶红酒', py: 'yì píng hóngjiǔ', vi: 'một chai rượu vang đỏ' },
      { zh: '一瓶牛奶', py: 'yì píng niúnǎi', vi: 'một chai sữa bò' },
      { zh: '一瓶可乐', py: 'yì píng kělè', vi: 'một chai cô-ca' }
    ],
    example: {
      zh: '长跑比赛冲过终点线后，志愿者立刻递过来一瓶清凉解渴的矿泉水。',
      py: 'Chángpǎo bǐsài chōng guò zhōngdiǎnxiàn hòu, zhìyuànzhě lìkè dì guòlái yì píng qīngliáng jiěkě de kuàngquánshuǐ.',
      vi: 'Sau khi chạy việt dã cán đích, tình nguyện viên lập tức đưa tới một chai nước khoáng mát lạnh giải khát.'
    },
    tip: '💡 Danh từ容器 (vật chứa) như 瓶 (chai), 杯 (cốc), 碗 (bát), 盒 (hộp), 盘 (đĩa) đều làm lượng từ!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 服务员，请给我们开一____干红葡萄酒。',
      options: ['瓶 (píng)', '杯 (bēi)', '把 (bǎ)', '本 (běn)'],
      answer: 0,
      explain: 'Chai rượu vang nguyên chai dùng lượng từ 瓶 (píng).'
    }
  },
  {
    id: 'clf_bei',
    char: '杯',
    pinyin: 'bēi',
    hanviet: 'Bôi',
    meaning: 'ly, cốc, tách (đồ uống chứa trong ly cốc)',
    category: 'items',
    categoryName: 'Đồ Dùng & Vật Dụng',
    applicableObjects: 'Trà, cà phê, nước trái cây, bia rót ly, sữa đậu nành...',
    collocations: [
      { zh: '一杯咖啡', py: 'yì bēi kāfēi', vi: 'một tách cà phê' },
      { zh: '一杯热茶', py: 'yì bēi rèchá', vi: 'một tách trà nóng' },
      { zh: '一杯果汁', py: 'yì bēi guǒzhī', vi: 'một ly nước ép' },
      { zh: '一杯奶茶', py: 'yì bēi nǎichá', vi: 'một ly trà sữa' }
    ],
    example: {
      zh: '清晨醒来喝上一杯温开水，对促进新陈代谢非常有益。',
      py: 'Qīngchén xǐnglái hē shàng yì bēi wēnkāishuǐ, duì cùjìn xīnchéndàixiè fēicháng yǒuyì.',
      vi: 'Sáng sớm thức dậy uống một ly nước ấm rất có lợi cho việc thúc đẩy trao đổi chất.'
    },
    tip: '💡 Phân biệt: 瓶 là chai đóng sẵn, 杯 là ly cốc uống liền.',
    quiz: {
      question: 'Điền lượng từ thích hợp: 工作累了的时候，来一____浓郁的美式热咖啡提神醒脑。',
      options: ['杯 (bēi)', '瓶 (píng)', '张 (zhāng)', '条 (tiáo)'],
      answer: 0,
      explain: 'Tách cà phê dùng lượng từ 杯 (bēi).'
    }
  },
  {
    id: 'clf_wan',
    char: '碗',
    pinyin: 'wǎn',
    hanviet: 'Oản',
    meaning: 'bát, chén (thức ăn chứa trong bát)',
    category: 'items',
    categoryName: 'Đồ Dùng & Vật Dụng',
    applicableObjects: 'Cơm, mì sợi, canh súp, cháo, phở...',
    collocations: [
      { zh: '一碗米饭', py: 'yì wǎn mǐfàn', vi: 'một bát cơm' },
      { zh: '一碗牛肉面', py: 'yì wǎn niúròumiàn', vi: 'một bát mì bò' },
      { zh: '一碗热汤', py: 'yì wǎn rètāng', vi: 'một bát canh nóng' },
      { zh: '一碗八宝粥', py: 'yì wǎn bābǎozhōu', vi: 'một bát cháo bát bảo' }
    ],
    example: {
      zh: '冬天回到家，妈妈总会端出一碗热气腾腾的鸡汤让人心里倍感温暖。',
      py: 'Dōngtiān huí dào jiā, māma zǒng huì duān chū yì wǎn rèqì-téngténg de jītāng ràng rén xīnlǐ bèi gǎn wēnnuǎn.',
      vi: 'Mùa đông về đến nhà, mẹ luôn bưng ra một bát canh gà nóng hổi khiến trong lòng cảm thấy ấm áp vô cùng.'
    },
    tip: '💡 Mì sợi, phở, cơm khi phục vụ trong bát đều dùng 碗 (wǎn)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 老板，来一____地道的兰州正宗牛肉拉面！',
      options: ['碗 (wǎn)', '盘 (pán)', '杯 (bēi)', '个 (gè)'],
      answer: 0,
      explain: 'Bát mì bò Lan Châu dùng lượng từ 碗 (wǎn).'
    }
  },
  {
    id: 'clf_pan',
    char: '盘',
    pinyin: 'pán',
    hanviet: 'Bàn',
    meaning: 'đĩa (món ăn); ván (ván cờ, ván đấu)',
    category: 'items',
    categoryName: 'Đồ Dùng & Vật Dụng',
    applicableObjects: 'Món xào, đĩa hoa quả, sủi cảo, ván cờ vua, ván cờ vây...',
    collocations: [
      { zh: '一盘菜', py: 'yì pán cài', vi: 'một đĩa thức ăn' },
      { zh: '一盘水果', py: 'yì pán shuǐguǒ', vi: 'một đĩa hoa quả' },
      { zh: '一盘饺子', py: 'yì pán jiǎozi', vi: 'một đĩa sủi cảo' },
      { zh: '下一盘棋', py: 'xià yì pán qí', vi: 'đánh một ván cờ' }
    ],
    example: {
      zh: '两位象棋大师在树荫下专注地下了一盘精彩纷呈的中国象棋。',
      py: 'Liǎng wèi xiàngqí dàshī zài shùyīn xià zhuānzhù de xià le yì pán jīngcǎi-fēnchéng de Zhōngguó xiàngqí.',
      vi: 'Hai đại sư cờ tướng dưới bóng râm tập trung chơi một ván cờ tướng Trung Hoa xuất sắc kịch tính.'
    },
    tip: '💡 Bẫy HSK: 盘 vừa là đĩa thức ăn, vừa là lượng từ của ván cờ (一盘棋)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 爷爷常常和老邻居在公园凉亭里下两____中国象棋。',
      options: ['盘 (pán)', '张 (zhāng)', '把 (bǎ)', '条 (tiáo)'],
      answer: 0,
      explain: 'Ván cờ (象棋) dùng lượng từ 盘 (pán).'
    }
  },
  {
    id: 'clf_bu_device',
    char: '部',
    pinyin: 'bù',
    hanviet: 'Bộ',
    meaning: 'chiếc (điện thoại, máy móc điện tử); bộ (phim ảnh, tiểu thuyết đồ sộ)',
    category: 'items',
    categoryName: 'Đồ Dùng & Vật Dụng',
    applicableObjects: 'Điện thoại thông minh, phim điện ảnh, tiểu thuyết dài tập, xe hơi (trang trọng)...',
    collocations: [
      { zh: '一部手机', py: 'yí bù shǒujī', vi: 'một chiếc điện thoại' },
      { zh: '一部电影', py: 'yí bù diànyǐng', vi: 'một bộ phim' },
      { zh: '一部小说', py: 'yí bù xiǎoshuō', vi: 'một bộ tiểu thuyết' },
      { zh: '一部名著', py: 'yí bù míngzhù', vi: 'một danh tác' }
    ],
    example: {
      zh: '这部耗资巨大的科幻电影在全球范围内引起了极其强烈的轰动。',
      py: 'Zhè bù hàozī jùdà de kēhuàn diànyǐng zài quánqiú fànwéi nèi yǐnqǐ le jíqí qiángliè de hōngdòng.',
      vi: 'Bộ phim khoa học viễn tưởng đầu tư khổng lồ này đã gây tiếng vang cực kỳ mạnh mẽ trên phạm vi toàn cầu.'
    },
    tip: '💡 Điện thoại (手机) và phim ảnh (电影) chuẩn mực dùng lượng từ 部 (bù)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 昨晚我看了一____非常感人肺腑的纪录片。',
      options: ['部 (bù)', '张 (zhāng)', '本 (běn)', '支 (zhī)'],
      answer: 0,
      explain: 'Phim tài liệu (纪录片) dùng lượng từ 部 (bù).'
    }
  },
  {
    id: 'clf_pian',
    char: '片',
    pinyin: 'piàn',
    hanviet: 'Phiến',
    meaning: 'mảnh, lá, lát, dải (vật dẹt mỏng, chiếc lá, viên thuốc dẹt, cảnh tượng mênh mông)',
    category: 'shape',
    categoryName: 'Hình Dáng & Bề Mặt',
    applicableObjects: 'Chiếc lá, lát bánh mì, viên thuốc, bãi cỏ, tấm lòng...',
    collocations: [
      { zh: '一片树叶', py: 'yí piàn shùyè', vi: 'một chiếc lá cây' },
      { zh: '一片面包', py: 'yí piàn miànbāo', vi: 'một lát bánh mì' },
      { zh: '吃两片药', py: 'chī liǎng piàn yào', vi: 'uống hai viên thuốc' },
      { zh: '一片森林', py: 'yí piàn sēnlín', vi: 'một dải rừng' },
      { zh: '一片心意', py: 'yí piàn xīnyì', vi: 'một tấm lòng' }
    ],
    example: {
      zh: '秋风轻轻吹拂，几片泛黄的枫树叶从枝头悄然飘落。',
      py: 'Qiūfēng qīngqīng chuīfú, jǐ piàn fànhuáng de fēngshùyè cóng zhītóu qiǎorán piāoluò.',
      vi: 'Gió thu thổi nhẹ, mấy chiếc lá phong ngả vàng lặng lẽ rơi xuống từ cành cây.'
    },
    tip: '💡 Bẫy HSK: Lá cây (树叶) và lát bánh mì (面包) dùng 片; Tấm lòng (一片心意) cũng dùng 片!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 医生叮嘱病人每次饭后温水服用两____消炎药。',
      options: ['片 (piàn)', '张 (zhāng)', '根 (gēn)', '把 (bǎ)'],
      answer: 0,
      explain: 'Viên thuốc dạng nén dẹt dùng lượng từ 片 (piàn).'
    }
  },
  {
    id: 'clf_duì',
    char: '对',
    pinyin: 'duì',
    hanviet: 'Đối',
    meaning: 'đôi, cặp (hai đối tượng ghép đôi hài hòa, vợ chồng, tình nhân, câu đối)',
    category: 'sets_measures',
    categoryName: 'Tập Hợp & Đo Lường',
    applicableObjects: 'Vợ chồng, tình nhân, đôi chim uyên ương, câu đối, hoa tai...',
    collocations: [
      { zh: '一对夫妻', py: 'yí duì fūqī', vi: 'một cặp vợ chồng' },
      { zh: '一对情侣', py: 'yí duì qínglǚ', vi: 'một đôi tình nhân' },
      { zh: '一对耳环', py: 'yí duì ěrhuán', vi: 'một đôi hoa tai' },
      { zh: '一对春联', py: 'yí duì chūnlián', vi: 'một đôi câu đối Tết' }
    ],
    example: {
      zh: '金婚纪念日上，那对白发苍苍的老夫妻手挽手微笑着接受大家的祝福。',
      py: 'Jīnhūn jìnìanrì shang, nà duì báifà-cāngcāng de lǎo fūqī shǒu wǎn shǒu wēixiào zhe jiēshòu dàjiā de zhùfú.',
      vi: 'Trong lễ kỷ niệm đám cưới vàng, đôi vợ chồng già tóc bạc phơ nắm chặt tay nhau mỉm cười đón nhận lời chúc phúc của mọi người.'
    },
    tip: '💡 Phân biệt: 双 dùng cho đồ vật tự nhiên gắn liền (giày, đũa); 对 dùng cho con người/vật biểu thị quan hệ đối xứng cặp đôi (vợ chồng, hoa tai).',
    quiz: {
      question: 'Điền lượng từ thích hợp: 湖面上游弋着一____形影不离的美丽黑天鹅。',
      options: ['对 (duì)', '双 (shuāng)', '条 (tiáo)', '把 (bǎ)'],
      answer: 0,
      explain: 'Đôi chim thiên nga ghép đôi uyên ương dùng 对 (duì).'
    }
  },
  {
    id: 'clf_shu',
    char: '束',
    pinyin: 'shù',
    hanviet: 'Thúc',
    meaning: 'bó (hoa tươi); chùm, luồng (ánh sáng)',
    category: 'sets_measures',
    categoryName: 'Tập Hợp & Đo Lường',
    applicableObjects: 'Bó hoa, chùm hoa, luồng ánh sáng, tia sáng...',
    collocations: [
      { zh: '一束鲜花', py: 'yí shù xiānhuā', vi: 'một bó hoa tươi' },
      { zh: '一束玫瑰花', py: 'yí shù méigui huā', vi: 'một bó hoa hồng' },
      { zh: '一束阳光', py: 'yí shù yángguāng', vi: 'một luồng ánh nắng' },
      { zh: '一束激光', py: 'yí shù jīguāng', vi: 'một chùm tia la-ze' }
    ],
    example: {
      zh: '毕业典礼上，学生们向辛勤耕耘的恩师敬献了一束芬芳四溢的鲜花。',
      py: 'Bìyè diǎnlǐ shang, xuéshēngmen xiàng xīnqín gēngyún de ēnshī jìngxiàn le yí shù fēnfāng-sìyì de xiānhuā.',
      vi: 'Trong lễ tốt nghiệp, các học sinh kính dâng lên người thầy tận tụy một bó hoa tươi ngát hương thơm.'
    },
    tip: '💡 Một bông hoa dùng 朵 (duǒ); Nhiều bông bó lại dùng 束 (shù)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 情人节那天，花店里摆满了包装精美的一____束红玫瑰。',
      options: ['束 (shù)', '朵 (duǒ)', '棵 (kē)', '把 (bǎ)'],
      answer: 0,
      explain: 'Bó hoa gói sẵn dùng lượng từ 束 (shù).'
    }
  },
  {
    id: 'clf_chuan',
    char: '串',
    pinyin: 'chuàn',
    hanviet: 'Xuyến',
    meaning: 'chuỗi, xâu, chùm (các vật xâu chuỗi liền nhau)',
    category: 'sets_measures',
    categoryName: 'Tập Hợp & Đo Lường',
    applicableObjects: 'Chùm nho, xâu chìa khóa, xâu thịt nướng, chuỗi hạt ngọc...',
    collocations: [
      { zh: '一串葡萄', py: 'yí chuàn pútao', vi: 'một chùm nho' },
      { zh: '一串钥匙', py: 'yí chuàn yàoshi', vi: 'một chùm chìa khóa' },
      { zh: '一串羊肉串', py: 'yí chuàn yángròuchuàn', vi: 'một xiên thịt cừu' },
      { zh: '一串项链', py: 'yí chuàn xiàngliàn', vi: 'một chuỗi dây chuyền' }
    ],
    example: {
      zh: '夜市小吃街弥漫着烤肉香味，摊位前排满了等待买羊肉串的食客。',
      py: 'Yèshì xiǎochī jiē mímàn zhe kǎoròu xiāngwèi, tānwèi qián pái mǎn le děngdài mǎi yángròuchuàn de shíkè.',
      vi: 'Phố ẩm thực chợ đêm ngào ngạt hương thơm thịt nướng, trước quầy đông nghẹt thực khách chờ mua xiên thịt cừu.'
    },
    tip: '💡 Nho (葡萄) chùm dùng 串; Nhiều chìa khóa xâu lại (钥匙) dùng 一串钥匙!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 门卫腰间挂着一____沉甸甸的铁制大门钥匙。',
      options: ['串 (chuàn)', '把 (bǎ)', '条 (tiáo)', '块 (kuài)'],
      answer: 0,
      explain: 'Chùm nhiều chìa khóa xâu lại với nhau dùng 串 (chuàn).'
    }
  },
  {
    id: 'clf_qun',
    char: '群',
    pinyin: 'qún',
    hanviet: 'Quần',
    meaning: 'đàn, bầy, đám, tốp (tập hợp số đông người hoặc động vật)',
    category: 'sets_measures',
    categoryName: 'Tập Hợp & Đo Lường',
    applicableObjects: 'Đàn cừu, đàn chim, đàn cá, đám đông, tốp người...',
    collocations: [
      { zh: '一群羊', py: 'yì qún yáng', vi: 'một đàn cừu' },
      { zh: '一群鸟', py: 'yì qún niǎo', vi: 'một đàn chim' },
      { zh: '一群孩子', py: 'yì qún háizi', vi: 'một đám trẻ con' },
      { zh: '一群游客', py: 'yì qún yóukè', vi: 'một đoàn khách du lịch' }
    ],
    example: {
      zh: '夕阳西下，天边飞过一群南归的大雁，队形整齐划一。',
      py: 'Xīyáng xīxià, tiānbiān fēi guò yì qún nánguī de dàyàn, duìxíng zhěngqí huàyī.',
      vi: 'Bóng chiều tà lặn về tây, chân trời bay qua một đàn nhạn bay về nam với đội hình tăm tắp ngay ngắn.'
    },
    tip: '💡 Đàn động vật hoặc tốp đông người tụ họp lại dùng 群 (qún)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 操场上一____朝气蓬勃的学生正在踢足球。',
      options: ['群 (qún)', '双 (shuāng)', '把 (bǎ)', '条 (tiáo)'],
      answer: 0,
      explain: 'Tốp đông người (学生) dùng lượng từ 群 (qún).'
    }
  },
  {
    id: 'clf_lie',
    char: '列',
    pinyin: 'liè',
    hanviet: 'Liệt',
    meaning: 'đoàn, chuyến (phương tiện đường sắt chạy thành hàng dài)',
    category: 'vehicles_buildings',
    categoryName: 'Phương Tiện & Kiến Trúc',
    applicableObjects: 'Đoàn tàu hỏa, đoàn tàu cao tốc đường sắt...',
    collocations: [
      { zh: '一列火车', py: 'yí liè huǒchē', vi: 'một đoàn tàu hỏa' },
      { zh: '一列高铁', py: 'yí liè gāotiě', vi: 'một đoàn tàu cao tốc' },
      { zh: '一列车队', py: 'yí liè chēduì', vi: 'một đoàn xe' }
    ],
    example: {
      zh: '随着鸣笛声响起，一列复兴号高铁列车如银色闪电般飞驰而过。',
      py: 'Suízhe míngdíshēng xiǎngqǐ, yí liè Fùxīnghào gāotiě lièchē rú yínsè shǎndiàn bān fēichí ér guò.',
      vi: 'Kèm theo tiếng còi vang lên, một đoàn tàu cao tốc Phục Hưng tựa như tia chớp bạc lao vút qua.'
    },
    tip: '💡 Xe ô tô có bánh dùng 辆 (liàng); Tàu hỏa dài nhiều toa dùng 列 (liè)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 站台上开进了一____满载旅客的京沪高速列车。',
      options: ['列 (liè)', '辆 (liàng)', '艘 (sōu)', '座 (zuò)'],
      answer: 0,
      explain: 'Đoàn tàu cao tốc đường sắt (列车) dùng lượng từ 列 (liè).'
    }
  },
  {
    id: 'clf_dong',
    char: '栋',
    pinyin: 'dòng',
    hanviet: 'Đống',
    meaning: 'tòa, căn (tòa nhà biệt lập, tòa chung cư, biệt thự)',
    category: 'vehicles_buildings',
    categoryName: 'Phương Tiện & Kiến Trúc',
    applicableObjects: 'Tòa nhà dân cư, nhà chung cư, căn biệt thự, khu giảng đường...',
    collocations: [
      { zh: '一栋楼', py: 'yí dòng lóu', vi: 'một tòa nhà' },
      { zh: '一栋别墅', py: 'yí dòng biéshù', vi: 'một căn biệt thự' },
      { zh: '一栋教学楼', py: 'yí dòng jiàoxuélóu', vi: 'một tòa nhà giảng đường' }
    ],
    example: {
      zh: '大学校园深处矗立着一栋红砖黛瓦的百年历史老建筑。',
      py: 'Dàxué xiàoyuán shēnchù chùlì zhe yí dòng hóngzhuān-dàiwǎ de bǎi nián lìshǐ lǎo jiànzhù.',
      vi: 'Sâu trong khuôn viên trường đại học sừng sững một tòa kiến trúc cổ kính trăm năm gạch đỏ ngói sẫm.'
    },
    tip: '💡 Tòa nhà lớn dùng 座 (zuò) hoặc 栋 (dòng). 栋 hay dùng cho nhà ở, biệt thự, khu nhà.',
    quiz: {
      question: 'Điền lượng từ thích hợp: 小区绿树环抱之中新建了一____现代化的居民住宅楼。',
      options: ['栋 (dòng)', '辆 (liàng)', '条 (tiáo)', '把 (bǎ)'],
      answer: 0,
      explain: 'Tòa nhà cư dân (住宅楼) dùng lượng từ 栋 (dòng).'
    }
  },
  {
    id: 'clf_jia_family',
    char: '家',
    pinyin: 'jiā',
    hanviet: 'Gia',
    meaning: 'nhà, chuỗi (cơ sở kinh doanh, doanh nghiệp, bệnh viện, nhà hàng)',
    category: 'vehicles_buildings',
    categoryName: 'Phương Tiện & Kiến Trúc',
    applicableObjects: 'Công ty, ngân hàng, nhà hàng, khách sạn, bệnh viện, hiệu sách, tiệm cà phê...',
    collocations: [
      { zh: '一家公司', py: 'yì jiā gōngsī', vi: 'một công ty' },
      { zh: '一家饭馆', py: 'yì jiā fànguǎn', vi: 'một quán ăn' },
      { zh: '一家银行', py: 'yì jiā yínháng', vi: 'một ngân hàng' },
      { zh: '一家医院', py: 'yì jiā yīyuàn', vi: 'một bệnh viện' },
      { zh: '一家书店', py: 'yì jiā shūdiàn', vi: 'một hiệu sách' }
    ],
    example: {
      zh: '大学毕业后，他凭借卓越的综合素质成功入职了一家全球知名跨国企业。',
      py: 'Dàxué bìyè hòu, tā píngjiè zhuóyuè de zōnghé sùzhì chénggōng rùzhí le yì jiā quánqiú zhīmíng kuàguó qǐyè.',
      vi: 'Sau khi tốt nghiệp đại học, nhờ năng lực tổng hợp vượt trội anh ấy đã thành công đầu quân vào một doanh nghiệp đa quốc gia lừng danh toàn cầu.'
    },
    tip: '💡 Bẫy HSK: Cơ sở kinh doanh/doanh nghiệp bắt buộc dùng 家 (jiā), không dùng 个!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 商业街拐角处新开业了一____装修精致的手工烘焙咖啡馆。',
      options: ['家 (jiā)', '座 (zuò)', '张 (zhāng)', '条 (tiáo)'],
      answer: 0,
      explain: 'Quán cà phê kinh doanh dùng lượng từ 家 (jiā).'
    }
  },
  {
    id: 'clf_suo',
    char: '所',
    pinyin: 'suǒ',
    hanviet: 'Sở',
    meaning: 'ngôi (trường học, viện nghiên cứu, bệnh viện, cơ quan quy mô lớn)',
    category: 'vehicles_buildings',
    categoryName: 'Phương Tiện & Kiến Trúc',
    applicableObjects: 'Trường học, đại học, nhà trẻ, trạm y tế, viện nghiên cứu...',
    collocations: [
      { zh: '一所学校', py: 'yì suǒ xuéxiào', vi: 'một ngôi trường' },
      { zh: '一所大学', py: 'yì suǒ dàxué', vi: 'một trường đại học' },
      { zh: '一所幼儿园', py: 'yì suǒ yòu\'éryuán', vi: 'một nhà trẻ' },
      { zh: '一所医院', py: 'yì suǒ yīyuàn', vi: 'một bệnh viện' }
    ],
    example: {
      zh: '北京语言大学是一所以对来华留学生进行汉语和中华文化教育为特色的著名高等学府。',
      py: 'Běijīng Yǔyán Dàxué shì yì suǒ yǐ duì lái Huá liúxuéshēng jìnxíng Hànyǔ hé Zhōnghuá wénhuà jiàoyù wéi tèsè de zhùmíng gāoděng xuéfǔ.',
      vi: 'Đại học Ngôn ngữ Bắc Kinh là một ngôi trường đại học danh tiếng với thế mạnh đào tạo tiếng Hán và văn hóa Trung Hoa cho lưu học sinh quốc tế.'
    },
    tip: '💡 Trường học (学校) dùng 所 (suǒ); Bệnh viện dùng 所 hoặc 家.',
    quiz: {
      question: 'Điền lượng từ thích hợp: 他的终极求学目标是考进一____国内顶尖的双一流大学。',
      options: ['所 (suǒ)', '个 (gè)', '座 (zuò)', '把 (bǎ)'],
      answer: 0,
      explain: 'Trường đại học (大学) dùng lượng từ 所 (suǒ).'
    }
  },
  {
    id: 'clf_jian_room',
    char: '间',
    pinyin: 'jiān',
    hanviet: 'Gian',
    meaning: 'gian, căn, phòng (phòng ốc, không gian ngăn cách trong nhà)',
    category: 'vehicles_buildings',
    categoryName: 'Phương Tiện & Kiến Trúc',
    applicableObjects: 'Căn phòng, phòng ngủ, phòng khách, phòng tắm, phòng làm việc...',
    collocations: [
      { zh: '一间房间', py: 'yì jiān fángjiān', vi: 'một căn phòng' },
      { zh: '一间卧室', py: 'yì jiān wòshì', vi: 'một phòng ngủ' },
      { zh: '一间教室', py: 'yì jiān jiàoshì', vi: 'một phòng học' },
      { zh: '一间办公室', py: 'yì jiān bàngōngshì', vi: 'một phòng làm việc' }
    ],
    example: {
      zh: '推开门，里面是一间宽敞明亮、采光极佳的现代化办公室。',
      py: 'Tuīkāi mén, lǐmiàn shì yì jiān kuānchǎng míngliàng, cǎiguāng jí jiā de xiàndàihuà bàngōngshì.',
      vi: 'Đẩy cửa bước vào, bên trong là một căn phòng làm việc hiện đại rộng rãi sáng sủa và đón ánh sáng cực tốt.'
    },
    tip: '💡 Bẫy HSK: Phòng (房间/教室/办公室) dùng 间; Nhà (房子/住宅) dùng 套 hoặc 栋!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 留学生宿舍由两____独立卧室和一个共用客厅组成。',
      options: ['间 (jiān)', '套 (tào)', '所 (suǒ)', '栋 (dòng)'],
      answer: 0,
      explain: 'Phòng ngủ đơn lẻ (卧室) dùng lượng từ 间 (jiān).'
    }
  },
  {
    id: 'clf_chang_match',
    char: '场',
    pinyin: 'chǎng',
    hanviet: 'Trường',
    meaning: 'trận, buổi (trận đấu, buổi biểu diễn, cơn mưa tuyết)',
    category: 'verbal',
    categoryName: 'Động Lượng Từ (Số Lần Hành Động)',
    applicableObjects: 'Trận bóng, buổi hòa nhạc, cơn mưa, trận tuyết, vở kịch, kỳ thi...',
    collocations: [
      { zh: '一场足球赛', py: 'yì chǎng zúqiúsài', vi: 'một trận bóng đá' },
      { zh: '一场大雨', py: 'yì chǎng dàyǔ', vi: 'một trận mưa to' },
      { zh: '一场大雪', py: 'yì chǎng dàxuě', vi: 'một trận tuyết lớn' },
      { zh: '一场音乐会', py: 'yì chǎng yīnyuèhuì', vi: 'một buổi hòa nhạc' },
      { zh: '一场考试', py: 'yì chǎng kǎoshì', vi: 'một kỳ thi' }
    ],
    example: {
      zh: '昨夜一场绵绵春雨悄然滋润了大地的每一个角落。',
      py: 'Zuóyè yì chǎng miánmián chūnyǔ qiǎorán zīrùn le dàdì de měi yí gè jiǎoluò.',
      vi: 'Đêm qua một trận mưa xuân lất phất lặng lẽ tưới mát từng ngóc ngách của đất mẹ.'
    },
    tip: '💡 Trận đấu thể thao (比赛), hòa nhạc (音乐会) và trận mưa/tuyết (雨/雪) dùng 场 (chǎng)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 昨晚鸟巢体育场举行了一____激动人心的世界杯决赛。',
      options: ['场 (chǎng)', '次 (cì)', '遍 (biàn)', '顿 (dùn)'],
      answer: 0,
      explain: 'Trận đấu thể thao chung kết (决赛) dùng 场 (chǎng).'
    }
  },
  {
    id: 'clf_sheng',
    char: '声',
    pinyin: 'shēng',
    hanviet: 'Thanh',
    meaning: 'tiếng (âm thanh phát ra: tiếng gọi, tiếng thở dài, tiếng cảm ơn)',
    category: 'verbal',
    categoryName: 'Động Lượng Từ (Số Lần Hành Động)',
    applicableObjects: 'Tiếng gọi, tiếng thở dài, tiếng kêu, lời chào, lời cảm ơn...',
    collocations: [
      { zh: '叫一声', py: 'jiào yì shēng', vi: 'gọi một tiếng' },
      { zh: '叹了一口气', py: 'tàn le yì shēng qì', vi: 'thở dài một tiếng' },
      { zh: '说一声谢谢', py: 'shuō yì shēng xièxie', vi: 'nói một tiếng cảm ơn' },
      { zh: '听见一声巨响', py: 'tīngjiàn yì shēng jùxiǎng', vi: 'nghe thấy một tiếng nổ lớn' }
    ],
    example: {
      zh: '下车时，懂礼貌的乘客微笑着向司机师傅道了一声真诚的感谢。',
      py: 'Xiàchē shí, dǒnglǐmào de chéngkè wēixiào zhe xiàng sījī shīfu dào le yì shēng zhēnchéng de gǎnxiè.',
      vi: 'Lúc xuống xe, người hành khách lễ phép mỉm cười gửi tới bác tài xế một tiếng cảm ơn chân thành.'
    },
    tip: '💡 Âm thanh phát ra từ miệng hoặc tự nhiên thường dùng 声 (shēng: 一声巨响, 叫了一声)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 他听到屋里传出一____婴儿清脆稚嫩的啼哭声。',
      options: ['声 (shēng)', '次 (cì)', '把 (bǎ)', '条 (tiáo)'],
      answer: 0,
      explain: 'Tiếng khóc phát ra dùng động lượng từ 声 (shēng).'
    }
  },
  {
    id: 'clf_xia',
    char: '下',
    pinyin: 'xià',
    hanviet: 'Hạ',
    meaning: 'cái, phát (động tác ngắn diễn ra nhanh chóng, một cái vỗ, gõ, đập)',
    category: 'verbal',
    categoryName: 'Động Lượng Từ (Số Lần Hành Động)',
    applicableObjects: 'Gõ cửa, vỗ vai, hôn, lắc đầu, cắn một miếng, vẫy tay...',
    collocations: [
      { zh: '敲了几下门', py: 'qiāo le jǐ xià mén', vi: 'gõ cửa mấy cái' },
      { zh: '拍了一下肩膀', py: 'pāi le yí xià jiānbǎng', vi: 'vỗ vai một cái' },
      { zh: '摇了摇头', py: 'yáo le yí xià tóu', vi: 'lắc đầu một cái' },
      { zh: '眨了一下眼睛', py: 'zhǎ le yí xià yǎnjīng', vi: 'chớp mắt một cái' }
    ],
    example: {
      zh: '他礼貌地走上前，轻轻敲了几下办公室虚掩的房门。',
      py: 'Tā lǐmào de zǒu shàngqián, qīngqīng qiāo le jǐ xià bàngōngshì xūyǎn de fángmén.',
      vi: 'Anh ấy lịch sự bước tới, khẽ gõ mấy cái vào cánh cửa phòng làm việc đang khép hờ.'
    },
    tip: '💡 Biểu thị động tác diễn ra trong chớp mắt thường dùng 一下 (gõ một cái, nhìn một cái)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 老朋友热情地上前拍了拍我的一____肩膀。',
      options: ['下 (xià)', '次 (cì)', '遍 (biàn)', '顿 (dùn)'],
      answer: 0,
      explain: 'Hành động vỗ vai nhanh dùng động lượng từ 下 (xià).'
    }
  },
  {
    id: 'clf_fan',
    char: '番',
    pinyin: 'fān',
    hanviet: 'Phiên',
    meaning: 'hồi, phen, phen khổ cực (hành động trải qua thời gian nỗ lực, suy nghĩ)',
    category: 'verbal',
    categoryName: 'Động Lượng Từ (Số Lần Hành Động)',
    applicableObjects: 'Suy nghĩ, tranh luận, nỗ lực phấn đấu, giải thích, phong cảnh...',
    collocations: [
      { zh: '思考一番', py: 'sīkǎo yì fān', vi: 'suy ngẫm một hồi' },
      { zh: '苦练一番', py: 'kǔliàn yì fān', vi: 'khổ luyện một phen' },
      { zh: '别有一番风味', py: 'bié yǒu yì fān fēngwèi', vi: 'mang một phong vị độc đáo riêng' },
      { zh: '经历了一番风雨', py: 'jīnglì le yì fān fēngyǔ', vi: 'trải qua một phen mưa gió thăng trầm' }
    ],
    example: {
      zh: '经过团队日夜兼程的一番艰苦攻关，重大科研难题终于被顺利攻破。',
      py: 'Jīngguò tuánduì rìyè-jiānchéng de yì fān jiānkǔ gōngguān, zhòngdà kēyán nántí zhōngyú bèi shùnlì gōngpò.',
      vi: 'Sau một phen gian khổ vượt khó ngày đêm của đội ngũ, bài toán nghiên cứu khoa học trọng điểm cuối cùng đã được giải quyết thuận lợi.'
    },
    tip: '💡 Bẫy HSK Cao cấp: 一番 dùng cho hành động có sự đầu tư tâm sức lớn (suy nghĩ một hồi, phấn đấu một phen)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 经过专家委员会深入细致的一____论证，项目方案获批通过。',
      options: ['番 (fān)', '次 (cì)', '趟 (tàng)', '下 (xià)'],
      answer: 0,
      explain: 'Trải qua một hồi phân tích luận chứng công phu dùng lượng từ 番 (fān).'
    }
  }
];

// Combine classifiers
const fullClassifiers = [...currentClf, ...MORE_CLASSIFIERS];
fs.writeFileSync(clfPath, JSON.stringify(fullClassifiers, null, 2), 'utf8');
console.log(`✓ Đã cập nhật Bách khoa lượng từ: Tổng cộng ${fullClassifiers.length} lượng từ`);

// Additional 15 Polyphonic words to reach 25
const MORE_POLYPHONIC = [
  {
    id: 'poly_zhao_zhe',
    char: '着',
    hanviet: 'Trước / Trước',
    strokes: 11,
    radical: '目 (Mục)',
    summaryMnemonic: 'Đang duy trì trạng thái đọc "zhe"; Ngủ say, bốc hỏa đọc "zháo"; Nước đi, mặc áo đọc "zhuó"!',
    readings: [
      {
        pinyin: 'zhe',
        tone: 'Thanh nhẹ',
        pos: 'Trợ từ động thái',
        meaning: 'biểu thị động tác hoặc trạng thái đang tiếp diễn, duy trì',
        collocations: ['站着', '坐着', '门开着', '穿着'],
        example: { zh: '外面寒风呼啸，房间里的壁炉静静地燃烧着。', py: 'Wàimiàn hánfēng hūxiào, fángjiān lǐ de bìlú jìngjìng de ránshāo zhe.', vi: 'Bên ngoài gió lạnh gầm rít, lò sưởi trong phòng đang lặng lẽ cháy.' }
      },
      {
        pinyin: 'zháo',
        tone: 'Thanh 2 (tráo)',
        pos: 'Động từ / Bổ ngữ',
        meaning: 'đạt kết quả mong muốn, ngủ say, cháy, sốt ruột',
        collocations: ['睡着了', '着火', '着急', '找着了'],
        example: { zh: '喝了浓茶后，他躺在床上翻来覆去很久才睡着。', py: 'Hē le nóngchá hòu, tā tǎng zài chuáng shang fānlái-fùqù hěn jiǔ cái shuìzháo.', vi: 'Sau khi uống trà đặc, anh ấy nằm trên giường trằn trọc hồi lâu mới ngủ được.' }
      },
      {
        pinyin: 'zhuó',
        tone: 'Thanh 2 (chuốc)',
        pos: 'Động từ / Danh từ',
        meaning: 'mặc (quần áo), chạm đất, nơi nương tựa, hạ bút',
        collocations: ['穿着', '着陆', '着重', '着落'],
        example: { zh: '神舟载人飞船返回舱在内蒙古主着陆场成功着陆。', py: 'Shénzhōu zàirén fēichuán fǎnhuícāng zài Nèiměnggǔ zhǔ zhuólùchǎng chénggōng zhuólù.', vi: 'Khoang phi thuyền Thần Châu đã hạ cánh thành công xuống bãi đáp chính Nội Mông.' }
      }
    ],
    quiz: {
      question: 'Trong câu "太累了，他一躺下就睡____了。" chữ "着" đọc là gì?',
      options: ['zháo (thanh 2)', 'zhe (thanh nhẹ)', 'zhuó (thanh 2)'],
      answer: 0,
      explain: 'Ngủ thiếp đi (睡着了) chữ 着 đọc là zháo.'
    }
  },
  {
    id: 'poly_di_de',
    char: '地',
    hanviet: 'Địa / Đích',
    strokes: 6,
    radical: '土 (Thổ)',
    summaryMnemonic: 'Đất đai, địa điểm đọc "dì"; Trợ từ trước động từ (làm gì một cách thế nào) đọc "de"!',
    readings: [
      {
        pinyin: 'dì',
        tone: 'Thanh 4 (đị)',
        pos: 'Danh từ',
        meaning: 'đất đai, mặt đất, địa cầu, nơi chốn',
        collocations: ['地球', '地方', '地面', '土地', '目的地'],
        example: { zh: '保护我们赖以生存的地球家园是全人类共同的责任。', py: 'Bǎohù wǒmen làiyǐshēngcún de Dìqiú jiāyuán shì quán rénlèi gòngtóng de zérèn.', vi: 'Bảo vệ mái nhà Trái Đất nơi chúng ta nương tựa sinh sống là trách nhiệm chung của toàn nhân loại.' }
      },
      {
        pinyin: 'de',
        tone: 'Thanh nhẹ',
        pos: 'Trợ từ kết cấu',
        meaning: 'nối trạng ngữ với động từ (Tính từ + 地 + Động từ: làm gì một cách...)',
        collocations: ['慢慢地走', '高兴地说', '认真地听', '飞快地跑'],
        example: { zh: '同学们在课堂上全神贯注地听老师讲课。', py: 'Tóngxuémen zài kètáng shang quánshén-guànzhù de tīng lǎoshī jiǎngkè.', vi: 'Các bạn học sinh trên lớp chăm chú lắng nghe thầy giáo giảng bài.' }
      }
    ],
    quiz: {
      question: 'Trong cụm "高兴____笑了", chữ "地" đọc là gì?',
      options: ['de (thanh nhẹ)', 'dì (thanh 4)'],
      answer: 0,
      explain: 'Đứng trước động từ bổ nghĩa cho hành động (vui vẻ cười), chữ 地 đóng vai trò trợ từ kết cấu đọc là de.'
    }
  },
  {
    id: 'poly_wei',
    char: '为',
    hanviet: 'Vi / Vị',
    strokes: 4,
    radical: '丶 (Chủ)',
    summaryMnemonic: 'Làm, trở thành đọc "wéi"; Vì, để, cho đọc "wèi"!',
    readings: [
      {
        pinyin: 'wéi',
        tone: 'Thanh 2 (uấy)',
        pos: 'Động từ',
        meaning: 'làm, trở thành, bị (câu chữ 为)',
        collocations: ['成为', '认为', '作为', '行为'],
        example: { zh: '他立志经过刻苦学习成为一名救死扶伤的白衣天使。', py: 'Tā lìzhì jīngguò kèkǔ xuéxí chéngwéi yì míng jiùsǐ-fúshāng de báiyī tiānshǐ.', vi: 'Anh ấy lập chí khổ học để trở thành một thiên thần áo trắng cứu người giúp đời.' }
      },
      {
        pinyin: 'wèi',
        tone: 'Thanh 4 (uậy)',
        pos: 'Giới từ',
        meaning: 'vì, để, cho (biểu thị mục đích, nguyên nhân, đối tượng phục vụ)',
        collocations: ['为了', '为什么', '为人民服务', '为你高兴'],
        example: { zh: '为了早日实现美好梦想，我们必须争分夺秒努力拼搏。', py: 'Wèile zǎorì shíxiàn měihǎo mèngxiǎng, wǒmen bìxū zhēngfēn-duómiǎo nǔlì pīnbó.', vi: 'Để sớm ngày hiện thực hóa ước mơ tươi đẹp, chúng ta phải tranh thủ từng phút giây nỗ lực phấn đấu.' }
      }
    ],
    quiz: {
      question: 'Từ "为什么" (tại sao) chữ "为" phát âm là gì?',
      options: ['wèi (thanh 4)', 'wéi (thanh 2)'],
      answer: 0,
      explain: 'Trong từ 为什么 và 为了 chỉ mục đích/nguyên nhân, chữ 为 đọc là wèi.'
    }
  },
  {
    id: 'poly_hao',
    char: '好',
    hanviet: 'Hảo / Háo',
    strokes: 6,
    radical: '女 (Nữ)',
    summaryMnemonic: 'Tốt, đẹp, khỏe đọc "hǎo"; Sở thích, yêu thích đọc "hào"!',
    readings: [
      {
        pinyin: 'hǎo',
        tone: 'Thanh 3 (hảo)',
        pos: 'Tính từ / Phó từ',
        meaning: 'tốt, đẹp, rất, xong rồi',
        collocations: ['你好', '好朋友', '很好', '做好'],
        example: { zh: '阅读经典名著是开阔人生眼界的一种好方法。', py: 'Yuèdú jīngdiǎn míngzhù shì kāikuò rénshēng yǎnjiè de yì zhǒng hǎo fāngfǎ.', vi: 'Đọc danh tác kinh điển là một phương pháp tốt để mở rộng tầm mắt nhân sinh.' }
      },
      {
        pinyin: 'hào',
        tone: 'Thanh 4 (hạo)',
        pos: 'Động từ / Danh từ',
        meaning: 'thích, yêu chuộng, ham muốn',
        collocations: ['爱好', '好奇', '好客', '好学'],
        example: { zh: '他最大的业余兴趣爱好就是利用周末时间钻研计算机编程。', py: 'Tā zuì dà de yèyú xìngqù àihào jiùshì lìyòng zhōumò shíjiān zuānyán jìsuànjī biānchéng.', vi: 'Sở thích hứng thú lớn nhất ngoài giờ của anh ấy là tận dụng thời gian cuối tuần nghiên cứu lập trình máy tính.' }
      }
    ],
    quiz: {
      question: 'Từ "爱好" (sở thích) chữ "好" phát âm là gì?',
      options: ['hào (thanh 4)', 'hǎo (thanh 3)'],
      answer: 0,
      explain: 'Trong từ 爱好 (sở thích) và 好奇 (hiếu kỳ), chữ 好 phát âm là hào.'
    }
  },
  {
    id: 'poly_dou_du',
    char: '都',
    hanviet: 'Đô / Đô',
    strokes: 10,
    radical: '阝 (Ấp)',
    summaryMnemonic: 'Đều, tất cả đọc "dōu"; Thủ đô, thành đô đọc "dū"!',
    readings: [
      {
        pinyin: 'dōu',
        tone: 'Thanh 1 (đâu)',
        pos: 'Phó từ',
        meaning: 'đều, tất cả, đã',
        collocations: ['我们都', '都很好', '都会', '都几点了'],
        example: { zh: '我们班的每一位同学都非常热爱学习中国古代文学。', py: 'Wǒmen bān de měi yí wèi tóngxué dōu fēicháng rè\'ài xuéxí Zhōngguó gǔdài wénxué.', vi: 'Mỗi một bạn học sinh lớp chúng tôi đều rất đam mê học tập văn học cổ đại Trung Quốc.' }
      },
      {
        pinyin: 'dū',
        tone: 'Thanh 1 (đu)',
        pos: 'Danh từ',
        meaning: 'thủ đô, thành phố lớn, đô thị',
        collocations: ['首都', '都市', '故都', '魔都'],
        example: { zh: '北京作为中华人民共和国的首都，是全国政治与文化交往的中心。', py: 'Běijīng zuòwéi Zhōnghuá Rénmín Gònghéguó de shǒudū, shì quánguó zhèngzhì yǔ wénhuà jiāowǎng de zhōngxīn.', vi: 'Bắc Kinh với tư cách là thủ đô của CHND Trung Hoa, là trung tâm chính trị và giao lưu văn hóa của cả nước.' }
      }
    ],
    quiz: {
      question: 'Từ "首都" (thủ đô) chữ "都" phát âm là gì?',
      options: ['dū (thanh 1)', 'dōu (thanh 1)'],
      answer: 0,
      explain: 'Trong từ 首都 (thủ đô) và 都市 (đô thị), chữ 都 phát âm là dū.'
    }
  }
];

const fullPolyphonic = [...currentPoly, ...MORE_POLYPHONIC];
fs.writeFileSync(polyPath, JSON.stringify(fullPolyphonic, null, 2), 'utf8');
console.log(`✓ Đã cập nhật Chữ đa âm đa nghĩa: Tổng cộng ${fullPolyphonic.length} chữ cốt lõi`);
