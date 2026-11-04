// ==========================================
// MODULE: THI THỬ HSK MÔ PHỎNG CHUẨN HANBAN CTI & STUDY4
// Kho 360 Đề Thi (60 Đề / Cấp Độ HSK 1 - 6)
// ==========================================

let currentExamLevel = 1;
let currentExamTestNumber = 1;
let activeExam = null;
let examUserAnswers = {};
let examTimeRemaining = 0;
let examTimerInterval = null;
let examLevelDataCache = {};
let userExamHistory = {};
let activeExamPartFilter = 'all'; // 'all' | 'listening' | 'reading' | 'writing'

function loadExamHistory() {
  try {
    const saved = localStorage.getItem('hsk_mock_history');
    userExamHistory = saved ? JSON.parse(saved) : {};
  } catch (e) {
    userExamHistory = {};
  }
}

function saveExamHistory(level, testNum, result) {
  if (!userExamHistory[level]) userExamHistory[level] = {};
  userExamHistory[level][testNum] = result;
  try {
    localStorage.setItem('hsk_mock_history', JSON.stringify(userExamHistory));
  } catch (e) {}
}

function initMockExamModule() {
  loadExamHistory();
  initTestNumberSelectOptions();
  switchMockExamLevel(1);
}

function initTestNumberSelectOptions() {
  const select = document.getElementById('examTestNumberSelect');
  if (!select) return;
  select.innerHTML = '';
  for (let i = 1; i <= 60; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    const pad = i < 10 ? '0' + i : i;
    opt.innerText = `Đề Số ${pad} / 60`;
    select.appendChild(opt);
  }
}

async function getExamsForLevel(level) {
  if (examLevelDataCache[level] && examLevelDataCache[level].length >= 60) {
    return examLevelDataCache[level];
  }

  // Check if mockExamsData already contains all 60 for this level
  if (Array.isArray(window.mockExamsData) && window.mockExamsData.length > 0) {
    const filtered = window.mockExamsData.filter(e => e.level === level);
    if (filtered.length >= 60) {
      examLevelDataCache[level] = filtered;
      return filtered;
    }
  }

  // Fetch level-split file
  try {
    const res = await fetch(`data/exams/hsk${level}.json`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        examLevelDataCache[level] = data;
        return data;
      }
    }
  } catch (e) {
    console.warn(`Fetch exams for HSK ${level} fallback:`, e.message);
  }

  // Fallback to window.mockExamsData or empty array
  return window.mockExamsData || [];
}

async function switchMockExamLevel(level) {
  if (level < 1) level = 1;
  if (level > 6) level = 6;
  currentExamLevel = level;
  currentExamTestNumber = 1;

  // VIP Access Guard
  if (level > 1 && typeof checkCurrentUserVip === 'function') {
    const vip = checkCurrentUserVip();
    if (vip.isExpired) {
      if (!ensureVipAccess('Đề thi mô phỏng HSK cấp ' + level)) return;
    }
  }

  updateExamLevelButtons();
  await loadAndRenderActiveExam();
}

function updateExamLevelButtons() {
  const buttons = [1, 2, 3, 4, 5, 6];
  buttons.forEach(lvl => {
    const btn = document.getElementById(`btn-exam-lvl-${lvl}`);
    if (!btn) return;
    if (lvl === currentExamLevel) {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-all whitespace-nowrap cursor-pointer';
    }
  });
}

async function switchMockExamTest(testNumber) {
  if (testNumber < 1) testNumber = 1;
  if (testNumber > 60) testNumber = 60;
  currentExamTestNumber = testNumber;
  await loadAndRenderActiveExam();
}

function nextMockExamTest() {
  if (currentExamTestNumber < 60) {
    switchMockExamTest(currentExamTestNumber + 1);
    if (typeof showToast === 'function') {
      showToast(`👉 Đã chuyển sang Đề Số ${currentExamTestNumber < 10 ? '0' + currentExamTestNumber : currentExamTestNumber}!`, 'info');
    }
  } else {
    if (typeof showToast === 'function') {
      showToast('🏆 Bạn đang ở Đề số 60 - đề cuối cùng của cấp HSK này!', 'info');
    }
  }
}

function prevMockExamTest() {
  if (currentExamTestNumber > 1) {
    switchMockExamTest(currentExamTestNumber - 1);
    if (typeof showToast === 'function') {
      showToast(`👈 Đã quay lại Đề Số ${currentExamTestNumber < 10 ? '0' + currentExamTestNumber : currentExamTestNumber}!`, 'info');
    }
  } else {
    if (typeof showToast === 'function') {
      showToast('Bạn đang ở Đề số 01!', 'info');
    }
  }
}

function randomMockExamTest() {
  const rand = Math.floor(Math.random() * 60) + 1;
  switchMockExamTest(rand);
  if (typeof showToast === 'function') {
    showToast(`🎲 Đã chọn ngẫu nhiên Đề số ${rand < 10 ? '0' + rand : rand} cho bạn!`, 'success');
  }
}

async function loadAndRenderActiveExam() {
  const exams = await getExamsForLevel(currentExamLevel);
  activeExam = exams.find(e => e.testNumber === currentExamTestNumber) || exams[0] || null;

  // Sync test select dropdown
  const select = document.getElementById('examTestNumberSelect');
  if (select) {
    select.value = currentExamTestNumber;
  }

  // Update Overview Banner Info
  const levelBadge = document.getElementById('examLevelBadge');
  const scoreInfo = document.getElementById('examScoreInfo');
  const titleDisplay = document.getElementById('examTitleDisplay');
  const descDisplay = document.getElementById('examDescDisplay');

  if (levelBadge && activeExam) {
    levelBadge.innerText = `HSK ${activeExam.level} • Chuẩn Hanban CTI (${activeExam.questions ? activeExam.questions.length : 40} Câu)`;
  }
  if (scoreInfo && activeExam) {
    scoreInfo.innerText = `Thang điểm: ${activeExam.totalScore} điểm | Điểm đỗ: ${activeExam.passScore} điểm | Thời gian: ${activeExam.durationMinutes} phút`;
  }
  if (titleDisplay && activeExam) {
    titleDisplay.innerText = activeExam.title;
  }
  if (descDisplay && activeExam) {
    descDisplay.innerText = activeExam.description || 'Đề thi mô phỏng định dạng chuẩn CTI Hanban & STUDY4: Gồm 2 phần Nghe hiểu và Đọc hiểu trọn vẹn.';
  }

  examUserAnswers = {};
  activeExamPartFilter = 'all';
  updatePartFilterButtons();
  renderMockExam();
  renderQuestionPalette();
  updateExamProgressStats();
  startExamTimer(activeExam ? activeExam.durationMinutes : 35);
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
      if (typeof showToast === 'function') {
        showToast('⏰ Hết giờ làm bài! Hệ thống tự động thu bài và chấm điểm.', 'warning');
      }
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
    display.className = 'text-2xl font-black text-[#8B1E1E] dark:text-amber-400 font-mono tracking-wider';
  }
}

function updateExamProgressStats() {
  const countText = document.getElementById('examAnsweredCountText');
  const bar = document.getElementById('examProgressBar');
  if (!activeExam) return;

  const questions = activeExam.questions || [];
  let answered = 0;
  questions.forEach(q => {
    const ans = examUserAnswers[q.id];
    if (ans && (Array.isArray(ans) ? ans.length > 0 : String(ans).trim() !== '')) {
      answered++;
    }
  });

  const total = questions.length;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  if (countText) countText.innerText = `Đã làm: ${answered} / ${total} câu (${pct}%)`;
  if (bar) bar.style.width = `${pct}%`;
}

// ---------------- STUDY4 STYLE PART FILTER & PALETTE ----------------
function filterExamQuestionsByPart(part) {
  activeExamPartFilter = part;
  updatePartFilterButtons();
  renderMockExam();
  renderQuestionPalette();
}

function updatePartFilterButtons() {
  ['all', 'listening', 'reading', 'writing'].forEach(p => {
    const btn = document.getElementById(`examPartBtn-${p}`);
    if (!btn) return;
    if (p === activeExamPartFilter) {
      btn.className = 'px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer font-bold';
    } else {
      btn.className = 'px-3.5 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:text-[#8B1E1E] transition-all whitespace-nowrap cursor-pointer font-bold';
    }
  });
}

function renderQuestionPalette() {
  const palette = document.getElementById('examQuestionPalette');
  if (!palette || !activeExam) return;

  const questions = activeExam.questions || [];
  palette.innerHTML = questions.map((q, idx) => {
    const ans = examUserAnswers[q.id];
    const isAnswered = ans && (Array.isArray(ans) ? ans.length > 0 : String(ans).trim() !== '');
    
    // Check if hidden by filter
    let isHiddenByFilter = false;
    const secLower = (q.section || '').toLowerCase();
    const isListening = q.skill === 'listening' || secLower.includes('nghe') || secLower.includes('听力');
    const isWriting = q.skill === 'writing' || secLower.includes('viết') || secLower.includes('书写');
    const isReading = !isListening && !isWriting;

    if (activeExamPartFilter === 'listening' && !isListening) isHiddenByFilter = true;
    if (activeExamPartFilter === 'reading' && !isReading) isHiddenByFilter = true;
    if (activeExamPartFilter === 'writing' && !isWriting) isHiddenByFilter = true;

    return `
      <button 
        type="button" 
        onclick="scrollToExamQuestion(${idx})" 
        class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
          isAnswered
            ? 'bg-emerald-600 text-white font-black shadow-xs ring-1 ring-emerald-400 hover:bg-emerald-700'
            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
        } ${isHiddenByFilter ? 'opacity-40' : ''}"
        title="Câu ${idx + 1}: ${isAnswered ? 'Đã làm' : 'Chưa làm'}"
      >
        ${idx + 1}
      </button>
    `;
  }).join('');
}

function scrollToExamQuestion(idx) {
  // If current question is filtered out, switch to 'all'
  if (activeExamPartFilter !== 'all') {
    filterExamQuestionsByPart('all');
  }

  setTimeout(() => {
    const qEl = document.getElementById(`exam-q-box-${idx}`);
    if (qEl) {
      qEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      qEl.classList.add('ring-4', 'ring-[#8B1E1E]/40', 'transition-all');
      setTimeout(() => qEl.classList.remove('ring-4', 'ring-[#8B1E1E]/40'), 1600);
    }
  }, 60);
}

function playHanbanRepeatAudio(text) {
  if (typeof playChineseTTS !== 'function') return;
  if (typeof showToast === 'function') {
    showToast('🎧 Đang phát âm thanh lần 1 (Chuẩn phòng thi Hanban)...', 'info');
  }
  playChineseTTS(text, 'female');
  setTimeout(() => {
    if (typeof showToast === 'function') {
      showToast('🎧 Đang phát lại lần 2 (Chuẩn phòng thi Hanban)...', 'info');
    }
    playChineseTTS(text, 'male');
  }, 2300);
}

// ---------------- RENDER EXAM QUESTIONS ----------------
function renderMockExam() {
  const container = document.getElementById('mockExamQuestionsContainer');
  if (!container || !activeExam) return;

  const questions = activeExam.questions || [];

  container.innerHTML = questions.map((q, idx) => {
    const secLower = (q.section || '').toLowerCase();
    const isListening = q.skill === 'listening' || secLower.includes('nghe') || secLower.includes('听力');
    const isWriting = q.skill === 'writing' || secLower.includes('viết') || secLower.includes('书写');
    const isReading = !isListening && !isWriting;

    // Filter check
    if (activeExamPartFilter === 'listening' && !isListening) return '';
    if (activeExamPartFilter === 'reading' && !isReading) return '';
    if (activeExamPartFilter === 'writing' && !isWriting) return '';

    const userAns = examUserAnswers[q.id];

    let contentHtml = '';
    // Listening audio section
    if (q.audioText) {
      contentHtml += `
        <div class="flex items-center gap-2 mb-3 p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/80 dark:border-stone-700 flex-wrap">
          <div class="inline-flex items-center gap-1.5 bg-white dark:bg-stone-900 p-1 rounded-xl border border-amber-300 dark:border-stone-700 shadow-2xs">
            <button type="button" onclick="event.preventDefault(); playChineseTTS('${escapeJs(q.audioText)}', 'female')" class="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer" title="Nghe câu hỏi giọng Nữ bản ngữ">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
              <span>👩 Nữ Bắc Kinh</span>
            </button>
            <button type="button" onclick="event.preventDefault(); playChineseTTS('${escapeJs(q.audioText)}', 'male')" class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer" title="Nghe câu hỏi giọng Nam bản ngữ">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
              <span>👨 Nam Bắc Kinh</span>
            </button>
          </div>
          <button type="button" onclick="event.preventDefault(); playHanbanRepeatAudio('${escapeJs(q.audioText)}')" class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1 border border-emerald-300/80 transition-all cursor-pointer shadow-2xs" title="Phát 2 lần chuẩn quy chuẩn thi Hanban">
            <i data-lucide="repeat" class="w-3.5 h-3.5 text-emerald-600"></i>
            <span>🔁 Phát 2 Lần (Chuẩn Hanban)</span>
          </button>
        </div>
      `;
    }

    if (q.statement) {
      contentHtml += `
        <div class="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-3 bg-amber-50/50 dark:bg-stone-800/50 p-3 rounded-xl border border-amber-200/60 dark:border-stone-700">
          <span class="text-xs font-bold text-amber-900 dark:text-amber-400 block mb-1">📌 Nội dung câu hỏi / Nhận định:</span>
          "${q.statement}"
        </div>
      `;
    }

    // Word Reorder (HSK 3 - 6)
    if (q.words && q.correctOrder) {
      const selected = examUserAnswers[q.id] || [];
      const unselected = q.words.filter(w => !selected.includes(w));
      contentHtml += `
        <div class="space-y-3">
          <div class="min-h-[52px] p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-amber-300 dark:border-stone-700 flex flex-wrap gap-2 items-center">
            ${selected.length === 0 ? '<span class="text-xs text-stone-400">Bấm chọn các cụm từ bên dưới theo thứ tự câu hoàn chỉnh đúng ngữ pháp:</span>' : ''}
            ${selected.map((w, sIdx) => `
              <button type="button" onclick="removeExamReorderWord('${escapeJs(q.id)}', ${sIdx})" class="px-3 py-1.5 rounded-xl bg-[#8B1E1E] text-white font-hanzi font-bold text-sm shadow-xs flex items-center gap-1 cursor-pointer hover:bg-red-800 transition-all">
                <span>${w}</span>
                <span class="text-xs text-amber-200">×</span>
              </button>
            `).join('')}
          </div>
          <div class="flex flex-wrap gap-2">
            ${unselected.map(w => `
              <button type="button" onclick="addExamReorderWord('${escapeJs(q.id)}', '${escapeJs(w)}')" class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-hanzi font-bold text-sm shadow-2xs cursor-pointer transition-all">
                ${w}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    } else if (q.options) {
      // Multiple Choice / True-False
      contentHtml += `
        <div class="grid grid-cols-1 gap-2.5">
          ${q.options.map(opt => `
            <button 
              type="button"
              onclick="selectExamAnswer('${escapeJs(q.id)}', '${escapeJs(opt.key)}')"
              class="w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                userAns === opt.key
                  ? 'bg-amber-100/90 dark:bg-amber-950/70 border-amber-500 text-amber-950 dark:text-amber-200 font-bold shadow-2xs ring-2 ring-amber-400'
                  : 'bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }">
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                userAns === opt.key ? 'bg-[#8B1E1E] text-white' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
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
      <div id="exam-q-box-${idx}" class="glass-card rounded-2xl p-6 border border-stone-200 dark:border-stone-750 bg-white dark:bg-stone-850 shadow-xs space-y-3.5 transition-all">
        <div class="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5 flex-wrap gap-2">
          <span class="text-xs font-black text-[#8B1E1E] dark:text-amber-400 flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full ${isListening ? 'bg-sky-500' : isReading ? 'bg-amber-500' : 'bg-rose-500'} inline-block"></span>
            ${q.section}
          </span>
          <span class="text-xs font-bold text-stone-400 font-mono">Câu ${idx + 1} / ${questions.length}</span>
        </div>
        <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug whitespace-pre-line">${q.prompt}</h4>
        ${contentHtml}
      </div>
    `;
  }).join('');

  if (typeof refreshIcons === 'function') refreshIcons(container);
  renderQuestionPalette();
}

function escapeJs(str) {
  if (!str) return '';
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '');
}

function selectExamAnswer(questionId, optionKey) {
  examUserAnswers[questionId] = optionKey;
  renderMockExam();
  updateExamProgressStats();
}

function addExamReorderWord(qId, word) {
  if (!examUserAnswers[qId]) examUserAnswers[qId] = [];
  examUserAnswers[qId].push(word);
  renderMockExam();
  updateExamProgressStats();
}

function removeExamReorderWord(qId, idx) {
  if (examUserAnswers[qId]) {
    examUserAnswers[qId].splice(idx, 1);
    renderMockExam();
    updateExamProgressStats();
  }
}

// ---------------- 60 EXAMS SELECTOR MODAL ----------------
function openExamSelectorModal() {
  if (!document.getElementById('examSelectorModal')) return;
  renderExamSelectorGrid();
  if (typeof openModal === 'function') {
    openModal('examSelectorModal');
  } else {
    document.getElementById('examSelectorModal').classList.remove('hidden');
  }
}

function closeExamSelectorModal() {
  if (typeof closeModal === 'function') {
    closeModal('examSelectorModal');
  } else {
    const modal = document.getElementById('examSelectorModal');
    if (modal) modal.classList.add('hidden');
  }
}
if (typeof registerModal === 'function') {
  registerModal('examSelectorModal', closeExamSelectorModal);
}

async function renderExamSelectorGrid() {
  const container = document.getElementById('examSelectorGridContainer');
  const levelBadge = document.getElementById('examModalLevelBadge');
  if (!container) return;

  if (levelBadge) {
    levelBadge.innerText = `HSK ${currentExamLevel} (60 Đề)`;
  }

  container.innerHTML = '<div class="col-span-full py-8 text-center text-xs text-stone-400">Đang tải kho 60 đề thi...</div>';

  const exams = await getExamsForLevel(currentExamLevel);
  container.innerHTML = '';

  const history = userExamHistory[currentExamLevel] || {};

  exams.forEach(ex => {
    const isCurrent = ex.testNumber === currentExamTestNumber;
    const record = history[ex.testNumber];

    const card = document.createElement('button');
    card.type = 'button';
    card.className = `p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
      isCurrent
        ? 'bg-amber-100/90 dark:bg-amber-950/70 border-[#8B1E1E] dark:border-amber-500 shadow-md ring-2 ring-[#8B1E1E]/30'
        : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:shadow-xs'
    }`;
    card.onclick = () => {
      switchMockExamTest(ex.testNumber);
      closeExamSelectorModal();
    };

    let statusBadge = '<span class="text-[9px] px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-500 font-bold">Chưa thi</span>';
    if (record) {
      if (record.isPassed) {
        statusBadge = `<span class="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black">Đỗ (${record.score}đ)</span>`;
      } else {
        statusBadge = `<span class="text-[9px] px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-black">Trượt (${record.score}đ)</span>`;
      }
    }

    const pad = ex.testNumber < 10 ? '0' + ex.testNumber : ex.testNumber;
    card.innerHTML = `
      <div class="flex items-center justify-between w-full mb-1">
        <span class="text-xs font-black text-amber-900 dark:text-amber-300 font-mono">Đề #${pad}</span>
        ${statusBadge}
      </div>
      <p class="text-[11px] font-bold text-stone-800 dark:text-stone-200 line-clamp-1">
        ${ex.title}
      </p>
      <div class="mt-2 text-[9px] text-stone-400 flex items-center justify-between w-full pt-1.5 border-t border-stone-100 dark:border-stone-750">
        <span>⏱️ ${ex.durationMinutes}p</span>
        <span>${ex.passScore}/${ex.totalScore}đ đỗ</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// ---------------- SUBMIT & RESULT EVALUATION ----------------
function submitMockExam() {
  if (!activeExam) return;
  if (examTimerInterval) clearInterval(examTimerInterval);

  let correctCount = 0;
  const questions = activeExam.questions || [];
  const breakdownList = [];

  let listeningCorrect = 0, listeningTotal = 0;
  let readingCorrect = 0, readingTotal = 0;
  let writingCorrect = 0, writingTotal = 0;

  questions.forEach((q, idx) => {
    let isCorrect = false;
    let userAnsText = '';
    let correctAnsText = '';

    const secLower = (q.section || '').toLowerCase();
    const isListening = q.skill === 'listening' || secLower.includes('nghe') || secLower.includes('听力');
    const isWriting = q.skill === 'writing' || secLower.includes('viết') || secLower.includes('书写');
    const isReading = !isListening && !isWriting;

    if (isListening) listeningTotal++;
    else if (isWriting) writingTotal++;
    else readingTotal++;

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

    if (isCorrect) {
      correctCount++;
      if (isListening) listeningCorrect++;
      else if (isWriting) writingCorrect++;
      else readingCorrect++;
    }

    breakdownList.push({
      index: idx + 1,
      section: q.section,
      prompt: q.prompt,
      isCorrect,
      userAnsText,
      correctAnsText,
      explanation: q.explanation
    });
  });

  const totalScore = activeExam.totalScore || (activeExam.level <= 2 ? 200 : 300);
  const passScore = activeExam.passScore || (activeExam.level <= 2 ? 120 : 180);

  // Hanban standard score calculation
  let listeningScore = 0;
  let readingScore = 0;
  let writingScore = 0;
  let totalScoreAchieved = 0;

  if (activeExam.level <= 2) {
    // 200 max points (100 listening + 100 reading)
    listeningScore = Math.round((listeningCorrect / Math.max(1, listeningTotal)) * 100);
    readingScore = Math.round((readingCorrect / Math.max(1, readingTotal)) * 100);
    totalScoreAchieved = listeningScore + readingScore;
  } else {
    // 300 max points (100 listening + 100 reading + 100 writing)
    listeningScore = Math.round((listeningCorrect / Math.max(1, listeningTotal)) * 100);
    readingScore = Math.round((readingCorrect / Math.max(1, readingTotal)) * 100);
    writingScore = Math.round((writingCorrect / Math.max(1, writingTotal)) * 100);
    totalScoreAchieved = listeningScore + readingScore + writingScore;
  }

  const isPassed = totalScoreAchieved >= passScore;

  // Save history
  saveExamHistory(activeExam.level, activeExam.testNumber, {
    score: totalScoreAchieved,
    maxScore: totalScore,
    isPassed: isPassed,
    date: new Date().toLocaleDateString('vi-VN')
  });

  // Grant EXP
  if (typeof addExp === 'function') {
    addExp(isPassed ? 60 : 25, `Hoàn thành Đề ${activeExam.testNumber} HSK ${activeExam.level}`);
  }

  // Populate Result Modal
  const emojiEl = document.getElementById('examResultEmoji');
  const titleEl = document.getElementById('examResultTitle');
  const subtitleEl = document.getElementById('examResultSubtitle');
  const scoreEl = document.getElementById('examScoreValue');
  const maxScoreEl = document.getElementById('examMaxScoreValue');
  const badgeEl = document.getElementById('examResultBadge');
  const breakdownContainer = document.getElementById('examAnswerBreakdown');

  if (scoreEl) scoreEl.innerText = totalScoreAchieved;
  if (maxScoreEl) maxScoreEl.innerText = `/ ${totalScore}`;

  if (isPassed) {
    if (emojiEl) emojiEl.innerText = '🎉';
    if (titleEl) titleEl.innerText = 'Chúc Mừng Bạn Đã Đỗ Kỳ Thi HSK!';
    if (subtitleEl) subtitleEl.innerText = `Đạt chuẩn điểm đỗ Hanban CTI với ${correctCount}/${questions.length} câu đúng (+60 EXP ⭐)`;
    if (badgeEl) {
      badgeEl.className = 'mt-2 px-4 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300';
      badgeEl.innerText = 'ĐẠT TIÊU CHUẨN ĐỖ (合格)';
    }
  } else {
    if (emojiEl) emojiEl.innerText = '💪';
    if (titleEl) titleEl.innerText = 'Chưa Đạt Điểm Chuẩn Đỗ!';
    if (subtitleEl) subtitleEl.innerText = `Bạn đạt ${correctCount}/${questions.length} câu đúng (${totalScoreAchieved}/${totalScore}đ). Cần tối thiểu ${passScore}đ để đạt (+25 EXP ⭐)`;
    if (badgeEl) {
      badgeEl.className = 'mt-2 px-4 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300';
      badgeEl.innerText = `CHƯA ĐẠT (Điểm liệt: ${passScore})`;
    }
  }

  // Detailed section stats + question breakdown
  if (breakdownContainer) {
    const secHtml = `
      <div class="grid grid-cols-2 ${writingTotal > 0 ? 'sm:grid-cols-3' : ''} gap-2.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center mb-4">
        <div>
          <div class="text-[10px] text-stone-400 font-bold uppercase">🎧 Nghe Hiểu (听力)</div>
          <div class="text-base font-black text-sky-700 dark:text-sky-300">${listeningCorrect} / ${listeningTotal}</div>
          <div class="text-[11px] font-bold text-stone-500">${listeningScore} / 100 điểm</div>
        </div>
        <div>
          <div class="text-[10px] text-stone-400 font-bold uppercase">📖 Đọc Hiểu (阅读)</div>
          <div class="text-base font-black text-amber-700 dark:text-amber-300">${readingCorrect} / ${readingTotal}</div>
          <div class="text-[11px] font-bold text-stone-500">${readingScore} / 100 điểm</div>
        </div>
        ${writingTotal > 0 ? `
        <div>
          <div class="text-[10px] text-stone-400 font-bold uppercase">✍️ Viết (书写)</div>
          <div class="text-base font-black text-rose-700 dark:text-rose-300">${writingCorrect} / ${writingTotal}</div>
          <div class="text-[11px] font-bold text-stone-500">${writingScore} / 100 điểm</div>
        </div>
        ` : ''}
      </div>
    `;

    breakdownContainer.innerHTML = secHtml + breakdownList.map(item => `
      <div class="p-3.5 rounded-xl border ${item.isCorrect ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'} space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-bold ${item.isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}">
            Câu ${item.index} [${item.section}]: ${item.isCorrect ? '✅ Đúng' : '❌ Sai'}
          </span>
        </div>
        <p class="text-stone-800 dark:text-stone-200 font-semibold">${item.prompt}</p>
        <p class="text-stone-600 dark:text-stone-400">Câu trả lời của bạn: <strong class="${item.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}">${item.userAnsText}</strong></p>
        ${!item.isCorrect ? `<p class="text-emerald-700 dark:text-emerald-400">Đáp án chuẩn: <strong>${item.correctAnsText}</strong></p>` : ''}
        <p class="text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/60 dark:border-stone-700">💡 ${item.explanation}</p>
      </div>
    `).join('');
  }

  if (typeof openModal === 'function') {
    openModal('examResultModal');
  } else {
    const modal = document.getElementById('examResultModal');
    if (modal) modal.classList.remove('hidden');
  }
}

function closeExamResultModal() {
  if (typeof closeModal === 'function') {
    closeModal('examResultModal');
  } else {
    const modal = document.getElementById('examResultModal');
    if (modal) modal.classList.add('hidden');
  }
}
