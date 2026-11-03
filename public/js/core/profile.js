// Gamification & Profile State (persisted in localStorage)
const PROFILE_STORAGE_KEY = 'yuhan_hsk_user_profile';
let userProfile = {
  streak: 1,
  exp: 0,
  lastStudyDate: todayKey(),
  savedWords: [],
  dailyGoal: 50,
  activity: {} // YYYY-MM-DD -> EXP earned that day
};
const ACTIVITY_KEEP_DAYS = 400;

// Gamification Functions
function loadUserProfile() {
  const saved = storage.get(PROFILE_STORAGE_KEY);
  if (saved && typeof saved === 'object') {
    userProfile = Object.assign(userProfile, saved);
  }
  if (!Array.isArray(userProfile.savedWords)) userProfile.savedWords = [];
  if (!userProfile.activity || typeof userProfile.activity !== 'object') userProfile.activity = {};
  if (!userProfile.dailyGoal) userProfile.dailyGoal = 50;

  // Check streak (local calendar days)
  const today = todayKey();
  if (userProfile.lastStudyDate !== today) {
    const lastDate = new Date(userProfile.lastStudyDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      userProfile.streak = (userProfile.streak || 1) + 1;
    } else if (diffDays > 1) {
      userProfile.streak = 1;
    }
    userProfile.lastStudyDate = today;
    saveUserProfile();
  }

  updateProfileUI();
}

function saveUserProfile() {
  storage.set(PROFILE_STORAGE_KEY, userProfile);
  updateProfileUI();
  scheduleProgressSync();
}

function addExp(points, reason) {
  userProfile.exp = (userProfile.exp || 0) + points;
  const today = todayKey();
  const before = userProfile.activity[today] || 0;
  userProfile.activity[today] = before + points;
  pruneActivity();
  saveUserProfile();
  if (before < userProfile.dailyGoal && userProfile.activity[today] >= userProfile.dailyGoal) {
    showToast(`🎯 Hoàn thành mục tiêu hôm nay: ${userProfile.dailyGoal} EXP!`, 'success');
  }
  if (typeof onProfileChanged === 'function') onProfileChanged();
}

function expToday() {
  return userProfile.activity[todayKey()] || 0;
}

function pruneActivity() {
  const keys = Object.keys(userProfile.activity).sort();
  while (keys.length > ACTIVITY_KEEP_DAYS) delete userProfile.activity[keys.shift()];
}

function setDailyGoal(points) {
  userProfile.dailyGoal = points;
  saveUserProfile();
  if (typeof onProfileChanged === 'function') onProfileChanged();
}

function updateProfileUI() {
  const streakEl = document.getElementById('headerStreak');
  const expEl = document.getElementById('headerExp');
  const notebookCountEl = document.getElementById('headerNotebookCount');
  
  if (streakEl) streakEl.innerText = userProfile.streak || 1;
  if (expEl) expEl.innerText = userProfile.exp || 0;
  if (notebookCountEl) notebookCountEl.innerText = (userProfile.savedWords || []).length;
  const dropdownCount = document.getElementById('dropdownNotebookCount');
  if (dropdownCount) dropdownCount.innerText = (userProfile.savedWords || []).length;
}

function isWordSaved(hanzi) {
  return (userProfile.savedWords || []).some(w => w.hanzi === hanzi);
}

/** Save or remove a word; returns true when the word is now saved. */
function toggleSaveWord(hanzi, pinyin, meaning, hsk = 1) {
  if (!userProfile.savedWords) userProfile.savedWords = [];
  const idx = userProfile.savedWords.findIndex(w => w.hanzi === hanzi);
  if (idx >= 0) {
    userProfile.savedWords.splice(idx, 1);
    srsRemoveCard(hanzi);
    showToast(`Đã xóa "${hanzi}" khỏi sổ tay.`);
  } else {
    userProfile.savedWords.push({ hanzi, pinyin, meaning, hsk, addedAt: new Date().toISOString() });
    srsAddCard({ hanzi, pinyin, meaning, level: hsk });
    addExp(5, 'Lưu từ mới vào sổ tay');
    showToast(`Đã lưu "${hanzi}" vào sổ tay — sẽ xuất hiện trong lượt ôn tập.`, 'success');
  }
  saveUserProfile();
  renderNotebookList();
  if (typeof onProfileChanged === 'function') onProfileChanged();
  return idx < 0;
}

/** Bookmark button in textbook lessons (id="btnSaveVocab-<hanzi>") mirrors the saved state. */
function toggleSaveWordFromLesson(hanzi, pinyin, meaning) {
  const saved = toggleSaveWord(hanzi, pinyin, meaning);
  const btn = document.getElementById(`btnSaveVocab-${hanzi}`);
  if (!btn) return;
  btn.className = saved
    ? 'p-1.5 rounded-lg bg-amber-500 text-white border-amber-500 transition-all cursor-pointer'
    : 'p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-amber-600 border-stone-200 transition-all cursor-pointer';
  btn.title = saved ? 'Đã lưu trong Sổ tay' : 'Lưu vào Sổ tay';
}

function openNotebookModal() {
  renderNotebookList();
  openModal('notebookModal');
}

function closeNotebookModal() {
  closeModal('notebookModal');
}
registerModal('notebookModal', closeNotebookModal);

function renderNotebookList() {
  const container = document.getElementById('notebookListContainer');
  const totalLabel = document.getElementById('notebookTotalLabel');
  if (!container) return;

  const words = userProfile.savedWords || [];
  if (totalLabel) totalLabel.innerText = `Đã lưu: ${words.length} từ`;

  if (words.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400 space-y-2">
        <i data-lucide="bookmark" class="w-8 h-8 mx-auto text-slate-300"></i>
        <p class="text-sm">Chưa có từ nào trong sổ tay!</p>
        <p class="text-xs text-slate-400">Hãy nhấn biểu tượng ⭐ ở thẻ từ điển hoặc từ vựng bài học để lưu lại.</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  container.innerHTML = words.map(w => `
    <div class="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 transition-all flex items-center justify-between gap-3 shadow-2xs">
      <div class="flex items-center gap-3">
        <span class="font-hanzi text-2xl font-bold text-slate-900 w-10 text-center">${escapeHtml(w.hanzi)}</span>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-teal-700 font-sans">${escapeHtml(w.pinyin)}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-semibold">HSK ${escapeHtml(w.hsk || 1)}</span>
          </div>
          <p class="text-xs text-slate-600 font-medium">${escapeHtml(w.meaning)}</p>
        </div>
      </div>
      <div class="flex items-center gap-1.5">
        <button onclick="playChineseTTS(${jsArg(w.hanzi)})" title="Nghe phát âm" class="p-2 rounded-xl bg-white hover:bg-teal-100 text-teal-700 border border-slate-200 transition-all">
          <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
        </button>
        <button onclick="closeNotebookModal(); openWritingModal(${jsArg(w.hanzi)}, ${jsArg(w.pinyin)}, ${jsArg(w.meaning)});" title="Luyện viết chữ này" class="p-2 rounded-xl bg-white hover:bg-rose-100 text-rose-700 border border-slate-200 transition-all">
          <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
        </button>
        <button onclick="toggleSaveWord(${jsArg(w.hanzi)}, '', '')" title="Xóa khỏi sổ tay" class="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-500 border border-slate-200 transition-all">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `).join('');

  refreshIcons();
}

async function reviewNotebookInFlashcards() {
  if (!(userProfile.savedWords || []).length) {
    showToast('Sổ tay của bạn hiện chưa có từ nào để ôn tập.');
    return;
  }
  closeNotebookModal();
  await switchTab('flashcards');
  startFlashcardSession('notebook');
}
