// Topic Data: Topics 6 - 8 (Lessons 51 - 80)
module.exports = [
  // ==================== TOPIC 6: DU LỊCH VÀ PHƯƠNG TIỆN DI CHUYỂN (51 - 60) ====================
  {
    num: 51, top: 6, lvl: 'HSK 2', title: 'Hỏi đường đến một địa điểm', hz: '问路与指路', py: 'Wènlù yǔ zhǐlù',
    sit: 'Minh đi bộ ở ngã tư Vương Phủ Tỉnh và hỏi đường đến ga tàu điện ngầm gần nhất.',
    c: [{ n: 'Văn Minh', r: 'Người hỏi đường', g: 'male', a: '👦' }, { n: 'Cảnh sát giao thông', r: 'Người chỉ đường', g: 'male', a: '👮' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '警察同志，请问最近的地铁站在哪儿？', py: 'Jǐngchá tóngzhì, qǐngwèn zuìjìn de dìtiězhàn zài nǎr?', vi: 'Đồng chí cảnh sát ơi, xin hỏi ga tàu điện ngầm gần nhất ở đâu ạ?' },
      { s: 'Cảnh sát giao thông', g: 'male', hz: '你沿着这条街一直往前走，大概两百米，过第二个十字路口往右拐。', py: 'Nǐ yánzhe zhè tiáo jiē yìzhí wǎng qián zǒu, dàgài liǎngbǎi mǐ, guò dì-èr gè shízìlùkǒu wǎng yòu guǎi.', vi: 'Cháu cứ men theo con phố này đi thẳng về phía trước tầm 200m, qua ngã tư thứ hai thì rẽ phải.' },
      { s: 'Văn Minh', g: 'male', hz: '过十字路口右拐就能看到入口了吗？', py: 'Guò shízìlùkǒu yòu guǎi jiù néng kàn dào rùkǒu le ma?', vi: 'Qua ngã tư rẽ phải là thấy lối vào luôn rồi ạ?' },
      { s: 'Cảnh sát giao thông', g: 'male', hz: '对，就在东方新天地商场旁边，看到红色的地铁标志就是了，B口进站。', py: 'Duì, jiù zài Dōngfāng Xīntiāndì shāngchǎng pángbiān, kàn dào hóngsè de dìtiě biāozhì jiù shì le, B kǒu jìnzhàn.', vi: 'Đúng rồi, ngay cạnh trung tâm thương mại Phương Đông Tân Thiên Địa, nhìn thấy logo tàu điện ngầm màu đỏ là tới, vào cổng B nhé.' }
    ],
    v: [{ hz: '沿着', py: 'yánzhe', m: 'men theo, dọc theo', hsk: 'HSK 3' }, { hz: '十字路口', py: 'shízìlùkǒu', m: 'ngã tư đường', hsk: 'HSK 3' }, { hz: '拐', py: 'guǎi', m: 'rẽ, quẹo', hsk: 'HSK 3' }, { hz: '标志', py: 'biāozhì', m: 'biển báo, logo', hsk: 'HSK 4' }],
    g: [{ t: 'Mẫu câu chỉ hướng: 往 + Hướng + 走/拐', s: '往 + 前/后/左/右 + 走/拐', e: '往前走 (đi thẳng), 往右拐 (rẽ phải).' }],
    q: [{ q: 'Để đến ga tàu điện ngầm, sau khi qua ngã tư thứ hai cần rẽ hướng nào?', options: ['Rẽ trái', 'Rẽ phải (往右拐)', 'Quay đầu lại', 'Đi thẳng tiếp 1km'], a: 1, exp: 'Cảnh sát chỉ: "过第二个十字路口往右拐".' }],
    sp: { hz: '请问最近的地铁站在哪儿？一直往前走。', py: 'Qǐngwèn zuìjìn de dìtiězhàn zài nǎr? Yìzhí wǎng qián zǒu.', vi: 'Xin hỏi ga tàu điện ngầm gần nhất ở đâu? Cứ đi thẳng về phía trước.' }
  },
  {
    num: 52, top: 6, lvl: 'HSK 3', title: 'Đặt vé máy bay', hz: '预订飞机票', py: 'Yùdìng fēijīpiào',
    sit: 'Tuấn gọi điện cho đại lý hàng không để đặt vé khứ hồi Hà Nội - Bắc Kinh.',
    c: [{ n: 'Anh Tuấn', r: 'Hành khách', g: 'male', a: '👱‍♂️' }, { n: 'Nhân viên bán vé', r: 'Đại lý hàng không', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Nhân viên bán vé', g: 'female', hz: '中国国航客服，请问有什么可以协助您？', py: 'Zhōngguó Guóháng kèfù, qǐngwèn yǒu shénme kěyǐ xiézhù nín?', vi: 'Chăm sóc khách hàng Air China, xin hỏi có thể hỗ trợ gì cho quý khách ạ?' },
      { s: 'Anh Tuấn', g: 'male', hz: '我想订一张十二月二十号从北京首都机场直飞河内的经济舱机票，需要往返票。', py: 'Wǒ xiǎng dìng yì zhāng shí’èr yuè èrshí hào cóng Běijīng Shǒudū Jīchǎng zhífēi Hénèi de jīngjìcāng jīpiào, xūyào wǎngfǎnpiào.', vi: 'Tôi muốn đặt một vé máy bay khứ hồi hạng phổ thông bay thẳng từ sân bay Thủ Đô Bắc Kinh về Hà Nội ngày 20 tháng 12.' },
      { s: 'Nhân viên bán vé', g: 'female', hz: '当天下午两点十分有一班直飞航班CA741，回程打算定在什么时候？', py: 'Dāngtiān xiàwǔ liǎng diǎn shí fēn yǒu yì bān zhífēi hángbān CA741, huíchéng dǎsuàn dìng zài shénme shíhou?', vi: 'Ngày hôm đó lúc 2 giờ 10 chiều có chuyến bay thẳng CA741, chiều về anh dự định đặt lúc nào ạ?' },
      { s: 'Anh Tuấn', g: 'male', hz: '回程定在明年一月五号。请问往返含税价格是多少？免费托运行李额度有多大？', py: 'Huíchéng dìng zài míngnián yī yuè wǔ hào. Qǐngwèn wǎngfǎn hán shuì jiàgé shì duōshao? Miǎnfèi tuōyùn xíngli édù yǒu duō dà?', vi: 'Chiều về đặt ngày 5 tháng 1 năm sau. Cho hỏi giá khứ hồi gồm thuế là bao nhiêu? Hạn mức hành lý ký gửi miễn phí là bao nhiêu kg?' }
    ],
    v: [{ hz: '直飞', py: 'zhífēi', m: 'bay thẳng', hsk: 'HSK 3' }, { hz: '经济舱', py: 'jīngjìcāng', m: 'hạng phổ thông', hsk: 'HSK 4' }, { hz: '往返票', py: 'wǎngfǎnpiào', m: 'vé khứ hồi', hsk: 'HSK 3' }, { hz: '托运行李', py: 'tuōyùn xíngli', m: 'hành lý ký gửi', hsk: 'HSK 4' }],
    g: [{ t: 'Vé một chiều và khứ hồi: 单程票 / 往返票', s: '买单程票 (Vé 1 chiều), 买往返票 (Vé khứ hồi)', e: '往返票 thường có giá ưu đãi hơn mua hai vé đơn.' }],
    q: [{ q: 'Tuấn đặt vé máy bay đi từ đâu đến đâu?', options: ['Hà Nội - Thượng Hải', 'Bắc Kinh - Hà Nội (北京直飞河内)', 'Bắc Kinh - Đà Nẵng', 'Quảng Châu - Hà Nội'], a: 1, exp: 'Tuấn nói: "从北京首都机场直飞河内".' }],
    sp: { hz: '我想订一张直飞河内的经济舱往返机票。', py: 'Wǒ xiǎng dìng yì zhāng zhífēi Hénèi de jīngjìcāng wǎngfǎn jīpiào.', vi: 'Tôi muốn đặt một vé máy bay khứ hồi hạng phổ thông bay thẳng về Hà Nội.' }
  },
  {
    num: 53, top: 6, lvl: 'HSK 3', title: 'Làm thủ tục tại sân bay', hz: '机场办理登机手续', py: 'Jīchǎng bànlǐ dēngjī shǒuxù',
    sit: 'Mai đến quầy check-in sân bay làm thủ tục lên máy bay và gửi vali.',
    c: [{ n: 'Thanh Mai', r: 'Hành khách', g: 'female', a: '👧' }, { n: 'Nhân viên mặt đất', r: 'Check-in Counter', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Nhân viên mặt đất', g: 'female', hz: '女士您好，请出示您的护照和预订确认单。', py: 'Nǚshì nín hǎo, qǐng chūshì nín de hùzhào hé yùdìng quèrèndān.', vi: 'Chào chị, xin chị vui lòng xuất trình hộ chiếu và phiếu xác nhận đặt chỗ.' },
      { s: 'Thanh Mai', g: 'female', hz: '给您，这是我的护照。我有一件二十三公斤的行李需要托运。', py: 'Gěi nín, zhè shì wǒ de hùzhào. Wǒ yǒu yí jiàn èrshísān gōngjīn de xíngli xūyào tuōyùn.', vi: 'Gửi chị, đây là hộ chiếu của tôi. Tôi có một kiện hành lý 23kg cần ký gửi.' },
      { s: 'Nhân viên mặt đất', g: 'female', hz: '请把行李箱放到传送带上称重。行李箱里没有充电宝和锂电池吧？', py: 'Qǐng bǎ xínglixiāng fàng dào chuánsòngdài shang chēngzhòng. Xínglixiāng lǐ méiyǒu chōngdiànbǎo hé lǐdiànchí ba?', vi: 'Mời chị đặt vali lên băng chuyền để cân. Trong vali không có sạc dự phòng hay pin lithium chứ ạ?' },
      { s: 'Thanh Mai', g: 'female', hz: '没有，充电宝我放在随身背包里了。可以帮我安排一个靠窗的座位吗？', py: 'Méiyǒu, chōngdiànbǎo wǒ fàng zài suíshēn bēibāo lǐ le. Kěyǐ bāng wǒ ānpái yí gè kàochuāng de zuòwèi ma?', vi: 'Không có, sạc dự phòng tôi để trong balo xách tay rồi. Có thể xếp cho tôi chỗ ngồi cạnh cửa sổ không?' }
    ],
    v: [{ hz: '护照', py: 'hùzhào', m: 'hộ chiếu', hsk: 'HSK 3' }, { hz: '传送带', py: 'chuánsòngdài', m: 'băng chuyền cân hành lý', hsk: 'HSK 4' }, { hz: '充电宝', py: 'chōngdiànbǎo', m: 'sạc pin dự phòng', hsk: 'HSK 3' }, { hz: '靠窗/走道', py: 'kàochuāng/zǒudào', m: 'cạnh cửa sổ / lối đi', hsk: 'HSK 3' }],
    g: [{ t: 'Quy định hàng không: 随身携带 vs 托运', s: '充电宝必须随身携带，严禁托运', e: 'Pin sạc dự phòng bắt buộc xách tay, cấm ký gửi.' }],
    q: [{ q: 'Nhân viên hỏi kiểm tra đồ vật gì không được để trong hành lý ký gửi?', options: ['Quần áo', 'Sách vở', 'Sạc dự phòng và pin lithium (充电宝/锂电池)', 'Giày dép'], a: 2, exp: 'Nhân viên hỏi: 行李箱里没有充电宝和锂电池吧.' }],
    sp: { hz: '请问可以帮我安排一个靠窗的座位吗？', py: 'Qǐngwèn kěyǐ bāng wǒ ānpái yí gè kàochuāng de zuòwèi ma?', vi: 'Xin hỏi có thể xếp cho tôi một chỗ ngồi cạnh cửa sổ không?' }
  },
  {
    num: 54, top: 6, lvl: 'HSK 3', title: 'Hỏi thông tin chuyến bay', hz: '咨询航班动态与延误', py: 'Zīxún hángbān dòngtài yǔ yánwù',
    sit: 'Quang nghe thấy loa thông báo hoãn chuyến bay nên đến quầy thông tin hỏi rõ nguyên nhân.',
    c: [{ n: 'Hồng Quang', r: 'Hành khách lo lắng', g: 'male', a: '👨' }, { n: 'Đại diện hãng bay', r: 'Nhân viên dịch vụ', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '你好，刚才广播说前往广州的CZ3104航班延误了，请问延误到几点起飞？', py: 'Nǐ hǎo, gāngcái guǎngbō shuō qiánwǎng Guǎngzhōu de CZ3104 hángbān yánwù le, qǐngwèn yánwù dào jǐ diǎn qǐfēi?', vi: 'Chào anh, vừa nãy loa phát thanh báo chuyến bay CZ3104 đi Quảng Châu bị trễ chuyến, xin hỏi trễ đến mấy giờ mới cất cánh?' },
      { s: 'Đại diện hãng bay', g: 'male', hz: '先生您好，由于广州雷雨天气，飞机目前正在排队等待放行，预计推迟两小时。', py: 'Xiānsheng nín hǎo, yóuyú Guǎngzhōu léiyǔ tiānqì, fēijī mùqián zhèngzài páiduì děngdài fàngxíng, yùjì tuīchí liǎng xiǎoshí.', vi: 'Chào anh, do thời tiết mưa dông tại Quảng Châu nên máy bay đang xếp hàng đợi lệnh bay, dự kiến lùi lại 2 tiếng.' },
      { s: 'Hồng Quang', g: 'male', hz: '那登机口有变动吗？我们需要一直在候机大厅等着吗？', py: 'Nà dēngjīkǒu yǒu biàndòng ma? Wǒmen xūyào yìzhí zài hòujī dàtīng děngzhe ma?', vi: 'Vậy cửa lên máy bay (gate) có đổi không? Chúng tôi cần phải đợi ở sảnh chờ suốt sao?' },
      { s: 'Đại diện hãng bay', g: 'male', hz: '登机口依然是28号。我们在旁边准备了免费的矿泉水和盒饭，请您凭登机牌领取。', py: 'Dēngjīkǒu yīrán shì èrshíbā hào. Wǒmen zài pángbiān zhǔnbèi le miǎnfèi de kuàngquánshuǐ hé héfàn, qǐng nín píng dēngjīpái lǐngqǔ.', vi: 'Cửa lên máy bay vẫn là cửa số 28. Phía bên cạnh chúng em có chuẩn bị nước khoáng và cơm hộp miễn phí, mời anh đem thẻ lên tàu đến nhận ạ.' }
    ],
    v: [{ hz: '延误', py: 'yánwù', m: 'hoãn lại, trễ giờ (chuyến bay)', hsk: 'HSK 4' }, { hz: '由于', py: 'yóuyú', m: 'do, bởi vì', hsk: 'HSK 4' }, { hz: '登机口', py: 'dēngjīkǒu', m: 'cửa lên máy bay (gate)', hsk: 'HSK 3' }, { hz: '登机牌', py: 'dēngjīpái', m: 'thẻ lên máy bay (boarding pass)', hsk: 'HSK 3' }],
    g: [{ t: 'Nguyên nhân trang trọng: 由于 (Yóuyú)', s: '由于 + Lý do khách quan (thời tiết, giao thông)', e: '由于天气原因航班延误 (Do thời tiết nên hoãn chuyến bay).' }],
    q: [{ q: 'Nguyên nhân chuyến bay bị trễ giờ (delay) là gì?', options: ['Máy bay hỏng động cơ', 'Mưa dông tại Quảng Châu (雷雨天气)', 'Hành khách đến muộn', 'Thiếu nhiên liệu'], a: 1, exp: 'Nhân viên giải thích: 由于广州雷雨天气.' }],
    sp: { hz: '请问航班由于什么原因延误？几点起飞？', py: 'Qǐngwèn hángbān yóuyú shénme yuányīn yánwù? Jǐ diǎn qǐfēi?', vi: 'Xin hỏi chuyến bay vì lý do gì bị hoãn? Mấy giờ cất cánh?' }
  },
  {
    num: 55, top: 6, lvl: 'HSK 2', title: 'Gọi taxi', hz: '打车与乘出租车', py: 'Dǎchē yǔ chéng chūzūchē',
    sit: 'Minh vẫy taxi bên đường và yêu cầu tài xế bật đồng hồ tính tiền.',
    c: [{ n: 'Văn Minh', r: 'Hành khách', g: 'male', a: '👦' }, { n: 'Tài xế taxi', r: 'Bác tài xế Bắc Kinh', g: 'male', a: '🚖' }],
    d: [
      { s: 'Tài xế taxi', g: 'male', hz: '师傅，去哪儿啊？快上车！', py: 'Shīfu, qù nǎr a? Kuài shàngchē!', vi: 'Người anh em, đi đâu đấy? Mau lên xe!' },
      { s: 'Văn Minh', g: 'male', hz: '师傅您好，去三里屯太古里。请打表走，谢谢。', py: 'Shīfu nín hǎo, qù Sānlǐtún Tàigǔlǐ. Qǐng dǎbiǎo zǒu, xièxie.', vi: 'Bác tài chào bác, đến Taikoo Li Tam Lý Đồn ạ. Bác bật đồng hồ tính cước giúp cháu nhé, cảm ơn bác.' },
      { s: 'Tài xế taxi', g: 'male', hz: '好嘞，计价器已经按下了！现在正赶上下班高峰期，环路上有点堵车。', py: 'Hǎo lei, jìjiàqì yǐjīng àn xià le! Xiànzài zhèng gǎn shang xiàbān gāofēngqī, huánlù shang yǒudiǎnr dǔchē.', vi: 'Có ngay, đồng hồ tính tiền đã bật rồi nhé! Giờ đang đúng đợt cao điểm tan tầm, đường vành đai hơi tắc một chút.' },
      { s: 'Văn Minh', g: 'male', hz: '没关系，我不赶时间。到了路口请在商场南门把我放下就行。', py: 'Méi guānxi, wǒ bù gǎn shíjiān. Dào le lùkǒu qǐng zài shāngchǎng nán mén bǎ wǒ fàng xià jiù xíng.', vi: 'Không sao đâu bác, cháu không vội. Đến ngã ba bác cho cháu xuống ở cổng Nam trung tâm thương mại là được ạ.' }
    ],
    v: [{ hz: '打表', py: 'dǎbiǎo', m: 'bật đồng hồ tính tiền taxi', hsk: 'HSK 3' }, { hz: '计价器', py: 'jìjiàqì', m: 'đồng hồ đo cước taxi', hsk: 'HSK 4' }, { hz: '高峰期', py: 'gāofēngqī', m: 'giờ cao điểm', hsk: 'HSK 4' }, { hz: '堵车', py: 'dǔchē', m: 'tắc đường', hsk: 'HSK 2' }],
    g: [{ t: 'Bắt taxi chuẩn: 请打表 (Qǐng dǎbiǎo)', s: '请打表走，谢谢。', e: 'Câu cần nói khi đi taxi tránh bị nói thách giá.' }],
    q: [{ q: 'Minh dặn tài xế cho xuống ở vị trí nào?', options: ['Cổng Bắc', 'Cổng Nam trung tâm thương mại', 'Ngã tư', 'Trạm xăng'], a: 1, exp: 'Minh dặn: "在商场南门把我放下".' }],
    sp: { hz: '师傅，去北京饭店，请打表走。', py: 'Shīfu, qù Běijīng Fàndiàn, qǐng dǎbiǎo zǒu.', vi: 'Bác tài, đi khách sạn Bắc Kinh, bật đồng hồ giúp cháu nhé.' }
  },
  {
    num: 56, top: 6, lvl: 'HSK 2', title: 'Đi xe buýt', hz: '乘坐公共汽车', py: 'Chéngzuò gōnggòng qìchē',
    sit: 'An và Lan đứng đợi xe buýt và dùng ứng dụng quét mã lên xe.',
    c: [{ n: 'Thúy An', r: 'Người đi xe', g: 'female', a: '👧' }, { n: 'Hương Lan', r: 'Người đi cùng', g: 'female', a: '👩' }],
    d: [
      { s: 'Thúy An', g: 'female', hz: '香兰，去颐和园坐几路公交车能直达？', py: 'Xiānglán, qù Yíhéyuán zuò jǐ lù gōngjiāochē néng zhídá?', vi: 'Hương Lan ơi, đi Di Hòa Viên thì đi xe buýt số mấy là tới thẳng luôn?' },
      { s: 'Hương Lan', g: 'female', hz: '坐332路或者特4路都可以直达，大概坐六站路。你看，车来了！', py: 'Zuò sānsāner lù huòzhě tè-sì lù dōu kěyǐ zhídá, dàgài zuò liù zhàn lù. Nǐ kàn, chē lái le!', vi: 'Đi tuyến 332 hoặc tuyến Đặc 4 đều tới thẳng, tầm 6 trạm. Cậu nhìn kìa, xe đến rồi!' },
      { s: 'Thúy An', g: 'female', hz: '车费是多少钱？可以用手机乘车码吗？', py: 'Chēfèi shì duōshao qián? Kěyǐ yòng shǒujī chéngchēmǎ ma?', vi: 'Tiền vé xe là bao nhiêu? Dùng mã đi xe trên điện thoại được không?' },
      { s: 'Hương Lan', g: 'female', hz: '刷乘车码只要一块钱。上车刷一次，下车记得再刷一次，按里程计费。', py: 'Shuā chéngchēmǎ zhǐ yào yí kuài qián. Shàngchē shuā yí cì, xiàchē jìde zài shuā yí cì, àn lǐchéng jìfèi.', vi: 'Quẹt mã đi xe chỉ mất 1 tệ thôi. Lên xe quẹt một lần, xuống xe nhớ quẹt thêm lần nữa nhé, tính cước theo quãng đường.' }
    ],
    v: [{ hz: '几路车', py: 'jǐ lù chē', m: 'tuyến xe buýt số mấy', hsk: 'HSK 2' }, { hz: '直达', py: 'zhídá', m: 'đi thẳng không cần chuyển tuyến', hsk: 'HSK 3' }, { hz: '乘车码', py: 'chéngchēmǎ', m: 'mã QR đi phương tiện công cộng', hsk: 'HSK 3' }, { hz: '里程', py: 'lǐchéng', m: 'quãng đường, cự ly km', hsk: 'HSK 4' }],
    g: [{ t: 'Quy tắc xe buýt hai cửa Trung Quốc: 上车刷一次，下车刷一次', s: '上车刷码 + 下车刷码', e: 'Bắt buộc quẹt 2 lần để hệ thống trừ đúng tiền theo số trạm.' }],
    q: [{ q: 'Khi đi xe buýt ở Bắc Kinh bằng mã QR, cần quẹt mấy lần?', options: ['Chỉ quẹt lúc lên', 'Chỉ quẹt lúc xuống', 'Lên quẹt 1 lần, xuống quẹt 1 lần (2 lần)', 'Không cần quẹt'], a: 2, exp: 'Lan dặn: "上车刷一次，下车记得再刷一次".' }],
    sp: { hz: '请问去颐和园坐几路公交车？', py: 'Qǐngwèn qù Yíhéyuán zuò jǐ lù gōngjiāochē?', vi: 'Xin hỏi đi Di Hòa Viên thì đi xe buýt số mấy?' }
  },
  {
    num: 57, top: 6, lvl: 'HSK 3', title: 'Mua vé tàu hỏa', hz: '购买高铁与火车票', py: 'Gòumǎi gāotiě yǔ huǒchēpiào',
    sit: 'Tuấn đến phòng vé ga Tây Bắc Kinh mua vé tàu cao tốc đi Tây An.',
    c: [{ n: 'Anh Tuấn', r: 'Hành khách mua vé', g: 'male', a: '👱‍♂️' }, { n: 'Nhân viên bán vé ga', r: 'Giao dịch viên', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '您好！我想买一张明天上午去西安的高铁二等座车票。', py: 'Nín hǎo! Wǒ xiǎng mǎi yì zhāng míngtiān shàngwǔ qù Xī’ān de gāotiě èrděngzuò chēpiào.', vi: 'Chào chị! Tôi muốn mua một vé tàu cao tốc ghế hạng nhì đi Tây An vào sáng mai.' },
      { s: 'Nhân viên bán vé ga', g: 'female', hz: '请出示乘车人的护照原件。上午九点半的G655次列车可以吗？耗时四个半小时。', py: 'Qǐng chūshì chéngchērén de hùzhào yuánjiàn. Shàngwǔ jiǔ diǎn bàn de G655 cì lièchē kěyǐ ma? Hàoshí sì gè bàn xiǎoshí.', vi: 'Xin anh xuất trình bản gốc hộ chiếu của người đi tàu. Chuyến tàu G655 lúc 9 rưỡi sáng được không ạ? Mất 4 tiếng rưỡi di chuyển.' },
      { s: 'Anh Tuấn', g: 'male', hz: '这趟车时间很好！票价是多少？不用取纸质车票了吧？', py: 'Zhè tàng chē shíjiān hěn hǎo! Piàojià shì duōshao? Bú yòng qǔ zhǐzhì chēpiào le ba?', vi: 'Chuyến này giờ đẹp quá! Giá vé là bao nhiêu? Không cần lấy vé giấy nữa đúng không chị?' },
      { s: 'Nhân viên bán vé ga', g: 'female', hz: '票价五百一十五元。现在全面实行电子客票，进站直接走人工通道刷护照即可。', py: 'Piàojià wǔbǎi yīshíwǔ yuán. Xiànzài quánmiàn shíxíng diànzǐ kèpiào, jìnzhàn zhíjiē zǒu réngōng tōngdào shuā hùzhào jíkě.', vi: 'Giá vé là 515 tệ. Hiện nay toàn quốc áp dụng vé điện tử, lúc vào ga anh chỉ cần đi làn thủ công quẹt hộ chiếu là được.' }
    ],
    v: [{ hz: '高铁', py: 'gāotiě', m: 'tàu cao tốc', hsk: 'HSK 3' }, { hz: '二等座', py: 'èrděngzuò', m: 'ghế hạng nhì (phổ thông)', hsk: 'HSK 3' }, { hz: '耗时', py: 'hàoshí', m: 'tiêu tốn thời gian', hsk: 'HSK 4' }, { hz: '电子客票', py: 'diànzǐ kèpiào', m: 'vé điện tử', hsk: 'HSK 4' }],
    g: [{ t: 'Hạng ghế tàu cao tốc: 二等座 / 一等座 / 商务座', s: '二等座 (Ghế hạng 2), 一等座 (Ghế hạng 1), 商务座 (Hạng thương gia)', e: 'Người dân và du khách thường đi nhất là 二等座.' }],
    q: [{ q: 'Thời gian đi tàu cao tốc từ Bắc Kinh đến Tây An mất bao lâu?', options: ['2 tiếng', '3 tiếng', '4 tiếng rưỡi (四个半小时)', '8 tiếng'], a: 2, exp: 'Nhân viên thông báo: 耗时四个半小时.' }],
    sp: { hz: '我想买一张去上海的高铁二等座车票。', py: 'Wǒ xiǎng mǎi yì zhāng qù Shànghǎi de gāotiě èrděngzuò chēpiào.', vi: 'Tôi muốn mua một vé tàu cao tốc ghế hạng nhì đi Thượng Hải.' }
  },
  {
    num: 58, top: 6, lvl: 'HSK 3', title: 'Thuê xe máy hoặc ô tô', hz: '租车出行', py: 'Zūchē chūxíng',
    sit: 'Quang và bạn đến đại lý thuê xe 神州租车 để thuê một chiếc SUV tự lái đi Vân Nam.',
    c: [{ n: 'Hồng Quang', r: 'Người thuê xe', g: 'male', a: '👨' }, { n: 'Đại lý thuê xe', r: 'Nhân viên dịch vụ', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '你好，我们想租一辆SUV自驾去大理和丽江，租期五天。', py: 'Nǐ hǎo, wǒmen xiǎng zū yí liàng SUV zìjià qù Dàlǐ hé Lìjiāng, zūqī wǔ tiān.', vi: 'Chào bạn, chúng tôi muốn thuê một chiếc xe SUV tự lái đi Đại Lý và Lệ Giang, thời hạn thuê 5 ngày.' },
      { s: 'Đại lý thuê xe', g: 'male', hz: '好的。请问驾驶员持有中国驾照吗？租车需要核验身份证件和驾驶执照。', py: 'Hǎo de. Qǐngwèn jiàshǐyuán chíyǒu Zhōngguó jiàzhào ma? Zūchē xūyào héyàn shēnfèn zhèngjiàn hé jiàshǐ zhízhào.', vi: 'Vâng ạ. Xin hỏi người lái xe có bằng lái xe Trung Quốc không? Thuê xe cần xác minh giấy tờ tùy thân và giấy phép lái xe.' },
      { s: 'Hồng Quang', g: 'male', hz: '我有经过官方换领的中国临时驾照。请问租金包含全额保险吗？', py: 'Wǒ yǒu jīngguò guānfāng huànlǐng de Zhōngguó línshí jiàzhào. Qǐngwèn zūjīn bāohán quán’é bǎoxiǎn ma?', vi: 'Tôi có bằng lái xe tạm thời của Trung Quốc đã đổi qua kênh chính thức. Cho hỏi giá thuê có bao gồm bảo hiểm toàn diện không?' },
      { s: 'Đại lý thuê xe', g: 'male', hz: '基础租金含交强险，建议您每天加五十元购买百万尊享险，零免赔额更安心。', py: 'Jīchǔ zūjīn hán jiāoqiángxiǎn, jiànyì nín měitiān jiā wǔshí yuán gòumǎi bǎiwàn zūnxiǎngxǐan, líng miǎnpéié gèng ānxīn.', vi: 'Giá cơ bản có bảo hiểm bắt buộc, em khuyên anh thêm 50 tệ mỗi ngày mua gói bảo hiểm cao cấp triệu tệ, miễn mức khấu trừ sẽ yên tâm hơn.' }
    ],
    v: [{ hz: '自驾', py: 'zìjià', m: 'tự lái xe đi du lịch', hsk: 'HSK 3' }, { hz: '驾照', py: 'jiàzhào', m: 'bằng lái xe', hsk: 'HSK 3' }, { hz: '押金', py: 'yājīn', m: 'tiền đặt cọc', hsk: 'HSK 3' }, { hz: '保险', py: 'bǎoxiǎn', m: 'bảo hiểm', hsk: 'HSK 4' }],
    g: [{ t: 'Lượng từ của xe cộ: 辆 (Liàng)', s: '一辆车 / 一辆SUV / 一辆摩托车', e: 'Không dùng 一个车 mà phải dùng 一辆车.' }],
    q: [{ q: 'Điều kiện bắt buộc để người nước ngoài thuê xe tự lái tại Trung Quốc là gì?', options: ['Chỉ cần hộ chiếu', 'Có bằng lái xe Trung Quốc hợp lệ (中国驾照)', 'Chỉ cần thẻ tín dụng', 'Không cần gì'], a: 1, exp: 'Nhân viên hỏi: 驾驶员持有中国驾照吗.' }],
    sp: { hz: '我们想租一辆车自驾游，请问租金多少？', py: 'Wǒmen xiǎng zū yí liàng chē zìjiàyóu, qǐngwèn zūjīn duōshao?', vi: 'Chúng tôi muốn thuê một chiếc xe đi phượt tự lái, cho hỏi giá thuê bao nhiêu?' }
  },
  {
    num: 59, top: 6, lvl: 'HSK 2', title: 'Tìm đường đến khách sạn', hz: '寻找预订的酒店', py: 'Xúnzhǎo yùdìng de jiǔdiàn',
    sit: 'Minh vừa ra khỏi ga tàu cao tốc, gọi điện hỏi tiếp tân khách sạn cách di chuyển nhanh nhất.',
    c: [{ n: 'Văn Minh', r: 'Khách tìm đường', g: 'male', a: '👦' }, { n: 'Lễ tân khách sạn', r: 'Tiếp tân', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '你好，我是今晚入住的客人阮文明，我现在刚出西安北站，怎么去你们酒店最快？', py: 'Nǐ hǎo, wǒ shì jīnwǎn rùzhù de kèrén Ruǎn Wénmíng, wǒ xiànzài gāng chū Xī’ān Běizhàn, zěnme qù nǐmen jiǔdiàn zuì kuài?', vi: 'Chào bạn, tôi là khách đặt phòng tối nay Nguyễn Văn Minh, tôi vừa ra khỏi ga Tây An Bắc, đi đến khách sạn mình cách nào nhanh nhất?' },
      { s: 'Lễ tân khách sạn', g: 'female', hz: '阮先生您好！最方便快捷的方式是坐地铁2号线，直达钟楼站。', py: 'Ruǎn xiānsheng nín hǎo! Zuì fāngbiàn kuàijié de fāngshì shì zuò dìtiě èr hào xiàn, zhídá Zhōnglóu zhàn.', vi: 'Chào anh Nguyễn! Cách thuận tiện và nhanh nhất là đi tàu điện ngầm tuyến số 2, đến thẳng ga Tháp Chuông (Changling).' },
      { s: 'Văn Minh', g: 'male', hz: '出站后需要走多远？从哪个出口出来？', py: 'Chū zhàn hòu xūyào zǒu duō yuǎn? Cóng nǎge chūkǒu chūlai?', vi: 'Ra khỏi ga cần đi bộ bao xa? Từ cửa ra nào đi lên vậy bạn?' },
      { s: 'Lễ tân khách sạn', g: 'female', hz: '您从C口出来，朝回民街方向步行约一百五十米，就能看到我们酒店大门了。', py: 'Nín cóng C kǒu chūlai, cháo Huímínjiē fāngxiàng bùxíng yuē yìbǎiwǔshí mǐ, jiù néng kàn dào wǒmen jiǔdiàn dàmén le.', vi: 'Anh đi lên từ cửa C, đi bộ theo hướng phố người Hồi tầm 150m là thấy ngay cổng lớn khách sạn chúng em rồi ạ.' }
    ],
    v: [{ hz: '入住', py: 'rùzhù', m: 'nhận phòng, lưu trú', hsk: 'HSK 3' }, { hz: '快捷', py: 'kuàijié', m: 'nhanh chóng và tiện lợi', hsk: 'HSK 4' }, { hz: '出口', py: 'chūkǒu', m: 'cửa ra (ga tàu/sân bay)', hsk: 'HSK 2' }, { hz: '步行', py: 'bùxíng', m: 'đi bộ', hsk: 'HSK 3' }],
    g: [{ t: 'Hướng về một phía: 朝...方向 (Cháo... fāngxiàng)', s: '朝 + Địa danh / Mục tiêu + 方向 + Động từ', e: '朝钟楼方向步行 (Đi bộ theo hướng Tháp Chuông).' }],
    q: [{ q: 'Lễ tân khuyên Minh nên đi phương tiện gì nhanh nhất từ ga về khách sạn?', options: ['Taxi', 'Tàu điện ngầm tuyến 2 (地铁2号线)', 'Xe buýt số 1', 'Đi bộ'], a: 1, exp: 'Lễ tân khuyên: 坐地铁2号线直达钟楼站.' }],
    sp: { hz: '从地铁C口出来，朝前走两百米就到了。', py: 'Cóng dìtiě C kǒu chūlai, cháo qián zǒu liǎngbǎi mǐ jiù dào le.', vi: 'Từ cửa C ga tàu điện ngầm đi ra, đi thẳng 200m là đến.' }
  },
  {
    num: 60, top: 6, lvl: 'HSK 3', title: 'Kể về chuyến du lịch', hz: '分享旅行见闻', py: 'Fēnxiǎng lǚxíng jiànwén',
    sit: 'Mai và Cường ngồi uống trà kể cho nhau nghe về chuyến du lịch Trương Gia Giới vừa rồi.',
    c: [{ n: 'Thanh Mai', r: 'Người du lịch về', g: 'female', a: '👧' }, { n: 'Trương Cường', r: 'Bạn lắng nghe', g: 'male', a: '👨' }],
    d: [
      { s: 'Trương Cường', g: 'male', hz: '青梅，国庆假期去张家界玩得开心吗？风景真有照片那么震撼吗？', py: 'Qīngméi, Guóqìng jiàqī qù Zhāngjiājiè wán de kāixīn ma? Fēngjǐng zhēn yǒu zhàopiàn nàme zhènhàn ma?', vi: 'Thanh Mai, kỳ nghỉ Quốc khánh đi Trương Gia Giới chơi có vui không? Phong cảnh có thật sự chấn động ngoạn mục như trong ảnh không?' },
      { s: 'Thanh Mai', g: 'female', hz: '简直美得令人难以置信！大自然的鬼斧神工，群山像悬浮在云海之中，就像电影《阿凡达》的世界！', py: 'Jiǎnzhí měi de lìng rén nányǐ zhìxìn! Dàzìrán de guǐfǔ-shéngōng, qúnshān xiàng xuánfú zài yúnhǎi zhī zhōng, jiù xiàng diànyǐng “Āfándá” de shìjiè!', vi: 'Quả thực đẹp đến mức khó tin luôn! Bàn tay kỳ diệu của mẹ thiên nhiên, những dãy núi trùng điệp tựa như lơ lửng giữa biển mây, hệt như thế giới phim Avatar!' },
      { s: 'Trương Cường', g: 'male', hz: '哇，听你这么说我心动了！那座著名的玻璃栈道你敢走吗？', py: 'Wā, tīng nǐ zhème shuō wǒ xīndòng le! Nà zuò zhùmíng de bōli zhàndào nǐ gǎn zǒu ma?', vi: 'Oa, nghe cậu kể mà tim mình rung rinh rồi này! Cầu kính nổi tiếng ở đó cậu có dám bước lên đi không?' },
      { s: 'Thanh Mai', g: 'female', hz: '刚踏上去时腿都吓软了，低头就是万丈深渊！但克服恐惧后，拍出的照片棒极了！', py: 'Gāng tà shàngqu shí tuǐ dōu xià ruǎn le, dītóu jiù shì wànzhàng shēnyuān! Dàn kèfú kǒngjù hòu, pāi chū de zhàopiàn bàng jí le!', vi: 'Lúc mới bước lên chân run lẩy bẩy, cúi đầu nhìn xuống là vực sâu vạn trượng! Nhưng sau khi vượt qua nỗi sợ thì ảnh chụp ra đẹp đỉnh chóp luôn!' }
    ],
    v: [{ hz: '难以置信', py: 'nányǐ zhìxìn', m: 'khó lòng tin nổi, kỳ diệu', hsk: 'HSK 5' }, { hz: '鬼斧神工', py: 'guǐfǔ-shéngōng', m: 'bàn tay thần kỳ của tự nhiên đẽo gọt', hsk: 'HSK 5' }, { hz: '心动', py: 'xīndòng', m: 'rung động, xiêu lòng muốn đi', hsk: 'HSK 4' }, { hz: '玻璃栈道', py: 'bōli zhàndào', m: 'cầu kính đi bộ cheo leo vách núi', hsk: 'HSK 4' }],
    g: [{ t: 'Thành ngữ ca ngợi thiên nhiên kỳ vĩ: 鬼斧神工', s: '大自然的鬼斧神工', e: 'Khen ngợi cảnh đẹp tự nhiên tráng lệ, phi thường.' }],
    q: [{ q: 'Cảnh sắc Trương Gia Giới được Mai ví với thế giới trong bộ phim bom tấn nào?', options: ['Người Nhện', 'Avatar (《阿凡达》)', 'Công viên kỷ Jura', 'Titanic'], a: 1, exp: 'Mai so sánh với thế giới phim 《阿凡达》 (Avatar).' }],
    sp: { hz: '这里的风景简直美得令人难以置信！', py: 'Zhèlǐ de fēngjǐng jiǎnzhí měi de lìng rén nányǐ zhìxìn!', vi: 'Phong cảnh ở đây quả thực đẹp đến mức khó tin!' }
  }
];
