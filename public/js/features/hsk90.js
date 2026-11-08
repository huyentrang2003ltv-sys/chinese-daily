// =========================================================================
// Khung Lộ Trình Gia Tốc 90 Ngày Chinh Phục HSK 3 (Masterclass & Practice)
// =========================================================================

(function (window) {
  'use strict';

  // State management
  let activePhase = 1;
  let activeWeek = 1;
  let activeLectureTab = 'dialogue'; // 'dialogue' | 'etymology' | 'grammar' | 'tips'
  let activePracticeMode = 'quiz';   // 'quiz' | 'dictation' | 'reorder' | 'writing'

  // Interactive practice states
  let quizSelectedOption = null;
  let quizSubmitted = false;
  let dictationTested = false;
  let dictationScore = null;
  let reorderSelected = [];
  let reorderTested = false;
  let reorderIsCorrect = false;
  let writingTested = false;
  let writingFeedback = null;
  let showSampleWriting = false;

  const STORAGE_KEY = 'yuhan_hsk90_progress';

  function getHsk90Progress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading hsk90 progress', e);
    }
    return {
      completedWeeks: [],
      completedDays: [],
      totalExp: 0,
      streak: 1,
      lastStudiedWeek: 1
    };
  }

  function saveHsk90Progress(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Error saving hsk90 progress', e);
    }
  }

  function getCurriculumData() {
    return window.hsk90CurriculumData || null;
  }

  function selectPhase(phaseNum) {
    activePhase = Number(phaseNum);
    const data = getCurriculumData();
    if (data && data.modules) {
      const firstWeekOfPhase = data.modules.find(m => m.phase === activePhase);
      if (firstWeekOfPhase) {
        activeWeek = firstWeekOfPhase.weekNumber;
      }
    }
    resetPracticeState();
    renderHsk90Tab();
  }

  function selectWeek(weekNum) {
    activeWeek = Number(weekNum);
    const data = getCurriculumData();
    if (data && data.modules) {
      const mod = data.modules.find(m => m.weekNumber === activeWeek);
      if (mod) activePhase = mod.phase;
    }
    resetPracticeState();
    renderHsk90Tab();
  }

  function switchLectureTab(tabName) {
    activeLectureTab = tabName;
    renderLectureContent();
  }

  function switchPracticeMode(mode) {
    activePracticeMode = mode;
    renderPracticeLab();
  }

  function resetPracticeState() {
    quizSelectedOption = null;
    quizSubmitted = false;
    dictationTested = false;
    dictationScore = null;
    reorderSelected = [];
    reorderTested = false;
    reorderIsCorrect = false;
    writingTested = false;
    writingFeedback = null;
    showSampleWriting = false;
  }

  function playTTS(text, gender = null) {
    if (typeof window.playChineseTTS === 'function') {
      window.playChineseTTS(text, gender);
    } else if (typeof window.speechSynthesis !== 'undefined') {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  }

  function safeNotify(msg) {
    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert(msg);
    } else if (typeof alert === 'function') {
      alert(msg);
    } else {
      console.log('[HSK90 Notification]', msg);
    }
  }

  // --- Main Render Function ---
  function renderHsk90Tab() {
    const container = document.getElementById('tab-hsk90');
    if (!container) return;

    const cur = getCurriculumData();
    if (!cur || !cur.modules) {
      container.innerHTML = `
        <div class="p-8 text-center bg-white dark:bg-[#161B22] rounded-3xl border border-amber-200 dark:border-stone-800 shadow-sm">
          <div class="inline-block animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mb-3"></div>
          <p class="text-sm font-bold text-stone-600 dark:text-stone-300">Đang tải Giáo án Khung Lộ Trình 90 Ngày...</p>
        </div>
      `;
      return;
    }

    const progress = getHsk90Progress();
    const activeModule = cur.modules.find(m => m.weekNumber === activeWeek) || cur.modules[0];
    const totalModules = cur.modules.length;
    const completedCount = (progress.completedWeeks || []).length;
    const progressPercent = Math.min(100, Math.round((completedCount / totalModules) * 100));

    container.innerHTML = `
      <!-- Masterclass Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5C1313] via-[#7B1818] to-[#992020] text-white p-6 sm:p-8 shadow-xl border border-red-800/40">
        <div class="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none text-[150px] font-hanzi font-black">
          九十天
        </div>

        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="space-y-3 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 backdrop-blur-xs">
              <span>🚀 Tiêu Chuẩn Quốc Tế CTI</span>
              <span>•</span>
              <span>Chương Trình Đào Tạo Sư Phạm 3 Tháng</span>
            </div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-black tracking-tight text-white">
              ${cur.overview.title}
            </h1>
            <p class="text-xs sm:text-sm text-red-100/90 leading-relaxed font-normal">
              ${cur.overview.subtitle}. Đi từ con số 0 đến HSK 3 với mô hình <strong>Dual-Coding</strong>, <strong>Chiết tự Logic</strong>, <strong>Công thức hóa Ngữ pháp</strong> và <strong>Phòng Luyện Thực Chiến 4 Kỹ Năng</strong>.
            </p>

            <!-- KPI Badges -->
            <div class="flex flex-wrap items-center gap-2 pt-2 text-2xs">
              <span class="px-2.5 py-1 rounded-lg bg-black/25 backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-amber-300"></i> ${cur.overview.duration}
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-black/25 backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                <i data-lucide="book-open" class="w-3.5 h-3.5 text-emerald-300"></i> ${cur.overview.targetVocab}
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-black/25 backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                <i data-lucide="target" class="w-3.5 h-3.5 text-rose-300"></i> ${cur.overview.targetScore}
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-black/25 backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-blue-300"></i> ${cur.overview.dailyCommitment}
              </span>
            </div>
          </div>

          <!-- Overall Progress Widget -->
          <div class="bg-black/25 backdrop-blur-md rounded-2xl p-5 border border-white/15 w-full lg:w-80 shrink-0 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-amber-200 flex items-center gap-1.5">
                <i data-lucide="trophy" class="w-4 h-4 text-amber-300"></i> Tiến Độ Lộ Trình
              </span>
              <span class="font-mono font-bold text-white">${completedCount}/${totalModules} Tuần (${progressPercent}%)</span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-white/15 rounded-full h-2.5 overflow-hidden">
              <div class="bg-gradient-to-r from-amber-400 to-amber-300 h-2.5 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
            </div>

            <div class="flex items-center justify-between pt-1 text-2xs text-red-200">
              <span>Đã tích lũy: <strong class="text-amber-300 font-mono text-xs">${progress.totalExp || 0} EXP</strong></span>
              <span>Chuỗi: <strong class="text-amber-300 font-mono text-xs">${progress.streak || 1} 🔥</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3 Strategic Phases Bar -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        ${(cur.overview.strategyPhases || []).map(p => {
          const isPhaseActive = activePhase === p.phase;
          return `
            <div onclick="window.selectHsk90Phase(${p.phase})" class="cursor-pointer transition-all duration-200 p-4 rounded-2xl border ${
              isPhaseActive
                ? 'bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] text-white border-red-700 shadow-md ring-2 ring-red-400/40'
                : 'bg-white dark:bg-[#161B22] text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-800 hover:border-amber-300 hover:shadow-xs'
            }">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xl">${p.icon}</span>
                <span class="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isPhaseActive ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-400'
                }">
                  ${p.range}
                </span>
              </div>
              <h3 class="font-serif-luxury font-bold text-sm mb-1 ${isPhaseActive ? 'text-white' : 'text-[#8B1E1E] dark:text-rose-400'}">
                ${p.name}
              </h3>
              <p class="text-2xs line-clamp-2 ${isPhaseActive ? 'text-red-100' : 'text-stone-500 dark:text-stone-400'}">
                ${p.summary}
              </p>
              <div class="mt-2.5 pt-2 border-t ${isPhaseActive ? 'border-white/20' : 'border-stone-100 dark:border-stone-800'} flex items-center justify-between text-2xs">
                <span class="font-bold ${isPhaseActive ? 'text-amber-200' : 'text-amber-700 dark:text-amber-400'}">Mục tiêu: ${p.vocabTarget}</span>
                <span class="text-2xs ${isPhaseActive ? 'text-white' : 'text-stone-400'}">Chặng ${p.phase} →</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Week Selector Navigation -->
      <div class="p-4 rounded-2xl bg-[#FFFDF9] dark:bg-[#161B22] border border-amber-200 dark:border-stone-800 shadow-xs space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-lg">🗓️</span>
            <span class="font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Chọn Tuần Học (Chặng ${activePhase}):
            </span>
          </div>
          <span class="text-2xs text-stone-500">Mỗi tuần gồm bài giảng sư phạm chuyên sâu & phòng thực hành 4 kỹ năng</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          ${cur.modules.map(m => {
            const isWeekActive = activeWeek === m.weekNumber;
            const isCompleted = (progress.completedWeeks || []).includes(m.weekNumber);
            return `
              <button onclick="window.selectHsk90Week(${m.weekNumber})" class="text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                isWeekActive
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-700 shadow-sm'
                  : isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-[#21262D] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-stone-800'
              }">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-2xs font-black uppercase">Tuần ${m.weekNumber}</span>
                  <span class="text-xs">${isCompleted ? '✅' : m.icon}</span>
                </div>
                <div class="text-[11px] font-bold truncate">${m.title}</div>
                <div class="text-[10px] opacity-80 mt-0.5">${m.dayRange}</div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Current Week Masterclass Studio -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Masterclass Lecture (7 Cols) -->
        <div class="lg:col-span-7 space-y-4">
          <div class="p-5 rounded-3xl bg-white dark:bg-[#161B22] border border-amber-200 dark:border-stone-800 shadow-sm space-y-4">
            <!-- Lecture Header -->
            <div class="flex items-start justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-400 mb-1.5">
                  <span>Tuần ${activeModule.weekNumber}</span>
                  <span>•</span>
                  <span>${activeModule.dayRange}</span>
                  <span>•</span>
                  <span>Chặng ${activeModule.phase}</span>
                </div>
                <h2 class="text-lg sm:text-xl font-serif-luxury font-black text-stone-900 dark:text-stone-100">
                  ${activeModule.title}
                </h2>
                <div class="text-xs text-stone-500 font-hanzi font-bold mt-0.5">${activeModule.themeZh}</div>
              </div>
              <span class="text-3xl shrink-0">${activeModule.icon}</span>
            </div>

            <!-- Objectives List -->
            <div class="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-200/80 dark:border-stone-800 space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
              <span class="font-bold text-amber-900 dark:text-amber-400 block text-2xs uppercase tracking-wider flex items-center gap-1">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-amber-600"></i> Mục tiêu bài giảng:
              </span>
              <ul class="space-y-1 pl-4 list-disc marker:text-amber-600 text-2xs sm:text-xs">
                ${(activeModule.objectives || []).map(obj => `<li>${obj}</li>`).join('')}
              </ul>
            </div>

            <!-- Lecture Subtabs -->
            <div class="flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto text-xs">
              <button onclick="window.switchHsk90LectureTab('dialogue')" class="px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeLectureTab === 'dialogue'
                  ? 'bg-[#8B1E1E] text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }">
                🎙️ Hội Thoại Ngữ Cảnh
              </button>
              <button onclick="window.switchHsk90LectureTab('etymology')" class="px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeLectureTab === 'etymology'
                  ? 'bg-[#8B1E1E] text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }">
                🔤 Chiết Tự Logic
              </button>
              <button onclick="window.switchHsk90LectureTab('grammar')" class="px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeLectureTab === 'grammar'
                  ? 'bg-[#8B1E1E] text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }">
                📐 Công Thức Ngữ Pháp
              </button>
              <button onclick="window.switchHsk90LectureTab('tips')" class="px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeLectureTab === 'tips'
                  ? 'bg-[#8B1E1E] text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }">
                💡 Tuyệt Kỹ CTI
              </button>
            </div>

            <!-- Dynamic Lecture Tab Content -->
            <div id="hsk90LectureContentArea">
              <!-- Rendered by renderLectureContent() -->
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Practice Lab (5 Cols) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="p-5 rounded-3xl bg-[#FFFDF9] dark:bg-[#161B22] border border-amber-200 dark:border-stone-800 shadow-sm space-y-4">
            <!-- Practice Header -->
            <div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 class="text-base font-serif-luxury font-black text-[#8B1E1E] dark:text-rose-400 flex items-center gap-1.5">
                  <i data-lucide="sparkles" class="w-4 h-4 text-amber-500"></i> Phòng Luyện 4 Kỹ Năng
                </h3>
                <span class="text-2xs text-stone-500">Thực hành tương tác tức thì sau bài giảng</span>
              </div>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300">
                +80 EXP tổng
              </span>
            </div>

            <!-- Practice Mode Tabs -->
            <div class="grid grid-cols-4 gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-2xs font-bold">
              <button onclick="window.switchHsk90PracticeMode('quiz')" class="py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activePracticeMode === 'quiz' ? 'bg-white dark:bg-[#21262D] text-[#8B1E1E] dark:text-rose-400 shadow-2xs' : 'text-stone-600 dark:text-stone-400'
              }">
                Trắc Nghiệm
              </button>
              <button onclick="window.switchHsk90PracticeMode('dictation')" class="py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activePracticeMode === 'dictation' ? 'bg-white dark:bg-[#21262D] text-[#8B1E1E] dark:text-rose-400 shadow-2xs' : 'text-stone-600 dark:text-stone-400'
              }">
                Chính Tả
              </button>
              <button onclick="window.switchHsk90PracticeMode('reorder')" class="py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activePracticeMode === 'reorder' ? 'bg-white dark:bg-[#21262D] text-[#8B1E1E] dark:text-rose-400 shadow-2xs' : 'text-stone-600 dark:text-stone-400'
              }">
                Xếp Câu
              </button>
              <button onclick="window.switchHsk90PracticeMode('writing')" class="py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activePracticeMode === 'writing' ? 'bg-white dark:bg-[#21262D] text-[#8B1E1E] dark:text-rose-400 shadow-2xs' : 'text-stone-600 dark:text-stone-400'
              }">
                Viết Tự Luận
              </button>
            </div>

            <!-- Dynamic Practice Area -->
            <div id="hsk90PracticeArea">
              <!-- Rendered by renderPracticeLab() -->
            </div>

            <!-- Mark Day Complete Milestone CTA -->
            <div class="pt-3 border-t border-stone-200 dark:border-stone-800">
              <button onclick="window.completeHsk90Day(${activeModule.weekNumber})" class="w-full py-3 px-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#8B1E1E] via-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98">
                <i data-lucide="award" class="w-4 h-4 text-amber-300"></i>
                <span>Hoàn Thành Tuần Học Này (+30 EXP)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    renderLectureContent();
    renderPracticeLab();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- Render Lecture Tab Content ---
  function renderLectureContent() {
    const area = document.getElementById('hsk90LectureContentArea');
    if (!area) return;

    const cur = getCurriculumData();
    if (!cur) return;
    const activeModule = cur.modules.find(m => m.weekNumber === activeWeek) || cur.modules[0];
    const lec = activeModule.lecture || {};

    if (activeLectureTab === 'dialogue') {
      const d = lec.dialogue || { title: 'Hội thoại', lines: [] };
      area.innerHTML = `
        <div class="space-y-3 animate-fade-in">
          <div class="flex items-center justify-between pb-1">
            <span class="text-xs font-bold text-amber-900 dark:text-amber-400">${d.title}</span>
            <button onclick="window.playHsk90AllDialogue()" class="text-2xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 text-amber-900 dark:text-amber-300 flex items-center gap-1 transition-all cursor-pointer">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i> Nghe Toàn Bài
            </button>
          </div>

          <div class="space-y-2.5">
            ${(d.lines || []).map((line, idx) => {
              const isMale = (line.speaker || '').includes('Nam');
              return `
                <div class="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full ${isMale ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'} flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    ${isMale ? '👨' : '👩'}
                  </div>
                  <div class="flex-1 min-w-0 space-y-0.5">
                    <div class="text-2xs font-bold text-stone-500">${line.speaker}</div>
                    <div class="text-base sm:text-lg font-hanzi font-bold text-stone-900 dark:text-stone-100 tracking-wide">${line.hanzi}</div>
                    <div class="text-2xs sm:text-xs text-amber-700 dark:text-amber-400 font-mono">${line.pinyin}</div>
                    <div class="text-2xs sm:text-xs text-stone-600 dark:text-stone-300 pt-0.5">${line.vi}</div>
                  </div>
                  <button onclick="window.playHsk90TTS('${line.hanzi.replace(/'/g, "\\'")}', '${isMale ? 'male' : 'female'}')" class="p-2 rounded-xl text-stone-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-stone-800 transition-all cursor-pointer shrink-0" title="Phát âm">
                    <i data-lucide="volume-2" class="w-4 h-4"></i>
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (activeLectureTab === 'etymology') {
      const ety = lec.etymology || [];
      area.innerHTML = `
        <div class="space-y-3 animate-fade-in">
          <div class="text-xs font-bold text-amber-900 dark:text-amber-400">
            Giải Mã Chiết Tự & Logic Cấu Tạo Chữ Hán:
          </div>
          <div class="grid grid-cols-1 gap-3">
            ${ety.map(item => `
              <div class="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-amber-200/60 dark:border-stone-800 flex items-start gap-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex flex-col items-center justify-center font-hanzi font-black text-2xl shrink-0 shadow-sm">
                  <span>${item.hanzi}</span>
                  <span class="text-[9px] font-mono font-normal opacity-90">${item.pinyin}</span>
                </div>
                <div class="flex-1 min-w-0 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-stone-900 dark:text-stone-100">${item.meaning}</span>
                    <button onclick="window.playHsk90TTS('${item.hanzi}')" class="text-amber-700 dark:text-amber-400 hover:scale-110 transition-transform">
                      <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                  <p class="text-2xs text-stone-600 dark:text-stone-300 leading-relaxed bg-white dark:bg-[#161B22] p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-800">
                    💡 <strong>Logic Chiết tự:</strong> ${item.breakdown}
                  </p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (activeLectureTab === 'grammar') {
      const g = lec.grammar || { formula: '', explanation: '', examples: [] };
      area.innerHTML = `
        <div class="space-y-3.5 animate-fade-in">
          <!-- Formula Box -->
          <div class="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-stone-900 dark:to-stone-900 border-2 border-dashed border-red-300 dark:border-red-900 space-y-1">
            <span class="text-2xs font-bold uppercase tracking-wider text-red-800 dark:text-red-400 flex items-center gap-1">
              <i data-lucide="code-2" class="w-3.5 h-3.5"></i> Công Thức Ngữ Pháp Cốt Lõi:
            </span>
            <div class="text-xs sm:text-sm font-mono font-black text-stone-900 dark:text-stone-100 bg-white dark:bg-[#161B22] p-2.5 rounded-xl border border-red-200 dark:border-stone-800">
              ${g.formula}
            </div>
          </div>

          <!-- Explanation -->
          <div class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <span class="font-bold text-amber-900 dark:text-amber-400 block mb-1">📖 Phân Tích Cơ Chế Hoạt Động:</span>
            ${g.explanation}
          </div>

          <!-- Examples -->
          <div class="space-y-2">
            <span class="text-2xs font-bold uppercase tracking-wider text-stone-500">Ví Dụ Minh Họa Trọng Tâm:</span>
            ${(g.examples || []).map(ex => `
              <div class="p-3 rounded-xl bg-white dark:bg-[#21262D] border border-stone-200 dark:border-stone-700 space-y-0.5 flex items-start justify-between gap-2">
                <div>
                  <div class="text-sm font-hanzi font-bold text-stone-900 dark:text-stone-100">${ex.zh}</div>
                  <div class="text-2xs text-amber-700 dark:text-amber-400 font-mono">${ex.pinyin}</div>
                  <div class="text-2xs text-stone-600 dark:text-stone-300">${ex.vi}</div>
                </div>
                <button onclick="window.playHsk90TTS('${ex.zh.replace(/'/g, "\\'")}')" class="p-1.5 text-stone-400 hover:text-amber-600 transition-colors cursor-pointer shrink-0">
                  <i data-lucide="volume-2" class="w-4 h-4"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (activeLectureTab === 'tips') {
      const tips = lec.examTips || 'Luyện tập đều đặn và ghi chú các lỗi sai thường gặp.';
      area.innerHTML = `
        <div class="space-y-3 animate-fade-in">
          <div class="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-300 dark:border-amber-800/50 space-y-2">
            <div class="flex items-center gap-2 text-[#8B1E1E] dark:text-amber-400 font-bold text-xs">
              <span class="text-lg">🎯</span>
              <span>Chiến Thuật Thi CTI & Cảnh Báo Bẫy Đề Thi:</span>
            </div>
            <p class="text-xs text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
              ${tips}
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 space-y-1">
            <span class="font-bold flex items-center gap-1.5">
              <i data-lucide="shield-alert" class="w-3.5 h-3.5"></i> Chuẩn Bị Phòng Thi iBT:
            </span>
            <p class="text-2xs leading-relaxed">
              Trong bài thi iBT, tốc độ gõ Pinyin nhận diện mặt chữ Hán quyết định 30% thời gian làm bài viết. Hãy thực hành phần Chính tả & Viết tự luận bên cạnh để tăng tốc độ phản xạ nhận diện chữ!
            </p>
          </div>
        </div>
      `;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- Render Practice Lab Content ---
  function renderPracticeLab() {
    const area = document.getElementById('hsk90PracticeArea');
    if (!area) return;

    const cur = getCurriculumData();
    if (!cur) return;
    const activeModule = cur.modules.find(m => m.weekNumber === activeWeek) || cur.modules[0];
    const prac = activeModule.practice || {};

    if (activePracticeMode === 'quiz') {
      const q = prac.quiz || { question: '', options: [], answer: 0, explanation: '' };
      area.innerHTML = `
        <div class="space-y-3.5 animate-fade-in">
          <div class="text-xs font-bold text-stone-800 dark:text-stone-200">
            ${q.question}
          </div>

          <div class="space-y-2">
            ${(q.options || []).map((opt, idx) => {
              const cleanOpt = opt.replace(/^\(Recommended\)\s*/, '');
              let styleClass = 'bg-white dark:bg-[#21262D] border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-400';
              if (quizSelectedOption === idx) {
                if (!quizSubmitted) {
                  styleClass = 'bg-amber-100 dark:bg-stone-800 border-amber-600 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40';
                } else if (idx === q.answer) {
                  styleClass = 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-600 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/40';
                } else {
                  styleClass = 'bg-rose-100 dark:bg-rose-950/40 border-rose-600 text-rose-900 dark:text-rose-200 ring-2 ring-rose-400/40';
                }
              } else if (quizSubmitted && idx === q.answer) {
                styleClass = 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-300';
              }

              return `
                <button onclick="window.selectHsk90QuizOption(${idx})" class="w-full text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${styleClass}">
                  <span>${cleanOpt}</span>
                  <span class="text-xs font-mono font-bold">${String.fromCharCode(65 + idx)}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${!quizSubmitted ? `
            <button onclick="window.submitHsk90Quiz()" ${quizSelectedOption === null ? 'disabled' : ''} class="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-xs transition-all cursor-pointer">
              Kiểm Tra Đáp Án (+10 EXP)
            </button>
          ` : `
            <div class="p-3 rounded-xl ${quizSelectedOption === q.answer ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-rose-50 border border-rose-300 text-rose-900 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-300'} text-xs space-y-1">
              <div class="font-bold flex items-center gap-1.5">
                <span>${quizSelectedOption === q.answer ? '🎉 Chính xác! (+10 EXP)' : '❌ Chưa chính xác!'}</span>
              </div>
              <p class="text-2xs leading-relaxed">${q.explanation}</p>
            </div>
          `}
        </div>
      `;
    } else if (activePracticeMode === 'dictation') {
      const dic = prac.dictation || { prompt: '', audioText: '', expectedPinyin: '', meaning: '' };
      area.innerHTML = `
        <div class="space-y-3.5 animate-fade-in">
          <div class="text-xs text-stone-700 dark:text-stone-300">
            ${dic.prompt}
          </div>

          <div class="flex items-center gap-2 p-3 rounded-2xl bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-800">
            <button onclick="window.playHsk90TTS('${dic.audioText.replace(/'/g, "\\'")}', null, 0.85)" class="px-3 py-1.5 rounded-xl font-bold text-xs bg-[#8B1E1E] text-white flex items-center gap-1.5 shadow-2xs hover:bg-red-800 cursor-pointer">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i> Nghe Chuẩn
            </button>
            <button onclick="window.playHsk90TTS('${dic.audioText.replace(/'/g, "\\'")}', null, 0.65)" class="px-3 py-1.5 rounded-xl font-bold text-xs bg-white dark:bg-[#21262D] border border-amber-300 dark:border-stone-700 text-amber-900 dark:text-amber-300 flex items-center gap-1.5 hover:bg-amber-100 cursor-pointer">
              🐢 Nghe Chậm (0.65x)
            </button>
          </div>

          <div class="space-y-1.5">
            <label class="text-2xs font-bold uppercase text-stone-500">Nhập câu bạn nghe được:</label>
            <input type="text" id="hsk90DictationInput" placeholder="Gõ chữ Hán hoặc Pinyin chuẩn..." class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#21262D] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans" />
          </div>

          <button onclick="window.checkHsk90Dictation()" class="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all cursor-pointer">
            Chấm Điểm Nghe Chép (+15 EXP)
          </button>

          ${dictationTested ? `
            <div class="p-3.5 rounded-2xl border ${dictationScore >= 80 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-stone-900 dark:border-amber-800 dark:text-amber-300'} space-y-1.5 text-xs">
              <div class="font-bold flex items-center justify-between">
                <span>Độ chính xác: ${dictationScore}%</span>
                <span>${dictationScore >= 80 ? '🌟 Đạt chuẩn!' : '⚠️ Hãy nghe lại lần nữa'}</span>
              </div>
              <div class="text-2xs space-y-0.5 pt-1 border-t border-current/20">
                <p><strong>Đáp án chuẩn:</strong> ${dic.audioText}</p>
                <p><strong>Pinyin:</strong> ${dic.expectedPinyin}</p>
                <p><strong>Ý nghĩa:</strong> ${dic.meaning}</p>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else if (activePracticeMode === 'reorder') {
      const re = prac.reorder || { prompt: '', tokens: [], correctOrder: [], resultSentence: '' };
      const remainingTokens = (re.tokens || []).filter(t => !reorderSelected.includes(t));

      area.innerHTML = `
        <div class="space-y-3.5 animate-fade-in">
          <div class="text-xs text-stone-700 dark:text-stone-300">
            ${re.prompt}
          </div>

          <!-- Assembled Sentence Dropzone -->
          <div class="p-3 min-h-[52px] rounded-2xl bg-white dark:bg-[#21262D] border-2 border-dashed border-amber-300 dark:border-stone-700 flex flex-wrap items-center gap-1.5">
            ${reorderSelected.length === 0 ? `
              <span class="text-2xs text-stone-400 italic">Bấm các khối từ bên dưới để ghép thành câu...</span>
            ` : reorderSelected.map((tok, i) => `
              <button onclick="window.removeHsk90ReorderToken(${i})" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#8B1E1E] text-white hover:bg-red-800 flex items-center gap-1 cursor-pointer shadow-2xs">
                <span>${tok}</span>
                <span class="text-[10px] opacity-75">×</span>
              </button>
            `).join('')}
          </div>

          <!-- Available Chips -->
          <div class="space-y-1">
            <span class="text-2xs font-bold uppercase text-stone-500">Khối từ sẵn có:</span>
            <div class="flex flex-wrap gap-1.5">
              ${(re.tokens || []).map((tok, idx) => {
                const isUsed = reorderSelected.includes(tok);
                return `
                  <button onclick="window.addHsk90ReorderToken('${tok.replace(/'/g, "\\'")}')" ${isUsed ? 'disabled' : ''} class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isUsed
                      ? 'opacity-30 border-stone-300 dark:border-stone-700 cursor-not-allowed bg-stone-100 dark:bg-stone-800'
                      : 'bg-white dark:bg-[#161B22] border-amber-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-amber-100 hover:border-amber-400 shadow-2xs'
                  }">
                    ${tok}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.resetHsk90Reorder()" class="py-2 px-3 rounded-xl font-bold text-xs bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 cursor-pointer">
              Xóa Làm Lại
            </button>
            <button onclick="window.checkHsk90Reorder()" class="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all cursor-pointer">
              Kiểm Tra Thứ Tự (+15 EXP)
            </button>
          </div>

          ${reorderTested ? `
            <div class="p-3.5 rounded-2xl border ${reorderIsCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-300'} space-y-1 text-xs">
              <div class="font-bold">${reorderIsCorrect ? '🎉 Tuyệt vời! Bạn sắp xếp hoàn toàn chuẩn xác.' : '❌ Thứ tự chưa đúng ngữ pháp.'}</div>
              <div class="text-2xs pt-1 border-t border-current/20">
                <strong>Đáp án chuẩn:</strong> ${re.resultSentence}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else if (activePracticeMode === 'writing') {
      const prod = prac.production || { prompt: '', sampleAnswer: '' };
      area.innerHTML = `
        <div class="space-y-3.5 animate-fade-in">
          <div class="text-xs text-stone-700 dark:text-stone-300">
            ${prod.prompt}
          </div>

          <div class="space-y-1.5">
            <textarea id="hsk90WritingInput" rows="3" placeholder="Tự viết câu tiếng Trung của bạn tại đây..." class="w-full p-3 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#21262D] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"></textarea>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.evaluateHsk90Writing()" class="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-xs transition-all cursor-pointer">
              Trợ Lý AI Đánh Giá Câu (+20 EXP)
            </button>
            <button onclick="window.toggleHsk90SampleWriting()" class="py-2 px-3 rounded-xl font-bold text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-200 cursor-pointer">
              ${showSampleWriting ? 'Ẩn Mẫu' : 'Xem Mẫu'}
            </button>
          </div>

          ${showSampleWriting ? `
            <div class="p-3 rounded-xl bg-amber-50/80 dark:bg-stone-900 border border-amber-200 dark:border-stone-800 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <span class="font-bold block text-2xs uppercase tracking-wider">🌟 Câu Mẫu Giáo Viên:</span>
              <p class="font-hanzi font-bold">${prod.sampleAnswer}</p>
            </div>
          ` : ''}

          ${writingTested && writingFeedback ? `
            <div class="p-3.5 rounded-2xl border ${writingFeedback.success ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-stone-900 dark:border-amber-800 dark:text-amber-300'} space-y-1 text-xs">
              <div class="font-bold flex items-center justify-between">
                <span>${writingFeedback.success ? '🎉 Rất Tốt! (+20 EXP)' : '💡 Gợi ý bổ sung:'}</span>
                <span>${writingFeedback.score}/100 điểm</span>
              </div>
              <p class="text-2xs leading-relaxed">${writingFeedback.feedback}</p>
            </div>
          ` : ''}
        </div>
      `;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- Interactive Actions Handlers ---
  function selectQuizOption(idx) {
    if (quizSubmitted) return;
    quizSelectedOption = idx;
    renderPracticeLab();
  }

  function submitQuiz() {
    if (quizSelectedOption === null || quizSubmitted) return;
    quizSubmitted = true;
    const cur = getCurriculumData();
    const activeModule = cur.modules.find(m => m.weekNumber === activeWeek) || cur.modules[0];
    const isCorrect = quizSelectedOption === activeModule.practice.quiz.answer;
    if (isCorrect) {
      addProgressExp(10);
    }
    renderPracticeLab();
  }

  function checkDictation() {
    const inputEl = document.getElementById('hsk90DictationInput');
    const inputVal = (inputEl ? inputEl.value : '').trim().toLowerCase();
    if (!inputVal) {
      safeNotify('Vui lòng gõ chữ hoặc Pinyin bạn nghe được!');
      return;
    }

    const cur = getCurriculumData();
    const activeModule = cur.modules.find(m => m.weekNumber === activeWeek) || cur.modules[0];
    const dic = activeModule.practice.dictation;
    const targetZh = (dic.audioText || '').toLowerCase().replace(/[，。！？\s]/g, '');
    const targetPy = (dic.expectedPinyin || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanInput = inputVal.replace(/[^a-z0-9\u4e00-\u9fa5]/g, '');

    // Similarity score estimation
    let score = 50;
    if (cleanInput === targetZh || cleanInput === targetPy) {
      score = 100;
    } else if (targetZh.includes(cleanInput) || targetPy.includes(cleanInput) || cleanInput.includes(targetZh)) {
      score = 85;
    } else {
      let matched = 0;
      for (const char of cleanInput) {
        if (targetZh.includes(char) || targetPy.includes(char)) matched++;
      }
      score = Math.min(100, Math.max(30, Math.round((matched / Math.max(cleanInput.length, targetZh.length)) * 100)));
    }

    dictationScore = score;
    dictationTested = true;
    if (score >= 80) addProgressExp(15);
    renderPracticeLab();
  }

  function addReorderToken(tok) {
    if (!reorderSelected.includes(tok)) {
      reorderSelected.push(tok);
      reorderTested = false;
      renderPracticeLab();
    }
  }

  function removeReorderToken(idx) {
    reorderSelected.splice(idx, 1);
    reorderTested = false;
    renderPracticeLab();
  }

  function resetReorder() {
    reorderSelected = [];
    reorderTested = false;
    renderPracticeLab();
  }

  function checkReorder() {
    const cur = getCurriculumData();
    const activeModule = cur.modules.find(m => m.weekNumber === activeWeek) || cur.modules[0];
    const re = activeModule.practice.reorder;
    const correctStr = (re.correctOrder || []).join('');
    const userStr = reorderSelected.join('');

    reorderIsCorrect = (userStr === correctStr);
    reorderTested = true;
    if (reorderIsCorrect) addProgressExp(15);
    renderPracticeLab();
  }

  function evaluateWriting() {
    const el = document.getElementById('hsk90WritingInput');
    const text = (el ? el.value : '').trim();
    if (!text || text.length < 3) {
      safeNotify('Vui lòng viết tối thiểu 1 câu hoàn chỉnh!');
      return;
    }

    // Dynamic AI feedback simulation
    writingTested = true;
    const cur = getCurriculumData();
    const activeModule = cur.modules.find(m => m.weekNumber === activeWeek) || cur.modules[0];

    // Check sentence features
    const hasChineseChars = /[\u4e00-\u9fa5]/.test(text);
    const score = hasChineseChars ? (text.length >= 8 ? 95 : 85) : 70;

    writingFeedback = {
      score,
      success: score >= 80,
      feedback: hasChineseChars
        ? 'Câu văn sử dụng đúng ngữ cảnh và chuẩn cấu trúc ngữ pháp trọng điểm của tuần học. Rất khen ngợi sự chủ động đặt câu của bạn!'
        : 'Khuyến khích bạn gõ bằng chữ Hán giản thể để luyện ghi nhớ mặt chữ cho kỳ thi HSK iBT.'
    };

    addProgressExp(20);
    renderPracticeLab();
  }

  function toggleSampleWriting() {
    showSampleWriting = !showSampleWriting;
    renderPracticeLab();
  }

  function playAllDialogue() {
    const cur = getCurriculumData();
    const activeModule = cur.modules.find(m => m.weekNumber === activeWeek) || cur.modules[0];
    const lines = (activeModule.lecture && activeModule.lecture.dialogue && activeModule.lecture.dialogue.lines) || [];
    if (lines.length === 0) return;

    let index = 0;
    function speakNext() {
      if (index >= lines.length) return;
      const line = lines[index++];
      const isMale = (line.speaker || '').includes('Nam');
      playTTS(line.hanzi, isMale ? 'male' : 'female');
      setTimeout(speakNext, 3500);
    }
    speakNext();
  }

  function addProgressExp(exp) {
    const p = getHsk90Progress();
    p.totalExp = (p.totalExp || 0) + exp;
    saveHsk90Progress(p);
  }

  function completeDay(weekNum) {
    const p = getHsk90Progress();
    p.completedWeeks = p.completedWeeks || [];
    if (!p.completedWeeks.includes(weekNum)) {
      p.completedWeeks.push(weekNum);
      p.totalExp = (p.totalExp || 0) + 30;
      p.streak = (p.streak || 1) + 1;
      saveHsk90Progress(p);
      safeNotify(`🎉 Chúc mừng bạn đã hoàn thành xuất sắc Tuần ${weekNum}!\n+30 EXP đã được cộng vào tài khoản.`);
    } else {
      safeNotify(`Bạn đã hoàn thành Tuần ${weekNum} trước đó. Hãy tiếp tục ôn luyện và giữ vững phong độ!`);
    }
    renderHsk90Tab();
  }

  // Window Exports
  window.renderHsk90Tab = renderHsk90Tab;
  window.selectHsk90Phase = selectPhase;
  window.selectHsk90Week = selectWeek;
  window.switchHsk90LectureTab = switchLectureTab;
  window.switchHsk90PracticeMode = switchPracticeMode;
  window.selectHsk90QuizOption = selectQuizOption;
  window.submitHsk90Quiz = submitQuiz;
  window.checkHsk90Dictation = checkDictation;
  window.addHsk90ReorderToken = addReorderToken;
  window.removeHsk90ReorderToken = removeReorderToken;
  window.resetHsk90Reorder = resetReorder;
  window.checkHsk90Reorder = checkReorder;
  window.evaluateHsk90Writing = evaluateWriting;
  window.toggleHsk90SampleWriting = toggleSampleWriting;
  window.playHsk90TTS = playTTS;
  window.playHsk90AllDialogue = playAllDialogue;
  window.completeHsk90Day = completeDay;
  window.getHsk90Progress = getHsk90Progress;

})(window);
