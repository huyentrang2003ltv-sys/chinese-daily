// =========================================================================
// Cẩm Nang Mở Rộng Từ Vựng Tiếng Trung (汉语词汇扩展指南)
// Sơ Đồ Tư Duy Mở Rộng Từ Vựng (Radial Mindmap & Word Tree Formation)
// Dựa trên phương pháp sách: Văn Hi / Diệu Hồ (Học viện Ngân Hàng / NXB Thanh Niên)
// =========================================================================

let vocabExpActiveRootId = 'root_bu';
let vocabExpCategory = 'all';
let vocabExpViewMode = 'mindmap'; // 'mindmap' | 'grid'
let vocabExpSearchQuery = '';
let vocabExpActiveCompoundWord = null;

const VOCAB_EXP_CATEGORIES = {
  all: { label: 'Tất cả gốc từ', icon: 'layers' },
  verb: { label: 'Hành động / Động từ', icon: 'zap' },
  noun: { label: 'Thực thể / Danh từ', icon: 'box' },
  adj: { label: 'Tính chất / Trạng thái', icon: 'sparkles' },
  aux: { label: 'Phủ định / Phó từ / Tự thân', icon: 'compass' }
};

/** Ensure vocab expansion dataset is loaded */
async function ensureVocabExpansionData() {
  if (Array.isArray(vocabExpansionData) && vocabExpansionData.length > 0) {
    return true;
  }
  try {
    if (typeof loadData === 'function') {
      await loadData('vocabExpansion');
      return Array.isArray(vocabExpansionData) && vocabExpansionData.length > 0;
    }
    const res = await fetch('data/vocab_expansion.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    vocabExpansionData = await res.json();
    return true;
  } catch (err) {
    console.error('Không thể tải cẩm nang mở rộng từ vựng:', err);
    return false;
  }
}

/** Initialize Vocabulary Expansion Section */
async function initVocabExpansion() {
  const container = document.getElementById('dictSectionExpansion');
  if (!container) return;

  const ok = await ensureVocabExpansionData();
  if (!ok || !vocabExpansionData || !vocabExpansionData.length) {
    const rootEl = document.getElementById('vocabExpContentArea');
    if (rootEl) {
      rootEl.innerHTML = `
        <div class="glass-card rounded-2xl p-8 text-center space-y-3 bg-white dark:bg-stone-900 border border-amber-200">
          <i data-lucide="alert-circle" class="w-10 h-10 text-amber-600 mx-auto"></i>
          <p class="font-bold text-stone-800 dark:text-stone-200">Đang chuẩn bị dữ liệu cẩm nang mở rộng từ vựng...</p>
          <button onclick="initVocabExpansion()" class="px-4 py-2 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold cursor-pointer hover:opacity-90">
            Thử tải lại
          </button>
        </div>
      `;
      if (typeof refreshIcons === 'function') refreshIcons();
    }
    return;
  }

  // Ensure active root is valid
  if (!vocabExpansionData.some(r => r.id === vocabExpActiveRootId)) {
    vocabExpActiveRootId = vocabExpansionData[0].id;
  }

  renderVocabExpCategoryTabs();
  renderVocabExpRootPills();
  renderVocabExpActiveRootView();
  if (typeof refreshIcons === 'function') refreshIcons();
}

/** Filter by category */
function filterVocabExpCategory(cat) {
  vocabExpCategory = cat;
  vocabExpSearchQuery = '';
  const searchInput = document.getElementById('vocabExpSearchInput');
  if (searchInput) searchInput.value = '';

  const filteredRoots = getFilteredVocabExpRoots();
  if (filteredRoots.length > 0 && !filteredRoots.some(r => r.id === vocabExpActiveRootId)) {
    vocabExpActiveRootId = filteredRoots[0].id;
  }

  renderVocabExpCategoryTabs();
  renderVocabExpRootPills();
  renderVocabExpActiveRootView();
  if (typeof refreshIcons === 'function') refreshIcons();
}

/** Get filtered roots based on category and search query */
function getFilteredVocabExpRoots() {
  if (!Array.isArray(vocabExpansionData)) return [];
  const q = (vocabExpSearchQuery || '').trim().toLowerCase();

  return vocabExpansionData.filter(root => {
    // Category match
    if (vocabExpCategory === 'verb' && root.category !== 'action') return false;
    if (vocabExpCategory === 'noun' && root.category !== 'entity') return false;
    if (vocabExpCategory === 'adj' && root.category !== 'modifier') return false;
    if (vocabExpCategory === 'aux' && root.category !== 'auxiliary') return false;

    // Search query match
    if (!q) return true;
    const matchRoot = (root.char || '').toLowerCase().includes(q) ||
                      (root.pinyin || '').toLowerCase().includes(q) ||
                      (root.hanviet || '').toLowerCase().includes(q) ||
                      (root.meaning || '').toLowerCase().includes(q);
    if (matchRoot) return true;

    // Check compounds
    return (root.compounds || []).some(c => 
      (c.word || '').toLowerCase().includes(q) ||
      (c.pinyin || '').toLowerCase().includes(q) ||
      (c.hanviet || '').toLowerCase().includes(q) ||
      (c.meaning || '').toLowerCase().includes(q) ||
      (c.example && (
        (c.example.zh || '').toLowerCase().includes(q) ||
        (c.example.vi || '').toLowerCase().includes(q)
      ))
    );
  });
}

/** Render Category Tabs */
function renderVocabExpCategoryTabs() {
  const container = document.getElementById('vocabExpCategoryTabs');
  if (!container) return;

  const categories = Object.keys(VOCAB_EXP_CATEGORIES);
  container.innerHTML = categories.map(catKey => {
    const isAct = vocabExpCategory === catKey;
    const item = VOCAB_EXP_CATEGORIES[catKey];
    const actClass = isAct 
      ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border-[#8B1E1E]'
      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700';

    return `
      <button 
        type="button" 
        onclick="filterVocabExpCategory('${catKey}')" 
        class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${actClass}">
        <i data-lucide="${item.icon}" class="w-3.5 h-3.5 ${isAct ? 'text-amber-200' : 'text-stone-400'}"></i>
        <span>${escapeHtml(item.label)}</span>
      </button>
    `;
  }).join('');
}

/** Render Root Character Selector Pills */
function renderVocabExpRootPills() {
  const container = document.getElementById('vocabExpRootPills');
  if (!container) return;

  const roots = getFilteredVocabExpRoots();
  if (!roots.length) {
    container.innerHTML = `
      <div class="col-span-full py-4 text-center text-xs text-stone-400 italic">
        Không tìm thấy gốc từ phù hợp với từ khóa tìm kiếm.
      </div>
    `;
    return;
  }

  container.innerHTML = roots.map(r => {
    const isAct = r.id === vocabExpActiveRootId;
    const actClass = isAct
      ? 'bg-gradient-to-br from-[#8B1E1E] via-[#A52A2A] to-[#731818] text-white ring-2 ring-amber-400 shadow-md scale-105 z-10'
      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:border-amber-400 hover:bg-amber-50/60 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 shadow-2xs';

    return `
      <button 
        type="button" 
        onclick="selectVocabExpRoot('${r.id}')" 
        class="p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 min-w-[70px] sm:min-w-[76px] ${actClass}"
        title="${escapeHtml(r.char)} (${escapeHtml(r.hanviet)}): ${escapeHtml(r.meaning)}">
        <span class="font-hanzi text-xl sm:text-2xl font-black ${isAct ? 'text-amber-200' : 'text-[#8B1E1E] dark:text-amber-400'}">
          ${escapeHtml(r.char)}
        </span>
        <span class="text-[11px] font-mono font-bold leading-none ${isAct ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'}">
          ${escapeHtml(r.pinyin)}
        </span>
        <span class="text-[10px] font-black uppercase tracking-tight truncate max-w-[66px] leading-tight ${isAct ? 'text-rose-100' : 'text-stone-400'}">
          ${escapeHtml(r.hanviet)}
        </span>
      </button>
    `;
  }).join('');
}

/** Select active root */
function selectVocabExpRoot(rootId) {
  vocabExpActiveRootId = rootId;
  vocabExpActiveCompoundWord = null;
  renderVocabExpRootPills();
  renderVocabExpActiveRootView();
  if (typeof refreshIcons === 'function') refreshIcons();

  // Smooth scroll to mindmap on mobile
  const mindmapEl = document.getElementById('vocabExpContentArea');
  if (mindmapEl && window.innerWidth < 768) {
    mindmapEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/** Search Vocabulary Expansion */
function handleVocabExpSearch(val) {
  vocabExpSearchQuery = val;
  const filtered = getFilteredVocabExpRoots();
  if (filtered.length > 0 && !filtered.some(r => r.id === vocabExpActiveRootId)) {
    vocabExpActiveRootId = filtered[0].id;
  }
  renderVocabExpRootPills();
  renderVocabExpActiveRootView();
  if (typeof refreshIcons === 'function') refreshIcons();
}

/** Toggle view mode */
function toggleVocabExpViewMode(mode) {
  vocabExpViewMode = mode;
  const btnMindmap = document.getElementById('btnVocabExpViewMindmap');
  const btnGrid = document.getElementById('btnVocabExpViewGrid');

  if (mode === 'mindmap') {
    if (btnMindmap) {
      btnMindmap.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-[#8B1E1E] text-white shadow-xs cursor-pointer flex items-center gap-1.5';
    }
    if (btnGrid) {
      btnGrid.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 border border-stone-200 dark:border-stone-700 cursor-pointer flex items-center gap-1.5';
    }
  } else {
    if (btnGrid) {
      btnGrid.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-[#8B1E1E] text-white shadow-xs cursor-pointer flex items-center gap-1.5';
    }
    if (btnMindmap) {
      btnMindmap.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 border border-stone-200 dark:border-stone-700 cursor-pointer flex items-center gap-1.5';
    }
  }

  renderVocabExpActiveRootView();
  if (typeof refreshIcons === 'function') refreshIcons();
}

/** Render active root view (Mindmap or Grid + Example Cards) */
function renderVocabExpActiveRootView() {
  const container = document.getElementById('vocabExpContentArea');
  if (!container) return;

  const currentRoot = (vocabExpansionData || []).find(r => r.id === vocabExpActiveRootId) || (vocabExpansionData || [])[0];
  if (!currentRoot) {
    container.innerHTML = `
      <div class="glass-card rounded-2xl p-8 text-center text-stone-500">
        Không tìm thấy thông tin gốc từ.
      </div>
    `;
    return;
  }

  if (vocabExpViewMode === 'mindmap') {
    container.innerHTML = `
      ${renderVocabExpRadialMindmapHtml(currentRoot)}
      ${renderVocabExpExamplesHtml(currentRoot)}
    `;
  } else {
    container.innerHTML = `
      ${renderVocabExpGridHtml(currentRoot)}
      ${renderVocabExpExamplesHtml(currentRoot)}
    `;
  }

  if (typeof refreshIcons === 'function') refreshIcons();
}

/** Render Radial Mindmap / Word Tree View */
function renderVocabExpRadialMindmapHtml(root) {
  const compounds = root.compounds || [];
  const leftCompounds = compounds.slice(0, 4);
  const rightCompounds = compounds.slice(4, 8);

  const renderCompoundBranch = (c, side) => {
    const isHighlighted = vocabExpActiveCompoundWord === c.word;
    const highlightRing = isHighlighted ? 'ring-2 ring-[#8B1E1E] bg-amber-50/90 dark:bg-amber-950/40' : 'bg-white/95 dark:bg-[#1C2128]';
    return `
      <div 
        id="node-compound-${escapeHtml(c.word)}"
        onclick="focusVocabExpCompound('${escapeHtml(c.word)}')"
        class="glass-card rounded-2xl p-3.5 border border-amber-200/90 dark:border-stone-700/80 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-[#8B1E1E] ${highlightRing} flex flex-col justify-between">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-hanzi text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 transition-colors">
                ${escapeHtml(c.word)}
              </span>
              <span class="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                ${escapeHtml(c.pinyin)}
              </span>
            </div>
            <div class="text-[11px] font-black uppercase text-rose-700 dark:text-rose-400 tracking-tight">
              ${escapeHtml(c.hanviet)}
            </div>
          </div>
          <button 
            type="button" 
            onclick="event.stopPropagation(); playChineseTTS('${escapeHtml(c.word)}', 'female')" 
            class="p-1.5 rounded-xl bg-amber-100/70 hover:bg-amber-200 dark:bg-stone-800 text-[#8B1E1E] dark:text-amber-300 transition-all cursor-pointer shrink-0" 
            title="Nghe phát âm chuẩn Bắc Kinh">
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
        <p class="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1.5 line-clamp-2">
          ${escapeHtml(c.meaning)}
        </p>
        <div class="flex items-center justify-between pt-2 mt-2 border-t border-amber-100 dark:border-stone-800/80 text-[10px]">
          <span class="px-2 py-0.5 rounded-md font-bold bg-amber-100/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            ${escapeHtml(c.pos)}
          </span>
          <span class="font-semibold text-amber-800 dark:text-amber-400">
            ${escapeHtml(c.structure)}
          </span>
        </div>
      </div>
    `;
  };

  return `
    <div class="glass-card rounded-3xl p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 dark:from-[#161B22] dark:to-[#0D1117] border border-amber-300/70 dark:border-stone-800 shadow-md space-y-6">
      <!-- Title & Mindmap Legend Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200/60 dark:border-stone-800 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center font-bold shadow-sm">
            <i data-lucide="git-fork" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-serif-luxury font-black text-stone-900 dark:text-stone-100">
              Sơ Đồ Tư Duy Mở Rộng: Gốc Hán Tự <span class="text-[#8B1E1E] dark:text-amber-400 font-hanzi text-2xl font-black">【${escapeHtml(root.char)}】</span>
            </h3>
            <p class="text-xs text-stone-500 dark:text-stone-400">
              Xoay quanh gốc <strong class="text-stone-800 dark:text-stone-200 font-hanzi">${escapeHtml(root.char)}</strong> · 4 phương thức cấu từ: Song nghĩa, Chính phụ, Động tân, Phụ gia
            </p>
          </div>
        </div>

        <!-- Word Formation Quick Legend -->
        <div class="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-stone-600 dark:text-stone-400">
          <span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">偏正 Chính phụ</span>
          <span class="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">联合 Song nghĩa</span>
          <span class="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">动宾 Động tân</span>
          <span class="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">附加 Phụ gia</span>
        </div>
      </div>

      <!-- Mindmap Visual Layout (3-Column Symmetrical Tree) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
        <!-- Left Branches (4 Compounds) -->
        <div class="lg:col-span-4 space-y-3">
          ${leftCompounds.map(c => renderCompoundBranch(c, 'left')).join('')}
        </div>

        <!-- Central Root Node (4 Cols) -->
        <div class="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-amber-100/90 via-[#FFFDF9] to-amber-50 dark:from-[#1C2128] dark:to-[#161B22] border-2 border-amber-300 dark:border-amber-900/60 shadow-xl relative overflow-hidden group">
          <!-- Ambient Radial Glow -->
          <div class="absolute -inset-4 bg-amber-400/15 rounded-full blur-2xl pointer-events-none"></div>

          <!-- Root Character Pill / Orb -->
          <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#8B1E1E] via-[#A52A2A] to-[#601212] text-white flex flex-col items-center justify-center shadow-2xl border-4 border-amber-200/90 dark:border-amber-400/60">
            <span class="font-hanzi text-4xl sm:text-5xl font-black tracking-tight leading-none text-amber-100">
              ${escapeHtml(root.char)}
            </span>
            <span class="font-mono text-xs font-bold text-amber-200 mt-0.5">
              ${escapeHtml(root.pinyin)}
            </span>
          </div>

          <!-- Root Meta Info -->
          <div class="mt-4 text-center space-y-1.5 z-10 w-full">
            <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-300 font-black text-xs uppercase tracking-wide">
              <span>Hán Việt: ${escapeHtml(root.hanviet)}</span>
            </div>
            <h4 class="text-base font-bold text-stone-900 dark:text-stone-100">
              ${escapeHtml(root.meaning)}
            </h4>
            <div class="flex items-center justify-center gap-3 text-2xs text-stone-500 dark:text-stone-400 font-medium">
              <span>Bộ thủ: <strong class="text-stone-700 dark:text-stone-200">${escapeHtml(root.radical || '')}</strong></span>
              <span>•</span>
              <span>Số nét: <strong class="text-stone-700 dark:text-stone-200">${root.strokeCount || 4} nét</strong></span>
            </div>

            <!-- Root Tip Box -->
            ${root.tip ? `
              <div class="mt-3 p-3 rounded-xl bg-white/90 dark:bg-stone-900/90 border border-amber-200/70 dark:border-stone-700 text-left text-xs text-stone-600 dark:text-stone-300 space-y-1">
                <div class="flex items-center gap-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                  <i data-lucide="lightbulb" class="w-3.5 h-3.5"></i>
                  <span>Bí quyết ghi nhớ & Biến điệu:</span>
                </div>
                <p class="leading-relaxed text-[11px] font-medium">${escapeHtml(root.tip)}</p>
              </div>
            ` : ''}

            <!-- Pronounce Root Button -->
            <div class="pt-2 flex justify-center gap-2">
              <button 
                type="button" 
                onclick="playChineseTTS('${escapeHtml(root.char)}', 'female')" 
                class="px-3.5 py-1.5 rounded-xl bg-[#8B1E1E] hover:bg-[#A52A2A] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="volume-2" class="w-3.5 h-3.5 text-amber-200"></i>
                <span>Phát âm gốc (Nữ)</span>
              </button>
              <button 
                type="button" 
                onclick="playChineseTTS('${escapeHtml(root.char)}', 'male')" 
                class="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Phát âm giọng Nam chuẩn Bắc Kinh">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                <span>Nam</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Branches (4 Compounds) -->
        <div class="lg:col-span-4 space-y-3">
          ${rightCompounds.map(c => renderCompoundBranch(c, 'right')).join('')}
        </div>
      </div>
    </div>
  `;
}

/** Render Card Grid View (Alternative to Radial Tree) */
function renderVocabExpGridHtml(root) {
  const compounds = root.compounds || [];

  return `
    <div class="glass-card rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#161B22] border border-amber-300/70 dark:border-stone-800 shadow-md space-y-5">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h3 class="text-xl font-serif-luxury font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Danh Sách 8 Từ Ghép Trọng Tâm Của Gốc</span>
            <span class="font-hanzi text-2xl text-[#8B1E1E] dark:text-amber-400">【${escapeHtml(root.char)}】</span>
          </h3>
          <p class="text-xs text-stone-500">
            ${escapeHtml(root.pinyin)} · Hán Việt: ${escapeHtml(root.hanviet)} · ${escapeHtml(root.meaning)}
          </p>
        </div>
        <button 
          type="button" 
          onclick="playChineseTTS('${escapeHtml(root.char)}', 'female')" 
          class="px-3.5 py-2 rounded-xl bg-amber-100 dark:bg-stone-800 text-[#8B1E1E] dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="volume-2" class="w-4 h-4"></i>
          <span>Nghe phát âm gốc từ</span>
        </button>
      </div>

      <!-- 8-Card Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        ${compounds.map((c, idx) => {
          return `
            <div 
              onclick="focusVocabExpCompound('${escapeHtml(c.word)}')"
              class="glass-card rounded-2xl p-4 bg-amber-50/30 dark:bg-stone-800/50 border border-amber-200 dark:border-stone-700/80 hover:border-[#8B1E1E] transition-all cursor-pointer flex flex-col justify-between space-y-3 group">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold text-stone-400">#0${idx + 1}</span>
                  <button 
                    type="button" 
                    onclick="event.stopPropagation(); playChineseTTS('${escapeHtml(c.word)}', 'female')" 
                    class="p-1 rounded-lg bg-white dark:bg-stone-700 text-[#8B1E1E] dark:text-amber-300 hover:scale-110 transition-transform">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
                <div class="mt-1">
                  <span class="font-hanzi text-2xl font-black text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 transition-colors">
                    ${escapeHtml(c.word)}
                  </span>
                  <div class="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                    ${escapeHtml(c.pinyin)}
                  </div>
                  <div class="text-[11px] font-black uppercase text-rose-700 dark:text-rose-400">
                    ${escapeHtml(c.hanviet)}
                  </div>
                </div>
                <p class="text-xs text-stone-700 dark:text-stone-300 mt-2 font-medium">
                  ${escapeHtml(c.meaning)}
                </p>
              </div>

              <div class="pt-2 border-t border-amber-100 dark:border-stone-700 flex items-center justify-between text-[10px]">
                <span class="px-2 py-0.5 rounded bg-amber-100/70 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold">
                  ${escapeHtml(c.pos)}
                </span>
                <span class="font-semibold text-amber-800 dark:text-amber-400">
                  ${escapeHtml(c.structure)}
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/** Render Detailed Sample Sentence Cards for the 8 Compounds */
function renderVocabExpExamplesHtml(root) {
  const compounds = root.compounds || [];

  return `
    <div class="space-y-4 pt-2">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <i data-lucide="message-square-text" class="w-5 h-5 text-[#8B1E1E] dark:text-amber-400"></i>
          <h3 class="text-lg font-serif-luxury font-black text-stone-900 dark:text-stone-100">
            Ứng Dụng Thực Chiến: 8 Câu Ví Dụ Song Ngữ Kèm Audio Bắc Kinh
          </h3>
        </div>
        <div class="text-xs text-stone-500 font-medium">
          Khắc phục nỗi sợ "biết từ đơn nhưng không ghép được câu giao tiếp"
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${compounds.map((c, idx) => {
          const ex = c.example || {};
          const isHighlighted = vocabExpActiveCompoundWord === c.word;
          const cardBorder = isHighlighted ? 'border-2 border-[#8B1E1E] bg-amber-50/70 dark:bg-amber-950/30 shadow-md' : 'border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161B22]';

          // Highlight target compound word in Chinese sentence
          let highlightedZh = escapeHtml(ex.zh || '');
          if (c.word && highlightedZh.includes(c.word)) {
            const regex = new RegExp(escapeRegex(c.word), 'g');
            highlightedZh = highlightedZh.replace(regex, `<span class="bg-amber-200/80 dark:bg-amber-900/60 text-[#8B1E1E] dark:text-amber-300 px-1 py-0.5 rounded font-black underline decoration-amber-500 underline-offset-2">${escapeHtml(c.word)}</span>`);
          }

          return `
            <div 
              id="card-example-${escapeHtml(c.word)}" 
              class="glass-card rounded-2xl p-5 ${cardBorder} shadow-xs transition-all flex flex-col justify-between space-y-3.5 hover:shadow-md">
              <div class="space-y-2">
                <!-- Word Header in Card -->
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg bg-amber-100 dark:bg-stone-800 text-stone-800 dark:text-amber-300 font-mono font-bold text-xs flex items-center justify-center">
                      ${idx + 1}
                    </span>
                    <span class="font-hanzi text-xl font-black text-stone-900 dark:text-stone-100">
                      ${escapeHtml(c.word)}
                    </span>
                    <span class="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                      ${escapeHtml(c.pinyin)}
                    </span>
                    <span class="text-[11px] font-black uppercase text-rose-700 dark:text-rose-400">
                      (${escapeHtml(c.hanviet)})
                    </span>
                  </div>

                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-[#8B1E1E] dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    ${escapeHtml(c.structure)}
                  </span>
                </div>

                <p class="text-xs text-stone-600 dark:text-stone-300 font-medium">
                  <strong>Ý nghĩa:</strong> ${escapeHtml(c.meaning)}
                </p>

                <!-- Example Sentence Box -->
                <div class="p-3.5 rounded-xl bg-amber-50/50 dark:bg-stone-900/60 border border-amber-200/80 dark:border-stone-800 space-y-1.5">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Câu ví dụ thực chiến:</span>
                    <div class="flex items-center gap-1.5">
                      <button 
                        type="button" 
                        onclick="playChineseTTS(${jsArg(ex.zh || '')}, 'female')" 
                        class="text-xs text-amber-800 dark:text-amber-300 hover:text-[#8B1E1E] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Nghe câu giọng Nữ Bắc Kinh">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                        <span>Giọng Nữ</span>
                      </button>
                      <span class="text-stone-300">|</span>
                      <button 
                        type="button" 
                        onclick="playChineseTTS(${jsArg(ex.zh || '')}, 'male')" 
                        class="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Nghe câu giọng Nam Bắc Kinh">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                        <span>Giọng Nam</span>
                      </button>
                    </div>
                  </div>

                  <p class="font-hanzi text-base font-medium text-stone-900 dark:text-stone-100 leading-relaxed">
                    ${highlightedZh}
                  </p>
                  <p class="font-mono text-xs text-amber-900 dark:text-amber-300 font-medium">
                    ${escapeHtml(ex.pinyin || '')}
                  </p>
                  <p class="text-xs text-stone-700 dark:text-stone-300 font-semibold italic">
                    ➔ ${escapeHtml(ex.vi || '')}
                  </p>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span class="text-[11px] text-stone-400">Từ loại: <strong>${escapeHtml(c.pos)}</strong></span>
                <button 
                  type="button" 
                  onclick="saveVocabExpToNotebook(${jsArg(c.word)}, ${jsArg(c.pinyin)}, ${jsArg(c.meaning)}, ${jsArg(c.hanviet)})" 
                  class="px-3 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors">
                  <i data-lucide="bookmark-plus" class="w-3.5 h-3.5 text-amber-600"></i>
                  <span>Lưu vào sổ từ</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/** Focus on a specific compound from the mindmap node */
function focusVocabExpCompound(word) {
  vocabExpActiveCompoundWord = word;
  const card = document.getElementById(`card-example-${word}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('ring-4', 'ring-[#8B1E1E]', 'transition-all');
    setTimeout(() => {
      card.classList.remove('ring-4', 'ring-[#8B1E1E]');
    }, 2000);
  }
}

/** Save compound word to user notebook */
function saveVocabExpToNotebook(word, pinyin, meaning, hanviet) {
  try {
    const list = storage.get('yuhan_notebook_words') || [];
    if (!list.some(item => (typeof item === 'string' ? item === word : item.word === word))) {
      list.push({
        word,
        pinyin,
        meaning,
        hanviet,
        addedAt: new Date().toISOString()
      });
      storage.set('yuhan_notebook_words', list);
      if (typeof showToast === 'function') {
        showToast(`Đã lưu "${word}" vào sổ tay từ vựng!`, 'success');
      }
    } else {
      if (typeof showToast === 'function') {
        showToast(`"${word}" đã có trong sổ tay của bạn rồi.`, 'info');
      }
    }
  } catch (err) {
    console.warn('Lỗi khi lưu từ vào sổ:', err);
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Attach globals
if (typeof window !== 'undefined') {
  window.initVocabExpansion = initVocabExpansion;
  window.filterVocabExpCategory = filterVocabExpCategory;
  window.selectVocabExpRoot = selectVocabExpRoot;
  window.handleVocabExpSearch = handleVocabExpSearch;
  window.toggleVocabExpViewMode = toggleVocabExpViewMode;
  window.focusVocabExpCompound = focusVocabExpCompound;
  window.saveVocabExpToNotebook = saveVocabExpToNotebook;
}
