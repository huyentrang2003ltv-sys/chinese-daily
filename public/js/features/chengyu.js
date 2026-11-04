// Module state
let activeChengyuCategory = 'all';
let chengyuSearchQuery = '';

// =========================================================================
// 3. KHO ĐIỂN TÍCH THÀNH NGỮ 4 CHỮ (CHENGYU)
// =========================================================================
function filterChengyuCategory(cat) {
  activeChengyuCategory = cat;
  const categories = ['all', 'wisdom', 'diligence', 'history', 'caution', 'daily'];
  categories.forEach(c => {
    const el = document.getElementById(`btn-chengyu-${c}`);
    if (!el) return;
    if (c === cat) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-all whitespace-nowrap cursor-pointer';
    }
  });
  renderChengyu();
}

function setupChengyuSearch() {
  const input = document.getElementById('chengyuSearchInput');
  if (!input || input.dataset.bound) return;
  input.dataset.bound = '1';
  input.addEventListener('input', debounce((e) => {
    chengyuSearchQuery = e.target.value.trim().toLowerCase();
    renderChengyu();
  }, 120));
}

function renderChengyu() {
  const container = document.getElementById('chengyuGridContainer');
  if (!container) return;

  let filtered = chengyuData;
  if (activeChengyuCategory !== 'all') {
    filtered = filtered.filter(item => item.category === activeChengyuCategory);
  }

  if (chengyuSearchQuery) {
    filtered = filtered.filter(item => {
      const target = `${item.chengyu} ${item.pinyin} ${item.hanviet} ${item.literal} ${item.figurative} ${item.story} ${item.lesson}`.toLowerCase();
      return target.includes(chengyuSearchQuery);
    });
  }

  const badgeEl = document.getElementById('chengyuCountBadge');
  if (badgeEl) {
    badgeEl.innerText = `${filtered.length} / ${chengyuData.length} Điển Tích`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400">
        <i data-lucide="scroll" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>
        <p class="font-bold text-slate-600">Không tìm thấy thành ngữ phù hợp</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="glass-card rounded-2xl p-6 border border-amber-200/80 hover:border-amber-400 transition-all space-y-4 relative overflow-hidden bg-white/95 shadow-xs">
      <!-- Top Title Bar -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="flex items-center gap-3 flex-wrap">
            <h3 onclick="openWritingModal(${jsArg(item.chengyu)}, ${jsArg(item.pinyin)}, ${jsArg(`Thành ngữ: ${item.chengyu} - ${item.figurative || ''}`)})" class="font-hanzi text-3xl font-black text-slate-900 tracking-wide cursor-pointer hover:text-[#8B1E1E] transition-colors" title="Nhấn vào chữ để xem và tập viết nét">${item.chengyu}</h3>
            <div class="inline-flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
              <button onclick="playChineseTTS(${jsArg(item.chengyu)}, 'female')" class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-colors cursor-pointer" title="Phát âm thành ngữ giọng Nữ">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS(${jsArg(item.chengyu)}, 'male')" class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-colors cursor-pointer" title="Phát âm thành ngữ giọng Nam">
                👨 Nam
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm font-bold text-amber-800">${item.pinyin}</span>
            <span class="text-xs text-slate-400">•</span>
            <span class="text-xs font-bold text-slate-600">Hán Việt: ${item.hanviet}</span>
          </div>
        </div>

        <span class="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
          ${item.categoryName}
        </span>
      </div>

      <!-- Meaning Box -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
          <span class="font-bold text-amber-900 block mb-1">🌱 Nghĩa Đen:</span>
          <p class="text-slate-700 leading-relaxed">${item.literal}</p>
        </div>
        <div class="p-3 rounded-xl bg-rose-50/50 border border-rose-100">
          <span class="font-bold text-rose-900 block mb-1">🎯 Nghĩa Bóng & Ứng Dụng:</span>
          <p class="text-slate-700 leading-relaxed">${item.figurative}</p>
        </div>
      </div>

      <!-- Historical Story -->
      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <div class="flex items-center gap-2 text-xs font-bold text-slate-700">
          <i data-lucide="book-open" class="w-3.5 h-3.5 text-amber-600"></i>
          <span>Điển Tích Lịch Sử:</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed italic">
          "${item.story}"
        </p>
      </div>

      <!-- Moral Takeaway -->
      <div class="p-3 rounded-xl bg-amber-100/60 border border-amber-300/80 text-xs text-amber-950 font-medium flex items-start gap-2">
        <i data-lucide="lightbulb" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
        <div>
          <strong class="font-bold">Bài học nhân sinh:</strong> ${item.lesson}
        </div>
      </div>

      <!-- Real-world HSK Example -->
      ${item.example ? `
        <div class="p-3.5 rounded-xl bg-teal-50/40 border border-teal-200/70 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-teal-900 text-[11px] uppercase">Ví dụ câu thực tế:</span>
            <div class="inline-flex items-center gap-1">
              <button onclick="playChineseTTS(${jsArg(item.example.hanzi)}, 'female')" class="text-rose-700 hover:text-rose-900 flex items-center gap-1 font-bold text-[11px] px-1.5 py-0.5 rounded bg-white border border-rose-200 cursor-pointer" title="Nghe ví dụ giọng Nữ">
                <i data-lucide="volume-2" class="w-3 h-3 text-rose-600"></i>
                <span>👩 Nữ</span>
              </button>
              <button onclick="playChineseTTS(${jsArg(item.example.hanzi)}, 'male')" class="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-bold text-[11px] px-1.5 py-0.5 rounded bg-white border border-teal-200 cursor-pointer" title="Nghe ví dụ giọng Nam">
                <i data-lucide="volume-2" class="w-3 h-3 text-teal-600"></i>
                <span>👨 Nam</span>
              </button>
            </div>
          </div>
          <p class="font-hanzi font-bold text-slate-800 text-sm">${item.example.hanzi}</p>
          <p class="text-teal-700 font-sans">${item.example.pinyin}</p>
          <p class="text-slate-600">${item.example.vi}</p>
        </div>
      ` : ''}

      <!-- Bottom Toolbar -->
      <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
        <button onclick="toggleSaveWord(${jsArg(item.chengyu)}, ${jsArg(item.pinyin)}, ${jsArg(item.figurative)}, 6)" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors">
          <i data-lucide="bookmark" class="w-3.5 h-3.5 text-amber-600"></i>
          <span>Lưu Thành Ngữ</span>
        </button>
        <button onclick="openWritingModal(${jsArg(item.chengyu)}, ${jsArg(item.pinyin)}, ${jsArg(`Thành ngữ: ${item.chengyu} - ${item.figurative || ''}`)});" class="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors cursor-pointer">
          <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
          <span>Tập viết từng nét chữ</span>
        </button>
      </div>
    </div>
  `).join('');

  refreshIcons();
}
