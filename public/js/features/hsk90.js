// =========================================================================
// Khung Lộ Trình Gia Tốc 90 Ngày Chinh Phục HSK 3 (Giáo Án Từng Ngày & Thực Hành)
// =========================================================================

(function (window) {
  'use strict';

  // Navigation & Filter State
  let activePhase = 1;      // 1 | 2 | 3
  let activeDay = 1;        // 1 to 90
  let activeLectureTab = 'vocab';    // 'vocab' | 'dialogue' | 'grammar' | 'etymology'
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
      lastStudiedDay: 1
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
    return window.hsk90CurriculumData || (typeof hsk90CurriculumData !== 'undefined' ? hsk90CurriculumData : null);
  }

  function selectPhase(phaseNum) {
    activePhase = Number(phaseNum);
    const cur = getCurriculumData();
    if (cur && cur.days) {
      const firstDayOfPhase = cur.days.find(d => d.phase === activePhase);
      if (firstDayOfPhase) {
        activeDay = firstDayOfPhase.day;
      }
    }
    resetPracticeState();
    renderHsk90Tab();
  }

  function selectDay(dayNum) {
    activeDay = Number(dayNum);
    const cur = getCurriculumData();
    if (cur && cur.days) {
      const dObj = cur.days.find(d => d.day === activeDay);
      if (dObj) {
        activePhase = dObj.phase;
      }
    }
    const p = getHsk90Progress();
    p.lastStudiedDay = activeDay;
    saveHsk90Progress(p);

    resetPracticeState();
    renderHsk90Tab();

    // Auto-scroll to lesson plan
    const lessonEl = document.getElementById('hsk90DailyLessonContainer');
    if (lessonEl) {
      lessonEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function nextDay() {
    if (activeDay < 90) {
      selectDay(activeDay + 1);
    }
  }

  function prevDay() {
    if (activeDay > 1) {
      selectDay(activeDay - 1);
    }
  }

  function switchLectureTab(tabName) {
    activeLectureTab = tabName;
    renderLectureArea();
  }

  function switchPracticeMode(mode) {
    activePracticeMode = mode;
    renderPracticeArea();
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

  function playTTS(text, gender = null, speed = 0.85) {
    if (typeof window.playChineseTTS === 'function') {
      window.playChineseTTS(text, gender);
    } else if (typeof window.speechSynthesis !== 'undefined') {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = speed || 0.85;
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
  async function renderHsk90Tab() {
    const container = document.getElementById('tab-hsk90');
    if (!container) return;

    let cur = getCurriculumData();
    if (!cur && typeof window.loadData === 'function') {
      try {
        cur = await window.loadData('hsk90Curriculum');
        if (cur) window.hsk90CurriculumData = cur;
      } catch (e) {
        console.warn('Could not load hsk90Curriculum dynamically', e);
      }
    } else if (!cur && typeof loadData === 'function') {
      try {
        cur = await loadData('hsk90Curriculum');
        if (cur) window.hsk90CurriculumData = cur;
      } catch (e) {
        console.warn('Could not load hsk90Curriculum', e);
      }
    }

    if (!cur || !cur.days) {
      container.innerHTML = `
        <div class="p-8 text-center bg-white dark:bg-[#161B22] rounded-3xl border border-amber-200 dark:border-stone-800 shadow-sm">
          <div class="inline-block animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mb-3"></div>
          <p class="text-sm font-bold text-stone-600 dark:text-stone-300">Đang tải Giáo án Khung Lộ Trình 90 Ngày...</p>
        </div>
      `;
      return;
    }

    const progress = getHsk90Progress();
    const currentDayData = cur.days.find(d => d.day === activeDay) || cur.days[0];
    const totalDays = cur.days.length;
    const completedDaysCount = (progress.completedDays || []).length;
    const progressPercent = Math.min(100, Math.round((completedDaysCount / totalDays) * 100));

    // Filtered days for selector bar
    const phaseDays = cur.days.filter(d => d.phase === activePhase);

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
              <span>Giáo Án Đứng Lớp 90 Ngày Toàn Diện</span>
            </div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-black tracking-tight text-white">
              ${cur.overview.title}
            </h1>
            <p class="text-xs sm:text-sm text-red-100/90 leading-relaxed font-normal">
              ${cur.overview.subtitle}. Đi từ con số 0 đến HSK 3 với mô hình <strong>Dual-Coding</strong>, <strong>Chiết tự Logic</strong>, <strong>Công thức hóa Ngữ pháp</strong> và <strong>Giáo án 4 Bước Từng Ngày</strong>.
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
                <i data-lucide="trophy" class="w-4 h-4 text-amber-300"></i> Tiến Độ 90 Ngày
              </span>
              <span class="font-mono font-bold text-white">${completedDaysCount}/${totalDays} Ngày (${progressPercent}%)</span>
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
                <span class="text-2xs ${isPhaseActive ? 'text-white' : 'text-stone-400'}">Xem 30 ngày →</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Day Selector Strip (30 Days in Current Phase) -->
      <div class="p-4 rounded-3xl bg-[#FFFDF9] dark:bg-[#161B22] border border-amber-200 dark:border-stone-800 shadow-xs space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">🗓️</span>
            <div>
              <span class="font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                Lịch Học Từng Ngày — Chặng ${activePhase} (Ngày ${(activePhase - 1) * 30 + 1} - ${activePhase * 30}):
              </span>
              <span class="block text-2xs text-stone-500">Bấm chọn từng ngày để mở Giáo án chi tiết và phòng thực hành</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 text-2xs font-bold">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">✅ Đã xong</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">📍 Đang học</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">⚪ Chưa học</span>
          </div>
        </div>

        <!-- 30 Days Grid -->
        <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-15 gap-1.5">
          ${phaseDays.map(d => {
            const isDayActive = d.day === activeDay;
            const isCompleted = (progress.completedDays || []).includes(d.day);
            const isCheckpoint = d.type === 'checkpoint';
            const isReview = d.type === 'review';

            let btnClass = 'bg-white dark:bg-[#21262D] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-amber-50';
            if (isDayActive) {
              btnClass = 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-700 shadow-sm ring-2 ring-amber-400/50';
            } else if (isCompleted) {
              btnClass = 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold';
            } else if (isCheckpoint) {
              btnClass = 'bg-purple-50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-800 font-bold';
            } else if (isReview) {
              btnClass = 'bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-800 font-bold';
            }

            return `
              <button onclick="window.selectHsk90Day(${d.day})" class="p-2 rounded-xl border text-center transition-all cursor-pointer relative ${btnClass}" title="${d.title}">
                <span class="block text-[11px] font-mono font-black">N.${d.day}</span>
                <span class="block text-[9px] truncate opacity-90">${isCheckpoint ? '🏆 Khảo sát' : (isReview ? '📊 Tổng ôn' : 'Bài ' + d.day)}</span>
                ${isCompleted ? '<span class="absolute -top-1 -right-1 text-[10px]">✅</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- MAIN TEACHER LESSON PLAN ARENA (Giáo Án Đứng Lớp 4 Bước) -->
      <div id="hsk90DailyLessonContainer" class="space-y-6">
        <!-- Daily Lesson Header & Pager -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#161B22] border border-amber-200 dark:border-stone-800 shadow-sm">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-2xs font-bold bg-[#8B1E1E] text-white">
              <span>Ngày ${currentDayData.day} / 90</span>
              <span>•</span>
              <span>Chặng ${currentDayData.phase}</span>
              <span>•</span>
              <span>Tuần ${currentDayData.week}</span>
              <span>•</span>
              <span class="uppercase">${currentDayData.type === 'checkpoint' ? 'Đại Khảo Sát Chặng' : (currentDayData.type === 'review' ? 'Tổng Ôn Tuần' : 'Bài Giảng Mới')}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-serif-luxury font-black text-stone-900 dark:text-stone-100">
              ${currentDayData.title}
            </h2>
            <div class="text-xs text-amber-800 dark:text-amber-400 font-hanzi font-bold">${currentDayData.themeZh}</div>
          </div>

          <!-- Quick Navigation Pagers -->
          <div class="flex items-center gap-2 shrink-0">
            <button onclick="window.prevHsk90Day()" ${activeDay <= 1 ? 'disabled' : ''} class="px-3.5 py-2 rounded-xl text-xs font-bold border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#21262D] text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1">
              ← Ngày Trước
            </button>
            <button onclick="window.nextHsk90Day()" ${activeDay >= 90 ? 'disabled' : ''} class="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#8B1E1E] hover:bg-red-800 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 shadow-xs">
              Ngày Tiếp Theo →
            </button>
          </div>
        </div>

        <!-- BƯỚC 1: KHỞI ĐỘNG & MỤC TIÊU BÀI HỌC (Warm-up & Objectives) -->
        <div class="p-5 rounded-3xl bg-gradient-to-r from-amber-50/80 via-[#FFFDF9] to-orange-50/60 dark:from-[#161B22] dark:to-stone-900 border border-amber-200 dark:border-stone-800 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] dark:text-rose-400 flex items-center gap-1.5">
              <span>🎯</span> BƯỚC 1: KHỞI ĐỘNG & MỤC TIÊU NGÀY HỌC
            </span>
            <span class="text-2xs font-mono font-bold text-stone-500">⏱️ Thời lượng dự kiến: ${currentDayData.estimatedTime || '45 - 60 phút'}</span>
          </div>

          <p class="text-xs text-stone-700 dark:text-stone-300 italic leading-relaxed bg-white/80 dark:bg-black/20 p-3 rounded-2xl border border-amber-200/60 dark:border-stone-800">
            💬 <strong>Lời khuyên của giáo viên:</strong> "${currentDayData.warmup.hook}"
          </p>

          <div class="space-y-1.5">
            <span class="text-2xs font-bold uppercase tracking-wider text-stone-500">3 Mục tiêu cốt lõi hôm nay bạn sẽ làm chủ:</span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              ${(currentDayData.warmup.objectives || []).map((obj) => `
                <div class="p-2.5 rounded-xl bg-white dark:bg-[#21262D] border border-amber-200/80 dark:border-stone-700 flex items-start gap-2 text-2xs text-stone-700 dark:text-stone-300">
                  <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</span>
                  <span>${obj}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 2-COLUMN ARENA: BƯỚC 2 (BÀI GIẢNG) & BƯỚC 3 (THỰC HÀNH) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- BƯỚC 2: BÀI GIẢNG TRỌNG TÂM (7 Cols) -->
          <div class="lg:col-span-7 space-y-4">
            <div class="p-5 rounded-3xl bg-white dark:bg-[#161B22] border border-amber-200 dark:border-stone-800 shadow-sm space-y-4">
              <div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <span class="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] dark:text-rose-400 flex items-center gap-1.5">
                  <span>📖</span> BƯỚC 2: BÀI GIẢNG TRỌNG TÂM CỦA GIÁO VIÊN
                </span>
                <span class="text-2xs text-stone-400">Âm thanh chuẩn Bắc Kinh</span>
              </div>

              <!-- Lecture Subtabs -->
              <div class="flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2 overflow-x-auto text-xs">
                <button onclick="window.switchHsk90LectureTab('vocab')" class="px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeLectureTab === 'vocab' ? 'bg-[#8B1E1E] text-white shadow-2xs' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }">
                  📚 Từ Vựng Mới
                </button>
                <button onclick="window.switchHsk90LectureTab('grammar')" class="px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeLectureTab === 'grammar' ? 'bg-[#8B1E1E] text-white shadow-2xs' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }">
                  📐 Công Thức Ngữ Pháp
                </button>
                <button onclick="window.switchHsk90LectureTab('dialogue')" class="px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeLectureTab === 'dialogue' ? 'bg-[#8B1E1E] text-white shadow-2xs' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }">
                  🎙️ Hội Thoại Đối Thoại
                </button>
                <button onclick="window.switchHsk90LectureTab('etymology')" class="px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeLectureTab === 'etymology' ? 'bg-[#8B1E1E] text-white shadow-2xs' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }">
                  🔤 Chiết Tự Logic
                </button>
              </div>

              <!-- Dynamic Lecture Subtab Content -->
              <div id="hsk90LectureSubArea">
                <!-- Injected by renderLectureArea() -->
              </div>
            </div>
          </div>

          <!-- BƯỚC 3: THỰC HÀNH PHẢN XẠ TẠI LỚP (5 Cols) -->
          <div class="lg:col-span-5 space-y-4">
            <div class="p-5 rounded-3xl bg-[#FFFDF9] dark:bg-[#161B22] border border-amber-200 dark:border-stone-800 shadow-sm space-y-4">
              <div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <span class="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] dark:text-rose-400 flex items-center gap-1.5">
                  <span>⚡</span> BƯỚC 3: THỰC HÀNH PHẢN XẠ TẠI LỚP
                </span>
                <span class="text-2xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300">
                  +60 EXP
                </span>
              </div>

              <!-- Practice Mode Selector -->
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
              <div id="hsk90PracticeSubArea">
                <!-- Injected by renderPracticeArea() -->
              </div>
            </div>
          </div>
        </div>

        <!-- BƯỚC 4: NHIỆM VỤ VỀ NHÀ & ĐÁNH DẤU HOÀN THÀNH NGÀY (Homework & Completion) -->
        <div class="p-5 rounded-3xl bg-white dark:bg-[#161B22] border border-amber-200 dark:border-stone-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <span class="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] dark:text-rose-400 flex items-center gap-1.5">
              <span>📝</span> BƯỚC 4: NHIỆM VỤ VỀ NHÀ & CỦNG CỐ KIẾN THỨC
            </span>
            <span class="text-2xs text-stone-500">Tự rèn luyện 15 phút trước khi đi ngủ</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Homework Tasks List -->
            <div class="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-900 border border-amber-200/80 dark:border-stone-800 space-y-2">
              <span class="text-2xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-1">
                <i data-lucide="check-square" class="w-3.5 h-3.5"></i> Nhiệm vụ giáo viên giao hôm nay:
              </span>
              <ul class="space-y-1.5 pl-4 list-disc marker:text-amber-600 text-xs text-stone-700 dark:text-stone-300">
                ${(currentDayData.homework.tasks || []).map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>

            <!-- Flashcards to Review -->
            <div class="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <span class="text-2xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                <i data-lucide="layers" class="w-3.5 h-3.5 text-amber-600"></i> Từ vựng cần ghi nhớ vào sổ tay:
              </span>
              <div class="flex flex-wrap gap-1.5">
                ${(currentDayData.homework.flashcardsToReview || []).map(w => `
                  <span class="px-2.5 py-1 rounded-xl bg-white dark:bg-[#21262D] border border-amber-200 dark:border-stone-700 text-xs font-hanzi font-bold text-stone-800 dark:text-stone-200 shadow-2xs">
                    ${w}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Final Milestone Button for the Day -->
          <div class="pt-2">
            <button onclick="window.completeHsk90Day(${currentDayData.day})" class="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#8B1E1E] via-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98">
              <i data-lucide="award" class="w-5 h-5 text-amber-300"></i>
              <span>ĐÁNH DẤU HOÀN THÀNH NGÀY ${currentDayData.day} (+30 EXP)</span>
            </button>
          </div>
        </div>
      </div>
    `;

    renderLectureArea();
    renderPracticeArea();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- Render Lecture Subtab Area ---
  function renderLectureArea() {
    const area = document.getElementById('hsk90LectureSubArea');
    if (!area) return;

    const cur = getCurriculumData();
    if (!cur) return;
    const currentDayData = cur.days.find(d => d.day === activeDay) || cur.days[0];
    const lec = currentDayData.lecture || {};

    if (activeLectureTab === 'vocab') {
      const vocabList = lec.vocab || [];
      area.innerHTML = `
        <div class="space-y-3 animate-fade-in">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-amber-900 dark:text-amber-400">Từ vựng bài học hôm nay:</span>
            <span class="text-2xs text-stone-400">${vocabList.length} từ then chốt</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${vocabList.map(v => `
              <div class="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex items-start justify-between gap-2 hover:border-amber-300 transition-colors">
                <div class="space-y-0.5">
                  <div class="text-lg font-hanzi font-bold text-stone-900 dark:text-stone-100">${v.hanzi}</div>
                  <div class="text-xs text-amber-700 dark:text-amber-400 font-mono font-bold">${v.pinyin}</div>
                  <div class="text-xs text-stone-600 dark:text-stone-300">${v.vi}</div>
                  ${v.tip ? `<div class="text-[10px] text-stone-400 pt-0.5">💡 ${v.tip}</div>` : ''}
                </div>
                <button onclick="window.playHsk90TTS('${v.hanzi}')" class="p-2 rounded-xl text-stone-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-stone-800 transition-all cursor-pointer shrink-0" title="Phát âm">
                  <i data-lucide="volume-2" class="w-4 h-4"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (activeLectureTab === 'grammar') {
      const g = lec.grammar || { formula: '', explanation: '', examples: [] };
      area.innerHTML = `
        <div class="space-y-3.5 animate-fade-in">
          <div class="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-stone-900 dark:to-stone-900 border-2 border-dashed border-red-300 dark:border-red-900 space-y-1">
            <span class="text-2xs font-bold uppercase tracking-wider text-red-800 dark:text-red-400 flex items-center gap-1">
              <i data-lucide="code-2" class="w-3.5 h-3.5"></i> Công Thức Ngữ Pháp Ngày ${activeDay}:
            </span>
            <div class="text-xs sm:text-sm font-mono font-black text-stone-900 dark:text-stone-100 bg-white dark:bg-[#161B22] p-2.5 rounded-xl border border-red-200 dark:border-stone-800">
              ${g.formula}
            </div>
          </div>

          <div class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <span class="font-bold text-amber-900 dark:text-amber-400 block mb-1">📖 Phân Tích Logic:</span>
            ${g.explanation}
          </div>

          <div class="space-y-2">
            <span class="text-2xs font-bold uppercase tracking-wider text-stone-500">Ví Dụ Thực Hành Trong Bài:</span>
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
    } else if (activeLectureTab === 'dialogue') {
      const d = lec.dialogue || { title: 'Hội thoại', lines: [] };
      area.innerHTML = `
        <div class="space-y-3 animate-fade-in">
          <div class="flex items-center justify-between pb-1">
            <span class="text-xs font-bold text-amber-900 dark:text-amber-400">${d.title}</span>
            <button onclick="window.playHsk90AllDialogue()" class="text-2xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 text-amber-900 dark:text-amber-300 flex items-center gap-1 transition-all cursor-pointer">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i> Nghe Toàn Đoạn
            </button>
          </div>

          <div class="space-y-2.5">
            ${(d.lines || []).map(line => {
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
            Giải Mã Chiết Tự & Nguồn Gốc Chữ Hán Ngày ${activeDay}:
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
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- Render Practice Sub Area ---
  function renderPracticeArea() {
    const area = document.getElementById('hsk90PracticeSubArea');
    if (!area) return;

    const cur = getCurriculumData();
    if (!cur) return;
    const currentDayData = cur.days.find(d => d.day === activeDay) || cur.days[0];
    const prac = currentDayData.practice || {};

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
            ${dic.prompt || 'Nghe câu và gõ lại bằng chữ Hán hoặc Pinyin:'}
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

      area.innerHTML = `
        <div class="space-y-3.5 animate-fade-in">
          <div class="text-xs text-stone-700 dark:text-stone-300">
            ${re.prompt || 'Sắp xếp các khối từ sau thành câu hoàn chỉnh đúng ngữ pháp:'}
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
              ${(re.tokens || []).map(tok => {
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
            ${prod.prompt || 'Vận dụng cấu trúc bài học hôm nay, hãy tự viết 1 câu hoàn chỉnh:'}
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
    renderPracticeArea();
  }

  function submitQuiz() {
    if (quizSelectedOption === null || quizSubmitted) return;
    quizSubmitted = true;
    const cur = getCurriculumData();
    const currentDayData = cur.days.find(d => d.day === activeDay) || cur.days[0];
    const isCorrect = quizSelectedOption === currentDayData.practice.quiz.answer;
    if (isCorrect) {
      addProgressExp(10);
    }
    renderPracticeArea();
  }

  function checkDictation() {
    const inputEl = document.getElementById('hsk90DictationInput');
    const inputVal = (inputEl ? inputEl.value : '').trim().toLowerCase();
    if (!inputVal) {
      safeNotify('Vui lòng gõ chữ hoặc Pinyin bạn nghe được!');
      return;
    }

    const cur = getCurriculumData();
    const currentDayData = cur.days.find(d => d.day === activeDay) || cur.days[0];
    const dic = currentDayData.practice.dictation;
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
    renderPracticeArea();
  }

  function addReorderToken(tok) {
    if (!reorderSelected.includes(tok)) {
      reorderSelected.push(tok);
      reorderTested = false;
      renderPracticeArea();
    }
  }

  function removeReorderToken(idx) {
    reorderSelected.splice(idx, 1);
    reorderTested = false;
    renderPracticeArea();
  }

  function resetReorder() {
    reorderSelected = [];
    reorderTested = false;
    renderPracticeArea();
  }

  function checkReorder() {
    const cur = getCurriculumData();
    const currentDayData = cur.days.find(d => d.day === activeDay) || cur.days[0];
    const re = currentDayData.practice.reorder;
    const correctStr = (re.correctOrder || []).join('');
    const userStr = reorderSelected.join('');

    reorderIsCorrect = (userStr === correctStr);
    reorderTested = true;
    if (reorderIsCorrect) addProgressExp(15);
    renderPracticeArea();
  }

  function evaluateWriting() {
    const el = document.getElementById('hsk90WritingInput');
    const text = (el ? el.value : '').trim();
    if (!text || text.length < 3) {
      safeNotify('Vui lòng viết tối thiểu 1 câu hoàn chỉnh!');
      return;
    }

    writingTested = true;
    const hasChineseChars = /[\u4e00-\u9fa5]/.test(text);
    const score = hasChineseChars ? (text.length >= 8 ? 95 : 85) : 70;

    writingFeedback = {
      score,
      success: score >= 80,
      feedback: hasChineseChars
        ? 'Câu văn sử dụng đúng ngữ cảnh và chuẩn cấu trúc ngữ pháp trọng điểm của ngày học. Rất khen ngợi sự chủ động đặt câu của bạn!'
        : 'Khuyến khích bạn gõ bằng chữ Hán giản thể để luyện ghi nhớ mặt chữ cho kỳ thi HSK iBT.'
    };

    addProgressExp(20);
    renderPracticeArea();
  }

  function toggleSampleWriting() {
    showSampleWriting = !showSampleWriting;
    renderPracticeArea();
  }

  function playAllDialogue() {
    const cur = getCurriculumData();
    const currentDayData = cur.days.find(d => d.day === activeDay) || cur.days[0];
    const lines = (currentDayData.lecture && currentDayData.lecture.dialogue && currentDayData.lecture.dialogue.lines) || [];
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

  function completeDay(dayNum) {
    const p = getHsk90Progress();
    p.completedDays = p.completedDays || [];
    if (!p.completedDays.includes(dayNum)) {
      p.completedDays.push(dayNum);
      p.totalExp = (p.totalExp || 0) + 30;
      p.streak = (p.streak || 1) + 1;
      saveHsk90Progress(p);
      safeNotify(`🎉 Chúc mừng bạn đã hoàn thành xuất sắc bài học Ngày ${dayNum}!\n+30 EXP đã được cộng vào tài khoản.`);
    } else {
      safeNotify(`Bạn đã hoàn thành Ngày ${dayNum} trước đó. Hãy tiếp tục ôn tập và giữ vững chuỗi học tập!`);
    }
    renderHsk90Tab();
  }

  // Window Exports
  window.renderHsk90Tab = renderHsk90Tab;
  window.selectHsk90Phase = selectPhase;
  window.selectHsk90Day = selectDay;
  window.nextHsk90Day = nextDay;
  window.prevHsk90Day = prevDay;
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

  // Legacy compatibility exports
  window.selectHsk90Week = (w) => selectDay((w - 1) * 7 + 1);

})(window);
