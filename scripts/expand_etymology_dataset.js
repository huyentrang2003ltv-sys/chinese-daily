const fs = require('fs');
const path = require('path');

const etymoPath = path.join(__dirname, '../data/etymology.json');
const currentList = JSON.parse(fs.readFileSync(etymoPath, 'utf8'));

const existingChars = new Set(currentList.map(item => item.hanzi));

const newEntries = [
  {
    hanzi: "学",
    pinyin: "xué",
    hanviet: "Học",
    meaning: "Học tập, bắt chước, tri thức",
    level: 1,
    strokeCount: 8,
    radicals: [
      { char: "子", name: "Tử", meaning: "Đứa con, con trẻ" },
      { char: "冖", name: "Mịch", meaning: "Mái che, trùm khăn" }
    ],
    etymologyStory: "Chữ Học (学) nguyên thủy là 斈. Phần trên mô tả hai bàn tay (𦥑) cầm hai vạch số (爻 - tượng trưng cho tri thức, toán học, quy luật trời đất) đặt dưới mái trường (冖), bên dưới là một đứa trẻ (子). Ý nghĩa chiết tự: Đứa trẻ dưới mái trường tiếp nhận tri thức lễ nghi và đạo đức từ người đi trước.",
    memoryTip: "Đứa trẻ (子) đội nón lễ nghi dưới mái trường (冖), giơ tay lĩnh hội tri thức (爻) thành chữ Học (学).",
    family: [
      { char: "子", pinyin: "zǐ", meaning: "Đứa con, trẻ nhỏ (gốc ý)" },
      { char: "字", pinyin: "zì", meaning: "Chữ viết (đứa con dưới mái nhà sinh sôi nảy nở)" },
      { char: "孝", pinyin: "xiào", meaning: "Hiếu thảo (con cõng người già trên lưng)" },
      { char: "存", pinyin: "cún", meaning: "Tồn tại, cất giữ (che chở cho đứa trẻ)" }
    ],
    commonWords: ["学习 (học tập)", "学生 (học sinh)", "学校 (trường học)", "大学 (đại học)", "学者 (học giả)"],
    example: {
      hanzi: "我们要认真学习汉语。",
      pinyin: "Wǒmen yào rènzhēn xuéxí hànyǔ.",
      vi: "Chúng ta cần phải học tiếng Trung một cách chăm chỉ."
    }
  },
  {
    hanzi: "中",
    pinyin: "zhōng",
    hanviet: "Trung",
    meaning: "Ở giữa, trung tâm, trúng, Trung Quốc",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "丨", name: "Cổn", meaning: "Nét sổ đứng xuyên suốt" },
      { char: "口", name: "Khẩu", meaning: "Cái miệng, hình ô vuông phân định" }
    ],
    etymologyStory: "Chữ Trung (中) là chữ tượng hình vẽ một cây cờ hiệu (hoặc mũi tên) cắm thẳng đứng xuyên qua tâm điểm một vòng tròn. Người xưa dựng cờ ở chính giữa quảng trường để hiệu triệu dân chúng tề tựu. Ý nghĩa: Không thiên, không lệch, giữ đạo trung dung.",
    memoryTip: "Cây cờ thẳng đứng (丨) cắm vào chính giữa tâm ô vuông (口) không lệch sang bên nào là chữ Trung (中).",
    family: [
      { char: "口", pinyin: "kǒu", meaning: "Cái miệng, ranh giới (gốc hình)" },
      { char: "仲", pinyin: "zhòng", meaning: "Người anh/chị thứ hai ở giữa (thêm bộ Nhân 亻)" },
      { char: "忠", pinyin: "zhōng", meaning: "Trung thành (giữ tấm lòng 心 ở chính giữa 中)" },
      { char: "盅", pinyin: "zhōng", meaning: "Cái chén nhỏ (thêm bộ Mãnh 皿)" }
    ],
    commonWords: ["中国 (Trung Quốc)", "中间 (ở giữa)", "中文 (tiếng Trung)", "中秋 (Trung thu)", "心中 (trong lòng)"],
    example: {
      hanzi: "北京是中国的首都。",
      pinyin: "Běijīng shì Zhōngguó de shǒudū.",
      vi: "Bắc Kinh là thủ đô của Trung Quốc."
    }
  },
  {
    hanzi: "国",
    pinyin: "guó",
    hanviet: "Quốc",
    meaning: "Đất nước, quốc gia, non sông",
    level: 1,
    strokeCount: 8,
    radicals: [
      { char: "囗", name: "Vi", meaning: "Bao quanh, biên giới tường thành" },
      { char: "玉", name: "Ngọc", meaning: "Viên ngọc quý, vương quyền" }
    ],
    etymologyStory: "Chữ giản thể 国 gồm bộ Vi 囗 (tường thành bao quanh, biên giới) bao bọc viên ngọc quý 玉 (quốc bảo, của cải và nhân dân). Chữ phồn thể 國 gồm bộ Vi 囗, bộ Nhất 一 (lãnh thổ), bộ Khẩu 口 (nhân khẩu) và cây giáo Qua 戈 (quân đội bảo vệ biên cương).",
    memoryTip: "Bốn bức tường thành biên giới (囗) bảo vệ viên ngọc báu giang sơn (玉) chính là Đất Nước (国).",
    family: [
      { char: "玉", pinyin: "yù", meaning: "Ngọc bích quý giá (gốc ý)" },
      { char: "囗", pinyin: "wéi", meaning: "Bao bọc, ranh giới khép kín" },
      { char: "宝", pinyin: "bǎo", meaning: "Bảo vật (ngọc 玉 dưới mái nhà 宀)" },
      { char: "莹", pinyin: "yíng", meaning: "Trong suốt lấp lánh như ngọc" }
    ],
    commonWords: ["国家 (quốc gia)", "国际 (quốc tế)", "国外 (nước ngoài)", "爱国 (yêu nước)", "祖国 (tổ quốc)"],
    example: {
      hanzi: "中国是一个历史悠久的国家。",
      pinyin: "Zhōngguó shì yí ge lìshǐ yōujiǔ de guójiā.",
      vi: "Trung Quốc là một quốc gia có lịch sử lâu đời."
    }
  },
  {
    hanzi: "人",
    pinyin: "rén",
    hanviet: "Nhân",
    meaning: "Con người, nhân loại",
    level: 1,
    strokeCount: 2,
    radicals: [
      { char: "人", name: "Nhân", meaning: "Con người đứng nghiêng" }
    ],
    etymologyStory: "Chữ tượng hình trên giáp cốt văn vẽ dáng hình một người đứng nghiêng, hai chân vững chãi trên mặt đất, hai tay buông thõng hướng về phía trước thể hiện sự tôn nghiêm và lao động. Khi đứng làm bộ thủ bên trái biến thành bộ Nhân đứng (亻).",
    memoryTip: "Hai nét phẩy và mác tựa vào nhau nâng đỡ nhau đứng thẳng chính là con Người (人).",
    family: [
      { char: "从", pinyin: "cóng", meaning: "Theo sau (hai người 人 đi nối tiếp nhau)" },
      { char: "众", pinyin: "zhòng", meaning: "Đám đông, quần chúng (ba người 人 hợp lại)" },
      { char: "大", pinyin: "dà", meaning: "To lớn (người dang rộng hai tay hai chân)" },
      { char: "天", pinyin: "tiān", meaning: "Bầu trời (khoảng không trên đỉnh đầu người 大)" }
    ],
    commonWords: ["人民 (nhân dân)", "人类 (nhân loại)", "人生 (nhân sinh, cuộc đời)", "主人 (chủ nhân)", "工人 (công nhân)"],
    example: {
      hanzi: "世界上有很多善良的人。",
      pinyin: "Shìjiè shang yǒu hěn duō shànliáng de rén.",
      vi: "Trên thế giới có rất nhiều người lương thiện."
    }
  },
  {
    hanzi: "大",
    pinyin: "dà",
    hanviet: "Đại",
    meaning: "To lớn, rộng lớn, bậc cao",
    level: 1,
    strokeCount: 3,
    radicals: [
      { char: "大", name: "Đại", meaning: "To lớn" }
    ],
    etymologyStory: "Chữ Đại (大) trên giáp cốt văn là hình vẽ chính diện một người trưởng thành (人) dang rộng cả hai tay và hai chân hết cỡ để diễn tả khái niệm 'to lớn, vĩ đại'.",
    memoryTip: "Người (人) dang rộng hai tay hết tầm (thêm nét ngang 一) thành chữ Đại (大).",
    family: [
      { char: "天", pinyin: "tiān", meaning: "Bầu trời (trên đầu người to lớn có vòm trời)" },
      { char: "太", pinyin: "tài", meaning: "Quá mức, thái (thêm dấu chấm nhấn mạnh)" },
      { char: "夫", pinyin: "fū", meaning: "Trượng phu (người lớn cài trâm trên tóc)" },
      { char: "央", pinyin: "yāng", meaning: "Chính giữa (người đeo gông ở cổ)" }
    ],
    commonWords: ["大家 (mọi người)", "大学 (đại học)", "大人 (người lớn)", "巨大 (to lớn, khổng lồ)", "伟大 (vĩ đại)"],
    example: {
      hanzi: "这个公园非常大，风景也很优美。",
      pinyin: "Zhè ge gōngyuán fēicháng dà, fēngjǐng yě hěn yōuměi.",
      vi: "Công viên này rất rộng lớn, phong cảnh cũng rất hữu tình."
    }
  },
  {
    hanzi: "小",
    pinyin: "xiǎo",
    hanviet: "Tiểu",
    meaning: "Nhỏ bé, vụn vặt, ít tuổi",
    level: 1,
    strokeCount: 3,
    radicals: [
      { char: "小", name: "Tiểu", meaning: "Nhỏ bé" }
    ],
    etymologyStory: "Chữ Tiểu (小) trên giáp cốt văn vẽ ba hạt cát nhỏ hoặc ba mảnh vụn li ti sau khi bị chặt chia cắt (nét sổ móc chia đôi hai chấm hai bên). Nghĩa nguyên thủy là những vật thể nhỏ bé, phân tán.",
    memoryTip: "Nét sổ đứng móc chia đôi thành hai giọt nhỏ hai bên tạo nên chữ Tiểu (小).",
    family: [
      { char: "少", pinyin: "shǎo", meaning: "Ít, thiếu (thêm nét phẩy kéo dài dưới 小)" },
      { char: "尖", pinyin: "jiān", meaning: "Nhọn (trên nhỏ 小, dưới to 大)" },
      { char: "尘", pinyin: "chén", meaning: "Bụi trần (đất cát 土 nhỏ bé 小 bay mù mịt)" },
      { char: "劣", pinyin: "liè", meaning: "Kém cỏi (ít 少 sức lực 力)" }
    ],
    commonWords: ["小孩 (trẻ con)", "小心 (cẩn thận)", "小时 (tiếng đồng hồ)", "小学 (tiểu học)", "细小 (nhỏ xíu)"],
    example: {
      hanzi: "过马路时一定要小心。",
      pinyin: "Guò mǎlù shí yídìng yào xiǎoxīn.",
      vi: "Khi qua đường nhất định phải cẩn thận."
    }
  },
  {
    hanzi: "天",
    pinyin: "tiān",
    hanviet: "Thiên",
    meaning: "Bầu trời, ngày, thời tiết, thiên nhiên",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "大", name: "Đại", meaning: "To lớn" },
      { char: "一", name: "Nhất", meaning: "Vòm trời trên cùng" }
    ],
    etymologyStory: "Chữ Thiên (天) trên kim văn vẽ một người đứng thẳng (大) và nhấn mạnh bằng một hình tròn hoặc nét ngang (一) ngay trên đỉnh đầu để biểu thị bầu trời bao la vô tận ngự trị trên đầu con người.",
    memoryTip: "Trên đỉnh đầu người vĩ đại (大) là vòm trời cao vời vợi (一) thành chữ Thiên (天).",
    family: [
      { char: "大", pinyin: "dà", meaning: "Người to lớn (gốc hình)" },
      { char: "夫", pinyin: "fū", meaning: "Người trượng phu (người cài trâm)" },
      { char: "吞", pinyin: "tūn", meaning: "Nuốt chửng (mở miệng 口 nuốt cả trời Thiên 天)" },
      { char: "昊", pinyin: "hào", meaning: "Bầu trời mùa hè sáng rực rỡ (mặt trời 日 trên trời 天)" }
    ],
    commonWords: ["天气 (thời tiết)", "今天 (hôm nay)", "明天 (ngày mai)", "天空 (bầu trời)", "春天 (mùa xuân)"],
    example: {
      hanzi: "今天的天气非常晴朗。",
      pinyin: "Jīntiān de tiānqì fēicháng qínglǎng.",
      vi: "Thời tiết hôm nay rất quang đãng."
    }
  },
  {
    hanzi: "心",
    pinyin: "xīn",
    hanviet: "Tâm",
    meaning: "Trái tim, lòng dạ, suy nghĩ, tâm linh",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "心", name: "Tâm", meaning: "Trái tim" }
    ],
    etymologyStory: "Chữ tượng hình vẽ quả tim thật của con người, với các tâm thất, tâm nhĩ và động mạch chủ dẫn máu (uốn cong và 3 giọt máu xung quanh). Khi làm bộ thủ bên cạnh biến thành bộ Tâm đứng (忄). Người xưa quan niệm tâm là nơi phát sinh mọi suy nghĩ và tình cảm.",
    memoryTip: "Vầng trăng khuyết ôm ba giọt máu tâm can chính là chữ Tâm (心).",
    family: [
      { char: "想", pinyin: "xiǎng", meaning: "Nhớ nhung, suy nghĩ (Tương 相 + Tâm 心)" },
      { char: "忍", pinyin: "rěn", meaning: "Nhẫn nhịn (đao 刃 cứa vào tim 心)" },
      { char: "思", pinyin: "sī", meaning: "Tư duy, suy nghĩ (ruộng Điền 田 + Tâm 心)" },
      { char: "息", pinyin: "xī", meaning: "Hơi thở, nghỉ ngơi (tự 自 + tâm 心)" }
    ],
    commonWords: ["心情 (tâm trạng)", "心理 (tâm lý)", "关心 (quan tâm)", "开心 (vui vẻ)", "爱心 (lòng nhân ái)"],
    example: {
      hanzi: "听到这个好消息，大家心里都很开心。",
      pinyin: "Tīng dào zhè ge hǎo xiāoxi, dàjiā xīnli dōu hěn kāixīn.",
      vi: "Nghe thấy tin tốt này, trong lòng mọi người đều rất vui vẻ."
    }
  },
  {
    hanzi: "文",
    pinyin: "wén",
    hanviet: "Văn",
    meaning: "Văn chương, văn hóa, chữ viết, hoa văn",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "文", name: "Văn", meaning: "Văn tự, hoa văn" }
    ],
    etymologyStory: "Chữ Văn (文) nguyên thủy vẽ hoa văn hoặc hình xăm trang trí trên ngực của một người đứng thẳng trong nghi lễ cổ đại. Về sau mở rộng nghĩa thành các ký hiệu ghi chép (văn tự), vẻ đẹp tri thức và nền văn minh (văn hóa).",
    memoryTip: "Đầu đội mũ (亠), hai chân vắt chéo (乂) tạo nên dáng vẻ uyên bác của người làm Văn (文).",
    family: [
      { char: "纹", pinyin: "wén", meaning: "Đường vân, hoa văn (thêm bộ Mịch 纟)" },
      { char: "旻", pinyin: "mín", meaning: "Trời thu trong vắt (mặt trời 日 trên Văn 文)" },
      { char: "齐", pinyin: "qí", meaning: "Đều đặn, tề chỉnh" },
      { char: "斑", pinyin: "bān", meaning: "Vết đốm hoa văn" }
    ],
    commonWords: ["文化 (văn hóa)", "文章 (văn chương, bài viết)", "中文 (tiếng Trung)", "文明 (văn minh)", "文字 (văn tự)"],
    example: {
      hanzi: "中国传统文化博大精深。",
      pinyin: "Zhōngguó chuántǒng wénhuà bódà jīngshēn.",
      vi: "Văn hóa truyền thống Trung Quốc uyên bác và sâu sắc."
    }
  },
  {
    hanzi: "生",
    pinyin: "shēng",
    hanviet: "Sinh",
    meaning: "Sinh sôi, mọc lên, sống, cuộc sống, học sinh",
    level: 1,
    strokeCount: 5,
    radicals: [
      { char: "生", name: "Sinh", meaning: "Sinh trưởng, mầm sống" }
    ],
    etymologyStory: "Chữ Sinh (生) trên giáp cốt văn vẽ một mầm cây non nhô lên từ mặt đất (nét ngang dưới cùng là mặt đất, phần trên là chồi non và lá non tẽ ra). Ý nghĩa chiết tự: Sức sống vươn lên mãnh liệt, sinh sôi nảy nở không ngừng.",
    memoryTip: "Chồi non vươn lên từ mặt đất đâm chồi nảy lộc mang lại sự Sống (生).",
    family: [
      { char: "星", pinyin: "xīng", meaning: "Ngôi sao (mặt trời 日 sinh Sinh 生 ra muôn vì tinh tú)" },
      { char: "性", pinyin: "xìng", meaning: "Tính cách, bản tính (tâm tính sinh ra từ thuở ban sơ)" },
      { char: "姓", pinyin: "xìng", meaning: "Họ tên (dòng giống do người mẹ Nữ 女 sinh ra)" },
      { char: "胜", pinyin: "shèng", meaning: "Chiến thắng (thêm bộ Nguyệt 月 và Lực 力)" }
    ],
    commonWords: ["生活 (cuộc sống)", "学生 (học sinh)", "生命 (sinh mệnh)", "生日 (sinh nhật)", "发生 (xảy ra)"],
    example: {
      hanzi: "我们要热爱生活，珍惜当下的每一天。",
      pinyin: "Wǒmen yào rè'ài shēnghuó, zhēnxī dāngxià de měi yì tiān.",
      vi: "Chúng ta cần phải yêu đời và trân trọng từng ngày ở hiện tại."
    }
  },
  {
    hanzi: "师",
    pinyin: "shī",
    hanviet: "Sư",
    meaning: "Thầy giáo, quân đội, bậc thầy, noi gương",
    level: 1,
    strokeCount: 6,
    radicals: [
      { char: "巾", name: "Cân", meaning: "Cái khăn, cờ hiệu" }
    ],
    etymologyStory: "Chữ phồn thể 師. Ban đầu là thuật ngữ quân sự: một đội quân 2.500 lính gọi là một 'sư'. Người đứng đầu quân sư chỉ huy binh lính gọi là 'sư'. Về sau chuyển nghĩa sang người chỉ dạy đạo đức, tri thức cho học trò, được kính trọng như bậc thầy (thầy giáo).",
    memoryTip: "Người đứng đầu cầm cờ hiệu (巾) dẫn dắt vạn người bước đi đúng hướng là người Thầy (师).",
    family: [
      { char: "帅", pinyin: "shuài", meaning: "Soái, đẹp trai, tướng quân (cài trâm trên 巾)" },
      { char: "归", pinyin: "guī", meaning: "Trở về, quy thuận" },
      { char: "狮", pinyin: "shī", meaning: "Sư tử (thêm thú 犭)" },
      { char: "筛", pinyin: "shāi", meaning: "Cái sàng rây (thêm trúc 竹)" }
    ],
    commonWords: ["老师 (thầy cô giáo)", "律师 (luật sư)", "工程师 (kỹ sư)", "师傅 (sư phụ, bác tài)", "名师 (thầy giỏi)"],
    example: {
      hanzi: "张老师教我们汉语已经三年了。",
      pinyin: "Zhāng lǎoshī jiāo wǒmen hànyǔ yǐjīng sān nián le.",
      vi: "Thầy Trương đã dạy chúng tôi tiếng Trung được 3 năm rồi."
    }
  },
  {
    hanzi: "茶",
    pinyin: "chá",
    hanviet: "Trà",
    meaning: "Cây chè, lá trà, nước trà",
    level: 1,
    strokeCount: 9,
    radicals: [
      { char: "艹", name: "Thảo", meaning: "Cỏ cây hoa lá" },
      { char: "人", name: "Nhân", meaning: "Con người" },
      { char: "木", name: "Mộc", meaning: "Cây cối" }
    ],
    etymologyStory: "Chữ Trà (茶) cấu tạo vô cùng thi vị: Trên cùng là bộ Thảo (艹 - ngọn búp lá non), ở giữa là bộ Nhân (人 - con người), dưới cùng là bộ Mộc (木 - thân cây chè rừng). Ý nghĩa chiết tự: Con người sống hòa hợp giữa cây cối và cỏ hoa thiên nhiên, hái búp non pha nước thanh lọc tâm hồn.",
    memoryTip: "Thảo (艹) trên đầu, người (人) ở giữa, mộc (木) ở dưới chân: người chan hòa với thiên nhiên là Trà (茶).",
    family: [
      { char: "艹", pinyin: "cǎo", meaning: "Cỏ cây (gốc ý)" },
      { char: "木", pinyin: "mù", meaning: "Cây gỗ (gốc vật)" },
      { char: "荼", pinyin: "tú", meaning: "Cỏ đắng, sầu khổ (thêm một nét ngang)" }
    ],
    commonWords: ["绿茶 (trà xanh)", "红茶 (hồng trà)", "喝茶 (uống trà)", "茶馆 (quán trà)", "茶道 (trà đạo)"],
    example: {
      hanzi: "中国人非常喜欢客来敬茶的礼节。",
      pinyin: "Zhōngguó rén fēicháng xǐhuan kè lái jìng chá de lǐjié.",
      vi: "Người Trung Quốc rất thích lễ nghi khách đến dâng trà."
    }
  },
  {
    hanzi: "书",
    pinyin: "shū",
    hanviet: "Thư",
    meaning: "Sách vở, viết chữ, thư từ, ghi chép",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "乛", name: "Ất", meaning: "Nét gập" }
    ],
    etymologyStory: "Chữ phồn thể 書 gồm bộ Duật (聿 - bàn tay cầm cây bút lông thẳng đứng) và chữ Giả (者 - lời nói hoặc nghiên mực). Ý nghĩa nguyên thủy: Bàn tay cầm bút ghi chép lại lời nói và sự thật lịch sử lên các thẻ tre. Chữ giản thể tinh giản đường nét thành 书 giữ dáng bút thảo uyển chuyển.",
    memoryTip: "Tay cầm bút lông chấm mực viết lên thẻ tre lưu truyền hậu thế thành Sách (书).",
    family: [
      { char: "聿", pinyin: "yù", meaning: "Cây bút lông cổ đại (gốc hình)" },
      { char: "笔", pinyin: "bǐ", meaning: "Cây bút (trúc 竹 cắm lông thú 毛)" },
      { char: "律", pinyin: "lǜ", meaning: "Pháp luật, kỷ luật (bút ghi chép quy chuẩn bước đi 彳)" },
      { char: "画", pinyin: "huà", meaning: "Bức tranh, nét vẽ" }
    ],
    commonWords: ["看书 (đọc sách)", "书店 (hiệu sách)", "图书馆 (thư viện)", "书法 (thư pháp)", "证书 (chứng thư, chứng chỉ)"],
    example: {
      hanzi: "我每天晚上都会抽时间看半个小时书。",
      pinyin: "Wǒ měitiān wǎnshang dōu huì chōu shíjiān kàn bàn ge xiǎoshí shū.",
      vi: "Mỗi tối tôi đều dành thời gian đọc nửa tiếng sách."
    }
  },
  {
    hanzi: "语",
    pinyin: "yǔ",
    hanviet: "Ngữ",
    meaning: "Ngôn ngữ, lời nói, ngạn ngữ",
    level: 1,
    strokeCount: 9,
    radicals: [
      { char: "讠", name: "Ngôn", meaning: "Lời nói, phát ngôn" },
      { char: "五", name: "Ngũ", meaning: "Số 5" },
      { char: "口", name: "Khẩu", meaning: "Cái miệng" }
    ],
    etymologyStory: "Chữ Ngữ (语) cấu tạo gồm bộ Ngôn (讠- lời nói phát ra) kết hợp với chữ Ngô (吾 - tôi, gồm Ngũ 五 và Khẩu 口: miệng của năm ngũ quan). Ý nghĩa chiết tự: Dùng lời nói (讠) để bộc lộ tâm tư của chính bản thân mình (吾) ra với xung quanh thành ngôn ngữ.",
    memoryTip: "Dùng lời nói (讠) thốt ra từ miệng (口) của tôi (吾) thành Ngôn Ngữ (语).",
    family: [
      { char: "言", pinyin: "yán", meaning: "Lời nói (gốc ý)" },
      { char: "吾", pinyin: "wú", meaning: "Bản thân tôi (ngũ 五 + khẩu 口)" },
      { char: "梧", pinyin: "wú", meaning: "Cây ngô đồng (thêm mộc 木)" },
      { char: "晤", pinyin: "wù", meaning: "Gặp mặt đàm đạo (thêm nhật 日)" }
    ],
    commonWords: ["汉语 (tiếng Hán)", "英语 (tiếng Anh)", "语言 (ngôn ngữ)", "成语 (thành ngữ)", "语法 (ngữ pháp)"],
    example: {
      hanzi: "学习一门外语能够开阔我们的眼界。",
      pinyin: "Xuéxí yì mén wàiyǔ nénggòu kāikuò wǒmen de yǎnjiè.",
      vi: "Học một ngoại ngữ có thể mở rộng tầm mắt của chúng ta."
    }
  },
  {
    hanzi: "说",
    pinyin: "shuō",
    hanviet: "Thuyết",
    meaning: "Nói, giảng giải, thuyết phục, vui mừng",
    level: 1,
    strokeCount: 9,
    radicals: [
      { char: "讠", name: "Ngôn", meaning: "Lời nói" },
      { char: "兑", name: "Đoái", meaning: "Vui vẻ, quẻ Đoái tượng trưng cho nụ cười" }
    ],
    etymologyStory: "Chữ Thuyết (说) gồm bộ Ngôn (讠- lời nói) và chữ Đoái (兑 - hai khóe mắt cong lên, miệng há cười tươi vui). Ý nghĩa chiết tự: Dùng lời nói nhã nhặn, cởi mở khiến người nghe hoan hỷ, đồng thuận và tâm phục khẩu phục.",
    memoryTip: "Lời nói (讠) kết hợp nụ cười vui tươi (兑) khiến ai cũng muốn lắng nghe bạn Nói (说).",
    family: [
      { char: "兑", pinyin: "duì", meaning: "Đoái, hoán đổi, nụ cười (gốc âm & ý)" },
      { char: "悦", pinyin: "yuè", meaning: "Vui mừng, duyệt (tâm 忄vui tươi 兑)" },
      { char: "锐", pinyin: "ruì", meaning: "Sắc bén, nhuệ khí (kim loại 钅sắc)" },
      { char: "税", pinyin: "shuì", meaning: "Thuế khóa (nộp thuế bằng lúa thóc 禾)" }
    ],
    commonWords: ["说话 (nói chuyện)", "说明 (thuyết minh, giải thích)", "小说 (tiểu thuyết)", "听说 (nghe nói)", "说服 (thuyết phục)"],
    example: {
      hanzi: "请大家慢慢说，不要太着急。",
      pinyin: "Qǐng dàjiā mànmàn shuō, bú yào tài zháojí.",
      vi: "Xin mọi người hãy nói từ từ, đừng quá vội vàng."
    }
  },
  {
    hanzi: "谢",
    pinyin: "xiè",
    hanviet: "Tạ",
    meaning: "Cảm ơn, tạ lỗi, từ chối, tàn úa (hoa)",
    level: 1,
    strokeCount: 12,
    radicals: [
      { char: "讠", name: "Ngôn", meaning: "Lời nói" },
      { char: "身", name: "Thân", meaning: "Thân thể" },
      { char: "寸", name: "Thốn", meaning: "Tấc, tấc lòng, đo lường" }
    ],
    etymologyStory: "Chữ Tạ (谢) gồm bộ Ngôn (讠- lời nói) và chữ Xạ (射 - thân 身 kết hợp thốn 寸 nghĩa là giương cung bắn tên phát xuất ra). Ý nghĩa chiết tự: Khi đón nhận ân huệ của người khác, phải thốt ra lời nói từ tận đáy lòng để phóng thích lòng biết ơn ra ngoài.",
    memoryTip: "Lời nói (讠) xuất phát từ tấc (寸) lòng của bản thân (身) để Tạ ơn (谢).",
    family: [
      { char: "射", pinyin: "shè", meaning: "Bắn tên (thân 身 + thốn 寸)" },
      { char: "身", pinyin: "shēn", meaning: "Thân hình con người (gốc hình)" },
      { char: "寸", pinyin: "cùn", meaning: "Tấc gang, tấc lòng (gốc đơn vị)" }
    ],
    commonWords: ["谢谢 (cảm ơn)", "感谢 (cảm tạ, biết ơn)", "道谢 (nói lời cảm ơn)", "谢意 (tấm lòng cảm tạ)", "致谢 (gửi lời tri ân)"],
    example: {
      hanzi: "非常感谢你一直以来对我的帮助。",
      pinyin: "Fēicháng gǎnxiè nǐ yìzhí yǐlái duì wǒ de bāngzhù.",
      vi: "Vô cùng cảm ơn sự giúp đỡ của bạn dành cho tôi suốt thời gian qua."
    }
  },
  {
    hanzi: "你",
    pinyin: "nǐ",
    hanviet: "Nhĩ",
    meaning: "Bạn, anh, chị, em, người đối diện",
    level: 1,
    strokeCount: 7,
    radicals: [
      { char: "亻", name: "Nhân đứng", meaning: "Con người" },
      { char: "尔", name: "Nhĩ", meaning: "Ngươi, mày, hoa nở lộng lẫy" }
    ],
    etymologyStory: "Chữ Nhĩ (你) cấu tạo hình thanh: Bộ Nhân đứng (亻- con người) biểu thị đối tượng giao tiếp là người, kết hợp với chữ Nhĩ (尔 - hoa văn cổ xòe ra, đóng vai trò hài âm nǐ). Dùng làm đại từ nhân xưng ngôi thứ hai thân mật.",
    memoryTip: "Người (亻) đang đứng đối diện trò chuyện cùng ta (尔) chính là Bạn (你).",
    family: [
      { char: "尔", pinyin: "ěr", meaning: "Ngươi, vậy (gốc âm)" },
      { char: "您", pinyin: "nín", meaning: "Ngài, bác (đặt chữ Bạn 你 lên trên trái tim 心 để kính trọng)" },
      { char: "称", pinyin: "chēng", meaning: "Xưng hô, cân đong" },
      { char: "弥", pinyin: "mí", meaning: "Tràn đầy, di đà" }
    ],
    commonWords: ["你好 (xin chào)", "你们 (các bạn)", "你的 (của bạn)", "你好吗 (bạn khỏe không)"],
    example: {
      hanzi: "你好，很高兴在这里认识你。",
      pinyin: "Nǐ hǎo, hěn gāoxìng zài zhèlǐ rènshi nǐ.",
      vi: "Chào bạn, rất vui được làm quen với bạn ở đây."
    }
  },
  {
    hanzi: "我",
    pinyin: "wǒ",
    hanviet: "Ngã",
    meaning: "Tôi, ta, bản thân mình",
    level: 1,
    strokeCount: 7,
    radicals: [
      { char: "戈", name: "Qua", meaning: "Binh khí, cây giáo có răng cưa" }
    ],
    etymologyStory: "Chữ Ngã (我) trên giáp cốt văn vốn là hình vẽ một loại vũ khí cổ đại có nhiều răng cưa sắc nhọn (tiền thân cây giáo Qua 戈). Người chiến binh cổ cầm vũ khí trong tay để tự vệ và bảo vệ chủ quyền sinh mệnh của bản thân, từ đó mượn nghĩa thành đại từ chỉ 'bản thân ta, tôi'.",
    memoryTip: "Tay cầm chắc vũ khí (戈) tự vệ và khẳng định bản ngã chính là chữ Tôi (我).",
    family: [
      { char: "戈", pinyin: "gē", meaning: "Vũ khí, ngọn giáo (gốc hình)" },
      { char: "俄", pinyin: "é", meaning: "Nước Nga, chốc lát (thêm nhân đứng 亻)" },
      { char: "鹅", pinyin: "é", meaning: "Con ngỗng (thêm chim Điểu 鸟)" },
      { char: "饿", pinyin: "è", meaning: "Đói bụng (thêm bộ Thực 饣thức ăn)" }
    ],
    commonWords: ["我们 (chúng tôi)", "我的 (của tôi)", "我自己 (chính tôi)", "我们俩 (hai chúng tôi)"],
    example: {
      hanzi: "我是越南人，我正在学中文。",
      pinyin: "Wǒ shì Yuènán rén, wǒ zhèngzài xué Zhōngwén.",
      vi: "Tôi là người Việt Nam, tôi đang học tiếng Trung."
    }
  },
  {
    hanzi: "他",
    pinyin: "tā",
    hanviet: "Tha",
    meaning: "Anh ấy, ông ấy, người khác",
    level: 1,
    strokeCount: 5,
    radicals: [
      { char: "亻", name: "Nhân đứng", meaning: "Con người" },
      { char: "也", name: "Dã", meaning: "Cũng là, con rắn độc uốn lượn" }
    ],
    etymologyStory: "Chữ Tha (他) gồm bộ Nhân đứng (亻- con người) kết hợp chữ Dã (也 - người hoặc vật khác ngoài chủ thể). Ý nghĩa chiết tự: Chỉ một người nào đó ở ngôi thứ ba, không phải người nói cũng chẳng phải người nghe trực diện.",
    memoryTip: "Người (亻) ở ngoài cuộc mà cũng (也) liên quan chính là Anh ấy (他).",
    family: [
      { char: "也", pinyin: "yě", meaning: "Cũng (gốc âm)" },
      { char: "她", pinyin: "tā", meaning: "Cô ấy (thay bằng bộ Nữ 女)" },
      { char: "它", pinyin: "tā", meaning: "Nó, đồ vật (dưới mái nhà 宀)" },
      { char: "池", pinyin: "chí", meaning: "Cái ao hồ (thêm nước Thủy 氵)" }
    ],
    commonWords: ["他们 (họ, bọn họ)", "他的 (của anh ấy)", "他人 (người khác)", "吉他 (đàn guitar)"],
    example: {
      hanzi: "他在北京大学读研究生。",
      pinyin: "Tā zài Běijīng Dàxué dú yánjiūshēng.",
      vi: "Anh ấy đang học cao học tại Đại học Bắc Kinh."
    }
  },
  {
    hanzi: "吃",
    pinyin: "chī",
    hanviet: "Ngật",
    meaning: "Ăn, thưởng thức món ăn, hấp thụ",
    level: 1,
    strokeCount: 6,
    radicals: [
      { char: "口", name: "Khẩu", meaning: "Cái miệng" },
      { char: "乞", name: "Khất", meaning: "Cầu xin, khí thở nghẹn lại" }
    ],
    etymologyStory: "Chữ Ăn (吃) gồm bộ Khẩu (口 - cái miệng nhai nuốt) và chữ Khất (乞 - hình luồng khí thở nghẹn lại nơi cổ họng hoặc mở miệng xin ăn). Ý nghĩa chiết tự: Hành động mở miệng đưa thức ăn vào nhai nuốt nuôi dưỡng thân thể.",
    memoryTip: "Cái miệng (口) mở ra đón nhận thức ăn (乞) giải tỏa cơn đói là chữ Ăn (吃).",
    family: [
      { char: "口", pinyin: "kǒu", meaning: "Cái miệng (gốc ý)" },
      { char: "乞", pinyin: "qǐ", meaning: "Khất thực, cầu xin (gốc âm)" },
      { char: "乾", pinyin: "gān", meaning: "Khô ráo, Càn (trời)" },
      { char: "汽", pinyin: "qì", meaning: "Hơi nước, khí đốt" }
    ],
    commonWords: ["吃饭 (ăn cơm)", "好吃 (ngon miệng)", "小吃 (món ăn vặt)", "吃药 (uống thuốc)", "吃惊 (kinh ngạc)"],
    example: {
      hanzi: "中国菜不仅色香味俱全，而且非常好吃。",
      pinyin: "Zhōngguó cài bùjǐn sè xiāng wèi jù quán, érqiě fēicháng hǎochī.",
      vi: "Món ăn Trung Quốc không chỉ đủ sắc hương vị mà còn rất ngon miệng."
    }
  },
  {
    hanzi: "喝",
    pinyin: "hē",
    hanviet: "Hát",
    meaning: "Uống nước, nuốt chất lỏng",
    level: 1,
    strokeCount: 12,
    radicals: [
      { char: "口", name: "Khẩu", meaning: "Cái miệng" },
      { char: "曷", name: "Hạt", meaning: "Khát khao, khi nào" }
    ],
    etymologyStory: "Chữ Uống (喝) gồm bộ Khẩu (口 - cái miệng) kết hợp với chữ Hạt (曷 - hình mặt trời 日 thiêu đốt kẻ đang quỳ cầu xin nguồn nước). Ý nghĩa chiết tự: Dưới trời nắng gắt cổ họng khô khát, miệng há to khao khát dòng nước mát để Uống.",
    memoryTip: "Cái miệng (口) khô cháy dưới nắng gắt (曷) khao khát được Uống (喝) nước giải nhiệt.",
    family: [
      { char: "曷", pinyin: "hé", meaning: "Hạt, lúc nào (gốc âm)" },
      { char: "渴", pinyin: "kě", meaning: "Khát nước (thay bằng giọt nước Thủy 氵)" },
      { char: "褐", pinyin: "hè", meaning: "Màu nâu (thêm y phục 衤)" },
      { char: "歇", pinyin: "xiē", meaning: "Nghỉ ngơi (thêm ngáp Khiếm 欠)" }
    ],
    commonWords: ["喝水 (uống nước)", "喝茶 (uống trà)", "喝酒 (uống rượu)", "喝咖啡 (uống cà phê)"],
    example: {
      hanzi: "每天多喝水对身体健康非常有益。",
      pinyin: "Měitiān duō hē shuǐ duì shēntǐ jiànkāng fēicháng yǒuyì.",
      vi: "Mỗi ngày uống nhiều nước rất có lợi cho sức khỏe."
    }
  },
  {
    hanzi: "看",
    pinyin: "kàn",
    hanviet: "Khán",
    meaning: "Nhìn, xem, trông nom, thăm hỏi",
    level: 1,
    strokeCount: 9,
    radicals: [
      { char: "手", name: "Thủ", meaning: "Bàn tay che nắng" },
      { char: "目", name: "Mục", meaning: "Đôi mắt" }
    ],
    etymologyStory: "Chữ Nhìn (看) là một kiệt tác chữ hội ý: Phía trên là bàn tay (手 biến thể 手), phía dưới là đôi mắt (目). Hình ảnh một người giơ bàn tay lên ngang trán để che bớt ánh nắng chói chang chiếu vào mắt, giúp phóng tầm mắt nhìn thật xa và rõ ràng.",
    memoryTip: "Bàn tay (手) che trên đôi mắt (目) để phóng tầm mắt Nhìn (看) thật rõ về phía xa.",
    family: [
      { char: "目", pinyin: "mù", meaning: "Đôi mắt (gốc ý)" },
      { char: "手", pinyin: "shǒu", meaning: "Bàn tay (gốc hình)" },
      { char: "眉", pinyin: "méi", meaning: "Lông mày (vạch lông trên mắt 目)" },
      { char: "盲", pinyin: "máng", meaning: "Mù lòa (mất vong 亡 đôi mắt 目)" }
    ],
    commonWords: ["看书 (đọc sách)", "看见 (nhìn thấy)", "看法 (quan điểm, góc nhìn)", "看病 (khám bệnh)", "看电影 (xem phim)"],
    example: {
      hanzi: "站在山顶上，你可以看到整个城市的夜景。",
      pinyin: "Zhàn zài shāndǐng shang, nǐ kěyǐ kàn dào zhěnggè chéngshì de yèjǐng.",
      vi: "Đứng trên đỉnh núi, bạn có thể ngắm nhìn toàn cảnh đêm của thành phố."
    }
  },
  {
    hanzi: "听",
    pinyin: "tīng",
    hanviet: "Thính",
    meaning: "Nghe, lắng nghe, tuân theo",
    level: 1,
    strokeCount: 7,
    radicals: [
      { char: "口", name: "Khẩu", meaning: "Cái miệng" },
      { char: "斤", name: "Cân", meaning: "Cái rìu, đo lường từng chút" }
    ],
    etymologyStory: "Chữ phồn thể 聽 vô cùng thâm thúy: gồm tai Nhĩ 耳, mười Thập 十, mắt Mục 目, một Nhất 一 và tấm lòng Tâm 心 (lắng nghe bằng tai, quan sát bằng mắt và đặt cả trái tim thấu cảm). Chữ giản thể 听 gồm Khẩu 口 và Cân 斤 (cái rìu mỏng): Lắng nghe từng thanh âm vi tế, chọn lọc từng lời như đo từng cân từng lạng.",
    memoryTip: "Mở miệng (口) yên lặng để phân định từng thanh âm chuẩn xác như cân (斤) là Nghe (听).",
    family: [
      { char: "斤", pinyin: "jīn", meaning: "Cái rìu, cân lạng (gốc âm & ý)" },
      { char: "近", pinyin: "jìn", meaning: "Gần gũi (thêm bước đi 辶)" },
      { char: "折", pinyin: "zhé", meaning: "Bẻ gãy, chiết khấu (dùng tay 扌cầm rìu 斤)" },
      { char: "拆", pinyin: "chāi", meaning: "Tháo dỡ, mở ra" }
    ],
    commonWords: ["听音乐 (nghe nhạc)", "听到 (nghe thấy)", "听说 (nghe nói)", "听写 (chính tả, nghe viết)", "听话 (nghe lời)"],
    example: {
      hanzi: "多听中文广播能够有效提高听力水平。",
      pinyin: "Duō tīng Zhōngwén guǎngbō nénggòu yǒuxiào tígāo tīnglì shuǐpíng.",
      vi: "Nghe nhiều đài phát thanh tiếng Trung có thể nâng cao hiệu quả trình độ nghe."
    }
  },
  {
    hanzi: "买",
    pinyin: "mǎi",
    hanviet: "Mãi",
    meaning: "Mua, đổi tiền lấy hàng hóa",
    level: 1,
    strokeCount: 6,
    radicals: [
      { char: "乙", name: "Ất", meaning: "Nét móc cong" },
      { char: "头", name: "Đầu", meaning: "Đầu mối" }
    ],
    etymologyStory: "Chữ phồn thể 買 trên giáp cốt văn gồm tấm lưới (网) thả xuống thu gom vỏ sò tiền tệ (Bối 貝). Thời cổ vỏ sò quý giá được dùng làm tiền tệ giao thương. Mang vỏ sò đi đổi lấy đồ vật chính là Mua (买). Ngược lại, người Bán (Mại 賣) có thêm chữ Sĩ 士 (bày biện ra trên quầy).",
    memoryTip: "Đầu nón móc đồ đem về nhà sau phiên chợ chính là Mua (买).",
    family: [
      { char: "卖", pinyin: "mài", meaning: "Bán (thêm chữ Thập 十 trên đầu 买)" },
      { char: "读", pinyin: "dú", meaning: "Đọc sách (lời nói 讠kết hợp Mại 卖)" },
      { char: "续", pinyin: "xù", meaning: "Tiếp tục (sợi tơ 纟kết nối)" },
      { char: "实", pinyin: "shí", meaning: "Sự thật, thực tế" }
    ],
    commonWords: ["买东西 (mua đồ)", "买单 (thanh toán hóa đơn)", "购买 (mua sắm)", "买卖 (buôn bán, kinh doanh)"],
    example: {
      hanzi: "周末我和妈妈一起去超市买水果。",
      pinyin: "Zhōumò wǒ hé māma yìqǐ qù chāoshì mǎi shuǐguǒ.",
      vi: "Cuối tuần tôi cùng mẹ đi siêu thị mua hoa quả."
    }
  },
  {
    hanzi: "车",
    pinyin: "chē",
    hanviet: "Xa",
    meaning: "Xe cộ, phương tiện di chuyển có bánh",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "车", name: "Xa", meaning: "Cỗ xe" }
    ],
    etymologyStory: "Chữ tượng hình 車 vẽ toàn cảnh một cỗ xe ngựa nhìn từ trên xuống: hai bánh xe hai bên, trục xe ở giữa và khoang ngồi lái cho người đánh xe. Chữ giản thể 车 rút gọn nét nhưng vẫn giữ trục dọc, thùng xe và thanh bánh xe lăn bánh bon bon.",
    memoryTip: "Trục bánh xe ở giữa lăn thẳng tắp mang người và hàng đi xa là chữ Xe (车).",
    family: [
      { char: "军", pinyin: "jūn", meaning: "Quân đội (doanh trại 冖 vây bọc cỗ chiến xa 车)" },
      { char: "连", pinyin: "lián", meaning: "Liền tiếp, liên tục (xe 车 nối đuôi nhau di chuyển 辶)" },
      { char: "轮", pinyin: "lún", meaning: "Bánh xe luân chuyển (thêm nón hợp 仑)" },
      { char: "轨", pinyin: "guǐ", meaning: "Đường ray quy đạo (thêm cửu 九)" }
    ],
    commonWords: ["汽车 (xe hơi)", "车站 (bến xe)", "火车 (tàu hỏa)", "自行车 (xe đạp)", "打车 (bắt taxi)"],
    example: {
      hanzi: "现在很多城市都推广使用新能源汽车。",
      pinyin: "Xiànzài hěn duō chéngshì dōu tuīguǎng shǐyòng xīn néngyuán qìchē.",
      vi: "Hiện nay rất nhiều thành phố đều nhân rộng việc sử dụng xe hơi năng lượng mới."
    }
  },
  {
    hanzi: "电",
    pinyin: "diàn",
    hanviet: "Điện",
    meaning: "Điện, tia chớp, sấm sét, điện tử",
    level: 1,
    strokeCount: 5,
    radicals: [
      { char: "日", name: "Nhật", meaning: "Mặt trời, hình khối sáng" },
      { char: "乚", name: "Ẩn", meaning: "Nét cong móc ngoằn ngoèo" }
    ],
    etymologyStory: "Chữ phồn thể 電 gồm bộ Vũ (雨 - cơn mưa dông) và chữ Thân (申 - tia chớp xé rách mây trời). Người xưa quan sát tia sét phát ra ánh sáng chói lòa trong cơn dông bão mà tạo thành chữ Điện. Chữ giản thể 电 giữ lại luồng sét uốn lượn xuyên qua đám mây phát điện.",
    memoryTip: "Mặt trời (日) giáng xuống tia sét ngoằn ngoèo (乚) tỏa ra năng lượng Điện (电).",
    family: [
      { char: "雨", pinyin: "yǔ", meaning: "Cơn mưa dông (gốc trời)" },
      { char: "申", pinyin: "shēn", meaning: "Duỗi thẳng, tia chớp (gốc hình)" },
      { char: "雷", pinyin: "léi", meaning: "Sấm sét (mưa 雨 giáng xuống cánh đồng 田)" },
      { char: "神", pinyin: "shén", meaning: "Thần linh (thị 礻kết hợp tia chớp 申)" }
    ],
    commonWords: ["电话 (điện thoại)", "电影 (điện ảnh, phim)", "电脑 (máy vi tính)", "电视 (truyền hình)", "电力 (điện lực)"],
    example: {
      hanzi: "我的手机没电了，需要充电。",
      pinyin: "Wǒ de shǒujī méi diàn le, xūyào chōngdiàn.",
      vi: "Điện thoại của tôi hết pin rồi, cần phải sạc điện."
    }
  },
  {
    hanzi: "机",
    pinyin: "jī",
    hanviet: "Cơ",
    meaning: "Cỗ máy, cơ hội, then chốt, máy bay",
    level: 1,
    strokeCount: 6,
    radicals: [
      { char: "木", name: "Mộc", meaning: "Cây gỗ" },
      { char: "几", name: "Kỷ", meaning: "Cái bàn con, mấy, tinh vi" }
    ],
    etymologyStory: "Chữ Cơ (机) gồm bộ Mộc (木 - gỗ) và chữ Kỷ (几 - chiếc bàn dệt nhỏ tinh vi). Người xưa chế tạo khung dệt cửi và nỏ bắn tên bằng gỗ, điều khiển bằng các chi tiết cơ khí ăn khớp nhau. Về sau mở rộng chỉ máy móc hiện đại và thời cơ then chốt.",
    memoryTip: "Khung gỗ (木) ăn khớp với từng chi tiết tinh vi (几) tạo nên cỗ Máy (机).",
    family: [
      { char: "木", pinyin: "mù", meaning: "Gỗ cây (gốc vật)" },
      { char: "几", pinyin: "jǐ", meaning: "Cái bàn, mấy (gốc hình)" },
      { char: "朵", pinyin: "duǒ", meaning: "Đóa hoa (nụ hoa trên cây gỗ 木)" },
      { char: "杂", pinyin: "zá", meaning: "Phức tạp, hỗn tạp" }
    ],
    commonWords: ["手机 (điện thoại di động)", "飞机 (máy bay)", "机会 (cơ hội)", "机场 (sân bay)", "机器 (máy móc)"],
    example: {
      hanzi: "抓住眼前的机会，才能取得成功。",
      pinyin: "Zhuāzhù yǎnqián de jīhuì, cáinéng qǔdé chénggōng.",
      vi: "Nắm bắt cơ hội trước mắt thì mới có thể gặt hái thành công."
    }
  },
  {
    hanzi: "话",
    pinyin: "huà",
    hanviet: "Thoại",
    meaning: "Lời nói, câu chuyện, đàm thoại",
    level: 1,
    strokeCount: 8,
    radicals: [
      { char: "讠", name: "Ngôn", meaning: "Lời nói" },
      { char: "舌", name: "Thiệt", meaning: "Cái lưỡi" }
    ],
    etymologyStory: "Chữ Thoại (话) gồm bộ Ngôn (讠- lời nói) và chữ Thiệt (舌 - cái lưỡi uốn lượn trong miệng). Lưỡi uốn lượn điều phối luồng hơi phát ra thanh âm biểu cảm và có ý nghĩa, tạo nên lời ăn tiếng nói giữa con người.",
    memoryTip: "Lời nói (讠) phát ra nhờ sự phối hợp khéo léo của chiếc lưỡi (舌) tạo thành Đối thoại (话).",
    family: [
      { char: "舌", pinyin: "shé", meaning: "Cái lưỡi (gốc hình)" },
      { char: "甜", pinyin: "tián", meaning: "Ngọt ngào (lưỡi 舌 nếm vị cam 甘)" },
      { char: "活", pinyin: "huó", meaning: "Sống động (nước Thủy 氵nuôi dưỡng chiếc lưỡi 舌)" },
      { char: "刮", pinyin: "guā", meaning: "Cạo, gọt, gió thổi (thêm đao 刂)" }
    ],
    commonWords: ["说话 (nói chuyện)", "电话 (điện thoại)", "普通话 (tiếng Phổ thông)", "话题 (chủ đề trò chuyện)", "笑话 (chuyện cười)"],
    example: {
      hanzi: "有话好好说，大家都是好朋友。",
      pinyin: "Yǒu huà hǎohǎo shuō, dàjiā dōu shì hǎo péngyou.",
      vi: "Có chuyện gì thì cứ từ tốn nói năng, mọi người đều là bạn tốt của nhau."
    }
  },
  {
    hanzi: "友",
    pinyin: "yǒu",
    hanviet: "Hữu",
    meaning: "Bạn bè, bằng hữu, thân thiện",
    level: 1,
    strokeCount: 4,
    radicals: [
      { char: "又", name: "Hựu", meaning: "Bàn tay phải, lại nữa" }
    ],
    etymologyStory: "Chữ Hữu (友) trên giáp cốt văn vẽ hai bàn tay phải (又) cùng vươn ra theo một hướng, nắm chặt lấy nhau và sẵn sàng tương trợ, san sẻ gian nan. Ý nghĩa chiết tự: Hai người chung chí hướng, cùng giơ tay giúp đỡ nhau trọn đời là Bạn bè.",
    memoryTip: "Hai bàn tay (又) siết chặt tay nhau cùng chung chí hướng là Bằng hữu (友).",
    family: [
      { char: "又", pinyin: "yòu", meaning: "Bàn tay phải (gốc hình)" },
      { char: "发", pinyin: "fā", meaning: "Phát ra, phát triển (bàn tay bắn tên)" },
      { char: "取", pinyin: "qǔ", meaning: "Lấy, giành lấy (tay 又 cầm tai Nhĩ 耳)" },
      { char: "叔", pinyin: "shū", meaning: "Người chú, người bác" }
    ],
    commonWords: ["朋友 (bạn bè)", "友好 (thân thiện)", "网友 (bạn quen qua mạng)", "队友 (đồng đội)", "友谊 (tình bạn)"],
    example: {
      hanzi: "患难见真情，真正的朋友会陪伴你度过难关。",
      pinyin: "Huànnàn jiàn zhēnqíng, zhēnzhèng de péngyou huì péibàn nǐ dùguò nánguān.",
      vi: "Hoạn nạn mới thấy chân tình, bạn bè đích thực sẽ đồng hành cùng bạn vượt qua giông bão."
    }
  },
  {
    hanzi: "同",
    pinyin: "tóng",
    hanviet: "Đồng",
    meaning: "Cùng nhau, giống nhau, hiệp lực",
    level: 1,
    strokeCount: 6,
    radicals: [
      { char: "冂", name: "Quynh", meaning: "Vùng đất rộng, mái nhà chung" },
      { char: "一", name: "Nhất", meaning: "Một, duy nhất" },
      { char: "口", name: "Khẩu", meaning: "Miệng, tiếng nói" }
    ],
    etymologyStory: "Chữ Đồng (同) gồm bộ Quynh (冂 - khung nhà chung bao bọc) và chữ Khẩu (口 - tiếng nói) với nét ngang (一). Hình ảnh mọi người cùng quây quần dưới một mái nhà lớn, cùng đồng thanh phát ra một tiếng nói đồng lòng, đồng thuận.",
    memoryTip: "Dưới chung một mái nhà (冂), mọi người cùng đồng thanh một tiếng nói (口) là chữ Đồng (同).",
    family: [
      { char: "口", pinyin: "kǒu", meaning: "Miệng nói (gốc ý)" },
      { char: "铜", pinyin: "tóng", meaning: "Đồng kim loại (thêm kim 钅)" },
      { char: "洞", pinyin: "dòng", meaning: "Hang động (thêm giọt nước 氵)" },
      { char: "桐", pinyin: "tóng", meaning: "Cây ngô đồng (thêm mộc 木)" }
    ],
    commonWords: ["同学 (bạn cùng học)", "同事 (đồng nghiệp)", "共同 (cùng nhau)", "同意 (đồng ý)", "相同 (giống nhau)"],
    example: {
      hanzi: "我们班的同学团结友爱，学习氛围很好。",
      pinyin: "Wǒmen bān de tóngxué tuánjié yǒur'ài, xuéxí fēnwéi hěn hǎo.",
      vi: "Các bạn học lớp chúng tôi đoàn kết thân ái, bầu không khí học tập rất tốt."
    }
  },
  {
    hanzi: "钱",
    pinyin: "qián",
    hanviet: "Tiền",
    meaning: "Tiền bạc, của cải, đơn vị đo",
    level: 1,
    strokeCount: 10,
    radicals: [
      { char: "钅", name: "Kim", meaning: "Kim loại, vàng bạc" },
      { char: "戋", name: "Tàn", meaning: "Binh khí nhỏ, ít ỏi" }
    ],
    etymologyStory: "Chữ phồn thể 錢 gồm bộ Kim (金 - kim loại) và hai cây giáo Qua (戔 - vũ khí tranh đoạt). Thời xưa kim loại quý đúc thành xẻng hoặc dao nhỏ dùng làm vật trung gian trao đổi hàng hóa. Con người sẵn sàng dùng binh khí để tranh đoạt của cải, từ đó hình thành chữ Tiền.",
    memoryTip: "Kim loại (钅) đúc thành công cụ trao đổi và tranh chấp (戋) chính là Tiền bạc (钱).",
    family: [
      { char: "钅", pinyin: "jīn", meaning: "Kim loại (gốc vật)" },
      { char: "浅", pinyin: "qiǎn", meaning: "Nông cạn (nước 氵ít ỏi 戋)" },
      { char: "残", pinyin: "cán", meaning: "Tàn tạ, sót lại (xương tàn 歹 + 戋)" },
      { char: "践", pinyin: "jiàn", meaning: "Thực hành (bước chân 𧾷)" }
    ],
    commonWords: ["多少钱 (bao nhiêu tiền)", "有钱 (giàu có)", "钱包 (ví tiền)", "花钱 (tiêu tiền)", "存钱 (tiết kiệm tiền)"],
    example: {
      hanzi: "请问这件红色的旗袍多少钱？",
      pinyin: "Qǐngwèn zhè jiàn hóngsè de qípáo duōshao qián?",
      vi: "Xin hỏi chiếc xường xám màu đỏ này bao nhiêu tiền?"
    }
  },
  {
    hanzi: "门",
    pinyin: "mén",
    hanviet: "Môn",
    meaning: "Cánh cửa, lối vào, môn phái, môn học",
    level: 1,
    strokeCount: 3,
    radicals: [
      { char: "门", name: "Môn", meaning: "Cánh cửa" }
    ],
    etymologyStory: "Chữ phồn thể 門 trên giáp cốt văn vẽ hai cánh cửa khép mở của ngôi nhà truyền thống thời cổ, có khung cửa và hai then cài đối xứng. Chữ giản thể 门 mô phỏng cánh cửa mở với chốt cài bên trái đón chào khách bước vào.",
    memoryTip: "Khung cửa hai cánh mở rộng đón khách vào nhà là chữ Cửa (门).",
    family: [
      { char: "问", pinyin: "wèn", meaning: "Hỏi han (đứng ở cửa 门 mở miệng 口 hỏi)" },
      { char: "闭", pinyin: "bì", meaning: "Đóng cửa (cài then Tài 才 ở cửa 门)" },
      { char: "闪", pinyin: "shǎn", meaning: "Lóe sáng (người 人 nép thoáng qua cửa 门)" },
      { char: "闲", pinyin: "xián", meaning: "Nhàn rỗi (nhìn cây mộc 木 qua khung cửa 门)" }
    ],
    commonWords: ["开门 (mở cửa)", "关门 (đóng cửa)", "门口 (cổng, cửa ngõ)", "专门 (chuyên môn)", "一门课 (một môn học)"],
    example: {
      hanzi: "出门前记得检查门窗是否关好。",
      pinyin: "Chūmén qián jìde jiǎnchá ménchuāng shìfǒu guān hǎo.",
      vi: "Trước khi ra khỏi nhà nhớ kiểm tra cửa nẻo đã đóng cẩn thận chưa."
    }
  },
  {
    hanzi: "雨",
    pinyin: "yǔ",
    hanviet: "Vũ",
    meaning: "Cơn mưa, nước mưa rơi từ trời",
    level: 1,
    strokeCount: 8,
    radicals: [
      { char: "雨", name: "Vũ", meaning: "Mưa" }
    ],
    etymologyStory: "Chữ tượng hình trên giáp cốt văn: Nét ngang trên cùng biểu thị bầu trời 一, khung úp 冂 biểu thị mây đen ngưng tụ, nét sổ đứng 丨 và 4 dấu chấm nhỏ bên trong tượng trưng cho những giọt mưa rào rơi tí tách xuống mặt đất.",
    memoryTip: "Bầu trời giăng mây xám, bốn giọt nước rơi rớt xuống tạo thành Mưa (雨).",
    family: [
      { char: "雪", pinyin: "xuě", meaning: "Tuyết trắng (mưa 雨 rơi xuống tay cầm 彐 đông lại)" },
      { char: "雷", pinyin: "léi", meaning: "Sấm sét (mưa 雨 rền vang đồng ruộng 田)" },
      { char: "零", pinyin: "líng", meaning: "Số không, rơi rớt (mưa rơi giọt lệnh 令)" },
      { char: "雾", pinyin: "wù", meaning: "Sương mù (mưa 雨 bốc hơi vụ 务)" }
    ],
    commonWords: ["下雨 (trời mưa)", "雨伞 (cây dù, ô che mưa)", "雨季 (mùa mưa)", "大雨 (mưa to)", "暴风雨 (mưa bão)"],
    example: {
      hanzi: "今天外面下着蒙蒙细雨，空气很清新。",
      pinyin: "Jīntiān wàimiàn xià zhe méngméng xìyǔ, kōngqì hěn qīngxīn.",
      vi: "Hôm nay bên ngoài trời mưa phùn lất phất, không khí rất trong lành."
    }
  },
  {
    hanzi: "山",
    pinyin: "shān",
    hanviet: "Sơn",
    meaning: "Ngọn núi, non bộ, vững như núi",
    level: 1,
    strokeCount: 3,
    radicals: [
      { char: "山", name: "Sơn", meaning: "Ngọn núi" }
    ],
    etymologyStory: "Chữ tượng hình trên giáp cốt văn vẽ ba ngọn núi nhấp nhô san sát: đỉnh núi chính giữa cao nhất sừng sững, hai đỉnh núi hai bên thoải hơn và mặt đất bằng phẳng bên dưới đỡ lấy.",
    memoryTip: "Ba ngọn núi nhấp nhô đứng cạnh nhau vững chãi là chữ Núi (山).",
    family: [
      { char: "仙", pinyin: "xiān", meaning: "Tiên nhân (người 人 ẩn cư tu hành trên núi 山)" },
      { char: "岩", pinyin: "yán", meaning: "Nham thạch (đá Thạch 石 dưới chân núi 山)" },
      { char: "峰", pinyin: "fēng", meaning: "Đỉnh núi chọc trời (núi 山 kết hợp Phong 夆)" },
      { char: "岛", pinyin: "dǎo", meaning: "Hòn đảo (chim Điểu 鸟 đậu trên núi 山 giữa biển)" }
    ],
    commonWords: ["爬山 (leo núi)", "高山 (núi cao)", "火山 (núi lửa)", "风景如画的山区 (vùng núi đẹp như tranh)"],
    example: {
      hanzi: "俗话说：山高水长，友谊永存。",
      pinyin: "Súhuà shuō: shān gāo shuǐ cháng, yǒuyì yǒng cún.",
      vi: "Tục ngữ có câu: Núi cao sông dài, tình bạn trường tồn mãi mãi."
    }
  },
  {
    hanzi: "众",
    pinyin: "zhòng",
    hanviet: "Chúng",
    meaning: "Quần chúng, đám đông, nhiều người, đồng lòng",
    level: 2,
    strokeCount: 6,
    radicals: [
      { char: "人", name: "Nhân", meaning: "Con người" }
    ],
    etymologyStory: "Chữ phồn thể 衆 vẽ ba người 人 đứng dưới ánh mặt trời 日 làm việc. Chữ giản thể 众 xếp ba chữ Người (人) chồng lên nhau theo kết cấu tam giác vững chắc: một người ở trên, hai người ở dưới nâng đỡ. Ý nghĩa chiết tự: Ba người trở lên tạo thành đám đông, vạn người đồng tâm tạo nên sức mạnh quần chúng.",
    memoryTip: "Một người (人) ở trên, hai người (人人) kề vai gánh vác bên dưới thành Quần chúng (众).",
    family: [
      { char: "人", pinyin: "rén", meaning: "Một người (gốc hình)" },
      { char: "从", pinyin: "cóng", meaning: "Hai người đi theo nhau" },
      { char: "丛", pinyin: "cóng", meaning: "Bụi rậm, tùng thư" }
    ],
    commonWords: ["大家 (mọi người)", "群众 (quần chúng)", "观众 (khán giả)", "听众 (thính giả)", "众志成城 (đồng lòng nên thành lũy)"],
    example: {
      hanzi: "只要万众一心，就没有战胜不了的困难。",
      pinyin: "Zhǐyào wànzhòngyìxīn, jiù méiyǒu zhànshèng bù liǎo de kùnnan.",
      vi: "Chỉ cần vạn người một lòng thì không có khó khăn nào là không chiến thắng được."
    }
  },
  {
    hanzi: "炎",
    pinyin: "yán",
    hanviet: "Viêm",
    meaning: "Cháy rực, nóng nực, viêm sưng, Viêm Đế",
    level: 2,
    strokeCount: 8,
    radicals: [
      { char: "火", name: "Hỏa", meaning: "Ngọn lửa" }
    ],
    etymologyStory: "Chữ Viêm (炎) là chữ hội ý cấu tạo gồm hai ngọn lửa (火) xếp chồng lên nhau. Một ngọn lửa bốc cháy đã nóng, hai ngọn lửa cùng bốc cao thì hơi nóng tăng gấp bội, biểu thị sự thiêu đốt rực cháy, cái nóng gay gắt của mùa hè hoặc chứng viêm sưng trong y học.",
    memoryTip: "Hai đốm lửa (火 + 火) chồng lên nhau tạo nên sức nóng thiêu đốt là chữ Viêm (炎).",
    family: [
      { char: "火", pinyin: "huǒ", meaning: "Ngọn lửa (gốc ý)" },
      { char: "焱", pinyin: "yàn", meaning: "Tia lửa chói lọi (ba ngọn lửa 火)" },
      { char: "淡", pinyin: "dàn", meaning: "Nhạt, thanh đạm (dùng nước 氵dập tắt lửa 炎)" },
      { char: "毯", pinyin: "tǎn", meaning: "Tấm thảm len giữ ấm" }
    ],
    commonWords: ["炎热 (nóng bức gay gắt)", "发炎 (viêm nhiễm, sưng)", "肺炎 (viêm phổi)", "炎黄子孙 (con cháu Viêm Hoàng)"],
    example: {
      hanzi: "北京的七月天气十分炎热。",
      pinyin: "Běijīng de qī yuè tiānqì shífēn yánrè.",
      vi: "Thời tiết tháng bảy ở Bắc Kinh vô cùng nóng bức."
    }
  },
  {
    hanzi: "晶",
    pinyin: "jīng",
    hanviet: "Tinh",
    meaning: "Pha lê, tinh thể, sáng lấp lánh, trong suốt",
    level: 2,
    strokeCount: 12,
    radicals: [
      { char: "日", name: "Nhật", meaning: "Mặt trời, ánh sáng" }
    ],
    etymologyStory: "Chữ Tinh (晶) là chữ hội ý tinh tế gồm ba mặt trời (日) xếp thành kết cấu tam giác. Một mặt trời đã tỏa ánh hào quang rực rỡ, ba mặt trời cùng hội tụ phản chiếu muôn phương tạo ra ánh sáng long lanh, lấp lánh như viên ngọc pha lê tinh khiết không tì vết.",
    memoryTip: "Ba vầng thái dương (日 + 日 + 日) hội tụ phát ra ánh sáng long lanh là Pha lê Tinh thể (晶).",
    family: [
      { char: "日", pinyin: "rì", meaning: "Mặt trời (gốc hình)" },
      { char: "星", pinyin: "xīng", meaning: "Ngôi sao" },
      { char: "晨", pinyin: "chén", meaning: "Sáng sớm (mặt trời 日 mọc trên Thần 辰)" },
      { char: "晴", pinyin: "qíng", meaning: "Trời quang mây tạnh (mặt trời 日 xanh biếc 青)" }
    ],
    commonWords: ["水晶 (pha lê, thạch anh)", "晶莹 (long lanh, trong suốt)", "结晶 (kết tinh, thành quả)", "液晶显示屏 (màn hình LCD)"],
    example: {
      hanzi: "早晨草叶上的露珠晶莹剔透，美丽极了。",
      pinyin: "Zǎochen cǎoyè shang de lùzhū jīngyíng tītòu, měilì jí le.",
      vi: "Sáng sớm giọt sương trên phiến lá trong suốt long lanh, đẹp vô cùng."
    }
  },
  {
    hanzi: "泪",
    pinyin: "lèi",
    hanviet: "Lệ",
    meaning: "Nước mắt, giọt lệ đau xót hoặc cảm động",
    level: 2,
    strokeCount: 8,
    radicals: [
      { char: "氵", name: "Ba chấm thủy", meaning: "Dòng nước" },
      { char: "目", name: "Mục", meaning: "Đôi mắt" }
    ],
    etymologyStory: "Chữ giản thể Lệ (泪) là chữ hội ý điển hình: Bên trái là bộ Ba chấm thủy (氵- nước), bên phải là bộ Mục (目 - đôi mắt). Nước chảy ra từ khóe mắt khi xúc động nghẹn ngào hay đau khổ tột cùng chính là Giọt Lệ.",
    memoryTip: "Giọt nước (氵) chảy ra từ khóe mắt (目) chứa chan niềm xúc cảm là Lệ (泪).",
    family: [
      { char: "目", pinyin: "mù", meaning: "Đôi mắt (gốc vị trí)" },
      { char: "氵", pinyin: "shuǐ", meaning: "Dòng nước (gốc chất liệu)" },
      { char: "流", pinyin: "liú", meaning: "Chảy, lưu chuyển" },
      { char: "涕", pinyin: "tì", meaning: "Nước mũi, sụt sùi" }
    ],
    commonWords: ["眼泪 (nước mắt)", "流泪 (chảy nước mắt)", "泪水 (dòng lệ)", "催泪 (làm rơi nước mắt)"],
    example: {
      hanzi: "看到离别多年的母子重聚，大家都流下了感动的泪水。",
      pinyin: "Kàn dào líbié duō nián de mǔzǐ chóngjù, dàjiā dōu liú xià le gǎndòng de lèishuǐ.",
      vi: "Nhìn thấy hai mẹ con xa cách nhiều năm đoàn tụ, mọi người đều rơi những giọt nước mắt cảm động."
    }
  },
  {
    hanzi: "囚",
    pinyin: "qiú",
    hanviet: "Tù",
    meaning: "Giam cầm, tù nhân, người bị nhốt",
    level: 2,
    strokeCount: 5,
    radicals: [
      { char: "囗", name: "Vi", meaning: "Tường bao quanh, nhà ngục" },
      { char: "人", name: "Nhân", meaning: "Con người" }
    ],
    etymologyStory: "Chữ Tù (囚) là chữ tượng ý không thể rõ ràng hơn: Bộ Vi (囗 - bốn bức tường đá giam hãm) nhốt kín con người (人) ở bên trong, không có đường thoát thân. Nghĩa là giam giữ tội phạm, tù đày, mất tự do.",
    memoryTip: "Con người (人) bị nhốt kín trong bốn bức tường thành ngục tối (囗) là Tù nhân (囚).",
    family: [
      { char: "人", pinyin: "rén", meaning: "Con người (gốc nhân vật)" },
      { char: "囗", pinyin: "wéi", meaning: "Bao quanh, nhà giam" },
      { char: "因", pinyin: "yīn", meaning: "Nguyên nhân (người 人 nằm trên chiếu 囗)" },
      { char: "困", pinyin: "kùn", meaning: "Khốn đốn (cây cối 木 bị nhốt trong phòng 囗)" }
    ],
    commonWords: ["死囚 (tử tù)", "囚犯 (tù nhân)", "阶下囚 (kẻ làm tù binh)", "幽囚 (giam cầm kín)"],
    example: {
      hanzi: "任何违法犯罪者都难逃法律的制裁，最终沦为囚犯。",
      pinyin: "Rènhé wéifǎ fànzuì zhě dōu nántáo fǎlǜ de zhìcái, zuìzhōng lún wéi qiúfàn.",
      vi: "Bất kỳ kẻ vi phạm pháp luật phạm tội nào cũng khó thoát khỏi sự trừng phạt của pháp luật, cuối cùng trở thành tù nhân."
    }
  },
  {
    hanzi: "困",
    pinyin: "kùn",
    hanviet: "Khốn",
    meaning: "Khốn đốn, vây hãm, khó khăn, buồn ngủ",
    level: 2,
    strokeCount: 7,
    radicals: [
      { char: "囗", name: "Vi", meaning: "Bao quanh, rào chắn" },
      { char: "木", name: "Mộc", meaning: "Cây cối" }
    ],
    etymologyStory: "Chữ Khốn (困) cấu tạo gồm bộ Vi (囗 - bức tường rào khép kín) bao bọc một cái cây (木) ở giữa. Cây cối cần cành lá vươn lên đón nắng và rễ tỏa rộng hút nước, nhưng lại bị bốn bức tường gạch vây chặt không thể lớn nổi, rễ cây teo tóp. Từ đó biểu thị sự khốn quẫn, bế tắc, gian truân.",
    memoryTip: "Cây cối (木) bị giam hãm trong bốn bức tường chật hẹp (囗) sinh ra Khốn đốn (困).",
    family: [
      { char: "木", pinyin: "mù", meaning: "Cây cối (gốc sinh vật)" },
      { char: "囗", pinyin: "wéi", meaning: "Khung vây bọc" },
      { char: "森", pinyin: "sēn", meaning: "Rừng rậm (ba cây mộc)" },
      { char: "梱", pinyin: "kǔn", meaning: "Bó chặt (thêm tay 扌)" }
    ],
    commonWords: ["困难 (khó khăn)", "困境 (hoàn cảnh ngặt nghèo)", "困惑 (bối rối, mơ hồ)", "贫困 (nghèo túng)", "困倦 (mệt mỏi buồn ngủ)"],
    example: {
      hanzi: "面对生活中的困难，我们应当勇往直前。",
      pinyin: "Miànduì shēnghuó zhōng de kùnnan, wǒmen yīngdāng yǒngwǎng zhíqián.",
      vi: "Đối mặt với những khó khăn trong cuộc sống, chúng ta nên dũng cảm tiến về phía trước."
    }
  },
  {
    hanzi: "鸣",
    pinyin: "míng",
    hanviet: "Minh",
    meaning: "Tiếng chim hót, thú kêu, vang danh, phát ra tiếng",
    level: 2,
    strokeCount: 8,
    radicals: [
      { char: "口", name: "Khẩu", meaning: "Cái miệng, tiếng kêu" },
      { char: "鸟", name: "Điểu", meaning: "Con chim" }
    ],
    etymologyStory: "Chữ Minh (鸣) gồm bộ Khẩu (口 - cái mỏ há to) và chữ Điểu (鸟 - con chim). Chữ hội ý khắc họa chú chim đậu trên cành cất tiếng hót líu lo chào đón bình minh. Về sau mở rộng chỉ muông thú kêu vang và tiếng tăm vang lừng trong thiên hạ.",
    memoryTip: "Cái mỏ chim (口) kết hợp với chú chim (鸟) cất tiếng hót vang dội là chữ Minh (鸣).",
    family: [
      { char: "鸟", pinyin: "niǎo", meaning: "Con chim (gốc hình)" },
      { char: "口", pinyin: "kǒu", meaning: "Cái mỏ, miệng phát thanh" },
      { char: "鸡", pinyin: "jī", meaning: "Con gà (bộ điểu)" },
      { char: "鸭", pinyin: "yā", meaning: "Con vịt (giáp 甲 + điểu 鸟)" }
    ],
    commonWords: ["共鸣 (đồng cảm, cộng hưởng)", "鸣谢 (bày tỏ tri ân)", "一鸣惊人 (một tiếng hót làm kinh ngạc muôn người)", "雷鸣 (tiếng sấm rền)"],
    example: {
      hanzi: "他的精彩演讲引起了在场所有观众的强烈共鸣。",
      pinyin: "Tā de jīngcǎi yǎnjiǎng yǐnqǐ le zàichǎng suǒyǒu guānzhòng de qiángliè gòngmíng.",
      vi: "Bài diễn thuyết xuất sắc của anh ấy đã khơi dậy sự đồng cảm mạnh mẽ của tất cả khán giả có mặt."
    }
  },
  {
    hanzi: "吠",
    pinyin: "fèi",
    hanviet: "Phệ",
    meaning: "Chó sủa, tiếng chó gâu gâu",
    level: 3,
    strokeCount: 7,
    radicals: [
      { char: "口", name: "Khẩu", meaning: "Cái mõm, tiếng kêu" },
      { char: "犬", name: "Khuyển", meaning: "Con chó" }
    ],
    etymologyStory: "Chữ Phệ (吠) gồm bộ Khẩu (口 - chiếc mõm há rộng) và chữ Khuyển (犬 - con chó). Tượng hình sống động con chó há to chiếc mõm cất tiếng sủa inh ỏi báo động cho chủ nhà khi có người lạ đến gần.",
    memoryTip: "Chiếc mõm (口) của chú chó (犬) há to cất tiếng sủa gâu gâu là chữ Phệ (吠).",
    family: [
      { char: "犬", pinyin: "quǎn", meaning: "Con chó (gốc động vật)" },
      { char: "哭", pinyin: "kū", meaning: "Khóc lóc (hai cái miệng 口 khóc thét bên chó 犬)" },
      { char: "器", pinyin: "qì", meaning: "Khí cụ (bốn cái miệng 口 quanh chó 犬 canh giữ)" }
    ],
    commonWords: ["狂吠 (sủa dữ dội)", "吠叫 (cất tiếng sủa)", "蜀犬吠日 (chó xứ Thục thấy mặt trời lạ thì sủa - kiến thức nông cạn)"],
    example: {
      hanzi: "院子里突然传来一阵急促的狗吠声。",
      pinyin: "Yuànzi li tūrán chuán lái yí zhèn jícù de gǒu fèi shēng.",
      vi: "Trong sân đột nhiên truyền đến một hồi tiếng chó sủa dồn dập."
    }
  },
  {
    hanzi: "歪",
    pinyin: "wāi",
    hanviet: "Oai",
    meaning: "Nghiêng lệch, xiêu vẹo, không ngay thẳng",
    level: 2,
    strokeCount: 9,
    radicals: [
      { char: "不", name: "Bất", meaning: "Không" },
      { char: "正", name: "Chính", meaning: "Ngay thẳng, chính trực" }
    ],
    etymologyStory: "Chữ Oai (歪) là một sáng tạo hội ý cực kỳ hóm hỉnh và sâu sắc của văn tự Hán: Phía trên là chữ Bất (不 - không), phía dưới là chữ Chính (正 - thẳng thắn, ngay ngắn). 'Không thẳng' (不 + 正) thì tất nhiên là 'xiêu vẹo, nghiêng ngả, lệch lạc'!",
    memoryTip: "Bất (不) ở trên, Chính (正) ở dưới: Không ngay thẳng tức là Xiêu vẹo (歪).",
    family: [
      { char: "正", pinyin: "zhèng", meaning: "Ngay thẳng (gốc nghĩa)" },
      { char: "不", pinyin: "bù", meaning: "Không, phủ định" },
      { char: "甭", pinyin: "béng", meaning: "Khỏi cần (bất 不 + dụng 用)" }
    ],
    commonWords: ["歪斜 (xiêu vẹo, nghiêng)", "歪曲 (xuyên tạc, bóp méo sự thật)", "歪理 (lý lẽ xằng bậy)", "东倒西歪 (ngả nghiêng xiêu vẹo)"],
    example: {
      hanzi: "墙上的那幅画挂得有点歪，请帮我扶正一下。",
      pinyin: "Qiáng shang de nà fú huà guà de yǒudiǎn wāi, qǐng bāng wǒ fú zhèng yíxià.",
      vi: "Bức tranh trên tường kia treo hơi bị lệch, xin hãy giúp tôi chỉnh cho thẳng lại một chút."
    }
  },
  {
    hanzi: "灭",
    pinyin: "miè",
    hanviet: "Diệt",
    meaning: "Dập tắt, tiêu diệt, tàn lụi, dập lửa",
    level: 2,
    strokeCount: 5,
    radicals: [
      { char: "一", name: "Nhất", meaning: "Thanh ngang, vật che đậy" },
      { char: "火", name: "Hỏa", meaning: "Ngọn lửa" }
    ],
    etymologyStory: "Chữ giản thể Diệt (灭) gồm một nét ngang (一 - tấm bạt hoặc nắp đậy) chụp lên phía trên ngọn lửa (火). Ý nghĩa: Dùng vật nặng đè lên trên để chặn dưỡng khí, dập tắt ngọn lửa đang bốc cháy, trừ khử mối nguy hại.",
    memoryTip: "Đặt một tấm đậy (一) trùm kín dập tắt ngọn lửa (火) là chữ Diệt (灭).",
    family: [
      { char: "火", pinyin: "huǒ", meaning: "Ngọn lửa (gốc sự vật)" },
      { char: "灾", pinyin: "zāi", meaning: "Tai ương (lửa 火 cháy dưới mái nhà 宀)" },
      { char: "炭", pinyin: "tàn", meaning: "Than đá (lửa 火 vùi trong núi 山)" }
    ],
    commonWords: ["消灭 (tiêu diệt)", "灭火器 (bình chữa cháy)", "熄灭 (tắt lịm)", "毁灭 (hủy diệt)"],
    example: {
      hanzi: "消防员迅速赶到现场并扑灭了大火。",
      pinyin: "Xiāofángyuán xùnsù gǎndào xiànchǎng bìng pūmiè le dàhuǒ.",
      vi: "Lính cứu hỏa đã nhanh chóng có mặt tại hiện trường và dập tắt đám cháy lớn."
    }
  },
  {
    hanzi: "卡",
    pinyin: "kǎ / qiǎ",
    hanviet: "Tạp",
    meaning: "Thẻ, cạc, bị kẹt, chốt kiểm soát",
    level: 1,
    strokeCount: 5,
    radicals: [
      { char: "上", name: "Thượng", meaning: "Ở trên" },
      { char: "下", name: "Hạ", meaning: "Ở dưới" }
    ],
    etymologyStory: "Chữ Tạp (卡) là chữ hội ý tài tình: Nửa trên là chữ Thượng (上 - hướng lên trên), nửa dưới là chữ Hạ (下 - hướng xuống dưới). Lên không được, xuống không xong, mắc kẹt ở chính giữa ngã ba đường. Sau này mượn làm âm hài 'kǎ' cho các loại thẻ (Card).",
    memoryTip: "Kẹt ở giữa không lên được trên (上) cũng chẳng xuống được dưới (下) là chữ Kẹt / Thẻ (卡).",
    family: [
      { char: "上", pinyin: "shàng", meaning: "Ở trên (gốc vị trí)" },
      { char: "下", pinyin: "xià", meaning: "Ở dưới (gốc vị trí)" }
    ],
    commonWords: ["信用卡 (thẻ tín dụng)", "银行卡 (thẻ ngân hàng)", "卡车 (xe tải)", "卡片 (tấm thiệp, thẻ)", "关卡 (trạm kiểm soát)"],
    example: {
      hanzi: "外出旅游时一定要妥善保管好身份证和银行卡。",
      pinyin: "Wàichū lǚyóu shí yídìng yào tuǒshàn bǎoguǎn hǎo shēnfènzhèng hé yínhángkǎ.",
      vi: "Khi ra ngoài du lịch nhất định phải bảo quản cẩn thận căn cước công dân và thẻ ngân hàng."
    }
  }
];

let addedCount = 0;
for (const entry of newEntries) {
  if (!existingChars.has(entry.hanzi)) {
    currentList.push(entry);
    existingChars.add(entry.hanzi);
    addedCount++;
  }
}

fs.writeFileSync(etymoPath, JSON.stringify(currentList, null, 2), 'utf8');
console.log(`Successfully added ${addedCount} rich etymology entries! Total now: ${currentList.length}`);
