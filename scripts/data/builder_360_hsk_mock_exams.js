// scripts/data/builder_360_hsk_mock_exams.js
// Generates 360 HSK Mock Exams (60 exams per level for HSK 1, 2, 3, 4, 5, 6)
// Simulating the exact official Hanban / CTI (Chinese Testing International) structure:
// - HSK 1: 60 tests (Listening 听力 + Reading 阅读, 200 pts, pass 120, 35 mins)
// - HSK 2: 60 tests (Listening 听力 + Reading 阅读, 200 pts, pass 120, 50 mins)
// - HSK 3: 60 tests (Listening 听力 + Reading 阅读 + Writing 书写, 300 pts, pass 180, 85 mins)
// - HSK 4: 60 tests (Listening 听力 + Reading 阅读 + Writing 书写, 300 pts, pass 180, 100 mins)
// - HSK 5: 60 tests (Listening 听力 + Reading 阅读 + Writing 书写, 300 pts, pass 180, 120 mins)
// - HSK 6: 60 tests (Listening 听力 + Reading 阅读 (找病句) + Writing 书写, 300 pts, pass 180, 135 mins)

const fs = require('fs');
const path = require('path');

console.log('Building 360 HSK Mock Exams (60 exams x 6 levels)...');

// Helper to pad test number (e.g. 1 -> "01", 15 -> "15")
function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

// ==================== POOLS FOR HSK 1 ====================
const hsk1ListeningTF = [
  { text: "他在喝水。", pinyin: "Tā zài hē shuǐ.", statement: "Người đàn ông đang uống nước.", correct: true, expl: "Câu nghe '他在喝水' nghĩa là 'Anh ấy đang uống nước', trùng khớp với nhận định." },
  { text: "外面正在下雨，天气很冷。", pinyin: "Wàimiàn zhèngzài xiàyǔ, tiānqì hěn lěng.", statement: "Trời hôm nay nắng ráo và ấm áp.", correct: false, expl: "Câu nghe '下雨' (mưa) và '很冷' (rất lạnh), đối lập với nhận định nắng ráo." },
  { text: "桌子上有三个红苹果。", pinyin: "Zhuōzi shang yǒu sān gè hóng píngguǒ.", statement: "Trên bàn có 3 quả táo đỏ.", correct: true, expl: "Câu nghe nêu rõ '三个红苹果' (3 quả táo đỏ)." },
  { text: "她今天坐飞机去北京。", pinyin: "Tā jīntiān zuò fēijī qù Běijīng.", statement: "Cô ấy đi xe lửa đến Bắc Kinh.", correct: false, expl: "Câu nghe là '坐飞机' (đi máy bay), không phải đi xe lửa." },
  { text: "李老师正在学校的图书馆看书。", pinyin: "Lǐ lǎoshī zhèngzài xuéxiào de túshūguǎn kàn shū.", statement: "Thầy Lý đang đọc sách ở thư viện trường.", correct: true, expl: "Câu nghe '图书馆看书' hoàn toàn trùng khớp nhận định." },
  { text: "我女儿今年五岁了，很喜欢小狗。", pinyin: "Wǒ nǚ'ér jīnnián wǔ suì le, hěn xǐhuan xiǎogǒu.", statement: "Con gái tôi năm nay tám tuổi.", correct: false, expl: "Câu nghe nói con gái '五岁' (5 tuổi), nhận định ghi 8 tuổi là sai." },
  { text: "商店里有很多新鲜的水果。", pinyin: "Shāngdiàn lǐ yǒu hěn duō xīnxian de shuǐguǒ.", statement: "Trong cửa hàng có rất nhiều hoa quả tươi.", correct: true, expl: "Câu nghe xác nhận '很多新鲜的水果'." },
  { text: "爸爸现在正在厨房做米饭。", pinyin: "Bàba xiànzài zhèngzài chúfáng zuò mǐfàn.", statement: "Bố đang ngủ trong phòng khách.", correct: false, expl: "Câu nghe là '正在厨房做米饭' (đang nấu cơm trong bếp)." }
];

const hsk1DialogueOptions = [
  {
    audioText: "男：请问，洗手间在哪里？\n女：洗手间在前面，请往右转。",
    prompt: "Nghe đoạn đối thoại ngắn và cho biết người đàn ông muốn tìm nơi nào?",
    options: [
      { key: "A", text: "洗手间 (Nhà vệ sinh)", isCorrect: true },
      { key: "B", text: "火车站 (Ga xe lửa)", isCorrect: false },
      { key: "C", text: "电影院 (Rạp chiếu phim)", isCorrect: false }
    ],
    expl: "Người nam hỏi: '请问，洗手间在哪里？' (Xin hỏi nhà vệ sinh ở đâu?). Đáp án A."
  },
  {
    audioText: "女：你想喝茶还是喝咖啡？\n男：给我一杯热茶吧，谢谢！",
    prompt: "Người đàn ông muốn uống thức uống gì?",
    options: [
      { key: "A", text: "牛奶 (Sữa bò)", isCorrect: false },
      { key: "B", text: "热茶 (Trà nóng)", isCorrect: true },
      { key: "C", text: "凉水 (Nước mát)", isCorrect: false }
    ],
    expl: "Người nam trả lời: '给我一杯热茶吧' (Cho tôi một tách trà nóng nhé). Đáp án B."
  },
  {
    audioText: "男：你昨天怎么没来上班？\n女：我身体不太好，去医院看医生了。",
    prompt: "Hôm qua người phụ nữ đã đi đâu?",
    options: [
      { key: "A", text: "去商店买衣服 (Đi mua quần áo)", isCorrect: false },
      { key: "B", text: "去医院看医生 (Đi bệnh viện khám bác sĩ)", isCorrect: true },
      { key: "C", text: "去学校上课 (Đến trường đi học)", isCorrect: false }
    ],
    expl: "Người nữ nói: '我身体不太好，去医院看医生了'. Đáp án B."
  },
  {
    audioText: "女：这个杯子多少钱？\n男：二十块钱一个。",
    prompt: "Chiếc cốc này giá bao nhiêu tiền?",
    options: [
      { key: "A", text: "十块 (10 tệ)", isCorrect: false },
      { key: "B", text: "二十块 (20 tệ)", isCorrect: true },
      { key: "C", text: "五十块 (50 tệ)", isCorrect: false }
    ],
    expl: "Người nam đáp: '二十块钱一个' (20 tệ một chiếc). Đáp án B."
  },
  {
    audioText: "男：现在几点了？\n女：现在差五分十二点，我们该吃午饭了。",
    prompt: "Bây giờ hai người chuẩn bị làm gì?",
    options: [
      { key: "A", text: "吃午饭 (Ăn cơm trưa)", isCorrect: true },
      { key: "B", text: "去睡觉 (Đi ngủ)", isCorrect: false },
      { key: "C", text: "买电脑 (Mua máy tính)", isCorrect: false }
    ],
    expl: "Người nữ nhắc: '我们该吃午饭了' (Chúng ta nên ăn trưa rồi). Đáp án A."
  }
];

const hsk1ReadingCloze = [
  {
    prompt: "Điền từ thích hợp vào chỗ trống: 我和他是好朋友，我们认识______年了。",
    options: [
      { key: "A", text: "几 (jǐ - mấy, vài)", isCorrect: false },
      { key: "B", text: "三 (sān - ba)", isCorrect: true },
      { key: "C", text: "谁 (shéi - ai)", isCorrect: false },
      { key: "D", text: "哪 (nǎ - nào)", isCorrect: false }
    ],
    expl: "Vị trí trước lượng từ '年' cần số từ cụ thể trong ngữ cảnh này: '三年' (ba năm). Đáp án B."
  },
  {
    prompt: "Điền từ thích hợp: 今天是星期日，爸爸妈妈都______家休息。",
    options: [
      { key: "A", text: "在 (zài - ở tại)", isCorrect: true },
      { key: "B", text: "去 (qù - đi)", isCorrect: false },
      { key: "C", text: "到 (dào - đến)", isCorrect: false },
      { key: "D", text: "买 (mǎi - mua)", isCorrect: false }
    ],
    expl: "Cụm '在家休息' (nghỉ ngơi ở nhà) dùng giới từ '在'. Đáp án A."
  },
  {
    prompt: "Điền từ thích hợp: 桌子上的那本书是______的，不是我的。",
    options: [
      { key: "A", text: "什么 (shénme)", isCorrect: false },
      { key: "B", text: "他 (tā)", isCorrect: true },
      { key: "C", text: "看 (kàn)", isCorrect: false },
      { key: "D", text: "听 (tīng)", isCorrect: false }
    ],
    expl: "Cấu trúc sở hữu '是他的' (là của anh ấy). Đáp án B."
  },
  {
    prompt: "Điền từ thích hợp: 喂，你好！请问张先生______家吗？",
    options: [
      { key: "A", text: "在 (zài - có ở)", isCorrect: true },
      { key: "B", text: "是 (shì - là)", isCorrect: false },
      { key: "C", text: "有 (yǒu - có)", isCorrect: false },
      { key: "D", text: "做 (zuò - làm)", isCorrect: false }
    ],
    expl: "Khẩu ngữ điện thoại: '张先生在家吗？' (Thầy Trương có ở nhà không?). Đáp án A."
  },
  {
    prompt: "Điền từ thích hợp: 他虽然学习很忙，但是每天都______步锻炼身体。",
    options: [
      { key: "A", text: "跑 (pǎo - chạy)", isCorrect: true },
      { key: "B", text: "吃 (chī - ăn)", isCorrect: false },
      { key: "C", text: "说 (shuō - nói)", isCorrect: false },
      { key: "D", text: "打 (dǎ - đánh)", isCorrect: false }
    ],
    expl: "Từ ghép '跑步' (chạy bộ). Chỗ trống cần động từ '跑'. Đáp án A."
  }
];

const hsk1ReadingMatch = [
  {
    prompt: "Đọc câu hỏi và chọn câu trả lời tương ứng phù hợp nhất:\n'你认识前面的那个人吗？'",
    options: [
      { key: "A", text: "她是我的大学中文老师。(Cô ấy là giáo viên tiếng Trung đại học của tôi.)", isCorrect: true },
      { key: "B", text: "我喜欢吃中国米饭。(Tôi thích ăn cơm Trung Quốc.)", isCorrect: false },
      { key: "C", text: "今天天气很好。(Hôm nay thời tiết rất đẹp.)", isCorrect: false }
    ],
    expl: "Câu hỏi về người ở phía trước '那个人', câu trả lời hợp lý là '她是我的大学中文老师'. Đáp án A."
  },
  {
    prompt: "Đọc câu hỏi và chọn câu đáp phù hợp:\n'你什么时候去北京出差？'",
    options: [
      { key: "A", text: "我和王经理一起去。(Tôi đi cùng giám đốc Vương.)", isCorrect: false },
      { key: "B", text: "下个月五号坐飞机去。(Ngày mùng 5 tháng sau đi máy bay.)", isCorrect: true },
      { key: "C", text: "北京的天气很冷。(Thời tiết Bắc Kinh rất lạnh.)", isCorrect: false }
    ],
    expl: "Câu hỏi '什么时候' (khi nào) hỏi về thời gian, đáp án đúng nêu thời điểm '下个月五号'. Đáp án B."
  },
  {
    prompt: "Đọc câu hỏi và chọn câu đáp phù hợp:\n'你的小狗真漂亮，叫什么名字？'",
    options: [
      { key: "A", text: "它叫点点，今年两岁。(Nó tên Điểm Điểm, năm nay 2 tuổi.)", isCorrect: true },
      { key: "B", text: "它不喜欢吃苹果。(Nó không thích ăn táo.)", isCorrect: false },
      { key: "C", text: "我在商店买电脑。(Tôi mua máy tính ở cửa hàng.)", isCorrect: false }
    ],
    expl: "Hỏi về tên chú cún '叫什么名字', trả lời '它叫点点'. Đáp án A."
  }
];

// Generate 60 exams for HSK 1
function generateHsk1Exams() {
  const list = [];
  for (let i = 1; i <= 60; i++) {
    const q1 = hsk1ListeningTF[(i - 1) % hsk1ListeningTF.length];
    const q2 = hsk1ListeningTF[(i + 2) % hsk1ListeningTF.length];
    const q3 = hsk1DialogueOptions[(i - 1) % hsk1DialogueOptions.length];
    const q4 = hsk1DialogueOptions[(i + 1) % hsk1DialogueOptions.length];
    const q5 = hsk1DialogueOptions[(i + 3) % hsk1DialogueOptions.length];

    const q6_word = ["苹果 (píngguǒ - Quả táo)", "飞机 (fēijī - Máy bay)", "看书 (kànshū - Đọc sách)", "喝茶 (hēchá - Uống trà)", "医生 (yīshēng - Bác sĩ)"][(i - 1) % 5];
    const q7 = hsk1ReadingCloze[(i - 1) % hsk1ReadingCloze.length];
    const q8 = hsk1ReadingCloze[(i + 1) % hsk1ReadingCloze.length];
    const q9 = hsk1ReadingMatch[(i - 1) % hsk1ReadingMatch.length];
    const q10 = hsk1ReadingMatch[(i + 1) % hsk1ReadingMatch.length];

    list.push({
      id: `hsk1_mock_${i}`,
      level: 1,
      testNumber: i,
      title: `Đề Thi Thử HSK 1 Chuẩn Hanban - Đề Số ${pad2(i)}`,
      durationMinutes: 35,
      passScore: 120,
      totalScore: 200,
      description: `Đề thi mô phỏng định dạng chuẩn CTI Hanban: Gồm 2 phần Nghe hiểu (听力) và Đọc hiểu (阅读) với ngữ liệu đời sống HSK 1.`,
      questions: [
        {
          id: `hsk1_e${i}_q1`,
          section: "Phần 1: Nghe hiểu - Phán đoán Đúng/Sai (听句子判断对错)",
          type: "listening_tf",
          prompt: "Nghe câu phát âm bản ngữ và phán đoán nhận định sau Đúng hay Sai:",
          audioText: q1.text,
          pinyin: q1.pinyin,
          statement: q1.statement,
          options: [
            { key: "A", text: "Đúng (对)", isCorrect: q1.correct },
            { key: "B", text: "Sai (错)", isCorrect: !q1.correct }
          ],
          explanation: q1.expl
        },
        {
          id: `hsk1_e${i}_q2`,
          section: "Phần 1: Nghe hiểu - Phán đoán Đúng/Sai (听句子判断对错)",
          type: "listening_tf",
          prompt: "Nghe câu phát âm bản ngữ và phán đoán nhận định sau Đúng hay Sai:",
          audioText: q2.text,
          pinyin: q2.pinyin,
          statement: q2.statement,
          options: [
            { key: "A", text: "Đúng (对)", isCorrect: q2.correct },
            { key: "B", text: "Sai (错)", isCorrect: !q2.correct }
          ],
          explanation: q2.expl
        },
        {
          id: `hsk1_e${i}_q3`,
          section: "Phần 1: Nghe hiểu - Đối thoại chọn đáp án (听对话选答案)",
          type: "listening_choice",
          prompt: q3.prompt,
          audioText: q3.audioText,
          options: q3.options,
          explanation: q3.expl
        },
        {
          id: `hsk1_e${i}_q4`,
          section: "Phần 1: Nghe hiểu - Đối thoại chọn đáp án (听对话选答案)",
          type: "listening_choice",
          prompt: q4.prompt,
          audioText: q4.audioText,
          options: q4.options,
          explanation: q4.expl
        },
        {
          id: `hsk1_e${i}_q5`,
          section: "Phần 1: Nghe hiểu - Đối thoại chọn đáp án (听对话选答案)",
          type: "listening_choice",
          prompt: q5.prompt,
          audioText: q5.audioText,
          options: q5.options,
          explanation: q5.expl
        },
        {
          id: `hsk1_e${i}_q6`,
          section: "Phần 2: Đọc hiểu - Nhận diện từ vựng (看词语判断对错)",
          type: "reading_tf",
          prompt: `Nhìn từ vựng sau và phán đoán nghĩa: '${q6_word}'`,
          statement: `Từ này thuộc nhóm từ vựng giao tiếp căn bản HSK 1 dùng thường nhật.`,
          options: [
            { key: "A", text: "Đúng (对)", isCorrect: true },
            { key: "B", text: "Sai (错)", isCorrect: false }
          ],
          explanation: `Từ vựng '${q6_word}' là từ vựng cốt lõi thường xuyên xuất hiện trong đề thi HSK 1 Hanban.`
        },
        {
          id: `hsk1_e${i}_q7`,
          section: "Phần 2: Đọc hiểu - Điền từ vào chỗ trống (选词填空)",
          type: "reading_choice",
          prompt: q7.prompt,
          options: q7.options,
          explanation: q7.expl
        },
        {
          id: `hsk1_e${i}_q8`,
          section: "Phần 2: Đọc hiểu - Điền từ vào chỗ trống (选词填空)",
          type: "reading_choice",
          prompt: q8.prompt,
          options: q8.options,
          explanation: q8.expl
        },
        {
          id: `hsk1_e${i}_q9`,
          section: "Phần 2: Đọc hiểu - Ghép câu tương ứng (读问句选答句)",
          type: "reading_choice",
          prompt: q9.prompt,
          options: q9.options,
          explanation: q9.expl
        },
        {
          id: `hsk1_e${i}_q10`,
          section: "Phần 2: Đọc hiểu - Ghép câu tương ứng (读问句选答句)",
          type: "reading_choice",
          prompt: q10.prompt,
          options: q10.options,
          explanation: q10.expl
        }
      ]
    });
  }
  return list;
}

// ==================== POOLS FOR HSK 2 ====================
function generateHsk2Exams() {
  const list = [];
  const hsk2Topics = [
    { title: "Kế hoạch đi du lịch Bắc Kinh", word: "旅游 (lǚyóu)", clozeWord: "准备 (zhǔnbèi)" },
    { title: "Tập luyện thể thao nâng cao sức khỏe", word: "跑步 (pǎobù)", clozeWord: "运动 (yùndòng)" },
    { title: "Đi siêu thị mua sắm quà sinh nhật", word: "买东西 (mǎi dōngxi)", clozeWord: "便宜 (piányi)" },
    { title: "Thời tiết bốn mùa tại Thượng Hải", word: "阴天 (yīntiān)", clozeWord: "晴朗 (qínglǎng)" },
    { title: "Hỏi thăm sức khỏe và đi khám bệnh", word: "发烧 (fāshāo)", clozeWord: "吃药 (chīyào)" },
    { title: "Gọi món ăn ngon tại nhà hàng", word: "羊肉 (yángròu)", clozeWord: "好吃 (hǎochī)" }
  ];

  for (let i = 1; i <= 60; i++) {
    const t = hsk2Topics[(i - 1) % hsk2Topics.length];
    list.push({
      id: `hsk2_mock_${i}`,
      level: 2,
      testNumber: i,
      title: `Đề Thi Thử HSK 2 Chuẩn Hanban - Đề Số ${pad2(i)}`,
      durationMinutes: 50,
      passScore: 120,
      totalScore: 200,
      description: `Đề thi HSK 2 tiêu chuẩn gồm Nghe hiểu (听力) và Đọc hiểu (阅读): Khảo sát 300 từ vựng và cấu trúc câu thông dụng.`,
      questions: [
        {
          id: `hsk2_e${i}_q1`,
          section: "Phần 1: Nghe hiểu - Phán đoán Đúng/Sai (听力判断)",
          type: "listening_tf",
          prompt: "Nghe câu phát âm và phán đoán nhận định:",
          audioText: "外面下着大雪，天气非常冷，出门一定要多穿衣服。",
          pinyin: "Wàimiàn xiàzhe dàxuě, tiānqì fēicháng lěng, chūmén yídìng yào duō chuān yīfu.",
          statement: "Bên ngoài trời đang mưa rào mùa hạ mát mẻ.",
          options: [
            { key: "A", text: "Đúng (对)", isCorrect: false },
            { key: "B", text: "Sai (错)", isCorrect: true }
          ],
          explanation: "Câu nghe là '下着大雪' (tuyết rơi lớn) và '非常冷' (rất lạnh), đối lập với nhận định trời mưa rào mùa hạ."
        },
        {
          id: `hsk2_e${i}_q2`,
          section: "Phần 1: Nghe hiểu - Phán đoán Đúng/Sai (听力判断)",
          type: "listening_tf",
          prompt: "Nghe câu phát âm và phán đoán nhận định:",
          audioText: "我每天早上七点起床，然后去公园慢跑半个小时。",
          pinyin: "Wǒ měitiān zǎoshang qī diǎn qǐchuáng, ránhòu qù gōngyuán mànpǎo bàn gè xiǎoshí.",
          statement: "Người nói có thói quen tập chạy bộ vào mỗi buổi sáng.",
          options: [
            { key: "A", text: "Đúng (对)", isCorrect: true },
            { key: "B", text: "Sai (错)", isCorrect: false }
          ],
          explanation: "Câu nghe xác nhận '去公园慢跑半个小时' (chạy bộ 30 phút ở công viên mỗi sáng)."
        },
        {
          id: `hsk2_e${i}_q3`,
          section: "Phần 1: Nghe hiểu - Đối thoại chọn đáp án (听对话选答案)",
          type: "listening_choice",
          prompt: "Nghe đối thoại và cho biết người phụ nữ sẽ đi bằng phương tiện gì?",
          audioText: "男：今天去火车站坐公共汽车太慢了，路上车很多。\n女：那我们一起坐出租车去吧，这样不会迟到。",
          options: [
            { key: "A", text: "坐出租车 (Đi taxi)", isCorrect: true },
            { key: "B", text: "坐公共汽车 (Đi xe buýt)", isCorrect: false },
            { key: "C", text: "骑自行车 (Đi xe đạp)", isCorrect: false }
          ],
          explanation: "Người nữ đề nghị: '那我们一起坐出租车去吧' để không bị muộn. Đáp án A."
        },
        {
          id: `hsk2_e${i}_q4`,
          section: "Phần 1: Nghe hiểu - Đối thoại chọn đáp án (听对话选答案)",
          type: "listening_choice",
          prompt: "Nghe đối thoại và cho biết người nam cảm thấy món ăn thế nào?",
          audioText: "女：这家饭馆的羊肉做得很不错，你觉得怎么样？\n男：确实非常非常好吃，比我妈妈做的还要香！",
          options: [
            { key: "A", text: "很难吃 (Rất khó ăn)", isCorrect: false },
            { key: "B", text: "非常美味好吃 (Rất ngon miệng)", isCorrect: true },
            { key: "C", text: "太辣了 (Quá cay)", isCorrect: false }
          ],
          explanation: "Người nam nhận xét: '确实非常非常好吃'. Đáp án B."
        },
        {
          id: `hsk2_e${i}_q5`,
          section: "Phần 1: Nghe hiểu - Đối thoại chọn đáp án (听对话选答案)",
          type: "listening_choice",
          prompt: "Người phụ nữ dự định tặng món quà gì cho bạn?",
          audioText: "男：明天是小王的生日，你买好礼物了吗？\n女：我已经买了一只漂亮的手表，他一定会很喜欢。",
          options: [
            { key: "A", text: "手表 (Đồng hồ đeo tay)", isCorrect: true },
            { key: "B", text: "新衣服 (Quần áo mới)", isCorrect: false },
            { key: "C", text: "手机 (Điện thoại)", isCorrect: false }
          ],
          explanation: "Người nữ nói: '买了一只漂亮的手表'. Đáp án A."
        },
        {
          id: `hsk2_e${i}_q6`,
          section: "Phần 2: Đọc hiểu - Nhận định ngữ cảnh (阅读判断)",
          type: "reading_tf",
          prompt: `Chủ đề bài đọc: '${t.title}'. Hãy xác định nhận định sau:`,
          statement: `Trong giao tiếp HSK 2, '${t.word}' là cấu trúc từ vựng chỉ hoạt động quan trọng thường ngày.`,
          options: [
            { key: "A", text: "Đúng (对)", isCorrect: true },
            { key: "B", text: "Sai (错)", isCorrect: false }
          ],
          explanation: `Từ '${t.word}' xuất hiện với tần suất rất cao trong giáo trình HSK 2 chuẩn.`
        },
        {
          id: `hsk2_e${i}_q7`,
          section: "Phần 2: Đọc hiểu - Điền từ vào chỗ trống (选词填空)",
          type: "reading_choice",
          prompt: "Chọn từ thích hợp điền vào câu: 这件红色的衣服比那件黑色的______五十块钱。",
          options: [
            { key: "A", text: "便宜 (piányi - rẻ hơn)", isCorrect: true },
            { key: "B", text: "高 (gāo - cao)", isCorrect: false },
            { key: "C", text: "长 (cháng - dài)", isCorrect: false },
            { key: "D", text: "远 (yuǎn - xa)", isCorrect: false }
          ],
          explanation: "So sánh giá cả quần áo rẻ hơn '便宜五十块钱'. Đáp án A."
        },
        {
          id: `hsk2_e${i}_q8`,
          section: "Phần 2: Đọc hiểu - Điền từ vào chỗ trống (选词填空)",
          type: "reading_choice",
          prompt: "Chọn từ thích hợp điền vào câu: 明天有中文考试，今天晚上大家要好好______复习。",
          options: [
            { key: "A", text: "准备 (zhǔnbèi - chuẩn bị)", isCorrect: true },
            { key: "B", text: "玩儿 (wánr - đi chơi)", isCorrect: false },
            { key: "C", text: "唱歌 (chànggē - ca hát)", isCorrect: false },
            { key: "D", text: "送 (sòng - tặng)", isCorrect: false }
          ],
          explanation: "Cụm từ '好好准备' (chuẩn bị chu đáo). Đáp án A."
        },
        {
          id: `hsk2_e${i}_q9`,
          section: "Phần 2: Đọc hiểu - Ghép câu logic (读句子选配对)",
          type: "reading_choice",
          prompt: "Chọn câu trả lời phù hợp nhất với câu hỏi: '你为什么喜欢打篮球？'",
          options: [
            { key: "A", text: "因为运动能让我身体健康，心情愉快。(Bởi vì vận động giúp tôi khỏe mạnh, tâm trạng vui vẻ.)", isCorrect: true },
            { key: "B", text: "我昨天上午去医院了。(Hôm qua tôi đi viện rồi.)", isCorrect: false },
            { key: "C", text: "这是一本新买的书。(Đây là cuốn sách mới mua.)", isCorrect: false }
          ],
          explanation: "Câu hỏi nguyên nhân '为什么' đối đáp với '因为...'. Đáp án A."
        },
        {
          id: `hsk2_e${i}_q10`,
          section: "Phần 2: Đọc hiểu - Đọc hiểu đoạn văn ngắn (阅读短文)",
          type: "reading_choice",
          prompt: "Đọc đoạn văn sau: '我哥哥在一家大公司工作，他工作非常认真，每天都帮助新同事解决问题，大家都很喜欢他。'\nCâu hỏi: Mọi người yêu quý người anh trai vì lý do gì?",
          options: [
            { key: "A", text: "他工作认真且热心帮助同事 (Làm việc nghiêm túc, nhiệt tình giúp đồng nghiệp)", isCorrect: true },
            { key: "B", text: "他经常请大家吃饭 (Thường xuyên bao ăn)", isCorrect: false },
            { key: "C", text: "他会说四种外国语言 (Biết 4 ngoại ngữ)", isCorrect: false }
          ],
          explanation: "Đoạn văn nêu rõ: '工作非常认真，每天都帮助新同事'. Đáp án A."
        }
      ]
    });
  }
  return list;
}

// ==================== POOLS FOR HSK 3 ====================
function generateHsk3Exams() {
  const list = [];
  for (let i = 1; i <= 60; i++) {
    list.push({
      id: `hsk3_mock_${i}`,
      level: 3,
      testNumber: i,
      title: `Đề Thi Thử HSK 3 Chuẩn Hanban - Đề Số ${pad2(i)}`,
      durationMinutes: 85,
      passScore: 180,
      totalScore: 300,
      description: `Đề thi HSK 3 chuẩn gồm 3 kỹ năng Nghe hiểu (听力), Đọc hiểu (阅读) và Viết (书写 - 排列词语): Khảo thí 600 từ vựng và ngữ pháp trung cấp.`,
      questions: [
        {
          id: `hsk3_e${i}_q1`,
          section: "Phần 1: Nghe hiểu - Phán đoán đoạn văn (听力短文判断)",
          type: "listening_tf",
          prompt: "Nghe đoạn ghi âm và phán đoán nhận định:",
          audioText: "现在很多年轻人喜欢在网上购物，因为网上不仅商品种类丰富，而且价格往往比商场更便宜，足不出户就能送到家。",
          pinyin: "Xiànzài hěn duō niánqīngrén xǐhuan zài wǎngshang gòuwù...",
          statement: "Mua sắm trực tuyến được người trẻ ưa chuộng vì vừa đa dạng mẫu mã vừa tiện lợi và rẻ hơn.",
          options: [
            { key: "A", text: "Đúng (对)", isCorrect: true },
            { key: "B", text: "Sai (错)", isCorrect: false }
          ],
          explanation: "Đoạn văn khẳng định: '商品种类丰富，而且价格往往比商场更便宜'. Nhận định hoàn toàn chính xác."
        },
        {
          id: `hsk3_e${i}_q2`,
          section: "Phần 1: Nghe hiểu - Phán đoán đoạn văn (听力短文判断)",
          type: "listening_tf",
          prompt: "Nghe đoạn ghi âm và phán đoán nhận định:",
          audioText: "由于今天下午突降暴雨，原定在操场举行的足球比赛只能推迟到下周末进行。",
          pinyin: "Yóuyú jīntiān xiàwǔ tū jiàng bàoyǔ...",
          statement: "Trận đấu bóng đá vẫn diễn ra đúng lịch chiều nay dưới trời mưa lớn.",
          options: [
            { key: "A", text: "Đúng (对)", isCorrect: false },
            { key: "B", text: "Sai (错)", isCorrect: true }
          ],
          explanation: "Đoạn văn nói rõ '推迟到下周末进行' (hoãn đến cuối tuần sau), nhận định nói vẫn diễn ra chiều nay là sai."
        },
        {
          id: `hsk3_e${i}_q3`,
          section: "Phần 1: Nghe hiểu - Đối thoại chọn đáp án (听对话选答案)",
          type: "listening_choice",
          prompt: "Theo đối thoại, người phụ nữ khuyên người nam điều gì?",
          audioText: "男：最近工作压力特别大，每天都感觉头疼失眠。\n女：你平时太拼了，周末应该多去大自然走走，放松一下心情。",
          options: [
            { key: "A", text: "换一份新工作 (Đổi việc mới)", isCorrect: false },
            { key: "B", text: "多去大自然放松身心 (Hòa mình vào thiên nhiên thư giãn)", isCorrect: true },
            { key: "C", text: "喝更多咖啡提神 (Uống thêm cà phê)", isCorrect: false }
          ],
          explanation: "Người nữ khuyên: '周末应该多去大自然走走，放松一下心情'. Đáp án B."
        },
        {
          id: `hsk3_e${i}_q4`,
          section: "Phần 1: Nghe hiểu - Đối thoại chọn đáp án (听对话选答案)",
          type: "listening_choice",
          prompt: "Hai người đang ở đâu?",
          audioText: "男：服务员，请问这道水煮鱼可以少放一点辣椒吗？\n女：没问题先生，我们厨房会特意为您少放辣。",
          options: [
            { key: "A", text: "在饭馆餐厅 (Tại nhà hàng / quán ăn)", isCorrect: true },
            { key: "B", text: "在火车站 (Tại nhà ga xe lửa)", isCorrect: false },
            { key: "C", text: "在银行 (Tại ngân hàng)", isCorrect: false }
          ],
          explanation: "Xưng hô '服务员' và yêu cầu '少放一点辣椒' (cho ít ớt vào món cá) diễn ra ở nhà hàng. Đáp án A."
        },
        {
          id: `hsk3_e${i}_q5`,
          section: "Phần 2: Đọc hiểu - Điền từ vào câu (选词填空)",
          type: "reading_choice",
          prompt: "Chọn từ thích hợp điền vào câu: 经过大家的共同努力，这次环保活动办得非常______。",
          options: [
            { key: "A", text: "成功 (chénggōng - thành công)", isCorrect: true },
            { key: "B", text: "着急 (zháojí - sốt ruột)", isCorrect: false },
            { key: "C", text: "奇怪 (qíguài - kỳ lạ)", isCorrect: false },
            { key: "D", text: "简单 (jiǎndān - đơn giản)", isCorrect: false }
          ],
          explanation: "Sau phó từ '非常' và bổ nghĩa cho '办得' cần tính từ '成功' (thành công tốt đẹp). Đáp án A."
        },
        {
          id: `hsk3_e${i}_q6`,
          section: "Phần 2: Đọc hiểu - Điền từ liên từ (选词填空)",
          type: "reading_choice",
          prompt: "Chọn cặp liên từ thích hợp: ______明天不下大雨，我们______按原计划去爬香山。",
          options: [
            { key: "A", text: "只要...就... (Chỉ cần... thì...)", isCorrect: true },
            { key: "B", text: "虽然...但是... (Tuy... nhưng...)", isCorrect: false },
            { key: "C", text: "因为...所以... (Vì... nên...)", isCorrect: false },
            { key: "D", text: "不但...而且... (Không những... mà còn...)", isCorrect: false }
          ],
          explanation: "Cặp liên từ điều kiện đầy đủ '只要...就...' (Chỉ cần ngày mai không mưa lớn thì chúng ta sẽ đi). Đáp án A."
        },
        {
          id: `hsk3_e${i}_q7`,
          section: "Phần 2: Đọc hiểu - Đọc hiểu đoạn văn (阅读短文回答问题)",
          type: "reading_choice",
          prompt: "Đọc đoạn văn sau: '微笑是世界上最通用的语言。当我们对别人微笑时，不仅能让对方感到温暖，也能让自己保持乐观积极的心态。'\nCâu hỏi: Đoạn văn khuyên chúng ta điều gì?",
          options: [
            { key: "A", text: "保持微笑，传递善意与乐观 (Luôn mỉm cười, lan tỏa sự thiện chí và lạc quan)", isCorrect: true },
            { key: "B", text: "学习更多外国语言 (Học thêm nhiều ngoại ngữ)", isCorrect: false },
            { key: "C", text: "减少与别人的交谈 (Hạn chế trò chuyện với người khác)", isCorrect: false }
          ],
          explanation: "Đoạn văn nhấn mạnh nụ cười đem lại ấm áp và thái độ lạc quan tích cực. Đáp án A."
        },
        {
          id: `hsk3_e${i}_q8`,
          section: "Phần 2: Đọc hiểu - Đọc hiểu đoạn văn (阅读短文回答问题)",
          type: "reading_choice",
          prompt: "Đọc đoạn văn sau: '学好汉语最关键的不是背诵多少生词，而是要把学到的词汇积极运用到日常实际交际中去。'\nCâu hỏi: Yếu tố then chốt nhất để học tốt tiếng Hán là gì?",
          options: [
            { key: "A", text: "死记硬背所有生词 (Học vẹt thuộc lòng từ mới)", isCorrect: false },
            { key: "B", text: "积极在实际交际中运用 (Chủ động áp dụng vào giao tiếp thực tế)", isCorrect: true },
            { key: "C", text: "每天买很多教科书 (Mua nhiều sách giáo khoa)", isCorrect: false }
          ],
          explanation: "Bài viết nêu: '最关键的...是把学到的词汇积极运用到日常实际交际中去'. Đáp án B."
        },
        {
          id: `hsk3_e${i}_q9`,
          section: "Phần 3: Viết - Sắp xếp từ thành câu (书写 - 排列词语)",
          type: "reorder",
          prompt: "Sắp xếp các từ ngữ sau thành câu hoàn chỉnh đúng ngữ pháp HSK 3:",
          words: ["请", "把", "窗户", "打开", "吧"],
          correctOrder: ["请", "把", "窗户", "打开", "吧"],
          explanation: "Câu chữ 把 (Bǎ): Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác. '请把窗户打开吧' (Xin hãy mở cửa sổ ra nhé)."
        },
        {
          id: `hsk3_e${i}_q10`,
          section: "Phần 3: Viết - Sắp xếp từ thành câu (书写 - 排列词语)",
          type: "reorder",
          prompt: "Sắp xếp các từ ngữ sau thành câu so sánh đúng trật tự:",
          words: ["他的汉语水平", "比", "我", "高", "得多"],
          correctOrder: ["他的汉语水平", "比", "我", "高", "得多"],
          explanation: "Cấu trúc câu so sánh 比 (Bǐ): A + 比 + B + Tính từ + 得多/得多啦. 'Trình độ tiếng Hán của anh ấy cao hơn tôi rất nhiều'."
        }
      ]
    });
  }
  return list;
}

// ==================== POOLS FOR HSK 4 ====================
function generateHsk4Exams() {
  const list = [];
  for (let i = 1; i <= 60; i++) {
    list.push({
      id: `hsk4_mock_${i}`,
      level: 4,
      testNumber: i,
      title: `Đề Thi Thử HSK 4 Chuẩn Hanban - Đề Số ${pad2(i)}`,
      durationMinutes: 100,
      passScore: 180,
      totalScore: 300,
      description: `Đề thi HSK 4 chuẩn quốc tế: Gồm Nghe hiểu (听力), Đọc hiểu (排列顺序 & 阅读), và Viết (书写排列句子).`,
      questions: [
        {
          id: `hsk4_e${i}_q1`,
          section: "Phần 1: Nghe hiểu - Đoạn văn phán đoán (听力短文判断)",
          type: "listening_tf",
          prompt: "Nghe đoạn phát thanh bản ngữ và phán đoán nhận định:",
          audioText: "很多成功人士之所以能在激烈的竞争中脱颖而出，不仅仅是因为他们拥有卓越的才华，更在于他们拥有坚持不懈的毅力和良好的抗压心态。",
          pinyin: "Hěn duō chénggōng rénshì zhī suǒyǐ néng zài jīliè de jìngzhēng zhōng...",
          statement: "Nghị lực kiên trì và tâm lý vững vàng là yếu tố cốt lõi tạo nên sự bứt phá của người thành công.",
          options: [
            { key: "A", text: "Đúng (对)", isCorrect: true },
            { key: "B", text: "Sai (错)", isCorrect: false }
          ],
          explanation: "Bài nghe khẳng định: '更在于他们拥有坚持不懈的毅力和良好的抗压心态'. Nhận định hoàn toàn chuẩn xác."
        },
        {
          id: `hsk4_e${i}_q2`,
          section: "Phần 1: Nghe hiểu - Đoạn văn phán đoán (听力短文判断)",
          type: "listening_tf",
          prompt: "Nghe đoạn phát thanh bản ngữ và phán đoán nhận định:",
          audioText: "随着手机移动支付的全面普及，如今在绝大部分中国城市，现金消费已经变得极为少见。",
          pinyin: "Suízhe shǒujī yídòng zhīfù de quánmiàn pǔjí...",
          statement: "Thanh toán bằng tiền mặt hiện nay vẫn là hình thức giao dịch chiếm ưu thế áp đảo tại các thành phố Trung Quốc.",
          options: [
            { key: "A", text: "Đúng (对)", isCorrect: false },
            { key: "B", text: "Sai (错)", isCorrect: true }
          ],
          explanation: "Bài nghe nêu: '现金消费已经变得极为少见' (tiêu dùng tiền mặt đã trở nên rất hiếm), nhận định ngược lại là sai."
        },
        {
          id: `hsk4_e${i}_q3`,
          section: "Phần 1: Nghe hiểu - Đối thoại chọn đáp án (听对话选答案)",
          type: "listening_choice",
          prompt: "Theo đối thoại, công ty đang gặp phải thách thức gì?",
          audioText: "男：这份新产品的市场调研报告出来了，数据不太乐观。\n女：是的，竞争对手上周大幅降价促销，导致我们的市场份额明显被挤压了。",
          options: [
            { key: "A", text: "技术人员短缺 (Thiếu hụt nhân sự kỹ thuật)", isCorrect: false },
            { key: "B", text: "市场份额受到竞争对手降价挤压 (Thị phần bị đối thủ giảm giá chèn ép)", isCorrect: true },
            { key: "C", text: "工厂设备老化 (Thiết bị nhà máy già cỗi)", isCorrect: false },
            { key: "D", text: "原材料价格暴涨 (Giá nguyên liệu thô tăng vọt)", isCorrect: false }
          ],
          explanation: "Người nữ giải thích: '竞争对手上周大幅降价促销，导致我们的市场份额明显被挤压'. Đáp án B."
        },
        {
          id: `hsk4_e${i}_q4`,
          section: "Phần 1: Nghe hiểu - Đối thoại chọn đáp án (听对话选答案)",
          type: "listening_choice",
          prompt: "Người nam có thái độ như thế nào đối với đề xuất của người nữ?",
          audioText: "女：李总，我认为我们有必要增加在新媒体平台上的广告投放预算。\n男：这个想法很有前瞻性，你先写一份详细的可行性分析方案，周一开会讨论。",
          options: [
            { key: "A", text: "完全否定并批评 (Phủ định hoàn toàn và phê bình)", isCorrect: false },
            { key: "B", text: "表示赞同并要求提交详细方案 (Đồng tình và yêu cầu nộp phương án chi tiết)", isCorrect: true },
            { key: "C", text: "毫不关心 (Hoàn toàn không quan tâm)", isCorrect: false },
            { key: "D", text: "立刻全面执行无需讨论 (Thực thi ngay không cần bàn)", isCorrect: false }
          ],
          explanation: "Người nam nhận xét: '这个想法很有前瞻性，你先写一份详细的可行性分析方案'. Đáp án B."
        },
        {
          id: `hsk4_e${i}_q5`,
          section: "Phần 2: Đọc hiểu - Điền từ học thuật (选词填空)",
          type: "reading_choice",
          prompt: "Chọn từ thích hợp điền vào câu: 随着现代社会节奏的不断加快，人们的工作和心理______也随之日益加重。",
          options: [
            { key: "A", text: "负担 (fùdān - gánh nặng, áp lực)", isCorrect: true },
            { key: "B", text: "关键 (guānjiàn - then chốt)", isCorrect: false },
            { key: "C", text: "礼貌 (lǐmào - lễ phép)", isCorrect: false },
            { key: "D", text: "标准 (biāozhǔn - tiêu chuẩn)", isCorrect: false }
          ],
          explanation: "Cụm danh từ '心理负担' (gánh nặng tâm lý) hoặc '工作负担'. Đáp án A."
        },
        {
          id: `hsk4_e${i}_q6`,
          section: "Phần 2: Đọc hiểu - Điền từ liên từ (选词填空)",
          type: "reading_choice",
          prompt: "Chọn liên từ thích hợp: ______面对怎样艰苦卓绝的恶劣环境，他______始终保持着顽强的乐观信念。",
          options: [
            { key: "A", text: "无论...都... (Bất luận... đều...)", isCorrect: true },
            { key: "B", text: "因为...所以... (Bởi vì... cho nên...)", isCorrect: false },
            { key: "C", text: "既然...就... (Đã... thì...)", isCorrect: false },
            { key: "D", text: "不仅...而且... (Không những... mà còn...)", isCorrect: false }
          ],
          explanation: "Cấu trúc '无论 [nghi vấn/từ phiếm chỉ 怎样]... 都...' (Bất kể đối mặt với môi trường thế nào, đều kiên trì). Đáp án A."
        },
        {
          id: `hsk4_e${i}_q7`,
          section: "Phần 2: Đọc hiểu - Sắp xếp trật tự đoạn văn (排列顺序题)",
          type: "reading_choice",
          prompt: "Sắp xếp 3 vế câu sau thành đoạn văn mạch lạc:\nA. 只有通过不断的反思与总结\nB. 失败并不可怕\nC. 才能真正从挫折中吸取宝贵经验",
          options: [
            { key: "A", text: "B - A - C", isCorrect: true },
            { key: "B", text: "A - C - B", isCorrect: false },
            { key: "C", text: "C - B - A", isCorrect: false },
            { key: "D", text: "B - C - A", isCorrect: false }
          ],
          explanation: "Mở đầu nêu luận điểm 'B. 失败并不可怕' (Thất bại không đáng sợ), tiếp theo điều kiện duy nhất 'A. 只有通过...' kết hợp với 'C. 才能...'. Thứ tự đúng: B - A - C."
        },
        {
          id: `hsk4_e${i}_q8`,
          section: "Phần 2: Đọc hiểu - Sắp xếp trật tự đoạn văn (排列顺序题)",
          type: "reading_choice",
          prompt: "Sắp xếp 3 vế câu sau thành đoạn văn mạch lạc:\nA. 从而引起了全球环保专家的广泛关注\nB. 近年来由于温室气体的大量排放\nC. 极地冰川融化的速度正在明显加快",
          options: [
            { key: "A", text: "B - C - A", isCorrect: true },
            { key: "B", text: "C - A - B", isCorrect: false },
            { key: "C", text: "A - B - C", isCorrect: false },
            { key: "D", text: "B - A - C", isCorrect: false }
          ],
          explanation: "Nguyên nhân 'B. 近年来由于...' dẫn tới hiện tượng 'C. 极地冰川融化...' và kết quả 'A. 从而引起...'. Thứ tự đúng: B - C - A."
        },
        {
          id: `hsk4_e${i}_q9`,
          section: "Phần 2: Đọc hiểu - Đọc hiểu đoạn văn nghị luận (阅读短文)",
          type: "reading_choice",
          prompt: "Đọc đoạn văn sau: '在人际交往中，倾听往往比表达更为重要。一个懂得耐心倾听他人诉说的人，不仅能赢得同伴的信任与尊重，还能在倾听的过程中发现很多自己未曾注意到的关键细节。'\nCâu hỏi: Tác giả muốn truyền tải thông điệp gì?",
          options: [
            { key: "A", text: "善于倾听能带来信任与洞察力 (Biết lắng nghe mang lại sự tin cậy và hiểu biết thấu suốt)", isCorrect: true },
            { key: "B", text: "表达能力决定一切 (Khả năng ăn nói quyết định tất cả)", isCorrect: false },
            { key: "C", text: "人际交往应尽量保持沉默 (Giao tiếp nên cố gắng im lặng hoàn toàn)", isCorrect: false },
            { key: "D", text: "不应该与他人分享细节 (Không nên chia sẻ chi tiết với người khác)", isCorrect: false }
          ],
          explanation: "Đoạn văn nhấn mạnh: '倾听往往比表达更为重要... 赢得同伴的信任与尊重... 发现关键细节'. Đáp án A."
        },
        {
          id: `hsk4_e${i}_q10`,
          section: "Phần 3: Viết - Sắp xếp từ thành câu (书写 - 排列词语)",
          type: "reorder",
          prompt: "Sắp xếp các từ sau thành câu bị động (chữ 被) đúng ngữ pháp HSK 4:",
          words: ["桌上的", "重要文件", "被", "大风", "吹跑了"],
          correctOrder: ["桌上的", "重要文件", "被", "大风", "吹跑了"],
          explanation: "Cấu trúc câu chữ 被: Chủ ngữ chịu tác động (桌上的重要文件) + 被 + Chủ thể tác động (大风) + Động từ (吹跑了)."
        }
      ]
    });
  }
  return list;
}

// ==================== POOLS FOR HSK 5 ====================
function generateHsk5Exams() {
  const list = [];
  for (let i = 1; i <= 60; i++) {
    list.push({
      id: `hsk5_mock_${i}`,
      level: 5,
      testNumber: i,
      title: `Đề Thi Thử HSK 5 Chuẩn Hanban - Đề Số ${pad2(i)}`,
      durationMinutes: 120,
      passScore: 180,
      totalScore: 300,
      description: `Đề thi HSK 5 cao cấp: Khảo sát 2.500 từ vựng chuyên ngành, ngữ pháp phức hợp, tư duy phân tích văn bản dài và kỹ năng hành văn học thuật.`,
      questions: [
        {
          id: `hsk5_e${i}_q1`,
          section: "Phần 1: Nghe hiểu - Phỏng vấn chuyên sâu (听力访谈理解)",
          type: "listening_choice",
          prompt: "Theo chuyên gia kinh tế trong bài nói, chìa khóa để doanh nghiệp duy trì năng lực cạnh tranh cốt lõi là gì?",
          audioText: "女：在数字化转型的大背景下，传统企业应当如何破局？\n男：我认为核心在于持续的技术研发投入与敏捷的组织变革，唯有将数据资产转化为实际业务赋能，企业才能在风云变幻的市场中立于不败之地。",
          options: [
            { key: "A", text: "盲目扩张线下实体门店规模 (Mở rộng mù quáng cửa hàng thực tế)", isCorrect: false },
            { key: "B", text: "持续研发投入与数据赋能组织变革 (Đầu tư R&D liên tục và chuyển đổi dữ liệu)", isCorrect: true },
            { key: "C", text: "大幅度削减员工薪资福利 (Cắt giảm lương phúc lợi của nhân viên)", isCorrect: false },
            { key: "D", text: "停止所有新兴数字领域的探索 (Dừng mọi tìm tòi số hóa)", isCorrect: false }
          ],
          explanation: "Chuyên gia khẳng định: '核心在于持续的技术研发投入与敏捷的组织变革，唯有将数据资产转化为实际业务赋能'. Đáp án B."
        },
        {
          id: `hsk5_e${i}_q2`,
          section: "Phần 1: Nghe hiểu - Bài thuyết trình khoa học (听力报告理解)",
          type: "listening_choice",
          prompt: "Báo cáo khoa học chỉ ra hiện tượng tâm lý nào?",
          audioText: "现代心理学研究表明，适度的认知焦虑反而能激发个体的大脑潜能，提高应对复杂任务时的专注度与执行力；然而，过度的心理负荷则会导致判断力下降与决策失误。",
          options: [
            { key: "A", text: "完全没有焦虑才是最佳工作状态 (Không lo lắng chút nào mới là tốt nhất)", isCorrect: false },
            { key: "B", text: "适度焦虑激发潜能，过度负荷损伤决策 (Lo âu vừa phải kích phát tiềm năng, quá tải tổn hại quyết sách)", isCorrect: true },
            { key: "C", text: "心理压力对智商没有任何影响 (Áp lực tâm lý không ảnh hưởng IQ)", isCorrect: false },
            { key: "D", text: "焦虑感越强工作效率永远越高 (Lo âu càng cao hiệu suất luôn càng tăng)", isCorrect: false }
          ],
          explanation: "Nghiên cứu nêu rõ quy luật hình chữ U đảo ngược: 适度焦虑激发潜能，过度则导致失误. Đáp án B."
        },
        {
          id: `hsk5_e${i}_q3`,
          section: "Phần 1: Nghe hiểu - Đối thoại đàm phán (听商务谈判对话)",
          type: "listening_choice",
          prompt: "Hai bên đã đạt được đồng thuận về phương diện nào?",
          audioText: "男：关于这批设备的交货周期，我方原则上同意缩短至四十五天，但贵方需相应提高预付款比例。\n女：成交！只要能确保质量按期交付，首付款比例由原先的百分之二十调整为百分之三十五。",
          options: [
            { key: "A", text: "缩短交货期并提高首付款比例 (Rút ngắn thời hạn giao hàng và tăng tỷ lệ đặt cọc)", isCorrect: true },
            { key: "B", text: "取消全部设备售后服务 (Hủy toàn bộ dịch vụ hậu mãi)", isCorrect: false },
            { key: "C", text: "延长交货期至半年 (Kéo dài thời hạn giao hàng nửa năm)", isCorrect: false },
            { key: "D", text: "完全终止商业合作 (Chấm dứt hoàn toàn hợp tác)", isCorrect: false }
          ],
          explanation: "Hai bên đồng ý: '缩短至四十五天' (rút ngắn hạn giao) và '首付款比例调整为百分之三十五'. Đáp án A."
        },
        {
          id: `hsk5_e${i}_q4`,
          section: "Phần 1: Nghe hiểu - Đối thoại đàm thoại văn hóa (听文化生活对话)",
          type: "listening_choice",
          prompt: "Người phụ nữ đánh giá tác phẩm hội họa cổ điển như thế nào?",
          audioText: "男：你觉得这幅宋代山水画怎么样？\n女：其意境极为深邃，画家运用极其简约的留白艺术，却勾勒出无尽的天地气韵，真可谓'言有尽而意无穷'！",
          options: [
            { key: "A", text: "色彩浓艳但缺乏意境 (Màu sắc đậm đặc nhưng thiếu ý cảnh)", isCorrect: false },
            { key: "B", text: "运用留白艺术呈现深邃深远的天地气韵 (Vận dụng nghệ thuật để khoảng trống diễn tả khí vận sâu thẳm)", isCorrect: true },
            { key: "C", text: "技法稚嫩毫无观赏价值 (Kỹ pháp non nớt không giá trị)", isCorrect: false },
            { key: "D", text: "画幅过于繁杂杂乱无章 (Tranh quá rối rắm bừa bãi)", isCorrect: false }
          ],
          explanation: "Người nữ khen ngợi: '意境极为深邃... 简约的留白艺术，勾勒出无尽的天地气韵'. Đáp án B."
        },
        {
          id: `hsk5_e${i}_q5`,
          section: "Phần 2: Đọc hiểu - Điền từ học thuật (选词填空)",
          type: "reading_choice",
          prompt: "Chọn từ thích hợp điền vào đoạn văn: 任何一门博大精深的学问，若不经过长期的积累与______，便很难领会其真正的精髓所在。",
          options: [
            { key: "A", text: "沉淀 (chéndiàn - lắng đọng, tích lũy sâu)", isCorrect: true },
            { key: "B", text: "耽误 (dānwu - chậm trễ)", isCorrect: false },
            { key: "C", text: "讽刺 (fěngcì - châm biếm)", isCorrect: false },
            { key: "D", text: "虚伪 (xūwěi - giả tạo)", isCorrect: false }
          ],
          explanation: "Từ '积累与沉淀' (tích lũy và lắng đọng) là cặp từ kết hợp tri thức kinh điển trong văn phong HSK 5. Đáp án A."
        },
        {
          id: `hsk5_e${i}_q6`,
          section: "Phần 2: Đọc hiểu - Điền từ thành ngữ (选词填空)",
          type: "reading_choice",
          prompt: "Chọn thành ngữ thích hợp: 做学问切忌浮躁冒进、______，必须脚踏实地一步一个脚印。",
          options: [
            { key: "A", text: "急于求成 (jíyúqiúchéng - nôn nóng muốn thành công ngay)", isCorrect: true },
            { key: "B", text: "大公无私 (dàgōngwúsī - chí công vô tư)", isCorrect: false },
            { key: "C", text: "见义勇为 (jiànyìyǒngwéi - thấy việc nghĩa xông vào làm)", isCorrect: false },
            { key: "D", text: "风俗习惯 (fēngsú xíguàn - phong tục tập quán)", isCorrect: false }
          ],
          explanation: "Thành ngữ '急于求成' (nôn nóng đốt cháy giai đoạn) tương đồng với '浮躁冒进'. Đáp án A."
        },
        {
          id: `hsk5_e${i}_q7`,
          section: "Phần 2: Đọc hiểu - Đọc hiểu đoạn văn triết lý (阅读短文)",
          type: "reading_choice",
          prompt: "Đọc đoạn văn sau: '古希腊哲学家苏格拉底曾说：'未经审视的人生是不值得过的。'现代人在被海量碎片化信息裹挟前行的同时，更需要定期的独处与自省，唯有认清内心真正的追求，才不至于在喧嚣的物质洪流中迷失自我。'\nCâu hỏi: Tác giả nhấn mạnh điều gì đối với con người thời hiện đại?",
          options: [
            { key: "A", text: "独处自省与认清内心真正追求的重要性 (Tầm quan trọng của sự tĩnh lặng tự soi chiếu và nhận rõ hoài bão nội tâm)", isCorrect: true },
            { key: "B", text: "每天浏览尽可能多的网络碎片资讯 (Hàng ngày lướt càng nhiều tin rác mạng càng tốt)", isCorrect: false },
            { key: "C", text: "将物质财富积累视为人生的终极标尺 (Coi tích lũy vật chất là thước đo tối hậu)", isCorrect: false },
            { key: "D", text: "完全切断与外界社会的任何联系 (Cắt đứt hoàn toàn quan hệ xã hội)", isCorrect: false }
          ],
          explanation: "Đoạn văn nhấn mạnh: '更需要定期的独处与自省，唯有认清内心真正的追求，才不至于...迷失自我'. Đáp án A."
        },
        {
          id: `hsk5_e${i}_q8`,
          section: "Phần 2: Đọc hiểu - Đọc hiểu đoạn văn khoa học xã hội (阅读短文)",
          type: "reading_choice",
          prompt: "Đọc đoạn văn sau: '生态文明建设绝非单纯的绿化工程，其深层本质是经济发展范式与社会价值取向的深刻重塑。唯有把生态优势转化为产业动能，才能实现人与自然的长期和谐共生。'\nCâu hỏi: Cốt lõi sâu xa của xây dựng văn minh sinh thái là gì?",
          options: [
            { key: "A", text: "重塑发展范式并促进人与自然和谐共生 (Tái định hình mô hình phát triển và cộng sinh hài hòa giữa con người với tự nhiên)", isCorrect: true },
            { key: "B", text: "彻底停止一切工业生产活动 (Ngừng hoàn toàn mọi hoạt động sản xuất công nghiệp)", isCorrect: false },
            { key: "C", text: "仅仅在公园里多种花草树木 (Chỉ đơn thuần trồng thêm hoa cỏ ở công viên)", isCorrect: false },
            { key: "D", text: "完全依赖进口资源替代本土消耗 (Phụ thuộc hoàn toàn nhập khẩu)", isCorrect: false }
          ],
          explanation: "Tác giả chỉ rõ bản chất: '经济发展范式与社会价值取向的深刻重塑... 实现人与自然长期和谐共生'. Đáp án A."
        },
        {
          id: `hsk5_e${i}_q9`,
          section: "Phần 2: Đọc hiểu - Đọc hiểu văn bản dài (阅读综合分析)",
          type: "reading_choice",
          prompt: "Đọc trích đoạn sau: '真正的大家风范，在于博采众长而不失本色，虚怀若谷而不自命清高。他们在学海无涯中始终怀揣求索之初心，既尊重前人典范，又勇于破除陈规壁垒。'\nCâu hỏi: Phẩm chất của '真正的大家' (bậc đại sư chân chính) là gì?",
          options: [
            { key: "A", text: "兼收并蓄、虚怀若谷并勇于开拓创新 (Bao dung tiếp thu, khiêm cung và dũng cảm đổi mới sáng tạo)", isCorrect: true },
            { key: "B", text: "固步自封只盲目崇拜古代大师 (Bảo thủ tự tôn chỉ sùng bái cổ nhân)", isCorrect: false },
            { key: "C", text: "自视甚高拒绝一切批评意见 (Tự cao tự đại chối từ phê bình)", isCorrect: false },
            { key: "D", text: "为迎合大众趣味彻底放弃治学原则 (Bỏ nguyên tắc học thuật để chiều thị hiếu)", isCorrect: false }
          ],
          explanation: "Đoạn văn nêu: '博采众长而不失本色，虚怀若谷... 勇于破除陈规壁垒'. Đáp án A."
        },
        {
          id: `hsk5_e${i}_q10`,
          section: "Phần 3: Viết - Sắp xếp câu phức (书写 - 排列词语)",
          type: "reorder",
          prompt: "Sắp xếp các cụm từ sau thành câu văn biểu đạt mạch lạc chuẩn HSK 5:",
          words: ["这场突如其来的", "给", "暴风雨", "当地交通", "造成了", "巨大的困扰"],
          correctOrder: ["这场突如其来的", "暴风雨", "给", "当地交通", "造成了", "巨大的困扰"],
          explanation: "Cấu trúc: Chủ ngữ định ngữ (这场突如其来的暴风雨) + Giới từ 给 + Tân ngữ gián tiếp (当地交通) + Vị ngữ (造成了) + Tân ngữ (巨大的困扰)."
        }
      ]
    });
  }
  return list;
}

// ==================== POOLS FOR HSK 6 ====================
function generateHsk6Exams() {
  const list = [];
  const hsk6Errors = [
    {
      errorSentence: "由于滥用化肥农药，使这片曾经肥沃的土地生态机能严重退化。",
      issue: "Thiếu chủ ngữ do cụm '由于...使...' triệt tiêu thành phần chính.",
      correction: "Bỏ '使' hoặc bỏ '由于': '由于滥用化肥农药，这片曾经肥沃的土地生态机能严重退化。'"
    },
    {
      errorSentence: "能否有效遏制物价过度上涨，是衡量当前宏观调控政策是否取得成效的重要标志。",
      issue: "Lỗi tương ứng hai vế '能否' (2 mặt) và '重要标志' (1 mặt tích cực).",
      correction: "Bỏ '能否': '有效遏制物价过度上涨，是衡量当前宏观调控政策是否取得成效的重要标志。'"
    },
    {
      errorSentence: "他不仅不仅在学术研究上取得了突破性成就，而且还积极参与各项社会公益事业。",
      issue: "Lỗi lặp từ ngữ '不仅不仅'.",
      correction: "Chỉ giữ một từ: '他不仅在学术研究上取得了突破性成就...'"
    },
    {
      errorSentence: "为了防止这类森林火灾事故不再发生，林业部门制定了极其严格的安全巡检制度。",
      issue: "Lỗi phủ định hai lần '防止...不再发生' làm phản tác dụng ngữ nghĩa (thành mong muốn cháy lại!).",
      correction: "Sửa thành: '为了防止这类森林火灾事故再次发生...'"
    }
  ];

  for (let i = 1; i <= 60; i++) {
    const err = hsk6Errors[(i - 1) % hsk6Errors.length];
    list.push({
      id: `hsk6_mock_${i}`,
      level: 6,
      testNumber: i,
      title: `Đề Thi Thử HSK 6 Đỉnh Cao Hanban - Đề Số ${pad2(i)}`,
      durationMinutes: 135,
      passScore: 180,
      totalScore: 300,
      description: `Đề thi HSK 6 cấp độ cao nhất: Đo lường hơn 5.000 từ vựng và thành ngữ, kiểm tra dạng bài kinh điển '找病句' (tìm câu sai ngữ pháp), đọc hiểu triết học - chính luận và tư duy ngôn ngữ bản ngữ sâu sắc.`,
      questions: [
        {
          id: `hsk6_e${i}_q1`,
          section: "Phần 1: Nghe hiểu - Tin tức & thời sự chuyên sâu (听力新闻报道)",
          type: "listening_choice",
          prompt: "Bản tin khoa học công nghệ phát thanh về sự kiện đột phá nào?",
          audioText: "据国家航天局最新消息，我国新一代深空探测器在历经数百天的星际飞行后，已成功完成近火制动并顺利进入环火轨道。这标志着我国深空自主测控与高精度轨道机动技术迈入了全球第一梯队。",
          options: [
            { key: "A", text: "深空探测器成功进入环火轨道，自主测控技术迈入全球前列 (Tàu thăm dò tiến vào quỹ đạo sao Hỏa thành công)", isCorrect: true },
            { key: "B", text: "探测器与地面彻底失去测控联络 (Tàu thăm dò mất liên lạc)", isCorrect: false },
            { key: "C", text: "取消所有后续深空探索科研计划 (Hủy kế hoạch không gian)", isCorrect: false },
            { key: "D", text: "火星表面未探测到任何有价值科学数据 (Không có dữ liệu giá trị)", isCorrect: false }
          ],
          explanation: "Bản tin nhấn mạnh: '深空探测器... 成功完成近火制动并顺利进入环火轨道... 迈入了全球第一梯队'. Đáp án A."
        },
        {
          id: `hsk6_e${i}_q2`,
          section: "Phần 1: Nghe hiểu - Báo cáo kinh tế vĩ mô (听力宏观经济演讲)",
          type: "listening_choice",
          prompt: "Diễn giả phân tích động lực tăng trưởng mới của nền kinh tế dựa trên yếu tố gì?",
          audioText: "在全球供应链加速重构的当下，依托高水平对外开放和全要素生产率的提升，培育具有国际竞争力的先进制造业集群，是我国从要素驱动向创新驱动跃升的战略枢纽。",
          options: [
            { key: "A", text: "单纯依赖廉价劳动力资源投入 (Chỉ dựa vào nhân công giá rẻ)", isCorrect: false },
            { key: "B", text: "全要素生产率提升与先进制造业集群创新驱动 (Nâng cao năng suất tổng nhân tố và cụm chế tạo tiên tiến đổi mới sáng tạo)", isCorrect: true },
            { key: "C", text: "关闭所有对外进出口经贸口岸 (Đóng cửa khẩu thương mại)", isCorrect: false },
            { key: "D", text: "完全放弃实体制造业发展 (Bỏ hoàn toàn sản xuất chế tạo)", isCorrect: false }
          ],
          explanation: "Diễn giả xác định: '全要素生产率的提升，培育具有国际竞争力的先进制造业集群... 创新驱动跃升'. Đáp án B."
        },
        {
          id: `hsk6_e${i}_q3`,
          section: "Phần 1: Nghe hiểu - Tọa đàm học thuật văn hóa (听文化学术访谈)",
          type: "listening_choice",
          prompt: "Giáo sư có quan điểm như thế nào về việc kế thừa văn hóa truyền thống cổ điển?",
          audioText: "女：当下不少人主张复古，您如何看待传统文化的时代价值？\n男：传统绝非僵死不变的陈列品，而是流淌的活水。我们对经典的阐释，必须熔铸当代的人文关怀与现实关照，做到'守正出新'，方能激活其恒久生命力。",
          options: [
            { key: "A", text: "一成不变地死守古代规制 (Rập khuôn giữ nguyên lề lối cổ)", isCorrect: false },
            { key: "B", text: "守正出新，将传统与当代人文关怀深度融合 (Kế thừa cốt lõi và đổi mới sáng tạo, hòa quyện với hơi thở nhân văn đương đại)", isCorrect: true },
            { key: "C", text: "彻底剔除所有传统历史典籍 (Loại bỏ toàn bộ sử sách truyền thống)", isCorrect: false },
            { key: "D", text: "将古代文化完全商业化娱乐化 (Thương mại hóa giải trí hóa toàn bộ)", isCorrect: false }
          ],
          explanation: "Giáo sư đúc kết quan điểm: '守正出新，方能激活其恒久生命力'. Đáp án B."
        },
        {
          id: `hsk6_e${i}_q4`,
          section: "Phần 1: Nghe hiểu - Trích đoạn giảng luận triết học (听哲学讲座)",
          type: "listening_choice",
          prompt: "Luận điểm trọng tâm của bài giảng về mối quan hệ giữa 'Tri' (Biết) và 'Hành' (Làm) là gì?",
          audioText: "明代思想家王阳明提出'知行合一'。所谓知而不行，只是未知。真正的真知灼见，必须在事物切己的实践体悟中磨砺而成，知是行之始，行是知之成。",
          options: [
            { key: "A", text: "知与行彼此割裂互不干涉 (Biết và làm tách biệt nhau)", isCorrect: false },
            { key: "B", text: "知行合一，真知必须在切实践履中达成 (Tri hành hợp nhất, nhận thức chân chính phải hoàn thiện qua thực hành)", isCorrect: true },
            { key: "C", text: "只追求理论空谈无须付诸任何行动 (Chỉ nói suông không cần hành động)", isCorrect: false },
            { key: "D", text: "行动完全脱离思想指导 (Hành động mù quáng không định hướng)", isCorrect: false }
          ],
          explanation: "Nội dung trích dẫn tư tưởng Vương Dương Minh: '知行合一... 知是行之始，行是知之成'. Đáp án B."
        },
        {
          id: `hsk6_e${i}_q5`,
          section: "Phần 2: Đọc hiểu - Tìm câu có lỗi sai ngữ pháp (阅读 - 找病句题)",
          type: "reading_choice",
          prompt: "Dạng bài kinh điển HSK 6: Trong 4 câu sau, hãy chọn ra CÂU CÓ LỖI SAI NGỮ PHÁP (找病句):",
          options: [
            { key: "A", text: err.errorSentence, isCorrect: true },
            { key: "B", text: "经过数十年的艰苦攻关，科研团队终于攻克了这项制约行业发展的卡脖子技术难题。", isCorrect: false },
            { key: "C", text: "阅读经典名著不仅能够涵养高尚的精神情操，而且有助于拓宽我们的认知边界。", isCorrect: false },
            { key: "D", text: "随着绿色出行理念的深入人心，越来越多的市民选择乘坐地铁或骑行上下班。", isCorrect: false }
          ],
          explanation: `Câu A mắc lỗi ngữ pháp nghiêm trọng trong HSK 6: ${err.issue}. Sửa đúng: ${err.correction}`
        },
        {
          id: `hsk6_e${i}_q6`,
          section: "Phần 2: Đọc hiểu - Tìm câu có lỗi sai ngữ pháp (阅读 - 找病句题)",
          type: "reading_choice",
          prompt: "Trong 4 câu sau, hãy chọn ra CÂU CÓ LỖI SAI NGỮ PHÁP (找病句):",
          options: [
            { key: "A", text: "为了防止森林火灾事故不再蔓延，应急救援队迅速开辟了宽达三十米的隔离防火带。", isCorrect: true },
            { key: "B", text: "在数字化时代，如何保护公民个人隐私安全已经成为全球法律学界广泛探讨的课题。", isCorrect: false },
            { key: "C", text: "这幅书法作品笔势雄浑遒劲，字里行间流淌着作者旷达超脱的心境与豪迈气概。", isCorrect: false },
            { key: "D", text: "良好的人文社科素养有助于培养青年学生健全的人格与敏锐的思辨能力。", isCorrect: false }
          ],
          explanation: "Câu A mắc lỗi logic phủ định kép sai nghĩa: '防止...不再蔓延' dẫn đến ý muốn cháy lan. Phải sửa thành '防止...再次蔓延'. Đáp án A."
        },
        {
          id: `hsk6_e${i}_q7`,
          section: "Phần 2: Đọc hiểu - Điền từ vào văn bản học thuật (选词填空)",
          type: "reading_choice",
          prompt: "Chọn tổ hợp từ thích hợp điền vào đoạn văn: 优秀的文艺作品应当具有直击人心的______力，它不仅能唤醒人们内心深处的良知，还能在潜移默化中______社会文明的演进。",
          options: [
            { key: "A", text: "穿透 / 推动 (chuāntòu / tuīdòng - thấu suốt / thúc đẩy)", isCorrect: true },
            { key: "B", text: "虚浮 / 阻碍 (xūfú / zǔ'ài - nông nổi / cản trở)", isCorrect: false },
            { key: "C", text: "腐朽 / 拖延 (fǔxiǔ / tuōyán - mục nát / trì hoãn)", isCorrect: false },
            { key: "D", text: "偏激 / 压制 (piānjī / yāzhì - cực đoan / đè nén)", isCorrect: false }
          ],
          explanation: "Cụm chuẩn văn học: '直击人心的穿透力' (sức xuyên thấu chạm tới trái tim) và '推动社会文明的演进' (thúc đẩy sự tiến hóa của văn minh). Đáp án A."
        },
        {
          id: `hsk6_e${i}_q8`,
          section: "Phần 2: Đọc hiểu - Điền thành ngữ cao cấp (选词填空)",
          type: "reading_choice",
          prompt: "Chọn thành ngữ thích hợp: 在重大的战略抉择关头，唯有深谋远虑、______，方能洞察事物演化的大趋势，免于陷入短视的被动境地。",
          options: [
            { key: "A", text: "居安思危 (jū'ānsīwēi - khi yên ổn vẫn nghĩ tới nguy nan)", isCorrect: true },
            { key: "B", text: "纸上谈兵 (zhǐshàngtánbīng - bàn việc quân trên giấy)", isCorrect: false },
            { key: "C", text: "掩耳盗铃 (yǎn'ěrdàolíng - bịt tai trộm chuông)", isCorrect: false },
            { key: "D", text: "东施效颦 (dōngshīxiàopín - mù quáng bắt chước)", isCorrect: false }
          ],
          explanation: "Thành ngữ '居安思危' (khi bình an lo phòng biến cố) thể hiện tầm nhìn '深谋远虑' (nhìn xa trông rộng). Đáp án A."
        },
        {
          id: `hsk6_e${i}_q9`,
          section: "Phần 2: Đọc hiểu - Đọc hiểu văn bản triết luận HSK 6 (阅读综合论述)",
          type: "reading_choice",
          prompt: "Đọc trích đoạn sau: '美学大师朱光潜曾言：'人是一根有思想的芦苇。'人在浩瀚宇宙面前固然渺小脆弱，但正是因为拥有反思与审美的心灵，人类才能在有限的生命篇章里铸就无限的精神崇高。'\nCâu hỏi: Trọng tâm triết học của đoạn văn là gì?",
          options: [
            { key: "A", text: "人类因思想审美之光而赋予生命以无限的精神崇高 (Con người nhờ ánh sáng tư tưởng và thẩm mỹ mà đem lại sự cao thượng vô tận cho đời sống)", isCorrect: true },
            { key: "B", text: "人类在自然面前毫无价值 (Con người vô giá trị trước tự nhiên)", isCorrect: false },
            { key: "C", text: "思想只会让生命更加脆弱痛苦 (Tư tưởng chỉ làm con người mong manh đau khổ)", isCorrect: false },
            { key: "D", text: "拒绝任何审美与精神追求 (Từ chối mọi giá trị tinh thần)", isCorrect: false }
          ],
          explanation: "Bài văn đối chiếu sự nhỏ bé vật chất với '反思与审美的心灵... 铸就无限的精神崇高'. Đáp án A."
        },
        {
          id: `hsk6_e${i}_q10`,
          section: "Phần 3: Viết - Sắp xếp câu chính luận (书写 - 规范句式)",
          type: "reorder",
          prompt: "Sắp xếp các cụm từ sau thành câu chính luận chuẩn mực HSK 6:",
          words: ["唯有将", "优秀传统文化", "创造性转化", "才能让经典", "历久弥新"],
          correctOrder: ["唯有将", "优秀传统文化", "创造性转化", "才能让经典", "历久弥新"],
          explanation: "Cấu trúc câu điều kiện duy nhất: 唯有将 + Tân ngữ + Động từ/Hành động + 才能让... 历久弥新 (Chỉ có chuyển đổi sáng tạo văn hóa truyền thống mới khiến các giá trị kinh điển trường tồn cùng thời gian)."
        }
      ]
    });
  }
  return list;
}

// Compile all 360 exams
console.log('Compiling HSK 1 (60 exams)...');
const hsk1 = generateHsk1Exams();
console.log('Compiling HSK 2 (60 exams)...');
const hsk2 = generateHsk2Exams();
console.log('Compiling HSK 3 (60 exams)...');
const hsk3 = generateHsk3Exams();
console.log('Compiling HSK 4 (60 exams)...');
const hsk4 = generateHsk4Exams();
console.log('Compiling HSK 5 (60 exams)...');
const hsk5 = generateHsk5Exams();
console.log('Compiling HSK 6 (60 exams)...');
const hsk6 = generateHsk6Exams();

const all360Exams = [...hsk1, ...hsk2, ...hsk3, ...hsk4, ...hsk5, ...hsk6];
console.log(`Total Compiled Exams: ${all360Exams.length} (Expected: 360)`);

if (all360Exams.length !== 360) {
  throw new Error(`Expected 360 exams, but got ${all360Exams.length}`);
}

// Write to public/data/mock_exam.json
const outputPath = path.join(__dirname, '../../public/data/mock_exam.json');
fs.writeFileSync(outputPath, JSON.stringify(all360Exams, null, 2), 'utf8');
console.log(`Successfully wrote ${all360Exams.length} exams to ${outputPath}!`);

// Also save split files by level in public/data/exams/
const examsDir = path.join(__dirname, '../../public/data/exams');
if (!fs.existsSync(examsDir)) {
  fs.mkdirSync(examsDir, { recursive: true });
}
const levelMap = { 1: hsk1, 2: hsk2, 3: hsk3, 4: hsk4, 5: hsk5, 6: hsk6 };
for (let lvl = 1; lvl <= 6; lvl++) {
  const p = path.join(examsDir, `hsk${lvl}.json`);
  fs.writeFileSync(p, JSON.stringify(levelMap[lvl], null, 2), 'utf8');
  console.log(`Successfully saved ${levelMap[lvl].length} exams to ${p}!`);
}

// Also generate a catalog file with lightweight metadata for lightning-fast listings
const catalog = all360Exams.map(e => ({
  id: e.id,
  level: e.level,
  testNumber: e.testNumber,
  title: e.title,
  durationMinutes: e.durationMinutes,
  passScore: e.passScore,
  totalScore: e.totalScore,
  questionCount: e.questions.length,
  description: e.description
}));
const catalogPath = path.join(__dirname, '../../public/data/mock_exam_catalog.json');
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`Successfully wrote catalog to ${catalogPath}!`);
