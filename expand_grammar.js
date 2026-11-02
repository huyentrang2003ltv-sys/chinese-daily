const fs = require('fs');
const path = require('path');

const grammarCompendium = [
  // ==========================================
  // NHÓM 1: CÂU SO SÁNH (COMPARISON - 5 CHỦ ĐIỂM)
  // ==========================================
  {
    id: "g_compare_bi",
    category: "comparison",
    categoryName: "Câu So Sánh (比较句)",
    title: "1. Câu So Sánh Chữ 比 (A 比 B + Tính từ / Bổ ngữ)",
    formula: "A + 比 + B + Tính từ (+ Cụm số lượng / 一点儿 / 多了)",
    level: "HSK 2 - 3",
    explanation: "Dùng để biểu thị sự chênh lệch tính chất hoặc mức độ giữa hai đối tượng A và B. Khi muốn diễn đạt mức độ chênh lệch ít thì dùng '一点儿/一些', chênh lệch nhiều thì dùng '多了/得多'. Tuyệt đối không dùng phó từ '很/非常/真' trước tính từ trong câu chữ 比.",
    rules: [
      "Chênh lệch ít: A + 比 + B + Adj + 一点儿 / 一些",
      "Chênh lệch nhiều: A + 比 + B + Adj + 多了 / 得多",
      "Chênh lệch con số cụ thể: A + 比 + B + Adj + Con số (Số lượng từ)",
      "So sánh động tác: A + 比 + B + V + 得 + Adj HOẶC A + V + 得 + 比 + B + Adj"
    ],
    mistakes: "❌ Sai: 我比他很高。➔ ✅ Đúng: 我比他高 / 我比他高得多。",
    examples: [
      { hanzi: "今天比昨天冷多了。", pinyin: "Jīntiān bǐ zuótiān lěng duō le.", vi: "Hôm nay lạnh hơn hôm qua rất nhiều." },
      { hanzi: "他跑得比我快一点儿。", pinyin: "Tā pǎo de bǐ wǒ kuài yìdiǎnr.", vi: "Anh ấy chạy nhanh hơn tôi một chút." },
      { hanzi: "妹妹比我小三岁。", pinyin: "Mèimei bǐ wǒ xiǎo sān suì.", vi: "Em gái nhỏ hơn tôi 3 tuổi." }
    ]
  },
  {
    id: "g_compare_gen_yiyang",
    category: "comparison",
    categoryName: "Câu So Sánh (比较句)",
    title: "2. Câu So Sánh Bằng (A 跟/和 B 一样 [+ Tính từ])",
    formula: "A + 跟/和/同 + B + 一样 (+ Tính từ)",
    level: "HSK 2 - 3",
    explanation: "Biểu thị A và B có đặc điểm hoặc mức độ ngang bằng nhau. Thể phủ định là 'A 跟 B 不一样' (A không giống B) hoặc 'A 没有 B 那么/这么 + Tính từ' (A không bằng B).",
    rules: [
      "Khẳng định so sánh đặc điểm: A + 跟 + B + 一样 + Adj",
      "Phủ định tính chất: A + 跟 + B + 不一样 (+ Adj)",
      "Phủ định mức độ: A + 没有 + B + (这么/那么) + Adj (A không ... bằng B)"
    ],
    mistakes: "❌ Sai: 我没有跟他一样大。➔ ✅ Đúng: 我跟他不一样大 / 我没有他那么大。",
    examples: [
      { hanzi: "这件衣服的颜色跟那件一样。", pinyin: "Zhè jiàn yīfu de yánsè gēn nà jiàn yíyàng.", vi: "Màu của chiếc áo này giống hệt chiếc áo kia." },
      { hanzi: "他的汉语说得跟我一样流利。", pinyin: "Tā de hànyǔ shuō de gēn wǒ yíyàng liúlì.", vi: "Tiếng Trung của anh ấy nói lưu loát y như tôi." }
    ]
  },
  {
    id: "g_compare_meiyou",
    category: "comparison",
    categoryName: "Câu So Sánh (比较句)",
    title: "3. Câu So Sánh Không Bằng (A 没有 B 这么/那么 + Tính từ)",
    formula: "A + 没有 + B + (这么 / 那么) + Tính từ / Động từ tâm lý",
    level: "HSK 3",
    explanation: "Dùng để biểu thị A kém hơn B hoặc chưa đạt đến trình độ/mức độ như B. '这么' dùng khi sự việc ở gần người nói, '那么' dùng khi sự việc ở xa hoặc mang tính trừu tượng.",
    rules: [
      "So sánh tính chất: A + 没有 + B + (那么) + Adj",
      "So sánh động tác: A + 没有 + B + V + 得 + Adj (Anh ấy không chạy nhanh bằng tôi)",
      "Tuyệt đối không nhầm lẫn giữa 'A 不比 B' (A không kém hơn B / A ngang ngửa B) và 'A 没有 B' (A kém hơn B)."
    ],
    mistakes: "❌ Nhầm lẫn ý nghĩa: '我不比他笨' (Tôi không hề ngốc hơn anh ta - ngữ khí cãi lại) vs '我没有他聪明' (Tôi không thông minh bằng anh ấy - thừa nhận khách quan).",
    examples: [
      { hanzi: "北京的夏天没有南方那么热。", pinyin: "Běijīng de xiàtiān méiyǒu nánfāng nàme rè.", vi: "Mùa hè ở Bắc Kinh không oi bức bằng phương Nam." },
      { hanzi: "这本小说没有我想象的那么精彩。", pinyin: "Zhè běn xiǎoshuō méiyǒu wǒ xiǎngxiàng de nàme jīngcǎi.", vi: "Quyển tiểu thuyết này không lôi cuốn như tôi tưởng tượng." }
    ]
  },
  {
    id: "g_compare_buru",
    category: "comparison",
    categoryName: "Câu So Sánh (比较句)",
    title: "4. So Sánh Bất Như (A 不如 B - Chi Bằng / Không Bằng)",
    formula: "A + 不如 + B (+ Tính từ / Hành động)",
    level: "HSK 4",
    explanation: "Biểu thị A không bằng B về một phương diện nào đó (thường mang sắc thái văn viết trang trọng hơn '没有'), hoặc dùng để đưa ra lời khuyên 'thay vì A thì chi bằng chọn B' (与其A不如B).",
    rules: [
      "So sánh trực tiếp: A + 不如 + B (Chất lượng cái này không bằng cái kia)",
      "Lựa chọn tối ưu: 与其 A，不如 B (Thay vì A, chi bằng B)"
    ],
    mistakes: "❌ Sai: 我不如他很聪明。➔ ✅ Đúng: 我不如他聪明。",
    examples: [
      { hanzi: "听别人说，不如自己亲自去看一看。", pinyin: "Tīng biérén shuō, bùrú zìjǐ qīnzì qù kàn yí kàn.", vi: "Nghe người khác nói, chi bằng tự mình đích thân đi xem một chuyến." },
      { hanzi: "坐公交车太慢了，不如我们打车走吧。", pinyin: "Zuò gōngjiāochē tài màn le, bùrú wǒmen dǎchē zǒu ba.", vi: "Đi xe buýt chậm quá, hay là chúng ta bắt taxi đi đi." }
    ]
  },
  {
    id: "g_compare_yue_lai_yue",
    category: "comparison",
    categoryName: "Câu So Sánh (比较句)",
    title: "5. So Sánh Tiến Tuyến (越来越... & 越...越...)",
    formula: "越来越 + Tính từ / Động từ tâm lý  HOẶC  越 + A + 越 + B",
    level: "HSK 3 - 4",
    explanation: "'越来越...' biểu thị mức độ tăng dần theo dòng thời gian (Càng ngày càng...). '越 A 越 B' biểu thị mức độ của B biến đổi tỷ lệ thuận theo sự thay đổi của A (Càng... thì càng...).",
    rules: [
      "Không thêm '很, 非常, 真' sau '越来越'. (❌ 越来越很好 ➔ ✅ 越来越好)",
      "越 A 越 B: Nếu cùng một chủ ngữ thì đặt '越' sau chủ ngữ; nếu hai chủ ngữ khác nhau thì đặt '越' trước vị ngữ của mỗi vế."
    ],
    mistakes: "❌ Sai: 汉语的语法越来越很有意思。➔ ✅ Đúng: 汉语的语法越来越有意思。",
    examples: [
      { hanzi: "随着科技的发展，人们的生活越来越方便。", pinyin: "Suízhe kējì de fāzhǎn, rénmen de shēnghuó yuè lái yuè fāngbiàn.", vi: "Cùng với sự phát triển của công nghệ, cuộc sống con người ngày càng tiện lợi." },
      { hanzi: "雨越下越大，路上的行人越来越少了。", pinyin: "Yǔ yuè xià yuè dà, lù shang de xíngrén yuè lái yuè shǎo le.", vi: "Mưa càng lúc càng to, người đi đường càng lúc càng thưa thớt." }
    ]
  },

  // ==========================================
  // NHÓM 2: MẪU CÂU ĐẶC BIỆT (BA / BEI / SPECIAL - 6 CHỦ ĐIỂM)
  // ==========================================
  {
    id: "g_ba_sentence",
    category: "ba_bei",
    categoryName: "Cấu Trúc Chữ 把 & 被",
    title: "6. Câu Chữ 把 Toàn Diện (把字句)",
    formula: "Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác (Bổ ngữ / 了 / 在... / 到...)",
    level: "HSK 3 - 4",
    explanation: "Dùng để nhấn mạnh sự xử lý, tác động của chủ ngữ lên tân ngữ, khiến tân ngữ thay đổi vị trí, trạng thái hoặc đạt kết quả nhất định. Động từ trong câu chữ 把 tuyệt đối KHÔNG ĐƯỢC đứng trơ trọi một mình, bắt buộc phải có thành phần khác đi kèm.",
    rules: [
      "Đưa vật đến nơi chốn mới: S + 把 + O + V + 在 / 到 / 给 + Nơi chốn/Người nhận",
      "Tác động đạt kết quả: S + 把 + O + V + Bổ ngữ kết quả (干净, 完, 破, 坏...)",
      "Động từ lặp lại: S + 把 + O + V 一 V / V V (như: 把房间收拾收拾)",
      "Phó từ phủ định (没/别) và động từ năng nguyện (想/要/能) phải đứng TRƯỚC chữ 把."
    ],
    mistakes: "❌ Sai: 我把书看了。 (Thiếu kết quả/trơ trọi) ➔ ✅ Đúng: 我把书看完了。",
    examples: [
      { hanzi: "请把空调关一下，有点儿冷。", pinyin: "Qǐng bǎ kōngtiáo guān yíxià, yǒudiǎnr lěng.", vi: "Làm ơn tắt giúp máy điều hòa với, hơi lạnh rồi." },
      { hanzi: "妈妈把洗好的衣服挂在阳台上。", pinyin: "Māma bǎ xǐ hǎo de yīfu guà zài yángtái shàng.", vi: "Mẹ đem quần áo đã giặt sạch phơi ở ban công." },
      { hanzi: "你千万别把这件事情告诉他。", pinyin: "Nǐ qiānwàn bié bǎ zhè jiàn shìqing gàosù tā.", vi: "Bạn tuyệt đối đừng nói chuyện này cho anh ấy biết nhé." }
    ]
  },
  {
    id: "g_bei_sentence",
    category: "ba_bei",
    categoryName: "Cấu Trúc Chữ 把 & 被",
    title: "7. Câu Chữ 被 & Thể Bị Động (被字句)",
    formula: "Chủ ngữ (Bị tác động) + 被 / 叫 / 让 + Tân ngữ (Tác nhân) + Động từ + Thành phần khác",
    level: "HSK 3 - 4",
    explanation: "Dùng để biểu thị chủ ngữ tiếp nhận hành động hoặc rơi vào trạng thái bất lợi, không như ý muốn. Trong khẩu ngữ, '被' có thể thay bằng '让' hoặc '叫' (nhưng sau 让/叫 bắt buộc phải có tân ngữ tác nhân cụ thể).",
    rules: [
      "Có thể lược bỏ tác nhân khi dùng '被': 我的自行车被偷了 (Xe đạp của tôi bị trộm rồi - không cần nói ai trộm).",
      "Không được lược bỏ tác nhân khi dùng '让/叫': ❌ 蛋糕叫吃了 ➔ ✅ 蛋糕叫弟弟吃了。",
      "Phó từ phủ định (没/没有) bắt buộc đứng TRƯỚC chữ 被."
    ],
    mistakes: "❌ Sai: 手机被我没弄丢。➔ ✅ Đúng: 手机没被我弄丢。",
    examples: [
      { hanzi: "桌子上的西瓜被弟弟吃光了。", pinyin: "Zhuōzi shang de xīguā bèi dìdi chī guāng le.", vi: "Quả dưa hấu trên bàn đã bị em trai ăn sạch sành sanh rồi." },
      { hanzi: "因为下大雨，明天的足球比赛被取消了。", pinyin: "Yīnwèi xià dàyǔ, míngtiān de zúqiú bǐsài bèi qǔxiāo le.", vi: "Vì mưa lớn nên trận đấu bóng đá ngày mai đã bị hủy bỏ." }
    ]
  },
  {
    id: "g_shi_de_focus",
    category: "ba_bei",
    categoryName: "Cấu Trúc Chữ 把 & 被",
    title: "8. Cấu Trúc Nhấn Mạnh 是...的 (The 'Shi... De' Construction)",
    formula: "Chủ ngữ + 是 + [Thời gian / Địa điểm / Phương thức / Mục đích] + Động từ + 的",
    level: "HSK 3",
    explanation: "Dùng khi một hành vi/sự việc ĐÃ XẢY RA TRONG QUÁ KHỨ và người nói muốn nhấn mạnh vào chi tiết xung quanh: Thời gian, Địa điểm, Phương thức đi lại hoặc Ai là người thực hiện. Trong câu khẳng định có thể lược bỏ '是', nhưng trong câu phủ định bắt buộc phải giữ '不是...的'.",
    rules: [
      "Nhấn mạnh thời gian: 我是一年前来中国的。(Tôi đến Trung Quốc là vào một năm trước).",
      "Nhấn mạnh phương thức: 他是坐飞机去的。(Anh ấy là đi bằng máy bay).",
      "Nhấn mạnh nơi chốn: 这张照片是在长城拍的。(Tấm ảnh này là chụp ở Vạn Lý Trường Thành).",
      "Phủ định: S + 不是 + [Thành phần nhấn mạnh] + V + 的."
    ],
    mistakes: "❌ Sai khi dùng cho tương lai: 我明天是去北京的。➔ ✅ Đúng: 我明天要去北京 (Chỉ dùng 是...的 cho việc ĐÃ XẢY RA).",
    examples: [
      { hanzi: "你是什么时候买的新电脑？——我是上个月买的。", pinyin: "Nǐ shì shénme shíhou mǎi de xīn diànnǎo? —— Wǒ shì shàng gè yuè mǎi de.", vi: "Bạn mua chiếc máy tính mới khi nào thế? —— Tôi mua vào tháng trước đấy." },
      { hanzi: "这封信不是他写的，是他姐姐写的。", pinyin: "Zhè fēng xìn bú shì tā xiě de, shì tā jiějie xiě de.", vi: "Bức thư này không phải do anh ấy viết, mà do chị gái anh ấy viết." }
    ]
  },
  {
    id: "g_pivotal_sentence",
    category: "ba_bei",
    categoryName: "Cấu Trúc Chữ 把 & 被",
    title: "9. Câu Kiêm Ngữ (兼语句 - 请, 让, 叫, 使)",
    formula: "Chủ ngữ 1 + Động từ sai khiến (请/让/叫/使) + Tân ngữ 1 (Kiêm Chủ ngữ 2) + Động từ 2",
    level: "HSK 3 - 4",
    explanation: "Câu kiêm ngữ là mẫu câu có một thành phần vừa làm Tân ngữ của động từ thứ nhất, vừa làm Chủ ngữ của động từ thứ hai. Thường dùng các động từ sai khiến: 请 (mời, nhờ), 让 (cho phép, để, khiến), 叫 (bảo, gọi), 使 (làm cho, khiến cho - văn viết).",
    rules: [
      "Động từ 1 luôn là động từ biểu thị mệnh lệnh, cầu khiến hoặc tác động tâm lý.",
      "Giữa hai động từ không được ngắt quãng hoặc dùng dấu phẩy.",
      "Phủ định: Đặt '不/没' trước động từ sai khiến thứ nhất (不让他去)."
    ],
    mistakes: "❌ Sai: 老师让他，做作业。➔ ✅ Đúng: 老师让他做作业。",
    examples: [
      { hanzi: "今天晚上我请大家吃中国菜。", pinyin: "Jīntiān wǎnshang wǒ qǐng dàjiā chī Zhōngguó cài.", vi: "Tối nay tôi mời mọi người ăn món Trung Hoa." },
      { hanzi: "这件事让他非常感动。", pinyin: "Zhè jiàn shì ràng tā fēicháng gǎndòng.", vi: "Chuyện này khiến cho anh ấy vô cùng cảm động." }
    ]
  },
  {
    id: "g_serial_verb",
    category: "ba_bei",
    categoryName: "Cấu Trúc Chữ 把 & 被",
    title: "10. Câu Liên Động (连动句 - Chuỗi Hành Động)",
    formula: "Chủ ngữ + Động từ 1 + (Tân ngữ 1) + Động từ 2 + (Tân ngữ 2)",
    level: "HSK 2 - 3",
    explanation: "Hai hoặc nhiều động từ cùng phục vụ một chủ ngữ và diễn ra liên tiếp theo thứ tự thời gian, hoặc Động từ 1 là phương thức/công cụ để thực hiện Động từ 2.",
    rules: [
      "Biểu thị mục đích: 去/来 + Địa điểm + Làm gì (去图书馆看书).",
      "Biểu thị phương thức: 用/坐/骑 + Phương tiện + Làm gì (坐高铁去上海).",
      "Thứ tự động từ tuyệt đối phải theo trục thời gian thực tế: Hành động nào làm trước phải nói trước."
    ],
    mistakes: "❌ Sai tư duy Tiếng Việt: 我看书去图书馆 (Tôi đọc sách ở thư viện) ➔ ✅ Chuẩn Tiếng Trung: 我去图书馆看书 (Đi thư viện trước rồi mới đọc sách).",
    examples: [
      { hanzi: "我们打算明天坐飞机去北京旅游。", pinyin: "Wǒmen dǎsuàn míngtiān zuò fēijī qù Běijīng lǚyóu.", vi: "Ngày mai chúng tôi dự định đi máy bay đến Bắc Kinh du lịch." },
      { hanzi: "他每天骑自行车上班。", pinyin: "Tā měitiān qí zìxíngchē shàngbān.", vi: "Hằng ngày anh ấy đạp xe đạp đi làm." }
    ]
  },
  {
    id: "g_existential_sentence",
    category: "ba_bei",
    categoryName: "Cấu Trúc Chữ 把 & 被",
    title: "11. Câu Tồn Hiện (存现句 - Sự Tồn Tại & Xuất Hiện)",
    formula: "Từ chỉ nơi chốn/thời gian + Động từ + [着 / 了] + Tân ngữ (Người / Vật)",
    level: "HSK 3 - 4",
    explanation: "Dùng để biểu thị ở một nơi nào đó đang có (tồn tại), xuất hiện hoặc mất đi một người hay một vật. Tân ngữ trong câu tồn hiện bắt buộc phải là vật/người KHÔNG XÁC ĐỊNH (dùng số lượng từ: 一个, 三本书, 几个人; không dùng 这/那/anh ấy).",
    rules: [
      "Biểu thị trạng thái tồn tại liên tục: Nơi chốn + Động từ + 着 + Tân ngữ (墙上挂着一幅画).",
      "Biểu thị sự việc mới xuất hiện/xảy ra: Nơi chốn + Động từ + 了 + Tân ngữ (前边来了一辆出租车).",
      "Không thêm giới từ '在' trước từ chỉ nơi chốn ở đầu câu."
    ],
    mistakes: "❌ Sai: 在桌子上放着一本书。➔ ✅ Đúng: 桌子上放着一本书 (Bỏ chữ 在 ở đầu câu).",
    examples: [
      { hanzi: "门前停着很多辆共享单车。", pinyin: "Mén qián tíng zhe hěn duō liàng gòngxiǎng dānchē.", vi: "Trước cửa đang đỗ rất nhiều xe đạp công cộng." },
      { hanzi: "树上落着两只小鸟，正在欢快地唱歌。", pinyin: "Shù shang luò zhe liǎng zhī xiǎoniǎo, zhèngzài huānkuài de chànggē.", vi: "Trên cành cây có hai chú chim nhỏ đang đậu và hót ca ríu rít." }
    ]
  },

  // ==========================================
  // NHÓM 3: HỆ THỐNG 7 BỔ NGỮ THEN CHỐT (COMPLEMENTS - 7 CHỦ ĐIỂM)
  // ==========================================
  {
    id: "g_comp_result",
    category: "complements",
    categoryName: "Hệ Thống 7 Bổ Ngữ (补语)",
    title: "12. Bổ Ngữ Kết Quả (结果补语)",
    formula: "Động từ + [完 / 到 / 见 / 懂 / 错 / 对 / 好 / 清楚 / 开 / 会 / 饱]",
    level: "HSK 2 - 3",
    explanation: "Đứng ngay sát sau động từ để biểu thị hành động đã hoàn thành và đạt được một kết quả rõ rệt. Giữa động từ và bổ ngữ kết quả tuyệt đối KHÔNG ĐƯỢC chèn bất cứ từ nào vào giữa.",
    rules: [
      "完 (xong): 做完, 吃完, 买完",
      "到 / 见 (đạt được, nhìn thấy, nghe thấy): 看到, 听到, 找到, 遇到",
      "懂 (hiểu): 听懂, 看懂",
      "好 (xong xuôi hoàn tất, làm người ta hài lòng): 准备好, 做好, 想好",
      "Phủ định: Dùng '没 / 没有' trước động từ, tuyệt đối không dùng '不' (没听懂)."
    ],
    mistakes: "❌ Sai: 我没看懂了。 (Có 没 thì bỏ 了) ➔ ✅ Đúng: 我没看懂。",
    examples: [
      { hanzi: "这道数学题太难了，我没做对。", pinyin: "Zhè dào shùxué tí tài nán le, wǒ méi zuò duì.", vi: "Bài toán này khó quá, tôi làm chưa đúng." },
      { hanzi: "你听懂老师刚才说的话了吗？", pinyin: "Nǐ tīng dǒng lǎoshī gāngcái shuō de huà le ma?", vi: "Bạn đã nghe hiểu những gì thầy giáo vừa nói chưa?" }
    ]
  },
  {
    id: "g_comp_direction",
    category: "complements",
    categoryName: "Hệ Thống 7 Bổ Ngữ (补语)",
    title: "13. Bổ Ngữ Xu Hướng Đơn & Phức (趋向补语)",
    formula: "Đơn: V + 来 / 去  |  Phức: V + 上来/下去/进来/出去/回来/过去/起来/出来",
    level: "HSK 3 - 4",
    explanation: "Biểu thị hướng di chuyển của hành động so với vị trí của người nói: Hướng về phía người nói dùng '来' (Lai), hướng ra xa người nói dùng '去' (Khứ).",
    rules: [
      "Quy tắc vàng về nơi chốn: Nếu tân ngữ là TỪ CHỈ NƠI CHỐN thì bắt buộc phải đặt TRƯỚC 来/去 (进教室来, 回家去, tuyệt đối không nói 进来越室).",
      "Nghĩa mở rộng của 起来: Bắt đầu và tiếp diễn (笑起来, 唱起来) hoặc hồi tưởng (想起来).",
      "Nghĩa mở rộng của 出来: Nhận biết, phát hiện ra (看出来, 听出来)."
    ],
    mistakes: "❌ Sai: 他跑进去了教室。➔ ✅ Đúng: 他跑进教室去了。",
    examples: [
      { hanzi: "外边太冷了，快进屋来吧！", pinyin: "Wàibiān tài lěng le, kuài jìn wū lái ba!", vi: "Bên ngoài lạnh quá, mau vào trong phòng đi!" },
      { hanzi: "他从书包里拿出来一本厚厚的汉语词典。", pinyin: "Tā cóng shūbāo lǐ ná chūlái yì běn hòuhòu de hànyǔ cídiǎn.", vi: "Anh ấy từ trong cặp sách lấy ra một cuốn từ điển tiếng Trung dày cộp." }
    ]
  },
  {
    id: "g_comp_potential",
    category: "complements",
    categoryName: "Hệ Thống 7 Bổ Ngữ (补语)",
    title: "14. Bổ Ngữ Khả Năng (可能补语: V + 得/不 + Bổ ngữ)",
    formula: "Khẳng định: V + 得 + Bổ ngữ  |  Phủ định: V + 不 + Bổ ngữ",
    level: "HSK 3 - 4",
    explanation: "Biểu thị điều kiện chủ quan hoặc khách quan có cho phép thực hiện được kết quả/xu hướng hay không. Khác với '能/可以 + V' (nhấn mạnh năng lực/quyền hạn), bổ ngữ khả năng nhấn mạnh kết quả có hoàn thành được hay không.",
    rules: [
      "看得懂 (Hiểu được) vs 看不懂 (Không hiểu nổi)",
      "听得见 (Nghe thấy được) vs 听不见 (Không nghe thấy)",
      "买得起 (Có đủ tiền mua) vs 买不起 (Không đủ tiền mua)",
      "吃得完 (Ăn hết được) vs 吃不完 (Ăn không xuể)"
    ],
    mistakes: "❌ Sai: 我不能看得懂。➔ ✅ Đúng: 我看不懂 (Bổ ngữ khả năng không dùng chung với 能).",
    examples: [
      { hanzi: "字写得太小了，我看不清楚。", pinyin: "Zì xiě de tài xiǎo le, wǒ kàn bù qīngchu.", vi: "Chữ viết bé quá, tôi nhìn không rõ." },
      { hanzi: "今天的作业太多，我两个小时做不完。", pinyin: "Jīntiān de zuòyè tài duō, wǒ liǎng gè xiǎoshí zuò bù wán.", vi: "Hôm nay nhiều bài tập quá, tôi hai tiếng làm không xuể." }
    ]
  },
  {
    id: "g_comp_state_degree",
    category: "complements",
    categoryName: "Hệ Thống 7 Bổ Ngữ (补语)",
    title: "15. Bổ Ngữ Trạng Thái & Trình Độ (状态与程度补语)",
    formula: "Động từ + 得 + (Phó từ mức độ) + Tính từ / Cụm miêu tả",
    level: "HSK 3",
    explanation: "Dùng để đánh giá, miêu tả trình độ hoặc trạng thái kết quả của hành động sau khi đã thực hiện thường xuyên hoặc đã xảy ra. Nếu động từ mang tân ngữ, phải lặp lại động từ: 'V + O + V + 得 + Adj' hoặc đưa O lên đầu câu.",
    rules: [
      "Cấu trúc lặp động từ: 他说汉语说得很流利 (Tuyệt đối không nói 他说汉语得很流利).",
      "Đưa tân ngữ lên đầu: 他的汉语说得很流利。",
      "Bổ ngữ trình độ cực độ: Adj + 极了 / 死了 / 得很 / 不得了 (高兴极了, 累死了)."
    ],
    mistakes: "❌ Sai: 他学汉语得很努力。➔ ✅ Đúng: 他学汉语学得很努力 / 他的汉语学得很努力。",
    examples: [
      { hanzi: "姐姐做饭做得非常好吃。", pinyin: "Jiějie zuòfàn zuò de fēicháng hǎochī.", vi: "Chị gái nấu cơm nấu rất ngon." },
      { hanzi: "今天爬了一天的山，大家都累极了。", pinyin: "Jīntiān pá le yì tiān de shān, dàjiā dōu lèi jí le.", vi: "Hôm nay leo núi cả ngày trời, mọi người đều mệt lử cả rồi." }
    ]
  },
  {
    id: "g_comp_time_duration",
    category: "complements",
    categoryName: "Hệ Thống 7 Bổ Ngữ (补语)",
    title: "16. Bổ Ngữ Thời Lượng (时量补语: Thời Gian Kéo Dài)",
    formula: "V + 了 + Khoảng thời gian + (了)  HOẶC  V + O + V + 了 + Khoảng thời gian",
    level: "HSK 3 - 4",
    explanation: "Biểu thị khoảng thời gian mà hành động hoặc trạng thái kéo dài (bao nhiêu tiếng, bao nhiêu ngày, mấy năm...). Nếu cuối câu có thêm chữ '了2', biểu thị hành động đó VẪN ĐANG TIẾP TỤC DIỄN RA ở hiện tại.",
    rules: [
      "Hành động đã kết thúc: 我在中国学了一年汉语。(Đã học 1 năm và giờ không học nữa).",
      "Hành động vẫn đang tiếp tục: 我在中国学了一年汉语了。(Đã học được 1 năm và hiện tại vẫn đang học).",
      "Nếu có tân ngữ xác định (người): V + Tân ngữ + Khoảng thời gian (我等了他半个小时)."
    ],
    mistakes: "❌ Sai: 我学汉语一个小时。➔ ✅ Đúng: 我学了一个小时汉语 / 我学汉语学了一个小时。",
    examples: [
      { hanzi: "昨天晚上我看电影看了两个小时。", pinyin: "Zuótiān wǎnshang wǒ kàn diànyǐng kàn le liǎng gè xiǎoshí.", vi: "Tối qua tôi xem phim suốt 2 tiếng đồng hồ." },
      { hanzi: "他在北京住了五年了，对那里非常熟悉。", pinyin: "Tā zài Běijīng zhù le wǔ nián le, duì nàlǐ fēicháng shúxī.", vi: "Anh ấy đã sống ở Bắc Kinh 5 năm nay rồi, vô cùng quen thuộc nơi đó." }
    ]
  },
  {
    id: "g_comp_action_amount",
    category: "complements",
    categoryName: "Hệ Thống 7 Bổ Ngữ (补语)",
    title: "17. Bổ Ngữ Động Lượng (动量补语: Số Lần Hành Động)",
    formula: "Động từ + [了 / 过] + [次 / 遍 / 声 / 趟 / 场] + Tân ngữ",
    level: "HSK 3 - 4",
    explanation: "Biểu thị số lần diễn ra của động tác. '次' chỉ số lần nói chung; '遍' nhấn mạnh quá trình làm từ đầu chí cuối trọn vẹn; '趟' chỉ số chuyến đi lại.",
    rules: [
      "Nếu tân ngữ là DANH TỪ CHỈ VẬT: Đặt bổ ngữ động lượng trước tân ngữ (去过两次中国, 看了一遍课文).",
      "Nếu tân ngữ là ĐẠI TỪ CHỈ NGƯỜI (我, 你, 他): Đặt tân ngữ trước bổ ngữ động lượng (我找了他三次)."
    ],
    mistakes: "❌ Sai: 我找了三次他。➔ ✅ Đúng: 我找了他三次 (Đại từ chỉ người đứng trước số lần).",
    examples: [
      { hanzi: "这本小说太感人了，我已经看了三遍。", pinyin: "Zhè běn xiǎoshuō tài gǎnrén le, wǒ yǐjīng kàn le sān biàn.", vi: "Quyển tiểu thuyết này cảm động quá, tôi đã đọc từ đầu đến cuối 3 lần rồi." },
      { hanzi: "今年暑假我打算去一趟上海。", pinyin: "Jīnnián shǔjià wǒ dǎsuàn qù yí tàng Shànghǎi.", vi: "Kỳ nghỉ hè năm nay tôi dự định đi một chuyến Thượng Hải." }
    ]
  },
  {
    id: "g_comp_prepositional",
    category: "complements",
    categoryName: "Hệ Thống 7 Bổ Ngữ (补语)",
    title: "18. Bổ Ngữ Giới Từ (介词补语: 在, 到, 给, 向)",
    formula: "Động từ + 在 / 到 / 给 / 向 / 往 + Tân ngữ (Nơi chốn, đối tượng, phương hướng)",
    level: "HSK 3 - 4",
    explanation: "Cụm giới từ đứng sau động từ làm bổ ngữ để bổ nghĩa cho động tác: '在' chỉ điểm rơi nơi chốn lưu giữ; '到' chỉ đích đến; '给' chỉ đối tượng tiếp nhận; '向/往' chỉ hướng dịch chuyển.",
    rules: [
      "V + 在 + Nơi chốn: 住在北京, 放在桌子上, 停在门外",
      "V + 到 + Nơi chốn/Thời gian: 寄到河内, 学到深夜",
      "V + 给 + Người nhận: 送给他, 递给老师, 还给图书馆"
    ],
    mistakes: "❌ Sai: 我把书还他在昨天。➔ ✅ Đúng: 我昨天把书还给他了。",
    examples: [
      { hanzi: "请把这封信交到经理手里。", pinyin: "Qǐng bǎ zhè fēng xìn jiāo dào jīnglǐ shǒulǐ.", vi: "Làm ơn giao bức thư này tận tay giám đốc." },
      { hanzi: "生日那天，朋友送给我一套精美的茶具。", pinyin: "Shēngrì nà tiān, péngyou sòng gěi wǒ yí tào jīngměi de chájù.", vi: "Vào ngày sinh nhật, bạn bè tặng cho tôi một bộ đồ trà tinh xảo." }
    ]
  },

  // ==========================================
  // NHÓM 4: TRỢ TỪ & PHÓ TỪ THEN CHỐT (PARTICLES & ADVERBS - 5 CHỦ ĐIỂM)
  // ==========================================
  {
    id: "g_three_de",
    category: "particles_adverbs",
    categoryName: "Trợ Từ & Phó Từ Then Chốt",
    title: "19. Bộ Ba Trợ Từ Kinh Điển: 的 - 得 - 地",
    formula: "Định ngữ + 的 + Danh từ  |  Động từ + 得 + Bổ ngữ  |  Trạng ngữ + 地 + Động từ",
    level: "HSK 2 - 4",
    explanation: "Ba chữ cùng đọc là 'de' nhưng đóng ba vai trò cú pháp hoàn toàn khác biệt: '的' dùng trước danh từ để làm định ngữ; '得' dùng sau động từ để dẫn ra bổ ngữ trạng thái; '地' dùng sau tính từ/phó từ làm trạng ngữ bổ nghĩa cho động từ đứng sau.",
    rules: [
      "Chữ 的 (Bạch - Thược): 红色的花 (Hoa màu đỏ), 我的书 (Sách của tôi).",
      "Chữ 得 (Đắc): 跑得快 (Chạy nhanh), 学得好 (Học giỏi).",
      "Chữ 地 (Thổ - Địa): 认真地听 (Chăm chú lắng nghe), 慢慢地走 (Chầm chậm bước đi)."
    ],
    mistakes: "❌ Sai: 他跑的地很快 / 他认真的学习。➔ ✅ Đúng: 他跑得很快 / 他认真地学习。",
    examples: [
      { hanzi: "美丽的花朵在春风中快乐地开放，开得非常灿烂。", pinyin: "Měilì de huāduǒ zài chūnfēng zhōng kuàilè de kāifàng, kāi de fēicháng cànlàn.", vi: "Những đóa hoa xinh đẹp (的) nở rộ vui vẻ (地) trong gió xuân, nở rất rực rỡ (得)." },
      { hanzi: "老师耐心地给我们讲解课文，大家都听得很明白。", pinyin: "Lǎoshī nàixīn de gěi wǒmen jiǎngjiě kèwén, dàjiā dōu tīng de hěn míngbai.", vi: "Thầy giáo kiên nhẫn (地) giảng bài cho chúng tôi, ai nấy đều nghe hiểu rất tường tận (得)." }
    ]
  },
  {
    id: "g_le_particles",
    category: "particles_adverbs",
    categoryName: "Trợ Từ & Phó Từ Then Chốt",
    title: "20. Trợ Từ 了 Toàn Diện (Động Thái 了1 vs Ngữ Khí 了2)",
    formula: "Động từ + 了1 (Hoàn thành)  |  Cuối câu + 了2 (Biến đổi tình thái mới)",
    level: "HSK 2 - 4",
    explanation: "'了1' đứng ngay sau động từ để biểu thị hành động đã hoàn thành. '了2' đứng ở cuối câu để biểu thị trạng thái mới xuất hiện, sự thay đổi tình hình hoặc ngữ khí nhắc nhở.",
    rules: [
      "了1 (Động thái): 我买了一本书 (Tôi đã mua 1 quyển sách).",
      "了2 (Ngữ khí biến đổi): 下雨了 (Trời bắt đầu mưa rồi - trước đó không mưa).",
      "Hai chữ 了 cùng xuất hiện: 我学了一年汉语了 (Đã học 1 năm rồi và hiện tại vẫn đang học).",
      "Phủ định: Dùng '没 / 没有' và BẮT BUỘC BỎ '了' (❌ 没买了 ➔ ✅ 没买)."
    ],
    mistakes: "❌ Sai: 昨天我没去了学校。➔ ✅ Đúng: 昨天我没去学校 (Có 没 tuyệt đối không dùng 了).",
    examples: [
      { hanzi: "秋天来了，天气慢慢凉快了。", pinyin: "Qiūtiān lái le, tiānqì mànmàn liángkuai le.", vi: "Mùa thu đã về rồi (biến đổi), thời tiết dần dần mát mẻ hơn (biến đổi)." },
      { hanzi: "吃了晚饭以后，我们一起去公园散步吧。", pinyin: "Chī le wǎnfàn yǐhòu, wǒmen yìqǐ qù gōngyuán sànbù ba.", vi: "Sau khi ăn cơm tối xong (hoàn thành 了1), chúng mình cùng đi công viên dạo bộ nhé." }
    ]
  },
  {
    id: "g_guo_zhe_particles",
    category: "particles_adverbs",
    categoryName: "Trợ Từ & Phó Từ Then Chốt",
    title: "21. Trợ Từ Thời Thái: 过 (Kinh Nghiệm) vs 着 (Trạng Thái Tiếp Diễn)",
    formula: "V + 过 (Đã từng trải qua)  |  V + 着 (Đang duy trì trạng thái)",
    level: "HSK 2 - 3",
    explanation: "'过' biểu thị một hành vi trong quá khứ đã từng xảy ra và nay đã kết thúc, nhấn mạnh kinh nghiệm từng trải. '着' biểu thị hành vi hoặc trạng thái đang được duy trì liên tục ở hiện tại.",
    rules: [
      "V + 过: 去过中国 (Đã từng đi Trung Quốc), 没吃过烤鸭 (Chưa từng ăn vịt quay).",
      "V + 着: 门开着 (Cửa đang mở), 穿着红衣服 (Đang mặc áo đỏ).",
      "V1 + 着 + V2: Biểu thị V1 là phương thức/tư thế để làm V2 (站着聊天 - Đứng trò chuyện)."
    ],
    mistakes: "❌ Sai: 门在开。➔ ✅ Đúng: 门开着 (Biểu thị trạng thái cửa duy trì mở dùng 着).",
    examples: [
      { hanzi: "这本经典小说我以前读过一次，现在还记得大意。", pinyin: "Zhè běn jīngdiǎn xiǎoshuō wǒ yǐqián dú guò yí cì, xiànzài hái jìdé dàyì.", vi: "Quyển tiểu thuyết kinh điển này trước đây tôi đã từng đọc qua một lần, giờ vẫn nhớ đại ý." },
      { hanzi: "桌子上放着一杯热咖啡，正散发着浓郁的香味。", pinyin: "Zhuōzi shang fàng zhe yì bēi rè kāfēi, zhèng sànfā zhe nóngyù de xiāngwèi.", vi: "Trên bàn đang đặt một tách cà phê nóng, lan tỏa hương thơm đậm đà." }
    ]
  },
  {
    id: "g_zai_you_hai",
    category: "particles_adverbs",
    categoryName: "Trợ Từ & Phó Từ Then Chốt",
    title: "22. Phó Từ Lặp Lại: 再 (Tương Lai) vs 又 (Quá Khứ) vs 还 (Tiếp Diễn)",
    formula: "再 + V (Sẽ lặp lại trong tương lai)  |  又 + V (Đã lặp lại trong quá khứ)",
    level: "HSK 3 - 4",
    explanation: "'再' biểu thị hành động lặp lại chưa xảy ra (sẽ làm lại ở tương lai hoặc đưa ra đề xuất). '又' biểu thị hành động lặp lại ĐÃ XẢY RA trong quá khứ hoặc việc xảy ra ngoài ý muốn mang tính chu kỳ.",
    rules: [
      "Tương lai: 明天我再去一次 (Ngày mai tôi sẽ đi lại một lần nữa).",
      "Quá khứ: 昨天他来了，今天又来了 (Hôm qua đến, hôm nay lại đến nữa rồi).",
      "Còn / Vẫn (还): 我还没吃饱，还想再吃一个苹果 (Tôi vẫn chưa no, còn muốn ăn thêm quả táo)."
    ],
    mistakes: "❌ Sai: 昨天他又迟到了，希望明天他不要又迟到。➔ ✅ Đúng: ...希望明天他不要再迟到。",
    examples: [
      { hanzi: "欢迎您下次再来光临我们的餐厅！", pinyin: "Huānyíng nín xià cì zài lái guānglín wǒmen de cāntīng!", vi: "Hoan nghênh quý khách lần sau lại ghé thăm nhà hàng của chúng tôi!" },
      { hanzi: "这个星期他已经又感冒了两次，身体太弱了。", pinyin: "Zhè gè xīngqī tā yǐjīng yòu gǎnmào le liǎng cì, shēntǐ tài ruò le.", vi: "Tuần này anh ấy lại bị cảm cúm đến hai lần rồi, sức khỏe yếu quá." }
    ]
  },
  {
    id: "g_jiu_cai",
    category: "particles_adverbs",
    categoryName: "Trợ Từ & Phó Từ Then Chốt",
    title: "23. Cặp Phó Từ Ngữ Khí: 就 (Nhanh/Sớm) vs 才 (Muộn/Chậm)",
    formula: "Thời gian + 就 + V + 了 (Sớm, nhanh)  |  Thời gian + 才 + V (Muộn, khó khăn, không dùng 了)",
    level: "HSK 3 - 4",
    explanation: "'就' biểu thị người nói cảm thấy hành động xảy ra rất sớm, diễn ra nhanh chóng, thuận lợi hoặc số lượng ít mà đã đủ. '才' biểu thị hành động diễn ra quá muộn, mất nhiều thời gian, gian nan vất vả mới xong. Sau '才' tuyệt đối không dùng '了'.",
    rules: [
      "Sớm: 他早上六点就起床了 (Mới 6 giờ sáng anh ấy đã dậy rồi).",
      "Muộn: 他早上九点才起床 (Tận 9 giờ sáng anh ấy mới ngủ dậy).",
      "Tuyệt đối không dùng 了 sau 才: ❌ 八点才来了 ➔ ✅ 八点才来."
    ],
    mistakes: "❌ Sai: 他昨天晚上十二点才睡觉了。➔ ✅ Đúng: 他昨天晚上十二点才睡觉 (Bỏ 了).",
    examples: [
      { hanzi: "坐飞机去上海两个小时就到了，非常方便。", pinyin: "Zuò fēijī qù Shànghǎi liǎng gè xiǎoshí jiù dào le, fēicháng fāngbiàn.", vi: "Đi máy bay đến Thượng Hải chỉ 2 tiếng là tới nơi rồi, rất tiện lợi." },
      { hanzi: "昨天下班路上大堵车，我晚上九点才回到家。", pinyin: "Zuótiān xiàbān lù shang dà dǔchē, wǒ wǎnshang jiǔ diǎn cái huí dào jiā.", vi: "Hôm qua lúc tan làm đường tắc nghẽn kinh hoàng, tận 9 giờ tối tôi mới về tới nhà." }
    ]
  },

  // ==========================================
  // NHÓM 5: MẠCH LIÊN TỪ & CẶP CỐ ĐỊNH (FIXED CONNECTORS - 3 CHỦ ĐIỂM TOÀN DIỆN)
  // ==========================================
  {
    id: "g_conn_contrast",
    category: "fixed_connectors",
    categoryName: "Mạch Liên Từ & Cặp Cố Định",
    title: "24. Cặp Liên Từ Nhượng Bộ & Chuyển Ngoặt (虽然...但是..., 尽管...还是...)",
    formula: "虽然 / 尽管 + [Mệnh đề A] ， 但是 / 可是 / 还是 + [Mệnh đề B]",
    level: "HSK 3 - 4",
    explanation: "Dùng để nối hai mệnh đề có ý nghĩa tương phản hoặc nhượng bộ: Vế đầu thừa nhận một sự thật/khó khăn, vế sau chuyển hướng nhấn mạnh kết quả tích cực hoặc ý chí kiên định.",
    rules: [
      "Tuy... nhưng...: 虽然天气很冷，但是他依然坚持跑步。",
      "Dù cho... vẫn...: 尽管遇到很多挫折，他还是没有放弃梦想。",
      "Thậm chí dẫu có...: 哪怕工作再累，我也要每天学半个小时中文。"
    ],
    mistakes: "❌ Sai: 虽然他不聪明，所以他很努力。➔ ✅ Đúng: 虽然他不聪明，但是他非常努力。",
    examples: [
      { hanzi: "虽然汉语学起来不容易，但是只要坚持就能学好。", pinyin: "Suīrán hànyǔ xué qǐlai bù róngyì, dànshì zhǐyào jiānchí jiù néng xué hǎo.", vi: "Tuy học tiếng Trung không hề dễ dàng, nhưng chỉ cần kiên trì ắt sẽ học giỏi." },
      { hanzi: "尽管外面的雨下得很大，工人们还是准时到达了工地上班。", pinyin: "Jǐnguǎn wàimiàn de yǔ xià de hěn dà, gōngrén men háishì zhǔnshí dàodá le gōngdì shàngbān.", vi: "Mặc dù ngoài trời mưa như trút nước, các công nhân vẫn đến công trường đúng giờ." }
    ]
  },
  {
    id: "g_conn_condition",
    category: "fixed_connectors",
    categoryName: "Mạch Liên Từ & Cặp Cố Định",
    title: "25. Cặp Liên Từ Điều Kiện: 只要...就... (Đủ) vs 只有...才... (Cần)",
    formula: "只要 + Điều kiện đủ + 就 + Kết quả  |  只有 + Điều kiện duy nhất cần + 才 + Kết quả",
    level: "HSK 3 - 4",
    explanation: "'只要...就...' biểu thị điều kiện thuận lợi, chỉ cần đáp ứng điều kiện A là tất yếu sẽ có kết quả B. '只有...才...' biểu thị điều kiện DUY NHẤT, bắt buộc phải có điều kiện A thì mới đạt được kết quả B.",
    rules: [
      "只要...就...: Chỉ cần... thì... (Chỉ cần bạn thích thì tôi sẽ mua cho).",
      "只有...才...: Chỉ có... mới... (Chỉ có nỗ lực hết mình mới thành công).",
      "Phân biệt cặp từ: Tuyệt đối không ghép lộn '只要...才...' hay '只有...就...'."
    ],
    mistakes: "❌ Sai: 只要努力才能成功。➔ ✅ Đúng: 只要努力就能成功 / 只有努力才能成功。",
    examples: [
      { hanzi: "只要你肯花时间练习，听力水平就一定会提高。", pinyin: "Zhǐyào nǐ kěn huā shíjiān liànxí, tīnglì shuǐpíng jiù yídìng huì tígāo.", vi: "Chỉ cần bạn chịu khó dành thời gian luyện tập thì trình độ nghe nhất định sẽ tiến bộ." },
      { hanzi: "在现代社会中，只有不断学习新技能，才不会被时代淘汰。", pinyin: "Zài xiàndài shèhuì zhōng, zhǐyǒu búduàn xuéxí xīn jìnéng, cái bú huì bèi shídài táotài.", vi: "Trong xã hội hiện đại, chỉ có không ngừng học kỹ năng mới thì mới không bị đào thải." }
    ]
  },
  {
    id: "g_conn_progress_parallel",
    category: "fixed_connectors",
    categoryName: "Mạch Liên Từ & Cặp Cố Định",
    title: "26. Cặp Liên Từ Tăng Tiến & Song Hành (不仅...而且..., 一边...一边...)",
    formula: "不仅 / 不但 + A ， 而且 / 还 + B  |  一边 + Hành động 1 + 一边 + Hành động 2",
    level: "HSK 3 - 4",
    explanation: "'不仅...而且...' biểu thị mức độ ý nghĩa vế sau tiến xa hơn một bậc so với vế trước (Không những... mà còn...). '一边...一边...' biểu thị hai hành động cùng được tiến hành song song tại cùng một thời điểm.",
    rules: [
      "Nếu cùng một chủ ngữ: Đặt chủ ngữ TRƯỚC 不仅 (他不仅会中文，而且还会法语).",
      "Nếu hai chủ ngữ khác nhau: Đặt 不仅 TRƯỚC chủ ngữ 1 (不仅我会中文，而且我妹妹也会中文).",
      "一边...一边...: Hai hành động phải diễn ra đồng thời (一边听音乐一边跑步)."
    ],
    mistakes: "❌ Sai khi chủ ngữ khác nhau: 我不仅去，而且他也去。➔ ✅ Đúng: 不仅我去，而且他也去。",
    examples: [
      { hanzi: "多阅读优秀的中文书籍，不仅能积累词汇，而且还能了解中国文化。", pinyin: "Duō yuèdú yōuxiù de zhōngwén shūjí, bùjǐn néng jīlěi cíhuì, érqiě hái néng liǎojiě Zhōngguó wénhuà.", vi: "Đọc nhiều sách tiếng Trung hay không những giúp tích lũy từ vựng mà còn hiểu thêm văn hóa." },
      { hanzi: "周末的下午，爷爷喜欢一边喝茶一边看报纸。", pinyin: "Zhōumò de xiàwǔ, yéye xǐhuan yìbiān hē chá yìbiān kàn bàozhǐ.", vi: "Chiều cuối tuần, ông nội thích vừa nhâm nhi chén trà vừa thong thả đọc báo." }
    ]
  }
];

// Write to data/grammar_compendium.json
const dest = path.join(__dirname, 'data', 'grammar_compendium.json');
fs.writeFileSync(dest, JSON.stringify(grammarCompendium, null, 2), 'utf8');
console.log(`Đã xuất sắc nâng cấp Cẩm Nang Ngữ Pháp lên ${grammarCompendium.length} Chuyên Đề Cốt Lõi tại ${dest}`);
