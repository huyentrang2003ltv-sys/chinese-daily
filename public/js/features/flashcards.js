// Module state
let flashcardQueue = [];
let currentFlashcardIndex = 0;
let isCardFlipped = false;
let currentFlashcard = null;
let flashcardMode = 'due';
let flashcardNewLevel = 1;
let flashcardSession = { done: 0, remembered: 0 };
const FLASHCARD_NEW_BATCH = 10;

// ---------------- TAB 5: FLASHCARD + SPACED REPETITION ----------------
// Modes:
//   due      – cards whose SRS due date has arrived (default when any are due)
//   new      – a batch of unseen dictionary words from one HSK level
//   notebook – every word saved in the notebook, due or not
//   browse   – the whole dictionary shuffled; "Chưa nhớ" adds the word to the SRS deck
const FLASHCARD_MODES = {
  due: { label: 'Đến hạn ôn', icon: 'alarm-clock' },
  new: { label: 'Học từ mới', icon: 'sparkles' },
  notebook: { label: 'Sổ tay', icon: 'bookmark' },
  browse: { label: 'Xem tự do', icon: 'shuffle' }
};

function initFlashcards() {
  document.addEventListener('keydown', handleFlashcardKeys);
  startFlashcardSession(srsStats().due ? 'due' : 'new');
}

function toFlashcard(word, pos) {
  const dict = dictionaryData.find(d => d.title === (word.hanzi || word.title)) || {};
  return {
    title: word.hanzi || word.title,
    pinyin: word.pinyin || dict.pinyin || '',
    meaning: word.meaning || dict.meaning || '',
    level: word.level || dict.level || 1,
    pos: pos || dict.pos || 'Từ vựng',
    exampleSentence: dict.exampleSentence,
    exampleMeaning: dict.exampleMeaning
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

function buildFlashcardQueue(mode) {
  if (mode === 'due') {
    return srsDueCards().map(c => toFlashcard(c, c.box === 0 ? 'Từ mới' : `Ôn tập · hộp ${c.box}`));
  }
  if (mode === 'new') {
    const unseen = dictionaryData.filter(d => d.level === flashcardNewLevel && !srsState.cards[d.title]);
    return shuffle(unseen).slice(0, FLASHCARD_NEW_BATCH).map(d => toFlashcard(d, 'Từ mới'));
  }
  if (mode === 'notebook') {
    return (userProfile.savedWords || []).map(w => toFlashcard({ ...w, level: w.hsk }, 'Từ vựng đã lưu'));
  }
  return shuffle(dictionaryData).map(d => toFlashcard(d));
}

function startFlashcardSession(mode, options = {}) {
  flashcardMode = mode;
  if (options.level) flashcardNewLevel = options.level;
  flashcardQueue = buildFlashcardQueue(mode);
  currentFlashcardIndex = 0;
  flashcardSession = { done: 0, remembered: 0 };
  renderFlashcardModeBar();
  updateFlashcardUI();
}

function setFlashcardNewLevel(level) {
  startFlashcardSession('new', { level: Number(level) });
}

function renderFlashcardModeBar() {
  const bar = document.getElementById('fcModeBar');
  if (!bar) return;
  const stats = srsStats();
  const counts = { due: stats.due, notebook: (userProfile.savedWords || []).length };
  bar.innerHTML = Object.entries(FLASHCARD_MODES).map(([id, m]) => `
    <button type="button" onclick="startFlashcardSession(${jsArg(id)})"
      class="nav-subtab ${id === flashcardMode ? 'is-active' : ''}" aria-pressed="${id === flashcardMode}">
      <i data-lucide="${m.icon}" class="w-4 h-4"></i>
      <span>${m.label}</span>
      ${counts[id] != null ? `<span class="px-1.5 rounded-full text-[10px] ${counts[id] ? 'bg-[#8B1E1E] text-white' : 'bg-stone-200 text-stone-600'}">${counts[id]}</span>` : ''}
    </button>
  `).join('') + (flashcardMode === 'new' ? `
    <label class="flex items-center gap-2 text-xs font-semibold text-stone-600 ml-1">
      Cấp độ
      <select onchange="setFlashcardNewLevel(this.value)" class="px-2 py-1.5 rounded-lg border border-amber-200 bg-white text-stone-800 text-xs">
        ${[1, 2, 3, 4, 5, 6].map(l => `<option value="${l}" ${l === flashcardNewLevel ? 'selected' : ''}>HSK ${l}</option>`).join('')}
      </select>
    </label>` : '');

  const statsEl = document.getElementById('fcSrsStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <span title="Thẻ đến hạn ôn hôm nay">⏰ ${stats.due} đến hạn</span>
      <span title="Thẻ đang trong quá trình ghi nhớ">📈 ${stats.learning} đang học</span>
      <span title="Thẻ đã lên hộp ${SRS_MASTERED_BOX} trở lên">🏆 ${stats.mastered} đã thuộc</span>`;
  }
  refreshIcons(bar);
}

function updateFlashcardUI() {
  const stage = document.getElementById('fcStage');
  const empty = document.getElementById('fcEmptyState');
  const finished = currentFlashcardIndex >= flashcardQueue.length;

  // Session progress
  const total = flashcardQueue.length;
  document.getElementById('fcMasteredCount').innerText = Math.min(flashcardSession.done, total);
  document.getElementById('fcTotalCount').innerText = total;
  document.getElementById('fcProgressBar').style.width = `${total ? Math.round((Math.min(flashcardSession.done, total) / total) * 100) : 0}%`;

  if (!total || finished) {
    stage.classList.add('hidden');
    empty.classList.remove('hidden');
    empty.innerHTML = renderFlashcardEmptyState(!total);
    refreshIcons(empty);
    currentFlashcard = null;
    return;
  }
  stage.classList.remove('hidden');
  empty.classList.add('hidden');

  currentFlashcard = flashcardQueue[currentFlashcardIndex];
  isCardFlipped = false;

  const inner = document.getElementById('flashcardInner');
  inner.classList.remove('rotate-y-180');

  document.getElementById('fcLevelBadge').innerText = `HSK ${currentFlashcard.level}`;
  document.getElementById('fcFrontHanzi').innerText = currentFlashcard.title;

  document.getElementById('fcBackPos').innerText = currentFlashcard.pos || 'Từ vựng';
  document.getElementById('fcBackHanzi').innerText = currentFlashcard.title;
  document.getElementById('fcBackPinyin').innerText = currentFlashcard.pinyin;
  document.getElementById('fcBackMeaning').innerText = currentFlashcard.meaning;

  if (currentFlashcard.exampleSentence) {
    document.getElementById('fcBackExampleBox').classList.remove('hidden');
    document.getElementById('fcBackExampleHanzi').innerText = currentFlashcard.exampleSentence;
    document.getElementById('fcBackExampleVi').innerText = currentFlashcard.exampleMeaning || '';
  } else {
    document.getElementById('fcBackExampleBox').classList.add('hidden');
  }

  refreshIcons(stage);
}

function renderFlashcardEmptyState(noCards) {
  const stats = srsStats();
  let title;
  let body;
  if (!noCards) {
    const pct = flashcardSession.done ? Math.round((flashcardSession.remembered / flashcardSession.done) * 100) : 0;
    title = '🎉 Hoàn thành lượt ôn!';
    body = `Bạn đã ôn ${flashcardSession.done} lượt thẻ, nhớ ngay ${pct}%. Thẻ trả lời sai sẽ quay lại sớm hơn theo lịch ôn ngắt quãng.`;
  } else if (flashcardMode === 'due') {
    title = 'Không còn thẻ nào đến hạn hôm nay 👏';
    body = stats.total
      ? 'Lịch ôn tập sẽ gọi bạn quay lại đúng lúc sắp quên. Trong lúc chờ, hãy học thêm vài từ mới.'
      : 'Bộ thẻ của bạn đang trống. Hãy bắt đầu với 10 từ mới hoặc lưu từ vào sổ tay khi tra cứu.';
  } else if (flashcardMode === 'notebook') {
    title = 'Sổ tay đang trống';
    body = 'Bấm biểu tượng 🔖 ở thẻ từ điển, bài học hoặc thành ngữ để lưu từ vào sổ tay.';
  } else {
    title = `Bạn đã học hết từ HSK ${flashcardNewLevel} trong kho 🎓`;
    body = 'Hãy chọn cấp độ khác hoặc chuyển sang ôn tập các thẻ đến hạn.';
  }
  return `
    <div class="glass-card rounded-3xl p-8 text-center space-y-4 border border-amber-200/80">
      <h3 class="text-xl font-serif-luxury font-black text-stone-900">${title}</h3>
      <p class="text-sm text-stone-600 max-w-md mx-auto">${body}</p>
      <div class="flex flex-wrap justify-center gap-2 pt-2">
        ${stats.due && flashcardMode !== 'due' ? `<button type="button" onclick="startFlashcardSession('due')" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white text-sm font-bold">Ôn ${stats.due} thẻ đến hạn</button>` : ''}
        <button type="button" onclick="startFlashcardSession('new')" class="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-sm font-bold">Học ${FLASHCARD_NEW_BATCH} từ mới HSK ${flashcardNewLevel}</button>
        <button type="button" onclick="switchTab('today')" class="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-sm font-bold">Về trang Hôm nay</button>
      </div>
    </div>`;
}

function flipFlashcard() {
  if (!currentFlashcard) return;
  const inner = document.getElementById('flashcardInner');
  isCardFlipped = !isCardFlipped;
  if (isCardFlipped) {
    inner.classList.add('rotate-y-180');
  } else {
    inner.classList.remove('rotate-y-180');
  }
}

function markFlashcard(remembered) {
  if (!currentFlashcard) return;
  const card = currentFlashcard;

  if (flashcardMode === 'browse') {
    // Free browsing never touches the schedule, except to queue a forgotten word for review.
    if (!remembered && srsAddCard({ hanzi: card.title, pinyin: card.pinyin, meaning: card.meaning, level: card.level })) {
      showToast(`Đã thêm "${card.title}" vào lịch ôn tập.`);
    }
  } else {
    srsAddCard({ hanzi: card.title, pinyin: card.pinyin, meaning: card.meaning, level: card.level });
    srsReview(card.title, remembered);
    // A missed card comes back once more at the end of this session.
    if (!remembered && !card.requeued) flashcardQueue.push({ ...card, requeued: true });
  }

  flashcardSession.done += 1;
  if (remembered) flashcardSession.remembered += 1;
  addExp(remembered ? 2 : 1, 'Ôn tập flashcard');

  currentFlashcardIndex += 1;
  renderFlashcardModeBar();
  updateFlashcardUI();
}

// Space / Enter flips, 1 = chưa nhớ, 2 = đã thuộc (only while the flashcard tab is visible)
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
