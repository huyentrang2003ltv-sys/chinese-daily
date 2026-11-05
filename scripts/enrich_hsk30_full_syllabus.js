// scripts/enrich_hsk30_full_syllabus.js
// Deep enrichment of HSK 3.0 Standard Course 48 Lessons
const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, '../public/data/hsk30_roadmap.json');
const roadmap = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));

function v(hanzi, pinyin, hanviet, pos, vi, exHanzi, exPinyin, exVi) {
  return {
    hanzi,
    pinyin,
    hanviet,
    pos,
    vi,
    example: { hanzi: exHanzi, pinyin: exPinyin, vi: exVi }
  };
}

function d(speaker, hanzi, pinyin, vi) {
  return { speaker, hanzi, pinyin, vi };
}

function g(title, formula, explanation, examples) {
  return { title, formula, explanation, examples };
}

function p(id, question, options, answer, explain) {
  return { id, question, options, answer, explain };
}

const detailedMap = {
  // HSK 1: Lessons 11 - 15
  '1-11': {
    dialogues: [
      d('李文', '喂，王明，你在做什么呢？', 'Wèi, Wáng Míng, nǐ zài zuò shénme ne?', 'Alo, Vương Minh, bạn đang làm gì đấy?'),
      d('王明', '我在宿舍看书呢。你呢？', 'Wǒ zài sùshè kàn shū ne. Nǐ ne?', 'Tôi đang đọc sách ở ký túc xá. Còn bạn?'),
      d('李文', '我在图书馆学习，你要不要一起来？', 'Wǒ zài túshūguǎn xuéxí, nǐ yào bu yào yìqǐ lái?', 'Tôi đang học ở thư viện, bạn có muốn đến cùng không?'),
      d('王明', '好的，我马上就来！', 'Hǎo de, wǒ mǎshàng jiù lái!', 'Được rồi, tôi đến ngay đây!')
    ],
    vocabulary: [
      v('在 / 正在', 'zài / zhèngzài', 'tại / chính tại', 'Phó từ', 'đang (hành động tiếp diễn)', '他正在睡觉。', 'Tā zhèngzài shuìjiào.', 'Anh ấy đang ngủ.'),
      v('呢', 'ne', 'ni', 'Trợ từ ngữ khí', 'đang (cuối câu tiếp diễn)', '我看书呢。', 'Wǒ kàn shū ne.', 'Tôi đang đọc sách nè.'),
      v('做', 'zuò', 'tác', 'Động từ', 'làm', '你在做什么？', 'Nǐ zài zuò shénme?', 'Bạn đang làm gì?'),
      v('宿舍', 'sùshè', 'túc xá', 'Danh từ', 'ký túc xá', '我的宿舍在二楼。', 'Wǒ de sùshè zài èr lóu.', 'Ký túc xá của tôi ở tầng 2.'),
      v('要', 'yào', 'yếu', 'Động từ năng nguyện', 'muốn, cần, sắp', '我要去买东西。', 'Wǒ yào qù mǎi dōngxi.', 'Tôi muốn đi mua đồ.'),
      v('马上', 'mǎshàng', 'mã thượng', 'Phó từ', 'ngay lập tức', '我马上到。', 'Wǒ mǎshàng dào.', 'Tôi đến ngay đây.'),
      v('大学', 'dàxué', 'đại học', 'Danh từ', 'trường đại học', '他在北京大学读书。', 'Tā zài Běijīng Dàxué dú shū.', 'Anh ấy học ở Đại học Bắc Kinh.'),
      v('听', 'tīng', 'thính', 'Động từ', 'nghe', '听音乐。', 'Tīng yīnyuè.', 'Nghe âm nhạc.')
    ],
    grammarPoints: [
      g('1. Biểu thị hành động đang tiếp diễn: 在 / 正在 / 正... 呢', 'Chủ ngữ + 正在 / 在 + Động từ (+ Tân ngữ) + (呢)', 'Dùng để diễn tả một hành động đang trong quá trình xảy ra tại thời điểm nói. Cuối câu có thể thêm trợ từ 呢.', [
        { hanzi: '他们正在开会呢。', pinyin: 'Tāmen zhèngzài kāihuì ne.', vi: 'Họ đang họp đấy.' },
        { hanzi: '我没在看电视，我在学习。', pinyin: 'Wǒ méi zài kàn diànshì, wǒ zài xuéxí.', vi: 'Tôi không đang xem TV, tôi đang học bài.' }
      ]),
      g('2. Câu hỏi chính phản (V 不 V)', 'Chủ ngữ + Động từ + 不 + Động từ + Tân ngữ?', 'Đặt hình thức khẳng định và phủ định của động từ cạnh nhau để tạo thành câu hỏi nghi vấn (tương đương câu hỏi 吗).', [
        { hanzi: '你去不去学校？', pinyin: 'Nǐ qù bu qù xuéxiào?', vi: 'Bạn có đi trường học không?' },
        { hanzi: '这本书好不好看？', pinyin: 'Zhè běn shū hǎo bu hǎokàn?', vi: 'Cuốn sách này có hay không?' }
      ])
    ],
    cultureAndTips: {
      culture: 'Ký túc xá đại học Trung Quốc (学生宿舍) thường có 4 người một phòng (四人间), là môi trường rèn luyện giao tiếp tiếng Trung và kết bạn bền chặt nhất của lưu học sinh.',
      examTip: 'Phủ định của hành động đang diễn tiến là "没在" (méi zài), KHÔNG dùng "不在" (vì 不在 mang nghĩa "không có mặt ở đâu").',
      practicalApp: 'Hỏi thăm bạn bè đang bận hay rảnh, rủ rê đi cà phê học bài, trả lời điện thoại.'
    },
    practice: [
      p(1, 'Dạng phủ định của câu "他正在听音乐呢" là:', ['A. 他不听音乐。', 'B. 他没在听音乐。', 'C. 他不在听音乐。', 'D. 他没有听了音乐。'], 1, 'Phủ định của hành động đang tiếp diễn là "没在 + V".'),
      p(2, 'Chuyển câu "你想喝茶吗？" sang câu hỏi chính phản:', ['A. 你想不想喝茶？', 'B. 你想喝不喝茶吗？', 'C. 你想喝茶不喝？', 'D. 你喝茶想不想？'], 0, 'Với động từ năng nguyện 想, hình thức chính phản là "想不想".'),
      p(3, 'Từ "马上" (mǎshàng) có nghĩa là gì?', ['A. Trên lưng ngựa', 'B. Ngay lập tức', 'C. Ngày mai', 'D. Buổi tối'], 1, '马上 mang nghĩa là ngay lập tức, ngay bây giờ.')
    ]
  },
  '1-12': {
    dialogues: [
      d('李文', '玛丽，今天外面真冷啊！昨天下雪了。', 'Mǎlì, jīntiān wàimiàn zhēn lěng a! Zuótiān xiàxuě le.', 'Mary, hôm nay bên ngoài lạnh thật đấy! Hôm qua tuyết rơi rồi.'),
      d('玛丽', '是啊，今天零下五度，太冷了！', 'Shì a, jīntiān língxià wǔ dù, tài lěng le!', 'Đúng vậy, hôm nay âm 5 độ, lạnh quá!'),
      d('李文', '你要多穿点儿衣服，别感冒了。', 'Nǐ yào duō chuān diǎnr yīfu, bié gǎnmào le.', 'Bạn phải mặc nhiều áo ấm vào, đừng để bị cảm lạnh nhé.'),
      d('玛丽', '谢谢你！下雪虽然冷，但是雪景太漂亮了！', 'Xièxie nǐ! Xiàxuě suīrán lěng, dànshì xuějǐng tài piàoliang le!', 'Cảm ơn bạn! Tuyết rơi tuy lạnh nhưng cảnh tuyết đẹp quá!')
    ],
    vocabulary: [
      v('下雪', 'xiàxuě', 'hạ tuyết', 'Cụm động từ', 'tuyết rơi', '外面正在下雪。', 'Wàimiàn zhèngzài xiàxuě.', 'Bên ngoài đang tuyết rơi.'),
      v('冷', 'lěng', 'lãnh', 'Tính từ', 'lạnh', '今天非常冷。', 'Jīntiān fēicháng lěng.', 'Hôm nay cực kỳ lạnh.'),
      v('热', 'rè', 'nhiệt', 'Tính từ', 'nóng', '夏天天气很热。', 'Xiàtiān tiānqì hěn rè.', 'Mùa hè thời tiết rất nóng.'),
      v('天气', 'tiānqì', 'thiên khí', 'Danh từ', 'thời tiết', '明天天气怎么样？', 'Míngtiān tiānqì zěnmeyàng?', 'Thời tiết ngày mai thế nào?'),
      v('太...了', 'tài... le', 'thái... liễu', 'Cấu trúc', 'quá... rồi (cảm thán)', '太好了！', 'Tài hǎo le!', 'Tốt quá rồi!'),
      v('了', 'le', 'liễu', 'Trợ từ ngữ khí', 'rồi (biểu thị biến đổi)', '春天来了。', 'Chūntiān lái le.', 'Mùa xuân đến rồi.'),
      v('身体', 'shēntǐ', 'thân thể', 'Danh từ', 'sức khỏe, cơ thể', '祝你身体健康！', 'Zhù nǐ shēntǐ jiànkāng!', 'Chúc bạn sức khỏe dồi dào!'),
      v('穿', 'chuān', 'xuyên', 'Động từ', 'mặc (quần áo), đi (giày tất)', '多穿衣服。', 'Duō chuān yīfu.', 'Mặc thêm quần áo.')
    ],
    grammarPoints: [
      g('1. Cấu trúc cảm thán 太 + Tính từ + 了', '太 + Tính từ / Động từ tâm lý + 了！', 'Biểu đạt mức độ rất cao mang sắc thái cảm thán tán thưởng hoặc phàn nàn quá mức.', [
        { hanzi: '这个苹果太甜了！', pinyin: 'Zhè gè píngguǒ tài tián le!', vi: 'Quả táo này ngọt quá!' },
        { hanzi: '外面太冷了，快进来吧。', pinyin: 'Wàimiàn tài lěng le, kuài jìnlái ba.', vi: 'Bên ngoài lạnh quá, mau vào đi.' }
      ]),
      g('2. Trợ từ ngữ khí 了 biểu thị sự biến đổi trạng thái (New Situation)', 'Câu trần thuật + 了。', 'Đứng ở cuối câu để chỉ tình huống có sự thay đổi mới phát sinh so với trước đó (trời đã lạnh rồi, tuyết đã rơi rồi).', [
        { hanzi: '下雪了。', pinyin: 'Xiàxuě le.', vi: 'Tuyết rơi rồi (trước đó chưa rơi, giờ mới bắt đầu rơi).' },
        { hanzi: '我懂了。', pinyin: 'Wǒ dǒng le.', vi: 'Tôi hiểu rồi (trước chưa hiểu, giờ đã hiểu).' }
      ])
    ],
    tips: {
      culture: 'Miền Bắc Trung Quốc mùa đông có hệ thống sưởi ấm trung tâm (暖气 - nuǎnqì) chạy từ tháng 11 đến tháng 3 năm sau, nhiệt độ trong nhà luôn ấm áp khoảng 22-24°C.',
      examTip: 'Phân biệt 2 loại 了 trong HSK: 了1 đứng sau động từ chỉ hành động hoàn thành; 了2 đứng cuối câu chỉ ngữ khí hoặc sự thay đổi tình huống.',
      practicalApp: 'Hỏi han thời tiết trước khi ra ngoài, bật điều hòa nhiệt độ thích hợp, nhắc nhở người thân giữ ấm.'
    },
    practice: [
      p(1, 'Cấu trúc khen ngợi "Đẹp quá rồi!" trong tiếng Trung là:', ['A. 太漂亮了！', 'B. 很好漂亮！', 'C. 漂亮太了！', 'D. 真的太漂亮。'], 0, 'Cấu trúc cố định: 太 + Tính từ + 了.'),
      p(2, 'Trong câu "昨天下雨了", chữ "了" ở cuối câu biểu đạt điều gì?', ['A. Hỏi thời gian', 'B. Biểu thị tình huống mới xuất hiện', 'C. Phủ định sự việc', 'D. Đề nghị người khác làm'], 1, 'Trợ từ ngữ khí 了 ở cuối câu chỉ tình hình mới phát sinh.'),
      p(3, 'Từ trái nghĩa với "冷" (lạnh) là:', ['A. 凉', 'B. 热', 'C. 暖', 'D. 冰'], 1, '冷 (lạnh) đối nghĩa với 热 (nóng).')
    ]
  },
  '1-13': {
    dialogues: [
      d('服务员', '您好，请问两位想喝点儿什么？', 'Nín hǎo, qǐngwèn liǎng wèi xiǎng hē diǎnr shénme?', 'Kính chào quý khách, xin hỏi hai vị muốn uống chút gì ạ?'),
      d('李文', '请给我一杯绿茶，谢谢。', 'Qǐng gěi wǒ yì bēi lǜchá, xièxie.', 'Làm ơn cho tôi một cốc trà xanh, cảm ơn.'),
      d('玛丽', '我可以要一杯温水吗？', 'Wǒ kěyǐ yào yì bēi wēn shuǐ ma?', 'Tôi có thể xin một cốc nước ấm được không?'),
      d('服务员', '没问题，请稍等一下，马上为您送来。', 'Méi wèntí, qǐng shāo děng yíxià, mǎshàng wèi nín sòng lái.', 'Không vấn đề gì, xin đợi một lát, đồ uống sẽ được mang lên ngay ạ.')
    ],
    vocabulary: [
      v('请', 'qǐng', 'thỉnh', 'Động từ', 'mời, xin mời, làm ơn', '请坐！', 'Qǐng zuò!', 'Mời ngồi!'),
      v('给', 'gěi', 'cấp', 'Động từ', 'cho, đưa cho', '给你钱。', 'Gěi nǐ qián.', 'Gửi tiền bạn này.'),
      v('杯', 'bēi', 'bôi', 'Lượng từ / Danh từ', 'cốc, ly, tách', '两杯水。', 'Liǎng bēi shuǐ.', 'Hai cốc nước.'),
      v('茶', 'chá', 'trà', 'Danh từ', 'trà, chè', '中国绿茶。', 'Zhōngguó lǜchá.', 'Trà xanh Trung Quốc.'),
      v('喝', 'hē', 'hát', 'Động từ', 'uống', '喝咖啡。', 'Hē kāfēi.', 'Uống cà phê.'),
      v('可以', 'kěyǐ', 'khả dĩ', 'Động từ năng nguyện', 'có thể, được phép', '我可以进来吗？', 'Wǒ kěyǐ jìnlái ma?', 'Tôi có thể vào không?'),
      v('一下', 'yíxià', 'nhất hạ', 'Số lượng từ', 'một chút, một lát', '看一下。', 'Kàn yíxià.', 'Xem qua một chút.'),
      v('服务员', 'fúwùyuán', 'phục vụ viên', 'Danh từ', 'nhân viên phục vụ', '叫服务员买单。', 'Jiào fúwùyuán mǎidān.', 'Gọi phục vụ thanh toán.')
    ],
    grammarPoints: [
      g('1. Động từ kèm "一下" giảm nhẹ ngữ khí', 'Động từ + 一下', 'Biểu thị hành động diễn ra trong thời gian ngắn hoặc mang tính chất thử nghiệm, làm cho lời thỉnh cầu trở nên nhẹ nhàng, lịch sự.', [
        { hanzi: '请你等一下。', pinyin: 'Qǐng nǐ děng yíxià.', vi: 'Xin bạn đợi một lát.' },
        { hanzi: '我介绍一下我的朋友。', pinyin: 'Wǒ jièshào yíxià wǒ de péngyou.', vi: 'Tôi xin giới thiệu một chút về người bạn của tôi.' }
      ]),
      g('2. Câu song tân ngữ (Double Objects)', 'Chủ ngữ + Động từ (给/送/教) + Tân ngữ gián tiếp (Người) + Tân ngữ trực tiếp (Vật)', 'Một số động từ như 给, 送, 教 có thể mang 2 tân ngữ liền nhau: người nhận đứng trước, đồ vật đứng sau.', [
        { hanzi: '请给我一杯茶。', pinyin: 'Qǐng gěi wǒ yì bēi chá.', vi: 'Làm ơn đưa tôi một cốc trà.' },
        { hanzi: '王老师教我们汉语。', pinyin: 'Wáng lǎoshī jiāo wǒmen Hànyǔ.', vi: 'Thầy Vương dạy chúng tôi tiếng Trung.' }
      ])
    ],
    tips: {
      culture: 'Trong văn hóa ẩm thực Trung Hoa, khi vào quán ăn, người phục vụ luôn tự động rót nước ấm hoặc trà nóng miễn phí (热水 / 热茶), vì quan niệm nước ấm tốt cho dạ dày và tiêu hóa.',
      examTip: 'Động từ năng nguyện 可以 dùng hỏi xin phép ("Tôi có thể... không?"). Để từ chối lịch sự thường nói "不行" hoặc "不能".',
      practicalApp: 'Gọi đồ ăn thức uống tại nhà hàng, xin phép mượn đồ dùng hoặc tài liệu học tập.'
    },
    practice: [
      p(1, 'Chọn câu có trật tự song tân ngữ ĐÚNG:', ['A. 请给我一杯茶。', 'B. 请给一杯茶我。', 'C. 请我给一杯茶。', 'D. 一杯茶请给我。'], 0, 'Cấu trúc chuẩn: 给 + Người (我) + Vật (一杯茶).'),
      p(2, 'Cụm "等一下" mang ý nghĩa là:', ['A. Đợi rất lâu', 'B. Đợi một chút / một lát', 'C. Không cần đợi', 'D. Vừa mới đến'], 1, '一下 chỉ khoảng thời gian ngắn hoặc hành động nhanh gọn.'),
      p(3, 'Khi muốn xin phép vào phòng, câu lịch sự nhất là:', ['A. 我会进来吗？', 'B. 我可以进来吗？', 'C. 我想要进来吗？', 'D. 我得进来吗？'], 1, 'Xin phép dùng động từ năng nguyện "可以" (kěyǐ).')
    ]
  },
  '1-14': {
    dialogues: [
      d('王明', '李文，你昨天晚上做什么了？', 'Wáng Míng, nǐ zuótiān wǎnshang zuò shénme le?', 'Vương Minh, tối qua bạn làm gì thế?'),
      d('李文', '我看了一个中国电影，叫《流浪地球》。', 'Wǒ kàn le yí gè Zhōngguó diànyǐng, jiào 《Liúlàng Dìqiú》.', 'Tôi đã xem một bộ phim Trung Quốc tên là "Lưu Lạc Địa Cầu".'),
      d('王明', '你看懂了吗？电影好看吗？', 'Nǐ kàndǒng le ma? Diànyǐng hǎokàn ma?', 'Bạn xem có hiểu không? Phim hay không?'),
      d('李文', '有些地方没看懂，但是特效太棒了！我们班同学都喜欢。', 'Yǒuxiē dìfang méi kàndǒng, dànshì tèxiào tài bàng le! Wǒmen bān tóngxué dōu xǐhuan.', 'Có vài chỗ không hiểu hết, nhưng kỹ xảo đỉnh lắm! Cả lớp mình ai cũng thích.')
    ],
    vocabulary: [
      v('电影', 'diànyǐng', 'điện ảnh', 'Danh từ', 'bộ phim, điện ảnh', '看电影。', 'Kàn diànyǐng.', 'Xem phim.'),
      v('看', 'kàn', 'khán', 'Động từ', 'nhìn, xem, đọc', '看书。', 'Kàn shū.', 'Đọc sách.'),
      v('了', 'le', 'liễu', 'Trợ từ động thái', 'đã (sau động từ biểu thị hoàn thành)', '我吃了饭。', 'Wǒ chī le fàn.', 'Tôi đã ăn cơm.'),
      v('都', 'dōu', 'đô', 'Phó từ', 'đều, tất cả', '我们都是好朋友。', 'Wǒmen dōu shì hǎo péngyou.', 'Chúng tôi đều là bạn tốt.'),
      v('已经', 'yǐjīng', 'dĩ kinh', 'Phó từ', 'đã, rồi', '他已经走了。', 'Tā yǐjīng zǒu le.', 'Anh ấy đã đi rồi.'),
      v('喜欢', 'xǐhuan', 'hỷ hoan', 'Động từ', 'thích', '我很喜欢学中文。', 'Wǒ hěn xǐhuan xué zhōngwén.', 'Tôi rất thích học tiếng Trung.'),
      v('好看', 'hǎokàn', 'hảo khán', 'Tính từ', 'đẹp, hay (phim, sách)', '这部电影真好看。', 'Zhè bù diànyǐng zhēn hǎokàn.', 'Bộ phim này thật là hay.'),
      v('地方', 'dìfang', 'địa phương', 'Danh từ', 'nơi, chỗ, địa điểm', '这个地方风景很美。', 'Zhè gè dìfang fēngjǐng hěn měi.', 'Nơi này phong cảnh rất đẹp.')
    ],
    grammarPoints: [
      g('1. Trợ từ động thái 了 biểu thị hành động đã hoàn tất', 'Chủ ngữ + Động từ + 了 + Số lượng từ + Tân ngữ', 'Khi hành động đã thực hiện xong và tân ngữ có định ngữ (như số lượng từ: 一个, 两本), chữ 了 phải đứng ngay sát sau động từ.', [
        { hanzi: '我看了一本书。', pinyin: 'Wǒ kàn le yì běn shū.', vi: 'Tôi đã đọc một cuốn sách.' },
        { hanzi: '他喝了两杯咖啡。', pinyin: 'Tā hē le liǎng bēi kāfēi.', vi: 'Anh ấy đã uống hai cốc cà phê.' }
      ]),
      g('2. Thể phủ định của hành động hoàn thành: 没 / 没有 + V (BỎ 了)', 'Chủ ngữ + 没(有) + Động từ + Tân ngữ (KHÔNG có 了)', 'Khi phủ định một hành động chưa làm, dùng 没 hoặc 没有 trước động từ, và BẮT BUỘC bỏ trợ từ 了.', [
        { hanzi: '我昨天没看电影。', pinyin: 'Wǒ zuótiān méi kàn diànyǐng.', vi: 'Tối qua tôi không xem phim (Tuyệt đối không nói 没看了电影).' },
        { hanzi: '他还没有来。', pinyin: 'Tā hái méiyǒu lái.', vi: 'Anh ấy vẫn chưa đến.' }
      ])
    ],
    tips: {
      culture: 'Điện ảnh Trung Quốc những năm gần đây phát triển vượt bậc với các tác phẩm khoa học viễn tưởng và hoạt hình thần thoại đình đám. Rạp chiếu phim tại các thành phố lớn đều hỗ trợ quét mã nhận vé tự động.',
      examTip: 'Điểm ngữ pháp mấu chốt HSK: Tuyệt đối KHÔNG kết hợp 没 và 了 cùng lúc trong câu phủ định hành động hoàn thành!',
      practicalApp: 'Kể lại các hoạt động đã làm trong ngày hôm qua hoặc cuối tuần, chia sẻ cảm nhận về một tác phẩm nghệ thuật.'
    },
    practice: [
      p(1, 'Câu nào sau đây SAI ngữ pháp?', ['A. 我买了一件衣服。', 'B. 我没买一件衣服。', 'C. 我没买了一件衣服。', 'D. 我没有买衣服。'], 2, 'Trong câu phủ định với "没/没有", không được dùng "了".'),
      p(2, 'Vị trí của phó từ "都" (đều) trong câu:', ['A. Đứng sau động từ', 'B. Đứng trước động từ, sau các chủ ngữ', 'C. Đứng ở cuối câu', 'D. Đứng ở đầu câu'], 1, '都 là phó từ nên luôn đứng trước động từ: Chúng tôi đều là... = 我们都是...'),
      p(3, 'Dịch sang tiếng Trung: "Anh ấy đã uống hai cốc nước."', ['A. 他喝水两杯了。', 'B. 他喝了两杯水。', 'C. 他两杯水喝。', 'D. 水他喝了两杯。'], 1, 'Trợ từ 了 đứng sau động từ: 他喝了两杯水.')
    ]
  },
  '1-15': {
    dialogues: [
      d('玛丽', '李文，你明天几点出发去机场？', 'Lǐ Wén, nǐ míngtiān jǐ diǎn chūfā qù jīchǎng?', 'Lý Văn, ngày mai mấy giờ bạn xuất phát đi sân bay?'),
      d('李文', '我上午九点出发，十一点到大兴机场。', 'Wǒ shàngwǔ jiǔ diǎn chūfā, shíyī diǎn dào Dàxīng Jīchǎng.', 'Tôi 9 giờ sáng xuất phát, 11 giờ tới Sân bay Đại Hưng.'),
      d('玛丽', '我和王明一起去送你！大兴机场见！', 'Wǒ hé Wáng Míng yìqǐ qù sòng nǐ! Dàxīng Jīchǎng jiàn!', 'Tôi và Vương Minh cùng đi tiễn bạn! Hẹn gặp ở sân bay Đại Hưng nhé!'),
      d('李文', '太感谢你们了！祝我们大家未来都顺利！', 'Tài gǎnxiè nǐmen le! Zhù wǒmen dàjiā wèilái dōu shùnlì!', 'Cảm ơn các bạn nhiều lắm! Chúc tất cả chúng ta tương lai đều thuận lợi!')
    ],
    vocabulary: [
      v('机场', 'jīchǎng', 'cơ trường', 'Danh từ', 'sân bay', '北京大兴国际机场。', 'Běijīng Dàxīng Guójì Jīchǎng.', 'Sân bay quốc tế Đại Hưng Bắc Kinh.'),
      v('见', 'jiàn', 'kiến', 'Động từ', 'gặp, gặp mặt', '明天见！', 'Míngtiān jiàn!', 'Ngày mai gặp!'),
      v('再见', 'zàijiàn', 'tái kiến', 'Cụm từ', 'tạm biệt', '老师，再见！', 'Lǎoshī, zàijiàn!', 'Em chào tạm biệt thầy cô ạ!'),
      v('飞机', 'fēijī', 'phi cơ', 'Danh từ', 'máy bay', '坐飞机去上海。', 'Zuò fēijī qù Shànghǎi.', 'Đi máy bay đến Thượng Hải.'),
      v('送', 'sòng', 'tống', 'Động từ', 'tiễn, tặng', '去机场送朋友。', 'Qù jīchǎng sòng péngyou.', 'Đến sân bay tiễn bạn.'),
      v('出租车', 'chūzūchē', 'xuất tô xa', 'Danh từ', 'xe taxi', '打出租车。', 'Dǎ chūzūchē.', 'Bắt xe taxi.'),
      v('祝', 'zhù', 'chúc', 'Động từ', 'chúc, cầu chúc', '祝你一路平安！', 'Zhù nǐ yílù píng\'ān!', 'Chúc bạn thượng lộ bình an!'),
      v('顺利', 'shùnlì', 'thuận lợi', 'Tính từ', 'thuận lợi, suôn sẻ', '工作顺利。', 'Gōngzuò shùnlì.', 'Công việc thuận lợi.')
    ],
    grammarPoints: [
      g('1. Cấu trúc câu phức song hành: ……，还 / 也……', 'Mệnh đề 1, (Chủ ngữ) + 还 / 也 + Mệnh đề 2', 'Nối hai hành động hoặc trạng thái bổ sung cho nhau cùng diễn ra song song.', [
        { hanzi: '去机场可以坐地铁，也可以打车。', pinyin: 'Qù jīchǎng kěyǐ zuò dìtiě, yě kěyǐ dǎchē.', vi: 'Đi sân bay có thể đi tàu điện ngầm, cũng có thể bắt taxi.' },
        { hanzi: '他会说英语，还会说汉语。', pinyin: 'Tā huì shuō Yīngyǔ, hái huì shuō Hànyǔ.', vi: 'Anh ấy biết nói tiếng Anh, còn biết nói cả tiếng Trung.' }
      ]),
      g('2. Cách nói lời hẹn gặp mặt: [Thời gian / Địa điểm] + 见', 'Thời gian / Địa điểm + 见！', 'Cách nói chào tạm biệt hẹn gặp lại rất tự nhiên của người bản xứ.', [
        { hanzi: '明天见！', pinyin: 'Míngtiān jiàn!', vi: 'Hẹn ngày mai gặp!' },
        { hanzi: '机场见！', pinyin: 'Jīchǎng jiàn!', vi: 'Hẹn gặp ở sân bay!' }
      ])
    ],
    tips: {
      culture: 'Sân bay Quốc tế Đại Hưng Bắc Kinh (PKX) là một trong những kỳ quan kiến trúc hiện đại lớn nhất thế giới do kiến trúc sư Zaha Hadid thiết kế hình sao biển 5 cánh.',
      examTip: 'Đây là bài học tốt nghiệp HSK 1. Sau bài này, học viên đã làm chủ đầy đủ 500 từ vựng và 48 cấu trúc ngữ pháp cốt lõi của Bậc 1 theo tiêu chuẩn HSK 3.0!',
      practicalApp: 'Đặt vé máy bay trực tuyến, tra cứu cổng ra tàu bay, chia tay bạn bè và người thân.'
    },
    practice: [
      p(1, 'Cách nói "Hẹn gặp lại vào chiều mai" ngắn gọn chuẩn xác là:', ['A. 下午明天见！', 'B. 明天下午见！', 'C. 见明天下午！', 'D. 明天见下午！'], 1, 'Quy tắc: Thời gian (明天下午) + 见!'),
      p(2, 'Muốn chúc ai đó "Thượng lộ bình an", người Trung Quốc thường nói:', ['A. 祝你一路平安！', 'B. 祝你天天工作！', 'C. 祝你好下雨！', 'D. 祝你再见！'], 0, 'Lời chúc lên đường bình an: 一路平安 (Yílù píng\'ān).'),
      p(3, 'Lượng từ của "飞机" (máy bay) thường dùng là:', ['A. 只', 'B. 架', 'C. 条', 'D. 个'], 1, 'Lượng từ của máy bay là "架" (jià) hoặc "班" (chuyến bay).')
    ]
  },

  // HSK 2: Lesson 1 & Key Lessons
  '2-1': {
    dialogues: [
      d('李文', '王明，昨天那顿北京烤鸭真是太好吃了！', 'Wáng Míng, zuótiān nà dùn Běijīng kǎoyā zhēn shì tài hǎochī le!', 'Vương Minh, bữa vịt quay Bắc Kinh hôm qua thực sự quá ngon!'),
      d('王明', '是啊！是林老师请我们吃的，她对我们留学生真热情。', 'Shì a! Shì Lín lǎoshī qǐng wǒmen chī de, tā duì wǒmen liúxuéshēng zhēn rèqíng.', 'Đúng vậy! Là cô Lâm mời chúng mình ăn đấy, cô đối với lưu học sinh tụi mình nhiệt tình thật.'),
      d('李文', '你们是怎么去的饭馆？', 'Nǐmen shì zěnme qù de fànguǎn?', 'Các bạn đã đến nhà hàng bằng cách nào thế?'),
      d('王明', '我们是坐地铁去的，只花了二十分钟。', 'Wǒmen shì zuò dìtiě qù de, zhǐ huā le èrshí fēnzhōng.', 'Chúng mình đi bằng tàu điện ngầm, chỉ mất có 20 phút thôi.')
    ],
    vocabulary: [
      v('烤鸭', 'kǎoyā', 'khảo áp', 'Danh từ', 'vịt quay', '北京烤鸭闻名世界。', 'Běijīng kǎoyā wénmíng shìjiè.', 'Vịt quay Bắc Kinh nổi tiếng khắp thế giới.'),
      v('请', 'qǐng', 'thỉnh', 'Động từ', 'mời, thết đãi', '今天我请客。', 'Jīntiān wǒ qǐngkè.', 'Hôm nay tôi đãi / tôi bao.'),
      v('是……的', 'shì... de', 'thị... đích', 'Cấu trúc', 'chính là... (nhấn mạnh thời gian, địa điểm, cách thức)', '我是坐飞机来的。', 'Wǒ shì zuò fēijī lái de.', 'Tôi đến đây bằng máy bay.'),
      v('热情', 'rèqíng', 'nhiệt tình', 'Tính từ', 'nhiệt tình, niềm nở', '他待人非常热情。', 'Tā dài rén fēicháng rèqíng.', 'Anh ấy đối đãi với mọi người rất nhiệt tình.'),
      v('花', 'huā', 'hoa', 'Động từ', 'tiêu tốn (thời gian, tiền bạc)', '花了五十块钱。', 'Huā le wǔshí kuài qián.', 'Đã tiêu hết 50 tệ.'),
      v('饭馆', 'fànguǎn', 'phạn quán', 'Danh từ', 'nhà hàng, quán ăn', '学校门口的饭馆。', 'Xuéxiào ménkǒu de fànguǎn.', 'Quán ăn trước cổng trường.'),
      v('留学生', 'liúxuéshēng', 'lưu học sinh', 'Danh từ', 'du học sinh', '各国留学生。', 'Gè guó liúxuéshēng.', 'Lưu học sinh các nước.'),
      v('顿', 'dùn', 'đốn', 'Lượng từ', 'bữa (ăn), trận', '吃了一顿丰盛的晚餐。', 'Chī le yí dùn fēngshèng de wǎncān.', 'Ăn một bữa tối thịnh soạn.')
    ],
    grammarPoints: [
      g('1. Cấu trúc nhấn mạnh 是……的', 'Chủ ngữ + 是 + [Thời gian / Địa điểm / Cách thức / Đối tượng] + Động từ + 的', 'Dùng khi sự việc ĐÃ XẢY RA, người nói muốn nhấn mạnh vào chi tiết: khi nào, ở đâu, bằng phương tiện gì, do ai làm.', [
        { hanzi: '我们是昨天认识的。', pinyin: 'Wǒmen shì zuótiān rènshi de.', vi: 'Chúng tôi quen nhau vào ngày hôm qua (nhấn mạnh thời gian).' },
        { hanzi: '这本书是他送的。', pinyin: 'Zhè běn shū shì tā sòng de.', vi: 'Cuốn sách này là do anh ấy tặng (nhấn mạnh người tặng).' }
      ]),
      g('2. Câu kiêm ngữ (Pivotal Sentence)', 'Chủ ngữ + Động từ 1 (请/叫/让) + Tân ngữ 1 (Kiêm Chủ ngữ 2) + Động từ 2', 'Tân ngữ của động từ thứ nhất đồng thời làm chủ ngữ thực hiện hành động của động từ thứ hai.', [
        { hanzi: '老师请我们吃烤鸭。', pinyin: 'Lǎoshī qǐng wǒmen chī kǎoyā.', vi: 'Cô giáo mời chúng tôi ăn vịt quay (chúng tôi là người ăn).' },
        { hanzi: '妈妈叫我回家吃饭。', pinyin: 'Māma jiào wǒ huí jiā chī fàn.', vi: 'Mẹ bảo tôi về nhà ăn cơm.' }
      ])
    ],
    tips: {
      culture: 'Vịt quay Bắc Kinh (全聚德 - Toàn Tụ Đức, 便宜坊 - Tiện Nghi Phường) ăn kèm bánh tráng mỏng, hành hoa, dưa chuột và sốt tương ngọt đặc trưng là biểu tượng ẩm thực Trung Hoa.',
      examTip: 'Cấu trúc 是……的 là trọng điểm bắt buộc thi trong HSK 2 và HSK 3. Chú ý rằng hành động trong câu này luôn là việc ĐÃ XẢY RA trong quá khứ.',
      practicalApp: 'Kể lại một trải nghiệm du lịch, trả lời khi người khác hỏi bạn đã đến Trung Quốc bằng cách nào, khi nào.'
    },
    practice: [
      p(1, 'Trong câu "我们是坐高铁来的", cấu trúc "是……的" nhấn mạnh điều gì?', ['A. Nhấn mạnh thời gian', 'B. Nhấn mạnh phương thức di chuyển', 'C. Nhấn mạnh địa điểm', 'D. Nhấn mạnh mục đích'], 1, 'Nhấn mạnh phương thức:坐高铁 (đi tàu cao tốc).'),
      p(2, 'Chọn câu kiêm ngữ đúng cấu trúc:', ['A. 他请我去喝咖啡。', 'B. 他去我请喝咖啡。', 'C. 我请喝咖啡他去。', 'D. 他请喝咖啡我去。'], 0, 'Cấu trúc kiêm ngữ: S + 请 + Người + V hành động: 他请我去喝咖啡.'),
      p(3, 'Lượng từ thích hợp cho "bữa ăn": 一______饭', ['A. 个', 'B. 顿', 'C. 件', 'D. 张'], 1, 'Lượng từ của bữa ăn là "顿" (dùn).')
    ]
  },
  '2-7': {
    dialogues: [
      d('李文', '王明，你平时喜欢什么体育运动？', 'Wáng Míng, nǐ píngshí xǐhuan shénme tǐyù yùndòng?', 'Vương Minh, ngày thường bạn thích môn thể thao nào?'),
      d('王明', '我最喜欢打篮球。张伟篮球打得真好！', 'Wǒ zuì xǐhuan dǎ lánqiú. Zhāng Wěi lánqiú dǎ de zhēn hǎo!', 'Tôi thích nhất là chơi bóng rổ. Trương Vĩ chơi bóng rổ đỉnh thật đấy!'),
      d('李文', '对啊，他跑得快，跳得也高。', 'Duì a, tā pǎo de kuài, tiào de yě gāo.', 'Đúng thế, cậu ấy chạy vừa nhanh, nhảy lại cao.'),
      d('王明', '他一有时间就去操场打球，练习得非常刻苦。', 'Tā yì yǒu shíjiān jiù qù cāochǎng dǎ qiú, liànxí de fēicháng kèkǔ.', 'Cậu ấy cứ có thời gian là ra sân bóng rổ, luyện tập cực kỳ chăm chỉ.')
    ],
    vocabulary: [
      v('篮球', 'lánqiú', 'lam cầu', 'Danh từ', 'bóng rổ', '打篮球。', 'Dǎ lánqiú.', 'Chơi bóng rổ.'),
      v('得', 'de', 'đắc', 'Trợ từ kết cấu', 'đến mức, một cách (sau động từ bổ ngữ trạng thái)', '跑得快。', 'Pǎo de kuài.', 'Chạy rất nhanh.'),
      v('一……就……', 'yī... jiù...', 'nhất... tựu...', 'Cấu trúc liên từ', 'hễ... là..., vừa... liền...', '他一听到音乐就跳舞。', 'Tā yì tīngdào yīnyuè jiù tiàowǔ.', 'Anh ấy vừa nghe thấy nhạc là nhảy.'),
      v('跑', 'pǎo', 'bào', 'Động từ', 'chạy', '跑步锻炼身体。', 'Pǎobù duànliàn shēntǐ.', 'Chạy bộ rèn luyện sức khỏe.'),
      v('跳', 'tiào', 'khiêu', 'Động từ', 'nhảy', '跳得很高。', 'Tiào de hěn gāo.', 'Nhảy rất cao.'),
      v('操场', 'cāochǎng', 'thao trường', 'Danh từ', 'sân vận động, sân thể dục', '学校大操场。', 'Xuéxiào dà cāochǎng.', 'Sân vận động lớn của trường.'),
      v('刻苦', 'kèkǔ', 'khắc khổ', 'Tính từ', 'chăm chỉ, miệt mài', '刻苦钻研。', 'Kèkǔ zuānyán.', 'Chăm chỉ nghiên cứu.'),
      v('体育', 'tǐyù', 'thể dục', 'Danh từ', 'thể dục thể thao', '体育锻炼。', 'Tǐyù duànliàn.', 'Rèn luyện thể dục.')
    ],
    grammarPoints: [
      g('1. Bổ ngữ trạng thái với trợ từ 得', 'Động từ + 得 + Tính từ / Cụm miêu tả mức độ', 'Dùng để đánh giá hoặc miêu tả mức độ, kết quả của một hành động đã diễn ra thường xuyên hoặc thành thục.', [
        { hanzi: '他说汉语说得很好。', pinyin: 'Tā shuō Hànyǔ shuō de hěn hǎo.', vi: 'Anh ấy nói tiếng Trung nói rất giỏi.' },
        { hanzi: '他起得很早。', pinyin: 'Tā qǐ de hěn zǎo.', vi: 'Anh ấy dậy rất sớm.' }
      ]),
      g('2. Cấu trúc câu liên kết: 一……就……', 'Chủ ngữ + 一 + Hành động 1 + 就 + Hành động 2', 'Biểu thị hai hành động nối tiếp nhau khẩn trương (vừa mới làm xong A liền lập tức làm B), hoặc một điều kiện hễ xảy ra là kéo theo kết quả tất yếu.', [
        { hanzi: '我一放学就回家。', pinyin: 'Wǒ yí fàngxué jiù huí jiā.', vi: 'Tôi vừa tan học là về nhà liền.' },
        { hanzi: '他一生气就脸红。', pinyin: 'Tā yì shēngqì jiù liǎnhóng.', vi: 'Cậu ấy hễ tức giận là đỏ mặt.' }
      ])
    ],
    tips: {
      culture: 'Bóng rổ là một trong những môn thể thao đại chúng được giới trẻ Trung Quốc yêu thích cuồng nhiệt nhất kể từ thời kỳ Yao Ming (Diêu Minh) thi đấu tại NBA.',
      examTip: 'Nếu động từ mang tân ngữ, phải lặp lại động từ trước khi thêm 得: V + O + V + 得 + Adj (vd: 打篮球打得好).',
      practicalApp: 'Khen ngợi kỹ năng của bạn bè, bình luận trận đấu thể thao, chia sẻ thói quen hàng ngày.'
    },
    practice: [
      p(1, 'Chọn câu ĐÚNG khi động từ mang tân ngữ kèm bổ ngữ trạng thái:', ['A. 他打篮球得好。', 'B. 他打篮球打得好。', 'C. 他打得篮球好。', 'D. 他好打篮球得。'], 1, 'Quy tắc lặp động từ: S + V + O + V + 得 + Adj: 他打篮球打得好.'),
      p(2, 'Ý nghĩa của cấu trúc "一……就……" là:', ['A. Không bao giờ làm', 'B. Vừa... liền... / Hễ... là...', 'C. Mặc dù... nhưng...', 'D. Vì... cho nên...'], 1, 'Biểu thị sự việc xảy ra nối tiếp tức thì hoặc quan hệ điều kiện.'),
      p(3, 'Trợ từ "得" trong bổ ngữ trạng thái được phát âm là:', ['A. dé', 'B. de (thanh nhẹ)', 'C. děi', 'D. dào'], 1, 'Trợ từ kết cấu 得 phát âm thanh nhẹ (de).')
    ]
  },

  // HSK 3: Key Lessons
  '3-10': {
    dialogues: [
      d('李文', '王明，上周我借你的那本《中国历史》你看完了吗？', 'Wáng Míng, shàng zhōu wǒ jiè nǐ de nà běn 《Zhōngguó Lìshǐ》 nǐ kànwán le ma?', 'Vương Minh, cuốn "Lịch sử Trung Quốc" tôi cho bạn mượn tuần trước bạn đọc xong chưa?'),
      d('王明', '我看完了，写得真精彩！你明天在学校吗？我明天再把书还给你。', 'Wǒ kànwán le, xiě de zhēn jīngcǎi! Nǐ míngtiān zài xuéxiào ma? Wǒ míngtiān zài bǎ shū huán gěi nǐ.', 'Tôi đọc xong rồi, viết hay lắm! Mai bạn có ở trường không? Mai tôi sẽ đem sách trả lại cho bạn.'),
      d('李文', '好的，你把书放在我桌子上就行。', 'Hǎo de, nǐ bǎ shū fàng zài wǒ zhuōzi shang jiù xíng.', 'Được rồi, bạn cứ đặt sách lên bàn của tôi là được.'),
      d('王明', '没问题，明天上午我一定把书送过去！', 'Méi wèntí, míngtiān shàngwǔ wǒ yídìng bǎ shū sòng guòqu!', 'Không thành vấn đề, sáng mai tôi nhất định sẽ mang sách sang!')
    ],
    vocabulary: [
      v('把', 'bǎ', 'bả', 'Giới từ', 'đem, mang (đưa tân ngữ lên trước động từ)', '把门关上。', 'Bǎ mén guānshang.', 'Đóng cửa lại.'),
      v('还', 'huán', 'hoàn', 'Động từ', 'trả lại, hoàn trả', '还钱。', 'Huán qián.', 'Trả tiền.'),
      v('放', 'fàng', 'phóng', 'Động từ', 'để, đặt', '把手机放在包里。', 'Bǎ shǒujī fàng zài bāo lǐ.', 'Để điện thoại vào trong túi xách.'),
      v('借', 'jiè', 'tá', 'Động từ', 'mượn, cho mượn', '从图书馆借书。', 'Cóng túshūguǎn jiè shū.', 'Mượn sách từ thư viện.'),
      v('桌子', 'zhuōzi', 'trác tử', 'Danh từ', 'cái bàn', '木桌子。', 'Mù zhuōzi.', 'Bàn gỗ.'),
      v('一定', 'yídìng', 'nhất định', 'Phó từ', 'nhất định, chắc chắn', '明天我一定去。', 'Míngtiān wǒ yídìng qù.', 'Ngày mai tôi nhất định sẽ đi.'),
      v('精彩', 'jīngcǎi', 'tinh thải', 'Tính từ', 'đặc sắc, xuất sắc', '精彩的表演。', 'Jīngcǎi de biǎoyǎn.', 'Màn biểu diễn đặc sắc.'),
      v('历史', 'lìshǐ', 'lịch sử', 'Danh từ', 'lịch sử', '悠久的历史。', 'Yōujiǔ de lìshǐ.', 'Lịch sử lâu đời.')
    ],
    grammarPoints: [
      g('1. Câu chữ 把 (Cơ bản) - Tác động làm thay đổi vị trí hoặc trạng thái', 'Chủ ngữ + 把 + Tân ngữ (Xác định) + Động từ + Thành phần khác (在/到/给/Kết quả)', 'Chủ thể chủ động thực hiện hành động tác động lên một tân ngữ xác định làm cho tân ngữ đó dịch chuyển vị trí, đổi chủ sở hữu hoặc biến đổi trạng thái.', [
        { hanzi: '请你把窗户打开。', pinyin: 'Qǐng nǐ bǎ chuānghu dǎkāi.', vi: 'Làm ơn mở cửa sổ ra.' },
        { hanzi: '他把作业做完了。', pinyin: 'Tā bǎ zuòyè zuòwán le.', vi: 'Anh ấy đã làm xong bài tập rồi.' }
      ]),
      g('2. Vị trí của phó từ phủ định và động từ năng nguyện trong câu chữ 把', 'Chủ ngữ + [Phủ định (没/别) / Năng nguyện (想/要/能)] + 把 + Tân ngữ + Động từ + ...', 'Các từ phủ định (没, 别) và động từ năng nguyện (想, 要, 能, 可以) BẮT BUỘC phải đặt TRƯỚC chữ 把, tuyệt đối không đặt sau động từ.', [
        { hanzi: '你别把水倒在地上。', pinyin: 'Nǐ bié bǎ shuǐ dào zài dì shang.', vi: 'Bạn đừng đổ nước ra sàn nhà.' },
        { hanzi: '我想把这封信寄出去。', pinyin: 'Wǒ xiǎng bǎ zhè fēng xìn jì chūqu.', vi: 'Tôi muốn gửi bức thư này đi.' }
      ])
    ],
    tips: {
      culture: 'Mượn sách thư viện hoặc đồ dùng giữa bạn bè sinh viên Trung Quốc rất đề cao tính tín nhiệm: "有借有还，再借不难" (Có mượn có trả, mượn lại chẳng khó).',
      examTip: 'Câu chữ 把 là câu then chốt nhất của HSK 3! Tân ngữ sau 把 bắt buộc phải là đối tượng xác định (đã biết cụ thể, không dùng số lượng từ phiếm chỉ như "一本书").',
      practicalApp: 'Nhờ người khác chuyển đồ, dọn dẹp phòng ốc, trả sách thư viện, hoàn tất thủ tục bàn giao.'
    },
    practice: [
      p(1, 'Chọn câu chữ 把 có vị trí phó từ phủ định ĐÚNG:', ['A. 我把作业没做完。', 'B. 我没把作业做完。', 'C. 我把没作业做完。', 'D. 我把作业做不完。'], 1, 'Từ phủ định (没) phải đứng TRƯỚC chữ 把: 我没把作业做完.'),
      p(2, 'Tân ngữ đứng sau chữ "把" phải mang đặc điểm gì?', ['A. Là sự vật chưa xác định', 'B. Là đối tượng cụ thể, đã xác định', 'C. Bắt buộc phải là người', 'D. Không được là danh từ'], 1, 'Tân ngữ trong câu chữ 把 phải là vật/đối tượng đã xác định.'),
      p(3, 'Dịch sang tiếng Trung: "Làm ơn đóng cửa lại giúp tôi."', ['A. 请关上门。', 'B. 请把门关上。', 'C. 门请把关上。', 'D. 把门请关上。'], 1, 'Cấu trúc tác động biến đổi trạng thái: 请把门关上.')
    ]
  },
  '3-14': {
    dialogues: [
      d('李文', '玛丽，你借的那本词典去哪儿了？我想查个生词。', 'Mǎlì, nǐ jiè de nà běn cídiǎn qù nǎr le? Wǒ xiǎng chá gè shēngcí.', 'Mary, cuốn từ điển bạn mượn đâu rồi? Tôi muốn tra một từ mới.'),
      d('玛丽', '真不好意思，那本书昨天被别人借走了。', 'Zhēn bù hǎoyìsi, nà běn shū zuótiān bèi biérén jièzǒu le.', 'Thực sự xin lỗi, cuốn sách đó hôm qua bị người khác mượn đi mất rồi.'),
      d('李文', '没关系，那我们可以先在手机应用上查，然后再记在笔记本里。', 'Méi guānxi, nà wǒmen kěyǐ xiān zài shǒujī yìngyòng shang chá, ránhòu zài jì zài bǐjìběn lǐ.', 'Không sao, vậy chúng mình có thể tra trên ứng dụng điện thoại trước, sau đó ghi lại vào sổ tay.'),
      d('玛丽', '好办法！这样既快又方便！', 'Hǎo bànfǎ! Zhèyàng jì kuài yòu fāngbiàn!', 'Cách hay đấy! Như thế này vừa nhanh vừa tiện lợi!')
    ],
    vocabulary: [
      v('被', 'bèi', 'bị', 'Giới từ', 'bị, được (câu bị động)', '蛋糕被弟弟吃了。', 'Dàngāo bèi dìdi chī le.', 'Bánh kem bị em trai ăn mất rồi.'),
      v('借走', 'jièzǒu', 'tá tẩu', 'Cụm động từ', 'mượn đi mất', '车被朋友借走了。', 'Chē bèi péngyou jièzǒu le.', 'Xe bị bạn mượn đi rồi.'),
      v('先……再……然后', 'xiān... zài... ránhòu', 'tiên... tái... nhiên hậu', 'Cấu trúc thứ tự', 'trước tiên... rồi... sau đó...', '先洗手再吃饭。', 'Xiān xǐshǒu zài chī fàn.', 'Rửa tay trước rồi mới ăn cơm.'),
      v('生词', 'shēngcí', 'sinh từ', 'Danh từ', 'từ mới', '复习生词。', 'Fùxí shēngcí.', 'Ôn tập từ mới.'),
      v('查', 'chá', 'tra', 'Động từ', 'tra cứu, kiểm tra', '查字典。', 'Chá zìdiǎn.', 'Tra từ điển.'),
      v('笔记本', 'bǐjìběn', 'bút ký bản', 'Danh từ', 'vở ghi chép, sổ tay / máy tính xách tay', '做笔记。', 'Zuò bǐjì.', 'Ghi chép bài.'),
      v('既……又……', 'jì... yòu...', 'ký... hựu...', 'Liên từ', 'vừa... lại vừa...', '既便宜又好用。', 'Jì piányi yòu hǎoyòng.', 'Vừa rẻ lại vừa tốt.'),
      v('抱歉', 'bàoqiàn', 'bão khiểm', 'Tính từ / Động từ', 'xin lỗi, áy náy', '深感抱歉。', 'Shēngǎn bàoqiàn.', 'Vô cùng xin lỗi.')
    ],
    grammarPoints: [
      g('1. Câu bị động chữ 被', 'Chủ ngữ (Người/Vật bị tác động) + 被 + (Tác nhân gây ra) + Động từ + Thành phần khác', 'Dùng để nhấn mạnh đối tượng tiếp nhận tác động chịu một sự biến đổi, thường mang sắc thái không mong muốn, bất như ý hoặc khách quan.', [
        { hanzi: '我的自行车被偷了。', pinyin: 'Wǒ de zìxíngchē bèi tōu le.', vi: 'Xe đạp của tôi bị trộm mất rồi.' },
        { hanzi: '苹果被他吃光了。', pinyin: 'Píngguǒ bèi tā chīguāng le.', vi: 'Táo bị anh ấy ăn sạch rồi.' }
      ]),
      g('2. Diễn đạt trình tự hành động: 先……再……然后……', '先 + Hành động 1, 再 + Hành động 2, 然后 + Hành động 3', 'Dùng để mô tả một chuỗi thao tác, các bước thực hiện theo thứ tự thời gian logic.', [
        { hanzi: '我们先去超市，再去银行，然后回家。', pinyin: 'Wǒmen xiān qù chāoshì, zài qù yínháng, ránhòu huí jiā.', vi: 'Chúng mình đi siêu thị trước, rồi đến ngân hàng, sau đó về nhà.' }
      ])
    ],
    tips: {
      culture: 'Trong khẩu ngữ thường ngày, ngoài chữ 被, người Trung Quốc rất hay dùng chữ "叫" (jiào) hoặc "让" (ràng) để biểu đạt câu bị động: 我的笔叫他拿走了 (Bút của tôi bị cậu ấy cầm đi rồi).',
      examTip: 'Điểm mấu chốt HSK 3: Nếu câu bị động dùng 叫 hoặc 让 thì BẮT BUỘC phải có tác nhân đứng sau (không được lược bỏ tác nhân như chữ 被).',
      practicalApp: 'Trình bày sự cố, báo mất đồ dùng cá nhân, hướng dẫn các bước nấu ăn hoặc làm thủ tục hành chính.'
    },
    practice: [
      p(1, 'Chọn câu bị động chữ 被 đúng chuẩn ngữ pháp:', ['A. 他被自行车偷了。', 'B. 自行车被偷了。', 'C. 被自行车偷了。', 'D. 自行车偷被了。'], 1, 'Chủ ngữ tiếp nhận tác động đứng đầu: 自行车被偷了.'),
      p(2, 'Cấu trúc diễn tả trình tự làm việc theo các bước là:', ['A. 先……再……然后……', 'B. 虽然……但是……', 'C. 因为……所以……', 'D. 不但……而且……'], 0, '先...再...然后... biểu thị thứ tự hành động trước sau.'),
      p(3, 'Trong câu "书被借走了", tác nhân gây ra hành động:', ['A. Bắt buộc phải nói rõ', 'B. Có thể được lược bỏ', 'C. Luôn là người nói', 'D. Đứng ở cuối câu'], 1, 'Trong câu chữ 被, tác nhân thực hiện có thể được lược bỏ nếu không rõ hoặc không cần nhắc tới.')
    ]
  }
};

// Merge all detailed mappings into roadmap
roadmap.standardCourse48Lessons = roadmap.standardCourse48Lessons.map(lesson => {
  const key = `${lesson.hskLevel}-${lesson.lessonNumber}`;
  if (detailedMap[key]) {
    const item = detailedMap[key];
    return {
      ...lesson,
      dialogues: item.dialogues,
      vocabulary: item.vocabulary,
      grammarPoints: item.grammarPoints,
      cultureAndTips: item.cultureAndTips || item.tips,
      practice: item.practice
    };
  }
  return lesson;
});

fs.writeFileSync(roadmapPath, JSON.stringify(roadmap, null, 2), 'utf8');
console.log('Successfully enriched key lessons with handcrafted deep pedagogical blueprints!');
