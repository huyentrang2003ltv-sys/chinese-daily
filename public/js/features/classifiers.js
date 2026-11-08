// public/js/features/classifiers.js
// =========================================================================
// BÁCH KHOA LƯỢNG TỪ THỰC CHIẾN (汉语量词宝典 - Chinese Classifiers Compendium)
// Phân loại khoa học 6 nhóm lượng từ, cụm từ kết hợp chuẩn, bẫy HSK và trắc nghiệm
// =========================================================================

let activeClassifierCategory = 'all';
let classifierSearchQuery = '';
let classifierQuizAnswers = {};

const CLASSIFIER_CATEGORIES = [
  { id: 'all', label: 'Tất Cả Lượng Từ', icon: 'layers' },
  { id: 'shape', label: 'Hình Dáng & Bề Mặt', icon: 'shapes' },
  { id: 'items', label: 'Đồ Dùng & Vật Dụng', icon: 'package' },
  { id: 'living', label: 'Động Vật & Con Người', icon: 'heart' },
  { id: 'vehicles_buildings', label: 'Xe Cộ & Kiến Trúc', icon: 'building' },
  { id: 'sets_measures', label: 'Tập Hợp & Đo Lường', icon: 'boxes' },
  { id: 'verbal', label: 'Động Lượng Từ (Hành Động)', icon: 'zap' }
];

const CATEGORY_STYLES = {
  shape: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  items: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  living: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  vehicles_buildings: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
  sets_measures: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  verbal: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
};

async function initClassifiers() {
  if (!classifiersData || classifiersData.length === 0) {
    if (typeof loadData === 'function') {
      try {
        await loadData('classifiers');
      } catch (err) {
        console.error('Không thể tải classifiers.json:', err);
      }
    }
  }

  renderClassifierCategoryTabs();
  renderClassifierCards();
  if (typeof refreshIcons === 'function') refreshIcons();
}

function renderClassifierCategoryTabs() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('classifierCategoryTabs');
  if (!container) return;

  const dataList = classifiersData || [];

  container.innerHTML = CLASSIFIER_CATEGORIES.map(cat => {
    const isActive = activeClassifierCategory === cat.id;
    const count = cat.id === 'all' 
      ? dataList.length 
      : dataList.filter(item => item.category === cat.id).length;

    const baseClass = isActive
      ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-md border-[#8B1E1E] font-bold'
      : 'bg-white hover:bg-amber-50/80 text-stone-700 hover:text-stone-900 border-stone-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 font-medium';

    return `
      <button 
        type="button" 
        onclick="filterClassifierCategory('${cat.id}')" 
        class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${baseClass}">
        <i data-lucide="${cat.icon}" class="w-3.5 h-3.5"></i>
        <span>${escapeHtml(cat.label)}</span>
        <span class="text-[11px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300'} font-bold">
          ${count}
        </span>
      </button>
    `;
  }).join('');
}

function filterClassifierCategory(catId) {
  activeClassifierCategory = catId;
  renderClassifierCategoryTabs();
  renderClassifierCards();
  if (typeof refreshIcons === 'function') refreshIcons();
}

function handleClassifierSearch(query) {
  classifierSearchQuery = (query || '').trim().toLowerCase();
  renderClassifierCards();
  if (typeof refreshIcons === 'function') refreshIcons();
}

function getFilteredClassifiers() {
  let list = classifiersData || [];
  if (activeClassifierCategory !== 'all') {
    list = list.filter(item => item.category === activeClassifierCategory);
  }
  if (classifierSearchQuery) {
    const q = classifierSearchQuery;
    list = list.filter(item => {
      const matchChar = item.char && item.char.toLowerCase().includes(q);
      const matchPy = item.pinyin && item.pinyin.toLowerCase().includes(q);
      const matchHv = item.hanviet && item.hanviet.toLowerCase().includes(q);
      const matchMeaning = item.meaning && item.meaning.toLowerCase().includes(q);
      const matchObjects = item.applicableObjects && item.applicableObjects.toLowerCase().includes(q);
      const matchColloc = (item.collocations || []).some(c => 
        (c.zh && c.zh.toLowerCase().includes(q)) || 
        (c.py && c.py.toLowerCase().includes(q)) || 
        (c.vi && c.vi.toLowerCase().includes(q))
      );
      return matchChar || matchPy || matchHv || matchMeaning || matchObjects || matchColloc;
    });
  }
  return list;
}

function renderClassifierCards() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('classifierGridContainer');
  const countLabel = document.getElementById('classifierFilteredCount');
  if (!container) return;

  const filtered = getFilteredClassifiers();
  if (countLabel) {
    countLabel.textContent = `Hiển thị ${filtered.length} / ${(classifiersData || []).length} lượng từ`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full glass-card rounded-2xl p-10 text-center text-stone-500 border border-amber-200 bg-white dark:bg-stone-900 shadow-xs space-y-2">
        <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800 dark:text-stone-200">Không tìm thấy lượng từ nào phù hợp với từ khóa "${escapeHtml(classifierSearchQuery)}".</p>
        <p class="text-xs text-stone-500">Hãy thử nhập từ Hán, phiên âm Pinyin, hoặc danh từ đi kèm (ví dụ: 张, cái, ly, cuốn, 帽子)...</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const badgeStyle = CATEGORY_STYLES[item.category] || 'bg-stone-50 text-stone-800 border-stone-200';
    const isAnswered = classifierQuizAnswers.hasOwnProperty(item.id);
    const selectedIdx = isAnswered ? classifierQuizAnswers[item.id] : null;

    // Collocations HTML
    const collocationsHtml = (item.collocations || []).map(c => `
      <div 
        onclick="if(typeof playChineseTTS==='function') playChineseTTS(${jsArg(c.zh)})" 
        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/90 text-stone-800 border border-amber-200/80 cursor-pointer transition-all shadow-2xs hover:scale-[1.02] group" 
        title="Nhấn để nghe phát âm: ${escapeHtml(c.zh)}">
        <span class="font-hanzi font-bold text-base text-[#8B1E1E] group-hover:text-red-700">${escapeHtml(c.zh)}</span>
        <span class="text-[11px] text-stone-500 font-mono">${escapeHtml(c.py)}</span>
        <span class="text-[11px] text-amber-900 font-medium">(${escapeHtml(c.vi)})</span>
        <i data-lucide="volume-2" class="w-3 h-3 text-stone-400 group-hover:text-[#8B1E1E] transition-colors ml-0.5"></i>
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
            onclick="checkClassifierQuiz('${item.id}', ${idx}, ${q.answer})" 
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
            <span>Luyện Tập Phản Xạ Nhanh:</span>
          </div>
          <p class="text-xs text-stone-600 dark:text-stone-400 font-medium">${escapeHtml(q.question)}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
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
        <div>
          <!-- Header: Large Hanzi & Badges -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <span 
                onclick="if(typeof openWritingModal==='function') openWritingModal(${jsArg(item.char)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})"
                class="font-hanzi text-4xl font-black text-stone-900 dark:text-white cursor-pointer hover:text-[#8B1E1E] transition-colors" 
                title="Nhấn để xem cách viết nét">
                ${escapeHtml(item.char)}
              </span>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-base font-bold font-mono text-[#8B1E1E] dark:text-rose-400">${escapeHtml(item.pinyin)}</span>
                  <span class="text-xs text-stone-500 font-medium px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">Âm Hán Việt: ${escapeHtml(item.hanviet)}</span>
                </div>
                <p class="text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5">${escapeHtml(item.meaning)}</p>
              </div>
            </div>

            <div class="flex flex-col items-end gap-1.5">
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}">
                ${escapeHtml(item.categoryName || item.category)}
              </span>
              <div class="flex items-center gap-1">
                <button 
                  onclick="if(typeof playChineseTTS==='function') playChineseTTS(${jsArg(item.char)}, 'female')" 
                  title="Nghe phát âm Nữ" 
                  class="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold cursor-pointer">
                  👩 Nữ
                </button>
                <button 
                  onclick="if(typeof playChineseTTS==='function') playChineseTTS(${jsArg(item.char)}, 'male')" 
                  title="Nghe phát âm Nam" 
                  class="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold cursor-pointer">
                  👨 Nam
                </button>
              </div>
            </div>
          </div>

          <!-- Applicable Objects -->
          <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 mb-3">
            <span class="font-bold text-[#8B1E1E] dark:text-rose-400">Đối tượng áp dụng: </span>
            <span>${escapeHtml(item.applicableObjects)}</span>
          </div>

          <!-- Collocations -->
          <div class="space-y-1.5 mb-3">
            <span class="text-[11px] font-bold uppercase tracking-wider text-stone-500">Cụm từ chuẩn kết hợp thường gặp:</span>
            <div class="flex flex-wrap gap-1.5">
              ${collocationsHtml}
            </div>
          </div>

          <!-- Example Sentence -->
          ${item.example ? `
            <div class="p-3 rounded-xl bg-amber-50/50 dark:bg-stone-800/40 border border-amber-200/60 dark:border-stone-700 space-y-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300 tracking-wider">Ví Dụ Thực Chiến:</span>
                <div class="flex items-center gap-1">
                  <button 
                    onclick="if(typeof playChineseTTS==='function') playChineseTTS(${jsArg(item.example.zh)}, 'female')" 
                    class="text-[10px] px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 font-bold cursor-pointer">
                    🔊 Nữ
                  </button>
                  <button 
                    onclick="if(typeof playChineseTTS==='function') playChineseTTS(${jsArg(item.example.zh)}, 'male')" 
                    class="text-[10px] px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 font-bold cursor-pointer">
                    🔊 Nam
                  </button>
                </div>
              </div>
              <p class="font-hanzi text-sm font-bold text-stone-900 dark:text-stone-100 leading-relaxed">${escapeHtml(item.example.zh)}</p>
              <p class="text-[11px] text-stone-500 font-mono leading-relaxed">${escapeHtml(item.example.py)}</p>
              <p class="text-xs text-stone-700 dark:text-stone-300 italic font-serif">"${escapeHtml(item.example.vi)}"</p>
            </div>
          ` : ''}

          <!-- Tip -->
          ${item.tip ? `
            <div class="mt-2.5 p-2 rounded-lg bg-orange-50/80 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 text-[11px] text-orange-900 dark:text-orange-300 font-medium leading-relaxed">
              ${escapeHtml(item.tip)}
            </div>
          ` : ''}
        </div>

        <!-- Mini Quiz -->
        ${quizHtml}
      </div>
    `;
  }).join('');
}

function checkClassifierQuiz(clfId, selectedIdx, correctIdx) {
  classifierQuizAnswers[clfId] = selectedIdx;
  renderClassifierCards();
  if (typeof refreshIcons === 'function') refreshIcons();
}

// Global window attachments for bundled mode
if (typeof window !== 'undefined') {
  window.initClassifiers = initClassifiers;
  window.filterClassifierCategory = filterClassifierCategory;
  window.handleClassifierSearch = handleClassifierSearch;
  window.renderClassifierCategoryTabs = renderClassifierCategoryTabs;
  window.renderClassifierCards = renderClassifierCards;
  window.checkClassifierQuiz = checkClassifierQuiz;
  window.getFilteredClassifiers = getFilteredClassifiers;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initClassifiers,
    filterClassifierCategory,
    handleClassifierSearch,
    renderClassifierCategoryTabs,
    renderClassifierCards,
    checkClassifierQuiz,
    getFilteredClassifiers,
    CLASSIFIER_CATEGORIES,
    CATEGORY_STYLES
  };
}

