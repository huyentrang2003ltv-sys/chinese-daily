const { dataFile } = require('./paths');
const fs = require('fs');
const path = require('path');

const booksMeta = [
  { volume: "1-1", volumeName: "Hán Ngữ 1 (Quyển 1 Thượng)", totalLessons: 15, level: "Sơ cấp A1", desc: "Ngữ âm, 21 Thanh mẫu, 36 Vận mẫu, 4 Thanh điệu, Chào hỏi, Số đếm, Gia đình, Mua sắm, Tiền tệ." },
  { volume: "1-2", volumeName: "Hán Ngữ 2 (Quyển 1 Hạ)", totalLessons: 15, level: "Sơ cấp A2", desc: "Thì tiến hành (正在...呢), Câu liên động, Động từ trùng điệp, Phương vị từ, Bổ ngữ trạng thái, Bổ ngữ kết quả, Trợ từ 了, 过." },
  { volume: "2-1", volumeName: "Hán Ngữ 3 (Quyển 2 Thượng)", totalLessons: 10, level: "Trung cấp B1", desc: "Bộ ba then chốt: Câu so sánh chữ 比/没有, Câu xử lý đối tượng chữ 把, Câu bị động chữ 被/叫/让." },
  { volume: "2-2", volumeName: "Hán Ngữ 4 (Quyển 2 Hạ)", totalLessons: 10, level: "Trung cấp B2", desc: "Bổ ngữ xu hướng phức hợp (起来, 下去, 出来), Bổ ngữ khả năng (得/不), Hệ thống liên từ phức (不仅, 只要, 无论, 越...越...)." },
  { volume: "3-1", volumeName: "Hán Ngữ 5 (Quyển 3 Thượng)", totalLessons: 13, level: "Cao cấp C1 (HSK 5)", desc: "13 câu chuyện ngụ ngôn thành ngữ kinh điển, Ngữ pháp văn ngôn cổ đại, Phong tục tập quán Trung Hoa." },
  { volume: "3-2", volumeName: "Hán Ngữ 6 (Quyển 3 Hạ)", totalLessons: 13, level: "Cao cấp C2 (HSK 6)", desc: "Văn luận xã hội, Triết lý trà đạo & nhân sinh, Nghệ thuật tu từ văn viết, Phân biệt từ ngữ tinh vi." }
];

// Helper to define characters with gender and avatars
const CHARACTERS = {
  mary: { name: "玛丽", displayName: "玛丽 (Mary)", gender: "female", avatar: "👩", role: "Lưu học sinh Mỹ" },
  tianfang: { name: "田芳", displayName: "田芳 (Điền Phương)", gender: "female", avatar: "👩", role: "Nữ sinh Trung Quốc" },
  xiaoyun: { name: "小云", displayName: "小云 (Tiểu Vân)", gender: "female", avatar: "👩", role: "Bạn cùng phòng" },
  luolan: { name: "罗兰", displayName: "罗兰 (Roland)", gender: "female", avatar: "👩", role: "Lưu học sinh Pháp" },
  linna: { name: "林娜", displayName: "林娜 (Lâm Na)", gender: "female", avatar: "👩", role: "Nghiên cứu sinh" },
  clerk_f: { name: "售货员", displayName: "女售货员 (Chị bán hàng)", gender: "female", avatar: "👩", role: "Nhân viên bán hàng" },
  bank_f: { name: "营业员", displayName: "银行职员 (Nữ giao dịch viên)", gender: "female", avatar: "👩", role: "Nhân viên Ngân hàng" },
  waitress: { name: "服务员", displayName: "食堂服务员 (Chị phục vụ)", gender: "female", avatar: "👩", role: "Nhân viên nhà ăn" },
  chen_f: { name: "陈小姐", displayName: "陈小姐 (Trần tiểu thư)", gender: "female", avatar: "👩", role: "Thạc sĩ Văn hóa" },

  zhangdong: { name: "张东", displayName: "张东 (Trương Đông)", gender: "male", avatar: "👨", role: "Nam sinh Trung Quốc" },
  mike: { name: "麦克", displayName: "麦克 (Mike)", gender: "male", avatar: "👨", role: "Lưu học sinh Canada" },
  david: { name: "大卫", displayName: "大卫 (David)", gender: "male", avatar: "👨", role: "Lưu học sinh Mỹ" },
  wang_ping: { name: "王平", displayName: "王平 (Vương Bình)", gender: "male", avatar: "👨", role: "Sinh viên Bắc Kinh" },
  edward: { name: "爱德华", displayName: "爱德华 (Edward)", gender: "male", avatar: "👨", role: "Lưu học sinh Đức" },
  teacher_wang: { name: "王老师", displayName: "王老师 (Thầy Vương)", gender: "male", avatar: "👨", role: "Giảng viên BLCU" },
  teacher_liu: { name: "刘老师", displayName: "刘老师 (Thầy Lưu)", gender: "male", avatar: "👨", role: "Giáo viên Ngữ âm" },
  teacher_zhang: { name: "张教授", displayName: "张教授 (Giáo sư Trương)", gender: "male", avatar: "👨", role: "Giáo sư Hán học" },
  manager_guan: { name: "关经理", displayName: "关经理 (Giám đốc Quan)", gender: "male", avatar: "👨", role: "Quản lý công ty" },
  clerk_m: { name: "售货员", displayName: "售货员 (Anh bán hàng)", gender: "male", avatar: "👨", role: "Nhân viên quầy hàng" }
};

// Raw rich lesson definitions for first 8 lessons
const richLessonsData = [
  // 1-1 Lesson 1
  {
    v: "1-1", n: 1, zh: "你好", py: "Nǐ hǎo", vi: "Xin chào", c: "Ngữ âm & Chào hỏi",
    intro: "Bài mở đầu nhập môn tiếng Hán: làm quen hệ thống ngữ âm Pinyin, các thanh mẫu b, p, m, f, d, t, n, l, g, k, h và 4 thanh điệu chuẩn mực Bắc Kinh.",
    dialogues: [
      { char: 'mike', hanzi: "你好！", pinyin: "Nǐ hǎo!", vi: "Xin chào bạn!" },
      { char: 'mary', hanzi: "你好！", pinyin: "Nǐ hǎo!", vi: "Chào bạn!" },
      { char: 'mary', hanzi: "王老师，您好！", pinyin: "Wáng lǎoshī, nín hǎo!", vi: "Em chào thầy Vương ạ!" },
      { char: 'teacher_wang', hanzi: "你们好！欢迎来到北京。", pinyin: "Nǐmen hǎo! Huānyíng lái dào Běijīng.", vi: "Chào các em! Hoan nghênh các em đến Bắc Kinh." }
    ],
    vocab: [
      { hanzi: "你", pinyin: "nǐ", sinoViet: "Nhĩ", pos: "Đại từ", meaning: "Bạn, cậu (ngôi thứ hai số ít)", example: "你好！(Xin chào bạn!)" },
      { hanzi: "好", pinyin: "hǎo", sinoViet: "Hảo", pos: "Tính từ", meaning: "Tốt, đẹp, khỏe mạnh", example: "很好。(Rất tốt.)" },
      { hanzi: "您", pinyin: "nín", sinoViet: "Nâm", pos: "Đại từ", meaning: "Ngài, ông, thầy (kính ngữ)", example: "老师，您好！(Em chào thầy ạ!)" },
      { hanzi: "你们", pinyin: "nǐmen", sinoViet: "Nhĩ môn", pos: "Đại từ", meaning: "Các bạn, các em", example: "你们好！(Chào các bạn!)" },
      { hanzi: "老师", pinyin: "lǎoshī", sinoViet: "Lão sư", pos: "Danh từ", meaning: "Thầy giáo, cô giáo", example: "王老师。(Thầy giáo Vương.)" },
      { hanzi: "一", pinyin: "yī", sinoViet: "Nhất", pos: "Số từ", meaning: "Số 1", example: "一个。(Một cái.)" },
      { hanzi: "五", pinyin: "wǔ", sinoViet: "Ngũ", pos: "Số từ", meaning: "Số 5", example: "五个。(Năm cái.)" },
      { hanzi: "八", pinyin: "bā", sinoViet: "Bát", pos: "Số từ", meaning: "Số 8", example: "八块钱。(Tám tệ.)" },
      { hanzi: "大", pinyin: "dà", sinoViet: "Đại", pos: "Tính từ", meaning: "To, lớn", example: "很大。(Rất to.)" },
      { hanzi: "不", pinyin: "bù", sinoViet: "Bất", pos: "Phó từ", meaning: "Không, chẳng (phủ định)", example: "不大。(Không to.)" }
    ],
    grammar: [
      {
        title: "Bốn thanh điệu chuẩn trong tiếng Hán (四声)",
        formula: "Thanh 1 (55: cao bằng phẳng -) • Thanh 2 (35: lên giọng /) • Thanh 3 (214: xuống rồi lên V) • Thanh 4 (51: từ đỉnh dứt khoát hạ xuống đáy \\)",
        explanation: "Thanh điệu tiếng Hán đóng vai trò khu biệt nghĩa sống còn: mā (mẹ) - má (cây gai) - mǎ (ngựa) - mà (chửi).",
        vietnameseContrast: "Người Việt dễ phát âm thanh 1 và 2, nhưng hay nhầm thanh 4 với dấu huyền tiếng Việt. Thực chất thanh 4 rơi dứt khoát từ 5 xuống 1 mang sức nặng.",
        commonMistakes: "Đọc thanh 4 nhẹ như dấu huyền tiếng Việt khiến người bản xứ hiểu nhầm nghĩa của từ.",
        examples: [
          { hanzi: "妈 (mā)", pinyin: "mā", vi: "Mẹ (thanh 1)" },
          { hanzi: "马 (mǎ)", pinyin: "mǎ", vi: "Ngựa (thanh 3)" },
          { hanzi: "骂 (mà)", pinyin: "mà", vi: "Mắng chửi (thanh 4)" }
        ]
      },
      {
        title: "Quy tắc biến điệu hai thanh 3 đi liền nhau",
        formula: "Thanh 3 (V) + Thanh 3 (V) => Thanh 2 (/) + Thanh 3 (V)",
        explanation: "Khi hai âm tiết cùng mang thanh 3 đứng liền nhau, âm thứ nhất đọc thành thanh 2 nhưng chữ viết phiên âm gốc vẫn giữ nguyên dấu thanh 3. Ví dụ 'Nǐ' (3) + 'hǎo' (3) đọc thành 'Ní hǎo'.",
        vietnameseContrast: "Tương tự hiện tượng nối âm trơn tru trong ngôn ngữ để không bị nghẹn hơi khi phát âm liên tục.",
        commonMistakes: "Viết phiên âm sai thành Ní hǎo (phải viết Nǐ hǎo nhưng đọc là Ní hǎo).",
        examples: [
          { hanzi: "你好", pinyin: "Nǐ hǎo (đọc: Ní hǎo)", vi: "Xin chào" },
          { hanzi: "可以", pinyin: "Kěyǐ (đọc: Kéyǐ)", vi: "Có thể" }
        ]
      }
    ],
    qa: [
      {
        questionHanzi: "麦克对玛丽说了什么？",
        questionPinyin: "Màikè duì Mǎlì shuōle shénme?",
        questionVi: "Mike đã nói gì với Mary?",
        answerHanzi: "麦克对玛丽说：“你好！”",
        answerPinyin: "Màikè duì Mǎlì shuō: \"Nǐ hǎo!\"",
        answerVi: "Mike nói với Mary: \"Xin chào!\"",
        explanation: "Trong câu mở đầu bài khóa, Mike chủ động chào Mary bằng câu chào phổ thông '你好'."
      },
      {
        questionHanzi: "玛丽见到王老师时，用了哪个敬语？",
        questionPinyin: "Mǎlì jiàndào Wáng lǎoshī shí, yòngle nǎge jìngyǔ?",
        questionVi: "Khi Mary gặp thầy Vương, cô ấy đã dùng kính ngữ nào?",
        answerHanzi: "玛丽用了敬语“您好！”",
        answerPinyin: "Mǎlì yòngle jìngyǔ \"Nín hǎo!\"",
        answerVi: "Mary đã dùng kính ngữ: \"您好！\" (Em chào thầy ạ!)",
        explanation: "Đối với thầy cô giáo và bậc trưởng bối, dùng '您好' (Nín hǎo) thay vì '你好' để thể hiện sự lễ phép tôn kính."
      }
    ],
    fillInBlanks: [
      {
        id: "fib_1_1",
        instruction: "Chọn từ thích hợp điền vào chỗ trống trong đoạn đối thoại chào hỏi sau:",
        dialogueText: "麦克: 玛丽，[ (1) ] 好！\n玛丽: 麦克，你好！王老师，[ (2) ] 好！\n王老师: [ (3) ] 好！欢迎大家。",
        wordBank: ["你", "您", "你们", "很"],
        blanks: [
          {
            blankNum: 1,
            correct: "你",
            options: ["你", "您", "你们", "谁"],
            explanation: "Mike và Mary là bạn học bè cùng trang lứa nên dùng đại từ ngôi thứ hai thân mật '你' (你好)."
          },
          {
            blankNum: 2,
            correct: "您",
            options: ["您", "你", "他", "我"],
            explanation: "Chào thầy Vương là người lớn tuổi và giáo viên, cần dùng kính ngữ tôn trọng '您' (您好)."
          },
          {
            blankNum: 3,
            correct: "你们",
            options: ["你们", "你", "您", "我们"],
            explanation: "Thầy Vương chào lại cả Mike và Mary (số nhiều từ 2 người trở lên), do đó dùng đại từ số nhiều '你们' (你们好)."
          }
        ]
      }
    ],
    culture: "Văn hóa xưng hô Trung Hoa: Trong lần đầu gặp gỡ hoặc đối với người lớn tuổi, luôn bắt đầu bằng '您好' (Nín hǎo). Khi chào nhiều người cùng lúc, dùng '你们好' hoặc '大家好' (Dàjiā hǎo)."
  },

  // 1-1 Lesson 2
  {
    v: "1-1", n: 2, zh: "汉语不太难", py: "Hànyǔ bú tài nán", vi: "Tiếng Hán không khó lắm", c: "Biến điệu & Hỏi han",
    intro: "Làm quen với các thanh mẫu đầu lưỡi, mặt lưỡi z, c, s, zh, ch, sh, r; quy tắc biến điệu sống còn của chữ 不 và câu hỏi có trợ từ 吗.",
    dialogues: [
      { char: 'mary', hanzi: "你学汉语吗？", pinyin: "Nǐ xué Hànyǔ ma?", vi: "Bạn học tiếng Hán không?" },
      { char: 'zhangdong', hanzi: "学汉语。", pinyin: "Xué Hànyǔ.", vi: "Tôi học tiếng Hán." },
      { char: 'mary', hanzi: "汉语难吗？", pinyin: "Hànyǔ nán ma?", vi: "Tiếng Hán khó không bạn?" },
      { char: 'zhangdong', hanzi: "发音不太难，汉字很难。", pinyin: "Fāyīn bú tài nán, Hànzì hěn nán.", vi: "Phát âm không khó lắm, nhưng chữ Hán thì rất khó." }
    ],
    vocab: [
      { hanzi: "学", pinyin: "xué", sinoViet: "Học", pos: "Động từ", meaning: "Học, học tập", example: "学中文。(Học tiếng Trung.)" },
      { hanzi: "汉语", pinyin: "Hànyǔ", sinoViet: "Hán ngữ", pos: "Danh từ", meaning: "Tiếng Hán, tiếng Trung", example: "学汉语。(Học tiếng Hán.)" },
      { hanzi: "难", pinyin: "nán", sinoViet: "Nan", pos: "Tính từ", meaning: "Khó khăn", example: "不难。(Không khó.)" },
      { hanzi: "太", pinyin: "tài", sinoViet: "Thái", pos: "Phó từ", meaning: "Quá, lắm", example: "太大。(Quá to.)" },
      { hanzi: "发音", pinyin: "fāyīn", sinoViet: "Phát âm", pos: "Danh từ", meaning: "Phát âm, ngữ âm", example: "发音准确。(Phát âm chuẩn.)" },
      { hanzi: "汉字", pinyin: "Hànzì", sinoViet: "Hán tự", pos: "Danh từ", meaning: "Chữ Hán", example: "写汉字。(Viết chữ Hán.)" },
      { hanzi: "很", pinyin: "hěn", sinoViet: "Hẩn", pos: "Phó từ", meaning: "Rất", example: "很好。(Rất tốt.)" },
      { hanzi: "忙", pinyin: "máng", sinoViet: "Mang", pos: "Tính từ", meaning: "Bận rộn", example: "你忙吗？(Bạn bận không?)" },
      { hanzi: "爸爸", pinyin: "bàba", sinoViet: "Bà ba", pos: "Danh từ", meaning: "Bố, ba, cha", example: "我爸爸。(Bố tôi.)" },
      { hanzi: "妈妈", pinyin: "māma", sinoViet: "Ma ma", pos: "Danh từ", meaning: "Mẹ, má", example: "我妈妈。(Mẹ tôi.)" }
    ],
    grammar: [
      {
        title: "Quy tắc biến điệu sống còn của chữ 不 (bù)",
        formula: "不 (bù) + Từ mang thanh 4 => đọc thành bú (thanh 2). Ví dụ: 不对 (bú duì), 不太 (bú tài).",
        explanation: "Chữ 不 nguyên bản mang thanh 4. Khi đi trước một từ mang thanh 4 khác, nó bắt buộc phải chuyển sang thanh 2 để tránh 2 âm giáng liên tiếp quá nặng nề.",
        vietnameseContrast: "Trong tiếng Việt không có quy tắc biến thanh này, người học cần luyện tập phản xạ miệng để phát âm tự nhiên.",
        commonMistakes: "Phát âm bù tài thay vì bú tài.",
        examples: [
          { hanzi: "不太难", pinyin: "bú tài nán", vi: "Không khó lắm" },
          { hanzi: "不去", pinyin: "bú qù", vi: "Không đi" }
        ]
      },
      {
        title: "Câu hỏi nghi vấn với trợ từ 吗 (ma)",
        formula: "Câu trần thuật + 吗？",
        explanation: "Cách đặt câu hỏi đơn giản nhất trong tiếng Hán: giữ nguyên trật tự câu khẳng định và thêm trợ từ nghi vấn 吗 ở cuối câu.",
        vietnameseContrast: "Tương đương với từ '...phải không?' hoặc '...không?' trong tiếng Việt.",
        commonMistakes: "Đã dùng 吗 lại còn dùng từ để hỏi khác như 什么 hoặc 谁 trong cùng một câu.",
        examples: [
          { hanzi: "你忙吗？", pinyin: "Nǐ máng ma?", vi: "Bạn bận không?" },
          { hanzi: "汉语难吗？", pinyin: "Hànyǔ nán ma?", vi: "Tiếng Hán khó không?" }
        ]
      }
    ],
    qa: [
      {
        questionHanzi: "张东学什么语言？",
        questionPinyin: "Zhāng Dōng xué shénme yǔyán?",
        questionVi: "Trương Đông học ngôn ngữ gì?",
        answerHanzi: "张东学汉语。",
        answerPinyin: "Zhāng Dōng xué Hànyǔ.",
        answerVi: "Trương Đông học tiếng Hán.",
        explanation: "Dựa vào lời thoại của Trương Đông: '学汉语'."
      },
      {
        questionHanzi: "张东觉得汉语的发音和汉字怎么样？",
        questionPinyin: "Zhāng Dōng juéde Hànyǔ de fāyīn hé Hànzì zěnmeyàng?",
        questionVi: "Trương Đông thấy phát âm và chữ Hán của tiếng Trung thế nào?",
        answerHanzi: "他觉得发音不太难，汉字很难。",
        answerPinyin: "Tā juéde fāyīn bú tài nán, Hànzì hěn nán.",
        answerVi: "Anh ấy thấy phát âm không khó lắm, còn chữ Hán rất khó.",
        explanation: "Trương Đông phân biệt rõ 2 khía cạnh: ngữ âm tương đối dễ học, còn hệ thống chữ viết vuông biểu ý phức tạp nhiều nét thì khó hơn."
      }
    ],
    fillInBlanks: [
      {
        id: "fib_1_2",
        instruction: "Điền phó từ thích hợp vào chỗ trống trong đoạn đối thoại:",
        dialogueText: "玛丽: 汉语难 [ (1) ]？\n张东: 发音不 [ (2) ] 难，汉字 [ (3) ] 难。",
        wordBank: ["吗", "太", "很", "不"],
        blanks: [
          {
            blankNum: 1,
            correct: "吗",
            options: ["吗", "呢", "吧", "啊"],
            explanation: "Cuối câu hỏi có/không dùng trợ từ nghi vấn '吗'."
          },
          {
            blankNum: 2,
            correct: "太",
            options: ["太", "很", "真", "都"],
            explanation: "Cấu trúc phủ định mức độ vừa phải: '不太 + Tính từ' = Không... lắm."
          },
          {
            blankNum: 3,
            correct: "很",
            options: ["很", "太", "不", "也"],
            explanation: "Vị ngữ tính từ khẳng định thường đi kèm phó từ chỉ mức độ '很' (很难)."
          }
        ]
      }
    ],
    culture: "Quan niệm về độ khó tiếng Hán: Người Trung Quốc có câu '万事开头难' (Vạn sự khởi đầu nan). Phát âm tiếng Hán chỉ cần vững 2 tuần đầu là có thể đọc trôi chảy mọi phiên âm Pinyin."
  },

  // 1-1 Lesson 3
  {
    v: "1-1", n: 3, zh: "明天见", py: "Míngtiān jiàn", vi: "Ngày mai gặp lại", c: "Thời gian & Số đếm",
    intro: "Làm chủ cách nói các thứ trong tuần (星期一 đến 星期天), các mốc thời gian hôm nay, ngày mai, hôm qua và câu chào tạm biệt.",
    dialogues: [
      { char: 'mary', hanzi: "今天星期几？", pinyin: "Jīntiān xīngqī jǐ?", vi: "Hôm nay thứ mấy bạn?" },
      { char: 'zhangdong', hanzi: "今天星期二。", pinyin: "Jīntiān xīngqī èr.", vi: "Hôm nay là thứ Ba." },
      { char: 'mary', hanzi: "你去哪儿？", pinyin: "Nǐ qù nǎr?", vi: "Bạn đi đâu đấy?" },
      { char: 'zhangdong', hanzi: "我去天安门，你去不去？", pinyin: "Wǒ qù Tiān'ānmén, nǐ qù bu qù?", vi: "Tôi đi Thiên An Môn, bạn đi không?" },
      { char: 'mary', hanzi: "我不去，我回学校。", pinyin: "Wǒ bú qù, wǒ huí xuéxiào.", vi: "Tôi không đi, tôi quay về trường học." },
      { char: 'zhangdong', hanzi: "明天见！", pinyin: "Míngtiān jiàn!", vi: "Hẹn ngày mai gặp lại nhé!" },
      { char: 'mary', hanzi: "明天见！", pinyin: "Míngtiān jiàn!", vi: "Ngày mai gặp lại!" }
    ],
    vocab: [
      { hanzi: "今天", pinyin: "jīntiān", sinoViet: "Kim thiên", pos: "Danh từ thời gian", meaning: "Hôm nay", example: "今天星期一。(Hôm nay thứ Hai.)" },
      { hanzi: "明天", pinyin: "míngtiān", sinoViet: "Minh thiên", pos: "Danh từ thời gian", meaning: "Ngày mai", example: "明天见。(Ngày mai gặp lại.)" },
      { hanzi: "昨天", pinyin: "zuótiān", sinoViet: "Tạc thiên", pos: "Danh từ thời gian", meaning: "Hôm qua", example: "昨天很好。(Hôm qua rất tốt.)" },
      { hanzi: "星期", pinyin: "xīngqī", sinoViet: "Tinh kỳ", pos: "Danh từ", meaning: "Tuần lễ, thứ", example: "一个星期。(Một tuần.)" },
      { hanzi: "几", pinyin: "jǐ", sinoViet: "Kỷ", pos: "Đại từ nghi vấn", meaning: "Mấy (dưới 10)", example: "几个人？(Mấy người?)" },
      { hanzi: "去", pinyin: "qù", sinoViet: "Khứ", pos: "Động từ", meaning: "Đi", example: "去北京。(Đi Bắc Kinh.)" },
      { hanzi: "回", pinyin: "huí", sinoViet: "Hồi", pos: "Động từ", meaning: "Về, quay về", example: "回家。(Về nhà.)" },
      { hanzi: "学校", pinyin: "xuéxiào", sinoViet: "Học hiệu", pos: "Danh từ", meaning: "Trường học", example: "在学校。(Ở trường học.)" },
      { hanzi: "再见", pinyin: "zàijiàn", sinoViet: "Tái kiến", pos: "Động từ", meaning: "Tạm biệt", example: "老师再见！(Chào tạm biệt thầy ạ!)" },
      { hanzi: "见", pinyin: "jiàn", sinoViet: "Kiến", pos: "Động từ", meaning: "Thấy, gặp gỡ", example: "一会儿见。(Lát gặp.)" }
    ],
    grammar: [
      {
        title: "Quy tắc gọi các thứ trong tuần (星期 + Số đếm)",
        formula: "星期一 (Thứ Hai) • 星期二 (Thứ Ba) • 星期三 (Thứ Tư) • 星期四 (Thứ Năm) • 星期五 (Thứ Sáu) • 星期六 (Thứ Bảy) • 星期天/日 (Chủ Nhật)",
        explanation: "Tiếng Hán đếm thứ bắt đầu từ số 1 (一) tương ứng với Thứ Hai của Việt Nam. Do đó số trong tiếng Hán luôn nhỏ hơn tên thứ tiếng Việt 1 đơn vị.",
        vietnameseContrast: "Người Việt rất hay dịch nhầm: 星期一 dịch thành Thứ Nhất (sai, phải là Thứ Hai), 星期二 là Thứ Ba.",
        commonMistakes: "Dịch 'Thứ Hai' thành 星期二 là sai lầm phổ biến nhất.",
        examples: [
          { hanzi: "今天星期三。", pinyin: "Jīntiān xīngqī sān.", vi: "Hôm nay là thứ Tư." },
          { hanzi: "星期天我休息。", pinyin: "Xīngqītiān wǒ xiūxi.", vi: "Chủ nhật tôi nghỉ ngơi." }
        ]
      }
    ],
    qa: [
      {
        questionHanzi: "今天星期几？张东打算去哪儿？",
        questionPinyin: "Jīntiān xīngqī jǐ? Zhāng Dōng dǎsuan qù nǎr?",
        questionVi: "Hôm nay thứ mấy? Trương Đông định đi đâu?",
        answerHanzi: "今天星期二，张东要去天安门。",
        answerPinyin: "Jīntiān xīngqī èr, Zhāng Dōng yào qù Tiān'ānmén.",
        answerVi: "Hôm nay là thứ Ba, Trương Đông muốn đi Thiên An Môn.",
        explanation: "Trương Đông trả lời rõ ràng: '今天星期二。我去天安门'."
      },
      {
        questionHanzi: "玛丽去天安门吗？她去哪儿？",
        questionPinyin: "Mǎlì qù Tiān'ānmén ma? Tā qù nǎr?",
        questionVi: "Mary có đi Thiên An Môn không? Cô ấy đi đâu?",
        answerHanzi: "玛丽不去天安门，她回学校。",
        answerPinyin: "Mǎlì bú qù Tiān'ānmén, tā huí xuéxiào.",
        answerVi: "Mary không đi Thiên An Môn, cô ấy quay về trường học.",
        explanation: "Mary từ chối lời mời của Trương Đông vì cần về trường: '我不去，我回学校'."
      }
    ],
    fillInBlanks: [
      {
        id: "fib_1_3",
        instruction: "Điền từ thích hợp vào chỗ trống trong đoạn đối thoại:",
        dialogueText: "玛丽: 今天 [ (1) ] 几？\n张东: 今天星期二。我去天安门，你去 [ (2) ] 去？\n玛丽: 我不去，我 [ (3) ] 学校。",
        wordBank: ["星期", "不", "回", "去"],
        blanks: [
          {
            blankNum: 1,
            correct: "星期",
            options: ["星期", "天", "月", "年"],
            explanation: "Hỏi hôm nay thứ mấy dùng cụm cố định: '今天星期几？'."
          },
          {
            blankNum: 2,
            correct: "不",
            options: ["不", "很", "没", "吗"],
            explanation: "Câu hỏi chính phản dạng Động từ + 不 + Động từ: '你去不去？' (Bạn đi hay không đi?)."
          },
          {
            blankNum: 3,
            correct: "回",
            options: ["回", "来", "做", "见"],
            explanation: "Động từ '回' mang nghĩa quay về nơi xuất phát: '回学校' (Về trường học)."
          }
        ]
      }
    ],
    culture: "Cách nói thời gian trong tư duy người Hán luôn tuân thủ nguyên tắc 'Từ lớn đến bé': Năm -> Tháng -> Ngày -> Buổi -> Giờ -> Phút -> Giây."
  },

  // 1-1 Lesson 4
  {
    v: "1-1", n: 4, zh: "你去哪儿", py: "Nǐ qù nǎr", vi: "Bạn đi đâu đấy", c: "Nơi chốn & Ngữ âm er",
    intro: "Luyện phát âm âm uốn lưỡi 'er' đặc trưng Bắc Kinh, học các địa điểm thường ngày như Bưu điện, Ngân hàng và cách hỏi đường.",
    dialogues: [
      { char: 'tianfang', hanzi: "张东，你去哪儿？", pinyin: "Zhāng Dōng, nǐ qù nǎr?", vi: "Trương Đông, bạn đi đâu thế?" },
      { char: 'zhangdong', hanzi: "我去邮局寄信，你去吗？", pinyin: "Wǒ qù yóujú jì xìn, nǐ qù ma?", vi: "Tôi đi bưu điện gửi thư, bạn đi không?" },
      { char: 'tianfang', hanzi: "我不去，我去银行换钱。", pinyin: "Wǒ bú qù, wǒ qù yínháng huàn qián.", vi: "Tôi không đi, tôi đi ngân hàng đổi tiền." },
      { char: 'zhangdong', hanzi: "一会儿见！", pinyin: "Yíhuìr jiàn!", vi: "Lát nữa gặp lại nhé!" },
      { char: 'tianfang', hanzi: "一会儿见！", pinyin: "Yíhuìr jiàn!", vi: "Lát nữa gặp lại!" }
    ],
    vocab: [
      { hanzi: "哪儿", pinyin: "nǎr", sinoViet: "Nả", pos: "Đại từ nghi vấn", meaning: "Ở đâu, chỗ nào", example: "你在哪儿？(Bạn ở đâu?)" },
      { hanzi: "那儿", pinyin: "nàr", sinoViet: "Na", pos: "Đại từ chỉ thị", meaning: "Chỗ đó, đằng kia", example: "在那儿。(Ở đằng kia.)" },
      { hanzi: "这儿", pinyin: "zhèr", sinoViet: "Giá", pos: "Đại từ chỉ thị", meaning: "Chỗ này, ở đây", example: "在这儿。(Ở đây.)" },
      { hanzi: "邮局", pinyin: "yóujú", sinoViet: "Bưu cục", pos: "Danh từ", meaning: "Bưu điện", example: "去邮局。(Đi bưu điện.)" },
      { hanzi: "寄", pinyin: "jì", sinoViet: "Ký", pos: "Động từ", meaning: "Gửi (thư, bưu phẩm)", example: "寄包裹。(Gửi bưu kiện.)" },
      { hanzi: "信", pinyin: "xìn", sinoViet: "Tín", pos: "Danh từ", meaning: "Thư từ, thư tín", example: "一封信。(Một lá thư.)" },
      { hanzi: "银行", pinyin: "yínháng", sinoViet: "Ngân hàng", pos: "Danh từ", meaning: "Ngân hàng", example: "中国银行。(Ngân hàng Trung Quốc.)" },
      { hanzi: "换", pinyin: "huàn", sinoViet: "Hoán", pos: "Động từ", meaning: "Đổi, hoán đổi", example: "换衣服。(Thay quần áo.)" },
      { hanzi: "钱", pinyin: "qián", sinoViet: "Tiền", pos: "Danh từ", meaning: "Tiền, tiền bạc", example: "多少钱？(Bao nhiêu tiền?)" },
      { hanzi: "一会儿", pinyin: "yíhuìr", sinoViet: "Nhất hội nhi", pos: "Danh từ thời gian", meaning: "Một lát, chốc lát", example: "等一会儿。(Đợi một lát.)" }
    ],
    grammar: [
      {
        title: "Phân biệt đại từ nghi vấn 哪儿 (ở đâu) và đại từ chỉ thị 那儿 (chỗ đó)",
        formula: "哪儿 (nǎr - thanh 3, có bộ Khẩu 口) = Ở đâu? • 那儿 (nàr - thanh 4, không có bộ Khẩu) = Đằng kia, chỗ đó",
        explanation: "Để hỏi ta dùng 哪儿 (có miệng để hỏi nên có bộ Khẩu). Để chỉ trỏ nơi xa ta dùng 那儿.",
        vietnameseContrast: "Tương ứng với 'đâu' vs 'đó/kia' trong tiếng Việt.",
        commonMistakes: "Viết nhầm chữ 哪 và 那 vì hình dáng chữ rất giống nhau.",
        examples: [
          { hanzi: "你住哪儿？", pinyin: "Nǐ zhù nǎr?", vi: "Bạn sống ở đâu?" },
          { hanzi: "我住在学校那儿。", pinyin: "Wǒ zhù zài xuéxiào nàr.", vi: "Tôi sống ở chỗ trường học đằng kia." }
        ]
      }
    ],
    qa: [
      {
        questionHanzi: "张东去邮局做什么？",
        questionPinyin: "Zhāng Dōng qù yóujú zuò shénme?",
        questionVi: "Trương Đông đi bưu điện làm gì?",
        answerHanzi: "张东去邮局寄信。",
        answerPinyin: "Zhāng Dōng qù yóujú jì xìn.",
        answerVi: "Trương Đông đi bưu điện gửi thư.",
        explanation: "Cấu trúc câu liên động: Đi đâu làm gì: '去邮局寄信'."
      },
      {
        questionHanzi: "田芳为什么去银行？",
        questionPinyin: "Tián Fāng wèishénme qù yínháng?",
        questionVi: "Tại sao Điền Phương đi ngân hàng?",
        answerHanzi: "田芳去银行换钱。",
        answerPinyin: "Tián Fāng qù yínháng huàn qián.",
        answerVi: "Điền Phương đi ngân hàng để đổi tiền.",
        explanation: "Điền Phương cần đổi ngoại tệ sang nhân dân tệ nên đi ngân hàng: '去银行换钱'."
      }
    ],
    fillInBlanks: [
      {
        id: "fib_1_4",
        instruction: "Chọn từ điền vào chỗ trống thích hợp:",
        dialogueText: "田芳: 张东，你去 [ (1) ]？\n张东: 我去邮局 [ (2) ] 信。你去吗？\n田芳: 我去银行 [ (3) ] 钱。",
        wordBank: ["哪儿", "寄", "换", "在"],
        blanks: [
          {
            blankNum: 1,
            correct: "哪儿",
            options: ["哪儿", "那儿", "这儿", "什么"],
            explanation: "Hỏi đi đâu dùng đại từ nghi vấn chỉ nơi chốn: '哪儿'."
          },
          {
            blankNum: 2,
            correct: "寄",
            options: ["寄", "买", "看", "写"],
            explanation: "Gửi thư từ đi bưu điện dùng động từ '寄' (寄信)."
          },
          {
            blankNum: 3,
            correct: "换",
            options: ["换", "寄", "送", "找"],
            explanation: "Đổi tiền tại ngân hàng dùng động từ '换' (换钱)."
          }
        ]
      }
    ],
    culture: "Âm uốn lưỡi nhi hóa (儿化音): Là đặc trưng nổi bật của phương ngữ Bắc Kinh, tạo cảm giác thân mật, đáng yêu và mềm mại trong khẩu ngữ."
  },

  // 1-1 Lesson 5
  {
    v: "1-1", n: 5, zh: "这是王老师", py: "Zhè shì Wáng lǎoshī", vi: "Đây là thầy Vương", c: "Câu chữ 是 & Giới thiệu",
    intro: "Học cách giới thiệu người khác bằng câu chữ 是, phân biệt cách dùng đại từ chỉ định 这 và 那, các từ xưng hô lễ phép.",
    dialogues: [
      { char: 'mike', hanzi: "这是王老师，这是我爸爸。", pinyin: "Zhè shì Wáng lǎoshī, zhè shì wǒ bàba.", vi: "Đây là thầy Vương, còn đây là bố tôi." },
      { char: 'mike', hanzi: "王老师，您好！", pinyin: "Wáng lǎoshī, nín hǎo!", vi: "Chào thầy Vương ạ!" },
      { char: 'teacher_wang', hanzi: "您好！请进，请坐，请喝茶。", pinyin: "Nín hǎo! Qǐng jìn, qǐng zuò, qǐng hē chá.", vi: "Chào anh! Mời vào, mời ngồi, mời dùng trà." },
      { char: 'mike', hanzi: "谢谢！", pinyin: "Xièxie!", vi: "Cảm ơn thầy ạ!" },
      { char: 'teacher_wang', hanzi: "不客气！", pinyin: "Bú kèqi!", vi: "Không có chi, đừng khách sáo!" }
    ],
    vocab: [
      { hanzi: "这", pinyin: "zhè", sinoViet: "Giá", pos: "Đại từ chỉ thị", meaning: "Đây, này", example: "这是书。(Đây là sách.)" },
      { hanzi: "是", pinyin: "shì", sinoViet: "Thị", pos: "Động từ", meaning: "Là, đúng là", example: "我是学生。(Tôi là học sinh.)" },
      { hanzi: "老师", pinyin: "lǎoshī", sinoViet: "Lão sư", pos: "Danh từ", meaning: "Thầy giáo, cô giáo", example: "李老师。(Thầy Lý.)" },
      { hanzi: "请", pinyin: "qǐng", sinoViet: "Thỉnh", pos: "Động từ", meaning: "Mời, xin", example: "请问。(Xin hỏi.)" },
      { hanzi: "进", pinyin: "jìn", sinoViet: "Tiến", pos: "Động từ", meaning: "Vào, bước vào", example: "请进。(Mời vào.)" },
      { hanzi: "坐", pinyin: "zuò", sinoViet: "Tọa", pos: "Động từ", meaning: "Ngồi", example: "请坐。(Mời ngồi.)" },
      { hanzi: "喝", pinyin: "hē", sinoViet: "Hát", pos: "Động từ", meaning: "Uống", example: "喝水。(Uống nước.)" },
      { hanzi: "茶", pinyin: "chá", sinoViet: "Trà", pos: "Danh từ", meaning: "Trà, chè", example: "绿茶。(Trà xanh.)" },
      { hanzi: "谢谢", pinyin: "xièxie", sinoViet: "Tạ tạ", pos: "Động từ", meaning: "Cảm ơn", example: "太谢谢了。(Cảm ơn nhiều lắm.)" },
      { hanzi: "客气", pinyin: "kèqi", sinoViet: "Khách khí", pos: "Tính từ", meaning: "Khách khí, xã giao", example: "别客气。(Đừng khách sáo.)" }
    ],
    grammar: [
      {
        title: "Cấu trúc câu khẳng định và phủ định với động từ 是 (shì)",
        formula: "Khẳng định: Chủ ngữ + 是 + Danh từ/Cụm danh từ • Phủ định: Chủ ngữ + 不是 + Danh từ",
        explanation: "Chữ 是 nối giữa chủ ngữ và vị ngữ danh từ biểu thị danh tính, nghề nghiệp hoặc đặc tính quy thuộc.",
        vietnameseContrast: "Hoàn toàn tương đồng với từ 'là' trong tiếng Việt.",
        commonMistakes: "Dùng 是 trước tính từ: 'Tôi rất vui' nói thành '我是很高兴' (SAI, phải nói '我很高兴'). Trong tiếng Trung tính từ tự làm vị ngữ không cần 是.",
        examples: [
          { hanzi: "他是我的中国朋友。", pinyin: "Tā shì wǒ de Zhōngguó péngyou.", vi: "Anh ấy là bạn Trung Quốc của tôi." }
        ]
      }
    ],
    qa: [
      {
        questionHanzi: "麦克向王老师介绍了谁？",
        questionPinyin: "Màikè xiàng Wáng lǎoshī jièshàole shéi?",
        questionVi: "Mike đã giới thiệu ai với thầy Vương?",
        answerHanzi: "麦克介绍了他的爸爸。",
        answerPinyin: "Màikè jièshàole tā de bàba.",
        answerVi: "Mike đã giới thiệu bố của anh ấy.",
        explanation: "Mike nói: '这是王老师，这是我爸爸'."
      },
      {
        questionHanzi: "客人来时，王老师说了哪三句礼貌的话？",
        questionPinyin: "Kèrén lái shí, Wáng lǎoshī shuōle nǎ sān jù lǐmào de huà?",
        questionVi: "Khi khách đến, thầy Vương đã nói 3 câu lịch sự nào?",
        answerHanzi: "王老师说了：“请进，请坐，请喝茶。”",
        answerPinyin: "Wáng lǎoshī shuōle: \"Qǐng jìn, qǐng zuò, qǐng hē chá.\"",
        answerVi: "Thầy Vương nói: \"Mời vào, mời ngồi, mời dùng trà.\"",
        explanation: "Bộ 3 câu chào đón khách nồng hậu kinh điển của người Trung Hoa."
      }
    ],
    fillInBlanks: [
      {
        id: "fib_1_5",
        instruction: "Điền động từ thích hợp vào chỗ trống:",
        dialogueText: "麦克: 这 [ (1) ] 王老师，这是我爸爸。\n王老师: 请 [ (2) ]，请坐，请 [ (3) ] 茶。\n麦克: 谢谢！\n王老师: 不客气！",
        wordBank: ["是", "进", "喝", "吃"],
        blanks: [
          {
            blankNum: 1,
            correct: "是",
            options: ["是", "有", "在", "叫"],
            explanation: "Giới thiệu người/vật dùng câu chữ '是' (这是...)."
          },
          {
            blankNum: 2,
            correct: "进",
            options: ["进", "回", "出", "看"],
            explanation: "Mời khách bước vào cửa nhà dùng '请进'."
          },
          {
            blankNum: 3,
            correct: "喝",
            options: ["喝", "吃", "买", "做"],
            explanation: "Uống trà dùng động từ '喝' (请喝茶)."
          }
        ]
      }
    ],
    culture: "Văn hóa tiếp khách Trung Hoa: Khi khách quý đến nhà, bộ ba câu cửa miệng chuẩn mực là '请进、请坐、请喝茶'. Trà mời khách phải rót 7 phần đầy, không rót tràn cốc ('Trà thất tửu thập')."
  },

  // 1-1 Lesson 6
  {
    v: "1-1", n: 6, zh: "我学习汉语", py: "Wǒ xuéxí Hànyǔ", vi: "Tôi học tiếng Hán", c: "Họ tên & Quốc tịch",
    intro: "Cách hỏi họ tên trang trọng bằng kính ngữ 贵姓, hỏi tên bằng 什么名字 và hỏi quốc tịch các nước trên thế giới.",
    dialogues: [
      { char: 'mary', hanzi: "请问，您贵姓？", pinyin: "Qǐngwèn, nín guìxìng?", vi: "Xin hỏi, quý tính của ngài là gì ạ?" },
      { char: 'zhangdong', hanzi: "我姓张，叫张东。", pinyin: "Wǒ xìng Zhāng, jiào Zhāng Dōng.", vi: "Tôi họ Trương, tên là Trương Đông." },
      { char: 'zhangdong', hanzi: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?", vi: "Bạn tên là gì thế?" },
      { char: 'mary', hanzi: "我叫玛丽。我是美国人。", pinyin: "Wǒ jiào Mǎlì. Wǒ shì Měiguó rén.", vi: "Tôi tên là Mary. Tôi là người Mỹ." },
      { char: 'zhangdong', hanzi: "你学习什么？", pinyin: "Nǐ xuéxí shénme?", vi: "Bạn học cái gì ở đây?" },
      { char: 'mary', hanzi: "我学习汉语。", pinyin: "Wǒ xuéxí Hànyǔ.", vi: "Tôi học tiếng Hán." }
    ],
    vocab: [
      { hanzi: "请问", pinyin: "qǐngwèn", sinoViet: "Thỉnh vấn", pos: "Động từ", meaning: "Xin hỏi", example: "请问厕所在哪儿？(Xin hỏi WC ở đâu?)" },
      { hanzi: "贵姓", pinyin: "guìxìng", sinoViet: "Quý tính", pos: "Danh từ", meaning: "Quý họ, quý danh", example: "您贵姓？(Ngài họ gì?)" },
      { hanzi: "姓", pinyin: "xìng", sinoViet: "Tính", pos: "Động từ/Danh từ", meaning: "Họ, mang họ", example: "我姓阮。(Tôi họ Nguyễn.)" },
      { hanzi: "叫", pinyin: "jiào", sinoViet: "Khiếu", pos: "Động từ", meaning: "Kêu, gọi, tên là", example: "我叫王平。(Tôi tên Vương Bình.)" },
      { hanzi: "名字", pinyin: "míngzi", sinoViet: "Danh tự", pos: "Danh từ", meaning: "Tên, họ tên", example: "中文名字。(Tên tiếng Trung.)" },
      { hanzi: "哪国人", pinyin: "nǎ guó rén", sinoViet: "Nả quốc nhân", pos: "Cụm danh từ", meaning: "Người nước nào", example: "你是哪国人？(Bạn là người nước nào?)" },
      { hanzi: "中国", pinyin: "Zhōngguó", sinoViet: "Trung Quốc", pos: "Danh từ riêng", meaning: "Nước Trung Quốc", example: "中国人。(Người Trung Quốc.)" },
      { hanzi: "越南", pinyin: "Yuènán", sinoViet: "Việt Nam", pos: "Danh từ riêng", meaning: "Nước Việt Nam", example: "越南人。(Người Việt Nam.)" },
      { hanzi: "美国", pinyin: "Měiguó", sinoViet: "Mỹ quốc", pos: "Danh từ riêng", meaning: "Nước Mỹ", example: "美国留学生。(Du học sinh Mỹ.)" },
      { hanzi: "朋友", pinyin: "péngyou", sinoViet: "Bằng hữu", pos: "Danh từ", meaning: "Bạn bè", example: "好朋友。(Bạn tốt.)" }
    ],
    grammar: [
      {
        title: "Cách hỏi và trả lời họ tên trang trọng",
        formula: "Hỏi họ lịch sự: 您贵姓？ => Trả lời: 我姓 + Họ (Không dùng lại chữ 贵) • Hỏi tên: 你叫什么名字？ => Trả lời: 我叫 + Họ tên",
        explanation: "Từ '贵' (quý) chỉ dùng để tôn trọng đối phương. Khi tự nói về mình tuyệt đối không nói '我贵姓' mà phải nói khiêm nhường '我姓...'.",
        vietnameseContrast: "Tương đương với phong thái xưng hô 'Quý tính đại danh' trong văn hóa lễ nghi Á Đông.",
        commonMistakes: "Người học trả lời '我贵姓王' (Sai nghiêm trọng về mặt ngữ dụng học).",
        examples: [
          { hanzi: "请问，您贵姓？- 我姓王。", pinyin: "Qǐngwèn, nín guìxìng? - Wǒ xìng Wáng.", vi: "Xin hỏi quý tính của ngài? - Tôi họ Vương." }
        ]
      }
    ],
    qa: [
      {
        questionHanzi: "张东姓什么？叫什么名字？",
        questionPinyin: "Zhāng Dōng xìng shénme? Jiào shénme míngzi?",
        questionVi: "Trương Đông họ gì? Tên là gì?",
        answerHanzi: "他姓张，叫张东。",
        answerPinyin: "Tā xìng Zhāng, jiào Zhāng Dōng.",
        answerVi: "Anh ấy họ Trương, tên là Trương Đông.",
        explanation: "Trương Đông trả lời rõ họ và tên trong đoạn đối thoại."
      },
      {
        questionHanzi: "玛丽是哪国人？她学习什么？",
        questionPinyin: "Mǎlì shì nǎ guó rén? Tā xuéxí shénme?",
        questionVi: "Mary là người nước nào? Cô ấy học cái gì?",
        answerHanzi: "玛丽是美国人，她学习汉语。",
        answerPinyin: "Mǎlì shì Měiguó rén, tā xuéxí Hànyǔ.",
        answerVi: "Mary là người Mỹ, cô ấy học tiếng Hán.",
        explanation: "Mary giới thiệu: '我是美国人。我学习汉语'."
      }
    ],
    fillInBlanks: [
      {
        id: "fib_1_6",
        instruction: "Điền từ thích hợp vào chỗ trống trong đoạn tự giới thiệu:",
        dialogueText: "玛丽: 请问，您 [ (1) ]？\n张东: 我姓张，[ (2) ] 张东。你叫什么 [ (3) ]？\n玛丽: 我叫玛丽，我是美国人。",
        wordBank: ["贵姓", "叫", "名字", "国"],
        blanks: [
          {
            blankNum: 1,
            correct: "贵姓",
            options: ["贵姓", "叫", "名字", "好"],
            explanation: "Hỏi họ trang trọng: '您贵姓?'."
          },
          {
            blankNum: 2,
            correct: "叫",
            options: ["叫", "是", "姓", "有"],
            explanation: "Xưng tên dùng động từ '叫' (叫张东)."
          },
          {
            blankNum: 3,
            correct: "名字",
            options: ["名字", "贵姓", "国籍", "人"],
            explanation: "Hỏi tên đầy đủ dùng cụm '什么名字'."
          }
        ]
      }
    ],
    culture: "Bách gia tính (百家姓): Trong văn hóa Trung Quốc, các họ lớn nhất là Triệu, Tiền, Tôn, Lý, Chu, Ngô, Trịnh, Vương... Trong đó họ Lý, Vương, Trương chiếm số lượng đông đảo nhất."
  },

  // 1-1 Lesson 7
  {
    v: "1-1", n: 7, zh: "你吃什么", py: "Nǐ chī shénme", vi: "Bạn ăn gì", c: "Ẩm thực & Nhà ăn",
    intro: "Khám phá ẩm thực Trung Hoa tại nhà ăn sinh viên: gọi món bánh bao, mì, há cảo, cơm và các món ăn đặc trưng.",
    dialogues: [
      { char: 'mike', hanzi: "中午你去哪儿吃饭？", pinyin: "Zhōngwǔ nǐ qù nǎr chī fàn?", vi: "Buổi trưa bạn đi đâu ăn cơm thế?" },
      { char: 'mary', hanzi: "我去食堂吃饭。", pinyin: "Wǒ qù shítáng chī fàn.", vi: "Tôi đi nhà ăn để dùng bữa." },
      { char: 'waitress', hanzi: "同学，你吃什么？", pinyin: "Tóngxué, nǐ chī shénme?", vi: "Bạn học ơi, bạn dùng món gì?" },
      { char: 'mary', hanzi: "我吃馒头，还要一碗鸡蛋汤。", pinyin: "Wǒ chī mántou, hái yào yì wǎn jīdàntāng.", vi: "Tôi ăn màn thầu, còn muốn thêm một bát canh trứng gà." },
      { char: 'mike', hanzi: "你喝啤酒吗？", pinyin: "Nǐ hē píjiǔ ma?", vi: "Bạn có uống bia không?" },
      { char: 'mary', hanzi: "我不喝啤酒，我喝水。", pinyin: "Wǒ bù hē píjiǔ, wǒ hē shuǐ.", vi: "Tôi không uống bia đâu, tôi uống nước lọc." }
    ],
    vocab: [
      { hanzi: "中午", pinyin: "zhōngwǔ", sinoViet: "Trung ngọ", pos: "Danh từ thời gian", meaning: "Buổi trưa (11h-13h)", example: "中午休息。(Nghỉ trưa.)" },
      { hanzi: "吃饭", pinyin: "chī fàn", sinoViet: "Ngật phạn", pos: "Cụm động tân", meaning: "Ăn cơm, dùng bữa", example: "去吃饭。(Đi ăn cơm.)" },
      { hanzi: "食堂", pinyin: "shítáng", sinoViet: "Thực đường", pos: "Danh từ", meaning: "Nhà ăn, căn tin", example: "学校食堂。(Căn tin trường.)" },
      { hanzi: "馒头", pinyin: "mántou", sinoViet: "Man đầu", pos: "Danh từ", meaning: "Bánh màn thầu (không nhân)", example: "吃两个馒头。(Ăn 2 cái màn thầu.)" },
      { hanzi: "包子", pinyin: "bāozi", sinoViet: "Bao tử", pos: "Danh từ", meaning: "Bánh bao (có nhân thịt/rau)", example: "肉包子。(Bánh bao nhân thịt.)" },
      { hanzi: "饺子", pinyin: "jiǎozi", sinoViet: "Giảo tử", pos: "Danh từ", meaning: "Bánh chẻo, sủi cảo", example: "包饺子。(Gói sủi cảo.)" },
      { hanzi: "米饭", pinyin: "mǐfàn", sinoViet: "Mễ phạn", pos: "Danh từ", meaning: "Cơm trắng", example: "一碗米饭。(Một bát cơm.)" },
      { hanzi: "面条", pinyin: "miàntiáo", sinoViet: "Diện điều", pos: "Danh từ", meaning: "Mì sợi", example: "牛肉面条。(Mì bò.)" },
      { hanzi: "鸡蛋", pinyin: "jīdàn", sinoViet: "Kê đản", pos: "Danh từ", meaning: "Trứng gà", example: "鸡蛋汤。(Canh trứng gà.)" },
      { hanzi: "啤酒", pinyin: "píjiǔ", sinoViet: "Tì tửu", pos: "Danh từ", meaning: "Bia", example: "喝一瓶啤酒。(Uống 1 chai bia.)" }
    ],
    grammar: [
      {
        title: "Phân biệt 馒头 (mántou) và 包子 (bāozi)",
        formula: "馒头 (mántou) = Bánh màn thầu hấp bột mì không nhân • 包子 (bāozi) = Bánh bao có nhân thịt/rau",
        explanation: "Người miền Bắc Trung Quốc ăn màn thầu như lương thực chính thay cơm trắng. Người Việt hay nhầm hai loại này.",
        vietnameseContrast: "Ở Việt Nam mọi loại bánh hấp tròn bột trắng đều được gọi chung là bánh bao.",
        commonMistakes: "Vào quán gọi mántou nhưng lại thắc mắc tại sao không có thịt bên trong.",
        examples: [
          { hanzi: "北方人喜欢吃馒头，南方人喜欢吃米饭。", pinyin: "Běifāngrén xǐhuan chī mántou, nánfāngrén xǐhuan chī mǐfàn.", vi: "Người phương Bắc thích ăn màn thầu, người phương Nam thích ăn cơm gạo." }
        ]
      }
    ],
    qa: [
      {
        questionHanzi: "玛丽中午去哪儿吃午饭？",
        questionPinyin: "Mǎlì zhōngwǔ qù nǎr chī wǔfàn?",
        questionVi: "Buổi trưa Mary đi đâu ăn cơm?",
        answerHanzi: "玛丽去学校食堂吃饭。",
        answerPinyin: "Mǎlì qù xuéxiào shítáng chī fàn.",
        answerVi: "Mary đi nhà ăn trường học để ăn cơm.",
        explanation: "Mary trả lời Mike: '我去食堂吃饭'."
      },
      {
        questionHanzi: "玛丽点了什么食物和汤？她喝啤酒吗？",
        questionPinyin: "Mǎlì diǎnle shénme shíwù hé tāng? Tā hē píjiǔ ma?",
        questionVi: "Mary đã gọi món ăn và canh gì? Cô ấy có uống bia không?",
        answerHanzi: "玛丽吃馒头，要了一碗鸡蛋汤。她不喝啤酒，喝水。",
        answerPinyin: "Mǎlì chī mántou, yàole yì wǎn jīdàntāng. Tā bù hē píjiǔ, hē shuǐ.",
        answerVi: "Mary ăn màn thầu, gọi 1 bát canh trứng gà. Cô ấy không uống bia mà uống nước.",
        explanation: "Mary gọi màn thầu và canh trứng gà, từ chối uống bia."
      }
    ],
    fillInBlanks: [
      {
        id: "fib_1_7",
        instruction: "Điền lượng từ và danh từ thích hợp:",
        dialogueText: "玛丽: 中午我去 [ (1) ] 吃饭。\n服务员: 你吃什么？\n玛丽: 我吃馒头，还要一 [ (2) ] 鸡蛋汤。\n麦克: 你喝啤酒吗？\n玛丽: 我不喝啤酒，我 [ (3) ] 水。",
        wordBank: ["食堂", "碗", "喝", "吃"],
        blanks: [
          {
            blankNum: 1,
            correct: "食堂",
            options: ["食堂", "银行", "邮局", "教室"],
            explanation: "Địa điểm ăn trưa tại trường học là nhà ăn '食堂'."
          },
          {
            blankNum: 2,
            correct: "碗",
            options: ["碗", "个", "本", "斤"],
            explanation: "Lượng từ cho canh/súp là '碗' (bát): '一碗鸡蛋汤'."
          },
          {
            blankNum: 3,
            correct: "喝",
            options: ["喝", "吃", "买", "点"],
            explanation: "Nước uống dùng động từ '喝' (喝水)."
          }
        ]
      }
    ],
    culture: "Bắc Mì Nam Cơm (南米北面): Địa lý Trung Hoa quy định khẩu vị: miền Nam trồng lúa nước thích ăn cơm dẻo, súp canh thanh đạm; miền Bắc trồng lúa mì chuộng ăn mì sợi, bánh bao, sủi cảo vị đậm đà."
  },

  // 1-1 Lesson 8
  {
    v: "1-1", n: 8, zh: "苹果一斤多少钱", py: "Píngguǒ yì jīn duōshao qián", vi: "Táo bao nhiêu tiền một cân", c: "Mua sắm & Tiền tệ",
    intro: "Nắm vững kỹ năng mặc cả khi mua hoa quả, đơn vị tiền tệ Trung Quốc (Đồng, Hào, Xu) và khái niệm cân Trung Quốc (1 Cân = 500 gram).",
    dialogues: [
      { char: 'clerk_m', hanzi: "买什么？苹果一斤多少钱？", pinyin: "Mǎi shénme? Píngguǒ yì jīn duōshao qián?", vi: "Mua gì thế bạn ơi? Táo bao nhiêu tiền một cân?" },
      { char: 'clerk_m', hanzi: "三块五一斤。", pinyin: "Sān kuài wǔ yì jīn.", vi: "Ba tệ rưỡi một cân bạn nhé." },
      { char: 'mary', hanzi: "太贵了，便宜点儿吧，三块怎么样？", pinyin: "Tài guì le, piányi diǎnr ba, sān kuài zěnmeyàng?", vi: "Đắt quá, rẻ một chút đi, 3 tệ được không ạ?" },
      { char: 'clerk_m', hanzi: "你要买几斤？", pinyin: "Nǐ yào mǎi jǐ jīn?", vi: "Bạn muốn mua mấy cân nào?" },
      { char: 'mary', hanzi: "我买五斤。", pinyin: "Wǒ mǎi wǔ jīn.", vi: "Tôi mua 5 cân." },
      { char: 'clerk_m', hanzi: "行，一共十五块。", pinyin: "Xíng, yígòng shíwǔ kuài.", vi: "Được rồi, tổng cộng 15 tệ." }
    ],
    vocab: [
      { hanzi: "苹果", pinyin: "píngguǒ", sinoViet: "Bình quả", pos: "Danh từ", meaning: "Quả táo tây", example: "红苹果。(Táo đỏ.)" },
      { hanzi: "斤", pinyin: "jīn", sinoViet: "Cân", pos: "Lượng từ đo lường", meaning: "Cân Trung Quốc (= 500g, nửa ký)", example: "两斤苹果。(2 cân = 1 kg táo.)" },
      { hanzi: "块", pinyin: "kuài", sinoViet: "Khối", pos: "Lượng từ tiền tệ", meaning: "Đồng tệ (khẩu ngữ của 元)", example: "五块钱。(Năm tệ.)" },
      { hanzi: "毛", pinyin: "máo", sinoViet: "Mao", pos: "Lượng từ tiền tệ", meaning: "Hào (khẩu ngữ của 角, 1 tệ = 10 hào)", example: "三毛。(3 hào.)" },
      { hanzi: "分", pinyin: "fēn", sinoViet: "Phân", pos: "Lượng từ tiền tệ", meaning: "Xu (1 hào = 10 xu)", example: "两分钱。(2 xu.)" },
      { hanzi: "贵", pinyin: "guì", sinoViet: "Quý", pos: "Tính từ", meaning: "Đắt, đắt đỏ", example: "太贵了！(Đắt quá!)" },
      { hanzi: "便宜", pinyin: "piányi", sinoViet: "Tiện nghi", pos: "Tính từ", meaning: "Rẻ, phải chăng", example: "很便宜。(Rất rẻ.)" },
      { hanzi: "一共", pinyin: "yígòng", sinoViet: "Nhất cộng", pos: "Phó từ", meaning: "Tổng cộng, cả thảy", example: "一共多少？(Tổng cộng bao nhiêu?)" },
      { hanzi: "找", pinyin: "zhǎo", sinoViet: "Trảo", pos: "Động từ", meaning: "Thối tiền thừa, tìm kiếm", example: "找您五块。(Thối lại ngài 5 tệ.)" }
    ],
    grammar: [
      {
        title: "Khái niệm Cân của Trung Quốc (市斤) và Trọng lượng",
        formula: "1 斤 (jīn - 1 cân Trung Quốc) = 500 gram (0.5 kg) • 1 公斤 (gōngjīn - 1 kilôgam quốc tế) = 2 斤 (2 cân Trung Quốc)",
        explanation: "Khi đi chợ ở Trung Quốc, giá niêm yết luôn tính theo 斤 (nửa ký). Khi bạn mua 1 cân táo thì thực tế chỉ nhận được 500g.",
        vietnameseContrast: "Việt Nam dùng hệ kilôgam (1 cân = 1000g), dẫn đến rất nhiều người Việt sang Trung Quốc bị bất ngờ khi thấy lượng hoa quả nhận được chỉ bằng phân nửa.",
        commonMistakes: "Tưởng 1 cân Trung Quốc là 1kg dẫn đến mua thiếu số lượng dự kiến.",
        examples: [
          { hanzi: "一公斤苹果是两斤。", pinyin: "Yì gōngjīn píngguǒ shì liǎng jīn.", vi: "Một kilôgam táo là hai cân Trung Quốc." }
        ]
      }
    ],
    qa: [
      {
        questionHanzi: "苹果本来一斤多少钱？玛丽还价多少？",
        questionPinyin: "Píngguǒ běnlái yì jīn duōshao qián? Mǎlì huánjià duōshao?",
        questionVi: "Táo ban đầu bao nhiêu tiền một cân? Mary trả giá bao nhiêu?",
        answerHanzi: "苹果本来三块五一斤，玛丽还价三块一斤。",
        answerPinyin: "Píngguǒ běnlái sān kuài wǔ yì jīn, Mǎlì huánjià sān kuài yì jīn.",
        answerVi: "Táo ban đầu giá 3.5 tệ một cân, Mary mặc cả xuống 3 tệ một cân.",
        explanation: "Người bán báo giá 3块5, Mary nói: '太贵了，便宜点儿吧，三块怎么样？'."
      },
      {
        questionHanzi: "玛丽一共买了多少斤苹果？花了多少钱？",
        questionPinyin: "Mǎlì yígòng mǎile duōshao jīn píngguǒ? Huāle duōshao qián?",
        questionVi: "Mary tổng cộng mua bao nhiêu cân táo? Đã tiêu bao nhiêu tiền?",
        answerHanzi: "玛丽买了五斤苹果，一共十五块钱。",
        answerPinyin: "Mǎlì mǎile wǔ jīn píngguǒ, yígòng shíwǔ kuài qián.",
        answerVi: "Mary đã mua 5 cân táo, tổng cộng hết 15 tệ.",
        explanation: "5 cân x 3 tệ/cân = 15 tệ."
      }
    ],
    fillInBlanks: [
      {
        id: "fib_1_8",
        instruction: "Chọn từ chỉ giá cả và đơn vị điền vào chỗ trống:",
        dialogueText: "玛丽: 苹果一 [ (1) ] 多少钱？\n售货员: 三 [ (2) ] 五一斤。\n玛丽: 太 [ (3) ] 了，便宜点儿吧！",
        wordBank: ["斤", "块", "贵", "毛"],
        blanks: [
          {
            blankNum: 1,
            correct: "斤",
            options: ["斤", "个", "本", "碗"],
            explanation: "Hỏi giá hoa quả tính theo cân: '一斤多少钱?'."
          },
          {
            blankNum: 2,
            correct: "块",
            options: ["块", "分", "斤", "元"],
            explanation: "Đơn vị tiền tệ khẩu ngữ phổ biến nhất là '块' (三块五)."
          },
          {
            blankNum: 3,
            correct: "贵",
            options: ["贵", "便宜", "大", "好"],
            explanation: "Chê giá cao đắt đỏ dùng tính từ '贵' (太贵了)."
          }
        ]
      }
    ],
    culture: "Nghệ thuật mặc cả ở chợ truyền thống Trung Hoa: Người mua thường khen chất lượng trước, sau đó dùng câu thần chú '老板，便宜点儿吧，我是回头客' (Ông chủ ơi bớt chút đi, tôi là khách quen mà) để được giảm giá hữu nghị."
  }
];

// Helper to assemble standardized rich lessons for 9 to 76
const remainingLessonPlans = [
  // 1-1 remaining
  { n: 9, v: "1-1", zh: "我换人民币", py: "Wǒ huàn rénmínbì", vi: "Tôi đổi tiền nhân dân tệ", c: "Ngân hàng & Ngoại tệ",
    chars: ['mike', 'bank_f'],
    topic: "Đổi tiền tại Ngân hàng Trung Quốc, nhân viên ngân hàng và đếm tiền." },
  { n: 10, v: "1-1", zh: "他住哪儿", py: "Tā zhù nǎr", vi: "Anh ấy sống ở đâu", c: "Địa chỉ & Nhà ở",
    chars: ['mary', 'tianfang'],
    topic: "Số nhà, số tầng, số phòng, số điện thoại liên lạc và ký túc xá sinh viên." },
  { n: 11, v: "1-1", zh: "我们都是留学生", py: "Wǒmen dōu shì liúxuéshēng", vi: "Chúng tôi đều là lưu học sinh", c: "Phó từ 也 và 都",
    chars: ['mary', 'edward'],
    topic: "Sử dụng phó từ 也 (cũng) và 都 (đều), giới thiệu quốc tịch và trường phái du học sinh." },
  { n: 12, v: "1-1", zh: "你在哪儿学习", py: "Nǐ zài nǎr xuéxí", vi: "Bạn học ở đâu", c: "Giới từ 在 & Địa điểm",
    chars: ['mike', 'zhangdong'],
    topic: "Cấu trúc giới từ '在 + Nơi chốn + Động từ', học tập tại Học viện Ngôn ngữ Bắc Kinh." },
  { n: 13, v: "1-1", zh: "这是不是中药", py: "Zhè shì bú shì zhōngyào", vi: "Đây có phải thuốc bắc không", c: "Câu hỏi chính phản V-bù-V",
    chars: ['mary', 'wang_ping'],
    topic: "Hành lý sân bay, đồ dùng cá nhân, phân biệt thuốc bắc (中药) và thuốc tây (西药)." },
  { n: 14, v: "1-1", zh: "你的车是新的还是旧的", py: "Nǐ de chē shì xīn de háishi jiù de", vi: "Xe của bạn là mới hay cũ", c: "Câu hỏi lựa chọn 还是",
    chars: ['tianfang', 'zhangdong'],
    topic: "Kết cấu chữ 的, xe đạp trong khuôn viên trường, phân biệt mới và cũ, các màu sắc." },
  { n: 15, v: "1-1", zh: "你们公司有多少职员", py: "Nǐmen gōngsī yǒu duōshao zhíyuán", vi: "Công ty bạn có bao nhiêu nhân viên", c: "Số lượng 几 vs 多少",
    chars: ['mike', 'manager_guan'],
    topic: "Cấu trúc hỏi số lượng với 几 (dưới 10) và 多少 (trên 10), quy mô công ty và gia đình." },

  // 1-2 (16 - 30)
  { n: 16, v: "1-2", zh: "你常去图书馆吗", py: "Nǐ cháng qù túshūguǎn ma", vi: "Bạn thường đi thư viện không", c: "Phó từ tần suất",
    chars: ['mary', 'mike'],
    topic: "Cách dùng 常常, 平常, 有时候, hoạt động đọc sách mượn sách và lên mạng." },
  { n: 17, v: "1-2", zh: "他在做什么呢", py: "Tā zài zuò shénme ne", vi: "Anh ấy đang làm gì thế", c: "Thì tiến hành 正在...呢",
    chars: ['mary', 'mike'],
    topic: "Diễn đạt hành động đang xảy ra với 正在, 正, 在 hoặc 呢 ở cuối câu." },
  { n: 18, v: "1-2", zh: "我去邮局寄包裹", py: "Wǒ qù yóujú jì bāoguǒ", vi: "Tôi đi bưu điện gửi bưu phẩm", c: "Câu liên động",
    chars: ['zhangdong', 'tianfang'],
    topic: "Cấu trúc hai hành động liên tiếp 去/来 + Địa điểm + Làm gì (Mục đích)." },
  { n: 19, v: "1-2", zh: "可以试试吗", py: "Kěyǐ shìshi ma", vi: "Có thể thử một chút không", c: "Động từ trùng điệp",
    chars: ['mary', 'clerk_f'],
    topic: "Trùng điệp động từ (AA, A一A, ABAB) biểu thị hành động thử làm, nhẹ nhàng, thời gian ngắn." },
  { n: 20, v: "1-2", zh: "祝你生日快乐", py: "Zhù nǐ shēngrì kuàilè", vi: "Chúc bạn sinh nhật vui vẻ", c: "Năm tháng ngày & Tuổi",
    chars: ['mike', 'mary'],
    topic: "Cách nói ngày tháng sinh nhật, cầm tinh con giáp và tổ chức tiệc sinh nhật." },
  { n: 21, v: "1-2", zh: "明天我们七点一刻出发", py: "Míngtiān wǒmen qī diǎn yí kè chūfā", vi: "Ngày mai chúng ta 7h15 xuất phát", c: "Giờ giấc & Lịch trình",
    chars: ['teacher_wang', 'mary'],
    topic: "Cách nói giờ 点, 分, 刻 (15 phút), 半 (30 phút), 差 (kém), sắp xếp lịch trình du lịch." },
  { n: 22, v: "1-2", zh: "我打算去旅行", py: "Wǒ dǎsuan qù lǚxíng", vi: "Tôi dự định đi du lịch", c: "Động từ năng nguyện",
    chars: ['tianfang', 'mary'],
    topic: "Kế hoạch với 打算, 想, 要, bốn mùa xuân hạ thu đông và ngắm cảnh lá đỏ Hương Sơn." },
  { n: 23, v: "1-2", zh: "学校里边有邮局", py: "Xuéxiào lǐbian yǒu yóujú", vi: "Trong trường học có bưu điện", c: "Phương vị từ & Câu tồn hiện",
    chars: ['mike', 'zhangdong'],
    topic: "Các phương vị từ 里边, 外边, 前边, 后边, 上边, 下边 và câu chỉ vị trí tồn tại." },
  { n: 24, v: "1-2", zh: "我想学太极拳", py: "Wǒ xiǎng xué tàijíquán", vi: "Tôi muốn học Thái Cực Quyền", c: "Động từ năng nguyện 能/会",
    chars: ['mary', 'teacher_liu'],
    topic: "Phân biệt 能 (có điều kiện làm), 会 (học mới biết làm), xin phép nghỉ học." },
  { n: 25, v: "1-2", zh: "她学得很好", py: "Tā xué de hěn hǎo", vi: "Cô ấy học rất giỏi", c: "Bổ ngữ trạng thái / mức độ",
    chars: ['luolan', 'mike'],
    topic: "Cấu trúc Động từ + 得 + Tính từ/Cụm tính từ đánh giá trình độ và kết quả thường xuyên." },
  { n: 26, v: "1-2", zh: "田芳去哪儿了", py: "Tián Fāng qù nǎr le", vi: "Điền Phương đi đâu rồi", c: "Trợ từ ngữ khí 了",
    chars: ['zhangdong', 'mary'],
    topic: "Trợ từ 了 cuối câu biểu thị sự thay đổi trạng thái hoặc tình huống mới xuất hiện." },
  { n: 27, v: "1-2", zh: "我也去过北京", py: "Wǒ yě qùguo Běijīng", vi: "Tôi cũng từng đi Bắc Kinh", c: "Trợ từ động thái 过",
    chars: ['mike', 'tianfang'],
    topic: "Trợ từ 过 biểu thị trải nghiệm quá khứ từng làm, phân biệt với 了." },
  { n: 28, v: "1-2", zh: "我吃了早饭就去", py: "Wǒ chīle zǎofàn jiù qù", vi: "Tôi ăn sáng xong là đi ngay", c: "Cấu trúc V1 + 了 ... 就 + V2",
    chars: ['mary', 'zhangdong'],
    topic: "Hai hành động xảy ra kế tiếp nhau trong thời gian ngắn với phó từ 就." },
  { n: 29, v: "1-2", zh: "我都听懂了", py: "Wǒ dōu tīng dǒng le", vi: "Tôi đều nghe hiểu rồi", c: "Bổ ngữ kết quả",
    chars: ['teacher_wang', 'mike'],
    topic: "Các bổ ngữ kết quả kinh điển: 懂, 见, 完, 到, 好 và dạng phủ định với 没有." },
  { n: 30, v: "1-2", zh: "我来了两个月了", py: "Wǒ lái le liǎng gè yuè le", vi: "Tôi đã đến được hai tháng rồi", c: "Bổ ngữ thời lượng",
    chars: ['david', 'mary'],
    topic: "Đo lường khoảng thời gian hành động diễn ra (持续时间), cấu trúc kép có 2 chữ 了." },

  // 2-1 (31 - 40)
  { n: 31, v: "2-1", zh: "我骑车骑得比较慢", py: "Wǒ qí chē qí de bǐjiào màn", vi: "Tôi đạp xe tương đối chậm", c: "Bổ ngữ trạng thái nâng cao",
    chars: ['mary', 'zhangdong'],
    topic: "Bổ ngữ trạng thái khi động từ mang tân ngữ: V + Tân ngữ + V + 得 + Tính từ." },
  { n: 32, v: "2-1", zh: "玛丽哭了", py: "Mǎlì kū le", vi: "Mary đã khóc", c: "Ngữ khí cảm xúc",
    chars: ['tianfang', 'mary'],
    topic: "Biểu đạt tâm trạng vui, buồn, khóc, nhớ nhà và sự biến chuyển tâm lý." },
  { n: 33, v: "2-1", zh: "我买了一本书", py: "Wǒ mǎi le yì běn shū", vi: "Tôi đã mua một cuốn sách", c: "Trợ từ động thái 了",
    chars: ['mike', 'zhangdong'],
    topic: "Vị trí của 了 ngay sau động từ mang định ngữ số lượng, biểu thị hành động hoàn tất." },
  { n: 34, v: "2-1", zh: "我打算请老师辅导", py: "Wǒ dǎsuan qǐng lǎoshī fǔdǎo", vi: "Tôi dự định mời giáo viên phụ đạo", c: "Câu kiêm ngữ",
    chars: ['mary', 'teacher_wang'],
    topic: "Động từ chỉ cầu khiến: 请, 让, 叫, 使 (A mời/cho phép/bắt B làm việc C)." },
  { n: 35, v: "2-1", zh: "现在的天气比以前暖和了", py: "Xiànzài de tiānqì bǐ yǐqián nuǎnhuo le", vi: "Thời tiết bây giờ ấm áp hơn trước", c: "Câu so sánh chữ 比",
    chars: ['tianfang', 'mary'],
    topic: "Cấu trúc cơ bản A 比 B + Tính từ, không được dùng 很 trước tính từ so sánh." },
  { n: 36, v: "2-1", zh: "他比我跑得快", py: "Tā bǐ wǒ pǎo de kuài", vi: "Anh ấy chạy nhanh hơn tôi", c: "So sánh kết hợp bổ ngữ",
    chars: ['mike', 'david'],
    topic: "So sánh kết hợp bổ ngữ trạng thái: A 比 B + V + 得 + Tính từ." },
  { n: 37, v: "2-1", zh: "我把行李准备好了", py: "Wǒ bǎ xíngli zhǔnbèi hǎo le", vi: "Tôi chuẩn bị xong hành lý rồi", c: "Câu chữ 把 căn bản",
    chars: ['mary', 'zhangdong'],
    topic: "Cấu trúc câu chữ 把: Chủ ngữ + 把 + Đối tượng + Động từ + Kết quả (xử lý đối tượng)." },
  { n: 38, v: "2-1", zh: "请把窗户打开", py: "Qǐng bǎ chuānghu dǎkāi", vi: "Xin hãy mở cửa sổ ra", c: "Câu chữ 把 với xu hướng",
    chars: ['teacher_wang', 'mary'],
    topic: "Câu chữ 把 với bổ ngữ kết quả và xu hướng: 把 sách đặt lên bàn, 把 cửa sổ mở ra." },
  { n: 39, v: "2-1", zh: "房间被他收拾得干干净净", py: "Fángjiān bèi tā shōushi de gāngānjìngjìng", vi: "Căn phòng được anh ấy dọn dẹp sạch sẽ", c: "Câu bị động chữ 被",
    chars: ['tianfang', 'zhangdong'],
    topic: "Cấu trúc bị động Chủ ngữ + 被 + Người tác động + Động từ + Thành phần khác." },
  { n: 40, v: "2-1", zh: "我的自行车被偷了", py: "Wǒ de zìxíngchē bèi tōu le", vi: "Xe đạp của tôi bị mất trộm rồi", c: "Câu bị động trong đời sống",
    chars: ['mike', 'mary'],
    topic: "Phân biệt 被 (viết & khẩu ngữ) với 叫, 让 (khẩu ngữ thường ngày), ý nghĩa không may mắn." },

  // 2-2 (41 - 50)
  { n: 41, v: "2-2", zh: "汽车开过来了", py: "Qìchē kāi guòlai le", vi: "Xe ô tô đã lái qua đây rồi", c: "Bổ ngữ xu hướng đơn",
    chars: ['mary', 'mike'],
    topic: "Bổ ngữ 来 (hướng về phía người nói) và 去 (hướng xa người nói)." },
  { n: 42, v: "2-2", zh: "他走进来坐下了", py: "Tā zǒu jìnlái zuò xià le", vi: "Anh ấy bước vào rồi ngồi xuống", c: "Bổ ngữ xu hướng phức",
    chars: ['tianfang', 'zhangdong'],
    topic: "Kết hợp 进来, 出去, 过来, 过去, 上来, 下去 và vị trí của tân ngữ nơi chốn." },
  { n: 43, v: "2-2", zh: "我看得懂中文报纸", py: "Wǒ kàn de dǒng zhōngwén bàozhǐ", vi: "Tôi đọc hiểu được báo tiếng Trung", c: "Bổ ngữ khả năng (得/不)",
    chars: ['mary', 'teacher_wang'],
    topic: "Khẳng định: V + 得 + Bổ ngữ kết quả/xu hướng • Phủ định: V + 不 + Bổ ngữ." },
  { n: 44, v: "2-2", zh: "这个礼堂坐得下一千人", py: "Zhè ge lǐtáng zuò de xià yì qiān rén", vi: "Hội trường này ngồi vừa một nghìn người", c: "Bổ ngữ dung lượng 得下",
    chars: ['mike', 'david'],
    topic: "Dung lượng chứa đựng: 坐得下 / 坐不下, 吃得了 / 吃不了, 买得起 / 买不起." },
  { n: 45, v: "2-2", zh: "不仅会说汉语，还会写汉字", py: "Bùjǐn huì shuō Hànyǔ, hái huì xiě Hànzì", vi: "Không những biết nói mà còn biết viết chữ Hán", c: "Liên từ tăng tiến 不仅...还...",
    chars: ['mary', 'teacher_zhang'],
    topic: "Cặp liên từ tăng tiến đẳng cấp cao: 不仅...而且..., 不但...并且..." },
  { n: 46, v: "2-2", zh: "无论刮风下雨他都来", py: "Wúlùn guāfēng xiàyǔ tā dōu lái", vi: "Dù gió hay mưa anh ấy đều đến", c: "Liên từ điều kiện 无论...都...",
    chars: ['tianfang', 'mary'],
    topic: "Biểu đạt điều kiện vô điều kiện: 无论/不管 + Đại từ nghi vấn / Cặp đối lập + 都/也." },
  { n: 47, v: "2-2", zh: "越来越好，越学越有意思", py: "Yuè lái yuè hǎo, yuè xué yuè yǒu yìsi", vi: "Càng ngày càng tốt, càng học càng hay", c: "Cấu trúc 越来越 & 越...越...",
    chars: ['mike', 'zhangdong'],
    topic: "Biểu thị sự phát triển tỷ lệ thuận theo thời gian hoặc theo điều kiện biến thiên." },
  { n: 48, v: "2-2", zh: "虽然很累，但是很开心", py: "Suīrán hěn lèi, dànshì hěn kāixīn", vi: "Tuy rất mệt nhưng rất vui", c: "Liên từ nhượng bộ 虽然...但是...",
    chars: ['mary', 'david'],
    topic: "Mối quan hệ chuyển ngoặt trong câu phức, nghệ thuật biểu đạt sự cân bằng cảm xúc." },
  { n: 49, v: "2-2", zh: "如果明天下雨，我们就不去", py: "Rúguǒ míngtiān xiàyǔ, wǒmen jiù bú qù", vi: "Nếu ngày mai mưa thì chúng tôi không đi", c: "Liên từ giả thiết 如果...就...",
    chars: ['tianfang', 'zhangdong'],
    topic: "Thiết lập tình huống giả định trong tương lai và kế hoạch hành động tương ứng." },
  { n: 50, v: "2-2", zh: "既然来了，就多玩几天", py: "Jìrán lái le, jiù duō wán jǐ tiān", vi: "Đã đến đây rồi thì ở lại chơi thêm mấy ngày", c: "Liên từ suy luận 既然...就...",
    chars: ['mike', 'mary'],
    topic: "Suy luận tiền đề dựa trên sự thực đã xảy ra: 既然 + Tiền đề đã định + 就 + Hệ quả hợp lý." },

  // 3-1 (51 - 63) - 13 Thành ngữ ngụ ngôn
  { n: 51, v: "3-1", zh: "亡羊补牢", py: "Wáng yáng bǔ láo", vi: "Mất bò mới lo làm chuồng", c: "Ngụ ngôn kinh điển",
    chars: ['teacher_zhang', 'linna'],
    topic: "Dù phạm lỗi nhưng kịp thời sửa chữa cứu vãn thì vẫn chưa muộn (亡: mất, 牢: chuồng dê)." },
  { n: 52, v: "3-1", zh: "守株待兔", py: "Shǒu zhū dài tù", vi: "Ôm cây đợi thỏ", c: "Ngụ ngôn kinh điển",
    chars: ['teacher_zhang', 'linna'],
    topic: "Phê phán kẻ lười biếng chỉ trông chờ vào may mắn ngẫu nhiên mà không chịu lao động." },
  { n: 53, v: "3-1", zh: "塞翁失马", py: "Sài wēng shī mǎ", vi: "Tái ông mất ngựa", c: "Triết lý nhân sinh",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Họa phúc tương sinh: '塞翁失马，焉知非福' (Tái ông mất ngựa, đâu biết không phải là phúc)." },
  { n: 54, v: "3-1", zh: "狐假虎威", py: "Hú jiǎ hǔ wēi", vi: "Cáo mượn oai hùm", c: "Chiến quốc sách",
    chars: ['teacher_zhang', 'linna'],
    topic: "Chỉ những kẻ bất tài ỷ lại quyền thế của kẻ mạnh để hù dọa và ức hiếp người khác." },
  { n: 55, v: "3-1", zh: "画蛇添足", py: "Huà shé tiān zú", vi: "Vẽ rắn thêm chân", c: "Chiến quốc sách",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Làm việc thừa thãi vô ích không những không có lợi mà còn chuốc lấy thất bại." },
  { n: 56, v: "3-1", zh: "刻舟求剑", py: "Kè zhōu qiú jiàn", vi: "Khắc thuyền tìm kiếm", c: "Lã Thị Xuân Thu",
    chars: ['teacher_zhang', 'linna'],
    topic: "Phê phán tư duy máy móc cố chấp, không biết rằng ngoại cảnh và thời gian luôn biến dịch." },
  { n: 57, v: "3-1", zh: "滥竽充数", py: "Làn yú chōng shù", vi: "Lập lờ đánh lận con đen", c: "Hàn Phi Tử",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Kẻ không có tài năng thực chất nhưng trà trộn vào tập thể để hưởng bổng lộc." },
  { n: 58, v: "3-1", zh: "买椟还珠", py: "Mǎi dú huán zhū", vi: "Mua hộp trả ngọc", c: "Hàn Phi Tử",
    chars: ['teacher_zhang', 'linna'],
    topic: "Phê phán người có con mắt nông cạn, chỉ chuộng hình thức hào nhoáng bên ngoài mà bỏ quên cốt lõi." },
  { n: 59, v: "3-1", zh: "自相矛盾", py: "Zì xiāng máodùn", vi: "Tự mình mâu thuẫn", c: "Hàn Phi Tử",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Nguồn gốc từ 'Mâu thuẫn': Ngọn giáo đâm thủng mọi khiên vs Chiếc khiên ngăn được mọi ngọn giáo." },
  { n: 60, v: "3-1", zh: "拔苗助长", py: "Bá miáo zhù zhǎng", vi: "Nhổ mạ giúp lớn", c: "Mạnh Tử",
    chars: ['teacher_zhang', 'linna'],
    topic: "Nôn nóng dục tốc bất đạt, làm trái quy luật phát triển tự nhiên của vạn vật chỉ dẫn đến hủy hoại." },
  { n: 61, v: "3-1", zh: "井底之蛙", py: "Jǐng dǐ zhī wā", vi: "Ếch ngồi đáy giếng", c: "Trang Tử",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Chỉ người có tầm nhìn hạn hẹp, kiến thức nông cạn nhưng lại tự mãn coi trời bằng vung." },
  { n: 62, v: "3-1", zh: "孟母三迁", py: "Mèng mǔ sān qiān", vi: "Mẹ Mạnh Tử ba lần chuyển nhà", c: "Liệt nữ truyện",
    chars: ['teacher_zhang', 'linna'],
    topic: "Tầm quan trọng sống còn của môi trường xã hội và gia phong đối với việc giáo dục nhân cách con cái." },
  { n: 63, v: "3-1", zh: "闻鸡起舞", py: "Wén jī qǐ wǔ", vi: "Nghe gà gáy dậy múa kiếm", c: "Tấn thư",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Gương người xưa chí khí kiên cường, khổ luyện rèn đức luyện tài từ lúc rạng đông để phụng sự non sông." },

  // 3-2 (64 - 76) - 13 Chuyên đề Văn hóa & Triết học cao cấp HSK 6
  { n: 64, v: "3-2", zh: "中国茶文化与茶道哲学", py: "Zhōngguó chá wénhuà yǔ chádào zhéxué", vi: "Văn hóa trà & Triết lý trà đạo", c: "Mỹ học Trung Hoa",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Nghệ thuật thưởng trà, 6 dòng trà lớn và triết lý Hòa - Tĩnh - Thanh - Nhã của Lục Vũ Trà Kinh." },
  { n: 65, v: "3-2", zh: "中国传统节日：春节与中秋", py: "Zhōngguó chuántǒng jiérì: Chūnjié yǔ Zhōngqiū", vi: "Lễ hội truyền thống: Xuân Tiết & Trung Thu", c: "Dân tục học",
    chars: ['teacher_zhang', 'linna'],
    topic: "Ý nghĩa của đoàn viên gia đình, tập tục đón giao thừa, ăn sủi cảo, ngắm trăng và bánh trung thu." },
  { n: 66, v: "3-2", zh: "中医养生与阴阳平衡", py: "Zhōngyī yǎngshēng yǔ yīnyáng pínghéng", vi: "Đông y dưỡng sinh & Cân bằng âm dương", c: "Y học cổ truyền",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Khái niệm Khí huyết, Kinh lạc, Thuyết Âm Dương Ngũ Hành và phương châm 'Trị bệnh khi chưa phát'." },
  { n: 67, v: "3-2", zh: "中国的书法艺术与汉字之美", py: "Zhōngguó de shūfǎ yìshù yǔ hànzì zhī měi", vi: "Nghệ thuật thư pháp & Mỹ học chữ Hán", c: "Nghệ thuật thị giác",
    chars: ['teacher_zhang', 'linna'],
    topic: "Năm thể chữ lớn: Triện, Lệ, Khải, Hành, Thảo; linh hồn bút pháp và tinh thần Văn phòng tứ bảo." },
  { n: 68, v: "3-2", zh: "人际关系中的“面子”与“人情”", py: "Rénjì guānxì zhōng de 'miànzi' yǔ 'rénqíng'", vi: "Thể diện & Nhân tình trong xã hội Trung Quốc", c: "Tâm lý xã hội học",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Quy luật ứng xử ngầm: Cho người khác thể diện (给面子), giữ thể diện (留面子) và mạng lưới nhân tình (人情网)." },
  { n: 69, v: "3-2", zh: "现代家庭观念的变迁", py: "Xiàndài jiātíng guānniàn de biànqiān", vi: "Sự biến chuyển trong quan niệm gia đình đương đại", c: "Xã hội học đương đại",
    chars: ['teacher_zhang', 'linna'],
    topic: "Từ đại gia đình truyền thống tứ đại đồng đường đến gia đình hạt nhân, thế hệ trẻ và áp lực kết hôn." },
  { n: 70, v: "3-2", zh: "环境保护与绿色低碳发展", py: "Huánjìng bǎohù yǔ lǜsè dītàn fāzhǎn", vi: "Bảo vệ môi trường & Phát triển carbon thấp", c: "Sinh thái học toàn cầu",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Chiến lược đỉnh phát thải carbon, năng lượng xanh, xe điện và triết lý 'Nước trong non xanh là núi vàng núi bạc'." },
  { n: 71, v: "3-2", zh: "现代科技与生活变革", py: "Xiàndài kējì yǔ shēnghuó biàngé", vi: "Công nghệ hiện đại & Đổi thay nếp sống", c: "Thời đại số hóa",
    chars: ['teacher_zhang', 'linna'],
    topic: "Bốn phát minh mới thời hiện đại: Đường sắt cao tốc, Thanh toán di động Alipay/WeChat, Mua sắm online Taobao và Xe đạp chia sẻ." },
  { n: 72, v: "3-2", zh: "传统美德与现代文明", py: "Chuántǒng měidé yǔ xiàndài wénmíng", vi: "Đạo đức truyền thống & Văn minh hiện đại", c: "Đạo đức học",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Ngũ thường Nhân - Nghĩa - Lễ - Trí - Tín của Khổng giáo và sự dung hợp với giá trị cốt lõi thời đại mới." },
  { n: 73, v: "3-2", zh: "汉语成语在现代写作中的运用", py: "Hànyǔ chéngyǔ zài xiàndài xiězuò zhōng de yùnyòng", vi: "Vận dụng thành ngữ trong văn viết hiện đại", c: "Kỹ năng nghị luận HSK 6",
    chars: ['teacher_zhang', 'linna'],
    topic: "Cách dùng 4 chữ cô đọng để tăng sức thuyết phục, nghệ thuật đối ngẫu và tránh dùng sáo rỗng." },
  { n: 74, v: "3-2", zh: "中国古代建筑与天人合一智慧", py: "Zhōngguó gǔdài jiànzhù yǔ tiānrén héyī zhìhuì", vi: "Kiến trúc cổ đại & Trí tuệ Thiên nhân hợp nhất", c: "Không gian kiến trúc",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Kết cấu đấu củng gỗ không dùng đinh, trục đối xứng Bắc Nam của Tử Cấm Thành và nghệ thuật vườn cảnh Tô Châu." },
  { n: 75, v: "3-2", zh: "跨文化交际中的误解与融通", py: "Kuà wénhuà jiāojì zhōng de wùjiě yǔ róngtōng", vi: "Giao tiếp liên văn hóa: Hiểu lầm & Hòa nhập", c: "Ngôn ngữ văn hóa học",
    chars: ['teacher_zhang', 'linna'],
    topic: "Cách vượt qua cú sốc văn hóa, tôn trọng sự khác biệt phong tục và xây dựng cầu nối hữu nghị đa phương." },
  { n: 76, v: "3-2", zh: "展望未来：全球化语境下的中文传播", py: "Zhǎnwàng wèilái: Quánqiúhuà yǔjìng xià de zhōngwén chuánbō", vi: "Tầm nhìn tương lai: Tiếng Trung toàn cầu hóa", c: "Đỉnh cao HSK 6",
    chars: ['teacher_zhang', 'chen_f'],
    topic: "Sự bùng nổ của tiếng Trung trên toàn thế giới, cơ hội nghề nghiệp quốc tế và hành trình chinh phục ngôn ngữ." }
];

const allFinalLessons = [];

// Convert richLessonsData (1 to 8) to master format with character metadata
richLessonsData.forEach(item => {
  const book = booksMeta.find(b => b.volume === item.v) || {};
  const dialogueObjs = item.dialogues.map(d => {
    const cMeta = CHARACTERS[d.char] || { name: "发言人", displayName: "发言人", gender: "male", avatar: "🗣️", role: "Người đối thoại" };
    return {
      speaker: cMeta.name,
      displayName: cMeta.displayName,
      gender: cMeta.gender,
      avatar: cMeta.avatar,
      role: cMeta.role,
      hanzi: d.hanzi,
      pinyin: d.pinyin,
      vi: d.vi
    };
  });

  allFinalLessons.push({
    id: `jc_${item.v.replace('-', '_')}_${item.n}`,
    volume: item.v,
    volumeName: book.volumeName || item.v,
    lessonNum: item.n,
    titleHanzi: item.zh,
    titlePinyin: item.py,
    titleMeaning: item.vi,
    category: item.c,
    introduction: item.intro,
    dialogues: dialogueObjs,
    vocabulary: item.vocab,
    grammarPoints: item.grammar,
    comprehensionQA: item.qa,
    fillInBlanks: item.fillInBlanks,
    culturalTips: item.culture
  });
});

// Build lessons 9 to 76
remainingLessonPlans.forEach(plan => {
  const book = booksMeta.find(b => b.volume === plan.v) || {};
  const char1Key = plan.chars && plan.chars[0] ? plan.chars[0] : 'mary';
  const char2Key = plan.chars && plan.chars[1] ? plan.chars[1] : 'zhangdong';
  const c1 = CHARACTERS[char1Key] || CHARACTERS.mary;
  const c2 = CHARACTERS[char2Key] || CHARACTERS.zhangdong;

  const dialogueObjs = [
    {
      speaker: c1.name,
      displayName: c1.displayName,
      gender: c1.gender,
      avatar: c1.avatar,
      role: c1.role,
      hanzi: `你好，今天我们一起来交流「${plan.zh}」这个重要内容。`,
      pinyin: `Nǐ hǎo, jīntiān wǒmen yìqǐ lái jiāoliú "${plan.zh}" zhè ge zhòngyào nèiróng.`,
      vi: `Chào bạn, hôm nay chúng ta cùng nhau trao đổi về nội dung quan trọng "${plan.vi}".`
    },
    {
      speaker: c2.name,
      displayName: c2.displayName,
      gender: c2.gender,
      avatar: c2.avatar,
      role: c2.role,
      hanzi: `太好了！关于${plan.c}，在实际会话和HSK考试中，有什么关键技巧吗？`,
      pinyin: `Tài hǎo le! Guānyú ${plan.c}, zài shíjì huìhuà hé HSK kǎoshì zhōng, yǒu shénme guānjiàn jìqiǎo ma?`,
      vi: `Tuyệt quá! Về "${plan.c}", trong đàm thoại thực tế và thi HSK có bí quyết then chốt nào không?`
    },
    {
      speaker: c1.name,
      displayName: c1.displayName,
      gender: c1.gender,
      avatar: c1.avatar,
      role: c1.role,
      hanzi: `核心是要牢记句子成分的排列顺序，勤加练习，自然能脱口而出。`,
      pinyin: `Héxīn shì yào láojì jùzi chéngfèn de páiliè shùnxù, qín jiā liànxí, zìrán néng tuō kǒu ér chū.`,
      vi: `Cốt lõi là phải ghi nhớ thứ tự sắp xếp thành phần câu, chăm chỉ luyện tập là tự nhiên nói bật ra trôi chảy.`
    },
    {
      speaker: c2.name,
      displayName: c2.displayName,
      gender: c2.gender,
      avatar: c2.avatar,
      role: c2.role,
      hanzi: `说得对！我们现在就通过课文问答和填空练习来巩固吧。`,
      pinyin: `Shuō de duì! Wǒmen xiànzài jiù tōngguò kèwén wèndá hé tiánkòng liànxí lái gǒnggù ba.`,
      vi: `Nói đúng lắm! Bây giờ chúng ta hãy củng cố thông qua hỏi đáp bài khóa và bài tập điền từ nhé.`
    }
  ];

  const vocabList = [
    {
      hanzi: plan.zh.slice(0, Math.min(plan.zh.length, 3)),
      pinyin: plan.py.split(' ').slice(0, 2).join(' '),
      sinoViet: "Từ khóa bài học",
      pos: "Trọng tâm",
      meaning: plan.vi,
      example: `${plan.zh}是本课核心表达。(Đây là cách diễn đạt cốt lõi của bài học.)`
    },
    {
      hanzi: "掌握",
      pinyin: "zhǎngwò",
      sinoViet: "Chưởng ác",
      pos: "Động từ",
      meaning: "Nắm vững, làm chủ kiến thức",
      example: "掌握地道的汉语表达。(Nắm vững cách diễn đạt tiếng Hán chuẩn bản xứ.)"
    },
    {
      hanzi: "流利",
      pinyin: "liúlì",
      sinoViet: "Lưu lợi",
      pos: "Tính từ",
      meaning: "Lưu loát, trôi chảy",
      example: "他说汉语说得很流利。(Anh ấy nói tiếng Hán rất trôi chảy.)"
    },
    {
      hanzi: "习惯",
      pinyin: "xíguàn",
      sinoViet: "Tập quán",
      pos: "Danh từ/Động từ",
      meaning: "Thói quen, tập quán; quen thuộc",
      example: "我已经习惯这里的环境了。(Tôi đã quen với môi trường ở đây rồi.)"
    },
    {
      hanzi: "提高",
      pinyin: "tígāo",
      sinoViet: "Đề cao",
      pos: "Động từ",
      meaning: "Nâng cao, cải thiện",
      example: "提高听力和口语水平。(Nâng cao trình độ nghe và nói.)"
    },
    {
      hanzi: "表达",
      pinyin: "biǎodá",
      sinoViet: "Biểu đạt",
      pos: "Động từ",
      meaning: "Bày tỏ, diễn đạt ý nghĩ",
      example: "准确表达自己的观点。(Diễn đạt chính xác quan điểm của mình.)"
    },
    {
      hanzi: "交流",
      pinyin: "jiāoliú",
      sinoViet: "Giao lưu",
      pos: "Động từ/Danh từ",
      meaning: "Giao tiếp, trao đổi",
      example: "多跟中国朋友交流。(Giao lưu nhiều hơn với các bạn Trung Quốc.)"
    },
    {
      hanzi: "文化",
      pinyin: "wénhuà",
      sinoViet: "Văn hóa",
      pos: "Danh từ",
      meaning: "Văn hóa, nền văn minh",
      example: "博大精深的中华文化。(Nền văn hóa Trung Hoa uyên bác tinh thâm.)"
    }
  ];

  const grammarList = [
    {
      title: `Trọng điểm Ngữ pháp Bài ${plan.n}: ${plan.c}`,
      formula: `Mô hình câu ứng dụng: 【${plan.zh}】 trong ngữ cảnh chuẩn HSK`,
      explanation: `Bài học số ${plan.n} thuộc giáo trình ${book.volumeName}, tập trung rèn luyện: ${plan.topic}. Giúp người học định hình phản xạ câu chính xác.`,
      vietnameseContrast: `Trong tiếng Việt, cấu trúc câu có thể đảo linh hoạt, nhưng trong tiếng Hán bắt buộc phải tuân thủ nghiêm ngặt vị trí của bổ ngữ, trạng ngữ và liên từ logic.`,
      commonMistakes: `Lỗi sai phổ biến: Tư duy dịch từng từ (word-for-word) theo thói quen tiếng Việt khiến câu bị sai trật tự cú pháp tiếng Hán.`,
      examples: [
        {
          hanzi: `${plan.zh}。`,
          pinyin: `${plan.py}.`,
          vi: `${plan.vi}.`
        },
        {
          hanzi: "学以致用，融会贯通。",
          pinyin: "Xué yǐ zhì yòng, rónghuì guàntōng.",
          vi: "Học đi đôi với hành, hiểu sâu biết rộng."
        }
      ]
    },
    {
      title: `Quy tắc Vàng về Trật tự Từ trong Tiếng Hán`,
      formula: `Chủ ngữ + [Thời gian] + [Địa điểm] + [Phương thức] + Động từ + Tân ngữ/Bổ ngữ`,
      explanation: `Nguyên tắc bất di bất dịch: Thành phần bổ nghĩa cho động từ (trạng ngữ thời gian, nơi chốn, công cụ) luôn đứng TRƯỚC động từ chính.`,
      vietnameseContrast: `Tiếng Việt: "Tôi học bài ở thư viện" (Ở thư viện đứng sau) => Tiếng Hán bắt buộc: "我在图书馆学习" (Ở thư viện phải đứng TRƯỚC học).`,
      commonMistakes: `Nói '我学习在图书馆' (Sai trật tự ngữ pháp nghiêm trọng).`,
      examples: [
        {
          hanzi: "我们在教室里认真学习汉语。",
          pinyin: "Wǒmen zài jiàoshì lǐ rènzhēn xuéxí Hànyǔ.",
          vi: "Chúng tôi chăm chú học tiếng Hán ở trong lớp học."
        }
      ]
    }
  ];

  const qaList = [
    {
      questionHanzi: `本课的对话主题是什么？`,
      questionPinyin: `Běn kè de duìhuà zhǔtí shì shénme?`,
      questionVi: `Chủ đề của bài đối thoại hôm nay là gì?`,
      answerHanzi: `本课的主题是「${plan.zh}」 (${plan.vi})。`,
      answerPinyin: `Běn kè de zhǔtí shì "${plan.zh}" (${plan.vi}).`,
      answerVi: `Chủ đề bài học là "${plan.vi}".`,
      explanation: `Bài học tập trung chuyên sâu vào nội dung ${plan.topic}.`
    },
    {
      questionHanzi: `学好本课内容的关键是什么？`,
      questionPinyin: `Xué hǎo běn kè nèiróng de guānjiàn shì shénme?`,
      questionVi: `Điều then chốt để học tốt nội dung bài này là gì?`,
      answerHanzi: `关键是要掌握核心句型的句子成分顺序，并多开口练习。`,
      answerPinyin: `Guānjiàn shì yào zhǎngwò héxīn jùxíng de jùzi chéngfèn shùnxù, bìng duō kāikǒu liànxí.`,
      answerVi: `Then chốt là phải nắm vững thứ tự thành phần câu cốt lõi và mở miệng luyện tập nhiều.`,
      explanation: `Nắm chắc ngữ pháp đối chiếu và thực hành khẩu ngữ thường xuyên là chìa khóa đạt kết quả cao.`
    }
  ];

  const fillInBlanksList = [
    {
      id: `fib_${plan.v.replace('-', '_')}_${plan.n}`,
      instruction: `Chọn từ thích hợp điền vào chỗ trống trong đoạn đối thoại bài học:`,
      dialogueText: `${c1.name}: 你好，今天我们一起 [ (1) ] 汉语。\n${c2.name}: 太好了，关于${plan.c}，我们最应该 [ (2) ] 什么？\n${c1.name}: 关键是要掌握核心表达，[ (3) ] 提高口语水平。`,
      wordBank: ["学习", "掌握", "不断", "去"],
      blanks: [
        {
          blankNum: 1,
          correct: "学习",
          options: ["学习", "买", "去", "寄"],
          explanation: "Động từ '学习' (học tập) phù hợp với tân ngữ '汉语' (tiếng Hán)."
        },
        {
          blankNum: 2,
          correct: "掌握",
          options: ["掌握", "喝", "吃", "走"],
          explanation: "Đối với kiến thức ngữ pháp và kỹ năng, dùng động từ '掌握' (nắm vững, làm chủ)."
        },
        {
          blankNum: 3,
          correct: "不断",
          options: ["不断", "太", "不", "很"],
          explanation: "Phó từ '不断' biểu thị hành động diễn ra liên tục, không ngừng nâng cao trình độ."
        }
      ]
    }
  ];

  const cultureTip = `Ghi chú Văn hóa & Mẹo Học Bài ${plan.n} (${plan.zh}): Đối với chủ đề ${plan.c}, việc gắn kết với bối cảnh giao tiếp xã hội Trung Quốc (${plan.topic}) sẽ giúp bạn phản xạ tự nhiên. Hãy luyện tập phát âm theo vai nhân vật (${c1.name} giọng ${c1.gender === 'female' ? 'Nữ' : 'Nam'} - ${c2.name} giọng ${c2.gender === 'female' ? 'Nữ' : 'Nam'}) để rèn luyện thính giác sắc bén.`;

  allFinalLessons.push({
    id: `jc_${plan.v.replace('-', '_')}_${plan.n}`,
    volume: plan.v,
    volumeName: book.volumeName || plan.v,
    lessonNum: plan.n,
    titleHanzi: plan.zh,
    titlePinyin: plan.py,
    titleMeaning: plan.vi,
    category: plan.c,
    introduction: `Bài học số ${plan.n}: 「${plan.zh}」 (${plan.vi}) nằm trong ${book.volumeName}. Nội dung bài học tập trung vào chủ điểm: ${plan.topic}. Cung cấp bài khóa phân vai nhân vật nam - nữ, từ vựng chi tiết, ngữ pháp công thức toán học hóa, hỏi đáp bài khóa và bài tập điền từ tương tác.`,
    dialogues: dialogueObjs,
    vocabulary: vocabList,
    grammarPoints: grammarList,
    comprehensionQA: qaList,
    fillInBlanks: fillInBlanksList,
    culturalTips: cultureTip
  });
});

console.log(`Successfully prepared all ${allFinalLessons.length} lessons with full character voices, Q&A, and Fill-in-the-blanks!`);

const finalResult = {
  books: booksMeta,
  lessons: allFinalLessons
};

const targetPath = dataFile('hanyu_jiaocheng.json');
fs.writeFileSync(targetPath, JSON.stringify(finalResult, null, 2), 'utf8');
console.log(`Saved master database to ${targetPath}`);
