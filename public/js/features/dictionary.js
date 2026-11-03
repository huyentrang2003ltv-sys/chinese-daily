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

/** Topic lookup by id (name/icon are no longer stored on each vocab item). */
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
  if (container) {
    container.innerHTML = '<div class="col-span-full text-center text-stone-500 text-sm py-10">Đang tải kho từ vựng theo chủ đề...</div>';
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
      topicBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-700 to-[#1E4D43] text-white shadow-md cursor-pointer border border-emerald-800';
    }
    if (hskBtn) {
      hskBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 transition-all cursor-pointer';
    }
    if (!(await ensureTopicData())) return;
    // The user may have switched back to HSK while the data was loading.
    if (currentDictMode !== 'topic') return;
    renderTopicPills();
    if (topicDictRendered === 0) {
      renderTopicDictionary(true);
    }
  }
  refreshIcons();
}

function renderTopicPills() {
  const container = document.getElementById('topicFilterPills');
  if (!container) return;

  const sourceVocab = thematicVocabData;
  const totalWords = sourceVocab.length;
  const topicsList = topicsData || [];
  
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

  let html = `
    <button onclick="filterDictTopic('all')" id="btn-topic-all" class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${currentDictTopic === 'all' ? 'bg-gradient-to-r from-emerald-700 to-[#1E4D43] text-white shadow-sm border border-emerald-800' : 'bg-white dark:bg-stone-800 hover:bg-emerald-50 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'}" title="Xem toàn bộ từ vựng">
      <span>🌟 Tất Cả ${topicsList.length} Chủ Đề</span>
      <span class="text-[10px] px-1.5 py-0.2 rounded-full ${currentDictTopic === 'all' ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-semibold'}">${totalWords.toLocaleString()}</span>
    </button>
  `;

  filteredTopics.forEach(t => {
    const isSelected = currentDictTopic === t.id;
    const count = t.count || sourceVocab.filter(w => w.topicId === t.id).length;
    html += `
      <button onclick="filterDictTopic(${jsArg(t.id)})" id="btn-topic-${escapeHtml(t.id)}" class="px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${isSelected ? 'bg-gradient-to-r from-emerald-700 to-[#1E4D43] text-white shadow-sm border border-emerald-800' : 'bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'}" title="${escapeHtml(t.fullName || t.name)}">
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

  const label = document.getElementById('activeTopicLabel');
  if (label) {
    if (topicId === 'all') {
      const sourceVocab = thematicVocabData;
      const total = sourceVocab.length;
      label.innerText = `🌟 Tất Cả ${topicsData.length} Chủ Đề (${total.toLocaleString()} từ)`;
      label.className = 'text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-700';
    } else {
      const found = getTopicInfo(topicId, true);
      const name = found ? `${found.icon} ${found.name} (${found.count} từ)` : `Chủ đề: ${topicId}`;
      label.innerText = name;
      label.className = 'text-xs font-bold text-emerald-950 dark:text-emerald-200 bg-emerald-200/90 dark:bg-emerald-900/90 px-2.5 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-600';
    }
  }

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

function getFilteredTopicDictionaryList() {
  const source = thematicVocabData;
  if (!source || !Array.isArray(source)) return [];
  let list = source;

  if (currentDictTopic !== 'all') {
    list = list.filter(item => item.topicId === currentDictTopic);
  }

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
  return list;
}

function renderTopicDictionary(reset = false) {
  const container = document.getElementById('topicGridContainer');
  if (!container) return;

  const source = thematicVocabData;
  const totalLabel = document.getElementById('topicTotalCountLabel');
  const filteredLabel = document.getElementById('topicFilteredCount');
  const filteredList = getFilteredTopicDictionaryList();

  if (totalLabel) totalLabel.innerText = `${source.length.toLocaleString()}`;
  if (filteredLabel) filteredLabel.innerText = `${filteredList.length.toLocaleString()}`;

  if (reset) {
    topicDictRendered = 0;
    container.innerHTML = '';
  }

  if (filteredList.length === 0) {
    container.innerHTML = `
      <div class="col-span-full glass-card rounded-2xl p-10 text-center text-stone-500 border border-emerald-200 bg-white dark:bg-stone-900 shadow-xs space-y-2">
        <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800 dark:text-stone-200">Không tìm thấy từ vựng nào trong chủ đề này.</p>
        <p class="text-xs text-stone-500">Hãy thử nhập từ khóa khác hoặc bấm chọn "🌟 Tất Cả Chủ Đề".</p>
      </div>
    `;
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

  nextBatch.forEach(item => {
    const card = document.createElement('div');
    const badgeStyle = levelBadgeStyles[item.level] || 'bg-amber-100 text-amber-900 border-amber-200';
    const topic = getTopicInfo(item.topicId);

    card.className = 'glass-card rounded-2xl p-5 border border-emerald-200/80 dark:border-stone-700 bg-white dark:bg-[#161B22] flex flex-col justify-between hover:border-emerald-600 transition-all shadow-xs hover:shadow-md';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between text-xs text-stone-500 mb-2.5 gap-1.5 flex-wrap">
          <div class="flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <span>${escapeHtml(topic.icon || '🏷️')}</span>
              <span>${escapeHtml(topic.name || 'Chủ đề')}</span>
            </span>
            <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold border ${badgeStyle}">
              HSK ${item.level}
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
          <p class="text-xs font-bold text-emerald-800 dark:text-emerald-400 tracking-wide">${escapeHtml(item.pinyin)}</p>
          ${item.hanviet ? `<span class="text-[11px] font-bold text-amber-950 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-700">[${escapeHtml(item.hanviet)}]</span>` : ''}
        </div>
        <p class="text-xs font-medium text-stone-800 dark:text-stone-200 mt-1 leading-snug">${escapeHtml(item.meaning)}</p>
      </div>

      ${item.exampleSentence ? `
        <div class="mt-4 pt-3 border-t border-emerald-200/60 dark:border-stone-700 text-xs space-y-1 bg-[#FAF7F2]/60 dark:bg-stone-900/60 p-2.5 rounded-xl">
          <div class="flex items-start justify-between gap-1.5">
            <p class="font-hanzi text-stone-900 dark:text-stone-100 font-bold text-xs leading-relaxed">${escapeHtml(item.exampleSentence)}</p>
            <div class="flex items-center gap-1 shrink-0">
              <button onclick="playChineseTTS(${jsArg(item.exampleSentence.replace(/\n/g, ' '))}, 'female')" class="px-1.5 py-0.5 rounded bg-white dark:bg-stone-700 hover:bg-rose-50 text-rose-850 dark:text-rose-300 border border-rose-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nữ">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS(${jsArg(item.exampleSentence.replace(/\n/g, ' '))}, 'male')" class="px-1.5 py-0.5 rounded bg-white dark:bg-stone-700 hover:bg-blue-50 text-blue-850 dark:text-blue-300 border border-blue-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nam">
                👨 Nam
              </button>
            </div>
          </div>
          ${item.examplePinyin ? `<p class="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">${escapeHtml(item.examplePinyin)}</p>` : ''}
          ${item.exampleMeaning ? `<p class="text-[11px] text-stone-600 dark:text-stone-400 italic leading-snug">${escapeHtml(item.exampleMeaning)}</p>` : ''}
        </div>
      ` : ''}
    `;
    container.appendChild(card);
  });

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
