// public/js/features/polyphonic.js
// =========================================================================
// CẨM NANG CHỮ ĐA ÂM ĐA NGHĨA (多音多义字 - Polyphonic Characters Compendium)
// So sánh đối chiếu cách phát âm, từ loại, ý nghĩa, khẩu quyết ghi nhớ và câu ví dụ
// =========================================================================

let polyphonicSearchQuery = '';
let polyphonicQuizAnswers = {};

async function initPolyphonic() {
  if (!polyphonicWordsData || polyphonicWordsData.length === 0) {
    if (typeof loadData === 'function') {
      try {
        await loadData('polyphonicWords');
      } catch (err) {
        console.error('Không thể tải polyphonic_words.json:', err);
      }
    }
  }

  renderPolyphonicCards();
  if (typeof refreshIcons === 'function') refreshIcons();
}

function handlePolyphonicSearch(query) {
  polyphonicSearchQuery = (query || '').trim().toLowerCase();
  renderPolyphonicCards();
  if (typeof refreshIcons === 'function') refreshIcons();
}

function getFilteredPolyphonic() {
  let list = polyphonicWordsData || [];
  if (polyphonicSearchQuery) {
    const q = polyphonicSearchQuery;
    list = list.filter(item => {
      const matchChar = item.char && item.char.toLowerCase().includes(q);
      const matchHv = item.hanviet && item.hanviet.toLowerCase().includes(q);
      const matchMnemonic = item.summaryMnemonic && item.summaryMnemonic.toLowerCase().includes(q);
      const matchReadings = (item.readings || []).some(r => 
        (r.pinyin && r.pinyin.toLowerCase().includes(q)) || 
        (r.pos && r.pos.toLowerCase().includes(q)) || 
        (r.meaning && r.meaning.toLowerCase().includes(q)) || 
        (r.collocations || []).some(c => c && c.toLowerCase().includes(q)) || 
        (r.example && (
          (r.example.zh && r.example.zh.toLowerCase().includes(q)) || 
          (r.example.py && r.example.py.toLowerCase().includes(q)) || 
          (r.example.vi && r.example.vi.toLowerCase().includes(q))
        ))
      );
      return matchChar || matchHv || matchMnemonic || matchReadings;
    });
  }
  return list;
}

function renderPolyphonicCards() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('polyphonicGridContainer');
  const countLabel = document.getElementById('polyphonicFilteredCount');
  if (!container) return;

  const filtered = getFilteredPolyphonic();
  if (countLabel) {
    countLabel.textContent = `Hiển thị ${filtered.length} / ${(polyphonicWordsData || []).length} chữ đa âm`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full glass-card rounded-2xl p-10 text-center text-stone-500 border border-amber-200 bg-white dark:bg-stone-900 shadow-xs space-y-2">
        <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800 dark:text-stone-200">Không tìm thấy chữ đa âm nào phù hợp với từ khóa "${escapeHtml(polyphonicSearchQuery)}".</p>
        <p class="text-xs text-stone-500">Hãy thử tìm theo chữ Hán, Pinyin hoặc nghĩa (ví dụ: 得, de, dei, 行, xing, 重, 便, 差)...</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isAnswered = polyphonicQuizAnswers.hasOwnProperty(item.id);
    const selectedIdx = isAnswered ? polyphonicQuizAnswers[item.id] : null;

    // Readings comparison cards
    const readingsHtml = (item.readings || []).map((r, rIdx) => {
      const collocationsHtml = (r.collocations || []).map(col => `
        <span 
          onclick="if(typeof playChineseTTS==='function') playChineseTTS(${jsArg(col)})"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-800 border border-stone-200 text-xs font-medium cursor-pointer transition-colors" 
          title="Nhấn để nghe: ${escapeHtml(col)}">
          <span class="font-hanzi font-bold">${escapeHtml(col)}</span>
          <i data-lucide="volume-2" class="w-2.5 h-2.5 text-stone-400"></i>
        </span>
      `).join('');

      return `
        <div class="rounded-xl p-3.5 bg-stone-50/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex flex-col justify-between space-y-2.5">
          <div>
            <!-- Reading Header -->
            <div class="flex items-center justify-between gap-2 border-b border-stone-200/60 dark:border-stone-700/60 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-lg font-black font-mono text-[#8B1E1E] dark:text-rose-400">${escapeHtml(r.pinyin)}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200">
                  ${escapeHtml(r.tone)}
                </span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-[10px] font-semibold text-stone-500 bg-white dark:bg-stone-700 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-600">
                  ${escapeHtml(r.pos)}
                </span>
                <button 
                  onclick="if(typeof playChineseTTS==='function') playChineseTTS(${jsArg(r.pinyin)})" 
                  class="p-1 rounded bg-white hover:bg-amber-50 text-stone-600 hover:text-[#8B1E1E] border border-stone-200 cursor-pointer" 
                  title="Nghe phát âm âm này">
                  <i data-lucide="volume-2" class="w-3 h-3"></i>
                </button>
              </div>
            </div>

            <!-- Meaning -->
            <div class="mt-2 text-xs text-stone-700 dark:text-stone-300">
              <span class="font-bold text-stone-900 dark:text-white">Ý nghĩa: </span>
              <span>${escapeHtml(r.meaning)}</span>
            </div>

            <!-- Collocations -->
            <div class="mt-2.5 space-y-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Cụm từ tiêu biểu:</span>
              <div class="flex flex-wrap gap-1">
                ${collocationsHtml}
              </div>
            </div>
          </div>

          <!-- Bilingual Example -->
          ${r.example ? `
            <div class="mt-2 p-2.5 rounded-lg bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700 text-xs space-y-0.5">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase text-stone-400">Câu ví dụ:</span>
                <button 
                  onclick="if(typeof playChineseTTS==='function') playChineseTTS(${jsArg(r.example.zh)})" 
                  class="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 hover:bg-rose-50 text-rose-800 border border-stone-200 font-bold cursor-pointer">
                  🔊 Nghe
                </button>
              </div>
              <p class="font-hanzi font-bold text-stone-900 dark:text-stone-100 text-xs leading-relaxed">${escapeHtml(r.example.zh)}</p>
              <p class="text-[10px] text-stone-500 font-mono">${escapeHtml(r.example.py)}</p>
              <p class="text-[11px] text-stone-600 dark:text-stone-300 italic">"${escapeHtml(r.example.vi)}"</p>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

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
            onclick="checkPolyphonicQuiz('${item.id}', ${idx}, ${q.answer})" 
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
            <span>Bẫy Ngữ Cảnh HSK:</span>
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
          <!-- Header -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <span 
                onclick="if(typeof openWritingModal==='function') openWritingModal(${jsArg(item.char)}, '', ${jsArg(item.hanviet || '')})"
                class="font-hanzi text-4xl font-black text-stone-900 dark:text-white cursor-pointer hover:text-[#8B1E1E] transition-colors" 
                title="Nhấn để xem cách viết nét">
                ${escapeHtml(item.char)}
              </span>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-[#8B1E1E] dark:text-rose-400">Hán Việt: ${escapeHtml(item.hanviet)}</span>
                  ${item.strokes ? `<span class="text-xs text-stone-500 font-mono px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">${item.strokes} nét</span>` : ''}
                </div>
                ${item.radical ? `<p class="text-xs text-stone-500 font-medium mt-0.5">Bộ thủ: ${escapeHtml(item.radical)}</p>` : ''}
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                ${(item.readings || []).length} cách đọc
              </span>
            </div>
          </div>

          <!-- Mnemonic Banner -->
          ${item.summaryMnemonic ? `
            <div class="mb-3.5 p-2.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <i data-lucide="sparkles" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
              <div class="leading-relaxed">
                <span class="font-bold">Khẩu quyết ghi nhớ: </span>
                <span>${escapeHtml(item.summaryMnemonic)}</span>
              </div>
            </div>
          ` : ''}

          <!-- Readings Grid -->
          <div class="grid grid-cols-1 ${ (item.readings || []).length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2' } gap-2.5">
            ${readingsHtml}
          </div>
        </div>

        <!-- Quiz Section -->
        ${quizHtml}
      </div>
    `;
  }).join('');
}

function checkPolyphonicQuiz(polyId, selectedIdx, correctIdx) {
  polyphonicQuizAnswers[polyId] = selectedIdx;
  renderPolyphonicCards();
  if (typeof refreshIcons === 'function') refreshIcons();
}

// Global window attachments for bundled mode
if (typeof window !== 'undefined') {
  window.initPolyphonic = initPolyphonic;
  window.handlePolyphonicSearch = handlePolyphonicSearch;
  window.renderPolyphonicCards = renderPolyphonicCards;
  window.checkPolyphonicQuiz = checkPolyphonicQuiz;
  window.getFilteredPolyphonic = getFilteredPolyphonic;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initPolyphonic,
    handlePolyphonicSearch,
    renderPolyphonicCards,
    checkPolyphonicQuiz,
    getFilteredPolyphonic
  };
}

