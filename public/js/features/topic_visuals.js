// public/js/features/topic_visuals.js
// Hệ Thống Hình Ảnh Minh Họa Chuyên Biệt Cho Từ Vựng Theo Chủ Đề (Thematic Visual Illustration Engine)

(function(window) {
  'use strict';

  // State
  let showVisualImages = localStorage.getItem('thematicVocabShowImages') !== 'false'; // default: true

  // 1. TOPIC COVER BANNERS: 125 Chủ Đề & 6 Super Categories
  const DEFAULT_SUPER_COVERS = {
    all: {
      url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
      titleZh: '主题分类词汇大全',
      titleVi: 'Bách Khoa 125 Chủ Đề Từ Vựng Thực Chiến',
      desc: 'Kho từ vựng 14,605+ từ kèm hình ảnh trực quan, chuẩn hóa phát âm Bắc Kinh và tập viết nét.'
    },
    daily: {
      url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
      titleZh: '日常生活与个人',
      titleVi: 'Đời Sống Hàng Ngày & Cá Nhân',
      desc: 'Gia đình, trường học, ăn uống, trang phục, nhà cửa, sức khỏe và thói quen thường nhật.'
    },
    business: {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      titleZh: '商务金融与贸易',
      titleVi: 'Kinh Doanh, Tài Chính & Thương Mại',
      desc: 'Xuất nhập khẩu, kế toán thuế, hợp đồng, ngân hàng, đàm phán thương vụ và đầu tư quốc tế.'
    },
    industry: {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      titleZh: '工业制造与技术',
      titleVi: 'Công Nghiệp, Kỹ Thuật & Nhà Xưởng',
      desc: 'Cơ khí, điện - điện tử, hàn xì, giày da, may mặc, xây dựng và quản lý sản xuất hiện đại.'
    },
    social: {
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
      titleZh: '社会文化与艺术',
      titleVi: 'Xã Hội, Văn Hóa & Nghệ Thuật',
      desc: 'Lễ hội Trung Hoa, điện ảnh, âm nhạc, du lịch, phong tục tập quán và giao tiếp đời sống.'
    },
    academic: {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      titleZh: '学术自然与科技',
      titleVi: 'Học Thuật, Tự Nhiên & Khoa Học',
      desc: 'Môi trường khí hậu, địa lý quốc gia, công nghệ thông tin, vũ trụ và sinh thái học.'
    }
  };

  // Curated High-Definition Cover Photos for Major Topics
  const TOPIC_COVER_MAP = {
    'tu_vung_chu_de_truong_hoc': {
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
      titleZh: '学校与教育词汇',
      accent: 'from-amber-700 to-amber-900'
    },
    'tu_vung_chu_de_am_nhac': {
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
      titleZh: '音乐与乐器词汇',
      accent: 'from-purple-800 to-indigo-950'
    },
    'tu_vung_chuyen_nganh_ke_toan': {
      url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
      titleZh: '会计与财务专词',
      accent: 'from-emerald-800 to-teal-950'
    },
    'tu_vung_thiet_bi_dien_nghanh_dien': {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      titleZh: '电力与电气设备',
      accent: 'from-amber-600 to-orange-950'
    },
    'thuat_ngu_chuyen_nganh_thuong_mai': {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
      titleZh: '商务与国际贸易',
      accent: 'from-blue-800 to-slate-900'
    },
    'tu_vung_chuyen_nganh_giay_da': {
      url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80',
      titleZh: '皮革与鞋履制造',
      accent: 'from-amber-900 to-stone-900'
    },
    'tu_vung_chu_de_may_tinh': {
      url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
      titleZh: '计算机与互联网',
      accent: 'from-cyan-900 to-blue-950'
    },
    'tu_vung_chuyen_nganh_y_te': {
      url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&q=80',
      titleZh: '医疗卫生与医药',
      accent: 'from-rose-800 to-red-950'
    },
    'tu_vung_chu_de_quan_ao': {
      url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80',
      titleZh: '服装服饰与时尚',
      accent: 'from-pink-800 to-rose-950'
    },
    'tu_vung_chu_de_phim_anh_dien_anh': {
      url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80',
      titleZh: '电影与影视艺术',
      accent: 'from-slate-900 to-amber-950'
    },
    'ten_cac_nuoc_tren_the_gioi': {
      url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80',
      titleZh: '世界各国与地理',
      accent: 'from-teal-800 to-sky-950'
    },
    'tu_vung_cac_bo_phan_co_the_nguoi': {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
      titleZh: '人体器官与生理',
      accent: 'from-rose-700 to-amber-900'
    },
    'tu_vung_cac_loai_trai_cay': {
      url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=80',
      titleZh: '水果与鲜果品类',
      accent: 'from-emerald-700 to-amber-900'
    },
    'tu_vung_chu_de_ngoai_thuong': {
      url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80',
      titleZh: '对外贸易与货运',
      accent: 'from-blue-900 to-slate-950'
    },
    'tu_vung_thuc_pham_pham': {
      url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1000&q=80',
      titleZh: '美食佳肴与食材',
      accent: 'from-amber-800 to-red-950'
    },
    'tu_vung_chu_de_con_vat_dong_vat': {
      url: 'https://images.unsplash.com/photo-1474511320723-9a56873ee67b?auto=format&fit=crop&w=1000&q=80',
      titleZh: '飞禽走兽与动物',
      accent: 'from-emerald-800 to-stone-900'
    },
    'tu_vung_khi_hau_khi_tuong_thuy_van': {
      url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1000&q=80',
      titleZh: '气象气候与天象',
      accent: 'from-sky-700 to-blue-950'
    },
    'tu_vung_vui_choi_giai_tri': {
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
      titleZh: '休闲娱乐与游戏',
      accent: 'from-violet-800 to-purple-950'
    },
    'tu_vung_nha_ga_tau_hoa': {
      url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1000&q=80',
      titleZh: '铁路客运与车站',
      accent: 'from-stone-800 to-blue-950'
    },
    'tu_vung_ve_tet_nguyen_dan': {
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80',
      titleZh: '春节年俗与喜庆',
      accent: 'from-red-800 to-[#8B1E1E]'
    },
    'tu_cung_chu_de_quan_su_quan_doi': {
      url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
      titleZh: '军事国防与武装',
      accent: 'from-stone-800 to-emerald-950'
    },
    'tu_vung_chuyen_nganh_xuat_nhap_khau': {
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
      titleZh: '进出口报关物流',
      accent: 'from-blue-800 to-indigo-950'
    },
    'tu_vung_chuyen_nganh_han_xi': {
      url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
      titleZh: '焊接工艺与机械',
      accent: 'from-orange-700 to-stone-900'
    },
    'tu_vung_chu_de_cac_loai_chim': {
      url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1000&q=80',
      titleZh: '鸟类与飞禽世界',
      accent: 'from-teal-700 to-emerald-950'
    },
    'tu_vung_chu_de_bao_hiem': {
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
      titleZh: '人身财产与保险',
      accent: 'from-blue-800 to-cyan-950'
    }
  };

  // 2. WORD-SPECIFIC ILLUSTRATIVE IMAGES (Kho ảnh đối tượng cụ thể từng từ)
  const CONCRETE_WORD_IMAGES = {
    // Trái cây (Fruits)
    '苹果': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    '香蕉': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    '西瓜': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    '草莓': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    '葡萄': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
    '橘子': 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=600&q=80',
    '菠萝': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
    '芒果': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    '柠檬': 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80',
    '桃子': 'https://images.unsplash.com/photo-1629828874514-c1e5103f2150?auto=format&fit=crop&w=600&q=80',
    '荔枝': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
    '芭蕉': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',

    // Ẩm thực (Food & Drink)
    '米饭': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80',
    '面条': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    '饺子': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80',
    '包子': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    '火锅': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
    '茶': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    '咖啡': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    '牛奶': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    '啤酒': 'https://images.unsplash.com/photo-1608270191963-89a08eb1006e?auto=format&fit=crop&w=600&q=80',
    '牛肉': 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    '鸡肉': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    '鱼': 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',

    // Động vật (Animals)
    '猫': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    '狗': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    '大熊猫': 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=600&q=80',
    '熊猫': 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=600&q=80',
    '鸟': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=600&q=80',
    '马': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    '牛': 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80',
    '羊': 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=600&q=80',
    '猴子': 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=600&q=80',
    '兔子': 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
    '老虎': 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=600&q=80',
    '狮子': 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=600&q=80',
    '大象': 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80',

    // Phương tiện & Giao thông
    '汽车': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    '出租车': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    '公共汽车': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    '自行车': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    '火车': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80',
    '高铁': 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=600&q=80',
    '地铁': 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=600&q=80',
    '飞机': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80',
    '轮船': 'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=600&q=80',

    // Trường học & Thiết bị
    '学校': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    '老师': 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    '学生': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    '书': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    '电脑': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    '手机': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    '笔': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',

    // Y tế & Sức khỏe
    '医院': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    '医生': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    '护士': 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    '药': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',

    // Trang phục & Đồ dùng
    '衣服': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    '衬衫': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
    '裙子': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
    '鞋子': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    '帽子': 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=600&q=80',

    // Thiên nhiên & Thời tiết
    '太阳': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    '月亮': 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80',
    '雨': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=600&q=80',
    '雪': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=600&q=80',
    '花': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
    '树': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80'
  };

  /** Lấy thông tin ảnh minh họa cho một từ vựng bất kỳ */
  function getWordIllustration(item) {
    if (!item) return null;
    const title = (item.title || '').trim();
    const cleanTitle = title.replace(/[^\u4e00-\u9fa5]/g, '');

    // 1. Check exact word match
    if (CONCRETE_WORD_IMAGES[cleanTitle]) {
      return {
        url: CONCRETE_WORD_IMAGES[cleanTitle],
        isSpecific: true,
        caption: `${item.title} (${item.meaning || ''})`
      };
    }

    // 2. Check semantic substring match
    for (const [kw, imgUrl] of Object.entries(CONCRETE_WORD_IMAGES)) {
      if (cleanTitle.includes(kw) || kw.includes(cleanTitle)) {
        return {
          url: imgUrl,
          isSpecific: true,
          caption: `${item.title} - ${item.meaning || ''}`
        };
      }
    }

    // 3. Fallback to Topic Context Illustration
    const topicCover = TOPIC_COVER_MAP[item.topicId];
    if (topicCover && topicCover.url) {
      return {
        url: topicCover.url,
        isSpecific: false,
        caption: topicCover.titleZh || 'Hình ảnh chủ đề'
      };
    }

    // 4. Fallback to Super Category Cover
    let superKey = 'daily';
    if (typeof window.getTopicSuperCategory === 'function') {
      superKey = window.getTopicSuperCategory(item.topicId) || 'daily';
    }
    const superCover = DEFAULT_SUPER_COVERS[superKey] || DEFAULT_SUPER_COVERS.all;

    return {
      url: superCover.url,
      isSpecific: false,
      caption: superCover.titleVi || 'Minh họa chủ đề'
    };
  }

  /** Lấy ảnh bìa chủ đề */
  function getTopicCoverInfo(topicId, superCategory) {
    if (topicId && topicId !== 'all' && TOPIC_COVER_MAP[topicId]) {
      return TOPIC_COVER_MAP[topicId];
    }
    const sKey = superCategory || 'all';
    return DEFAULT_SUPER_COVERS[sKey] || DEFAULT_SUPER_COVERS.all;
  }

  /** Render Topic Hero Banner with Visual Cover */
  function renderTopicHeroBanner() {
    const bannerContainer = document.getElementById('topicHeroBanner');
    if (!bannerContainer) return;

    const topicId = window.currentDictTopic || 'all';
    const superCat = window.currentSuperCategory || 'all';
    const isAll = topicId === 'all';
    const coverInfo = getTopicCoverInfo(topicId, superCat);

    let topicNameVi = 'Tất Cả 125 Chủ Đề';
    let topicNameZh = coverInfo.titleZh || '主题词汇库';
    let topicIcon = '🌟';
    let topicCount = 14605;
    let topicDesc = coverInfo.desc || 'Hệ thống từ vựng phân loại theo chủ đề đời sống, kỹ thuật và thương mại chuẩn quốc tế.';

    if (!isAll && typeof window.getTopicInfo === 'function') {
      const tInfo = window.getTopicInfo(topicId);
      if (tInfo && tInfo.name) {
        topicNameVi = tInfo.fullName || tInfo.name;
        topicIcon = tInfo.icon || '🏷️';
        topicCount = tInfo.count || 300;
        topicDesc = tInfo.desc || `Toàn bộ ${topicCount} từ vựng chuyên sâu về ${topicNameVi}.`;
      }
    }

    bannerContainer.innerHTML = `
      <div class="relative overflow-hidden rounded-3xl bg-stone-900 text-white min-h-[180px] sm:min-h-[220px] flex items-end p-5 sm:p-7 shadow-lg group">
        <!-- Background Image with Gradient Overlay -->
        <img 
          src="${coverInfo.url}" 
          alt="${topicNameVi}" 
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-40 dark:opacity-30"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent"></div>

        <!-- Banner Content -->
        <div class="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="space-y-1.5 max-w-2xl">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-3 py-1 rounded-full text-xs font-black bg-amber-500/90 text-stone-950 shadow-xs flex items-center gap-1.5">
                <span>${topicIcon}</span>
                <span>${isAll ? 'Đại Danh Mục' : 'Chủ Đề Trọng Tâm'}</span>
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-2xs font-bold bg-white/20 backdrop-blur-md text-amber-200 border border-white/20">
                ${topicCount.toLocaleString()} từ vựng có ảnh minh họa
              </span>
            </div>

            <div class="flex items-baseline gap-3 flex-wrap pt-1">
              <h2 class="text-2xl sm:text-3xl font-black font-serif-luxury tracking-tight text-white drop-shadow-sm">
                ${topicNameVi}
              </h2>
              ${topicNameZh ? `<span class="font-hanzi text-lg sm:text-xl font-bold text-amber-300/90">${topicNameZh}</span>` : ''}
            </div>

            <p class="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed drop-shadow-sm">
              ${topicDesc}
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap shrink-0">
            <button 
              onclick="startTopicFlashcards()" 
              class="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md flex items-center gap-2 transition-all cursor-pointer font-sans"
              title="Mở chế độ Flashcard ôn tập kèm hình ảnh">
              <i data-lucide="layers" class="w-4 h-4"></i>
              <span>Luyện Flashcard Hình Ảnh</span>
            </button>
            <button 
              onclick="toggleTopicImages()" 
              class="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Bật hoặc tắt hình ảnh trên các thẻ từ vựng">
              <i data-lucide="image" class="w-4 h-4 text-amber-300"></i>
              <span>${showVisualImages ? 'Tắt ảnh thẻ' : 'Hiện ảnh thẻ'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    if (typeof refreshIcons === 'function') refreshIcons(bannerContainer);
  }

  /** Bật / Tắt hiển thị ảnh minh họa trên các thẻ từ vựng */
  function toggleTopicImages() {
    showVisualImages = !showVisualImages;
    localStorage.setItem('thematicVocabShowImages', showVisualImages);
    
    const label = document.getElementById('topicToggleImagesLabel');
    if (label) {
      label.innerText = showVisualImages ? 'Ảnh: BẬT' : 'Ảnh: TẮT';
    }

    renderTopicHeroBanner();
    if (typeof window.renderTopicDictionary === 'function') {
      window.renderTopicDictionary(true);
    }

    if (typeof showToast === 'function') {
      showToast(showVisualImages ? 'Đã bật chế độ thẻ có ảnh minh họa trực quan 🖼️' : 'Đã chuyển sang chế độ thẻ tinh gọn (text-only)', 'info');
    }
  }

  /** Mở Lightbox xem ảnh minh họa toàn cảnh & phát âm */
  function openVisualLightbox(title, pinyin, meaning, imageUrl, topicName) {
    if (typeof window.openWordModal === 'function') {
      window.openWordModal(title, pinyin, meaning);
      return;
    }
  }

  // Export functions to window
  window.showVisualImages = () => showVisualImages;
  window.getWordIllustration = getWordIllustration;
  window.getTopicCoverInfo = getTopicCoverInfo;
  window.renderTopicHeroBanner = renderTopicHeroBanner;
  window.toggleTopicImages = toggleTopicImages;
  window.openVisualLightbox = openVisualLightbox;

})(window);
