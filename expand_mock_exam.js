const fs = require('fs');
const path = require('path');

const existingPath = path.join(__dirname, 'data', 'mock_exam.json');
const current = JSON.parse(fs.readFileSync(existingPath, 'utf8'));

// HSK 4 Mock Exam
const hsk4Exam = {
  id: "hsk4_mock_1",
  level: 4,
  title: "Đề Thi Thử HSK 4 Chuẩn Mới - Đề Số 01",
  durationMinutes: 35,
  passScore: 180,
  totalScore: 300,
  description: "Bộ đề khảo thí HSK 4 toàn diện: Kiểm tra khả năng nghe hiểu đàm thoại đời sống, đọc hiểu phân tích ngữ nghĩa và sắp xếp trật tự câu văn học.",
  questions: [
    {
      id: "hsk4_q1",
      type: "reading_choice",
      section: "Phần 1: Điền từ vào chỗ trống (选词填空)",
      prompt: "Chọn từ thích hợp nhất điền vào câu: 随着现代科学技术的飞速发展，人们的生活节奏也变得越来越______。",
      options: [
        { key: "A", text: "紧迫 (jǐnpò - cấp bách)", isCorrect: false },
        { key: "B", text: "紧张 (jǐnzhāng - căng thẳng, bận rộn)", isCorrect: true },
        { key: "C", text: "严格 (yángé - nghiêm ngặt)", isCorrect: false },
        { key: "D", text: "坚强 (jiānqiáng - kiên cường)", isCorrect: false }
      ],
      explanation: "Cụm cố định: '生活节奏紧张' (nhịp sống căng thẳng, gấp gáp). Đáp án đúng là B."
    },
    {
      id: "hsk4_q2",
      type: "reading_choice",
      section: "Phần 1: Điền từ vào chỗ trống (选词填空)",
      prompt: "Chọn liên từ thích hợp: ______今天外面风很大，天气很冷，他______坚持去操场跑步锻炼。",
      options: [
        { key: "A", text: "虽然...但是... (Tuy... nhưng...)", isCorrect: false },
        { key: "B", text: "尽管...还是... (Mặc dù... vẫn cứ...)", isCorrect: true },
        { key: "C", text: "因为...所以... (Vì... nên...)", isCorrect: false },
        { key: "D", text: "只有...才... (Chỉ có... mới...)", isCorrect: false }
      ],
      explanation: "Cấu trúc nhượng bộ nhấn mạnh ý chí bền bỉ: '尽管...还是...' (Mặc dù... vẫn cứ...). Đáp án đúng là B."
    },
    {
      id: "hsk4_q3",
      type: "reading_choice",
      section: "Phần 2: Đọc hiểu phân tích (阅读理解)",
      prompt: "Đọc đoạn văn sau: '微笑是世界上最通用的语言。遇到困难时，微笑给你勇气；面对误会时，微笑化解冰霜。' —— Đoạn văn chủ yếu nhấn mạnh điều gì?",
      options: [
        { key: "A", text: "Học nhiều ngoại ngữ rất quan trọng", isCorrect: false },
        { key: "B", text: "Sức mạnh to lớn và tác dụng tích cực của nụ cười trong cuộc sống", isCorrect: true },
        { key: "C", text: "Cách giải quyết tranh chấp trong thương mại", isCorrect: false },
        { key: "D", text: "Mùa đông thời tiết rất lạnh giá", isCorrect: false }
      ],
      explanation: "Đoạn văn ca ngợi sức mạnh của nụ cười (微笑给你勇气, 微笑化解冰霜). Đáp án đúng là B."
    },
    {
      id: "hsk4_q4",
      type: "reorder",
      section: "Phần 3: Sắp xếp trật tự câu (连词成句)",
      prompt: "Sắp xếp các cụm từ sau thành câu chuẩn ngữ pháp HSK 4:",
      words: ["把", "洗干净的", "挂在阳台上", "衣服", "妈妈"],
      correctOrder: ["妈妈", "把", "洗干净的", "衣服", "挂在阳台上"],
      fullSentence: "妈妈把洗干净的衣服挂在阳台上。",
      pinyin: "Māma bǎ xǐ gānjìng de yīfu guà zài yángtái shàng.",
      translation: "Mẹ đem quần áo đã giặt sạch phơi ở ban công.",
      explanation: "Cấu trúc câu chữ 把: Chủ ngữ (妈妈) + 把 + Tân ngữ (洗干净的衣服) + Động từ (挂) + Bổ ngữ giới từ nơi chốn (在阳台上)."
    },
    {
      id: "hsk4_q5",
      type: "reorder",
      section: "Phần 3: Sắp xếp trật tự câu (连词成句)",
      prompt: "Sắp xếp các cụm từ sau thành câu chuẩn ngữ pháp HSK 4:",
      words: ["已经", "中国高铁的", "超过了", "四万公里", "运营里程"],
      correctOrder: ["中国高铁的", "运营里程", "已经", "超过了", "四万公里"],
      fullSentence: "中国高铁的运营里程已经超过了四万公里。",
      pinyin: "Zhōngguó gāotiě de yùnyíng lǐchéng yǐjīng chāoguò le sì wàn gōnglǐ.",
      translation: "Chiều dài vận hành của tàu cao tốc Trung Quốc đã vượt qua 40.000 km.",
      explanation: "Cụm chủ ngữ: 中国高铁的运营里程 + Phó từ: 已经 + Động từ: 超过了 + Cụm tân ngữ số lượng: 四万公里."
    }
  ]
};

// HSK 5 Mock Exam
const hsk5Exam = {
  id: "hsk5_mock_1",
  level: 5,
  title: "Đề Thi Thử HSK 5 Cao Cấp - Đề Số 01",
  durationMinutes: 45,
  passScore: 180,
  totalScore: 300,
  description: "Bộ đề khảo thí HSK 5 nâng cao: Kiểm tra từ vựng trừu tượng, thành ngữ điển cố, phân biệt bệnh cú và đọc hiểu chính luận thời sự.",
  questions: [
    {
      id: "hsk5_q1",
      type: "reading_choice",
      section: "Phần 1: Thành ngữ & Từ vựng cao cấp (成语与高级词汇)",
      prompt: "Chọn thành ngữ thích hợp: 他在画画之前早已经做到了______，所以一下笔就能画出栩栩如生的竹子。",
      options: [
        { key: "A", text: "胸有成竹 (xiōng yǒu chéng zhú - tự tin nắm chắc)", isCorrect: true },
        { key: "B", text: "画蛇添足 (huà shé tiān zú - làm chuyện thừa thãi)", isCorrect: false },
        { key: "C", text: "守株待兔 (shǒu zhū dài tù - há miệng chờ sung)", isCorrect: false },
        { key: "D", text: "半途而废 (bàn tú ér fèi - bỏ dở giữa chừng)", isCorrect: false }
      ],
      explanation: "Thành ngữ '胸有成竹' (trong ngực có sẵn hình bóng cây tre) ca ngợi sự chuẩn bị chu đáo và tự tin nắm chắc phần thắng. Đáp án đúng là A."
    },
    {
      id: "hsk5_q2",
      type: "reading_choice",
      section: "Phần 1: Thành ngữ & Từ vựng cao cấp (成语与高级词汇)",
      prompt: "Điền từ thích hợp: 科学技术是第一生产力，我们要不断激发全社会的科技______潜能。",
      options: [
        { key: "A", text: "创造 (chuàngzào - sáng tạo cụ thể)", isCorrect: false },
        { key: "B", text: "创新 (chuàngxīn - đổi mới sáng tạo)", isCorrect: true },
        { key: "C", text: "创作 (chuàngzuò - sáng tác tác phẩm)", isCorrect: false },
        { key: "D", text: "制作 (zhìzuò - chế tạo đồ vật)", isCorrect: false }
      ],
      explanation: "Cụm từ chuyên môn trong văn bản chính luận: '科技创新' (đổi mới sáng tạo khoa học công nghệ). Đáp án đúng là B."
    },
    {
      id: "hsk5_q3",
      type: "reading_choice",
      section: "Phần 2: Phân tích bệnh cú (病句辨析)",
      prompt: "Câu nào dưới đây là câu SAI NGỮ PHÁP (Có lỗi cú pháp)?",
      options: [
        { key: "A", text: "通过这次社会实践，使我学到了很多书本上学不到的知识。", isCorrect: true },
        { key: "B", text: "经过长期的刻苦训练，他的汉语听说水平有了显著的提高。", isCorrect: false },
        { key: "C", text: "只有坚持不懈地努力，我们才能够实现自己的人生理想。", isCorrect: false },
        { key: "D", text: "绿水青山就是金山银山，生态文明建设至关重要。", isCorrect: false }
      ],
      explanation: "Câu A là lỗi thiếu chủ ngữ kinh điển trong đề thi HSK 5: Dùng cả '通过...' và '使...' ở đầu vế khiến câu bị khuyết chủ ngữ. Cần bỏ chữ '使'."
    },
    {
      id: "hsk5_q4",
      type: "reading_choice",
      section: "Phần 3: Đọc hiểu văn hóa triết học (哲学文化阅读)",
      prompt: "Đọc đoạn văn trích từ Lão Tử: '合抱之木，生于毫末；九层之台，起于累土；千里之行，始于足下。' —— Tư tưởng cốt lõi của câu nói này là gì?",
      options: [
        { key: "A", text: "Cần xây nhà thật cao và trồng thật nhiều cây xanh", isCorrect: false },
        { key: "B", text: "Mọi thành công vĩ đại đều phải bắt đầu từ những việc nhỏ bé và từng bước chân kiên trì", isCorrect: true },
        { key: "C", text: "Đi lại nghìn dặm bằng đôi chân rất mệt mỏi", isCorrect: false },
        { key: "D", text: "Nên bỏ qua các chi tiết nhỏ để làm việc lớn", isCorrect: false }
      ],
      explanation: "Triết lý của Lão Tử: Cây to ôm cả vòng tay mọc từ mầm non bé tí; đài cao chín tầng đắp từ từng nắm đất; hành trình ngàn dặm bắt đầu từ một bước chân. Đáp án đúng là B."
    }
  ]
};

const allExams = [...current, hsk4Exam, hsk5Exam];
fs.writeFileSync(existingPath, JSON.stringify(allExams, null, 2), 'utf8');
console.log(`Đã xuất sắc nâng cấp Hệ Thống Đề Thi HSK lên ${allExams.length} Cấp Độ Chuẩn HSK 1 - 5 tại ${existingPath}`);
