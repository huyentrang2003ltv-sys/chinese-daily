// Module state
let activeRadicalStroke = 'all';
let radicalSearchQuery = '';

// =========================================================================
// 2. BÁCH KHOA TOÀN THƯ 214 BỘ THỦ KHANG HY
// =========================================================================
function filterRadicalStrokes(stroke) {
  activeRadicalStroke = stroke;
  const strokeButtons = [
    { id: 'btn-rad-stroke-all', val: 'all' },
    { id: 'btn-rad-stroke-1', val: 1 },
    { id: 'btn-rad-stroke-2', val: 2 },
    { id: 'btn-rad-stroke-3', val: 3 },
    { id: 'btn-rad-stroke-4', val: 4 },
    { id: 'btn-rad-stroke-5', val: 5 },
    { id: 'btn-rad-stroke-6', val: 6 },
    { id: 'btn-rad-stroke-7', val: 7 }
  ];

  strokeButtons.forEach(b => {
    const el = document.getElementById(b.id);
    if (!el) return;
    if (b.val === stroke) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-amber-200 transition-all whitespace-nowrap';
    }
  });

  renderRadicals();
}

function setupRadicalSearch() {
  const input = document.getElementById('radicalSearchInput');
  if (!input || input.dataset.bound) return;
  input.dataset.bound = '1';
  input.addEventListener('input', debounce((e) => {
    radicalSearchQuery = e.target.value.trim().toLowerCase();
    renderRadicals();
  }, 120));
}

function renderRadicals() {
  const container = document.getElementById('radicalsGridContainer');
  if (!container) return;

  if (!radicalsData || radicalsData.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-stone-500">
        <i data-lucide="loader-2" class="w-8 h-8 mx-auto mb-3 animate-spin text-[#8B1E1E]"></i>
        <p class="font-bold text-stone-700">Đang tải danh mục 214 Bộ Thủ Khang Hy...</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  let filtered = radicalsData;

  // Filter by stroke count
  if (activeRadicalStroke !== 'all') {
    const strokeNum = parseInt(activeRadicalStroke);
    if (strokeNum === 7) {
      filtered = filtered.filter(r => (r.strokes || 0) >= 7);
    } else {
      filtered = filtered.filter(r => (r.strokes || 0) === strokeNum);
    }
  }

  // Filter by search query
  if (radicalSearchQuery) {
    filtered = filtered.filter(r => {
      const charStr = r.char || r.radical || '';
      const varStr = Array.isArray(r.variants) ? r.variants.join(' ') : (r.variant || '');
      const exStr = (r.examples || []).join(' ');
      const target = `${charStr} ${varStr} ${r.pinyin || ''} ${r.hanviet || ''} ${r.meaning || ''} ${exStr}`.toLowerCase();
      return target.includes(radicalSearchQuery);
    });
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-stone-400">
        <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 opacity-40 text-stone-400"></i>
        <p class="font-bold text-stone-700">Không tìm thấy bộ thủ phù hợp</p>
        <p class="text-xs text-stone-400 mt-1">Hãy thử tìm theo chữ Hán, phiên âm pinyin hoặc âm Hán Việt khác</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  container.innerHTML = filtered.map(r => {
    const char = r.char || r.radical || '';
    const id = r.id || r.number || '';
    const varArr = Array.isArray(r.variants) ? r.variants : (r.variant ? [r.variant] : []);
    const varStr = varArr.filter(v => v !== char).join(', ');
    const meaning = r.meaning || '';
    const hanviet = r.hanviet || '';
    const pinyin = r.pinyin || '';
    const strokes = r.strokes || '';
    const examples = r.examples || [];
    const writeLabel = `Bộ thủ: ${hanviet} (${meaning})`;

    return `
      <div class="glass-card rounded-2xl p-4 border border-amber-200/80 hover:border-amber-400 transition-all space-y-3 relative overflow-hidden bg-[#FFFDF9] shadow-xs">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div onclick="openWritingModal(${jsArg(char)}, ${jsArg(pinyin)}, ${jsArg(writeLabel)})" class="w-14 h-14 rounded-2xl bg-amber-50/80 hover:bg-rose-50 border border-amber-200 hover:border-rose-300 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all" title="Nhấn vào chữ để xem và tập viết nét">
              <span class="font-hanzi text-3xl font-black text-[#8B1E1E]">${char}</span>
            </div>
            <div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-sm font-bold text-amber-900">${pinyin}</span>
                <div class="inline-flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-lg border border-stone-200 shadow-2xs">
                  <button onclick="playChineseTTS(${jsArg(char)}, 'female')" class="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-800 text-[10px] font-bold cursor-pointer transition-colors" title="Phát âm giọng Nữ (Xiaoxiao)">
                    👩 Nữ
                  </button>
                  <button onclick="playChineseTTS(${jsArg(char)}, 'male')" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-800 text-[10px] font-bold cursor-pointer transition-colors" title="Phát âm giọng Nam (Yunxi)">
                    👨 Nam
                  </button>
                </div>
              </div>
              <p class="text-xs font-bold text-stone-800">Bộ ${hanviet} ${varStr ? `<span class="text-[11px] text-stone-400 font-normal">(${varStr})</span>` : ''}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              #${id}
            </span>
            <p class="text-[10px] text-stone-400 font-semibold mt-1">${strokes} Nét</p>
          </div>
        </div>

        <div class="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
          <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">Ý nghĩa cốt lõi:</span>
          <p class="text-stone-700 font-medium leading-relaxed">${meaning}</p>
        </div>

        ${examples && examples.length > 0 ? `
          <div class="pt-1">
            <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Chữ tiêu biểu:</span>
            <div class="flex flex-wrap gap-1.5">
              ${examples.map(ex => `
                <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50/80 border border-amber-200/70 shadow-2xs">
                  <span onclick="openWritingModal(${jsArg(ex)})" class="font-hanzi font-bold text-[#8B1E1E] text-xs cursor-pointer hover:underline" title="Nhấn để tập viết nét chữ này">${ex}</span>
                  <div class="flex items-center gap-0.5">
                    <button type="button" onclick="playChineseTTS(${jsArg(ex)}, 'female')" class="text-[9px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm ${ex} giọng Nữ">👩</button>
                    <button type="button" onclick="playChineseTTS(${jsArg(ex)}, 'male')" class="text-[9px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm ${ex} giọng Nam">👨</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
          <button onclick="openWritingModal(${jsArg(char)}, ${jsArg(pinyin)}, ${jsArg(writeLabel)});" class="text-[#8B1E1E] hover:text-[#A52A2A] font-bold flex items-center gap-1 transition-colors cursor-pointer">
            <i data-lucide="pen-tool" class="w-3 h-3 text-[#8B1E1E]"></i>
            <span>Luyện viết bộ này</span>
          </button>
          <span class="text-stone-400 text-[10px]">Khang Hy Tự Điển</span>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
}
