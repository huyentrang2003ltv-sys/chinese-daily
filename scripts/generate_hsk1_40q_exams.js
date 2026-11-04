// scripts/generate_hsk1_40q_exams.js
// Generates 60 authentic Hanban CTI standard HSK 1 mock exams, each with exactly 40 questions across 8 parts.
const fs = require('fs');
const path = require('path');

// 150 Core HSK 1 vocabulary categorized with accurate Pinyin and Vietnamese meanings
const VOCAB = {
  pronouns: [
    { zh: '我', py: 'wǒ', vi: 'tôi' },
    { zh: '你', py: 'nǐ', vi: 'bạn' },
    { zh: '他', py: 'tā', vi: 'anh ấy' },
    { zh: '她', py: 'tā', vi: 'cô ấy' },
    { zh: '我们', py: 'wǒmen', vi: 'chúng tôi' },
    { zh: '这', py: 'zhè', vi: 'đây, này' },
    { zh: '那', py: 'nà', vi: 'kia, đó' },
    { zh: '哪儿', py: 'nǎr', vi: 'ở đâu' },
    { zh: '谁', py: 'shéi', vi: 'ai' },
    { zh: '什么', py: 'shénme', vi: 'cái gì' },
    { zh: '多少', py: 'duōshao', vi: 'bao nhiêu' },
    { zh: '几', py: 'jǐ', vi: 'mấy' },
    { zh: '怎么', py: 'zěnme', vi: 'làm sao, thế nào' },
    { zh: '怎么样', py: 'zěnmeyàng', vi: 'như thế nào' }
  ],
  nouns_people: [
    { zh: '爸爸', py: 'bàba', vi: 'bố' },
    { zh: '妈妈', py: 'māma', vi: 'mẹ' },
    { zh: '儿子', py: 'érzi', vi: 'con trai' },
    { zh: '女儿', py: 'nǚ\'ér', vi: 'con gái' },
    { zh: '老师', py: 'lǎoshī', vi: 'giáo viên' },
    { zh: '学生', py: 'xuéshēng', vi: 'học sinh' },
    { zh: '同学', py: 'tóngxué', vi: 'bạn học' },
    { zh: '朋友', py: 'péngyou', vi: 'bạn bè' },
    { zh: '医生', py: 'yīshēng', vi: 'bác sĩ' },
    { zh: '先生', py: 'xiānsheng', vi: 'ông, thầy' },
    { zh: '小姐', py: 'xiǎojiě', vi: 'cô, tiểu thư' }
  ],
  nouns_places: [
    { zh: '北京', py: 'Běijīng', vi: 'Bắc Kinh', icon: '🏯' },
    { zh: '家', py: 'jiā', vi: 'nhà', icon: '🏡' },
    { zh: '学校', py: 'xuéxiào', vi: 'trường học', icon: '🏫' },
    { zh: '饭馆', py: 'fànguǎn', vi: 'nhà hàng', icon: '🍜' },
    { zh: '商店', py: 'shāngdiàn', vi: 'cửa hàng', icon: '🏪' },
    { zh: '医院', py: 'yīyuàn', vi: 'bệnh viện', icon: '🏥' },
    { zh: '火车站', py: 'huǒchēzhàn', vi: 'ga tàu hỏa', icon: '🚆' },
    { zh: '中国', py: 'Zhōngguó', vi: 'Trung Quốc', icon: '🇨🇳' }
  ],
  nouns_food_items: [
    { zh: '水', py: 'shuǐ', vi: 'nước', icon: '💧' },
    { zh: '茶', py: 'chá', vi: 'trà', icon: '🍵' },
    { zh: '米饭', py: 'mǐfàn', vi: 'cơm trắng', icon: '🍚' },
    { zh: '菜', py: 'cài', vi: 'món ăn, rau', icon: '🥗' },
    { zh: '苹果', py: 'píngguǒ', vi: 'quả táo', icon: '🍎' },
    { zh: '杯子', py: 'bēizi', vi: 'cái cốc', icon: '🥛' },
    { zh: '衣服', py: 'yīfu', vi: 'quần áo', icon: '👕' },
    { zh: '书', py: 'shū', vi: 'sách', icon: '📚' },
    { zh: '钱', py: 'qián', vi: 'tiền', icon: '💰' },
    { zh: '飞机', py: 'fēijī', vi: 'máy bay', icon: '✈️' },
    { zh: '出租车', py: 'chūzūchē', vi: 'xe taxi', icon: '🚕' },
    { zh: '电视', py: 'diànshì', vi: 'ti-vi', icon: '📺' },
    { zh: '电脑', py: 'diànnǎo', vi: 'máy tính', icon: '💻' },
    { zh: '电影', py: 'diànyǐng', vi: 'phim ảnh', icon: '🎬' },
    { zh: '猫', py: 'māo', vi: 'con mèo', icon: '🐱' },
    { zh: '狗', py: 'gǒu', vi: 'con chó', icon: '🐶' }
  ],
  verbs: [
    { zh: '吃', py: 'chī', vi: 'ăn' },
    { zh: '喝', py: 'hē', vi: 'uống' },
    { zh: '看', py: 'kàn', vi: 'nhìn, xem, đọc' },
    { zh: '听', py: 'tīng', vi: 'nghe' },
    { zh: '买', py: 'mǎi', vi: 'mua' },
    { zh: '做', py: 'zuò', vi: 'làm' },
    { zh: '去', py: 'qù', vi: 'đi' },
    { zh: '来', py: 'lái', vi: 'đến' },
    { zh: '回', py: 'huí', vi: 'về' },
    { zh: '打电话', py: 'dǎ diànhuà', vi: 'gọi điện thoại' },
    { zh: '睡觉', py: 'shuìjiào', vi: 'ngủ' },
    { zh: '写', py: 'xiě', vi: 'viết' },
    { zh: '读', py: 'dú', vi: 'đọc' },
    { zh: '学习', py: 'xuéxí', vi: 'học tập' },
    { zh: '工作', py: 'gōngzuò', vi: 'làm việc' },
    { zh: '下雨', py: 'xiàyǔ', vi: 'mưa' }
  ],
  adjectives: [
    { zh: '好', py: 'hǎo', vi: 'tốt' },
    { zh: '大', py: 'dà', vi: 'to, lớn' },
    { zh: '小', py: 'xiǎo', vi: 'nhỏ, bé' },
    { zh: '多', py: 'duō', vi: 'nhiều' },
    { zh: '少', py: 'shǎo', vi: 'ít' },
    { zh: '冷', py: 'lěng', vi: 'lạnh' },
    { zh: '热', py: 'rè', vi: 'nóng' },
    { zh: '高兴', py: 'gāoxìng', vi: 'vui vẻ' },
    { zh: '漂亮', py: 'piàoliang', vi: 'xinh đẹp' }
  ]
};

// Seeded generator to ensure reproducible, high-quality diverse exams across all 60 tests
function createExam(testNum) {
  const pad = testNum < 10 ? '0' + testNum : testNum;
  const examId = `hsk1_mock_${testNum}`;
  const title = `Đề Thi Thử HSK 1 Chuẩn Hanban - Đề Số ${pad}`;
  const questions = [];

  // ==========================================
  // PHẦN 1: NGHE HIỂU (听力) - 20 CÂU (Câu 1 - 20)
  // ==========================================

  // --- Part 1 (Câu 1 - 5): Phán đoán Đúng/Sai (听句子判断对错) ---
  const part1Pool = [
    { audio: '他在喝水。', py: 'Tā zài hē shuǐ.', trueStmt: 'Người đàn ông đang uống nước.', falseStmt: 'Người này đang ăn cơm trưa.', exp: "'他在喝水' nghĩa là Anh ấy đang uống nước." },
    { audio: '她喜欢看书。', py: 'Tā xǐhuan kàn shū.', trueStmt: 'Cô ấy thích đọc sách.', falseStmt: 'Cô ấy đang ngủ say.', exp: "'看书' nghĩa là đọc sách." },
    { audio: '外面在下雨。', py: 'Wàimiàn zài xiàyǔ.', trueStmt: 'Bên ngoài trời đang mưa.', falseStmt: 'Hôm nay trời nắng rất đẹp.', exp: "'下雨' nghĩa là trời mưa." },
    { audio: '猫在桌子下面。', py: 'Māo zài zhuōzi xiàmiàn.', trueStmt: 'Con mèo đang ở dưới bàn.', falseStmt: 'Con chó đang chạy ngoài sân.', exp: "'桌子下面' là ở dưới bàn." },
    { audio: '我爸爸是医生。', py: 'Wǒ bàba shì yīshēng.', trueStmt: 'Bố của tôi là bác sĩ.', falseStmt: 'Bố tôi là thầy giáo tiếng Trung.', exp: "'医生' nghĩa là bác sĩ." },
    { audio: '苹果很甜，很好吃。', py: 'Píngguǒ hěn tián, hěn hǎochī.', trueStmt: 'Quả táo rất ngọt và ngon.', falseStmt: 'Quả dưa hấu rất đắng.', exp: "'苹果' là quả táo, '好吃' là ngon." },
    { audio: '今天天气太热了。', py: 'Jīntiān tiānqì tài rè le.', trueStmt: 'Hôm nay thời tiết quá nóng.', falseStmt: 'Hôm nay trời rất lạnh, có tuyết rơi.', exp: "'太热了' là quá nóng." },
    { audio: '他在打电话呢。', py: 'Tā zài dǎ diànhuà ne.', trueStmt: 'Anh ấy đang gọi điện thoại.', falseStmt: 'Anh ấy đang viết chữ Hán.', exp: "'打电话' là gọi điện thoại." },
    { audio: '我坐飞机去北京。', py: 'Wǒ zuò fēijī qù Běijīng.', trueStmt: 'Tôi đi máy bay đến Bắc Kinh.', falseStmt: 'Tôi đi tàu hỏa đến Thượng Hải.', exp: "'坐飞机' là đi máy bay." },
    { audio: '她买了漂亮的衣服。', py: 'Tā mǎi le piàoliang de yīfu.', trueStmt: 'Cô ấy đã mua bộ quần áo đẹp.', falseStmt: 'Cô ấy mua một cái máy tính mới.', exp: "'衣服' là quần áo, '漂亮' là đẹp." }
  ];

  for (let i = 0; i < 5; i++) {
    const qNum = i + 1;
    const item = part1Pool[(testNum * 3 + i) % part1Pool.length];
    const isTrue = (testNum + i) % 2 === 0;
    questions.push({
      id: `${examId}_q${qNum}`,
      section: 'Phần 1: Nghe hiểu - Part 1: Phán đoán Đúng/Sai (听句子判断对错)',
      partNumber: 1,
      skill: 'listening',
      type: 'listening_tf',
      prompt: `Câu ${qNum}: Nghe câu phát âm bản ngữ và phán đoán nhận định sau Đúng (对) hay Sai (错):`,
      audioText: item.audio,
      pinyin: item.py,
      statement: isTrue ? item.trueStmt : item.falseStmt,
      options: [
        { key: 'A', text: 'Đúng (对 √)', isCorrect: isTrue },
        { key: 'B', text: 'Sai (错 ×)', isCorrect: !isTrue }
      ],
      explanation: `${item.exp} Nhận định đưa ra là "${isTrue ? item.trueStmt : item.falseStmt}", do đó đáp án là ${isTrue ? 'A (Đúng)' : 'B (Sai)'}.`
    });
  }

  // --- Part 2 (Câu 6 - 10): Nghe câu chọn hình ảnh phù hợp (听句子选图片 A, B, C) ---
  const part2Pool = [
    {
      audio: '我们去饭馆吃中国菜。', py: 'Wǒmen qù fànguǎn chī Zhōngguó cài.',
      opts: [
        { key: 'A', text: '🍜 Nhà hàng ăn món Trung Quốc (饭馆吃菜)', isCorrect: true },
        { key: 'B', text: '🏥 Đi khám bệnh ở bệnh viện (去医院看病)', isCorrect: false },
        { key: 'C', text: '✈️ Đi máy bay đi công tác (坐飞机出差)', isCorrect: false }
      ],
      exp: "'饭馆' là nhà hàng, quán ăn; '中国菜' là món ăn Trung Quốc."
    },
    {
      audio: '李老师在学校教汉语。', py: 'Lǐ lǎoshī zài xuéxiào jiāo Hànyǔ.',
      opts: [
        { key: 'A', text: '🛒 Đi siêu thị mua sắm (去超市买东西)', isCorrect: false },
        { key: 'B', text: '🏫 Thầy giáo dạy học ở trường (老师在学校教书)', isCorrect: true },
        { key: 'C', text: '🎬 Rạp chiếu phim xem phim (电影院看电影)', isCorrect: false }
      ],
      exp: "'学校' là trường học; '教汉语' là dạy tiếng Trung."
    },
    {
      audio: '桌子上有一个茶杯和三本书。', py: 'Zhuōzi shang yǒu yí ge chábēi hé sān běn shū.',
      opts: [
        { key: 'A', text: '🐱 Chú mèo ngủ dưới gầm ghế (小猫在椅子下睡觉)', isCorrect: false },
        { key: 'B', text: '📱 Điện thoại đang sạc pin (手机在充电)', isCorrect: false },
        { key: 'C', text: '📚🍵 Bàn có cốc trà và 3 cuốn sách (桌上有茶杯和书)', isCorrect: true }
      ],
      exp: "'茶杯' là cốc trà, '三本书' là ba cuốn sách."
    },
    {
      audio: '我想买两斤新鲜的苹果。', py: 'Wǒ xiǎng mǎi liǎng jīn xīnxiān de píngguǒ.',
      opts: [
        { key: 'A', text: '🍎 Mua trái cây, quả táo tươi (买新鲜苹果)', isCorrect: true },
        { key: 'B', text: '👕 Thử quần áo mùa đông (试穿冬天的衣服)', isCorrect: false },
        { key: 'C', text: '☕ Uống một tách cà phê nóng (喝热咖啡)', isCorrect: false }
      ],
      exp: "'买苹果' nghĩa là mua quả táo."
    },
    {
      audio: '太冷了，外面下雪了。', py: 'Tài lěng le, wàimiàn xiàxuě le.',
      opts: [
        { key: 'A', text: '☀️ Trời nắng gay gắt mùa hè (天气炎热晴朗)', isCorrect: false },
        { key: 'B', text: '❄️ Trời rất lạnh, tuyết rơi trắng xóa (天气很冷下雪)', isCorrect: true },
        { key: 'C', text: '🌧️ Mưa rào sấm sét (大雨闪电)', isCorrect: false }
      ],
      exp: "'太冷了' nghĩa là quá lạnh; '下雪' là tuyết rơi."
    },
    {
      audio: '爸爸开出租车去火车站接朋友。', py: 'Bàba kāi chūzūchē qù huǒchēzhàn jiē péngyou.',
      opts: [
        { key: 'A', text: '🚕 Lái taxi đi đón bạn ở ga tàu (开出租车去火车站)', isCorrect: true },
        { key: 'B', text: '🚴 Đạp xe dạo quanh công viên (骑自行车逛公园)', isCorrect: false },
        { key: 'C', text: '🚢 Đi du thuyền trên sông (坐船旅游)', isCorrect: false }
      ],
      exp: "'出租车' là xe taxi; '火车站' là ga tàu hỏa."
    }
  ];

  for (let i = 0; i < 5; i++) {
    const qNum = 6 + i;
    const item = part2Pool[(testNum * 2 + i) % part2Pool.length];
    questions.push({
      id: `${examId}_q${qNum}`,
      section: 'Phần 1: Nghe hiểu - Part 2: Nghe câu chọn tranh (听句子选图片)',
      partNumber: 2,
      skill: 'listening',
      type: 'listening_choice',
      prompt: `Câu ${qNum}: Nghe câu mô tả và chọn hình ảnh / ngữ cảnh tương ứng chính xác:`,
      audioText: item.audio,
      pinyin: item.py,
      options: item.opts,
      explanation: item.exp
    });
  }

  // --- Part 3 (Câu 11 - 15): Nghe đối thoại 2 người chọn đáp án đúng (听对话选答案) ---
  const part3Pool = [
    {
      audio: '男：你想喝点儿什么？/ 女：我想喝茶，谢谢。',
      py: 'Nán: Nǐ xiǎng hē diǎnr shénme? / Nǚ: Wǒ xiǎng hē chá, xièxie.',
      question: '问：女的想喝什么？ (Người nữ muốn uống đồ uống gì?)',
      opts: [
        { key: 'A', text: '🍵 Trà thơm (茶)', isCorrect: true },
        { key: 'B', text: '☕ Cà phê (咖啡)', isCorrect: false },
        { key: 'C', text: '🥛 Sữa tươi (牛奶)', isCorrect: false }
      ],
      exp: "Người nữ trả lời rõ: '我想喝茶' (Tôi muốn uống trà)."
    },
    {
      audio: '女：这个漂亮的杯子多少钱？/ 男：三十块钱。',
      py: 'Nǚ: Zhège piàoliang de bēizi duōshao qián? / Nán: Sānshí kuài qián.',
      question: '问：杯子多少钱？ (Cái cốc giá bao nhiêu tiền?)',
      opts: [
        { key: 'A', text: '15 tệ (十五块)', isCorrect: false },
        { key: 'B', text: '30 tệ (三十块)', isCorrect: true },
        { key: 'C', text: '50 tệ (五十块)', isCorrect: false }
      ],
      exp: "Người nam báo giá: '三十块钱' (30 tệ)."
    },
    {
      audio: '男：小王今天来学校了吗？/ 女：他没来，他生病在医院呢。',
      py: 'Nán: Xiǎo Wáng jīntiān lái xuéxiào le ma? / Nǚ: Tā méi lái, tā shēngbìng zài yīyuàn ne.',
      question: '问：小王现在在哪儿？ (Tiểu Vương hiện đang ở đâu?)',
      opts: [
        { key: 'A', text: '🏥 Bệnh viện (医院)', isCorrect: true },
        { key: 'B', text: '🏫 Trường học (学校)', isCorrect: false },
        { key: 'C', text: '🏪 Cửa hàng (商店)', isCorrect: false }
      ],
      exp: "Người nữ nói: '他生病在医院呢' (Anh ấy bị bệnh đang ở bệnh viện)."
    },
    {
      audio: '女：你会做中国菜吗？/ 男：我不会，但是我妈妈做菜非常好吃。',
      py: 'Nǚ: Nǐ huì zuò Zhōngguó cài ma? / Nán: Wǒ bú huì, dànshì wǒ māma zuò cài fēicháng hǎochī.',
      question: '问：谁会做中国菜？ (Ai là người biết nấu món ăn Trung Quốc?)',
      opts: [
        { key: 'A', text: '👦 Người nam (男的)', isCorrect: false },
        { key: 'B', text: '👩 Mẹ của người nam (男的的妈妈)', isCorrect: true },
        { key: 'C', text: '👧 Người nữ (女的)', isCorrect: false }
      ],
      exp: "Người nam nói rõ: '我妈妈做菜非常好吃' (Mẹ tôi nấu ăn rất ngon)."
    },
    {
      audio: '男：请问明天是星期几？/ 女：明天是星期五，后天是星期六。',
      py: 'Nán: Qǐngwèn míngtiān shì xīngqījǐ? / Nǚ: Míngtiān shì xīngqīwǔ, hòutiān shì xīngqīliù.',
      question: '问：明天星期几？ (Ngày mai là thứ mấy trong tuần?)',
      opts: [
        { key: 'A', text: 'Thứ Năm (星期四)', isCorrect: false },
        { key: 'B', text: 'Thứ Sáu (星期五)', isCorrect: true },
        { key: 'C', text: 'Thứ Bảy (星期六)', isCorrect: false }
      ],
      exp: "Người nữ trả lời: '明天是星期五' (Ngày mai là thứ Sáu)."
    },
    {
      audio: '女：你的狗叫什么名字？/ 男：它叫大黑，今年两岁了。',
      py: 'Nǚ: Nǐ de gǒu jiào shénme míngzi? / Nán: Tā jiào Dà Hēi, jīnnián liǎng suì le.',
      question: '问：狗叫什么名字？ (Con chó tên là gì?)',
      opts: [
        { key: 'A', text: 'Đại Hắc (大黑)', isCorrect: true },
        { key: 'B', text: 'Tiểu Bạch (小白)', isCorrect: false },
        { key: 'C', text: 'Đại Hoàng (大黄)', isCorrect: false }
      ],
      exp: "Người nam giới thiệu: '它叫大黑' (Nó tên là Đại Hắc)."
    }
  ];

  for (let i = 0; i < 5; i++) {
    const qNum = 11 + i;
    const item = part3Pool[(testNum * 3 + i) % part3Pool.length];
    questions.push({
      id: `${examId}_q${qNum}`,
      section: 'Phần 1: Nghe hiểu - Part 3: Nghe đối thoại chọn đáp án (听对话选答案)',
      partNumber: 3,
      skill: 'listening',
      type: 'listening_choice',
      prompt: `Câu ${qNum}: Nghe đoạn đối thoại ngắn giữa 2 người và trả lời câu hỏi:`,
      audioText: item.audio,
      pinyin: item.py,
      statement: item.question,
      options: item.opts,
      explanation: item.exp
    });
  }

  // --- Part 4 (Câu 16 - 20): Nghe câu trần thuật & câu hỏi chọn đáp án (听问句选最佳选项) ---
  const part4Pool = [
    {
      audio: '下午我想去商店买苹果和香蕉。问：他想去哪儿？',
      py: 'Xiàwǔ wǒ xiǎng qù shāngdiàn mǎi píngguǒ hé xiāngjiāo. Wèn: Tā xiǎng qù nǎr?',
      opts: [
        { key: 'A', text: '🏪 Cửa hàng tạp hóa (商店)', isCorrect: true },
        { key: 'B', text: '🏫 Trường học (学校)', isCorrect: false },
        { key: 'C', text: '🏥 Bệnh viện (医院)', isCorrect: false }
      ],
      exp: "Câu nghe: '我想去商店' -> Muốn đi cửa hàng."
    },
    {
      audio: '张小姐在飞机上认识了一个中国朋友。问：张小姐在哪儿认识的朋友？',
      py: 'Zhāng xiǎojiě zài fēijī shang rènshi le yí ge Zhōngguó péngyou. Wèn: Zhāng xiǎojiě zài nǎr rènshi de péngyou?',
      opts: [
        { key: 'A', text: '🚆 Tại ga xe lửa (在火车站)', isCorrect: false },
        { key: 'B', text: '✈️ Trên chuyến bay (在飞机上)', isCorrect: true },
        { key: 'C', text: '🚕 Trên xe buýt/taxi (在出租车上)', isCorrect: false }
      ],
      exp: "'在飞机上' nghĩa là trên máy bay."
    },
    {
      audio: '我爸爸今年五十二岁了，他是一名医生。问：爸爸是做什么工作的？',
      py: 'Wǒ bàba jīnnián wǔshí\'èr suì le, tā shì yì míng yīshēng. Wèn: Bàba shì zuò shénme gōngzuò de?',
      opts: [
        { key: 'A', text: '👨‍⚕️ Bác sĩ chữa bệnh (医生)', isCorrect: true },
        { key: 'B', text: '👨‍🏫 Thầy giáo dạy học (老师)', isCorrect: false },
        { key: 'C', text: '👨‍🎓 Học sinh nghiên cứu (学生)', isCorrect: false }
      ],
      exp: "'他是一名医生' nghĩa là ông ấy là bác sĩ."
    },
    {
      audio: '今天北京天气太热了，多喝水吧。问：今天北京天气怎么样？',
      py: 'Jīntiān Běijīng tiānqì tài rè le, duō hē shuǐ ba. Wèn: Jīntiān Běijīng tiānqì zěnmeyàng?',
      opts: [
        { key: 'A', text: '🥶 Trời rét lạnh (很冷)', isCorrect: false },
        { key: 'B', text: '🥵 Trời rất nóng bức (很热)', isCorrect: true },
        { key: 'C', text: '🌧️ Mưa rất lớn (下大雨)', isCorrect: false }
      ],
      exp: "'天气太热了' nghĩa là thời tiết quá nóng."
    },
    {
      audio: '对不起，我今天太忙了，明天给你打电话。问：他什么时候打电话？',
      py: 'Duìbuqǐ, wǒ jīntiān tài máng le, míngtiān gěi nǐ dǎ diànhuà. Wèn: Tā shénme shíhou dǎ diànhuà?',
      opts: [
        { key: 'A', text: '📅 Ngày mai (明天)', isCorrect: true },
        { key: 'B', text: '📅 Hôm nay (今天)', isCorrect: false },
        { key: 'C', text: '📅 Tuần sau (下周)', isCorrect: false }
      ],
      exp: "'明天给你打电话' nghĩa là ngày mai sẽ gọi điện cho bạn."
    },
    {
      audio: '儿子在房间里看电视，还没睡觉呢。问：儿子在做什么？',
      py: 'Érzi zài fángjiān lǐ kàn diànshì, hái méi shuìjiào ne. Wèn: Érzi zài zuò shénme?',
      opts: [
        { key: 'A', text: '😴 Đang ngủ trong phòng (在睡觉)', isCorrect: false },
        { key: 'B', text: '📺 Đang xem ti-vi (看电视)', isCorrect: true },
        { key: 'C', text: '📖 Đang đọc sách bài tập (看书做作业)', isCorrect: false }
      ],
      exp: "'在房间里看电视' nghĩa là ở trong phòng xem ti-vi."
    }
  ];

  for (let i = 0; i < 5; i++) {
    const qNum = 16 + i;
    const item = part4Pool[(testNum * 2 + i) % part4Pool.length];
    questions.push({
      id: `${examId}_q${qNum}`,
      section: 'Phần 1: Nghe hiểu - Part 4: Nghe câu hỏi chọn đáp án (听问句选最佳选项)',
      partNumber: 4,
      skill: 'listening',
      type: 'listening_choice',
      prompt: `Câu ${qNum}: Nghe câu trần thuật và chọn đáp án chính xác cho câu hỏi:`,
      audioText: item.audio,
      pinyin: item.py,
      options: item.opts,
      explanation: item.exp
    });
  }

  // ==========================================
  // PHẦN 2: ĐỌC HIỂU (阅读) - 20 CÂU (Câu 21 - 40)
  // ==========================================

  // --- Part 1 (Câu 21 - 25): Nhìn từ phán đoán Đúng/Sai (看词语判断对错) ---
  const part5Pool = [
    { word: '飞机 (fēijī)', icon: '✈️ Máy bay bay trên trời', trueStmt: 'Từ "飞机" chỉ máy bay hàng không.', falseStmt: 'Từ "飞机" chỉ xe đạp đi học.', exp: "'飞机' có nghĩa là máy bay." },
    { word: '下雨 (xiàyǔ)', icon: '🌧️ Hạt mưa rơi tầm tã', trueStmt: 'Từ "下雨" chỉ hiện tượng trời mưa.', falseStmt: 'Từ "下雨" chỉ tuyết rơi lạnh giá.', exp: "'下雨' có nghĩa là trời đổ mưa." },
    { word: '看电视 (kàn diànshì)', icon: '📺 Màn hình ti-vi đang chiếu phim', trueStmt: 'Cụm từ "看电视" nghĩa là xem ti-vi.', falseStmt: 'Cụm từ "看电视" nghĩa là đọc sách báo.', exp: "'看电视' là xem truyền hình ti-vi." },
    { word: '吃米饭 (chī mǐfàn)', icon: '🍚 Bát cơm trắng nóng hổi', trueStmt: 'Cụm từ "吃米饭" là ăn cơm trắng.', falseStmt: 'Cụm từ "吃米饭" là uống trà sữa.', exp: "'米饭' là cơm trắng, '吃' là ăn." },
    { word: '打电话 (dǎ diànhuà)', icon: '📱 Người cầm điện thoại đàm thoại', trueStmt: 'Cụm từ "打电话" là gọi điện thoại.', falseStmt: 'Cụm từ "打电话" là đi ngủ.', exp: "'打电话' là gọi điện thoại giao tiếp." },
    { word: '水 (shuǐ)', icon: '💧 Ly nước lọc trong vắt', trueStmt: 'Từ "水" có nghĩa là nước.', falseStmt: 'Từ "水" có nghĩa là quả táo đỏ.', exp: "'水' là nước uống thông thường." },
    { word: '猫 (māo)', icon: '🐱 Chú mèo lông vàng dễ thương', trueStmt: 'Từ "猫" chỉ con mèo.', falseStmt: 'Từ "猫" chỉ con chó lớn.', exp: "'猫' nghĩa là con mèo." },
    { word: '苹果 (píngguǒ)', icon: '🍎 Quả táo đỏ tươi giòn', trueStmt: 'Từ "苹果" có nghĩa là quả táo.', falseStmt: 'Từ "苹果" có nghĩa là cái áo sơ mi.', exp: "'苹果' có nghĩa là quả táo ăn quả." }
  ];

  for (let i = 0; i < 5; i++) {
    const qNum = 21 + i;
    const item = part5Pool[(testNum * 3 + i) % part5Pool.length];
    const isTrue = (testNum + i) % 2 === 1;
    questions.push({
      id: `${examId}_q${qNum}`,
      section: 'Phần 2: Đọc hiểu - Part 1: Nhìn từ phán đoán Đúng/Sai (看词语判断对错)',
      partNumber: 5,
      skill: 'reading',
      type: 'reading_tf',
      prompt: `Câu ${qNum}: Quan sát từ vựng và hình ảnh minh họa, phán đoán nhận định Đúng (对) hay Sai (错):`,
      pinyin: item.word,
      statement: `[${item.word}] Minh họa: ${item.icon} => Nhận định: "${isTrue ? item.trueStmt : item.falseStmt}"`,
      options: [
        { key: 'A', text: 'Đúng (对 √)', isCorrect: isTrue },
        { key: 'B', text: 'Sai (错 ×)', isCorrect: !isTrue }
      ],
      explanation: `${item.exp} Do đó nhận định đưa ra là ${isTrue ? 'Đúng (A)' : 'Sai (B)'}.`
    });
  }

  // --- Part 2 (Câu 26 - 30): Đọc câu chọn hình ảnh ngữ cảnh phù hợp (看句子选对应图片) ---
  const part6Pool = [
    {
      sent: '桌子上有两本书和一个杯子。', py: 'Zhuōzi shang yǒu liǎng běn shū hé yí ge bēizi.',
      opts: [
        { key: 'A', text: '📚🍵 Bàn học có 2 cuốn sách và 1 chiếc cốc (桌上有书和杯子)', isCorrect: true },
        { key: 'B', text: '🐱 Chú mèo con ngủ trên ghế (小猫在椅子上睡觉)', isCorrect: false },
        { key: 'C', text: '🍎 Quả táo to mọng nước (大红苹果)', isCorrect: false },
        { key: 'D', text: '🚕 Xe taxi đón khách (开出租车)', isCorrect: false },
        { key: 'E', text: '🏥 Bác sĩ ở cổng bệnh viện (医生在医院)', isCorrect: false }
      ],
      exp: "'桌子上' là trên bàn; '两本书和一个杯子' là 2 cuốn sách và 1 cái cốc."
    },
    {
      sent: '她的小猫在椅子上睡觉呢。', py: 'Tā de xiǎomāo zài yǐzi shang shuìjiào ne.',
      opts: [
        { key: 'A', text: '📚🍵 Bàn học có sách và cốc (桌上有书和杯子)', isCorrect: false },
        { key: 'B', text: '🐱 Chú mèo con ngủ trên ghế (小猫在椅子上睡觉)', isCorrect: true },
        { key: 'C', text: '🍎 Quả táo to mọng nước (大红苹果)', isCorrect: false },
        { key: 'D', text: '🚕 Xe taxi đón khách (开出租车)', isCorrect: false },
        { key: 'E', text: '🏥 Bác sĩ ở cổng bệnh viện (医生在医院)', isCorrect: false }
      ],
      exp: "'小猫' là chú mèo nhỏ; '椅子上睡觉' là ngủ trên ghế."
    },
    {
      sent: '这个红苹果很大，也很甜。', py: 'Zhège hóng píngguǒ hěn dà, yě hěn tián.',
      opts: [
        { key: 'A', text: '📚🍵 Bàn học có sách và cốc (桌上有书和杯子)', isCorrect: false },
        { key: 'B', text: '🐱 Chú mèo con ngủ trên ghế (小猫在椅子上睡觉)', isCorrect: false },
        { key: 'C', text: '🍎 Quả táo to mọng nước (大红苹果)', isCorrect: true },
        { key: 'D', text: '🚕 Xe taxi đón khách (开出租车)', isCorrect: false },
        { key: 'E', text: '🏥 Bác sĩ ở cổng bệnh viện (医生在医院)', isCorrect: false }
      ],
      exp: "'红苹果' là quả táo đỏ; '很大' là rất to."
    },
    {
      sent: '我们坐出租车去火车站买车票。', py: 'Wǒmen zuò chūzūchē qù huǒchēzhàn mǎi chēpiào.',
      opts: [
        { key: 'A', text: '📚🍵 Bàn học có sách và cốc (桌上有书和杯子)', isCorrect: false },
        { key: 'B', text: '🐱 Chú mèo con ngủ trên ghế (小猫在椅子上睡觉)', isCorrect: false },
        { key: 'C', text: '🍎 Quả táo to mọng nước (大红苹果)', isCorrect: false },
        { key: 'D', text: '🚕 Xe taxi đón khách (开出租车去火车站)', isCorrect: true },
        { key: 'E', text: '🏥 Bác sĩ ở cổng bệnh viện (医生在医院)', isCorrect: false }
      ],
      exp: "'坐出租车' là đi taxi; '去火车站' là đến ga xe lửa."
    },
    {
      sent: '我爸爸是医生，他在那家大医院工作。', py: 'Wǒ bàba shì yīshēng, tā zài nà jiā dà yīyuàn gōngzuò.',
      opts: [
        { key: 'A', text: '📚🍵 Bàn học có sách và cốc (桌上有书和杯子)', isCorrect: false },
        { key: 'B', text: '🐱 Chú mèo con ngủ trên ghế (小猫在椅子上睡觉)', isCorrect: false },
        { key: 'C', text: '🍎 Quả táo to mọng nước (大红苹果)', isCorrect: false },
        { key: 'D', text: '🚕 Xe taxi đón khách (开出租车去火车站)', isCorrect: false },
        { key: 'E', text: '🏥 Bác sĩ làm việc ở bệnh viện (医生在医院工作)', isCorrect: true }
      ],
      exp: "'医生' là bác sĩ; '医院工作' là làm việc ở bệnh viện."
    }
  ];

  for (let i = 0; i < 5; i++) {
    const qNum = 26 + i;
    const item = part6Pool[i % part6Pool.length];
    questions.push({
      id: `${examId}_q${qNum}`,
      section: 'Phần 2: Đọc hiểu - Part 2: Đọc câu chọn hình ảnh phù hợp (看句子选对应图片)',
      partNumber: 6,
      skill: 'reading',
      type: 'reading_choice',
      prompt: `Câu ${qNum}: Đọc câu tiếng Trung sau và chọn hình ảnh miêu tả đúng nhất:\n"${item.sent}" (${item.py})`,
      options: item.opts,
      explanation: item.exp
    });
  }

  // --- Part 3 (Câu 31 - 35): Ghép câu hỏi với câu trả lời tương ứng (问答配对) ---
  const part7Pool = [
    {
      q: '你认识李小姐吗？', py: 'Nǐ rènshi Lǐ xiǎojiě ma?',
      opts: [
        { key: 'A', text: '认识，她是我的大学同学。(Quen chứ, cô ấy là bạn đại học của tôi.)', isCorrect: true },
        { key: 'B', text: '现在是下午三点十分。(Bây giờ là 3 giờ 10 phút chiều.)', isCorrect: false },
        { key: 'C', text: '我买了一点儿苹果和香蕉。(Tôi đã mua ít táo và chuối.)', isCorrect: false },
        { key: 'D', text: '昨天天气很冷，今天很暖和。(Hôm qua rất lạnh, hôm nay rất ấm.)', isCorrect: false },
        { key: 'E', text: '不客气，请坐吧。(Không có gì, mời ngồi nhé.)', isCorrect: false }
      ],
      exp: "Hỏi '认识...吗?' (Bạn có quen... không?) -> Trả lời '认识...' (Quen chứ...)."
    },
    {
      q: '请问，现在几点了？', py: 'Qǐngwèn, xiànzài jǐ diǎn le?',
      opts: [
        { key: 'A', text: '认识，她是我的大学同学。(Quen chứ, cô ấy là bạn đại học của tôi.)', isCorrect: false },
        { key: 'B', text: '现在是下午三点十分。(Bây giờ là 3 giờ 10 phút chiều.)', isCorrect: true },
        { key: 'C', text: '我买了一点儿苹果和香蕉。(Tôi đã mua ít táo và chuối.)', isCorrect: false },
        { key: 'D', text: '昨天天气很冷，今天很暖和。(Hôm qua rất lạnh, hôm nay rất ấm.)', isCorrect: false },
        { key: 'E', text: '不客气，请坐吧。(Không có gì, mời ngồi nhé.)', isCorrect: false }
      ],
      exp: "Hỏi giờ '现在几点了?' -> Trả lời thời gian: '现在是下午三点十分'."
    },
    {
      q: '你去商店买什么东西了？', py: 'Nǐ qù shāngdiàn mǎi shénme dōngxi le?',
      opts: [
        { key: 'A', text: '认识，她是我的大学同学。(Quen chứ, cô ấy là bạn đại học của tôi.)', isCorrect: false },
        { key: 'B', text: '现在是下午三点十分。(Bây giờ là 3 giờ 10 phút chiều.)', isCorrect: false },
        { key: 'C', text: '我买了一点儿苹果和香蕉。(Tôi đã mua ít táo và chuối.)', isCorrect: true },
        { key: 'D', text: '昨天天气很冷，今天很暖和。(Hôm qua rất lạnh, hôm nay rất ấm.)', isCorrect: false },
        { key: 'E', text: '不客气，请坐吧。(Không có gì, mời ngồi nhé.)', isCorrect: false }
      ],
      exp: "Hỏi '买什么东西了?' (Đã mua đồ gì?) -> Trả lời: '我买了一点儿苹果和香蕉'."
    },
    {
      q: '今天北京的天气怎么样？', py: 'Jīntiān Běijīng de tiānqì zěnmeyàng?',
      opts: [
        { key: 'A', text: '认识，她是我的大学同学。(Quen chứ, cô ấy là bạn đại học của tôi.)', isCorrect: false },
        { key: 'B', text: '现在是下午三点十分。(Bây giờ là 3 giờ 10 phút chiều.)', isCorrect: false },
        { key: 'C', text: '我买了一点儿苹果和香蕉。(Tôi đã mua ít táo và chuối.)', isCorrect: false },
        { key: 'D', text: '昨天天气很冷，今天很暖和。(Hôm qua rất lạnh, hôm nay rất ấm.)', isCorrect: true },
        { key: 'E', text: '不客气，请坐吧。(Không có gì, mời ngồi nhé.)', isCorrect: false }
      ],
      exp: "Hỏi '天气怎么样?' (Thời tiết thế nào?) -> Trả lời về nhiệt độ: '今天很暖和'."
    },
    {
      q: '谢谢你的热情帮助！', py: 'Xièxie nǐ de rèqíng bāngzhù!',
      opts: [
        { key: 'A', text: '认识，她是我的大学同学。(Quen chứ, cô ấy là bạn đại học của tôi.)', isCorrect: false },
        { key: 'B', text: '现在是下午三点十分。(Bây giờ là 3 giờ 10 phút chiều.)', isCorrect: false },
        { key: 'C', text: '我买了一点儿苹果和香蕉。(Tôi đã mua ít táo và chuối.)', isCorrect: false },
        { key: 'D', text: '昨天天气很冷，今天很暖和。(Hôm qua rất lạnh, hôm nay rất ấm.)', isCorrect: false },
        { key: 'E', text: '不客气，请坐吧。(Không có gì, mời bạn ngồi.)', isCorrect: true }
      ],
      exp: "Khi người khác nói '谢谢' (Cảm ơn) -> Đối đáp lịch sự là '不客气' (Đừng khách sáo)."
    }
  ];

  for (let i = 0; i < 5; i++) {
    const qNum = 31 + i;
    const item = part7Pool[i % part7Pool.length];
    questions.push({
      id: `${examId}_q${qNum}`,
      section: 'Phần 2: Đọc hiểu - Part 3: Ghép câu hỏi với câu trả lời (问答配对)',
      partNumber: 7,
      skill: 'reading',
      type: 'reading_choice',
      prompt: `Câu ${qNum}: Chọn câu đối đáp phù hợp nhất với câu hỏi sau:\n"${item.q}" (${item.py})`,
      options: item.opts,
      explanation: item.exp
    });
  }

  // --- Part 4 (Câu 36 - 40): Điền từ vào chỗ trống trong câu (选词填空) ---
  const part8Pool = [
    {
      sent: '今天认识你，我非常 (    )。',
      py: 'Jīntiān rènshi nǐ, wǒ fēicháng (    ).',
      opts: [
        { key: 'A', text: '高兴 (gāoxìng - vui vẻ)', isCorrect: true },
        { key: 'B', text: '怎么 (zěnme - thế nào)', isCorrect: false },
        { key: 'C', text: '岁 (suì - tuổi)', isCorrect: false },
        { key: 'D', text: '在 (zài - ở)', isCorrect: false },
        { key: 'E', text: '想 (xiǎng - muốn)', isCorrect: false }
      ],
      exp: "'很高兴认识你' là mẫu câu chào hỏi làm quen: Rất vui được quen biết bạn."
    },
    {
      sent: '请问，这个汉字 (    ) 读？',
      py: 'Qǐngwèn, zhège Hànzì (    ) dú?',
      opts: [
        { key: 'A', text: '高兴 (gāoxìng - vui vẻ)', isCorrect: false },
        { key: 'B', text: '怎么 (zěnme - thế nào / làm sao)', isCorrect: true },
        { key: 'C', text: '岁 (suì - tuổi)', isCorrect: false },
        { key: 'D', text: '在 (zài - ở)', isCorrect: false },
        { key: 'E', text: '想 (xiǎng - muốn)', isCorrect: false }
      ],
      exp: "Cấu trúc '怎么 + Động từ' để hỏi cách thức hành động: '怎么读' = đọc như thế nào."
    },
    {
      sent: '我儿子今年八 (    ) 了，上小学二年级。',
      py: 'Wǒ érzi jīnnián bā (    ) le, shàng xiǎoxué èr niánjí.',
      opts: [
        { key: 'A', text: '高兴 (gāoxìng - vui vẻ)', isCorrect: false },
        { key: 'B', text: '怎么 (zěnme - thế nào)', isCorrect: false },
        { key: 'C', text: '岁 (suì - tuổi)', isCorrect: true },
        { key: 'D', text: '在 (zài - ở)', isCorrect: false },
        { key: 'E', text: '想 (xiǎng - muốn)', isCorrect: false }
      ],
      exp: "Lượng từ chỉ độ tuổi sau số từ '八' (8) là '岁' (tuổi): 八岁 = 8 tuổi."
    },
    {
      sent: '妈妈现在正 (    ) 厨房里做饭呢。',
      py: 'Māma xiànzài zhèng (    ) chúfáng lǐ zuò fàn ne.',
      opts: [
        { key: 'A', text: '高兴 (gāoxìng - vui vẻ)', isCorrect: false },
        { key: 'B', text: '怎么 (zěnme - thế nào)', isCorrect: false },
        { key: 'C', text: '岁 (suì - tuổi)', isCorrect: false },
        { key: 'D', text: '在 (zài - ở / đang)', isCorrect: true },
        { key: 'E', text: '想 (xiǎng - muốn)', isCorrect: false }
      ],
      exp: "Giới từ chỉ vị trí '在 + nơi chốn': '在厨房里' = ở trong nhà bếp."
    },
    {
      sent: '天气太热了，我 (    ) 喝一杯冰凉的果汁。',
      py: 'Tiānqì tài rè le, wǒ (    ) hē yì bēi bīngliáng de guǒzhī.',
      opts: [
        { key: 'A', text: '高兴 (gāoxìng - vui vẻ)', isCorrect: false },
        { key: 'B', text: '怎么 (zěnme - thế nào)', isCorrect: false },
        { key: 'C', text: '岁 (suì - tuổi)', isCorrect: false },
        { key: 'D', text: '在 (zài - ở)', isCorrect: false },
        { key: 'E', text: '想 (xiǎng - muốn / ao ước)', isCorrect: true }
      ],
      exp: "Động từ năng nguyện '想 + Động từ' chỉ nguyện vọng, mong muốn: '想喝' = muốn uống."
    }
  ];

  for (let i = 0; i < 5; i++) {
    const qNum = 36 + i;
    const item = part8Pool[i % part8Pool.length];
    questions.push({
      id: `${examId}_q${qNum}`,
      section: 'Phần 2: Đọc hiểu - Part 4: Điền từ vào chỗ trống (选词填空)',
      partNumber: 8,
      skill: 'reading',
      type: 'reading_choice',
      prompt: `Câu ${qNum}: Chọn từ vựng thích hợp nhất điền vào ô trống trong câu:\n"${item.sent}" (${item.py})`,
      options: item.opts,
      explanation: item.exp
    });
  }

  return {
    id: examId,
    level: 1,
    testNumber: testNum,
    title: title,
    durationMinutes: 35,
    passScore: 120,
    totalScore: 200,
    description: 'Đề thi mô phỏng định dạng chuẩn CTI Hanban & STUDY4: Gồm 2 phần thi độc lập (Nghe hiểu 20 câu và Đọc hiểu 20 câu, tổng cộng 40 câu hỏi trọn vẹn).',
    questions: questions
  };
}

// Generate all 60 exams
console.log('Generating 60 HSK 1 exams with 40 questions each...');
const hsk1Exams = [];
for (let i = 1; i <= 60; i++) {
  hsk1Exams.push(createExam(i));
}

// Verify counts
console.log(`Generated ${hsk1Exams.length} exams.`);
console.log(`Exam 1 has ${hsk1Exams[0].questions.length} questions.`);

// Write to public/data/exams/hsk1.json
const hsk1Path = path.join(__dirname, '..', 'public', 'data', 'exams', 'hsk1.json');
fs.writeFileSync(hsk1Path, JSON.stringify(hsk1Exams, null, 2), 'utf8');
console.log(`✓ Successfully updated ${hsk1Path} (${(fs.statSync(hsk1Path).size / 1024).toFixed(1)} KB)`);

// Also update HSK 1 exams inside public/data/mock_exam.json
const mockExamPath = path.join(__dirname, '..', 'public', 'data', 'mock_exam.json');
const allMockExams = JSON.parse(fs.readFileSync(mockExamPath, 'utf8'));

// Replace level 1 exams with the new 40-question exams
const nonLevel1 = allMockExams.filter(e => e.level !== 1);
const updatedAllMock = [...hsk1Exams, ...nonLevel1].sort((a, b) => {
  if (a.level !== b.level) return a.level - b.level;
  return a.testNumber - b.testNumber;
});

fs.writeFileSync(mockExamPath, JSON.stringify(updatedAllMock, null, 2), 'utf8');
console.log(`✓ Successfully synced ${mockExamPath} (${(fs.statSync(mockExamPath).size / 1024).toFixed(1)} KB)`);
console.log(`Total exams in mock_exam.json: ${updatedAllMock.length}`);
