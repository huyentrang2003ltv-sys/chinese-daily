// Module state
let currentExamLevel = 1;
let activeExam = null;
let examUserAnswers = {};
let examTimeRemaining = 0;
let examTimerInterval = null;

// ==========================================
// MODULE: THI THỬ HSK MÔ PHỎNG (MOCK EXAM)
// ==========================================
function initMockExamModule() {
  switchMockExamLevel(1);
}

function switchMockExamLevel(level) {
  currentExamLevel = level;
  const buttons = [1, 2, 3, 4, 5];
  buttons.forEach(lvl => {
    const btn = document.getElementById(`btn-exam-lvl-${lvl}`);
    if (!btn) return;
    if (lvl === level) {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap';
    } else {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap';
    }
  });

  if (level > 1 && typeof checkCurrentUserVip === 'function') {
    const vip = checkCurrentUserVip();
    if (vip.isExpired) {
      if (!ensureVipAccess('Đề thi mô phỏng HSK cấp ' + level)) return;
    }
  }

  activeExam = (mockExamsData || []).find(e => e.level === level) || (mockExamsData || [])[0] || null;
  examUserAnswers = {};
  renderMockExam();
  startExamTimer(activeExam ? activeExam.durationMinutes : 15);
}

function startExamTimer(minutes) {
  if (examTimerInterval) clearInterval(examTimerInterval);
  examTimeRemaining = minutes * 60;
  updateTimerDisplay();

  examTimerInterval = setInterval(() => {
    examTimeRemaining--;
    updateTimerDisplay();
    if (examTimeRemaining <= 0) {
      clearInterval(examTimerInterval);
      showToast('Hết giờ làm bài! Hệ thống sẽ tự động nộp bài và chấm điểm.', 'warning');
      submitMockExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const display = document.getElementById('examTimerDisplay');
  if (!display) return;
  const m = Math.floor(examTimeRemaining / 60);
  const s = examTimeRemaining % 60;
  display.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  if (examTimeRemaining <= 120) {
    display.className = 'text-2xl font-black text-rose-600 font-mono tracking-wider animate-pulse';
  } else {
    display.className = 'text-2xl font-black text-amber-900 font-mono tracking-wider';
  }
}

function renderMockExam() {
  const container = document.getElementById('mockExamQuestionsContainer');
  if (!container || !activeExam) return;

  const questions = activeExam.questions || [];
  container.innerHTML = questions.map((q, idx) => {
    const userAns = examUserAnswers[q.id];

    let contentHtml = '';
    if (q.audioText) {
      contentHtml += `
        <div class="flex items-center gap-2 mb-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
          <div class="inline-flex items-center gap-1 bg-white/90 p-0.5 rounded-xl border border-amber-300 shadow-2xs">
            <button onclick="playChineseTTS(${jsArg(q.audioText)}, 'female')" class="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-850 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer" title="Nghe câu hỏi giọng Nữ">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
              <span>👩 Nghe Nữ</span>
            </button>
            <button onclick="playChineseTTS(${jsArg(q.audioText)}, 'male')" class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer" title="Nghe câu hỏi giọng Nam">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
              <span>👨 Nghe Nam</span>
            </button>
          </div>
          <span class="text-xs text-amber-800 font-medium">Bấm để nghe audio bản ngữ</span>
        </div>
      `;
    }

    if (q.statement) {
      contentHtml += `
        <p class="text-sm font-semibold text-slate-800 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          Nhận định: "${q.statement}"
        </p>
      `;
    }

    if (q.words && q.correctOrder) {
      // Reorder question in exam
      const selected = examUserAnswers[q.id] || [];
      const unselected = q.words.filter(w => !selected.includes(w));
      contentHtml += `
        <div class="space-y-3">
          <div class="min-h-[48px] p-3 rounded-xl bg-slate-50 border-2 border-dashed border-amber-300 flex flex-wrap gap-2 items-center">
            ${selected.length === 0 ? '<span class="text-xs text-slate-400">Bấm chọn các từ bên dưới theo thứ tự câu đúng:</span>' : ''}
            ${selected.map((w, sIdx) => `
              <button onclick="removeExamReorderWord(${jsArg(q.id)}, ${sIdx})" class="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-hanzi font-bold text-sm shadow-xs flex items-center gap-1">
                <span>${w}</span>
                <span class="text-xs text-amber-200">×</span>
              </button>
            `).join('')}
          </div>
          <div class="flex flex-wrap gap-2">
            ${unselected.map(w => `
              <button onclick="addExamReorderWord(${jsArg(q.id)}, ${jsArg(w)})" class="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-slate-800 border border-slate-200 font-hanzi font-bold text-sm shadow-2xs">
                ${w}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    } else if (q.options) {
      // Multiple choice
      contentHtml += `
        <div class="grid grid-cols-1 gap-2.5">
          ${q.options.map(opt => `
            <button 
              onclick="selectExamAnswer(${jsArg(q.id)}, ${jsArg(opt.key)})"
              class="w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                userAns === opt.key
                  ? 'bg-amber-100/70 border-amber-400 text-amber-950 font-bold shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }">
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                userAns === opt.key ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }">
                ${opt.key}
              </span>
              <span class="text-xs lg:text-sm leading-relaxed">${opt.text}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="glass-card rounded-2xl p-6 border-slate-200 bg-white shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <span class="text-xs font-bold text-amber-800">${q.section}</span>
          <span class="text-xs font-bold text-slate-400">Câu ${idx + 1} / ${questions.length}</span>
        </div>
        <h4 class="text-sm font-bold text-slate-900 leading-snug">${q.prompt}</h4>
        ${contentHtml}
      </div>
    `;
  }).join('');

  refreshIcons();
}

function selectExamAnswer(questionId, optionKey) {
  examUserAnswers[questionId] = optionKey;
  renderMockExam();
}

function addExamReorderWord(qId, word) {
  if (!examUserAnswers[qId]) examUserAnswers[qId] = [];
  examUserAnswers[qId].push(word);
  renderMockExam();
}

function removeExamReorderWord(qId, idx) {
  if (examUserAnswers[qId]) {
    examUserAnswers[qId].splice(idx, 1);
    renderMockExam();
  }
}

function submitMockExam() {
  if (!activeExam) return;
  if (examTimerInterval) clearInterval(examTimerInterval);

  let correctCount = 0;
  const questions = activeExam.questions || [];
  const breakdownList = [];

  questions.forEach((q, idx) => {
    let isCorrect = false;
    let userAnsText = '';
    let correctAnsText = '';

    if (q.words && q.correctOrder) {
      const selected = examUserAnswers[q.id] || [];
      isCorrect = selected.join('') === q.correctOrder.join('');
      userAnsText = selected.join(' ') || '(Chưa làm)';
      correctAnsText = q.correctOrder.join(' ');
    } else if (q.options) {
      const userKey = examUserAnswers[q.id];
      const correctOpt = q.options.find(o => o.isCorrect);
      const userOpt = q.options.find(o => o.key === userKey);
      isCorrect = userKey === (correctOpt ? correctOpt.key : '');
      userAnsText = userOpt ? `${userOpt.key}. ${userOpt.text}` : '(Chưa chọn)';
      correctAnsText = correctOpt ? `${correctOpt.key}. ${correctOpt.text}` : '';
    }

    if (isCorrect) correctCount++;

    breakdownList.push({
      index: idx + 1,
      prompt: q.prompt,
      isCorrect,
      userAnsText,
      correctAnsText,
      explanation: q.explanation
    });
  });

  const scorePerQuestion = Math.round(activeExam.totalScore / questions.length);
  const totalScoreAchieved = correctCount * scorePerQuestion;
  const isPassed = totalScoreAchieved >= activeExam.passScore;

  // Add Exp
  addExp(isPassed ? 50 : 20, 'Hoàn thành đề thi thử HSK');

  // Show Modal
  const emojiEl = document.getElementById('examResultEmoji');
  const titleEl = document.getElementById('examResultTitle');
  const subtitleEl = document.getElementById('examResultSubtitle');
  const scoreEl = document.getElementById('examScoreValue');
  const maxScoreEl = document.getElementById('examMaxScoreValue');
  const badgeEl = document.getElementById('examResultBadge');
  const breakdownContainer = document.getElementById('examAnswerBreakdown');

  if (scoreEl) scoreEl.innerText = totalScoreAchieved;
  if (maxScoreEl) maxScoreEl.innerText = `/ ${activeExam.totalScore}`;

  if (isPassed) {
    if (emojiEl) emojiEl.innerText = '🎉';
    if (titleEl) titleEl.innerText = 'Chúc Mừng Bạn Đã Đỗ Kỳ Thi!';
    if (subtitleEl) subtitleEl.innerText = `Bạn đã đạt ${correctCount}/${questions.length} câu đúng (+50 EXP ⭐)`;
    if (badgeEl) {
      badgeEl.className = 'mt-2 px-4 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300';
      badgeEl.innerText = 'ĐẠT TIÊU CHUẨN ĐỖ (合格)';
    }
  } else {
    if (emojiEl) emojiEl.innerText = '💪';
    if (titleEl) titleEl.innerText = 'Chưa Đạt Điểm Chuẩn!';
    if (subtitleEl) subtitleEl.innerText = `Bạn đạt ${correctCount}/${questions.length} câu đúng. Hãy ôn luyện thêm nhé (+20 EXP ⭐)`;
    if (badgeEl) {
      badgeEl.className = 'mt-2 px-4 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300';
      badgeEl.innerText = `CHƯA ĐẠT (Điểm liệt: ${activeExam.passScore})`;
    }
  }

  if (breakdownContainer) {
    breakdownContainer.innerHTML = breakdownList.map(item => `
      <div class="p-3.5 rounded-xl border ${item.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'} space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-bold ${item.isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
            Câu ${item.index}: ${item.isCorrect ? '✅ Đúng' : '❌ Sai'}
          </span>
        </div>
        <p class="text-slate-800 font-semibold">${item.prompt}</p>
        <p class="text-slate-600">Câu trả lời của bạn: <strong class="${item.isCorrect ? 'text-emerald-700' : 'text-rose-700'}">${item.userAnsText}</strong></p>
        ${!item.isCorrect ? `<p class="text-emerald-700">Đáp án chuẩn: <strong>${item.correctAnsText}</strong></p>` : ''}
        <p class="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">💡 ${item.explanation}</p>
      </div>
    `).join('');
  }

  openModal('examResultModal');
}

function closeExamResultModal() {
  closeModal('examResultModal');
}

registerModal('examResultModal', closeExamResultModal);
