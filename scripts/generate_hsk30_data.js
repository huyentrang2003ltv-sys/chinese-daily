const fs = require('fs');

const roadmapData = {
  title: "Lộ Trình Học & Chinh Phục HSK 3.0 Toàn Diện (Tiêu Chuẩn Mới 2026)",
  subtitle: "Cấu trúc 3 Cấp 9 Bậc • Định hướng từ Sơ cấp (HSK 1) đến Chuyên nghiệp (HSK 6) & Biên - Phiên dịch (HSK 7-9)",
  source: "Biên soạn theo tiêu chuẩn Hanban & Khung tự học Tiếng Trung Thượng Hải",
  
  // 1. Comparison & Standards Table
  standardsTable: [
    {
      level: "HSK 1",
      tier: "Sơ cấp (Bậc 1)",
      wordsOld: 150,
      wordsNew: 500,
      charsNew: 269,
      grammarPoints: 48,
      cefr: "A1",
      targetAbility: "Nắm phát âm Pinyin chuẩn, nhận diện nét chữ, chào hỏi và giới thiệu bản thân cơ bản."
    },
    {
      level: "HSK 2",
      tier: "Sơ cấp (Bậc 2)",
      wordsOld: 300,
      wordsNew: 1272,
      charsNew: 600,
      grammarPoints: 82,
      cefr: "A2",
      targetAbility: "Giao tiếp đời sống hàng ngày: gia đình, mua sắm, ăn uống, thời tiết, hỏi đường, du lịch cơ bản."
    },
    {
      level: "HSK 3",
      tier: "Sơ cấp (Bậc 3)",
      wordsOld: 600,
      wordsNew: 2245,
      charsNew: 900,
      grammarPoints: 129,
      cefr: "B1",
      targetAbility: "Đọc hiểu văn bản ngắn không cần Pinyin, tự tin du lịch tự túc khắp Trung Quốc, đủ sức thi HSKK Sơ cấp."
    },
    {
      level: "HSK 4",
      tier: "Trung cấp (Bậc 4)",
      wordsOld: 1200,
      wordsNew: 3245,
      charsNew: 1200,
      grammarPoints: 170,
      cefr: "B2",
      targetAbility: "Thảo luận về công việc, văn hóa, xã hội; bắt đầu tiếp cận kỹ năng Dịch thuật sơ cấp và thi HSKK Trung cấp."
    },
    {
      level: "HSK 5",
      tier: "Trung cấp (Bậc 5)",
      wordsOld: 2500,
      wordsNew: 4316,
      charsNew: 1500,
      grammarPoints: 210,
      cefr: "C1",
      targetAbility: "Đọc báo chí, xem phim và thời sự không phụ đề, đàm phán thương mại, dịch song ngữ Trung - Việt chuẩn xác."
    },
    {
      level: "HSK 6",
      tier: "Trung cấp (Bậc 6)",
      wordsOld: 5000,
      wordsNew: 5456,
      charsNew: 1800,
      grammarPoints: 240,
      cefr: "C2",
      targetAbility: "Thành thạo như người bản xứ, viết luận văn học thuật, diễn thuyết, nắm vững các thành ngữ và điển cố văn học."
    },
    {
      level: "HSK 7 - 9",
      tier: "Cao cấp (Bậc 7 - 9)",
      wordsOld: "Chưa có",
      wordsNew: 11092,
      charsNew: 3000,
      grammarPoints: 286,
      cefr: "C2+",
      targetAbility: "Biên dịch và Phiên dịch chuyên nghiệp (cabin/nối tiếp), xử lý văn bản chính sách, ngoại giao, nghiên cứu ngôn ngữ học."
    }
  ],

  // 2. 6-Stage Roadmap (from 0 to HSK 6 & 7-9)
  stages: [
    {
      id: "stage_1",
      stageNumber: 1,
      title: "Giai Đoạn 1: Xây Nền Vững Chắc (HSK 1 - 2)",
      targetLevel: "HSK 1 – 2 (Sơ Cấp)",
      badgeColor: "rose",
      targetWords: "1.272 từ vựng • 600 chữ Hán",
      duration: "4 tháng (16 tuần)",
      dailyTime: "90 phút mỗi ngày",
      dailyPlan: [
        { time: "20 phút", task: "Chuẩn hóa phát âm 21 Thanh mẫu, 36 Vận mẫu và 4 Thanh điệu Pinyin cùng Audio chuẩn." },
        { time: "40 phút", task: "Học từ vựng qua hình ảnh và 214 Bộ Thủ Khang Hy để khắc sâu cấu trúc mặt chữ." },
        { time: "30 phút", task: "Luyện viết theo quy tắc bút thuận trên ô Điền Tự Cách và làm bài tập sách HSK Standard Course." }
      ],
      milestone: "Giao tiếp thành thạo các tình huống cơ bản: Giới thiệu bản thân, Gia đình, Mua sắm, Đặt món ăn và Hỏi đường."
    },
    {
      id: "stage_2",
      stageNumber: 2,
      title: "Giai Đoạn 2: Bứt Phá Sơ Cấp (HSK 3)",
      targetLevel: "HSK 3 (Ngưỡng Cửa Trung Cấp)",
      badgeColor: "amber",
      targetWords: "2.245 từ vựng • 900 chữ Hán",
      duration: "6 – 8 tháng",
      dailyTime: "120 phút mỗi ngày",
      dailyPlan: [
        { time: "30 phút", task: "Ôn tập và phản xạ từ vựng cũ bằng hệ thống Spaced Repetition Flashcard." },
        { time: "60 phút", task: "Học bài mới, làm chủ các cấu trúc ngữ pháp bổ ngữ (kết quả, trạng thái, xu hướng) và liên từ phức." },
        { time: "30 phút", task: "Luyện nghe Shadowing và nhắc lại các đoạn hội thoại thực tế, luyện phát âm theo giọng AI." }
      ],
      milestone: "Đọc hiểu các văn bản ngắn không cần Pinyin, tự tin du lịch tự túc tại Trung Quốc, đủ năng lực thi đỗ HSKK Sơ cấp."
    },
    {
      id: "stage_3",
      stageNumber: 3,
      title: "Giai Đoạn 3: Tăng Tốc Trung Cấp (HSK 4)",
      targetLevel: "HSK 4 (Giao Tiếp Chuyên Nghiệp)",
      badgeColor: "teal",
      targetWords: "3.245 từ vựng • 1.200 chữ Hán",
      duration: "8 – 10 tháng",
      dailyTime: "120 phút mỗi ngày",
      dailyPlan: [
        { time: "40 phút", task: "Đọc hiểu văn bản về các chủ đề chuyên sâu: Môi trường, Công việc, Xã hội và Mạng xã hội." },
        { time: "50 phút", task: "Học ngữ pháp nâng cao, phân biệt ma trận từ gần nghĩa (近义词) và cấu trúc câu chữ 把, 被." },
        { time: "30 phút", task: "Luyện viết đoạn văn 80–100 chữ theo tranh và bắt đầu làm quen kỹ năng Dịch thuật sơ cấp." }
      ],
      milestone: "Làm việc tại doanh nghiệp Trung Quốc, phỏng vấn xin việc, đủ năng lực thi đỗ chứng chỉ HSK 4 & HSKK Trung cấp."
    },
    {
      id: "stage_4",
      stageNumber: 4,
      title: "Giai Đoạn 4: Chuyên Nghiệp & Thực Chiến (HSK 5)",
      targetLevel: "HSK 5 (Học Thuật & Đàm Phán)",
      badgeColor: "sky",
      targetWords: "4.316 từ vựng • 1.500 chữ Hán",
      duration: "10 – 12 tháng",
      dailyTime: "150 phút mỗi ngày",
      dailyPlan: [
        { time: "50 phút", task: "Đọc báo chí Sina, Nhân dân Nhật báo (人民日报) và đọc tiểu thuyết, tản văn hiện đại." },
        { time: "50 phút", task: "Luyện nghe bản tin thời sự CCTV-4, podcast kinh tế - công nghệ không phụ đề." },
        { time: "50 phút", task: "Luyện viết văn nghị luận 150–200 chữ và luyện dịch song ngữ Việt - Trung chuẩn xác." }
      ],
      milestone: "Đủ điều kiện xin học bổng Thạc sĩ chính phủ Trung Quốc (CSC), đàm phán hợp đồng thương mại độc lập."
    },
    {
      id: "stage_5",
      stageNumber: 5,
      title: "Giai Đoạn 5: Tinh Hoa & Thành Thạo (HSK 6)",
      targetLevel: "HSK 6 (Đỉnh Cao Ngôn Ngữ)",
      badgeColor: "purple",
      targetWords: "5.456 từ vựng • 1.800 chữ Hán",
      duration: "12 – 14 tháng",
      dailyTime: "150 phút mỗi ngày",
      dailyPlan: [
        { time: "60 phút", task: "Đọc tài liệu chuyên ngành, nghiên cứu văn hóa, thành ngữ (成语) và điển cố lịch sử." },
        { time: "50 phút", task: "Tóm tắt văn bản 1.000 chữ thành 400 chữ trong 35 phút (đặc trưng bài thi HSK 6)." },
        { time: "40 phút", task: "Tranh luận, thuyết trình các đề tài triết học, kinh tế, biến đổi khí hậu và AI." }
      ],
      milestone: "Sử dụng tiếng Trung như tiếng mẹ đẻ, đủ điều kiện học Tiến sĩ hoặc làm chuyên viên đối ngoại cao cấp."
    },
    {
      id: "stage_6",
      stageNumber: 6,
      title: "Giai Đoạn 6: Cao Cấp & Biên - Phiên Dịch (HSK 7 - 9)",
      targetLevel: "HSK 7 – 9 (Đẳng Cấp Chuyên Gia)",
      badgeColor: "indigo",
      targetWords: "11.092 từ vựng • 3.000 chữ Hán",
      duration: "18 – 24 tháng",
      dailyTime: "Luyện dịch chuyên sâu",
      dailyPlan: [
        { time: "60 phút", task: "Biên dịch văn bản luật pháp, thương mại, báo cáo tài chính quốc tế và khoa học công nghệ." },
        { time: "60 phút", task: "Luyện phiên dịch nối tiếp (consecutive) và phiên dịch song song (simultaneous) từ băng âm thanh." },
        { time: "30 phút", task: "Nghiên cứu văn ngôn, Hán học cổ đại và thuật ngữ dịch thuật chuyên ngành." }
      ],
      milestone: "Trở thành Biên dịch viên / Phiên dịch viên cabin chuyên nghiệp, chuyên gia ngôn ngữ học hàng đầu."
    }
  ],

  // 3. Essential Grammar Points (48 Points for HSK 1 - 3 & Advanced)
  grammarSections: [
    {
      level: "HSK 1",
      title: "Trọng Tâm Ngữ Pháp HSK 1 (14 Cấu Trúc Cơ Bản)",
      items: [
        { name: "Trật tự câu chuẩn", formula: "Chủ ngữ + Động từ + Tân ngữ (S + V + O)", example: "我学中文。(Tôi học tiếng Trung.)" },
        { name: "Câu phán đoán 是", formula: "Chủ ngữ + 是 + Tân ngữ", example: "他是中国人。(Anh ấy là người Trung Quốc.)" },
        { name: "Định ngữ & Trợ từ 的", formula: "Định ngữ + 的 + Trung tâm ngữ", example: "我的书很新。(Sách của tôi rất mới.)" },
        { name: "Câu nghi vấn chữ 吗", formula: "Câu trần thuật + 吗?", example: "你好吗？(Bạn có khỏe không?)" },
        { name: "Câu biểu thị sở hữu 有", formula: "Chủ ngữ + 有/没有 + Tân ngữ", example: "我有三个苹果。(Tôi có 3 quả táo.)" },
        { name: "Cấu trúc số lượng", formula: "Số từ + Lượng từ + Danh từ", example: "一个人 (một người), 两本书 (hai cuốn sách)" },
        { name: "Câu hỏi tỉnh lược 呢", formula: "Đối tượng + 呢?", example: "我很好，你呢？(Tôi rất khỏe, còn bạn thì sao?)" },
        { name: "Động từ năng nguyện 会 / 想", formula: "Chủ ngữ + 会/想 + Động từ", example: "我会说汉语。(Tôi biết nói tiếng Hán.)" },
        { name: "Từ để hỏi 怎么 (Cách thức)", formula: "怎么 + Động từ?", example: "这个字怎么读？(Chữ này đọc như thế nào?)" },
        { name: "Từ để hỏi 怎么样 (Tính chất)", formula: "Chủ ngữ + 怎么样?", example: "今天天气怎么样？(Thời tiết hôm nay thế nào?)" },
        { name: "Câu hỏi chính phản", formula: "Chủ ngữ + Động từ + 不 + Động từ?", example: "你去不去学校？(Bạn có đi trường học không?)" },
        { name: "Hành động đang diễn ra 正在", formula: "Chủ ngữ + 正在 + Động từ + (呢)", example: "我正在吃饭呢。(Tôi đang ăn cơm.)" },
        { name: "Cấu trúc cảm thán 太...了", formula: "太 + Tính từ + 了!", example: "太好了！(Tốt quá rồi!)" },
        { name: "Phó từ chỉ nơi chốn 在", formula: "Chủ ngữ + 在 + Địa điểm + Động từ", example: "我在家看书。(Tôi đọc sách ở nhà.)" }
      ]
    },
    {
      level: "HSK 2",
      title: "Trọng Tâm Ngữ Pháp HSK 2 (18 Cấu Trúc Mở Rộng)",
      items: [
        { name: "Bổ ngữ kết quả (完, 到, 见, 懂)", formula: "Động từ + Bổ ngữ kết quả", example: "我吃完了。(Tôi ăn xong rồi.) / 我听懂了。(Tôi nghe hiểu rồi.)" },
        { name: "Bổ ngữ trạng thái với 得", formula: "Động từ + 得 + Phó từ + Tính từ", example: "她说得很慢。(Cô ấy nói rất chậm.)" },
        { name: "Câu so sánh chữ 比", formula: "A + 比 + B + Tính từ", example: "今天比昨天冷。(Hôm nay lạnh hơn hôm qua.)" },
        { name: "Câu so sánh chữ 没有", formula: "A + 没有 + B + Tính từ", example: "他没有我高。(Anh ấy không cao bằng tôi.)" },
        { name: "Trợ từ động thái 过 (Từng)", formula: "Động từ + 过", example: "我去过北京。(Tôi từng đi Bắc Kinh.)" },
        { name: "Trợ từ động thái 着 (Trạng thái duy trì)", formula: "Động từ + 着", example: "门开着呢。(Cửa đang mở.)" },
        { name: "Hành động sắp diễn ra 快要...了", formula: "快要 / 就要 + Động từ + 了", example: "火车快要开了。(Tàu hỏa sắp chạy rồi.)" },
        { name: "Cặp liên từ Vì... nên... (因为...所以...)", formula: "因为 + Nguyên nhân, 所以 + Kết quả", example: "因为下雨，所以我没去。(Vì trời mưa nên tôi không đi.)" },
        { name: "Cặp liên từ Tuy... nhưng... (虽然...但是...)", formula: "虽然 + Vế 1, 但是 + Vế 2", example: "虽然很累，但是很开心。(Tuy rất mệt nhưng rất vui.)" },
        { name: "Cặp liên từ Nếu... thì... (如果...就...)", formula: "如果 + Giả thiết, 就 + Kết quả", example: "如果你去，我就去。(Nếu bạn đi thì tôi đi.)" },
        { name: "Vừa... vừa... (一边...一边...)", formula: "一边 + Động từ 1, 一边 + Động từ 2", example: "他一边吃饭，一边看电视。(Anh ấy vừa ăn cơm vừa xem TV.)" },
        { name: "Càng ngày càng... (越来越...)", formula: "越来越 + Tính từ / Động từ tâm lý", example: "中文越来越有意思。(Tiếng Trung ngày càng thú vị.)" }
      ]
    },
    {
      level: "HSK 3",
      title: "Trọng Tâm Ngữ Pháp HSK 3 (22 Cấu Trúc Liên Kết & Bổ Ngữ Phức)",
      items: [
        { name: "Bổ ngữ xu hướng phức (起来, 出来, 下去, 过来)", formula: "Động từ + Bổ ngữ xu hướng", example: "大家笑了起来。(Mọi người cười òa lên.) / 坚持下去 (Kiên trì tiếp tục)" },
        { name: "Câu bị động chữ 被 (Bị / Được)", formula: "Chủ ngữ (bị tác động) + 被 + Chủ thể tác động + Động từ + Thành phần khác", example: "苹果被弟弟吃了。(Quả táo bị em trai ăn mất rồi.)" },
        { name: "Câu xử lý chữ 把 hoàn chỉnh", formula: "Chủ ngữ + 把 + Tân ngữ + Động từ + Kết quả/Nơi chốn", example: "请把书放在桌子上。(Xin hãy đặt sách lên bàn.)" },
        { name: "Bổ ngữ khả năng (得 / 不)", formula: "Động từ + 得/不 + Bổ ngữ kết quả/xu hướng", example: "我听得懂 (Tôi nghe hiểu được) / 我做不完 (Tôi không làm xong được)" },
        { name: "Liên từ Không những... mà còn... (不仅...而且...)", formula: "不仅 + Điểm 1, 而且 + Điểm 2", example: "他不仅聪明，而且很努力。(Anh ấy không chỉ thông minh mà còn rất nỗ lực.)" },
        { name: "Liên từ Chỉ cần... là... (只要...就...)", formula: "只要 + Điều kiện, 就 + Kết quả", example: "只要努力，就能成功。(Chỉ cần nỗ lực là có thể thành công.)" },
        { name: "Liên từ Chỉ có... mới... (只有...才...)", formula: "只有 + Điều kiện duy nhất, 才 + Kết quả", example: "只有多练习，才能学好。(Chỉ có luyện tập nhiều mới học giỏi được.)" },
        { name: "Vừa... vừa... (又...又...)", formula: "又 + Tính từ 1 + 又 + Tính từ 2", example: "西瓜又大又甜。(Dưa hấu vừa to vừa ngọt.)" }
      ]
    }
  ],

  // 4. New Skills in HSK 3.0: Translation Exam Structure (Biên dịch & Phiên dịch)
  translationModule: {
    title: "Kỹ Năng Mới HSK 3.0: Cấu Trúc Phần Dịch (Biên Dịch & Phiên Dịch)",
    description: "Kể từ HSK 3.0, kỹ năng Dịch chính thức trở thành phần thi bắt buộc từ cấp độ 4 đến cấp độ 9, đo lường khả năng chuyển ngữ thực chiến giữa tiếng Trung và tiếng Việt.",
    levelsApplied: [
      { level: "HSK 4 – 6 (Trung cấp)", scope: "Thực hiện các bài dịch viết đoạn văn ngắn và dịch câu phản xạ ngữ cảnh thực tế." },
      { level: "HSK 7 – 9 (Cao cấp)", scope: "Dịch chuyên sâu hai chiều: Biên dịch văn bản luật/báo chí & Phiên dịch cabin/nối tiếp." }
    ],
    formats: [
      {
        type: "Biên Dịch (Dịch Viết - Translation)",
        format: "Chuyển ngữ văn bản viết hai chiều Trung - Việt",
        topics: "Mở hiệu sách (开书店), Giới trẻ nuôi thú cưng (年轻人养宠物), Quy định phòng cháy chữa cháy, Hợp đồng kinh tế, Báo cáo môi trường.",
        criteria: "Đúng ngữ pháp, dùng từ chuẩn xác, văn phong tự nhiên và đúng thuật ngữ chuyên môn."
      },
      {
        type: "Phiên Dịch (Dịch Nói / Phản Xạ - Interpretation)",
        format: "Nghe đoạn hội thoại hoặc đọc nhanh văn bản, dịch miệng ngay lập tức",
        topics: "Người cao tuổi nghiện video ngắn, Xu hướng robot hình người và AI, Lối sống xanh & Tiêu dùng tối giản, Phỏng vấn trực tiếp.",
        criteria: "Tốc độ phản xạ tức thì (<3 giây), phát âm chuẩn giọng Bắc Kinh, diễn đạt trôi chảy không ngập ngừng."
      }
    ]
  },

  // 5. New Modern Vocabulary in HSK 3.0 (Kỷ Nguyên Số & Xã Hội 2026)
  modernVocabCategories: [
    {
      category: "Kỷ Nguyên Số & Mạng Xã Hội",
      icon: "📱",
      words: [
        { hanzi: "点赞", pinyin: "diǎnzàn", meaning: "thả tim, like bài viết", example: "请给我的视频点赞！(Hãy like video của tôi nhé!)" },
        { hanzi: "粉丝", pinyin: "fěnsī", meaning: "người hâm mộ, follower", example: "他在网上有数百万粉丝。(Anh ấy có hàng triệu người theo dõi trên mạng.)" },
        { hanzi: "直播", pinyin: "zhíbō", meaning: "livestream, phát trực tiếp", example: "今晚八点开始直播带货。(8 giờ tối nay bắt đầu livestream bán hàng.)" },
        { hanzi: "刷屏", pinyin: "shuāpíng", meaning: "lướt màn hình, spam bảng tin", example: "这条新闻彻底刷屏了。(Bản tin này hoàn toàn phủ kín bảng tin.)" },
        { hanzi: "数字化", pinyin: "shùzìhuà", meaning: "số hóa, chuyển đổi số", example: "推动企业数字化转型。(Thúc đẩy chuyển đổi số doanh nghiệp.)" }
      ]
    },
    {
      category: "Công Nghệ Cao & Trí Tuệ Nhân Tạo (AI)",
      icon: "🤖",
      words: [
        { hanzi: "人工智能", pinyin: "réngōng zhìnéng", meaning: "trí tuệ nhân tạo (AI)", example: "人工智能改变了我们的生活。(AI đã thay đổi cuộc sống của chúng ta.)" },
        { hanzi: "云计算", pinyin: "yúnjìsuàn", meaning: "điện toán đám mây", example: "数据保存在云计算中心。(Dữ liệu được lưu trong trung tâm điện toán đám mây.)" },
        { hanzi: "5G网络", pinyin: "wǔ-G wǎngluò", meaning: "mạng viễn thông 5G", example: "5G网络传输速度极快。(Mạng 5G có tốc độ truyền tải cực nhanh.)" },
        { hanzi: "二维码", pinyin: "èrwéimǎ", meaning: "mã QR", example: "请扫描二维码付款。(Vui lòng quét mã QR để thanh toán.)" },
        { hanzi: "智能家居", pinyin: "zhìnéng jiājū", meaning: "nhà thông minh (Smart Home)", example: "智能家居让生活更便捷。(Smart home giúp cuộc sống tiện lợi hơn.)" }
      ]
    },
    {
      category: "Kinh Tế Số & Thương Mại Điện Tử",
      icon: "💳",
      words: [
        { hanzi: "电子商务", pinyin: "diànzǐ shāngwù", meaning: "thương mại điện tử (TMĐT)", example: "中国电子商务发展迅猛。(TMĐT Trung Quốc phát triển vượt bậc.)" },
        { hanzi: "物流", pinyin: "wùliú", meaning: "ngành vận tải logistics", example: "现代物流配送非常准时。(Dịch vụ logistics hiện đại giao hàng rất đúng giờ.)" },
        { hanzi: "跨境支付", pinyin: "kuàjìng zhīfù", meaning: "thanh toán xuyên biên giới", example: "支持多种跨境支付方式。(Hỗ trợ nhiều phương thức thanh toán xuyên biên giới.)" },
        { hanzi: "快递", pinyin: "kuàidì", meaning: "chuyển phát nhanh, shipper", example: "您的快递已经到达驿站。(Hàng chuyển phát của bạn đã đến bưu cục.)" }
      ]
    },
    {
      category: "Môi Trường Xanh & Lối Sống Mới",
      icon: "🌱",
      words: [
        { hanzi: "垃圾分类", pinyin: "lājī fēnlèi", meaning: "phân loại rác thải", example: "人人都要参与垃圾分类。(Mọi người đều phải tham gia phân loại rác.)" },
        { hanzi: "绿色出行", pinyin: "lǜsè chūxíng", meaning: "di chuyển xanh (đi bộ, xe đạp, tàu điện)", example: "提倡绿色出行，减少碳排放。(Khuyến khích di chuyển xanh để giảm khí thải carbon.)" },
        { hanzi: "共享单车", pinyin: "gòngxiǎng dānchē", meaning: "xe đạp công cộng chia sẻ", example: "在地铁站外扫一辆共享单车。(Quét một chiếc xe đạp công cộng ngoài ga tàu điện.)" },
        { hanzi: "新能源汽车", pinyin: "xīnnéngyuán qìchē", meaning: "xe năng lượng mới (xe điện)", example: "新能源汽车越来越普及。(Xe điện ngày càng trở nên phổ biến.)" }
      ]
    }
  ],

  // 6. Free Download Resources & Practice Mock Exams
  freeResources: [
    {
      name: "Trọn Bộ Giáo Trình Chuẩn HSK 3.0 Standard Course (HSK 1 - 6)",
      desc: "Sách giáo khoa điện tử PDF chất lượng cao kèm toàn bộ file Audio MP3 thu âm người bản xứ.",
      format: "PDF + MP3 Audio",
      badge: "Giáo Trình Chuẩn",
      linkUrl: "https://tiengtrungthuonghai.vn/tuyen-tap-tai-lieu-on-thi-hsk-3-0-mien-phi/"
    },
    {
      name: "Bộ Đề Thi Mô Phỏng Chuẩn HSK 3.0 Mới Nhất",
      desc: "Tổng hợp các đề thi thử cập nhật cấu trúc 4 kỹ năng Nghe - Nói - Đọc - Viết có đáp án chi tiết.",
      format: "PDF + Audio + Đáp án",
      badge: "Đề Thi Thực Chiến",
      linkUrl: "https://tiengtrungthuonghai.vn/tuhoctiengtrung/tong-hop-de-mo-phong-de-thi-hsk-3-0/"
    },
    {
      name: "Sổ Tay Từ Vựng 500 Từ HSK 1 & 1.272 Từ HSK 2 Bản 3.0",
      desc: "File từ vựng tổng hợp đầy đủ Chữ Hán, Pinyin, Hán Việt và câu ví dụ minh họa.",
      format: "PDF Sổ Tay",
      badge: "Từ Vựng Cốt Lõi",
      linkUrl: "https://tiengtrungthuonghai.vn/tuhoctiengtrung/tu-vung-hsk-3-0-can-bao-nhieu/"
    },
    {
      name: "Tài Liệu Chuyên Đề Luyện Dịch HSK 3.0 (Trung Cấp - Cao Cấp)",
      desc: "Tài liệu phương pháp dịch thuật và tuyển tập bài tập dịch thuật thực chiến từ Đại học Hà Nội & Bắc Kinh.",
      format: "PDF Chuyên Sâu",
      badge: "Kỹ Năng Mới",
      linkUrl: "https://tiengtrungthuonghai.vn/tuhoctiengtrung/cau-truc-phan-dich-trong-hsk-3-0/"
    }
  ]
};

fs.writeFileSync('data/hsk30_roadmap.json', JSON.stringify(roadmapData, null, 2), 'utf8');
console.log('Successfully written data/hsk30_roadmap.json! Size:', fs.statSync('data/hsk30_roadmap.json').size, 'bytes');
