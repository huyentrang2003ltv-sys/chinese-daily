// =========================================================================
// TAB 5: FLASHCARD + SPACED REPETITION (KHO TỪ VỰNG TOÀN DIỆN HSK & CHỦ ĐỀ)
// =========================================================================

// Module state
let flashcardQueue = [];
let currentFlashcardIndex = 0;
let isCardFlipped = false;
let currentFlashcard = null;
let flashcardMode = 'due';
let flashcardNewLevel = 'all'; // 'all' or 1..6
let flashcardBatchSize = 10;   // 10, 20, 50, 100, or 0 (all)
let flashcardSelectedTopic = 'all'; // 'all' or topicId
let flashcardSession = { done: 0, remembered: 0 };
const FLASHCARD_NEW_BATCH = 10;

// Modes:
//   due      – Thẻ đến hạn ôn tập theo thuật toán ngắt quãng SRS Leitner
//   new      – Học từ mới HSK từ kho từ điển (toàn bộ 3.592 từ HSK 1 - 6)
//   topic    – Luyện từ vựng theo 125 chủ đề thực tế & chuyên ngành (14.605+ từ)
//   notebook – Ôn tập các từ vựng người học đã đánh dấu lưu vào sổ tay
//   browse   – Khám phá tự do toàn bộ kho từ vựng tiếng Trung
const FLASHCARD_MODES = {
  due: { label: 'Đến hạn ôn', icon: 'alarm-clock' },
  new: { label: 'Học từ mới (HSK)', icon: 'sparkles' },
  topic: { label: 'Theo chủ đề', icon: 'tag' },
  notebook: { label: 'Sổ tay', icon: 'bookmark' },
  browse: { label: 'Xem tự do', icon: 'shuffle' }
};

function initFlashcards() {
  document.removeEventListener('keydown', handleFlashcardKeys);
  document.addEventListener('keydown', handleFlashcardKeys);
  startFlashcardSession(srsStats().due ? 'due' : 'new');
}

/**
 * Chuẩn hóa một mục từ vựng thành đối tượng Flashcard đầy đủ 6 thông tin:
 * Chữ Hán, Pinyin, Âm Hán Việt, Nghĩa, Loại từ, Câu ví dụ song ngữ
 */
function toFlashcard(word, pos) {
  if (!word) return null;
  const hanzi = word.hanzi || word.title || '';
  const dict = (typeof dictionaryData !== 'undefined' && Array.isArray(dictionaryData))
    ? (dictionaryData.find(d => d.title === hanzi) || {})
    : {};
  const multi = (typeof multidimensionalWordsData === 'object' && multidimensionalWordsData && multidimensionalWordsData[hanzi])
    ? multidimensionalWordsData[hanzi]
    : {};

  let topicName = word.topicName || dict.topicName || '';
  const tid = word.topicId || dict.topicId;
  if (!topicName && tid && typeof topicsData !== 'undefined' && Array.isArray(topicsData)) {
    const topObj = topicsData.find(t => t.id === tid);
    if (topObj) topicName = `${topObj.icon ? topObj.icon + ' ' : ''}${topObj.name}`;
  }

  return {
    title: hanzi,
    pinyin: word.pinyin || dict.pinyin || multi.pinyin || '',
    meaning: word.meaning || dict.meaning || multi.meaning || '',
    level: word.level || dict.level || multi.level || 1,
    pos: pos || word.pos || dict.pos || multi.pos || 'Từ vựng',
    hanviet: word.hanviet || dict.hanviet || multi.hanviet || '',
    exampleSentence: word.exampleSentence || dict.exampleSentence || multi.exampleSentence || '',
    exampleMeaning: word.exampleMeaning || dict.exampleMeaning || multi.exampleMeaning || '',
    topicId: tid || '',
    topicName: topicName
  };
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Xây dựng hàng đợi thẻ flashcard cho phiên học dựa trên chế độ, cấp độ và số lượng thẻ đã chọn
 */
function buildFlashcardQueue(mode) {
  const dictList = (typeof dictionaryData !== 'undefined' && Array.isArray(dictionaryData)) ? dictionaryData : [];
  const themeList = (typeof thematicVocabData !== 'undefined' && Array.isArray(thematicVocabData) && thematicVocabData.length)
    ? thematicVocabData
    : dictList.filter(d => d.topicId);

  if (mode === 'due') {
    return srsDueCards().map(c => toFlashcard(c, c.box === 0 ? 'Từ mới' : `Ôn tập · hộp ${c.box}`));
  }

  if (mode === 'new') {
    let pool = dictList;
    if (flashcardNewLevel !== 'all') {
      const lvlNum = Number(flashcardNewLevel);
      pool = dictList.filter(d => d.level === lvlNum);
    }
    // Lọc các từ chưa được học trong hệ thống SRS
    let unseen = pool.filter(d => !srsState.cards[d.title]);
    if (!unseen.length) unseen = pool; // Nếu đã học hết thì cho phép ôn tập lại toàn bộ danh mục

    let result = shuffle(unseen);
    if (flashcardBatchSize > 0) {
      result = result.slice(0, flashcardBatchSize);
    }
    return result.map(d => toFlashcard(d, `Học mới · HSK ${d.level || 1}`));
  }

  if (mode === 'topic') {
    let pool = themeList;
    if (flashcardSelectedTopic !== 'all') {
      pool = themeList.filter(w => w.topicId === flashcardSelectedTopic);
    }
    let result = shuffle(pool);
    if (flashcardBatchSize > 0) {
      result = result.slice(0, flashcardBatchSize);
    }
    return result.map(w => toFlashcard(w, 'Theo chủ đề'));
  }

  if (mode === 'notebook') {
    let list = (userProfile.savedWords || []).map(w => toFlashcard({ ...w, level: w.hsk }, 'Từ vựng đã lưu'));
    if (flashcardBatchSize > 0 && list.length > flashcardBatchSize) {
      list = list.slice(0, flashcardBatchSize);
    }
    return list;
  }

  if (mode === 'browse') {
    let pool = dictList;
    if (flashcardNewLevel !== 'all') {
      const lvlNum = Number(flashcardNewLevel);
      pool = dictList.filter(d => d.level === lvlNum);
    }
    let result = shuffle(pool);
    if (flashcardBatchSize > 0) {
      result = result.slice(0, flashcardBatchSize);
    }
    return result.map(d => toFlashcard(d, 'Xem tự do'));
  }

  return shuffle(dictList).map(d => toFlashcard(d));
}

function startFlashcardSession(mode, options = {}) {
  flashcardMode = mode;
  if (options.level !== undefined) flashcardNewLevel = options.level;
  if (options.batchSize !== undefined) flashcardBatchSize = Number(options.batchSize);
  if (options.topic !== undefined) flashcardSelectedTopic = options.topic;

  if (options.customCards) {
    flashcardQueue = options.customCards;
  } else {
    flashcardQueue = buildFlashcardQueue(mode);
  }

  currentFlashcardIndex = 0;
  flashcardSession = { done: 0, remembered: 0 };
  renderFlashcardModeBar();
  updateFlashcardUI();
}

function setFlashcardNewLevel(level) {
  flashcardNewLevel = level === 'all' ? 'all' : Number(level);
  startFlashcardSession(flashcardMode);
}

function setFlashcardTopic(topicId) {
  flashcardSelectedTopic = topicId;
  startFlashcardSession('topic');
}

function setFlashcardBatchSize(size) {
  flashcardBatchSize = Number(size);
  startFlashcardSession(flashcardMode);
}

function renderBatchSizeSelect() {
  const options = [
    { value: 10, label: '10 thẻ / lượt' },
    { value: 20, label: '20 thẻ / lượt' },
    { value: 50, label: '50 thẻ / lượt' },
    { value: 100, label: '100 thẻ / lượt' },
    { value: 0, label: 'Tất cả thẻ' }
  ];
  return `
    <label class="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300 ml-1">
      <span>Số lượng:</span>
      <select onchange="setFlashcardBatchSize(this.value)" class="px-2.5 py-1.5 rounded-xl border border-amber-300/80 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs shadow-2xs cursor-pointer font-bold focus:ring-2 focus:ring-amber-400 outline-none">
        ${options.map(o => `<option value="${o.value}" ${o.value === flashcardBatchSize ? 'selected' : ''}>${o.label}</option>`).join('')}
      </select>
    </label>
  `;
}

function renderFlashcardModeBar() {
  const bar = document.getElementById('fcModeBar');
  if (!bar) return;
  const stats = srsStats();
  const dictCount = (typeof dictionaryData !== 'undefined' && Array.isArray(dictionaryData)) ? dictionaryData.length : 3592;
  const topicCount = (typeof thematicVocabData !== 'undefined' && Array.isArray(thematicVocabData) && thematicVocabData.length) ? thematicVocabData.length : 14605;

  const counts = {
    due: stats.due,
    new: dictCount,
    topic: topicCount,
    notebook: (userProfile.savedWords || []).length,
    browse: dictCount
  };

  const modeButtonsHtml = Object.entries(FLASHCARD_MODES).map(([id, m]) => `
    <button type="button" onclick="startFlashcardSession(${jsArg(id)})"
      class="nav-subtab ${id === flashcardMode ? 'is-active' : ''}" aria-pressed="${id === flashcardMode}">
      <i data-lucide="${m.icon}" class="w-4 h-4"></i>
      <span>${m.label}</span>
      ${counts[id] != null ? `<span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold ${counts[id] ? 'bg-[#8B1E1E] text-white' : 'bg-stone-200 dark:bg-stone-750 text-stone-600 dark:text-stone-300'}">${counts[id].toLocaleString()}</span>` : ''}
    </button>
  `).join('');

  let controlsHtml = '';
  if (flashcardMode === 'new' || flashcardMode === 'browse') {
    const lvlCounts = {};
    if (typeof dictionaryData !== 'undefined' && Array.isArray(dictionaryData)) {
      dictionaryData.forEach(d => { lvlCounts[d.level] = (lvlCounts[d.level] || 0) + 1; });
    }
    controlsHtml = `
      <div class="flex items-center gap-2 flex-wrap ml-auto">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300">
          <span>Cấp độ:</span>
          <select onchange="setFlashcardNewLevel(this.value)" class="px-2.5 py-1.5 rounded-xl border border-amber-300/80 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs shadow-2xs cursor-pointer font-bold focus:ring-2 focus:ring-amber-400 outline-none">
            <option value="all" ${flashcardNewLevel === 'all' ? 'selected' : ''}>Tất cả HSK 1 - 6 (${dictCount.toLocaleString()} từ)</option>
            ${[1, 2, 3, 4, 5, 6].map(l => `<option value="${l}" ${String(l) === String(flashcardNewLevel) ? 'selected' : ''}>HSK ${l} (${lvlCounts[l] || 0} từ)</option>`).join('')}
          </select>
        </label>
        ${renderBatchSizeSelect()}
      </div>
    `;
  } else if (flashcardMode === 'topic') {
    const topicsList = (typeof topicsData !== 'undefined' && Array.isArray(topicsData)) ? topicsData : [];
    controlsHtml = `
      <div class="flex items-center gap-2 flex-wrap ml-auto">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300">
          <span>Chủ đề:</span>
          <select onchange="setFlashcardTopic(this.value)" class="px-2.5 py-1.5 rounded-xl border border-amber-300/80 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs shadow-2xs cursor-pointer font-bold max-w-[240px] truncate focus:ring-2 focus:ring-amber-400 outline-none">
            <option value="all" ${flashcardSelectedTopic === 'all' ? 'selected' : ''}>🌟 Tất cả 125 chủ đề (${topicCount.toLocaleString()} từ)</option>
            ${topicsList.map(t => `<option value="${t.id}" ${t.id === flashcardSelectedTopic ? 'selected' : ''}>${t.icon || '🏷️'} ${t.name} (${t.count || ''} từ)</option>`).join('')}
          </select>
        </label>
        ${renderBatchSizeSelect()}
      </div>
    `;
  } else if (flashcardMode === 'notebook') {
    controlsHtml = `
      <div class="flex items-center gap-2 flex-wrap ml-auto">
        ${renderBatchSizeSelect()}
      </div>
    `;
  }

  bar.innerHTML = `<div class="flex items-center gap-2 flex-wrap w-full">${modeButtonsHtml}${controlsHtml}</div>`;

  const statsEl = document.getElementById('fcSrsStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <span title="Thẻ đến hạn ôn hôm nay">⏰ <b>${stats.due}</b> đến hạn</span>
      <span title="Thẻ đang trong quá trình ghi nhớ">📈 <b>${stats.learning}</b> đang học</span>
      <span title="Thẻ đã lên hộp ${SRS_MASTERED_BOX} trở lên">🏆 <b>${stats.mastered}</b> đã thuộc</span>
      <span title="Toàn bộ kho từ vựng tiếng Trung">📚 <b>${(dictCount + topicCount).toLocaleString()}</b> từ toàn kho</span>`;
  }
  refreshIcons(bar);
}

function updateFlashcardUI() {
  const stage = document.getElementById('fcStage');
  const empty = document.getElementById('fcEmptyState');
  const finished = currentFlashcardIndex >= flashcardQueue.length;

  const total = flashcardQueue.length;
  const masteredCountEl = document.getElementById('fcMasteredCount');
  const totalCountEl = document.getElementById('fcTotalCount');
  const progressBarEl = document.getElementById('fcProgressBar');

  if (masteredCountEl) masteredCountEl.innerText = Math.min(flashcardSession.done, total);
  if (totalCountEl) totalCountEl.innerText = total;
  if (progressBarEl) progressBarEl.style.width = `${total ? Math.round((Math.min(flashcardSession.done, total) / total) * 100) : 0}%`;

  if (!total || finished) {
    if (stage) stage.classList.add('hidden');
    if (empty) {
      empty.classList.remove('hidden');
      empty.innerHTML = renderFlashcardEmptyState(!total);
      refreshIcons(empty);
    }
    currentFlashcard = null;
    return;
  }

  if (stage) stage.classList.remove('hidden');
  if (empty) empty.classList.add('hidden');

  currentFlashcard = flashcardQueue[currentFlashcardIndex];
  isCardFlipped = false;

  const inner = document.getElementById('flashcardInner');
  if (inner) inner.classList.remove('rotate-y-180');

  const lvlBadge = document.getElementById('fcLevelBadge');
  if (lvlBadge) {
    if (currentFlashcard.topicName) {
      lvlBadge.innerText = currentFlashcard.topicName;
    } else if (currentFlashcard.level) {
      lvlBadge.innerText = `HSK ${currentFlashcard.level}`;
    } else {
      lvlBadge.innerText = 'Từ vựng';
    }
  }

  const frontHanzi = document.getElementById('fcFrontHanzi');
  if (frontHanzi) frontHanzi.innerText = currentFlashcard.title;

  const backPos = document.getElementById('fcBackPos');
  if (backPos) backPos.innerText = currentFlashcard.pos || 'Từ vựng';

  const backHanzi = document.getElementById('fcBackHanzi');
  if (backHanzi) backHanzi.innerText = currentFlashcard.title;

  const backPinyin = document.getElementById('fcBackPinyin');
  if (backPinyin) backPinyin.innerText = currentFlashcard.pinyin || '';

  const backHanviet = document.getElementById('fcBackHanviet');
  if (backHanviet) {
    if (currentFlashcard.hanviet) {
      backHanviet.innerText = `Âm HV: ${currentFlashcard.hanviet}`;
      backHanviet.classList.remove('hidden');
    } else {
      backHanviet.classList.add('hidden');
    }
  }

  const backMeaning = document.getElementById('fcBackMeaning');
  if (backMeaning) backMeaning.innerText = currentFlashcard.meaning || '';

  const exampleBox = document.getElementById('fcBackExampleBox');
  const exampleHanzi = document.getElementById('fcBackExampleHanzi');
  const exampleVi = document.getElementById('fcBackExampleVi');

  if (exampleBox && exampleHanzi) {
    if (currentFlashcard.exampleSentence) {
      exampleBox.classList.remove('hidden');
      exampleHanzi.innerText = currentFlashcard.exampleSentence;
      if (exampleVi) exampleVi.innerText = currentFlashcard.exampleMeaning || '';
    } else {
      exampleBox.classList.add('hidden');
    }
  }

  if (stage) refreshIcons(stage);
}

function renderFlashcardEmptyState(noCards) {
  const stats = srsStats();
  let title;
  let body;
  if (!noCards) {
    const pct = flashcardSession.done ? Math.round((flashcardSession.remembered / flashcardSession.done) * 100) : 0;
    title = '🎉 Hoàn thành lượt ôn flashcard!';
    body = `Bạn đã ôn ${flashcardSession.done} lượt thẻ, nhớ ngay ${pct}%. Thẻ trả lời sai sẽ quay lại sớm hơn theo lịch ôn ngắt quãng Leitner.`;
  } else if (flashcardMode === 'due') {
    title = 'Không còn thẻ nào đến hạn hôm nay 👏';
    body = stats.total
      ? 'Lịch ôn tập sẽ tự động nhắc bạn quay lại đúng lúc sắp quên. Trong lúc chờ, hãy học thêm từ mới HSK hoặc 125 chủ đề thực tế.'
      : 'Bộ thẻ ôn tập đang trống. Hãy bắt đầu với một lượt từ mới HSK hoặc lưu từ vào sổ tay cá nhân khi tra cứu từ điển.';
  } else if (flashcardMode === 'notebook') {
    title = 'Sổ tay từ vựng đang trống';
    body = 'Bấm biểu tượng 🔖 ở thẻ từ điển, bài học hoặc thành ngữ để lưu từ vào sổ tay cá nhân.';
  } else if (flashcardMode === 'topic') {
    title = 'Chủ đề này chưa có thẻ từ';
    body = 'Hãy chọn chủ đề khác trong danh sách 125 chủ đề phong phú.';
  } else {
    title = `Đã học hết các từ trong nhóm ${flashcardNewLevel === 'all' ? 'HSK 1 - 6' : 'HSK ' + flashcardNewLevel} 🎓`;
    body = 'Hãy chọn cấp độ khác, hoặc chọn "Tất cả thẻ" để luyện tập lại không giới hạn.';
  }
  return `
    <div class="glass-card rounded-3xl p-8 text-center space-y-4 border border-amber-200/80 bg-white/90 dark:bg-stone-900/90 shadow-xl">
      <h3 class="text-xl font-serif-luxury font-black text-stone-900 dark:text-stone-100">${title}</h3>
      <p class="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">${body}</p>
      <div class="flex flex-wrap justify-center gap-2 pt-2">
        ${stats.due && flashcardMode !== 'due' ? `<button type="button" onclick="startFlashcardSession('due')" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white text-sm font-bold shadow-md cursor-pointer">Ôn ${stats.due} thẻ đến hạn</button>` : ''}
        <button type="button" onclick="startFlashcardSession('new')" class="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-stone-750 border border-amber-300/80 text-amber-900 dark:text-amber-200 text-sm font-bold cursor-pointer">Học từ mới HSK</button>
        <button type="button" onclick="startFlashcardSession('topic')" class="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-stone-800 text-rose-900 dark:text-rose-200 border border-rose-300/80 text-sm font-bold cursor-pointer">Luyện 125 chủ đề</button>
        <button type="button" onclick="switchTab('home')" class="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-50 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm font-bold cursor-pointer">Về Trang Chủ</button>
      </div>
    </div>`;
}

function flipFlashcard() {
  if (!currentFlashcard) return;
  const inner = document.getElementById('flashcardInner');
  isCardFlipped = !isCardFlipped;
  if (inner) {
    if (isCardFlipped) {
      inner.classList.add('rotate-y-180');
    } else {
      inner.classList.remove('rotate-y-180');
    }
  }
}

function markFlashcard(remembered) {
  if (!currentFlashcard) return;
  const card = currentFlashcard;

  if (flashcardMode === 'browse') {
    if (!remembered && srsAddCard({ hanzi: card.title, pinyin: card.pinyin, meaning: card.meaning, level: card.level })) {
      showToast(`Đã thêm "${card.title}" vào lịch ôn tập ngắt quãng.`);
    }
  } else {
    srsAddCard({ hanzi: card.title, pinyin: card.pinyin, meaning: card.meaning, level: card.level });
    srsReview(card.title, remembered);
    // Nếu chưa nhớ, cho thẻ quay lại một lần nữa vào cuối phiên học này
    if (!remembered && !card.requeued) {
      flashcardQueue.push({ ...card, requeued: true });
    }
  }

  flashcardSession.done += 1;
  if (remembered) flashcardSession.remembered += 1;
  addExp(remembered ? 2 : 1, 'Ôn tập flashcard');

  currentFlashcardIndex += 1;
  renderFlashcardModeBar();
  updateFlashcardUI();
}

function handleFlashcardKeys(e) {
  if (activeTab !== 'flashcards' || !currentFlashcard) return;
  if (document.querySelector('[aria-modal="true"]:not(.hidden)')) return;
  if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) return;
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    flipFlashcard();
  } else if (e.key === '1') {
    markFlashcard(false);
  } else if (e.key === '2') {
    markFlashcard(true);
  }
}

// Window globals
window.initFlashcards = initFlashcards;
window.startFlashcardSession = startFlashcardSession;
window.setFlashcardNewLevel = setFlashcardNewLevel;
window.setFlashcardTopic = setFlashcardTopic;
window.setFlashcardBatchSize = setFlashcardBatchSize;
window.flipFlashcard = flipFlashcard;
window.markFlashcard = markFlashcard;
window.handleFlashcardKeys = handleFlashcardKeys;
window.toFlashcard = toFlashcard;
window.buildFlashcardQueue = buildFlashcardQueue;
window.getFlashcardQueue = () => flashcardQueue;
window.getCurrentFlashcard = () => currentFlashcard;
