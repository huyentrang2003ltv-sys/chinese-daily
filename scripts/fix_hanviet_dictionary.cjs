const fs = require('fs');
const path = require('path');

const dictPath = path.join(__dirname, '../public/data/dictionary.json');
const hvPath = path.join(__dirname, '../public/data/hanviet_chars.json');

const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
const hv = JSON.parse(fs.readFileSync(hvPath, 'utf8'));

// Additional Sino-Vietnamese character mappings
const extraHv = {
  '拉': 'lạp', '伙': 'hỏa', '惧': 'cụ', '蔼': 'ái', '允': 'duẫn', '藏': 'tàng',
  '躲': 'đóa', '暖': 'noãn', '巨': 'cự', '庞': 'bàng', '席': 'tịch', '焦': 'tiêu',
  '啬': 'sắc', '妩': 'vũ', '媚': 'mị', '脆': 'thúy', '薄': 'bạc', '辽': 'liêu',
  '阔': 'khoát', '袤': 'mậu', '笨': 'bận', '渺': 'miểu', '浩': 'hào', '挚': 'chí',
  '劣': 'liệt', '悟': 'ngộ', '糙': 'thô', '韧': 'nhẫn', '锐': 'nhuệ', '逊': 'tốn',
  '妄': 'vọng', '融': 'dung', '洽': 'hiệp', '阂': 'hạp', '膜': 'mạc', '循': 'tuần',
  '昌': 'xương', '肤': 'phu', '纰': 'phi', '浑': 'hồn', '磅': 'bàng', '礴': 'bác',
  '纤': 'tiêm', '璀': 'thôi', '璨': 'xán', '绚': 'huyễn', '卑': 'ti', '煎': 'tiễn',
  '熬': 'ngao', '惬': 'khiếp', '聆': 'linh', '猜': 'sai', '抵': 'để', '维': 'duy',
  '摧': 'tồi', '卸': 'tá', '挖': 'oa', '矮': 'ải', '厚': 'hậu', '窄': 'trách',
  '甜': 'điềm', '奖': 'tưởng', '懒': 'lãn', '惰': 'đọa', '裂': 'liệt', '赖': 'lại',
  '陌': 'mạch', '肮': 'khang', '萧': 'tiêu', '敞': 'sưởng', '陡': 'đẩu', '峭': 'tiễu',
  '缓': 'hoãn', '敷': 'phu', '衍': 'diễn', '缚': 'phược', '雇': 'cố', '伸': 'thân',
  '葡': 'bồ', '萄': 'đào', '菠': 'ba', '樱': 'anh', '柠': 'ninh', '猕': 'di',
  '胡': 'hồ', '葱': 'thông', '蘑': 'ma', '菇': 'cô', '兰': 'lan', '薯': 'thục',
  '笋': 'chuẩn', '虾': 'hà', '锅': 'oa', '咖': 'gia', '啡': 'phi', '淇': 'kỳ',
  '糕': 'cao', '啤': 'ti', '萨': 'tát', '堡': 'bảo', '爆': 'bạo', '壶': 'hồ',
  '粽': 'tống', '浆': 'tương', '颈': 'cảnh', '豚': 'đồn', '龟': 'quy', '蛙': 'oa',
  '蚂': 'mã', '蚁': 'nghĩ', '鼠': 'thử', '斑': 'ban', '狸': 'ly', '螃': 'bàng',
  '蟹': 'giải', '蝙': 'biên', '蝠': 'bức', '鲨': 'sa', '骆': 'lạc', '鹦': 'anh',
  '蜘': 'tri', '蜗': 'oa', '摩': 'ma', '帆': 'phàm', '缆': 'lãm', '艇': 'đĩnh',
  '锚': 'miêu', '坪': 'bình', '闪': 'thiểm', '滩': 'than', '玫': 'mai', '瑰': 'khôi',
  '掌': 'chưởng', '郁': 'úc', '荷': 'hà', '彗': 'tuệ', '瀑': 'bộc', '橡': 'tượng',
  '袜': 'mạt', '乒': 'binh', '乓': 'bàng', '寺': 'tự', '鞭': 'tiên', '陀': 'đà',
  '螺': 'loa', '龄': 'linh', '滨': 'tân', '贸': 'mậu', '营': 'doanh', '靠': 'kháo',
  '腻': 'nị', '账': 'trướng', '瘾': 'ẩn', '胃': 'vị', '酥': 'tô', '型': 'hình',
  '肩': 'kiên', '膀': 'bàng', '垫': 'điếm', '舰': 'hạm', '储': 'trữ', '线': 'tuyến',
  '塑': 'tát', '舱': 'thương', '峰': 'phong', '堵': 'đổ', '玻': 'pha', '烟': 'yên',
  '愉': 'du', '浴': 'dục', '券': 'khoán', '宵': 'tiêu', '渍': 'tí', '恒': 'hằng',
  '戴': 'đới', '芯': 'tâm', '阅': 'duyệt', '诀': 'quyết', '蕴': 'uẩn', '频': 'tần',
  '跨': 'khóa', '汇': 'hối', '碑': 'bi', '膳': 'thiện', '亚': 'á', '磁': 'từ',
  '蚊': 'văn', '鸣': 'minh', '辜': 'cô', '闸': 'sáp', '睫': 'tiệp', '碳': 'thán',
  '祉': 'chỉ', '归': 'quy', '材': 'tài', '谛': 'đế'
};

// Merge into hv
Object.assign(hv, extraHv);
fs.writeFileSync(hvPath, JSON.stringify(hv, null, 2), 'utf8');
console.log(`Updated hanviet_chars.json with ${Object.keys(extraHv).length} new entries. Total: ${Object.keys(hv).length}`);

function toCapitalized(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

let updatedWordsCount = 0;

dict.forEach(w => {
  // Polish '拉' specifically
  if (w.title === '拉') {
    w.hanviet = 'Lạp / Lôi';
    w.exampleSentence = '门上写着“推”，如果推不开就往外拉。';
    w.examplePinyin = 'Mén shàng xiězhe "tuī", rúguǒ tuī bu kāi jiù wàng wài lā.';
    w.exampleMeaning = 'Trên cửa có ghi chữ "Đẩy", nếu đẩy không ra thì hãy kéo ra ngoài.';
    updatedWordsCount++;
    return;
  }

  if (w.hanviet && w.hanviet.includes('cập nhật')) {
    const chars = [...w.title];
    const resolved = chars.map(c => hv[c] || '').filter(Boolean);
    if (resolved.length === chars.length) {
      w.hanviet = toCapitalized(resolved.join(' '));
      updatedWordsCount++;
    } else {
      // Fallback: try mapping known non-CJK or partial
      const partial = chars.map(c => hv[c] || c).join(' ');
      w.hanviet = toCapitalized(partial.trim());
      updatedWordsCount++;
    }
  }
});

fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log(`Successfully polished dictionary.json! Updated ${updatedWordsCount} words.`);

// Verification
const remaining = dict.filter(w => w.hanviet && w.hanviet.includes('cập nhật'));
console.log(`Remaining 'Đang cập nhật' entries: ${remaining.length}`);
if (remaining.length > 0) {
  console.log('Unresolved samples:', remaining.slice(0, 5));
}
