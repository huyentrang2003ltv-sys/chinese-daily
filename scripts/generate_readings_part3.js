const { tokenizeParagraph, addWord } = require('./reading_tokenizer_helper');
const existingReadings = require('./data/readings.json');

function getExisting(id, newId, newLevel) {
  const item = existingReadings.find(r => r.id === id);
  if (!item) throw new Error("Missing existing: " + id);
  return {
    ...item,
    id: newId,
    level: newLevel || item.level
  };
}

// Supplemental words for part 3
const p3Lexicon = [
  { hanzi: "茶道", pinyin: "chádào", vi: "nghệ thuật trà đạo" },
  { hanzi: "乾坤", pinyin: "qiánkūn", vi: "càn khôn, trời đất, vũ trụ" },
  { hanzi: "清心", pinyin: "qīngxīn", vi: "thanh lọc tâm hồn" },
  { hanzi: "泡茶", pinyin: "pào chá", vi: "pha trà" },
  { hanzi: "品味", pinyin: "pǐnwèi", vi: "thưởng thức, phẩm vị" },
  { hanzi: "初衷", pinyin: "chūzhōng", vi: "nguyện ước ban đầu, sơ tâm" },
  { hanzi: "忙碌", pinyin: "mánglù", vi: "bận rộn tất bật" },
  { hanzi: "星空", pinyin: "xīngkōng", vi: "bầu trời sao" },
  { hanzi: "数字经济", pinyin: "shùzì jīngjì", vi: "kinh tế số" },
  { hanzi: "移动支付", pinyin: "yídòng zhīfù", vi: "thanh toán di động" },
  { hanzi: "无现金", pinyin: "wú xiànjīn", vi: "không dùng tiền mặt" },
  { hanzi: "二维码", pinyin: "èrwèimǎ", vi: "mã QR" },
  { hanzi: "工匠精神", pinyin: "gōngjiàng jīngshén", vi: "tinh thần nghệ nhân tinh hoa" },
  { hanzi: "精益求精", pinyin: "jīng yì qiú jīng", vi: "đã tinh xảo lại càng muốn tinh xảo hơn" },
  { hanzi: "文物", pinyin: "wénwù", vi: "di vật lịch sử, cổ vật" },
  { hanzi: "苏轼", pinyin: "Sū Shì", vi: "Tô Thức (Tô Đông Pha)" },
  { hanzi: "豁达", pinyin: "huòdá", vi: "khoáng đạt, cởi mở lạc quan" },
  { hanzi: "风雨", pinyin: "fēngyǔ", vi: "mưa gió, phong ba bão táp" },
  { hanzi: "上善若水", pinyin: "shàng shàn ruò shuǐ", vi: "điều thiện cao nhất như nước" },
  { hanzi: "包容", pinyin: "bāoróng", vi: "bao dung, dung nạp" },
  { hanzi: "谦逊", pinyin: "qiānxùn", vi: "khiêm tốn nhún nhường" },
  { hanzi: "己所不欲", pinyin: "jǐ suǒ bú yù", vi: "điều mình không muốn" },
  { hanzi: "勿施于人", pinyin: "wù shī yú rén", vi: "chớ đem áp đặt cho người" },
  { hanzi: "仁爱", pinyin: "rén'ài", vi: "nhân ái, từ bi" },
  { hanzi: "宽容", pinyin: "kuānróng", vi: "khoan dung" },
  { hanzi: "大鹏", pinyin: "dàpéng", vi: "chim Đại Bằng" },
  { hanzi: "翱翔", pinyin: "áoxiáng", vi: "bay lượn trên tầng không" },
  { hanzi: "精神自由", pinyin: "jīngshén zìyóu", vi: "tự do về mặt tinh thần" },
  { hanzi: "桃花源", pinyin: "táohuāyuán", vi: "đào hoa nguyên, chốn bồng lai lý tưởng" },
  { hanzi: "宁静", pinyin: "níngjìng", vi: "yên ả thanh bình" },
  { hanzi: "量子计算", pinyin: "liàngzǐ jìsuàn", vi: "điện toán lượng tử" },
  { hanzi: "算力", pinyin: "suànlì", vi: "năng lực tính toán" },
  { hanzi: "天人合一", pinyin: "tiān rén hé yī", vi: "thiên nhân hợp nhất (người và thiên nhiên hòa hợp)" },
  { hanzi: "生态平衡", pinyin: "shēngtài pínghéng", vi: "cân bằng sinh thái" },
  { hanzi: "节气", pinyin: "jiéqì", vi: "tiết khí" },
  { hanzi: "农耕", pinyin: "nónggēng", vi: "nông canh, trồng trọt" },
  { hanzi: "新质生产力", pinyin: "xīnzhì shēngchǎnlì", vi: "lực lượng sản xuất chất lượng mới" },
  { hanzi: "创新驱动", pinyin: "chuàngxīn qūdòng", vi: "động lực đổi mới sáng tạo" },
  { hanzi: "莫高窟", pinyin: "Mògāokū", vi: "Hang Mạc Cao (Đôn Hoàng)" },
  { hanzi: "壁画", pinyin: "bìhuà", vi: "tranh bích họa trên vách đá" },
  { hanzi: "知行合一", pinyin: "zhī xíng hé yī", vi: "tri hành hợp nhất (hiểu biết đi đôi thực hành)" },
  { hanzi: "良知", pinyin: "liángzhī", vi: "lương tri, bản tâm hướng thiện" },
  { hanzi: "人类命运共同体", pinyin: "rénlèi mìngyùn gòngtóngtǐ", vi: "cộng đồng chung vận mệnh nhân loại" },
  { hanzi: "互利共赢", pinyin: "hùlì gòngyíng", vi: "đôi bên cùng có lợi, hợp tác thắng lợi" }
];
p3Lexicon.forEach(item => addWord(item.hanzi, item.pinyin, item.vi));

const newPart3StoriesRaw = [
  // 33. 中国茶道：一叶见乾坤的东方处世哲学
  {
    id: "reading_33",
    title: "中国茶道：一叶见乾坤的东方处世哲学",
    pinyin: "Zhōngguó Chádào: Yí Yè Jiàn Qiánkūn De Dōngfāng Chǔshì Zhéxué",
    hanviet: "Trung Quốc Trà Đạo: Nhất Diệp Kiến Càn Khôn Đích Đông Phương Xử Thế Triết Học (Trà Đạo Trung Hoa: Càn Khôn Trong Một Phiến Lá)",
    level: "HSK 5",
    category: "philosophy",
    categoryName: "Triết Lý Xử Thế & Cổ Học",
    source: "Trà Kinh & Văn Hóa Phương Đông",
    summary: "Trà đạo Trung Hoa không đơn thuần là việc thưởng thức thức uống, mà là một cảnh giới tu dưỡng nội tâm với bốn chữ vàng 'Hòa - Kính - Thanh - Tịch'. Lá trà trải qua lửa nóng nước sôi mới tỏa ngát hương thơm cũng như đời người qua tôi luyện mới thành nhân.",
    vocab: [
      { hanzi: "茶道", pinyin: "chádào", vi: "nghệ thuật trà đạo" },
      { hanzi: "乾坤", pinyin: "qiánkūn", vi: "càn khôn, trời đất bao la" },
      { hanzi: "沉浮", pinyin: "chénfú", vi: "chìm nổi, thăng trầm" },
      { hanzi: "历练", pinyin: "lìliàn", vi: "tôi luyện, rèn giũa" },
      { hanzi: "回甘", pinyin: "huígān", vi: "vị ngọt đọng lại sau vị đắng" },
      { hanzi: "淡泊", pinyin: "dànbó", vi: "đạm bạc, thanh thản vô vi" }
    ],
    paragraphsRaw: [
      {
        cn: "中国是茶的故乡。茶圣陆羽在《茶经》中将茶视为天涵地育的灵物。在东方哲学里，茶道的核心精神可凝练为“和、敬、清、寂”：和顺处世、谦恭敬人、清心寡欲、神思静寂。小小的一盏茶席，便是安顿纷扰心灵的精神方舟。",
        vi: "Trung Hoa là quê hương của cây trà. Trà thánh Lục Vũ trong cuốn 'Trà Kinh' đã tôn vinh trà như một linh vật hấp thu tinh hoa trời đất. Trong triết học phương Đông, tinh thần cốt lõi của trà đạo được cô đọng trong bốn chữ vàng 'Hòa, Kính, Thanh, Tịch': sống hòa thuận với đời, khiêm cung kính trọng người khác, thanh tâm gột sạch ham muốn và giữ tâm thần tĩnh lặng an yên. Một góc bàn trà con con chính là con thuyền tinh thần neo giữ tâm hồn trước muôn vàn xao động."
      },
      {
        cn: "一片茶叶在沸水中几度沉浮，正如人一生中的起伏跌宕。未经滚水烫过，何来沁人香气？茶之初尝略带苦涩，然细品之下却有绵长回甘。学会像茶一样经历风霜而不改本色，在喧嚣的红尘中守得一份淡泊与从容，便悟透了生命的大境界。",
        vi: "Một phiến lá trà chìm nổi vài phen trong làn nước sôi sùng sục, hệt như những bước thăng trầm trong một kiếp nhân sinh. Không qua nước sôi lửa bỏng, lấy đâu ra làn hương ngào ngạt thấm đẫm tâm can? Trà nhấp ngụm đầu thường đượm vị chan chát, nhưng nhấm nháp kỹ càng mới cảm nhận được vị ngọt hậu êm ái dài lâu. Học cách như phiến trà trải qua gió sương mà chẳng đổi bản sắc, giữa cõi hồng trần huyên náo vẫn giữ trọn nét thanh thản và ung dung, ấy là đã thấu triệt cảnh giới huy hoàng của kiếp người."
      }
    ],
    moral: "Đời người tựa như chén trà: đắng trước ngọt sau, thăng trầm tôi luyện. Giữ tâm tĩnh tại đón nhận mọi thử thách, hương thơm đích thực ắt sẽ ngát tỏa.",
    quiz: {
      question: "中国茶道的核心四字精神是什么？",
      options: [
        "A. 仁、义、礼、智",
        "B. 和、敬、清、寂",
        "C. 真、善、美、乐",
        "D. 忠、孝、信、勇"
      ],
      answer: 1,
      explanation: "Đoạn 1 nêu rõ: '茶道的核心精神可凝练为“和、敬、清、寂”' -> Đáp án B."
    }
  },

  // 34. 低头赶路，也别忘了抬头看星空
  {
    id: "reading_34",
    title: "低头赶路，也别忘了抬头看星空",
    pinyin: "Dītóu Gǎnlù, Yě Bié Wàngle Táitóu Kàn Xīngkōng",
    hanviet: "Đê Đầu Cản Lộ, Dã Biệt Vong Liễu Ngẩng Đầu Khán Tinh Không (Cúi Đầu Đi Đường, Đừng Quên Ngắm Sao Trời)",
    level: "HSK 5",
    category: "inspiration",
    categoryName: "Chuyện Chữa Lành & Trưởng Thành",
    source: "Triết Học Đời Sống & Tuổi Trẻ",
    summary: "Giữa áp lực sinh nhai và mục tiêu vật chất của cuộc sống mưu sinh, con người rất dễ đánh mất đi những rung cảm thi ca và lý tưởng ban đầu. Lời nhắc nhở tinh tế về sự cân bằng giữa hiện thực và ước mơ.",
    vocab: [
      { hanzi: "星空", pinyin: "xīngkōng", vi: "bầu trời ngàn sao" },
      { hanzi: "奔波", pinyin: "bēnbō", vi: "bôn ba vất vả" },
      { hanzi: "琐碎", pinyin: "suǒsuì", vi: "vụn vặt, tủn mủn" },
      { hanzi: "初心", pinyin: "chūxīn", vi: "ước mơ, hoài bão thuở ban đầu" },
      { hanzi: "浪漫", pinyin: "làngmàn", vi: "lãng mạn, thi vị" },
      { hanzi: "辽阔", pinyin: "liáokuò", vi: "bao la bát ngát" }
    ],
    paragraphsRaw: [
      {
        cn: "为了生存与前程，我们每个人都在生活的跑道上奋力奔跑。我们盯着脚下的路，计算着每一笔收支，处理着工作中的琐碎难题。然而，若常年只知低头看路，心灵便容易被世俗的风尘所蒙蔽，逐渐丧失了对诗意与崇高的渴望。",
        vi: "Vì mưu sinh và tương lai, mỗi người trong chúng ta đều đang ra sức chạy đua trên đường chạy của cuộc đời. Ta chăm chú nhìn từng bước chân dưới mặt đất, tính toán từng khoản chi tiêu thu nhập, giải quyết những khó khăn vụn vặt trong công việc. Thế nhưng, nếu quanh năm suốt tháng chỉ biết cúi gằm đầu nhìn đường, tâm hồn sẽ rất dễ bị lớp bụi bặm thế tục che mờ, dần dà đánh mất đi niềm khao khát đối với chất thơ và những lý tưởng cao đẹp."
      },
      {
        cn: "古希腊哲学家泰勒斯曾因仰望星空而掉进土坑，受人嘲笑，但黑格尔却评价说：“只有那些永远仰望星空的人，才不会掉入深坑。” 在忙碌疲惫的深夜，不妨关上电脑，走到阳台抬头看看那片浩瀚无垠的星空。星光的永恒与浩瀚会提醒你：眼前的烦恼不过沧海一粟，而你心中最初的梦想依然闪闪发光。",
        vi: "Nhà triết học Hy Lạp cổ đại Thales từng vì mải ngẩng đầu ngắm sao mà trượt chân ngã xuống hố đất, bị người đời cười chê, nhưng Hegel lại nhận định: 'Chỉ có những ai luôn ngẩng đầu nhìn lên bầu trời sao mới không bao giờ rơi vào hố sâu vực thẳm.' Trong đêm muộn bận rộn mỏi mệt, chi bằng hãy gấp màn hình máy tính lại, bước ra ban công ngẩng đầu ngắm nhìn dải ngân hà bao la bất tận. Sự vĩnh hằng và mênh mông của ngàn sao sẽ nhắc nhở bạn rằng: muộn phiền trước mắt chỉ tựa giọt nước giữa biển khơi, còn ước mơ nguyên sơ nơi sâu thẳm trái tim bạn vẫn mãi lấp lánh rạng ngời."
      }
    ],
    moral: "Sống thực tế là trách nhiệm, nhưng giữ gìn ước mơ là phẩm giá. Dù đôi chân có lấm lem bùn đất, hãy giữ cho tâm hồn luôn hướng về những vì sao rực rỡ.",
    quiz: {
      question: "文章引用黑格尔对泰勒斯的评价，想要表达的核心观点是什么？",
      options: [
        "A. 走路不看路一定会掉入坑里",
        "B. 哲学研究毫无实际价值",
        "C. 人不能只沉溺于琐碎现实，心中必须拥有崇高的精神理想与追求",
        "D. 古希腊天文学比现代发达"
      ],
      answer: 2,
      explanation: "Tác giả mượn câu chuyện ngắm sao để khẳng định con người cần giữ lý tưởng và sự phong phú trong tâm hồn thay vì chỉ cắm cúi vào vụn vặt đời thường -> C."
    }
  },

  // 35. 数字经济与移动支付的全球浪潮
  {
    id: "reading_35",
    title: "数字经济与移动支付的全球浪潮",
    pinyin: "Shùzì Jīngjì Yǔ Yídòng Zhīfù De Quánqiú Làngcháo",
    hanviet: "Số Tự Kinh Tế Dữ Di Động Chi Phó Đích Toàn Cầu Lãng Trào (Kinh Tế Số Và Làn Sóng Thanh Toán Di Động Toàn Cầu)",
    level: "HSK 5",
    category: "news",
    categoryName: "Báo Chí Thời Sự & Khoa Học",
    source: "Tạp Chí Kinh Tế & Công Nghệ Toàn Cầu",
    summary: "Sự phát triển vũ bão của nền kinh tế số và xã hội không tiền mặt tại Trung Quốc: từ một chiếc điện thoại thông minh thanh toán khắp mọi nẻo đường đến việc thúc đẩy kinh tế nông thôn và hội nhập toàn cầu.",
    vocab: [
      { hanzi: "数字经济", pinyin: "shùzì jīngjì", vi: "kinh tế số" },
      { hanzi: "移动支付", pinyin: "yídòng zhīfù", vi: "thanh toán trên thiết bị di động" },
      { hanzi: "无现金社会", pinyin: "wú xiànjīn shèhuì", vi: "xã hội không dùng tiền mặt" },
      { hanzi: "普及率", pinyin: "pǔjílǜ", vi: "tỷ lệ phổ cập" },
      { hanzi: "二维码", pinyin: "èrwèimǎ", vi: "mã QR code" },
      { hanzi: "驱动力", pinyin: "qūdònglì", vi: "động lực thúc đẩy" }
    ],
    paragraphsRaw: [
      {
        cn: "近年来，中国在数字经济领域取得了举世瞩目的成就，其中移动支付的普及更是引领了全球变革。无论是在繁华大都市的高端商场，还是偏远乡村的路边小摊，一张小小的二维码便能轻松实现所有交易，“无现金出行”早已成为数亿百姓的日常生活习惯。",
        vi: "Những năm gần đây, Trung Quốc đã đạt được những thành tựu khiến cả thế giới phải dõi theo trong lĩnh vực kinh tế số, trong đó sự phổ cập của thanh toán di động đã dẫn dắt làn sóng chuyển đổi toàn cầu. Dù là ở các trung tâm thương mại cao cấp chốn đại đô thị phồn hoa, hay các gánh hàng rong ven đường làng hẻo lánh, chỉ một chiếc mã QR nhỏ bé là có thể dễ dàng hoàn tất mọi giao dịch, 'bước ra đường không cần tiền mặt' từ lâu đã trở thành thói quen sống hàng ngày của hàng trăm triệu người dân."
      },
      {
        cn: "移动支付不仅极大降低了交易成本，提高了社会运转效率，更为农村电商、小微企业贷款以及普惠金融提供了强大支撑。随着技术标准与跨国合作的深化，中国数字支付创新正走向世界，为全球数字经济发展贡献着独特的东方智慧与实践方案。",
        vi: "Thanh toán di động không chỉ làm giảm mạnh chi phí giao dịch, nâng cao hiệu suất vận hành xã hội, mà còn cung cấp bệ đỡ vững chắc cho thương mại điện tử nông thôn, các gói tín dụng cho doanh nghiệp siêu nhỏ và tài chính toàn diện. Cùng với sự hoàn thiện của các tiêu chuẩn kỹ thuật và hợp tác xuyên biên giới, những giải pháp thanh toán số của Trung Quốc đang vươn mình ra thế giới, đóng góp trí tuệ và bài học thực tiễn độc đáo cho nền kinh tế số toàn cầu."
      }
    ],
    moral: "Đổi mới công nghệ phụng sự con người chính là chìa khóa mở ra cánh cửa phát triển thịnh vượng, bao trùm và kết nối thế giới trong kỷ nguyên số.",
    quiz: {
      question: "移动支付在中国的大规模普及带来了哪些积极影响？",
      options: [
        "A. 导致纸币完全退出历史舞台并引发通货膨胀",
        "B. 极大地降低了交易成本，提升效率，并有效赋能农村电商与普惠金融",
        "C. 增加了人们日常出行的负担",
        "D. 限制了小微企业的发展"
      ],
      answer: 1,
      explanation: "Đoạn 2 nêu rõ: '移动支付不仅极大降低了交易成本，提高了社会运转效率，更为农村电商、小微企业贷款以及普惠金融提供了强大支撑' -> B."
    }
  },

  // 36. “工匠精神”：在浮躁世界里的极致执着
  {
    id: "reading_36",
    title: "“工匠精神”：在浮躁世界里的极致执着",
    pinyin: "‘Gōngjiàng Jīngshén’: Zài Fúzào Shìjiè Lǐ De Jízhì Zhízhuó",
    hanviet: "‘Công Tượng Tinh Thần’: Tại Phù Táo Thế Giới Lý Đích Cực Trí Chấp Trước (Tinh Thần Nghệ Nhân: Sự Kiên Định Tận Cùng Giữa Thế Giới Xô Bồ)",
    level: "HSK 5",
    category: "philosophy",
    categoryName: "Triết Lý Xử Thế & Cổ Học",
    source: "Tài Liệu: Bậc Thầy Phục Chế Di Sản Cố Cung",
    summary: "Tinh thần nghệ nhân là sự kiên định bền bỉ, 'tinh ích cầu tinh' (đã tốt lại muốn tốt hơn nữa). Câu chuyện về những chuyên gia phục chế cổ vật tại Tử Cấm Thành dành trọn đời người để hồi sinh một bức tranh cổ hay chiếc đồng hồ trăm năm.",
    vocab: [
      { hanzi: "工匠精神", pinyin: "gōngjiàng jīngshén", vi: "tinh thần nghệ nhân" },
      { hanzi: "精益求精", pinyin: "jīng yì qiú jīng", vi: "đã tinh vi lại càng muốn hoàn hảo hơn" },
      { hanzi: "执着", pinyin: "zhízhuó", vi: "chấp niệm bền bỉ, kiên định" },
      { hanzi: "修复", pinyin: "xiūfù", vi: "tu bổ, phục chế" },
      { hanzi: "故宫", pinyin: "Gùgōng", vi: "Cố Cung (Tử Cấm Thành)" },
      { hanzi: "岁月", pinyin: "suìyuè", vi: "năm tháng, thời gian" }
    ],
    paragraphsRaw: [
      {
        cn: "在追求“多、快、省”的浮躁时代，“工匠精神”犹如一股清泉。工匠精神的核心，是对所从事之事的敬畏与热爱，是对每一个细节“精益求精、追求极致”的坚守。它不为短期的功利所动摇，只愿将一件事做到无可挑剔。",
        vi: "Trong một kỷ nguyên xốc nổi mải miết chạy theo tiêu chí 'nhiều, nhanh, rẻ', thì 'tinh thần nghệ nhân' tựa như một dòng suối trong lành mát rượi. Cốt lõi của tinh thần nghệ nhân là lòng kính ngưỡng và tình yêu sâu sắc đối với công việc mình gắn bó, là sự kiên định 'đã tinh xảo lại càng muốn hoàn hảo hơn, truy cầu cảnh giới tối thượng' trong từng tiểu tiết. Tinh thần ấy chẳng hề lay chuyển trước những danh lợi ngắn hạn, mà chỉ tâm niệm dồn hết tâm huyết để làm một việc cho đến mức không tì vết."
      },
      {
        cn: "在故宫博物院的红墙深处，有一群默默无闻的文物修复师。他们面对残破褪色的古画，可以坐冷板凳数月，用极细的羊毫笔一点点洗尘、接笔、全色；修复一座复杂的古代钟表，可能需要拆卸上千个微小齿轮，耗费数年光阴。他们用一生的专注对抗时间的侵蚀，让千百年前的华夏文明瑰宝重新焕发夺目光彩。",
        vi: "Nơi sâu thẳm sau những bức tường đỏ của Bảo tàng Cố Cung, có một nhóm chuyên gia phục chế di vật lịch sử ngày đêm thầm lặng cống hiến. Đối diện với những bức cổ họa rách nát phai màu, họ có thể ngồi yên trên chiếc ghế đẩu lạnh lẽo suốt nhiều tháng ròng, dùng chiếc bút lông cừu mảnh như sợi tóc từng chút một phủi bụi, nối nét, dặm màu; phục chế một chiếc đồng hồ cổ cơ khí phức tạp có thể cần tháo rời hàng ngàn bánh răng li ti, tiêu tốn cả mấy năm ròng rã. Họ dùng sự chuyên chú trọn đời mình để đối kháng lại sự bào mòn của năm tháng, khiến cho những viên ngọc quý của nền văn minh Hoa Hạ ngàn năm trước lại một lần nữa bừng sáng rạng ngời."
      }
    ],
    moral: "Giá trị đích thực của một đời người không nằm ở việc làm được bao nhiêu việc chóng vánh, mà ở chỗ có bao nhiêu việc ta đã làm với tất cả trái tim và sự toàn tâm toàn ý.",
    quiz: {
      question: "故宫文物修复师身上最生动地展现了什么精神品质？",
      options: [
        "A. 追求高薪与快速晋升",
        "B. 耐得住寂寞、精益求精、倾注一生的工匠精神",
        "C. 依靠现代机器完全代替手工",
        "D. 经常参加国际商业展览"
      ],
      answer: 1,
      explanation: "Đoạn 2 làm nổi bật tinh thần nghệ nhân kiên nhẫn, tinh ích cầu tinh: '他们用一生的专注对抗时间的侵蚀... 耐得住寂寞、精益求精' -> B."
    }
  },

  // 37. 苏轼的旷达人生：回首向来萧瑟处，也无风雨也无晴
  {
    id: "reading_37",
    title: "苏轼的旷达人生：也无风雨也无晴",
    pinyin: "Sū Shì De Kuàngdá Rénshēng: Yě Wú Fēngyǔ Yě Wú Qíng",
    hanviet: "Tô Thức Đích Khoáng Đạt Nhân Sinh: Dã Vô Phong Vũ Dã Vô Tình (Cuộc Đời Khoáng Đạt Của Tô Đông Pha)",
    level: "HSK 5",
    category: "culture",
    categoryName: "Ngụ Ngôn & Cổ Điển",
    source: "Tống Từ Tuyển Độc: Từ Bài 'Định Phong Ba'",
    summary: "Văn hào Tô Đông Pha dù cả đời bị giáng chức lưu đày đến những nơi sơn lam chướng khí, nhưng ở đâu ông cũng giữ tâm hồn lạc quan khoáng đạt, yêu đời, sáng tạo thi ca và ẩm thực tuyệt hảo.",
    vocab: [
      { hanzi: "旷达", pinyin: "kuàngdá", vi: "khoáng đạt, ung dung rộng mở" },
      { hanzi: "贬谪", pinyin: "biǎnzhé", vi: "giáng chức lưu đày" },
      { hanzi: "坎坷", pinyin: "kǎnkě", vi: "gập ghềnh gian nan" },
      { hanzi: "风雨", pinyin: "fēngyǔ", vi: "mưa gió cuộc đời" },
      { hanzi: "从容", pinyin: "cóngróng", vi: "thong dong, điềm nhiên" },
      { hanzi: "超然", pinyin: "chāorán", vi: "siêu thoát, đứng ngoài vòng danh lợi" }
    ],
    paragraphsRaw: [
      {
        cn: "北宋文学巨匠苏轼（号东坡居士）一生仕途极为坎坷，多次遭遇政治打击，被一贬再贬至黄州、惠州，乃至极偏远的海南儋州。然而，苦难并未磨灭他的生活热情，他把每一次贬谪都过成了精彩的人间诗篇。",
        vi: "Đại văn hào thời Bắc Tống Tô Thức (hiệu Đông Pha cư sĩ) cả cuộc đời đường quan lộ vô cùng gập ghềnh trắc trở, nhiều lần chịu đòn giáng chính trị nghiệt ngã, bị giáng chức liên tiếp đày ải đến Hoàng Châu, Huệ Châu, cho tới tận miền đất Hải Nam Đam Châu xa xôi cách trở. Thế nhưng, nghịch cảnh đắng cay chưa từng dập tắt ngọn lửa nhiệt huyết với cuộc đời của ông, ông đã biến mỗi chặng đường lưu đày thành những áng thơ nhân gian trác tuyệt."
      },
      {
        cn: "在黄州风雨泥泞的路上，同行者皆狼狈躲雨，唯独他柱着竹杖，穿着草鞋，边走边吟唱：“莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。” 走到雨过天晴，他回望来路，留下了千古绝唱：“回首向来萧瑟处，归去，也无风雨也无晴。” 这种超然物外、宠辱不惊的豁达心境，成为了后世无数国人在困境中的精神明灯。",
        vi: "Trên con đường Hoàng Châu mưa gió bùn lầy, những người bạn đồng hành đều nhếch nhác hoảng hốt tìm chỗ trú mưa, duy chỉ có ông tay chống gậy trúc, chân xỏ dép cói, vừa rảo bước vừa cất cao tiếng ngâm: 'Chớ nghe tiếng xao xác xuyên rừng đập lá, ngại gì vừa hú dài vừa thong thả bước. Gậy trúc giày cỏ nhẹ hơn cưỡi ngựa, sợ gì ai? Một áo tơi mặc cho mưa gió trọn cuộc đời.' Đi tới khi mưa tạnh trời quang mây tạnh, ông ngoái nhìn lại chặng đường vừa qua, để lại câu từ thiên cổ lưu danh: 'Ngoái đầu nhìn lại chốn quạnh hiu ảm đạm lúc nãy, trở về thôi, chẳng có gió mưa mà cũng chẳng có nắng.' Cảnh giới khoáng đạt siêu nhiên đứng ngoài vật chất, vinh nhục chẳng màng ấy đã trở thành ngọn đèn soi đường tinh thần bất diệt cho muôn vàn thế hệ người đời sau giữa nghịch cảnh giông bão."
      }
    ],
    moral: "Hoàn cảnh bên ngoài có thể hạn chế bước chân nhưng không bao giờ trói buộc được một tâm hồn tự do và khoáng đạt. Giữ lòng thanh thản, mọi giông bão cuộc đời rồi sẽ hóa mây bay.",
    quiz: {
      question: "苏轼在《定风波》中所展现的面对人生风雨的人生态度是什么？",
      options: [
        "A. 怨天尤人，悲伤绝望",
        "B. 逃避现实，与世隔绝",
        "C. 豁达从容、超然物外、笑对逆境",
        "D. 愤怒抗争，誓死报复"
      ],
      answer: 2,
      explanation: "Tô Đông Pha đối diện mưa gió với phong thái ung dung tự tại: '竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生... 豁达从容、超然物外' -> C."
    }
  },

  // 40. 老子《道德经》：“上善若水”的无争之德
  {
    id: "reading_40",
    title: "老子《道德经》：“上善若水”的无争之德",
    pinyin: "Lǎozǐ ‘Dàodé Jīng’: ‘Shàng Shàn Ruò Shuǐ’ De Wú Zhēng Zhī Dé",
    hanviet: "Lão Tử ‘Đạo Đức Kinh’: ‘Thượng Thiện Nhược Thủy’ Đích Vô Tranh Chi Đức (Lão Tử Đạo Đức Kinh: Thượng Thiện Như Nước)",
    level: "HSK 5 - 6",
    category: "philosophy",
    categoryName: "Triết Lý Xử Thế & Cổ Học",
    source: "Đạo Đức Kinh - Chương 8 (道德经·第八章)",
    summary: "Đỉnh cao của sự thiện lành trong tư tưởng Lão Trang được ví như tính chất của nước: nuôi dưỡng vạn vật muôn loài mà không tranh giành, khiêm nhường ở chỗ trũng, mềm mại mà chiến thắng sự cương cường.",
    vocab: [
      { hanzi: "上善若水", pinyin: "shàng shàn ruò shuǐ", vi: "điều thiện cao nhất tựa như nước" },
      { hanzi: "万物", pinyin: "wànwù", vi: "vạn vật, muôn loài" },
      { hanzi: "不争", pinyin: "bù zhēng", vi: "không tranh đoạt, nhường nhịn" },
      { hanzi: "居善地", pinyin: "jū shàn dì", vi: "ở chốn khiêm nhường" },
      { hanzi: "渊", pinyin: "yuān", vi: "vực sâu, sâu thẳm tĩnh lặng" },
      { hanzi: "包容", pinyin: "bāoróng", vi: "bao dung rộng lượng" }
    ],
    paragraphsRaw: [
      {
        cn: "《道德经》第八章开篇写道：“上善若水。水善利万物而不争，处众人之所恶，故几于道。” 老子认为，世间最崇高的善行就如同水一样：水滋润万物生长，却从不向万物索取任何回报；它甘愿流向众人不愿停留的低洼卑下之处，因此最接近天地大道的真谛。",
        vi: "Chương thứ tám của cuốn 'Đạo Đức Kinh' mở đầu bằng câu văn trác tuyệt: 'Thượng thiện nhược thủy. Thủy thiện lợi vạn vật nhi bất tranh, xử chúng nhân chi sở ố, cố cơ ư đạo' (Bậc thiện cao nhất tựa như nước. Nước khéo làm lợi cho muôn loài mà không tranh giành, cam chịu ở nơi chỗ trũng mà người đời ghét bỏ, cho nên gần với Đạo nhất). Lão Tử cho rằng điều thiện cao quý nhất chốn trần gian giống như đặc tính của nước: nước tưới mát nuôi dưỡng vạn vật sinh sôi nhưng chưa từng đòi hỏi bất kỳ sự báo đáp nào; nước vui lòng chảy về những chỗ thấp trũng mà người đời chê bai, chính vì vậy mà nước đạt tới gần nhất với chân lý của Đạo trời đất."
      },
      {
        cn: "老子进一步阐述：“居善地，心善渊，与善仁，言善信，正善治，事善能，动善时。夫唯不争，故无尤。” 水随器方圆，遇险不惊，至柔至弱却能滴水穿石。学会像水一样谦逊包容、顺势而为，不盲目争夺一时的浮名虚利，反而能成就最坚韧持久的力量。",
        vi: "Lão Tử tiếp tục diễn giải sâu sắc: 'Cư thiện địa, tâm thiện uyên, dữ thiện nhân, ngôn thiện tín, chính thiện trị, sự thiện năng, động thiện thời. Phù duy bất tranh, cố vô vưu' (Chỗ ở biết chọn chốn khiêm nhường, lòng giữ sâu lắng thanh tịnh, giao tiếp giữ trọn lòng nhân từ, lời nói giữ chữ tín sắt son, làm việc hành xử công minh, hành động biết thuận theo thời thế. Phàm chỉ vì không tranh đoạt với đời, cho nên chẳng bao giờ mắc lỗi lầm hay chuốc lấy oán than). Nước tùy hình dáng vật chứa mà tròn méo vuông vắn, gặp ghềnh thác hiểm nguy chẳng hề nao núng, tột cùng mềm mại yếu mềm nhưng nước chảy đá mòn có thể xuyên thủng cả sắt đá. Học cách như nước khiêm nhường bao dung, nương theo thời thế, không mù quáng tranh giành hư danh chốc lát, ấy mới là phương cách kiến tạo nên sức mạnh bền bỉ và vĩ đại nhất."
      }
    ],
    moral: "Nhún nhường không phải là yếu hèn, mà là trí tuệ tột đỉnh của bậc hiền triết. Nhu thắng cương, tĩnh thắng động, không tranh với đời thì thiên hạ chẳng ai tranh nổi.",
    quiz: {
      question: "老子为什么认为“水”最接近“道”？",
      options: [
        "A. 因为水能够淹没一切城池",
        "B. 因为水善利万物而不与万物争夺，甘居低洼之处",
        "C. 因为水是透明没有颜色的",
        "D. 因为古人最喜欢游泳"
      ],
      answer: 1,
      explanation: "Đoạn 1 nêu rõ căn nguyên: '水善利万物而不争，处众人之所恶，故几于道' -> B là đáp án chính xác."
    }
  },

  // 41. 孔子《论语》：“己所不欲，勿施于人”的仁恕之道
  {
    id: "reading_41",
    title: "孔子《论语》：“己所不欲，勿施于人”的仁恕之道",
    pinyin: "Kǒngzǐ ‘Lúnyǔ’: ‘Jǐ Suǒ Bú Yù, Wù Shī Yú Rén’ De Rénshù Zhī Dào",
    hanviet: "Khổng Tử ‘Luận Ngữ’: ‘Kỷ Sở Bất Dục, Vật Thi Ư Nhân’ Đích Nhân Thứ Chi Đạo (Khổng Tử Luận Ngữ: Điều Mình Không Muốn Chớ Làm Cho Người)",
    level: "HSK 5 - 6",
    category: "philosophy",
    categoryName: "Triết Lý Xử Thế & Cổ Học",
    source: "Luận Ngữ - Nhan Uyên (论语·颜渊篇)",
    summary: "Nguyên tắc vàng trong đối nhân xử thế của Nho gia: 'Điều gì mình không muốn người khác làm với mình, thì tuyệt đối chớ đem áp đặt lên người khác'. Trí tuệ thấu cảm và nền tảng của hòa bình xã hội.",
    vocab: [
      { hanzi: "己所不欲", pinyin: "jǐ suǒ bú yù", vi: "điều mình không muốn" },
      { hanzi: "勿施于人", pinyin: "wù shī yú rén", vi: "chớ đem áp đặt lên người khác" },
      { hanzi: "仁爱", pinyin: "rén'ài", vi: "lòng nhân ái thương người" },
      { hanzi: "恕道", pinyin: "shùdào", vi: "đạo tha thứ, suy bụng ta ra bụng người" },
      { hanzi: "设身处地", pinyin: "shèshēnchǔdì", vi: "đặt mình vào hoàn cảnh của người khác" },
      { hanzi: "和谐", pinyin: "héxié", vi: "hài hòa, hòa thuận" }
    ],
    paragraphsRaw: [
      {
        cn: "在《论语·卫灵公》中，子贡曾向孔子请教：“有一言而可以终身行之者乎？” 孔子回答道：“其‘恕’乎！己所不欲，勿施于人。” 这句话跨越两千五百余年的时光，被联合国及全球文明公认为人类道德伦理的“黄金准则”。",
        vi: "Trong thiên Vệ Linh Công của sách 'Luận Ngữ', học trò Tử Cống từng tha thiết thỉnh giáo Khổng Tử: 'Có một chữ nào mà có thể trọn đời lấy đó làm kim chỉ nam thực hành theo không ạ?' Khổng Tử bèn đáp: 'Ấy há chẳng phải là chữ 'Thứ' (恕) đó sao! Điều gì mình không muốn, chớ làm cho người khác.' Lời vàng ngọc ấy vượt qua chiều dài thời gian hơn 2.500 năm, được Liên Hợp Quốc cùng các nền văn minh toàn cầu đồng lòng tôn vinh là 'Quy tắc vàng' trong đạo đức và luân lý của nhân loại."
      },
      {
        cn: "所谓“恕”，即“如心”——以己之心度人之心。我们自己不希望遭遇欺骗与背叛，就绝不能用谎言去伤害同伴；我们自己渴望被尊重、被理解，就应当率先以善意与温和对待他人。在人际交往中学会“设身处地”，正是消除偏见、化解冲突、构建社会和谐的根本基石。",
        vi: "Cái gọi là chữ 'Thứ' (恕), chiết tự chính là 'Như tâm' (如心) — tức là lấy tâm lòng của chính mình mà suy bụng dạ người khác. Bản thân chúng ta không mong muốn phải gánh chịu sự dối lừa và phản bội, thì tuyệt đối không được dùng lời dối trá để làm tổn thương đồng loại; bản thân ta khát khao được tôn trọng, được thấu cảm, thì trước hết phải lấy lòng thiện lương và sự ôn nhu nhã nhặn mà đối đãi với người xung quanh. Trong các mối quan hệ giao tiếp học được cách 'đặt mình vào vị trí của người khác', đó chính là hòn đá tảng căn bản nhất để xóa bỏ định kiến, hóa giải xung đột và kiến tạo nên một xã hội đại đồng hòa hợp."
      }
    ],
    moral: "Đặt mình vào vị trí của người khác là cảnh giới cao nhất của sự lương thiện. Tôn trọng người khác chính là sự tự tôn cao quý nhất của bản thân.",
    quiz: {
      question: "孔子告诉子贡可以终身奉行的一个字是什么？其含义是什么？",
      options: [
        "A. “勇”，勇敢面对一切困难",
        "B. “恕”，即己所不欲，勿施于人，设身处地理解关怀他人",
        "C. “富”，积累财富光宗耀祖",
        "D. “名”，名扬四海天下皆知"
      ],
      answer: 1,
      explanation: "Khổng Tử căn dặn chữ 'Thứ' (恕): '其“恕”乎！己所不欲，勿施于人' -> Đáp án B."
    }
  },

  // 42. 庄子《逍遥游》：大鹏展翅与精神的终极自由
  {
    id: "reading_42",
    title: "庄子《逍遥游》：大鹏展翅与精神的终极自由",
    pinyin: "Zhuāngzǐ ‘Xiāoyáo Yóu’: Dàpéng Zhǎnchì Yǔ Jīngshén De Zhōngjí Zìyóu",
    hanviet: "Trang Tử ‘Tiêu Dao Du’: Đại Bằng Triển Dực Dữ Tinh Thần Đích Chung Cực Tự Do (Trang Tử Tiêu Dao Du: Chim Đại Bằng Vỗ Cánh & Tự Do Tinh Thần)",
    level: "HSK 5 - 6",
    category: "philosophy",
    categoryName: "Triết Lý Xử Thế & Cổ Học",
    source: "Trang Tử - Nội Thiên: Tiêu Dao Du (庄子·内篇·逍遥游)",
    summary: "Hình tượng hùng vĩ của cá Côn hóa chim Bằng vỗ cánh tung bọt sóng ba ngàn dặm, cưỡi gió lốc bay lên chín vạn dặm trời xanh. Triết lý vượt lên trên mọi giới hạn tầm thường để chạm tới tự do tuyệt đối của tâm hồn.",
    vocab: [
      { hanzi: "逍遥游", pinyin: "Xiāoyáo Yóu", vi: "Tiêu Dao Du (chuyến dạo chơi thong dong tự tại)" },
      { hanzi: "大鹏", pinyin: "dàpéng", vi: "chim Đại Bằng huyền thoại" },
      { hanzi: "扶摇直上", pinyin: "fúyáo zhí shàng", vi: "cưỡi gió lốc bay thẳng lên mây xanh" },
      { hanzi: "拘束", pinyin: "jūshù", vi: "trói buộc, gò bó" },
      { hanzi: "超脱", pinyin: "chāotuō", vi: "siêu thoát, thoát tục" },
      { hanzi: "广阔", pinyin: "guǎngkuò", vi: "khoáng đạt bao la" }
    ],
    paragraphsRaw: [
      {
        cn: "战国思想家庄子在《逍遥游》中构建了中国文学史上最雄奇宏大的意象：“北冥有鱼，其名为鲲。鲲之大，不知其几千里也；化而为鸟，其名为鹏……水击三千里，抟扶摇而上者九万里。” 庞大无朋的巨鹏展翅高飞，背负青天，穿透云霄，飞向浩瀚无垠的南海。",
        vi: "Nhà tư tưởng thời Chiến Quốc Trang Tử trong tác phẩm 'Tiêu Dao Du' đã khắc họa nên một hình tượng kỳ vĩ và tráng lệ bậc nhất trong lịch sử văn học Trung Hoa: 'Bắc minh hữu ngư, kỳ danh vi Côn. Côn chi đại, bất tri kỳ kỷ thiên lý dã; hóa nhi vi điểu, kỳ danh vi Bằng... Thủy kích tam thiên lý, đoàn phù dao nhi thượng giả cửu vạn lý' (Biển Bắc có con cá, tên nó gọi là Côn. Cá Côn to lớn, chẳng biết rộng mấy ngàn dặm; biến hóa thành loài chim, tên gọi là Bằng... vỗ cánh tung sóng ba ngàn dặm, cưỡi gió lốc vút thẳng lên chín vạn dặm mây xanh). Con chim Bằng khổng lồ dang rộng đôi cánh tung bay, lưng đội trời xanh, xé tan mây mờ, hướng về phía biển Nam bao la bất tận."
      },
      {
        cn: "林间的麻雀与斑鸠在灌木丛里跳跃，嘲笑大鹏飞那么高有什么用。庄子借此揭示了“小知不及大知，小年不及大年”的深刻哲理。真正的自由不在于肉体游历了多远，而在于打破世俗功名利禄的狭隘囚笼，让心灵翱翔于精神的宇宙，达到物我两忘、与天地同游的最高境界。",
        vi: "Lũ chim sẻ và chim gáy trong bụi rậm nhảy nhót quanh những cành gai, cười nhạo đại bàng bay cao như vậy phỏng có ích gì. Mượn câu chuyện ấy, Trang Tử đã khai sáng một triết lý sâu sắc: 'Tiểu tri bất cập đại tri, tiểu niên bất cập đại niên' (Hiểu biết nhỏ hẹp khôn sánh nổi với đại trí tuệ, tuổi thọ ngắn ngủi khôn đo nổi năm tháng trường tồn). Tự do đích thực không cốt ở chỗ thể xác đã phiêu du được bao xa, mà nằm ở sự đập tan chiếc lồng son hạn hẹp của công danh bổng lộc thế tục, để tâm hồn được sải cánh giữa vũ trụ tinh thần, đạt tới cảnh giới tối thượng 'vật ngã lưỡng vong' (quên cả vạn vật lẫn bản thân) cùng hòa chung nhịp thở thong dong với đất trời."
      }
    ],
    moral: "Tầm nhìn hạn hẹp sẽ giam cầm cuộc đời trong những toan tính tầm thường. Hãy mở rộng dung lượng tâm hồn để bay lượn như chim Đại Bằng giữa bầu trời tự do bao la.",
    quiz: {
      question: "庄子借“大鹏展翅九万里”与“林间雀鸟的嘲笑”对比，阐明了什么哲理？",
      options: [
        "A. 鸟类迁徙的自然科学规律",
        "B. 小知不及大知，人应当超越狭隘局限，追求广阔深邃的精神自由",
        "C. 捕鸟工具的制作方法",
        "D. 海洋鱼类向鸟类的进化史"
      ],
      answer: 1,
      explanation: "Trang Tử phân biệt giữa tầm nhìn thiển cận (tiểu tri) và chí hướng bao la (đại tri): '小知不及大知，小年不及大年... 打破狭隘囚笼，追求广阔精神自由' -> B."
    }
  },

  // 43. 陶渊明《桃花源记》：中国文人的永恒理想国
  {
    id: "reading_43",
    title: "陶渊明《桃花源记》：中国文人的永恒理想国",
    pinyin: "Táo Yuānmíng ‘Táo Huā Yuán Jì’: Zhōngguó Wénrén De Yǒnghéng Lǐxiǎngguó",
    hanviet: "Đào Uyên Minh ‘Đào Hoa Nguyên Ký’: Trung Quốc Văn Nhân Đích Vĩnh Hằng Lý Tưởng Quốc (Đào Hoa Nguyên Ký: Xã Hội Lý Tưởng Vĩnh Hằng Của Văn Nhân)",
    level: "HSK 6",
    category: "culture",
    categoryName: "Ngụ Ngôn & Cổ Điển",
    source: "Đào Uyên Minh Tập (陶渊明集)",
    summary: "Tuyệt phẩm tản văn kinh điển ghi lại chuyến lạc bước của người đánh cá vào chốn Đào Hoa Nguyên: đất đai màu mỡ, xóm làng thanh bình, không có chiến tranh áp bức, con người sống an nhiên hòa hợp.",
    vocab: [
      { hanzi: "桃花源", pinyin: "táohuāyuán", vi: "nguồn hoa đào, chốn thiên thai lý tưởng" },
      { hanzi: "豁然开朗", pinyin: "huò rán kāi lǎng", vi: "bỗng nhiên mở ra sáng bừng, thông suốt" },
      { hanzi: "怡然自乐", pinyin: "yí rán zì lè", vi: "vui vẻ an nhiên tự tại" },
      { hanzi: "落英缤纷", pinyin: "luò yīng bīn fēn", vi: "cánh hoa rụng lả tả tươi thắm" },
      { hanzi: "避世", pinyin: "bìshì", vi: "lánh đời, ẩn dật" },
      { hanzi: "向往", pinyin: "xiàngwǎng", vi: "hướng tới, ước vọng" }
    ],
    paragraphsRaw: [
      {
        cn: "东晋文学家陶渊明在《桃花源记》中描绘了一个如梦如幻的世外乐土。武陵渔人顺着溪流划船，偶入一片桃花林，“夹岸数百步，中无杂树，芳草鲜美，落英缤纷”。林尽水源之处有一个隐秘的山洞，渔人舍船从极狭窄的洞口穿过，初极狭，才通人，复行数十步，便“豁然开朗”。",
        vi: "Nhà văn thời Đông Tấn Đào Uyên Minh trong tác phẩm trứ danh 'Đào Hoa Nguyên Ký' đã phác họa nên một chốn bồng lai tiên cảnh ngoài trần thế đẹp tựa giấc chiêm bao. Người đánh cá vùng Vũ Lăng men theo dòng suối chèo thuyền, tình cờ lạc vào một rừng hoa đào rực rỡ, 'hai bên bờ suối trải dài mấy trăm bước, không xen lẫn cây nào khác, cỏ thơm mướt mát, cánh hoa rơi rụng lả tả ngát hương'. Hết rặng đào nơi đầu nguồn suối có một hang núi huyền bí, người đánh cá bỏ thuyền lách qua cửa hang hẹp, ban đầu rất chật chỉ vừa một người lọt, lại đi thêm mươi bước, bỗng nhiên 'khoáng đạt mở ra sáng bừng rạng rỡ'."
      },
      {
        cn: "洞中展现出另一番人间景象：“土地平旷，屋舍俨然，有良田美池桑竹之属。阡陌交通，鸡犬相闻……黄发垂髫，并怡然自乐。” 这里的村民为了躲避秦代战乱隐居于此，不知魏晋。这个没有赋税压迫、没有你争我夺、人与自然和谐共生的“世外桃源”，寄托了中国文人千百年来对和平美好社会的最深切向往。",
        vi: "Trong hang hiện ra một khung cảnh nhân gian hoàn toàn khác biệt: 'Đất đai bằng phẳng rộng rãi, nhà cửa ngay ngắn khang trang, có ruộng tốt ao trong dâu biếc trúc xanh. Đường ngang ngõ dọc thông suốt, tiếng gà gáy chó sủa văng vẳng nghe nhau... người già trẻ nhỏ thảy đều vui vẻ tự tại an nhiên.' Dân làng nơi đây vì tránh nạn đao binh thời nhà Tần mà ẩn cư chốn này, chẳng hề hay biết đến các triều đại Ngụy Tấn thăng trầm. Xã hội lý tưởng không sưu cao thuế nặng, không tranh giành hãm hại, con người cùng thiên nhiên hòa hợp sống đời an lạc mang tên 'Thế ngoại đào nguyên' ấy đã gửi gắm ước nguyện sâu sắc nhất suốt ngàn năm qua của giới văn nhân học giả về một nền hòa bình và chân thiện mỹ đích thực."
      }
    ],
    moral: "Chốn 'Đào Hoa Nguyên' đích thực không nằm ở hang sâu núi thẳm xa xôi, mà ẩn hiện ngay trong một tâm hồn biết trân trọng sự bình yên, lương thiện và yêu thương đồng loại.",
    quiz: {
      question: "“世外桃源”里的百姓为什么在那里生活，他们呈现出怎样的生活状态？",
      options: [
        "A. 被朝廷流放至此，生活困苦不堪",
        "B. 为避秦时战乱隐居于此，不知魏晋，老人小孩并怡然自乐、安居乐业",
        "C. 是一群商人为了寻找宝藏聚集在此",
        "D. 是军营里的士兵在屯田练兵"
      ],
      answer: 1,
      explanation: "Đoạn 2 nêu rõ nguyên do và cảnh ngộ: '这里的村民为了躲避秦代战乱隐居于此，不知魏晋... 黄发垂髫，并怡然自乐' -> B."
    }
  },

  // 44. 量子计算与前沿科技革命
  {
    id: "reading_44",
    title: "量子计算与前沿科技革命",
    pinyin: "Liàngzǐ Jìsuàn Yǔ Qiányán Kējì Gémìng",
    hanviet: "Lượng Tử Kế Toán Dữ Tiền Duyên Khoa Kỹ Cách Mạng (Điện Toán Lượng Tử & Cách Mạng Công Nghệ Tiền Phong)",
    level: "HSK 6",
    category: "news",
    categoryName: "Báo Chí Thời Sự & Khoa Học",
    source: "Tạp Chí Khoa Học Quốc Tế (Science / Nature)",
    summary: "Bước đột phá kỳ vĩ của công nghệ máy tính lượng tử: từ nguyên lý xếp chồng lượng tử đến các nguyên mẫu máy tính lượng tử 'Cửu Chương' và 'Tổ Xung Chi', mở ra tiềm năng giải quyết những bài toán hóc búa nhất của nhân loại.",
    vocab: [
      { hanzi: "量子计算", pinyin: "liàngzǐ jìsuàn", vi: "điện toán lượng tử" },
      { hanzi: "量子叠加", pinyin: "liàngzǐ diéjiā", vi: "sự xếp chồng lượng tử" },
      { hanzi: "量子优越性", pinyin: "liàngzǐ yōuyuèxìng", vi: "ưu thế lượng tử (Quantum Supremacy)" },
      { hanzi: "密码学", pinyin: "mìmǎxué", vi: "mật mã học" },
      { hanzi: "新药研发", pinyin: "xīnyào yánfā", vi: "nghiên cứu phát triển thuốc mới" },
      { hanzi: "突破", pinyin: "tūpò", vi: "đột phá mang tính cách mạng" }
    ],
    paragraphsRaw: [
      {
        cn: "如果说经典计算机的诞生引领了信息时代的第一次飞跃，那么量子计算的发展则正在开启人类计算能力的全新纪元。不同于经典计算机以0或1的二进制比特作为信息载体，量子比特能够利用“量子叠加”与“量子纠缠”原理，同时处于多种状态的混合体中，从而实现超乎想象的超并行计算能力。",
        vi: "Nếu như sự ra đời của máy tính cổ điển đã dẫn dắt bước nhảy vọt đầu tiên của thời đại thông tin, thì sự phát triển của điện toán lượng tử lại đang mở ra một kỷ nguyên hoàn toàn mới cho năng lực tính toán của nhân loại. Khác biệt với máy tính truyền thống vốn sử dụng các bit nhị phân mang giá trị 0 hoặc 1 làm vật mang thông tin, các qubit lượng tử có khả năng ứng dụng các nguyên lý 'xếp chồng lượng tử' và 'vướng víu lượng tử' để cùng lúc tồn tại ở trạng thái hỗn hợp của nhiều trạng thái khác nhau, từ đó hiện thực hóa năng lực tính toán song song siêu việt vượt xa mọi tưởng tượng."
      },
      {
        cn: "从中国科研团队研制出“九章”光学量子计算原型机，到“祖冲之号”超导量子计算原型机的相继问世，人类在特定计算任务上展现出了令经典超级计算机望尘莫及的“量子优越性”。未来，量子计算在破解复杂密码、模拟分子结构以加速新药研发、优化全球物流网络等关键领域，将掀起颠覆性的科技风暴。",
        vi: "Từ việc đội ngũ nghiên cứu khoa học Trung Quốc chế tạo thành công cỗ máy nguyên mẫu điện toán lượng tử quang học mang tên 'Cửu Chương', cho đến sự ra đời liên tiếp của cỗ máy lượng tử siêu dẫn mang tên 'Tổ Xung Chi', loài người trên những nhiệm vụ tính toán đặc định đã chứng minh được 'ưu thế lượng tử' khiến các siêu máy tính cổ điển hùng mạnh nhất hiện nay cũng phải chào thua. Trong tương lai, điện toán lượng tử trên các lĩnh vực then chốt như giải mã các thuật toán mật mã phức tạp, mô phỏng cấu trúc phân tử nhằm rút ngắn thời gian điều chế dược phẩm mới, hay tối ưu hóa mạng lưới logistics toàn cầu, chắc chắn sẽ tạo nên những cơn bão công nghệ mang tính cách mạng lật đổ."
      }
    ],
    moral: "Khám phá khoa học tiền phong là hành trình không ngừng bứt phá những ranh giới nhận thức của loài người, mở ra tương lai văn minh rộng lớn.",
    quiz: {
      question: "量子计算机能够实现超强并行计算能力的关键物理原理是什么？",
      options: [
        "A. 依靠更粗的电线和更高的电压",
        "B. 利用“量子叠加”与“量子纠缠”原理，量子比特可同时处于多种状态",
        "C. 使用了更快速的打字键盘",
        "D. 降低了计算机的风扇噪音"
      ],
      answer: 1,
      explanation: "Đoạn 1 nêu rõ: '量子比特能够利用“量子叠加”与“量子纠缠”原理，同时处于多种状态的混合体中，从而实现超乎想象的超并行计算能力' -> B."
    }
  },

  // 45. “天人合一”：东方哲学对当代全球气候治理的启示
  {
    id: "reading_45",
    title: "“天人合一”：东方哲学对当代全球气候治理的启示",
    pinyin: "‘Tiān Rén Hé Yī’: Dōngfāng Zhéxué Duì Dāngdài Quánqiú Qìhòu Zhìlǐ De Qǐshì",
    hanviet: "‘Thiên Nhân Hợp Nhất’: Đông Phương Triết Học Đối Đương Đại Toàn Cầu Khí Hậu Trị Lý Đích Khải Thị (Thiên Nhân Hợp Nhất & Quản Trị Khí Hậu Toàn Cầu)",
    level: "HSK 6",
    category: "philosophy",
    categoryName: "Triết Lý Xử Thế & Cổ Học",
    source: "Diễn Đàn Môi Trường & Triết Học Toàn Cầu",
    summary: "Tư tưởng triết học phương Đông coi con người là một bộ phận hữu cơ của giới tự nhiên. Trong bối cảnh biến đổi khí hậu toàn cầu, việc hồi sinh trí tuệ 'Thiên nhân hợp nhất' mang lại giải pháp căn cơ cho sự phát triển bền vững.",
    vocab: [
      { hanzi: "天人合一", pinyin: "tiān rén hé yī", vi: "người và trời đất hòa hợp làm một" },
      { hanzi: "气候治理", pinyin: "qìhòu zhìlǐ", vi: "quản trị biến đổi khí hậu" },
      { hanzi: "生态危机", pinyin: "shēngtài wēijī", vi: "khủng hoảng sinh thái" },
      { hanzi: "取之有度", pinyin: "qǔ zhī yǒu dù", vi: "khai thác có chừng mực" },
      { hanzi: "可持续", pinyin: "kěchíxù", vi: "bền vững" },
      { hanzi: "敬畏", pinyin: "jìngwèi", vi: "kính ngưỡng và tôn trọng quy luật" }
    ],
    paragraphsRaw: [
      {
        cn: "面对全球变暖、冰川消融、生物多样性锐减等日益严峻的气候危机，人类正站在反思人与自然关系的十字路口。工业文明以来“征服自然、向自然无节制索取”的二元对立思维，已经被证明是一条不可持续的歧路。",
        vi: "Đối mặt với tình trạng biến đổi khí hậu toàn cầu ngày càng gay gắt như trái đất ấm lên, băng tan chảy xiết, đa dạng sinh học sụt giảm nghiêm trọng, loài người đang đứng trước ngã tư đường buộc phải xem xét lại mối quan hệ giữa con người và thiên nhiên. Tư duy đối lập nhị nguyên kể từ cuộc cách mạng công nghiệp đến nay coi việc 'chinh phục tự nhiên, vắt kiệt tự nhiên vô hạn độ' đã bị thực tiễn chứng minh là một con đường sai lầm không thể duy trì bền vững."
      },
      {
        cn: "中国古代“天人合一”的生态哲学，为此提供了跨越时空的智慧滋养。《荀子》强调“草木荣华滋硕之时，则斧斤不入山林”；儒释道诸家皆主张人是自然不可分割的一部分，当以敬畏之心对待天地万物。“取之有度，用之有节”，人与自然生命与共。这一东方智慧为当代构建人类命运共同体、推进碳中和以及全球生态文明建设指明了根本路径。",
        vi: "Triết học sinh thái 'Thiên nhân hợp nhất' thời cổ đại phương Đông đã mang đến cho vấn đề này nguồn dưỡng chất trí tuệ vượt qua mọi rào cản thời gian và không gian. Sách 'Tuân Tử' từng răn dạy: 'Khi cây cỏ đang đâm chồi nảy lộc tươi tốt thì búa rìu chớ đốn vào rừng sâu'; các trường phái Nho - Phật - Đạo thảy đều chủ trương con người là một bộ phận hữu cơ không thể tách rời của thiên nhiên, phải lấy lòng kính ngưỡng mà đối xử với vạn vật trong đất trời. 'Khai thác có chừng mực, tiêu dùng biết tiết chế', con người và tự nhiên là một cộng đồng chung sinh mệnh. Trí tuệ phương Đông ấy đã vạch ra con đường căn bản để ngày nay kiến tạo cộng đồng chung vận mệnh nhân loại, đẩy mạnh trung hòa carbon và xây dựng nền văn minh sinh thái toàn cầu."
      }
    ],
    moral: "Bảo vệ tự nhiên chính là bảo vệ chính bản thân chúng ta. Tôn trọng quy luật của trời đất thì sự phát triển của nền văn minh mới có thể trường tồn bất diệt.",
    quiz: {
      question: "“天人合一”哲学理念在应对现代全球气候危机中最核心的主张是什么？",
      options: [
        "A. 尽一切可能加速工业化开发原始森林",
        "B. 人是自然的统治者，有权征服万物",
        "C. 人是自然不可分割的一部分，应摒弃征服思维，秉持敬畏之心、取之有度，追求人与自然和谐共生",
        "D. 停止一切科学探索回到原始生活"
      ],
      answer: 2,
      explanation: "Đoạn 2 nêu rõ: '人是自然不可分割的一部分，当以敬畏之心对待天地万物。“取之有度，用之有节”，人与自然生命与共' -> C."
    }
  },

  // 46. 二十四节气：写在华夏大地上的时间诗篇
  {
    id: "reading_46",
    title: "二十四节气：写在华夏大地上的时间诗篇",
    pinyin: "Èrshísì Jiéqì: Xiě Zài Huáxià Dàdì Shàng De Shíjiān Shīpiān",
    hanviet: "Nhị Thập Tứ Tiết Khí: Tả Tại Hoa Hạ Đại Địa Thượng Đích Thời Gian Thi Thiên (24 Tiết Khí: Bản Trường Ca Thời Gian)",
    level: "HSK 6",
    category: "culture",
    categoryName: "Ngụ Ngôn & Cổ Điển",
    source: "Di Sản Văn Hóa Phi Vật Thể Nhân Loại (UNESCO)",
    summary: "24 Tiết khí - đỉnh cao quan sát thiên văn và nông nghiệp của cổ nhân: từ Lập xuân, Vũ thủy, Kinh trập cho tới Đông chí, Đại hàn. Một hệ thống thời gian thi vị hòa quyện văn hóa, ẩm thực và nhân sinh quan.",
    vocab: [
      { hanzi: "节气", pinyin: "jiéqì", vi: "tiết khí trong năm" },
      { hanzi: "非物质文化遗产", pinyin: "fēi wùzhì wénhuà yíchǎn", vi: "di sản văn hóa phi vật thể" },
      { hanzi: "物候", pinyin: "wùhòu", vi: "hiện tượng thời tiết sinh vật theo mùa" },
      { hanzi: "农耕", pinyin: "nónggēng", vi: "nền nông nghiệp lúa nước" },
      { hanzi: "惊蛰", pinyin: "Jīngzhé", vi: "tiết Kinh trập (sấm xuân đánh thức côn trùng)" },
      { hanzi: "循序渐进", pinyin: "xúnxù jiànjìn", vi: "tuần tự tiến bước theo nhịp điệu" }
    ],
    paragraphsRaw: [
      {
        cn: "被联合国教科文组织列入人类非物质文化遗产代表作名录的“二十四节气”，是中国古代先民通过观察太阳周年运动、认知一年中时令、气候、物候变化规律所形成的知识体系，被誉为“中国第五大发明”。",
        vi: "'Hai mươi bốn tiết khí' được UNESCO ghi danh vào Danh mục Di sản văn hóa phi vật thể đại diện của nhân loại, chính là hệ thống tri thức đồ sộ được tiền nhân Trung Hoa đúc kết qua việc quan sát sự vận hành chu kỳ hàng năm của mặt trời, nhận thức sâu sắc quy luật biến đổi của thời tiết, khí hậu và sinh vật trong một năm, được ca ngợi là 'Phát minh vĩ đại thứ năm của Trung Hoa'."
      },
      {
        cn: "从“立春”的冰雪初融，到“惊蛰”的第一声春雷唤醒沉睡的泥土；从“芒种”的风吹麦浪，到“冬至”的白昼最短、围炉吃饺——每一个节气不仅是一套精准指导农耕播种与收获的时间表，更凝聚着中国人顺应自然、调养身心、品味时令美食的诗意生活美学。它是华夏祖先写在大地上的壮美诗行，流淌在每个炎黄子孙的血脉基因之中。",
        vi: "Từ sự tan rã của băng tuyết buổi 'Lập xuân', cho đến tiếng sấm đầu mùa của tiết 'Kinh trập' đánh thức vạn vật côn trùng ngủ đông trong lòng đất; từ sóng lúa mạch rập rờn trong gió tiết 'Mang chủng', cho tới tiết 'Đông chí' ngày ngắn nhất đêm dài nhất quây quần bên bếp lửa ăn bát sủi cảo nóng hổi — mỗi một tiết khí không chỉ là một bảng biểu chuẩn xác chỉ dẫn việc cày cấy gieo hạt và thu hoạch mùa màng, mà còn kết tinh mỹ học sống thi vị của người phương Đông: thuận theo tự nhiên, bồi dưỡng thể xác tinh thần và thưởng thức phong vị ẩm thực bốn mùa. Đó là những vần thơ hùng vĩ mà tổ tiên đã viết trên mặt đất bao la, mãi chảy trôi trong mạch nguồn huyết thống của muôn thế hệ con Lạc cháu Hồng."
      }
    ],
    moral: "Biết sống thuận theo nhịp điệu của đất trời và thời gian, con người sẽ tìm thấy sự cân bằng, an nhiên và dồi dào sức sống.",
    quiz: {
      question: "“二十四节气”被国际社会誉为什么？它最根本的功能是什么？",
      options: [
        "A. 现代工业化生产的流水线指标",
        "B. “中国的第五大发明”，通过认知物候规律精准指导农耕并融入诗意生活美学",
        "C. 预测股票涨跌的算命工具",
        "D. 仅仅是一首古代儿歌"
      ],
      answer: 1,
      explanation: "Đoạn 1 và 2 khẳng định: '被誉为中国第五大发明... 不仅是一套精准指导农耕播种与收获的时间表，更凝聚着诗意生活美学' -> B."
    }
  },

  // 47. 中国“新质生产力”与高质量发展格局
  {
    id: "reading_47",
    title: "中国“新质生产力”与高质量发展格局",
    pinyin: "Zhōngguó ‘Xīnzhì Shēngchǎnlì’ Yǔ Gāo Zhìliàng Fāzhǎn Géjú",
    hanviet: "Trung Quốc ‘Tân Chất Sinh Sản Lực’ Dữ Cao Chất Lượng Phát Triển Cách Cục (Lực Lượng Sản Xuất Chất Lượng Mới)",
    level: "HSK 6",
    category: "news",
    categoryName: "Báo Chí Thời Sự & Khoa Học",
    source: "Tân Hoa Xã & Nhân Dân Nhật Báo (新华社 / 人民日报)",
    summary: "Khái niệm kinh tế chiến lược 'Lực lượng sản xuất chất lượng mới' lấy đổi mới sáng tạo khoa học công nghệ làm nòng cốt: xe điện năng lượng mới, chất bán dẫn, trí tuệ nhân tạo và kinh tế xanh dẫn dắt chuyển dịch kinh tế bền vững.",
    vocab: [
      { hanzi: "新质生产力", pinyin: "xīnzhì shēngchǎnlì", vi: "lực lượng sản xuất chất lượng mới" },
      { hanzi: "创新主导", pinyin: "chuàngxīn zhǔdǎo", vi: "đổi mới sáng tạo giữ vai trò chủ đạo" },
      { hanzi: "高质量发展", pinyin: "gāo zhìliàng fāzhǎn", vi: "phát triển chất lượng cao" },
      { hanzi: "新能源汽车", pinyin: "xīn néngyuán qìchē", vi: "ô tô xe điện năng lượng mới" },
      { hanzi: "转型升级", pinyin: "zhuǎnxíng shēngjí", vi: "chuyển dịch mô hình và nâng cấp" },
      { hanzi: "核心竞争力", pinyin: "héxīn jìngzhēnglì", vi: "năng lực cạnh tranh cốt lõi" }
    ],
    paragraphsRaw: [
      {
        cn: "当前，中国经济已由高速增长阶段转向高质量发展阶段，发展“新质生产力”成为了推动经济社会转型的核心战略。所谓新质生产力，即以创新为主导，具有高科技、高效能、高质量特征，符合新发展理念的先进生产力质态。它摆脱了传统依赖大量资源消耗与廉价劳动力投入的增长路径，全面激活了科技创新的内生动力。",
        vi: "Hiện nay, nền kinh tế Trung Quốc đã chuyển dịch từ giai đoạn tăng trưởng tốc độ cao sang giai đoạn phát triển chất lượng cao, trong đó việc phát triển 'Lực lượng sản xuất chất lượng mới' đã trở thành chiến lược hạt nhân thúc đẩy sự chuyển dịch toàn diện của kinh tế - xã hội. Cái gọi là lực lượng sản xuất chất lượng mới, chính là lực lượng sản xuất tiên tiến lấy đổi mới sáng tạo làm chủ đạo, mang các đặc trưng công nghệ cao, hiệu năng cao, chất lượng cao, phù hợp với quan điểm phát triển mới. Mô hình này rũ bỏ hoàn toàn con đường tăng trưởng truyền thống vốn phụ thuộc vào việc tiêu hao lượng lớn tài nguyên thiên nhiên và nhân công giá rẻ, kích hoạt toàn diện động lực nội sinh của sáng tạo khoa học công nghệ."
      },
      {
        cn: "从全球领跑的新能源汽车、锂电池和光伏产品“新三样”，到人工智能大模型、工业母机与高端半导体的自主攻关，新质生产力正在华夏大地展现出澎湃动力。它不仅大幅提升了全要素生产率，重塑了全球产业链与供应链版图，更为世界经济复苏注入了强大的确定性与绿色动力。",
        vi: "Từ 'ba mặt hàng mới' dẫn đầu toàn cầu gồm xe điện năng lượng mới, pin lithium và các sản phẩm quang điện mặt trời, cho đến các cuộc đột phá tự chủ làm chủ công nghệ đối với mô hình lớn trí tuệ nhân tạo, máy công cụ công nghiệp nguồn và vi mạch bán dẫn cao cấp, lực lượng sản xuất chất lượng mới đang phô diễn sức mạnh cuộn trào trên khắp mọi nẻo đường đất nước. Mô hình này không chỉ nâng cao ngoạn mục năng suất tổng nhân tố (TFP), tái định hình bản đồ chuỗi cung ứng và chuỗi công nghiệp toàn cầu, mà còn tiếp thêm sự chắc chắn mạnh mẽ và động lực phát triển xanh cho sự phục hồi của kinh tế thế giới."
      }
    ],
    moral: "Đổi mới sáng tạo là cội nguồn của sự phát triển trường tồn. Quốc gia hay cá nhân muốn đứng vững ở đỉnh cao thời đại đều phải không ngừng tự làm mới năng lực cốt lõi của mình.",
    quiz: {
      question: "“新质生产力”的最核心特征与传统生产力有何根本区别？",
      options: [
        "A. 依靠增加劳动力工时和砍伐更多森林",
        "B. 以创新为主导，摆脱传统资源高消耗路径，具备高科技、高效能、高质量特征",
        "C. 停止一切工业制造只做农业",
        "D. 降低产品质量换取更低价格"
      ],
      answer: 1,
      explanation: "Đoạn 1 nêu rõ: '即以创新为主导，具有高科技、高效能、高质量特征... 摆脱了传统依赖大量资源消耗与廉价劳动力投入的增长路径' -> B."
    }
  },

  // 48. 敦煌莫高窟：千年丝绸之路的文明交响乐
  {
    id: "reading_48",
    title: "敦煌莫高窟：千年丝绸之路的文明交响乐",
    pinyin: "Dūnhuáng Mògāokū: Qiān Nián Sīchóu zhī Lù De Wénmíng Jiāoxiǎngyuè",
    hanviet: "Đôn Hoàng Mạc Cao Quật: Thiên Niên Ty Trù Chi Lộ Đích Văn Minh Giao Hưởng Nhạc (Hang Mạc Cao Đôn Hoàng: Bản Giao Hưởng Văn Minh)",
    level: "HSK 6",
    category: "culture",
    categoryName: "Ngụ Ngôn & Cổ Điển",
    source: "Viện Nghiên Cứu Đôn Hoàng (敦煌研究院)",
    summary: "Kỳ quan nghệ thuật hang động bên rìa sa mạc Gobi: hơn 700 hang động, 45.000 mét vuông bích họa và hàng ngàn tượng Phật, nơi bốn dòng chảy văn minh lớn của nhân loại (Trung Hoa, Ấn Độ, Hy Lạp, Hồi giáo) hội tụ và tỏa sáng.",
    vocab: [
      { hanzi: "莫高窟", pinyin: "Mògāokū", vi: "Hang Mạc Cao (Đôn Hoàng)" },
      { hanzi: "丝绸之路", pinyin: "Sīchóu zhī Lù", vi: "Con đường Tơ lụa" },
      { hanzi: "壁画", pinyin: "bìhuà", vi: "bích họa trên vách đá" },
      { hanzi: "飞天", pinyin: "fēitiān", vi: "tiên nữ Phi Thiên lộng lẫy" },
      { hanzi: "交融", pinyin: "jiāoróng", vi: "giao thoa, hòa quyện" },
      { hanzi: "数字化", pinyin: "shùzìhuà", vi: "số hóa bảo tồn di sản" }
    ],
    paragraphsRaw: [
      {
        cn: "在河西走廊西端的茫茫戈壁深处，静静伫立着举世无双的艺术宝库——敦煌莫高窟。国学大师季羡林曾盛赞：“世界上历史悠久、地域广阔、自成体系、影响深远的文化体系只有四个：中国、印度、希腊、伊斯兰，再没有第五个；而这四个文化体系汇流的地方只有一个，就是中国的敦煌。”",
        vi: "Nơi sâu thẳm giữa sa mạc Gobi mênh mông hoang vắng tại mũi phía tây của Hành lang Hà Tây, có một kho tàng nghệ thuật vô song trên đời đang trầm mặc tọa lạc mang tên Hang Mạc Cao Đôn Hoàng. Đại học giả Quý Tiện Lâm từng hết lời ca ngợi: 'Trên thế gian này những hệ thống văn hóa có bề dày lịch sử ngàn năm, địa bàn rộng lớn, tự thành hệ thống hoàn chỉnh và sức ảnh hưởng sâu xa chỉ có đúng bốn hệ thống: Trung Hoa, Ấn Độ, Hy Lạp và Hồi giáo, tuyệt nhiên không có cái thứ năm; và nơi duy nhất mà bốn dòng chảy văn hóa vĩ đại ấy gặp gỡ, giao thoa và hội tụ chỉ có một nơi, đó chính là Đôn Hoàng của Trung Quốc.'"
      },
      {
        cn: "莫高窟开凿历经十六国至元代的一千多年，现存洞窟七百三十五个，壁画四万五千多平方米，彩塑两千四百余尊。壁画上翩翩起舞、彩带飘拂的“飞天”，手持中亚乐器的乐伎，以及丝路商旅云集的生动市井，无不展现出中华文明开放包容、兼收并蓄的博大胸襟。如今通过先进的“数字敦煌”技术，这座千年风沙中的宝库正在数字云端获得永生，向全世界奏响跨越时空的文明交响曲。",
        vi: "Hang Mạc Cao trải qua quá trình đục khắc miệt mài suốt hơn một ngàn năm từ thời Thập Lục Quốc kéo dài cho tới tận thời nhà Nguyên, hiện còn lưu giữ 735 hang động, hơn 45.000 mét vuông bích họa và trên 2.400 pho tượng đất màu quý giá. Trên các vách đá, hình ảnh những nàng 'Phi Thiên' nhẹ nhàng múa lượn với dải lụa ngũ sắc tung bay, những nhạc công cầm trên tay các loại nhạc cụ Trung Á, cùng khung cảnh phố xá nhộn nhịp thương buôn các nước tấp nập trên Con đường Tơ lụa, thảy đều minh chứng sống động cho tấm lòng rộng mở bao dung, thu nạp tinh hoa muôn phương của nền văn minh Trung Hoa. Ngày nay, thông qua công nghệ 'Đôn Hoàng số hóa' tối tân, kho tàng nghìn năm giữa gió cát sa mạc này đang được tái sinh vĩnh hằng trên nền tảng đám mây số, cất lên bản giao hưởng văn minh vượt thời gian tới toàn thể nhân loại."
      }
    ],
    moral: "Văn minh phát triển nhờ giao lưu, phong phú nhờ học hỏi lẫn nhau. Sự cởi mở và bao dung chính là nguồn nhựa sống giúp văn hóa trường tồn qua hàng ngàn năm phong ba.",
    quiz: {
      question: "学者季羡林先生把敦煌评价为什么样的地方？",
      options: [
        "A. 中国最干旱贫瘠的荒漠",
        "B. 世界上唯一汇聚了中国、印度、希腊、伊斯兰四大文化体系的地方",
        "C. 古代最重要的军事重镇要塞",
        "D. 盛产黄金宝石的矿区"
      ],
      answer: 1,
      explanation: "Đoạn 1 trích dẫn lời Quý Tiện Lâm: '而这四个文化体系汇流的地方只有一个，就是中国的敦煌' -> Đáp án B."
    }
  },

  // 49. 王阳明“知行合一”的心学智慧
  {
    id: "reading_49",
    title: "王阳明“知行合一”的心学智慧",
    pinyin: "Wáng Yángmíng ‘Zhī Xíng Hé Yī’ De Xīnxué Zhìhuì",
    hanviet: "Vương Dương Minh ‘Tri Hành Hợp Nhất’ Đích Tâm Học Trí Tuệ (Vương Dương Minh: Tri Hành Hợp Nhất)",
    level: "HSK 6",
    category: "philosophy",
    categoryName: "Triết Lý Xử Thế & Cổ Học",
    source: "Truyền Tập Lục (传习录)",
    summary: "Tư tưởng triết học đỉnh cao của Tâm học Vương Dương Minh: Biết mà không làm tức là chưa biết thực sự. Nhận thức đúng đắn và hành động quả cảm là hai mặt không thể tách rời của một thể thống nhất.",
    vocab: [
      { hanzi: "知行合一", pinyin: "zhī xíng hé yī", vi: "tri hành hợp nhất (biết và làm là một)" },
      { hanzi: "心学", pinyin: "xīnxué", vi: "Tâm học" },
      { hanzi: "致良知", pinyin: "zhì liángzhī", vi: "phát huy lương tri bản thiện" },
      { hanzi: "实践", pinyin: "shíjiàn", vi: "thực hành, thực tiễn" },
      { hanzi: "笃行", pinyin: "dǔxíng", vi: "kiên định thực hiện đến cùng" },
      { hanzi: "觉醒", pinyin: "juéxǐng", vi: "thức tỉnh, giác ngộ" }
    ],
    paragraphsRaw: [
      {
        cn: "明代思想家、军事家王阳明创立的阳明心学，是中国哲学史上一座令人仰止的高峰，其核心命题便是“知行合一”。王阳明指出：“知是行之始，行是知之成。若会得时，只说一个知，已自有行在；只说一个行，已自有知在。”",
        vi: "Tâm học Dương Minh do nhà tư tưởng, nhà quân sự kiệt xuất thời nhà Minh Vương Dương Minh sáng lập là một đỉnh cao chói lọi trong lịch sử triết học Trung Quốc, mà mệnh đề hạt nhân chính là 'Tri hành hợp nhất' (Biết và làm hòa làm một). Vương Dương Minh đã chỉ rõ: 'Tri thị hành chi thủy, hành thị tri chi thành. Nhược hội đắc thời, chỉ thuyết nhất cá tri, dĩ tự hữu hành tại; chỉ thuyết nhất cá hành, dĩ tự hữu tri tại' (Biết là khởi đầu của hành động, hành động là sự hoàn thành viên mãn của sự biết. Nếu đã thấu hiểu tường tận, chỉ nói một chữ 'Tri' thì đã hàm chứa 'Hành' ở trong đó; chỉ nói một chữ 'Hành' thì đã tự có 'Tri' ở bên trong rồi)."
      },
      {
        cn: "世人常犯的毛病是“知而不行”：懂得无数做人做事的大道理，却在面对利益诱惑与挫折时踟蹰不前、随波逐流。在王阳明看来，尚未付诸实践的“知”根本算不上真知，就像知道孝顺父母却从不端一杯茶、问一声好一样虚伪。唯有将内心的“良知”转化为日常生活中的果敢笃行，在事上磨炼，方能做到身处逆境而不动心，成就光明磊落的崇高人格。",
        vi: "Căn bệnh mà người đời thường mắc phải nhất chính là 'biết mà không làm': thông hiểu vanh vách hàng ngàn đạo lý làm người và xử thế, nhưng đứng trước cám dỗ lợi ích hay giông bão thử thách thì lại ngập ngừng thụt lùi, buông xuôi trôi dạt theo dòng đời. Dưới mắt nhìn của Vương Dương Minh, thứ hiểu biết mà chưa từng đem ra thực hành trải nghiệm thì căn bản chẳng thể gọi là 'Chân tri', cũng hệt như kẻ miệng bảo biết hiếu thảo với cha mẹ nhưng chẳng bao giờ chịu bưng một chén nước ấm, hỏi một câu thăm hỏi thì thật đạo đức giả biết bao. Chỉ khi nào đem 'Lương tri' trong tâm chuyển hóa thành hành động kiên định quả cảm trong đời sống thường nhật, tôi rèn qua từng công việc thực tế, bấy giờ mới có thể đạt tới cảnh giới đứng trước nghịch cảnh mà tâm không lay động, kiến tạo nên nhân cách quang minh lỗi lạc ngời sáng."
      }
    ],
    moral: "Hành động là thước đo duy nhất kiểm chứng chân lý. Đừng chỉ là người tích lũy lý thuyết suông; hãy là người dũng cảm bước đi và biến những điều tốt đẹp thành hiện thực.",
    quiz: {
      question: "王阳明“知行合一”学说对于“知”与“行”的关系是怎样界定的？",
      options: [
        "A. 必须先花几十年时间把世上所有的书读完，然后才能开始行动",
        "B. 知是行之始，行是知之成；尚未付诸行动的知不是真知，真知必定体现在躬身实践中",
        "C. 只要脑子里想过就算做到了，行动毫无意义",
        "D. 读书人和劳动者应当严格分工，互不干涉"
      ],
      answer: 1,
      explanation: "Vương Dương Minh khẳng định biết và làm là một, biết mà không hành chưa phải chân tri: '知是行之始，行是知之成。尚未付诸实践的知根本算不上真知' -> B."
    }
  },

  // 50. 人类命运共同体：文明互鉴与跨文化对话
  {
    id: "reading_50",
    title: "人类命运共同体：文明互鉴与跨文化对话",
    pinyin: "Rénlèi Mìngyùn Gòngtóngtǐ: Wénmíng Hù Jiàn Yǔ Kuà Wénhuà Duìhuà",
    hanviet: "Nhân Loại Mệnh Vận Cộng Đồng Thể: Văn Minh Hỗ Giám Dữ Khóa Văn Hóa Đối Thoại (Cộng Đồng Chung Vận Mệnh Nhân Loại)",
    level: "HSK 6",
    category: "news",
    categoryName: "Báo Chí Thời Sự & Khoa Học",
    source: "Diễn Đàn Hợp Tác Quốc Tế & Đối Thoại Văn Minh Toàn Cầu",
    summary: "Trong thế kỷ 21 đầy biến động, khái niệm 'Cộng đồng chung vận mệnh nhân loại' đề cao sự đa dạng văn hóa: 'Vạn vật cùng sinh mà không làm hại nhau, đạo cùng vận hành mà không trái nhau', cùng chung tay giải quyết các thách thức toàn cầu.",
    vocab: [
      { hanzi: "人类命运共同体", pinyin: "rénlèi mìngyùn gòngtóngtǐ", vi: "cộng đồng chung vận mệnh nhân loại" },
      { hanzi: "文明互鉴", pinyin: "wénmíng hù jiàn", vi: "các nền văn minh cùng học hỏi lẫn nhau" },
      { hanzi: "和而不同", pinyin: "hé ér bù tóng", vi: "hòa hợp mà vẫn giữ bản sắc riêng biệt" },
      { hanzi: "对话", pinyin: "duìhuà", vi: "đối thoại, bàn thảo" },
      { hanzi: "包容", pinyin: "bāoróng", vi: "bao dung, dung nạp sự khác biệt" },
      { hanzi: "共赢", pinyin: "gòngyíng", vi: "đôi bên cùng thắng, cùng phát triển" }
    ],
    paragraphsRaw: [
      {
        cn: "当今世界正经历百年未有之大变局，气候变化、地缘冲突、公共卫生以及人工智能监管等跨国挑战层出不穷。没有哪个国家能够退回到自我封闭的孤岛，人类生活在同一个地球村里，一荣俱荣，一损俱损。“构建人类命运共同体”理念顺应历史潮流，为动荡的世界指明了合作共赢的人间正道。",
        vi: "Thế giới ngày nay đang trải qua những biến động lớn chưa từng thấy trong một thế kỷ qua, các thách thức mang tính toàn cầu như biến đổi khí hậu, xung đột địa chính trị, an ninh y tế cộng đồng và giám sát kiểm soát trí tuệ nhân tạo liên tục nảy sinh. Không một quốc gia nào có thể rút lui vào một hòn đảo biệt lập tự phong tỏa, loài người đang cùng sinh sống trong cùng một ngôi làng toàn cầu, một nước vinh thì muôn nước cùng thịnh, một nước suy thì muôn phương cùng nguy hại. Quan điểm 'Xây dựng cộng đồng chung vận mệnh nhân loại' thuận theo dòng chảy của thời đại, chỉ ra con đường chính đạo nhân gian hợp tác cùng thắng lợi cho một thế giới đang nhiều chấn động."
      },
      {
        cn: "文明因多样而交流，因交流而互鉴，因互鉴而发展。中华文明自古倡导“和而不同”、“万物并育而不相害，道并行而不相悖”。我们应当摒弃“文明冲突”与零和博弈的陈旧思维，以平等、包容、尊重的态度促进跨文化对话，让不同文明在互学互鉴中各美其美、美美与共，携手创造人类更加和平繁荣的共同明天。",
        vi: "Văn minh nhờ tính đa dạng mà giao lưu, nhờ giao lưu mà học hỏi lẫn nhau, nhờ học hỏi lẫn nhau mà không ngừng phát triển. Nền văn minh Trung Hoa từ ngàn xưa luôn đề cao đạo lý 'Hòa nhi bất đồng' (hòa hợp mà không đồng hóa rập khuôn), 'Vạn vật tịnh dục nhi bất tương hại, đạo tịnh hành nhi bất tương bội' (Vạn vật cùng sinh sôi mà chẳng hề làm hại lẫn nhau, các con đường cùng vận hành mà không hề xung khắc). Chúng ta cần phải kiên quyết rũ bỏ tư duy lỗi thời về 'xung đột văn minh' và trò chơi có tổng bằng không (Zero-sum game), lấy thái độ bình đẳng, bao dung và tôn trọng để thúc đẩy đối thoại liên văn hóa, khiến cho các nền văn minh khác nhau trong quá trình học hỏi thấu hiểu đều có thể phô diễn nét đẹp độc đáo của mình, tôn vinh nét đẹp của nhau, cùng chung tay kiến tạo một ngày mai hòa bình và thịnh vượng rạng rỡ cho toàn thể nhân loại."
      }
    ],
    moral: "Thế giới này rực rỡ bởi trăm hoa đua nở. Tôn trọng sự khác biệt và chung tay hợp tác là con đường duy nhất dẫn lối nhân loại đến một tương lai tươi sáng.",
    quiz: {
      question: "“构建人类命运共同体”主张在不同文明交流交往中秉持怎样的根本原则？",
      options: [
        "A. 强迫所有文明完全遵循同一种文化模式",
        "B. 宣扬文明优劣论并进行排他性竞争",
        "C. 倡导“和而不同”、平等包容、交流互鉴，让不同文明各美其美、美美与共",
        "D. 完全切断一切国际文化与人员往来"
      ],
      answer: 2,
      explanation: "Đoạn 2 nêu rõ: '中华文明自古倡导“和而不同”... 以平等、包容、尊重的态度促进跨文化对话，让不同文明在互学互鉴中各美其美、美美与共' -> C."
    }
  }
];

// Combine all 20 Part 3 readings:
function buildPart3() {
  const processedNew = newPart3StoriesRaw.map(story => {
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

  const r31 = getExisting('reading_news_1', 'reading_31', 'HSK 5');
  const r32 = getExisting('reading_news_5', 'reading_32', 'HSK 5');
  const r33 = processedNew.find(s => s.id === 'reading_33');
  const r34 = processedNew.find(s => s.id === 'reading_34');
  const r35 = processedNew.find(s => s.id === 'reading_35');
  const r36 = processedNew.find(s => s.id === 'reading_36');
  const r37 = processedNew.find(s => s.id === 'reading_37');
  const r38 = getExisting('reading_news_3', 'reading_38', 'HSK 5 - 6');
  const r39 = getExisting('reading_news_4', 'reading_39', 'HSK 5 - 6');
  const r40 = processedNew.find(s => s.id === 'reading_40');
  const r41 = processedNew.find(s => s.id === 'reading_41');
  const r42 = processedNew.find(s => s.id === 'reading_42');
  const r43 = processedNew.find(s => s.id === 'reading_43');
  const r44 = processedNew.find(s => s.id === 'reading_44');
  const r45 = processedNew.find(s => s.id === 'reading_45');
  const r46 = processedNew.find(s => s.id === 'reading_46');
  const r47 = processedNew.find(s => s.id === 'reading_47');
  const r48 = processedNew.find(s => s.id === 'reading_48');
  const r49 = processedNew.find(s => s.id === 'reading_49');
  const r50 = processedNew.find(s => s.id === 'reading_50');

  return [
    r31, r32, r33, r34, r35, r36, r37, r38, r39, r40,
    r41, r42, r43, r44, r45, r46, r47, r48, r49, r50
  ];
}

module.exports = buildPart3;
