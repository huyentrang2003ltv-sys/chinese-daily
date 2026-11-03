const fs = require('fs');
const path = require('path');

const dictPath = path.join(__dirname, '../data/dictionary.json');
const rawData = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// Filter out isolated punctuation
const validWords = rawData.filter(w => {
  if (!w.title || w.title === '！' || w.title === '？') return false;
  return true;
});

// Define 14 Rich, Practical, Balanced Topics
const TOPICS = [
  {
    id: 'food',
    name: 'Ẩm Thực & Đồ Ăn',
    nameZh: '饮食美食',
    icon: '🍜',
    desc: 'Món ăn, đồ uống, nhà hàng, trái cây, gia vị, hương vị, bữa ăn',
    keywords: [
      'ăn', 'uống', 'cơm', 'trà', 'bánh', 'rượu', 'nấu', 'món', 'thịt', 'cá', 'rau', 
      'hoa quả', 'táo', 'chuối', 'bát', 'đĩa', 'đũa', 'ngọt', 'chua', 'cay', 'mặn', 
      'đắng', 'nước ngọt', 'bữa ăn', 'nhà hàng', 'nếm', 'đói', 'no', 'cốc', 'ly', 
      'sữa', 'trứng', 'hương vị', 'ẩm thực', 'chè', 'bia', 'hạt', 'mì', 'phở', 
      'canh', 'súp', 'xúc xích', 'dưa', 'thực phẩm', 'đồ ăn', 'đồ uống', 'mùi vị',
      'nấu nướng', 'chiên', 'xào', 'nướng', 'hấp', 'luộc', 'lẩu', 'hải sản', 'tôm',
      'thịt bò', 'thịt gà', 'thịt vịt', 'thịt heo', 'thịt lợn', 'cháo', 'bánh mì', 'cà phê', 'hoa quả'
    ]
  },
  {
    id: 'family',
    name: 'Gia Đình & Xưng Hô',
    nameZh: '家庭亲情',
    icon: '👨‍👩‍👧‍👦',
    desc: 'Bố mẹ, vợ chồng, con cái, họ hàng, hôn nhân, xưng hô thân tộc',
    keywords: [
      'bố', 'ba ruột', 'cha mẹ', 'người mẹ', 'mẹ', 'anh trai', 'chị gái', 'em trai', 'em gái', 
      'ông nội', 'bà nội', 'ông ngoại', 'bà ngoại', 'chú', 'bác', 'cô', 'dì', 'cháu', 
      'vợ', 'chồng', 'kết hôn', 'ly hôn', 'gia đình', 'người thân', 'họ hàng', 'con trai', 
      'con gái', 'con cái', 'vợ chồng', 'bà con', 'thân nhân', 'hôn nhân', 'bố mẹ'
    ]
  },
  {
    id: 'travel',
    name: 'Du Lịch & Khách Sạn',
    nameZh: '旅游住宿',
    icon: '✈️',
    desc: 'Máy bay, sân bay, hành lý, khách sạn, danh lam thắng cảnh, vé tham quan',
    keywords: [
      'du lịch', 'khách sạn', 'máy bay', 'sân bay', 'hành lý', 'hộ chiếu', 'visa', 
      'vé máy bay', 'tham quan', 'đặt phòng', 'phong cảnh', 'danh lam', 'tour', 
      'hướng dẫn viên', 'khám phá', 'chuyến đi', 'chuyến bay', 'hạ cánh', 'cất cánh', 
      'thắng cảnh', 'kỳ nghỉ', 'nghỉ mát', 'vali', 'nhận phòng', 'trả phòng', 'vé vào cổng'
    ]
  },
  {
    id: 'work',
    name: 'Công Sở & Kinh Doanh',
    nameZh: '职场商务',
    icon: '💼',
    desc: 'Công ty, văn phòng, hội họp, phỏng vấn, lương bổng, đàm phán, chức vụ',
    keywords: [
      'công ty', 'văn phòng', 'giám đốc', 'ông chủ', 'nhân viên', 'đồng nghiệp', 
      'hội nghị', 'phỏng vấn', 'tuyển dụng', 'tiền lương', 'hợp đồng', 'kinh doanh', 
      'thương mại', 'thị trường', 'khách hàng', 'dự án', 'nghỉ việc', 'tăng lương', 
      'thăng chức', 'kinh tế', 'doanh nghiệp', 'quản lý', 'đàm phán', 'báo cáo', 
      'nghề nghiệp', 'chức vụ', 'hợp tác', 'đầu tư', 'lợi nhuận', 'kinh phí', 'ngân sách'
    ]
  },
  {
    id: 'education',
    name: 'Giáo Dục & Trường Học',
    nameZh: '教育学术',
    icon: '🎓',
    desc: 'Học tập, thi cử, đại học, sinh viên, giáo viên, sách vở, bài tập, HSK',
    keywords: [
      'trường học', 'học sinh', 'sinh viên', 'thầy giáo', 'cô giáo', 'giáo viên', 
      'bài tập', 'thi cử', 'đại học', 'lớp học', 'sách vở', 'ngữ pháp', 'từ vựng', 
      'nghiên cứu', 'học kỳ', 'tốt nghiệp', 'học phí', 'học bổng', 'thư viện', 
      'khoa học', 'kiến thức', 'giáo trình', 'bài giảng', 'ôn tập', 'điểm thi', 
      'khảo thí', 'giảng đường', 'học giả', 'bằng cấp', 'du học', 'du học sinh'
    ]
  },
  {
    id: 'shopping',
    name: 'Mua Sắm & Thời Trang',
    nameZh: '购物时装',
    icon: '🛍️',
    desc: 'Cửa hàng, siêu thị, giá cả, mặc cả, quần áo, giày dép, túi xách, giảm giá',
    keywords: [
      'mua sắm', 'bán hàng', 'giá cả', 'đắt đỏ', 'rẻ', 'mặc cả', 'quần áo', 'giày dép', 
      'túi xách', 'cửa hàng', 'siêu thị', 'trả tiền', 'thanh toán', 'giảm giá', 'chi tiêu', 
      'hóa đơn', 'chợ', 'tiêu tiền', 'váy', 'áo sơ mi', 'áo khoác', 'quần', 'mũ', 
      'khăn quàng', 'tất', 'trang sức', 'khuyến mãi', 'tiền mặt', 'đổi trả', 'thử đồ', 'kích cỡ'
    ]
  },
  {
    id: 'health',
    name: 'Sức Khỏe & Y Tế',
    nameZh: '医疗健康',
    icon: '🏥',
    desc: 'Bệnh viện, bác sĩ, thuốc men, khám chữa, triệu chứng, thể thao rèn luyện',
    keywords: [
      'bệnh tật', 'bị bệnh', 'đau nhức', 'cơn đau', 'sốt', 'uống thuốc', 'bác sĩ', 
      'y tá', 'bệnh viện', 'khám bệnh', 'chữa bệnh', 'sức khỏe', 'thể thao', 'chạy bộ', 
      'tập thể dục', 'bơi lội', 'viêm', 'cảm cúm', 'nằm viện', 'phẫu thuật', 'y học', 
      'ho khan', 'nhức đầu', 'cơ thể', 'răng hàm', 'tiêm thuốc', 'khỏe mạnh', 'thương tích'
    ]
  },
  {
    id: 'daily',
    name: 'Đời Sống & Nhà Cửa',
    nameZh: '居家生活',
    icon: '🏠',
    desc: 'Nhà ở, đồ gia dụng, phòng ốc, thói quen sinh hoạt thường nhật, thời gian',
    keywords: [
      'nhà ở', 'phòng ngủ', 'phòng khách', 'nhà bếp', 'cửa sổ', 'bàn ghế', 'giường chiếu', 
      'thức dậy', 'đi ngủ', 'tắm rửa', 'giặt giũ', 'quét nhà', 'đồ gia dụng', 'gương soi', 
      'khăn mặt', 'chìa khóa', 'thùng rác', 'chuyển nhà', 'sinh hoạt', 'cuộc sống hàng ngày', 
      'tủ lạnh', 'máy giặt', 'điều hòa', 'ấm đun', 'soong chảo'
    ]
  },
  {
    id: 'traffic',
    name: 'Giao Thông & Đi Lại',
    nameZh: '交通出行',
    icon: '🚗',
    desc: 'Phương tiện giao thông, tàu điện ngầm, xe buýt, taxi, đường sá, chuyển bánh',
    keywords: [
      'ô tô', 'xe đạp', 'xe máy', 'xe buýt', 'tàu hỏa', 'tàu điện ngầm', 'nhà ga', 
      'bến xe', 'đường sá', 'ngã tư', 'đèn giao thông', 'đèn đỏ', 'lái xe', 'kẹt xe', 
      'tắc đường', 'đi bộ', 'qua đường', 'giao thông', 'vé tàu', 'chuyến xe', 
      'tuyến đường', 'bến đỗ', 'vận chuyển', 'lạc đường'
    ]
  },
  {
    id: 'tech',
    name: 'Công Nghệ & Kỹ Thuật Số',
    nameZh: '科技数码',
    icon: '📱',
    desc: 'Điện thoại, máy tính, mạng internet, mạng xã hội, tin nhắn, phần mềm',
    keywords: [
      'điện thoại', 'máy tính', 'internet', 'mạng xã hội', 'tin nhắn', 'gọi điện', 
      'email', 'phần mềm', 'ứng dụng', 'màn hình', 'chụp ảnh', 'máy ảnh', 'sạc pin', 
      'công nghệ', 'điện tử', 'thông tin', 'dữ liệu', 'mật khẩu', 'wifi', 'trang web', 
      'tải về', 'cài đặt', 'trực tuyến', 'online', 'bàn phím', 'chuột máy tính'
    ]
  },
  {
    id: 'weather',
    name: 'Thời Tiết & Thiên Nhiên',
    nameZh: '天气自然',
    icon: '🌦️',
    desc: 'Mưa nắng, nhiệt độ, bốn mùa, phong cảnh tự nhiên, hoa cỏ, động vật',
    keywords: [
      'thời tiết', 'trời mưa', 'nắng gắt', 'gió bão', 'tuyết rơi', 'mây trời', 
      'lạnh giá', 'nóng bức', 'ấm áp', 'mát mẻ', 'mùa xuân', 'mùa hạ', 'mùa thu', 
      'mùa đông', 'nhiệt độ', 'không khí', 'sấm chớp', 'núi non', 'sông ngòi', 
      'biển cả', 'cây cối', 'hoa lá', 'rừng rậm', 'động vật', 'thiên nhiên', 'môi trường'
    ]
  },
  {
    id: 'emotions',
    name: 'Cảm Xúc & Tâm Lý',
    nameZh: '情感心理',
    icon: '💬',
    desc: 'Vui buồn, cảm xúc, tâm trạng, thái độ, kỳ vọng, hy vọng, lo lắng',
    keywords: [
      'vui vẻ', 'buồn bã', 'khóc lóc', 'mỉm cười', 'tức giận', 'sợ hãi', 'lo âu', 
      'thích thú', 'ghét bỏ', 'yêu thương', 'nhung nhớ', 'hy vọng', 'thất vọng', 
      'tự hào', 'hạnh phúc', 'ngạc nhiên', 'bất ngờ', 'hài lòng', 'cảm động', 
      'tâm trạng', 'tình cảm', 'nhiệt tình', 'lo lắng', 'buồn rầu', 'bình tĩnh', 'xúc động'
    ]
  },
  {
    id: 'appearance',
    name: 'Tính Cách & Ngoại Hình',
    nameZh: '外表品格',
    icon: '🎨',
    desc: 'Ngoại hình, vóc dáng, tính cách, phẩm chất đạo đức, phong cách người',
    keywords: [
      'cao lớn', 'thấp bé', 'béo mập', 'gầy gò', 'xinh đẹp', 'xấu xí', 'trẻ trung', 
      'già nua', 'dễ thương', 'thông minh', 'chăm chỉ', 'lười biếng', 'trung thực', 
      'thật thà', 'nghiêm túc', 'tự tin', 'khiêm tốn', 'dũng cảm', 'hiền lành', 
      'vóc dáng', 'tính cách', 'lịch sự', 'kiêu ngạo', 'chu đáo', 'tốt bụng', 'mạnh mẽ'
    ]
  },
  {
    id: 'society',
    name: 'Giao Tiếp & Xã Hội',
    nameZh: '社会文化',
    icon: '🌐',
    desc: 'Giao tiếp hàng ngày, lễ nghi, chào hỏi, từ nối ngữ pháp, thời gian & địa điểm',
    keywords: [
      'xã hội', 'quốc gia', 'thành phố', 'văn hóa', 'phong tục', 'truyền thống', 
      'lễ hội', 'chào hỏi', 'cảm ơn', 'xin lỗi', 'gặp gỡ', 'tạm biệt', 'quan hệ', 
      'thế giới', 'quốc tế', 'phương hướng', 'thời gian', 'địa điểm', 'khái niệm'
    ]
  }
];

// Regex builder to match word boundaries in Vietnamese text
function matchesKeyword(text, kw) {
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match kw preceded and followed by non-alphanumeric or start/end
  const re = new RegExp(`(^|[^a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])${escaped}($|[^a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])`, 'i');
  return re.test(text);
}

function determineTopic(w) {
  const text = `${w.title || ''} ${w.pinyin || ''} ${w.meaning || ''} ${w.pos || ''}`.toLowerCase();
  
  let bestTopic = null;
  let bestScore = 0;

  for (const topic of TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (matchesKeyword(text, kw)) {
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  // Fallback heuristics
  if (!bestTopic || bestScore === 0) {
    const pos = (w.pos || '').toLowerCase();
    const meaning = (w.meaning || '').toLowerCase();
    if (meaning.includes('ăn') || meaning.includes('uống') || meaning.includes('vị')) return TOPICS.find(t => t.id === 'food');
    if (meaning.includes('bố') || meaning.includes('mẹ') || meaning.includes('người')) return TOPICS.find(t => t.id === 'family');
    if (meaning.includes('học') || meaning.includes('sách')) return TOPICS.find(t => t.id === 'education');
    if (meaning.includes('bệnh') || meaning.includes('thuốc')) return TOPICS.find(t => t.id === 'health');
    if (meaning.includes('tiền') || meaning.includes('mua') || meaning.includes('bán')) return TOPICS.find(t => t.id === 'shopping');
    if (meaning.includes('xe') || meaning.includes('đường')) return TOPICS.find(t => t.id === 'traffic');
    if (meaning.includes('mưa') || meaning.includes('nắng') || meaning.includes('trời')) return TOPICS.find(t => t.id === 'weather');
    if (meaning.includes('nhà') || meaning.includes('phòng')) return TOPICS.find(t => t.id === 'daily');
    if (pos.includes('thời gian') || pos.includes('số từ')) return TOPICS.find(t => t.id === 'daily');
    if (pos.includes('tính từ')) return TOPICS.find(t => t.id === 'appearance');
    return TOPICS.find(t => t.id === 'society');
  }

  return bestTopic;
}

// Assign topic to each word
const topicCounts = {};
TOPICS.forEach(t => topicCounts[t.id] = 0);

const enrichedWords = validWords.map(w => {
  const topic = determineTopic(w);
  topicCounts[topic.id]++;
  return {
    ...w,
    topicId: topic.id,
    topicName: topic.name,
    topicZh: topic.nameZh,
    topicIcon: topic.icon
  };
});

console.log('Total enriched words:', enrichedWords.length);
console.log('Topic word counts:');
TOPICS.forEach(t => {
  console.log(`- ${t.icon} ${t.name} (${t.id}): ${topicCounts[t.id]} từ`);
});

// Save updated dictionary
fs.writeFileSync(dictPath, JSON.stringify(enrichedWords, null, 2), 'utf8');

// Also generate a topics summary JSON for frontend
const topicMetaPath = path.join(__dirname, '../data/topics.json');
const topicSummary = TOPICS.map(t => ({
  id: t.id,
  name: t.name,
  nameZh: t.nameZh,
  icon: t.icon,
  desc: t.desc,
  count: topicCounts[t.id]
}));

fs.writeFileSync(topicMetaPath, JSON.stringify(topicSummary, null, 2), 'utf8');
console.log('Saved topics summary to:', topicMetaPath);
