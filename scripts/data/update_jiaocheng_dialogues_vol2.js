const { dataFile } = require('./paths');
const fs = require('fs');
const path = require('path');

const dataPath = dataFile('hanyu_jiaocheng.json');
const jiaocheng = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

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
  doctor: { speaker: "大夫", displayName: "大夫 (Bác sĩ)", gender: "male", avatar: "👨", role: "Bác sĩ Bệnh viện trường" },
  police: { speaker: "警察", displayName: "警察 (Cảnh sát)", gender: "male", avatar: "👨", role: "Đồn công an trường học" }
};

const vol2Dialogues = {
  // BÀI 31: 我骑车骑得比较慢
  "jc_2_1_31": [
    { ...chars.tian, sectionTitle: "课文一：骑车去颐和园 (Đạp xe đi Di Hòa Viên)", hanzi: "麦克，明天我们骑自行车去颐和园，你去吗？", pinyin: "Màikè, míngtiān wǒmen qí zìxíngchē qù Yíhéyuán, nǐ qù ma?", vi: "Mike, ngày mai chúng mình đạp xe đi Di Hòa Viên, bạn đi không?" },
    { ...chars.mike, hanzi: "去啊，不过我骑车骑得比较慢，你们得等我。", pinyin: "Qù a, búguò wǒ qí chē qí de bǐjiào màn, nǐmen děi děng wǒ.", vi: "Đi chứ, nhưng mà mình đạp xe tương đối chậm, các bạn phải đợi mình đấy." },
    { ...chars.tian, hanzi: "没关系，我们一边骑一边看风景，不骑得太快。", pinyin: "Méi guānxi, wǒmen yìbiān qí yìbiān kàn fēngjǐng, bù qí de tài kuài.", vi: "Không sao đâu, bọn mình vừa đạp xe vừa ngắm cảnh, không đạp quá nhanh đâu." },
    { ...chars.mike, hanzi: "那就好。颐和园离咱们学校有多远？", pinyin: "Nà jiù hǎo. Yíhéyuán lí zánmen xuéxiào yǒu duō yuǎn?", vi: "Thế thì tốt quá. Di Hòa Viên cách trường chúng mình bao xa vậy?" },
    { ...chars.tian, hanzi: "大概有十公里，骑四十分钟就能到。", pinyin: "Dàgài yǒu shí gōnglǐ, qí sìshí fēnzhōng jiù néng dào.", vi: "Khoảng 10 cây số, đạp xe tầm 40 phút là tới." }
  ],

  // BÀI 32: 玛丽哭了
  "jc_2_1_32": [
    { ...chars.roland, sectionTitle: "课文一：玛丽怎么了 (Mary làm sao thế)", hanzi: "麦克，你看见玛丽了吗？她怎么哭了？", pinyin: "Màikè, nǐ kànjiàn Mǎlì le ma? Tā zěnme kū le?", vi: "Mike, bạn có nhìn thấy Mary không? Bạn ấy làm sao mà khóc thế?" },
    { ...chars.mike, hanzi: "她想家了。昨天她妈妈给她打电话，她忍不住就哭了。", pinyin: "Tā xiǎng jiā le. Zuótiān tā māma gěi tā dǎ diànhuà, tā rěnbuzhù jiù kū le.", vi: "Bạn ấy nhớ nhà đấy. Hôm qua mẹ gọi điện sang, bạn ấy không kìm được nên đã khóc." },
    { ...chars.roland, sectionTitle: "课文二：去医院看病 (Đi viện khám bệnh)", hanzi: "而且她这两天身体也不舒服，感冒发烧了。", pinyin: "Érqiě tā zhè liǎng tiān shēntǐ yě bù shūfu, gǎnmào fāshāo le.", vi: "Hơn nữa hai hôm nay người bạn ấy cũng không khỏe, bị cảm sốt rồi." },
    { ...chars.doctor, hanzi: "你先量一下体温，三十八度五，嗓子也发炎了。吃点儿药，多喝热水，好好睡一觉。", pinyin: "Nǐ xiān liáng yíxià tǐwēn, sānshíbā dù wǔ, sǎngzi yě fāyán le. Chī diǎnr yào, duō hē rèshuǐ, hǎohāo shuì yí jiào.", vi: "Cháu đo nhiệt độ trước đã nhé, 38 độ 5, họng cũng viêm rồi. Uống ít thuốc này, uống nhiều nước ấm và ngủ một giấc thật ngon nhé." },
    { ...chars.mary, hanzi: "谢谢大夫，我会按时吃药的。", pinyin: "Xièxie dàifu, wǒ huì ànshí chī yào de.", vi: "Cháu cảm ơn bác sĩ ạ, cháu sẽ uống thuốc đúng giờ." }
  ],

  // BÀI 33: 我买了一本书
  "jc_2_1_33": [
    { ...chars.zhang, sectionTitle: "课文一：买书交流 (Trao đổi mua sách)", hanzi: "麦克，你手里拿的是什么？", pinyin: "Màikè, nǐ shǒulǐ ná de shì shénme?", vi: "Mike, trên tay bạn cầm cái gì thế?" },
    { ...chars.mike, hanzi: "我刚才去王府井书店买了一本中国历史书和两盘磁带。", pinyin: "Wǒ gāngcái qù Wángfǔjǐng shūdiàn mǎi le yì běn Zhōngguó lìshǐ shū hé liǎng pán cídài.", vi: "Vừa nãy mình ra hiệu sách Vương Phủ Tỉnh mua một quyển sách Lịch sử Trung Quốc và hai cuộn băng cassette." },
    { ...chars.zhang, hanzi: "你借的书看完了吗？", pinyin: "Nǐ jiè de shū kànwán le ma?", vi: "Cuốn sách bạn mượn đã đọc xong chưa?" },
    { ...chars.mike, hanzi: "看完了，我已经还给图书馆了。这本书很有意思，你要看看吗？", pinyin: "Kànwán le, wǒ yǐjīng huán gěi túshūguǎn le. Zhè běn shū hěn yǒu yìsi, nǐ yào kànkan ma?", vi: "Đọc xong rồi, mình đã trả lại cho thư viện. Cuốn sách này rất thú vị, bạn có muốn đọc thử không?" },
    { ...chars.zhang, hanzi: "好啊，等你看完了借给我看几天。", pinyin: "Hǎo a, děng nǐ kànwán le jiè gěi wǒ kàn jǐ tiān.", vi: "Tuyệt quá, đợi bạn đọc xong thì cho mình mượn mấy hôm nhé." }
  ],

  // BÀI 34: 我打算请老师辅导
  "jc_2_1_34": [
    { ...chars.edward, sectionTitle: "课文一：请老师辅导 (Nhờ giáo viên phụ đạo)", hanzi: "保罗，你的口语进步真大，有什么秘诀吗？", pinyin: "Bǎoluó, nǐ de kǒuyǔ jìnbù zhēn dà, yǒu shénme mìjué ma?", vi: "Paul, khẩu ngữ của bạn tiến bộ vượt bậc thật đấy, có bí quyết gì không?" },
    { ...chars.paul, hanzi: "我打算请一位中国研究生辅导我练习口语，每周三次。", pinyin: "Wǒ dǎsuan qǐng yí wèi Zhōngguó yánjiūshēng fǔdǎo wǒ liànxí kǒuyǔ, měi zhōu sān cì.", vi: "Mình dự định mời một bạn học viên cao học Trung Quốc phụ đạo luyện khẩu ngữ, mỗi tuần ba buổi." },
    { ...chars.edward, hanzi: "老师叫你们每天都预习课文吗？", pinyin: "Lǎoshī jiào nǐmen měi tiān dōu yùxí kèwén ma?", vi: "Giáo viên có yêu cầu các bạn ngày nào cũng phải chuẩn bị bài trước không?" },
    { ...chars.paul, hanzi: "对，老师让我们不仅要背生词，还要复述课文大意。", pinyin: "Duì, lǎoshī ràng wǒmen bùjǐn yào bèi shēngcí, hái yào fùshù kèwén dàyì.", vi: "Đúng vậy, thầy bắt bọn mình không những phải học thuộc từ mới, mà còn phải thuật lại đại ý bài khóa nữa." },
    { ...chars.edward, hanzi: "这样练习确实很有成效，我也要请一位辅导老师。", pinyin: "Zhèyàng liànxí quèshí hěn yǒu chéngxiào, wǒ yě yào qǐng yí wèi fǔdǎo lǎoshī.", vi: "Luyện như vậy quả thực rất hiệu quả, mình cũng phải tìm một người phụ đạo thôi." }
  ],

  // BÀI 35: 现在的天气比以前暖和了
  "jc_2_1_35": [
    { ...chars.mary, sectionTitle: "课文一：北京的天气 (Thời tiết Bắc Kinh)", hanzi: "麦克，北京的春天来了，现在的天气比以前暖和多了！", pinyin: "Màikè, Běijīng de chūntiān lái le, xiànzài de tiānqì bǐ yǐqián nuǎnhuo duō le!", vi: "Mike, mùa xuân Bắc Kinh đã tới rồi, thời tiết bây giờ ấm hơn trước nhiều lắm!" },
    { ...chars.mike, hanzi: "是啊，冬天的气温常常在零下十度，冷极了。", pinyin: "Shì a, dōngtiān de qìwēn chángcháng zài língxià shí dù, lěng jí le.", vi: "Đúng vậy, nhiệt độ mùa đông thường xuyên dưới âm 10 độ, lạnh buốt giá." },
    { ...chars.mary, hanzi: "你家乡的冬天比北京暖和还是更冷？", pinyin: "Nǐ jiāxiāng de dōngtiān bǐ Běijīng nuǎnhuo háishi gèng lěng?", vi: "Mùa đông ở quê bạn ấm hơn hay còn lạnh hơn cả Bắc Kinh?" },
    { ...chars.mike, hanzi: "加拿大比北京还要冷，下雪下得更大。不过北京的风比加拿大更大一些。", pinyin: "Jiānádà bǐ Běijīng hái yào lěng, xià xuě xià de gèng dà. Búguò Běijīng de fēng bǐ Jiānádà gèng dà yìxiē.", vi: "Canada còn lạnh hơn cả Bắc Kinh, tuyết rơi dày hơn nhiều. Tuy nhiên gió ở Bắc Kinh thì lại to hơn ở Canada một chút." },
    { ...chars.mary, hanzi: "听说五月份北京的花都开了，那时候风景比现在更美丽。", pinyin: "Tīngshuō wǔ yuèfèn Běijīng de huā dōu kāi le, nà shíhou fēngjǐng bǐ xiànzài gèng měilì.", vi: "Nghe nói tháng Năm hoa ở Bắc Kinh nở rộ hết, lúc đó phong cảnh còn rực rỡ hơn bây giờ nhiều." }
  ],

  // BÀI 36: 他比我跑得快
  "jc_2_1_36": [
    { ...chars.david, sectionTitle: "课文一：体育锻炼与比赛 (Luyện tập thể thao & thi đấu)", hanzi: "保罗，你昨天参加校运动会的跑步比赛了吗？", pinyin: "Bǎoluó, nǐ zuótiān cānjiā xiào yùndònghuì de pǎobù bǐsài le ma?", vi: "Paul, hôm qua bạn có tham gia giải chạy ở đại hội thể thao trường không?" },
    { ...chars.paul, hanzi: "参加了。爱德华比我跑得快得多，他得了第一名。", pinyin: "Cānjiā le. Àidéhuá bǐ wǒ pǎo de kuài de duō, tā dé le dì-yī míng.", vi: "Có tham gia chứ. Edward chạy nhanh hơn mình nhiều lắm, bạn ấy đã đoạt giải nhất đấy." },
    { ...chars.david, hanzi: "你的跳高成绩怎么样？", pinyin: "Nǐ de tiàogāo chéngjì zěnmeyàng?", vi: "Thế còn thành tích nhảy cao của bạn ra sao?" },
    { ...chars.paul, hanzi: "我跳得不如大卫高，只得了第三名。大卫比我高五公分呢。", pinyin: "Wǒ tiào de bùrú Dàwèi gāo, zhǐ dé le dì-sān míng. Dàwèi bǐ wǒ gāo wǔ gōngfēn ne.", vi: "Mình nhảy không cao bằng David, chỉ được giải ba thôi. David cao hơn mình tới 5 phân lận." },
    { ...chars.david, hanzi: "友谊第一，比赛第二，大家锻炼了身体才是最重要的！", pinyin: "Yǒuyì dì-yī, bǐsài dì-èr, dàjiā duànliàn le shēntǐ cái shì zuì zhòngyào de!", vi: "Tình bạn là trên hết, thi đấu xếp thứ hai, mọi người rèn luyện nâng cao sức khỏe mới là điều quan trọng nhất!" }
  ],

  // BÀI 37: 我把行李准备好了
  "jc_2_1_37": [
    { ...chars.tian, sectionTitle: "课文一：准备出行行李 (Chuẩn bị hành lý lên đường)", hanzi: "张东，明天就要出发去上海了，你把行李收拾好了吗？", pinyin: "Zhāng Dōng, míngtiān jiù yào chūfā qù Shànghǎi le, nǐ bǎ xíngli shōushi hǎo le ma?", vi: "Trương Đông, ngày mai là xuất phát đi Thượng Hải rồi, bạn đã dọn dẹp xong hành lý chưa?" },
    { ...chars.zhang, hanzi: "我已经把衣服和洗漱用品都装进箱子里了。", pinyin: "Wǒ yǐjīng bǎ yīfu hé xǐshù yòngpǐn dōu zhuāng jìn xiāngzi lǐ le.", vi: "Mình đã xếp hết quần áo và đồ vệ sinh cá nhân vào vali rồi." },
    { ...chars.tian, hanzi: "你把身份证和火车票放在哪儿了？千万别忘了带。", pinyin: "Nǐ bǎ shēnfènzhèng hé huǒchēpiào fàng zài nǎr le? Qiānwàn bié wàng le dài.", vi: "Bạn để căn cước công dân và vé tàu ở đâu rồi? Tuyệt đối đừng quên mang theo đấy." },
    { ...chars.zhang, hanzi: "放心吧，我把证件都放在随身背包里了。", pinyin: "Fàngxīn ba, wǒ bǎ zhèngjiàn dōu fàng zài suíshēn bēibāo lǐ le.", vi: "Yên tâm đi, mình đã cất toàn bộ giấy tờ vào ba lô đeo bên người rồi." },
    { ...chars.tian, hanzi: "别忘了把宿舍门窗关好，电源插头拔掉。", pinyin: "Bié wàng le bǎ sùshè ménchuāng guānhǎo, diànyuán chātóu bádiào.", vi: "Đừng quên đóng kỹ cửa sổ phòng ký túc và rút hết các phích cắm điện ra nhé." }
  ],

  // BÀI 38: 请把窗户打开
  "jc_2_1_38": [
    { ...chars.wang, sectionTitle: "课文一：课堂指令与动作 (Chỉ lệnh lớp học & thao tác)", hanzi: "教室里有点儿闷，请坐在窗边的同学把窗户打开通风。", pinyin: "Jiàoshì lǐ yǒudiǎnr mèn, qǐng zuò zài chuāngbiān de tóngxué bǎ chuānghu dǎkāi tōngfēng.", vi: "Trong lớp hơi ngột ngạt một chút, xin mời bạn ngồi cạnh cửa sổ mở cửa sổ ra cho thoáng gió." },
    { ...chars.mike, hanzi: "好的老师，我已经把两边的窗户都打开了。", pinyin: "Hǎo de lǎoshī, wǒ yǐjīng bǎ liǎngbiān de chuānghu dōu dǎkāi le.", vi: "Vâng thưa thầy, em đã mở toang cả hai bên cửa sổ rồi ạ." },
    { ...chars.wang, hanzi: "大家把课本翻到第一百二十页，看上面的生词。", pinyin: "Dàjiā bǎ kèběn fān dào dì-yìbǎi èrshí yè, kàn shàngmiàn de shēngcí.", vi: "Cả lớp mở sách giáo khoa đến trang 120, nhìn vào các từ mới phía trên." },
    { ...chars.mary, hanzi: "老师，请把黑板上的那句话再念一遍，好吗？", pinyin: "Lǎoshī, qǐng bǎ hēibǎn shàng de nà jù huà zài niàn yí biàn, hǎo ma?", vi: "Thưa thầy, thầy đọc lại câu trên bảng đen một lần nữa được không ạ?" },
    { ...chars.wang, hanzi: "好的，大家注意听我的发音和声调。", pinyin: "Hǎo de, dàjiā zhùyì tīng wǒ de fāyīn hé shēngdiào.", vi: "Được, các em chú ý lắng nghe cách phát âm và thanh điệu của thầy nhé." }
  ],

  // BÀI 39: 房间被他收拾得干干净净
  "jc_2_1_39": [
    { ...chars.mary, sectionTitle: "课文一：打扫宿舍 (Dọn dẹp ký túc xá)", hanzi: "罗兰，快进来看，咱们的客厅变样了！", pinyin: "Luólán, kuài jìnlái kàn, zánmen de kètīng biànyàng le!", vi: "Roland, mau vào đây xem này, phòng khách của chúng mình đổi khác hoàn toàn rồi!" },
    { ...chars.roland, hanzi: "哇！地板被拖得干干净净，桌子也被擦得一尘不染。", pinyin: "Wā! Dìbǎn bèi tuō de gāngānjìngjìng, zhuōzi yě bèi cā de yìchén-bùrǎn.", vi: "Oa! Sàn nhà được lau sạch bong kin kít, mặt bàn cũng được lau không một hạt bụi." },
    { ...chars.mary, hanzi: "桌上的旧书报全被麦克整整齐齐地码在书架上了。", pinyin: "Zhuō shàng de jiù shūbào quán bèi Màikè zhěngzhěng-qíqí de mǎ zài shūjià shàng le.", vi: "Chồng sách báo cũ trên bàn đều được Mike xếp ngay ngắn ngăn nắp lên giá sách rồi." },
    { ...chars.roland, hanzi: "麦克真勤快！窗帘也被洗过了，闻起来有一股香味。", pinyin: "Màikè zhēn qínkuai! Chuānglián yě bèi xǐguo le, wén qǐlai yǒu yì gǔ xiāngwèi.", vi: "Mike chăm chỉ thật đấy! Rèm cửa cũng được đem đi giặt rồi, ngửi có mùi thơm thoang thoảng." },
    { ...chars.mike, hanzi: "今天阳光很好，大家住在干净的环境里心情会更好！", pinyin: "Jīntiān yángguāng hěn hǎo, dàjiā zhù zài gānjìng de huánjìng lǐ xīnqíng huì gèng hǎo!", vi: "Hôm nay trời nắng đẹp, mọi người sống trong môi trường sạch sẽ tâm trạng sẽ sảng khoái hơn nhiều!" }
  ],

  // BÀI 40: 我的自行车被偷了
  "jc_2_1_40": [
    { ...chars.paul, sectionTitle: "课文一：报案寻找失物 (Báo án tìm đồ thất lạc)", hanzi: "警察同志，我的山地自行车被偷了！", pinyin: "Jǐngchá tóngzhì, wǒ de shāndì zìxíngchē bèi tōu le!", vi: "Đồng chí cảnh sát, xe đạp địa hình của tôi bị trộm mất rồi!" },
    { ...chars.police, hanzi: "别着急，你在哪儿停的车？什么时候发现被偷的？", pinyin: "Bié zháojí, nǐ zài nǎr tíng de chē? Shénme shíhou fāxiàn bèi tōu de?", vi: "Đừng cuống lên, bạn dựng xe ở đâu? Phát hiện bị mất trộm lúc mấy giờ?" },
    { ...chars.paul, hanzi: "今天下午两点我把车锁在三号教学楼前，下课出来车锁就被撬坏了，车不见了。", pinyin: "Jīntiān xiàwǔ liǎng diǎn wǒ bǎ chē suǒ zài sān hào jiàoxuélóu qián, xiàkè chūlái chēsuǒ jiù bèi qiàohuài le, chē bú jiàn le.", vi: "Chiều nay 2 giờ tôi khóa xe trước tòa giảng đường số 3, tan học ra thì ổ khóa đã bị cạy hỏng, xe biến mất rồi." },
    { ...chars.police, hanzi: "教学楼门口有监控摄像头，录像已经被我们调出来了，很快就会有结果。", pinyin: "Jiàoxuélóu ménkǒu yǒu jiānkòng shèxiàngtóu, lùxiàng yǐjīng bèi wǒmen diào chūlai le, hěn kuài jiù huì yǒu jiéguǒ.", vi: "Cổng giảng đường có camera an ninh, hình ảnh trích xuất đã được chúng tôi kiểm tra, sẽ sớm có kết quả thôi." },
    { ...chars.paul, hanzi: "太感谢你们了！以后我一定把车停到有人看管的车棚里。", pinyin: "Tài gǎnxiè nǐmen le! Yǐhòu wǒ yídìng bǎ chē tíng dào yǒurén kānguǎn de chēpéng lǐ.", vi: "Vô cùng cảm ơn các anh! Sau này tôi nhất định sẽ gửi xe vào bãi xe có người trông nom cẩn thận." }
  ],

  // BÀI 41: 汽车开过来了
  "jc_2_2_41": [
    { ...chars.mary, sectionTitle: "课文一：在校门口等车 (Chờ xe trước cổng trường)", hanzi: "麦克，校车什么时候开过来？", pinyin: "Màikè, xiàochē shénme shíhou kāi guòlai?", vi: "Mike, xe đưa đón của trường bao giờ lái qua đây?" },
    { ...chars.mike, hanzi: "你看，前面那辆黄色的中巴车已经开过来了！", pinyin: "Nǐ kàn, qiánmiàn nà liàng huángsè de zhōngbāchē yǐjīng kāi guòlai le!", vi: "Bạn nhìn kìa, chiếc xe buýt nhỏ màu vàng đằng trước đã lái qua tới nơi rồi!" },
    { ...chars.mary, hanzi: "车上坐满了人吗？我们上得去吗？", pinyin: "Chē shàng zuòmǎn le rén ma? Wǒmen shàng de qù ma?", vi: "Trên xe đã ngồi chật kín người chưa? Chúng mình có lên được không?" },
    { ...chars.mike, hanzi: "车上人不多。王老师正从车里走出来呢，咱们快走过去吧。", pinyin: "Chē shàng rén bù duō. Wáng lǎoshī zhèng cóng chē lǐ zǒu chūlai ne, zánmen kuài zǒu guòqu ba.", vi: "Trên xe người không đông. Thầy Vương đang từ trên xe bước xuống kìa, chúng mình mau đi qua đó đi." },
    { ...chars.wang, hanzi: "大家把大件行李递上来，排队上车，注意脚下安全。", pinyin: "Dàjiā bǎ dàjiàn xíngli dì shànglai, páiduì shàng chē, zhùyì jiǎoxià ānquán.", vi: "Các em chuyền hành lý lớn lên đây, xếp hàng bước lên xe, chú ý bước chân an toàn nhé." }
  ],

  // BÀI 42: 他走进来坐下了
  "jc_2_2_42": [
    { ...chars.edward, sectionTitle: "课文一：教室里的连续动作 (Chuỗi động tác trong lớp học)", hanzi: "刚才那位穿西装的先生是谁？", pinyin: "Gāngcái nà wèi chuān xīzhuāng de xiānsheng shì shéi?", vi: "Vị tiên sinh mặc âu phục vừa nãy là ai thế?" },
    { ...chars.zhang, hanzi: "那是著名语言学家李教授，他从大门外走进来，在第一排坐下了。", pinyin: "Nà shì zhùmíng yǔyánxuéjiā Lǐ jiàoshòu, tā cóng dàmén wài zǒu jìnlái, zài dì-yī pái zuò xià le.", vi: "Đó là giáo sư Lý, một nhà ngôn ngữ học nổi tiếng, thầy từ ngoài cổng lớn bước vào và ngồi xuống ở hàng ghế đầu rồi." },
    { ...chars.edward, hanzi: "他今天来给我们做学术讲座吗？", pinyin: "Tā jīntiān lái gěi wǒmen zuò xuéshù jiǎngzuò ma?", vi: "Hôm nay thầy tới làm buổi tọa đàm học thuật cho chúng ta à?" },
    { ...chars.zhang, hanzi: "对，他把讲义拿了出来，正微笑着向大家点头致意呢。", pinyin: "Duì, tā bǎ jiǎngyì ná le chūlai, zhèng wēixiào zhe xiàng dàjiā diǎntóu zhìyì ne.", vi: "Đúng vậy, thầy đã lấy tập đề cương bài giảng ra rồi, đang mỉm cười gật đầu chào mọi người đấy." },
    { ...chars.edward, hanzi: "太荣幸了！咱们快把笔记本拿出来，认真记录。", pinyin: "Tài róngxìng le! Zánmen kuài bǎ bǐjìběn ná chūlai, rènzhēn jìlù.", vi: "Vinh hạnh quá! Chúng mình mau lấy sổ tay ra ghi chép cẩn thận thôi." }
  ],

  // BÀI 43: 我看得懂中文报纸
  "jc_2_2_43": [
    { ...chars.david, sectionTitle: "课文一：阅读中文报刊 (Đọc báo chí tiếng Trung)", hanzi: "麦克，你手里的《人民日报》你看得懂吗？", pinyin: "Màikè, nǐ shǒulǐ de \"Rénmín Rìbào\" nǐ kàn de dǒng ma?", vi: "Mike, tờ Nhân Dân Nhật Báo trên tay bạn đọc có hiểu nổi không?" },
    { ...chars.mike, hanzi: "查着字典勉强看得懂大意，生词太多的话就看不懂了。", pinyin: "Chá zhe zìdiǎn miǎnqiǎng kàn de dǒng dàyì, shēngcí tài duō de huà jiù kàn bu dǒng le.", vi: "Tra từ điển thì gắng gượng đọc hiểu được đại ý, nếu từ mới nhiều quá thì sẽ không hiểu nổi." },
    { ...chars.david, hanzi: "电视上的新闻联播你听得懂听不懂？", pinyin: "Diànshì shàng de xīnwén liánbō nǐ tīng de dǒng tīng bu dǒng?", vi: "Bản tin thời sự trên truyền hình bạn nghe có hiểu không?" },
    { ...chars.mike, hanzi: "播音员语速太快，我常常跟不上，只能听懂百分之六十。", pinyin: "Bōyīnyuán yǔsù tài kuài, wǒ chángcháng gēn bu shàng, zhǐ néng tīngdǒng bǎifēn zhī liùshí.", vi: "Phát thanh viên tốc độ nói nhanh quá, mình thường theo không kịp, chỉ nghe hiểu được khoảng 60% thôi." },
    { ...chars.david, hanzi: "能看懂报纸、听懂新闻已经非常了不起了，再坚持半年你就能完全听懂了！", pinyin: "Néng kàndǒng bàozhǐ, tīngdǒng xīnwén yǐjīng fēicháng liǎobuqǐ le, zài jiānchí bàn nián nǐ jiù néng wánquán tīngdǒng le!", vi: "Đọc hiểu được báo và nghe được thời sự đã là siêu đỉnh rồi, kiên trì thêm nửa năm nữa là bạn sẽ nghe hiểu trọn vẹn!" }
  ],

  // BÀI 44: 这个礼堂坐得下一千人
  "jc_2_2_44": [
    { ...chars.paul, sectionTitle: "课文一：大礼堂容量 (Sức chứa của đại hội trường)", hanzi: "今晚的新年联欢晚会是在学校大礼堂开吗？", pinyin: "Jīn wǎn de xīnnián liánhuān wǎnhuì shì zài xuéxiào dà lǐtáng kāi ma?", vi: "Đêm liên hoan mừng năm mới tối nay có tổ chức ở đại hội trường của trường không?" },
    { ...chars.mary, hanzi: "对，咱们学校的大礼堂特别宽敞，能坐得下一千两百人呢！", pinyin: "Duì, zánmen xuéxiào de dà lǐtáng tèbié kuānchang, néng zuò de xià yì qiān liǎng bǎi rén ne!", vi: "Đúng vậy, đại hội trường trường mình rộng thênh thang, chứa vừa tới 1.200 người lận đấy!" },
    { ...chars.paul, hanzi: "全校师生都去的话，地方坐得下坐不下？", pinyin: "Quán xiào shīshēng dōu qù de huà, dìfang zuò de xià zuò bu xià?", vi: "Nếu toàn bộ thầy cô và sinh viên toàn trường đều đi thì chỗ có ngồi vừa không?" },
    { ...chars.mary, hanzi: "坐得下，后排还有很多活动折叠椅，完全容得下。", pinyin: "Zuò de xià, hòupái hái yǒu hěn duō huódòng zhédiéyǐ, wánquán róng de xià.", vi: "Ngồi vừa chứ, hàng ghế sau còn có rất nhiều ghế gấp cơ động, hoàn toàn đủ sức chứa." },
    { ...chars.paul, hanzi: "那太棒了，听说留学生班还要表演京剧呢，咱们早点儿去占个好座位！", pinyin: "Nà tài bàng le, tīngshuō liúxuéshēng bān hái yào biǎoyǎn jīngjù ne, zánmen zǎo diǎnr qù zhàn gè hǎo zuòwèi!", vi: "Thế thì tuyệt quá, nghe nói lớp lưu học sinh còn biểu diễn Kinh kịch nữa, chúng mình đi sớm xí chỗ ngồi đẹp nhé!" }
  ],

  // BÀI 45: 不仅会说汉语，还会写汉字
  "jc_2_2_45": [
    { ...chars.tian, sectionTitle: "课文一：全面发展的语言能力 (Năng lực ngôn ngữ phát triển toàn diện)", hanzi: "大卫，我发现你的中文水平真令人佩服！", pinyin: "Dàwèi, wǒ fāxiàn nǐ de zhōngwén shuǐpíng zhēn lìng rén pèifú!", vi: "David, mình thấy trình độ tiếng Trung của bạn thật đáng nể phục!" },
    { ...chars.david, hanzi: "哪里哪里，你过奖了，我还要多向你们学习。", pinyin: "Nǎlǐ nǎlǐ, nǐ guòjiǎng le, wǒ hái yào duō xiàng nǐmen xuéxí.", vi: "Đâu có đâu có, bạn quá khen rồi, mình còn phải học hỏi các bạn nhiều lắm." },
    { ...chars.tian, hanzi: "你不仅普通话说得地道流利，而且毛笔字写得也非常潇洒有气韵。", pinyin: "Nǐ bùjǐn pǔtōnghuà shuō de dìdao liúlì, érqiě máobǐzì xiě de yě fēicháng xiāosǎ yǒu qìyùn.", vi: "Bạn không những nói tiếng Phổ thông chuẩn chỉ lưu loát, mà viết chữ thư pháp cũng rất phóng khoáng có thần thái." },
    { ...chars.david, hanzi: "因为我从小对中国书法着迷，汉字不仅是交流工具，更是一门高深优雅的艺术。", pinyin: "Yīnwèi wǒ cóngxiǎo duì Zhōngguó shūfǎ zháomí, Hànzì bùjǐn shì jiāoliú gōngjù, gèng shì yì mén gāoshēn yōuyǎ de yìshù.", vi: "Bởi vì từ nhỏ mình đã mê mẩn thư pháp Trung Hoa, chữ Hán không chỉ là công cụ giao tiếp mà còn là một môn nghệ thuật cao thâm tao nhã." },
    { ...chars.tian, hanzi: "说得太深刻了！希望你以后能成为促进两国文化的民间大使。", pinyin: "Shuō de tài shēnkè le! Xīwàng nǐ yǐhòu néng chéngwéi cùjìn liǎng guó wénhuà de mínjiān dàshǐ.", vi: "Nói sâu sắc quá! Mong rằng sau này bạn sẽ trở thành đại sứ nhân dân thúc đẩy văn hóa hai nước." }
  ],

  // BÀI 46: 无论刮风下雨他都来
  "jc_2_2_46": [
    { ...chars.roland, sectionTitle: "课文一：赞扬求学毅力 (Ca ngợi nghị lực học tập)", hanzi: "今天外边狂风暴雨的，麦克还会来上课吗？", pinyin: "Jīntiān wàibiān kuángfēng-bàoyǔ de, Màikè hái huì lái shàngkè ma?", vi: "Hôm nay ngoài trời mưa to gió lớn thế này, Mike có đến lớp học nữa không nhỉ?" },
    { ...chars.edward, hanzi: "他一定会来！无论刮风下雨还是严寒酷暑，他都从不迟到早退。", pinyin: "Tā yídìng huì lái! Wúlùn guāfēng-xiàyǔ háishi yánhán-kùshǔ, tā dōu cóng bù chídào zǎotuì.", vi: "Cậu ấy chắc chắn sẽ đến! Dù mưa to gió lớn hay giá rét buốt xương, cậu ấy đều chưa từng đi muộn về sớm bao giờ." },
    { ...chars.roland, hanzi: "这种毅力真值得我们每个人学习。", pinyin: "Zhè zhǒng yìlì zhēn zhíde wǒmen měi gè rén xuéxí.", vi: "Nghị lực kiên cường này thật xứng đáng để mỗi người chúng ta noi theo." },
    { ...chars.mike, hanzi: "大家好！虽然路上积水很深，但我提前半小时出门，终于赶到了！", pinyin: "Dàjiā hǎo! Suīrán lùshang jīshuǐ hěn shēn, dàn wǒ tíqián bàn xiǎoshí chūmén, zhōngyú gǎndào le!", vi: "Chào mọi người! Tuy đường ngập nước khá sâu, nhưng mình đã chủ động đi sớm nửa tiếng, cuối cùng cũng tới kịp rồi!" },
    { ...chars.edward, hanzi: "你看，我就说他无论遇到什么困难都不会放弃的！快擦擦雨水，别着凉了。", pinyin: "Nǐ kàn, wǒ jiù shuō tā wúlùn yù dào shénme kùnnan dōu bú huì fàngqì de! Kuài cācā yǔshuǐ, bié zháoliáng le.", vi: "Bạn thấy chưa, mình đã bảo là dù gặp khó khăn gì cậu ấy cũng không chùn bước mà! Mau lau nước mưa đi, kẻo cảm lạnh đấy." }
  ],

  // BÀI 47: 越来越好，越学越有意思
  "jc_2_2_47": [
    { ...chars.wang, sectionTitle: "课文一：汉语学习心得 (Cảm nhận hành trình học tiếng Hán)", hanzi: "同学们，学了这一年汉语，大家有什么体会？", pinyin: "Tóngxuémen, xué le zhè yì nián Hànyǔ, dàjiā yǒu shénme tǐhuì?", vi: "Các em học sinh, sau một năm học tiếng Hán, các em có cảm nhận và đúc kết gì?" },
    { ...chars.mary, hanzi: "老师，刚开始我觉得特别难，但现在我觉得越来越好，越学越有意思！", pinyin: "Lǎoshī, gāng kāishǐ wǒ juéde tèbié nán, dàn xiànzài wǒ juéde yuè lái yuè hǎo, yuè xué yuè yǒu yìsi!", vi: "Thưa thầy, lúc mới bắt đầu em thấy vô cùng khó, nhưng giờ đây em thấy càng ngày càng tốt hơn, càng học càng thấy hay ạ!" },
    { ...chars.mike, hanzi: "对，掌握的词汇越多，读起文章来就越轻松，跟中国人聊天也越有自信。", pinyin: "Duì, zhǎngwò de cíhuì yuè duō, dú qǐ wénzhāng lái jiù yuè qīngsōng, gēn Zhōngguó rén liáotiān yě yuè yǒu zìxìn.", vi: "Đúng thế ạ, nắm được càng nhiều từ vựng thì đọc văn bản càng nhẹ nhàng, trò chuyện với người Trung Quốc càng thêm tự tin." },
    { ...chars.wang, hanzi: "好极了！只要保持这种热情，你们的中文水平会越来越高，前途会越来越光明！", pinyin: "Hǎo jí le! Zhǐyào bǎochí zhè zhǒng rèqíng, nǐmen de zhōngwén shuǐpíng huì yuè lái yuè gāo, qiántú huì yuè lái yuè guāngmíng!", vi: "Tuyệt vời lắm! Chỉ cần giữ vững nhiệt huyết này, trình độ tiếng Trung của các em sẽ ngày càng cao, tiền đồ ngày càng xán lạn!" }
  ],

  // BÀI 48: 虽然很累，但是很开心
  "jc_2_2_48": [
    { ...chars.paul, sectionTitle: "课文一：攀登泰山归来 (Trở về sau chuyến leo núi Thái Sơn)", hanzi: "大卫，周末去爬泰山感觉怎么样？累不累？", pinyin: "Dàwèi, zhōumò qù pá Tàishān gǎnjué zěnmeyàng? Lèi bu lèi?", vi: "David, cuối tuần đi leo núi Thái Sơn cảm giác thế nào? Có mệt không?" },
    { ...chars.david, hanzi: "虽然爬了整整五个小时，两腿酸痛特别累，但是登顶看到日出的那一刻，心里特别开心！", pinyin: "Suīrán pá le zhěngzhěng wǔ gè xiǎoshí, liǎng tuǐ suāntòng tèbié lèi, dànshì dēngdǐng kàndào rìchū de nà yí kè, xīnlǐ tèbié kāixīn!", vi: "Tuy leo suốt 5 tiếng đồng hồ, hai chân mỏi nhừ cực kỳ mệt, nhưng khoảnh khắc đứng trên đỉnh núi ngắm mặt trời mọc, trong lòng vui sướng vô cùng!" },
    { ...chars.paul, hanzi: "孔子登东山而小鲁，登泰山而小天下，确实名不虚传！", pinyin: "Kǒngzǐ dēng Dōngshān ér xiǎo Lǔ, dēng Tàishān ér xiǎo tiānxià, quèshí míng-bù-xū-chuán!", vi: "Khổng Tử lên núi Đông Sơn thấy nước Lỗ nhỏ bé, lên đỉnh Thái Sơn thấy cả thiên hạ nhỏ lại, quả nhiên danh bất hư truyền!" },
    { ...chars.david, hanzi: "虽然过程很艰苦，但是磨炼了意志，结识了许多热情的中国驴友。", pinyin: "Suīrán guòchéng hěn jiānkǔ, dànshì móliàn le yìzhì, jiéshí le xǔduō rèqíng de Zhōngguó lǘyǒu.", vi: "Tuy quá trình rất gian khổ, nhưng đã tôi luyện ý chí và kết bạn được với rất nhiều phượt thủ Trung Quốc nồng hậu." },
    { ...chars.paul, hanzi: "下次有这样的登山活动，你一定要叫上我！", pinyin: "Xià cì yǒu zhèyàng de dēngshān huódòng, nǐ yídìng yào jiào shàng wǒ!", vi: "Lần sau có hoạt động leo núi như thế này, bạn nhất định phải gọi mình cùng đi nhé!" }
  ],

  // BÀI 49: 如果明天下雨，我们就不去
  "jc_2_2_49": [
    { ...chars.tian, sectionTitle: "课文一：商量野餐备用方案 (Thảo luận phương án dã ngoại dự phòng)", hanzi: "张东，明天的香山红叶野餐活动准备得怎么样了？", pinyin: "Zhāng Dōng, míngtiān de Xiāngshān hóngyè yěcān huódòng zhǔnbèi de zěnmeyàng le?", vi: "Trương Đông, buổi dã ngoại ngắm lá đỏ Hương Sơn ngày mai chuẩn bị đến đâu rồi?" },
    { ...chars.zhang, hanzi: "食品和饮料都买齐了，不过刚才天气预报说夜里有中雨。", pinyin: "Shípǐn hé yǐnliào dōu mǎi qí le, búguò gāngcái tiānqì yùbào shuō yèlǐ yǒu zhōngyǔ.", vi: "Đồ ăn và nước uống đều mua đủ rồi, nhưng ban nãy dự báo thời tiết báo đêm nay có mưa vừa." },
    { ...chars.tian, hanzi: "如果明天下雨，山路会很湿滑，我们就不去了吧？", pinyin: "Rúguǒ míngtiān xiàyǔ, shānlù huì hěn shīhuá, wǒmen jiù bú qù le ba?", vi: "Nếu ngày mai trời mưa, đường núi sẽ rất trơn trượt, chúng mình không đi nữa nhé?" },
    { ...chars.zhang, hanzi: "好的，如果下雨，我们就改去中国国家博物馆看特展；如果天晴，我们就按原计划出发。", pinyin: "Hǎo de, rúguǒ xiàyǔ, wǒmen jiù gǎi qù Zhōngguó Guójiā Bówùguǎn kàn tèzhǎn; rúguǒ tiān qíng, wǒmen jiù àn yuán jìhuà chūfā.", vi: "Được, nếu trời mưa thì chuyển sang đi Bảo tàng Quốc gia Trung Quốc xem triển lãm đặc biệt; còn nếu trời quang mây tạnh thì cứ theo kế hoạch ban đầu xuất phát." },
    { ...chars.tian, hanzi: "这个两全其美的安排好极了，我现在就在微信群里通知大家。", pinyin: "Zhè ge liǎngquán-qíměi de ānpái hǎo jí le, wǒ xiànzài jiù zài Wēixìn qún lǐ tōngzhī dàjiā.", vi: "Cách sắp xếp đôi bên vẹn toàn này tuyệt vời quá, mình lên nhóm WeChat thông báo cho mọi người ngay đây." }
  ],

  // BÀI 50: 既然来了，就多玩几天
  "jc_2_2_50": [
    { ...chars.zhang, sectionTitle: "课文一：热情挽留老友 (Nồng hậu giữ bạn ở lại chơi)", hanzi: "爱德华，听说你后天就要回德国过圣诞节了？", pinyin: "Àidéhuá, tīngshuō nǐ hòutiān jiù yào huí Déguó guò Shèngdànjié le?", vi: "Edward, nghe nói ngày kia bạn phải về Đức đón Giáng sinh rồi à?" },
    { ...chars.edward, hanzi: "本来打算后天走，但我父母说今年全家来北京和我一起团聚。", pinyin: "Běnlái dǎsuan hòutiān zǒu, dàn wǒ fùmǔ shuō jīnnián quán jiā lái Běijīng hé wǒ yìqǐ tuánjù.", vi: "Vốn định ngày kia về, nhưng bố mẹ mình bảo năm nay cả nhà sẽ bay sang Bắc Kinh đoàn tụ cùng mình." },
    { ...chars.zhang, hanzi: "太好了！既然叔叔阿姨都来了，就让他们多玩几天，好好感受一下北京的冬日风情！", pinyin: "Tài hǎo le! Jìrán shūshu āyí dōu lái le, jiù ràng tāmen duō wán jǐ tiān, hǎohāo gǎnshòu yíxià Běijīng de dōngrì fēngqíng!", vi: "Tuyệt quá! Đã là hai bác cất công sang đây rồi thì cứ để hai bác ở lại chơi thêm ít ngày, cảm nhận trọn vẹn phong vị mùa đông Bắc Kinh!" },
    { ...chars.edward, hanzi: "既然大家都这么热情，我就陪他们去故宫、北海公园滑冰，再去王府井尝尝地道的小吃。", pinyin: "Jìrán dàjiā dōu zhème rèqíng, wǒ jiù péi tāmen qù Gùgōng, Běihǎi Gōngyuán huábīng, zài qù Wángfǔjǐng chángchang dìdao de xiǎochī.", vi: "Đã mọi người nồng hậu như vậy thì mình sẽ đưa bố mẹ đi Cố Cung, trượt băng ở Công viên Bắc Hải, rồi ra Vương Phủ Tỉnh thưởng thức quà vặt truyền thống." },
    { ...chars.zhang, hanzi: "到时候我给你们当向导，带你们去胡同里喝正宗的豆汁儿吃焦圈！", pinyin: "Dào shíhou wǒ gěi nǐmen dāng xiàngdǎo, dài nǐmen qù hútòng lǐ hē zhèngzōng de dòuzhīr chī jiāoquān!", vi: "Đến lúc đó mình sẽ làm hướng dẫn viên cho nhà bạn, dẫn cả nhà vào ngõ sâu thưởng thức món nước đậu nành và bánh vòng giòn chính tông!" }
  ]
};

let updatedCount = 0;
jiaocheng.lessons.forEach(lesson => {
  if (vol2Dialogues[lesson.id]) {
    lesson.dialogues = vol2Dialogues[lesson.id];
    updatedCount++;
  }
});

fs.writeFileSync(dataPath, JSON.stringify(jiaocheng, null, 2), 'utf8');
console.log(`Successfully updated ${updatedCount} lessons in Volume 2 (2-1 & 2-2) with authentic dialogues!`);
