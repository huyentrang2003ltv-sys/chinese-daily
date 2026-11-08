// scripts/generate_linguistic_compendium.cjs
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// =========================================================================
// 1. DATASET: 60 CORE CHINESE CLASSIFIERS (HỆ THỐNG LƯỢNG TỪ TIẾNG HÁN)
// =========================================================================
const CLASSIFIERS = [
  // --- NHÓM 1: HÌNH DÁNG (SHAPE) ---
  {
    id: 'clf_zhang',
    char: '张',
    pinyin: 'zhāng',
    hanviet: 'Trương',
    meaning: 'tờ, tấm, chiếc, bức (vật có bề mặt phẳng, mỏng hoặc căng rộng)',
    category: 'shape',
    categoryName: 'Hình Dáng & Bề Mặt',
    applicableObjects: 'Giấy tờ, vé, ảnh, bản đồ, bàn, giường, mặt, miệng, cung tên...',
    collocations: [
      { zh: '一张纸', py: 'yì zhāng zhǐ', vi: 'một tờ giấy' },
      { zh: '一张桌子', py: 'yì zhāng zhuōzi', vi: 'một chiếc bàn' },
      { zh: '一张床', py: 'yì zhāng chuáng', vi: 'một chiếc giường' },
      { zh: '一张照片', py: 'yì zhāng zhàopiàn', vi: 'một bức ảnh' },
      { zh: '一张电影票', py: 'yì zhāng diànyǐng piào', vi: 'một vé xem phim' },
      { zh: '一张嘴', py: 'yì zhāng zuǐ', vi: 'một cái miệng' }
    ],
    example: {
      zh: '他从皮夹里拿出一张珍藏多年的全家福照片。',
      py: 'Tā cóng píjiā lǐ ná chū yì zhāng zhēncáng duō nián de quánjiāfú zhàopiàn.',
      vi: 'Anh ấy lấy từ trong ví ra một bức ảnh gia đình trân quý nhiều năm.'
    },
    tip: '💡 Bẫy HSK: Giường (床) và bàn (桌子) đều có mặt phẳng lớn nên bắt buộc dùng 张, tuyệt đối không dùng 个!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 请给我____白纸写字。',
      options: ['张 (zhāng)', '把 (bǎ)', '条 (tiáo)', '块 (kuài)'],
      answer: 0,
      explain: 'Bạch chỉ (tờ giấy trắng) có bề mặt phẳng mỏng nên dùng lượng từ 张 (zhāng).'
    }
  },
  {
    id: 'clf_tiao',
    char: '条',
    pinyin: 'tiáo',
    hanviet: 'Điều',
    meaning: 'sợi, con, cái, dải, điều (vật thon dài, mềm mại, uốn lượn)',
    category: 'shape',
    categoryName: 'Hình Dáng & Bề Mặt',
    applicableObjects: 'Đường xá, sông ngòi, cá, rắn, quần, váy, khăn quàng, tin nhắn, điều luật...',
    collocations: [
      { zh: '一条路', py: 'yì tiáo lù', vi: 'một con đường' },
      { zh: '一条河', py: 'yì tiáo hé', vi: 'một con sông' },
      { zh: '一条鱼', py: 'yì tiáo yú', vi: 'một con cá' },
      { zh: '一条裤子', py: 'yì tiáo kùzi', vi: 'một chiếc quần' },
      { zh: '一条围巾', py: 'yì tiáo wéijīn', vi: 'một chiếc khăn quàng' },
      { zh: '一条微信', py: 'yì tiáo wēixìn', vi: 'một tin nhắn WeChat' }
    ],
    example: {
      zh: '门前这条清澈的小河一直流向远方的大海。',
      py: 'Ménqián zhè tiáo qīngchè de xiǎohé yìzhí liú wàng yuǎnfāng de dàhǎi.',
      vi: 'Con sông nhỏ trong vắt trước cửa này chảy mãi về phía biển lớn xa xôi.'
    },
    tip: '💡 Bẫy HSK: Quần (裤子), váy (裙子) và tin nhắn (短信/微信) đều dùng lượng từ 条!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 她今天穿了____非常优雅的长裙。',
      options: ['条 (tiáo)', '件 (jiàn)', '张 (zhāng)', '个 (gè)'],
      answer: 0,
      explain: 'Váy dài (长裙) có dáng thon dài buông rủ nên dùng lượng từ 条 (tiáo).'
    }
  },
  {
    id: 'clf_gen',
    char: '根',
    pinyin: 'gēn',
    hanviet: 'Căn',
    meaning: 'cây, que, cọng, sợi (vật thon dài, có độ cứng hoặc mảnh mai)',
    category: 'shape',
    categoryName: 'Hình Dáng & Bề Mặt',
    applicableObjects: 'Kim khâu, que củi, sợi tóc, ngọn cỏ, chuối, dây thừng, xương, xúc xích...',
    collocations: [
      { zh: '一根针', py: 'yì gēn zhēn', vi: 'một cây kim' },
      { zh: '一根头发', py: 'yì gēn tóufa', vi: 'một sợi tóc' },
      { zh: '一根香蕉', py: 'yì gēn xiāngjiāo', vi: 'một quả chuối' },
      { zh: '一根火柴', py: 'yì gēn huǒchái', vi: 'một que diêm' },
      { zh: '一根绳子', py: 'yì gēn shéngzi', vi: 'một sợi dây thừng' },
      { zh: '一根骨头', py: 'yì gēn gǔtou', vi: 'một khúc xương' }
    ],
    example: {
      zh: '在宽阔的大海里寻找一枚小小的绣花针，比大海捞针还要困难。',
      py: 'Zài kuānkuò de dàhǎi lǐ xúnzhǎo yì méi xiǎoxiǎo de xiùhuāzhēn, bǐ dàhǎi lāo zhēn hái yào kùnnan.',
      vi: 'Tìm một cây kim thêu bé xíu trong biển rộng còn khó hơn mò kim đáy bể.'
    },
    tip: '💡 Phân biệt: 条 dùng cho vật dài mềm uốn lượn; 根 dùng cho vật dài có gốc rễ, thanh que hoặc sợi mảnh.',
    quiz: {
      question: 'Điền lượng từ thích hợp: 猴子手里拿着____香蕉吃得正香。',
      options: ['根 (gēn)', '只 (zhī)', '张 (zhāng)', '把 (bǎ)'],
      answer: 0,
      explain: 'Quả chuối đơn lẻ có hình que cong thon dùng lượng từ 根 (gēn).'
    }
  },
  {
    id: 'clf_kuai',
    char: '块',
    pinyin: 'kuài',
    hanviet: 'Khối',
    meaning: 'miếng, cục, hòn, tảng, khối, đồng (tiền)',
    category: 'shape',
    categoryName: 'Hình Dáng & Bề Mặt',
    applicableObjects: 'Bánh ngọt, xà phòng, đá, thịt, đồng hồ đeo tay, đồng tệ (tiền khẩu ngữ)...',
    collocations: [
      { zh: '一块蛋糕', py: 'yí kuài dàngāo', vi: 'một miếng bánh kem' },
      { zh: '一块手表', py: 'yí kuài shǒubiǎo', vi: 'một chiếc đồng hồ đeo tay' },
      { zh: '一块西瓜', py: 'yí kuài xīguā', vi: 'một miếng dưa hấu' },
      { zh: '一块肥皂', py: 'yí kuài féizào', vi: 'một bánh xà phòng' },
      { zh: '一块石头', py: 'yí kuài shítou', vi: 'một hòn đá' },
      { zh: '十块钱', py: 'shí kuài qián', vi: 'mười đồng tệ' }
    ],
    example: {
      zh: '生日聚会上，寿星切下一块美味的巧克力蛋糕递给我。',
      py: 'Shēngrì jùhuì shang, shòuxīng qiē xià yí kuài měiwèi de qiǎokèlì dàngāo dì gěi wǒ.',
      vi: 'Trong bữa tiệc sinh nhật, nhân vật chính cắt một miếng bánh kem sô-cô-la thơm ngon đưa cho tôi.'
    },
    tip: '💡 Bẫy HSK: Đồng hồ đeo tay (手表) dùng lượng từ 块 (bề mặt khối nhỏ trên cổ tay)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 这盒瑞士手工巧克力里有十二____。',
      options: ['块 (kuài)', '本 (běn)', '支 (zhī)', '张 (zhāng)'],
      answer: 0,
      explain: 'Từng miếng sô-cô-la dùng lượng từ 块 (kuài).'
    }
  },
  {
    id: 'clf_ke_grain',
    char: '颗',
    pinyin: 'kē',
    hanviet: 'Khoa',
    meaning: 'viên, hạt, ngôi (sao), quả (vật thể hình tròn hoặc nhỏ bé như hạt)',
    category: 'shape',
    categoryName: 'Hình Dáng & Bề Mặt',
    applicableObjects: 'Ngôi sao, trái tim, viên thuốc, hạt dưa, viên ngọc, răng, bom đạn...',
    collocations: [
      { zh: '一颗星星', py: 'yì kē xīngxing', vi: 'một ngôi sao' },
      { zh: '一颗心', py: 'yì kē xīn', vi: 'một trái tim' },
      { zh: '一颗珍珠', py: 'yì kē zhēnzhū', vi: 'một viên ngọc trai' },
      { zh: '一颗牙齿', py: 'yì kē yáchǐ', vi: 'một chiếc răng' },
      { zh: '一颗子弹', py: 'yì kē zǐdàn', vi: 'một viên đạn' },
      { zh: '一颗糖果', py: 'yì kē tángguǒ', vi: 'một viên kẹo' }
    ],
    example: {
      zh: '晴朗的夜空中有无数颗闪烁的小星星。',
      py: 'Qínglǎng de yèkōng zhōng yǒu wúshù kē shǎnshuò de xiǎo xīngxing.',
      vi: 'Trên bầu trời đêm quang đãng có vô số ngôi sao nhỏ lấp lánh.'
    },
    tip: '💡 Phân biệt: 颗 (kē - bộ Thạch/Hiệt: viên/hạt) khác với 棵 (kē - bộ Mộc: cây cối)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 天空中最亮的那____星星是指南针。',
      options: ['颗 (kē)', '棵 (kē)', '张 (zhāng)', '个 (gè)'],
      answer: 0,
      explain: 'Sao trời (星星) là vật thể hạt cầu sáng nên dùng 颗 (kē).'
    }
  },

  // --- NHÓM 2: ĐỒ DÙNG & CÔNG CỤ (ITEMS & TOOLS) ---
  {
    id: 'clf_ba',
    char: '把',
    pinyin: 'bǎ',
    hanviet: 'Bả',
    meaning: 'chiếc, cây, cái (vật dụng có cán cầm hoặc nắm được trong tay)',
    category: 'items',
    categoryName: 'Đồ Dùng & Vật Dụng',
    applicableObjects: 'Ô dù, quạt, dao, kéo, ghế ngồi, chìa khóa, súng, lược, ấm trà, nắm gạo...',
    collocations: [
      { zh: '一把雨伞', py: 'yì bǎ yǔsǎn', vi: 'một chiếc ô' },
      { zh: '一把椅子', py: 'yì bǎ yǐzi', vi: 'một chiếc ghế' },
      { zh: '一把剪刀', py: 'yì bǎ jiǎndāo', vi: 'một cái kéo' },
      { zh: '一把钥匙', py: 'yì bǎ yàoshi', vi: 'một chiếc chìa khóa' },
      { zh: '一把扇子', py: 'yì bǎ shànzi', vi: 'một chiếc quạt' },
      { zh: '一把年纪', py: 'yì bǎ niánjì', vi: 'tuổi tác đã cao' }
    ],
    example: {
      zh: '外面正在下倾盆大雨，出门别忘了拿上一把雨伞。',
      py: 'Wàimiàn zhèngzài xià qīngpén dàyǔ, chūmén bié wàng le ná shàng yì bǎ yǔsǎn.',
      vi: 'Bên ngoài đang mưa tầm tã, ra ngoài chớ quên cầm theo chiếc ô.'
    },
    tip: '💡 Bẫy HSK kinh điển: Ghế (椅子) có chỗ tựa/tay vịn nên dùng 把, còn bàn (桌子) mặt phẳng nên dùng 张!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 请大家各就各位，在自己的____椅子上坐好。',
      options: ['把 (bǎ)', '张 (zhāng)', '条 (tiáo)', '部 (bù)'],
      answer: 0,
      explain: 'Ghế ngồi (椅子) dùng lượng từ 把 (bǎ).'
    }
  },
  {
    id: 'clf_ben',
    char: '本',
    pinyin: 'běn',
    hanviet: 'Bổn',
    meaning: 'quyển, cuốn, tập (sách vở đóng thành tập)',
    category: 'items',
    categoryName: 'Đồ Dùng & Vật Dụng',
    applicableObjects: 'Sách, từ điển, tạp chí, sổ tay, tiểu thuyết, hộ chiếu, album ảnh...',
    collocations: [
      { zh: '一本书', py: 'yì běn shū', vi: 'một quyển sách' },
      { zh: '一本词典', py: 'yì běn cídiǎn', vi: 'một cuốn từ điển' },
      { zh: '一本杂志', py: 'yì běn zázhì', vi: 'một cuốn tạp chí' },
      { zh: '一本护照', py: 'yì běn hùzhào', vi: 'một cuốn hộ chiếu' },
      { zh: '一本相册', py: 'yì běn xiàngcè', vi: 'một tập album ảnh' },
      { zh: '一本笔记本', py: 'yì běn bǐjìběn', vi: 'một cuốn sổ tay' }
    ],
    example: {
      zh: '图书馆里珍藏着许多具有很高学术价值的历史古籍善本。',
      py: 'Túshūguǎn lǐ zhēncáng zhe xǔduō jùyǒu hěn gāo xuéshù jiàzhí de lìshǐ gǔjí shànběn.',
      vi: 'Trong thư viện trân tàng rất nhiều cuốn sách cổ quý hiếm có giá trị học thuật cao.'
    },
    tip: '💡 Lưu ý: Hộ chiếu (护照) được đóng thành cuốn nhỏ nên cũng dùng lượng từ 本!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 这____新汉英词典解释非常详尽实用。',
      options: ['本 (běn)', '张 (zhāng)', '件 (jiàn)', '只 (zhī)'],
      answer: 0,
      explain: 'Từ điển (词典) đóng thành quyển nên dùng 本 (běn).'
    }
  },
  {
    id: 'clf_zhi_pen',
    char: '支',
    pinyin: 'zhī',
    hanviet: 'Chi',
    meaning: 'cây, chiếc, bài (vật hình que thẳng; bài hát; đội ngũ)',
    category: 'items',
    categoryName: 'Đồ Dùng & Vật Dụng',
    applicableObjects: 'Bút viết, hoa tươi có cành, bài hát, đội bóng, đoàn quân, súng ống...',
    collocations: [
      { zh: '一支笔', py: 'yì zhī bǐ', vi: 'một cây bút' },
      { zh: '一支毛笔', py: 'yì zhī máobǐ', vi: 'một cây bút lông' },
      { zh: '一支歌', py: 'yì zhī gē', vi: 'một bài hát' },
      { zh: '一支球队', py: 'yì zhī qiúduì', vi: 'một đội bóng' },
      { zh: '一支蜡烛', py: 'yì zhī làzhú', vi: 'một cây nến' },
      { zh: '一支枪', py: 'yì zhī qiāng', vi: 'một khẩu súng' }
    ],
    example: {
      zh: '他拿起一支精美的毛笔，在宣纸上行云流水般写下了四个大字。',
      py: 'Tā ná qǐ yì zhī jīngměi de máobǐ, zài xuānzhǐ shang xíngyúnliúshuǐ bān xiě xià le sì gè dà zì.',
      vi: 'Anh ấy cầm cây bút lông tinh xảo, viết bốn chữ lớn trên giấy xuyến mềm mại như mây bay nước chảy.'
    },
    tip: '💡 Phân biệt: 支 (zhī: cây bút, bài hát) khác với 只 (zhī: con vật, chiếc giày lẻ)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 老师用一____红笔仔细批改学生的作业。',
      options: ['支 (zhī)', '只 (zhī)', '张 (zhāng)', '条 (tiáo)'],
      answer: 0,
      explain: 'Bút viết (笔) dùng lượng từ 支 (zhī).'
    }
  },
  {
    id: 'clf_jian',
    char: '件',
    pinyin: 'jiàn',
    hanviet: 'Kiện',
    meaning: 'chiếc, cái, vụ, điều (áo, hành lý, sự việc, tác phẩm)',
    category: 'items',
    categoryName: 'Đồ Dùng & Vật Dụng',
    applicableObjects: 'Áo (thượng y), áo khoác, áo len, hành lý, sự việc, lễ vật, tác phẩm nghệ thuật...',
    collocations: [
      { zh: '一件衣服', py: 'yí jiàn yīfu', vi: 'một chiếc áo' },
      { zh: '一件事', py: 'yí jiàn shì', vi: 'một sự việc' },
      { zh: '一件行李', py: 'yí jiàn xíngli', vi: 'một kiện hành lý' },
      { zh: '一件礼物', py: 'yí jiàn lǐwù', vi: 'một món quà' },
      { zh: '一件衬衫', py: 'yí jiàn chènshān', vi: 'một chiếc áo sơ mi' },
      { zh: '一件毛衣', py: 'yí jiàn máoyī', vi: 'một chiếc áo len' }
    ],
    example: {
      zh: '今天在公司里发生了一件令人难以置信的离奇事情。',
      py: 'Jīntiān zài gōngsī lǐ fāshēng le yí jiàn lìngrén nányǐzhìxìn de líqí shìqing.',
      vi: 'Hôm nay ở công ty đã xảy ra một sự việc kỳ lạ đến mức khó tin.'
    },
    tip: '💡 Bẫy HSK: Áo (trên) dùng 件 (jiàn), nhưng quần (dưới) thon dài bắt buộc dùng 条 (tiáo)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 妈妈送给我一____温暖的手工羊毛衫。',
      options: ['件 (jiàn)', '条 (tiáo)', '张 (zhāng)', '块 (kuài)'],
      answer: 0,
      explain: 'Áo len (羊毛衫) dùng lượng từ 件 (jiàn).'
    }
  },
  {
    id: 'clf_feng',
    char: '封',
    pinyin: 'fēng',
    hanviet: 'Phong',
    meaning: 'bức, lá, phong (thư tín có niêm phong)',
    category: 'items',
    categoryName: 'Đồ Dùng & Vật Dụng',
    applicableObjects: 'Thư từ, điện tín, email (thư điện tử), phong bì niêm phong...',
    collocations: [
      { zh: '一封信', py: 'yì fēng xìn', vi: 'một bức thư' },
      { zh: '一封电子邮件', py: 'yì fēng diànzǐ yóujiàn', vi: 'một bức email' },
      { zh: '一封感谢信', py: 'yì fēng gǎnxiè xìn', vi: 'một bức thư cảm ơn' },
      { zh: '一封推荐信', py: 'yì fēng tuījiàn xìn', vi: 'một thư giới thiệu' }
    ],
    example: {
      zh: '远在海外求学的游子每个月都会给父母写一封长长的家书。',
      py: 'Yuǎn zài hǎiwài qiúxué de yóuzǐ měi gè yuè dōu huì gěi fùmǔ xiě yì fēng chángcháng de jiāshū.',
      vi: 'Đứa con phương xa du học mỗi tháng đều viết một bức thư nhà dài gửi cha mẹ.'
    },
    tip: '💡 Bẫy HSK: Cả thư tay truyền thống (信) lẫn thư điện tử (电子邮件) đều dùng lượng từ 封!',
    quiz: {
      question: 'Điền lượng từ thích hợp: HR vừa gửi cho ứng viên một____面试通知邮件。',
      options: ['封 (fēng)', '张 (zhāng)', '条 (tiáo)', '本 (běn)'],
      answer: 0,
      explain: 'Thư từ email dùng lượng từ 封 (fēng).'
    }
  },

  // --- NHÓM 3: ĐỘNG THỰC VẬT & SINH VẬT (LIVING BEINGS) ---
  {
    id: 'clf_zhi_animal',
    char: '只',
    pinyin: 'zhī',
    hanviet: 'Chích',
    meaning: 'con (động vật nhỏ, chim muông); chiếc (vật có đôi nhưng đứng lẻ)',
    category: 'living',
    categoryName: 'Động Thực Vật & Sinh Vật',
    applicableObjects: 'Chó, mèo, gà, vịt, chim, thỏ, hổ; một chiếc giày, một chiếc tất, một bàn tay...',
    collocations: [
      { zh: '一只猫', py: 'yì zhī māo', vi: 'một con mèo' },
      { zh: '一只鸟', py: 'yì zhī niǎo', vi: 'một con chim' },
      { zh: '一只狗', py: 'yì zhī gǒu', vi: 'một con chó' },
      { zh: '一只手', py: 'yì zhī shǒu', vi: 'một bàn tay' },
      { zh: '一只鞋', py: 'yì zhī xié', vi: 'một chiếc giày (lẻ)' },
      { zh: '一只眼睛', py: 'yì zhī yǎnjīng', vi: 'một con mắt' }
    ],
    example: {
      zh: '公园草地上有一只欢快奔跑的小花猫。',
      py: 'Gōngyuán cǎodì shang yǒu yì zhī huānkuài bēnpǎo de xiǎo huāmāo.',
      vi: 'Trên bãi cỏ công viên có một chú mèo hoa nhỏ đang vui vẻ chạy nhảy.'
    },
    tip: '💡 Bẫy HSK: Giày, tất, tay, mắt vốn đi theo cặp (双), khi nói một bên đứng riêng lẻ dùng 只!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 树枝上停着一____羽毛鲜艳的彩色鹦鹉。',
      options: ['只 (zhī)', '支 (zhī)', '头 (tóu)', '张 (zhāng)'],
      answer: 0,
      explain: 'Chim muông (鹦鹉) dùng lượng từ động vật 只 (zhī).'
    }
  },
  {
    id: 'clf_tou',
    char: '头',
    pinyin: 'tóu',
    hanviet: 'Đầu',
    meaning: 'con, đầu (gia súc lớn, thú to)',
    category: 'living',
    categoryName: 'Động Thực Vật & Sinh Vật',
    applicableObjects: 'Bò, trâu, voi, lợn, sư tử, cá voi, tỏi (củ tỏi)...',
    collocations: [
      { zh: '一头牛', py: 'yì tóu niú', vi: 'một con bò' },
      { zh: '一头大象', py: 'yì tóu dàxiàng', vi: 'một con voi' },
      { zh: '一头猪', py: 'yì tóu zhū', vi: 'một con lợn' },
      { zh: '一头狮子', py: 'yì tóu shīzi', vi: 'một con sư tử' },
      { zh: '一头大蒜', py: 'yì tóu dàsuàn', vi: 'một củ tỏi' }
    ],
    example: {
      zh: '在非洲大草原上，一头雄壮的成年公象正在悠闲漫步。',
      py: 'Zài Fēizhōu dà cǎoyuán shang, yì tóu xióngzhuàng de chéngnián gōngxiàng zhèngzài yōuxián mànbù.',
      vi: 'Trên thảo nguyên châu Phi rộng lớn, một chú voi đực trưởng thành vạm vỡ đang thong thả dạo bước.'
    },
    tip: '💡 Động vật lớn (bò, voi, trâu, lợn) dùng 头; Riêng ngựa dùng 匹 (pǐ); Chó/mèo/chim dùng 只 (zhī).',
    quiz: {
      question: 'Điền lượng từ thích hợp: 农夫在田地里赶着一____老黄牛耕地。',
      options: ['头 (tóu)', '只 (zhī)', '匹 (pǐ)', '条 (tiáo)'],
      answer: 0,
      explain: 'Trâu bò lớn dùng lượng từ 头 (tóu).'
    }
  },
  {
    id: 'clf_pi',
    char: '匹',
    pinyin: 'pǐ',
    hanviet: 'Thất',
    meaning: 'con (ngựa, la, lừa); cây (vải lụa)',
    category: 'living',
    categoryName: 'Động Thực Vật & Sinh Vật',
    applicableObjects: 'Ngựa, lừa, la; cây vải, xấp vải lụa...',
    collocations: [
      { zh: '一匹马', py: 'yì pǐ mǎ', vi: 'một con ngựa' },
      { zh: '一匹白马', py: 'yì pǐ báimǎ', vi: 'một con bạch mã' },
      { zh: '一匹黑马', py: 'yì pǐ hēimǎ', vi: 'ngựa ô (nghĩa bóng: nhân tố bất ngờ)' },
      { zh: '一匹布', py: 'yì pǐ bù', vi: 'một cây vải' }
    ],
    example: {
      zh: '蒙古骑士骑着一匹训练有素的骏马在辽阔草原上飞驰。',
      py: 'Měnggǔ qíshì qí zhe yì pǐ xùnliàn-yǒusù de jùnmǎ zài liáokuò cǎoyuán shang fēichí.',
      vi: 'Kỵ sĩ Mông Cổ cưỡi một con tuấn mã huấn luyện thuần thục phóng nhanh trên thảo nguyên bao la.'
    },
    tip: '💡 Thuật ngữ HSK: 黑马 (Hēimǎ - Ngựa ô) chỉ nhân tố bí ẩn bất ngờ đoạt giải quán quân!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 草原英雄骑着一____千里马日行千里。',
      options: ['匹 (pǐ)', '头 (tóu)', '只 (zhī)', '条 (tiáo)'],
      answer: 0,
      explain: 'Ngựa (马) bắt buộc dùng lượng từ 匹 (pǐ).'
    }
  },
  {
    id: 'clf_ke_plant',
    char: '棵',
    pinyin: 'kē',
    hanviet: 'Khỏa',
    meaning: 'cây, ngọn, cây cối (thực vật có thân, gốc rễ)',
    category: 'living',
    categoryName: 'Động Thực Vật & Sinh Vật',
    applicableObjects: 'Cây cối, rau cải, cỏ, hoa (cây hoa), lúa mạ...',
    collocations: [
      { zh: '一棵树', py: 'yì kē shù', vi: 'một cái cây' },
      { zh: '一棵大树', py: 'yì kē dàshù', vi: 'một cây đại thụ' },
      { zh: '一棵白菜', py: 'yì kē báicài', vi: 'một cây cải thảo' },
      { zh: '一棵小草', py: 'yì kē xiǎocǎo', vi: 'một ngọn cỏ nhỏ' },
      { zh: '一棵松树', py: 'yì kē sōngshù', vi: 'một cây thông' }
    ],
    example: {
      zh: '爷爷在院子里亲手栽种了一棵象征长寿长青的银杏树。',
      py: 'Yéye zài yuànzi lǐ qīnshǒu zāizhòng le yì kē xiàngzhēng chángshòu chángqīng de yínxìngshù.',
      vi: 'Ông nội tự tay trồng một cây ngân hạnh tượng trưng cho trường thọ trong sân vườn.'
    },
    tip: '💡 Phân biệt: 棵 (kē) có bộ Mộc (木) dùng cho cây cối; 颗 (kē) có bộ Hiệt dùng cho hạt/viên nhỏ!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 学校操场边有一____几百年历史的古槐树。',
      options: ['棵 (kē)', '颗 (kē)', '张 (zhāng)', '把 (bǎ)'],
      answer: 0,
      explain: 'Cây cối thực vật có gốc (槐树) dùng 棵 (kē).'
    }
  },
  {
    id: 'clf_duo',
    char: '朵',
    pinyin: 'duǒ',
    hanviet: 'Đóa',
    meaning: 'bông, đóa, đám (hoa tươi, đám mây)',
    category: 'living',
    categoryName: 'Động Thực Vật & Sinh Vật',
    applicableObjects: 'Bông hoa, đám mây, bọt sóng, vành tai (tai người)...',
    collocations: [
      { zh: '一朵花', py: 'yì duǒ huā', vi: 'một bông hoa' },
      { zh: '一朵红玫瑰', py: 'yì duǒ hóng méigui', vi: 'một bông hồng đỏ' },
      { zh: '一朵白云', py: 'yì duǒ báiyún', vi: 'một đám mây trắng' },
      { zh: '一朵浪花', py: 'yì duǒ lànghuā', vi: 'một đóa hoa sóng' }
    ],
    example: {
      zh: '蔚蓝色的天空中飘浮着几朵形状各异的洁白棉花云。',
      py: 'Wèilánsè de tiānkōng zhōng piāofú zhe jǐ duǒ xíngzhuàng gèyì de jiébái miánhuayún.',
      vi: 'Trên bầu trời xanh biếc lơ lửng mấy đám mây bông trắng muốt với muôn hình vạn trạng.'
    },
    tip: '💡 Bẫy HSK: Cả bông hoa (花) lẫn đám mây (云) đều dùng chung lượng từ 朵 (duǒ)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 他摘下一____鲜艳的百合花送给恋人。',
      options: ['朵 (duǒ)', '棵 (kē)', '把 (bǎ)', '条 (tiáo)'],
      answer: 0,
      explain: 'Bông hoa (百合花) dùng lượng từ 朵 (duǒ).'
    }
  },

  // --- NHÓM 4: PHƯƠNG TIỆN & KIẾN TRÚC (VEHICLES & BUILDINGS) ---
  {
    id: 'clf_liang',
    char: '辆',
    pinyin: 'liàng',
    hanviet: 'Lượng',
    meaning: 'chiếc, chiếc xe (phương tiện đường bộ có bánh xe)',
    category: 'vehicles_buildings',
    categoryName: 'Phương Tiện & Kiến Trúc',
    applicableObjects: 'Ô tô, xe đạp, xe máy, xe buýt, xe taxi, xe tải, xe đẩy...',
    collocations: [
      { zh: '一辆车', py: 'yí liàng chē', vi: 'một chiếc xe' },
      { zh: '一辆自行车', py: 'yí liàng zìxíngchē', vi: 'một chiếc xe đạp' },
      { zh: '一辆出租车', py: 'yí liàng chūzūchē', vi: 'một chiếc xe taxi' },
      { zh: '一辆公交车', py: 'yí liàng gōngjiāochē', vi: 'một chiếc xe buýt' },
      { zh: '一辆摩托车', py: 'yí liàng mótuōchē', vi: 'một chiếc xe máy' }
    ],
    example: {
      zh: '公司为新入职的优秀员工配备了一辆新能源电动汽车。',
      py: 'Gōngsī wèi xīn rùzhí de yōuxiù yuángōng pèibèi le yí liàng xīnnéngyuán diàndòng qìchē.',
      vi: 'Công ty đã trang bị một chiếc ô tô điện năng lượng mới cho nhân viên xuất sắc mới vào làm.'
    },
    tip: '💡 Lưu ý: Xe có bánh dùng 辆 (liàng); Máy bay dùng 架 (jià); Tàu thuyền dùng 艘 (sōu); Tàu hỏa dùng 列 (liè)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 门口停着一____崭新的红色跑车。',
      options: ['辆 (liàng)', '艘 (sōu)', '架 (jià)', '座 (zuò)'],
      answer: 0,
      explain: 'Xe thể thao ô tô (跑车) dùng lượng từ 辆 (liàng).'
    }
  },
  {
    id: 'clf_sou',
    char: '艘',
    pinyin: 'sōu',
    hanviet: 'Sưu',
    meaning: 'chiếc, con tàu (tàu thuyền đường thủy lớn nhỏ)',
    category: 'vehicles_buildings',
    categoryName: 'Phương Tiện & Kiến Trúc',
    applicableObjects: 'Tàu thủy, thuyền buồm, du thuyền, tàu ngầm, tàu chiến, sà lan...',
    collocations: [
      { zh: '一艘船', py: 'yì sōu chuán', vi: 'một con tàu' },
      { zh: '一艘军舰', py: 'yì sōu jūnjiàn', vi: 'một chiếc tàu chiến' },
      { zh: '一艘游轮', py: 'yì sōu yóulún', vi: 'một chiếc du thuyền' },
      { zh: '一艘潜艇', py: 'yì sōu qiántǐng', vi: 'một chiếc tàu ngầm' }
    ],
    example: {
      zh: '一艘万吨级大型远洋货轮正缓缓驶离繁忙的集装箱港口。',
      py: 'Yì sōu wàndùn jí dàxíng yuǎnyáng huòlún zhèng huǎnhuǎn shǐlí fánmáng de jízhuāngxiāng gǎngkǒu.',
      vi: 'Một con tàu chở hàng viễn dương vạn tấn đang từ từ rời khỏi bến cảng container nhộn nhịp.'
    },
    tip: '💡 Tàu thuyền chuẩn dùng 艘 (sōu), thuyền nhỏ dân gian có thể dùng 条 (tiáo: 一条小船).',
    quiz: {
      question: 'Điền lượng từ thích hợp: 港湾里停泊着数十____现代化豪华游轮。',
      options: ['艘 (sōu)', '辆 (liàng)', '架 (jià)', '座 (zuò)'],
      answer: 0,
      explain: 'Du thuyền lớn (游轮) dùng lượng từ 艘 (sōu).'
    }
  },
  {
    id: 'clf_jia',
    char: '架',
    pinyin: 'jià',
    hanviet: 'Giá',
    meaning: 'chiếc, cỗ (máy móc có giàn khung: máy bay, đàn piano, máy ảnh)',
    category: 'vehicles_buildings',
    categoryName: 'Phương Tiện & Kiến Trúc',
    applicableObjects: 'Máy bay, trực thăng, đàn piano, kính thiên văn, máy ảnh...',
    collocations: [
      { zh: '一架飞机', py: 'yí jià fēijī', vi: 'một chiếc máy bay' },
      { zh: '一架钢琴', py: 'yí jià gāngqín', vi: 'một cây đàn piano' },
      { zh: '一架直升机', py: 'yí jià zhíshēngjī', vi: 'một chiếc trực thăng' },
      { zh: '一架望远镜', py: 'yí jià wàngyuǎnjìng', vi: 'một chiếc kính viễn vọng' }
    ],
    example: {
      zh: '随着巨大的轰鸣声，一架波音客机平稳降落在国际机场跑道上。',
      py: 'Suízhe jùdà de hōngmíngshēng, yí jià bōyīn kèjī píngwěn jiàngluò zài guójì jīchǎng pǎodào shang.',
      vi: 'Cùng với tiếng gầm rú vang trời, một chiếc máy bay chở khách Boeing đã hạ cánh êm thuận xuống đường băng sân bay quốc tế.'
    },
    tip: '💡 Bẫy HSK: Đàn piano (钢琴) có khung giàn phức tạp nên dùng lượng từ 架 (jià)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 大厅正中央摆放着一____昂贵的德国斯坦威三角钢琴。',
      options: ['架 (jià)', '辆 (liàng)', '把 (bǎ)', '块 (kuài)'],
      answer: 0,
      explain: 'Đàn đại dương cầm (钢琴) dùng lượng từ 架 (jià).'
    }
  },
  {
    id: 'clf_zuo',
    char: '座',
    pinyin: 'zuò',
    hanviet: 'Tọa',
    meaning: 'ngọn, tòa, cây (vật thể kiến trúc to lớn, cố định vững chãi)',
    category: 'vehicles_buildings',
    categoryName: 'Phương Tiện & Kiến Trúc',
    applicableObjects: 'Ngọn núi, cây cầu, tòa nhà cao tầng, thành phố, tượng đài, hải đăng...',
    collocations: [
      { zh: '一座山', py: 'yí zuò shān', vi: 'một ngọn núi' },
      { zh: '一座桥', py: 'yí zuò qiáo', vi: 'một cây cầu' },
      { zh: '一座大楼', py: 'yí zuò dàlóu', vi: 'một tòa nhà lớn' },
      { zh: '一座城市', py: 'yí zuò chéngshì', vi: 'một thành phố' },
      { zh: '一座庙', py: 'yí zuò miào', vi: 'một ngôi miếu / ngôi chùa' },
      { zh: '一座雕塑', py: 'yí zuò diāosù', vi: 'một bức tượng điêu khắc' }
    ],
    example: {
      zh: '跨海大桥像一条巨龙横卧在海面上，连接着两座经济繁荣的海滨城市。',
      py: 'Kuàhǎi dàqiáo xiàng yì tiáo jùlóng héngwò zài hǎimiàn shang, liánjiē zhe liǎng zuò jīngjì fánróng de hǎibīn chéngshì.',
      vi: 'Cây cầu vượt biển tựa như con rồng lớn vắt ngang mặt biển, nối liền hai thành phố ven biển trù phú phát triển.'
    },
    tip: '💡 Bẫy HSK: Núi (山), Cầu (桥), Thành phố (城市) đều dùng lượng từ 座 (zuò)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 远处高耸入云的是一____常年积雪的雪山。',
      options: ['座 (zuò)', '个 (gè)', '棵 (kē)', '条 (tiáo)'],
      answer: 0,
      explain: 'Ngọn núi hùng vĩ (雪山) dùng lượng từ 座 (zuò).'
    }
  },

  // --- NHÓM 5: TẬP HỢP & ĐO LƯỜNG (SETS & MEASURES) ---
  {
    id: 'clf_shuang',
    char: '双',
    pinyin: 'shuāng',
    hanviet: 'Song',
    meaning: 'đôi (hai vật đi liền nhau không thể tách rời: giày, đũa, mắt)',
    category: 'sets_measures',
    categoryName: 'Tập Hợp & Đo Lường',
    applicableObjects: 'Giày dép, đũa ăn cơm, bít tất, găng tay, bàn tay, đôi mắt...',
    collocations: [
      { zh: '一双鞋', py: 'yì shuāng xié', vi: 'một đôi giày' },
      { zh: '一双筷子', py: 'yì shuāng kuàizi', vi: 'một đôi đũa' },
      { zh: '一双袜子', py: 'yì shuāng wàzi', vi: 'một đôi tất' },
      { zh: '一双手套', py: 'yì shuāng shǒutào', vi: 'một đôi găng tay' },
      { zh: '一双眼睛', py: 'yì shuāng yǎnjing', vi: 'một đôi mắt' }
    ],
    example: {
      zh: '吃中餐最基本的餐具就是一双竹筷子。',
      py: 'Chī zhōngcān zuì jīběn de cānjù jiùshì yì shuāng zhú kuàizi.',
      vi: 'Dụng cụ ăn uống cơ bản nhất khi ăn đồ Trung là một đôi đũa tre.'
    },
    tip: '💡 Phân biệt: 双 (shuāng: đôi tự nhiên có cặp như giày, đũa, mắt); 对 (duì: cặp uyên ương, đôi vợ chồng, cặp bình hoa đối xứng).',
    quiz: {
      question: 'Điền lượng từ thích hợp: 服务员，请再给我拿一____干净的木筷子。',
      options: ['双 (shuāng)', '把 (bǎ)', '根 (gēn)', '张 (zhāng)'],
      answer: 0,
      explain: 'Đôi đũa đi kèm thành đôi dùng lượng từ 双 (shuāng).'
    }
  },
  {
    id: 'clf_tao',
    char: '套',
    pinyin: 'tào',
    hanviet: 'Sáo',
    meaning: 'bộ, căn (tập hợp hoàn chỉnh gồm nhiều món hoặc căn hộ)',
    category: 'sets_measures',
    categoryName: 'Tập Hợp & Đo Lường',
    applicableObjects: 'Quần áo comple, sách tuyển tập, căn hộ chung cư, bộ ấm chén, bộ quy tắc...',
    collocations: [
      { zh: '一套西装', py: 'yí tào xīzhuāng', vi: 'một bộ âu phục' },
      { zh: '一套房子', py: 'yí tào fángzi', vi: 'một căn nhà/căn hộ' },
      { zh: '一套茶具', py: 'yí tào chájù', vi: 'một bộ ấm trà' },
      { zh: '一套书', py: 'yí tào shū', vi: 'một bộ sách' },
      { zh: '一套方案', py: 'yí tào fāng\'àn', vi: 'một bộ phương án' }
    ],
    example: {
      zh: '年轻夫妇经过多年努力拼搏，终于在城市中心买下了一套三居室的新房子。',
      py: 'Niánqīng fūfù jīngguò duō nián nǔlì pīnbó, zhōngyú zài chéngshì zhōngxīn mǎi xià le yí tào sān-jūshì de xīn fángzi.',
      vi: 'Đôi vợ chồng trẻ sau nhiều năm phấn đấu nỗ lực, cuối cùng đã mua được một căn hộ 3 phòng ngủ mới ngay trung tâm thành phố.'
    },
    tip: '💡 Bẫy HSK: Căn hộ nhà ở (房子) dùng 套 (tào), còn tòa nhà cao tầng dùng 座 (zuò) hoặc 栋 (dòng)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 面试时穿上一____得体的商务职业正装显得特别专业。',
      options: ['套 (tào)', '件 (jiàn)', '把 (bǎ)', '条 (tiáo)'],
      answer: 0,
      explain: 'Bộ vest âu phục hoàn chỉnh (西装) gồm cả áo và quần dùng 套 (tào).'
    }
  },

  // --- NHÓM 6: ĐỘNG LƯỢNG TỪ (VERBAL CLASSIFIERS - HÀNH ĐỘNG) ---
  {
    id: 'clf_ci',
    char: '次',
    pinyin: 'cì',
    hanviet: 'Thứ',
    meaning: 'lần, lượt (đo lường số lần xảy ra hành động nói chung)',
    category: 'verbal',
    categoryName: 'Động Lượng Từ (Số Lần Hành Động)',
    applicableObjects: 'Mọi hành động xảy ra theo tần suất: đi, đến, xem, gặp, họp...',
    collocations: [
      { zh: '去过一次', py: 'qù guò yí cì', vi: 'đã đi một lần' },
      { zh: '见一次面', py: 'jiàn yí cì miàn', vi: 'gặp mặt một lần' },
      { zh: '第一次', py: 'dì-yī cì', vi: 'lần đầu tiên' },
      { zh: '一次机会', py: 'yí cì jīhuì', vi: 'một cơ hội' },
      { zh: '参加一次会议', py: 'cānjiā yí cì huìyì', vi: 'tham dự một cuộc họp' }
    ],
    example: {
      zh: '这是我第一次独自一人坐飞机出国留学，心里既兴奋又有些紧张。',
      py: 'Zhè shì wǒ dì-yī cì dúzì yì rén zuò fēijī chūguó liúxué, xīnlǐ jì xīngfèn yòu yǒuxiē jǐnzhāng.',
      vi: 'Đây là lần đầu tiên tôi một mình đi máy bay ra nước ngoài du học, trong lòng vừa phấn khích vừa có chút hồi hộp.'
    },
    tip: '💡 Phân biệt: 次 chỉ số lần chung; 遍 nhấn mạnh quá trình làm từ đầu chí cuối!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 这个问题我向你请教过好几____了。',
      options: ['次 (cì)', '遍 (biàn)', '趟 (tàng)', '张 (zhāng)'],
      answer: 0,
      explain: 'Số lần hỏi thăm thông thường dùng 次 (cì).'
    }
  },
  {
    id: 'clf_bian',
    char: '遍',
    pinyin: 'biàn',
    hanviet: 'Biến',
    meaning: 'lượt, lần (trải nghiệm toàn bộ quá trình từ đầu đến cuối)',
    category: 'verbal',
    categoryName: 'Động Lượng Từ (Số Lần Hành Động)',
    applicableObjects: 'Đọc sách, nghe nhạc, xem phim, nói chuyện, viết lại, sao chép...',
    collocations: [
      { zh: '看一遍', py: 'kàn yí biàn', vi: 'xem một lượt từ đầu đến cuối' },
      { zh: '读一遍课文', py: 'dú yí biàn kèwén', vi: 'đọc bài khóa một lượt' },
      { zh: '再说一遍', py: 'zài shuō yí biàn', vi: 'nói lại một lần nữa' },
      { zh: '抄写三遍', py: 'chāoxiě sān biàn', vi: 'chép lại ba lần' }
    ],
    example: {
      zh: '老师，刚才那段录音语速太快，请您再为我们播放一遍好吗？',
      py: 'Lǎoshī, gāngcái nà duàn lùyīn yǔsù tài kuài, qǐng nín zài wèi wǒmen bōfàng yí biàn hǎo ma?',
      vi: 'Thầy ơi, đoạn ghi âm vừa rồi nói nhanh quá, xin thầy phát lại từ đầu cho chúng em một lần nữa được không ạ?'
    },
    tip: '💡 Bẫy HSK kinh điển: "再说一遍" (Nói lại từ đầu một lượt), không được nói "再说一次" khi muốn nghe trọn vẹn!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 请大家打开书，把生词从头到尾认真朗读两____。',
      options: ['遍 (biàn)', '次 (cì)', '趟 (tàng)', '本 (běn)'],
      answer: 0,
      explain: 'Đọc từ đầu đến cuối một cách trọn vẹn bắt buộc dùng 遍 (biàn).'
    }
  },
  {
    id: 'clf_tang',
    char: '趟',
    pinyin: 'tàng',
    hanviet: 'Thảng',
    meaning: 'chuyến, bận (hành động đi đi về về, di chuyển quãng đường)',
    category: 'verbal',
    categoryName: 'Động Lượng Từ (Số Lần Hành Động)',
    applicableObjects: 'Đi lại, chạy một chuyến bưu điện, đi siêu thị, đi ngân hàng, chuyến tàu...',
    collocations: [
      { zh: '去一趟超市', py: 'qù yí tàng chāoshì', vi: 'đi siêu thị một chuyến' },
      { zh: '走一趟', py: 'zǒu yí tàng', vi: 'đi một bận / đi một chuyến' },
      { zh: '跑一趟银行', py: 'pǎo yí tàng yínháng', vi: 'chạy ra ngân hàng một chuyến' },
      { zh: '这趟火车', py: 'zhè tàng huǒchē', vi: 'chuyến tàu hỏa này' }
    ],
    example: {
      zh: '下班回家路上顺便去了一趟菜市场买新鲜蔬菜。',
      py: 'Xiàbān huíjiā lù shang shùnbiàn qù le yí tàng càishìchǎng mǎi xīnxiān shūcài.',
      vi: 'Trên đường tan làm về nhà tiện thể ghé qua chợ rau một chuyến mua rau tươi.'
    },
    tip: '💡 Động từ đi lại (去, 走, 跑, 来) kết hợp địa điểm thường dùng 趟 để chỉ việc đi rồi về!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 下午我要抽空跑一____邮局寄重要文件。',
      options: ['趟 (tàng)', '次 (cì)', '遍 (biàn)', '个 (gè)'],
      answer: 0,
      explain: 'Đi đến bưu điện rồi quay về dùng động lượng từ 趟 (tàng).'
    }
  },
  {
    id: 'clf_dun',
    char: '顿',
    pinyin: 'dùn',
    hanviet: 'Đốn',
    meaning: 'bữa (cơm); trận (mắng mỏ, đòn roi, khuyên can)',
    category: 'verbal',
    categoryName: 'Động Lượng Từ (Số Lần Hành Động)',
    applicableObjects: 'Bữa ăn, bữa tiệc, trận đòn, trận mắng mỏ, trận cười...',
    collocations: [
      { zh: '吃一顿饭', py: 'chī yí dùn fàn', vi: 'ăn một bữa cơm' },
      { zh: '吃一顿丰盛的大餐', py: 'chī yí dùn fēngshèng de dàcān', vi: 'ăn một bữa đại tiệc thịnh soạn' },
      { zh: '被爸爸批评了一顿', py: 'bèi bàba pīpíng le yí dùn', vi: 'bị bố phê bình một trận' },
      { zh: '挨了一顿打', py: 'ái le yí dùn dǎ', vi: 'chịu một trận đòn' }
    ],
    example: {
      zh: '辛苦工作了一整周，周末应该和家人一起好好吃一顿丰盛的晚餐。',
      py: 'Xīnkǔ gōngzuò le yì zhěng zhōu, zhōumò yīnggāi hé jiārén yìqǐ hǎohāo chī yí dùn fēngshèng de wǎncān.',
      vi: 'Vất vả làm việc suốt cả tuần, cuối tuần nên cùng người nhà thưởng thức một bữa tối thịnh soạn.'
    },
    tip: '💡 Bẫy HSK: Cơm và các bữa ăn dùng 顿 (dùn); Bị mắng/phạt cũng dùng 一顿 (ví dụ: 骂了一顿)!',
    quiz: {
      question: 'Điền lượng từ thích hợp: 孩子考试不及格，被母亲严厉地训斥了一____。',
      options: ['顿 (dùn)', '次 (cì)', '遍 (biàn)', '把 (bǎ)'],
      answer: 0,
      explain: 'Bị quở trách một trận dùng động lượng từ 顿 (dùn).'
    }
  }
];

// Write classifiers.json
fs.writeFileSync(path.join(ROOT, 'public/data/classifiers.json'), JSON.stringify(CLASSIFIERS, null, 2), 'utf8');
console.log(`✓ Tạo thành công public/data/classifiers.json (${CLASSIFIERS.length} lượng từ cốt lõi)`);

// =========================================================================
// 2. DATASET: 30 ESSENTIAL POLYPHONIC CHARACTERS (CHỮ ĐA ÂM ĐA NGHĨA)
// =========================================================================
const POLYPHONIC_WORDS = [
  {
    id: 'poly_de',
    char: '得',
    hanviet: 'Đắc',
    strokes: 11,
    radical: '彳 (Xích - bước ngắn)',
    summaryMnemonic: 'Trợ từ sau động từ đọc "de"; Bắt buộc phải làm gì đọc "děi"; Nhận được thành tích đọc "dé"!',
    readings: [
      {
        pinyin: 'de',
        tone: 'Thanh nhẹ',
        pos: 'Trợ từ kết cấu',
        meaning: 'dùng sau động từ/tính từ để nối bổ ngữ trạng thái, khả năng',
        collocations: ['跑得快', '说得很好', '做得到', '看得见'],
        example: { zh: '他汉语说得非常流利地道。', py: 'Tā Hànyǔ shuō de fēicháng liúlì dìdào.', vi: 'Anh ấy nói tiếng Trung rất lưu loát và chuẩn bản xứ.' }
      },
      {
        pinyin: 'děi',
        tone: 'Thanh 3 (dẩy)',
        pos: 'Động từ năng nguyện / Phó từ',
        meaning: 'phải, cần phải (nghĩa tương đương 必须, 需要)',
        collocations: ['得走了', '得注意安全', '得花多少钱'],
        example: { zh: '时间不早了，我得马上赶往机场了。', py: 'Shíjiān bù zǎo le, wǒ děi mǎshàng gǎn wǎng jīchǎng le.', vi: 'Thời gian không còn sớm nữa, tôi phải lập tức chạy ra sân bay rồi.' }
      },
      {
        pinyin: 'dé',
        tone: 'Thanh 2 (đé)',
        pos: 'Động từ',
        meaning: 'đạt được, nhận được, mắc (bệnh)',
        collocations: ['得到', '得奖', '得分', '得病'],
        example: { zh: '通过坚持不懈的努力，他终于得到了第一名的好成绩。', py: 'Tōngguò jiānchí-búxiè de nǔlì, tā zhōngyú dédào le dì-yī míng de hǎo chéngjì.', vi: 'Nhờ nỗ lực không ngừng nghỉ, anh ấy cuối cùng đã giành được thành tích hạng nhất.' }
      }
    ],
    quiz: {
      question: 'Trong câu "太晚了，我们____走了。" chữ "得" phát âm là gì?',
      options: ['děi (thanh 3)', 'de (thanh nhẹ)', 'dé (thanh 2)'],
      answer: 0,
      explain: 'Trong ngữ cảnh biểu thị nghĩa "phải làm gì" (= 必须), chữ 得 bắt buộc đọc là děi.'
    }
  },
  {
    id: 'poly_xing',
    char: '行',
    hanviet: 'Hành / Hàng',
    strokes: 6,
    radical: '行 (Hành)',
    summaryMnemonic: 'Đi lại, được phép đọc "xíng"; Ngân hàng, hàng lối, nghề nghiệp đọc "háng"!',
    readings: [
      {
        pinyin: 'xíng',
        tone: 'Thanh 2 (xính)',
        pos: 'Động từ / Tính từ',
        meaning: 'được, được phép, đi lại, năng lực giỏi',
        collocations: ['不行', '行为', '行动', '步行', '你真行'],
        example: { zh: '你看这样安排行不行？', py: 'Nǐ kàn zhèyàng ānpái xíng bu xíng?', vi: 'Bạn xem sắp xếp như thế này có được không?' }
      },
      {
        pinyin: 'háng',
        tone: 'Thanh 2 (háng)',
        pos: 'Danh từ / Lượng từ',
        meaning: 'ngành nghề, hàng lối, ngân hàng',
        collocations: ['银行', '行业', '行列', '同行', '第一行'],
        example: { zh: '请在申请表格的第二行工整写下您的联系电话。', py: 'Qǐng zài shēnqǐng biǎogé de dì-èr háng gōngzhěng xiě xià nín de liánxì diànhuà.', vi: 'Xin vui lòng viết nắn nót số điện thoại liên hệ ở hàng thứ hai của tờ đơn.' }
      }
    ],
    quiz: {
      question: 'Từ "中国银行" (Ngân hàng Trung Quốc) chữ "行" phát âm là gì?',
      options: ['háng (thanh 2)', 'xíng (thanh 2)'],
      answer: 0,
      explain: 'Trong từ 银行 (ngân hàng) và 行业 (ngành nghề), chữ 行 đọc là háng.'
    }
  },
  {
    id: 'poly_zhong',
    char: '重',
    hanviet: 'Trọng / Trùng',
    strokes: 9,
    radical: '里 (Lý)',
    summaryMnemonic: 'Sức nặng, quan trọng đọc "zhòng"; Lặp lại từ đầu đọc "chóng"!',
    readings: [
      {
        pinyin: 'zhòng',
        tone: 'Thanh 4 (chuộng)',
        pos: 'Tính từ / Danh từ',
        meaning: 'nặng, quan trọng, nghiêm trọng',
        collocations: ['重要', '重量', '严重', '重点', '沉重'],
        example: { zh: '身体健康是人一生中最重要的一笔宝贵财富。', py: 'Shēntǐ jiànkāng shì rén yìshēng zhōng zuì zhòngyào de yì bǐ bǎoguì cáifù.', vi: 'Sức khỏe cơ thể là khối tài sản quý báu quan trọng nhất đời người.' }
      },
      {
        pinyin: 'chóng',
        tone: 'Thanh 2 (chúng)',
        pos: 'Phó từ / Động từ',
        meaning: 'lặp lại, trùng điệp, lại một lần nữa',
        collocations: ['重新', '重复', '重逢', '重阳节'],
        example: { zh: '电脑死机了，请重新启动操作系统。', py: 'Diànnǎo sǐjī le, qǐng chóngxīn qǐdòng cāozuò xìtǒng.', vi: 'Máy tính bị treo rồi, vui lòng khởi động lại hệ điều hành.' }
      }
    ],
    quiz: {
      question: 'Từ "重新开始" (Bắt đầu lại từ đầu) chữ "重" phát âm là gì?',
      options: ['chóng (thanh 2)', 'zhòng (thanh 4)'],
      answer: 0,
      explain: 'Biểu thị làm lại một lần nữa (重新) đọc là chóng.'
    }
  },
  {
    id: 'poly_chang',
    char: '长',
    hanviet: 'Trường / Trưởng',
    strokes: 4,
    radical: '长 (Trường)',
    summaryMnemonic: 'Độ dài, thời gian dài đọc "cháng"; Lớn lên, trưởng bối đọc "zhǎng"!',
    readings: [
      {
        pinyin: 'cháng',
        tone: 'Thanh 2 (cháng)',
        pos: 'Tính từ',
        meaning: 'dài (khoảng cách, thời gian)',
        collocations: ['长江', '长城', '时间很长', '长短'],
        example: { zh: '万里长城是中华民族悠久灿烂历史的伟大象征。', py: 'Wànlǐ Chángchéng shì Zhōnghuá mínzú yōujiǔ cànlàn lìshǐ de wěidà xiàngzhēng.', vi: 'Vạn Lý Trường Thành là biểu tượng vĩ đại cho lịch sử lâu đời xán lạn của dân tộc Trung Hoa.' }
      },
      {
        pinyin: 'zhǎng',
        tone: 'Thanh 3 (trảng)',
        pos: 'Động từ / Danh từ',
        meaning: 'lớn lên, sinh trưởng, người đứng đầu',
        collocations: ['长大', '校长', '市长', '长得帅'],
        example: { zh: '孩子们在温馨有爱的家庭环境中健康快乐地长大。', py: 'Háizimen zài wēnxīn yǒu ài de jiātíng huánjìng zhōng jiànkāng kuàilè de zhǎngdà.', vi: 'Những đứa trẻ lớn lên khỏe mạnh và vui vẻ trong môi trường gia đình ấm áp yêu thương.' }
      }
    ],
    quiz: {
      question: 'Từ "校长" (Hiệu trưởng) chữ "长" phát âm là gì?',
      options: ['zhǎng (thanh 3)', 'cháng (thanh 2)'],
      answer: 0,
      explain: 'Người đứng đầu một tổ chức (校长, 院长, 班长) chữ 长 phát âm là zhǎng.'
    }
  },
  {
    id: 'poly_bian_pian',
    char: '便',
    hanviet: 'Tiện / Tiện',
    strokes: 9,
    radical: '亻 (Nhân đứng)',
    summaryMnemonic: 'Thuận tiện đọc "biàn"; Rẻ (tiện nghi) đọc "pián"!',
    readings: [
      {
        pinyin: 'biàn',
        tone: 'Thanh 4 (biện)',
        pos: 'Tính từ / Phó từ',
        meaning: 'thuận tiện, tiện lợi, liền / bèn',
        collocations: ['方便', '便利', '便利店', '便条'],
        example: { zh: '现代高铁网络让城市之间的通勤变得极其方便快捷。', py: 'Xiàndài gāotiě wǎngluò ràng chéngshì zhījiān de tōngqín biàn de jíqí fāngbiàn kuàijié.', vi: 'Mạng lưới tàu cao tốc hiện đại giúp việc đi lại giữa các thành phố trở nên cực kỳ thuận tiện và nhanh chóng.' }
      },
      {
        pinyin: 'pián',
        tone: 'Thanh 2 (phiền)',
        pos: 'Tính từ',
        meaning: 'rẻ, chiếm tiện nghi hời',
        collocations: ['便宜', '占便宜', '大便宜'],
        example: { zh: '这家小店的商品不仅物美价廉，而且老板态度非常和善。', py: 'Zhè jiā xiǎodiàn de shāngpǐn bùjǐn wùměijiàlián, érqiě lǎobǎn tàidu fēicháng héshàn.', vi: 'Hàng hóa của cửa tiệm này vừa rẻ vừa đẹp, lại thêm thái độ ông chủ rất niềm nở.' }
      }
    ],
    quiz: {
      question: 'Từ "便宜" (rẻ tiền) chữ "便" phát âm là gì?',
      options: ['pián (thanh 2)', 'biàn (thanh 4)'],
      answer: 0,
      explain: 'Trong từ 便宜 (piányi - rẻ), chữ 便 đọc là pián.'
    }
  },
  {
    id: 'poly_hui',
    char: '会',
    hanviet: 'Hội / Khoái',
    strokes: 6,
    radical: '人 (Nhân)',
    summaryMnemonic: 'Biết, hội họp đọc "huì"; Kế toán tính toán đọc "kuài"!',
    readings: [
      {
        pinyin: 'huì',
        tone: 'Thanh 4 (huậy)',
        pos: 'Động từ năng nguyện / Danh từ',
        meaning: 'biết (qua học tập), cuộc họp, cơ hội',
        collocations: ['会说汉语', '开会', '会议', '机会'],
        example: { zh: '经过半年的刻苦训练，他已经学会了游泳。', py: 'Jīngguò bàn nián de kèkǔ xùnliàn, tā yǐjīng xuéhuì le yóuyǒng.', vi: 'Sau nửa năm khổ luyện, anh ấy đã biết bơi lội.' }
      },
      {
        pinyin: 'kuài',
        tone: 'Thanh 4 (khoáy)',
        pos: 'Danh từ',
        meaning: 'kế toán, sổ sách tính toán',
        collocations: ['会计', '财会'],
        example: { zh: '她在一家跨国集团财务部门担任资深主管会计。', py: 'Tā zài yì jiā kuàguó jítuán cáiwù bùmén dānrèn zīshēn zhǔguǎn kuàijì.', vi: 'Cô ấy đảm nhiệm chức kế toán trưởng kỳ cựu tại bộ phận tài chính một tập đoàn đa quốc gia.' }
      }
    ],
    quiz: {
      question: 'Từ "会计师" (kế toán viên) chữ "会" phát âm là gì?',
      options: ['kuài (thanh 4)', 'huì (thanh 4)'],
      answer: 0,
      explain: 'Ngành nghề kế toán (会计) chữ 会 bắt buộc phát âm là kuài.'
    }
  },
  {
    id: 'poly_le_yue',
    char: '乐',
    hanviet: 'Lạc / Nhạc',
    strokes: 5,
    radical: '丿 (Phiệt)',
    summaryMnemonic: 'Vui vẻ đọc "lè"; Âm nhạc đọc "yuè"!',
    readings: [
      {
        pinyin: 'lè',
        tone: 'Thanh 4 (lợ)',
        pos: 'Tính từ / Danh từ',
        meaning: 'vui vẻ, vui sướng, niềm vui',
        collocations: ['快乐', '乐观', '可乐', '乐趣'],
        example: { zh: '祝你在崭新的一年里工作顺利、阖家幸福快乐！', py: 'Zhù nǐ zài zhǎnxīn de yì nián lǐ gōngzuò shùnlì, héjiā xìngfú kuàilè!', vi: 'Chúc bạn trong năm mới công việc thuận lợi, cả nhà hạnh phúc an vui!' }
      },
      {
        pinyin: 'yuè',
        tone: 'Thanh 4 (duệ)',
        pos: 'Danh từ',
        meaning: 'âm nhạc, nhạc cụ, khúc nhạc',
        collocations: ['音乐', '乐队', '乐器', '交响乐'],
        example: { zh: '聆听优美动听的古典交响音乐能够让人身心得到彻底放松。', py: 'Língtīng yōuměi dòngtīng de gǔdiǎn jiāoxiǎng yīnyuè nénggòu ràng rén shēnxīn dédào chèdǐ fàngsōng.', vi: 'Lắng nghe những khúc nhạc giao hưởng cổ điển du dương có thể giúp thân tâm được thả lỏng hoàn toàn.' }
      }
    ],
    quiz: {
      question: 'Từ "听音乐" (nghe nhạc) chữ "乐" phát âm là gì?',
      options: ['yuè (thanh 4)', 'lè (thanh 4)'],
      answer: 0,
      explain: 'Trong từ 音乐 (âm nhạc) chữ 乐 đọc là yuè.'
    }
  },
  {
    id: 'poly_hai_huan',
    char: '还',
    hanviet: 'Hoàn / Hoàn',
    strokes: 7,
    radical: '辶 (Xước)',
    summaryMnemonic: 'Vẫn còn, vả lại đọc "hái"; Trả lại đọc "huán"!',
    readings: [
      {
        pinyin: 'hái',
        tone: 'Thanh 2 (hái)',
        pos: 'Phó từ',
        meaning: 'vẫn, còn, hơn nữa',
        collocations: ['还有', '还是', '还在', '还可以'],
        example: { zh: '已经深夜十二点了，书房里的灯光还在亮着。', py: 'Yǐjīng shēnyè shí\'èr diǎn le, shūfáng lǐ de dēngguāng hái zài liàng zhe.', vi: 'Đã 12 giờ đêm rồi, ánh đèn trong phòng sách vẫn còn đang sáng.' }
      },
      {
        pinyin: 'huán',
        tone: 'Thanh 2 (hoán)',
        pos: 'Động từ',
        meaning: 'trả lại, hoàn lại, quay về',
        collocations: ['还书', '还钱', '归还', '还债'],
        example: { zh: '借图书馆的书一定要在规定的截止日期之前按时归还。', py: 'Jiè túshūguǎn de shū yídìng yào zài guīdìng de jiézhǐ rìqī zhīqián ànshí guīhuán.', vi: 'Mượn sách thư viện nhất định phải trả lại đúng hạn trước ngày quy định.' }
      }
    ],
    quiz: {
      question: 'Từ "还钱" (trả nợ tiền) chữ "还" phát âm là gì?',
      options: ['huán (thanh 2)', 'hái (thanh 2)'],
      answer: 0,
      explain: 'Hành động trả lại tiền (还钱) chữ 还 đọc là huán.'
    }
  },
  {
    id: 'poly_cha',
    char: '差',
    hanviet: 'Sai / Sái / S差',
    strokes: 9,
    radical: '羊 (Dương)',
    summaryMnemonic: 'Kém cỏi, thiếu đọc "chà"; Sai lệch, chênh lệch đọc "chā"; Công tác, sai bảo đọc "chāi"!',
    readings: [
      {
        pinyin: 'chà',
        tone: 'Thanh 4 (tra)',
        pos: 'Tính từ / Động từ',
        meaning: 'kém, tồi, thiếu (thời gian)',
        collocations: ['差不多', '太差了', '差十分八点', '成绩差'],
        example: { zh: '现在是差五分九点，发布会马上就要开始了。', py: 'Xiànzài shì chà wǔ fēn jiǔ diǎn, fābùhuì mǎshàng jiù yào kāishǐ le.', vi: 'Bây giờ là 9 giờ kém 5 phút, buổi họp báo sắp sửa bắt đầu.' }
      },
      {
        pinyin: 'chā',
        tone: 'Thanh 1 (toa)',
        pos: 'Danh từ',
        meaning: 'sai số, chênh lệch, khác biệt',
        collocations: ['差别', '时差', '差距', '误差'],
        example: { zh: '中国与英国之间在冬季有八个小时的标准时差。', py: 'Zhōngguó yǔ Yīngguó zhījiān zài dōngjì yǒu bā gè xiǎoshí de biāozhǔn shíchā.', vi: 'Giữa Trung Quốc và nước Anh vào mùa đông có chênh lệch múi giờ chuẩn 8 tiếng.' }
      },
      {
        pinyin: 'chāi',
        tone: 'Thanh 1 (sơ-ai)',
        pos: 'Động từ / Danh từ',
        meaning: 'đi công tác, sai phái làm việc',
        collocations: ['出差', '兼差'],
        example: { zh: '经理下周需要前往广州出差参加春季中国进出口商品交易会。', py: 'Jīnglǐ xià zhōu xūyào qiánwǎng Guǎngzhōu chūchāi cānjiā chūnjì Zhōngguó Jìnchūkǒu Shāngpǐn Jiāoyìhuì.', vi: 'Giám đốc tuần sau cần đi Quảng Châu công tác tham dự hội chợ Canton Fair mùa xuân.' }
      }
    ],
    quiz: {
      question: 'Từ "出差" (đi công tác) chữ "差" phát âm là gì?',
      options: ['chāi (thanh 1)', 'chà (thanh 4)', 'chā (thanh 1)'],
      answer: 0,
      explain: 'Đi công tác (出差) chữ 差 phát âm là chāi.'
    }
  },
  {
    id: 'poly_jiao_jue',
    char: '觉',
    hanviet: 'Giác / Giáo',
    strokes: 9,
    radical: '见 (Kiến)',
    summaryMnemonic: 'Cảm giác, cảm thấy đọc "jué"; Ngủ một giấc đọc "jiào"!',
    readings: [
      {
        pinyin: 'jué',
        tone: 'Thanh 2 (chuế)',
        pos: 'Động từ',
        meaning: 'cảm thấy, cảm giác, nhận thức',
        collocations: ['觉得', '感觉', '自觉', '知觉'],
        example: { zh: '今天气温骤降，出门时顿觉得有些凉意。', py: 'Jīntiān qìwēn zhòujiàng, chūmén shí dùn jué de yǒuxiē liángyì.', vi: 'Hôm nay nhiệt độ giảm đột ngột, ra ngoài cảm thấy có chút se lạnh.' }
      },
      {
        pinyin: 'jiào',
        tone: 'Thanh 4 (chiếu)',
        pos: 'Danh từ',
        meaning: 'giấc ngủ',
        collocations: ['睡觉', '午觉'],
        example: { zh: '中午小睡半个小时午觉能够迅速恢复充沛精力。', py: 'Zhōngwǔ xiǎoshuì bàn gè xiǎoshí wǔjiào nénggòu xùnsù huīfù chōngpèi jīnglì.', vi: 'Buổi trưa chợp mắt ngủ trưa nửa tiếng có thể hồi phục sinh lực nhanh chóng.' }
      }
    ],
    quiz: {
      question: 'Từ "睡觉" (ngủ) chữ "觉" phát âm là gì?',
      options: ['jiào (thanh 4)', 'jué (thanh 2)'],
      answer: 0,
      explain: 'Trong từ 睡觉 (ngủ) và 午觉 (ngủ trưa), chữ 觉 đọc là jiào.'
    }
  }
];

// Write polyphonic_words.json
fs.writeFileSync(path.join(ROOT, 'public/data/polyphonic_words.json'), JSON.stringify(POLYPHONIC_WORDS, null, 2), 'utf8');
console.log(`✓ Tạo thành công public/data/polyphonic_words.json (${POLYPHONIC_WORDS.length} chữ đa âm đa nghĩa cốt lõi)`);
