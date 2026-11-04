// =========================================================================
// TAB: LUYỆN DỊCH HSK THỰC CHIẾN (CÂU ĐƠN ➔ CÂU PHỨC ➔ ĐOẠN VĂN ĐỜI THƯỜNG ➔ VIẾT LUẬN)
// =========================================================================

let currentTransLevel = 1; // 1, 2, 3, 4, 5, 6
let currentTransDifficulty = 'all'; // 'all', 'simple', 'complex', 'paragraph_daily', 'paragraph_essay'
let currentTransLesson = 1;
let currentTransQuestionIdx = 0;
let transEvaluationResults = {};
let showWordBank = false;

const TRANS_DIFFICULTY_META = {
  all: { label: 'Tất Cả', icon: '🌟', badgeCls: 'bg-stone-100 text-stone-800 border-stone-200' },
  simple: { label: 'Câu Đơn Cơ Bản', icon: '🟢', badgeCls: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  complex: { label: 'Câu Phức Liên Từ', icon: '🟡', badgeCls: 'bg-amber-100 text-amber-900 border-amber-300' },
  paragraph_daily: { label: 'Đoạn Văn Đời Thường', icon: '🟠', badgeCls: 'bg-orange-100 text-orange-900 border-orange-300' },
  paragraph_essay: { label: 'Đoạn Văn Viết Luận (HSK 5-6)', icon: '🔴', badgeCls: 'bg-rose-100 text-rose-900 border-rose-300' }
};

// ---------------- DIFFICULTY & LEVEL FILTERING ----------------

function updateDifficultyButtonsUI() {
  const diffs = ['all', 'simple', 'complex', 'paragraph_daily', 'paragraph_essay'];
  diffs.forEach(d => {
    const btn = document.getElementById(`btn-trans-diff-${d}`);
    if (btn) {
      if (d === currentTransDifficulty) {
        btn.className = 'px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-xs transition-all whitespace-nowrap cursor-pointer';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl text-stone-700 hover:text-[#8B1E1E] transition-all whitespace-nowrap cursor-pointer';
      }
    }
  });
}

function updateLevelButtonsUI() {
  for (let i = 1; i <= 6; i++) {
    const btn = document.getElementById(`btn-trans-lvl-${i}`);
    if (btn) {
      if (i === currentTransLevel) {
        btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-xs transition-all whitespace-nowrap cursor-pointer';
      } else {
        btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap cursor-pointer';
      }
    }
  }
}

function filterTransDifficulty(diff) {
  currentTransDifficulty = diff;
  currentTransQuestionIdx = 0;
  updateDifficultyButtonsUI();

  // If selecting essay, automatically jump to HSK 5 if currently in HSK 1-3
  if (diff === 'paragraph_essay' && currentTransLevel < 5) {
    currentTransLevel = 5;
    updateLevelButtonsUI();
  } else if (diff === 'paragraph_daily' && currentTransLevel < 4) {
    currentTransLevel = 4;
    updateLevelButtonsUI();
  }

  // Update available lessons for this level & difficulty
  const pool = getFilteredLessonPool();
  const availableLessons = Array.from(new Set(pool.map(l => l.lesson))).sort((a, b) => a - b);
  currentTransLesson = availableLessons[0] || 1;

  renderTranslationLessonList();
  renderTranslationStage();
}

function filterTransLevel(lvl) {
  currentTransLevel = lvl;
  currentTransQuestionIdx = 0;
  updateLevelButtonsUI();

  // Update available lessons
  const pool = getFilteredLessonPool();
  const availableLessons = Array.from(new Set(pool.map(l => l.lesson))).sort((a, b) => a - b);
  currentTransLesson = availableLessons[0] || (lvl === 1 ? 1 : (lvl === 4 ? 41 : (lvl === 5 ? 51 : (lvl === 6 ? 64 : 1))));

  renderTranslationLessonList();
  renderTranslationStage();
}

function selectTransLesson(lessonNum) {
  currentTransLesson = lessonNum;
  currentTransQuestionIdx = 0;
  renderTranslationLessonList();
  renderTranslationStage();
}

function getFilteredLessonPool() {
  if (!Array.isArray(lessonsData)) return [];
  return lessonsData.filter(l => {
    const matchLevel = Number(l.level) === Number(currentTransLevel);
    const matchDiff = currentTransDifficulty === 'all' || l.type === currentTransDifficulty;
    return matchLevel && matchDiff;
  });
}

function renderTranslationLessonList() {
  const container = document.getElementById('transLessonListContainer');
  if (!container) return;

  const pool = getFilteredLessonPool();
  const lessonsSet = Array.from(new Set(pool.map(l => l.lesson))).sort((a, b) => a - b);

  if (!lessonsSet.length) {
    container.innerHTML = `
      <span class="text-xs text-stone-400 italic">Cấp HSK ${currentTransLevel} chưa có mục này. Hãy chọn cấp khác hoặc "Tất Cả".</span>
    `;
    return;
  }

  container.innerHTML = lessonsSet.map(num => {
    const countInLesson = pool.filter(l => l.lesson === num).length;
    return `
      <button 
        type="button"
        onclick="selectTransLesson(${num})"
        class="px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
          num === currentTransLesson
            ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-xs scale-105'
            : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200'
        }">
        <span>Bài ${num}</span>
        <span class="text-[10px] px-1.5 py-0.2 rounded-full ${num === currentTransLesson ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}">${countInLesson}</span>
      </button>
    `;
  }).join('');
}

function getTransQuestions() {
  const pool = getFilteredLessonPool();
  if (!pool.length) return [];
  if (currentTransLesson) {
    const lessonMatches = pool.filter(l => l.lesson === currentTransLesson);
    if (lessonMatches.length) return lessonMatches;
  }
  return pool;
}

// ---------------- INTERACTIVE ACTIONS & SCORING ----------------

function toggleWordBank() {
  showWordBank = !showWordBank;
  const bankElem = document.getElementById('transWordBankBox');
  if (bankElem) {
    bankElem.classList.toggle('hidden', !showWordBank);
  }
}

function insertTransWord(word) {
  const input = document.getElementById('transUserInput');
  if (!input) return;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  input.value = input.value.substring(0, start) + word + input.value.substring(end);
  input.focus();
  input.setSelectionRange(start + word.length, start + word.length);
}

function evaluateTranslation() {
  const input = document.getElementById('transUserInput');
  const userText = (input ? input.value : '').trim();
  const questions = getTransQuestions();
  const q = questions[currentTransQuestionIdx];
  if (!q) return;

  if (!userText) {
    showToast('Vui lòng nhập câu dịch của bạn trước khi chấm điểm!', 'warning');
    return;
  }

  const stripPunct = (s) => (s || '').replace(/[。，！？,.!?、“”"':：;\s\n\r]/g, '').trim().toLowerCase();
  const normUser = stripPunct(userText);
  const normTarget = stripPunct(q.hanzi);

  const removeTones = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const userPinyin = removeTones(userText);
  const targetPinyin = removeTones(q.pinyin);

  let score = 7.0;
  let isCorrect = false;
  let feedback = '';

  const isParagraph = q.type === 'paragraph_daily' || q.type === 'paragraph_essay' || q.hanzi.length > 50;

  if (normUser === normTarget) {
    score = 10;
    isCorrect = true;
    feedback = isParagraph 
      ? '🎉 Xuất sắc! Bạn đã dịch trọn vẹn cả đoạn văn với câu từ chuẩn xác 100% chuẩn phong cách Hanban.' 
      : '🎉 Xuất sắc! Dịch chính xác 100% chuẩn ngữ pháp và văn bản.';
  } else if (userPinyin.length > 10 && userPinyin === targetPinyin) {
    score = 9.8;
    isCorrect = true;
    feedback = '✨ Rất tốt! Bạn đã gõ đúng toàn bộ phiên âm Pinyin của đoạn văn.';
  } else {
    // Check keyword matching and grammar connectors
    const words = q.words || [];
    let matchedKeywords = 0;
    words.forEach(w => {
      if (normUser.includes(stripPunct(w.title))) {
        matchedKeywords++;
      }
    });

    const ratio = words.length > 0 ? (matchedKeywords / words.length) : 0;

    // Detect formal connectors for essays
    const connectors = ['不可否认', '然而', '虽然', '但是', '不仅', '而且', '绝不能', '而是', '应当', '只有', '才能', '只要', '总而言之', '由此可见', '事实上', '无论', '可持续发展'];
    let connectorHits = 0;
    connectors.forEach(c => {
      if (q.hanzi.includes(c) && normUser.includes(c)) connectorHits++;
    });

    if (ratio >= 0.8 || (ratio >= 0.65 && connectorHits >= 2)) {
      score = 9.0;
      isCorrect = true;
      feedback = isParagraph 
        ? '🏆 Rất tốt! Đoạn văn đạt độ hoàn thiện cao, sử dụng đúng các từ vựng then chốt và liên từ chuyển tiếp ý.' 
        : '👍 Rất tốt! Bạn đã nắm vững các từ vựng then chốt. Hãy đối chiếu chi tiết với câu mẫu bên dưới.';
    } else if (ratio >= 0.5) {
      score = 8.0;
      isCorrect = true;
      feedback = isParagraph 
        ? '💡 Khá tốt! Bạn đã chuyển tải được ý chính của đoạn văn. Hãy xem phân tích để cải thiện thêm trật tự từ.' 
        : '💡 Khá tốt! Câu dịch đã truyền tải được một phần nội dung. Hãy xem phân tích ngữ pháp để hoàn thiện trật tự từ.';
    } else if (ratio >= 0.25) {
      score = 6.8;
      isCorrect = false;
      feedback = '⚠️ Chưa chính xác hoàn toàn. Đã xuất hiện một số từ khóa, hãy xem câu mẫu bên dưới để học cách nối câu mạch lạc.';
    } else {
      score = 5.5;
      isCorrect = false;
      feedback = '⚠️ Chưa đạt yêu cầu. Đừng nản lòng, hãy xem đối chiếu bản dịch chuẩn và danh sách từ vựng bên dưới.';
    }
  }

  transEvaluationResults[q.id] = {
    isEvaluated: true,
    isRevealed: true,
    userText: userText,
    score: score,
    isCorrect: isCorrect,
    feedback: feedback
  };

  if (typeof addExp === 'function') {
    addExp(Math.round(score * 2) + 3, 'Luyện dịch câu/đoạn văn tiếng Trung');
  }

  renderTranslationStage();
}

function revealTranslation() {
  const questions = getTransQuestions();
  const q = questions[currentTransQuestionIdx];
  if (!q) return;

  transEvaluationResults[q.id] = {
    isEvaluated: false,
    isRevealed: true,
    userText: '',
    score: null,
    isCorrect: null,
    feedback: '💡 Đang hiển thị bản dịch mẫu và phân tích cú pháp chi tiết để bạn đối chiếu học hỏi.'
  };

  renderTranslationStage();
}

function nextTransQuestion() {
  const questions = getTransQuestions();
  if (currentTransQuestionIdx < questions.length - 1) {
    currentTransQuestionIdx++;
    renderTranslationStage();
  }
}

function prevTransQuestion() {
  if (currentTransQuestionIdx > 0) {
    currentTransQuestionIdx--;
    renderTranslationStage();
  }
}

// ---------------- STAGE RENDERING ----------------

function renderTranslationStage() {
  const container = document.getElementById('translationStageContainer');
  if (!container) return;

  const questions = getTransQuestions();
  if (!questions.length) {
    container.innerHTML = `
      <div class="glass-card rounded-3xl p-8 text-center text-stone-500 border border-amber-200 bg-white space-y-3">
        <p class="text-base font-bold text-stone-700">Chưa có bài tập cho bộ lọc hiện tại.</p>
        <p class="text-xs text-stone-500">Vui lòng bấm chọn độ khó <b>"🌟 Tất Cả"</b> hoặc chọn cấp HSK khác trên thanh công cụ.</p>
        <button type="button" onclick="filterTransDifficulty('all')" class="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition">
          Xem Tất Cả Bài Học
        </button>
      </div>
    `;
    return;
  }

  if (currentTransQuestionIdx >= questions.length) {
    currentTransQuestionIdx = 0;
  }

  const q = questions[currentTransQuestionIdx];
  const evalResult = transEvaluationResults[q.id];
  const isRevealed = !!(evalResult && evalResult.isRevealed);
  const diffMeta = TRANS_DIFFICULTY_META[q.type] || TRANS_DIFFICULTY_META.simple;
  const isParagraph = q.type === 'paragraph_daily' || q.type === 'paragraph_essay' || q.hanzi.length > 50;

  // Update progress bar
  const progressElem = document.getElementById('transProgressLabel');
  const barElem = document.getElementById('transProgressBar');
  if (progressElem) {
    progressElem.innerText = `Câu ${currentTransQuestionIdx + 1} / ${questions.length}`;
  }
  if (barElem) {
    const percent = Math.round(((currentTransQuestionIdx + 1) / questions.length) * 100);
    barElem.style.width = `${percent}%`;
  }

  container.innerHTML = `
    <div class="glass-card rounded-3xl p-6 lg:p-8 border border-amber-200/90 bg-white shadow-sm space-y-6 animate-fadeIn">
      
      <!-- Card Header: Level, Lesson, Difficulty Badge & Word Bank Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
            HSK ${q.level} • Bài ${q.lesson}
          </span>
          <span class="px-3 py-1 rounded-full ${diffMeta.badgeCls} text-xs font-bold border flex items-center gap-1 shadow-2xs">
            <span>${diffMeta.icon}</span>
            <span>${q.typeLabel || diffMeta.label}</span>
          </span>
          ${q.topic ? `<span class="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">Chủ đề: ${escapeHtml(q.topic)}</span>` : ''}
          <span class="text-xs text-stone-500 font-semibold ml-auto sm:ml-0">
            Câu ${currentTransQuestionIdx + 1} / ${questions.length}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" onclick="toggleWordBank()" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors shadow-2xs cursor-pointer">
            <i data-lucide="lightbulb" class="w-3.5 h-3.5 text-amber-600"></i>
            <span>${showWordBank ? 'Ẩn gợi ý từ vựng' : 'Hiện gợi ý từ vựng'}</span>
          </button>
        </div>
      </div>

      <!-- Question Vietnamese Prompt (Typography sang trọng, nổi bật) -->
      <div class="p-6 rounded-2xl bg-gradient-to-r from-amber-50/70 via-stone-50/50 to-white border border-amber-200/80 shadow-xs space-y-2">
        <p class="text-xs text-[#8B1E1E] uppercase tracking-wider font-bold flex items-center gap-1.5">
          <i data-lucide="languages" class="w-4 h-4 text-[#8B1E1E]"></i>
          <span>${isParagraph ? 'Đoạn văn tiếng Việt cần dịch sang tiếng Trung:' : 'Câu tiếng Việt cần dịch:'}</span>
        </p>
        <h3 class="${isParagraph ? 'text-lg lg:text-xl leading-relaxed' : 'text-xl lg:text-2xl leading-snug'} font-bold text-stone-900 tracking-tight whitespace-pre-line font-serif-luxury">
          "${escapeHtml(q.vietnamese)}"
        </h3>
      </div>

      <!-- Word Bank (Gợi ý các từ then chốt & liên từ nối) -->
      <div id="transWordBankBox" class="${showWordBank ? '' : 'hidden'} p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2.5">
        <p class="text-xs text-amber-950 font-bold flex items-center gap-1.5">
          <i data-lucide="key" class="w-3.5 h-3.5 text-amber-700"></i>
          <span>Gợi ý từ vựng & Cụm liên từ (Bấm vào từ để chèn nhanh vào ô dịch):</span>
        </p>
        <div class="flex flex-wrap gap-2">
          ${(q.words || []).map(w => `
            <button 
              type="button"
              onclick="insertTransWord(${jsArg(w.title)})" 
              class="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-200 text-xs font-medium font-hanzi shadow-2xs flex items-center gap-1 transition-all cursor-pointer">
              <span class="font-bold text-[#8B1E1E]">${escapeHtml(w.title)}</span>
              <span class="text-amber-700">(${escapeHtml(w.pinyin)})</span>:
              <span class="text-stone-600">${escapeHtml(w.meaning)}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- User Translation Input Area -->
      <div class="space-y-3">
        <div class="relative">
          <textarea 
            id="transUserInput" 
            rows="${isParagraph ? 4 : 2}" 
            placeholder="${isParagraph ? 'Nhập bản dịch đoạn văn tiếng Trung của bạn tại đây (sử dụng dấu chấm phẩy và liên từ nối câu)...' : 'Nhập câu dịch tiếng Trung của bạn tại đây (Hán tự hoặc Pinyin)...'}"
            class="w-full p-4 text-base font-hanzi rounded-2xl bg-stone-50 border border-amber-200 text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1E1E] focus:border-[#8B1E1E] shadow-inner transition-all leading-relaxed">${evalResult && evalResult.userText ? escapeHtml(evalResult.userText) : ''}</textarea>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button 
            type="button"
            onclick="evaluateTranslation()" 
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] hover:brightness-110 text-white font-bold text-sm shadow-md shadow-red-950/20 transition-all flex items-center gap-2 cursor-pointer">
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span>Chấm Điểm & Nhận Xét Ngữ Pháp</span>
          </button>

          <button 
            type="button"
            onclick="revealTranslation()" 
            class="px-5 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-semibold text-sm shadow-xs transition-all flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="eye" class="w-4 h-4 text-amber-700"></i>
            <span>Xem Ngay Câu Mẫu</span>
          </button>

          <button 
            type="button"
            onclick="document.getElementById('transUserInput').value = '';" 
            class="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium text-xs transition-all cursor-pointer">
            Xóa trắng
          </button>
        </div>
      </div>

      <!-- Evaluation Result & Deep Breakdown (Chỉ hiển thị khi đã nộp bài hoặc bấm xem) -->
      ${isRevealed ? `
        <div class="space-y-6 pt-4 border-t border-amber-100 animate-fadeIn">
          
          <!-- Score Feedback Card -->
          ${evalResult.score !== null ? `
            <div class="p-5 rounded-2xl ${evalResult.score >= 8 ? 'bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-300' : 'bg-gradient-to-r from-amber-50 via-white to-white border border-amber-300'} shadow-xs flex items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-md text-xs font-black uppercase ${evalResult.score >= 8 ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}">
                    Kết Quả
                  </span>
                  <span class="text-sm font-bold text-stone-800">${escapeHtml(evalResult.feedback)}</span>
                </div>
                ${evalResult.userText ? `<p class="text-xs text-stone-600">Bài làm của bạn: <strong class="font-hanzi text-stone-900">"${escapeHtml(evalResult.userText)}"</strong></p>` : ''}
              </div>
              <div class="text-right shrink-0">
                <span class="text-3xl lg:text-4xl font-black ${evalResult.score >= 8 ? 'text-emerald-700' : 'text-amber-700'}">
                  ${evalResult.score}
                </span>
                <span class="text-xs text-stone-500 block font-bold">/ 10 ĐIỂM</span>
              </div>
            </div>
          ` : `
            <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center gap-2">
              <i data-lucide="info" class="w-4 h-4 text-amber-700 shrink-0"></i>
              <span>${escapeHtml(evalResult.feedback)}</span>
            </div>
          `}

          <!-- Target Model Sentence / Paragraph Box -->
          <div class="p-6 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="award" class="w-4 h-4 text-[#8B1E1E]"></i>
                <span>${isParagraph ? 'Bản Dịch Chuẩn Đoạn Văn HSK:' : 'Câu Dịch Chuẩn HSK 3.0:'}</span>
              </span>
              <div class="inline-flex items-center gap-1 bg-white/90 p-0.5 rounded-xl border border-amber-200 shadow-2xs">
                <button type="button" onclick="playChineseTTS(${jsArg(q.hanzi)}, 'female')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-colors cursor-pointer" title="Nghe giọng Nữ">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
                  <span>👩 Giọng Nữ</span>
                </button>
                <button type="button" onclick="playChineseTTS(${jsArg(q.hanzi)}, 'male')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors cursor-pointer" title="Nghe giọng Nam">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5 text-amber-700"></i>
                  <span>👨 Giọng Nam</span>
                </button>
              </div>
            </div>

            <div>
              <h4 class="font-hanzi ${isParagraph ? 'text-lg lg:text-xl leading-relaxed' : 'text-2xl lg:text-3xl'} font-black text-stone-900 tracking-wide mb-1">
                ${escapeHtml(q.hanzi)}
              </h4>
              <p class="text-xs sm:text-sm font-bold text-amber-900 tracking-wide">
                ${escapeHtml(q.pinyin)}
              </p>
            </div>
          </div>

          <!-- Word-by-word Breakdown Table -->
          ${q.words && q.words.length ? `
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="list" class="w-4 h-4 text-[#8B1E1E]"></i>
                <span>Bảng Phân Tích Từ Vựng & Cụm Từ Nối:</span>
              </h4>
              <div class="overflow-x-auto rounded-2xl border border-stone-200 shadow-xs">
                <table class="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr class="bg-amber-50/80 border-b border-amber-200 text-amber-950 uppercase font-bold">
                      <th class="py-3 px-4">Từ vựng</th>
                      <th class="py-3 px-4 text-amber-900">Phiên âm Pinyin</th>
                      <th class="py-3 px-4">Nghĩa tiếng Việt</th>
                      <th class="py-3 px-4">Từ loại / Vai trò</th>
                      <th class="py-3 px-4 text-center">Nghe</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-stone-100 bg-white text-stone-700">
                    ${q.words.map(w => `
                      <tr class="hover:bg-amber-50/40 transition-colors">
                        <td class="py-3 px-4 font-hanzi font-bold text-base text-[#8B1E1E]">${escapeHtml(w.title)}</td>
                        <td class="py-3 px-4 font-bold text-amber-900">${escapeHtml(w.pinyin)}</td>
                        <td class="py-3 px-4 font-medium text-stone-800">${escapeHtml(w.meaning)}</td>
                        <td class="py-3 px-4">
                          <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                            ${escapeHtml(w.pos || 'từ')}
                          </span>
                        </td>
                        <td class="py-3 px-4 text-center">
                          <div class="inline-flex items-center gap-0.5">
                            <button type="button" onclick="playChineseTTS(${jsArg(w.title)}, 'female')" class="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200 cursor-pointer" title="Giọng Nữ">👩</button>
                            <button type="button" onclick="playChineseTTS(${jsArg(w.title)}, 'male')" class="p-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200 cursor-pointer" title="Giọng Nam">👨</button>
                          </div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <!-- Grammar Note & Essay Writing Secret -->
          ${q.explanation ? `
            <div class="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/90 space-y-2">
              <h4 class="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="book-open" class="w-4 h-4 text-amber-700"></i>
                <span>${isParagraph ? 'Bí Quyết Hành Văn & Cẩm Nang Ngữ Pháp Viết Luận:' : 'Cẩm Nang Ngữ Pháp & Bí Quyết Dịch:'}</span>
              </h4>
              <p class="text-xs lg:text-sm text-stone-700 leading-relaxed whitespace-pre-line font-medium">
                ${escapeHtml(q.explanation)}
              </p>
            </div>
          ` : ''}

        </div>
      ` : ''}

      <!-- Bottom Step Navigation Controls -->
      <div class="flex items-center justify-between pt-6 border-t border-amber-100">
        <button 
          type="button"
          ${currentTransQuestionIdx === 0 ? 'disabled' : ''} 
          onclick="prevTransQuestion()" 
          class="px-5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentTransQuestionIdx === 0 
              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed' 
              : 'bg-white hover:bg-amber-50 text-stone-800 border-stone-200 shadow-xs cursor-pointer'
          }">
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
          <span>Câu Trước</span>
        </button>

        <span class="text-xs font-bold text-stone-500">
          Câu ${currentTransQuestionIdx + 1} / ${questions.length}
        </span>

        <button 
          type="button"
          ${currentTransQuestionIdx === questions.length - 1 ? 'disabled' : ''} 
          onclick="nextTransQuestion()" 
          class="px-5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentTransQuestionIdx === questions.length - 1 
              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:brightness-110 text-white border-[#8B1E1E] shadow-md shadow-red-950/20 cursor-pointer'
          }">
          <span>Câu Tiếp Theo</span>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>
      </div>

    </div>
  `;

  refreshIcons();
}
