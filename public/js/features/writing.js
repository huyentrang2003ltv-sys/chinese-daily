// Module state
let currentWriter = null;
let currentWritingChar = '你';
let isWritingQuizActive = false;

// ==========================================
// MODULE: LUYỆN VIẾT NÉT CHỮ HÁN TƯƠNG TÁC (HANZIWRITER POPUP MODAL)
// ==========================================
let currentWritingWord = '你';

function openWritingModal(wordOrChar = '你', pinyin = '', meaning = '') {
  if (!document.getElementById('writingModal')) return;

  if (!wordOrChar || !wordOrChar.trim()) wordOrChar = '你';
  currentWritingWord = wordOrChar;

  const titleWordEl = document.getElementById('writingModalTitleWord');
  const pinyinEl = document.getElementById('writingCharPinyin');
  const meaningEl = document.getElementById('writingCharMeaning');
  const tabsContainer = document.getElementById('writingCharTabsContainer');

  if (titleWordEl) titleWordEl.innerText = wordOrChar;
  if (pinyinEl) pinyinEl.innerText = pinyin || '';
  if (meaningEl) meaningEl.innerText = meaning || '';

  // Extract all Chinese characters from the word/sentence
  const hanziChars = (wordOrChar.match(/[\u4e00-\u9fa5]/g) || [wordOrChar[0]]);

  if (tabsContainer) {
    if (hanziChars.length > 1) {
      tabsContainer.innerHTML = hanziChars.map((ch, idx) => `
        <button 
          onclick="selectWritingModalChar(${jsArg(ch)})" 
          id="btn-char-tab-${ch}" 
          class="px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${idx === 0 ? 'bg-[#8B1E1E] text-white shadow-2xs' : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'}">
          <span class="font-hanzi font-black text-sm">${escapeHtml(ch)}</span> (Nét chữ ${idx + 1})
        </button>
      `).join('');
    } else {
      tabsContainer.innerHTML = '';
    }
  }

  renderWritingQuickPick();
  openModal('writingModal');
  loadWritingChar(hanziChars[0], pinyin, meaning);
}

function selectWritingModalChar(ch) {
  const tabsContainer = document.getElementById('writingCharTabsContainer');
  if (tabsContainer) {
    const btns = tabsContainer.querySelectorAll('button');
    btns.forEach(b => {
      if (b.id === `btn-char-tab-${ch}`) {
        b.className = 'px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer bg-[#8B1E1E] text-white shadow-2xs';
      } else {
        b.className = 'px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white hover:bg-stone-100 text-stone-700 border border-stone-200';
      }
    });
  }
  loadWritingChar(ch, '', '');
}

function closeWritingModal() {
  closeModal('writingModal');
  isWritingQuizActive = false;
}

registerModal('writingModal', closeWritingModal);

function initWritingModule() {
  renderWritingQuickPick();
}

function renderWritingQuickPick() {
  const container = document.getElementById('writingQuickPickContainer');
  if (!container) return;

  const quickChars = [
    { char: '你', pinyin: 'nǐ', meaning: 'Bạn, anh' },
    { char: '好', pinyin: 'hǎo', meaning: 'Tốt, đẹp' },
    { char: '我', pinyin: 'wǒ', meaning: 'Tôi' },
    { char: '爱', pinyin: 'ài', meaning: 'Yêu thương' },
    { char: '学', pinyin: 'xué', meaning: 'Học tập' },
    { char: '国', pinyin: 'guó', meaning: 'Đất nước' },
    { char: '中', pinyin: 'zhōng', meaning: 'Trung tâm' },
    { char: '家', pinyin: 'jiā', meaning: 'Gia đình' },
    { char: '人', pinyin: 'rén', meaning: 'Con người' },
    { char: '大', pinyin: 'dà', meaning: 'To, lớn' },
    { char: '天', pinyin: 'tiān', meaning: 'Trời, ngày' },
    { char: '生', pinyin: 'shēng', meaning: 'Sinh sống' },
    { char: '日', pinyin: 'rì', meaning: 'Mặt trời' },
    { char: '月', pinyin: 'yuè', meaning: 'Mặt trăng' },
    { char: '水', pinyin: 'shuǐ', meaning: 'Nước' },
    { char: '火', pinyin: 'huǒ', meaning: 'Lửa' },
    { char: '山', pinyin: 'shān', meaning: 'Núi' },
    { char: '木', pinyin: 'mù', meaning: 'Cây cối' },
    { char: '福', pinyin: 'fú', meaning: 'Phúc lành' },
    { char: '龙', pinyin: 'lóng', meaning: 'Con rồng' },
    { char: '说', pinyin: 'shuō', meaning: 'Nói' },
    { char: '看', pinyin: 'kàn', meaning: 'Xem, nhìn' },
    { char: '听', pinyin: 'tīng', meaning: 'Nghe' },
    { char: '会', pinyin: 'huì', meaning: 'Biết, hội' }
  ];

  container.innerHTML = quickChars.map(item => `
    <button 
      onclick="openWritingModal(${jsArg(item.char)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning)})"
      class="px-2.5 py-1 rounded-xl font-hanzi font-bold text-sm transition-all bg-stone-50 hover:bg-rose-50 hover:text-rose-700 border border-stone-200 hover:border-rose-300 cursor-pointer shadow-2xs">
      ${item.char}
    </button>
  `).join('');
}

function loadWritingChar(char, pinyin, meaning) {
  currentWritingChar = char;
  isWritingQuizActive = false;

  const modal = document.getElementById('writingModal');
  if (modal && modal.classList.contains('hidden')) {
    openModal('writingModal');
  }

  const pinyinEl = document.getElementById('writingCharPinyin');
  const meaningEl = document.getElementById('writingCharMeaning');
  const badgeEl = document.getElementById('writingStatusBadge');
  const feedbackEl = document.getElementById('writingFeedbackMsg');

  if (pinyinEl && pinyin) pinyinEl.innerText = pinyin;
  if (meaningEl && meaning) meaningEl.innerText = meaning;
  if (badgeEl) {
    badgeEl.className = 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200';
    badgeEl.innerText = 'Chế độ: Xem nét';
  }
  if (feedbackEl) {
    feedbackEl.className = 'w-full mt-3 p-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-xs text-center font-medium';
    feedbackEl.innerHTML = `💡 Đang nạp chữ <strong>${escapeHtml(char)}</strong>. Bấm <strong>"Xem Hoạt Họa Nét"</strong> hoặc <strong>"Tự Luyện Viết"</strong>!`;
  }

  const target = document.getElementById('hanziWriterTarget');
  if (!target) return;
  target.innerHTML = '';

  if (typeof HanziWriter === 'undefined') {
    target.innerHTML = `<span class="font-hanzi text-8xl font-black text-rose-800">${escapeHtml(char)}</span>`;
    return;
  }

  currentWriter = HanziWriter.create('hanziWriterTarget', char, {
    width: 240,
    height: 240,
    padding: 10,
    showOutline: true,
    strokeAnimationSpeed: 1.2,
    delayBetweenStrokes: 180,
    strokeColor: '#e11d48', // Ruby Rose
    highlightColor: '#f59e0b', // Amber
    outlineColor: '#e2e8f0',
    drawingColor: '#0d9488', // Teal drawing
    drawingWidth: 7,
    showHintAfterMisses: 2
  });

  // Automatically play stroke animation on load
  setTimeout(() => {
    if (currentWriter && !isWritingQuizActive) {
      currentWriter.animateCharacter();
    }
  }, 250);
}

function animateWritingChar() {
  if (!currentWriter) return;
  isWritingQuizActive = false;
  const badgeEl = document.getElementById('writingStatusBadge');
  const feedbackEl = document.getElementById('writingFeedbackMsg');
  if (badgeEl) {
    badgeEl.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200';
    badgeEl.innerText = 'Chế độ: Đang hoạt họa';
  }
  if (feedbackEl) {
    feedbackEl.innerText = '🎬 Đang trình chiếu thứ tự nét... Hãy quan sát chiều hướng từng nét bút!';
  }
  currentWriter.showCharacter();
  currentWriter.animateCharacter();
}

function startWritingQuiz() {
  if (!currentWriter) return;
  isWritingQuizActive = true;
  const badgeEl = document.getElementById('writingStatusBadge');
  const feedbackEl = document.getElementById('writingFeedbackMsg');

  if (badgeEl) {
    badgeEl.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200';
    badgeEl.innerText = 'Chế độ: Đang luyện viết';
  }
  if (feedbackEl) {
    feedbackEl.className = 'w-full mt-4 p-3 rounded-xl bg-teal-50 text-teal-900 border border-teal-200 text-xs text-center font-medium';
    feedbackEl.innerHTML = '✍️ Hãy vẽ nét đầu tiên vào ô! Vẽ bằng chuột hoặc lướt ngón tay.';
  }

  currentWriter.quiz({
    onMistake: function(strokeData) {
      if (feedbackEl) {
        feedbackEl.className = 'w-full mt-4 p-3 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 text-xs text-center font-medium animate-pulse';
        feedbackEl.innerHTML = `⚠️ Sai hướng hoặc sai nét! (Đã sai ${strokeData.mistakesOnStroke} lần). Hệ thống sẽ gợi ý nếu cần.`;
      }
    },
    onCorrectStroke: function(strokeData) {
      if (feedbackEl) {
        feedbackEl.className = 'w-full mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs text-center font-medium';
        feedbackEl.innerHTML = `✅ Chính xác! Nét thứ ${strokeData.strokeNum + 1} chuẩn xác. Tiếp tục nào!`;
      }
    },
    onComplete: function(summaryData) {
      addExp(10, 'Hoàn thành luyện viết chữ Hán');
      if (feedbackEl) {
        feedbackEl.className = 'w-full mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs text-center font-bold shadow-md';
        feedbackEl.innerHTML = `🎉 XUẤT SẮC! Bạn đã viết hoàn chỉnh chữ "${escapeHtml(currentWritingChar)}" (+10 EXP ⭐)!`;
      }
      playChineseTTS(currentWritingChar);
    }
  });
}

function giveWritingHint() {
  if (currentWriter && isWritingQuizActive) {
    currentWriter.quiz(); // trigger hint
  } else if (currentWriter) {
    startWritingQuiz();
  }
}

function resetWritingChar() {
  if (currentWriter) {
    isWritingQuizActive = false;
    currentWriter.showOutline();
    animateWritingChar();
  }
}

function playWritingCharTTS(gender = 'female') {
  playChineseTTS(currentWritingChar, gender);
}

function loadCustomWritingChar() {
  const input = document.getElementById('customWritingInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    showToast('Vui lòng nhập chữ Hán để luyện viết!', 'warning');
    return;
  }
  openWritingModal(val, '', 'Chữ tự chọn');
}
