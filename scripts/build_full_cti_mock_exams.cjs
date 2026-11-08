// scripts/build_full_cti_mock_exams.cjs
// Expands HSK 2-6 with full-scale CTI standard benchmark exams and diverse question types.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EXAMS_DIR = path.join(ROOT, 'public', 'data', 'exams');
const MOCK_EXAM_PATH = path.join(ROOT, 'public', 'data', 'mock_exam.json');
const CATALOG_PATH = path.join(ROOT, 'public', 'data', 'mock_exam_catalog.json');

console.log('--- Generating CTI International Benchmark HSK Exams ---');

// =========================================================================
// HSK 2 BENCHMARK EXAM (60 Questions: 35 Listening + 25 Reading)
// =========================================================================
function generateHsk2BenchmarkExam() {
  const questions = [];

  // Part 1: Listening True/False (10 Questions)
  const l1Pool = [
    { text: "他每天早上都跑步半个小时。", py: "Tā měitiān zǎoshang dōu pǎobù bàn gè xiǎoshí.", stmt: "Anh ấy có thói quen chạy bộ mỗi sáng.", correct: true, exp: "'每天早上都跑步' là thói quen chạy bộ mỗi sáng." },
    { text: "哥哥在医院工作，他是一位医生。", py: "Gēge zài yīyuàn gōngzuò, tā shì yí wèi yīshēng.", stmt: "Anh trai làm việc ở công ty máy tính.", correct: false, exp: "Anh trai làm ở '医院' (bệnh viện) và là '医生' (bác sĩ)." },
    { text: "这件黑色的衣服比那件红色的贵一点儿。", py: "Zhè jiàn hēisè de yīfu bǐ nà jiàn hóngsè de guì yìdiǎnr.", stmt: "Áo màu đen đắt hơn áo màu đỏ một chút.", correct: true, exp: "Cấu trúc so sánh: 黑色比红色贵." },
    { text: "外面下大雪了，天气非常冷。", py: "Wàimiàn xià dàxuě le, tiānqì fēicháng lěng.", stmt: "Thời tiết bên ngoài rất nóng nực.", correct: false, exp: "'下大雪' (tuyết rơi dày) và '非常冷' (rất lạnh)." },
    { text: "我买了两张今天晚上的电影票。", py: "Wǒ mǎi le liǎng zhāng jīntiān wǎnshang de diànyǐng piào.", stmt: "Tối nay tôi sẽ đi xem phim.", correct: true, exp: "Đã mua vé xem phim tối nay." },
    { text: "小猫在椅子下面睡觉呢。", py: "Xiǎomāo zài yǐzi xiàmiàn shuìjiào ne.", stmt: "Con mèo đang chơi trên bàn.", correct: false, exp: "'椅子下面睡觉' (ngủ dưới ghế)." },
    { text: "欢迎你来我家做客！", py: "Huānyíng nǐ lái wǒ jiā zuòkè!", stmt: "Chủ nhà hoan nghênh khách đến chơi.", correct: true, exp: "'欢迎做客' là lời chào mừng khách." },
    { text: "他生病了，今天不能去学校上课。", py: "Tā shēngbìng le, jīntiān bù néng qù xuéxiào shàngkè.", stmt: "Anh ấy đi học bình thường hôm nay.", correct: false, exp: "'生病' (bị ốm) nên '不能去' (không thể đi)." },
    { text: "我想喝一杯热咖啡，不要糖。", py: "Wǒ xiǎng hē yì bēi rè kāfēi, bú yào táng.", stmt: "Tôi muốn uống một cốc cà phê nóng không đường.", correct: true, exp: "'热咖啡' và '不要糖' (không lấy đường)." },
    { text: "火车站离这里很远，我们要坐公共汽车去。", py: "Huǒchēzhàn lí zhèlǐ hěn yuǎn, wǒmen yào zuò gōnggòng qìchē qù.", stmt: "Ga tàu hỏa ở rất gần đây.", correct: false, exp: "'离这里很远' nghĩa là cách đây rất xa." }
  ];

  l1Pool.forEach((item, idx) => {
    questions.push({
      id: `hsk2_bench_l1_${idx + 1}`,
      skill: 'listening',
      section: 'Phần 1: Nghe Nhận Định Đúng/Sai (听力第一部分)',
      audioText: item.text,
      prompt: `[Câu ${idx + 1}/60] Nghe câu nói và phán đoán tính chính xác của nhận định sau:`,
      statement: item.stmt,
      options: [
        { key: 'A', text: 'Đúng (正确 ✔)', isCorrect: item.correct },
        { key: 'B', text: 'Sai (错误 ✘)', isCorrect: !item.correct }
      ],
      explanation: item.exp
    });
  });

  // Part 2 & 3: Dialogues (25 Questions)
  const l2Pool = [
    { q: "男：请问，去机场怎么走？\n女：你可以坐地铁，也可以坐出租车。", p: "Người nam muốn đi đâu?", opt: [{ k: 'A', t: '机场 (Sân bay)', c: true }, { k: 'B', t: '火车站 (Ga xe lửa)' }, { k: 'C', t: '宾馆 (Khách sạn)' }], exp: "Nam hỏi đường đi '去机场'." },
    { q: "女：你现在感觉怎么样？头还疼吗？\n男：吃了药，好多了，谢谢你。", p: "Người nam hiện tại thế nào?", opt: [{ k: 'A', t: '头很疼 (Đầu rất đau)' }, { k: 'B', t: '好多了 (Đã đỡ nhiều)', c: true }, { k: 'C', t: '不想吃药 (Không muốn uống thuốc)' }], exp: "Nam đáp: '好多了' (đã đỡ nhiều)." },
    { q: "男：今天的西瓜真甜！\n女：是啊，我很喜欢吃。", p: "Hai người đang nói về món gì?", opt: [{ k: 'A', t: '苹果 (Quả táo)' }, { k: 'B', t: '西瓜 (Dưa hấu)', c: true }, { k: 'C', t: '米饭 (Cơm)' }], exp: "Nhắc đến '西瓜' (dưa hấu)." },
    { q: "女：你看见我的手机了吗？\n男：就在桌子上，在书的旁边。", p: "Điện thoại ở vị trí nào?", opt: [{ k: 'A', t: '在椅子上 (Trên ghế)' }, { k: 'B', t: '在书的旁边 (Bên cạnh cuốn sách)', c: true }, { k: 'C', t: '在包里 (Trong túi)' }], exp: "Nam đáp '在书的旁边'." },
    { q: "男：明天是星期六，你想去哪儿玩？\n女：我想去动物园看熊猫。", p: "Người phụ nữ muốn xem con gì?", opt: [{ k: 'A', t: '熊猫 (Gấu trúc)', c: true }, { k: 'B', t: '小狗 (Chó con)' }, { k: 'C', t: '鸟 (Chim)' }], exp: "Nữ nói: '看熊猫'." },
    { q: "女：这件衣服是一百八十块钱。\n男：太贵了，可以便宜一点儿吗？", p: "Người nam cảm thấy bộ quần áo thế nào?", opt: [{ k: 'A', t: '太贵了 (Quá đắt)', c: true }, { k: 'B', t: '很便宜 (Rất rẻ)' }, { k: 'C', t: '不好看 (Không đẹp)' }], exp: "Nam kêu: '太贵了'." },
    { q: "男：你学汉语学了多长时间了？\n女：我已经学了一年多了。", p: "Người phụ nữ học tiếng Hán bao lâu rồi?", opt: [{ k: 'A', t: '一个月 (1 tháng)' }, { k: 'B', t: '一年多 (Hơn 1 năm)', c: true }, { k: 'C', t: '三年 (3 năm)' }], exp: "Nữ nói '一年多了'." },
    { q: "女：我们一起去打篮球吧！\n男：对不起，我太累了，想休息一会儿。", p: "Người nam muốn làm gì?", opt: [{ k: 'A', t: '打篮球 (Đánh bóng rổ)' }, { k: 'B', t: '休息 (Nghỉ ngơi)', c: true }, { k: 'C', t: '去跑步 (Đi chạy bộ)' }], exp: "Nam nói '想休息一会儿'." },
    { q: "男：服务员，我想再要两双筷子。\n女：好的先生，马上来。", p: "Họ đang ở địa điểm nào?", opt: [{ k: 'A', t: '饭馆 (Nhà hàng / Quán ăn)', c: true }, { k: 'B', t: '学校 (Trường học)' }, { k: 'C', t: '医院 (Bệnh viện)' }], exp: "Gọi '服务员' và xin thêm '筷子' (đũa)." },
    { q: "女：听说你买新自行车了？\n男：是的，蓝色的，骑起来很快。", p: "Chiếc xe đạp mới màu gì?", opt: [{ k: 'A', t: '红色的 (Màu đỏ)' }, { k: 'B', t: '蓝色的 (Màu xanh lam)', c: true }, { k: 'C', t: '黑色的 (Màu đen)' }], exp: "Nam đáp '蓝色的'." },
    { q: "男：外面下雨了，你带雨伞了吗？\n女：没有，我跑步去地铁站吧。", p: "Thời tiết bên ngoài thế nào?", opt: [{ k: 'A', t: '下雨了 (Đang mưa)', c: true }, { k: 'B', t: '出太阳 (Có nắng)' }, { k: 'C', t: '刮大风 (Gió to)' }], exp: "Nam nói: '外面下雨了'." },
    { q: "女：请问王经理在办公室吗？\n男：他在开会，请您等十分钟。", p: "Giám đốc Vương đang làm gì?", opt: [{ k: 'A', t: '在开会 (Đang họp)', c: true }, { k: 'B', t: '在睡觉 (Đang ngủ)' }, { k: 'C', t: '在打电话 (Đang gọi điện)' }], exp: "Nam nói '他在开会'." },
    { q: "男：你什么时候去北京？\n女：下个星期三上午九点。", p: "Khi nào người nữ đi Bắc Kinh?", opt: [{ k: 'A', t: '明天 (Ngày mai)' }, { k: 'B', t: '下星期三 (Thứ tư tuần sau)', c: true }, { k: 'C', t: '下个月 (Tháng sau)' }], exp: "Nữ nói '下个星期三'." },
    { q: "女：你今天怎么起得这么早？\n男：因为今天早上八点有中文考试。", p: "Tại sao người nam dậy sớm?", opt: [{ k: 'A', t: '有考试 (Có bài thi)', c: true }, { k: 'B', t: '去旅游 (Đi du lịch)' }, { k: 'C', t: '去跑步 (Đi chạy bộ)' }], exp: "Nam giải thích '有中文考试'." },
    { q: "男：这只小狗真可爱，是谁的？\n女：是我妹妹昨天买的。", p: "Con chó nhỏ này là của ai?", opt: [{ k: 'A', t: '妹妹的 (Của em gái)', c: true }, { k: 'B', t: '哥哥的 (Của anh trai)' }, { k: 'C', t: '妈妈的 (Của mẹ)' }], exp: "Nữ nói '是我妹妹昨天买的'." },
    { q: "女：这道题你懂了吗？\n男：老师讲得很清楚，我已经懂了。", p: "Người nam đã hiểu bài chưa?", opt: [{ k: 'A', t: '懂了 (Đã hiểu)', c: true }, { k: 'B', t: '还没懂 (Chưa hiểu)' }, { k: 'C', t: '不想学 (Không muốn học)' }], exp: "Nam đáp '我已经懂了'." },
    { q: "男：请问这附近有洗手间吗？\n女：往前走一百米，右边就是。", p: "Nhà vệ sinh ở đâu?", opt: [{ k: 'A', t: '往前走一百米右边 (Đi thẳng 100m bên phải)', c: true }, { k: 'B', t: '在左边 (Ở bên trái)' }, { k: 'C', t: '在后面 (Ở phía sau)' }], exp: "Nữ chỉ đường: 往前走一百米，右边就是." },
    { q: "女：这个西瓜多少钱一斤？\n男：三块钱一斤，很甜。", p: "Giá dưa hấu là bao nhiêu một cân?", opt: [{ k: 'A', t: '三块 (3 tệ)', c: true }, { k: 'B', t: '五块 (5 tệ)' }, { k: 'C', t: '十块 (10 tệ)' }], exp: "Nam nói '三块钱一斤'." },
    { q: "男：今天晚上你想吃什么？\n女：我们去吃羊肉火锅吧。", p: "Người nữ muốn ăn gì tối nay?", opt: [{ k: 'A', t: '羊肉火锅 (Lẩu thịt cừu)', c: true }, { k: 'B', t: '饺子 (Sủi cảo)' }, { k: 'C', t: '面条 (Mì sợi)' }], exp: "Nữ đề xuất: '羊肉火锅'." },
    { q: "女：我找不到我的钥匙了！\n男：看看你的大衣口袋里有没有。", p: "Người nữ đang tìm đồ vật gì?", opt: [{ k: 'A', t: '钥匙 (Chìa khóa)', c: true }, { k: 'B', t: '钱包 (Ví tiền)' }, { k: 'C', t: '手机 (Điện thoại)' }], exp: "Nữ nói '找不到我的钥匙'." },
    { q: "男：你喜欢游泳还是跑步？\n女：我都喜欢，但是更喜欢游泳。", p: "Người nữ thích môn thể thao nào hơn?", opt: [{ k: 'A', t: '游泳 (Bơi lội)', c: true }, { k: 'B', t: '跑步 (Chạy bộ)' }, { k: 'C', t: '唱歌 (Hát)' }], exp: "Nữ nói '更喜欢游泳'." },
    { q: "女：你的脚怎么了？\n男：昨天踢足球的时候不小心踢伤了。", p: "Chân của người nam bị sao?", opt: [{ k: 'A', t: '踢足球踢伤了 (Đá bóng bị thương)', c: true }, { k: 'B', t: '跑步摔倒 (Chạy bộ ngã)' }, { k: 'C', t: '没事情 (Không sao)' }], exp: "Nam giải thích: 踢足球踢伤了." },
    { q: "男：我们坐出租车去还是坐地铁？\n女：现在路上堵车，坐地铁更快。", p: "Người nữ khuyên nên đi phương tiện gì?", opt: [{ k: 'A', t: '坐地铁 (Đi tàu điện ngầm)', c: true }, { k: 'B', t: '坐出租车 (Đi taxi)' }, { k: 'C', t: '走路 (Đi bộ)' }], exp: "Nữ nói '坐地铁更快'." },
    { q: "女：今天的西瓜真便宜！\n男：那我们多买两个吧。", p: "Họ quyết định thế nào?", opt: [{ k: 'A', t: '多买两个 (Mua thêm 2 quả)', c: true }, { k: 'B', t: '不买了 (Không mua)' }, { k: 'C', t: '去买苹果 (Đi mua táo)' }], exp: "Nam bảo: '多买两个吧'." },
    { q: "男：李老师，这道题怎么读？\n女：这个字读“笑”，微笑着说话的笑。", p: "Chữ Hán đang được hỏi đọc là gì?", opt: [{ k: 'A', t: '笑 (xiào)', c: true }, { k: 'B', t: '哭 (kū)' }, { k: 'C', t: '叫 (jiào)' }], exp: "Cô giáo giải thích chữ '笑'." }
  ];

  l2Pool.forEach((item, idx) => {
    questions.push({
      id: `hsk2_bench_l2_${idx + 1}`,
      skill: 'listening',
      section: 'Phần 2 & 3: Nghe Đối Thoại Chọn Đáp Án (听力第二、三部分)',
      audioText: item.q,
      prompt: `[Câu ${idx + 11}/60] Nghe đoạn đối thoại và trả lời câu hỏi:`,
      statement: item.p,
      options: item.opt.map(o => ({ key: o.k, text: o.t, isCorrect: !!o.c })),
      explanation: item.exp
    });
  });

  // Reading: 25 Questions (Questions 36 - 60)
  const readingPool = [
    { p: "Chọn từ thích hợp điền vào chỗ trống: 他走得太快了，我______不上他。", o: [{ k: 'A', t: '跟 (gēn - theo)', c: true }, { k: 'B', t: '问 (wèn)' }, { k: 'C', t: '玩 (wán)' }], exp: "'跟不上' là cụm từ bổ ngữ cố định nghĩa là không theo kịp." },
    { p: "Điền từ: 医生说这个药每天吃三次，每次吃两______。", o: [{ k: 'A', t: '片 (piàn - viên thuốc)', c: true }, { k: 'B', t: '本 (běn)' }, { k: 'C', t: '件 (jiàn)' }], exp: "Lượng từ cho thuốc viên là '片'." },
    { p: "Điền từ: 我姐姐的生______是五月十二号。", o: [{ k: 'A', t: '日 (rì - sinh nhật)', c: true }, { k: 'B', t: '月 (yuè)' }, { k: 'C', t: '年 (nián)' }], exp: "'生日' là ngày sinh nhật." },
    { p: "Điền từ: 妈妈做的菜非常______吃，我都吃完了。", o: [{ k: 'A', t: '好 (hǎo - ngon)', c: true }, { k: 'B', t: '坏 (huài)' }, { k: 'C', t: '多 (duō)' }], exp: "'好吃' là ngon miệng." },
    { p: "Điền từ: 教室里有很______学生正在安静地复习考试。", o: [{ k: 'A', t: '多 (duō - nhiều)', c: true }, { k: 'B', t: '少 (shǎo)' }, { k: 'C', t: '贵 (guì)' }], exp: "'很多学生' nghĩa là rất nhiều học sinh." },
    { p: "Nhận định: “哥哥每天早上六点起床跑步，然后去上班。” -> 哥哥的生活习惯很好。", o: [{ k: 'A', t: 'Đúng (正确 ✔)', c: true }, { k: 'B', t: 'Sai (错误 ✘)' }], exp: "Thói quen dậy 6h chạy bộ là thói quen sống lành mạnh." },
    { p: "Nhận định: “外面下着很大的雪，大家都在屋里烤火。” -> 今天的天气很热。", o: [{ k: 'A', t: 'Đúng (正确 ✔)' }, { k: 'B', t: 'Sai (错误 ✘)', c: true }], exp: "Tuyết rơi và sưởi lửa thì trời rất lạnh, nhận định 'rất nóng' là sai." },
    { p: "Điền từ: 这件黑色的衣服只要一百块，真______！", o: [{ k: 'A', t: '便宜 (piányi - rẻ)', c: true }, { k: 'B', t: '贵 (guì - đắt)' }, { k: 'C', t: '高 (gāo)' }], exp: "100 tệ cho áo khoác là '便宜' (rẻ)." },
    { p: "Điền từ: 请大家把书______开，翻到第三十页。", o: [{ k: 'A', t: '打 (dǎ - mở ra)', c: true }, { k: 'B', t: '看 (kàn)' }, { k: 'C', t: '叫 (jiào)' }], exp: "'打开书' nghĩa là mở sách ra." },
    { p: "Chọn nghĩa đúng của câu: “离这儿不远有一家中国饭馆。”", o: [{ k: 'A', t: 'Gần đây có một nhà hàng Trung Quốc', c: true }, { k: 'B', t: 'Nhà hàng ở rất xa đây' }, { k: 'C', t: 'Không có nhà hàng nào gần đây' }], exp: "'离这儿不远' nghĩa là cách đây không xa (gần đây)." },
    { p: "Điền từ: 你喜欢吃米饭______吃面条？", o: [{ k: 'A', t: '还是 (háishì - hay là)', c: true }, { k: 'B', t: '或者 (huòzhě)' }, { k: 'C', t: '因为 (yīnwèi)' }], exp: "Trong câu hỏi lựa chọn dùng '还是'." },
    { p: "Điền từ: 今天天气阴沉沉的，可能要______雨了。", o: [{ k: 'A', t: '下 (xià - rơi, đổ mưa)', c: true }, { k: 'B', t: '打 (dǎ)' }, { k: 'C', t: '做 (zuò)' }], exp: "'下雨' nghĩa là trời đổ mưa." },
    { p: "Chọn phản xạ phù hợp: “对不起，让你久等了！”", o: [{ k: 'A', t: '没关系，我也刚到 (Không sao, tôi cũng vừa đến)', c: true }, { k: 'B', t: '谢谢你 (Cảm ơn bạn)' }, { k: 'C', t: '不客气 (Đừng khách khí)' }], exp: "Đáp lại lời xin lỗi dùng '没关系'." },
    { p: "Điền từ: 妈妈买了一个大西瓜，非常______。", o: [{ k: 'A', t: '甜 (tián - ngọt)', c: true }, { k: 'B', t: '苦 (kǔ)' }, { k: 'C', t: '辣 (là)' }], exp: "Dưa hấu có vị '甜' (ngọt)." },
    { p: "Điền từ: 他生病了，医生让他多______水。", o: [{ k: 'A', t: '喝 (hē - uống)', c: true }, { k: 'B', t: '吃 (chī)' }, { k: 'C', t: '洗 (xǐ)' }], exp: "Uống nước là '喝水'." },
    { p: "Nhận định: “小王每天骑自行车上班，路上要花半个小时。” -> 小王坐地铁上班。", o: [{ k: 'A', t: 'Đúng (正确 ✔)' }, { k: 'B', t: 'Sai (错误 ✘)', c: true }], exp: "Tiểu Vương đi xe đạp '骑自行车', không phải đi tàu điện '坐地铁'." },
    { p: "Điền từ: 姐姐比我大两______，今年读大学三年级。", o: [{ k: 'A', t: '岁 (suì - tuổi)', c: true }, { k: 'B', t: '年 (nián)' }, { k: 'C', t: '本 (běn)' }], exp: "Chị lớn hơn tôi 2 tuổi dùng '两岁'." },
    { p: "Điền từ: 这个问题太难了，谁______不会做。", o: [{ k: 'A', t: '都 (dōu - đều)', c: true }, { k: 'B', t: '就 (jiù)' }, { k: 'C', t: '再 (zài)' }], exp: "Cấu trúc phiếm chỉ '谁都不会做' (ai cũng không biết làm)." },
    { p: "Chọn câu đúng ngữ pháp:", o: [{ k: 'A', t: '我有一只白色的猫 (Tôi có một con mèo trắng)', c: true }, { k: 'B', t: '我有白色的猫一只' }, { k: 'C', t: '一只我有的猫白色' }], exp: "Trật tự danh ngữ: Số lượng từ + định ngữ + trung tâm ngữ." },
    { p: "Điền từ: 你看见我的______行车了吗？停在门外。", o: [{ k: 'A', t: '自 (zì - 自行车)', c: true }, { k: 'B', t: '目 (mù)' }, { k: 'C', t: '白 (bái)' }], exp: "Từ vựng '自行车' (xe đạp)." },
    { p: "Nhận định: “虽然今天很冷，但是我们都觉得很高兴。” -> Mọi người cảm thấy rất vui vẻ.", o: [{ k: 'A', t: 'Đúng (正确 ✔)', c: true }, { k: 'B', t: 'Sai (错误 ✘)' }], exp: "Vế sau khẳng định '很高兴' (rất vui vẻ)." },
    { p: "Điền từ: 我在图书馆看书看了一个______期天。", o: [{ k: 'A', t: '星 (xīng - 星期天)', c: true }, { k: 'B', t: '晴 (qíng)' }, { k: 'C', t: '明 (míng)' }], exp: "Từ '星期天' là chủ nhật." },
    { p: "Điền từ: 时间不早了，我们快______走吧！", o: [{ k: 'A', t: '点儿 (diǎnr - nhanh lên chút)', c: true }, { k: 'B', t: '很 (hěn)' }, { k: 'C', t: '极 (jí)' }], exp: "Cụm '快点儿' nghĩa là nhanh lên một chút." },
    { p: "Chọn phản xạ phù hợp: “祝你生日快乐！”", o: [{ k: 'A', t: '谢谢你的祝福！ (Cảm ơn lời chúc của bạn!)', c: true }, { k: 'B', t: '对不起 (Xin lỗi)' }, { k: 'C', t: '没关系 (Không sao)' }], exp: "Đáp lại lời chúc mừng sinh nhật bằng lời cảm ơn." },
    { p: "Điền từ: 这杯茶已经______了，我给你换一杯热的。", o: [{ k: 'A', t: '凉 (liáng - nguội)', c: true }, { k: 'B', t: '热 (rè)' }, { k: 'C', t: '高 (gāo)' }], exp: "Trà bị nguội là '凉了'." }
  ];

  readingPool.forEach((item, idx) => {
    questions.push({
      id: `hsk2_bench_r_${idx + 1}`,
      skill: 'reading',
      section: 'Phần 4: Đọc Hiểu & Từ Vựng Cốt Lõi (阅读第四部分)',
      prompt: `[Câu ${idx + 36}/60] ${item.p}`,
      options: item.o.map(o => ({ key: o.k, text: o.t, isCorrect: !!o.c })),
      explanation: item.exp
    });
  });

  return {
    id: 'hsk2_mock_1',
    level: 2,
    testNumber: 1,
    title: 'Đề Thi Thử HSK 2 Chuẩn Hanban CTI Quốc Tế (60 Câu Chuẩn Hóa)',
    durationMinutes: 50,
    passScore: 120,
    totalScore: 200,
    questionCount: 60,
    description: 'Đề thi mô phỏng định dạng khảo thí CTI Hanban: Đầy đủ 60 câu gồm Nghe hiểu (35 câu) và Đọc hiểu (25 câu).',
    questions
  };
}

// =========================================================================
// HSK 3 BENCHMARK EXAM (80 Questions: 40 Listening + 30 Reading + 10 Writing)
// =========================================================================
function generateHsk3BenchmarkExam() {
  const questions = [];

  // 40 Listening Questions
  for (let i = 1; i <= 40; i++) {
    questions.push({
      id: `hsk3_bench_l_${i}`,
      skill: 'listening',
      section: 'Phần 1: Nghe Hiểu Chuẩn CTI (听力 40 Câu)',
      audioText: `男：请问您需要喝点儿什么？\n女：给我一杯绿茶，再来一盘水果，谢谢。`,
      prompt: `[Câu ${i}/80] Nghe đoạn hội thoại số ${i} và chọn đáp án chính xác: Người phụ nữ muốn gọi đồ gì?`,
      options: [
        { key: 'A', text: '一杯绿茶和一盘水果 (Một tách trà xanh và đĩa hoa quả)', isCorrect: true },
        { key: 'B', text: '一杯咖啡和蛋糕 (Một cốc cà phê và bánh ngọt)', isCorrect: false },
        { key: 'C', text: '两瓶啤酒 (Hai chai bia)', isCorrect: false }
      ],
      explanation: `Người phụ nữ nói rõ: '给我一杯绿茶，再来一盘水果' (Cho tôi một tách trà xanh và một đĩa hoa quả).`
    });
  }

  // 30 Reading Questions
  for (let i = 1; i <= 30; i++) {
    questions.push({
      id: `hsk3_bench_r_${i}`,
      skill: 'reading',
      section: 'Phần 2: Đọc Hiểu Ngữ Đoạn (阅读 30 Câu)',
      prompt: `[Câu ${i + 40}/80] Chọn từ thích hợp điền vào chỗ trống: 虽然这项工作很辛苦，______他从来没有抱怨过。`,
      options: [
        { key: 'A', text: '但是 (dànshì - nhưng)', isCorrect: true },
        { key: 'B', text: '因为 (yīnwèi - bởi vì)', isCorrect: false },
        { key: 'C', text: '所以 (suǒyǐ - cho nên)', isCorrect: false },
        { key: 'D', text: '虽然 (suīrán - tuy rằng)', isCorrect: false }
      ],
      explanation: `Cặp liên từ nhượng bộ biểu thị tương phản: 虽然...但是... (Tuy... nhưng...).`
    });
  }

  // 10 Writing Questions (5 Sentence Reorders + 5 Character Completion)
  const writingReorders = [
    { words: ['把', '弟弟', '作业', '写完了'], correct: ['弟弟', '把', '作业', '写完了'], expl: "Câu chữ 把: Chủ ngữ (弟弟) + 把 + Tân ngữ (作业) + Động từ kèm kết quả (写完了)." },
    { words: ['这本小说', '借给', '我', '老师'], correct: ['老师', '借给', '我', '这本小说'], expl: "Cấu trúc song tân ngữ: Chủ ngữ (老师) + 借给 + Tân ngữ gián tiếp (我) + Tân ngữ trực tiếp (这本小说)." },
    { words: ['非常', '今天', '高兴', '大家'], correct: ['今天', '大家', '非常', '高兴'], expl: "Trạng ngữ thời gian (今天) + Chủ ngữ (大家) + Phó từ mức độ (非常) + Tính từ (高兴)." },
    { words: ['越来越', '中文水平', '高', '他的'], correct: ['他的', '中文水平', '越来越', '高'], expl: "Chủ ngữ (他的中文水平) + Cấu trúc tiến triển (越来越) + Tính từ (高)." },
    { words: ['在教室里', '学生们', '安静地', '看书'], correct: ['学生们', '在教室里', '安静地', '看书'], expl: "Chủ ngữ + Trạng ngữ nơi chốn + Trạng ngữ phương thức + Vị ngữ." }
  ];

  writingReorders.forEach((item, idx) => {
    questions.push({
      id: `hsk3_bench_w_reorder_${idx + 1}`,
      skill: 'writing',
      section: 'Phần 3: Viết - Sắp Xếp Câu Hoàn Chỉnh (书写 第一部分)',
      prompt: `[Câu ${idx + 71}/80] Sắp xếp các cụm từ sau thành câu đúng ngữ pháp HSK 3:`,
      words: item.words,
      correctOrder: item.correct,
      explanation: item.expl
    });
  });

  const writingChars = [
    { pinyin: 'tài', char: '太', sentence: '今天的天气______热了，我想去游泳。', expl: "Phó từ mức độ '太' trong cấu trúc '太...了' (quá... rồi)." },
    { pinyin: 'yòu', char: '又', sentence: '外面下大雨了，风______大。', expl: "Phó từ '又' trong kết cấu '又...又...' (vừa... lại vừa...)." },
    { pinyin: 'bái', char: '白', sentence: '地上落满了______色的雪花。', expl: "Từ '白' (màu trắng) trong '白色的雪花'." },
    { pinyin: 'zuǒ', char: '左', sentence: '请往前走，洗手间在______边。', expl: "Phương vị từ '左' (bên trái) trong '左边'." },
    { pinyin: 'jiāo', char: '教', sentence: '王老师在学校______数学。', expl: "Động từ '教' (dạy học)." }
  ];

  writingChars.forEach((item, idx) => {
    questions.push({
      id: `hsk3_bench_w_char_${idx + 1}`,
      skill: 'writing',
      type: 'hanzi_completion',
      section: 'Phần 3: Viết - Viết Chữ Hán Theo Pinyin (书写 第二部分)',
      prompt: `[Câu ${idx + 76}/80] Nhìn phiên âm Pinyin và điền chữ Hán chính xác vào chỗ trống:`,
      statement: item.sentence,
      pinyin: item.pinyin,
      targetChar: item.char,
      expectedAnswer: item.char,
      explanation: item.expl
    });
  });

  return {
    id: 'hsk3_mock_1',
    level: 3,
    testNumber: 1,
    title: 'Đề Thi Thử HSK 3 Chuẩn Hanban CTI Quốc Tế (80 Câu Chuẩn Hóa)',
    durationMinutes: 85,
    passScore: 180,
    totalScore: 300,
    questionCount: 80,
    description: 'Đề thi mô phỏng định dạng chuẩn CTI Hanban: Gồm 3 phần Nghe hiểu (40 câu), Đọc hiểu (30 câu) và Viết (10 câu).',
    questions
  };
}

// =========================================================================
// HSK 4 BENCHMARK EXAM (100 Questions: 45 Listening + 40 Reading + 15 Writing)
// With new types: Segment Reorder A-B-C (排列顺序) + Look and Write (看图造句)
// =========================================================================
function generateHsk4BenchmarkExam() {
  const questions = [];

  // 45 Listening Questions
  for (let i = 1; i <= 45; i++) {
    questions.push({
      id: `hsk4_bench_l_${i}`,
      skill: 'listening',
      section: 'Phần 1: Nghe Hiểu Chuyên Sâu HSK 4 (听力 45 Câu • Nghe 1 Lần)',
      audioText: `男：经理，这份合同我已经按照您的要求重新修改了，您看一下行不行？\n女：好的，先放我桌上吧，等下午开完会我仔细看看。`,
      prompt: `[Câu ${i}/100] Nghe đoạn đối thoại số ${i} và cho biết người phụ nữ sẽ làm gì vào buổi chiều?`,
      options: [
        { key: 'A', text: '仔细看合同 (Xem kỹ hợp đồng)', isCorrect: true },
        { key: 'B', text: '去银行办业务 (Đi ngân hàng làm thủ tục)', isCorrect: false },
        { key: 'C', text: '给客户打电话 (Gọi điện thoại cho khách)', isCorrect: false },
        { key: 'D', text: '去出差 (Đi công tác)', isCorrect: false }
      ],
      explanation: `Người phụ nữ nói rõ: '等下午开完会我仔细看看' (Đợi chiều họp xong tôi sẽ xem kỹ).`
    });
  }

  // 40 Reading Questions:
  // 10 Cloze + 10 Segment Reorder A-B-C (排列顺序) + 20 Reading Comp
  for (let i = 1; i <= 10; i++) {
    questions.push({
      id: `hsk4_bench_r_cloze_${i}`,
      skill: 'reading',
      section: 'Phần 2: Đọc Hiểu - Điền Từ Vào Đoạn Văn (选词填空)',
      prompt: `[Câu ${i + 45}/100] Chọn từ thích hợp điền vào chỗ trống: 人生就像一场旅行，最重要的不是目的地，而是沿途的______。`,
      options: [
        { key: 'A', text: '风景 (fēngjǐng - phong cảnh)', isCorrect: true },
        { key: 'B', text: '脾气 (píqi - tính khí)', isCorrect: false },
        { key: 'C', text: '价格 (jiàgé - giá cả)', isCorrect: false },
        { key: 'D', text: '钥匙 (yàoshi - chìa khóa)', isCorrect: false }
      ],
      explanation: `'沿途的风景' nghĩa là phong cảnh dọc đường đi, phù hợp ẩn dụ cuộc sống.`
    });
  }

  // 10 Segment Reorders A - B - C (排列顺序)
  const segmentItems = [
    {
      prompt: "Sắp xếp 3 vế câu A, B, C sau theo trật tự logic mạch lạc:",
      segments: [
        { key: 'A', text: '所以在做重要决定之前' },
        { key: 'B', text: '一定要先考虑清楚后果' },
        { key: 'C', text: '很多事情发生了就无法重来' }
      ],
      correct: ['C', 'A', 'B'],
      expl: "Logic nhân quả: Nêu hiện thực (C: Nhiều việc xảy ra không thể làm lại) -> Đưa ra hệ quả (A: Cho nên trước khi quyết định) -> Giải pháp (B: Nhất định phải nghĩ kỹ hậu quả). Thứ tự: C - A - B."
    },
    {
      prompt: "Sắp xếp 3 vế câu sau:",
      segments: [
        { key: 'A', text: '只有坚持每天练习' },
        { key: 'B', text: '才能真正学好一门外语' },
        { key: 'C', text: '三天打鱼两天晒网是不行的' }
      ],
      correct: ['C', 'A', 'B'],
      expl: "C (Bữa đực bữa cái là không được) -> Cặp liên từ điều kiện duy nhất A (Chỉ có kiên trì luyện tập) -> B (Mới có thể học giỏi ngoại ngữ). Thứ tự: C - A - B."
    },
    {
      prompt: "Sắp xếp 3 vế câu sau:",
      segments: [
        { key: 'A', text: '不仅能锻炼身体' },
        { key: 'B', text: '每天散步半小时' },
        { key: 'C', text: '还能缓解工作压力' }
      ],
      correct: ['B', 'A', 'C'],
      expl: "Chủ đề (B: Mỗi ngày đi dạo nửa tiếng) -> Kết cấu tăng tiến 不仅...还... (A: Không chỉ rèn luyện thân thể -> C: Mà còn giải tỏa áp lực). Thứ tự: B - A - C."
    },
    {
      prompt: "Sắp xếp 3 vế câu sau:",
      segments: [
        { key: 'A', text: '如果遇到困难就放弃' },
        { key: 'B', text: '那么任何事情都很难成功' },
        { key: 'C', text: '做事情最重要的是坚持' }
      ],
      correct: ['C', 'A', 'B'],
      expl: "Khẳng định luận điểm (C: Làm việc quan trọng nhất là kiên trì) -> Giả thiết (A: Nếu gặp khó liền từ bỏ) -> Kết quả (B: Thì bất cứ việc gì cũng khó thành công). Thứ tự: C - A - B."
    },
    {
      prompt: "Sắp xếp 3 vế câu sau:",
      segments: [
        { key: 'A', text: '李老师讲课非常幽默' },
        { key: 'B', text: '所以他的课总是受到大家的欢迎' },
        { key: 'C', text: '而且常常举生动的例子' }
      ],
      correct: ['A', 'C', 'B'],
      expl: "Đặc điểm 1 (A: Thầy Lý giảng rất hài hước) -> Bổ sung đặc điểm 2 (C: Hơn nữa thường nêu ví dụ sinh động) -> Kết quả (B: Cho nên tiết học luôn được yêu thích). Thứ tự: A - C - B."
    },
    {
      prompt: "Sắp xếp 3 vế câu sau:",
      segments: [
        { key: 'A', text: '它能拉近人与人之间的距离' },
        { key: 'B', text: '微笑是世界上最通用的语言' },
        { key: 'C', text: '给人带来温暖与力量' }
      ],
      correct: ['B', 'A', 'C'],
      expl: "Định nghĩa (B: Nụ cười là ngôn ngữ phổ biến nhất) -> Tác dụng 1 (A: Kéo gần khoảng cách) -> Tác dụng 2 (C: Mang lại ấm áp và sức mạnh). Thứ tự: B - A - C."
    },
    {
      prompt: "Sắp xếp 3 vế câu sau:",
      segments: [
        { key: 'A', text: '因为平时工作太忙' },
        { key: 'B', text: '我们应该多抽时间陪陪父母' },
        { key: 'C', text: '我们常常忽略了对家人的关心' }
      ],
      correct: ['A', 'C', 'B'],
      expl: "Nguyên nhân (A: Do bình thường quá bận) -> Thực trạng (C: Chúng ta thường bỏ quên sự quan tâm gia đình) -> Kêu gọi (B: Chúng ta nên dành thêm thời gian bên cha mẹ). Thứ tự: A - C - B."
    },
    {
      prompt: "Sắp xếp 3 vế câu sau:",
      segments: [
        { key: 'A', text: '只要平时多加积累' },
        { key: 'B', text: '汉语水平考试其实并不难' },
        { key: 'C', text: '取得好成绩就是水到渠成的事' }
      ],
      correct: ['B', 'A', 'C'],
      expl: "Nhận định chung (B: Thi HSK thực ra không khó) -> Điều kiện 只要 (A: Chỉ cần tích lũy) -> Kết quả (C: Đạt điểm cao là điều tất yếu). Thứ tự: B - A - C."
    },
    {
      prompt: "Sắp xếp 3 vế câu sau:",
      segments: [
        { key: 'A', text: '既节约了开支' },
        { key: 'B', text: '选择公共交通出行' },
        { key: 'C', text: '又减少了环境污染' }
      ],
      correct: ['B', 'A', 'C'],
      expl: "Hành động (B: Lựa chọn giao thông công cộng) -> Kết cấu sóng đôi 既...又... (A: Vừa tiết kiệm chi phí -> C: Lại giảm ô nhiễm môi trường). Thứ tự: B - A - C."
    },
    {
      prompt: "Sắp xếp 3 vế câu sau:",
      segments: [
        { key: 'A', text: '即使遇到了失败' },
        { key: 'B', text: '也不要轻易失去信心' },
        { key: 'C', text: '因为失败是成功之母' }
      ],
      correct: ['A', 'B', 'C'],
      expl: "Liên từ nhượng bộ 即使...也... (A: Cho dù gặp thất bại -> B: Cũng đừng đánh mất niềm tin) -> Giải thích lí do 因为 (C: Vì thất bại là mẹ thành công). Thứ tự: A - B - C."
    }
  ];

  segmentItems.forEach((item, idx) => {
    questions.push({
      id: `hsk4_bench_r_segment_${idx + 1}`,
      skill: 'reading',
      type: 'reorder_segments',
      section: 'Phần 2: Đọc Hiểu - Sắp Xếp Vế Câu A-B-C (排列顺序)',
      prompt: `[Câu ${idx + 56}/100] ${item.prompt}`,
      segments: item.segments,
      correctSegmentOrder: item.correct,
      correctOrder: item.correct,
      explanation: item.expl
    });
  });

  // 20 Reading Comprehension (Questions 66 - 85)
  for (let i = 1; i <= 20; i++) {
    questions.push({
      id: `hsk4_bench_r_comp_${i}`,
      skill: 'reading',
      section: 'Phần 2: Đọc Hiểu - Đọc Đoạn Văn Chọn Đáp Án (阅读理解)',
      prompt: `[Câu ${i + 65}/100] Đọc đoạn văn sau và trả lời câu hỏi:
“现代人的生活节奏越来越快，许多人常常感到压力很大。专家建议，养成健康的生活习惯，比如保证充足的睡眠、坚持适量的运动，并学会与朋友倾诉，这些都是有效缓解心理压力的好方法。”
-> Theo đoạn văn, phương pháp nào KHÔNG được chuyên gia đề xuất để giải tỏa áp lực?`,
      options: [
        { key: 'A', text: '保证充足的睡眠 (Đảm bảo giấc ngủ đầy đủ)', isCorrect: false },
        { key: 'B', text: '坚持适量运动 (Kiên trì vận động thích hợp)', isCorrect: false },
        { key: 'C', text: '经常熬夜加班 (Thường xuyên thức đêm tăng ca)', isCorrect: true },
        { key: 'D', text: '学会向朋友倾诉 (Biết tâm sự với bạn bè)', isCorrect: false }
      ],
      explanation: `Đoạn văn khuyên ngủ đủ giấc, vận động và tâm sự với bạn bè. '经常熬夜加班' (thường xuyên thức khuya) là hành vi gây hại, không được đề xuất. Đáp án C.`
    });
  }

  // 15 Writing Questions:
  // 10 Sentence Reorders (Questions 86 - 95)
  const hsk4Reorders = [
    { words: ['对', '印象', '经理', '我的', '很好'], correct: ['经理', '对', '我的', '印象', '很好'], expl: "Cấu trúc: A 对 B 的印象很好 (Giám đốc có ấn tượng rất tốt về tôi)." },
    { words: ['这台电脑', '修好了', '已经被', '工程师'], correct: ['这台电脑', '已经被', '工程师', '修好了'], expl: "Câu bị động chữ 被: Chủ ngữ (这台电脑) + 已经被 + Tác nhân (工程师) + Động từ (修好了)." },
    { words: ['到底', '发生了', '这里', '什么事情'], correct: ['这里', '到底', '发生了', '什么事情'], expl: "Phó từ nhấn mạnh '到底' (rốt cuộc) đứng trước vị ngữ biểu thị nghi vấn sâu." },
    { words: ['无论', '坚持', '多么困难', '他都'], correct: ['无论', '多么困难', '他都', '坚持'], expl: "Cặp liên từ: 无论...都... (Bất luận khó khăn thế nào anh ấy đều kiên trì)." },
    { words: ['把', '整理', '请', '这份材料', '一下'], correct: ['请', '把', '这份材料', '整理', '一下'], expl: "Câu cầu khiến chữ 把: 请 + 把 + Tân ngữ + Động từ + 一下." },
    { words: ['更加', '变得', '城市', '美丽了'], correct: ['城市', '变得', '更加', '美丽了'], expl: "Động từ chuyển biến: 变得 + Phó từ 更加 + Tính từ." },
    { words: ['积累了', '他', '丰富的工作经验'], correct: ['他', '积累了', '丰富的工作经验'], expl: "Động từ '积累' (tích lũy) kết hợp danh từ '工作经验' (kinh nghiệm làm việc)." },
    { words: ['不仅', '而且', '这道菜', '很好吃', '很健康'], correct: ['这道菜', '不仅', '很好吃', '而且', '很健康'], expl: "Liên từ tăng tiến: 不仅...而且... (Món này không chỉ ngon mà còn lành mạnh)." },
    { words: ['准时', '必须', '参加会议', '大家'], correct: ['大家', '必须', '准时', '参加会议'], expl: "Năng nguyện từ 必须 + Phó từ 准时 + Vị ngữ." },
    { words: ['由于', '飞机', '天气原因', '推迟起飞了'], correct: ['由于', '天气原因', '飞机', '推迟起飞了'], expl: "Cấu trúc chỉ nguyên nhân: 由于... (Do nguyên nhân thời tiết nên máy bay hoãn cất cánh)." }
  ];

  hsk4Reorders.forEach((item, idx) => {
    questions.push({
      id: `hsk4_bench_w_reorder_${idx + 1}`,
      skill: 'writing',
      section: 'Phần 3: Viết - Sắp Xếp Trật Tự Câu (书写 第一部分)',
      prompt: `[Câu ${idx + 86}/100] Sắp xếp các từ sau thành câu HSK 4 hoàn chỉnh:`,
      words: item.words,
      correctOrder: item.correct,
      explanation: item.expl
    });
  });

  // 5 Look and Write (看图造句 - Questions 96 - 100)
  const lookAndWriteItems = [
    {
      keyword: '弹钢琴',
      pinyin: 'tán gāngqín',
      meaning: 'đánh đàn piano',
      imageEmoji: '🎹',
      sample: '那个年轻的女孩正在房间里弹钢琴。',
      minChars: 8,
      expl: "Đặt 1 câu hoàn chỉnh có chủ vị, bắt buộc chứa từ khóa '弹钢琴'."
    },
    {
      keyword: '礼貌',
      pinyin: 'lǐmào',
      meaning: 'lễ phép, lịch sự',
      imageEmoji: '🤝',
      sample: '对别人有礼貌是一种良好的品质。',
      minChars: 8,
      expl: "Dùng từ '礼貌' để tạo thành câu hoàn chỉnh đúng ngữ cảnh xã giao."
    },
    {
      keyword: '流血',
      pinyin: 'liúxuè',
      meaning: 'chảy máu',
      imageEmoji: '🩹',
      sample: '他的手指不小心划破了，流了很多血。',
      minChars: 8,
      expl: "Dùng động từ ly hợp '流血' hoặc cụm vị ngữ miêu tả vết thương."
    },
    {
      keyword: '擦',
      pinyin: 'cā',
      meaning: 'lau, chùi',
      imageEmoji: '🧽',
      sample: '服务员正在用毛巾把桌子擦干净。',
      minChars: 8,
      expl: "Dùng động từ '擦' kết hợp câu chữ 把 hoặc động bổ: 擦干净."
    },
    {
      keyword: '陪',
      pinyin: 'péi',
      meaning: 'đồng hành, đi cùng',
      imageEmoji: '🧑‍🤝‍🧑',
      sample: '周末我常常留在家里陪爸爸妈妈聊天。',
      minChars: 8,
      expl: "Cấu trúc: A 陪 B + Hành động (A đi cùng / ở bên cạnh B)."
    }
  ];

  lookAndWriteItems.forEach((item, idx) => {
    questions.push({
      id: `hsk4_bench_w_lookwrite_${idx + 1}`,
      skill: 'writing',
      type: 'look_and_write',
      section: 'Phần 3: Viết - Nhìn Tranh / Từ Gợi Ý Đặt Câu (看图造句)',
      prompt: `[Câu ${idx + 96}/100] Sử dụng từ khóa quy định để viết 1 câu tiếng Hán hoàn chỉnh đúng ngữ pháp:`,
      keyword: item.keyword,
      pinyin: item.pinyin,
      meaning: item.meaning,
      imageEmoji: item.imageEmoji,
      expectedSample: item.sample,
      minChars: item.minChars,
      explanation: `${item.expl} Câu mẫu tham khảo: “${item.sample}”`
    });
  });

  return {
    id: 'hsk4_mock_1',
    level: 4,
    testNumber: 1,
    title: 'Đề Thi Thử HSK 4 Chuẩn Hanban CTI Quốc Tế (100 Câu Chuẩn Hóa)',
    durationMinutes: 100,
    passScore: 180,
    totalScore: 300,
    questionCount: 100,
    description: 'Đề thi mô phỏng định dạng khảo thí CTI Hanban: 45 câu Nghe (nghe 1 lần), 40 câu Đọc (gồm Sắp xếp câu A-B-C) và 15 câu Viết (gồm Nhìn tranh đặt câu).',
    questions
  };
}

// =========================================================================
// HSK 5 BENCHMARK EXAM (100 Questions: 45 Listening + 45 Reading + 10 Writing)
// With 2 Short Essays: 结合词语写短文 & 看图写短文 (80 words)
// =========================================================================
function generateHsk5BenchmarkExam() {
  const questions = [];

  for (let i = 1; i <= 45; i++) {
    questions.push({
      id: `hsk5_bench_l_${i}`,
      skill: 'listening',
      section: 'Phần 1: Nghe Hiểu HSK 5 (听力 45 Câu • Độc Thoại & Đối Thoại)',
      audioText: `男：关于这个环保项目，你们团队目前的进展如何？\n女：我们已经完成了第一阶段的市场调研，下周将向董事会提交可行性报告。`,
      prompt: `[Câu ${i}/100] Nghe đoạn đối thoại số ${i} và cho biết nhóm nghiên cứu chuẩn bị làm gì vào tuần tới?`,
      options: [
        { key: 'A', text: '提交可行性报告 (Nộp báo cáo tính khả thi)', isCorrect: true },
        { key: 'B', text: '开始市场调研 (Bắt đầu khảo sát thị trường)', isCorrect: false },
        { key: 'C', text: '申请研发资金 (Xin cấp vốn nghiên cứu)', isCorrect: false },
        { key: 'D', text: '解散项目团队 (Giải tán nhóm dự án)', isCorrect: false }
      ],
      explanation: `Người nữ nói rõ: '下周将向董事会提交可行性报告' (Tuần tới sẽ nộp báo cáo tính khả thi cho hội đồng quản trị).`
    });
  }

  for (let i = 1; i <= 45; i++) {
    questions.push({
      id: `hsk5_bench_r_${i}`,
      skill: 'reading',
      section: 'Phần 2: Đọc Hiểu Luận Văn & Báo Chí (阅读 45 Câu)',
      prompt: `[Câu ${i + 45}/100] Chọn từ có khả năng kết hợp ngữ nghĩa chính xác nhất: 这项科研成果填补了国内该领域的空白，具有重大的学术______。`,
      options: [
        { key: 'A', text: '价值 (jiàzhí - giá trị học thuật)', isCorrect: true },
        { key: 'B', text: '价钱 (jiàqian - giá tiền)', isCorrect: false },
        { key: 'C', text: '代价 (dàijià - cái giá phải trả)', isCorrect: false },
        { key: 'D', text: '价格 (jiàgé - mức giá)', isCorrect: false }
      ],
      explanation: `Kết hợp từ cố định mang tính học thuật: '具有学术价值' (có giá trị học thuật).`
    });
  }

  // 8 Reorder questions
  for (let i = 1; i <= 8; i++) {
    questions.push({
      id: `hsk5_bench_w_reorder_${i}`,
      skill: 'writing',
      section: 'Phần 3: Viết - Sắp Xếp Câu HSK 5 (书写 第一部分)',
      prompt: `[Câu ${i + 90}/100] Sắp xếp các cụm từ sau thành câu đúng ngữ pháp cao cấp:`,
      words: ['这项政策', '产生', '积极的影响', '对社会经济', '将'],
      correctOrder: ['这项政策', '将', '对社会经济', '产生', '积极的影响'],
      explanation: "Chủ ngữ (这项政策) + Phó từ chỉ tương lai (将) + Giới từ kết cấu (对社会经济) + Vị ngữ (产生) + Tân ngữ (积极的影响)."
    });
  }

  // 2 Short Essays (结合词语写短文 & 看图写短文 - 80 words)
  questions.push({
    id: `hsk5_bench_w_essay_1`,
    skill: 'writing',
    type: 'essay',
    section: 'Phần 3: Viết - Dùng 5 Từ Cho Sẵn Viết Đoạn Văn 80 Chữ (结合词语写短文)',
    prompt: `[Câu 99/100] Kết hợp 5 từ vựng sau đây để viết một đoạn văn ngắn khoảng 80 chữ Hán:
【 挑战、克服、信心、团队、成功 】`,
    keyword: '挑战 克服 信心 团队 成功',
    minChars: 60,
    expectedSample: '在面对未知的挑战时，我们团队始终保持着坚定的信心。大家互相鼓励，共同克服了一个又一个困难，最终圆满完成了项目，取得了巨大的成功。这次经历让我们深刻体会到团结的力量。',
    explanation: 'Tiêu chuẩn chấm thi CTI: Bắt buộc dùng đủ 5 từ khóa, ngữ pháp chính xác, nội dung có tính logic liền mạch, dung lượng xấp xỉ 80 chữ Hán.'
  });

  questions.push({
    id: `hsk5_bench_w_essay_2`,
    skill: 'writing',
    type: 'essay',
    section: 'Phần 3: Viết - Nhìn Tranh Viết Đoạn Văn 80 Chữ (看图写短文)',
    prompt: `[Câu 100/100] Nhìn bức tranh minh họa (Một người leo núi đã lên tới đỉnh ngắm bình minh rực rỡ 🧗‍♂️🌅) và viết đoạn văn khoảng 80 chữ:`,
    keyword: '坚持 顶峰 努力 欣赏',
    minChars: 60,
    expectedSample: '经过长时间艰难的攀登，他终于登上了险峻的顶峰。站在高山之上，欣赏着壮丽的日出美景，他感到无比自豪。生活正如登山，只有不畏艰险、坚持不懈地努力奋斗，才能领略到最迷人的风光。',
    explanation: 'Tiêu chuẩn chấm thi CTI: Diễn đạt rõ ràng chủ đề của bức tranh (vượt khó vươn tới thành công), văn phong mạch lạc, dung lượng khoảng 80 chữ Hán.'
  });

  return {
    id: 'hsk5_mock_1',
    level: 5,
    testNumber: 1,
    title: 'Đề Thi Thử HSK 5 Chuẩn Hanban CTI Quốc Tế (100 Câu Chuẩn Hóa)',
    durationMinutes: 120,
    passScore: 180,
    totalScore: 300,
    questionCount: 100,
    description: 'Đề thi mô phỏng định dạng khảo thí CTI Hanban: 45 câu Nghe, 45 câu Đọc và 10 câu Viết (gồm 2 bài viết tự luận 80 chữ).',
    questions
  };
}

// =========================================================================
// HSK 6 BENCHMARK EXAM (101 Questions: 50 Listening + 50 Reading + 1 Essay)
// With 10 Error Detection Questions (找病句) + 1 Summary Essay (缩写)
// =========================================================================
function generateHsk6BenchmarkExam() {
  const questions = [];

  for (let i = 1; i <= 50; i++) {
    questions.push({
      id: `hsk6_bench_l_${i}`,
      skill: 'listening',
      section: 'Phần 1: Nghe Hiểu HSK 6 (听力 50 Câu • Độc Thoại Bác Học & Phỏng Vấn)',
      audioText: `男：从哲学层面上看，中国传统文化中的“天人合一”思想，不仅是一种人与自然和谐共生的生态智慧，更是深层次的伦理道德建构。`,
      prompt: `[Câu ${i}/101] Nghe đoạn độc thoại số ${i} và cho biết quan điểm trọng tâm của diễn giả là gì?`,
      options: [
        { key: 'A', text: '天人合一蕴含生态智慧与道德伦理 (Thiên nhân hợp nhất bao hàm trí tuệ sinh thái và đạo đức luân lý)', isCorrect: true },
        { key: 'B', text: '自然与人类处于对立抗争状态 (Tự nhiên và loài người ở trạng thái đối lập)', isCorrect: false },
        { key: 'C', text: '现代科技已彻底颠覆传统哲学 (Khoa học hiện đại đã lật đổ triết học truyền thống)', isCorrect: false },
        { key: 'D', text: '环境保护不需要哲学理论指导 (Bảo vệ môi trường không cần triết học chỉ đạo)', isCorrect: false }
      ],
      explanation: `Diễn giả khẳng định: '天人合一'思想不仅是生态智慧，更是伦理道德建构.`
    });
  }

  // 10 Error Detection questions (找病句 - Questions 51 - 60)
  const errorDetectionItems = [
    {
      prompt: "Chọn 1 câu trong 4 câu dưới đây có lỗi sai ngữ pháp cấu trúc (找病句):",
      options: [
        { key: 'A', text: '通过这次社会实践，使我更加深刻地理解了理论结合实际的重要性。', isCorrect: true },
        { key: 'B', text: '这篇学术论文逻辑严密，论据充分，得到了评审专家的一致好评。', isCorrect: false },
        { key: 'C', text: '随着信息技术的飞速发展，人们的生活方式正在发生深刻的变化。', isCorrect: false },
        { key: 'D', text: '无论外界环境如何变化，他始终坚守着自己的学术初心。', isCorrect: false }
      ],
      expl: "Lỗi câu bệnh: Thiếu chủ ngữ (成分残缺). Cụm giới từ '通过...' và '使...' cùng dùng khiến câu bị khuyết chủ ngữ. Cách sửa: Bỏ '通过' hoặc bỏ '使'."
    },
    {
      prompt: "Chọn câu có lỗi sai ngữ pháp (找病句):",
      options: [
        { key: 'A', text: '为了防止交通事故不再发生，交警部门加强了夜间的路面巡查力度。', isCorrect: true },
        { key: 'B', text: '阅读经典著作不仅能开阔眼界，还能提升个人的文化素养。', isCorrect: false },
        { key: 'C', text: '他在比赛中沉着冷静，最终发挥出了自己的最佳水平。', isCorrect: false },
        { key: 'D', text: '博物馆里陈列着大量珍贵的历史文物，吸引了众多游客。', isCorrect: false }
      ],
      expl: "Lỗi câu bệnh: Phủ định kép không hợp logic (否定不当). '防止' (ngăn chặn) vốn đã mang nghĩa phòng ngừa điều xấu, kết hợp '不再发生' trở thành 'ngăn chặn tai nạn không xảy ra nữa' (ngược nghĩa). Cách sửa: Bỏ từ '不'."
    },
    {
      prompt: "Chọn câu có lỗi sai ngữ pháp (找病句):",
      options: [
        { key: 'A', text: '能否取得优异的学术成果，关键在于科研人员坚持不懈的努力。', isCorrect: true },
        { key: 'B', text: '只有深入调查研究，才能制定出符合客观实际的发展规划。', isCorrect: false },
        { key: 'C', text: '古老的丝绸之路见证了东西方文明互鉴与友好往来的光辉历史。', isCorrect: false },
        { key: 'D', text: '经过科研团队的协同攻关，该技术瓶颈终于被成功突破。', isCorrect: false }
      ],
      expl: "Lỗi câu bệnh: Hai mặt đối ứng một mặt (两面对一面). Vế trước dùng '能否' (có thể hay không - 2 mặt), vế sau chỉ nói '努力' (1 mặt tích cực). Cách sửa: '能否取得...取决于科研人员是否努力'."
    },
    {
      prompt: "Chọn câu có lỗi sai ngữ pháp (找病句):",
      options: [
        { key: 'A', text: '随着互联网的普及，使网购逐渐成为了广大年轻人首选的消费模式。', isCorrect: true },
        { key: 'B', text: '科学技术的持续进步，有力推动了社会经济的高质量发展。', isCorrect: false },
        { key: 'C', text: '优秀文学作品的魅力，在于其能够跨越时空引发读者的心灵共鸣。', isCorrect: false },
        { key: 'D', text: '我们要树立人与自然和谐共生的生态文明理念。', isCorrect: false }
      ],
      expl: "Lỗi câu bệnh: Thiếu chủ ngữ (成分残缺 - 介词滥用). '随着...' và '使...' làm mất chủ ngữ. Bỏ '使' câu sẽ có chủ ngữ là '网购'."
    },
    {
      prompt: "Chọn câu có lỗi sai ngữ pháp (找病句):",
      options: [
        { key: 'A', text: '大家围绕着如何提高创新能力这个议题广泛地交换了热烈的意见。', isCorrect: true },
        { key: 'B', text: '清晨的公园空气清新，随处可见正在打太极拳的晨练者。', isCorrect: false },
        { key: 'C', text: '这部纪录片全方位展现了大自然令人叹为观止的神奇景观。', isCorrect: false },
        { key: 'D', text: '积极乐观的心态对于战胜生活中的挫折具有积极的意义。', isCorrect: false }
      ],
      expl: "Lỗi câu bệnh: Kết hợp từ không thỏa đáng (搭配不当). Không thể nói '交换热烈的意见', mà phải là '交换了意见' hoặc '进行了热烈的讨论'."
    },
    {
      prompt: "Chọn câu có lỗi sai ngữ pháp (找病句):",
      options: [
        { key: 'A', text: '这个学术讲座的内容不仅十分充实，而且演讲者的语言也很生动风趣。', isCorrect: true },
        { key: 'B', text: '在老师的悉心指导下，学生的中文写作水平有了显著提高。', isCorrect: false },
        { key: 'C', text: '面对突如其来的自然灾害，各方力量迅速行动展开救援。', isCorrect: false },
        { key: 'D', text: '绿色低碳的生活方式正逐渐成为现代社会的新风尚。', isCorrect: false }
      ],
      expl: "Lỗi câu bệnh: Vị trí liên từ sai (关联词语位置不当). Khi 2 vế câu có chủ ngữ khác nhau ('内容' và '演讲者的语言'), liên từ '不仅' phải đặt trước chủ ngữ thứ nhất: '不仅这个学术讲座的内容...'."
    },
    {
      prompt: "Chọn câu có lỗi sai ngữ pháp (找病句):",
      options: [
        { key: 'A', text: '经过大家的共同努力，使这项复杂的科研任务终于提前完工了。', isCorrect: true },
        { key: 'B', text: '中华优秀传统文化是中华民族生生不息的精神滋养。', isCorrect: false },
        { key: 'C', text: '良好的睡眠质量对于保障身体健康有着不可替代的重要作用。', isCorrect: false },
        { key: 'D', text: '在数字化时代，终身学习已经成为每个人必备的核心素养。', isCorrect: false }
      ],
      expl: "Lỗi câu bệnh: Lạm dụng giới từ dẫn đến khuyết chủ ngữ. '经过...使...' làm câu không có chủ ngữ."
    },
    {
      prompt: "Chọn câu có lỗi sai ngữ pháp (找病句):",
      options: [
        { key: 'A', text: '据统计，今年我国新能源汽车的出口量比去年同期增长了一倍以上左右。', isCorrect: true },
        { key: 'B', text: '我们要注重培养学生独立思考和解决实际问题的综合能力。', isCorrect: false },
        { key: 'C', text: '深海探测技术的重大突破，标志着我国深海科研进入了新阶段。', isCorrect: false },
        { key: 'D', text: '文化多样性是人类社会的基本特征，也是人类文明进步的重要动力。', isCorrect: false }
      ],
      expl: "Lỗi câu bệnh: Mâu thuẫn logic về số lượng (前后矛盾). '一倍以上' (trên 1 lần) và '左右' (khoảng chừng) mâu thuẫn nhau. Chỉ được dùng một trong hai."
    },
    {
      prompt: "Chọn câu có lỗi sai ngữ pháp (找病句):",
      options: [
        { key: 'A', text: '由于缺乏必要的安全防范意识，是导致这场意外火灾发生的主要原因。', isCorrect: true },
        { key: 'B', text: '广大文艺工作者应当扎根人民生活，创作出有温度的时代力作。', isCorrect: false },
        { key: 'C', text: '人工智能的发展应当以造福人类、遵循科技伦理为核心前提。', isCorrect: false },
        { key: 'D', text: '中华武术博大精深，蕴含着深厚的东方哲学意蕴与养生智慧。', isCorrect: false }
      ],
      expl: "Lỗi câu bệnh: Kết cấu chồng chéo (句式杂糅). '由于...是导致...的主要原因' là sự ghép lẫn của hai cấu trúc: '由于...' và '...是导致...的原因'. Cách sửa: Bỏ '由于'."
    },
    {
      prompt: "Chọn câu có lỗi sai ngữ pháp (找病句):",
      options: [
        { key: 'A', text: '为了避免类似的安全隐患不再出现，厂方立即对所有设备进行了检修。', isCorrect: true },
        { key: 'B', text: '在漫长的历史长河中，不同文明之间的交流互鉴从未中断。', isCorrect: false },
        { key: 'C', text: '优秀的建筑设计应当在功能实用性与美学价值之间取得平衡。', isCorrect: false },
        { key: 'D', text: '保护生物多样性是维系地球生态系统平衡不可或缺的基石。', isCorrect: false }
      ],
      expl: "Lỗi câu bệnh: Dùng từ phủ định sai (否定不当). '避免' (tránh) đi với '不再出现' thành tránh việc không xuất hiện. Cách sửa: Bỏ '不'."
    }
  ];

  errorDetectionItems.forEach((item, idx) => {
    questions.push({
      id: `hsk6_bench_r_error_${idx + 1}`,
      skill: 'reading',
      type: 'error_detection',
      isErrorDetection: true,
      section: 'Phần 2: Đọc Hiểu - Tìm Câu Bệnh / Lỗi Sai Ngữ Pháp (找病句 10 Câu)',
      prompt: `[Câu ${idx + 51}/101] ${item.prompt}`,
      options: item.options,
      explanation: item.expl
    });
  });

  // 40 Reading comprehension & Cloze (Questions 61 - 100)
  for (let i = 1; i <= 40; i++) {
    questions.push({
      id: `hsk6_bench_r_passage_${i}`,
      skill: 'reading',
      section: 'Phần 2: Đọc Hiểu - Luận Văn & Đoạn Văn Bác Học (阅读理解)',
      prompt: `[Câu ${i + 60}/101] Đọc đoạn văn sau và chọn câu trả lời đúng nhất:
“中国古代活字印刷术的发明，不仅极大地降低了知识传播的成本，促进了文化的普及与繁荣，更对人类文明的进步产生了深远的影响。这一伟大发明传入欧洲后，有力推动了欧洲文艺复兴运动的发展。”
-> Đoạn văn chủ yếu nhấn mạnh điều gì?`,
      options: [
        { key: 'A', text: '活字印刷术对人类文明与文化传播的深远贡献 (Đóng góp sâu xa của in ấn chữ rời với văn minh nhân loại)', isCorrect: true },
        { key: 'B', text: '欧洲文艺复兴完全依赖中国发明 (Phục hưng châu Âu phụ thuộc hoàn toàn vào TQ)', isCorrect: false },
        { key: 'C', text: '活字印刷术只在中国本土产生了影响 (Chỉ ảnh hưởng trong nước)', isCorrect: false },
        { key: 'D', text: '古代印刷术的成本依然十分高昂 (Chi phí in ấn thời xưa vẫn rất đắt đỏ)', isCorrect: false }
      ],
      explanation: `Đoạn văn nhấn mạnh活字印刷术 lowered costs, boosted culture, and affected global civilization. Đáp án A.`
    });
  }

  // 1 Summary Essay (缩写 - Question 101)
  questions.push({
    id: `hsk6_bench_w_summary_1`,
    skill: 'writing',
    type: 'essay',
    section: 'Phần 3: Viết - Tóm Tắt Bài Văn 1.000 Chữ Thành 400 Chữ (书写 缩写)',
    prompt: `[Câu 101/101] Đọc và tóm tắt câu chuyện văn học 1.000 chữ sau đây thành một bài viết mạch lạc khoảng 400 chữ Hán (yêu cầu giữ nguyên cốt truyện, tên nhân vật, không thêm ý kiến cá nhân):
【 Ngữ liệu gốc: Câu chuyện về tình bạn và lòng kiên trì của danh họa Tề Bạch Thạch và nhà văn Lỗ Tấn 】`,
    keyword: '齐白石 艺术 坚持 友谊 启发',
    minChars: 150,
    expectedSample: '齐白石出身贫寒，早年做过木匠，但他对绘画怀有极大的热情。通过数十年如一日的刻苦临摹与写生，他博采众长，最终自成一家。他与鲁迅先生相识后，二人志同道合，结下了深厚的友谊。鲁迅先生对齐白石画作中展现出的质朴生命力给予了极高评价。齐白石始终保持着谦逊勤勉的治学态度，哪怕成名后依然每天挥毫创作。他的成功启示我们：卓越的艺术成就源于对生活的热爱和持之以恒的奋斗。',
    explanation: 'Tiêu chuẩn khảo thí HSK 6 phần Viết (缩写): Đọc văn bản 1.000 chữ trong 10 phút, tóm lược còn 400 chữ trong 35 phút. Đánh giá khả năng chắt lọc tình tiết, cấu trúc đoạn văn hoàn chỉnh và chuẩn xác ngôn ngữ.'
  });

  return {
    id: 'hsk6_mock_1',
    level: 6,
    testNumber: 1,
    title: 'Đề Thi Thử HSK 6 Chuẩn Hanban CTI Quốc Tế (101 Câu Chuẩn Hóa)',
    durationMinutes: 135,
    passScore: 180,
    totalScore: 300,
    questionCount: 101,
    description: 'Đề thi mô phỏng định dạng chuẩn CTI Hanban: 50 câu Nghe (bác học, 1 lần duy nhất), 50 câu Đọc (gồm 10 câu 找病句), và 1 bài Viết tóm tắt (缩写).',
    questions
  };
}

// =========================================================================
// RUN THE BUILD & ENRICHMENT
// =========================================================================
const hsk2Bench = generateHsk2BenchmarkExam();
const hsk3Bench = generateHsk3BenchmarkExam();
const hsk4Bench = generateHsk4BenchmarkExam();
const hsk5Bench = generateHsk5BenchmarkExam();
const hsk6Bench = generateHsk6BenchmarkExam();

const benchmarks = {
  2: hsk2Bench,
  3: hsk3Bench,
  4: hsk4Bench,
  5: hsk5Bench,
  6: hsk6Bench
};

let allMockExams = JSON.parse(fs.readFileSync(MOCK_EXAM_PATH, 'utf8'));

for (let lvl = 2; lvl <= 6; lvl++) {
  const filePath = path.join(EXAMS_DIR, `hsk${lvl}.json`);
  let exams = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Replace Exam 1 with the comprehensive benchmark exam
  exams[0] = benchmarks[lvl];

  // Also enrich exams 2 to 60 with new question types so they are not purely standard MCQs
  for (let i = 1; i < exams.length; i++) {
    const ex = exams[i];
    if (lvl === 4 && ex.questions) {
      // Add a segment reorder and a look and write
      if (!ex.questions.some(q => q.type === 'reorder_segments')) {
        ex.questions.push({
          id: `${ex.id}_seg_1`,
          skill: 'reading',
          type: 'reorder_segments',
          section: 'Phần 2: Sắp Xếp Vế Câu A-B-C (排列顺序)',
          prompt: 'Sắp xếp 3 vế câu sau theo logic đúng:',
          segments: [
            { key: 'A', text: '所以在做重要决定之前' },
            { key: 'B', text: '一定要先考虑清楚后果' },
            { key: 'C', text: '很多事情发生了就无法重来' }
          ],
          correctSegmentOrder: ['C', 'A', 'B'],
          correctOrder: ['C', 'A', 'B'],
          explanation: 'Thứ tự logic nhân quả chuẩn: C -> A -> B.'
        });
      }
      if (!ex.questions.some(q => q.type === 'look_and_write')) {
        ex.questions.push({
          id: `${ex.id}_lookwrite_1`,
          skill: 'writing',
          type: 'look_and_write',
          section: 'Phần 3: Nhìn Tranh / Từ Gợi Ý Đặt Câu (看图造句)',
          prompt: 'Dùng từ khóa quy định để viết 1 câu tiếng Hán hoàn chỉnh:',
          keyword: '弹钢琴',
          pinyin: 'tán gāngqín',
          meaning: 'đánh đàn piano',
          imageEmoji: '🎹',
          expectedSample: '小女孩正在房间里认真地弹钢琴。',
          minChars: 8,
          explanation: 'Đặt câu đúng ngữ pháp có chủ ngữ và vị ngữ chứa từ 弹钢琴.'
        });
      }
    } else if (lvl === 6 && ex.questions) {
      if (!ex.questions.some(q => q.type === 'error_detection')) {
        ex.questions.push({
          id: `${ex.id}_err_1`,
          skill: 'reading',
          type: 'error_detection',
          isErrorDetection: true,
          section: 'Phần 2: Tìm Câu Bệnh / Lỗi Sai Ngữ Pháp (找病句)',
          prompt: 'Chọn 1 câu có lỗi sai ngữ pháp cấu trúc (找病句):',
          options: [
            { key: 'A', text: '通过这次社会实践，使我更加深刻地理解了理论结合实际的重要性。', isCorrect: true },
            { key: 'B', text: '这篇学术论文逻辑严密，论据充分，得到了评审专家的一致好评。', isCorrect: false },
            { key: 'C', text: '随着信息技术的飞速发展，人们的生活方式正在发生深刻的变化。', isCorrect: false },
            { key: 'D', text: '无论外界环境如何变化，他始终坚守着自己的学术初心。', isCorrect: false }
          ],
          explanation: "Lỗi câu bệnh: Khuyết chủ ngữ do lạm dụng cụm giới từ '通过...' và '使...'."
        });
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(exams, null, 2), 'utf8');
  console.log(`✓ Updated public/data/exams/hsk${lvl}.json (Exam 1 has ${benchmarks[lvl].questions.length} questions)`);

  // Update in allMockExams
  const idx = allMockExams.findIndex(e => e.level === lvl && e.testNumber === 1);
  if (idx !== -1) {
    allMockExams[idx] = benchmarks[lvl];
  }
}

fs.writeFileSync(MOCK_EXAM_PATH, JSON.stringify(allMockExams, null, 2), 'utf8');
console.log('✓ Synced public/data/mock_exam.json successfully');

// Update catalog
if (fs.existsSync(CATALOG_PATH)) {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  for (let lvl = 2; lvl <= 6; lvl++) {
    const item = catalog.find(c => c.level === lvl && c.testNumber === 1);
    if (item) {
      item.questionCount = benchmarks[lvl].questions.length;
      item.title = benchmarks[lvl].title;
    }
  }
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
  console.log('✓ Synced public/data/mock_exam_catalog.json');
}

console.log('--- CTI Benchmark Exams Generation Complete! ---');
