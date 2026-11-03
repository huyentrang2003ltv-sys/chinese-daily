const fs = require('fs');
const path = require('path');

const srcDir = process.env.HSK_SOURCE_DIR || path.join(__dirname, 'source');
const outDir = path.join(__dirname, '..', '..', 'public', 'data');

console.log('--- Loading Source HSK Data ---');
const hsk1 = JSON.parse(fs.readFileSync(path.join(srcDir, 'hsk1_all.json'), 'utf8'));
const hsk2 = JSON.parse(fs.readFileSync(path.join(srcDir, 'hsk2_all.json'), 'utf8'));
const hsk3 = JSON.parse(fs.readFileSync(path.join(srcDir, 'hsk3_all.json'), 'utf8'));

// 1. Build Dictionary & Lessons
const wordMap = new Map();
const allLessons = [];

[...hsk1, ...hsk2, ...hsk3].forEach(item => {
  allLessons.push({
    id: item.id,
    level: item.level,
    lesson: item.lesson,
    vietnamese: item.vietnamese,
    hanzi: item.hanzi,
    pinyin: item.pinyin,
    explanation: item.explanation,
    words: item.words || []
  });

  if (item.words) {
    item.words.forEach(w => {
      if (!wordMap.has(w.title)) {
        wordMap.set(w.title, {
          title: w.title,
          pinyin: w.pinyin,
          meaning: w.meaning,
          pos: w.pos,
          level: item.level,
          lesson: item.lesson,
          exampleSentence: item.hanzi,
          examplePinyin: item.pinyin,
          exampleMeaning: item.vietnamese
        });
      }
    });
  }
});

const dictionary = Array.from(wordMap.values());
console.log(`Generated ${dictionary.length} dictionary entries.`);

// 2. Comprehensive Etymology (Chiết tự & Cây họ hàng 25+ chữ cốt lõi)
const etymologyData = [
  {
    hanzi: "想",
    pinyin: "xiǎng",
    hanviet: "Tưởng",
    meaning: "Nghĩ, nhớ, muốn, tưởng tượng",
    level: 1,
    strokeCount: 13,
    radicals: [
      { char: "木", name: "Mộc", meaning: "Cây cối" },
      { char: "目", name: "Mục", meaning: "Mắt" },
      { char: "心", name: "Tâm", meaning: "Trái tim, lòng dạ" }
    ],
    etymologyStory: "Chữ 想 cấu tạo gồm phần trên là 相 (Tương: mắt 目 chăm chú nhìn lên cây 木 để quan sát kỹ lưỡng) và phần dưới là Tâm 心 (trái tim). Ý nghĩa chiết tự: Dùng mắt quan sát sự vật rồi ghi nhớ sâu đậm vào tận đáy lòng để ngày đêm trăn trở, suy ngẫm và nhớ nhung.",
    memoryTip: "Mắt (目) nhìn cây (木) thành Tương (相), khắc Tương vào tim (心) thành nỗi nhớ và suy tưởng (想).",
    family: [
      { char: "木", pinyin: "mù", meaning: "Cây cối (gốc tượng hình nguyên thủy)" },
      { char: "相", pinyin: "xiāng / xiàng", meaning: "Tương hỗ, quan sát, diện mạo (gốc âm & ý)" },
      { char: "箱", pinyin: "xiāng", meaning: "Cái hòm, vali (thêm bộ Trúc 竹 trên 相)" },
      { char: "霜", pinyin: "shuāng", meaning: "Sương mù, sương muối (thêm bộ Vũ 雨 trên 相)" },
      { char: "湘", pinyin: "xiāng", meaning: "Sông Tương (thêm bộ Thủy 氵bên 相)" }
    ],
    commonWords: ["想法 (ý nghĩ, quan điểm)", "想念 (nhớ nhung)", "理想 (lý tưởng)", "感想 (cảm tưởng)", "意想不到 (không ngờ tới)"],
    example: { hanzi: "我想去中国旅游。", pinyin: "Wǒ xiǎng qù Zhōngguó lǚyóu.", vi: "Tôi muốn đi du lịch Trung Quốc." }
  },
  {
    hanzi: "休",
    pinyin: "xiū",
    hanviet: "Hưu",
    meaning: "Nghỉ ngơi, ngừng lại, hưu trí",
    level: 1,
    strokeCount: 6,
    radicals: [
      { char: "亻", name: "Nhân đứng", meaning: "Con người" },
      { char: "木", name: "Mộc", meaning: "Gốc cây" }
    ],
    etymologyStory: "Chữ hội ý kinh điển bậc nhất trong Hán tự: Một người (亻) đang tựa lưng vào bóng mát của một gốc cây (木) sau những giờ lao động vất vả trên đồng ruộng để lấy lại sinh lực.",
    memoryTip: "Người tựa lưng vào thân cây là đang nghỉ ngơi dưỡng sức (Hưu tức).",
    family: [
      { char: "体", pinyin: "tǐ", meaning: "Thân thể (Người 亻 đứng cạnh rễ cây 本)" },
      { char: "保", pinyin: "bǎo", meaning: "Bảo bọc (Người cõng đứa trẻ trên lưng)" },
      { char: "本", pinyin: "běn", meaning: "Gốc rễ (Gốc cây thêm nét gạch ngang)" }
    ],
    commonWords: ["休息 (nghỉ ngơi)", "退休 (nghỉ hưu)", "休假 (nghỉ phép)", "无休 (không ngừng nghỉ)"],
    example: { hanzi: "太累了，我们休息一下吧。", pinyin: "Tài lèi le, wǒmen xiūxi yíxià ba.", vi: "Mệt quá rồi, chúng ta nghỉ ngơi một lát đi." }
  },
  {
    hanzi: "明",
    pinyin: "míng",
    hanviet: "Minh",
    meaning: "Sáng sủa, thông minh, ngày mai, hiểu rõ",
    level: 1,
    strokeCount: 8,
    radicals: [
      { char: "日", name: "Nhật", meaning: "Mặt trời (nguồn sáng dương)" },
      { char: "月", name: "Nguyệt", meaning: "Mặt trăng (nguồn sáng âm)" }
    ],
    etymologyStory: "Hai thực thể chiếu sáng vĩ đại nhất của bầu trời hội tụ: Nhật (日 - Mặt trời ban ngày) kết hợp cùng Nguyệt (月 - Mặt trăng ban đêm) tạo nên nguồn quang minh vĩnh cửu, soi tỏ mọi sự việc rõ ràng không còn mờ mịt.",
    memoryTip: "Có cả ánh dương và ánh trăng thì đất trời sáng rực, lòng người sáng suốt (Minh bạch).",
    family: [
      { char: "盟", pinyin: "méng", meaning: "Đồng minh (Minh 明 thề nguyện trên bát máu 皿)" },
      { char: "萌", pinyin: "méng", meaning: "Nảy mầm (Cỏ non 艹 đón ánh sáng 明)" },
      { char: "曌", pinyin: "zhào", meaning: "Chiếu sáng (Nhật Nguyệt trên không Không)" }
    ],
    commonWords: ["明天 (ngày mai)", "明白 (hiểu rõ)", "聪明 (thông minh)", "光明 (quang minh, tương lai tươi sáng)"],
    example: { hanzi: "你明白我的意思了吗？", pinyin: "Nǐ míngbai wǒ de yìsi le ma?", vi: "Bạn đã hiểu rõ ý tôi chưa?" }
  },
  {
    hanzi: "森",
    pinyin: "sēn",
    hanviet: "Sâm",
    meaning: "Rừng rậm rạp, um tùm, âm u",
    level: 2,
    strokeCount: 12,
    radicals: [
      { char: "木", name: "Mộc", meaning: "Một cái cây" },
      { char: "林", name: "Lâm", meaning: "Hai cây = Rừng thưa" },
      { char: "森", name: "Sâm", meaning: "Ba cây = Rừng rậm bạt ngàn" }
    ],
    etymologyStory: "Quy luật hội ý số lượng lũy tiến: 1 cây là Mộc 木. 2 cây cạnh nhau là Lâm 林 (khu rừng nhỏ). 3 cây xếp tầng lên nhau là Sâm 森 (rừng rậm nguyên sinh rợp bóng cây cối che khuất cả bầu trời).",
    memoryTip: "Một cây là Mộc, hai cây thành Lâm, ba cây chụm lại thành Sâm rậm rạp.",
    family: [
      { char: "木", pinyin: "mù", meaning: "Cây đơn lẻ" },
      { char: "林", pinyin: "lín", meaning: "Rừng nhỏ" },
      { char: "森", pinyin: "sēn", meaning: "Rừng già rậm rạp" },
      { char: "淼", pinyin: "miǎo", meaning: "Nước mênh mông (3 chữ Thủy 水)" },
      { char: "鑫", pinyin: "xīn", meaning: "Hưng thịnh tiền tài (3 chữ Kim 金)" }
    ],
    commonWords: ["森林 (rừng rậm)", "阴森 (u ám, lạnh lẽo)", "森林公园 (công viên rừng)"],
    example: { hanzi: "森林里有很多珍贵的植物。", pinyin: "Sēnlín lǐ yǒu hěn duō zhēnguì de zhíwù.", vi: "Trong rừng rậm có rất nhiều loài thực vật quý hiếm." }
  },
  {
    hanzi: "问",
    pinyin: "wèn",
    hanviet: "Vấn",
    meaning: "Hỏi, thăm hỏi, chất vấn",
    level: 1,
    strokeCount: 6,
    radicals: [
      { char: "门", name: "Môn", meaning: "Cánh cổng, cửa" },
      { char: "口", name: "Khẩu", meaning: "Cái miệng" }
    ],
    etymologyStory: "Người đi đường đến trước cổng nhà (门), dùng miệng (口) cất tiếng chào và hỏi thăm người bên trong.",
    memoryTip: "Miệng (口) ghé vào cổng (门) để cất tiếng hỏi (Vấn 问). Phân biệt với Văn 闻: Ghé tai (耳) vào cửa để Lắng Nghe.",
    family: [
      { char: "闻", pinyin: "wén", meaning: "Nghe thấy, ngửi (Ghép tai 耳 vào cửa 门)" },
      { char: "闷", pinyin: "mèn", meaning: "Bực bội (Trái tim 心 bị nhốt trong cửa 门)" },
      { char: "闪", pinyin: "shǎn", meaning: "Lóe sáng, né tránh (Người 人 lấp ló ở cổng 门)" },
      { char: "闭", pinyin: "bì", meaning: "Đóng cửa (Cây gậy 才 cài then cửa 门)" }
    ],
    commonWords: ["问题 (vấn đề, câu hỏi)", "请问 (xin hỏi lịch sự)", "问好 (hỏi thăm)", "访问 (thăm viếng)"],
    example: { hanzi: "请问，去高铁站怎么走？", pinyin: "Qǐngwèn, qù gāotiě zhàn zěnme zǒu?", vi: "Xin hỏi, đi đến ga tàu cao tốc đi như thế nào?" }
  },
  {
    hanzi: "忍",
    pinyin: "rěn",
    hanviet: "Nhẫn",
    meaning: "Chịu đựng, nhẫn nại, kiềm chế",
    level: 3,
    strokeCount: 7,
    radicals: [
      { char: "刃", name: "Nhận", meaning: "Lưỡi dao sắc bén" },
      { char: "心", name: "Tâm", meaning: "Trái tim" }
    ],
    etymologyStory: "Lưỡi dao sắc ngọt (刃) kề sát ngay trên trái tim (心). Dẫu có đau đớn đến thắt lòng cũng phải giữ cho tâm trí kiên định, không được manh động bộc phát.",
    memoryTip: "Dao kề trên ngực áo mà lòng vẫn an tĩnh kiên cường, đó là Nhẫn (忍).",
    family: [
      { char: "刃", pinyin: "rèn", meaning: "Lưỡi dao (bộ Đao 刀 có thêm chấm chỉ vị trí lưỡi)" },
      { char: "韧", pinyin: "rèn", meaning: "Bền bỉ, dai dẳng (thêm bộ Vi 韦 da thuộc)" },
      { char: "志", pinyin: "zhì", meaning: "Ý chí (Sĩ phu 士 mang chí trong tim 心)" }
    ],
    commonWords: ["忍耐 (nhẫn nại)", "残忍 (tàn nhẫn)", "容忍 (khoan dung nhẫn nại)", "忍无可忍 (không thể nhẫn nhịn thêm)"],
    example: { hanzi: "做大事的人一定要学会忍耐。", pinyin: "Zuò dàshì de rén yídìng yào xuéhuì rěnnài.", vi: "Người làm việc lớn nhất định phải học được đức tính nhẫn nại." }
  },
  {
    hanzi: "好",
    pinyin: "hǎo",
    hanviet: "Hảo",
    meaning: "Tốt, đẹp, xong xuôi, yêu thích",
    level: 1,
    strokeCount: 6,
    radicals: [
      { char: "女", name: "Nữ", meaning: "Người phụ nữ, người mẹ" },
      { char: "子", name: "Tử", meaning: "Đứa con, con thơ" }
    ],
    etymologyStory: "Thời cổ đại, hình ảnh thiêng liêng và hạnh phúc nhất chính là người mẹ (女) âu yếm bế đứa con nhỏ (子) trong vòng tay. Sự gắn kết mẫu tử là khởi nguồn của mọi điều tốt lành, thiện lương nhất trên đời.",
    memoryTip: "Mẹ (女) có con (子) bên cạnh là cuộc đời viên mãn tốt lành (Hảo).",
    family: [
      { char: "如", pinyin: "rú", meaning: "Như, giống như (Người nữ thuận theo lẽ phải 口)" },
      { char: "安", pinyin: "ān", meaning: "An toàn, bình an (Người phụ nữ dưới mái nhà 宀)" },
      { char: "妥", pinyin: "tuǒ", meaning: "Thỏa đáng (Bàn tay nâng niu người phụ nữ)" }
    ],
    commonWords: ["你好 (xin chào)", "好吃 (ngon miệng)", "好看 (đẹp mắt)", "好处 (lợi ích, điểm tốt)"],
    example: { hanzi: "汉语是一门很有魅力的语言。", pinyin: "Hànyǔ shì yì mén hěn yǒu mèilì de yǔyán.", vi: "Tiếng Trung là một ngôn ngữ rất có sức hút." }
  },
  {
    hanzi: "看",
    pinyin: "kàn",
    hanviet: "Khán",
    meaning: "Nhìn, xem, đọc, thăm khám, chăm nom",
    level: 1,
    strokeCount: 9,
    radicals: [
      { char: "手 (龵)", name: "Thủ", meaning: "Bàn tay" },
      { char: "目", name: "Mục", meaning: "Đôi mắt" }
    ],
    etymologyStory: "Hình ảnh một người đưa bàn tay (手) lên trán che bớt ánh nắng chói chang phía trên đôi mắt (目) để phóng tầm mắt nhìn thật xa ra phía chân trời.",
    memoryTip: "Đưa tay (手) che mắt (目) để phóng tầm mắt nhìn xa trông rộng (Khán).",
    family: [
      { char: "着", pinyin: "zhe / zháo", meaning: "Trợ từ động thái / cháy, trúng" },
      { char: "见", pinyin: "jiàn", meaning: "Trông thấy (đôi mắt mở rộng hội ý)" },
      { char: "视", pinyin: "shì", meaning: "Thị giác, quan sát (thêm bộ Thị 礻)" }
    ],
    commonWords: ["看书 (đọc sách)", "看见 (nhìn thấy)", "看法 (quan điểm)", "看病 (khám bệnh)", "照看 (chăm sóc)"],
    example: { hanzi: "他正在书房里看书呢。", pinyin: "Tā zhèngzài shūfáng lǐ kànshū ne.", vi: "Anh ấy đang đọc sách trong phòng làm việc." }
  },
  {
    hanzi: "家",
    pinyin: "jiā",
    hanviet: "Gia",
    meaning: "Nhà, mái ấm gia đình, chuyên gia",
    level: 1,
    strokeCount: 10,
    radicals: [
      { char: "宀", name: "Miên", meaning: "Mái nhà che chở" },
      { char: "豕", name: "Thỉ", meaning: "Con heo, lợn" }
    ],
    etymologyStory: "Thời xã hội nguyên thủy nông nghiệp, con người thuần hóa lợn (豕) và nuôi nhốt dưới mái nhà sàn (宀). Có chỗ ở vững chắc tránh mưa thú dữ và có nguồn gia súc dự trữ thực phẩm chính là định nghĩa đầu tiên về một 'Gia đình'.",
    memoryTip: "Dưới mái nhà (宀) có đàn heo (豕) no đủ, đó chính là Mái ấm Gia đình (家).",
    family: [
      { char: "安", pinyin: "ān", meaning: "Bình an (Mái nhà có người phụ nữ)" },
      { char: "定", pinyin: "dìng", meaning: "Định vị (Dưới mái nhà bước đi chuẩn mực 正)" },
      { char: "宝", pinyin: "bǎo", meaning: "Bảo bối (Dưới mái nhà có ngọc bích 玉)" }
    ],
    commonWords: ["大家 (mọi người)", "回家 (về nhà)", "国家 (quốc gia)", "家人 (người nhà)", "专家 (chuyên gia)"],
    example: { hanzi: "欢迎随时来我家喝茶！", pinyin: "Huānyíng suíshí lái wǒ jiā hēchá!", vi: "Hoan nghênh bạn bất cứ lúc nào cũng ghé nhà tôi uống trà!" }
  },
  {
    hanzi: "采",
    pinyin: "cǎi",
    hanviet: "Thải",
    meaning: "Hái lượm, thu thập, màu sắc, phong thái",
    level: 2,
    strokeCount: 8,
    radicals: [
      { char: "爫", name: "Trảo", meaning: "Bàn tay năm ngón xòe xuống" },
      { char: "木", name: "Mộc", meaning: "Cây cối, hoa quả" }
    ],
    etymologyStory: "Hình ảnh một bàn tay (爫) đang vươn lên tán cây (木) để hái những chùm quả mọng và lá thuốc quý trên cành.",
    memoryTip: "Bàn tay (爫) đưa lên cây (木) để hái quả thu lượm (Thải 采).",
    family: [
      { char: "彩", pinyin: "cǎi", meaning: "Sắc màu rực rỡ (thêm 3 nét phẩy Sam 彡 dải lụa)" },
      { char: "菜", pinyin: "cài", meaning: "Rau cỏ, món ăn (thêm bộ Thảo 艹 trên 采)" },
      { char: "踩", pinyin: "cǎi", meaning: "Dẫm đạp (thêm bộ Túc ⻊bàn chân)" }
    ],
    commonWords: ["采用 (áp dụng)", "采访 (phỏng vấn)", "风采 (phong thái)", "光彩 (rạng rỡ)"],
    example: { hanzi: "蜜蜂正在花丛中采蜜。", pinyin: "Mìfēng zhèngzài huācóng zhōng cǎimì.", vi: "Ong đang chăm chỉ hút mật trong khóm hoa." }
  },
  {
    hanzi: "苗",
    pinyin: "miáo",
    hanviet: "Miêu",
    meaning: "Mầm non, cây mạ, con cháu",
    level: 2,
    strokeCount: 8,
    radicals: [
      { char: "艹", name: "Thảo", meaning: "Cỏ cây, thực vật" },
      { char: "田", name: "Điền", meaning: "Thửa ruộng" }
    ],
    etymologyStory: "Những nhánh mạ non (艹) vừa mới đâm chồi xanh mướt trên mặt thửa ruộng (田) màu mỡ phì nhiêu.",
    memoryTip: "Cỏ xanh (艹) mọc trên thửa ruộng (田) chính là mầm cây mạ non (Miêu 苗).",
    family: [
      { char: "描", pinyin: "miáo", meaning: "Miêu tả, đồ nét (Bàn tay 扌 vẽ theo dáng cây mầm 苗)" },
      { char: "猫", pinyin: "māo", meaning: "Con mèo (Loài thú 犭 hay bắt chuột bảo vệ ruộng mạ 苗)" }
    ],
    commonWords: ["树苗 (cây non)", "禾苗 (cây mạ)", "疫苗 (vắc-xin)", "火苗 (ngọn lửa nhỏ)"],
    example: { hanzi: "田里的禾苗长得真好。", pinyin: "Tián lǐ de hémiáo zhǎng de zhēn hǎo.", vi: "Những khóm mạ ngoài đồng lớn lên thật tươi tốt." }
  },
  {
    hanzi: "尘",
    pinyin: "chén",
    hanviet: "Trần",
    meaning: "Bụi bặm, trần thế, dơ bẩn",
    level: 2,
    strokeCount: 6,
    radicals: [
      { char: "小", name: "Tiểu", meaning: "Nhỏ bé" },
      { char: "土", name: "Thổ", meaning: "Đất đai, hạt cát" }
    ],
    etymologyStory: "Quy luật hội ý tinh tế: Những hạt đất cát (土) khi vỡ vụn thành kích thước siêu nhỏ (小) sẽ bay lơ lửng trong không khí tạo thành hạt bụi.",
    memoryTip: "Hạt đất (土) nhỏ li ti (小) chính là hạt bụi trần gian (Trần 尘).",
    family: [
      { char: "尖", pinyin: "jiān", meaning: "Đầu nhọn (Trên nhỏ 小 dưới to 大)" },
      { char: "劣", pinyin: "liè", meaning: "Yếu kém (Ít Thiếu 少 sức Lực 力)" }
    ],
    commonWords: ["灰尘 (bụi bặm)", "红尘 (hồng trần)", "风尘 (bụi gió đời người)"],
    example: { hanzi: "桌子上落了一层灰尘。", pinyin: "Zhuōzi shàng luò le yì céng huīchén.", vi: "Trên mặt bàn đã phủ một lớp bụi mỏng." }
  },
  {
    hanzi: "男",
    pinyin: "nán",
    hanviet: "Nam",
    meaning: "Đàn ông, nam giới, con trai",
    level: 1,
    strokeCount: 7,
    radicals: [
      { char: "田", name: "Điền", meaning: "Thửa ruộng lúa" },
      { char: "力", name: "Lực", meaning: "Sức mạnh, cái cày" }
    ],
    etymologyStory: "Trong xã hội nông nghiệp cổ, người dùng toàn bộ sức mạnh cơ bắp (力) để cày cuốc, vỡ hoang nơi đồng ruộng (田) chính là người đàn ông trụ cột gia đình.",
    memoryTip: "Dùng sức lực (力) cày ruộng (田) đó chính là Đấng Nam Nhi (Nam 男).",
    family: [
      { char: "勇", pinyin: "yǒng", meaning: "Dũng cảm (Người có sức lực mạnh mẽ)" },
      { char: "劳", pinyin: "láo", meaning: "Lao động (Dùng đuốc huỳnh quang lao lực)" }
    ],
    commonWords: ["男人 (đàn ông)", "男生 (nam sinh)", "男女 (nam nữ)", "男性 (giới nam)"],
    example: { hanzi: "他是一个非常有责任感的男人。", pinyin: "Tā shì yí ge fēicháng yǒu zérèngǎn de nánrén.", vi: "Anh ấy là một người đàn ông rất có tinh thần trách nhiệm." }
  },
  {
    hanzi: "信",
    pinyin: "xìn",
    hanviet: "Tín",
    meaning: "Uy tín, tin tưởng, lá thư, thông tin",
    level: 1,
    strokeCount: 9,
    radicals: [
      { char: "亻", name: "Nhân", meaning: "Con người" },
      { char: "言", name: "Ngôn", meaning: "Lời nói" }
    ],
    etymologyStory: "Một người (亻) đã mở lời nói ra (言) thì lời nói ấy phải luôn có trọng lượng, trước sau như một, tuyệt đối không được dối trá để giữ trọn niềm tin.",
    memoryTip: "Lời nói (言) của con người (亻) phải có sự chân thật, tạo nên chữ Tín (信).",
    family: [
      { char: "诚", pinyin: "chéng", meaning: "Thành thật (Lời nói Ngôn 言 đã thành công 成)" },
      { char: "誓", pinyin: "shì", meaning: "Thề thốt (Ngôn ngữ thề trước chiếc rìu Chiết 折)" }
    ],
    commonWords: ["相信 (tin tưởng)", "信心 (lòng tự tin)", "信号 (tín hiệu)", "信用卡 (thẻ tín dụng)"],
    example: { hanzi: "我完全相信你的判断。", pinyin: "Wǒ wánquán xiāngxìn nǐ de pànduàn.", vi: "Tôi hoàn toàn tin tưởng vào phán đoán của bạn." }
  },
  {
    hanzi: "尖",
    pinyin: "jiān",
    hanviet: "Tiêm",
    meaning: "Đầu nhọn, sắc nhọn, mũi nhọn",
    level: 2,
    strokeCount: 6,
    radicals: [
      { char: "小", name: "Tiểu", meaning: "Nhỏ, bé" },
      { char: "大", name: "Đại", meaning: "To, lớn" }
    ],
    etymologyStory: "Quy luật tạo hình trực giác: Một vật thể có phần đỉnh thì nhỏ dần (小), còn phần đáy thì to bè ra (大), tự nhiên tạo thành hình chóp nhọn sắc bén.",
    memoryTip: "Trên nhỏ (小) dưới to (大) hợp thành Mũi Nhọn (Tiêm 尖).",
    family: [
      { char: "尘", pinyin: "chén", meaning: "Hạt bụi (Đất nhỏ)" },
      { char: "卡", pinyin: "kǎ", meaning: "Kẹt, thẻ (Lên Thượng 上 không được, xuống Hạ 下 không xong)" }
    ],
    commonWords: ["尖锐 (sắc bén, gay gắt)", "笔尖 (ngòi bút)", "顶尖 (hàng đầu, đỉnh cao)"],
    example: { hanzi: "这支铅笔削得太尖了。", pinyin: "Zhè zhī qiānbǐ xiāo de tài jiān le.", vi: "Cây bút chì này chuốt nhọn quá rồi." }
  }
];

// 3. Grammar Mindmap (Bản đồ tư duy 6 Trục Ngữ pháp Cốt Lõi)
const mindmapData = {
  title: "Bản Đồ Tư Duy Ngữ Pháp Tiếng Trung Toàn Diện",
  description: "Tổng hợp toàn bộ cấu trúc câu, trật tự từ, bổ ngữ và liên từ theo sơ đồ tư duy logic chuẩn mực HSK 3.0",
  nodes: [
    {
      id: "word_order",
      title: "1. Trục Ngữ Pháp Cốt Lõi (Trật Tự Câu Chuẩn)",
      color: "teal",
      summary: "Quy tắc cốt lõi: 'Việc gì xảy ra trước thì nói trước'. Không gian và Thời gian luôn là bối cảnh nền tảng, phải xuất hiện TRƯỚC khi hành động diễn ra.",
      formula: "Chủ ngữ (S) + [Thời gian] + [Địa điểm] + [Phương thức/Công cụ] + Động từ (V) + [Bổ ngữ] + Tân ngữ (O)",
      contrastVi: "Tiếng Việt nói: 'Tôi ăn cơm ở nhà lúc 7 giờ tối bằng đũa' (Hành động -> Nơi chốn -> Thời gian -> Công cụ). Tiếng Trung ngược lại hoàn toàn: 'Tôi tối 7 giờ ở nhà dùng đũa ăn cơm' (Thời gian -> Nơi chốn -> Công cụ -> Hành động).",
      rules: [
        "Quy tắc thời gian: Từ đơn vị lớn đến đơn vị nhỏ: Năm -> Tháng -> Ngày -> Buổi -> Giờ.",
        "Quy tắc địa chỉ: Từ diện tích rộng đến hẹp: Quốc gia -> Tỉnh/Thành -> Quận/Huyện -> Tên đường -> Số nhà.",
        "Cụm giới từ chỉ phương thức (跟/用/坐/向...) luôn phải đứng TRƯỚC động từ chính."
      ],
      examples: [
        { hanzi: "我昨天下午在学校跟朋友一起打篮球。", pinyin: "Wǒ zuótiān xiàwǔ zài xuéxiào gēn péngyou yìqǐ dǎ lánqiú.", vi: "Chiều hôm qua tôi cùng bạn bè chơi bóng rổ ở trường học." },
        { hanzi: "他常常坐高铁从北京去上海。", pinyin: "Tā chángcháng zuò gāotiě cóng Běijīng qù Shànghǎi.", vi: "Anh ấy thường đi tàu cao tốc từ Bắc Kinh đến Thượng Hải." }
      ]
    },
    {
      id: "complements",
      title: "2. Hệ Thống 7 Bổ Ngữ Then Chốt (Complements)",
      color: "emerald",
      summary: "Bổ ngữ là thành phần quan trọng nhất sau động từ để xác định rõ: Kết quả, Xu hướng di chuyển, Năng lực khả năng, Trạng thái cảm nhận, Thời lượng hoặc Tần suất.",
      formula: "Động từ + [Bổ ngữ]",
      subtypes: [
        {
          name: "Bổ ngữ Kết quả (结果补语)",
          formula: "Động từ + 完 / 到 / 见 / 懂 / 错 / 对 / 好 / 清楚...",
          usage: "Biểu thị hành động đã kết thúc và mang lại kết quả cụ thể. Không dùng trợ từ '着' hay '过', phủ định dùng '没/没有'.",
          example: "我终于听懂了老师的解释。(Cuối cùng tôi đã nghe hiểu lời giải thích của thầy.)"
        },
        {
          name: "Bổ ngữ Xu hướng (趋向补语)",
          formula: "Đơn (V + 来/去) | Kép (V + 起来 / 出来 / 进去 / 过去 / 回来 / 上来...)",
          usage: "来: Tiến về phía người nói. 去: Đi xa khỏi người nói. '起来' biểu thị bắt đầu và tiếp diễn hoặc hướng lên; '出来' biểu thị từ ẩn sang hiện rõ.",
          example: "大家看到他走进来，都高兴地笑了起来。(Mọi người thấy anh ấy bước vào đều vui vẻ cười ồ lên.)"
        },
        {
          name: "Bổ ngữ Khả năng (可能补语)",
          formula: "Khẳng định: V + 得 + Bổ ngữ | Phủ định: V + 不 + Bổ ngữ",
          usage: "Chỉ năng lực hoặc điều kiện khách quan có cho phép đạt được kết quả hay không.",
          example: "这个箱子太重了，我一个人搬不动。(Cái vali này nặng quá, một mình tôi không bê nổi.)"
        },
        {
          name: "Bổ ngữ Trạng thái / Trình độ (状态补语)",
          formula: "Động từ + 得 + (Rất / Cực kỳ) + Tính từ / Cụm từ",
          usage: "Đưa ra đánh giá, nhận xét chi tiết về trình độ hoặc trạng thái biểu hiện của hành động.",
          example: "他汉字写得非常漂亮，像书法一样。(Anh ấy viết chữ Hán cực kỳ đẹp, tựa như thư pháp vậy.)"
        },
        {
          name: "Bổ ngữ Thời lượng (时量补语)",
          formula: "S + V + 了 + Khoảng thời gian + (Tân ngữ)",
          usage: "Chỉ thời lượng hành động kéo dài trong bao lâu (3 tiếng, 2 tuần, nửa năm).",
          example: "我们在这座城市生活了五年。(Chúng tôi đã sinh sống ở thành phố này được năm năm rồi.)"
        },
        {
          name: "Bổ ngữ Động lượng (动量补语)",
          formula: "Động từ + 次 / 遍 / 趟 / 顿 + Tân ngữ",
          usage: "'次' là lần thông thường; '遍' là toàn bộ quá trình từ đầu đến đuôi; '趟' là chuyến đi lại; '顿' là bữa ăn hoặc trận mắng.",
          example: "这部电影太感人了，我看了三遍。(Bộ phim này cảm động quá, tôi đã xem 3 lần từ đầu đến cuối.)"
        },
        {
          name: "Bổ ngữ Giới từ (介词补语)",
          formula: "Động từ + 在 / 到 / 给 / 向 + Địa điểm / Đối tượng",
          usage: "Xác định nơi lưu lại, đích đến hoặc người nhận của kết quả hành động.",
          example: "请把作业交到办公室。(Xin hãy nộp bài tập về văn phòng.)"
        }
      ]
    },
    {
      id: "special_sentences",
      title: "3. Các Mẫu Câu Đặc Biệt Cốt Lõi",
      color: "teal",
      summary: "Những cấu trúc đặc thù thể hiện lối tư duy độc đáo của người Hán, giúp diễn đạt tự nhiên và chuẩn văn phong bản xứ.",
      subtypes: [
        {
          name: "Câu chữ 把 (Bǎ) - Câu Xử Lý Đối Tượng",
          formula: "Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác",
          conditions: "1. Tân ngữ phải là vật/người đã xác định rõ. 2. Động từ phải có tác động xử lý mạnh mẽ. 3. Phía sau động từ BẮT BUỘC có thành phần khác (Bổ ngữ, 了, lặp lại...).",
          example: "请把窗户关上，外面刮大风了。(Xin hãy đóng cửa sổ lại, bên ngoài đang gió to rồi.)"
        },
        {
          name: "Câu chữ 被 (Bèi) - Câu Bị Động",
          formula: "Chủ ngữ (bị hại/tác động) + 被 + (Tác nhân) + Động từ + Thành phần khác",
          conditions: "Thường mang sắc thái tiêu cực, không mong muốn, hoặc kết quả thay đổi trạng thái.",
          example: "我的钥匙被弟弟不小心弄丢了。(Chìa khóa của tôi đã bị em trai vô ý làm rơi mất rồi.)"
        },
        {
          name: "Cấu trúc nhấn mạnh 是...的 (Shì...de)",
          formula: "Chủ ngữ + 是 + [Thời gian / Địa điểm / Phương thức / Mục đích] + Động từ + 的",
          conditions: "Dùng để nhấn mạnh chi tiết của một hành động ĐÃ XẢY RA TRONG QUÁ KHỨ.",
          example: "我们是坐飞机去北京的，不是坐火车。(Chúng tôi đi Bắc Kinh là bằng máy bay, chứ không phải đi tàu hỏa.)"
        },
        {
          name: "Cấu trúc câu so sánh 比 (Bǐ)",
          formula: "A + 比 + B + Tính từ + (得多 / 多了 / 一点儿)",
          conditions: "Tuyệt đối KHÔNG dùng '很, 非常, 真' trước tính từ trong câu so sánh chữ 比. Muốn nhấn mạnh dùng '更 / 还要'.",
          example: "今年的冬天比去年冷得多。(Mùa đông năm nay lạnh hơn năm ngoái rất nhiều.)"
        }
      ]
    },
    {
      id: "three_de",
      title: "4. Bộ Ba Trợ Từ Kinh Điển: 的 - 得 - 地",
      color: "emerald",
      summary: "Cả 3 từ đều đọc là 'de' nhưng chức năng ngữ pháp phân định cực kỳ rạch ròi. Dùng sai là lỗi phổ biến nhất trong các kỳ thi HSK.",
      subtypes: [
        {
          name: "Trợ từ kết cấu 的 (Định ngữ)",
          formula: "Định ngữ (Tính từ / Danh từ / Cụm từ) + 的 + Danh từ trung tâm",
          tip: "Quy tắc vàng: Phía SAU chữ '的' LUÔN LUÔN LÀ DANH TỪ.",
          example: "这是我最喜欢的一本书。(Đây là cuốn sách mà tôi yêu thích nhất.)"
        },
        {
          name: "Trợ từ kết cấu 得 (Bổ ngữ)",
          formula: "Động từ / Tính từ + 得 + Bổ ngữ (Đánh giá mức độ, trạng thái)",
          tip: "Quy tắc vàng: Phía TRƯỚC chữ '得' LUÔN LUÔN LÀ ĐỘNG TỪ hoặc TÍNH TỪ.",
          example: "他跑得满头大汗。(Anh ấy chạy đến mức mồ hôi nhễ nhại khắp đầu.)"
        },
        {
          name: "Trợ từ kết cấu 地 (Trạng ngữ)",
          formula: "Tính từ / Phó từ + 地 + Động từ chính",
          tip: "Quy tắc vàng: Phía SAU chữ '地' LUÔN LUÔN LÀ ĐỘNG TỪ (chỉ thái độ thực hiện).",
          example: "同学们认真地听老师讲课。(Các bạn học sinh chăm chú lắng nghe thầy giảng bài.)"
        }
      ]
    },
    {
      id: "aspect_particles",
      title: "5. Trợ Từ Thời Thái & Ngữ Khí: 了 - 过 - 着",
      color: "teal",
      summary: "Tiếng Trung không biến đổi thì động từ theo quá khứ/hiện tại như tiếng Anh, mà dùng các trợ từ động thái để chỉ tình trạng diễn tiến của sự việc.",
      subtypes: [
        {
          name: "Trợ từ 了1 (Động thái sau động từ)",
          formula: "Động từ + 了",
          usage: "Biểu thị động tác đã hoàn tất (không đồng nghĩa với quá khứ; hành động tương lai xong trước việc khác vẫn dùng 了).",
          example: "我买了一张去北京的机票。(Tôi đã mua một tấm vé máy bay đi Bắc Kinh.)"
        },
        {
          name: "Trợ từ 了2 (Ngữ khí cuối câu)",
          formula: "Vế câu + 了",
          usage: "Biểu thị có sự xuất hiện của tình huống mới hoặc biến chuyển trạng thái ('rồi').",
          example: "春天来了，天气变暖和了。(Mùa xuân đã đến rồi, thời tiết ấm áp dần lên rồi.)"
        },
        {
          name: "Trợ từ 过 (Trải nghiệm quá khứ)",
          formula: "Động từ + 过",
          usage: "Biểu thị đã từng trải qua kinh nghiệm đó trong đời và hiện tại sự việc đã chấm dứt hoàn toàn.",
          example: "我以前去过一次长城。(Trước đây tôi từng đi Vạn Lý Trường Thành một lần.)"
        },
        {
          name: "Trợ từ 着 (Duy trì trạng thái)",
          formula: "Động từ + 着",
          usage: "Biểu thị trạng thái đang được duy trì liên tục hoặc làm nền cho hành động thứ hai.",
          example: "他笑着对我说：'没关系。' (Anh ấy mỉm cười nói với tôi: 'Không sao đâu.')"
        }
      ]
    },
    {
      id: "connectors",
      title: "6. Hệ Thống Liên Từ & Mạch Logic Câu Phức",
      color: "emerald",
      summary: "Nắm vững các cặp liên từ là chìa khóa để nâng cao trình độ hành văn từ HSK 3 lên HSK 5-6, tạo sự mạch lạc tự nhiên.",
      subtypes: [
        {
          name: "Cặp liên từ Nguyên nhân - Kết quả",
          formula: "因为...所以... (Bởi vì... cho nên...)",
          example: "因为下暴雨，所以运动会推迟了。(Vì trời mưa to nên đại hội thể thao bị hoãn lại.)"
        },
        {
          name: "Cặp liên từ Chuyển ngoặt tương phản",
          formula: "虽然...但是/可是... (Tuy rằng... nhưng mà...)",
          example: "虽然汉语很难，但是非常有趣。(Tuy tiếng Trung khó nhưng cực kỳ thú vị.)"
        },
        {
          name: "Cặp liên từ Giả thiết điều kiện",
          formula: "如果/要是...就... (Nếu như... thì sẽ...)",
          example: "如果有时间，我就和你一起去。(Nếu có thời gian, tôi sẽ đi cùng bạn.)"
        },
        {
          name: "Cặp liên từ Tăng tiến quan hệ",
          formula: "不但...而且... (Không những... mà còn...)",
          example: "他不但会说英语，而且汉语说得很流利。(Anh ấy không những biết nói tiếng Anh mà tiếng Trung còn nói rất lưu loát.)"
        }
      ]
    }
  ]
};

// 4. Confusions (16 Cặp từ dễ nhầm lẫn then chốt)
const confusionsData = [
  {
    id: "er_liang",
    pair: "二 (èr) vs 两 (liǎng)",
    meaning: "Đều có nghĩa là số 2",
    difference: "二 dùng để đếm số thứ tự, đọc số điện thoại, số nhà, phân số, chữ số đơn lẻ. 两 bắt buộc dùng trước LƯỢNG TỪ và danh từ (hai người = 两个人, tuyệt đối không nói 二个人).",
    comparisonTable: [
      { aspect: "Đếm số thứ tự (1, 2, 3)", wordA: "一, 二, 三 (Chuẩn xác)", wordB: "一, 两, 三 (Sai ngữ pháp)" },
      { aspect: "Đứng trước lượng từ", wordA: "二个人 / 二本书 (Sai)", wordB: "两个人 / 两本书 (Đúng chuẩn)" },
      { aspect: "Thứ hạng / Tầng lầu", wordA: "第二名 / 二楼 (Đúng)", wordB: "第两名 / 两楼 (Sai)" },
      { aspect: "Đứng trước 百 / 千 / 万", wordA: "二百 (200) / 二千 (2000)", wordB: "两百 (200) / 两千 (2000) - Đều dùng được" }
    ],
    mnemonic: "Đếm số hoặc thứ bậc dùng 二; Trước lượng từ kèm người/vật thì dùng 两.",
    quiz: {
      question: "Điền từ thích hợp: 我有____个弟弟。(Tôi có hai đứa em trai.)",
      options: ["二 (èr)", "两 (liǎng)"],
      correct: 1,
      explanation: "Phía sau có lượng từ '个' nên bắt buộc phải dùng '两'."
    }
  },
  {
    id: "gang_gangcai",
    pair: "刚 (gāng) vs 刚才 (gāngcái)",
    meaning: "Đều dịch là 'vừa mới / vừa nãy'",
    difference: "刚 là phó từ, bắt buộc đứng TRƯỚC động từ, chỉ thời gian ngắn theo cảm nhận chủ quan (có thể là vừa mới tuần trước). 刚才 là danh từ chỉ thời gian khách quan (vài phút vừa qua), có thể đứng đầu câu hoặc trước động từ.",
    comparisonTable: [
      { aspect: "Từ loại", wordA: "Phó từ (Adverb)", wordB: "Danh từ thời gian (Noun)" },
      { aspect: "Vị trí trong câu", wordA: "Bắt buộc đứng TRƯỚC động từ (我刚来)", wordB: "Đầu câu hoặc trước động từ (刚才我 / 我刚才)" },
      { aspect: "Khoảng thời gian", wordA: "Chủ quan: có thể vài ngày trước (我刚毕业)", wordB: "Khách quan: chỉ vài phút ngắn ngủi vừa trôi qua" },
      { aspect: "Đi với từ chỉ lượng", wordA: "Đi được (我刚来五分钟)", wordB: "Không đi trực tiếp với lượng từ thời gian" }
    ],
    mnemonic: "刚才 là mốc thời gian vài phút trước; 刚 là phó từ bám chặt lấy động từ.",
    quiz: {
      question: "____你去哪儿了？(Vừa nãy bạn đã đi đâu thế?)",
      options: ["刚", "刚才"],
      correct: 1,
      explanation: "Đứng ở đầu câu làm trạng ngữ chỉ thời gian thì chỉ có thể dùng danh từ '刚才'."
    }
  },
  {
    id: "changchang_wangwang",
    pair: "常常 (chángcháng) vs 往往 (wǎngwǎng)",
    meaning: "Đều dịch là 'thường / hay'",
    difference: "常常 chỉ tần suất diễn ra đơn thuần theo thói quen cá nhân. 往往 chỉ quy luật thường thấy trong một điều kiện, hoàn cảnh cụ thể nào đó (phải có vế điều kiện đi kèm).",
    comparisonTable: [
      { aspect: "Bản chất", wordA: "Tần suất cao, thói quen chủ quan", wordB: "Tính quy luật lặp lại theo hoàn cảnh" },
      { aspect: "Vế điều kiện", wordA: "Không cần điều kiện (我常常去跑步)", wordB: "Thường có điều kiện (周末他往往不在家)" },
      { aspect: "Dạng phủ định", wordA: "不常 (không thường xuyên)", wordB: "Không dùng 不往往" }
    ],
    mnemonic: "Thói quen đơn thuần cứ dùng 常常; Nếu có điều kiện 'mỗi khi... thì thường...' dùng 往往.",
    quiz: {
      question: "他周末____一个人去图书馆。(Cuối tuần anh ấy thường một mình đi thư viện - có điều kiện hoàn cảnh).",
      options: ["往往", "刚刚"],
      correct: 0,
      explanation: "'周末' là điều kiện hoàn cảnh lặp đi lặp lại mang tính quy luật, phù hợp dùng '往往'."
    }
  },
  {
    id: "chabuduo_jihu",
    pair: "差不多 (chàbuduō) vs 几乎 (jīhū)",
    meaning: "Đều mang nghĩa 'gần như / xấp xỉ'",
    difference: "差不多 có thể làm vị ngữ độc lập mang nghĩa 'tương đương nhau' (两个差不多), và có thể đứng trước số lượng từ. 几乎 là phó từ thuần túy, thường biểu thị sự suýt soát (sém chút nữa là xảy ra).",
    comparisonTable: [
      { aspect: "Làm vị ngữ độc lập", wordA: "Được (他们的水平差不多)", wordB: "Không được làm vị ngữ" },
      { aspect: "Đứng trước số lượng", wordA: "Được (差不多十年)", wordB: "Hiếm khi, thường dùng 几乎所有" },
      { aspect: "Ý nghĩa suýt nữa", wordA: "Không mang nghĩa suýt bị", wordB: "Có nghĩa suýt xảy ra (我几乎忘了)" }
    ],
    mnemonic: "So kè tương đương nhau là 差不多; Suýt sém chút nữa là 几乎.",
    quiz: {
      question: "这两个手机的质量____。(Chất lượng của hai chiếc điện thoại này tương đương nhau.)",
      options: ["几乎", "差不多"],
      correct: 1,
      explanation: "Ở cuối câu làm vị ngữ thì chỉ có '差不多' mới dùng được."
    }
  },
  {
    id: "yiwei_renwei",
    pair: "以为 (yǐwéi) vs 认为 (rènwéi)",
    meaning: "Đều dịch là 'cho rằng / nghĩ rằng'",
    difference: "以为 ngầm biểu thị suy nghĩ ban đầu ĐÃ SAI so với thực tế (Tưởng rằng... nhưng sự thật không phải vậy). 认为 là nhận định, quan điểm nghiêm túc, khách quan và không ngụ ý sai lầm.",
    comparisonTable: [
      { aspect: "Tính xác thực", wordA: "Thực tế TRÁI NGƯỢC với suy nghĩ (nghĩ sai)", wordB: "Quan điểm cá nhân nghiêm túc, logic" },
      { aspect: "Sắc thái", wordA: "Thất vọng, bất ngờ: 'Tưởng thế nào...'", wordB: "Trịnh trọng, nghị luận: 'Tôi nhận định rằng...'" }
    ],
    mnemonic: "以为 là 'tưởng bở' (thực tế sai); 认为 là 'nhận định' (chính kiến logic).",
    quiz: {
      question: "我____他是中国人，其实他是越南人。(Tôi tưởng anh ta là người Trung Quốc, thực ra anh ta là người Việt.)",
      options: ["以为", "认为"],
      correct: 0,
      explanation: "Phía sau có '其实' (thực ra) chỉ thực tế trái ngược, nên bắt buộc dùng '以为' (tưởng rằng)."
    }
  },
  {
    id: "hui_neng_keyi",
    pair: "会 (huì) vs 能 (néng) vs 可以 (kěyǐ)",
    meaning: "Đều dịch là 'có thể / biết'",
    difference: "会: Biết làm nhờ học tập, rèn luyện (biết bơi, biết tiếng Trung) hoặc khả năng sẽ xảy ra. 能: Năng lực bản thân hoặc điều kiện khách quan cho phép (hôm nay khỏe nên bơi được 1000m). 可以: Được phép về mặt quy tắc, đạo lý hoặc gợi ý nhẹ nhàng.",
    comparisonTable: [
      { aspect: "Qua rèn luyện học tập", wordA: "我会说汉语 (Đúng)", wordB: "我能说汉语 (Đúng khi nhấn mạnh năng lực)", wordC: "我可以说汉语 (Cho phép)" },
      { aspect: "Điều kiện phục hồi/năng lực", wordA: "会 (Không biểu thị)", wordB: "他的病好了，能上班了 (Đúng)", wordC: "可以 (Được phép)" },
      { aspect: "Xin phép / Quy định", wordA: "会 (Sai)", wordB: "能 (Có thể dùng)", wordC: "这里可以抽烟吗？(Chuẩn nhất)" }
    ],
    mnemonic: "Học mới biết thì dùng 会; Có năng lực/điều kiện thì dùng 能; Được phép/xin phép thì dùng 可以.",
    quiz: {
      question: "请问，这里____拍照吗？(Xin hỏi, ở đây có được phép chụp ảnh không?)",
      options: ["会", "可以"],
      correct: 1,
      explanation: "Hỏi xin phép quy định nơi công cộng thì dùng '可以' là chuẩn xác nhất."
    }
  },
  {
    id: "zhidao_renshi",
    pair: "知道 (zhīdào) vs 认识 (rènshi)",
    meaning: "Đều dịch là 'biết'",
    difference: "知道 là biết thông tin, tin tức, sự thật, đạo lý (biết giờ, biết đáp án). 认识 là quen biết người, nhận biết mặt chữ, thông thuộc đường sá qua tiếp xúc trực tiếp.",
    comparisonTable: [
      { aspect: "Biết thông tin sự việc", wordA: "我知道这件事情 (Đúng)", wordB: "我认识这件事情 (Sai)" },
      { aspect: "Quen biết con người", wordA: "我知道他 (Chỉ nghe tên, chưa gặp)", wordB: "我认识他 (Đã gặp gỡ, quen biết nhau)" },
      { aspect: "Mặt chữ / Con đường", wordA: "知道 (Biết có chữ này)", wordB: "认识这个汉字 / 认识路 (Đọc được, nhận diện được)" }
    ],
    mnemonic: "Biết tin tức, chuyện gì dùng 知道; Nhận mặt người, mặt chữ dùng 认识.",
    quiz: {
      question: "你____去机场的路怎么走吗？(Bạn có biết đường đi ra sân bay như thế nào không?)",
      options: ["认识", "知道"],
      correct: 1,
      explanation: "Hỏi về cách thức, thông tin ('怎么走') thì dùng '知道'."
    }
  },
  {
    id: "yidianr_youdianr",
    pair: "一点儿 (yìdiǎnr) vs 有点儿 (yǒudiǎnr)",
    meaning: "Đều dịch là 'một chút / hơi'",
    difference: "一点儿 là số lượng từ, đứng SAU tính từ (biểu thị so sánh: to hơn một chút) hoặc TRƯỚC danh từ (uống một chút nước). 有点儿 là phó từ, đứng TRƯỚC tính từ và thường mang sắc thái TIÊU CỰC, không vừa ý (hơi mệt, hơi đắt).",
    comparisonTable: [
      { aspect: "Vị trí với tính từ", wordA: "Tính từ + 一点儿 (大一点儿 - to hơn một chút)", wordB: "有点儿 + Tính từ (有点儿累 - hơi mệt mỏi)" },
      { aspect: "Sắc thái tình cảm", wordA: "Trung tính hoặc tích cực", wordB: "Thường là tiêu cực, phàn nàn, không hài lòng" },
      { aspect: "Đi với danh từ", wordA: "一点儿 + Danh từ (喝一点儿茶)", wordB: "Không đi trực tiếp với danh từ" }
    ],
    mnemonic: "Đứng TRƯỚC tính từ mang vẻ phàn nàn dùng 有点儿; Đứng SAU tính từ biểu thị so sánh hoặc trước danh từ dùng 一点儿.",
    quiz: {
      question: "这件衣服____贵，便宜一点儿吧。(Bộ quần áo này hơi đắt, rẻ hơn chút đi.)",
      options: ["一点儿", "有点儿"],
      correct: 1,
      explanation: "Đứng trước tính từ '贵' mang ý chê đắt (tiêu cực) nên dùng '有点儿'."
    }
  },
  {
    id: "zai_you",
    pair: "再 (zài) vs 又 (yòu)",
    meaning: "Đều dịch là 'lại / lần nữa'",
    difference: "再 dùng cho hành động sẽ lặp lại trong TƯƠNG LAI (chưa xảy ra). 又 dùng cho hành động ĐÃ LẶP LẠI trong quá khứ hoặc việc xảy ra ngoài ý muốn.",
    comparisonTable: [
      { aspect: "Thời điểm hành động", wordA: "Tương lai, chưa xảy ra (明天再来 - mai lại đến)", wordB: "Quá khứ, đã xảy ra (他又迟到了 - anh ta lại đi trễ)" },
      { aspect: "Cảm xúc người nói", wordA: "Chủ động, mong muốn tiếp tục", wordB: "Bất đắc dĩ, phàn nàn sự lặp đi lặp lại" }
    ],
    mnemonic: "Lặp lại mai sau dùng 再 (Hẹn gặp lại - 再见); Đã lặp lại rồi dùng 又.",
    quiz: {
      question: "你怎么____忘了带钥匙？(Sao bạn lại quên mang chìa khóa rồi?)",
      options: ["再", "又"],
      correct: 1,
      explanation: "Hành động quên đã xảy ra trong thực tế mang ý trách móc, dùng '又'."
    }
  },
  {
    id: "turán_huran",
    pair: "突然 (tūrán) vs 忽然 (hūrán)",
    meaning: "Đều dịch là 'đột nhiên / bỗng nhiên'",
    difference: "突然 là TÍNH TỪ kiêm phó từ, có thể làm vị ngữ, định ngữ (这件事太突然了 - việc này đột ngột quá). 忽然 thuần túy là PHÓ TỪ, chỉ có thể đứng trước động từ làm trạng ngữ.",
    comparisonTable: [
      { aspect: "Làm vị ngữ sau 很 / 太", wordA: "Được (这消息太突然了)", wordB: "Không được (Không nói 太忽然了)" },
      { aspect: "Làm định ngữ trước danh từ", wordA: "Được (突然的变化 - biến đổi đột ngột)", wordB: "Không được làm định ngữ" }
    ],
    mnemonic: "Có thể đứng sau 很/太 thì chỉ có 突然; Trước động từ thì cả 2 đều dùng được.",
    quiz: {
      question: "这件事情发生得太____了。(Sự việc này xảy ra quá đột ngột.)",
      options: ["忽然", "突然"],
      correct: 1,
      explanation: "Đứng sau phó từ mức độ '太' làm bổ ngữ chỉ có tính từ '突然' mới dùng được."
    }
  },
  {
    id: "lianmang_jimang",
    pair: "连忙 (liánmáng) vs 急忙 (jímáng)",
    meaning: "Đều dịch là 'vội vàng / mau lẹ'",
    difference: "连忙 nhấn mạnh TỐC ĐỘ phản ứng nhanh chóng trước một tình huống bất ngờ. 急忙 nhấn mạnh TÂM TRẠNG hoảng hốt, vội vã, cuống cuồng.",
    comparisonTable: [
      { aspect: "Trọng tâm", wordA: "Hành động tức thời, mau lẹ (thấy cụ già liền vội đỡ)", wordB: "Tâm trạng nôn nóng, hấp tấp (sợ trễ tàu)" },
      { aspect: "Làm định ngữ", wordA: "Không được làm định ngữ", wordB: "Được (急忙的脚步 - bước chân vội vã)" }
    ],
    mnemonic: "Phản xạ nhanh theo phản xạ dùng 连忙; Tâm trạng cuống cuồng dùng 急忙.",
    quiz: {
      question: "看到老人上车，他____站起来让座。(Thấy cụ già lên xe, anh ấy liền vội đứng dậy nhường chỗ.)",
      options: ["急忙", "连忙"],
      correct: 1,
      explanation: "Phản ứng lịch sự mau lẹ trước một tình huống thì dùng '连忙' là chuẩn xác nhất."
    }
  },
  {
    id: "bixu1_bixu2",
    pair: "必须 (bìxū) vs 必需 (bìxū)",
    meaning: "Đều phát âm là bìxū",
    difference: "必须 là phó từ, nghĩa là 'nhất định phải', đứng TRƯỚC động từ. 必需 là động từ/tính từ, nghĩa là 'cần thiết, thiết yếu', thường đi kèm danh từ (nhu yếu phẩm = 必需品).",
    comparisonTable: [
      { aspect: "Từ loại", wordA: "Phó từ chỉ mệnh lệnh (Must)", wordB: "Động từ/Tính từ thiết yếu (Essential)" },
      { aspect: "Vị trí trong câu", wordA: "Đứng trước động từ (你必须去 - bạn bắt buộc phải đi)", wordB: "Làm định ngữ trước danh từ (生活必需品)" }
    ],
    mnemonic: "Nhất định phải làm gì dùng 必须; Nhu yếu phẩm cần thiết dùng 必需.",
    quiz: {
      question: "水是人类生活所____的东西。(Nước là thứ thiết yếu trong đời sống con người.)",
      options: ["必需", "必须"],
      correct: 0,
      explanation: "Nghĩa là thứ 'thiết yếu, cần có' bổ nghĩa cho danh từ, dùng '必需'."
    }
  }
];

// Write files
fs.writeFileSync(path.join(outDir, 'dictionary.json'), JSON.stringify(dictionary, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'lessons.json'), JSON.stringify(allLessons, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'etymology.json'), JSON.stringify(etymologyData, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'mindmap.json'), JSON.stringify(mindmapData, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'confusions.json'), JSON.stringify(confusionsData, null, 2), 'utf8');

console.log('--- All Enriched Datasets Generated Successfully! ---');
