// Module state
let currentTopicPillFilter = '';
let dictRendered = 0;
let dictBatch = 24;
let currentDictHsk = 'all';
let currentDictSearch = '';
let currentDictMode = 'hsk'; // 'hsk' or 'topic'
let currentDictTopic = 'all';
let currentTopicSearch = '';
let topicDictRendered = 0;
let topicDictBatch = 24;

// ---------------- TAB 6: KHO TỪ ĐIỂN CHUẨN HSK 1 - HSK 6 ----------------
function filterDictHsk(lvl) {
  currentDictHsk = lvl;

  // Update "All" button
  const allBtn = document.getElementById('btn-dict-hsk-all');
  if (allBtn) {
    allBtn.className = lvl === 'all'
      ? 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm transition-all whitespace-nowrap'
      : 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap';
  }

  // Update HSK 1-6 buttons
  for (let i = 1; i <= 6; i++) {
    const btn = document.getElementById(`btn-dict-hsk-${i}`);
    if (!btn) continue;
    btn.className = lvl === i
      ? 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm transition-all whitespace-nowrap'
      : 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap';
  }

  renderDictionary(true);
}

function onDictSearchInput(val) {
  currentDictSearch = val || '';
  const clearBtn = document.getElementById('dictClearSearchBtn');
  if (clearBtn) {
    if (currentDictSearch.trim()) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }
  renderDictionary(true);
}

function clearDictSearch() {
  const input = document.getElementById('dictSearchInput');
  if (input) input.value = '';
  onDictSearchInput('');
}

function getFilteredDictionaryList() {
  if (!dictionaryData || !Array.isArray(dictionaryData)) return [];
  let list = dictionaryData;
  if (currentDictHsk !== 'all') {
    list = list.filter(item => item.level === currentDictHsk);
  }
  if (currentDictSearch && currentDictSearch.trim()) {
    const rawQ = currentDictSearch.toLowerCase().trim();
    const pyQ = normalizePinyin(currentDictSearch);
    const viQ = normalizeVietnamese(currentDictSearch);

    list = list.filter(item => {
      const title = (item.title || '').toLowerCase();
      const pinyin = (item.pinyin || '').toLowerCase();
      const pinyinNorm = normalizePinyin(item.pinyin);
      const hanviet = (item.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(item.hanviet);
      const meaning = (item.meaning || '').toLowerCase();
      const meaningNorm = normalizeVietnamese(item.meaning);
      const example = (item.exampleSentence || '').toLowerCase();

      return title.includes(rawQ) ||
        (pyQ && pinyinNorm.includes(pyQ)) ||
        pinyin.includes(rawQ) ||
        (viQ && (hanvietNorm.includes(viQ) || meaningNorm.includes(viQ))) ||
        hanviet.includes(rawQ) ||
        meaning.includes(rawQ) ||
        example.includes(rawQ);
    });
  }
  return list;
}

function renderDictionary(reset = false) {
  const container = document.getElementById('dictGridContainer');
  if (!container) return;

  const totalLabel = document.getElementById('dictTotalCountLabel');
  const filteredLabel = document.getElementById('dictFilteredCount');
  const filteredList = getFilteredDictionaryList();

  if (totalLabel) totalLabel.innerText = `${dictionaryData.length.toLocaleString()}`;
  if (filteredLabel) filteredLabel.innerText = `${filteredList.length.toLocaleString()}`;

  if (reset) {
    dictRendered = 0;
    container.innerHTML = '';
  }

  if (filteredList.length === 0) {
    container.innerHTML = `
      <div class="col-span-full glass-card rounded-2xl p-10 text-center text-stone-500 border border-amber-200 bg-white shadow-xs space-y-2">
        <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800">Không tìm thấy từ vựng nào phù hợp.</p>
        <p class="text-xs text-stone-500">Hãy thử nhập từ khóa khác hoặc chọn "Tất Cả Cấp Độ".</p>
      </div>
    `;
    const loadMoreBtn = document.getElementById('loadMoreDictBtn');
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    return;
  }

  const nextBatch = filteredList.slice(dictRendered, dictRendered + dictBatch);

  // Level badge styling map
  const levelBadgeStyles = {
    1: 'bg-amber-100 text-amber-900 border-amber-300',
    2: 'bg-orange-100 text-orange-900 border-orange-300',
    3: 'bg-sky-100 text-sky-900 border-sky-300',
    4: 'bg-rose-100 text-rose-900 border-rose-300',
    5: 'bg-purple-100 text-purple-900 border-purple-300',
    6: 'bg-indigo-100 text-indigo-900 border-indigo-300'
  };

  nextBatch.forEach(item => {
    const card = document.createElement('div');
    const badgeStyle = levelBadgeStyles[item.level] || 'bg-amber-100 text-amber-900 border-amber-200';

    card.className = 'glass-card rounded-2xl p-5 border border-amber-200/80 bg-white flex flex-col justify-between hover:border-[#8B1E1E] transition-all shadow-xs hover:shadow-md';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between text-xs text-stone-500 mb-2.5">
          <span class="px-2.5 py-0.5 rounded-lg text-xs font-bold border ${badgeStyle}">
            HSK ${item.level}
          </span>
          <span class="text-[11px] text-stone-500 font-medium px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
            ${escapeHtml(item.pos || 'từ vựng')}
          </span>
        </div>

        <div class="flex items-center justify-between gap-2">
          <h4 onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" class="font-hanzi text-3xl font-black text-stone-900 tracking-wide cursor-pointer hover:text-[#8B1E1E] transition-colors" title="Nhấn vào chữ để xem và tập viết nét">${escapeHtml(item.title)}</h4>
          <div class="flex items-center gap-1">
            <button onclick="toggleSaveWord(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')}, ${item.level})" title="Lưu vào Sổ tay Flashcard" class="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer">
              <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" title="Tập viết nét chữ này" class="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors cursor-pointer">
              <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
            </button>
            <div class="flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
              <button onclick="playChineseTTS(${jsArg(item.title)}, 'female')" title="Nghe phát âm giọng Nữ (Xiaoxiao)" class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-colors cursor-pointer">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS(${jsArg(item.title)}, 'male')" title="Nghe phát âm giọng Nam (Yunxi)" class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-colors cursor-pointer">
                👨 Nam
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap mt-1.5">
          <p class="text-xs font-bold text-[#8B1E1E] tracking-wide">${escapeHtml(item.pinyin)}</p>
          ${item.hanviet ? `<span class="text-[11px] font-bold text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300/60">[${escapeHtml(item.hanviet)}]</span>` : ''}
        </div>
        <p class="text-xs font-medium text-stone-800 mt-1 leading-snug">${escapeHtml(item.meaning)}</p>
      </div>

      ${item.exampleSentence ? `
        <div class="mt-4 pt-3 border-t border-amber-200/60 text-xs space-y-1 bg-[#FAF7F2]/60 p-2.5 rounded-xl">
          <div class="flex items-start justify-between gap-1.5">
            <p class="font-hanzi text-stone-900 font-bold text-xs leading-relaxed">${escapeHtml(item.exampleSentence)}</p>
            <div class="flex items-center gap-1 shrink-0">
              <button onclick="playChineseTTS(${jsArg(item.exampleSentence.replace(/\n/g, ' '))}, 'female')" class="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nữ">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS(${jsArg(item.exampleSentence.replace(/\n/g, ' '))}, 'male')" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nam">
                👨 Nam
              </button>
            </div>
          </div>
          ${item.examplePinyin ? `<p class="text-[11px] font-bold text-[#8B1E1E]">${escapeHtml(item.examplePinyin)}</p>` : ''}
          ${item.exampleMeaning ? `<p class="text-[11px] text-stone-600 italic leading-snug">${escapeHtml(item.exampleMeaning)}</p>` : ''}
        </div>
      ` : ''}
    `;
    container.appendChild(card);
  });

  dictRendered += nextBatch.length;
  const loadMoreBtn = document.getElementById('loadMoreDictBtn');
  if (loadMoreBtn) {
    if (dictRendered >= filteredList.length) {
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  }

  refreshIcons();
}

function loadMoreDict() {
  renderDictionary(false);
}

// ---------------- TAB 6 (MỤC 2): TỪ VỰNG THEO CHỦ ĐỀ ----------------
let topicMapSource = null;
let topicMap = new Map();
let currentSuperCategory = 'all';
let topicViewMode = localStorage.getItem('thematicVocabViewMode') || 'cards';
let topicSortOrder = 'smart';

/** 5 Super Categories mapping 125 granular topics into logical groups */
const SUPER_CATEGORIES = {
  all: {
    id: 'all',
    name: 'Tất Cả',
    fullName: '🌟 Tất Cả 125 Chủ Đề',
    icon: '🌟',
    badge: '125'
  },
  daily: {
    id: 'daily',
    name: 'Đời Sống & Hằng Ngày',
    fullName: '🏠 Đời Sống & Hằng Ngày',
    icon: '🏠',
    badge: '38',
    keywords: ['gia_dinh', 'mon_an', 'nau_an', 'thuc_pham', 'rau_cu', 'trai_cay', 'thit', 'gia_vi', 'hai_san', 'nam', 'gao', 'bot', 'do_uong', 'quan_ao', 'cat_toc', 'cuoi_hoi', 'tang_le', 'giang_sinh', 'tet_nguyen_dan', 'phong_tam', 'thue_nha', 'doc_than', 'mua_ban_hang_online', 'con_vat', 'chim', 'hoa', 'mau_sac', 'noi_that', 'banh_keo', 'dien_thoai', 'tinh_cach', 'tinh_yeu', 'gia_cam', 'picnic', 'hoi_thoai_tieng_hoa_hang_ngay']
  },
  business: {
    id: 'business',
    name: 'Kinh Doanh & Công Sở',
    fullName: '💼 Kinh Doanh & Công Sở',
    icon: '💼',
    badge: '19',
    keywords: ['ke_toan', 'thuong_mai', 'ngoai_thuong', 'xuat_nhap_khau', 'kinh_te', 'tien_te', 'nhan_su', 'quang_cao', 'phong_van', 'hop_dong', 'so_yeu', 'buu_dien', 'van_phong', 'word_excel', 'thuong_hieu', 'bat_dong_san', 'thue_va_hai_quan', 'bo_phan_chuc_vu', 'bao_hiem']
  },
  industry: {
    id: 'industry',
    name: 'Kỹ Thuật & Sản Xuất',
    fullName: '⚙️ Kỹ Thuật & Sản Xuất',
    icon: '⚙️',
    badge: '24',
    keywords: ['co_khi', 'han_xi', 'thiet_bi_dien', 'dien_tu', 'sat_thep', 'oc_vit', 'vat_lieu_xay_dung', 'kien_truc', 'o_to', 'xe_may', 'det_soi', 'giay_da', 'nhua_cao_su', 'khai_thac', 'loai_than', 'cong_xuong', 'dau_mo', 'go', 'may_mac', 'cat_may', 'cac_nganh_cong_nghiep', 'dien_nuoc', 'may_tinh', 'video_cassette']
  },
  social: {
    id: 'social',
    name: 'Y Tế, Du Lịch & Xã Hội',
    fullName: '🏥 Y Tế, Du Lịch & Xã Hội',
    icon: '🏥',
    badge: '31',
    keywords: ['y_te', 'om_dau', 'co_the_nguoi', 'du_lich', 'nha_hang_khach_san', 'may_bay_san_bay', 'nha_ga_tau_hoa', 'ben_xe', 'xuat_nhap_canh', 'giao_thong', 'thoi_gian_va_thoi_tiet', 'khi_hau', 'moi_truong', 'the_thao', 'bong_da', 'bong_ro', 'bong_chuyen', 'bong_chay', 'tennis', 'golf', 'the_thao_duoi_nuoc', 'mon_dien', 'spa', 'my_pham', 'showbiz', 'phim_anh', 'phim_co_trang', 'am_nhac', 'chup_anh', 'vui_choi', 'du_tiec', 'phong_chay', 'nuoc_tren_the_gioi']
  },
  academic: {
    id: 'academic',
    name: 'Học Thuật & Ngôn Ngữ',
    fullName: '🎓 Học Thuật & Ngôn Ngữ',
    icon: '🎓',
    badge: '13',
    keywords: ['truong_hoc', 'separable_verbs', 'measure_words', 'thanh_ngu', 'ho_ten', 'tu_ngoai_lai', 'to_chuc_chinh_tri', 'luat', 'to_tung', 'toi_pham', 'quan_su', 'cong_viec_nghe_nghiep']
  }
};

/** Categorize topic by keyword matching */
function getTopicSuperCategory(topicId) {
  if (!topicId) return 'academic';
  const id = topicId.toLowerCase();
  for (const [key, cat] of Object.entries(SUPER_CATEGORIES)) {
    if (key === 'all') continue;
    if (cat.keywords && cat.keywords.some(kw => id.includes(kw))) {
      return key;
    }
  }
  return 'academic';
}

/** Topic lookup by id */
function getTopicInfo(topicId, strict = false) {
  if (topicMapSource !== topicsData) {
    topicMap = new Map((topicsData || []).map(t => [t.id, t]));
    topicMapSource = topicsData;
  }
  return topicMap.get(topicId) || (strict ? null : {});
}

async function ensureTopicData() {
  if (isDataLoaded(['topics', 'thematicVocab'])) return true;
  const container = document.getElementById('topicGridContainer');
  const tableBody = document.getElementById('topicTableBody');
  if (container) {
    container.innerHTML = '<div class="col-span-full text-center text-stone-500 text-sm py-10">Đang tải kho từ vựng theo chủ đề...</div>';
  }
  if (tableBody) {
    tableBody.innerHTML = '<tr><td colspan="9" class="text-center text-stone-500 py-10">Đang tải dữ liệu...</td></tr>';
  }
  try {
    await loadDatasets(['topics', 'thematicVocab']);
    return true;
  } catch (err) {
    console.error('Không tải được dữ liệu chủ đề:', err);
    if (container) {
      container.innerHTML = '<div class="col-span-full text-center text-rose-600 text-sm py-10">Không tải được dữ liệu. Vui lòng thử lại.</div>';
    }
    showToast('Không tải được từ vựng theo chủ đề.', 'error');
    return false;
  }
}

async function switchDictMode(mode) {
  currentDictMode = mode;
  const hskSection = document.getElementById('dictSectionHsk');
  const topicSection = document.getElementById('dictSectionTopic');
  const hskBtn = document.getElementById('btn-dict-mode-hsk');
  const topicBtn = document.getElementById('btn-dict-mode-topic');

  if (mode === 'hsk') {
    if (hskSection) hskSection.classList.remove('hidden');
    if (topicSection) topicSection.classList.add('hidden');
    if (hskBtn) {
      hskBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-md cursor-pointer border border-[#8B1E1E]';
    }
    if (topicBtn) {
      topicBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 transition-all cursor-pointer';
    }
    if (dictRendered === 0) {
      renderDictionary(true);
    }
  } else {
    if (hskSection) hskSection.classList.add('hidden');
    if (topicSection) topicSection.classList.remove('hidden');
    if (topicBtn) {
      topicBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-100 shadow-md cursor-pointer border border-amber-800';
    }
    if (hskBtn) {
      hskBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 transition-all cursor-pointer';
    }
    if (!(await ensureTopicData())) return;
    if (currentDictMode !== 'topic') return;
    renderTopicSuperCategories();
    renderTopicPills();
    updateViewModeButtons();
    if (topicDictRendered === 0) {
      renderTopicDictionary(true);
    }
  }
  refreshIcons();
}

/** 1. Render Super Categories Row */
function renderTopicSuperCategories() {
  const container = document.getElementById('topicSuperCategoriesContainer');
  if (!container) return;

  const topicsList = topicsData || [];
  const superKeys = ['all', 'daily', 'business', 'industry', 'social', 'academic'];

  let html = '';
  superKeys.forEach(key => {
    const cat = SUPER_CATEGORIES[key];
    const isSelected = currentSuperCategory === key;
    let count = 0;
    if (key === 'all') {
      count = topicsList.length;
    } else {
      count = topicsList.filter(t => getTopicSuperCategory(t.id) === key).length;
    }

    html += `
      <button 
        onclick="filterSuperCategory('${key}')" 
        id="btn-super-cat-${key}"
        class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${isSelected ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-amber-100 border-[#8B1E1E] shadow-sm' : 'bg-white/80 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-amber-200/60 dark:border-stone-700'}">
        <div class="flex items-center gap-1.5">
          <span class="text-base">${cat.icon}</span>
          <span class="truncate max-w-[100px] sm:max-w-none text-center font-bold">${cat.name}</span>
        </div>
        <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-amber-100/20 text-amber-100' : 'bg-amber-100/70 dark:bg-stone-700 text-amber-900 dark:text-stone-300 font-semibold'}">${count} chủ đề</span>
      </button>
    `;
  });

  container.innerHTML = html;

  const label = document.getElementById('activeSuperCategoryLabel');
  if (label) {
    const active = SUPER_CATEGORIES[currentSuperCategory] || SUPER_CATEGORIES.all;
    label.innerText = active.fullName;
  }
}

/** Filter by Super Category */
function filterSuperCategory(catKey) {
  currentSuperCategory = catKey;
  currentDictTopic = 'all'; // reset granular topic selection
  currentTopicPillFilter = '';
  
  const pillInput = document.getElementById('topicPillSearchInput');
  if (pillInput) pillInput.value = '';

  renderTopicSuperCategories();
  renderTopicPills();
  renderTopicDictionary(true);
}

/** 2. Render Granular Topic Pills under the active Super Category */
function renderTopicPills() {
  const container = document.getElementById('topicFilterPills');
  if (!container) return;

  const sourceVocab = thematicVocabData;
  const totalWords = sourceVocab.length;
  let topicsList = topicsData || [];

  // Filter topics by active Super Category
  if (currentSuperCategory !== 'all') {
    topicsList = topicsList.filter(t => getTopicSuperCategory(t.id) === currentSuperCategory);
  }
  
  // Filter topics by pill search query
  let filteredTopics = topicsList;
  if (currentTopicPillFilter && currentTopicPillFilter.trim()) {
    const q = normalizeVietnamese(currentTopicPillFilter);
    filteredTopics = topicsList.filter(t => {
      const nameNorm = normalizeVietnamese(t.name);
      const fullNorm = normalizeVietnamese(t.fullName || '');
      return nameNorm.includes(q) || fullNorm.includes(q);
    });
  }

  const badgeEl = document.getElementById('topicPillCountBadge');
  if (badgeEl) {
    badgeEl.innerText = `${filteredTopics.length} / ${topicsList.length} chủ đề`;
  }

  const isAllSelected = currentDictTopic === 'all';
  const superCatName = SUPER_CATEGORIES[currentSuperCategory]?.name || 'Tất Cả';

  let html = `
    <button onclick="filterDictTopic('all')" id="btn-topic-all" class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${isAllSelected ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-50 shadow-sm border border-amber-800' : 'bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'}" title="Xem toàn bộ từ vựng ${superCatName}">
      <span>🌟 Tất Cả ${topicsList.length} Chủ Đề ${currentSuperCategory !== 'all' ? '(' + superCatName + ')' : ''}</span>
      <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isAllSelected ? 'bg-white/20 text-white' : 'bg-amber-100/70 dark:bg-stone-700 text-amber-900 dark:text-stone-300 font-semibold'}">${currentSuperCategory === 'all' ? totalWords.toLocaleString() : sourceVocab.filter(w => getTopicSuperCategory(w.topicId) === currentSuperCategory).length.toLocaleString()}</span>
    </button>
  `;

  filteredTopics.forEach(t => {
    const isSelected = currentDictTopic === t.id;
    const count = t.count || sourceVocab.filter(w => w.topicId === t.id).length;
    html += `
      <button onclick="filterDictTopic(${jsArg(t.id)})" id="btn-topic-${escapeHtml(t.id)}" class="px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${isSelected ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-[#8B1E1E]' : 'bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'}" title="${escapeHtml(t.fullName || t.name)}">
        <span>${escapeHtml(t.icon || '🏷️')}</span>
        <span>${escapeHtml(t.name)}</span>
        <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-semibold'}">${count}</span>
      </button>
    `;
  });

  container.innerHTML = html;
}

function filterTopicPills(query) {
  currentTopicPillFilter = query || '';
  renderTopicPills();
}

function filterDictTopic(topicId) {
  currentDictTopic = topicId;
  renderTopicPills();
  renderTopicDictionary(true);
}

function onTopicSearchInput(val) {
  currentTopicSearch = val || '';
  const clearBtn = document.getElementById('topicClearSearchBtn');
  if (clearBtn) {
    if (currentTopicSearch.trim()) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }
  renderTopicDictionary(true);
}

function clearTopicSearch() {
  const input = document.getElementById('topicSearchInput');
  if (input) input.value = '';
  onTopicSearchInput('');
}

/** Switch View Mode: 'cards' or 'table' */
function setTopicViewMode(mode) {
  topicViewMode = mode;
  localStorage.setItem('thematicVocabViewMode', mode);
  updateViewModeButtons();
  renderTopicDictionary(true);
}

function updateViewModeButtons() {
  const btnCards = document.getElementById('btn-topic-view-cards');
  const btnTable = document.getElementById('btn-topic-view-table');
  if (btnCards && btnTable) {
    if (topicViewMode === 'cards') {
      btnCards.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white dark:bg-stone-700 text-amber-900 dark:text-amber-200 shadow-2xs';
      btnTable.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-stone-600 dark:text-stone-400 hover:text-stone-900';
    } else {
      btnTable.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white dark:bg-stone-700 text-amber-900 dark:text-amber-200 shadow-2xs';
      btnCards.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-stone-600 dark:text-stone-400 hover:text-stone-900';
    }
  }
}

/** Change Sort Order */
function changeTopicSort(order) {
  topicSortOrder = order || 'smart';
  renderTopicDictionary(true);
}

/** Filter and Sort the Thematic Vocabulary List */
function getFilteredTopicDictionaryList() {
  const source = thematicVocabData;
  if (!source || !Array.isArray(source)) return [];
  let list = source;

  // 1. Filter by specific topic or super category
  if (currentDictTopic !== 'all') {
    list = list.filter(item => item.topicId === currentDictTopic);
  } else if (currentSuperCategory !== 'all') {
    list = list.filter(item => getTopicSuperCategory(item.topicId) === currentSuperCategory);
  }

  // 2. Search query filter
  if (currentTopicSearch && currentTopicSearch.trim()) {
    const rawQ = currentTopicSearch.toLowerCase().trim();
    const pyQ = normalizePinyin(currentTopicSearch);
    const viQ = normalizeVietnamese(currentTopicSearch);

    list = list.filter(item => {
      const title = (item.title || '').toLowerCase();
      const pinyin = (item.pinyin || '').toLowerCase();
      const pinyinNorm = normalizePinyin(item.pinyin);
      const hanviet = (item.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(item.hanviet);
      const meaning = (item.meaning || '').toLowerCase();
      const meaningNorm = normalizeVietnamese(item.meaning);
      const topicName = (getTopicInfo(item.topicId).name || '').toLowerCase();
      const example = (item.exampleSentence || '').toLowerCase();

      return title.includes(rawQ) ||
        (pyQ && pinyinNorm.includes(pyQ)) ||
        pinyin.includes(rawQ) ||
        (viQ && (hanvietNorm.includes(viQ) || meaningNorm.includes(viQ))) ||
        hanviet.includes(rawQ) ||
        meaning.includes(rawQ) ||
        topicName.includes(rawQ) ||
        example.includes(rawQ);
    });
  }

  // 3. Sorting logic
  const categoryPriority = { daily: 1, social: 2, business: 3, academic: 4, industry: 5 };
  list = [...list].sort((a, b) => {
    if (topicSortOrder === 'smart') {
      const pA = categoryPriority[getTopicSuperCategory(a.topicId)] || 99;
      const pB = categoryPriority[getTopicSuperCategory(b.topicId)] || 99;
      if (pA !== pB) return pA - pB;
      const lA = a.level || 1;
      const lB = b.level || 1;
      if (lA !== lB) return lA - lB;
      return (a.title || '').length - (b.title || '').length;
    } else if (topicSortOrder === 'hsk-asc') {
      return (a.level || 1) - (b.level || 1);
    } else if (topicSortOrder === 'hsk-desc') {
      return (b.level || 1) - (a.level || 1);
    } else if (topicSortOrder === 'alpha') {
      return (a.pinyin || '').localeCompare(b.pinyin || '');
    }
    return 0;
  });

  return list;
}

/** Render Topic Dictionary (supports both Cards & Table views) */
function renderTopicDictionary(reset = false) {
  const gridContainer = document.getElementById('topicGridContainer');
  const tableContainer = document.getElementById('topicTableContainer');
  const tableBody = document.getElementById('topicTableBody');
  if (!gridContainer || !tableContainer || !tableBody) return;

  const source = thematicVocabData;
  const totalLabel = document.getElementById('topicTotalCountLabel');
  const filteredLabel = document.getElementById('topicFilteredCount');
  const filteredList = getFilteredTopicDictionaryList();

  if (totalLabel) totalLabel.innerText = `${source.length.toLocaleString()}`;
  if (filteredLabel) filteredLabel.innerText = `${filteredList.length.toLocaleString()}`;

  if (reset) {
    topicDictRendered = 0;
    gridContainer.innerHTML = '';
    tableBody.innerHTML = '';
  }

  // Toggle view containers
  if (topicViewMode === 'cards') {
    gridContainer.classList.remove('hidden');
    tableContainer.classList.add('hidden');
  } else {
    gridContainer.classList.add('hidden');
    tableContainer.classList.remove('hidden');
  }

  // Empty state handling
  if (filteredList.length === 0) {
    const emptyHtml = `
      <div class="col-span-full glass-card rounded-2xl p-10 text-center text-stone-500 border border-amber-200/80 bg-white dark:bg-stone-900 shadow-xs space-y-2">
        <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800 dark:text-stone-200">Không tìm thấy từ vựng nào trong chủ đề này.</p>
        <p class="text-xs text-stone-500">Hãy thử nhập từ khóa khác hoặc bấm chọn "🌟 Tất Cả Chủ Đề".</p>
      </div>
    `;
    gridContainer.innerHTML = emptyHtml;
    tableBody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-stone-500">Không tìm thấy từ vựng nào phù hợp.</td></tr>`;
    const loadMoreBtn = document.getElementById('loadMoreTopicBtn');
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    return;
  }

  const nextBatch = filteredList.slice(topicDictRendered, topicDictRendered + topicDictBatch);

  // Level badge styling map
  const levelBadgeStyles = {
    1: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-300',
    2: 'bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-300 border-teal-300',
    3: 'bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300 border-sky-300',
    4: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 border-indigo-300',
    5: 'bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border-purple-300',
    6: 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border-rose-300'
  };

  if (topicViewMode === 'cards') {
    // ---------------- CARD VIEW RENDERING ----------------
    nextBatch.forEach(item => {
      const card = document.createElement('div');
      const badgeStyle = levelBadgeStyles[item.level] || 'bg-amber-100 text-amber-900 border-amber-200';
      const topic = getTopicInfo(item.topicId);

      card.className = 'glass-card rounded-2xl p-5 border border-amber-200/80 dark:border-stone-700 bg-white dark:bg-[#161B22] flex flex-col justify-between hover:border-amber-500 dark:hover:border-amber-600 transition-all shadow-xs hover:shadow-md';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between text-xs text-stone-500 mb-2.5 gap-1.5 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-stone-800 text-amber-950 dark:text-amber-300 border border-amber-200 dark:border-stone-700 flex items-center gap-1">
                <span>${escapeHtml(topic.icon || '🏷️')}</span>
                <span>${escapeHtml(topic.name || 'Chủ đề')}</span>
              </span>
              <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold border ${badgeStyle}">
                HSK ${item.level || 1}
              </span>
            </div>
            <span class="text-[11px] text-stone-500 dark:text-stone-400 font-medium px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              ${escapeHtml(item.pos || 'từ vựng')}
            </span>
          </div>

          <div class="flex items-center justify-between gap-2">
            <h4 onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" class="font-hanzi text-3xl font-black text-stone-900 dark:text-stone-100 tracking-wide cursor-pointer hover:text-[#8B1E1E] transition-colors" title="Nhấn vào chữ để xem và tập viết nét">${escapeHtml(item.title)}</h4>
            <div class="flex items-center gap-1">
              <button onclick="toggleSaveWord(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')}, ${item.level})" title="Lưu vào Sổ tay Flashcard" class="p-2 rounded-xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-stone-700 transition-colors cursor-pointer">
                <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" title="Tập viết nét chữ này" class="p-2 rounded-xl bg-rose-50 dark:bg-stone-800 hover:bg-rose-100 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-stone-700 transition-colors cursor-pointer">
                <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
              </button>
              <div class="flex items-center gap-0.5 bg-stone-100/90 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs">
                <button onclick="playChineseTTS(${jsArg(item.title)}, 'female')" title="Nghe phát âm giọng Nữ (Xiaoxiao)" class="px-2 py-1 rounded-lg bg-white dark:bg-stone-700 hover:bg-rose-50 text-rose-850 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold transition-colors cursor-pointer">
                  👩 Nữ
                </button>
                <button onclick="playChineseTTS(${jsArg(item.title)}, 'male')" title="Nghe phát âm giọng Nam (Yunxi)" class="px-2 py-1 rounded-lg bg-white dark:bg-stone-700 hover:bg-blue-50 text-blue-850 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-bold transition-colors cursor-pointer">
                  👨 Nam
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap mt-1.5">
            <p class="text-sm font-bold text-amber-900 dark:text-amber-300 tracking-wide font-mono">${escapeHtml(item.pinyin)}</p>
            ${item.hanviet ? `<span class="text-[11px] font-bold text-amber-950 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-700">[${escapeHtml(item.hanviet)}]</span>` : ''}
          </div>

          <p class="text-sm font-semibold text-stone-800 dark:text-stone-200 mt-2 leading-relaxed">${escapeHtml(item.meaning)}</p>
        </div>

        ${item.exampleSentence ? `
          <div class="mt-4 pt-3 border-t border-amber-200/60 dark:border-stone-700 text-xs space-y-1 bg-[#FAF7F2]/80 dark:bg-stone-900/60 p-3 rounded-xl border border-amber-100/60 dark:border-stone-800">
            <div class="flex items-start justify-between gap-1.5">
              <p class="font-hanzi text-stone-900 dark:text-stone-100 font-bold text-sm leading-relaxed">${escapeHtml(item.exampleSentence)}</p>
              <div class="flex items-center gap-1 shrink-0">
                <button onclick="playChineseTTS(${jsArg(item.exampleSentence.replace(/\n/g, ' '))}, 'female')" class="px-1.5 py-0.5 rounded bg-white dark:bg-stone-700 hover:bg-rose-50 text-rose-850 dark:text-rose-300 border border-rose-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nữ">
                  👩
                </button>
                <button onclick="playChineseTTS(${jsArg(item.exampleSentence.replace(/\n/g, ' '))}, 'male')" class="px-1.5 py-0.5 rounded bg-white dark:bg-stone-700 hover:bg-blue-50 text-blue-850 dark:text-blue-300 border border-blue-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nam">
                  👨
                </button>
              </div>
            </div>
            ${item.examplePinyin ? `<p class="text-xs font-bold text-amber-900 dark:text-amber-300 font-mono">${escapeHtml(item.examplePinyin)}</p>` : ''}
            ${item.exampleMeaning ? `<p class="text-xs text-stone-600 dark:text-stone-400 italic leading-snug">${escapeHtml(item.exampleMeaning)}</p>` : ''}
          </div>
        ` : ''}
      `;
      gridContainer.appendChild(card);
    });
  } else {
    // ---------------- TABLE VIEW RENDERING ----------------
    nextBatch.forEach((item, idx) => {
      const row = document.createElement('tr');
      const globalIdx = topicDictRendered + idx + 1;
      const badgeStyle = levelBadgeStyles[item.level] || 'bg-amber-100 text-amber-900 border-amber-200';
      const topic = getTopicInfo(item.topicId);

      row.className = 'hover:bg-amber-50/70 dark:hover:bg-stone-800/60 transition-colors';
      row.innerHTML = `
        <td class="py-3 px-3 sm:px-4 text-center text-xs font-mono text-stone-400">${globalIdx}</td>
        <td class="py-3 px-3 sm:px-4 whitespace-nowrap">
          <span onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" class="font-hanzi text-2xl font-black text-stone-900 dark:text-stone-100 hover:text-[#8B1E1E] cursor-pointer transition-colors" title="Bấm để tập viết nét">${escapeHtml(item.title)}</span>
        </td>
        <td class="py-3 px-3 sm:px-4 whitespace-nowrap font-mono font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm">${escapeHtml(item.pinyin)}</td>
        <td class="py-3 px-3 sm:px-4 whitespace-nowrap">
          ${item.hanviet ? `<span class="text-xs font-semibold text-amber-950 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-300/60 dark:border-amber-700">[${escapeHtml(item.hanviet)}]</span>` : '<span class="text-stone-400">—</span>'}
        </td>
        <td class="py-3 px-3 sm:px-4 min-w-[200px]">
          <div class="font-semibold text-stone-800 dark:text-stone-200 leading-snug">${escapeHtml(item.meaning)}</div>
          ${item.exampleSentence ? `<div class="text-[11px] text-stone-500 italic mt-0.5 line-clamp-1" title="${escapeHtml(item.exampleSentence)}">${escapeHtml(item.exampleSentence)}</div>` : ''}
        </td>
        <td class="py-3 px-3 sm:px-4 text-center hidden md:table-cell whitespace-nowrap">
          <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-950 dark:text-amber-200 bg-amber-50 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-amber-200 dark:border-stone-700">
            <span>${escapeHtml(topic.icon || '🏷️')}</span>
            <span>${escapeHtml(topic.name || 'Chủ đề')}</span>
          </span>
        </td>
        <td class="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
          <span class="px-2 py-0.5 rounded text-[11px] font-bold border ${badgeStyle}">HSK ${item.level || 1}</span>
        </td>
        <td class="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
          <div class="inline-flex items-center gap-1">
            <button onclick="playChineseTTS(${jsArg(item.title)}, 'female')" title="Phát âm Nữ" class="px-2 py-1 rounded-lg bg-white dark:bg-stone-700 hover:bg-rose-50 text-rose-850 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold transition-colors cursor-pointer">
              👩
            </button>
            <button onclick="playChineseTTS(${jsArg(item.title)}, 'male')" title="Phát âm Nam" class="px-2 py-1 rounded-lg bg-white dark:bg-stone-700 hover:bg-blue-50 text-blue-850 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-bold transition-colors cursor-pointer">
              👨
            </button>
          </div>
        </td>
        <td class="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
          <div class="inline-flex items-center gap-1">
            <button onclick="toggleSaveWord(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')}, ${item.level})" title="Lưu vào Sổ tay" class="p-1.5 rounded-lg bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-stone-700 cursor-pointer">
              <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" title="Tập viết chữ" class="p-1.5 rounded-lg bg-rose-50 dark:bg-stone-800 hover:bg-rose-100 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-stone-700 cursor-pointer">
              <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  topicDictRendered += nextBatch.length;
  const loadMoreBtn = document.getElementById('loadMoreTopicBtn');
  if (loadMoreBtn) {
    if (topicDictRendered >= filteredList.length) {
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  }

  refreshIcons();
}

function loadMoreTopicDict() {
  renderTopicDictionary(false);
}

/** 3. Quick Action: Start Spaced Repetition Flashcard Session for this Topic */
async function startTopicFlashcards() {
  const list = getFilteredTopicDictionaryList();
  if (!list || list.length === 0) {
    showToast('Chưa có từ vựng nào trong chủ đề này để luyện.', 'info');
    return;
  }
  const maxWords = 30;
  const sample = shuffle(list).slice(0, maxWords);
  const topicName = currentDictTopic === 'all'
    ? (SUPER_CATEGORIES[currentSuperCategory]?.name || 'Chủ đề tổng hợp')
    : (getTopicInfo(currentDictTopic)?.name || 'Chủ đề');

  const customCards = sample.map(w => ({
    title: w.title,
    pinyin: w.pinyin || '',
    meaning: w.meaning || '',
    level: w.level || 1,
    pos: w.pos || topicName,
    exampleSentence: w.exampleSentence || '',
    exampleMeaning: w.exampleMeaning || ''
  }));

  await switchTab('flashcards');
  startFlashcardSession('topic', { customCards });
  showToast(`Đã nạp ${customCards.length} từ vựng chủ đề "${topicName}" vào Flashcard để ôn tập!`, 'success');
}
