// scripts/expand_confusions_synonyms.cjs
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/confusions.json');
const currentList = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const NEW_PAIRS = [
  {
    id: 'biaoshi_biaoda_biaoxian',
    pair: '表示 (biǎoshì) vs 表达 (biǎodá) vs 表现 (biǎoxiàn)',
    meaning: 'Đều dịch là "bày tỏ / biểu đạt / biểu hiện"',
    difference: '表示 dùng lời nói, nét mặt, hành động làm dấu hiệu để tỏ rõ thái độ/ý kiến; 表达 nhấn mạnh diễn đạt tư tưởng, tình cảm sâu kín thành lời văn hoặc ngôn từ trọn vẹn; 表现 nhấn mạnh hành vi, tác phong bộc lộ ra ngoài cho người khác thấy hoặc biểu hiện công tác.',
    comparisonTable: [
      { aspect: 'Đối tượng biểu đạt', wordA: '表示: Thái độ, ý kiến, lời chào, sự cảm ơn', wordB: '表达: Tình cảm sâu kín, tư tưởng, lòng biết ơn', wordC: '表现: Hành vi, phong độ, tài năng, thành tích' },
      { aspect: 'Cách thức bộc lộ', wordA: '表示: Lời nói, cử chỉ, ký hiệu quy ước', wordB: '表达: Lời văn, câu từ, nghệ thuật, thơ ca', wordC: '表现: Thái độ thực tế, tác phong làm việc' },
      { aspect: 'Chức năng ngữ pháp', wordA: '表示: Động từ / Danh từ', wordB: '表达: Động từ', wordC: '表现: Động từ / Danh từ' }
    ],
    mnemonic: 'Thái độ ý kiến dùng 表示; Tình cảm văn từ dùng 表达; Hành vi năng lực bộc lộ dùng 表现.',
    quiz: {
      question: 'Chọn từ chuẩn: 他用生动的诗句____了对故乡山水的无限眷恋。',
      options: ['表达 (biǎodá)', '表示 (biǎoshì)', '表现 (biǎoxiàn)'],
      correct: 0,
      explanation: 'Bày tỏ tình cảm, tư tưởng sâu sắc thông qua câu từ, thơ văn bắt buộc dùng 表达.'
    }
  },
  {
    id: 'linshi_zanshi',
    pair: '临时 (línshí) vs 暂时 (zànshí)',
    meaning: 'Đều dịch là "tạm thời"',
    difference: '临时 nhấn mạnh sự việc xảy ra bất ngờ sát giờ, không tính toán trước (lâm thời, tạm thời ứng biến); 暂时 nhấn mạnh khoảng thời gian ngắn, sau đó sẽ tiếp tục hoặc có phương án chính thức.',
    comparisonTable: [
      { aspect: 'Tính chất thời gian', wordA: '临时: Sát thời điểm, phát sinh ngoài dự kiến', wordB: '暂时: Một khoảng thời gian ngắn hạn' },
      { aspect: 'Khả năng làm định ngữ', wordA: '临时: Có thể làm định ngữ (临时工 - nhân viên tạm thời)', wordB: '暂时: Hiếm khi làm định ngữ trực tiếp' },
      { aspect: 'Ví dụ điển hình', wordA: '临时决定, 临时改变计划', wordB: '暂时离开, 暂时停止营业' }
    ],
    mnemonic: 'Sát giờ phát sinh gấp là 临时; Khoảng thời gian ngắn hạn là 暂时.',
    quiz: {
      question: 'Vì việc gia đình đột xuất, anh ấy ____ quyết định hủy chuyến công tác.',
      options: ['临时 (línshí)', '暂时 (zànshí)'],
      correct: 0,
      explanation: 'Quyết định sát giờ ngoài dự kiến dùng 临时决定.'
    }
  },
  {
    id: 'fanying_fanying2',
    pair: '反应 (fǎnyìng) vs 反映 (fǎnyìng)',
    meaning: 'Cùng âm Hán Việt nhưng nghĩa và tự hình khác nhau',
    difference: '反应 (chữ 应): Đáp ứng của cơ thể trước kích thích (dị ứng thuốc, phản xạ thần kinh) hoặc phản ứng hóa học/tâm lý; 反映 (chữ 映 - ánh xạ): Phản ánh thực tế khách quan, báo cáo tình hình, ý kiến của quần chúng lên cấp trên.',
    comparisonTable: [
      { aspect: 'Tự hình & Bộ thủ', wordA: '反应: Chữ 应 (tâm lý, đối ứng)', wordB: '反映: Chữ 映 (bộ Nhật - ánh xạ soi chiếu)' },
      { aspect: 'Lĩnh vực áp dụng', wordA: '反应: Y học, sinh học, hóa học, tâm lý phản xạ', wordB: '反映: Xã hội học, báo cáo cấp trên, văn học hiện thực' },
      { aspect: 'Cụm từ điển hình', wordA: '药物反应, 化学反应, 反应敏捷', wordB: '反映问题, 反映民意, 反映真实情况' }
    ],
    mnemonic: 'Cơ thể dị ứng thuốc dùng 反应; Báo cáo ý kiến lên lãnh đạo dùng 反映.',
    quiz: {
      question: 'Người dân đại diện họp tổ dân phố để ____ tâm tư nguyện vọng lên ủy ban nhân dân:',
      options: ['反映 (fǎnyìng)', '反应 (fǎnyìng)'],
      correct: 0,
      explanation: 'Phản ánh tiếng nói, ý kiến lên cơ quan cấp trên dùng 反映 (bộ Nhật).'
    }
  },
  {
    id: 'zhiding_zhiding2',
    pair: '制定 (zhìdìng) vs 制订 (zhìdìng)',
    meaning: 'Đều có nghĩa là "lập ra, định ra"',
    difference: '制定 (chữ 定 - cố định): Dùng cho văn bản pháp lý, hiến pháp, đường lối, quy chế có tính bắt buộc cao và ổn định lâu dài; 制订 (chữ 订 - tu chỉnh): Dùng cho kế hoạch, phương án, thỏa ước còn trong giai đoạn thảo luận, dễ sửa đổi bổ sung.',
    comparisonTable: [
      { aspect: 'Tính chất văn bản', wordA: '制定: Luật pháp, chính sách lớn, hiến pháp', wordB: '制订: Kế hoạch, dự thảo, phương án công tác' },
      { aspect: 'Độ ổn định', wordA: '制定: Cố định, trang trọng, lâu dài', wordB: '制订: Có thể điều chỉnh, linh hoạt tu chính' }
    ],
    mnemonic: 'Luật pháp hiến pháp dùng 制定; Kế hoạch phương án công tác dùng 制订.',
    quiz: {
      question: 'Quốc hội họp bàn để ____ Bộ luật Bảo vệ Môi trường mới:',
      options: ['制定 (zhìdìng)', '制订 (zhìdìng)'],
      correct: 0,
      explanation: 'Văn bản luật pháp mang tính pháp lý quốc gia bắt buộc dùng 制定.'
    }
  },
  {
    id: 'duguo_duguo2',
    pair: '度过 (dùguò) vs 渡过 (dùguò)',
    meaning: 'Cùng phát âm "dùguò" nhưng phạm vi khác nhau',
    difference: '度过 (chữ 度 - thời độ): Trải qua THỜI GIAN (kỳ nghỉ, tuổi thơ, năm tháng); 渡过 (chữ 渡 - bộ Thủy): Vượt qua SÔNG NƯỚC không gian hoặc vượt qua KHỦNG HOẢNG, khó khăn gian khổ.',
    comparisonTable: [
      { aspect: 'Đối tượng đi kèm', wordA: '度过: Thời gian, kỳ nghỉ, thanh xuân, cuối tuần', wordB: '渡过: Sông biển, khó khăn, nguy cơ, khủng hoảng tài chính' },
      { aspect: 'Bộ thủ gợi ý', wordA: '度过: Chữ 度 chỉ độ dài thời gian', wordB: '渡过: Bộ Thủy (氵) chỉ bến đò qua sông' }
    ],
    mnemonic: 'Thời gian kỳ nghỉ dùng 度过; Qua sông vượt qua khó khăn khủng hoảng dùng 渡过.',
    quiz: {
      question: 'Trong câu "全厂职工齐心协力____了这次严重的经济危机。", từ đúng là:',
      options: ['渡过 (dùguò - có bộ Thủy)', '度过 (dùguò)'],
      correct: 0,
      explanation: 'Vượt qua nguy cơ, khủng hoảng khó khăn bắt buộc dùng 渡过.'
    }
  },
  {
    id: 'pinwei_pinwei2',
    pair: '品味 (pǐnwèi) vs 品位 (pǐnwèi)',
    meaning: 'Đều dịch là "thưởng thức / gu thẩm mỹ / phẩm vị"',
    difference: '品味 (chữ 味 - mùi vị): Động từ biểu thị nếm trải, thưởng thức hương vị nghệ thuật ẩm thực; 品位 (chữ 位 - vị trí đẳng cấp): Danh từ chỉ đẳng cấp, gu thẩm mỹ, phẩm chất tao nhã của một con người hoặc sản phẩm.',
    comparisonTable: [
      { aspect: 'Từ loại cốt lõi', wordA: '品味: Động từ (chủ yếu) / Danh từ', wordB: '品位: Danh từ' },
      { aspect: 'Ý nghĩa trọng tâm', wordA: '品味: Thưởng thức, chiêm nghiệm, nhâm nhi', wordB: '品位: Đẳng cấp, phong cách, gu sang trọng' },
      { aspect: 'Ví dụ', wordA: '品味咖啡, 细细品味其中的哲理', wordB: '品位高雅, 很有品位' }
    ],
    mnemonic: 'Thưởng thức nếm trải dùng 品味; Đẳng cấp gu thời trang dùng 品位.',
    quiz: {
      question: 'Khen ngợi một người phụ nữ ăn mặc rất có gu tao nhã, sang trọng:',
      options: ['她的穿戴非常很有品位。(Đúng - danh từ chỉ gu)', '她的穿戴非常很有品味。(Sai)'],
      correct: 0,
      explanation: 'Chỉ đẳng cấp, gu thẩm mỹ tao nhã dùng danh từ 品位 (chữ 位).'
    }
  },
  {
    id: 'qifa_qishi',
    pair: '启发 (qǐfā) vs 启示 (qǐshì)',
    meaning: 'Đều mang nghĩa "gợi mở / bài học"',
    difference: '启发 (động từ): Khơi gợi, gợi mở tư duy cho người khác thông qua ví dụ hoặc dẫn dắt; 启示 (danh từ): Bài học triết lý, sự khai sáng mà người ta tự giác ngộ, rút ra từ một hiện tượng.',
    comparisonTable: [
      { aspect: 'Từ loại', wordA: '启发: Động từ', wordB: '启示: Danh từ (chủ yếu)' },
      { aspect: 'Hướng tác động', wordA: '启发: A gợi mở tư duy cho B (老师启发学生)', wordB: '启示: Bài học mà B tự ngộ ra (得到深刻的启示)' }
    ],
    mnemonic: 'Khơi gợi người khác dùng 启发; Bài học tự mình rút ra dùng 启示.',
    quiz: {
      question: 'Câu chuyện ngụ ngôn này đã cho chúng tôi một bài học đạo lý sâu sắc:',
      options: ['给了我们深刻的启示。(Đúng - danh từ)', '给了我们深刻的启发。(Không chuẩn bằng 启示)'],
      correct: 0,
      explanation: 'Bài học triết lý rút ra từ câu chuyện mang tính chân lý dùng danh từ 启示.'
    }
  },
  {
    id: 'shuxi_shulian',
    pair: '熟悉 (shúxī) vs 熟练 (shúliàn)',
    meaning: 'Đều có nghĩa là "quen / thạo"',
    difference: '熟悉: Quen thuộc, hiểu rõ về một sự vật, địa phương, con người (biết rõ ngọn nguồn); 熟练: Thành thạo, điêu luyện về thao tác kỹ thuật, tay nghề nhờ rèn luyện nhiều lần.',
    comparisonTable: [
      { aspect: 'Đối tượng áp dụng', wordA: '熟悉: Con người, hoàn cảnh, đường sá, chính sách', wordB: '熟练: Thao tác, kỹ năng, tay nghề, gõ bàn phím' },
      { aspect: 'Từ loại', wordA: '熟悉: Động từ / Tính từ', wordB: '熟练: Tính từ' }
    ],
    mnemonic: 'Quen người quen đường dùng 熟悉; Tay nghề thành thạo điêu luyện dùng 熟练.',
    quiz: {
      question: 'Anh ấy gõ bàn phím bằng 10 ngón tay vô cùng ____:',
      options: ['熟练 (shúliàn)', '熟悉 (shúxī)'],
      correct: 0,
      explanation: 'Kỹ năng tay nghề điêu luyện dùng 熟练.'
    }
  },
  {
    id: 'xingkui_duokui',
    pair: '幸亏 (xìngkuī) vs 多亏 (duōkuī) vs 好在 (hǎozài)',
    meaning: 'Đều dịch là "may mà / nhờ có"',
    difference: '幸亏 nhấn mạnh may mắn tránh được một hậu quả tồi tệ nghiêm trọng; 多亏 (thường mang ơn) nhấn mạnh nhờ có sự giúp đỡ của ai đó mà việc được thành; 好在 mang sắc thái khẩu ngữ nhẹ nhàng, biểu thị vớt vát được hoàn cảnh an ủi.',
    comparisonTable: [
      { aspect: 'Sắc thái biết ơn', wordA: '幸亏: Nhấn may mắn thoát nạn', wordB: '多亏: Nhấn lòng biết ơn đối tượng giúp đỡ', wordC: '好在: Nhấn yếu tố cứu vãn tích cực' },
      { aspect: 'Kết hợp danh từ', wordA: '幸亏: Đứng đầu mệnh đề', wordB: '多亏: Có thể trực tiếp đi với danh từ (多亏了你)', wordC: '好在: Đứng đầu mệnh đề' }
    ],
    mnemonic: 'Nhờ có ai giúp đỡ dùng 多亏 (多亏有你); May thoát nạn dùng 幸亏.',
    quiz: {
      question: 'Nhờ có bác sĩ kịp thời cấp cứu mà em bé đã bình an vô sự:',
      options: ['多亏了医生的及时抢救。(Đúng - mang ơn đối tượng)', '幸亏了医生的及时抢救。(Sai ngữ pháp - 幸亏 không đi với 了)'] ,
      correct: 0,
      explanation: 'Biểu thị mang ơn đối tượng cụ thể (có 了) dùng 多亏了.'
    }
  },
  {
    id: 'bijing_daodi',
    pair: '毕竟 (bìjìng) vs 到底 (dàodǐ) vs 究竟 (jiūjìng)',
    meaning: 'Đều dịch là "rốt cuộc / dù sao thì"',
    difference: '毕竟 biểu thị nhấn mạnh nguyên nhân cốt lõi hay bản chất không thể thay đổi ("dù sao đi nữa"); 到底 và 究竟 dùng trong câu hỏi nghi vấn để truy vấn chân tướng ("rốt cuộc là thế nào?"). Chú ý: 毕竟 KHÔNG ĐƯỢC dùng trong câu hỏi truy vấn!',
    comparisonTable: [
      { aspect: 'Dùng trong câu hỏi nghi vấn', wordA: '毕竟: TUYỆT ĐỐI KHÔNG dùng', wordB: '到底: Dùng rất phổ biến (你到底去不去？)', wordC: '究竟: Văn phong trang trọng hơn 到底' },
      { aspect: 'Ý nghĩa trần thuật', wordA: '毕竟: Nhấn mạnh bản chất, lý do khách quan', wordB: '到底: Cuối cùng đã đạt được (到底成功了)', wordC: '究竟: Ít dùng khẳng định đơn thuần' }
    ],
    mnemonic: 'Câu hỏi nghi vấn truy hỏi dùng 到底 / 究竟; Trần thuật khẳng định bản chất dùng 毕竟.',
    quiz: {
      question: 'Câu hỏi nghi vấn: "你____打算什么时候跟我们说实话？" (Rốt cuộc bạn định khi nào nói thật?) KHÔNG THỂ điền từ nào?',
      options: ['毕竟 (bìjìng - TUYỆT ĐỐI KHÔNG dùng trong câu hỏi)', '到底 (dàodǐ - Dùng tốt)', '究竟 (jiūjìng - Dùng tốt)'],
      correct: 0,
      explanation: '毕竟 chỉ dùng trong câu trần thuật biểu thị "dù sao thì", cấm kỵ dùng trong câu hỏi nghi vấn.'
    }
  },
  {
    id: 'kuajiang_biaoyang',
    pair: '夸奖 (kuājiǎng) vs 表扬 (biǎoyáng) vs 称赞 (chēngzàn)',
    meaning: 'Đều mang nghĩa "khen ngợi"',
    difference: '夸奖 thường dùng trong quan hệ hàng ngày, người lớn khen trẻ nhỏ hoặc người khác khen ngợi thành tích; 表扬 mang tính tổ chức, tập thể, cấp trên tuyên dương công khai cấp dưới; 称赞 mang sắc thái văn viết trang trọng, ca ngợi phẩm đức cao đẹp.',
    comparisonTable: [
      { aspect: 'Tính chất bối cảnh', wordA: '夸奖: Giao tiếp đời thường, khẩu ngữ', wordB: '表扬: Trường học, công ty, tuyên dương công khai', wordC: '称赞: Văn viết, ca ngợi phẩm chất' },
      { aspect: 'Cấp bậc', wordA: '夸奖: Bất kỳ, người lớn khen trẻ con', wordB: '表扬: Cấp trên khen cấp dưới', wordC: '称赞: Mọi người ca ngợi' }
    ],
    mnemonic: 'Đời thường khen nhau dùng 夸奖; Cấp trên tuyên dương công khai dùng 表扬.',
    quiz: {
      question: 'Ban giám đốc công ty quyết định trao bằng khen ____ nhóm dự án xuất sắc:',
      options: ['表扬 (biǎoyáng)', '夸奖 (kuājiǎng)'],
      correct: 0,
      explanation: 'Tổ chức, cơ quan tuyên dương khen thưởng tập thể/cá nhân dùng 表扬.'
    }
  },
  {
    id: 'fanwei_guimo',
    pair: '范围 (fànwéi) vs 规模 (guīmó)',
    meaning: 'Đều dịch là "phạm vi / quy mô"',
    difference: '范围: Giới hạn ranh giới (về không gian, hoạt động, đối tượng tác động); 规模: Độ lớn, tầm vóc, tầm cỡ của một công trình, tổ chức hoặc hoạt động sản xuất kinh doanh.',
    comparisonTable: [
      { aspect: 'Nội hàm cốt lõi', wordA: '范围: Ranh giới, đường bao giới hạn', wordB: '规模: Tầm vóc, mức độ hoành tráng, dung lượng' },
      { aspect: 'Cụm từ điển hình', wordA: '考试范围, 势力范围, 缩小范围', wordB: '大规模生产, 扩大经营规模, 宏伟规模' }
    ],
    mnemonic: 'Ranh giới giới hạn là 范围; Tầm vóc to lớn hoành tráng là 规模.',
    quiz: {
      question: 'Kỳ thi HSK 5 có ____ kiến thức từ vựng là 2,500 từ:',
      options: ['范围 (fànwéi)', '规模 (guīmó)'],
      correct: 0,
      explanation: 'Giới hạn ranh giới nội dung ôn thi dùng 范围: 考试范围.'
    }
  }
];

// Check and push
const existingIds = new Set(currentList.map(x => x.id));
NEW_PAIRS.forEach(pair => {
  if (!existingIds.has(pair.id)) {
    currentList.push(pair);
  }
});

fs.writeFileSync(filePath, JSON.stringify(currentList, null, 2), 'utf8');
console.log(`✓ Đã nâng cấp Cẩm Nang Phân Biệt Cặp Từ Gần Nghĩa: Tổng cộng ${currentList.length} cặp từ kinh điển.`);
