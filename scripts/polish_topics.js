const fs = require('fs');

const topics = JSON.parse(fs.readFileSync('data/topics.json', 'utf8'));

function assignBestIcon(name) {
  const n = name.toLowerCase();
  if (n.includes('trường học') || n.includes('giáo dục')) return '🏫';
  if (n.includes('âm nhạc') || n.includes('nhạc cụ')) return '🎵';
  if (n.includes('kế toán') || n.includes('thuế') || n.includes('tiền tệ')) return '📊';
  if (n.includes('điện') || n.includes('máy bơm')) return '⚡';
  if (n.includes('thương mại') || n.includes('ngoại thương') || n.includes('hợp đồng') || n.includes('kinh doanh')) return '💼';
  if (n.includes('quân sự') || n.includes('quân đội') || n.includes('vũ khí')) return '🎖️';
  if (n.includes('thành ngữ') || n.includes('tục ngữ')) return '📜';
  if (n.includes('giày da') || n.includes('quần áo') || n.includes('may mặc') || n.includes('dệt') || n.includes('vải')) return '👗';
  if (n.includes('máy tính') || n.includes('word') || n.includes('công nghệ') || n.includes('kỹ thuật số')) return '💻';
  if (n.includes('y tế') || n.includes('thuốc') || n.includes('bệnh viện') || n.includes('spa')) return '🏥';
  if (n.includes('bảo hiểm')) return '🛡️';
  if (n.includes('lượng từ') || n.includes('động từ')) return '📚';
  if (n.includes('phim ảnh') || n.includes('điện ảnh') || n.includes('showbiz') || n.includes('video')) return '🎬';
  if (n.includes('nước trên thế giới') || n.includes('quốc gia')) return '🌍';
  if (n.includes('cơ thể người') || n.includes('bộ phận')) return '🫀';
  if (n.includes('trái cây') || n.includes('rau') || n.includes('nấm') || n.includes('gạo') || n.includes('bột')) return '🍎';
  if (n.includes('thịt') || n.includes('gia cầm') || n.includes('hải sản')) return '🥩';
  if (n.includes('bánh kẹo') || n.includes('gia vị') || n.includes('đồ uống') || n.includes('ẩm thực') || n.includes('nhà hàng')) return '🍜';
  if (n.includes('thể thao') || n.includes('bóng') || n.includes('golf') || n.includes('tennis') || n.includes('điền kinh')) return '⚽';
  if (n.includes('khách sạn') || n.includes('dự tiệc') || n.includes('du lịch') || n.includes('picnic')) return '🏨';
  if (n.includes('kiến trúc') || n.includes('xây dựng') || n.includes('vật liệu') || n.includes('nội thất')) return '🏛️';
  if (n.includes('xe') || n.includes('ô tô') || n.includes('phụ tùng') || n.includes('bến xe') || n.includes('giao thông')) return '🚗';
  if (n.includes('máy bay') || n.includes('sân bay') || n.includes('xuất nhập cảnh')) return '✈️';
  if (n.includes('mỹ phẩm') || n.includes('cắt tóc') || n.includes('làm đẹp')) return '💄';
  if (n.includes('gia đình') || n.includes('cưới hỏi') || n.includes('tang lễ') || n.includes('độc thân')) return '👨‍👩‍👧‍👦';
  if (n.includes('tình yêu') || n.includes('ngôn tình')) return '💖';
  if (n.includes('điện thoại') || n.includes('điện tử')) return '📱';
  if (n.includes('văn phòng') || n.includes('nhân sự') || n.includes('phỏng vấn') || n.includes('sơ yếu')) return '📁';
  if (n.includes('luật') || n.includes('tố tụng') || n.includes('tội phạm') || n.includes('chính trị')) return '⚖️';
  if (n.includes('thời tiết') || n.includes('thời gian')) return '🌦️';
  if (n.includes('hoa')) return '🌸';
  if (n.includes('bất động sản') || n.includes('thuê nhà') || n.includes('phòng tắm')) return '🏠';
  if (n.includes('hàn xì') || n.includes('cơ khí') || n.includes('ốc vít') || n.includes('sắt thép') || n.includes('than') || n.includes('khoáng sản') || n.includes('công xưởng')) return '⚙️';
  if (n.includes('họ tên')) return '👤';
  if (n.includes('bưu điện')) return '📮';
  if (n.includes('phòng cháy')) return '🚒';
  if (n.includes('chụp ảnh')) return '📷';
  return '🏷️';
}

topics.forEach(t => {
  // Capitalize first letter of topic name
  let name = t.name.trim();
  name = name.charAt(0).toUpperCase() + name.slice(1);
  t.name = name;
  t.icon = assignBestIcon(name);
});

fs.writeFileSync('data/topics.json', JSON.stringify(topics, null, 2), 'utf8');
console.log('Successfully polished all 125 topic names and icons in data/topics.json');
