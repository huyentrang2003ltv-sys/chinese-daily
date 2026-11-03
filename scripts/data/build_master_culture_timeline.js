const { dataFile } = require('./paths');
const fs = require('fs');
const path = require('path');

const cultureData = [
  // 1. THỜI THƯỢNG CỔ & THẦN THOẠI
  {
    id: "era_1_ancient_mythology",
    order: 1,
    period: "Khoảng 3000 TCN – 2070 TCN",
    eraName: "Thượng Cổ & Tam Hoàng Ngũ Đế",
    category: "ancient",
    categoryName: "Thượng Cổ & Thần Thoại",
    categoryColor: "amber",
    badge: "Khởi Nguồn Văn Minh",
    title: "Thời Thượng Cổ (上古时代) - Khởi Nguyên Viêm Hoàng & Thần Thoại",
    pinyin: "Shànggǔ Shídài (Tam Hoàng Ngũ Đế)",
    summary: "Thời kỳ bình minh của nền văn minh Trung Hoa, gắn liền với các truyền thuyết Tam Hoàng Ngũ Đế, Thần Nông nếm trăm cây cỏ, Toại Nhân lấy lửa, Hoàng Đế dựng nước và sự hình thành khái niệm 'Viêm Hoàng tử tôn' (con cháu Viêm Hoàng).",
    cultureEmergence: [
      "Khởi nguyên nông nghiệp: Thần Nông (神农) dạy dân cày cấy, phân biệt các loài ngũ cốc và nếm thảo mộc làm thuốc, khai sinh nền nông nghiệp và Đông y sơ khai.",
      "Chữ viết manh nha: Truyền thuyết Thương Hiệt (仓颉) quan sát dấu chân chim thú trên cát để sáng tạo ra chữ viết tượng hình sơ khai.",
      "Kỹ thuật dệt tơ lụa: Luy Tổ (嫘祖 - chính thê Hoàng Đế) dạy phụ nữ nuôi tằm, kéo kén ươm tơ và dệt lụa, mở ra truyền thống văn hóa tơ lụa trứ danh.",
      "Gốm cổ Ngưỡng Thiều & Long Sơn: Chế tác đồ gốm hoa văn màu đen và đỏ với các biểu tượng chạm khắc hình học và linh thú đầu tiên."
    ],
    customsEmergence: [
      "Sùng bái Rồng và Phượng (Long Phụng đồ đằng - 龙凤图腾): Hợp nhất các thị tộc lấy hình tượng Rồng (chân rồng, mình rắn, vảy cá) làm linh vật biểu trưng cho sức mạnh đất trời.",
      "Tế lễ Đất Trời & Thần Linh: Tổ chức nghi lễ kính tạ thiên địa vào các thời điểm chuyển mùa, đặt nền tảng cho tín ngưỡng bái tế tổ tiên của người Á Đông.",
      "Chế độ Thiện Nhượng (禅让制): Phong tục nhường ngôi cho người hiền tài đức độ (Nghiêu nhường ngôi cho Thuấn, Thuấn nhường ngôi cho Đại Vũ) thay vì cha truyền con nối."
    ],
    warsAndBattles: [
      {
        name: "Trận Trác Lộc (涿鹿之战)",
        hanzi: "涿鹿之战",
        pinyin: "Zhuōlù zhī Zhàn",
        year: "Khoảng 2600 TCN",
        combatants: "Liên minh Hoàng Đế & Viêm Đế vs Bộ tộc Cửu Lê của Xi Vưu (蚩尤)",
        description: "Trận chiến sử thi huyền thoại tại vùng đồng bằng Trác Lộc. Xi Vưu hô mưa gọi gió tạo sương mù dày đặc làm mê hoặc quân sĩ; Hoàng Đế phát minh ra 'Xe chỉ nam' (指南车) định hướng tiến công, đánh bại Xi Vưu.",
        significance: "Định hình sự liên hiệp vĩ đại của các bộ lạc Trung Nguyên, lập nên nền móng đầu tiên của dân tộc Hoa Hạ."
      },
      {
        name: "Trận Bản Tuyền (阪泉之战)",
        hanzi: "阪泉之战",
        pinyin: "Bǎnquán zhī Zhàn",
        year: "Khoảng 2650 TCN",
        combatants: "Bộ lạc Hoàng Đế vs Bộ lạc Viêm Đế",
        description: "Cuộc giao tranh giữa hai tập đoàn bộ lạc lớn nhất Trung Nguyên sau 3 trận huyết chiến tại Bản Tuyền, Viêm Đế quy phục Hoàng Đế.",
        significance: "Sáp nhập hai lực lượng lớn nhất thời thượng cổ, khai sinh danh xưng 'Viêm Hoàng Tử Tôn' (炎黄子孙)."
      }
    ],
    keywords: [
      { hanzi: "炎黄子孙", pinyin: "Yánhuáng zǐsūn", meaning: "Con cháu Viêm Hoàng" },
      { hanzi: "神农尝百草", pinyin: "Shénnóng cháng bǎicǎo", meaning: "Thần Nông nếm trăm cây cỏ" },
      { hanzi: "仓颉造字", pinyin: "Cāngjié zàozì", meaning: "Thương Hiệt sáng tạo chữ viết" },
      { hanzi: "涿鹿之战", pinyin: "Zhuōlù zhī zhàn", meaning: "Trận chiến Trác Lộc" }
    ],
    quote: {
      hanzi: "生而神灵，弱而能言，幼而徇齐，长而敦敏，成而聪明。",
      pinyin: "Shēng ér shénlíng, ruò ér néng yán, yòu ér xùnqí, zhǎng ér dūnmǐn, chéng ér cōngmíng.",
      meaning: "Sinh ra đã thông linh, lúc nhỏ biết nói sớm, niên thiếu nhanh nhẹn, lớn lên đôn hậu cần mẫn, trưởng thành trí tuệ uyên bác (Sử Ký miêu tả Hoàng Đế)."
    }
  },

  // 2. NHÀ HẠ & NHÀ THƯƠNG
  {
    id: "era_2_xia_shang",
    order: 2,
    period: "Khoảng 2070 TCN – 1046 TCN",
    eraName: "Nhà Hạ & Nhà Thương",
    category: "bronze_age",
    categoryName: "Kỷ Nguyên Đồ Đồng",
    categoryColor: "rose",
    badge: "Chữ Viết & Đồ Đồng",
    title: "Thời Hạ - Thương (夏商) - Giáp Cốt Văn & Đỉnh Đồng Cổ",
    pinyin: "Xià Shāng Shídài (Đồ Đồng & Giáp Cốt)",
    summary: "Đại Vũ trị thủy lập nên triều Hạ - nhà nước phong kiến quân chủ đầu tiên. Kế tiếp là nhà Thương với đỉnh cao nghệ thuật đúc đồng tinh xảo và hệ thống Giáp Cốt Văn khắc trên mai rùa xương thú khai sinh lịch sử thành văn của Trung Hoa.",
    cultureEmergence: [
      "Giáp Cốt Văn (甲骨文): Hệ thống chữ khắc trên mai rùa và xương bả vai động vật tại Ân Khư (Ân Thương), là chứng tích chữ viết cổ hoàn chỉnh nhất có niên đại hơn 3.300 năm.",
      "Kỷ nguyên Đồ Đồng (Thanh Đồng Khí - 青铜器): Đúc các bảo vật tế khí khổng lồ như Đỉnh Hậu Mẫu Mậu (后母戊鼎) nặng 832 kg, Tứ Dương Phương Tôn chạm trổ tinh xảo tuyệt mỹ.",
      "Lịch pháp Ân Lịch (殷历): Xác lập hệ đếm can chi (Thiên Can Địa Chi) và chu kỳ tuần hoàn ngày tháng theo chu kỳ mặt trăng phục vụ nông nghiệp."
    ],
    customsEmergence: [
      "Chiêm Bặc (占卜 - Bói toán mai rùa): Trước bất kỳ việc lớn như xuất quân, cầu mưa, săn bắn hay cưới hỏi, hoàng gia đều đốt mai rùa xem vết nứt để luận đoán điềm cát hung.",
      "Lễ Nghi Tế Rượu (Tước ân - 爵): Xuất hiện chén rượu đồng có 3 chân nhọn và 2 cột nâng, hình thành quy tắc rót rượu tế thần linh trước rồi mới mời người lớn tuổi uống sau.",
      "Tục Tuẫn Táng (殉葬): Tập tục chôn cất nô lệ, người hầu và chiến mã cùng quý tộc vua chúa khi qua đời để phục vụ ở thế giới bên kia."
    ],
    warsAndBattles: [
      {
        name: "Trận Minh Điều (鸣条之战)",
        hanzi: "鸣条之战",
        pinyin: "Míngtiáo zhī Zhàn",
        year: "Khoảng 1600 TCN",
        combatants: "Thương Thang (商汤) vs Bạo chúa Hạ Kiệt (夏桀)",
        description: "Hạ Kiệt tàn bạo dâm loạn khiến lòng dân oán hán; Thương Thang liên kết chư hầu nhân lúc sấm chớp mưa bão tấn công dồn dập tại Minh Điều, đánh bại quân Hạ, Kiệt bị lưu đày và chết ở Nam Sào.",
        significance: "Chấm dứt triều Hạ, khai sáng triều Thương, mở ra nguyên tắc 'Cách Mạng': thuận theo mệnh trời hợp lòng dân."
      },
      {
        name: "Trận Mục Dã (牧野之战)",
        hanzi: "牧野之战",
        pinyin: "Mùyě zhī Zhàn",
        year: "1046 TCN",
        combatants: "Chu Vũ Vương & Khương Tử Nha vs Thương Trụ Vương",
        description: "Lợi dụng chủ lực quân Thương đang viễn chinh phương Nam, Chu Vũ Vương dẫn 4 vạn quân tinh nhuệ thần tốc tiến đánh Mục Dã (ngoại vi kinh đô Triều Ca). Nô lệ quân Thương quay giáo khởi nghĩa, Trụ Vương đại bại chạy lên Lộc Đài tự thiêu.",
        significance: "Lật đổ hoàn toàn nhà Thương, khai sáng triều đại nhà Chu kéo dài gần 800 năm."
      }
    ],
    keywords: [
      { hanzi: "甲骨文", pinyin: "Jiǎgǔwén", meaning: "Chữ giáp cốt (chữ khắc mai rùa)" },
      { hanzi: "青铜鼎", pinyin: "Qīngtóng dǐng", meaning: "Đỉnh đồng thanh đồng" },
      { hanzi: "大禹治水", pinyin: "Dàyǔ zhìshuǐ", meaning: "Đại Vũ trị thủy" },
      { hanzi: "牧野之战", pinyin: "Mùyě zhī zhàn", meaning: "Trận đánh Mục Dã" }
    ],
    quote: {
      hanzi: "天命玄鸟，降而生商，宅殷土芒芒。",
      pinyin: "Tiānmìng xuánniǎo, jiàng ér shēng Shāng, zhái Yīn tǔ mángmáng.",
      meaning: "Mệnh trời sai chim én huyền điểu giáng trần sinh ra tổ tiên nhà Thương, định cư mở mang bờ cõi đất Ân bao la (Kinh Thi - Thương Tụng)."
    }
  },

  // 3. THỜI TÂY CHU & ĐÔNG CHU (XUÂN THU - CHIẾN QUỐC)
  {
    id: "era_3_zhou_spring_autumn",
    order: 3,
    period: "1046 TCN – 221 TCN",
    eraName: "Thời Chu & Xuân Thu - Chiến Quốc",
    category: "philosophies",
    categoryName: "Bách Gia Tranh Minh",
    categoryColor: "purple",
    badge: "Thời Kỳ Hoàng Kim Triết Học",
    title: "Nhà Chu & Xuân Thu Chiến Quốc - Bách Gia Chư Tử & Lễ Nhạc",
    pinyin: "Zhōu Cháo & Chūnqiū Zhànguó",
    summary: "Thời kỳ rực rỡ nhất về tư tưởng với 'Bách Gia Chư Tử' (Khổng Tử, Lão Tử, Tôn Tử, Trang Tử, Mặc Tử, Hàn Phi). Đan xen giữa nền văn minh Lễ Nhạc thanh cao là sự tan rã của trật tự phong kiến cũ và những cuộc đại chiến tranh bá xưng hùng khốc liệt.",
    cultureEmergence: [
      "Bách Gia Tranh Minh (百家争鸣): Nho gia (Khổng Tử - Nhân Lễ), Đạo gia (Lão Tử - Vô vi tự nhiên), Pháp gia (Hàn Phi - Pháp thuật thế), Binh gia (Tôn Vũ - Binh pháp Tôn Tử), Mặc gia (Mặc Tử - Kiêm ái phi công).",
      "Kinh Thi & Sở Từ: Hai đỉnh cao thi ca khai sáng văn học phương Bắc (thực tế, bình dị) và phương Nam (lãng mạn, bay bổng của Khuất Nguyên).",
      "Âm nhạc Biên Chung (编钟): Nhạc cụ dàn chuông đồng Tăng Hầu Ất với thang âm 12 bán âm hoàn chỉnh đạt trình độ luyện kim và âm học đỉnh cao thế giới."
    ],
    customsEmergence: [
      "Tết Hàn Thực & Tết Đoan Ngọ (端午节): Tục kiêng lửa ăn đồ nguội tưởng nhớ hiền sĩ Giới Tử Thôi; tục đua thuyền rồng và gói bánh ú nếp (粽子) tưởng niệm đại thi hào Khuất Nguyên gieo mình xuống sông Mịch La.",
      "Quán Lễ & Ti Lễ: Lễ đội mũ thành niên lúc 20 tuổi đối với nam giới và cài trâm lúc 15 tuổi đối với nữ giới, đánh dấu trách nhiệm với gia đình và xã hội.",
      "Chu Lễ (周礼): Quy định nghiêm ngặt về thứ bậc phụ tử, huynh đệ, tôn ti trật tự trên bàn ăn, xưng hô và lễ nghi cưới hỏi (Tam thư lục lễ)."
    ],
    warsAndBattles: [
      {
        name: "Trận Thành Bộc (城濮之战)",
        hanzi: "城濮之战",
        pinyin: "Chéngpú zhī Zhàn",
        year: "632 TCN",
        combatants: "Nước Tấn (Tấn Văn Công) vs Nước Sở (Thành Đắc Thần)",
        description: "Thực hiện lời hứa năm xưa khi lưu vong, Tấn Văn Công chủ động lui quân 90 dặm ('Thoái tam xá' - 退避三舍), nhử tướng Sở kiêu ngạo vào bẫy mai phục, đánh tan quân Sở.",
        significance: "Thiết lập quyền bá chủ Trung Nguyên của nước Tấn, điển hình cho nghệ thuật dụ địch lui binh trong quân sự cổ đại."
      },
      {
        name: "Trận Quế Lăng & Mã Lăng (桂陵与马陵之战)",
        hanzi: "桂陵之战 / 马陵之战",
        pinyin: "Guìlíng & Mǎlíng zhī Zhàn",
        year: "354 & 342 TCN",
        combatants: "Quân Điền Kỵ, Tôn Tẫn (Tề) vs Bàng Quyên (Ngụy)",
        description: "Tôn Tẫn sáng tạo kế sách 'Vây Ngụy cứu Triệu' (围魏救赵) đánh vào kinh đô Đại Lương khi quân Ngụy đang vây Triệu; sau đó dùng kế 'Bớt bếp nhử địch' khiến Bàng Quyên tự sát dưới gốc cây khắc chữ ở hẻm Mã Lăng.",
        significance: "Chấm dứt vị thế bá chủ của quân đội nước Ngụy, đưa nước Tề vươn lên thành cường quốc miền đông."
      },
      {
        name: "Trận Trường Bình (长平之战)",
        hanzi: "长平之战",
        pinyin: "Chángpíng zhī Zhàn",
        year: "260 TCN",
        combatants: "Tần (Bạch Khởi) vs Triệu (Triệu Quát)",
        description: "Nước Triệu thay tướng Liêm Pha bằng Triệu Quát chỉ biết 'Bàn việc quân trên giấy' (纸上谈兵). Chiến thần Bạch Khởi vờ thua dụ quân Triệu vào thung lũng rồi cắt đứt đường lương thảo. Sau 46 ngày bị bao vây, 40 vạn quân Triệu đầu hàng và bị chôn sống tập thể.",
        significance: "Trận chiến tiêu hao thảm khốc nhất thời Chiến Quốc, xóa sổ hoàn toàn lực lượng quân sự nước Triệu, dọn đường cho nhà Tần thống nhất thiên hạ."
      }
    ],
    keywords: [
      { hanzi: "百家争鸣", pinyin: "Bǎijiā zhēngmíng", meaning: "Trăm nhà đua tiếng (thời kỳ triết học)" },
      { hanzi: "孔孟之道", pinyin: "Kǒng Mèng zhī dào", meaning: "Đạo Khổng Mạnh (Nho giáo)" },
      { hanzi: "围魏救赵", pinyin: "Wéi Wèi jiù Zhào", meaning: "Vây Ngụy cứu Triệu" },
      { hanzi: "纸上谈兵", pinyin: "Zhǐshàng tánbīng", meaning: "Bàn việc quân trên giấy (Triệu Quát)" }
    ],
    quote: {
      hanzi: "知己知彼，百战不殆；不知彼而知己，一胜一负；不知彼不知己，每战必殆。",
      pinyin: "Zhī jǐ zhī bǐ, bǎi zhàn bù dài; bù zhī bǐ ér zhī jǐ, yí shèng yí fù; bù zhī bǐ bù zhī jǐ, měi zhàn bì dài.",
      meaning: "Biết người biết ta, trăm trận không nguy; biết ta mà không biết người, một thắng một bại; không biết người cũng không biết ta, đánh trận nào nguy trận đó (Tôn Tử Binh Pháp)."
    }
  },

  // 4. NHÀ TẦN
  {
    id: "era_4_qin",
    order: 4,
    period: "221 TCN – 206 TCN",
    eraName: "Đế Chế Nhà Tần",
    category: "imperial_unification",
    categoryName: "Thống Nhất Trung Hoa",
    categoryColor: "rose",
    badge: "Đế Chế Phong Kiến Đầu Tiên",
    title: "Nhà Tần (秦朝) - Vạn Lý Trường Thành & Thống Nhất Văn Tự",
    pinyin: "Qín Cháo (Thống Nhất Văn Tự & Pháp Luật)",
    summary: "Tần Thủy Hoàng Doanh Chính tiêu diệt 6 nước chư hầu, lần đầu tiên quy giang sơn về một mối. Ông thiết lập chế độ Hoàng đế chuyên chế, chuẩn hóa chữ viết Tiểu Triện, đồng nhất tiền tệ và xây đắp Vạn Lý Trường Thành kỳ vĩ.",
    cultureEmergence: [
      "Thư Đồng Văn (书同文): Chuẩn hóa toàn bộ hệ thống chữ viết phức tạp của 6 nước thành kiểu chữ Tiểu Triện (小篆) trang nhã do Thừa tướng Lý Tư khởi xướng, đặt nền tảng thống nhất ngôn ngữ cho cả dân tộc.",
      "Xa Đồng Quỹ & Thống Nhất Độ Lượng Hành: Quy định khoảng cách trục bánh xe cùng một kích cỡ để xe cộ chạy thông suốt; thống nhất đơn vị cân, đo lường, đong đếm và tiền tệ (tiền đồng tròn lỗ vuông Bán Lạng).",
      "Vạn Lý Trường Thành & Binh Mã Dũng: Nối liền và xây dựng hơn vạn dặm trường thành ngăn chặn giặc Hung Nô; lăng mộ ngầm tại Tây An với hàng ngàn pho tượng binh mã đất nung kích thước như người thật."
    ],
    customsEmergence: [
      "Xưng hô Hoàng Đế & Trẫm (朕): Bắt đầu từ Tần Thủy Hoàng, người đứng đầu quốc gia mang tước vị Hoàng Đế, từ 'Trẫm' trở thành đại từ nhân xưng độc quyền của bậc đế vương.",
      "Chế độ Hộ Khẩu & Bảo Giáp: Đăng ký chặt chẽ nhân khẩu từng hộ gia đình, liên đới chịu trách nhiệm trước pháp luật, xóa bỏ quyền lực cát cứ của các quý tộc thị tộc.",
      "Trang phục Hắc sắc (Màu Đen Thượng Tôn): Theo thuyết Ngũ Hành, nhà Tần thuộc Thủy đức (màu đen), toàn bộ quan phục, cờ xí triều đình đều lấy sắc đen làm tông màu chủ đạo trang nghiêm."
    ],
    warsAndBattles: [
      {
        name: "Chiến Tranh Thống Nhất Lục Quốc (秦灭六国之战)",
        hanzi: "秦灭六国之战",
        pinyin: "Qín miè liùguó zhī zhàn",
        year: "230 TCN – 221 TCN",
        combatants: "Quân Tần (Vương Tiễn, Vương Bí, Mông Điềm) vs 6 nước (Hàn, Triệu, Ngụy, Sở, Yên, Tề)",
        description: "Áp dụng chiến lược 'Viễn giao cận công' (thân thiện nước xa, đánh chiếm nước gần) của Phạm Thư. Trong vòng 10 năm, quân Tần dũng mãnh lần lượt san phẳng cả 6 chư hầu lớn.",
        significance: "Chấm dứt thời kỳ phân liệt Chiến Quốc đẫm máu kéo dài hàng trăm năm, khai sinh đế chế phong kiến tập quyền đầu tiên của Trung Quốc."
      },
      {
        name: "Khởi Nghĩa Trần Thắng - Ngô Quảng (陈胜吴广起义)",
        hanzi: "大泽乡起义",
        pinyin: "Dàzéxiāng Qǐyì",
        year: "209 TCN",
        combatants: "Nghĩa quân nông dân Đại Trạch Hương vs Triều đình nhà Tần",
        description: "900 dân phu bị bắt đi lính thú gặp mưa lũ trễ hạn, theo luật Tần phải chịu chém đầu. Trần Thắng và Ngô Quảng chém tướng cầm đầu khởi nghĩa tại Đại Trạch Hương với tiếng hô chấn động: 'Vương hầu tướng tướng há có giống sẵn sao?' (王侯将相宁有种乎).",
        significance: "Cuộc khởi nghĩa nông dân quy mô lớn đầu tiên trong lịch sử Trung Hoa, châm ngòi cho làn sóng khởi nghĩa lật đổ bạo Tần."
      },
      {
        name: "Trận Cự Lộc (巨鹿之战)",
        hanzi: "巨鹿之战",
        pinyin: "Jùlù zhī Zhàn",
        year: "207 TCN",
        combatants: "Nghĩa quân Hạng Vũ vs Đại quân Tần (Chương Hàm, Vương Ly)",
        description: "Hạng Vũ dẫn 5 vạn quân Sở vượt sông Hoàng Hà giải vây cho Cự Lộc. Qua sông xong, Hạng Vũ ra lệnh đập vỡ toàn bộ nồi nấu cơm, đục chìm hết thuyền bè ('Phá phủ trầm chu' - 破釜沉舟), mỗi người chỉ mang lương thực 3 ngày để liều chết xông lên, đánh tan 20 vạn tinh binh Tần.",
        significance: "Trận quyết chiến bẻ gãy hoàn toàn lực lượng quân sự chủ lực của nhà Tần, khiến đế chế Tần sụp đổ sau 15 năm tồn tại."
      }
    ],
    keywords: [
      { hanzi: "秦始皇", pinyin: "Qín Shǐhuáng", meaning: "Tần Thủy Hoàng" },
      { hanzi: "书同文车同轨", pinyin: "Shū tóng wén, chē tóng guǐ", meaning: "Cùng thứ chữ, cùng khổ xe" },
      { hanzi: "兵马俑", pinyin: "Bīngmǎyǒng", meaning: "Tượng Binh Mã Dũng" },
      { hanzi: "破釜沉舟", pinyin: "Pòfǔ chénzhōu", meaning: "Đập nồi dìm thuyền (quyết tử)" }
    ],
    quote: {
      hanzi: "王侯将相，宁有种乎？",
      pinyin: "Wáng hòu jiàng xiāng, nìng yǒu zhǒng hū?",
      meaning: "Bậc vương hầu, tướng soái hay tể tướng, há phải có giống dòng sẵn hay sao? (Trần Thắng - Khởi nghĩa Đại Trạch Hương)."
    }
  },

  // 5. NHÀ TÂY HÁN & ĐÔNG HÁN
  {
    id: "era_5_han",
    order: 5,
    period: "202 TCN – 220 SCN",
    eraName: "Nhà Hán (Tây Hán & Đông Hán)",
    category: "golden_age",
    categoryName: "Định Danh Dân Tộc Hán",
    categoryColor: "emerald",
    badge: "Con Đường Tơ Lụa & Giấy Viết",
    title: "Đại Hán Triều (汉朝) - Con Đường Tơ Lụa & Giấy Thái Hầu",
    pinyin: "Hàn Cháo (Tây Hán 202 TCN – 8 SCN & Đông Hán 25 – 220 SCN)",
    summary: "Triều đại huy hoàng định danh cho chữ Hán, tiếng Hán và người Hán tộc. Thời kỳ mở ra Con Đường Tơ Lụa vươn tới Tây Vực, phát minh ra kỹ thuật làm giấy của Thái Luân, đỉnh cao sử học với pho 'Sử Ký' của Tư Mã Thiên.",
    cultureEmergence: [
      "Khai thông Con Đường Tơ Lụa (丝绸之路): Trương Khiêm (张骞) phụng mệnh Hán Vũ Đế vượt muôn ngàn hiểm nguy khai phá tuyến thương mại huyết mạch nối liền Trường An với Trung Á, La Mã, truyền bá lụa, gốm sứ và du nhập nho, hồ đào, đàn tỳ bà.",
      "Kỹ thuật làm giấy Thái Hầu (蔡伦造纸术): Thái Luân thời Đông Hán cải tiến vỏ cây, giẻ rách, lưới đánh cá thành giấy viết nhẹ bền, mở ra cuộc cách mạng truyền bá tri thức vĩ đại của nhân loại.",
      "Độc Tôn Nho Thuật: Hán Vũ Đế chấp thuận kiến nghị của Đổng Trọng Thư, bãi bỏ bách gia lấy Nho học làm hệ tư tưởng chính thống của quốc gia.",
      "Tuyệt tác Sử Ký (史记): Tư Mã Thiên vượt qua nhục hình, hoàn thành bộ sử học đầu tiên theo thể kỷ truyện, được Lỗ Tấn ngợi ca là 'Khúc tuyệt xướng của sử gia, khúc Ly Tao không vần'."
    ],
    customsEmergence: [
      "Định hình Lễ Hội Truyền Thống: Các tiết lễ lớn như Tết Nguyên Đán (đầu năm mới), Tết Nguyên Tiêu (đốt đèn hoa đăng rằm tháng giêng), Tiết Thanh Minh (tảo mộ mùa xuân) chính thức đi vào phong tục dân tộc.",
      "Tập tục Hán Phục (汉服): Trang phục áo giao lĩnh vạt chéo bên phải (Hữu nhậm), dải lụa thắt lưng buông rủ thanh nhã, tay áo rộng biểu thị cốt cách khoáng đạt.",
      "Phật Giáo truyền vào Trung Hoa: Hán Minh Đế nằm mộng thấy người vàng, sai sứ rước tượng Phật và kinh thư, xây dựng ngôi chùa Phật giáo đầu tiên - Chùa Bạch Mã (白马寺) tại Lạc Dương."
    ],
    warsAndBattles: [
      {
        name: "Hán Sở Tranh Hùng & Trận Cai Hạ (垓下之战)",
        hanzi: "垓下之战",
        pinyin: "Gāixià zhī Zhàn",
        year: "202 TCN",
        combatants: "Lưu Bang & Hàn Tín (Hán) vs Tây Sở Bá Vương Hạng Vũ",
        description: "Hàn Tín bày trận 'Thập diện mai phục' (十面埋伏) siết chặt vòng vây quân Sở tại Cai Hạ. Đêm khuya bốn bề vang lên khúc ca quê hương Sở ('Tứ diện Sở ca' - 四面楚歌) làm tiêu tan sĩ khí quân Sở. Hạng Vũ từ biệt nàng Ngu Cơ ('Bá Vương biệt Cơ') rồi phá vây tự vẫn bên bờ sông Ô Giang.",
        significance: "Lưu Bang thống nhất toàn bộ đất nước, khai sáng triều đại nhà Hán phồn vinh kéo dài hơn 400 năm."
      },
      {
        name: "Đại Chiến Hán - Hung Nô (汉匈战争)",
        hanzi: "汉击匈奴之战",
        pinyin: "Hàn jī Xiōngnú zhī zhàn",
        year: "133 TCN – 119 TCN",
        combatants: "Đại tướng Vệ Thanh & Hoắc Khứ Bệnh vs Thiền Vu Hung Nô",
        description: "Sau nhiều năm chịu nhục hòa thân, Hán Vũ Đế lệnh cho hai thiên tài quân sự Vệ Thanh và Hoắc Khứ Bệnh chỉ huy các đạo kỵ binh thọc sâu vào sa mạc Gobi. Hoắc Khứ Bệnh ở tuổi đôi mươi lập kỳ tích tế lễ trời đất trên đỉnh Lang Cư Tư ('Phong lang cư tư' - 封狼居胥).",
        significance: "Đập tan mối đe dọa thường trực của người Hung Nô từ phương bắc, giành quyền kiểm soát hành lang Hà Tây, mở đường thông thương sang phương Tây."
      },
      {
        name: "Trận Côn Dương (昆阳之战)",
        hanzi: "昆阳之战",
        pinyin: "Kūnyáng zhī Zhàn",
        year: "23 SCN",
        combatants: "Nghĩa quân Lưu Tú (Hán Quang Vũ Đế) vs Đại quân Tân Triều Vương Mãng",
        description: "Lưu Tú chỉ có vỏn vẹn gần 2 vạn quân cố thủ Côn Dương trước 42 vạn quân hùng hậu kèm đàn voi, hổ báo của Vương Mãng. Lưu Tú nhân đêm bão táp sấm sét dẫn cảm tử quân tập kích đại doanh, quân triều đình dẫm đạp lên nhau chết đuối vô số.",
        significance: "Kỳ tích lấy ít địch nhiều kinh điển nhất lịch sử, làm sụp đổ hoàn toàn triều đại Tân của Vương Mãng, mở đường phục hưng Đông Hán."
      }
    ],
    keywords: [
      { hanzi: "丝绸之路", pinyin: "Sīchóu zhī lù", meaning: "Con đường tơ lụa" },
      { hanzi: "造纸术", pinyin: "Zàozhǐshù", meaning: "Kỹ thuật làm giấy (Thái Luân)" },
      { hanzi: "四面楚歌", pinyin: "Sìmiàn chǔgē", meaning: "Bốn bề tiếng hát Sở (vây hãm cô lập)" },
      { hanzi: "封狼居胥", pinyin: "Fēng láng jū xū", meaning: "Phong lang cư tư (chiến công hiển hách)" }
    ],
    quote: {
      hanzi: "明犯强汉者，虽远必诛！",
      pinyin: "Míng fàn qiáng Hàn zhě, suī yuǎn bì zhū!",
      meaning: "Kẻ nào dám xâm phạm đến Đại Hán hùng mạnh, dẫu xa xôi đến đâu cũng nhất định phải tiêu diệt! (Danh tướng Trần Thang thời Hán)."
    }
  },

  // 6. THỜI KỲ TAM QUỐC
  {
    id: "era_6_three_kingdoms",
    order: 6,
    period: "220 – 280 SCN",
    eraName: "Thời Kỳ Tam Quốc",
    category: "military_strategy",
    categoryName: "Tam Quốc Diễn Nghĩa",
    categoryColor: "rose",
    badge: "Mưu Lược & Hào Kiệt",
    title: "Tam Quốc Phân Tranh (三国) - Ngụy, Thục, Ngô & Trí Tuệ Binh Lược",
    pinyin: "Sānguó Shídài (Tào Tháo, Lưu Bị, Tôn Quyền)",
    summary: "Thời kỳ đỉnh cao của nghệ thuật mưu lược quân sự, các anh hùng hào kiệt tranh hùng. Thế chân vạc Ngụy - Thục - Ngô đã sản sinh ra những huyền thoại bất hủ: Trận Quan Độ, Trận Xích Bích, Văn học Kiến An và hình tượng trung nghĩa Quan Công.",
    cultureEmergence: [
      "Văn học Kiến An (建安文学): Phong cách thơ văn phóng khoáng, hào hùng bi tráng với nhóm 'Tam Tào' (Tào Tháo, Tào Phi, Tào Thực) phản ánh khát vọng thống nhất giang sơn và nỗi lòng trước thời cuộc nhiễu nhương (*Đoản Ca Hành* của Tào Tháo).",
      "Văn hóa Trung Nghĩa Quan Công: Lòng trung thành tuyệt đối và khí phách dũng mãnh của Quan Vũ được hậu thế tôn làm 'Võ Thánh' (武圣), thờ phụng khắp dân gian.",
      "Y học Hoa Đà & Trương Trọng Cảnh: Thần y Hoa Đà phát minh thuốc gây mê 'Ma Phí Tán' (麻沸散) thực hiện phẫu thuật mổ xẻ và bài tập dưỡng sinh 'Ngũ Cầm Hí'; Trương Trọng Cảnh soạn *Thương Hàn Tạp Bệnh Luận* đặt nền móng y học lâm sàng."
    ],
    customsEmergence: [
      "Kết Nghĩa Vườn Đào (Đào Viên Kết Nghĩa - 桃园结义): Tục kết bái huynh đệ không chung ngày tháng sinh nhưng nguyện cùng ngày chết vì nghĩa lớn, trở thành chuẩn mực đạo nghĩa giang hồ muôn đời.",
      "Văn hóa Ẩm Thực Tứ Xuyên (Thục Hán): Do địa hình ẩm ướt hiểm trở, người dân bắt đầu sử dụng rộng rãi ớt thảo mộc, tiêu hoa và phát triển văn hóa ăn lẩu nhóm bạn bè.",
      "Trang phục Khăn Lông Quạt Vũ (Vũ phiến quan cân - 羽扇纶巾): Phong thái ung dung tự tại của các quân sư, mưu sĩ áo dài khăn xếp tay phe phẩy quạt lông thiên nga."
    ],
    warsAndBattles: [
      {
        name: "Trận Quan Độ (官渡之战)",
        hanzi: "官渡之战",
        pinyin: "Guāndù zhī Zhàn",
        year: "200 SCN",
        combatants: "Tào Tháo (khoảng 2 vạn quân) vs Viên Thiệu (hơn 10 vạn quân)",
        description: "Hai bên giằng co nhiều tháng tại Quan Độ. Nhận được mật báo của hàng tướng Hứa Du, Tào Tháo đích thân dẫn kỵ binh cảm tử ngụy trang cờ hiệu quân Viên, đánh úp đốt cháy toàn bộ kho lương thảo của Viên Thiệu tại Ô Sào, quân Viên Thiệu kinh hoàng tan vỡ.",
        significance: "Trận chiến lấy ít thắng nhiều then chốt giúp Tào Tháo thống nhất toàn bộ miền bắc Trung Quốc."
      },
      {
        name: "Trận Xích Bích (赤壁之战)",
        hanzi: "赤壁之战",
        pinyin: "Chìbì zhī Zhàn",
        year: "208 SCN",
        combatants: "Liên minh Tôn Quyền - Lưu Bị (5 vạn) vs Đại quân Tào Tháo (khoảng 20 vạn)",
        description: "Tào Tháo xích các chiến thuyền lớn lại với nhau để binh sĩ phương bắc đỡ say sóng. Đô đốc Chu Du và Gia Cát Lượng phối hợp kế liên hoàn: Hoàng Cái vờ hàng mang thuyền chở đầy lau sậy tẩm dầu đốt lửa xông thẳng vào trại thủy quân Tào; gió đông nam thổi mạnh biến sông Trường Giang thành biển lửa.",
        significance: "Bẻ gãy mưu toan thống nhất miền nam của Tào Tháo, trực tiếp định hình thế chân vạc Tam Quốc: Tào Tháo chiếm phương Bắc, Tôn Quyền giữ Giang Đông, Lưu Bị làm chủ Ích Châu."
      },
      {
        name: "Trận Di Lăng (Hào Đình Chi Chiến - 夷陵之战)",
        hanzi: "夷陵之战",
        pinyin: "Yílíng zhī Zhàn",
        year: "221 – 222 SCN",
        combatants: "Thục Hán (Lưu Bị) vs Đông Ngô (Lục Tốn)",
        description: "Để báo thù cho Quan Vũ, Lưu Bị đích thân thống lĩnh toàn quân Thục tấn công Đông Ngô, hạ trại liên hoàn dài hơn 700 dặm men theo bìa rừng. Đô đốc trẻ Lục Tốn kiên nhẫn thủ vững chờ mùa hè nắng gắt rồi dùng hỏa công thiêu rụi toàn bộ các trại quân Thục.",
        significance: "Ngăn chặn bước tiến của Thục Hán, khiến thực lực Thục suy kiệt nghiêm trọng, Lưu Bị uất hận qua đời ở thành Bạch Đế."
      }
    ],
    keywords: [
      { hanzi: "三足鼎立", pinyin: "Sānzú dǐnglì", meaning: "Thế chân vạc Tam Quốc" },
      { hanzi: "草船借箭", pinyin: "Cǎochuán jiè jiàn", meaning: "Thuyền cỏ mượn tên" },
      { hanzi: "赤壁之战", pinyin: "Chìbì zhī zhàn", meaning: "Trận đánh Xích Bích" },
      { hanzi: "鞠躬尽瘁", pinyin: "Jūgōng-jìncuì", meaning: "Cúc cung tận tụy (Gia Cát Lượng)" }
    ],
    quote: {
      hanzi: "滚滚长江东逝水，浪花淘尽英雄。是非成败转头空，青山依旧在，几度夕阳红。",
      pinyin: "Gǔngǔn Chángjiāng dōng shì shuǐ, lànghuā táo jìn yīngxióng. Shìfēi chéngbài zhuǎntóu kōng, qīngshān yījiù zài, jǐ dù xīyáng hóng.",
      meaning: "Cuồn cuộn Trường Giang sóng cuốn về đông, bọt nước đãi sạch anh hùng. Thị phi thành bại thoáng chốc thành không, non xanh thuở trước còn nguyên đó, mấy độ tịch dương đỏ ráng chiều (Mở đầu Tam Quốc Diễn Nghĩa)."
    }
  },

  // 7. THỜI TẤN & NAM BẮC TRIỀU
  {
    id: "era_7_jin_southern_northern",
    order: 7,
    period: "265 – 589 SCN",
    eraName: "Thời Tấn & Nam Bắc Triều",
    category: "art_calligraphy",
    categoryName: "Phong Lưu Ngụy Tấn",
    categoryColor: "teal",
    badge: "Thư Thánh & Trúc Lâm Thất Hiền",
    title: "Tấn & Nam Bắc Triều (魏晋南北朝) - Thư Pháp Lan Đình & Hang Tượng Phật",
    pinyin: "Jìn Cháo & Nán-Běi Cháo",
    summary: "Thời kỳ chia cắt tao loạn kéo dài nhưng lại nở rộ phong cách sống tự do khoáng đạt 'Phong lưu Ngụy Tấn'. 'Thư thánh' Vương Hy Chi viết nên thiên cổ kỳ thư *Lan Đình Tập Tự*, thi nhân Đào Uyên Minh mở ra dòng thơ điền viên, các đại hang đá Phật giáo Vân Cương, Long Môn được chạm khắc kỳ vĩ.",
    cultureEmergence: [
      "Thư Thánh Vương Hy Chi (王羲之): Nghệ thuật thư pháp chữ Hán đạt cảnh giới tuyệt đỉnh vô song với kiệt tác *Lan Đình Tập Tự* (兰亭集序) - Thiên hạ đệ nhất hành thư.",
      "Trúc Lâm Thất Hiền & Huyền Học (竹林七贤): 7 bậc danh sĩ hội tụ dưới rừng trúc đàn hát, uống rượu, đàm đạo triết lý vượt thoát khỏi những khuôn sáo lễ giáo trói buộc.",
      "Kỳ Quan Hang Đá Phật Giáo: Đục đẽo hàng vạn pho tượng Phật tinh xảo trên vách núi tại Hang đá Long Môn (Lạc Dương) và Vân Cương (Đại Đồng), đánh dấu sự hòa nhập kỳ diệu giữa văn hóa Phật giáo Ấn Độ và thẩm mỹ Trung Hoa."
    ],
    customsEmergence: [
      "Khúc Thủy Lưu Thương (Lưu chén nước trôi - 曲水流觞): Phong tục tao nhã tiết đầu xuân thanh minh, các văn nhân ngồi hai bên bờ suối uốn lượn, chén rượu thả trôi dừng trước mặt ai người đó phải ngâm thơ, nếu không làm được thơ sẽ bị phạt uống cạn chén rượu.",
      "Tết Trùng Cửu (重阳节): Mùng 9 tháng 9 âm lịch leo núi cao ngắm cảnh, cài cành thù du trừ tà và thưởng rượu hoa cúc, tôn vinh đạo hiếu kính dưỡng người cao tuổi.",
      "Sự Giao Thoa Y Phục Hồ - Hán: Người Hán bắt đầu mặc quần ống hẹp và áo chẽn ngắn vốn là trang phục cưỡi ngựa của các dân tộc phương bắc để tiện di chuyển lao động."
    ],
    warsAndBattles: [
      {
        name: "Bát Vương Chi Loạn (八王之乱)",
        hanzi: "八王之乱",
        pinyin: "Bā wáng zhī luàn",
        year: "291 – 306 SCN",
        combatants: "8 phiên vương tông thất họ Tư Mã tranh đoạt quyền lực",
        description: "Cuộc nội chiến tương tàn đẫm máu kéo dài 16 năm trong hoàng thất nhà Tây Tấn nhằm tranh giành quyền nhiếp chính. Đất nước kiệt quệ, các dân tộc du mục phương bắc nhân cơ hội tràn xuống.",
        significance: "Nguyên nhân trực tiếp dẫn tới sự sụp đổ của Tây Tấn, đẩy Trung Hoa vào thời kỳ 'Ngũ Hồ Loạn Hoa' và Nam Bắc phân liệt hơn 300 năm."
      },
      {
        name: "Trận Phì Thủy (淝水之战)",
        hanzi: "淝水之战",
        pinyin: "Féishuǐ zhī Zhàn",
        year: "383 SCN",
        combatants: "Đông Tấn (Tạ An, Tạ Huyền - 8 vạn) vs Tiền Tần (Phù Kiên - hơn 80 vạn)",
        description: "Phù Kiên huy động lực lượng khổng lồ với tuyên bố 'Quăng roi ngựa xuống sông cũng đủ chặn dòng nước' hòng nuốt trọn Đông Tấn. Tạ Huyền chỉ huy 8 vạn quân Bắc Phủ tinh nhuệ phản kích qua sông Phì Thủy. Quân Tiền Tần vừa thấy hàng ngũ dao động đã hoảng loạn dẫm đạp lên nhau chạy trốn, nghe tiếng gió hú chim kêu cũng ngỡ phục binh ('Phong thanh hạc lệ, thảo mộc giai binh' - 风声鹤唳，草木皆兵).",
        significance: "Kỳ tích cứu nguy nền văn minh Hán tộc phương Nam khỏi họa diệt vong, khiến chính quyền Tiền Tần phương bắc tan rã."
      }
    ],
    keywords: [
      { hanzi: "兰亭集序", pinyin: "Lántíng jí xù", meaning: "Lan Đình Tập Tự (Thư pháp Vương Hy Chi)" },
      { hanzi: "竹林七贤", pinyin: "Zhúlín qī xián", meaning: "Trúc Lâm Thất Hiền" },
      { hanzi: "草木皆兵", pinyin: "Cǎomù jiē bīng", meaning: "Cỏ cây cũng ngỡ là quân giặc (Trận Phì Thủy)" },
      { hanzi: "世外桃源", pinyin: "Shìwài táoyuán", meaning: "Đào hoa nguyên (Chốn bồng lai lánh đời)" }
    ],
    quote: {
      hanzi: "仰观宇宙之大，俯察品类之盛，所以游目骋怀，足以极视听之娱，信可乐也。",
      pinyin: "Yǎng guān yǔzhòu zhī dà, fǔ chá pǐnlèi zhī shèng, suǒyǐ yóumù chěnghuái, zúyǐ jí shìtīng zhī yú, xìn kě lè yě.",
      meaning: "Ngửa trông vũ trụ bao la thênh thang, cúi xem vạn vật nảy nở dồi dào, mở rộng tầm mắt thả lỏng tâm hồn, đủ để hưởng trọn niềm vui nghe nhìn, quả thực vui sướng biết bao (Vương Hy Chi - Lan Đình Tập Tự)."
    }
  },

  // 8. NHÀ TÙY & NHÀ ĐƯỜNG
  {
    id: "era_8_sui_tang",
    order: 8,
    period: "581 – 907 SCN",
    eraName: "Thời Tùy & Đại Đường Thịnh Thế",
    category: "tang_poetry",
    categoryName: "Đỉnh Cao Phồn Vinh",
    categoryColor: "rose",
    badge: "Đường Thi & Đô Thành Trường An",
    title: "Đại Đường Thịnh Thế (盛唐) - Thi Tiên Lý Bạch & Con Đường Tơ Lụa",
    pinyin: "Suí Cháo & Dà Táng Shèngshì",
    summary: "Đỉnh cao hoàng kim rực rỡ nhất trong lịch sử văn minh Trung Hoa cổ đại. Nhà Tùy thống nhất sơn hà, mở Khoa cử và đào Đại Vận Hà; nhà Đường mở ra kỷ nguyên vàng của Đường thi (Lý Bạch, Đỗ Phủ), kinh đô Trường An trở thành trung tâm giao thương đa văn hóa bậc nhất thế giới.",
    cultureEmergence: [
      "Kỷ Nguyên Vàng Đường Thi (唐诗): Hơn 5 vạn bài thơ của hơn 2.000 tác giả với các tượng đài: 'Thi Tiên' Lý Bạch lãng mạn siêu phàm, 'Thi Thánh' Đỗ Phủ hiện thực bi tráng, Bạch Cư Dị bình dân sâu lắng (*Tỳ Bà Hành*, *Trường Hận Ca*).",
      "Khởi Sinh Chế Độ Khoa Cử (科举制度): Bãi bỏ đặc quyền dòng dõi quý tộc, chọn nhân tài thông qua các kỳ thi tuyển quốc gia văn chương minh kinh, mở ra con đường tiến thân công bằng cho sĩ tử bình dân suốt 1.300 năm.",
      "Khai Đào Đại Vận Hà (京杭大运河): Kênh đào nhân tạo dài nhất thế giới nối liền miền Bắc và vựa lúa Giang Nam miền Nam, kết nối huyết mạch kinh tế của cả đế chế.",
      "Trà Kinh của Lục Vũ (陆羽《茶经》): Pho sách chuyên khảo về trà đầu tiên trong lịch sử nhân loại, định hình văn hóa Trà Đạo thanh cao thoát tục."
    ],
    customsEmergence: [
      "Tết Trung Thu (中秋节) Trở Thành Quốc Lễ: Nhà Đường chính thức định vị rằm tháng tám là lễ hội ngắm trăng ngâm thơ, sum vầy gia đình và thưởng thức bánh nướng ngọt ngào.",
      "Văn Hóa Thời Trang Cởi Mở: Phụ nữ quý tộc thời Đường được tôn trọng cao, mặc áo cổ khoét chữ U thướt tha, đánh phấn cánh sen trên trán (Ngạch hoàng), cưỡi ngựa đánh polo (Mã cầu) tự tin ngoài phố xá.",
      "Gốm Sứ Tam Thải (Đường Tam Thải - 唐三彩): Nghệ thuật làm đồ gốm tráng 3 lớp men màu (vàng, lục, trắng) khắc họa lạc đà, vũ công Tây Vực và chiến mã dũng mãnh."
    ],
    warsAndBattles: [
      {
        name: "Trận Hổ Lao (虎牢关之战)",
        hanzi: "虎牢关之战",
        pinyin: "Hǔláoguān zhī Zhàn",
        year: "621 SCN",
        combatants: "Tần Vương Lý Thế Dân (Đường) vs Vương Thế Sung & Đậu Kiến Đức (10 vạn)",
        description: "Lý Thế Dân đang vây Lạc Dương thì Đậu Kiến Đức kéo 10 vạn quân cứu viện. Lý Thế Dân chỉ dẫn 3.500 kỵ binh giáp đen (Hắc Giáp Quân) chốt chặn hiểm ải Hổ Lao, nhử địch mỏi mệt rồi bất ngờ xuất kích bắt sống Đậu Kiến Đức, Vương Thế Sung ở Lạc Dương tuyệt vọng mở cổng thành đầu hàng.",
        significance: "Chiến tích quân sự vĩ đại 'Một trận bắt sống hai vua', quyết định thắng lợi toàn cục cho sự thành lập triều đại nhà Đường hùng mạnh."
      },
      {
        name: "Loạn An Sử (安史之乱)",
        hanzi: "安史之乱",
        pinyin: "Ān-Shǐ zhī Luàn",
        year: "755 – 763 SCN",
        combatants: "Tiết độ sứ An Lộc Sơn & Sử Tư Minh vs Quân triều đình nhà Đường (Quách Tử Nghi, Lý Quang Bật)",
        description: "An Lộc Sơn khởi 15 vạn quân tinh nhuệ từ Phạm Dương (Bắc Kinh ngày nay) đánh úp chiếm hai kinh đô Lạc Dương và Trường An. Đường Huyền Tông phải bỏ kinh đô chạy vào Tứ Xuyên, tướng sĩ ép chết Dương Quý Phi ở trạm Mã Ngôi Pha. Sau 8 năm nội chiến đẫm máu với sự trợ giúp của quân Hồi Hột, triều đình mới dẹp yên loạn đảng.",
        significance: "Bước ngoặt đau đớn khiến Đại Đường từ đỉnh cao thịnh thế rơi vào suy thoái trầm trọng, chế độ phiên trấn cát cứ cát cứ kéo dài."
      }
    ],
    keywords: [
      { hanzi: "大唐盛世", pinyin: "Dà Táng shèngshì", meaning: "Đại Đường thịnh thế" },
      { hanzi: "诗仙李白", pinyin: "Shīxiān Lǐ Bái", meaning: "Thi tiên Lý Bạch" },
      { hanzi: "京杭大运河", pinyin: "Jīng-Háng dàyùnhé", meaning: "Đại Vận Hà Bắc Kinh - Hàng Châu" },
      { hanzi: "安史之乱", pinyin: "Ān-Shǐ zhī luàn", meaning: "Loạn An Sử (bước ngoặt nhà Đường)" }
    ],
    quote: {
      hanzi: "君不见黄河之水天上来，奔流到海不复回。人生得意须尽欢，莫使金樽空对月。",
      pinyin: "Jūn bú jiàn Huánghé zhī shuǐ tiānshàng lái, bēnliú dào hǎi bú fù huí. Rénshēng déyì xū jìn huān, mò shǐ jīnzūn kōng duì yuè.",
      meaning: "Há chẳng thấy nước sông Hoàng Hà từ trời cao đổ xuống, chảy băng băng ra biển biếc chẳng quay về. Đời người khi đắc ý hãy vui say cho cạn chén, chớ để chén vàng ngơ ngác soi bóng trăng (Lý Bạch - Tương Tiến Tửu)."
    }
  },

  // 9. NHÀ TỐNG
  {
    id: "era_9_song",
    order: 9,
    period: "960 – 1279 SCN",
    eraName: "Thời Nhà Tống (Bắc Tống & Nam Tống)",
    category: "urban_culture",
    categoryName: "Kinh Tế & Phát Minh",
    categoryColor: "amber",
    badge: "Tống Từ & Tứ Đại Phát Minh",
    title: "Nhà Tống (宋朝) - Văn Minh Đô Thị, Tống Từ & Ba Đại Phát Minh",
    pinyin: "Sòng Cháo (Bắc Tống 960–1127 & Nam Tống 1127–1279)",
    summary: "Dù quân sự yếu thế trước các đế chế phương Bắc (Liêu, Kim, Mông Cổ), nhà Tống lại là đỉnh cao rực rỡ nhất về kinh tế thương mại, phát minh kỹ thuật và văn hóa thẩm mỹ tinh tế. Ra đời kỹ thuật in chữ rời, thuốc súng, la bàn hàng hải, tiền giấy đầu tiên trên thế giới và khúc ca Tống Từ bất hủ.",
    cultureEmergence: [
      "Tống Từ (宋词): Thể thơ điệu hát phối nhạc đạt đỉnh cao với các danh gia hào sảng như Tô Thức, Tân Khí Tật và nữ thi sĩ uyển chuyển Lý Thanh Chiếu.",
      "Hoàn Thiện Tứ Đại Phát Minh: Tất Thăng sáng tạo Kỹ thuật in chữ rời bằng đất nung (活字印刷术); La bàn từ tính ứng dụng rộng rãi cho hàng hải viễn dương; Thuốc súng được chế tạo thành đại bác và hỏa tiễn trong quân sự.",
      "Hội Họa Thanh Minh Thượng Hà Đồ (清明上河图): Danh tác dài hơn 5 mét của Trương Trạch Đoan miêu tả sinh động 814 nhân vật, thuyền bè, cầu cống của kinh thành Biện Kinh thời hoàng kim.",
      "Nghệ Thuật Đấu Trà (Điểm Trà - 点茶): Nghi thức dùng chổi tre đánh bọt trà trắng mịn như mây bồng bềnh và vẽ hình lên bọt trà (Trà bách hí), tiền thân của trà đạo Matcha."
    ],
    customsEmergence: [
      "Tiền Giấy Đầu Tiên - Giao Tử (交子): Xuất hiện tại vùng Tứ Xuyên vào năm 1023, là loại tiền giấy đầu tiên trong lịch sử tài chính nhân loại thay cho tiền đồng nặng nề.",
      "Chợ Đêm Đô Thị Bất Dạ Thành: Xóa bỏ lệnh giới nghiêm ban đêm thời Đường, mở ra nền kinh tế chợ đêm náo nhiệt, quán trà, nhà hát ca lâu (Câu lan ngõ phố) sáng đèn thâu đêm.",
      "Gốm Sứ Ngũ Đại Danh Diêu: Đạt đỉnh cao thẩm mỹ tối giản với các lò gốm Nhữ, Quan, Ca, Định, Quân với sắc men thiên thanh ngọc bích 'màu xanh của bầu trời sau cơn mưa'."
    ],
    warsAndBattles: [
      {
        name: "Biến Cố Tĩnh Khang (靖康之耻 / 靖康之变)",
        hanzi: "靖康之变",
        pinyin: "Jìngkāng zhī Biàn",
        year: "1127 SCN",
        combatants: "Quân Kim (Nữ Chân) vs Bắc Tống",
        description: "Quân Nữ Chân vây hãm và công phá kinh thành Biện Kinh (Khai Phong ngày nay). Quân Kim bắt sống hai vị hoàng đế Tống Huy Tông và Tống Khâm Tông cùng hơn 3.000 thành viên hoàng tộc, phi tần, thợ thủ công giải về phương Bắc trong giá rét tủi nhục.",
        significance: "Chấm dứt hoàn toàn triều đại Bắc Tống, Triệu Cấu chạy xuống miền nam lập nên Nam Tống đóng đô tại Hàng Châu (Lâm An)."
      },
      {
        name: "Chiến Dịch Nhạc Phi Kháng Kim (岳飞抗金)",
        hanzi: "岳飞抗金与郾城之战",
        pinyin: "Yuè Fēi kàng Jīn",
        year: "1134 – 1140 SCN",
        combatants: "Nhạc Gia Quân (Nhạc Phi) vs Kỵ binh Kim (Ngột Truật)",
        description: "Nhạc Phi với kỷ luật sắt 'Chết đói không cướp của dân, chết rét không dỡ nhà dân' chỉ huy bộ binh dùng câu liêm thương và trảm mã đao phá tan đội 'Thiết phù đồ' khét tiếng của quân Kim tại Yển Thành. Khi sắp thu phục cố đô, gian thần Tần Cối phát 12 đạo kim bài ép ông thu quân rồi hãm hại ông với tội danh 'Không cần có' (Mạc tu hữu).",
        significance: "Nhạc Phi trở thành biểu tượng tinh thần ái quốc kiên trung bậc nhất của dân tộc Trung Hoa với hào khí tráng lệ trong bài từ *Mãn Giang Hồng*."
      },
      {
        name: "Hải Chiến Nhai Sơn (崖山海战)",
        hanzi: "崖山海战",
        pinyin: "Yáshān Hǎizhàn",
        year: "1279 SCN",
        combatants: "Hải quân Mông Cổ (Trương Hoằng Phạm) vs Nam Tống (Trương Thế Kiệt, Lục Tú Phu)",
        description: "Trận quyết chiến hải quân khổng lồ với hơn 1.000 chiến thuyền ngoài khơi Nhai Sơn (Quảng Đông). Bị quân Mông Cổ cắt đường nước ngọt và bao vây hỏa công, phòng tuyến cuối cùng của Nam Tống tan vỡ. Tể tướng Lục Tú Phu cõng ấu đế 8 tuổi Triệu Bính nhảy xuống biển sâu tự vẫn; hơn 10 vạn quan lại, binh sĩ và dân chúng Nam Tống đồng loạt nhảy biển tuẫn tiết.",
        significance: "Đánh dấu sự diệt vong hoàn toàn của nhà Tống, lần đầu tiên toàn bộ lãnh thổ Trung Hoa bị một sắc tộc du mục (Mông Cổ) cai trị tuyệt đối."
      }
    ],
    keywords: [
      { hanzi: "活字印刷术", pinyin: "Huózì yìnshuāshù", meaning: "Kỹ thuật in chữ rời (Tất Thăng)" },
      { hanzi: "清明上河图", pinyin: "Qīngmíng shànghé tú", meaning: "Tranh Thanh Minh Thượng Hà Đồ" },
      { hanzi: "精忠报国", pinyin: "Jīngzhōng bàoguó", meaning: "Tinh trung báo quốc (Nhạc Phi)" },
      { hanzi: "交子", pinyin: "Jiāozǐ", meaning: "Tiền giấy Giao Tử (đầu tiên trên thế giới)" }
    ],
    quote: {
      hanzi: "三十功名尘与土，八千里路云和月。莫等闲、白了少年头，空悲切！",
      pinyin: "Sānshí gōngmíng chén yǔ tǔ, bā qiān lǐ lù yún hé yuè. Mò děngxián, bái le shàonián tóu, kōng bēiqiè!",
      meaning: "Ba mươi tuổi công danh như cát bụi, tám ngàn dặm dãi dầu cùng mây và trăng. Đừng để tháng năm trôi hoài, bạc mái đầu trai trẻ, luống xót xa u hoài! (Nhạc Phi - Mãn Giang Hồng)."
    }
  },

  // 10. NHÀ NGUYÊN
  {
    id: "era_10_yuan",
    order: 10,
    period: "1271 – 1368 SCN",
    eraName: "Đế Quốc Đại Nguyên (Mông Cổ)",
    category: "conquest_empire",
    categoryName: "Đế Quốc Thảo Nguyên",
    categoryColor: "purple",
    badge: "Mông Cổ Chinh Phạt & Nguyên Khúc",
    title: "Nhà Nguyên (元朝) - Thiết Kỵ Thảo Nguyên & Kịch Thơ Nguyên Khúc",
    pinyin: "Yuán Cháo (Hốt Tất Liệt & Đại Đô)",
    summary: "Hốt Tất Liệt lập nên Đại Nguyên, mở rộng lãnh thổ bao la trải dài từ Á sang Âu. Thời kỳ bùng nổ giao lưu thương mại quốc tế với chuyến du hành của Marco Polo, sự trỗi dậy của kịch nghệ Nguyên Khúc và gốm hoa lam Thanh Hoa Sứ.",
    cultureEmergence: [
      "Nguyên Khúc (元曲): Thể loại kịch hát dân gian phát triển rực rỡ với các kịch tác gia vĩ đại như Quan Hán Khanh (vở bi kịch *Đậu Nga Oan* - 窦娥冤), Vương Thực Phủ (*Tây Sương Ký*).",
      "Khai Mở Giao Lưu Đông - Tây Đạt Đỉnh: Nhà thám hiểm Venice Marco Polo sinh sống tại Trung Hoa 17 năm, viết cuốn *Marco Polo Du Ký* miêu tả sự giàu sang hoa lệ của kinh đô Đại Đô (Bắc Kinh ngày nay) làm chấn động châu Âu.",
      "Gốm Men Hoa Lam (Thanh Hoa Sứ - 青花瓷): Kỹ nghệ phối kết đất sét trắng cao lanh Cảnh Đức Trấn với men coban nhập khẩu từ Ba Tư tạo nên những chiếc bình gốm rồng mây xanh trắng huyền thoại."
    ],
    customsEmergence: [
      "Văn Hóa Ẩm Thực Du Mục: Du nhập các món thịt cừu nướng xâu, món lẩu nhúng thịt cừu thảo nguyên (Toán dương nhục - 涮羊肉) và rượu sữa ngựa (Mã nãi tửu) vào văn hóa ẩm thực Trung Nguyên.",
      "Trang Phục Bào Hẹp Vạt Chéo: Quần áo may bằng nỉ dạ, ống tay chẽn gọn gàng, đầu đội mũ chóp nhọn đính lông chim (Mũ Bột Lang) thuận tiện cho đời sống cưỡi ngựa săn bắn.",
      "Hệ Thống Trạm Dịch Mã Trạm (Dịch trạm chế): Thiết lập mạng lưới trạm ngựa chuyển thư tín khắp lục địa, ngựa chạy tiếp sức ngày đêm giúp truyền mệnh lệnh hoàng đế qua vạn dặm chỉ trong vài ngày."
    ],
    warsAndBattles: [
      {
        name: "Các Cuộc Tây Chinh Của Đế Quốc Mông Cổ (蒙古西征)",
        hanzi: "蒙古三次西征",
        pinyin: "Měnggǔ sān cì xīzhēng",
        year: "1219 – 1260 SCN",
        combatants: "Thiết kỵ Mông Cổ (Thành Cát Tư Hãn, Bạt Đô, Húc Liệt Ngột) vs Các vương quốc Trung Á, Ba Tư, Nga, Đông Âu",
        description: "Đội kỵ binh thảo nguyên kỷ luật thép và tài bắn cung cưỡi ngựa phi thường quét qua Ba Tư, Trung Đông, đánh bại liên quân hiệp sĩ châu Âu tại trận Legnica, san phẳng thành Baghdad.",
        significance: "Tạo nên đế quốc có diện tích lãnh thổ lục địa liền khối lớn nhất trong lịch sử nhân loại, thiết lập nền hòa bình Mông Cổ (Pax Mongolica) nối liền tuyến đường mậu dịch Á - Âu."
      },
      {
        name: "Khởi Nghĩa Khăn Đỏ (Hồng Cân Quân - 红巾军起义)",
        hanzi: "元末红巾军起义",
        pinyin: "Hóngjīnjūn Qǐyì",
        year: "1351 – 1368 SCN",
        combatants: "Nghĩa quân nông dân áo đỏ (Hàn Sơn Đồng, Lưu Phúc Thông, Chu Nguyên Chương) vs Quân triều đình nhà Nguyên",
        description: "Nhà Nguyên thực thi chính sách phân biệt 4 đẳng cấp hà khắc (người Mông Cổ, người Sắc Mục, người Hán phương Bắc, người Nam nhân) và vỡ đê sông Hoàng Hà khiến lòng dân sôi sục. Nghĩa quân quấn khăn đỏ trên đầu nổi dậy khắp nơi. Chu Nguyên Chương từng bước thâu tóm lực lượng, xưng đế ở Nam Kinh rồi phái đại tướng Từ Đạt tiến đánh Đại Đô.",
        significance: "Đánh đuổi triều đình Mông Cổ chạy về thảo nguyên phía bắc (Bắc Nguyên), tái lập quyền kiểm soát của người Hán dưới triều đại nhà Minh."
      }
    ],
    keywords: [
      { hanzi: "马可波罗", pinyin: "Mǎkě Bōluó", meaning: "Marco Polo (nhà thám hiểm Ý)" },
      { hanzi: "青花瓷", pinyin: "Qīnghuācí", meaning: "Gốm hoa lam (Thanh hoa sứ)" },
      { hanzi: "窦娥冤", pinyin: "Dòu É yuān", meaning: "Oan Đậu Nga (vở kịch nổi tiếng)" },
      { hanzi: "红巾军", pinyin: "Hóngjīnjūn", meaning: "Nghĩa quân Khăn Đỏ" }
    ],
    quote: {
      hanzi: "地也，你不分好歹何为地！天也，你错勘贤愚枉做天！",
      pinyin: "Dì yě, nǐ bù fēn hǎodǎi hé wéi dì! Tiān yě, nǐ cuò kān xiányú wǎng zuò tiān!",
      meaning: "Đất hỡi, ngươi chẳng phân biệt lành dữ sao gọi là đất! Trời hỡi, ngươi xét lầm hiền ngu sao uổng làm trời! (Quan Hán Khanh - Đậu Nga Oan)."
    }
  },

  // 11. NHÀ MINH
  {
    id: "era_11_ming",
    order: 11,
    period: "1368 – 1644 SCN",
    eraName: "Đại Minh Kỷ Nguyên",
    category: "forbidden_city",
    categoryName: "Tử Cấm Thành & Hàng Hải",
    categoryColor: "rose",
    badge: "Hạ Tây Dương & Tiểu Thuyết Danh Tác",
    title: "Nhà Minh (明朝) - Trịnh Hòa Hạ Tây Dương & Cố Cung Bắc Kinh",
    pinyin: "Míng Cháo (Chu Nguyên Chương, Vĩnh Lạc & Trịnh Hòa)",
    summary: "Thời đại hùng mạnh khôi phục nền văn hiến Hoa Hạ. Vĩnh Lạc Đế xây dựng Tử Cấm Thành (Cố Cung) tráng lệ; Đô đốc Trịnh Hòa chỉ huy hạm đội khổng lồ 7 lần hạ Tây Dương; sự bùng nổ của tiểu thuyết trường thiên chương hồi (*Tam Quốc*, *Thủy Hử*, *Tây Du Ký*) và triết học Tâm học của Vương Dương Minh.",
    cultureEmergence: [
      "Tử Cấm Thành Bắc Kinh (故宫 - Cố Cung): Quần thể cung điện hoàng gia bằng gỗ quy mô lớn nhất thế giới với 9.999 gian phòng, xây dựng theo trục đối xứng nghiêm cẩn, tượng trưng cho thiên uy tối thượng.",
      "Trịnh Hòa 7 Lần Hạ Tây Dương (郑和下西洋): Hạm đội thuyền buồm lớn nhất thế giới bấy giờ với hơn 200 chiến thuyền và gần 3 vạn thủy thủ vượt Ấn Độ Dương đến bờ biển Ả Rập và Đông Phi, thiết lập quan hệ hữu nghị với hơn 30 quốc gia.",
      "Tứ Đại Danh Tác Tiểu Thuyết Chương Hồi: Sự ra đời của 3 trong 4 tác phẩm văn học vĩ đại nhất: *Tam Quốc Diễn Nghĩa* (La Quán Trung), *Thủy Hử* (Thi Nại Am), *Tây Du Ký* (Ngô Thừa Ân).",
      "Tâm Học Vương Dương Minh (王阳明): Triết lý 'Tri hành hợp nhất' (知行合一) - hiểu biết và hành động phải gắn liền làm một, giải phóng tâm thức cá nhân khỏi giáo điều xơ cứng."
    ],
    customsEmergence: [
      "Tục Dán Chữ Phúc Ngược (福倒 - Phúc Đáo): Xuất phát từ thời Minh Thái Tổ, dán ngược chữ Phúc (福) ở cửa chính vào ngày Tết để biểu thị 'Phúc đã đến nhà' ('Đảo' 倒 đồng âm với 'Đáo' 到).",
      "Thả Đèn Khổng Minh & Chơi Đèn Hoa Đăng: Dịp Tết Nguyên Tiêu thắp đèn lồng hoa văn lộng lẫy và thả đèn trời cầu chúc bình an.",
      "Văn Hóa Nhà Tứ Hợp Viện (四合院): Hoàn thiện cấu trúc nhà bốn gian quây kín hình vuông có sân vườn ở giữa, mang triết lý tôn ti trật tự gia phong đầm ấm tại Bắc Kinh."
    ],
    warsAndBattles: [
      {
        name: "Chiến Dịch Tĩnh Nan (靖难之役)",
        hanzi: "靖难之役",
        pinyin: "Jìngnàn zhī Yì",
        year: "1399 – 1402 SCN",
        combatants: "Yên Vương Chu Đệ vs Triều đình Kiến Văn Đế",
        description: "Sau khi Chu Nguyên Chương mất, cháu nội là Kiến Văn Đế thực hiện bãi bỏ quyền lực của các chú (Tước phiên). Yên Vương Chu Đệ lấy danh nghĩa 'Dẹp loạn cứu nguy xã tắc' dấy binh từ Bắc Bình, vượt sông Hoài đánh thẳng vào kinh sư Nam Kinh. Cung điện bốc cháy, Kiến Văn Đế mất tích bí ẩn.",
        significance: "Chu Đệ lên ngôi Vĩnh Lạc Đế, quyết định dời đô về Bắc Kinh và cho xây dựng Tử Cấm Thành kỳ vĩ."
      },
      {
        name: "Thảm Biến Thổ Mộc Bảo (土木堡之变)",
        hanzi: "土木堡之变",
        pinyin: "Tǔmùbǎo zhī Biàn",
        year: "1449 SCN",
        combatants: "Minh Anh Tông & Thái giám Vương Chấn (50 vạn) vs Kỵ binh Ngõa Lạt (Dã Tiên)",
        description: "Minh Anh Tông nghe lời xúi giục của thái giám Vương Chấn thân chinh đánh Ngõa Lạt nhưng vụng về chỉ huy, bị kỵ binh du mục bao vây cắt nước tại Thổ Mộc Bảo. Toàn quân Minh tan rã, 50 vạn quân thương vong, hoàng đế bị bắt sống. Binh bộ Thượng thư Vu Khiêm kiên quyết lập vua mới và chỉ huy cuộc chiến đấu bảo vệ kinh thành Bắc Kinh thành công.",
        significance: "Bước ngoặt đánh dấu quân đội Đại Minh chuyển từ thế chủ động tấn công sang thế phòng ngự cố thủ sau Vạn Lý Trường Thành."
      },
      {
        name: "Chiến Tranh Kháng Oa Viện Triều (万历援朝战争)",
        hanzi: "万历援朝战争 / 壬辰倭乱",
        pinyin: "Wànlì Yuán Cháo Zhànzhēng",
        year: "1592 – 1598 SCN",
        combatants: "Liên quân Đại Minh & Triều Tiên vs Quân Nhật Bản (Toyotomi Hideyoshi)",
        description: "Toyotomi Hideyoshi huy động 14 vạn quân xâm lược Triều Tiên với dã tâm mượn đường đánh Đại Minh. Triều đình nhà Minh phái đại tướng Lý Như Tùng mang pháo binh tinh nhuệ qua sông Áp Lục sang viện trợ, phối hợp thủy quân Lý Thuấn Thần đánh tan tành quân Nhật.",
        significance: "Bảo vệ vững chắc an ninh bờ cõi vùng đông bắc Á, duy trì nền hòa bình khu vực suốt hơn 300 năm."
      },
      {
        name: "Khởi Nghĩa Lý Tự Thành & Ngô Tam Quế Nhập Quan (1644)",
        hanzi: "甲申之变与吴三桂降清",
        pinyin: "Jiǎshēn zhī biàn",
        year: "1644 SCN",
        combatants: "Nghĩa quân Lý Tự Thành vs Triều đình nhà Minh vs Quân Mãn Thanh",
        description: "Nghĩa quân 'Sấm Vương' Lý Tự Thành công phá Bắc Kinh, Sùng Trinh Hoàng đế tự thắt cổ trên núi Cảnh Sơn tuẫn quốc. Tổng binh trấn thủ ải Sơn Hải Quan Ngô Tam Quế vì nàng kỹ nữ Trần Viên Viên đã mở toang ải đón quân Mãn Thanh vào thành đánh bại Lý Tự Thành.",
        significance: "Chấm dứt hoàn toàn triều đại nhà Minh, người Mãn Châu lập nên triều đình nhà Thanh."
      }
    ],
    keywords: [
      { hanzi: "紫禁城", pinyin: "Zǐjìnchéng", meaning: "Tử Cấm Thành (Cố Cung Bắc Kinh)" },
      { hanzi: "郑和下西洋", pinyin: "Zhèng Hé xià Xīyáng", meaning: "Trịnh Hòa hạ Tây Dương" },
      { hanzi: "知行合一", pinyin: "Zhī xíng hé yī", meaning: "Tri hành hợp nhất (Vương Dương Minh)" },
      { hanzi: "土木堡之变", pinyin: "Tǔmùbǎo zhī biàn", meaning: "Thảm biến Thổ Mộc Bảo" }
    ],
    quote: {
      hanzi: "天子守国门，君王死社稷。",
      pinyin: "Tiānzǐ shǒu guómén, jūnwáng sǐ shèjì.",
      meaning: "Thiên tử dời đô ra tiền tuyến để canh giữ cửa ải đất nước, quân vương thà tuẫn tiết chứ không chịu rời bỏ giang sơn xã tắc (Khí phách hoàng triều nhà Minh)."
    }
  },

  // 12. NHÀ THANH
  {
    id: "era_12_qing",
    order: 12,
    period: "1644 – 1912 SCN",
    eraName: "Triều Đại Mãn Thanh",
    category: "late_imperial",
    categoryName: "Khang Càn & Biến Động Cận Đại",
    categoryColor: "amber",
    badge: "Khang Càn Thịnh Thế & Kinh Kịch",
    title: "Nhà Thanh (清朝) - Khang Càn Thịnh Thế & Sóng Gió Cận Đại",
    pinyin: "Qīng Cháo (1644 – Cách Mạng Tân Hợi 1911/1912)",
    summary: "Triều đại phong kiến cuối cùng do người Mãn Châu cai trị. Trải qua 'Khang Càn Thịnh Thế' với cương thổ rộng lớn, ra đời kiệt tác văn học *Hồng Lâu Mộng*, đại bách khoa *Tứ Khố Toàn Thư*, nghệ thuật quốc bảo Kinh Kịch; tiếp đó là những cuộc đụng độ khốc liệt trước họng pháo phương Tây thời cận đại.",
    cultureEmergence: [
      "Đỉnh Cao Tiểu Thuyết Hồng Lâu Mộng (红楼梦): Kiệt tác văn học vĩ đại nhất của Tào Tuyết Cần tái hiện tỉ mỉ sự suy vi của đại gia tộc phong kiến, được tôn xưng thành một bộ môn nghiên cứu riêng mang tên 'Hồng học'.",
      "Quốc Bảo Nghệ Thuật Kinh Kịch (京剧): Sự kiện 'Tứ đại Huy ban tiến kinh' nhân dịp mừng thọ vua Càn Long đã dung hợp các làn điệu xướng ca khắp miền nam bắc thành nghệ thuật sân khấu quốc gia.",
      "Tứ Khố Toàn Thư & Khang Hy Từ Điển: Bộ từ điển chữ Hán chuẩn mực đồ sộ nhất gồm hơn 47.000 chữ và bộ bách khoa toàn thư gồm hơn 36.000 tập lưu giữ tinh hoa thư tịch cổ.",
      "Kiến Trúc Hoa Viên Di Hòa Viên & Viên Minh Viên: Đỉnh cao nghệ thuật kiến trúc hoa viên hoàng gia sơn thủy hữu tình kết hợp phong cách đông tây."
    ],
    customsEmergence: [
      "Trang Phục Xường Xám (Kỳ Bào - 旗袍): Trang phục truyền thống của phụ nữ Mãn Châu với cổ áo đứng, cài cúc ngọc bên mép, tà xẻ duyên dáng, sau này được cách tân thành quốc phục thanh lịch của phụ nữ Á Đông.",
      "Tục Tóc Đuôi Sam & Cạo Nửa Đầu (Thế phát dịch phục - 剃发易服): Triều đình Mãn Thanh ban lệnh bắt buộc nam giới cạo nửa phần đầu phía trước và tết đuôi sam dài phía sau.",
      "Thói Quen Thưởng Trà Bát Bảo & Chim Cảnh: Thú chơi tao nhã của người dân Bắc Kinh: sáng sớm xách lồng chim ra công viên, vào quán trà thưởng thức trà hoa cúc, xem tạp kỹ."
    ],
    warsAndBattles: [
      {
        name: "Loạn Tam Phiên (三藩之乱)",
        hanzi: "三藩之乱",
        pinyin: "Sānfān zhī Luàn",
        year: "1673 – 1681 SCN",
        combatants: "Khang Hy Đế vs Ba phiên vương phản loạn (Ngô Tam Quế, Cảnh Tinh Trung, Thượng Khả Hỷ)",
        description: "Khang Hy khi mới 20 tuổi quyết đoán ban lệnh triệt tiêu ba chư hầu lộng quyền miền nam. Ngô Tam Quế dấy binh phản Thanh chiếm gần nửa giang sơn. Khang Hy kiên định chỉ huy quân Bát Kỳ và Lục Doanh từng bước cô lập và tiêu diệt phản quân sau 8 năm giao tranh ác liệt.",
        significance: "Xóa bỏ mầm mống cát cứ phiên vương, củng cố vững chắc quyền lực trung ương của nhà Thanh."
      },
      {
        name: "Chiến Tranh Nha Phiến (鸦片战争)",
        hanzi: "第一次鸦片战争",
        pinyin: "Yāpiàn Zhànzhēng",
        year: "1840 – 1842 SCN",
        combatants: "Đế quốc Anh vs Triều đình Mãn Thanh",
        description: "Sau sự kiện Lâm Tắc Từ tịch thu và tiêu hủy nha phiến tại Hổ Môn, Hải quân Anh dùng tàu bọc thép và đại bác tối tân tấn công các cảng biển Quảng Châu, Ninh Ba, Thiên Tân. Quân Thanh lạc hậu thảm bại, buộc phải ký Hiệp ước Nam Kinh nhượng Hồng Kông và bồi thường chiến phí khổng lồ.",
        significance: "Mở đầu thời kỳ cận đại đầy đau thương và biến động, xã hội Trung Quốc rơi vào khủng hoảng nửa thuộc địa nửa phong kiến."
      },
      {
        name: "Khởi Nghĩa Thái Bình Thiên Quốc (太平天国起义)",
        hanzi: "太平天国运动",
        pinyin: "Tàipíng Tiānguó Qǐyì",
        year: "1851 – 1864 SCN",
        combatants: "Nghĩa quân Hồng Tú Toàn vs Quân triều đình Mãn Thanh (Tăng Quốc Phiên, Lý Hồng Chương)",
        description: "Hồng Tú Toàn thành lập 'Bái Thượng Đế Hội' phát động khởi nghĩa Kim Điền, quét qua miền nam thành lập chính quyền Thái Bình Thiên Quốc đóng đô tại Thiên Kinh (Nam Kinh). Quân Thanh phải dựa vào các đạo quân địa phương Tương Quân và Hoài Quân đánh phá dữ dội suốt 14 năm mới đàn áp xong.",
        significance: "Phong trào nông dân lớn nhất trong lịch sử thế giới cận đại làm rung chuyển tận gốc rễ quyền thống trị của triều đình Mãn Thanh."
      },
      {
        name: "Chiến Tranh Giáp Ngọ & Khởi Nghĩa Vũ Xương (1894 & 1911)",
        hanzi: "甲午中日战争与武昌起义",
        pinyin: "Jiǎwǔ Zhànzhēng & Wǔchāng Qǐyì",
        year: "1894 & 1911 SCN",
        combatants: "Hạm đội Bắc Dương vs Hải quân Nhật Bản / Nghĩa quân Tân Hợi vs Triều đình Thanh",
        description: "Chiến tranh Giáp Ngọ 1894 kết thúc bằng việc Hạm đội Bắc Dương bị tiêu diệt hoàn toàn tại Uy Hải Vệ, triều đình ký Điều ước Mã Quan nhượng Đài Loan. Sự bất lực của hoàng quyền thôi thúc Tôn Trung Sơn và các chí sĩ lãnh đạo Cách Mạng Tân Hợi (khởi nghĩa Vũ Xương 10/10/1911), buộc Hoàng đế Phổ Nghi thoái vị.",
        significance: "Chấm dứt hoàn toàn triều đại nhà Thanh và hơn 2.000 năm chế độ quân chủ chuyên chế tại Trung Quốc, khai sinh nền cộng hòa."
      }
    ],
    keywords: [
      { hanzi: "红楼梦", pinyin: "Hónglóumèng", meaning: "Hồng Lâu Mộng (Đỉnh cao văn học)" },
      { hanzi: "京剧", pinyin: "Jīngjù", meaning: "Kinh kịch (Nghệ thuật quốc bảo)" },
      { hanzi: "鸦片战争", pinyin: "Yāpiàn zhànzhēng", meaning: "Chiến tranh Nha phiến (1840)" },
      { hanzi: "辛亥革命", pinyin: "Xīnhài gémìng", meaning: "Cách mạng Tân Hợi (1911)" }
    ],
    quote: {
      hanzi: "满纸荒唐言，一把辛酸泪。都云作者痴，谁解其中味？",
      pinyin: "Mǎn zhǐ huāngtáng yán, yì bǎ xīnsuān lèi. Dōu yún zuòzhě chī, shéi jiě qí zhōng wèi?",
      meaning: "Đầy trang những lời tưởng hoang đường, mà chan chứa một bầu nước mắt cay đắng. Ai cũng bảo tác giả ngây dại, hỏi ai thấu hiểu được nỗi niềm trong đó? (Tào Tuyết Cần - Mở đầu Hồng Lâu Mộng)."
    }
  },

  // 13. THỜI KỲ DÂN QUỐC & TRUNG HOA HIỆN ĐẠI
  {
    id: "era_13_modern",
    order: 13,
    period: "1912 – Hiện Nay",
    eraName: "Thời Dân Quốc & Đương Đại",
    category: "modern_era",
    categoryName: "Chuyển Mình Đương Đại",
    categoryColor: "teal",
    badge: "Bạch Thoại Văn & Đổi Mới Số",
    title: "Dân Quốc & Hiện Đại (民国与当代) - Phong Trào Ngũ Tứ & Kỷ Nguyên Số",
    pinyin: "Mínguó yǔ Xiàndài (1912 – Nay)",
    summary: "Bước ngoặt hiện đại hóa toàn diện của dân tộc Trung Hoa: Phong trào Tân Văn Hóa (Ngũ Tứ 1919) thay thế văn ngôn cổ hủ bằng Bạch thoại văn gần gũi; chuẩn hóa Chữ Hán Giản Thể và hệ thống Phiên âm Pinyin; kiên cường vượt qua Chiến tranh Kháng Nhật; tiến tới kỷ nguyên đổi mới sáng tạo, công nghệ cao và kinh tế số toàn cầu.",
    cultureEmergence: [
      "Phong Trào Tân Văn Hóa & Ngũ Tứ (五四运动 - 1919): Lỗ Tấn, Hồ Thích, Trần Độc Tú khởi xướng phong trào dùng chữ Bạch Thoại (ngôn ngữ đời thường) viết văn thay cho chữ Nho cổ; Lỗ Tấn xuất bản *Nhật Ký Người Điên* - tác phẩm bạch thoại hiện đại đầu tiên.",
      "Chuẩn Hóa Chữ Hán Giản Thể & Pinyin (汉语拼音): Thập niên 1950, phương án giản thể hóa các chữ Hán phức tạp và hệ thống ký âm Pinyin chữ Latinh được ban hành, giúp hàng trăm triệu người xóa nạn mù chữ và mở đường cho người nước ngoài dễ dàng học tiếng Trung trên toàn cầu.",
      "Khoa Học Công Nghệ & Kỷ Nguyên Số: Đổi mới phát triển vượt bậc với mạng lưới đường sắt cao tốc dài nhất thế giới, chương trình thám hiểm không gian Thường Nga lên Mặt Trăng, trạm vũ trụ Thiên Cung và nền kinh tế số thanh toán di động hàng đầu thế giới."
    ],
    customsEmergence: [
      "Hòa Nhập Song Hành Giữa Hiện Đại & Truyền Thống: Đón Tết Dương lịch theo quốc tế nhưng Tết Nguyên Đán, Tết Thanh Minh, Tết Trung Thu vẫn là những ngày lễ đoàn tụ linh thiêng nhất trong trái tim người dân.",
      "Văn Hóa Giới Trẻ 'Quốc Triều' (国潮 - Guochao): Giới trẻ hiện đại say mê mặc trang phục cổ trang Hán phục dạo phố, kết hợp âm nhạc truyền thống đàn tranh với nhạc điện tử và phong cách thiết kế mỹ thuật cổ phong.",
      "Nếp Sống Tiện Nghi Công Nghệ: Quét mã QR thanh toán không tiền mặt, gọi xe công nghệ, sử dụng xe đạp công cộng và lối sống xanh giảm phát thải carbon bảo vệ môi trường."
    ],
    warsAndBattles: [
      {
        name: "Chiến Tranh Kháng Nhật Toàn Dân (抗日战争)",
        hanzi: "中国抗日战争",
        pinyin: "Kàngrì Zhànzhēng",
        year: "1937 – 1945",
        combatants: "Quân dân Trung Quốc vs Quân phiệt phát xít Nhật Bản",
        description: "Bắt đầu từ sự kiện Lưỡng Câu Kiều (7/7/1937), toàn dân tộc kết thành Mặt trận thống nhất chống quân phiệt Nhật. Trải qua những trận chiến đẫm máu anh dũng như Hội chiến Tùng Hỗ (Thượng Hải), Chiến dịch Đài Nhi Trang, Trận Bình Hình Quan và Đại chiến Bách Đoàn. Với sự kiên trì kháng chiến không lùi bước, quân dân Trung Quốc đã kìm chân 1,5 triệu quân Nhật, góp phần quyết định vào thắng lợi của phe Đồng Minh trong Thế chiến thứ hai.",
        significance: "Thắng lợi hoàn toàn đầu tiên của dân tộc Trung Hoa trước đế quốc ngoại xâm thời cận đại, nâng cao vị thế quốc tế của đất nước."
      },
      {
        name: "Cuộc Vạn Lý Trường Chinh (长征)",
        hanzi: "中国工农红军长征",
        pinyin: "Chángzhēng",
        year: "1934 – 1936",
        combatants: "Hồng quân Công Nông vs Quân đội Quốc Dân Đảng",
        description: "Cuộc chuyển quân chiến lược thần kỳ dài hơn 25.000 dặm (12.500 km) của Hồng quân vượt qua 14 tỉnh, trèo qua những ngọn núi tuyết quanh năm giá rét, vượt qua đầm lầy chết chóc, đánh phá hàng trăm đợt phục kích của đối phương để bảo tồn ngọn lửa cách mạng tại Diên An.",
        significance: "Bản anh hùng ca quân sự bất hủ tôi luyện nên tinh thần tự cường kiên định phi thường của thế hệ kiến thiết tương lai."
      },
      {
        name: "Sự Kiện Thành Lập Nước CHND Trung Hoa (1949)",
        hanzi: "中华人民共和国成立",
        pinyin: "Zhōnghuá Rénmín Gònghéguó chénglì",
        year: "1/10/1949",
        combatants: "Kết thúc cuộc Nội chiến Quốc - Cộng",
        description: "Sau 3 đại chiến dịch Liêu Thẩm, Hoài Hải, Bình Tân, ngày 1 tháng 10 năm 1949 tại quảng trường Thiên An Môn, Chủ tịch Mao Trạch Đông long trọng tuyên bố thành lập nước Cộng hòa Nhân dân Trung Hoa, mở ra kỷ nguyên mới độc lập và phát triển.",
        significance: "Chấm dứt hơn 100 năm loạn lạc, chia cắt và bị ngoại bang can thiệp, mở ra chặng đường hiện đại hóa đất nước."
      }
    ],
    keywords: [
      { hanzi: "五四运动", pinyin: "Wǔsì yùndòng", meaning: "Phong trào Ngũ Tứ (1919)" },
      { hanzi: "抗日战争", pinyin: "Kàngrì zhànzhēng", meaning: "Chiến tranh Kháng Nhật (1937-1945)" },
      { hanzi: "国潮", pinyin: "Guócháo", meaning: "Làn sóng văn hóa Quốc Triều hiện đại" },
      { hanzi: "绿水青山", pinyin: "Lǜshuǐ qīngshān", meaning: "Non xanh nước biếc (Bảo vệ môi trường)" }
    ],
    quote: {
      hanzi: "希望是本无所谓有，无所谓无的。这正如地上的路；其实地上本没有路，走的人多了，也便成了路。",
      pinyin: "Xīwàng shì běn wúsuǒwèi yǒu, wúsuǒwèi wú de. Zhè zhèngrú dì shang de lù; qíshí dì shang běn méiyǒu lù, zǒu de rén duō le, yě biàn chéng le lù.",
      meaning: "Hy vọng vốn không thể nói là có, cũng không thể nói là không. Điều đó cũng giống như con đường trên mặt đất; kỳ thực trên mặt đất vốn làm gì có đường, người ta đi mãi thì thành đường thôi (Lỗ Tấn - Cố Hương)."
    }
  }
];

// Combine cultureEmergence, customsEmergence, and warsAndBattles into highlights for backward compatibility
for (const item of cultureData) {
  const hList = [];
  if (item.cultureEmergence) {
    item.cultureEmergence.slice(0, 2).forEach(c => hList.push(`Văn hóa: ${c.split(':')[0]}`));
  }
  if (item.customsEmergence) {
    item.customsEmergence.slice(0, 2).forEach(c => hList.push(`Phong tục: ${c.split(':')[0]}`));
  }
  if (item.warsAndBattles) {
    item.warsAndBattles.slice(0, 1).forEach(w => hList.push(`Chiến sự: ${w.name} (${w.year})`));
  }
  item.highlights = hList;
}

const outputPath = dataFile('culture.json');
fs.writeFileSync(outputPath, JSON.stringify(cultureData, null, 2), 'utf8');
console.log(`[Culture Timeline Master] Generated ${cultureData.length} comprehensive chronological epochs in ${outputPath}`);
