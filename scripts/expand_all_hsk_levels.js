const fs = require('fs');
const path = require('path');

const dictPath = path.join(__dirname, 'data', 'dictionary.json');
let dictionary = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

const existingMap = new Map();
dictionary.forEach(w => existingMap.set(w.title, w));

// Extended authentic words across HSK 4, 5, 6
const richExtraList = [
  // --- HSK 4 ---
  {
    title: '艺术', pinyin: 'yìshù', meaning: 'nghệ thuật', pos: 'danh từ', level: 4, lesson: 4,
    exampleSentence: '京剧是一门独具魅力的传统艺术。', examplePinyin: 'Jīngjù shì yì mén dújù mèilì de chuántǒng yìshù.', exampleMeaning: 'Kinh kịch là một môn nghệ thuật truyền thống mang sức hút độc đáo.'
  },
  {
    title: '表扬', pinyin: 'biǎoyáng', meaning: 'biểu dương, khen ngợi', pos: 'động từ / danh từ', level: 4, lesson: 4,
    exampleSentence: '老师在班上表扬了他乐于助人的品质。', examplePinyin: 'Lǎoshī zài bān shang biǎoyáng le tā lèyú-zhùrén de pǐnzhì.', exampleMeaning: 'Thầy giáo biểu dương trước lớp phẩm chất thích giúp đỡ người khác của cậu ấy.'
  },
  {
    title: '脾气', pinyin: 'píqi', meaning: 'tính tình, tính khí', pos: 'danh từ', level: 4, lesson: 4,
    exampleSentence: '他脾气很好，从来不轻易对别人发火。', examplePinyin: 'Tā píqi hěn hǎo, cónglái bù qīngyì duì biérén fāhuǒ.', exampleMeaning: 'Tính anh ấy rất hiền, chưa bao giờ nổi nóng vô cớ với người khác.'
  },
  {
    title: '硕士', pinyin: 'shuòshì', meaning: 'thạc sĩ', pos: 'danh từ', level: 4, lesson: 4,
    exampleSentence: '他本科毕业后打算继续攻读硕士学位。', examplePinyin: 'Tā běnkē bìyè hòu dǎsuàn jìxù gōngdú shuòshì xuéwèi.', exampleMeaning: 'Sau khi tốt nghiệp đại học, anh ấy dự định tiếp tục học lên thạc sĩ.'
  },
  {
    title: '博士', pinyin: 'bóshì', meaning: 'tiến sĩ', pos: 'danh từ', level: 4, lesson: 4,
    exampleSentence: '王教授是计算机科学领域的博士生导师。', examplePinyin: 'Wáng jiàoshòu shì jìsuànjī kēxué lǐngyù de bóshìshēng dǎoshī.', exampleMeaning: 'Giáo sư Vương là giảng viên hướng dẫn nghiên cứu sinh tiến sĩ ngành khoa học máy tính.'
  },
  {
    title: '翻译', pinyin: 'fānyì', meaning: 'phiên dịch, dịch thuật', pos: 'động từ / danh từ', level: 4, lesson: 4,
    exampleSentence: '请把这段英文短文翻译成地道的中文。', examplePinyin: 'Qǐng bǎ zhè duàn Yīngwén duǎnwén fānyì chéng dìdao de Zhōngwén.', exampleMeaning: 'Xin vui lòng dịch đoạn văn tiếng Anh này sang tiếng Trung chuẩn xác.'
  },
  {
    title: '规定', pinyin: 'guīdìng', meaning: 'quy định', pos: 'danh từ / động từ', level: 4, lesson: 4,
    exampleSentence: '图书馆内保持安静是这里的基本规定。', examplePinyin: 'Túshūguǎn nèi bǎochí ānjìng shì zhèlǐ de jīběn guīdìng.', exampleMeaning: 'Giữ trật tự trong thư viện là quy định cơ bản ở đây.'
  },
  {
    title: '解释', pinyin: 'jiěshì', meaning: 'giải thích', pos: 'động từ / danh từ', level: 4, lesson: 4,
    exampleSentence: '老师耐心地向我们解释了这个语法点。', examplePinyin: 'Lǎoshī nàixīn de xiàng wǒmen jiěshì le zhè ge yǔfǎ diǎn.', exampleMeaning: 'Cô giáo kiên nhẫn giải thích cho chúng tôi điểm ngữ pháp này.'
  },
  {
    title: '警察', pinyin: 'jǐngchá', meaning: 'cảnh sát', pos: 'danh từ', level: 4, lesson: 4,
    exampleSentence: '遇到紧急危险，请第一时间拨打报警电话找警察。', examplePinyin: 'Yù dào jǐnjí wēixiǎn, qǐng dì-yī shíjiān bōdǎ bàojǐng diànhuà zhǎo jǐngchá.', exampleMeaning: 'Gặp nguy hiểm khẩn cấp, hãy lập tức gọi điện thoại báo cảnh sát.'
  },
  {
    title: '讨论', pinyin: 'tǎolùn', meaning: 'thảo luận', pos: 'động từ / danh từ', level: 4, lesson: 4,
    exampleSentence: '我们开会热烈讨论了下一个季度的营销方案。', examplePinyin: 'Wǒmen kāihuì rèliè tǎolùn le xià yí ge jìdù de yíngxiāo fāng\'àn.', exampleMeaning: 'Chúng tôi họp bàn sôi nổi về phương án tiếp thị cho quý tiếp theo.'
  },
  {
    title: '证明', pinyin: 'zhèngmíng', meaning: 'chứng minh, bằng cớ', pos: 'động từ / danh từ', level: 4, lesson: 4,
    exampleSentence: '事实充分证明，他的判断是完全正确的。', examplePinyin: 'Shìshí chōngfèn zhèngmíng, tā de pànduàn shì wánquán zhèngquè de.', exampleMeaning: 'Sự thật đã chứng minh đầy đủ rằng nhận định của anh ấy hoàn toàn chính xác.'
  },
  {
    title: '诚实', pinyin: 'chéngshí', meaning: 'thành thật, trung thực', pos: 'tính từ', level: 4, lesson: 4,
    exampleSentence: '做人一定要诚实守信，不能弄虚作假。', examplePinyin: 'Zuòrén yídìng yào chéngshí shǒuxìn, bù néng nòngxū-zuòjiǎ.', exampleMeaning: 'Làm người nhất định phải trung thực giữ chữ tín, không được dối trá lừa lọc.'
  },
  {
    title: '调查', pinyin: 'diàochá', meaning: 'điều tra, khảo sát', pos: 'động từ / danh từ', level: 4, lesson: 4,
    exampleSentence: '市场调查结果显示，新产品深受年轻人欢迎。', examplePinyin: 'Shìchǎng diàochá jiéguǒ xiǎnshì, xīn chǎnpǐn shēn shòu niánqīngrén huānyíng.', exampleMeaning: 'Kết quả khảo sát thị trường cho thấy sản phẩm mới rất được giới trẻ hoan nghênh.'
  },
  {
    title: '质量', pinyin: 'zhìliàng', meaning: 'chất lượng', pos: 'danh từ', level: 4, lesson: 4,
    exampleSentence: '我们公司始终把产品质量放在首要位置。', examplePinyin: 'Wǒmen gōngsī shǐzhōng bǎ chǎnpǐn zhìliàng fàng zài shǒuyào wèizhi.', exampleMeaning: 'Công ty chúng tôi luôn đặt chất lượng sản phẩm lên vị trí hàng đầu.'
  },
  {
    title: '购物', pinyin: 'gòuwù', meaning: 'mua sắm', pos: 'động từ', level: 4, lesson: 4,
    exampleSentence: '如今很多人都习惯在网络上在线购物。', examplePinyin: 'Rújīn hěn duō rén dōu xíguàn zài wǎngluò shang zàixiàn gòuwù.', exampleMeaning: 'Ngày nay rất nhiều người quen với việc mua sắm trực tuyến trên mạng.'
  },
  {
    title: '适合', pinyin: 'shìhé', meaning: 'phù hợp, thích hợp', pos: 'động từ', level: 4, lesson: 4,
    exampleSentence: '这件红色的毛衣非常适合你穿。', examplePinyin: 'Zhè jiàn hóngsè de máoyī fēicháng shìhé nǐ chuān.', exampleMeaning: 'Chiếc áo len màu đỏ này rất hợp với bạn.'
  },
  {
    title: '重点', pinyin: 'zhòngdiǎn', meaning: 'trọng điểm, điểm mấu chốt', pos: 'danh từ', level: 4, lesson: 4,
    exampleSentence: '期末复习时要抓住每一课的重点词汇与语法。', examplePinyin: 'Qīmò fùxí shí yào zhuāzhù měi yí kè de zhòngdiǎn cíhuì yǔ yǔfǎ.', exampleMeaning: 'Khi ôn tập cuối kỳ cần nắm chắc từ vựng và ngữ pháp trọng điểm của từng bài.'
  },
  {
    title: '钥匙', pinyin: 'yàoshi', meaning: 'chìa khóa', pos: 'danh từ', level: 4, lesson: 4,
    exampleSentence: '出门时别忘了带门钥匙。', examplePinyin: 'Chūmén shí bié wàng le dài mén yàoshi.', exampleMeaning: 'Khi ra ngoài đừng quên mang theo chìa khóa cửa.'
  },
  {
    title: '降低', pinyin: 'jiàngdī', meaning: 'hạ thấp, suy giảm', pos: 'động từ', level: 4, lesson: 4,
    exampleSentence: '通过改进生产工艺，我们有效降低了能源消耗。', examplePinyin: 'Tōngguò gǎijìn shēngchǎn gōngyì, wǒmen yǒuxiào jiàngdī le néngyuán xiāohào.', exampleMeaning: 'Thông qua cải tiến quy trình sản xuất, chúng tôi đã giảm bớt tiêu hao năng lượng hiệu quả.'
  },
  {
    title: '顺便', pinyin: 'shùnbiàn', meaning: 'nhân tiện, tiện thể', pos: 'phó từ', level: 4, lesson: 4,
    exampleSentence: '你下楼扔垃圾时，顺便帮我取个快递吧。', examplePinyin: 'Nǐ xià lóu rēng lājī shí, shùnbiàn bāng wǒ qǔ ge kuàidì ba.', exampleMeaning: 'Bạn xuống lầu vứt rác thì nhân tiện lấy giúp tôi gói bưu phẩm nhé.'
  },
  {
    title: '顾客', pinyin: 'gùkè', meaning: 'khách hàng', pos: 'danh từ', level: 4, lesson: 4,
    exampleSentence: '优质的服务让老顾客感到十分贴心。', examplePinyin: 'Yōuzhì de fúwù ràng lǎo gùkè gǎndào shífēn tiēxīn.', exampleMeaning: 'Dịch vụ chất lượng cao khiến các khách hàng thân thiết cảm thấy rất chu đáo ấm áp.'
  },
  {
    title: '首都', pinyin: 'shǒudū', meaning: 'thủ đô', pos: 'danh từ', level: 4, lesson: 4,
    exampleSentence: '北京是中华人民共和国的首都。', examplePinyin: 'Běijīng shì Zhōnghuá Rénmín Gònghéguó de shǒudū.', exampleMeaning: 'Bắc Kinh là thủ đô của Nước Cộng hòa Nhân dân Trung Hoa.'
  },

  // --- HSK 5 ---
  {
    title: '业务', pinyin: 'yèwù', meaning: 'nghiệp vụ, công việc chuyên môn', pos: 'danh từ', level: 5, lesson: 5,
    exampleSentence: '他熟悉公司的各项海外进出口业务。', examplePinyin: 'Tā shúxī gōngsī de gè xiàng hǎiwài jìnchūkǒu yèwù.', exampleMeaning: 'Anh ấy thông thạo các nghiệp vụ xuất nhập khẩu ra nước ngoài của công ty.'
  },
  {
    title: '主张', pinyin: 'zhǔzhāng', meaning: 'chủ trương, quan điểm', pos: 'động từ / danh từ', level: 5, lesson: 5,
    exampleSentence: '我们主张在平等互利的基础上开展国际合作。', examplePinyin: 'Wǒmen zhǔzhāng zài píngděng hùlì de jīchǔ shang kāizhǎn guójì hézuò.', exampleMeaning: 'Chúng tôi chủ trương triển khai hợp tác quốc tế trên nền tảng bình đẳng cùng có lợi.'
  },
  {
    title: '客观', pinyin: 'kèguān', meaning: 'khách quan', pos: 'tính từ', level: 5, lesson: 5,
    exampleSentence: '评价一件历史事件时，必须保持客观公正的态度。', examplePinyin: 'Píngjià yí jiàn lìshǐ shìjiàn shí, bìxū bǎochí kèguān gōngzhèng de tàidu.', exampleMeaning: 'Khi đánh giá một sự kiện lịch sử, bắt buộc phải giữ thái độ khách quan công bằng.'
  },
  {
    title: '传统', pinyin: 'chuántǒng', meaning: 'truyền thống', pos: 'danh từ / tính từ', level: 5, lesson: 5,
    exampleSentence: '中秋节吃月饼赏月是中国人民的优良传统。', examplePinyin: 'Zhōngqiūjié chī yuèbǐng shǎng yuè shì Zhōngguó rénmín de yōuliáng chuántǒng.', exampleMeaning: 'Tết Trung Thu ăn bánh nướng ngắm trăng là truyền thống tốt đẹp của nhân dân Trung Quốc.'
  },
  {
    title: '佩服', pinyin: 'pèifú', meaning: 'khâm phục, bái phục', pos: 'động từ', level: 5, lesson: 5,
    exampleSentence: '他在逆境中百折不挠的坚强意志令人由衷佩服。', examplePinyin: 'Tā zài nìjìng zhōng bǎizhé-bùnáo de jiānqiáng yìzhì lìngrén yóuzhōng pèifú.', exampleMeaning: 'Ý chí kiên cường bất khuất trong nghịch cảnh của anh ấy khiến người ta thán phục từ đáy lòng.'
  },
  {
    title: '冒险', pinyin: 'màoxiǎn', meaning: 'mạo hiểm', pos: 'động từ / danh từ', level: 5, lesson: 5,
    exampleSentence: '独自一人在暴风雨中登山是非常危险的冒险行为。', examplePinyin: 'Dúzì yì rén zài bàofēngyǔ zhōng dēngshān shì fēicháng wēixiǎn de màoxiǎn xíngwéi.', exampleMeaning: 'Một mình leo núi giữa cơn bão táp là hành vi mạo hiểm vô cùng nguy hiểm.'
  },
  {
    title: '刺激', pinyin: 'cìjī', meaning: 'kích thích, sôi động gây cấn', pos: 'động từ / tính từ', level: 5, lesson: 5,
    exampleSentence: '坐过山车非常惊险刺激，引得游人尖叫连连。', examplePinyin: 'Zuò guòshānchē fēicháng jīngxiǎn cìjī, yǐn de yóurén jiānjiào liánlián.', exampleMeaning: 'Đi tàu lượn siêu tốc rất mạo hiểm gay cấn, khiến du khách la hét không ngớt.'
  },
  {
    title: '勤奋', pinyin: 'qínfèn', meaning: 'cần cù, chăm chỉ', pos: 'tính từ', level: 5, lesson: 5,
    exampleSentence: '天才出自于勤奋与日积月累的苦练。', examplePinyin: 'Tiāncái chūzì yú qínfèn yǔ rìjī-yuèlěi de kǔliàn.', exampleMeaning: 'Thiên tài bắt nguồn từ sự cần cù và khổ luyện tích lũy từng ngày.'
  },
  {
    title: '合同', pinyin: 'hétong', meaning: 'hợp đồng', pos: 'danh từ', level: 5, lesson: 5,
    exampleSentence: '在签署商业合同之前，必须逐条审核法律条款。', examplePinyin: 'Zài qiānshǔ shāngyè hétong zhīqián, bìxū zhú tiáo shěnhé fǎlǜ tiáokuǎn.', exampleMeaning: 'Trước khi ký hợp đồng thương mại, cần thẩm định từng điều khoản pháp luật.'
  },
  {
    title: '哲学', pinyin: 'zhéxué', meaning: 'triết học', pos: 'danh từ', level: 5, lesson: 5,
    exampleSentence: '中国古代哲学蕴含着深刻的辩证思维。', examplePinyin: 'Zhōngguó gǔdài zhéxué yùnhán zhe shēnkè de biànzhèng sīwéi.', exampleMeaning: 'Triết học cổ đại Trung Hoa hàm chứa tư duy biện chứng sâu sắc.'
  },
  {
    title: '培养', pinyin: 'péiyǎng', meaning: 'bồi dưỡng, ươm tạo', pos: 'động từ', level: 5, lesson: 5,
    exampleSentence: '学校非常注重培养学生的独立思考与实践动手能力。', examplePinyin: 'Xuéxiào fēicháng zhùzhòng péiyǎng xuésheng de dúlì sīkǎo yǔ shíjiàn dòngshǒu nénglì.', exampleMeaning: 'Nhà trường rất chú trọng bồi dưỡng tư duy độc lập và năng lực thực hành cho học sinh.'
  },
  {
    title: '广泛', pinyin: 'guǎnfàn', meaning: 'rộng rãi, sâu rộng', pos: 'tính từ', level: 5, lesson: 5,
    exampleSentence: '数字化技术已在医疗、金融等领域得到了广泛应用。', examplePinyin: 'Shùzìhuà jìshù yǐ zài yīliáo, jīnróng děng lǐngyù dédào le guǎnfàn yìngyòng.', exampleMeaning: 'Công nghệ số đã được ứng dụng rộng rãi trong các lĩnh vực y tế, tài chính.'
  },
  {
    title: '彼此', pinyin: 'bǐcǐ', meaning: 'lẫn nhau, đôi bên', pos: 'đại từ', level: 5, lesson: 5,
    exampleSentence: '真正的朋友之间应当坦诚相待，彼此信任。', examplePinyin: 'Zhēnzhèng de péngyou zhījiān yīngdāng tǎnchéng xiāngdài, bǐcǐ xìnrèn.', exampleMeaning: 'Bạn bè chân chính nên đối đãi chân thành và tin tưởng lẫn nhau.'
  },
  {
    title: '成熟', pinyin: 'chéngshú', meaning: 'chín chắn, trưởng thành', pos: 'tính từ', level: 5, lesson: 5,
    exampleSentence: '经历过挫折后，他的思想比以前成熟了许多。', examplePinyin: 'Jīnglì guò cuòzhé hòu, tā de sīxiǎng bǐ yǐqián chéngshú le xǔduō.', exampleMeaning: 'Sau khi trải qua trắc trở, suy nghĩ của anh ấy đã chín chắn hơn trước rất nhiều.'
  },
  {
    title: '投资', pinyin: 'tóuzī', meaning: 'đầu tư', pos: 'động từ / danh từ', level: 5, lesson: 5,
    exampleSentence: '投资教育是回报率最高的人生选择。', examplePinyin: 'Tóuzī jiàoyù shì huíbàolǜ zuì gāo de rénshēng xuǎnzé.', exampleMeaning: 'Đầu tư vào giáo dục là lựa chọn có tỷ suất sinh lời cao nhất trong đời.'
  },
  {
    title: '智慧', pinyin: 'zhìhuì', meaning: 'trí tuệ, sự thông thái', pos: 'danh từ', level: 5, lesson: 5,
    exampleSentence: '老子道德经凝聚了古人博大精深的处世智慧。', examplePinyin: 'Lǎozǐ Dàodé Jīng níngjù le gǔrén bódà-jīngshēn de chǔshì zhìhuì.', exampleMeaning: 'Đạo Đức Kinh của Lão Tử kết tinh trí tuệ đối nhân xử thế uyên bác của người xưa.'
  },
  {
    title: '逻辑', pinyin: 'luóji', meaning: 'logic, tính hợp lý', pos: 'danh từ', level: 5, lesson: 5,
    exampleSentence: '这篇议论文论点明确，逻辑严密。', examplePinyin: 'Zhè piān yìlùnwén lùndiǎn míngquè, luóji yánmì.', exampleMeaning: 'Bài văn nghị luận này luận điểm rõ ràng, logic chặt chẽ.'
  },
  {
    title: '道德', pinyin: 'dàodé', meaning: 'đạo đức', pos: 'danh từ', level: 5, lesson: 5,
    exampleSentence: '尊老爱幼是中华民族的传统美德与基本社会道德。', examplePinyin: 'Zūn lǎo ài yòu shì Zhōnghuá mínzú de chuántǒng měidé yǔ jīběn shèhuì dàodé.', exampleMeaning: 'Kính già yêu trẻ là nét đẹp truyền thống và chuẩn mực đạo đức xã hội cơ bản.'
  },
  {
    title: '魅力', pinyin: 'mèilì', meaning: 'sức quyến rũ, sức hút mê hoặc', pos: 'danh từ', level: 5, lesson: 5,
    exampleSentence: '中国传统书法艺术展现出永恒的东方美学魅力。', examplePinyin: 'Zhōngguó chuántǒng shūfǎ yìshù zhǎnxiàn chū yǒnghéng de Dōngfāng měixué mèilì.', exampleMeaning: 'Nghệ thuật thư pháp truyền thống Trung Hoa thể hiện sức hút thẩm mỹ phương Đông vĩnh cửu.'
  },

  // --- HSK 6 ---
  {
    title: '不愧', pinyin: 'búkuì', meaning: 'không hổ danh, xứng danh là', pos: 'phó từ', level: 6, lesson: 6,
    exampleSentence: '他临危不乱，不愧是一位身经百战的优秀将领。', examplePinyin: 'Tā lín wéi bú luàn, búkuì shì yí wèi shēnjīng-bǎizhàn de yōuxiù jiànglǐng.', exampleMeaning: 'Anh ấy đối mặt nguy hiểm không hề nao núng, xứng danh là vị tướng tài ba dạn dày sương gió.'
  },
  {
    title: '仓促', pinyin: 'cāngcù', meaning: 'vội vã, hấp tấp', pos: 'tính từ', level: 6, lesson: 6,
    exampleSentence: '由于行期仓促，他甚至没来得及与老朋友告别。', examplePinyin: 'Yóuyú xíngqī cāngcù, tā shènzhì méi láidejí yǔ lǎo péngyou gàobié.', exampleMeaning: 'Do ngày lên đường quá vội vã, anh ấy thậm chí chưa kịp chào tạm biệt bạn bè cũ.'
  },
  {
    title: '偏见', pinyin: 'piānjiàn', meaning: 'định kiến, thiên kiến', pos: 'danh từ', level: 6, lesson: 6,
    exampleSentence: '打破文化隔阂与认知偏见是构建人类命运共同体的基石。', examplePinyin: 'Dǎpò wénhuà géhé yǔ rènzhī piānjiàn shì gòujiàn rénlèi mìngyùn gòngtóngtǐ de jīshí.', exampleMeaning: 'Phá vỡ ngăn cách văn hóa và định kiến nhận thức là nền tảng xây dựng cộng đồng chung vận mệnh nhân loại.'
  },
  {
    title: '凡是', pinyin: 'fánshì', meaning: 'phàm là, hễ là', pos: 'phó từ', level: 6, lesson: 6,
    exampleSentence: '凡是对人民福祉有益的事，我们都应全力以赴去推进。', examplePinyin: 'Fánshì duì rénmín fúzhǐ yǒuyì de shì, wǒmen dōu yīng quánlì-yǐfù qù tuījìn.', exampleMeaning: 'Phàm là việc có lợi cho hạnh phúc của nhân dân, chúng ta đều phải dốc toàn lực thúc đẩy.'
  },
  {
    title: '协调', pinyin: 'xiétiáo', meaning: 'điều phối, hài hòa ăn khớp', pos: 'động từ / tính từ', level: 6, lesson: 6,
    exampleSentence: '经济发展必须与环境保护相协调，走可持续发展之路。', examplePinyin: 'Jīngjì fāzhǎn bìxū yǔ huánjìng bǎohù xiāng xiétiáo, zǒu kěchíxù fāzhǎn zhī lù.', exampleMeaning: 'Phát triển kinh tế bắt buộc phải hài hòa với bảo vệ môi trường, đi theo con đường phát triển bền vững.'
  },
  {
    title: '危机', pinyin: 'wēijī', meaning: 'khủng hoảng, nguy cơ', pos: 'danh từ', level: 6, lesson: 6,
    exampleSentence: '善于化危机为转机，是优秀企业家不可或缺的战略定力。', examplePinyin: 'Shànyú huà wēijī wéi zhuǎnjī, shì yōuxiù qǐyèjiā bùkě-huòquē de zhànlüè dìnglì.', exampleMeaning: 'Biết biến nguy cơ thành thời cơ là bản lĩnh chiến lược không thể thiếu của doanh nhân xuất sắc.'
  },
  {
    title: '和谐', pinyin: 'héxié', meaning: 'hài hòa, êm ấm hòa thuận', pos: 'tính từ', level: 6, lesson: 6,
    exampleSentence: '构建人与自然和谐共生的生态文明是全人类的共同愿景。', examplePinyin: 'Gòujiàn rén yǔ zìrán héxié gòngshēng de shēngtài wénmíng shì quán rénlèi de gòngtóng yuànjǐng.', exampleMeaning: 'Xây dựng nền văn minh sinh thái con người cùng chung sống hài hòa với thiên nhiên là ước nguyện chung của toàn nhân loại.'
  },
  {
    title: '尖端', pinyin: 'jiānduān', meaning: 'mũi nhọn, tối tân đỉnh cao', pos: 'tính từ', level: 6, lesson: 6,
    exampleSentence: '量子通信与深海探测属于国家战略尖端科技研发领域。', examplePinyin: 'Liàngzǐ tōngxìn yǔ shēnhǎi tàncè shǔyú guójiā zhànlüè jiānduān kējì yánfā lǐngyù.', exampleMeaning: 'Truyền thông lượng tử và thám hiểm biển sâu thuộc các lĩnh vực nghiên cứu khoa học công nghệ mũi nhọn chiến lược quốc gia.'
  },
  {
    title: '崭新', pinyin: 'zhǎnxīn', meaning: 'mới toanh, mới tinh khôi', pos: 'tính từ', level: 6, lesson: 6,
    exampleSentence: '新时代的伟大变革，为青年一代开启了崭新的人生航程。', examplePinyin: 'Xīn shídài de wěidà biàngé, wèi qīngnián yídài kāiqǐ le zhǎnxīn de rénshēng hángchéng.', exampleMeaning: 'Những đổi thay vĩ đại của thời đại mới đã mở ra hải trình nhân sinh hoàn toàn mới mẻ cho thế hệ trẻ.'
  },
  {
    title: '开拓', pinyin: 'kāituò', meaning: 'khai phá, mở mang bờ cõi/thị trường', pos: 'động từ', level: 6, lesson: 6,
    exampleSentence: '勇于开拓国际新市场，是企业实现全球化布局的关键举措。', examplePinyin: 'Yǒngyú kāituò guójì xīn shìchǎng, shì qǐyè shíxiàn quánqiúhuà bùjú de guānjiàn jǔcuò.', exampleMeaning: 'Dũng cảm khai phá thị trường quốc tế mới là bước đi then chốt để doanh nghiệp hoàn thiện bố cục toàn cầu.'
  },
  {
    title: '微观', pinyin: 'wēiguān', meaning: 'vi mô', pos: 'tính từ / danh từ', level: 6, lesson: 6,
    exampleSentence: '经济学既要把握宏观运行趋势，也要深入微观企业行为。', examplePinyin: 'Jīngjìxué jì yào bǎwò hóngguān yùnxíng qūshì, yě yào shēnrù wēiguān qǐyè xíngwéi.', exampleMeaning: 'Kinh tế học vừa phải nắm chắc xu thế vận hành vĩ mô, vừa phải thấu suốt hành vi vi mô của doanh nghiệp.'
  },
  {
    title: '忠诚', pinyin: 'zhōngchéng', meaning: 'trung thành, son sắt', pos: 'tính từ', level: 6, lesson: 6,
    exampleSentence: '忠诚于国家与人民，是每一位公职人员崇高的职业道德底线。', examplePinyin: 'Zhōngchéng yú guójiā yǔ rénmín, shì měi yí wèi gōngzhí rényuán chónggāo de zhíyè dàodé dǐxiàn.', exampleMeaning: 'Trung thành với quốc gia và nhân dân là ranh giới đạo đức nghề nghiệp cao cả của mỗi cán bộ công chức.'
  },
  {
    title: '战略', pinyin: 'zhànlüè', meaning: 'chiến lược', pos: 'danh từ', level: 6, lesson: 6,
    exampleSentence: '制定前瞻性长期发展战略，对企业的基业长青至关重要。', examplePinyin: 'Zhìdìng qiánzhānxìng chángqī fāzhǎn zhànlüè, duì qǐyè de jīyè-chángqīng zhìguān zhòngyào.', exampleMeaning: 'Đề ra chiến lược phát triển dài hạn mang tính đón đầu có ý nghĩa sống còn đối với sự trường thịnh của doanh nghiệp.'
  },
  {
    title: '潜力', pinyin: 'qiánlì', meaning: 'tiềm lực, tiềm năng', pos: 'danh từ', level: 6, lesson: 6,
    exampleSentence: '绿色低碳转型正蕴藏着巨大的科技创新潜能与商业投资潜力。', examplePinyin: 'Lǜsè dītàn zhuǎnxíng zhèng yùncáng zhe jùdà de kējì chuàngxīn qiánnéng yǔ shāngyè tóuzī qiánlì.', exampleMeaning: 'Chuyển đổi xanh phát thải thấp đang ẩn chứa tiềm năng đổi mới công nghệ và đầu tư thương mại khổng lồ.'
  },
  {
    title: '潮流', pinyin: 'cháoliú', meaning: 'trào lưu, làn sóng xu thế', pos: 'danh từ', level: 6, lesson: 6,
    exampleSentence: '和平、发展、合作、共赢的历史潮流是不可阻挡的。', examplePinyin: 'Hépíng, fāzhǎn, hézuò, gòngyíng de lìshǐ cháoliú shì bùkě-zǔdǎng de.', exampleMeaning: 'Trào lưu lịch sử hòa bình, phát triển, hợp tác cùng có lợi là không thể ngăn cản.'
  },
  {
    title: '突破', pinyin: 'tūpò', meaning: 'đột phá, bứt phá giới hạn', pos: 'động từ / danh từ', level: 6, lesson: 6,
    exampleSentence: '经过科研团队数年艰苦攻关，关键核心零部件实现了历史性突破。', examplePinyin: 'Jīngguò kēyán tuánduì shù nián jiānkǔ gōngguān, guānjiàn héxīn língbùjiàn shíxiàn le lìshǐxìng tūpò.', exampleMeaning: 'Sau nhiều năm nỗ lực nghiên cứu, linh kiện lõi then chốt đã đạt được bước đột phá mang tính lịch sử.'
  },
  {
    title: '自力更生', pinyin: 'zì lì gēng shēng', meaning: 'tự lực cánh sinh', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '坚持自力更生与自主创新，才能把核心命脉牢牢掌握在自己手里。', examplePinyin: 'Jiānchí zìlì-gēngshēng yǔ zìzhǔ chuàngxīn, cái néng bǎ héxīn mìngmài láoláo zhǎngwò zài zìjǐ shǒu lǐ.', exampleMeaning: 'Kiên trì tự lực cánh sinh và tự chủ đổi mới mới có thể nắm chắc huyết mạch cốt lõi trong tay mình.'
  },
  {
    title: '苦尽甘来', pinyin: 'kǔ jìn gān lái', meaning: 'khổ tận cam lai, qua cơn bĩ cực đến hồi thái lai', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '历经十年寒窗苦读，他终于苦尽甘来，收到了名牌大学录取通知书。', examplePinyin: 'Lìjīng shí nián hánchuāng kǔ dú, tā zhōngyú kǔjìn-gānlái, shōudào le míngpái dàxué lùqǔ tōngzhīshū.', exampleMeaning: 'Trải qua mười năm đèn sách gian khó, cuối cùng anh ấy cũng khổ tận cam lai, nhận được giấy báo trúng tuyển đại học danh tiếng.'
  },
  {
    title: '莫名其妙', pinyin: 'mò míng qí miào', meaning: 'kỳ quặc chẳng hiểu ra sao', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '他无缘无故地发了很大脾气，弄得大家感到莫名其妙。', examplePinyin: 'Tā wúyuán-wúgù de fā le hěn dà píqi, nòng de dàjiā gǎndào mòmíng-qímiào.', exampleMeaning: 'Anh ấy vô duyên vô cớ nổi cơn thịnh nộ khiến mọi người cảm thấy thật kỳ quặc chẳng hiểu nổi.'
  },
  {
    title: '见义勇为', pinyin: 'jiàn yì yǒng wéi', meaning: 'thấy việc nghĩa hăng hái ra tay', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '在危急关头挺身救人的见义勇为英雄，深受全社会的崇高敬意。', examplePinyin: 'Zài wēijí guāntóu tǐngshēn jiù rén de jiànyì-yǒngwéi yīngxióng, shēn shòu quán shèhuì de chónggāo jìngyì.', exampleMeaning: 'Người anh hùng thấy việc nghĩa ra tay cứu người trong lúc hiểm nguy nhận được sự kính trọng sâu sắc của toàn xã hội.'
  },
  {
    title: '见多识广', pinyin: 'jiàn duō shí guǎng', meaning: 'thấy nhiều biết rộng, kiến văn quảng bác', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '他常年游历世界各国，为人见多识广，谈吐非凡。', examplePinyin: 'Tā chángnián yóulì shìjiè gè guó, wéirén jiànduō-shíguǎng, tántù fēifán.', exampleMeaning: 'Anh ấy quanh năm đi du lịch khắp các nước trên thế giới, con người thấy nhiều biết rộng, trò chuyện tao nhã phi phàm.'
  },
  {
    title: '迫不及待', pinyin: 'pò bù jí dài', meaning: 'nóng lòng không thể đợi thêm', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '孩子们一拿到精美的玩具，就迫不及待地拆开包装玩了起来。', examplePinyin: 'Háizimen yì nádào jīngměi de wánjù, jiù pòbùjídài de chāikāi bāozhuāng wán le qǐlai.', exampleMeaning: 'Bọn trẻ vừa nhận được món đồ chơi tinh xảo là nóng lòng xé ngay bao bì ra chơi.'
  },
  {
    title: '锦上添花', pinyin: 'jǐn shàng tiān huā', meaning: 'thêu hoa trên gấm, đã đẹp càng thêm đẹp', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '在传统古典园林中点缀几株红梅，更显锦上添花之妙趣。', examplePinyin: 'Zài chuántǒng gǔdiǎn yuánlín zhōng diǎnzhuì jǐ zhū hóngméi, gèng xiǎn jǐnshàng-tiānhuā zhī miàoqù.', exampleMeaning: 'Điểm xuyết vài cành mai đỏ trong hoa viên cổ điển truyền thống càng làm tăng vẻ đẹp tuyệt diệu như thêu hoa trên gấm.'
  },
  {
    title: '锲而不舍', pinyin: 'qiè ér bù shě', meaning: 'kiên trì bền bỉ, đục đá không sờn lòng', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '只要具备锲而不舍的执着精神，任何人生难关终将被攻克。', examplePinyin: 'Zhǐyào jùbèi qiè\'ér-bùshě de zhízhuó jīngshén, rènhé rénshēng nánguān zhōng jiāng bèi gōngkè.', exampleMeaning: 'Chỉ cần có tinh thần kiên trì bền bỉ không dời, mọi ải khó khăn trong đời rốt cuộc đều sẽ vượt qua.'
  },
  {
    title: '难能可贵', pinyin: 'nán néng kě guì', meaning: 'đáng khen đáng quý, hiếm có khó tìm', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '在利益诱惑面前始终坚守诚信原则，这是极为难能可贵的品质。', examplePinyin: 'Zài lìyì yòuhuò miànqián shǐzhōng jiānshǒu chéngxìn yuánzé, zhè shì jíwéi nánnéng-kěguì de pǐnzhì.', exampleMeaning: 'Luôn giữ vững nguyên tắc trung thực trước cám dỗ của lợi ích là một phẩm chất vô cùng hiếm có đáng quý.'
  },
  {
    title: '雪上加霜', pinyin: 'xuě shàng jiā shuāng', meaning: 'tuyết phủ thêm sương, họa vô đơn chí', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '工厂遭遇火灾后原材料价格又大幅上涨，真可谓是雪上加霜。', examplePinyin: 'Gōngchǎng zāoyù huǒzāi hòu yuáncáiliào jiàgé yòu dàfú shàngzhǎng, zhēn kě wèi shì xuěshàng-jiāshuāng.', exampleMeaning: 'Sau khi nhà máy gặp hỏa hoạn thì giá nguyên vật liệu lại tăng vọt, quả thực đúng là tuyết phủ thêm sương.'
  },
  {
    title: '饱经沧桑', pinyin: 'bǎo jīng cāng sāng', meaning: 'nếm trải dâu bể thăng trầm', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '老兵布满皱纹的慈祥面庞，见证了一段饱经沧桑的峥嵘岁月。', examplePinyin: 'Lǎobīng bùmǎn zhòuwén de cíxiáng miànpáng, jiànzhèng le yí duàn bǎojīng-cāngsāng de zhēngróng suìyuè.', exampleMeaning: 'Gương mặt hiền từ hằn sâu nếp nhăn của người cựu chiến binh là nhân chứng của một thời kỳ năm tháng nếm trải bao dâu bể thăng trầm.'
  },
  {
    title: '礼尚往来', pinyin: 'lǐ shàng wǎng lái', meaning: 'có qua có lại mới toại lòng nhau', pos: 'thành ngữ', level: 6, lesson: 6,
    exampleSentence: '礼尚往来是中国礼仪文化中维系人际交往的传统美德。', examplePinyin: 'Lǐshàng-wǎnglái shì Zhōngguó lǐyí wénhuà zhōng wéixì rénjì jiāowǎng de chuántǒng měidé.', exampleMeaning: 'Có qua có lại là nét đẹp truyền thống gìn giữ các mối quan hệ giao tiếp trong văn hóa lễ nghi Trung Hoa.'
  }
];

let added = 0;
let updated = 0;
richExtraList.forEach(w => {
  if (existingMap.has(w.title)) {
    const item = existingMap.get(w.title);
    item.level = w.level;
    item.pinyin = w.pinyin;
    item.meaning = w.meaning;
    item.pos = w.pos;
    item.exampleSentence = w.exampleSentence;
    item.examplePinyin = w.examplePinyin;
    item.exampleMeaning = w.exampleMeaning;
    updated++;
  } else {
    dictionary.push(w);
    existingMap.set(w.title, w);
    added++;
  }
});

// Sort dictionary by level asc, then by pinyin
dictionary.sort((a, b) => {
  if (a.level !== b.level) return a.level - b.level;
  return a.pinyin.localeCompare(b.pinyin);
});

fs.writeFileSync(dictPath, JSON.stringify(dictionary, null, 2), 'utf8');

const finalBreakdown = {};
dictionary.forEach(w => {
  finalBreakdown[w.level] = (finalBreakdown[w.level] || 0) + 1;
});

console.log(`Added ${added} new words, updated ${updated} words.`);
console.log('Final Dictionary Breakdown:', finalBreakdown);
console.log('Total words:', dictionary.length);
