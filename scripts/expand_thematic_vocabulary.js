const fs = require('fs');
const path = require('path');

const dictPath = path.join(__dirname, '../data/dictionary.json');
const currentWords = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// Existing word set by title
const existingTitles = new Set(currentWords.map(w => w.title));

// Dedicated Thematic Additions for topics that need more depth
const THEMATIC_ADDITIONS = [
  // ✈️ Du Lịch & Khách Sạn (travel)
  {
    title: "护照",
    pinyin: "hùzhào",
    meaning: "hộ chiếu",
    pos: "danh từ",
    level: 3,
    topicId: "travel",
    topicName: "Du Lịch & Khách Sạn",
    topicZh: "旅游住宿",
    topicIcon: "✈️",
    exampleSentence: "出国旅游必须随身携带护照。",
    examplePinyin: "Chūguó lǚyóu bìxū suíshēn xiédài hùzhào.",
    exampleMeaning: "Đi du lịch nước ngoài nhất định phải mang theo hộ chiếu bên mình."
  },
  {
    title: "签证",
    pinyin: "qiānzhèng",
    meaning: "thị thực, visa",
    pos: "danh từ",
    level: 3,
    topicId: "travel",
    topicName: "Du Lịch & Khách Sạn",
    topicZh: "旅游住宿",
    topicIcon: "✈️",
    exampleSentence: "去中国留学需要办理学生签证。",
    examplePinyin: "Qù Zhōngguó liúxué xūyào bànlǐ xuéshēng qiānzhèng.",
    exampleMeaning: "Đi Trung Quốc du học cần làm visa du học sinh."
  },
  {
    title: "预订",
    pinyin: "yùdìng",
    meaning: "đặt trước, book trước (phòng, vé)",
    pos: "động từ",
    level: 3,
    topicId: "travel",
    topicName: "Du Lịch & Khách Sạn",
    topicZh: "旅游住宿",
    topicIcon: "✈️",
    exampleSentence: "我在网上预订了一间双人房。",
    examplePinyin: "Wǒ zài wǎngshàng yùdìng le yī jiān shuāngrén fáng.",
    exampleMeaning: "Tôi đã đặt trước một phòng đôi trên mạng."
  },
  {
    title: "登机牌",
    pinyin: "dēngjīpái",
    meaning: "thẻ lên máy bay, boarding pass",
    pos: "danh từ",
    level: 4,
    topicId: "travel",
    topicName: "Du Lịch & Khách Sạn",
    topicZh: "旅游住宿",
    topicIcon: "✈️",
    exampleSentence: "请出示您的护照和登机牌。",
    examplePinyin: "Qǐng chūshì nín de hùzhào hé dēngjīpái.",
    exampleMeaning: "Xin vui lòng xuất trình hộ chiếu và thẻ lên máy bay của bạn."
  },
  {
    title: "海关",
    pinyin: "hǎiguān",
    meaning: "hải quan, cửa khẩu",
    pos: "danh từ",
    level: 4,
    topicId: "travel",
    topicName: "Du Lịch & Khách Sạn",
    topicZh: "旅游住宿",
    topicIcon: "✈️",
    exampleSentence: "过海关的时候需要检查行李。",
    examplePinyin: "Guò hǎiguān de shíhou xūyào jiǎnchá xíngli.",
    exampleMeaning: "Khi qua hải quan cần phải kiểm tra hành lý."
  },
  {
    title: "导游",
    pinyin: "dǎoyóu",
    meaning: "hướng dẫn viên du lịch",
    pos: "danh từ",
    level: 3,
    topicId: "travel",
    topicName: "Du Lịch & Khách Sạn",
    topicZh: "旅游住宿",
    topicIcon: "✈️",
    exampleSentence: "导游正在热情地介绍景点的历史。",
    examplePinyin: "Dǎoyóu zhèngzài rèqíng de jièshào jǐngdiǎn de lìshǐ.",
    exampleMeaning: "Hướng dẫn viên du lịch đang nhiệt tình giới thiệu lịch sử điểm tham quan."
  },
  {
    title: "风景",
    pinyin: "fēngjǐng",
    meaning: "phong cảnh, cảnh đẹp",
    pos: "danh từ",
    level: 3,
    topicId: "travel",
    topicName: "Du Lịch & Khách Sạn",
    topicZh: "旅游住宿",
    topicIcon: "✈️",
    exampleSentence: "这里的山水风景真是太美了。",
    examplePinyin: "Zhèlǐ de shānshuǐ fēngjǐng zhēnshi tài měi le.",
    exampleMeaning: "Phong cảnh non nước ở đây thật sự quá đẹp."
  },
  {
    title: "行李箱",
    pinyin: "xínglixiāng",
    meaning: "va li, va li hành lý",
    pos: "danh từ",
    level: 3,
    topicId: "travel",
    topicName: "Du Lịch & Khách Sạn",
    topicZh: "旅游住宿",
    topicIcon: "✈️",
    exampleSentence: "这个行李箱又轻便又结实。",
    examplePinyin: "Zhège xínglixiāng yòu qīngbiàn yòu jiēshi.",
    exampleMeaning: "Chiếc va li này vừa nhẹ vừa chắc chắn."
  },
  {
    title: "退房",
    pinyin: "tuìfáng",
    meaning: "trả phòng khách sạn",
    pos: "động từ",
    level: 3,
    topicId: "travel",
    topicName: "Du Lịch & Khách Sạn",
    topicZh: "旅游住宿",
    topicIcon: "✈️",
    exampleSentence: "酒店规定中午十二点以前退房。",
    examplePinyin: "Jiǔdiàn guīdìng zhōngwǔ shí'èr diǎn yǐqián tuìfáng.",
    exampleMeaning: "Khách sạn quy định trả phòng trước 12 giờ trưa."
  },

  // 💼 Công Sở & Kinh Doanh (work)
  {
    title: "面试",
    pinyin: "miànshì",
    meaning: "phỏng vấn xin việc",
    pos: "danh từ / động từ",
    level: 3,
    topicId: "work",
    topicName: "Công Sở & Kinh Doanh",
    topicZh: "职场商务",
    topicIcon: "💼",
    exampleSentence: "明天上午九点我有一场重要的面试。",
    examplePinyin: "Míngtiān shàngwǔ jiǔ diǎn wǒ yǒu yī chǎng zhòngyào de miànshì.",
    exampleMeaning: "Sáng mai 9 giờ tôi có một buổi phỏng vấn quan trọng."
  },
  {
    title: "薪水",
    pinyin: "xīnshuǐ",
    meaning: "tiền lương, thu nhập",
    pos: "danh từ",
    level: 4,
    topicId: "work",
    topicName: "Công Sở & Kinh Doanh",
    topicZh: "职场商务",
    topicIcon: "💼",
    exampleSentence: "这份工作的薪水待遇非常不错。",
    examplePinyin: "Zhè fèn gōngzuò de xīnshuǐ dàiyù fēicháng bùcuò.",
    exampleMeaning: "Mức lương và đãi ngộ của công việc này rất tốt."
  },
  {
    title: "加班",
    pinyin: "jiābān",
    meaning: "tăng ca, làm thêm giờ",
    pos: "động từ",
    level: 3,
    topicId: "work",
    topicName: "Công Sở & Kinh Doanh",
    topicZh: "职场商务",
    topicIcon: "💼",
    exampleSentence: "年底为了赶项目经常要加班。",
    examplePinyin: "Niándǐ wèile gǎn xiàngmù jīngcháng yào jiābān.",
    exampleMeaning: "Cuối năm để kịp dự án thường xuyên phải tăng ca."
  },
  {
    title: "升职",
    pinyin: "shēngzhí",
    meaning: "thăng chức, lên chức",
    pos: "động từ",
    level: 4,
    topicId: "work",
    topicName: "Công Sở & Kinh Doanh",
    topicZh: "职场商务",
    topicIcon: "💼",
    exampleSentence: "恭喜你在新的一年里升职加薪！",
    examplePinyin: "Gōngxǐ nǐ zài xīn de yī nián lǐ shēngzhí jiāxīn!",
    exampleMeaning: "Chúc mừng bạn trong năm mới được thăng chức tăng lương!"
  },
  {
    title: "合同",
    pinyin: "hétong",
    meaning: "hợp đồng kinh tế / lao động",
    pos: "danh từ",
    level: 3,
    topicId: "work",
    topicName: "Công Sở & Kinh Doanh",
    topicZh: "职场商务",
    topicIcon: "💼",
    exampleSentence: "双方顺利签署了为期三年的商业合同。",
    examplePinyin: "Shuāngfāng shùnlì qiānshǔ le wéiqī sān nián de shāngyè hétong.",
    exampleMeaning: "Hai bên đã thuận lợi ký kết hợp đồng thương mại thời hạn ba năm."
  },
  {
    title: "谈判",
    pinyin: "tánpàn",
    meaning: "đàm phán, thương lượng",
    pos: "danh từ / động từ",
    level: 4,
    topicId: "work",
    topicName: "Công Sở & Kinh Doanh",
    topicZh: "职场商务",
    topicIcon: "💼",
    exampleSentence: "经过几轮艰苦的谈判，双方终于达成共识。",
    examplePinyin: "Jīngguò jǐ lún jiānkǔ de tánpàn, shuāngfāng zhōngyú dáchéng gòngshí.",
    exampleMeaning: "Qua nhiều vòng đàm phán gian nan, hai bên rốt cuộc đã đạt được đồng thuận."
  },
  {
    title: "项目",
    pinyin: "xiàngmù",
    meaning: "dự án, hạng mục",
    pos: "danh từ",
    level: 3,
    topicId: "work",
    topicName: "Công Sở & Kinh Doanh",
    topicZh: "职场商务",
    topicIcon: "💼",
    exampleSentence: "我们团队正在全力推进这个新项目。",
    examplePinyin: "Wǒmen tuánduì zhèngzài quánlì tuījìn zhège xīn xiàngmù.",
    exampleMeaning: "Đội ngũ của chúng tôi đang dốc sức thúc đẩy dự án mới này."
  },

  // 🏥 Sức Khỏe & Y Tế (health)
  {
    title: "体温",
    pinyin: "tǐwēn",
    meaning: "nhiệt độ cơ thể, thân nhiệt",
    pos: "danh từ",
    level: 3,
    topicId: "health",
    topicName: "Sức Khỏe & Y Tế",
    topicZh: "医疗健康",
    topicIcon: "🏥",
    exampleSentence: "护士正在为发烧的病人测量体温。",
    examplePinyin: "Hùshi zhèngzài wèi fāshāo de bìngrén cèliáng tǐwēn.",
    exampleMeaning: "Y tá đang đo thân nhiệt cho bệnh nhân bị sốt."
  },
  {
    title: "药方",
    pinyin: "yàofāng",
    meaning: "đơn thuốc, toa thuốc",
    pos: "danh từ",
    level: 4,
    topicId: "health",
    topicName: "Sức Khỏe & Y Tế",
    topicZh: "医疗健康",
    topicIcon: "🏥",
    exampleSentence: "请按照医生开的药方按时吃药。",
    examplePinyin: "Qǐng ànzhào yīshēng kāi de yàofāng ànshí chīyào.",
    exampleMeaning: "Xin hãy uống thuốc đúng giờ theo đơn bác sĩ đã kê."
  },
  {
    title: "挂号",
    pinyin: "guàhào",
    meaning: "lấy số khám bệnh, đăng ký khám",
    pos: "động từ",
    level: 3,
    topicId: "health",
    topicName: "Sức Khỏe & Y Tế",
    topicZh: "医疗健康",
    topicIcon: "🏥",
    exampleSentence: "看病前必须先去门诊窗口挂号。",
    examplePinyin: "Kànbìng qián bìxū xiān qù ménzhěn chuāngkǒu guàhào.",
    exampleMeaning: "Trước khi khám bệnh nhất định phải đến quầy tiếp đón để lấy số đăng ký."
  },
  {
    title: "打针",
    pinyin: "dǎzhēn",
    meaning: "tiêm thuốc, chích thuốc",
    pos: "động từ",
    level: 2,
    topicId: "health",
    topicName: "Sức Khỏe & Y Tế",
    topicZh: "医疗健康",
    topicIcon: "🏥",
    exampleSentence: "小孩子生病时最害怕去医院打针。",
    examplePinyin: "Xiǎoháizi shēngbìng shí zuì hàipà qù yīyuàn dǎzhēn.",
    exampleMeaning: "Trẻ con lúc ốm sợ nhất là phải đến bệnh viện tiêm thuốc."
  },
  {
    title: "头痛",
    pinyin: "tóutòng",
    meaning: "đau đầu, nhức đầu",
    pos: "danh từ / động từ",
    level: 3,
    topicId: "health",
    topicName: "Sức Khỏe & Y Tế",
    topicZh: "医疗健康",
    topicIcon: "🏥",
    exampleSentence: "昨晚没睡好，今天一直感觉头痛。",
    examplePinyin: "Zuówǎn méi shuìhǎo, jīntiān yīzhí gǎnjué tóutòng.",
    exampleMeaning: "Tối qua ngủ không ngon, hôm nay cứ thấy đau đầu suốt."
  },
  {
    title: "恢复",
    pinyin: "huīfù",
    meaning: "hồi phục, bình phục sức khỏe",
    pos: "động từ",
    level: 3,
    topicId: "health",
    topicName: "Sức Khỏe & Y Tế",
    topicZh: "医疗健康",
    topicIcon: "🏥",
    exampleSentence: "经过一周的调养，他的身体已经完全恢复了。",
    examplePinyin: "Jīngguò yī zhōu de tiáoyǎng, tā de shēntǐ yǐjīng wánquán huīfù le.",
    exampleMeaning: "Qua một tuần tĩnh dưỡng, cơ thể anh ấy đã hồi phục hoàn toàn."
  },

  // 📱 Công Nghệ & Kỹ Thuật Số (tech)
  {
    title: "充电宝",
    pinyin: "chōngdiànbǎo",
    meaning: "sạc dự phòng, pin dự phòng",
    pos: "danh từ",
    level: 3,
    topicId: "tech",
    topicName: "Công Nghệ & Kỹ Thuật Số",
    topicZh: "科技数码",
    topicIcon: "📱",
    exampleSentence: "出门前记得把充电宝充满电。",
    examplePinyin: "Chūmén qián jìde bǎ chōngdiànbǎo chōng mǎn diàn.",
    exampleMeaning: "Trước khi ra ngoài nhớ sạc đầy pin dự phòng."
  },
  {
    title: "下载",
    pinyin: "xiàzǎi",
    meaning: "tải xuống, download",
    pos: "động từ",
    level: 3,
    topicId: "tech",
    topicName: "Công Nghệ & Kỹ Thuật Số",
    topicZh: "科技数码",
    topicIcon: "📱",
    exampleSentence: "你可以在应用商店免费下载这款汉语学习软件。",
    examplePinyin: "Nǐ kěyǐ zài yìngyòng shāngdiàn miǎnfèi xiàzǎi zhè kuǎn Hànyǔ xuéxí ruǎnjiàn.",
    exampleMeaning: "Bạn có thể tải miễn phí phần mềm học tiếng Trung này trên kho ứng dụng."
  },
  {
    title: "扫码",
    pinyin: "sǎomǎ",
    meaning: "quét mã QR code",
    pos: "động từ",
    level: 3,
    topicId: "tech",
    topicName: "Công Nghệ & Kỹ Thuật Số",
    topicZh: "科技数码",
    topicIcon: "📱",
    exampleSentence: "在中国买东西几乎都是扫码支付。",
    examplePinyin: "Zài Zhōngguó mǎi dōngxi jīhū dōushì sǎomǎ zhīfù.",
    exampleMeaning: "Ở Trung Quốc mua đồ hầu như đều quét mã QR để thanh toán."
  },
  {
    title: "信号",
    pinyin: "xìnhào",
    meaning: "tín hiệu sóng, sóng điện thoại / wifi",
    pos: "danh từ",
    level: 3,
    topicId: "tech",
    topicName: "Công Nghệ & Kỹ Thuật Số",
    topicZh: "科技数码",
    topicIcon: "📱",
    exampleSentence: "地下室里的手机信号不太好。",
    examplePinyin: "Dìxiàshì lǐ de shǒujī xìnhào bù tài hǎo.",
    exampleMeaning: "Sóng điện thoại trong tầng hầm không được tốt lắm."
  },
  {
    title: "屏幕",
    pinyin: "píngmù",
    meaning: "màn hình hiển thị",
    pos: "danh từ",
    level: 3,
    topicId: "tech",
    topicName: "Công Nghệ & Kỹ Thuật Số",
    topicZh: "科技数码",
    topicIcon: "📱",
    exampleSentence: "长时间看电脑屏幕容易导致眼睛疲劳。",
    examplePinyin: "Cháng shíjiān kàn diànnǎo píngmù róngyì dǎozhì yǎnjing píláo.",
    exampleMeaning: "Nhìn màn hình máy tính thời gian dài dễ dẫn đến mỏi mắt."
  },

  // 🛍️ Mua Sắm & Thời Trang (shopping)
  {
    title: "打折",
    pinyin: "dǎzhé",
    meaning: "giảm giá, chiết khấu",
    pos: "động từ",
    level: 3,
    topicId: "shopping",
    topicName: "Mua Sắm & Thời Trang",
    topicZh: "购物时装",
    topicIcon: "🛍️",
    exampleSentence: "这家商场周末全场商品八折优惠。",
    examplePinyin: "Zhè jiā shāngchǎng zhōumò quánchǎng shāngpǐn bā zhé yōuhuì.",
    exampleMeaning: "Trung tâm thương mại này cuối tuần toàn bộ hàng giảm giá 20% (bán giá 80%)."
  },
  {
    title: "发票",
    pinyin: "fāpiào",
    meaning: "hóa đơn VAT, hóa đơn thanh toán",
    pos: "danh từ",
    level: 3,
    topicId: "shopping",
    topicName: "Mua Sắm & Thời Trang",
    topicZh: "购物时装",
    topicIcon: "🛍️",
    exampleSentence: "付款后收银员会给您开具正规发票。",
    examplePinyin: "Fùkuǎn hòu shōuyínyuán huì gěi nín kāijù zhèngguī fāpiào.",
    exampleMeaning: "Sau khi thanh toán nhân viên thu ngân sẽ xuất hóa đơn chính thức cho bạn."
  },
  {
    title: "试衣间",
    pinyin: "shìyījiān",
    meaning: "phòng thử đồ, phòng thử quần áo",
    pos: "danh từ",
    level: 3,
    topicId: "shopping",
    topicName: "Mua Sắm & Thời Trang",
    topicZh: "购物时装",
    topicIcon: "🛍️",
    exampleSentence: "请问试衣间在哪个方向？",
    examplePinyin: "Qǐngwèn shìyījiān zài nǎge fāngxiàng?",
    exampleMeaning: "Xin hỏi phòng thử đồ nằm ở hướng nào?"
  },
  {
    title: "现金",
    pinyin: "xiànjīn",
    meaning: "tiền mặt",
    pos: "danh từ",
    level: 3,
    topicId: "shopping",
    topicName: "Mua Sắm & Thời Trang",
    topicZh: "购物时装",
    topicIcon: "🛍️",
    exampleSentence: "您打算用现金支付还是刷卡？",
    examplePinyin: "Nǐ dǎsuàn yòng xiànjīn zhīfù háishì shuākǎ?",
    exampleMeaning: "Bạn dự định trả bằng tiền mặt hay quẹt thẻ?"
  },
  {
    title: "讨价还价",
    pinyin: "tǎojià huánjià",
    meaning: "mặc cả, trả giá khi mua đồ",
    pos: "thành ngữ / cụm động từ",
    level: 4,
    topicId: "shopping",
    topicName: "Mua Sắm & Thời Trang",
    topicZh: "购物时装",
    topicIcon: "🛍️",
    exampleSentence: "在传统夜市买东西通常可以适度讨价还价。",
    examplePinyin: "Zài chuántǒng yèshì mǎi dōngxi tōngcháng kěyǐ shìdù tǎojià huánjià.",
    exampleMeaning: "Ở chợ đêm truyền thống mua đồ thông thường có thể mặc cả vừa phải."
  },

  // 🌦️ Thời Tiết & Thiên Nhiên (weather)
  {
    title: "预报",
    pinyin: "yùbào",
    meaning: "dự báo (thời tiết)",
    pos: "danh từ / động từ",
    level: 3,
    topicId: "weather",
    topicName: "Thời Tiết & Thiên Nhiên",
    topicZh: "天气自然",
    topicIcon: "🌦️",
    exampleSentence: "天气预报说今天下午有雷阵雨。",
    examplePinyin: "Tiānqì yùbào shuō jīntiān xiàwǔ yǒu léizhènyǔ.",
    exampleMeaning: "Dự báo thời tiết nói chiều nay có mưa rào kèm sấm chớp."
  },
  {
    title: "季节",
    pinyin: "jìjié",
    meaning: "mùa, thời vụ",
    pos: "danh từ",
    level: 3,
    topicId: "weather",
    topicName: "Thời Tiết & Thiên Nhiên",
    topicZh: "天气自然",
    topicIcon: "🌦️",
    exampleSentence: "秋天是北京一年中最宜人的季节。",
    examplePinyin: "Qiūtiān shì Běijīng yī nián zhōng zuì yírén de jìjié.",
    exampleMeaning: "Mùa thu là mùa dễ chịu nhất trong năm ở Bắc Kinh."
  },
  {
    title: "气温",
    pinyin: "qìwēn",
    meaning: "nhiệt độ không khí",
    pos: "danh từ",
    level: 3,
    topicId: "weather",
    topicName: "Thời Tiết & Thiên Nhiên",
    topicZh: "天气自然",
    topicIcon: "🌦️",
    exampleSentence: "今天的最高气温达到了三十五摄氏度。",
    examplePinyin: "Jīntiān de zuìgāo qìwēn dádào le sānshíwǔ shèshìdù.",
    exampleMeaning: "Nhiệt độ cao nhất hôm nay đạt ba mươi lăm độ C."
  },
  {
    title: "彩虹",
    pinyin: "cǎihóng",
    meaning: "cầu vồng",
    pos: "danh từ",
    level: 4,
    topicId: "weather",
    topicName: "Thời Tiết & Thiên Nhiên",
    topicZh: "天气自然",
    topicIcon: "🌦️",
    exampleSentence: "大雨过后，天空中出现了一道美丽的彩虹。",
    examplePinyin: "Dàyǔ guòhòu, tiānkōng zhōng chūxiàn le yī dào měilì de cǎihóng.",
    exampleMeaning: "Sau cơn mưa to, trên bầu trời xuất hiện một dải cầu vồng tuyệt đẹp."
  },

  // 💬 Cảm Xúc & Tâm Lý (emotions)
  {
    title: "兴奋",
    pinyin: "xīngfèn",
    meaning: "phấn khởi, hào hứng",
    pos: "tính từ",
    level: 3,
    topicId: "emotions",
    topicName: "Cảm Xúc & Tâm Lý",
    topicZh: "情感心理",
    topicIcon: "💬",
    exampleSentence: "听到通过HSK考试的消息，大家都很兴奋。",
    examplePinyin: "Tīngdào tōngguò HSK kǎoshì de xiāoxi, dàjiā dōu hěn xīngfèn.",
    exampleMeaning: "Nghe được tin thi đỗ HSK, mọi người đều vô cùng hào hứng phấn khởi."
  },
  {
    title: "感动",
    pinyin: "gǎndòng",
    meaning: "cảm động, xúc động",
    pos: "động từ / tính từ",
    level: 3,
    topicId: "emotions",
    topicName: "Cảm Xúc & Tâm Lý",
    topicZh: "情感心理",
    topicIcon: "💬",
    exampleSentence: "这部电影感人的情节深深打动了所有观众。",
    examplePinyin: "Zhè bù diànyǐng gǎnrén de qíngjié shēnshēn dǎdòng le suǒyǒu guānzhòng.",
    exampleMeaning: "Tình tiết cảm động của bộ phim này đã làm rung động sâu sắc tất cả khán giả."
  },
  {
    title: "害羞",
    pinyin: "hàixiū",
    meaning: "ngại ngùng, xấu hổ, e thẹn",
    pos: "tính từ",
    level: 3,
    topicId: "emotions",
    topicName: "Cảm Xúc & Tâm Lý",
    topicZh: "情感心理",
    topicIcon: "💬",
    exampleSentence: "这个小女孩一见到陌生人就害羞地低下了头。",
    examplePinyin: "Zhège xiǎonǚhái yī jiàndào mòshēngrén jiù hàixiū de dīxià le tóu.",
    exampleMeaning: "Bé gái này hễ gặp người lạ là lại xấu hổ cúi gằm mặt xuống."
  },
  {
    title: "骄傲",
    pinyin: "jiāo'ào",
    meaning: "tự hào (nghĩa tích cực) / kiêu ngạo (tiêu cực)",
    pos: "tính từ",
    level: 3,
    topicId: "emotions",
    topicName: "Cảm Xúc & Tâm Lý",
    topicZh: "情感心理",
    topicIcon: "💬",
    exampleSentence: "父母为孩子取得的优异成绩感到骄傲。",
    examplePinyin: "Fùmǔ wèi háizi qǔdé de yōuyì chéngjì gǎndào jiāo'ào.",
    exampleMeaning: "Bố mẹ cảm thấy rất tự hào về thành tích xuất sắc mà con đã đạt được."
  }
];

let addedCount = 0;
THEMATIC_ADDITIONS.forEach(word => {
  if (!existingTitles.has(word.title)) {
    currentWords.push(word);
    existingTitles.add(word.title);
    addedCount++;
  }
});

console.log(`Added ${addedCount} new thematic words. Total words: ${currentWords.length}`);

// Recalculate topic word counts
const topicsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/topics.json'), 'utf8'));
const topicCountMap = {};
currentWords.forEach(w => {
  topicCountMap[w.topicId] = (topicCountMap[w.topicId] || 0) + 1;
});

const updatedTopics = topicsData.map(t => ({
  ...t,
  count: topicCountMap[t.id] || 0
}));

fs.writeFileSync(dictPath, JSON.stringify(currentWords, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../data/topics.json'), JSON.stringify(updatedTopics, null, 2), 'utf8');

console.log('Updated topics count:', updatedTopics.map(t => `${t.icon} ${t.name}: ${t.count}`));
