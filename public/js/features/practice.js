// Module state
let currentPracticeLevel = 1;
let currentPracticeSkill = 'all';
let practiceUserAnswers = {};
let practiceReorderState = {};
let practiceListeningReveal = {};
let practiceRecordingState = {};
let practiceSpeechRecognition = null;

// ---------------- TAB: LUYỆN TẬP HSK 1 - HSK 6 (4 KỸ NĂNG) ----------------
function filterPracticeLevel(lvl) {
  currentPracticeLevel = lvl;
  
  // Update "All" button
  const allBtn = document.getElementById('btn-practice-hsk-all');
  if (allBtn) {
    if (lvl === 'all') {
      allBtn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm transition-all whitespace-nowrap';
    } else {
      allBtn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap';
    }
  }

  // Update HSK 1-6 buttons
  for (let i = 1; i <= 6; i++) {
    const btn = document.getElementById(`btn-practice-hsk-${i}`);
    if (!btn) continue;
    if (i === lvl) {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm transition-all whitespace-nowrap';
    } else {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap';
    }
  }
  renderPractice();
}

function filterPracticeSkill(skill) {
  currentPracticeSkill = skill;
  const skills = ['all', 'listening', 'speaking', 'reading', 'writing'];
  skills.forEach(s => {
    const btn = document.getElementById(`btn-practice-skill-${s}`);
    if (!btn) return;
    if (s === skill) {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5';
    } else {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap flex items-center gap-1.5';
    }
  });
  renderPractice();
}

/** Collapses newlines so a passage can be passed to TTS as one argument. */
function oneLine(text) {
  return String(text || '').replace(/\n/g, ' ');
}

function getFilteredPracticeQuestions() {
  if (!practiceData || !Array.isArray(practiceData)) return [];
  let list = practiceData;
  if (currentPracticeLevel !== 'all') {
    list = list.filter(q => q.level === currentPracticeLevel);
  }
  if (currentPracticeSkill !== 'all') {
    list = list.filter(q => q.skill === currentPracticeSkill);
  }
  return list;
}

function resetPracticeLevel() {
  const currentQuestions = getFilteredPracticeQuestions();
  currentQuestions.forEach(q => {
    delete practiceUserAnswers[q.id];
    delete practiceReorderState[q.id];
    delete practiceListeningReveal[q.id];
  });
  renderPractice();
}

function updatePracticeDashboard() {
  const currentQuestions = getFilteredPracticeQuestions();
  const total = currentQuestions.length;
  let correct = 0;
  let attempted = 0;

  currentQuestions.forEach(q => {
    if (practiceUserAnswers[q.id]) {
      attempted++;
      if (practiceUserAnswers[q.id].isCorrect) correct++;
    }
  });

  const correctElem = document.getElementById('practiceCorrectCount');
  const totalElem = document.getElementById('practiceTotalCount');
  if (correctElem && totalElem) {
    correctElem.innerText = correct;
    totalElem.innerText = `${attempted}/${total}`;
  }
}

function togglePracticeListeningReveal(qId) {
  practiceListeningReveal[qId] = !practiceListeningReveal[qId];
  renderPractice();
}

function selectPracticeChoice(qId, optIdx) {
  const q = practiceData.find(item => item.id === qId);
  if (!q || !q.options || !q.options[optIdx]) return;

  const isCorrect = !!q.options[optIdx].isCorrect;
  practiceUserAnswers[qId] = {
    isAnswered: true,
    isCorrect: isCorrect,
    selectedIdx: optIdx
  };

  renderPractice();
}

function addPracticeWordTile(qId, word) {
  if (!practiceReorderState[qId]) {
    practiceReorderState[qId] = [];
  }
  if (!practiceReorderState[qId].includes(word)) {
    practiceReorderState[qId].push(word);
  }
  renderPractice();
}

function removePracticeWordTile(qId, tileIdx) {
  if (practiceReorderState[qId]) {
    practiceReorderState[qId].splice(tileIdx, 1);
  }
  renderPractice();
}

function clearPracticeReorder(qId) {
  practiceReorderState[qId] = [];
  delete practiceUserAnswers[qId];
  renderPractice();
}

function submitPracticeReorder(qId) {
  const q = practiceData.find(item => item.id === qId);
  if (!q) return;

  const userSequence = practiceReorderState[qId] || [];
  if (userSequence.length !== q.correctOrder.length) {
    showToast('Vui lòng ghép đầy đủ các mảnh từ trước khi kiểm tra!', 'warning');
    return;
  }

  const isCorrect = JSON.stringify(userSequence) === JSON.stringify(q.correctOrder);
  practiceUserAnswers[qId] = {
    isAnswered: true,
    isCorrect: isCorrect,
    userSequence: userSequence
  };

  renderPractice();
}

function startPracticeSpeechRecognition(qId, targetText) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (typeof showToast === 'function') {
      showToast('Trình duyệt chưa hỗ trợ ghi âm trực tiếp. Đã mở chế độ nhập Pinyin thông minh!', 'info');
    }
    showPinyinInputFallback(qId, targetText);
    return;
  }

  const statusEl = document.getElementById(`speech-status-${qId}`);
  const btnEl = document.getElementById(`speech-btn-${qId}`);

  if (practiceRecordingState[qId]) {
    if (practiceSpeechRecognition) {
      practiceSpeechRecognition.stop();
    }
    practiceRecordingState[qId] = false;
    if (statusEl) statusEl.innerHTML = `<span class="text-stone-500">Đã dừng ghi âm.</span>`;
    return;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    practiceSpeechRecognition = recognition;
    practiceRecordingState[qId] = true;

    if (btnEl) {
      btnEl.classList.add('animate-pulse', 'ring-4', 'ring-red-400', 'bg-red-600', 'text-white');
    }
    if (statusEl) {
      statusEl.innerHTML = `<span class="text-rose-600 font-bold flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span> Đang lắng nghe... Hãy nói to rõ ràng bằng tiếng Trung!</span>`;
    }

    recognition.onresult = (event) => {
      practiceRecordingState[qId] = false;
      const transcript = event.results[0][0].transcript.trim();

      const cleanSpoken = transcript.replace(/[，。！？、\s.,!?]/g, '');
      const cleanTarget = targetText.replace(/[，。！？、\s.,!?]/g, '');

      let isMatch = cleanSpoken === cleanTarget;
      let score = 0;
      if (isMatch) {
        score = 100;
      } else {
        let matchedChars = 0;
        for (let char of cleanTarget) {
          if (cleanSpoken.includes(char)) matchedChars++;
        }
        score = Math.round((matchedChars / Math.max(cleanTarget.length, 1)) * 100);
        if (score >= 70) isMatch = true;
      }

      practiceUserAnswers[qId] = {
        isAnswered: true,
        isCorrect: isMatch,
        spokenText: transcript,
        accuracyScore: score
      };

      renderPractice();
    };

    recognition.onerror = (event) => {
      practiceRecordingState[qId] = false;
      if (btnEl) {
        btnEl.classList.remove('animate-pulse', 'ring-4', 'ring-red-400', 'bg-red-600', 'text-white');
      }
      if (statusEl) {
        statusEl.innerHTML = `<div class="p-2.5 rounded-xl bg-amber-50 dark:bg-stone-800 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between gap-2">
          <span>⚠️ Ghi âm bị gián đoạn (${event.error || 'không bắt được tiếng'}). Bạn có thể chuyển sang chế độ gõ Pinyin!</span>
          <button type="button" onclick="showPinyinInputFallback('${qId}', '${targetText}')" class="px-2.5 py-1 rounded-lg bg-[#8B1E1E] text-white font-bold hover:opacity-90 cursor-pointer">Gõ Pinyin</button>
        </div>`;
      }
    };

    recognition.onend = () => {
      practiceRecordingState[qId] = false;
      if (btnEl) {
        btnEl.classList.remove('animate-pulse', 'ring-4', 'ring-red-400', 'bg-red-600', 'text-white');
      }
    };

    recognition.start();
  } catch (err) {
    console.error('Speech recognition error:', err);
    showToast('Không thể khởi động ghi âm: ' + err.message, 'error');
  }
}

function renderPractice() {
  const container = document.getElementById('practiceQuestionsContainer');
  if (!container) return;

  const questions = getFilteredPracticeQuestions();
  if (!questions.length) {
    container.innerHTML = `
      <div class="glass-card rounded-2xl p-10 text-center text-stone-500 border border-amber-200 bg-white shadow-xs space-y-3">
        <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800">Không có câu hỏi nào phù hợp với bộ lọc hiện tại.</p>
        <p class="text-xs text-stone-500">Hãy thử chọn cấp độ HSK khác hoặc chọn "Tất Cả Kỹ Năng".</p>
      </div>
    `;
    updatePracticeDashboard();
    return;
  }

  container.innerHTML = questions.map((q, idx) => {
    const answer = practiceUserAnswers[q.id];
    const isAnswered = !!answer;

    // Skill badge configuration
    let skillBadge = '';
    if (q.skill === 'listening') {
      skillBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 font-bold border border-sky-200 text-xs"><i data-lucide="headphones" class="w-3.5 h-3.5 text-sky-700"></i> Nghe (听力)</span>`;
    } else if (q.skill === 'speaking') {
      skillBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-bold border border-rose-200 text-xs"><i data-lucide="mic" class="w-3.5 h-3.5 text-rose-700"></i> Nói & Phát Âm (口语)</span>`;
    } else if (q.skill === 'reading') {
      skillBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-200 text-xs"><i data-lucide="book-open" class="w-3.5 h-3.5 text-emerald-700"></i> Đọc Hiểu (阅读)</span>`;
    } else if (q.skill === 'writing') {
      skillBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold border border-amber-200 text-xs"><i data-lucide="edit-3" class="w-3.5 h-3.5 text-amber-800"></i> Viết & Ghép Câu (写作)</span>`;
    }

    // Header element
    const headerHtml = `
      <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-2.5 py-1 rounded-lg bg-[#8B1E1E]/10 text-[#8B1E1E] font-black border border-[#8B1E1E]/20 text-xs font-serif-luxury">
            HSK ${q.level} • Câu ${idx + 1}
          </span>
          ${skillBadge}
          <span class="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium text-xs">
            ${q.category || q.title || 'Bài tập'}
          </span>
        </div>
        ${q.audioText ? `
          <div class="inline-flex items-center gap-1 bg-amber-100/70 p-0.5 rounded-xl border border-amber-300/60 shadow-xs">
            <button onclick="playChineseTTS(${jsArg(oneLine(q.audioText))}, 'female')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer" title="Nghe audio mẫu giọng Nữ">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
              <span>👩 Nữ</span>
            </button>
            <button onclick="playChineseTTS(${jsArg(oneLine(q.audioText))}, 'male')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer" title="Nghe audio mẫu giọng Nam">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-blue-600"></i>
              <span>👨 Nam</span>
            </button>
          </div>
        ` : ''}
      </div>
    `;

    // CASE 1: SPEAKING (SHADOWING & PRONUNCIATION EVALUATION)
    if (q.skill === 'speaking' || q.subType === 'speaking_shadowing') {
      return `
        <div class="glass-card rounded-2xl p-6 lg:p-8 border border-amber-200/70 bg-white shadow-xs space-y-5">
          ${headerHtml}

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#8B1E1E] mb-1">Mục tiêu phát âm & khẩu ngữ:</h4>
            <div class="p-5 rounded-2xl bg-gradient-to-r from-amber-50/50 via-[#FCF9F2] to-amber-50/30 border border-amber-200 text-center space-y-2">
              <p class="font-hanzi text-2xl lg:text-3xl font-bold text-stone-900 tracking-wide">${q.targetText || q.audioText}</p>
              ${q.targetPinyin || q.pinyin ? `<p class="text-sm font-bold text-[#8B1E1E] font-sans tracking-wide">${q.targetPinyin || q.pinyin}</p>` : ''}
              ${q.vietnamese ? `<p class="text-xs text-stone-600 font-medium italic">"${q.vietnamese}"</p>` : ''}
            </div>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold text-stone-700">${q.question || 'Hãy nghe câu mẫu rồi nhấn micro và phát âm thật chuẩn xác:'}</p>
            <div class="flex flex-wrap items-center gap-3">
              <div class="inline-flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl border border-stone-200">
                <button onclick="playChineseTTS(${jsArg(oneLine((q.audioText || q.targetText)))}, 'female')" class="px-3 py-2 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer" title="Nghe mẫu giọng Nữ">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
                  <span>1. 👩 Mẫu Nữ</span>
                </button>
                <button onclick="playChineseTTS(${jsArg(oneLine((q.audioText || q.targetText)))}, 'male')" class="px-3 py-2 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer" title="Nghe mẫu giọng Nam">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5 text-blue-600"></i>
                  <span>1. 👨 Mẫu Nam</span>
                </button>
              </div>
              <button id="speech-btn-${q.id}" onclick="startPracticeSpeechRecognition(${jsArg(q.id)}, ${jsArg(q.targetText || q.audioText)})" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
                <i data-lucide="mic" class="w-4 h-4"></i>
                <span>2. Ghi âm & Chấm điểm phát âm</span>
              </button>
            </div>
            <div id="speech-status-${q.id}" class="text-xs font-medium min-h-[20px]"></div>
          </div>

          ${isAnswered ? `
            <div class="p-4 rounded-xl ${answer.isCorrect ? 'bg-emerald-50 border border-emerald-300 text-emerald-950' : 'bg-rose-50 border border-rose-300 text-rose-950'} text-xs space-y-2 mt-3">
              <div class="flex items-center justify-between font-bold">
                <span class="flex items-center gap-1.5 ${answer.isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
                  <i data-lucide="${answer.isCorrect ? 'check-circle' : 'alert-circle'}" class="w-4 h-4"></i>
                  ${answer.isCorrect ? 'Xuất sắc! Phát âm rất chuẩn xác.' : 'Chưa chuẩn xác lắm, bạn hãy kiên trì thử lại nhé!'}
                </span>
                <span class="px-2.5 py-0.5 rounded-full ${answer.isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'} text-xs font-black">
                  Độ chính xác: ${answer.accuracyScore || 0}%
                </span>
              </div>
              ${answer.spokenText ? `<p class="text-stone-700">Giọng bạn nói nhận diện được: <strong class="font-hanzi text-sm text-stone-900">${escapeHtml(answer.spokenText)}</strong></p>` : ''}
              <p class="whitespace-pre-line text-stone-700 pt-1 border-t border-stone-200/50">${q.explanation}</p>
            </div>
          ` : ''}
        </div>
      `;
    }

    // CASE 2: REORDER (连词成句 - Ghép câu hoàn chỉnh)
    if (q.subType === 'reorder' || q.type === 'reorder') {
      const selectedWords = practiceReorderState[q.id] || [];

      return `
        <div class="glass-card rounded-2xl p-6 lg:p-8 border border-amber-200/70 bg-white shadow-xs space-y-4">
          ${headerHtml}

          <div>
            <h4 class="font-sans text-sm font-bold text-stone-900 mb-1">${q.question || 'Sắp xếp các mảnh từ sau thành câu hoàn chỉnh:'}</h4>
            <p class="text-xs text-stone-600">Nghĩa tiếng Việt cần diễn đạt: <strong class="text-stone-800">${q.vietnamese}</strong></p>
          </div>

          <!-- Answer Drop Zone -->
          <div class="p-4 rounded-xl min-h-[58px] bg-amber-50/50 border-2 border-dashed border-amber-300/80 flex flex-wrap items-center gap-2">
            ${selectedWords.length ? selectedWords.map((w, wIdx) => `
              <span 
                ${!isAnswered ? `onclick="removePracticeWordTile(${jsArg(q.id)}, ${wIdx})"` : ''} 
                class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white font-hanzi text-base font-bold shadow-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-all">
                <span>${w}</span>
                ${!isAnswered ? '<i data-lucide="x" class="w-3.5 h-3.5 text-amber-200"></i>' : ''}
              </span>
            `).join('') : '<span class="text-xs text-stone-400 font-medium italic">Nhấp vào từng mảnh từ bên dưới theo đúng trật tự ngữ pháp để ghép thành câu...</span>'}
          </div>

          <!-- Available Word Chips -->
          ${!isAnswered ? `
            <div class="space-y-2 pt-1">
              <span class="text-xs text-stone-500 font-bold">Mảnh từ có sẵn (nhấp để chọn):</span>
              <div class="flex flex-wrap items-center gap-2">
                ${q.words.map(w => {
                  const isSelected = selectedWords.includes(w);
                  return `
                    <button 
                      ${isSelected ? 'disabled' : ''} 
                      onclick="addPracticeWordTile(${jsArg(q.id)}, ${jsArg(w)})" 
                      class="px-4 py-2 rounded-xl border text-base font-bold font-hanzi transition-all ${
                        isSelected 
                          ? 'bg-stone-100 text-stone-300 border-stone-200 opacity-40 cursor-not-allowed' 
                          : 'bg-white hover:bg-amber-50 text-stone-900 border-amber-300/80 shadow-xs hover:border-[#8B1E1E] cursor-pointer'
                      }">
                      ${w}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3 pt-2">
              <button 
                onclick="submitPracticeReorder(${jsArg(q.id)})" 
                class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-90 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="check" class="w-4 h-4"></i>
                <span>Kiểm Tra Đáp Án</span>
              </button>
              <button 
                onclick="clearPracticeReorder(${jsArg(q.id)})" 
                class="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs border border-stone-200 transition-all cursor-pointer">
                Xóa làm lại
              </button>
            </div>
          ` : ''}

          <!-- Explanation -->
          ${isAnswered ? `
            <div class="p-4 rounded-xl ${answer.isCorrect ? 'bg-emerald-50 border border-emerald-300 text-emerald-950' : 'bg-rose-50 border border-rose-300 text-rose-950'} text-xs leading-relaxed mt-3">
              <div class="flex items-center justify-between font-bold mb-1.5 ${answer.isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
                <span class="flex items-center gap-1.5">
                  <i data-lucide="${answer.isCorrect ? 'check-circle' : 'alert-circle'}" class="w-4 h-4"></i>
                  <span>${answer.isCorrect ? 'Xuất sắc! Cấu trúc câu hoàn toàn chuẩn xác.' : 'Trật tự câu chưa chuẩn xác!'}</span>
                </span>
                <div class="inline-flex items-center gap-1 bg-white/90 p-0.5 rounded-lg border border-stone-200">
                  <button onclick="playChineseTTS(${jsArg(q.hanzi)}, 'female')" class="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer" title="Nghe câu chuẩn giọng Nữ">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
                    <span>👩 Nữ</span>
                  </button>
                  <button onclick="playChineseTTS(${jsArg(q.hanzi)}, 'male')" class="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer" title="Nghe câu chuẩn giọng Nam">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5 text-blue-600"></i>
                    <span>👨 Nam</span>
                  </button>
                </div>
              </div>
              <p class="font-hanzi text-base font-bold text-stone-900 mb-0.5">Câu chuẩn: ${q.hanzi}</p>
              ${q.pinyin ? `<p class="text-xs font-bold text-[#8B1E1E] mb-1">${q.pinyin}</p>` : ''}
              <p class="whitespace-pre-line text-stone-700 font-normal pt-1 border-t border-stone-200/50">${q.explanation}</p>
            </div>
          ` : ''}
        </div>
      `;
    }

    // CASE 3: LISTENING & READING MULTIPLE CHOICE (PASSAGE FILL BLANK, MAIN IDEA, SYNONYM/ANTONYM, QA)
    const isListening = q.skill === 'listening';
    const isRevealed = practiceListeningReveal[q.id];

    return `
      <div class="glass-card rounded-2xl p-6 lg:p-8 border border-amber-200/70 bg-white shadow-xs space-y-4">
        ${headerHtml}

        <!-- Listening Special Audio Box -->
        ${isListening ? `
          <div class="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-amber-50/40 to-white border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2 text-sky-900 font-bold text-xs">
                <i data-lucide="headphones" class="w-4 h-4 text-sky-600"></i>
                <span>Bài luyện nghe hiểu phát âm chuẩn Bắc Kinh:</span>
              </div>
              <p class="text-xs text-stone-600">Hãy nhấn nút nghe audio và chọn phương án trả lời chính xác nhất.</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="inline-flex items-center gap-1 bg-white/90 p-0.5 rounded-xl border border-sky-300/80 shadow-2xs">
                <button onclick="playChineseTTS(${jsArg(oneLine((q.audioText || q.passageText)))}, 'female')" class="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer" title="Phát bài nghe giọng Nữ">
                  <i data-lucide="play" class="w-3.5 h-3.5 fill-current text-rose-600"></i>
                  <span>👩 Nghe Nữ</span>
                </button>
                <button onclick="playChineseTTS(${jsArg(oneLine((q.audioText || q.passageText)))}, 'male')" class="px-3 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer" title="Phát bài nghe giọng Nam">
                  <i data-lucide="play" class="w-3.5 h-3.5 fill-current text-sky-600"></i>
                  <span>👨 Nghe Nam</span>
                </button>
              </div>
              <button onclick="togglePracticeListeningReveal(${jsArg(q.id)})" class="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold border border-stone-200 transition-all cursor-pointer">
                <i data-lucide="${isRevealed ? 'eye-off' : 'eye'}" class="w-3.5 h-3.5 inline mr-1"></i>
                <span>${isRevealed ? 'Ẩn văn bản' : 'Xem văn bản'}</span>
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Passage Text (For Reading or When Listening Script Revealed) -->
        ${(q.passageText && (!isListening || isRevealed)) ? `
          <div class="p-4 rounded-xl bg-[#FAF7F2] border border-amber-200/70 relative">
            ${q.relationType ? `
              <div class="mb-2">
                <span class="px-2.5 py-0.5 rounded-full ${q.relationType === 'synonym' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-purple-100 text-purple-900 border border-purple-300'} text-xs font-bold inline-flex items-center gap-1">
                  <i data-lucide="${q.relationType === 'synonym' ? 'repeat' : 'split'}" class="w-3 h-3"></i>
                  ${q.relationType === 'synonym' ? 'TÌM TỪ ĐỒNG NGHĨA (近义词)' : 'TÌM TỪ TRÁI NGHĨA (反义词)'}
                </span>
              </div>
            ` : ''}
            <div class="font-hanzi text-base lg:text-lg font-medium text-stone-900 leading-relaxed whitespace-pre-line">${q.passageText}</div>
            ${q.pinyin ? `<p class="text-xs font-bold text-[#8B1E1E] mt-1.5 leading-normal">${q.pinyin}</p>` : ''}
            ${q.vietnamese ? `<p class="text-xs text-stone-600 mt-1 italic">Dịch nghĩa: ${q.vietnamese}</p>` : ''}
          </div>
        ` : ''}

        <!-- Question Title -->
        <div>
          <h4 class="font-sans text-sm lg:text-base font-bold text-stone-900">${q.question}</h4>
        </div>

        <!-- Options Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          ${q.options.map((opt, optIdx) => {
            let btnClass = 'p-3.5 rounded-xl border text-left text-xs lg:text-sm font-semibold transition-all font-hanzi flex items-center justify-between ';
            if (!isAnswered) {
              btnClass += 'bg-white hover:bg-amber-50/70 text-stone-800 border-amber-200/80 shadow-xs hover:border-[#8B1E1E] cursor-pointer';
            } else {
              if (opt.isCorrect) {
                btnClass += 'bg-emerald-50 text-emerald-950 border-emerald-400 font-bold shadow-xs';
              } else if (answer.selectedIdx === optIdx && !opt.isCorrect) {
                btnClass += 'bg-rose-50 text-rose-950 border-rose-400 line-through';
              } else {
                btnClass += 'bg-stone-50 text-stone-400 border-stone-200 opacity-60';
              }
            }

            return `
              <button 
                ${isAnswered ? 'disabled' : ''} 
                onclick="selectPracticeChoice(${jsArg(q.id)}, ${optIdx})" 
                class="${btnClass}">
                <span class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg ${isAnswered && opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-700'} text-xs font-bold flex items-center justify-center shrink-0">
                    ${String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>${opt.text}</span>
                </span>
                ${isAnswered && opt.isCorrect ? '<i data-lucide="check-circle" class="w-4 h-4 text-emerald-600 shrink-0"></i>' : ''}
                ${isAnswered && answer.selectedIdx === optIdx && !opt.isCorrect ? '<i data-lucide="x-circle" class="w-4 h-4 text-rose-500 shrink-0"></i>' : ''}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Explanation -->
        ${isAnswered ? `
          <div class="p-4 rounded-xl ${answer.isCorrect ? 'bg-emerald-50 border border-emerald-300 text-emerald-950' : 'bg-rose-50 border border-rose-300 text-rose-950'} text-xs leading-relaxed mt-3">
            <div class="flex items-center gap-2 font-bold mb-1.5 ${answer.isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
              <i data-lucide="${answer.isCorrect ? 'check-circle' : 'alert-circle'}" class="w-4 h-4"></i>
              <span>${answer.isCorrect ? 'Chính xác!' : 'Chưa chính xác!'}</span>
            </div>
            <p class="whitespace-pre-line text-stone-700 font-normal">${q.explanation}</p>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  updatePracticeDashboard();
  refreshIcons();
}


// ---------------- PINYIN FALLBACK & INPUT HELPER ----------------
function showPinyinInputFallback(qId, targetText) {
  const statusEl = document.getElementById(`speech-status-${qId}`);
  if (!statusEl) return;
  statusEl.innerHTML = `
    <div class="mt-2 p-3 rounded-2xl bg-amber-50/90 dark:bg-stone-800/90 border border-amber-300 dark:border-stone-700 space-y-2.5">
      <div class="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
        <span>⌨️ Chế độ dự phòng: Nhập Pinyin hoặc gõ Hán tự tương ứng</span>
        <span class="text-[10px] text-stone-500">Mục tiêu: <strong class="text-rose-700 dark:text-amber-400">${targetText}</strong></span>
      </div>
      <div class="flex items-center gap-2">
        <input 
          type="text" 
          id="pinyin-fallback-input-${qId}" 
          placeholder="Gõ Pinyin hoặc Hán tự..."
          class="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 text-xs focus:ring-2 focus:ring-[#8B1E1E] text-stone-900 dark:text-stone-100"
          onkeydown="if(event.key==='Enter') checkPinyinAnswer('${qId}', '${targetText}')"
        />
        <button 
          type="button"
          onclick="checkPinyinAnswer('${qId}', '${targetText}')" 
          class="px-3.5 py-1.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:opacity-90 shadow-2xs cursor-pointer"
        >
          Kiểm tra
        </button>
      </div>
      <div class="flex items-center gap-1 flex-wrap text-2xs">
        <span class="text-stone-400 font-semibold mr-1">Thanh điệu:</span>
        ${['ā', 'á', 'ǎ', 'à', 'ō', 'ó', 'ǒ', 'ò', 'ē', 'é', 'ě', 'è', 'ī', 'í', 'ǐ', 'ì', 'ū', 'ú', 'ǔ', 'ù', 'ǖ', 'ǘ', 'ǚ', 'ǜ'].map(c => `
          <button type="button" onclick="insertPinyinChar('${qId}', '${c}')" class="w-6 h-6 rounded-md bg-white dark:bg-stone-700 hover:bg-amber-100 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-600 font-medium">${c}</button>
        `).join('')}
      </div>
    </div>
  `;
}

function insertPinyinChar(qId, char) {
  const input = document.getElementById(`pinyin-fallback-input-${qId}`);
  if (!input) return;
  input.value += char;
  input.focus();
}

function checkPinyinAnswer(qId, targetText) {
  const input = document.getElementById(`pinyin-fallback-input-${qId}`);
  const statusEl = document.getElementById(`speech-status-${qId}`);
  if (!input || !statusEl) return;
  const val = input.value.trim().toLowerCase();
  if (!val) {
    if (typeof showToast === 'function') showToast('Vui lòng nhập Pinyin hoặc câu trả lời!', 'warning');
    return;
  }
  const cleanVal = val.replace(/[\s,!?，。！？]/g, '');
  const cleanTarget = targetText.toLowerCase().replace(/[\s,!?，。！？]/g, '');
  
  const isMatch = cleanVal === cleanTarget || cleanVal.includes(cleanTarget) || cleanTarget.includes(cleanVal);
  if (isMatch) {
    statusEl.innerHTML = `
      <div class="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
        <div>
          <span class="font-bold">🎉 Hoàn hảo! Bạn đã nắm vững ngữ âm câu: "${targetText}"</span>
          <p class="text-[11px] text-emerald-600 mt-0.5">+10 EXP phát âm chính xác</p>
        </div>
        <span class="text-xl">💯</span>
      </div>
    `;
    if (typeof addPracticeExp === 'function') addPracticeExp(10);
  } else {
    statusEl.innerHTML = `
      <div class="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800 border border-amber-300 dark:border-stone-700 text-amber-900 dark:text-amber-300 text-xs space-y-1.5">
        <span class="font-bold">⚠️ Câu trả lời của bạn: "${input.value}"</span>
        <p class="text-[11px] text-stone-600 dark:text-stone-400">Đáp án chuẩn là: <strong class="text-[#8B1E1E] dark:text-amber-400">${targetText}</strong></p>
        <button type="button" onclick="showPinyinInputFallback('${qId}', '${targetText}')" class="text-xs text-rose-700 dark:text-amber-400 font-bold underline">Thử lại một lần nữa →</button>
      </div>
    `;
  }
}

window.showPinyinInputFallback = showPinyinInputFallback;
window.insertPinyinChar = insertPinyinChar;
window.checkPinyinAnswer = checkPinyinAnswer;
