const { dataFile } = require('./paths');
const fs = require('fs');
const path = require('path');

const existingPath = dataFile('etymology.json');
const current = JSON.parse(fs.readFileSync(existingPath, 'utf8'));

const newEtymology = [
  {
    hanzi: "安",
    pinyin: "ān",
    hanviet: "An",
    meaning: "Yên bình, an toàn, ổn định",
    level: 1,
    strokeCount: 6,
    radicals: [
      { char: "宀", name: "Miên", meaning: "Mái nhà che chở" },
      { char: "女", name: "Nữ", meaning: "Người phụ nữ, người mẹ" }
    ],
    etymologyStory: "Chữ 'An' (安) cấu tạo gồm bộ Miên (宀 - mái nhà) che phủ phía trên chữ Nữ (女 - người phụ nữ). Thời cổ đại, người phụ nữ và trẻ nhỏ được an toàn ở trong nhà, có mái ấm chở che thì trong lòng mới cảm thấy bình yên, gia đình an định, xã hội an khang.",
    memoryTip: "Người phụ nữ (女) an vui dưới mái nhà (宀) chính là sự bình an (安).",
    family: [
      { char: "女", pinyin: "nǚ", meaning: "Người nữ (gốc tượng hình)" },
      { char: "安", pinyin: "ān", meaning: "Bình an, yên ổn" },
      { char: "按", pinyin: "àn", meaning: "Ấn, nhấn, theo như (thêm bộ Thủ 扌)" },
      { char: "案", pinyin: "àn", meaning: "Vụ án, cái bàn dài (thêm bộ Mộc 木)" },
      { char: "鞍", pinyin: "ān", meaning: "Yên ngựa (thêm bộ Cách 革)" }
    ],
    commonWords: ["安全 (an toàn)", "安静 (yên tĩnh)", "安心 (yên tâm)", "安排 (sắp xếp)", "平安 (bình an)"],
    example: {
      hanzi: "祝你在新的城市生活平安、工作顺利！",
      pinyin: "Zhù nǐ zài xīn de chéngshì shēnghuó píng'ān, gōngzuò shùnlì!",
      vi: "Chúc bạn ở thành phố mới cuộc sống bình an, công việc thuận lợi!"
    }
  },
  {
    hanzi: "和",
    pinyin: "hé",
    hanviet: "Hòa",
    meaning: "Hòa bình, hòa thuận, cùng với",
    level: 1,
    strokeCount: 8,
    radicals: [
      { char: "禾", name: "Hòa", meaning: "Cây lúa, ngũ cốc lương thực" },
      { char: "口", name: "Khẩu", meaning: "Cái miệng, ăn uống, tiếng nói" }
    ],
    etymologyStory: "Chữ 'Hòa' (和) ghép từ chữ 'Hòa' (禾 - bông lúa trĩu hạt) và chữ 'Khẩu' (口 - cái miệng ăn). Triết lý nông nghiệp Trung Hoa sâu sắc: Xã hội thái bình hòa thuận khi và chỉ khi mọi người dân đều có lúa gạo để ăn no ấm, tiếng nói cất lên chan hòa.",
    memoryTip: "Có lúa (禾) vào miệng (口) no ấm thì lòng người sẽ hòa thuận, thái bình (和).",
    family: [
      { char: "禾", pinyin: "hé", meaning: "Cây lúa (gốc tượng hình)" },
      { char: "和", pinyin: "hé", meaning: "Hòa bình, hòa thuận" },
      { char: "科", pinyin: "kē", meaning: "Khoa học, phân loại (Hòa + Đẩu 斗)" },
      { char: "秋", pinyin: "qiū", meaning: "Mùa thu (Lúa 禾 chín gặp lửa 火)" },
      { char: "香", pinyin: "xiāng", meaning: "Hương thơm ngào ngạt (Lúa 禾 + Nhật 日)" }
    ],
    commonWords: ["和平 (hòa bình)", "和谐 (hài hòa)", "和睦 (hòa thuận)", "温和 (ôn hòa)", "和气 (hòa nhã)"],
    example: {
      hanzi: "家和万事兴，家庭和睦才能事业有成。",
      pinyin: "Jiā hé wàn shì xīng, jiātíng hémù cái néng shìyè yǒu chéng.",
      vi: "Gia hòa vạn sự hưng, gia đình êm ấm hòa thuận thì sự nghiệp mới thăng hoa."
    }
  },
  {
    hanzi: "爱",
    pinyin: "ài",
    hanviet: "Ái",
    meaning: "Yêu thương, quý mến",
    level: 1,
    strokeCount: 10,
    radicals: [
      { char: "爪/爫", name: "Trảo", meaning: "Bàn tay vuốt ve" },
      { char: "冖", name: "Mịch", meaning: "Bao bọc, che chở" },
      { char: "心", name: "Tâm", meaning: "Trái tim (trong chữ phồn thể 愛)" },
      { char: "友", name: "Hữu", meaning: "Bạn bè, bè bạn (trong chữ giản thể)" }
    ],
    etymologyStory: "Trong chữ cổ (愛), tình yêu bắt nguồn từ trái tim (心), dùng bàn tay che chở và bước chân theo đuổi không rời. Ở dạng giản thể hiện đại, chữ 爱 kết hợp giữa sự chở che và tình bạn chân thành (友), tình yêu bắt đầu từ sự thấu hiểu như những người bạn tri âm.",
    memoryTip: "Đôi tay vuốt ve chở che cho người bạn tri âm chính là tình yêu thương (爱).",
    family: [
      { char: "友", pinyin: "yǒu", meaning: "Bạn bè" },
      { char: "爱", pinyin: "ài", meaning: "Yêu thương" },
      { char: "暖", pinyin: "nuǎn", meaning: "Ấm áp (thêm bộ Nhật 日)" },
      { char: "受", pinyin: "shòu", meaning: "Tiếp nhận, chịu đựng" }
    ],
    commonWords: ["爱情 (tình yêu)", "爱好 (sở thích)", "爱心 (tấm lòng nhân ái)", "关爱 (quan tâm yêu thương)", "可爱 (đáng yêu)"],
    example: {
      hanzi: "爱是理解，是包容，更是无私的奉献。",
      pinyin: "Ài shì lǐjiě, shì bāoróng, gèng shì wúsī de fèngxiàn.",
      vi: "Tình yêu là thấu hiểu, là bao dung và trên hết là sự cống hiến vô tư."
    }
  },
  {
    hanzi: "林",
    pinyin: "lín",
    hanviet: "Lâm",
    meaning: "Rừng cây, nhóm người đông đúc",
    level: 1,
    strokeCount: 8,
    radicals: [
      { char: "木", name: "Mộc", meaning: "Cây cối (bên trái)" },
      { char: "木", name: "Mộc", meaning: "Cây cối (bên phải)" }
    ],
    etymologyStory: "Chữ Hội ý kinh điển: Một cây đứng riêng là 'Mộc' (木). Hai cây mọc sát bên nhau thành rừng nhỏ là 'Lâm' (林). Ba cây mọc tụ hội rậm rạp thành đại ngàn nguyên sinh là 'Sâm' (森).",
    memoryTip: "Hai cây (木) đứng cạnh nhau thành rừng cây (林).",
    family: [
      { char: "木", pinyin: "mù", meaning: "Cây cối nguyên thủy" },
      { char: "林", pinyin: "lín", meaning: "Rừng cây nhỏ" },
      { char: "森", pinyin: "sēn", meaning: "Rừng rậm bạt ngàn" },
      { char: "禁", pinyin: "jìn", meaning: "Cấm đoán (Lâm 林 + Kỳ 示)" },
      { char: "楚", pinyin: "chǔ", meaning: "Nước Sở, rõ ràng (Lâm 林 + Sơ 疋)" }
    ],
    commonWords: ["森林 (rừng rậm)", "树林 (rừng cây)", "林业 (ngành lâm nghiệp)", "竹林 (rừng tre)", "武林 (võ lâm)"],
    example: {
      hanzi: "清晨漫步在翠绿的竹林中，空气格外清新。",
      pinyin: "Qīngchén mànbù zài cuìlǜ de zhúlín zhōng, kōngqì géwài qīngxīn.",
      vi: "Sáng sớm tản bộ trong rừng tre xanh ngát, không khí trong lành vô cùng."
    }
  },
  {
    hanzi: "从",
    pinyin: "cóng",
    hanviet: "Tòng",
    meaning: "Đi theo, từ (nơi chốn/thời gian)",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "人", name: "Nhân", meaning: "Người đi trước" },
      { char: "人", name: "Nhân", meaning: "Người đi theo sau" }
    ],
    etymologyStory: "Chữ Tượng hình - Hội ý sinh động: Vẽ một người đi đằng trước và một người nối gót bước theo sau, biểu thị ý nghĩa 'đi theo', 'tòng phục'. Từ đó mở rộng thành giới từ chỉ điểm xuất phát: 'từ đâu đến đâu' (从...到...).",
    memoryTip: "Một người đi trước, người kia đi theo sau chính là Tòng (从).",
    family: [
      { char: "人", pinyin: "rén", meaning: "Con người" },
      { char: "从", pinyin: "cóng", meaning: "Đi theo, từ (nguồn gốc)" },
      { char: "众", pinyin: "zhòng", meaning: "Quần chúng đông đúc (ba người 人)" },
      { char: "坐", pinyin: "zuò", meaning: "Ngồi xuống (hai người 人 ngồi trên đất 土)" }
    ],
    commonWords: ["从来 (từ trước tới nay)", "服从 (phục tùng)", "听从 (nghe theo)", "从前 (ngày xưa)", "从中 (từ trong đó)"],
    example: {
      hanzi: "从今天起，我要养成每天阅读的好习惯。",
      pinyin: "Cóng jīntiān qǐ, wǒ yào yǎngchéng měitiān yuèdú de hǎo xíguàn.",
      vi: "Kể từ ngày hôm nay, tôi sẽ rèn luyện thói quen tốt đọc sách mỗi ngày."
    }
  },
  {
    hanzi: "水",
    pinyin: "shuǐ",
    hanviet: "Thủy",
    meaning: "Nước, dòng chảy, chất lỏng",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "水", name: "Thủy", meaning: "Nước (dạng độc thể)" },
      { char: "氵", name: "Ba chấm thủy", meaning: "Nước (dạng biến thể làm bộ bên trái)" }
    ],
    etymologyStory: "Chữ Tượng hình thuần túy: Thời giáp cốt văn, chữ Thủy vẽ hình dòng nước uốn lượn chảy qua khe đá ở giữa, hai bên là những giọt nước bắn tung tóe. Khi làm bộ thủ ghép chữ, chữ Thủy biến thành bộ Ba chấm thủy (氵). Thượng thiện nhược thủy: Nước là khởi nguồn của vạn vật.",
    memoryTip: "Dòng suối chảy ở giữa, bọt nước bắn hai bên tạo thành chữ Thủy (水).",
    family: [
      { char: "水", pinyin: "shuǐ", meaning: "Nước" },
      { char: "江", pinyin: "jiāng", meaning: "Sông lớn (Trường Giang)" },
      { char: "河", pinyin: "hé", meaning: "Dòng sông (Hoàng Hà)" },
      { char: "海", pinyin: "hǎi", meaning: "Biển cả bao la" },
      { char: "洗", pinyin: "xǐ", meaning: "Rửa, giặt giũ" }
    ],
    commonWords: ["水平 (trình độ)", "水果 (hoa quả)", "饮用水 (nước uống)", "海水 (nước biển)", "水利 (thủy lợi)"],
    example: {
      hanzi: "水滴石穿，只要坚持不懈，微小的力量也能创造奇迹。",
      pinyin: "Shuǐ dī shí chuān, zhǐyào jiānchíbúxiè, wēixiǎo de lìliang yě néng chuàngzào qíjì.",
      vi: "Nước chảy đá mòn, chỉ cần bền bỉ không ngừng, sức mạnh nhỏ bé cũng tạo nên kỳ tích."
    }
  },
  {
    hanzi: "火",
    pinyin: "huǒ",
    hanviet: "Hỏa",
    meaning: "Lửa, ánh sáng rực cháy, tức giận",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "火", name: "Hỏa", meaning: "Ngọn lửa bốc cháy" },
      { char: "灬", name: "Bốn chấm hỏa", meaning: "Đốm than hồng dưới đáy chữ" }
    ],
    etymologyStory: "Chữ Tượng hình nguyên thủy vẽ ngọn lửa đang bùng cháy dữ dội với các tia lửa bắn ra bốn phía. Lửa giúp con người thoát khỏi thời kỳ ăn lông ở lỗ, đem lại ánh sáng và sự văn minh. Khi đứng dưới đáy chữ, chữ Hỏa biến thành bộ Bốn chấm hỏa (灬) biểu thị nấu nướng bằng lửa (như chữ 热 - nóng, 照 - chiếu sáng).",
    memoryTip: "Ngọn đuốc rực sáng bốc tia lửa hai bên là chữ Hỏa (火).",
    family: [
      { char: "火", pinyin: "huǒ", meaning: "Ngọn lửa" },
      { char: "炎", pinyin: "yán", meaning: "Rực rỡ, viêm sưng (hai ngọn lửa 火 chồng lên)" },
      { char: "焱", pinyin: "yàn", meaning: "Tia lửa rực cháy (ba ngọn lửa 火)" },
      { char: "热", pinyin: "rè", meaning: "Nóng bức (có bộ Bốn chấm hỏa 灬)" },
      { char: "点", pinyin: "diǎn", meaning: "Điểm, đốt lửa, gọi món" }
    ],
    commonWords: ["火车站 (nhà ga xe lửa)", "热火朝天 (sôi nổi náo nhiệt)", "发火 (nổi nóng)", "灭火 (dập lửa)", "红红火火 (hồng phát)"],
    example: {
      hanzi: "新春佳节，家家户户挂起红灯笼，日子过得红红火火。",
      pinyin: "Xīnchūn jiājié, jiājiāhùhù guà qǐ hóng dēnglong, rìzi guò de hónghónghuǒhuǒ.",
      vi: "Dịp Tết đến xuân về, nhà nhà treo đèn lồng đỏ, cuộc sống ấm no hồng phát rực rỡ."
    }
  },
  {
    hanzi: "日",
    pinyin: "rì",
    hanviet: "Nhật",
    meaning: "Mặt trời, ban ngày, ngày tháng",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "日", name: "Nhật", meaning: "Vầng thái dương tròn có điểm sáng trung tâm" }
    ],
    etymologyStory: "Chữ Tượng hình thuần túy: Thời Giáp cốt văn là một hình tròn có một chấm đen ở giữa tượng trưng cho vệt đen trên Mặt trời (thái dương). Về sau chuyển thành hình chữ nhật có nét gạch ngang ở giữa. Mặt trời mọc lặn tạo thành một ngày (Nhật), mang lại ánh sáng và sự ấm áp.",
    memoryTip: "Vầng thái dương tròn tỏa sáng tạo thành chữ Nhật (日).",
    family: [
      { char: "日", pinyin: "rì", meaning: "Mặt trời, ngày" },
      { char: "旦", pinyin: "dàn", meaning: "Sáng sớm (Mặt trời 日 nhô lên khỏi đường chân trời 一)" },
      { char: "早", pinyin: "zǎo", meaning: "Buổi sớm (Mặt trời 日 chiếu trên mầm cây 十)" },
      { char: "明", pinyin: "míng", meaning: "Tươi sáng (Mặt trời 日 kết hợp Mặt trăng 月)" },
      { char: "晴", pinyin: "qíng", meaning: "Trời nắng trong xanh (thêm chữ Thanh 青)" }
    ],
    commonWords: ["生日 (sinh nhật)", "日记 (nhật ký)", "日常 (thường nhật)", "日子 (ngày tháng, cuộc sống)", "日本 (Nhật Bản)"],
    example: {
      hanzi: "祝你生日快乐，愿你每天的日子都充满阳光与欢笑！",
      pinyin: "Zhù nǐ shēngrì kuàilè, yuàn nǐ měitiān de rìzi dōu chōngmǎn yángguāng yǔ huānxiào!",
      vi: "Chúc bạn sinh nhật vui vẻ, chúc mỗi ngày trôi qua đều ngập tràn ánh nắng và nụ cười!"
    }
  },
  {
    hanzi: "月",
    pinyin: "yuè",
    hanviet: "Nguyệt",
    meaning: "Mặt trăng, tháng, cơ thịt (khi là bộ Nhục 肉)",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "月", name: "Nguyệt", meaning: "Vầng trăng khuyết dịu dàng" }
    ],
    etymologyStory: "Chữ Tượng hình vẽ hình vầng trăng khuyết lơ lửng giữa trời đêm. Trong chữ Hán, chữ 'Nguyệt' có hai nguồn gốc: Một là vầng trăng trên trời (như trong 明 - sáng, 期 - thời kỳ); hai là biến thể của chữ 'Nhục' (肉 - thịt cơ thể người), nên hầu hết các chữ chỉ bộ phận thân thể đều có bộ Nguyệt (như: 胳, 膊, 胃, 腿, 脸).",
    memoryTip: "Vầng trăng khuyết dịu dàng đêm rằm là chữ Nguyệt (月).",
    family: [
      { char: "月", pinyin: "yuè", meaning: "Mặt trăng, tháng" },
      { char: "明", pinyin: "míng", meaning: "Sáng sủa (Nhật 日 + Nguyệt 月)" },
      { char: "朋", pinyin: "péng", meaning: "Bạn bè gắn kết (hai chữ Nguyệt 月 đứng cạnh)" },
      { char: "腿", pinyin: "tuǐ", meaning: "Bắp chân (bộ Nguyệt/Nhục)" },
      { char: "胃", pinyin: "wèi", meaning: "Dạ dày (ruộng Điền 田 + Nguyệt/Nhục 月)" }
    ],
    commonWords: ["月亮 (mặt trăng)", "月份 (tháng trong năm)", "中秋节 (Tết Trung Thu)", "月饼 (bánh trung thu)", "岁月 (năm tháng)"],
    example: {
      hanzi: "海上升明月，天涯共此时。",
      pinyin: "Hǎi shàng shēng míng yuè, tiānyá gòng cǐ shí.",
      vi: "Vầng trăng sáng nhô lên từ mặt biển khơi, dẫu cách ngàn trùng xa vẫn chung một thời khắc này."
    }
  },
  {
    hanzi: "道",
    pinyin: "dào",
    hanviet: "Đạo",
    meaning: "Con đường, đạo lý, phương pháp, nói rằng",
    level: 2,
    strokeCount: 12,
    radicals: [
      { char: "首", name: "Thủ", meaning: "Cái đầu, suy nghĩ, trí tuệ" },
      { char: "辶/辵", name: "Sước", meaning: "Bước đi, cất bước hành động" }
    ],
    etymologyStory: "Chữ Hội ý sâu sắc nhất trong triết học phương Đông: Kết hợp giữa chữ 'Thủ' (首 - cái đầu, tư tưởng, lý trí) và bộ 'Sước' (辶 - bước chân đi trên đường). Nghĩa nguyên thủy: Con đường chân lý phải vừa dùng cái đầu để suy ngẫm đạo lý, vừa dùng đôi chân kiên định bước đi trong thực tế. Đạo không chỉ là lý thuyết suông, mà là con đường thực hành.",
    memoryTip: "Dùng cái đầu (首) dẫn dắt bước chân (辶) tiến bước chính là Đạo (道).",
    family: [
      { char: "首", pinyin: "shǒu", meaning: "Đầu mối, bài thơ" },
      { char: "道", pinyin: "dào", meaning: "Con đường, đạo lý" },
      { char: "导", pinyin: "dǎo", meaning: "Dẫn đường, hướng dẫn (Đạo + Thốn 寸)" },
      { char: "通", pinyin: "tōng", meaning: "Thông suốt, kết nối" },
      { char: "进", pinyin: "jìn", meaning: "Tiến lên phía trước" }
    ],
    commonWords: ["知道 (biết được)", "道理 (đạo lý, lý lẽ)", "道路 (con đường)", "道谢 (nói lời cảm ơn)", "道德 (đạo đức)"],
    example: {
      hanzi: "千里之行，始于足下；追寻梦想的道路需要一步一个脚印。",
      pinyin: "Qiān lǐ zhī xíng, shǐ yú zú xià; zhuīxún mèngxiǎng de dàolù xūyào yí bù yí gè jiǎoyìn.",
      vi: "Hành trình vạn dặm khởi đầu từ một bước chân; con đường theo đuổi ước mơ cần vững vàng từng bước vững chắc."
    }
  }
];

const allEtymology = [...current, ...newEtymology];
fs.writeFileSync(existingPath, JSON.stringify(allEtymology, null, 2), 'utf8');
console.log(`Đã xuất sắc nâng cấp Chiết Tự & Cây Phả Hệ Chữ Hán lên ${allEtymology.length} Cây Họ Hàng Gốc tại ${existingPath}`);
