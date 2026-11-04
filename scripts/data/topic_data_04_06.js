// Topic Data: Topics 4 - 6 (Lessons 31 - 60)
module.exports = [
  // ==================== TOPIC 4: ĂN UỐNG VÀ NHÀ HÀNG (31 - 40) ====================
  {
    num: 31, top: 4, lvl: 'HSK 2', title: 'Gọi món tại nhà hàng', hz: '在餐厅点餐', py: 'Zài cāntīng diǎncān',
    sit: 'Văn Minh và Tuấn đến một nhà hàng món Tứ Xuyên nổi tiếng để gọi món ăn tối.',
    c: [{ n: 'Văn Minh', r: 'Thực khách', g: 'male', a: '👦' }, { n: 'Phục vụ bàn', r: 'Nhân viên nhà hàng', g: 'female', a: '👩‍🍳' }],
    d: [
      { s: 'Phục vụ bàn', g: 'female', hz: '二位晚上好！请问想吃点儿什么？这是菜单。', py: 'Èr wèi wǎnshang hǎo! Qǐngwèn xiǎng chī diǎnr shénme? Zhè shì càidān.', vi: 'Chào hai vị buổi tối! Xin hỏi hai vị muốn dùng món gì ạ? Đây là thực đơn.' },
      { s: 'Văn Minh', g: 'male', hz: '服务员，请给我们来一份宫保鸡丁、一份水煮牛肉和两碗米饭。', py: 'Fúwùyuán, qǐng gěi wǒmen lái yí fèn Gōngbǎo Jīdīng, yí fèn Shuǐzhǔ Niúròu hé liǎng wǎn mǐfàn.', vi: 'Phục vụ ơi, cho chúng tôi một phần gà Cung Bảo, một phần thịt bò luộc cay Tứ Xuyên và hai bát cơm trắng.' },
      { s: 'Phục vụ bàn', g: 'female', hz: '好的，水煮牛肉口味比较辣，需要微辣还是正常辣？', py: 'Hǎo de, Shuǐzhǔ Niúròu kǒuwèi bǐjiào là, xūyào wēilà háishi zhèngcháng là?', vi: 'Vâng ạ, món bò cay khẩu vị khá cay, hai vị muốn cay nhẹ hay cay bình thường ạ?' },
      { s: 'Văn Minh', g: 'male', hz: '微辣就好，另外再加一扎冰镇酸梅汤，少放点糖。', py: 'Wēilà jiù hǎo, lìngwài zài jiā yì zhā bīngzhèn suānméitāng, shǎo fàng diǎnr táng.', vi: 'Cay nhẹ là được rồi, ngoài ra cho thêm một bình nước ô mai ướp lạnh, ít đường thôi nhé.' }
    ],
    v: [{ hz: '点餐', py: 'diǎncān', m: 'gọi món', hsk: 'HSK 2' }, { hz: '菜单', py: 'càidān', m: 'thực đơn', hsk: 'HSK 2' }, { hz: '微辣', py: 'wēilà', m: 'cay nhẹ', hsk: 'HSK 3' }, { hz: '冰镇', py: 'bīngzhèn', m: 'ướp lạnh', hsk: 'HSK 4' }],
    g: [{ t: 'Gọi món bằng từ: 来 (Lái)', s: '请给我们来 + [Lượng từ + Tên món]', e: 'Dùng "来" rất tự nhiên trong khẩu ngữ nhà hàng: 来一份, 来两瓶.' }],
    q: [{ q: 'Văn Minh yêu cầu mức độ cay của món thịt bò luộc là gì?', options: ['Không cay', 'Cay nhẹ (微辣)', 'Cay bình thường', 'Siêu cay'], a: 1, exp: 'Minh nói: "微辣就好" (cay nhẹ là được).' }],
    sp: { hz: '服务员，请给我们来一份宫保鸡丁。', py: 'Fúwùyuán, qǐng gěi wǒmen lái yí fèn Gōngbǎo Jīdīng.', vi: 'Phục vụ ơi, cho chúng tôi một phần gà Cung Bảo nhé.' }
  },
  {
    num: 32, top: 4, lvl: 'HSK 2', title: 'Đặt bàn trước tại nhà hàng', hz: '提前在餐厅订位', py: 'Tíqián zài cāntīng dìngwèi',
    sit: 'Trương Cường gọi điện thoại đến nhà hàng vịt quay Toàn Tụ Đức để đặt bàn tiệc sinh nhật.',
    c: [{ n: 'Trương Cường', r: 'Khách đặt bàn', g: 'male', a: '👨' }, { n: 'Tiếp tân', r: 'Lễ tân nhà hàng', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Tiếp tân', g: 'female', hz: '您好，全聚德烤鸭店，请问有什么可以帮您？', py: 'Nín hǎo, Quánjùdé kǎoyādiàn, qǐngwèn yǒu shénme kěyǐ bāng nín?', vi: 'Xin chào quý khách, nhà hàng vịt quay Toàn Tụ Đức, xin hỏi em có thể giúp gì cho quý khách ạ?' },
      { s: 'Trương Cường', g: 'male', hz: '你好，我想预订明天晚上六点半的一张六人桌。', py: 'Nǐ hǎo, wǒ xiǎng yùdìng míngtiān wǎnshang liù diǎn bàn de yì zhāng liù rén zhuō.', vi: 'Chào bạn, tôi muốn đặt một bàn 6 người lúc 6 rưỡi tối ngày mai.' },
      { s: 'Tiếp tân', g: 'female', hz: '好的，请问需要靠窗的安静位置还是包厢？', py: 'Hǎo de, qǐngwèn xūyào kàochuāng de ānjìng wèizhi háishi bāoxiāng?', vi: 'Vâng ạ, xin hỏi quý khách muốn vị trí yên tĩnh cạnh cửa sổ hay phòng riêng (bao厢) ạ?' },
      { s: 'Trương Cường', g: 'male', hz: '大厅靠窗位置就可以。我姓张，电话是138-0013-8000。', py: 'Dàtīng kàochuāng wèizhi jiù kěyǐ. Wǒ xìng Zhāng, diànhuà shì yāosānbā-línglíngyīsān-bālínglínglíng.', vi: 'Vị trí cạnh cửa sổ ngoài đại sảnh là được rồi. Tôi họ Trương, số điện thoại là 138-0013-8000.' }
    ],
    v: [{ hz: '订位', py: 'dìngwèi', m: 'đặt chỗ, đặt bàn', hsk: 'HSK 3' }, { hz: '靠窗', py: 'kàochuāng', m: 'cạnh cửa sổ', hsk: 'HSK 3' }, { hz: '包厢', py: 'bāoxiāng', m: 'phòng riêng (trong quán)', hsk: 'HSK 4' }],
    g: [{ t: 'Đọc số điện thoại: 一 đọc là yāo', s: 'Chữ số 1 trong số điện thoại/số phòng đọc là "yāo"', e: '138... đọc là yāo sān bā.' }],
    q: [{ q: 'Trương Cường đặt bàn cho bao nhiêu người?', options: ['4 người', '6 người', '8 người', '10 người'], a: 1, exp: 'Trương Cường nói: "一张六人桌" (1 bàn 6 người).' }],
    sp: { hz: '我想预订今晚六点半的一张四人桌。', py: 'Wǒ xiǎng yùdìng jīnwǎn liù diǎn bàn de yì zhāng sì rén zhuō.', vi: 'Tôi muốn đặt một bàn 4 người lúc 6 rưỡi tối nay.' }
  },
  {
    num: 33, top: 4, lvl: 'HSK 2', title: 'Hỏi về thực đơn', hz: '询问菜单与招牌菜', py: 'Xúnwèn càidān yǔ zhāopáicài',
    sit: 'Mai và Lan xem menu và hỏi người phục vụ về món đặc sản trứ danh của quán.',
    c: [{ n: 'Thanh Mai', r: 'Thực khách', g: 'female', a: '👧' }, { n: 'Phục vụ bàn', r: 'Nhân viên', g: 'male', a: '👨‍🍳' }],
    d: [
      { s: 'Thanh Mai', g: 'female', hz: '服务员，请问你们店里有什么招牌菜推荐吗？', py: 'Fúwùyuán, qǐngwèn nǐmen diàn lǐ yǒu shénme zhāopáicài tuījiàn ma?', vi: 'Phục vụ ơi, xin hỏi quán mình có món đặc sản trứ danh nào gợi ý không?' },
      { s: 'Phục vụ bàn', g: 'male', hz: '我们店最有名的就是西湖醋鱼和东坡肉，每天都很多顾客专程来吃。', py: 'Wǒmen diàn zuì yǒumíng de jiù shì Xīhú Cùyú hé Dōngpō Ròu, měitiān dōu hěn duō gùkè zhuānchéng lái chī.', vi: 'Quán em nổi tiếng nhất là cá giấm Tây Hồ và thịt kho Đông Pha, ngày nào cũng có nhiều khách lặn lội đến ăn.' },
      { s: 'Thanh Mai', g: 'female', hz: '这两道菜口味偏甜还是偏咸？', py: 'Zhè liǎng dào cài kǒuwèi piān tián háishi piān xián?', vi: 'Hai món này khẩu vị thiên về ngọt hay thiên về mặn vậy anh?' },
      { s: 'Phục vụ bàn', g: 'male', hz: '西湖醋鱼酸甜爽口，东坡肉肥而不腻，非常下饭！', py: 'Xīhú Cùyú suāntián shuǎngkǒu, Dōngpō Ròu féi ér bú nì, fēicháng xiàfàn!', vi: 'Cá giấm Tây Hồ chua ngọt thanh mát, thịt Đông Pha béo mà không ngấy, cực kỳ tốn cơm ạ!' }
    ],
    v: [{ hz: '招牌菜', py: 'zhāopáicài', m: 'món đặc sản, món tủ của quán', hsk: 'HSK 4' }, { hz: '肥而不腻', py: 'féi ér bú nì', m: 'béo ngậy mà không ngấy', hsk: 'HSK 5' }, { hz: '爽口', py: 'shuǎngkǒu', m: 'thanh mát dễ chịu', hsk: 'HSK 4' }, { hz: '下饭', py: 'xiàfàn', m: 'đưa cơm, tốn cơm', hsk: 'HSK 3' }],
    g: [{ t: 'Khẩu vị thiên về: 口味偏... (Kǒuwèi piān...)', s: '口味 + 偏 + [甜/咸/辣/酸]', e: 'Khẩu vị thiên về ngọt: 偏甜, thiên về cay: 偏辣.' }],
    q: [{ q: 'Hai món đặc sản nổi tiếng nhất của quán là gì?', options: ['Vịt quay và sủi cảo', 'Cá giấm Tây Hồ và thịt kho Đông Pha', 'Gà cay và cơm chiên', 'Lẩu bò'], a: 1, exp: 'Nhân viên giới thiệu Xīhú Cùyú và Dōngpō Ròu.' }],
    sp: { hz: '请问你们店有什么特色菜或者招牌菜？', py: 'Qǐngwèn nǐmen diàn yǒu shénme tèsè cài huòzhě zhāopáicài?', vi: 'Xin hỏi quán mình có món đặc sản hay món tủ nào?' }
  },
  {
    num: 34, top: 4, lvl: 'HSK 2', title: 'Gọi đồ uống tại quán cà phê', hz: '在咖啡厅点饮品', py: 'Zài kāfēitīng diǎn yǐnpǐn',
    sit: 'Hải vào tiệm cà phê Starluck ở trung tâm thương mại gọi cà phê và bánh ngọt.',
    c: [{ n: 'Quang Hải', r: 'Khách hàng', g: 'male', a: '👦' }, { n: 'Thu ngân', r: 'Nhân viên pha chế', g: 'female', a: '👩' }],
    d: [
      { s: 'Thu ngân', g: 'female', hz: '您好！欢迎光临，请问喝点儿什么？', py: 'Nín hǎo! Huānyíng guānglín, qǐngwèn hē diǎnr shénme?', vi: 'Xin chào quý khách! Hoan nghênh ghé quán, xin hỏi quý khách muốn uống gì ạ?' },
      { s: 'Quang Hải', g: 'male', hz: '请给我一杯大杯冰美式咖啡，去冰，不加糖。', py: 'Qǐng gěi wǒ yì bēi dà bēi bīng Měishì kāfēi, qù bīng, bù jiā táng.', vi: 'Cho tôi một ly cà phê Americano đá size lớn, không đá, không đường nhé.' },
      { s: 'Thu ngân', g: 'female', hz: '好的。请问在店里喝还是带走？要不要搭配一块提拉米苏蛋糕？', py: 'Hǎo de. Qǐngwèn zài diàn lǐ hē háishi dài zǒu? Yào bu yào dāpèi yí kuài tílāmǐsū dàngāo?', vi: 'Vâng ạ. Quý khách uống tại quán hay mang đi ạ? Quý khách có muốn dùng kèm một lát bánh Tiramisu không ạ?' },
      { s: 'Quang Hải', g: 'male', hz: '在这里喝。好啊，再来一块提拉米苏，一起结账吧。', py: 'Zài zhèlǐ hē. Hǎo a, zài lái yí kuài tílāmǐsū, yìqǐ jiézhàng ba.', vi: 'Tôi uống tại quán. Được đấy, cho thêm một lát Tiramisu nữa, thanh toán chung luôn nhé.' }
    ],
    v: [{ hz: '冰美式', py: 'bīng Měishì', m: 'Americano đá', hsk: 'HSK 3' }, { hz: '去冰', py: 'qù bīng', m: 'bỏ đá, không lấy đá', hsk: 'HSK 3' }, { hz: '带走', py: 'dài zǒu', m: 'mang đi (takeaway)', hsk: 'HSK 2' }, { hz: '结账', py: 'jiézhàng', m: 'thanh toán, tính tiền', hsk: 'HSK 3' }],
    g: [{ t: 'Cụm từ yêu cầu đồ uống: 去冰 / 少糖', s: '去冰 (không đá), 少冰 (ít đá), 半糖 (50% đường), 无糖 (không đường)', e: 'Khẩu ngữ gọi trà sữa và cà phê chuẩn.' }],
    q: [{ q: 'Quang Hải gọi món bánh ngọt nào dùng kèm?', options: ['Bánh phô mai', 'Bánh Tiramisu', 'Bánh matcha', 'Bánh chocolate'], a: 1, exp: 'Hải gọi thêm 一块提拉米苏 (bánh Tiramisu).' }],
    sp: { hz: '我要一杯大杯拿铁，去冰，半糖。', py: 'Wǒ yào yì bēi dà bēi nátiě, qù bīng, bàn táng.', vi: 'Cho tôi một ly latte lớn, không đá, nửa đường.' }
  },
  {
    num: 35, top: 4, lvl: 'HSK 2', title: 'Yêu cầu thanh toán hóa đơn', hz: '买单与结账', py: 'Mǎidān yǔ jiézhàng',
    sit: 'Tuấn và bạn ăn xong, vẫy nhân viên phục vụ để thanh toán tiền bữa ăn.',
    c: [{ n: 'Anh Tuấn', r: 'Khách hàng', g: 'male', a: '👱‍♂️' }, { n: 'Phục vụ bàn', r: 'Nhân viên', g: 'male', a: '👨‍🍳' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '服务员，买单！请问我们这桌一共多少钱？', py: 'Fúwùyuán, mǎidān! Qǐngwèn wǒmen zhè zhuō yígòng duōshao qián?', vi: 'Phục vụ ơi, tính tiền! Xin hỏi bàn chúng tôi tổng cộng bao nhiêu tiền thế?' },
      { s: 'Phục vụ bàn', g: 'male', hz: '二位请稍等，我帮您核对一下账单。一共是一百八十八元。', py: 'Èr wèi qǐng shāoděng, wǒ bāng nín héduì yíxià zhàngdān. Yígòng shì yìbǎi bāshíbā yuán.', vi: 'Hai vị đợi một lát, em đối chiếu lại hóa đơn. Tổng cộng là 188 tệ ạ.' },
      { s: 'Anh Tuấn', g: 'male', hz: '可以扫微信或者支付宝支付吗？开发票吗？', py: 'Kěyǐ sǎo Wēixìn huòzhě Zhīfùbǎo zhīfù ma? Kāi fāpiào ma?', vi: 'Có quét mã WeChat hoặc Alipay thanh toán được không? Có xuất hóa đơn không bạn?' },
      { s: 'Phục vụ bàn', g: 'male', hz: '可以的，桌角有收款码。扫码后在小程序里填写抬头即可开具电子发票。', py: 'Kěyǐ de, zhuōjiǎo yǒu shōukuǎnmǎ. Sǎo mǎ hòu zài xiǎochéngxù lǐ tiánxiě táitóu jíkě kāijù diànzǐ fāpiào.', vi: 'Được chứ ạ, góc bàn có mã nhận tiền. Quét mã xong quý khách điền thông tin trên app nhỏ là xuất hóa đơn điện tử được ngay.' }
    ],
    v: [{ hz: '买单', py: 'mǎidān', m: 'thanh toán, tính tiền', hsk: 'HSK 3' }, { hz: '核对', py: 'héduì', m: 'đối chiếu, kiểm tra lại', hsk: 'HSK 4' }, { hz: '发票', py: 'fāpiào', m: 'hóa đơn VAT', hsk: 'HSK 3' }, { hz: '收款码', py: 'shōukuǎnmǎ', m: 'mã QR nhận tiền', hsk: 'HSK 3' }],
    g: [{ t: 'Hành động thanh toán: 买单 / 结账', s: '服务员，买单！(Khẩu ngữ miền Nam & miền Bắc)', e: '买单 và 结账 đều dùng thanh toán tiền ăn.' }],
    q: [{ q: 'Tổng hóa đơn bàn của Tuấn là bao nhiêu tiền?', options: ['128 tệ', '158 tệ', '188 tệ', '208 tệ'], a: 2, exp: 'Nhân viên nói: "一共是一百八十八元" (188 tệ).' }],
    sp: { hz: '服务员买单，请问支持微信支付吗？', py: 'Fúwùyuán mǎidān, qǐngwèn zhīchí Wēixìn zhīfù ma?', vi: 'Phục vụ ơi tính tiền, cho hỏi có hỗ trợ thanh toán WeChat không?' }
  },
  {
    num: 36, top: 4, lvl: 'HSK 2', title: 'Phàn nàn về chất lượng món ăn', hz: '投诉菜品质量', py: 'Tóusù càipǐn zhìliàng',
    sit: 'Khách phát hiện món súp bị nguội và mặn quá mức nên gọi quản lý phản ánh.',
    c: [{ n: 'Khách hàng', r: 'Văn Minh', g: 'male', a: '👨' }, { n: 'Quản lý', r: 'Trưởng ca nhà hàng', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Khách hàng', g: 'male', hz: '服务员，请叫一下你们经理，这道牛肉汤有问题。', py: 'Fúwùyuán, qǐng jiào yíxià nǐmen jīnglǐ, zhè dào niúròutāng yǒu wèntí.', vi: 'Phục vụ ơi, gọi giúp tôi quản lý, món súp bò này có vấn đề.' },
      { s: 'Quản lý', g: 'female', hz: '先生您好，我是餐厅主管。请问这道汤怎么了？', py: 'Xiānsheng nín hǎo, wǒ shì cāntīng zhǔguǎn. Qǐngwèn zhè dào tāng zěnme le?', vi: 'Chào anh, tôi là quản lý ca. Xin hỏi món súp này bị làm sao ạ?' },
      { s: 'Khách hàng', g: 'male', hz: '汤端上来的时候已经完全凉了，而且咸得根本无法下咽。', py: 'Tāng duān shànglai de shíhou yǐjīng wánquán liáng le, érqiě xián de gēnběn wúfǎ xiàyàn.', vi: 'Súp bê lên thì đã nguội ngắt rồi, hơn nữa mặn đến mức không thể nào nuốt nổi.' },
      { s: 'Quản lý', g: 'female', hz: '实在非常抱歉！后厨确实疏忽了。我马上让主厨给您重做一份热的，这道菜给您免单！', py: 'Shízài fēicháng bàoqiàn! Hòuchú quèshí shūhu le. Wǒ mǎshàng ràng zhǔchú gěi nín chóng zuò yí fèn rè de, zhè dào cài gěi nín miǎndān!', vi: 'Vô cùng xin lỗi quý khách! Nhà bếp quả thật đã sơ suất. Em sẽ bảo bếp trưởng làm lại ngay phần nóng hổi, món này xin miễn phí cho quý khách ạ!' }
    ],
    v: [{ hz: '投诉', py: 'tóusù', m: 'khiếu nại, phản ánh', hsk: 'HSK 4' }, { hz: '下咽', py: 'xiàyàn', m: 'nuốt xuống cổ họng', hsk: 'HSK 5' }, { hz: '疏忽', py: 'shūhu', m: 'sơ suất', hsk: 'HSK 5' }, { hz: '免单', py: 'miǎndān', m: 'miễn phí thanh toán', hsk: 'HSK 4' }],
    g: [{ t: 'Mức độ không thể chịu đựng: 咸得根本无法...', s: 'Tính từ + 得 + 根本无法 + Động từ', e: 'Mặn đến mức根本无法下咽 (không nuốt nổi).' }],
    q: [{ q: 'Quản lý đã giải quyết phàn nàn của khách như thế nào?', options: ['Từ chối giải quyết', 'Bảo bếp làm lại phần nóng và miễn phí món đó', 'Bảo khách tự thêm nước', 'Đuổi khách ra ngoài'], a: 1, exp: 'Quản lý cho làm lại và miễn phí (免单).' }],
    sp: { hz: '这道菜有点凉了，请帮我热一下。', py: 'Zhè dào cài yǒudiǎnr liáng le, qǐng bāng wǒ rè yíxià.', vi: 'Món này hơi nguội rồi, hâm nóng lại giúp tôi với.' }
  },
  {
    num: 37, top: 4, lvl: 'HSK 2', title: 'Hỏi về thành phần món ăn', hz: '询问菜品成分', py: 'Xúnwèn càipǐn chéngfèn',
    sit: 'An bị dị ứng với lạc (đậu phộng) nên cẩn thận hỏi nhân viên trước khi gọi món.',
    c: [{ n: 'Thúy An', r: 'Khách bị dị ứng', g: 'female', a: '👧' }, { n: 'Đầu bếp/Phục vụ', r: 'Nhân viên quán', g: 'male', a: '👨‍🍳' }],
    d: [
      { s: 'Thúy An', g: 'female', hz: '你好！请问这道沙拉里面含有花生或者坚果成分吗？', py: 'Nǐ hǎo! Qǐngwèn zhè dào shālā lǐmiàn hányǒu huāshēng huòzhě jiānguǒ chéngfèn ma?', vi: 'Chào anh! Xin hỏi món salad này bên trong có chứa lạc hay thành phần hạt không?' },
      { s: 'Đầu bếp/Phục vụ', g: 'male', hz: '原本的酱汁里放了碎花生。请问您是对花生过敏吗？', py: 'Yuánběn de jiàngzhī lǐ fàng le suì huāshēng. Qǐngwèn nín shì duì huāshēng guòmǐn ma?', vi: 'Nước sốt nguyên bản có bỏ lạc vụn. Xin hỏi có phải quý khách bị dị ứng với lạc không ạ?' },
      { s: 'Thúy An', g: 'female', hz: '对，我花生过敏非常严重，一点儿都不能吃。', py: 'Duì, wǒ huāshēng guòmǐn fēicháng yánzhòng, yìdiǎnr dōu bù néng chī.', vi: 'Đúng vậy, tôi bị dị ứng lạc rất nghiêm trọng, một chút xíu cũng không ăn được.' },
      { s: 'Đầu bếp/Phục vụ', g: 'male', hz: '明白了！我交代后厨专门为您用橄榄油和醋调一份无坚果酱汁，砧板也会彻底清洗。', py: 'Míngbai le! Wǒ jiāodài hòuchú zhuānmén wèi nín yòng gǎnlǎnyóu hé cù tiáo yí fèn wú jiānguǒ jiàngzhī, zhēnbǎn yě huì chèdǐ qīngxǐ.', vi: 'Em hiểu rồi! Em sẽ dặn nhà bếp pha riêng cho chị sốt dầu ô liu và giấm không có hạt, thớt cũng sẽ rửa sạch kỹ lưỡng ạ.' }
    ],
    v: [{ hz: '成分', py: 'chéngfèn', m: 'thành phần', hsk: 'HSK 4' }, { hz: '花生', py: 'huāshēng', m: 'củ lạc, đậu phộng', hsk: 'HSK 3' }, { hz: '过敏', py: 'guòmǐn', m: 'dị ứng', hsk: 'HSK 4' }, { hz: '严重', py: 'yánzhòng', m: 'nghiêm trọng', hsk: 'HSK 3' }],
    g: [{ t: 'Cấu trúc dị ứng với chất gì: 对...过敏 (Duì... guòmǐn)', s: 'Chủ ngữ + 对 + [Thực phẩm/Chất] + 过敏', e: 'Tôi bị dị ứng với hải sản: 我对海鲜过敏.' }],
    q: [{ q: 'Thúy An bị dị ứng nghiêm trọng với thứ gì?', options: ['Hải sản', 'Lạc (đậu phộng)', 'Sữa bò', 'Trứng gà'], a: 1, exp: 'An nói: "我花生过敏非常严重".' }],
    sp: { hz: '我对花生过敏，请不要放坚果。', py: 'Wǒ duì huāshēng guòmǐn, qǐng bú yào fàng jiānguǒ.', vi: 'Tôi bị dị ứng lạc, xin đừng bỏ các loại hạt.' }
  },
  {
    num: 38, top: 4, lvl: 'HSK 2', title: 'Đặt đồ ăn mang về', hz: '餐厅打包与外带', py: 'Cāntīng dǎbāo yǔ wàidài',
    sit: 'Lâm Phong vào tiệm mì sủi cảo mua phần ăn mang về nhà thưởng thức.',
    c: [{ n: 'Lâm Phong', r: 'Khách mua mang về', g: 'male', a: '👨' }, { n: 'Chủ quán', r: 'Chủ tiệm', g: 'female', a: '👩‍🍳' }],
    d: [
      { s: 'Lâm Phong', g: 'male', hz: '老板娘，来一份牛肉刀削面和十个猪肉大葱水饺，打包带走！', py: 'Lǎobǎnniáng, lái yí fèn niúròu dāoxiāomiàn hé shí gè zhūròu dàcōng shuǐjiǎo, dǎbāo dài zǒu!', vi: 'Bà chủ ơi, cho một phần mì gọt thịt bò và mười chiếc sủi cảo nhân thịt heo hành boa-rô, đóng hộp mang về nhé!' },
      { s: 'Chủ quán', g: 'female', hz: '好嘞！面条需要把汤和面分开放吗？分开装面条不会泡软。', py: 'Hǎo lei! Miàntiáo xūyào bǎ tāng hé miàn fēnkāi fàng ma? Fēnkāi zhuāng miàntiáo bú huì pào ruǎn.', vi: 'Có ngay đây! Mì có cần để nước dùng và sợi mì riêng ra không? Đóng hộp riêng sợi mì sẽ không bị trương nhũn.' },
      { s: 'Lâm Phong', g: 'male', hz: '太贴心了，请分开放！多放点香菜和辣椒油，再带两双一次性筷子。', py: 'Tài tiēxīn le, qǐng fēnkāi fàng! Duō fàng diǎnr xiāngcài hé làjiāoyóu, zài dài liǎng shuāng yícìxìng kuàizi.', vi: 'Chu đáo quá, để riêng giúp tôi nhé! Cho nhiều rau mùi và ớt chưng một chút, lấy thêm hai đôi đũa dùng một lần.' },
      { s: 'Chủ quán', g: 'female', hz: '没问题，打包好了！您拿好，一共三十五块钱。', py: 'Méi wèntí, dǎbāo hǎo le! Nín ná hǎo, yígòng sānshíwǔ kuài qián.', vi: 'Xong rồi đây ạ! Đã đóng gói xong, quý khách cầm chắc nhé, tổng cộng 35 tệ.' }
    ],
    v: [{ hz: '打包', py: 'dǎbāo', m: 'đóng hộp mang về, gói đồ ăn', hsk: 'HSK 3' }, { hz: '分开放', py: 'fēnkāi fàng', m: 'để riêng ra', hsk: 'HSK 3' }, { hz: '香菜', py: 'xiāngcài', m: 'rau mùi (ngò rí)', hsk: 'HSK 3' }, { hz: '一次性筷子', py: 'yícìxìng kuàizi', m: 'đũa dùng một lần', hsk: 'HSK 4' }],
    g: [{ t: 'Cấu trúc câu chữ Ba (把): 把...分开 (Bǎ... fēnkāi)', s: '把 + Đối tượng + 分开 + Động từ', e: '把汤和面分开放 (Để nước dùng và mì riêng).' }],
    q: [{ q: 'Bà chủ đề nghị đóng gói mì như thế nào để mì không bị nát nhũn?', options: ['Cho nhiều nước đá', 'Để nước dùng và mì riêng (分开放)', 'Không bỏ gia vị', 'Bỏ hộp xốp'], a: 1, exp: 'Bà chủ nói: 把汤和面分开放就不会泡软.' }],
    sp: { hz: '我要一份炒饭，打包带走，谢谢！', py: 'Wǒ yào yí fèn chǎofàn, dǎbāo dài zǒu, xièxie!', vi: 'Cho tôi một phần cơm rang, đóng hộp mang về, cảm ơn!' }
  },
  {
    num: 39, top: 4, lvl: 'HSK 2', title: 'Gọi đồ ăn trực tuyến', hz: '在手机上点外卖', py: 'Zài shǒujī shang diǎn wàimài',
    sit: 'Trang hướng dẫn An cách dùng app Meituan để đặt đồ ăn online ship tận phòng.',
    c: [{ n: 'Huyền Trang', r: 'Người hướng dẫn', g: 'female', a: '👩' }, { n: 'Thúy An', r: 'Người mới học dùng app', g: 'female', a: '👧' }],
    d: [
      { s: 'Thúy An', g: 'female', hz: '玄庄，外面下暴雨，用什么手机软件叫外卖最方便？', py: 'Xuán Zhuāng, wàimiàn xià bàoyǔ, yòng shénme shǒujī ruǎnjiàn jiào wàimài zuì fāngbiàn?', vi: 'Huyền Trang ơi, bên ngoài đang mưa to quá, dùng app điện thoại nào đặt đồ ăn ship tiện nhất?' },
      { s: 'Huyền Trang', g: 'female', hz: '用美团或者饿了么都很方便！你先选好想吃的店铺，放进购物车。', py: 'Yòng Měituán huòzhě Èleme dōu hěn fāngbiàn! Nǐ xiān xuǎn hǎo xiǎng chī de diànpù, fàng jìn gòuwùchē.', vi: 'Dùng Meituan hoặc Eleme đều tiện lắm! Cậu chọn quán muốn ăn trước rồi cho vào giỏ hàng.' },
      { s: 'Thúy An', g: 'female', hz: '配送地址我已经填好了，需要给外卖小哥备注什么吗？', py: 'Pèisòng dìzhǐ wǒ yǐjīng tián hǎo le, xūyào gěi wàimài xiǎogē bèizhù shénme ma?', vi: 'Địa chỉ giao hàng mình điền xong rồi, có cần ghi chú gì cho anh shipper không?' },
      { s: 'Huyền Trang', g: 'female', hz: '你可以备注“放在宿舍楼下无接触外卖柜”，骑手送达时会发短信提醒你。', py: 'Nǐ kěyǐ bèizhù “fàng zài sùshè lóuxià wú jiēchù wàimàiguì”, qíshǒu sòngdá shí huì fā duǎnxìn tíxǐng nǐ.', vi: 'Cậu có thể ghi chú "Để tại tủ đồ ăn không tiếp xúc dưới chân ký túc xá", lúc shipper giao tới sẽ gửi tin nhắn báo.' }
    ],
    v: [{ hz: '外卖', py: 'wàimài', m: 'đồ ăn giao hàng tận nơi (takeout/delivery)', hsk: 'HSK 3' }, { hz: '购物车', py: 'gòuwùchē', m: 'giỏ hàng online', hsk: 'HSK 3' }, { hz: '骑手/小哥', py: 'qíshǒu/xiǎogē', m: 'anh tài xế shipper', hsk: 'HSK 4' }, { hz: '送达', py: 'sòngdá', m: 'giao đến nơi', hsk: 'HSK 4' }],
    g: [{ t: 'Thời điểm xảy ra: ...的时候 / 时 (Shí)', s: 'Hành động + 时 / 的时候', e: '骑手送达时 (Lúc shipper giao tới).' }],
    q: [{ q: 'Trang khuyên ghi chú shipper để đồ ăn ở đâu?', options: ['Trước cửa phòng', 'Tủ nhận đồ ăn dưới chân ký túc xá', 'Nhà xe', 'Bàn bảo vệ'], a: 1, exp: 'Trang khuyên ghi: "放在宿舍楼下外卖柜".' }],
    sp: { hz: '请把外卖放在门口，谢谢外卖小哥！', py: 'Qǐng bǎ wàimài fàng zài ménkǒu, xièxie wàimài xiǎogē!', vi: 'Xin để đồ ăn ở trước cửa, cảm ơn anh shipper!' }
  },
  {
    num: 40, top: 4, lvl: 'HSK 2', title: 'Nói về món ăn yêu thích', hz: '聊聊最爱的中国美食', py: 'Liáoliao zuì ài de Zhōngguó měishí',
    sit: 'Vương Vĩ và Minh trao đổi về những món ẩm thực Trung Quốc khiến mình mê mẩn.',
    c: [{ n: 'Vương Vĩ', r: 'Bạn Trung Quốc', g: 'male', a: '👨' }, { n: 'Văn Minh', r: 'Du học sinh mê ẩm thực', g: 'male', a: '👦' }],
    d: [
      { s: 'Vương Vĩ', g: 'male', hz: '阿明，来中国这一年，你最喜欢的中国菜是什么？', py: 'Ā Míng, lái Zhōngguó zhè yì nián, nǐ zuì xǐhuan de Zhōngguó cài shì shénme?', vi: 'A Minh, sang Trung Quốc một năm nay, món ăn Trung Quốc cậu thích nhất là món nào?' },
      { s: 'Văn Minh', g: 'male', hz: '如果只能选一样，那我绝对投麻辣火锅一票！尤其是毛肚和鸭血，鲜香麻辣太上瘾了！', py: 'Rúguǒ zhǐ néng xuǎn yí yàng, nà wǒ juéduì tóu málà huǒguō yí piào! Yóuqí shì máodù hé yāxuě, xiān xiāng má là tài shàngyǐn le!', vi: 'Nếu chỉ được chọn một món thì mình tuyệt đối bỏ phiếu cho lẩu cay tê Tứ Xuyên! Nhất là sách bò và tiết vịt, tươi thơm cay tê mê mẩn luôn!' },
      { s: 'Vương Vĩ', g: 'male', hz: '哈哈，看来你已经是个地道的“中国胃”了！北方菜有喜欢的吗？', py: 'Hāhā, kànlai nǐ yǐjīng shì gè dìdào de “Zhōngguó wèi” le! Běifāng cài yǒu xǐhuan de ma?', vi: 'Haha, xem ra cậu đã có một "chiếc dạ dày Trung Hoa" chính hiệu rồi! Món miền Bắc cậu thích món nào?' },
      { s: 'Văn Minh', g: 'male', hz: '北方的锅包肉和北京烤鸭也是我的心头好，酸甜酥脆，百吃不厌。', py: 'Běifāng de guōbāoròu hé Běijīng kǎoyā yě shì wǒ de xīntóuhǎo, suāntián sūcuì, bǎi chī bú yàn.', vi: 'Thịt heo chua ngọt Quách Bao Nhục và vịt quay Bắc Kinh cũng là món khoái khẩu của mình, chua ngọt giòn rụm, ăn trăm lần không chán.' }
    ],
    v: [{ hz: '上瘾', py: 'shàngyǐn', m: 'mê mẩn, gây nghiện', hsk: 'HSK 4' }, { hz: '中国胃', py: 'Zhōngguó wèi', m: 'dạ dày ăn quen đồ Trung Quốc', hsk: 'HSK 4' }, { hz: '百吃不厌', py: 'bǎi chī bú yàn', m: 'ăn mãi không chán', hsk: 'HSK 5' }, { hz: '酥脆', py: 'sūcuì', m: 'giòn rụm', hsk: 'HSK 4' }],
    g: [{ t: 'Thành ngữ ẩm thực: 百吃不厌 (Ăn mãi không chán)', s: '百 + Động từ + 不 + Động từ tâm lý (厌/烦)', e: '百看不同, 百读不厌, 百吃不厌.' }],
    q: [{ q: 'Món ăn số 1 mà Minh thích nhất tại Trung Quốc là gì?', options: ['Vịt quay', 'Lẩu cay tê (麻辣火锅)', 'Bánh bao', 'Mì xào'], a: 1, exp: 'Minh nói bỏ phiếu cho 麻辣火锅 (lẩu cay tê).' }],
    sp: { hz: '火锅是我最喜欢的中国美食，百吃不厌！', py: 'Huǒguō shì wǒ zuì xǐhuan de Zhōngguó měishí, bǎi chī bú yàn!', vi: 'Lẩu là món ẩm thực Trung Quốc tôi thích nhất, ăn mãi không chán!' }
  },

  // ==================== TOPIC 5: MUA SẮM (41 - 50) ====================
  {
    num: 41, top: 5, lvl: 'HSK 2', title: 'Mua quần áo', hz: '在商场买衣服', py: 'Zài shāngchǎng mǎi yīfu',
    sit: 'Mai đi dạo trung tâm thương mại chọn mua áo khoác mùa đông.',
    c: [{ n: 'Thanh Mai', r: 'Khách mua', g: 'female', a: '👧' }, { n: 'Nhân viên bán hàng', r: 'Nhân viên shop', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Nhân viên bán hàng', g: 'female', hz: '美女好！看看这款今年最新款的羊毛大衣，版型特别好。', py: 'Měinǚ hǎo! Kànkan zhè kuǎn jīnnián zuìxīn kuǎn de yángmáo dàyī, bǎnxíng tèbié hǎo.', vi: 'Chào người đẹp! Xem thử mẫu áo khoác dạ cừu mới nhất năm nay đi em, phom dáng đẹp lắm.' },
      { s: 'Thanh Mai', g: 'female', hz: '面料摸起来挺舒服的。请问这款除了米色，还有别的颜色吗？', py: 'Miànliào mō qǐlai tǐng shūfu de. Qǐngwèn zhè kuǎn chúle mǐsè, hái yǒu bié de yánsè ma?', vi: 'Chất vải sờ vào thấy rất êm tay. Cho em hỏi mẫu này ngoài màu be ra thì còn màu khác không chị?' },
      { s: 'Nhân viên bán hàng', g: 'female', hz: '还有经典黑色和焦糖色。焦糖色很显皮肤白，你要不要试试？', py: 'Hái yǒu jīngdiǎn hēisè hé jiāotángsè. Jiāotángsè hěn xiǎn pífū bái, nǐ yào bu yào shìshi?', vi: 'Còn màu đen kinh điển và màu caramel nữa em. Màu caramel tôn da trắng lắm, em có muốn mặc thử không?' },
      { s: 'Thanh Mai', g: 'female', hz: '好啊，请帮我拿一件M号的焦糖色，我去试衣间试穿一下。', py: 'Hǎo a, qǐng bāng wǒ ná yí jiàn M hào de jiāotángsè, wǒ qù shìyījiān shìchuān yíxià.', vi: 'Vâng ạ, lấy giúp em một chiếc size M màu caramel nhé, em vào phòng thử đồ mặc thử chút.' }
    ],
    v: [{ hz: '羊毛大衣', py: 'yángmáo dàyī', m: 'áo khoác dạ lông cừu', hsk: 'HSK 3' }, { hz: '版型', py: 'bǎnxíng', m: 'phom dáng quần áo', hsk: 'HSK 4' }, { hz: '显白', py: 'xiǎn bái', m: 'tôn da trắng', hsk: 'HSK 4' }, { hz: '试衣间', py: 'shìyījiān', m: 'phòng thử đồ', hsk: 'HSK 3' }],
    g: [{ t: 'Cấu trúc ngoài ra còn: 除了...还... (Chúle... hái...)', s: '除了 + Đối tượng 1, 还 + Đối tượng 2', e: '除了米色，还有黑色和焦糖色 (Ngoài màu be còn có màu đen và caramel).' }],
    q: [{ q: 'Thanh Mai muốn thử chiếc áo khoác màu gì và size mấy?', options: ['Màu be size S', 'Màu caramel size M', 'Màu đen size L', 'Màu đỏ size M'], a: 1, exp: 'Mai nói: "拿一件M号的焦糖色" (size M màu caramel).' }],
    sp: { hz: '这件衣服版型很好，请问有试衣间吗？', py: 'Zhè jiàn yīfu bǎnxíng hěn hǎo, qǐngwèn yǒu shìyījiān ma?', vi: 'Chiếc áo này phom rất đẹp, xin hỏi có phòng thử đồ không?' }
  },
  {
    num: 42, top: 5, lvl: 'HSK 2', title: 'Hỏi giá sản phẩm', hz: '询问商品价格', py: 'Xúnwèn shāngpǐn jiàgé',
    sit: 'Tuấn ở chợ đồ lưu niệm hỏi giá chiếc ấm trà tử sa thủ công.',
    c: [{ n: 'Anh Tuấn', r: 'Người mua', g: 'male', a: '👱‍♂️' }, { n: 'Chủ tiệm', r: 'Người bán', g: 'male', a: '👴' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '老板，请问这个紫砂茶壶怎么卖？', py: 'Lǎobǎn, qǐngwèn zhège zǐshā cháhú zěnme mài?', vi: 'Ông chủ ơi, xin hỏi chiếc ấm trà tử sa này bán thế nào?' },
      { s: 'Chủ tiệm', g: 'male', hz: '小伙子真有眼光，这是宜兴原矿紫砂纯手工制作的，一口价三百八十块。', py: 'Xiǎohuǒzi zhēn yǒu yǎnguāng, zhè shì Yíxīng yuánkuàng zǐshā chún shǒugōng zhìzuò de, yìkǒujià sānbǎi bāshí kuài.', vi: 'Cậu thanh niên thật có con mắt tinh đời, đây là ấm tử sa nguyên khoáng Nghi Hưng làm thủ công 100%, giá chuẩn 380 tệ.' },
      { s: 'Anh Tuấn', g: 'male', hz: '价格有点儿贵啊，我是学生，您能给个优惠价吗？', py: 'Jiàgé yǒudiǎnr guì a, wǒ shì xuésheng, nín néng gěi gè yōuhuìjià ma?', vi: 'Giá hơi đắt một chút ạ, cháu là sinh viên, bác có thể bớt giá hữu nghị cho cháu được không ạ?' },
      { s: 'Chủ tiệm', g: 'male', hz: '看你是个懂茶的人，诚心想要的话，给你打个八折，三百块拿走！', py: 'Kàn nǐ shì gè dǒng chá de rén, chéngxīn xiǎng yào de huà, gěi nǐ dǎ gè bā zhé, sānbǎi kuài ná zǒu!', vi: 'Thấy cậu là người hiểu trà, nếu thật tâm muốn lấy thì bác giảm 20% (bát chiết), 300 tệ cậu mang về!' }
    ],
    v: [{ hz: '怎么卖', py: 'zěnme mài', m: 'bán thế nào (hỏi giá)', hsk: 'HSK 2' }, { hz: '一口价', py: 'yìkǒujià', m: 'giá cứng, một giá không mặc cả', hsk: 'HSK 4' }, { hz: '优惠价', py: 'yōuhuìjià', m: 'giá ưu đãi', hsk: 'HSK 4' }, { hz: '打八折', py: 'dǎ bā zhé', m: 'giảm giá 20% (bán 80% giá)', hsk: 'HSK 3' }],
    g: [{ t: 'Cách tính giảm giá tiếng Trung: 打X折', s: '打八折 = Bán 80% (giảm 20%), 打五折 = Bán 50% (giảm nửa giá)', e: 'Phải chú ý 打八折 là còn 80% chứ không phải giảm 80%.' }],
    q: [{ q: 'Sau khi giảm giá, giá chiếc ấm trà là bao nhiêu?', options: ['250 tệ', '300 tệ', '350 tệ', '380 tệ'], a: 1, exp: 'Chủ tiệm nói: "三百块拿走" (300 tệ).' }],
    sp: { hz: '老板，这个怎么卖？能便宜一点儿吗？', py: 'Lǎobǎn, zhège zěnme mài? Néng piányi yìdiǎnr ma?', vi: 'Ông chủ ơi, món này bán thế nào? Bớt chút được không ạ?' }
  },
  {
    num: 43, top: 5, lvl: 'HSK 2', title: 'Mặc thử quần áo', hz: '试穿衣服', py: 'Shìchuān yīfu',
    sit: 'Lan mặc thử chiếc váy hoa và hỏi ý kiến bạn bè cùng nhân viên.',
    c: [{ n: 'Hương Lan', r: 'Người thử váy', g: 'female', a: '👧' }, { n: 'Nhân viên bán hàng', r: 'Nhân viên tư vấn', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Hương Lan', g: 'female', hz: '我试好了，您看我穿这条碎花连衣裙合身吗？', py: 'Wǒ shì hǎo le, nín kàn wǒ chuān zhè tiáo suìhuā liányīqún héshēn ma?', vi: 'Em thử xong rồi, chị xem em mặc chiếc váy liền hoa nhí này có vừa vặn không?' },
      { s: 'Nhân viên bán hàng', g: 'female', hz: '太漂亮了！腰身刚刚好，显得整个人特别文静优雅。', py: 'Tài piàoliang le! Yāoshēn gānggāng hǎo, xiǎnde zhěnggè rén tèbié wénjìng yōuyǎ.', vi: 'Xinh quá em ơi! Vòng eo vừa khít luôn, tôn vóc dáng trông cực kỳ dịu dàng nhã nhặn.' },
      { s: 'Hương Lan', g: 'female', hz: '我觉得裙摆好像稍微有点儿长，会不会拖地？', py: 'Wǒ juéde qúnbǎi hǎoxiàng shāowēi yǒudiǎnr cháng, huì bu huì tuōdì?', vi: 'Em thấy tà váy hình như hơi dài một xíu, có bị chạm đất không chị?' },
      { s: 'Nhân viên bán hàng', g: 'female', hz: '不会的，你搭配一双三厘米的高跟鞋就完美了！', py: 'Bú huì de, nǐ dāpèi yì shuāng sān límǐ de gāogēnxié jiù wánměi le!', vi: 'Không đâu em, em phối với một đôi giày cao gót 3 phân là hoàn hảo luôn!' }
    ],
    v: [{ hz: '合身', py: 'héshēn', m: 'vừa vặn thân người', hsk: 'HSK 3' }, { hz: '优雅', py: 'yōuyǎ', m: 'tao nhã, thanh lịch', hsk: 'HSK 4' }, { hz: '裙摆', py: 'qúnbǎi', m: 'tà váy', hsk: 'HSK 4' }, { hz: '高跟鞋', py: 'gāogēnxié', m: 'giày cao gót', hsk: 'HSK 3' }],
    g: [{ t: 'Hơi chút: 稍微有点儿 (Shāowēi yǒudiǎnr)', s: '稍微有点儿 + [Tính từ mang sắc thái chưa ưng ý]', e: '稍微有点长 (hơi dài một tẹo).' }],
    q: [{ q: 'Nhân viên khuyên Lan kết hợp váy với phụ kiện gì để hoàn hảo?', options: ['Giày thể thao', 'Giày cao gót 3cm', 'Dép sandal', 'Ủng da'], a: 1, exp: 'Nhân viên khuyên: 搭配一双三厘米的高跟鞋.' }],
    sp: { hz: '这件衣服穿起来很合身，我很喜欢。', py: 'Zhè jiàn yīfu chuān qǐlai hěn héshēn, wǒ hěn xǐhuan.', vi: 'Chiếc áo này mặc vào rất vừa vặn, tôi rất thích.' }
  },
  {
    num: 44, top: 5, lvl: 'HSK 2', title: 'Chọn kích cỡ phù hợp', hz: '挑选合适尺码', py: 'Tiāoxuǎn héshì chǐmǎ',
    sit: 'Quang mặc thử áo sơ mi nhưng thấy chật vai nên nhờ đổi size to hơn.',
    c: [{ n: 'Hồng Quang', r: 'Người mua', g: 'male', a: '👨' }, { n: 'Nhân viên', r: 'Bán hàng nam', g: 'male', a: '👱' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '你好，这件L号的衬衫我穿肩膀有点儿紧，袖子也短了一点。', py: 'Nǐ hǎo, zhè jiàn L hào de chènshān wǒ chuān jiānbǎng yǒudiǎnr jǐn, xiùzi yě duǎn le yìdiǎn.', vi: 'Chào bạn, chiếc áo sơ mi size L này tôi mặc vai hơi bị chật, tay áo cũng ngắn mất một chút.' },
      { s: 'Nhân viên', g: 'male', hz: '先生，那您需要换大一号，试试XL号吧。', py: 'Xiānsheng, nà nín xūyào huàn dà yí hào, shìshi XL hào ba.', vi: 'Dạ anh, thế thì anh cần đổi lớn hơn một size, thử chiếc XL xem sao ạ.' },
      { s: 'Hồng Quang', g: 'male', hz: 'XL号的衣长会不会太宽松了？', py: 'XL hào de yīcháng huì bu huì tài kuānsōng le?', vi: 'Áo dài của size XL liệu có bị quá rộng thùng thình không bạn?' },
      { s: 'Nhân viên', g: 'male', hz: '这款是修身剪裁，XL号胸围和肩宽刚好适合您，给您拿一件试试。', py: 'Zhè kuǎn shì xiūshēn jiǎncái, XL hào xiōngwéi hé jiānkuān gānghǎo shìhé nín, gěi nín ná yí jiàn shìshi.', vi: 'Mẫu này là cắt may ôm dáng (slim fit), size XL vòng ngực và vai vừa khít với anh luôn, em lấy một chiếc anh thử nhé.' }
    ],
    v: [{ hz: '尺码', py: 'chǐmǎ', m: 'kích cỡ (size)', hsk: 'HSK 3' }, { hz: '肩膀', py: 'jiānbǎng', m: 'bờ vai', hsk: 'HSK 3' }, { hz: '宽松', py: 'kuānsōng', m: 'rộng rãi, thùng thình', hsk: 'HSK 4' }, { hz: '修身', py: 'xiūshēn', m: 'ôm dáng, vừa vặn', hsk: 'HSK 4' }],
    g: [{ t: 'Đổi cỡ to hơn / nhỏ hơn: 换大一号 / 换小一号', s: '换 + 大/小 + 一号', e: '换大一号 (đổi lên 1 size), 换小一号 (đổi xuống 1 size).' }],
    q: [{ q: 'Nhân viên khuyên Hồng Quang đổi sang size nào?', options: ['M', 'L', 'XL', 'XXL'], a: 2, exp: 'Nhân viên khuyên đổi sang XL号.' }],
    sp: { hz: '这件有点小，请问有大一号的吗？', py: 'Zhè jiàn yǒudiǎnr xiǎo, qǐngwèn yǒu dà yí hào de ma?', vi: 'Cái này hơi nhỏ, cho hỏi có cỡ to hơn một số không?' }
  },
  {
    num: 45, top: 5, lvl: 'HSK 2', title: 'Mua giày dép', hz: '购买鞋子', py: 'Gòumǎi xiézi',
    sit: 'Minh đến cửa hàng thể thao để chọn mua một đôi giày chạy bộ.',
    c: [{ n: 'Văn Minh', r: 'Người mua', g: 'male', a: '👦' }, { n: 'Nhân viên tiệm giày', r: 'Nhân viên', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '你好，橱窗里展示的那双白色运动慢跑鞋，能拿给我看一下吗？', py: 'Nǐ hǎo, chúchuāng lǐ zhǎnshì de nà shuāng báisè yùndòng mànpǎoxié, néng ná gěi wǒ kàn yíxià ma?', vi: 'Chào chị, đôi giày chạy bộ màu trắng trưng bày trong tủ kính kia có thể lấy cho em xem chút được không?' },
      { s: 'Nhân viên tiệm giày', g: 'female', hz: '当然可以，请问您平时穿多大码的鞋？', py: 'Dāngrán kěyǐ, qǐngwèn nín píngshí chuān duō dà mǎ de xié?', vi: 'Được chứ em, xin hỏi bình thường em đi giày cỡ bao nhiêu?' },
      { s: 'Văn Minh', g: 'male', hz: '我平时穿四十二码的。鞋底减震效果好吗？', py: 'Wǒ píngshí chuān sìshí’èr mǎ de. Xiédǐ jiǎnzhèn xiàoguǒ hǎo ma?', vi: 'Em thường đi size 42 ạ. Đế giày độ giảm chấn có tốt không chị?' },
      { s: 'Nhân viên tiệm giày', g: 'female', hz: '鞋底采用气垫科技，回弹和抓地力都极佳，您穿上走两步感受一下。', py: 'Xiédǐ cǎiyòng qìdiàn kējì, huítán hé zhuādìlì dōu jíjiā, nín chuān shang zǒu liǎng bù gǎnshòu yíxià.', vi: 'Đế giày áp dụng công nghệ đệm khí, độ nảy và bám đường đều cực kỳ tốt, em xỏ vào đi vài bước cảm nhận nhé.' }
    ],
    v: [{ hz: '慢跑鞋', py: 'mànpǎoxié', m: 'giày chạy bộ', hsk: 'HSK 3' }, { hz: '码', py: 'mǎ', m: 'cỡ giày (size)', hsk: 'HSK 3' }, { hz: '鞋底', py: 'xiédǐ', m: 'đế giày', hsk: 'HSK 3' }, { hz: '气垫', py: 'qìdiàn', m: 'đệm khí', hsk: 'HSK 4' }],
    g: [{ t: 'Hỏi cỡ giày: 穿多大码？', s: '你穿多大码 (的鞋)？ - 我穿42码', e: 'Size giày Trung Quốc tính theo số 38, 39, 40, 41, 42...' }],
    q: [{ q: 'Văn Minh đi giày cỡ bao nhiêu (size mấy)?', options: ['40', '41', '42', '43'], a: 2, exp: 'Minh nói: "我平时穿四十二码".' }],
    sp: { hz: '我穿四十二码，请帮我拿一双试穿。', py: 'Wǒ chuān sìshí’èr mǎ, qǐng bāng wǒ ná yì shuāng shìchuān.', vi: 'Tôi đi size 42, lấy giúp tôi một đôi để đi thử nhé.' }
  },
  {
    num: 46, top: 5, lvl: 'HSK 2', title: 'Mua điện thoại mới', hz: '选购新手机', py: 'Xuǎngòu xīn shǒujī',
    sit: 'Tuấn đến trung tâm điện máy để đổi điện thoại thông minh mẫu mới nhất.',
    c: [{ n: 'Anh Tuấn', r: 'Khách hàng', g: 'male', a: '👱‍♂️' }, { n: 'Chuyên viên kỹ thuật', r: 'Tư vấn bán hàng', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '你好，我想买一部拍照清晰、电池续航长一点的5G手机。', py: 'Nǐ hǎo, wǒ xiǎng mǎi yí bù pāizhào qīngxī, diànchí xùháng cháng yìdiǎn de wǔ-G shǒujī.', vi: 'Chào bạn, tôi muốn mua một chiếc điện thoại 5G chụp ảnh sắc nét và pin dùng trâu một chút.' },
      { s: 'Chuyên viên kỹ thuật', g: 'male', hz: '推荐您看这款华为旗舰机，后置五千万像素三摄，配备五千毫安大电池。', py: 'Tuījiàn nín kàn zhè kuǎn Huáwéi qíjiàn jī, hòuzhì wǔqiān wàn xiàngsù sān shè, pèibèi wǔqiān háo’ān dà diànchí.', vi: 'Gợi ý anh xem mẫu flagship Huawei này, cụm 3 camera sau 50 triệu pixel, trang bị viên pin lớn 5000 mAh.' },
      { s: 'Anh Tuấn', g: 'male', hz: '内存和存储空间有多大？保修期是多长时间？', py: 'Nèicún hé cúnchǔ kōngjiān yǒu duō dà? Bǎoxiūqī shì duō cháng shíjiān?', vi: 'Bộ nhớ RAM và dung lượng lưu trữ là bao nhiêu? Thời gian bảo hành bao lâu vậy?' },
      { s: 'Chuyên viên kỹ thuật', g: 'male', hz: '运存12GB，存储512GB，全国联保一年，今天购买还赠送无线蓝牙耳机！', py: 'Yùncún shí’èr GB, cúnchǔ wǔbǎiyīshí’èr GB, quánguó liánbǎo yì nián, jīntiān gòumǎi hái zèngsòng wúxiàn lányá ěrjī!', vi: 'RAM 12GB, bộ nhớ 512GB, bảo hành toàn quốc 1 năm, hôm nay mua còn tặng kèm tai nghe bluetooth không dây!' }
    ],
    v: [{ hz: '续航', py: 'xùháng', m: 'thời lượng pin, cự ly hoạt động', hsk: 'HSK 4' }, { hz: '旗舰机', py: 'qíjiàn jī', m: 'máy đầu bảng, flagship', hsk: 'HSK 5' }, { hz: '存储', py: 'cúnchǔ', m: 'bộ nhớ lưu trữ', hsk: 'HSK 4' }, { hz: '保修期', py: 'bǎoxiūqī', m: 'thời hạn bảo hành', hsk: 'HSK 4' }],
    g: [{ t: 'Lượng từ của điện thoại/máy móc: 部 (Bù)', s: '买一部手机 / 一部电脑', e: 'Dùng lượng từ 部 thay cho 个 đối với thiết bị điện tử.' }],
    q: [{ q: 'Dung lượng lưu trữ của chiếc điện thoại được tư vấn là bao nhiêu?', options: ['128GB', '256GB', '512GB', '1TB'], a: 2, exp: 'Chuyên viên nói: "存储512GB".' }],
    sp: { hz: '这部手机拍照很清楚，电池很耐用。', py: 'Zhè bù shǒujī pāizhào hěn qīngchu, diànchí hěn nàiyòng.', vi: 'Chiếc điện thoại này chụp ảnh rất nét, pin dùng rất bền.' }
  },
  {
    num: 47, top: 5, lvl: 'HSK 2', title: 'Mua sắm tại siêu thị', hz: '在超市大采购', py: 'Zài chāoshì dà cǎigòu',
    sit: 'Mai và Lan đẩy xe đẩy đi siêu thị mua sắm đồ dùng và thực phẩm tuần mới.',
    c: [{ n: 'Thanh Mai', r: 'Bạn mua sắm', g: 'female', a: '👧' }, { n: 'Hương Lan', r: 'Bạn đi cùng', g: 'female', a: '👩' }],
    d: [
      { s: 'Thanh Mai', g: 'female', hz: '香兰，我们先把购物车推到生鲜区吧，今晚做火锅需要买点牛肉卷和生菜。', py: 'Xiānglán, wǒmen xiān bǎ gòuwùchē tuī dào shēngxiānqū ba, jīnwǎn zuò huǒguō xūyào mǎi diǎnr niúròujuǎn hé shēngcài.', vi: 'Hương Lan, chúng mình đẩy xe hàng sang khu đồ tươi sống trước nhé, tối nay làm lẩu cần mua ít thịt bò cuộn và rau xà lách.' },
      { s: 'Hương Lan', g: 'female', hz: '好啊，冷柜那边的鲜牛奶今天买一送一，保质期还有十天，很划算！', py: 'Hǎo a, lěngguì nàbian de xiān niúnǎi jīntiān mǎi yī sòng yī, bǎozhìqī hái yǒu shí tiān, hěn huásuàn!', vi: 'Được chứ, sữa tươi bên quầy lạnh hôm nay mua 1 tặng 1, hạn sử dụng còn 10 ngày, hời lắm nè!' },
      { s: 'Thanh Mai', g: 'female', hz: '拿两盒！再去日用品区买提抽纸和洗衣液，宿舍快用完了。', py: 'Ná liǎng hé! Zài qù rìyòngpǐn qū mǎi tí chōuzhǐ hé xǐyīyè, sùshè kuài yòng wán le.', vi: 'Lấy hai hộp đi! Rồi sang khu đồ gia dụng mua lốc khăn giấy rút và nước giặt, ở ký túc xá sắp hết rồi.' },
      { s: 'Hương Lan', g: 'female', hz: '走，买完我们去自助结账通道，不用排长队！', py: 'Zǒu, mǎi wán wǒmen qù zìzhù jiézhàng tōngdào, bú yòng pái cháng duì!', vi: 'Đi nào, mua xong mình ra quầy thanh toán tự động, khỏi phải xếp hàng dài!' }
    ],
    v: [{ hz: '生鲜区', py: 'shēngxiānqū', m: 'khu đồ tươi sống', hsk: 'HSK 3' }, { hz: '买一送一', py: 'mǎi yī sòng yī', m: 'mua một tặng một', hsk: 'HSK 3' }, { hz: '保质期', py: 'bǎozhìqī', m: 'hạn sử dụng', hsk: 'HSK 4' }, { hz: '自助结账', py: 'zìzhù jiézhàng', m: 'thanh toán tự phục vụ', hsk: 'HSK 4' }],
    g: [{ t: 'Khuyến mãi kinh điển: 买一送一 (Mua 1 tặng 1)', s: '买 + Số lượng + 送 + Số lượng', e: '买一送一 (mua 1 tặng 1), 买二送一 (mua 2 tặng 1).' }],
    q: [{ q: 'Mặt hàng nào ở siêu thị hôm nay có khuyến mãi mua 1 tặng 1?', options: ['Thịt bò cuộn', 'Sữa tươi (鲜牛奶)', 'Nước giặt', 'Khăn giấy rút'], a: 1, exp: 'Lan nói: 鲜牛奶今天买一送一.' }],
    sp: { hz: '这个牛奶今天买一送一，非常划算。', py: 'Zhège niúnǎi jīntiān mǎi yī sòng yī, fēicháng huásuàn.', vi: 'Sữa này hôm nay mua một tặng một, rất là hời.' }
  },
  {
    num: 48, top: 5, lvl: 'HSK 2', title: 'Đổi trả sản phẩm', hz: '商品退换货', py: 'Shāngpǐn tuì huàn huò',
    sit: 'Quang mang chiếc áo len mua hôm qua bị bung chỉ ra quầy dịch vụ khách hàng đổi.',
    c: [{ n: 'Hồng Quang', r: 'Khách đổi hàng', g: 'male', a: '👨' }, { n: 'Chăm sóc khách hàng', r: 'Nhân viên', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '你好，我昨天在这里买了一件毛衣，回家发现袖口有开线，我想换一件。', py: 'Nǐ hǎo, wǒ zuótiān zài zhèlǐ mǎi le yí jiàn máoyī, huí jiā fāxiàn xiùkǒu yǒu kāixiàn, wǒ xiǎng huàn yí jiàn.', vi: 'Chào bạn, hôm qua tôi mua chiếc áo len ở đây, về nhà phát hiện cổ tay áo bị bung chỉ, tôi muốn đổi cái khác.' },
      { s: 'Chăm sóc khách hàng', g: 'female', hz: '先生您好，给您带来不便非常抱歉。请问您的购物小票和吊牌都在吗？', py: 'Xiānsheng nín hǎo, gěi nín dài lái búbiàn fēicháng bàoqiàn. Qǐngwèn nín de gòuwù xiǎopiào hé diàopái dōu zài ma?', vi: 'Chào anh, vô cùng xin lỗi vì sự bất tiện này. Cho hỏi hóa đơn mua hàng và mác áo của anh còn đầy đủ chứ ạ?' },
      { s: 'Hồng Quang', g: 'male', hz: '都在这儿，衣服我还没穿过，吊牌也完好。', py: 'Dōu zài zhèr, yīfu wǒ hái méi chuān guo, diàopái yě wánhǎo.', vi: 'Đều ở đây cả, áo tôi chưa mặc qua, mác vẫn nguyên vẹn.' },
      { s: 'Chăm sóc khách hàng', g: 'female', hz: '好的，核实无误。我马上为您调换一件同款式全新的毛衣，请您稍候。', py: 'Hǎo de, héshí wúwù. Wǒ mǎshàng wèi nín diàohuàn yí jiàn tóng kuǎnshì quánxīn de máoyī, qǐng nín shāohòu.', vi: 'Dạ được rồi, kiểm tra đúng quy định. Em sẽ đổi ngay cho anh một chiếc áo len mới toanh cùng mẫu, anh vui lòng đợi chút ạ.' }
    ],
    v: [{ hz: '退换货', py: 'tuì huàn huò', m: 'đổi trả hàng hóa', hsk: 'HSK 4' }, { hz: '开线', py: 'kāixiàn', m: 'bung chỉ, tuột chỉ', hsk: 'HSK 4' }, { hz: '小票', py: 'xiǎopiào', m: 'hóa đơn mua hàng nhỏ', hsk: 'HSK 3' }, { hz: '吊牌', py: 'diàopái', m: 'mác treo quần áo', hsk: 'HSK 4' }],
    g: [{ t: 'Thủ tục đổi trả: 凭小票和吊牌 (Dựa vào hóa đơn và tem mác)', s: '请出示购物小票和吊牌', e: 'Điều kiện tiên quyết để đổi trả hàng ở các cửa hàng.' }],
    q: [{ q: 'Lý do Hồng Quang muốn đổi chiếc áo len là gì?', options: ['Mặc không vừa', 'Không thích màu sắc', 'Cổ tay áo bị bung chỉ (袖口有开线)', 'Thấy đắt'], a: 2, exp: 'Quang nói phát hiện 袖口有开线.' }],
    sp: { hz: '我想凭小票退换这件衣服，吊牌都在。', py: 'Wǒ xiǎng píng xiǎopiào tuìhuàn zhè jiàn yīfu, diàopái dōu zài.', vi: 'Tôi muốn dựa vào hóa đơn đổi chiếc áo này, tem mác còn nguyên.' }
  },
  {
    num: 49, top: 5, lvl: 'HSK 2', title: 'Hỏi về chương trình giảm giá', hz: '了解促销与折扣', py: 'Liǎojiě cùxiāo yǔ zhékòu',
    sit: 'An hỏi nhân viên cửa hàng mỹ phẩm về chương trình khuyến mãi ngày hội mua sắm 11/11.',
    c: [{ n: 'Thúy An', r: 'Khách hàng', g: 'female', a: '👧' }, { n: 'Nhân viên tư vấn', r: 'Bán hàng', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Thúy An', g: 'female', hz: '你好，请问你们店双十一有什么优惠活动吗？', py: 'Nǐ hǎo, qǐngwèn nǐmen diàn Shuāng Shíyī yǒu shénme yōuhuì huódòng ma?', vi: 'Chào chị, xin hỏi shop mình dịp Song Thập Nhất 11/11 có chương trình ưu đãi gì không ạ?' },
      { s: 'Nhân viên tư vấn', g: 'female', hz: '我们全场参加“满三百减五十”跨店满减，而且护肤套装全场七折！', py: 'Wǒmen quánchǎng cānjiā “mǎn sānbǎi jiǎn wǔshí” kuàdiàn mǎnjiǎn, érqiě hùfū tàozhuāng quánchǎng qī zhé!', vi: 'Toàn bộ cửa hàng tham gia "hóa đơn đủ 300 giảm 50", ngoài ra bộ sản phẩm dưỡng da toàn bộ giảm 30% (bán 70%)!' },
      { s: 'Thúy An', g: 'female', hz: '如果办理会员卡，还能享受折上折吗？', py: 'Rúguǒ bànlǐ huìyuánkǎ, hái néng xiǎngshòu zhé shàng zhé ma?', vi: 'Nếu mở thẻ hội viên thì có được hưởng giảm giá chồng giảm giá nữa không chị?' },
      { s: 'Nhân viên tư vấn', g: 'female', hz: '会员今天免费注册，首单立减二十元，还能积累积分兑换礼品呢！', py: 'Huìyuán jīntiān miǎnfèi zhùcè, shǒudān lì jiǎn èrshí yuán, hái néng jīlěi jīfēn duìhuàn lǐpǐn ne!', vi: 'Hội viên hôm nay đăng ký miễn phí, đơn đầu giảm ngay 20 tệ, còn được tích lũy điểm đổi quà nữa đấy em!' }
    ],
    v: [{ hz: '双十一', py: 'Shuāng Shíyī', m: 'Lễ hội mua sắm 11/11 (Ngày độc thân)', hsk: 'HSK 3' }, { hz: '满减', py: 'mǎnjiǎn', m: 'mua đủ mức tiền thì giảm bớt', hsk: 'HSK 4' }, { hz: '折上折', py: 'zhé shàng zhé', m: 'giảm giá kép, giảm chồng giảm', hsk: 'HSK 5' }, { hz: '积分', py: 'jīfēn', m: 'điểm tích lũy', hsk: 'HSK 4' }],
    g: [{ t: 'Hình thức khuyến mãi nổi tiếng Trung Quốc: 满X减Y', s: '满 + Số tiền X + 减 + Số tiền Y', e: '满300减50: Đơn hàng từ 300 tệ được giảm ngay 50 tệ.' }],
    q: [{ q: 'Đăng ký hội viên hôm nay có ưu đãi gì cho đơn hàng đầu tiên?', options: ['Tặng quà đắt tiền', 'Được giảm ngay 20 tệ (立减二十元)', 'Miễn phí đơn hàng', 'Không có gì'], a: 1, exp: 'Nhân viên nói: 首单立减二十元.' }],
    sp: { hz: '今天全场满三百减五十，很划算。', py: 'Jīntiān quánchǎng mǎn sānbǎi jiǎn wǔshí, hěn huásuàn.', vi: 'Hôm nay toàn sàn đủ 300 giảm 50, hời lắm.' }
  },
  {
    num: 50, top: 5, lvl: 'HSK 2', title: 'Thanh toán tại quầy', hz: '在收银台结账', py: 'Zài shōuyíntái jiézhàng',
    sit: 'Minh mang giỏ hàng ra quầy thu ngân thanh toán và hỏi về túi đựng đồ.',
    c: [{ n: 'Văn Minh', r: 'Người mua hàng', g: 'male', a: '👦' }, { n: 'Thu ngân viên', r: 'Nhân viên thu ngân', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Thu ngân viên', g: 'female', hz: '您好，一共是一百二十五块六毛。请问需要塑料袋吗？', py: 'Nín hǎo, yígòng shì yìbǎi èrshíwǔ kuài liù máo. Qǐngwèn xūyào sùliàodài ma?', vi: 'Chào anh, tổng cộng là 125 tệ 6 hào. Cho hỏi anh có cần túi nilon không ạ?' },
      { s: 'Văn Minh', g: 'male', hz: '不用了，我自己带了环保布袋。请问有会员码吗？', py: 'Bú yòng le, wǒ zìjǐ dài le huánbǎo bùdài. Qǐngwèn yǒu huìyuánmǎ ma?', vi: 'Không cần đâu, tôi tự mang theo túi vải bảo vệ môi trường rồi. Cho tôi quét mã hội viên nhé?' },
      { s: 'Thu ngân viên', g: 'female', hz: '有的，请出示您的会员条形码，我扫一下。积了125分。请问怎么支付？', py: 'Yǒu de, qǐng chūshì nín de huìyuán tiáoxíngmǎ, wǒ sǎo yíxià. Jī le yìbǎi èrshíwǔ fēn. Qǐngwèn zěnme zhīfù?', vi: 'Có chứ ạ, anh giơ mã vạch hội viên ra em quét một chút. Tích được 125 điểm rồi ạ. Anh muốn thanh toán thế nào?' },
      { s: 'Văn Minh', g: 'male', hz: '我用手机微信支付，我扫您的付款码还是您扫我？', py: 'Wǒ yòng shǒujī Wēixìn zhīfù, wǒ sǎo nín de fùkuǎnmǎ háishi nín sǎo wǒ?', vi: 'Tôi dùng WeChat thanh toán trên điện thoại, tôi quét mã chị hay chị quét mã tôi?' },
      { s: 'Thu ngân viên', g: 'female', hz: '请出示您的付款码，直接对着红外线扫码枪就可以了。滴！支付成功，小票请拿好！', py: 'Qǐng chūshì nín de fùkuǎnmǎ, zhíjiē duìzhe hóngwàixiàn sǎomǎqiāng jiù kěyǐ le. Dī! Zhīfù chénggōng, xiǎopiào qǐng ná hǎo!', vi: 'Anh giơ mã thanh toán ra hướng thẳng vào súng quét hồng ngoại là được ạ. Bíp! Thanh toán thành công, hóa đơn của anh đây ạ!' }
    ],
    v: [{ hz: '收银台', py: 'shōuyíntái', m: 'quầy thu ngân', hsk: 'HSK 3' }, { hz: '塑料袋', py: 'sùliàodài', m: 'túi nilon', hsk: 'HSK 3' }, { hz: '环保袋', py: 'huánbǎodài', m: 'túi vải thân thiện môi trường', hsk: 'HSK 4' }, { hz: '条形码', py: 'tiáoxíngmǎ', m: 'mã vạch', hsk: 'HSK 4' }],
    g: [{ t: 'Hỏi phương thức quét mã: 我扫你还是你扫我？', s: '我扫你还是你扫我？(Tôi quét bạn hay bạn quét tôi?)', e: 'Câu cửa miệng cực kỳ phổ biến khi thanh toán không tiền mặt ở Trung Quốc.' }],
    q: [{ q: 'Văn Minh có lấy túi nilon ở quầy thu ngân không?', options: ['Có, lấy 2 cái', 'Không, vì tự mang túi vải môi trường (环保布袋)', 'Lấy túi giấy', 'Lấy hộp carton'], a: 1, exp: 'Minh nói: "不用了，我自己带了环保布袋".' }],
    sp: { hz: '请问怎么支付？我扫您还是您扫我？', py: 'Qǐngwèn zěnme zhīfù? Wǒ sǎo nín háishi nín sǎo wǒ?', vi: 'Cho hỏi thanh toán thế nào? Tôi quét bạn hay bạn quét tôi?' }
  }
];


