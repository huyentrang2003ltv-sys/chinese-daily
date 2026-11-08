// public/js/features/dictation.js
// =========================================================================
// PHÒNG LUYỆN NGHE PHẢN XẠ & CHÉP CHÍNH TẢ (Shadowing & Dictation Lab)
// 60 Bài nghe phân tầng HSK 1 - 6, so khớp diff từng chữ Hán & ngắt nhịp Shadowing
// =========================================================================

let activeDictationLevel = 1;
let activeDictationIndex = 0;
let activeDictationSpeed = 1.0;
let dictationResults = {}; // { [id]: { accuracy, userText, isChecked } }
let dictationListenCount = {}; // { [id]: count }
let activeDictationTab = 'dictation'; // 'dictation' | 'shadowing'

function initDictationLab() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('practice-view-dictation');
  if (!container) return;

  renderDictationLab();
}

function setPracticeViewMode(mode) {
  if (typeof document === 'undefined') return;
  const qView = document.getElementById('practice-view-questions');
  const dView = document.getElementById('practice-view-dictation');
  const btnQ = document.getElementById('btn-practice-mode-questions');
  const btnD = document.getElementById('btn-practice-mode-dictation');

  if (mode === 'dictation') {
    if (qView) qView.classList.add('hidden');
    if (dView) dView.classList.remove('hidden');

    if (btnQ) {
      btnQ.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-transparent hover:bg-white/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer';
    }
    if (btnD) {
      btnD.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-xs cursor-pointer';
    }

    renderDictationLab();
  } else {
    if (dView) dView.classList.add('hidden');
    if (qView) qView.classList.remove('hidden');

    if (btnD) {
      btnD.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-transparent hover:bg-white/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer';
    }
    if (btnQ) {
      btnQ.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-xs cursor-pointer';
    }
  }
}

function filterDictationLevel(lvl) {
  activeDictationLevel = lvl;
  activeDictationIndex = 0;
  renderDictationLab();
}

function getFilteredDictationList() {
  const list = Array.isArray(dictationData) ? dictationData : [];
  if (activeDictationLevel === 'all') return list;
  return list.filter(item => item.level === activeDictationLevel);
}

function changeDictationSpeed(speed) {
  activeDictationSpeed = speed;
  renderDictationSpeedButtons();
}

function renderDictationSpeedButtons() {
  if (typeof document === 'undefined') return;
  [0.75, 1.0, 1.25].forEach(spd => {
    const btn = document.getElementById(`btn-dict-speed-${spd.toString().replace('.', '_')}`);
    if (!btn) return;
    if (Math.abs(spd - activeDictationSpeed) < 0.05) {
      btn.className = 'px-2.5 py-1 rounded-lg text-xs font-black bg-amber-400 text-stone-950 shadow-2xs';
    } else {
      btn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-amber-100 border border-stone-200 dark:border-stone-700';
    }
  });
}

function playDictationAudio(targetText) {
  if (!targetText) {
    const list = getFilteredDictationList();
    const item = list[activeDictationIndex];
    if (item) targetText = item.zh;
  }
  if (!targetText) return;

  const list = getFilteredDictationList();
  const currentItem = list[activeDictationIndex];
  if (currentItem) {
    dictationListenCount[currentItem.id] = (dictationListenCount[currentItem.id] || 0) + 1;
    const badge = document.getElementById('dictationListenBadge');
    if (badge) badge.textContent = `Đã nghe: ${dictationListenCount[currentItem.id]} lần`;
  }

  if (typeof playChineseTTS === 'function') {
    playChineseTTS(targetText, activeDictationSpeed);
  } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(targetText);
    u.lang = 'zh-CN';
    u.rate = activeDictationSpeed;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
}

function prevDictationSentence() {
  const list = getFilteredDictationList();
  if (activeDictationIndex > 0) {
    activeDictationIndex--;
    renderDictationLab();
  }
}

function nextDictationSentence() {
  const list = getFilteredDictationList();
  if (activeDictationIndex < list.length - 1) {
    activeDictationIndex++;
    renderDictationLab();
  }
}

function selectDictationSentence(idx) {
  activeDictationIndex = idx;
  renderDictationLab();
}

/**
 * Character-by-character diff comparator for Hanzi dictation
 */
function computeHanziDiff(userStr, targetStr) {
  const uClean = String(userStr || '').trim();
  const tClean = String(targetStr || '').trim();

  // Strip punctuation for pure character array comparison
  const uChars = uClean.replace(/[，。！？、\s]/g, '').split('');
  const tChars = tClean.replace(/[，。！？、\s]/g, '').split('');

  let matches = 0;
  const charDiffs = [];

  for (let i = 0; i < tChars.length; i++) {
    const expected = tChars[i];
    const actual = uChars[i];

    if (actual === expected) {
      matches++;
      charDiffs.push({ char: expected, status: 'correct', actual });
    } else if (actual) {
      charDiffs.push({ char: expected, status: 'wrong', actual });
    } else {
      charDiffs.push({ char: expected, status: 'missing', actual: '' });
    }
  }

  const extraChars = uChars.slice(tChars.length);
  const accuracy = tChars.length > 0 ? Math.round((matches / tChars.length) * 100) : 0;

  return {
    accuracy,
    matches,
    total: tChars.length,
    charDiffs,
    extraChars,
    isPerfect: matches === tChars.length && extraChars.length === 0
  };
}

function checkCurrentDictation() {
  if (typeof document === 'undefined') return;
  const list = getFilteredDictationList();
  const item = list[activeDictationIndex];
  if (!item) return;

  const inputEl = document.getElementById('dictationHanziInput');
  if (!inputEl) return;
  const userText = inputEl.value;

  const diffResult = computeHanziDiff(userText, item.zh);
  dictationResults[item.id] = {
    userText,
    diffResult,
    isChecked: true
  };

  renderDictationFeedback(item, diffResult, userText);
}

function revealDictationAnswer() {
  if (typeof document === 'undefined') return;
  const list = getFilteredDictationList();
  const item = list[activeDictationIndex];
  if (!item) return;

  const ansEl = document.getElementById('dictationAnswerReveal');
  if (ansEl) {
    ansEl.classList.toggle('hidden');
    if (typeof refreshIcons === 'function') refreshIcons(ansEl);
  }
}

function toggleDictationPinyinHint() {
  if (typeof document === 'undefined') return;
  const hintEl = document.getElementById('dictationPinyinHint');
  if (hintEl) {
    hintEl.classList.toggle('hidden');
  }
}

function renderDictationFeedback(item, diff, userText) {
  const container = document.getElementById('dictationFeedbackArea');
  if (!container) return;

  container.classList.remove('hidden');

  let gradeColor = 'text-rose-600 bg-rose-50 border-rose-300';
  let badgeText = 'Cần luyện thêm';
  if (diff.accuracy === 100) {
    gradeColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    badgeText = 'Hoàn hảo 100%';
  } else if (diff.accuracy >= 80) {
    gradeColor = 'text-teal-700 bg-teal-50 border-teal-300';
    badgeText = 'Rất tốt';
  } else if (diff.accuracy >= 50) {
    gradeColor = 'text-amber-700 bg-amber-50 border-amber-300';
    badgeText = 'Đạt chuẩn';
  }

  // Visual diff HTML
  const diffTokensHtml = diff.charDiffs.map(d => {
    if (d.status === 'correct') {
      return `<span class="inline-flex flex-col items-center justify-center w-8 h-10 rounded-lg bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-hanzi text-lg font-black shadow-2xs">${d.char}</span>`;
    } else if (d.status === 'wrong') {
      return `
        <span class="inline-flex flex-col items-center justify-center px-1.5 h-10 rounded-lg bg-rose-100 border-2 border-rose-400 text-rose-950 font-hanzi text-sm font-bold shadow-2xs" title="Bạn gõ '${d.actual}', chuẩn là '${d.char}'">
          <span class="line-through text-rose-500 text-xs">${d.actual}</span>
          <span class="text-rose-950 font-black">${d.char}</span>
        </span>
      `;
    } else {
      return `<span class="inline-flex flex-col items-center justify-center w-8 h-10 rounded-lg bg-stone-100 border-2 border-dashed border-stone-400 text-stone-400 font-hanzi text-sm font-bold shadow-2xs" title="Thiếu chữ">${d.char}</span>`;
    }
  }).join('');

  container.innerHTML = `
    <div class="p-5 rounded-2xl bg-white dark:bg-[#161B22] border-2 border-amber-300 dark:border-stone-700 shadow-md space-y-4 animate-fade-in">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-stone-800">
        <div class="flex items-center gap-3">
          <div class="px-3.5 py-1.5 rounded-xl border ${gradeColor} font-black text-sm flex items-center gap-1.5 shadow-2xs">
            <i data-lucide="${diff.accuracy >= 80 ? 'check-circle' : 'alert-circle'}" class="w-4 h-4"></i>
            <span>Độ chính xác: ${diff.accuracy}% (${diff.matches}/${diff.total} chữ Hán)</span>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            ${badgeText}
          </span>
        </div>
        <button 
          onclick="playDictationAudio(${jsArg(item.zh)})"
          class="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs">
          <i data-lucide="volume-2" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
          <span>Nghe lại câu chuẩn</span>
        </button>
      </div>

      <!-- Diff Visual Comparison Grid -->
      <div class="space-y-1.5">
        <p class="text-xs font-bold text-stone-500 uppercase tracking-wider">Đối chiếu chi tiết từng chữ Hán:</p>
        <div class="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
          ${diffTokensHtml}
        </div>
      </div>

      <!-- Sentence Meaning & Academic Grammar Point -->
      <div class="p-4 rounded-xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/70 dark:border-stone-700 space-y-1.5 text-xs">
        <p class="font-hanzi text-base font-bold text-stone-900 dark:text-white">${escapeHtml(item.zh)}</p>
        <p class="text-stone-500 font-mono">${escapeHtml(item.pinyin)}</p>
        <p class="text-amber-950 dark:text-amber-200 font-medium font-serif">🇻🇳 ${escapeHtml(item.vi)}</p>
        <div class="pt-2 border-t border-amber-200/50 dark:border-stone-700 flex items-start gap-1.5 text-stone-600 dark:text-stone-300 text-[11px]">
          <span class="font-bold text-[#8B1E1E] shrink-0">Trọng điểm ngữ pháp:</span>
          <span>${escapeHtml(item.grammarPoint)}</span>
        </div>
      </div>
    </div>
  `;

  if (typeof refreshIcons === 'function') refreshIcons(container);
}

function renderDictationLab() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('practice-view-dictation');
  if (!container) return;

  const list = getFilteredDictationList();
  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-12 text-center text-stone-500 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200">
        Chưa có câu nghe chép cho cấp độ này.
      </div>
    `;
    return;
  }

  if (activeDictationIndex >= list.length) activeDictationIndex = 0;
  const item = list[activeDictationIndex];
  const listenTimes = dictationListenCount[item.id] || 0;
  const prevResult = dictationResults[item.id] || null;

  // Level selector buttons
  const levelButtons = [
    { lvl: 1, label: 'HSK 1 (Nền tảng)' },
    { lvl: 2, label: 'HSK 2 (Sơ cấp)' },
    { lvl: 3, label: 'HSK 3 (Trung cấp)' },
    { lvl: 4, label: 'HSK 4 (Nâng cao)' },
    { lvl: 5, label: 'HSK 5 (Thành thạo)' },
    { lvl: 6, label: 'HSK 6 (Đỉnh cao C2)' },
    { lvl: 'all', label: '🌟 Tất Cả (60 Câu)' }
  ].map(b => {
    const isActive = activeDictationLevel === b.lvl;
    const style = isActive
      ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs font-black'
      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-50 border border-stone-200 dark:border-stone-700 font-bold';
    return `
      <button 
        onclick="filterDictationLevel(${typeof b.lvl === 'string' ? `'${b.lvl}'` : b.lvl})"
        class="px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${style}">
        ${b.label}
      </button>
    `;
  }).join('');

  // Sentence dots / pagination selector
  const paginationHtml = list.map((s, idx) => {
    const isCur = idx === activeDictationIndex;
    const res = dictationResults[s.id];
    let dotStyle = 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400';
    if (res && res.diffResult) {
      dotStyle = res.diffResult.accuracy >= 80 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white';
    }
    const ring = isCur ? 'ring-2 ring-[#8B1E1E] font-black scale-110' : 'font-medium';
    return `
      <button 
        onclick="selectDictationSentence(${idx})" 
        class="w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer ${dotStyle} ${ring}">
        ${idx + 1}
      </button>
    `;
  }).join('');

  // Shadowing chunks HTML
  const chunksHtml = (item.chunks || []).map((ch, idx) => `
    <div class="inline-flex flex-col items-center p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/80 border border-amber-200/80 dark:border-stone-700 shadow-2xs">
      <span class="text-[11px] text-stone-500 dark:text-stone-400 font-mono">${escapeHtml(ch.pinyin)}</span>
      <span class="font-hanzi text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">${escapeHtml(ch.text)}</span>
      <button 
        onclick="playDictationAudio(${jsArg(ch.text)})" 
        class="mt-1 px-2 py-0.5 rounded bg-white dark:bg-stone-700 text-[10px] text-stone-600 dark:text-stone-300 hover:text-[#8B1E1E] border border-stone-200 dark:border-stone-600 flex items-center gap-1 font-bold cursor-pointer">
        <i data-lucide="volume-2" class="w-3 h-3"></i>
        <span>Nhại nhịp ${idx + 1}</span>
      </button>
    </div>
  `).join('<span class="text-stone-400 font-black text-xl px-1">/</span>');

  container.innerHTML = `
    <!-- Top Hero Banner -->
    <div class="glass-card rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-amber-50/80 via-[#FAF7F2] to-orange-50/60 border-2 border-amber-300/60 shadow-md space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mb-2">
            <i data-lucide="headphones" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
            <span>Phương Pháp Shadowing & Dictation Chuẩn Khoa Học Ngôn Ngữ</span>
          </div>
          <h2 class="text-2xl lg:text-3xl font-serif-luxury font-black text-stone-900 dark:text-white tracking-tight">
            Phòng Luyện Nghe Phản Xạ & Chép Chính Tả (听写与跟读实验室)
          </h2>
          <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed mt-1">
            Xóa bỏ rào cản "nghe hiểu nhưng không viết được chữ Hán". Nghe audio giọng chuẩn Bắc Kinh, chép lại từng chữ Hán và đối chiếu sai lệch (Diff) tức thì theo độ chính xác 100%. Kết hợp ngắt nhịp thở <strong>Shadowing</strong> để nhại ngữ điệu người bản xứ.
          </p>
        </div>

        <!-- Quick Stats Widget -->
        <div class="flex items-center gap-3 bg-white/90 dark:bg-stone-800/90 p-3.5 rounded-2xl border border-amber-200/80 dark:border-stone-700 shadow-xs shrink-0">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center font-black text-lg">
            🎧
          </div>
          <div>
            <div class="text-[10px] text-stone-400 uppercase font-bold">Tiến độ bài học</div>
            <div class="text-sm font-black text-stone-900 dark:text-stone-100">
              Câu ${activeDictationIndex + 1} / ${list.length} (HSK ${item.level})
            </div>
          </div>
        </div>
      </div>

      <!-- Level Selector Toolbar -->
      <div class="pt-3 border-t border-amber-200/60 dark:border-stone-800 flex items-center gap-2 overflow-x-auto pb-1">
        <span class="text-xs font-bold text-stone-500 whitespace-nowrap">Chọn Cấp Độ:</span>
        ${levelButtons}
      </div>
    </div>

    <!-- Sentence Pagination Dots -->
    <div class="flex items-center justify-between gap-2 p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
      <div class="flex items-center gap-1.5 overflow-x-auto flex-1 py-0.5">
        <span class="text-xs font-bold text-stone-500 whitespace-nowrap mr-1">Bộ 10 câu:</span>
        ${paginationHtml}
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button 
          onclick="prevDictationSentence()" 
          class="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1 cursor-pointer">
          <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
          <span>Trước</span>
        </button>
        <button 
          onclick="nextDictationSentence()" 
          class="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1 cursor-pointer">
          <span>Sau</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>

    <!-- Main Active Dictation & Shadowing Workbench -->
    <div class="glass-card rounded-3xl p-6 md:p-8 bg-white dark:bg-[#161B22] border-2 border-amber-300/80 dark:border-stone-800 shadow-xl space-y-6">
      
      <!-- Sentence Header Meta -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div class="flex items-center gap-2.5 flex-wrap">
          <span class="px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs">
            HSK ${item.level} • Câu ${activeDictationIndex + 1}/${list.length}
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            Độ khó: ${escapeHtml(item.difficulty || 'Chuẩn')}
          </span>
          <span id="dictationListenBadge" class="text-xs font-mono text-stone-500">
            Đã nghe: ${listenTimes} lần
          </span>
        </div>

        <!-- Audio Speed Pills -->
        <div class="flex items-center gap-1.5">
          <span class="text-xs font-bold text-stone-500">Tốc độ:</span>
          <button id="btn-dict-speed-0_75" onclick="changeDictationSpeed(0.75)" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-amber-100 border border-stone-200 dark:border-stone-700 cursor-pointer">
            0.75x (Chậm)
          </button>
          <button id="btn-dict-speed-1_0" onclick="changeDictationSpeed(1.0)" class="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-400 text-stone-950 shadow-2xs cursor-pointer">
            1.0x (Chuẩn)
          </button>
          <button id="btn-dict-speed-1_25" onclick="changeDictationSpeed(1.25)" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-amber-100 border border-stone-200 dark:border-stone-700 cursor-pointer">
            1.25x (Nhanh)
          </button>
        </div>
      </div>

      <!-- Audio Trigger Box -->
      <div class="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-stone-50 to-orange-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 border border-amber-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div class="flex items-center gap-4">
          <button 
            type="button"
            onclick="playDictationAudio(${jsArg(item.zh)})"
            class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer group">
            <i data-lucide="play" class="w-8 h-8 ml-1 text-white group-hover:scale-110 transition-transform"></i>
          </button>
          <div class="space-y-0.5">
            <h4 class="text-base font-bold text-stone-900 dark:text-white">Bấm để phát Audio câu tiếng Hán</h4>
            <p class="text-xs text-stone-500">Giọng đọc Bắc Kinh chuẩn mực • Nhấn phím cách hoặc Ctrl+Space để nghe lại</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button 
            type="button" 
            onclick="toggleDictationPinyinHint()" 
            class="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-stone-800 hover:bg-amber-50 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 shadow-2xs cursor-pointer">
            <i data-lucide="help-circle" class="w-3.5 h-3.5 text-amber-600"></i>
            <span>Gợi ý Pinyin</span>
          </button>
          <button 
            type="button" 
            onclick="revealDictationAnswer()" 
            class="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-stone-800 hover:bg-amber-50 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 shadow-2xs cursor-pointer">
            <i data-lucide="eye" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
            <span>Xem Đáp Án</span>
          </button>
        </div>
      </div>

      <!-- Hidden Pinyin Hint Box -->
      <div id="dictationPinyinHint" class="hidden p-4 rounded-xl bg-amber-50/70 dark:bg-stone-800/80 border border-amber-300 text-xs text-stone-700 dark:text-stone-300 flex items-center gap-2 animate-fade-in font-mono">
        <i data-lucide="info" class="w-4 h-4 text-amber-600 shrink-0"></i>
        <span><strong>Gợi ý Pinyin:</strong> ${escapeHtml(item.pinyin)}</span>
      </div>

      <!-- Hidden Answer Reveal Box -->
      <div id="dictationAnswerReveal" class="hidden p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-stone-800 dark:text-stone-200 space-y-1 animate-fade-in">
        <p class="font-hanzi text-base font-bold text-emerald-900 dark:text-emerald-300">${escapeHtml(item.zh)}</p>
        <p class="text-stone-500 font-mono">${escapeHtml(item.pinyin)}</p>
        <p class="font-serif text-emerald-800 dark:text-emerald-400">🇻🇳 ${escapeHtml(item.vi)}</p>
      </div>

      <!-- Hanzi Dictation Textarea Input -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <i data-lucide="edit" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
            <span>Khu vực chép chính tả (Gõ chữ Hán bạn nghe được):</span>
          </label>
          <span class="text-[11px] text-stone-400">Phím tắt: Ctrl + Enter để kiểm tra</span>
        </div>
        <textarea 
          id="dictationHanziInput" 
          rows="3" 
          onkeydown="if((event.ctrlKey || event.metaKey) && event.key==='Enter') checkCurrentDictation()"
          placeholder="Lắng nghe audio và gõ chữ Hán vào đây (ví dụ: 明天下午...)..."
          class="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-hanzi text-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#8B1E1E] focus:border-transparent transition-all shadow-inner custom-scrollbar"
        >${prevResult ? escapeHtml(prevResult.userText) : ''}</textarea>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3">
        <button 
          type="button" 
          onclick="checkCurrentDictation()" 
          class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#681414] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all">
          <i data-lucide="check-check" class="w-4 h-4"></i>
          <span>Kiểm Tra Chép Chính Tả (核对听写)</span>
        </button>
      </div>

      <!-- Dynamic Feedback Area -->
      <div id="dictationFeedbackArea" class="${prevResult ? '' : 'hidden'} space-y-4">
        <!-- Rendered by renderDictationFeedback if previous result exists -->
      </div>

      <!-- Shadowing Rhythm Practice Sub-Section -->
      <div class="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center text-sm font-black">
              🗣️
            </div>
            <div>
              <h4 class="text-sm font-bold text-stone-900 dark:text-white">Luyện Nghe Nhại Ngữ Điệu (Shadowing Rhythm)</h4>
              <p class="text-[11px] text-stone-500">Phân tách thành các cụm ý nghĩa (意群), ngắt nhịp thở và giữ trường độ âm thanh</p>
            </div>
          </div>
        </div>

        <!-- Chunks display with pause marks -->
        <div class="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            ${chunksHtml}
          </div>
          <div class="text-[11px] text-stone-500 italic pt-2 border-t border-stone-200 dark:border-stone-800">
            💡 Ký hiệu <span class="font-bold text-[#8B1E1E]">/</span> là điểm ngắt nhịp thở ngắn giữa các cụm ý nghĩa. Hãy nghe và nhại theo đúng nhịp để có phát âm tự nhiên như người bản xứ.
          </div>
        </div>
      </div>

    </div>
  `;

  renderDictationSpeedButtons();
  if (prevResult && prevResult.diffResult) {
    renderDictationFeedback(item, prevResult.diffResult, prevResult.userText);
  }
  if (typeof refreshIcons === 'function') refreshIcons(container);
}

// Global window attachments
if (typeof window !== 'undefined') {
  window.initDictationLab = initDictationLab;
  window.setPracticeViewMode = setPracticeViewMode;
  window.filterDictationLevel = filterDictationLevel;
  window.changeDictationSpeed = changeDictationSpeed;
  window.playDictationAudio = playDictationAudio;
  window.prevDictationSentence = prevDictationSentence;
  window.nextDictationSentence = nextDictationSentence;
  window.selectDictationSentence = selectDictationSentence;
  window.checkCurrentDictation = checkCurrentDictation;
  window.revealDictationAnswer = revealDictationAnswer;
  window.toggleDictationPinyinHint = toggleDictationPinyinHint;
  window.computeHanziDiff = computeHanziDiff;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    computeHanziDiff
  };
}
