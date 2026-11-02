const fs = require('fs');
const path = require('path');

// Read existing 12 pairs
const existingPath = path.join(__dirname, 'data', 'confusions.json');
const currentPairs = JSON.parse(fs.readFileSync(existingPath, 'utf8'));

// 12 New High-Level HSK Confusing Word Pairs
const newPairs = [
  {
    id: "huozhe_haishi",
    pair: "或者 (huòzhě) vs 还是 (háishi)",
    meaning: "Đều có nghĩa là 'hoặc là / hay là'",
    difference: "或者 chỉ dùng trong câu trần thuật khẳng định. 还是 bắt buộc dùng trong câu hỏi nghi vấn lựa chọn (A hay là B?) hoặc biểu thị sự lựa chọn tối ưu sau khi cân nhắc.",
    comparisonTable: [
      {
        aspect: "Câu hỏi lựa chọn (A hay B?)",
        wordA: "你想喝茶或者咖啡？(Sai)",
        wordB: "你想喝茶还是咖啡？(Đúng chuẩn)"
      },
      {
        aspect: "Câu khẳng định trần thuật",
        wordA: "今天或者明天都可以。(Đúng chuẩn)",
        wordB: "今天还是明天都可以。(Sai ngữ pháp)"
      },
      {
        aspect: "Lựa chọn sau khi cân nhắc (Vẫn là)",
        wordA: "不能表示 '还是...吧'",
        wordB: "我们还是坐高铁去吧。(Tốt nhất là)"
      }
    ],
    mnemonic: "Hỏi lựa chọn dùng 还是 (Hải); Kể trần thuật dùng 或者 (Hoặc).",
    quiz: {
      question: "Điền từ thích hợp: 无论是晴天____下雨，他都坚持每天早起跑步。",
      options: [
        "还是 (háishi)",
        "或者 (huòzhě)"
      ],
      correct: 1,
      explanation: "Đây là câu trần thuật cấu trúc '无论...或者/还是' nhưng vế liệt kê phương án trong câu trần thuật nên dùng '或者'."
    }
  },

  {
    id: "heshi_shihe",
    pair: "合适 (héshì) vs 适合 (shìhé)",
    meaning: "Đều có nghĩa là 'thích hợp / hợp'",
    difference: "合适 là TÍNH TỪ: có thể đứng sau 很/非常, làm vị ngữ hoặc định ngữ, tuyệt đối KHÔNG MANG TÂN NGỮ. 适合 là ĐỘNG TỪ: bắt buộc mang tân ngữ theo sau (phù hợp với ai / cái gì).",
    comparisonTable: [
      {
        aspect: "Mang tân ngữ phía sau",
        wordA: "这件衣服很合适你。(Sai hoàn toàn)",
        wordB: "这件衣服很适合你。(Đúng chuẩn)"
      },
      {
        aspect: "Làm vị ngữ độc lập (không tân ngữ)",
        wordA: "这双鞋子不大不小，正好合适。(Đúng)",
        wordB: "这双鞋子不大不小，正好适合。(Sai thiếu O)"
      },
      {
        aspect: "Làm định ngữ (Tính từ + 的 + Danh từ)",
        wordA: "寻找合适的工作 (Công việc thích hợp - Đúng)",
        wordB: "寻找适合的工作 (Ít tự nhiên hơn)"
      }
    ],
    mnemonic: "Có tân ngữ theo sau dùng 适合; Đứng một mình làm tính từ dùng 合适.",
    quiz: {
      question: "Chọn từ đúng: 这份工作对性格开朗的人非常______。",
      options: [
        "合适 (héshì)",
        "适合 (shìhé)"
      ],
      correct: 0,
      explanation: "Phía sau chỗ trống không có tân ngữ và đứng sau phó từ chỉ mức độ '非常' nên bắt buộc phải dùng tính từ '合适'."
    }
  },

  {
    id: "yuanlai_benlai",
    pair: "原来 (yuánlái) vs 本来 (běnlái)",
    meaning: "Đều có nghĩa là 'vốn dĩ / ban đầu'",
    difference: "原来 dùng khi bất ngờ phát hiện ra một sự thật mà trước đó mình chưa biết ('Hóa ra là...'). 本来 nhấn mạnh bản chất vốn có theo lẽ thường, hoặc dự định ban đầu nhưng sau đó bị thay đổi.",
    comparisonTable: [
      {
        aspect: "Hóa ra là (Bất ngờ phát hiện chân tướng)",
        wordA: "原来是你啊！我刚才没认出来。(Đúng)",
        wordB: "本来是你啊！(Sai nghĩa hoàn toàn)"
      },
      {
        aspect: "Lẽ ra, đáng lẽ (Chỉ nghĩa vụ/lý lẽ)",
        wordA: "不能表示 'đáng lẽ phải thế'",
        wordB: "这件事本来就应该由你负责。(Đáng lẽ)"
      },
      {
        aspect: "Dự định ban đầu bị thay đổi",
        wordA: "我原来打算去北京，后来没去。(Được)",
        wordB: "我本来打算去北京，后来没去。(Rất phổ biến)"
      }
    ],
    mnemonic: "Ngộ ra chân tướng bất ngờ dùng 原来; Đáng lẽ vốn dĩ theo lý lẽ dùng 本来.",
    quiz: {
      question: "Điền từ thích hợp: 找了半天钥匙，______它一直在我的大衣口袋里！",
      options: [
        "原来 (yuánlái)",
        "本来 (běnlái)"
      ],
      correct: 0,
      explanation: "Biểu thị sự phát hiện ngạc nhiên về một sự thật mà trước đó không hay biết (Hóa ra là...) nên dùng '原来'."
    }
  },

  {
    id: "guanyu_duiyu",
    pair: "关于 (guānyú) vs 对于 (duìyú)",
    meaning: "Đều là giới từ chỉ 'về / đối với'",
    difference: "关于 chỉ phạm vi chủ đề của bài viết, cuốn sách hoặc câu chuyện ('Về vấn đề này...'). 对于 chỉ đối tượng tiếp nhận tác động, thái độ hoặc quan điểm hướng tới.",
    comparisonTable: [
      {
        aspect: "Giới thiệu chủ đề sách/báo/nghiên cứu",
        wordA: "一本关于中国历史的书 (Đúng chuẩn)",
        wordB: "一本对于中国历史的书 (Sai)"
      },
      {
        aspect: "Thái độ/quan điểm đối với sự việc",
        wordA: "不能用: 关于这个问题，他的态度很坚决。(Gượng)",
        wordB: "对于这个问题，他的态度很坚决。(Đúng)"
      },
      {
        aspect: "Vị trí trong câu",
        wordA: "Cụm '关于...' chỉ được đứng ĐẦU CÂU (Trước S)",
        wordB: "Cụm '对于...' có thể đứng TRƯỚC hoặc SAU Chủ ngữ"
      }
    ],
    mnemonic: "Chủ đề sách báo dùng 关于; Thái độ đối tượng dùng 对于.",
    quiz: {
      question: "Điền từ đúng: ______环境保护的重要性，专家们发表了各自的见解。",
      options: [
        "关于 (guānyú)",
        "对于 (duìyú)"
      ],
      correct: 0,
      explanation: "Giới thiệu phạm vi chủ đề bài nói/tham luận ở đầu câu nên dùng '关于'."
    }
  },

  {
    id: "jingguo_tongguo",
    pair: "经过 (jīngguò) vs 通过 (tōngguò)",
    meaning: "Đều có nghĩa là 'trải qua / thông qua'",
    difference: "经过 nhấn mạnh vào quá trình thời gian hoặc lộ trình không gian đã đi qua. 通过 nhấn mạnh vào phương thức, cầu nối trung gian, hoặc việc thi cử/xét duyệt đạt tiêu chuẩn.",
    comparisonTable: [
      {
        aspect: "Vượt qua kỳ thi / Kiểm tra đạt chuẩn",
        wordA: "我经过了HSK五级考试。(Sai ngữ pháp)",
        wordB: "我通过了HSK五级考试。(Đúng chuẩn)"
      },
      {
        aspect: "Nhờ người/kênh làm cầu nối trung gian",
        wordA: "经过朋友的介绍认识 (Không chuẩn bằng)",
        wordB: "通过朋友的介绍认识 (Đúng chuẩn phương thức)"
      },
      {
        aspect: "Quá trình thời gian/lộ trình",
        wordA: "经过半年的刻苦训练，他瘦了十斤。(Đúng)",
        wordB: "通过半年的时间 (Ít tự nhiên hơn)"
      }
    ],
    mnemonic: "Thi đỗ hoặc dùng làm phương tiện dùng 通过; Quá trình thời gian dằng dặc dùng 经过.",
    quiz: {
      question: "Điền từ đúng: 祝贺你顺利______了公司的面试，正式成为我们的一员！",
      options: [
        "通过 (tōngguò)",
        "经过 (jīngguò)"
      ],
      correct: 0,
      explanation: "Vượt qua kỳ phỏng vấn/thi tuyển sát hạch đạt chuẩn bắt buộc phải dùng '通过'."
    }
  },

  {
    id: "nanmian_weimian",
    pair: "难免 (nánmiǎn) vs 未免 (wèimiǎn)",
    meaning: "Đều biểu thị sự việc xảy ra ngoài ý muốn",
    difference: "难免 mang tính khách quan: 'Khó lòng tránh khỏi' (do quy luật tự nhiên hoặc điều kiện chưa hoàn thiện). 未免 mang tính chủ quan: Người nói cảm thấy hành vi của đối phương 'thái quá, không khỏi có phần hơi quá đáng'.",
    comparisonTable: [
      {
        aspect: "Quy luật khách quan khó tránh",
        wordA: "初学者刚开始写汉字难免会写错。(Đúng)",
        wordB: "初学者刚开始写汉字未免会写错。(Sai)"
      },
      {
        aspect: "Chê trách/đánh giá thái quá",
        wordA: "你这样做难免太不讲道理了。(Sai)",
        wordB: "你这样做未免太不讲道理了。(Đúng chuẩn)"
      }
    ],
    mnemonic: "Khách quan khó tránh dùng 难免; Chủ quan chê thái quá dùng 未免.",
    quiz: {
      question: "Điền từ thích hợp: 一个人在国外独立生活，______会有想家的时候。",
      options: [
        "难免 (nánmiǎn)",
        "未免 (wèimiǎn)"
      ],
      correct: 0,
      explanation: "Tâm lý nhớ nhà khi ở xa xứ là điều hoàn toàn tự nhiên khách quan khó tránh khỏi nên dùng '难免'."
    }
  },

  {
    id: "manzu_manyi",
    pair: "满足 (mǎnzú) vs 满意 (mǎnyì)",
    meaning: "Đều có nghĩa là 'hài lòng / thỏa mãn'",
    difference: "满足 là ĐỘNG TỪ: Thỏa mãn nhu cầu vật chất, đáp ứng tiêu chuẩn, điều kiện (mang tân ngữ: 满足要求). 满意 là TÍNH TỪ: Hài lòng về mặt tâm lý, cảm xúc (thường dùng trong cấu trúc '对...很满意', không mang tân ngữ trực tiếp).",
    comparisonTable: [
      {
        aspect: "Mang tân ngữ danh từ",
        wordA: "满足客人的需求 / 满足条件 (Đúng chuẩn)",
        wordB: "满意客人的需求 (Sai hoàn toàn)"
      },
      {
        aspect: "Cấu trúc '对...满意'",
        wordA: "不能说: 我对现在的成绩很满足。(Gượng)",
        wordB: "我对现在的成绩非常满意。(Đúng chuẩn)"
      }
    ],
    mnemonic: "Thỏa mãn nhu cầu điều kiện dùng 满足; Hài lòng tâm lý dùng 满意.",
    quiz: {
      question: "Chọn từ đúng: 经理对大家这次的工作表现感到非常______。",
      options: [
        "满意 (mǎnyì)",
        "满足 (mǎnzú)"
      ],
      correct: 0,
      explanation: "Đi sau cấu trúc '对...感到非常' chỉ cảm xúc ưng ý hài lòng nên dùng tính từ '满意'."
    }
  },

  {
    id: "zhujian_jianjian_zhubu",
    pair: "逐渐 (zhújiàn) vs 渐渐 (jiànjiàn) vs 逐步 (zhúbù)",
    meaning: "Đều có nghĩa là 'dần dần / từng bước'",
    difference: "逐渐 dùng cho sự biến đổi tăng/giảm dần theo thời gian (văn viết). 渐渐 thiên về miêu tả cảm giác, văn học. 逐步 nhấn mạnh hành động tiến hành theo TỪNG BƯỚC, có kế hoạch, giai đoạn rõ ràng.",
    comparisonTable: [
      {
        aspect: "Tiến hành theo kế hoạch/giai đoạn",
        wordA: "逐渐推进改革 (Chung chung)",
        wordB: "逐步推进改革 (Đúng chuẩn: theo từng bước kế hoạch)"
      },
      {
        aspect: "Biến đổi tự nhiên khách quan",
        wordA: "天气逐渐暖和起来了。(Đúng chuẩn)",
        wordB: "天气逐步暖和起来了。(Sai: thời tiết không có kế hoạch)"
      }
    ],
    mnemonic: "Tự nhiên biến đổi dùng 逐渐/渐渐; Có kế hoạch từng bước dùng 逐步.",
    quiz: {
      question: "Chọn từ đúng: 我们的工作要按照计划______开展，切忌操之过急。",
      options: [
        "逐步 (zhúbù)",
        "渐渐 (jiànjiàn)"
      ],
      correct: 0,
      explanation: "Có cụm từ '按照计划' (theo kế hoạch định sẵn) nên bắt buộc dùng '逐步' (từng bước một)."
    }
  },

  {
    id: "quanli_quanli",
    pair: "权利 (quánlì) vs 权力 (quánlì)",
    meaning: "Cùng phát âm là 'quánlì'",
    difference: "权利 (lợi - 利) là QUYỀN LỢI, quyền lực chính đáng theo pháp luật của công dân (đi kèm với nghĩa vụ 义务). 权力 (lực - 力) là QUYỀN LỰC thống trị, chi phối, lãnh đạo của cơ quan nhà nước hoặc người có chức vụ.",
    comparisonTable: [
      {
        aspect: "Đi kèm với nghĩa vụ công dân",
        wordA: "享受公民权利，履行公民义务。(Đúng chuẩn)",
        wordB: "享受公民权力 (Sai bản chất pháp lý)"
      },
      {
        aspect: "Quyền lực hành chính / Chi phối",
        wordA: "滥用权利 (Dùng quyền lợi cá nhân)",
        wordB: "滥用权力 (Lạm dụng chức quyền lãnh đạo - Đúng)"
      }
    ],
    mnemonic: "Lợi ích công dân là 权利 (chữ 利); Uy quyền thống trị là 权力 (chữ 力).",
    quiz: {
      question: "Điền từ đúng: 宪法赋予了每一位合法公民受教育的______。",
      options: [
        "权利 (quánlì - quyền lợi)",
        "权力 (quánlì - quyền lực)"
      ],
      correct: 0,
      explanation: "Quyền được học tập của công dân gắn liền với lợi ích chính đáng nên dùng '权利'."
    }
  },

  {
    id: "baohu_weihu",
    pair: "保护 (bǎohù) vs 维护 (wéihù)",
    meaning: "Đều có nghĩa là 'bảo vệ / gìn giữ'",
    difference: "保护 dùng cho đối tượng yếu thế, cụ thể cần che chở (bảo vệ môi trường, bảo vệ mắt, bảo vệ trẻ em). 维护 dùng cho các khái niệm trừu tượng, trang trọng: Duy trì trật tự, gìn giữ hòa bình, bảo đảm sự công bằng, bảo trì hệ thống.",
    comparisonTable: [
      {
        aspect: "Bảo vệ đối tượng cụ thể / Yếu thế",
        wordA: "保护视力 / 保护弱者 / 保护森林 (Đúng)",
        wordB: "维护视力 (Không ai nói vậy)"
      },
      {
        aspect: "Gìn giữ hòa bình / Trật tự / Uy tín",
        wordA: "保护世界和平 (Gượng)",
        wordB: "维护世界和平 / 维护国家利益 (Chuẩn xác)"
      }
    ],
    mnemonic: "Bảo bọc người/vật cụ thể dùng 保护; Duy trì trật tự hòa bình dùng 维护.",
    quiz: {
      question: "Chọn từ đúng: 联合国的主要职责之一是______国际和平与安全。",
      options: [
        "维护 (wéihù)",
        "保护 (bǎohù)"
      ],
      correct: 0,
      explanation: "Gìn giữ hòa bình và an ninh quốc tế (trừu tượng, vĩ mô) bắt buộc dùng '维护'."
    }
  },

  {
    id: "yuanyi_qingyuan",
    pair: "愿意 (yuànyì) vs 情愿 (qíngyuàn)",
    meaning: "Đều biểu thị ý nguyện cá nhân",
    difference: "愿意 là 'SẴN LÒNG', xuất phát từ sự vui vẻ và đồng thuận từ tâm can. 情愿 là 'CAM LÒNG', thường là sự lựa chọn nhượng bộ đầy miễn cưỡng trong tình thế bắt buộc (Thà chấp nhận cái này chứ không chịu cái kia).",
    comparisonTable: [
      {
        aspect: "Vui vẻ sẵn lòng làm gì",
        wordA: "我非常愿意帮助你。(Đúng: vui vẻ giúp)",
        wordB: "我非常情愿帮助你。(Gượng: miễn cưỡng)"
      },
      {
        aspect: "Cấu trúc thà... còn hơn... (宁可...也不...)",
        wordA: "我愿意饿着也不吃这种东西。(Ít dùng)",
        wordB: "我情愿挨饿，也不吃嗟来之食。(Cam lòng chịu đói)"
      }
    ],
    mnemonic: "Vui vẻ muốn làm dùng 愿意; Cam lòng thà rằng dùng 情愿.",
    quiz: {
      question: "Chọn từ đúng: 你______跟我一起去参加今晚的音乐会吗？",
      options: [
        "愿意 (yuànyì)",
        "情愿 (qíngyuàn)"
      ],
      correct: 0,
      explanation: "Lời mời gọi vui vẻ, mong đối phương bằng lòng tham gia nên dùng '愿意'."
    }
  },

  {
    id: "chixu_lianxu_jixu",
    pair: "持续 (chíxù) vs 连续 (liánxù) vs 继续 (jìxù)",
    meaning: "Đều có nghĩa là 'tiếp tục / liên tục'",
    difference: "持续 biểu thị trạng thái không ngắt quãng kéo dài liên miên (mưa kéo dài 3 ngày). 连续 biểu thị chuỗi các sự việc lặp lại nối tiếp nhau nhiều lần. 继续 biểu thị hành động sau khi tạm ngừng thì tiếp tục làm tiếp.",
    comparisonTable: [
      {
        aspect: "Tạm dừng rồi làm tiếp",
        wordA: "休息十分钟后我们继续上课。(Đúng)",
        wordB: "持续上课 / 连续上课 (Sai nghĩa tạm nghỉ)"
      },
      {
        aspect: "Số lần/ngày diễn ra liên tiếp",
        wordA: "他连续三天迟到 (Ba ngày liên tiếp - Đúng)",
        wordB: "他持续三天迟到 (Sai ngữ pháp)"
      },
      {
        aspect: "Trạng thái kéo dài không gián đoạn",
        wordA: "高温天气持续了一个星期。(Đúng chuẩn)",
        wordB: "高温天气继续了一个星期。(Sai)"
      }
    ],
    mnemonic: "Trạng thái kéo dài dùng 持续; Lặp lại nhiều đợt dùng 连续; Làm tiếp sau khi nghỉ dùng 继续.",
    quiz: {
      question: "Chọn từ đúng: 听到闹钟响了，他翻了个身，又______睡了过去。",
      options: [
        "继续 (jìxù)",
        "持续 (chíxù)",
        "连续 (liánxù)"
      ],
      correct: 0,
      explanation: "Sau khi bị đánh thức (gián đoạn), anh ấy lại ngủ tiếp nên dùng '继续'."
    }
  }
];

// Combine all 24 pairs
const allPairs = [...currentPairs, ...newPairs];
fs.writeFileSync(existingPath, JSON.stringify(allPairs, null, 2), 'utf8');
console.log(`Đã xuất sắc nâng cấp Ma Trận Từ Dễ Nhầm Lẫn lên ${allPairs.length} Cặp Từ Then Chốt tại ${existingPath}`);
