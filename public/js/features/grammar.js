// Module state
let activeGrammarCategory = 'all';
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
    renderMindmap();
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
  if (tabGrammar) refreshIcons(tabGrammar);
}

function filterGrammarCategory(cat) {
  activeGrammarCategory = cat;
  const categories = ['all', 'comparison', 'ba_bei', 'complements', 'particles_adverbs', 'fixed_connectors'];
  categories.forEach(c => {
    const el = document.getElementById(`btn-grammar-${c}`);
    if (!el) return;
    if (c === cat) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-2xs transition-all whitespace-nowrap';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200 transition-all whitespace-nowrap';
    }
  });
  renderGrammarCompendium();
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

function renderGrammarCompendium() {
  const container = document.getElementById('grammarGridContainer');
  if (!container) return;

  let filtered = grammarData;
  if (activeGrammarCategory !== 'all') {
    filtered = filtered.filter(item => item.category === activeGrammarCategory);
  }

  if (grammarSearchQuery) {
    filtered = filtered.filter(item => {
      const examplesText = (item.examples || []).map(e => `${e.hanzi} ${e.pinyin} ${e.vi}`).join(' ');
      const rulesText = (item.rules || []).join(' ');
      const target = `${item.title} ${item.formula} ${item.explanation} ${item.mistakes} ${examplesText} ${rulesText}`.toLowerCase();
      return target.includes(grammarSearchQuery);
    });
  }

  const badgeEl = document.getElementById('grammarCountBadge');
  if (badgeEl) {
    badgeEl.innerText = `${filtered.length} / ${grammarData.length} Chuyên Đề`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400">
        <i data-lucide="compass" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>
        <p class="font-bold text-slate-600">Không tìm thấy chủ điểm ngữ pháp phù hợp</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="glass-card rounded-2xl p-6 border border-indigo-200/80 hover:border-indigo-400 transition-all space-y-4 relative overflow-hidden bg-white/95 shadow-xs">
      <!-- Card Header -->
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200 inline-block mb-1.5">
            ${item.level} • ${item.categoryName}
          </span>
          <h3 class="text-base lg:text-lg font-black text-slate-900 tracking-tight">${item.title}</h3>
        </div>
      </div>

      <!-- Formula Pill Banner -->
      <div class="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80">
        <span class="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">CÔNG THỨC CHUẨN:</span>
        <code class="font-mono font-bold text-xs lg:text-sm text-indigo-950 block">${item.formula}</code>
      </div>

      <!-- Explanation -->
      <p class="text-xs text-slate-700 leading-relaxed">
        ${item.explanation}
      </p>

      <!-- Rules List -->
      ${item.rules && item.rules.length > 0 ? `
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Quy tắc ứng dụng:</span>
          <ul class="space-y-1.5">
            ${item.rules.map(rule => `
              <li class="flex items-start gap-2 text-slate-700">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5"></i>
                <span>${rule}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Common Mistakes Box -->
      ${item.mistakes ? `
        <div class="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-1">
          <span class="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">⚠️ Lỗi kinh điển người Việt hay mắc:</span>
          <p class="font-medium">${item.mistakes}</p>
        </div>
      ` : ''}

      <!-- Example Sentences -->
      ${item.examples && item.examples.length > 0 ? `
        <div class="space-y-2.5 pt-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ví dụ minh họa:</span>
          ${item.examples.map(ex => `
            <div class="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-hanzi font-bold text-slate-900 text-sm">${ex.hanzi}</span>
                <div class="inline-flex items-center gap-0.5">
                  <button onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'female')" class="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe giọng Nữ">👩 Nữ</button>
                  <button onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'male')" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe giọng Nam">👨 Nam</button>
                </div>
              </div>
              <p class="text-indigo-700 font-sans text-[11px]">${ex.pinyin}</p>
              <p class="text-slate-600">${ex.vi}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');

  refreshIcons();
}
