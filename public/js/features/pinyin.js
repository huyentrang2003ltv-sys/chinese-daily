// =========================================================================
// MODULE: BẢNG PHIÊN ÂM PINYIN & CẨM NĂNG PHÁT ÂM CHUẨN TOÀN DIỆN 2026
// Hệ thống ngữ âm tiêu chuẩn Bắc Kinh & Chuẩn HSK 3.0 cho người học Việt Nam
// =========================================================================

let currentPinyinSubTab = 'matrix'; // 'matrix', 'initials', 'finals', 'tones', 'confusions', 'quiz'
let currentInitialsFilter = 'all';
let currentFinalsFilter = 'all';
let currentMatrixFilter = 'all';
let currentMatrixSearchQuery = '';
let activePinyinSyllable = null;
let pinyinQuizAnswers = {};

function initPinyinModule() {
  const container = document.getElementById('tab-pinyin');
  if (!container) return;
  renderPinyinTab();
}

function switchPinyinSubTab(subTab) {
  currentPinyinSubTab = subTab;
  const tabs = ['matrix', 'initials', 'finals', 'tones', 'confusions', 'quiz'];
  tabs.forEach(t => {
    const btn = document.getElementById(`btn-pinyin-sub-${t}`);
    if (!btn) return;
    if (t === subTab) {
      btn.className = 'pinyin-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm flex items-center gap-1.5 cursor-pointer border border-transparent';
    } else {
      btn.className = 'pinyin-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 cursor-pointer';
    }
  });

  const contentContainer = document.getElementById('pinyinDynamicContent');
  if (!contentContainer) return;

  if (subTab === 'matrix') renderPinyinMatrixView(contentContainer);
  else if (subTab === 'initials') renderPinyinInitialsView(contentContainer);
  else if (subTab === 'finals') renderPinyinFinalsView(contentContainer);
  else if (subTab === 'tones') renderPinyinTonesView(contentContainer);
  else if (subTab === 'confusions') renderPinyinConfusionsView(contentContainer);
  else if (subTab === 'quiz') renderPinyinQuizView(contentContainer);

  if (typeof refreshIcons === 'function') refreshIcons(contentContainer);
}

function playPinyinAudio(text, voice = 'female') {
  if (!text) return;
  if (typeof playChineseTTS === 'function') {
    playChineseTTS(text, voice);
  }
}

function renderPinyinTab() {
  const container = document.getElementById('tab-pinyin');
  if (!container) return;

  const data = pinyinGuideData || {};

  container.innerHTML = `
    <!-- Hero Banner -->
    <div class="glass-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-50 via-[#FFFDF9] to-red-50 dark:from-[#1c222d] dark:via-[#161B22] dark:to-[#25181a] border-2 border-amber-300/80 dark:border-stone-800 shadow-md relative overflow-hidden">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div class="space-y-3 max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#8B1E1E] to-rose-700 text-white text-xs font-bold shadow-xs">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
            <span>Nền Tảng Vàng Nhập Môn • Chuẩn Ngữ Âm 2026</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black font-serif-luxury text-stone-900 dark:text-stone-100 tracking-tight">
            ${escapeHtml(data.title || 'Cẩm Nang Bảng Phiên Âm Pinyin Toàn Diện')}
          </h2>
          <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Hệ thống hóa toàn bộ <strong>23 Thanh mẫu</strong>, <strong>36 Vận mẫu</strong>, <strong>4 Thanh điệu</strong> và ma trận hơn <strong>400+ âm tiết tiếng Trung</strong>. Kèm mẹo tạo khẩu hình miệng, bí quyết phân biệt âm bật hơi độc quyền cho người Việt!
          </p>

          <div class="flex flex-wrap items-center gap-2 pt-1 text-2xs sm:text-xs text-stone-500 dark:text-stone-400">
            <span class="px-2.5 py-1 rounded-lg bg-amber-100/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold">👄 23 Phụ âm đầu</span>
            <span class="px-2.5 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold">🎶 36 Nguyên âm vần</span>
            <span class="px-2.5 py-1 rounded-lg bg-rose-100/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold">📈 5 Thanh điệu & Biến âm</span>
            <span class="px-2.5 py-1 rounded-lg bg-purple-100/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 font-bold">🎧 Luyện tai phản xạ</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <button onclick="playPinyinAudio('b, p, m, f, d, t, n, l, g, k, h, j, q, x, zh, ch, sh, r, z, c, s, y, w')" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
            <span>Nghe Toàn Bộ 23 Thanh Mẫu</span>
          </button>
          <button onclick="switchPinyinSubTab('confusions')" class="px-5 py-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs hover:bg-stone-50 dark:hover:bg-stone-700 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <i data-lucide="split" class="w-4 h-4 text-rose-600"></i>
            <span>Luyện Cặp Âm Bật Hơi</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sub-tab Navigation Bar -->
    <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar p-1.5 rounded-2xl bg-amber-50/60 dark:bg-stone-900/40 border border-amber-200 dark:border-stone-800">
      <button id="btn-pinyin-sub-matrix" onclick="switchPinyinSubTab('matrix')" class="pinyin-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm flex items-center gap-1.5 cursor-pointer border border-transparent">
        <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
        <span>Bảng Ghép Âm Tổng Hợp</span>
      </button>

      <button id="btn-pinyin-sub-initials" onclick="switchPinyinSubTab('initials')" class="pinyin-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="mic" class="w-3.5 h-3.5 text-amber-700 dark:text-amber-400"></i>
        <span>23 Thanh Mẫu (Initials)</span>
      </button>

      <button id="btn-pinyin-sub-finals" onclick="switchPinyinSubTab('finals')" class="pinyin-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="music" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"></i>
        <span>36 Vận Mẫu (Finals)</span>
      </button>

      <button id="btn-pinyin-sub-tones" onclick="switchPinyinSubTab('tones')" class="pinyin-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="trending-up" class="w-3.5 h-3.5 text-rose-600 dark:text-rose-400"></i>
        <span>Thanh Điệu & Biến Âm</span>
      </button>

      <button id="btn-pinyin-sub-confusions" onclick="switchPinyinSubTab('confusions')" class="pinyin-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400"></i>
        <span>So Sánh Âm Dễ Nhầm</span>
      </button>

      <button id="btn-pinyin-sub-quiz" onclick="switchPinyinSubTab('quiz')" class="pinyin-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="headphones" class="w-3.5 h-3.5 text-sky-600 dark:text-sky-400"></i>
        <span>Luyện Tai Phản Xạ (Quiz)</span>
      </button>
    </div>

    <!-- Dynamic Content Area -->
    <div id="pinyinDynamicContent" class="space-y-6">
      <!-- Injected by switchPinyinSubTab -->
    </div>
  `;

  switchPinyinSubTab(currentPinyinSubTab);
}

// ---------------- 1. BẢNG GHÉP ÂM PINYIN TƯƠNG TÁC ----------------
function filterPinyinMatrixGroup(grp) {
  currentMatrixFilter = grp;
  const contentContainer = document.getElementById('pinyinDynamicContent');
  if (contentContainer) renderPinyinMatrixView(contentContainer);
}

function searchPinyinMatrix(query) {
  currentMatrixSearchQuery = (query || '').toLowerCase().trim();
  const contentContainer = document.getElementById('pinyinDynamicContent');
  if (contentContainer) renderPinyinMatrixView(contentContainer);
}

function renderPinyinMatrixView(container) {
  const data = pinyinGuideData || {};
  const matrix = data.interactiveMatrix || { syllables: [] };
  let syllables = matrix.syllables || [];

  if (currentMatrixFilter !== 'all') {
    if (currentMatrixFilter === 'a') syllables = syllables.filter(s => s.f === 'a' || s.f === 'ai' || s.f === 'ao' || s.f === 'an' || s.f === 'ang');
    else if (currentMatrixFilter === 'o_e') syllables = syllables.filter(s => s.f === 'o' || s.f === 'e' || s.f === 'ei' || s.f === 'ou' || s.f === 'en' || s.f === 'eng' || s.f === 'er');
    else if (currentMatrixFilter === 'i') syllables = syllables.filter(s => s.f.startsWith('i'));
    else if (currentMatrixFilter === 'u') syllables = syllables.filter(s => s.f.startsWith('u'));
    else if (currentMatrixFilter === 'ü') syllables = syllables.filter(s => s.f.startsWith('ü') || s.f === 'ju' || s.f === 'qu' || s.f === 'xu' || s.f === 'yu');
    else if (currentMatrixFilter === 'nasal') syllables = syllables.filter(s => s.f.endsWith('n') || s.f.endsWith('ng'));
  }

  if (currentMatrixSearchQuery) {
    syllables = syllables.filter(s => s.s.toLowerCase().includes(currentMatrixSearchQuery) || (s.tip && s.tip.toLowerCase().includes(currentMatrixSearchQuery)));
  }

  const filters = [
    { id: 'all', label: 'Tất cả âm' },
    { id: 'a', label: 'Hàng Vần a' },
    { id: 'o_e', label: 'Hàng Vần o & e' },
    { id: 'i', label: 'Hàng Vần i (Lưu ý ư)' },
    { id: 'u', label: 'Hàng Vần u' },
    { id: 'ü', label: 'Hàng Vần ü (Huýt sáo)' },
    { id: 'nasal', label: 'Vận mẫu Mũi (-n / -ng)' }
  ];

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Search & Filters -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#161B22] border border-amber-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          ${filters.map(f => {
            const isAct = currentMatrixFilter === f.id;
            const cls = isAct 
              ? 'px-3 py-1.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold shadow-xs whitespace-nowrap'
              : 'px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-stone-700 whitespace-nowrap cursor-pointer';
            return `
              <button onclick="filterPinyinMatrixGroup('${f.id}')" class="${cls}">
                ${f.label}
              </button>
            `;
          }).join('')}
        </div>

        <div class="relative w-full md:w-64">
          <input 
            type="text" 
            value="${escapeHtml(currentMatrixSearchQuery)}"
            oninput="searchPinyinMatrix(this.value)"
            placeholder="Tra âm: ba, zhong, tian..."
            class="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          <i data-lucide="search" class="w-4 h-4 absolute left-3 top-2.5 text-stone-400"></i>
        </div>
      </div>

      <!-- Instruction Hint -->
      <div class="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-stone-700 flex items-center justify-between text-xs text-amber-950 dark:text-amber-300">
        <div class="flex items-center gap-2">
          <span class="text-base">💡</span>
          <span><strong>Mẹo tương tác:</strong> Nhấp vào bất kỳ ô âm tiết nào để nghe audio phát âm chuẩn giọng Bắc Kinh và mở rộng 4 thanh điệu (mā, má, mǎ, mà).</span>
        </div>
        <span class="font-bold shrink-0 ml-2">Tìm thấy: ${syllables.length} âm tiết</span>
      </div>

      <!-- Syllable Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        ${syllables.map(s => `
          <div onclick="openPinyinSyllableModal('${escapeHtml(s.s)}')" class="glass-card rounded-2xl p-3.5 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group flex flex-col justify-between space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 font-bold">
                ${s.i} + ${s.f}
              </span>
              <button onclick="event.stopPropagation(); playPinyinAudio('${escapeHtml(s.s)}')" class="p-1 rounded-lg text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-stone-700 transition-colors" title="Nghe âm chuẩn">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <div class="text-center py-1">
              <span class="text-xl sm:text-2xl font-black font-mono text-[#8B1E1E] dark:text-red-400 group-hover:scale-105 transition-transform inline-block">
                ${escapeHtml(s.s)}
              </span>
            </div>

            <div class="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 truncate border-t border-stone-100 dark:border-stone-800 pt-1.5" title="${escapeHtml(s.tip || '')}">
              ${escapeHtml(s.tip || 'Âm tiết tiêu chuẩn')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ---------------- 2. MODAL CHI TIẾT ÂM TIẾT PINYIN ----------------
function openPinyinSyllableModal(syllableStr) {
  const data = pinyinGuideData || {};
  const syllables = (data.interactiveMatrix && data.interactiveMatrix.syllables) || [];
  const item = syllables.find(s => s.s === syllableStr) || { s: syllableStr, tones: [syllableStr], tip: 'Âm tiết chuẩn' };

  activePinyinSyllable = item;

  // Play audio immediately
  playPinyinAudio(item.s);

  let existingModal = document.getElementById('pinyinSyllableDetailModal');
  if (!existingModal) {
    existingModal = document.createElement('div');
    existingModal.id = 'pinyinSyllableDetailModal';
    document.body.appendChild(existingModal);
  }

  existingModal.style.cssText = 'position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 1rem; background-color: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px);';
  existingModal.onclick = (e) => {
    if (e.target === existingModal) closePinyinSyllableModal();
  };
  existingModal.innerHTML = `
    <div class="bg-[#FFFDF9] dark:bg-[#161B22] w-full max-w-lg rounded-3xl border-2 border-amber-300 dark:border-stone-700 p-6 shadow-2xl relative space-y-5 animate-scale-up text-stone-900 dark:text-stone-100" onclick="event.stopPropagation()">
      <!-- Close Button -->
      <button onclick="closePinyinSyllableModal()" class="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <!-- Header -->
      <div class="flex items-center gap-3 border-b border-amber-200/80 dark:border-stone-800 pb-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B1E1E] to-rose-700 text-white flex items-center justify-center font-mono font-black text-2xl shadow-sm">
          ${item.s.slice(0, 1)}
        </div>
        <div>
          <span class="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Cấu trúc âm tiết</span>
          <h3 class="text-2xl font-black font-mono text-[#8B1E1E] dark:text-rose-400">
            ${escapeHtml(item.s)}
          </h3>
        </div>
      </div>

      <!-- Explanation & Tip -->
      <div class="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 text-xs space-y-1.5 leading-relaxed">
        <div class="flex items-center justify-between">
          <span class="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
            <span>💡</span>
            <span>Mẹo phát âm chuẩn:</span>
          </span>
          <span class="font-mono text-stone-500 text-[11px]">Thanh mẫu: <strong>${item.i || ''}</strong> + Vận mẫu: <strong>${item.f || ''}</strong></span>
        </div>
        <p class="text-stone-700 dark:text-stone-300">
          ${escapeHtml(item.tip || 'Phát âm chuẩn xác theo thanh mẫu và vận mẫu tương ứng.')}
        </p>
      </div>

      <!-- 4 Tones Buttons -->
      <div class="space-y-2">
        <span class="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
          Luyện phát âm 4 thanh điệu của "${escapeHtml(item.s)}":
        </span>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          ${(item.tones || []).map((toneWord, idx) => `
            <button onclick="playPinyinAudio('${escapeHtml(toneWord)}')" class="p-3 rounded-2xl bg-white dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-500 text-center space-y-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xs group">
              <span class="text-2xs font-bold text-stone-400 group-hover:text-amber-700 dark:group-hover:text-amber-400 block">Thanh ${idx + 1}</span>
              <span class="text-xl font-black font-mono text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-red-400 block">${escapeHtml(toneWord)}</span>
              <span class="text-2xs text-amber-800 dark:text-amber-300 flex items-center justify-center gap-0.5 pt-0.5">
                <i data-lucide="volume-2" class="w-3 h-3"></i>
                <span>Nghe</span>
              </span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Close Button -->
      <div class="pt-2">
        <button onclick="closePinyinSyllableModal()" class="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors cursor-pointer">
          Đóng cửa sổ
        </button>
      </div>
    </div>
  `;

  if (typeof refreshIcons === 'function') refreshIcons(existingModal);
}

function closePinyinSyllableModal() {
  const modal = document.getElementById('pinyinSyllableDetailModal');
  if (modal) modal.remove();
}

// ---------------- 3. THANH MẪU (23 INITIALS) ----------------
function filterPinyinInitialsGroup(group) {
  currentInitialsFilter = group;
  const contentContainer = document.getElementById('pinyinDynamicContent');
  if (contentContainer) renderPinyinInitialsView(contentContainer);
}

function renderPinyinInitialsView(container) {
  const data = pinyinGuideData || {};
  let initials = data.initials || [];

  if (currentInitialsFilter !== 'all') {
    initials = initials.filter(i => i.groupId === currentInitialsFilter);
  }

  const groups = [
    { id: 'all', label: 'Tất cả 23 thanh mẫu' },
    { id: 'labial', label: 'Âm hai môi (b, p, m, f)' },
    { id: 'alveolar', label: 'Âm đầu lưỡi (d, t, n, l)' },
    { id: 'velar', label: 'Âm cuống lưỡi (g, k, h)' },
    { id: 'palatal', label: 'Âm mặt lưỡi (j, q, x)' },
    { id: 'retroflex', label: 'Âm uốn lưỡi (zh, ch, sh, r)' },
    { id: 'dental', label: 'Âm đầu lưỡi trước (z, c, s)' },
    { id: 'semi_vowel', label: 'Bán nguyên âm (y, w)' }
  ];

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Filter Bar -->
      <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar p-2 rounded-2xl bg-white dark:bg-[#161B22] border border-amber-200 dark:border-stone-800 shadow-xs">
        ${groups.map(g => {
          const isAct = currentInitialsFilter === g.id;
          const cls = isAct 
            ? 'px-3 py-1.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold shadow-xs whitespace-nowrap'
            : 'px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-stone-700 whitespace-nowrap cursor-pointer';
          return `
            <button onclick="filterPinyinInitialsGroup('${g.id}')" class="${cls}">
              ${g.label}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Initials Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${initials.map(item => `
          <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div class="space-y-3">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B1E1E] to-rose-700 text-white flex items-center justify-center font-mono font-black text-2xl shadow-sm">
                    ${escapeHtml(item.symbol)}
                  </div>
                  <div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      ${escapeHtml(item.group)}
                    </span>
                    <h4 class="text-base font-bold text-stone-900 dark:text-stone-100 mt-1">
                      ${escapeHtml(item.name)}
                    </h4>
                  </div>
                </div>

                <button onclick="playPinyinAudio('${escapeHtml(item.symbol)}')" class="p-2 rounded-xl bg-amber-50 dark:bg-stone-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-stone-700 flex items-center gap-1 text-xs font-bold transition-all cursor-pointer">
                  <i data-lucide="volume-2" class="w-4 h-4"></i>
                  <span>Nghe âm</span>
                </button>
              </div>

              <!-- IPA and Acoustic Nature -->
              <div class="flex flex-wrap items-center gap-2 text-2xs font-mono">
                <span class="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold">IPA: ${escapeHtml(item.ipa)}</span>
                <span class="px-2 py-0.5 rounded ${item.type.includes('BẬT HƠI') ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-black' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold'}">
                  ${escapeHtml(item.type)}
                </span>
              </div>

              <!-- Mouth Shape Instruction -->
              <div class="p-3 rounded-xl bg-amber-50/60 dark:bg-stone-800/50 border border-amber-200/80 dark:border-stone-700 text-xs space-y-1">
                <span class="text-[10px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">👄 Khẩu hình miệng chuẩn:</span>
                <p class="text-stone-700 dark:text-stone-300 leading-relaxed">${escapeHtml(item.mouthShape)}</p>
              </div>

              <!-- Vietnamese Comparison & Secret Tip -->
              <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-800 text-xs space-y-1.5">
                <div>
                  <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">So sánh tiếng Việt:</span>
                  <p class="text-stone-700 dark:text-stone-300">${escapeHtml(item.vietnameseComparison)}</p>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">✨ Mẹo vàng nhớ lâu:</span>
                  <p class="text-stone-600 dark:text-stone-400 italic">${escapeHtml(item.secretTip)}</p>
                </div>
              </div>

              <!-- Practical Example Word -->
              ${item.example ? `
                <div class="p-2.5 rounded-xl bg-[#FFFDF9] dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="text-stone-400 text-2xs uppercase font-bold">Ví dụ:</span>
                    <span class="font-hanzi font-bold text-sm text-[#8B1E1E] dark:text-red-400">${item.example.hanzi}</span>
                    <span class="font-mono text-amber-900 dark:text-amber-300">${item.example.pinyin}</span>
                    <span class="text-stone-500">(${item.example.meaning})</span>
                  </div>
                  <button onclick="playPinyinAudio('${escapeHtml(item.example.audio || item.example.hanzi)}')" class="text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                    <span>Nghe từ</span>
                  </button>
                </div>
              ` : ''}
            </div>

            <!-- Practice Syllables Chips -->
            ${item.practiceSyllables && item.practiceSyllables.length > 0 ? `
              <div class="border-t border-stone-100 dark:border-stone-800 pt-2.5 space-y-1.5">
                <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Luyện nghe âm tiết mẫu:</span>
                <div class="flex flex-wrap gap-1.5">
                  ${item.practiceSyllables.map(s => `
                    <button onclick="playPinyinAudio('${escapeHtml(s)}')" class="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-mono font-bold transition-colors cursor-pointer">
                      ${escapeHtml(s)}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ---------------- 4. VẬN MẪU (36 FINALS) ----------------
function filterPinyinFinalsCategory(cat) {
  currentFinalsFilter = cat;
  const contentContainer = document.getElementById('pinyinDynamicContent');
  if (contentContainer) renderPinyinFinalsView(contentContainer);
}

function renderPinyinFinalsView(container) {
  const data = pinyinGuideData || {};
  let finals = data.finals || [];

  if (currentFinalsFilter !== 'all') {
    finals = finals.filter(f => f.categoryId === currentFinalsFilter);
  }

  const categories = [
    { id: 'all', label: 'Tất cả 36 vận mẫu' },
    { id: 'single', label: 'Vận mẫu đơn (a, o, e, i, u, ü)' },
    { id: 'compound', label: 'Vận mẫu kép (ai, ei, ao...)' },
    { id: 'front_nasal', label: 'Vận mẫu mũi trước (-n)' },
    { id: 'back_nasal', label: 'Vận mẫu mũi sau (-ng)' },
    { id: 'retroflex_special', label: 'Uốn lưỡi đặc biệt (er)' }
  ];

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Filter Bar -->
      <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar p-2 rounded-2xl bg-white dark:bg-[#161B22] border border-amber-200 dark:border-stone-800 shadow-xs">
        ${categories.map(c => {
          const isAct = currentFinalsFilter === c.id;
          const cls = isAct 
            ? 'px-3 py-1.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold shadow-xs whitespace-nowrap'
            : 'px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-stone-700 whitespace-nowrap cursor-pointer';
          return `
            <button onclick="filterPinyinFinalsCategory('${c.id}')" class="${cls}">
              ${c.label}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Finals Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${finals.map(item => `
          <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3.5 hover:shadow-md transition-shadow">
            <div class="space-y-2.5">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    ${escapeHtml(item.category)}
                  </span>
                  <div class="flex items-baseline gap-2 mt-0.5">
                    <span class="text-3xl font-black font-mono text-[#8B1E1E] dark:text-red-400">
                      ${escapeHtml(item.symbol)}
                    </span>
                    <span class="text-xs font-mono text-stone-400">${escapeHtml(item.ipa)}</span>
                  </div>
                </div>

                <button onclick="playPinyinAudio('${escapeHtml(item.symbol)}')" class="p-2 rounded-xl bg-amber-50 dark:bg-stone-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-stone-700 flex items-center gap-1 text-xs font-bold transition-all cursor-pointer">
                  <i data-lucide="volume-2" class="w-4 h-4"></i>
                  <span>Nghe</span>
                </button>
              </div>

              <!-- Mouth Shape -->
              <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                <strong>Khẩu hình:</strong> ${escapeHtml(item.mouthShape)}
              </p>

              <!-- Comparison -->
              <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 text-2xs space-y-1">
                <div>
                  <span class="font-bold text-stone-500 uppercase">Tiếng Việt:</span>
                  <span class="text-stone-700 dark:text-stone-300 font-semibold">${escapeHtml(item.vietnameseComparison)}</span>
                </div>
                ${item.secretTip ? `
                  <div class="text-amber-900 dark:text-amber-300 italic">
                    ⭐ ${escapeHtml(item.secretTip)}
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Example -->
            ${item.example ? `
              <div class="p-2.5 rounded-xl bg-amber-50/60 dark:bg-stone-900/60 border border-amber-200 dark:border-stone-800 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-hanzi font-bold text-sm text-[#8B1E1E] dark:text-red-400">${item.example.hanzi}</span>
                  <span class="font-mono text-amber-900 dark:text-amber-300">${item.example.pinyin}</span>
                  <span class="text-stone-500">(${item.example.meaning})</span>
                </div>
                <button onclick="playPinyinAudio('${escapeHtml(item.example.audio || item.example.hanzi)}')" class="text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-0.5 cursor-pointer">
                  <i data-lucide="volume-2" class="w-3 h-3"></i>
                  <span>Nghe</span>
                </button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ---------------- 5. THANH ĐIỆU & BIẾN ÂM (TONES & SANDHI) ----------------
function renderPinyinTonesView(container) {
  const data = pinyinGuideData || {};
  const tones = data.tones || [];
  const rules = data.toneSandhiRules || [];

  container.innerHTML = `
    <div class="space-y-8 animate-fade-in">
      <!-- 5 Tones Presentation -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold font-serif-luxury text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>📈</span>
            <span>Hệ Thống 5 Thanh Điệu Chuẩn Bắc Kinh</span>
          </h3>
          <span class="text-xs text-stone-500">Thang cao độ 5 bậc (Pitch Scale 1 - 5)</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${tones.map(t => `
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border-2 border-amber-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3.5 hover:shadow-md transition-shadow">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B1E1E] to-rose-700 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      ${t.number}
                    </span>
                    <div>
                      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100">
                        ${escapeHtml(t.name)}
                      </h4>
                      <span class="text-2xs font-mono text-amber-800 dark:text-amber-400 font-bold">Cao độ: ${escapeHtml(t.pitch)}</span>
                    </div>
                  </div>

                  <button onclick="playPinyinAudio('${escapeHtml(t.audio)}')" class="p-2 rounded-xl bg-amber-50 dark:bg-stone-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 flex items-center gap-1 text-xs font-bold cursor-pointer">
                    <i data-lucide="volume-2" class="w-4 h-4"></i>
                    <span>Nghe</span>
                  </button>
                </div>

                <div class="p-2.5 rounded-xl bg-amber-50/60 dark:bg-stone-800/40 border border-amber-200/70 dark:border-stone-700 text-xs space-y-1">
                  <span class="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-300 block">Đặc điểm đường cong:</span>
                  <p class="font-bold text-stone-800 dark:text-stone-200">${escapeHtml(t.contour)}</p>
                  <p class="text-stone-600 dark:text-stone-300 leading-relaxed">${escapeHtml(t.description)}</p>
                </div>

                <div class="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                  <p><strong>So sánh tiếng Việt:</strong> ${escapeHtml(t.vietnameseComparison)}</p>
                  <p class="text-emerald-700 dark:text-emerald-400 italic">💡 ${escapeHtml(t.secretTip)}</p>
                </div>
              </div>

              <div class="p-2.5 rounded-xl bg-[#FFFDF9] dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-mono font-bold text-[#8B1E1E] dark:text-red-400">
                <span>Ví dụ: ${escapeHtml(t.formula)}</span>
                <span class="text-2xs text-stone-400">Click nút loa để nghe</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Tone Sandhi Rules -->
      <div class="space-y-4 pt-4 border-t border-amber-200 dark:border-stone-800">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold font-serif-luxury text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>🔄</span>
            <span>4 Quy Tắc Biến Điệu Sống Còn (Tone Sandhi)</span>
          </h3>
          <span class="text-xs text-amber-800 dark:text-amber-400 font-bold">Bắt buộc phải thuộc</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${rules.map(rule => `
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-amber-300/80 dark:border-stone-800 shadow-xs space-y-3">
              <h4 class="text-sm font-bold text-[#8B1E1E] dark:text-amber-400 font-serif-luxury">
                ${escapeHtml(rule.title)}
              </h4>
              <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                ${escapeHtml(rule.rule)}
              </p>

              <div class="p-3 rounded-xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 text-xs font-mono space-y-1 text-amber-950 dark:text-amber-300">
                <div>Viết: <strong>${escapeHtml(rule.exampleOriginal)}</strong></div>
                <div class="text-[#8B1E1E] dark:text-red-400 font-bold">Thực tế đọc: <strong>${escapeHtml(rule.exampleReal)}</strong></div>
              </div>

              ${rule.moreExamples && rule.moreExamples.length > 0 ? `
                <div class="space-y-1.5 pt-1">
                  <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Các ví dụ điển hình:</span>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    ${rule.moreExamples.map(ex => `
                      <button onclick="playPinyinAudio('${escapeHtml(ex.word)}')" class="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-left cursor-pointer transition-colors border border-stone-200 dark:border-stone-700">
                        <div class="font-hanzi font-bold text-xs text-stone-900 dark:text-stone-100">${escapeHtml(ex.word)}</div>
                        <div class="text-[11px] font-mono text-amber-800 dark:text-amber-300">${escapeHtml(ex.pinyin)}</div>
                        <div class="text-[10px] text-stone-500 truncate">${escapeHtml(ex.meaning)}</div>
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ---------------- 6. SO SÁNH ÂM DỄ NHẦM (CONFUSING PAIRS) ----------------
function renderPinyinConfusionsView(container) {
  const data = pinyinGuideData || {};
  const pairs = data.confusingPairs || [];

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <div class="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-white dark:from-[#25181a] dark:via-[#161B22] dark:to-[#161B22] border-2 border-red-300/80 dark:border-stone-800 flex items-center justify-between">
        <div class="space-y-1">
          <h3 class="text-base font-bold text-[#8B1E1E] dark:text-red-400 font-serif-luxury flex items-center gap-2">
            <span>🎯</span>
            <span>7 Cặp Âm Dễ Nhầm Lẫn Nhất Của Người Việt</span>
          </h3>
          <p class="text-xs text-stone-600 dark:text-stone-300">
            Học viên Việt Nam thường gặp khó khăn lớn nhất ở âm <strong>BẬT HƠI</strong> và âm <strong>UỐN LƯỠI</strong>. Hãy bấm vào từng cặp từ để luyện tai phân biệt!
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-5">
        ${pairs.map(p => `
          <div class="glass-card rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <h4 class="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-luxury border-b border-stone-100 dark:border-stone-800 pb-2.5">
              ${escapeHtml(p.title)}
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Sound A -->
              <div class="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/40 border border-amber-200 dark:border-stone-700 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-black font-mono text-[#8B1E1E] dark:text-amber-400">${p.soundA}</span>
                  <button onclick="playPinyinAudio('${p.soundA}')" class="px-3 py-1 rounded-xl bg-amber-100 dark:bg-stone-700 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200 flex items-center gap-1 cursor-pointer">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                    <span>Nghe âm ${p.soundA}</span>
                  </button>
                </div>
                <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">${escapeHtml(p.descA)}</p>
              </div>

              <!-- Sound B -->
              <div class="p-4 rounded-2xl bg-rose-50/60 dark:bg-stone-800/40 border border-rose-200 dark:border-stone-700 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-black font-mono text-rose-700 dark:text-rose-400">${p.soundB}</span>
                  <button onclick="playPinyinAudio('${p.soundB}')" class="px-3 py-1 rounded-xl bg-rose-100 dark:bg-stone-700 text-rose-900 dark:text-rose-200 text-xs font-bold hover:bg-rose-200 flex items-center gap-1 cursor-pointer">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                    <span>Nghe âm ${p.soundB} (Bật hơi)</span>
                  </button>
                </div>
                <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">${escapeHtml(p.descB)}</p>
              </div>
            </div>

            <!-- Comparison Pairs -->
            <div class="space-y-2">
              <span class="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">So sánh đối ứng từng từ:</span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                ${(p.pairWords || []).map(pw => `
                  <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
                    <button onclick="playPinyinAudio('${escapeHtml(pw.wordA.split('(')[0].trim())}')" class="font-bold text-amber-900 dark:text-amber-300 hover:underline cursor-pointer">
                      🔊 ${escapeHtml(pw.wordA)}
                    </button>
                    <span class="text-stone-400 font-bold">vs</span>
                    <button onclick="playPinyinAudio('${escapeHtml(pw.wordB.split('(')[0].trim())}')" class="font-bold text-rose-800 dark:text-rose-400 hover:underline cursor-pointer">
                      🔊 ${escapeHtml(pw.wordB)}
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Tongue Twister -->
            ${p.tongueTwister ? `
              <div class="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-stone-900/60 border border-purple-200 dark:border-purple-800/40 text-xs space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1">
                    <span>👅</span>
                    <span>Bài vè luyện dẻo miệng (Nhiêu khẩu lệnh):</span>
                  </span>
                  <button onclick="playPinyinAudio('${escapeHtml(p.tongueTwister)}')" class="text-purple-800 dark:text-purple-300 hover:underline text-2xs font-bold flex items-center gap-1 cursor-pointer">
                    <i data-lucide="play" class="w-3 h-3"></i>
                    <span>Nghe cả bài</span>
                  </button>
                </div>
                <p class="font-hanzi text-sm text-stone-800 dark:text-stone-200">${escapeHtml(p.tongueTwister)}</p>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ---------------- 7. LUYỆN TAI PHẢN XẠ (EAR TRAINING QUIZ) ----------------
function answerPinyinQuiz(qIdx, optIdx) {
  pinyinQuizAnswers[qIdx] = optIdx;
  const contentContainer = document.getElementById('pinyinDynamicContent');
  if (contentContainer) renderPinyinQuizView(contentContainer);
}

function resetPinyinQuiz() {
  pinyinQuizAnswers = {};
  const contentContainer = document.getElementById('pinyinDynamicContent');
  if (contentContainer) renderPinyinQuizView(contentContainer);
}

function renderPinyinQuizView(container) {
  const data = pinyinGuideData || {};
  const questions = data.earTrainingQuiz || [];

  const answeredCount = Object.keys(pinyinQuizAnswers).length;
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (pinyinQuizAnswers[idx] !== undefined) {
      if (q.options[pinyinQuizAnswers[idx]] && q.options[pinyinQuizAnswers[idx]].isCorrect) {
        correctCount++;
      }
    }
  });

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Quiz Header -->
      <div class="glass-card rounded-2xl p-5 bg-gradient-to-r from-sky-50 via-white to-amber-50 dark:from-[#1c222d] dark:via-[#161B22] dark:to-[#161B22] border border-sky-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-2">
            <span>🎧</span>
            <span>Thử Thách Luyện Tai & Phản Xạ Ngữ Âm Pinyin</span>
          </h3>
          <p class="text-xs text-stone-600 dark:text-stone-400">
            Lắng nghe âm thanh và chọn câu trả lời đúng nhất. Rèn luyện phản xạ phân biệt âm bật hơi và thanh điệu.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="px-3.5 py-1.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300 font-bold text-xs">
            Điểm: ${correctCount} / ${questions.length} đúng
          </div>
          <button onclick="resetPinyinQuiz()" class="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-50 cursor-pointer">
            Làm lại
          </button>
        </div>
      </div>

      <!-- Question Cards -->
      <div class="space-y-4">
        ${questions.map((q, idx) => {
          const userSelected = pinyinQuizAnswers[idx];
          const hasAnswered = userSelected !== undefined;

          return `
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-xs space-y-3.5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span class="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-400 flex items-center justify-center text-xs font-black">
                    ${idx + 1}
                  </span>
                  <span>${escapeHtml(q.question)}</span>
                </span>

                <button onclick="playPinyinAudio('${escapeHtml(q.audioTarget)}')" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-rose-700 text-white font-bold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0">
                  <i data-lucide="volume-2" class="w-4 h-4"></i>
                  <span>Phát âm thanh câu hỏi</span>
                </button>
              </div>

              <!-- Options -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${q.options.map((opt, optIdx) => {
                  let btnCls = 'p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ';
                  if (!hasAnswered) {
                    btnCls += 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-amber-400 text-stone-800 dark:text-stone-200';
                  } else {
                    if (opt.isCorrect) {
                      btnCls += 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-black';
                    } else if (userSelected === optIdx) {
                      btnCls += 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-300';
                    } else {
                      btnCls += 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-400 opacity-60';
                    }
                  }

                  return `
                    <button onclick="answerPinyinQuiz(${idx}, ${optIdx})" class="${btnCls}">
                      <span>${escapeHtml(opt.label)}</span>
                      ${hasAnswered && opt.isCorrect ? '<span class="text-emerald-600">✓ Đúng</span>' : ''}
                      ${hasAnswered && userSelected === optIdx && !opt.isCorrect ? '<span class="text-rose-600">✗ Sai</span>' : ''}
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Explanation after answered -->
              ${hasAnswered ? `
                <div class="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  <strong>Giải thích:</strong> ${escapeHtml(q.explain)}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
