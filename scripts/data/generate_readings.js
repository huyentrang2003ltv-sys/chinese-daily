const { dataFile } = require('./paths');
const fs = require('fs');
const path = require('path');

const readingsData = [
  {
    id: "reading_1",
    title: "盲人摸象",
    pinyin: "Mángrén Mō Xiàng",
    hanviet: "Manh Nhân Mạc Tượng (Thầy bói xem voi)",
    level: "HSK 2 - 3",
    category: "fable",
    categoryName: "Ngụ Ngôn Cổ Điển",
    summary: "Câu chuyện ngụ ngôn kinh điển về những người mù sờ từng bộ phận của con voi và rút ra những kết luận phiến diện buồn cười.",
    paragraphs: [
      {
        tokens: [
          { hanzi: "从前", pinyin: "cóngqián", vi: "ngày xưa" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "有", pinyin: "yǒu", vi: "có" },
          { hanzi: "四个", pinyin: "sì gè", vi: "bốn người" },
          { hanzi: "盲人", pinyin: "mángrén", vi: "người mù" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "他们", pinyin: "tāmen", vi: "bọn họ" },
          { hanzi: "从来", pinyin: "cónglái", vi: "từ trước tới nay" },
          { hanzi: "没有", pinyin: "méiyǒu", vi: "chưa từng" },
          { hanzi: "见过", pinyin: "jiànguò", vi: "nhìn thấy" },
          { hanzi: "大象", pinyin: "dàxiàng", vi: "con voi" },
          { hanzi: "。", pinyin: "", vi: "" }
        ],
        chineseText: "从前，有四个盲人，他们从来没有见过大象。",
        vietnameseText: "Ngày xửa ngày xưa, có bốn người mù chưa từng được nhìn thấy con voi bao giờ."
      },
      {
        tokens: [
          { hanzi: "有一天", pinyin: "yǒu yì tiān", vi: "một ngày nọ" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "他们", pinyin: "tāmen", vi: "họ" },
          { hanzi: "决定", pinyin: "juédìng", vi: "quyết định" },
          { hanzi: "用手", pinyin: "yòng shǒu", vi: "dùng tay" },
          { hanzi: "去摸一摸", pinyin: "qù mō yi mō", vi: "đi sờ thử" },
          { hanzi: "大象", pinyin: "dàxiàng", vi: "con voi" },
          { hanzi: "到底", pinyin: "dàodǐ", vi: "rốt cuộc" },
          { hanzi: "长什么样", pinyin: "zhǎng shénme yàng", vi: "trông như thế nào" },
          { hanzi: "。", pinyin: "", vi: "" }
        ],
        chineseText: "有一天，他们决定用手去摸一摸大象到底长什么样。",
        vietnameseText: "Một hôm nọ, họ quyết định dùng tay sờ thử xem con voi rốt cuộc trông như thế nào."
      },
      {
        tokens: [
          { hanzi: "第一个人", pinyin: "dì yī gè rén", vi: "người thứ nhất" },
          { hanzi: "摸到了", pinyin: "mō dào le", vi: "sờ trúng" },
          { hanzi: "象牙", pinyin: "xiàngyá", vi: "ngà voi" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "说", pinyin: "shuō", vi: "bảo rằng" },
          { hanzi: "：", pinyin: "", vi: "" },
          { hanzi: "“大象", pinyin: "dàxiàng", vi: "con voi" },
          { hanzi: "就像", pinyin: "jiù xiàng", vi: "giống hệt như" },
          { hanzi: "一根", pinyin: "yì gēn", vi: "một chiếc" },
          { hanzi: "大萝卜", pinyin: "dà luóbo", vi: "củ cải to" },
          { hanzi: "！”", pinyin: "", vi: "" }
        ],
        chineseText: "第一个人摸到了象牙，说：“大象就像一根大萝卜！”",
        vietnameseText: "Người thứ nhất sờ phải chiếc ngà voi, liền nói: 'Con voi chẳng khác nào một củ cải to!'"
      },
      {
        tokens: [
          { hanzi: "第二个人", pinyin: "dì èr gè rén", vi: "người thứ hai" },
          { hanzi: "摸到了", pinyin: "mō dào le", vi: "sờ trúng" },
          { hanzi: "大象的耳朵", pinyin: "dàxiàng de ěrduo", vi: "tai con voi" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "大叫", pinyin: "dà jiào", vi: "kêu to" },
          { hanzi: "：", pinyin: "", vi: "" },
          { hanzi: "“不对", pinyin: "bú duì", vi: "không đúng" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "大象", pinyin: "dàxiàng", vi: "con voi" },
          { hanzi: "明明", pinyin: "míngmíng", vi: "rõ ràng" },
          { hanzi: "是", pinyin: "shì", vi: "là" },
          { hanzi: "一把", pinyin: "yì bǎ", vi: "một chiếc" },
          { hanzi: "大扇子", pinyin: "dà shànzi", vi: "cái quạt ba tiêu to" },
          { hanzi: "！”", pinyin: "", vi: "" }
        ],
        chineseText: "第二个人摸到了大象的耳朵，大叫：“不对，大象明明是一把大扇子！”",
        vietnameseText: "Người thứ hai sờ trúng tai voi, la lên: 'Sai bét, con voi rõ ràng là một chiếc quạt nan to!'"
      },
      {
        tokens: [
          { hanzi: "第三个人", pinyin: "dì sān gè rén", vi: "người thứ ba" },
          { hanzi: "摸到", pinyin: "mō dào", vi: "sờ tới" },
          { hanzi: "象腿", pinyin: "xiàng tuǐ", vi: "chân voi" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "说", pinyin: "shuō", vi: "nói" },
          { hanzi: "：", pinyin: "", vi: "" },
          { hanzi: "“大象", pinyin: "dàxiàng", vi: "con voi" },
          { hanzi: "分明", pinyin: "fēnmíng", vi: "rành rành" },
          { hanzi: "是", pinyin: "shì", vi: "là" },
          { hanzi: "一根", pinyin: "yì gēn", vi: "một cây" },
          { hanzi: "大柱子", pinyin: "dà zhùzi", vi: "cột đình to" },
          { hanzi: "！”", pinyin: "", vi: "" }
        ],
        chineseText: "第三个人摸到象腿，说：“大象分明是一根大柱子！”",
        vietnameseText: "Người thứ ba sờ trúng chân voi, cãi: 'Con voi rành rành là một cây cột đình to lớn!'"
      },
      {
        tokens: [
          { hanzi: "第四个人", pinyin: "dì sì gè rén", vi: "người thứ tư" },
          { hanzi: "抓住了", pinyin: "zhuā zhù le", vi: "nắm chặt lấy" },
          { hanzi: "大象的尾巴", pinyin: "dàxiàng de wěiba", vi: "đuôi con voi" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "笑", pinyin: "xiào", vi: "cười" },
          { hanzi: "他们", pinyin: "tāmen", vi: "bọn họ" },
          { hanzi: "说", pinyin: "shuō", vi: "nói rằng" },
          { hanzi: "：", pinyin: "", vi: "" },
          { hanzi: "“大象", pinyin: "dàxiàng", vi: "con voi" },
          { hanzi: "只是一根", pinyin: "zhǐ shì yì gēn", vi: "chỉ là một sợi" },
          { hanzi: "细绳子", pinyin: "xì shéngzi", vi: "dây thừng nhỏ" },
          { hanzi: "罢了", pinyin: "bà le", vi: "mà thôi" },
          { hanzi: "！”", pinyin: "", vi: "" }
        ],
        chineseText: "第四个人抓住了大象的尾巴，笑他们说：“大象只是一根细绳子罢了！”",
        vietnameseText: "Người thứ tư túm lấy cái đuôi voi, cười khẩy nói: 'Con voi chẳng qua chỉ là một sợi dây thừng mảnh mà thôi!'"
      }
    ],
    moral: "Bài học triết lý: Người chỉ nhìn thấy một góc của sự việc mà đã vội vàng quy kết toàn thể thì sẽ rơi vào cái nhìn phiến diện, sai lầm."
  },
  {
    id: "reading_2",
    title: "愚公移山",
    pinyin: "Yú Gōng Yí Shān",
    hanviet: "Ngu Công Di Sơn (Ngu Công dời núi)",
    level: "HSK 3 - 4",
    category: "fable",
    categoryName: "Truyền Thuyết Cổ Đại",
    summary: "Câu chuyện ngụ ngôn nổi tiếng trong Liệt Tử tôn vinh tinh thần kiên trì bền bỉ, không ngại khó khăn gian khổ để chinh phục thiên nhiên.",
    paragraphs: [
      {
        tokens: [
          { hanzi: "古时候", pinyin: "gǔshíhou", vi: "thời cổ đại" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "有一位", pinyin: "yǒu yí wèi", vi: "có một vị" },
          { hanzi: "老人", pinyin: "lǎorén", vi: "ông lão" },
          { hanzi: "叫", pinyin: "jiào", vi: "tên là" },
          { hanzi: "愚公", pinyin: "Yú Gōng", vi: "Ngu Công" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "他家门前", pinyin: "tā jiā mén qián", vi: "trước cửa nhà ông ấy" },
          { hanzi: "有两座", pinyin: "yǒu liǎng zuò", vi: "có hai ngọn" },
          { hanzi: "大山", pinyin: "dàshān", vi: "núi lớn" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "出门", pinyin: "chūmén", vi: "ra ngoài cửa" },
          { hanzi: "非常", pinyin: "fēicháng", vi: "vô cùng" },
          { hanzi: "不方便", pinyin: "bù fāngbiàn", vi: "bất tiện" },
          { hanzi: "。", pinyin: "", vi: "" }
        ],
        chineseText: "古时候，有一位老人叫愚公，他家门前有两座大山，出门非常不方便。",
        vietnameseText: "Thời xưa, có một cụ già tên là Ngu Công, trước cửa nhà cụ có hai ngọn núi sừng sững chắn lối, đi lại vô cùng bất tiện."
      },
      {
        tokens: [
          { hanzi: "快九十岁", pinyin: "kuài jiǔshí suì", vi: "gần 90 tuổi" },
          { hanzi: "的", pinyin: "de", vi: "" },
          { hanzi: "愚公", pinyin: "Yú Gōng", vi: "Ngu Công" },
          { hanzi: "下定决心", pinyin: "xiàdìng juéxīn", vi: "hạ quyết tâm" },
          { hanzi: "：", pinyin: "", vi: "" },
          { hanzi: "要把", pinyin: "yào bǎ", vi: "phải đem" },
          { hanzi: "两座大山", pinyin: "liǎng zuò dàshān", vi: "hai ngọn núi lớn" },
          { hanzi: "移走", pinyin: "yí zǒu", vi: "dời đi chỗ khác" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "开出", pinyin: "kāi chū", vi: "mở ra" },
          { hanzi: "一条", pinyin: "yì tiáo", vi: "một con" },
          { hanzi: "通往", pinyin: "tōng wǎng", vi: "thông tới" },
          { hanzi: "外界的", pinyin: "wàijiè de", vi: "thế giới bên ngoài" },
          { hanzi: "平坦大道", pinyin: "píngtǎn dàdào", vi: "đại lộ bằng phẳng" },
          { hanzi: "。", pinyin: "", vi: "" }
        ],
        chineseText: "快九十岁的愚公下定决心：要把两座大山移走，开出一条通往外界的平坦大道。",
        vietnameseText: "Cụ Ngu Công đã ngót nghét 90 tuổi bèn hạ quyết tâm: Phải đào dời hai quả núi đi, mở một con đường bằng phẳng đi ra bên ngoài."
      },
      {
        tokens: [
          { hanzi: "有人", pinyin: "yǒu rén", vi: "có người" },
          { hanzi: "笑他", pinyin: "xiào tā", vi: "cười nhạo cụ" },
          { hanzi: "太傻", pinyin: "tài shǎ", vi: "quá đỗi ngốc nghếch" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "愚公", pinyin: "Yú Gōng", vi: "Ngu Công" },
          { hanzi: "坚定地说", pinyin: "jiāndìng de shuō", vi: "kiên định trả lời rằng" },
          { hanzi: "：", pinyin: "", vi: "" },
          { hanzi: "“我死了", pinyin: "wǒ sǐ le", vi: "tôi chết rồi" },
          { hanzi: "有儿子", pinyin: "yǒu érzi", vi: "còn có con trai" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "儿子", pinyin: "érzi", vi: "con trai" },
          { hanzi: "又生孙子", pinyin: "yòu shēng sūnzi", vi: "lại sinh ra cháu chắt" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "子子孙孙", pinyin: "zǐzǐ sūnsūn", vi: "con cháu nối đời" },
          { hanzi: "无穷无尽", pinyin: "wúqióng wújìn", vi: "vô cùng vô tận" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "而山", pinyin: "ér shān", vi: "mà núi non" },
          { hanzi: "却不会", pinyin: "què bú huì", vi: "thì lại chẳng thể" },
          { hanzi: "再增高", pinyin: "zài zēnggāo", vi: "cao thêm được nữa" },
          { hanzi: "，", pinyin: "", vi: "" },
          { hanzi: "何愁", pinyin: "hé chóu", vi: "lo chi" },
          { hanzi: "挖不平", pinyin: "wā bù píng", vi: "không san phẳng" },
          { hanzi: "呢？", pinyin: "ne", vi: "" }
        ],
        chineseText: "有人笑他太傻，愚公坚定地说：“我死了有儿子，儿子又生孙子，子子孙孙无穷无尽，而山却不会再增高，何愁挖不平呢？”",
        vietnameseText: "Có kẻ chê cười cụ lẩm cẩm, Ngu Công khảng khái đáp: 'Tôi chết đi thì còn có con trai, con trai lại sinh cháu chắt, con con cháu cháu truyền đời bất tận, còn núi thì đâu thể mọc cao thêm được nữa, lo gì không san phẳng?'"
      }
    ],
    moral: "Bài học triết lý: Ý chí con người có thể làm nên kỳ tích. Chỉ cần kiên trì bền bỉ từ thế hệ này sang thế hệ khác thì dẫu núi cao sông sâu cũng đều bị chinh phục."
  }
];

const dest = dataFile('readings.json');
fs.writeFileSync(dest, JSON.stringify(readingsData, null, 2), 'utf8');
console.log(`Đã tạo thành công ${readingsData.length} Bài Đọc Hiểu Song Ngữ tại ${dest}`);
