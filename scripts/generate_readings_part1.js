const { tokenizeParagraph, addWord } = require('./reading_tokenizer_helper');

// Supplemental words for part 1
const p1Lexicon = [
  { hanzi: "花花", pinyin: "Huāhua", vi: "Hoa Hoa (tên mèo)" },
  { hanzi: "油条", pinyin: "yóutiáo", vi: "quẩy rán" },
  { hanzi: "豆浆", pinyin: "dòujiāng", vi: "sữa đậu nành" },
  { hanzi: "扫码", pinyin: "sǎomǎ", vi: "quét mã QR" },
  { hanzi: "斤", pinyin: "jīn", vi: "cân (nửa ký, 500g)" },
  { hanzi: "甜", pinyin: "tián", vi: "ngọt ngào" },
  { hanzi: "滑冰", pinyin: "huábīng", vi: "trượt băng" },
  { hanzi: "堆雪人", pinyin: "duī xuěrén", vi: "đắp người tuyết" },
  { hanzi: "馅儿", pinyin: "xiànr", vi: "nhân bánh, nhân sủi cảo" },
  { hanzi: "包饺子", pinyin: "bāo jiǎozǐ", vi: "gói sủi cảo" },
  { hanzi: "香喷喷", pinyin: "xiāngpēnpēn", vi: "thơm phức" },
  { hanzi: "借书", pinyin: "jiè shū", vi: "mượn sách" },
  { hanzi: "还书", pinyin: "huán shū", vi: "trả sách" },
  { hanzi: "安静", pinyin: "ānjìng", vi: "yên tĩnh, thanh tịnh" },
  { hanzi: "豆豆", pinyin: "Dòudou", vi: "Đậu Đậu (tên cún)" },
  { hanzi: "摇尾巴", pinyin: "yáo wěiba", vi: "vẫy đuôi" },
  { hanzi: "硬币", pinyin: "yìngbì", vi: "đồng tiền xu" },
  { hanzi: "窗台", pinyin: "chuāngtái", vi: "bậu cửa sổ" },
  { hanzi: "平稳", pinyin: "píngwěn", vi: "vững vàng, êm ái" },
  { hanzi: "高铁", pinyin: "gāotiě", vi: "tàu cao tốc" }
];
p1Lexicon.forEach(item => addWord(item.hanzi, item.pinyin, item.vi));

const readingsPart1 = [
  // 1. 我的家与我的猫
  {
    id: "reading_01",
    title: "我的家与我的猫",
    pinyin: "Wǒ De Jiā Yǔ Wǒ De Māo",
    hanviet: "Ngã Đích Gia Dữ Ngã Đích Miêu (Gia Đình Tôi Và Chú Mèo Của Tôi)",
    level: "HSK 1",
    category: "life",
    categoryName: "Đời Sống Thường Nhật",
    source: "Hán Ngữ Nhập Môn HSK 1",
    summary: "Một câu chuyện ấm áp về cuộc sống gia đình ba người và chú mèo nhỏ的花花. Qua những câu chữ đơn giản, bài viết mang lại cảm giác bình yên và tình cảm yêu thương trong ngôi nhà nhỏ.",
    vocab: [
      { hanzi: "家", pinyin: "jiā", vi: "nhà, gia đình" },
      { hanzi: "猫", pinyin: "māo", vi: "con mèo" },
      { hanzi: "可爱", pinyin: "kě'ài", vi: "đáng yêu, dễ thương" },
      { hanzi: "喜欢", pinyin: "xǐhuan", vi: "thích, yêu thích" },
      { hanzi: "吃鱼", pinyin: "chī yú", vi: "ăn cá" },
      { hanzi: "快乐", pinyin: "kuàilè", vi: "vui vẻ, hạnh phúc" }
    ],
    paragraphsRaw: [
      {
        cn: "我家有三口人：爸爸、妈妈和我。我们住在一座漂亮的小房子里。我们家还有一只白色的小猫，它的名字叫“花花”。",
        vi: "Nhà tôi có ba người: bố, mẹ và tôi. Chúng tôi sống trong một ngôi nhà nhỏ xinh đẹp. Nhà chúng tôi còn có một chú mèo nhỏ màu trắng, tên của nó là 'Hoa Hoa'."
      },
      {
        cn: "花花非常可爱，有一双大眼睛和长长的尾巴。它最喜欢吃鱼，也喜欢在阳光下睡觉。每天我放学回家，它都会跑到门口迎接我。有它的陪伴，我们的家更加快乐温暧。",
        vi: "Hoa Hoa vô cùng đáng yêu, có một đôi mắt to tròn và chiếc đuôi dài. Nó thích ăn cá nhất, và cũng thích ngủ dưới ánh nắng mặt trời. Mỗi ngày khi tôi tan học về nhà, nó đều chạy ra cửa đón tôi. Có sự bầu bạn của nó, mái ấm của chúng tôi càng thêm vui vẻ và ấm áp."
      }
    ],
    moral: "Hạnh phúc đích thực không nằm ở những điều xa hoa, mà bắt đầu từ mái ấm bình dị và sự yêu thương gắn kết giữa các thành viên cùng vật nuôi trong gia đình.",
    quiz: {
      question: "“花花”是一只什么动物，它最喜欢做什么？",
      options: [
        "A. 一只小狗，喜欢跑步",
        "B. 一只白色小猫，最喜欢吃鱼和在阳光下睡觉",
        "C. 一只小鸟，喜欢唱歌",
        "D. 一只小兔子，喜欢吃胡萝卜"
      ],
      answer: 1,
      explanation: "Trong đoạn văn nêu rõ: '我们家还有一只白色的小猫，它的名字叫花花... 它最喜欢吃鱼，也喜欢在阳光下睡觉' (B là đáp án chính xác)."
    }
  },

  // 2. 北京的一天：从一杯豆浆开始
  {
    id: "reading_02",
    title: "北京的一天：从一杯豆浆开始",
    pinyin: "Běijīng De Yì Tiān: Cóng Yì Bēi Dòujiāng Kāishǐ",
    hanviet: "Bắc Kinh Đích Nhất Thiên: Tòng Nhất Bôi Đậu Tương Khai Thủy (Một Ngày Ở Bắc Kinh: Bắt Đầu Từ Cốc Sữa Đậu Nành)",
    level: "HSK 1",
    category: "life",
    categoryName: "Đời Sống Thường Nhật",
    source: "Nhật Ký Du Học Sinh Bắc Kinh",
    summary: "Nhịp sống buổi sáng trong lành tại thủ đô Bắc Kinh qua góc nhìn bình dị: thức dậy lúc 7 giờ sáng, thưởng thức bữa sáng truyền thống với bánh bao quẩy nóng và cốc sữa đậu nành thơm bùi.",
    vocab: [
      { hanzi: "早上", pinyin: "zǎoshang", vi: "buổi sáng" },
      { hanzi: "豆浆", pinyin: "dòujiāng", vi: "sữa đậu nành" },
      { hanzi: "包子", pinyin: "bāozi", vi: "bánh bao" },
      { hanzi: "地铁", pinyin: "dìtiě", vi: "tàu điện ngầm" },
      { hanzi: "上班", pinyin: "shàngbān", vi: "đi làm" },
      { hanzi: "开始", pinyin: "kāishǐ", vi: "bắt đầu" }
    ],
    paragraphsRaw: [
      {
        cn: "北京的早晨很热闹。早上七点，街道上的小吃店就开门了。空气中飘着热包子和炸油条的香味。",
        vi: "Buổi sáng ở Bắc Kinh rất nhộn nhịp. Bảy giờ sáng, các quán ăn vặt trên phố đã mở cửa. Trong không khí thoang thoảng mùi thơm của bánh bao nóng và quẩy rán giòn."
      },
      {
        cn: "我喜欢买一杯热豆浆和两个肉包子。一边吃早餐，一边看着路人匆忙走向地铁站。一杯温暖的豆浆，开启了美好而充实的一天。",
        vi: "Tôi thích mua một cốc sữa đậu nành nóng và hai chiếc bánh bao thịt. Vừa ăn sáng, vừa ngắm nhìn người đi đường vội vã rảo bước về phía ga tàu điện ngầm. Một cốc sữa đậu nành ấm áp đã mở ra một ngày tươi đẹp và tràn đầy năng lượng."
      }
    ],
    moral: "Bắt đầu ngày mới bằng một bữa ăn sáng ấm áp và lòng biết ơn giúp ta tràn đầy năng lượng tích cực trước mọi thử thách trong công việc và học tập.",
    quiz: {
      question: "作者北京的一天通常从什么早餐开始？",
      options: [
        "A. 一碗热面条和可乐",
        "B. 面包与咖啡",
        "C. 一杯热豆浆和两个肉包子",
        "D. 牛奶和鸡蛋"
      ],
      answer: 2,
      explanation: "Trong bài viết tác giả chia sẻ: '我喜欢买一杯热豆浆和两个肉包子... 开启了美好而充实的一天' (Đáp án C)."
    }
  },

  // 3. 在水果店买苹果
  {
    id: "reading_03",
    title: "在水果店买苹果",
    pinyin: "Zài Shuǐguǒdiàn Mǎi Píngguǒ",
    hanviet: "Tại Thủy Quả Điếm Mãi Bình Quả (Đi Tiệm Hoa Quả Mua Táo)",
    level: "HSK 1 - 2",
    category: "life",
    categoryName: "Đời Sống Thường Nhật",
    source: "Hán Ngữ Giao Tiếp Ứng Dụng",
    summary: "Tình huống giao tiếp thực tế sinh động tại một tiệm trái cây Trung Quốc: hỏi giá cả một cân, lựa quả ngon, mặc cả thân thiện và thanh toán tiện lợi bằng cách quét mã QR WeChat/Alipay.",
    vocab: [
      { hanzi: "水果", pinyin: "shuǐguǒ", vi: "trái cây, hoa quả" },
      { hanzi: "苹果", pinyin: "píngguǒ", vi: "quả táo" },
      { hanzi: "多少钱", pinyin: "duōshao qián", vi: "bao nhiêu tiền" },
      { hanzi: "斤", pinyin: "jīn", vi: "cân (nửa ký, 500g)" },
      { hanzi: "新鲜", pinyin: "xīnxiān", vi: "tươi mới, tươi ngon" },
      { hanzi: "扫码", pinyin: "sǎomǎ", vi: "quét mã thanh toán" }
    ],
    paragraphsRaw: [
      {
        cn: "下午，我去学校对面的水果店买水果。店里有红红的苹果、黄黄的香蕉，还有大大的西瓜，看起来都很新鲜。",
        vi: "Buổi chiều, tôi đến cửa hàng hoa quả đối diện trường để mua trái cây. Trong tiệm có những quả táo đỏ au, chuối vàng ươm và dưa hấu to tròn, trông đều rất tươi ngon."
      },
      {
        cn: "我问老板：“苹果一斤多少钱？” 老板笑着说：“红苹果五块钱一斤，很甜！” 我买了三斤，然后拿出手机扫码付款。买水果的过程简单又开心。",
        vi: "Tôi hỏi ông chủ: 'Táo bao nhiêu tiền một cân ạ?' Ông chủ tươi cười đáp: 'Táo đỏ năm đồng một cân, ngọt lắm!' Tôi mua ba cân, sau đó lấy điện thoại ra quét mã thanh toán. Quá trình mua trái cây vừa nhanh gọn vừa vui vẻ."
      }
    ],
    moral: "Học ngoại ngữ qua những hoạt động thực tế thường nhật như mua sắm, hỏi giá, giao lưu với người bản địa là con đường nhanh nhất để tự tin giao tiếp.",
    quiz: {
      question: "红苹果多少钱一斤？作者买了多少斤？",
      options: [
        "A. 三块钱一斤，买了两斤",
        "B. 五块钱一斤，买了三斤",
        "C. 十块钱一斤，买了一斤",
        "D. 六块钱一斤，买了四斤"
      ],
      answer: 1,
      explanation: "Đoạn 2 nêu rõ: '红苹果五块钱一斤... 我买了三斤' (5 tệ/cân, mua 3 cân -> B là đáp án chính xác)."
    }
  },

  // 4. 春夏秋冬：四季的风景
  {
    id: "reading_04",
    title: "春夏秋冬：四季的风景",
    pinyin: "Chūn Xià Qiū Dōng: Sìjì De Fēngjǐng",
    hanviet: "Xuân Hạ Thu Đông: Tứ Quý Đích Phong Cảnh (Xuân Hạ Thu Đông: Phong Cảnh Bốn Mùa)",
    level: "HSK 1 - 2",
    category: "life",
    categoryName: "Đời Sống Thường Nhật",
    source: "Văn Tuyển Tiếng Hán Cơ Bản",
    summary: "Bức tranh bốn mùa luân chuyển với những nét đặc trưng thi vị: hoa nở mùa xuân, tắm biển mùa hè, lá phong vàng mùa thu và tuyết trắng tinh khôi mùa đông.",
    vocab: [
      { hanzi: "春天", pinyin: "chūntiān", vi: "mùa xuân" },
      { hanzi: "夏天", pinyin: "xiàtiān", vi: "mùa hè" },
      { hanzi: "秋天", pinyin: "qiūtiān", vi: "mùa thu" },
      { hanzi: "冬天", pinyin: "dōngtiān", vi: "mùa đông" },
      { hanzi: "天气", pinyin: "tiānqì", vi: "thời tiết" },
      { hanzi: "风景", pinyin: "fēngjǐng", vi: "phong cảnh" }
    ],
    paragraphsRaw: [
      {
        cn: "一年有四个季节：春、夏、秋、冬。春天天气变暖，公园里的花儿都开了，树木吐出绿芽。夏天天气炎热，人们喜欢去海边游泳，吃甜甜的冰淇淋。",
        vi: "Một năm có bốn mùa: xuân, hạ, thu, đông. Mùa xuân tiết trời ấm dần lên, hoa trong công viên đều đua nhau nở rộ, cây cối đâm chồi nảy lộc xanh tươi. Mùa hè trời nóng bức, mọi người thích ra biển bơi lội và thưởng thức những cây kem ngọt mát."
      },
      {
        cn: "秋天是收获的季节，树叶变成了金黄色，微风吹来十分凉爽。冬天常常下雪，大地穿上了白色的衣服，孩子们在雪地里快乐地堆雪人。每个季节都有它独特的美丽。",
        vi: "Mùa thu là mùa của gặt hái, lá cây chuyển sang sắc vàng óng ả, gió nhẹ thổi qua mát mẻ vô cùng. Mùa đông thường có tuyết rơi, mặt đất như khoác lên chiếc áo trắng tinh khôi, trẻ con vui sướng đắp người tuyết trên sân. Mỗi mùa đều mang một vẻ đẹp diệu kỳ riêng biệt."
      }
    ],
    moral: "Thiên nhiên luôn có nhịp điệu hoàn hảo. Biết trân trọng từng khoảnh khắc của hiện tại chính là bí quyết để tâm hồn luôn an nhiên giữa bốn mùa biến đổi.",
    quiz: {
      question: "根据文章，冬天孩子们喜欢在雪地里做什么？",
      options: [
        "A. 游泳吃冰淇淋",
        "B. 爬山看红叶",
        "C. 快乐地堆雪人",
        "D. 在公园赏花"
      ],
      answer: 2,
      explanation: "Đoạn cuối viết: '孩子们在雪地里快乐地堆雪人' -> C là đáp án đúng."
    }
  },

  // 5. 我和中国朋友包饺子
  {
    id: "reading_05",
    title: "我和中国朋友包饺子",
    pinyin: "Wǒ Hé Zhōngguó Péngyou Bāo Jiǎozǐ",
    hanviet: "Ngã Hòa Trung Quốc Bằng Hữu Bao Kiểu Tử (Tôi Và Bạn Trung Quốc Gói Sủi Cảo)",
    level: "HSK 2",
    category: "life",
    categoryName: "Đời Sống Thường Nhật",
    source: "Văn Hóa Ẩm Thực Trung Hoa",
    summary: "Một trải nghiệm văn hóa ẩm thực ấm cúng vào ngày cuối tuần: du học sinh cùng gia đình bạn Trung Quốc cùng nhau nhào bột, làm nhân và gói những chiếc sủi cảo hình vành trăng khuyết đậm đà hương vị truyền thống.",
    vocab: [
      { hanzi: "饺子", pinyin: "jiǎozǐ", vi: "sủi cảo, bánh chẻo" },
      { hanzi: "朋友", pinyin: "péngyou", vi: "bạn bè" },
      { hanzi: "厨房", pinyin: "chúfáng", vi: "nhà bếp" },
      { hanzi: "帮助", pinyin: "bāngzhù", vi: "giúp đỡ" },
      { hanzi: "传统", pinyin: "chuántǒng", vi: "truyền thống" },
      { hanzi: "好吃", pinyin: "hǎochī", vi: "ngon miệng" }
    ],
    paragraphsRaw: [
      {
        cn: "上个星期天，中国朋友李明邀请我去他家做客。我们打算一起在厨房包饺子。李明的妈妈准备好了牛肉和大葱的馅儿，还有圆圆的饺子皮。",
        vi: "Chủ nhật tuần trước, bạn Trung Quốc Lý Minh đã mời tôi tới nhà chơi. Chúng tôi dự định cùng nhau vào bếp gói sủi cảo. Mẹ của Lý Minh đã chuẩn bị sẵn nhân thịt bò hành hoa và những vỏ sủi cảo tròn xoe."
      },
      {
        cn: "一开始我包的饺子不太好看，形状扁扁的。李明耐心地教我怎么捏紧饺子边缘。最后，热气腾腾的饺子煮好了，大家坐在一起品尝，味道香极了！这不仅是一顿美食，更是一份深厚的友谊。",
        vi: "Mới đầu sủi cảo tôi gói trông không được đẹp mắt lắm, hình dáng bẹp dí. Lý Minh đã kiên nhẫn chỉ tôi cách nắn chặt mép sủi cảo. Cuối cùng, nồi sủi cảo bốc khói nghi ngút đã chín, mọi người quây quần cùng nhau thưởng thức, hương vị thơm ngon tuyệt đỉnh! Đây không chỉ là một bữa ăn ngon, mà còn là tình bạn thắm thiết."
      }
    ],
    moral: "Ẩm thực truyền thống chính là nhịp cầu tuyệt vời nhất gắn kết con người, thắt chặt tình bạn xuyên biên giới và lưu giữ hơi ấm tình thân.",
    quiz: {
      question: "李明的妈妈准备了什么馅儿的饺子？",
      options: [
        "A. 猪肉白菜馅儿",
        "B. 鸡蛋韭菜馅儿",
        "C. 牛肉和大葱的馅儿",
        "D. 鲜虾三鲜馅儿"
      ],
      answer: 2,
      explanation: "Trong bài viết: '李明的妈妈准备好了牛肉和大葱的馅儿' (Nhân thịt bò và hành boa-rô -> C là đáp án đúng)."
    }
  },

  // 6. 图书馆里的一下午
  {
    id: "reading_06",
    title: "图书馆里的一下午",
    pinyin: "Túshūguǎn Lǐ De Yí Xiàwǔ",
    hanviet: "Đồ Thư Quán Lý Đích Nhất Hạ Ngọ (Một Buổi Chiều Trong Thư Viện)",
    level: "HSK 2",
    category: "life",
    categoryName: "Đời Sống Thường Nhật",
    source: "Không Gian Tri Thức & Tự Học",
    summary: "Cảm giác bình an và tĩnh lặng khi đắm chìm vào những trang sách tại thư viện trường đại học vào một buổi chiều râm mát, giúp xoa dịu tâm hồn và tiếp nạp tri thức mới.",
    vocab: [
      { hanzi: "图书馆", pinyin: "túshūguǎn", vi: "thư viện" },
      { hanzi: "借书", pinyin: "jiè shū", vi: "mượn sách" },
      { hanzi: "安静", pinyin: "ānjìng", vi: "yên tĩnh" },
      { hanzi: "认真", pinyin: "rènzhēn", vi: "chăm chỉ, nghiêm túc" },
      { hanzi: "知识", pinyin: "zhīshi", vi: "tri thức, kiến thức" },
      { hanzi: "充实", pinyin: "chōngshí", vi: "phong phú, trọn vẹn" }
    ],
    paragraphsRaw: [
      {
        cn: "周六下午，我喜欢去大学的图书馆看书。这里的环境非常安静，窗外有绿树和微风，阳光透过大玻璃窗温柔地照在地板上。",
        vi: "Chiều thứ bảy, tôi thích đến thư viện trường đại học đọc sách. Môi trường nơi đây vô cùng yên tĩnh, ngoài cửa sổ có hàng cây xanh và làn gió nhẹ, ánh nắng xuyên qua ô cửa kính lớn dịu dàng rọi xuống sàn nhà."
      },
      {
        cn: "同学们都在认真地阅读或写作业，没有人高声说话。我借了一本中国寓言故事书，一边查字典一边仔细读。一下午的时间悄悄过去了，心里感到特别充实和满足。",
        vi: "Các bạn học sinh đều đang chăm chú đọc sách hoặc làm bài tập, không một ai nói chuyện to tiếng. Tôi đã mượn một cuốn truyện ngụ ngôn Trung Quốc, vừa tra từ điển vừa đọc kỹ càng. Thời gian một buổi chiều lặng lẽ trôi qua, trong lòng cảm thấy vô cùng phong phú và mãn nguyện."
      }
    ],
    moral: "Sự yên lặng là mảnh đất màu mỡ nuôi dưỡng chiều sâu tư duy. Đọc sách không chỉ mở rộng kiến thức mà còn giúp tâm hồn tìm về chốn bình yên tĩnh tại.",
    quiz: {
      question: "作者在图书馆借了一本什么书？",
      options: [
        "A. 一本现代科幻小说",
        "B. 一本中国寓言故事书",
        "C. 一本英语语法书",
        "D. 一本经济学教材"
      ],
      answer: 1,
      explanation: "Trong bài viết: '我借了一本中国寓言故事书，一边查字典一边仔细读' (Truyện ngụ ngôn Trung Quốc -> B là đáp án chính xác)."
    }
  },

  // 7. 给远方妈妈的一封信
  {
    id: "reading_07",
    title: "给远方妈妈的一封信",
    pinyin: "Gěi Yuǎnfāng Māmā De Yì Fēng Xìn",
    hanviet: "Kỷ Viễn Phương Mụ Mụ Đích Nhất Phong Tín (Bức Thư Gửi Mẹ Nơi Xa)",
    level: "HSK 2",
    category: "inspiration",
    categoryName: "Chuyện Chữa Lành & Trưởng Thành",
    source: "Tâm Tình Du Học Sinh",
    summary: "Bức thư đầy cảm động của người con xa quê gửi về cho mẹ: kể về việc dần thích nghi với cuộc sống mới, tự nấu ăn, nỗ lực học tập và gửi gắm nỗi nhớ thương gia đình da diết.",
    vocab: [
      { hanzi: "信", pinyin: "xìn", vi: "bức thư, thư từ" },
      { hanzi: "想念", pinyin: "xiǎngniàn", vi: "nhớ nhung, thương nhớ" },
      { hanzi: "习惯", pinyin: "xíguàn", vi: "thói quen, quen thuộc" },
      { hanzi: "健康", pinyin: "jiànkāng", vi: "sức khỏe, khỏe mạnh" },
      { hanzi: "照顾", pinyin: "zhàogù", vi: "chăm sóc" },
      { hanzi: "放心", pinyin: "fàngxīn", vi: "yên tâm" }
    ],
    paragraphsRaw: [
      {
        cn: "亲爱的妈妈：您最近身体好吗？离开家已经三个月了，我在这里一切都很顺利。我已经适应了这里的气候和饮食，学会了自己做饭和洗衣服。",
        vi: "Mẹ kính yêu: Dạo này sức khỏe của mẹ có tốt không ạ? Con rời xa nhà đã được ba tháng rồi, mọi việc của con ở đây đều rất suôn sẻ. Con đã thích nghi được với khí hậu và đồ ăn nơi này, đã học được cách tự nấu cơm và giặt quần áo."
      },
      {
        cn: "虽然学习有时会有点累，但老师和同学们都非常友善，经常帮助我。每当我闻到饭菜香味，就会深深地想念您做的红烧肉。请您和爸爸多注意保重身体，不用为我担心！",
        vi: "Tuy việc học đôi lúc có chút mệt mỏi, nhưng thầy cô và bạn bè đều rất mực thân thiện, thường xuyên giúp đỡ con. Mỗi khi ngửi thấy mùi cơm canh thơm phức, con lại nhớ da diết món thịt kho tàu mẹ nấu. Mẹ và bố hãy nhớ giữ gìn sức khỏe nhé, không cần phải lo lắng cho con đâu ạ!"
      }
    ],
    moral: "Sự trưởng thành của một người bắt đầu từ ngày ta học cách sống tự lập, biết thấu hiểu nỗi vất vả và luôn hướng về công ơn sinh thành của cha mẹ.",
    quiz: {
      question: "作者闻到饭菜香味时，最想念妈妈做的什么菜？",
      options: [
        "A. 番茄炒鸡蛋",
        "B. 麻婆豆腐",
        "C. 红烧肉",
        "D. 清蒸鲈鱼"
      ],
      answer: 2,
      explanation: "Đoạn 2 nêu rõ: '每当我闻到饭菜香味，就会深深地想念您做的红烧肉' (Món thịt kho tàu -> C)."
    }
  },

  // 8. 小狗豆豆找朋友
  {
    id: "reading_08",
    title: "小狗豆豆找朋友",
    pinyin: "Xiǎogǒu Dòudou Zhǎo Péngyou",
    hanviet: "Tiểu Cẩu Đậu Đậu Trảo Bằng Hữu (Chú Cún Đậu Đậu Tìm Bạn)",
    level: "HSK 2",
    category: "inspiration",
    categoryName: "Chuyện Chữa Lành & Trưởng Thành",
    source: "Đồng Thoại Chữa Lành HSK",
    summary: "Câu chuyện ngụ ngôn đồng thoại ngắn gọn về chú cún con Đậu Đậu ban đầu nhút nhát, sau đó học được rằng chỉ cần mở lòng, biết mỉm cười và chia sẻ đồ chơi là sẽ kết được rất nhiều bạn tốt.",
    vocab: [
      { hanzi: "小狗", pinyin: "xiǎogǒu", vi: "chú cún con" },
      { hanzi: "害怕", pinyin: "hàipà", vi: "sợ hãi, e ngại" },
      { hanzi: "微笑", pinyin: "wēixiào", vi: "mỉm cười" },
      { hanzi: "分享", pinyin: "fēnxiǎng", vi: "chia sẻ" },
      { hanzi: "勇敢", pinyin: "yǒnggǎn", vi: "dũng cảm" },
      { hanzi: "快乐", pinyin: "kuàilè", vi: "vui sướng" }
    ],
    paragraphsRaw: [
      {
        cn: "小狗豆豆搬到了一个新社区。第一天来到公园时，看到其他小动物都在快乐地踢足球，豆豆感到非常害羞，只敢躲在大树后面偷偷看。",
        vi: "Chú cún Đậu Đậu dọn tới một khu phố mới. Ngày đầu tiên đến công viên, thấy các con thú nhỏ khác đều đang vui vẻ đá bóng, Đậu Đậu cảm thấy vô cùng e thẹn, chỉ dám nấp sau gốc cây to lén nhìn."
      },
      {
        cn: "妈妈对豆豆说：“去吧，只要你带着微笑，拿出心爱的飞盘和大家分享，他们一定会欢迎你的。” 豆豆勇敢地走过去，摇了摇尾巴，把飞盘递给小松鼠。果然，大家开心地接纳了它，豆豆度过了最美妙的一个下午。",
        vi: "Mẹ nói với Đậu Đậu: 'Đi đi con, chỉ cần con mang theo nụ cười, đem chiếc đĩa bay yêu quý ra chia sẻ cùng các bạn, họ nhất định sẽ hoan nghênh con.' Đậu Đậu dũng cảm bước tới, vẫy vẫy chiếc đuôi nhỏ và chuyền đĩa bay cho sóc con. Quả nhiên, mọi người đã vui vẻ đón nhận nó, Đậu Đậu đã trải qua một buổi chiều tuyệt vời nhất."
      }
    ],
    moral: "Sự chân thành và tinh thần sẻ chia là chiếc chìa khóa vạn năng giúp phá vỡ bức tường xa cách, mở lối cho những mối thâm giao chân thành.",
    quiz: {
      question: "豆豆用什么方法成功找到了新朋友？",
      options: [
        "A. 躲在树后不出来",
        "B. 带着微笑，勇敢分享心爱的飞盘",
        "C. 大声汪汪叫吓唬大家",
        "D. 抢走别人的足球"
      ],
      answer: 1,
      explanation: "Đoạn 2 cho thấy: '只要你带着微笑，拿出心爱的飞盘和大家分享... 豆豆勇敢地走过去' -> Đáp án B."
    }
  },

  // 9. 第一次坐中国高铁
  {
    id: "reading_09",
    title: "第一次坐中国高铁",
    pinyin: "Dì Yī Cì Zuò Zhōngguó Gāotiě",
    hanviet: "Đệ Nhất Thứ Tọa Trung Quốc Cao Thiết (Lần Đầu Tiên Đi Tàu Cao Tốc Trung Quốc)",
    level: "HSK 2",
    category: "life",
    categoryName: "Đời Sống Thường Nhật",
    source: "Du Ký Trải Nghiệm Trung Hoa",
    summary: "Chuyến trải nghiệm tàu cao tốc từ Bắc Kinh đi Thượng Hải với tốc độ 350 km/h: sự êm ái kỳ diệu khi dựng đồng xu trên bệ cửa sổ mà không hề đổ ngã, cùng phong cảnh thanh bình lướt nhanh ngoài cửa kính.",
    vocab: [
      { hanzi: "高铁", pinyin: "gāotiě", vi: "tàu cao tốc" },
      { hanzi: "速度", pinyin: "sùdù", vi: "tốc độ" },
      { hanzi: "干净", pinyin: "gānjìng", vi: "sạch sẽ" },
      { hanzi: "舒服", pinyin: "shūfu", vi: "thoải mái, dễ chịu" },
      { hanzi: "惊讶", pinyin: "jīngyà", vi: "kinh ngạc, ngạc nhiên" },
      { hanzi: "平稳", pinyin: "píngwěn", vi: "vững chãi, êm ru" }
    ],
    paragraphsRaw: [
      {
        cn: "今天是我第一次乘坐中国的高铁从北京去上海。车厢里宽敞明亮，座位非常舒适干净。列车开动时几乎听不到噪音，不知不觉车速就达到了每小时三百五十公里。",
        vi: "Hôm nay là lần đầu tiên tôi đi tàu cao tốc Trung Quốc từ Bắc Kinh đến Thượng Hải. Toa tàu rộng rãi sáng sủa, ghế ngồi vô cùng thoải mái và sạch sẽ. Khi tàu lăn bánh hầu như không nghe thấy tiếng ồn, chẳng hay biết từ lúc nào tốc độ tàu đã đạt tới 350 cây số một giờ."
      },
      {
        cn: "我听说高铁上可以立硬币，就拿出一枚硬币立在窗台上。令人惊讶的是，即使列车飞速奔驰，硬币竟然几分钟都没有倒下！窗外美丽的田野和城市快速后退，这次旅程真是既神奇又惬意。",
        vi: "Tôi nghe nói trên tàu cao tốc có thể dựng đứng đồng xu, liền lấy ra một đồng xu dựng trên bậu cửa sổ. Điều khiến tôi vô cùng kinh ngạc là ngay cả khi đoàn tàu đang lao nhanh vun vút, đồng xu thế mà mấy phút liền không hề ngã đổ! Bên ngoài cửa sổ, những cánh đồng xinh đẹp và đô thị hiện đại lướt nhanh về phía sau, chuyến đi này quả thực vừa kỳ diệu vừa thư thái."
      }
    ],
    moral: "Công nghệ hiện đại không chỉ rút ngắn khoảng cách địa lý mà còn mang đến cho con người những trải nghiệm an toàn, tiện nghi và mở rộng tầm mắt.",
    quiz: {
      question: "作者在高铁车窗台上做了什么有趣的实验？",
      options: [
        "A. 倒了一杯热茶看水有没有洒",
        "B. 拿出一枚硬币立在窗台上看是否会倒下",
        "C. 用尺子测量窗台长度",
        "D. 在窗台上画画"
      ],
      answer: 1,
      explanation: "Đoạn 2 nêu: '拿出一枚硬币立在窗台上... 硬币竟然几分钟都没有倒下' -> B là đáp án chính xác."
    }
  },

  // 10. 微笑是最美的语言 (Preserving Existing reading_cp_5 with its full detailed rich content!)
  {
    id: "reading_10",
    title: "微笑是最美的语言",
    pinyin: "Wēixiào Shì Zuì Měi De Yǔyán",
    hanviet: "Vi Tiếu Thị Tối Mỹ Đích Ngữ Ngôn (Nụ Cười Là Ngôn Ngữ Đẹp Nhất)",
    level: "HSK 2 - 3",
    category: "inspiration",
    categoryName: "Chuyện Chữa Lành & Trưởng Thành",
    source: "YouTube: Chinh phục tiếng Trung cùng Thơ",
    summary: "Một mẩu chuyện ngắn xúc động về sức mạnh diệu kỳ của nụ cười trong cuộc sống đô thị bận rộn: xóa tan sự cô đơn, làm ấm lòng người lạ và mang lại niềm vui lan tỏa.",
    vocab: [
      { hanzi: "微笑", pinyin: "wēixiào", vi: "mỉm cười, nụ cười" },
      { hanzi: "语言", pinyin: "yǔyán", vi: "ngôn ngữ, tiếng nói" },
      { hanzi: "疲惫", pinyin: "píbèi", vi: "mệt mỏi, kiệt sức" },
      { hanzi: "陌生人", pinyin: "mòshēngrén", vi: "người lạ" },
      { hanzi: "温暖", pinyin: "wēnnuǎn", vi: "ấm áp, sưởi ấm" },
      { hanzi: "传递", pinyin: "chuándì", vi: "truyền tải, lan tỏa" }
    ],
    paragraphsRaw: [
      {
        cn: "在繁忙的现代生活中，我们每天行色匆匆，脸上常常挂着疲惫和防备。然而，只需一个真诚的微笑，就能瞬间拉近两颗陌生心灵的距离。",
        vi: "Trong guồng quay hối hả của cuộc sống hiện đại, mỗi ngày chúng ta đều vội vã đi lại, trên gương mặt thường đượm nét mệt mỏi và đề phòng. Thế nhưng, chỉ cần một nụ cười chân thành cũng đủ để ngay tức khắc kéo gần khoảng cách giữa hai tâm hồn xa lạ."
      },
      {
        cn: "有一次在晚高峰的地铁站里，一位年轻姑娘不小心踩到了老爷爷的脚，姑娘连忙红着脸道歉。老爷爷不仅没有生气，反而慈祥地微笑着说：“没关系，年轻人下班辛苦了。”那一瞬间，整个车厢沉闷的气氛都变得温情脉脉。",
        vi: "Có một lần tại ga tàu điện ngầm vào giờ cao điểm tan tầm, một cô gái trẻ sơ ý giẫm phải chân của một cụ ông, cô vội đỏ bừng mặt xin lỗi. Cụ ông không những không hề tức giận, trái lại còn mỉm cười hiền từ đáp: 'Không sao đâu cháu, người trẻ đi làm về vất vả rồi.' Vào khoảnh khắc ấy, bầu không khí ngột ngạt của cả toa tàu dường như bỗng chốc trở nên ấm áp lạ kỳ."
      },
      {
        cn: "微笑不需要花钱，却能创造巨大的情感价值。它不仅治愈了别人，也点亮了自己。学会对生活微笑，生活自会回报你无尽的明媚阳光。",
        vi: "Nụ cười không tốn một xu, nhưng lại kiến tạo nên giá trị cảm xúc vô bờ bến. Nó không chỉ xoa dịu chữa lành cho người khác, mà còn thắp sáng chính tâm hồn bạn. Học cách mỉm cười với cuộc đời, cuộc đời ắt sẽ đền đáp cho bạn muôn ngàn ánh nắng rực rỡ."
      }
    ],
    moral: "Nụ cười là hộ chiếu cảm xúc thông hành khắp thế gian. Khi bạn dành cho thế giới một nụ cười nhân ái, thế giới cũng sẽ ôm lấy bạn bằng tất cả sự dịu dàng.",
    quiz: {
      question: "在晚高峰地铁站的故事中，老爷爷对待踩到他脚的年轻姑娘是什么态度？",
      options: [
        "A. 严厉批评她不看路",
        "B. 生气地要求赔礼道歉",
        "C. 慈祥地微笑着体谅年轻人下班辛苦",
        "D. 默默走开不说话"
      ],
      answer: 2,
      explanation: "Trong câu chuyện: '老爷爷不仅没有生气，反而慈祥地微笑着说：没关系，年轻人下班辛苦了' -> Đáp án C thể hiện trọn vẹn sự nhân từ và thông cảm."
    }
  }
];

// Process paragraphs to generate tokens
function buildPart1() {
  return readingsPart1.map(story => {
    const paragraphs = story.paragraphsRaw.map((p, pIdx) => {
      const tokens = tokenizeParagraph(p.cn);
      return {
        paragraphIndex: pIdx + 1,
        chineseText: p.cn,
        vietnameseText: p.vi,
        tokens: tokens
      };
    });
    delete story.paragraphsRaw;
    return {
      ...story,
      paragraphs
    };
  });
}

module.exports = buildPart1;
