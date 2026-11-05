// Module state
let activeGrammarCategory = 'all';
let activeGrammarLevel = 'all';
let activeGrammarViewMode = 'mindmap';
let grammarSearchQuery = '';

// =========================================================================
// 5. CẨM NANG NGỮ PHÁP TIẾNG TRUNG CHUYÊN SÂU (GRAMMAR)
// =========================================================================
function setGrammarViewMode(mode) {
  activeGrammarViewMode = mode;
  const mindmapView = document.getElementById('grammar-view-mindmap');
  const compendiumView = document.getElementById('grammar-view-compendium');
  const btnMindmap = document.getElementById('btn-grammar-view-mindmap');
  const btnCompendium = document.getElementById('btn-grammar-view-compendium');

  if (mode === 'mindmap') {
    if (mindmapView) mindmapView.classList.remove('hidden');
    if (compendiumView) compendiumView.classList.add('hidden');
    if (btnMindmap) {
      btnMindmap.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-[#4A306D] to-[#613D8F] text-white shadow-xs cursor-pointer';
    }
    if (btnCompendium) {
      btnCompendium.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all text-stone-700 hover:text-stone-900 hover:bg-white/80 cursor-pointer';
    }
    if (typeof renderMindmap === 'function') renderMindmap();
  } else {
    if (mindmapView) mindmapView.classList.add('hidden');
    if (compendiumView) compendiumView.classList.remove('hidden');
    if (btnCompendium) {
      btnCompendium.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-[#4A306D] to-[#613D8F] text-white shadow-xs cursor-pointer';
    }
    if (btnMindmap) {
      btnMindmap.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all text-stone-700 hover:text-stone-900 hover:bg-white/80 cursor-pointer';
    }
    renderGrammarCompendium();
  }
  const tabGrammar = document.getElementById('tab-grammar');
  if (tabGrammar && typeof refreshIcons === 'function') refreshIcons(tabGrammar);
}

function filterGrammarCategory(cat) {
  activeGrammarCategory = cat;
  const categories = ['all', 'sentence_structure', 'comparison', 'ba_bei', 'complements', 'particles_adverbs', 'fixed_connectors'];
  categories.forEach(c => {
    const el = document.getElementById(`btn-grammar-${c}`);
    if (!el) return;
    if (c === cat) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-all whitespace-nowrap cursor-pointer';
    }
  });
  renderGrammarCompendium();
}

function filterGrammarLevel(lvl) {
  activeGrammarLevel = lvl;
  const levels = ['all', 'hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5', 'hsk6'];
  levels.forEach(l => {
    const el = document.getElementById(`btn-grammar-lvl-${l}`);
    if (!el) return;
    if (l === lvl) {
      el.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-all whitespace-nowrap cursor-pointer';
    }
  });
  renderGrammarCompendium();
}

function getActiveGrammarLevel() {
  return activeGrammarLevel;
}

function setupGrammarSearch() {
  const input = document.getElementById('grammarSearchInput');
  if (!input || input.dataset.bound) return;
  input.dataset.bound = '1';
  input.addEventListener('input', debounce((e) => {
    grammarSearchQuery = e.target.value.trim().toLowerCase();
    renderGrammarCompendium();
  }, 120));
}

function checkGrammarQuiz(itemId, optIdx) {
  if (!grammarData) return;
  const item = grammarData.find(x => x.id === itemId);
  if (!item || !item.practiceQuiz) return;

  const quiz = item.practiceQuiz;
  const isCorrect = optIdx === quiz.answer;
  const resultEl = document.getElementById(`quiz-result-${itemId}`);

  // Update button states
  const buttons = document.querySelectorAll(`.quiz-btn-${itemId}`);
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === quiz.answer) {
      btn.className = `quiz-btn-${itemId} p-2.5 rounded-xl text-left text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-2 border-emerald-500`;
    } else if (idx === optIdx && !isCorrect) {
      btn.className = `quiz-btn-${itemId} p-2.5 rounded-xl text-left text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border-2 border-rose-500`;
    } else {
      btn.className = `quiz-btn-${itemId} p-2.5 rounded-xl text-left text-xs font-medium opacity-50 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700`;
    }
  });

  if (resultEl) {
    resultEl.classList.remove('hidden');
    if (isCorrect) {
      resultEl.className = 'p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-900 dark:text-emerald-300 text-xs space-y-1 animate-fade-in';
      resultEl.innerHTML = `
        <div class="font-bold flex items-center gap-1.5">
          <span>🎉 Chính xác! (+10 EXP)</span>
        </div>
        <p class="text-[11px] leading-relaxed">${escapeHtml(quiz.explain || '')}</p>
      `;
      if (typeof addExp === 'function') {
        addExp(10, `Làm đúng trắc nghiệm ngữ pháp: ${item.title}`);
      }
    } else {
      resultEl.className = 'p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-900 dark:text-rose-300 text-xs space-y-1 animate-fade-in';
      resultEl.innerHTML = `
        <div class="font-bold flex items-center gap-1.5">
          <span>❌ Chưa chính xác!</span>
        </div>
        <p class="text-[11px] leading-relaxed"><strong>Giải thích:</strong> ${escapeHtml(quiz.explain || '')}</p>
      `;
    }
  }
}

function renderGrammarCompendium() {
  const container = document.getElementById('grammarGridContainer');
  if (!container) return;

  let filtered = grammarData || [];

  // Category filter
  if (activeGrammarCategory !== 'all') {
    filtered = filtered.filter(item => item.category === activeGrammarCategory);
  }

  // Level filter
  if (activeGrammarLevel !== 'all') {
    const targetLvl = activeGrammarLevel.replace('hsk', 'hsk ');
    filtered = filtered.filter(item => {
      const itemLvl = (item.level || '').toLowerCase().replace(/\s+/g, '');
      return itemLvl.includes(activeGrammarLevel);
    });
  }

  // Search filter
  if (grammarSearchQuery) {
    filtered = filtered.filter(item => {
      const examplesText = (item.examples || []).map(e => `${e.hanzi} ${e.pinyin} ${e.vi}`).join(' ');
      const rulesText = (item.rules || []).join(' ');
      const target = `${item.title} ${item.formula} ${item.explanation} ${item.mistakes} ${examplesText} ${rulesText}`.toLowerCase();
      return target.includes(grammarSearchQuery);
    });
  }

  const badgeEl = document.getElementById('grammarCountBadge');
  if (badgeEl && grammarData) {
    badgeEl.innerText = `${filtered.length} / ${grammarData.length} Chuyên Đề`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-stone-400">
        <i data-lucide="compass" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>
        <p class="font-bold text-stone-600 dark:text-stone-400">Không tìm thấy chuyên đề ngữ pháp phù hợp với bộ lọc</p>
      </div>
    `;
    if (typeof refreshIcons === 'function') refreshIcons();
    return;
  }

  container.innerHTML = filtered.map(item => {
    let levelBadgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if ((item.level || '').includes('1')) levelBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
    else if ((item.level || '').includes('2')) levelBadgeColor = 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950 dark:text-teal-300';
    else if ((item.level || '').includes('3')) levelBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300';
    else if ((item.level || '').includes('4')) levelBadgeColor = 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300';
    else if ((item.level || '').includes('5')) levelBadgeColor = 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300';
    else if ((item.level || '').includes('6')) levelBadgeColor = 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300';

    return `
      <div class="glass-card rounded-3xl p-6 border-2 border-stone-200/90 dark:border-stone-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all space-y-4 relative overflow-hidden bg-white/95 dark:bg-[#161B22] shadow-sm">
        <!-- Card Header -->
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-1.5">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black border inline-block ${levelBadgeColor}">
                ${escapeHtml(item.level || 'HSK')}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                ${escapeHtml(item.categoryName || 'Ngữ pháp')}
              </span>
            </div>
            <h3 class="text-base lg:text-lg font-black text-stone-900 dark:text-stone-100 tracking-tight font-serif-luxury">
              ${escapeHtml(item.title)}
            </h3>
          </div>
        </div>

        <!-- Formula Pill Banner -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800 border border-amber-200/80 dark:border-stone-700 shadow-2xs">
          <span class="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block mb-1">CÔNG THỨC CHUẨN:</span>
          <code class="font-mono font-bold text-xs lg:text-sm text-stone-900 dark:text-amber-200 block">${escapeHtml(item.formula)}</code>
        </div>

        <!-- Explanation -->
        <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
          ${escapeHtml(item.explanation)}
        </p>

        <!-- Rules List -->
        ${item.rules && item.rules.length > 0 ? `
          <div class="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-750 space-y-2 text-xs">
            <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Quy tắc ứng dụng:</span>
            <ul class="space-y-1.5">
              ${item.rules.map(rule => `
                <li class="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                  <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"></i>
                  <span>${escapeHtml(rule)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Common Mistakes Box -->
        ${item.mistakes ? `
          <div class="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-950 dark:text-rose-300 space-y-1">
            <span class="text-[10px] font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider block">⚠️ Lỗi kinh điển người Việt hay mắc:</span>
            <p class="font-medium leading-relaxed">${escapeHtml(item.mistakes)}</p>
          </div>
        ` : ''}

        <!-- Example Sentences -->
        ${item.examples && item.examples.length > 0 ? `
          <div class="space-y-2.5 pt-1">
            <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Ví dụ minh họa song ngữ:</span>
            ${item.examples.map(ex => `
              <div class="p-3 rounded-2xl bg-stone-50/80 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-chinese font-bold text-stone-900 dark:text-stone-100 text-sm">${escapeHtml(ex.hanzi)}</span>
                  <div class="inline-flex items-center gap-1">
                    <button onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'female')" class="px-2 py-0.5 rounded-lg bg-white dark:bg-stone-700 hover:bg-rose-50 text-rose-800 dark:text-rose-300 border border-stone-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe giọng Nữ">👩 Nữ</button>
                    <button onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'male')" class="px-2 py-0.5 rounded-lg bg-white dark:bg-stone-700 hover:bg-blue-50 text-blue-800 dark:text-blue-300 border border-stone-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe giọng Nam">👨 Nam</button>
                  </div>
                </div>
                <p class="text-amber-800 dark:text-amber-400 font-sans text-[11px]">${escapeHtml(ex.pinyin)}</p>
                <p class="text-stone-600 dark:text-stone-400">${escapeHtml(ex.vi)}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Interactive Practice Quiz -->
        ${item.practiceQuiz ? `
          <div class="p-4 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/80 dark:border-stone-700 space-y-2.5 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">🎯 Trắc nghiệm kiểm tra nhanh:</span>
              <span class="text-[10px] text-stone-400 font-medium">Bấm chọn đáp án</span>
            </div>
            <p class="font-bold text-stone-900 dark:text-stone-100">${escapeHtml(item.practiceQuiz.question)}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              ${item.practiceQuiz.options.map((opt, oIdx) => `
                <button 
                  type="button"
                  onclick="checkGrammarQuiz(${jsArg(item.id)}, ${oIdx})"
                  class="quiz-btn-${item.id} p-2.5 rounded-xl text-left text-[11px] font-medium bg-white dark:bg-stone-900 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                >
                  ${escapeHtml(opt)}
                </button>
              `).join('')}
            </div>
            <div id="quiz-result-${item.id}" class="hidden"></div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  if (typeof refreshIcons === 'function') refreshIcons();
}
