// Topic Data: Topics 7 - 9 (Lessons 61 - 90)
module.exports = [
  // ==================== TOPIC 7: KHÁCH SẠN VÀ LƯU TRÚ (61 - 70) ====================
  {
    num: 61, top: 7, lvl: 'HSK 2', title: 'Đặt phòng khách sạn', hz: '预订酒店房间', py: 'Yùdìng jiǔdiàn fángjiān',
    sit: 'Tuấn gọi điện tới khách sạn 4 sao ở Thượng Hải để đặt phòng cho chuyến du lịch.',
    c: [{ n: 'Anh Tuấn', r: 'Khách đặt phòng', g: 'male', a: '👱‍♂️' }, { n: 'Nhân viên đặt phòng', r: 'Tiếp tân', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Nhân viên đặt phòng', g: 'female', hz: '您好，上海锦江饭店预订部，请问有什么可以帮您？', py: 'Nín hǎo, Shànghǎi Jǐnjiāng Fàndiàn yùdìngbù, qǐngwèn yǒu shénme kěyǐ bāng nín?', vi: 'Xin chào, bộ phận đặt phòng khách sạn Cẩm Giang Thượng Hải, xin hỏi có thể giúp gì cho quý khách ạ?' },
      { s: 'Anh Tuấn', g: 'male', hz: '我想订一间下周五入住、周日退房的豪华大床房，住两晚。', py: 'Wǒ xiǎng dìng yì jiān xià zhōuwǔ rùzhù, zhōurì tuìfáng de háohuá dàchuángfáng, zhù liǎng wǎn.', vi: 'Tôi muốn đặt một phòng giường đôi sang trọng (Deluxe King) nhận phòng thứ Sáu tuần sau, trả phòng Chủ Nhật, ở 2 đêm.' },
      { s: 'Nhân viên đặt phòng', g: 'female', hz: '好的，请问需要包含双人自助早餐吗？房费是一晚六百八十元。', py: 'Hǎo de, qǐngwèn xūyào bāohán shuāngrén zìzhù zǎocān ma? Fángfèi shì yì wǎn liùbǎi bāshí yuán.', vi: 'Vâng ạ, xin hỏi quý khách có cần kèm buffet sáng 2 người không ạ? Tiền phòng là 680 tệ một đêm.' },
      { s: 'Anh Tuấn', g: 'male', hz: '包含早餐吧。请尽量帮我安排高楼层、无烟房，最好能看到外滩夜景。', py: 'Bāohán zǎocān ba. Qǐng jǐnliàng bāng wǒ ānpái gāo lóucéng, wúyānfáng, zuìhǎo néng kàn dào Wàitān yèjǐng.', vi: 'Bao gồm bữa sáng nhé. Nhờ chị sắp xếp giúp tầng cao, phòng không hút thuốc, tốt nhất là ngắm được cảnh đêm Bến Thượng Hải.' }
    ],
    v: [{ hz: '大床房', py: 'dàchuángfáng', m: 'phòng một giường lớn (King bed)', hsk: 'HSK 3' }, { hz: '退房', py: 'tuìfáng', m: 'trả phòng (check out)', hsk: 'HSK 3' }, { hz: '无烟房', py: 'wúyānfáng', m: 'phòng không hút thuốc', hsk: 'HSK 3' }, { hz: '夜景', py: 'yèjǐng', m: 'cảnh đêm', hsk: 'HSK 3' }],
    g: [{ t: 'Cố gắng hết sức đáp ứng: 尽量 (Jǐnliàng)', s: '请尽量帮我 + Động từ', e: 'Nhờ vả đối phương ưu tiên sắp xếp nguyện vọng.' }],
    q: [{ q: 'Tuấn yêu cầu loại phòng nào?', options: ['Phòng đơn tiêu chuẩn', 'Phòng giường đôi sang trọng (豪华大床房)', 'Phòng tập thể', 'Phòng gia đình'], a: 1, exp: 'Tuấn đặt: 豪华大床房.' }],
    sp: { hz: '我想订一间豪华大床房，请安排无烟房。', py: 'Wǒ xiǎng dìng yì jiān háohuá dàchuángfáng, qǐng ānpái wúyānfáng.', vi: 'Tôi muốn đặt một phòng giường đôi sang trọng, vui lòng xếp phòng không hút thuốc.' }
  },
  {
    num: 62, top: 7, lvl: 'HSK 2', title: 'Làm thủ tục nhận phòng', hz: '前台办理入住', py: 'Qiántái bànlǐ rùzhù',
    sit: 'Minh đến quầy lễ tân khách sạn để check-in và nhận thẻ phòng.',
    c: [{ n: 'Văn Minh', r: 'Khách nhận phòng', g: 'male', a: '👦' }, { n: 'Lễ tân khách sạn', r: 'Tiếp tân', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Lễ tân khách sạn', g: 'male', hz: '下午好先生，欢迎光临！请问有预订吗？', py: 'Xiàwǔ hǎo xiānsheng, huānyíng guānglín! Qǐngwèn yǒu yùdìng ma?', vi: 'Chào buổi chiều anh, hoan nghênh ghé thăm! Xin hỏi anh có đặt phòng trước chưa ạ?' },
      { s: 'Văn Minh', g: 'male', hz: '你好，我在携程上订了一间大床房，名字叫阮文明。', py: 'Nǐ hǎo, wǒ zài Xiéchéng shang dìng le yì jiān dàchuángfáng, míngzi jiào Ruǎn Wénmíng.', vi: 'Chào bạn, tôi có đặt một phòng giường lớn trên Ctrip, tên là Nguyễn Văn Minh.' },
      { s: 'Lễ tân khách sạn', g: 'male', hz: '查到了，阮先生。请出示您的护照办理登记，另外需要刷五百元住房押金。', py: 'Chá dào le, Ruǎn xiānsheng. Qǐng chūshì nín de hùzhào bànlǐ dēngjì, lìngwài xūyào shuā wǔbǎi yuán zhùfáng yājīn.', vi: 'Tra thấy rồi thưa anh Nguyễn. Xin anh xuất trình hộ chiếu để làm thủ tục đăng ký, ngoài ra cần quẹt 500 tệ tiền đặt cọc phòng ạ.' },
      { s: 'Văn Minh', g: 'male', hz: '没问题，刷微信。请问几点退房？无线网密码是多少？', py: 'Méi wèntí, shuā Wēixìn. Qǐngwèn jǐ diǎn tuìfáng? Wúxiànwǎng mìmǎ shì duōshao?', vi: 'Không sao, quẹt WeChat nhé. Cho hỏi mấy giờ thì phải trả phòng? Mật khẩu wifi là bao nhiêu bạn?' },
      { s: 'Lễ tân khách sạn', g: 'male', hz: '退房时间是中午十二点前。房卡里有Wi-Fi账号，您的房间在808。电梯在右转到底。祝您入住愉快！', py: 'Tuìfáng shíjiān shì zhōngwǔ shí’èr diǎn qián. Fángkǎ lǐ yǒu Wi-Fi zhànghào, nín de fángjiān zài bā líng bā. Diàntī zài yòuzhuǎn dàodǐ. Zhù nín rùzhù yúkuài!', vi: 'Giờ trả phòng là trước 12 giờ trưa ạ. Trong bao thẻ phòng có tài khoản Wi-Fi, phòng của anh ở số 808. Thang máy rẽ phải đi hết đường. Chúc anh lưu trú vui vẻ!' }
    ],
    v: [{ hz: '前台', py: 'qiántái', m: 'quầy lễ tân', hsk: 'HSK 3' }, { hz: '登记', py: 'dēngjì', m: 'đăng ký thông tin', hsk: 'HSK 3' }, { hz: '房卡', py: 'fángkǎ', m: 'thẻ phòng', hsk: 'HSK 3' }, { hz: '祝您入住愉快', py: 'zhù nín rùzhù yúkuài', m: 'Chúc quý khách lưu trú vui vẻ', hsk: 'HSK 3' }],
    g: [{ t: 'Hạn chót hành động: ...前 (Qián)', s: 'Thời gian + 前 (trước thời điểm đó)', e: '十二点前退房 (Trả phòng trước 12 giờ).' }],
    q: [{ q: 'Thời gian trả phòng muộn nhất là mấy giờ?', options: ['10 giờ sáng', '11 giờ sáng', 'Trước 12 giờ trưa (中午十二点前)', '2 giờ chiều'], a: 2, exp: 'Lễ tân trả lời: "退房时间是中午十二点前".' }],
    sp: { hz: '你好，我来办理入住，这是我的护照。', py: 'Nǐ hǎo, wǒ lái bànlǐ rùzhù, zhè shì wǒ de hùzhào.', vi: 'Chào bạn, tôi đến làm thủ tục nhận phòng, đây là hộ chiếu của tôi.' }
  },
  {
    num: 63, top: 7, lvl: 'HSK 2', title: 'Làm thủ tục trả phòng', hz: '前台办理退房', py: 'Qiántái bànlǐ tuìfáng',
    sit: 'Quang xuống sảnh trả thẻ phòng, nhận lại tiền cọc và lấy hóa đơn.',
    c: [{ n: 'Hồng Quang', r: 'Khách trả phòng', g: 'male', a: '👨' }, { n: 'Lễ tân', r: 'Nhân viên thu ngân', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '早！退房，这是808房的两张房卡。', py: 'Zǎo! Tuìfáng, zhè shì bā líng bā fáng de liǎng zhāng fángkǎ.', vi: 'Chào buổi sáng! Tôi trả phòng, đây là 2 thẻ phòng 808.' },
      { s: 'Lễ tân', g: 'female', hz: '早上好先生！请问有消费房间小冰箱里的饮料和零食吗？', py: 'Zǎoshang hǎo xiānsheng! Qǐngwèn yǒu xiāofèi fángjiān xiǎo bīngxiāng lǐ de yǐnliào hé língshí ma?', vi: 'Chào buổi sáng anh! Cho hỏi anh có dùng đồ uống hay đồ ăn vặt trong tủ lạnh mini không ạ?' },
      { s: 'Hồng Quang', g: 'male', hz: '喝了一瓶矿泉水，吃了一包坚果。其余的都没动。', py: 'Hē le yì píng kuàngquánshuǐ, chī le yì bāo jiānguǒ. Qíyú de dōu méi dòng.', vi: 'Tôi có uống 1 chai nước khoáng và ăn 1 gói hạt. Còn lại đều không động vào.' },
      { s: 'Lễ tân', g: 'female', hz: '好的，扣除二十元消费，原路退还您四百八十元押金。发票发到您的邮箱了，欢迎下次光临！', py: 'Hǎo de, kòuchú èrshí yuán xiāofèi, yuánlù tuìhuán nín sìbǎi bāshí yuán yājīn. Fāpiào fā dào nín de yóuxiāng le, huānyíng xià cì guānglín!', vi: 'Vâng ạ, trừ 20 tệ tiền đồ dùng, em hoàn lại 480 tệ tiền cọc theo phương thức ban đầu. Hóa đơn đã gửi vào email anh rồi, hoan nghênh lần sau ghé lại ạ!' }
    ],
    v: [{ hz: '小冰箱', py: 'xiǎo bīngxiāng', m: 'tủ lạnh mini (minibar)', hsk: 'HSK 3' }, { hz: '消费', py: 'xiāofèi', m: 'tiêu dùng, sử dụng', hsk: 'HSK 3' }, { hz: '扣除', py: 'kòuchú', m: 'khấu trừ', hsk: 'HSK 4' }, { hz: '原路退还', py: 'yuánlù tuìhuán', m: 'hoàn tiền theo tài khoản gốc', hsk: 'HSK 4' }],
    g: [{ t: 'Hành động trả phòng ngắn gọn: 退房', s: '你好，我退房。', e: 'Câu cửa miệng cực kỳ phổ biến khi trả phòng khách sạn.' }],
    q: [{ q: 'Hồng Quang đã sử dụng những gì trong tủ lạnh mini?', options: ['Bia và xúc xích', 'Một chai nước khoáng và gói hạt', 'Không dùng gì', 'Hai lon nước ngọt'], a: 1, exp: 'Quang nói: "喝了一瓶矿泉水，吃了一包坚果".' }],
    sp: { hz: '你好，我退房，押金原路退回吗？', py: 'Nǐ hǎo, wǒ tuìfáng, yājīn yuánlù tuìhuí ma?', vi: 'Chào bạn, tôi trả phòng, tiền cọc hoàn về đường cũ đúng không?' }
  },
  {
    num: 64, top: 7, lvl: 'HSK 2', title: 'Yêu cầu thêm khăn tắm', hz: '向客房部索取毛巾', py: 'Xiàng kèfángbù suǒqǔ máojīn',
    sit: 'Mai gọi điện cho bộ phận buồng phòng xin thêm khăn tắm và dép lê.',
    c: [{ n: 'Thanh Mai', r: 'Khách lưu trú', g: 'female', a: '👧' }, { n: 'Bộ phận buồng phòng', r: 'Nhân viên khách sạn', g: 'female', a: '👩' }],
    d: [
      { s: 'Thanh Mai', g: 'female', hz: '您好，客房服务吗？我是1206房的客人。', py: 'Nín hǎo, kèfáng fúwù ma? Wǒ shì yāo èr líng liù fáng de kèrén.', vi: 'Xin chào, dịch vụ buồng phòng phải không ạ? Tôi là khách phòng 1206.' },
      { s: 'Bộ phận buồng phòng', g: 'female', hz: '您好女士，请问有什么可以为您服务？', py: 'Nín hǎo nǚshì, qǐngwèn yǒu shénme kěyǐ wèi nín fúwù?', vi: 'Chào chị, xin hỏi em có thể phục vụ gì cho chị ạ?' },
      { s: 'Thanh Mai', g: 'female', hz: '请问能多送两条干净的大浴巾和两双一次性拖鞋过来吗？', py: 'Qǐngwèn néng duō sòng liǎng tiáo gānjìng de dà yùjīn hé liǎng shuāng yícìxìng tuōxié guòlai ma?', vi: 'Xin hỏi có thể mang thêm 2 chiếc khăn tắm lớn sạch sẽ và 2 đôi dép lê dùng 1 lần lên giúp tôi được không?' },
      { s: 'Bộ phận buồng phòng', g: 'female', hz: '好的女士，我们马上为您安排，服务员五分钟内给您送到房间。', py: 'Hǎo de nǚshì, wǒmen mǎshàng wèi nín ānpái, fúwùyuán wǔ fēnzhōng nèi gěi nín sòng dào fángjiān.', vi: 'Vâng thưa chị, chúng em sẽ sắp xếp ngay, nhân viên sẽ mang tới phòng cho chị trong vòng 5 phút ạ.' }
    ],
    v: [{ hz: '客房服务', py: 'kèfáng fúwù', m: 'dịch vụ phòng (room service/housekeeping)', hsk: 'HSK 3' }, { hz: '浴巾', py: 'yùjīn', m: 'khăn tắm lớn', hsk: 'HSK 3' }, { hz: '一次性拖鞋', py: 'yícìxìng tuōxié', m: 'dép lê dùng một lần', hsk: 'HSK 3' }, { hz: '送到', py: 'sòng dào', m: 'giao đến, mang đến', hsk: 'HSK 3' }],
    g: [{ t: 'Lượng từ của khăn và dép: 条 (tiáo) & 双 (shuāng)', s: '两条毛巾 / 两双拖鞋', e: 'Khăn dùng lượng từ 条, dép dùng lượng từ 双.' }],
    q: [{ q: 'Nhân viên buồng phòng hứa mang đồ lên trong thời gian bao lâu?', options: ['Ngay lập tức', 'Trong 5 phút (五分钟内)', '15 phút', 'Nửa tiếng'], a: 1, exp: 'Nhân viên hứa: 五分钟内送到.' }],
    sp: { hz: '请帮我送两条大浴巾到房间，谢谢。', py: 'Qǐng bāng wǒ sòng liǎng tiáo dà yùjīn dào fángjiān, xièxie.', vi: 'Làm phiền mang giúp tôi 2 chiếc khăn tắm lớn lên phòng, cảm ơn.' }
  },
  {
    num: 65, top: 7, lvl: 'HSK 2', title: 'Báo sự cố trong phòng', hz: '报修房间设施故障', py: 'Bàoxiū fángjiān shèshī gùzhàng',
    sit: 'Tuấn phát hiện điều hòa phòng không mát và vòi hoa sen bị rỉ nước nên báo lễ tân.',
    c: [{ n: 'Anh Tuấn', r: 'Khách báo hỏng', g: 'male', a: '👱‍♂️' }, { n: 'Tiếp tân', r: 'Lễ tân trực', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '前台吗？我是504房的客人。我房间的空调好像出故障了，开了一个小时还是吹热风。', py: 'Qiántái ma? Wǒ shì wǔ líng sì fáng de kèrén. Wǒ fángjiān de kōngtiáo hǎoxiàng chū gùzhàng le, kāi le yí gè xiǎoshí háishi chuī rèfēng.', vi: 'Lễ tân phải không ạ? Tôi là khách phòng 504. Điều hòa phòng tôi hình như bị hỏng rồi, bật một tiếng rồi mà vẫn phả ra gió nóng.' },
      { s: 'Tiếp tân', g: 'male', hz: '非常抱歉先生，给您带来不便！您试着调低温度了吗？', py: 'Fēicháng bàoqiàn xiānsheng, gěi nín dài lái búbiàn! Nín shìzhe tiáodī wēndù le ma?', vi: 'Rất xin lỗi anh vì sự bất tiện này! Anh đã thử hạ thấp nhiệt độ xuống chưa ạ?' },
      { s: 'Anh Tuấn', g: 'male', hz: '已经调到18度了还是不行。另外浴室的花洒开关也在不停滴水。', py: 'Yǐjīng tiáo dào shí’bā dù le háishi bù xíng. Lìngwài yùshì de huāsǎ kāiguān yě zài bùtíng dīshuǐ.', vi: 'Tôi chỉnh xuống 18 độ rồi mà vẫn không được. Ngoài ra vòi hoa sen trong nhà tắm cũng đang nhỏ nước liên tục.' },
      { s: 'Tiếp tân', g: 'male', hz: '明白了，我马上派工程部师傅上去检修。如果无法立即修复，我们为您免费更换房间！', py: 'Míngbai le, wǒ mǎshàng pài gōngchéngbù shīfu shàngqu jiǎnxiū. Rúguǒ wúfǎ lìjí xiūfù, wǒmen wèi nín miǎnfèi gēnghuàn fángjiān!', vi: 'Em hiểu rồi, em sẽ cử thợ kỹ thuật lên kiểm tra sửa chữa ngay. Nếu không khắc phục được liền, bên em sẽ đổi phòng miễn phí cho anh ạ!' }
    ],
    v: [{ hz: '故障', py: 'gùzhàng', m: 'sự cố, hỏng hóc', hsk: 'HSK 4' }, { hz: '花洒', py: 'huāsǎ', m: 'vòi hoa sen tắm', hsk: 'HSK 4' }, { hz: '检修', py: 'jiǎnxiū', m: 'kiểm tra sửa chữa', hsk: 'HSK 4' }, { hz: '更换', py: 'gēnghuàn', m: 'thay đổi, đổi mới', hsk: 'HSK 4' }],
    g: [{ t: 'Diễn đạt đồ vật bị trục trặc: 出故障 (Chū gùzhàng)', s: 'Thiết bị + 出故障了', e: '空调出故障了 (Điều hòa bị hỏng rồi).' }],
    q: [{ q: 'Những thiết bị nào trong phòng 504 bị gặp sự cố?', options: ['Tivi và tủ lạnh', 'Điều hòa và vòi hoa sen (空调和花洒)', 'Bóng đèn và cửa sổ', 'Bồn cầu'], a: 1, exp: 'Tuấn báo hỏng điều hòa (空调) và vòi sen (花洒).' }],
    sp: { hz: '房间里的空调坏了，请派人来看一下。', py: 'Fángjiān lǐ de kōngtiáo huài le, qǐng pài rén lái kàn yíxià.', vi: 'Điều hòa trong phòng hỏng rồi, phiền cử người lên xem giúp.' }
  },
  {
    num: 66, top: 7, lvl: 'HSK 2', title: 'Hỏi giờ ăn sáng', hz: '询问早餐时间与地点', py: 'Xúnwèn zǎocān shíjiān yǔ dìdiǎn',
    sit: 'Minh hỏi tiếp tân về địa điểm và khung giờ phục vụ bữa sáng buffet của khách sạn.',
    c: [{ n: 'Văn Minh', r: 'Khách lưu trú', g: 'male', a: '👦' }, { n: 'Tiếp tân', r: 'Lễ tân khách sạn', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '你好，请问酒店的自助早餐是在几楼？几点开始供应？', py: 'Nǐ hǎo, qǐngwèn jiǔdiàn de zìzhù zǎocān shì zài jǐ lóu? Jǐ diǎn kāishǐ gōngyìng?', vi: 'Chào chị, xin hỏi buffet sáng của khách sạn ở tầng mấy? Mấy giờ bắt đầu phục vụ vậy chị?' },
      { s: 'Tiếp tân', g: 'female', hz: '先生您好，自助餐厅在二楼西餐厅，早餐供应时间是每天早上六点半到十点。', py: 'Xiānsheng nín hǎo, zìzhù cāntīng zài èr lóu xīcāntīng, zǎocān gōngyìng shíjiān shì měitiān zǎoshang liù diǎn bàn dào shí diǎn.', vi: 'Chào anh, nhà hàng buffet ở tầng 2 phía nhà hàng Tây, giờ phục vụ bữa sáng từ 6 rưỡi sáng đến 10 giờ hàng ngày.' },
      { s: 'Văn Minh', g: 'male', hz: '用餐需要带餐券吗？还是直接报房号？', py: 'Yòngcān xūyào dài cānquàn ma? Háishi zhíjiē bào fánghào?', vi: 'Dùng bữa có cần mang phiếu ăn sáng không chị? Hay là báo thẳng số phòng?' },
      { s: 'Tiếp tân', g: 'female', hz: '不需要餐券，在餐厅门口向服务员报房号或者刷房卡就可以进入了。祝您用餐愉快！', py: 'Bù xūyào cānquàn, zài cāntīng ménkǒu xiàng fúwùyuán bào fánghào huòzhě shuā fángkǎ jiù kěyǐ jìnrù le. Zhù nín yòngcān yúkuài!', vi: 'Không cần phiếu ăn ạ, anh đến cửa nhà hàng báo số phòng hoặc quẹt thẻ phòng với nhân viên là vào được. Chúc anh ngon miệng!' }
    ],
    v: [{ hz: '供应', py: 'gōngyìng', m: 'cung cấp, phục vụ', hsk: 'HSK 4' }, { hz: '餐券', py: 'cānquàn', m: 'phiếu ăn, voucher', hsk: 'HSK 3' }, { hz: '房号', py: 'fánghào', m: 'số phòng', hsk: 'HSK 3' }, { hz: '祝您用餐愉快', py: 'zhù nín yòngcān yúkuài', m: 'chúc quý khách dùng bữa ngon miệng', hsk: 'HSK 3' }],
    g: [{ t: 'Khung giờ từ mấy giờ đến mấy giờ: Từ... Đến...', s: '从 + Giờ bắt đầu + 到 + Giờ kết thúc', e: '六点半到十点 (Từ 6 rưỡi đến 10 giờ).' }],
    q: [{ q: 'Khách đến ăn sáng cần làm gì ở cửa nhà hàng?', options: ['Trả tiền mặt', 'Báo số phòng hoặc quẹt thẻ phòng (报房号/刷房卡)', 'Xuất trình hộ chiếu', 'Đợi bốc số'], a: 1, exp: 'Lễ tân nói: 报房号或者刷房卡就可以进入.' }],
    sp: { hz: '请问早餐几点开始？在二楼西餐厅吗？', py: 'Qǐngwèn zǎocān jǐ diǎn kāishǐ? Zài èr lóu xīcāntīng ma?', vi: 'Xin hỏi bữa sáng mấy giờ bắt đầu? Ở nhà hàng Tây tầng 2 phải không?' }
  },
  {
    num: 67, top: 7, lvl: 'HSK 3', title: 'Yêu cầu dịch vụ phòng', hz: '点选客房送餐服务', py: 'Diǎnxuǎn kèfáng sòngcān fúwù',
    sit: 'Quang tăng ca đêm muộn trong phòng khách sạn, gọi điện đặt bữa khuya giao tận phòng.',
    c: [{ n: 'Hồng Quang', r: 'Khách gọi món', g: 'male', a: '👨' }, { n: 'Room Service', r: 'Nhân viên trực', g: 'female', a: '👩‍🍳' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '客房送餐部吗？请问现在还可以点夜宵吗？', py: 'Kèfáng sòngcānbù ma? Qǐngwèn xiànzài hái kěyǐ diǎn yèxiāo ma?', vi: 'Bộ phận phục vụ ăn uống tại phòng phải không? Xin hỏi bây giờ còn gọi món ăn đêm được không?' },
      { s: 'Room Service', g: 'female', hz: '先生晚上好，我们的客房送餐提供二十四小时全天候服务。请问您需要什么？', py: 'Xiānsheng wǎnshang hǎo, wǒmen de kèfáng sòngcān tígōng èrshísì xiǎoshí quántiānhòu fúwù. Qǐngwèn nín xūyào shénme?', vi: 'Chào anh buổi tối, dịch vụ ăn uống tại phòng của chúng em phục vụ 24/24 suốt ngày đêm ạ. Xin hỏi anh cần dùng món gì ạ?' },
      { s: 'Hồng Quang', g: 'male', hz: '请帮我送一份皮蛋瘦肉粥、一笼鲜肉小笼包和一杯热牛奶到1502房。', py: 'Qǐng bāng wǒ sòng yí fèn pídàn shòuròuzhōu, yì lóng xiānròu xiǎolóngbāo hé yì bēi rè niúnǎi dào yāowǔlíng’èr fáng.', vi: 'Cho tôi một phần cháo thịt nạc trứng bắc thảo, một xửng bánh bao xíu mại thịt tươi và một ly sữa nóng đến phòng 1502 nhé.' },
      { s: 'Room Service', g: 'female', hz: '好的先生，总共九十八元，包含15%的服务费，账单将计入您的房账，预计二十分钟内送到。', py: 'Hǎo de xiānsheng, zǒnggòng jiǔshíbā yuán, bāohán bǎifēnzhī shíwǔ de fúwùfèi, zhàngdān jiāng jìrù nín de fángzhàng, yùjì èrshí fēnzhōng nèi sòng dào.', vi: 'Vâng ạ, tổng cộng 98 tệ đã bao gồm 15% phí dịch vụ, hóa đơn sẽ ghi vào tài khoản phòng anh, dự kiến trong 20 phút sẽ mang lên tới nơi ạ.' }
    ],
    v: [{ hz: '夜宵', py: 'yèxiāo', m: 'bữa ăn đêm', hsk: 'HSK 3' }, { hz: '全天候', py: 'quántiānhòu', m: 'suốt 24/7, mọi thời gian', hsk: 'HSK 5' }, { hz: '小笼包', py: 'xiǎolóngbāo', m: 'tiểu long bao (bánh bao nước)', hsk: 'HSK 3' }, { hz: '房账', py: 'fángzhàng', m: 'tiền phòng tính gộp', hsk: 'HSK 4' }],
    g: [{ t: 'Lượng từ của xửng hấp: 笼 (Lóng)', s: '一笼小笼包 / 一笼包子', e: 'Dùng "笼" chỉ các món đựng trong xửng tre hấp.' }],
    q: [{ q: 'Dịch vụ ăn uống tại phòng (Room Service) hoạt động trong khung giờ nào?', options: ['Chỉ buổi sáng', 'Chỉ buổi tối', '24/24 giờ (二十四小时全天候)', 'Đến 10 giờ đêm'], a: 2, exp: 'Nhân viên nói: 提供二十四小时全天候服务.' }],
    sp: { hz: '请帮我送一份皮蛋瘦肉粥到房间，谢谢。', py: 'Qǐng bāng wǒ sòng yí fèn pídàn shòuròuzhōu dào fángjiān, xièxie.', vi: 'Làm phiền mang giúp tôi một phần cháo trứng bắc thảo lên phòng, cảm ơn.' }
  },
  {
    num: 68, top: 7, lvl: 'HSK 3', title: 'Phàn nàn về chất lượng phòng', hz: '投诉客房卫生与噪音', py: 'Tóusù kèfáng wèishēng yǔ zàoyīn',
    sit: 'An gọi lễ tân phàn nàn vì phòng bên cạnh bật nhạc quá ồn và ga giường chưa thay sạch.',
    c: [{ n: 'Thúy An', r: 'Khách hàng', g: 'female', a: '👧' }, { n: 'Đại sảnh lễ tân', r: 'Quản lý trực sảnh', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Thúy An', g: 'female', hz: '前台吗？隔壁房间到现在还在大声放音乐，已经夜里一点了，吵得我根本无法入睡！', py: 'Qiántái ma? Gébì fángjiān dào xiànzài hái zài dàshēng fàng yīnyuè, yǐjīng yèlǐ yì diǎn le, chǎo de wǒ gēnběn wúfǎ rùshuì!', vi: 'Lễ tân phải không ạ? Phòng bên cạnh đến giờ vẫn bật nhạc ầm ĩ, đã 1 giờ đêm rồi, ồn đến mức tôi không tài nào ngủ nổi!' },
      { s: 'Đại sảnh lễ tân', g: 'female', hz: '非常抱歉安女士！我马上派安保人员上去提醒隔壁客人保持安静，绝不耽误您休息。', py: 'Fēicháng bàoqiàn Ān nǚshì! Wǒ mǎshàng pài ānbǎo rényuán shàngqu tíxǐng gébì kèrén bǎochí ānjìng, juébù dānwù nín xiūxi.', vi: 'Rất xin lỗi chị An! Em sẽ cử bảo vệ lên nhắc nhở phòng bên cạnh giữ trật tự ngay, tuyệt đối không làm lỡ giấc ngủ của chị.' },
      { s: 'Thúy An', g: 'female', hz: '还有，我刚才发现床单上有污渍，枕套也有一股异味，卫生质量令人失望！', py: 'Hái yǒu, wǒ gāngcái fāxiàn chuángdān shang yǒu wūzì, zhěntào yě yǒu yì gǔ yìwèi, wèishēng zhìliàng lìng rén shīwàng!', vi: 'Thêm nữa, vừa nãy tôi phát hiện trên ga giường có vết bẩn, vỏ gối còn có mùi lạ, vệ sinh phòng khiến người ta thất vọng quá!' },
      { s: 'Đại sảnh lễ tân', g: 'female', hz: '这确实是我们的严重失误。我马上亲自带房卡上来，为您免费升级到行政楼层的安静套房！', py: 'Zhè quèshí shì wǒmen de yánzhòng shīwù. Wǒ mǎshàng qīnzì dài fángkǎ shànglai, wèi nín miǎnfèi shēngjí dào xíngzhèng lóucéng de ānjìng tàofáng!', vi: 'Đây quả thực là sơ suất nghiêm trọng của bên em. Em sẽ thân chinh mang thẻ phòng lên nâng hạng miễn phí cho chị lên phòng Suite yên tĩnh ở tầng thương gia ngay ạ!' }
    ],
    v: [{ hz: '噪音', py: 'zàoyīn', m: 'tiếng ồn', hsk: 'HSK 4' }, { hz: '入睡', py: 'rùshuì', m: 'chìm vào giấc ngủ', hsk: 'HSK 4' }, { hz: '污渍', py: 'wūzì', m: 'vết bẩn', hsk: 'HSK 4' }, { hz: '升级', py: 'shēngjí', m: 'nâng cấp, nâng hạng phòng', hsk: 'HSK 4' }],
    g: [{ t: 'Bổ ngữ mức độ: 吵得根本无法入睡', s: 'Tính từ + 得 + 根本无法 + Động từ', e: 'Ồn đến mức hoàn toàn không thể ngủ được.' }],
    q: [{ q: 'Quản lý đã giải quyết thỏa đáng phàn nàn của khách bằng cách nào?', options: ['Bảo khách tự chịu đựng', 'Nâng hạng miễn phí lên phòng Suite tầng thương gia (免费升级套房)', 'Đuổi khách đi', 'Không làm gì'], a: 1, exp: 'Quản lý nâng hạng miễn phí lên 行政楼层的安静套房.' }],
    sp: { hz: '隔壁太吵了，吵得我无法入睡。', py: 'Gébì tài chǎo le, chǎo de wǒ wúfǎ rùshuì.', vi: 'Phòng bên cạnh ồn quá, ồn đến mức tôi không ngủ được.' }
  },
  {
    num: 69, top: 7, lvl: 'HSK 2', title: 'Hỏi về tiện nghi khách sạn', hz: '咨询酒店配套设施', py: 'Zīxún jiǔdiàn pèitào shèshī',
    sit: 'Tuấn hỏi tiếp tân về các tiện ích như hồ bơi, phòng gym và dịch vụ giặt ủi.',
    c: [{ n: 'Anh Tuấn', r: 'Khách lưu trú', g: 'male', a: '👱‍♂️' }, { n: 'Nhân viên sảnh', r: 'Tiếp tân', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '你好，请问酒店里有健身房和游泳池吗？住客免费使用吗？', py: 'Nǐ hǎo, qǐngwèn jiǔdiàn lǐ yǒu jiànshēnfáng hé yóuyǒngchí ma? Zhùkè miǎnfèi shǐyòng ma?', vi: 'Chào bạn, xin hỏi trong khách sạn có phòng gym và hồ bơi không? Khách lưu trú có được dùng miễn phí không?' },
      { s: 'Nhân viên sảnh', g: 'female', hz: '有的，健身中心和恒温室内泳池都在五楼，对所有住店客人免费开放。', py: 'Yǒu de, jiànshēn zhōngxīn hé héngwēn shìnèi yǒngchí dōu zài wǔ lóu, duì suǒyǒu zhùdiàn kèrén miǎnfèi kāifàng.', vi: 'Có chứ ạ, trung tâm thể hình và bể bơi nước ấm bốn mùa trong nhà đều ở tầng 5, mở cửa miễn phí cho toàn bộ khách ở khách sạn.' },
      { s: 'Anh Tuấn', g: 'male', hz: '开放时间到几点？游泳需要戴泳帽吗？', py: 'Kāifàng shíjiān dào jǐ diǎn? Yóuyǒng xūyào dài yǒngmào ma?', vi: 'Thời gian mở cửa đến mấy giờ? Đi bơi có cần đội mũ bơi không?' },
      { s: 'Nhân viên sảnh', g: 'female', hz: '每天早上六点到晚上十点半。泳池规定必须佩戴泳帽，五楼前台也提供选购。', py: 'Měitiān zǎoshang liù diǎn dào wǎnshang shí diǎn bàn. Yǒngchí guīdìng bìxū pèidài yǒngmào, wǔ lóu qiántái yě tígōng xuǎngòu.', vi: 'Mỗi ngày từ 6 giờ sáng đến 10 rưỡi tối ạ. Quy định bể bơi bắt buộc phải đội mũ bơi, quầy lễ tân tầng 5 cũng có bán sẵn ạ.' }
    ],
    v: [{ hz: '健身房', py: 'jiànshēnfáng', m: 'phòng tập thể hình (gym)', hsk: 'HSK 3' }, { hz: '恒温泳池', py: 'héngwēn yǒngchí', m: 'hồ bơi giữ nhiệt nước ấm', hsk: 'HSK 4' }, { hz: '泳帽', py: 'yǒngmào', m: 'nón bơi, mũ bơi', hsk: 'HSK 3' }, { hz: '佩戴', py: 'pèidài', m: 'đeo, mang trên người', hsk: 'HSK 4' }],
    g: [{ t: 'Đối tượng được áp dụng: 对...免费开放', s: '对 + Đối tượng + 免费开放', e: 'Bể bơi mở cửa miễn phí cho khách lưu trú.' }],
    q: [{ q: 'Bể bơi và phòng gym khách sạn nằm ở tầng mấy?', options: ['Tầng 1', 'Tầng 3', 'Tầng 5 (五楼)', 'Tầng thượng'], a: 2, exp: 'Nhân viên nói: 都在五楼.' }],
    sp: { hz: '请问酒店的健身房和泳池在几楼？', py: 'Qǐngwèn jiǔdiàn de jiànshēnfáng hé yǒngchí zài jǐ lóu?', vi: 'Xin hỏi phòng gym và hồ bơi của khách sạn ở tầng mấy?' }
  },
  {
    num: 70, top: 7, lvl: 'HSK 3', title: 'Gia hạn thời gian lưu trú', hz: '办理续住手续', py: 'Bànlǐ xùzhù shǒuxù',
    sit: 'Minh có thêm công việc đột xuất nên xuống quầy lễ tân xin ở thêm hai đêm.',
    c: [{ n: 'Văn Minh', r: 'Khách gia hạn', g: 'male', a: '👦' }, { n: 'Lễ tân khách sạn', r: 'Nhân viên', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '你好，我是603房的客人。我原定今天中午退房，但事情还没办完，想续住两晚。', py: 'Nǐ hǎo, wǒ shì liù líng sān fáng de kèrén. Wǒ yuándìng jīntiān zhōngwǔ tuìfáng, dàn shìqing hái méi bàn wán, xiǎng xùzhù liǎng wǎn.', vi: 'Chào bạn, tôi là khách phòng 603. Ban đầu tôi định trưa nay trả phòng, nhưng công việc chưa xong, muốn gia hạn ở thêm 2 đêm.' },
      { s: 'Lễ tân khách sạn', g: 'male', hz: '好的阮先生，我查一下房态。您很幸运，您目前住的这间房今明两天刚好没有其他客人预订。', py: 'Hǎo de Ruǎn xiānsheng, wǒ chá yíxià fángtài. Nín hěn xìngyùn, nín mùqián zhù de zhè jiān fáng jīnmíng liǎng tiān gānghǎo méiyǒu qítā kèrén yùdìng.', vi: 'Vâng thưa anh Nguyễn, em kiểm tra tình trạng phòng một chút. Anh rất may mắn, căn phòng anh đang ở trong 2 ngày tới vừa vặn chưa có khách khác đặt.' },
      { s: 'Văn Minh', g: 'male', hz: '太好了，省得我收拾行李换房间了！续住的价格还是按原来的优惠价算吗？', py: 'Tài hǎo le, shěngde wǒ shōushi xíngli huàn fángjiān le! Xùzhù de jiàgé háishi àn yuánlái de yōuhuìjià suàn ma?', vi: 'Tuyệt quá, đỡ cho tôi phải thu dọn hành lý chuyển phòng! Giá ở thêm vẫn tính theo giá ưu đãi ban đầu chứ bạn?' },
      { s: 'Lễ tân khách sạn', g: 'male', hz: '是的，享受老顾客原价。请把房卡给我重新刷一下芯片，更新退房日期到周三中午。', py: 'Shì de, xiǎngshòu lǎo gùkè yuánjià. Qǐng bǎ fángkǎ gěi wǒ chóngxīn shuā yíxià xīnpìan, gēngxīn tuìfáng rìqī dào zhōusān zhōngwǔ.', vi: 'Vâng ạ, vẫn áp dụng giá gốc tri ân khách quen. Anh đưa thẻ phòng em quét lại chip để cập nhật ngày trả phòng sang trưa thứ Tư nhé.' }
    ],
    v: [{ hz: '续住', py: 'xùzhù', m: 'gia hạn ở thêm', hsk: 'HSK 3' }, { hz: '房态', py: 'fángtài', m: 'tình trạng phòng trống', hsk: 'HSK 4' }, { hz: '省得', py: 'shěngde', m: 'đỡ mất công, đỡ phải', hsk: 'HSK 4' }, { hz: '芯片', py: 'xīnpìan', m: 'con chip từ thẻ phòng', hsk: 'HSK 4' }],
    g: [{ t: 'Đỡ phải làm việc phiền phức: 省得 (Shěngde)', s: 'Sự việc thuận lợi + 省得 + Hành động phiền toái', e: '不用换房间，省得收拾行李 (Khỏi đổi phòng, đỡ phải dọn hành lý).' }],
    q: [{ q: 'Minh có cần phải thu dọn hành lý chuyển sang phòng khác khi gia hạn không?', options: ['Có, phải chuyển ngay', 'Không, vì phòng cũ vẫn trống (不用换房)', 'Phải trả phòng ra ngoài', 'Không rõ'], a: 1, exp: 'Lễ tân báo phòng cũ vẫn trống nên Minh ở tiếp phòng cũ.' }],
    sp: { hz: '我想续住两晚，请问不用换房间吧？', py: 'Wǒ xiǎng xùzhù liǎng wǎn, qǐngwèn bú yòng huàn fángjiān ba?', vi: 'Tôi muốn ở thêm hai đêm, cho hỏi không cần đổi phòng chứ?' }
  },

  // ==================== TOPIC 8: HỌC TẬP VÀ TRƯỜNG HỌC (71 - 80) ====================
  {
    num: 71, top: 8, lvl: 'HSK 3', title: 'Giới thiệu về trường học', hz: '介绍大学校园', py: 'Jièshào dàxué xiàoyuán',
    sit: 'Lý Hoa dẫn tân sinh viên Minh đi dạo tham quan khuôn viên Đại học Bắc Kinh.',
    c: [{ n: 'Lý Hoa', r: 'Đàn chị hướng dẫn', g: 'female', a: '👩‍🎓' }, { n: 'Văn Minh', r: 'Tân sinh viên', g: 'male', a: '👦' }],
    d: [
      { s: 'Lý Hoa', g: 'female', hz: '阿明，欢迎来到我们学校！我们学校建校有一百二十多年历史了。', py: 'Ā Míng, huānyíng lái dào wǒmen xuéxiào! Wǒmen xuéxiào jiànxiào yǒu yìbǎi èrshí duō nián lìshǐ le.', vi: 'A Minh, chào mừng em đến với trường đại học của chúng ta! Trường mình thành lập có lịch sử hơn 120 năm rồi đó.' },
      { s: 'Văn Minh', g: 'male', hz: '校园环境真优美！眼前这个人工湖就是著名的“未名湖”吧？', py: 'Xiàoyuán huánjìng zhēn yōuměi! Yǎnqián zhège réngōnghú jiù shì zhùmíng de “Wèimíng Hú” ba?', vi: 'Môi trường khuôn viên trường đẹp quá! Hồ nhân tạo trước mắt chính là hồ Vị Danh nổi tiếng phải không chị?' },
      { s: 'Lý Hoa', g: 'female', hz: '对！湖边那座古朴的塔叫博雅塔，“一塔湖图”是我们学校最标志性的景观。', py: 'Duì! Húbiān nà zuò gǔpǔ de tǎ jiào Bóyǎ Tǎ, “yī tǎ hú tú” shì wǒmen xuéxiào zuì biāozhìxìng de jǐngguān.', vi: 'Đúng rồi! Tòa tháp cổ kính bên hồ gọi là Tháp Bác Nhã, "nhất tháp hồ đồ" là cảnh quan biểu tượng nhất của trường mình.' },
      { s: 'Văn Minh', g: 'male', hz: '能在这里求学真是太荣幸了！图书馆藏书量也很大吧？', py: 'Néng zài zhèlǐ qiúxué zhēn shì tài róngxìng le! Túshūguǎn cángshūliàng yě hěn dà ba?', vi: 'Được theo học ở đây thật là vinh dự quá! Lượng sách lưu trữ ở thư viện cũng rất lớn chị nhỉ?' }
    ],
    v: [{ hz: '校园', py: 'xiàoyuán', m: 'khuôn viên trường học', hsk: 'HSK 3' }, { hz: '古朴', py: 'gǔpǔ', m: 'cổ kính mộc mạc', hsk: 'HSK 5' }, { hz: '景观', py: 'jǐngguān', m: 'cảnh quan, thắng cảnh', hsk: 'HSK 4' }, { hz: '求学', py: 'qiúxué', m: 'học tập, cầu học', hsk: 'HSK 4' }],
    g: [{ t: 'Lịch sử thành lập: 建校有...历史', s: '建校有 + [Số năm] + 历史', e: 'Trường thành lập có lịch sử hơn 100 năm.' }],
    q: [{ q: 'Cảnh quan biểu tượng nổi tiếng nhất của ngôi trường được nhắc đến là gì?', options: ['Vườn hoa hồng', 'Nhất tháp hồ đồ (Tháp Bác Nhã và Hồ Vị Danh)', 'Cổng đá lớn', 'Sân vận động cổ'], a: 1, exp: 'Lý Hoa giới thiệu "一塔湖图" (Bóyǎ Tǎ và Wèimíng Hú).' }],
    sp: { hz: '我们学校历史悠久，校园风景优美。', py: 'Wǒmen xuéxiào lìshǐ yōujiǔ, xiàoyuán fēngjǐng yōuměi.', vi: 'Trường chúng tôi có lịch sử lâu đời, phong cảnh khuôn viên rất đẹp.' }
  },
  {
    num: 72, top: 8, lvl: 'HSK 3', title: 'Hỏi lịch học', hz: '查询与核对课表', py: 'Cháxún yǔ héduì kèbiǎo',
    sit: 'Tuấn và Trang xem thời khóa biểu tuần đầu học kỳ mới để tránh đi nhầm phòng học.',
    c: [{ n: 'Anh Tuấn', r: 'Bạn học', g: 'male', a: '👱‍♂️' }, { n: 'Huyền Trang', r: 'Bạn học', g: 'female', a: '👩' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '玄庄，你看教务系统的课表了吗？周一上午第一节是什么课？', py: 'Xuán Zhuāng, nǐ kàn jiàowù xìtǒng de kèbiǎo le ma? Zhōuyī shàngwǔ dì-yī jié shì shénme kè?', vi: 'Huyền Trang, cậu xem thời khóa biểu trên hệ thống đào tạo chưa? Tiết đầu sáng thứ Hai là môn gì thế?' },
      { s: 'Huyền Trang', g: 'female', hz: '周一八点是高级汉语精读课，在第三教学楼205教室，张教授主讲。', py: 'Zhōuyī bā diǎn shì gāojí hànyǔ jīngdú kè, zài dì-sān jiàoxuélóu èr líng wǔ jiàoshì, Zhāng jiàoshòu zhǔjiǎng.', vi: '8 giờ sáng thứ Hai là môn Đọc hiểu chuyên sâu tiếng Trung cao cấp, ở phòng 205 nhà học số 3, giáo sư Trương giảng dạy.' },
      { s: 'Anh Tuấn', g: 'male', hz: '下午有课吗？听说这学期的跨文化交际课是选修课，你选上了吗？', py: 'Xiàwǔ yǒu kè ma? Tīngshuō zhè xuéqī de kuà wénhuà jiāojì kè shì xuǎnxiūkè, nǐ xuǎn shang le ma?', vi: 'Chiều có môn không? Nghe nói môn Giao tiếp liên văn hóa kỳ này là môn tự chọn, cậu có đăng ký được không?' },
      { s: 'Huyền Trang', g: 'female', hz: '下午两点有一门听力课。跨文化交际我抢到了！周四晚上的课，我们又能做同桌啦！', py: 'Xiàwǔ liǎng diǎn yǒu yì mén tīnglì kè. Kuà wénhuà jiāojì wǒ qiǎng dào le! Zhōusì wǎnshang de kè, wǒmen yòu néng zuò tóngzhuō la!', vi: '2 giờ chiều có môn Nghe hiểu. Môn Giao tiếp liên văn hóa mình giật được slot rồi! Học tối thứ Năm, bọn mình lại được ngồi cùng bàn nè!' }
    ],
    v: [{ hz: '教务系统', py: 'jiàowù xìtǒng', m: 'hệ thống quản lý đào tạo', hsk: 'HSK 4' }, { hz: '课表', py: 'kèbiǎo', m: 'thời khóa biểu', hsk: 'HSK 3' }, { hz: '精读', py: 'jīngdú', m: 'đọc hiểu chuyên sâu', hsk: 'HSK 4' }, { hz: '选修课', py: 'xuǎnxiūkè', m: 'môn học tự chọn', hsk: 'HSK 4' }],
    g: [{ t: 'Lượng từ của tiết học: 节 (Jié) & Môn học: 门 (Mén)', s: '第一节课 (Tiết 1) / 一门课 (Một môn học)', e: 'Phân biệt rõ 节 (tiết) và 门 (môn).' }],
    q: [{ q: 'Tiết học đầu tiên sáng thứ Hai học ở đâu?', options: ['Nhà học 1 phòng 101', 'Nhà học số 3 phòng 205 (第三教学楼205)', 'Thư viện', 'Hội trường lớn'], a: 1, exp: 'Trang nói: "在第三教学楼205教室".' }],
    sp: { hz: '请问周一上午第一节课在哪个教室？', py: 'Qǐngwèn zhōuyī shàngwǔ dì-yī jié kè zài nǎge jiàoshì?', vi: 'Xin hỏi tiết 1 sáng thứ Hai học ở phòng học nào?' }
  },
  {
    num: 73, top: 8, lvl: 'HSK 3', title: 'Mượn sách tại thư viện', hz: '在图书馆借阅图书', py: 'Zài túshūguǎn jièyuè túshū',
    sit: 'Minh đến quầy lưu thông thư viện để mượn từ điển và sách ngữ pháp chuyên khảo.',
    c: [{ n: 'Văn Minh', r: 'Sinh viên', g: 'male', a: '👦' }, { n: 'Thủ thư', r: 'Cán bộ thư viện', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '老师您好，我想借这本《现代汉语八百词》和《古代汉语常用字字典》。', py: 'Lǎoshī nín hǎo, wǒ xiǎng jiè zhè běn “Xiàndài Hànyǔ Bābǎi Cí” hé “Gǔdài Hànyǔ Chángyòngzì Zìdiǎn”.', vi: 'Chào cô ạ, em muốn mượn cuốn "Hiện đại Hán ngữ 800 từ" và "Từ điển chữ thường dùng Hán ngữ cổ đại" này ạ.' },
      { s: 'Thủ thư', g: 'female', hz: '请出示你的校园一卡通。请问你的借阅账户上有逾期未还的书籍吗？', py: 'Qǐng chūshì nǐ de xiàoyuán yíkǎtōng. Qǐngwèn nǐ de jièyuè zhànghù shang yǒu yúqī wèihuán de shūjí ma?', vi: 'Em xuất trình thẻ sinh viên tích hợp đa năng nhé. Xin hỏi tài khoản mượn của em có sách nào quá hạn chưa trả không?' },
      { s: 'Văn Minh', g: 'male', hz: '没有，我都按时归还了。这两本书可以借多长时间？能续借吗？', py: 'Méiyǒu, wǒ dōu ànshí guīhuán le. Zhè liǎng běn shū kěyǐ jiè duō cháng shíjiān? Néng xùjiè ma?', vi: 'Dạ không ạ, em đều trả đúng hạn. Hai cuốn này được mượn trong bao lâu ạ? Có được gia hạn mượn tiếp không cô?' },
      { s: 'Thủ thư', g: 'female', hz: '普通图书可以借三十天，到期前可以在图书馆官网上续借一次，延长三十天。', py: 'Pǔtōng túshū kěyǐ jiè sānshí tiān, dàoqī qián kěyǐ zài túshūguǎn guānwǎng shang xùjiè yí cì, yáncháng sānshí tiān.', vi: 'Sách thông thường được mượn 30 ngày, trước khi hết hạn em có thể gia hạn 1 lần trên web thư viện, kéo dài thêm 30 ngày.' }
    ],
    v: [{ hz: '借阅', py: 'jièyuè', m: 'mượn đọc sách báo', hsk: 'HSK 4' }, { hz: '一卡通', py: 'yíkǎtōng', m: 'thẻ sinh viên tích hợp đa năng', hsk: 'HSK 4' }, { hz: '逾期', py: 'yúqī', m: 'quá hạn', hsk: 'HSK 5' }, { hz: '续借', py: 'xùjiè', m: 'gia hạn mượn sách', hsk: 'HSK 4' }],
    g: [{ t: 'Thời hạn mượn sách: 到期前 (Trước khi hết hạn)', s: '到期前 + 续借一次', e: 'Trước ngày đáo hạn có thể gia hạn thêm 1 lần.' }],
    q: [{ q: 'Thời hạn mượn thông thường của một cuốn sách ở thư viện là bao lâu?', options: ['7 ngày', '15 ngày', '30 ngày (三十天)', '60 ngày'], a: 2, exp: 'Thủ thư trả lời: 普通图书可以借三十天.' }],
    sp: { hz: '我想借这两本书，请问能借多长时间？', py: 'Wǒ xiǎng jiè zhè liǎng běn shū, qǐngwèn néng jiè duō cháng shíjiān?', vi: 'Em muốn mượn hai cuốn sách này, cho hỏi mượn được bao lâu ạ?' }
  },
  {
    num: 74, top: 8, lvl: 'HSK 3', title: 'Hỏi về bài tập về nhà', hz: '请教课后作业', py: 'Qǐngjiào kèhòu zuòyè',
    sit: 'Quang nhắn tin hỏi lớp phó học tập về bài tập làm văn tiếng Trung tuần này.',
    c: [{ n: 'Hồng Quang', r: 'Học viên', g: 'male', a: '👨' }, { n: 'Lý Hoa', r: 'Lớp phó học tập', g: 'female', a: '👩‍🎓' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '李华，下课前老师布置的写作作业，具体要求是什么呀？我漏记了一点。', py: 'Lǐ Huá, xiàkè qián lǎoshī bùzhì de xiězuò zuòyè, jùtǐ yāoqiú shì shénme ya? Wǒ lòu jì le yìdiǎn.', vi: 'Lý Hoa ơi, bài tập làm văn thầy giao trước khi tan học yêu cầu cụ thể là gì thế? Mình ghi thiếu mất một đoạn.' },
      { s: 'Lý Hoa', g: 'female', hz: '题目是《科技对现代生活的影响》，字数要求在六百字到八百字之间。', py: 'Tímù shì “Kējì Duì Xiàndài Shēnghuó De Yǐngxiǎng”, zìshù yāoqiú zài liùbǎi zì dào bābǎi zì zhījiān.', vi: 'Đề bài là "Ảnh hưởng của công nghệ đối với đời sống hiện đại", yêu cầu số lượng chữ từ 600 đến 800 chữ.' },
      { s: 'Hồng Quang', g: 'male', hz: '需要手写还是打印交电子版？截止提交日期是什么时候？', py: 'Xūyào shǒuxiě háishi dǎyìn jiāo diànzǐbǎn? Jiézhǐ tíjiāo rìqī shì shénme shíhou?', vi: 'Cần viết tay hay in ra nộp bản điện tử? Hạn chót nộp bài là khi nào cậu?' },
      { s: 'Lý Hoa', g: 'female', hz: '老师要求手写在作文本上，周五上课前由各组长收齐交到课代表那里。', py: 'Lǎoshī yāoqiú shǒuxiě zài zuòwénběn shang, zhōuwǔ shàngkè qián yóu gè zǔzhǎng shōuqí jiāo dào kèdàibiǎo nàli.', vi: 'Thầy yêu cầu viết tay vào vở tập làm văn, trước giờ học thứ Sáu các nhóm trưởng thu đủ nộp cho lớp phó nhé.' }
    ],
    v: [{ hz: '布置', py: 'bùzhì', m: 'giao (bài tập), bố trí', hsk: 'HSK 4' }, { hz: '字数', py: 'zìshù', m: 'số lượng từ/chữ', hsk: 'HSK 3' }, { hz: '截止', py: 'jiézhǐ', m: 'hạn chót, hạn cuối', hsk: 'HSK 4' }, { hz: '收齐', py: 'shōuqí', m: 'thu gom đầy đủ', hsk: 'HSK 4' }],
    g: [{ t: 'Phạm vi số lượng: 在...之间 (Zài... zhījiān)', s: '在 + Mức A + 到 + Mức B + 之间', e: '在六百字到八百字之间 (Trong khoảng từ 600 đến 800 chữ).' }],
    q: [{ q: 'Bài viết yêu cầu viết bao nhiêu chữ?', options: ['300 - 500 chữ', '600 - 800 chữ (六百到八百字)', '1000 chữ', 'Không giới hạn'], a: 1, exp: 'Lý Hoa nói: "字数要求在六百字到八百字之间".' }],
    sp: { hz: '请问作业的截止日期是什么时候？', py: 'Qǐngwèn zuòyè de jiézhǐ rìqī shì shénme shíhou?', vi: 'Xin hỏi hạn chót nộp bài tập là khi nào?' }
  },
  {
    num: 75, top: 8, lvl: 'HSK 3', title: 'Thảo luận bài học với bạn', hz: '探讨课文与学术问题', py: 'Tàntǎo kèwén yǔ xuéshù wèntí',
    sit: 'Tuấn và Lan ngồi trong phòng tự học thảo luận về một điểm ngữ pháp khó trong bài khóa.',
    c: [{ n: 'Anh Tuấn', r: 'Học viên thảo luận', g: 'male', a: '👱‍♂️' }, { n: 'Hương Lan', r: 'Học viên đối thoại', g: 'female', a: '👩' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '香兰，课文中这句“与其坐以待毙，不如主动出击”，语法结构该怎么理解？', py: 'Xiānglán, kèwén zhōng zhè jù “yǔqí zuòyǐdàibì, bùrú zhǔdòng chūjī”, yǔfǎ jiégòu gāi zěnme lǐjiě?', vi: 'Hương Lan, câu "与其坐以待毙，不如主动出击" (Thà chủ động xuất kích còn hơn ngồi chờ chết) trong bài khóa cấu trúc ngữ pháp hiểu thế nào?' },
      { s: 'Hương Lan', g: 'female', hz: '这是个选择复句，“与其A，不如B”表示在两相比较中，舍弃A而选取B。', py: 'Zhè shì gè xuǎnzé fùjù, “yǔqí A, bùrú B” biǎoshì zài liǎng xiāng bǐjiào zhōng, shěqì A ér xuǎnqǔ B.', vi: 'Đây là câu phức lựa chọn, "与其A，不如B" biểu thị trong sự so sánh giữa 2 phương án, từ bỏ phương án A để chọn phương án B.' },
      { s: 'Anh Tuấn', g: 'male', hz: '啊！我明白了，相当于“宁可B，也不A”的意思，对吧？', py: 'À! Wǒ míngbai le, xiāngdāng yú “nìngkě B, yě bù A” de yìsi, duì ba?', vi: 'À! Mình hiểu rồi, tương đương với ý nghĩa "Thà B còn hơn A", đúng không?' },
      { s: 'Hương Lan', g: 'female', hz: '非常准确！造个句子：与其周末在宿舍打游戏，不如去图书馆读书充电。', py: 'Fēicháng zhǔnquè! Zào gè jùzi: yǔqí zhōumò zài sùshè dǎ yóuxì, bùrú qù túshūguǎn dúshū chōngdiàn.', vi: 'Rất chính xác! Đặt câu thử xem: Thà đến thư viện đọc sách nạp kiến thức còn hơn cuối tuần ru rú ở ký túc xá chơi game.' }
    ],
    v: [{ hz: '复句', py: 'fùjù', m: 'câu phức', hsk: 'HSK 5' }, { hz: '与其...不如...', py: 'yǔqí... bùrú...', m: 'thà rằng... còn hơn...', hsk: 'HSK 4' }, { hz: '舍弃', py: 'shěqì', m: 'từ bỏ, buông bỏ', hsk: 'HSK 5' }, { hz: '充电', py: 'chōngdiàn', m: 'nạp năng lượng/bổ sung tri thức', hsk: 'HSK 4' }],
    g: [{ t: 'Cấu trúc lựa chọn cao cấp: 与其 A，不如 B', s: '与其 + Phương án bị chê, 不如 + Phương án được chọn', e: '与其抱怨，不如努力改变 (Thay vì than vãn, hãy nỗ lực thay đổi).' }],
    q: [{ q: 'Cấu trúc "与其A，不如B" mang ý nghĩa gì?', options: ['Chọn cả A và B', 'Bỏ cả A và B', 'Chọn B, từ bỏ A (舍弃A选择B)', 'Phân vân không biết chọn ai'], a: 2, exp: 'Lan giải thích: 舍弃A而选取B (từ bỏ A để chọn B).' }],
    sp: { hz: '与其抱怨生活，不如努力改变自己。', py: 'Yǔqí bàoyuàn shēnghuó, bùrú nǔlì gǎibiàn zìjǐ.', vi: 'Thay vì than phiền cuộc sống, chi bằng hãy nỗ lực thay đổi chính mình.' }
  },
  {
    num: 76, top: 8, lvl: 'HSK 3', title: 'Hỏi giáo viên về bài giảng', hz: '课后向老师请教问题', py: 'Kèhòu xiàng lǎoshī qǐngjiào wèntí',
    sit: 'Minh ở lại sau giờ học để xin giáo sư Vương giảng giải thêm về câu chữ Bả (把字句).',
    c: [{ n: 'Văn Minh', r: 'Sinh viên ham học', g: 'male', a: '👦' }, { n: 'Giáo sư Vương', r: 'Giảng viên ngữ pháp', g: 'male', a: '👨‍🏫' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '王教授，打扰您几分钟。刚才课上讲的“把字句”否定形式，我还有点疑惑。', py: 'Wáng jiàoshòu, dǎrǎo nín jǐ fēnzhōng. Gāngcái kè shang jiǎng de “bǎzìjù” fǒudìng xíngshì, wǒ hái yǒudiǎnr yíhuò.', vi: 'Thưa giáo sư Vương, em xin phép làm phiền thầy vài phút ạ. Hình thức phủ định của "câu chữ Bả" vừa giảng trên lớp em còn hơi thắc mắc một chút.' },
      { s: 'Giáo sư Vương', g: 'male', hz: '没关系，好学是好事！你具体对哪一部分不理解？', py: 'Méi guānxi, hàoxué shì hǎoshì! Nǐ jùtǐ duì nǎ yí bùfen bù lǐjiě?', vi: 'Không sao đâu em, ham học là điều rất tốt! Em chưa hiểu cụ thể ở phần nào?' },
      { s: 'Văn Minh', g: 'male', hz: '否定副词“不”或者“没”，是放在“把”字前面，还是动词前面？', py: 'Fǒudìng fùcí “bù” huòzhě “méi”, shì fàng zài “bǎ” zì qiánmiàn, háishi dòngcí qiánmiàn?', vi: 'Phó từ phủ định "bù" hoặc "méi" là đặt trước chữ "bả", hay là đặt trước động từ ạ?' },
      { s: 'Giáo sư Vương', g: 'male', hz: '记住一个口诀：否定词必须放在“把”字的前面！比如“他没有把作业交上来”，绝不能说“他把作业没有交”。', py: 'Jìzhu yí gè kǒujué: fǒudìngcí bìxū fàng zài “bǎ” zì de qiánmiàn! Bǐrú “tā méiyǒu bǎ zuòyè jiāo shànglai”, juébù néng shuō “tā bǎ zuòyè méiyǒu jiāo”.', vi: 'Em hãy nhớ một khẩu quyết: Từ phủ định bắt buộc phải đặt ở PHÍA TRƯỚC chữ "bả"! Ví dụ: "Anh ấy chưa nộp bài tập lên", tuyệt đối không được nói "他把作业没有交".' }
    ],
    v: [{ hz: '疑惑', py: 'yíhuò', m: 'thắc mắc, nghi hoặc', hsk: 'HSK 4' }, { hz: '口诀', py: 'kǒujué', m: 'khẩu quyết, mẹo ghi nhớ', hsk: 'HSK 5' }, { hz: '否定副词', py: 'fǒudìng fùcí', m: 'phó từ phủ định (bù/méi)', hsk: 'HSK 4' }, { hz: '绝不能', py: 'juébù néng', m: 'tuyệt đối không thể', hsk: 'HSK 4' }],
    g: [{ t: 'Quy tắc vàng câu chữ 把: Phủ định đứng TRƯỚC 把', s: 'Chủ ngữ + 不/没(有) + 把 + Tân ngữ + Động từ + Thành phần khác', e: '我没把那件事告诉他 (Tôi chưa nói chuyện đó cho anh ấy).' }],
    q: [{ q: 'Trong câu chữ 把, từ phủ định (不 / 没) bắt buộc phải đứng ở đâu?', options: ['Sau động từ', 'Trước chữ 把 (放在“把”字前面)', 'Sau tân ngữ', 'Ở cuối câu'], a: 1, exp: 'Giáo sư khẳng định: 否定词必须放在“把”字的前面.' }],
    sp: { hz: '否定词必须放在“把”字的前面。', py: 'Fǒudìngcí bìxū fàng zài “bǎ” zì de qiánmiàn.', vi: 'Từ phủ định bắt buộc phải đặt ở phía trước chữ "bả".' }
  },
  {
    num: 77, top: 8, lvl: 'HSK 3', title: 'Đăng ký khóa học', hz: '报名选课与注册', py: 'Bàomíng xuǎnkè yǔ zhùcè',
    sit: 'An đến văn phòng quản lý sinh viên quốc tế để làm thủ tục đăng ký học phần HSK 5.',
    c: [{ n: 'Thúy An', r: 'Lưu học sinh', g: 'female', a: '👧' }, { n: 'Thầy quản lý', r: 'Cán bộ phòng đào tạo', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Thúy An', g: 'female', hz: '老师您好，我想报名参加下学期的HSK五级冲刺强化班。', py: 'Lǎoshī nín hǎo, wǒ xiǎng bàomíng cānjiā xià xuéqī de HSK wǔjí chōngcì qiánghuàbān.', vi: 'Chào thầy ạ, em muốn đăng ký tham gia lớp bồi dưỡng cấp tốc HSK 5 kỳ tới ạ.' },
      { s: 'Thầy quản lý', g: 'male', hz: '好的。请问你目前取得HSK四级证书了吗？成绩是多少分？', py: 'Hǎo de. Qǐngwèn nǐ mùqián qǔdé HSK sìjí zhèngshū le ma? Chéngjì shì duōshao fēn?', vi: 'Được chứ em. Cho thầy hỏi hiện tại em đã có chứng chỉ HSK 4 chưa? Điểm số là bao nhiêu?' },
      { s: 'Thúy An', g: 'female', hz: '我上个月刚考过，考了二百六十五分。这是我的成绩单复印件。', py: 'Wǒ shàng gè yuè gāng kǎo guo, kǎo le èrbǎi liùshíwǔ fēn. Zhè shì wǒ de chéngjìdān fùyìnjiàn.', vi: 'Em vừa thi tháng trước, đạt 265 điểm ạ. Đây là bản photo bảng điểm của em ạ.' },
      { s: 'Thầy quản lý', g: 'male', hz: '四级基础很扎实！强化班每周二、周四晚上开课，学费一千二百元，在网上缴费即可。', py: 'Sìjí jīchǔ hěn zhāshi! Qiánghuàbān měi zhōurèr, zhōusì wǎnshang kāikè, xuéfèi yìqiān èrbǎi yuán, zài wǎngshang jiǎofèi jíkě.', vi: 'Nền tảng HSK 4 của em rất vững vàng! Lớp cấp tốc học tối thứ Ba và thứ Năm hàng tuần, học phí 1200 tệ, nộp tiền online là xong nhé.' }
    ],
    v: [{ hz: '冲刺班', py: 'chōngcìbān', m: 'lớp bồi dưỡng cấp tốc (nước rút)', hsk: 'HSK 5' }, { hz: '扎实', py: 'zhāshi', m: 'vững chắc, thực chất', hsk: 'HSK 4' }, { hz: '成绩单', py: 'chéngjìdān', m: 'bảng điểm', hsk: 'HSK 3' }, { hz: '缴费', py: 'jiǎofèi', m: 'nộp học phí, đóng tiền', hsk: 'HSK 4' }],
    g: [{ t: 'Đạt được chứng chỉ/kết quả: 取得... (Qǔdé...)', s: '取得 + HSK证书 / 优异成绩', e: 'Đạt được chứng chỉ HSK: 取得HSK证书.' }],
    q: [{ q: 'Thúy An đã đạt bao nhiêu điểm trong kỳ thi HSK 4 vừa rồi?', options: ['200 điểm', '230 điểm', '265 điểm (二百六十五分)', '290 điểm'], a: 2, exp: 'An nói: "考了二百六十五分".' }],
    sp: { hz: '我想报名参加HSK五级强化培训班。', py: 'Wǒ xiǎng bàomíng cānjiā HSK wǔjí qiánghuà péixùnbān.', vi: 'Tôi muốn đăng ký tham gia lớp bồi dưỡng nâng cao HSK 5.' }
  },
  {
    num: 78, top: 8, lvl: 'HSK 3', title: 'Chuẩn bị cho kỳ thi', hz: '备考与复习迎考', py: 'Bèikǎo yǔ fùxí yíngkǎo',
    sit: 'Tuấn và Minh chia sẻ kinh nghiệm luyện đề và phân bổ thời gian trước kỳ thi cuối kỳ.',
    c: [{ n: 'Anh Tuấn', r: 'Bạn học ôn thi', g: 'male', a: '👱‍♂️' }, { n: 'Văn Minh', r: 'Bạn cùng ôn tập', g: 'male', a: '👦' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '文明，下周一就要考中国古代文学史了，你复习得怎么样了？', py: 'Wénmíng, xià zhōuyī jiù yào kǎo Zhōngguó gǔdài wénxuéshǐ le, nǐ fùxí de zěnmeyàng le?', vi: 'Văn Minh, thứ Hai tuần sau thi môn Lịch sử văn học cổ đại Trung Quốc rồi, cậu ôn tập đến đâu rồi?' },
      { s: 'Văn Minh', g: 'male', hz: '知识点太多了，特别是唐诗宋词的流派，背得我头昏脑涨。', py: 'Zhīshidǐan tài duō le, tèbié shì Táng shī Sòng cí de liúpài, bèi de wǒ tóuhūn-nǎozhàng.', vi: 'Kiến thức nhiều quá trời, nhất là các trường phái thơ Đường từ Tống, học vẹt nhức hết cả đầu óc.' },
      { s: 'Anh Tuấn', g: 'male', hz: '死记硬背效率太低了！我用思维导图梳理了历代文学发展脉络，发给你参考一下吧！', py: 'Sǐjì-yìngbèi xiàolǜ tài dī le! Wǒ yòng sīwéi dǎotú shūlǐ le lìdài wénxué fāzhǎn màiluò, fā gěi nǐ cānkǎo yíxià ba!', vi: 'Học vẹt máy móc hiệu quả thấp lắm! Mình dùng sơ đồ tư duy (mindmap) hệ thống hóa lại mạch phát triển văn học các thời kỳ, gửi cậu tham khảo nhé!' },
      { s: 'Văn Minh', g: 'male', hz: '太救命了！有了思维导图，条理清晰多了，真是一目了然！', py: 'Tài jiùmìng le! Yǒu le sīwéi dǎotú, tiáolǐ qīngxī duō le, zhēn shì yímùliǎorán!', vi: 'Cứu tinh đời mình rồi! Có sơ đồ tư duy mạch lạc rõ ràng hơn hẳn, đúng là nhìn qua là hiểu liền!' }
    ],
    v: [{ hz: '备考', py: 'bèikǎo', m: 'chuẩn bị cho kỳ thi', hsk: 'HSK 4' }, { hz: '死记硬背', py: 'sǐjì-yìngbèi', m: 'học vẹt, ghi nhớ máy móc', hsk: 'HSK 5' }, { hz: '思维导图', py: 'sīwéi dǎotú', m: 'sơ đồ tư duy (mindmap)', hsk: 'HSK 4' }, { hz: '一目了然', py: 'yímùliǎorán', m: 'nhìn qua là hiểu rõ ngay', hsk: 'HSK 5' }],
    g: [{ t: 'Thành ngữ học tập: 一目了然 (Nhìn qua hiểu ngay)', s: '一目了然 (Yímùliǎorán)', e: 'Khen ngợi bảng biểu, sơ đồ trực quan sinh động.' }],
    q: [{ q: 'Tuấn đã dùng phương pháp học tập nào để hệ thống lại kiến thức môn văn học?', options: ['Thức đêm chép phạt', 'Sơ đồ tư duy (思维导图)', 'Nhờ người thi hộ', 'Bỏ qua không học'], a: 1, exp: 'Tuấn nói: "我用思维导图梳理了发展脉络".' }],
    sp: { hz: '用思维导图复习，所有知识点一目了然。', py: 'Yòng sīwéi dǎotú fùxí, suǒyǒu zhīshidǐan yímùliǎorán.', vi: 'Dùng sơ đồ tư duy để ôn tập, mọi điểm kiến thức nhìn qua là hiểu rõ ngay.' }
  },
  {
    num: 79, top: 8, lvl: 'HSK 3', title: 'Thảo luận về môn học yêu thích', hz: '畅谈最喜爱的学科', py: 'Chàngtán zuì xǐ’ài de xuékē',
    sit: 'Trang và Cường chia sẻ lý do vì sao mình lại đam mê môn Ngôn ngữ học và Hán tự học.',
    c: [{ n: 'Huyền Trang', r: 'Yêu ngôn ngữ học', g: 'female', a: '👩' }, { n: 'Trương Cường', r: 'Yêu dịch thuật', g: 'male', a: '👨' }],
    d: [
      { s: 'Trương Cường', g: 'male', hz: '玄庄，这学期这么多专业课，你对哪门课最感兴趣？', py: 'Xuán Zhuāng, zhè xuéqī zhème duō zhuānyèkè, nǐ duì nǎ mén kè zuì gǎn xìngqù?', vi: 'Huyền Trang, kỳ này nhiều môn chuyên ngành thế, cậu hứng thú nhất với môn nào?' },
      { s: 'Huyền Trang', g: 'female', hz: '我最迷汉字学和词源学！探索甲骨文演变到现代汉字的过程，就像破案一样引人入胜。', py: 'Wǒ zuì mí hànzìxué hé cíyuánxué! Tànsuǒ jiǎgǔwén yǎnbiàn dào xiàndài hànzì de guòchéng, jiù xiàng pò’àn yíyàng yǐnrén-rùshèng.', vi: 'Mình say mê nhất môn Chữ Hán học và Từ nguyên học! Khám phá quá trình diễn biến từ chữ Giáp cốt đến chữ Hán hiện đại, hệt như phá án vậy, lôi cuốn cực kỳ.' },
      { s: 'Trương Cường', g: 'male', hz: '确实，汉字蕴含着几千年的东方哲学智慧。我则更偏爱同声传译课，特别锻炼临场应变能力。', py: 'Quèshí, hànzì yùnhánzhe jǐqiān nián de dōngfāng zhéxué zhìhuì. Wǒ zé gèng piān’ài tóngshēng-chuányì kè, tèbié duànliàn línchǎng yìngbiàn nénglì.', vi: 'Đúng thế, chữ Hán ẩn chứa mấy ngàn năm trí tuệ triết học phương Đông. Còn mình thì thiên về môn Dịch song song (cabin), rèn luyện phản xạ ứng biến tại chỗ rất đã.' },
      { s: 'Huyền Trang', g: 'female', hz: '各有所长！学好理论，再结合你的口译实践，我们一定能成为顶尖的中文专家！', py: 'Gè yǒu suǒ cháng! Xuéhǎo lǐlùn, zài jiéhé nǐ de kǒuyì shíjiàn, wǒmen yídìng néng chéngwéi dǐngjiān de zhōngwén zhuānjiā!', vi: 'Mỗi người một thế mạnh! Học giỏi lý luận, kết hợp với thực hành dịch nói của cậu, chúng mình nhất định sẽ trở thành chuyên gia tiếng Trung đỉnh cao!' }
    ],
    v: [{ hz: '引人入胜', py: 'yǐnrén-rùshèng', m: 'lôi cuốn hấp dẫn người xem/nghe', hsk: 'HSK 5' }, { hz: '蕴含', py: 'yùnhán', m: 'hàm chứa, ẩn chứa', hsk: 'HSK 5' }, { hz: '同声传译', py: 'tóngshēng-chuányì', m: 'phiên dịch song song (dịch cabin)', hsk: 'HSK 5' }, { hz: '各有所长', py: 'gè yǒu suǒ cháng', m: 'mỗi người một sở trường riêng', hsk: 'HSK 5' }],
    g: [{ t: 'Thành ngữ so sánh thú vị: 就像...一样 (Jiù xiàng... yíyàng)', s: 'Chủ ngữ + 就像 + Sự vật B + 一样 + Tính từ', e: '就像破案一样引人入胜 (Hấp dẫn lôi cuốn hệt như phá án).' }],
    q: [{ q: 'Huyền Trang đam mê nhất phân môn nào trong ngành học?', options: ['Kinh tế học', 'Chữ Hán học và Từ nguyên học (汉字学与词源学)', 'Toán cao cấp', 'Thể dục'], a: 1, exp: 'Trang nói: 我最迷汉字学和词源学.' }],
    sp: { hz: '研究汉字的演变过程，就像破案一样引人入胜。', py: 'Yánjiū hànzì de yǎnbiàn guòchéng, jiù xiàng pò’àn yíyàng yǐnrén-rùshèng.', vi: 'Nghiên cứu quá trình phát triển của chữ Hán hấp dẫn như phá án vậy.' }
  },
  {
    num: 80, top: 8, lvl: 'HSK 3', title: 'Lên kế hoạch học tập', hz: '制定学期学习规划', py: 'Zhìdìng xuéqī xuéxí guīhuà',
    sit: 'Minh và bạn cùng phòng lập thời gian biểu chi tiết để quyết tâm vượt qua HSK 6 trong năm nay.',
    c: [{ n: 'Văn Minh', r: 'Học viên mục tiêu cao', g: 'male', a: '👦' }, { n: 'Đại Vệ', r: 'Bạn đồng hành', g: 'male', a: '👨' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '大卫，这学期我定了一个大目标：年底前一定要以高分通过HSK六级！', py: 'Dàwèi, zhè xuéqī wǒ dìng le yí gè dà mùbiāo: niándǐ qián yídìng yào yǐ gāofēn tōngguò HSK liùjí!', vi: 'Đại Vệ, kỳ này mình đặt một mục tiêu lớn: trước cuối năm nhất định phải đỗ điểm cao HSK 6!' },
      { s: 'Đại Vệ', g: 'male', hz: '有志气！HSK六级词汇量要求五千以上，你打算如何具体落实计划？', py: 'Yǒu zhìqì! HSK liùjí cíhuìliàng yāoqiú wǔqiān yǐshàng, nǐ dǎsuàn rúhé jùtǐ luòshí jìhuà?', vi: 'Có chí khí! HSK 6 yêu cầu vốn từ hơn 5000 từ, cậu dự định cụ thể hóa kế hoạch ra sao?' },
      { s: 'Văn Minh', g: 'male', hz: '我把目标拆解成三步：每天背五十个核心高频词，每天精听一篇新闻广播，每周写两篇真题作文。', py: 'Wǒ bǎ mùbiāo chāijiě chéng sān bù: měitiān bèi wǔshí gè héxīn gāopín cí, měitiān jīngtīng yì piān xīnwén guǎngbō, měi zhōu xiě liǎng piān zhēntí zuòwén.', vi: 'Mình chia nhỏ mục tiêu thành 3 bước: Mỗi ngày học 50 từ vựng cốt lõi tần suất cao, mỗi ngày nghe sâu 1 bản tin thời sự, mỗi tuần viết 2 bài văn đề thi thật.' },
      { s: 'Đại Vệ', g: 'male', hz: '“贵在坚持，难在坚持，成在坚持”！我来当你的监督员，我们一起打卡互助！', py: '“Guì zài jiānchí, nán zài jiānchí, chéng zài jiānchí”! Wǒ lái dāng nǐ de jiāndūyuán, wǒmen yìqǐ dǎkǎ hùzhù!', vi: '"Quý ở kiên trì, khó ở kiên trì, thành công cũng nhờ kiên trì"! Mình làm giám sát viên cho cậu, tụi mình cùng điểm danh học tập giúp đỡ nhau nhé!' }
    ],
    v: [{ hz: '落实', py: 'luòshí', m: 'thực thi, hiện thực hóa', hsk: 'HSK 5' }, { hz: '拆解', py: 'chāijiě', m: 'chia nhỏ, phân rã mục tiêu', hsk: 'HSK 4' }, { hz: '高频词', py: 'gāopín cí', m: 'từ vựng xuất hiện tần suất cao', hsk: 'HSK 4' }, { hz: '贵在坚持', py: 'guì zài jiānchí', m: 'quý ở lòng kiên trì bền bỉ', hsk: 'HSK 5' }],
    g: [{ t: 'Triết lý hành động: 贵在坚持 (Quý ở kiên trì)', s: '贵在坚持，成在坚持', e: 'Thành công trong học ngoại ngữ phụ thuộc vào tính bền bỉ.' }],
    q: [{ q: 'Minh đã chia kế hoạch học từ vựng HSK 6 như thế nào mỗi ngày?', options: ['Mỗi ngày 10 từ', 'Mỗi ngày 50 từ cốt lõi (五十个核心高频词)', 'Mỗi ngày 100 từ', 'Không học từ vựng'], a: 1, exp: 'Minh nói: "每天背五十个核心高频词".' }],
    sp: { hz: '学习外语贵在坚持，只要每天进步一点点就能成功。', py: 'Xuéxí wàiyǔ guì zài jiānchí, zhǐyào měitiān jìnbù yì diǎndiǎn jiù néng chénggōng.', vi: 'Học ngoại ngữ quý ở kiên trì, mỗi ngày tiến bộ một chút là sẽ thành công.' }
  },

  // ==================== TOPIC 9: CÔNG VIỆC VÀ NGHỀ NGHIỆP (81 - 90) ====================
  {
    num: 81, top: 9, lvl: 'HSK 3', title: 'Giới thiệu công việc hiện tại', hz: '介绍当前工作与职责', py: 'Jièshào dāngqián gōngzuò yǔ zhízé',
    sit: 'Quang và Lan gặp nhau tại tiệc kết nối doanh nghiệp giao lưu về vị trí công việc.',
    c: [{ n: 'Hồng Quang', r: 'Giám đốc sản phẩm', g: 'male', a: '👨‍💼' }, { n: 'Hương Lan', r: 'Chuyên viên đối ngoại', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Hương Lan', g: 'female', hz: '洪光，听说你最近跳槽到了一家互联网大厂，现在主要负责什么业务？', py: 'Hóng Guāng, tīngshuō nǐ zuìjìn tiàocáo dào le yì jiā hùliánwǎng dàchǎng, xiànzài zhǔyào fùzé shénme yèwù?', vi: 'Hồng Quang, nghe nói gần đây anh nhảy việc sang một tập đoàn internet lớn, hiện tại chủ yếu phụ trách mảng nào?' },
      { s: 'Hồng Quang', g: 'male', hz: '我现在担任跨境电商部门的产品经理，主要负责东南亚市场的用户增长与本地化运营。', py: 'Wǒ xiànzài dānrèn kuàjìng diànshāng bùmén de chǎnpǐn jīnglǐ, zhǔyào fùzé Dōngnányà shìchǎng de yònghù zēngzhǎng yǔ běndìhuà yùnyíng.', vi: 'Hiện anh đảm nhiệm vị trí Giám đốc sản phẩm (Product Manager) mảng thương mại điện tử xuyên biên giới, chủ yếu phụ trách tăng trưởng người dùng và vận hành bản địa hóa thị trường Đông Nam Á.' },
      { s: 'Hương Lan', g: 'female', hz: '这个赛道发展潜力巨大！越南市场也是你们的核心重点吧？', py: 'Zhège sàidào fāzhǎn qiánlì jùdà! Yuènán shìchǎng yě shì nǐmen de héxīn zhòngdiǎn ba?', vi: 'Lĩnh vực này tiềm năng phát triển cực lớn luôn! Thị trường Việt Nam cũng là trọng tâm cốt lõi của bên anh đúng không?' },
      { s: 'Hồng Quang', g: 'male', hz: '是的，越南年轻消费群体活跃，我们正在河内和胡志明市组建本地团队。', py: 'Shì de, Yuènán niánqīng xiāofèi qúntǐ huóyuè, wǒmen zhèngzài Hénèi hé Húzhìmíng Shì zǔjiàn běndì tuánduì.', vi: 'Đúng thế, tệp khách hàng trẻ ở Việt Nam rất năng động, tụi anh đang xây dựng đội ngũ bản địa tại Hà Nội và TP.HCM.' }
    ],
    v: [{ hz: '跳槽', py: 'tiàocáo', m: 'nhảy việc, chuyển công ty', hsk: 'HSK 5' }, { hz: '跨境电商', py: 'kuàjìng diànshāng', m: 'thương mại điện tử xuyên biên giới', hsk: 'HSK 5' }, { hz: '本地化', py: 'běndìhuà', m: 'bản địa hóa', hsk: 'HSK 4' }, { hz: '赛道', py: 'sàidào', m: 'lĩnh vực ngành nghề tiềm năng', hsk: 'HSK 5' }],
    g: [{ t: 'Đảm nhiệm vai trò: 担任... (Dānrèn...)', s: '在 + Công ty + 担任 + Chức vụ', e: '担任产品经理 (Đảm nhiệm chức giám đốc sản phẩm).' }],
    q: [{ q: 'Hồng Quang hiện đang làm vị trí gì ở tập đoàn internet?', options: ['Kế toán trưởng', 'Giám đốc sản phẩm (产品经理)', 'Lập trình viên thực tập', 'Nhân viên giao hàng'], a: 1, exp: 'Quang nói: "我现在担任跨境电商部门的产品经理".' }],
    sp: { hz: '我现在担任跨境电商部门的产品经理。', py: 'Wǒ xiànzài dānrèn kuàjìng diànshāng bùmén de chǎnpǐn jīnglǐ.', vi: 'Hiện tại tôi đảm nhiệm vị trí Giám đốc sản phẩm mảng thương mại điện tử xuyên biên giới.' }
  },
  {
    num: 82, top: 9, lvl: 'HSK 3', title: 'Tìm kiếm việc làm', hz: '求职与投递简历', py: 'Qiúzhí yǔ tóudì jiǎnlì',
    sit: 'Minh chuẩn bị tốt nghiệp đại học, cùng Tuấn thảo luận về các kênh tìm việc làm uy tín.',
    c: [{ n: 'Văn Minh', r: 'Sinh viên sắp ra trường', g: 'male', a: '👦' }, { n: 'Anh Tuấn', r: 'Đàn anh đi trước', g: 'male', a: '👱‍♂️' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '学长，马上就要到秋招季了，我投了几十份简历都没收到面试邀请，心里有点焦虑。', py: 'Xuézhǎng, mǎshàng jiù yào dào qiūzhāojì le, wǒ tóu le jǐshí fèn jiǎnlì dōu méi shōudào miànshì yāoqǐng, xīn lǐ yǒudiǎnr jiāolǜ.', vi: 'Anh Tuấn ơi, sắp tới mùa tuyển dụng mùa thu rồi, em rải mấy chục bộ CV mà chưa nhận được lời mời phỏng vấn nào, lòng thấy hơi âu lo.' },
      { s: 'Anh Tuấn', g: 'male', hz: '别灰心！海投简历往往命中率低，关键要“量体裁衣”，针对每个岗位的JD修改简历。', py: 'Bié huīxīn! Hǎitóu jiǎnlì wǎngwǎng mìngzhònglǜ dī, guānjiàn yào “liàngtǐ-cáiyī”, zhēnduì měi gè gǎngwèi de JD xiūgǎi jiǎnlì.', vi: 'Đừng nản lòng! Rải CV đại trà tỉ lệ trúng thấp lắm, mấu chốt là phải "liệu cơm gắp mắm", chỉnh sửa CV theo đúng mô tả công việc (JD) của từng vị trí.' },
      { s: 'Văn Minh', g: 'male', hz: '原来是这样！那找中越贸易类岗位，主要看重哪些技能？', py: 'Yuánlái shì zhèyàng! Nà zhǎo Zhōng-Yuè màoyì lèi gǎngwèi, zhǔyào kànzhòng nǎxiē jìnéng?', vi: 'Hóa ra là thế! Vậy tìm các vị trí ngành thương mại Trung - Việt thì người ta coi trọng những kỹ năng nào nhất?' },
      { s: 'Anh Tuấn', g: 'male', hz: '中越双语流利是基础，另外商务沟通能力、国际物流常识都是大加分项。把你的简历发我，我帮你润色！', py: 'Zhōng-Yuè shuāngyǔ liúlì shì jīchǔ, lìngwài shāngwù gōutōng nénglì, guójì wùliú chángshí dōu shì dà jiāfēn xiàng. Bǎ nǐ de jiǎnlì fā wǒ, wǒ bāng nǐ rùnsè!', vi: 'Song ngữ Trung - Việt lưu loát là cơ bản, ngoài ra kỹ năng đàm phán thương vụ, kiến thức logistics quốc tế là điểm cộng cực lớn. Gửi CV đây anh sửa chau chuốt giúp!' }
    ],
    v: [{ hz: '秋招', py: 'qiūzhāo', m: 'mùa tuyển dụng mùa thu', hsk: 'HSK 5' }, { hz: '海投', py: 'hǎitóu', m: 'rải hồ sơ xin việc hàng loạt', hsk: 'HSK 5' }, { hz: '量体裁衣', py: 'liàngtǐ-cáiyī', m: 'liệu cơm gắp mắm, đo ni đóng giày', hsk: 'HSK 5' }, { hz: '润色', py: 'rùnsè', m: 'chau chuốt, mài giũa câu chữ', hsk: 'HSK 5' }],
    g: [{ t: 'Thành ngữ hành động thiết thực: 量体裁衣', s: '针对目标，量体裁衣', e: 'May áo theo số đo người, viết CV theo đúng nhu cầu nhà tuyển dụng.' }],
    q: [{ q: 'Anh Tuấn khuyên Minh điều gì khi nộp hồ sơ xin việc?', options: ['Cứ tiếp tục rải đại trà hàng ngàn công ty', 'Chỉnh sửa CV phù hợp với từng vị trí (针对岗位修改简历)', 'Không cần làm CV', 'Nghỉ ngơi ở nhà'], a: 1, exp: 'Tuấn khuyên: 针对每个岗位的JD修改简历.' }],
    sp: { hz: '简历要量体裁衣，突出自己的核心优势。', py: 'Jiǎnlì yào liàngtǐ-cáiyī, tūchū zìjǐ de héxīn yōushì.', vi: 'Hồ sơ xin việc cần đo ni đóng giày, làm nổi bật ưu thế cốt lõi của mình.' }
  },
  {
    num: 83, top: 9, lvl: 'HSK 3', title: 'Tham gia phỏng vấn xin việc', hz: '面试互动问答', py: 'Miànshì hùdòng wèndá',
    sit: 'Trang tham gia vòng phỏng vấn chuyên sâu cho vị trí Chuyên viên Quản lý chuỗi cung ứng.',
    c: [{ n: 'Huyền Trang', r: 'Ứng viên', g: 'female', a: '👩‍💼' }, { n: 'Người phỏng vấn', r: 'Giám đốc nhân sự HRD', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Người phỏng vấn', g: 'male', hz: '玄庄女士，请问你为什么想申请我们公司的供应链专员岗位？你的优势是什么？', py: 'Xuán Zhuāng nǚshì, qǐngwèn nǐ wèishénme xiǎng shēnqǐng wǒmen gōngsī de gōngyìngliàn zhuānyuán gǎngwèi? Nǐ de yōushì shì shénme?', vi: 'Chị Huyền Trang, xin hỏi vì sao chị muốn ứng tuyển vị trí Chuyên viên chuỗi cung ứng của công ty chúng tôi? Thế mạnh của chị là gì?' },
      { s: 'Huyền Trang', g: 'female', hz: '贵公司是行业领军企业，我非常认同公司的创新文化。我的优势在于精通中越双语，且在大学期间主修国际贸易。', py: 'Guì gōngsī shì hángyè lǐngjūn qǐyè, wǒ fēicháng rèntóng gōngsī de chuàngxīn wénhuà. Wǒ de yōushì zàiyú jīngtōng Zhōng-Yuè shuāngyǔ, qiě zài dàxué qījiān zhǔxiū guójì màoyì.', vi: 'Quý công ty là doanh nghiệp dẫn đầu ngành, tôi rất đồng cảm với văn hóa đổi mới sáng tạo ở đây. Thế mạnh của tôi là thành thạo song ngữ Trung - Việt, và từng theo học chuyên ngành Thương mại quốc tế.' },
      { s: 'Người phỏng vấn', g: 'male', hz: '很好。如果跨国物流遭遇突发清关延误，你会如何协同多方解决问题？', py: 'Hěn hǎo. Rúguǒ kuàguó wùliú zāoyù tūfā qīngguān yánwù, nǐ huì rúhé xiétóng duōfāng jiějué wèntí?', vi: 'Rất tốt. Nếu logistics xuyên biên giới gặp sự cố chậm thông quan đột xuất, chị sẽ điều phối các bên giải quyết vấn đề thế nào?' },
      { s: 'Huyền Trang', g: 'female', hz: '我会第一时间启动应急预案：一方面与海关及报关行紧密核查缺件材料，另一方面向客户透明通报进展，制定备选运输方案。', py: 'Wǒ huì dì-yī shíjiān qǐdòng yìngjí yù’àn: yì fāngmiàn yǔ hǎiguān jí bàoguānháng jǐnmì héchá quējiàn cáiliào, lìng yì fāngmiàn xiàng kèhù tòumíng tōngbào jìnzhǎn, zhìdìng bèixuǎn yùnshū fāng’àn.', vi: 'Tôi sẽ ngay lập tức kích hoạt phương án ứng phó khẩn cấp: một mặt phối hợp chặt chẽ với hải quan và đại lý thông quan kiểm tra giấy tờ thiếu, mặt khác thông báo minh bạch tiến độ cho khách hàng, lên phương án vận chuyển dự phòng.' }
    ],
    v: [{ hz: '领军企业', py: 'lǐngjūn qǐyè', m: 'doanh nghiệp đầu ngành', hsk: 'HSK 5' }, { hz: '清关', py: 'qīngguān', m: 'thông quan hải quan', hsk: 'HSK 5' }, { hz: '协同', py: 'xiétóng', m: 'phối hợp điều phối', hsk: 'HSK 5' }, { hz: '应急预案', py: 'yìngjí yù’àn', m: 'kế hoạch ứng phó tình huống khẩn cấp', hsk: 'HSK 5' }],
    g: [{ t: 'Cặp đối ứng giải quyết: 一方面...另一方面...', s: '一方面 + Hành động 1, 另一方面 + Hành động 2', e: 'Một mặt phối hợp nội bộ, một mặt trấn an đối tác.' }],
    q: [{ q: 'Huyền Trang cho biết thế mạnh lớn nhất của mình là gì?', options: ['Biết lái xe tải', 'Thành thạo song ngữ Trung - Việt và học Thương mại quốc tế (精通中越双语与国贸)', 'Có nhiều tiền', 'Làm việc tự do'], a: 1, exp: 'Trang trả lời: "精通中越双语，且主修国际贸易".' }],
    sp: { hz: '我的优势在于精通双语，沟通与抗压能力强。', py: 'Wǒ de yōushì zàiyú jīngtōng shuāngyǔ, gōutōng yǔ kàngyā nénglì qiáng.', vi: 'Thế mạnh của tôi là thành thạo song ngữ, khả năng giao tiếp và chịu áp lực tốt.' }
  },
  {
    num: 84, top: 9, lvl: 'HSK 3', title: 'Giới thiệu kinh nghiệm làm việc', hz: '阐述过往工作履历', py: 'Chǎnshù guòwǎng gōngzuò lǚlì',
    sit: 'Quang trình bày về dự án quản lý vận hành giúp tăng trưởng 200% doanh thu trong công ty cũ.',
    c: [{ n: 'Hồng Quang', r: 'Ứng viên phỏng vấn', g: 'male', a: '👨‍💼' }, { n: 'Trưởng ban giám khảo', r: 'Phó chủ tịch tập đoàn', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Trưởng ban giám khảo', g: 'female', hz: '请用数据具体阐述一下你在上一家公司主导的最成功的一个项目。', py: 'Qǐng yòng shùjù jùtǐ chǎnshù yíxià nǐ zài shàng yì jiā gōngsī zhǔdǎo de zuì chénggōng de yí gè xiàngmù.', vi: 'Xin anh hãy dùng số liệu cụ thể để trình bày dự án thành công nhất mà anh từng chủ trì tại công ty trước.' },
      { s: 'Hồng Quang', g: 'male', hz: '我曾主导过一款东南亚直播带货App的冷启动项目。在短短三个月内，我们团队实现了从零到百万日活用户的突破。', py: 'Wǒ céng zhǔdǎo guo yì kuǎn Dōngnányà zhībō dàihuò App de lěngqǐdòng xiàngmù. Zài duǎnduǎn sān gè yuè nèi, wǒmen tuánduì shíxiàn le cóng líng dào bǎiwàn rìhuó yònghù de tūpò.', vi: 'Tôi từng chủ trì dự án khởi động từ số 0 (cold start) một app livestream bán hàng tại Đông Nam Á. Trong vỏn vẹn 3 tháng, đội ngũ chúng tôi đã tạo bước đột phá từ con số 0 lên 1 triệu người dùng hoạt động mỗi ngày.' },
      { s: 'Trưởng ban giám khảo', g: 'female', hz: '很亮眼的数据！在项目中你遇到的最大挑战是什么？', py: 'Hěn liàngyǎn de shùjù! Zài xiàngmù zhōng nǐ yùdào de zuì dà tiǎozhàn shì shénme?', vi: 'Số liệu rất bắt mắt! Thử thách lớn nhất mà anh gặp phải trong dự án đó là gì?' },
      { s: 'Hồng Quang', g: 'male', hz: '最大挑战是支付渠道的本土化对接。我带领跨国技术团队攻坚，最终接入了当地主流电子钱包，支付成功率提升了35%。', py: 'Zuì dà tiǎozhàn shì zhīfù qúdào de běntǔhuà duìjiē. Wǒ dàilǐng kuàguó jìshù tuánduì gōngjiān, zuìzhōng jiērù le dāngdì zhǔliú diànzǐ qiánbāo, zhīfù chénggōnglǜ tíshēng le bǎifēnzhī sānshíwǔ.', vi: 'Thử thách lớn nhất là kết nối cổng thanh toán bản địa. Tôi đã dẫn dắt đội ngũ kỹ thuật đa quốc gia tháo gỡ điểm nghẽn, cuối cùng kết nối thành công các ví điện tử chính yếu của địa phương, nâng tỷ lệ thanh toán thành công lên thêm 35%.' }
    ],
    v: [{ hz: '阐述', py: 'chǎnshù', m: 'trình bày rõ ràng, giải trình', hsk: 'HSK 5' }, { hz: '冷启动', py: 'lěngqǐdòng', m: 'khởi động từ con số 0 (cold start)', hsk: 'HSK 5' }, { hz: '亮眼', py: 'liàngyǎn', m: 'bắt mắt, ấn tượng xuất sắc', hsk: 'HSK 4' }, { hz: '攻坚', py: 'gōngjiān', m: 'vượt qua khó khăn thử thách lớn', hsk: 'HSK 5' }],
    g: [{ t: 'Thời gian ngắn ngủi: 在短短...内 (Zài duǎnduǎn... nèi)', s: '在短短 + [Thời gian ngắn] + 内', e: '在短短三个月内 (Trong vỏn vẹn 3 tháng).' }],
    q: [{ q: 'Dự án của Quang đã đạt cột mốc người dùng nào trong 3 tháng?', options: ['10 nghìn', '100 nghìn', '1 triệu người dùng hoạt động hàng ngày (百万日活用户)', '10 triệu'], a: 2, exp: 'Quang trình bày: "实现了从零到百万日活用户的突破".' }],
    sp: { hz: '在短短三个月内，我们团队实现了业务新突破。', py: 'Zài duǎnduǎn sān gè yuè nèi, wǒmen tuánduì shíxiàn le yèwù xīn tūpò.', vi: 'Trong vỏn vẹn 3 tháng, đội ngũ chúng tôi đã tạo ra bước đột phá mới trong kinh doanh.' }
  },
  {
    num: 85, top: 9, lvl: 'HSK 3', title: 'Trao đổi với đồng nghiệp', hz: '职场跨部门协作沟通', py: 'Zhíchǎng kuà bùmén xiézuò gōutōng',
    sit: 'Quang trao đổi công việc với kỹ sư trưởng công nghệ để chốt thời hạn ra mắt tính năng mới.',
    c: [{ n: 'Hồng Quang', r: 'Product Manager', g: 'male', a: '👨‍💼' }, { n: 'Đại Lực', r: 'Trưởng nhóm kỹ thuật Dev Lead', g: 'male', a: '👨‍💻' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '大力，下个迭代版本要上线的“智能搜索推荐”功能，前端和后端的联调进度怎么样了？', py: 'Dàlì, xià gè diédài bǎnběn yào shàngxiàn de “zhìnéng sōusuǒ tuījiàn” gōngnéng, qiánduān hé hòuduān de liántiáo jìndù zěnmeyàng le?', vi: 'Đại Lực, tính năng "gợi ý tìm kiếm thông minh" sắp ra mắt ở phiên bản tiếp theo, tiến độ ghép nối thử nghiệm frontend và backend sao rồi?' },
      { s: 'Đại Lực', g: 'male', hz: '核心接口已经打通，目前正在进行压力测试和边界用例覆盖，预计周三可以提测。', py: 'Héxīn jiēkǒu yǐjīng dǎtōng, mùqián zhèngzài jìnxíng yālì cèshì hé biānjiè yònglì fùgài, yùjì zhōusān kěyǐ tícè.', vi: 'Các cổng API cốt lõi đã thông suốt, hiện đang chạy kiểm thử chịu tải (stress test) và test case biên, dự kiến thứ Tư có thể bàn giao cho QA kiểm thử.' },
      { s: 'Hồng Quang', g: 'male', hz: '太给力了！运营团队已经在准备宣发物料了，务必保证周五准时全量发布。', py: 'Tài gěilì le! Yùnyíng tuánduì yǐjīng zài zhǔnbèi xuānfā wùliào le, wùbì bǎozhèng zhōuwǔ zhǔnshí quánliàng fābù.', vi: 'Xịn sò quá! Đội ngũ vận hành đã chuẩn bị sẵn tài liệu truyền thông rồi, nhất định phải đảm bảo thứ Sáu phát hành toàn hệ thống đúng hẹn nhé.' },
      { s: 'Đại Lực', g: 'male', hz: '放心吧，我们今晚加个班做最后的回归测试，绝不掉链子！', py: 'Fàngxīn ba, wǒmen jīnwǎn jiā gè bān zuò zuìhòu de huíguī cèshì, juébù diào liànzi!', vi: 'Yên tâm đi, tối nay tụi mình tăng ca chạy kiểm thử hồi quy lần cuối, tuyệt đối không để xích bung giữa chừng đâu!' }
    ],
    v: [{ hz: '迭代', py: 'diédài', m: 'bản cập nhật, sprint', hsk: 'HSK 5' }, { hz: '联调', py: 'liántiáo', m: 'ghép nối test chung liên hệ thống', hsk: 'HSK 5' }, { hz: '给力', py: 'gěilì', m: 'đỉnh, tuyệt vời, hỗ trợ hết mình', hsk: 'HSK 4' }, { hz: '掉链子', py: 'diào liànzi', m: 'tuột xích, thất bại giữa chừng làm hỏng việc', hsk: 'HSK 4' }],
    g: [{ t: 'Khẩu ngữ công sở đắc lực: 绝不掉链子', s: '放心吧，绝不掉链子！', e: 'Cam đoan tuyệt đối không làm hỏng việc của tập thể.' }],
    q: [{ q: 'Cụm từ khẩu ngữ "掉链子" (diào liànzi) có nghĩa là gì?', options: ['Đi sửa xe đạp', 'Gặp trục trặc, làm hỏng việc giữa chừng', 'Đi muộn về sớm', 'Mất trộm đồ'], a: 1, exp: '掉链子 nghĩa bóng là làm hỏng việc, đứt gánh giữa đường.' }],
    sp: { hz: '请放心，我们团队一定会按时交付，绝不掉链子！', py: 'Qǐng fàngxīn, wǒmen tuánduì yídìng huì ànshí jiāofù, juébù diào liànzi!', vi: 'Xin hãy yên tâm, đội ngũ chúng tôi nhất định sẽ bàn giao đúng hạn, tuyệt đối không để hỏng việc!' }
  },
  {
    num: 86, top: 9, lvl: 'HSK 3', title: 'Xin nghỉ phép', hz: '向领导请假', py: 'Xiàng lǐngdǎo qǐngjià',
    sit: 'Minh viết đơn và gặp trực tiếp trưởng phòng xin nghỉ phép 3 ngày về nước lo việc gia đình.',
    c: [{ n: 'Văn Minh', r: 'Nhân viên xin phép', g: 'male', a: '👨' }, { n: 'Trưởng phòng Trương', r: 'Sếp trực tiếp', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '张经理，您现在方便吗？我想向您请三天事假。', py: 'Zhāng jīnglǐ, nín xiànzài fāngbiàn ma? Wǒ xiǎng xiàng nín qǐng sān tiān shìjià.', vi: 'Trưởng phòng Trương, bây giờ sếp có tiện không ạ? Em muốn xin sếp nghỉ phép việc riêng 3 ngày ạ.' },
      { s: 'Trưởng phòng Trương', g: 'male', hz: '小阮，坐下说。家里有什么突发情况吗？', py: 'Xiǎo Ruǎn, zuò xia shuō. Jiā lǐ yǒu shénme tūfā qíngkuàng ma?', vi: 'Tiểu Nguyễn, ngồi xuống nói chuyện. Ở nhà có việc gì đột xuất hả em?' },
      { s: 'Văn Minh', g: 'male', hz: '我母亲突发急性胆囊炎住院动手术，我想请周三到周五三天假回河内照料她。', py: 'Wǒ mǔqīn tūfā jíxìng dǎnnángyán zhùyuàn dòng shǒushù, wǒ xiǎng qǐng zhōusān dào zhōuwǔ sān tiān jià huí Hénèi zhàoliào tā.', vi: 'Mẹ em đột ngột viêm túi mật cấp nhập viện mổ, em muốn xin nghỉ 3 ngày từ thứ Tư đến thứ Sáu về Hà Nội chăm sóc mẹ ạ.' },
      { s: 'Trưởng phòng Trương', g: 'male', hz: '孝顺父母是头等大事！假我批了，工作的事先交接给李华协助跟进。替我向阿姨带声问候！', py: 'Xiàoshùn fùmǔ shì tóuděng dàshì! Jià wǒ pī le, gōngzuò de shì xiān jiāojiē gěi Lǐ Huá xiézhù gēnjìn. Tì wǒ xiàng āyí dài shēng wènhòu!', vi: 'Hiếu thuận với cha mẹ là việc đại sự hàng đầu! Phép này anh duyệt, công việc em bàn giao cho Lý Hoa hỗ trợ theo dõi nhé. Cho anh gửi lời hỏi thăm sức khỏe tới bác gái!' }
    ],
    v: [{ hz: '事假', py: 'shìjià', m: 'nghỉ việc riêng (phân biệt với 病假 - nghỉ ốm)', hsk: 'HSK 3' }, { hz: '照料', py: 'zhàoliào', m: 'chăm sóc người ốm', hsk: 'HSK 4' }, { hz: '交接', py: 'jiāojiē', m: 'bàn giao công việc', hsk: 'HSK 4' }, { hz: '头等大事', py: 'tóuděng dàshì', m: 'việc quan trọng hàng đầu', hsk: 'HSK 5' }],
    g: [{ t: 'Cấu trúc xin phép ai đó: 向...请假', s: '向 + Lãnh đạo/Giáo viên + 请 + [Số ngày] + 假', e: '向经理请三天假 (Xin trưởng phòng nghỉ 3 ngày).' }],
    q: [{ q: 'Lý do Minh xin nghỉ phép 3 ngày là gì?', options: ['Đi du lịch', 'Mẹ nằm viện phẫu thuật về chăm sóc (母亲住院做手术)', 'Bị ốm', 'Chuyển nhà'], a: 1, exp: 'Minh trình bày mẹ bị bệnh nhập viện phẫu thuật.' }],
    sp: { hz: '张经理，我想向您请三天事假处理家事。', py: 'Zhāng jīnglǐ, wǒ xiǎng xiàng nín qǐng sān tiān shìjià chǔlǐ jiāshì.', vi: 'Trưởng phòng Trương, em muốn xin phép nghỉ 3 ngày để giải quyết việc gia đình.' }
  },
  {
    num: 87, top: 9, lvl: 'HSK 3', title: 'Báo cáo công việc', hz: '向主管汇报工作进展', py: 'Xiàng zhǔguǎn huìbào gōngzuò jìnzhǎn',
    sit: 'Trang báo cáo kết quả đàm phán hợp đồng cung ứng với đối tác trước ban giám đốc.',
    c: [{ n: 'Huyền Trang', r: 'Chuyên viên báo cáo', g: 'female', a: '👩‍💼' }, { n: 'Giám đốc Vương', r: 'Cấp trên lắng nghe', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Huyền Trang', g: 'female', hz: '王总，这是关于越南新供应商考察评估的结案报告，我向您做个简要汇报。', py: 'Wáng zǒng, zhè shì guānyú Yuènán xīn gōngyìngshāng kǎochá pínggū de jié’àn bàogào, wǒ xiàng nín zuò gè jiǎnyào huìbào.', vi: 'Thưa Tổng giám đốc Vương, đây là báo cáo kết thúc khảo sát đánh giá nhà cung cấp mới tại Việt Nam, em xin báo cáo vắn tắt với sếp.' },
      { s: 'Giám đốc Vương', g: 'male', hz: '好，讲讲关键结论：对方的产能和品控能力能不能达到我们的质检标准？', py: 'Hǎo, jiǎngjiang guānjiàn jiélùn: duìfāng de chǎnnéng hé pǐnkòng nénglì néng bu néng dá dào wǒmen de zhìjiǎn biāozhǔn?', vi: 'Được, nói các kết luận then chốt xem: năng lực sản xuất và kiểm soát chất lượng của đối tác có đạt chuẩn KCS bên mình không?' },
      { s: 'Huyền Trang', g: 'female', hz: '经过驻厂实测，对方良品率达99.2%，且承诺账期可延长至六十天，总体采购成本可压降12%。', py: 'Jīngguò zhùchǎng shícè, duìfāng liángpǐnlǜ dá bǎifēnzhī jiǔshíjiǔ diǎn èr, qiě chéngnuò zhàngqī kě yáncháng zhì liùshí tiān, zǒngtǐ cǎigòu chéngběn kě yājiàng bǎifēnzhī shí’èr.', vi: 'Qua đo đạc thực tế tại xưởng, tỷ lệ hàng đạt chuẩn của họ đạt 99.2%, cam kết thời hạn thanh toán kéo dài 60 ngày, tổng chi phí thu mua giảm được 12% ạ.' },
      { s: 'Giám đốc Vương', g: 'male', hz: '非常扎实的调研！报告数据清晰，论据充分。批准进入法务合同审批流程！', py: 'Fēicháng zhāshi de diàoyán! Bàogào shùjù qīngxī, lùnjù chōngfèn. Pīzhǔn jìnrù fǎwù hétong shěnpī liúchéng!', vi: 'Một bản khảo sát rất bài bản! Số liệu báo cáo rõ ràng, luận cứ xác đáng. Duyệt cho chuyển sang quy trình thẩm định hợp đồng pháp chế!' }
    ],
    v: [{ hz: '汇报', py: 'huìbào', m: 'báo cáo lên cấp trên', hsk: 'HSK 4' }, { hz: '品控/质检', py: 'pǐnkòng/zhìjiǎn', m: 'kiểm soát chất lượng sản phẩm (QC/QA)', hsk: 'HSK 5' }, { hz: '良品率', py: 'liángpǐnlǜ', m: 'tỷ lệ sản phẩm đạt chuẩn chất lượng', hsk: 'HSK 5' }, { hz: '法务', py: 'fǎwù', m: 'bộ phận pháp chế doanh nghiệp', hsk: 'HSK 5' }],
    g: [{ t: 'Báo cáo công việc trang trọng: 向...做汇报', s: '向 + Lãnh đạo + 做 (简要) 汇报', e: 'Báo cáo tiến độ lên cấp trên một cách chuyên nghiệp.' }],
    q: [{ q: 'Nhà cung cấp mới giúp giảm bao nhiêu phần trăm chi phí mua hàng?', options: ['5%', '10%', '12% (压降12%)', '20%'], a: 2, exp: 'Trang báo cáo: "总体采购成本可压降12%".' }],
    sp: { hz: '这是最新的工作进展，我向您做个简要汇报。', py: 'Zhè shì zuìxīn de gōngzuò jìnzhǎn, wǒ xiàng nín zuò gè jiǎnyào huìbào.', vi: 'Đây là tiến độ công việc mới nhất, em xin báo cáo vắn tắt với sếp.' }
  },
  {
    num: 88, top: 9, lvl: 'HSK 3', title: 'Tham gia cuộc họp', hz: '职场周会讨论与发言', py: 'Zhíchǎng zhōuhuì tǎolùn yǔ fāyán',
    sit: 'Quang phát biểu đề xuất giải pháp thúc đẩy doanh số trong cuộc họp giao ban đầu tuần.',
    c: [{ n: 'Chủ trì cuộc họp', r: 'Phó Tổng Giám Đốc', g: 'female', a: '👩‍💼' }, { n: 'Hồng Quang', r: 'Quản lý dự án', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Chủ trì cuộc họp', g: 'female', hz: '接下来由产品部发言，针对第三季度转化率下滑的问题，你们有什么应对策略？', py: 'Jiēxiàlai yóu chǎnpǐnbù fāyán, zhēnduì dì-sān jìdù zhuǎnhuàlǜ xiàhuá de wèntí, nǐmen yǒu shénme yìngduì cèlüè?', vi: 'Tiếp theo mời bộ phận Sản phẩm phát biểu, đối với vấn đề tỷ lệ chuyển đổi sụt giảm trong quý 3, các bạn có chiến lược ứng phó gì?' },
      { s: 'Hồng Quang', g: 'male', hz: '大家请看大屏幕的数据看板。我们定位到结账漏斗的流失率集中在“支付确认”这一步。', py: 'Dàjiā qǐng kàn dà píngmù de shùjù kànbǎn. Wǒmen dìngwèi dào jiézhàng lòudǒu de liúshīlǜ jízhōng zài “zhīfù quèrèn” zhè yí bù.', vi: 'Mời mọi người nhìn lên bảng điều khiển số liệu trên màn hình lớn. Chúng tôi đã định vị được tỷ lệ rơi rụng ở phễu thanh toán tập trung tại bước "xác nhận thanh toán".' },
      { s: 'Chủ trì cuộc họp', g: 'female', hz: '具体原因是什么？准备如何优化？', py: 'Jùtǐ yuányīn shì shénme? Zhǔnbèi rúhé yōuhuà?', vi: 'Nguyên nhân cụ thể là gì? Dự định tối ưu thế nào?' },
      { s: 'Hồng Quang', g: 'male', hz: '主要因为支付步骤过于冗长。我们计划简化流程，推出“一键快捷支付”，预计能挽回15%的流失用户。', py: 'Zhǔyào yīnwèi zhīfù bùzhòu guòyú rǒngcháng. Wǒmen jìhuà jiǎnhuà liúchéng, tuīchū “yíjiàn kuàijié zhīfù”, yùjì néng wǎnhuí bǎifēnzhī shíwǔ de liúshī yònghù.', vi: 'Chủ yếu do các bước thanh toán quá rườm rà. Chúng tôi dự định tinh gọn quy trình, tung ra tính năng "thanh toán nhanh 1 chạm", dự kiến cứu vãn được 15% khách hàng bị rơi rụng.' }
    ],
    v: [{ hz: '转化率', py: 'zhuǎnhuàlǜ', m: 'tỷ lệ chuyển đổi (conversion rate)', hsk: 'HSK 5' }, { hz: '漏斗', py: 'lòudǒu', m: 'phễu phân tích (funnel)', hsk: 'HSK 5' }, { hz: '冗长', py: 'rǒngcháng', m: 'dài dòng, rườm rà', hsk: 'HSK 5' }, { hz: '一键', py: 'yíjiàn', m: 'một nút bấm, một chạm', hsk: 'HSK 4' }],
    g: [{ t: 'Thành ngữ công nghệ: 一键 + Hành động', s: '一键支付 / 一键登录 / 一键分享', e: 'Thao tác chỉ bằng một nút bấm đơn giản thuận tiện.' }],
    q: [{ q: 'Giải pháp Quang đề xuất để giảm tỷ lệ khách rơi rụng là gì?', options: ['Tăng giá bán', 'Giảm nhân viên', 'Tung ra thanh toán nhanh 1 chạm (一键快捷支付)', 'Đóng cửa app'], a: 2, exp: 'Quang đề xuất: 推出“一键快捷支付”.' }],
    sp: { hz: '针对这个问题，我们的应对策略是简化支付流程。', py: 'Zhēnduì zhège wèntí, wǒmen de yìngduì cèlüè shì jiǎnhuà zhīfù liúchéng.', vi: 'Đối với vấn đề này, chiến lược ứng phó của chúng tôi là tinh gọn quy trình thanh toán.' }
  },
  {
    num: 89, top: 9, lvl: 'HSK 3', title: 'Thảo luận về mức lương', hz: '与人事洽谈薪资福利', py: 'Yǔ rénshì qiàtán xīnzī fúlì',
    sit: 'Trang đàm phán mức lương đãi ngộ với Giám đốc nhân sự trước khi chính thức nhận việc.',
    c: [{ n: 'Huyền Trang', r: 'Ứng viên đàm phán', g: 'female', a: '👩‍💼' }, { n: 'HR Director', r: 'Giám đốc nhân sự', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'HR Director', g: 'male', hz: '玄庄女士，我们面试官一致对你的表现非常满意，现在我们进入谈薪阶段。你期望的薪资是多少？', py: 'Xuán Zhuāng nǚshì, wǒmen miànshìguān yízhì duì nǐ de biǎoxiàn fēicháng mǎnyì, xiànzài wǒmen jìnrù tánxīn jiēduàn. Nǐ qīwàng de xīnzī shì duōshao?', vi: 'Chị Huyền Trang, hội đồng phỏng vấn rất hài lòng với biểu hiện của chị, giờ chúng ta bước vào vòng trao đổi chế độ đãi ngộ. Mức lương kỳ vọng của chị là bao nhiêu?' },
      { s: 'Huyền Trang', g: 'female', hz: '结合我的专业背景和行业平均水平，我期望税前月薪在一万五千元左右，外加年终绩效奖金。', py: 'Jiéhé wǒ de zhuānyè bèijǐng hé hángyè píngjūn shuǐpíng, wǒ qīwàng shuìqián yuèxīn zài yíwàn wǔqiān yuán zuǒyòu, wàijiā niánzhōng jìxiào jiǎngjīn.', vi: 'Dựa trên nền tảng chuyên môn của tôi và mức trung bình ngành, tôi kỳ vọng mức lương trước thuế tầm 15.000 tệ/tháng, cộng thêm thưởng hiệu suất cuối năm.' },
      { s: 'HR Director', g: 'male', hz: '我们公司提供“14薪”制，除了基本工资，还缴纳全额五险一金，每年还有带薪年假和体检。', py: 'Wǒmen gōngsī tígōng “shísì xīn” zhì, chúle jīběn gōngzī, hái jiǎonà quán’é wǔxiǎnyījīn, měinián hái yǒu dàixīn niánjià hé tǐjiǎn.', vi: 'Công ty chúng tôi áp dụng chế độ 14 tháng lương, ngoài lương cơ bản còn đóng đầy đủ 5 loại bảo hiểm và quỹ nhà ở, hàng năm có phép năm có lương và khám sức khỏe.' },
      { s: 'Huyền Trang', g: 'female', hz: '这个综合福利方案非常有竞争力，符合我的职业预期。非常荣幸能加入贵公司！', py: 'Zhège zōnghé fúlì fāng’àn fēicháng yǒu jìngzhènglì, fúhé wǒ de zhíyè yùqī. Fēicháng róngxìng néng jiārù guì gōngsī!', vi: 'Gói phúc lợi tổng hợp này rất có tính cạnh tranh, phù hợp với kỳ vọng nghề nghiệp của tôi. Rất vinh hạnh được gia nhập công ty!' }
    ],
    v: [{ hz: '薪资', py: 'xīnzī', m: 'tiền lương, đãi ngộ', hsk: 'HSK 5' }, { hz: '五险一金', py: 'wǔxiǎnyījīn', m: '5 loại bảo hiểm và 1 quỹ nhà ở (chế độ phúc lợi Trung Quốc)', hsk: 'HSK 5' }, { hz: '带薪年假', py: 'dàixīn niánjià', m: 'nghỉ phép năm có hưởng lương', hsk: 'HSK 4' }, { hz: '绩效奖金', py: 'jìxiào jiǎngjīn', m: 'thưởng hiệu suất KPI', hsk: 'HSK 5' }],
    g: [{ t: 'Đãi ngộ tiêu chuẩn Trung Quốc: 五险一金', s: '五险一金 (5 bảo hiểm + 1 quỹ nhà ở)', e: 'Bảo hiểm dưỡng lão, y tế, thất nghiệp, tai nạn, thai sản và quỹ nhà.' }],
    q: [{ q: 'Công ty áp dụng chế độ trả lương bao nhiêu tháng mỗi năm?', options: ['12 tháng', '13 tháng', '14 tháng (14薪)', '16 tháng'], a: 2, exp: 'HR nói: "提供14薪制".' }],
    sp: { hz: '这个薪资福利方案符合我的职业预期。', py: 'Zhège xīnzī fúlì fāng’àn fúhé wǒ de zhíyè yùqī.', vi: 'Gói chế độ đãi ngộ này phù hợp với kỳ vọng nghề nghiệp của tôi.' }
  },
  {
    num: 90, top: 9, lvl: 'HSK 3', title: 'Lên kế hoạch cho dự án', hz: '制定项目甘特图排期', py: 'Zhìdìng xiàngmù Gāntètú páiqī',
    sit: 'Quang và đội ngũ quản lý họp khởi động dự án triển khai hệ thống ERP mới.',
    c: [{ n: 'Hồng Quang', r: 'Project Director', g: 'male', a: '👨‍💼' }, { n: 'Thư ký dự án', r: 'Project Coordinator', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '大家请核对一下新项目的甘特图排期。整个项目周期设定为半年，分为四个关键里程碑。', py: 'Dàjiā qǐng héduì yíxià xīn xiàngmù de Gāntètú páiqī. Zhěnggè xiàngmù zhōuqī shèdìng wéi bàn nián, fēn wéi sì gè guānjiàn lǐchéngbēi.', vi: 'Mọi người kiểm tra lại tiến độ biểu đồ Gantt của dự án mới. Toàn bộ chu kỳ dự án ấn định 6 tháng, chia làm 4 cột mốc quan trọng.' },
      { s: 'Thư ký dự án', g: 'female', hz: '洪总，第一阶段的需求调研和架构设计，各部门的对接人员已经全部锁定到位。', py: 'Hóng zǒng, dì-yī jiēduàn de xūqiú diàoyán hé jiàgòu shèjì, gè bùmén de duìjiē rényuán yǐjīng quánbù suǒdìng dàowèi.', vi: 'Thưa anh Quang, giai đoạn 1 khảo sát nhu cầu và thiết kế kiến trúc, nhân sự đầu mối các phòng ban đã chốt xong đầy đủ.' },
      { s: 'Hồng Quang', g: 'male', hz: '非常好。设立严格的风控机制，每周五下午召开站会同步进度，识别潜在延期风险。', py: 'Fēicháng hǎo. Shèlì yángé de fēngkòng jīzhì, měi zhōuwǔ xiàwǔ zhàokāi zhànhuì tóngbù jìndù, shíbié qiánzài yánqī fēngxiǎn.', vi: 'Rất tốt. Thiết lập cơ chế kiểm soát rủi ro nghiêm ngặt, chiều thứ Sáu hàng tuần họp đứng ngắn đồng bộ tiến độ, nhận diện rủi ro chậm trễ tiềm ẩn.' },
      { s: 'Thư ký dự án', g: 'female', hz: '收到！会议纪要和任务看板会在今天下班前同步给所有人！', py: 'Shōudào! Huìyì jìyào hé rènwù kànbǎn huì zài jīntiān xiàbān qián tóngbù gěi suǒyǒu rén!', vi: 'Rõ ạ! Biên bản cuộc họp và bảng công việc Kanban sẽ được gửi đồng bộ cho mọi người trước giờ tan sở hôm nay!' }
    ],
    v: [{ hz: '甘特图', py: 'Gāntètú', m: 'biểu đồ Gantt quản lý tiến độ', hsk: 'HSK 5' }, { hz: '里程碑', py: 'lǐchéngbēi', m: 'cột mốc quan trọng (milestone)', hsk: 'HSK 5' }, { hz: '风控', py: 'fēngkòng', m: 'quản trị kiểm soát rủi ro', hsk: 'HSK 5' }, { hz: '会议纪要', py: 'huìyì jìyào', m: 'biên bản cuộc họp', hsk: 'HSK 4' }],
    g: [{ t: 'Chu kỳ thời gian: 设定为... (Shèdìng wéi...)', s: '周期 / 预算 + 设定为 + Số lượng', e: '周期设定为半年 (Chu kỳ được ấn định là nửa năm).' }],
    q: [{ q: 'Dự án mới được ấn định thực hiện trong chu kỳ bao lâu?', options: ['3 tháng', '6 tháng (半年)', '1 năm', '2 năm'], a: 1, exp: 'Quang tuyên bố: "整个项目周期设定为半年".' }],
    sp: { hz: '项目分为四个关键里程碑，必须严格按期推进。', py: 'Xiàngmù fēn wéi sì gè guānjiàn lǐchéngbēi, bìxū yángé ànqī tuījìn.', vi: 'Dự án chia làm 4 cột mốc cốt lõi, bắt buộc phải thúc đẩy đúng tiến độ.' }
  }
];
