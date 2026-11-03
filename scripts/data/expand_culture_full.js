const { dataFile } = require('./paths');
const fs = require('fs');
const path = require('path');

const existingPath = dataFile('culture.json');
const current = JSON.parse(fs.readFileSync(existingPath, 'utf8'));

const newCulture = [
  {
    id: "festival_chongyang",
    category: "festivals",
    categoryName: "Lễ Hội Truyền Thống",
    categoryColor: "amber",
    title: "Tết Trùng Cửu (重阳节) - Lễ Kính Lão & Đăng Cao",
    pinyin: "Chóngyáng Jié (Mùng 9 tháng 9 Âm lịch)",
    period: "Mùng 9 tháng 9 Âm lịch",
    badge: "Đạo Hiếu Cổ Truyền",
    summary: "Số 9 là số cực dương trong Dịch học, hai số 9 gặp nhau gọi là 'Trùng Cửu'. Đây là dịp con cháu bày tỏ lòng hiếu kính với ông bà cha mẹ, leo núi ngắm hoa cúc và cài nhánh thù du cầu bình an.",
    highlights: [
      "Đăng cao (登高): Tập tục leo núi ngắm cảnh thu, hít thở không khí trong lành và xua tan vận rủi.",
      "Uống rượu hoa cúc & Ăn bánh Trùng Cửu (重阳糕): Hoa cúc nở vào tiết thu tượng trưng cho sự trường thọ, bền bỉ.",
      "Ngày hội Kính lão (敬老节): Tôn vinh nét đẹp truyền thống uống nước nhớ nguồn, kính trọng người cao tuổi."
    ],
    keywords: [
      { hanzi: "登高", pinyin: "Dēnggāo", meaning: "Leo núi ngắm cảnh" },
      { hanzi: "菊花酒", pinyin: "Júhuājiǔ", meaning: "Rượu hoa cúc" },
      { hanzi: "敬老", pinyin: "Jìnglǎo", meaning: "Kính trọng người cao tuổi" },
      { hanzi: "茱萸", pinyin: "Zhūyú", meaning: "Cây thù du trừ tà" }
    ],
    quote: {
      hanzi: "独在异乡为异客，每逢佳节倍思亲。遥知兄弟登高处，遍插茱萸少一人。",
      pinyin: "Dú zài yìxiāng wéi yìkè, měi féng jiājié bèi sī qīn. Yáo zhī xiōngdì dēnggāo chù, biàn chā zhūyú shǎo yì rén.",
      meaning: "Một mình đất khách làm thân khách, mỗi độ tiết xuân lại nhớ nhà. Xa ngóng anh em nơi đỉnh núi, cài cành thù du vắng một ta. (Vương Duy)"
    }
  },
  {
    id: "arts_eight_cuisines",
    category: "arts",
    categoryName: "Nghệ Thuật & Ẩm Thực",
    categoryColor: "emerald",
    title: "Bát Đại Thái Hệ (八大菜系) - Tinh Hoa Ẩm Thực Trung Hoa",
    pinyin: "Bādà Càixì",
    period: "Trầm tích hàng ngàn năm",
    badge: "Quốc Hồn Ẩm Thực",
    summary: "Ẩm thực Trung Hoa nổi tiếng thế giới nhờ sự biến hóa phong phú theo địa lý và khí hậu, đúc kết thành 8 trường phái lớn: Xuyên (cay nồng), Lỗ (đậm đà), Việt (tươi ngọt), Tô (tinh tế), Mân, Chiết, Tương, Huy.",
    highlights: [
      "Xuyên thái (川菜 - Tứ Xuyên): Nổi danh với vị cay tê ma lạt (麻辣), món Lẩu Tứ Xuyên, Đậu phụ Ma Bà (麻婆豆腐).",
      "Việt thái (粤菜 - Quảng Đông): Chú trọng độ tươi nguyên bản của nguyên liệu, nghệ thuật Dimsum (点心) và các món canh bổ dưỡng.",
      "Lỗ thái (鲁菜 - Sơn Đông): Đứng đầu ẩm thực cung đình Bắc phương, sở trường các món canh trong, canh sữa và kỹ thuật xào rán hỏa hầu cao.",
      "Tô thái (苏菜 - Giang Tô): Tinh tế ngọt thanh, dao pháp tỉ mỉ, nổi tiếng với món Cá chẽm tùng thử (松鼠鳜鱼)."
    ],
    keywords: [
      { hanzi: "色香味俱全", pinyin: "Sè xiāng wèi jù quán", meaning: "Sắc, hương, vị vẹn toàn" },
      { hanzi: "麻辣", pinyin: "Málà", meaning: "Cay tê đầu lưỡi" },
      { hanzi: "点心", pinyin: "Diǎnxin", meaning: "Món ăn nhẹ Dimsum" },
      { hanzi: "火候", pinyin: "Huǒhou", meaning: "Nghệ thuật canh độ lửa" }
    ],
    quote: {
      hanzi: "民以食为天，食以味为先。",
      pinyin: "Mín yǐ shí wéi tiān, shí yǐ wèi wéi xiān.",
      meaning: "Dân lấy miếng ăn làm trời, món ăn lấy phong vị làm trọng."
    }
  },
  {
    id: "classics_solar_terms",
    category: "classics",
    categoryName: "Di Sản Tri Thức",
    categoryColor: "purple",
    title: "24 Tiết Khí (二十四节气) - Di Sản Văn Hóa Phi Vật Thể UNESCO",
    pinyin: "Èrshísì Jiéqì",
    period: "Cổ đại đến nay",
    badge: "Di Sản Thế Giới",
    summary: "Hệ thống lịch pháp thiên văn độc nhất vô nhị do người xưa sáng tạo dựa trên vị trí của mặt trời trên hoàng đạo, hướng dẫn sản xuất nông nghiệp và lối sống dưỡng sinh suốt bốn mùa.",
    highlights: [
      "Bốn mùa luân chuyển: Bắt đầu từ Lập Xuân (立春), Vũ Thủy, Kinh Trập, Xuân Phân... trải qua Hạ, Thu và kết thúc ở Đại Hàn (大寒).",
      "Thuận theo tự nhiên: Mỗi tiết khí dài khoảng 15 ngày, gắn liền với tập tục ăn uống và nếp sống dưỡng sinh thuận theo đất trời.",
      "Giá trị di sản: Năm 2016, 24 Tiết Khí chính thức được UNESCO công nhận là Di sản Văn hóa Phi vật thể của nhân loại."
    ],
    keywords: [
      { hanzi: "立春", pinyin: "Lìchūn", meaning: "Tiết Lập Xuân (bắt đầu mùa xuân)" },
      { hanzi: "夏至", pinyin: "Xiàzhì", meaning: "Tiết Hạ Chí (ngày dài nhất trong năm)" },
      { hanzi: "秋分", pinyin: "Qiūfēn", meaning: "Tiết Thu Phân (ngày đêm dài bằng nhau)" },
      { hanzi: "冬至", pinyin: "Dōngzhì", meaning: "Tiết Đông Chí (ăn sủi cảo / thang viên)" }
    ],
    quote: {
      hanzi: "春雨惊春清谷天，夏满芒夏暑相连。秋处露秋寒霜降，冬雪雪冬小大寒。",
      pinyin: "Chūn yǔ jīng chūn qīng gǔ tiān, xià mǎn máng xià shǔ xiāng lián...",
      meaning: "Bài ca vần ghi nhớ chuẩn xác trọn vẹn 24 Tiết khí trong năm."
    }
  },
  {
    id: "arts_siheyuan",
    category: "arts",
    categoryName: "Nghệ Thuật & Kiến Trúc",
    categoryColor: "emerald",
    title: "Tứ Hợp Viện & Triết Lý Phong Thủy Cổ Đại (四合院)",
    pinyin: "Sìhéyuàn",
    period: "Nhà Nguyên, Minh, Thanh",
    badge: "Kiến Trúc Kinh Điển",
    summary: "Kiểu nhà truyền thống đặc trưng của Bắc Kinh với bốn dãy nhà quây quanh một sân trời trung tâm, phản ánh trọn vẹn trật tự tôn ti gia đình và triết lý trời tròn đất vuông trong phong thủy Á Đông.",
    highlights: [
      "Cấu trúc tứ diện: Nhà chính (Chính phòng) quay mặt về hướng Nam đón ánh nắng, hai bên là Đông sương phòng và Tây sương phòng, phía trước là Đảo tọa phòng.",
      "Kín đáo và tĩnh tại: Tường bao bọc kín khép kín với bên ngoài tạo không gian sống biệt lập, ấm cúng và an toàn cho gia tộc nhiều thế hệ.",
      "Cây cối trong sân: Giữa sân thường trồng cây lựu (đông con nhiều cháu) và bể nuôi cá vàng mang lại tài lộc dồi dào."
    ],
    keywords: [
      { hanzi: "天圆地方", pinyin: "Tiān yuán dì fāng", meaning: "Trời tròn đất vuông" },
      { hanzi: "正房", pinyin: "Zhèngfáng", meaning: "Gian nhà chính (dành cho trưởng bối)" },
      { hanzi: "影壁", pinyin: "Yǐngbì", meaning: "Bức bình phong chắn trước cửa" },
      { hanzi: "胡同", pinyin: "Hútòng", meaning: "Ngõ ngách cổ kính của Bắc Kinh" }
    ],
    quote: {
      hanzi: "院和宁，家和兴。一座四合院，半部北京史。",
      pinyin: "Yuàn hé níng, jiā hé xīng. Yí zuò sìhéyuàn, bàn bù Běijīng shǐ.",
      meaning: "Sân nhà an định, gia đạo hưng thịnh. Một nếp Tứ Hợp Viện chở nửa phần lịch sử Bắc Kinh."
    }
  },
  {
    id: "arts_hanfu_qipao",
    category: "arts",
    categoryName: "Nghệ Thuật & Trang Phục",
    categoryColor: "emerald",
    title: "Hán Phục & Xường Xám (汉服与旗袍) - Nét Đẹp Y Phục Hoa Hạ",
    pinyin: "Hànfú Yǔ Qípáo",
    period: "Hán, Đường, Minh, Dân Quốc",
    badge: "Y Quan Hoa Hạ",
    summary: "Trung Hoa tự cổ được xưng tụng là 'Hoa Hạ' (Hoa là nét đẹp y phục rực rỡ, Hạ là lễ nghi đại quốc). Từ tà áo Hán phục thanh tao thoát tục đến đường cong trang nhã của tà áo Xường xám Dân Quốc.",
    highlights: [
      "Hán phục (汉服): Tay áo rộng giao lĩnh hữu nhậm (vạt áo trái đè lên vạt phải), thắt lưng dải lụa mềm mại, tượng trưng cho sự bao dung và cốt cách thanh tao.",
      "Đường phong lộng lẫy (唐制汉服): Váy Tề hung (quây ngực) thêu hoa văn tinh xảo, thể hiện sự tự tin và phồn vinh cực thịnh của thời đại hoàng kim.",
      "Xường xám (旗袍): Xuất phát từ thời Mãn Thanh và cách tân tại Thượng Hải thập niên 1930, tôn vinh vẻ đẹp kín đáo mà quyến rũ của người phụ nữ phương Đông."
    ],
    keywords: [
      { hanzi: "衣冠华夏", pinyin: "Yīguān Huáxià", meaning: "Nước lễ nghi y phục rạng ngời" },
      { hanzi: "交领右衽", pinyin: "Jiāolǐng yòurèn", meaning: "Cổ áo chéo, vạt đè bên phải" },
      { hanzi: "盘扣", pinyin: "Pánkòu", meaning: "Khuy áo tết hoa truyền thống" },
      { hanzi: "刺绣", pinyin: "Cìxiù", meaning: "Nghệ thuật thêu tay thủ công" }
    ],
    quote: {
      hanzi: "中国有礼仪之大，故称夏；有服章之美，谓之华。",
      pinyin: "Zhōngguó yǒu lǐyí zhī dà, gù chēng Xià; yǒu fúzhāng zhī měi, wèi zhī Huá.",
      meaning: "Trung Hoa có lễ nghi to lớn nên xưng là Hạ; có trang phục mỹ lệ nên gọi là Hoa."
    }
  }
];

const allCulture = [...current, ...newCulture];
fs.writeFileSync(existingPath, JSON.stringify(allCulture, null, 2), 'utf8');
console.log(`Đã xuất sắc nâng cấp Văn Hóa Trung Hoa lên ${allCulture.length} Thẻ Văn Hóa Toàn Diện tại ${existingPath}`);
