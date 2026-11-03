const { tokenizeParagraph, addWord } = require('./reading_tokenizer_helper');
const existingReadings = require('./data/readings.json');

// Helper to find existing by old id
function getExisting(id, newId, newLevel) {
  const item = existingReadings.find(r => r.id === id);
  if (!item) throw new Error("Missing existing: " + id);
  return {
    ...item,
    id: newId,
    level: newLevel || item.level
  };
}

// Supplemental words for part 2
const p2Lexicon = [
  { hanzi: "狡猾", pinyin: "jiǎohuá", vi: "ranh mãnh, xảo quyệt" },
  { hanzi: "老虎", pinyin: "lǎohǔ", vi: "con hổ, cọp" },
  { hanzi: "狐狸", pinyin: "húli", vi: "con cáo" },
  { hanzi: "野兽", pinyin: "yěshòu", vi: "thú hoang, muôn thú" },
  { hanzi: "借着", pinyin: "jièzhe", vi: "mượn, nhờ vào" },
  { hanzi: "威风", pinyin: "wēifēng", vi: "oai phong, oai thế" },
  { hanzi: "塞翁", pinyin: "Sài Wēng", vi: "Tái Ông (ông lão biên ải)" },
  { hanzi: "祸福", pinyin: "huòfú", vi: "họa và phúc" },
  { hanzi: "边塞", pinyin: "biānsài", vi: "biên cương, biên ải" },
  { hanzi: "骏马", pinyin: "jùnmǎ", vi: "ngựa hay, tuấn mã" },
  { hanzi: "折断", pinyin: "zhéduàn", vi: "gãy, bẻ gãy" },
  { hanzi: "宝剑", pinyin: "bǎojiàn", vi: "thanh bảo kiếm" },
  { hanzi: "刻下", pinyin: "kè xià", vi: "khắc xuống, vạch dấu" },
  { hanzi: "记号", pinyin: "jìhao", vi: "dấu vết, ký hiệu" },
  { hanzi: "井底", pinyin: "jǐngdǐ", vi: "đáy giếng" },
  { hanzi: "青蛙", pinyin: "qīngwā", vi: "con ếch" },
  { hanzi: "大海", pinyin: "dàhǎi", vi: "biển lớn, đại dương" },
  { hanzi: "海龟", pinyin: "hǎiguī", vi: "rùa biển" },
  { hanzi: "捂住", pinyin: "wǔzhù", vi: "bịt chặt, che kín" },
  { hanzi: "铃铛", pinyin: "língdang", vi: "chiếc chuông nhỏ" },
  { hanzi: "响声", pinyin: "xiǎngshēng", vi: "âm thanh, tiếng vang" },
  { hanzi: "留白", pinyin: "liúbái", vi: "khoảng trống, khoảng lặng" },
  { hanzi: "焦虑", pinyin: "jiāolǜ", vi: "lo âu, bồn chồn" },
  { hanzi: "留言簿", pinyin: "liúyánbù", vi: "cuốn sổ lưu niệm, sổ cảm tưởng" },
  { hanzi: "文房四宝", pinyin: "wénfáng sìbǎo", vi: "Văn phòng tứ bảo (bút, mực, giấy, nghiên)" },
  { hanzi: "毛笔", pinyin: "máobǐ", vi: "bút lông" },
  { hanzi: "宣纸", pinyin: "xuānzhǐ", vi: "giấy xuyến chỉ (dùng viết thư pháp)" },
  { hanzi: "墨汁", pinyin: "mòzhī", vi: "mực tàu" },
  { hanzi: "砚台", pinyin: "yàntái", vi: "nghiên mực" },
  { hanzi: "拉面", pinyin: "lāmiàn", vi: "mì kéo sợi" },
  { hanzi: "牛肉面", pinyin: "niúròumiàn", vi: "mì thịt bò" },
  { hanzi: "兰州", pinyin: "Lánzhōu", vi: "thành phố Lan Châu" },
  { hanzi: "端午节", pinyin: "Duānwǔ Jié", vi: "Tết Đoan Ngọ (mùng 5 tháng 5 âm lịch)" },
  { hanzi: "粽子", pinyin: "zòngzi", vi: "bánh ú, bánh chưng tro" },
  { hanzi: "龙舟", pinyin: "lóngzhōu", vi: "thuyền rồng" },
  { hanzi: "屈原", pinyin: "Qū Yuán", vi: "nhà thơ Khuất Nguyên" },
  { hanzi: "长期主义", pinyin: "chángqī zhǔyì", vi: "chủ nghĩa dài hạn (tầm nhìn kiên định bền bỉ)" },
  { hanzi: "复利", pinyin: "fùlì", vi: "lãi kép, tích lũy theo cấp số nhân" }
];
p2Lexicon.forEach(item => addWord(item.hanzi, item.pinyin, item.vi));

const newPart2StoriesRaw = [
  // 15. 狐假虎威
  {
    id: "reading_15",
    title: "狐假虎威",
    pinyin: "Hú Jiǎ Hǔ Wēi",
    hanviet: "Hồ Giả Hổ Uy (Cáo Mượn Oai Hùm)",
    level: "HSK 3",
    category: "culture",
    categoryName: "Ngụ Ngôn & Cổ Điển",
    source: "Chiến Quốc Sách (战国策)",
    summary: "Một câu chuyện ngụ ngôn kinh điển về con cáo xảo quyệt bị hổ dữ bắt, bèn lừa hổ đi sau mình thị sát rừng sâu để muôn thú khiếp sợ bỏ chạy, khiến hổ tưởng muôn thú sợ cáo.",
    vocab: [
      { hanzi: "狐狸", pinyin: "húli", vi: "con cáo" },
      { hanzi: "老虎", pinyin: "lǎohǔ", vi: "con hổ" },
      { hanzi: "狡猾", pinyin: "jiǎohuá", vi: "ranh mãnh, xảo quyệt" },
      { hanzi: "威风", pinyin: "wēifēng", vi: "oai phong, oai thế" },
      { hanzi: "野兽", pinyin: "yěshòu", vi: "muôn thú, dã thú" },
      { hanzi: "欺骗", pinyin: "qīpiàn", vi: "lừa dối, gạt gẫm" }
    ],
    paragraphsRaw: [
      {
        cn: "一只饥饿的老虎在森林里抓住了一只狐狸，准备把它吃掉。狡猾的狐狸眼珠一转，大声对老虎说：“你不敢吃我！天帝派我来做百兽的首领，你要是吃我，就是违抗天命！”",
        vi: "Một con hổ đói đang sục sạo trong rừng thì tóm được một con cáo, toan xé xác ăn thịt. Con cáo ranh mãnh liền đảo mắt một vòng rồi lớn tiếng bảo hổ: 'Ngươi không dám ăn thịt ta đâu! Thượng đế phái ta xuống làm chúa tể muôn loài, nếu ngươi ăn thịt ta tức là chống lại mệnh trời!'"
      },
      {
        cn: "老虎听了半信半疑。狐狸得意地说：“不信的话，你跟在我后面走一趟，看看动物们见了我怕不怕！” 老虎果然跟着狐狸走进森林深处。百兽看见狐狸身后跟着一只大老虎，吓得纷纷逃跑。老虎不知道大家怕的是自己，还真以为动物们都在害怕狐狸。",
        vi: "Hổ nghe vậy nửa tin nửa ngờ. Cáo liền đắc ý bảo: 'Nếu ngươi không tin, hãy đi sau lưng ta dạo một vòng xem muôn thú thấy ta có khiếp sợ hay không!' Hổ quả nhiên bám gót cáo đi sâu vào rừng thẳm. Muôn thú thấy đằng sau cáo có một con hổ lớn hung dữ thì sợ hãi nháo nhào bỏ chạy. Hổ đâu biết rằng muôn thú sợ hãi chính là bản thân mình, mà cứ đinh ninh tưởng thật muôn loài đều đang khiếp sợ cáo."
      }
    ],
    moral: "Phê phán những kẻ bất tài nhưng thích dựa dẫm mượn uy thế của người khác để thị uy, dọa nạt người xung quanh.",
    quiz: {
      question: "森林里的百兽纷纷逃跑的真正原因是什么？",
      options: [
        "A. 狐狸是天帝任命的森林首领",
        "B. 动物们害怕狐狸身后的凶猛老虎",
        "C. 森林里发生火灾了",
        "D. 狐狸的声音太难听"
      ],
      answer: 1,
      explanation: "Muôn thú bỏ chạy vì nhìn thấy con hổ to lớn đi ngay phía sau con cáo: '百兽看见狐狸身后跟着一只大老虎，吓得纷纷逃跑' -> B là đáp án chính xác."
    }
  },

  // 16. 塞翁失马，焉知非福
  {
    id: "reading_16",
    title: "塞翁失马，焉知非福",
    pinyin: "Sài Wēng Shī Mǎ, Yān Zhī Fēi Fú",
    hanviet: "Tái Ông Thất Mã, Yên Tri Phi Phúc (Tái Ông Mất Ngựa, Họa Phúc Khôn Lường)",
    level: "HSK 3",
    category: "culture",
    categoryName: "Ngụ Ngôn & Cổ Điển",
    source: "Hoài Nam Tử (淮南子)",
    summary: "Điển tích cổ triết học sâu sắc: chuyện mất ngựa rồi ngựa lại dẫn bầy tuấn mã về, con trai ngã gãy chân nhưng nhờ đó thoát chết khi chiến tranh nổ ra. Họa và phúc luôn chuyển hóa cho nhau.",
    vocab: [
      { hanzi: "边塞", pinyin: "biānsài", vi: "biên cương, biên ải" },
      { hanzi: "失马", pinyin: "shī mǎ", vi: "mất ngựa" },
      { hanzi: "安慰", pinyin: "ānwèi", vi: "an ủi, vỗ về" },
      { hanzi: "骏马", pinyin: "jùnmǎ", vi: "ngựa quý, tuấn mã" },
      { hanzi: "保全", pinyin: "bǎoquán", vi: "bảo toàn, giữ gìn" },
      { hanzi: "转机", pinyin: "zhuǎnjī", vi: "chuyển biến tích cực" }
    ],
    paragraphsRaw: [
      {
        cn: "古时候靠近边塞住着一位老人。有一天，老人的一匹好马无缘无故跑到了胡人地界，邻居们都来安慰他。老人却平静地说：“这怎么就知道不是一件好事呢？” 过了几个月，那匹马竟然带回来一群健壮的胡地骏马。",
        vi: "Thời xưa ở gần biên ải có một ông lão sinh sống. Một hôm, con ngựa tốt của ông không hiểu sao chạy lạc sang vùng biên giới người Hồ, xóm giềng đều đến an ủi ông. Ông lão lại bình thản bảo: 'Biết đâu chuyện này lại chẳng phải là điều hay?' Vài tháng sau, con ngựa ấy thế mà dẫn theo cả một đàn tuấn mã cường tráng phương bắc trở về."
      },
      {
        cn: "老人的儿子非常喜欢骑烈马，结果不小心从马背上摔下来，摔断了一条腿。邻居们又跑来叹息，老人依然淡然地说：“这也许是件福事呢。” 不久边境爆发战争，所有青年男子都被征兵参战，十有八九战死沙场。老人的儿子因为腿有残疾而留在后方，父子二人得以保全性命。",
        vi: "Con trai của ông lão rất thích cưỡi ngựa hăng, kết quả sơ ý ngã từ lưng ngựa xuống làm gãy một bên chân. Xóm giềng lại kéo đến thở dài tiếc thương, ông lão vẫn điềm tĩnh nói: 'Chuyện này khéo lại là một điều phúc đấy.' Không lâu sau biên giới bùng nổ chiến tranh, tất cả trai tráng đều bị bắt đi tòng quân, mười người thì tám chín người ngã xuống nơi sa trường. Con trai ông lão vì tật ở chân nên được ở lại hậu phương, hai cha con nhờ thế bảo toàn được mạng sống."
      }
    ],
    moral: "Trong họa có phúc, trong phúc có họa. Khi gặp chuyện nghịch cảnh chớ nên bi quan tuyệt vọng, khi đạt thuận lợi cũng chớ sinh tự mãn kiêu căng.",
    quiz: {
      question: "老人的儿子为什么能够避免被征兵战死沙场？",
      options: [
        "A. 因为他有钱买免兵役",
        "B. 因为他从骏马上摔下摔断了一条腿",
        "C. 因为他逃跑到胡人地界去了",
        "D. 因为战争很快结束了"
      ],
      answer: 1,
      explanation: "Nhờ bị gãy chân khi ngã ngựa mà con trai ông được miễn quân dịch: '老人的儿子因为腿有残疾而留在后方，父子二人得以保全性命' -> B là đáp án chính xác."
    }
  },

  // 21. 刻舟求剑
  {
    id: "reading_21",
    title: "刻舟求剑",
    pinyin: "Kè Zhōu Qiú Jiàn",
    hanviet: "Khắc Chu Cầu Kiếm (Khắc Thuyền Tìm Gươm)",
    level: "HSK 3 - 4",
    category: "culture",
    categoryName: "Ngụ Ngôn & Cổ Điển",
    source: "Lã Thị Xuân Thu (吕氏春秋)",
    summary: "Điển tích ngụ ngôn hài hước mà thâm thúy: một người làm rơi kiếm xuống sông lại vạch dấu lên mạn thuyền, chờ thuyền cập bến mới nhảy xuống mò. Phê phán tư duy máy móc, bảo thủ.",
    vocab: [
      { hanzi: "宝剑", pinyin: "bǎojiàn", vi: "thanh kiếm quý" },
      { hanzi: "船舷", pinyin: "chuánxián", vi: "mạn thuyền" },
      { hanzi: "记号", pinyin: "jìhao", vi: "ký hiệu, vết đánh dấu" },
      { hanzi: "愚蠢", pinyin: "yúchǔn", vi: "ngốc nghếch, ngu xuẩn" },
      { hanzi: "变化", pinyin: "biànhuà", vi: "biến đổi, thay đổi" },
      { hanzi: "静止", pinyin: "jìngzhǐ", vi: "bất động, đứng yên" }
    ],
    paragraphsRaw: [
      {
        cn: "战国时期，楚国有一个人乘船渡江。船行至江心时，他不小心把佩在身上的宝剑掉进了滚滚的江水里。同船的人都惊呼起来，催促他赶紧下水捞剑。",
        vi: "Thời Chiến Quốc, có một người nước Sở đi thuyền qua sông lớn. Khi thuyền ra đến giữa dòng, anh ta sơ ý làm rơi thanh kiếm quý đeo bên mình xuống làn nước sông cuồn cuộn. Mọi người trên thuyền đều thốt lên kinh hãi, giục anh ta mau nhảy xuống sông vớt kiếm."
      },
      {
        cn: "可那个人却不慌不忙，拔出一把小刀，在船舷上刻了一个明显的记号，并自信地说：“我的剑就是从这个位置掉下去的！” 船到了对岸停泊后，他才沿着记号跳入水中寻找，结果自然一无所获。船一直在前行，而江底的剑早已被甩在遥远的江心。",
        vi: "Nhưng người nọ lại chẳng hề vội vàng, rút con dao găm nhỏ ra khắc một dấu sâu lên mạn thuyền rồi tự tin tuyên bố: 'Kiếm của ta chính là rơi từ vị trí này xuống!' Sau khi thuyền cập bến bờ bên kia, anh ta mới lần theo vết khắc nhảy xuống sông mò mẫm, kết quả dĩ nhiên là công cốc. Thuyền thì mải miết trôi đi, còn thanh kiếm dưới đáy sông thì đã bị bỏ lại nơi giữa dòng xa tít tắp."
      }
    ],
    moral: "Sự vật và hoàn cảnh khách quan luôn luôn vận động và biến chuyển khôn lường. Không thể dùng tư duy cứng nhắc, rập khuôn để giải quyết những vấn đề mới nảy sinh.",
    quiz: {
      question: "楚国人刻舟求剑最终为什么找不到宝剑？",
      options: [
        "A. 水太深了他害怕淹死",
        "B. 宝剑被大鱼吞下去了",
        "C. 船已经移动到对岸，而宝剑还留在江心不会移动",
        "D. 他记错了船舷刻记号的位置"
      ],
      answer: 2,
      explanation: "Thuyền di chuyển theo dòng nước tới bờ đối diện, trong khi thanh kiếm nằm im dưới đáy sông giữa dòng: '船一直在前行，而江底的剑早已被甩在遥远的江心' -> C."
    }
  },

  // 22. 井底之蛙
  {
    id: "reading_22",
    title: "井底之蛙",
    pinyin: "Jǐng Dǐ Zhī Wā",
    hanviet: "Tỉnh Để Chi Oa (Ếch Ngồi Đáy Giếng)",
    level: "HSK 3 - 4",
    category: "culture",
    categoryName: "Ngụ Ngôn & Cổ Điển",
    source: "Trang Tử: Thu Thủy (庄子·秋水)",
    summary: "Con ếch sống dưới giếng sâu luôn tự đắc tưởng giếng cạn là vương quốc to lớn nhất và bầu trời chỉ tròn bằng cái vung, cho đến khi chú rùa biển kể về sự bao la bất tận của biển Đông.",
    vocab: [
      { hanzi: "水井", pinyin: "shuǐjǐng", vi: "giếng nước" },
      { hanzi: "青蛙", pinyin: "qīngwā", vi: "con ếch" },
      { hanzi: "广阔", pinyin: "guǎngkuò", vi: "bao la, rộng lớn" },
      { hanzi: "大海", pinyin: "dàhǎi", vi: "biển cả" },
      { hanzi: "眼界", pinyin: "yǎnjiè", vi: "tầm mắt, nhãn quan" },
      { hanzi: "自大", pinyin: "zìdà", vi: "tự cao tự đại" }
    ],
    paragraphsRaw: [
      {
        cn: "在一口废弃的浅井里住着一只青蛙。它每天在井壁的破洞里跳来跳去，高兴时游几圈，累了便在泥坑里休息。它觉得自己是这里最快乐的君王，抬头望去，以为天空只有井口那么大。",
        vi: "Trong một cái giếng cạn bỏ hoang có một con ếch sinh sống. Mỗi ngày nó nhảy qua nhảy lại trong những lỗ hổng trên thành giếng, khi vui thì bơi vài vòng, mệt lại nằm nghỉ trong hố bùn. Nó ngỡ mình là vị chúa tể sung sướng nhất nơi này, ngẩng đầu nhìn lên cứ đinh ninh bầu trời chỉ tròn rộng bằng miệng giếng."
      },
      {
        cn: "一天，东海里的一只大乌龟爬到了井边。青蛙得意地邀请乌龟进井里享乐。乌龟却告诉青蛙：“大海辽阔无际，千里之远无法形容它的广阔，八千尺之深无法丈量它的深度。大旱之年海水不减，大水之年海水不溢，那才是真正的浩瀚。” 井底之蛙听完目瞪口呆，终于明白了自身的渺小。",
        vi: "Một hôm, một con rùa lớn từ biển Đông bò đến bên miệng giếng. Ếch bèn đắc ý mời rùa xuống giếng hưởng lạc. Rùa biển bèn kể cho ếch hay: 'Biển cả bao la khôn cùng, ngàn dặm xa cũng chẳng thể hình dung được sự rộng lớn, tám ngàn thước sâu cũng khôn đo nổi đáy. Năm đại hạn nước biển không hề cạn bớt, năm lụt lội nước biển chẳng dâng tràn, đó mới chính là sự mênh mông đích thực.' Ếch nghe xong mắt tròn mắt dẹt, bấy giờ mới thấu hiểu sự nhỏ bé nông cạn của chính mình."
      }
    ],
    moral: "Kiến thức là biển rộng mênh mông. Luôn giữ tinh thần khiêm tốn học hỏi và mở rộng tầm nhìn, chớ để sự hạn hẹp của bản thân giam cầm tư duy.",
    quiz: {
      question: "大海的大乌龟对青蛙描述的海水具有什么特征？",
      options: [
        "A. 水质又苦又咸不能喝",
        "B. 大旱之年水不减，大水之年水不溢，极其浩瀚深广",
        "C. 里面有很多鲨鱼非常危险",
        "D. 还没有一口浅井舒服"
      ],
      answer: 1,
      explanation: "Rùa biển mô tả: '大旱之年海水不减，大水之年海水不溢，那才是真正的浩瀚' -> Đáp án B."
    }
  },

  // 23. 掩耳盗铃
  {
    id: "reading_23",
    title: "掩耳盗铃",
    pinyin: "Yǎn Ěr Dào Líng",
    hanviet: "Yểm Nhĩ Đạo Linh (Bịt Tai Trộm Chuông)",
    level: "HSK 3 - 4",
    category: "culture",
    categoryName: "Ngụ Ngôn & Cổ Điển",
    source: "Lã Thị Xuân Thu (吕氏春秋)",
    summary: "Chuyện người trộm chuông quý nhưng sợ chuông kêu vang bị bắt, bèn tự bịt chặt hai tai mình lại và nghĩ bụng hễ mình không nghe thấy thì thiên hạ cũng chẳng ai nghe thấy. Phê phán thói tự dối lừa bản thân.",
    vocab: [
      { hanzi: "盗贼", pinyin: "dàozéi", vi: "kẻ trộm, đạo tặc" },
      { hanzi: "铃铛", pinyin: "língdang", vi: "chiếc chuông đồng" },
      { hanzi: "砸碎", pinyin: "zásuì", vi: "đập nát, đập vỡ" },
      { hanzi: "掩住", pinyin: "yǎnzhu", vi: "bịt lại, che đậy" },
      { hanzi: "欺骗", pinyin: "qīpiàn", vi: "lừa dối, dối trá" },
      { hanzi: "荒唐", pinyin: "huāngtáng", vi: "hoang đường, lố bịch" }
    ],
    paragraphsRaw: [
      {
        cn: "古时候，有一个小偷在贵族家发现了一口制作精美的大铜钟。他想把铜钟偷走，可是钟又大又重，一个人根本背不动。小偷便找来一把大铁锤，打算先把铜钟砸碎成小块，再分批运回家。",
        vi: "Ngày xưa, có một tên trộm phát hiện thấy một chiếc chuông đồng lớn được đúc vô cùng tinh xảo trong nhà một nhà quý tộc. Hắn muốn trộm quả chuông đi, ngặt nỗi chuông vừa to vừa nặng, một mình vác không xuể. Tên trộm bèn kiếm một cây búa sắt lớn, dự tính đập vỡ quả chuông thành từng mảnh nhỏ rồi khiêng dần về nhà."
      },
      {
        cn: "铁锤刚砸到钟身上，就发出了“当——”的一声震耳欲聋的巨响。小偷害怕响声引来主人，慌忙用双手紧紧捂住自己的耳朵。周围顿时安静了，他高兴地想：“只要我听不见，别人肯定也听不见！” 于是他继续用力砸钟，钟声响彻四方，闻声赶来的卫兵当场将他捉拿归案。",
        vi: "Cây búa sắt vừa đập vào thân chuông thì đã phát ra một tiếng 'Boong—' chói tai vang dội. Tên trộm sợ tiếng chuông kinh động gia chủ, vội vàng lấy hai tay bịt chặt lấy hai tai của mình. Xung quanh bỗng chốc im bặt, hắn hí hửng nghĩ thầm: 'Chỉ cần ta không nghe thấy, ắt hẳn người khác cũng chẳng nghe thấy gì!' Thế là hắn lại tiếp tục ra sức đập chuông, tiếng chuông rền vang khắp bốn phương, lính tuần nghe tiếng ập tới bắt quả tang hắn tại trận."
      }
    ],
    moral: "Sự thật khách quan không hề biến mất chỉ vì ta nhắm mắt làm ngơ. Tự lừa dối chính mình chỉ dẫn đến những hậu quả tai hại và nực cười.",
    quiz: {
      question: "小偷捂住自己的耳朵后，心里是怎么想的？",
      options: [
        "A. 以为耳朵聋了要去看医生",
        "B. 以为只要自己听不见声音，别人也就听不见",
        "C. 以为锤子坏了砸不出声音",
        "D. 以为主人已经睡着了"
      ],
      answer: 1,
      explanation: "Tên trộm tự lừa dối mình: '只要我听不见，别人肯定也听不见' -> B là đáp án chính xác."
    }
  },

  // 24. 慢下来的力量：给生活留一点空白
  {
    id: "reading_24",
    title: "慢下来的力量：给生活留一点空白",
    pinyin: "Màn Xiàlai De Lìliang: Gěi Shēnghuó Liú Yìdiǎn Kòngbái",
    hanviet: "Mạn Hạ Lai Đích Lực Lượng: Kỷ Sinh Hoạt Lưu Nhất Điểm Không Bạch (Sức Mạnh Của Sự Chậm Lại: Cho Cuộc Sống Khoảng Lặng)",
    level: "HSK 3 - 4",
    category: "inspiration",
    categoryName: "Chuyện Chữa Lành & Trưởng Thành",
    source: "Tạp Chí Tâm Lý & Phong Cách Sống",
    summary: "Trong guồng quay chóng mặt của thời đại số, học cách sống chậm lại, ngắt kết nối màn hình điện tử và cho tâm hồn một khoảng lặng là liều thuốc quý giá nhất để tìm lại sự bình yên nội tâm.",
    vocab: [
      { hanzi: "快节奏", pinyin: "kuàijiézòu", vi: "nhịp độ nhanh, hối hả" },
      { hanzi: "焦虑", pinyin: "jiāolǜ", vi: "lo âu, căng thẳng" },
      { hanzi: "留白", pinyin: "liúbái", vi: "khoảng trống tĩnh lặng" },
      { hanzi: "呼吸", pinyin: "hūxī", vi: "hít thở" },
      { hanzi: "风景", pinyin: "fēngjǐng", vi: "phong cảnh" },
      { hanzi: "从容", pinyin: "cóngróng", vi: "ung dung, điềm tĩnh" }
    ],
    paragraphsRaw: [
      {
        cn: "在现代都市的快节奏里，我们像上了发条的钟表，每天都在赶时间：赶地铁、赶工期、赶回信息。我们总以为跑得越快就越充实，却不知不觉在慌乱中遗失了感知生活美好的能力，换来的是无休止的焦虑与疲倦。",
        vi: "Trong nhịp sống gấp gáp của chốn đô thị hiện đại, chúng ta tựa như những chiếc đồng hồ lên dây cót, mỗi ngày đều phải cuống cuồng chạy đua với thời gian: vội vã đón chuyến tàu điện ngầm, chạy đua với hạn nộp dự án, hấp tấp trả lời tin nhắn. Ta cứ ngỡ chạy càng nhanh thì càng sống trọn vẹn, nào hay trong sự hoảng hốt ấy ta đã vô tình đánh mất đi khả năng cảm nhận vẻ đẹp của cuộc sống, đổi lấy là sự âu lo và mệt mỏi triền miên."
      },
      {
        cn: "中国国画讲究“留白”，满纸涂墨反而失去韵味；人生亦是如此。试着每天关掉手机一小时，去公园散散步，或者静静泡一杯热茶，听听风吹树叶的清脆声响。慢下来并不是停止前进，而是为了让灵魂跟上脚步，以更加从容优雅的姿态重新出发。",
        vi: "Hội họa truyền thống Trung Hoa rất coi trọng thuật 'lưu bạch' (chừa lại khoảng trống), nếu tô kín mực khắp mặt giấy ngược lại sẽ làm mất đi thi vị; cuộc đời con người cũng y như vậy. Hãy thử mỗi ngày tắt điện thoại một tiếng đồng hồ, thong thả dạo bước trong công viên, hoặc tĩnh tại pha một ấm trà nóng, lắng nghe thanh âm trong trẻo của gió lay cành lá. Chậm lại không phải là ngừng bước, mà là để linh hồn bắt kịp nhịp chân ta, để rồi với tư thế ung dung thanh thoát nhất mà tiếp tục cuộc hành trình."
      }
    ],
    moral: "Khoảng lặng không phải là sự lãng phí, mà là không gian để trí tuệ sinh sôi và tái sinh năng lượng sống thuần khiết nhất.",
    quiz: {
      question: "文章把中国国画中的什么艺术技巧比喻成人生的节奏？",
      options: [
        "A. 浓墨重彩",
        "B. 留白",
        "C. 工笔勾勒",
        "D. 泼墨写意"
      ],
      answer: 1,
      explanation: "Trong bài viết: '中国国画讲究留白，满纸涂墨反而失去韵味；人生亦是如此' -> B là đáp án chính xác."
    }
  },

  // 25. 咖啡馆里的暖心留言簿
  {
    id: "reading_25",
    title: "咖啡馆里的暖心留言簿",
    pinyin: "Kāfēiguǎn Lǐ De Nuǎnxīn Liúyánbù",
    hanviet: "Cà Phê Quán Lý Đích Noãn Tâm Lưu Ngôn Bộ (Sổ Lưu Niệm Ấm Lòng Trong Quán Cà Phê)",
    level: "HSK 4",
    category: "inspiration",
    categoryName: "Chuyện Chữa Lành & Trưởng Thành",
    source: "Những Mẩu Chuyện Chữa Lành Đô Thị",
    summary: "Một cuốn sổ tay con góc quán cà phê nhỏ nơi góc phố, chứa đựng những dòng chia sẻ chân thành giữa những người xa lạ: cùng động viên nhau vượt qua ngày thi cử, thất tình hay mệt mỏi trong công việc.",
    vocab: [
      { hanzi: "留言簿", pinyin: "liúyánbù", vi: "sổ lưu bút, sổ cảm tưởng" },
      { hanzi: "翻开", pinyin: "fānkāi", vi: "lật mở" },
      { hanzi: "鼓励", pinyin: "gǔlì", vi: "khích lệ, cổ vũ" },
      { hanzi: "挫折", pinyin: "cuòzhé", vi: "trắc trở, vấp ngã" },
      { hanzi: "温暖", pinyin: "wēnnuǎn", vi: "ấm áp" },
      { hanzi: "陌生人", pinyin: "mòshēngrén", vi: "người xa lạ" }
    ],
    paragraphsRaw: [
      {
        cn: "在街角一家不起眼的书店咖啡馆里，靠窗的木桌上常年摆着一本厚厚的小皮本，上面写着“暖心留言簿”。来到这里的顾客，无论是因为工作失意、考试失利，还是仅仅感到孤独，都可以在这里写下一段心情。",
        vi: "Tại một quán cà phê sách nhỏ khiêm tốn nơi góc phố, trên chiếc bàn gỗ kê cạnh cửa sổ quanh năm luôn đặt một cuốn sổ bìa da dày dặn, bên ngoài đề bốn chữ 'Sổ Lưu Niệm Ấm Lòng'. Những vị khách ghé qua nơi đây, dù là vì công việc gặp trắc trở, thi cử không như ý, hay đơn thuần chỉ là cảm thấy cô đơn, đều có thể viết vào đây đôi dòng tâm sự."
      },
      {
        cn: "随手翻开几页，上面有备考研究生的学生留下的自我勉励，有刚失恋的女孩写下的释怀文字，而在每一条低落的留言下方，几乎都能看到后面几位陌生客人留下的温情笔迹：“加油陌生人，天总会亮的！”、“请吃一块蛋糕，明天又是新的开始”。在这小小的本子里，人世间的善意悄无声息地流淌，温暖着每一个疲惫的旅人。",
        vi: "Tùy ý lật mở vài trang, phía trên có những dòng chữ tự động viên mình của sĩ tử ôn thi thạc sĩ, có nỗi lòng buông bỏ nhẹ nhõm của cô gái vừa trải qua tan vỡ tình cảm, và ngay phía dưới mỗi mẩu nhắn gửi u buồn ấy, hầu như đều thấy nét bút ấm áp của những vị khách lạ ghé sau tiếp lời: 'Cố lên nhé người bạn xa lạ, trời rồi sẽ sáng thôi!', 'Hãy tự thưởng cho mình một miếng bánh ngọt, ngày mai lại là khởi đầu mới'. Trong cuốn sổ con con này, lòng tốt giữa con người lặng lẽ tuôn trào, sưởi ấm cho từng lữ khách đang mỏi mệt."
      }
    ],
    moral: "Lòng tốt của người lạ tựa như đóa hoa dại ven đường: giản dị, chân thành nhưng đủ sức soi sáng cả một góc trời u tối trong lòng người khác.",
    quiz: {
      question: "暖心留言簿上最让人感动的地方是什么？",
      options: [
        "A. 纸张非常昂贵精美",
        "B. 陌生人在彼此低落的留言后留下真挚的鼓励与温暖",
        "C. 店主在上面记录咖啡价格",
        "D. 上面有很多著名作家的签名"
      ],
      answer: 1,
      explanation: "Đoạn 2 nêu rõ: '在每一条低落的留言下方，几乎都能看到后面几位陌生客人留下的温情笔迹... 善意悄无声息地流淌' -> Đáp án B."
    }
  },

  // 26. 中国书法：黑白之间的东方意境
  {
    id: "reading_26",
    title: "中国书法：黑白之间的东方意境",
    pinyin: "Zhōngguó Shūfǎ: Hēi Bái Zhī Jiān De Dōngfāng Yìjìng",
    hanviet: "Trung Quốc Thư Pháp: Hắc Bạch Chi Gian Đích Đông Phương Ý Cảnh (Thư Pháp Trung Hoa: Ý Cảnh Đen Trắng)",
    level: "HSK 4",
    category: "culture",
    categoryName: "Ngụ Ngôn & Cổ Điển",
    source: "Nghệ Thuật & Mỹ Học Trung Hoa",
    summary: "Thư pháp là tinh hoa độc nhất vô nhị của văn hóa Á Đông: chỉ với hai màu đen của mực và trắng của giấy, người nghệ sĩ biểu đạt cả nhịp điệu của tâm hồn, khí phách và triết lý nhân sinh.",
    vocab: [
      { hanzi: "书法", pinyin: "shūfǎ", vi: "nghệ thuật thư pháp" },
      { hanzi: "笔墨纸砚", pinyin: "bǐ mò zhǐ yàn", vi: "bút, mực, giấy, nghiên" },
      { hanzi: "意境", pinyin: "yìjìng", vi: "ý cảnh, cảnh giới nghệ thuật" },
      { hanzi: "气韵", pinyin: "qìyùn", vi: "khí vận, phong thái" },
      { hanzi: "修身养性", pinyin: "xiūshēn yǎngxìng", vi: "tu thân dưỡng tính" },
      { hanzi: "行云流水", pinyin: "xíngyún liúshuǐ", vi: "mây trôi nước chảy, phóng khoáng" }
    ],
    paragraphsRaw: [
      {
        cn: "中国书法被誉为“无声的音乐”与“纸上的舞蹈”。它仅凭一管毛笔、一汪墨汁和一张宣纸，便能在简单的黑白世界中展现出万千气象。古人把毛笔、墨锭、宣纸和砚台称为“文房四宝”，它们是中国文人精神世界的重要寄托。",
        vi: "Thư pháp Trung Hoa được ca ngợi là 'thứ âm nhạc không lời' và 'vũ điệu trên mặt giấy'. Chỉ với một ngọn bút lông, một nghiên mực tàu và một tờ giấy xuyến chỉ, người nghệ sĩ đã có thể phô diễn vạn ngàn khí tượng giữa thế giới đen trắng giản đơn. Cổ nhân gọi bút lông, thỏi mực, giấy xuyến và nghiên đá là 'Văn phòng tứ bảo', là chốn gửi gắm tâm linh sâu sắc của giới văn nhân học giả."
      },
      {
        cn: "练习书法不仅是写字技巧的磨砺，更是“修身养性”的静心之道。书写者需凝神静气，执笔端正，运笔时如行云流水，快慢虚实皆与内心的喜怒哀乐相融。字如其人，一幅优秀的书法作品，无不凝聚着创作者深厚的文化底蕴与人格魅力。",
        vi: "Luyện tập thư pháp không đơn thuần chỉ là trau dồi ngón nghề viết chữ, mà sâu xa hơn là đạo 'tu thân dưỡng tính' nuôi dưỡng sự an định của tâm hồn. Người cầm bút cần tập trung tinh thần, thế bút vững vàng, nét chuyển dịch tựa mây trôi nước chảy, lúc nhanh lúc chậm, lúc đậm lúc hư đều hòa quyện với từng cung bậc hỉ nộ ái ố trong tâm. Chữ cũng như người, một tác phẩm thư pháp kiệt xuất luôn đọng lại chiều sâu văn hóa và sức hút nhân cách của người sáng tác."
      }
    ],
    moral: "Chữ viết phản chiếu tâm hồn. Giữ cho tâm chính thì nét bút tự khắc đoan trang; kiên trì mài giũa nội tâm thì thần thái ắt tự toát lên vẻ trang nhã.",
    quiz: {
      question: "“文房四宝”指的是哪四样传统文化工具？",
      options: [
        "A. 琴、棋、书、画",
        "B. 笔、墨、纸、砚",
        "C. 茶、酒、诗、赋",
        "D. 刀、枪、剑、戟"
      ],
      answer: 1,
      explanation: "Văn phòng tứ bảo gồm 4 thứ: Bút, Mực, Giấy, Nghiên ('古人把毛笔、墨锭、宣纸和砚台称为文房四宝' -> B)."
    }
  },

  // 27. 一碗热气腾腾的兰州牛肉面
  {
    id: "reading_27",
    title: "一碗热气腾腾的兰州牛肉面",
    pinyin: "Yì Wǎn Rèqì Téngténg De Lánzhōu Niúròumiàn",
    hanviet: "Nhất Oản Nhiệt Khí Đằng Đằng Đích Lan Châu Ngưu Nhục Diện (Bát Mì Bò Lan Châu Nghi Ngút Khói)",
    level: "HSK 4",
    category: "life",
    categoryName: "Đời Sống Thường Nhật",
    source: "Hương Vị Trung Hoa (舌尖上的中国)",
    summary: "Nghệ thuật mì kéo Lan Châu nức tiếng bốn phương với tiêu chuẩn vàng: Nhất thanh, nhị bạch, tam hồng, tứ lục, ngũ hoàng. Không chỉ là mỹ vị mà còn là hơi ấm gia đình lan tỏa.",
    vocab: [
      { hanzi: "热气腾腾", pinyin: "rèqì téngténg", vi: "nghi ngút khói, nóng hổi" },
      { hanzi: "兰州牛肉面", pinyin: "Lánzhōu niúròumiàn", vi: "mì bò Lan Châu" },
      { hanzi: "清澈", pinyin: "qīngchè", vi: "trong vắt, trong vắt" },
      { hanzi: "师傅", pinyin: "shīfu", vi: "thầy, sư phụ, bác thợ" },
      { hanzi: "拉面", pinyin: "lāmiàn", vi: "kéo mì, mì sợi kéo" },
      { hanzi: "滋味", pinyin: "zīwèi", vi: "hương vị, mùi vị" }
    ],
    paragraphsRaw: [
      {
        cn: "早晨走进兰州的大街小巷，几乎每一家牛肉面馆都坐满了人。一碗正宗的兰州牛肉面讲究“一清、二白、三红、四绿、五黄”：汤要清澈、白萝卜要纯净、辣椒油要鲜红、香菜蒜苗要翠绿，而面条本身则要透出柔亮的淡黄色。",
        vi: "Sớm mai dạo bước khắp phố phường Lan Châu, hầu như tiệm mì bò nào cũng đông nghịt khách. Một bát mì bò Lan Châu chính tông phải tuân thủ nghiêm ngặt tiêu chuẩn 'Nhất thanh, nhị bạch, tam hồng, tứ lục, ngũ hoàng': nước dùng phải trong vắt, củ cải trắng tinh khiết, sa tế ớt đỏ tươi, rau mùi tỏi tây xanh biếc, còn sợi mì thì ánh lên sắc vàng nhạt mướt mát."
      },
      {
        cn: "拉面师傅站在热气翻滚的大锅前，手法犹如魔术般神奇：一块面团在他手中经过揉、拉、摔、抻，短短十几秒钟就变成了粗细均匀的细丝，落入沸水翻滚几下便迅速捞起。淋上一勺醇香滚烫的牛肉清汤，撒上一把葱花香菜，吸溜一口，满嘴浓香，浑身的寒意瞬间被驱散得无影无踪。",
        vi: "Bác thợ kéo mì đứng trước nồi nước sôi sùng sục, thao tác uyển chuyển tựa như làm xiếc: một khối bột trong tay bác qua các bước nhào, kéo, đập, giăng, chỉ trong mươi mấy giây ngắn ngủi đã hóa thành những sợi mì tơ mỏng đều tăm tắp, thả vào nồi nước sôi sùng sục đảo vài vòng là vớt lên ngay. Chan một muôi nước dùng bò trong veo thơm nức mũi, rắc thêm nắm hành hoa rau mùi tươi, húp trọn một miếng, hương thơm ngập tràn khoang miệng, bao nhiêu giá lạnh trong người lập tức tan biến không còn dấu vết."
      }
    ],
    moral: "Sự tinh tế trong ẩm thực là sự kết tinh của lòng yêu nghề và sự nhẫn nại. Hơi ấm của một món ăn bình dị đôi khi là niềm an ủi lớn nhất trên đường đời.",
    quiz: {
      question: "兰州牛肉面所讲究的“一清”指的是什么？",
      options: [
        "A. 碗要洗得干净清白",
        "B. 汤色清澈见底",
        "C. 顾客心情清静",
        "D. 面条吃完盘子空清"
      ],
      answer: 1,
      explanation: "Tiêu chuẩn '一清' tức là nước súp phải trong vắt ('一清、二白、三红、四绿、五黄：汤要清澈' -> B)."
    }
  },

  // 28. 端午粽香与龙舟竞渡
  {
    id: "reading_28",
    title: "端午粽香与龙舟竞渡",
    pinyin: "Duānwǔ Zòngxiāng Yǔ Lóngzhōu Jìngdù",
    hanviet: "Đoan Ngọ Tống Hương Dữ Long Chu Cạnh Độ (Hương Bánh Ú Đoan Ngọ Và Đua Thuyền Rồng)",
    level: "HSK 4",
    category: "culture",
    categoryName: "Ngụ Ngôn & Cổ Điển",
    source: "Tết Cổ Truyền Trung Hoa",
    summary: "Lễ hội Đoan Ngọ mùng 5 tháng 5 âm lịch với truyền thống tưởng nhớ đại thi hào Khuất Nguyên: thi đua thuyền rồng rộn rã trống chiêng và mùi thơm nồng nàn của bánh ú gói lá dong.",
    vocab: [
      { hanzi: "端午节", pinyin: "Duānwǔ Jié", vi: "Tết Đoan Ngọ" },
      { hanzi: "粽子", pinyin: "zòngzi", vi: "bánh ú lá dong, bánh chưng tro" },
      { hanzi: "龙舟", pinyin: "lóngzhōu", vi: "thuyền rồng" },
      { hanzi: "纪念", pinyin: "jìniàn", vi: "kỷ niệm, tưởng nhớ" },
      { hanzi: "屈原", pinyin: "Qū Yuán", vi: "Khuất Nguyên" },
      { hanzi: "鼓声", pinyin: "gǔshēng", vi: "tiếng trống giục" }
    ],
    paragraphsRaw: [
      {
        cn: "农历五月初五是中国传统节日端午节。相传在两千多年前，战国时期的爱国诗人屈原眼见楚国灭亡，悲愤之极投汨罗江自尽。沿岸百姓悲痛万分，纷纷划船去打捞他的遗体，又将糯米裹进竹叶投入江中，希望江中鱼虾不要伤害屈原的身体。",
        vi: "Ngày mùng năm tháng năm âm lịch là tết Đoan Ngọ truyền thống của người Trung Quốc. Tương truyền cách đây hơn hai ngàn năm, nhà thơ yêu nước Khuất Nguyên thời Chiến Quốc mắt thấy nước Sở suy vong, đau đớn cùng cực bèn trầm mình xuống dòng Mịch La tự vẫn. Bách tính ven sông xót thương vô hạn, đua nhau chèo thuyền vớt thi thể ông, rồi gói gạo nếp trong lá tre thả xuống lòng sông, mong sao tôm cá không làm tổn hại đến thân thể Khuất Nguyên."
      },
      {
        cn: "如今，赛龙舟与吃粽子已成为端午节最重要的民间习俗。在锣鼓喧天的江面上，一条条雕刻精美的龙舟飞驰竞渡，划手们同舟共济、奋力前行。而在家家户户的餐桌上，剥开翠绿的粽叶，甜甜的红枣棕与咸香的鲜肉粽散发出浓浓的家的味道。",
        vi: "Ngày nay, đua thuyền rồng và ăn bánh ú đã trở thành những phong tục dân gian thiêng liêng nhất trong dịp Đoan Ngọ. Trên mặt sông rền vang tiếng trống lệnh, từng chiếc thuyền rồng chạm trổ tinh xảo lao nhanh tranh tài, những tay chèo đồng lòng chung sức rẽ sóng tiến lên. Còn trên bàn ăn của mỗi gia đình, bóc lớp lá dong xanh mướt, bánh ú nhân táo đỏ ngọt lịm hay nhân thịt thơm lừng đều lan tỏa hương vị nồng ấm của tình thân sum vầy."
      }
    ],
    moral: "Phong tục truyền thống là sợi dây kết nối hàng ngàn năm lịch sử, nhắc nhở chúng ta về lòng yêu nước, tinh thần đoàn kết và đạo nghĩa uống nước nhớ nguồn.",
    quiz: {
      question: "端午节赛龙舟和吃粽子的习俗最早是为了纪念哪位历史人物？",
      options: [
        "A. 诗仙李白",
        "B. 爱国诗人屈原",
        "C. 兵圣孙武",
        "D. 思想家孔子"
      ],
      answer: 1,
      explanation: "Tết Đoan Ngọ tưởng nhớ nhà thơ yêu nước Khuất Nguyên ('相传在两千多年前，战国时期的爱国诗人屈原... 爱国诗人屈原' -> Đáp án B)."
    }
  },

  // 29. 做自己生命中的“长期主义者”
  {
    id: "reading_29",
    title: "做自己生命中的“长期主义者”",
    pinyin: "Zuò Zìjǐ Shēngmìng Zhōng De ‘Chángqī Zhǔyìzhě’",
    hanviet: "Tác Tự Kỷ Sinh Mệnh Trung Đích Trường Kỳ Chủ Nghĩa Giả (Làm Người Kiên Định Theo Chủ Nghĩa Dài Hạn)",
    level: "HSK 4",
    category: "inspiration",
    categoryName: "Chuyện Chữa Lành & Trưởng Thành",
    source: "Tư Duy Phát Triển Bản Thân",
    summary: "Trong một xã hội chuộng kết quả nhanh, sự kiên trì âm thầm và tinh thần 'chủ nghĩa dài hạn' chính là chìa khóa vàng giúp con người tạo nên những bứt phá bền vững và sâu sắc nhất.",
    vocab: [
      { hanzi: "长期主义", pinyin: "chángqī zhǔyì", vi: "chủ nghĩa dài hạn" },
      { hanzi: "立竿见影", pinyin: "lìgān jiànyǐng", vi: "thấy hiệu quả tức thì" },
      { hanzi: "积累", pinyin: "jīlěi", vi: "tích lũy" },
      { hanzi: "复利", pinyin: "fùlì", vi: "sức mạnh tích lũy cấp số nhân" },
      { hanzi: "浮躁", pinyin: "fúzào", vi: "nôn nóng, xốc nổi" },
      { hanzi: "沉淀", pinyin: "chéndiàn", vi: "lắng đọng, tích lũy nội lực" }
    ],
    paragraphsRaw: [
      {
        cn: "我们生活在一个追求即时满足的时代：想要今天健身明天就拥有腹肌，想要学一周中文就能流利会话。当期望的“奇迹”没有立刻发生时，许多人便轻易选择了放弃，陷入焦虑与自我怀疑。",
        vi: "Chúng ta đang sống trong một kỷ nguyên tôn sùng sự thỏa mãn tức thì: muốn hôm nay tập gym thì ngày mai phải có cơ bụng, muốn học tiếng Trung một tuần là có thể giao tiếp trôi chảy. Đến khi 'kỳ tích' mong đợi không lập tức xuất hiện, nhiều người bèn dễ dàng chọn buông xuôi, rơi vào vòng xoáy lo âu và hoài nghi bản thân."
      },
      {
        cn: "真正的高手，都是坚定的“长期主义者”。他们深谙时间的复利效应：每天背十个生词看似微不足道，坚持一年就是三千六百个；每天跑步半小时看似平常，坚持五年就是强健的体魄与坚韧的意志。把目光放长远，耐得住前期的寂寞与平淡，时间终会给予你最慷慨的回报。",
        vi: "Những người thành công thực thụ đều là những người kiên trì theo 'chủ nghĩa dài hạn'. Họ thấu hiểu sâu sắc hiệu ứng lãi kép của thời gian: mỗi ngày học mười từ vựng trông có vẻ chẳng đáng là bao, nhưng bền bỉ suốt một năm sẽ là hơn 3.600 từ; mỗi ngày chạy bộ nửa tiếng trông rất đỗi bình thường, nhưng kiên trì năm năm sẽ tạo nên một thể chất dẻo dai và ý chí sắt đá. Hãy phóng tầm mắt ra xa, chịu được sự cô đơn và bình lặng của giai đoạn đầu gieo hạt, thời gian cuối cùng ắt sẽ ban tặng cho bạn những phần thưởng xứng đáng nhất."
      }
    ],
    moral: "Cây đại thụ nghìn năm bắt đầu từ mầm non bé nhỏ. Đừng lo lắng về tốc độ của hiện tại, chỉ cần phương hướng chuẩn xác và kiên trì không dừng bước, thành công ắt sẽ mỉm cười.",
    quiz: {
      question: "根据文章，“长期主义者”取得成功的关键秘诀是什么？",
      options: [
        "A. 寻找捷径追求立竿见影",
        "B. 相信时间的复利效应，耐得住寂寞坚持微小的积累",
        "C. 只要运气好就能成功",
        "D. 频繁更换学习和生活目标"
      ],
      answer: 1,
      explanation: "Bí quyết của người dài hạn là tin vào tích lũy của thời gian: '他们深谙时间的复利效应... 耐得住前期的寂寞与平淡，时间终会给予你最慷慨的回报' -> B."
    }
  }
];

// Combine all 20 Part 2 readings:
function buildPart2() {
  const processedNew = newPart2StoriesRaw.map(story => {
    const paragraphs = story.paragraphsRaw.map((p, pIdx) => {
      const tokens = tokenizeParagraph(p.cn);
      return {
        paragraphIndex: pIdx + 1,
        chineseText: p.cn,
        vietnameseText: p.vi,
        tokens: tokens
      };
    });
    delete story.paragraphsRaw;
    return {
      ...story,
      paragraphs
    };
  });

  // Pull existing ones
  const r11 = getExisting('reading_culture_3', 'reading_11', 'HSK 3');
  const r12 = getExisting('reading_culture_4', 'reading_12', 'HSK 3');
  const r13 = getExisting('reading_1', 'reading_13', 'HSK 3');
  const r14 = getExisting('reading_cp_2', 'reading_14', 'HSK 3');
  const r15 = processedNew.find(s => s.id === 'reading_15');
  const r16 = processedNew.find(s => s.id === 'reading_16');
  const r17 = getExisting('reading_cp_1', 'reading_17', 'HSK 3 - 4');
  const r18 = getExisting('reading_cp_3', 'reading_18', 'HSK 3 - 4');
  const r19 = getExisting('reading_2', 'reading_19', 'HSK 3 - 4');
  const r20 = getExisting('reading_news_2', 'reading_20', 'HSK 3 - 4');
  const r21 = processedNew.find(s => s.id === 'reading_21');
  const r22 = processedNew.find(s => s.id === 'reading_22');
  const r23 = processedNew.find(s => s.id === 'reading_23');
  const r24 = processedNew.find(s => s.id === 'reading_24');
  const r25 = processedNew.find(s => s.id === 'reading_25');
  const r26 = processedNew.find(s => s.id === 'reading_26');
  const r27 = processedNew.find(s => s.id === 'reading_27');
  const r28 = processedNew.find(s => s.id === 'reading_28');
  const r29 = processedNew.find(s => s.id === 'reading_29');
  const r30 = getExisting('reading_cp_4', 'reading_30', 'HSK 4 - 5');

  return [
    r11, r12, r13, r14, r15, r16, r17, r18, r19, r20,
    r21, r22, r23, r24, r25, r26, r27, r28, r29, r30
  ];
}

module.exports = buildPart2;
