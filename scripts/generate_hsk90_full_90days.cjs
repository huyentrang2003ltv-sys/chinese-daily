'use strict';

/**
 * Generates the full 90-day curriculum with daily teacher lesson plans.
 * Follows the 6+1 pacing: 6 days of new lessons + 1 day of review/mini-test per week,
 * plus milestone checkpoints at Day 30 (HSK 1), Day 60 (HSK 2), and Day 90 (HSK 3 Graduation).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'public', 'data', 'hsk90_curriculum.json');

// Base 90-day curriculum outline
const syllabusDays = [
  // === PHASE 1: CHẶNG 1 (NGÀY 1 - 30) ===
  // Tuần 1: Pinyin & Chào Hỏi
  {
    day: 1, phase: 1, week: 1, type: 'lesson',
    title: 'Khởi Đầu Ngữ Âm Pinyin: 6 Vận Mẫu Đơn & 4 Thanh Điệu',
    themeZh: '拼音入门：单韵母与四声',
    warmup: {
      hook: 'Chào mừng bạn đến với tiếng Trung! Hôm nay chúng ta sẽ bắt đầu từ viên gạch đầu tiên quan trọng nhất: 6 nguyên âm đơn và 4 thanh điệu.',
      objectives: ['Phát âm chuẩn 6 vận mẫu đơn: a, o, e, i, u, ü', 'Làm chủ 4 thanh điệu (Ngang, Sắc, Huyền gãy, Nặng)', 'Nắm quy tắc biến điệu hai thanh 3: 你好 (Nǐ hǎo -> Ní hǎo)']
    },
    lecture: {
      vocab: [
        { hanzi: '你', pinyin: 'nǐ', vi: 'Bạn, anh, chị (ngôi thứ 2)', tip: 'Bộ Nhân đứng 亻' },
        { hanzi: '好', pinyin: 'hǎo', vi: 'Tốt, đẹp, chào', tip: 'Bộ Nữ 女 + Bộ Tử 子' },
        { hanzi: '吗', pinyin: 'ma', vi: 'Không? (trợ từ nghi vấn)', tip: 'Bộ Khẩu 口' }
      ],
      grammar: {
        formula: 'Chào hỏi cơ bản: Đại từ + 好！ | Câu hỏi Yes/No: Câu trần thuật + 吗？',
        explanation: 'Thêm trợ từ 吗 vào cuối câu trần thuật để biến thành câu hỏi có/không. Khi hai thanh 3 đi liền nhau, thanh 3 thứ nhất đọc thành thanh 2 (Ní hǎo).',
        examples: [
          { zh: '你好！', pinyin: 'Nǐ hǎo!', vi: 'Chào bạn!' },
          { zh: '你好吗？', pinyin: 'Nǐ hǎo ma?', vi: 'Bạn khỏe không?' }
        ]
      },
      etymology: [
        { hanzi: '好', pinyin: 'hǎo', meaning: 'Tốt lành, hạnh phúc', breakdown: 'Người mẹ (女) âu yếm bế đứa con (子) chính là biểu tượng của điều tốt đẹp nhất.' }
      ],
      dialogue: {
        title: 'Chào hỏi lần đầu gặp gỡ',
        lines: [
          { speaker: '王老师 (Nam)', hanzi: '你好！', pinyin: 'Nǐ hǎo!', vi: 'Chào em!' },
          { speaker: '安妮 (Nữ)', hanzi: '老师好！您好吗？', pinyin: 'Lǎoshī hǎo! Nín hǎo ma?', vi: 'Em chào thầy! Thầy khỏe không ạ?' },
          { speaker: '王老师 (Nam)', hanzi: '我很好，谢谢！', pinyin: 'Wǒ hěn hǎo, xièxie!', vi: 'Thầy rất khỏe, cảm ơn em!' }
        ]
      }
    },
    practice: {
      quiz: {
        question: "Khi phát âm cụm từ '你好' (Nǐ hǎo), thanh điệu của chữ '你' biến đổi thế nào?",
        options: ['(Recommended) Đọc thành thanh 2 (Ní hǎo)', 'Đọc thành thanh 1 (Nī hǎo)', 'Đọc thành thanh 4 (Nì hǎo)', 'Giữ nguyên không đổi']
      , answer: 0, explanation: 'Quy tắc biến điệu: 2 thanh 3 đi liền nhau thì thanh 3 đầu tiên biến thành thanh 2.' },
      dictation: { audioText: '你好！你好吗？', expectedPinyin: 'Ni hao! Ni hao ma?', meaning: 'Chào bạn! Bạn có khỏe không?' },
      reorder: { tokens: ['好', '你', '吗'], correctOrder: ['你', '好', '吗'], resultSentence: '你好吗？(Bạn khỏe không?)' },
      production: { prompt: "Hãy dùng từ '好' để viết 1 câu chào hỏi thầy cô hoặc bạn bè:", sampleAnswer: '老师好！(Em chào thầy/cô!)' }
    },
    homework: {
      tasks: ['Luyện phát âm 6 vận mẫu đơn và 4 thanh điệu 10 lần trước gương', 'Tập viết chữ 你 và 好 theo đúng thứ tự nét'],
      flashcardsToReview: ['你', '好', '吗', '很'],
      dailyMilestone: 'Hoàn thành ngày 1: Tự tin chào hỏi và chuẩn hóa phát âm Pinyin'
    }
  },
  {
    day: 2, phase: 1, week: 1, type: 'lesson',
    title: '4 Thanh Mẫu Môi & Răng: b, p, m, f và Đại Từ Nhân Xưng',
    themeZh: '唇齿音声母与人称代词',
    warmup: {
      hook: 'Hôm nay chúng ta sẽ phân biệt cặp âm bật hơi kinh điển b vs p, và học trọn bộ đại từ xưng hô.',
      objectives: ['Phân biệt chuẩn âm b (không bật hơi) và p (bật hơi mạnh)', 'Làm chủ đại từ nhân xưng: 我, 你, 他, 她, 我们, 你们, 他们', 'Nắm phó từ chỉ mức độ: 很 (rất)']
    },
    lecture: {
      vocab: [
        { hanzi: '我', pinyin: 'wǒ', vi: 'Tôi, mình (ngôi thứ 1)', tip: 'Chữ tượng hình cây thương' },
        { hanzi: '他', pinyin: 'tā', vi: 'Anh ấy, ông ấy', tip: 'Bộ Nhân đứng 亻' },
        { hanzi: '她', pinyin: 'tā', vi: 'Cô ấy, bà ấy', tip: 'Bộ Nữ 女' },
        { hanzi: '很', pinyin: 'hěn', vi: 'Rất', tip: 'Bộ Xích 彳' },
        { hanzi: '呢', pinyin: 'ne', vi: 'Thế còn...? (trợ từ nghi vấn)', tip: 'Bộ Khẩu 口' }
      ],
      grammar: {
        formula: 'Câu miêu tả tính chất: Chủ ngữ + 很 + Tính từ | Câu hỏi tỉnh lược: Danh từ/Đại từ + 呢？',
        explanation: 'Trong tiếng Trung, câu vị ngữ tính từ không dùng 是 mà dùng 很 làm cầu nối (Tôi khỏe = 我很好, KHÔNG nói 我是好).',
        examples: [
          { zh: '我很好，你呢？', pinyin: 'Wǒ hěn hǎo, nǐ ne?', vi: 'Tôi rất khỏe, còn bạn thì sao?' },
          { zh: '他也很好。', pinyin: 'Tā yě hěn hǎo.', vi: 'Anh ấy cũng rất khỏe.' }
        ]
      },
      etymology: [
        { hanzi: '我', pinyin: 'wǒ', meaning: 'Tôi, bản thân', breakdown: 'Cầm vũ khí tự bảo vệ chủ quyền của chính bản thân mình.' }
      ],
      dialogue: {
        title: 'Hỏi thăm sức khỏe',
        lines: [
          { speaker: '大卫 (Nam)', hanzi: '你好，安妮！你爸爸妈妈好吗？', pinyin: 'Nǐ hǎo, Ānnī! Nǐ bàba māma hǎo ma?', vi: 'Chào Annie! Bố mẹ bạn khỏe không?' },
          { speaker: '安妮 (Nữ)', hanzi: '他们都很好，谢谢！你呢？', pinyin: 'Tāmen dōu hěn hǎo, xièxie! Nǐ ne?', vi: 'Họ đều rất khỏe, cảm ơn bạn! Còn bạn?' },
          { speaker: '大卫 (Nam)', hanzi: '我也很好。', pinyin: 'Wǒ yě hěn hǎo.', vi: 'Tôi cũng rất khỏe.' }
        ]
      }
    },
    practice: {
      quiz: {
        question: "Để nói 'Tôi rất khỏe, còn bạn thì sao?', câu tiếng Trung chuẩn là:",
        options: ['(Recommended) 我很好，你呢？', '我是好，你吗？', '我很，你好呢？', '我好是，你在？'],
        answer: 0, explanation: 'Câu vị ngữ tính từ dùng 很, câu hỏi tỉnh lược dùng 呢.'
      },
      dictation: { audioText: '我很好，你呢？', expectedPinyin: 'Wo hen hao, ni ne?', meaning: 'Tôi rất khỏe, còn bạn thì sao?' },
      reorder: { tokens: ['很', '我', '好'], correctOrder: ['我', '很', '好'], resultSentence: '我很好。(Tôi rất khỏe.)' },
      production: { prompt: "Hãy viết 1 câu trả lời khi bạn bè hỏi thăm sức khỏe của bạn:", sampleAnswer: '我很好，谢谢你！' }
    },
    homework: {
      tasks: ['Luyện đặt tờ giấy trước miệng phát âm cặp từ ba vs pa', 'Ghi nhớ cách viết chữ 我 và 很'],
      flashcardsToReview: ['我', '他', '她', '很', '呢', '也'],
      dailyMilestone: 'Hoàn thành ngày 2: Làm chủ câu hỏi tỉnh lược 呢 và đại từ nhân xưng'
    }
  },
  {
    day: 3, phase: 1, week: 1, type: 'lesson',
    title: 'Thanh Mẫu d, t, n, l & Đại Từ Xưng Hô Tôn Kính 您',
    themeZh: '舌尖中音声母与敬称“您”',
    warmup: {
      hook: 'Trong văn hóa Trung Hoa, sự lễ phép với người lớn tuổi được thể hiện ngay ở đại từ 您. Hôm nay chúng ta sẽ làm chủ cách nói lịch thiệp.',
      objectives: ['Phát âm chuẩn nhóm d, t, n, l (chú ý t bật hơi mạnh)', 'Phân biệt xưng hô 你 (thân mật) vs 您 (tôn kính)', 'Nắm cách nói lời cảm ơn và tạm biệt']
    },
    lecture: {
      vocab: [
        { hanzi: '您', pinyin: 'nín', vi: 'Ngài, ông, bà, thầy (kính ngữ)', tip: 'Chữ 你 + Bộ Tâm 心 ở dưới' },
        { hanzi: '老师', pinyin: 'lǎoshī', vi: 'Thầy giáo, cô giáo', tip: 'Lão sư' },
        { hanzi: '谢谢', pinyin: 'xièxie', vi: 'Cảm ơn', tip: 'Bộ Ngôn 讠' },
        { hanzi: '不客气', pinyin: 'bú kèqi', vi: 'Đừng khách sáo, không có chi', tip: 'Bất khách khí' },
        { hanzi: '再见', pinyin: 'zàijiàn', vi: 'Tạm biệt, hẹn gặp lại', tip: 'Tái kiến' }
      ],
      grammar: {
        formula: 'Chào kính ngữ: Chức danh/Họ + 老师 + 好！ | Đáp lại cảm ơn: 不客气 / 不用谢',
        explanation: 'Trong tiếng Trung, xưng hô với thầy cô luôn đặt Họ/Chức danh lên trước (Vương Lão Sư: 王老师, KHÔNG nói 老师王).',
        examples: [
          { zh: '王老师，您好！', pinyin: 'Wáng lǎoshī, nín hǎo!', vi: 'Em chào thầy Vương ạ!' },
          { zh: '谢谢您！— 不客气！', pinyin: 'Xièxie nín! — Bú kèqi!', vi: 'Cảm ơn ngài! — Đừng khách sáo!' }
        ]
      },
      etymology: [
        { hanzi: '您', pinyin: 'nín', meaning: 'Ngài, thầy (kính trọng)', breakdown: 'Đặt người đối diện (你) ở trong trái tim (心) thành kính của mình.' }
      ],
      dialogue: {
        title: 'Chào hỏi thầy giáo trên giảng đường',
        lines: [
          { speaker: '安妮 (Nữ)', hanzi: '王老师，早上好！', pinyin: 'Wáng lǎoshī, zǎoshang hǎo!', vi: 'Em chào thầy Vương buổi sáng ạ!' },
          { speaker: '王老师 (Nam)', hanzi: '安妮，早上好！', pinyin: 'Ānnī, zǎoshang hǎo!', vi: 'Chào Annie, buổi sáng tốt lành!' },
          { speaker: '安妮 (Nữ)', hanzi: '老师再见！', pinyin: 'Lǎoshī zàijiàn!', vi: 'Em chào thầy em về ạ!' },
          { speaker: '王老师 (Nam)', hanzi: '再见！明天见！', pinyin: 'Zàijiàn! Míngtiān jiàn!', vi: 'Tạm biệt em! Ngày mai gặp lại!' }
        ]
      }
    },
    practice: {
      quiz: {
        question: "Khi học sinh chào thầy giáo mang họ Trương (张), cách xưng hô chuẩn mực nhất là:",
        options: ['(Recommended) 张老师，您好！', '老师张，你好！', '张你，老师好！', '好张老师！'],
        answer: 0, explanation: 'Họ người + Chức danh + Kính ngữ: 张老师，您好！'
      },
      dictation: { audioText: '谢谢您，老师再见！', expectedPinyin: 'Xiexie nin, laoshi zaijian!', meaning: 'Cảm ơn ngài, tạm biệt thầy giáo!' },
      reorder: { tokens: ['老师', '王', '您好'], correctOrder: ['王', '老师', '您好'], resultSentence: '王老师，您好！(Em chào thầy Vương ạ!)' },
      production: { prompt: "Hãy viết 1 câu cảm ơn và tạm biệt thầy cô giáo của bạn:", sampleAnswer: '谢谢老师，老师再见！' }
    },
    homework: {
      tasks: ['Luyện viết chữ 您 và 再见 5 lần', 'Tập nói đoạn thoại cảm ơn và đáp lại 不客气'],
      flashcardsToReview: ['您', '老师', '谢谢', '不客气', '再见'],
      dailyMilestone: 'Hoàn thành ngày 3: Sử dụng thuần thục kính ngữ và phép lịch sự tiếng Trung'
    }
  },
  {
    day: 4, phase: 1, week: 1, type: 'lesson',
    title: "Thanh Mẫu g, k, h & Câu Phán Đoán Cốt Lõi '是' (To be)",
    themeZh: '舌根音声母与判断句“是”',
    warmup: {
      hook: "Động từ '是' là động từ quan trọng nhất trong tiếng Trung sơ cấp, tương đương 'is/am/are' trong tiếng Anh.",
      objectives: ['Phát âm chuẩn g, k, h (chú ý k bật hơi mạnh, h đọc nhẹ giữa h và kh)', "Làm chủ cấu trúc khẳng định: S + 是 + O", "Nắm chắc cấu trúc phủ định: S + 不是 + O (Lưu ý 不 biến điệu thành bú)"]
    },
    lecture: {
      vocab: [
        { hanzi: '是', pinyin: 'shì', vi: 'Là, đúng (động từ phán đoán)', tip: 'Bộ Nhật 日' },
        { hanzi: '不', pinyin: 'bù / bú', vi: 'Không, chẳng (phó từ phủ định)', tip: 'Biến điệu khi đứng trước thanh 4' },
        { hanzi: '学生', pinyin: 'xuéshēng', vi: 'Học sinh, sinh viên', tip: 'Bộ Tử 子' },
        { hanzi: '中国', pinyin: 'Zhōngguó', vi: 'Trung Quốc', tip: 'Trung Hoa' },
        { hanzi: '人', pinyin: 'rén', vi: 'Người', tip: 'Bộ Nhân 人' }
      ],
      grammar: {
        formula: 'Khẳng định: Chủ ngữ (S) + 是 + Tân ngữ (O) | Phủ định: S + 不是 (bú shì) + O',
        explanation: "Phó từ 不 (bù - thanh 4) khi đứng trước một âm tiết mang thanh 4 như 是 (shì) sẽ tự động biến điệu thành thanh 2: 'bú shì'.",
        examples: [
          { zh: '我是学生。', pinyin: 'Wǒ shì xuéshēng.', vi: 'Tôi là học sinh.' },
          { zh: '他不是中国人。', pinyin: 'Tā bú shì Zhōngguó rén.', vi: 'Anh ấy không phải là người Trung Quốc.' }
        ]
      },
      etymology: [
        { hanzi: '人', pinyin: 'rén', meaning: 'Con người', breakdown: 'Hình ảnh hai chân sải bước vững chãi trên mặt đất.' }
      ],
      dialogue: {
        title: 'Xác nhận thân phận học sinh',
        lines: [
          { speaker: '李明 (Nam)', hanzi: '你是老师吗？', pinyin: 'Nǐ shì lǎoshī ma?', vi: 'Bạn là giáo viên phải không?' },
          { speaker: '安妮 (Nữ)', hanzi: '我不是老师，我是学生。', pinyin: 'Wǒ bú shì lǎoshī, wǒ shì xuéshēng.', vi: 'Tôi không phải là giáo viên, tôi là học sinh.' },
          { speaker: '李明 (Nam)', hanzi: '他是中国人吗？', pinyin: 'Tā shì Zhōngguó rén ma?', vi: 'Anh ấy là người Trung Quốc phải không?' },
          { speaker: '安妮 (Nữ)', hanzi: '是，他是中国人。', pinyin: 'Shì, tā shì Zhōngguó rén.', vi: 'Vâng, anh ấy là người Trung Quốc.' }
        ]
      }
    },
    practice: {
      quiz: {
        question: "Chọn cách phát âm chuẩn của từ '不是':",
        options: ['(Recommended) bú shì (thanh 2 + thanh 4)', 'bù shì (thanh 4 + thanh 4)', 'bǔ shì (thanh 3 + thanh 4)', 'bū shì (thanh 1 + thanh 4)'],
        answer: 0, explanation: 'Quy tắc biến điệu: 不 đứng trước thanh 4 đọc thành bú (thanh 2).'
      },
      dictation: { audioText: '我不是老师，我是学生。', expectedPinyin: 'Wo bu shi laoshi, wo shi xuesheng.', meaning: 'Tôi không phải là giáo viên, tôi là học sinh.' },
      reorder: { tokens: ['不是', '中国人', '他'], correctOrder: ['他', '不是', '中国人'], resultSentence: '他不是中国人。(Anh ấy không phải là người Trung Quốc.)' },
      production: { prompt: "Hãy dùng mẫu câu 'S + 是 + O' để tự giới thiệu nghề nghiệp/thân phận của bạn:", sampleAnswer: '我是学生，我不是老师。' }
    },
    homework: {
      tasks: ['Luyện đọc to 10 lần câu 我是学生，他不是中国人', 'Ghi nhớ quy tắc biến điệu của chữ 不'],
      flashcardsToReview: ['是', '不', '学生', '中国', '人'],
      dailyMilestone: 'Hoàn thành ngày 4: Nắm vững câu chữ 是 và quy tắc biến điệu chữ 不'
    }
  },
  {
    day: 5, phase: 1, week: 1, type: 'lesson',
    title: 'Thanh Mẫu Mặt Lưỡi j, q, x & Đại Từ Nghi Vấn 什么 (Cái gì)',
    themeZh: '舌面前音声母与疑问词“什么”',
    warmup: {
      hook: "Bạn tên là gì? Hôm nay chúng ta sẽ giải mã đại từ nghi vấn phổ biến nhất tiếng Trung: 什么 (shénme).",
      objectives: ['Phát âm chuẩn nhóm j, q, x (lưỡi ép phẳng sát ngạc cứng)', 'Nắm quy tắc viết ü khi đi với j, q, x (bỏ hai dấu chấm trên đầu: ju, qu, xu)', 'Thành thạo cấu trúc hỏi tên: 你叫什么名字？']
    },
    lecture: {
      vocab: [
        { hanzi: '叫', pinyin: 'jiào', vi: 'Gọi, tên là', tip: 'Bộ Khẩu 口' },
        { hanzi: '什么', pinyin: 'shénme', vi: 'Cái gì? (đại từ nghi vấn)', tip: 'Thập 十 + Nhân 人' },
        { hanzi: '名字', pinyin: 'míngzi', vi: 'Tên, họ tên', tip: 'Bộ Tịch 夕 + Bộ Khẩu 口' },
        { hanzi: '请问', pinyin: 'qǐngwèn', vi: 'Xin hỏi (lời mở đầu lịch sự)', tip: 'Bộ Ngôn 讠' }
      ],
      grammar: {
        formula: 'Hỏi tên: S + 叫 + 什么名字？ | Trả lời: 我 + 叫 + Tên',
        explanation: 'Trong tiếng Trung, từ nghi vấn 什么 đứng ngay tại vị trí của tân ngữ cần hỏi, không cần đảo trật tự câu như tiếng Anh.',
        examples: [
          { zh: '请问，你叫什么名字？', pinyin: 'Qǐngwèn, nǐ jiào shénme míngzi?', vi: 'Xin hỏi, bạn tên là gì?' },
          { zh: '我叫安妮。', pinyin: 'Wǒ jiào Ānnī.', vi: 'Tôi tên là Annie.' }
        ]
      },
      etymology: [
        { hanzi: '名', pinyin: 'míng', meaning: 'Danh tiếng, tên gọi', breakdown: 'Trong đêm tối mịt mù (夕), người ta phải cất miệng (口) gọi tên nhau để nhận ra nhau.' }
      ],
      dialogue: {
        title: 'Hỏi tên làm quen bạn mới',
        lines: [
          { speaker: '张伟 (Nam)', hanzi: '你好！请问你叫什么名字？', pinyin: 'Nǐ hǎo! Qǐngwèn nǐ jiào shénme míngzi?', vi: 'Chào bạn! Xin hỏi bạn tên là gì?' },
          { speaker: '安妮 (Nữ)', hanzi: '你好！我叫安妮。你呢？', pinyin: 'Nǐ hǎo! Wǒ jiào Ānnī. Nǐ ne?', vi: 'Chào bạn! Tôi tên là Annie. Còn bạn?' },
          { speaker: '张伟 (Nam)', hanzi: '我叫张伟。很高兴认识你！', pinyin: 'Wǒ jiào Zhāng Wěi. Hěn gāoxìng rènshi nǐ!', vi: 'Tôi tên là Trương Vĩ. Rất vui được biết bạn!' }
        ]
      }
    },
    practice: {
      quiz: {
        question: "Để hỏi 'Bạn tên là gì?' một cách lịch sự, câu đúng là:",
        options: ['(Recommended) 请问，你叫什么名字？', '你是叫什么名字吗？', '名字叫你是什么？', '请你叫问什么？'],
        answer: 0, explanation: 'Xin hỏi (请问) đặt đầu câu, cấu trúc hỏi tên: 你叫什么名字？'
      },
      dictation: { audioText: '请问你叫什么名字？我叫安妮。', expectedPinyin: 'Qingwen ni jiao shenme mingzi? Wo jiao Anni.', meaning: 'Xin hỏi bạn tên là gì? Tôi tên là Annie.' },
      reorder: { tokens: ['名字', '什么', '你', '叫'], correctOrder: ['你', '叫', '什么', '名字'], resultSentence: '你叫什么名字？(Bạn tên là gì?)' },
      production: { prompt: "Hãy dùng mẫu câu '我叫...' để viết 1 câu giới thiệu tên của chính bạn:", sampleAnswer: '你好，我叫 Minh。' }
    },
    homework: {
      tasks: ['Luyện viết chữ 叫 và 什么 mỗi chữ 5 lần', 'Tập tự giới thiệu tên mình bằng tiếng Trung'],
      flashcardsToReview: ['叫', '什么', '名字', '请问'],
      dailyMilestone: 'Hoàn thành ngày 5: Tự tin hỏi và trả lời tên gọi bằng tiếng Trung'
    }
  },
  {
    day: 6, phase: 1, week: 1, type: 'lesson',
    title: 'Hỏi Quốc Tịch & Giới Thiệu Bản Thân Trọn Vẹn',
    themeZh: '国籍询问与完整自我介绍',
    warmup: {
      hook: 'Bạn là người nước nào? Hôm nay chúng ta sẽ ráp nối các kiến thức của cả tuần để tạo thành bài giới thiệu bản thân hoàn chỉnh đầu tiên!',
      objectives: ['Nắm cấu trúc hỏi quốc tịch: 你是哪国人？', 'Biết tên các quốc gia phổ biến: 越南, 中国, 美国', 'Tự tin nói 3 câu liên tiếp giới thiệu tên, quốc tịch và thân phận']
    },
    lecture: {
      vocab: [
        { hanzi: '哪', pinyin: 'nǎ / něi', vi: 'Nào, cái nào (đại từ nghi vấn)', tip: 'Bộ Khẩu 口' },
        { hanzi: '国', pinyin: 'guó', vi: 'Nước, quốc gia', tip: 'Bộ Vi 囗 bao quanh chữ Ngọc 玉' },
        { hanzi: '越南', pinyin: 'Yuènán', vi: 'Việt Nam', tip: 'Việt Nam' },
        { hanzi: '美国', pinyin: 'Měiguó', vi: 'Nước Mỹ', tip: 'Mỹ quốc' },
        { hanzi: '认识', pinyin: 'rènshi', vi: 'Quen biết, nhận biết', tip: 'Bộ Ngôn 讠' },
        { hanzi: '高兴', pinyin: 'gāoxìng', vi: 'Vui vẻ, phấn khởi', tip: 'Cao hứng' }
      ],
      grammar: {
        formula: 'Hỏi quốc tịch: S + 是 + 哪国人？ | Trả lời: 我 + 是 + [Tên nước] + 人',
        explanation: 'Cấu trúc quốc tịch tiếng Trung rất logic: Tên quốc gia + chữ 人 (người). Ví dụ: 越南人 (người Việt Nam), 中国人 (người Trung Quốc).',
        examples: [
          { zh: '你是哪国人？', pinyin: 'Nǐ shì nǎ guó rén?', vi: 'Bạn là người nước nào?' },
          { zh: '我是越南人，他是中国人。', pinyin: 'Wǒ shì Yuènán rén, tā shì Zhōngguó rén.', vi: 'Tôi là người Việt Nam, anh ấy là người Trung Quốc.' }
        ]
      },
      etymology: [
        { hanzi: '国', pinyin: 'guó', meaning: 'Quốc gia, đất nước', breakdown: 'Biên giới bờ cõi (囗) bao bọc gìn giữ ngọc ngà châu báu (玉) của giang sơn.' }
      ],
      dialogue: {
        title: 'Hội thoại giới thiệu quốc tịch',
        lines: [
          { speaker: '王老师 (Nam)', hanzi: '安妮，你是哪国人？', pinyin: 'Ānnī, nǐ shì nǎ guó rén?', vi: 'Annie, em là người nước nào?' },
          { speaker: '安妮 (Nữ)', hanzi: '我是越南人，我是留学生。', pinyin: 'Wǒ shì Yuènán rén, wǒ shì liúxuéshēng.', vi: 'Em là người Việt Nam, em là du học sinh.' },
          { speaker: '王老师 (Nam)', hanzi: '很高兴认识你！', pinyin: 'Hěn gāoxìng rènshi nǐ!', vi: 'Rất vui được quen biết em!' },
          { speaker: '安妮 (Nữ)', hanzi: '认识您我也很高兴！', pinyin: 'Rènshi nín wǒ yě hěn gāoxìng!', vi: 'Được biết thầy em cũng rất vui ạ!' }
        ]
      }
    },
    practice: {
      quiz: {
        question: "Để nói 'Tôi là người Việt Nam, rất vui được quen biết bạn', câu đúng là:",
        options: [
          '(Recommended) 我是越南人，很高兴认识你！',
          '我是人越南，认识你很高！',
          '我有越南人，很高兴你知道！',
          '我越南是人，很高兴你看！'
        ],
        answer: 0, explanation: 'Cấu trúc quốc tịch: 越南人; biểu đạt làm quen: 很高兴认识你！'
      },
      dictation: { audioText: '我是越南人，很高兴认识你！', expectedPinyin: 'Wo shi Yuenan ren, hen gaoxing renshi ni!', meaning: 'Tôi là người Việt Nam, rất vui được quen biết bạn!' },
      reorder: { tokens: ['越南人', '是', '我'], correctOrder: ['我', '是', '越南人'], resultSentence: '我是越南人。(Tôi là người Việt Nam.)' },
      production: { prompt: "Hãy viết 1 đoạn ngắn 2 câu giới thiệu tên và quốc tịch của bạn:", sampleAnswer: '你好！我叫 Minh，我是越南人。' }
    },
    homework: {
      tasks: ['Luyện nói lưu loát bài giới thiệu bản thân 3 câu trong 15 giây', 'Chuẩn bị cho buổi Tổng ôn tuần vào ngày mai'],
      flashcardsToReview: ['哪', '国', '越南', '认识', '高兴'],
      dailyMilestone: 'Hoàn thành ngày 6: Làm chủ bài giới thiệu bản thân đầu tiên'
    }
  },
  {
    day: 7, phase: 1, week: 1, type: 'review',
    title: 'Tổng Ôn Tuần 1: Chuẩn Hóa Pinyin, Khẩu Ngữ & Mini-Test 1',
    themeZh: '第一周总复习与水平测试',
    warmup: {
      hook: 'Chúc mừng bạn đã hoàn thành tuần học đầu tiên! Hôm nay là ngày ôn tập 6+1: củng cố toàn bộ ngữ âm, từ vựng và làm bài kiểm tra tuần.',
      objectives: ['Tổng kết 25 từ vựng then chốt của Tuần 1', 'Kiểm tra độ chuẩn xác của 4 thanh điệu và biến điệu', 'Hoàn thành bài kiểm tra Mini-Test Tuần 1 đạt điểm tối đa']
    },
    lecture: {
      vocab: [
        { hanzi: '你好', pinyin: 'nǐ hǎo', vi: 'Xin chào', tip: 'Thanh 3 biến điệu' },
        { hanzi: '谢谢', pinyin: 'xièxie', vi: 'Cảm ơn', tip: 'Thanh 4 + thanh nhẹ' },
        { hanzi: '再见', pinyin: 'zàijiàn', vi: 'Tạm biệt', tip: 'Hai thanh 4' },
        { hanzi: '我是学生', pinyin: 'wǒ shì xuéshēng', vi: 'Tôi là học sinh', tip: 'Câu chữ 是' }
      ],
      grammar: {
        formula: 'Tổng kết 3 mẫu câu Tuần 1: 1. S + 很 + Adj | 2. S + 是 + O | 3. S + 叫 + Tên',
        explanation: 'Nhớ kỹ: Vị ngữ tính từ dùng 很 (Tôi khỏe = 我很好); Vị ngữ danh từ dùng 是 (Tôi là học sinh = 我是学生).',
        examples: [
          { zh: '我是学生，我叫安妮。', pinyin: 'Wǒ shì xuéshēng, wǒ jiào Ānnī.', vi: 'Tôi là học sinh, tôi tên là Annie.' },
          { zh: '王老师很好，我们都很高兴。', pinyin: 'Wáng lǎoshī hěn hǎo, wǒmen dōu hěn gāoxìng.', vi: 'Thầy Vương rất tốt, chúng tôi đều rất vui.' }
        ]
      },
      etymology: [
        { hanzi: '学', pinyin: 'xué', meaning: 'Học tập', breakdown: 'Mái trường che chở đứa trẻ (子) đang giơ hai tay tiếp thu tri thức mới.' }
      ],
      dialogue: {
        title: 'Tổng duyệt đối thoại tuần 1',
        lines: [
          { speaker: '张伟 (Nam)', hanzi: '王老师好！她是哪国人？', pinyin: 'Wáng lǎoshī hǎo! Tā shì nǎ guó rén?', vi: 'Em chào thầy Vương! Bạn ấy là người nước nào ạ?' },
          { speaker: '王老师 (Nam)', hanzi: '她叫安妮，她是越南留学生。', pinyin: 'Tā jiào Ānnī, tā shì Yuènán liúxuéshēng.', vi: 'Em ấy tên là Annie, em ấy là du học sinh Việt Nam.' },
          { speaker: '安妮 (Nữ)', hanzi: '你好！很高兴认识你！', pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ!', vi: 'Chào bạn! Rất vui được quen biết bạn!' },
          { speaker: '张伟 (Nam)', hanzi: '我也很高兴认识你！', pinyin: 'Wǒ yě hěn gāoxìng rènshi nǐ!', vi: 'Tôi cũng rất vui được biết bạn!' }
        ]
      }
    },
    practice: {
      quiz: {
        question: "Mini-Test Tuần 1: Chọn câu HOÀN TOÀN ĐÚNG ngữ pháp và ngữ nghĩa:",
        options: [
          '(Recommended) 我是留学生，我不是中国人。',
          '我是留学生，我中国不是人。',
          '我留学生是，我不中国人。',
          '我有留学生，我是不中国人。'
        ],
        answer: 0, explanation: 'Câu phán đoán chuẩn: S + 是/不是 + Tân ngữ.'
      },
      dictation: { audioText: '王老师好！我是越南留学生。', expectedPinyin: 'Wang laoshi hao! Wo shi Yuenan liuxuesheng.', meaning: 'Chào thầy Vương! Em là du học sinh Việt Nam.' },
      reorder: { tokens: ['留学生', '我是', '越南的'], correctOrder: ['我是', '越南的', '留学生'], resultSentence: '我是越南的留学生。(Tôi là du học sinh của Việt Nam.)' },
      production: { prompt: "Mini-Test Tự luận: Hãy viết 1 đoạn 3 câu giới thiệu bản thân (Tên, Thân phận học sinh, Quốc tịch):", sampleAnswer: '你好！我叫 Minh。我是学生，我是越南人。很高兴认识你！' }
    },
    homework: {
      tasks: ['Làm lại các câu sai trong tuần', 'Ôn tập 100% flashcard tuần 1 để chuẩn bị bước vào Tuần 2: 100 Bộ thủ chữ Hán'],
      flashcardsToReview: ['你', '好', '我', '很', '是', '不', '叫', '什么', '哪', '国', '越南', '学生'],
      dailyMilestone: 'Tốt nghiệp Tuần 1: Cán mốc 25 từ vựng và tự tin chào hỏi tiếng Trung (+50 EXP)'
    }
  }
];

// Let's create an automated builder that generates the complete 90 days syllabus
// with structured themes across all 12 weeks and 3 phases!

const weekThemes = [
  { week: 1, phase: 1, title: 'Ngữ Âm Pinyin & Chào Hỏi Căn Bản', themeZh: '拼音与日常问候' },
  { week: 2, phase: 1, title: '100 Bộ Thủ Cốt Lõi & Giải Mã Logic Chữ Hán', themeZh: '核心偏旁部首与汉字结构' },
  { week: 3, phase: 1, title: 'Gia Đình, Sở Hữu & Trợ Từ Cốt Lõi 的', themeZh: '家庭成员与领属助词“的”' },
  { week: 4, phase: 1, title: 'Thời Gian, Lịch Trình & Cán Mốc Chuẩn HSK 1', themeZh: '时间表达与HSK 1达标' },
  { week: 5, phase: 2, title: 'Mua Sắm, Giá Cả & Phân Biệt 一点儿 vs 有点儿', themeZh: '购物与程度副词用法' },
  { week: 6, phase: 2, title: 'Phương Hướng, Vị Trí & Giới Từ 在 / 从 / 往', themeZh: '方位问路与介词短语' },
  { week: 7, phase: 2, title: 'Bổ Ngữ Kết Quả & Tuyệt Kỹ Câu So Sánh 比', themeZh: '结果补语与“比”字句' },
  { week: 8, phase: 2, title: 'Trợ Từ Động Thái 了/过/着 & Cán Mốc HSK 2', themeZh: '动态助词与连动句' },
  { week: 9, phase: 3, title: 'Đỉnh Cao Ngữ Pháp — Tuyệt Kỹ Câu Chữ 把', themeZh: '“把”字句结构与实战' },
  { week: 10, phase: 3, title: 'Câu Bị Động 被 & Bổ Ngữ Khả Năng (得/不)', themeZh: '被动句与可能补语' },
  { week: 11, phase: 3, title: 'Cặp Liên Từ Phức HSK 3 & Bổ Ngữ Thời Lượng', themeZh: '关联词与时量动量补语' },
  { week: 12, phase: 3, title: 'Chiến Thuật Phòng Thi CTI iBT & Về Đích 240+ Điểm', themeZh: 'CTI机考实战与全真模拟' }
];

// Detailed daily curriculum bank for days 8 to 90
const dailyCurriculumBank = {
  // Week 2
  8: {
    title: '8 Nét Bút Cơ Bản & Bộ Nhân (人/亻), Bộ Nữ (女)',
    themeZh: '基本笔画与“人、女”字旁',
    estimatedTime: '45 - 60 phút',
    warmup: {
      hook: 'Chữ Hán không hề khó nhớ nếu bạn biết logic: Mỗi chữ là một bức tranh sinh động ghép từ các bộ thủ.',
      objectives: ['Nắm chắc 8 nét bút cơ bản (Ngang, Sổ, Phẩy, Mác, Hất, Chấm, Gập, Móc)', 'Làm chủ Bộ Nhân đứng (亻) và Bộ Nữ (女)', 'Nhận diện các chữ Hán: 他, 她, 们, 好, 妈']
    },
    vocab: [
      { hanzi: '人', pinyin: 'rén', vi: 'Người (bộ Nhân)', tip: 'Hai chân sải bước' },
      { hanzi: '女', pinyin: 'nǚ', vi: 'Phụ nữ, con gái (bộ Nữ)', tip: 'Hình người phụ nữ đoan trang' },
      { hanzi: '他', pinyin: 'tā', vi: 'Anh ấy', tip: 'Bộ Nhân đứng 亻' },
      { hanzi: '她', pinyin: 'tā', vi: 'Cô ấy', tip: 'Bộ Nữ 女' },
      { hanzi: '们', pinyin: 'men', vi: 'Các, chúng (hậu tố số nhiều)', tip: 'Thanh nhẹ' }
    ],
    grammar: {
      formula: 'Quy tắc bút thuận: Ngang trước sổ sau, trên trước dưới sau, trái trước phải sau | Số nhiều: Đại từ + 们',
      explanation: 'Viết chữ Hán đúng thứ tự nét giúp bàn tay chuyển động tự nhiên và chữ viết cân đối, vuông vắn.',
      examples: [
        { zh: '他们都是老师。', pinyin: 'Tāmen dōu shì lǎoshī.', vi: 'Họ đều là giáo viên.' },
        { zh: '她们是学生。', pinyin: 'Tāmen shì xuéshēng.', vi: 'Các cô ấy là học sinh.' }
      ]
    },
    etymology: [{ hanzi: '女', pinyin: 'nǚ', meaning: 'Phụ nữ', breakdown: 'Hình tượng người mẹ hiền thục chắp tay trước ngực.' }],
    dialogue: {
      title: 'Nhận diện bạn học qua đại từ',
      lines: [
        { speaker: '李文 (Nam)', hanzi: '他们是谁？', pinyin: 'Tāmen shì shéi?', vi: 'Họ là ai thế?' },
        { speaker: '安妮 (Nữ)', hanzi: '他们是我的同学，她们都是留学生。', pinyin: 'Tāmen shì wǒ de tóngxué, tāmen dōu shì liúxuéshēng.', vi: 'Họ là bạn học của tôi, các bạn ấy đều là du học sinh.' }
      ]
    },
    practice: {
      quiz: {
        question: "Chữ '她' (cô ấy) chứa bộ thủ nào để biểu thị giới tính nữ?",
        options: ['(Recommended) Bộ Nữ (女)', 'Bộ Nhân (亻)', 'Bộ Khẩu (口)', 'Bộ Nhật (日)'],
        answer: 0, explanation: 'Bộ Nữ (女) đứng bên trái chỉ giới tính nữ, chữ 也 chỉ âm.'
      },
      dictation: { audioText: '他们都是我的好同学。', expectedPinyin: 'Tamen dou shi wo de hao tongxue.', meaning: 'Họ đều là bạn học tốt của tôi.' },
      reorder: { tokens: ['都是', '学生', '我们'], correctOrder: ['我们', '都是', '学生'], resultSentence: '我们都是学生。(Chúng tôi đều là học sinh.)' },
      production: { prompt: "Hãy dùng chữ '她们' hoặc '他们' để viết 1 câu mô tả một nhóm người:", sampleAnswer: '他们都是越南留学生。' }
    },
    homework: { tasks: ['Tập viết chữ 他 và 她 mỗi chữ 10 lần theo đúng thứ tự nét', 'Ghi nhớ 8 nét cơ bản'], flashcardsToReview: ['人', '女', '他', '她', '们'], dailyMilestone: 'Hoàn thành ngày 8: Giải mã bộ Nhân và bộ Nữ' }
  },
  9: {
    title: 'Bộ Khẩu (口) & Bộ Ngôn (讠) — Lời Nói & Ẩm Thực',
    themeZh: '“口、讠”部首与饮食表达',
    estimatedTime: '45 - 60 phút',
    warmup: {
      hook: 'Mọi hành động liên quan đến miệng ăn, uống hoặc lời nói đều gắn liền với Bộ Khẩu và Bộ Ngôn.',
      objectives: ['Nhận biết Bộ Khẩu 口 (cái miệng) và Bộ Ngôn 讠 (lời nói)', 'Làm chủ các động từ ăn, uống, nói: 吃, 喝, 说, 话', 'Nắm cách dùng từ 请 (mời, xin vui lòng)']
    },
    vocab: [
      { hanzi: '吃', pinyin: 'chī', vi: 'Ăn', tip: 'Bộ Khẩu 口' },
      { hanzi: '喝', pinyin: 'hē', vi: 'Uống', tip: 'Bộ Khẩu 口' },
      { hanzi: '说', pinyin: 'shuō', vi: 'Nói', tip: 'Bộ Ngôn 讠' },
      { hanzi: '请', pinyin: 'qǐng', vi: 'Mời, xin vui lòng', tip: 'Bộ Ngôn 讠' },
      { hanzi: '茶', pinyin: 'chá', vi: 'Trà', tip: 'Bộ Thảo 艹 + Bộ Mộc 木' }
    ],
    grammar: {
      formula: 'Câu mời lịch thiệp: 请 + Động từ + (Tân ngữ) | Hỏi dùng gì: S + 吃/喝 + 什么？',
      explanation: 'Từ 请 đặt đầu câu thể hiện sự hiếu khách chuẩn mực văn hóa phương Đông: 请喝茶 (Xin mời dùng trà).',
      examples: [
        { zh: '请喝茶！', pinyin: 'Qǐng hē chá!', vi: 'Mời bạn uống trà!' },
        { zh: '你想吃什么？', pinyin: 'Nǐ xiǎng chī shénme?', vi: 'Bạn muốn ăn gì?' }
      ]
    },
    etymology: [{ hanzi: '吃', pinyin: 'chī', meaning: 'Ăn uống', breakdown: 'Cái miệng (口) há to đón thức ăn vào.' }],
    dialogue: {
      title: 'Mời khách uống trà',
      lines: [
        { speaker: '张伟 (Nam)', hanzi: '请坐，请喝中国茶！', pinyin: 'Qǐng zuò, qǐng hē Zhōngguó chá!', vi: 'Mời bạn ngồi, mời bạn dùng trà Trung Quốc!' },
        { speaker: '安妮 (Nữ)', hanzi: '谢谢！这茶很好喝。', pinyin: 'Xièxie! Zhè chá hěn hǎohē.', vi: 'Cảm ơn bạn! Trà này rất ngon.' }
      ]
    },
    practice: {
      quiz: {
        question: "Từ nào sau đây mang Bộ Ngôn (讠) biểu thị hành động lời nói?",
        options: ['(Recommended) 说 (shuō - nói)', '吃 (chī - ăn)', '喝 (hē - uống)', '看 (kàn - nhìn)'],
        answer: 0, explanation: 'Bộ Ngôn 讠 chỉ ngôn từ, lời nói.'
      },
      dictation: { audioText: '请坐，请喝茶！', expectedPinyin: 'Qing zuo, qing he cha!', meaning: 'Mời ngồi, mời uống trà!' },
      reorder: { tokens: ['喝茶', '请', '你'], correctOrder: ['请', '你', '喝茶'], resultSentence: '请你喝茶。(Mời bạn uống trà.)' },
      production: { prompt: "Hãy dùng từ '请' để viết 1 câu mời khách lịch thiệp:", sampleAnswer: '请坐，请喝水！' }
    },
    homework: { tasks: ['Viết chữ 吃, 喝, 说 mỗi chữ 5 lần', 'Học thuộc cụm từ 请喝茶'], flashcardsToReview: ['吃', '喝', '说', '请', '茶'], dailyMilestone: 'Hoàn thành ngày 9: Làm chủ Bộ Khẩu & Bộ Ngôn' }
  }
};

// Procedural generation helper for complete 90 days dataset
function buildFull90Days() {
  const days = [];

  for (let d = 1; d <= 90; d++) {
    // Determine phase & week
    let phase = 1;
    if (d > 60) phase = 3;
    else if (d > 30) phase = 2;

    const week = Math.min(12, Math.ceil(d / 7.5));
    const isReview = (d % 7 === 0) || (d === 30) || (d === 60) || (d === 90);
    const isMilestone = (d === 30) || (d === 60) || (d === 90);

    const type = isMilestone ? 'checkpoint' : (isReview ? 'review' : 'lesson');

    // Use predefined day if available
    const existing = syllabusDays.find(s => s.day === d) || dailyCurriculumBank[d];
    if (existing) {
      existing.day = d;
      existing.phase = phase;
      existing.week = week;
      if (!existing.type) existing.type = isMilestone ? 'checkpoint' : (isReview ? 'review' : 'lesson');
      if (!existing.lecture && existing.vocab) {
        existing.lecture = {
          vocab: existing.vocab,
          grammar: existing.grammar,
          etymology: existing.etymology,
          dialogue: existing.dialogue
        };
      }
      days.push(existing);
      continue;
    }

    // Synthesize structured academic daily plan based on week syllabus
    const currentWeekTheme = weekThemes[week - 1] || weekThemes[0];
    let dayTitle = '';
    let dayZh = '';
    let hook = '';
    let objectives = [];
    let vocabList = [];
    let formula = '';
    let explanation = '';
    let examples = [];
    let dialogueLines = [];
    let quizQ = '';
    let quizOpts = [];
    let quizAns = 0;
    let quizExpl = '';
    let dictAudio = '';
    let dictPy = '';
    let dictMean = '';
    let reorderTokens = [];
    let reorderCorrect = [];
    let reorderSent = '';
    let prodPrompt = '';
    let prodSample = '';
    let homeworkTasks = [];
    let flashcards = [];

    if (isMilestone) {
      if (d === 30) {
        dayTitle = 'Đại Khảo Sát Chặng 1: Nắm Vững 150 Từ Vựng & Cán Mốc Chuẩn HSK 1';
        dayZh = '第一阶段通关考核：HSK 1达标测试';
        hook = 'Cột mốc 30 ngày đầu tiên! Bạn đã vượt qua 1/3 chặng đường và nắm trong tay trọn vẹn nền tảng HSK 1.';
        objectives = ['Khảo sát toàn bộ 150 từ vựng cốt lõi HSK 1', 'Đạt điểm tối đa bài thi thử HSK 1 CTI', 'Được cấp chứng nhận Xây Móng Vững Vàng'];
        vocabList = [
          { hanzi: '看见', pinyin: 'kànjiàn', vi: 'Nhìn thấy', tip: 'Bổ ngữ kết quả' },
          { hanzi: '听见', pinyin: 'tīngjiàn', vi: 'Nghe thấy', tip: 'Bổ ngữ kết quả' },
          { hanzi: '多少', pinyin: 'duōshao', vi: 'Bao nhiêu', tip: 'Đại từ nghi vấn' }
        ];
        formula = 'S + 在 + Nơi chốn + Động từ + (O) | S + 会 + V';
        explanation = 'Trật tự vàng tiếng Trung: Địa điểm và thời gian luôn đứng trước động từ.';
        examples = [
          { zh: '我在图书馆看书。', pinyin: 'Wǒ zài túshūguǎn kàn shū.', vi: 'Tôi đọc sách ở thư viện.' },
          { zh: '我会说汉语。', pinyin: 'Wǒ huì shuō Hànyǔ.', vi: 'Tôi biết nói tiếng Trung.' }
        ];
        dialogueLines = [
          { speaker: '考官 (Giám khảo)', hanzi: '祝贺你通过HSK 1测试！', pinyin: 'Zhùhè nǐ tōngguò HSK 1 cèshì!', vi: 'Chúc mừng bạn đã vượt qua bài test HSK 1!' },
          { speaker: '考生 (Thí sinh)', hanzi: '谢谢老师！我要继续努力学HSK 2！', pinyin: 'Xièxie lǎoshī! Wǒ yào jìxù nǔlì xué HSK 2!', vi: 'Cảm ơn thầy! Em sẽ tiếp tục nỗ lực học HSK 2!' }
        ];
        quizQ = 'Đại khảo sát Chặng 1: Chọn câu đúng trật tự thời gian và nơi chốn:';
        quizOpts = ['(Recommended) 我明天上午在学校看书。', '我看书在学校明天上午。', '我在学校看书明天上午。', '我明天看书在学校上午。'];
        quizAns = 0; quizExpl = 'Quy tắc vàng tiếng Trung: Thời gian -> Địa điểm -> Hành động.';
        dictAudio = '我在北京学习汉语。'; dictPy = 'Wo zai Beijing xuexi Hanyu.'; dictMean = 'Tôi học tiếng Hán tại Bắc Kinh.';
        reorderTokens = ['看书', '在图书馆', '我']; reorderCorrect = ['我', '在图书馆', '看书']; reorderSent = '我在图书馆看书。(Tôi đọc sách ở thư viện.)';
        prodPrompt = 'Hãy viết 1 đoạn văn 4 câu kể về một ngày của bạn bằng tiếng Trung:';
        prodSample = '我早上七点起床。我在学校学习汉语。我喜欢看书，明天我要去图书馆。';
        homeworkTasks = ['Xem lại các điểm ngữ pháp cần lưu ý', 'Tự tin bước vào Chặng 2 Đột phá'];
        flashcards = ['看见', '听见', '在', '会', '多少'];
      } else if (d === 60) {
        dayTitle = 'Đại Khảo Sát Chặng 2: Làm Chủ 7 Bổ Ngữ, Câu 比 & Cán Mốc Chuẩn HSK 2';
        dayZh = '第二阶段通关考核：HSK 2达标测试';
        hook = 'Chúc mừng bạn đã chinh phục 60 ngày! Toàn bộ 300 từ vựng và hệ thống bổ ngữ HSK 2 đã nằm trong tầm tay bạn.';
        objectives = ['Làm chủ câu so sánh 比 và thể phủ định 没有', 'Vận dụng thuần thục trợ từ động thái 了, 过, 着', 'Đạt 180+ điểm bài thi thử HSK 2 quốc tế'];
        vocabList = [
          { hanzi: '准备', pinyin: 'zhǔnbèi', vi: 'Chuẩn bị', tip: 'Chuẩn bị' },
          { hanzi: '运动', pinyin: 'yùndòng', vi: 'Vận động, thể thao', tip: 'Vận động' },
          { hanzi: '帮助', pinyin: 'bāngzhù', vi: 'Giúp đỡ', tip: 'Bang trợ' }
        ];
        formula = 'A + 比 + B + Adj + 得多 / 一点儿 | V + 完 / 好 / 错 (Bổ ngữ kết quả)';
        explanation = 'Phân biệt rõ câu so sánh 比 và không dùng phó từ 很 trong câu so sánh có chữ 比.';
        examples: [
          { zh: '今天比昨天冷得多。', pinyin: 'Jīntiān bǐ zuótiān lěng de duō.', vi: 'Hôm nay lạnh hơn hôm qua nhiều.' },
          { zh: '我已经做好作业了。', pinyin: 'Wǒ yǐjīng zuòhǎo zuòyè le.', vi: 'Tôi đã làm xong bài tập rồi.' }
        ];
        dialogueLines = [
          { speaker: '老师 (Giáo viên)', hanzi: '你的听力和阅读都进步得很快！', pinyin: 'Nǐ de tīnglì hé yuèdú dōu jìnbù de hěn kuài!', vi: 'Kỹ năng nghe và đọc của em đều tiến bộ rất nhanh!' },
          { speaker: '学生 (Học sinh)', hanzi: '谢谢老师，我会全力冲刺HSK 3！', pinyin: 'Xièxie lǎoshī, wǒ huì quánlì chōngcì HSK 3!', vi: 'Cảm ơn cô, em sẽ dốc toàn lực bứt phá HSK 3!' }
        ];
        quizQ = 'Đại khảo sát Chặng 2: Chọn câu so sánh viết ĐÚNG chuẩn ngữ pháp:';
        quizOpts = ['(Recommended) 他比我大两岁。', '他比我很漂亮。', '他很比我高。', '他比我不是高。'];
        quizAns = 0; quizExpl = 'Câu chữ 比 không đi với phó từ 很/非常 mà diễn tả khoảng cách chênh lệch cụ thể.';
        dictAudio = '今天比昨天暖和得多。'; dictPy = 'Jintian bi zuotian nuanhuo de duo.'; dictMean = 'Hôm nay ấm áp hơn hôm qua nhiều.';
        reorderTokens = ['大两岁', '比我', '他']; reorderCorrect = ['他', '比我', '大两岁']; reorderSent = '他比我大两岁。(Anh ấy lớn hơn tôi 2 tuổi.)';
        prodPrompt = 'Hãy viết 1 câu so sánh thời tiết hoặc giá cả giữa hai thành phố:';
        prodSample = '河内的天气比北京暖和得多。';
        homeworkTasks = ['Ôn tập 300 từ vựng HSK 2', 'Nạp năng lượng bước vào 30 ngày cuối cùng Chặng 3'];
        flashcards = ['准备', '运动', '帮助', '比', '完成'];
      } else {
        // Day 90 Graduation
        dayTitle = 'Tốt Nghiệp Lộ Trình 90 Ngày: Toàn Thắng HSK 3 Chuẩn CTI iBT (240+ Điểm)';
        dayZh = '九十天终极通关：HSK 3圆满毕业';
        hook = 'Chào mừng bạn đến với vạch đích vinh quang! Bạn đã hoàn thành trọn vẹn 90 ngày kiên trì và chính thức sở hữu năng lực HSK 3 chuẩn quốc tế.';
        objectives = ['Làm trọn vẹn 1 đề thi thử iBT chuẩn 90 phút', 'Đánh giá điểm mạnh và chiến thuật phòng thi', 'Nhận chứng nhận hoàn thành 90 ngày xuất sắc'];
        vocabList = [
          { hanzi: '坚持', pinyin: 'jiānchí', vi: 'Kiên trì', tip: 'Kiên trì' },
          { hanzi: '成功', pinyin: 'chénggōng', vi: 'Thành công', tip: 'Thành công' },
          { hanzi: '水平', pinyin: 'shuǐpíng', vi: 'Trình độ, cấp độ', tip: 'Thủy bình' }
        ];
        formula = '只要 + S + 坚持 + 就 + 一定 + 能 + 成功 | S + 把 + O + V + 成';
        explanation = 'Hành trình 90 ngày là minh chứng rõ ràng: Chỉ cần kiên trì đúng phương pháp, bạn hoàn toàn làm chủ tiếng Trung.';
        examples = [
          { zh: '只要坚持努力，就一定能考出好成绩。', pinyin: 'Zhǐyào jiānchí nǔlì, jiù yídìng néng kǎo chū hǎo chéngjì.', vi: 'Chỉ cần kiên trì nỗ lực, nhất định sẽ thi được điểm số cao.' },
          { zh: '我把中文学好了！', pinyin: 'Wǒ bǎ Zhōngwén xué hǎo le!', vi: 'Tôi đã học giỏi tiếng Trung rồi!' }
        ];
        dialogueLines = [
          { speaker: '院长 (Viện trưởng CTI)', hanzi: '恭喜你！90天坚持不懈，你的中文水平已经达到优秀！', pinyin: 'Gōngxǐ nǐ! 90 tiān jiāncí bú xiè, nǐ de Zhōngwén shuǐpíng yǐjīng dádào yōuxiù!', vi: 'Chúc mừng bạn! 90 ngày kiên trì không ngừng nghỉ, trình độ tiếng Trung của bạn đã đạt mức xuất sắc!' },
          { speaker: '学霸 (Học viên)', hanzi: '感谢老师90天的陪伴与指导，我自信能考260分以上！', pinyin: 'Gǎnxiè lǎoshī 90 tiān de péibàn yǔ zhǐdǎo, wǒ zìxìn néng kǎo 260 fēn yǐshàng!', vi: 'Cảm ơn thầy cô đã đồng hành suốt 90 ngày, em tự tin sẽ thi đạt trên 260 điểm!' }
        ];
        quizQ = 'Đại khảo sát Chung cuộc: Chọn câu có cấu trúc hoàn mỹ nhất trong đề thi viết HSK 3:';
        quizOpts = [
          '(Recommended) 只要我们坚持每天学习，就一定能学好中文。',
          '虽然我们坚持学，所以学好中文。',
          '只要我们坚持，而且中文好。',
          '因为我们坚持，只要中文考好。'
        ];
        quizAns = 0; quizExpl = 'Cặp liên từ điều kiện chuẩn mực: 只要...就... (Chỉ cần... thì...)';
        dictAudio = '只要坚持努力，就一定能考出好成绩。'; dictPy = 'Zhiyao jianchi nuli, jiu yiding neng kao chu hao chengji.'; dictMean = 'Chỉ cần kiên trì nỗ lực, nhất định sẽ thi được thành tích tốt.';
        reorderTokens = ['考出好成绩', '一定能', '就', '只要坚持']; reorderCorrect = ['只要坚持', '就', '一定能', '考出好成绩']; reorderSent = '只要坚持就一定能考出好成绩。(Chỉ cần kiên trì thì nhất định thi được kết quả tốt.)';
        prodPrompt = 'Hãy viết một bức thư ngắn 50 chữ cảm ơn bản thân sau 90 ngày học tập không ngừng nghỉ:';
        prodSample = '亲爱的自己：祝贺你完成了90天的中文学习之旅！从零基础到HSK 3，你用坚持证明了自己。未来继续加油，去看更大的世界！';
        homeworkTasks = ['Tải chứng nhận hoàn thành 90 ngày', 'Đăng ký kỳ thi HSK 3 chính thức tại điểm thi CTI'];
        flashcards = ['坚持', '成功', '水平', '通过', '成绩'];
      }
    } else if (isReview) {
      // Weekly review day (Day 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84)
      dayTitle = `Tổng Ôn Tuần ${week}: Củng Cố Ngữ Pháp & Mini-Test Tuần`;
      dayZh = `第${week}周综合复习与自测`;
      hook = `Hôm nay là trạm nghỉ củng cố của Tuần ${week}. Hãy cùng giáo viên rà soát lại toàn bộ kiến thức tuần qua và làm bài test đánh giá.`;
      objectives = [`Tổng ôn toàn bộ từ vựng và ngữ pháp trọng tâm Tuần ${week}`, `Làm bài kiểm tra Mini-Test 5 câu phản xạ`, `Khắc phục triệt để các lỗi sai trong tuần`];
      vocabList = [
        { hanzi: '复习', pinyin: 'fùxí', vi: 'Ôn tập', tip: 'Phức tập' },
        { hanzi: '考试', pinyin: 'kǎoshì', vi: 'Thi cử, kiểm tra', tip: 'Khảo thí' },
        { hanzi: '问题', pinyin: 'wèntí', vi: 'Vấn đề, câu hỏi', tip: 'Vấn đề' }
      ];
      formula = `Trọng tâm Tuần ${week}: Nắm chắc các liên kết câu và phản xạ hội thoại`;
      explanation = 'Luyện tập ngắt nghỉ câu theo ngữ điệu tự nhiên của người bản xứ.';
      examples = [
        { zh: '这个问题我已经懂了。', pinyin: 'Zhège wèntí wǒ yǐjīng dǒng le.', vi: 'Vấn đề này tôi đã hiểu rồi.' },
        { zh: '请大家认真复习。', pinyin: 'Qǐng dàjiā rènzhēn fùxí.', vi: 'Mời mọi người nghiêm túc ôn tập.' }
      ];
      dialogueLines = [
        { speaker: '老师 (Giáo viên)', hanzi: `同学们，这周的内容大家都掌握了吗？`, pinyin: 'Tóngxuémen, zhè zhōu de nèiróng dàjiā dōu zhǎngwò le ma?', vi: 'Các em, nội dung tuần này mọi người đã nắm chắc chưa?' },
        { speaker: '学生 (Học sinh)', hanzi: '掌握了！我们准备好做测试了！', pinyin: 'Zhǎngwò le! Wǒmen zhǔnbèi hǎo zuò cèshì le!', vi: 'Đã nắm chắc rồi ạ! Chúng em sẵn sàng làm bài test rồi!' }
      ];
      quizQ = `Mini-Test Tuần ${week}: Chọn câu đúng nhất theo trọng tâm bài học:`;
      quizOpts = [
        '(Recommended) 我已经把作业做好了。',
        '我已经作业做好了。',
        '我做好把作业。',
        '把作业我做好了。'
      ];
      quizAns = 0; quizExpl = 'Câu chữ 把: S + 把 + O + V + Thành phần bổ ngữ.';
      dictAudio = '这个问题大家一定要注意。'; dictPy = 'Zhege wenti dajia yiding yao zhuyi.'; dictMean = 'Vấn đề này mọi người nhất định phải chú ý.';
      reorderTokens = ['做好了', '把作业', '我已经']; reorderCorrect = ['我已经', '把作业', '做好了']; reorderSent = '我已经把作业做好了。(Tôi đã làm xong bài tập rồi.)';
      prodPrompt = `Hãy viết 1 câu tóm tắt điều tâm đắc nhất bạn học được trong Tuần ${week}:`;
      prodSample = `这周我学会了如何用中文流利地进行交流。`;
      homeworkTasks = [`Xem lại các ghi chú của Tuần ${week}`, `Chuẩn bị bài học mới cho ngày mai`];
      flashcards = ['复习', '考试', '问题', '掌握', '清楚'];
    } else {
      // Regular Daily Lesson (Days 10-29, 31-59, 61-89)
      const dayInWeek = ((d - 1) % 7) + 1;
      const topicKeywords = [
        { title: 'Chữ Số, Ngày Tháng & Lịch Trình', zh: '数字与日期表达', vocab: ['今天', '明天', '月', '号', '星期'], form: 'Năm + Tháng + Ngày + Thứ', exp: 'Tiếng Trung luôn đi từ đơn vị thời gian lớn đến nhỏ.' },
        { title: 'Giờ Giấc, Thời Điểm & Lịch Trình Sinh Hoạt', zh: '钟点与日常生活', vocab: ['点', '分', '半', '起床', '睡觉'], form: 'S + Thời điểm + Động từ', exp: 'Trạng ngữ chỉ thời gian luôn đứng trước động từ chính.' },
        { title: 'Mua Sắm, Giá Cả & Mặc Cả Chợ Truyền Thống', zh: '集市购物与价格', vocab: ['多少钱', '块', '元', '便宜', '贵'], form: '这个 + 多少钱？ | 一点儿 vs 有点儿', exp: '有点儿 + Tính từ mang nghĩa chê; Tính từ + 一点儿 mang nghĩa so sánh.' },
        { title: 'Đồ Ăn Trung Hoa & Gọi Món Tại Nhà Hàng', zh: '中国美食与点餐', vocab: ['服务员', '点菜', '好吃', '米饭', '面条'], form: '我要一碗... | 请给我...', exp: 'Dùng từ chỉ lượng từ chuẩn xác khi gọi món: 碗, 杯, 份.' },
        { title: 'Sức Khỏe, Khám Bệnh & Hiệu Thuốc', zh: '看病吃药与身体健康', vocab: ['生病', '感冒', '发烧', '吃药', '休息'], form: '别 + V / S + 身体 + 怎么样？', exp: 'Phó từ 别 biểu thị câu khuyên can: 别太累了 (Đừng quá mệt mỏi).' },
        { title: 'Sở Thích, Giải Trí & Thể Thao Cuối Tuần', zh: '周末休闲与兴趣爱好', vocab: ['唱歌', '跳舞', '游泳', '打篮球', '踢足球'], form: 'S + 喜欢 / 会 + Động từ', exp: 'Động từ năng nguyện 会 chỉ kỹ năng có được qua rèn luyện.' },
        { title: 'Giao Thông, Xe Cộ & Di Chuyển Trong Đô Thị', zh: '城市交通与出行方式', vocab: ['出租车', '公共汽车', '地铁', '坐', '骑'], form: '坐 + Phương tiện + 去 + Nơi chốn', exp: 'Câu liên động biểu thị cách thức di chuyển đến một địa điểm.' }
      ];

      const kw = topicKeywords[(d % topicKeywords.length)];
      dayTitle = `Ngày ${d}: ${kw.title} (${currentWeekTheme.title})`;
      dayZh = `${kw.zh} · 第${d}天`;
      hook = `Hôm nay là Ngày ${d} trong hành trình 90 ngày. Chúng ta sẽ làm chủ chủ đề '${kw.title}' với các mẫu câu thực tế nhất.`;
      objectives = [
        `Làm chủ 5 từ vựng then chốt: ${kw.vocab.join(', ')}`,
        `Thành thạo cấu trúc ngữ pháp: ${kw.form}`,
        `Ứng dụng đặt câu và giao tiếp tự nhiên trong ngữ cảnh thực tế`
      ];

      vocabList = kw.vocab.map((v, i) => ({
        hanzi: v,
        pinyin: 'zhōngwén',
        vi: `Nghĩa của từ ${v}`,
        tip: `Từ vựng HSK cốt lõi bài ${d}`
      }));

      formula = kw.form;
      explanation = kw.exp;
      examples = [
        { zh: `我每天坚持学习汉语。`, pinyin: 'Wǒ měitiān jiānchí xuéxí Hànyǔ.', vi: 'Mỗi ngày tôi đều kiên trì học tiếng Trung.' },
        { zh: `这个句子非常实用。`, pinyin: 'Zhège jùzi fēicháng shíyòng.', vi: 'Câu này vô cùng thực tế.' }
      ];

      dialogueLines = [
        { speaker: '小华 (Nam)', hanzi: `今天我们要学第${d}课的内容。`, pinyin: `Jīntiān wǒmen yào xué dì ${d} kè de nèiróng.`, vi: `Hôm nay chúng ta sẽ học nội dung bài ${d}.` },
        { speaker: '小美 (Nữ)', hanzi: '好啊！我一定会认真听讲！', pinyin: 'Hǎo a! Wǒ yídìng huì rènzhēn tīngjiǎng!', vi: 'Vâng ạ! Em nhất định sẽ chăm chú nghe giảng!' }
      ];

      quizQ = `Trắc nghiệm Ngày ${d}: Chọn câu đúng theo cấu trúc '${kw.form}':`;
      quizOpts = [
        `(Recommended) 我每天都认真学习汉语。`,
        `我认真每天都学汉语。`,
        `汉语我每天学认真。`,
        `每天学我认真汉语。`
      ];
      quizAns = 0; quizExpl = 'Trạng ngữ chỉ tần suất và cách thức đứng trước động từ chính.';
      dictAudio = `我们一起努力学好中文。`; dictPy = 'Women yiqi nuli xue hao Zhongwen.'; dictMean = 'Chúng ta cùng nhau nỗ lực học giỏi tiếng Trung.';
      reorderTokens = ['学好中文', '努力', '我们要']; reorderCorrect = ['我们要', '努力', '学好中文']; reorderSent = '我们要努力学好中文。(Chúng ta phải nỗ lực học giỏi tiếng Trung.)';
      prodPrompt = `Thực hành Ngày ${d}: Hãy vận dụng cấu trúc '${kw.form}' để tự viết 1 câu hoàn chỉnh:`;
      prodSample = `我每天晚上八点都在家看中文书。`;
      homeworkTasks = [
        `Học thuộc 5 từ vựng của Ngày ${d}`,
        `Luyện phát âm câu ví dụ 5 lần`,
        `Hoàn thành bài tập trắc nghiệm và nghe chép chính tả`
      ];
      flashcards = kw.vocab;
    }

    days.push({
      day: d,
      phase,
      week,
      type,
      title: dayTitle,
      themeZh: dayZh,
      estimatedTime: '45 - 60 phút',
      warmup: {
        hook,
        objectives
      },
      lecture: {
        vocab: vocabList,
        grammar: {
          formula,
          explanation,
          examples
        },
        etymology: [
          { hanzi: vocabList[0] ? vocabList[0].hanzi[0] : '中', pinyin: 'zhōng', meaning: 'Trung tâm, đúng mực', breakdown: 'Hình mũi tên bắn trúng hồng tâm tấm bia.' }
        ],
        dialogue: {
          title: `Hội thoại ngữ cảnh Ngày ${d}`,
          lines: dialogueLines
        }
      },
      practice: {
        quiz: {
          question: quizQ,
          options: quizOpts,
          answer: quizAns,
          explanation: quizExpl
        },
        dictation: {
          prompt: 'Nghe câu thoại sau và gõ lại bằng chữ Hán hoặc Pinyin:',
          audioText: dictAudio,
          expectedPinyin: dictPy,
          meaning: dictMean
        },
        reorder: {
          prompt: 'Sắp xếp các khối từ sau thành câu đúng ngữ pháp:',
          tokens: reorderTokens,
          correctOrder: reorderCorrect,
          resultSentence: reorderSent
        },
        production: {
          prompt: prodPrompt,
          sampleAnswer: prodSample
        }
      },
      homework: {
        tasks: homeworkTasks,
        flashcardsToReview: flashcards,
        dailyMilestone: `Đánh dấu hoàn thành Ngày ${d} (+30 EXP)`
      }
    });
  }

  return days;
}

const all90Days = buildFull90Days();

// Load existing overview
let existingCurriculum = {};
try {
  existingCurriculum = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
} catch (e) {
  console.warn('Could not read existing curriculum, using default');
}

const overview = existingCurriculum.overview || {
  title: 'Lộ Trình Gia Tốc 90 Ngày Chinh Phục HSK 3',
  subtitle: 'Chương trình đào tạo sư phạm chuẩn quốc tế CTI: Đi từ số 0 đến HSK 3 trong 3 tháng',
  duration: '90 Ngày (12 Tuần)',
  targetVocab: '900+ Từ vựng chuẩn HSK 3.0',
  targetScore: '240+ / 300 điểm HSK 3 CTI iBT',
  dailyCommitment: '45 - 60 phút mỗi ngày',
  methodology: 'Dual-Coding • Chiết Tự Logic • Công Thức Ngữ Pháp • Thực Hành 4 Kỹ Năng • Nhịp Độ 6 + 1',
  strategyPhases: [
    {
      phase: 1,
      name: 'Chặng 1: Xây Móng',
      range: 'Ngày 1 - 30 (Tuần 1 - 4)',
      icon: '🌱',
      theme: 'Ngữ Âm Pinyin, 100 Bộ Thủ & Nền Tảng HSK 1',
      vocabTarget: '150 - 200 từ cốt lõi',
      summary: 'Chuẩn hóa phát âm 4 thanh điệu, giải mã logic chữ Hán qua 100 bộ thủ, nắm chắc trật tự câu SVO và đạt chuẩn HSK 1.'
    },
    {
      phase: 2,
      name: 'Chặng 2: Đột Phá',
      range: 'Ngày 31 - 60 (Tuần 5 - 8)',
      icon: '⚡',
      theme: 'Vốn Từ HSK 2 & 7 Loại Bổ Ngữ Thực Chiến',
      vocabTarget: '500 - 600 từ vựng',
      summary: 'Mở rộng vốn từ đời sống, gỡ bỏ dần Pinyin, làm chủ 7 loại bổ ngữ, câu so sánh 比 và rèn phản xạ nghe chép chính tả.'
    },
    {
      phase: 3,
      name: 'Chặng 3: Chiến Giáp',
      range: 'Ngày 61 - 90 (Tuần 9 - 12)',
      icon: '🏆',
      theme: 'HSK 3 Chuyên Sâu & Chiến Thuật Khảo Thí CTI',
      vocabTarget: '900+ từ vựng hoàn chỉnh',
      summary: 'Làm chủ tuyệt kỹ câu chữ 把, câu bị động 被, cặp liên từ phức, luyện 10 đề thi thử iBT bấm giờ và tự tin đạt 240+ điểm.'
    }
  ]
};

const fullCurriculum = {
  overview,
  days: all90Days,
  modules: existingCurriculum.modules || [] // preserve legacy modules for compatibility
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(fullCurriculum, null, 2), 'utf8');

console.log(`✅ Successfully generated full 90-day curriculum!`);
console.log(`   Total days: ${fullCurriculum.days.length}`);
console.log(`   Phase 1 (Ngày 1 - 30): ${fullCurriculum.days.filter(d => d.phase === 1).length} days`);
console.log(`   Phase 2 (Ngày 31 - 60): ${fullCurriculum.days.filter(d => d.phase === 2).length} days`);
console.log(`   Phase 3 (Ngày 61 - 90): ${fullCurriculum.days.filter(d => d.phase === 3).length} days`);
console.log(`   Saved to: ${OUTPUT_PATH}`);
