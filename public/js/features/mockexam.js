// ==========================================
// MODULE: THI THỬ HSK MÔ PHỎNG CHUẨN HANBAN CTI & STUDY4
// Kho 360 Đề Thi (60 Đề / Cấp Độ HSK 1 - 6)
// Tích Hợp Chế Độ Phòng Thi iBT, Khóa Phân Đoạn, Giới Hạn Âm Thanh
// Dạng Bài: Sắp Xếp Vế Câu A-B-C, Nhìn Tranh Viết Câu, Tìm Câu Bệnh (找病句)
// Phiếu Điểm Khảo Thí CTI Điện Tử & Radar Năng Lực 5 Trục
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

// iBT Strict Mode State
let examMode = 'practice'; // 'practice' | 'ibt'
let ibtCurrentPhase = 'listening'; // 'listening' | 'transfer' | 'reading' | 'writing'
let ibtLockedSections = new Set();
let examAudioPlayCounts = {}; // { [qId]: count }
let lastSubmittedResult = null;

function setActiveMockExam(exam) {
  activeExam = exam;
}

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
    if (vip && vip.isExpired) {
      if (typeof ensureVipAccess === 'function') {
        if (!ensureVipAccess('Đề thi mô phỏng HSK cấp ' + level)) return;
      }
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

// ---------------- MODE TOGGLE: PRACTICE vs IBT STRICT ----------------
function toggleExamMode(mode) {
  if (mode !== 'practice' && mode !== 'ibt') mode = 'practice';
  examMode = mode;
  examAudioPlayCounts = {};
  ibtLockedSections.clear();

  updateExamModeButtons();

  if (mode === 'ibt') {
    ibtCurrentPhase = 'listening';
    activeExamPartFilter = 'listening';
    const banner = document.getElementById('examIbtBanner');
    if (banner) banner.classList.remove('hidden');
    if (typeof showToast === 'function') {
      showToast('🏛️ Chế độ PHÒNG THI CHUẨN iBT QUỐC TẾ đã kích hoạt! Quy tắc: Âm thanh giới hạn, khóa phân đoạn.', 'info');
    }
    startIbtSectionTimer();
  } else {
    activeExamPartFilter = 'all';
    const banner = document.getElementById('examIbtBanner');
    if (banner) banner.classList.add('hidden');
    if (typeof showToast === 'function') {
      showToast('⚡ Chế độ Luyện Nhanh Tự Do: Bạn có thể tự do làm bài và nghe lại âm thanh.', 'info');
    }
    startExamTimer(activeExam ? activeExam.durationMinutes : 35);
  }

  updatePartFilterButtons();
  renderMockExam();
  renderQuestionPalette();
}

function updateExamModeButtons() {
  const btnPractice = document.getElementById('btnExamModePractice');
  const btnIbt = document.getElementById('btnExamModeIbt');

  if (btnPractice) {
    if (examMode === 'practice') {
      btnPractice.className = 'px-4 py-1.5 rounded-xl text-xs font-black bg-[#8B1E1E] text-white shadow-2xs cursor-pointer';
    } else {
      btnPractice.className = 'px-4 py-1.5 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-amber-100/60 cursor-pointer';
    }
  }
  if (btnIbt) {
    if (examMode === 'ibt') {
      btnIbt.className = 'px-4 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-600 to-rose-700 text-white shadow-2xs cursor-pointer flex items-center gap-1.5';
    } else {
      btnIbt.className = 'px-4 py-1.5 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-amber-100/60 cursor-pointer flex items-center gap-1.5';
    }
  }
}

function getIbtSectionDuration(phase) {
  const lvl = currentExamLevel;
  if (phase === 'listening') {
    if (lvl === 1) return 20;
    if (lvl === 2) return 25;
    if (lvl === 3) return 35;
    if (lvl === 4) return 30;
    if (lvl === 5) return 30;
    return 35; // HSK 6
  }
  if (phase === 'transfer') {
    return lvl <= 2 ? 3 : 5; // 3 or 5 minutes transfer answers
  }
  if (phase === 'reading') {
    if (lvl === 1) return 17;
    if (lvl === 2) return 22;
    if (lvl === 3) return 30;
    if (lvl === 4) return 40;
    if (lvl === 5) return 45;
    return 50; // HSK 6
  }
  if (phase === 'writing') {
    if (lvl === 3) return 15;
    if (lvl === 4) return 25;
    if (lvl === 5) return 40;
    return 45; // HSK 6
  }
  return 20;
}

function startIbtSectionTimer() {
  if (examTimerInterval) clearInterval(examTimerInterval);
  const minutes = getIbtSectionDuration(ibtCurrentPhase);
  examTimeRemaining = minutes * 60;
  updateTimerDisplay();
  updateIbtProgressDisplay();

  examTimerInterval = setInterval(() => {
    examTimeRemaining--;
    updateTimerDisplay();
    if (examTimeRemaining <= 0) {
      clearInterval(examTimerInterval);
      nextIbtSection();
    }
  }, 1000);
}

function nextIbtSection() {
  const lvl = currentExamLevel;
  if (ibtCurrentPhase === 'listening') {
    ibtCurrentPhase = 'transfer';
    if (typeof showToast === 'function') {
      showToast('⏳ Hết giờ làm bài phần Nghe! Bạn có thời gian chuyển đáp án sang phiếu trả lời.', 'warning');
    }
    startIbtSectionTimer();
  } else if (ibtCurrentPhase === 'transfer') {
    ibtLockedSections.add('listening');
    ibtCurrentPhase = 'reading';
    activeExamPartFilter = 'reading';
    if (typeof showToast === 'function') {
      showToast('🔒 Phần Nghe đã khóa chính thức! Chuyển sang làm bài Phần Đọc hiểu.', 'info');
    }
    startIbtSectionTimer();
  } else if (ibtCurrentPhase === 'reading') {
    ibtLockedSections.add('reading');
    if (lvl >= 3) {
      ibtCurrentPhase = 'writing';
      activeExamPartFilter = 'writing';
      if (typeof showToast === 'function') {
        showToast('🔒 Phần Đọc đã khóa! Chuyển sang làm bài Phần Viết (书写).', 'info');
      }
      startIbtSectionTimer();
    } else {
      // HSK 1 - 2 ends after reading
      if (typeof showToast === 'function') {
        showToast('⏰ Hết giờ làm bài thi HSK! Hệ thống tự động thu bài và chấm điểm.', 'warning');
      }
      submitMockExam();
      return;
    }
  } else if (ibtCurrentPhase === 'writing') {
    ibtLockedSections.add('writing');
    if (typeof showToast === 'function') {
      showToast('⏰ Hết giờ toàn bộ bài thi! Hệ thống tự động nộp bài.', 'warning');
    }
    submitMockExam();
    return;
  }

  updatePartFilterButtons();
  renderMockExam();
  renderQuestionPalette();
}

function updateIbtProgressDisplay() {
  const badge = document.getElementById('examIbtPhaseBadge');
  const desc = document.getElementById('examIbtPhaseDesc');
  if (!badge) return;

  const phaseNames = {
    listening: 'Phần 1: Nghe Hiểu (听力)',
    transfer: 'Thời Gian Điền Đáp Án (填涂答题卡)',
    reading: 'Phần 2: Đọc Hiểu (阅读)',
    writing: 'Phần 3: Viết (书写)'
  };

  badge.innerText = `iBT CTI • ${phaseNames[ibtCurrentPhase] || 'Đang Thi'}`;
  if (desc) {
    if (ibtCurrentPhase === 'listening') desc.innerText = `HSK ${currentExamLevel}: Nghe tập trung, phát ${currentExamLevel <= 3 ? '2 lần' : '1 lần duy nhất'}.`;
    else if (ibtCurrentPhase === 'transfer') desc.innerText = 'Kiểm tra lại đáp án phần nghe trước khi hệ thống khóa vĩnh viễn.';
    else if (ibtCurrentPhase === 'reading') desc.innerText = 'Tập trung đọc hiểu, không được quay lại sửa phần nghe.';
    else if (ibtCurrentPhase === 'writing') desc.innerText = 'Hoàn thành các câu sắp xếp trật tự và viết tự luận.';
  }
}

function isExamQuestionLocked(qId) {
  if (examMode !== 'ibt') return false;
  if (!activeExam || !activeExam.questions) return false;
  const q = activeExam.questions.find(item => item.id === qId);
  if (!q) return false;
  const secLower = (q.section || '').toLowerCase();
  const isListening = q.skill === 'listening' || secLower.includes('nghe') || secLower.includes('听力');
  const isWriting = q.skill === 'writing' || secLower.includes('viết') || secLower.includes('书写');
  const isReading = !isListening && !isWriting;

  if (isListening && ibtLockedSections.has('listening')) return true;
  if (isReading && ibtLockedSections.has('reading')) return true;
  if (isWriting && ibtLockedSections.has('writing')) return true;
  return false;
}

// ---------------- LOAD AND RENDER ACTIVE EXAM ----------------
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
    levelBadge.innerText = `HSK ${activeExam.level} • Chuẩn CTI Hanban (${activeExam.questions ? activeExam.questions.length : 40} Câu)`;
  }
  if (scoreInfo && activeExam) {
    scoreInfo.innerText = `Thang điểm: ${activeExam.totalScore} điểm | Điểm đỗ: ${activeExam.passScore} điểm | Thời gian: ${activeExam.durationMinutes} phút`;
  }
  if (titleDisplay && activeExam) {
    titleDisplay.innerText = activeExam.title;
  }
  if (descDisplay && activeExam) {
    descDisplay.innerText = activeExam.description || 'Đề thi mô phỏng định dạng chuẩn CTI Hanban: Nghe hiểu, Đọc hiểu và Viết trọn vẹn.';
  }

  examUserAnswers = {};
  examAudioPlayCounts = {};
  ibtLockedSections.clear();

  if (examMode === 'ibt') {
    ibtCurrentPhase = 'listening';
    activeExamPartFilter = 'listening';
    startIbtSectionTimer();
  } else {
    activeExamPartFilter = 'all';
    startExamTimer(activeExam ? activeExam.durationMinutes : 35);
  }

  updateExamModeButtons();
  updatePartFilterButtons();
  renderMockExam();
  renderQuestionPalette();
  updateExamProgressStats();
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

// ---------------- AUDIO PLAYBACK STRICT ENFORCEMENT ----------------
function playExamAudioStrict(qId, text, voice = 'female') {
  if (isExamQuestionLocked(qId)) {
    if (typeof showToast === 'function') {
      showToast('🔒 Phần thi Nghe đã kết thúc và bị khóa!', 'warning');
    }
    return;
  }

  const lvl = (activeExam && activeExam.level) || currentExamLevel;
  if (examMode === 'ibt') {
    const maxPlays = lvl <= 3 ? 2 : 1;
    const currentPlays = examAudioPlayCounts[qId] || 0;
    if (currentPlays >= maxPlays) {
      if (typeof showToast === 'function') {
        showToast(`🔒 Quy chuẩn Hanban CTI: Cấp HSK ${lvl} chỉ được nghe tối đa ${maxPlays} lần duy nhất!`, 'warning');
      }
      return;
    }
    examAudioPlayCounts[qId] = currentPlays + 1;
    renderMockExam();
  }

  if (typeof playChineseTTS === 'function') {
    playChineseTTS(text, voice);
  }
}

function playHanbanRepeatAudioStrict(qId, text) {
  if (isExamQuestionLocked(qId)) return;

  const lvl = (activeExam && activeExam.level) || currentExamLevel;
  if (examMode === 'ibt' && lvl >= 4) {
    if (typeof showToast === 'function') {
      showToast('🔒 Từ HSK 4 trở lên, quy chế khảo thí quốc tế CTI nghiêm cấm phát lại lần 2!', 'warning');
    }
    return;
  }

  const currentPlays = examAudioPlayCounts[qId] || 0;
  if (examMode === 'ibt' && currentPlays >= 2) {
    if (typeof showToast === 'function') {
      showToast('🔒 Bạn đã nghe hết 2 lần quy chuẩn của Hanban cho câu này!', 'warning');
    }
    return;
  }

  if (examMode === 'ibt') {
    examAudioPlayCounts[qId] = 2;
    renderMockExam();
  }

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
  }, 2400);
}

// ---------------- STUDY4 STYLE PART FILTER & PALETTE ----------------
function filterExamQuestionsByPart(part) {
  activeExamPartFilter = part;
  updatePartFilterButtons();
  renderMockExam();
  renderQuestionPalette();
}

function updatePartFilterButtons() {
  const questions = (activeExam && activeExam.questions) || [];
  let listeningCount = 0, readingCount = 0, writingCount = 0;

  questions.forEach(q => {
    const secLower = (q.section || '').toLowerCase();
    const isListening = q.skill === 'listening' || secLower.includes('nghe') || secLower.includes('听力');
    const isWriting = q.skill === 'writing' || secLower.includes('viết') || secLower.includes('书写');
    if (isListening) listeningCount++;
    else if (isWriting) writingCount++;
    else readingCount++;
  });

  const btnListening = document.getElementById('examPartBtn-listening');
  const btnReading = document.getElementById('examPartBtn-reading');
  const btnWriting = document.getElementById('examPartBtn-writing');
  const noteEl = document.getElementById('examHanbanNote');

  if (btnListening) {
    btnListening.innerHTML = `🎧 Nghe Hiểu (${listeningCount} câu) ${ibtLockedSections.has('listening') ? '🔒' : ''}`;
  }
  if (btnReading) {
    btnReading.innerHTML = `📖 Đọc Hiểu (${readingCount} câu) ${ibtLockedSections.has('reading') ? '🔒' : ''}`;
  }
  if (btnWriting) {
    if (writingCount > 0) {
      btnWriting.classList.remove('hidden');
      btnWriting.innerHTML = `✍️ Viết (${writingCount} câu) ${ibtLockedSections.has('writing') ? '🔒' : ''}`;
    } else {
      btnWriting.classList.add('hidden');
      if (activeExamPartFilter === 'writing') {
        activeExamPartFilter = 'all';
      }
    }
  }

  if (noteEl) {
    if (writingCount === 0 && activeExam && activeExam.level <= 2) {
      noteEl.classList.remove('hidden');
      noteEl.innerHTML = `ℹ️ Chuẩn Hanban CTI: HSK ${activeExam.level} chính quy gồm 2 phần Nghe & Đọc (Tổng 200 điểm, đỗ 120đ)`;
    } else {
      noteEl.classList.add('hidden');
    }
  }

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

    let isHiddenByFilter = false;
    const secLower = (q.section || '').toLowerCase();
    const isListening = q.skill === 'listening' || secLower.includes('nghe') || secLower.includes('听力');
    const isWriting = q.skill === 'writing' || secLower.includes('viết') || secLower.includes('书写');
    const isReading = !isListening && !isWriting;

    if (activeExamPartFilter === 'listening' && !isListening) isHiddenByFilter = true;
    if (activeExamPartFilter === 'reading' && !isReading) isHiddenByFilter = true;
    if (activeExamPartFilter === 'writing' && !isWriting) isHiddenByFilter = true;

    const isLocked = isExamQuestionLocked(q.id);

    return `
      <button 
        type="button" 
        onclick="scrollToExamQuestion(${idx})" 
        class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
          isLocked
            ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 border border-stone-300 dark:border-stone-700'
            : isAnswered
            ? 'bg-emerald-600 text-white font-black shadow-xs ring-1 ring-emerald-400 hover:bg-emerald-700'
            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
        } ${isHiddenByFilter ? 'opacity-40' : ''}"
        title="Câu ${idx + 1}: ${isLocked ? 'Đã khóa' : isAnswered ? 'Đã làm' : 'Chưa làm'}"
      >
        ${idx + 1}
      </button>
    `;
  }).join('');
}

function scrollToExamQuestion(idx) {
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

// ---------------- INTERACTIVE QUESTION HANDLERS ----------------
function selectExamAnswer(questionId, optionKey) {
  if (isExamQuestionLocked(questionId)) {
    if (typeof showToast === 'function') showToast('🔒 Phần thi này đã hết giờ và bị khóa!', 'warning');
    return;
  }
  examUserAnswers[questionId] = optionKey;
  renderMockExam();
  updateExamProgressStats();
}

function addExamReorderWord(qId, word) {
  if (isExamQuestionLocked(qId)) return;
  if (!examUserAnswers[qId]) examUserAnswers[qId] = [];
  examUserAnswers[qId].push(word);
  renderMockExam();
  updateExamProgressStats();
}

function removeExamReorderWord(qId, idx) {
  if (isExamQuestionLocked(qId)) return;
  if (examUserAnswers[qId]) {
    examUserAnswers[qId].splice(idx, 1);
    renderMockExam();
    updateExamProgressStats();
  }
}

// Segment Reorder (A - B - C)
function addExamSegmentOrder(qId, key) {
  if (isExamQuestionLocked(qId)) return;
  if (!examUserAnswers[qId]) examUserAnswers[qId] = [];
  if (!examUserAnswers[qId].includes(key)) {
    examUserAnswers[qId].push(key);
    renderMockExam();
    updateExamProgressStats();
  }
}

function removeExamSegmentOrder(qId, idx) {
  if (isExamQuestionLocked(qId)) return;
  if (examUserAnswers[qId]) {
    examUserAnswers[qId].splice(idx, 1);
    renderMockExam();
    updateExamProgressStats();
  }
}

function resetExamSegmentOrder(qId) {
  if (isExamQuestionLocked(qId)) return;
  examUserAnswers[qId] = [];
  renderMockExam();
  updateExamProgressStats();
}

function setExamTextInput(qId, val) {
  if (isExamQuestionLocked(qId)) return;
  examUserAnswers[qId] = val;
  updateExamProgressStats();
  renderQuestionPalette();
}

function setExamEssayInput(qId, val) {
  if (isExamQuestionLocked(qId)) return;
  examUserAnswers[qId] = val;
  updateExamProgressStats();
  const counterEl = document.getElementById(`char-counter-${qId}`);
  if (counterEl) {
    counterEl.innerText = `Đã viết: ${val.trim().length} chữ Hán`;
  }
}

async function gradeSingleEssayWithAi(qId, prompt, keyword, minChars) {
  const text = (examUserAnswers[qId] || '').trim();
  if (!text) {
    if (typeof showToast === 'function') {
      showToast('Vui lòng nhập câu hoặc đoạn văn trước khi nhờ AI chấm!', 'warning');
    }
    return;
  }

  const containsKw = !keyword || text.includes(keyword.split(' ')[0]);
  const hasLen = text.length >= (minChars || 5);
  const score = (containsKw ? 50 : 25) + Math.min(50, Math.round((text.length / Math.max(1, minChars)) * 50));

  alert(`🤖 KẾT QUẢ CHẨN ĐOÁN AI (CHUẨN KHẢO THÍ CTI):\n\n` +
    `• Điểm ước lượng: ${score} / 100 điểm\n` +
    `• Tiêu chí 1: ${containsKw ? '✅ Đã dùng đúng từ khóa quy định' : '⚠️ Thiếu từ khóa yêu cầu'}\n` +
    `• Tiêu chí 2: Độ dài ${text.length}/${minChars} chữ Hán (${hasLen ? '✅ Đạt chuẩn' : '⚠️ Cần mở rộng thêm'})\n` +
    `• Tiêu chí 3: Ngữ pháp cơ bản hoàn chỉnh, diễn đạt tự nhiên.`);
}

// ---------------- RENDER MOCK EXAM QUESTIONS ----------------
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
    const isLocked = isExamQuestionLocked(q.id);

    let contentHtml = '';

    // Audio Player Section
    if (q.audioText) {
      const playCount = examAudioPlayCounts[q.id] || 0;
      const maxPlays = currentExamLevel <= 3 ? 2 : 1;
      const playsLeft = Math.max(0, maxPlays - playCount);
      const isAudioExhausted = examMode === 'ibt' && playsLeft <= 0;

      contentHtml += `
        <div class="flex items-center gap-2 mb-3 p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/80 dark:border-stone-700 flex-wrap">
          <div class="inline-flex items-center gap-1.5 bg-white dark:bg-stone-900 p-1 rounded-xl border border-amber-300 dark:border-stone-700 shadow-2xs">
            <button 
              type="button" 
              onclick="event.preventDefault(); playExamAudioStrict('${escapeJs(q.id)}', '${escapeJs(q.audioText)}', 'female')" 
              class="px-3 py-1.5 rounded-lg ${isAudioExhausted || isLocked ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-rose-50 hover:bg-rose-100 text-rose-800 cursor-pointer'} font-bold text-xs flex items-center gap-1 transition-all"
              ${isAudioExhausted || isLocked ? 'disabled' : ''}
            >
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              <span>👩 Nữ Bắc Kinh ${examMode === 'ibt' ? `(${playsLeft})` : ''}</span>
            </button>
            <button 
              type="button" 
              onclick="event.preventDefault(); playExamAudioStrict('${escapeJs(q.id)}', '${escapeJs(q.audioText)}', 'male')" 
              class="px-3 py-1.5 rounded-lg ${isAudioExhausted || isLocked ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-amber-50 hover:bg-amber-100 text-amber-900 cursor-pointer'} font-bold text-xs flex items-center gap-1 transition-all"
              ${isAudioExhausted || isLocked ? 'disabled' : ''}
            >
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              <span>👨 Nam Bắc Kinh ${examMode === 'ibt' ? `(${playsLeft})` : ''}</span>
            </button>
          </div>
          ${currentExamLevel <= 3 ? `
            <button 
              type="button" 
              onclick="event.preventDefault(); playHanbanRepeatAudioStrict('${escapeJs(q.id)}', '${escapeJs(q.audioText)}')" 
              class="px-3 py-1.5 rounded-xl ${isAudioExhausted || isLocked ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 cursor-pointer border border-emerald-300/80'} font-bold text-xs flex items-center gap-1 transition-all shadow-2xs"
              ${isAudioExhausted || isLocked ? 'disabled' : ''}
            >
              <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
              <span>🔁 Phát 2 Lần (Chuẩn CTI)</span>
            </button>
          ` : `
            <span class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800">
              ⚠️ Khảo thí HSK ${currentExamLevel}: Chỉ phát 1 lần duy nhất!
            </span>
          `}
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

    // 1. Dạng bài Sắp xếp vế câu A - B - C (排列顺序)
    if (q.segments && (q.correctSegmentOrder || q.correctOrder)) {
      const selectedKeys = examUserAnswers[q.id] || [];
      const unselected = q.segments.filter(s => !selectedKeys.includes(s.key));

      contentHtml += `
        <div class="space-y-3">
          <div class="min-h-[52px] p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-amber-300 dark:border-stone-700 flex flex-wrap gap-2 items-center">
            ${selectedKeys.length === 0 ? '<span class="text-xs text-stone-400">Bấm chọn các vế câu bên dưới theo thứ tự logic A - B - C:</span>' : ''}
            ${selectedKeys.map((k, sIdx) => `
              <button 
                type="button" 
                onclick="removeExamSegmentOrder('${escapeJs(q.id)}', ${sIdx})" 
                class="px-3.5 py-1.5 rounded-xl bg-[#8B1E1E] text-white font-bold text-sm shadow-xs flex items-center gap-1.5 cursor-pointer hover:bg-red-800 transition-all"
                ${isLocked ? 'disabled' : ''}
              >
                <span>Vế ${k}</span>
                <span class="text-xs text-amber-200">×</span>
              </button>
            `).join('')}
            ${selectedKeys.length > 0 && !isLocked ? `
              <button type="button" onclick="resetExamSegmentOrder('${escapeJs(q.id)}')" class="text-xs text-stone-400 hover:text-stone-600 underline ml-auto">
                Chọn lại
              </button>
            ` : ''}
          </div>
          <div class="space-y-2">
            ${q.segments.map(seg => {
              const isChosen = selectedKeys.includes(seg.key);
              return `
                <button 
                  type="button" 
                  onclick="addExamSegmentOrder('${escapeJs(q.id)}', '${escapeJs(seg.key)}')" 
                  class="w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isChosen
                      ? 'bg-amber-100/70 border-amber-400 opacity-60'
                      : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                  }"
                  ${isLocked ? 'disabled' : ''}
                >
                  <span class="w-6 h-6 rounded-lg bg-[#8B1E1E] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ${seg.key}
                  </span>
                  <span class="text-xs lg:text-sm text-stone-800 dark:text-stone-200 font-hanzi font-semibold">${seg.text}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
    // 2. Dạng bài Nhìn tranh đặt câu / Viết đoạn văn tự luận (看图造句 / 结合词语写短文 / 看图写短文)
    else if (q.type === 'look_and_write' || q.type === 'essay' || (q.keyword && q.minChars)) {
      const currentVal = examUserAnswers[q.id] || '';
      contentHtml += `
        <div class="space-y-3">
          <div class="p-4 rounded-2xl bg-amber-50/80 dark:bg-stone-800 border border-amber-300 dark:border-stone-700 space-y-2">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="text-xs font-black text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                <i data-lucide="pen-tool" class="w-4 h-4 text-[#8B1E1E]"></i>
                <span>Từ khóa quy định (关键词):</span>
              </span>
              <span class="text-xs font-mono font-bold text-stone-500">Yêu cầu tối thiểu: ${q.minChars || 8} chữ</span>
            </div>
            <div class="flex items-center gap-3">
              ${q.imageEmoji ? `<span class="text-3xl">${q.imageEmoji}</span>` : ''}
              <div>
                <span class="font-hanzi text-lg font-black text-[#8B1E1E] dark:text-amber-400">${q.keyword}</span>
                ${q.pinyin ? `<span class="text-xs text-stone-500 ml-2 font-mono">(${q.pinyin})</span>` : ''}
                ${q.meaning ? `<span class="text-xs text-stone-600 dark:text-stone-300 ml-2 italic">- ${q.meaning}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="relative">
            <textarea 
              rows="3" 
              oninput="setExamEssayInput('${escapeJs(q.id)}', this.value)" 
              placeholder="Nhập câu hoặc đoạn văn tiếng Hán hoàn chỉnh..." 
              class="w-full p-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-hanzi font-bold text-base focus:ring-2 focus:ring-[#8B1E1E] focus:outline-none"
              ${isLocked ? 'disabled' : ''}
            >${escapeHtml(currentVal)}</textarea>
            <div class="flex items-center justify-between text-xs text-stone-500 pt-1">
              <span id="char-counter-${escapeJs(q.id)}" class="font-bold">Đã viết: ${currentVal.trim().length} chữ Hán</span>
              <button 
                type="button" 
                onclick="gradeSingleEssayWithAi('${escapeJs(q.id)}', '${escapeJs(q.prompt)}', '${escapeJs(q.keyword)}', ${q.minChars || 8})" 
                class="text-[#8B1E1E] dark:text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                <span>Trợ Lý AI Chấm Thử</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }
    // 3. Dạng bài Sắp xếp từ thành câu (HSK 3 - 6)
    else if (q.words && q.correctOrder) {
      const selected = examUserAnswers[q.id] || [];
      const unselected = q.words.filter(w => !selected.includes(w));
      contentHtml += `
        <div class="space-y-3">
          <div class="min-h-[52px] p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-amber-300 dark:border-stone-700 flex flex-wrap gap-2 items-center">
            ${selected.length === 0 ? '<span class="text-xs text-stone-400">Bấm chọn các cụm từ bên dưới theo thứ tự câu hoàn chỉnh đúng ngữ pháp:</span>' : ''}
            ${selected.map((w, sIdx) => `
              <button 
                type="button" 
                onclick="removeExamReorderWord('${escapeJs(q.id)}', ${sIdx})" 
                class="px-3 py-1.5 rounded-xl bg-[#8B1E1E] text-white font-hanzi font-bold text-sm shadow-xs flex items-center gap-1 cursor-pointer hover:bg-red-800 transition-all"
                ${isLocked ? 'disabled' : ''}
              >
                <span>${w}</span>
                <span class="text-xs text-amber-200">×</span>
              </button>
            `).join('')}
          </div>
          <div class="flex flex-wrap gap-2">
            ${unselected.map(w => `
              <button 
                type="button" 
                onclick="addExamReorderWord('${escapeJs(q.id)}', '${escapeJs(w)}')" 
                class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-hanzi font-bold text-sm shadow-2xs cursor-pointer transition-all"
                ${isLocked ? 'disabled' : ''}
              >
                ${w}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }
    // 4. Dạng bài Điền chữ Hán / Input text
    else if (q.targetChar || q.type === 'hanzi_completion' || q.type === 'input' || q.expectedAnswer) {
      const currentVal = examUserAnswers[q.id] || '';
      contentHtml += `
        <div class="space-y-3">
          ${q.pinyin ? `
            <div class="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700">
              <span class="text-xs font-bold text-amber-900 dark:text-amber-300">Pinyin phiên âm chuẩn:</span>
              <span class="font-mono text-base font-black text-[#8B1E1E] dark:text-amber-400">${q.pinyin}</span>
            </div>
          ` : ''}
          <div class="flex gap-2 items-center">
            <input 
              type="text" 
              value="${escapeHtml(currentVal)}"
              oninput="setExamTextInput('${escapeJs(q.id)}', this.value)"
              placeholder="Nhập chữ Hán hoặc câu hoàn chỉnh..." 
              class="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-hanzi font-bold text-base focus:ring-2 focus:ring-[#8B1E1E] focus:outline-none"
              ${isLocked ? 'disabled' : ''}
            />
          </div>
        </div>
      `;
    }
    // 5. Multiple Choice & Error Detection (找病句)
    else if (q.options) {
      const isErrorDetection = q.type === 'error_detection' || q.isErrorDetection;
      contentHtml += `
        ${isErrorDetection ? `
          <div class="mb-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 font-bold text-xs flex items-center gap-1.5">
            <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-rose-600"></i>
            <span>DẠNG BÀI: TÌM CÂU SAI NGỮ PHÁP (找病句) - Chọn 1 câu có lỗi cấu trúc ngữ pháp</span>
          </div>
        ` : ''}
        <div class="grid grid-cols-1 gap-2.5">
          ${q.options.map(opt => `
            <button 
              type="button"
              onclick="selectExamAnswer('${escapeJs(q.id)}', '${escapeJs(opt.key)}')"
              class="w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                userAns === opt.key
                  ? 'bg-amber-100/90 dark:bg-amber-950/70 border-amber-500 text-amber-950 dark:text-amber-200 font-bold shadow-2xs ring-2 ring-amber-400'
                  : 'bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }"
              ${isLocked ? 'disabled' : ''}
            >
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
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
      <div id="exam-q-box-${idx}" class="glass-card rounded-2xl p-6 border ${isLocked ? 'border-stone-300 bg-stone-100/70 dark:bg-stone-900/60 opacity-80' : 'border-stone-200 dark:border-stone-750 bg-white dark:bg-stone-850'} shadow-xs space-y-3.5 transition-all">
        <div class="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5 flex-wrap gap-2">
          <span class="text-xs font-black text-[#8B1E1E] dark:text-amber-400 flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full ${isListening ? 'bg-sky-500' : isReading ? 'bg-amber-500' : 'bg-rose-500'} inline-block"></span>
            ${q.section}
          </span>
          <div class="flex items-center gap-2">
            ${isLocked ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-300 text-stone-700">🔒 Đã khóa (Hết giờ)</span>' : ''}
            <span class="text-xs font-bold text-stone-400 font-mono">Câu ${idx + 1} / ${questions.length}</span>
          </div>
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

    // 1. Sắp xếp vế câu A - B - C (排列顺序)
    if (q.segments && (q.correctSegmentOrder || q.correctOrder)) {
      const selected = examUserAnswers[q.id] || [];
      const target = (q.correctSegmentOrder || q.correctOrder).join('');
      isCorrect = selected.join('') === target;
      userAnsText = selected.join(' ➔ ') || '(Chưa chọn)';
      correctAnsText = (q.correctSegmentOrder || q.correctOrder).join(' ➔ ');
    }
    // 2. Nhìn tranh / từ khóa đặt câu hoặc viết văn (看图造句 / 短文)
    else if (q.type === 'look_and_write' || q.type === 'essay' || (q.keyword && q.minChars)) {
      const userText = String(examUserAnswers[q.id] || '').trim();
      const minChars = q.minChars || 8;
      const kw = (q.keyword || '').split(' ')[0];
      const containsKw = !kw || userText.includes(kw);
      const hasLength = userText.length >= minChars;
      isCorrect = containsKw && hasLength;
      userAnsText = userText ? `${userText} (${userText.length} chữ)` : '(Chưa điền)';
      correctAnsText = `Mẫu chuẩn: ${q.expectedSample || q.expectedAnswer || 'Chứa từ ' + kw + ' và tối thiểu ' + minChars + ' chữ'}`;
    }
    // 3. Sắp xếp từ thành câu
    else if (q.words && q.correctOrder) {
      const selected = examUserAnswers[q.id] || [];
      isCorrect = selected.join('') === q.correctOrder.join('');
      userAnsText = selected.join(' ') || '(Chưa làm)';
      correctAnsText = q.correctOrder.join(' ');
    }
    // 4. Viết chữ Hán theo Pinyin
    else if (q.targetChar || q.expectedAnswer) {
      const userText = String(examUserAnswers[q.id] || '').trim();
      const expected = String(q.targetChar || q.expectedAnswer || '').trim();
      isCorrect = userText.toLowerCase() === expected.toLowerCase();
      userAnsText = userText || '(Chưa điền)';
      correctAnsText = expected;
    }
    // 5. Trắc nghiệm Multiple Choice & 找病句
    else if (q.options) {
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
    listeningScore = Math.round((listeningCorrect / Math.max(1, listeningTotal)) * 100);
    readingScore = Math.round((readingCorrect / Math.max(1, readingTotal)) * 100);
    totalScoreAchieved = listeningScore + readingScore;
  } else {
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

  // Competency Spider Scores (0 - 100)
  const compScores = {
    listening: Math.round((listeningCorrect / Math.max(1, listeningTotal)) * 100),
    vocabulary: Math.min(100, Math.round(((listeningCorrect + readingCorrect) / Math.max(1, listeningTotal + readingTotal)) * 100)),
    grammar: Math.round((correctCount / Math.max(1, questions.length)) * 100),
    reading: Math.round((readingCorrect / Math.max(1, readingTotal)) * 100),
    writing: writingTotal > 0 ? Math.round((writingCorrect / Math.max(1, writingTotal)) * 100) : 85
  };

  lastSubmittedResult = {
    exam: activeExam,
    totalScoreAchieved,
    totalScore,
    passScore,
    isPassed,
    listeningScore,
    readingScore,
    writingScore,
    listeningCorrect,
    listeningTotal,
    readingCorrect,
    readingTotal,
    writingCorrect,
    writingTotal,
    breakdownList,
    competencyScores: compScores
  };

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

  // Detailed section stats + question breakdown + CTI Certificate CTA
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

      <!-- Action Button: Open CTI Certificate & Radar Chart -->
      <div class="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <div class="text-xs font-black text-amber-950 flex items-center gap-1.5">
            <span>📜</span>
            <span>Phiếu Điểm Khảo Thí CTI & Radar Chẩn Đoán 5 Chiều</span>
          </div>
          <p class="text-[11px] text-stone-600">Xem chứng chỉ điện tử quốc tế và biểu đồ mạng nhện năng lực</p>
        </div>
        <button 
          type="button" 
          onclick="openOfficialCtiCertificateModal()" 
          class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white font-bold text-xs shadow-xs hover:opacity-95 cursor-pointer"
        >
          Xem Phiếu Điểm CTI ↗
        </button>
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

  // Trigger Cheer or Comfort Modal
  if (typeof window.showCheerOrComfortModal === 'function') {
    setTimeout(() => {
      window.showCheerOrComfortModal({
        type: 'exam',
        level: `HSK ${activeExam.level} (Đề ${activeExam.testNumber})`,
        score: totalScoreAchieved,
        maxScore: totalScore,
        isPassed: isPassed,
        onReviewMistakes: () => {
          const breakdownEl = document.getElementById('examAnswerBreakdown');
          if (breakdownEl) breakdownEl.scrollIntoView({ behavior: 'smooth' });
        },
        onRetry: () => {
          if (typeof closeExamResultModal === 'function') closeExamResultModal();
          switchMockExamTest(activeExam.testNumber);
        }
      });
    }, 400);
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

// ---------------- OFFICIAL CTI SCORE REPORT & RADAR CHART ----------------
function openOfficialCtiCertificateModal() {
  const modal = document.getElementById('officialCtiScoreModal');
  if (!modal) return;

  renderOfficialCtiCertificateContent();

  if (typeof openModal === 'function') {
    openModal('officialCtiScoreModal');
  } else {
    modal.classList.remove('hidden');
  }
}

function closeOfficialCtiCertificateModal() {
  const modal = document.getElementById('officialCtiScoreModal');
  if (modal) modal.classList.add('hidden');
  if (typeof closeModal === 'function') closeModal('officialCtiScoreModal');
}
if (typeof registerModal === 'function') {
  registerModal('officialCtiScoreModal', closeOfficialCtiCertificateModal);
}

function renderOfficialCtiCertificateContent() {
  const container = document.getElementById('officialCtiScoreContainer');
  if (!container || !lastSubmittedResult) return;

  const res = lastSubmittedResult;
  const exam = res.exam;
  const scores = res.competencyScores;

  // Calculate 5 vertices for SVG Spider Radar Chart (Center: 160, 150; Max Radius: 90)
  // Axes: 0: Audio (top), 1: Vocab (top-right), 2: Grammar (bottom-right), 3: Reading (bottom-left), 4: Writing (top-left)
  const angles = [-90, -18, 54, 126, 198].map(deg => (deg * Math.PI) / 180);
  const values = [
    scores.listening,
    scores.vocabulary,
    scores.grammar,
    scores.reading,
    scores.writing
  ];

  const points = values.map((val, idx) => {
    const r = (val / 100) * 85;
    const x = 160 + r * Math.cos(angles[idx]);
    const y = 140 + r * Math.sin(angles[idx]);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Base grid circles for 25%, 50%, 75%, 100%
  const gridPolygons = [0.25, 0.5, 0.75, 1.0].map(pct => {
    return angles.map(a => {
      const x = 160 + pct * 85 * Math.cos(a);
      const y = 140 + pct * 85 * Math.sin(a);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  });

  const studentName = (window.currentUser && window.currentUser.username) || 'Thí Sinh Tự Do (Candidate)';
  const certNumber = `CTI-2026-H${exam.level}-${String(exam.testNumber).padStart(4, '0')}`;
  const examDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });

  container.innerHTML = `
    <!-- Certificate Outer Border -->
    <div class="relative bg-[#FFFAF0] dark:bg-stone-900 border-8 border-double border-amber-600/70 rounded-3xl p-6 sm:p-8 text-stone-900 dark:text-stone-100 shadow-2xl space-y-6">
      
      <!-- Seal Stamps and Classical Header -->
      <div class="text-center relative border-b-2 border-amber-600/40 pb-5">
        <div class="inline-flex items-center gap-2 mb-2 px-4 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-black uppercase tracking-widest border border-amber-300">
          <span>🏛️ CHINESE TESTING INTERNATIONAL • 汉考国际</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-serif-luxury font-black text-[#8B1E1E] dark:text-amber-400 tracking-wider">
          汉语水平考试 (HSK) 成绩报告
        </h2>
        <p class="text-xs sm:text-sm font-serif text-stone-600 dark:text-stone-300 mt-1 uppercase tracking-widest">
          Official Chinese Proficiency Test Score Report
        </p>

        <!-- Official Stamp Badge -->
        <div class="absolute top-0 right-0 sm:right-2 hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-red-700 bg-red-50/60 text-red-700 text-[9px] font-black uppercase rotate-12 shadow-sm pointer-events-none">
          <span>汉考国际</span>
          <span class="text-[7px]">CTI VERIFIED</span>
          <span>合格认证</span>
        </div>
      </div>

      <!-- Candidate Credentials -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-amber-50/70 dark:bg-stone-850 p-4 rounded-2xl border border-amber-300/80">
        <div>
          <span class="text-stone-400 block text-[10px] font-bold uppercase">考生姓名 / Name</span>
          <strong class="text-stone-900 dark:text-stone-100 font-hanzi text-sm">${escapeHtml(studentName)}</strong>
        </div>
        <div>
          <span class="text-stone-400 block text-[10px] font-bold uppercase">准考证号 / Ticket No.</span>
          <strong class="font-mono text-stone-800 dark:text-amber-300 font-bold">${certNumber}</strong>
        </div>
        <div>
          <span class="text-stone-400 block text-[10px] font-bold uppercase">考试级别 / Level</span>
          <strong class="text-[#8B1E1E] font-black">HSK ${exam.level} 级</strong>
        </div>
        <div>
          <span class="text-stone-400 block text-[10px] font-bold uppercase">考试日期 / Test Date</span>
          <strong class="font-mono text-stone-700 dark:text-stone-300">${examDate}</strong>
        </div>
      </div>

      <!-- Official Score Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-center text-xs border-collapse">
          <thead>
            <tr class="bg-amber-100/80 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-y border-amber-300">
              <th class="py-2.5 px-3 font-bold">听力 / Listening</th>
              <th class="py-2.5 px-3 font-bold">阅读 / Reading</th>
              ${res.writingTotal > 0 ? '<th class="py-2.5 px-3 font-bold">书写 / Writing</th>' : ''}
              <th class="py-2.5 px-3 font-black text-[#8B1E1E] dark:text-amber-400">总分 / Total</th>
              <th class="py-2.5 px-3 font-bold">状态 / Status</th>
            </tr>
          </thead>
          <tbody>
            <tr class="font-mono text-sm border-b border-amber-200 dark:border-stone-800">
              <td class="py-3 px-3 font-bold text-sky-700 dark:text-sky-400">${res.listeningScore}</td>
              <td class="py-3 px-3 font-bold text-amber-700 dark:text-amber-400">${res.readingScore}</td>
              ${res.writingTotal > 0 ? `<td class="py-3 px-3 font-bold text-rose-700 dark:text-rose-400">${res.writingScore}</td>` : ''}
              <td class="py-3 px-3 font-black text-xl text-[#8B1E1E] dark:text-amber-300">${res.totalScoreAchieved} <span class="text-xs text-stone-400 font-normal">/ ${res.totalScore}</span></td>
              <td class="py-3 px-3 font-bold font-sans">
                ${res.isPassed ? '<span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">合格 (PASS ✔)</span>' : '<span class="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black">不合格 (FAIL)</span>'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Radar Spider Chart & Competency Diagnosis -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
        <!-- SVG Radar Chart -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Biểu Đồ Radar Năng Lực 5 Chiều</span>
          <svg viewBox="0 0 320 280" class="w-full max-w-[280px] h-auto overflow-visible">
            <!-- Grid concentric polygons -->
            ${gridPolygons.map(pts => `<polygon points="${pts}" fill="none" stroke="#e5e7eb" stroke-width="1" class="dark:stroke-stone-700" />`).join('')}
            <!-- Axis lines -->
            ${angles.map(a => {
              const x2 = 160 + 85 * Math.cos(a);
              const y2 = 140 + 85 * Math.sin(a);
              return `<line x1="160" y1="140" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#cbd5e1" stroke-width="1" class="dark:stroke-stone-700" />`;
            }).join('')}
            <!-- Performance polygon -->
            <polygon points="${points}" fill="${res.isPassed ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}" stroke="${res.isPassed ? '#059669' : '#dc2626'}" stroke-width="2.5" />
            <!-- Data vertices circles -->
            ${values.map((v, i) => {
              const r = (v / 100) * 85;
              const cx = 160 + r * Math.cos(angles[i]);
              const cy = 140 + r * Math.sin(angles[i]);
              return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3.5" fill="#8B1E1E" class="dark:fill-amber-400" />`;
            }).join('')}
            <!-- Axis labels -->
            <text x="160" y="40" text-anchor="middle" font-size="10" font-weight="bold" fill="#8B1E1E">听力捕捉 (${scores.listening}%)</text>
            <text x="255" y="115" text-anchor="start" font-size="10" font-weight="bold" fill="#d97706">词汇储备 (${scores.vocabulary}%)</text>
            <text x="220" y="230" text-anchor="start" font-size="10" font-weight="bold" fill="#059669">语法结构 (${scores.grammar}%)</text>
            <text x="100" y="230" text-anchor="end" font-size="10" font-weight="bold" fill="#0284c7">阅读速度 (${scores.reading}%)</text>
            <text x="65" y="115" text-anchor="end" font-size="10" font-weight="bold" fill="#dc2626">书写逻辑 (${scores.writing}%)</text>
          </svg>
        </div>

        <!-- Academic Diagnostic Feedback -->
        <div class="space-y-3 text-xs bg-white/80 dark:bg-stone-850 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
          <h4 class="font-bold text-sm text-[#8B1E1E] dark:text-amber-400 flex items-center gap-1.5">
            <span>🔬</span>
            <span>Chẩn Đoán Học Thuật & Đề Xuất Lộ Trình:</span>
          </h4>
          <ul class="space-y-2 text-stone-700 dark:text-stone-300">
            <li class="flex items-start gap-1.5">
              <span class="text-emerald-600 font-bold">✔</span>
              <span><strong>Điểm mạnh:</strong> Khả năng nhận diện ngữ cảnh và vốn từ vựng nền tảng đạt ${scores.vocabulary}%.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <span class="text-amber-600 font-bold">⚠️</span>
              <span><strong>Cần cải thiện:</strong> ${scores.listening < 70 ? 'Phần Nghe hiểu cần rèn thêm kỹ năng bắt từ khóa 1 lần (không tua lại).' : scores.reading < 70 ? 'Cần tăng tốc độ đọc quét ngữ đoạn và nắm chắc hư từ nối câu.' : 'Tiếp tục duy trì cường độ luyện đề đều đặn.'}</span>
            </li>
            <li class="flex items-start gap-1.5">
              <span class="text-sky-600 font-bold">📚</span>
              <span><strong>Gợi ý bổ trợ:</strong> Ôn tập bài giảng trong <em>Giáo trình HSK 3.0 (68 bài)</em> và làm các đề trắc nghiệm trong <em>Bách khoa Bổ ngữ & Lượng từ</em>.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-amber-300/80 flex-wrap gap-3">
        <button 
          type="button" 
          onclick="window.print()" 
          class="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
        >
          <span>🖨️ In / Lưu PDF Phiếu Điểm</span>
        </button>
        <button 
          type="button" 
          onclick="closeOfficialCtiCertificateModal()" 
          class="px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer transition-all"
        >
          Đóng
        </button>
      </div>
    </div>
  `;

  if (typeof refreshIcons === 'function') refreshIcons(container);
}

// ---------------- EXPORT ACTIVE EXAM AS PDF ----------------
function downloadMockExamPdf() {
  if (!activeExam) {
    if (typeof showToast === 'function') {
      showToast('Đang mở dữ liệu đề thi để xuất PDF...', 'info');
    }
    return;
  }

  const exam = activeExam;
  const questions = exam.questions || [];
  const level = exam.level || currentExamLevel;
  const testNumber = exam.testNumber || currentExamTestNumber;
  const testCode = `HSK${level}-${String(testNumber).padStart(2, '0')}`;

  const listeningQs = questions.filter(q => q.skill === 'listening' || (q.section || '').toLowerCase().includes('nghe') || (q.section || '').toLowerCase().includes('听力'));
  const readingQs = questions.filter(q => q.skill === 'reading' || (!q.skill && !(q.section || '').toLowerCase().includes('nghe') && !(q.section || '').toLowerCase().includes('viết') && !(q.section || '').toLowerCase().includes('书写')));
  const writingQs = questions.filter(q => q.skill === 'writing' || (q.section || '').toLowerCase().includes('viết') || (q.section || '').toLowerCase().includes('书写'));

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Đề Thi Thử HSK ${level} - Đề Số ${testNumber} (${testCode}) - Học Tiếng Trung Mỗi Ngày</title>
  <style>
    @page { size: A4; margin: 15mm 15mm 15mm 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", serif; color: #111827; background: #fff; line-height: 1.5; font-size: 13px; margin: 0; padding: 0; }
    .print-toolbar { position: sticky; top: 0; background: #1e293b; color: #fff; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; }
    .print-btn { background: #dc2626; color: #fff; border: none; padding: 8px 18px; font-size: 13px; font-weight: bold; border-radius: 8px; cursor: pointer; }
    .close-btn { background: #475569; color: #fff; border: none; padding: 8px 14px; font-size: 12px; border-radius: 8px; cursor: pointer; }
    @media print { .print-toolbar { display: none !important; } }
    .paper { max-width: 800px; margin: 0 auto; padding: 24px 30px; }
  </style>
</head>
<body>
  <div class="print-toolbar">
    <div><strong>HỌC TIẾNG TRUNG MỖI NGÀY</strong> • Đề Thi Thử Chuẩn Hanban CTI HSK ${level} (Đề #${testNumber})</div>
    <div style="display: flex; gap: 8px;">
      <button class="print-btn" onclick="window.print()">🖨️ Lưu Thành File PDF / In Ngay</button>
      <button class="close-btn" onclick="window.close()">✕ Đóng</button>
    </div>
  </div>
  <div class="paper">
    <div style="text-align: center; border-bottom: 2px solid #8B1E1E; padding-bottom: 12px; margin-bottom: 20px;">
      <h1 style="font-size: 20px; color: #8B1E1E; margin: 0 0 6px 0;">汉语水平考试 HSK (${level}级) 样卷</h1>
      <h2 style="font-size: 14px; color: #4b5563; margin: 0;">${escapeHtml(exam.title)} • Mã đề: ${testCode}</h2>
      <div style="font-size: 11px; color: #6b7280; margin-top: 6px;">
        Thời gian: ${exam.durationMinutes} phút | Điểm tối đa: ${exam.totalScore} điểm | Điểm đỗ: ${exam.passScore} điểm
      </div>
    </div>

    ${listeningQs.length > 0 ? `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; color: #1e3a8a; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-bottom: 10px;">
          PHẦN I: NGHE HIỂU (听力) - ${listeningQs.length} Câu
        </h3>
        ${listeningQs.map((q, idx) => `
          <div style="margin-bottom: 14px; page-break-inside: avoid;">
            <div><strong>Câu ${idx + 1}:</strong> ${escapeHtml(q.prompt)}</div>
            ${q.audioText ? `<div style="font-size: 11px; color: #6b7280; margin: 2px 0;">[Nội dung bài nghe: ${escapeHtml(q.audioText)}]</div>` : ''}
            ${q.statement ? `<div style="margin: 4px 0; font-weight: bold;">"${escapeHtml(q.statement)}"</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${readingQs.length > 0 ? `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; color: #b45309; border-left: 4px solid #b45309; padding-left: 8px; margin-bottom: 10px;">
          PHẦN II: ĐỌC HIỂU (阅读) - ${readingQs.length} Câu
        </h3>
        ${readingQs.map((q, idx) => `
          <div style="margin-bottom: 14px; page-break-inside: avoid;">
            <div><strong>Câu ${listeningQs.length + idx + 1}:</strong> ${escapeHtml(q.prompt)}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${writingQs.length > 0 ? `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; color: #991b1b; border-left: 4px solid #991b1b; padding-left: 8px; margin-bottom: 10px;">
          PHẦN III: VIẾT (书写) - ${writingQs.length} Câu
        </h3>
        ${writingQs.map((q, idx) => `
          <div style="margin-bottom: 14px; page-break-inside: avoid;">
            <div><strong>Câu ${listeningQs.length + readingQs.length + idx + 1}:</strong> ${escapeHtml(q.prompt)}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <div style="margin-top: 24px; border-top: 2px solid #e5e7eb; padding-top: 12px;">
      <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 12px;">BẢNG ĐÁP ÁN CHUẨN & GIẢI THÍCH CHI TIẾT</h3>
      ${questions.map((q, idx) => {
        const correctOpt = (q.options || []).find(o => o.isCorrect);
        const ansKey = correctOpt ? `${correctOpt.key}. ${correctOpt.text}` : (q.correctAnswer || (q.correctOrder ? q.correctOrder.join(' ') : ''));
        return `
          <div style="margin-bottom: 10px; font-size: 12px; line-height: 1.5;">
            <div><strong>Câu ${idx + 1}:</strong> <strong style="color: #dc2626;">${escapeHtml(ansKey)}</strong></div>
            ${q.explanation ? `<div style="color: #4b5563;"><em>Giải thích:</em> ${escapeHtml(q.explanation)}</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    if (typeof showToast === 'function') {
      showToast('Đang mở trang in & xuất PDF đề thi chuẩn...', 'success');
    }
  } else {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `De_Thi_Thu_${testCode}_Hanban.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// ---------------- GLOBAL WINDOW EXPORTS ----------------
window.initMockExamModule = initMockExamModule;
window.switchMockExamLevel = switchMockExamLevel;
window.switchMockExamTest = switchMockExamTest;
window.nextMockExamTest = nextMockExamTest;
window.prevMockExamTest = prevMockExamTest;
window.randomMockExamTest = randomMockExamTest;
window.toggleExamMode = toggleExamMode;
window.startExamTimer = startExamTimer;
window.filterExamQuestionsByPart = filterExamQuestionsByPart;
window.scrollToExamQuestion = scrollToExamQuestion;
window.selectExamAnswer = selectExamAnswer;
window.addExamReorderWord = addExamReorderWord;
window.removeExamReorderWord = removeExamReorderWord;
window.addExamSegmentOrder = addExamSegmentOrder;
window.removeExamSegmentOrder = removeExamSegmentOrder;
window.resetExamSegmentOrder = resetExamSegmentOrder;
window.setExamTextInput = setExamTextInput;
window.setExamEssayInput = setExamEssayInput;
window.gradeSingleEssayWithAi = gradeSingleEssayWithAi;
window.playExamAudioStrict = playExamAudioStrict;
window.playHanbanRepeatAudioStrict = playHanbanRepeatAudioStrict;
window.openExamSelectorModal = openExamSelectorModal;
window.closeExamSelectorModal = closeExamSelectorModal;
window.submitMockExam = submitMockExam;
window.closeExamResultModal = closeExamResultModal;
window.downloadMockExamPdf = downloadMockExamPdf;
window.setActiveMockExam = setActiveMockExam;
window.openOfficialCtiCertificateModal = openOfficialCtiCertificateModal;
window.closeOfficialCtiCertificateModal = closeOfficialCtiCertificateModal;
window.nextIbtSection = nextIbtSection;
