'use strict';

/**
 * AI Chinese Conversational Tutor & Assistant Engine (Trí Tuệ Nhân Tạo Hỏi & Đáp Tiếng Trung)
 * Hỗ trợ:
 * 1. Hội thoại phản xạ tương tác 2 chiều (Hỏi & Trả lời, chủ động hỏi lại học viên).
 * 2. Phân tích ngữ pháp & Bác sĩ sửa lỗi (Grammar Doctor).
 * 3. Dịch thuật 2 chiều chuẩn xác (Translate mode).
 * 4. Tích hợp sẵn Gemini / OpenAI API nếu có key trong .env; kèm bộ não hội thoại chuyên sâu nội bộ 100% offline.
 */

const fs = require('fs');
const path = require('path');
const { PUBLIC_DIR } = require('./config');
const { translate } = require('./translate');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Preload dictionary for vocabulary extraction
const dictWords = [];
try {
  const dictPath = path.join(PUBLIC_DIR, 'data', 'dictionary.json');
  if (fs.existsSync(dictPath)) {
    const data = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    for (const d of data) {
      if (d.title && d.pinyin && d.title.length >= 2) {
        dictWords.push({ word: d.title, pinyin: d.pinyin, vi: d.meaning || '' });
      }
    }
  }
} catch (e) {
  console.warn('AI Tutor dict load error:', e.message);
}

function extractVocabFromChinese(chineseText, limit = 4) {
  if (!chineseText) return [];
  const found = [];
  const seen = new Set();
  for (const item of dictWords) {
    if (chineseText.includes(item.word) && !seen.has(item.word)) {
      seen.add(item.word);
      found.push(item);
      if (found.length >= limit) break;
    }
  }
  return found;
}

/**
 * Cụm từ và ngữ cảnh hội thoại chuyên sâu cho gia sư tiếng Trung
 */
const CONVERSATION_INTENTS = [
  {
    pattern: /(chào|xin chào|hello|hi|helo|alo|hế lô|你好|您好|哈喽|早上好|晚上好)/i,
    reply: {
      hanzi: '你好！我是你的AI中文私教小华 🤖。今天很高兴和你一起练习中文！你今天想聊些什么呢？',
      pinyin: 'Nǐ hǎo! Wǒ shì nǐ de AI zhōngwén sījiào Xiǎohuá. Jīntiān hěn gāoxìng hé nǐ yìqǐ liànxí zhōngwén! Nǐ jīntiān xiǎng liáo xiē shénme ne?',
      vi: 'Xin chào! Mình là Tiểu Hoa, trợ lý gia sư tiếng Trung AI của bạn 🤖. Hôm nay rất vui được cùng bạn luyện tập tiếng Trung! Bạn muốn trò chuyện về chủ đề gì nào?',
      followUp: '你今天过得怎么样？',
      quickReplies: [
        { hanzi: '我今天很好，你呢？', pinyin: 'Wǒ jīntiān hěn hǎo, nǐ ne?', vi: 'Hôm nay mình rất tốt, còn bạn?' },
        { hanzi: '我想提高中文口语。', pinyin: 'Wǒ xiǎng tígāo zhōngwén kǒuyǔ.', vi: 'Mình muốn nâng cao khẩu ngữ tiếng Trung.' },
        { hanzi: '请考我几个HSK词汇！', pinyin: 'Qǐng kǎo wǒ jǐ gè HSK cíhuì!', vi: 'Hãy thử kiểm tra mình vài từ vựng HSK nhé!' }
      ]
    }
  },
  {
    pattern: /(tên là gì|tên gì|bạn tên|bạn là ai|ai đó|叫什么|你是谁|名字)/i,
    reply: {
      hanzi: '我叫小华，是你的专属AI中文助教与语伴。我来自北京，发音标准，随时为你解答中文问题。请问你叫什么名字呢？',
      pinyin: 'Wǒ jiào Xiǎohuá, shì nǐ de zhuānshǔ AI zhōngwén zhùjiào yǔ yǔbàn. Wǒ láizì Běijīng, fāyīn biāozhǔn, suíshí wèi nǐ jiědá zhōngwén wèntí. Qǐngwèn nǐ jiào shénme míngzi ne?',
      vi: 'Mình tên là Tiểu Hoa, là trợ lý và bạn luyện tiếng Trung chuyên biệt của bạn. Mình đến từ Bắc Kinh, phát âm chuẩn phát thanh viên, sẵn sàng giải đáp mọi câu hỏi. Cho hỏi bạn tên là gì vậy?',
      followUp: '请问你叫什么名字？',
      quickReplies: [
        { hanzi: '我叫明英，很高兴认识你！', pinyin: 'Wǒ jiào Míngyīng, hěn gāoxìng rènshi nǐ!', vi: 'Tôi tên là Minh Anh, rất vui được làm quen với bạn!' },
        { hanzi: '我是大学生，叫黄南。', pinyin: 'Wǒ shì dàxuéshēng, jiào Huángnán.', vi: 'Tôi là sinh viên, tên là Hoàng Nam.' },
        { hanzi: '你可以叫我阿华。', pinyin: 'Nǐ kěyǐ jiào wǒ Ā Huá.', vi: 'Bạn có thể gọi tôi là A Hoa.' }
      ]
    }
  },
  {
    pattern: /(tôi tên|mình tên|em tên|tớ tên|anh tên|chị tên|我叫|我的名字)/i,
    reply: {
      hanzi: '认识你真是太开心了！这是一个非常好听的名字。请问你学习中文多长时间了呢？',
      pinyin: 'Rènshi nǐ zhēn shì tài kāixīn le! Zhè shì yí gè fēicháng hǎotīng de míngzi. Qǐngwèn nǐ xuéxí zhōngwén duō cháng shíjiān le ne?',
      vi: 'Rất vui được làm quen với bạn! Tên của bạn nghe rất hay và ý nghĩa. Cho hỏi bạn đã học tiếng Trung được bao lâu rồi?',
      followUp: '你学习中文多长时间了？',
      quickReplies: [
        { hanzi: '我刚开始学一个月。', pinyin: 'Wǒ gāng kāishǐ xué yí gè yuè.', vi: 'Tôi mới bắt đầu học được một tháng.' },
        { hanzi: '我已经学了一年多了。', pinyin: 'Wǒ yǐjīng xué le yì nián duō le.', vi: 'Tôi đã học được hơn một năm rồi.' },
        { hanzi: '我正在备考HSK4级。', pinyin: 'Wǒ zhèngzài bèikǎo HSK sì jí.', vi: 'Tôi đang chuẩn bị thi HSK 4.' }
      ]
    }
  },
  {
    pattern: /(bao nhiêu tuổi|mấy tuổi|năm nay bao nhiêu|多大|几岁|年龄)/i,
    reply: {
      hanzi: '我是AI智能助手，永远都充满活力！在中文里，问长辈可以用“您多大年纪”，问同龄人说“你多大”，问小孩说“你几岁”。你今年多大啦？',
      pinyin: 'Wǒ shì AI zhìnéng zhùshǒu, yǒngyuǎn dōu chōngmǎn huólì! Zài zhōngwén lǐ, wèn zhǎngbèi kěyǐ yòng "Nín duō dà niánjì", wèn tónglíngrén shuō "Nǐ duō dà", wèn xiǎohái shuō "Nǐ jǐ suì". Nǐ jīnnián duō dà la?',
      vi: 'Mình là trợ lý AI thông minh nên lúc nào cũng tràn đầy năng lượng! Trong tiếng Trung, hỏi người lớn tuổi dùng "您多大年纪", bạn bè cùng lứa dùng "你多大", trẻ nhỏ dùng "你几岁". Năm nay bạn bao nhiêu tuổi rồi?',
      followUp: '你今年多大啦？',
      quickReplies: [
        { hanzi: '我今年二十岁。', pinyin: 'Wǒ jīnnián èrshí suì.', vi: 'Năm nay tôi 20 tuổi.' },
        { hanzi: '我今年二十五岁，在工作。', pinyin: 'Wǒ jīnnián èrshíwǔ suì, zài gōngzuò.', vi: 'Năm nay tôi 25 tuổi, đang đi làm.' },
        { hanzi: '这是秘密，哈哈！', pinyin: 'Zhè shì mìmì, hāhā!', vi: 'Bí mật nha, haha!' }
      ]
    }
  },
  {
    pattern: /(người nước nào|ở đâu|quê ở đâu|đến từ đâu|sống ở đâu|哪国人|哪里人|在哪|住哪)/i,
    reply: {
      hanzi: '我是来自中国北京的AI助教。中国有很多美丽的城市，比如北京、上海、成都。你是越南哪里人呢？河内、胡志明市，还是岘港？',
      pinyin: 'Wǒ shì láizì Zhōngguó Běijīng de AI zhùjiào. Zhōngguó yǒu hěn duō měilì de chéngshì, bǐrú Běijīng, Shànghǎi, Chéngdū. Nǐ shì Yuènán nǎlǐ rén ne? Hénèi, Húzhìmíng Shì, háishì Xiàngǎng?',
      vi: 'Mình là trợ lý AI đến từ Bắc Kinh, Trung Quốc. Trung Quốc có rất nhiều thành phố tuyệt đẹp như Bắc Kinh, Thượng Hải, Thành Đô. Bạn là người ở đâu tại Việt Nam? Hà Nội, TP.HCM, hay Đà Nẵng?',
      followUp: '你是越南哪里人呢？',
      quickReplies: [
        { hanzi: '我是河内人，河内秋天很美。', pinyin: 'Wǒ shì Hénèi rén, Hénèi qiūtiān hěn měi.', vi: 'Tôi là người Hà Nội, mùa thu Hà Nội rất đẹp.' },
        { hanzi: '我住在胡志明市，这里很热闹。', pinyin: 'Wǒ zhù zài Húzhìmíng Shì, zhèlǐ hěn rènao.', vi: 'Tôi sống ở TP.HCM, ở đây rất nhộn nhịp.' },
        { hanzi: '我来自美丽的岘港海边。', pinyin: 'Wǒ láizì měilì de Xiàngǎng hǎibiān.', vi: 'Tôi đến từ thành phố biển Đà Nẵng xinh đẹp.' }
      ]
    }
  },
  {
    pattern: /(khỏe không|thế nào|hôm nay thế nào|ổn không|dạo này|怎么样|好吗|身体好吗|最近)/i,
    reply: {
      hanzi: '我非常好，每天能陪大家学习中文让我很开心！“最近怎么样？”是朋友见面最常用的问候语。你今天工作和学习顺利吗？',
      pinyin: 'Wǒ fēicháng hǎo, měitiān néng péi dàjiā xuéxí zhōngwén ràng wǒ hěn kāixīn! "Zuìjìn zěnmeyàng?" shì péngyou jiànmiàn zuì chángyòng de wènhòuyǔ. Nǐ jīntiān gōngzuò hé xuéxí shùnlì ma?',
      vi: 'Mình rất tốt, mỗi ngày được cùng mọi người học tiếng Trung làm mình rất vui! "Dạo này thế nào?" là câu chào hỏi thông dụng nhất giữa bạn bè. Hôm nay việc học tập và công việc của bạn có thuận lợi không?',
      followUp: '你今天工作和学习顺利吗？',
      quickReplies: [
        { hanzi: '一切都很顺利，谢谢关心！', pinyin: 'Yíqiè dōu hěn shùnlì, xièxie guānxīn!', vi: 'Mọi thứ đều thuận lợi, cảm ơn bạn đã quan tâm!' },
        { hanzi: '有点儿忙，但我依然坚持学中文。', pinyin: 'Yǒudiǎnr máng, dàn wǒ yīrán jiānchí xué zhōngwén.', vi: 'Hơi bận một chút, nhưng tôi vẫn kiên trì học tiếng Trung.' },
        { hanzi: '今天学到了很多新词，很有成就感！', pinyin: 'Jīntiān xué dào le hěn duō xīn cí, hěn yǒu chéngjiùgǎn!', vi: 'Hôm nay học được nhiều từ mới, cảm thấy rất vui!' }
      ]
    }
  },
  {
    pattern: /(ăn cơm chưa|ăn gì|món ăn|đói|thức ăn|ẩm thực|chưa ăn|吃饭|吃什么|中国菜|美食|饿)/i,
    reply: {
      hanzi: '在中文文化里，“你吃饭了吗？”也是一种亲切的打招呼方式。中国菜有著名的八大菜系，比如四川的麻婆豆腐、北京烤鸭、广东点心。你最喜欢吃哪道中国菜呢？',
      pinyin: 'Zài zhōngwén wénhuà lǐ, "Nǐ chīfàn le ma?" yě shì yì zhǒng qīnqiè de dǎ zhāohu fāngshì. Zhōngguó cài yǒu zhùmíng de bā dà càixì, bǐrú Sìchuān de mápó dòufu, Běijīng kǎoyā, Guǎngdōng diǎnxin. Nǐ zuì xǐhuan chī nǎ dào Zhōngguó cài ne?',
      vi: 'Trong văn hóa Trung Hoa, "Bạn ăn cơm chưa?" cũng là lời chào hỏi thân tình. Ẩm thực Trung Quốc có 8 trường phái trứ danh như Đậu phụ Ma Bà Tứ Xuyên, Vịt quay Bắc Kinh, Điểm tâm Quảng Đông. Bạn thích ăn món Trung Quốc nào nhất?',
      followUp: '你最喜欢吃哪道中国菜呢？',
      quickReplies: [
        { hanzi: '我最喜欢吃火锅，又香又辣！', pinyin: 'Wǒ zuì xǐhuan chī huǒguō, yòu xiāng yòu là!', vi: 'Tôi thích ăn lẩu nhất, vừa thơm vừa cay!' },
        { hanzi: '我喜欢吃北京烤鸭和小笼包。', pinyin: 'Wǒ xǐhuan chī Běijīng kǎoyā hé xiǎolóngbāo.', vi: 'Tôi thích ăn vịt quay Bắc Kinh và bánh bao Tiểu Long.' },
        { hanzi: '我还没吃过，你能推荐一道吗？', pinyin: 'Wǒ hái méi chī guò, nǐ néng tuījiàn yí dào ma?', vi: 'Tôi chưa ăn bao giờ, bạn gợi ý một món đi?' }
      ]
    }
  },
  {
    pattern: /(thời tiết|trời mưa|trời nắng|lạnh không|nóng không|nhiệt độ|天气|下雨|冷吗|热吗)/i,
    reply: {
      hanzi: '现在北京的天气很舒适。聊天气是日常破冰的极佳话题，比如：“今天天气很好，阳光明媚”或者“外面下大雨了，记得带伞”。你那里的天气怎么样？',
      pinyin: 'Xiànzài Běijīng de tiānqì hěn shūshì. Liáo tiānqì shì rìcháng pòbīng de jíjiā huàtí, bǐrú: "Jīntiān tiānqì hěn hǎo, yángguāng míngmèi" huòzhě "Wàimiàn xià dàyǔ le, jìde dài sǎn". Nǐ nàlǐ de tiānqì zěnmeyàng?',
      vi: 'Thời tiết Bắc Kinh hiện tại rất dễ chịu. Trò chuyện về thời tiết là cách mở đầu câu chuyện rất tự nhiên, ví dụ: "Hôm nay thời tiết đẹp, nắng rực rỡ" hoặc "Bên ngoài trời mưa to, nhớ mang ô nhé". Thời tiết chỗ bạn thế nào?',
      followUp: '你那里的天气怎么样？',
      quickReplies: [
        { hanzi: '今天天气很晴朗，暖洋洋的。', pinyin: 'Jīntiān tiānqì hěn qínglǎng, nuǎnyángyáng de.', vi: 'Hôm nay trời trong xanh, ấm áp.' },
        { hanzi: '今天下雨了，有点儿冷。', pinyin: 'Jīntiān xià yǔ le, yǒudiǎnr lěng.', vi: 'Hôm nay trời mưa, hơi lành lạnh.' },
        { hanzi: '天气太热了，我想去喝奶茶！', pinyin: 'Tiānqì tài rè le, wǒ xiǎng qù hē nǎichá!', vi: 'Thời tiết nóng quá, tôi muốn đi uống trà sữa!' }
      ]
    }
  },
  {
    pattern: /(học tiếng trung|tiếng hoa|khó không|chữ hán|hsk|học từ vựng|nghe nói|khẩu ngữ|tiếng trung có khó không|学中文|汉语难吗|汉字|词汇)/i,
    reply: {
      hanzi: '学习中文刚开始可能会觉得汉字和声调有点挑战，但只要掌握了部首规律和语境记忆，就会越来越有趣！中文语法其实没有像印欧语系复杂的时态变位。你觉得听力、口语还是汉字最难？',
      pinyin: 'Xuéxí zhōngwén gāng kāishǐ kěnéng huì juéde hànzì hé shēngdiào yǒudiǎn tiǎozhàn, dàn zhǐyào zhǎngwò le bùshǒu guīlǜ hé yǔjìng jìyì, jiù huì yuè lái yuè yǒuqù! Zhōngwén yǔfǎ qíshí méiyǒu xiàng yìn’ōuyǔxì fùzá de shítài biànwèi. Nǐ juéde tīnglì, kǒuyǔ háishì hànzì zuì nán?',
      vi: 'Học tiếng Trung lúc đầu có thể thấy chữ Hán và thanh điệu hơi thách thức, nhưng khi nắm được quy luật bộ thủ và học qua ngữ cảnh, bạn sẽ thấy càng học càng cuốn! Ngữ pháp tiếng Trung thực ra không chia thì phức tạp. Bạn thấy phần Nghe, Nói hay Nhớ chữ Hán là khó nhất?',
      followUp: '你觉得听力、口语还是汉字最难？',
      quickReplies: [
        { hanzi: '我觉得记汉字最难，容易忘记。', pinyin: 'Wǒ juéde jì hànzì zuì nán, róngyì wàngjì.', vi: 'Tôi thấy nhớ chữ Hán khó nhất, rất dễ quên.' },
        { hanzi: '听力是我的弱项，中国人说得很快。', pinyin: 'Tīnglì shì wǒ de ruòxiàng, Zhōngguó rén shuō de hěn kuài.', vi: 'Nghe là điểm yếu của tôi, người bản xứ nói nhanh quá.' },
        { hanzi: '我想多练口语，希望说得流利！', pinyin: 'Wǒ xiǎng duō liàn kǒuyǔ, xīwàng shuō de liúlì!', vi: 'Tôi muốn luyện nói nhiều hơn, mong nói trôi chảy!' }
      ]
    }
  },
  {
    pattern: /(sở thích|cuối tuần|làm gì|thích làm gì|rảnh|xem phim|nghe nhạc|du lịch|爱好|周末|喜欢做|看电影|听音乐|旅游)/i,
    reply: {
      hanzi: '我的爱好就是陪伴大家一起攻克中文！在中文里，表达喜好可以用“我喜欢……”、“我的爱好是……”。周末的时候，你一般喜欢做些什么来放松呢？',
      pinyin: 'Wǒ de àihào jiù shì péibàn dàjiā yìqǐ gōngkè zhōngwén! Zài zhōngwén lǐ, biǎodá xǐhào kěyǐ yòng "Wǒ xǐhuan...", "Wǒ de àihào shì...". Zhōumò de shíhou, nǐ yìbān xǐhuan zuò xiē shénme lái fàngsōng ne?',
      vi: 'Sở thích của mình là đồng hành cùng các bạn chinh phục tiếng Trung! Trong tiếng Trung, biểu đạt sở thích có thể dùng "我喜欢..." (Tôi thích...), "我的爱好是..." (Sở thích của tôi là...). Vào cuối tuần, bạn thường thích làm gì để thư giãn?',
      followUp: '周末的时候，你一般喜欢做些什么？',
      quickReplies: [
        { hanzi: '我喜欢喝咖啡和看书。', pinyin: 'Wǒ xǐhuan hē kāfēi hé kànshū.', vi: 'Tôi thích uống cà phê và đọc sách.' },
        { hanzi: '我喜欢和朋友去逛街看电影。', pinyin: 'Wǒ xǐhuan hé péngyou qù guàngjiē kàn diànyǐng.', vi: 'Tôi thích cùng bạn bè đi dạo phố xem phim.' },
        { hanzi: '我喜欢宅在家里听中文歌。', pinyin: 'Wǒ xǐhuan zhái zài jiā lǐ tīng zhōngwén gē.', vi: 'Tôi thích ở nhà nghe nhạc tiếng Trung.' }
      ]
    }
  },
  {
    pattern: /(cảm ơn|thank|tạm biệt|hẹn gặp lại|bye|谢谢|多谢|再见|明天见)/i,
    reply: {
      hanzi: '不客气！能帮到你我感到很开心。继续保持每天练习的好习惯，你的中文一定会突飞猛进的！下次见，加油哦！',
      pinyin: 'Bú kèqi! Néng bāng dào nǐ wǒ gǎndào hěn kāixīn. Jìxù bǎochí měitiān liànxí de hǎo xíguàn, nǐ de zhōngwén yídìng huì tūfēiměngjìn de! Xià cì jiàn, jiāyóu o!',
      vi: 'Không có gì đâu! Giúp được bạn mình rất vui. Hãy tiếp tục duy trì thói quen luyện tập mỗi ngày, tiếng Trung của bạn nhất định sẽ tiến bộ vượt bậc! Hẹn gặp lại bạn lần sau, cố lên nhé!',
      followUp: '下次想继续聊些什么呢？',
      quickReplies: [
        { hanzi: '谢谢老师，明天见！', pinyin: 'Xièxie lǎoshī, míngtiān jiàn!', vi: 'Cảm ơn cô giáo, ngày mai gặp lại!' },
        { hanzi: '再见，祝你今天过得愉快！', pinyin: 'Zàijiàn, zhù nǐ jīntiān guò de yúkuài!', vi: 'Tạm biệt, chúc bạn một ngày vui vẻ!' },
        { hanzi: '好的，我会继续坚持的！', pinyin: 'Hǎo de, wǒ huì jìxù jiānchí de!', vi: 'Vâng ạ, tôi sẽ tiếp tục kiên trì!' }
      ]
    }
  },
  {
    pattern: /(ngữ pháp|cấu trúc|câu chữ 把|câu chữ 被|chữ 的|trợ từ|bổ ngữ|phân biệt|语法|把字句|被字句)/i,
    reply: {
      hanzi: '中文语法很有规律！比如“把字句”结构是：主语 + 把 + 宾语 + 动词 + 其他成分（如：我把作业做完了）。你想了解哪个具体语法点？我为你详细解析！',
      pinyin: 'Zhōngwén yǔfǎ hěn yǒu guīlǜ! Bǐrú "bǎzìjù" jiégòu shì: Zhǔyǔ + bǎ + bīnyǔ + dòngcí + qítā chéngfèn (rú: Wǒ bǎ zuòyè zuò wán le). Nǐ xiǎng liǎojiě nǎge jùtǐ yǔfǎ diǎn? Wǒ wèi nǐ xiángxì jiěxī!',
      vi: 'Ngữ pháp tiếng Trung rất có quy luật! Ví dụ câu chữ 把 có cấu trúc: Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác (Ví dụ: Tôi đã làm xong bài tập). Bạn muốn tìm hiểu điểm ngữ pháp cụ thể nào? Mình sẽ phân tích chi tiết cho bạn!',
      followUp: '你想了解哪个具体语法点呢？',
      quickReplies: [
        { hanzi: '请讲讲“把”字句和“被”字句的区别。', pinyin: 'Qǐng jiǎngjiang "bǎ" zì jù hé "bèi" zì jù de qūbié.', vi: 'Xin hãy giảng sự khác nhau giữa câu chữ 把 và câu chữ 被.' },
        { hanzi: '“的、地、得”三个字怎么区分？', pinyin: '"de, de, de" sān gè zì zěnme qūfēn?', vi: 'Ba chữ "đích, địa, đắc" phân biệt thế nào?' },
        { hanzi: '怎么用“越来越……”句型？', pinyin: 'Zěnme yòng "yuè lái yuè..." jùxíng?', vi: 'Dùng mẫu câu "càng ngày càng..." như thế nào?' }
      ]
    }
  }
];

/**
 * Call external LLM (Gemini or OpenAI) if API key is present
 */
async function callExternalLlm(userMessage, mode) {
  if (GEMINI_API_KEY) {
    try {
      const systemPrompt = `You are Xiao Hua (小华), a friendly, encouraging native Chinese tutor from Beijing talking with a Vietnamese student.
Mode: ${mode}.
User message: "${userMessage}"
Generate a conversational reply in JSON strictly conforming to this schema:
{
  "hanzi": "Your conversational answer in Chinese",
  "pinyin": "Accurate pinyin with tone marks",
  "vi": "Natural Vietnamese translation of your response",
  "followUp": "A relevant follow-up question in Chinese to encourage the student to answer back",
  "quickReplies": [
    { "hanzi": "Sample answer 1 in Chinese", "pinyin": "pinyin 1", "vi": "meaning in Vietnamese" },
    { "hanzi": "Sample answer 2 in Chinese", "pinyin": "pinyin 2", "vi": "meaning in Vietnamese" },
    { "hanzi": "Sample answer 3 in Chinese", "pinyin": "pinyin 3", "vi": "meaning in Vietnamese" }
  ]
}
Do NOT return Markdown code blocks. Return plain JSON only.`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        }),
        signal: AbortSignal.timeout(8000)
      });
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return JSON.parse(rawText.trim());
      }
    } catch (e) {
      console.warn('Gemini LLM call failed, falling back to local tutor engine:', e.message);
    }
  }
  return null;
}

/**
 * Handle chat conversation, grammar doctor or translation
 */
async function handleAiChat({ message, mode = 'chat' }) {
  const cleanMsg = (message || '').trim();
  if (!cleanMsg) {
    throw new Error('Thiếu nội dung tin nhắn.');
  }

  // 1. If mode is explicitly 'translate', perform direct translation
  if (mode === 'translate') {
    const trResult = await translate(cleanMsg);
    return {
      mode: 'translate',
      hanzi: trResult.isChineseTarget ? trResult.translated : trResult.sourceText,
      pinyin: trResult.pinyin || '',
      vi: trResult.isChineseTarget ? trResult.sourceText : trResult.translated,
      sourceText: trResult.sourceText,
      translated: trResult.translated,
      isChineseTarget: trResult.isChineseTarget,
      vocab: trResult.vocab || []
    };
  }

  // 2. Try external LLM if configured
  const externalResult = await callExternalLlm(cleanMsg, mode);
  if (externalResult && externalResult.hanzi) {
    const vocab = extractVocabFromChinese(externalResult.hanzi);
    return {
      mode,
      hanzi: externalResult.hanzi,
      pinyin: externalResult.pinyin || '',
      vi: externalResult.vi || '',
      followUp: externalResult.followUp || '',
      quickReplies: externalResult.quickReplies || [],
      vocab,
      sourceText: cleanMsg,
      translated: externalResult.hanzi,
      isChineseTarget: true
    };
  }

  // 3. Built-in Conversational Intent Matching
  for (const item of CONVERSATION_INTENTS) {
    if (item.pattern.test(cleanMsg)) {
      const vocab = extractVocabFromChinese(item.reply.hanzi);
      return {
        mode,
        hanzi: item.reply.hanzi,
        pinyin: item.reply.pinyin,
        vi: item.reply.vi,
        followUp: item.reply.followUp,
        quickReplies: item.reply.quickReplies,
        vocab,
        sourceText: cleanMsg,
        translated: item.reply.hanzi,
        isChineseTarget: true
      };
    }
  }

  // 4. Grammar Doctor Mode Analysis
  if (mode === 'grammar') {
    const isChinese = /[一-龥]/.test(cleanMsg);
    let tips = 'Cấu trúc câu nhìn chung tự nhiên. Hãy chú ý trật tự từ: Chủ ngữ + Thời gian/Địa điểm + Phó từ + Động từ + Tân ngữ.';
    if (cleanMsg.includes('把')) {
      tips = '• Nhận xét câu chữ 把: Nhớ rằng vị ngữ thường đi kèm thành phần khác (trợ từ 了, bổ ngữ kết quả, bổ ngữ xu hướng), không để động từ đứng đơn độc!';
    } else if (cleanMsg.includes('被')) {
      tips = '• Nhận xét câu bị động chữ 被: Chủ ngữ là đối tượng chịu tác động. Hãy kiểm tra xem động từ đã có kết quả tác động chưa.';
    } else if (cleanMsg.includes('比')) {
      tips = '• Nhận xét câu so sánh chữ 比: Cấu trúc chuẩn là A + 比 + B + Tính từ. Tuyệt đối không dùng "很", "非常" sau tính từ!';
    }

    const tr = await translate(cleanMsg);
    return {
      mode: 'grammar',
      hanzi: isChinese ? cleanMsg : tr.translated,
      pinyin: tr.pinyin || '',
      vi: isChinese ? tr.translated : cleanMsg,
      grammarTips: tips,
      followUp: '你还想检查哪句话的语法？',
      quickReplies: [
        { hanzi: '请帮我检查这句：“我把书看了。”', pinyin: 'Qǐng bāng wǒ jiǎnchá zhè jù: "Wǒ bǎ shū kàn le."', vi: 'Xin giúp tôi kiểm tra câu này.' },
        { hanzi: '这句话的语序正确吗？', pinyin: 'Zhè jù huà de yǔxù zhèngquè ma?', vi: 'Trật tự câu này có đúng không?' },
        { hanzi: '怎么把这句话说得更地道？', pinyin: 'Zěnme bǎ zhè jù huà shuō de gèng dìdao?', vi: 'Làm thế nào để nói câu này tự nhiên hơn?' }
      ],
      vocab: tr.vocab || [],
      sourceText: cleanMsg,
      translated: isChinese ? tr.translated : cleanMsg,
      isChineseTarget: !isChinese
    };
  }

  // 5. General Conversational Fallback (Translates + Generates Tutor Q&A Reply)
  const tr = await translate(cleanMsg);
  const isChineseUser = /[一-龥]/.test(cleanMsg);
  const userTextZh = isChineseUser ? cleanMsg : tr.translated;
  const userTextVi = isChineseUser ? tr.translated : cleanMsg;

  const replyHanzi = `你说得真好：“${userTextZh}”！在中文交流中，能够主动表达是非常棒的进步。我们可以围绕这个话题继续聊聊，你觉得怎么样？`;
  const replyVi = `Bạn nói rất hay: "${userTextVi}"! Trong giao tiếp tiếng Trung, việc chủ động biểu đạt là một bước tiến rất tuyệt vời. Chúng mình cùng trò chuyện tiếp nhé, bạn thấy thế nào?`;

  const followUpPinyin = 'Nǐ juéde zhège huàtí zěnmeyàng?';
  const vocab = extractVocabFromChinese(replyHanzi);

  return {
    mode,
    hanzi: replyHanzi,
    pinyin: 'Nǐ shuō de zhēn hǎo! Zài zhōngwén jiāoliú zhōng, nénggòu zhǔdòng biǎodá shì fēicháng bàng de jìnbù. Wǒmen kěyǐ wéirào zhège huàtí jìxù liáoliao, nǐ juéde zěnmeyàng?',
    vi: replyVi,
    followUp: '你平时最喜欢和谁一起练中文？',
    quickReplies: [
      { hanzi: '我平时喜欢自学。', pinyin: 'Wǒ píngshí xǐhuan zìxué.', vi: 'Bình thường tôi thích tự học.' },
      { hanzi: '我想和你一起每天练习！', pinyin: 'Wǒ xiǎng hé nǐ yìqǐ měitiān liànxí!', vi: 'Tôi muốn cùng bạn luyện tập mỗi ngày!' },
      { hanzi: '请考我一些实用的日常口语。', pinyin: 'Qǐng kǎo wǒ yìxiē shíyòng de rìcháng kǒuyǔ.', vi: 'Hãy thử kiểm tra tôi một số câu khẩu ngữ thực tế đi.' }
    ],
    vocab,
    sourceText: cleanMsg,
    translated: replyHanzi,
    isChineseTarget: true
  };
}

module.exports = { handleAiChat };
