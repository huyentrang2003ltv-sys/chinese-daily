const { dataFile } = require('./paths');
const fs = require('fs');
const path = require('path');

const existingPath = dataFile('chengyu.json');
const current = JSON.parse(fs.readFileSync(existingPath, 'utf8'));

const newChengyu = [
  {
    id: "chengyu_9",
    chengyu: "知己知彼",
    pinyin: "zhī jǐ zhī bǐ",
    hanviet: "Tri Kỷ Tri Bỉ",
    literal: "Biết mình biết người",
    figurative: "Hiểu rõ thực lực của mình và nắm vững điểm mạnh điểm yếu của đối thủ thì làm việc gì cũng nắm chắc phần thắng (Trăm trận trăm thắng).",
    category: "wisdom",
    categoryName: "Trí Tuệ Xử Thế",
    categoryColor: "amber",
    story: "Xuất phát từ thiên 'Mưu công' trong kiệt tác quân sự 'Tôn Tử Binh Pháp' (孙子兵法) của Tôn Vũ: 'Tri kỷ tri bỉ, bách chiến bất đãi' (Biết người biết ta, trăm trận không nguy). Trong đàm phán kinh doanh hay học tập cũng vậy, hiểu rõ ưu thế và hạn chế của bản thân là bước đầu tiên để thành công.",
    lesson: "Đừng kiêu ngạo cũng đừng tự ti. Hãy phân tích khách quan tình hình để đưa ra chiến lược khôn ngoan nhất.",
    example: {
      hanzi: "在商业谈判中，只有做到知己知彼，才能争取到最大的利益。",
      pinyin: "Zài shāngyè tánpàn zhōng, zhǐyǒu zuò dào zhī jǐ zhī bǐ, cái néng zhēngqǔ dào zuì dà de lìyì.",
      vi: "Trong đàm phán thương mại, chỉ khi biết người biết ta mới giành được lợi ích tối đa."
    }
  },
  {
    id: "chengyu_10",
    chengyu: "亡羊补牢",
    pinyin: "wáng yáng bǔ láo",
    hanviet: "Vong Dương Bổ Lao",
    literal: "Mất cừu rồi mới sửa chuồng",
    figurative: "Mất bò mới lo làm chuồng, nhưng biết sửa chữa sai lầm và khắc phục hậu quả kịp thời thì vẫn chưa muộn.",
    category: "caution",
    categoryName: "Cảnh Tỉnh Nhân Sinh",
    categoryColor: "rose",
    story: "Trong sách 'Chiến Quốc Sách', có người chăn cừu bị sói bắt mất một con vì chuồng rách. Hàng xóm khuyên vá chuồng nhưng anh ta bảo 'mất rồi vá làm chi'. Đêm sau sói lại vào bắt tiếp một con nữa. Lúc này anh ta mới hối hận vội vã sửa chuồng chắc chắn, từ đó về sau bầy cừu không còn bị mất nữa.",
    lesson: "Mắc sai lầm không đáng sợ, đáng sợ là không chịu rút kinh nghiệm để sửa đổi. Nhận ra thiếu sót và sửa chữa ngay thì luôn luôn còn kịp.",
    example: {
      hanzi: "虽然这次考试没考好，但是现在努力复习、亡羊补牢还来得及。",
      pinyin: "Suīrán zhè cì kǎoshì méi kǎo hǎo, dànshì xiànzài nǔlì fùxí, wáng yáng bǔ láo hái láidejí.",
      vi: "Tuy lần thi này chưa tốt, nhưng bây giờ nỗ lực ôn tập để khắc phục sai lầm thì vẫn còn kịp."
    }
  },
  {
    id: "chengyu_11",
    chengyu: "塞翁失马",
    pinyin: "sài wēng shī mǎ",
    hanviet: "Tái Ông Thất Mã",
    literal: "Ông lão biên giới mất ngựa",
    figurative: "Trong họa có phúc, trong rủi có may; chuyện đời biến hóa khôn lường, chớ vội buồn khi gặp rủi ro cũng chớ quá mừng khi gặp may mắn.",
    category: "wisdom",
    categoryName: "Trí Tuệ Xử Thế",
    categoryColor: "amber",
    story: "Trích từ sách 'Hoài Nam Tử': Ông lão vùng biên ải mất một con ngựa quý, hàng xóm tiếc thay nhưng ông bảo 'biết đâu lại là phúc'. Mấy tháng sau, ngựa trở về dẫn theo một đàn ngựa thảo nguyên quý. Con trai ông cưỡi ngựa ngã gãy chân, ông lại bảo 'biết đâu là phúc'. Năm sau giặc tràn qua biên giới, thanh niên trong làng đều bị bắt đi lính và tử trận, riêng con trai ông vì tàn tật mà được sống sót bình yên bên gia đình.",
    lesson: "Giữ tâm thế bình thản trước mọi thăng trầm của cuộc đời. Mọi khó khăn thử thách hôm nay đều có thể là cánh cửa mở ra phúc lành ngày mai.",
    example: {
      hanzi: "塞翁失马，焉知非福。这次丢了工作，说不定正是你自主创业的好机会。",
      pinyin: "Sài wēng shī mǎ, yān zhī fēi fú. Zhè cì diū le gōngzuò, shuōbudìng zhèng shì nǐ zìzhǔ chuàngyè de hǎo jīhuì.",
      vi: "Tái ông mất ngựa, biết đâu là phúc. Lần này mất việc, biết đâu lại chính là cơ hội tuyệt vời để bạn tự mình khởi nghiệp."
    }
  },
  {
    id: "chengyu_12",
    chengyu: "自相矛盾",
    pinyin: "zì xiāng máodùn",
    hanviet: "Tự Tương Mâu Thuẫn",
    literal: "Dùng mâu của mình đâm vào khiên của mình",
    figurative: "Lời nói và việc làm trước sau không nhất quán, tự mình bác bỏ chính mình.",
    category: "caution",
    categoryName: "Cảnh Tỉnh Nhân Sinh",
    categoryColor: "rose",
    story: "Sách 'Hàn Phi Tử' kể: Một người nước Sở bán mâu và khiên ngoài chợ. Anh ta vừa giơ chiếc khiên lên khen: 'Khiên của tôi chắc chắn nhất trần đời, không vũ khí nào đâm thủng được', lát sau lại giơ ngọn mâu lên khen: 'Ngọn mâu của tôi sắc bén vô song, đâm gì cũng thủng'. Người đi đường bèn hỏi: 'Thế lấy ngọn mâu của anh đâm vào chiếc khiên của anh thì sao?'. Người bán hàng á khẩu không đáp lại được.",
    lesson: "Nói năng phải cẩn trọng, suy nghĩ thấu đáo, chớ ba hoa khoác lác mà chuốc lấy sự xấu hổ.",
    example: {
      hanzi: "他刚才说自己没空，现在又说要去逛街，真是自相矛盾。",
      pinyin: "Tā gāngcái shuō zìjǐ méi kòng, xiànzài yòu shuō yào qù guàngjiē, zhēn shì zì xiāng máodùn.",
      vi: "Anh ấy vừa bảo mình không rảnh, giờ lại bảo đi dạo phố, thật là tự mâu thuẫn chính mình."
    }
  },
  {
    id: "chengyu_13",
    chengyu: "井底之蛙",
    pinyin: "jǐng dǐ zhī wā",
    hanviet: "Tỉnh Để Chi Oa",
    literal: "Con ếch ở đáy giếng",
    figurative: "Người có tầm nhìn hạn hẹp, kiến thức nông cạn nhưng lại tự mãn coi thường thiên hạ.",
    category: "caution",
    categoryName: "Cảnh Tỉnh Nhân Sinh",
    categoryColor: "rose",
    story: "Trích thiên 'Thu thủy' trong sách 'Trang Tử': Con ếch sống dưới đáy giếng cạn khoe khoang với rùa biển Đông rằng đáy giếng của nó là cả một vương quốc tuyệt vời. Rùa biển kể cho ếch nghe về sự mênh mông ngút ngàn của biển cả nghìn dặm, sâu nghìn trượng. Con ếch nghe xong kinh ngạc đến mức ngẩn ngơ, xấu hổ khôn cùng.",
    lesson: "Thế giới vô cùng rộng lớn, tri thức là biển cả mênh mông. Luôn giữ tinh thần khiêm nhường học hỏi, bước ra khỏi vùng an toàn.",
    example: {
      hanzi: "我们要多出去看看外面的世界，不能做井底之蛙。",
      pinyin: "Wǒmen yào duō chūqù kànkan wàimiàn de shìjiè, bù néng zuò jǐng dǐ zhī wā.",
      vi: "Chúng ta cần đi nhiều để ngắm nhìn thế giới bên ngoài, không thể làm chú ếch ngồi đáy giếng được."
    }
  },
  {
    id: "chengyu_14",
    chengyu: "一石二鸟",
    pinyin: "yī shí èr niǎo",
    hanviet: "Nhất Thạch Nhị Điểu",
    literal: "Một hòn đá bắn trúng hai con chim",
    figurative: "Làm một việc mà đồng thời thu được hai mối lợi (Một công đôi việc / Nhất cử lưỡng tiện).",
    category: "wisdom",
    categoryName: "Trí Tuệ Xử Thế",
    categoryColor: "amber",
    story: "Thành ngữ bắt nguồn từ nghệ thuật săn bắn cổ đại, tương tự câu 'Nhất tiến song điêu' (Một mũi tên bắn rơi hai con chim điêu). Ngày nay được dùng rộng rãi trong quản trị và đời sống để chỉ phương án tối ưu mang lại hiệu quả kép.",
    lesson: "Biết sắp xếp công việc và tư duy thông minh sẽ giúp ta tiết kiệm thời gian và đạt hiệu quả gấp bội phần.",
    example: {
      hanzi: "每天骑自行车去上班，既能锻炼身体又能节约路费，真是一石二鸟。",
      pinyin: "Měitiān qí zìxíngchē qù shàngbān, jì néng duànliàn shēntǐ yòu néng jiéyuē lùfèi, zhēn shì yī shí èr niǎo.",
      vi: "Hằng ngày đạp xe đi làm, vừa rèn luyện sức khỏe lại vừa tiết kiệm tiền xăng xe, đúng là một công đôi việc."
    }
  },
  {
    id: "chengyu_15",
    chengyu: "入乡随俗",
    pinyin: "rù xiāng suí sú",
    hanviet: "Nhập Hương Tùy Tục",
    literal: "Vào làng nào thì theo phong tục làng đó",
    figurative: "Nhập gia tùy tục: Đến một vùng đất mới hay sống trong môi trường mới thì nên tôn trọng và làm theo phong tục tập quán ở đó.",
    category: "culture",
    categoryName: "Văn Hóa Đời Sống",
    categoryColor: "emerald",
    story: "Trích từ 'Trang Tử': Khi Lão Tử và các hiền triết đi chu du qua các nước chư hầu, mỗi nơi đều có lễ nghi, văn hóa và nếp sống riêng biệt. Người hiểu biết luôn tôn trọng sự đa dạng văn hóa bản địa để hòa nhập và kết giao chân thành.",
    lesson: "Tôn trọng sự khác biệt văn hóa là chiếc chìa khóa vàng giúp bạn hòa nhập và được mọi người chào đón ở bất kỳ nơi đâu.",
    example: {
      hanzi: "去别人家做客要入乡随俗，遵守主人的规矩与习惯。",
      pinyin: "Qù biérén jiā zuòkè yào rù xiāng suí sú, zūnshǒu zhǔrén de guīju yǔ xíguàn.",
      vi: "Đến nhà người khác làm khách phải nhập gia tùy tục, tuân thủ phép tắc và thói quen của gia chủ."
    }
  },
  {
    id: "chengyu_16",
    chengyu: "对牛弹琴",
    pinyin: "duì niú tán qín",
    hanviet: "Đối Ngưu Đàn Cầm",
    literal: "Đàn gảy tai trâu",
    figurative: "Nói lời đạo lý cao siêu hay giảng giải nghệ thuật cho người hoàn toàn không hiểu gì nghe, uổng phí công sức.",
    category: "caution",
    categoryName: "Cảnh Tỉnh Nhân Sinh",
    categoryColor: "rose",
    story: "Nhạc sĩ Công Minh Nghi thời cổ đàn một khúc đàn tuyệt diệu cho con trâu đang gặm cỏ nghe. Trâu vẫn thản nhiên cắm cúi ăn cỏ như không có gì. Khi ông gảy tiếng đàn bắt chước tiếng muỗi vo ve và tiếng bê con lạc mẹ, trâu lập tức nghếch tai chú ý. Điều đó chứng tỏ không phải trâu không nghe thấy, mà là tiếng đàn thanh tao không phù hợp với nhận thức của nó.",
    lesson: "Giao tiếp cần lựa người và lựa thời điểm. Nói chuyện với ai phải dùng ngôn ngữ và góc nhìn phù hợp với trình độ của họ.",
    example: {
      hanzi: "跟一个不懂艺术的人谈论古典音乐，简直就是对牛弹琴。",
      pinyin: "Gēn yí gè bù dǒng yìshù de rén tánlùn gǔdiǎn yīnyuè, jiǎnzhí jiù shì duì niú tán qín.",
      vi: "Nói chuyện âm nhạc cổ điển với một người chẳng hiểu gì về nghệ thuật thì đúng là đàn gảy tai trâu."
    }
  },
  {
    id: "chengyu_17",
    chengyu: "人山人海",
    pinyin: "rén shān rén hǎi",
    hanviet: "Nhân Sơn Nhân Hải",
    literal: "Người như núi, người như biển",
    figurative: "Biển người bao la, đông đúc nhộn nhịp đến nghẹt thở.",
    category: "culture",
    categoryName: "Văn Hóa Đời Sống",
    categoryColor: "emerald",
    story: "Hình ảnh ước lệ kinh điển trong văn học Trung Hoa để miêu tả những dịp lễ hội hoa đăng, tết Nguyên Tiêu hay hội hè đình miếu nơi hàng vạn người đổ về nô nức chật kín các ngả đường.",
    lesson: "Một thành ngữ cực kỳ phổ biến trong đời sống hàng ngày và đề thi HSK khi miêu tả cảnh tượng đông đúc.",
    example: {
      hanzi: "春节期间的火车站人山人海，到处都是提着行李回家过年的人。",
      pinyin: "Chūnjié qījiān de huǒchēzhàn rén shān rén hǎi, dàochù dōu shì tí zhe xíngli huíjiā guònián de rén.",
      vi: "Ga tàu hỏa dịp Tết Nguyên Đán biển người chen chúc, đâu đâu cũng thấy người xách hành lý về quê đón năm mới."
    }
  },
  {
    id: "chengyu_18",
    chengyu: "半途而废",
    pinyin: "bàn tú ér fèi",
    hanviet: "Bán Đồ Nhi Phế",
    literal: "Đi nửa đường rồi bỏ cuộc",
    figurative: "Bỏ dở giữa chừng, thiếu kiên trì nhẫn nại, làm việc không có đầu có đuôi.",
    category: "perseverance",
    categoryName: "Ý Chí & Kiên Trì",
    categoryColor: "blue",
    story: "Nhạc Dương Tử thời Đông Hán đi xa học đạo. Một năm sau vì nhớ vợ nên bỏ học về nhà. Người vợ cầm chiếc kéo đến bên khung cửi đang dệt tấm vải lụa dở dang và nói: 'Tấm lụa này dệt từng sợi một mới thành. Nay chàng bỏ học giữa chừng, chẳng khác nào thiếp cầm kéo cắt đứt tấm vải này!'. Nhạc Dương Tử tỉnh ngộ, quay lại học ròng rã 7 năm thành tài lớn.",
    lesson: "Chặng đường đến thành công luôn có chông gai. Kiên trì tới cùng mới nếm được quả ngọt, bỏ cuộc giữa chừng sẽ uổng phí mọi công lao.",
    example: {
      hanzi: "学习外语最忌讳半途而废，只有持之以恒才能取得突破。",
      pinyin: "Xuéxí wàiyǔ zuì jìhuì bàn tú ér fèi, zhǐyǒu chí zhī yǐ héng cái néng qǔdé tūtò.",
      vi: "Học ngoại ngữ tối kỵ nhất là bỏ dở giữa chừng, chỉ có kiên trì bền bỉ mới tạo nên bứt phá."
    }
  },
  {
    id: "chengyu_19",
    chengyu: "胸有成竹",
    pinyin: "xiōng yǒu chéng zhú",
    hanviet: "Hung Hữu Thành Trúc",
    literal: "Trong lồng ngực đã có sẵn hình bóng cây tre",
    figurative: "Trước khi làm việc gì trong lòng đã tính toán kỹ lưỡng, hoàn toàn tự tin và nắm chắc phần thắng.",
    category: "wisdom",
    categoryName: "Trí Tuệ Xử Thế",
    categoryColor: "amber",
    story: "Họa sĩ Văn Đồng thời Tống rất giỏi vẽ tre. Trước cửa nhà ông trồng một rừng tre xanh tốt. Bất kể bốn mùa mưa nắng, ông đều ra ngắm nghía từng nhánh tre, đốt tre, phiến lá. Đến khi cầm bút vẽ, toàn bộ hình ảnh sống động của cây tre đã hiện rõ trong tâm trí ông, hạ bút là thành kiệt tác.",
    lesson: "Sự tự tin vững chắc bắt nguồn từ sự chuẩn bị chu đáo và am hiểu sâu sắc về công việc mình sắp làm.",
    example: {
      hanzi: "面对这次重要的考试，因为复习充分，他显得胸有成竹。",
      pinyin: "Miànduì zhè cì zhòngyào de kǎoshì, yīnwèi fùxí chōngfèn, tā xiǎnde xiōng yǒu chéng zhú.",
      vi: "Đối diện với kỳ thi quan trọng lần này, nhờ chuẩn bị kỹ lưỡng nên anh ấy tỏ ra vô cùng tự tin nắm chắc."
    }
  },
  {
    id: "chengyu_20",
    chengyu: "持之以恒",
    pinyin: "chí zhī yǐ héng",
    hanviet: "Trì Chi Dĩ Hằng",
    literal: "Nắm giữ và duy trì một cách bền bỉ",
    figurative: "Kiên trì theo đuổi mục tiêu một cách bền bỉ, không chịu lùi bước trước khó khăn gian khổ.",
    category: "perseverance",
    categoryName: "Ý Chí & Kiên Trì",
    categoryColor: "blue",
    story: "Đại thi hào Bạch Cư Dị từng viết: 'Vi học chi đạo, mạc quý vu trì chi dĩ hằng' (Đạo học không có gì quý hơn sự kiên trì bền bỉ). Mọi thành tựu vĩ đại từ cổ chí kim đều là kết quả của sự tích lũy kiên nhẫn qua từng ngày.",
    lesson: "Năng khiếu có thể mở ra cánh cửa, nhưng sự kiên trì bền bỉ mới đưa bạn đến đích vinh quang.",
    example: {
      hanzi: "只要你持之以恒地每天背三十个单词，一年下来词汇量就会极其惊人。",
      pinyin: "Zhǐyào nǐ chí zhī yǐ héng de měitiān bèi sānshí gè dāncí, yì nián xiàlai cíhuì liàng jiù huì jíqí jīngrén.",
      vi: "Chỉ cần bạn kiên trì bền bỉ mỗi ngày học 30 từ vựng, sau một năm vốn từ của bạn sẽ cực kỳ đáng nể."
    }
  },
  {
    id: "chengyu_21",
    chengyu: "水落石出",
    pinyin: "shuǐ luò shí chū",
    hanviet: "Thủy Lạc Thạch Xuất",
    literal: "Nước rút thì đá lộ ra",
    figurative: "Sau bao nhiêu khúc mắc che đậy, chân tướng sự việc cuối cùng cũng được làm sáng tỏ hoàn toàn.",
    category: "wisdom",
    categoryName: "Trí Tuệ Xử Thế",
    categoryColor: "amber",
    story: "Bắt nguồn từ bài phú 'Hậu Xích Bích Phú' của Tô Thức: 'Giang lưu hữu thanh, đoạn ngạn thiên xích; sơn cao nguyệt tiểu, thủy lạc thạch xuất'. Hình ảnh dòng nước triều rút để lộ ra những mỏm đá ngầm, tượng trưng cho chân lý không thể bị chôn vùi vĩnh viễn.",
    lesson: "Cái kim trong bọc lâu ngày cũng lòi ra. Hãy sống chân thật và trung thực, bởi thời gian sẽ phơi bày mọi sự thật.",
    example: {
      hanzi: "经过警方的深入调查，这起复杂的案件终于水落石出了。",
      pinyin: "Jīngguò jǐngfāng de shēnrù diàochá, zhè qǐ fùzá de ànjiàn zhōngyú shuǐ luò shí chū le.",
      vi: "Sau quá trình điều tra kỹ lưỡng của cảnh sát, vụ án phức tạp này cuối cùng cũng đã sáng tỏ như ban ngày."
    }
  },
  {
    id: "chengyu_22",
    chengyu: "拔苗助长",
    pinyin: "bá miáo zhù zhǎng",
    hanviet: "Bạt Miêu Trợ Trưởng",
    literal: "Kéo mạ non lên để giúp cây mau lớn",
    figurative: "Nóng vội muốn thấy kết quả mà làm trái quy luật tự nhiên, đốt cháy giai đoạn khiến sự việc hỏng bét.",
    category: "caution",
    categoryName: "Cảnh Tỉnh Nhân Sinh",
    categoryColor: "rose",
    story: "Sách 'Mạnh Tử' chép: Người nước Tống thấy ruộng mạ nhà mình lớn chậm, bèn ra đồng cặm cụi dùng tay kéo từng ngọn mạ nhú cao lên. Tối về nhà hớn hở khoe: 'Hôm nay ta mệt lử nhưng đã giúp lúa lớn thêm mấy đốt'. Con trai chạy ra đồng xem thì thấy toàn bộ ruộng mạ đã bị đứt rễ và héo chết khô.",
    lesson: "Mọi sự vật đều cần thời gian để chín muồi. Giáo dục hay học tập đều không thể đốt cháy giai đoạn mà phải tuân theo quy luật phát triển tự nhiên.",
    example: {
      hanzi: "给小孩子安排过重的补习课程，无异于拔苗助长，会扼杀他们的兴趣。",
      pinyin: "Gěi xiǎoháizi ānpái guò zhòng de bǔxí kèchéng, wúyì yú bá miáo zhù zhǎng, huì èshā tāmen de xìngqù.",
      vi: "Ép trẻ nhỏ học thêm quá tải chẳng khác nào kéo mạ lớn nhanh, sẽ bóp nghẹt niềm hứng thú tự nhiên của con."
    }
  },
  {
    id: "chengyu_23",
    chengyu: "望梅止渴",
    pinyin: "wàng méi zhǐ kě",
    hanviet: "Vọng Mai Chỉ Khát",
    literal: "Nhìn thấy quả mơ chua mà đỡ khát",
    figurative: "Dùng ảo tưởng hoặc lời động viên tinh thần để an ủi bản thân vượt qua cơn khốn khó trước mắt.",
    category: "wisdom",
    categoryName: "Trí Tuệ Xử Thế",
    categoryColor: "amber",
    story: "Thời Tam Quốc, Tào Tháo dẫn quân đi hành quân giữa trưa hè nắng gắt. Binh lính khát khô cổ họng, không tìm thấy nguồn nước và sắp kiệt sức. Tào Tháo bèn rút roi ngựa chỉ về phía trước nói: 'Phía trước có một rừng mơ sai trĩu quả, quả mơ vừa to vừa chua ngọt, ăn vào đỡ khát lắm!'. Quân sĩ nghe nhắc đến quả mơ chua liền tự động ứa nước miếng trong miệng, nhờ đó lấy lại tinh thần đi tiếp đến nguồn nước thật.",
    lesson: "Liệu pháp tâm lý và niềm hy vọng có sức mạnh to lớn giúp con người vượt qua nghịch cảnh cùng cực.",
    example: {
      hanzi: "看着美食节目里的烤肉，我只能吃着泡面望梅止渴了。",
      pinyin: "Kànzhe měishí jiémù lǐ de kǎoròu, wǒ zhǐ néng chīzhe pàomiàn wàng méi zhǐ kě le.",
      vi: "Nhìn món thịt nướng thơm lừng trên tivi, tôi đành ăn bát mì tôm mà tự an ủi cho đỡ thèm."
    }
  },
  {
    id: "chengyu_24",
    chengyu: "愚公移山",
    pinyin: "yú gōng yí shān",
    hanviet: "Ngu Công Di Sơn",
    literal: "Cụ già Ngu Công dời chuyển hai ngọn núi",
    figurative: "Tinh thần bất khuất, kiên định dời non lấp bể, vượt qua mọi trở lực gian khó để hoàn thành đại nghiệp.",
    category: "perseverance",
    categoryName: "Ý Chí & Kiên Trì",
    categoryColor: "blue",
    story: "Trong 'Liệt Tử', cụ Ngu Công 90 tuổi quyết tâm đào phẳng hai ngọn núi Thái Hành và Vương Ốc chắn trước cửa nhà. Trí Bác cười chê cụ lẩm cẩm, Ngu Công khẳng khái: 'Ta chết còn có con, con sinh cháu, con cháu đời đời vô tận, núi không cao thêm lo gì không san phẳng'. Cảm phục ý chí ấy, Ngọc Hoàng đã phái thần tướng dời hai ngọn núi đi nơi khác.",
    lesson: "Không có ngọn núi nào cao hơn ý chí con người. Bền gan vững chí thì dẫu gian nan đến mấy cũng thành công rực rỡ.",
    example: {
      hanzi: "我们要发扬愚公移山的精神，攻坚克难，坚决打赢这场技术攻关战。",
      pinyin: "Wǒmen yào fāyáng Yú Gōng yí shān de jīngshén, gōng jiān kè nán, jiānjué dǎ yíng zhè chǎng jìshù gōngguān zhàn.",
      vi: "Chúng ta cần phát huy tinh thần Ngu Công dời núi, vượt mọi gian khó để giành thắng lợi trong chiến dịch công nghệ này."
    }
  }
];

const allChengyu = [...current, ...newChengyu];
fs.writeFileSync(existingPath, JSON.stringify(allChengyu, null, 2), 'utf8');
console.log(`Đã xuất sắc nâng cấp Kho Tàng Thành Ngữ lên ${allChengyu.length} Điển Tích Kinh Điển tại ${existingPath}`);
