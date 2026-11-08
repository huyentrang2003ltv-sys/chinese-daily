// public/js/features/complements.js
// =========================================================================
// BÁCH KHOA BỔ NGỮ TIẾNG HÁN TOÀN DIỆN (汉语补语宝典 - Chinese Complements Masterclass)
// 7 Nhóm bổ ngữ cốt lõi, công thức cấu trúc, bẫy HSK và trắc nghiệm phản xạ
// =========================================================================

let activeComplementCategory = 'all';
let complementSearchQuery = '';
let complementQuizAnswers = {};

const COMPLEMENT_CATEGORIES = [
  { id: 'all', label: 'Tất Cả Bổ Ngữ', icon: 'layers' },
  { id: 'result', label: 'Kết Quả (结果)', icon: 'check-circle' },
  { id: 'direction', label: 'Xu Hướng (趋向)', icon: 'compass' },
  { id: 'potential', label: 'Khả Năng (可能)', icon: 'zap' },
  { id: 'state_degree', label: 'Trạng Thái & Trình Độ (状态程度)', icon: 'gauge' },
  { id: 'duration_quantity', label: 'Thời Lượng & Số Lượng (时量数量)', icon: 'clock' },
  { id: 'action_measure', label: 'Động Lượng (动量)', icon: 'repeat' },
  { id: 'prepositional', label: 'Giới Từ (介词)', icon: 'map-pin' }
];

const COMPLEMENT_STYLES = {
  result: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  direction: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  potential: 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
  state_degree: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  duration_quantity: 'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
  action_measure: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  prepositional: 'bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800'
};

async function initComplements() {
  if (!complementsData || complementsData.length === 0) {
    if (typeof loadData === 'function') {
      try {
        await loadData('complements');
      } catch (err) {
        console.error('Không thể tải complements.json:', err);
      }
    }
  }

  renderComplementCategoryTabs();
  renderComplementCards();
  if (typeof refreshIcons === 'function') refreshIcons();
}

function renderComplementCategoryTabs() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('complementCategoryTabs');
  if (!container) return;

  const dataList = complementsData || [];

  container.innerHTML = COMPLEMENT_CATEGORIES.map(cat => {
    const isActive = activeComplementCategory === cat.id;
    const count = cat.id === 'all'
      ? dataList.length
      : dataList.filter(item => item.type === cat.id).length;

    const baseClass = isActive
      ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-md border-[#8B1E1E] font-bold'
      : 'bg-white hover:bg-amber-50/80 text-stone-700 hover:text-stone-900 border-stone-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 font-medium';

    return `
      <button 
        type="button" 
        onclick="filterComplementCategory('${cat.id}')" 
        class="px-3 py-1.5 rounded-xl text-xs sm:text-sm border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${baseClass}">
        <i data-lucide="${cat.icon}" class="w-3.5 h-3.5"></i>
        <span>${escapeHtml(cat.label)}</span>
        <span class="text-[11px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300'} font-bold">
          ${count}
        </span>
      </button>
    `;
  }).join('');
}

function filterComplementCategory(catId) {
  activeComplementCategory = catId;
  renderComplementCategoryTabs();
  renderComplementCards();
  if (typeof refreshIcons === 'function') refreshIcons();
}

function handleComplementSearch(query) {
  complementSearchQuery = (query || '').trim().toLowerCase();
  renderComplementCards();
  if (typeof refreshIcons === 'function') refreshIcons();
}

function getFilteredComplements() {
  let list = complementsData || [];
  if (activeComplementCategory !== 'all') {
    list = list.filter(item => item.type === activeComplementCategory);
  }
  if (complementSearchQuery) {
    const q = complementSearchQuery;
    list = list.filter(item => {
      const matchName = item.name && item.name.toLowerCase().includes(q);
      const matchMarker = item.marker && item.marker.toLowerCase().includes(q);
      const matchFormula = item.formula && item.formula.toLowerCase().includes(q);
      const matchExpl = item.deepExplanation && item.deepExplanation.toLowerCase().includes(q);
      const matchTraps = item.hskTraps && item.hskTraps.toLowerCase().includes(q);
      const matchColloc = (item.collocations || []).some(c =>
        (c.zh && c.zh.toLowerCase().includes(q)) ||
        (c.py && c.py.toLowerCase().includes(q)) ||
        (c.vi && c.vi.toLowerCase().includes(q))
      );
      return matchName || matchMarker || matchFormula || matchExpl || matchTraps || matchColloc;
    });
  }
  return list;
}

function renderComplementCards() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('complementGridContainer');
  const countLabel = document.getElementById('complementFilteredCount');
  if (!container) return;

  const filtered = getFilteredComplements();
  if (countLabel) {
    countLabel.textContent = `Hiển thị ${filtered.length} / ${(complementsData || []).length} bổ ngữ`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full glass-card rounded-2xl p-10 text-center text-stone-500 border border-amber-200 bg-white dark:bg-stone-900 shadow-xs space-y-2">
        <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800 dark:text-stone-200">Không tìm thấy bổ ngữ nào khớp với từ khóa "${escapeHtml(complementSearchQuery)}".</p>
        <p class="text-xs text-stone-500">Hãy thử tìm theo tên bổ ngữ, ký hiệu hoặc ví dụ (như: 完, 懂, 起来, 跑得快, 听不懂, 三天)...</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const badgeStyle = COMPLEMENT_STYLES[item.type] || 'bg-stone-50 text-stone-800 border-stone-200';
    const isAnswered = complementQuizAnswers.hasOwnProperty(item.id);
    const selectedIdx = isAnswered ? complementQuizAnswers[item.id] : null;

    // Collocations HTML
    const collocationsHtml = (item.collocations || []).map(c => `
      <div 
        onclick="if(typeof playChineseTTS==='function') playChineseTTS(${jsArg(c.zh)})"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-stone-800 border border-amber-200/80 cursor-pointer transition-all shadow-2xs hover:scale-[1.02] group"
        title="Nhấn để nghe phát âm">
        <span class="font-hanzi font-bold text-sm text-[#8B1E1E] group-hover:text-red-700">${escapeHtml(c.zh)}</span>
        <span class="text-[11px] text-stone-500 font-mono">${escapeHtml(c.py)}</span>
        <span class="text-[11px] text-amber-900 font-medium">(${escapeHtml(c.vi)})</span>
        <i data-lucide="volume-2" class="w-2.5 h-2.5 text-stone-400 group-hover:text-[#8B1E1E] transition-colors ml-0.5"></i>
      </div>
    `).join('');

    // Examples HTML
    const examplesHtml = (item.examples || []).map(ex => `
      <div class="p-2.5 rounded-xl bg-amber-50/50 dark:bg-stone-800/40 border border-amber-200/60 dark:border-stone-700 space-y-1 text-xs">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300 tracking-wider">Ví Dụ Ngữ Cảnh:</span>
          <div class="flex items-center gap-1">
            <button 
              onclick="if(typeof playChineseTTS==='function') playChineseTTS(${jsArg(ex.zh)}, 'female')" 
              class="text-[10px] px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 font-bold cursor-pointer">
              🔊 Nữ
            </button>
            <button 
              onclick="if(typeof playChineseTTS==='function') playChineseTTS(${jsArg(ex.zh)}, 'male')" 
              class="text-[10px] px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 font-bold cursor-pointer">
              🔊 Nam
            </button>
          </div>
        </div>
        <p class="font-hanzi text-sm font-bold text-stone-900 dark:text-stone-100 leading-relaxed">${escapeHtml(ex.zh)}</p>
        <p class="text-[11px] text-stone-500 font-mono">${escapeHtml(ex.py)}</p>
        <p class="text-xs text-stone-700 dark:text-stone-300 italic font-serif">"${escapeHtml(ex.vi)}"</p>
      </div>
    `).join('');

    // Quiz HTML
    let quizHtml = '';
    if (item.quiz) {
      const q = item.quiz;
      const optionsHtml = q.options.map((opt, idx) => {
        let optStyle = 'bg-stone-50 hover:bg-amber-50 border-stone-200 text-stone-700 hover:border-amber-300';
        if (isAnswered) {
          if (idx === q.answer) {
            optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
          } else if (idx === selectedIdx) {
            optStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
          } else {
            optStyle = 'bg-stone-50/50 border-stone-200 text-stone-400 opacity-60';
          }
        }
        return `
          <button 
            type="button" 
            onclick="checkComplementQuiz('${item.id}', ${idx}, ${q.answer})" 
            ${isAnswered ? 'disabled' : ''}
            class="w-full text-left px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${optStyle}">
            <span>${escapeHtml(opt)}</span>
            ${isAnswered && idx === q.answer ? '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i>' : ''}
            ${isAnswered && idx === selectedIdx && idx !== q.answer ? '<i data-lucide="x" class="w-3.5 h-3.5 text-rose-600"></i>' : ''}
          </button>
        `;
      }).join('');

      quizHtml = `
        <div class="mt-4 pt-3 border-t border-stone-200/80 dark:border-stone-800 space-y-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
            <i data-lucide="help-circle" class="w-3.5 h-3.5 text-amber-600"></i>
            <span>Bài Tập Phản Xạ Bổ Ngữ:</span>
          </div>
          <p class="text-xs text-stone-600 dark:text-stone-400 font-medium">${escapeHtml(q.question)}</p>
          <div class="space-y-1.5">
            ${optionsHtml}
          </div>
          ${isAnswered ? `
            <div class="p-2 rounded-lg ${selectedIdx === q.answer ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'} text-[11px] leading-relaxed flex items-start gap-1.5">
              <i data-lucide="${selectedIdx === q.answer ? 'sparkles' : 'alert-circle'}" class="w-3.5 h-3.5 mt-0.5 shrink-0"></i>
              <div>
                <span class="font-bold">${selectedIdx === q.answer ? 'Chính xác! ' : 'Chưa đúng rồi! '}</span>
                <span>${escapeHtml(q.explain)}</span>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    return `
      <div class="glass-card rounded-2xl p-5 border border-amber-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div class="space-y-3">
          <!-- Card Header -->
          <div class="flex items-start justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
            <div>
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}">
                  ${escapeHtml(item.typeName)}
                </span>
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100/70 text-amber-900 border border-amber-200">
                  ${escapeHtml(item.marker)}
                </span>
              </div>
              <h3 class="text-base sm:text-lg font-black font-serif-luxury text-stone-900 dark:text-white">
                ${escapeHtml(item.name)}
              </h3>
            </div>
          </div>

          <!-- Formula & Negation -->
          <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1 text-xs">
            <div class="flex items-start gap-2">
              <span class="font-bold text-[#8B1E1E] dark:text-rose-400 whitespace-nowrap">📌 Cấu trúc:</span>
              <span class="font-mono font-bold text-stone-800 dark:text-stone-200">${escapeHtml(item.formula)}</span>
            </div>
            ${item.negationRule ? `
              <div class="flex items-start gap-2 pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                <span class="font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">⚠️ Phủ định:</span>
                <span class="text-stone-600 dark:text-stone-300">${escapeHtml(item.negationRule)}</span>
              </div>
            ` : ''}
          </div>

          <!-- Deep Explanation -->
          <div class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
            <span class="font-bold text-stone-900 dark:text-white">Bản chất ngữ nghĩa: </span>
            <span>${escapeHtml(item.deepExplanation)}</span>
          </div>

          <!-- Collocations -->
          ${item.collocations && item.collocations.length > 0 ? `
            <div class="space-y-1.5">
              <span class="text-[11px] font-bold uppercase tracking-wider text-stone-500">Cụm từ chuẩn thường gặp:</span>
              <div class="flex flex-wrap gap-1.5">
                ${collocationsHtml}
              </div>
            </div>
          ` : ''}

          <!-- Bilingual Examples -->
          ${examplesHtml}

          <!-- HSK Traps -->
          ${item.hskTraps ? `
            <div class="p-2.5 rounded-lg bg-orange-50/80 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 text-[11px] text-orange-900 dark:text-orange-300 font-medium leading-relaxed">
              ${escapeHtml(item.hskTraps)}
            </div>
          ` : ''}
        </div>

        <!-- Quiz -->
        ${quizHtml}
      </div>
    `;
  }).join('');
}

function checkComplementQuiz(cmpId, selectedIdx, correctIdx) {
  complementQuizAnswers[cmpId] = selectedIdx;
  renderComplementCards();
  if (typeof refreshIcons === 'function') refreshIcons();
}

// Global window attachments
if (typeof window !== 'undefined') {
  window.initComplements = initComplements;
  window.filterComplementCategory = filterComplementCategory;
  window.handleComplementSearch = handleComplementSearch;
  window.renderComplementCategoryTabs = renderComplementCategoryTabs;
  window.renderComplementCards = renderComplementCards;
  window.checkComplementQuiz = checkComplementQuiz;
  window.getFilteredComplements = getFilteredComplements;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initComplements,
    filterComplementCategory,
    handleComplementSearch,
    renderComplementCategoryTabs,
    renderComplementCards,
    checkComplementQuiz,
    getFilteredComplements,
    COMPLEMENT_CATEGORIES,
    COMPLEMENT_STYLES
  };
}
