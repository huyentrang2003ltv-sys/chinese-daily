const { dataFile } = require('./paths');
const fs = require('fs');
const path = require('path');

const roadmapPath = dataFile('hsk30_roadmap.json');
const d = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));

const hsk46Section = {
  level: "HSK 4 - 6",
  description: "14 cấu trúc phức hợp, câu đặc thù và cặp liên từ chuyên sâu nâng cao năng lực viết luận và tranh luận.",
  items: [
    {
      id: "gram_4_1",
      title: "Câu Chữ 把 (把字句) - Xử Lý Tân Ngữ",
      pattern: "Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác",
      explanation: "Dùng để nhấn mạnh hành động tác động lên đối tượng cụ thể và làm thay đổi vị trí, trạng thái hoặc tính chất của đối tượng đó. Sau động từ nhất thiết phải có thành phần khác (trợ từ, bổ ngữ, lặp lại động từ).",
      example: "请把你的护照和机票拿出来给我看一下。",
      pinyin: "Qǐng bǎ nǐ de hùzhào hé jīpiào ná chūlái gěi wǒ kàn yíxià.",
      translation: "Xin hãy lấy hộ chiếu và vé máy bay của bạn ra cho tôi xem một chút.",
      notes: "Động từ phải là ngoại động từ mang tính xử lý; không dùng các động từ tri giác, tâm lý như 知道, 喜欢, 有..."
    },
    {
      id: "gram_4_2",
      title: "Câu Chữ 被 (被字句) - Thể Bị Động",
      pattern: "Chủ ngữ (kẻ chịu tác động) + 被 / 叫 / 让 + Tác nhân + Động từ + Thành phần khác",
      explanation: "Biểu thị chủ ngữ tiếp nhận tác động từ người hoặc sự vật khác. Thường mang ý nghĩa không mong muốn hoặc chịu tổn hại, nhưng trong văn phong hiện đại cũng dùng cho ý nghĩa tích cực hoặc trung tính.",
      example: "那本珍贵的新华字典被他借走了。",
      pinyin: "Nà běn zhēnguì de xīnhuá zìdiǎn bèi tā jiè zǒu le.",
      translation: "Cuốn từ điển Tân Hoa quý giá đó đã bị anh ấy mượn đi rồi.",
      notes: "Phủ định 不 / 没(有) và phó từ chỉ thời gian phải đặt TRƯỚC chữ 被."
    },
    {
      id: "gram_4_3",
      title: "Cấu Trúc Nhấn Mạnh 连...都/也... (Ngay Cả... Cũng...)",
      pattern: "连 + Thành phần được nhấn mạnh + 都 / 也 + Động từ / Vị ngữ",
      explanation: "Dùng để nhấn mạnh trường hợp cực đoan hoặc sự việc nổi bật nhất, qua đó suy ra các trường hợp bình thường khác cũng như vậy.",
      example: "这个汉字连汉语老师都需要查字典。",
      pinyin: "Zhè ge hànzì lián hànyǔ lǎoshī dōu xūyào chá zìdiǎn.",
      translation: "Chữ Hán này ngay cả giáo viên tiếng Trung cũng cần phải tra từ điển.",
      notes: "Có thể nhấn mạnh chủ ngữ, tân ngữ hoặc vị ngữ."
    },
    {
      id: "gram_4_4",
      title: "Cấu Trúc Biến Thiên 越...越... (Càng... Càng...)",
      pattern: "越 + Điều kiện / Mức độ A + 越 + Kết quả / Mức độ B",
      explanation: "Biểu thị mức độ biến đổi của sự việc hoặc tâm trạng tăng dần theo thời gian hoặc phụ thuộc vào điều kiện phát triển.",
      example: "中文语法虽然复杂，但是越学越觉得有趣。",
      pinyin: "Zhōngwén yǔfǎ suīrán fùzá, dànshì yuè xué yuè juéde yǒuqù.",
      translation: "Ngữ pháp tiếng Trung tuy phức tạp nhưng càng học lại càng thấy thú vị.",
      notes: "Nếu hai vế cùng một chủ ngữ thì không cần nhắc lại chủ ngữ."
    },
    {
      id: "gram_4_5",
      title: "Cặp Liên Từ 既然...就... (Đã... Thì...)",
      pattern: "既然 + Tiền đề đã xảy ra / Thừa nhận + 就 + Kết luận / Giải pháp",
      explanation: "Nêu ra một tiền đề hiển nhiên đã xảy ra hoặc được cả hai bên thừa nhận, từ đó rút ra kết luận, quyết định hoặc lời khuyên hợp lý.",
      example: "既然大家都同意这个方案，那我们就立即开始执行吧。",
      pinyin: "Jìrán dàjiā dōu tóngyì zhè ge fāng’àn, nà wǒmen jiù lìjí kāishǐ zhíxíng ba.",
      translation: "Đã mọi người đều đồng ý phương án này, vậy thì chúng ta lập tức bắt đầu thực thi đi.",
      notes: "Khác với 因为...所以...: 既然 nhấn mạnh việc đưa ra quyết định dựa trên sự thật đã rồi."
    },
    {
      id: "gram_4_6",
      title: "Cặp Liên Từ Tăng Tiến 不仅...而且... (Không Chỉ... Mà Còn...)",
      pattern: "不仅 + Đặc điểm 1 + 而且 + Đặc điểm 2 (cấp tiến)",
      explanation: "Biểu thị ý nghĩa tăng tiến, vế sau bổ sung thêm thông tin có mức độ sâu hơn hoặc phạm vi rộng hơn vế trước.",
      example: "人工智能不仅提高了工作效率，而且深刻改变了人们的生活方式。",
      pinyin: "Rén’gōng zhìnéng bùjǐn tígāo le gōngzuò xiàolǜ, érqiě shēnkè gǎibiàn le rénmen de shēnghuó fāngshì.",
      translation: "Trí tuệ nhân tạo không chỉ nâng cao hiệu suất làm việc mà còn thay đổi sâu sắc lối sống của con người.",
      notes: "Nếu cùng chủ ngữ, 不仅 đặt sau chủ ngữ; nếu khác chủ ngữ, 不仅 đặt trước chủ ngữ thứ nhất."
    },
    {
      id: "gram_4_7",
      title: "Cặp Điều Kiện Đầy Đủ 只要...就... (Chỉ Cần... Là...)",
      pattern: "只要 + Điều kiện cần thiết + 就 + Kết quả nhất định xảy ra",
      explanation: "Vế trước đưa ra một điều kiện đầy đủ (chỉ cần có điều kiện này là đủ), vế sau biểu thị kết quả tự nhiên tương ứng.",
      example: "只要坚持每天背诵20个生词，一年后你的词汇量就会突破七千。",
      pinyin: "Zhǐyào jiānchí měitiān bèisòng èrshí ge shēngcí, yì nián hòu nǐ de cíhuìliàng jiù huì tūpò qīqiān.",
      translation: "Chỉ cần kiên trì mỗi ngày học thuộc 20 từ mới, sau một năm vốn từ của bạn sẽ vượt qua 7.000 từ.",
      notes: "Khác với 只有...才... ở chỗ 只要 không yêu cầu điều kiện duy nhất."
    },
    {
      id: "gram_4_8",
      title: "Cặp Điều Kiện Thiết Yếu 只有...才... (Chỉ Có... Mới...)",
      pattern: "只有 + Điều kiện DUY NHẤT bắt buộc + 才 + Kết quả",
      explanation: "Nhấn mạnh vế trước là điều kiện duy nhất, không có điều kiện nào khác thay thế được, vế sau mới có thể xuất hiện kết quả.",
      example: "只有深入了解中国文化，才能真正学好地道的汉语。",
      pinyin: "Zhǐyǒu shēnrù liǎojiě zhōngguó wénhuà, cáinéng zhēnzhèng xuéhǎo dìdao de hànyǔ.",
      translation: "Chỉ có tìm hiểu sâu sắc văn hóa Trung Quốc thì mới có thể học thực sự tốt tiếng Trung bản xứ.",
      notes: "Mang tính tuyệt đối hóa điều kiện."
    },
    {
      id: "gram_4_9",
      title: "Cặp Vô Điều Kiện 无论...都/也... (Bất Kể... Đều...)",
      pattern: "无论 / 不管 + Nghi vấn / Phương án liệt kê + 都 / 也 + Kết quả bất biến",
      explanation: "Vế trước đưa ra các tình huống, giả định hoặc lựa chọn khác nhau; vế sau khẳng định kết quả hoặc thái độ không hề thay đổi.",
      example: "无论遇到多么巨大的挑战，我们都不会轻言放弃梦想。",
      pinyin: "Wúlùn yù dào duōme jùdà de tiǎozhàn, wǒmen dōu bú huì qīng yán fàngqì mèngxiǎng.",
      translation: "Bất kể gặp phải thách thức to lớn nhường nào, chúng tôi đều sẽ không dễ dàng từ bỏ ước mơ.",
      notes: "Sau 无论 nhất thiết phải chứa đại từ nghi vấn (什么, 怎么, 谁...) hoặc kết cấu lựa chọn (还是, A不A)."
    },
    {
      id: "gram_4_10",
      title: "Cặp Giả Định Nhượng Bộ 即使...也... (Cho Dù... Cũng...)",
      pattern: "即使 / 哪怕 + Giả thiết nhượng bộ + 也 + Kết luận",
      explanation: "Thừa nhận một khả năng giả định bất lợi hoặc cực đoan, nhưng kết quả ở vế sau vẫn diễn ra độc lập không bị chi phối.",
      example: "即使明天下大雪，高校毕业答辩会也会按时举行。",
      pinyin: "Jíshǐ míngtiān xià dàxuě, gāoxiào bìyè dàbiànhuì yě huì ànshí jǔxíng.",
      translation: "Cho dù ngày mai có tuyết rơi dày thì buổi bảo vệ tốt nghiệp đại học vẫn sẽ tổ chức đúng giờ.",
      notes: "Khác với 虽然...但是... (việc đã xảy ra); 即使 dùng cho việc giả định chưa hoặc sắp xảy ra."
    },
    {
      id: "gram_4_11",
      title: "Cấu Trúc Đa Diện 一方面...另一方面... (Một Mặt... Mặt Khác...)",
      pattern: "Chủ ngữ + 一方面 + Ý 1, 另一方面 + Ý 2",
      explanation: "Dùng để phân tích một sự vật hoặc hiện tượng dưới hai khía cạnh song song, thể hiện lối tư duy biện chứng và lập luận học thuật.",
      example: "发展绿色经济一方面能够保护生态环境，另一方面也能创造大量新型就业机会。",
      pinyin: "Fāzhǎn lǜsè jīngjì yì fāngmiàn nénggòu bǎohù shēngtài huánjìng, lìng yì fāngmiàn yě néng chuàngzào dàliàng xīnxíng jiùyè jīhuì.",
      translation: "Phát triển kinh tế xanh một mặt có thể bảo vệ môi trường sinh thái, mặt khác cũng tạo ra lượng lớn cơ hội việc làm kiểu mới.",
      notes: "Rất phổ biến trong bài thi Viết luận HSK 5 và Đọc hiểu HSK 6."
    },
    {
      id: "gram_4_12",
      title: "Cấu Trúc Quyết Định 宁可...也不... (Thà... Chứ Không...)",
      pattern: "Chủ ngữ + 宁可 + Phương án chấp nhận gian khổ + 也不 + Phương án vi phạm nguyên tắc",
      explanation: "Thể hiện sự cân nhắc giữa hai điều kiện không hoàn hảo, người nói chủ động lựa chọn phương án gian khổ hơn để kiên định với mục tiêu hoặc phẩm giá.",
      example: "他宁可自己天天加班吃苦，也不愿意给团队同事增添额外的负担。",
      pinyin: "Tā nìngkě zìjǐ tiāntiān jiābān chīkǔ, yě bú yuànyì gěi tuánduì tóngshì zēngtiān éwài de fùdān.",
      translation: "Anh ấy thà bản thân ngày nào cũng tăng ca chịu khổ, chứ nhất định không muốn tạo thêm gánh nặng cho đồng nghiệp.",
      notes: "Vế 宁可 đi kèm phương án được chấp nhận, vế 也不 đi kèm phương án bị bác bỏ."
    },
    {
      id: "gram_4_13",
      title: "Cấu Trúc Tối Ưu Hóa 与其...不如... (Thay Vì... Không Bằng...)",
      pattern: "与其 + Phương án kém hiệu quả + 不如 + Phương án tối ưu vượt trội",
      explanation: "So sánh hai giải pháp khả thi, phủ nhận phương án trước và khẳng định phương án sau mang lại giá trị cao hơn.",
      example: "与其在考试前盲目焦虑，不如静下心来多背几个高频词汇。",
      pinyin: "Yǔqí zài kǎoshì qián mángmù jiāolǜ, bùrú jìngxià xīn lái duō bèi jǐ ge gāopín cíhuì.",
      translation: "Thay vì lo lắng mù quáng trước kỳ thi, chẳng bằng tĩnh tâm lại học thuộc thêm vài từ vựng tần suất cao.",
      notes: "Ngữ khí tích cực hướng tới hành động thiết thực."
    },
    {
      id: "gram_4_14",
      title: "Bổ Ngữ Khả Năng Nâng Cao V + 得/不 + 了 (liǎo)",
      pattern: "Động từ + 得 / 不 + 了 (liǎo)",
      explanation: "Biểu thị năng lực khách quan hoặc điều kiện bên ngoài có cho phép hoàn thành hành động hay không, hoặc diễn tả mức độ chịu đựng.",
      example: "这么多专业的经济学文献，我一个人两三天根本看不了。",
      pinyin: "Zhè me duō zhuānyè de jīngjìxué wénxiàn, wǒ yí ge rén liǎng sān tiān gēnběn kàn bù liǎo.",
      translation: "Nhiều tài liệu kinh tế học chuyên ngành thế này, một mình tôi trong 2 - 3 ngày căn bản không thể nào đọc hết được.",
      notes: "Chữ 了 ở đây đọc âm liǎo (nghĩa là kết thúc, hoàn thành)."
    }
  ]
};

// Check if HSK 4 - 6 already exists
const existingIdx = d.grammarSections.findIndex(s => s.level === "HSK 4 - 6");
if (existingIdx >= 0) {
  d.grammarSections[existingIdx] = hsk46Section;
} else {
  d.grammarSections.push(hsk46Section);
}

fs.writeFileSync(roadmapPath, JSON.stringify(d, null, 2), 'utf8');
const totalGrammar = d.grammarSections.reduce((sum, s) => sum + s.items.length, 0);
console.log(`Success! Total grammar sections: ${d.grammarSections.length}, Total grammar items: ${totalGrammar}`);
