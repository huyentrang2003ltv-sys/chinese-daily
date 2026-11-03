// Module state
let activeReadingId = 'reading_01';
let showReadingTranslation = true;
let showReadingPinyin = true;
let activeReadingCategory = 'all';
let activeReadingLevel = 'all';
let readingSearchQuery = '';
let readingFontSize = 20; // font size in px
let readingQuizAnswers = {};
let tocModalFilterLevel = 'all';
let tocModalSearchQuery = '';

// =========================================================================
// 4. THƯ VIỆN ĐỌC HIỂU SONG NGỮ TƯƠNG TÁC (READINGS) - 50 BÀI MASTER
// =========================================================================
function initReadingsModule() {
  if (!readingsData || readingsData.length === 0) return;

  // Set font size CSS variable
  document.documentElement.style.setProperty('--reading-font-size', `${readingFontSize}px`);
  const fontBadge = document.getElementById('readingFontSizeBadge');
  if (fontBadge) fontBadge.innerText = `${readingFontSize}px`;

  // Verify activeReadingId
  if (!readingsData.some(s => s.id === activeReadingId || s.oldId === activeReadingId)) {
    activeReadingId = readingsData[0].id;
  }

  setupReadingSearch();
  renderReadingStoryPills();
  renderReadings();
}

function setupReadingSearch() {
  const searchInput = document.getElementById('readingSearchInput');
  if (searchInput && !searchInput.dataset.initialized) {
    searchInput.dataset.initialized = 'true';
    searchInput.addEventListener('input', (e) => {
      readingSearchQuery = (e.target.value || '').trim().toLowerCase();
      renderReadingStoryPills();
    });
  }
}

function filterReadingLevel(lvl) {
  activeReadingLevel = lvl;
  const lvls = ['all', 'hsk1-2', 'hsk3-4', 'hsk5-6'];
  lvls.forEach(l => {
    const el = document.getElementById(`btn-readlvl-${l}`);
    if (!el) return;
    if (l === lvl) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap cursor-pointer';
    }
  });

  // If active reading is not in current filter, auto select first match
  const filtered = getFilteredReadings();
  if (filtered.length > 0 && !filtered.some(s => s.id === activeReadingId || s.oldId === activeReadingId)) {
    activeReadingId = filtered[0].id;
  }

  renderReadingStoryPills();
  renderReadings();
}

function filterReadingCategory(cat) {
  activeReadingCategory = cat;
  const cats = ['all', 'life', 'inspiration', 'culture', 'news', 'philosophy'];
  cats.forEach(c => {
    const el = document.getElementById(`btn-readcat-${c}`);
    if (!el) return;
    if (c === cat) {
      el.className = 'px-3 py-1 text-2xs font-bold rounded-lg bg-stone-800 text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1 text-2xs font-bold rounded-lg bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap cursor-pointer';
    }
  });

  // If active reading is not in current category, auto select first match
  const filtered = getFilteredReadings();
  if (filtered.length > 0 && !filtered.some(s => s.id === activeReadingId || s.oldId === activeReadingId)) {
    activeReadingId = filtered[0].id;
  }

  renderReadingStoryPills();
  renderReadings();
}

function getFilteredReadings() {
  if (!readingsData) return [];
  return readingsData.filter(story => {
    // 1. Level Filter
    if (activeReadingLevel !== 'all') {
      const lvl = (story.level || '').toLowerCase();
      if (activeReadingLevel === 'hsk1-2') {
        const isMatch = lvl.includes('hsk 1') || lvl.includes('hsk 2');
        if (!isMatch) return false;
      } else if (activeReadingLevel === 'hsk3-4') {
        const isMatch = lvl.includes('hsk 3') || lvl.includes('hsk 4');
        if (!isMatch) return false;
      } else if (activeReadingLevel === 'hsk5-6') {
        const isMatch = lvl.includes('hsk 5') || lvl.includes('hsk 6');
        if (!isMatch) return false;
      }
    }

    // 2. Category Filter
    if (activeReadingCategory !== 'all' && story.category !== activeReadingCategory) {
      return false;
    }

    // 3. Search Query
    if (readingSearchQuery) {
      const target = `${story.id} ${story.title} ${story.pinyin} ${story.hanviet} ${story.summary} ${story.source || ''} ${story.level || ''} ${story.categoryName || ''}`.toLowerCase();
      return target.includes(readingSearchQuery);
    }
    return true;
  });
}

function renderReadingStoryPills() {
  const container = document.getElementById('readingStoryPills');
  if (!container) return;

  const stories = getFilteredReadings();

  if (stories.length === 0) {
    container.innerHTML = `
      <div class="py-2 text-xs text-stone-500 italic flex items-center gap-2">
        <i data-lucide="search-x" class="w-4 h-4 text-stone-400"></i>
        <span>Không tìm thấy bài đọc nào phù hợp với bộ lọc hiện tại.</span>
        <button onclick="activeReadingLevel='all'; activeReadingCategory='all'; readingSearchQuery=''; filterReadingLevel('all'); filterReadingCategory('all');" class="text-xs font-bold text-[#8B1E1E] underline ml-2 cursor-pointer">
          Xóa Bộ Lọc
        </button>
      </div>
    `;
    refreshIcons();
    return;
  }

  container.innerHTML = stories.map((story) => {
    const isActive = story.id === activeReadingId || story.oldId === activeReadingId;
    const globalIdx = readingsData.findIndex(s => s.id === story.id) + 1;
    let icon = '📖';
    if (story.category === 'life') icon = '🏡';
    else if (story.category === 'inspiration') icon = '🎙️';
    else if (story.category === 'news') icon = '📰';
    else if (story.category === 'culture') icon = '📜';
    else if (story.category === 'philosophy') icon = '☯️';

    return `
      <button 
        type="button"
        onclick="selectReading(${jsArg(story.id)})"
        class="px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
          isActive 
            ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-md ring-1 ring-amber-300/60 scale-102' 
            : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200/90 shadow-2xs'
        }">
        <span class="text-xs opacity-75 font-mono">#${String(globalIdx).padStart(2, '0')}</span>
        <span class="text-sm">${icon}</span>
        <span class="px-1.5 py-0.5 rounded text-[10px] font-mono ${
          isActive ? 'bg-black/25 text-amber-200' : 'bg-amber-100/80 text-amber-900 font-bold'
        }">
          ${story.level}
        </span>
        <span class="font-hanzi font-bold">${story.title}</span>
      </button>
    `;
  }).join('');
}

function selectReading(id) {
  activeReadingId = id;
  renderReadingStoryPills();
  renderReadings();

  // Smoothly scroll to reading container if user chose from pills or TOC
  const container = document.getElementById('activeReadingContainer');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function goToNextReading() {
  if (!readingsData || readingsData.length === 0) return;
  const currentIdx = readingsData.findIndex(s => s.id === activeReadingId || s.oldId === activeReadingId);
  if (currentIdx >= 0 && currentIdx < readingsData.length - 1) {
    selectReading(readingsData[currentIdx + 1].id);
  } else {
    showToast('Bạn đang ở bài đọc cuối cùng (#50)!');
  }
}

function goToPrevReading() {
  if (!readingsData || readingsData.length === 0) return;
  const currentIdx = readingsData.findIndex(s => s.id === activeReadingId || s.oldId === activeReadingId);
  if (currentIdx > 0) {
    selectReading(readingsData[currentIdx - 1].id);
  } else {
    showToast('Bạn đang ở bài đọc đầu tiên (#01)!');
  }
}

function adjustReadingFontSize(delta) {
  readingFontSize = Math.min(32, Math.max(14, readingFontSize + delta));
  document.documentElement.style.setProperty('--reading-font-size', `${readingFontSize}px`);
  const fontBadge = document.getElementById('readingFontSizeBadge');
  if (fontBadge) fontBadge.innerText = `${readingFontSize}px`;
}

// =========================================================================
// TABLE OF CONTENTS (MỤC LỤC 50 BÀI) MODAL HANDLERS
// =========================================================================
function openReadingTocModal() {
  openModal('readingTocModal');
  renderReadingTocList();
  refreshIcons();
}

function closeReadingTocModal() {
  closeModal('readingTocModal');
}
registerModal('readingTocModal', closeReadingTocModal);

function filterTocModalLevel(lvl) {
  tocModalFilterLevel = lvl;
  const lvls = ['all', 'hsk1-2', 'hsk3-4', 'hsk5-6'];
  lvls.forEach(l => {
    const el = document.getElementById(`btn-toc-${l}`);
    if (!el) return;
    if (l === lvl) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-100 text-stone-700 border border-stone-200 whitespace-nowrap cursor-pointer';
    }
  });
  renderReadingTocList();
}

function handleReadingTocSearch(q) {
  tocModalSearchQuery = (q || '').trim().toLowerCase();
  renderReadingTocList();
}

function renderReadingTocList() {
  const container = document.getElementById('readingTocListContainer');
  if (!container || !readingsData) return;

  const filtered = readingsData.filter((story, idx) => {
    // Level filter
    if (tocModalFilterLevel !== 'all') {
      const lvl = (story.level || '').toLowerCase();
      if (tocModalFilterLevel === 'hsk1-2' && !lvl.includes('hsk 1') && !lvl.includes('hsk 2')) return false;
      if (tocModalFilterLevel === 'hsk3-4' && !lvl.includes('hsk 3') && !lvl.includes('hsk 4')) return false;
      if (tocModalFilterLevel === 'hsk5-6' && !lvl.includes('hsk 5') && !lvl.includes('hsk 6')) return false;
    }

    // Search query
    if (tocModalSearchQuery) {
      const numStr = `bài ${idx + 1} #${idx + 1} ${idx + 1}`;
      const target = `${numStr} ${story.title} ${story.pinyin} ${story.hanviet} ${story.summary} ${story.categoryName}`.toLowerCase();
      return target.includes(tocModalSearchQuery);
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-xs text-stone-500 italic">
        Không tìm thấy bài đọc nào phù hợp với từ khóa "${escapeHtml(tocModalSearchQuery)}".
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(story => {
    const globalIdx = readingsData.findIndex(s => s.id === story.id) + 1;
    const isCurrent = story.id === activeReadingId || story.oldId === activeReadingId;

    let icon = '📖';
    if (story.category === 'life') icon = '🏡';
    else if (story.category === 'inspiration') icon = '🎙️';
    else if (story.category === 'news') icon = '📰';
    else if (story.category === 'culture') icon = '📜';
    else if (story.category === 'philosophy') icon = '☯️';

    return `
      <div 
        onclick="selectReading(${jsArg(story.id)}); closeReadingTocModal();"
        class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          isCurrent 
            ? 'bg-amber-100/80 border-[#8B1E1E] ring-1 ring-[#8B1E1E]/40 shadow-xs' 
            : 'bg-white hover:bg-amber-50/70 border-stone-200/90 shadow-2xs hover:border-amber-300'
        }"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
            isCurrent ? 'bg-[#8B1E1E] text-white shadow-2xs' : 'bg-stone-100 text-stone-600'
          }">
            #${String(globalIdx).padStart(2, '0')}
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-0.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-black ${
                story.level.includes('HSK 1') || story.level.includes('HSK 2') ? 'bg-emerald-100 text-[#1E4D43]' :
                story.level.includes('HSK 3') || story.level.includes('HSK 4') ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-[#8B1E1E]'
              }">
                ${story.level}
              </span>
              <span class="text-2xs text-stone-500 font-semibold flex items-center gap-1">
                <span>${icon}</span>
                <span>${story.categoryName}</span>
              </span>
            </div>
            <h4 class="font-hanzi text-base font-bold text-stone-900 leading-tight">
              ${story.title}
            </h4>
            <p class="text-2xs font-semibold text-[#8B1E1E] mt-0.5">
              ${story.pinyin} <span class="font-normal text-stone-500">(${story.hanviet})</span>
            </p>
          </div>
        </div>

        <div class="shrink-0 flex items-center gap-2">
          ${isCurrent ? `
            <span class="px-2.5 py-1 rounded-full text-2xs font-black bg-[#8B1E1E] text-white shadow-2xs">
              Đang Đọc
            </span>
          ` : `
            <span class="w-8 h-8 rounded-full bg-stone-50 hover:bg-amber-100 flex items-center justify-center text-stone-400 group-hover:text-stone-700">
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </span>
          `}
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
}

function toggleReadingTranslation() {
  showReadingTranslation = !showReadingTranslation;
  const label = document.getElementById('label-toggle-reading-trans');
  if (label) {
    label.innerText = showReadingTranslation ? 'Ẩn Bản Dịch' : 'Hiện Bản Dịch';
  }
  renderReadings();
}

function toggleReadingPinyin() {
  showReadingPinyin = !showReadingPinyin;
  const label = document.getElementById('label-toggle-reading-pinyin');
  if (label) {
    label.innerText = showReadingPinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin';
  }
  renderReadings();
}

function handleReadingQuizAnswer(storyId, optIdx) {
  readingQuizAnswers[storyId] = optIdx;
  renderReadings();
}

function renderReadings() {
  const container = document.getElementById('activeReadingContainer');
  if (!container) return;

  const story = readingsData.find(s => s.id === activeReadingId || s.oldId === activeReadingId) || readingsData[0];
  if (!story) return;

  const currentIdx = readingsData.findIndex(s => s.id === story.id);
  const totalStories = readingsData.length;
  const prevStory = currentIdx > 0 ? readingsData[currentIdx - 1] : null;
  const nextStory = currentIdx < totalStories - 1 ? readingsData[currentIdx + 1] : null;

  // Source Badge Styling
  let sourceBadge = '';
  if (story.source && story.source.includes('YouTube')) {
    sourceBadge = `
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-red-100/80 text-[#8B1E1E] border border-red-300 flex items-center gap-1.5 shadow-2xs">
        <i data-lucide="radio" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
        <span>Nguồn: ${story.source}</span>
      </span>
    `;
  } else if (story.source && (story.source.includes('Tân Hoa Xã') || story.source.includes('Nhân Dân') || story.source.includes('China Daily') || story.source.includes('CCTV') || story.source.includes('Báo Chí'))) {
    sourceBadge = `
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-[#1E4D43] border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
        <i data-lucide="newspaper" class="w-3.5 h-3.5 text-[#1E4D43]"></i>
        <span>Báo Chí Chính Thống: ${story.source}</span>
      </span>
    `;
  } else {
    sourceBadge = `
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100/80 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
        <i data-lucide="scroll" class="w-3.5 h-3.5 text-[#C59A3F]"></i>
        <span>${story.source || story.categoryName}</span>
      </span>
    `;
  }

  container.innerHTML = `
    <div class="glass-card rounded-3xl p-6 lg:p-8 border border-amber-200/90 space-y-6 bg-[#FFFDF9] shadow-sm">
      
      <!-- TOP NAVIGATION BAR (Bài Trước / Mục Lục / Bài Kế Tiếp) -->
      <div class="flex items-center justify-between gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
        <!-- Prev Button -->
        <button 
          type="button"
          onclick="goToPrevReading()" 
          ${prevStory ? '' : 'disabled'}
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            prevStory 
              ? 'bg-white hover:bg-amber-100 text-stone-800 border border-stone-200 shadow-2xs' 
              : 'bg-stone-100 text-stone-400 border border-stone-200 opacity-50 cursor-not-allowed'
          }"
          title="${prevStory ? `Bài trước: ${prevStory.title}` : 'Đã ở bài đầu tiên'}"
        >
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
          <span class="hidden sm:inline">Bài Trước</span>
        </button>

        <!-- Current Story Indicator & TOC Button -->
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-xl bg-[#8B1E1E] text-white text-xs font-black shadow-2xs font-mono">
            Bài ${String(currentIdx + 1).padStart(2, '0')} / ${totalStories}
          </span>
          <button 
            type="button"
            onclick="openReadingTocModal()"
            class="px-3 py-1 rounded-xl bg-white hover:bg-amber-100 text-stone-700 border border-stone-200 text-xs font-bold shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <i data-lucide="list" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
            <span class="hidden md:inline">Mục Lục 50 Bài</span>
          </button>
        </div>

        <!-- Next Button -->
        <button 
          type="button"
          onclick="goToNextReading()" 
          ${nextStory ? '' : 'disabled'}
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            nextStory 
              ? 'bg-white hover:bg-amber-100 text-stone-800 border border-stone-200 shadow-2xs' 
              : 'bg-stone-100 text-stone-400 border border-stone-200 opacity-50 cursor-not-allowed'
          }"
          title="${nextStory ? `Bài tiếp theo: ${nextStory.title}` : 'Đã ở bài cuối cùng'}"
        >
          <span class="hidden sm:inline">Bài Kế Tiếp</span>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Article Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200/80">
        <div>
          <!-- Badges Bar -->
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs">
              ${story.level}
            </span>
            ${sourceBadge}
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              ${story.categoryName}
            </span>
          </div>

          <!-- Title with Dual TTS -->
          <div class="flex items-center gap-3 flex-wrap">
            <h3 class="font-hanzi text-3xl lg:text-4xl font-black text-stone-900 tracking-wide">${story.title}</h3>
            <div class="flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
              <button 
                type="button"
                onclick="playChineseTTS(${jsArg(story.title)}, 'female')" 
                class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all shadow-2xs cursor-pointer" 
                title="Nghe tiêu đề (Giọng Nữ)"
              >
                👩 Nữ
              </button>
              <button 
                type="button"
                onclick="playChineseTTS(${jsArg(story.title)}, 'male')" 
                class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-all shadow-2xs cursor-pointer" 
                title="Nghe tiêu đề (Giọng Nam)"
              >
                👨 Nam
              </button>
            </div>
          </div>
          <p class="text-sm font-bold text-[#8B1E1E] mt-1.5">
            ${story.pinyin} <span class="font-normal text-stone-500">(${story.hanviet})</span>
          </p>
          <p class="text-xs lg:text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">${story.summary}</p>
        </div>

        <div class="flex items-center gap-1.5 shrink-0 bg-stone-100/90 p-1 rounded-2xl border border-stone-200 shadow-2xs">
          <button 
            type="button"
            onclick="playAllReadingParagraphs('female')" 
            class="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-900 border border-rose-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Nghe toàn bộ bài đọc bằng giọng Nữ (Xiaoxiao)"
          >
            <i data-lucide="play" class="w-3.5 h-3.5 text-rose-600"></i>
            <span>👩 Nghe Nữ</span>
          </button>
          <button 
            type="button"
            onclick="playAllReadingParagraphs('male')" 
            class="px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Nghe toàn bộ bài đọc bằng giọng Nam (Yunxi)"
          >
            <i data-lucide="play" class="w-3.5 h-3.5 text-blue-600"></i>
            <span>👨 Nghe Nam</span>
          </button>
        </div>
      </div>

      <!-- Key Vocabulary Box -->
      ${story.vocab && story.vocab.length > 0 ? `
        <div class="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/90 shadow-2xs">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#8B1E1E] flex items-center gap-2">
              <i data-lucide="sparkles" class="w-4 h-4 text-[#C59A3F]"></i>
              <span>Từ Vựng Trọng Tâm Bài Đọc (核心生词)</span>
            </h4>
            <span class="text-2xs text-stone-500 italic">Chạm thẻ từ để tra cứu hoặc nghe phát âm</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            ${story.vocab.map(v => `
              <div 
                onclick="openWordModalWithToken(${jsArg(v.hanzi)}, ${jsArg(v.pinyin)}, ${jsArg(v.vi)})" 
                class="p-2.5 rounded-xl bg-white border border-amber-200/80 hover:border-[#8B1E1E] hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div class="flex items-center justify-between">
                    <p class="font-hanzi text-base font-bold text-stone-900 leading-tight">${v.hanzi}</p>
                    <div class="flex items-center gap-0.5" onclick="event.stopPropagation()">
                      <button 
                        type="button" 
                        onclick="playChineseTTS(${jsArg(v.hanzi)}, 'female')" 
                        class="px-1 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 text-[9px] font-bold cursor-pointer"
                        title="Giọng Nữ"
                      >👩</button>
                      <button 
                        type="button" 
                        onclick="playChineseTTS(${jsArg(v.hanzi)}, 'male')" 
                        class="px-1 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 text-[9px] font-bold cursor-pointer"
                        title="Giọng Nam"
                      >👨</button>
                    </div>
                  </div>
                  <p class="text-2xs font-semibold text-[#8B1E1E] mt-0.5">${v.pinyin}</p>
                </div>
                <p class="text-2xs text-stone-600 mt-1 truncate" title="${v.vi}">${v.vi}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Reading Tip Banner -->
      <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-center gap-2.5 shadow-2xs">
        <i data-lucide="info" class="w-4 h-4 text-[#C59A3F] shrink-0"></i>
        <span>💡 <strong>Mẹo luyện đọc tương tác:</strong> Chạm hoặc bấm chuột vào bất kỳ chữ/từ nào trong đoạn văn để tra cứu phiên âm, nghĩa tiếng Việt và luyện nghe phát âm chuẩn xác! Bạn có thể dùng nút <strong>A- / A+</strong> phía trên để tăng giảm cỡ chữ chữ Hán.</span>
      </div>

      <!-- Paragraphs Stream -->
      <div class="space-y-6 pt-2">
        ${story.paragraphs.map((p, pIdx) => `
          <div class="p-5 rounded-2xl bg-white border border-amber-200/80 space-y-3 hover:border-[#C59A3F] hover:shadow-xs transition-all">
            <!-- Paragraph Index & Audio -->
            <div class="flex items-center justify-between text-xs text-stone-400">
              <span class="font-bold text-[#8B1E1E]">Đoạn ${pIdx + 1}</span>
              <div class="flex items-center gap-1 bg-amber-50/70 p-0.5 rounded-xl border border-amber-200/80 shadow-2xs">
                <button 
                  type="button"
                  onclick="playChineseTTS(${jsArg(p.chineseText)}, 'female')" 
                  class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-2xs font-bold transition-colors shadow-2xs cursor-pointer" 
                  title="Nghe đoạn này bằng giọng Nữ (Xiaoxiao)"
                >
                  <i data-lucide="volume-2" class="w-3 h-3 text-rose-600"></i>
                  <span>👩 Nữ</span>
                </button>
                <button 
                  type="button"
                  onclick="playChineseTTS(${jsArg(p.chineseText)}, 'male')" 
                  class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-2xs font-bold transition-colors shadow-2xs cursor-pointer" 
                  title="Nghe đoạn này bằng giọng Nam (Yunxi)"
                >
                  <i data-lucide="volume-2" class="w-3 h-3 text-blue-600"></i>
                  <span>👨 Nam</span>
                </button>
              </div>
            </div>

            <!-- Chinese Tokens Stream with Pinyin -->
            <div class="flex flex-wrap items-end leading-loose">
              ${p.tokens.map(token => {
                const isPunct = !token.pinyin && !token.vi;
                if (isPunct) {
                  return `<span class="reading-token-punct">${token.hanzi}</span>`;
                }
                return `
                  <div 
                    onclick="openWordModalWithToken(${jsArg(token.hanzi)}, ${jsArg(token.pinyin)}, ${jsArg(token.vi)})" 
                    class="reading-token-chip ${showReadingPinyin ? '' : 'hide-pinyin'}"
                    title="Bấm để tra cứu: ${token.hanzi} (${token.pinyin}): ${token.vi}">
                    <span class="token-pinyin">${token.pinyin}</span>
                    <span class="token-hanzi">${token.hanzi}</span>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Vietnamese Translation -->
            ${showReadingTranslation ? `
              <div class="pt-3 border-t border-amber-100 text-xs lg:text-sm text-stone-700 leading-relaxed font-sans">
                <strong class="text-[#8B1E1E]">Dịch nghĩa:</strong> ${p.vietnameseText}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Moral Lesson / Practical Takeaway Card -->
      ${story.moral ? `
        <div class="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/90 space-y-2 mt-6 shadow-2xs">
          <div class="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <i data-lucide="award" class="w-4 h-4 text-amber-600"></i>
            <span>Đúc Kết Nhân Sinh & Giá Trị Thực Tiễn:</span>
          </div>
          <p class="text-xs lg:text-sm text-stone-800 leading-relaxed pl-6">
            ${story.moral}
          </p>
        </div>
      ` : ''}

      <!-- Reading Comprehension Quiz -->
      ${story.quiz ? `
        <div class="p-6 rounded-3xl bg-gradient-to-r from-amber-50/60 via-stone-50/50 to-amber-50/30 border border-amber-300/80 space-y-4 shadow-xs mt-6">
          <div class="flex items-center gap-2 text-stone-900 font-bold text-sm border-b border-amber-200/80 pb-3">
            <i data-lucide="help-circle" class="w-5 h-5 text-[#8B1E1E]"></i>
            <span>Trắc Nghiệm Đọc Hiểu (阅读理解测评)</span>
          </div>
          <p class="text-xs lg:text-sm font-bold text-stone-800 leading-relaxed">
            ${story.quiz.question}
          </p>
          <div class="space-y-2">
            ${story.quiz.options.map((opt, optIdx) => {
              const userAns = readingQuizAnswers[story.id];
              const hasAnswered = userAns !== undefined;
              const isSelected = userAns === optIdx;
              const isCorrect = optIdx === story.quiz.answer;
              
              let btnClass = 'p-3 rounded-2xl border text-xs text-left w-full transition-all flex items-start gap-2.5 ';
              if (!hasAnswered) {
                btnClass += 'bg-white hover:bg-amber-100/60 border-stone-200 text-stone-800 cursor-pointer shadow-2xs';
              } else if (isCorrect) {
                btnClass += 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs';
              } else if (isSelected && !isCorrect) {
                btnClass += 'bg-rose-50 border-rose-400 text-rose-950';
              } else {
                btnClass += 'bg-white/60 border-stone-200 text-stone-400 opacity-60';
              }

              return `
                <button 
                  type="button" 
                  onclick="handleReadingQuizAnswer(${jsArg(story.id)}, ${optIdx})" 
                  class="${btnClass}"
                  ${hasAnswered ? 'disabled' : ''}
                >
                  <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-2xs font-bold ${
                    hasAnswered && isCorrect ? 'bg-emerald-600 text-white' : 
                    hasAnswered && isSelected && !isCorrect ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-600'
                  }">
                    ${String.fromCharCode(65 + optIdx)}
                  </span>
                  <span class="leading-relaxed">${opt}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${readingQuizAnswers[story.id] !== undefined ? `
            <div class="p-3.5 rounded-2xl ${
              readingQuizAnswers[story.id] === story.quiz.answer 
                ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' 
                : 'bg-amber-50 text-amber-950 border border-amber-200'
            } text-xs leading-relaxed">
              <p class="font-bold flex items-center gap-1.5 mb-1 text-sm ${
                readingQuizAnswers[story.id] === story.quiz.answer ? 'text-[#1E4D43]' : 'text-amber-900'
              }">
                <i data-lucide="${readingQuizAnswers[story.id] === story.quiz.answer ? 'check-circle' : 'info'}" class="w-4 h-4"></i>
                <span>${readingQuizAnswers[story.id] === story.quiz.answer ? 'Chúc mừng! Bạn đã trả lời chính xác!' : 'Giải thích chi tiết:'}</span>
              </p>
              <p class="pl-5 text-stone-700">${story.quiz.explanation}</p>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- BOTTOM NAVIGATION BAR -->
      <div class="flex items-center justify-between gap-3 pt-6 border-t border-amber-200/80">
        <!-- Prev Button -->
        <button 
          type="button"
          onclick="goToPrevReading()" 
          ${prevStory ? '' : 'disabled'}
          class="px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            prevStory 
              ? 'bg-white hover:bg-amber-100 text-stone-800 border border-stone-200 shadow-2xs' 
              : 'bg-stone-100 text-stone-400 border border-stone-200 opacity-50 cursor-not-allowed'
          }"
        >
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
          <span>${prevStory ? `Bài Trước (#${String(currentIdx).padStart(2, '0')})` : 'Bài Trước'}</span>
        </button>

        <button 
          type="button"
          onclick="openReadingTocModal()"
          class="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-[#8B1E1E] border border-amber-200 text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
        >
          <i data-lucide="book-open" class="w-4 h-4"></i>
          <span>📚 Mục Lục 50 Bài</span>
        </button>

        <!-- Next Button -->
        <button 
          type="button"
          onclick="goToNextReading()" 
          ${nextStory ? '' : 'disabled'}
          class="px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            nextStory 
              ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white shadow-md' 
              : 'bg-stone-100 text-stone-400 border border-stone-200 opacity-50 cursor-not-allowed'
          }"
        >
          <span>${nextStory ? `Bài Kế Tiếp (#${String(currentIdx + 2).padStart(2, '0')})` : 'Bài Kế Tiếp'}</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>

    </div>
  `;

  refreshIcons();
}

function playAllReadingParagraphs(gender = 'female') {
  const story = readingsData.find(s => s.id === activeReadingId || s.oldId === activeReadingId);
  if (!story) return;
  const fullText = story.paragraphs.map(p => p.chineseText).join(' ');
  playChineseTTS(fullText, gender);
}
