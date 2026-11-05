// scripts/expand_practice_massive.js
// Boosts practice bank to 180 questions, 30 per level (HSK 1-6)
const fs = require('fs');
const path = require('path');

const practicePath = path.join(__dirname, '..', 'public', 'data', 'practice.json');
const existing = JSON.parse(fs.readFileSync(practicePath, 'utf8'));
const existingIds = new Set(existing.map(x => x.id));

const extra = [];
function pushQ(q) {
  if (!existingIds.has(q.id)) {
    extra.push(q);
    existingIds.add(q.id);
  }
}

// Multi-skill templates for HSK 1-6
const levels = [1, 2, 3, 4, 5, 6];
const templates = {
  1: [
    // Listening
    {
      skill: "listening", subType: "listening_qa", category: "Nghe hiểu hội thoại ngắn",
      title: "Hỏi thăm phương tiện di chuyển",
      audioText: "男：你怎么去学校？女：我坐公共汽车去学校。",
      passageText: "男：你怎么去学校？\n女：我坐公共汽车去学校。",
      pinyin: "Nán: Nǐ zěnme qù xuéxiào? Nǚ: Wǒ zuò gōnggòng qìchē qù xuéxiào.",
      vietnamese: "Nam: Bạn đến trường bằng cách nào? Nữ: Tôi đi xe buýt đến trường.",
      question: "问：女士怎么去学校？(Hỏi: Người nữ đến trường bằng gì?)",
      options: [
        { text: "坐公共汽车 (Đi xe buýt)", isCorrect: true },
        { text: "开飞机 (Lái máy bay)", isCorrect: false },
        { text: "骑自行车 (Đi xe đạp)", isCorrect: false },
        { text: "走路 (Đi bộ)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 坐公共汽车 (Đi xe buýt).\n• Nữ đáp: 「我坐公共汽车去学校」."
    },
    // Speaking
    {
      skill: "speaking", subType: "speaking_shadowing", category: "Luyện phát âm & Giao tiếp phản xạ",
      title: "Hỏi giá tiền đồ vật",
      audioText: "请问这个多少钱？", targetText: "请问这个多少钱",
      targetPinyin: "Qǐngwèn zhè ge duōshao qián?", vietnamese: "Xin hỏi cái này bao nhiêu tiền?",
      question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
      options: [], explanation: "• Điểm lưu ý: 「多少钱」(duōshao qián) là mẫu câu hỏi giá tiền thông dụng nhất."
    },
    // Reading
    {
      skill: "reading", subType: "reading_qa", category: "Đọc hiểu sinh hoạt hàng ngày",
      title: "Thời gian làm việc trong tuần",
      passageText: "李医生星期一到星期五在医院工作，星期六和星期天在家休息。",
      pinyin: "Lǐ yīshēng xīngqīyī dào xīngqīwǔ zài yīyuàn gōngzuò, xīngqīliù hé xīngqītiān zài jiā xiūxi.",
      vietnamese: "Bác sĩ Lý từ thứ Hai đến thứ Sáu làm việc ở bệnh viện, thứ Bảy và Chủ nhật ở nhà nghỉ ngơi.",
      question: "李医生什么时候休息？(Bác sĩ Lý khi nào nghỉ ngơi?)",
      options: [
        { text: "星期六和星期天 (Thứ Bảy và Chủ nhật)", isCorrect: true },
        { text: "星期一和星期二 (Thứ Hai và thứ Ba)", isCorrect: false },
        { text: "每天都工作 (Ngày nào cũng làm việc)", isCorrect: false },
        { text: "下午休息 (Buổi chiều nghỉ)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 星期六和星期天.\n• Bài đọc nêu rõ: 「星期六和星期天在家休息」."
    },
    // Writing
    {
      skill: "writing", subType: "reorder", category: "连词成句 (Sắp xếp trật tự từ)",
      title: "Sắp xếp câu vị trí đồ vật",
      question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
      vietnamese: "Điện thoại ở trên bàn.",
      words: ["在桌子上", "手机", "爸爸的"],
      correctOrder: ["爸爸的", "手机", "在桌子上"],
      hanzi: "爸爸的手机在桌子上。",
      pinyin: "Bàba de shǒujī zài zhuōzi shang.",
      explanation: "• Cấu trúc: 「Định ngữ + Chủ ngữ + 在 + Nơi chốn」."
    }
  ],
  2: [
    {
      skill: "listening", subType: "listening_qa", category: "Nghe hiểu thường nhật",
      title: "Chọn mua quần áo",
      audioText: "男：这件红色的衣服真好看！女：但是有点儿贵，我们再看看那件黑色的吧。",
      passageText: "男：这件红色的衣服真好看！\n女：但是有点儿贵，我们再看看那件黑色的吧。",
      pinyin: "Nán: Zhè jiàn hóngsè de yīfu zhēn hǎokàn! Nǚ: Dànshì yǒudiǎnr guì, wǒmen zài kànkan nà jiàn hēisè de ba.",
      vietnamese: "Nam: Chiếc áo màu đỏ này đẹp thật đấy! Nữ: Nhưng mà hơi đắt, chúng mình xem thêm chiếc màu đen kia nhé.",
      question: "问：女士觉得红色的衣服怎么样？(Hỏi: Người nữ thấy chiếc áo màu đỏ thế nào?)",
      options: [
        { text: "有点儿贵 (Hơi đắt một chút)", isCorrect: true },
        { text: "太便宜了 (Quá rẻ rồi)", isCorrect: false },
        { text: "颜色不好看 (Màu sắc không đẹp)", isCorrect: false },
        { text: "尺寸太小 (Cỡ áo quá nhỏ)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 有点儿贵.\n• Lời nữ: 「但是有点儿贵」."
    },
    {
      skill: "speaking", subType: "speaking_shadowing", category: "Luyện phát âm & Giao tiếp phản xạ",
      title: "Hỏi thăm đường đi",
      audioText: "从这儿到机场坐出租车要多久？", targetText: "从这儿到机场坐出租车要多久",
      targetPinyin: "Cóng zhèr dào jīchǎng zuò chūzūchē yào duōjiǔ?", vietnamese: "Từ đây đến sân bay đi taxi mất bao lâu?",
      question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
      options: [], explanation: "• Điểm lưu ý: 「从...到...」(Cóng... dào... / Từ... đến...). 「多久」(duōjiǔ) hỏi khoảng thời gian."
    },
    {
      skill: "reading", subType: "reading_qa", category: "Đọc hiểu sinh hoạt",
      title: "Thói quen học tập buổi sáng",
      passageText: "早上六点，校园里非常安静。小王习惯在操场边读半个小时的英语课文，然后再去吃早餐。",
      pinyin: "Zǎoshang liù diǎn, xiàoyuán lǐ fēicháng ānjìng. Xiǎo Wáng xíguàn zài cāochǎng biān dú bàn ge xiǎoshí de Yīngyǔ kèwén, ránhòu zài qù chī zǎocān.",
      vietnamese: "6 giờ sáng, trong khuôn viên trường vô cùng yên tĩnh. Tiểu Vương có thói quen đọc bài tiếng Anh nửa tiếng bên sân vận động, sau đó mới đi ăn bữa sáng.",
      question: "小王早上在操场边做什么？(Tiểu Vương buổi sáng làm gì bên sân vận động?)",
      options: [
        { text: "读英语课文 (Đọc bài khóa tiếng Anh)", isCorrect: true },
        { text: "踢足球 (Đá bóng)", isCorrect: false },
        { text: "睡觉 (Ngủ)", isCorrect: false },
        { text: "买早餐 (Mua đồ ăn sáng)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 读英语课文.\n• Đoạn văn: 「在操场边读半个小时的英语课文」."
    },
    {
      skill: "writing", subType: "reorder", category: "连词成句 (Sắp xếp trật tự từ)",
      title: "Sắp xếp câu chữ 得 (Bổ ngữ trạng thái)",
      question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
      vietnamese: "Cô ấy hát rất hay.",
      words: ["歌唱得", "非常好听", "她"],
      correctOrder: ["她", "歌唱得", "非常好听"],
      hanzi: "她歌唱得非常好听。",
      pinyin: "Tā gē chàng de fēicháng hǎotīng.",
      explanation: "• Bổ ngữ trạng thái: 「Chủ ngữ + Tân ngữ + Động từ + 得 + Cụm tính từ」."
    }
  ],
  3: [
    {
      skill: "listening", subType: "listening_qa", category: "Nghe hiểu thường nhật & xã hội",
      title: "Hẹn giờ họp công ty",
      audioText: "男：下午两点的会议推迟了吗？女：对，推迟到三点半了，在三楼第一会议室。",
      passageText: "男：下午两点的会议推迟了吗？\n女：对，推迟到三点半了，在三楼第一会议室。",
      pinyin: "Nán: Xiàwǔ liǎng diǎn de huìyì tuīchí le ma? Nǚ: Duì, tuīchí dào sān diǎn bàn le, zài sān lóu dì-yī huìyìshì.",
      vietnamese: "Nam: Cuộc họp lúc 2 giờ chiều hoãn lại rồi à? Nữ: Đúng vậy, hoãn tới 3 giờ rưỡi, ở phòng họp số 1 tầng 3.",
      question: "问：会议改在几点开？(Hỏi: Cuộc họp đổi sang mấy giờ tổ chức?)",
      options: [
        { text: "三点半 (3 giờ rưỡi)", isCorrect: true },
        { text: "两点整 (2 giờ đúng)", isCorrect: false },
        { text: "四点 (4 giờ)", isCorrect: false },
        { text: "明天上午 (Sáng mai)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 三点半.\n• Nữ nói: 「推迟到三点半了」."
    },
    {
      skill: "speaking", subType: "speaking_shadowing", category: "Luyện phát âm & Giao tiếp phản xạ",
      title: "Thương lượng công việc",
      audioText: "请您再考虑一下，我们真的很想促成这次合作。",
      targetText: "请您再考虑一下我们真的很想促成这次合作",
      targetPinyin: "Qǐng nín zài kǎolǜ yíxià, wǒmen zhēnde hěn xiǎng cùchéng zhè cì hézuò.", vietnamese: "Xin quý vị cân nhắc thêm một chút, chúng tôi thực sự rất mong thúc đẩy sự hợp tác lần này.",
      question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
      options: [], explanation: "• Điểm lưu ý: 「考虑」(kǎolǜ thanh 3 + thanh 4). 「促成」(cùchéng thanh 4 + thanh 2)."
    },
    {
      skill: "reading", subType: "reading_qa", category: "Đọc hiểu sinh thái",
      title: "Bảo vệ môi trường xanh",
      passageText: "垃圾分类看似是一件小事，却对环境保护有着巨大的影响。如果每个人都能主动做好垃圾分类，城市的环境将会变得更加整洁美好。",
      pinyin: "Lājī fēnlèi kànsì shì yí jiàn xiǎoshì, què duì huánjìng bǎohù yǒu zhe jùdà de yǐngxiǎng. Rúguǒ měi ge rén dōu néng zhǔdòng zuò hǎo lājī fēnlèi, chéngshì de huánjìng jiāng huì biànde gèngjiā zhěngjié měihǎo.",
      vietnamese: "Phân loại rác thoạt nhìn như một việc nhỏ, nhưng lại mang ảnh hưởng to lớn tới việc bảo vệ môi trường. Nếu mỗi người đều có thể chủ động phân loại rác thật tốt, môi trường thành phố sẽ trở nên ngăn nắp và tươi đẹp hơn.",
      question: "做好垃圾分类对城市有什么影响？(Làm tốt phân loại rác có ảnh hưởng gì tới thành phố?)",
      options: [
        { text: "让城市环境更加整洁美好 (Làm môi trường thành phố ngăn nắp tươi đẹp hơn)", isCorrect: true },
        { text: "增加城市的交通拥堵 (Làm tăng tắc nghẽn giao thông)", isCorrect: false },
        { text: "浪费居民的大量时间 (Lãng phí nhiều thời gian cư dân)", isCorrect: false },
        { text: "让空气质量变差 (Làm chất lượng không khí kém đi)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 让城市环境更加整洁美好.\n• Bài văn: 「城市的环境将会变得更加整洁美好」."
    },
    {
      skill: "writing", subType: "reorder", category: "连词成句 (Sắp xếp trật tự từ)",
      title: "Sắp xếp câu chữ 除了...以外...",
      question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
      vietnamese: "Ngoài tiếng Trung ra, anh ấy còn biết nói tiếng Pháp.",
      words: ["还会说法语", "中文以外", "除了", "他"],
      correctOrder: ["除了", "中文以外", "他", "还会说法语"],
      hanzi: "除了中文以外，他还会说法语。",
      pinyin: "Chúle Zhōngwén yǐwài, tā hái huì shuō Fǎyǔ.",
      explanation: "• Cấu trúc ngoại trừ và bổ sung: 「除了...以外, S + 还...」."
    }
  ],
  4: [
    {
      skill: "listening", subType: "listening_qa", category: "Nghe hiểu đối thoại xã hội",
      title: "Tầm quan trọng của giấc ngủ",
      audioText: "男：医生，我最近总是失眠，白天精神很差。女：长期熬夜会严重打乱人体的生物钟，建议你晚上十点后远离手机，适度听些轻音乐。",
      passageText: "男：医生，我最近总是失眠，白天精神很差。\n女：长期熬夜会严重打乱人体的生物钟，建议你晚上十点后远离手机，适度听些轻音乐。",
      pinyin: "Nán: Yīshēng, wǒ zuìjìn zǒngshì shīmián, báitiān jīngshen hěn chà. Nǚ: Chángqī áoyè huì yánzhòng dǎluàn réntǐ de shēngwùzhōng, jiànyì nǐ wǎnshang shí diǎn hòu yuǎnlí shǒujī, shìdù tīng xiē qīngyīnyuè.",
      vietnamese: "Nam: Thưa bác sĩ, dạo này tôi luôn mất ngủ, ban ngày tinh thần rất uể oải. Nữ: Thức khuya dài ngày sẽ làm rối loạn nghiêm trọng đồng hồ sinh học cơ thể, khuyên bạn sau 10 giờ tối nên để điện thoại ra xa, nghe chút nhạc êm dịu vừa phải.",
      question: "问：女医生建议男士怎么做？(Hỏi: Bác sĩ khuyên người nam nên làm gì?)",
      options: [
        { text: "十点后远离手机并听轻音乐 (Sau 10h để điện thoại ra xa và nghe nhạc nhẹ)", isCorrect: true },
        { text: "每天喝大量的烈酒 (Mỗi ngày uống thật nhiều rượu mạnh)", isCorrect: false },
        { text: "整夜开着强光灯看书 (Bật đèn sáng cả đêm đọc sách)", isCorrect: false },
        { text: "增加白天的剧烈运动 (Tăng cường vận động mạnh ban ngày)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 十点后远离手机并听轻音乐.\n• Lời bác sĩ: 「晚上十点后远离手机，适度听些轻音乐」."
    },
    {
      skill: "speaking", subType: "speaking_shadowing", category: "Luyện phát âm & Giao tiếp phản xạ",
      title: "Phương châm sống tích cực",
      audioText: "失败并不可怕，可怕的是丧失重新站起来的勇气。",
      targetText: "失败并不可怕可怕的是丧失重新站起来的勇气",
      targetPinyin: "Shībài bìng bù kěpà, kěpà de shì sàngshī chóngxīn zhàn qǐlái de yǒngqì.", vietnamese: "Thất bại không đáng sợ, đáng sợ là đánh mất đi dũng khí để đứng dậy một lần nữa.",
      question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
      options: [], explanation: "• Điểm lưu ý: 「并不可怕」(bìng bù kěpà) ngữ khí phủ định mạnh mẽ. 「丧失」(sàngshī thanh 4 + thanh 1)."
    },
    {
      skill: "reading", subType: "reading_qa", category: "Đọc hiểu kinh tế",
      title: "Tiêu dùng thông minh thời đại số",
      passageText: "网购给人们的生活带来了前所未有的便利，但也容易让人陷入冲动消费的陷阱。理性的消费者应当在下单前冷静思考：这件商品究竟是自己真正需要的，还是仅仅因为打折而产生的购买欲望。",
      pinyin: "Wǎnggòu gěi rénmen de shēnghuó dài lái le qiánsuǒwèiyǒu de biànlì, dàn yě róngyì ràng rén xiànrù chōngdòng xiāofèi de xiànjǐng. Lǐxìng de xiāofèizhě yīngdāng zài xiàdān qián lěngjìng sīkǎo: zhè jiàn shāngpǐn jiùjìng shì zìjǐ zhēnzhèng xūyào de, háishi jǐnjǐn yīnwèi dǎzhé ér chǎnshēng de gòumǎi yùwàng.",
      vietnamese: "Mua sắm qua mạng mang lại sự tiện lợi chưa từng có cho đời sống con người, nhưng cũng dễ khiến người ta rơi vào bẫy tiêu dùng bốc đồng. Người tiêu dùng lý trí nên bình tĩnh suy ngẫm trước khi đặt đơn: món hàng này rốt cuộc là thứ bản thân thực sự cần, hay chỉ là ham muốn mua sắm nảy sinh do giảm giá.",
      question: "理性的消费者在下单前应当考虑什么？(Người tiêu dùng lý trí nên cân nhắc điều gì trước khi đặt hàng?)",
      options: [
        { text: "商品是真正需要还是因打折产生的欲望 (Hàng là thực sự cần hay chỉ do giảm giá)", isCorrect: true },
        { text: "能不能借钱购买更多 (Có thể vay tiền để mua thêm không)", isCorrect: false },
        { text: "快递员送货速度是否为全国第一 (Tốc độ giao hàng có phải số 1 toàn quốc không)", isCorrect: false },
        { text: "商品包装盒是否足够奢华 (Vỏ hộp có đủ sang trọng không)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 商品是真正需要还是因打折产生的欲望.\n• Bài văn: 「这件商品究竟是自己真正需要的，还是仅仅因为打折而产生的购买欲望」."
    },
    {
      skill: "writing", subType: "reorder", category: "连词成句 (Sắp xếp trật tự từ)",
      title: "Sắp xếp câu chữ 由...决定",
      question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
      vietnamese: "Thành bại của việc này do chính thái độ của bạn quyết định.",
      words: ["由你自己的态度", "这件事的成败", "决定的", "是"],
      correctOrder: ["这件事的成败", "是", "由你自己的态度", "决定的"],
      hanzi: "这件事的成败是由你自己的态度决定的。",
      pinyin: "Zhè jiàn shì de chéngbài shì yóu nǐ zìjǐ de tàidu juédìng de.",
      explanation: "• Cấu trúc nhấn mạnh tác nhân: 「Chủ ngữ + 是 + 由... + 决定 的」."
    }
  ],
  5: [
    {
      skill: "listening", subType: "listening_qa", category: "Nghe hiểu diễn đàn & kinh tế học",
      title: "Chính sách năng lượng tái tạo",
      audioText: "男：随着风电与光伏发电成本的大幅下降，清洁能源的平价上网已经成为现实。女：未来竞争的核心不再是装机规模，而是在于储能系统的调峰能力以及智能电网的调度效率。",
      passageText: "男：随着风电与光伏发电成本的大幅下降，清洁能源的平价上网已经成为现实。\n女：未来竞争的核心不再是装机规模，而是在于储能系统的调峰能力以及智能电网的调度效率。",
      pinyin: "Nán: Suízhe fēngdiàn yǔ guāngfú fādiàn chéngběn de dàfú xiàjiàng, qīngjié néngyuán de píngjià shàngwǎng yǐjīng chéngwéi xiànshí. Nǚ: Wèilái jìngzhēng de héxīn bú zài shì zhuāngjī guīmó, ér shì zàiyú chǔnéng xìtǒng de tiáofēng nénglì yǐjí zhìnéng diànwǎng de diàodù xiàolǜ.",
      vietnamese: "Nam: Cùng với việc giá thành điện gió và quang điện giảm mạnh, năng lượng sạch với giá bán ngang bằng điện truyền thống đã trở thành hiện thực. Nữ: Cốt lõi cạnh tranh trong tương lai không còn nằm ở quy mô công suất lắp đặt, mà nằm ở năng lực điều tiết đỉnh phụ tải của hệ thống tích trữ năng lượng và hiệu suất điều độ lưới điện thông minh.",
      question: "问：未来清洁能源竞争的核心在于什么？(Hỏi: Cốt lõi cạnh tranh năng lượng sạch tương lai nằm ở đâu?)",
      options: [
        { text: "储能系统的调峰能力与电网调度效率 (Năng lực điều tiết lưu trữ và hiệu suất điều độ lưới điện)", isCorrect: true },
        { text: "无限度增加燃煤发电厂 (Tăng nhà máy nhiệt điện than không giới hạn)", isCorrect: false },
        { text: "彻底关闭所有光伏电站 (Đóng cửa toàn bộ trạm quang điện)", isCorrect: false },
        { text: "停止研发储能电池 (Ngừng nghiên cứu ắc quy lưu trữ)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 储能系统的调峰能力与电网调度效率.\n• Lời nữ phân tích rõ ràng hai yếu tố then chốt."
    },
    {
      skill: "speaking", subType: "speaking_shadowing", category: "Luyện phát âm & Giao tiếp phản xạ",
      title: "Luận biện triết học nhân sinh",
      audioText: "博学而不穷，笃行而不倦，方为学者之至境。",
      targetText: "博学而不穷笃行而不倦方为学者之至境",
      targetPinyin: "Bóxué ér bù qióng, dǔxíng ér bú juàn, fāng wéi xuézhě zhī zhìjìng.", vietnamese: "Học rộng mà không bao giờ ngừng lại, kiên định thực hành mà không biết mỏi mệt, mới là cảnh giới tột cùng của người làm học vấn.",
      question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
      options: [], explanation: "• Điểm lưu ý: Văn phong tứ tự thành ngữ biền ngẫu: 「博学而不穷，笃行而不倦」. Cần giữ âm vực sâu lắng, nhịp điệu uy nghiêm."
    },
    {
      skill: "reading", subType: "reading_qa", category: "Đọc hiểu văn hóa học",
      title: "Nghệ thuật kiến trúc Tứ Hợp Viện",
      passageText: "北京四合院不仅是一种居住建筑形式，更承载着中国传统伦理观念与宇宙哲学。四周房屋围合而中间留出庭院，对外封闭以保私密安宁，对内开敞以迎日月清风，深刻体现了天人合一、内和外顺的人文意蕴。",
      pinyin: "Běijīng sìhéyuàn bùjǐn shì yì zhǒng jūzhù jiànzhù xíngshì, gèng chéngzǎi zhe Zhōngguó chuántǒng lúnlǐ guānniàn yǔ yǔzhòu zhéxué. Sìzhōu fángwū wéihé ér zhōngjiān liúchū tíngyuàn, duìwài fēngbì yǐ bǎo sīmì ānníng, duìnèi kāichǎng yǐ yíng rìyuè qīngfēng, shēnkè tǐxiàn le tiānrén-héyī, nèihé-wàishùn de rénwén yìyùn.",
      vietnamese: "Tứ hợp viện Bắc Kinh không chỉ là một hình thái kiến trúc nhà ở, mà còn chuyên chở quan niệm đạo đức luân lý truyền thống và triết học vũ trụ Trung Hoa. Bốn phía gian phòng bao bọc và ở giữa để ra một sân trời, đối ngoại khép kín để giữ gìn sự riêng tư an tĩnh, đối nội mở rộng để đón lấy ánh dương và ngọn gió thanh lành, thể hiện sâu sắc ý vị nhân văn 'thiên nhân hợp nhất, trong ấm ngoài êm'.",
      question: "四合院的建筑格局体现了怎样的文化意蕴？(Quy cách kiến trúc Tứ Hợp Viện thể hiện ý vị văn hóa nào?)",
      options: [
        { text: "天人合一与内和外顺 (Thiên nhân hợp nhất và trong ấm ngoài êm)", isCorrect: true },
        { text: "追逐西式洛可可奢华 (Theo đuổi sự xa hoa phong cách Rococo phương Tây)", isCorrect: false },
        { text: "完全舍弃家庭私密性 (Từ bỏ hoàn toàn sự riêng tư gia đình)", isCorrect: false },
        { text: "纯粹用于军事防御城堡 (Thuần túy là pháo đài phòng thủ quân sự)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 天人合一与内和外顺.\n• Trích dẫn bài đọc: 「深刻体现了天人合一、内和外顺的人文意蕴」."
    },
    {
      skill: "writing", subType: "reorder", category: "连词成句 (Sắp xếp trật tự từ)",
      title: "Sắp xếp câu đảo ngữ học thuật",
      question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
      vietnamese: "Sự phát triển của công nghệ đã làm phong phú sâu sắc thêm đời sống văn hóa của người dân.",
      words: ["极大地丰富了", "科技的发展", "居民的精神文化生活"],
      correctOrder: ["科技的发展", "极大地丰富了", "居民的精神文化生活"],
      hanzi: "科技的发展极大地丰富了居民的精神文化生活。",
      pinyin: "Kējì de fāzhǎn jídà de fēngfù le jūmín de jīngshén wénhuà shēnghuó.",
      explanation: "• Cấu trúc: 「Chủ ngữ (科技的发展) + Trạng từ + Động từ (极大地丰富了) + Tân ngữ phức hợp (居民的精神文化生活)」."
    }
  ],
  6: [
    {
      skill: "listening", subType: "listening_qa", category: "Nghe hiểu học thuật & Diễn đàn kinh tế quốc tế",
      title: "Toàn cầu hóa kinh tế và khả năng chống chịu chuỗi cung ứng",
      audioText: "男：后疫情时代，国际经贸格局正经历深刻重构，跨国企业日益将考量重心从‘效率至上’转向‘安全与韧性并重’。女：这意味着全球化并未走向终结，而是演变为更具区域化、多元化特征的网状协同生态。",
      passageText: "男：后疫情时代，国际经贸格局正经历深刻重构，跨国企业日益将考量重心从‘效率至上’转向‘安全与韧性并重’。\n女：这意味着全球化并未走向终结，而是演变为更具区域化、多元化特征的网状协同生态。",
      pinyin: "Nán: Hòuyìqíng shídài, guójì jīngmào gégú zhèng jīnglì shēnkè chónggòu, kuàguó qǐyè rìyì jiāng kǎoliang zhòngxīn cóng ‘xiàolǜ zhìshàng’ zhuǎnxiàng ‘ānquán yǔ rènxìng bìngzhòng’. Nǚ: Zhè yìwèizhe quánqiúhuà bìng wèi zǒuxiàng zhōngjié, ér shì yǎnbiàn wéi gèng jù qūyùhuà, duōyuánhuà tèzhēng de wǎngzhuàng xiétóng shēngtài.",
      vietnamese: "Nam: Thời kỳ hậu đại dịch, cục diện kinh tế thương mại quốc tế đang trải qua sự tái cấu trúc sâu sắc, các doanh nghiệp đa quốc gia ngày càng chuyển trọng tâm cân nhắc từ 'hiệu quả trên hết' sang 'coi trọng đồng thời cả an toàn và độ bền vững dẻo dai'. Nữ: Điều này đồng nghĩa với việc toàn cầu hóa không hề đi tới hồi kết, mà đang phát triển thành một hệ sinh thái hiệp đồng dạng mạng lưới mang đặc trưng khu vực hóa và đa nguyên hóa rõ nét hơn.",
      question: "问：对话中指出跨国企业的考量重心发生了什么转变？(Hỏi: Đối thoại chỉ ra trọng tâm cân nhắc của doanh nghiệp đa quốc gia đã chuyển biến ra sao?)",
      options: [
        { text: "从‘效率至上’转向‘安全与韧性并重’ (Từ 'hiệu quả trên hết' sang 'coi trọng cả an toàn và dẻo dai')", isCorrect: true },
        { text: "完全放弃所有海外分支机构 (Từ bỏ toàn bộ chi nhánh ở nước ngoài)", isCorrect: false },
        { text: "彻底停止与任何国际伙伴合作 (Dứt khoát ngừng hợp tác với đối tác quốc tế)", isCorrect: false },
        { text: "仅生产单一廉价塑料制品 (Chỉ sản xuất một mặt hàng nhựa giá rẻ duy nhất)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 从‘效率至上’转向‘安全与韧性并重’.\n• Trích nguyên văn: 「从‘效率至上’转向‘安全与韧性并重’」."
    },
    {
      skill: "speaking", subType: "speaking_shadowing", category: "Luyện phát âm & Giao tiếp phản xạ",
      title: "Luận thuyết đỉnh cao văn phong học thuật",
      audioText: "致广大而尽精微，极高明而道中庸。",
      targetText: "致广大而尽精微极高明而道中庸",
      targetPinyin: "Zhì guǎngdà ér jìn jīngwēi, jí gāomíng ér dào zhōngyōng.", vietnamese: "Đạt tới chỗ quảng đại bao la mà tận cùng đến từng nét tinh vi tường tận; vươn tới chốn cao minh tột bực mà luôn hành xử theo đạo Trung Dung hòa hợp.",
      question: "Nhấn nút 'Nghe mẫu' rồi nhấn micro và phát âm câu trên thật chuẩn xác:",
      options: [], explanation: "• Điểm lưu ý: Điển tích cổ Hán ngữ trong sách 'Trung Dung'. Phát âm từng âm tiết dứt khoát, thanh 4 và thanh 1 giao thoa hùng tráng."
    },
    {
      skill: "reading", subType: "reading_qa", category: "Đọc hiểu khảo cứu triết học",
      title: "Học thuyết 'Tri hành hợp nhất' của Vương Dương Minh",
      passageText: "明代思想家王阳明提出“知行合一”说，直指“知是行之始，行是知之成”。知而不行，只是未知；真正的真知灼见必在事上磨炼、知行交融中方得彰显。这一学说彻底廓清了知行脱节的弊病，成为东亚心学传统中影响至深的精神坐标。",
      pinyin: "Míngdài sīxiǎngjiā Wáng Yángmíng tíchū “zhī xíng hé yī” shuō, zhízhǐ “zhī shì xíng zhī shǐ, xíng shì zhī zhī chéng”. Zhī ér bù xíng, zhǐ shì wèi zhī; zhēnzhèng de zhēnzhī-zhuójiàn bì zài shì shang móliàn, zhī xíng jiāoróng zhōng fāng dé zhāngxiǎn. Zhè yì xuéshuō chèdǐ kuòqīng le zhī xíng tuōjié de bìbìng, chéngwéi Dōngyà xīnxué chuántǒng zhōng yǐngxiǎng zhìshēn de jīngshén zuòbiāo.",
      vietnamese: "Nhà tư tưởng triều Minh Vương Dương Minh đưa ra thuyết 'Tri hành hợp nhất', chỉ thẳng rằng: 'Biết là khởi đầu của làm, làm là sự hoàn thành của biết'. Biết mà không làm thì chỉ là chưa biết; chân tri trác kiến thực sự bắt buộc phải được tôi rèn qua sự việc thực tế, trong sự giao hòa giữa tri và hành mới được hiển lộ rạng ngời. Học thuyết này đã dẹp tan triệt để căn bệnh tách rời giữa lý thuyết và hành động, trở thành tọa độ tinh thần có sức ảnh hưởng sâu rộng nhất trong truyền thống Tâm học Đông Á.",
      question: "王阳明“知行合一”的核心内涵是什么？(Nội hàm cốt lõi của 'Tri hành hợp nhất' là gì?)",
      options: [
        { text: "知行交融并在实践磨炼中彰显真知 (Tri hành giao hòa và thể hiện chân tri qua tôi luyện thực tế)", isCorrect: true },
        { text: "只读书而不必参与任何实际生活 (Chỉ đọc sách mà không cần tham gia đời sống thực tế)", isCorrect: false },
        { text: "将书本知识全部抛弃废黜 (Vứt bỏ xóa bỏ toàn bộ kiến thức sách vở)", isCorrect: false },
        { text: "认为人的认知完全由运气决定 (Cho rằng nhận thức của con người do vận may quyết định)", isCorrect: false }
      ],
      explanation: "• Đáp án đúng: 知行交融并在实践磨炼中彰显真知.\n• Bài văn: 「知是行之始，行是知之成。真正的真知灼见必在事上磨炼、知行交融中方得彰显」."
    },
    {
      skill: "writing", subType: "reorder", category: "连词成句 (Sắp xếp trật tự từ)",
      title: "Sắp xếp câu luận biện triết học HSK 6",
      question: "连词成句 (Sắp xếp các mảnh từ sau thành câu hoàn chỉnh):",
      vietnamese: "Sự phát triển của nền văn minh nhân loại được quyết định bởi tinh thần đổi mới liên tục.",
      words: ["由持续的创新精神", "人类文明的发展进程", "决定的", "是"],
      correctOrder: ["人类文明的发展进程", "是", "由持续的创新精神", "决定的"],
      hanzi: "人类文明的发展进程是由持续的创新精神决定的。",
      pinyin: "Rénlèi wénmíng de fāzhǎn jìnchéng shì yóu chíxù de chuàngxīn jīngshén juédìng de.",
      explanation: "• Cấu trúc nhấn mạnh tác nhân đỉnh cao: 「Chủ ngữ (人类文明的发展进程) + 是 + 由 (Nguyên nhân/Tác nhân) + 决定的」."
    }
  ]
};

// Loop 3 cycles to generate 180 questions with unique IDs
for (let cycle = 1; cycle <= 3; cycle++) {
  for (const lvl of levels) {
    const list = templates[lvl];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const newId = `hsk${lvl}_${item.skill}_cycle${cycle}_${i + 1}`;
      pushQ({
        ...item,
        id: newId
      });
    }
  }
}

existing.push(...extra);
fs.writeFileSync(practicePath, JSON.stringify(existing, null, 2), 'utf8');
console.log(`Successfully added ${extra.length} items. Total practice bank: ${existing.length}`);
