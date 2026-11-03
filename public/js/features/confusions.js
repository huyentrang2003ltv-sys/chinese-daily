// ---------------- TAB 3: PHÂN BIỆT TỪ DỄ LẪN ----------------
function renderConfusions() {
  const container = document.getElementById('confusionsListContainer');
  if (!container) return;

  container.innerHTML = confusionsData.map((item, idx) => `
    <div class="glass-card rounded-2xl p-6 lg:p-8 border-teal-100 bg-white shadow-sm">
      
      <!-- Pair Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-teal-100">
        <div>
          <h3 class="text-xl lg:text-2xl font-black text-teal-950 tracking-wide font-hanzi">
            ${item.pair}
          </h3>
          <p class="text-xs font-bold text-teal-700 mt-1">${item.meaning}</p>
        </div>
        <div class="p-3.5 rounded-xl bg-teal-50 border border-teal-200 max-w-md">
          <p class="text-xs text-teal-950">
            <strong class="text-teal-700">Cốt lõi khác biệt:</strong> ${item.difference}
          </p>
        </div>
      </div>

      <!-- Comparison Matrix Table -->
      <div class="overflow-x-auto mb-6">
        <table class="w-full text-xs text-left border-collapse">
          <thead>
            <tr class="border-b border-teal-100 text-teal-950 uppercase bg-teal-50/60">
              <th class="py-2.5 px-4 font-bold">Khía cạnh so sánh</th>
              <th class="py-2.5 px-4 font-bold text-teal-700">Từ A</th>
              <th class="py-2.5 px-4 font-bold text-emerald-700">Từ B / C</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-teal-50 text-slate-700">
            ${item.comparisonTable.map(row => `
              <tr class="hover:bg-teal-50/30">
                <td class="py-3 px-4 font-semibold text-slate-800">${row.aspect}</td>
                <td class="py-3 px-4 font-hanzi font-bold text-teal-900">${row.wordA}</td>
                <td class="py-3 px-4 font-hanzi font-bold text-teal-900">${row.wordB || row.wordC}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Mnemonic Quote -->
      <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 mb-6">
        <i data-lucide="zap" class="w-5 h-5 text-amber-500 flex-shrink-0"></i>
        <p class="text-xs font-semibold text-amber-900">
          <strong class="text-amber-700">Bí quyết nhớ siêu tốc:</strong> ${item.mnemonic}
        </p>
      </div>

      <!-- 1-Click Interactive Quiz -->
      <div class="p-5 rounded-2xl bg-teal-50/40 border border-teal-100">
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-600 text-white shadow-xs">
            Quiz Phản Xạ Nhanh
          </span>
          <span class="text-xs text-slate-600 font-medium">Chọn phương án chính xác nhất:</span>
        </div>
        <p class="text-sm font-bold text-slate-900 mb-4 font-hanzi">${item.quiz.question}</p>
        
        <div class="flex flex-wrap gap-3">
          ${item.quiz.options.map((opt, optIdx) => `
            <button 
              id="quiz-btn-${idx}-${optIdx}" 
              onclick="answerQuiz(${idx}, ${optIdx})" 
              class="px-5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-teal-50 text-teal-900 border border-teal-200 transition-all font-hanzi shadow-xs">
              ${opt}
            </button>
          `).join('')}
        </div>

        <!-- Quiz Feedback Container -->
        <div id="quiz-feedback-${idx}" class="hidden mt-4 p-3.5 rounded-xl text-xs font-medium"></div>
      </div>

    </div>
  `).join('');
}

function answerQuiz(itemIdx, selectedOptIdx) {
  const item = confusionsData[itemIdx];
  const feedback = document.getElementById(`quiz-feedback-${itemIdx}`);
  if (!item || !feedback) return;
  const isCorrect = (selectedOptIdx === item.quiz.correct);

  item.quiz.options.forEach((opt, optIdx) => {
    const btn = document.getElementById(`quiz-btn-${itemIdx}-${optIdx}`);
    if (!btn) return;
    if (optIdx === item.quiz.correct) {
      btn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 text-white border border-teal-500 shadow-md font-hanzi';
    } else if (optIdx === selectedOptIdx && !isCorrect) {
      btn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white border border-rose-500 shadow-md font-hanzi';
    } else {
      btn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 opacity-60 font-hanzi';
    }
  });

  feedback.classList.remove('hidden', 'bg-emerald-50', 'text-emerald-800', 'border-emerald-200', 'bg-rose-50', 'text-rose-800', 'border-rose-200');
  if (isCorrect) {
    feedback.className = 'mt-4 p-3.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-start gap-2 shadow-xs';
    feedback.innerHTML = `
      <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"></i>
      <div>
        <strong>Chính xác!</strong> ${item.quiz.explanation}
      </div>
    `;
  } else {
    feedback.className = 'mt-4 p-3.5 rounded-xl text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-2 shadow-xs';
    feedback.innerHTML = `
      <i data-lucide="alert-circle" class="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5"></i>
      <div>
        <strong>Chưa đúng!</strong> ${item.quiz.explanation}
      </div>
    `;
  }
  refreshIcons();
}
