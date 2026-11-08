// scripts/append_more_complements.cjs
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/complements.json');
const currentList = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const ADDITIONAL_COMPLEMENTS = [
  {
    id: 'cmp_res_kai',
    name: 'Bổ ngữ kết quả: 开 (Mở ra, tách rời, phân tán)',
    type: 'result',
    typeName: '1. Bổ Ngữ Kết Quả (结果补语)',
    marker: '开 (kāi)',
    formula: 'Động từ + 开 (+ Tân ngữ)',
    negationRule: '没 + V + 开',
    deepExplanation: 'Biểu thị thông qua động tác làm cho sự vật mở ra, tách rời khỏi vị trí ban đầu hoặc tâm lý được giải tỏa, thông suốt (想开).',
    collocations: [
      { zh: '打开窗户', py: 'dǎkāi chuānghu', vi: 'mở cửa sổ ra' },
      { zh: '张开嘴巴', py: 'zhāngkāi zuǐba', vi: 'há miệng ra' },
      { zh: '离开家乡', py: 'líkāi jiāxiāng', vi: 'rời khỏi quê hương' },
      { zh: '想开了', py: 'xiǎngkāi le', vi: 'nghĩ thông suốt, buông bỏ chấp niệm' }
    ],
    examples: [
      {
        zh: '清晨推开窗户，一阵清新扑鼻的泥土芬芳迎面而来。',
        py: 'Qīngchén tuīkāi chuānghu, yí zhèn qīngxīn-pūbí de nítǔ fēnfāng yíngmiàn ér lái.',
        vi: 'Sáng sớm đẩy cửa sổ ra, một luồng hương thơm cỏ cây đất trời tươi mát phả ngay vào mặt.'
      }
    ],
    hskTraps: '💡 Nghĩa tâm lý: "想开" là giải tỏa khúc mắc trong lòng, còn "离开" là tách rời về không gian địa lý.',
    quiz: {
      question: 'Bác sĩ kiểm tra cổ họng bảo bệnh nhân há miệng to, dùng cụm nào?',
      options: ['张开嘴巴 (zhāngkāi zuǐba)', '张完嘴巴 (zhāngwán zuǐba)', '张懂嘴巴 (zhāngdǒng zuǐba)', '张住嘴巴 (zhāngzhù zuǐba)'],
      answer: 0,
      explain: 'Hành động mở rộng, banh ra dùng bổ ngữ kết quả 开: 张开.'
    }
  },
  {
    id: 'cmp_res_shang',
    name: 'Bổ ngữ kết quả: 上 (Dính vào, khép lại, đạt mục tiêu)',
    type: 'result',
    typeName: '1. Bổ Ngữ Kết Quả (结果补语)',
    marker: '上 (shàng)',
    formula: 'Động từ + 上 (+ Tân ngữ)',
    negationRule: '没 + V + 上',
    deepExplanation: 'Biểu thị: 1) Hai sự vật tiếp xúc, khép dính lại (关上, 闭上); 2) Mặc, đeo lên người (穿上, 戴上); 3) Đạt được mục tiêu mong ước (考上大学, 当上经理); 4) Bắt đầu nảy sinh tình cảm (爱上).',
    collocations: [
      { zh: '关上门', py: 'guānshàng mén', vi: 'đóng cửa lại' },
      { zh: '穿上外套', py: 'chuānshàng wàitào', vi: 'mặc áo khoác vào' },
      { zh: '考上名校', py: 'kǎoshàng míngxiào', vi: 'thi đỗ vào trường danh tiếng' },
      { zh: '爱上中国文化', py: 'àishàng Zhōngguó wénhuà', vi: 'phải lòng, yêu thích văn hóa Trung Hoa' }
    ],
    examples: [
      {
        zh: '经过三年的挑灯夜战与不懈奋斗，他终于如愿考上了心仪的清华大学。',
        py: 'Jīngguò sān nián de tiǎodēng-yèzhàn yǔ búxiè fèndòu, tā zhōngyú rúyuàn kǎoshàng le xīnyí de Qīnghuá Dàxué.',
        vi: 'Trải qua ba năm thức khuya học bài và phấn đấu không ngừng nghỉ, anh ấy cuối cùng đã toại nguyện thi đỗ vào Đại học Thanh Hoa hằng mơ ước.'
      }
    ],
    hskTraps: '💡 Cặp đối lập kinh điển: "关上" (đóng vào) đối lập với "打开" (mở ra).',
    quiz: {
      question: 'Điền bổ ngữ kết quả: "出门前记得随手把电灯关____。"',
      options: ['上 (shàng)', '开 (kāi)', '懂 (dǒng)', '见 (jiàn)'],
      answer: 0,
      explain: 'Tắt điện, đóng cửa dùng 关上.'
    }
  },
  {
    id: 'cmp_res_zou',
    name: 'Bổ ngữ kết quả: 走 (Mang đi, rời khỏi chỗ cũ, mất đi)',
    type: 'result',
    typeName: '1. Bổ Ngữ Kết Quả (结果补语)',
    marker: '走 (zǒu)',
    formula: 'Động từ + 走 (+ Tân ngữ)',
    negationRule: '没 + V + 走',
    deepExplanation: 'Biểu thị hành động làm cho người hoặc vật dịch chuyển vị trí rời xa chỗ ban đầu, mang tính tách rời hoặc mất đi quyền sở hữu.',
    collocations: [
      { zh: '拿走', py: 'názǒu', vi: 'cầm đi, lấy đi' },
      { zh: '带走', py: 'dàizǒu', vi: 'mang đi, gói mang về (takeaway)' },
      { zh: '借走', py: 'jièzǒu', vi: 'mượn đem đi' },
      { zh: '偷走', py: 'tōuzǒu', vi: 'ăn trộm lấy mất' }
    ],
    examples: [
      {
        zh: '请把餐桌上吃剩的食物用环保餐盒打包带走。',
        py: 'Qǐng bǎ cānzhuō shang chī shèng de shíwù yòng huánbǎo cānhé dǎbāo dàizǒu.',
        vi: 'Xin hãy dùng hộp đựng thân thiện môi trường để đóng gói thức ăn thừa trên bàn mang về.'
      }
    ],
    hskTraps: '💡 Khẩu ngữ quán ăn: "在这儿吃还是带走？" (Ăn tại đây hay mang về?).',
    quiz: {
      question: 'Khách gọi đồ ăn đóng hộp mang về nhà, dùng cụm nào?',
      options: ['打包带走 (dǎbāo dàizǒu)', '打包拿来 (dǎbāo nálái)', '打包吃完 (dǎbāo chīwán)', '打包做好 (dǎbāo zuòhǎo)'],
      answer: 0,
      explain: 'Đóng gói mang đi dùng 打包带走.'
    }
  },
  {
    id: 'cmp_dir_huilai_huiqu',
    name: 'Bổ ngữ xu hướng: 回来 / 回去 (Trở về lại điểm xuất phát)',
    type: 'direction',
    typeName: '2. Bổ Ngữ Xu Hướng (趋向补语)',
    marker: '回来 (huílái) / 回去 (huíqù)',
    formula: 'Động từ + 回 (+ Địa điểm) + 来 / 去',
    negationRule: '没 + V + 回来/回去',
    deepExplanation: 'Biểu thị sự vật hoặc con người dịch chuyển quay trở về vị trí gốc ban đầu. Hướng về phía người nói dùng 回来, hướng xa người nói dùng 回去.',
    collocations: [
      { zh: '寄回来', py: 'jì huílái', vi: 'gửi bưu điện ngược về đây' },
      { zh: '送回去', py: 'sòng huíqù', vi: 'mang trả ngược về chỗ cũ' },
      { zh: '跑回去', py: 'pǎo huíqù', vi: 'chạy ngược trở về' },
      { zh: '带回来', py: 'dài huílái', vi: 'mang quà từ phương xa về' }
    ],
    examples: [
      {
        zh: '哥哥这次从法国出差回来，特意给我们带回来了一盒精致的手工巧克力。',
        py: 'Gēge zhè cì cóng Fǎguó chūchāi huílái, tèyì gěi wǒmen dài huílái le yì hé jīngzhì de shǒugōng qiǎokèlì.',
        vi: 'Anh trai lần này đi công tác từ Pháp về, đặc ý mang về cho chúng tôi một hộp sô-cô-la thủ công tinh xảo.'
      }
    ],
    hskTraps: '💡 Trật tự từ nơi chốn: "回家去" (Đúng), "回去家" (Sai).',
    quiz: {
      question: 'Mượn sách thư viện đọc xong phải mang trả lại chỗ cũ, dùng cụm nào?',
      options: ['把书送回去 (bǎ shū sòng huíqù)', '把书送进去 (bǎ shū sòng jìnqù)', '把书送起来 (bǎ shū sòng qǐlai)', '把书送开来 (bǎ shū sòng kāilái)'],
      answer: 0,
      explain: 'Đem trả lại vị trí xuất phát ban đầu dùng 送回去.'
    }
  },
  {
    id: 'cmp_pot_zhao',
    name: 'Bổ ngữ khả năng: 得着 / 不着 (Chạm tới, đạt được mục đích)',
    type: 'potential',
    typeName: '3. Bổ Ngữ Khả Năng (可能补语)',
    marker: '得着 (dezháo) / 不着 (buzháo)',
    formula: 'V + 得着 / 不着',
    negationRule: 'V + 不着',
    deepExplanation: 'Chữ 着 ở đây phát âm là "zháo" (thanh 2). Biểu thị hành động có đạt được kết quả tiếp xúc hoặc mục đích hay không, đặc biệt trong ngủ nghỉ (睡不着), tìm kiếm (找不着), với tay (够不着).',
    collocations: [
      { zh: '睡得着 / 睡不着', py: 'shuìdezháo / shuìbuzháo', vi: 'ngủ được / trằn trọc mất ngủ' },
      { zh: '找得着 / 找不着', py: 'zhǎodezháo / zhǎobuzháo', vi: 'tìm thấy được / không thể tìm thấy' },
      { zh: '够得着 / 够不着', py: 'gòudezháo / gòubuzháo', vi: 'với tới được / không với tới được' }
    ],
    examples: [
      {
        zh: '明天就要公布高考录取成绩了，今晚他辗转反侧怎么也睡不着。',
        py: 'Míngtiān jiù yào gōngbù gāokǎo lùqǔ chéngjì le, jīnwǎn tā zhǎnzhuǎn-fǎncè zěnme yě shuìbuzháo.',
        vi: 'Ngày mai là công bố kết quả tuyển sinh đại học rồi, tối nay anh ấy trằn trọc băn khoăn làm sao cũng không ngủ được.'
      }
    ],
    hskTraps: '💡 Bẫy phát âm: "睡不着" chữ 着 đọc là "zháo" (thanh 2), TUYỆT ĐỐI KHÔNG đọc là "zhe".',
    quiz: {
      question: 'Kệ sách trên cao quá, đứa trẻ kiễng chân lên vẫn không với tới được, dùng:',
      options: ['够不着 (gòubuzháo)', '够不得 (gòubudé)', '够不开 (gòubukāi)', '够不完 (gòubuwán)'],
      answer: 0,
      explain: 'Vươn tay không với tới độ cao vật lý dùng 够不着.'
    }
  },
  {
    id: 'cmp_pot_tan',
    name: 'Bổ ngữ khả năng tính cách: 谈得来 / 谈不来 (Hợp cạ, tâm đầu ý hợp)',
    type: 'potential',
    typeName: '3. Bổ Ngữ Khả Năng (可能补语)',
    marker: '谈得来 (tándelái) / 谈不来 (tánbùlái)',
    formula: 'Người A 跟/和 Người B + 谈得来 / 谈不来',
    negationRule: '谈不来 (tánbùlái)',
    deepExplanation: 'Cụm bổ ngữ khả năng cố định biểu thị hai người có chung sở thích, quan điểm, nói chuyện hợp gu, tâm đầu ý hợp hay bất đồng quan điểm.',
    collocations: [
      { zh: '很谈得来', py: 'hěn tándelái', vi: 'rất hợp chuyện nhau' },
      { zh: '完全谈不来', py: 'wánquán tánbùlái', vi: 'hoàn toàn không hợp tính, nói chuyện lệch pha' },
      { zh: '合得来 / 合不来', py: 'hédelái / hébùlái', vi: 'hợp tính tình / khắc khẩu' }
    ],
    examples: [
      {
        zh: '虽然我们俩性格一内向一外向，但对中国古画的志趣却极为相投，非常谈得来。',
        py: 'Suīrán wǒmen liǎ xìnggé yí nèixiàng yí wàixiàng, dàn duì Zhōngguó gǔhuà de zhìqù què jíwéi xiāngtóu, fēicháng tándelái.',
        vi: 'Tuy tính cách hai chúng tôi một người hướng nội một người hướng ngoại, nhưng niềm say mê tranh cổ Trung Hoa lại cực kỳ tương đồng, nói chuyện vô cùng hợp cạ.'
      }
    ],
    hskTraps: '💡 Thành ngữ tương đồng: "志同道合" (chí đồng đạo hợp), "相见恨晚" (hận gặp nhau muộn).',
    quiz: {
      question: 'Muốn diễn đạt hai người bạn mới quen nhưng trò chuyện cực kỳ ăn ý, câu nào chuẩn nhất?',
      options: [
        '我和他一见如故，非常谈得来。(Đúng ngữ cảnh)',
        '我和他一见如故，非常谈得到。(Sai)',
        '我和他一见如故，非常谈得完。(Sai)',
        '我和他一见如故，非常谈得好。(Sai cấu trúc)'
      ],
      answer: 0,
      explain: 'Nói chuyện tâm đầu ý hợp, hợp gu trong tiếng Hán dùng 谈得来.'
    }
  },
  {
    id: 'cmp_deg_budeliao',
    name: 'Bổ ngữ trình độ khẩu ngữ: 不得了 / 要命 (Cực kỳ, đến phát khiếp)',
    type: 'state_degree',
    typeName: '4. Bổ Ngữ Trạng Thái & Trình Độ (状态与程度补语)',
    marker: '得不得了 (de bùdéliǎo) / 得要命 (de yàomìng)',
    formula: 'Tính từ + 得不得了 / 得要命',
    negationRule: 'Không dùng dạng phủ định',
    deepExplanation: 'Biểu đạt sắc thái cảm xúc cực kỳ mãnh liệt trong văn phong giao tiếp khẩu ngữ sinh động hàng ngày.',
    collocations: [
      { zh: '高兴得不得了', py: 'gāoxìng de bùdéliǎo', vi: 'vui mừng đến không thể tả xiết' },
      { zh: '热得不得了', py: 'rè de bùdéliǎo', vi: 'nóng khủng khiếp' },
      { zh: '疼得要命', py: 'téng de yàomìng', vi: 'đau chết đi được, đau điếng' },
      { zh: '累得要命', py: 'lèi de yàomìng', vi: 'mệt rã rời đến đứt hơi' }
    ],
    examples: [
      {
        zh: '得知自己的科研成果被国际权威期刊录用，小王激动得不得了。',
        py: 'Dézhī zìjǐ de kēyán chéngguǒ bèi guójì quánwēi qīkān lùyòng, Xiǎo Wáng jīdòng de bùdéliǎo.',
        vi: 'Hay tin thành quả nghiên cứu khoa học của mình được tạp chí uy tín quốc tế nhận đăng, Tiểu Vương kích động không sao tả xiết.'
      }
    ],
    hskTraps: '💡 Chú ý kết cấu: Sau tính từ bắt buộc phải có trợ từ "得", ví dụ: "高兴得不得了" (Đúng), "高兴不得了" (Thiếu 得).',
    quiz: {
      question: 'Chọn câu diễn đạt chuẩn xác:',
      options: [
        '这几天气温骤升，下午房间里闷热得不得了。(Đúng có trợ từ 得)',
        '这几天气温骤升，下午房间里闷热不得了。(Sai thiếu 得)',
        '这几天气温骤升，下午房间里很闷热得不得了。(Sai thừa 很)',
        '这几天气温骤升，下午房间里闷热的不得了。(Sai dùng chữ 的)'
      ],
      answer: 0,
      explain: 'Kết cấu chuẩn: Tính từ + 得不得了.'
    }
  },
  {
    id: 'cmp_qty_bi',
    name: 'Bổ ngữ số lượng trong câu so sánh chữ 比: A 比 B + Adj + Số lượng',
    type: 'duration_quantity',
    typeName: '5. Bổ Ngữ Thời Lượng & Số Lượng (时量与数量补语)',
    marker: 'A 比 B + Adj + Số lượng cụ thể',
    formula: 'Chủ ngữ A + 比 + Đối tượng B + Tính từ + Số từ + Lượng từ',
    negationRule: 'A 不比 B + Adj (Không hơn B là mấy) / A 没有 B 那么 + Adj',
    deepExplanation: 'Dùng để nêu ra mức chênh lệch số lượng cụ thể và chính xác giữa hai đối tượng được so sánh.',
    collocations: [
      { zh: '大三岁', py: 'dà sān suì', vi: 'lớn hơn 3 tuổi' },
      { zh: '贵五十块钱', py: 'guì wǔshí kuài qián', vi: 'đắt hơn 50 tệ' },
      { zh: '快五分钟', py: 'kuài wǔ fēnzhōng', vi: 'nhanh hơn 5 phút' },
      { zh: '高十厘米', py: 'gāo shí límǐ', vi: 'cao hơn 10 xăng-ti-mét' }
    ],
    examples: [
      {
        zh: '这台最新型号的高性能笔记本电脑比旧款整整便宜了八百块钱。',
        py: 'Zhè tái zuìxīn xínghào de gāoxìngnéng bǐjìběn diànnǎo bǐ jiùkuǎn zhěngzhěng piányi le bābǎi kuài qián.',
        vi: 'Chiếc máy tính xách tay hiệu năng cao mẫu mã mới nhất này rẻ hơn mẫu cũ tròn tám trăm tệ.'
      }
    ],
    hskTraps: '💡 TRẬT TỰ TỪ CỰC DỄ SAI: Người Việt quen nói "đắt hơn 50 tệ" nên hay xếp nhầm thành "比旧款多五十块" hoặc "比旧款贵". Trật tự chuẩn tiếng Trung BẮT BUỘC: Tính từ + Số lượng (便宜了八百块 / 大三岁).',
    quiz: {
      question: 'Dịch câu "Anh ấy lớn hơn tôi 3 tuổi" sang tiếng Trung chuẩn:',
      options: [
        '他比我大三岁。(Đúng chuẩn ngữ pháp)',
        '他比我三岁大。(Sai trật tự)',
        '他大我三岁比。(Sai cấu trúc)',
        '他比我大多三岁。(Sai thừa 多)'
      ],
      answer: 0,
      explain: 'Cấu trúc so sánh chênh lệch cụ thể: A + 比 + B + Tính từ (大) + Số lượng (三岁).'
    }
  },
  {
    id: 'cmp_act_xia_chang_fan',
    name: 'Bổ ngữ động lượng: 下 (Cái nhẹ), 场 (Trận kịch liệt), 番 (Lượt tâm huyết)',
    type: 'action_measure',
    typeName: '6. Bổ Ngữ Động Lượng (动量补语)',
    marker: '下 (xià) / 场 (chǎng) / 番 (fān)',
    formula: 'V + 了 + 一下 / 一场 / 一番',
    negationRule: '没 + V',
    deepExplanation: '下 biểu thị động tác ngắn, nhẹ, thử nghiệm; 场 dùng cho sự kiện, hiện tượng kịch tính (trận mưa, trận ốm, cuộc đấu); 番 biểu thị hành động cần nhiều công sức, suy nghĩ, tâm huyết lâu dài.',
    collocations: [
      { zh: '敲了几下门', py: 'qiāo le jǐ xià mén', vi: 'gõ cửa vài tiếng nhẹ' },
      { zh: '下了一场大雨', py: 'xià le yì chǎng dàyǔ', vi: 'đổ một trận mưa rào' },
      { zh: '大病了一场', py: 'dàbìng le yì chǎng', vi: 'trải qua một trận ốm thập tử nhất sinh' },
      { zh: '思考了一番', py: 'sīkǎo le yì fān', vi: 'suy nghĩ đắn đo kỹ lưỡng một hồi' },
      { zh: '费了一番心血', py: 'fèi le yì fān xīnxuè', vi: 'tốn biết bao tâm huyết' }
    ],
    examples: [
      {
        zh: '经过全队科研人员历时三年的艰苦奋斗与不懈攻关，终于费了一番心血取得了突破。',
        py: 'Jīngguò quánduì kēyán rényuán lìshí sān nián de jiānkǔ fèndòu yǔ búxiè gōngguān, zhōngyú fèi le yì fān xīnxuè qǔdé le tūtò.',
        vi: 'Trải qua ba năm ròng rã phấn đấu gian khổ của toàn đội ngũ nghiên cứu, cuối cùng đã tốn một phen tâm huyết đạt được đột phá.'
      }
    ],
    hskTraps: '💡 Cụm cố định HSK 5-6: "费了一番功夫", "思考了一番", "较量了一场".',
    quiz: {
      question: 'Điền lượng từ biểu thị sự đầu tư tâm huyết, suy tính kỹ lưỡng:',
      options: ['经过一番深思熟虑 (fān - Đúng)', '经过一下深思熟虑 (Sai)', '经过一趟深思熟虑 (Sai)', '经过一顿深思熟虑 (Sai)'],
      answer: 0,
      explain: 'Suy nghĩ đắn đo kỹ lưỡng, tốn công sức tâm trí dùng 一番.'
    }
  },
  {
    id: 'cmp_prep_dao_shijian',
    name: 'Bổ ngữ giới từ thời gian: V + 到 + Mốc thời gian (Kéo dài đến tận khi)',
    type: 'prepositional',
    typeName: '7. Bổ Ngữ Giới Từ (介词补语)',
    marker: 'V + 到 + Mốc thời gian',
    formula: 'Động từ + 到 + Mốc thời gian / Độ tuổi',
    negationRule: '没 + V + 到',
    deepExplanation: 'Biểu thị hành động hoặc trạng thái duy trì kéo dài liên tục cho tới một thời điểm hoặc độ tuổi nhất định.',
    collocations: [
      { zh: '睡到中午', py: 'shuì dào zhōngwǔ', vi: 'ngủ đến tận trưa' },
      { zh: '忙到深夜', py: 'máng dào shēnyè', vi: 'bận rộn đến tận đêm muộn' },
      { zh: '学到老', py: 'xué dào lǎo', vi: 'học đến già (活到老，学到老)' },
      { zh: '工作到六十岁', py: 'gōngzuò dào liùshí suì', vi: 'làm việc đến năm sáu mươi tuổi' }
    ],
    examples: [
      {
        zh: '中国有句家喻户晓的至理名言："活到老，学到老"，勉励人们终身学习。',
        py: 'Zhōngguó yǒu jù jiāyù-hùxiǎo de zhìlǐ-míngyán: "Huó dào lǎo, xué dào lǎo", miǎnlì rénmen zhōngshēn xuéxí.',
        vi: 'Trung Quốc có câu danh ngôn thấu lý nổi tiếng khắp hang cùng ngõ hẻm: "Sống đến già, học đến già", khích lệ con người học tập suốt đời.'
      }
    ],
    hskTraps: '💡 Phân biệt: "学到老" (Bổ ngữ thời gian: học đến già) khác với "学到很多知识" (Bổ ngữ kết quả: tiếp thu được nhiều tri thức).',
    quiz: {
      question: 'Châm ngôn khuyến học nổi tiếng của Trung Quốc biểu thị học tập suốt đời là:',
      options: ['活到老，学到老 (Đúng)', '活完老，学完老 (Sai)', '活好老，学好老 (Sai)', '活懂老，学懂老 (Sai)'],
      answer: 0,
      explain: 'Duy trì sự sống và học tập tới tuổi già dùng bổ ngữ giới từ 到: 活到老，学到老.'
    }
  }
];

// Append and save
const existingIds = new Set(currentList.map(x => x.id));
ADDITIONAL_COMPLEMENTS.forEach(item => {
  if (!existingIds.has(item.id)) {
    currentList.push(item);
  }
});

fs.writeFileSync(filePath, JSON.stringify(currentList, null, 2), 'utf8');
console.log(`✓ Đã cập nhật Bách khoa Bổ Ngữ Tiếng Hán: Tổng cộng ${currentList.length} chuyên đề bổ ngữ.`);
