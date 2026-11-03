// =========================================================================
// Spaced repetition (Leitner boxes) shared by Flashcards, Notebook and "Hôm nay"
// =========================================================================
// A card climbs one box per correct answer and falls back to box 1 on a miss;
// the box decides how many days until it is due again.
const SRS_STORAGE_KEY = 'yuhan_srs_v1';
const SRS_INTERVAL_DAYS = [0, 1, 2, 4, 7, 15, 30, 60, 120];
const SRS_MASTERED_BOX = 5;

let srsState = { cards: {}, reviewsByDay: {} };

function loadSrsState() {
  const saved = storage.get(SRS_STORAGE_KEY);
  if (saved && typeof saved === 'object' && saved.cards) {
    srsState = { cards: saved.cards || {}, reviewsByDay: saved.reviewsByDay || {} };
  }
  // Words saved before SRS existed join the deck automatically.
  (userProfile.savedWords || []).forEach(w => srsAddCard({ hanzi: w.hanzi, pinyin: w.pinyin, meaning: w.meaning, level: w.hsk }, false));
  saveSrsState();
}

function saveSrsState() {
  storage.set(SRS_STORAGE_KEY, srsState);
  scheduleProgressSync();
}

function addDays(dateKey, days) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return todayKey(new Date(y, m - 1, d + days));
}

/** Add a word to the deck (due today). Returns false if it was already there. */
function srsAddCard(word, persist = true) {
  if (!word || !word.hanzi) return false;
  if (srsState.cards[word.hanzi]) return false;
  srsState.cards[word.hanzi] = {
    hanzi: word.hanzi,
    pinyin: word.pinyin || '',
    meaning: word.meaning || '',
    level: word.level || 1,
    box: 0,
    due: todayKey(),
    reviews: 0,
    lapses: 0,
    addedAt: todayKey()
  };
  if (persist) saveSrsState();
  return true;
}

function srsRemoveCard(hanzi) {
  if (!srsState.cards[hanzi]) return;
  delete srsState.cards[hanzi];
  saveSrsState();
}

/** Record an answer. remembered=false sends the card back to box 1, due again today. */
function srsReview(hanzi, remembered) {
  const card = srsState.cards[hanzi];
  if (!card) return null;
  const today = todayKey();
  card.reviews += 1;
  card.lastReviewed = today;
  if (remembered) {
    card.box = Math.min(card.box + 1, SRS_INTERVAL_DAYS.length - 1);
  } else {
    card.box = 1;
    card.lapses += 1;
  }
  card.due = remembered ? addDays(today, SRS_INTERVAL_DAYS[card.box]) : today;
  srsState.reviewsByDay[today] = (srsState.reviewsByDay[today] || 0) + 1;
  saveSrsState();
  return card;
}

function srsDueCards() {
  const today = todayKey();
  return Object.values(srsState.cards)
    .filter(c => c.due <= today)
    .sort((a, b) => (a.due === b.due ? a.box - b.box : a.due < b.due ? -1 : 1));
}

function srsStats() {
  const cards = Object.values(srsState.cards);
  const today = todayKey();
  return {
    total: cards.length,
    due: cards.filter(c => c.due <= today).length,
    learning: cards.filter(c => c.box > 0 && c.box < SRS_MASTERED_BOX).length,
    mastered: cards.filter(c => c.box >= SRS_MASTERED_BOX).length,
    fresh: cards.filter(c => c.box === 0).length,
    reviewedToday: srsState.reviewsByDay[today] || 0
  };
}
