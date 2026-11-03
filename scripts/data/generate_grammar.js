const { dataFile } = require('./paths');
const fs = require('fs');
const path = require('path');

const grammarCompendium = [
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
    id: "g_ba_sentence",
    category: "ba_bei",
    categoryName: "Cấu Trúc Chữ 把 & 被",
    title: "3. Câu Chữ 把 Toàn Diện (把字句)",
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
      { hanzi: "请你把桌子上的茶杯洗干净。", pinyin: "Qǐng nǐ bǎ zhuōzi shang de chábēi xǐ gānjìng.", vi: "Làm ơn rửa sạch cốc trà trên bàn." },
      { hanzi: "他把新买的手机放在包里了。", pinyin: "Tā bǎ xīn mǎi de shǒujī fàng zài bāo lǐ le.", vi: "Anh ấy đã cất chiếc điện thoại mới mua vào trong túi xách." }
    ]
  },
  {
    id: "g_bei_sentence",
    category: "ba_bei",
    categoryName: "Cấu Trúc Chữ 把 & 被",
    title: "4. Câu Bị Động Chữ 被 (被字句)",
    formula: "Chủ thể bị tác động + 被 (叫 / 让) + Tác nhân gây ra + Động từ + Thành phần khác",
    level: "HSK 3 - 4",
    explanation: "Biểu thị thể bị động, chủ thể chịu tác động xấu, không may hoặc không mong muốn do người khác hoặc hoàn cảnh gây ra.",
    rules: [
      "Có thể ẩn tác nhân: Chủ thể + 被 + Động từ + Thành phần khác (vd: 钱包被偷了)",
      "Khi dùng '让' hoặc '叫' thay cho '被' thì BẮT BUỘC phải có tác nhân đi kèm, không được bỏ trống tác nhân.",
      "Phủ định: Dùng '没有' hoặc '没' đặt trước 被/叫/让, không được dùng '不'."
    ],
    mistakes: "❌ Sai: 苹果叫吃了。➔ ✅ Đúng: 苹果被吃了 / 苹果叫弟弟吃了。",
    examples: [
      { hanzi: "我的自行车被弟弟骑走了。", pinyin: "Wǒ de zìxíngchē bèi dìdi qí zǒu le.", vi: "Xe đạp của tôi đã bị em trai đạp đi mất rồi." },
      { hanzi: "他昨天在街上被雨淋湿了。", pinyin: "Tā zuótiān zài jiē shang bèi yǔ lín shī le.", vi: "Hôm qua anh ấy ở trên đường bị mưa làm ướt sũng." }
    ]
  },
  {
    id: "g_potential_complement",
    category: "complements",
    categoryName: "Bổ Ngữ Nâng Cao",
    title: "5. Bổ Ngữ Khả Năng (V + 得 / 不 + C)",
    formula: "Khẳng định: V + 得 + C | Phủ định: V + 不 + C | Nghi vấn: V + 得 + C + V + 不 + C ?",
    level: "HSK 3 - 4",
    explanation: "Dùng để biểu thị điều kiện khách quan hoặc năng lực chủ quan có cho phép thực hiện hành động để đạt kết quả/xu hướng đó hay không.",
    rules: [
      "Khẳng định: 做得完 (làm xong được), 看得懂 (đọc hiểu được), 买得起 (đủ tiền mua)",
      "Phủ định: 做不完 (không làm xong nổi), 看不懂 (không hiểu nổi), 买不起 (không đủ tiền mua)",
      "Khác biệt với 能/可以: 能/可以 thường nhấn mạnh sự cho phép hoặc năng lực tổng quát; còn V+得/不+C nhấn mạnh kết quả cụ thể trong tình huống hiện tại."
    ],
    mistakes: "❌ Sai: 我不能看得懂。➔ ✅ Đúng: 我看不懂 / 我不能看懂。",
    examples: [
      { hanzi: "老师说得太快了，我听不懂。", pinyin: "Lǎoshī shuō de tài kuài le, wǒ tīng bu dǒng.", vi: "Thầy giáo nói nhanh quá, tôi nghe không hiểu nổi." },
      { hanzi: "作业太多了，我今天做不完。", pinyin: "Zuòyè tài duō le, wǒ jīntiān zuò bu wán.", vi: "Bài tập nhiều quá, hôm nay tôi không làm xong nổi đâu." }
    ]
  },
  {
    id: "g_compound_directional",
    category: "complements",
    categoryName: "Bổ Ngữ Nâng Cao",
    title: "6. Bổ Ngữ Xu Hướng Kép (复合趋向补语)",
    formula: "Động từ + (上 / 下 / 进 / 出 / 回 / 过 / 起) + (来 / 去)",
    level: "HSK 3 - 5",
    explanation: "Bổ ngữ xu hướng kép không chỉ chỉ hướng vận động vật lý (tiến về phía người nói dùng '来', rời xa người nói dùng '去'), mà còn mang nhiều nghĩa bóng trừu tượng rất phổ biến trong đề thi HSK.",
    rules: [
      "Vị trí tân ngữ nơi chốn: BẮT BUỘC đặt giữa xu hướng và 来/去 (vd: 跑进教室来, không nói 跑进来教室).",
      "Nghĩa bóng 起来: Biểu thị động tác bắt đầu và tiếp diễn (笑起来, 哭起来), hoặc thu gom lại (收起来).",
      "Nghĩa bóng 下去: Biểu thị động tác đang diễn ra tiếp tục kéo dài không ngừng (坚持下去, 读下去).",
      "Nghĩa bóng 出来: Biểu thị từ vô hình thành hữu hình, nhận ra, nghĩ ra (想出来, 看出来, 听出来)."
    ],
    mistakes: "❌ Sai: 他跑出来家。➔ ✅ Đúng: 他从家里跑出来 / 他跑出家门来。",
    examples: [
      { hanzi: "听到这个好消息，大家高兴得跳了起来。", pinyin: "Tīng dào zhè ge hǎo xiāoxi, dàjiā gāoxìng de tiào le qǐlai.", vi: "Nghe tin tốt này, mọi người vui sướng nhảy cẫng cả lên." },
      { hanzi: "只要你坚持学下去，就一定能通过HSK 6级。", pinyin: "Zhǐyào nǐ jiānchí xué xiàqu, jiù yídìng néng tōngguò HSK 6 jí.", vi: "Chỉ cần bạn kiên trì học tiếp, nhất định sẽ đỗ HSK cấp 6." }
    ]
  },
  {
    id: "g_jiu_cai",
    category: "particles_adverbs",
    categoryName: "Phân Biệt Hư Từ & Phó Từ",
    title: "7. Phân Biệt Cặp Phó Từ 就 vs 才",
    formula: "Thời gian / Điều kiện + 就 (sớm, nhanh, dễ) | Thời gian / Điều kiện + 才 (muộn, chậm, khó khăn)",
    level: "HSK 2 - 3",
    explanation: "Cùng đứng trước động từ nhưng mang sắc thái tâm lý hoàn toàn đối lập: '就' cảm thấy hành động xảy ra sớm, nhanh, thuận lợi; '才' cảm thấy hành động xảy ra muộn màng, tốn nhiều thời gian và gian nan.",
    rules: [
      "Hành động sớm: 八点上课，他七点半就来了。(8h vào học, 7h30 anh ấy ĐÃ ĐẾN rồi).",
      "Hành động muộn: 八点上课，他八点半才来。(8h vào học, 8h30 anh ấy MỚI ĐẾN).",
      "Chữ 就 thường kết hợp trợ từ '了' cuối câu; chữ 才 tuyệt đối KHÔNG đi kèm '了'."
    ],
    mistakes: "❌ Sai: 他昨天很晚才来了。➔ ✅ Đúng: 他昨天很晚才来。",
    examples: [
      { hanzi: "坐高铁只要两个小时就到了。", pinyin: "Zuò gāotiě zhǐ yào liǎng gè xiǎoshí jiù dào le.", vi: "Đi tàu cao tốc chỉ cần 2 tiếng là ĐÃ ĐẾN rồi." },
      { hanzi: "我想了半天，才想出这个办法。", pinyin: "Wǒ xiǎng le bàntiān, cái xiǎng chū zhè ge bànfǎ.", vi: "Tôi suy nghĩ nửa ngày trời, MỚI NGHĨ RA được cách này." }
    ]
  },
  {
    id: "g_connectors_budan",
    category: "fixed_connectors",
    categoryName: "Cặp Liên Từ Cố Định",
    title: "8. Cặp Liên Từ Tăng Tiến: 不但...而且... (Không những... mà còn...)",
    formula: "Chủ ngữ + 不但 + Vế 1 + 而且/还/也 + Vế 2",
    level: "HSK 3 - 4",
    explanation: "Dùng để biểu thị quan hệ tăng tiến về mức độ, phạm vi hoặc ý nghĩa giữa hai phân câu.",
    rules: [
      "Cùng một chủ ngữ: Chủ ngữ đặt TRƯỚC 不但 (vd: 他不但会说汉语，而且还会说法语).",
      "Hai chủ ngữ khác nhau: 不但 đặt TRƯỚC chủ ngữ 1 (vd: 不但他喜欢，而且我也喜欢).",
      "Có thể thay '不但' bằng '不仅' hoặc '不光'; thay '而且' bằng '并且', '还', '也'."
    ],
    mistakes: "❌ Sai khi khác chủ ngữ: 他不但喜欢，而且我也喜欢。➔ ✅ Đúng: 不但他喜欢，而且我也喜欢。",
    examples: [
      { hanzi: "北京不仅是中国的首都，而且是一座历史文化名城。", pinyin: "Běijīng bùjǐn shì Zhōngguó de shǒudū, érqiě shì yí zuò lìshǐ wénhuà míngchéng.", vi: "Bắc Kinh không những là thủ đô của Trung Quốc, mà còn là một danh thành văn hóa lịch sử." },
      { hanzi: "他不但学习努力，而且乐于助人。", pinyin: "Tā búdàn xuéxí nǔlì, érqiě lè yú zhù rén.", vi: "Anh ấy không những học hành chăm chỉ, mà còn rất thích giúp đỡ người khác." }
    ]
  }
];

const dest = dataFile('grammar_compendium.json');
fs.writeFileSync(dest, JSON.stringify(grammarCompendium, null, 2), 'utf8');
console.log(`Đã tạo thành công ${grammarCompendium.length} Cấu Trúc Ngữ Pháp Toàn Thư tại ${dest}`);
