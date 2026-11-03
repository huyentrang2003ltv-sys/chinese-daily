// Module state
let activeJiaochengVolume = 'all';
let jiaochengSearchQuery = '';

// ==========================================
// MODULE: GIÁO TRÌNH HÁN NGỮ 6 QUYỂN (BÁCH KHOA TOÀN THƯ)
// Trích xuất toàn diện tri thức từ 6 tập PDF (ĐH Ngôn ngữ Bắc Kinh)
// ==========================================
function filterJiaochengVolume(volume) {
  activeJiaochengVolume = volume;
  
  const buttons = ['all', '1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];
  buttons.forEach(v => {
    const btn = document.getElementById(`btn-jc-${v}`);
    if (!btn) return;
    if (v === volume) {
      btn.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap';
    } else {
      btn.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap';
    }
  });

  renderJiaocheng();
}

function setupJiaochengSearch() {
  const input = document.getElementById('jiaochengSearchInput');
  if (!input || input.dataset.bound) return;
  input.dataset.bound = '1';
  input.addEventListener('input', debounce((e) => {
    jiaochengSearchQuery = e.target.value.trim().toLowerCase();
    renderJiaocheng();
  }, 120));
}

let currentActiveLesson = null;
let currentLessonSubTab = 'dialogues';
let lessonQuizResponses = {};

function renderJiaocheng() {
  const container = document.getElementById('jiaochengGridContainer');
  if (!container) return;

  if (!jiaochengData || !jiaochengData.lessons) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-stone-400">
        <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto mb-2 text-[#8B1E1E]"></i>
        <p class="text-xs">Đang tải toàn bộ tri thức 6 tập Giáo trình Hán ngữ...</p>
      </div>
    `;
    refreshIcons(container);
    return;
  }

  let lessons = jiaochengData.lessons;

  if (activeJiaochengVolume !== 'all') {
    lessons = lessons.filter(l => l.volume === activeJiaochengVolume);
  }

  if (jiaochengSearchQuery) {
    lessons = lessons.filter(l => {
      const dialoguesText = (l.dialogues || []).map(d => `${d.hanzi} ${d.pinyin} ${d.vi}`).join(' ');
      const vocabText = (l.vocabulary || []).map(v => `${v.hanzi} ${v.pinyin} ${v.meaning} ${v.sinoViet || ''}`).join(' ');
      const grammarText = (l.grammarPoints || []).map(g => `${g.title} ${g.formula} ${g.explanation}`).join(' ');
      const target = `${l.titleHanzi} ${l.titlePinyin} ${l.titleMeaning} ${l.category} ${l.introduction || ''} ${grammarText} ${dialoguesText} ${vocabText}`.toLowerCase();
      return target.includes(jiaochengSearchQuery);
    });
  }

  const countBadge = document.getElementById('jiaochengLessonCount');
  if (countBadge) {
    countBadge.innerText = lessons.length;
  }

  if (lessons.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-stone-400">
        <i data-lucide="book-open" class="w-12 h-12 mx-auto mb-3 opacity-40 text-stone-400"></i>
        <p class="font-bold text-stone-600">Không tìm thấy bài học nào phù hợp với từ khóa</p>
        <p class="text-xs text-stone-400 mt-1">Hãy thử tìm theo chữ Hán, Pinyin, tên ngữ pháp hoặc từ vựng (VD: 把, 比, 换钱, 苹果)...</p>
      </div>
    `;
    refreshIcons(container);
    return;
  }

  const volumeColorMap = {
    '1-1': { bg: 'bg-red-50 text-[#8B1E1E] border-red-200', tag: 'Hán Ngữ 1 (1-1)' },
    '1-2': { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', tag: 'Hán Ngữ 2 (1-2)' },
    '2-1': { bg: 'bg-amber-50 text-amber-900 border-amber-200', tag: 'Hán Ngữ 3 (2-1)' },
    '2-2': { bg: 'bg-purple-50 text-purple-900 border-purple-200', tag: 'Hán Ngữ 4 (2-2)' },
    '3-1': { bg: 'bg-blue-50 text-blue-900 border-blue-200', tag: 'Hán Ngữ 5 (3-1)' },
    '3-2': { bg: 'bg-rose-50 text-rose-900 border-rose-200', tag: 'Hán Ngữ 6 (3-2)' }
  };

  container.innerHTML = lessons.map(lesson => {
    const vMeta = volumeColorMap[lesson.volume] || { bg: 'bg-stone-100 text-stone-800 border-stone-200', tag: `Quyển ${lesson.volume}` };
    const firstDialogue = lesson.dialogues && lesson.dialogues[0] ? lesson.dialogues[0] : null;
    const grammarSummary = (lesson.grammarPoints || []).map(g => g.title).join(' • ') || 'Trọng điểm cấu trúc ngữ pháp';
    const vocabPreview = (lesson.vocabulary || []).slice(0, 5);

    return `
      <div class="glass-card rounded-2xl p-5 border border-amber-200/90 hover:border-[#8B1E1E]/50 transition-all space-y-3.5 bg-[#FFFDF9]/95 shadow-xs hover:shadow-md flex flex-col justify-between">
        <div class="space-y-3">
          <!-- Top Tag Bar -->
          <div class="flex items-center justify-between gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black border ${vMeta.bg}">
              ${vMeta.tag} • Bài ${lesson.lessonNum}
            </span>
            <span class="text-[11px] font-medium text-stone-500 bg-stone-100/80 px-2 py-0.5 rounded-md">
              ${lesson.category}
            </span>
          </div>

          <!-- Title & Audio -->
          <div class="flex items-start justify-between gap-3 border-b border-amber-100 pb-2.5">
            <div class="cursor-pointer group/title flex-1" onclick="openLessonDetailModal(${jsArg(lesson.id)})" title="Bấm vào đây để mở chi tiết toàn bộ bài học">
              <div class="flex items-baseline gap-2 flex-wrap">
                <h3 class="text-xl font-bold font-hanzi text-stone-900 group-hover/title:text-[#8B1E1E] transition-colors tracking-wide">${lesson.titleHanzi}</h3>
                <span class="text-xs font-semibold text-[#8B1E1E]">${lesson.titlePinyin}</span>
              </div>
              <p class="text-xs font-medium text-stone-600 mt-0.5 group-hover/title:text-stone-900 transition-colors">"${lesson.titleMeaning}"</p>
            </div>
            <div class="inline-flex items-center gap-0.5 bg-amber-50/80 p-0.5 rounded-xl border border-amber-200 shrink-0 shadow-2xs">
              <button 
                onclick="playChineseTTS(${jsArg(lesson.titleHanzi)}, 'female')" 
                class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer" 
                title="Phát âm tên bài học (Giọng Nữ)">
                👩 Nữ
              </button>
              <button 
                onclick="playChineseTTS(${jsArg(lesson.titleHanzi)}, 'male')" 
                class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer" 
                title="Phát âm tên bài học (Giọng Nam)">
                👨 Nam
              </button>
            </div>
          </div>

          <!-- Grammar Focus -->
          <div class="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs space-y-1">
            <span class="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <i data-lucide="compass" class="w-3 h-3 text-[#8B1E1E]"></i>
              Ngữ pháp cốt lõi:
            </span>
            <p class="text-stone-700 leading-relaxed font-sans line-clamp-2">${grammarSummary}</p>
          </div>

          <!-- Sample Dialogue -->
          ${firstDialogue ? `
            <div class="p-3 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Hội thoại (${firstDialogue.displayName || firstDialogue.speaker}):</span>
                <div class="inline-flex items-center gap-0.5">
                  <button onclick="playChineseTTS(${jsArg(firstDialogue.hanzi)}, 'female')" class="text-rose-700 hover:text-rose-900 font-bold text-[10px] px-1 py-0.5 rounded bg-white border border-rose-200 cursor-pointer" title="Nghe giọng Nữ">👩</button>
                  <button onclick="playChineseTTS(${jsArg(firstDialogue.hanzi)}, 'male')" class="text-blue-700 hover:text-blue-900 font-bold text-[10px] px-1 py-0.5 rounded bg-white border border-blue-200 cursor-pointer" title="Nghe giọng Nam">👨</button>
                </div>
              </div>
              <p class="font-hanzi font-bold text-stone-900 text-[13px]">${firstDialogue.hanzi}</p>
              <p class="text-stone-600 italic text-[11px]">${firstDialogue.vi}</p>
            </div>
          ` : ''}

          <!-- Vocabulary Preview -->
          <div class="space-y-1 pt-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Từ mới then chốt:</span>
              <span class="text-[10px] text-stone-400">${lesson.vocabulary ? lesson.vocabulary.length : 0} từ</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${vocabPreview.map(v => `
                <span class="px-2 py-0.5 rounded-lg bg-amber-50 text-[11px] font-medium text-stone-700 border border-amber-200/60 flex items-center gap-1">
                  <span class="font-hanzi font-bold text-stone-900">${v.hanzi}</span>
                  <span class="text-[10px] text-stone-500">${v.pinyin}</span>
                </span>
              `).join('')}
              ${lesson.vocabulary && lesson.vocabulary.length > 5 ? `<span class="px-1.5 py-0.5 text-[10px] text-stone-400 font-bold self-center">+${lesson.vocabulary.length - 5}</span>` : ''}
            </div>
          </div>
        </div>

        <!-- Master Action: Open Detailed Lesson Modal -->
        <div class="pt-3 border-t border-amber-100 space-y-2">
          <button 
            onclick="openLessonDetailModal(${jsArg(lesson.id)})"
            class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <i data-lucide="book-open" class="w-4 h-4"></i>
            <span>Xem Chi Tiết Toàn Bộ Bài Học</span>
          </button>
          
          <div class="flex items-center justify-between text-xs pt-1">
            <button 
              onclick="quickSearchFromLesson(${jsArg(lesson.titleHanzi)})" 
              class="text-[#8B1E1E] hover:underline font-semibold flex items-center gap-1 text-[11px] cursor-pointer">
              <i data-lucide="search" class="w-3 h-3"></i>
              Tra trong Từ Điển
            </button>
            <span class="text-[10px] text-stone-400">Giáo Trình Hán Ngữ 6 Quyển</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons(container);
}

function quickSearchFromLesson(text) {
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.value = text;
    handleGlobalSearch(text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// =========================================================================
// INTERACTIVE LESSON DETAIL MODAL (CHI TIẾT BÀI HỌC GIÁO TRÌNH HÁN NGỮ)
// =========================================================================

let isDialoguePlaying = false;
let dialoguePlayIndex = 0;
let dialoguePlayTimeout = null;
let currentLessonFIBSelections = {};

async function openLessonDetailModal(lessonId) {
  try {
    if (!jiaochengData || !jiaochengData.lessons) await loadData('jiaocheng');
    const lesson = jiaochengData && jiaochengData.lessons ? jiaochengData.lessons.find(l => l.id === lessonId) : null;
    if (!lesson) {
      console.warn('Không tìm thấy bài học:', lessonId);
      return;
    }

    // VIP Guard Check for Lessons: Free preview for lessons 1-5
    if (lesson && lesson.lessonNum > 5 && typeof checkCurrentUserVip === 'function') {
      const vip = checkCurrentUserVip();
      if (vip.isExpired) {
        ensureVipAccess('Bài ' + lesson.lessonNum + ': ' + lesson.titleHanzi);
        return;
      }
    }

    currentActiveLesson = lesson;
    if (userProfile) {
      userProfile.lastLesson = {
        id: lesson.id,
        volumeName: lesson.volumeName,
        titleHanzi: lesson.titleHanzi,
        titlePinyin: lesson.titlePinyin,
        titleMeaning: lesson.titleMeaning
      };
      saveUserProfile();
    }
    stopDialogueSequence();
    currentLessonFIBSelections = {};

    // Header information
    const volumeBadge = document.getElementById('lessonModalVolumeBadge');
    const catBadge = document.getElementById('lessonModalCategoryBadge');
    const titleHanzi = document.getElementById('lessonModalTitleHanzi');
    const titlePinyin = document.getElementById('lessonModalTitlePinyin');
    const titleMeaning = document.getElementById('lessonModalTitleMeaning');
    const vocabCountEl = document.getElementById('lessonModalVocabCount');
    const qaCountEl = document.getElementById('lessonModalQACount');
    const fibCountEl = document.getElementById('lessonModalFIBCount');

    if (volumeBadge) volumeBadge.innerText = `${lesson.volumeName || lesson.volume} • Bài ${lesson.lessonNum}`;
    if (catBadge) catBadge.innerText = lesson.category;
    if (titleHanzi) titleHanzi.innerText = lesson.titleHanzi;
    if (titlePinyin) titlePinyin.innerText = lesson.titlePinyin;
    if (titleMeaning) titleMeaning.innerText = `"${lesson.titleMeaning}"`;
    if (vocabCountEl) vocabCountEl.innerText = (lesson.vocabulary || []).length;
    if (qaCountEl) qaCountEl.innerText = (lesson.comprehensionQA || []).length;
    if (fibCountEl) fibCountEl.innerText = (lesson.fillInBlanks || []).length;

    // Update Next/Prev navigation buttons
    updateLessonModalNavButtons();

    // Render Sub-panels safely
    try { renderLessonDialogues(lesson.dialogues || []); } catch (e) { console.error('Error rendering dialogues:', e); }
    try { renderLessonNarrative(lesson.narrative || null); } catch (e) { console.error('Error rendering narrative:', e); }
    try { renderLessonVocabulary(lesson.vocabulary || []); } catch (e) { console.error('Error rendering vocabulary:', e); }
    try { renderLessonGrammar(lesson.grammarPoints || []); } catch (e) { console.error('Error rendering grammar:', e); }
    try { renderLessonQA(lesson.comprehensionQA || []); } catch (e) { console.error('Error rendering QA:', e); }
    try { renderLessonFillInBlanks(lesson.fillInBlanks || []); } catch (e) { console.error('Error rendering FIB:', e); }
    try { renderLessonCulture(lesson); } catch (e) { console.error('Error rendering culture:', e); }

    // Default to dialogues sub-tab
    switchLessonSubTab('dialogues');

    // Show modal & prevent background scrolling
    const modal = document.getElementById('lessonDetailModal');
    if (modal) {
      openModal('lessonDetailModal');
      const contentArea = document.getElementById('lessonModalContentArea');
      if (contentArea) contentArea.scrollTop = 0;
    }
  } catch (err) {
    console.error('Lỗi khi mở chi tiết bài học:', err);
  }
}

function updateLessonModalNavButtons() {
  if (!currentActiveLesson || !jiaochengData || !jiaochengData.lessons) return;
  const currentIdx = jiaochengData.lessons.findIndex(l => l.id === currentActiveLesson.id);
  const prevBtn = document.getElementById('btnLessonModalPrev');
  const nextBtn = document.getElementById('btnLessonModalNext');
  if (prevBtn) {
    if (currentIdx <= 0) {
      prevBtn.classList.add('opacity-40', 'pointer-events-none');
    } else {
      prevBtn.classList.remove('opacity-40', 'pointer-events-none');
    }
  }
  if (nextBtn) {
    if (currentIdx >= jiaochengData.lessons.length - 1) {
      nextBtn.classList.add('opacity-40', 'pointer-events-none');
    } else {
      nextBtn.classList.remove('opacity-40', 'pointer-events-none');
    }
  }
}

function navigateToAdjacentLesson(direction) {
  if (!currentActiveLesson || !jiaochengData || !jiaochengData.lessons) return;
  const currentIdx = jiaochengData.lessons.findIndex(l => l.id === currentActiveLesson.id);
  if (currentIdx === -1) return;
  const nextIdx = currentIdx + direction;
  if (nextIdx >= 0 && nextIdx < jiaochengData.lessons.length) {
    const nextLesson = jiaochengData.lessons[nextIdx];
    openLessonDetailModal(nextLesson.id);
  }
}

function closeLessonDetailModal() {
  stopDialogueSequence();
  stopNarrativeSpeech();
  closeModal('lessonDetailModal');
}

registerModal('lessonDetailModal', closeLessonDetailModal);

function switchLessonSubTab(tabName) {
  currentLessonSubTab = tabName;
  if (tabName !== 'narrative') {
    stopNarrativeSpeech();
  }
  if (tabName !== 'dialogues') {
    stopDialogueSequence();
  }
  const subTabs = ['dialogues', 'narrative', 'vocabulary', 'grammar', 'qa', 'fillblanks', 'culture'];

  subTabs.forEach(t => {
    const btn = document.getElementById(`btn-lesson-subtab-${t}`);
    const panel = document.getElementById(`lessonSubPanel-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.className = 'lesson-subtab-btn px-4 py-1.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs whitespace-nowrap cursor-pointer';
      } else {
        btn.className = 'lesson-subtab-btn px-4 py-1.5 rounded-xl text-xs font-bold transition-all bg-white hover:bg-amber-50 text-stone-700 border border-amber-200 whitespace-nowrap cursor-pointer';
      }
    }
    if (panel) {
      if (t === tabName) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    }
  });

  const modal = document.getElementById('lessonDetailModal');
  if (modal) refreshIcons(modal);
}

function playLessonTitleAudio(gender = 'female') {
  if (!currentActiveLesson) return;
  playChineseTTS(currentActiveLesson.titleHanzi, gender);
}

// ---------------- DIALOGUES WITH CHARACTER VOICE PLAYBACK ----------------
function stopDialogueSequence() {
  isDialoguePlaying = false;
  if (dialoguePlayTimeout) {
    clearTimeout(dialoguePlayTimeout);
    dialoguePlayTimeout = null;
  }
  if (currentTtsAudio) {
    try {
      currentTtsAudio.pause();
      currentTtsAudio.currentTime = 0;
    } catch (e) {}
  }
  document.querySelectorAll('.dialogue-bubble').forEach(el => {
    el.classList.remove('ring-2', 'ring-[#8B1E1E]', 'bg-amber-100/70', 'scale-[1.01]', 'shadow-md');
  });
  const playBtn = document.getElementById('btnPlayDialogueSequence');
  const stopBtn = document.getElementById('btnStopDialogueSequence');
  if (playBtn) playBtn.classList.remove('hidden');
  if (stopBtn) stopBtn.classList.add('hidden');
}

function playDialogueSequence() {
  if (!currentActiveLesson || !currentActiveLesson.dialogues || !currentActiveLesson.dialogues.length) return;
  stopDialogueSequence();
  isDialoguePlaying = true;
  dialoguePlayIndex = 0;

  const playBtn = document.getElementById('btnPlayDialogueSequence');
  const stopBtn = document.getElementById('btnStopDialogueSequence');
  if (playBtn) playBtn.classList.add('hidden');
  if (stopBtn) stopBtn.classList.remove('hidden');

  playNextDialogueLine();
}

function playNextDialogueLine() {
  if (!isDialoguePlaying || !currentActiveLesson || !currentActiveLesson.dialogues) return;
  const dialogues = currentActiveLesson.dialogues;
  if (dialoguePlayIndex >= dialogues.length) {
    stopDialogueSequence();
    return;
  }

  const line = dialogues[dialoguePlayIndex];
  const bubbleEl = document.getElementById(`dialogueBubble-${dialoguePlayIndex}`);

  // Highlight current active dialogue bubble
  document.querySelectorAll('.dialogue-bubble').forEach(el => {
    el.classList.remove('ring-2', 'ring-[#8B1E1E]', 'bg-amber-100/70', 'scale-[1.01]', 'shadow-md');
  });
  if (bubbleEl) {
    bubbleEl.classList.add('ring-2', 'ring-[#8B1E1E]', 'bg-amber-100/70', 'scale-[1.01]', 'shadow-md');
    bubbleEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Choose character voice gender
  const voiceGender = line.gender || (line.speaker.includes('玛丽') || line.speaker.includes('田芳') || line.speaker.includes('女') ? 'female' : 'male');
  const speed = currentTtsSpeed || 0.85;
  const ttsUrl = `/api/tts?text=${encodeURIComponent(line.hanzi)}&gender=${voiceGender}&speed=${speed}`;

  const audio = new Audio(ttsUrl);
  currentTtsAudio = audio;

  audio.onended = () => {
    if (!isDialoguePlaying) return;
    dialoguePlayIndex++;
    dialoguePlayTimeout = setTimeout(() => {
      playNextDialogueLine();
    }, 1100); // 1.1s natural pause between speakers
  };

  audio.onerror = () => {
    if (!isDialoguePlaying) return;
    dialoguePlayIndex++;
    dialoguePlayTimeout = setTimeout(() => {
      playNextDialogueLine();
    }, 1000);
  };

  audio.play().catch(err => {
    console.warn('Audio play failed in sequence:', err);
    if (isDialoguePlaying) {
      dialoguePlayIndex++;
      dialoguePlayTimeout = setTimeout(playNextDialogueLine, 1000);
    }
  });
}

function renderLessonDialogues(dialogues) {
  const container = document.getElementById('lessonDialoguesContainer');
  if (!container) return;

  if (!dialogues || dialogues.length === 0) {
    container.innerHTML = `<p class="text-xs text-stone-400 py-4 text-center">Không có bài khóa cho bài học này.</p>`;
    return;
  }

  container.innerHTML = dialogues.map((d, idx) => {
    const isFemale = d.gender === 'female';
    const voiceTag = isFemale ? '👩 Giọng Nữ (Xiaoxiao)' : '👨 Giọng Nam (Yunxi)';
    const avatarBadgeColor = isFemale ? 'from-rose-500 to-amber-600' : 'from-blue-600 to-indigo-800';
    const cardBorderColor = isFemale ? 'border-rose-200/80 bg-rose-50/15' : 'border-blue-200/80 bg-blue-50/15';

    const sectionHeader = d.sectionTitle ? `
      <div class="pt-3 pb-1 flex items-center gap-3">
        <span class="h-px bg-amber-300/80 flex-1"></span>
        <span class="text-xs font-bold text-[#8B1E1E] bg-gradient-to-r from-amber-100 to-amber-50 px-3.5 py-1 rounded-full border border-amber-300 shadow-2xs flex items-center gap-1.5">
          <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
          <span>${d.sectionTitle}</span>
        </span>
        <span class="h-px bg-amber-300/80 flex-1"></span>
      </div>
    ` : '';

    return `
      ${sectionHeader}
      <div id="dialogueBubble-${idx}" class="dialogue-bubble p-4 md:p-5 rounded-2xl bg-white border ${cardBorderColor} shadow-2xs hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr ${avatarBadgeColor} text-white flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            <span class="text-base leading-none">${d.avatar || (isFemale ? '👩' : '👨')}</span>
          </div>
          <div class="space-y-1.5 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-black text-stone-900">${d.displayName || d.speaker}</span>
              ${d.role ? `<span class="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md font-medium">${d.role}</span>` : ''}
              <span class="text-[10px] font-bold ${isFemale ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-blue-700 bg-blue-50 border-blue-200'} border px-2 py-0.5 rounded-full">
                ${voiceTag}
              </span>
            </div>
            <p class="font-hanzi text-lg md:text-xl font-bold text-stone-900 tracking-wide leading-relaxed">${d.hanzi}</p>
            <p class="text-xs font-semibold text-[#8B1E1E] tracking-wide font-sans">${d.pinyin}</p>
            <p class="text-xs text-stone-600 font-sans italic pt-0.5">${d.vi}</p>
          </div>
        </div>
        <div class="flex items-center gap-1 self-end md:self-start shrink-0 bg-stone-100/80 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
          <button 
            onclick="playChineseTTS(${jsArg(d.hanzi)}, 'female')" 
            class="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${isFemale ? 'bg-rose-100 text-rose-900 ring-1 ring-rose-300 font-black' : 'bg-white text-stone-600 hover:text-rose-700'}"
            title="Nghe giọng Nữ (Xiaoxiao Bắc Kinh)${isFemale ? ' • Giọng gốc nhân vật' : ''}">
            <span>👩 Nữ</span>
            ${isFemale ? '<span class="text-[9px] bg-rose-200/90 text-rose-800 px-1 rounded font-black tracking-tight">Gốc</span>' : ''}
          </button>
          <button 
            onclick="playChineseTTS(${jsArg(d.hanzi)}, 'male')" 
            class="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${!isFemale ? 'bg-blue-100 text-blue-900 ring-1 ring-blue-300 font-black' : 'bg-white text-stone-600 hover:text-blue-700'}"
            title="Nghe giọng Nam (Yunxi Bắc Kinh)${!isFemale ? ' • Giọng gốc nhân vật' : ''}">
            <span>👨 Nam</span>
            ${!isFemale ? '<span class="text-[9px] bg-blue-200/90 text-blue-800 px-1 rounded font-black tracking-tight">Gốc</span>' : ''}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ---------------- NARRATIVE PROSE (短文 / 叙述文) MODULE ----------------
let showNarrativePinyin = true;
let showNarrativeVi = true;
let isNarrativePlaying = false;
let narrativePlayIndex = 0;
let narrativePlayTimeout = null;
let currentNarrativeGender = 'female';

function stopNarrativeSpeech() {
  isNarrativePlaying = false;
  if (narrativePlayTimeout) {
    clearTimeout(narrativePlayTimeout);
    narrativePlayTimeout = null;
  }
  if (currentTtsAudio) {
    try {
      currentTtsAudio.pause();
      currentTtsAudio.currentTime = 0;
    } catch (e) {}
  }
  document.querySelectorAll('.narrative-para-card').forEach(el => {
    el.classList.remove('ring-2', 'ring-[#8B1E1E]', 'bg-amber-100/70', 'shadow-md');
  });
  const playBtnGroup = document.getElementById('narrativePlayBtnGroup');
  const playBtn = document.getElementById('btnPlayAllNarrative');
  const stopBtn = document.getElementById('btnStopNarrative');
  if (playBtnGroup) playBtnGroup.classList.remove('hidden');
  if (playBtn) playBtn.classList.remove('hidden');
  if (stopBtn) stopBtn.classList.add('hidden');
}

function playAllNarrativeText(gender = 'female') {
  if (!currentActiveLesson || !currentActiveLesson.narrative || !currentActiveLesson.narrative.paragraphs || !currentActiveLesson.narrative.paragraphs.length) return;
  stopDialogueSequence();
  stopNarrativeSpeech();
  isNarrativePlaying = true;
  narrativePlayIndex = 0;
  currentNarrativeGender = gender;

  const playBtnGroup = document.getElementById('narrativePlayBtnGroup');
  const playBtn = document.getElementById('btnPlayAllNarrative');
  const stopBtn = document.getElementById('btnStopNarrative');
  if (playBtnGroup) playBtnGroup.classList.add('hidden');
  if (playBtn) playBtn.classList.add('hidden');
  if (stopBtn) stopBtn.classList.remove('hidden');

  playNextNarrativeParagraph();
}

function playNextNarrativeParagraph() {
  if (!isNarrativePlaying || !currentActiveLesson || !currentActiveLesson.narrative || !currentActiveLesson.narrative.paragraphs) return;
  const paras = currentActiveLesson.narrative.paragraphs;
  if (narrativePlayIndex >= paras.length) {
    stopNarrativeSpeech();
    return;
  }

  const p = paras[narrativePlayIndex];
  const cardEl = document.getElementById(`narrativeParaCard-${narrativePlayIndex}`);

  document.querySelectorAll('.narrative-para-card').forEach(el => {
    el.classList.remove('ring-2', 'ring-[#8B1E1E]', 'bg-amber-100/70', 'shadow-md');
  });
  if (cardEl) {
    cardEl.classList.add('ring-2', 'ring-[#8B1E1E]', 'bg-amber-100/70', 'shadow-md');
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const speed = currentTtsSpeed || 0.88;
  const gender = currentNarrativeGender || 'female';
  const ttsUrl = `/api/tts?text=${encodeURIComponent(p.hanzi)}&gender=${gender}&speed=${speed}`;
  const audio = new Audio(ttsUrl);
  currentTtsAudio = audio;

  audio.onended = () => {
    if (!isNarrativePlaying) return;
    narrativePlayIndex++;
    narrativePlayTimeout = setTimeout(playNextNarrativeParagraph, 1200);
  };

  audio.onerror = () => {
    if (!isNarrativePlaying) return;
    narrativePlayIndex++;
    narrativePlayTimeout = setTimeout(playNextNarrativeParagraph, 1000);
  };

  audio.play().catch(err => {
    console.warn('Narrative playback failed in sequence:', err);
    if (isNarrativePlaying) {
      narrativePlayIndex++;
      narrativePlayTimeout = setTimeout(playNextNarrativeParagraph, 1000);
    }
  });
}

function playNarrativeParagraphVoice(idx, gender = 'female') {
  if (!currentActiveLesson || !currentActiveLesson.narrative || !currentActiveLesson.narrative.paragraphs) return;
  const p = currentActiveLesson.narrative.paragraphs[idx];
  if (!p) return;
  stopDialogueSequence();
  stopNarrativeSpeech();

  const cardEl = document.getElementById(`narrativeParaCard-${idx}`);
  if (cardEl) {
    cardEl.classList.add('ring-2', 'ring-[#8B1E1E]', 'bg-amber-100/70');
    setTimeout(() => {
      cardEl.classList.remove('ring-2', 'ring-[#8B1E1E]', 'bg-amber-100/70');
    }, 4500);
  }
  playChineseTTS(p.hanzi, gender);
}

function playNarrativeParagraph(idx) {
  playNarrativeParagraphVoice(idx, 'female');
}

function toggleNarrativePinyin() {
  showNarrativePinyin = !showNarrativePinyin;
  const container = document.getElementById('lessonNarrativeContainer');
  if (container) {
    container.querySelectorAll('.reading-token-chip').forEach(chip => {
      if (showNarrativePinyin) {
        chip.classList.remove('hide-pinyin');
      } else {
        chip.classList.add('hide-pinyin');
      }
    });
  }
  const btnText = document.getElementById('narrativePinyinBtnText');
  if (btnText) btnText.innerText = showNarrativePinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin';
}

function toggleNarrativeTranslation() {
  showNarrativeVi = !showNarrativeVi;
  const container = document.getElementById('lessonNarrativeContainer');
  if (container) {
    container.querySelectorAll('.narrative-vi-block').forEach(el => {
      if (showNarrativeVi) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }
  const btnText = document.getElementById('narrativeViBtnText');
  if (btnText) btnText.innerText = showNarrativeVi ? 'Ẩn Dịch Nghĩa' : 'Hiện Dịch Nghĩa';
}

function toggleNarrativeQA(idx) {
  const ansEl = document.getElementById(`narrativeQAAnswer-${idx}`);
  const btnEl = document.getElementById(`narrativeQABtn-${idx}`);
  if (ansEl) {
    const isHidden = ansEl.classList.contains('hidden');
    ansEl.classList.toggle('hidden', !isHidden);
    if (btnEl) btnEl.innerText = isHidden ? 'Ẩn đáp án' : 'Xem đáp án';
  }
}

function renderLessonNarrative(narrative) {
  const container = document.getElementById('lessonNarrativeContainer');
  if (!container) return;

  if (!narrative || !narrative.paragraphs || narrative.paragraphs.length === 0) {
    container.innerHTML = `<p class="text-xs text-stone-400 py-6 text-center">Chưa có bài đọc đoạn văn cho bài học này.</p>`;
    return;
  }

  // Update header subtitle if title available
  const headerTitle = document.getElementById('narrativeHeaderTitle');
  if (headerTitle && narrative.titleHanzi) {
    headerTitle.innerText = `${narrative.titleHanzi} • ${narrative.titlePinyin} (${narrative.titleVi})`;
  }

  let html = `
    <!-- Narrative Article Header Banner -->
    <div class="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-amber-900/5 via-amber-500/5 to-red-900/10 border border-amber-300/80 shadow-2xs space-y-3">
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-0.5 rounded-full text-2xs font-black bg-red-100 text-[#8B1E1E] border border-red-200">
          Bài Khóa Đoạn Văn (课文二 • 短文)
        </span>
        <span class="text-2xs font-semibold text-stone-500">Giáo Trình Hán Ngữ Chuẩn BLCU</span>
      </div>
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 class="text-xl md:text-2xl font-hanzi font-black text-stone-900 tracking-wide">${narrative.titleHanzi}</h3>
          <p class="text-sm font-bold text-[#8B1E1E] font-sans">${narrative.titlePinyin}</p>
          <p class="text-xs font-semibold text-stone-600 font-sans italic">"${narrative.titleVi}"</p>
        </div>
        <div class="inline-flex items-center gap-1 bg-white/90 p-0.5 rounded-xl border border-amber-300 shadow-2xs">
          <button onclick="playChineseTTS(${jsArg(narrative.titleHanzi)}, 'female')" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer" title="Phát âm tiêu đề giọng Nữ">
            👩 Nữ
          </button>
          <button onclick="playChineseTTS(${jsArg(narrative.titleHanzi)}, 'male')" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer" title="Phát âm tiêu đề giọng Nam">
            👨 Nam
          </button>
        </div>
      </div>
      ${narrative.summary ? `
        <div class="p-3 rounded-2xl bg-white/80 border border-amber-200/70 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5">
          <i data-lucide="info" class="w-4 h-4 text-amber-700 shrink-0 mt-0.5"></i>
          <div><strong class="text-amber-900 font-bold">Tóm tắt nội dung:</strong> ${narrative.summary}</div>
        </div>
      ` : ''}
    </div>

    <!-- Paragraphs Stream with Token-level click-to-lookup -->
    <div class="space-y-4">
  `;

  narrative.paragraphs.forEach((p, idx) => {
    const tokens = p.tokens || [];
    html += `
      <div id="narrativeParaCard-${idx}" class="narrative-para-card p-4 md:p-5 rounded-2xl bg-white border border-amber-200/90 shadow-2xs hover:border-amber-300 transition-all space-y-3">
        <div class="flex items-center justify-between gap-2 border-b border-amber-100 pb-2.5">
          <span class="px-2.5 py-0.5 rounded-lg bg-amber-100/80 text-amber-950 font-black text-xs border border-amber-200">
            Đoạn ${p.paraNum || idx + 1}
          </span>
          <div class="flex items-center gap-1 bg-amber-50/80 p-0.5 rounded-xl border border-amber-200/80 shadow-2xs">
            <button 
              onclick="playNarrativeParagraphVoice(${idx}, 'female')" 
              class="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 shadow-2xs"
              title="Nghe đoạn này bằng giọng Nữ (Xiaoxiao)">
              <span>👩 Nữ</span>
            </button>
            <button 
              onclick="playNarrativeParagraphVoice(${idx}, 'male')" 
              class="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 shadow-2xs"
              title="Nghe đoạn này bằng giọng Nam (Yunxi)">
              <span>👨 Nam</span>
            </button>
          </div>
        </div>

        <!-- Tokens Stream -->
        <div class="flex flex-wrap items-end leading-loose">
    `;

    tokens.forEach(tok => {
      const isPunct = !tok.pinyin && !tok.vi;
      if (isPunct) {
        html += `<span class="reading-token-punct">${tok.hanzi}</span>`;
      } else {
        html += `
          <div 
            onclick="openWordModalWithToken(${jsArg(tok.hanzi)}, ${jsArg(tok.pinyin)}, ${jsArg(tok.vi)})" 
            class="reading-token-chip ${showNarrativePinyin ? '' : 'hide-pinyin'}"
            title="Bấm để tra cứu: ${tok.hanzi} (${tok.pinyin}): ${tok.vi}">
            <span class="token-pinyin">${tok.pinyin}</span>
            <span class="token-hanzi">${tok.hanzi}</span>
          </div>
        `;
      }
    });

    html += `
        </div>

        <!-- Vietnamese Translation -->
        <div class="narrative-vi-block pt-3 border-t border-amber-100 text-xs md:text-sm text-stone-700 leading-relaxed font-sans ${showNarrativeVi ? '' : 'hidden'}">
          <strong class="text-[#8B1E1E] font-bold">Dịch nghĩa:</strong> ${p.vi}
        </div>
      </div>
    `;
  });

  html += `</div>`;

  // Comprehension Questions Section if present
  if (narrative.comprehensionCheck && narrative.comprehensionCheck.length > 0) {
    html += `
      <div class="mt-6 p-5 md:p-6 rounded-3xl bg-white border border-amber-200/90 shadow-2xs space-y-4">
        <div class="flex items-center gap-2 border-b border-amber-200/60 pb-3">
          <span class="p-1.5 rounded-lg bg-red-100 text-[#8B1E1E]">
            <i data-lucide="help-circle" class="w-4 h-4"></i>
          </span>
          <h4 class="text-sm font-bold text-stone-900">Câu Hỏi Đọc Hiểu & Thảo Luận Bài Khóa (阅读理解思考题)</h4>
        </div>
        <div class="space-y-3">
    `;

    narrative.comprehensionCheck.forEach((qa, qIdx) => {
      html += `
        <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-2">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="font-hanzi font-bold text-stone-900 text-sm md:text-base">${qIdx + 1}. ${qa.qHanzi}</p>
                <div class="inline-flex items-center gap-0.5">
                  <button type="button" onclick="playChineseTTS(${jsArg(qa.qHanzi)}, 'female')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Nghe câu hỏi giọng Nữ">👩</button>
                  <button type="button" onclick="playChineseTTS(${jsArg(qa.qHanzi)}, 'male')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Nghe câu hỏi giọng Nam">👨</button>
                </div>
              </div>
              <p class="text-xs font-medium text-[#8B1E1E]">${qa.qPinyin}</p>
              <p class="text-xs text-stone-600 italic font-sans">${qa.qVi}</p>
            </div>
            <button 
              id="narrativeQABtn-${qIdx}"
              onclick="toggleNarrativeQA(${qIdx})" 
              class="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-700 border border-amber-200 text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs">
              Xem đáp án
            </button>
          </div>
          <div id="narrativeQAAnswer-${qIdx}" class="hidden pt-2.5 mt-2 border-t border-amber-200/60 text-xs text-stone-800 space-y-1">
            <div class="flex items-center justify-between gap-2">
              <p class="font-hanzi font-bold text-emerald-800"><span class="text-stone-500 font-sans font-normal">Đáp án: </span>${qa.aHanzi}</p>
              <div class="inline-flex items-center gap-0.5">
                <button type="button" onclick="playChineseTTS(${jsArg(qa.aHanzi)}, 'female')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Nghe đáp án giọng Nữ">👩</button>
                <button type="button" onclick="playChineseTTS(${jsArg(qa.aHanzi)}, 'male')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Nghe đáp án giọng Nam">👨</button>
              </div>
            </div>
            <p class="text-stone-600 font-sans italic">${qa.aVi}</p>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
  const modal = document.getElementById('lessonDetailModal');
  if (modal) refreshIcons(modal);
}

// ---------------- VOCABULARY MODULE ----------------
function renderLessonVocabulary(vocabList) {
  const container = document.getElementById('lessonVocabularyContainer');
  if (!container) return;

  if (!vocabList || vocabList.length === 0) {
    container.innerHTML = `<p class="col-span-full text-xs text-stone-400 py-4 text-center">Chưa có danh sách từ vựng.</p>`;
    return;
  }

  container.innerHTML = vocabList.map(v => {
    const isSaved = isWordSaved(v.hanzi);

    return `
      <div class="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-all space-y-2.5 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-baseline gap-2 flex-wrap">
              <span onclick="openWritingModal(${jsArg(v.hanzi)}, ${jsArg(v.pinyin)}, ${jsArg(v.meaning)})" class="font-hanzi text-2xl font-black text-stone-900 tracking-wide cursor-pointer hover:text-[#8B1E1E] transition-colors" title="Nhấn vào chữ để xem và tập viết nét">${v.hanzi}</span>
              <span class="text-xs font-bold text-[#8B1E1E]">${v.pinyin}</span>
              ${v.sinoViet ? `<span class="text-[11px] font-semibold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md">Hán-Việt: ${v.sinoViet}</span>` : ''}
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <div class="flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
                <button 
                  onclick="playChineseTTS(${jsArg(v.hanzi)}, 'female')" 
                  class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 transition-all text-xs font-bold cursor-pointer"
                  title="Nghe từ này (Giọng Nữ)">
                  👩 Nữ
                </button>
                <button 
                  onclick="playChineseTTS(${jsArg(v.hanzi)}, 'male')" 
                  class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 transition-all text-xs font-bold cursor-pointer"
                  title="Nghe từ này (Giọng Nam)">
                  👨 Nam
                </button>
              </div>
              <button 
                onclick="openWritingModal(${jsArg(v.hanzi)}, ${jsArg(v.pinyin)}, ${jsArg(v.meaning)})" 
                class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                title="Luyện viết nét chữ này">
                <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
              </button>
              <button 
                id="btnSaveVocab-${escapeHtml(v.hanzi)}"
                onclick="toggleSaveWordFromLesson(${jsArg(v.hanzi)}, ${jsArg(v.pinyin)}, ${jsArg(v.meaning)})" 
                class="p-1.5 rounded-lg ${isSaved ? 'bg-amber-500 text-white border-amber-500' : 'bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-amber-600 border-stone-200'} border transition-all cursor-pointer"
                title="${isSaved ? 'Đã lưu trong Sổ tay' : 'Lưu vào Sổ tay'}">
                <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">${v.pos || 'Từ vựng'}</span>
            <p class="text-xs font-semibold text-stone-800">${v.meaning}</p>
          </div>

          ${v.example ? `
            <div class="p-2.5 rounded-xl bg-amber-50/40 border border-amber-200/50 text-xs space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Ví dụ ứng dụng:</span>
                <div class="flex items-center gap-1">
                  <button onclick="playChineseTTS(${jsArg(v.example)}, 'female')" class="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-[10px] font-bold transition-all cursor-pointer" title="Nghe ví dụ (Giọng Nữ)">
                    👩 Nữ
                  </button>
                  <button onclick="playChineseTTS(${jsArg(v.example)}, 'male')" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-[10px] font-bold transition-all cursor-pointer" title="Nghe ví dụ (Giọng Nam)">
                    👨 Nam
                  </button>
                </div>
              </div>
              <p class="font-hanzi font-bold text-stone-900 text-xs">${v.example}</p>
            </div>
          ` : ''}
        </div>

        <div class="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
          <button onclick="openWritingModal(${jsArg(v.hanzi)}, ${jsArg(v.pinyin)}, ${jsArg(v.meaning)})" class="text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1 font-bold cursor-pointer">
            <i data-lucide="pen-tool" class="w-3 h-3"></i>
            Tập viết nét
          </button>
          <button onclick="quickSearchFromLesson(${jsArg(v.hanzi)})" class="text-[#8B1E1E] hover:underline flex items-center gap-1 font-medium cursor-pointer">
            <i data-lucide="search" class="w-3 h-3"></i>
            Chiết tự chữ
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ---------------- GRAMMAR MODULE ----------------
function renderLessonGrammar(grammarList) {
  const container = document.getElementById('lessonGrammarContainer');
  if (!container) return;

  if (!grammarList || grammarList.length === 0) {
    container.innerHTML = `<p class="text-xs text-stone-400 py-4 text-center">Chưa có điểm ngữ pháp nào được ghi chú.</p>`;
    return;
  }

  container.innerHTML = grammarList.map((g, idx) => `
    <div class="p-5 md:p-6 rounded-2xl bg-white border border-purple-200/90 shadow-2xs space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <span class="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#4A306D] to-[#613D8F] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            ${idx + 1}
          </span>
          <h4 class="text-base font-bold text-stone-900 tracking-tight">${g.title}</h4>
        </div>
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-800 border border-purple-200">
          Trọng Điểm Ngữ Pháp
        </span>
      </div>

      <!-- Formula Pill Box -->
      ${g.formula ? `
        <div class="p-3.5 rounded-xl bg-gradient-to-r from-purple-50 via-amber-50/40 to-purple-50/20 border border-purple-200 text-xs space-y-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
            <i data-lucide="cpu" class="w-3.5 h-3.5 text-[#4A306D]"></i>
            Công thức ngữ pháp toán học hóa:
          </span>
          <p class="font-mono font-bold text-stone-900 text-xs md:text-sm tracking-wide">${g.formula}</p>
        </div>
      ` : ''}

      <!-- Detailed Explanation -->
      <div class="text-xs text-stone-700 leading-relaxed space-y-1.5 font-sans">
        <span class="font-bold text-stone-900 block">Bản chất ngữ pháp:</span>
        <p class="bg-stone-50 p-3 rounded-xl border border-stone-200/80">${g.explanation}</p>
      </div>

      <!-- Vietnamese Contrast & Common Mistakes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        ${g.vietnameseContrast ? `
          <div class="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1">
            <span class="font-bold text-blue-900 flex items-center gap-1.5 text-[11px]">
              <i data-lucide="repeat" class="w-3.5 h-3.5 text-blue-700"></i>
              Đối chiếu với Ngữ pháp Tiếng Việt:
            </span>
            <p class="text-stone-700 leading-relaxed">${g.vietnameseContrast}</p>
          </div>
        ` : ''}
        ${g.commonMistakes ? `
          <div class="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-1">
            <span class="font-bold text-rose-900 flex items-center gap-1.5 text-[11px]">
              <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-rose-700"></i>
              Lỗi sai người Việt hay mắc phải:
            </span>
            <p class="text-stone-700 leading-relaxed">${g.commonMistakes}</p>
          </div>
        ` : ''}
      </div>

      <!-- Examples -->
      ${g.examples && g.examples.length ? `
        <div class="space-y-2 pt-2 border-t border-purple-100">
          <span class="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">Câu ví dụ kinh điển:</span>
          <div class="space-y-2">
            ${g.examples.map(ex => {
              return `
                <div class="p-3 rounded-xl bg-purple-50/30 border border-purple-100 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p class="font-hanzi font-bold text-stone-900 text-sm">${ex.hanzi}</p>
                    <p class="text-stone-500 font-semibold">${ex.pinyin}</p>
                    <p class="text-stone-700 italic">${ex.vi}</p>
                  </div>
                  <div class="inline-flex items-center gap-0.5 shrink-0 bg-white p-0.5 rounded-lg border border-purple-200">
                    <button onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'female')" class="px-1.5 py-0.5 rounded hover:bg-rose-50 text-rose-800 text-[10px] font-bold cursor-pointer" title="Nghe giọng Nữ">👩</button>
                    <button onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'male')" class="px-1.5 py-0.5 rounded hover:bg-purple-50 text-purple-800 text-[10px] font-bold cursor-pointer" title="Nghe giọng Nam">👨</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// ---------------- COMPREHENSION Q&A MODULE (HỎI - ĐÁP BÀI KHÓA) ----------------
function renderLessonQA(qaList) {
  const container = document.getElementById('lessonQAContainer');
  if (!container) return;

  if (!qaList || qaList.length === 0) {
    container.innerHTML = `<p class="text-xs text-stone-400 py-4 text-center">Chưa có câu hỏi đọc hiểu cho bài này.</p>`;
    return;
  }

  container.innerHTML = qaList.map((q, idx) => {

    return `
      <div class="p-5 md:p-6 rounded-2xl bg-white border border-amber-200/90 shadow-2xs space-y-3.5">
        <!-- Question Row -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <span class="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#8B1E1E] to-[#B8860B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              Q${idx + 1}
            </span>
            <div class="space-y-1">
              <h4 class="font-hanzi font-bold text-stone-900 text-base md:text-lg leading-snug">${q.questionHanzi}</h4>
              <p class="text-xs text-[#8B1E1E] font-semibold">${q.questionPinyin}</p>
              <p class="text-xs text-stone-600 italic">${q.questionVi}</p>
            </div>
          </div>
          <div class="inline-flex items-center gap-1 bg-amber-50/80 p-0.5 rounded-xl border border-amber-200 shrink-0 shadow-2xs">
            <button 
              onclick="playChineseTTS(${jsArg(q.questionHanzi)}, 'female')" 
              class="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
              title="Nghe câu hỏi giọng Nữ">
              👩 Nữ
            </button>
            <button 
              onclick="playChineseTTS(${jsArg(q.questionHanzi)}, 'male')" 
              class="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
              title="Nghe câu hỏi giọng Nam">
              👨 Nam
            </button>
          </div>
        </div>

        <!-- Answer Toggle Button -->
        <div class="pt-2 border-t border-amber-100 flex items-center justify-between">
          <button 
            onclick="toggleLessonQAAnswer(${idx})" 
            id="btnToggleQA-${idx}" 
            class="px-3.5 py-1.5 rounded-xl bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="help-circle" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
            <span>Xem Gợi Ý Đáp Án</span>
          </button>
          <span class="text-[11px] text-stone-400">Trả lời chuẩn ngữ pháp bài khóa</span>
        </div>

        <!-- Answer Box (Initially Hidden) -->
        <div id="lessonQABox-${idx}" class="hidden p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <span class="font-black text-emerald-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-600"></i>
                Câu Trả Lời Gợi Ý:
              </span>
              <p class="font-hanzi font-bold text-stone-900 text-sm md:text-base">${q.answerHanzi}</p>
              <p class="text-emerald-800 font-semibold">${q.answerPinyin}</p>
              <p class="text-stone-700 italic">${q.answerVi}</p>
            </div>
            <div class="inline-flex items-center gap-1 bg-white/90 p-0.5 rounded-xl border border-emerald-300 shrink-0 shadow-2xs">
              <button 
                onclick="playChineseTTS(${jsArg(q.answerHanzi)}, 'female')" 
                class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-rose-50 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
                title="Nghe câu trả lời giọng Nữ">
                👩 Nữ
              </button>
              <button 
                onclick="playChineseTTS(${jsArg(q.answerHanzi)}, 'male')" 
                class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
                title="Nghe câu trả lời giọng Nam">
                👨 Nam
              </button>
            </div>
          </div>
          ${q.explanation ? `
            <div class="pt-2 border-t border-emerald-200/70 text-stone-600 leading-relaxed">
              <strong>Phân tích ngữ cảnh:</strong> ${q.explanation}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function toggleLessonQAAnswer(idx) {
  const box = document.getElementById(`lessonQABox-${idx}`);
  const btn = document.getElementById(`btnToggleQA-${idx}`);
  if (!box) return;

  if (box.classList.contains('hidden')) {
    box.classList.remove('hidden');
    if (btn) btn.innerHTML = `<i data-lucide="eye-off" class="w-3.5 h-3.5 text-[#8B1E1E]"></i><span>Ẩn Đáp Án</span>`;
  } else {
    box.classList.add('hidden');
    if (btn) btn.innerHTML = `<i data-lucide="help-circle" class="w-3.5 h-3.5 text-[#8B1E1E]"></i><span>Xem Gợi Ý Đáp Án</span>`;
  }
  refreshIcons(box.parentElement);
}

// ---------------- FILL IN THE BLANKS MODULE (LUYỆN TẬP ĐIỀN TỪ) ----------------
function renderLessonFillInBlanks(fibList) {
  const container = document.getElementById('lessonFillBlanksContainer');
  const tracker = document.getElementById('lessonFIBScoreTracker');
  if (!container) return;

  if (!fibList || fibList.length === 0) {
    container.innerHTML = `<p class="text-xs text-stone-400 py-4 text-center">Chưa có bài tập điền từ cho bài này.</p>`;
    if (tracker) tracker.innerText = 'Không có bài tập';
    return;
  }

  if (tracker) tracker.innerText = `0 / ${fibList.length} Bài hoàn thành`;

  container.innerHTML = fibList.map((fib, fibIdx) => `
    <div class="p-5 md:p-6 rounded-2xl bg-white border border-amber-200/90 shadow-2xs space-y-4" id="fibExerciseCard-${fibIdx}">
      <!-- Exercise Header -->
      <div class="flex items-start gap-3">
        <span class="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#8B1E1E] to-[#B8860B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
          ${fibIdx + 1}
        </span>
        <div>
          <h4 class="text-sm md:text-base font-bold text-stone-900">${fib.instruction}</h4>
          <p class="text-xs text-stone-500 mt-0.5">Dựa vào ngữ cảnh đoạn đối thoại để chọn từ ngữ phù hợp nhất</p>
        </div>
      </div>

      <!-- Word Bank Box -->
      ${fib.wordBank && fib.wordBank.length ? `
        <div class="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5 text-xs">
          <span class="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
            <i data-lucide="layers" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
            Ngân hàng từ vựng gợi ý (Word Bank):
          </span>
          <div class="flex flex-wrap gap-2 pt-0.5">
            ${fib.wordBank.map(w => `
              <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-stone-900 font-hanzi font-bold text-xs shadow-2xs">
                ${w}
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Context Dialogue with Blanks -->
      <div class="p-4 rounded-xl bg-stone-50 border border-stone-200 font-sans text-xs md:text-sm text-stone-800 leading-loose whitespace-pre-line font-medium">
        ${fib.dialogueText}
      </div>

      <!-- Blanks Selection Interface -->
      <div class="space-y-3 pt-2">
        ${fib.blanks.map((b, bIdx) => `
          <div class="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2">
            <span class="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-md bg-[#8B1E1E] text-white text-[11px] font-bold flex items-center justify-center">(${b.blankNum})</span>
              Chọn từ điền vào vị trí [ (${b.blankNum}) ]:
            </span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              ${b.options.map(opt => `
                <button 
                  id="fibBtn-${fibIdx}-${b.blankNum}-${opt}"
                  onclick="selectFIBOption(${fibIdx}, ${b.blankNum}, ${jsArg(opt)})"
                  class="fib-opt-btn p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-xs font-bold font-hanzi text-stone-800 transition-all text-center cursor-pointer">
                  ${opt}
                </button>
              `).join('')}
            </div>
            <div id="fibExplanation-${fibIdx}-${b.blankNum}" class="hidden p-3 rounded-lg text-xs leading-relaxed mt-2 border"></div>
          </div>
        `).join('')}
      </div>

      <!-- Submit & Reset Actions -->
      <div class="pt-2 flex items-center justify-between">
        <button 
          onclick="checkFIBAnswers(${fibIdx})" 
          class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="check" class="w-4 h-4"></i>
          <span>Kiểm Tra Đáp Án</span>
        </button>
        <button 
          onclick="resetFIBExercise(${fibIdx})" 
          class="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-all cursor-pointer">
          Làm lại
        </button>
      </div>
    </div>
  `).join('');
}

function selectFIBOption(fibIdx, blankNum, optText) {
  if (!currentLessonFIBSelections[fibIdx]) {
    currentLessonFIBSelections[fibIdx] = {};
  }
  currentLessonFIBSelections[fibIdx][blankNum] = optText;

  // Clear active styling on sibling option buttons for this blank
  const exercise = currentActiveLesson.fillInBlanks[fibIdx];
  const blank = exercise.blanks.find(b => b.blankNum === blankNum);
  if (blank) {
    blank.options.forEach(opt => {
      const btn = document.getElementById(`fibBtn-${fibIdx}-${blankNum}-${opt}`);
      if (btn) {
        if (opt === optText) {
          btn.className = 'fib-opt-btn p-2.5 rounded-xl border-2 border-[#8B1E1E] bg-amber-50 text-xs font-bold font-hanzi text-[#8B1E1E] transition-all text-center shadow-2xs';
        } else {
          btn.className = 'fib-opt-btn p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-xs font-bold font-hanzi text-stone-800 transition-all text-center cursor-pointer';
        }
      }
    });
  }
}

function checkFIBAnswers(fibIdx) {
  if (!currentActiveLesson || !currentActiveLesson.fillInBlanks) return;
  const fib = currentActiveLesson.fillInBlanks[fibIdx];
  if (!fib) return;

  const userSelections = currentLessonFIBSelections[fibIdx] || {};
  let correctCount = 0;

  fib.blanks.forEach(b => {
    const userVal = userSelections[b.blankNum];
    const isCorrect = (userVal === b.correct);
    const explainBox = document.getElementById(`fibExplanation-${fibIdx}-${b.blankNum}`);

    b.options.forEach(opt => {
      const btn = document.getElementById(`fibBtn-${fibIdx}-${b.blankNum}-${opt}`);
      if (!btn) return;

      if (opt === b.correct) {
        btn.className = 'fib-opt-btn p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-xs font-bold font-hanzi text-emerald-950 transition-all text-center';
      } else if (opt === userVal && !isCorrect) {
        btn.className = 'fib-opt-btn p-2.5 rounded-xl border-2 border-rose-500 bg-rose-50 text-xs font-bold font-hanzi text-rose-950 transition-all text-center';
      } else {
        btn.className = 'fib-opt-btn p-2.5 rounded-xl border border-stone-200 text-xs font-bold font-hanzi text-stone-400 transition-all text-center opacity-60';
      }
    });

    if (explainBox) {
      explainBox.classList.remove('hidden');
      if (isCorrect) {
        correctCount++;
        explainBox.className = 'p-3 rounded-lg text-xs leading-relaxed mt-2 border border-emerald-300 bg-emerald-50/80 text-emerald-950 space-y-1';
        explainBox.innerHTML = `
          <span class="font-bold text-emerald-900 flex items-center gap-1.5">
            <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-600"></i>
            Vị trí (${b.blankNum}) chính xác!
          </span>
          <p>${b.explanation}</p>
        `;
      } else {
        explainBox.className = 'p-3 rounded-lg text-xs leading-relaxed mt-2 border border-rose-300 bg-rose-50/80 text-rose-950 space-y-1';
        explainBox.innerHTML = `
          <span class="font-bold text-rose-900 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-rose-600"></i>
            Vị trí (${b.blankNum}) chưa đúng! Từ chính xác là: <strong>${b.correct}</strong>
          </span>
          <p>${b.explanation}</p>
        `;
      }
      refreshIcons(explainBox);
    }
  });

  const tracker = document.getElementById('lessonFIBScoreTracker');
  if (tracker) {
    if (correctCount === fib.blanks.length) {
      tracker.className = 'text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full';
      tracker.innerText = `Đạt điểm tối đa: ${correctCount}/${fib.blanks.length} chỗ đúng`;
    } else {
      tracker.className = 'text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full';
      tracker.innerText = `Đúng ${correctCount}/${fib.blanks.length} chỗ`;
    }
  }
}

function resetFIBExercise(fibIdx) {
  if (currentLessonFIBSelections[fibIdx]) {
    delete currentLessonFIBSelections[fibIdx];
  }
  const fib = currentActiveLesson.fillInBlanks[fibIdx];
  if (!fib) return;

  fib.blanks.forEach(b => {
    b.options.forEach(opt => {
      const btn = document.getElementById(`fibBtn-${fibIdx}-${b.blankNum}-${opt}`);
      if (btn) {
        btn.className = 'fib-opt-btn p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-xs font-bold font-hanzi text-stone-800 transition-all text-center cursor-pointer';
      }
    });
    const explainBox = document.getElementById(`fibExplanation-${fibIdx}-${b.blankNum}`);
    if (explainBox) {
      explainBox.classList.add('hidden');
      explainBox.innerHTML = '';
    }
  });

  const tracker = document.getElementById('lessonFIBScoreTracker');
  if (tracker) {
    tracker.className = 'text-xs font-bold text-[#8B1E1E] bg-red-50 border border-red-200 px-3 py-1 rounded-full';
    tracker.innerText = 'Chưa làm bài';
  }
}

// ---------------- CULTURE & TIPS MODULE ----------------
function renderLessonCulture(lesson) {
  const container = document.getElementById('lessonCultureContainer');
  if (!container) return;

  container.innerHTML = `
    <!-- Introduction Card -->
    <div class="p-6 rounded-2xl bg-white border border-amber-200/90 shadow-2xs space-y-3">
      <div class="flex items-center gap-2">
        <span class="p-2 rounded-xl bg-amber-100 text-amber-900">
          <i data-lucide="info" class="w-5 h-5 text-[#8B1E1E]"></i>
        </span>
        <h4 class="text-base font-bold text-stone-900">Giới Thiệu & Bối Cảnh Bài Học</h4>
      </div>
      <p class="text-xs md:text-sm text-stone-700 leading-relaxed font-sans bg-amber-50/40 p-4 rounded-xl border border-amber-200/60">
        ${lesson.introduction || 'Bài học trang bị tri thức nền tảng trong bộ Giáo Trình Hán Ngữ.'}
      </p>
    </div>

    <!-- Cultural Insights & Learning Tips -->
    <div class="p-6 rounded-2xl bg-gradient-to-r from-amber-50/60 via-[#FAF7F2] to-amber-100/40 border border-amber-300/80 shadow-2xs space-y-3">
      <div class="flex items-center gap-2">
        <span class="p-2 rounded-xl bg-[#8B1E1E] text-white">
          <i data-lucide="sparkles" class="w-5 h-5"></i>
        </span>
        <h4 class="text-base font-bold text-stone-900">Ghi Chú Văn Hóa & Mẹo Học Chuẩn Bản Xứ</h4>
      </div>
      <p class="text-xs md:text-sm text-stone-800 leading-relaxed font-sans bg-white/90 p-4 rounded-xl border border-amber-200/80">
        ${lesson.culturalTips || 'Hãy luyện nói to rõ từng câu, bắt chước khẩu hình người bản xứ và vận dụng ngay vào thực tế.'}
      </p>
    </div>
  `;
}
