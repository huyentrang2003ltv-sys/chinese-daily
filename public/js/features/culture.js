// Module state
let activeCultureCategory = 'all';
let cultureSearchQuery = '';

// ---------------- TAB: VĂN HÓA & LỊCH SỬ TRUNG HOA ----------------
function filterCultureCategory(category) {
  activeCultureCategory = category;
  
  const catButtons = ['all', 'dynasties', 'culture', 'customs', 'wars'];
  catButtons.forEach(c => {
    const btn = document.getElementById(`btn-culture-${c}`);
    if (!btn) return;
    if (c === category) {
      btn.className = 'px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap scale-105 cursor-pointer';
    } else {
      btn.className = 'px-4 py-2 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-amber-200 transition-all whitespace-nowrap cursor-pointer';
    }
  });

  renderCultureCards();
}

function scrollToEra(order) {
  const el = document.getElementById(`era-card-${order}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('ring-4', 'ring-[#8B1E1E]', 'shadow-xl');
    setTimeout(() => {
      el.classList.remove('ring-4', 'ring-[#8B1E1E]', 'shadow-xl');
    }, 2500);
  }
}

function setupCultureSearch() {
  const searchInput = document.getElementById('cultureSearchInput');
  if (!searchInput || searchInput.dataset.bound) return;
  searchInput.dataset.bound = '1';
  searchInput.addEventListener('input', debounce((e) => {
    cultureSearchQuery = e.target.value.toLowerCase().trim();
    renderCultureCards();
  }, 120));
}

function renderCultureCards() {
  const container = document.getElementById('cultureCardsContainer');
  if (!container) return;

  const sortedData = [...(cultureData || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  const filtered = sortedData.filter(item => {
    // If specific dimension filter is active, check if item has relevant content
    if (activeCultureCategory === 'wars' && (!item.warsAndBattles || item.warsAndBattles.length === 0)) return false;
    if (activeCultureCategory === 'culture' && (!item.cultureEmergence || item.cultureEmergence.length === 0)) return false;
    if (activeCultureCategory === 'customs' && (!item.customsEmergence || item.customsEmergence.length === 0)) return false;

    if (!cultureSearchQuery) return true;
    const q = cultureSearchQuery;
    const matchTitle = item.title && item.title.toLowerCase().includes(q);
    const matchEra = item.eraName && item.eraName.toLowerCase().includes(q);
    const matchPeriod = item.period && item.period.toLowerCase().includes(q);
    const matchPinyin = item.pinyin && item.pinyin.toLowerCase().includes(q);
    const matchSummary = item.summary && item.summary.toLowerCase().includes(q);
    const matchCulture = item.cultureEmergence && item.cultureEmergence.some(c => c.toLowerCase().includes(q));
    const matchCustoms = item.customsEmergence && item.customsEmergence.some(c => c.toLowerCase().includes(q));
    const matchWars = item.warsAndBattles && item.warsAndBattles.some(w => 
      w.name.toLowerCase().includes(q) || 
      w.hanzi.includes(q) || 
      (w.combatants && w.combatants.toLowerCase().includes(q)) || 
      (w.description && w.description.toLowerCase().includes(q)) ||
      (w.significance && w.significance.toLowerCase().includes(q))
    );
    const matchKeywords = item.keywords && item.keywords.some(k => 
      k.hanzi.includes(q) || 
      (k.meaning && k.meaning.toLowerCase().includes(q)) || 
      (k.pinyin && k.pinyin.toLowerCase().includes(q))
    );
    const matchQuote = item.quote && (
      item.quote.hanzi.includes(q) || 
      (item.quote.meaning && item.quote.meaning.toLowerCase().includes(q))
    );
    return matchTitle || matchEra || matchPeriod || matchPinyin || matchSummary || matchCulture || matchCustoms || matchWars || matchKeywords || matchQuote;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 glass-card rounded-3xl border border-amber-200 bg-white shadow-sm">
        <div class="text-4xl mb-3">🔍</div>
        <h3 class="text-lg font-bold text-stone-800">Không tìm thấy giai đoạn hoặc từ khóa phù hợp</h3>
        <p class="text-sm text-stone-500 mt-1">Thử tìm kiếm với tên triều đại, danh nhân (Tần Thủy Hoàng, Lý Bạch, Nhạc Phi...), phong tục (Đoan Ngọ, Trà Đạo) hoặc tên trận đánh (Xích Bích, Trường Bình...).</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    // Dynamic highlighting based on active filter
    const highlightWars = activeCultureCategory === 'wars' || activeCultureCategory === 'all';
    const highlightCulture = activeCultureCategory === 'culture' || activeCultureCategory === 'all';
    const highlightCustoms = activeCultureCategory === 'customs' || activeCultureCategory === 'all';

    // 1. Culture & Philosophy HTML
    const cultureHtml = (item.cultureEmergence || []).map(c => {
      const parts = c.split(':');
      const title = parts[0];
      const desc = parts.slice(1).join(':');
      return `
        <li class="flex items-start gap-2 text-xs md:text-sm text-stone-700 leading-relaxed">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
          <span><strong class="text-emerald-950 font-bold">${title}${desc ? ':' : ''}</strong>${desc}</span>
        </li>
      `;
    }).join('');

    // 2. Customs, Traditions & Festivals HTML
    const customsHtml = (item.customsEmergence || []).map(c => {
      const parts = c.split(':');
      const title = parts[0];
      const desc = parts.slice(1).join(':');
      return `
        <li class="flex items-start gap-2 text-xs md:text-sm text-stone-700 leading-relaxed">
          <span class="inline-block w-2 h-2 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
          <span><strong class="text-amber-950 font-bold">${title}${desc ? ':' : ''}</strong>${desc}</span>
        </li>
      `;
    }).join('');

    // 3. Battles and Wars HTML
    const warsHtml = (item.warsAndBattles || []).map(w => `
      <div class="p-4 rounded-2xl bg-white/90 border border-rose-200/90 shadow-2xs space-y-2 hover:border-rose-300 transition-all">
        <div class="flex items-start justify-between gap-2 flex-wrap border-b border-rose-100 pb-2">
          <div class="flex items-baseline gap-2">
            <h5 class="text-sm font-bold text-rose-950 font-hanzi">${w.name}</h5>
            <span class="text-xs text-rose-700 font-medium">(${w.pinyin})</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
            Năm: ${w.year}
          </span>
        </div>
        <p class="text-xs text-stone-600"><strong class="text-stone-900 font-semibold">Bên tham chiến:</strong> ${w.combatants}</p>
        <p class="text-xs text-stone-700 leading-relaxed"><strong class="text-stone-900 font-semibold">Diễn biến & Mưu lược:</strong> ${w.description}</p>
        <div class="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-rose-900 font-medium leading-relaxed">
          <strong>Ý nghĩa lịch sử:</strong> ${w.significance}
        </div>
      </div>
    `).join('');

    // 4. Keywords HTML
    const keywordsHtml = (item.keywords || []).map(k => `
      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200 shadow-2xs hover:border-[#8B1E1E] transition-all">
        <span class="font-hanzi font-bold text-stone-900 text-xs md:text-sm">${k.hanzi}</span>
        <span class="text-[11px] text-[#8B1E1E] font-medium font-sans">${k.pinyin}</span>
        <span class="text-[11px] text-stone-600 font-medium">(${k.meaning})</span>
        <div class="inline-flex items-center gap-0.5 ml-1">
          <button type="button" onclick="playChineseTTS(${jsArg(k.hanzi)}, 'female')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm Nữ">👩</button>
          <button type="button" onclick="playChineseTTS(${jsArg(k.hanzi)}, 'male')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm Nam">👨</button>
        </div>
      </div>
    `).join('');

    // 5. Quote HTML
    const quoteHtml = item.quote ? `
      <div class="p-4 rounded-2xl bg-gradient-to-r from-red-950/5 via-amber-900/5 to-amber-950/5 border border-amber-200/80 relative overflow-hidden mt-2">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1 flex-1">
            <span class="text-[11px] font-bold text-[#8B1E1E] uppercase tracking-wider flex items-center gap-1">
              <i data-lucide="quote" class="w-3.5 h-3.5"></i> Danh Ngôn & Thi Từ Bất Hủ
            </span>
            <p class="font-hanzi text-sm md:text-base font-bold text-stone-900 leading-snug">${item.quote.hanzi}</p>
            <p class="text-xs text-[#8B1E1E] italic font-sans">${item.quote.pinyin}</p>
            <p class="text-xs md:text-sm text-stone-700 font-medium pt-1">➔ "${item.quote.meaning}"</p>
          </div>
          <div class="inline-flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-amber-300 shadow-2xs shrink-0">
            <button onclick="playChineseTTS(${jsArg(item.quote.hanzi)}, 'female')" title="Nghe câu danh ngôn giọng Nữ" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer">
              👩 Nữ
            </button>
            <button onclick="playChineseTTS(${jsArg(item.quote.hanzi)}, 'male')" title="Nghe câu danh ngôn giọng Nam" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer">
              👨 Nam
            </button>
          </div>
        </div>
      </div>
    ` : '';

    return `
      <div id="era-card-${item.order}" class="glass-card rounded-3xl p-6 lg:p-8 border border-amber-300/80 bg-gradient-to-br from-[#FFFDF9] via-white to-amber-50/20 shadow-sm relative transition-all duration-300 space-y-6">
        <!-- Era Timeline Milestone Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/70 pb-4">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center font-black text-sm shadow-2xs">
              ${item.order}
            </span>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-[#8B1E1E] border border-red-200">
                  Kỷ Nguyên ${item.order} / 13
                </span>
                <span class="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
                  📅 ${item.period}
                </span>
              </div>
              <span class="text-xs font-semibold text-stone-500 font-sans mt-0.5 block">${item.eraName}</span>
            </div>
          </div>
          <span class="self-start sm:self-auto text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-amber-100/90 text-amber-950 border border-amber-300 shadow-2xs">
            ${item.badge}
          </span>
        </div>

        <!-- Title & Historical Overview -->
        <div>
          <h3 class="text-xl lg:text-2xl font-black text-stone-900 tracking-tight leading-snug mb-1">
            ${item.title}
          </h3>
          <p class="text-xs md:text-sm text-[#8B1E1E] font-bold mb-3 italic">
            ${item.pinyin}
          </p>
          <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs md:text-sm text-stone-700 leading-relaxed font-sans">
            <strong class="text-stone-900 font-bold">Khái quát lịch sử: </strong>${item.summary}
          </div>
        </div>

        <!-- The 3 Core Dimensions: Culture, Customs & Wars -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- 1. Văn Hóa & Tư Tưởng -->
          ${highlightCulture && cultureHtml ? `
            <div class="p-4 md:p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center gap-2 border-b border-emerald-200/60 pb-2">
                  <span class="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                    <i data-lucide="book-open" class="w-4 h-4"></i>
                  </span>
                  <h4 class="text-xs md:text-sm font-bold text-emerald-950 uppercase tracking-wide">
                    Văn Hóa, Nghệ Thuật & Tư Tưởng
                  </h4>
                </div>
                <ul class="space-y-2">
                  ${cultureHtml}
                </ul>
              </div>
            </div>
          ` : ''}

          <!-- 2. Phong Tục & Lễ Hội -->
          ${highlightCustoms && customsHtml ? `
            <div class="p-4 md:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center gap-2 border-b border-amber-200/60 pb-2">
                  <span class="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                  </span>
                  <h4 class="text-xs md:text-sm font-bold text-amber-950 uppercase tracking-wide">
                    Phong Tục, Lễ Hội & Y Phục
                  </h4>
                </div>
                <ul class="space-y-2">
                  ${customsHtml}
                </ul>
              </div>
            </div>
          ` : ''}

          <!-- 3. Chiến Tranh & Quân Sự -->
          ${highlightWars && warsHtml ? `
            <div class="p-4 md:p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-3 ${activeCultureCategory === 'wars' ? 'lg:col-span-3' : ''}">
              <div class="flex items-center gap-2 border-b border-rose-200/60 pb-2">
                <span class="p-1.5 rounded-lg bg-rose-100 text-rose-800">
                  <i data-lucide="swords" class="w-4 h-4"></i>
                </span>
                <h4 class="text-xs md:text-sm font-bold text-rose-950 uppercase tracking-wide">
                  Chiến Tranh & Biến Cố Quân Sự Điển Hình
                </h4>
              </div>
              <div class="space-y-3 ${activeCultureCategory === 'wars' ? 'grid grid-cols-1 md:grid-cols-2 gap-3 space-y-0' : ''}">
                ${warsHtml}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 4. Từ Vựng Lịch Sử Cốt Lõi -->
        <div class="pt-4 border-t border-amber-200/60 space-y-2">
          <h4 class="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="languages" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
            <span>Từ Vựng Lịch Sử Cốt Lõi (Click để nghe phát âm giọng Bắc Kinh)</span>
          </h4>
          <div class="flex flex-wrap gap-2">
            ${keywordsHtml}
          </div>
        </div>

        <!-- 5. Danh Ngôn & Thi Từ Bất Hủ -->
        ${quoteHtml}
      </div>
    `;
  }).join('');

  refreshIcons(container);
}
