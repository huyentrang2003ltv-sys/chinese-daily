const { dataFile } = require('./paths');
const fs = require('fs');
const path = require('path');

const dataPath = dataFile('hanyu_jiaocheng.json');
const jiaocheng = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Map of standard characters
const chars = {
  mike: { speaker: "麦克", displayName: "麦克 (Mike)", gender: "male", avatar: "👨", role: "Lưu học sinh Canada" },
  mary: { speaker: "玛丽", displayName: "玛丽 (Mary)", gender: "female", avatar: "👩", role: "Lưu học sinh Mỹ" },
  zhang: { speaker: "张东", displayName: "张东 (Trương Đông)", gender: "male", avatar: "👨", role: "Nam sinh Trung Quốc" },
  tian: { speaker: "田芳", displayName: "田芳 (Điền Phương)", gender: "female", avatar: "👩", role: "Nữ sinh Trung Quốc" },
  wang: { speaker: "王老师", displayName: "王老师 (Thầy Vương)", gender: "male", avatar: "👨", role: "Giảng viên BLCU" },
  edward: { speaker: "爱德华", displayName: "爱德华 (Edward)", gender: "male", avatar: "👨", role: "Lưu học sinh Đức" },
  roland: { speaker: "罗兰", displayName: "罗兰 (Roland)", gender: "female", avatar: "👩", role: "Lưu học sinh Pháp" },
  paul: { speaker: "保罗", displayName: "保罗 (Paul)", gender: "male", avatar: "👨", role: "Lưu học sinh Úc" },
  david: { speaker: "大卫", displayName: "大卫 (David)", gender: "male", avatar: "👨", role: "Lưu học sinh Mỹ" },
  sales: { speaker: "售货员", displayName: "售货员 (Nhân viên bán hàng)", gender: "female", avatar: "👩", role: "Cửa hàng bách hóa" },
  clerk: { speaker: "营业员", displayName: "营业员 (Giao dịch viên)", gender: "female", avatar: "👩", role: "Nhân viên Ngân hàng / Bưu điện" },
  customs: { speaker: "海关人员", displayName: "海关人员 (Nhân viên hải quan)", gender: "male", avatar: "👨", role: "Hải quan sân bay" },
  doctor: { speaker: "大夫", displayName: "大夫 (Bác sĩ)", gender: "male", avatar: "👨", role: "Bác sĩ Bệnh viện trường" },
  master: { speaker: "太极师傅", displayName: "太极师傅 (Võ sư)", gender: "male", avatar: "👨", role: "Huấn luyện viên Thái Cực Quyền" },
  secretary: { speaker: "秘书", displayName: "秘书 (Thư ký)", gender: "female", avatar: "👩", role: "Văn phòng khoa" }
};

const vol1Dialogues = {
  // BÀI 1: 你好
  "jc_1_1_1": [
    { ...chars.mike, sectionTitle: "课文一：问好 (Chào hỏi xã giao)", hanzi: "你好！", pinyin: "Nǐ hǎo!", vi: "Xin chào bạn!" },
    { ...chars.mary, hanzi: "你好！", pinyin: "Nǐ hǎo!", vi: "Chào bạn!" },
    { ...chars.mike, sectionTitle: "课文二：敬语问好 (Chào kính ngữ)", hanzi: "王老师，您好！", pinyin: "Wáng lǎoshī, nín hǎo!", vi: "Em chào thầy Vương ạ!" },
    { ...chars.wang, hanzi: "你们好！欢迎来到北京语言大学学习汉语。", pinyin: "Nǐmen hǎo! Huānyíng lái dào Běijīng Yǔyán Dàxué xuéxí Hànyǔ.", vi: "Chào các em! Hoan nghênh các em đến ĐH Ngôn ngữ Bắc Kinh học tiếng Hán." },
    { ...chars.mary, hanzi: "谢谢老师！", pinyin: "Xièxie lǎoshī!", vi: "Cảm ơn thầy ạ!" },
    { ...chars.wang, hanzi: "不客气，请进！", pinyin: "Bú kèqi, qǐng jìn!", vi: "Không có gì, mời các em vào!" }
  ],

  // BÀI 2: 汉语不太难
  "jc_1_1_2": [
    { ...chars.mary, sectionTitle: "课文一：你忙吗 (Bạn có bận không)", hanzi: "你忙吗？", pinyin: "Nǐ máng ma?", vi: "Bạn có bận không?" },
    { ...chars.mike, hanzi: "很忙。", pinyin: "Hěn máng.", vi: "Rất bận." },
    { ...chars.mary, hanzi: "汉语难吗？", pinyin: "Hànyǔ nán ma?", vi: "Tiếng Hán có khó không?" },
    { ...chars.mike, hanzi: "发音不太难，汉字很难。", pinyin: "Fāyīn bú tài nán, Hànzì hěn nán.", vi: "Phát âm không khó lắm, nhưng chữ Hán thì rất khó." },
    { ...chars.zhang, sectionTitle: "课文二：家人问候 (Hỏi thăm người thân)", hanzi: "他爸爸、妈妈好吗？", pinyin: "Tā bàba, māma hǎo ma?", vi: "Bố mẹ cậu ấy khỏe không?" },
    { ...chars.tian, hanzi: "他们都很好。", pinyin: "Tāmen dōu hěn hǎo.", vi: "Họ đều rất khỏe." },
    { ...chars.zhang, hanzi: "你哥哥工作忙不忙？", pinyin: "Nǐ gēge gōngzuò máng bu máng?", vi: "Anh trai bạn công việc có bận không?" },
    { ...chars.tian, hanzi: "他也很忙。", pinyin: "Tā yě hěn máng.", vi: "Anh ấy cũng rất bận." }
  ],

  // BÀI 3: 明天见
  "jc_1_1_3": [
    { ...chars.mary, sectionTitle: "课文一：学汉语 (Học tiếng Hán)", hanzi: "你学英语吗？", pinyin: "Nǐ xué Yīngyǔ ma?", vi: "Bạn học tiếng Anh à?" },
    { ...chars.zhang, hanzi: "不，学汉语。", pinyin: "Bù, xué Hànyǔ.", vi: "Không, tôi học tiếng Hán." },
    { ...chars.mary, hanzi: "去北京吗？", pinyin: "Qù Běijīng ma?", vi: "Bạn đi Bắc Kinh không?" },
    { ...chars.zhang, hanzi: "对，明天去。", pinyin: "Duì, míngtiān qù.", vi: "Đúng vậy, ngày mai tôi đi." },
    { ...chars.mike, sectionTitle: "课文二：去邮局与银行 (Đi bưu điện & ngân hàng)", hanzi: "你去哪儿？", pinyin: "Nǐ qù nǎr?", vi: "Bạn đi đâu đấy?" },
    { ...chars.zhang, hanzi: "我去邮局寄信，你去不去？", pinyin: "Wǒ qù yóujú jì xìn, nǐ qù bu qù?", vi: "Tôi đi bưu điện gửi thư, bạn đi không?" },
    { ...chars.mike, hanzi: "我不去，我要去银行取钱。", pinyin: "Wǒ bú qù, wǒ yào qù yínháng qǔ qián.", vi: "Tôi không đi, tôi phải đi ngân hàng rút tiền." },
    { ...chars.zhang, hanzi: "明天见！", pinyin: "Míngtiān jiàn!", vi: "Ngày mai gặp lại nhé!" },
    { ...chars.mike, hanzi: "明天见！", pinyin: "Míngtiān jiàn!", vi: "Ngày mai gặp lại!" }
  ],

  // BÀI 4: 你去哪儿
  "jc_1_1_4": [
    { ...chars.mike, sectionTitle: "课文一：星期与去向 (Thứ ngày & Nơi đi)", hanzi: "今天星期几？", pinyin: "Jīntiān xīngqī jǐ?", vi: "Hôm nay là thứ mấy?" },
    { ...chars.zhang, hanzi: "今天星期二。", pinyin: "Jīntiān xīngqī èr.", vi: "Hôm nay là thứ ba." },
    { ...chars.mike, hanzi: "你去哪儿？", pinyin: "Nǐ qù nǎr?", vi: "Bạn đi đâu đấy?" },
    { ...chars.zhang, hanzi: "我去天安门，你去不去？", pinyin: "Wǒ qù Tiān'ānmén, nǐ qù bu qù?", vi: "Tôi đi Thiên An Môn, bạn đi không?" },
    { ...chars.mike, hanzi: "不去，我回学校。", pinyin: "Bú qù, wǒ huí xuéxiào.", vi: "Không đi, tôi quay về trường học." },
    { ...chars.zhang, hanzi: "再见！", pinyin: "Zàijiàn!", vi: "Tạm biệt nhé!" },
    { ...chars.mike, hanzi: "再见！", pinyin: "Zàijiàn!", vi: "Tạm biệt!" },
    { ...chars.zhang, sectionTitle: "课文二：礼貌致歉 (Xin lỗi & Không sao)", hanzi: "对不起！", pinyin: "Duìbuqǐ!", vi: "Xin lỗi bạn!" },
    { ...chars.mary, hanzi: "没关系！", pinyin: "Méi guānxi!", vi: "Không có gì đâu / Không sao đâu!" }
  ],

  // BÀI 5: 这是王老师
  "jc_1_1_5": [
    { ...chars.mike, sectionTitle: "课文一：介绍王老师 (Giới thiệu thầy giáo Vương)", hanzi: "这是王老师，这是我爸爸。", pinyin: "Zhè shì Wáng lǎoshī, zhè shì wǒ bàba.", vi: "Đây là thầy Vương, đây là bố em ạ." },
    { ...chars.wang, hanzi: "您好！", pinyin: "Nín hǎo!", vi: "Chào anh!" },
    { ...chars.paul, displayName: "爸爸 (Bố của Mike)", gender: "male", avatar: "👨", role: "Phụ huynh lưu học sinh", hanzi: "王老师，您好！很高兴认识您。", pinyin: "Wáng lǎoshī, nín hǎo! Hěn gāoxìng rènshi nín.", vi: "Thầy Vương, chào thầy! Rất vui được gặp thầy." },
    { ...chars.wang, hanzi: "请进！请坐！请喝茶！", pinyin: "Qǐng jìn! Qǐng zuò! Qǐng hē chá!", vi: "Mời vào! Mời ngồi! Mời uống trà!" },
    { ...chars.paul, displayName: "爸爸 (Bố của Mike)", gender: "male", avatar: "👨", role: "Phụ huynh lưu học sinh", hanzi: "谢谢您！", pinyin: "Xièxie nín!", vi: "Cảm ơn thầy ạ!" },
    { ...chars.wang, hanzi: "不客气。工作忙吗？", pinyin: "Bú kèqi. Gōngzuò máng ma?", vi: "Không có gì. Dạo này anh công việc có bận không?" },
    { ...chars.paul, displayName: "爸爸 (Bố của Mike)", gender: "male", avatar: "👨", role: "Phụ huynh lưu học sinh", hanzi: "不太忙。老师身体好吗？", pinyin: "Bú tài máng. Lǎoshī shēntǐ hǎo ma?", vi: "Không bận lắm. Thầy sức khỏe có tốt không ạ?" },
    { ...chars.wang, hanzi: "很好，谢谢！", pinyin: "Hěn hǎo, xièxie!", vi: "Thầy rất khỏe, cảm ơn anh!" }
  ],

  // BÀI 6: 我学习汉语
  "jc_1_1_6": [
    { ...chars.mike, sectionTitle: "课文一：请问你贵姓 (Xin hỏi quý tính của bạn)", hanzi: "请问，你贵姓？", pinyin: "Qǐngwèn, nǐ guìxìng?", vi: "Xin hỏi, quý tính của bạn là gì?" },
    { ...chars.zhang, hanzi: "我姓张。", pinyin: "Wǒ xìng Zhāng.", vi: "Tôi họ Trương." },
    { ...chars.mike, hanzi: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?", vi: "Bạn tên là gì?" },
    { ...chars.zhang, hanzi: "我叫张东。你是哪国人？", pinyin: "Wǒ jiào Zhāng Dōng. Nǐ shì nǎ guó rén?", vi: "Tôi tên là Trương Đông. Bạn là người nước nào?" },
    { ...chars.mike, hanzi: "我是加拿大留学生。你学习什么？", pinyin: "Wǒ shì Jiānádà liúxuéshēng. Nǐ xuéxí shénme?", vi: "Tôi là lưu học sinh Canada. Bạn học ngành gì?" },
    { ...chars.zhang, sectionTitle: "课文二：学习汉语 (Học tiếng Hán)", hanzi: "我学习国际贸易。你呢？", pinyin: "Wǒ xuéxí guójì màoyì. Nǐ ne?", vi: "Tôi học thương mại quốc tế. Còn bạn?" },
    { ...chars.mike, hanzi: "我学习汉语。", pinyin: "Wǒ xuéxí Hànyǔ.", vi: "Tôi học tiếng Hán." },
    { ...chars.zhang, hanzi: "汉语难吗？", pinyin: "Hànyǔ nán ma?", vi: "Tiếng Hán có khó không?" },
    { ...chars.mike, hanzi: "汉字很难，发音不太难。", pinyin: "Hànzì hěn nán, fāyīn bú tài nán.", vi: "Chữ Hán rất khó, còn phát âm thì không khó lắm." }
  ],

  // BÀI 7: 你吃什么
  "jc_1_1_7": [
    { ...chars.mike, sectionTitle: "课文一：中午在食堂 (Buổi trưa ở nhà ăn)", hanzi: "中午你去哪儿吃饭？", pinyin: "Zhōngwǔ nǐ qù nǎr chīfàn?", vi: "Buổi trưa bạn đi đâu ăn cơm?" },
    { ...chars.mary, hanzi: "我去食堂。", pinyin: "Wǒ qù shítáng.", vi: "Tôi đi nhà ăn sinh viên." },
    { ...chars.mike, hanzi: "你吃什么？", pinyin: "Nǐ chī shénme?", vi: "Bạn ăn món gì?" },
    { ...chars.mary, hanzi: "我吃馒头。", pinyin: "Wǒ chī mántou.", vi: "Tôi ăn màn thầu." },
    { ...chars.mike, hanzi: "你要几个？", pinyin: "Nǐ yào jǐ gè?", vi: "Bạn muốn mấy cái?" },
    { ...chars.mary, hanzi: "一个。你吃吗？", pinyin: "Yí gè. Nǐ chī ma?", vi: "Một cái. Bạn ăn không?" },
    { ...chars.mike, hanzi: "不吃，我吃米饭。你喝什么？", pinyin: "Bù chī, wǒ chī mǐfàn. Nǐ hē shénme?", vi: "Không ăn, tôi ăn cơm trắng. Bạn uống gì?" },
    { ...chars.mary, hanzi: "我要一碗鸡蛋汤。你喝吗？", pinyin: "Wǒ yào yì wǎn jīdàntāng. Nǐ hē ma?", vi: "Tôi lấy một bát canh trứng gà. Bạn uống không?" },
    { ...chars.mike, hanzi: "我不喝，我喝啤酒。", pinyin: "Wǒ bù hē, wǒ hē píjiǔ.", vi: "Tôi không uống, tôi uống bia." }
  ],

  // BÀI 8: 苹果一斤多少钱
  "jc_1_1_8": [
    { ...chars.sales, sectionTitle: "课文一：买水果 (Mua hoa quả)", hanzi: "您买什么？", pinyin: "Nín mǎi shénme?", vi: "Bác mua gì ạ?" },
    { ...chars.mike, hanzi: "买苹果。一斤多少钱？", pinyin: "Mǎi píngguǒ. Yì jīn duōshao qián?", vi: "Tôi mua táo. Một cân (500g) bao nhiêu tiền?" },
    { ...chars.sales, hanzi: "三块。", pinyin: "Sān kuài.", vi: "Ba đồng." },
    { ...chars.mike, hanzi: "三块？太贵了。两块五吧。", pinyin: "Sān kuài? Tài guì le. Liǎng kuài wǔ ba.", vi: "Ba đồng á? Đắt quá. Hai đồng rưỡi nhé." },
    { ...chars.sales, hanzi: "你要几斤？", pinyin: "Nǐ yào jǐ jīn?", vi: "Bác muốn lấy mấy cân?" },
    { ...chars.mike, hanzi: "我买五斤。橘子多少钱一斤？", pinyin: "Wǒ mǎi wǔ jīn. Júzi duōshao qián yì jīn?", vi: "Tôi mua 5 cân. Quýt bao nhiêu tiền một cân?" },
    { ...chars.sales, hanzi: "两块五一斤。你要吗？", pinyin: "Liǎng kuài wǔ yì jīn. Nǐ yào ma?", vi: "Hai đồng rưỡi một cân. Bác lấy không?" },
    { ...chars.mike, hanzi: "要两斤。一共多少钱？", pinyin: "Yào liǎng jīn. Yígòng duōshao qián?", vi: "Lấy 2 cân. Tất cả hết bao nhiêu tiền?" },
    { ...chars.sales, hanzi: "苹果十二块五，橘子五块，一共十七块五毛。", pinyin: "Píngguǒ shí'èr kuài wǔ, júzi wǔ kuài, yígòng shíqī kuài wǔ máo.", vi: "Táo 12 đồng 5, quýt 5 đồng, tổng cộng là 17 đồng 5 hào." },
    { ...chars.mike, hanzi: "给你二十块。", pinyin: "Gěi nǐ èrshí kuài.", vi: "Gửi chị 20 đồng." },
    { ...chars.sales, hanzi: "找您两块五毛，谢谢！", pinyin: "Zhǎo nín liǎng kuài wǔ máo, xièxie!", vi: "Trả lại bác 2 đồng 5 hào, cảm ơn bác!" }
  ],

  // BÀI 9: 我换人民币
  "jc_1_1_9": [
    { ...chars.mary, sectionTitle: "课文一：去银行换钱 (Đi ngân hàng đổi tiền)", hanzi: "下午我去图书馆，你去不去？", pinyin: "Xiàwǔ wǒ qù túshūguǎn, nǐ qù bu qù?", vi: "Chiều nay tôi đi thư viện, bạn đi không?" },
    { ...chars.mike, hanzi: "我不去，我要去中国银行换钱。", pinyin: "Wǒ bú qù, wǒ yào qù Zhōngguó Yínháng huàn qián.", vi: "Tôi không đi, tôi phải đi Ngân hàng Trung Quốc đổi tiền." },
    { ...chars.clerk, sectionTitle: "课文二：在银行办理 (Giao dịch tại ngân hàng)", hanzi: "先生，您好！您换什么钱？", pinyin: "Xiānsheng, nín hǎo! Nín huàn shénme qián?", vi: "Thưa ngài xin chào! Ngài muốn đổi tiền gì ạ?" },
    { ...chars.mike, hanzi: "我换人民币。", pinyin: "Wǒ huàn rénmínbì.", vi: "Tôi muốn đổi tiền Nhân dân tệ." },
    { ...chars.clerk, hanzi: "您换多少美元？", pinyin: "Nín huàn duōshao Měiyuán?", vi: "Ngài đổi bao nhiêu đô la Mỹ?" },
    { ...chars.mike, hanzi: "五百美元。", pinyin: "Wǔbǎi Měiyuán.", vi: "500 đô la Mỹ." },
    { ...chars.clerk, hanzi: "请填写这张兑换单，并出示您的护照。", pinyin: "Qǐng tiánxiě zhè zhāng duìhuàndān, bìng chūshì nín de hùzhào.", vi: "Xin ngài điền vào phiếu đổi tiền này và xuất trình hộ chiếu." },
    { ...chars.mike, hanzi: "好的，给您。", pinyin: "Hǎo de, gěi nín.", vi: "Vâng, gửi chị." },
    { ...chars.clerk, hanzi: "请稍等... 先生，给您钱，请数数。", pinyin: "Qǐng shāoděng... Xiānsheng, gěi nín qián, qǐng shǔshu.", vi: "Xin chờ một lát... Thưa ngài, tiền của ngài đây, xin đếm lại." },
    { ...chars.mike, hanzi: "正好，谢谢！", pinyin: "Zhènghǎo, xièxie!", vi: "Vừa đủ rồi, cảm ơn chị!" },
    { ...chars.clerk, hanzi: "不客气，再见！", pinyin: "Bú kèqi, zàijiàn!", vi: "Không có chi, tạm biệt ngài!" }
  ],

  // BÀI 10: 他住哪儿
  "jc_1_1_10": [
    { ...chars.mike, sectionTitle: "课文一：询问住址与电话 (Hỏi địa chỉ & số điện thoại)", hanzi: "请问，这是王老师的办公室吗？", pinyin: "Qǐngwèn, zhè shì Wáng lǎoshī de bàngōngshì ma?", vi: "Xin hỏi, đây có phải văn phòng thầy Vương không?" },
    { ...chars.secretary, hanzi: "是，请进！你找王老师吗？", pinyin: "Shì, qǐng jìn! Nǐ zhǎo Wáng lǎoshī ma?", vi: "Đúng rồi, mời vào! Em tìm thầy Vương à?" },
    { ...chars.mike, hanzi: "王老师在吗？", pinyin: "Wáng lǎoshī zài ma?", vi: "Thầy Vương có ở đây không ạ?" },
    { ...chars.secretary, hanzi: "他不在，他在家呢。", pinyin: "Tā bú zài, tā zài jiā ne.", vi: "Thầy không có ở đây, thầy đang ở nhà." },
    { ...chars.mike, hanzi: "他住哪儿？", pinyin: "Tā zhù nǎr?", vi: "Thầy ở đâu vậy ạ?" },
    { ...chars.secretary, hanzi: "他住十八楼七门六零一号。", pinyin: "Tā zhù shíbā lóu qī mén liù líng yī hào.", vi: "Thầy ở nhà số 18, cổng 7, phòng 601." },
    { ...chars.mike, hanzi: "他的电话号码是多少？", pinyin: "Tā de diànhuà hàomǎ shì duōshao?", vi: "Số điện thoại của thầy là bao nhiêu ạ?" },
    { ...chars.secretary, hanzi: "坐机是六二九七五四三一，手机是一三九一零七三八五六二。", pinyin: "Zuòjī shì liù èr jiǔ qī wǔ sì sān yī, shǒujī shì yī sān jiǔ yī líng qī sān bā wǔ liù èr.", vi: "Số máy bàn là 62975431, còn di động là 13910738562." },
    { ...chars.mike, hanzi: "非常感谢您！", pinyin: "Fēicháng gǎnxiè nín!", vi: "Em vô cùng cảm ơn cô!" },
    { ...chars.secretary, hanzi: "不客气。", pinyin: "Bú kèqi.", vi: "Không có chi em." }
  ],

  // BÀI 11: 我们都是留学生
  "jc_1_1_11": [
    { ...chars.secretary, sectionTitle: "课文一：这位是新同学 (Vị này là bạn học mới)", hanzi: "王老师，这位是马里奥。", pinyin: "Wáng lǎoshī, zhè wèi shì Mǎlǐ'ào.", vi: "Thưa thầy Vương, vị này là Mario ạ." },
    { ...chars.wang, hanzi: "你好，马里奥！你是哪国人？", pinyin: "Nǐ hǎo, Mǎlǐ'ào! Nǐ shì nǎ guó rén?", vi: "Chào em Mario! Em là người nước nào?" },
    { ...chars.paul, displayName: "马里奥 (Mario)", gender: "male", avatar: "👨", role: "Lưu học sinh Tây Ban Nha", hanzi: "王老师好！我是西班牙人。我来北京学习汉语。", pinyin: "Wáng lǎoshī hǎo! Wǒ shì Xībānyá rén. Wǒ lái Běijīng xuéxí Hànyǔ.", vi: "Em chào thầy Vương! Em là người Tây Ban Nha. Em đến Bắc Kinh học tiếng Hán." },
    { ...chars.tian, sectionTitle: "课文二：我们都是留学生 (Chúng tôi đều là lưu học sinh)", hanzi: "张东，那是谁？", pinyin: "Zhāng Dōng, nà shì shéi?", vi: "Trương Đông, kia là ai thế?" },
    { ...chars.zhang, hanzi: "那是我们的新同学，叫大卫。", pinyin: "Nà shì wǒmen de xīn tóngxué, jiào Dàwèi.", vi: "Kia là bạn học mới của chúng mình, tên là David." },
    { ...chars.tian, hanzi: "他也是留学生吗？", pinyin: "Tā yě shì liúxuéshēng ma?", vi: "Cậu ấy cũng là lưu học sinh à?" },
    { ...chars.zhang, hanzi: "是，他是美国留学生。", pinyin: "Shì, tā shì Měiguó liúxuéshēng.", vi: "Đúng, cậu ấy là lưu học sinh Mỹ." },
    { ...chars.tian, hanzi: "你也是留学生吗？", pinyin: "Nǐ yě shì liúxuéshēng ma?", vi: "Cậu cũng là lưu học sinh à?" },
    { ...chars.zhang, hanzi: "不是，我是中国学生。玛丽和大卫都是留学生，他们都是美国人。", pinyin: "Bú shì, wǒ shì Zhōngguó xuésheng. Mǎlì hé Dàwèi dōu shì liúxuéshēng, tāmen dōu shì Měiguó rén.", vi: "Không phải, mình là sinh viên Trung Quốc. Mary và David đều là lưu học sinh, họ đều là người Mỹ." }
  ],

  // BÀI 12: 你在哪儿学习
  "jc_1_1_12": [
    { ...chars.roland, sectionTitle: "课文一：在北京语言大学 (Tại ĐH Ngôn ngữ Bắc Kinh)", hanzi: "麦克，你在哪儿学习汉语？", pinyin: "Màikè, nǐ zài nǎr xuéxí Hànyǔ?", vi: "Mike, bạn học tiếng Hán ở đâu thế?" },
    { ...chars.mike, hanzi: "在北京语言大学。", pinyin: "Zài Běijīng Yǔyán Dàxué.", vi: "Ở Đại học Ngôn ngữ Bắc Kinh." },
    { ...chars.roland, hanzi: "你们的老师怎么样？", pinyin: "Nǐmen de lǎoshī zěnmeyàng?", vi: "Các giáo viên của các bạn thế nào?" },
    { ...chars.mike, hanzi: "老师们非常好，讲课很认真，对学生也很热情。", pinyin: "Lǎoshīmen fēicháng hǎo, jiǎngkè hěn rènzhēn, duì xuésheng yě hěn rèqíng.", vi: "Các thầy cô rất tốt, giảng bài rất chu đáo và rất nhiệt tình với học viên." },
    { ...chars.roland, hanzi: "你觉得汉语难吗？", pinyin: "Nǐ juéde Hànyǔ nán ma?", vi: "Bạn cảm thấy tiếng Hán có khó không?" },
    { ...chars.mike, hanzi: "我觉得听和说比较容易，读和写很难。", pinyin: "Wǒ juéde tīng hé shuō bǐjiào róngyì, dú hé xiě hěn nán.", vi: "Mình thấy nghe và nói tương đối dễ, còn đọc và viết thì rất khó." },
    { ...chars.roland, sectionTitle: "课文二：同屋与宿舍 (Bạn cùng phòng & ký túc xá)", hanzi: "你的同屋是谁？", pinyin: "Nǐ de tóngwū shì shéi?", vi: "Bạn cùng phòng của bạn là ai?" },
    { ...chars.mike, hanzi: "他是中国人，叫张东。我们常互相帮助。", pinyin: "Tā shì Zhōngguó rén, jiào Zhāng Dōng. Wǒmen cháng hùxiāng bāngzhù.", vi: "Cậu ấy là người Trung Quốc, tên là Trương Đông. Bọn mình thường giúp đỡ lẫn nhau." }
  ],

  // BÀI 13: 这是不是中药
  "jc_1_1_13": [
    { ...chars.wang, sectionTitle: "课文一：这个箱子很重 (Chiếc vali này rất nặng)", hanzi: "张东，你的这个箱子很重啊。里面是什么？", pinyin: "Zhāng Dōng, nǐ de zhè ge xiāngzi hěn zhòng a. Lǐmiàn shì shénme?", vi: "Trương Đông, cái vali này của em nặng quá. Bên trong là gì thế?" },
    { ...chars.zhang, hanzi: "这都是书和词典。", pinyin: "Zhè dōu shì shū hé cídiǎn.", vi: "Toàn là sách và từ điển ạ." },
    { ...chars.customs, sectionTitle: "课文二：海关检查 (Kiểm tra hải quan)", hanzi: "先生，请打开这个箱子检查一下。", pinyin: "Xiānsheng, qǐng dǎkāi zhè ge xiāngzi jiǎnchá yíxià.", vi: "Thưa ngài, xin mở chiếc vali này ra để kiểm tra một chút." },
    { ...chars.mike, hanzi: "好的。这是中药。", pinyin: "Hǎo de. Zhè shì zhōngyào.", vi: "Vâng được ạ. Đây là thuốc bắc." },
    { ...chars.customs, hanzi: "这不是药，这是茶叶吧？", pinyin: "Zhè bú shì yào, zhè shì cháyè ba?", vi: "Đây đâu phải thuốc, là lá trà chứ nhỉ?" },
    { ...chars.mike, hanzi: "对，这是中国绿茶，送给我朋友的。", pinyin: "Duì, zhè shì Zhōngguó lǜchá, sòng gěi wǒ péngyou de.", vi: "Đúng rồi, đây là trà xanh Trung Quốc, tặng cho bạn của tôi." },
    { ...chars.customs, hanzi: "那个红色的包里是什么？", pinyin: "Nà ge hóngsè de bāo lǐ shì shénme?", vi: "Trong chiếc túi màu đỏ kia là gì?" },
    { ...chars.mike, hanzi: "那都是衣服和日用品。", pinyin: "Nà dōu shì yīfu hé rìyòngpǐn.", vi: "Đó toàn là quần áo và đồ dùng thường ngày thôi ạ." }
  ],

  // BÀI 14: 你的车是新的还是旧的
  "jc_1_1_14": [
    { ...chars.tian, sectionTitle: "课文一：找自行车 (Tìm xe đạp)", hanzi: "张东，我的车呢？", pinyin: "Zhāng Dōng, wǒ de chē ne?", vi: "Trương Đông, xe đạp của mình đâu rồi?" },
    { ...chars.zhang, hanzi: "你的车是什么颜色的？", pinyin: "Nǐ de chē shì shénme yánsè de?", vi: "Xe của bạn là màu gì?" },
    { ...chars.tian, hanzi: "蓝色的。", pinyin: "Lánsè de.", vi: "Màu xanh lam." },
    { ...chars.zhang, hanzi: "是新的还是旧的？", pinyin: "Shì xīn de háishi jiù de?", vi: "Là xe mới hay xe cũ?" },
    { ...chars.tian, hanzi: "新的，昨天刚买的。", pinyin: "Xīn de, zuótiān gāng mǎi de.", vi: "Xe mới, hôm qua mới mua xong." },
    { ...chars.zhang, hanzi: "那辆蓝色的车是不是你的？", pinyin: "Nà liàng lánsè de chē shì bú shì nǐ de?", vi: "Chiếc xe màu xanh kia có phải của bạn không?" },
    { ...chars.tian, hanzi: "哪辆？", pinyin: "Nǎ liàng?", vi: "Chiếc nào cơ?" },
    { ...chars.zhang, hanzi: "就是大树旁边那辆。", pinyin: "Jiù shì dàshù pángbiān nà liàng.", vi: "Chính là chiếc bên cạnh cây to kìa." },
    { ...chars.tian, hanzi: "不是。啊，看到了，我的车在楼门后边呢！", pinyin: "Bú shì. Ā, kàndào le, wǒ de chē zài lóumén hòubian ne!", vi: "Không phải. A, thấy rồi, xe của mình ở sau cánh cửa tòa nhà kìa!" }
  ],

  // BÀI 15: 你们公司有多少职员
  "jc_1_1_15": [
    { ...chars.paul, sectionTitle: "课文一：家庭人口 (Nhân khẩu gia đình)", hanzi: "你家有几口人？", pinyin: "Nǐ jiā yǒu jǐ kǒu rén?", vi: "Nhà bạn có mấy người?" },
    { ...chars.edward, hanzi: "我家有五口人：爸爸、妈妈、哥哥、姐姐和我。", pinyin: "Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, gēge, jiějie hé wǒ.", vi: "Nhà mình có 5 người: bố, mẹ, anh trai, chị gái và mình." },
    { ...chars.paul, hanzi: "你哥哥做什么工作？", pinyin: "Nǐ gēge zuò shénme gōngzuò?", vi: "Anh trai bạn làm nghề gì?" },
    { ...chars.edward, hanzi: "他是医生，在一家大医院工作。", pinyin: "Tā shì yīshēng, zài yì jiā dà yīyuàn gōngzuò.", vi: "Anh ấy là bác sĩ, làm việc ở một bệnh viện lớn." },
    { ...chars.david, sectionTitle: "课文二：公司职员 (Nhân viên công ty)", hanzi: "王老师，你们外语学院有多少职员？", pinyin: "Wáng lǎoshī, nǐmen wàiyǔ xuéyuàn yǒu duōshao zhíyuán?", vi: "Thưa thầy Vương, học viện ngoại ngữ của thầy có bao nhiêu nhân viên ạ?" },
    { ...chars.wang, hanzi: "我们学院不大，只有大约一百个职员。", pinyin: "Wǒmen xuéyuàn bú dà, zhǐ yǒu dàyuē yībǎi gè zhíyuán.", vi: "Học viện của thầy không lớn, chỉ có khoảng 100 nhân viên thôi." },
    { ...chars.david, hanzi: "都是中国老师吗？", pinyin: "Dōu shì Zhōngguó lǎoshī ma?", vi: "Đều là giáo viên Trung Quốc hết ạ?" },
    { ...chars.wang, hanzi: "不都是中国老师，我们学院也有二十多个外国专家。", pinyin: "Bù dōu shì Zhōngguó lǎoshī, wǒmen xuéyuàn yě yǒu èrshí duō gè wàiguó zhuānjiā.", vi: "Không phải tất cả đều là giáo viên Trung Quốc, học viện của thầy cũng có hơn 20 chuyên gia nước ngoài." }
  ],

  // BÀI 16: 你常去图书馆吗
  "jc_1_2_16": [
    { ...chars.mike, sectionTitle: "课文一：去图书馆 (Đi thư viện)", hanzi: "我现在去图书馆，你跟我一起去好吗？", pinyin: "Wǒ xiànzài qù túshūguǎn, nǐ gēn wǒ yìqǐ qù hǎo ma?", vi: "Bây giờ mình đi thư viện, bạn đi cùng mình được không?" },
    { ...chars.mary, hanzi: "好，咱们走吧。你常去图书馆吗？", pinyin: "Hǎo, zánmen zǒu ba. Nǐ cháng qù túshūguǎn ma?", vi: "Được, chúng mình cùng đi. Bạn có thường đi thư viện không?" },
    { ...chars.mike, hanzi: "常去。我常借书，也常在那儿看书。你呢？常去吗？", pinyin: "Cháng qù. Wǒ cháng jiè shū, yě cháng zài nàr kàn shū. Nǐ ne? Cháng qù ma?", vi: "Thường xuyên đi. Mình thường mượn sách, cũng thường đọc sách ở đó. Còn bạn? Có hay đi không?" },
    { ...chars.mary, hanzi: "我也常去。有时候借书，有时候上网查资料，但不常在那儿看书。我总在宿舍看书。", pinyin: "Wǒ yě cháng qù. Yǒushíhou jiè shū, yǒushíhou shàngwǎng chá zīliào, dàn bù cháng zài nàr kàn shū. Wǒ zǒng zài sùshè kàn shū.", vi: "Mình cũng hay đi. Có khi mượn sách, có khi lên mạng tra tài liệu, nhưng không hay đọc ở đó. Mình toàn đọc sách ở ký túc xá." },
    { ...chars.mike, sectionTitle: "课文二：晚上常做什么 (Buổi tối thường làm gì)", hanzi: "晚上你常做什么？", pinyin: "Wǎnshang nǐ cháng zuò shénme?", vi: "Buổi tối bạn thường làm gì?" },
    { ...chars.mary, hanzi: "复习课文，预习生词，或者做练习。有时候看中国电视剧，你呢？", pinyin: "Fùxí kèwén, yùxí shēngcí, huòzhě zuò liànxí. Yǒushíhou kàn Zhōngguó diànshìjù, nǐ ne?", vi: "Ôn lại bài khóa, chuẩn bị trước từ mới, hoặc làm bài tập. Thỉnh thoảng xem phim truyền hình Trung Quốc, còn bạn?" },
    { ...chars.mike, hanzi: "我也差不多，有时候跟朋友聊天儿或者听音乐。", pinyin: "Wǒ yě chàbuduō, yǒushíhou gēn péngyou liáotiānr huòzhě tīng yīnyuè.", vi: "Mình cũng gần như thế, thỉnh thoảng tán gẫu cùng bạn bè hoặc nghe nhạc." }
  ],

  // BÀI 17: 他在做什么呢
  "jc_1_2_17": [
    { ...chars.mary, sectionTitle: "课文一：他在做什么呢 (Cậu ấy đang làm gì thế)", hanzi: "麦克在做什么呢？", pinyin: "Màikè zài zuò shénme ne?", vi: "Mike đang làm gì thế?" },
    { ...chars.edward, hanzi: "他正在听音乐呢。", pinyin: "Tā zhèngzài tīng yīnyuè ne.", vi: "Cậu ấy đang nghe nhạc đấy." },
    { ...chars.mary, hanzi: "你去找他有什么事吗？", pinyin: "Nǐ qù zhǎo tā yǒu shénme shì ma?", vi: "Bạn đi tìm cậu ấy có việc gì không?" },
    { ...chars.edward, hanzi: "我想借他的录音机。", pinyin: "Wǒ xiǎng jiè tā de lùyīnjī.", vi: "Mình muốn mượn chiếc máy ghi âm của cậu ấy." },
    { ...chars.mike, sectionTitle: "课文二：去找张东 (Đi tìm Trương Đông)", hanzi: "田芳，你去找谁？", pinyin: "Tián Fāng, nǐ qù zhǎo shéi?", vi: "Điền Phương, bạn đi tìm ai đấy?" },
    { ...chars.tian, hanzi: "我去找张东，想问他一个语法问题。", pinyin: "Wǒ qù zhǎo Zhāng Dōng, xiǎng wèn tā yí gè yǔfǎ wèntí.", vi: "Mình đi tìm Trương Đông, muốn hỏi cậu ấy một vấn đề ngữ pháp." },
    { ...chars.mike, hanzi: "张东正在宿舍复习课文呢，你快去吧。", pinyin: "Zhāng Dōng zhèngzài sùshè fùxí kèwén ne, nǐ kuài qù ba.", vi: "Trương Đông đang ôn bài khóa ở ký túc xá đấy, bạn mau sang đi." }
  ],

  // BÀI 18: 我去邮局寄包裹
  "jc_1_2_18": [
    { ...chars.zhang, sectionTitle: "课文一：去邮局寄包裹 (Đi bưu điện gửi bưu phẩm)", hanzi: "麦克，你去哪儿？", pinyin: "Màikè, nǐ qù nǎr?", vi: "Mike, bạn đi đâu đấy?" },
    { ...chars.mike, hanzi: "我去邮局寄包裹，顺便买几张邮票和青年杂志。", pinyin: "Wǒ qù yóujú jì bāoguǒ, shùnbiàn mǎi jǐ zhāng yóupiào hé qīngnián zázhì.", vi: "Mình đi bưu điện gửi bưu phẩm, tiện thể mua mấy con tem và tạp chí Thanh Niên." },
    { ...chars.zhang, hanzi: "帮我买几张纪念邮票，行吗？", pinyin: "Bāng wǒ mǎi jǐ zhāng jìniàn yóupiào, xíng ma?", vi: "Mua giúp mình mấy con tem kỷ niệm được không?" },
    { ...chars.mike, hanzi: "没问题。回来我给你。", pinyin: "Méi wèntí. Huílái wǒ gěi nǐ.", vi: "Không thành vấn đề. Về mình đưa cho bạn." },
    { ...chars.clerk, sectionTitle: "课文二：寄往加拿大 (Gửi đi Canada)", hanzi: "您好，您寄往哪里？", pinyin: "Nín hǎo, nín jì wǎng nǎlǐ?", vi: "Xin chào ngài, ngài muốn gửi đi đâu ạ?" },
    { ...chars.mike, hanzi: "寄往加拿大。航空还是海运快？", pinyin: "Jì wǎng Jiānádà. Hángkōng háishi hǎiyùn kuài?", vi: "Gửi đi Canada. Đường hàng không hay đường biển nhanh hơn?" },
    { ...chars.clerk, hanzi: "航空快，大约一个星期就能到。", pinyin: "Hángkōng kuài, dàyuē yí gè xīngqī jiù néng dào.", vi: "Đường hàng không nhanh, khoảng một tuần là tới nơi." }
  ],

  // BÀI 19: 可以试试吗
  "jc_1_2_19": [
    { ...chars.sales, sectionTitle: "课文一：买羽绒服 (Mua áo khoác lông vũ)", hanzi: "您想买点儿什么？", pinyin: "Nín xiǎng mǎi diǎnr shénme?", vi: "Chị muốn mua gì ạ?" },
    { ...chars.mary, hanzi: "我想买一件羽绒服，北京的冬天很冷。", pinyin: "Wǒ xiǎng mǎi yí jiàn yǔróngfú, Běijīng de dōngtiān hěn lěng.", vi: "Tôi muốn mua một chiếc áo lông vũ, mùa đông Bắc Kinh rất lạnh." },
    { ...chars.sales, hanzi: "你看这件红色的怎么样？又好看又保暖。", pinyin: "Nǐ kàn zhè jiàn hóngsè de zěnmeyàng? Yòu hǎokàn yòu bǎonuǎn.", vi: "Chị xem chiếc màu đỏ này thế nào? Vừa đẹp lại vừa ấm áp." },
    { ...chars.mary, hanzi: "可以试试吗？", pinyin: "Kěyǐ shìshi ma?", vi: "Tôi có thể thử một chút không?" },
    { ...chars.sales, hanzi: "当然可以，请试一下。", pinyin: "Dāngrán kěyǐ, qǐng shì yíxià.", vi: "Đương nhiên được ạ, xin mời chị thử." },
    { ...chars.mary, hanzi: "这件有点儿长，有短一点儿的吗？", pinyin: "Zhè jiàn yǒudiǎnr cháng, yǒu duǎn yìdiǎnr de ma?", vi: "Chiếc này hơi dài một chút, có cái nào ngắn hơn một chút không?" },
    { ...chars.sales, hanzi: "你再试试这件中号蓝色的。", pinyin: "Nǐ zài shìshi zhè jiàn zhōnghào lánsè de.", vi: "Chị thử tiếp chiếc size M màu xanh này xem." },
    { ...chars.mary, hanzi: "这件肥瘦正合适，长短也合适。我就买这件了。", pinyin: "Zhè jiàn féishòu zhèng héshì, chángduǎn yě héshì. Wǒ jiù mǎi zhè jiàn le.", vi: "Chiếc này độ rộng chật vừa vặn, độ dài cũng hợp. Tôi mua chiếc này." }
  ],

  // BÀI 20: 祝你生日快乐
  "jc_1_2_20": [
    { ...chars.tian, sectionTitle: "课文一：今天几月几号 (Hôm nay ngày mấy tháng mấy)", hanzi: "张东，今天是几月几号？", pinyin: "Zhāng Dōng, jīntiān shì jǐ yuè jǐ hào?", vi: "Trương Đông, hôm nay là ngày mấy tháng mấy?" },
    { ...chars.zhang, hanzi: "今天是十月十八号，星期四。", pinyin: "Jīntiān shì shí yuè shíbā hào, xīngqī sì.", vi: "Hôm nay là ngày 18 tháng 10, thứ Năm." },
    { ...chars.tian, hanzi: "后天是玛丽的生日，你知道吗？", pinyin: "Hòutiān shì Mǎlì de shēngrì, nǐ zhīdào ma?", vi: "Ngày kia là sinh nhật của Mary đấy, bạn biết không?" },
    { ...chars.zhang, hanzi: "我不知道。她今年多大？", pinyin: "Wǒ bù zhīdào. Tā jīnnián duō dà?", vi: "Mình không biết. Năm nay cô ấy bao nhiêu tuổi rồi?" },
    { ...chars.tian, hanzi: "她属狗，今年二十岁。", pinyin: "Tā shǔ gǒu, jīnnián èrshí suì.", vi: "Cô ấy tuổi Tuất, năm nay tròn 20 tuổi." },
    { ...chars.zhang, sectionTitle: "课文二：举办生日晚会 (Tổ chức tiệc sinh nhật)", hanzi: "星期六晚上我们在她宿舍开一个生日晚会，好吗？", pinyin: "Xīngqī liù wǎnshang wǒmen zài tā sùshè kāi yí gè shēngrì wǎnhuì, hǎo ma?", vi: "Tối thứ Bảy chúng mình tổ chức một buổi tiệc sinh nhật ở phòng ký túc của cô ấy nhé?" },
    { ...chars.tian, hanzi: "太好了！我去买一个大蛋糕，大家一起祝她生日快乐！", pinyin: "Tài hǎo le! Wǒ qù mǎi yí gè dà dàngāo, dàjiā yìqǐ zhù tā shēngrì kuàilè!", vi: "Tuyệt quá! Mình sẽ đi mua một chiếc bánh gato to, mọi người cùng chúc bạn ấy sinh nhật vui vẻ!" }
  ],

  // BÀI 21: 明天我们七点一刻出发
  "jc_1_2_21": [
    { ...chars.wang, sectionTitle: "课文一：去长城 (Đi Vạn Lý Trường Thành)", hanzi: "同学们，明天我们去长城参观。", pinyin: "Tóngxuémen, míngtiān wǒmen qù Chángchéng cānguān.", vi: "Các em học sinh, ngày mai chúng ta sẽ đi tham quan Vạn Lý Trường Thành." },
    { ...chars.mike, hanzi: "老师，我们几点出发？在哪儿集合？", pinyin: "Lǎoshī, wǒmen jǐ diǎn chūfā? Zài nǎr jíhé?", vi: "Thưa thầy, mấy giờ chúng em xuất phát ạ? Và tập trung ở đâu ạ?" },
    { ...chars.wang, hanzi: "明天早上七点一刻在楼前集合，七点半准时开车。", pinyin: "Míngtiān zǎoshang qī diǎn yí kè zài lóu qián jíhé, qī diǎn bàn zhǔnshí kāi chē.", vi: "Sáng mai 7 giờ 15 tập trung trước tòa nhà, 7 giờ rưỡi xe lăn bánh đúng giờ." },
    { ...chars.mary, hanzi: "中午我们在哪儿吃午饭？", pinyin: "Zhōngwǔ wǒmen zài nǎr chī wǔfàn?", vi: "Buổi trưa chúng em ăn cơm trưa ở đâu ạ?" },
    { ...chars.wang, hanzi: "大家带点儿面包和水果，在长城上野餐。", pinyin: "Dàjiā dài diǎnr miànbāo hé shuǐguǒ, zài Chángchéng shang yěcān.", vi: "Các em mang theo ít bánh mì và hoa quả, chúng ta sẽ dã ngoại ngay trên Trường Thành." }
  ],

  // BÀI 22: 我打算去旅行
  "jc_1_2_22": [
    { ...chars.mike, sectionTitle: "课文一：假期旅行计划 (Kế hoạch du lịch kỳ nghỉ)", hanzi: "寒假你有什么打算？", pinyin: "Hánjià nǐ yǒu shénme dǎsuan?", vi: "Kỳ nghỉ đông bạn có dự định gì chưa?" },
    { ...chars.mary, hanzi: "我打算去中国南方旅行，北方太冷了。", pinyin: "Wǒ dǎsuan qù Zhōngguó nánfāng lǚxíng, běifāng tài lěng le.", vi: "Mình dự định đi du lịch miền Nam Trung Quốc, miền Bắc lạnh quá." },
    { ...chars.mike, hanzi: "你去哪些地方？", pinyin: "Nǐ qù nǎxiē dìfang?", vi: "Bạn đi những địa danh nào?" },
    { ...chars.mary, hanzi: "我想去西安、上海和桂林，听说桂林山水甲天下。", pinyin: "Wǒ xiǎng qù Xī'ān, Shànghǎi hé Guìlín, tīngshuō Guìlín shānshuǐ jiǎ tiānxià.", vi: "Mình muốn đi Tây An, Thượng Hải và Quế Lâm, nghe nói non nước Quế Lâm đẹp nhất trần gian." },
    { ...chars.mike, hanzi: "你一个人去还是跟朋友一起去？", pinyin: "Nǐ yí gè rén qù háishi gēn péngyou yìqǐ qù?", vi: "Bạn đi một mình hay đi cùng bạn bè?" },
    { ...chars.mary, hanzi: "我和罗兰一起去，我们俩已经买好火车票了。", pinyin: "Wǒ hé Luólán yìqǐ qù, wǒmen liǎ yǐjīng mǎihǎo huǒchēpiào le.", vi: "Mình đi cùng Roland, hai đứa mình đã mua xong vé tàu hỏa rồi." }
  ],

  // BÀI 23: 学校里边有邮局
  "jc_1_2_23": [
    { ...chars.roland, sectionTitle: "课文一：问路与位置 (Hỏi đường & phương vị)", hanzi: "请问，学校里边有邮局吗？", pinyin: "Qǐngwèn, xuéxiào lǐbian yǒu yóujú ma?", vi: "Xin hỏi, bên trong trường học có bưu điện không?" },
    { ...chars.zhang, hanzi: "有，图书馆西边就是一个邮局。", pinyin: "Yǒu, túshūguǎn xībian jiù shì yí gè yóujú.", vi: "Có, phía tây thư viện chính là một bưu điện." },
    { ...chars.roland, hanzi: "离这儿远不远？怎么走？", pinyin: "Lí zhèr yuǎn bu yuǎn? Zěnme zǒu?", vi: "Cách đây có xa không? Đi như thế nào ạ?" },
    { ...chars.zhang, hanzi: "不太远。往前走，过了教学楼往右拐就是。", pinyin: "Bú tài yuǎn. Wǎng qián zǒu, guò le jiàoxuélóu wǎng yòu guǎi jiù shì.", vi: "Không xa lắm. Cứ đi thẳng về phía trước, qua tòa nhà giảng đường rồi rẽ phải là tới." },
    { ...chars.roland, hanzi: "超市在邮局旁边吗？", pinyin: "Chāoshì zài yóujú pángbiān ma?", vi: "Siêu thị có ở bên cạnh bưu điện không ạ?" },
    { ...chars.zhang, hanzi: "对，邮局东边是书店，超市在书店对面。", pinyin: "Duì, yóujú dōngbian shì shūdiàn, chāoshì zài shūdiàn duìmiàn.", vi: "Đúng rồi, phía đông bưu điện là hiệu sách, siêu thị ở đối diện hiệu sách." }
  ],

  // BÀI 24: 我想学太极拳
  "jc_1_2_24": [
    { ...chars.mary, sectionTitle: "课文一：报名学太极拳 (Đăng ký học Thái Cực Quyền)", hanzi: "师傅，我想学太极拳，您能教我吗？", pinyin: "Shīfu, wǒ xiǎng xué tàijíquán, nín néng jiāo wǒ ma?", vi: "Thưa thầy võ sư, con muốn học Thái Cực Quyền, thầy dạy con được không ạ?" },
    { ...chars.master, hanzi: "当然可以。太极拳不仅能强身健体，还能陶冶性情。", pinyin: "Dāngrán kěyǐ. Tàijíquán bùjǐn néng qiángshēn jiàntǐ, hái néng táoyě xìngqíng.", vi: "Đương nhiên được. Thái Cực Quyền không những giúp rèn luyện thân thể cường tráng mà còn tu dưỡng tâm tính." },
    { ...chars.mary, hanzi: "太极拳难不难？我没有基础。", pinyin: "Tàijíquán nán bu nán? Wǒ méiyǒu jīchǔ.", vi: "Thái Cực Quyền có khó không ạ? Con chưa có nền tảng gì." },
    { ...chars.master, hanzi: "只要坚持天天练，一点儿也不难。", pinyin: "Zhǐyào jiānchí tiāntiān liàn, yìdiǎnr yě bù nán.", vi: "Chỉ cần kiên trì luyện tập mỗi ngày thì không khó chút nào." },
    { ...chars.mary, hanzi: "什么时候开始上课？", pinyin: "Shénme shíhou kāishǐ shàngkè?", vi: "Khi nào thì bắt đầu vào học ạ?" },
    { ...chars.master, hanzi: "下星期一开始，每天早晨六点半在小操场。", pinyin: "Xià xīngqī yī kāishǐ, měi tiān zǎochen liù diǎn bàn zài xiǎo cāochǎng.", vi: "Bắt đầu từ thứ Hai tuần sau, mỗi buổi sáng 6h30 tại sân tập nhỏ." }
  ],

  // BÀI 25: 她学得很好
  "jc_1_2_25": [
    { ...chars.zhang, sectionTitle: "课文一：谈论学习成绩 (Bàn về kết quả học tập)", hanzi: "罗兰，玛丽的汉语学得怎么样？", pinyin: "Luólán, Mǎlì de Hànyǔ xué de zěnmeyàng?", vi: "Roland, tiếng Hán của Mary học ra sao rồi?" },
    { ...chars.roland, hanzi: "她学得非常好。发音读得很准，汉字写得也很漂亮。", pinyin: "Tā xué de fēicháng hǎo. Fāyīn dú de hěn zhǔn, Hànzì xiě de yě hěn piàoliang.", vi: "Bạn ấy học rất giỏi. Phát âm đọc rất chuẩn, chữ Hán viết cũng rất đẹp." },
    { ...chars.zhang, hanzi: "她每天都认真复习吗？", pinyin: "Tā měi tiān dōu rènzhēn fùxí ma?", vi: "Ngày nào bạn ấy cũng chăm chỉ ôn bài à?" },
    { ...chars.roland, hanzi: "对，她起得很早，睡得很晚，学习非常刻苦。", pinyin: "Duì, tā qǐ de hěn zǎo, shuì de hěn wǎn, xuéxí fēicháng kèkǔ.", vi: "Đúng vậy, bạn ấy dậy rất sớm, ngủ rất muộn, học tập vô cùng miệt mài." },
    { ...chars.zhang, hanzi: "怪不得她这次期中考试考得这么好！", pinyin: "Guàibude tā zhè cì qīzhōng kǎoshì kǎo de zhème hǎo!", vi: "Hóa ra thảo nào kỳ thi giữa kỳ lần này bạn ấy thi điểm cao thế!" }
  ],

  // BÀI 26: 田芳去哪儿了
  "jc_1_2_26": [
    { ...chars.mary, sectionTitle: "课文一：田芳去哪儿了 (Điền Phương đi đâu rồi)", hanzi: "张东，田芳在宿舍吗？", pinyin: "Zhāng Dōng, Tián Fāng zài sùshè ma?", vi: "Trương Đông, Điền Phương có ở phòng ký túc không?" },
    { ...chars.zhang, hanzi: "她不在，她去书店买书了。", pinyin: "Tā bú zài, tā qù shūdiàn mǎi shū le.", vi: "Bạn ấy không có ở đây, bạn ấy ra hiệu sách mua sách rồi." },
    { ...chars.mary, hanzi: "她什么时候回来的？", pinyin: "Tā shénme shíhou huílái de?", vi: "Bạn ấy về từ lúc nào thế?" },
    { ...chars.zhang, hanzi: "她刚走半个小时，可能快回来了。你找她有事吗？", pinyin: "Tā gāng zǒu bàn gè xiǎoshí, kěnéng kuài huílái le. Nǐ zhǎo tā yǒu shì ma?", vi: "Bạn ấy mới đi nửa tiếng trước, có lẽ sắp về rồi. Bạn tìm cô ấy có việc gì không?" },
    { ...chars.mary, hanzi: "明天下午我们要去听音乐会，请转告她一声。", pinyin: "Míngtiān xiàwǔ wǒmen yào qù tīng yīnyuèhuì, qǐng zhuǎngào tā yì shēng.", vi: "Chiều mai bọn mình định đi nghe hòa nhạc, nhờ bạn nhắn lại với bạn ấy một câu nhé." },
    { ...chars.zhang, hanzi: "好的，她一回来我就告诉她。", pinyin: "Hǎo de, tā yì huílái wǒ jiù gàosu tā.", vi: "Được, bạn ấy vừa về là mình sẽ bảo ngay." }
  ],

  // BÀI 27: 我也去过北京
  "jc_1_2_27": [
    { ...chars.edward, sectionTitle: "课文一：去过中国哪些地方 (Đã từng đi những đâu ở Trung Quốc)", hanzi: "保罗，你去过长城吗？", pinyin: "Bǎoluó, nǐ qùguo Chángchéng ma?", vi: "Paul, bạn đã từng đi Vạn Lý Trường Thành chưa?" },
    { ...chars.paul, hanzi: "去过，去年秋天我去过一次，风景特别壮观。", pinyin: "Qùguo, qùnián qiūtiān wǒ qùguo yí cì, fēngjǐng tèbié zhuàngguān.", vi: "Từng đi rồi, mùa thu năm ngoái mình từng đi một lần, phong cảnh cực kỳ hùng vĩ." },
    { ...chars.edward, hanzi: "你吃过北京烤鸭吗？", pinyin: "Nǐ chīguo Běijīng kǎoyā ma?", vi: "Bạn đã từng ăn vịt quay Bắc Kinh chưa?" },
    { ...chars.paul, hanzi: "当然吃过，味道好极了！你呢？", pinyin: "Dāngrán chīguo, wèidao hǎo jí le! Nǐ ne?", vi: "Đương nhiên từng ăn rồi, mùi vị ngon tuyệt vời! Còn bạn?" },
    { ...chars.edward, hanzi: "我还没去过长城，也没吃过烤鸭。这个周末我们一起去吧！", pinyin: "Wǒ hái méi qùguo Chángchéng, yě méi chīguo kǎoyā. Zhè ge zhōumò wǒmen yìqǐ qù ba!", vi: "Mình vẫn chưa từng đi Trường Thành, cũng chưa từng được ăn vịt quay. Cuối tuần này chúng mình cùng đi nhé!" }
  ],

  // BÀI 28: 我吃了早饭就去
  "jc_1_2_28": [
    { ...chars.mary, sectionTitle: "课文一：日程安排 (Sắp xếp thời gian biểu)", hanzi: "麦克，明天上午你什么时候去实验室？", pinyin: "Màikè, míngtiān shàngwǔ nǐ shénme shíhou qù shíyànshì?", vi: "Mike, sáng mai mấy giờ bạn đi phòng thí nghiệm?" },
    { ...chars.mike, hanzi: "我吃了早饭就去，大约八点钟。", pinyin: "Wǒ chīle zǎofàn jiù qù, dàyuē bā diǎn zhōng.", vi: "Mình ăn sáng xong là đi ngay, khoảng 8 giờ." },
    { ...chars.mary, hanzi: "你做完实验以后做什么？", pinyin: "Nǐ zuòwán shíyàn yǐhòu zuò shénme?", vi: "Làm xong thí nghiệm thì bạn làm gì?" },
    { ...chars.mike, hanzi: "做完实验我就去图书馆借书，下午还要上听力课。", pinyin: "Zuòwán shíyàn wǒ jiù qù túshūguǎn jiè shū, xiàwǔ hái yào shàng tīnglì kè.", vi: "Làm xong thí nghiệm mình sẽ tới thư viện mượn sách ngay, buổi chiều còn phải học tiết Nghe." },
    { ...chars.mary, hanzi: "真充实！下了课我们一起去踢足球吧。", pinyin: "Zhēn chōngshí! Xià le kè wǒmen yìqǐ qù tī zúqiú ba.", vi: "Thật bận rộn ý nghĩa! Tan học xong chúng mình cùng đi đá bóng nhé." }
  ],

  // BÀI 29: 我都听懂了
  "jc_1_2_29": [
    { ...chars.roland, sectionTitle: "课文一：听力课反响 (Cảm nhận giờ học Nghe)", hanzi: "今天的听力课你听懂了吗？", pinyin: "Jīntiān de tīnglì kè nǐ tīngdǒng le ma?", vi: "Tiết học Nghe hôm nay bạn có nghe hiểu không?" },
    { ...chars.david, hanzi: "老师讲得比较慢，课文我都听懂了，但是录音里最后一段没全听清。", pinyin: "Lǎoshī jiǎng de bǐjiào màn, kèwén wǒ dōu tīngdǒng le, dànshì lùyīn lǐ zuìhòu yí duàn méi quán tīngqīng.", vi: "Thầy giáo giảng tương đối chậm, bài khóa mình đều nghe hiểu hết, nhưng đoạn cuối trong băng ghi âm chưa nghe rõ lắm." },
    { ...chars.roland, hanzi: "你做完课后练习了吗？", pinyin: "Nǐ zuòwán kèhòu liànxí le ma?", vi: "Bạn đã làm xong bài tập sau bài học chưa?" },
    { ...chars.david, hanzi: "已经做完了，我还看懂了生词表里的例句。", pinyin: "Yǐjīng zuòwán le, wǒ hái kàndǒng le shēngcíbiǎo lǐ de lìjù.", vi: "Làm xong hết rồi, mình còn đọc hiểu cả những câu ví dụ trong bảng từ mới nữa." },
    { ...chars.roland, hanzi: "太棒了！只要多听多练，我们的听力就会越来越好。", pinyin: "Tài bàng le! Zhǐyào duō tīng duō liàn, wǒmen de tīnglì jiù huì yuè lái yuè hǎo.", vi: "Tuyệt vời quá! Chỉ cần nghe nhiều luyện nhiều, kỹ năng nghe của chúng mình sẽ ngày càng tiến bộ." }
  ],

  // BÀI 30: 我来了两个月了
  "jc_1_2_30": [
    { ...chars.wang, sectionTitle: "课文一：总结留学生活 (Tổng kết cuộc sống du học)", hanzi: "麦克，你来北京多长时间了？", pinyin: "Màikè, nǐ lái Běijīng duō cháng shíjiān le?", vi: "Mike, em đến Bắc Kinh được bao lâu rồi?" },
    { ...chars.mike, hanzi: "老师，我已经来了两个多月了。", pinyin: "Lǎoshī, wǒ yǐjīng lái le liǎng gè duō yuè le.", vi: "Thưa thầy, em đã đến được hơn hai tháng rồi ạ." },
    { ...chars.wang, hanzi: "你习惯这里的生活了吗？气候怎么样？", pinyin: "Nǐ xíguàn zhèlǐ de shēnghuó le ma? Qìhòu zěnmeyàng?", vi: "Em đã quen với cuộc sống ở đây chưa? Khí hậu thế nào?" },
    { ...chars.mike, hanzi: "刚来的时候不太习惯，现在都习惯了。北京的气候很干燥，菜也很合胃口。", pinyin: "Gāng lái de shíhou bú tài xíguàn, xiànzài dōu xíguàn le. Běijīng de qìhòu hěn gānzào, cài yě hěn hé wèikǒu.", vi: "Lúc mới sang em chưa quen lắm, giờ thì quen hết rồi ạ. Khí hậu Bắc Kinh khá khô ráo, các món ăn cũng rất hợp khẩu vị." },
    { ...chars.wang, hanzi: "汉语水平提高得快吗？", pinyin: "Hànyǔ shuǐpíng tígāo de kuài ma?", vi: "Trình độ tiếng Hán nâng cao có nhanh không?" },
    { ...chars.mike, hanzi: "我每天坚持跟中国朋友交流一个小时，现在说话流利多了！", pinyin: "Wǒ měi tiān jiānchí gēn Zhōngguó péngyou jiāoliú yí gè xiǎoshí, xiànzài shuōhuà liúlì duō le!", vi: "Mỗi ngày em đều kiên trì trò chuyện một tiếng với các bạn Trung Quốc, giờ đây nói chuyện đã lưu loát hơn rất nhiều rồi ạ!" }
  ]
};

let updatedCount = 0;
jiaocheng.lessons.forEach(lesson => {
  if (vol1Dialogues[lesson.id]) {
    lesson.dialogues = vol1Dialogues[lesson.id];
    updatedCount++;
  }
});

fs.writeFileSync(dataPath, JSON.stringify(jiaocheng, null, 2), 'utf8');
console.log(`Successfully updated ${updatedCount} lessons in Volume 1 (1-1 & 1-2) with authentic dialogues!`);
