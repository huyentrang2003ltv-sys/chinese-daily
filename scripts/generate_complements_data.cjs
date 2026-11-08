// scripts/generate_complements_data.cjs
const fs = require('fs');
const path = require('path');

const COMPLEMENTS = [
  // ==========================================
  // 1. BỔ NGỮ KẾT QUẢ (结果补语 - Result Complements)
  // ==========================================
  {
    id: 'cmp_res_wan',
    name: 'Bổ ngữ kết quả: 完 (Xong, hết)',
    type: 'result',
    typeName: '1. Bổ Ngữ Kết Quả (结果补语)',
    marker: '完 (wán)',
    formula: 'Động từ + 完 (+ Tân ngữ)',
    negationRule: 'Phủ định bắt buộc dùng 没 / 没有 + V + 完 (TUYỆT ĐỐI KHÔNG dùng 不)',
    deepExplanation: 'Biểu thị động tác đã hoàn tất hoặc sự vật liên quan đã được tiêu hao hết hoàn toàn.',
    collocations: [
      { zh: '做完作业', py: 'zuòwán zuòyè', vi: 'làm xong bài tập' },
      { zh: '吃完了', py: 'chīwán le', vi: 'ăn xong rồi / ăn hết rồi' },
      { zh: '看完这本书', py: 'kànwán zhè běn shū', vi: 'đọc xong cuốn sách này' },
      { zh: '用完了', py: 'yòngwán le', vi: 'dùng hết rồi' }
    ],
    examples: [
      {
        zh: '等我把手头这份紧急报告写完，我们就一起去吃午饭。',
        py: 'Děng wǒ bǎ shǒutóu zhè fèn jǐnjí bàogào xiěwán, wǒmen jiù yìqǐ qù chī wǔfàn.',
        vi: 'Đợi tôi viết xong bản báo cáo khẩn cấp trong tay này, chúng ta sẽ cùng đi ăn trưa.'
      },
      {
        zh: '他还没吃完早饭就匆匆忙忙赶去公司开会了。',
        py: 'Tā hái méi chīwán zǎofàn jiù cōngcōng-mángmáng gǎn qù gōngsī kāihuì le.',
        vi: 'Anh ấy còn chưa ăn xong bữa sáng đã vội vã chạy đến công ty họp.'
      }
    ],
    hskTraps: '💡 Bẫy HSK: Câu phủ định KHÔNG ĐƯỢC dùng "不写完", phải dùng "还没写完 / 没有写完". Nếu dùng câu chữ 把 thì bổ ngữ kết quả 完 là thành phần bắt buộc.',
    quiz: {
      question: 'Chọn câu phủ định đúng ngữ pháp:',
      options: [
        '我还没做完今天的汉语作业。(Đúng)',
        '我不做完今天的汉语作业。(Sai)',
        '我做没有完今天的汉语作业。(Sai)',
        '我做完不今天的汉语作业。(Sai)'
      ],
      answer: 0,
      explain: 'Phủ định của bổ ngữ kết quả bắt buộc đặt 没/没有 trước động từ: 还没做完.'
    }
  },
  {
    id: 'cmp_res_dong',
    name: 'Bổ ngữ kết quả: 懂 (Hiểu)',
    type: 'result',
    typeName: '1. Bổ Ngữ Kết Quả (结果补语)',
    marker: '懂 (dǒng)',
    formula: 'Động từ (听/看/读) + 懂',
    negationRule: '没 / 没有 + Động từ + 懂 (Chưa hiểu)',
    deepExplanation: 'Dùng sau các giác quan tiếp nhận thông tin (nghe, nhìn, đọc) để biểu thị trí não đã lý giải và hiểu rõ ý nghĩa.',
    collocations: [
      { zh: '听懂', py: 'tīngdǒng', vi: 'nghe hiểu' },
      { zh: '看懂', py: 'kàndǒng', vi: 'đọc hiểu / xem hiểu' },
      { zh: '没听懂', py: 'méi tīngdǒng', vi: 'chưa nghe hiểu' },
      { zh: '弄懂', py: 'nòngdǒng', vi: 'làm cho hiểu rõ' }
    ],
    examples: [
      {
        zh: '老师讲得非常生动透彻，全班同学都听懂了这个问题。',
        py: 'Lǎoshī jiǎng de fēicháng shēngdòng tòuchè, quán bān tóngxué dōu tīngdǒng le zhè ge wèntí.',
        vi: 'Thầy giáo giảng rất sinh động thấu đáo, cả lớp đều đã nghe hiểu vấn đề này.'
      }
    ],
    hskTraps: '💡 Phân biệt: "没听懂" (Bổ ngữ kết quả: đã nghe nhưng chưa hiểu) khác với "听不懂" (Bổ ngữ khả năng: năng lực không thể hiểu được).',
    quiz: {
      question: 'Điền từ thích hợp: 刚才教授讲的那段文言文太深奥了，我实在没____。',
      options: ['懂 (dǒng)', '了 (le)', '完 (wán)', '过 (guò)'],
      answer: 0,
      explain: 'Biểu thị kết quả nhận thức "chưa hiểu" dùng 没听懂 / 没懂.'
    }
  },
  {
    id: 'cmp_res_jian',
    name: 'Bổ ngữ kết quả: 见 (Thấy, nhận thấy)',
    type: 'result',
    typeName: '1. Bổ Ngữ Kết Quả (结果补语)',
    marker: '见 (jiàn)',
    formula: 'Động từ (看/听/闻/遇) + 见',
    negationRule: '没 + 看见 / 没 + 听见',
    deepExplanation: 'Biểu thị giác quan (mắt thấy, tai nghe, mũi ngửi) đã tiếp nhận được hình ảnh, âm thanh hoặc mùi hương thực tế.',
    collocations: [
      { zh: '看见', py: 'kànjiàn', vi: 'nhìn thấy' },
      { zh: '听见', py: 'tīngjiàn', vi: 'nghe thấy' },
      { zh: '闻见', py: 'wénjiàn', vi: 'ngửi thấy' },
      { zh: '遇见', py: 'yùjiàn', vi: 'bắt gặp, tình cờ gặp' }
    ],
    examples: [
      {
        zh: '昨天下午我在图书馆的自习室里偶然遇见了一位多年未见的老朋友。',
        py: 'Zuótiān xiàwǔ wǒ zài túshūguǎn de zìxǐshì lǐ ǒurán yùjiàn le yí wèi duō nián wèi jiàn de lǎo péngyou.',
        vi: 'Chiều hôm qua trong phòng tự học thư viện tôi tình cờ bắt gặp một người bạn cũ nhiều năm không gặp.'
      }
    ],
    hskTraps: '💡 Bẫy HSK: "看" là hành động (nhìn, ngắm), còn "看见" là kết quả (nhìn thấy được hình ảnh). Có hành động "看" chưa chắc đã "看见".',
    quiz: {
      question: 'Phát biểu nào sau đây phân biệt đúng giữa "看" và "看见"?',
      options: [
        '"看" là động tác hướng mắt nhìn, "看见" là kết quả nhìn thấy (Đúng)',
        'Hai từ hoàn toàn đồng nghĩa và thay thế lẫn nhau trong mọi trường hợp (Sai)',
        '"看见" phủ định bằng "不看见" (Sai)',
        '"看" bắt buộc phải đi với 见 mới có nghĩa (Sai)'
      ],
      answer: 0,
      explain: '"看" là động tác, "看见" là kết quả khi thị giác tiếp nhận được sự vật.'
    }
  },
  {
    id: 'cmp_res_dao',
    name: 'Bổ ngữ kết quả: 到 (Được, tới, đến nơi)',
    type: 'result',
    typeName: '1. Bổ Ngữ Kết Quả (结果补语)',
    marker: '到 (dào)',
    formula: 'Động từ + 到 (+ Nơi chốn / Thời gian / Đối tượng)',
    negationRule: '没 / 没有 + Động từ + 到',
    deepExplanation: 'Biểu thị 3 nét nghĩa cốt lõi: 1) Đạt được mục đích (买到, 找到); 2) Hành động kéo dài đến thời điểm nào (学到半夜); 3) Hành động di chuyển đến địa điểm nào (送到家).',
    collocations: [
      { zh: '找到', py: 'zhǎodào', vi: 'tìm thấy' },
      { zh: '买到', py: 'mǎidào', vi: 'mua được' },
      { zh: '收到', py: 'shōudào', vi: 'nhận được (thư, quà)' },
      { zh: '学到', py: 'xuédào', vi: 'học đến / học được' }
    ],
    examples: [
      {
        zh: '经过几个星期的多方寻找，他终于在旧书店里买到了那本绝版的字典。',
        py: 'Jīngguò jǐ ge xīngqī de duōfāng xúnzhǎo, tā zhōngyú zài jiùshūdiàn lǐ mǎidào le nà běn juébǎn de zìdiǎn.',
        vi: 'Trải qua nhiều tuần tìm kiếm khắp nơi, anh ấy cuối cùng đã mua được cuốn từ điển tuyệt bản đó trong hiệu sách cũ.'
      }
    ],
    hskTraps: '💡 Bẫy HSK: "找" là tìm kiếm (hành động), "找到" là tìm thấy (kết quả). Nếu chưa tìm thấy nói: "没找到", không nói "不找".',
    quiz: {
      question: 'Điền từ: 找了半天，我的钱包终于____了！',
      options: ['找到 (zhǎodào)', '找完 (zhǎowán)', '找懂 (zhǎodǒng)', '找好 (zhǎohǎo)'],
      answer: 0,
      explain: 'Tìm kiếm đạt được kết quả thấy được vật dùng 找到.'
    }
  },
  {
    id: 'cmp_res_dui_cuo',
    name: 'Bổ ngữ kết quả: 对 / 错 (Đúng / Sai)',
    type: 'result',
    typeName: '1. Bổ Ngữ Kết Quả (结果补语)',
    marker: '对 (duì) / 错 (cuò)',
    formula: 'Động từ + 对 / 错',
    negationRule: '没 + V + 对 (Làm chưa đúng) / V + 错 + 了 (Đã làm sai)',
    deepExplanation: 'Đánh giá tính chính xác hoặc sai lệch của hành vi thực hiện (nói, làm, đoán, nhận, viết).',
    collocations: [
      { zh: '做对了', py: 'zuòduì le', vi: 'làm đúng rồi' },
      { zh: '说错了', py: 'shuōcuò le', vi: 'nói sai rồi' },
      { zh: '写错了', py: 'xiěcuò le', vi: 'viết sai rồi' },
      { zh: '猜对了', py: 'cāiduì le', vi: 'đoán đúng rồi' }
    ],
    examples: [
      {
        zh: '这次HSK听力考试的最后一道难题，全班只有他一个人猜对了。',
        py: 'Zhè cì HSK tīnglì kǎoshì de zuìhòu yí dào nántí, quán bān zhǐyǒu tā yí ge rén cāiduì le.',
        vi: 'Câu hỏi khó cuối cùng của kỳ thi nghe HSK lần này, cả lớp chỉ có một mình anh ấy đoán đúng.'
      }
    ],
    hskTraps: '💡 Chú ý: "说错了" nghĩa là đã nói và phát ngôn đó sai; còn "没说错" nghĩa là phát ngôn không hề có sai sót.',
    quiz: {
      question: 'Trong câu: "对不起，我把您的姓氏写____了。", từ cần điền là:',
      options: ['错 (cuò)', '懂 (dǒng)', '完 (wán)', '见 (jiàn)'],
      answer: 0,
      explain: 'Viết nhầm, viết sai họ của người khác dùng bổ ngữ kết quả 错: 写错了.'
    }
  },
  {
    id: 'cmp_res_hao',
    name: 'Bổ ngữ kết quả: 好 (Xong thỏa đáng, hoàn hảo)',
    type: 'result',
    typeName: '1. Bổ Ngữ Kết Quả (结果补语)',
    marker: '好 (hǎo)',
    formula: 'Động từ + 好',
    negationRule: '还没 + V + 好 (Chưa xong hoàn tất)',
    deepExplanation: 'Khác với 完 (chỉ đơn thuần kết thúc về lượng thời gian), 好 nhấn mạnh hành động đã hoàn tất mỹ mãn, sẵn sàng cho bước tiếp theo.',
    collocations: [
      { zh: '准备好', py: 'zhǔnbèihǎo', vi: 'chuẩn bị sẵn sàng' },
      { zh: '修好了', py: 'xiūhǎo le', vi: 'sửa xong ngon lành rồi' },
      { zh: '商量好', py: 'shānglianghǎo', vi: 'bàn bạc thống nhất xong' },
      { zh: '穿好衣服', py: 'chuānhǎo yīfu', vi: 'mặc xong quần áo chỉnh tề' }
    ],
    examples: [
      {
        zh: '出发前往机场之前，请务必仔细检查所有的签证与护照是否都准备好了。',
        py: 'Chūfā qiánwǎng jīchǎng zhīqián, qǐng wùbì zǐxì jiǎnchá suǒyǒu de qiānzhèng yǔ hùzhào shìfǒu dōu zhǔnbèihǎo le.',
        vi: 'Trước khi xuất phát ra sân bay, xin hãy kiểm tra kỹ lưỡng xem visa và hộ chiếu đều đã được chuẩn bị sẵn sàng chưa.'
      }
    ],
    hskTraps: '💡 So sánh then chốt HSK: "做完" = làm xong (bất kể tốt hay xấu); "做好" = làm xong chỉn chu, đạt yêu cầu chất lượng.',
    quiz: {
      question: 'Muốn diễn đạt "đã bàn bạc thống nhất xong và đạt được sự đồng thuận", nên dùng cụm nào?',
      options: ['商量好 (shānglianghǎo)', '商量见 (shāngliangjiàn)', '商量错 (shāngliangcuò)', '商量开 (shāngliangkāi)'],
      answer: 0,
      explain: 'Bàn bạc xong xuôi, đạt được kết quả thỏa đáng dùng 商量好.'
    }
  },
  {
    id: 'cmp_res_zhu',
    name: 'Bổ ngữ kết quả: 住 (Chặt, cố định, vững vàng)',
    type: 'result',
    typeName: '1. Bổ Ngữ Kết Quả (结果补语)',
    marker: '住 (zhù)',
    formula: 'Động từ + 住',
    negationRule: '没 + V + 住',
    deepExplanation: 'Biểu thị hành động làm cho người hoặc vật dừng lại, cố định vị trí hoặc ghi nhớ vững chắc trong tâm trí.',
    collocations: [
      { zh: '记住', py: 'jìzhu', vi: 'ghi nhớ sâu sắc' },
      { zh: '站住', py: 'zhànzhu', vi: 'đứng yên, đứng lại' },
      { zh: '抓紧住', py: 'zhuājǐnzhu', vi: 'nắm thật chặt' },
      { zh: '拿住', py: 'názhu', vi: 'cầm chắc' }
    ],
    examples: [
      {
        zh: '这几个汉语语法重点非常实用，大家一定要牢牢记住。',
        py: 'Zhè jǐ ge Hànyǔ yǔfǎ zhòngdiǎn fēicháng shíyòng, dàjiā yídìng yào láoláo jìzhu.',
        vi: 'Mấy trọng điểm ngữ pháp tiếng Hán này vô cùng thực dụng, mọi người nhất định phải ghi nhớ thật vững chắc.'
      }
    ],
    hskTraps: '💡 Bẫy HSK: "记住" (nhớ kỹ lại, in vào não) khác với "想起" (sực nhớ ra điều đã quên).',
    quiz: {
      question: 'Điền từ: 汽车突然在前方的红灯前刹____了。',
      options: ['住 (zhù)', '完 (wán)', '懂 (dǒng)', '错 (cuò)'],
      answer: 0,
      explain: 'Phanh xe dừng cố định lại một chỗ dùng 刹住 (hoặc 停住).'
    }
  },
  {
    id: 'cmp_res_cheng',
    name: 'Bổ ngữ kết quả: 成 (Thành, biến thành)',
    type: 'result',
    typeName: '1. Bổ Ngữ Kết Quả (结果补语)',
    marker: '成 (chéng)',
    formula: 'Động từ + 成 + Tân ngữ',
    negationRule: '没 + V + 成',
    deepExplanation: 'Biểu thị thông qua hành động làm cho sự vật thay đổi bản chất, hình dáng, dịch chuyển sang ngôn ngữ khác hoặc đạt được thành công.',
    collocations: [
      { zh: '翻译成', py: 'fānyì chéng', vi: 'dịch sang thành' },
      { zh: '看成', py: 'kànchéng', vi: 'nhìn nhầm thành, xem thành' },
      { zh: '变成', py: 'biànchéng', vi: 'biến thành' },
      { zh: '写成', py: 'xiěchéng', vi: 'viết thành' }
    ],
    examples: [
      {
        zh: '请把这段精彩的中文寓言生动地翻译成越南语。',
        py: 'Qǐng bǎ zhè duàn jīngcǎi de Zhōngwén yùyán shēngdòng de fānyì chéng Yuènányǔ.',
        vi: 'Xin hãy dịch đoạn truyện ngụ ngôn tiếng Trung đặc sắc này một cách sinh động sang tiếng Việt.'
      }
    ],
    hskTraps: '💡 Cấu trúc câu chữ 把 đi kèm 成: "把 A 翻译/改/看 成 B" là cấu trúc bắt buộc thi HSK 3 - HSK 5.',
    quiz: {
      question: 'Hoàn thành câu: "请把这封邮件翻译____中文发给客户。"',
      options: ['成 (chéng)', '完 (wán)', '懂 (dǒng)', '错 (cuò)'],
      answer: 0,
      explain: 'Dịch sang một ngôn ngữ khác bắt buộc dùng bổ ngữ kết quả 成: 翻译成.'
    }
  },

  // ==========================================
  // 2. BỔ NGỮ XU HƯỚNG (趋向补语 - Direction Complements)
  // ==========================================
  {
    id: 'cmp_dir_lai_qu',
    name: 'Bổ ngữ xu hướng đơn: 来 / 去 (Lại gần / Đi xa)',
    type: 'direction',
    typeName: '2. Bổ Ngữ Xu Hướng (趋向补语)',
    marker: '来 (lái) / 去 (qù)',
    formula: 'Động từ + 来 (tiến lại gần người nói) / 去 (rời xa người nói)',
    negationRule: '没 + V + 来/去',
    deepExplanation: 'Lấy vị trí của người nói làm mốc quy chiếu: Hướng về phía người nói thì dùng 来, hướng rời xa người nói thì dùng 去.',
    collocations: [
      { zh: '进来', py: 'jìnlái', vi: 'vào đây (người nói đang ở trong phòng)' },
      { zh: '进去', py: 'jìnqù', vi: 'vào trong đó (người nói đang ở ngoài phòng)' },
      { zh: '拿来', py: 'nálái', vi: 'cầm lại đây' },
      { zh: '送去', py: 'sòngqù', vi: 'mang gửi đi chỗ khác' }
    ],
    examples: [
      {
        zh: '外面风大天气冷，大家快请进屋来喝杯热茶吧！',
        py: 'Wàimian fēng dà tiānqì lěng, dàjiā kuài qǐng jìn wū lái hē bēi rèchá ba!',
        vi: 'Bên ngoài gió to trời lạnh, mọi người hãy mau vào trong nhà uống chén trà nóng đi! (Người nói đang ở trong nhà).'
      }
    ],
    hskTraps: '💡 Quy tắc vàng vị trí Tân ngữ nơi chốn: Tân ngữ chỉ địa điểm BẮT BUỘC kẹp giữa Động từ và 来/去. Ví dụ: 回家去 (ĐÚNG), 回去家 (SAI HOÀN TOÀN)!',
    quiz: {
      question: 'Người nói đang ở trên lầu, gọi người dưới nhà lên, câu nào chuẩn xác?',
      options: [
        '你快上来吧！(Đúng - hướng lại gần người nói trên lầu)',
        '你快上去吧！(Sai - người nói đang ở dưới mới dùng 上去)',
        '你快来上吧！(Sai trật tự từ)',
        '你快去上吧！(Sai trật tự từ)'
      ],
      answer: 0,
      explain: 'Khi người nói ở trên lầu, động tác từ dưới hướng lên người nói bắt buộc dùng 上来.'
    }
  },
  {
    id: 'cmp_dir_qilai',
    name: 'Bổ ngữ xu hướng phức: 起来 (Lên / Bắt đầu & Tiếp diễn / Đánh giá)',
    type: 'direction',
    typeName: '2. Bổ Ngữ Xu Hướng (趋向补语)',
    marker: '起来 (qǐlai)',
    formula: '1) V + 起来 (từ thấp lên cao); 2) V/Adj + 起来 (bắt đầu và tiếp diễn); 3) V + 起来 (nhìn/nghe/nếm có vẻ)',
    negationRule: 'Tùy ngữ cảnh, ví dụ: 没想起来 (chưa sực nhớ ra)',
    deepExplanation: 'Là bổ ngữ xu hướng có nghĩa phái sinh (引申义) xuất hiện dày đặc nhất trong HSK. Ngoài nghĩa đen chuyển động vươn lên, còn biểu thị bắt đầu hành động nhanh chóng hoặc đánh giá cảm quan.',
    collocations: [
      { zh: '站起来', py: 'zhàn qǐlai', vi: 'đứng dậy (nghĩa gốc vật lý)' },
      { zh: '热起来', py: 'rè qǐlai', vi: 'ấm dần lên, nóng lên (bắt đầu biến đổi)' },
      { zh: '笑起来', py: 'xiào qǐlai', vi: 'bật cười (bắt đầu hành động)' },
      { zh: '看起来', py: 'kàn qǐlai', vi: 'xem ra, trông có vẻ (đánh giá)' },
      { zh: '想起来', py: 'xiǎng qǐlai', vi: 'sực nhớ lại điều đã quên' }
    ],
    examples: [
      {
        zh: '一听到这个天大的好消息，大家情不自禁地欢呼雀跃起来。',
        py: 'Yì tīngdào zhè ge tiāndà de hǎo xiāoxi, dàjiā qíngbùzìjīn de huānhū-quèyuè qǐlai.',
        vi: 'Vừa nghe được tin vui kinh ngạc này, mọi người không kìm được lòng mà reo hò nhảy cẫng lên.'
      },
      {
        zh: '经你这么一提醒，我终于想起来他是谁了！',
        py: 'Jīng nǐ zhè me yì tíxǐng, wǒ zhōngyú xiǎng qǐlai tā shì shuí le!',
        vi: 'Nhờ bạn nhắc như thế, tôi cuối cùng đã sực nhớ ra anh ấy là ai rồi!'
      }
    ],
    hskTraps: '💡 Bẫy HSK kinh điển: Phân biệt "想起来" (nhớ lại thông tin có sẵn trong ký ức) với "想出来" (nghĩ ra sáng kiến, ý tưởng mới tinh chưa từng có).',
    quiz: {
      question: 'Nhà khoa học phát minh ra phương án giải quyết mới chưa ai biết, phải dùng:',
      options: [
        '想出来了一个好办法 (Đúng - sáng tạo ra cái mới)',
        '想起来了一个好办法 (Sai - hồi tưởng ký ức cũ)',
        '想下去了一个好办法 (Sai)',
        '想过来了一个好办法 (Sai)'
      ],
      answer: 0,
      explain: 'Nghĩ ra ý tưởng mới từ hư vô dùng 想出来. Nhớ lại điều đã quên mới dùng 想起来.'
    }
  },
  {
    id: 'cmp_dir_chulai',
    name: 'Bổ ngữ xu hướng phức: 出来 (Ra ngoài / Xuất hiện, nhận ra, tạo ra)',
    type: 'direction',
    typeName: '2. Bổ Ngữ Xu Hướng (趋向补语)',
    marker: '出来 (chūlai)',
    formula: 'V + 出来',
    negationRule: '没 + V + 出来 (hoặc V + 不出来 trong bổ ngữ khả năng)',
    deepExplanation: 'Nghĩa gốc: Từ trong ra ngoài hướng về người nói. Nghĩa phái sinh: Làm cho sự vật từ ẩn giấu lộ diện ra ngoài ánh sáng, nhận diện ra bản chất (看出来, 听出来), hoặc sáng tạo ra cái mới (想出来, 研发出来).',
    collocations: [
      { zh: '走出来', py: 'zǒu chūlai', vi: 'bước ra ngoài' },
      { zh: '看出来', py: 'kàn chūlai', vi: 'nhìn thấu, nhìn ra được bản chất' },
      { zh: '听出来', py: 'tīng chūlai', vi: 'nghe ra được giọng ai' },
      { zh: '研究出来', py: 'yánjiū chūlai', vi: 'nghiên cứu chế tạo ra' }
    ],
    examples: [
      {
        zh: '尽管他戴着口罩和墨镜，我还是凭声音一下子听出来了是他。',
        py: 'Jǐnguǎn tā dài zhe kǒuzhào hé mòjìng, wǒ háishi píng shēngyīn yíxiàzi tīng chūlai le shì tā.',
        vi: 'Dù cho anh ấy đeo khẩu trang và kính râm, tôi vẫn dựa vào giọng nói mà lập tức nhận ra là anh ấy.'
      }
    ],
    hskTraps: '💡 Bẫy HSK: "看出来" nghĩa là dùng thị giác nhận biết được bí mật hoặc trạng thái (ví dụ: 看出他很高兴).',
    quiz: {
      question: 'Điền từ: 哪怕你极力掩饰内心，我也早就看____你其实很不开心。',
      options: ['出来 (chūlai)', '进去 (jìnqù)', '上来 (shànglai)', '下去 (xiàqù)'],
      answer: 0,
      explain: 'Nhận ra, nhìn thấu chân tướng cảm xúc của đối phương dùng 看出来.'
    }
  },
  {
    id: 'cmp_dir_xiaqu',
    name: 'Bổ ngữ xu hướng phức: 下去 (Xuống dưới / Tiếp tục duy trì)',
    type: 'direction',
    typeName: '2. Bổ Ngữ Xu Hướng (趋向补语)',
    marker: '下去 (xiàqu)',
    formula: 'V + 下去',
    negationRule: 'Không duy trì được nữa: V + 不下去了',
    deepExplanation: 'Nghĩa gốc: Chuyển động từ cao xuống thấp rời xa người nói. Nghĩa phái sinh: Hành động đang diễn ra tiếp tục kiên trì duy trì về tương lai.',
    collocations: [
      { zh: '走下去', py: 'zǒu xiàqu', vi: 'bước xuống / tiếp tục bước đi' },
      { zh: '坚持下去', py: 'jiānchí xiàqu', vi: 'kiên trì đến cùng' },
      { zh: '活下去', py: 'huó xiàqu', vi: 'tiếp tục sống sót' },
      { zh: '读下去', py: 'dú xiàqu', vi: 'đọc tiếp tục' }
    ],
    examples: [
      {
        zh: '遇到再大的艰难困苦，我们也必须咬紧牙关坚定地走下去。',
        py: 'Yùdào zài dà de jiānnán-kùnkǔ, wǒmen yě bìxū yǎojǐn yáguān jiāndìng de zǒu xiàqu.',
        vi: 'Gặp phải gian nan khốn khó lớn đến mấy, chúng ta cũng phải cắn chặt răng kiên định bước tiếp.'
      }
    ],
    hskTraps: '💡 Phân biệt với 下来: "下来" là hành động từ quá khứ kéo dài đến hiện tại (ví dụ: 传统流传下来) hoặc dừng lại (停下来); "下去" là từ hiện tại tiếp diễn tới tương lai.',
    quiz: {
      question: 'Cổ vũ bạn bè tiếp tục học tập bền bỉ về sau, nên nói câu nào?',
      options: [
        '请你一定要坚持学下去！(Đúng - duy trì tới tương lai)',
        '请你一定要坚持学下来！(Sai ngữ cảnh)',
        '请你一定要坚持学出来！(Sai nghĩa)',
        '请你一定要坚持学上去！(Sai nghĩa)'
      ],
      answer: 0,
      explain: 'Tiếp tục duy trì hành vi từ hiện tại hướng về tương lai dùng 下去: 坚持学下去.'
    }
  },
  {
    id: 'cmp_dir_guolai',
    name: 'Bổ ngữ xu hướng phức: 过来 (Qua đây / Trở lại trạng thái bình thường)',
    type: 'direction',
    typeName: '2. Bổ Ngữ Xu Hướng (趋向补语)',
    marker: '过来 (guòlai)',
    formula: 'V + 过来',
    negationRule: '没 + V + 过来',
    deepExplanation: 'Nghĩa gốc: Chuyển động qua mặt phẳng hướng về người nói. Nghĩa phái sinh: Chuyển biến từ trạng thái tiêu cực/hôn mê/sai trái trở về trạng thái tỉnh táo/bình thường/đúng đắn.',
    collocations: [
      { zh: '走过来', py: 'zǒu guòlai', vi: 'đi qua đây' },
      { zh: '醒过来', py: 'xǐng guòlai', vi: 'tỉnh lại (sau khi ngất/mê)' },
      { zh: '改过来', py: 'gǎi guòlai', vi: 'sửa lại cho đúng' },
      { zh: '反应过来', py: 'fǎnyìng guòlai', vi: 'kịp phản ứng, hoàn hồn hiểu ra' }
    ],
    examples: [
      {
        zh: '病人经过医生一整夜的全力抢救，终于脱离生命危险醒过来了。',
        py: 'Bìngrén jīngguò yīshēng yì zhěng yè de quánlì qiǎngjiù, zhōngyú tuōlí shēngmìng wēixiǎn xǐng guòlai le.',
        vi: 'Bệnh nhân sau cả đêm được bác sĩ dốc toàn lực cấp cứu, cuối cùng đã qua cơn nguy kịch và tỉnh lại.'
      }
    ],
    hskTraps: '💡 Bẫy HSK: "过来" là hồi phục về trạng thái tốt; còn "过去" biểu thị chuyển sang trạng thái xấu hoặc mất tri giác (ví dụ: 晕过去 - ngất xỉu đi).',
    quiz: {
      question: 'Diễn tả người bị ngất xỉu mất đi tri giác, tiếng Hán dùng:',
      options: [
        '他突然晕过去了。(Đúng - rơi vào trạng thái tiêu cực ngất đi)',
        '他突然晕过来了。(Sai - tỉnh lại mới dùng 过来)',
        '他突然晕起来了。(Sai)',
        '他突然晕下去了。(Sai)'
      ],
      answer: 0,
      explain: 'Hôn mê mất ý thức dùng 晕过去. Ngược lại khi hồi tỉnh mới dùng 醒过来.'
    }
  },

  // ==========================================
  // 3. BỔ NGỮ KHẢ NĂNG (可能补语 - Potential Complements)
  // ==========================================
  {
    id: 'cmp_pot_formula',
    name: 'Công thức & Bản chất Bổ ngữ Khả năng: V + 得/不 + C',
    type: 'potential',
    typeName: '3. Bổ Ngữ Khả Năng (可能补语)',
    marker: '得 (de) / 不 (bu)',
    formula: 'Khẳng định: V + 得 + Bổ ngữ | Phủ định: V + 不 + Bổ ngữ',
    negationRule: 'Chỉ cần thay "得" bằng "不", TUYỆT ĐỐI KHÔNG dùng 没 hoặc 不 trước động từ!',
    deepExplanation: 'Dùng để biểu thị điều kiện chủ quan hoặc khách quan có cho phép thực hiện được kết quả hoặc xu hướng của động tác hay không.',
    collocations: [
      { zh: '听得懂 / 听不懂', py: 'tīngdedǒng / tīngbudǒng', vi: 'có thể nghe hiểu / không thể nghe hiểu' },
      { zh: '做得到 / 做不到', py: 'zuòdedào / zuòbudào', vi: 'làm được / không làm được' },
      { zh: '吃得完 / 吃不完', py: 'chīdewán / chībùwán', vi: 'ăn hết được / không ăn hết được' },
      { zh: '买得起 / 买不起', py: 'mǎideqǐ / mǎibuqǐ', vi: 'đủ tiền mua / không đủ tiền mua' }
    ],
    examples: [
      {
        zh: '这个箱子太沉重了，我一个人根本搬不动，快来帮帮我！',
        py: 'Zhè ge xiāngzi tài chénzhòng le, wǒ yí ge rén gēnběn bānbudòng, kuài lái bāngbang wǒ!',
        vi: 'Chiếc hòm này nặng quá, một mình tôi căn bản không nhấc nổi, mau lại đây giúp tôi với!'
      }
    ],
    hskTraps: '💡 LỖI NGƯỜI VIỆT 90% MẮC: Học viên hay nói theo tiếng Việt "我不能听懂" (SAI VĂN PHONG). Người bản xứ BẮT BUỘC dùng bổ ngữ khả năng: "我听不懂"!',
    quiz: {
      question: 'Dịch câu "Bài tập nhiều quá, tôi làm không xuể" sang tiếng Trung chuẩn tự nhiên nhất:',
      options: [
        '作业太多了，我做不完。(Đúng chuẩn ngữ cảm bản xứ)',
        '作业太多了，我不能做完。(Văn phong lai tiếng Việt gượng gạo)',
        '作业太多了，我没做完。(Sai nghĩa - đây là chưa làm xong, không phải không xuể)',
        '作业太多了，我做完不。(Sai ngữ pháp)'
      ],
      answer: 0,
      explain: 'Biểu thị năng lực khách quan không kham nổi kết quả, tiếng Hán dùng bổ ngữ khả năng: 做不完.'
    }
  },
  {
    id: 'cmp_pot_liao',
    name: 'Cấu trúc đặc thù: V + 得了 / 不了 (Liễu - Nổi / Không nổi)',
    type: 'potential',
    typeName: '3. Bổ Ngữ Khả Năng (可能补语)',
    marker: '得了 (deliǎo) / 不了 (bùliǎo)',
    formula: 'V + 得了 (deliǎo) / V + 不了 (bùliǎo)',
    negationRule: 'V + 不了 (bùliǎo)',
    deepExplanation: 'Chữ 了 ở đây phát âm là "liǎo" (thanh 3). Biểu thị hành động có khả năng xảy ra hoặc hoàn thành hay không.',
    collocations: [
      { zh: '去得了 / 去不了', py: 'qùdeliǎo / qùbùliǎo', vi: 'đi được / không đi được' },
      { zh: '受得了 / 受不了', py: 'shòudeliǎo / shòubùliǎo', vi: 'chịu đựng nổi / không chịu nổi' },
      { zh: '忘得了 / 忘不了', py: 'wàngdeliǎo / wàngbùliǎo', vi: 'quên được / không thể nào quên' },
      { zh: '吃不了', py: 'chībùliǎo', vi: 'không ăn nổi' }
    ],
    examples: [
      {
        zh: '今天突然发高烧浑身无力，明天的登山活动我恐怕是去不了了。',
        py: 'Jīntiān tūrán fā gāoshāo húnshēn wúlì, míngtiān de dēngshān huódòng wǒ kǒngpà shì qùbùliǎo le.',
        vi: 'Hôm nay tự dưng sốt cao toàn thân bủn rủn, hoạt động leo núi ngày mai e là tôi không đi nổi rồi.'
      }
    ],
    hskTraps: '💡 Bẫy phát âm HSK: Chữ 了 trong cấu trúc này TUYỆT ĐỐI đọc là "liǎo", không đọc là "le".',
    quiz: {
      question: 'Diễn tả "Thời tiết nóng bức ngột ngạt đến mức tôi không tài nào chịu đựng nổi nữa":',
      options: [
        '天气热得让我简直受不了了！(Đúng - shòubùliǎo)',
        '天气热得让我简直受不好了！(Sai)',
        '天气热得让我简直不受了！(Sai)',
        '天气热得让我简直没受了！(Sai)'
      ],
      answer: 0,
      explain: 'Không chịu đựng nổi một hoàn cảnh nào đó dùng cấu trúc cố định: 受不了 (shòubùliǎo).'
    }
  },
  {
    id: 'cmp_pot_xia',
    name: 'Cấu trúc dung lượng: 放得下 / 放不下 (Chứa vừa / Chứa không nổi)',
    type: 'potential',
    typeName: '3. Bổ Ngữ Khả Năng (可能补语)',
    marker: '得/不下 (de/bù xià)',
    formula: 'V + 得下 / 不下',
    negationRule: 'V + 不下',
    deepExplanation: 'Biểu thị không gian vật lý, sức chứa hoặc sự dung nạp tâm lý có đủ chỗ để chứa đựng sự vật hay không.',
    collocations: [
      { zh: '坐得下 / 坐不下', py: 'zuòdexià / zuòbuxià', vi: 'ngồi vừa / không đủ chỗ ngồi' },
      { zh: '放得下 / 放不下', py: 'fàngdexià / fàngbuxià', vi: 'để vừa / không để vừa' },
      { zh: '住得下 / 住不下', py: 'zhùdexià / zhùbuxià', vi: 'ở vừa / không đủ chỗ ở' }
    ],
    examples: [
      {
        zh: '这辆七座商务车空间很宽敞，我们全家六口人完全坐得下。',
        py: 'Zhè liàng qī zuò shāngwùchē kōngjiān hěn kuānchang, wǒmen quán jiā liù kǒu rén wánquán zuòdexià.',
        vi: 'Chiếc xe thương vụ 7 chỗ này không gian rất rộng rãi, cả nhà 6 người chúng tôi hoàn toàn ngồi vừa.'
      }
    ],
    hskTraps: '💡 Nghĩa bóng mở rộng: "放得下" còn dùng trong tâm lý chỉ việc buông bỏ được phiền muộn quá khứ.',
    quiz: {
      question: 'Hội trường quá nhỏ, 500 người không thể ngồi hết được, dùng cụm nào?',
      options: ['坐不下 (zuòbuxià)', '坐不懂 (zuòbudǒng)', '坐不完 (zuòbuwán)', '坐不着 (zuòbuzháo)'],
      answer: 0,
      explain: 'Biểu thị không gian không đủ sức chứa số lượng người dùng 坐不下.'
    }
  },

  // ==========================================
  // 4. BỔ NGỮ TRẠNG THÁI & TRÌNH ĐỘ (状态与程度补语)
  // ==========================================
  {
    id: 'cmp_deg_de_adj',
    name: 'Bổ ngữ trạng thái: V + 得 + Tính từ / Cụm miêu tả',
    type: 'state_degree',
    typeName: '4. Bổ Ngữ Trạng Thái & Trình Độ (状态与程度补语)',
    marker: '得 (de)',
    formula: 'V + 得 + Tính từ (hoặc V + Tân ngữ + V + 得 + Tính từ)',
    negationRule: 'Đặt 不 trước TÍNH TỪ miêu tả: V + 得 + 不 + Adj (KHÔNG đặt trước Động từ!)',
    deepExplanation: 'Dùng để đánh giá, miêu tả trạng thái, trình độ hoặc kết quả của hành động đã thực hiện hoặc mang tính thường xuyên.',
    collocations: [
      { zh: '说得很流利', py: 'shuō de hěn liúlì', vi: 'nói rất lưu loát' },
      { zh: '跑得飞快', py: 'pǎo de fēikuài', vi: 'chạy nhanh như bay' },
      { zh: '写得极好', py: 'xiě de jí hǎo', vi: 'viết cực kỳ hay' },
      { zh: '起得很早', py: 'qǐ de hěn zǎo', vi: 'thức dậy rất sớm' }
    ],
    examples: [
      {
        zh: '他每天坚持早读与朗诵，现在中文普通话说得比本地人还地道。',
        py: 'Tā měitiān jiānchí zǎodú yǔ lǎngsòng, xiànzài Zhōngwén pǔtōnghuà shuō de bǐ běndìrén hái dìdào.',
        vi: 'Anh ấy mỗi ngày đều kiên trì đọc sớm và đọc diễn cảm, bây giờ tiếng Quan Thoại nói còn chuẩn hơn cả người bản xứ.'
      }
    ],
    hskTraps: '💡 Cực kỳ quan trọng: Phủ định của bổ ngữ trạng thái là "跑得不快", TUYỆT ĐỐI KHÔNG NÓI "不跑得快"!',
    quiz: {
      question: 'Chọn câu có cấu trúc câu chuẩn khi mang tân ngữ:',
      options: [
        '他汉语说得非常流利。(Đúng: V + Tân ngữ lược + V + 得)',
        '他说汉语得非常流利。(Sai: "得" không được đặt trực tiếp sau tân ngữ)',
        '他不说得汉语非常流利。(Sai vị trí phủ định)',
        '他汉语不说的非常流利。(Sai chữ 的)'
      ],
      answer: 0,
      explain: 'Khi có tân ngữ, hoặc lặp lại động từ "他说汉语说得流利", hoặc đưa tân ngữ lên đầu "他汉语说得流利".'
    }
  },
  {
    id: 'cmp_deg_jile_sile',
    name: 'Bổ ngữ trình độ cực hạn: ...极了 / ...死了 / ...坏了',
    type: 'state_degree',
    typeName: '4. Bổ Ngữ Trạng Thái & Trình Độ (状态与程度补语)',
    marker: '极了 (jíle) / 死了 (sǐle) / 坏了 (huàile)',
    formula: 'Tính từ + 极了 / 死了 / 坏了',
    negationRule: 'Không có dạng phủ định trực tiếp',
    deepExplanation: 'Biểu thị mức độ đã đạt tới đỉnh điểm cao nhất. "极了" mang sắc thái ca ngợi tích cực; "死了" vốn dùng cho trạng thái tiêu cực nhưng khẩu ngữ hiện đại dùng cả tích cực (高兴死了); "坏了" biểu thị sự bức bối (急坏了).',
    collocations: [
      { zh: '好极了', py: 'hǎojíle', vi: 'tốt tuyệt vời' },
      { zh: '漂亮极了', py: 'piàoliang jíle', vi: 'xinh đẹp vô cùng' },
      { zh: '累死了', py: 'lèisǐle', vi: 'mệt chết đi được' },
      { zh: '高兴死了', py: 'gāoxìng sǐle', vi: 'vui mừng khôn xiết' },
      { zh: '忙坏了', py: 'mánghuàile', vi: 'bận tối tăm mặt mũi' }
    ],
    examples: [
      {
        zh: '登上巍峨险峻的长城极目远眺，眼前的山川景色真是壮丽极了！',
        py: 'Dēngshàng wēi\'é xiǎnjùn de Chángchéng jímù yuǎntiào, yǎnqián de shānchuān jǐngsè zhēnshi zhuànglì jíle!',
        vi: 'Bước lên đỉnh Vạn Lý Trường Thành hiểm trở phóng tầm mắt ra xa, cảnh sắc núi sông trước mắt quả thực tráng lệ vô cùng!'
      }
    ],
    hskTraps: '💡 Lưu ý: Khi đã dùng "极了" thì TRƯỚC tính từ KHÔNG ĐƯỢC thêm phó từ chỉ mức độ như "很", "非常", "太" nữa. (Ví dụ: "很好极了" là SAI).',
    quiz: {
      question: 'Tìm câu sai trong các câu diễn đạt mức độ sau:',
      options: [
        '这道菜很美味极了。(Sai: thừa phó từ "很")',
        '这道菜美味极了。(Đúng)',
        '爬了一整天山，今天简直累死了。(Đúng)',
        '看到录取通知书，全家人高兴极了。(Đúng)'
      ],
      answer: 0,
      explain: 'Bổ ngữ cực hạn 极了 không được kết hợp đồng thời với phó từ 很.'
    }
  },

  // ==========================================
  // 5. BỔ NGỮ THỜI LƯỢNG & SỐ LƯỢNG (时量与数量补语)
  // ==========================================
  {
    id: 'cmp_dur_rules',
    name: 'Bổ ngữ thời lượng: Biểu thị khoảng thời gian duy trì hành động',
    type: 'duration_quantity',
    typeName: '5. Bổ Ngữ Thời Lượng & Số Lượng (时量与数量补语)',
    marker: 'Thời lượng: 三天, 半个小时, 两个月...',
    formula: '1) V + 了 + Thời lượng + Tân ngữ | 2) V + Tân ngữ đại từ + Thời lượng',
    negationRule: 'Chưa làm đủ thời gian: 还没 + V + Thời lượng',
    deepExplanation: 'Dùng để trả lời cho câu hỏi "多长时间 / 多久" (bao lâu). Điểm mấu chốt là vị trí tương đối giữa Bổ ngữ thời lượng và Tân ngữ trong câu.',
    collocations: [
      { zh: '学了三年汉语', py: 'xué le sān nián Hànyǔ', vi: 'học tiếng Hán được 3 năm' },
      { zh: '等了他半个小时', py: 'děng le tā bàn ge xiǎoshí', vi: 'đợi anh ấy nửa tiếng đồng hồ' },
      { zh: '住了两个星期', py: 'zhù le liǎng ge xīngqī', vi: 'ở được 2 tuần' }
    ],
    examples: [
      {
        zh: '他在北京大学刻苦钻研了四年中国现当代文学。',
        py: 'Tā zài Běijīng Dàxué kèkǔ zuānyán le sì nián Zhōngguó xiàndàidài wénxué.',
        vi: 'Anh ấy đã dày công nghiên cứu văn học hiện đại và đương đại Trung Quốc suốt 4 năm tại Đại học Bắc Kinh.'
      }
    ],
    hskTraps: '💡 QUY TẮC BẤT DI BẤT DỊCH: Nếu Tân ngữ là ĐẠI TỪ NHÂN XƯNG (我, 你, 他...), đại từ PHẢI ĐỨNG TRƯỚC thời lượng. Ví dụ: "我等了你半个小时" (ĐÚNG), "我等了半个小时你" (SAI NẶNG)!',
    quiz: {
      question: 'Chọn câu diễn đạt đúng trật tự từ khi tân ngữ là đại từ nhân xưng "他":',
      options: [
        '我们在烈日下等了他整整一个小时。(Đúng: Tân ngữ đại từ đứng trước thời lượng)',
        '我们在烈日下等了整整一个小时他。(Sai vị trí tân ngữ)',
        '我们在烈日下他等了整整一个小时。(Sai cấu trúc)',
        '我们在烈日下等整整一个小时了他。(Sai hoàn toàn)'
      ],
      answer: 0,
      explain: 'Khi tân ngữ là đại từ nhân xưng, vị trí chuẩn là: Động từ + Đại từ + Thời lượng.'
    }
  },
  {
    id: 'cmp_dur_double_le',
    name: 'Cấu trúc "2 chữ 了": Hành động vẫn đang tiếp tục diễn ra',
    type: 'duration_quantity',
    typeName: '5. Bổ Ngữ Thời Lượng & Số Lượng (时量与数量补语)',
    marker: 'V + 了 + Thời lượng + 了',
    formula: 'Chủ ngữ + V + 了 + Thời lượng + (Tân ngữ) + 了',
    negationRule: 'Chỉ có 1 chữ 了 thì hành động đã dừng lại trong quá khứ',
    deepExplanation: 'Sự khác biệt vĩ đại giữa 1 chữ 了 và 2 chữ 了: "我学了一年汉语" (đã học 1 năm và giờ không học nữa); "我学了一年汉语了" (đã học được 1 năm và hiện tại vẫn đang tiếp tục học).',
    collocations: [
      { zh: '雨下了一天了', py: 'yǔ xià le yì tiān le', vi: 'mưa cả ngày nay rồi (giờ vẫn đang mưa)' },
      { zh: '他睡了十个小时了', py: 'tā shuì le shí ge xiǎoshí le', vi: 'anh ấy ngủ được 10 tiếng rồi (vẫn chưa dậy)' },
      { zh: '学了三年中文了', py: 'xué le sān nián Zhōngwén le', vi: 'học tiếng Trung được 3 năm rồi (vẫn tiếp tục học)' }
    ],
    examples: [
      {
        zh: '张经理在这家外资跨国企业辛勤工作了十五年了，经验极其丰富。',
        py: 'Zhāng jīnglǐ zài zhè jiā wàizī kuàguó qǐyè xīnqín gōngzuò le shíwǔ nián le, jīngyàn jíqí fēngfù.',
        vi: 'Giám đốc Trương đã làm việc cần mẫn ở doanh nghiệp đa quốc gia này suốt 15 năm nay rồi (và hiện tại vẫn đang làm việc tại đây).'
      }
    ],
    hskTraps: '💡 Đề thi HSK cực thích bẫy câu hỏi đọc hiểu: Nếu câu có "2 chữ 了" -> Đáp án đúng là hành động vẫn đang tiếp tục!',
    quiz: {
      question: 'Câu "他在河内住了一年。" có ý nghĩa chính xác là gì?',
      options: [
        'Anh ấy từng sống ở Hà Nội 1 năm, hiện nay không còn ở đó nữa。(Đúng: 1 chữ 了 biểu thị đã kết thúc)',
        'Anh ấy đã sống ở Hà Nội 1 năm và hiện tại vẫn đang sống ở đó。(Sai: phải có thêm chữ 了 cuối câu)',
        'Anh ấy chuẩn bị chuyển đến Hà Nội sống 1 năm。(Sai)',
        'Anh ấy chỉ định ở Hà Nội 1 tuần。(Sai)'
      ],
      answer: 0,
      explain: 'Khi chỉ có 1 chữ 了 sau động từ, hành động đã hoàn tất và kết thúc trong quá khứ.'
    }
  },

  // ==========================================
  // 6. BỔ NGỮ ĐỘNG LƯỢNG (动量补语)
  // ==========================================
  {
    id: 'cmp_act_ci_bian',
    name: 'Phân biệt Bổ ngữ động lượng: 次 (Lần chung) vs 遍 (Lần trọn vẹn từ đầu đến cuối)',
    type: 'action_measure',
    typeName: '6. Bổ Ngữ Động Lượng (动量补语)',
    marker: '次 (cì) / 遍 (biàn)',
    formula: 'V + 了 + Số lượng + 次 / 遍',
    negationRule: '没 + V + 过',
    deepExplanation: '次 chỉ đơn thuần là số lần thực hiện (có thể chưa làm hết); còn 遍 nhấn mạnh quá trình hành động phải diễn ra trọn vẹn từ điểm khởi đầu đến điểm kết thúc (đọc hết cuốn sách, xem hết bộ phim).',
    collocations: [
      { zh: '去过三次', py: 'qù guo sān cì', vi: 'từng đi 3 lần' },
      { zh: '看了一遍', py: 'kàn le yí biàn', vi: 'đọc hết trọn vẹn một lượt' },
      { zh: '再说一遍', py: 'zài shuō yí biàn', vi: 'nói lại một lượt từ đầu đến cuối' },
      { zh: '听了两遍', py: 'tīng le liǎng biàn', vi: 'nghe trọn vẹn 2 lần' }
    ],
    examples: [
      {
        zh: '这篇文章的文学价值极高，建议大家从头到尾认真精读三遍。',
        py: 'Zhè piān wénzhāng de wénxué jiàzhí jígāo, jiànyì dàjiā cóngtóu-dàowěi rènzhēn jīngdú sān biàn.',
        vi: 'Giá trị văn học của bài viết này cực kỳ cao, kiến nghị mọi người hãy đọc kỹ từ đầu đến cuối 3 lượt.'
      }
    ],
    hskTraps: '💡 Bẫy HSK: Khi muốn nhờ người khác nhắc lại lời vừa nói vì nghe chưa rõ, bắt buộc dùng "请再说一遍", không nói "请再说一次".',
    quiz: {
      question: 'Khi muốn nói "Quyển tiểu thuyết này rất lôi cuốn, tôi đã đọc trọn vẹn từ trang đầu đến trang cuối 2 lần", nên dùng:',
      options: [
        '这本小说我认真读了两遍。(Đúng: nhấn mạnh trọn vẹn từ đầu đến cuối)',
        '这本小说我认真读了两下。(Sai)',
        '这本小说我认真读了两趟。(Sai)',
        '这本小说我认真读了两顿。(Sai)'
      ],
      answer: 0,
      explain: 'Quá trình trải nghiệm toàn diện từ đầu chí cuối (đặc biệt trong đọc sách, xem phim, nghe ghi âm) dùng 遍.'
    }
  },
  {
    id: 'cmp_act_tang_dun',
    name: 'Các động lượng từ đặc thù: 趟 (Chuyến đi lại) & 顿 (Bữa, trận mắng)',
    type: 'action_measure',
    typeName: '6. Bổ Ngữ Động Lượng (动量补语)',
    marker: '趟 (tàng) / 顿 (dùn)',
    formula: 'V + 了 + 一趟 / 一顿',
    negationRule: '没 + V',
    deepExplanation: '趟 chuyên dùng cho các hành động đi lại khứ hồi (chạy một chuyến, đi một chuyến bưu điện); 顿 dùng cho ăn uống (bữa ăn) hoặc hành vi trách phạt, mắng mỏ, đánh đập.',
    collocations: [
      { zh: '跑了一趟超市', py: 'pǎo le yí tàng chāoshì', vi: 'chạy một chuyến ra siêu thị' },
      { zh: '去了一趟北京', py: 'qù le yí tàng Běijīng', vi: 'đi một chuyến đến Bắc Kinh' },
      { zh: '吃了一顿大餐', py: 'chī le yí dùn dàcān', vi: 'ăn một bữa tiệc thịnh soạn' },
      { zh: '批评了一顿', py: 'pīpíng le yí dùn', vi: 'phê bình một trận tơi bời' }
    ],
    examples: [
      {
        zh: '因为粗心大意弄丢了重要合同，他在会议上被经理狠狠批评了一顿。',
        py: 'Yīnwèi cūxīn-dàyì nòngdiū le zhòngyào hétong, tā zài huìyì shang bèi jīnglǐ hěnhěn pīpíng le yí dùn.',
        vi: 'Bởi vì sơ suất bất cẩn làm mất hợp đồng quan trọng, anh ấy đã bị giám đốc phê bình một trận thậm tệ trong cuộc họp.'
      }
    ],
    hskTraps: '💡 Vị trí tân ngữ: Nếu tân ngữ là ĐỊA ĐIỂM (nơi chốn), tân ngữ có thể đứng sau bổ ngữ động lượng (ví dụ: 去了一趟中国).',
    quiz: {
      question: 'Điền động lượng từ thích hợp: "今天下午我特意去了一____邮局寄国际特快专递。"',
      options: ['趟 (tàng)', '顿 (dùn)', '场 (chǎng)', '遍 (biàn)'],
      answer: 0,
      explain: 'Hành động di chuyển đi lại đến một địa điểm làm việc rồi về dùng 趟: 去了一趟邮局.'
    }
  },

  // ==========================================
  // 7. BỔ NGỮ GIỚI TỪ (介词补语)
  // ==========================================
  {
    id: 'cmp_prep_zai_dao_gei',
    name: 'Bổ ngữ giới từ: V + 在 / 到 / 给 / 向',
    type: 'prepositional',
    typeName: '7. Bổ Ngữ Giới Từ (介词补语)',
    marker: '在 (zài) / 到 (dào) / 给 (gěi) / 向 (xiàng)',
    formula: 'V + 在/到 + Nơi chốn | V + 给 + Người | V + 向 + Phương hướng',
    negationRule: '没 + V + 在/到/给',
    deepExplanation: 'Giới từ kết hợp với cụm từ chỉ nơi chốn, thời gian hoặc đối tượng đứng SAU động từ làm bổ ngữ, biểu thị điểm dừng chân hoặc đích đến cuối cùng của hành động.',
    collocations: [
      { zh: '出生在河内', py: 'chūshēng zài Hénèi', vi: 'sinh ra ở Hà Nội' },
      { zh: '写在黑板上', py: 'xiě zài hēibǎn shang', vi: 'viết lên trên bảng đen' },
      { zh: '送到办公室', py: 'sòng dào bàngōngshì', vi: 'giao đến văn phòng' },
      { zh: '借给我一本书', py: 'jiè gěi wǒ yì běn shū', vi: 'cho tôi mượn một cuốn sách' },
      { zh: '飞向蓝天', py: 'fēi xiàng lántiān', vi: 'bay về phía trời xanh' }
    ],
    examples: [
      {
        zh: '请大家把刚刚讨论得出的核心结论认真记录在笔记本上。',
        py: 'Qǐng dàjiā bǎ gānggāng tǎolùn déchū de héxīn jiélùn rènzhēn jìlù zài bǐjìběn shang.',
        vi: 'Xin mọi người hãy ghi chép cẩn thận kết luận cốt lõi vừa thảo luận xong vào trong sổ tay.'
      }
    ],
    hskTraps: '💡 Bẫy trật tự từ: Nhiều học viên nhầm lẫn giữa "在... + V" (nơi thực hiện hành động) và "V + 在..." (kết quả lưu lại ở một nơi). Ví dụ: "sinh ra ở" bắt buộc là "出生在", không nói "在河内出生".',
    quiz: {
      question: 'Hoàn thành câu: "请把快递直接递____门卫保安师傅。"',
      options: ['给 (gěi)', '在 (zài)', '到 (dào)', '向 (xiàng)'],
      answer: 0,
      explain: 'Chuyển giao đồ đạc cho một đối tượng cụ thể dùng bổ ngữ giới từ 给: 递给.'
    }
  }
];

const outputPath = path.join(__dirname, '../public/data/complements.json');
fs.writeFileSync(outputPath, JSON.stringify(COMPLEMENTS, null, 2), 'utf8');
console.log(`✓ Đã tạo thành công Bách khoa Bổ Ngữ Tiếng Hán: ${COMPLEMENTS.length} chuyên đề bổ ngữ chuyên sâu.`);
