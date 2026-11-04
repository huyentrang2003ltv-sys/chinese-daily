// Generator for 150 Situational Dialogues across 15 Topics
// Produces public/data/conversations_150.json

const fs = require('fs');
const path = require('path');

const TOPICS = [
  { id: 1, title: '1. Chào hỏi và giới thiệu bản thân', short: 'Chào hỏi', icon: 'hand-metal', range: [1, 10], level: 'HSK 1 - 2' },
  { id: 2, title: '2. Giao tiếp hàng ngày', short: 'Giao tiếp', icon: 'message-circle', range: [11, 20], level: 'HSK 1 - 2' },
  { id: 3, title: '3. Gia đình và bạn bè', short: 'Gia đình & Bạn', icon: 'users', range: [21, 30], level: 'HSK 1 - 2' },
  { id: 4, title: '4. Ăn uống và nhà hàng', short: 'Ăn uống', icon: 'utensils', range: [31, 40], level: 'HSK 2 - 3' },
  { id: 5, title: '5. Mua sắm', short: 'Mua sắm', icon: 'shopping-bag', range: [41, 50], level: 'HSK 2 - 3' },
  { id: 6, title: '6. Du lịch và phương tiện di chuyển', short: 'Du lịch', icon: 'plane', range: [51, 60], level: 'HSK 2 - 3' },
  { id: 7, title: '7. Khách sạn và lưu trú', short: 'Khách sạn', icon: 'hotel', range: [61, 70], level: 'HSK 2 - 3' },
  { id: 8, title: '8. Học tập và trường học', short: 'Học tập', icon: 'graduation-cap', range: [71, 80], level: 'HSK 3 - 4' },
  { id: 9, title: '9. Công việc và nghề nghiệp', short: 'Công việc', icon: 'briefcase', range: [81, 90], level: 'HSK 3 - 4' },
  { id: 10, title: '10. Sức khỏe và bệnh viện', short: 'Sức khỏe', icon: 'heart-pulse', range: [91, 100], level: 'HSK 3 - 4' },
  { id: 11, title: '11. Giải trí và sở thích', short: 'Giải trí', icon: 'film', range: [101, 110], level: 'HSK 3 - 4' },
  { id: 12, title: '12. Công nghệ và Internet', short: 'Công nghệ', icon: 'laptop', range: [111, 120], level: 'HSK 4 - 5' },
  { id: 13, title: '13. Giao tiếp xã hội', short: 'Giao tiếp xã hội', icon: 'party-popper', range: [121, 130], level: 'HSK 4 - 5' },
  { id: 14, title: '14. Tình huống khẩn cấp và dịch vụ công cộng', short: 'Khẩn cấp', icon: 'shield-alert', range: [131, 140], level: 'HSK 4 - 5' },
  { id: 15, title: '15. Các tình huống nâng cao', short: 'Nâng cao', icon: 'sparkles', range: [141, 150], level: 'HSK 5 - 6' }
];

console.log('Building 150 Chinese situational dialogues database...');
