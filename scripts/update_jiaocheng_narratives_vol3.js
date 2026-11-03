const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/hanyu_jiaocheng.json');
const jiaocheng = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const vol3Narratives = {
  // BÀI 51: 亡羊补牢
  "jc_3_1_51": {
    titleHanzi: "亡羊补牢，未为迟也",
    titlePinyin: "Wáng yáng bǔ láo, wèi wéi chí yě",
    titleVi: "Mất cừu mới lo sửa chuồng, vẫn chưa phải là muộn",
    summary: "Điển tích ngụ ngôn cổ đại dạy bài học sâu sắc: sau khi gặp tổn thất hoặc phạm sai lầm, kịp thời sửa đổi và bổ khuyết vẫn có thể cứu vãn tương lai.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "从前，有一个牧羊人养了一群羊。一天早晨，他去放羊时发现少了一只羊。仔细一看，原来羊圈破了一个大窟窿，夜里恶狼从窟窿钻进去把羊叼走了。邻居好心地劝他：“赶紧把羊圈修好吧，不然狼还会来的。” 牧羊人却不在乎地摇摇头说：“羊都已经丢了，修羊圈还有什么用呢？”",
        pinyin: "Cóngqián, yǒu yí ge mùyángrén yǎng le yì qún yáng. Yì tiān zǎochén, tā qù fàngyáng shí fāxiàn shǎo le yì zhī yáng. Zǐxì yí kàn, yuánlái yángjuàn pò le yí ge dà kūlong, yèli èláng cóng kūlong zuān jìnqu bǎ yáng diāo zǒu le. Línjū hǎoxīn de quàn tā: “Gǎnjǐn bǎ yángjuàn xiū hǎo ba, bùrán láng hái huì lái de.” Mùyángrén què bú zàihu de yáoyáo-tóu shuō: “Yáng dōu yǐjīng diū le, xiū yángjuàn hái yǒu shénme yòng ne?”",
        vi: "Thuở xưa, có một người chăn cừu nuôi một đàn cừu. Một buổi sáng, khi đi chăn cừu ông phát hiện thiếu mất một con. Nhìn kỹ lại mới thấy chuồng cừu đã bị thủng một lỗ lớn, ban đêm chó sói dữ chui qua lỗ ấy tha cừu đi mất. Người hàng xóm tốt bụng khuyên ông: 'Mau sửa lại chuồng cừu đi, nếu không sói sẽ lại tới đấy.' Người chăn cừu lại dửng dưng lắc đầu nói: 'Cừu đã mất rồi, sửa chuồng còn có ích gì nữa đâu?'"
      },
      {
        paraNum: 2,
        hanzi: "结果第二天早晨，牧羊人发现狼果然又从窟窿钻了进来，又叼走了一只羊。这时他才后悔万分，痛定思痛。他立刻动手找来木桩和荆棘，把窟窿结结实实地堵严实了。从此以后，他的羊再也没有被狼叼走过。这个成语告诫我们：在生活中犯了错误或遭遇了挫折，只要及时吸取教训采取补救措施，就不算太晚。",
        pinyin: "Jiéguǒ dì-èr tiān zǎochén, mùyángrén fāxiàn láng guǒrán yòu cóng kūlong zuān le jìnlái, yòu diāo zǒu le yì zhī yáng. Zhè shí tā cái hòuhuǐ-wànfēn, tòngdìng-sītòng. Tā lìkè dòngshǒu zhǎo lái mùzhuāng hé jīngjí, bǎ kūlong jiējiē-shīshī de dǔ yánshi le. Cóngcǐ yǐhòu, tā de yáng zài yě méiyǒu bèi láng diāo zǒu guo. Zhè ge chéngyǔ gàojiè wǒmen: zài shēnghuó zhōng fàn le cuòwù huò zāoyù le cuòzhé, zhǐyào jíshí xīqǔ jiàoxun cǎiqǔ bǔjiù cuòshī, jiù bú suàn tài wǎn.",
        vi: "Kết quả sáng ngày hôm sau, người chăn cừu phát hiện sói quả nhiên lại chui qua lỗ thủng vào cắn tha mất thêm một con cừu nữa. Lúc này ông mới ân hận tột cùng, đau đớn tỉnh ngộ. Ông lập tức bắt tay tìm cọc gỗ và gai nhọn, bịt thật kín và kiên cố lỗ thủng. Kể từ đó trở đi, đàn cừu của ông không bao giờ bị sói tha đi nữa. Thành ngữ này răn dạy chúng ta: trong cuộc sống khi mắc sai lầm hoặc gặp trắc trở, chỉ cần kịp thời rút kinh nghiệm và áp dụng biện pháp khắc phục thì không bao giờ là quá muộn."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "“亡羊补牢”这个成语告诉了我们什么生活道理？",
        qPinyin: "“Wáng yáng bǔ láo” zhè ge chéngyǔ gàosu le wǒmen shénme shēnghuó dàolǐ?",
        qVi: "Thành ngữ 'Mất bò mới lo làm chuồng' dạy cho chúng ta đạo lý gì trong cuộc sống?",
        aHanzi: "犯了错误只要及时总结教训并改正，就不算晚。",
        aVi: "Phạm sai lầm chỉ cần kịp thời rút ra bài học và sửa đổi thì không bao giờ là muộn."
      }
    ]
  },

  // BÀI 52: 守株待兔
  "jc_3_1_52": {
    titleHanzi: "守株待兔与侥幸心理",
    titlePinyin: "Shǒu zhū dài tù yǔ jiǎoxìng xīnlǐ",
    titleVi: "Ôm cây đợi thỏ và tâm lý trông chờ may rủi",
    summary: "Câu chuyện ngụ ngôn nổi tiếng của Hàn Phi Tử châm biếm những kẻ không chịu lao động thực chất mà chỉ ôm mộng ngồi mát ăn bát vàng.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在战国时期的宋国，有一个农夫每天在田里辛勤地耕作。有一天，一只飞奔的野兔不知因何受到惊吓，慌不择路，一头撞在田边的一截大树桩上，当场折断了脖子死掉了。农夫白白捡了一只肥嫩的野兔，高兴得手舞足蹈，当天美美地吃了一顿丰盛的兔肉大餐。",
        pinyin: "Zài Zhànguó shíqī de Sòng Guó, yǒu yí ge nóngfū měitiān zài tián lǐ xīnqín de gēngzuò. Yǒu yì tiān, yì zhī fēibēn de yětù bùzhī yīnhé shòudào jīngxià, huāngbùzélù, yītóu zhuàng zài tiánbiān de yì jié dà shùzhuāng shang, dāngchǎng zhéduàn le bózǐ sǐ diào le. Nóngfū báibái jiǎn le yì zhī féinèn de yětù, gāoxìng de shǒuwǔ-zúdǎo, dàngtiān měiměi de chī le yí dùn fēngshèng de tùròu dàcān.",
        vi: "Thời Chiến Quốc ở nước Tống, có một người nông dân hằng ngày cày cấy chăm chỉ trên cánh đồng. Một hôm, có một con thỏ rừng đang chạy thục mạng không biết vì sao hoảng sợ, mất phương hướng đâm sầm đầu vào gốc cây to bên bờ ruộng, gãy cổ chết tươi tại chỗ. Người nông dân tự nhiên nhặt được con thỏ béo tốt, mừng rỡ chân múa tay may, hôm đó được bữa tiệc thịt thỏ no nê thịnh soạn."
      },
      {
        paraNum: 2,
        hanzi: "从此以后，农夫把锄头扔在一旁，再也不肯下地干活。他整天坐在那截树桩旁边，痴痴地盼望着再有一只兔子撞死在树上。日子一天天过去了，不仅兔子没有再来，他的田地也长满了荒草，庄稼全枯死了，农夫最终沦为了全天下人的笑柄。这个故事讽刺了那些企图不劳而获、把偶然幸运当成必然规律的愚蠢行为。",
        pinyin: "Cóngcǐ yǐhòu, nóngfū bǎ chútou rēng zài yìpáng, zài yě bù kěn xiàdì gànhuó. Tā zhěngtiān zuò zài nà jié shùzhuāng pángbiān, chīchī de pànwàng zhe zài yǒu yì zhī tùzi zhuàng sǐ zài shù shang. Rìzi yìtiāntiān guòqù le, bùjǐn tùzi méiyǒu zài lái, tā de tiándì yě zhǎng mǎn le huāngcǎo, zhuāngjia quán kūsǐ le, nóngfū zuìzhōng lúnwéi le quántiānxià rén de xiàobǐng. Zhè ge gùshì fěngcì le nàxiē qǐtú bùláo-érhuò, bǎ ǒurán xìngyùn dàngchéng bìrán guīlǜ de yúchǔn xíngwéi.",
        vi: "Từ đó trở đi, người nông dân vứt phắt cây cuốc sang một bên, không chịu xuống đồng làm việc nữa. Suốt ngày anh ta ngồi thừ bên gốc cây ấy, ngây ngô mong mỏi lại có một con thỏ nữa lao đầu chết vào thân cây. Ngày tháng dần trôi, chẳng những không có con thỏ nào đến nữa mà đồng ruộng mọc um tùm cỏ dại, hoa màu khô héo chết rụi hết, người nông dân cuối cùng trở thành trò cười cho thiên hạ. Câu chuyện châm biếm những kẻ toan tính không làm mà đòi hưởng, lấy vận may ngẫu nhiên làm quy luật tất yếu."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "宋国的农夫最后为什么沦为天下人的笑柄？",
        qPinyin: "Sòng Guó de nóngfū zuìhòu wèishénme lún wéi tiānxià rén de xiàobǐng?",
        qVi: "Người nông dân nước Tống tại sao cuối cùng lại trở thành trò cười cho thiên hạ?",
        aHanzi: "因为他妄想不劳而获，荒废了庄稼。",
        aVi: "Bởi vì anh ta ảo tưởng không làm mà hưởng, bỏ hoang phế cả đồng ruộng mùa màng."
      }
    ]
  },

  // BÀI 53: 塞翁失马
  "jc_3_1_53": {
    titleHanzi: "塞翁失马，焉知非福",
    titlePinyin: "Sài wēng shī mǎ, yān zhī fēi fú",
    titleVi: "Tái ông mất ngựa, đâu biết chẳng phải là phúc",
    summary: "Triết lý biện chứng Đông phương về mối quan hệ nhân quả tương hỗ giữa họa và phúc trong biến chuyển cuộc đời.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在古代北方的边塞要隘，住着一位精通占卜的老人。一天，老人家的良马无缘无故走失到了胡人的境地。邻居们都跑来安慰他，老人却从容地笑道：“这怎么就不能变成一件好事呢？” 过了几个月，那匹走失的马不仅自己跑了回来，还带来了一匹胡人的高头骏马。邻居们纷纷跑来道贺，老人却叹道：“这难道就不能变成一场灾祸吗？”",
        pinyin: "Zài gǔdài běifāng de biānsài yào'ài, zhù zhe yí wèi jīngtōng zhānbǔ de lǎorén. Yì tiān, lǎorén jiā de liángmǎ wúyuán-wúgù zǒushī dào le Húrén de jìngdì. Línjūmen dōu pǎo lái ānwèi tā, lǎorén què cóngróng de xiào dào: “Zhè zěnme jiù bù néng biànchéng yí jiàn hǎoshì ne?” Guò le jǐ ge yuè, nà pǐ zǒushī de mǎ bùjǐn zìjǐ pǎo le huílái, hái dàilái le yì pǐ Húrén de gāotóu-jùnmǎ. Línjūmen fēnfēn pǎo lái dàohè, lǎorén què tàn dào: “Zhè nándào jiù bù néng biànchéng yì chǎng zāihuò ma?”",
        vi: "Thời cổ ở vùng biên ải phía bắc, có một cụ già tinh thông thuật bói toán cư ngụ. Một hôm, con ngựa tốt của nhà cụ vô cớ đi lạc vào lãnh địa người Hồ. Hàng xóm đều chạy đến an ủi, ông lão lại điềm đạm cười bảo: 'Biết đâu việc này lại biến thành chuyện tốt lành chăng?' Mấy tháng sau, con ngựa lạc không những tự chạy về mà còn dẫn theo một con tuấn mã cao lớn của người Hồ. Hàng xóm nô nức đến chúc mừng, ông lão lại thở dài: 'Biết đâu chuyện này lại biến thành tai họa chăng?'"
      },
      {
        paraNum: 2,
        hanzi: "老人的儿子非常喜欢骑马，有一天他不慎从骏马背上摔了下来，跌断了大腿骨，成了跛子。邻居们又来慰问，老人依然平静地说：“这怎么就不能变成福祉呢？” 不久之后，边塞爆发了残酷的战争，官府征召所有青年男子入伍当兵，十个有九个战死沙场。唯独老人的儿子因为跛脚免于征兵，父子俩得以保全性命、安度余生。这个典故告诉我们：世事变幻莫测，祸福相依，处顺境莫得意忘形，居逆境莫灰心丧气。",
        pinyin: "Lǎorén de érzi fēicháng xǐhuan qímǎ, yǒu yì tiān tā búshèn cóng jùnmǎ bèi shang shuāi le xiàlái, diē duàn le dàtuǐgǔ, chéng le bǒzi. Línjūmen yòu lái wèiwèn, lǎorén yīrán píngjìng de shuō: “Zhè zěnme jiù bù néng biànchéng fúzhǐ ne?” Bùjiǔ zhīhòu, biānsài bàofā le cánhù de zhànzhēng, guānfǔ zhēngzhào suǒyǒu qīngnián nánzǐ rùwǔ dāngbīng, shí ge yǒu jiǔ ge zhànsǐ shāchǎng. Wéidú lǎorén de érzi yīnwèi bǒjiǎo miǎnyú zhēngbīng, fùzǐ liǎ déyǐ bǎoquán xìngmìng, āndù yúshēng. Zhè ge diǎngù gàosu wǒmen: shìshì biànhuàn-mòcè, huòfú xiāngyī, chǔ shùnjìng mò déyì-wàngxíng, jū nìjìng mò huīxīn-sàngqì.",
        vi: "Con trai ông lão rất thích cưỡi ngựa, một ngày nọ chẳng may từ lưng ngựa ngã nhào xuống, gãy xương đùi, trở thành người tàn tật. Hàng xóm lại đến hỏi thăm, ông lão vẫn bình thản: 'Biết đâu đây lại là điều phúc?' Ít lâu sau biên ải bùng nổ chiến tranh tàn khốc, quan phủ bắt tất cả thanh niên trai tráng nhập ngũ, mười người thì chín người tử trận nơi sa trường. Riêng con trai ông nhờ chân thọt được miễn tòng quân, hai cha con bảo toàn được tính mạng sống trọn tuổi già. Điển tích này dạy chúng ta: sự đời biến chuyển khôn lường, họa phúc nương tựa nhau, ở thế thuận đừng đắc ý quên mình, khi hoạn nạn chớ nản lòng thoái chí."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "老人的儿子为什么能免于战死沙场？",
        qPinyin: "Lǎorén de érzi wèishénme néng miǎnyú zhànsǐ shāchǎng?",
        qVi: "Tại sao con trai ông lão lại tránh được cái chết nơi chiến trường?",
        aHanzi: "因为他骑马摔断了腿变成跛子，不用当兵打仗。",
        aVi: "Bởi vì anh ta ngã ngựa gãy chân thành người tàn tật nên không phải đi lính đánh trận."
      }
    ]
  },

  // BÀI 54: 狐假虎威
  "jc_3_1_54": {
    titleHanzi: "狐假虎威的狡黠与盲目",
    titlePinyin: "Hú jiǎ hǔ wēi de jiǎoxiá yǔ mángmù",
    titleVi: "Cáo mượn oai hùm: sự giảo quyệt và mê muội",
    summary: "Truyện ngụ ngôn vạch trần kẻ bất tài dựa dẫm quyền thế của người khác để bắt nạt người lương thiện.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在茂密的大森林里，凶猛的老虎正在捕食，它在灌木丛中一把抓住了一只狡猾的狐狸。正当老虎张开血盆大口准备饱餐一顿的时候，狐狸眼珠骨碌一转，厉声喝道：“你敢吃我？我是天帝派来做百兽之王的！你吃了我就是违抗天帝的命令！” 老虎被它的严厉语气震慑住了，半信半疑。",
        pinyin: "Zài màomì de dà sēnlín lǐ, xiōngměng de lǎohǔ zhèngzài bǔshí, tā zài guànmùcóng zhōng yìbǎ zhuāzhù le yì zhī jiǎohuá de húli. Zhèng dāng lǎohǔ zhāng kāi xuèpén-dàkǒu zhǔnbèi bǎocān yí dùn de shíhou, húli yǎnzhū gūlu yí zhuàn, lìshēng hè dào: “Nǐ gǎn chī wǒ? Wǒ shì Tiāndì pài lái zuò bǎishòu zhī wáng de! Nǐ chī le wǒ jiù shì wéikàng Tiāndì de mìnglìng!” Lǎohǔ bèi tā de yánlì yǔqì zhènshè zhù le, bànxìn-bànyí.",
        vi: "Trong cánh rừng rậm rạp, con hổ hung dữ đang đi săn mồi, nó vồ trúng một con cáo tinh ranh giữa bụi rậm. Ngay khi hổ mở to miệng đỏ lòm chuẩn bị ăn thịt, cáo đảo mắt một vòng, quát lớn: 'Ngươi dám ăn ta sao? Ta là chúa tể muôn loài do Thượng Đế phái xuống! Ngươi mà ăn ta là chống lệnh Trời!' Hổ bị ngữ khí đanh thép của cáo trấn áp, nửa tin nửa ngờ."
      },
      {
        paraNum: 2,
        hanzi: "狐狸昂首挺胸地说：“你如果不信，就跟在我的后面走一趟，看百兽见了我敢不敢逃跑！” 老虎答应了，便紧紧跟在狐狸身后。森林里的小鹿、野猪和猴子看见狐狸身后威风凛凛的老虎，吓得四散奔逃。老虎真以为野兽们是怕狐狸，却不知百兽怕的正是自己。成语“狐假虎威”用来比喻依仗别人的势力欺压恐吓弱小者的恶劣行径。",
        pinyin: "Húli ángshǒu-tǐngxiōng de shuō: “Nǐ rúguǒ bú xìn, jiù gēn zài wǒ de hòumiàn zǒu yí tàng, kàn bǎishòu jiàn le wǒ gǎn bu gǎn táopǎo!” Lǎohǔ dāying le, biàn jǐnjǐn gēn zài húli shēnhòu. Sēnlín lǐ de xiǎolù, yězhū hé hóuzi kànjiàn húli shēnhòu wēifēng-lǐnlǐn de lǎohǔ, xià de sìsàn-bēntáo. Lǎohǔ zhēn yǐwéi yěshòumen shì pà húli, què bùzhī bǎishòu pà de zhèng shì zìjǐ. Chéngyǔ “hú jiǎ hǔ wēi” yòng lái bǐyù yīzhàng biérén de shìli qīyā kǒnghè ruòxiǎozhě de èliè xíngjìng.",
        vi: "Cáo ưỡn ngực ngẩng cao đầu nói: 'Nếu ngươi không tin thì hãy đi sau lưng ta một chuyến xem muôn thú thấy ta có dám chạy trốn không!' Hổ đồng ý, liền bám sát sau lưng cáo. Hươu nai, lợn rừng và lũ khỉ trong rừng nhìn thấy con hổ oai phong lẫm liệt sau lưng cáo thì khiếp vía tán loạn chạy tháo thân. Hổ tưởng thật rằng muôn thú sợ cáo, mà không hay rằng muôn thú sợ chính là mình. Thành ngữ 'Cáo mượn oai hùm' dùng để ví von hành vi ỷ thế người khác để ức hiếp dọa dẫm kẻ yếu thế."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "森林里的动物们四散奔逃真正害怕的是谁？",
        qPinyin: "Sēnlín lǐ de dòngwùmen sìsàn-bēntáo zhēnzhèng hàipà de shì shéi?",
        qVi: "Muôn thú trong rừng tán loạn bỏ chạy thực chất là sợ ai?",
        aHanzi: "真正害怕的是跟在狐狸后面的猛虎。",
        aVi: "Thực chất là sợ con hổ hung dữ đi sau lưng cáo."
      }
    ]
  },

  // BÀI 55: 画蛇添足
  "jc_3_1_55": {
    titleHanzi: "画蛇添足的多此一举",
    titlePinyin: "Huà shé tiān zú de duō cǐ yì jǔ",
    titleVi: "Vẽ rắn thêm chân: việc làm thừa thãi vô ích",
    summary: "Hành động làm thừa thãi, làm quá giới hạn dẫn đến mất đi thành quả xứng đáng của chính bản thân.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "古代楚国有一家贵族祭祀祖先，祭祀完毕后赏给仆人们一壶美酒。仆人们商量说：“几个人喝这壶酒不够喝，一个人喝才过瘾。我们在地上画蛇，谁先画好，这壶酒就归谁！” 大家纷纷拿树枝在泥地上全神贯注地画了起来。",
        pinyin: "Gǔdài Chǔ Guó yǒu yì jiā guìzú jìsì zǔxiān, jìsì wánbì hòu shǎng gěi púrénmen yì hú měijiǔ. Púrénmen shāngliang shuō: “Jǐ ge rén hē zhè hú jiǔ bú gòu hē, yí ge rén hē cái guòyǐn. Wǒmen zài dì shang huà shé, shéi xiān huà hǎo, zhè hú jiǔ jiù guī shéi!” Dàjiā fēnfēn ná shùzhī zài nídì shang quánshén-guànzhù de huà le qǐlái.",
        vi: "Thời cổ ở nước Sở có một nhà quý tộc cúng tế tổ tiên, xong việc thưởng cho đám gia nhân một bầu rượu ngon. Đám người bàn nhau: 'Mấy người uống thì không đủ, một người uống mới đã. Chúng ta cùng vẽ rắn lên mặt đất, ai vẽ xong trước thì bầu rượu này thuộc về người đó!' Mọi người đều cầm cành cây chăm chú vẽ lên đất."
      },
      {
        paraNum: 2,
        hanzi: "有一个人画技娴熟，三两下就把一条蛇画成了。他左手端起酒壶，看别人都还没画完，便得意忘形地卖弄道：“我还能给蛇添上四只脚呢！” 说着便右手拿枝条给蛇画脚。还没等他画完，另一个人已经把蛇画好了，一把抢过酒壶一饮而尽，并讥笑他说：“蛇本来就没有脚，你画脚做什么呢？” 这个成语比喻做了多余的事，反而坏了事情。",
        pinyin: "Yǒu yí ge rén huàjì xiánshú, sān liǎng xià jiù bǎ yì tiáo shé huà chéng le. Tā zuǒshǒu duān qǐ jiǔhú, kàn biérén dōu hái méi huà wán, biàn déyì-wàngxíng de màinong dào: “Wǒ hái néng gěi shé tiān shàng sì zhī jiǎo ne!” Shuō zhe biàn yòushǒu ná zhītiáo gěi shé huà jiǎo. Hái méi děng tā huà wán, lìng yí ge rén yǐjīng bǎ shé huà hǎo le, yìbǎ qiǎng guò jiǔhú yì yǐn ér jìn, bìng jīxiào tā shuō: “Shé běnlái jiù méiyǒu jiǎo, nǐ huà jiǎo zuò shénme ne?” Zhè ge chéngyǔ bǐyù zuò le duōyú de shì, fǎn'ér huài le shìqing.",
        vi: "Có một người vẽ rất nhanh, thoăn thoắt mấy cái đã vẽ xong một con rắn. Tay trái anh ta nhấc bầu rượu lên, thấy mọi người còn chưa vẽ xong, liền đắc ý khoe khoang: 'Ta còn có thể vẽ thêm 4 chân cho rắn nữa cơ!' Vừa nói vừa cầm cành cây vẽ chân. Chưa kịp vẽ xong thì người thứ hai đã hoàn thành con rắn, giật phắt lấy bầu rượu tu một hơi cạn sạch, vừa cười nhạo: 'Rắn vốn dĩ không có chân, anh vẽ chân làm chi?' Thành ngữ này ví việc làm điều thừa thãi, rốt cuộc lại làm hỏng đại sự."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "第一个画完蛇的人为什么最终没有喝到酒？",
        qPinyin: "Dì-yī ge huà wán shé de rén wèishénme zuìzhōng méiyǒu hē dào jiǔ?",
        qVi: "Người đầu tiên vẽ xong rắn tại sao cuối cùng lại không được uống rượu?",
        aHanzi: "因为他得意忘形，多此一举给蛇画脚，被别人抢先了。",
        aVi: "Bởi vì anh ta đắc chí khoe khoang làm chuyện thừa thãi vẽ chân cho rắn nên bị người khác giành trước."
      }
    ]
  },

  // BÀI 56: 刻舟求剑
  "jc_3_1_56": {
    titleHanzi: "刻舟求剑与变易哲学",
    titlePinyin: "Kè zhōu qiú jiàn yǔ biànyì zhéxué",
    titleVi: "Khắc thuyền tìm kiếm và triết lý vạn vật đổi dời",
    summary: "Thế giới không ngừng vận động biến đổi, không thể dùng tư duy dập khuôn, máy móc xơ cứng để giải quyết hoàn cảnh mới.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在战国时期的楚国，有一个人乘船渡江。船行至江水深处，由于风浪颠簸，他腰间悬挂的一把贵重宝剑不慎滑落水中。同船的乘客们都大惊失色，替他扼腕叹息。",
        pinyin: "Zài Zhànguó shíqī de Chǔ Guó, yǒu yí ge rén chéng chuán dù jiāng. Chuán xíng zhì jiāngshuǐ shēnchù, yóuyú fēnglàng diānbǒ, tā yāojiān xuánguà de yì bǎ guìzhòng bǎojiàn búshèn huáluò shuǐ zhōng. Tóngchuán de chéngkèmen dōu dàjīng-shìsè, tì tā èwàn-tànxī.",
        vi: "Thời Chiến Quốc ở nước Sở, có một người đi thuyền qua sông lớn. Thuyền ra tới giữa dòng nước sâu, vì sóng gió chòng chành, thanh bảo kiếm quý giá đeo bên hông anh ta chẳng may tuột rơi xuống nước. Hành khách cùng thuyền đều hoảng hốt thảng thốt, tiếc nuối thay cho anh ta."
      },
      {
        paraNum: 2,
        hanzi: "那个人却一点儿也不慌乱，他慢条斯理地拔出小刀，在宝剑落水的船舷边上刻了一个深深的记号，并对大家说：“我的宝剑就是从这里掉下去的。” 船靠岸停泊后，他便从刻着记号的地方跳入水中打捞宝剑。船已经行进了几十里，而宝剑沉在原地并未移动，像这样去求剑，岂不是太荒唐了吗？这个故事讽刺了那些不懂得客观世界不断变化、思想僵化死板的人。",
        pinyin: "Nà ge rén què yìdiǎnr yě bù huāngluàn, tā màntiāo-sīlǐ de bá chū xiǎodāo, zài bǎojiàn luòshuǐ de chuánxián biān shang kè le yí ge shēnshēn de jìhao, bìng duì dàjiā shuō: “Wǒ de bǎojiàn jiùshì cóng zhèlǐ diào xiàqu de.” Chuán kào'àn tíngbó hòu, tā biàn cóng kè zhe jìhao de dìfang tiào rù shuǐ zhōng dǎlāo bǎojiàn. Chuán yǐjīng xíngjìn le jǐshí lǐ, ér bǎojiàn chén zài yuándì bìng wèi yídòng, xiàng zhèyàng qù qiú jiàn, qǐ búshì tài huāngtáng le ma? Zhè ge gùshì fěngcì le nàxiē bù dǒngde kèguān shìjiè bùduàn biànhuà, sīxiǎng jiānghuà sǐbǎn de rén.",
        vi: "Người nọ chẳng hề hoảng sợ, từ từ rút con dao găm nhỏ ra, khắc một dấu sâu hoắm lên mạn thuyền đúng chỗ kiếm rơi, rồi nói với mọi người: 'Bảo kiếm của tôi rơi xuống từ chỗ này.' Thuyền cập bến đỗ, anh ta liền từ vết khắc trên mạn thuyền nhảy xuống nước mò kiếm. Thuyền đã đi hàng chục dặm, còn gươm chìm tận đáy sông ban đầu không hề chuyển dời, tìm kiếm như vậy há chẳng quá nực cười sao? Câu chuyện châm biếm sâu cay những kẻ tư duy bảo thủ, cứng nhắc máy móc trước dòng đời vạn biến."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "楚国人为什么在岸边找不到掉落水中的宝剑？",
        qPinyin: "Chǔguó rén wèishénme zài ànbiān zhǎo bu dào diàoluò shuǐ zhōng de bǎojiàn?",
        qVi: "Người nước Sở tại sao không thể tìm lại thanh kiếm dưới nước ở bờ bên kia?",
        aHanzi: "因为船在移动，而宝剑留在原地的水底并未移动。",
        aVi: "Bởi vì con thuyền di chuyển, còn thanh kiếm chìm lại đáy sông ban đầu không hề di chuyển."
      }
    ]
  },

  // BÀI 57: 滥竽充数
  "jc_3_1_57": {
    titleHanzi: "滥竽充数与真才实学",
    titlePinyin: "Làn yú chōng shù yǔ zhēncái-shíxué",
    titleVi: "Lập lờ đánh lận con đen và thực tài năng lực",
    summary: "Người không có thực tài trà trộn vào tập thể mạo nhận, sớm muộn gì khi đối diện khảo nghiệm độc lập cũng sẽ bị lật tẩy.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在战国时期的齐国，齐宣王非常喜欢听吹竽这种古代管乐器，而且讲究排场，每次演奏都必须召集三百人合奏。有一个南郭先生根本不会吹竽，却设法混进了皇家乐队。每当大家吹奏时，他就鼓起腮帮子摇头晃脑地装模作样，居然蒙混过关，领到了丰厚的国家薪俸。",
        pinyin: "Zài Zhànguó shíqī de Qí Guó, Qí Xuānwáng fēicháng xǐhuan tīng chuī yú zhè zhǒng gǔdài guǎnyuèqì, érqiě jiǎngjiu páichǎng, měi cì yǎnzòu dōu bìxū zhàojí sānbǎi rén hézòu. Yǒu yí ge Nánguō xiānsheng gēnběn bú huì chuī yú, què shèfǎ hùn jìn le huángjiā yuèduì. Měi dāng dàjiā chuīzòu shí, tā jiù gǔ qǐ sāibāngzi yáotóu-huàngnǎo de zhuāngmó-zuòyàng, jūrán ménghùn-guòguān, lǐng dào le fēnghòu de guójiā xīnfèng.",
        vi: "Thời Chiến Quốc ở nước Tề, Tề Tuyên Vương rất thích nghe thổi khèn Vu - một loại nhạc cụ cổ truyền, lại thích khoa trương thể diện, mỗi lần tấu nhạc đều phải tập hợp 300 người hòa tấu. Có ông Nam Quách tiên sinh chẳng biết tí gì về thổi khèn, nhưng lại luồn lách trà trộn vào dàn nhạc hoàng gia. Mỗi khi ban nhạc hòa tấu, ông ta phồng mồm trợn má lắc lư ra vẻ say sưa, thế mà qua mắt được mọi người, lĩnh bổng lộc triều đình hậu hĩnh."
      },
      {
        paraNum: 2,
        hanzi: "好景不长，齐宣王死后，其子齐湣王继位。这位新国王同样喜爱听吹竽，但他不喜欢大合奏，而是喜欢让乐师们一个一个轮流单独吹奏给他听。南郭先生听说了这个消息，吓得魂飞魄散，知道自己再也装不下去了，连夜收拾行囊仓皇逃跑了。这个成语告诫我们：立身处世必须具备真才实学，弄虚作假终究会露出马脚。",
        pinyin: "Hǎojǐng bù cháng, Qí Xuānwáng sǐ hòu, qí zǐ Qí Mǐnwáng jìwèi. Zhè wèi xīn guówáng tóngyàng xǐ'ài tīng chuī yú, dàn tā bù xǐhuan dà hézòu, ér shì xǐhuan ràng yuèshīmen yí ge yí ge lúnliú dāndú chuīzòu gěi tā tīng. Nánguō xiānsheng tīngshuō le zhè ge xiāoxi, xià de húnfēi-pòsàn, zhīdào zìjǐ zài yě zhuāng bu xiàqu le, liányè shōushi xíngnáng cānghuáng táopǎo le. Zhè ge chéngyǔ gàojiè wǒmen: lìshēn-chǔshì bìxū jùbèi zhēncái-shíxué, nòngxū-zuòjiǎ zhōngjiū huì lùchū mǎjiǎo.",
        vi: "Ngày vui ngắn chẳng tày gang, sau khi Tề Tuyên Vương băng hà, con trai là Tề Mẫn Vương nối ngôi. Vị vua mới này cũng mê nghe khèn Vu, nhưng không thích hòa tấu tập thể mà bắt các nhạc sư từng người một luân phiên độc tấu trước mặt ngài. Nam Quách tiên sinh nghe tin sợ hồn xiêu phách lạc, biết mình không thể giả đò được nữa, đành thu dọn hành lý trong đêm tháo chạy trối chết. Điển tích này răn dạy chúng ta: muốn đứng vững trong đời nhất định phải có tài năng thực chất, dối trá lừa bịp sớm muộn cũng lộ chân tướng."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "南郭先生最后为什么连夜仓皇逃跑？",
        qPinyin: "Nánguō xiānsheng zuìhòu wèishénme liányè cānghuáng táopǎo?",
        qVi: "Tại sao Nam Quách tiên sinh cuối cùng phải trốn chạy trong đêm?",
        aHanzi: "因为新国王要乐师一个一个单独吹奏，他怕假冒被揭穿。",
        aVi: "Bởi vì vua mới bắt từng người độc tấu riêng biệt, ông sợ màn kịch bị lật tẩy."
      }
    ]
  },

  // BÀI 58: 买椟还珠
  "jc_3_1_58": {
    titleHanzi: "买椟还珠的本末倒置",
    titlePinyin: "Mǎi dú huán zhū de běnmò-dàozhì",
    titleVi: "Mua hộp trả ngọc: sự đảo lộn gốc ngọn giá trị",
    summary: "Người không có mắt nhìn nhận giá trị cốt lõi, chỉ chú ý hình thức hào nhoáng bên ngoài mà vứt bỏ tinh hoa thực chất.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "楚国有一个商人得到了一颗光彩夺目的珍贵珍珠，他想把珍珠卖出一个好价钱。为了吸引顾客，他特意请工匠用名贵的木兰香木做了一个精致绝伦的木匣，用名贵香料熏香，又用翡翠、碧玉和精美丝绢把盒子装饰得璀璨夺目。",
        pinyin: "Chǔ Guó yǒu yí ge shāngrén dédào le yì kē guāngcǎi-duómù de zhēnguì zhēnzhū, tā xiǎng bǎ zhēnzhū mài chū yí ge hǎo jiàqián. Wèile xīyǐn gùkè, tā tèyì qǐng gōngjiàng yòng míngguì de mùlán xiāngmù zuò le yí ge jīngzhì juélún de mùxiá, yòng míngguì xiāngliào xūnxiāng, yòu yòng fěicuì, bìyù hé jīngměi sījùan bǎ hézi zhuāngshì de cuǐcàn-duómù.",
        vi: "Ở nước Sở có một thương nhân kiếm được viên ngọc trai quý giá sáng lấp lánh rực rỡ, muốn bán được giá cao. Để thu hút khách hàng, ông ta đặc biệt thuê thợ lành nghề lấy gỗ mộc lan tỏa hương quý giá đóng thành chiếc tráp tinh xảo tuyệt mỹ, xông hương liệu quý, lại khảm phỉ thúy, ngọc bích và tơ lụa lộng lẫy lên thân hộp."
      },
      {
        paraNum: 2,
        hanzi: "一个郑国人路过摊位，被华丽精美的木匣深深吸引住了。他毫不犹豫地付出了极高的价钱买下了盒子。然而令人哭笑不得的是，他打开盒子取出里面的珍珠还给了楚国商人，自己只兴高采烈地抱着那个空盒子走了。商人可谓善于卖盒子，而买者则是本末倒置。这个成语用来批评那些只注重外在表象、丢弃内在核心实质的浅薄见识。",
        pinyin: "Yí ge Zhèngguó rén lùguò tānwèi, bèi huálì jīngměi de mùxiá shēnshēn xīyǐn zhù le. Tā háobù-yóuyù de fùchū le jí gāo de jiàqián mǎixià le hézi. Rán'ér lìng rén kūxiào-bùdé de shì, tā dǎkāi hézi qǔchū lǐmiàn de zhēnzhū huán gěi le Chǔguó shāngrén, zìjǐ zhǐ xìnggāo-cǎiliè de bào zhe nà ge kōng hézi zǒu le. Shāngrén kěwèi shànyú mài hézi, ér mǎizhě zé shì běnmò-dàozhì. Zhè ge chéngyǔ yòng lái pīpíng nàxiē zhǐ zhùzhòng wàizài biǎoxiàng, diūqì nèizài héxīn shízhì de qiǎnbó jiànshì.",
        vi: "Một người nước Trịnh đi ngang qua sạp hàng, bị chiếc tráp gỗ hoa lệ tinh xảo hớp hồn. Không chút do dự, anh ta trả cái giá cực đắt mua đứt chiếc tráp. Thế nhưng điều dở khóc dở cười là anh ta mở tráp lấy viên ngọc trai bên trong trả lại cho lái buôn nước Sở, còn mình chỉ hớn hở ôm cái tráp rỗng đi về. Người bán thật khéo bán hộp, còn người mua đúng là đảo ngược gốc ngọn. Thành ngữ này phê phán những kẻ chỉ chăm chăm vào hình thức bên ngoài mà bỏ quên cốt lõi bản chất giá trị."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "买椟还珠中的郑国人犯了什么错误？",
        qPinyin: "Mǎi dú huán zhū zhōng de Zhèngguó rén fàn le shénme cuòwù?",
        qVi: "Người nước Trịnh trong điển tích 'Mua hộp trả ngọc' phạm phải sai lầm gì?",
        aHanzi: "只看重外表包装，丢掉了真正有价值的珍珠，本末倒置。",
        aVi: "Chỉ coi trọng vỏ bọc bên ngoài mà vứt bỏ viên ngọc trai thực sự có giá trị, đảo ngược gốc ngọn."
      }
    ]
  },

  // BÀI 59: 自相矛盾
  "jc_3_1_59": {
    titleHanzi: "言行相悖与逻辑法则",
    titlePinyin: "Yánxíng-xiāngbèi yǔ luóji fǎzé",
    titleVi: "Lời nói việc làm trái ngược nhau và quy luật logic",
    summary: "Câu chuyện người bán mâu và khiên đưa ra hai khẳng định triệt tiêu lẫn nhau, trở thành nguồn gốc khái niệm 'Mâu thuẫn'.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在古代集市上，有个楚国兵器商人正在兜售他的长矛与盾牌。他先是高举起坚固的盾牌向众人炫耀道：“我的盾牌是天下最坚固的，无论多么锋利的兵器都休想刺穿它！” 围观的人纷纷交口称赞。",
        pinyin: "Zài gǔdài jíshì shang, yǒu ge Chǔ Guó bīngqì shāngrén zhèngzài dōushòu tā de chángmáo yǔ dùnpái. Tā xiān shì gāojǔ qǐ jiāngù de dùnpái xiàng zhòngrén xuànyào dào: “Wǒ de dùnpái shì tiānxià zuì jiāngù de, wúlùn duōme fēnglì de bīngqì dōu xiūxiǎng cìchuān tā!” Wéiguān de rén fēnfēn jiāokǒu-chēngzàn.",
        vi: "Trên khu chợ cổ xưa nọ, có một thương nhân nước Sở đang rao bán giáo dài và khiên chắn. Ban đầu anh ta giơ cao chiếc khiên chắc nịch khoe khoang với mọi người: 'Chiếc khiên của ta là cứng chắc nhất thiên hạ, bất kể vũ khí sắc bén đến đâu cũng đừng hòng đâm thủng được nó!' Người xem xung quanh thi nhau tán thưởng."
      },
      {
        paraNum: 2,
        hanzi: "过了一会儿，他又举起闪闪发光的锋利长矛大声叫卖：“我的长矛是天下最锐利的，世间任何坚硬的盾牌都能一刺即透！” 这时，人群中一位智者微笑着走出来问道：“如果用你最锐利的长矛，来刺你最坚固的盾牌，结果会怎么样呢？” 那个楚国商人顿时面红耳赤，哑口无言。说话做事前后抵触、不能自圆其说，就叫做“自相矛盾”。",
        pinyin: "Guò le yíhuìr, tā yòu jǔ qǐ shǎnshǎn fāguāng de fēnglì chángmáo dà shēng jiàomài: “Wǒ de chángmáo shì tiānxià zuì ruìlì de, shìjiān rènhé jiānyìng de dùnpái dōu néng yí cì jí tòu!” Zhè shí, rénqún zhōng yí wèi zhìzhě wēixiào zhe zǒu chūlái wèn dào: “Rúguǒ yòng nǐ zuì ruìlì de chángmáo, lái cì nǐ zuì jiāngù de dùnpái, jiéguǒ huì zěnmeyàng ne?” Nà ge Chǔguó shāngrén dùnshí miànhóng-ěrcì, yǎkǒu-wúyán. Shuōhuà zuòshì qiánhòu dǐchù, bù néng zìyuán-qíshuō, jiù jiào zuò “zìxiāng-máodùn”.",
        vi: "Một lát sau, anh ta lại giơ ngọn giáo sắc nhọn sáng loáng rao lớn: 'Ngọn giáo của ta là sắc bén nhất thiên hạ, trên đời này bất kỳ chiếc khiên cứng nào cũng đều bị đâm thủng ngay tức khắc!' Lúc này trong đám đông có một bậc trí giả mỉm cười bước ra hỏi: 'Thế nếu lấy ngọn giáo sắc nhất của anh đâm vào chiếc khiên cứng nhất của anh thì kết quả sẽ thế nào?' Gã lái buôn đỏ bừng mặt tía tai, câm như hến không nói nên lời. Lời nói việc làm trước sau đụng độ, không thể tự giải thích nổi chính là ý nghĩa của 'Tự mình mâu thuẫn'."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "为什么楚国商人面对智者的提问哑口无言？",
        qPinyin: "Wèishénme Chǔguó shāngrén miànduì zhìzhě de tíwèn yǎkǒu-wúyán?",
        qVi: "Tại sao gã lái buôn nước Sở đứng trước câu hỏi của vị trí giả lại cứng họng?",
        aHanzi: "因为无论哪种情况发生，都会否定自己的前一句话，前后抵触。",
        aVi: "Bởi vì dù trường hợp nào xảy ra cũng sẽ tự phủ định lời khẳng định trước đó của mình, mâu thuẫn đối kháng."
      }
    ]
  },

  // BÀI 60: 拔苗助长
  "jc_3_1_60": {
    titleHanzi: "违背规律的沉痛代价",
    titlePinyin: "Wéibèi guīlǜ de chéntòng dàijià",
    titleVi: "Cái giá đắt cho việc làm trái quy luật tự nhiên",
    summary: "Dục tốc bất đạt: nôn nóng muốn thành công nhanh mà làm trái quy luật phát triển khách quan chỉ chuốc lấy thất bại hoàn toàn.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "宋国有个急性子的农夫，天天盼着自己田里的禾苗长高。他每天都要跑到田边看好几回，可禾苗长得很慢，农夫心里焦急万分，在田埂上急得团团转。",
        pinyin: "Sòng Guó yǒu ge jíxìngzi de nóngfū, tiāntiān pàn zhe zìjǐ tián lǐ de hémiáo zhǎng gāo. Tā měitiān dōu yào pǎo dào tiánbiān kàn hǎo jǐ huí, kě hémiáo zhǎng de hěn màn, nóngfū xīnlǐ jiāojí-wànfēn, zài tiángěng shang jí de tuántuán-zhuàn.",
        vi: "Nước Tống có một nông dân tính tình nóng vội, ngày nào cũng mong mạ non trên đồng nhà mình mau lớn. Mỗi ngày anh ta đều chạy ra bờ ruộng ngắm nghía mấy bận, nhưng cây mạ lớn rất chậm chạp, người nông dân trong lòng sốt ruột không yên, loay hoay cuống cuồng trên bờ ruộng."
      },
      {
        paraNum: 2,
        hanzi: "终于，他想出了一个“妙计”：他卷起裤腿下地，把地里的每一棵禾苗都拔高了一截。从清晨一直拔到日落西山，他累得筋疲力尽，回到家里兴奋地对儿子喊道：“今天可把我累坏了，不过我帮全田的禾苗一下子长高了一大截！” 儿子大惊失色，急忙跑到田里一看，所有的禾苗根部脱离了土壤，全都枯萎死掉了。这个故事告诫人们：万物生长自有规律，急于求成只会欲速不达、适得其反。",
        pinyin: "Zhōngyú, tā xiǎng chū le yí ge “miàojì”: tā juǎn qǐ kùtuǐ xiàdì, bǎ dì lǐ de měi yì kē hémiáo dōu bá gāo le yì jié. Cóng qīngchén yìzhí bá dào rìluò-xīshān, tā lèi de jīnpí-lìjìn, huí dào jiālǐ xīngfèn de duì érzi hǎn dào: “Jīntiān kě bǎ wǒ lèi huài le, búguò wǒ bāng quántián de hémiáo yíxiàzi zhǎng gāo le yí dà jié!” Érzi dàjīng-shìsè, jímáng pǎo dào tián lǐ yí kàn, suǒyǒu de hémiáo gēnbù tuōlí le tǔrǎng, quándōu kūwěi sǐ diào le. Zhè ge gùshì gàojiè rénmen: wànwù shēngzhǎng zì yǒu guīlǜ, jíyú-qiúchéng zhǐ huì yùsù-bùdá, shìdéqífǎn.",
        vi: "Rốt cuộc anh ta cũng nghĩ ra một 'diệu kế': xắn quần lội xuống ruộng, đem từng nhánh mạ non nhổ cao lên một đoạn. Từ sáng sớm nhổ miệt mài đến khi mặt trời lặn sau núi, mệt lả đứt hơi, về đến nhà hớn hở gọi con trai: 'Hôm nay mệt bở hơi tai, nhưng ta đã giúp toàn bộ mạ non một bước cao vổng lên một đoạn rồi!' Cậu con trai rụng rời chân tay vội chạy ra đồng xem, rễ của toàn bộ cây mạ đã đứt rời khỏi đất, tất cả đều héo rũ chết khô. Câu chuyện răn dạy con người: vạn vật phát triển đều có quy luật riêng, nôn nóng thành công chỉ có dục tốc bất đạt, phản tác dụng."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "宋国农夫把禾苗拔高后结果怎么样？",
        qPinyin: "Sòng Guó nóngfū bǎ hémiáo bá gāo hòu jiéguǒ zěnmeyàng?",
        qVi: "Sau khi người nông dân nước Tống kéo mạ cao lên kết quả ra sao?",
        aHanzi: "禾苗根部脱离土壤，全都枯萎死掉了。",
        aVi: "Rễ mạ non bị lìa khỏi đất nên tất cả đều khô héo chết rụi."
      }
    ]
  },

  // BÀI 61: 井底之蛙
  "jc_3_1_61": {
    titleHanzi: "井底之蛙的眼界之困",
    titlePinyin: "Jǐng dǐ zhī wā de yǎnjiè zhī kùn",
    titleVi: "Ếch ngồi đáy giếng và sự giam hãm của tầm nhìn",
    summary: "Người sống trong thế giới hạn hẹp mà tự mãn, không biết rằng biển khơi ngoài kia bao la vô tận thế nào.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在一口废弃的浅井里生活着一只青蛙。它每天在井里游泳嬉戏，累了就停在井壁的石缝里睡觉。青蛙骄傲地认为自己是这方天地最快乐的君王，抬头望天，天空不过只有井口那么大。",
        pinyin: "Zài yì kǒu fèiqì de qiǎnjǐng lǐ shēnghuó zhe yì zhī qīngwā. Tā měitiān zài jǐng lǐ yóuyǒng xīxì, lèi le jiù tíng zài jǐngbì de shífèng lǐ shuìjiào. Qīngwā jiāo'ào de rènwéi zìjǐ shì zhè fāng tiāndì zuì kuàilè de jūnwáng, táitóu wàng tiān, tiānkōng búguò zhǐyǒu jǐngkǒu nàme dà.",
        vi: "Trong một cái giếng cạn bỏ hoang có con ếch sinh sống. Hằng ngày nó bơi lội đùa giỡn trong lòng giếng, mệt thì nép vào khe đá thành giếng ngủ ngon lành. Ếch kiêu hãnh tự cho mình là bậc quân vương hạnh phúc nhất cõi đời, ngẩng đầu ngắm trời, bầu trời cũng chỉ vỏn vẹn to bằng miệng giếng."
      },
      {
        paraNum: 2,
        hanzi: "有一天，一只来自东海的大海龟来到井沿歇息。青蛙热情地向大海龟炫耀井中的舒适生活，并邀请海龟下来同住。海龟刚想迈脚，左脚还没完全伸进去，右膝就已经卡住了。海龟后退了几步，向青蛙描绘道：“你见过大海吗？大海千里之广不能形容其阔，万仞之高不能形容其深。大旱不减其水，暴雨不增其涨，那才是真正的大快乐。” 井底的青蛙听得瞠目结舌，这才明白自己的浅陋与狭隘。成语用以形容目光短浅、盲目自大之人。",
        pinyin: "Yǒu yì tiān, yì zhī láizì Dōnghǎi de dà hǎiguī lái dào jǐngyán xiēxi. Qīngwā rèqíng de xiàng dà hǎiguī xuànyào jǐng zhōng de shūshì shēnghuó, bìng yāoqǐng hǎiguī xiàlái tóng zhù. Hǎiguī gāng xiǎng mài jiǎo, zuǒ jiǎo hái méi wánquán shēn jìnqu, yòu xī jiù yǐjīng kǎ zhù le. Hǎiguī hòutuì le jǐ bù, xiàng qīngwā miáohuì dào: “Nǐ jiàn guo dàhǎi ma? Dàhǎi qiānlǐ zhī guǎng bù néng xíngróng qí kuò, wànrèn zhī gāo bù néng xíngróng qí shēn. Dàhàn bù jiǎn qí shuǐ, bàoyǔ bù zēng qí zhǎng, nà cái shì zhēnzhèng de dà kuàilè.” Jǐng dǐ de qīngwā tīng de chēngmù-jiéshé, zhè cái míngbai zìjǐ de qiǎnlòu yǔ xiá'ài. Chéngyǔ yòng yǐ xíngróng mùguāng-duǎnqiǎn, mángmù-zìdà zhī rén.",
        vi: "Một hôm, chú rùa biển lớn từ Biển Đông bò tới bờ giếng nghỉ chân. Ếch nhiệt tình khoe khoang cuộc sống sung sướng trong giếng và mời rùa xuống ở cùng. Rùa biển vừa định bước xuống, chân trái chưa lọt qua thì đầu gối phải đã kẹt cứng. Rùa lùi lại mấy bước, miêu tả cho ếch nghe: 'Bạn đã từng thấy biển lớn chưa? Biển khơi nghìn dặm không lột tả hết chiều rộng, vạn trượng chẳng đo xuể độ sâu. Đại hạn nước không cạn bớt, mưa bão nước chẳng dâng đầy, đó mới thực sự là niềm vui khoáng đạt.' Con ếch dưới đáy giếng nghe xong trố mắt líu lưỡi, lúc này mới bàng hoàng nhận ra sự nông cạn và thiển cận của mình. Thành ngữ ví với những kẻ tầm nhìn hạn hẹp, tự cao tự đại mù quáng."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "大海龟是怎样向青蛙描绘东海的辽阔与壮丽的？",
        qPinyin: "Dà hǎiguī shì zěnyàng xiàng qīngwā miáohuì Dōnghǎi de liáokuò yǔ zhuànglì de?",
        qVi: "Rùa biển lớn đã miêu tả sự bao la hùng vĩ của Biển Đông cho ếch nghe thế nào?",
        aHanzi: "千里不能穷其大，万仞不能穷其深，旱涝不影响水势。",
        aVi: "Nghìn dặm không cùng độ rộng, vạn trượng khôn xiết độ sâu, hạn hay lụt đều chẳng hề biến đổi mực nước."
      }
    ]
  },

  // BÀI 62: 孟母三迁
  "jc_3_1_62": {
    titleHanzi: "孟母三迁与环境育人",
    titlePinyin: "Mèng mǔ sān qiān yǔ huánjìng yù rén",
    titleVi: "Mẹ Mạnh Tử ba lần dời nhà và sức mạnh giáo dục của môi trường",
    summary: "Gương sáng của người mẹ vĩ đại trong lịch sử Trung Hoa: sẵn sàng dời chỗ ở vì môi trường nuôi dạy nhân cách đạo đức con trẻ.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "战国时期的儒家亚圣孟子，幼年丧父，由母亲仉氏一手抚育成人。起初，孟家住在一处荒郊墓地附近。幼小的孟子整天和邻居小孩玩耍，模仿出殡送葬、哭丧跪拜的游戏。孟母见状深感忧虑：“这里绝不是抚育孩子健康成长的好地方。” 于是毅然决定搬家。",
        pinyin: "Zhànguó shíqī de Rújiā Yàshèng Mèngzǐ, yòunián sàng fù, yóu mǔqīn Zhǎng shì yìshǒu fǔyù chéngrén. Qǐchū, Mèng jiā zhù zài yí chù huāngjiāo mùdì fùjìn. Yòuxiǎo de Mèngzǐ zhěngtiān hé línjū xiǎohái wánshuǎ, mófǎng chūbìn sòngzàng, kūsāng guìbài de yóuxì. Mèng mǔ jiànzhuàng shēangǎn yōulǜ: “Zhèlǐ jué bú shì fǔyù háizi jiànkāng chéngzhǎng de hǎo dìfang.” Yúshì yìrán juédìng bānjiā.",
        vi: "Á Thánh Nho gia Mạnh Tử thời Chiến Quốc mồ côi cha từ nhỏ, do một tay mẹ là Chương thị nuôi dưỡng khôn lớn. Ban đầu, nhà họ Mạnh ở gần một bãi tha ma hoang vu. Mạnh Tử thơ dại suốt ngày cùng đám trẻ hàng xóm chơi trò mô phỏng đưa tang, than khóc quỳ lạy. Mẹ Mạnh Tử thấy vậy vô cùng âu lo: 'Chỗ này quyết không phải nơi tốt lành để nuôi dạy con trẻ nên người.' Bèn kiên quyết chuyển nhà."
      },
      {
        paraNum: 2,
        hanzi: "他们搬到了喧闹的集市旁边。不久，孟子又开始模仿小贩高声叫卖、讨价还价。孟母再次摇头：“这里也不是好环境。” 最后，孟母把家迁到了学宫学堂之旁。在那里，孟子耳濡目染，每天跟着读书人练习作揖礼节、诵读经典。孟母欣慰地说：“这才是孩子修身成才的理想之所！” 孟母三迁的典故千古流传，深刻揭示了良好人文环境对人才培养的深远影响。",
        pinyin: "Tāmen bān dào le xuānnào de jíshì pángbiān. Bùjiǔ, Mèngzǐ yòu kāishǐ mófǎng xiǎofàn gāo shēng jiàomài, tǎojià-huánjià. Mèng mǔ zàicì yáotóu: “Zhèlǐ yě bú shì hǎo huánjìng.” Zuìhòu, Mèng mǔ bǎ jiā qiān dào le xuégōng xuétáng zhī páng. Zài nàli, Mèngzǐ ěr-rù-mù-rǎn, měitiān gēn zhe dúshūrén liànxí zuòyī lǐjié, sòngdú jīngdiǎn. Mèng mǔ xīnwèi de shuō: “Zhè cái shì háizi xiūshēn-chéngcái de lǐxiǎng zhī suǒ!” Mèng mǔ sān qiān de diǎngù qiāngǔ-liúchuán, shēnkè jiēshì le liánghǎo rénwén huánjìng duì réncái péiyǎng de shēnyuǎn yǐngxiǎng.",
        vi: "Họ chuyển đến bên cạnh một khu chợ ồn ào. Chẳng bao lâu Mạnh Tử lại bắt chước con buôn rao hàng mặc cả. Người mẹ lại lắc đầu: 'Nơi này cũng chẳng phải môi trường tốt.' Cuối cùng, mẹ Mạnh Tử dời nhà đến bên cạnh trường học học cung. Ở đó, Mạnh Tử tai nghe mắt thấy, ngày ngày học theo người có học tập lễ nghi chắp tay vái chào, đọc tụng kinh thư điển tích. Mẹ Mạnh Tử mừng rỡ nói: 'Đây mới là chốn lý tưởng để con trẻ tu thân lập nghiệp!' Tích xưa 'Mẹ Mạnh Tử ba lần dời nhà' truyền tụng nghìn thu, đúc kết sâu sắc ảnh hưởng to lớn của môi trường nhân văn đến việc bồi dưỡng nhân tài."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "孟母最后把家搬到了什么地方？为什么？",
        qPinyin: "Mèng mǔ zuìhòu bǎ jiā bān dào le shénme dìfang? Wèishénme?",
        qVi: "Mẹ Mạnh Tử cuối cùng chuyển nhà đến đâu? Vì sao?",
        aHanzi: "搬到了学宫学堂旁，因为那里有良好的读书礼仪环境。",
        aVi: "Dời đến cạnh trường học học cung, bởi vì nơi đó có môi trường đọc sách và lễ nghi tốt đẹp."
      }
    ]
  },

  // BÀI 63: 闻鸡起舞
  "jc_3_1_63": {
    titleHanzi: "闻鸡起舞与报效家国",
    titlePinyin: "Wén jī qǐ wǔ yǔ bàoxiào jiāguó",
    titleVi: "Nghe gà gáy dậy múa kiếm và hoài bão phụng sự non sông",
    summary: "Tinh thần phấn đấu tự cường, rèn luyện chí khí và thể lực trong gian khó để cống hiến cho đất nước.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "晋代名将祖逖和好友刘琨年轻时怀抱远大抱负，情同手足。目睹国家内忧外患、生灵涂炭，两人立志匡扶社稷，收复失地。",
        pinyin: "Jìn dài míngjiàng Zǔ Tì hé hǎoyǒu Liú Kūn niánqīng shí huáibào yuǎndà bàofù, qíng tóng shǒuzú. Mùdǔ guójiā nèiyōu-wàihuàn, shēnglíng-tútàn, liǎng rén lìzhì kuāngfú shèjì, shōufù shīdì.",
        vi: "Thời nhà Tấn, danh tướng Tổ Địch cùng người bạn thân Lưu Côn từ thuở thiếu thời đã ấp ủ hoài bão lớn lao, tình nghĩa như anh em ruột thịt. Tận mắt chứng kiến non sông nội ưu ngoại hoạn, muôn dân lầm than, hai người lập chí phò tá xã tắc, thu phục non sông gấm vóc."
      },
      {
        paraNum: 2,
        hanzi: "半夜听到荒鸡报晓，祖逖一脚踹醒刘琨：“此乃催人奋发之声，非恶声也！” 两人披衣跃起，在寒风凛冽的庭院中挥剑起舞、苦练武艺，数年如一日从不间断。正是凭借着这种顽强不屈的勤勉，祖逖后来率军北伐屡建奇功。成语“闻鸡起舞”成为中华民族勤学苦练、报效国家的精神图腾。",
        pinyin: "Bànyè tīng dào huāngjī bàoxiǎo, Zǔ Tì yì jiǎo chuài xǐng Liú Kūn: “Cǐ nǎi cuī rén fènfā zhī shēng, fēi èshēng yě!” Liǎng rén pīyī yuèqǐ, zài hánfēng-lǐnliè de tíngyuàn zhōng huī jiàn qǐ wǔ, kǔliàn wǔyì, shù nián rú yírì cóng bù jiānduàn. Zhèng shì píngjiè zhe zhè zhǒng wánqiáng-bùqū de qínmiǎn, Zǔ Tì hòulái shuàijūn běifá lǚ jiàn qígōng. Chéngyǔ “wén jī qǐ wǔ” chéngwéi Zhōnghuá mínzú qínxué-kǔliàn, bàoxiào guójiā de jīngshén túténg.",
        vi: "Nửa đêm nghe tiếng gà trống gáy vang, Tổ Địch đạp Lưu Côn thức giấc: 'Đây là tiếng giục lòng người phấn đấu vươn lên, đâu phải điềm gở!' Hai người khoác áo bật dậy, giữa sân vườn gió lạnh thấu xương vung gươm múa võ, khổ luyện ngày đêm, bao năm như một chưa từng đứt đoạn. Nhờ tinh thần cần mẫn kiên cường bất khuất ấy, sau này Tổ Địch đã thống lĩnh đại quân bắc phạt lập nên những chiến công hiển hách. Điển cố 'Nghe gà gáy dậy múa kiếm' trở thành biểu tượng tinh thần chăm học khổ luyện phụng sự tổ quốc của dân tộc Trung Hoa."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "“闻鸡起舞”体现了祖逖和刘琨怎样的精神？",
        qPinyin: "“Wén jī qǐ wǔ” tǐxiàn le Zǔ Tì hé Liú Kūn zěnyàng de jīngshén?",
        qVi: "'Nghe gà gáy dậy múa kiếm' thể hiện tinh thần như thế nào của Tổ Địch và Lưu Côn?",
        aHanzi: "体现了勤学苦练、自强不息、立志报国的奋斗精神。",
        aVi: "Thể hiện tinh thần phấn đấu chăm học khổ luyện, tự cường bất khuất, lập chí đền nợ nước."
      }
    ]
  },

  // BÀI 64: 中国茶文化与茶道哲学
  "jc_3_2_64": {
    titleHanzi: "中国茶文化与茶道哲学",
    titlePinyin: "Zhōngguó chá wénhuà yǔ chádào zhéxué",
    titleVi: "Văn hóa trà và triết lý trà đạo Trung Hoa",
    summary: "Lịch sử trà từ Thần Nông, lục đại trà loại và nghệ thuật thưởng trà tĩnh tâm 'Hòa - Kính - Thanh - Tịch'.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "中国是茶的故乡，茶文化源远流长。早在神农时代，华夏先民就发现了茶的药用与解渴功效。经过数千年的演变，饮茶从日常解渴升华成了一种融合修养、哲学与艺术的审美活动。",
        pinyin: "Zhōngguó shì chá de gùxiāng, chá wénhuà yuányuǎn-liúcháng. Zǎo zài Shénnóng shídài, Huáxià xiānmín jiù fāxiàn le chá de yàoyòng yǔ jiěkě gōngxiào. Jīngguò shù qiān nián de yǎnbiàn, yǐnchá cóng rìcháng jiěkě shēnghuá chéng le yì zhǒng rónghé xiūyǎng, zhéxué yǔ yìshù de shěnměi huódòng.",
        vi: "Trung Quốc là quê hương của cây trà, văn hóa trà có bề dày lịch sử ngút ngàn. Ngay từ thời Thần Nông, tiền nhân Hoa Hạ đã phát hiện ra công dụng dược liệu và giải khát của lá trà. Trải qua hàng ngàn năm chuyển biến, uống trà từ việc giải khát thường nhật đã thăng hoa thành một sinh hoạt thẩm mỹ hòa quyện giữa tu dưỡng, triết học và nghệ thuật."
      },
      {
        paraNum: 2,
        hanzi: "中国名茶种类繁多，涵盖绿茶、红茶、乌龙茶、白茶、黄茶与黑茶六大类。茶道的核心精神在于“和、敬、清、寂”。在泡茶与品茗之间，人们观汤色、闻茶香、悟人生，在浮躁喧嚣的现代尘世中寻得内心的宁静与释然。",
        pinyin: "Zhōngguó míngchá zhǒnglèi fánduō, hángài lǜchá, hóngchá, wūlóngchá, báichá, huángchá yǔ hēichá liù dà lèi. Chádào de héxīn jīngshén zàiyú “hé, jìng, qīng, jì”. Zài pàochá yǔ pǐnmíng zhījiān, rénmen guān tāngsè, wén cháxiāng, wù rénshēng, zài fúzào xuāoxiāo de xiàndài chénshì zhōng xúndé nèixīn de níngjìng yǔ shìrán.",
        vi: "Trà danh tiếng của Trung Quốc muôn màu muôn vẻ, bao gồm 6 đại chủng loại: lục trà, hồng trà, ô long trà, bạch trà, hoàng trà và hắc trà. Tinh thần cốt lõi của Trà đạo nằm ở bốn chữ 'Hòa - Kính - Thanh - Tịch'. Giữa các công đoạn pha trà và nhấp chén trà, con người ngắm sắc nước, ngửi hương trà, ngẫm lẽ đời, giữa cõi trần thế náo nhiệt xô bồ tìm lại được sự thanh tịnh an nhiên nơi đáy lòng."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "中国茶道的核心精神是什么？",
        qPinyin: "Zhōngguó chádào de héxīn jīngshén shì shénme?",
        qVi: "Tinh thần cốt lõi của Trà đạo Trung Hoa là gì?",
        aHanzi: "核心精神是“和、敬、清、寂”。",
        aVi: "Tinh thần cốt lõi là 'Hòa, Kính, Thanh, Tịch'."
      }
    ]
  },

  // BÀI 65: 中国传统节日：春节与中秋
  "jc_3_2_65": {
    titleHanzi: "中国传统节日：春节与中秋",
    titlePinyin: "Zhōngguó chuántǒng jiérì: Chūnjié yǔ Zhōngqiū",
    titleVi: "Lễ hội truyền thống Trung Quốc: Tết Nguyên Đán và Tết Trung Thu",
    summary: "Phong tục đón Tết sum họp gia đình, dán câu đối đỏ, ăn bánh chưng, bánh trung thu và triết lý sum vầy đoàn viên.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "春节是中国最为隆重盛大的传统佳节，承载着阖家团圆与辞旧迎新的美好期盼。腊月里贴春联、包饺子、守岁除夕，大年初一走亲访友拜大年，洋溢着浓厚的人伦温情。",
        pinyin: "Chūnjié shì Zhōngguó zuìwéi lóngzhòng shèngdà de chuántǒng jiājié, chéngzài zhe héjiā-tuányuán yǔ cíjiù-yíngxīn de měihǎo qīpàn. Làyuè lǐ tiē chūnlián, bāo jiǎozi, shǒusuì chúxī, dà nián chūyī zǒu qīn fǎng yǒu bài dà nián, yángyì zhe nónghòu de rénlún wēnqíng.",
        vi: "Tết Nguyên Đán là ngày lễ truyền thống long trọng và lớn nhất của Trung Quốc, gửi gắm ước nguyện sum họp gia đình và tống cựu nghênh tân. Tháng Chạp dán câu đối đỏ, gói sủi cảo, đón giao thừa, mùng một Tết đi thăm hỏi chúc tết người thân bạn bè, tràn ngập tình người ấm áp sâu lắng."
      },
      {
        paraNum: 2,
        hanzi: "而农历八月十五的中秋节，则以一轮圆月寄托思乡念亲之情。亲人们围坐品尝象征团圆的月饼与鲜果，共赏明月，传唱“但愿人长久，千里共婵娟”的千古佳句。这些节日凝结着中华民族对和睦、团圆与幸福生活的执着向往。",
        pinyin: "Ér nónglì bā yuè shíwǔ de Zhōngqiū Jié, zé yǐ yì lún yuányuè jìtuō sīxiāng niàn qīn zhī qíng. Qīnrénmen wéizuò pǐncháng xiàngzhēng tuányuán de yuèbǐng yǔ xiānguǒ, gòng shǎng míngyuè, chuánchàng “Dànyuàn rén chángjiǔ, qiānlǐ gòng chánjuān” de qiāngǔ jiājù. Zhèxiē jiérì níngjié zhe Zhōnghuá mínzú duì hémù, tuányuán yǔ xìngfú shēnghuó de zhízhuó xiàngwǎng.",
        vi: "Còn Tết Trung Thu rằm tháng tám âm lịch lại lấy vầng trăng tròn gửi gắm nỗi nhớ quê nhớ người thân. Người nhà quây quần thưởng thức bánh trung thu và quả ngọt tượng trưng cho đoàn viên, cùng ngắm trăng sáng ngân vang câu thơ ngàn thu: 'Đãn nguyện nhân trường cửu, thiên lý cộng thiền quyên' (Nguyện cầu người mạnh khỏe dài lâu, ngàn dặm cùng ngắm bóng trăng trong). Các ngày lễ kết tinh khát vọng bền chặt của dân tộc Trung Hoa về cuộc sống hòa thuận, đoàn viên và hạnh phúc."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "中秋节的月饼和圆月象征着什么意义？",
        qPinyin: "Zhōngqiū Jié de yuèbǐng hé yuányuè xiàngzhēng zhe shénme yìyì?",
        qVi: "Bánh trung thu và vầng trăng tròn trong Tết Trung Thu tượng trưng cho ý nghĩa gì?",
        aHanzi: "象征着家庭阖家团圆与幸福美满。",
        aVi: "Tượng trưng cho sự sum họp toàn gia và hạnh phúc viên mãn."
      }
    ]
  },

  // BÀI 66: 中医养生与阴阳平衡
  "jc_3_2_66": {
    titleHanzi: "中医养生与阴阳平衡",
    titlePinyin: "Zhōngyī yǎngshēng yǔ yīnyáng pínghéng",
    titleVi: "Đông y dưỡng sinh và triết lý cân bằng âm dương",
    summary: "Học thuyết 'Thiên nhân tương ứng', tứ chẩn vọng văn vấn thiết, phòng bệnh hơn chữa bệnh của y học cổ truyền.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "中医药学是中国古代智慧的伟大宝库。中医以“天人合一”为哲学根基，认为人体是一个与大自然四季气象息息相关的有机整体，阴阳平衡乃维持生命的根本准则。",
        pinyin: "Zhōng-yīyàoxué shì Zhōngguó gǔdài zhìhuì de wěidà bǎokù. Zhōngyī yǐ “tiānrén-héyī” wéi zhéxué gēnjī, rènwéi réntǐ shì yí ge yǔ dàzìrán sìjì qìxiàng xīxī-xiāngguān de yǒujī zhěngtǐ, yīnyáng pínghéng nǎi wéichí shēngmìng de gēnběn zhǔnzé.",
        vi: "Đông y học là kho tàng vĩ đại của trí tuệ Trung Hoa cổ đại. Y học cổ truyền lấy 'Thiên nhân hợp nhất' làm nền tảng triết học, quan niệm cơ thể con người là một chỉnh thể hữu cơ gắn bó mật thiết với bốn mùa thời tiết của thiên nhiên, âm dương cân bằng là chuẩn tắc cốt lõi duy trì sự sống."
      },
      {
        paraNum: 2,
        hanzi: "不同于西医的“对症下药”，中医注重“辨证施治”与“治未病”。通过望、闻、问、切四诊合参，配合针灸、推拿与草药调理，激发人体自愈潜能。近年来，中医养生倡导的顺应天时、节制饮食与调养性情，正日益受到全球医学界的重视。",
        pinyin: "Bùtóng yú xīyī de “duìzhèng-xiàyào”, Zhōngyī zhùzhòng “biànzhèng-shīzhì” yǔ “zhì wèibìng”. Tōngguò wàng, wén, wèn, qiè sì zhěn hé cān, pèihé zhēnjiǔ, tuīná yǔ cǎoyào tiáolǐ, jīfā réntǐ zìyù qiánnéng. Jìnnián lái, Zhōngyī yǎngshēng chàngdǎo de shùnyìng tiānshí, jiézhì yǐnshí yǔ tiáoyǎng xìngqíng, zhèng rìyì shòudào quánqiú yīxuéjiè de zhòngshì.",
        vi: "Khác với y học phương Tây tập trung điều trị triệu chứng, Đông y chú trọng 'biện chứng luận trị' và 'trị bệnh khi chưa phát bệnh'. Thông qua bốn phép chẩn 'vọng, văn, vấn, thiết', kết hợp châm cứu, bấm huyệt xoa bóp và thảo dược điều lý nhằm khơi dậy tiềm năng tự chữa lành của cơ thể. Những năm gần đây, quan điểm dưỡng sinh thuận ứng bốn mùa, tiết chế ăn uống và điều dưỡng tâm tính của Đông y đang ngày càng được y học toàn cầu quan tâm đón nhận."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "中医诊断疾病的基本方法“四诊”包括什么？",
        qPinyin: "Zhōngyī zhěnduàn jíbìng de jīběn fāngfǎ “sì zhěn” bāokuò shénme?",
        qVi: "Bốn phép chẩn đoán cơ bản 'tứ chẩn' trong Đông y bao gồm những gì?",
        aHanzi: "包括：望诊、闻诊、问诊、切诊。",
        aVi: "Bao gồm: Vọng (nhìn), Văn (nghe/ngửi), Vấn (hỏi), Thiết (bắt mạch)."
      }
    ]
  },

  // BÀI 67: 中国的书法艺术与汉字之美
  "jc_3_2_67": {
    titleHanzi: "中国的书法艺术与汉字之美",
    titlePinyin: "Zhōngguó de shūfǎ yìshù yǔ Hànzì zhī měi",
    titleVi: "Nghệ thuật thư pháp Trung Hoa và vẻ đẹp mỹ học của chữ Hán",
    summary: "Văn phòng tứ bảo: bút, mực, giấy, nghiên và năm thể chữ thư pháp Triện, Lệ, Khải, Hành, Thảo.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "汉字是世界上唯一沿用数千年至今的表意文字系统。中国书法将实用书写升华为了表现生命节律与精神气韵的无言之诗、无行之舞。",
        pinyin: "Hànzì shì shìjiè shang wéiyī yányòng shù qiān nián zhìjīn de biǎoyì wénzì xìtǒng. Zhōngguó shūfǎ jiāng shíyòng shūxiě shēnghuá wéi le biǎoxiàn shēngmìng jiélǜ yǔ jīngshén qìyùn de wúyán zhī shī, wúxíng zhī wǔ.",
        vi: "Chữ Hán là hệ thống văn tự biểu ý duy nhất trên thế giới được duy trì sử dụng hàng ngàn năm qua đến tận ngày nay. Thư pháp Trung Hoa đã nâng tầm chữ viết thực dụng thành bài thơ không lời, điệu múa không hình biểu hiện nhịp điệu sinh mệnh và khí phách tinh thần."
      },
      {
        paraNum: 2,
        hanzi: "借助“文房四宝”——笔、墨、纸、砚，书法家在宣纸上挥洒自如。从庄重古朴的篆隶，到法度森严的楷书，再到流畅奔放的行书与狂草，笔墨的浓淡干湿与线条的起承转合，淋漓尽致地展现了中国人独特的审美追求与处世品格。",
        pinyin: "Jièzhù “wénfáng-sìbǎo” —— bǐ, mò, zhǐ, yàn, shūfǎjiā zài xuānzhǐ shang huīsǎ-zìrú. Cóng zhuāngzhòng gǔpǔ de zhuàn lì, dào fǎdù sēnyán de kǎishū, zài dào liúchàng bēnfàng de xíngshū yǔ kuángcǎo, bǐmò de nóng-dàn-gān-shī yǔ xiàntiáo de qǐ-chéng-zhuǎn-hé, línlí-jìnzhì de zhǎnxiàn le Zhōngguórén dútè de shěnměi zhuīqiú yǔ chǔshì pǐngé.",
        vi: "Nhờ vào 'Văn phòng tứ bảo' gồm bút, mực, giấy, nghiên, các nhà thư pháp vung bút tự tại trên mặt giấy tuyên. Từ thể Triện, Lệ trang trọng cổ kính, đến thể Khải khuôn phép chuẩn mực, rồi thể Hành, Cuồng Thảo phóng khoáng uyển chuyển, độ đậm nhạt khô ướt của mực và các đường nét biến hóa đã phô diễn trọn vẹn lý tưởng thẩm mỹ và phẩm cách ứng thế độc đáo của người Trung Hoa."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "中国书法的“文房四宝”是指哪四样工具？",
        qPinyin: "Zhōngguó shūfǎ de “wénfáng sìbǎo” shì zhǐ nǎ sì yàng gōngjù?",
        qVi: "'Văn phòng tứ bảo' trong thư pháp Trung Hoa chỉ 4 loại công cụ nào?",
        aHanzi: "是指：笔、墨、纸、砚。",
        aVi: "Chỉ: Bút lông, thỏi mực, giấy tuyên và nghiên mực."
      }
    ]
  },

  // BÀI 68: 人际关系中的“面子”与“人情”
  "jc_3_2_68": {
    titleHanzi: "人际交往中的“面子”与“人情”",
    titlePinyin: "Rénjì jiāowǎng zhōng de “miànzi” yǔ “rénqíng”",
    titleVi: "Thể diện và nhân tình trong giao tiếp ứng xử của người Trung Quốc",
    summary: "Quy tắc xã hội về 'thể diện' (giữ mặt mũi, lòng tự trọng) và 'nhân tình' (ân nghĩa, qua lại tương hỗ).",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在理解中国社会的人际互动中，“面子”与“人情”是两个至关重要的文化密码。“面子”不仅代表个人的尊严与声誉，更是社会成员互相尊重与认可的微妙平衡。",
        pinyin: "Zài lǐjiě Zhōngguó shèhuì de rénjì hùdòng zhōng, “miànzi” yǔ “rénqíng” shì liǎng ge zhìguān-zhòngyào de wénhuà mìmǎ. “Miànzi” bùjǐn dàibiǎo gèrén de zūnyán yǔ shēngyù, gèng shì shèhuì chéngyuán hùxiāng zūnzhòng yǔ rènkě de wēimiào pínghéng.",
        vi: "Trong việc tìm hiểu tương tác giao tiếp trong xã hội Trung Quốc, 'Thể diện' và 'Nhân tình' là hai mật mã văn hóa quan trọng hàng đầu. 'Thể diện' không chỉ đại diện cho lòng tự trọng và thanh danh của cá nhân mà còn là sự cân bằng vi tế của sự tôn trọng và thừa nhận lẫn nhau giữa các thành viên xã hội."
      },
      {
        paraNum: 2,
        hanzi: "中国人讲究“礼尚往来”、“给人留面子”。在交往中，尊重对方的面子体现了教养与礼节；而“人情”则强调在危难时给予帮助，讲求投桃报李的情感纽带。在现代商业与都市生活中，“面子”观念正在趋向务实，但其尊重与包容的核心人际关怀依然历久弥新。",
        pinyin: "Zhōngguórén jiǎngjiu “lǐshàng-wǎnglái”, “gěi rén liú miànzi”. Zài jiāowǎng zhōng, zūnzhòng duìfāng de miànzi tǐxiàn le jiàoyǎng yǔ lǐjié; ér “rénqíng” zé qiángdiào zài wéinàn shí jǐyǔ bāngzhù, jiǎngqiú tóutáo-bàolǐ de qínggǎn niǔdài. Zài xiàndài shāngyè yǔ dūshì shēnghuó zhōng, “miànzi” guānniàn zhèngzài qūxiàng wùshí, dàn qí zūnzhòng yǔ bāoróng de héxīn rénjì guānhuái yīrán lìjiǔ-míxīn.",
        vi: "Người Trung Quốc coi trọng 'Lễ thượng vãng lai' (Có qua có lại mới toại lòng nhau) và 'Giữ thể diện cho người khác'. Trong giao tiếp, giữ gìn thể diện của đối phương thể hiện sự gia giáo và lễ độ; còn 'Nhân tình' lại nhấn mạnh sự giúp đỡ lúc hoạn nạn khó khăn, coi trọng sợi dây tình cảm đền ơn đáp nghĩa. Trong nhịp sống kinh doanh và đô thị hiện đại, quan niệm 'Thể diện' đang dần thực tế hơn, nhưng tinh thần cốt lõi tôn trọng và bao dung con người vẫn luôn tỏa sáng."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "在与人打交道时，中国人为什么强调“给人留面子”？",
        qPinyin: "Zài yǔ rén dǎ jiāodào shí, Zhōngguórén wèishénme qiángdiào “gěi rén liú miànzi”?",
        qVi: "Khi giao tiếp, tại sao người Trung Quốc nhấn mạnh việc 'giữ thể diện cho người khác'?",
        aHanzi: "因为尊重对方的面子体现了个人的礼貌教养，有利于和谐相处。",
        aVi: "Bởi vì tôn trọng thể diện đối phương thể hiện sự giáo dục lịch sự của bản thân và giúp chung sống hòa thuận."
      }
    ]
  },

  // BÀI 69: 现代家庭观念的变迁
  "jc_3_2_69": {
    titleHanzi: "现代家庭观念的变迁",
    titlePinyin: "Xiàndài jiātíng guānniàn de biànqiān",
    titleVi: "Sự biến chuyển trong quan niệm gia đình thời hiện đại",
    summary: "Từ mô hình đại gia đình tam đại đồng đường truyền thống đến mô hình gia đình hạt nhân, bình đẳng giới và dưỡng lão.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "随着中国经济的高速发展与城市化进程的推进，中国人的家庭结构与价值观念发生了深刻的转变。传统的“四世同堂”大宗族模式，逐渐被小巧灵活的核心家庭所取代。",
        pinyin: "Suízhe Zhōngguó jīngjì de gāosù fāzhǎn yǔ chéngshìhuà jìnchéng de tuījìn, Zhōngguórén de jiātíng jiégòu yǔ jiàzhí guānniàn fāshēng le shēnkè de zhuǎnbiàn. Chuántǒng de “sì shì tóng táng” dà zōngzú móshì, zhújiàn bèi xiǎoqiǎo línghuó de héxīn jiātíng suǒ qǔdài.",
        vi: "Cùng với sự phát triển kinh tế nhanh chóng và tiến trình đô thị hóa tại Trung Quốc, cấu trúc gia đình và quan niệm giá trị của người dân đã có những chuyển biến sâu sắc. Mô hình đại gia đình gia tộc 'Tứ đại đồng đường' truyền thống dần được thay thế bằng mô hình gia đình hạt nhân nhỏ gọn và linh hoạt."
      },
      {
        paraNum: 2,
        hanzi: "在现代家庭中，性别平等观念深入人心，夫妻共同承担工作与育儿责任。与此同时，随着老龄化社会的到来，尊老敬老的传统孝道在现代科技助力下焕发出新活力：视频通话、社区智慧养老让亲情打破了空间的阻隔，亲睦温情依旧是每个中国人心灵最稳固的港湾。",
        pinyin: "Zài xiàndài jiātíng zhōng, xìngbié píngděng guānniàn shēnrù-rénxīn, fūqī gòngtóng chéngdān gōngzuò yǔ yù'ér zérèn. Yǔ cǐ tóngshí, suízhe lǎolínghuà shèhuì de dàolái, zūnlǎo-jìnglǎo de chuántǒng xiàodào zài xiàndài kējì zhùlì xià huànfā chū xīn huólì: shìpín tōnghuà, shèqū zhìhuì yǎnglǎo ràng qīnqíng dǎpò le kōngjiān de zǔgé, qīnmù wēnqíng yījiù shì měi ge Zhōngguórén xīnlíng zuì wěngù de gǎngwān.",
        vi: "Trong gia đình hiện đại, quan niệm bình đẳng giới đã đi sâu vào lòng người, vợ chồng cùng nhau gánh vác công việc và nghĩa vụ nuôi dạy con cái. Đồng thời khi bước vào xã hội già hóa, đạo hiếu kính dưỡng người cao tuổi truyền thống được công nghệ hiện đại tiếp sức bừng lên sức sống mới: gọi video, hệ thống dưỡng lão thông minh cộng đồng giúp tình thân xóa nhòa khoảng cách không gian, sự gắn kết hòa thuận vẫn luôn là bến đỗ bình yên vững chắc nhất trong tâm hồn mỗi người Trung Quốc."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "现代中国家庭结构相较于传统发生了怎样的改变？",
        qPinyin: "Xiàndài Zhōngguó jiātíng jiégòu xiāngjiào yú chuántǒng fāshēng le zěnyàng de gǎibiàn?",
        qVi: "Cấu trúc gia đình Trung Quốc hiện đại so với truyền thống đã diễn ra thay đổi gì?",
        aHanzi: "由传统的四世同堂大宗族转变为以核心家庭为主。",
        aVi: "Chuyển từ đại gia đình bốn thế hệ cùng sống chung sang mô hình gia đình hạt nhân là chủ yếu."
      }
    ]
  },

  // BÀI 70: 环境保护与绿色低碳发展
  "jc_3_2_70": {
    titleHanzi: "生态环境保护与绿色生活",
    titlePinyin: "Shēngtài huánjìng bǎohù yǔ lǜsè shēnghuó",
    titleVi: "Bảo vệ môi trường sinh thái và nếp sống xanh giảm phát thải",
    summary: "Khái niệm 'Non xanh nước biếc là núi vàng núi bạc', phát triển năng lượng tái tạo và lối sống xanh của người dân.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "“绿水青山就是金山银山”，这一生态文明理念如今已深深融入中国国家发展战略与普通民众的日常生活之中。中国正全力由高污染高耗能走向绿色高质量可持续发展。",
        pinyin: "“Lǜshuǐ qīngshān jiùshì jīnshān yínshān”, zhè yí shēngtài wénmíng lǐniàn rújīn yǐ shēnshēn róngrù Zhōngguó guójiā fāzhǎn zhànlüè yǔ pǔtōng mínzhòng de rìcháng shēnghuó zhī zhōng. Zhōngguó zhèng quánlì yóu gāo wūrǎn gāo hàonéng zǒuxiàng lǜsè gāo zhìliàng kěchíxù fāzhǎn.",
        vi: "'Non xanh nước biếc chính là núi vàng núi bạc', triết lý văn minh sinh thái này ngày nay đã hòa nhập sâu sắc vào chiến lược phát triển quốc gia và đời sống hằng ngày của người dân Trung Quốc. Đất nước đang nỗ lực chuyển đổi từ nền kinh tế phát thải cao sang quỹ đạo phát triển xanh chất lượng cao bền vững."
      },
      {
        paraNum: 2,
        hanzi: "在广大城市，太阳能、风能与新能源电动汽车随处可见；垃圾分类成为市民的自觉习惯；自带水杯、少用塑料袋、乘公共交通出行的“低碳达人”屡见不鲜。守护蓝天白云、绿水青山，不仅是对子孙后代的崇高承诺，也是对地球母亲的深情回馈。",
        pinyin: "Zài guǎngdà chéngshì, tàiyángnéng, fēngnéng yǔ xīnnéngyuán diàndòng qìchē suíchù-kějiàn; lājī fēnlèi chéngwéi shìmín de zìjué xíguàn; zìdài shuǐbēi, shǎo yòng sùliàodài, chéng gōnggòng jiāotōng chūxíng de “dītàn dárén” lǚjiàn-bùxiān. Shǒuhù lántiān-báiyún, lǜshuǐ-qīngshān, bùjǐn shì duì zǐsūn-hòudài de chónggāo chéngnuò, yě shì duì Dìqiú mǔqīn de shēnqíng huíkuì.",
        vi: "Tại các thành phố rộng lớn, năng lượng mặt trời, điện gió và ô tô điện năng lượng mới hiện diện khắp nơi; phân loại rác thải trở thành thói quen tự giác của người dân; những 'tín đồ sống xanh' tự mang cốc nước, hạn chế túi nilon, ưu tiên phương tiện công cộng xuất hiện ngày càng nhiều. Giữ gìn bầu trời xanh mây trắng, non nước biếc lành không chỉ là lời hứa cao cả với thế hệ con cháu mai sau mà còn là sự tri ân nghĩa tình đối với Mẹ Thiên Nhiên."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "文中所提到的“低碳生活”体现在市民日常的哪些行为中？",
        qPinyin: "Wén zhōng suǒ tídào de “dītàn shēnghuó” tǐxiàn zài shìmín rìcháng de nǎxiē xíngwéi zhōng?",
        qVi: "'Lối sống carbon thấp' được nhắc tới trong bài thể hiện qua những hành vi thường nhật nào của người dân?",
        aHanzi: "垃圾分类、开电动车、乘公交车、自带水杯等。",
        aVi: "Phân loại rác, đi xe điện, sử dụng phương tiện công cộng, tự mang cốc nước..."
      }
    ]
  },

  // BÀI 71: 现代科技与生活变革
  "jc_3_2_71": {
    titleHanzi: "现代科技驱动下的生活变革",
    titlePinyin: "Xiàndài kējì qūdòng xià de shēnghuó biàngé",
    titleVi: "Cuộc cách mạng đời sống dưới động lực công nghệ hiện đại",
    summary: "Thanh toán quét mã di động, mạng lưới giao hàng thần tốc, đường sắt cao tốc và ứng dụng trí tuệ nhân tạo AI.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "二十一世纪的中国，科技创新正以令人惊叹的速度重塑着人们的衣食住行。出门不带现金、仅凭一部智能手机即可畅行天下，已成为亿万中国民众习以为常的现实。",
        pinyin: "Èrshíyī shìjì de Zhōngguó, kējì chuàngxīn zhèng yǐ lìng rén jīngtàn de sùdù chóngsù zhe rénmen de yī-shí-zhù-xíng. Chūmén bú dài xiànjīn, jǐn píng yí bù zhìnéng shǒujī jíkě chàngxíng tiānxià, yǐ chéngwéi yìwàn Zhōngguó mínzhòng xíyǐwéicháng de xiànshí.",
        vi: "Trung Quốc thế kỷ 21, đổi mới sáng tạo công nghệ đang tái định hình lối sống thường nhật ăn mặc ở đi lại với tốc độ đáng kinh ngạc. Ra đường không cần mang tiền mặt, chỉ với một chiếc điện thoại thông minh là có thể chu du khắp chốn, đã trở thành thực tế quen thuộc của hàng trăm triệu người dân Trung Quốc."
      },
      {
        paraNum: 2,
        hanzi: "四通八达的高铁网络将千里之遥缩短至数小时之内；智能物流让“上午下单、下午送达”的奇迹在各大都市普及；而人工智能与远程办公教育的深度结合，更是赋予了人们更广阔的发展空间。科技不仅提升了效率，更让生活充满了无限美好的可能。",
        pinyin: "Sìtōng-bādá de gāotiě wǎngluò jiāng qiānlǐ zhī yáo suōduǎn zhì shù xiǎoshí zhī nèi; zhìnéng wùliú ràng “shàngwǔ xiàdān, xiàwǔ sòngdá” de qíjì zài gè dà dūshì pǔjí; ér réngōng zhìnéng yǔ yuǎnchéng bàngōng jiàoyù de shēndù jiéhé, gèng shì fùyǔ le rénmen gèng kuānguǎng de fāzhǎn kōngjiān. Kējì bùjǐn tíshēng le xiàolǜ, gèng ràng shēnghuó chōngmǎn le wúxiàn měihǎo de kěnéng.",
        vi: "Mạng lưới đường sắt cao tốc tỏa đi muôn phương rút ngắn khoảng cách ngàn dặm xuống chỉ còn vài giờ đồng hồ; hậu cần logistics thông minh biến kỳ tích 'đặt hàng buổi sáng, giao tận tay buổi chiều' thành hiện thực phổ biến; sự kết hợp sâu rộng giữa trí tuệ nhân tạo AI với làm việc và học tập từ xa mở ra không gian phát triển bao la cho con người. Khoa học công nghệ không chỉ gia tăng hiệu suất mà còn lấp đầy cuộc sống bằng muôn vàn tiềm năng tươi đẹp."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "现代科技怎样改变了中国人的出行与购物体验？",
        qPinyin: "Xiàndài kējì zěnyàng gǎibiàn le Zhōngguórén de chūxíng yǔ gòuwù tǐyàn?",
        qVi: "Khoa học công nghệ hiện đại đã thay đổi trải nghiệm đi lại và mua sắm của người Trung Quốc ra sao?",
        aHanzi: "高铁让出行更加迅捷，手机支付和智能物流让购物极其便利。",
        aVi: "Đường sắt cao tốc giúp đi lại thần tốc, thanh toán di động và logistics thông minh giúp mua sắm vô cùng tiện lợi."
      }
    ]
  },

  // BÀI 72: 传统美德与现代文明
  "jc_3_2_72": {
    titleHanzi: "传统美德与现代文明的交融",
    titlePinyin: "Chuántǒng měidé yǔ xiàndài wénmíng de jiāoróng",
    titleVi: "Sự giao thoa giữa đạo đức truyền thống và văn minh hiện đại",
    summary: "Ngũ thường 'Nhân - Nghĩa - Lễ - Trí - Tín' của Nho gia kết hợp cùng tinh thần pháp trị và ý thức công dân hiện đại.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "中华民族五千年的历史长河孕育了灿烂的道德文明。以“仁、义、礼、智、信”为核心的儒家伦理，构筑了中国人精神品格的崇高基石，讲求尊老爱幼、诚实守信与厚德载物。",
        pinyin: "Zhōnghuá mínzú wǔ qiān nián de lìshǐ chánghé yùnyù le cànlàn de dàodé wénmíng. Yǐ “rén, yì, lǐ, zhì, xìn” wéi héxīn de Rújiā lúnlǐ, gòuzhù le Zhōngguórén jīngshén pǐngé de chónggāo jīshí, jiǎngqiú zūnlǎo-àiyòu, chéngshí-shǒuxìn yǔ hòudé-zàiwù.",
        vi: "Dòng chảy lịch sử 5000 năm của dân tộc Trung Hoa đã ươm mầm nền văn minh đạo đức rực rỡ. Luân lý Nho gia lấy 'Nhân, Nghĩa, Lễ, Trí, Tín' làm trung tâm đã xây đắp nền móng cao đẹp cho phẩm chất tinh thần của con người, đề cao kính già yêu trẻ, thành thực thủ tín và bao dung độ lượng."
      },
      {
        paraNum: 2,
        hanzi: "在日新月异的现代社会，这些传统美德与民主法治、公平正义及志愿奉献精神完美融合。无偿献血的青年志愿者、扶危济困的爱心人士、遵守契约的现代企业家，都在用行动践行着文明的承诺。汲取传统精髓、融入时代脉搏，现代文明正绽放出更加温暖的人性光辉。",
        pinyin: "Zài rìxīn-yuèyì de xiàndài shèhuì, zhèxiē chuántǒng měidé yǔ mínzhǔ fǎzhì, gōngpíng zhèngyì jí zhìyuàn fèngxiàn jīngshén wánměi rónghé. Wúcháng xiànxuè de qīngnián zhìyuànzhě, fúwēi-jìkùn de àixīn rénshì, zūnshǒu qìyuē de xiàndài qǐyèjiā, dōu zài yòng xíngdòng jiànxíng zhe wénmíng de chéngnuò. Jīqǔ chuántǒng jīngsuǐ, róngrù shídài màibó, xiàndài wénmíng zhèng zhànfàng chū gèngjiā wēnnuǎn de rénxìng guānghuī.",
        vi: "Trong xã hội hiện đại đổi thay từng ngày, những mỹ đức truyền thống này kết hợp hoàn hảo cùng tinh thần pháp trị, công bằng chính nghĩa và cống hiến thiện nguyện. Những tình nguyện viên hiến máu nhân đạo, những nhà hảo tâm giúp người hoạn nạn, những doanh nhân thượng tôn hợp đồng đều đang dùng hành động cụ thể thực thi lời cam kết văn minh. Kế thừa tinh hoa quá khứ, hòa vào nhịp đập đương đại, nền văn minh hôm nay đang tỏa sáng ánh hào quang ấm áp của tình người."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "中国传统道德的核心“五常”是指哪五个字？",
        qPinyin: "Zhōngguó chuántǒng dàodé de héxīn “wǔcháng” shì zhǐ nǎ wǔ ge zì?",
        qVi: "Cốt lõi đạo đức truyền thống 'Ngũ thường' trong văn hóa Trung Hoa chỉ 5 chữ nào?",
        aHanzi: "是指：仁、义、礼、智、信。",
        aVi: "Chỉ: Nhân, Nghĩa, Lễ, Trí, Tín."
      }
    ]
  },

  // BÀI 73: 汉语成语在现代写作中的运用
  "jc_3_2_73": {
    titleHanzi: "成语之美与现代汉语修辞",
    titlePinyin: "Chéngyǔ zhī měi yǔ xiàndài Hànyǔ xiūcí",
    titleVi: "Vẻ đẹp thành ngữ và tu từ trong văn phong hiện đại",
    summary: "Thành ngữ 4 chữ: cấu trúc cô đọng, giàu hình ảnh, tăng tính biểu cảm và sức thuyết phục trong văn phong nghị luận.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "成语是汉语言文字当中的瑰宝，绝大多数由四个字组成。它们往往来源于神话传说、历史典故或古代名篇，言简意赅，寓意深刻，凝聚着千百年来的民族智慧。",
        pinyin: "Chéngyǔ shì Hàn-yǔyán wénzì dāngzhōng de guībǎo, juédàduōshù yóu sì ge zì zǔchéng. Tāmen wǎngwǎng láiyuán yú shénhuà chuánshuō, lìshǐ diǎngù huò gǔdài míngpiān, yánjiǎn-yìgāi, yùyì shēnkè, níngjù zhe qiān bǎi nián lái de mínzú zhìhuì.",
        vi: "Thành ngữ là báu vật vô giá trong kho tàng Hán ngữ, đại đa số cấu tạo gồm bốn chữ. Chúng thường bắt nguồn từ thần thoại truyền thuyết, điển cố lịch sử hay danh tác cổ đại, lời ít ý nhiều, ngụ ý sâu xa, đúc kết trí tuệ ngàn đời của dân tộc."
      },
      {
        paraNum: 2,
        hanzi: "在现代汉语写作与口语交流中，恰当运用成语能够起到画龙点睛、言近旨远的神奇效果。比如用“风雨同舟”表达齐心协力，用“沧海一粟”形容渺小谦逊。掌握并熟练运用成语，不仅能大幅提升语言表达的感染力与文学色彩，更是外国中文学习者跨越中级、迈向高级水准的坚实阶梯。",
        pinyin: "Zài xiàndài Hànyǔ xiězuò yǔ kǒuyǔ jiāoliú zhōng, qiàdàng yùnyòng chéngyǔ nénggòu qǐdào huàlóng-diǎnjīng, yánjìn-zhǐyuǎn de shénqí xiàoguǒ. Bǐrú yòng “fēngyǔ-tóngzhōu” biǎodá qíxīn-xiélì, yòng “cānghǎi-yísù” xíngróng miǎoxiǎo qiānxùn. Zhǎngwò bìng shúliàn yùnyòng chéngyǔ, bùjǐn néng dàfú tíshēng yǔyán biǎodá de gǎnrǎnlì yǔ wénxué sècǎi, gèng shì wàiguó Zhōngwén xuéxízhě kuàyuè zhōngjí, màixiàng gāojí shuǐpíng de jiānshí jiētī.",
        vi: "Trong văn phong nghị luận viết lách và giao tiếp hằng ngày, sử dụng thành ngữ thích đáng sẽ đem lại hiệu ứng thần kỳ 'vẽ rồng điểm mắt', lời mộc mạc mà ý tứ thâm sâu. Ví như dùng 'Phong vũ đồng chu' biểu thị chung lưng đấu cật, dùng 'Thương hải nhất túc' hình dung hạt cát giữa sa mạc khiêm nhường. Nắm vững và vận dụng nhuần nhuyễn thành ngữ chẳng những nâng tầm sức truyền cảm và chất văn chương mà còn là nấc thang vững chắc giúp người học tiếng Trung bứt phá lên trình độ cao cấp."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "在文章写作中恰当使用汉语成语有什么好处？",
        qPinyin: "Zài wénzhāng xiězuò zhōng qiàdàng shǐyòng Hànyǔ chéngyǔ yǒu shénme hǎochu?",
        qVi: "Trong văn phong viết lách, sử dụng thành ngữ thích đáng có lợi ích gì?",
        aHanzi: "能够言简意赅，起到画龙点睛、增强文学表现力的效果。",
        aVi: "Có thể diễn đạt cô đọng ý sâu, đạt hiệu quả vẽ rồng điểm mắt và nâng cao sức biểu đạt văn học."
      }
    ]
  },

  // BÀI 74: 中国古代建筑与天人合一智慧
  "jc_3_2_74": {
    titleHanzi: "中国古代建筑与天人合一",
    titlePinyin: "Zhōngguó gǔdài jiànzhù yǔ tiānrén-héyī",
    titleVi: "Kiến trúc cổ đại Trung Hoa và trí tuệ Thiên nhân hợp nhất",
    summary: "Cấu trúc rường cột gỗ mộng ngàm không cần đinh, mái cong đấu củng, Cố Cung và nghệ thuật hoa viên Tô Châu.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "中国古代建筑是世界建筑史上独树一帜的奇葩。它不以石料为主体，而是创造性地采用榫卯木结构，不费一钉一铁，仅凭构件的咬合与穿插即可经受千年风雨乃至剧烈地震的考验。",
        pinyin: "Zhōngguó gǔdài jiànzhù shì shìjiè jiànzhùshǐ shang dúshù-yìzhì de qípā. Tā bù yǐ shíliào wéi zhǔtǐ, ér shì chuàngzàoxìng de cǎiyòng sǔnmǎo mù jiégòu, bú fèi yì dīng yì tiě, jǐn píng gòujiàn de yǎohé yǔ chuānchā jíkě jīngshòu qiān nián fēngyǔ nǎizhì jùliè dìzhèn de kǎoyàn.",
        vi: "Kiến trúc cổ đại Trung Hoa là đóa hoa độc đáo riêng một ngọn cờ trong lịch sử kiến trúc nhân loại. Không dùng đá làm vật liệu chính, kiến trúc Trung Hoa sáng tạo sử dụng kết cấu mộng ngàm gỗ, không tốn một chiếc đinh hay mẩu sắt nào, chỉ nhờ sự đan cài khớp mộng chuẩn xác mà đứng vững thách thức ngàn năm sương gió và cả những trận động đất kinh hoàng."
      },
      {
        paraNum: 2,
        hanzi: "从紫禁城气势磅礴的中轴对称宫殿群，到苏州园林“移步换景、虽由人作宛自天开”的精妙山水布局，处处流淌着人与自然和谐共生的“天人合一”哲学思想。飞檐翘角凌空舒展如飞鸟展翅，雕梁画栋不仅是力学奇迹，更是华夏先人对宇宙生命的诗意赞歌。",
        pinyin: "Cóng Zǐjìnchéng qìshì-pángbó de zhōngzhóu duìchèn gōngdiànqún, dào Sūzhōu yuánlín “yíbù-huànjǐng, suī yóu rén zuò wǎn zì tiān kāi” de jīngmiào shānshuǐ bùjú, chùchù liútǎng zhe rén yǔ zìrán héxié-gòngshēng de “tiānrén-héyī” zhéxué sīxiǎng. Fēiyán-qiàojiǎo língkōng shūzhǎn rú fēiniǎo zhǎnchì, diāoliáng-huàdòng bùjǐn shì lìxué qíjì, gèng shì Huáxià xiānrén duì yǔzhòu shēngmìng de shīyì zàngē.",
        vi: "Từ quần thể cung điện đối xứng trục trung tâm nguy nga tráng lệ nơi Tử Cấm Thành, đến bố cục non nước hoa viên Tô Châu 'bước một bước chuyển một cảnh, tuy do bàn tay người tạo tác mà ngỡ tự nhiên sinh thành', khắp nơi đều thấm đượm triết lý 'Thiên nhân hợp nhất' hòa hợp cùng thiên nhiên. Mái cong đao bay vút lên không trung tựa cánh chim xòe rộng, rường cột chạm trổ hoa văn chẳng những là kỳ tích cơ học mà còn là khúc tráng ca thi vị của tiền nhân trước vũ trụ bao la."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "中国古代木结构建筑不用铁钉却千年不倒的奥秘是什么？",
        qPinyin: "Zhōngguó gǔdài mù jiégòu jiànzhù bú yòng tiědīng què qiān nián bù dǎo de àomì shì shénme?",
        qVi: "Bí mật giúp các công trình kiến trúc gỗ cổ đại không dùng đinh sắt mà ngàn năm không sập là gì?",
        aHanzi: "采用了精巧神奇的榫卯木构咬合技术。",
        aVi: "Nhờ áp dụng kỹ thuật kết cấu mộng ngàm gỗ đan khớp kỳ diệu tinh xảo."
      }
    ]
  },

  // BÀI 75: 跨文化交际中的误解与融通
  "jc_3_2_75": {
    titleHanzi: "跨文化交际中的误解与融通",
    titlePinyin: "Kuà wénhuà jiāojì zhōng de wùjiě yǔ róngtōng",
    titleVi: "Hiểu lầm và sự hòa hợp trong giao tiếp liên văn hóa",
    summary: "Những khác biệt văn hóa đông tây (nhận lời khen, tặng quà, xưng hô) và thái độ cởi mở, thấu hiểu để hòa nhập.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "在经济全球化与国际交往日益密切的今天，跨文化交际已成为每一个生活在多元文化背景下的人必须面对的课题。由于历史渊源、风俗习惯与思维方式的差异，初入异域的人难免会经历“文化休克”与误解。",
        pinyin: "Zài jīngjì quánqiúhuà yǔ guójì jiāowǎng rìyì mìqiè de jīntiān, kuà wénhuà jiāojì yǐ chéngwéi měi yí ge shēnghuó zài duōyuán wénhuà bèijǐng xià de rén bìxū miànduì de kètí. Yóuyú lìshǐ yuānyuán, fēngsú-xíguàn yǔ sīwéi fāngshì de chāyì, chūrù yìyù de rén nánmiǎn huì jīnglì “wénhuà xiūkè” yǔ wùjiě.",
        vi: "Trong thời đại toàn cầu hóa kinh tế và giao lưu quốc tế ngày càng gắn kết hiện nay, giao tiếp liên văn hóa đã trở thành bài học mà bất kỳ ai sống trong môi trường đa nguyên đều phải đối mặt. Do khác biệt về cội nguồn lịch sử, phong tục tập quán và phương thức tư duy, người mới đặt chân tới vùng đất lạ khó tránh khỏi những 'cú sốc văn hóa' và hiểu lầm ban đầu."
      },
      {
        paraNum: 2,
        hanzi: "比如，面对别人的夸奖赞美，西方人习惯欣然道谢，而中国人常出于谦逊回答“哪里哪里”；在接受礼物时，中国传统习惯推让一番后私下拆开以示矜持。这些文化差异并无优劣之分。只有秉持开放包容的心态，求同存异、设身处地地倾听理解，我们才能架起沟通心灵的友谊桥梁。",
        pinyin: "Bǐrú, miànduì biérén de kuājiǎng zànměi, xīfāngrén xíguàn xīnrán dàoxiè, ér Zhōngguórén cháng chūyú qiānxùn huídá “nǎli nǎli”; zài jiēshòu lǐwù shí, Zhōngguó chuántǒng xíguàn tuīràng yì fān hòu sīxià chāikāi yǐ shì jīnchí. Zhèxiē wénhuà chāyì bìng wú yōuliè zhī fēn. Zhǐyǒu bǐngchí kāifàng-bāoróng de xīntài, qiútóng-cúnyì, shèshēn-chǔdì de qīngtīng lǐjiě, wǒmen cái néng jià qǐ gōutōng xīnlíng de yǒuyì qiáoliáng.",
        vi: "Chẳng hạn, đứng trước lời tán dương khen ngợi, người phương Tây quen nở nụ cười cảm ơn, còn người Trung Quốc vì khiêm tốn thường nói 'Đâu có đâu có'; khi nhận quà tặng, phong tục Trung Hoa lại quen chối từ vài câu rồi sau đó mới mở riêng để tỏ sự ý nhị. Những dị biệt văn hóa này không hề có chuyện hơn kém tốt xấu. Chỉ khi giữ vững tâm thế cởi mở bao dung, tìm điểm chung gác lại bất đồng, đặt mình vào vị trí đối phương để lắng nghe thấu hiểu, chúng ta mới xây đắp nên nhịp cầu hữu nghị kết nối những tâm hồn."
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "如何才能有效消除跨文化交际中的隔阂与误解？",
        qPinyin: "Rúhé cái néng yǒuxiào xiāochú kuà wénhuà jiāojì zhōng de géhé yǔ wùjiě?",
        qVi: "Làm thế nào để xóa bỏ hiệu quả những khoảng cách và hiểu lầm trong giao tiếp liên văn hóa?",
        aHanzi: "秉持包容心态，求同存异，学会换位思考与倾听。",
        aVi: "Giữ tâm thế bao dung cởi mở, cầu đồng tồn dị, học cách đặt mình vào vị trí đối phương để lắng nghe."
      }
    ]
  },

  // BÀI 76: 展望未来：全球化语境下的中文传播
  "jc_3_2_76": {
    titleHanzi: "展望未来：全球化语境下的中文传播",
    titlePinyin: "Zhǎnwàng wèilái: Quánqiúhuà yǔjìng xià de Zhōngwén chuánbō",
    titleVi: "Hướng tới tương lai: Sự lan tỏa của tiếng Trung trong bối cảnh toàn cầu hóa",
    summary: "Tổng kết 6 tập giáo trình: tiếng Trung như cầu nối hữu nghị, nhịp đập kinh tế và đại sứ hòa bình kết nối thế giới.",
    paragraphs: [
      {
        paraNum: 1,
        hanzi: "语言是人类沟通思想的桥梁，也是认识一个国家文明底蕴的金钥匙。随着中国国际影响力的与日俱增，全球范围内掀起了一股持续升温的“中文热”。越来越多的外国青年开始学习汉语，探寻东方古国的现代风貌。",
        pinyin: "Yǔyán shì rénlèi gōutōng sīxiǎng de qiáoliáng, yě shì rènshi yí ge guójiā wénmíng dǐyùn de jīnyàoshi. Suízhe Zhōngguó guójì yǐngxiǎnglì de yǔrì-jùzēng, quánqiú fànwéi nèi xiānqǐ le yì gǔ chíxù shēngwēn de “Zhōngwén rè”. Yuè lái yuè duō de wàiguó qīngnián kāishǐ xuéxí Hànyǔ, tànxún dōngfāng gǔguó de xiàndài fēngmào.",
        vi: "Ngôn ngữ là nhịp cầu trao đổi tư tưởng của nhân loại, cũng là chìa khóa vàng khai mở chiều sâu văn minh của một quốc gia. Cùng với tầm ảnh hưởng quốc tế ngày một gia tăng của Trung Quốc, trên phạm vi toàn cầu đã dấy lên 'cơn sốt học tiếng Trung' không ngừng lan tỏa. Ngày càng có nhiều bạn trẻ quốc tế bắt đầu học tiếng Hán để khám phá diện mạo hiện đại của đất nước phương Đông cổ kính."
      },
      {
        paraNum: 2,
        hanzi: "学好中文，不仅为留学生们开拓了在国际贸易、科技合作和外交文化等领域的广阔职业前景，更让大家成为了文明交流互鉴的友好使者。从当初第一课的“你好”，到如今能够畅谈哲学与科技，大家用汗水丈量了知识的厚度。海内存知己，天涯若比邻。愿这门承载着数千年智慧的古老语言，在未来的岁月里继续架起和平、友谊与合作的绚丽彩虹！",
        pinyin: "Xuéhǎo Zhōngwén, bùjǐn wèi liúxuéshēngmen kāituò le zài guójì màoyì, kējì hézuò hé wàijiāo wénhuà děng lǐngyù de kuānguǎng zhíyè qiánjǐng, gèng ràng dàjiā chéngwéi le wénmíng jiāoliú hùjiàn de yǒuhǎo shǐzhě. Cóng dāngchū dì-yī kè de “Nǐ hǎo”, dào rújīn nénggòu chàngtán zhéxué yǔ kējì, dàjiā yòng hànshuǐ zhàngliáng le zhīshi de hòudù. Hǎi nèi cún zhījǐ, tiānyá ruò bǐlín. Yuàn zhè mén chéngzài zhe shù qiān nián zhìhuì de gǔlǎo yǔyán, zài wèilái de suìyuè lǐ jìxù jià qǐ hépíng, yǒuyì yǔ hézuò de xuànlì cǎihóng!",
        vi: "Học giỏi tiếng Trung không chỉ mở ra cho các bạn lưu học sinh tiền đồ sự nghiệp rộng mở trong các lĩnh vực thương mại quốc tế, hợp tác khoa học công nghệ và ngoại giao văn hóa, mà còn biến mỗi người thành sứ giả hữu nghị giao lưu học hỏi giữa các nền văn minh. Từ câu 'Xin chào' của bài học số 1 ban đầu đến ngày nay có thể tự tin luận bàn triết học và công nghệ, mọi người đã dùng mồ hôi công sức đo đạc chiều sâu của tri thức. Bốn bể có bạn tri kỷ, chân trời góc biển cũng như láng giềng kề bên. Nguyện chúc ngôn ngữ cổ xưa chuyên chở trí tuệ ngàn năm này sẽ tiếp tục bắc nên chiếc cầu vồng rực rỡ của hòa bình, tình hữu nghị và hợp tác trong tương lai mai sau!"
      }
    ],
    comprehensionCheck: [
      {
        qHanzi: "学习中文为全球青年带来了哪些机遇与使命？",
        qPinyin: "Xuéxí Zhōngwén wèi quánqiú qīngnián dàilái le nǎxiē jīyù yǔ shǐmìng?",
        qVi: "Học tiếng Trung đem lại những cơ hội và sứ mệnh nào cho giới trẻ toàn cầu?",
        aHanzi: "拓展了职业前景，并成为促进国际文明交流与友好的使者。",
        aVi: "Mở rộng cơ hội nghề nghiệp và trở thành sứ giả thúc đẩy giao lưu văn minh và tình hữu nghị quốc tế."
      }
    ]
  }
};

// Update data
let updatedCount = 0;
for (const lesson of jiaocheng.lessons) {
  if (vol3Narratives[lesson.id]) {
    lesson.narrative = vol3Narratives[lesson.id];
    updatedCount++;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(jiaocheng, null, 2), 'utf8');
console.log(`[Vol 3 Narratives] Updated ${updatedCount} lessons with authentic narrative reading texts.`);
