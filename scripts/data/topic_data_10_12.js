// Topic Data: Topics 10 - 12 (Lessons 91 - 120)
module.exports = [
  // ==================== TOPIC 10: SỨC KHỎE VÀ BỆNH VIỆN (91 - 100) ====================
  {
    num: 91, top: 10, lvl: 'HSK 3', title: 'Đặt lịch khám bệnh', hz: '医院预约挂号', py: 'Yīyuàn yùyuē guàhào',
    sit: 'Minh dùng ứng dụng WeChat của bệnh viện để đặt số khám chuyên khoa Hô hấp.',
    c: [{ n: 'Văn Minh', r: 'Bệnh nhân', g: 'male', a: '👦' }, { n: 'Hướng dẫn viên', r: 'Tiếp đón bệnh viện', g: 'female', a: '👩‍⚕️' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '护士您好，我最近总是咳嗽胸闷，想挂呼吸内科的号。', py: 'Hùshi nín hǎo, wǒ zuìjìn zǒngshì késou xiōngmèn, xiǎng guà hūxīnèikē de hào.', vi: 'Chào y tá, dạo này em cứ hay bị ho và tức ngực, em muốn lấy số khám khoa Hô hấp nội ạ.' },
      { s: 'Hướng dẫn viên', g: 'female', hz: '请问有医保卡还是自费就诊？可以在自助挂号机上刷护照实名建档。', py: 'Qǐngwèn yǒu yībǎokǎ háishi zìfèi jiùzhěn? Kěyǐ zài zìzhù guàhàojī shang shuā hùzhào shímíng jiàndàng.', vi: 'Em có thẻ bảo hiểm y tế hay khám tự túc? Em có thể quét hộ chiếu lập hồ sơ tên thật tại cây lấy số tự động nhé.' },
      { s: 'Văn Minh', g: 'male', hz: '我是留学生自费就诊。请问今天有专家门诊吗？还是普通门诊？', py: 'Wǒ shì liúxuéshēng zìfèi jiùzhěn. Qǐngwèn jīntiān yǒu zhuānjiā ménzhěn ma? Háishi pǔtōng ménzhěn?', vi: 'Em là du học sinh khám tự túc ạ. Cho em hỏi hôm nay có phòng khám chuyên gia không ạ? Hay là khám thường?' },
      { s: 'Hướng dẫn viên', g: 'female', hz: '今天上午刚好有张主任医师的特需专家号，挂号费五十元。挂好号后请到三楼东区候诊。', py: 'Jīntiān shàngwǔ gānghǎo yǒu Zhāng zhǔrèn yīshī de tèxū zhuānjiāhào, guàhàofèi wǔshí yuán. Guà hǎo hào hòu qǐng dào sān lóu dōngqū hòuzhěn.', vi: 'Sáng nay vừa hay có số chuyên gia đặc biệt của bác sĩ chủ nhiệm Trương, phí khám 50 tệ. Lấy số xong em lên khu Đông tầng 3 ngồi chờ khám nhé.' }
    ],
    v: [{ hz: '挂号', py: 'guàhào', m: 'đăng ký lấy số khám bệnh', hsk: 'HSK 3' }, { hz: '胸闷', py: 'xiōngmèn', m: 'tức ngực, khó thở', hsk: 'HSK 4' }, { hz: '呼吸内科', py: 'hūxīnèikē', m: 'khoa nội hô hấp', hsk: 'HSK 4' }, { hz: '专家门诊', py: 'zhuānjiā ménzhěn', m: 'phòng khám chuyên gia (bác sĩ giỏi)', hsk: 'HSK 4' }],
    g: [{ t: 'Hành động đăng ký khám bệnh: 挂号 (Guàhào)', s: '挂 + Tên khoa + 的号', e: '挂内科的号 (Lấy số khám khoa nội).' }],
    q: [{ q: 'Lấy số khám xong, Minh cần đến đâu để chờ bác sĩ gọi vào khám?', options: ['Tầng 1', 'Tầng 2', 'Khu Đông tầng 3 (三楼东区候诊)', 'Khu cấp cứu'], a: 2, exp: 'Y tá chỉ: "请到三楼东区候诊".' }],
    sp: { hz: '我想挂呼吸内科的专家号，请问在几楼候诊？', py: 'Wǒ xiǎng guà hūxīnèikē de zhuānjiāhào, qǐngwèn zài jǐ lóu hòuzhěn?', vi: 'Tôi muốn lấy số chuyên gia khoa nội hô hấp, xin hỏi chờ ở tầng mấy?' }
  },
  {
    num: 92, top: 10, lvl: 'HSK 3', title: 'Mô tả triệu chứng bệnh', hz: '向医生陈述病情症状', py: 'Xiàng yīshēng chénshù bìngqíng zhèngzhuàng',
    sit: 'An vào phòng khám ngồi đối diện bác sĩ trình bày các triệu chứng sốt và nhức đầu.',
    c: [{ n: 'Thúy An', r: 'Bệnh nhân', g: 'female', a: '👧' }, { n: 'Bác sĩ Lý', r: 'Bác sĩ khoa nội', g: 'male', a: '👨‍⚕️' }],
    d: [
      { s: 'Bác sĩ Lý', g: 'male', hz: '请坐。感觉哪里不舒服？这种症状持续几天了？', py: 'Qǐng zuò. Gǎnjué nǎlǐ bù shūfu? Zhè zhǒng zhèngzhuàng chíxù jǐ tiān le?', vi: 'Mời cháu ngồi. Cảm thấy khó chịu ở đâu? Triệu chứng này kéo dài mấy ngày rồi?' },
      { s: 'Thúy An', g: 'female', hz: '李大夫，从前天夜里开始，我浑身酸痛，头晕得厉害，还伴有低烧。', py: 'Lǐ dàifu, cóng qiántiān yèlǐ kāishǐ, wǒ húnshēn suāntòng, tóuyūn de lìhai, hái bànyǒu dīshāo.', vi: 'Bác sĩ Lý ơi, từ đêm hôm kia, cháu bị đau nhức khắp cả người, đầu choáng váng dữ dội, còn kèm theo sốt nhẹ nữa ạ.' },
      { s: 'Bác sĩ Lý', g: 'male', hz: '有咽喉痛、恶心或者咳嗽吐痰吗？体温量过了吗？最高达到多少度？', py: 'Yǒu yānhóu tòng, ěxīn huòzhě késou tǔtán ma? Tǐwēn liáng guo le ma? Zuìgāo dádào duōshao dù?', vi: 'Có đau họng, buồn nôn hay ho khạc đờm không? Đã đo nhiệt độ cơ thể chưa? Cao nhất lên bao nhiêu độ?' },
      { s: 'Thúy An', g: 'female', hz: '喉咙像刀割一样疼，咽口水都很困难。今早测了体温是三十八度五。', py: 'Hóulóng xiàng dāogē yíyàng téng, yān kǒushuǐ dōu hěn kùnnan. Jīnzǎo cè le tǐwēn shì sānshíbā dù wǔ.', vi: 'Cổ họng cháu rát buốt như dao cắt, nuốt nước bọt cũng thấy khó khăn. Sáng nay đo thân nhiệt là 38 độ 5 ạ.' }
    ],
    v: [{ hz: '浑身', py: 'húnshēn', m: 'toàn thân, khắp người', hsk: 'HSK 3' }, { hz: '头晕', py: 'tóuyūn', m: 'chóng mặt, hoa mắt', hsk: 'HSK 3' }, { hz: '伴有', py: 'bànyǒu', m: 'kèm theo, đi kèm', hsk: 'HSK 4' }, { hz: '刀割', py: 'dāogē', m: 'như dao cắt (rát buốt)', hsk: 'HSK 4' }],
    g: [{ t: 'Diễn đạt cơn đau dữ dội: 像...一样 (Xiàng... yíyàng)', s: '喉咙像刀割一样疼', e: 'Cổ họng đau buốt tựa như dao cắt.' }],
    q: [{ q: 'Sáng nay An đo nhiệt độ cơ thể là bao nhiêu độ?', options: ['37.5 độ', '38.0 độ', '38.5 độ (三十八度五)', '39.2 độ'], a: 2, exp: 'An nói: "今早测了体温是三十八度五".' }],
    sp: { hz: '我浑身酸痛，头晕得厉害，体温三十八度五。', py: 'Wǒ húnshēn suāntòng, tóuyūn de lìhai, tǐwēn sānshíbā dù wǔ.', vi: 'Tôi nhức mỏi toàn thân, đầu choáng dữ dội, nhiệt độ 38.5 độ.' }
  },
  {
    num: 93, top: 10, lvl: 'HSK 3', title: 'Trao đổi với bác sĩ', hz: '医生诊断与治疗方案', py: 'Yīshēng zhěnduàn yǔ zhìliáo fāng’àn',
    sit: 'Bác sĩ khám cổ họng, nghe tim phổi và đưa ra chẩn đoán, dặn dò phác đồ điều trị.',
    c: [{ n: 'Bác sĩ Lý', r: 'Bác sĩ điều trị', g: 'male', a: '👨‍⚕️' }, { n: 'Thúy An', r: 'Bệnh nhân', g: 'female', a: '👧' }],
    d: [
      { s: 'Bác sĩ Lý', g: 'male', hz: '张开嘴，发“啊”的声音。扁桃体明显充血肿大，舌苔也偏厚。我再用听诊器听听心肺。', py: 'Zhāngkāi zuǐ, fā “a” de shēngyīn. Biǎntáotǐ míngxiǎn chōngxiě zhǒngdà, shétái yě piān hòu. Wǒ zài yòng tīngzhěnqì tīngting xīnfèi.', vi: 'Há to miệng ra, phát âm "a" nào. Hạch amidan xung huyết sưng to rõ rệt, rêu lưỡi cũng dày. Bác dùng ống nghe kiểm tra tim phổi cho cháu.' },
      { s: 'Thúy An', g: 'female', hz: '大夫，肺部听着有问题吗？会不会是肺炎？', py: 'Dàifu, fèibù tīngzhe yǒu wèntí ma? Huì bu huì shì fèiyán?', vi: 'Bác sĩ ơi, nghe phổi có vấn đề gì không ạ? Có bị viêm phổi không bác?' },
      { s: 'Bác sĩ Lý', g: 'male', hz: '双肺呼吸音清，没有湿啰音，排除了肺炎。初步诊断是急性上呼吸道感染伴急性扁桃体炎。', py: 'Shuāng fèi hūxīyīn qīng, méiyǒu shīluōyīn, páichú le fèiyán. Chūbù zhěnduàn shì jíxìng shànghūxīdào gǎnrǎn bàn jíxìng biǎntáotǐyán.', vi: 'Âm thở hai bên phổi trong, không có ran ẩm, loại trừ viêm phổi nhé. Chẩn đoán ban đầu là nhiễm trùng đường hô hấp trên cấp tính kèm viêm amidan cấp.' },
      { s: 'Thúy An', g: 'female', hz: '需要输液打点滴吗？我明天还要去学校上课呢。', py: 'Xūyào shūyè dǎ diǎndī ma? Wǒ míngtiān hái yào qù xuéxiào shàngkè ne.', vi: 'Có cần phải truyền dịch cắm bình truyền không bác? Mai cháu còn phải đến trường học nữa ạ.' },
      { s: 'Bác sĩ Lý', g: 'male', hz: '暂时不需要输液。我先给你开三天的口服抗生素、退烧药和清热解毒的中成药。如果三天后高烧不退，立刻回来复诊！', py: 'Zànshí bù xūyào shūyè. Wǒ xiān gěi nǐ kāi sān tiān de kǒufú kàngshēngsù, tuìshāoyào hé qīngrè jiědú de zhōngchéngyào. Rúguǒ sān tiān hòu gāoshāo bú tuì, lìkè huílái fùzhěn!', vi: 'Tạm thời chưa cần truyền dịch. Bác kê cho cháu 3 ngày thuốc kháng sinh đường uống, thuốc hạ sốt và thuốc đông y thanh nhiệt giải độc. Nếu sau 3 ngày vẫn không hạ sốt thì phải quay lại tái khám ngay!' }
    ],
    v: [{ hz: '扁桃体', py: 'biǎntáotǐ', m: 'amidan', hsk: 'HSK 5' }, { hz: '打点滴', py: 'dǎ diǎndī', m: 'truyền dịch, truyền nước biển', hsk: 'HSK 4' }, { hz: '抗生素', py: 'kàngshēngsù', m: 'thuốc kháng sinh', hsk: 'HSK 5' }, { hz: '复诊', py: 'fùzhěn', m: 'tái khám', hsk: 'HSK 4' }],
    g: [{ t: 'Cụm từ y khoa thông dụng: 打点滴 / 输液', s: '打点滴 (Dǎ diǎndī - khẩu ngữ) = 输液 (Shūyè - từ chuyên môn)', e: 'Chỉ hành động cắm kim truyền dịch tĩnh mạch.' }],
    q: [{ q: 'Bác sĩ chẩn đoán Thúy An mắc bệnh gì?', options: ['Viêm dạ dày', 'Viêm đường hô hấp trên cấp và viêm amidan (急性上呼吸道感染伴扁桃体炎)', 'Gãy xương', 'Dị ứng phấn hoa'], a: 1, exp: 'Bác sĩ chẩn đoán: 急性上呼吸道感染伴急性扁桃体炎.' }],
    sp: { hz: '医生诊断我是急性扁桃体炎，开了口服药。', py: 'Yīshēng zhěnduàn wǒ shì jíxìng biǎntáotǐyán, kāi le kǒufú yào.', vi: 'Bác sĩ chẩn đoán tôi bị viêm amidan cấp, kê thuốc uống.' }
  },
  {
    num: 94, top: 10, lvl: 'HSK 3', title: 'Mua thuốc tại hiệu thuốc', hz: '在药店购药', py: 'Zài yàodiàn gòuyào',
    sit: 'Tuấn đến hiệu thuốc gần trường mua thuốc cảm cúm, viên ngậm ho và băng cá nhân.',
    c: [{ n: 'Anh Tuấn', r: 'Người mua thuốc', g: 'male', a: '👱‍♂️' }, { n: 'Dược sĩ nhà thuốc', r: 'Dược sĩ tư vấn', g: 'female', a: '👩‍⚕️' }],
    d: [
      { s: 'Dược sĩ nhà thuốc', g: 'female', hz: '您好，同仁堂药房，请问需要买什么药？有处方单吗？', py: 'Nín hǎo, Tóngréntáng yàofáng, qǐngwèn xūyào mǎi shénme yào? Yǒu chǔfāngdān ma?', vi: 'Chào anh, nhà thuốc Đồng Nhân Đường, xin hỏi anh cần mua thuốc gì? Có đơn thuốc của bác sĩ không ạ?' },
      { s: 'Anh Tuấn', g: 'male', hz: '我没有处方，我想买点缓解喉咙痛和流鼻涕的非处方药。', py: 'Wǒ méiyǒu chǔfāng, wǒ xiǎng mǎi diǎnr huǎnjiě hóulóng tòng hé liú bítì de fēichǔfāng yào.', vi: 'Tôi không có đơn thuốc, tôi muốn mua ít thuốc không kê đơn (OTC) để giảm đau họng và sổ mũi.' },
      { s: 'Dược sĩ nhà thuốc', g: 'female', hz: '推荐您搭配这盒感冒清热颗粒和西瓜霜含片。清热解毒，缓解咽喉肿痛效果立竿见影。', py: 'Tuījiàn nín dāpèi zhè hé Gǎnmào Qīngrè Kēlì hé Xīguāshuāng Hánpiàn. Qīngrè jiědú, huǎnjiě yānhóu zhǒngtòng xiàoguǒ lìgānjiànyǐng.', vi: 'Tư vấn anh dùng kết hợp hộp Cốm cảm mạo thanh nhiệt này và viên ngậm Dưa hấu sương (Tây qua sương). Thanh nhiệt giải độc, giảm sưng đau họng hiệu nghiệm tức thì luôn.' },
      { s: 'Anh Tuấn', g: 'male', hz: '太好了，再给我拿两包医用创口贴和一瓶医用酒精喷雾，一起结账。', py: 'Tài hǎo le, zài gěi wǒ ná liǎng bāo yīyòng chuāngkǒutiē hé yì píng yīyòng jiǔjīng pēnwù, yìqǐ jiézhàng.', vi: 'Tốt quá, lấy thêm cho tôi 2 gói băng cá nhân y tế và một chai cồn xịt y tế nữa, thanh toán chung nhé.' }
    ],
    v: [{ hz: '处方药/非处方药', py: 'chǔfāngyào/fēichǔfāngyào', m: 'thuốc kê đơn (Rx) / thuốc không kê đơn (OTC)', hsk: 'HSK 5' }, { hz: '立竿见影', py: 'lìgānjiànyǐng', m: 'hiệu quả tức thì, trông thấy ngay', hsk: 'HSK 5' }, { hz: '创口贴', py: 'chuāngkǒutiē', m: 'băng dán vết thương (băng cá nhân/urgo)', hsk: 'HSK 3' }, { hz: '含片', py: 'hánpiàn', m: 'viên ngậm', hsk: 'HSK 4' }],
    g: [{ t: 'Thành ngữ khen ngợi công hiệu thuốc: 立竿见影 (Cắm sào thấy bóng ngay)', s: '效果立竿见影', e: 'Uống thuốc vào có tác dụng thần tốc, thấy rõ hiệu quả.' }],
    q: [{ q: 'Dược sĩ tư vấn dùng kết hợp Cốm cảm mạo thanh nhiệt với loại thuốc ngậm nào?', options: ['Kẹo bạc hà', 'Viên ngậm Tây qua sương (西瓜霜含片)', 'Viên C sủi', 'Thuốc đau bao tử'], a: 1, exp: 'Dược sĩ khuyên dùng 西瓜霜含片.' }],
    sp: { hz: '我想买一盒感冒药和一包创口贴。', py: 'Wǒ xiǎng mǎi yì hé gǎnmàoyào hé yì bāo chuāngkǒutiē.', vi: 'Tôi muốn mua một hộp thuốc cảm cúm và một gói băng cá nhân.' }
  },
  {
    num: 95, top: 10, lvl: 'HSK 3', title: 'Hỏi cách sử dụng thuốc', hz: '了解药物服用禁忌', py: 'Liǎojiě yàowù fúyòng jìnjì',
    sit: 'Minh đọc kỹ hướng dẫn sử dụng và hỏi lại dược sĩ về liều dùng và tác dụng phụ.',
    c: [{ n: 'Văn Minh', r: 'Người bệnh', g: 'male', a: '👦' }, { n: 'Dược sĩ', r: 'Người phát thuốc', g: 'female', a: '👩‍⚕️' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '药师您好，这盒消炎药和退烧药应该怎么服用？饭前吃还是饭后吃？', py: 'Yàoshī nín hǎo, zhè hé xiāoyányào hé tuìshāoyào yīnggāi zěnme fúyòng? Fànqián chī háishi fànhòu chī?', vi: 'Chào dược sĩ, hộp thuốc chống viêm và thuốc hạ sốt này nên uống thế nào ạ? Uống trước bữa ăn hay sau bữa ăn?' },
      { s: 'Dược sĩ', g: 'female', hz: '消炎药一日三次，一次两片，必须饭后半小时温水送服，避免刺激肠胃。', py: 'Xiāoyányào yí rì sān cì, yí cì liǎng piàn, bìxū fànhòu bàn xiǎoshí wēnshuǐ sòngfú, bìmiǎn cìjī chángwèi.', vi: 'Thuốc chống viêm ngày 3 lần, mỗi lần 2 viên, bắt buộc uống sau ăn nửa tiếng bằng nước ấm để tránh kích thích dạ dày.' },
      { s: 'Văn Minh', g: 'male', hz: '那退烧药呢？需要按时吃吗？', py: 'Nà tuìshāoyào ne? Xūyào ànshí chī ma?', vi: 'Thế còn thuốc hạ sốt ạ? Có cần uống đúng giờ không?' },
      { s: 'Dược sĩ', g: 'female', hz: '退烧药只有体温超过三十八度五时才吃，每次间隔至少四到六小时，服药期间严禁饮酒！', py: 'Tuìshāoyào zhǐyǒu tǐwēn chāoguò sānshíbā dù wǔ shí cái chī, měi cì jiàngé zhìshǎo sì dào liù xiǎoshí, fúyào qījiān yánjìn yǐnjiǔ!', vi: 'Thuốc hạ sốt chỉ khi nào thân nhiệt vượt quá 38 độ 5 mới uống, mỗi lần cách nhau ít nhất 4 đến 6 tiếng, trong thời gian dùng thuốc nghiêm cấm uống rượu bia!' }
    ],
    v: [{ hz: '服用', py: 'fúyòng', m: 'uống thuốc (dùng thuốc)', hsk: 'HSK 4' }, { hz: '温水送服', py: 'wēnshuǐ sòngfú', m: 'chiêu thuốc bằng nước ấm', hsk: 'HSK 4' }, { hz: '间隔', py: 'jiàngé', m: 'khoảng cách thời gian', hsk: 'HSK 4' }, { hz: '严禁饮酒', py: 'yánjìn yǐnjiǔ', m: 'nghiêm cấm uống rượu', hsk: 'HSK 4' }],
    g: [{ t: 'Liều lượng thuốc chuẩn: 一日X次，一次X片', s: '一日 + [Số lần] + 次，一次 + [Số lượng] + 片/粒', e: '一日三次，一次两片 (Ngày 3 lần, mỗi lần 2 viên).' }],
    q: [{ q: 'Dược sĩ nhấn mạnh điều kiêng kỵ tuyệt đối nào trong thời gian uống thuốc?', options: ['Không được ăn cơm', 'Nghiêm cấm uống rượu bia (严禁饮酒)', 'Không được đi lại', 'Không được uống nước'], a: 1, exp: 'Dược sĩ cảnh báo: 服药期间严禁饮酒.' }],
    sp: { hz: '这个药一日三次，必须饭后温水送服。', py: 'Zhège yào yí rì sān cì, bìxū fànhòu wēnshuǐ sòngfú.', vi: 'Thuốc này ngày 3 lần, bắt buộc uống sau bữa ăn cùng nước ấm.' }
  },
  {
    num: 96, top: 10, lvl: 'HSK 3', title: 'Nói về chế độ ăn uống', hz: '倡导健康膳食结构', py: 'Chàngdǎo jiànkāng shànshí jiégòu',
    sit: 'Quang và Lan trao đổi về thói quen ăn uống lành mạnh, giảm đường giảm muối.',
    c: [{ n: 'Hồng Quang', r: 'Người muốn giảm cân', g: 'male', a: '👨' }, { n: 'Hương Lan', r: 'Người chú trọng ăn lành mạnh', g: 'female', a: '👩' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '香兰，体检报告显示我血脂和尿酸偏高，医生建议我调整饮食结构。', py: 'Xiānglán, tǐjiǎn bàogào xiǎnshì wǒ xuèzhǐ hé niàosuān piān gāo, yīshēng jiànyì wǒ tiáozhěng yǐnshí jiégòu.', vi: 'Hương Lan, phiếu khám sức khỏe cho thấy mỡ máu và axit uric của anh hơi cao, bác sĩ khuyên anh nên điều chỉnh chế độ ăn uống.' },
      { s: 'Hương Lan', g: 'female', hz: '现代上班族重油重盐、外卖吃得多，很容易亚健康！建议你践行“控糖、减盐、少油”。', py: 'Xiàndài shàngbānzú zhòng yóu zhòng yán, wàimài chī de duō, hěn róngyì yàjiànkāng! Jiànyì nǐ jiànxíng “kòng táng, jiǎn yán, shǎo yóu”.', vi: 'Dân văn phòng hiện đại ăn nhiều dầu nhiều muối, gọi đồ ăn ngoài nhiều nên rất dễ rơi vào tình trạng bán khỏe mạnh (sub-health)! Em khuyên anh nên thực hiện "kiểm soát đường, giảm muối, bớt dầu".' },
      { s: 'Hồng Quang', g: 'male', hz: '具体的食谱应该怎么搭配才科学营养呢？', py: 'Jùtǐ de shípǔ yīnggāi zěnme dāpèi cái kēxué yíngyǎng ne?', vi: 'Thực đơn cụ thể nên phối hợp thế nào mới khoa học và đủ dinh dưỡng?' },
      { s: 'Hương Lan', g: 'female', hz: '多吃粗粮全谷物，多吃深色蔬菜和优质蛋白，戒掉含糖奶茶和碳酸饮料，每天保证饮水两千毫升。', py: 'Duō chī cūliáng quángǔwù, duō chī shēnsè shūcài hé yōuzhì dànbái, jiè diào hántáng nǎichá hé tànsuān yǐnliào, měitiān bǎozhèng yǐnshuǐ liǎngqiān háoshēng.', vi: 'Ăn nhiều ngũ cốc nguyên hạt, nhiều rau màu thẫm và protein chất lượng cao, cai trà sữa có đường và nước ngọt có ga, đảm bảo uống 2000ml nước mỗi ngày.' }
    ],
    v: [{ hz: '膳食', py: 'shànshí', m: 'chế độ ăn uống, khẩu phần dinh dưỡng', hsk: 'HSK 5' }, { hz: '亚健康', py: 'yàjiànkāng', m: 'bán khỏe mạnh (tình trạng suy giảm sức khỏe tiềm ẩn)', hsk: 'HSK 5' }, { hz: '粗粮', py: 'cūliáng', m: 'ngũ cốc thô, gạo lứt', hsk: 'HSK 4' }, { hz: '优质蛋白', py: 'yōuzhì dànbái', m: 'protein chất lượng cao', hsk: 'HSK 5' }],
    g: [{ t: 'Khẩu hiệu dinh dưỡng hiện đại: 控糖、减盐、少油', s: '控糖 + 减盐 + 少油', e: 'Ba nguyên tắc ăn uống vàng ngừa bệnh chuyển hóa.' }],
    q: [{ q: 'Hương Lan khuyên Hồng Quang nên cai loại đồ uống nào?', options: ['Trà xanh', 'Nước khoáng', 'Trà sữa ngọt và nước ngọt có ga (含糖奶茶与碳酸饮料)', 'Nước ép hoa quả tươi'], a: 2, exp: 'Lan khuyên: 戒掉含糖奶茶和碳酸饮料.' }],
    sp: { hz: '平时饮食要少油少盐，多吃蔬菜水果。', py: 'Píngshí yǐnshí yào shǎo yóu shǎo yán, duō chī shūcài shuǐguǒ.', vi: 'Ăn uống hàng ngày nên ít dầu ít muối, ăn nhiều rau quả.' }
  },
  {
    num: 97, top: 10, lvl: 'HSK 3', title: 'Tập thể dục và giữ gìn sức khỏe', hz: '运动健身与养生', py: 'Yùndòng jiànshēn yǔ yǎngshēng',
    sit: 'Cường rủ Minh tham gia câu lạc bộ chạy bộ và duy trì thói quen tập dưỡng sinh.',
    c: [{ n: 'Trương Cường', r: 'Người yêu thể thao', g: 'male', a: '👨' }, { n: 'Văn Minh', r: 'Người bắt đầu rèn luyện', g: 'male', a: '👦' }],
    d: [
      { s: 'Trương Cường', g: 'male', hz: '文明，每天在电脑前坐太久颈椎容易僵硬，跟我一起慢跑健身吧！', py: 'Wénmíng, měitiān zài diànnǎo qián zuò tài jiǔ jǐngzhuī róngyì jiāngyìng, gēn wǒ yìqǐ mànpǎo jiànshēn ba!', vi: 'Văn Minh, ngày nào cũng ngồi máy tính lâu đốt sống cổ dễ bị đơ cứng lắm, đi chạy bộ rèn luyện với mình đi!' },
      { s: 'Văn Minh', g: 'male', hz: '好啊！我正想锻炼身体呢。跑步有什么科学讲究吗？', py: 'Hǎo a! Wǒ zhèng xiǎng duànliàn shēntǐ ne. Pǎobù yǒu shénme kēxué jiǎngjiu ma?', vi: 'Được đấy! Mình cũng đang muốn rèn luyện thân thể đây. Chạy bộ có điểm chú ý khoa học nào không?' },
      { s: 'Trương Cường', g: 'male', hz: '跑前充分热身动态拉伸，跑时注意呼吸节奏“两步一呼、两步一吸”，跑后静止拉伸防止肌肉酸痛。', py: 'Pǎo qián chōngfèn rèshēn dòngtài lāshēn, pǎo shí zhùyì hūxī jiézòu “liǎng bù yì hū, liǎng bù yì xī”, pǎo hòu jìngzhǐ lāshēn fángzhǐ jīròu suāntòng.', vi: 'Trước khi chạy khởi động giãn cơ động thật kỹ, khi chạy chú ý nhịp thở "hai bước thở ra, hai bước hít vào", sau khi chạy giãn cơ tĩnh chống đau nhức cơ.' },
      { s: 'Văn Minh', g: 'male', hz: '太专业了！持之以恒，生命在于运动，今晚操场见！', py: 'Tài zhuānyè le! Chízhīyǐhéng, shēngmìng zàiyú yùndòng, jīnwǎn cāochǎng jiàn!', vi: 'Chuyên nghiệp quá! Quyết tâm kiên trì, sự sống nằm ở vận động, tối nay hẹn ở sân vận động nhé!' }
    ],
    v: [{ hz: '颈椎', py: 'jǐngzhuī', m: 'đốt sống cổ', hsk: 'HSK 5' }, { hz: '拉伸', py: 'lāshēn', m: 'căng cơ, giãn cơ', hsk: 'HSK 4' }, { hz: '持之以恒', py: 'chízhīyǐhéng', m: 'kiên trì bền bỉ không ngừng', hsk: 'HSK 5' }, { hz: '生命在于运动', py: 'shēngmìng zàiyú yùndòng', m: 'sự sống nằm ở sự vận động (Voltaire)', hsk: 'HSK 4' }],
    g: [{ t: 'Danh ngôn sức khỏe kinh điển: 生命在于运动', s: '生命在于运动 (Shēngmìng zàiyú yùndòng)', e: 'Vận động là cội nguồn của sức khỏe và sự sống.' }],
    q: [{ q: 'Nhịp thở khi chạy bộ mà Trương Cường hướng dẫn là gì?', options: ['Một bước một thở', 'Hai bước một thở ra, hai bước một hít vào (两步一呼、两步一吸)', 'Nhịn thở', 'Thở nhanh dồn dập'], a: 1, exp: 'Cường dặn: "两步一呼、两步一吸".' }],
    sp: { hz: '生命在于运动，坚持锻炼才能保持健康。', py: 'Shēngmìng zàiyú yùndòng, jiānchí duànliàn cái néng bǎochí jiànkāng.', vi: 'Sự sống nằm ở vận động, kiên trì tập luyện mới duy trì được sức khỏe.' }
  },
  {
    num: 98, top: 10, lvl: 'HSK 3', title: 'Đưa người thân đi khám bệnh', hz: '陪同家人就医', py: 'Péitóng jiārén jiùyī',
    sit: 'Tuấn đưa bác gái đi khám khoa Cơ xương khớp và đẩy xe lăn hỗ trợ làm các xét nghiệm.',
    c: [{ n: 'Anh Tuấn', r: 'Người nhà đưa đi khám', g: 'male', a: '👱‍♂️' }, { n: 'Bác gái', r: 'Người bệnh lớn tuổi', g: 'female', a: '👵' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '大妈，您慢点儿坐下，我推着轮椅带您去一楼做膝关节磁共振检查。', py: 'Dàmā, nín màn diǎnr zuò xia, wǒ tuīzhe lúnyǐ dài nín qù yī lóu zuò xīguānjié cígòngzhèn jiǎnchá.', vi: 'Bác gái ơi, bác từ từ ngồi xuống, cháu đẩy xe lăn đưa bác xuống tầng 1 chụp cộng hưởng từ (MRI) khớp gối ạ.' },
      { s: 'Bác gái', g: 'female', hz: '哎，阿俊，多亏有你陪着我跑前跑后。医院这么大，我一个人真不知道该往哪儿走。', py: 'Āi, Ā Jùn, duōkuī yǒu nǐ péizhe wǒ pǎo qián pǎo hòu. Yīyuàn zhème dà, wǒ yí gè rén zhēn bù zhīdào gāi wǎng nǎr zǒu.', vi: 'Ôi, A Tuấn, may mà có cháu đi cùng chạy đôn chạy đáo giúp bác. Bệnh viện to thế này, một mình bác thật chẳng biết phải đi đâu.' },
      { s: 'Anh Tuấn', g: 'male', hz: '大妈您别见外，照顾您是应该的！检查单和医保卡我都拿着呢，核磁共振大概需要二十分钟。', py: 'Dàmā nín bié jiànwài, zhàogù nín shì yīnggāi de! Jiǎnchádān hé yībǎokǎ wǒ dōu názhe ne, hécígòngzhèn dàgài xūyào èrshí fēnzhōng.', vi: 'Bác đừng khách sáo coi như người ngoài ạ, chăm sóc bác là việc đương nhiên! Giấy chỉ định và thẻ bảo hiểm cháu cầm cả rồi, chụp MRI mất tầm 20 phút thôi ạ.' },
      { s: 'Bác gái', g: 'female', hz: '做核磁共振疼不疼啊？身上带的金属项链要摘下来吗？', py: 'Zuò hécígòngzhèn téng bu téng a? Shēnshang dài de jīnshǔ xiàngliàn yào zhāi xiàlai ma?', vi: 'Chụp cộng hưởng từ có đau không cháu? Dây chuyền kim loại đeo trên người có phải tháo ra không?' },
      { s: 'Anh Tuấn', g: 'male', hz: '完全不疼，就是机器声音有点响。项链和手表必须全部摘下来，不能带任何金属物品进检查室。', py: 'Wánquán bù téng, jiù shì jīqì shēngyīn yǒudiǎnr xiǎng. Xiàngliàn hé shǒubiǎo bìxū quánbù zhāi xiàlai, bù néng dài rènhé jīnshǔ wùpǐn jìn jiǎncháshì.', vi: 'Hoàn toàn không đau tí nào bác ạ, chỉ là tiếng máy hơi to thôi. Dây chuyền và đồng hồ bắt buộc phải tháo hết ra, không được mang bất kỳ đồ kim loại nào vào phòng chụp ạ.' }
    ],
    v: [{ hz: '轮椅', py: 'lúnyǐ', m: 'xe lăn', hsk: 'HSK 4' }, { hz: '磁共振/核磁', py: 'cígòngzhèn/hécí', m: 'chụp cộng hưởng từ (MRI)', hsk: 'HSK 5' }, { hz: '跑前跑后', py: 'pǎo qián pǎo hòu', m: 'chạy đôn chạy đáo lo toan chu đáo', hsk: 'HSK 5' }, { hz: '摘下来', py: 'zhāi xiàlai', m: 'tháo ra, cởi ra (trang sức)', hsk: 'HSK 3' }],
    g: [{ t: 'Quy tắc an toàn chụp MRI: 严禁携带金属', s: '必须把金属物品摘下来', e: 'Bắt buộc tháo trang sức kim loại trước khi vào phòng MRI.' }],
    q: [{ q: 'Tuấn dặn bác gái phải tháo thứ gì trước khi vào phòng chụp cộng hưởng từ (MRI)?', options: ['Giày dép', 'Áo khoác', 'Đồ kim loại như dây chuyền, đồng hồ (金属物品)', 'Kính mắt bằng nhựa'], a: 2, exp: 'Tuấn nhắc: 项链和手表必须全部摘下来，不能带金属物品.' }],
    sp: { hz: '做核磁共振检查前，请摘下身上所有的金属物品。', py: 'Zuò hécígòngzhèn jiǎnchá qián, qǐng zhāi xià shēnshang suǒyǒu de jīnshǔ wùpǐn.', vi: 'Trước khi chụp cộng hưởng từ, vui lòng tháo toàn bộ đồ kim loại trên người.' }
  },
  {
    num: 99, top: 10, lvl: 'HSK 3', title: 'Hỏi về kết quả xét nghiệm', hz: '查看并解读检验报告', py: 'Chákàn bìng jiědú jiǎnyàn bàogào',
    sit: 'Quang cầm kết quả xét nghiệm máu và chụp X-quang đến hỏi bác sĩ kết luận.',
    c: [{ n: 'Hồng Quang', r: 'Bệnh nhân', g: 'male', a: '👨' }, { n: 'Bác sĩ chuyên khoa', r: 'Bác sĩ đọc kết quả', g: 'female', a: '👩‍⚕️' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '大夫，这是我刚在自助机上打印的血常规化验单和胸部CT报告，请您过目。', py: 'Dàifu, zhè shì wǒ gāng zài zìzhùjī shang dǎyìn de xuèchángguī huàyàndān hé xiōngbù CT bàogào, qǐng nín guòmù.', vi: 'Bác sĩ, đây là phiếu xét nghiệm máu tổng quát và kết quả chụp CT ngực em vừa in ở cây tự động, xin bác sĩ xem giúp.' },
      { s: 'Bác sĩ chuyên khoa', g: 'female', hz: '白细胞计数和C反应蛋白都在正常参考值范围内，说明体内的细菌感染已经彻底被控制住了。', py: 'Báixìbāo jìshù hé C-fǎnyìng dànbái dōu zài zhèngcháng cānkǎozhí fànwéi nèi, shuōmíng tǐnèi de xìjūn gǎnrǎn yǐjīng chèdǐ bèi kòngzhì zhù le.', vi: 'Số lượng bạch cầu và chỉ số protein phản ứng C đều nằm trong giới hạn giá trị tham chiếu bình thường, chứng tỏ ổ nhiễm khuẩn trong cơ thể đã được khống chế hoàn toàn.' },
      { s: 'Hồng Quang', g: 'male', hz: '太好了！那胸部CT报告单上的微小结节要紧吗？', py: 'Tài hǎo le! Nà xiōngbù CT bàogàodān shang de wēixiǎo jiéjié yàojǐn ma?', vi: 'Mừng quá! Vậy nốt mờ nhỏ li ti trên kết quả chụp CT lồng ngực có đáng ngại không bác sĩ?' },
      { s: 'Bác sĩ chuyên khoa', g: 'female', hz: '只是三毫米的陈旧性良性钙化灶，不用任何药物干预，保持良好的生活习惯，每年定期随访复查即可。', py: 'Zhǐshì sān límǐ de chénjiùxìng liángxìng gàihuàzào, bú yòng rènhé yàowù gānyù, bǎochí liánghǎo de shēnghuó xíguàn, měinián dìngqī suífǎng fùchá jíkě.', vi: 'Chỉ là vết vôi hóa lành tính cũ kích thước 3mm thôi, không cần bất kỳ can thiệp dùng thuốc nào cả, duy trì thói quen sống lành mạnh, mỗi năm tái khám định kỳ theo dõi là được nhé.' }
    ],
    v: [{ hz: '血常规', py: 'xuèchángguī', m: 'xét nghiệm công thức máu toàn phần', hsk: 'HSK 5' }, { hz: '参考值', py: 'cānkǎozhí', m: 'chỉ số tham chiếu chuẩn', hsk: 'HSK 4' }, { hz: '要紧', py: 'yàojǐn', m: 'nghiêm trọng, đáng ngại', hsk: 'HSK 3' }, { hz: '随访', py: 'suífǎng', m: 'theo dõi định kỳ sau điều trị', hsk: 'HSK 5' }],
    g: [{ t: 'Hỏi mức độ nghiêm trọng: 要紧吗？ (Yàojǐn ma?)', s: '这件事情/这个病 + 要紧吗？', e: 'Không sao đâu: 不要紧 / 没事.' }],
    q: [{ q: 'Kết quả xét nghiệm máu cho thấy điều gì?', options: ['Nhiễm khuẩn nặng', 'Các chỉ số đều bình thường, đã khống chế được nhiễm khuẩn (指标在正常范围内)', 'Thiếu máu trầm trọng', 'Cần phẫu thuật gấp'], a: 1, exp: 'Bác sĩ nói: 白细胞都在正常范围内，感染已被控制.' }],
    sp: { hz: '所有化验指标都在正常范围内，恢复得很好。', py: 'Suǒyǒu huàyàn zhǐbiāo dōu zài zhèngcháng fànwéi nèi, huīfù de hěn hǎo.', vi: 'Mọi chỉ số xét nghiệm đều nằm trong mức bình thường, hồi phục rất tốt.' }
  },
  {
    num: 100, top: 10, lvl: 'HSK 3', title: 'Xin lời khuyên về sức khỏe', hz: '寻求专家健康建议', py: 'Xúnqiú zhuānjiā jiànkāng jiànyì',
    sit: 'Minh xin bác sĩ chuyên khoa dinh dưỡng lời khuyên về cách cải thiện chất lượng giấc ngủ và giảm căng thẳng.',
    c: [{ n: 'Văn Minh', r: 'Người cần tư vấn', g: 'male', a: '👦' }, { n: 'Bác sĩ tâm lý/sức khỏe', r: 'Chuyên gia tư vấn', g: 'female', a: '👩‍⚕️' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '医生，我最近经常失眠多梦，白天精神萎靡，工作学习效率很低。请问该如何调理？', py: 'Yīshēng, wǒ zuìjìn jīngcháng shīmián duōmèng, báitiān jīngshén wěimǐ, gōngzuò xuéxí xiàolǜ hěn dī. Qǐngwèn gāi rúhé tiáolǐ?', vi: 'Bác sĩ ơi, dạo này em hay bị mất ngủ mơ màng, ban ngày tinh thần uể oải, hiệu suất công việc học tập rất thấp. Xin hỏi em nên điều dưỡng thế nào ạ?' },
      { s: 'Bác sĩ tâm lý/sức khỏe', g: 'female', hz: '失眠往往与长期精神焦虑和睡前过度使用电子屏幕有关。首先要建立固定的睡眠节律。', py: 'Shīmián wǎngwǎng yǔ chángqī jīngshén jiāolǜ hé shuìqián guòdù shǐyòng diànzǐ píngmù yǒuguān. Shǒuxiān yào jiànlì gùdìng de shuìmián jiélǜ.', vi: 'Mất ngủ thường bắt nguồn từ lo âu tinh thần kéo dài và dùng màn hình điện thoại máy tính quá mức trước giờ ngủ. Trước hết em phải thiết lập nhịp sinh học giấc ngủ cố định.' },
      { s: 'Văn Minh', g: 'male', hz: '睡前有什么具体的放松技巧可以帮助快速入睡吗？', py: 'Shuìqián yǒu shénme jùtǐ de fàngsōng jìqiǎo kěyǐ bāngzhù kuàisù rùshuì ma?', vi: 'Trước khi đi ngủ có kỹ thuật thư giãn cụ thể nào giúp chìm vào giấc ngủ nhanh hơn không ạ?' },
      { s: 'Bác sĩ tâm lý/sức khỏe', g: 'female', hz: '睡前半小时放下手机，用温热水泡泡脚，练习“4-7-8”腹式深呼吸法。卧室光线调暗，温度保持在二十度左右最利于深度睡眠。', py: 'Shuìqián bàn xiǎoshí fàngxià shǒujī, yòng wēnrèshuǐ pàopao jiǎo, liànxí “sì-qī-bā” fùshì shēnhūxī fǎ. Wòshì guāngxiàn tiáodàn, wēndù bǎochí zài èrshí dù zuǒyòu zuì lìyú shēndù shuìmián.', vi: 'Trước khi ngủ nửa tiếng hãy buông điện thoại xuống, ngâm chân bằng nước ấm, tập bài thở bụng sâu "4-7-8". Giảm sáng đèn phòng ngủ, nhiệt độ giữ tầm 20 độ C là tối ưu nhất cho giấc ngủ sâu.' }
    ],
    v: [{ hz: '调理', py: 'tiáolǐ', m: 'điều dưỡng, tẩm bổ hồi phục', hsk: 'HSK 4' }, { hz: '失眠', py: 'shīmián', m: 'mất ngủ', hsk: 'HSK 4' }, { hz: '泡脚', py: 'pàojiǎo', m: 'ngâm chân nước ấm (thói quen dưỡng sinh Trung Quốc)', hsk: 'HSK 3' }, { hz: '深度睡眠', py: 'shēndù shuìmián', m: 'giấc ngủ sâu', hsk: 'HSK 5' }],
    g: [{ t: 'Bí quyết dưỡng sinh Trung Quốc: 睡前泡脚 (Ngâm chân trước khi ngủ)', s: '睡前用温热水泡脚', e: 'Kích thích huyệt vị lòng bàn chân giúp thư giãn thần kinh ngủ ngon.' }],
    q: [{ q: 'Bác sĩ khuyên Minh nên làm việc gì trước khi đi ngủ nửa tiếng?', options: ['Chạy bộ mệt nghỉ', 'Bỏ điện thoại xuống và ngâm chân nước ấm (放下手机并用温水泡脚)', 'Uống cà phê đậm đặc', 'Xem phim hành động'], a: 1, exp: 'Bác sĩ khuyên: 睡前半小时放下手机，用温水泡脚.' }],
    sp: { hz: '睡前用温热水泡脚，有助于提高睡眠质量。', py: 'Shuìqián yòng wēnrèshuǐ pàojiǎo, yǒuzhùyú tígāo shuìmián zhìliàng.', vi: 'Ngâm chân bằng nước ấm trước khi ngủ có lợi cho việc nâng cao chất lượng giấc ngủ.' }
  },

  // ==================== TOPIC 11: GIẢI TRÍ VÀ SỞ THÍCH (101 - 110) ====================
  {
    num: 101, top: 11, lvl: 'HSK 3', title: 'Nói về bộ phim yêu thích', hz: '畅聊心仪的电影作品', py: 'Chàngliáo xīnyí de diànyǐng zuòpǐn',
    sit: 'Tuấn và Trang hào hứng phân tích bộ phim hoạt hình đình đám 《Na Tra: Ma đồng giáng thế》.',
    c: [{ n: 'Anh Tuấn', r: 'Mê phim chiếu rạp', g: 'male', a: '👱‍♂️' }, { n: 'Huyền Trang', r: 'Yêu hoạt hình quốc phong', g: 'female', a: '👩' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '玄庄，你看过国产动画电影《哪吒之魔童降世》吗？那是我最近几年最喜欢的华语电影！', py: 'Xuán Zhuāng, nǐ kànguo guóchǎn dònghuà diànyǐng “Názhā Zhī Mótóng Jiàngshì” ma? Nà shì wǒ zuìjìn jǐ nián zuì xǐhuan de huáyǔ diànyǐng!', vi: 'Huyền Trang, cậu đã xem phim hoạt hình Trung Quốc "Na Tra: Ma đồng giáng thế" chưa? Đó là phim Hoa ngữ mình thích nhất mấy năm gần đây đấy!' },
      { s: 'Huyền Trang', g: 'female', hz: '我看过三遍！剧情颠覆了传统的封神演义设定，台词热血，特效制作水平完全不输好莱坞大片！', py: 'Wǒ kànguo sān biàn! Jùqíng diānfù le chuántǒng de Fēngshén Yǎnyì shèdìng, táicí rèxuè, tèxiào zhìzuò shuǐpíng wánquán bù shū Hǎiláiwù dàpiān!', vi: 'Mình xem tận 3 lần rồi! Kịch bản lật đổ khuôn mẫu cốt truyện Phong Thần Diễn Nghĩa truyền thống, lời thoại sôi sục nhiệt huyết, kỹ xảo đồ họa hoàn toàn không thua kém bom tấn Hollywood!' },
      { s: 'Anh Tuấn', g: 'male', hz: '哪句台词给你留下的印象最深刻？', py: 'Nǎ jù táicí gěi nǐ liú xià de yìnxiàng zuì shēnkè?', vi: 'Câu thoại nào để lại ấn tượng sâu sắc nhất cho cậu?' },
      { s: 'Huyền Trang', g: 'female', hz: '当然是那句“我命由我不由天，是魔是仙，我自己说了才算！”太鼓舞人心了！', py: 'Dāngrán shì nà jù “Wǒ mìng yóu wǒ bù yóu tiān, shì mó shì xiān, wǒ zìjǐ shuō le cái suàn!” Tài gǔwǔ rénxīn le!', vi: 'Đương nhiên là câu: "Mạng của ta do ta định chứ không do trời, là ma hay tiên, do chính ta quyết mới tính!" Cực kỳ truyền cảm hứng!' }
    ],
    v: [{ hz: '颠覆', py: 'diānfù', m: 'lật đổ khuôn mẫu cũ, đột phá', hsk: 'HSK 5' }, { hz: '热血', py: 'rèxuè', m: 'sôi nổi, nhiệt huyết dâng trào', hsk: 'HSK 4' }, { hz: '特效', py: 'tèxiào', m: 'kỹ xảo điện ảnh (special effects)', hsk: 'HSK 4' }, { hz: '鼓舞人心', py: 'gǔwǔ rénxīn', m: 'cổ vũ lòng người, truyền cảm hứng', hsk: 'HSK 5' }],
    g: [{ t: 'Câu thoại kinh điển phim Na Tra: 我命由我不由天', s: '我命由我不由天 (Mạng ta do ta tự quyết, không phụ thuộc vào số trời)', e: 'Khẳng định tinh thần làm chủ vận mệnh con người.' }],
    q: [{ q: 'Câu thoại nào trong phim Na Tra được Trang xem là ấn tượng nhất?', options: ['Muốn ăn sủi cảo', 'Mạng của ta do ta định chứ không do trời (我命由我不由天)', 'Hôm nay trời đẹp', 'Chào bạn'], a: 1, exp: 'Trang nhắc câu: 我命由我不由天，是魔是仙我自己说了算.' }],
    sp: { hz: '这部电影特效震撼，台词非常鼓舞人心。', py: 'Zhè bù diànyǐng tèxiào zhènhàn, táicí fēicháng gǔwǔ rénxīn.', vi: 'Bộ phim này kỹ xảo chấn động, lời thoại rất truyền cảm hứng.' }
  },
  {
    num: 102, top: 11, lvl: 'HSK 2', title: 'Rủ bạn đi xem phim', hz: '相约影院看大片', py: 'Xiāngyuē yǐngyuàn kàn dàpiān',
    sit: 'Minh rủ bạn thân cùng lớp đi xem suất chiếu phim IMAX 3D vào tối thứ Bảy.',
    c: [{ n: 'Văn Minh', r: 'Người rủ', g: 'male', a: '👦' }, { n: 'Đại Vệ', r: 'Bạn được rủ', g: 'male', a: '👨' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '大卫，这周六晚上有空吗？万达影城新上映了科幻大片《流浪地球3》，一起去看吧！', py: 'Dàwèi, zhè zhōuliù wǎnshang yǒu kòng ma? Wàndá Yǐngchéng xīn shàngyìng le kēhuàn dàpiān “Liúlàng Dìqiú sān”, yìqǐ qù kàn ba!', vi: 'Đại Vệ, tối thứ Bảy này rảnh không? Rạp Wanda vừa khởi chiếu bom tấn khoa học viễn tưởng "Địa cầu lưu lạc 3", cùng đi xem đi!' },
      { s: 'Đại Vệ', g: 'male', hz: '太棒了！我期待这部电影很久了！你想看哪个版本？普通3D还是IMAX巨幕？', py: 'Tài bàng le! Wǒ qīdài zhè bù diànyǐng hěn jiǔ le! Nǐ xiǎng kàn nǎge bǎnběn? Pǔtōng sān-D háishi IMAX jùmù?', vi: 'Tuyệt quá! Mình hóng bộ phim này lâu lắm rồi! Cậu muốn xem bản nào? 3D thường hay màn hình khổng lồ IMAX?' },
      { s: 'Văn Minh', g: 'male', hz: '这种大制作科幻片当然要看IMAX巨幕厅才过瘾！视觉音响效果完全不一样。', py: 'Zhè zhǒng dà zhìzuò kēhuànpiān dāngrán yào kàn IMAX jùmùtīng cái guòyǐn! Shìjué yīnxiǎng xiàoguǒ wánquán bù yíyàng.', vi: 'Phim viễn tưởng kinh phí khủng thế này đương nhiên phải xem phòng chiếu IMAX màn đại mới đã chứ! Hiệu ứng hình ảnh và âm thanh khác bọt hoàn toàn luôn.' },
      { s: 'Đại Vệ', g: 'male', hz: '行，我现在就在猫眼APP上选座订票，挑第七排正中间黄金观影区！散场后我请你吃夜宵！', py: 'Xíng, wǒ xiànzài jiù zài Māoyǎn APP shang xuǎnzuò dìngpiào, tiāo dì-qī pái zhèng zhōngjiān huángjīn guānyǐngqū! Sànchǎng hòu wǒ qǐng nǐ chī yèxiāo!', vi: 'Được, mình mở app Mắt Mèo (Maoyan) chọn ghế đặt vé luôn, chọn hàng thứ 7 chính giữa khu vực vị trí vàng! Tan rạp xong mình bao cậu ăn đêm!' }
    ],
    v: [{ hz: '上映', py: 'shàngyìng', m: 'công chiếu, ra rạp', hsk: 'HSK 4' }, { hz: '巨幕', py: 'jùmù', m: 'màn chiếu khổng lồ (IMAX screen)', hsk: 'HSK 4' }, { hz: '过瘾', py: 'guòyǐn', m: 'đã, thỏa thuê, sướng mắt', hsk: 'HSK 4' }, { hz: '散场', py: 'sànchǎng', m: 'tan rạp, hết suất chiếu', hsk: 'HSK 4' }],
    g: [{ t: 'Cảm giác thỏa thích: 才过瘾 (Cái guòyǐn)', s: 'Phải làm gì đó + 才过瘾', e: '看IMAX才过瘾 (Xem màn hình IMAX mới đã mắt).' }],
    q: [{ q: 'Họ quyết định chọn xem phim ở định dạng nào?', options: ['Xem trên điện thoại', 'Bản 2D lồng tiếng', 'Phòng chiếu màn hình lớn IMAX (IMAX巨幕厅)', 'Xem qua máy chiếu mini'], a: 2, exp: 'Minh nói: "当然要看IMAX巨幕厅才过瘾".' }],
    sp: { hz: '周末我们一起去看最新上映的电影，怎么样？', py: 'Zhōumò wǒmen yìqǐ qù kàn zuìxīn shàngyìng de diànyǐng, zěnmeyàng?', vi: 'Cuối tuần bọn mình cùng đi xem bộ phim mới ra rạp nhé, thấy sao?' }
  },
  {
    num: 103, top: 11, lvl: 'HSK 3', title: 'Nói chuyện về âm nhạc', hz: '品味华语流行与国风音乐', py: 'Pǐnwèi huáyǔ liúxíng yǔ guófēng yīnyuè',
    sit: 'Lan và Tuấn nghe danh sách nhạc yêu thích trên app NetEase Cloud Music và bình luận về ca từ.',
    c: [{ n: 'Hương Lan', r: 'Mê nhạc ballad', g: 'female', a: '👩' }, { n: 'Anh Tuấn', r: 'Mê nhạc Jay Chou', g: 'male', a: '👱‍♂️' }],
    d: [
      { s: 'Hương Lan', g: 'female', hz: '阿俊，你在听什么歌呢？耳机里传来的古筝和琵琶伴奏真悦耳。', py: 'Ā Jùn, nǐ zài tīng shénme gē ne? Érjī lǐ chuán lái de gǔzhēng hé pípá bànzòu zhēn yuè’ěr.', vi: 'A Tuấn, cậu đang nghe bài hát gì thế? Tiếng đệm đàn tranh và đàn tỳ bà truyền ra từ tai nghe nghe êm tai quá.' },
      { s: 'Anh Tuấn', g: 'male', hz: '是周杰伦的经典中国风歌曲《青花瓷》。方文山的作词充满了诗情画意，意境太绝了！', py: 'Shì Zhōu Jiélún de jīngdiǎn zhōngguó fēng gēqǔ “Qīnghuācí”. Fāng Wénshān de zuòcí chōngmǎn le shīqíng-huàyì, yìjìng tài jué le!', vi: 'Là bài hát phong cách Trung Hoa kinh điển "Thanh Hoa Từ" của Châu Kiệt Luân. Lời bài hát do Phương Văn Sơn viết ngập tràn chất thơ họa, ý cảnh đỉnh cao luôn!' },
      { s: 'Hương Lan', g: 'female', hz: '“天青色等烟雨，而我在等你”，这句歌词几乎每个学中文的人都会唱！', py: '“Tiānqīngsè děng yānyǔ, ér wǒ zài děng nǐ”, zhè jù gēcí jīhū měi gè xué zhōngwén de rén dōu huì chàng!', vi: '"Trời xanh màu ngọc đợi mưa phùn, còn anh đợi em", câu hát này hầu như ai học tiếng Trung cũng đều biết hát!' },
      { s: 'Anh Tuấn', g: 'male', hz: '对！现代流行编曲融入传统五声音阶，这种“国潮音乐”不仅旋律优美，还是学中文绝佳的素材。', py: 'Duì! Xiàndài liúxíng biānqǔ róngrù chuántǒng wǔshēng yīnjiē, zhè zhǒng “guócháo yīnyuè” bùjǐn xuánlǜ yōuměi, hái shì xué zhōngwén juéjiā de sùcái.', vi: 'Đúng thế! Hòa âm hiện đại lồng ghép ngũ cung truyền thống, dòng nhạc "Quốc trào" này không những giai điệu êm ái mà còn là nguồn tài liệu học tiếng Trung tuyệt hảo.' }
    ],
    v: [{ hz: '悦耳', py: 'yuè’ěr', m: 'êm tai, du dương', hsk: 'HSK 5' }, { hz: '诗情画意', py: 'shīqíng-huàyì', m: 'ngập tràn chất thơ chất họa', hsk: 'HSK 5' }, { hz: '旋律', py: 'xuánlǜ', m: 'giai điệu', hsk: 'HSK 4' }, { hz: '国潮', py: 'guócháo', m: 'làn sóng văn hóa truyền thống hiện đại', hsk: 'HSK 4' }],
    g: [{ t: 'Cặp liên từ tăng tiến: 不仅...还是... (Bùjǐn... hái shì...)', s: '不仅 + Điểm mạnh 1, 还 + Điểm mạnh 2', e: '不仅旋律优美，还是绝佳素材 (Không chỉ giai điệu hay mà còn là tài liệu tuyệt vời).' }],
    q: [{ q: 'Bài hát phong cách Trung Hoa kinh điển nào của Châu Kiệt Luân được hai bạn nhắc tới?', options: ['Sứ Thanh Hoa (青花瓷)', 'Dạ khúc', 'Hương lúa', 'Bong bóng tỏ tình'], a: 0, exp: 'Tuấn nhắc tới ca khúc 《青花瓷》.' }],
    sp: { hz: '这首歌旋律优美，充满了诗情画意。', py: 'Zhè shǒu gē xuánlǜ yōuměi, chōngmǎn le shīqíng-huàyì.', vi: 'Bài hát này giai điệu êm ái, ngập tràn chất thơ ý họa.' }
  },
  {
    num: 104, top: 11, lvl: 'HSK 3', title: 'Thảo luận về thể thao', hz: '交流乒乓球与羽毛球技艺', py: 'Jiāoliú pīngpāngqiú yǔ yǔmáoqiú jìyì',
    sit: 'Cường và Minh xem trận chung kết bóng bàn thế giới và cùng phân tích các cú đánh xoáy.',
    c: [{ n: 'Trương Cường', r: 'Cổ động viên thể thao', g: 'male', a: '👨' }, { n: 'Văn Minh', r: 'Bạn xem cùng', g: 'male', a: '👦' }],
    d: [
      { s: 'Trương Cường', g: 'male', hz: '文明，看刚才这个超级多板对拉回合！中国队的马龙正手抽球实在太刁钻了！', py: 'Wénmíng, kàn gāngcái zhège chāojí duō bǎn duìlā huíhé! Zhōngguó duì de Mǎ Lóng zhèngshǒu chōuqíu shízài tài diāozuān le!', vi: 'Văn Minh, xem pha đôi công giằng co siêu nhiều chạm vừa nãy kìa! Cú giật thuận tay của Mã Long đội Trung Quốc hiểm hóc quá chừng!' },
      { s: 'Văn Minh', g: 'male', hz: '不愧是乒坛“六边形战士”！无论落点控制还是弧圈球旋转，技术堪称完美无瑕。', py: 'Búkuì shì pīngtán “liùbiānxíng zhànshì”! Wúlùn luòdiǎn kòngzhì háishi húquānqiú xuánzhuǎn, jìshù kānchēng wánměi wúxiá.', vi: 'Xứng danh "chiến binh lục giác toàn diện" của làng bóng bàn! Bất kể kiểm soát điểm rơi hay độ xoáy bóng vòng cung, kỹ thuật đều đạt tầm hoàn mỹ không tì vết.' },
      { s: 'Trương Cường', g: 'male', hz: '周末我们学校体育馆有乒乓球和羽毛球友谊赛，我们要不要组个双打搭档报名？', py: 'Zhōumò wǒmen xuéxiào tǐyùguǎn yǒu pīngpāngqiú hé yǔmáoqiú yǒuyìsài, wǒmen yào bu yào zǔ gè shuāngdǎ dādàng bàomíng?', vi: 'Cuối tuần nhà thi đấu trường mình có giải giao hữu bóng bàn và cầu lông, hai đứa mình có lập cặp đôi đánh đôi đăng ký không?' },
      { s: 'Văn Minh', g: 'male', hz: '太棒了！我擅长前场网前截击，你擅长后场扣杀，我们珠联璧合，争取拿个名次！', py: 'Tài bàng le! Wǒ shàncháng qiánchǎng wǎngqián jiéjī, nǐ shàncháng hòuchǎng kòushā, wǒmen zhūlián-bìhé, zhēngqǔ ná gè míngcì!', vi: 'Quá đỉnh luôn! Mình giỏi bắt lưới cản bóng trên lưới, cậu giỏi đập bóng uy lực cuối sân, hai đứa kết hợp hoàn hảo, phấn đấu giật giải nhé!' }
    ],
    v: [{ hz: '乒乓球', py: 'pīngpāngqiú', m: 'bóng bàn (quốc bảo thể thao Trung Quốc)', hsk: 'HSK 3' }, { hz: '羽毛球', py: 'yǔmáoqiú', m: 'cầu lông', hsk: 'HSK 3' }, { hz: '六边形战士', py: 'liùbiānxíng zhànshì', m: 'chiến binh toàn diện mọi chỉ số', hsk: 'HSK 5' }, { hz: '珠联璧合', py: 'zhūlián-bìhé', m: 'kết hợp ăn ý hoàn hảo', hsk: 'HSK 5' }],
    g: [{ t: 'Thành ngữ ca ngợi sự kết hợp: 珠联璧合', s: '两人配合默契，珠联璧合', e: 'Hai người kết hợp hoàn hảo như ngọc phối với ngọc.' }],
    q: [{ q: 'Vận động viên bóng bàn Mã Long được mệnh danh là gì nhờ lối đánh toàn diện?', options: ['Vua tốc độ', 'Chiến binh lục giác (六边形战士)', 'Bức tường thép', 'Người bay'], a: 1, exp: 'Minh ca ngợi Mã Long là: “六边形战士”.' }],
    sp: { hz: '中国队的乒乓球技术堪称完美。', py: 'Zhōngguó duì de pīngpāngqiú jìshù kānchēng wánměi.', vi: 'Kỹ thuật bóng bàn của đội tuyển Trung Quốc đạt tầm hoàn hảo.' }
  },
  {
    num: 105, top: 11, lvl: 'HSK 3', title: 'Chơi trò chơi điện tử', hz: '组队联机玩电子游戏', py: 'Zǔduì liánjī wán diànzǐ yóuxì',
    sit: 'Quang và Tuấn ngồi trong phòng ký túc xá rủ nhau lập đội leo rank trong game moba.',
    c: [{ n: 'Hồng Quang', r: 'Game thủ', g: 'male', a: '👨' }, { n: 'Anh Tuấn', r: 'Bạn chơi cùng', g: 'male', a: '👱‍♂️' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '阿俊，今晚排位赛五排缺一个打野核心，开黑吗？上号！', py: 'Ā Jùn, jīnwǎn páiwèisài wǔ pái quē yí gè dǎyě héxīn, kāihēi ma? Shàng hào!', vi: 'A Tuấn, tối nay đánh rank 5 người đang thiếu một vị trí đi rừng gánh team, mở phòng lập team không? Đăng nhập game đi!' },
      { s: 'Anh Tuấn', g: 'male', hz: '来啦！我刚更新完王者荣耀新赛季补丁。今天必须冲上“最强王者”段位！', py: 'Lái la! Wǒ gāng gēngxīn wán Wángzhě Róngyào xīn sàijì bǔdīng. Jīntiān bìxū chōng shàng “Zuìqiáng Wángzhě” duànwèi!', vi: 'Tới liền! Mình vừa cập nhật xong bản vá mùa giải mới của Vương Giả Vinh Diệu. Hôm nay nhất định phải leo lên bậc "Chiến Tướng / Cao Thủ Tối Cường"!' },
      { s: 'Hồng Quang', g: 'male', hz: '我们选一套团控强力的阵容，你拿擅长的刺客李白，我选辅助庄周保你进场输出。', py: 'Wǒmen xuǎn yí tào tuánkòng qiánglì de zhènróng, nǐ ná shàncháng de cìkè Lǐ Bái, wǒ xuǎn fǔzhù Zhuāng Zhōu bǎo nǐ jìnchǎng shūchū.', vi: 'Tụi mình chọn đội hình khống chế giao tranh mạnh mẽ nhé, cậu lấy tướng sát thủ Lý Bạch tủ, mình pick tướng hỗ trợ Trang Chu bảo kê cậu lao vào xả sát thương.' },
      { s: 'Anh Tuấn', g: 'male', hz: '好嘞！开麦语音交流，多看小地图支援。稳扎稳打，今晚直接连胜不加班！', py: 'Hǎo lei! Kāi mài yǔyīn jiāoliú, duō kàn xiǎo dìtú zhīyuán. Wěnzhā-wěndǎ, jīnwǎn zhíjiē liánshèng bù jiābān!', vi: 'Ô cơ! Bật mic giao tiếp bằng giọng nói, nhớ soi map nhỏ hỗ trợ. Đánh chắc tay, tối nay thắng liền mạch không cày đêm!' }
    ],
    v: [{ hz: '开黑', py: 'kāihēi', m: 'mở phòng chơi game chung cùng bạn bè', hsk: 'HSK 4' }, { hz: '打野', py: 'dǎyě', m: 'đi rừng (thuật ngữ game MOBA)', hsk: 'HSK 4' }, { hz: '段位', py: 'duànwèi', m: 'bậc xếp hạng rank', hsk: 'HSK 4' }, { hz: '稳扎稳打', py: 'wěnzhā-wěndǎ', m: 'đánh vững chắc, chắc từng bước', hsk: 'HSK 5' }],
    g: [{ t: 'Thuật ngữ game mạng Trung Quốc: 开黑 (Kāihēi)', s: '今晚开黑吗？(Tối nay lập team chiến game không?)', e: 'Chỉ việc bạn bè tụ tập chơi game phối hợp cùng nhau.' }],
    q: [{ q: 'Họ rủ nhau chơi tựa game di động quốc dân nổi tiếng nào của Trung Quốc?', options: ['Vương Giả Vinh Diệu (王者荣耀)', 'Angry Birds', 'Đào vàng', 'Candy Crush'], a: 0, exp: 'Tuấn nói: "刚更新完王者荣耀新赛季".' }],
    sp: { hz: '今晚一起开黑玩游戏，打排位赛！', py: 'Jīnwǎn yìqǐ kāihēi wán yóuxì, dǎ páiwèisài!', vi: 'Tối nay cùng lập team chơi game, đánh xếp hạng nhé!' }
  },
  {
    num: 106, top: 11, lvl: 'HSK 3', title: 'Nói về sách và truyện', hz: '品读经典名著文学', py: 'Pǐndú jīngdiǎn míngzhù wénxué',
    sit: 'Minh và Trang trao đổi cảm nhận khi đọc bộ tiểu thuyết 《Tam Quốc Diễn Nghĩa》.',
    c: [{ n: 'Văn Minh', r: 'Mê Tam Quốc', g: 'male', a: '👦' }, { n: 'Huyền Trang', r: 'Người yêu văn học', g: 'female', a: '👩' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '玄庄，中国四大名著里，你觉得哪一部文学造诣最高？', py: 'Xuán Zhuāng, Zhōngguó sì dà míngzhù lǐ, nǐ juéde nǎ yí bù wénxué zàoyì zuì gāo?', vi: 'Huyền Trang, trong Tứ đại danh tác của Trung Quốc, cậu thấy tác phẩm nào thành tựu văn học uyên thâm nhất?' },
      { s: 'Huyền Trang', g: 'female', hz: '从人性的深度和文学艺术水准来看，首推曹雪芹的《红楼梦》，真是一部封建社会的百科全书。', py: 'Cóng rénxìng de shēndù hé wénxué yìshù shuǐzhǔn lái kàn, shǒutuī Cáo Xuěqín de “Hónglóumèng”, zhēn shì yí bù fēngjiàn shèhuì de bǎikē quánshū.', vi: 'Xét từ góc độ chiều sâu nhân tính và chuẩn mực nghệ thuật văn chương, đầu bảng phải kể đến "Hồng Lâu Mộng" của Tào Tuyết Cần, thật sự là một pho bách khoa toàn thư của xã hội phong kiến.' },
      { s: 'Văn Minh', g: 'male', hz: '我更热衷于《三国演义》，群雄逐鹿的历史沧桑感，还有诸葛亮“鞠躬尽瘁，死而后已”的忠诚，读来令人扼腕叹息。', py: 'Wǒ gèng rèzhōng yú “Sānguó Yǎnyì”, qúnxióng zhúlù de lìshǐ cāngsāng gǎn, hái yǒu Zhūgě Liàng “jūgōng-jìncuì, sǐ’érhòuyǐ” de zhōngchéng, dú lái lìng rén èwàn tànxī.', vi: 'Mình thì mê đắm "Tam Quốc Diễn Nghĩa" hơn, cảm giác thương hải tang điền lịch sử khi quần hùng tranh bá, rồi cả tấm lòng trung trinh "cúc cung tận tụy, đến thác mới thôi" của Gia Cát Lượng, đọc lên làm người ta phải trầm trồ thổn thức.' },
      { s: 'Huyền Trang', g: 'female', hz: '常言道“少不读水浒，老不读三国”。经典的魅力就在于不同年龄段重读，都会有全新的领悟。', py: 'Chángyándào “shào bù dú Shuǐhǔ, lǎo bù dú Sānguó”. Jīngdiǎn de mèilì jiù zàiyú bùtóng niánlíngduàn chóngdú, dōu huì yǒu quánxīn de lǐngwù.', vi: 'Người xưa thường nói "Trẻ không đọc Thủy Hử, già không đọc Tam Quốc". Sức hút của tác phẩm kinh điển chính là ở chỗ mỗi độ tuổi đọc lại, ta đều có những chiêm nghiệm hoàn toàn mới.' }
    ],
    v: [{ hz: '四大名著', py: 'sì dà míngzhù', m: 'Tứ đại danh tác văn học cổ điển Trung Hoa', hsk: 'HSK 5' }, { hz: '群雄逐鹿', py: 'qúnxióng zhúlù', m: 'quần hùng tranh bá', hsk: 'HSK 5' }, { hz: '鞠躬尽瘁', py: 'jūgōng-jìncuì', m: 'cúc cung tận tụy', hsk: 'HSK 5' }, { hz: '领悟', py: 'lǐngwù', m: 'lĩnh ngộ, giác ngộ tri thức', hsk: 'HSK 5' }],
    g: [{ t: 'Thành ngữ cổ trứ danh: 鞠躬尽瘁，死而后已', s: '鞠躬尽瘁，死而后已 (Cúc cung tận tụy, đến chết mới thôi)', e: 'Ca ngợi sự tận tụy hết lòng vì sự nghiệp công ích.' }],
    q: [{ q: 'Tác phẩm nào được mệnh danh là "bách khoa toàn thư của xã hội phong kiến"?', options: ['Tây Du Ký', 'Thủy Hử', 'Hồng Lâu Mộng (《红楼梦》)', 'Tam Quốc Diễn Nghĩa'], a: 2, exp: 'Trang nhận định: 《红楼梦》是一部百科全书.' }],
    sp: { hz: '经典著作的魅力在于每一次重读都有新的收获。', py: 'Jīngdiǎn zhùzuò de mèilì zàiyú měi yí cì chóngdú dōu yǒu xīn de shōuhuò.', vi: 'Sức hấp dẫn của tác phẩm kinh điển là mỗi lần đọc lại đều có thu hoạch mới.' }
  },
  {
    num: 107, top: 11, lvl: 'HSK 3', title: 'Sở thích chụp ảnh', hz: '摄影技巧与光影艺术', py: 'Shèyǐng jìqiǎo yǔ guāngyǐng yìshù',
    sit: 'Quang cầm máy ảnh cơ ống kính tele đi dạo chụp hoàng hôn Hồ Tây cùng Lan.',
    c: [{ n: 'Hồng Quang', r: 'Nhiếp ảnh gia nghiệp dư', g: 'male', a: '👨' }, { n: 'Hương Lan', r: 'Mẫu ảnh / bạn đi cùng', g: 'female', a: '👩' }],
    d: [
      { s: 'Hương Lan', g: 'female', hz: '洪光，你这台微单相机配的是什么镜头？拍出来的背景虚化效果太唯美了！', py: 'Hóng Guāng, nǐ zhè tái wēidān xiàngjī pèi de shì shénme jìngtóu? Pāi chūlai de bèijǐng xūhuà xiàoguǒ tài wéiměi le!', vi: 'Hồng Quang, chiếc máy ảnh không gương lật (mirrorless) này anh lắp ống kính gì thế? Hiệu ứng xóa phông hậu cảnh chụp ra thơ mộng quá!' },
      { s: 'Hồng Quang', g: 'male', hz: '这是85毫米F1.4的大光圈定焦人像镜头，特别擅长营造梦幻的光斑。', py: 'Zhè shì bāshíwǔ límǐ F1.4 de dà guāngquān dìngjiāo rénxiàng jìngtóu, tèbié shàncháng yíngzào mènghuàn de guāngbān.', vi: 'Đây là ống kính chụp chân dung tiêu cự cố định 85mm khẩu độ lớn F1.4, chuyên gia tạo hiệu ứng bokeh đốm sáng ảo diệu.' },
      { s: 'Hương Lan', g: 'female', hz: '现在正是傍晚日落的“黄金时刻”，光线柔和金黄，快帮我拍几张背影剪影照！', py: 'Xiànzài zhèng shì bàngwǎn rìluò de “huángjīn shíkè”, guāngxiàn róuhé jīnhuáng, kuài bāng wǒ pāi jǐ zhāng bèiyǐng jiǎnyǐng zhào!', vi: 'Bây giờ đúng là "khoảnh khắc vàng" lúc hoàng hôn buông xuống này, ánh sáng dịu nhẹ ánh vàng, chụp giúp em mấy tấm bóng ngược sáng (silhouette) phía sau đi anh!' },
      { s: 'Hồng Quang', g: 'male', hz: '站到石桥中央，侧身微微抬头看远方。三、二、一，咔嚓！完美利用了三分法构图，张张都是大片！', py: 'Zhàn dào shíqiáo zhōngyāng, cèshēn wēiwēi táitóu kàn yuǎnfāng. Sān, èr, yī, kāchā! Wánměi lìyòng le sānfēnfǎ gòutú, zhāngzhāng dōu shì dàpiān!', vi: 'Đứng vào giữa cầu đá, nghiêng người khẽ ngước nhìn về phương xa. Ba, hai, một, tách! Vận dụng hoàn hảo bố cục một phần ba, tấm nào tấm nấy đẹp như tạp chí!' }
    ],
    v: [{ hz: '微单', py: 'wēidān', m: 'máy ảnh mirrorless không gương lật', hsk: 'HSK 4' }, { hz: '虚化', py: 'xūhuà', m: 'xóa phông (bokeh)', hsk: 'HSK 5' }, { hz: '剪影', py: 'jiǎnyǐng', m: 'ảnh chụp ngược sáng bóng đen (silhouette)', hsk: 'HSK 5' }, { hz: '构图', py: 'gòutú', m: 'bố cục khung hình', hsk: 'HSK 4' }],
    g: [{ t: 'Thuật ngữ nhiếp ảnh: 三分法构图 (Bố cục 1/3)', s: '三分法构图 (Sānfēnfǎ gòutú)', e: 'Chia khung hình làm 9 ô để đặt chủ thể vào 4 điểm vàng.' }],
    q: [{ q: 'Thời điểm hoàng hôn chụp ánh sáng vàng dịu dàng được gọi là gì trong nhiếp ảnh?', options: ['Giờ ăn tối', 'Khoảnh khắc vàng (黄金时刻)', 'Nửa đêm', 'Bình minh'], a: 1, exp: 'Lan nhắc tới: “黄金时刻” (golden hour).' }],
    sp: { hz: '夕阳西下，逆光拍出来的剪影照片真唯美。', py: 'Xīyáng xī xià, nìguāng pāi chūlai de jiǎnyǐng zhàopiàn zhēn wéiměi.', vi: 'Hoàng hôn buông xuống, bức ảnh chụp ngược sáng thật thơ mộng.' }
  },
  {
    num: 108, top: 11, lvl: 'HSK 3', title: 'Tổ chức chuyến đi dã ngoại', hz: '筹备户外野餐活动', py: 'Chóubèi hùwài yěcān huódòng',
    sit: 'Nhóm bạn chuẩn bị thảm cỏ, đồ ăn picnic và loa bluetooth đi công viên dã ngoại.',
    c: [{ n: 'Bảo Ngọc', r: 'Người chuẩn bị đồ', g: 'female', a: '👩' }, { n: 'Văn Minh', r: 'Người hỗ trợ', g: 'male', a: '👦' }],
    d: [
      { s: 'Bảo Ngọc', g: 'female', hz: '文明，野餐垫、折叠桌椅我都装在后备箱了，食物清单检查过了吗？', py: 'Wénmíng, yěcāndiàn, zhédié zhuōyǐ wǒ dōu zhuāng zài hòubèixiāng le, shíwù qīngdān jiǎnchá guo le ma?', vi: 'Văn Minh, thảm dã ngoại, bàn ghế gấp mình xếp vào cốp sau xe hết rồi, danh sách đồ ăn cậu kiểm tra lại chưa?' },
      { s: 'Văn Minh', g: 'male', hz: '都备齐了！有自制的三明治、寿司卷、各色时令水果切盒，还有保温桶里的冰镇柠檬茶。', py: 'Dōu bèi qí le! Yǒu zìzhì de sānmíngzhì, shòusījuǎn, gèsè shílìng shuǐguǒ qiē hé, hái yǒu bǎowēntǒng lǐ de bīngzhèn níngméngchá.', vi: 'Chuẩn bị đầy đủ hết rồi! Có bánh mì kẹp sandwich tự làm, cuộn sushi, hộp hoa quả theo mùa cắt sẵn, và cả trà chanh đá trong bình giữ nhiệt.' },
      { s: 'Bảo Ngọc', g: 'female', hz: '太丰富了！带了飞盘和便携蓝牙音箱没有？吃饱了大家可以在草坪上做游戏。', py: 'Tài fēngfù le! Dài le fēipán hé biànxié lányá yīnxiāng méiyǒu? Chī bǎo le dàjiā kěyǐ zài cǎopíng shang zuò yóuxì.', vi: 'Phong phú quá! Đã mang theo đĩa bay và loa bluetooth mini chưa? Ăn no xong mọi người có thể chơi trò chơi trên bãi cỏ.' },
      { s: 'Văn Minh', g: 'male', hz: '都在我的双肩包里！另外我还带了驱蚊水和垃圾袋，野餐完我们一定要带走所有垃圾，做到无痕露营！', py: 'Dōu zài wǒ de shuāngjiānbāo lǐ! Lìngwài wǒ hái dài le qūwénshuǐ hé lājīdài, yěcān wán wǒmen yídìng yào dài zǒu suǒyǒu lājī, zuò dào wú hén lùyíng!', vi: 'Đều ở trong balo của mình rồi! Ngoài ra mình còn mang thuốc xịt chống muỗi và túi rác, dã ngoại xong nhất định phải dọn sạch mọi rác rưởi, tuân thủ nguyên tắc cắm trại không dấu vết!' }
    ],
    v: [{ hz: '野餐垫', py: 'yěcāndiàn', m: 'thảm trải dã ngoại, bạt picnic', hsk: 'HSK 3' }, { hz: '飞盘', py: 'fēipán', m: 'đĩa bay thể thao (frisbee)', hsk: 'HSK 4' }, { hz: '驱蚊水', py: 'qūwénshuǐ', m: 'nước xịt chống muỗi đốt', hsk: 'HSK 3' }, { hz: '无痕露营', py: 'wú hén lùyíng', m: 'cắm trại không để lại rác/dấu vết (Leave No Trace)', hsk: 'HSK 5' }],
    g: [{ t: 'Ý thức môi trường: 做到无痕露营', s: '做到 + 无痕露营 / 垃圾分类', e: 'Mang toàn bộ rác về để bảo vệ cảnh quan thiên nhiên.' }],
    q: [{ q: 'Hành động bảo vệ môi trường nào được Minh nhấn mạnh sau khi dã ngoại?', options: ['Chôn rác xuống cỏ', 'Mang hết rác đi, cắm trại không dấu vết (带走垃圾，无痕露营)', 'Bỏ rác xuống hồ', 'Đốt rác tại chỗ'], a: 1, exp: 'Minh nói: "做到无痕露营，带走所有垃圾".' }],
    sp: { hz: '野餐结束后，大家自觉收拾垃圾，爱护大自然。', py: 'Yěcān jiéshù hòu, dàjiā zìjué shōushi lājī, àihù dàzìrán.', vi: 'Sau khi dã ngoại kết thúc, mọi người tự giác thu dọn rác, bảo vệ thiên nhiên.' }
  },
  {
    num: 109, top: 11, lvl: 'HSK 3', title: 'Tham gia câu lạc bộ', hz: '加入大学兴趣社团', py: 'Jiārù dàxué xìngqù shètuán',
    sit: 'An tham gia ngày hội tuyển thành viên mới và đăng ký vào CLB Tranh biện Hán ngữ.',
    c: [{ n: 'Thúy An', r: 'Sinh viên đăng ký', g: 'female', a: '👧' }, { n: 'Chủ nhiệm CLB', r: 'Đàn anh phụ trách', g: 'male', a: '👨‍🎓' }],
    d: [
      { s: 'Chủ nhiệm CLB', g: 'male', hz: '学妹好！欢迎来到校辩论社百团大战招新摊位！你对辩论有了解吗？', py: 'Xuémèi hǎo! Huānyíng lái dào xiào biànlùnshè bǎituán dàzhàn zhāoxīn tānwèi! Nǐ duì biànlùn yǒu liǎojiě ma?', vi: 'Chào em khóa dưới! Chào mừng em đến với gian hàng tuyển quân ngày hội trăm CLB của CLB Tranh biện trường! Em có hiểu biết gì về tranh biện không?' },
      { s: 'Thúy An', g: 'female', hz: '学长好！我高中时拿过市级辩论赛最佳辩手，特别享受思维交锋和逻辑推演的快感。', py: 'Xuézhǎng hǎo! Wǒ gāozhōng shí ná guo shìjí biànlùnsài zuìjiā biànshǒu, tèbié xiǎngshòu sīwéi jiāofēng hé luóji tuīyǎn de kuàigǎn.', vi: 'Chào anh ạ! Hồi cấp 3 em từng đạt giải Tranh biện viên xuất sắc nhất giải cấp thành phố, em cực kỳ thích cảm giác giao thoa tư duy và lập luận logic.' },
      { s: 'Chủ nhiệm CLB', g: 'male', hz: '太棒了！我们社团不仅参加全国华语辩论锦标赛，每周还会举办读书会和即兴演讲培训。', py: 'Tài bàng le! Wǒmen shètuán bùjǐn cānjiā quánguó huáyǔ biànlùn jǐnbiāosài, měi zhōu hái huì jǔbàn dúshūhuì hé jíxìng yǎnjiǎng péixùn.', vi: 'Tuyệt vời quá! CLB tụi anh không chỉ tham gia giải Vô địch tranh biện Hoa ngữ toàn quốc, mà hàng tuần còn tổ chức câu lạc bộ đọc sách và đào tạo diễn thuyết ứng khẩu.' },
      { s: 'Thúy An', g: 'female', hz: '正合我意！这是我的报名表，希望能通过选拔考核，为社团争光！', py: 'Zhèng hé wǒ yì! Zhè shì wǒ de bàomíngbiǎo, xīwàng néng tōngguò xuǎnbá kǎohé, wèi shètuán zhēngguāng!', vi: 'Đúng ý nguyện của em rồi ạ! Đây là đơn đăng ký của em, hy vọng có thể vượt qua vòng thi tuyển chọn, mang vinh quang về cho CLB!' }
    ],
    v: [{ hz: '社团', py: 'shètuán', m: 'câu lạc bộ trường học', hsk: 'HSK 4' }, { hz: '辩论', py: 'biànlùn', m: 'tranh biện, biện luận', hsk: 'HSK 4' }, { hz: '即兴演讲', py: 'jíxìng yǎnjiǎng', m: 'diễn thuyết ứng khẩu không chuẩn bị trước', hsk: 'HSK 5' }, { hz: '争光', py: 'zhēngguāng', m: 'mang lại vinh quang, rạng danh', hsk: 'HSK 4' }],
    g: [{ t: 'Rất đúng ý nguyện: 正合我意 (Zhèng hé wǒ yì)', s: '正合我意！', e: 'Biểu đạt sự tán đồng tuyệt đối khi điều kiện khớp đúng mong muốn.' }],
    q: [{ q: 'Thúy An đã nộp đơn đăng ký tham gia câu lạc bộ nào?', options: ['CLB Nhảy Kpop', 'CLB Tranh biện trường (校辩论社)', 'CLB Nấu ăn', 'CLB Nhiếp ảnh'], a: 1, exp: 'An đăng ký vào CLB Tranh biện (校辩论社).' }],
    sp: { hz: '我报名加入了辩论社，希望能提升演讲口才。', py: 'Wǒ bàomíng jiārù le biànlùnshè, xīwàng néng tíshēng yǎnjiǎng kǒucái.', vi: 'Tôi đăng ký tham gia CLB tranh biện, hy vọng nâng cao tài ăn nói thuyết trình.' }
  },
  {
    num: 110, top: 11, lvl: 'HSK 3', title: 'Chia sẻ sở thích mới', hz: '交流新兴小众爱好', py: 'Jiāoliú xīnxīng xiǎozhòng àihào',
    sit: 'Quang và Tuấn khoe nhau về thú chơi lắp ráp mô hình Gundam và nuôi cây cảnh thủy sinh.',
    c: [{ n: 'Hồng Quang', r: 'Người mê thủy sinh', g: 'male', a: '👨' }, { n: 'Anh Tuấn', r: 'Người chơi Gundam', g: 'male', a: '👱‍♂️' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '洪光，周末去你家，看到客厅那个微型生态水草造景缸，太震撼了！', py: 'Hóng Guāng, zhōumò qù nǐ jiā, kàn dào kètīng nàge wēixíng shēngtài shuǐcǎo zàojǐng gāng, tài zhènhàn le!', vi: 'Hồng Quang, cuối tuần sang nhà anh, nhìn thấy bể thủy sinh tiểu cảnh sinh thái mini trong phòng khách, đỉnh thật sự luôn!' },
      { s: 'Hồng Quang', g: 'male', hz: '这是我最近迷上的新爱好“原生水草造景”。从挑选青龙石、沉木，到底床水质维护，特别解压。', py: 'Zhè shì wǒ zuìjìn mí shang de xīn àihào “yuánshēng shuǐcǎo zàojǐng”. Cóng tiāoxuǎn qīnglóngshí, chénmù, dào dǐchuáng shuǐzhì wéihù, tèbié jiěyā.', vi: 'Đây là sở thích mới anh mê mẩn dạo gần đây: "chơi thủy sinh nguyên sinh". Từ việc chọn đá Thanh Long, lũa trầm, đến duy trì chất lượng nước đáy nền, xả stress cực tốt.' },
      { s: 'Anh Tuấn', g: 'male', hz: '就像在家里浓缩了一片大自然！我最近也在玩机甲高达模型拼装，需要极大的耐心和精细度。', py: 'Jiù xiàng zài jiā lǐ nóngsuō le yí piàn dàzìrán! Wǒ zuìjìn yě zài wán jījiǎ gāodá móxíng pīnzhuāng, xūyào jídà de nàixīn hé jīngxìdù.', vi: 'Hệt như thu nhỏ cả một vùng thiên nhiên trong nhà! Gần đây em cũng đang chơi lắp ráp mô hình robot Gundam cơ giáp, đòi hỏi tính kiên nhẫn và sự tỉ mỉ cực cao.' },
      { s: 'Hồng Quang', g: 'male', hz: '专注一件热爱的事情，沉浸在心流状态中，是逃离生活内卷最好的避风港！', py: 'Zhuānzhù yí jiàn rè’ài de shìqing, chénjìn zài xīinliú zhuàngtài zhōng, shì táolí shēnghuó nèijuǎn zuì hǎo de bìfēnggǎng!', vi: 'Chuyên tâm vào một điều mình đam mê, đắm chìm trong trạng thái dòng chảy (flow state), chính là bến đỗ bình yên nhất để thoát khỏi vòng xoáy áp lực cuộc sống!' }
    ],
    v: [{ hz: '小众爱好', py: 'xiǎozhòng àihào', m: 'thú chơi ngách, sở thích tao nhã ít người chơi', hsk: 'HSK 5' }, { hz: '造景', py: 'zàojǐng', m: 'tạo cảnh quan, bố cục thủy sinh/tiểu cảnh', hsk: 'HSK 5' }, { hz: '心流', py: 'xīnliú', m: 'trạng thái dòng chảy tập trung tuyệt đối (flow state)', hsk: 'HSK 5' }, { hz: '避风港', py: 'bìfēnggǎng', m: 'bến đỗ bình yên, nơi trú ẩn an toàn', hsk: 'HSK 5' }],
    g: [{ t: 'Thành ngữ ẩn dụ nơi chốn bình an: 避风港 (Bìfēnggǎng)', s: '是...最好的避风港', e: 'Gia đình hay đam mê là bến đỗ bình yên nhất che chở tâm hồn.' }],
    q: [{ q: 'Hồng Quang có sở thích mới nào giúp giải tỏa căng thẳng?', options: ['Lái xe mạo hiểm', 'Chơi thủy sinh cây cảnh (原生水草造景)', 'Cá cược bóng đá', 'Ngủ nướng'], a: 1, exp: 'Quang chia sẻ sở thích 原生水草造景.' }],
    sp: { hz: '专注于自己的爱好，是缓解工作压力最好的方式。', py: 'Zhuānzhù yú zìjǐ de àihào, shì huǎnjiě gōngzuò yālì zuì hǎo de fāngshì.', vi: 'Tập trung vào sở thích của bản thân là cách xoa dịu áp lực công việc tốt nhất.' }
  },

  // ==================== TOPIC 12: CÔNG NGHỆ VÀ INTERNET (111 - 120) ====================
  {
    num: 111, top: 12, lvl: 'HSK 3', title: 'Mua máy tính mới', hz: '选购高性能笔记本电脑', py: 'Xuǎngòu gāo xìngnéng bǐjìběn diànnǎo',
    sit: 'Quang và bạn ra trung tâm điện tử Trung Quan Thôn chọn mua laptop đồ họa cấu hình mạnh.',
    c: [{ n: 'Hồng Quang', r: 'Người mua', g: 'male', a: '👨' }, { n: 'Tư vấn viên IT', r: 'Nhân viên bán hàng', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Hồng Quang', g: 'male', hz: '你好，我想买一台用来剪辑4K高清视频和跑深度学习模型的轻薄笔记本电脑。', py: 'Nǐ hǎo, wǒ xiǎng mǎi yì tái yònglái jiǎnjí 4K gāoqīng shìpín hé pǎo shēndù xuéxí móxíng de qīngbó bǐjìběn diànnǎo.', vi: 'Chào bạn, tôi muốn mua một chiếc laptop mỏng nhẹ dùng để dựng video 4K sắc nét và chạy mô hình học sâu.' },
      { s: 'Tư vấn viên IT', g: 'male', hz: '这款搭载最新一代酷睿i9处理器，配备RTX4080独立显卡，屏幕支持100% DCI-P3广色域，非常契合您的需求。', py: 'Zhè kuǎn dāzài zuìxīn yídài Kùruì i9 chǔlǐqì, pèibèi RTX4080 dúlì xiǎnkǎ, píngmù zhīchí bǎifēnzhī bǎi DCI-P3 guǎng sèyù, fēicháng qìhé nín de xūqiú.', vi: 'Mẫu này trang bị vi xử lý Intel Core i9 thế hệ mới nhất, card đồ họa rời RTX4080, màn hình hỗ trợ dải màu rộng 100% DCI-P3, cực kỳ ăn khớp với nhu cầu của anh.' },
      { s: 'Hồng Quang', g: 'male', hz: '在高负载运行时，散热风扇噪音大吗？机身接口丰富吗？', py: 'Zài gāo fùzài yùnxíng shí, sànrè fēngshàn zàoyīn dà ma? Jīshēn jiēkǒu fēngfù ma?', vi: 'Lúc chạy tác vụ nặng, quạt tản nhiệt có kêu to không? Các cổng kết nối trên thân máy có đa dạng không?' },
      { s: 'Tư vấn viên IT', g: 'male', hz: '采用双风扇液态金属散热架构，静音温控极佳。机身配备雷电4高速接口和全尺寸SD卡槽，导素材非常迅捷。', py: 'Cǎiyòng shuāng fēngshàn yètài jīnshǔ sànrè jiàgòu, jìngyīn wēnkòng jíjiā. Jīshēn pèibèi Léidiàn-sì gāosù jiēkǒu hé quán chǐcùn SD kǎcáo, dǎo sùcái fēicháng xùnjié.', vi: 'Máy áp dụng cấu trúc tản nhiệt kim loại lỏng quạt kép, kiểm soát nhiệt độ êm ái cực tốt. Thân máy có cổng Thunderbolt 4 tốc độ cao và khe cắm thẻ SD đầy đủ, xuất dữ liệu cực kỳ thần tốc.' }
    ],
    v: [{ hz: '笔记本电脑', py: 'bǐjìběn diànnǎo', m: 'máy tính xách tay (laptop)', hsk: 'HSK 3' }, { hz: '独立显卡', py: 'dúlì xiǎnkǎ', m: 'card đồ họa rời (GPU)', hsk: 'HSK 5' }, { hz: '散热', py: 'sànrè', m: 'tản nhiệt làm mát', hsk: 'HSK 4' }, { hz: '迅捷', py: 'xùnjié', m: 'nhanh chóng, thần tốc', hsk: 'HSK 5' }],
    g: [{ t: 'Lượng từ của máy tính: 台 (Tái)', s: '一台电脑 / 一台笔记本', e: 'Dùng 台 chỉ thiết bị máy móc điện tử lớn.' }],
    q: [{ q: 'Mẫu laptop được tư vấn trang bị card đồ họa nào?', options: ['Card liền', 'Card rời RTX4080 (RTX4080独立显卡)', 'Không có card', 'Card cũ'], a: 1, exp: 'Nhân viên nói: 配备RTX4080独立显卡.' }],
    sp: { hz: '这台电脑性能强劲，屏幕显示效果非常出色。', py: 'Zhè tái diànnǎo xìngnéng qiángjìn, píngmù xiǎnshì xiàoguǒ fēicháng chūsè.', vi: 'Chiếc máy tính này hiệu năng mạnh mẽ, màn hình hiển thị xuất sắc.' }
  },
  {
    num: 112, top: 12, lvl: 'HSK 2', title: 'Hỏi cách sử dụng điện thoại', hz: '向朋友请教手机功能', py: 'Xiàng péngyou qǐngjiào shǒujī gōngnéng',
    sit: 'Bác Trương nhờ Minh hướng dẫn cách bật định vị và đặt xe qua ứng dụng Didi trên điện thoại.',
    c: [{ n: 'Bác Trương', r: 'Người lớn tuổi', g: 'male', a: '👴' }, { n: 'Văn Minh', r: 'Thanh niên kiên nhẫn', g: 'male', a: '👦' }],
    d: [
      { s: 'Bác Trương', g: 'male', hz: '小阮啊，孩子们给我买了台智能手机，我想用滴滴打车，但怎么也找不到定位在哪儿开。', py: 'Xiǎo Ruǎn a, háizi men gěi wǒ mǎi le tái zhìnéng shǒujī, wǒ xiǎng yòng Dīdī dǎchē, dàn zěnme yě zhǎo bu dào dìngwèi zài nǎr kāi.', vi: 'Tiểu Nguyễn ơi, các con mua cho bác chiếc smartphone này, bác muốn dùng Didi đặt xe mà tìm mãi không thấy chỗ bật định vị ở đâu.' },
      { s: 'Văn Minh', g: 'male', hz: '张大爷，您别急，我教您！您从屏幕顶端轻轻往下一划，看，这有个“位置信息”图标，点亮它就行。', py: 'Zhāng dàyé, nín bié jí, wǒ jiāo nín! Nín cóng píngmù dǐngduān qīngqīng wǎng xià yí huá, kàn, zhè yǒu gè “wèizhì xìnxī” túbiāo, diǎnliàng tā jiù xíng.', vi: 'Bác Trương ơi bác đừng cuống, cháu chỉ bác! Bác vuốt nhẹ từ đỉnh màn hình xuống dưới, bác nhìn xem, ở đây có biểu tượng "Thông tin vị trí", chạm sáng nó lên là được.' },
      { s: 'Bác Trương', g: 'male', hz: '哎呀，真的出来了！那怎么输入我想去的高铁站呢？', py: 'Āiyā, zhēn de chūlai le! Nà zěnme shūrù wǒ xiǎng qù de gāotiězhàn ne?', vi: 'Ái chà, hiện ra thật này! Thế làm sao để nhập ga tàu cao tốc mà bác muốn đến hả cháu?' },
      { s: 'Văn Minh', g: 'male', hz: '您按住这个小话筒图标，直接对着手机说“北京南站”，系统就会自动识别文字帮您叫车啦！', py: 'Nín ànzhù zhège xiǎo huàtǒng túbiāo, zhíjiē duìzhe shǒujī shuō “Běijīng Nánzhàn”, xìtǒng jiù huì zìdòng shíbié wénzì bāng nín jiàochē la!', vi: 'Bác nhấn giữ biểu tượng micro nhỏ này, nói thẳng vào máy "Ga Nam Bắc Kinh", hệ thống sẽ tự động nhận diện chữ gọi xe cho bác luôn ạ!' }
    ],
    v: [{ hz: '位置信息/定位', py: 'wèizhì xìnxī/dìngwèi', m: 'định vị GPS vị trí', hsk: 'HSK 3' }, { hz: '图标', py: 'túbiāo', m: 'biểu tượng icon', hsk: 'HSK 4' }, { hz: '话筒', py: 'huàtǒng', m: 'micro thu âm', hsk: 'HSK 3' }, { hz: '语音识别', py: 'yǔyīn shíbié', m: 'nhận diện giọng nói', hsk: 'HSK 4' }],
    g: [{ t: 'Thao tác vuốt màn hình cảm ứng: 往下一划', s: '从 + Vị trí + 往 + Hướng + 一划/点', e: '从屏幕上方往下一划 (Vuốt từ mép trên màn hình xuống).' }],
    q: [{ q: 'Minh hướng dẫn bác Trương làm cách nào để nhập điểm đến không cần gõ chữ?', options: ['Vẽ lên màn hình', 'Bấm giữ micro nói bằng giọng nói (按住话筒语音识别)', 'Nhờ người qua đường', 'Gõ từng nét'], a: 1, exp: 'Minh chỉ: 按住小话筒对着手机说.' }],
    sp: { hz: '按住小话筒说话，手机会自动识别语音。', py: 'Ànzhù xiǎo huàtǒng shuōhuà, shǒujī huì zìdòng shíbié yǔyīn.', vi: 'Bấm giữ micro để nói, điện thoại sẽ tự động nhận diện giọng nói.' }
  },
  {
    num: 113, top: 12, lvl: 'HSK 3', title: 'Sửa lỗi máy tính', hz: '电脑蓝屏与故障排查', py: 'Diànnǎo lánpíng yǔ gùzhàng páichá',
    sit: 'Quang giúp đồng nghiệp khắc phục sự cố máy tính bị đơ và màn hình xanh chết chóc.',
    c: [{ n: 'Tiểu Lệ', r: 'Đồng nghiệp hoảng hốt', g: 'female', a: '👩' }, { n: 'Hồng Quang', r: 'Kỹ sư công nghệ', g: 'male', a: '👨‍💻' }],
    d: [
      { s: 'Tiểu Lệ', g: 'female', hz: '洪光快帮帮我！我的电脑刚才突然蓝屏死机了，我还没保存做了一下午的财报PPT呢！', py: 'Hóng Guāng kuài bāngbang wǒ! Wǒ de diànnǎo gāngcái tūrán lánpíng sǐjī le, wǒ hái méi bǎocún zuò le yí xiàwǔ de cáibào PPT ne!', vi: 'Hồng Quang cứu em với! Máy tính của em vừa nãy đột ngột màn hình xanh đứng máy rồi, em còn chưa kịp lưu slide báo cáo tài chính làm cả buổi chiều nữa!' },
      { s: 'Hồng Quang', g: 'male', hz: '别慌，强制关机可能导致文件损坏。我先查看一下蓝屏终止代码，提示是内存溢出和驱动冲突。', py: 'Bié huāng, qiángzhì guānjī kěnéng dǎozhì wénjiàn sǔnhuài. Wǒ xiān chákàn yíxià lánpíng zhōngzhǐ dàimǎ, tíshì shì nèicún yìchū hé qūdòng chōngtū.', vi: 'Đừng cuống, tắt nguồn cưỡng bức có thể làm hỏng file. Anh xem mã lỗi dừng màn hình xanh trước, báo lỗi tràn bộ nhớ và xung đột driver.' },
      { s: 'Tiểu Lệ', g: 'female', hz: '那还有救吗？我的未保存文档能不能找回来？', py: 'Nà hái yǒu jiù ma? Wǒ de wèi bǎocún wéndàng néng bu néng zhǎo huílái?', vi: 'Vậy còn cứu được không anh? File chưa lưu của em có lấy lại được không?' },
      { s: 'Hồng Quang', g: 'male', hz: '我重启进入安全模式，回滚了刚更新的显卡驱动。Office开启了自动恢复功能，草稿完全找回来了！以后一定要开启云端实时自动备份！', py: 'Wǒ chóngqǐ jìnrù ānquán móshì, huígǔn le gāng gēngxīn de xiǎnkǎ qūdòng. Office kāiqǐ le zìdòng huīfù gōngnéng, cǎogǎo wánquán zhǎo huílái le! Yǐhòu yídìng yào kāiqǐ yúnduān shíshí zìdòng bèifèn!', vi: 'Anh khởi động lại vào Chế độ an toàn (Safe mode), lùi lại driver card màn hình vừa cập nhật rồi. Office có bật chức năng tự động phục hồi, bản nháp lấy lại trọn vẹn rồi nhé! Sau này nhất định phải bật tính năng tự sao lưu tức thời lên đám mây đấy!' }
    ],
    v: [{ hz: '蓝屏死机', py: 'lánpíng sǐjī', m: 'màn hình xanh chết chóc, đơ máy', hsk: 'HSK 5' }, { hz: '驱动冲突', py: 'qūdòng chōngtū', m: 'xung đột driver điều khiển', hsk: 'HSK 5' }, { hz: '安全模式', py: 'ānquán móshì', m: 'chế độ an toàn (Safe mode)', hsk: 'HSK 5' }, { hz: '云端备份', py: 'yúnduān bèifèn', m: 'sao lưu dữ liệu lên đám mây', hsk: 'HSK 4' }],
    g: [{ t: 'Hiện tượng máy tính đơ cứng: 死机 (Sǐjī)', s: '电脑死机了 / 手机死机了', e: 'Chỉ máy tính điện thoại bị treo, đơ cứng không thao tác được.' }],
    q: [{ q: 'Nguyên nhân dẫn tới máy tính bị màn hình xanh chết chóc là gì?', options: ['Nhiễm nước', 'Hết pin', 'Tràn bộ nhớ và xung đột driver (内存溢出与驱动冲突)', 'Cáp màn hình lỏng'], a: 2, exp: 'Quang đọc mã lỗi: 提示是内存溢出和驱动冲突.' }],
    sp: { hz: '重要文件要及时开启云端备份，防止电脑死机丢失。', py: 'Zhòngyào wénjiàn yào jíshí kāiqǐ yúnduān bèifèn, fángzhǐ diànnǎo sǐjī diūshī.', vi: 'Tài liệu quan trọng phải kịp thời sao lưu đám mây, đề phòng máy tính đơ mất dữ liệu.' }
  },
  {
    num: 114, top: 12, lvl: 'HSK 3', title: 'Nói về mạng xã hội', hz: '探讨社交媒体与生活', py: 'Tàntǎo shèjiāo méitǐ yǔ shēnghuó',
    sit: 'Trang và Minh trao đổi về tác động hai mặt của mạng xã hội như Douyin, Xiaohongshu.',
    c: [{ n: 'Huyền Trang', r: 'Người thích sáng tạo', g: 'female', a: '👩' }, { n: 'Văn Minh', r: 'Người thích đọc sách', g: 'male', a: '👦' }],
    d: [
      { s: 'Huyền Trang', g: 'female', hz: '文明，你平时用小红书和抖音吗？现在年轻人找攻略、学做饭都离不开这些平台。', py: 'Wénmíng, nǐ píngshí yòng Xiǎohóngshū hé Dǒuyīn ma? Xiànzài niánqīngrén zhǎo gōnglüè, xué zuòfàn dōu lí bù kāi zhèxiē píngtái.', vi: 'Văn Minh, bình thường cậu có dùng Tiểu Hồng Thư và Douyin (TikTok Trung) không? Giới trẻ bây giờ tìm cẩm nang du lịch, học nấu ăn đều không thể tách rời các nền tảng này.' },
      { s: 'Văn Minh', g: 'male', hz: '我也经常刷，短视频确实获取信息直观高效，但算法推荐太容易让人沉迷，不知不觉几个小时就过去了。', py: 'Wǒ yě jīngcháng shuā, duǎnshìpín quèshí huòqǔ xìnxī zhíguān gāoxiào, dàn suànfǎ tuījiàn tài róngyì ràng rén chénmí, bùzhī-bùjué jǐ gè xiǎoshí jiù guòqu le.', vi: 'Mình cũng hay lướt, video ngắn đúng là tiếp nhận thông tin trực quan nhanh gọn, nhưng thuật toán gợi ý quá dễ làm người ta mê mẩn, không hay không biết vài tiếng đồng hồ đã trôi vèo qua.' },
      { s: 'Huyền Trang', g: 'female', hz: '你说得很对！碎片化信息阅读容易让人丧失深度思考能力，还会引发容貌和生活焦虑。', py: 'Nǐ shuō de hěn duì! Suìpiànhuà xìnxī yuèdú róngyì ràng rén sàngshī shēndù sīkǎo nénglì, hái huì yǐnfā róngmào hé shēnghuó jiāolǜ.', vi: 'Cậu nói rất chuẩn! Đọc thông tin vụn vặt dễ khiến con người ta thui chột khả năng tư duy sâu sắc, lại còn làm dấy lên âu lo về ngoại hình và cuộc sống.' },
      { s: 'Văn Minh', g: 'male', hz: '所以我们要学会“数字排毒”，把社交媒体当作工具，而不是被算法支配生活的奴隶。', py: 'Suǒyǐ wǒmen yào xuéhuì “shùzì páidú”, bǎ shèjiāo méitǐ dàngzuò gōngjù, ér bú shì bèi suànfǎ zhīpèi shēnghuó de núlì.', vi: 'Vì thế chúng mình phải học cách "thanh lọc cai nghiện kỹ thuật số", coi mạng xã hội là công cụ chứ không phải biến mình thành nô lệ bị thuật toán chi phối cuộc sống.' }
    ],
    v: [{ hz: '小红书', py: 'Xiǎohóngshū', m: 'mạng xã hội Tiểu Hồng Thư (RED)', hsk: 'HSK 3' }, { hz: '碎片化', py: 'suìpiànhuà', m: 'phân mảnh, vụn vặt', hsk: 'HSK 5' }, { hz: '数字排毒', py: 'shùzì páidú', m: 'cai nghiện kỹ thuật số (digital detox)', hsk: 'HSK 5' }, { hz: '支配', py: 'zhīpèi', m: 'chi phối, thao túng', hsk: 'HSK 5' }],
    g: [{ t: 'Cụm từ thời gian trôi mau: 不知不觉 (Bùzhī-bùjué)', s: '不知不觉 + Thời gian + 就过去了', e: 'Lướt điện thoại không hay không biết mấy tiếng đã trôi qua.' }],
    q: [{ q: 'Mặt trái của việc đọc thông tin vụn vặt trên mạng xã hội được Trang chỉ ra là gì?', options: ['Tốn tiền', 'Làm thui chột khả năng tư duy sâu sắc (丧失深度思考能力)', 'Hỏng màn hình', 'Đau mắt'], a: 1, exp: 'Trang chỉ ra: 容易让人丧失深度思考能力.' }],
    sp: { hz: '合理使用社交媒体，不要让算法支配生活。', py: 'Hélǐ shǐyòng shèjiāo méitǐ, bú yào ràng suànfǎ zhīpèi shēnghuó.', vi: 'Sử dụng mạng xã hội hợp lý, đừng để thuật toán chi phối cuộc sống.' }
  },
  {
    num: 115, top: 12, lvl: 'HSK 3', title: 'Đăng ký tài khoản trực tuyến', hz: '注册网络平台账户', py: 'Zhùcè wǎngluò píngtái zhànghù',
    sit: 'Minh hướng dẫn bạn cách xác thực danh tính tên thật bằng hộ chiếu khi đăng ký tài khoản thanh toán.',
    c: [{ n: 'Văn Minh', r: 'Người rành công nghệ', g: 'male', a: '👦' }, { n: 'Anh Tuấn', r: 'Người đăng ký', g: 'male', a: '👱‍♂️' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '文明，我想注册一个中国铁路12306账号买高铁票，第一步需要填什么？', py: 'Wénmíng, wǒ xiǎng zhùcè yí gè Zhōngguó Tiělù 12306 zhànghào mǎi gāotiěpiào, dì-yī bù xūyào tián shénme?', vi: 'Văn Minh, mình muốn đăng ký tài khoản Đường sắt Trung Quốc 12306 để mua vé tàu cao tốc, bước đầu tiên cần điền gì?' },
      { s: 'Văn Minh', g: 'male', hz: '先下载官方App，点击“注册”。证件类型选择“外国护照”，输入姓名时必须和护照上的英文大写完全一致。', py: 'Xiān xiàzài guānfāng App, diǎnjī “zhùcè”. Zhèngjiàn lèixíng xuǎnzé “wàiguó hùzhào”, shūrù xìngmíng shí bìxū hé hùzhào shang de yīngwén dàxiě wánquán yízhì.', vi: 'Cậu tải app chính thức trước, ấn vào "Đăng ký". Loại giấy tờ chọn "Hộ chiếu nước ngoài", lúc nhập họ tên bắt buộc phải khớp 100% với chữ tiếng Anh in hoa trên hộ chiếu.' },
      { s: 'Anh Tuấn', g: 'male', hz: '密码设置有什么安全规范要求吗？', py: 'Mìmǎ shèzhì yǒu shénme ānquán guīfàn yāoqiú ma?', vi: 'Thiết lập mật khẩu có yêu cầu quy chuẩn an toàn nào không?' },
      { s: 'Văn Minh', g: 'male', hz: '密码长度要在八到二十位之间，必须同时包含大小写字母、数字和特殊符号。填完后输入手机收到的短信验证码就激活了。', py: 'Mìmǎ chángdù yào zài bā dào èrshí wèi zhījiān, bìxū tóngshí bāohán dàxiǎoxiě zìmǔ, shùzì hé tèshū fúhào. Tián wán hòu shūrù shǒujī shōudào de duǎnxìn yànzhèngmǎ jiù jīhuó le.', vi: 'Độ dài mật khẩu từ 8 đến 20 ký tự, bắt buộc chứa đồng thời chữ in hoa in thường, chữ số và ký tự đặc biệt. Điền xong nhập mã xác thực OTP gửi về điện thoại là kích hoạt tài khoản thành công.' }
    ],
    v: [{ hz: '注册', py: 'zhùcè', m: 'đăng ký tài khoản', hsk: 'HSK 4' }, { hz: '证件类型', py: 'zhèngjiàn lèixíng', m: 'loại giấy tờ tùy thân', hsk: 'HSK 4' }, { hz: '验证码', py: 'yànzhèngmǎ', m: 'mã xác thực OTP', hsk: 'HSK 3' }, { hz: '激活', py: 'jīhuó', m: 'kích hoạt tài khoản', hsk: 'HSK 4' }],
    g: [{ t: 'Yêu cầu tên hộ chiếu: 完全一致 (Hoàn toàn thống nhất)', s: '与护照上的英文大写完全一致', e: 'Tên tài khoản tàu xe máy bay phải khớp từng chữ cái in hoa trên hộ chiếu.' }],
    q: [{ q: 'Khi đăng ký tài khoản 12306, tên người nước ngoài cần nhập như thế nào?', options: ['Viết tắt', 'Khớp hoàn toàn với chữ in hoa trên hộ chiếu (和护照大写完全一致)', 'Dùng biệt danh', 'Viết chữ Hán bất kỳ'], a: 1, exp: 'Minh lưu ý: 必须和护照上的英文大写完全一致.' }],
    sp: { hz: '输入手机收到的短信验证码，完成账号注册。', py: 'Shūrù shǒujī shōudào de duǎnxìn yànzhèngmǎ, wánchéng zhànghào zhùcè.', vi: 'Nhập mã xác thực SMS nhận được từ điện thoại để hoàn tất đăng ký tài khoản.' }
  },
  {
    num: 116, top: 12, lvl: 'HSK 2', title: 'Hỏi mật khẩu mạng không dây', hz: '连接无线网络Wi-Fi', py: 'Liánjiē wúxiàn wǎngluò Wi-Fi',
    sit: 'An vào quán cà phê sách mở laptop học bài và hỏi nhân viên mật khẩu wifi.',
    c: [{ n: 'Thúy An', r: 'Khách hàng', g: 'female', a: '👧' }, { n: 'Nhân viên quán', r: 'Phục vụ bàn', g: 'male', a: '👨‍💼' }],
    d: [
      { s: 'Thúy An', g: 'female', hz: '服务员你好，请问你们店里的无线Wi-Fi密码是多少？', py: 'Fúwùyuán nǐ hǎo, qǐngwèn nǐmen diàn lǐ de wúxiàn Wi-Fi mìmǎ shì duōshao?', vi: 'Phục vụ ơi chào anh, xin hỏi mật khẩu mạng Wi-Fi của quán mình là bao nhiêu thế ạ?' },
      { s: 'Nhân viên quán', g: 'male', hz: 'Wi-Fi名称是“ReadingCoffee_5G”，密码贴在桌角的小立牌上了。', py: 'Wi-Fi míngchēng shì “ReadingCoffee_5G”, mìmǎ tiē zài zhuōjiǎo de xiǎo lìpái shang le.', vi: 'Tên Wi-Fi là "ReadingCoffee_5G", mật khẩu có dán trên biển mica nhỏ ở góc bàn rồi ạ.' },
      { s: 'Thúy An', g: 'female', hz: '我看到了，是八个8对吧？但我连上后弹出了一个认证页面。', py: 'Wǒ kàn dào le, shì bā gè bā duì ba? Dàn wǒ lián shang hòu tánchū le yí gè rènzhèng yèmiàn.', vi: 'Em thấy rồi, là 8 con số 8 đúng không ạ? Nhưng em kết nối xong thì bật ra một trang xác thực.' },
      { s: 'Nhân viên quán', g: 'male', hz: '是的，按照公共网络安全规定，输入您的手机号获取一条免费短信验证码，点击确认就可以高速上网了。', py: 'Shì de, ànzhào gōnggòng wǎngluò ānquán guīdìng, shūrù nín de shǒujīhào huòqǔ yì tiáo miǎnfèi duǎnxìn yànzhèngmǎ, diǎnjī quèrèn jiù kěyǐ gāosù shàngwǎng le.', vi: 'Đúng rồi ạ, theo quy định an toàn mạng công cộng, chị nhập số điện thoại nhận mã xác thực SMS miễn phí, ấn xác nhận là lướt web tốc độ cao được liền.' }
    ],
    v: [{ hz: '无线网络/Wi-Fi', py: 'wúxiàn wǎngluò/Wi-Fi', m: 'mạng wifi không dây', hsk: 'HSK 3' }, { hz: '立牌', py: 'lìpái', m: 'biển mica đứng để bàn', hsk: 'HSK 3' }, { hz: '认证页面', py: 'rènzhèng yèmiàn', m: 'trang xác thực đăng nhập captive portal', hsk: 'HSK 4' }, { hz: '上网', py: 'shàngwǎng', m: 'lướt web, vào mạng internet', hsk: 'HSK 2' }],
    g: [{ t: 'Hỏi mật khẩu chuẩn: 密码是多少？', s: '请问Wi-Fi密码是多少？', e: 'Câu giao tiếp thông dụng nhất tại các quán xá, khách sạn.' }],
    q: [{ q: 'Mật khẩu Wi-Fi của quán cà phê được dán ở đâu?', options: ['Trên tường', 'Góc bàn trên biển đứng nhỏ (桌角的小立牌)', 'Dưới gầm bàn', 'Trên trần nhà'], a: 1, exp: 'Nhân viên nói: 密码贴在桌角的小立牌上了.' }],
    sp: { hz: '请问Wi-Fi密码是多少？连上后网速很快。', py: 'Qǐngwèn Wi-Fi mìmǎ shì duōshao? Lián shang hòu wǎngxù hěn kuài.', vi: 'Xin hỏi mật khẩu Wi-Fi là bao nhiêu? Kết nối xong mạng chạy rất nhanh.' }
  },
  {
    num: 117, top: 12, lvl: 'HSK 2', title: 'Gọi video với bạn bè', hz: '微信视频通话交流', py: 'Wēixìn shìpín tōnghuà jiāoliú',
    sit: 'Mai gọi video WeChat khoe với bạn ở Việt Nam về ký túc xá mới trang hoàng đón Giáng sinh.',
    c: [{ n: 'Thanh Mai', r: 'Người gọi video', g: 'female', a: '👧' }, { n: 'Thu Trang', r: 'Bạn ở Việt Nam', g: 'female', a: '👩' }],
    d: [
      { s: 'Thanh Mai', g: 'female', hz: '嗨，阿庄！能看清我的画面吗？听得清声音吗？', py: 'Hāi, Ā Zhuāng! Néng kànqīng wǒ de huàmiàn ma? Tīng de qīng shēngyīn ma?', vi: 'Hi A Trang! Nhìn rõ hình ảnh của mình không? Nghe rõ tiếng không cậu?' },
      { s: 'Thu Trang', g: 'female', hz: '听得很清楚！你那边网速真给力，一点儿也不卡顿。你在宿舍吗？', py: 'Tīng de hěn qīngchu! Nǐ nàbian wǎngxù zhēn gěilì, yìdiǎnr yě bù kǎdùn. Nǐ zài sùshè ma?', vi: 'Nghe rõ lắm! Tốc độ mạng bên cậu xịn thật đấy, không giật lag tí nào. Cậu đang ở ký túc xá à?' },
      { s: 'Thanh Mai', g: 'female', hz: '对啊，我切换一下后置摄像头，你看！我们把宿舍布置了圣诞彩灯和小彩旗，温馨吧？', py: 'Duì a, wǒ qiēhuàn yíxià hòuzhì shèxiàngtóu, nǐ kàn! Wǒmen bǎ sùshè bùzhì le shèngdàn cǎidēng hé xiǎo cǎiqí, wēnxīn ba?', vi: 'Đúng rồi, mình chuyển sang camera sau cho cậu xem nhé! Tụi mình trang trí ký túc xá bằng đèn led Giáng sinh và cờ hoa nhỏ, ấm cúng không?' },
      { s: 'Thu Trang', g: 'female', hz: '太有仪式感了！看到你状态这么好，我就彻底放心啦！', py: 'Tài yǒu yíshìgǎn le! Kàn dào nǐ zhuàngtài zhème hǎo, wǒ jiù chèdǐ fàngxīn la!', vi: 'Chill và ngập tràn cảm giác nghi thức luôn! Thấy cậu khỏe khoắn tươi tắn thế này là mình yên tâm hẳn rồi!' }
    ],
    v: [{ hz: '视频通话', py: 'shìpín tōnghuà', m: 'gọi điện thoại video call', hsk: 'HSK 3' }, { hz: '卡顿', py: 'kǎdùn', m: 'giật lag, đứng hình mạng', hsk: 'HSK 4' }, { hz: '后置摄像头', py: 'hòuzhì shèxiàngtóu', m: 'camera sau điện thoại', hsk: 'HSK 4' }, { hz: '仪式感', py: 'yíshìgǎn', m: 'cảm giác chỉn chu, cảm giác nghi thức', hsk: 'HSK 5' }],
    g: [{ t: 'Bổ ngữ khả năng nghe/nhìn: 听得清 / 看得清', s: '听/看 + 得/不 + 清楚', e: '听得清 (Nghe rõ), 听不清 (Nghe không rõ).' }],
    q: [{ q: 'Chất lượng cuộc gọi video giữa Mai và Trang thế nào?', options: ['Mạng chập chờn', 'Hình ảnh mờ tịt', 'Rất mượt mà, không hề bị giật lag (一点儿也不卡顿)', 'Bị ngắt kết nối'], a: 2, exp: 'Trang khen: "一点儿也不卡顿".' }],
    sp: { hz: '视频画面很清晰，声音听得很清楚。', py: 'Shìpín huàmiàn hěn qīngxī, shēngyīn tīng de hěn qīngchu.', vi: 'Hình ảnh video rất sắc nét, âm thanh nghe rất rõ.' }
  },
  {
    num: 118, top: 12, lvl: 'HSK 4', title: 'Thảo luận về trí tuệ nhân tạo', hz: '探讨人工智能与AI大模型', py: 'Tàntǎo réngōng zhìnéng yǔ AI dàmóxíng',
    sit: 'Quang và Minh thảo luận về sự bùng nổ của các mô hình AI ngôn ngữ lớn như ChatGPT, DeepSeek.',
    c: [{ n: 'Hồng Quang', r: 'Kỹ sư công nghệ', g: 'male', a: '👨‍💻' }, { n: 'Văn Minh', r: 'Người học ngoại ngữ', g: 'male', a: '👦' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '洪光哥，最近生成式人工智能（AI）发展太惊人了！它会取代我们人类的语言翻译工作吗？', py: 'Hóng Guāng gē, zuìjìn shēngchéngshì réngōng zhìnéng (AI) fāzhǎn tài jīngrén le! Tā huì qǔdài wǒmen rénlèi de yǔyán fānyì gōngzuò ma?', vi: 'Anh Quang ơi, dạo này trí tuệ nhân tạo tạo sinh (Generative AI) phát triển kinh ngạc quá! Liệu nó có thay thế công việc biên phiên dịch của con người chúng ta không anh?' },
      { s: 'Hồng Quang', g: 'male', hz: 'AI大模型在通用文本翻译和格式转换上的确极具效率，但它缺乏人类的情感共鸣与文化深层底蕴。', py: 'AI dàmóxíng zài tōngyòng wénběn fānyì hé géshì zhuǎnhuàn shang díquè jí jù xiàolǜ, dàn tā quēfá rénlèi de qínggǎn gòngmíng yǔ wénhuà shēncéng dǐyùn.', vi: 'Mô hình ngôn ngữ lớn (LLM) quả thật dịch văn bản thông dụng và đổi định dạng cực kỳ hiệu quả, nhưng nó thiếu sự đồng cảm cảm xúc và bề dày chiều sâu văn hóa của con người.' },
      { s: 'Văn Minh', g: 'male', hz: '也就是说，机械翻译会被取代，但高层次的文学翻译和跨文化外交交涉依然需要人类？', py: 'Yějiùshìshuō, jīxiè fānyì huì bèi qǔdài, dàn gāocéngcì de wénxué fānyì hé kuà wénhuà wàijiāo jiāoshè yīrán xūyào rénlèi?', vi: 'Nghĩa là, dịch máy móc đơn giản sẽ bị thay thế, nhưng dịch thuật văn học đỉnh cao và đàm phán ngoại giao liên văn hóa vẫn cần con người?' },
      { s: 'Hồng Quang', g: 'male', hz: '正是如此！与其恐惧被淘汰，不如善用AI作为辅助工具提升生产力，成为“驾驭AI的超级个体”！', py: 'Zhèng shì rúcǐ! Yǔqí kǒngjù bèi táotài, bùrú shànyòng AI zuòwéi fǔzhù gōngjù tíshēng shēngchǎnlì, chéngwéi “jiàyù AI de chāojí gètǐ”!', vi: 'Chính xác là như vậy! Thay vì sợ hãi bị đào thải, chi bằng ta hãy giỏi tận dụng AI làm trợ thủ nâng cao năng suất, trở thành "cá thể siêu cấp làm chủ AI"!' }
    ],
    v: [{ hz: '人工智能', py: 'réngōng zhìnéng', m: 'trí tuệ nhân tạo (AI)', hsk: 'HSK 5' }, { hz: '取代', py: 'qǔdài', m: 'thay thế, soán ngôi', hsk: 'HSK 5' }, { hz: '共鸣', py: 'gòngmíng', m: 'sự đồng cảm, cộng hưởng tâm hồn', hsk: 'HSK 5' }, { hz: '驾驭', py: 'jiàyù', m: 'làm chủ, điều khiển thành thạo', hsk: 'HSK 5' }],
    g: [{ t: 'Ý là: 也就是说... (Yějiùshìshuō...)', s: '也就是说 + Kết luận logic suy ra', e: 'Dùng tóm lược và giải thích lại bản chất vấn đề.' }],
    q: [{ q: 'Theo Hồng Quang, đâu là điểm AI khó có thể thay thế được con người?', options: ['Tốc độ gõ phím', 'Sự đồng cảm cảm xúc và bề dày văn hóa (情感共鸣与文化底蕴)', 'Bộ nhớ lưu trữ', 'Tính toán số học'], a: 1, exp: 'Quang nhấn mạnh AI thiếu: 情感共鸣与文化深层底蕴.' }],
    sp: { hz: '善用人工智能工具，大幅提升我们的工作效率。', py: 'Shànyòng réngōng zhìnéng gōngjù, dàfú tíshēng wǒmen de gōngzuò xiàolǜ.', vi: 'Khéo léo tận dụng công cụ AI sẽ nâng cao vượt bậc hiệu suất làm việc.' }
  },
  {
    num: 119, top: 12, lvl: 'HSK 3', title: 'Mua sắm trực tuyến', hz: '网购与快递驿站取件', py: 'Wǎnggòu yǔ kuàidì yìzhàn qǔjiàn',
    sit: 'Tuấn nhận được mã lấy đồ từ trạm bưu cục Thái Điểu (Cainiao Station) và hướng dẫn bạn cách quét mã nhận bưu kiện.',
    c: [{ n: 'Anh Tuấn', r: 'Người nhận hàng', g: 'male', a: '👱‍♂️' }, { n: 'Thủ kho trạm chuyển phát', r: 'Nhân viên trạm', g: 'female', a: '👩‍💼' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '您好，我收到短信提醒，来菜鸟驿站取淘宝买的快递包裹。', py: 'Nín hǎo, wǒ shōudào duǎnxìn tíxǐng, lái Càiniǎo yìzhàn qǔ Táobǎo mǎi de kuàidì bāoguǒ.', vi: 'Chào chị, tôi nhận được tin nhắn báo, đến trạm Thái Điểu lấy bưu kiện hàng chuyển phát nhanh đặt trên Taobao.' },
      { s: 'Thủ kho trạm chuyển phát', g: 'female', hz: '请问取件码是多少？在货架编号开头是几？', py: 'Qǐngwèn qǔjiànmǎ shì duōshao? Zài huòjià biānhào kāitóu shì jǐ?', vi: 'Xin hỏi mã lấy hàng của anh là bao nhiêu? Đầu số trên kệ hàng là số mấy ạ?' },
      { s: 'Anh Tuấn', g: 'male', hz: '取件码是 3-2-5088，在3号货架第二层。', py: 'Qǔjiànmǎ shì sān-èr-wǔlíngbābā, zài sān hào huòjià dì-èr céng.', vi: 'Mã lấy hàng là 3-2-5088, ở giá số 3 tầng thứ hai ạ.' },
      { s: 'Thủ kho trạm chuyển phát', g: 'female', hz: '找到了，您核对一下包裹上的收件人手机尾号。拿到门口高拍仪下扫一下面单，完成出库就可以带走了。', py: 'Zhǎodào le, nín héduì yíxià bāoguǒ shang de shōujiànrén shǒujī wěihào. Ná dào ménkǒu gāopāiyí xià sǎo yíxià miàndān, wánchéng chūkù jiù kěyǐ dài zǒu le.', vi: 'Tìm thấy rồi, anh đối chiếu lại số đuôi điện thoại người nhận trên bưu phẩm nhé. Cầm ra máy quét chụp hình ở cửa quét mã vận đơn, hoàn tất xuất kho là mang về được rồi ạ.' }
    ],
    v: [{ hz: '网购', py: 'wǎnggòu', m: 'mua sắm online qua mạng', hsk: 'HSK 3' }, { hz: '菜鸟驿站', py: 'Càiniǎo yìzhàn', m: 'trạm giao nhận bưu phẩm Thái Điểu', hsk: 'HSK 4' }, { hz: '取件码', py: 'qǔjiànmǎ', m: 'mã số nhận kiện hàng', hsk: 'HSK 4' }, { hz: '面单', py: 'miàndān', m: 'phiếu vận đơn dán trên kiện hàng', hsk: 'HSK 4' }],
    g: [{ t: 'Quy trình lấy bưu phẩm ở Trung Quốc: 凭取件码去驿站', s: '凭取件码 + Đến trạm bưu cục + 自助出库', e: 'Nhận SMS có mã -> Ra kệ lấy -> Quét máy xuất kho.' }],
    q: [{ q: 'Hành khách cần đưa thông tin gì để lấy bưu phẩm tại trạm chuyển phát?', options: ['Giấy khai sinh', 'Mã nhận hàng (取件码)', 'Ảnh thẻ', 'Tiền mặt'], a: 1, exp: 'Tuấn đọc: "取件码是 3-2-5088".' }],
    sp: { hz: '凭手机短信里的取件码，随时去驿站取快递。', py: 'Píng shǒujī duǎnxìn lǐ de qǔjiànmǎ, suíshí qù yìzhàn qǔ kuàidì.', vi: 'Dựa vào mã lấy đồ trong tin nhắn, có thể ra bưu cục lấy hàng bất cứ lúc nào.' }
  },
  {
    num: 120, top: 12, lvl: 'HSK 4', title: 'Bảo mật thông tin cá nhân', hz: '防范网络电信诈骗与隐私安全', py: 'Fángfàn wǎngluò diànxìn zhàpiàn yǔ yǐnsī ānquán',
    sit: 'Minh nhận được cuộc gọi lạ mạo danh nhân viên hải quan và trao đổi cách phòng tránh lừa đảo viễn thông.',
    c: [{ n: 'Văn Minh', r: 'Người nhận cuộc gọi', g: 'male', a: '👦' }, { n: 'Cảnh sát an ninh mạng', r: 'Cán bộ phòng chống lừa đảo', g: 'female', a: '👩‍✈️' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '警察同志，刚才有人自称是北京海关，说我寄的国际包裹里查出违禁品，要我把钱转到所谓的“安全账户”配合调查！', py: 'Jǐngchá tóngzhì, gāngcái yǒurén zìchēng shì Běijīng hǎiguān, shuō wǒ jì de guójì bāoguǒ lǐ chá chū wéijìnpǐn, yào wǒ bǎ qián zhuǎn dào suǒwèi de “ānquán zhànghù” pèihé diàochá!', vi: 'Đồng chí cảnh sát ơi, vừa nãy có người tự xưng là hải quan Bắc Kinh, bảo kiện hàng quốc tế em gửi bị phát hiện có hàng cấm, yêu cầu em chuyển tiền vào cái gọi là "tài khoản an toàn" để phối hợp điều tra!' },
      { s: 'Cảnh sát an ninh mạng', g: 'female', hz: '这是典型的“冒充公检法”电信网络诈骗！公检法机关绝不会通过电话办案，更没有任何“安全账户”！', py: 'Zhè shì diǎnxíng de “màochōng gōng-jiǎn-fǎ” diànxìn wǎngluò zhàpiàn! Gōng-jiǎn-fǎ jīguān juébù huì tōngguò diànhuà bàn’àn, gèng méiyǒu rènhé “ānquán zhànghù”!', vi: 'Đây là chiêu trò lừa đảo viễn thông kinh điển "mạo danh cơ quan công an, viện kiểm sát, tòa án"! Cơ quan pháp luật tuyệt đối không bao giờ phá án qua điện thoại, càng không có bất kỳ "tài khoản an toàn" nào!' },
      { s: 'Văn Minh', g: 'male', hz: '幸好我留了个心眼，没把银行卡验证码告诉他！', py: 'Xìnghǎo wǒ liú le gè xīnyǎn, méi bǎ yínhángkǎ yànzhèngmǎ gàosu tā!', vi: 'May mà em đã đề cao cảnh giác, không đọc mã xác thực thẻ ngân hàng cho hắn!' },
      { s: 'Cảnh sát an ninh mạng', g: 'female', hz: '做得很对！牢记“三不原则”：不轻信、不泄露、不转账！手机立刻下载“国家反诈中心App”，开启预警拦截功能。', py: 'Zuò de hěn duì! Láojì “sān bù yuánzé”: bù qīngxìn, bù xièlòu, bù zhuǎnzhàng! Shǒujī lìkè xiàzài “Guójiā Fǎnlā Zhōngxīn App”, kāiqǐ yùjǐng lánjié gōngnéng.', vi: 'Em làm rất chuẩn! Hãy ghi nhớ sâu sắc "Nguyên tắc 3 Không": Không nhẹ dạ tin, Không tiết lộ thông tin, Không chuyển tiền! Tải ngay "App Trung tâm phòng chống lừa đảo quốc gia" trên điện thoại để bật tính năng cảnh báo chặn cuộc gọi nhé.' }
    ],
    v: [{ hz: '电信诈骗', py: 'diànxìn zhàpiàn', m: 'lừa đảo qua mạng viễn thông điện thoại', hsk: 'HSK 5' }, { hz: '留个心眼', py: 'liú gè xīnyǎn', m: 'đề cao cảnh giác, lưu ý cẩn trọng', hsk: 'HSK 4' }, { hz: '三不原则', py: 'sān bù yuánzé', m: 'Nguyên tắc 3 Không: Không tin, không lộ, không chuyển tiền', hsk: 'HSK 4' }, { hz: '反诈', py: 'fǎnzhuà', m: 'phòng chống lừa đảo', hsk: 'HSK 5' }],
    g: [{ t: 'Khẩu ngữ cảnh giác: 留个心眼 (Liú gè xīnyǎn)', s: '做事情要多留个心眼', e: 'Khuyên nhủ làm việc gì cũng cần cảnh giác để không bị lừa gạt.' }],
    q: [{ q: 'Cảnh sát mạng nhắc nhở "Nguyên tắc 3 Không" (三不原则) gồm những gì?', options: ['Không ăn, không uống, không ngủ', 'Không nhẹ dạ tin, không tiết lộ, không chuyển tiền (不轻信、不泄露、不转账)', 'Không dùng điện thoại', 'Không trả lời'], a: 1, exp: 'Cảnh sát dặn: 不轻信、不泄露、不转账.' }],
    sp: { hz: '提高安全意识，做到不轻信、不透露、不转账。', py: 'Tígāo ānquán yìshí, zuò dào bù qīngxìn, bù tòulù, bù zhuǎnzhàng.', vi: 'Nâng cao ý thức an toàn: không nhẹ dạ tin, không tiết lộ, không chuyển tiền.' }
  }
];
