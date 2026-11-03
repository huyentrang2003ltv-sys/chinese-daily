// Module state
let currentTransLevel = 1;
let currentTransLesson = 4; // Defaults to Lesson 4 as in hihsk.com/hsk30/luyen-dich/1/4
let currentTransQuestionIdx = 0;
let transEvaluationResults = {};
let showWordBank = false;

// ---------------- TAB: LUYỆN DỊCH HSK (HIHSK PRO) ----------------
function filterTransLevel(lvl) {
  currentTransLevel = lvl;
  currentTransLesson = (lvl === 1) ? 4 : 1;
  currentTransQuestionIdx = 0;

  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById(`btn-trans-lvl-${i}`);
    if (btn) {
      if (i === lvl) {
        btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-teal-600 text-white shadow-xs transition-all whitespace-nowrap';
      } else {
        btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-teal-50 text-slate-700 border border-teal-200 transition-all whitespace-nowrap';
      }
    }
  }

  renderTranslationLessonList();
  renderTranslationStage();
}

function selectTransLesson(lessonNum) {
  currentTransLesson = lessonNum;
  currentTransQuestionIdx = 0;
  renderTranslationLessonList();
  renderTranslationStage();
}

function renderTranslationLessonList() {
  const container = document.getElementById('transLessonListContainer');
  if (!container) return;

  const levelLessons = lessonsData.filter(l => l.level === currentTransLevel);
  const lessonsSet = Array.from(new Set(levelLessons.map(l => l.lesson))).sort((a,b) => a - b);

  container.innerHTML = lessonsSet.map(num => `
    <button 
      onclick="selectTransLesson(${num})"
      class="px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
        num === currentTransLesson
          ? 'bg-teal-600 text-white shadow-xs scale-105'
          : 'bg-white hover:bg-teal-50 text-slate-700 border border-teal-200'
      }">
      Bài ${num}
    </button>
  `).join('');
}

function getTransQuestions() {
  return lessonsData.filter(l => l.level === currentTransLevel && l.lesson === currentTransLesson);
}

function toggleWordBank() {
  showWordBank = !showWordBank;
  const bankElem = document.getElementById('transWordBankBox');
  if (bankElem) {
    if (showWordBank) {
      bankElem.classList.remove('hidden');
    } else {
      bankElem.classList.add('hidden');
    }
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

  // Normalization logic
  const stripPunct = (s) => (s || '').replace(/[。，！？,.!?、“”"':：;\s]/g, '').trim().toLowerCase();
  const normUser = stripPunct(userText);
  const normTarget = stripPunct(q.hanzi);

  // Check pinyin
  const removeTones = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const userPinyin = removeTones(userText);
  const targetPinyin = removeTones(q.pinyin);

  let score = 7.0;
  let isCorrect = false;
  let feedback = '';

  if (normUser === normTarget) {
    score = 10;
    isCorrect = true;
    feedback = '🎉 Xuất sắc! Dịch chính xác 100% chuẩn ngữ pháp và văn bản.';
  } else if (userPinyin.length > 3 && userPinyin === targetPinyin) {
    score = 9.5;
    isCorrect = true;
    feedback = '✨ Rất tốt! Bạn đã gõ đúng phiên âm Pinyin chuẩn của toàn bộ câu.';
  } else {
    // Check keyword matching
    let matchedKeywords = 0;
    const words = q.words || [];
    words.forEach(w => {
      if (normUser.includes(stripPunct(w.title))) {
        matchedKeywords++;
      }
    });

    const ratio = words.length > 0 ? (matchedKeywords / words.length) : 0;
    if (ratio >= 0.75) {
      score = 8.5;
      isCorrect = true;
      feedback = '👍 Rất tốt! Bạn đã nắm vững các từ vựng then chốt. Hãy đối chiếu chi tiết với câu mẫu bên dưới.';
    } else if (ratio >= 0.4) {
      score = 7.5;
      isCorrect = true;
      feedback = '💡 Khá tốt! Câu dịch đã truyền tải được một phần nội dung. Hãy xem phân tích ngữ pháp để hoàn thiện trật tự từ.';
    } else {
      score = 6.0;
      isCorrect = false;
      feedback = '⚠️ Chưa chính xác. Đừng nản lòng, hãy xem đối chiếu câu chuẩn và các từ vựng bên dưới để học cách ghép câu.';
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
    feedback: '💡 Đang hiển thị đáp án mẫu để bạn tham khảo và học hỏi.'
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

function renderTranslationStage() {
  const container = document.getElementById('translationStageContainer');
  if (!container) return;

  const questions = getTransQuestions();
  if (!questions.length) {
    container.innerHTML = `
      <div class="glass-card rounded-2xl p-8 text-center text-slate-500 border border-teal-100 bg-white">
        Không tìm thấy câu hỏi luyện dịch cho bài học này.
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
    <div class="glass-card rounded-3xl p-6 lg:p-8 border border-teal-100 bg-white shadow-sm space-y-6">
      
      <!-- Card Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-teal-100">
        <div class="flex items-center gap-2.5">
          <span class="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            HSK ${q.level} • Bài ${q.lesson}
          </span>
          <span class="text-xs text-slate-500 font-semibold">
            Câu ${currentTransQuestionIdx + 1} / ${questions.length}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="toggleWordBank()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold border border-teal-200 transition-colors shadow-xs">
            <i data-lucide="lightbulb" class="w-3.5 h-3.5 text-amber-500"></i>
            <span>${showWordBank ? 'Ẩn gợi ý từ' : 'Hiện gợi ý từ vựng'}</span>
          </button>
        </div>
      </div>

      <!-- Question Vietnamese Prompt (Typography sang trọng, nổi bật) -->
      <div class="p-6 rounded-2xl bg-gradient-to-r from-teal-50/70 via-teal-50/30 to-white border border-teal-200/80 shadow-xs">
        <p class="text-xs text-teal-800 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
          <i data-lucide="languages" class="w-4 h-4 text-teal-600"></i>
          <span>Câu tiếng Việt cần dịch:</span>
        </p>
        <h3 class="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-snug">
          "${q.vietnamese}"
        </h3>
      </div>

      <!-- Word Bank (Gợi ý các từ then chốt) -->
      <div id="transWordBankBox" class="${showWordBank ? '' : 'hidden'} p-4 rounded-2xl bg-teal-50/40 border border-teal-100 space-y-2">
        <p class="text-xs text-teal-900 font-bold flex items-center gap-1.5">
          <i data-lucide="key" class="w-3.5 h-3.5 text-teal-600"></i>
          <span>Bấm vào từ để chèn nhanh vào câu dịch:</span>
        </p>
        <div class="flex flex-wrap gap-2">
          ${(q.words || []).map(w => `
            <button 
              onclick="insertTransWord(${jsArg(w.title)})" 
              class="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-slate-800 border border-teal-200 text-xs font-medium font-hanzi shadow-xs flex items-center gap-1 transition-all">
              <span class="font-bold text-teal-950">${w.title}</span>
              <span class="text-teal-700">(${w.pinyin})</span>:
              <span class="text-slate-600">${w.meaning}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- User Translation Input Area -->
      <div class="space-y-3">
        <div class="relative">
          <textarea 
            id="transUserInput" 
            rows="3" 
            placeholder="Nhập câu dịch tiếng Trung của bạn tại đây (Hán tự hoặc Pinyin)..."
            class="w-full p-4 text-base font-hanzi rounded-2xl bg-slate-50/80 border border-teal-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-inner transition-all leading-relaxed">${evalResult && evalResult.userText ? escapeHtml(evalResult.userText) : ''}</textarea>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button 
            onclick="evaluateTranslation()" 
            class="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/25 transition-all flex items-center gap-2">
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span>Chấm Điểm & Phân Tích</span>
          </button>

          <button 
            onclick="revealTranslation()" 
            class="px-5 py-2.5 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 font-semibold text-sm shadow-xs transition-all flex items-center gap-1.5">
            <i data-lucide="eye" class="w-4 h-4 text-teal-600"></i>
            <span>Xem Ngay Câu Mẫu</span>
          </button>

          <button 
            onclick="document.getElementById('transUserInput').value = '';" 
            class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs transition-all">
            Xóa trắng
          </button>
        </div>
      </div>

      <!-- Evaluation Result & Deep Breakdown (Chỉ hiển thị khi đã nộp bài hoặc bấm xem) -->
      ${isRevealed ? `
        <div class="space-y-6 pt-4 border-t border-teal-100 animate-in fade-in duration-300">
          
          <!-- Score Feedback Card -->
          ${evalResult.score !== null ? `
            <div class="p-5 rounded-2xl ${evalResult.score >= 8 ? 'bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-300' : 'bg-gradient-to-r from-amber-50 via-white to-white border border-amber-300'} shadow-xs flex items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-md text-xs font-black uppercase ${evalResult.score >= 8 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}">
                    Kết Quả
                  </span>
                  <span class="text-sm font-bold text-slate-800">${evalResult.feedback}</span>
                </div>
                ${evalResult.userText ? `<p class="text-xs text-slate-600">Bài làm của bạn: <strong class="font-hanzi text-slate-900">"${escapeHtml(evalResult.userText)}"</strong></p>` : ''}
              </div>
              <div class="text-right flex-shrink-0">
                <span class="text-3xl lg:text-4xl font-black ${evalResult.score >= 8 ? 'text-emerald-700' : 'text-amber-600'}">
                  ${evalResult.score}
                </span>
                <span class="text-xs text-slate-500 block font-bold">/ 10 ĐIỂM</span>
              </div>
            </div>
          ` : `
            <div class="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-xs font-semibold text-teal-900 flex items-center gap-2">
              <i data-lucide="info" class="w-4 h-4 text-teal-600 flex-shrink-0"></i>
              <span>${evalResult.feedback}</span>
            </div>
          `}

          <!-- Target Model Sentence Box -->
          <div class="p-6 rounded-2xl bg-teal-50/40 border border-teal-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="award" class="w-4 h-4 text-teal-600"></i>
                <span>Câu Dịch Chuẩn HSK 3.0:</span>
              </span>
              <div class="inline-flex items-center gap-1 bg-white/90 p-0.5 rounded-xl border border-teal-200 shadow-2xs">
                <button onclick="playChineseTTS(${jsArg(q.hanzi)}, 'female')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-850 border border-rose-200 text-xs font-bold transition-colors cursor-pointer" title="Nghe giọng Nữ">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
                  <span>👩 Nữ</span>
                </button>
                <button onclick="playChineseTTS(${jsArg(q.hanzi)}, 'male')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-850 border border-teal-200 text-xs font-bold transition-colors cursor-pointer" title="Nghe giọng Nam">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5 text-teal-600"></i>
                  <span>👨 Nam</span>
                </button>
              </div>
            </div>
            <div>
              <h4 class="font-hanzi text-2xl lg:text-3xl font-black text-teal-950 tracking-wide mb-1">
                ${q.hanzi}
              </h4>
              <p class="text-sm font-bold text-teal-700 tracking-wide">
                ${q.pinyin}
              </p>
            </div>
          </div>

          <!-- Word-by-word Breakdown Table (Chuẩn HiHSK) -->
          ${q.words && q.words.length ? `
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="list" class="w-4 h-4 text-teal-600"></i>
                <span>Bảng Phân Tích Từ Vựng Trong Câu:</span>
              </h4>
              <div class="overflow-x-auto rounded-2xl border border-teal-100 shadow-xs">
                <table class="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr class="bg-teal-50/80 border-b border-teal-100 text-teal-950 uppercase font-bold">
                      <th class="py-3 px-4">Từ vựng</th>
                      <th class="py-3 px-4 text-teal-700">Phiên âm Pinyin</th>
                      <th class="py-3 px-4">Nghĩa tiếng Việt</th>
                      <th class="py-3 px-4">Từ loại</th>
                      <th class="py-3 px-4 text-center">Nghe</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-teal-50 bg-white text-slate-700">
                    ${q.words.map(w => `
                      <tr class="hover:bg-teal-50/40 transition-colors">
                        <td class="py-3 px-4 font-hanzi font-bold text-base text-teal-950">${w.title}</td>
                        <td class="py-3 px-4 font-bold text-teal-700">${w.pinyin}</td>
                        <td class="py-3 px-4 font-medium text-slate-800">${w.meaning}</td>
                        <td class="py-3 px-4">
                          <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            ${w.pos || 'từ'}
                          </span>
                        </td>
                        <td class="py-3 px-4 text-center">
                          <div class="inline-flex items-center gap-0.5">
                            <button onclick="playChineseTTS(${jsArg(w.title)}, 'female')" class="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200 cursor-pointer" title="Giọng Nữ">👩</button>
                            <button onclick="playChineseTTS(${jsArg(w.title)}, 'male')" class="p-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-bold border border-teal-200 cursor-pointer" title="Giọng Nam">👨</button>
                          </div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <!-- Grammar Note & Translation Secret -->
          ${q.explanation ? `
            <div class="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
              <h4 class="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="book-open" class="w-4 h-4 text-amber-600"></i>
                <span>Cẩm Nang Ngữ Pháp & Bí Quyết Dịch:</span>
              </h4>
              <p class="text-xs lg:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                ${q.explanation}
              </p>
            </div>
          ` : ''}

        </div>
      ` : ''}

      <!-- Bottom Step Navigation Controls -->
      <div class="flex items-center justify-between pt-6 border-t border-teal-100">
        <button 
          ${currentTransQuestionIdx === 0 ? 'disabled' : ''} 
          onclick="prevTransQuestion()" 
          class="px-5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentTransQuestionIdx === 0 
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
              : 'bg-white hover:bg-teal-50 text-teal-800 border-teal-200 shadow-xs cursor-pointer'
          }">
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
          <span>Câu Trước</span>
        </button>

        <span class="text-xs font-bold text-slate-500">
          Câu ${currentTransQuestionIdx + 1} / ${questions.length}
        </span>

        <button 
          ${currentTransQuestionIdx === questions.length - 1 ? 'disabled' : ''} 
          onclick="nextTransQuestion()" 
          class="px-5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentTransQuestionIdx === questions.length - 1 
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
              : 'bg-teal-600 hover:bg-teal-700 text-white border-teal-600 shadow-md shadow-teal-600/25 cursor-pointer'
          }">
          <span>Câu Tiếp Theo</span>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>
      </div>

    </div>
  `;

  refreshIcons();
}
