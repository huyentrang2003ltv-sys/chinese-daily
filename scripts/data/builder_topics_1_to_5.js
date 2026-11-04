// Builder for Lessons 1 - 50 (Topics 1 - 5)
// Topics: 1. Chào hỏi (1-10), 2. Giao tiếp (11-20), 3. Gia đình & bạn bè (21-30), 4. Ăn uống (31-40), 5. Mua sắm (41-50)

const fs = require('fs');

const topicNames = {
  1: { full: '1. Chào hỏi và giới thiệu bản thân', short: 'Chào hỏi', icon: 'hand-metal', level: 'HSK 1 - 2' },
  2: { full: '2. Giao tiếp hàng ngày', short: 'Giao tiếp', icon: 'message-circle', level: 'HSK 1 - 2' },
  3: { full: '3. Gia đình và bạn bè', short: 'Gia đình & Bạn', icon: 'users', level: 'HSK 2' },
  4: { full: '4. Ăn uống và nhà hàng', short: 'Ăn uống', icon: 'utensils', level: 'HSK 2 - 3' },
  5: { full: '5. Mua sắm', short: 'Mua sắm', icon: 'shopping-bag', level: 'HSK 2 - 3' },
};

// Raw base from existing 1-20
const raw1to20 = require('./dialogue_raw_1_50.js');

// Now define 21 to 50
const raw21to50 = [
  // 21. Giới thiệu các thành viên trong gia đình
  {
    num: 21, top: 3, lvl: 'HSK 2', title: 'Giới thiệu các thành viên trong gia đình', hz: '介绍家庭成员', py: 'Jièshào jiātíng chéngyuán',
    sit: 'Minh cho Lan xem tấm ảnh chụp gia đình ở Việt Nam và giới thiệu từng người.',
    c: [{ n: 'Minh', r: 'Du học sinh', g: 'male', a: '👦' }, { n: 'Lan', r: 'Bạn học', g: 'female', a: '👧' }],
    d: [
      { s: 'Lan', g: 'female', hz: '阿明，这张照片上的人都是你的家人吗？', py: 'Ā Míng, zhè zhāng zhàopiàn shang de rén dōu shì nǐ de jiārén ma?', vi: 'A Minh, những người trong bức ảnh này đều là người nhà của cậu à?' },
      { s: 'Minh', g: 'male', hz: '是的，我家有四口人：爸爸、妈妈、姐姐和我。', py: 'Shì de, wǒ jiā yǒu sì kǒu rén: bàba, māma, jiějie hé wǒ.', vi: 'Đúng vậy, nhà mình có 4 người: bố, mẹ, chị gái và mình.' },
      { s: 'Lan', g: 'female', hz: '你姐姐长得真漂亮，她是做什么工作的？', py: 'Nǐ jiějie zhǎng de zhēn piàoliang, tā shì zuò shénme gōngzuò de?', vi: 'Chị gái cậu trông xinh quá, chị ấy làm công việc gì thế?' },
      { s: 'Minh', g: 'male', hz: '姐姐是一名小学英语老师，爸爸是医生，妈妈开了一家花店。', py: 'Jiějie shì yì míng xiǎoxué yīngyǔ lǎoshī, bàba shì yīshēng, māma kāi le yì jiā huādiàn.', vi: 'Chị mình là giáo viên tiếng Anh tiểu học, bố là bác sĩ, còn mẹ mở một tiệm hoa.' }
    ],
    v: [{ hz: '口', py: 'kǒu', m: 'lượng từ chỉ nhân khẩu', hsk: 'HSK 1' }, { hz: '成员', py: 'chéngyuán', m: 'thành viên', hsk: 'HSK 3' }, { hz: '花店', py: 'huādiàn', m: 'tiệm hoa', hsk: 'HSK 2' }],
    g: [{ t: 'Số lượng thành viên: 家有几口人', s: '我家有 + [Số lượng] + 口人', e: 'Nhà có mấy người dùng lượng từ 口 (kǒu).' }],
    q: [{ q: 'Gia đình Minh có bao nhiêu người?', o: ['3 người', '4 người', '5 người', '6 người'], a: 1, exp: 'Minh nói: "我家有四口人".' }],
    sp: { hz: '我家有四口人，生活很幸福。', py: 'Wǒ jiā yǒu sì kǒu rén, shēnghuó hěn xìngfú.', vi: 'Gia đình tôi có 4 người, sống rất hạnh phúc.' }
  },
  // 22. Nói về bố mẹ
  {
    num: 22, top: 3, lvl: 'HSK 2', title: 'Nói về bố mẹ', hz: '谈论父母', py: 'Tánlùn fùmǔ',
    sit: 'Vương Lực và Tuấn trò chuyện về tính cách và công việc của bố mẹ.',
    c: [{ n: 'Vương Lực', r: 'Bạn học', g: 'male', a: '👨' }, { n: 'Tuấn', r: 'Bạn học', g: 'male', a: '👦' }],
    d: [
      { s: 'Vương Lực', g: 'male', hz: '阿俊，你爸爸妈妈平时性格怎么样？', py: 'Ā Jùn, nǐ bàba māma píngshí xìnggé zěnmeyàng?', vi: 'A Tuấn, bố mẹ cậu bình thường tính tình thế nào?' },
      { s: 'Tuấn', g: 'male', hz: '我爸爸比较严肃，但非常有责任感；我妈妈特别温柔善良。', py: 'Wǒ bàba bǐjiào yánsù, dàn fēicháng yǒu zérèngǎn; wǒ māma tèbié wēnróu shànliáng.', vi: 'Bố mình khá nghiêm nghị, nhưng rất có trách nhiệm; còn mẹ mình cực kỳ dịu dàng, nhân hậu.' },
      { s: 'Vương Lực', g: 'male', hz: '听起来家庭氛围很温馨！他们平时有什么爱好吗？', py: 'Tīng qǐlái jiātíng fēnwéi hěn wēnxīn! Tāmen píngshí yǒu shénme àihào ma?', vi: 'Nghe có vẻ không khí gia đình rất ấm cúng! Họ có sở thích gì không?' },
      { s: 'Tuấn', g: 'male', hz: '我爸喜欢下象棋，我妈喜欢养花和做甜点。', py: 'Wǒ bà xǐhuan xià xiàngqí, wǒ mā xǐhuan yǎng huā hé zuò tiándiǎn.', vi: 'Bố mình thích chơi cờ tướng, mẹ thích trồng hoa và làm đồ ngọt.' }
    ],
    v: [{ hz: '严肃', py: 'yánsù', m: 'nghiêm nghị, nghiêm túc', hsk: 'HSK 4' }, { hz: '责任感', py: 'zérèngǎn', m: 'tinh thần trách nhiệm', hsk: 'HSK 4' }, { hz: '下象棋', py: 'xià xiàngqí', m: 'đánh cờ tướng', hsk: 'HSK 3' }],
    g: [{ t: 'Cảm giác khi nghe: 听起来 (Tīng qǐlái)', s: '听起来 + [Tính từ / Nhận xét]', e: 'Nghe có vẻ ấm áp, nghe có vẻ thú vị.' }],
    q: [{ q: 'Bố của Tuấn có sở thích gì?', o: ['Đá bóng', 'Đánh cờ tướng', 'Đọc báo', 'Câu cá'], a: 1, exp: 'Tuấn nói bố thích 下象棋 (đánh cờ tướng).' }],
    sp: { hz: '我爸爸很有责任感，妈妈很温柔。', py: 'Wǒ bàba hěn yǒu zérèngǎn, māma hěn wēnróu.', vi: 'Bố tôi rất có trách nhiệm, mẹ rất dịu dàng.' }
  },
  // 23. Nói về anh chị em
  {
    num: 23, top: 3, lvl: 'HSK 2', title: 'Nói về anh chị em', hz: '聊聊兄弟姐妹', py: 'Liáoliao xiōngdì jiěmèi',
    sit: 'Tiểu Mẫn hỏi Thu Hà về em trai và quan hệ anh chị em trong nhà.',
    c: [{ n: 'Tiểu Mẫn', r: 'Bạn nữ', g: 'female', a: '👧' }, { n: 'Thu Hà', r: 'Chị cả', g: 'female', a: '👩' }],
    d: [
      { s: 'Tiểu Mẫn', g: 'female', hz: '秋河，你是家里的独生女吗？', py: 'Qiūhé, nǐ shì jiā lǐ de dúshēngnǚ ma?', vi: 'Thu Hà, cậu là con gái một trong nhà à?' },
      { s: 'Thu Hà', g: 'female', hz: '不是，我还有一个弟弟，今年刚上高中。', py: 'Bú shì, wǒ hái yǒu yí gè dìdi, jīnnián gāng shàng gāozhōng.', vi: 'Không phải, mình còn có một đứa em trai, năm nay vừa lên cấp ba.' },
      { s: 'Tiểu Mẫn', g: 'female', hz: '平时你们姐弟俩关系怎么样？会吵架吗？', py: 'Píngshí nǐmen jiědì liǎ guānxì zěnmeyàng? Huì chǎojià ma?', vi: 'Bình thường quan hệ hai chị em cậu thế nào? Có hay cãi nhau không?' },
      { s: 'Thu Hà', g: 'female', hz: '小时候经常为了玩具争吵，长大后关系越来越好，他遇到心事都会和我聊。', py: 'Xiǎoshíhou jīngcháng wèi le wánjù zhēngchǎo, zhǎngdà hòu guānxì yuèláiyuè hǎo, tā yùdào xīnshì dōu huì hé wǒ liáo.', vi: 'Hồi bé hay tranh cãi vì đồ chơi, lớn lên quan hệ càng ngày càng tốt, nó gặp tâm sự gì cũng kể với mình.' }
    ],
    v: [{ hz: '独生女', py: 'dúshēngnǚ', m: 'con gái một', hsk: 'HSK 4' }, { hz: '姐弟俩', py: 'jiědì liǎ', m: 'hai chị em', hsk: 'HSK 3' }, { hz: '争吵', py: 'zhēngchǎo', m: 'tranh cãi', hsk: 'HSK 4' }, { hz: '心事', py: 'xīnshì', m: 'tâm sự, nỗi lòng', hsk: 'HSK 4' }],
    g: [{ t: 'Càng ngày càng: 越来越... (Yuèláiyuè...)', s: '越来越 + Tính từ / Động từ tâm lý', e: 'Chỉ mức độ tăng tiến theo thời gian.' }],
    q: [{ q: 'Em trai của Thu Hà năm nay học lớp mấy?', o: ['Tiểu học', 'Trung học cơ sở', 'Trung học phổ thông (cấp ba)', 'Đại học'], a: 2, exp: 'Thu Hà nói: "刚上高中" (vừa lên cấp ba).' }],
    sp: { hz: '我们姐弟俩的关系越来越好了。', py: 'Wǒmen jiědì liǎ de guānxì yuèláiyuè hǎo le.', vi: 'Mối quan hệ của hai chị em chúng tôi ngày càng tốt đẹp.' }
  },
  // 24. Kể về người bạn thân nhất
  {
    num: 24, top: 3, lvl: 'HSK 2', title: 'Kể về người bạn thân nhất', hz: '讲述最好的朋友', py: 'Jiǎngshù zuì hǎo de péngyou',
    sit: 'Đại Vệ chia sẻ với Minh về người bạn thân tri kỷ quen từ thời tiểu học.',
    c: [{ n: 'Đại Vệ', r: 'Bạn kể', g: 'male', a: '👨' }, { n: 'Văn Minh', r: 'Bạn lắng nghe', g: 'male', a: '👦' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '大卫，谁是你最好的朋友？你们是怎么认识的？', py: 'Dàwèi, shéi shì nǐ zuì hǎo de péngyou? Nǐmen shì zěnme rènshi de?', vi: 'Đại Vệ, ai là người bạn thân nhất của cậu? Hai người quen nhau thế nào?' },
      { s: 'Đại Vệ', g: 'male', hz: '我最好的哥们儿叫李明，我们从小学一年级起就是同班同学。', py: 'Wǒ zuì hǎo de gēmenr jiào Lǐ Míng, wǒmen cóng xiǎoxué yī niánjí qǐ jiù shì tóngbān tóngxué.', vi: 'Bạn chí cốt nhất của mình tên là Lý Minh, bọn mình là bạn cùng lớp từ hồi lớp 1 tiểu học.' },
      { s: 'Văn Minh', g: 'male', hz: '哇，认识十几年了，真是难得的友谊！他是个怎样的人？', py: 'Wā, rènshi shí jǐ nián le, zhēn shì nándé de yǒuyì! Tā shì gè zěnyàng de rén?', vi: 'Oa, quen nhau hơn chục năm rồi, thật là tình bạn đáng quý! Cậu ấy là người thế nào?' },
      { s: 'Đại Vệ', g: 'male', hz: '他为人特别讲义气，无论谁遇到困难，他总是第一个站出来帮忙。', py: 'Tā wéirén tèbié jiǎng yìqi, wúlùn shéi yùdào kùnnan, tā zǒng shì dì-yī gè zhàn chūlai bāngmáng.', vi: 'Cậu ấy sống rất trọng nghĩa khí, bất kể ai gặp khó khăn, cậu ấy luôn là người đầu tiên đứng ra giúp đỡ.' }
    ],
    v: [{ hz: '哥们儿', py: 'gēmenr', m: 'anh em chí cốt, bạn nối khố', hsk: 'HSK 3' }, { hz: '友谊', py: 'yǒuyì', m: 'tình bạn', hsk: 'HSK 3' }, { hz: '讲义气', py: 'jiǎng yìqi', m: 'trọng nghĩa khí', hsk: 'HSK 4' }],
    g: [{ t: 'Bất kể ai/điều gì: 无论...都/总 (Wúlùn... dōu/zǒng)', s: '无论 + Đại từ nghi vấn + 主语 + 都/总...', e: 'Bất luận ai gặp khó khăn cũng giúp.' }],
    q: [{ q: 'Đại Vệ và Lý Minh quen nhau từ khi nào?', o: ['Mẫu giáo', 'Lớp 1 tiểu học', 'Cấp 2', 'Lên đại học'], a: 1, exp: 'Đại Vệ nói: "从小学一年级起".' }],
    sp: { hz: '真正的友谊是人生最宝贵的财富。', py: 'Zhēnzhèng de yǒuyì shì rénshēng zuì bǎoguì de cáifù.', vi: 'Tình bạn chân chính là tài sản quý giá nhất trong đời.' }
  },
  // 25. Lên kế hoạch đi chơi cùng bạn
  {
    num: 25, top: 3, lvl: 'HSK 2', title: 'Lên kế hoạch đi chơi cùng bạn', hz: '与朋友商量出游', py: 'Yǔ péngyou shāngliang chūyóu',
    sit: 'Nhóm bạn rủ nhau đi dã ngoại cắm trại ngoại ô vào cuối tuần.',
    c: [{ n: 'Bảo Ngọc', r: 'Bạn nữ lên kế hoạch', g: 'female', a: '👩' }, { n: 'Hoàng Long', r: 'Bạn nam hào hứng', g: 'male', a: '👨' }],
    d: [
      { s: 'Bảo Ngọc', g: 'female', hz: '黄龙，听说怀柔那边的红螺寺枫叶红了，这周日我们去爬山露营吧！', py: 'Huáng Lóng, tīngshuō Huáiróu nàbian de Hóngluósì fēngyè hóng le, zhè zhōurì wǒmen qù páshān lùyíng ba!', vi: 'Hoàng Long, nghe nói lá phong chùa Hồng Loa bên Hoài Nhu đỏ rồi, Chủ Nhật này tụi mình đi leo núi cắm trại đi!' },
      { s: 'Hoàng Long', g: 'male', hz: '好主意！秋高气爽，正好适合户外运动。一共有几个人去？', py: 'Hǎo zhǔyi! Qiūgāoqìshuǎng, zhènghǎo shìhé hùwài yùndòng. Yígòng yǒu jǐ gè rén qù?', vi: 'Ý kiến hay! Tiết trời thu mát mẻ sảng khoái, vừa vặn thích hợp vận động ngoài trời. Tổng cộng có mấy người đi?' },
      { s: 'Bảo Ngọc', g: 'female', hz: '大概有五六个同学。我们分工合作：男生带帐篷和烧烤架，女生准备食材和水果。', py: 'Dàgài yǒu wǔ liù gè tóngxué. Wǒmen fēngōng hézuò: nánshēng dài zhàngpeng hé shāokǎojià, nǚshēng zhǔnbèi shícái hé shuǐguǒ.', vi: 'Tầm năm sáu bạn học. Tụi mình phân công hợp tác nhé: các bạn nam mang lều và vỉ nướng, các bạn nữ chuẩn bị thực phẩm và hoa quả.' },
      { s: 'Hoàng Long', g: 'male', hz: '没问题，我车上有现成的大帐篷！周日早晨八点校门口集合！', py: 'Méi wèntí, wǒ chē shang yǒu xiànchéng de dà zhàngpeng! Zhōurì zǎochen bā diǎn xiào ménkǒu jíhé!', vi: 'Không thành vấn đề, trên xe mình có sẵn lều to! 8 giờ sáng Chủ Nhật tập trung ở cổng trường nhé!' }
    ],
    v: [{ hz: '露营', py: 'lùyíng', m: 'cắm trại', hsk: 'HSK 4' }, { hz: '秋高气爽', py: 'qiūgāoqìshuǎng', m: 'tiết trời thu mát mẻ, trời cao mây thoáng', hsk: 'HSK 5' }, { hz: '分工合作', py: 'fēngōng hézuò', m: 'phân công hợp tác', hsk: 'HSK 4' }, { hz: '集合', py: 'jíhé', m: 'tập hợp', hsk: 'HSK 3' }],
    g: [{ t: 'Thành ngữ bốn chữ miêu tả mùa thu: 秋高气爽', s: '秋高气爽 (Qiūgāoqìshuǎng)', e: 'Dùng miêu tả thời tiết mùa thu dễ chịu.' }],
    q: [{ q: 'Họ hẹn tập trung lúc mấy giờ Chủ Nhật?', options: ['7:00', '8:00', '8:30', '9:00'], a: 1, exp: 'Long nói: "周日早晨八点校门口集合".' }],
    sp: { hz: '我们大家分工合作，一起去露营！', py: 'Wǒmen dàjiā fēngōng hézuò, yìqǐ qù lùyíng!', vi: 'Chúng ta hãy phân công hợp tác, cùng nhau đi cắm trại!' }
  },
  // 26. Mời bạn đến nhà chơi
  {
    num: 26, top: 3, lvl: 'HSK 2', title: 'Mời bạn đến nhà chơi', hz: '邀请朋友来家做客', py: 'Yāoqǐng péngyou lái jiā zuòkè',
    sit: 'Vương Phương mời Mai cuối tuần đến nhà mình thưởng thức sủi cảo tự tay làm.',
    c: [{ n: 'Vương Phương', r: 'Chủ nhà', g: 'female', a: '👩' }, { n: 'Thanh Mai', r: 'Khách mời', g: 'female', a: '👧' }],
    d: [
      { s: 'Vương Phương', g: 'female', hz: '青梅，这周六有空吗？我想请你来我家做客。', py: 'Qīngméi, zhè zhōuliù yǒu kòng ma? Wǒ xiǎng qǐng nǐ lái wǒ jiā zuòkè.', vi: 'Thanh Mai, thứ Bảy này cậu rảnh không? Mình muốn mời cậu đến nhà mình chơi.' },
      { s: 'Thanh Mai', g: 'female', hz: '太好了！我一直想去参观你的新公寓呢。需要我带点什么吗？', py: 'Tài hǎo le! Wǒ yìzhí xiǎng qù cānguān nǐ de xīn gōngyù ne. Xūyào wǒ dài diǎnr shénme ma?', vi: 'Tuyệt quá! Mình vẫn luôn muốn đến thăm căn hộ mới của cậu. Cần mình mang theo món gì không?' },
      { s: 'Vương Phương', g: 'female', hz: '不用带任何东西，人来就行！我妈妈准备包地道的手工水饺招待你。', py: 'Bú yòng dài rènhé dōngxi, rén lái jiù xíng! Wǒ māma zhǔnbèi bāo dìdào de shǒugōng shuǐjiǎo zhāodài nǐ.', vi: 'Không cần mang thứ gì đâu, người đến là vui rồi! Mẹ mình chuẩn bị gói sủi cảo thủ công chính gốc chiêu đãi cậu.' },
      { s: 'Thanh Mai', g: 'female', hz: '哇，我最爱吃水饺了！那我周六中午准时到！', py: 'Wā, wǒ zuì ài chī shuǐjiǎo le! Nà wǒ zhōuliù zhōngwǔ zhǔnshí dào!', vi: 'Oa, mình thích ăn sủi cảo nhất đấy! Thế trưa thứ Bảy mình sẽ đến đúng giờ nhé!' }
    ],
    v: [{ hz: '做客', py: 'zuòkè', m: 'làm khách, đến chơi nhà', hsk: 'HSK 3' }, { hz: '任何', py: 'rènhé', m: 'bất kỳ', hsk: 'HSK 4' }, { hz: '招待', py: 'zhāodài', m: 'chiêu đãi, tiếp đãi', hsk: 'HSK 4' }, { hz: '准时', py: 'zhǔnshí', m: 'đúng giờ', hsk: 'HSK 3' }],
    g: [{ t: 'Lời mời nhiệt tình: 人来就行 (Rén lái jiù xíng)', s: '不用带东西，人来就行', e: 'Khách sáo bảo bạn bè không cần mang quà cáp.' }],
    q: [{ q: 'Mẹ của Vương Phương chuẩn bị làm món gì để chiêu đãi?', options: ['Vịt quay', 'Sủi cảo thủ công', 'Lẩu Tứ Xuyên', 'Mì xào'], a: 1, exp: 'Vương Phương nói mẹ sẽ 包地道的手工水饺.' }],
    sp: { hz: '欢迎你来我家做客，不用带任何东西。', py: 'Huānyíng nǐ lái wǒ jiā zuòkè, bú yòng dài rènhé dōngxi.', vi: 'Hoan nghênh bạn đến nhà tôi chơi, không cần mang theo đồ gì đâu.' }
  },
  // 27. Tổ chức tiệc sinh nhật
  {
    num: 27, top: 3, lvl: 'HSK 2', title: 'Tổ chức tiệc sinh nhật', hz: '举办生日聚会', py: 'Jǔbàn shēngrì jùhuì',
    sit: 'Tuấn và nhóm bạn bí mật tổ chức sinh nhật bất ngờ cho Lý Hoa tại quán karaoke.',
    c: [{ n: 'Anh Tuấn', r: 'Người tổ chức', g: 'male', a: '👱‍♂️' }, { n: 'Lý Hoa', r: 'Chủ nhân bữa tiệc', g: 'female', a: '👩' }],
    d: [
      { s: 'Anh Tuấn', g: 'male', hz: '李华，祝你二十岁生日快乐！这是大家一起为你挑选的礼物！', py: 'Lǐ Huá, zhù nǐ èrshí suì shēngrì kuàilè! Zhè shì dàjiā yìqǐ wèi nǐ tiāoxuǎn de lǐwù!', vi: 'Lý Hoa, chúc cậu sinh nhật tuổi 20 vui vẻ! Đây là món quà mọi người cùng chọn cho cậu này!' },
      { s: 'Lý Hoa', g: 'female', hz: '天哪！你们太贴心了！我完全没想到你们会准备这个惊喜！', py: 'Tiān na! Nǐmen tài tiēxīn le! Wǒ wánquán méi xiǎngdào nǐmen huì zhǔnbèi zhège jīngxǐ!', vi: 'Trời ơi! Mọi người chu đáo quá! Mình hoàn toàn không ngờ mọi người lại chuẩn bị bất ngờ này!' },
      { s: 'Anh Tuấn', g: 'male', hz: '快闭上眼睛许个愿，然后吹蜡烛、切蛋糕吧！', py: 'Kuài bì shang yǎnjing xǔ gè yuàn, ránhòu chuī làzhú, qiē dàngāo ba!', vi: 'Mau nhắm mắt ước một điều ước, rồi sau đó thổi nến, cắt bánh kem đi nào!' },
      { s: 'Lý Hoa', g: 'female', hz: '希望大家学业有成，友谊长存！谢谢你们给我过了一个难忘的生日！', py: 'Xīwàng dàjiā xuéyè yǒuchéng, yǒuyì chángcún! Xièxie nǐmen gěi wǒ guò le yí gè nánwàng de shēngrì!', vi: 'Cầu mong mọi người học hành thành tài, tình bạn bền lâu! Cảm ơn mọi người đã tổ chức cho mình một sinh nhật khó quên!' }
    ],
    v: [{ hz: '举办', py: 'jǔbàn', m: 'tổ chức', hsk: 'HSK 3' }, { hz: '惊喜', py: 'jīngxǐ', m: 'điều bất ngờ vui mừng', hsk: 'HSK 4' }, { hz: '许愿', py: 'xǔyuàn', m: 'ước nguyện', hsk: 'HSK 4' }, { hz: '吹蜡烛', py: 'chuī làzhú', m: 'thổi nến', hsk: 'HSK 3' }],
    g: [{ t: 'Chúc mừng sinh nhật: 祝你生日快乐', s: '祝你 + [Tuổi] + 岁生日快乐！', e: 'Câu chúc mừng sinh nhật tiêu chuẩn.' }],
    q: [{ q: 'Lý Hoa đã đón sinh nhật bao nhiêu tuổi?', options: ['18 tuổi', '19 tuổi', '20 tuổi', '21 tuổi'], a: 2, exp: 'Tuấn chúc: "祝你二十岁生日快乐".' }],
    sp: { hz: '祝你生日快乐，心想事成！', py: 'Zhù nǐ shēngrì kuàilè, xīnxiǎngshìchéng!', vi: 'Chúc bạn sinh nhật vui vẻ, vạn sự như ý!' }
  },
  // 28. Kể về một kỷ niệm đáng nhớ
  {
    num: 28, top: 3, lvl: 'HSK 2', title: 'Kể về một kỷ niệm đáng nhớ', hz: '回忆难忘的往事', py: 'Huíyì nánwàng de wǎngshì',
    sit: 'Minh và Cường ngồi uống trà ôn lại kỷ niệm leo Vạn Lý Trường Thành dưới mưa.',
    c: [{ n: 'Văn Minh', r: 'Bạn kể', g: 'male', a: '👦' }, { n: 'Trương Cường', r: 'Bạn cùng trải nghiệm', g: 'male', a: '👨' }],
    d: [
      { s: 'Văn Minh', g: 'male', hz: '张强，你还记得去年秋天我们一起爬长城的情景吗？', py: 'Zhāng Qiáng, nǐ hái jìde qùnián qiūtiān wǒmen yìqǐ pá Chángchéng de qíngjǐng ma?', vi: 'Trương Cường, cậu còn nhớ quang cảnh mùa thu năm ngoái hai đứa mình leo Trường Thành không?' },
      { s: 'Trương Cường', g: 'male', hz: '怎么会忘记呢！爬到半山腰突然下起了暴雨，我们全身都湿透了。', py: 'Zěnme huì wàngjì ne! Pá dào bànshānyāo tūrán xià qǐ le bàoyǔ, wǒmen quánshēn dōu shī tòu le.', vi: 'Sao mà quên được chứ! Leo đến lưng chừng núi thì trời bất ngờ đổ mưa rào, người ướt sũng như chuột lột.' },
      { s: 'Văn Minh', g: 'male', hz: '但当我们终于登上最高峰烽火台时，看到了美丽的彩虹！', py: 'Dàn dāng wǒmen zhōngyú dēng shàng zuìgāo fēng fēnghuǒtái shí, kàn dào le měilì de cǎihóng!', vi: 'Nhưng khi chúng mình rốt cuộc leo lên đài phong hỏa đỉnh cao nhất, đã nhìn thấy cầu vồng tuyệt đẹp!' },
      { s: 'Trương Cường', g: 'male', hz: '俗话说“不到长城非好汉”，那次经历虽然辛苦，但真的终生难忘。', py: 'Súhuà shuō “bú dào chángchéng fēi hǎohàn”, nà cì jīnglì suīrán xīnkǔ, dàn zhēn de zhōngshēng nánwàng.', vi: 'Tục ngữ nói "Bất đáo Trường Thành phi hảo hán", trải nghiệm lần đó tuy gian nan nhưng quả thật cả đời khó quên.' }
    ],
    v: [{ hz: '难忘', py: 'nánwàng', m: 'khó quên', hsk: 'HSK 3' }, { hz: '湿透', py: 'shī tòu', m: 'ướt sũng, ướt đẫm', hsk: 'HSK 4' }, { hz: '彩虹', py: 'cǎihóng', m: 'cầu vồng', hsk: 'HSK 4' }, { hz: '不到长城非好汉', py: 'bú dào chángchéng fēi hǎohàn', m: 'Chưa đến Trường Thành chưa phải hảo hán', hsk: 'HSK 5' }],
    g: [{ t: 'Bắt đầu một hành động: 下起了... (Xià qǐ le...)', s: 'Động từ + 起来 (qǐlai)', e: 'Chỉ hành động bắt đầu diễn ra và tiếp diễn: 下起了暴雨.' }],
    q: [{ q: 'Họ đã nhìn thấy điều tuyệt đẹp gì khi lên đến đỉnh đài phong hỏa?', options: ['Mặt trời mọc', 'Cầu vồng', 'Tuyết rơi', 'Sương mù'], a: 1, exp: 'Minh nói: "看到了美丽的彩虹" (thấy cầu vồng tuyệt đẹp).' }],
    sp: { hz: '那次难忘的经历，我永远不会忘记。', py: 'Nà cì nánwàng de jīnglì, wǒ yǒngyuǎn bú huì wàngjì.', vi: 'Trải nghiệm khó quên lần đó tôi sẽ không bao giờ quên.' }
  },
  // 29. Giải quyết hiểu lầm với bạn bè
  {
    num: 29, top: 3, lvl: 'HSK 2', title: 'Giải quyết hiểu lầm với bạn bè', hz: '化解朋友间的误会', py: 'Huàjiě péngyou jiān de wùhuì',
    sit: 'Hải chủ động tìm An để giải thích lý do vắng mặt trong buổi hẹn hôm trước.',
    c: [{ n: 'Quang Hải', r: 'Người giải thích', g: 'male', a: '👦' }, { n: 'Thúy An', r: 'Người giận dỗi', g: 'female', a: '👧' }],
    d: [
      { s: 'Quang Hải', g: 'male', hz: '安安，对不起！昨天我不是故意失约的，你千万别生我的气。', py: 'Ān’an, duìbuqǐ! Zuótiān wǒ bú shì gùyì shīyuē de, nǐ qiānwàn bié shēng wǒ de qì.', vi: 'An An, xin lỗi cậu! Hôm qua mình không hề cố ý lỡ hẹn đâu, cậu ngàn vạn lần đừng giận mình nhé.' },
      { s: 'Thúy An', g: 'female', hz: '我等了你一个小时，打电话你也一直关机，真让人担心又生气！', py: 'Wǒ děng le nǐ yí gè xiǎoshí, dǎ diànhuà nǐ yě yìzhí guānjī, zhēn ràng rén dānxīn yòu shēngqì!', vi: 'Mình đã đợi cậu suốt cả tiếng đồng hồ, gọi điện cậu cũng tắt máy suốt, thật làm người ta vừa lo vừa bực!' },
      { s: 'Quang Hải', g: 'male', hz: '实在对不起！昨天我室友突发高烧晕倒了，我急着送他去医院急诊，手机在路上摔坏了。', py: 'Shízài duìbuqǐ! Zuótiān wǒ shìyǒu tūfā gāoshāo yūndǎo le, wǒ jízhe sòng tā qù yīyuàn jīzhěn, shǒujī zài lùshang shuāi huài le.', vi: 'Thật sự xin lỗi cậu! Hôm qua bạn cùng phòng mình đột ngột sốt cao ngất xỉu, mình vội vã đưa bạn ấy đi cấp cứu, điện thoại rơi hỏng trên đường.' },
      { s: 'Thúy An', g: 'female', hz: '天哪，原来是这样！那你室友现在怎么样了？我也误会你了，不该乱发脾气。', py: 'Tiān na, yuánlái shì zhèyàng! Nà nǐ shìyǒu xiànzài zěnmeyàng le? Wǒ yě wùhuì nǐ le, bù gāi luàn fā píqi.', vi: 'Trời ơi, hóa ra là như thế! Vậy bạn cùng phòng cậu giờ sao rồi? Mình cũng hiểu lầm cậu rồi, không nên nổi nóng lung tung.' }
    ],
    v: [{ hz: '化解', py: 'huàjiě', m: 'hóa giải', hsk: 'HSK 5' }, { hz: '失约', py: 'shīyuē', m: 'lỡ hẹn, thất hẹn', hsk: 'HSK 4' }, { hz: '生病/高烧', py: 'gāoshāo', m: 'sốt cao', hsk: 'HSK 3' }, { hz: '原来', py: 'yuánlái', m: 'hóa ra là', hsk: 'HSK 3' }],
    g: [{ t: 'Hóa ra sự thật: 原来是... (Yuánlái shì...)', s: '原来是 + [Nguyên nhân thực sự]', e: 'Dùng khi phát hiện ra lý do thật sự giải tỏa hiểu lầm.' }],
    q: [{ q: 'Lý do Quang Hải bị lỡ hẹn hôm qua là gì?', options: ['Ngủ quên', 'Đưa bạn cùng phòng đi cấp cứu ở viện', 'Kẹt xe', 'Đi chơi game'], a: 1, exp: 'Hải giải thích bạn cùng phòng sốt cao ngất xỉu phải đưa đi cấp cứu.' }],
    sp: { hz: '我们把误会解释清楚就好了。', py: 'Wǒmen bǎ wùhuì jiěshì qīngchu jiù hǎo le.', vi: 'Chúng mình giải thích rõ ràng hiểu lầm là ổn rồi.' }
  },
  // 30. Nói về các mối quan hệ
  {
    num: 30, top: 3, lvl: 'HSK 2', title: 'Nói về các mối quan hệ', hz: '探讨人际关系', py: 'Tàntǎo rénjì guānxì',
    sit: 'Vương Lực và Trang bàn luận về cách đối nhân xử thế và gìn giữ các mối quan hệ.',
    c: [{ n: 'Vương Lực', r: 'Thanh niên trải nghiệm', g: 'male', a: '👨' }, { n: 'Huyền Trang', r: 'Bạn đối thoại', g: 'female', a: '👩' }],
    d: [
      { s: 'Huyền Trang', g: 'female', hz: '王力，你人缘这么好，平时处理人际关系有什么秘诀吗？', py: 'Wáng Lì, nǐ rényuán zhème hǎo, píngshí chǔlǐ rénjì guānxì yǒu shénme mìjué ma?', vi: 'Vương Lực, quan hệ xã giao của cậu tốt thế, bình thường xử lý các mối quan hệ có bí quyết gì không?' },
      { s: 'Vương Lực', g: 'male', hz: '其实也没什么大秘诀，核心就是“真诚”和“换位思考”。', py: 'Qíshí yě méi shénme dà mìjué, héxīn jiù shì “zhēnchéng” hé “huànwèi sīkǎo”.', vi: 'Thực ra cũng chẳng có bí quyết gì to tát, cốt lõi chính là "chân thành" và "đặt mình vào vị trí người khác suy nghĩ".' },
      { s: 'Huyền Trang', g: 'female', hz: '换位思考确实很重要！很多人往往只站在自己的立场看问题。', py: 'Huànwèi sīkǎo quèshí hěn zhòngyào! Hěn duō rén wǎngwǎng zhǐ zhàn zài zìjǐ de lìchǎng kàn wèntí.', vi: 'Đặt mình vào vị trí người khác đúng là rất quan trọng! Nhiều người thường chỉ đứng trên lập trường bản thân nhìn nhận vấn đề.' },
      { s: 'Vương Lực', g: 'male', hz: '对啊，多一份理解，少一份计较，人与人相处自然就融洽了。', py: 'Duì a, duō yí fèn lǐjiě, shǎo yí fèn jìjiào, rén yǔ rén xiāngchǔ zìrán jiù róngqià le.', vi: 'Đúng thế, thêm một phần thấu hiểu, bớt một phần so đo tính toán, giữa người với người tự nhiên sẽ hòa hợp thôi.' }
    ],
    v: [{ hz: '人缘', py: 'rényuán', m: 'nhân duyên, lòng người yêu mến', hsk: 'HSK 5' }, { hz: '换位思考', py: 'huànwèi sīkǎo', m: 'đặt mình vào vị trí của người khác', hsk: 'HSK 5' }, { hz: '计较', py: 'jìjiào', m: 'so đo, tính toán', hsk: 'HSK 4' }, { hz: '融洽', py: 'róngqià', m: 'hòa thuận, ăn ý', hsk: 'HSK 5' }],
    g: [{ t: 'Cụm từ tâm đắc: 多一份...少一份...', s: '多一份 + Điều tốt, 少一份 + Điều tiêu cực', e: 'Thêm một phần thấu hiểu, bớt một phần so đo.' }],
    q: [{ q: 'Theo Vương Lực, cốt lõi để duy trì mối quan hệ tốt đẹp là gì?', options: ['Tặng quà nhiều', 'Chân thành và đặt mình vào vị trí người khác', 'Nói lời hoa mỹ', 'Im lặng'], a: 1, exp: 'Lực nói cốt lõi là “真诚” và “换位思考”.' }],
    sp: { hz: '真诚待人，多站在对方的角度思考。', py: 'Zhēnchéng dài rén, duō zhàn zài duìfāng de jiǎodù sīkǎo.', vi: 'Chân thành đối đãi với người khác, đặt mình vào góc độ của đối phương để suy nghĩ.' }
  }
];

module.exports = [...raw1to20, ...raw21to50];
