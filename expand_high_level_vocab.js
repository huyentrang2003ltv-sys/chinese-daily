const fs = require('fs');
const path = require('path');

const dictPath = path.join(__dirname, 'data', 'dictionary.json');
let dictionary = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

const existingTitles = new Set(dictionary.map(w => w.title));

const newWords = [
  // HSK 4 High-yield
  {
    title: "坚持",
    pinyin: "jiānchí",
    meaning: "kiên trì, giữ vững",
    pos: "động từ",
    level: 4,
    lesson: 1,
    exampleSentence: "只要坚持努力，你就一定会成功。",
    examplePinyin: "Zhǐyào jiānchí nǔlì, nǐ jiù yídìng huì chénggōng.",
    exampleMeaning: "Chỉ cần kiên trì nỗ lực, bạn nhất định sẽ thành công."
  },
  {
    title: "关键",
    pinyin: "guānjiàn",
    meaning: "then chốt, mấu chốt, điểm cốt tử",
    pos: "danh từ / tính từ",
    level: 4,
    lesson: 1,
    exampleSentence: "这是解决整个问题的关键步骤。",
    examplePinyin: "Zhè shì jiějué zhěnggè wèntí de guānjiàn bùzhòu.",
    exampleMeaning: "Đây là bước đi then chốt để giải quyết toàn bộ vấn đề."
  },
  {
    title: "态度",
    pinyin: "tàidu",
    meaning: "thái độ",
    pos: "danh từ",
    level: 4,
    lesson: 2,
    exampleSentence: "态度决定一切，细节决定成败。",
    examplePinyin: "Tàidu juédìng yíqiè, xìjié juédìng chéngbài.",
    exampleMeaning: "Thái độ quyết định tất cả, chi tiết quyết định thành bại."
  },
  {
    title: "责任",
    pinyin: "zérèn",
    meaning: "trách nhiệm",
    pos: "danh từ",
    level: 4,
    lesson: 2,
    exampleSentence: "每个人都应该对自己的行为承担责任。",
    examplePinyin: "Měi gè rén dōu yīnggāi duì zìjǐ de xíngwéi chéngdān zérèn.",
    exampleMeaning: "Mỗi người đều nên chịu trách nhiệm cho hành vi của chính mình."
  },
  {
    title: "适应",
    pinyin: "shìyìng",
    meaning: "thích nghi, làm quen",
    pos: "động từ",
    level: 4,
    lesson: 3,
    exampleSentence: "他很快适应了新工作环境。",
    examplePinyin: "Tā hěn kuài shìyìng le xīn gōngzuò huánjìng.",
    exampleMeaning: "Anh ấy rất nhanh chóng thích nghi với môi trường làm việc mới."
  },
  {
    title: "积累",
    pinyin: "jīlěi",
    meaning: "tích lũy",
    pos: "động từ / danh từ",
    level: 4,
    lesson: 3,
    exampleSentence: "学习语言需要长期积累词汇。",
    examplePinyin: "Xuéxí yǔyán xūyào chángqī jīlěi cíhuì.",
    exampleMeaning: "Học ngoại ngữ đòi hỏi tích lũy từ vựng lâu dài."
  },
  {
    title: "骄傲",
    pinyin: "jiāo'ào",
    meaning: "tự hào / kiêu ngạo",
    pos: "tính từ",
    level: 4,
    lesson: 4,
    exampleSentence: "父母为你的优秀表现感到非常骄傲。",
    examplePinyin: "Fùmǔ wèi nǐ de yōuxiù biǎoxiàn gǎndào fēicháng jiāo'ào.",
    exampleMeaning: "Bố mẹ cảm thấy rất tự hào vì biểu hiện xuất sắc của bạn."
  },
  {
    title: "鼓励",
    pinyin: "gǔlì",
    meaning: "cổ vũ, khích lệ",
    pos: "động từ / danh từ",
    level: 4,
    lesson: 4,
    exampleSentence: "老师经常鼓励我们大胆开口说中文。",
    examplePinyin: "Lǎoshī jīngcháng gǔlì wǒmen dàdǎn kāikǒu shuō zhōngwén.",
    exampleMeaning: "Thầy cô thường xuyên khích lệ chúng tôi mạnh dạn mở miệng nói tiếng Trung."
  },
  {
    title: "顺利",
    pinyin: "shùnlì",
    meaning: "thuận lợi, suôn sẻ",
    pos: "tính từ",
    level: 4,
    lesson: 5,
    exampleSentence: "祝你的新项目一切顺利！",
    examplePinyin: "Zhù nǐ de xīn xiàngmù yíqiè shùnlì!",
    exampleMeaning: "Chúc dự án mới của bạn mọi sự thuận lợi!"
  },
  {
    title: "深刻",
    pinyin: "shēnkè",
    meaning: "sâu sắc",
    pos: "tính từ",
    level: 4,
    lesson: 5,
    exampleSentence: "这次旅行给我留下了深刻的印象。",
    examplePinyin: "Zhè cì lǚxíng gěi wǒ liúxià le shēnkè de yìnxiàng.",
    exampleMeaning: "Chuyến du lịch lần này để lại cho tôi ấn tượng sâu sắc."
  },

  // HSK 5 High-yield
  {
    title: "效率",
    pinyin: "xiàolǜ",
    meaning: "hiệu suất, năng suất làm việc",
    pos: "danh từ",
    level: 5,
    lesson: 1,
    exampleSentence: "使用AI工具能显著提升办公效率。",
    examplePinyin: "Shǐyòng AI gōngjù néng xiǎnzhù tíshēng bàngōng xiàolǜ.",
    exampleMeaning: "Sử dụng công cụ AI có thể nâng cao đáng kể hiệu suất văn phòng."
  },
  {
    title: "启发",
    pinyin: "qǐfā",
    meaning: "gợi mở, gợi ý, truyền cảm hứng",
    pos: "động từ / danh từ",
    level: 5,
    lesson: 1,
    exampleSentence: "他的演讲给我带来了极大的启发。",
    examplePinyin: "Tā de yǎnjiǎng gěi wǒ dài lái le jí dà de qǐfā.",
    exampleMeaning: "Bài diễn thuyết của anh ấy mang lại cho tôi niềm gợi mở rất lớn."
  },
  {
    title: "核心",
    pinyin: "héxīn",
    meaning: "cốt lõi, hạt nhân, trung tâm",
    pos: "danh từ",
    level: 5,
    lesson: 2,
    exampleSentence: "创新是推动企业发展的核心竞争力。",
    examplePinyin: "Chuàngxīn shì tuīdòng qǐyè fāzhǎn de héxīn jìngzhēnglì.",
    exampleMeaning: "Đổi mới sáng tạo là năng lực cạnh tranh cốt lõi thúc đẩy doanh nghiệp phát triển."
  },
  {
    title: "挑战",
    pinyin: "tiǎozhàn",
    meaning: "thách thức, khiêu chiến",
    pos: "động từ / danh từ",
    level: 5,
    lesson: 2,
    exampleSentence: "我们要勇敢迎接未来的每一个挑战。",
    examplePinyin: "Wǒmen yào yǒnggǎn yíngjiē wèilái de měi yí gè tiǎozhàn.",
    exampleMeaning: "Chúng ta cần dũng cảm đón nhận mọi thách thức của tương lai."
  },
  {
    title: "趋势",
    pinyin: "qūshì",
    meaning: "xu thế, xu hướng phát triển",
    pos: "danh từ",
    level: 5,
    lesson: 3,
    exampleSentence: "绿色环保已成为全球产业发展的主流趋势。",
    examplePinyin: "Lǜsè huánbǎo yǐ chéngwéi quánqiú chǎnyè fāzhǎn de zhǔliú qūshì.",
    exampleMeaning: "Bảo vệ môi trường xanh đã trở thành xu thế chủ lưu trong phát triển công nghiệp toàn cầu."
  },
  {
    title: "克服",
    pinyin: "kèfú",
    meaning: "khắc phục, vượt qua trở ngại",
    pos: "động từ",
    level: 5,
    lesson: 3,
    exampleSentence: "只要大家团结一致，就能克服所有困难。",
    examplePinyin: "Zhǐyào dàjiā tuánjié yízhì, jiù néng kèfú suǒyǒu kùnnan.",
    exampleMeaning: "Chỉ cần mọi người đoàn kết một lòng, sẽ có thể khắc phục mọi khó khăn."
  },
  {
    title: "谨慎",
    pinyin: "jǐnshèn",
    meaning: "cẩn trọng, thận trọng",
    pos: "tính từ",
    level: 5,
    lesson: 4,
    exampleSentence: "在签署商业合同前必须谨慎审查条款。",
    examplePinyin: "Zài qiānshǔ shāngyè hétong qián bìxū jǐnshèn shěnchá tiáokuǎn.",
    exampleMeaning: "Trước khi ký hợp đồng thương mại phải cẩn trọng thẩm định từng điều khoản."
  },
  {
    title: "逻辑",
    pinyin: "luóji",
    meaning: "logic, tính hợp lý",
    pos: "danh từ",
    level: 5,
    lesson: 4,
    exampleSentence: "这篇分析报告的逻辑非常严密。",
    examplePinyin: "Zhè piān fēnxī bàogào de luóji fēicháng yánmì.",
    exampleMeaning: "Logic của bản báo cáo phân tích này vô cùng chặt chẽ."
  },
  {
    title: "潜力",
    pinyin: "qiánlì",
    meaning: "tiềm năng",
    pos: "danh từ",
    level: 5,
    lesson: 5,
    exampleSentence: "这位年轻员工具有极大的发展潜力。",
    examplePinyin: "Zhè wèi niánqīng yuángōng jùyǒu jí dà de fāzhǎn qiánlì.",
    exampleMeaning: "Nhân viên trẻ này sở hữu tiềm năng phát triển cực kỳ lớn."
  },
  {
    title: "持续",
    pinyin: "chíxù",
    meaning: "kéo dài, liên tục, bền vững",
    pos: "động từ / tính từ",
    level: 5,
    lesson: 5,
    exampleSentence: "企业应坚持可持续发展的绿色理念。",
    examplePinyin: "Qǐyè yīng jiānchí kě chíxù fāzhǎn de lǜsè lǐniàn.",
    exampleMeaning: "Doanh nghiệp nên kiên trì theo đuổi quan điểm phát triển xanh bền vững."
  },

  // HSK 6 Master Level
  {
    title: "战略",
    pinyin: "zhànlüè",
    meaning: "chiến lược, tầm nhìn vĩ mô",
    pos: "danh từ",
    level: 6,
    lesson: 1,
    exampleSentence: "公司正在制定未来五年的全球出海战略。",
    examplePinyin: "Gōngsī zhèngzài zhìdìng wèilái wǔ nián de quánqiú chūhǎi zhànlüè.",
    exampleMeaning: "Công ty đang lập chiến lược vươn ra thị trường toàn cầu trong năm năm tới."
  },
  {
    title: "卓越",
    pinyin: "zhuóyuè",
    meaning: "xuất sắc, trác việt, vượt trội",
    pos: "tính từ",
    level: 6,
    lesson: 1,
    exampleSentence: "他凭借卓越的领导才能赢得了大家的尊重。",
    examplePinyin: "Tā píngjiè zhuóyuè de lǐngdǎo cáinéng yíngdé le dàjiā de zūnzhòng.",
    exampleMeaning: "Anh ấy nhờ vào tài lãnh đạo trác việt mà giành được sự kính trọng của mọi người."
  },
  {
    title: "颠覆",
    pinyin: "diānfù",
    meaning: "lật đổ, đột phá thay đổi toàn diện (disrupt)",
    pos: "động từ",
    level: 6,
    lesson: 2,
    exampleSentence: "生成式人工智能正在颠覆传统的内容创作模式。",
    examplePinyin: "Shēngchéngshì réngōng zhìnéng zhèngzài diānfù chuántǒng de nèiróng chuàngzuò móshì.",
    exampleMeaning: "Trí tuệ nhân tạo tạo sinh đang thay đổi toàn diện mô hình sáng tạo nội dung truyền thống."
  },
  {
    title: "规范",
    pinyin: "guīfàn",
    meaning: "quy phạm, chuẩn mực, tiêu chuẩn hóa",
    pos: "danh từ / động từ",
    level: 6,
    lesson: 2,
    exampleSentence: "建立规范的行业标准有助于促进行业良性发展。",
    examplePinyin: "Jiànlì guīfàn de hángyè biāozhǔn yǒu zhù yú cùjìn hángyè liángxìng fāzhǎn.",
    exampleMeaning: "Xây dựng tiêu chuẩn ngành chuẩn mực sẽ giúp thúc đẩy ngành phát triển lành mạnh."
  },
  {
    title: "贯彻",
    pinyin: "guànchè",
    meaning: "quán triệt, thực hiện đến nơi đến chốn",
    pos: "động từ",
    level: 6,
    lesson: 3,
    exampleSentence: "全体员工必须贯彻执行安全生产规章。",
    examplePinyin: "Quántǐ yuángōng bìxū guànchè zhíxíng ānquán shēngchǎn guīzhāng.",
    exampleMeaning: "Toàn thể nhân viên phải quán triệt thi hành quy định an toàn sản xuất."
  },
  {
    title: "宏图",
    pinyin: "hóngtú",
    meaning: "đại kế, hoài bão lớn",
    pos: "danh từ",
    level: 6,
    lesson: 3,
    exampleSentence: "祝愿贵集团在新的一年大展宏图！",
    examplePinyin: "Zhùyuàn guì jítuán zài xīn de yì nián dà zhǎn hóngtú!",
    exampleMeaning: "Kính chúc quý tập đoàn trong năm mới phát huy đại kế huy hoàng!"
  },

  // CHUYÊN NGÀNH THƯƠNG MẠI & KINH DOANH
  {
    title: "谈判",
    pinyin: "tánpàn",
    meaning: "đàm phán, thương lượng",
    pos: "động từ / danh từ",
    level: 5,
    lesson: 6,
    exampleSentence: "双方代表在商业谈判中达成了初步共识。",
    examplePinyin: "Shuāngfāng dàibiǎo zài shāngyè tánpàn zhōng dáchéng le chūbù gòngshí.",
    exampleMeaning: "Đại diện hai bên đã đạt được đồng thuận bước đầu trong đàm phán thương mại."
  },
  {
    title: "预算",
    pinyin: "yùsuàn",
    meaning: "ngân sách, dự toán",
    pos: "danh từ",
    level: 5,
    lesson: 6,
    exampleSentence: "这个季度的市场推广预算已获得董事会批准。",
    examplePinyin: "Zhè ge jìdù de shìchǎng tuīguǎng yùsuàn yǐ huòdé dǒngshìhuì pīzhǔn.",
    exampleMeaning: "Ngân sách quảng bá thị trường quý này đã được hội đồng quản trị phê duyệt."
  },
  {
    title: "现金流",
    pinyin: "xiànjīnliú",
    meaning: "dòng tiền (cash flow)",
    pos: "danh từ",
    level: 5,
    lesson: 7,
    exampleSentence: "充足的现金流是初创企业生存的命脉。",
    examplePinyin: "Chōngzú de xiànjīnliú shì chūchuàng qǐyè shēngcún de mìngmài.",
    exampleMeaning: "Dòng tiền dồi dào là huyết mạch sinh tồn của doanh nghiệp khởi nghiệp."
  },
  {
    title: "供应链",
    pinyin: "gōngyìngliàn",
    meaning: "chuỗi cung ứng (supply chain)",
    pos: "danh từ",
    level: 5,
    lesson: 7,
    exampleSentence: "优化跨国供应链能有效降低采购物流成本。",
    examplePinyin: "Yōuhuà kuàguó gōngyìngliàn néng yǒuxiào jiàngdī cǎigòu wùliú chéngběn.",
    exampleMeaning: "Tối ưu hóa chuỗi cung ứng xuyên biên giới giúp giảm chi phí thu mua và vận chuyển hiệu quả."
  },
  {
    title: "市场份额",
    pinyin: "shìchǎng fèn'é",
    meaning: "thị phần (market share)",
    pos: "danh từ",
    level: 6,
    lesson: 4,
    exampleSentence: "凭借出色的产品质量，该品牌占据了30%的市场份额。",
    examplePinyin: "Píngjiè chūsè de chǎnpǐn zhìliàng, gāi pǐnpái zhànjù le sānshí bǎifēnzhī de shìchǎng fèn'é.",
    exampleMeaning: "Nhờ chất lượng sản phẩm xuất sắc, thương hiệu này đã chiếm lĩnh 30% thị phần."
  },
  {
    title: "知识产权",
    pinyin: "zhīshì chǎnquán",
    meaning: "quyền sở hữu trí tuệ",
    pos: "danh từ",
    level: 6,
    lesson: 4,
    exampleSentence: "科技公司非常重视保护自己的知识产权与专利。",
    examplePinyin: "Kējì gōngsī fēicháng zhòngshì bǎohù zìjǐ de zhīshì chǎnquán yǔ zhuānlì.",
    exampleMeaning: "Các công ty công nghệ rất coi trọng việc bảo hộ quyền sở hữu trí tuệ và bằng sáng chế của mình."
  },

  // CHUYÊN NGÀNH CÔNG NGHỆ THÔNG TIN & AI
  {
    title: "人工智能",
    pinyin: "réngōng zhìnéng",
    meaning: "trí tuệ nhân tạo (AI)",
    pos: "danh từ",
    level: 5,
    lesson: 8,
    exampleSentence: "人工智能技术正在深刻改变各行各业的生产方式。",
    examplePinyin: "Réngōng zhìnéng jìshù zhèngzài shēnkè gǎibiàn gè háng gè yè de shēngchǎn fāngshì.",
    exampleMeaning: "Công nghệ trí tuệ nhân tạo đang thay đổi sâu sắc phương thức sản xuất của mọi ngành nghề."
  },
  {
    title: "机器学习",
    pinyin: "jīqì xuéxí",
    meaning: "học máy (machine learning)",
    pos: "danh từ",
    level: 5,
    lesson: 8,
    exampleSentence: "机器学习算法能够从海量数据中自主提取特征。",
    examplePinyin: "Jīqì xuéxí suànfǎ nénggòu cóng hǎiliàng shùjù zhōng zìzhǔ tíqǔ tèzhēng.",
    exampleMeaning: "Thuật toán học máy có khả năng tự động trích xuất đặc trưng từ khối lượng dữ liệu khổng lồ."
  },
  {
    title: "大数据",
    pinyin: "dà shùjù",
    meaning: "dữ liệu lớn (Big Data)",
    pos: "danh từ",
    level: 5,
    lesson: 9,
    exampleSentence: "大数据分析有助于企业精准把握消费者的真实需求。",
    examplePinyin: "Dà shùjù fēnxī yǒu zhù yú qǐyè jīngzhǔn bǎwò xiāofèizhě de zhēnshí xūqiú.",
    exampleMeaning: "Phân tích dữ liệu lớn giúp doanh nghiệp nắm bắt chuẩn xác nhu cầu thực tế của người tiêu dùng."
  },
  {
    title: "云计算",
    pinyin: "yún jìsuàn",
    meaning: "điện toán đám mây (Cloud Computing)",
    pos: "danh từ",
    level: 5,
    lesson: 9,
    exampleSentence: "云计算让企业无需自建机房即可按需调用算力资源。",
    examplePinyin: "Yún jìsuàn ràng qǐyè wúxū zì jiàn jīfáng jíkě àn xū diàoyòng suànlì zīyuán.",
    exampleMeaning: "Điện toán đám mây cho phép doanh nghiệp điều động tài nguyên tính toán theo nhu cầu mà không cần tự xây phòng máy chủ."
  },
  {
    title: "区块链",
    pinyin: "qūkuàiliàn",
    meaning: "chuỗi khối (blockchain)",
    pos: "danh từ",
    level: 6,
    lesson: 5,
    exampleSentence: "区块链技术以去中心化和不可篡改著称。",
    examplePinyin: "Qūkuàiliàn jìshù yǐ qù zhōngxīnhuà hé bù kě cuàngǎi zhùchēng.",
    exampleMeaning: "Công nghệ blockchain nổi tiếng nhờ tính phi tập trung và không thể sửa đổi."
  },
  {
    title: "神经网络",
    pinyin: "shénjīng wǎngluò",
    meaning: "mạng nơ-ron (neural network)",
    pos: "danh từ",
    level: 6,
    lesson: 5,
    exampleSentence: "卷积神经网络常用于计算机视觉与图像识别任务。",
    examplePinyin: "Juǎnjī shénjīng wǎngluò cháng yòng yú jìsuànjī shìjué yǔ túxiàng shíbié rènwu.",
    exampleMeaning: "Mạng nơ-ron tích chập thường được ứng dụng trong thị giác máy tính và nhận diện hình ảnh."
  },

  // CHUYÊN NGÀNH Y TẾ & SỨC KHỎE
  {
    title: "免疫力",
    pinyin: "miǎnyìlì",
    meaning: "hệ miễn dịch, sức đề kháng",
    pos: "danh từ",
    level: 5,
    lesson: 10,
    exampleSentence: "均衡饮食和规律作息能有效提高人体免疫力。",
    examplePinyin: "Jūnhéng yǐnshí hé guīlǜ zuòxī néng yǒuxiào tígāo réntǐ miǎnyìlì.",
    exampleMeaning: "Chế độ ăn uống cân bằng và sinh hoạt điều độ giúp nâng cao sức đề kháng hiệu quả."
  },
  {
    title: "临床试验",
    pinyin: "línchuáng shìyàn",
    meaning: "thử nghiệm lâm sàng",
    pos: "danh từ",
    level: 6,
    lesson: 6,
    exampleSentence: "该新药已顺利通过三期临床试验，获批上市。",
    examplePinyin: "Gāi xīn yào yǐ shùnlì tōngguò sān qī línchuáng shìyàn, huò pī shàngshì.",
    exampleMeaning: "Loại thuốc mới này đã vượt qua thuận lợi giai đoạn ba thử nghiệm lâm sàng và được phê duyệt lưu hành."
  },
  {
    title: "心理健康",
    pinyin: "xīnlǐ jiànkāng",
    meaning: "sức khỏe tâm lý, sức khỏe tinh thần",
    pos: "danh từ",
    level: 5,
    lesson: 10,
    exampleSentence: "现代社会中，心理健康与身体健康同样重要。",
    examplePinyin: "Xiàndài shèhuì zhōng, xīnlǐ jiànkāng yǔ shēntǐ jiànkāng tóngyàng zhòngyào.",
    exampleMeaning: "Trong xã hội hiện đại, sức khỏe tâm lý cũng quan trọng không kém sức khỏe thể chất."
  },
  {
    title: "预防医学",
    pinyin: "yùfáng yīxué",
    meaning: "y học dự phòng",
    pos: "danh từ",
    level: 6,
    lesson: 6,
    exampleSentence: "预防医学强调防患于未然，注重疾病的早期筛查。",
    examplePinyin: "Yùfáng yīxué qiángdiào fáng huàn yú wèirán, zhùzhòng jíbìng de zǎoqī shāichá.",
    exampleMeaning: "Y học dự phòng nhấn mạnh việc phòng ngừa rủi ro từ sớm, chú trọng tầm soát bệnh ở giai đoạn đầu."
  }
];

let addedCount = 0;
newWords.forEach(w => {
  if (!existingTitles.has(w.title)) {
    dictionary.push(w);
    existingTitles.add(w.title);
    addedCount++;
  }
});

fs.writeFileSync(dictPath, JSON.stringify(dictionary, null, 2), 'utf8');
console.log(`Đã mở rộng thành công ${addedCount} từ vựng HSK 4-6 & chuyên ngành! Tổng số từ hiện tại: ${dictionary.length}`);
