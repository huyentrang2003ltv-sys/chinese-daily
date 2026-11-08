// public/js/features/confusions.js
// ---------------- TAB: PHÂN BIỆT TỪ DỄ LẪN (近义词辨析) ----------------
// Ma trận so sánh từ đồng nghĩa, phân tích cốt lõi, khẩu quyết và trắc nghiệm

let confusionsSearchQuery = '';

function handleConfusionsSearch(query) {
  confusionsSearchQuery = (query || '').trim().toLowerCase();
  renderConfusions();
  if (typeof refreshIcons === 'function') refreshIcons();
}

function getFilteredConfusions() {
  const list = confusionsData || [];
  if (!confusionsSearchQuery) return list;

  const q = confusionsSearchQuery;
  return list.filter(item => {
    const matchPair = item.pair && item.pair.toLowerCase().includes(q);
    const matchMeaning = item.meaning && item.meaning.toLowerCase().includes(q);
    const matchDiff = item.difference && item.difference.toLowerCase().includes(q);
    const matchMnemonic = item.mnemonic && item.mnemonic.toLowerCase().includes(q);
    const matchTable = (item.comparisonTable || []).some(row =>
      (row.aspect && row.aspect.toLowerCase().includes(q)) ||
      (row.wordA && row.wordA.toLowerCase().includes(q)) ||
      (row.wordB && row.wordB.toLowerCase().includes(q)) ||
      (row.wordC && row.wordC.toLowerCase().includes(q))
    );
    const matchQuiz = item.quiz && (
      (item.quiz.question && item.quiz.question.toLowerCase().includes(q)) ||
      (item.quiz.explanation && item.quiz.explanation.toLowerCase().includes(q))
    );
    return matchPair || matchMeaning || matchDiff || matchMnemonic || matchTable || matchQuiz;
  });
}

function renderConfusions() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('confusionsListContainer');
  const countLabel = document.getElementById('confusionsFilteredCount');
  if (!container) return;

  const filtered = getFilteredConfusions();
  if (countLabel) {
    countLabel.textContent = `Hiển thị ${filtered.length} / ${(confusionsData || []).length} cặp từ`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="glass-card rounded-2xl p-10 text-center text-stone-500 border border-amber-200 bg-white dark:bg-stone-900 shadow-xs space-y-2">
        <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800 dark:text-stone-200">Không tìm thấy cặp từ nào khớp với "${escapeHtml(confusionsSearchQuery)}".</p>
        <p class="text-xs text-stone-500">Hãy thử nhập từ Hán (ví dụ: 刚, 刚才, 表达, 以为, 适合, 临时, 渡过)...</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item, idx) => {
    const hasWordC = (item.comparisonTable || []).some(row => Boolean(row.wordC));

    return `
      <div class="glass-card rounded-2xl p-6 lg:p-8 border-teal-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm transition-all hover:shadow-md">
        
        <!-- Pair Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-teal-100 dark:border-stone-800">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-xl lg:text-2xl font-black text-teal-950 dark:text-teal-200 tracking-wide font-hanzi">
                ${escapeHtml(item.pair)}
              </h3>
            </div>
            <p class="text-xs font-bold text-teal-700 dark:text-teal-400 mt-1">${escapeHtml(item.meaning)}</p>
          </div>
          <div class="p-3.5 rounded-xl bg-teal-50 dark:bg-stone-800/80 border border-teal-200 dark:border-stone-700 max-w-md">
            <p class="text-xs text-teal-950 dark:text-stone-200 leading-relaxed">
              <strong class="text-teal-700 dark:text-teal-400">Cốt lõi khác biệt:</strong> ${escapeHtml(item.difference)}
            </p>
          </div>
        </div>

        <!-- Comparison Matrix Table -->
        <div class="overflow-x-auto mb-6 rounded-xl border border-teal-100 dark:border-stone-800">
          <table class="w-full text-xs text-left border-collapse">
            <thead>
              <tr class="border-b border-teal-100 dark:border-stone-800 text-teal-950 dark:text-teal-300 uppercase bg-teal-50/60 dark:bg-stone-800">
                <th class="py-2.5 px-4 font-bold">Khía cạnh so sánh</th>
                <th class="py-2.5 px-4 font-bold text-teal-700 dark:text-teal-400">Từ A</th>
                <th class="py-2.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">Từ B</th>
                ${hasWordC ? '<th class="py-2.5 px-4 font-bold text-indigo-700 dark:text-indigo-400">Từ C</th>' : ''}
              </tr>
            </thead>
            <tbody class="divide-y divide-teal-50 dark:divide-stone-800 text-slate-700 dark:text-stone-300">
              ${(item.comparisonTable || []).map(row => `
                <tr class="hover:bg-teal-50/30 dark:hover:bg-stone-800/50">
                  <td class="py-3 px-4 font-semibold text-slate-800 dark:text-stone-200">${escapeHtml(row.aspect)}</td>
                  <td class="py-3 px-4 font-hanzi font-bold text-teal-900 dark:text-teal-300">${escapeHtml(row.wordA)}</td>
                  <td class="py-3 px-4 font-hanzi font-bold text-teal-900 dark:text-teal-300">${escapeHtml(row.wordB || '')}</td>
                  ${hasWordC ? `<td class="py-3 px-4 font-hanzi font-bold text-indigo-900 dark:text-indigo-300">${escapeHtml(row.wordC || '')}</td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Mnemonic Quote -->
        <div class="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3 mb-6">
          <i data-lucide="zap" class="w-5 h-5 text-amber-500 flex-shrink-0"></i>
          <p class="text-xs font-semibold text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong class="text-amber-700 dark:text-amber-400">Bí quyết nhớ siêu tốc:</strong> ${escapeHtml(item.mnemonic)}
          </p>
        </div>

        <!-- 1-Click Interactive Quiz -->
        ${item.quiz ? `
          <div class="p-5 rounded-2xl bg-teal-50/40 dark:bg-stone-800/50 border border-teal-100 dark:border-stone-800">
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-600 text-white shadow-xs">
                Quiz Phản Xạ Nhanh
              </span>
              <span class="text-xs text-slate-600 dark:text-stone-400 font-medium">Chọn phương án chính xác nhất:</span>
            </div>
            <p class="text-sm font-bold text-slate-900 dark:text-stone-100 mb-4 font-hanzi leading-relaxed">${escapeHtml(item.quiz.question)}</p>
            
            <div class="flex flex-wrap gap-2.5">
              ${(item.quiz.options || []).map((opt, optIdx) => `
                <button 
                  id="quiz-btn-${idx}-${optIdx}" 
                  onclick="answerQuiz(${idx}, ${optIdx})" 
                  class="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-stone-800 hover:bg-teal-50 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-stone-700 transition-all font-hanzi shadow-xs cursor-pointer">
                  ${escapeHtml(opt)}
                </button>
              `).join('')}
            </div>

            <!-- Quiz Feedback Container -->
            <div id="quiz-feedback-${idx}" class="hidden mt-4 p-3.5 rounded-xl text-xs font-medium"></div>
          </div>
        ` : ''}

      </div>
    `;
  }).join('');
}

function answerQuiz(itemIdx, selectedOptIdx) {
  const filtered = getFilteredConfusions();
  const item = filtered[itemIdx];
  const feedback = document.getElementById(`quiz-feedback-${itemIdx}`);
  if (!item || !feedback || !item.quiz) return;
  const isCorrect = (selectedOptIdx === item.quiz.correct);

  item.quiz.options.forEach((opt, optIdx) => {
    const btn = document.getElementById(`quiz-btn-${itemIdx}-${optIdx}`);
    if (!btn) return;
    if (optIdx === item.quiz.correct) {
      btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white border border-teal-500 shadow-md font-hanzi';
    } else if (optIdx === selectedOptIdx && !isCorrect) {
      btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white border border-rose-500 shadow-md font-hanzi';
    } else {
      btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-stone-800 text-slate-400 border border-slate-200 dark:border-stone-700 opacity-60 font-hanzi';
    }
  });

  feedback.classList.remove('hidden', 'bg-emerald-50', 'text-emerald-800', 'border-emerald-200', 'bg-rose-50', 'text-rose-800', 'border-rose-200');
  if (isCorrect) {
    feedback.className = 'mt-4 p-3.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-start gap-2 shadow-xs';
    feedback.innerHTML = `
      <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"></i>
      <div>
        <strong>Chính xác!</strong> ${escapeHtml(item.quiz.explanation)}
      </div>
    `;
  } else {
    feedback.className = 'mt-4 p-3.5 rounded-xl text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-2 shadow-xs';
    feedback.innerHTML = `
      <i data-lucide="alert-circle" class="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5"></i>
      <div>
        <strong>Chưa đúng!</strong> ${escapeHtml(item.quiz.explanation)}
      </div>
    `;
  }
  if (typeof refreshIcons === 'function') refreshIcons();
}

// Global window attachments
if (typeof window !== 'undefined') {
  window.renderConfusions = renderConfusions;
  window.handleConfusionsSearch = handleConfusionsSearch;
  window.getFilteredConfusions = getFilteredConfusions;
  window.answerQuiz = answerQuiz;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderConfusions,
    handleConfusionsSearch,
    getFilteredConfusions,
    answerQuiz
  };
}
