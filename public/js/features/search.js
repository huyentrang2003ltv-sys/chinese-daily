// ==========================================
// INTELLIGENT PHONETIC & LINGUISTIC NORMALIZERS
// ==========================================
function hasVietnameseDiacritics(str) {
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(str);
}

function normalizePinyin(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[āáǎà]/g, 'a')
    .replace(/[ēéěè]/g, 'e')
    .replace(/[īíǐì]/g, 'i')
    .replace(/[ōóǒò]/g, 'o')
    .replace(/[ūúǔù]/g, 'u')
    .replace(/[ǖǘǚǜü]/g, 'u')
    .replace(/[1-5]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeVietnamese(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function splitMeaningTerms(str) {
  if (!str) return [];
  return str
    .split(/[,;；、/()（）\[\]【】\n\r]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

// Datasets the omni-search looks through; loaded lazily on first focus/input.
const SEARCH_DATASETS = ['dictionary', 'etymology', 'radicals', 'chengyu', 'culture', 'jiaocheng'];

function ensureSearchData() {
  return loadDatasets(SEARCH_DATASETS);
}

// Global Search State
let currentSearchResults = [];
let currentSearchSelectedIndex = -1;
let currentWordModalWord = null;

// ==========================================
// HIGH-PRECISION MULTI-SOURCE OMNISEARCH ENGINE
// ==========================================
function searchOmniDatabase(query) {
  if (!query || !query.trim()) return [];

  const rawQ = query.trim().toLowerCase();
  const hasVn = hasVietnameseDiacritics(query);
  const isHanzi = /[\u4e00-\u9fa5]/.test(query);
  const pyQ = normalizePinyin(query);
  const viQ = normalizeVietnamese(query);
  const viTokens = viQ ? viQ.split(/\s+/).filter(Boolean) : [];

  const results = [];

  // Helper for scoring meanings
  function scoreMeaning(meaningStr) {
    if (!meaningStr) return 0;
    let mScore = 0;
    const meaningLower = meaningStr.toLowerCase();
    const meaningNorm = normalizeVietnamese(meaningStr);

    const terms = splitMeaningTerms(meaningLower);
    for (const term of terms) {
      const termNorm = normalizeVietnamese(term);
      if (term === rawQ) {
        mScore = Math.max(mScore, 950); // Exact accented meaning match (e.g. "tôi", "bạn", "yêu")
        break;
      }
      if (!hasVn && termNorm === viQ) {
        mScore = Math.max(mScore, 780); // Exact unaccented meaning match (e.g. "yeu" -> 爱)
        break;
      }
      if (hasVn && term.startsWith(rawQ)) {
        mScore = Math.max(mScore, 440);
      } else if (!hasVn && termNorm.startsWith(viQ)) {
        mScore = Math.max(mScore, 350);
      } else if (hasVn && rawQ.length >= 2 && term.includes(rawQ)) {
        mScore = Math.max(mScore, 260);
      } else if (!hasVn && viQ.length >= 2 && termNorm.includes(viQ)) {
        mScore = Math.max(mScore, 180);
      }
    }

    if (meaningLower === rawQ) mScore = Math.max(mScore, 880);
    else if (!hasVn && meaningNorm === viQ) mScore = Math.max(mScore, 700);

    return mScore;
  }

  // 1. Search Dictionary (HSK 1-6)
  if (dictionaryData && Array.isArray(dictionaryData)) {
    for (const item of dictionaryData) {
      let score = 0;
      const title = (item.title || '').toLowerCase();
      const pinyin = (item.pinyin || '').toLowerCase();
      const pinyinNorm = normalizePinyin(item.pinyin);
      const hanviet = (item.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(item.hanviet);
      const meaningNorm = normalizeVietnamese(item.meaning);

      // A. Hanzi Match
      if (title === rawQ) score += 1050;
      else if (title.startsWith(rawQ)) score += 340;
      else if (title.includes(rawQ)) score += 160;

      // B. Meaning Match (Highest priority for Vietnamese search queries)
      const mScore = scoreMeaning(item.meaning);
      score += mScore;

      // C. Pinyin Match (Only if query is NOT Vietnamese accented)
      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 750;
        else if (pyQ && pinyinNorm.startsWith(pyQ)) score += 260;
        else if (pyQ && pinyinNorm.includes(pyQ)) score += 90;
      }

      // D. Hán Việt Match
      if (hanviet === rawQ) score += 620;
      else if (hanvietNorm === viQ) {
        if (!hasVn || hanviet === rawQ) score += 480;
        else score += 80;
      } else if (hanvietNorm.startsWith(viQ)) score += 160;
      else if (hanvietNorm.includes(viQ)) score += 70;

      // E. Multi-word Token Intersection
      if (viTokens.length > 1) {
        const fullViText = `${hanvietNorm} ${meaningNorm}`;
        if (viTokens.every(t => fullViText.includes(t))) {
          score += 140;
        }
      }

      // Boost for foundational vocabulary (HSK 1-2)
      if (score > 0) {
        if (item.level === 1) score += 40;
        else if (item.level === 2) score += 20;

        results.push({
          type: 'dict',
          title: item.title,
          pinyin: item.pinyin,
          hanviet: item.hanviet || '',
          meaning: item.meaning,
          level: item.level || 1,
          score
        });
      }
    }
  }

  // 2. Search Etymology (Chiết Tự & Gốc Từ)
  if (etymologyData && Array.isArray(etymologyData)) {
    for (const e of etymologyData) {
      let score = 0;
      const hanzi = (e.hanzi || '').toLowerCase();
      const pinyinNorm = normalizePinyin(e.pinyin);
      const hanviet = (e.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(e.hanviet);
      const storyNorm = normalizeVietnamese(e.etymologyStory);

      if (hanzi === rawQ) score += 980;
      else if (hanzi.includes(rawQ)) score += 200;

      const mScore = scoreMeaning(e.meaning);
      score += Math.round(mScore * 0.9);

      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 680;
        else if (pyQ && pinyinNorm.startsWith(pyQ)) score += 220;
      }

      if (hanviet === rawQ) score += 550;
      else if (hanvietNorm === viQ) {
        if (!hasVn || hanviet === rawQ) score += 420;
        else score += 60;
      }

      if (viQ && storyNorm.includes(viQ)) score += 90;

      if (score > 0) {
        results.push({
          type: 'etymology',
          title: e.hanzi,
          pinyin: e.pinyin,
          hanviet: `Chiết Tự: ${e.hanviet}`,
          meaning: e.meaning,
          score: score - 10
        });
      }
    }
  }

  // 3. Search 214 Radicals (Bộ Thủ Khang Hy)
  if (radicalsData && Array.isArray(radicalsData)) {
    for (const r of radicalsData) {
      let score = 0;
      const char = (r.char || '').toLowerCase();
      const pinyinNorm = normalizePinyin(r.pinyin);
      const hanviet = (r.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(r.hanviet);

      if (char === rawQ) score += 920;
      const mScore = scoreMeaning(r.meaning);
      score += Math.round(mScore * 0.85);

      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 620;
      }

      if (hanviet === rawQ || `bộ ${hanviet}` === rawQ) score += 580;
      else if (hanvietNorm === viQ || `bo ${hanvietNorm}` === viQ) {
        score += 380;
      }

      if (score > 0) {
        results.push({
          type: 'radical',
          title: r.char,
          pinyin: r.pinyin,
          hanviet: `Bộ ${r.hanviet}`,
          meaning: r.meaning,
          strokes: r.strokes,
          score: score - 15
        });
      }
    }
  }

  // 4. Search Chengyu & Idioms (Thành Ngữ Điển Tích)
  if (chengyuData && Array.isArray(chengyuData)) {
    for (const c of chengyuData) {
      let score = 0;
      const title = (c.chengyu || '').toLowerCase();
      const pinyinNorm = normalizePinyin(c.pinyin);
      const hanviet = (c.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(c.hanviet);
      const litNorm = normalizeVietnamese(c.literal);
      const figNorm = normalizeVietnamese(c.figurative);
      const storyNorm = normalizeVietnamese(c.story);

      if (title === rawQ) score += 980;
      else if (title.includes(rawQ)) score += 300;

      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 700;
        else if (pyQ && pinyinNorm.includes(pyQ)) score += 200;
      }

      if (hanviet === rawQ) score += 600;
      else if (hanvietNorm === viQ) score += 450;
      else if (hanvietNorm.includes(viQ)) score += 180;

      if (viQ && (litNorm.includes(viQ) || figNorm.includes(viQ))) score += 220;
      if (viTokens.length > 1) {
        const comb = `${litNorm} ${figNorm} ${storyNorm}`;
        if (viTokens.every(t => comb.includes(t))) score += 150;
      }

      if (score > 0) {
        results.push({
          type: 'chengyu',
          title: c.chengyu,
          pinyin: c.pinyin,
          hanviet: c.hanviet,
          meaning: `${c.literal} — ${c.figurative}`,
          score
        });
      }
    }
  }

  // 5. Search Culture & Dynasties (Lịch Sử & Văn Hóa)
  if (cultureData && Array.isArray(cultureData)) {
    for (const era of cultureData) {
      let score = 0;
      const title = (era.title || '').toLowerCase();
      const eraName = (era.eraName || '').toLowerCase();
      const combinedVi = normalizeVietnamese(`${era.eraName} ${era.title} ${era.summary} ${(era.keywords || []).join(' ')}`);

      if (title.toLowerCase().includes(rawQ) || eraName.toLowerCase().includes(rawQ)) score += 450;
      if (viQ && combinedVi.includes(viQ)) score += 250;
      if (viTokens.length > 1 && viTokens.every(t => combinedVi.includes(t))) score += 180;

      if (score > 0) {
        results.push({
          type: 'culture',
          title: era.eraName || era.title,
          pinyin: era.period || '',
          hanviet: 'Lịch Sử & Văn Hóa',
          meaning: (era.summary || era.title).slice(0, 120),
          targetId: era.id,
          score
        });
      }
    }
  }

  // 6. Search Jiaocheng Lessons (Giáo Trình Hán Ngữ)
  if (jiaochengData && jiaochengData.lessons && Array.isArray(jiaochengData.lessons)) {
    for (const l of jiaochengData.lessons) {
      let score = 0;
      const titleHanzi = (l.titleHanzi || '').toLowerCase();
      const titleMeaning = (l.titleMeaning || '').toLowerCase();
      const titleNorm = normalizeVietnamese(l.titleMeaning);

      if (titleHanzi.includes(rawQ)) score += 350;
      if (titleMeaning.includes(rawQ)) score += 320;
      else if (viQ && titleNorm.includes(viQ)) score += 220;

      const numMatch = rawQ.match(/(?:bài|bai)\s*([0-9]{1,2})/i);
      if (numMatch && parseInt(numMatch[1]) === l.lessonNum) {
        score += 550;
      }

      if (score > 0) {
        results.push({
          type: 'jiaocheng',
          title: `Bài ${l.lessonNum}: ${l.titleHanzi}`,
          pinyin: l.titlePinyin || '',
          hanviet: l.volumeName || 'Giáo Trình Hán Ngữ',
          meaning: `${l.titleMeaning} (${l.category || ''})`,
          lessonNum: l.lessonNum,
          lessonId: l.id,
          score
        });
      }
    }
  }

  // Deduplicate and sort descending by score
  results.sort((a, b) => b.score - a.score);

  const seen = new Set();
  const uniqueResults = [];
  for (const r of results) {
    const key = `${r.type}-${r.title}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueResults.push(r);
    }
  }

  return uniqueResults.slice(0, 10);
}

// ---------------- GLOBAL SEARCH ----------------
function setupGlobalSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  const dropdown = document.getElementById('searchDropdown');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (!searchInput || !dropdown) return;

  if (searchInput._globalSearchInitialized) return;
  searchInput._globalSearchInitialized = true;

  searchInput.addEventListener('input', debounce((e) => {
    handleGlobalSearch(e.target.value);
  }, 80));

  searchInput.addEventListener('focus', () => {
    ensureSearchData().catch(() => {});
    if (searchInput.value.trim() && currentSearchResults && currentSearchResults.length > 0) {
      dropdown.classList.remove('hidden');
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (dropdown.classList.contains('hidden') || !currentSearchResults.length) {
      if (e.key === 'Enter') {
        handleGlobalSearch(searchInput.value);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentSearchSelectedIndex = (currentSearchSelectedIndex + 1) % currentSearchResults.length;
      updateSearchSelectionHighlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentSearchSelectedIndex = (currentSearchSelectedIndex - 1 + currentSearchResults.length) % currentSearchResults.length;
      updateSearchSelectionHighlight();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const targetIdx = currentSearchSelectedIndex >= 0 ? currentSearchSelectedIndex : 0;
      selectSearchResult(targetIdx);
    } else if (e.key === 'Escape') {
      dropdown.classList.add('hidden');
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

async function handleGlobalSearch(query) {
  const searchInput = document.getElementById('globalSearchInput');
  const dropdown = document.getElementById('searchDropdown');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (!dropdown) return;

  const q = (query || '').trim();
  if (!q) {
    dropdown.classList.add('hidden');
    if (clearBtn) clearBtn.classList.add('hidden');
    currentSearchResults = [];
    currentSearchSelectedIndex = -1;
    return;
  }

  if (clearBtn) clearBtn.classList.remove('hidden');

  if (!isDataLoaded(SEARCH_DATASETS)) {
    dropdown.innerHTML = '<div class="p-6 text-center text-xs text-stone-500 dark:text-stone-400">Đang tải dữ liệu tra cứu...</div>';
    dropdown.classList.remove('hidden');
    try {
      await ensureSearchData();
    } catch (err) {
      console.error('Không tải được dữ liệu tìm kiếm:', err);
      dropdown.innerHTML = '<div class="p-6 text-center text-xs text-rose-600">Không tải được dữ liệu tra cứu. Vui lòng thử lại.</div>';
      return;
    }
    // Ignore stale results if the user kept typing or cleared the box meanwhile.
    if (searchInput && (searchInput.value || '').trim() !== q) return;
  }

  const matches = searchOmniDatabase(q);
  currentSearchResults = matches;
  currentSearchSelectedIndex = -1;

  if (!matches.length) {
    dropdown.innerHTML = `
      <div class="p-6 text-center text-xs space-y-2">
        <div class="w-10 h-10 rounded-full bg-amber-50 dark:bg-stone-800 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto text-lg">
          🔍
        </div>
        <p class="font-bold text-stone-800 dark:text-stone-200">Không tìm thấy từ vựng khớp với "${escapeHtml(q)}".</p>
        <p class="text-stone-500 dark:text-stone-400 text-[11px] leading-relaxed">
          Gợi ý: Bạn có thể gõ chữ Hán (<strong>你好</strong>), Pinyin không dấu (<strong>nihao, xiexie</strong>), Hán Việt (<strong>Nhĩ hảo, Tạ tạ</strong>) hoặc nghĩa tiếng Việt (<strong>xin chào, cảm ơn</strong>).
        </p>
      </div>
    `;
    dropdown.classList.remove('hidden');
    return;
  }

  renderSearchResults(matches, q);
  dropdown.classList.remove('hidden');
}

function renderSearchResults(matches, query) {
  const dropdown = document.getElementById('searchDropdown');
  if (!dropdown) return;

  const typeBadges = {
    dict: (lvl) => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-[#8B1E1E] dark:text-amber-300 border border-amber-300 dark:border-amber-700">HSK ${lvl}</span>`,
    radical: (st) => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">Bộ Thủ (${st} nét)</span>`,
    chengyu: () => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-700">Thành Ngữ</span>`,
    etymology: () => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-700">Chiết Tự</span>`,
    culture: () => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-700">Lịch Sử</span>`,
    jiaocheng: () => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700">Giáo Trình</span>`
  };

  const itemsHtml = matches.map((m, idx) => {
    let badgeHtml = '';
    if (m.type === 'dict') badgeHtml = typeBadges.dict(m.level);
    else if (m.type === 'radical') badgeHtml = typeBadges.radical(m.strokes);
    else if (m.type === 'chengyu') badgeHtml = typeBadges.chengyu();
    else if (m.type === 'etymology') badgeHtml = typeBadges.etymology();
    else if (m.type === 'culture') badgeHtml = typeBadges.culture();
    else if (m.type === 'jiaocheng') badgeHtml = typeBadges.jiaocheng();

    return `
      <div 
        id="search-item-${idx}" 
        onclick="selectSearchResult(${idx})" 
        class="search-item-row p-2.5 rounded-xl hover:bg-amber-100/70 dark:hover:bg-stone-800/90 cursor-pointer flex items-center justify-between transition-all border border-transparent hover:border-amber-300/80 dark:hover:border-amber-500/40 group"
      >
        <div class="flex items-center gap-3 min-w-0 pr-2">
          <div class="w-12 h-12 rounded-xl bg-amber-50/80 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <span class="font-hanzi text-2xl font-black text-[#8B1E1E] dark:text-red-400">${escapeHtml(m.title)}</span>
          </div>
          <div class="min-w-0 space-y-0.5">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-xs font-bold text-[#8B1E1E] dark:text-red-400 tracking-wide">${escapeHtml(m.pinyin)}</span>
              ${m.hanviet ? `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100/90 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border border-amber-300/70 dark:border-amber-700">[${escapeHtml(m.hanviet)}]</span>` : ''}
            </div>
            <p class="text-xs text-stone-700 dark:text-stone-300 truncate max-w-[280px] sm:max-w-[340px] font-medium leading-snug">${escapeHtml(m.meaning)}</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0 pl-1">
          <button 
            onclick="event.stopPropagation(); playChineseTTS(${jsArg(m.title)}, 'female');" 
            title="Nghe phát âm chuẩn giọng Nữ" 
            class="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-stone-600 dark:text-stone-300 hover:text-rose-800 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
          >
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          </button>
          ${badgeHtml}
        </div>
      </div>
    `;
  }).join('');

  dropdown.innerHTML = `
    <div class="px-3 py-1.5 border-b border-amber-200/60 dark:border-amber-500/20 text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
      <span>🔍 Tìm thấy ${matches.length} kết quả phù hợp cho "${escapeHtml(query)}"</span>
      <span class="text-[10px] text-stone-400 font-normal">Bấm hoặc nhấn Enter để xem</span>
    </div>
    <div class="space-y-1 py-1">
      ${itemsHtml}
    </div>
    <div class="px-3 py-1.5 border-t border-amber-200/60 dark:border-amber-500/20 text-[10px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
      <span>↑ ↓ Di chuyển</span>
      <span>Enter Mở chi tiết</span>
      <span>Esc Đóng</span>
    </div>
  `;

  refreshIcons(dropdown);
}

function updateSearchSelectionHighlight() {
  const rows = document.querySelectorAll('.search-item-row');
  rows.forEach((row, i) => {
    if (i === currentSearchSelectedIndex) {
      row.classList.add('bg-amber-100/90', 'dark:bg-stone-800', 'border-amber-400');
      row.scrollIntoView({ block: 'nearest' });
    } else {
      row.classList.remove('bg-amber-100/90', 'dark:bg-stone-800', 'border-amber-400');
    }
  });
}

async function selectSearchResult(index) {
  const dropdown = document.getElementById('searchDropdown');
  if (dropdown) dropdown.classList.add('hidden');

  if (!currentSearchResults || !currentSearchResults[index]) return;
  const item = currentSearchResults[index];

  if (item.type === 'dict') {
    openWordModalByTitle(item.title);
  } else if (item.type === 'radical') {
    openWritingModal(item.title, item.pinyin, item.hanviet + ' (' + item.meaning + ')');
  } else if (item.type === 'chengyu') {
    switchTab('chengyu');
    showToast(`Đang mở thành ngữ: ${item.title} (${item.hanviet})`, 'info');
  } else if (item.type === 'etymology') {
    await switchTab('etymology');
    selectOrDecomposeEtymology(item.title);
    showToast(`Đang mở chiết tự chữ: ${item.title}`, 'info');
  } else if (item.type === 'culture') {
    switchTab('culture');
    showToast(`Đang mở mục: ${item.title}`, 'info');
  } else if (item.type === 'jiaocheng') {
    await switchTab('jiaocheng');
    openLessonDetailModal(item.lessonId);
    showToast(`Đang mở: ${item.title}`, 'info');
  }
}

function clearSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';
  const dropdown = document.getElementById('searchDropdown');
  if (dropdown) dropdown.classList.add('hidden');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) clearBtn.classList.add('hidden');
  currentSearchResults = [];
  currentSearchSelectedIndex = -1;
  if (searchInput) searchInput.focus();
}

// ---------------- WORD DETAIL MODAL (MULTIDIMENSIONAL 6-IN-1) ----------------
// 1. Cách dùng | 2. Nghĩa | 3. Từ đồng nghĩa | 4. Trái nghĩa | 5. Từ đồng âm | 6. Hình ảnh mô tả

let floatingLookupTargetWord = '';
let floatingLookupHideTimeout = null;

async function openWordModalByTitle(title) {
  if (!title) return;
  const cleanTitle = String(title).trim();

  try {
    await loadDatasets(['multidimensionalWords', 'dictionary', 'etymology', 'radicals']);
  } catch (err) {
    console.warn('Could not preload all datasets for wordModal:', err);
  }

  // 1. Try multidimensionalWordsData first (richest 6-in-1 data)
  let word = (multidimensionalWordsData && multidimensionalWordsData[cleanTitle]) ? multidimensionalWordsData[cleanTitle] : null;

  // 2. Fall back to dictionaryData
  if (!word && typeof dictionaryData !== 'undefined' && dictionaryData) {
    const dictMatch = dictionaryData.find(w => w.title === cleanTitle);
    if (dictMatch) {
      word = {
        hanzi: dictMatch.title,
        pinyin: dictMatch.pinyin || '',
        hanviet: dictMatch.hanviet || '',
        meaning: dictMatch.meaning || '',
        pos: dictMatch.pos || 'từ vựng',
        level: dictMatch.level || 1,
        usage: [
          `🔹 Từ vựng cốt lõi HSK ${dictMatch.level || 1}.`,
          `🔹 Ngữ cảnh: Thường xuất hiện trong giao tiếp hàng ngày.`
        ],
        exampleSentence: dictMatch.exampleSentence || `${cleanTitle}很好。`,
        examplePinyin: dictMatch.examplePinyin || '',
        exampleMeaning: dictMatch.exampleMeaning || '',
        synonyms: [],
        antonyms: [],
        homophones: [],
        image: dictMatch.topicIcon || '🏮',
        imageCaption: dictMatch.meaning || 'Minh họa ngữ nghĩa'
      };
    }
  }

  // 3. Fall back to etymologyData
  if (!word && typeof etymologyData !== 'undefined' && etymologyData) {
    const etymMatch = etymologyData.find(e => e.hanzi === cleanTitle);
    if (etymMatch) {
      word = {
        hanzi: etymMatch.hanzi,
        pinyin: etymMatch.pinyin || '',
        hanviet: etymMatch.hanviet || '',
        meaning: etymMatch.meaning || '',
        pos: 'chữ Hán (Chiết tự)',
        level: 1,
        usage: [
          `🔹 Lục thư: ${etymMatch.category || 'Tượng hình'}.`,
          `🔹 Ý nghĩa chiết tự: ${etymMatch.meaning || ''}.`
        ],
        exampleSentence: etymMatch.etymologyStory ? etymMatch.etymologyStory.slice(0, 100) : cleanTitle,
        examplePinyin: etymMatch.pinyin || '',
        exampleMeaning: etymMatch.meaning || '',
        synonyms: [],
        antonyms: [],
        homophones: [],
        image: '🏛️',
        imageCaption: `Chiết tự chữ ${etymMatch.hanzi}`
      };
    }
  }

  // 4. Fall back to radicalsData
  if (!word && typeof radicalsData !== 'undefined' && radicalsData) {
    const radMatch = radicalsData.find(r => r.char === cleanTitle);
    if (radMatch) {
      word = {
        hanzi: radMatch.char,
        pinyin: radMatch.pinyin || '',
        hanviet: `Bộ ${radMatch.hanviet || ''}`,
        meaning: radMatch.meaning || '',
        pos: `Bộ thủ (${radMatch.strokes || 1} nét)`,
        level: 1,
        usage: [
          `🔹 Bộ thủ Khang Hy số ${radMatch.number || ''}.`,
          `🔹 Biểu nghĩa nền tảng cho nhiều chữ Hán phái sinh.`
        ],
        exampleSentence: `Bộ thủ ${radMatch.char} (${radMatch.hanviet})`,
        examplePinyin: radMatch.pinyin || '',
        exampleMeaning: radMatch.meaning || '',
        synonyms: [],
        antonyms: [],
        homophones: [],
        image: '🏮',
        imageCaption: `Bộ thủ ${radMatch.char}`
      };
    }
  }

  // 5. If still not found, synthesize a valid multidimensional card on-the-fly
  if (!word) {
    word = {
      hanzi: cleanTitle,
      pinyin: '',
      hanviet: 'Đang cập nhật',
      meaning: `Từ vựng: ${cleanTitle}`,
      pos: 'từ vựng',
      level: 1,
      usage: [
        `🔹 Từ vựng tiếng Trung thực hành giao tiếp.`,
        `🔹 Bấm 'Tập Viết Nét' hoặc 'Xem Chiết Tự' để tra cứu sâu hơn.`
      ],
      exampleSentence: cleanTitle,
      examplePinyin: '',
      exampleMeaning: '',
      synonyms: [],
      antonyms: [],
      homophones: [],
      image: '✨',
      imageCaption: cleanTitle
    };
  }

  currentWordModalWord = {
    title: word.hanzi || cleanTitle,
    ...word
  };

  // Populate Header
  const hanziEl = document.getElementById('modalHanzi');
  const pinyinEl = document.getElementById('modalPinyin');
  const posEl = document.getElementById('modalPos');
  const meaningEl = document.getElementById('modalMeaning');
  const hanvietBadge = document.getElementById('modalHanvietBadge');
  const levelBadge = document.getElementById('modalLevelBadge');
  const imgDisplay = document.getElementById('modalImageDisplay');
  const imgCaption = document.getElementById('modalImageCaption');

  if (hanziEl) hanziEl.innerText = word.hanzi || cleanTitle;
  if (pinyinEl) pinyinEl.innerText = word.pinyin || '';
  if (posEl) posEl.innerText = word.pos || 'từ vựng';
  if (meaningEl) meaningEl.innerText = word.meaning || '';

  if (hanvietBadge) {
    hanvietBadge.innerText = word.hanviet ? `Hán Việt: ${word.hanviet}` : 'Hán Việt: Đang cập nhật';
  }
  if (levelBadge) {
    levelBadge.innerText = `HSK ${word.level || 1}`;
  }
  if (imgDisplay) {
    imgDisplay.innerText = word.image || '🏮';
  }
  if (imgCaption) {
    imgCaption.innerText = word.imageCaption || word.meaning || 'Minh họa ngữ nghĩa';
    imgCaption.title = word.imageCaption || '';
  }

  // Populate Usage (Cách dùng & Cụm từ thường gặp)
  const usageContainer = document.getElementById('modalUsageContainer');
  if (usageContainer) {
    const usages = (word.usage && word.usage.length > 0)
      ? word.usage
      : [`🔹 Cấu trúc kết hợp thông dụng trong giao tiếp và kỳ thi HSK.`];

    usageContainer.innerHTML = usages.map(u => `
      <div class="flex items-start gap-2">
        <span class="text-amber-600 dark:text-amber-400 font-bold shrink-0">✦</span>
        <span class="leading-relaxed">${escapeHtml(u)}</span>
      </div>
    `).join('');
  }

  // Populate Example Sentence
  const exHanzi = document.getElementById('modalExampleHanzi');
  const exPinyin = document.getElementById('modalExamplePinyin');
  const exVi = document.getElementById('modalExampleVi');

  if (exHanzi) exHanzi.innerText = word.exampleSentence || cleanTitle;
  if (exPinyin) exPinyin.innerText = word.examplePinyin || word.pinyin || '';
  if (exVi) exVi.innerText = word.exampleMeaning || word.meaning || '';

  // Populate Synonyms (近义词)
  const synList = document.getElementById('modalSynonymsList');
  if (synList) {
    if (word.synonyms && word.synonyms.length > 0) {
      synList.innerHTML = word.synonyms.map(s => `
        <button onclick="openWordModalByTitle('${escapeHtml(s.hanzi)}')" class="group flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/80 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 shadow-2xs transition-all cursor-pointer" title="${escapeHtml(s.desc || s.meaning || '')}">
          <span class="font-hanzi font-bold text-stone-900 dark:text-emerald-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">${escapeHtml(s.hanzi)}</span>
          ${s.pinyin ? `<span class="text-[10px] text-emerald-800 dark:text-emerald-400 font-mono">(${escapeHtml(s.pinyin)})</span>` : ''}
          ${s.meaning ? `<span class="text-[11px] text-stone-600 dark:text-stone-300">${escapeHtml(s.meaning)}</span>` : ''}
        </button>
      `).join('');
    } else {
      synList.innerHTML = `<span class="text-xs text-stone-400 dark:text-stone-500 italic py-0.5">Không có từ đồng nghĩa tương đương trực tiếp</span>`;
    }
  }

  // Populate Antonyms (反义词)
  const antList = document.getElementById('modalAntonymsList');
  if (antList) {
    if (word.antonyms && word.antonyms.length > 0) {
      antList.innerHTML = word.antonyms.map(a => `
        <button onclick="openWordModalByTitle('${escapeHtml(a.hanzi)}')" class="group flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700/80 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/50 shadow-2xs transition-all cursor-pointer" title="${escapeHtml(a.desc || a.meaning || '')}">
          <span class="font-hanzi font-bold text-stone-900 dark:text-rose-200 group-hover:text-rose-700 dark:group-hover:text-rose-300">${escapeHtml(a.hanzi)}</span>
          ${a.pinyin ? `<span class="text-[10px] text-rose-800 dark:text-rose-400 font-mono">(${escapeHtml(a.pinyin)})</span>` : ''}
          ${a.meaning ? `<span class="text-[11px] text-stone-600 dark:text-stone-300">${escapeHtml(a.meaning)}</span>` : ''}
        </button>
      `).join('');
    } else {
      antList.innerHTML = `<span class="text-xs text-stone-400 dark:text-stone-500 italic py-0.5">Không có cặp từ phản nghĩa đối lập trực tiếp</span>`;
    }
  }

  // Populate Homophones (同音词 • Tránh Nhầm Lẫn)
  const homoList = document.getElementById('modalHomophonesList');
  if (homoList) {
    if (word.homophones && word.homophones.length > 0) {
      homoList.innerHTML = word.homophones.map(h => `
        <button onclick="openWordModalByTitle('${escapeHtml(h.hanzi)}')" class="group flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/80 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/40 shadow-2xs transition-all cursor-pointer" title="Cùng âm ${escapeHtml(h.pinyin || '')}">
          <span class="font-hanzi font-bold text-stone-900 dark:text-amber-200 group-hover:text-amber-700 dark:group-hover:text-amber-300">${escapeHtml(h.hanzi)}</span>
          ${h.pinyin ? `<span class="text-[10px] text-amber-800 dark:text-amber-400 font-mono">(${escapeHtml(h.pinyin)})</span>` : ''}
          ${h.meaning ? `<span class="text-[11px] text-stone-600 dark:text-stone-300">${escapeHtml(h.meaning)}</span>` : ''}
        </button>
      `).join('');
    } else {
      homoList.innerHTML = `<span class="text-xs text-stone-400 dark:text-stone-500 italic py-0.5">Phiên âm độc lập, không có từ đồng âm gây nhầm lẫn</span>`;
    }
  }

  updateWordModalBookmarkState();
  openModal('wordModal');
  if (typeof refreshIcons === 'function') refreshIcons();
}

function closeWordModal() {
  closeModal('wordModal');
}

registerModal('wordModal', closeWordModal);

function playWordModalTTS(gender = 'female') {
  if (currentWordModalWord && currentWordModalWord.title) {
    playChineseTTS(currentWordModalWord.title, gender);
  }
}

function playWordModalExampleTTS(gender = 'female') {
  if (currentWordModalWord && currentWordModalWord.exampleSentence) {
    playChineseTTS(currentWordModalWord.exampleSentence, gender);
  }
}

function openWritingModalFromWordModal() {
  if (!currentWordModalWord) return;
  const word = currentWordModalWord;
  closeWordModal();
  openWritingModal(word.title, word.pinyin, (word.hanviet ? `[${word.hanviet}] ` : '') + word.meaning);
}

async function openEtymologyFromWordModal() {
  if (!currentWordModalWord) return;
  const word = currentWordModalWord.title;
  closeWordModal();
  await switchTab('etymology');
  selectOrDecomposeEtymology(word);
}

function updateWordModalBookmarkState() {
  if (!currentWordModalWord) return;
  const isSaved = typeof isWordSaved === 'function' ? isWordSaved(currentWordModalWord.title) : false;
  const btn = document.getElementById('modalBookmarkBtn');
  const label = document.getElementById('modalBookmarkLabel');
  if (btn && label) {
    if (isSaved) {
      btn.className = 'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white border border-amber-600 transition-all cursor-pointer shadow-2xs';
      label.innerText = 'Đã Lưu Sổ Tay ⭐';
    } else {
      btn.className = 'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer shadow-2xs';
      label.innerText = 'Lưu Sổ Tay';
    }
  }
}

function toggleSaveWordFromModal() {
  if (!currentWordModalWord) return;
  const w = currentWordModalWord;
  if (typeof toggleSaveWord === 'function') {
    toggleSaveWord(w.title, w.pinyin, w.meaning, w.level || 1);
  }
  updateWordModalBookmarkState();
}

// ---------------- TOKEN LOOKUP MODAL (REUSE WORDMODAL) ----------------
async function openWordModalWithToken(hanzi, pinyin, vi) {
  if (!hanzi) return;
  await openWordModalByTitle(hanzi);
}

// ---------------- FLOATING WORD QUICK LOOKUP (GLOBAL TAP & SELECTION) ----------------
function hideFloatingWordLookup() {
  const pill = document.getElementById('floatingWordLookupBtn');
  if (pill) pill.classList.add('hidden');
  floatingLookupTargetWord = '';
  if (typeof window !== 'undefined') window.floatingLookupTargetWord = '';
}

async function handleFloatingWordLookupClick() {
  const target = (typeof window !== 'undefined' && window.floatingLookupTargetWord) ? window.floatingLookupTargetWord : floatingLookupTargetWord;
  if (target) {
    const wordToLookup = target;
    hideFloatingWordLookup();
    await openWordModalByTitle(wordToLookup);
  }
}

function initGlobalWordTapListener() {
  const checkSelection = (e) => {
    // If clicking directly on the floating pill or inside word modal, ignore
    if (e && e.target && (e.target.closest('#floatingWordLookupBtn') || e.target.closest('#wordModal'))) {
      return;
    }

    const selection = window.getSelection ? window.getSelection() : null;
    if (!selection || selection.isCollapsed) {
      if (floatingLookupHideTimeout) clearTimeout(floatingLookupHideTimeout);
      floatingLookupHideTimeout = setTimeout(hideFloatingWordLookup, 200);
      return;
    }

    const text = selection.toString().trim();
    // Match 1 to 6 Chinese characters
    const hanziMatch = text.match(/[\u4e00-\u9fa5]{1,6}/);
    if (!hanziMatch) {
      hideFloatingWordLookup();
      return;
    }

    const hanziWord = hanziMatch[0];
    floatingLookupTargetWord = hanziWord;

    const pill = document.getElementById('floatingWordLookupBtn');
    const label = document.getElementById('floatingLookupWordText');
    if (!pill || !label) return;

    label.innerText = `Tra từ: ${hanziWord}`;

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pill.style.left = `${Math.max(60, Math.min(window.innerWidth - 60, rect.left + rect.width / 2))}px`;
        pill.style.top = `${Math.max(20, rect.top + window.scrollY - 8)}px`;
        pill.classList.remove('hidden');
        if (floatingLookupHideTimeout) clearTimeout(floatingLookupHideTimeout);
      }
    } catch (_) {
      hideFloatingWordLookup();
    }
  };

  document.addEventListener('mouseup', checkSelection);
  document.addEventListener('touchend', checkSelection);

  // Click on any element containing Chinese text with dict-trigger attributes or classes
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;

    // Check data-hanzi or data-word
    const hanziAttr = target.getAttribute('data-hanzi') || target.getAttribute('data-word');
    if (hanziAttr && /[\u4e00-\u9fa5]/.test(hanziAttr)) {
      e.stopPropagation();
      openWordModalByTitle(hanziAttr);
      return;
    }

    // Check specific class tokens
    if (target.classList.contains('hanzi-token') || target.classList.contains('dict-clickable') || target.classList.contains('word-token')) {
      const tokenText = target.innerText.trim();
      const m = tokenText.match(/[\u4e00-\u9fa5]+/);
      if (m) {
        e.stopPropagation();
        openWordModalByTitle(m[0]);
      }
    }
  });
}

// Auto-initialize global tap listener
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalWordTapListener);
  } else {
    initGlobalWordTapListener();
  }
}
