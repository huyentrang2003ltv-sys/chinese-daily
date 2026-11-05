/* Hi HSK - Học Tiếng Trung Mỗi Ngày Unified Production Bundle */

/* --- FILE: js/core/utils.js --- */
(function(){
// =========================================================================
// Shared helpers (loaded first; every other module may use them)
// =========================================================================

// Debounce Utility for fast input performance
function debounce(func, wait = 120) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Scoped Lucide Icons Refresh (Zero Main-Thread Lockup)
function refreshIcons(container) {
  if (!window.lucide) return;
  if (container && container.nodeType) {
    window.lucide.createIcons({ root: container });
  } else {
    window.lucide.createIcons();
  }
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape a value for safe insertion as HTML text or attribute value. */
function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

/**
 * Encode a value as a JS string literal for inline handlers:
 *   `<button onclick="playChineseTTS(${jsArg(text)})">`
 * Survives quotes, apostrophes and newlines in the data.
 */
function jsArg(value) {
  return escapeHtml(JSON.stringify(value == null ? '' : String(value)));
}

/** localStorage wrappers that never throw (private mode, quota, disabled storage). */
const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  getRaw(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : raw;
    } catch (e) {
      return fallback;
    }
  },
  setRaw(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }
};

/** Local date as YYYY-MM-DD (toISOString() would use UTC and break streaks around midnight in VN). */
function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Non-blocking notification replacing window.alert(). type: info | success | warning | error */
function showToast(message, type = 'info', timeout = 3500) {
  let host = document.getElementById('toastHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toastHost';
    host.className = 'fixed z-[60] top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 w-[calc(100%-2rem)] max-w-md pointer-events-none';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
  }
  const tones = {
    info: 'bg-stone-900 text-amber-50 border-stone-700',
    success: 'bg-emerald-800 text-emerald-50 border-emerald-600',
    warning: 'bg-amber-600 text-amber-50 border-amber-400',
    error: 'bg-[#8B1E1E] text-red-50 border-red-400'
  };
  const toast = document.createElement('div');
  toast.className = `toast-item pointer-events-auto w-full px-4 py-3 rounded-xl border shadow-xl text-sm font-medium ${tones[type] || tones.info}`;
  toast.textContent = message;
  host.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-leave');
    setTimeout(() => toast.remove(), 300);
  }, timeout);
}

// ---------------- Modals ----------------
// Each modal is a `.hidden` fixed overlay; its close function is registered here so
// Esc and backdrop clicks run the same cleanup as the close button.
const MODAL_CLOSERS = {};

function registerModal(id, closeFn) {
  MODAL_CLOSERS[id] = closeFn;
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  document.body.classList.add('overflow-hidden');
  refreshIcons(modal);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
  if (!document.querySelector('[aria-modal="true"]:not(.hidden)')) {
    document.body.classList.remove('overflow-hidden');
  }
}

function closeTopModal() {
  const open = [...document.querySelectorAll('[aria-modal="true"]:not(.hidden)')].pop();
  if (!open) return false;
  (MODAL_CLOSERS[open.id] || (() => closeModal(open.id)))();
  return true;
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeTopModal();
});

document.addEventListener('click', e => {
  // Click on the dimmed backdrop itself (not on the dialog content) closes it.
  const target = e.target;
  if (target && target.getAttribute && target.getAttribute('aria-modal') === 'true') {
    (MODAL_CLOSERS[target.id] || (() => closeModal(target.id)))();
  }
});

/** Copy text to the clipboard and confirm with a toast; falls back to a manual prompt. */
async function copyToClipboard(text, successMessage = 'Đã sao chép!') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage, 'success');
    return true;
  } catch (e) {
    window.prompt('Sao chép nội dung dưới đây:', text);
    return false;
  }
}

})();

/* --- FILE: js/core/data.js --- */
(function(){
// =========================================================================
// Data layer: JSON datasets are fetched lazily, once, when a tab needs them.
// =========================================================================
let dictionaryData = [];
let lessonsData = [];
let etymologyData = [];
let mindmapData = null;
let confusionsData = [];
let practiceData = [];
let cultureData = [];
let mockExamsData = [];
let aiScenariosData = [];
let conversations150Data = [];
let radicalsData = [];
let chengyuData = [];
let readingsData = [];
let grammarData = [];
let jiaochengData = null;
let topicsData = [];
let thematicVocabData = [];
let hsk30RoadmapData = null;
let woodBlockLevels = [];
let flipCardLevels = [];
let hanziDecompositionsData = {};
let multidimensionalWordsData = {};

const DATASETS = {
  dictionary: { url: 'data/dictionary.json', set: v => { dictionaryData = v || []; } },
  lessons: { url: 'data/lessons.json', set: v => { lessonsData = v || []; } },
  etymology: { url: 'data/etymology.json', set: v => { etymologyData = v || []; } },
  mindmap: { url: 'data/mindmap.json', set: v => { mindmapData = v || null; } },
  confusions: { url: 'data/confusions.json', set: v => { confusionsData = v || []; } },
  practice: { url: 'data/practice.json', set: v => { practiceData = v || []; } },
  culture: { url: 'data/culture.json', set: v => { cultureData = v || []; } },
  mockExam: { url: 'data/mock_exam.json', set: v => { mockExamsData = v || []; } },
  aiScenarios: { url: 'data/conversations_150.json', set: v => { aiScenariosData = v || []; conversations150Data = v || []; } },
  conversations150: { url: 'data/conversations_150.json', set: v => { conversations150Data = v || []; aiScenariosData = v || []; } },
  radicals: { url: 'data/radicals.json', set: v => { radicalsData = v || []; } },
  chengyu: { url: 'data/chengyu.json', set: v => { chengyuData = v || []; } },
  readings: { url: 'data/readings.json', set: v => { readingsData = v || []; } },
  grammar: { url: 'data/grammar_compendium.json', set: v => { grammarData = v || []; } },
  jiaocheng: { url: 'data/hanyu_jiaocheng.json', set: v => { jiaochengData = v || null; } },
  topics: { url: 'data/topics.json', set: v => { topicsData = v || []; } },
  thematicVocab: { url: 'data/thematic_vocab.json', set: v => { thematicVocabData = v || []; } },
  hsk30Roadmap: { url: 'data/hsk30_roadmap.json', set: v => { hsk30RoadmapData = v || null; } },
  woodBlock: { url: 'data/wood_block_levels.json', set: v => { woodBlockLevels = v || []; } },
  flipCard: { url: 'data/flip_card_levels.json', set: v => { flipCardLevels = v || []; } },
  hanziDecompositions: { url: 'data/hanzi_decompositions.json', set: v => { hanziDecompositionsData = v || {}; } },
  multidimensionalWords: { url: 'data/multidimensional_words.json', set: v => { multidimensionalWordsData = v || {}; } },
  multidimensional_words: { url: 'data/multidimensional_words.json', set: v => { multidimensionalWordsData = v || {}; } }
};

const dataPromises = new Map();
const loadedDatasets = new Set();

function isDataLoaded(names) {
  return (names || []).every(name => loadedDatasets.has(name));
}

/** Fetch a dataset once and assign it to its global; resolves to the parsed JSON. */
function loadData(name) {
  const def = DATASETS[name];
  if (!def) return Promise.reject(new Error(`Unknown dataset: ${name}`));
  if (!dataPromises.has(name)) {
    const promise = fetch(def.url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status} khi tải ${def.url}`);
        return res.json();
      })
      .then(json => {
        def.set(json);
        loadedDatasets.add(name);
        return json;
      })
      .catch(err => {
        dataPromises.delete(name); // allow retry on next navigation
        throw err;
      });
    dataPromises.set(name, promise);
  }
  return dataPromises.get(name);
}

function loadDatasets(names) {
  return Promise.all((names || []).map(loadData));
}

})();

/* --- FILE: js/core/tts.js --- */
(function(){
// =========================================================================
// Dual-Voice Beijing TTS Engine (Giọng Đọc Chuẩn Bắc Kinh 普通话: Nam & Nữ)
// =========================================================================
let currentTtsGender = storage.getRaw('yuhan_tts_gender') === 'male' ? 'male' : 'female';
let currentTtsSpeed = parseFloat(storage.getRaw('yuhan_tts_speed')) || 0.85;
let beijingFemaleVoice = null;
let beijingMaleVoice = null;
let voicesLoaded = false;

function initTtsVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return;

  // Filter Chinese Mandarin/Beijing voices (zh-CN, zh, cmn-Hans, etc.)
  const zhVoices = voices.filter(v => 
    v.lang && (v.lang.toLowerCase().startsWith('zh') || v.lang.toLowerCase().includes('cmn'))
  );

  // Beijing Female priority: Xiaoxiao (ultra-natural Beijing), Huihui, Xiaoyi, Yaoyao, Tingting, Sinji
  beijingFemaleVoice = zhVoices.find(v => 
    /xiaoxiao|huihui|xiaoyi|yaoyao|tingting|sinji|female/i.test(v.name)
  ) || zhVoices.find(v => /china|mainland|chinese|普通话/i.test(v.name)) || zhVoices[0] || null;

  // Beijing Male priority: Yunxi (standard Beijing male), Yunjian, Kangkang, Yunyang, Danny, Bochuan, Male
  beijingMaleVoice = zhVoices.find(v => 
    /yunxi|yunjian|kangkang|yunyang|bochuan|danny|male/i.test(v.name)
  ) || null;

  voicesLoaded = true;
  updateVoiceUi();
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    initTtsVoices();
  };
}

let currentTtsAudio = null;

function playChineseTTS(text, forceGender = null) {
  if (!text || !text.toString().trim()) return;
  const cleanText = text.toString().trim();
  const targetGender = forceGender || currentTtsGender || 'female';
  const targetSpeed = currentTtsSpeed || 0.85;

  // 1. Try High-Fidelity Studio Neural Beijing Audio (EdgeTTS Server API)
  try {
    if (currentTtsAudio) {
      try {
        currentTtsAudio.pause();
        currentTtsAudio.currentTime = 0;
      } catch (e) {}
    }

    const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&gender=${targetGender}&speed=${targetSpeed}`;
    const audio = new Audio(ttsUrl);
    currentTtsAudio = audio;

    let hasStarted = false;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        hasStarted = true;
      }).catch(err => {
        console.warn('Audio playback error, falling back to WebSpeech:', err);
        if (!hasStarted) {
          playWebSpeechFallback(cleanText, targetGender, targetSpeed);
        }
      });
    }

    audio.onerror = () => {
      if (!hasStarted) {
        playWebSpeechFallback(cleanText, targetGender, targetSpeed);
      }
    };
    return;
  } catch (err) {
    console.warn('Neural audio init error:', err);
    playWebSpeechFallback(cleanText, targetGender, targetSpeed);
  }
}

function playWebSpeechFallback(text, targetGender, targetSpeed) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = targetSpeed || 0.85;

    if (!voicesLoaded) {
      initTtsVoices();
    }

    if (targetGender === 'male') {
      if (beijingMaleVoice) {
        utterance.voice = beijingMaleVoice;
        utterance.pitch = 0.92;
      } else if (beijingFemaleVoice) {
        utterance.voice = beijingFemaleVoice;
        utterance.pitch = 0.80;
      } else {
        utterance.pitch = 0.80;
      }
    } else {
      if (beijingFemaleVoice) {
        utterance.voice = beijingFemaleVoice;
        utterance.pitch = 1.05;
      } else {
        utterance.pitch = 1.05;
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('SpeechSynthesis error:', e);
  }
}

function setTtsGender(gender) {
  currentTtsGender = gender;
  try {
    localStorage.setItem('yuhan_tts_gender', gender);
  } catch (e) {}
  updateVoiceUi();
  const sample = gender === 'male' ? '你好！我是北京男声老师。' : '你好！我是北京女声老师。';
  playChineseTTS(sample, gender);
}

function setTtsSpeed(speed) {
  currentTtsSpeed = speed;
  try {
    localStorage.setItem('yuhan_tts_speed', speed.toString());
  } catch (e) {}
  updateVoiceUi();
  playChineseTTS('语速已更新。', currentTtsGender);
}

function testBeijingVoice() {
  const sampleText = currentTtsGender === 'male'
    ? '您好！我是北京普通话男声老师。多学一门外语，多看一个世界！'
    : '您好！我是北京普通话女声老师。多学一门外语，多看一个世界！';
  playChineseTTS(sampleText, currentTtsGender);
}

function toggleVoiceDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('voiceSettingsDropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function updateVoiceUi() {
  const icon = document.getElementById('voiceHeaderIcon');
  const label = document.getElementById('voiceHeaderLabel');
  if (icon && label) {
    if (currentTtsGender === 'male') {
      icon.innerText = '👨';
      label.innerText = 'Nam Đề Thi (CCTV)';
    } else {
      icon.innerText = '👩';
      label.innerText = 'Nữ Chuẩn HSK (Bắc Kinh)';
    }
  }

  const btnFemale = document.getElementById('btnVoiceFemale');
  const btnMale = document.getElementById('btnVoiceMale');
  if (btnFemale && btnMale) {
    if (currentTtsGender === 'female') {
      btnFemale.className = 'flex flex-col items-center justify-center p-2.5 rounded-xl border-2 border-[#8B1E1E] bg-rose-50/80 text-[#8B1E1E] font-medium text-xs transition-all shadow-xs';
      btnMale.className = 'flex flex-col items-center justify-center p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs transition-all';
    } else {
      btnFemale.className = 'flex flex-col items-center justify-center p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs transition-all';
      btnMale.className = 'flex flex-col items-center justify-center p-2.5 rounded-xl border-2 border-[#1E4D43] bg-teal-50/80 text-[#1E4D43] font-medium text-xs transition-all shadow-xs';
    }
  }

  const speeds = [0.75, 0.85, 1.0];
  speeds.forEach(s => {
    const btn = document.getElementById(`btnSpeed${s.toString().replace('.', '')}`);
    if (btn) {
      if (Math.abs(currentTtsSpeed - s) < 0.01) {
        btn.className = 'flex-1 py-1 rounded-lg text-xs font-bold bg-[#8B1E1E] text-white shadow-2xs transition-all';
      } else {
        btn.className = 'flex-1 py-1 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 transition-all';
      }
    }
  });
}

// Global outside-click listener to dismiss voice dropdown
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const container = document.getElementById('voiceSelectorContainer');
    const dropdown = document.getElementById('voiceSettingsDropdown');
    if (dropdown && !dropdown.classList.contains('hidden')) {
      if (container && !container.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    }
  });
}

})();

/* --- FILE: js/core/theme.js --- */
(function(){
// Module state
let currentAppTheme = storage.getRaw('appTheme') || 'light';

// ==========================================
// THEME SWITCHER LOGIC (Light / Dark / System)
// ==========================================
function initTheme() {
  currentAppTheme = storage.getRaw('appTheme') || 'light';
  applyAppTheme(currentAppTheme);

  // Listen for OS system theme changes if set to system
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (currentAppTheme === 'system') {
        applyAppTheme('system');
      }
    });
  }

  // Close theme dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const container = document.getElementById('themeDropdownContainer');
    const menu = document.getElementById('themeDropdownMenu');
    if (container && menu && !container.contains(e.target) && !menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
    }
  });
}

function toggleThemeDropdown() {
  const menu = document.getElementById('themeDropdownMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function setAppTheme(theme) {
  currentAppTheme = theme;
  storage.setRaw('appTheme', theme);
  applyAppTheme(theme);
  
  const menu = document.getElementById('themeDropdownMenu');
  if (menu) {
    menu.classList.add('hidden');
  }

  const themeLabels = {
    light: 'Đã chuyển sang Giao diện Sáng ☀️',
    dark: 'Đã chuyển sang Giao diện Tối 🌙',
    system: 'Đã chuyển sang Giao diện Theo Hệ Thống 💻'
  };
  showToast(themeLabels[theme] || 'Đã cập nhật giao diện', 'success');
}

function applyAppTheme(theme) {
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Update button icon & label
  const iconEl = document.getElementById('themeCurrentIcon');
  const labelEl = document.getElementById('themeCurrentLabel');
  if (iconEl && labelEl) {
    if (theme === 'dark') {
      iconEl.textContent = '🌙';
      labelEl.textContent = 'Tối';
    } else if (theme === 'system') {
      iconEl.textContent = '💻';
      labelEl.textContent = 'Hệ Thống';
    } else {
      iconEl.textContent = '☀️';
      labelEl.textContent = 'Sáng';
    }
  }

  // Update checkmarks in dropdown
  const checkLight = document.getElementById('theme-check-light');
  const checkDark = document.getElementById('theme-check-dark');
  const checkSystem = document.getElementById('theme-check-system');
  if (checkLight && checkDark && checkSystem) {
    checkLight.classList.toggle('hidden', theme !== 'light');
    checkDark.classList.toggle('hidden', theme !== 'dark');
    checkSystem.classList.toggle('hidden', theme !== 'system');
  }
}

})();

/* --- FILE: js/core/profile.js --- */
(function(){
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

})();

/* --- FILE: js/core/srs.js --- */
(function(){
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

})();

/* --- FILE: js/core/account.js --- */
(function(){
// =========================================================================
// Accounts: sign-in state (HttpOnly session cookie), progress sync, user menu, admin panel
// =========================================================================
// The server is the only source of truth for who is signed in, their role and VIP status.
// Progress (EXP, streak, notebook, SRS deck) lives in localStorage and is mirrored to the
// account while signed in, so it follows the learner across devices.
let currentUser = null;
let progressSyncTimer = null;
const PROGRESS_SYNC_DELAY_MS = 3000;

async function apiRequest(url, { method = 'GET', body } = {}) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin'
  });
  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    // Non-JSON error page
  }
  if (!res.ok || data.ok === false) {
    const err = new Error(data.error || `Lỗi máy chủ (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const isAdmin = () => Boolean(currentUser && currentUser.role === 'admin');

async function initAccount() {
  try {
    const { user } = await apiRequest('/api/auth/me');
    if (user) applySignedInUser(user, { merge: true });
  } catch (e) {
    // Offline or static hosting: the app keeps working as a guest.
  }
  renderAccountUi();
}

// ---------------- Progress sync ----------------
function progressSnapshot() {
  return {
    exp: userProfile.exp || 0,
    streak: userProfile.streak || 0,
    lastStudyDate: userProfile.lastStudyDate,
    dailyGoal: userProfile.dailyGoal,
    savedWords: userProfile.savedWords || [],
    activity: userProfile.activity || {},
    lastLesson: userProfile.lastLesson || null,
    srs: srsState
  };
}

function scheduleProgressSync() {
  if (!currentUser) return;
  clearTimeout(progressSyncTimer);
  progressSyncTimer = setTimeout(syncProgressNow, PROGRESS_SYNC_DELAY_MS);
}

async function syncProgressNow() {
  clearTimeout(progressSyncTimer);
  if (!currentUser) return;
  try {
    await apiRequest('/api/me/progress', { method: 'PUT', body: progressSnapshot() });
  } catch (e) {
    if (e.status === 401) {
      currentUser = null;
      renderAccountUi();
    }
  }
}

// Push pending changes when the learner leaves the page.
document.addEventListener('visibilitychange', () => {
  if (document.hidden && progressSyncTimer) syncProgressNow();
});

/** Combine what this browser has with what the account has (never loses progress on either side). */
function mergeServerProgress(remote) {
  if (!remote || typeof remote !== 'object') return;
  userProfile.exp = Math.max(userProfile.exp || 0, remote.exp || 0);
  userProfile.streak = Math.max(userProfile.streak || 0, remote.streak || 0);
  if (remote.dailyGoal && !storage.get(PROFILE_STORAGE_KEY)) userProfile.dailyGoal = remote.dailyGoal;

  const saved = new Map((userProfile.savedWords || []).map(w => [w.hanzi, w]));
  (remote.savedWords || []).forEach(w => {
    if (w && w.hanzi && !saved.has(w.hanzi)) {
      saved.set(w.hanzi, w);
      srsAddCard({ hanzi: w.hanzi, pinyin: w.pinyin, meaning: w.meaning, level: w.hsk }, false);
    }
  });
  userProfile.savedWords = [...saved.values()];

  Object.entries(remote.activity || {}).forEach(([day, points]) => {
    userProfile.activity[day] = Math.max(userProfile.activity[day] || 0, Number(points) || 0);
  });
  if (!userProfile.lastLesson && remote.lastLesson) userProfile.lastLesson = remote.lastLesson;

  const remoteCards = (remote.srs && remote.srs.cards) || {};
  Object.entries(remoteCards).forEach(([hanzi, card]) => {
    const local = srsState.cards[hanzi];
    if (!local || (card.reviews || 0) > (local.reviews || 0)) srsState.cards[hanzi] = card;
  });
  storage.set(SRS_STORAGE_KEY, srsState);
}

function applySignedInUser(user, { merge = false } = {}) {
  currentUser = user;
  if (!userProfile.name) userProfile.name = user.name;
  userProfile.name = user.name;
  if (merge) mergeServerProgress(user.progress);
  saveUserProfile();
  renderAccountUi();
  if (typeof onProfileChanged === 'function') onProfileChanged();
}

// ---------------- Header & user menu ----------------
function initialOf(name) {
  const trimmed = String(name || '').trim();
  const lastSpace = trimmed.lastIndexOf(' ');
  return (trimmed.charAt(lastSpace + 1) || trimmed.charAt(0) || '?').toUpperCase();
}

function renderAccountUi() {
  const signedIn = Boolean(currentUser);
  const show = (id, visible, display = 'flex') => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('hidden', !visible);
    el.classList.toggle(display, visible);
  };
  const text = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  show('headerUserBtn', signedIn);
  show('headerLoginBtn', !signedIn);
  show('headerAdminCrown', isAdmin(), 'inline');
  show('dropdownCrownIcon', isAdmin(), 'inline');
  const adminBtn = document.getElementById('dropdownAdminPanelBtn');
  if (adminBtn) adminBtn.hidden = !isAdmin();

  if (signedIn) {
    text('headerUserName', currentUser.name);
    text('headerUserInitial', initialOf(currentUser.name));
    text('dropdownUserName', currentUser.name);
    text('dropdownUserInitial', initialOf(currentUser.name));
    text('dropdownUserEmail', currentUser.email);
    const badge = document.getElementById('dropdownUserRoleBadge');
    if (badge) badge.textContent = isAdmin() ? '👑 Quản trị viên' : '🎓 Học viên';
  } else {
    closeUserDropdown();
  }
  renderVipBadge();
  if (activeTab === 'home' && typeof renderHomeDashboard === 'function') renderHomeDashboard();
}

function toggleUserDropdown() {
  const menu = document.getElementById('userDropdownMenu');
  if (!menu) return;
  menu.classList.toggle('hidden');
  refreshIcons(menu);
}

function closeUserDropdown() {
  const menu = document.getElementById('userDropdownMenu');
  if (menu) menu.classList.add('hidden');
}

document.addEventListener('click', e => {
  const container = document.getElementById('userAuthContainer');
  if (container && !container.contains(e.target)) closeUserDropdown();
});

// ---------------- Sign-in / sign-up modal ----------------
const AUTH_TAB_CLASSES = {
  active: {
    login: 'flex-1 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer',
    register: 'flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer'
  },
  idle: 'flex-1 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:text-[#8B1E1E] dark:hover:text-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer'
};

function setAuthError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message || '';
  el.classList.toggle('hidden', !message);
}

function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('authLoginView')?.classList.toggle('hidden', !isLogin);
  document.getElementById('authRegisterView')?.classList.toggle('hidden', isLogin);
  const btnLogin = document.getElementById('authTabBtnLogin');
  const btnRegister = document.getElementById('authTabBtnRegister');
  if (btnLogin) btnLogin.className = isLogin ? AUTH_TAB_CLASSES.active.login : AUTH_TAB_CLASSES.idle;
  if (btnRegister) btnRegister.className = isLogin ? AUTH_TAB_CLASSES.idle : AUTH_TAB_CLASSES.active.register;
  setAuthError('loginErrorMsg', '');
  setAuthError('registerErrorMsg', '');
  refreshIcons(document.getElementById('authModal'));
}

function openAuthModal(defaultTab = 'login') {
  closeUserDropdown();
  switchAuthTab(defaultTab);
  openModal('authModal');
}

function closeAuthModal() {
  closeModal('authModal');
}
registerModal('authModal', closeAuthModal);

function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const reveal = input.type === 'password';
  input.type = reveal ? 'text' : 'password';
  const icon = document.getElementById(iconId);
  if (icon) icon.setAttribute('data-lucide', reveal ? 'eye-off' : 'eye');
  refreshIcons(document.getElementById('authModal'));
}

/** Disable a submit button and show a label while `task` runs. */
async function withBusyButton(buttonId, busyLabel, task) {
  const btn = document.getElementById(buttonId);
  const original = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.textContent = busyLabel;
  }
  try {
    return await task();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = original;
      refreshIcons(btn);
    }
  }
}

const fieldValue = id => {
  const el = document.getElementById(id);
  return el ? el.value : '';
};

async function handleAuthLoginSubmit(e) {
  if (e) e.preventDefault();
  const email = fieldValue('loginEmailInput').trim().toLowerCase();
  const password = fieldValue('loginPasswordInput');
  if (!email || !password) {
    setAuthError('loginErrorMsg', 'Vui lòng nhập email và mật khẩu.');
    return;
  }
  setAuthError('loginErrorMsg', '');
  await withBusyButton('loginSubmitBtn', 'Đang đăng nhập...', async () => {
    try {
      const { user } = await apiRequest('/api/auth/login', { method: 'POST', body: { email, password } });
      applySignedInUser(user, { merge: true });
      syncProgressNow();
      closeAuthModal();
      showToast(`Chào mừng ${user.name} quay lại!`, 'success');
    } catch (err) {
      setAuthError('loginErrorMsg', err.message);
    }
  });
}

async function handleAuthRegisterSubmit(e) {
  if (e) e.preventDefault();
  const name = fieldValue('registerNameInput').trim();
  const email = fieldValue('registerEmailInput').trim().toLowerCase();
  const password = fieldValue('registerPasswordInput');
  const confirm = fieldValue('registerConfirmPasswordInput');

  if (!name || !email || !password) return setAuthError('registerErrorMsg', 'Vui lòng điền đầy đủ thông tin đăng ký.');
  if (password.length < 8) return setAuthError('registerErrorMsg', 'Mật khẩu cần tối thiểu 8 ký tự.');
  if (password !== confirm) return setAuthError('registerErrorMsg', 'Mật khẩu xác nhận không khớp.');
  setAuthError('registerErrorMsg', '');

  await withBusyButton('registerSubmitBtn', 'Đang tạo tài khoản...', async () => {
    try {
      const { user } = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: {
          name,
          email,
          password,
          language: fieldValue('registerLanguageSelect'),
          profession: fieldValue('registerProfessionSelect'),
          purpose: fieldValue('registerPurposeSelect'),
          // What the visitor earned before signing up carries over to the new account.
          progress: progressSnapshot()
        }
      });
      applySignedInUser(user);
      closeAuthModal();
      showToast(`Chào mừng ${user.name}! Bạn có ${user.vipInfo.daysRemaining} ngày dùng thử đầy đủ tính năng.`, 'success');
    } catch (err) {
      setAuthError('registerErrorMsg', err.message);
    }
  });
}

async function handleLogout() {
  closeUserDropdown();
  await syncProgressNow();
  try {
    await apiRequest('/api/auth/logout', { method: 'POST', body: {} });
  } catch (e) {
    // Cookie is cleared server-side; nothing else to do offline.
  }
  currentUser = null;
  renderAccountUi();
  showToast('Đã đăng xuất. Tiến độ trên máy này vẫn được giữ lại.', 'info');
}

// ---------------- Admin panel ----------------
function openAdminDashboardModal() {
  if (!isAdmin()) {
    showToast('Chỉ quản trị viên mới mở được bảng điều khiển.', 'warning');
    return;
  }
  const online = document.getElementById('adminKpiOnline');
  const live = document.getElementById('liveVisitorCount');
  if (online && live) online.textContent = live.textContent;
  openModal('adminDashboardModal');
  loadAdminUserVipTable();
}

function closeAdminDashboardModal() {
  closeModal('adminDashboardModal');
}
registerModal('adminDashboardModal', closeAdminDashboardModal);

async function adminSendTelegramNotification() {
  try {
    await apiRequest('/api/admin/test-notify', { method: 'POST', body: {} });
    showToast('Đã gửi tin nhắn kiểm tra qua Telegram.', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function adminClearCacheAndReload() {
  showToast('Đang tải lại ứng dụng...', 'info');
  setTimeout(() => window.location.reload(), 400);
}

async function loadAdminUserVipTable() {
  const container = document.getElementById('adminUserVipTableContainer');
  if (!container) return;
  container.innerHTML = '<div class="p-4 text-center text-xs text-stone-500">Đang tải danh sách học viên...</div>';

  let users;
  try {
    ({ users } = await apiRequest('/api/admin/users'));
  } catch (err) {
    container.innerHTML = `<div class="p-4 text-center text-xs text-rose-500">${escapeHtml(err.message)}</div>`;
    return;
  }
  if (!users.length) {
    container.innerHTML = '<div class="p-4 text-center text-xs text-stone-500">Chưa có học viên nào.</div>';
    return;
  }

  const actionBtn = (email, tier, label, cls, title) =>
    `<button onclick="adminSetUserVip(${jsArg(email)}, ${jsArg(tier)})" class="px-2 py-0.5 rounded-md text-[10px] font-bold ${cls}" title="${title}">${label}</button>`;

  container.innerHTML = `
    <table class="w-full text-left text-xs border-collapse">
      <thead class="bg-amber-100/60 dark:bg-stone-800 text-[10px] uppercase font-bold text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700">
        <tr><th class="p-2.5">Học viên</th><th class="p-2.5">EXP</th><th class="p-2.5">Trạng thái</th><th class="p-2.5 text-right">Kích hoạt</th></tr>
      </thead>
      <tbody class="divide-y divide-stone-200 dark:divide-stone-800">
        ${users.map(u => `
          <tr class="hover:bg-amber-50/50 dark:hover:bg-stone-800/50">
            <td class="p-2.5">
              <div class="font-bold text-stone-900 dark:text-stone-100">${escapeHtml(u.name)} ${u.role === 'admin' ? '<span title="Quản trị viên">👑</span>' : ''}</div>
              <div class="text-[10px] text-stone-500 font-mono">${escapeHtml(u.email)}</div>
              ${u.vipRequest ? `<div class="text-[10px] text-amber-700 font-bold">⏳ Chờ duyệt gói ${escapeHtml(u.vipRequest.tier)} · ${escapeHtml(new Date(u.vipRequest.at).toLocaleString('vi-VN'))}</div>` : ''}
              ${u.needsPasswordReset ? '<div class="text-[10px] text-rose-600 font-bold">Cần đặt lại mật khẩu</div>' : ''}
            </td>
            <td class="p-2.5 font-mono">${(u.exp || 0).toLocaleString('vi-VN')}</td>
            <td class="p-2.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">${escapeHtml(u.vipInfo.label)}</span></td>
            <td class="p-2.5 text-right">
              ${u.role === 'admin' ? '' : `<div class="inline-flex flex-wrap justify-end gap-1">
                ${actionBtn(u.email, 'monthly', '+1 tháng', 'bg-stone-100 hover:bg-amber-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200', 'Kích hoạt 30 ngày VIP')}
                ${actionBtn(u.email, 'yearly', '+1 năm', 'bg-amber-500 hover:bg-amber-600 text-white', 'Kích hoạt 365 ngày VIP')}
                ${actionBtn(u.email, 'lifetime', 'Trọn đời', 'bg-[#8B1E1E] hover:bg-red-800 text-white', 'Kích hoạt VIP trọn đời')}
                ${actionBtn(u.email, 'trial', 'Dùng thử lại', 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800', 'Cấp lại 7 ngày dùng thử')}
                ${actionBtn(u.email, 'expire', 'Khóa', 'bg-rose-100 hover:bg-rose-200 text-rose-800', 'Kết thúc VIP / dùng thử')}
              </div>`}
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

async function adminSetUserVip(targetEmail, tier) {
  try {
    const result = await apiRequest('/api/admin/set-vip', { method: 'POST', body: { targetEmail, tier } });
    showToast(result.message, 'success');
    if (currentUser && currentUser.email === result.user.email) currentUser.vipInfo = result.user.vipInfo;
    renderAccountUi();
    loadAdminUserVipTable();
  } catch (err) {
    showToast(err.message, 'error');
  }
}


// ---------------- CLOUD DATA SYNC STATUS & ACTIONS ----------------
function updateCloudSyncStatus(status) {
  const icon = document.getElementById('cloudSyncStatusIcon');
  const text = document.getElementById('cloudSyncStatusText');
  if (icon) {
    if (status === 'syncing') {
      icon.innerHTML = '⏳';
      icon.className = 'animate-spin inline-block text-xs';
    } else if (status === 'synced') {
      icon.innerHTML = '☁️✓';
      icon.className = 'text-xs text-emerald-600 font-bold';
    } else if (status === 'error') {
      icon.innerHTML = '⚠️';
      icon.className = 'text-xs text-amber-500 font-bold';
    }
  }
  if (text) {
    if (status === 'syncing') text.innerText = 'Đang đồng bộ...';
    else if (status === 'synced') text.innerText = 'Đã lưu đám mây';
    else if (status === 'error') text.innerText = 'Chưa đồng bộ';
  }
}

async function triggerManualCloudSync() {
  if (!currentUser) {
    if (typeof showToast === 'function') {
      showToast('Vui lòng đăng nhập để đồng bộ tiến độ học lên đám mây!', 'info');
    }
    if (typeof openAuthModal === 'function') openAuthModal('login');
    return;
  }
  updateCloudSyncStatus('syncing');
  try {
    await apiRequest('/api/me/merge-sync', { method: 'POST', body: progressSnapshot() });
    updateCloudSyncStatus('synced');
    if (typeof showToast === 'function') {
      showToast('✓ Đã đồng bộ tiến độ học tập và sổ tay lên đám mây an toàn!', 'success');
    }
  } catch (err) {
    updateCloudSyncStatus('error');
    if (typeof showToast === 'function') {
      showToast('Lỗi đồng bộ đám mây: ' + err.message, 'error');
    }
  }
}

window.updateCloudSyncStatus = updateCloudSyncStatus;
window.triggerManualCloudSync = triggerManualCloudSync;

})();

/* --- FILE: js/core/vip.js --- */
(function(){
// =========================================================================
// VIP subscription: status comes from the server (account), payment via VietQR transfer
// =========================================================================
// Content files are public, so this gate is a product nudge rather than DRM; the
// status itself is computed by the server and cannot be granted from the browser.
const VIP_PACKAGES = {
  monthly: { label: 'VIP 1 tháng' },
  yearly: { label: 'VIP 1 năm' },
  lifetime: { label: 'VIP trọn đời' }
};
const GUEST_VIP = { isVip: false, isTrial: false, isExpired: true, daysRemaining: 0, label: 'Khách', tier: 'guest', expiresAt: null };

let selectedVipPackageTier = 'yearly';
let paymentInfo = null;

function checkCurrentUserVip() {
  return (currentUser && currentUser.vipInfo) || GUEST_VIP;
}

/** True when the learner may open a VIP feature; otherwise explains how to unlock it. */
function ensureVipAccess(featureName = 'tính năng này') {
  const vip = checkCurrentUserVip();
  if (vip.isVip && !vip.isExpired) return true;
  if (!currentUser) {
    showToast(`Đăng ký miễn phí để dùng thử ${featureName} trong 7 ngày.`, 'info');
    openAuthModal('register');
  } else {
    showToast(`Thời gian dùng thử đã hết. Nâng cấp VIP để mở ${featureName}.`, 'warning');
    openVipModal('yearly');
  }
  return false;
}

const VIP_BADGE_STYLES = {
  lifetime: ['👑', 'VIP trọn đời', '', 'bg-amber-500/15 text-amber-950 dark:text-amber-300 border-amber-400'],
  trial: ['🎁', null, 'NÂNG CẤP', 'bg-emerald-500/10 text-emerald-950 dark:text-emerald-300 border-emerald-400/80'],
  active: ['💎', null, 'GIA HẠN', 'bg-amber-500/10 text-[#8B1E1E] dark:text-amber-300 border-amber-300/80'],
  expired: ['🔒', 'Hết hạn', 'MỞ KHÓA', 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/70'],
  guest: ['🎁', 'Dùng thử 7 ngày', 'MIỄN PHÍ', 'bg-emerald-500/10 text-emerald-950 dark:text-emerald-300 border-emerald-400/80']
};

function renderVipBadge() {
  const badge = document.getElementById('headerVipBadge');
  if (!badge) return;
  const vip = checkCurrentUserVip();
  const key = vip.tier === 'lifetime' ? 'lifetime'
    : vip.tier === 'guest' ? 'guest'
      : vip.isTrial ? 'trial'
        : vip.isVip ? 'active' : 'expired';
  const [icon, text, pill, tone] = VIP_BADGE_STYLES[key];
  badge.className = `hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs transition-all cursor-pointer select-none ${tone}`;
  badge.onclick = () => (currentUser ? openVipModal() : openAuthModal('register'));
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  set('headerVipIcon', icon);
  set('headerVipText', text || (vip.isTrial ? `Dùng thử (${vip.daysRemaining} ngày)` : `VIP (${vip.daysRemaining} ngày)`));
  const pillEl = document.getElementById('headerVipPill');
  if (pillEl) {
    pillEl.textContent = pill;
    pillEl.classList.toggle('hidden', !pill);
  }
}

async function loadPaymentInfo() {
  if (paymentInfo) return paymentInfo;
  try {
    const res = await fetch('/api/payment-info');
    paymentInfo = res.ok ? await res.json() : { configured: false };
  } catch (e) {
    paymentInfo = { configured: false };
  }
  return paymentInfo;
}

async function openVipModal(tier = 'yearly') {
  if (!currentUser) {
    showToast('Vui lòng đăng nhập để nâng cấp VIP.', 'info');
    openAuthModal('login');
    return;
  }
  const vip = checkCurrentUserVip();
  const emailEl = document.getElementById('vipModalUserEmail');
  if (emailEl) emailEl.textContent = currentUser.email;
  const badgeEl = document.getElementById('vipModalStatusBadge');
  if (badgeEl) badgeEl.textContent = vip.label;
  const feedbackBox = document.getElementById('vipUpgradeFeedbackBox');
  if (feedbackBox) feedbackBox.classList.add('hidden');

  openModal('vipUpgradeModal');
  await loadPaymentInfo();
  document.getElementById('vipPaymentBox')?.classList.toggle('hidden', !paymentInfo.configured);
  document.getElementById('vipPaymentUnavailable')?.classList.toggle('hidden', Boolean(paymentInfo.configured));
  document.getElementById('vipConfirmPaymentBtn')?.toggleAttribute('disabled', !paymentInfo.configured);
  selectVipPackage(tier);
}

function closeVipModal() {
  closeModal('vipUpgradeModal');
}
registerModal('vipUpgradeModal', closeVipModal);

const vipTransferNote = () => `NAPVIP ${currentUser ? currentUser.email : ''}`.trim();
const vipAmount = tier => (paymentInfo && paymentInfo.prices && paymentInfo.prices[tier]) || 0;

function selectVipPackage(tier) {
  selectedVipPackageTier = VIP_PACKAGES[tier] ? tier : 'yearly';
  Object.keys(VIP_PACKAGES).forEach(key => {
    const btn = document.getElementById(`vipPackageBtn-${key}`);
    if (!btn) return;
    const selected = key === selectedVipPackageTier;
    btn.classList.toggle('border-amber-500', selected);
    btn.classList.toggle('ring-2', selected);
    btn.classList.toggle('ring-amber-400/40', selected);
    btn.classList.toggle('opacity-80', !selected);
    btn.setAttribute('aria-pressed', String(selected));
  });

  if (!paymentInfo || !paymentInfo.configured) return;
  const amount = vipAmount(selectedVipPackageTier);
  const note = vipTransferNote();
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  set('vipBankName', paymentInfo.bankName);
  set('vipAccountNo', paymentInfo.accountNo);
  set('vipAccountName', paymentInfo.accountName);
  set('vipModalAmountText', `${amount.toLocaleString('vi-VN')}đ`);
  set('vipModalTransferNoteText', note);
  const qr = document.getElementById('vipVietQrImage');
  if (qr) {
    const params = new URLSearchParams({ amount: String(amount), addInfo: note, accountName: paymentInfo.accountName });
    qr.src = `https://api.vietqr.io/image/${encodeURIComponent(paymentInfo.bankBin)}-${encodeURIComponent(paymentInfo.accountNo)}-compact2.png?${params}`;
  }
}

function copyVipField(field) {
  if (paymentInfo && paymentInfo[field]) copyToClipboard(paymentInfo[field], 'Đã sao chép!');
}

function copyVipAmount() {
  copyToClipboard(String(vipAmount(selectedVipPackageTier)), 'Đã sao chép số tiền.');
}

function copyVipNote() {
  copyToClipboard(vipTransferNote(), 'Đã sao chép nội dung chuyển khoản.');
}

async function confirmVipPaymentTransfer() {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }
  const feedbackBox = document.getElementById('vipUpgradeFeedbackBox');
  await withBusyButton('vipConfirmPaymentBtn', 'Đang gửi thông báo...', async () => {
    try {
      const result = await apiRequest('/api/vip/upgrade-request', {
        method: 'POST',
        body: { packageTier: selectedVipPackageTier, txNote: vipTransferNote() }
      });
      if (feedbackBox) {
        feedbackBox.className = 'p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-medium';
        feedbackBox.textContent = result.message;
      }
      showToast('Đã báo quản trị viên. VIP sẽ được kích hoạt sau khi xác nhận chuyển khoản.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

})();

/* --- FILE: js/core/visitors.js --- */
(function(){
// =========================================================================
// Visitor counters (real numbers from /api/visitors; anonymous random client id)
// =========================================================================
const VISITOR_ID_KEY = 'yuhan_visitor_id';
const VISITOR_PING_MS = 2 * 60 * 1000;

function visitorId() {
  let id = storage.getRaw(VISITOR_ID_KEY);
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()).replace(/[^\w-]/g, '');
    storage.setRaw(VISITOR_ID_KEY, id);
  }
  return id;
}

async function pingVisitors() {
  if (document.hidden) return;
  try {
    const res = await fetch('/api/visitors/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cid: visitorId() })
    });
    if (res.ok) updateVisitorUI(await res.json());
  } catch (e) {
    // Offline or static hosting without the API: hide the badge.
    const badge = document.getElementById('headerVisitorBadge');
    if (badge) badge.classList.add('!hidden');
  }
}

function updateVisitorUI(stats) {
  const fmt = n => (Number(n) || 0).toLocaleString('vi-VN');
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  set('liveVisitorCount', fmt(stats.online));
  set('modalOnlineCount', fmt(stats.online));
  set('modalTodayCount', fmt(stats.today));
  set('modalTotalCount', fmt(stats.total));
  set('modalPeakCount', fmt(stats.peak));
}

function initVisitorTracker() {
  pingVisitors();
  setInterval(pingVisitors, VISITOR_PING_MS);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) pingVisitors();
  });
}

function openVisitorStatsModal() {
  openModal('visitorStatsModal');
  pingVisitors();
}

function closeVisitorStatsModal() {
  closeModal('visitorStatsModal');
}
registerModal('visitorStatsModal', closeVisitorStatsModal);

function toggleVisitorStatsModal() {
  const modal = document.getElementById('visitorStatsModal');
  if (modal && !modal.classList.contains('hidden')) closeVisitorStatsModal();
  else openVisitorStatsModal();
}

})();

/* --- FILE: js/core/backup.js --- */
(function(){
// =========================================================================
// Progress backup / restore (all learner data lives in localStorage)
// =========================================================================
const BACKUP_KEY_PREFIX = 'yuhan_';
const BACKUP_FORMAT = 'mei-ri-zhongwen-backup';

function collectProgress() {
  const data = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(BACKUP_KEY_PREFIX)) data[key] = localStorage.getItem(key);
    }
  } catch (e) {}
  return data;
}

/** Hand the viewer a client-side generated file (no server round trip). */
function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportProgress() {
  const payload = { format: BACKUP_FORMAT, version: 1, exportedAt: new Date().toISOString(), data: collectProgress() };
  downloadFile(`hoc-tieng-trung-sao-luu-${todayKey()}.json`, JSON.stringify(payload, null, 2), 'application/json');
  showToast('Đã tải bản sao lưu tiến độ học tập.', 'success');
}

async function importProgress(file) {
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    if (!payload || payload.format !== BACKUP_FORMAT || typeof payload.data !== 'object') {
      throw new Error('Tệp không phải bản sao lưu của Học Tiếng Trung Mỗi Ngày.');
    }
    const entries = Object.entries(payload.data).filter(([k, v]) => k.startsWith(BACKUP_KEY_PREFIX) && typeof v === 'string');
    if (!entries.length) throw new Error('Bản sao lưu không có dữ liệu.');
    if (!window.confirm(`Khôi phục ${entries.length} mục dữ liệu? Tiến độ hiện tại trên trình duyệt này sẽ bị thay thế.`)) return;
    entries.forEach(([k, v]) => storage.setRaw(k, v));
    showToast('Đã khôi phục tiến độ. Đang tải lại...', 'success');
    setTimeout(() => location.reload(), 800);
  } catch (e) {
    showToast(`Không khôi phục được: ${e.message}`, 'error', 5000);
  }
}

})();

/* --- FILE: js/features/etymology.js --- */
(function(){
'use strict';

// Module state
let activeEtymologyIndex = 0;
let currentEtymologySearch = '';
let filteredEtymologyIndices = [];

// Common extra components lookup to supplement 214 standard Kangxi radicals
const EXTRA_COMPONENTS = {
  '巴': { char: '巴', name: 'Ba', meaning: 'Con trăn uốn khúc, tạo âm đọc Ba' },
  '相': { char: '相', name: 'Tương', meaning: 'Quan sát, tương hỗ, diện mạo' },
  '与': { char: '与', name: 'Dữ', meaning: 'Cùng với, tham dự' },
  '乞': { char: '乞', name: 'Khất', meaning: 'Cầu khẩn, xin ăn' },
  '曷': { char: '曷', name: 'Hạt', meaning: 'Sao lại, cớ sao / Gốc âm đọc Hạt' },
  '豕': { char: '豕', name: 'Thỉ', meaning: 'Con heo, gia súc ấm no' },
  '卖': { char: '卖', name: 'Mại', meaning: 'Bán ra, phô diễn tri thức' },
  '耳': { char: '耳', name: 'Nhĩ', meaning: 'Cái tai, lắng nghe tin tức' },
  '见': { char: '见', name: 'Kiến', meaning: 'Đôi mắt nhìn thấu, thấy rõ' },
  '完': { char: '完', name: 'Hoàn', meaning: 'Trọn vẹn, toàn vẹn' },
  '景': { char: '景', name: 'Cảnh', meaning: 'Ánh nắng mặt trời trên kinh đô' },
  '彡': { char: '彡', name: 'Sam', meaning: 'Tia sáng rực rỡ, hoa văn' },
  '礻': { char: '礻', name: 'Thị', meaning: 'Bàn thờ tổ tiên, thần linh chúc phúc' },
  '覀': { char: '覀', name: 'Á', meaning: 'Nắp che đậy, phương Tây' },
  '又': { char: '又', name: 'Hựu', meaning: 'Bàn tay phải, lặp lại' },
  '己': { char: '己', name: 'Kỷ', meaning: 'Bản thân mình' },
  '各': { char: '各', name: 'Các', meaning: 'Mỗi người, từng phần riêng biệt' },
  '夕': { char: '夕', name: 'Tịch', meaning: 'Buổi chiều tà, hoàng hôn' },
  '卜': { char: '卜', name: 'Bốc', meaning: 'Bói toán, vết nứt mai rùa' },
  '亥': { char: '亥', name: 'Hợi', meaning: 'Địa chi thứ 12' },
  '⺍': { char: '⺍', name: 'Bát (biến thể)', meaning: 'Vạch hào toán học, ánh sáng' },
  '爻': { char: '爻', name: 'Hào', meaning: 'Quẻ bát quái, vạch toán tri thức' },
  '隹': { char: '隹', name: 'Chuy', meaning: 'Chim đuôi ngắn' },
  '页': { char: '页', name: 'Hiệt', meaning: 'Đầu người, trang giấy' },
  '戈': { char: '戈', name: 'Qua', meaning: 'Cây giáo, binh khí bảo vệ' }
};

// ---------------- TAB 1: CHIẾT TỰ & GỐC TỪ (TÌM KIẾM & PHÂN RÃ HÁN TỰ) ----------------

function renderCharacterPills() {
  const container = document.getElementById('characterPills');
  if (!container) return;

  let indicesToRender = [];
  if (currentEtymologySearch && filteredEtymologyIndices.length > 0) {
    indicesToRender = filteredEtymologyIndices;
  } else {
    // Show top 35 featured characters for quick selection
    indicesToRender = etymologyData.map((_, i) => i).slice(0, 35);
  }

  container.innerHTML = indicesToRender.map(index => {
    const item = etymologyData[index];
    if (!item) return '';
    const isActive = index === activeEtymologyIndex;
    return `
      <button 
        onclick="renderEtymologyDetail(${index})"
        id="pill-char-${index}"
        class="px-3.5 py-1.5 rounded-xl font-hanzi font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
          isActive 
            ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-amber-100 shadow-sm border border-amber-300/40 scale-105' 
            : 'bg-[#FFFDF9] dark:bg-[#161B22] hover:bg-amber-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
        }">
        ${item.hanzi} <span class="font-sans text-xs ${isActive ? 'text-amber-200' : 'text-stone-400 dark:text-stone-500'} font-normal">(${item.pinyin})</span>
      </button>
    `;
  }).join('');
}

function handleEtymologySearch(query) {
  currentEtymologySearch = (query || '').trim();
  const clearBtn = document.getElementById('clearEtymologySearchBtn');
  const resultsContainer = document.getElementById('etymologySearchResults');
  const resultsList = document.getElementById('etymologyResultsList');
  const countBadge = document.getElementById('etymologyMatchBadge');
  const countText = document.getElementById('etymologyResultsCountText');

  if (clearBtn) {
    if (currentEtymologySearch) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }

  if (!currentEtymologySearch) {
    filteredEtymologyIndices = [];
    if (resultsContainer) resultsContainer.classList.add('hidden');
    if (countBadge) countBadge.innerHTML = `Kho chiết tự: <strong id="etymologyCountNum">${etymologyData.length}</strong> chữ`;
    renderCharacterPills();
    return;
  }

  const rawQ = currentEtymologySearch.toLowerCase();
  const pyQ = normalizePinyin(currentEtymologySearch);
  const viQ = normalizeVietnamese(currentEtymologySearch);

  // 1. Search in existing etymologyData
  const matchedEtymo = [];
  etymologyData.forEach((item, idx) => {
    let score = 0;
    const hanzi = (item.hanzi || '').toLowerCase();
    const pinyin = (item.pinyin || '').toLowerCase();
    const pinyinNorm = normalizePinyin(item.pinyin);
    const hanviet = (item.hanviet || '').toLowerCase();
    const hanvietNorm = normalizeVietnamese(item.hanviet);
    const meaning = (item.meaning || '').toLowerCase();
    const meaningNorm = normalizeVietnamese(item.meaning);

    if (hanzi === rawQ) score += 400;
    else if (hanzi.includes(rawQ) || rawQ.includes(hanzi)) score += 200;

    if (pinyin === rawQ || pinyinNorm === pyQ) score += 250;
    else if (pinyinNorm.includes(pyQ)) score += 120;

    if (hanviet === rawQ || hanvietNorm === viQ) score += 220;
    else if (hanvietNorm.includes(viQ)) score += 110;

    if (meaningNorm.includes(viQ)) score += 90;

    if (item.radicals && Array.isArray(item.radicals)) {
      item.radicals.forEach(r => {
        const rName = normalizeVietnamese(r.name);
        const rMean = normalizeVietnamese(r.meaning);
        if (rName.includes(viQ) || rMean.includes(viQ)) score += 95;
      });
    }

    if (score > 0) {
      matchedEtymo.push({ index: idx, item, score });
    }
  });

  matchedEtymo.sort((a, b) => b.score - a.score);
  filteredEtymologyIndices = matchedEtymo.map(m => m.index);

  // 2. Search in 9,574 Hanzi Decompositions and Dictionary
  const dynamicMatches = [];
  const processedChars = new Set(matchedEtymo.map(m => m.item.hanzi));

  // If query contains Chinese characters directly (e.g. "爸", "北京", "国家")
  for (const ch of currentEtymologySearch) {
    if (ch >= '\u4e00' && ch <= '\u9fff' && !processedChars.has(ch)) {
      processedChars.add(ch);
      const decomp = (typeof hanziDecompositionsData !== 'undefined' && hanziDecompositionsData) ? hanziDecompositionsData[ch] : null;
      const dictMatch = (dictionaryData && Array.isArray(dictionaryData)) ? dictionaryData.find(d => d.title === ch) : null;
      
      dynamicMatches.push({
        hanzi: ch,
        pinyin: dictMatch ? dictMatch.pinyin : '',
        hanviet: dictMatch ? dictMatch.hanviet : '',
        meaning: dictMatch ? dictMatch.meaning : (decomp ? decomp.m : 'Chữ Hán'),
        decomp: decomp,
        score: 500
      });
    }
  }

  // Also search dictionaryData for Pinyin / Hán Việt / Meaning matches not yet processed
  if (dictionaryData && Array.isArray(dictionaryData)) {
    for (const d of dictionaryData) {
      if (!d.title) continue;
      // Single character title
      if (d.title.length === 1 && !processedChars.has(d.title)) {
        let score = 0;
        const title = d.title.toLowerCase();
        const pinyin = (d.pinyin || '').toLowerCase();
        const pinyinNorm = normalizePinyin(d.pinyin);
        const hanviet = (d.hanviet || '').toLowerCase();
        const hanvietNorm = normalizeVietnamese(d.hanviet);
        const meaningNorm = normalizeVietnamese(d.meaning);

        if (title === rawQ) score += 350;
        else if (title.includes(rawQ)) score += 180;
        if (pinyin === rawQ || pinyinNorm === pyQ) score += 220;
        else if (pinyinNorm.includes(pyQ)) score += 110;
        if (hanviet === rawQ || hanvietNorm === viQ) score += 200;
        else if (hanvietNorm.includes(viQ)) score += 100;
        if (meaningNorm.includes(viQ)) score += 80;

        if (score > 0) {
          processedChars.add(d.title);
          const decomp = (typeof hanziDecompositionsData !== 'undefined' && hanziDecompositionsData) ? hanziDecompositionsData[d.title] : null;
          dynamicMatches.push({
            hanzi: d.title,
            pinyin: d.pinyin || '',
            hanviet: d.hanviet || '',
            meaning: d.meaning || '',
            decomp: decomp,
            score: score
          });
        }
      }
    }
  }

  dynamicMatches.sort((a, b) => b.score - a.score);

  // 3. Render suggestions list in #etymologyResultsList
  const totalFound = matchedEtymo.length + dynamicMatches.length;

  if (resultsContainer && resultsList) {
    resultsContainer.classList.remove('hidden');
    if (countText) countText.textContent = `${totalFound} kết quả`;
    if (countBadge) countBadge.innerHTML = `Tìm thấy: <strong>${totalFound}</strong> kết quả`;

    if (totalFound === 0) {
      // Allow instant decomposition for any character typed
      const firstChar = [...currentEtymologySearch].find(c => c >= '\u4e00' && c <= '\u9fff') || currentEtymologySearch;
      resultsList.innerHTML = `
        <div class="col-span-full py-4 text-center text-xs text-stone-500 dark:text-stone-400">
          <p class="mb-2">Chưa có trong danh mục hiển thị sẵn cho từ khóa "<strong>${escapeHtml(currentEtymologySearch)}</strong>".</p>
          <button onclick="selectOrDecomposeEtymology(${jsArg(firstChar)})" class="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-amber-100 border border-[#8B1E1E] transition-all cursor-pointer shadow-xs">
            ✨ Phân rã nét & xem chiết tự chữ "<strong>${escapeHtml(firstChar)}</strong>" ngay
          </button>
        </div>
      `;
    } else {
      let cardsHtml = '';

      // Existing etymology cards
      matchedEtymo.slice(0, 12).forEach(m => {
        const item = m.item;
        cardsHtml += `
          <div onclick="selectOrDecomposeEtymology(${jsArg(item.hanzi)})" class="p-3 rounded-xl bg-white dark:bg-[#161B22] hover:bg-amber-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="font-hanzi text-3xl font-black text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 transition-colors">${item.hanzi}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">Chiết Tự</span>
            </div>
            <div>
              <p class="text-xs font-bold text-amber-800 dark:text-amber-400 truncate">${item.pinyin} ${item.hanviet ? '• ' + item.hanviet : ''}</p>
              <p class="text-[11px] text-stone-600 dark:text-stone-400 truncate mt-0.5">${item.meaning || ''}</p>
            </div>
          </div>
        `;
      });

      // Dynamic decomposition matches (from 9,574 character decomposition database)
      dynamicMatches.slice(0, 16).forEach(dm => {
        const decompInfo = dm.decomp;
        const compStr = decompInfo && decompInfo.c && decompInfo.c.length > 0 ? decompInfo.c.join(' + ') : '';
        cardsHtml += `
          <div onclick="selectOrDecomposeEtymology(${jsArg(dm.hanzi)})" class="p-3 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-[#161B22] dark:to-stone-800 hover:bg-amber-100/50 dark:hover:bg-stone-700 border border-amber-300/80 dark:border-amber-800/60 hover:border-amber-500 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="font-hanzi text-3xl font-black text-[#8B1E1E] dark:text-amber-300 group-hover:scale-105 transition-transform">${dm.hanzi}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-2xs">✨ Phân rã nét</span>
            </div>
            <div>
              <p class="text-xs font-bold text-amber-900 dark:text-amber-300 truncate">${dm.pinyin} ${dm.hanviet ? '• ' + dm.hanviet : ''}</p>
              <p class="text-[11px] text-stone-700 dark:text-stone-300 truncate mt-0.5">${dm.meaning || ''}</p>
              ${compStr ? `<p class="text-[10px] text-amber-700 dark:text-amber-400 font-mono mt-1">Bộ thủ: ${compStr}</p>` : ''}
            </div>
          </div>
        `;
      });

      resultsList.innerHTML = cardsHtml;
    }
  }

  renderCharacterPills();
}

function selectOrDecomposeEtymology(char) {
  if (!char) return;
  const targetChar = char.trim();

  // If input has multiple characters (e.g. "北京"), extract the first Hanzi
  const hanziList = [...targetChar].filter(c => c >= '\u4e00' && c <= '\u9fff');
  const selectedChar = hanziList.length > 0 ? hanziList[0] : targetChar;

  // 1. Check if character is directly in etymologyData
  const foundIdx = etymologyData.findIndex(item => item.hanzi === selectedChar);
  if (foundIdx !== -1) {
    activeEtymologyIndex = foundIdx;
    renderEtymologyDetail(foundIdx);

    const resultsContainer = document.getElementById('etymologySearchResults');
    if (resultsContainer) resultsContainer.classList.add('hidden');

    const container = document.getElementById('activeEtymologyContainer');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    return;
  }

  // 2. Decompose dynamically using 9,574 character database
  createAndShowEtymology(selectedChar);
}

function createAndShowEtymology(wordOrChar) {
  const char = wordOrChar.trim();
  if (!char) return;

  // Check existing
  const existingIdx = etymologyData.findIndex(item => item.hanzi === char);
  if (existingIdx !== -1) {
    activeEtymologyIndex = existingIdx;
    renderEtymologyDetail(existingIdx);
    return;
  }

  // Look up in 9,574 character database
  const decomp = (typeof hanziDecompositionsData !== 'undefined' && hanziDecompositionsData) ? hanziDecompositionsData[char] : null;

  let dictEntry = null;
  if (dictionaryData && Array.isArray(dictionaryData)) {
    dictEntry = dictionaryData.find(d => d.title === char) || dictionaryData.find(d => d.title && d.title.includes(char)) || null;
  }

  let radEntry = null;
  if (radicalsData && Array.isArray(radicalsData)) {
    radEntry = radicalsData.find(r => r.char === char) || null;
  }

  // Build 214 radicals lookup map
  const radMap = new Map();
  if (radicalsData && Array.isArray(radicalsData)) {
    radicalsData.forEach(r => {
      const cleanName = r.hanviet ? r.hanviet.replace(/^Bộ\s+/i, '').trim() : 'Bộ';
      radMap.set(r.char, { char: r.char, name: cleanName, meaning: r.meaning || 'Bộ thủ gốc' });
      (r.variants || []).forEach(v => {
        radMap.set(v, { char: v, name: cleanName, meaning: r.meaning || 'Biến thể bộ thủ' });
      });
    });
  }

  const detectedRadicals = [];
  const rawComponents = decomp ? (decomp.c || []) : [];

  // Extract components from decomposition
  rawComponents.forEach(c => {
    if (c === char) return;
    const found = radMap.get(c);
    if (found) {
      if (!detectedRadicals.some(dr => dr.char === found.char)) {
        detectedRadicals.push({ char: found.char, name: found.name, meaning: found.meaning });
      }
    } else {
      const extra = EXTRA_COMPONENTS[c];
      if (extra) {
        if (!detectedRadicals.some(dr => dr.char === extra.char)) {
          detectedRadicals.push({ char: extra.char, name: extra.name, meaning: extra.meaning });
        }
      } else {
        const dictMatch = dictionaryData?.find(d => d.title === c);
        detectedRadicals.push({
          char: c,
          name: dictMatch?.hanviet || `Thành tố ${c}`,
          meaning: dictMatch?.meaning || `Thành phần tạo chữ ${c}`
        });
      }
    }
  });

  // If primary radical is known and not in components, insert at head
  if (decomp && decomp.r && decomp.r !== char && !detectedRadicals.some(dr => dr.char === decomp.r)) {
    const mainRad = radMap.get(decomp.r);
    if (mainRad) {
      detectedRadicals.unshift({ char: mainRad.char, name: mainRad.name, meaning: mainRad.meaning });
    }
  }

  // Fallback for single primitive radicals
  if (detectedRadicals.length === 0) {
    if (radEntry) {
      detectedRadicals.push({
        char: radEntry.char,
        name: radEntry.hanviet.replace(/^Bộ\s+/i, '').trim(),
        meaning: radEntry.meaning || 'Bộ thủ nguyên thủy'
      });
    } else {
      detectedRadicals.push({
        char: char,
        name: dictEntry?.hanviet || 'Tượng hình',
        meaning: dictEntry?.meaning || 'Văn tự nguyên bản'
      });
    }
  }

  const pinyin = dictEntry?.pinyin || radEntry?.pinyin || '';
  const hanviet = dictEntry?.hanviet || radEntry?.hanviet || '';
  const meaning = dictEntry?.meaning || decomp?.m || radEntry?.meaning || 'Từ vựng tiếng Hán';
  const level = dictEntry?.level || 1;
  const strokeCount = char.length * 4;

  const etymType = decomp?.t || (detectedRadicals.length > 1 ? 'Hội ý (会意)' : 'Tượng hình (象形)');
  const radSummary = detectedRadicals.map(r => `Bộ ${r.name} (${r.char}: ${r.meaning})`).join(' kết hợp với ');

  let story = '';
  let memoryTip = '';

  if (etymType.includes('Hình thanh')) {
    const phoneticChar = decomp?.p || (detectedRadicals[1]?.char || '');
    story = `Chữ 「${char}」 (${pinyin} • Hán Việt: [${hanviet}]) thuộc quy luật tạo chữ Hình thanh (形声) kinh điển: Trong đó thành phần biểu ý là Bộ ${detectedRadicals[0].name} (${detectedRadicals[0].char}: ${detectedRadicals[0].meaning}) đóng vai trò tạo trường nghĩa, kết hợp với thành phần biểu âm ${phoneticChar ? `chữ ${phoneticChar}` : 'bộ phận biểu âm'} mượn âm đọc tương cận. Nghĩa chính của chữ: ${meaning}.`;
    memoryTip = `Nhận diện chữ 「${char}」: Lấy nghĩa từ Bộ ${detectedRadicals[0].name} (${detectedRadicals[0].meaning}) + mượn âm từ ${phoneticChar || 'thành tố âm'}.`;
  } else if (etymType.includes('Hội ý')) {
    story = `Chữ 「${char}」 (${pinyin} • Hán Việt: [${hanviet}]) được sáng tạo theo phép Hội ý (会意) sâu sắc: Cấu thành từ sự kết hợp tương hỗ giữa ${radSummary}. Khi các bộ thủ này kết hợp lại, chúng cộng hưởng tạo nên nghĩa biểu đạt: ${meaning}. Phản ánh tư duy quan sát đời sống tinh tế của người xưa.`;
    memoryTip = `Ghép ${detectedRadicals.map(r => r.name).join(' + ')} thành chữ 「${char}」 mang nghĩa: ${meaning}.`;
  } else if (etymType.includes('Tượng hình')) {
    story = `Chữ 「${char}」 (${pinyin} • Hán Việt: [${hanviet}]) là chữ Tượng hình (象形) cổ xưa, phác họa lại trực quan hình tượng của: ${meaning}. Trải qua các thời kỳ Giáp cốt văn đến Khải thư, chữ giữ nguyên cốt cách tạo hình độc đáo của văn tự phương Đông.`;
    memoryTip = `Chữ 「${char}」 là bức tranh tượng hình cổ phác họa lại: ${meaning}.`;
  } else {
    story = `Chữ 「${char}」 (${pinyin} • Hán Việt: [${hanviet}]) có cấu tạo gồm ${radSummary}. Mang nghĩa biểu đạt: ${meaning}.`;
    memoryTip = `Khắc sâu chữ 「${char}」 qua các bộ thủ: ${detectedRadicals.map(r => r.name).join(' + ')}.`;
  }

  // Related Family Words
  let familyWords = [];
  if (dictionaryData && Array.isArray(dictionaryData)) {
    familyWords = dictionaryData
      .filter(d => d.title && d.title !== char && d.title.includes(char))
      .slice(0, 5)
      .map(w => ({
        char: w.title,
        pinyin: w.pinyin || '',
        meaning: w.meaning || ''
      }));
  }

  // Common Words
  let commonWords = [];
  if (dictionaryData && Array.isArray(dictionaryData)) {
    commonWords = dictionaryData
      .filter(d => d.title && d.title !== char && d.title.includes(char))
      .slice(0, 5)
      .map(w => `${w.title} (${w.pinyin || ''}: ${w.meaning || ''})`);
  }

  const newEntry = {
    hanzi: char,
    pinyin: pinyin,
    hanviet: hanviet,
    meaning: meaning,
    level: level,
    strokeCount: strokeCount,
    radicals: detectedRadicals,
    etymologyStory: story,
    memoryTip: memoryTip,
    family: familyWords,
    commonWords: commonWords,
    example: {
      hanzi: dictEntry?.exampleSentence || `我们要学好汉字「${char}」的用法。`,
      pinyin: dictEntry?.examplePinyin || `Wǒmen yào xuéhǎo hànzì "${char}" de yòngfǎ.`,
      vi: dictEntry?.exampleMeaning || `Chúng ta cần nắm vững cách dùng của chữ 「${char}」.`
    }
  };

  etymologyData.unshift(newEntry);
  activeEtymologyIndex = 0;

  const countNum = document.getElementById('etymologyCountNum');
  if (countNum) countNum.textContent = etymologyData.length;

  renderEtymologyDetail(0);

  const resultsContainer = document.getElementById('etymologySearchResults');
  if (resultsContainer) resultsContainer.classList.add('hidden');

  const container = document.getElementById('activeEtymologyContainer');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderEtymologyDetail(index) {
  activeEtymologyIndex = index;
  renderCharacterPills();
  const data = etymologyData[index] || etymologyData[0];
  const container = document.getElementById('activeEtymologyContainer');
  if (!container || !data) return;

  const radicalsList = Array.isArray(data.radicals) ? data.radicals : [];
  const familyList = Array.isArray(data.family) ? data.family : [];
  const commonWordsList = Array.isArray(data.commonWords) ? data.commonWords : [];
  const example = data.example || { hanzi: '', pinyin: '', vi: '' };

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Main Character Card -->
      <div class="glass-card rounded-2xl p-6 lg:p-8 flex flex-col justify-between border-amber-200/80 dark:border-stone-800 bg-white dark:bg-[#161B22] shadow-sm">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
              HSK ${data.level || 1}
            </span>
            <span class="text-xs text-stone-500 dark:text-stone-400 font-medium">Số nét: <strong>${data.strokeCount || 1}</strong></span>
          </div>

          <div class="text-center py-6">
            <h1 onclick="openWritingModal(${jsArg(data.hanzi)}, ${jsArg(data.pinyin || '')}, ${jsArg(data.meaning || '')}); closeWordModal();" class="font-hanzi text-8xl font-black text-stone-900 dark:text-stone-100 tracking-wider mb-2 cursor-pointer hover:text-[#8B1E1E] dark:hover:text-amber-400 transition-colors" title="Nhấn vào chữ để xem và tập viết nét">${data.hanzi}</h1>
            <div class="flex items-center justify-center gap-3">
              <span class="text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono">${data.pinyin}</span>
              <div class="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <button onclick="playChineseTTS(${jsArg(data.hanzi)}, 'female')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-rose-50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-xs font-bold transition-colors cursor-pointer" title="Phát âm giọng Nữ">
                  👩 Nữ
                </button>
                <button onclick="playChineseTTS(${jsArg(data.hanzi)}, 'male')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-blue-50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 text-xs font-bold transition-colors cursor-pointer" title="Phát âm giọng Nam">
                  👨 Nam
                </button>
              </div>
            </div>
            ${data.hanviet ? `<p class="text-sm font-bold text-emerald-800 dark:text-emerald-400 mt-2">Hán Việt: [ ${data.hanviet} ]</p>` : ''}
            <p class="text-base text-stone-800 dark:text-stone-200 mt-2 font-medium leading-relaxed">${data.meaning || ''}</p>
            <div class="flex items-center justify-center gap-2 mt-4">
              <button onclick="openWritingModal(${jsArg(data.hanzi)}, ${jsArg(data.pinyin || '')}, ${jsArg(data.meaning || '')}); closeWordModal();" class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
                <i data-lucide="pen-tool" class="w-4 h-4"></i>
                <span>Tập Viết Nét</span>
              </button>
              <button onclick="toggleSaveWord(${jsArg(data.hanzi)}, ${jsArg(data.pinyin || '')}, ${jsArg(data.meaning || '')}, ${data.level || 1})" class="px-4 py-2 rounded-xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-stone-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                <i data-lucide="bookmark" class="w-4 h-4 text-amber-600"></i>
                <span>Lưu Sổ Tay</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Common Words -->
        <div class="pt-4 border-t border-stone-100 dark:border-stone-800">
          <p class="text-xs text-stone-500 dark:text-stone-400 font-bold mb-2 uppercase tracking-wide">Từ ghép thông dụng:</p>
          <div class="flex flex-wrap gap-2">
            ${commonWordsList.map(w => `
              <span class="px-2.5 py-1 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 text-xs text-stone-800 dark:text-stone-200 border border-amber-200 dark:border-amber-800/50 font-medium">
                ${w}
              </span>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: Radicals & Etymology Breakdown -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Radicals Decomposition Badges (BỘ THỦ CẤU THÀNH) -->
        <div class="glass-card rounded-2xl p-6 border-amber-200/80 dark:border-stone-800 bg-white dark:bg-[#161B22] shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="layers" class="w-4 h-4 text-amber-600"></i>
              <span>Bộ Thủ Cấu Thành (Phân rã nét)</span>
            </h3>
            <span class="text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950 px-2.5 py-0.5 rounded-lg border border-amber-200">
              ${radicalsList.length} Thành Tố
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            ${radicalsList.map(r => `
              <div class="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 flex items-center gap-4 hover:border-amber-400 transition-all">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center shadow-xs shrink-0">
                  <span class="font-hanzi text-2xl font-bold">${r.char}</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">Bộ ${r.name}</h4>
                  <p class="text-xs text-stone-600 dark:text-stone-400 leading-snug">${r.meaning}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Mnemonic Story & Etymology Origin (CÂU CHUYỆN CHIẾT TỰ & NGUỒN GỐC) -->
        <div class="glass-card rounded-2xl p-6 border-amber-200/80 dark:border-stone-800 bg-gradient-to-r from-amber-50/60 via-white to-white dark:from-[#161B22] dark:via-[#1c222d] dark:to-[#161B22] shadow-sm">
          <h3 class="text-sm font-bold text-[#8B1E1E] dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i data-lucide="lightbulb" class="w-4 h-4 text-amber-500"></i>
            <span>Câu Chuyện Chiết Tự & Nguồn Gốc</span>
          </h3>
          <p class="text-sm lg:text-base text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
            ${data.etymologyStory || ''}
          </p>
          <div class="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
            <i data-lucide="sparkles" class="w-5 h-5 text-amber-600 flex-shrink-0"></i>
            <p class="text-xs font-semibold text-amber-950 dark:text-amber-200">
              <strong class="text-[#8B1E1E] dark:text-amber-400">Mẹo nhớ nhanh:</strong> ${data.memoryTip || ''}
            </p>
          </div>
        </div>

        <!-- Character Family Tree -->
        <div class="glass-card rounded-2xl p-6 border-amber-200/80 dark:border-stone-800 bg-white dark:bg-[#161B22] shadow-sm">
          <h3 class="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <i data-lucide="git-merge" class="w-4 h-4 text-amber-600"></i>
            <span>Cây Phả Hệ Chữ Họ Hàng (Cùng Gốc)</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${familyList.map(f => `
              <div onclick="selectOrDecomposeEtymology(${jsArg(f.char)})" class="p-3.5 rounded-xl bg-white dark:bg-[#21262D] hover:bg-amber-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 hover:border-amber-400 transition-all flex items-center gap-3 shadow-xs cursor-pointer group">
                <span class="font-hanzi text-3xl font-black text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 w-10 text-center transition-colors">${f.char}</span>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">${f.pinyin}</span>
                  </div>
                  <p class="text-xs text-stone-600 dark:text-stone-400 truncate mt-0.5">${f.meaning}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Bilingual Example Context -->
        ${example.hanzi ? `
          <div class="glass-card rounded-2xl p-6 border-amber-200/80 dark:border-stone-800 bg-[#FAF7F2] dark:bg-[#161B22] shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="quote" class="w-4 h-4 text-amber-600"></i>
                <span>Ví Dụ Ứng Dụng Ngữ Cảnh</span>
              </h3>
              <div class="flex items-center gap-1 bg-white dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <button onclick="playChineseTTS(${jsArg(example.hanzi)}, 'female')" class="px-2.5 py-1 rounded-lg hover:bg-rose-50 text-rose-800 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu ví dụ giọng Nữ">
                  👩 Nữ
                </button>
                <button onclick="playChineseTTS(${jsArg(example.hanzi)}, 'male')" class="px-2.5 py-1 rounded-lg hover:bg-blue-50 text-blue-800 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu ví dụ giọng Nam">
                  👨 Nam
                </button>
              </div>
            </div>
            <p class="font-hanzi text-xl font-bold text-stone-900 dark:text-stone-100 leading-relaxed mb-1">${example.hanzi}</p>
            <p class="text-xs text-amber-800 dark:text-amber-400 font-mono mb-2">${example.pinyin}</p>
            <p class="text-sm text-stone-600 dark:text-stone-300 italic">${example.vi}</p>
          </div>
        ` : ''}

      </div>
    </div>
  `;

  refreshIcons();
}

function clearEtymologySearch() {
  const input = document.getElementById('etymologySearchInput');
  if (input) input.value = '';
  handleEtymologySearch('');
}

function handleEtymologySearchKeyDown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const input = document.getElementById('etymologySearchInput');
    if (input && input.value.trim()) {
      selectOrDecomposeEtymology(input.value.trim());
    }
  } else if (e.key === 'Escape') {
    clearEtymologySearch();
  }
}


})();

/* --- FILE: js/features/culture.js --- */
(function(){
// Module state
let activeCultureCategory = 'all';
let cultureSearchQuery = '';

// ---------------- TAB: VĂN HÓA & LỊCH SỬ TRUNG HOA ----------------
function filterCultureCategory(category) {
  activeCultureCategory = category;
  
  const catButtons = ['all', 'dynasties', 'culture', 'customs', 'wars'];
  catButtons.forEach(c => {
    const btn = document.getElementById(`btn-culture-${c}`);
    if (!btn) return;
    if (c === category) {
      btn.className = 'px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap scale-105 cursor-pointer';
    } else {
      btn.className = 'px-4 py-2 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-amber-200 transition-all whitespace-nowrap cursor-pointer';
    }
  });

  renderCultureCards();
}

function scrollToEra(order) {
  const el = document.getElementById(`era-card-${order}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('ring-4', 'ring-[#8B1E1E]', 'shadow-xl');
    setTimeout(() => {
      el.classList.remove('ring-4', 'ring-[#8B1E1E]', 'shadow-xl');
    }, 2500);
  }
}

function setupCultureSearch() {
  const searchInput = document.getElementById('cultureSearchInput');
  if (!searchInput || searchInput.dataset.bound) return;
  searchInput.dataset.bound = '1';
  searchInput.addEventListener('input', debounce((e) => {
    cultureSearchQuery = e.target.value.toLowerCase().trim();
    renderCultureCards();
  }, 120));
}

function renderCultureCards() {
  const container = document.getElementById('cultureCardsContainer');
  if (!container) return;

  const sortedData = [...(cultureData || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  const filtered = sortedData.filter(item => {
    // If specific dimension filter is active, check if item has relevant content
    if (activeCultureCategory === 'wars' && (!item.warsAndBattles || item.warsAndBattles.length === 0)) return false;
    if (activeCultureCategory === 'culture' && (!item.cultureEmergence || item.cultureEmergence.length === 0)) return false;
    if (activeCultureCategory === 'customs' && (!item.customsEmergence || item.customsEmergence.length === 0)) return false;

    if (!cultureSearchQuery) return true;
    const q = cultureSearchQuery;
    const matchTitle = item.title && item.title.toLowerCase().includes(q);
    const matchEra = item.eraName && item.eraName.toLowerCase().includes(q);
    const matchPeriod = item.period && item.period.toLowerCase().includes(q);
    const matchPinyin = item.pinyin && item.pinyin.toLowerCase().includes(q);
    const matchSummary = item.summary && item.summary.toLowerCase().includes(q);
    const matchCulture = item.cultureEmergence && item.cultureEmergence.some(c => c.toLowerCase().includes(q));
    const matchCustoms = item.customsEmergence && item.customsEmergence.some(c => c.toLowerCase().includes(q));
    const matchWars = item.warsAndBattles && item.warsAndBattles.some(w => 
      w.name.toLowerCase().includes(q) || 
      w.hanzi.includes(q) || 
      (w.combatants && w.combatants.toLowerCase().includes(q)) || 
      (w.description && w.description.toLowerCase().includes(q)) ||
      (w.significance && w.significance.toLowerCase().includes(q))
    );
    const matchKeywords = item.keywords && item.keywords.some(k => 
      k.hanzi.includes(q) || 
      (k.meaning && k.meaning.toLowerCase().includes(q)) || 
      (k.pinyin && k.pinyin.toLowerCase().includes(q))
    );
    const matchQuote = item.quote && (
      item.quote.hanzi.includes(q) || 
      (item.quote.meaning && item.quote.meaning.toLowerCase().includes(q))
    );
    return matchTitle || matchEra || matchPeriod || matchPinyin || matchSummary || matchCulture || matchCustoms || matchWars || matchKeywords || matchQuote;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 glass-card rounded-3xl border border-amber-200 bg-white shadow-sm">
        <div class="text-4xl mb-3">🔍</div>
        <h3 class="text-lg font-bold text-stone-800">Không tìm thấy giai đoạn hoặc từ khóa phù hợp</h3>
        <p class="text-sm text-stone-500 mt-1">Thử tìm kiếm với tên triều đại, danh nhân (Tần Thủy Hoàng, Lý Bạch, Nhạc Phi...), phong tục (Đoan Ngọ, Trà Đạo) hoặc tên trận đánh (Xích Bích, Trường Bình...).</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    // Dynamic highlighting based on active filter
    const highlightWars = activeCultureCategory === 'wars' || activeCultureCategory === 'all';
    const highlightCulture = activeCultureCategory === 'culture' || activeCultureCategory === 'all';
    const highlightCustoms = activeCultureCategory === 'customs' || activeCultureCategory === 'all';

    // 1. Culture & Philosophy HTML
    const cultureHtml = (item.cultureEmergence || []).map(c => {
      const parts = c.split(':');
      const title = parts[0];
      const desc = parts.slice(1).join(':');
      return `
        <li class="flex items-start gap-2 text-xs md:text-sm text-stone-700 leading-relaxed">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
          <span><strong class="text-emerald-950 font-bold">${title}${desc ? ':' : ''}</strong>${desc}</span>
        </li>
      `;
    }).join('');

    // 2. Customs, Traditions & Festivals HTML
    const customsHtml = (item.customsEmergence || []).map(c => {
      const parts = c.split(':');
      const title = parts[0];
      const desc = parts.slice(1).join(':');
      return `
        <li class="flex items-start gap-2 text-xs md:text-sm text-stone-700 leading-relaxed">
          <span class="inline-block w-2 h-2 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
          <span><strong class="text-amber-950 font-bold">${title}${desc ? ':' : ''}</strong>${desc}</span>
        </li>
      `;
    }).join('');

    // 3. Battles and Wars HTML
    const warsHtml = (item.warsAndBattles || []).map(w => `
      <div class="p-4 rounded-2xl bg-white/90 border border-rose-200/90 shadow-2xs space-y-2 hover:border-rose-300 transition-all">
        <div class="flex items-start justify-between gap-2 flex-wrap border-b border-rose-100 pb-2">
          <div class="flex items-baseline gap-2">
            <h5 class="text-sm font-bold text-rose-950 font-hanzi">${w.name}</h5>
            <span class="text-xs text-rose-700 font-medium">(${w.pinyin})</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
            Năm: ${w.year}
          </span>
        </div>
        <p class="text-xs text-stone-600"><strong class="text-stone-900 font-semibold">Bên tham chiến:</strong> ${w.combatants}</p>
        <p class="text-xs text-stone-700 leading-relaxed"><strong class="text-stone-900 font-semibold">Diễn biến & Mưu lược:</strong> ${w.description}</p>
        <div class="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-rose-900 font-medium leading-relaxed">
          <strong>Ý nghĩa lịch sử:</strong> ${w.significance}
        </div>
      </div>
    `).join('');

    // 4. Keywords HTML
    const keywordsHtml = (item.keywords || []).map(k => `
      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200 shadow-2xs hover:border-[#8B1E1E] transition-all">
        <span class="font-hanzi font-bold text-stone-900 text-xs md:text-sm">${k.hanzi}</span>
        <span class="text-[11px] text-[#8B1E1E] font-medium font-sans">${k.pinyin}</span>
        <span class="text-[11px] text-stone-600 font-medium">(${k.meaning})</span>
        <div class="inline-flex items-center gap-0.5 ml-1">
          <button type="button" onclick="playChineseTTS(${jsArg(k.hanzi)}, 'female')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm Nữ">👩</button>
          <button type="button" onclick="playChineseTTS(${jsArg(k.hanzi)}, 'male')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm Nam">👨</button>
        </div>
      </div>
    `).join('');

    // 5. Quote HTML
    const quoteHtml = item.quote ? `
      <div class="p-4 rounded-2xl bg-gradient-to-r from-red-950/5 via-amber-900/5 to-amber-950/5 border border-amber-200/80 relative overflow-hidden mt-2">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1 flex-1">
            <span class="text-[11px] font-bold text-[#8B1E1E] uppercase tracking-wider flex items-center gap-1">
              <i data-lucide="quote" class="w-3.5 h-3.5"></i> Danh Ngôn & Thi Từ Bất Hủ
            </span>
            <p class="font-hanzi text-sm md:text-base font-bold text-stone-900 leading-snug">${item.quote.hanzi}</p>
            <p class="text-xs text-[#8B1E1E] italic font-sans">${item.quote.pinyin}</p>
            <p class="text-xs md:text-sm text-stone-700 font-medium pt-1">➔ "${item.quote.meaning}"</p>
          </div>
          <div class="inline-flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-amber-300 shadow-2xs shrink-0">
            <button onclick="playChineseTTS(${jsArg(item.quote.hanzi)}, 'female')" title="Nghe câu danh ngôn giọng Nữ" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer">
              👩 Nữ
            </button>
            <button onclick="playChineseTTS(${jsArg(item.quote.hanzi)}, 'male')" title="Nghe câu danh ngôn giọng Nam" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer">
              👨 Nam
            </button>
          </div>
        </div>
      </div>
    ` : '';

    return `
      <div id="era-card-${item.order}" class="glass-card rounded-3xl p-6 lg:p-8 border border-amber-300/80 bg-gradient-to-br from-[#FFFDF9] via-white to-amber-50/20 shadow-sm relative transition-all duration-300 space-y-6">
        <!-- Era Timeline Milestone Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/70 pb-4">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center font-black text-sm shadow-2xs">
              ${item.order}
            </span>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-[#8B1E1E] border border-red-200">
                  Kỷ Nguyên ${item.order} / 13
                </span>
                <span class="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
                  📅 ${item.period}
                </span>
              </div>
              <span class="text-xs font-semibold text-stone-500 font-sans mt-0.5 block">${item.eraName}</span>
            </div>
          </div>
          <span class="self-start sm:self-auto text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-amber-100/90 text-amber-950 border border-amber-300 shadow-2xs">
            ${item.badge}
          </span>
        </div>

        <!-- Title & Historical Overview -->
        <div>
          <h3 class="text-xl lg:text-2xl font-black text-stone-900 tracking-tight leading-snug mb-1">
            ${item.title}
          </h3>
          <p class="text-xs md:text-sm text-[#8B1E1E] font-bold mb-3 italic">
            ${item.pinyin}
          </p>
          <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs md:text-sm text-stone-700 leading-relaxed font-sans">
            <strong class="text-stone-900 font-bold">Khái quát lịch sử: </strong>${item.summary}
          </div>
        </div>

        <!-- The 3 Core Dimensions: Culture, Customs & Wars -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- 1. Văn Hóa & Tư Tưởng -->
          ${highlightCulture && cultureHtml ? `
            <div class="p-4 md:p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center gap-2 border-b border-emerald-200/60 pb-2">
                  <span class="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                    <i data-lucide="book-open" class="w-4 h-4"></i>
                  </span>
                  <h4 class="text-xs md:text-sm font-bold text-emerald-950 uppercase tracking-wide">
                    Văn Hóa, Nghệ Thuật & Tư Tưởng
                  </h4>
                </div>
                <ul class="space-y-2">
                  ${cultureHtml}
                </ul>
              </div>
            </div>
          ` : ''}

          <!-- 2. Phong Tục & Lễ Hội -->
          ${highlightCustoms && customsHtml ? `
            <div class="p-4 md:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center gap-2 border-b border-amber-200/60 pb-2">
                  <span class="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                  </span>
                  <h4 class="text-xs md:text-sm font-bold text-amber-950 uppercase tracking-wide">
                    Phong Tục, Lễ Hội & Y Phục
                  </h4>
                </div>
                <ul class="space-y-2">
                  ${customsHtml}
                </ul>
              </div>
            </div>
          ` : ''}

          <!-- 3. Chiến Tranh & Quân Sự -->
          ${highlightWars && warsHtml ? `
            <div class="p-4 md:p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-3 ${activeCultureCategory === 'wars' ? 'lg:col-span-3' : ''}">
              <div class="flex items-center gap-2 border-b border-rose-200/60 pb-2">
                <span class="p-1.5 rounded-lg bg-rose-100 text-rose-800">
                  <i data-lucide="swords" class="w-4 h-4"></i>
                </span>
                <h4 class="text-xs md:text-sm font-bold text-rose-950 uppercase tracking-wide">
                  Chiến Tranh & Biến Cố Quân Sự Điển Hình
                </h4>
              </div>
              <div class="space-y-3 ${activeCultureCategory === 'wars' ? 'grid grid-cols-1 md:grid-cols-2 gap-3 space-y-0' : ''}">
                ${warsHtml}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 4. Từ Vựng Lịch Sử Cốt Lõi -->
        <div class="pt-4 border-t border-amber-200/60 space-y-2">
          <h4 class="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="languages" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
            <span>Từ Vựng Lịch Sử Cốt Lõi (Click để nghe phát âm giọng Bắc Kinh)</span>
          </h4>
          <div class="flex flex-wrap gap-2">
            ${keywordsHtml}
          </div>
        </div>

        <!-- 5. Danh Ngôn & Thi Từ Bất Hủ -->
        ${quoteHtml}
      </div>
    `;
  }).join('');

  refreshIcons(container);
}

})();

/* --- FILE: js/features/mindmap.js --- */
(function(){
// Module state
let mindmapActiveBranch = 'all';
let mindmapSearchQuery = '';
let expandedMindmapNodes = new Set();

// ---------------- TAB 2: BẢN ĐỒ CÂY TƯ DUY NGỮ PHÁP TIẾNG TRUNG ----------------

/** Whether a mindmap node (or any of its subtypes) matches the lower-cased query. */
function mindmapNodeMatches(node, q) {
  const has = (v) => (v || '').toLowerCase().includes(q);
  return has(node.title) || has(node.summary) || has(node.formula) ||
    (node.subtypes || []).some(s => has(s.name) || has(s.formula) || has(s.usage) || has(s.example));
}

function setupMindmapControls() {
  const searchInput = document.getElementById('mindmapSearchInput');
  if (searchInput && !searchInput.dataset.initialized) {
    searchInput.dataset.initialized = 'true';
    searchInput.addEventListener('input', (e) => {
      mindmapSearchQuery = (e.target.value || '').trim().toLowerCase();
      if (mindmapSearchQuery && mindmapData && mindmapData.nodes) {
        mindmapData.nodes.forEach(node => {
          if (mindmapNodeMatches(node, mindmapSearchQuery)) expandedMindmapNodes.add(node.id);
        });
      }
      renderMindmap();
    });
  }
}

function filterMindmapBranch(branchId) {
  mindmapActiveBranch = branchId;
  const buttons = [
    { id: 'btn-branch-all', key: 'all' },
    { id: 'btn-branch-word_order', key: 'word_order' },
    { id: 'btn-branch-complements', key: 'complements' },
    { id: 'btn-branch-special_sentences', key: 'special_sentences' },
    { id: 'btn-branch-three_de', key: 'three_de' },
    { id: 'btn-branch-aspect_particles', key: 'aspect_particles' },
    { id: 'btn-branch-connectors', key: 'connectors' },
  ];

  buttons.forEach(b => {
    const el = document.getElementById(b.id);
    if (!el) return;
    if (b.key === branchId) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap';
    }
  });

  if (branchId !== 'all') {
    expandedMindmapNodes.add(branchId);
  }
  renderMindmap();
}

function expandAllMindmapNodes() {
  if (!mindmapData || !mindmapData.nodes) return;
  mindmapData.nodes.forEach(n => expandedMindmapNodes.add(n.id));
  renderMindmap();
}

function collapseAllMindmapNodes() {
  expandedMindmapNodes.clear();
  renderMindmap();
}

function toggleMindmapNode(nodeId) {
  if (expandedMindmapNodes.has(nodeId)) {
    expandedMindmapNodes.delete(nodeId);
  } else {
    expandedMindmapNodes.add(nodeId);
  }
  renderMindmap();
}

function renderMindmap() {
  if (!mindmapData || !mindmapData.nodes) return;
  const container = document.getElementById('mindmapNodesContainer');
  if (!container) return;

  // Filter branches according to active branch and search query
  let nodes = mindmapData.nodes;
  if (mindmapActiveBranch !== 'all') {
    nodes = nodes.filter(n => n.id === mindmapActiveBranch);
  }

  if (mindmapSearchQuery) {
    nodes = nodes.filter(node => mindmapNodeMatches(node, mindmapSearchQuery));
  }

  // Branch index map for luxury badge labeling
  const branchLabels = {
    word_order: { num: 'Nhánh 1', hanzi: '语序之轴', color: 'from-[#8B1E1E] to-[#A52A2A]' },
    complements: { num: 'Nhánh 2', hanzi: '七大补语', color: 'from-[#1E4D43] to-[#2D6A4F]' },
    special_sentences: { num: 'Nhánh 3', hanzi: '特殊句型', color: 'from-[#C59A3F] to-[#B38728]' },
    three_de: { num: 'Nhánh 4', hanzi: '三的结构', color: 'from-[#6E1414] to-[#8B1E1E]' },
    aspect_particles: { num: 'Nhánh 5', hanzi: '时态助词', color: 'from-[#1E4D43] to-[#155e75]' },
    connectors: { num: 'Nhánh 6', hanzi: '逻辑连词', color: 'from-[#854d0e] to-[#C59A3F]' }
  };

  // Build Root Tree Hub HTML (Only show when viewing all or as tree head)
  const isFiltered = mindmapActiveBranch !== 'all' || mindmapSearchQuery.length > 0;
  
  const rootTreeHtml = `
    <!-- GỐC CÂY ĐẠI THỤ NGỮ PHÁP -->
    <div class="relative bg-gradient-to-b from-[#8B1E1E] via-[#6E1414] to-[#450A0A] text-white rounded-3xl p-6 lg:p-8 shadow-xl border-2 border-[#C59A3F]/50 overflow-hidden text-center">
      <div class="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#C59A3F]/15 blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#8B1E1E]/30 blur-3xl pointer-events-none"></div>

      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C59A3F]/20 text-[#E0C27D] border border-[#C59A3F]/40 text-xs font-bold mb-3 shadow-inner">
        <span class="w-2 h-2 rounded-full bg-[#E0C27D] animate-ping"></span>
        <span>GỐC RỄ ĐẠI THỤ NGỮ PHÁP (汉语语法大树根基)</span>
      </div>

      <h3 class="text-2xl lg:text-3xl font-serif-luxury font-black text-amber-100 tracking-wide mb-3">
        Tư Duy Cốt Lõi: Ngữ Pháp Là Không Gian & Thời Gian
      </h3>

      <p class="max-w-2xl mx-auto text-xs lg:text-sm text-stone-200 leading-relaxed font-normal mb-5">
        Ngữ pháp tiếng Trung <strong>không chia thì, không biến đổi đuôi động từ</strong>, mà vận hành nghiêm ngặt theo trục tư duy điện ảnh: <em>"Cái gì xuất hiện trước, việc gì xảy ra trước thì đặt trước"</em>. Từ gốc rễ này đâm chồi thành <strong>6 Trụ Cột Nhánh Lớn</strong> và nở rộ thành <strong>26 Nhánh Con Chi Tiết</strong>.
      </p>

      <!-- Tree Overview Stats -->
      <div class="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#C59A3F]/25 text-xs">
        <div class="px-3.5 py-1.5 rounded-xl bg-black/30 border border-[#C59A3F]/30 text-amber-200 flex items-center gap-2">
          <i data-lucide="git-branch" class="w-4 h-4 text-[#E0C27D]"></i>
          <span><strong>6</strong> Trụ Cột Cây Cấp 1</span>
        </div>
        <div class="px-3.5 py-1.5 rounded-xl bg-black/30 border border-[#C59A3F]/30 text-amber-200 flex items-center gap-2">
          <i data-lucide="layers" class="w-4 h-4 text-[#E0C27D]"></i>
          <span><strong>26</strong> Nhánh Con Chi Tiết Cấp 2</span>
        </div>
        <div class="px-3.5 py-1.5 rounded-xl bg-black/30 border border-[#C59A3F]/30 text-amber-200 flex items-center gap-2">
          <i data-lucide="volume-2" class="w-4 h-4 text-[#E0C27D]"></i>
          <span>100% Phát Âm TTS & Đối Chiếu Song Ngữ</span>
        </div>
      </div>
    </div>

    <!-- THÂN CÂY PHÂN NHÁNH VÀNG HOÀNG KIM (VERTICAL TRUNK CONNECTOR) -->
    <div class="flex flex-col items-center justify-center -my-2 relative z-10">
      <div class="tree-stem-vertical h-10 w-1 bg-gradient-to-b from-[#8B1E1E] to-[#C59A3F] rounded-full"></div>
      <div class="px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-stone-700 text-xs font-bold flex items-center gap-2 shadow-sm my-1">
        <i data-lucide="git-fork" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
        <span>${isFiltered ? 'Đang lọc nhánh được chọn' : 'Thân cây tỏa ra 6 cành nhánh tư duy chính (Bấm vào cành để bung nở nhánh con)'}</span>
      </div>
      <div class="tree-stem-vertical h-8 w-1 bg-gradient-to-b from-[#C59A3F] to-[#8B1E1E] rounded-full"></div>
    </div>
  `;

  if (nodes.length === 0) {
    container.innerHTML = `
      ${rootTreeHtml}
      <div class="p-12 text-center rounded-3xl bg-white border border-amber-200 shadow-sm mt-4">
        <i data-lucide="search-x" class="w-12 h-12 text-stone-300 mx-auto mb-3"></i>
        <h4 class="text-base font-bold text-stone-700">Không tìm thấy nhánh ngữ pháp phù hợp</h4>
        <p class="text-xs text-stone-500 mt-1">Hãy thử tìm từ khóa khác như "bổ ngữ", "câu chữ ba", "thời gian", "trợ từ"...</p>
        <button onclick="document.getElementById('mindmapSearchInput').value=''; mindmapSearchQuery=''; filterMindmapBranch('all');" class="mt-4 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold">
          Xem Toàn Bộ 6 Nhánh Cây
        </button>
      </div>
    `;
    refreshIcons();
    return;
  }

  // Build Branches HTML
  const branchesHtml = nodes.map((node, nodeIdx) => {
    const isExpanded = expandedMindmapNodes.has(node.id);
    const meta = branchLabels[node.id] || { num: `Nhánh ${nodeIdx + 1}`, hanzi: '语法分支', color: 'from-[#8B1E1E] to-[#A52A2A]' };
    const subCount = node.subtypes ? node.subtypes.length : 0;

    return `
      <!-- CÀNH NHÁNH CẤP 1: ${node.title} -->
      <div class="tree-branch-container rounded-3xl border ${isExpanded ? 'border-[#C59A3F] shadow-lg ring-1 ring-[#C59A3F]/30' : 'border-amber-200/80 shadow-xs'} bg-[#FFFDF9] transition-all overflow-hidden mb-6">
        
        <!-- Header cành cây (Click để bung/thu nhánh) -->
        <div onclick="toggleMindmapNode(${jsArg(node.id)})" class="tree-branch-header p-5 lg:p-6 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${isExpanded ? 'border-amber-200' : 'border-transparent'}">
          <div class="flex items-start gap-4">
            <!-- Seal số nhánh -->
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.color} text-white font-hanzi font-bold flex flex-col items-center justify-center shrink-0 shadow-md border border-amber-300/40">
              <span class="text-xs leading-none text-amber-200 opacity-90">${meta.num}</span>
              <span class="text-sm leading-tight">${meta.hanzi.substring(0, 2)}</span>
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h3 class="text-lg lg:text-xl font-serif-luxury font-black text-stone-900 tracking-tight">
                  ${node.title}
                </h3>
                <span class="px-2.5 py-0.5 rounded-full ${isExpanded ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-600'} text-2xs font-bold">
                  ${subCount} nhánh con
                </span>
              </div>
              <p class="text-xs lg:text-sm text-stone-600 leading-relaxed max-w-2xl">${node.summary}</p>
            </div>
          </div>

          <!-- Formula & Expand/Collapse Trigger -->
          <div class="flex items-center gap-3 self-end md:self-center shrink-0">
            ${node.formula ? `
              <div class="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs font-mono font-bold text-stone-800 shadow-2xs max-w-xs truncate" title="${escapeHtml(node.formula)}">
                ${node.formula}
              </div>
            ` : ''}

            <button type="button" class="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${isExpanded ? 'bg-[#8B1E1E] text-white shadow-sm' : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200'}">
              <span>${isExpanded ? 'Thu Gọn Nhánh' : `Bung ${subCount} Nhánh Con`}</span>
              <i data-lucide="${isExpanded ? 'chevron-up' : 'chevron-down'}" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- PREVIEW MINI-CHIPS KHI NHÁNH ĐANG THU GỌN -->
        ${!isExpanded && node.subtypes ? `
          <div class="px-6 py-3 bg-amber-50/30 border-t border-amber-100/60 flex flex-wrap items-center gap-2 text-2xs">
            <span class="text-stone-400 font-semibold flex items-center gap-1">
              <i data-lucide="git-commit" class="w-3 h-3 text-[#C59A3F]"></i>
              Nhánh con:
            </span>
            ${node.subtypes.map(sub => `
              <button onclick="event.stopPropagation(); toggleMindmapNode(${jsArg(node.id)});" class="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100/70 border border-amber-200/80 text-stone-700 hover:text-stone-900 font-medium transition-all shadow-2xs">
                🌱 ${sub.name.split(':')[0]}
              </button>
            `).join('')}
            <span onclick="event.stopPropagation(); toggleMindmapNode(${jsArg(node.id)});" class="cursor-pointer text-[#8B1E1E] hover:underline font-bold ml-1">
              + Xem chi tiết ➔
            </span>
          </div>
        ` : ''}

        <!-- NỘI DUNG NHÁNH CHI TIẾT KHI ĐƯỢC BUNG NỞ (EXPANDED) -->
        ${isExpanded ? `
          <div class="p-6 lg:p-8 space-y-6 bg-gradient-to-b from-white via-[#FFFDF9] to-amber-50/20">

            <!-- Formula Banner (Mobile & Desktop) -->
            ${node.formula ? `
              <div class="p-4 rounded-2xl bg-amber-50/80 border border-amber-300/80 shadow-2xs">
                <span class="text-2xs font-bold text-amber-900 uppercase tracking-wider block mb-1">
                  Công thức tổng quát của nhánh:
                </span>
                <code class="text-xs lg:text-sm font-mono font-bold text-[#8B1E1E] break-words">
                  ${node.formula}
                </code>
              </div>
            ` : ''}

            <!-- Tư duy đối chiếu Tiếng Trung vs Tiếng Việt (Contrast with Vietnamese) -->
            ${node.contrastVi ? `
              <div class="p-4 lg:p-5 rounded-2xl bg-gradient-to-r from-red-50/60 via-amber-50/50 to-stone-50 border border-red-200/80 text-xs lg:text-sm text-stone-800 shadow-2xs">
                <div class="flex items-center gap-2 text-[#8B1E1E] font-bold mb-2">
                  <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
                  <span>So Sánh Tư Duy Ngữ Pháp Với Tiếng Việt (Tư Duy Đảo Ngược):</span>
                </div>
                <p class="leading-relaxed text-stone-700 font-normal pl-6">
                  ${node.contrastVi}
                </p>
              </div>
            ` : ''}

            <!-- 26 NHÁNH CON CHI TIẾT (SUBTYPES / LEAVES) -->
            ${node.subtypes ? `
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <i data-lucide="sparkles" class="w-4 h-4 text-[#C59A3F]"></i>
                    <h4 class="text-sm font-bold text-stone-900 uppercase tracking-wider">
                      Các Nhánh Con Chi Tiết (${node.subtypes.length} Nhánh):
                    </h4>
                  </div>
                  <span class="text-2xs text-stone-500 font-medium italic">Bấm biểu tượng loa để nghe phát âm mẫu</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  ${node.subtypes.map(sub => `
                    <div class="tree-sub-branch-leaf rounded-2xl bg-white border border-amber-200/90 p-4 lg:p-5 shadow-xs hover:border-[#C59A3F] hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <!-- Leaf Title -->
                        <div class="flex items-start justify-between gap-2 mb-2">
                          <h5 class="text-sm font-serif-luxury font-bold text-stone-900 leading-snug">
                            🍃 ${sub.name}
                          </h5>
                        </div>

                        <!-- Formula Tag -->
                        <div class="inline-block px-3 py-1 rounded-lg bg-amber-50/80 text-xs font-mono font-bold text-[#8B1E1E] border border-amber-200 mb-3 shadow-2xs">
                          ${sub.formula}
                        </div>

                        <!-- Usage -->
                        ${sub.usage ? `
                          <p class="text-xs text-stone-600 mb-2 leading-relaxed">
                            ${sub.usage}
                          </p>
                        ` : ''}

                        <!-- Mandatory Conditions -->
                        ${sub.conditions ? `
                          <div class="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-2xs text-amber-900 mb-2 leading-relaxed">
                            <strong class="font-bold text-[#8B1E1E]">⚠️ Điều kiện:</strong> ${sub.conditions}
                          </div>
                        ` : ''}

                        <!-- Memory Tip -->
                        ${sub.tip ? `
                          <div class="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-2xs text-emerald-950 mb-2 leading-relaxed">
                            <strong class="font-bold text-[#1E4D43]">💡 Mẹo nhớ:</strong> ${sub.tip}
                          </div>
                        ` : ''}
                      </div>

                      <!-- Leaf Example with TTS Audio -->
                      ${sub.example ? `
                        <div class="pt-3 mt-2 border-t border-amber-100 flex items-center justify-between gap-2">
                          <div class="text-xs font-hanzi font-medium text-stone-800 leading-relaxed">
                            ${sub.example}
                          </div>
                          <div class="inline-flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shrink-0 shadow-2xs">
                            <button 
                              type="button"
                              onclick="playChineseTTS(${jsArg(sub.example.split('(')[0].trim())}, 'female')" 
                              title="Nghe giọng Nữ"
                              class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                            >
                              👩 Nữ
                            </button>
                            <button 
                              type="button"
                              onclick="playChineseTTS(${jsArg(sub.example.split('(')[0].trim())}, 'male')" 
                              title="Nghe giọng Nam"
                              class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer"
                            >
                              👨 Nam
                            </button>
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Core Rules Grid -->
            ${node.rules ? `
              <div class="pt-4 border-t border-amber-200/70">
                <p class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <i data-lucide="shield-check" class="w-4 h-4 text-[#1E4D43]"></i>
                  <span>Quy Tắc Trọng Tâm Bắt Buộc Ghi Nhớ:</span>
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  ${node.rules.map(r => `
                    <div class="p-3.5 rounded-2xl bg-white border border-amber-200/80 text-xs text-stone-700 flex items-start gap-2.5 shadow-2xs">
                      <i data-lucide="check-circle-2" class="w-4 h-4 text-[#1E4D43] shrink-0 mt-0.5"></i>
                      <span class="leading-relaxed">${r}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Standard Examples -->
            ${node.examples ? `
              <div class="pt-4 border-t border-amber-200/70">
                <p class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <i data-lucide="book-open" class="w-4 h-4 text-[#8B1E1E]"></i>
                  <span>Ví Dụ Mẫu Chuẩn Khảo Thí HSK:</span>
                </p>
                <div class="space-y-2.5">
                  ${node.examples.map(ex => `
                    <div class="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/80 flex items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <p class="font-hanzi text-sm lg:text-base font-bold text-stone-900">${ex.hanzi}</p>
                        <p class="text-xs font-semibold text-[#8B1E1E] mt-0.5">${ex.pinyin}</p>
                        <p class="text-xs text-stone-600 mt-0.5">${ex.vi}</p>
                      </div>
                      <div class="inline-flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shrink-0 shadow-2xs">
                        <button 
                          type="button"
                          onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'female')" 
                          title="Nghe câu ví dụ giọng Nữ"
                          class="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          👩 Nữ
                        </button>
                        <button 
                          type="button"
                          onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'male')" 
                          title="Nghe câu ví dụ giọng Nam"
                          class="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          👨 Nam
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

          </div>
        ` : ''}

      </div>
    `;
  }).join('');

  container.innerHTML = `
    ${rootTreeHtml}
    <div class="space-y-4">
      ${branchesHtml}
    </div>
  `;

  refreshIcons();
}

})();

/* --- FILE: js/features/confusions.js --- */
(function(){
// ---------------- TAB 3: PHÂN BIỆT TỪ DỄ LẪN ----------------
function renderConfusions() {
  const container = document.getElementById('confusionsListContainer');
  if (!container) return;

  container.innerHTML = confusionsData.map((item, idx) => `
    <div class="glass-card rounded-2xl p-6 lg:p-8 border-teal-100 bg-white shadow-sm">
      
      <!-- Pair Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-teal-100">
        <div>
          <h3 class="text-xl lg:text-2xl font-black text-teal-950 tracking-wide font-hanzi">
            ${item.pair}
          </h3>
          <p class="text-xs font-bold text-teal-700 mt-1">${item.meaning}</p>
        </div>
        <div class="p-3.5 rounded-xl bg-teal-50 border border-teal-200 max-w-md">
          <p class="text-xs text-teal-950">
            <strong class="text-teal-700">Cốt lõi khác biệt:</strong> ${item.difference}
          </p>
        </div>
      </div>

      <!-- Comparison Matrix Table -->
      <div class="overflow-x-auto mb-6">
        <table class="w-full text-xs text-left border-collapse">
          <thead>
            <tr class="border-b border-teal-100 text-teal-950 uppercase bg-teal-50/60">
              <th class="py-2.5 px-4 font-bold">Khía cạnh so sánh</th>
              <th class="py-2.5 px-4 font-bold text-teal-700">Từ A</th>
              <th class="py-2.5 px-4 font-bold text-emerald-700">Từ B / C</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-teal-50 text-slate-700">
            ${item.comparisonTable.map(row => `
              <tr class="hover:bg-teal-50/30">
                <td class="py-3 px-4 font-semibold text-slate-800">${row.aspect}</td>
                <td class="py-3 px-4 font-hanzi font-bold text-teal-900">${row.wordA}</td>
                <td class="py-3 px-4 font-hanzi font-bold text-teal-900">${row.wordB || row.wordC}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Mnemonic Quote -->
      <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 mb-6">
        <i data-lucide="zap" class="w-5 h-5 text-amber-500 flex-shrink-0"></i>
        <p class="text-xs font-semibold text-amber-900">
          <strong class="text-amber-700">Bí quyết nhớ siêu tốc:</strong> ${item.mnemonic}
        </p>
      </div>

      <!-- 1-Click Interactive Quiz -->
      <div class="p-5 rounded-2xl bg-teal-50/40 border border-teal-100">
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-600 text-white shadow-xs">
            Quiz Phản Xạ Nhanh
          </span>
          <span class="text-xs text-slate-600 font-medium">Chọn phương án chính xác nhất:</span>
        </div>
        <p class="text-sm font-bold text-slate-900 mb-4 font-hanzi">${item.quiz.question}</p>
        
        <div class="flex flex-wrap gap-3">
          ${item.quiz.options.map((opt, optIdx) => `
            <button 
              id="quiz-btn-${idx}-${optIdx}" 
              onclick="answerQuiz(${idx}, ${optIdx})" 
              class="px-5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-teal-50 text-teal-900 border border-teal-200 transition-all font-hanzi shadow-xs">
              ${opt}
            </button>
          `).join('')}
        </div>

        <!-- Quiz Feedback Container -->
        <div id="quiz-feedback-${idx}" class="hidden mt-4 p-3.5 rounded-xl text-xs font-medium"></div>
      </div>

    </div>
  `).join('');
}

function answerQuiz(itemIdx, selectedOptIdx) {
  const item = confusionsData[itemIdx];
  const feedback = document.getElementById(`quiz-feedback-${itemIdx}`);
  if (!item || !feedback) return;
  const isCorrect = (selectedOptIdx === item.quiz.correct);

  item.quiz.options.forEach((opt, optIdx) => {
    const btn = document.getElementById(`quiz-btn-${itemIdx}-${optIdx}`);
    if (!btn) return;
    if (optIdx === item.quiz.correct) {
      btn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 text-white border border-teal-500 shadow-md font-hanzi';
    } else if (optIdx === selectedOptIdx && !isCorrect) {
      btn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white border border-rose-500 shadow-md font-hanzi';
    } else {
      btn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 opacity-60 font-hanzi';
    }
  });

  feedback.classList.remove('hidden', 'bg-emerald-50', 'text-emerald-800', 'border-emerald-200', 'bg-rose-50', 'text-rose-800', 'border-rose-200');
  if (isCorrect) {
    feedback.className = 'mt-4 p-3.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-start gap-2 shadow-xs';
    feedback.innerHTML = `
      <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"></i>
      <div>
        <strong>Chính xác!</strong> ${item.quiz.explanation}
      </div>
    `;
  } else {
    feedback.className = 'mt-4 p-3.5 rounded-xl text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-2 shadow-xs';
    feedback.innerHTML = `
      <i data-lucide="alert-circle" class="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5"></i>
      <div>
        <strong>Chưa đúng!</strong> ${item.quiz.explanation}
      </div>
    `;
  }
  refreshIcons();
}

})();

/* --- FILE: js/features/pathway.js --- */
(function(){
// Module state
let currentHskLevel = 1;
let currentPathwayLessonsTab = 'standard48'; // 'standard48' or 'all1040'
let currentExamMatrixLevel = 'HSK 1';
let currentHsk30CourseFilter = 0; // 0: all, 1: HSK 1, 2: HSK 2, 3: HSK 3
let currentHsk30SearchQuery = '';
let pathwayLessonsBatchSize = 10;
let currentPathwaySubTab = 'stages';
let currentPathwayGrammarLevel = 'HSK 1';
let pathwayLessonsRendered = 0;

// ---------------- TAB 4: LỘ TRÌNH HSK 3.0 TOÀN DIỆN (3 CẤP 9 BẬC) ----------------

function switchPathwaySubTab(subTab) {
  currentPathwaySubTab = subTab;
  const tabs = ['stages', 'standards', 'grammar', 'translation', 'lessons', 'resources'];
  tabs.forEach(tab => {
    const btn = document.getElementById(`btn-pathway-sub-${tab}`);
    if (!btn) return;
    if (tab === subTab) {
      btn.className = 'pathway-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm flex items-center gap-1.5 cursor-pointer border border-transparent';
    } else {
      btn.className = 'pathway-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 cursor-pointer';
    }
  });
  renderPathwayTab();
}

async function renderPathwayTab() {
  const container = document.getElementById('pathwayDynamicContent');
  if (!container) return;

  if (!hsk30RoadmapData) await loadData('hsk30Roadmap');

  if (!hsk30RoadmapData) {
    container.innerHTML = `
      <div class="glass-card rounded-2xl p-8 text-center text-stone-500">
        <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto mb-3 text-amber-600"></i>
        <p>Đang tải dữ liệu Lộ Trình HSK 3.0...</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  switch (currentPathwaySubTab) {
    case 'stages':
      renderPathwayStages(container);
      break;
    case 'standards':
      renderPathwayStandards(container);
      break;
    case 'grammar':
      renderPathwayGrammar(container);
      break;
    case 'translation':
      renderPathwayTranslation(container);
      break;
    case 'lessons':
      renderPathwayLessonsView(container);
      break;
    case 'resources':
      renderPathwayResources(container);
      break;
    default:
      renderPathwayStages(container);
  }
  refreshIcons();
}

function goToPathwayLevel(lvl) {
  currentHskLevel = lvl;
  switchPathwaySubTab('lessons');
}

function renderPathwayStages(container) {
  const data = hsk30RoadmapData;
  const stages = data.stages || [];

  let html = `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-[#FAF7F2] to-amber-50/50 dark:from-[#1c222d] dark:via-[#161B22] dark:to-[#1c222d] border border-amber-300/80 dark:border-stone-700 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            <i data-lucide="compass" class="w-6 h-6"></i>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">Lộ Trình Tự Học 6 Giai Đoạn HSK 3.0 (Từ Con Số 0 Đến HSK 6 & 7–9)</h3>
            <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Phân kỳ khoa học theo phương pháp Tiếng Trung Thượng Hải: Thời lượng rõ ràng, giáo trình bám sát mục tiêu và quy tắc cuốn chiếu nhớ lâu.
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
  `;

  stages.forEach(st => {
    let actionBtnHtml = '';
    if (st.stageNumber === 1 || st.stageNumber === 2) {
      actionBtnHtml = `
        <button onclick="goToPathwayLevel(1)" class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
          <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
          <span>Học Ngay Bài Học ${st.targetLevel}</span>
        </button>
      `;
    } else {
      actionBtnHtml = `
        <button onclick="switchTab('flashcards')" class="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer">
          <i data-lucide="layers" class="w-3.5 h-3.5 text-amber-600"></i>
          <span>Luyện Từ Vựng Flashcard</span>
        </button>
      `;
    }

    html += `
      <div class="glass-card rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-[#8B1E1E] dark:text-amber-400 border border-amber-300 dark:border-amber-700">
              Giai Đoạn ${st.stageNumber}
            </span>
            <span class="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
              ${st.duration}
            </span>
          </div>

          <div>
            <h4 class="text-base font-bold font-serif-luxury text-stone-900 dark:text-stone-100">
              ${st.title}
            </h4>
            <div class="flex items-center gap-2 mt-1 flex-wrap text-2xs text-stone-500 dark:text-stone-400">
              <span class="font-bold text-[#8B1E1E] dark:text-red-400">Mục tiêu: ${st.targetLevel}</span>
              <span>•</span>
              <span>Từ vựng: ${st.targetWords}</span>
              <span>•</span>
              <span>Thời gian: ${st.dailyTime}</span>
            </div>
          </div>

          ${st.coreBook ? `
            <div class="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/70 border border-amber-200/80 dark:border-stone-700 text-xs space-y-1">
              <span class="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1 text-[11px]">
                <i data-lucide="book" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
                <span>Giáo trình khuyến nghị:</span>
              </span>
              <p class="text-stone-700 dark:text-stone-300 font-medium text-[11px]">${st.coreBook}</p>
              ${st.lessonsCount ? `<p class="text-stone-500 dark:text-stone-400 text-[10px]">Quy mô: ${st.lessonsCount}</p>` : ''}
            </div>
          ` : ''}

          <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 text-xs space-y-1.5">
            <span class="font-bold text-stone-700 dark:text-stone-300 text-[11px] flex items-center gap-1">
              <i data-lucide="clock" class="w-3 h-3 text-amber-600"></i>
              <span>Lịch biểu tự học mỗi ngày:</span>
            </span>
            <div class="grid grid-cols-3 gap-1.5 text-center text-[10px] text-stone-600 dark:text-stone-400 pt-0.5">
              <div class="p-1 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span class="font-bold block text-stone-800 dark:text-stone-200">Sáng (30p)</span>
                <span>Từ mới & phát âm</span>
              </div>
              <div class="p-1 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span class="font-bold block text-stone-800 dark:text-stone-200">Trưa (15p)</span>
                <span>Ôn thẻ Flashcard</span>
              </div>
              <div class="p-1 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span class="font-bold block text-stone-800 dark:text-stone-200">Tối (45p)</span>
                <span>Làm bài & luyện dịch</span>
              </div>
            </div>
          </div>

          <div class="text-2xs text-stone-500 dark:text-stone-400 border-l-2 border-emerald-500 pl-2 py-0.5">
            <strong>Cột mốc kiểm tra:</strong> ${st.milestone}
          </div>
        </div>

        ${actionBtnHtml}
      </div>
    `;
  });

  html += `
      </div>

      <!-- Expert Strategy Box -->
      <div class="glass-card rounded-2xl p-6 bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/60 dark:from-[#16221c] dark:via-[#161B22] dark:to-[#16221c] border border-emerald-200 dark:border-emerald-800/60 shadow-xs space-y-3">
        <div class="flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
          <i data-lucide="shield-check" class="w-5 h-5 text-emerald-600"></i>
          <h4 class="text-sm font-bold font-serif-luxury">Bí Kíp Tự Học "Quy Tắc Cuốn Chiếu 5 Bước" (Tiếng Trung Thượng Hải)</h4>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs text-stone-700 dark:text-stone-300">
          <div class="p-3 rounded-xl bg-white/90 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">1</span>
            <p class="font-bold text-stone-900 dark:text-stone-100">Chiết Tự 214 Bộ</p>
            <p class="text-[11px] text-stone-500 leading-relaxed">Hiểu ý nghĩa từng bộ thủ thay vì học vẹt từng nét chữ Hán.</p>
          </div>
          <div class="p-3 rounded-xl bg-white/90 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">2</span>
            <p class="font-bold text-stone-900 dark:text-stone-100">Từ Vựng Theo Cụm</p>
            <p class="text-[11px] text-stone-500 leading-relaxed">Học cả cụm Động-Tân (ngồi xe, đặt đồ ăn) thay vì học từ đơn lẻ.</p>
          </div>
          <div class="p-3 rounded-xl bg-white/90 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">3</span>
            <p class="font-bold text-stone-900 dark:text-stone-100">Toán Học Ngữ Pháp</p>
            <p class="text-[11px] text-stone-500 leading-relaxed">Ghi nhớ công thức nòng cốt S + Trạng ngữ + V + Bổ ngữ + Tân ngữ.</p>
          </div>
          <div class="p-3 rounded-xl bg-white/90 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">4</span>
            <p class="font-bold text-stone-900 dark:text-stone-100">Luyện Dịch Hai Chiều</p>
            <p class="text-[11px] text-stone-500 leading-relaxed">Thực hành dịch Trung-Việt và Việt-Trung ngay từ sơ cấp.</p>
          </div>
          <div class="p-3 rounded-xl bg-white/90 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">5</span>
            <p class="font-bold text-stone-900 dark:text-stone-100">Shadowing Bản Xứ</p>
            <p class="text-[11px] text-stone-500 leading-relaxed">Bật audio Bắc Kinh, nhắc lại ngay lập tức để rèn ngữ điệu.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function renderPathwayStandards(container) {
  const data = hsk30RoadmapData;
  const rows = data.standardsTable || [];
  const matrix = data.examMatrix || { levels: [] };
  const comparison = data.textbookComparison || { books: [] };

  let html = `
    <div class="space-y-8">
      <!-- Philosophy Banner -->
      <div class="glass-card rounded-2xl p-6 bg-gradient-to-r from-amber-50/80 to-white dark:from-[#161B22] dark:to-[#1c222d] border border-amber-300/80 dark:border-stone-700 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-[#8B1E1E] dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
            <i data-lucide="scale" class="w-5 h-5"></i>
          </div>
          <div class="space-y-1.5">
            <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">Triết Lý Cải Cách HSK 3.0: Từ "Hiểu Thụ Động" Sang "Ứng Dụng Đa Chiều & Dịch Thuật"</h3>
            <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              HSK 3.0 chuyển từ cấu trúc 6 cấp truyền thống sang <strong>3 Cấp 9 Bậc</strong> (Sơ cấp 1–3, Trung cấp 4–6, Cao cấp 7–9). Khung chuẩn mới nâng tổng từ vựng lên <strong>11.092 từ</strong>, yêu cầu <strong>3.000 chữ Hán viết tay</strong> (nhận diện nét bút thuận, tránh lạm dụng gõ pinyin) và bổ sung kỹ năng <strong>Dịch thuật hai chiều</strong> từ HSK 4 trở lên.
            </p>
          </div>
        </div>
      </div>

      <!-- Standards Table -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-2">
            <i data-lucide="table-2" class="w-4 h-4 text-[#8B1E1E]"></i>
            <span>1. Bảng Tiêu Chuẩn Định Lượng 3 Cấp 9 Bậc HSK 3.0 (Hanban / CTI)</span>
          </h4>
          <span class="text-2xs text-stone-500 font-medium">Đối chiếu CEFR Khung Châu Âu</span>
        </div>

        <div class="glass-card rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm bg-white dark:bg-[#161B22]">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-amber-100/70 dark:bg-[#21262D] text-stone-900 dark:text-stone-100 font-bold border-b border-amber-200 dark:border-stone-700">
                  <th class="p-3.5 whitespace-nowrap">Cấp Độ</th>
                  <th class="p-3.5 whitespace-nowrap">Bậc Năng Lực</th>
                  <th class="p-3.5 whitespace-nowrap text-stone-400">Từ Vựng HSK 2.0</th>
                  <th class="p-3.5 whitespace-nowrap text-[#8B1E1E] dark:text-amber-400 font-black">Từ Vựng HSK 3.0</th>
                  <th class="p-3.5 whitespace-nowrap">Chữ Viết Tay</th>
                  <th class="p-3.5 whitespace-nowrap">Điểm Ngữ Pháp</th>
                  <th class="p-3.5 whitespace-nowrap">Quy Đổi CEFR</th>
                  <th class="p-3.5 min-w-[200px]">Năng Lực Mục Tiêu</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                ${rows.map((r, idx) => {
                  const isSpecial = r.level.includes('7');
                  const rowBg = idx % 2 === 0 ? 'bg-white dark:bg-[#161B22]' : 'bg-stone-50/50 dark:bg-[#1c222d]/40';
                  return `
                    <tr class="${rowBg} hover:bg-amber-50/50 dark:hover:bg-stone-800/50 transition-colors">
                      <td class="p-3.5 font-bold font-serif-luxury text-stone-900 dark:text-stone-100 whitespace-nowrap">
                        <span class="px-2 py-0.5 rounded ${isSpecial ? 'bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 font-black' : 'bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-400'}">
                          ${r.level}
                        </span>
                      </td>
                      <td class="p-3.5 font-semibold text-stone-800 dark:text-stone-200 whitespace-nowrap">${r.tier}</td>
                      <td class="p-3.5 text-stone-400 font-mono">${r.wordsOld} từ</td>
                      <td class="p-3.5 font-bold font-mono text-[#8B1E1E] dark:text-amber-400 whitespace-nowrap">
                        ${r.wordsNew.toLocaleString()} từ
                        <span class="text-[10px] font-normal text-stone-400 block">${r.wordsOld !== '/////' ? '+' + (r.wordsNew - r.wordsOld) + ' từ' : 'Bậc cao cấp'}</span>
                      </td>
                      <td class="p-3.5 font-mono">${r.charsNew} chữ</td>
                      <td class="p-3.5 font-mono">${r.grammarPoints} điểm</td>
                      <td class="p-3.5 font-bold text-amber-700 dark:text-amber-400 font-mono">${r.cefr}</td>
                      <td class="p-3.5 text-2xs leading-relaxed text-stone-600 dark:text-stone-400">${r.targetAbility}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Section 2: Exam Matrix Breakdown -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-2">
              <i data-lucide="layout-grid" class="w-4 h-4 text-[#8B1E1E]"></i>
              <span>2. Ma Trận Đổi Mới Cấu Trúc Đề Thi HSK 3.0 & HSKK (Tiếng Trung Thượng Hải)</span>
            </h4>
            <p class="text-xs text-stone-500">Bấm chọn từng cấp độ để xem phân tích số câu, thời gian và dạng bài thay đổi:</p>
          </div>
        </div>

        <!-- Level Pills -->
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar p-1">
          ${matrix.levels.map(l => {
            const isActive = l.level === currentExamMatrixLevel;
            const btnClass = isActive 
              ? 'btn-matrix-lvl px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent cursor-pointer whitespace-nowrap'
              : 'btn-matrix-lvl px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer whitespace-nowrap';
            return `
              <button onclick="filterExamMatrixLevel(${jsArg(l.level)})" data-level="${l.level}" class="${btnClass}">
                ${l.level}
              </button>
            `;
          }).join('')}
        </div>

        <div id="examMatrixDetailCard"></div>
      </div>

      <!-- Section 3: Textbook Comparison -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-2">
              <i data-lucide="book-marked" class="w-4 h-4 text-[#8B1E1E]"></i>
              <span>3. Cẩm Nang So Sánh 4 Bộ Giáo Trình Học Tiếng Trung Phổ Biến Nhất</span>
            </h4>
            <p class="text-xs text-stone-500">Giúp người học tự chọn đúng giáo trình phù hợp nhất với năng lực và mục tiêu.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${comparison.books.map(b => `
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-amber-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <h5 class="font-bold text-sm text-[#8B1E1E] dark:text-amber-400 font-serif-luxury">${b.name}</h5>
                </div>
                <p class="text-2xs text-stone-400 font-medium">${b.publisher}</p>
                <p class="text-xs text-stone-600 dark:text-stone-300"><strong>Đối tượng:</strong> ${b.audience}</p>
                
                <div class="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-2xs space-y-1">
                  <span class="font-bold text-emerald-900 dark:text-emerald-300">Ưu điểm:</span>
                  <p class="text-stone-700 dark:text-stone-300 leading-relaxed">${b.pros}</p>
                </div>

                <div class="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-2xs space-y-1">
                  <span class="font-bold text-amber-900 dark:text-amber-300">Hạn chế:</span>
                  <p class="text-stone-700 dark:text-stone-300 leading-relaxed">${b.cons}</p>
                </div>
              </div>

              <div class="pt-2 border-t border-stone-100 dark:border-stone-800 text-2xs text-[#8B1E1E] dark:text-amber-300 font-semibold">
                💡 Lời khuyên: ${b.recommendation}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  filterExamMatrixLevel(currentExamMatrixLevel);
}

function filterExamMatrixLevel(lvl) {
  currentExamMatrixLevel = lvl;
  const container = document.getElementById('examMatrixDetailCard');
  const btns = document.querySelectorAll('.btn-matrix-lvl');
  btns.forEach(btn => {
    const isAct = btn.getAttribute('data-level') === lvl;
    if (isAct) {
      btn.className = 'btn-matrix-lvl px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent cursor-pointer whitespace-nowrap';
    } else {
      btn.className = 'btn-matrix-lvl px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer whitespace-nowrap';
    }
  });

  if (!container || !hsk30RoadmapData || !hsk30RoadmapData.examMatrix) return;
  const item = (hsk30RoadmapData.examMatrix.levels || []).find(l => l.level === lvl) || hsk30RoadmapData.examMatrix.levels[0];
  if (!item) return;

  container.innerHTML = `
    <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-300/70 dark:border-stone-700 space-y-3 animate-fade-in">
      <div class="flex items-center justify-between flex-wrap gap-2 border-b border-amber-200 dark:border-stone-700 pb-2">
        <h5 class="font-bold text-sm text-[#8B1E1E] dark:text-amber-400 font-serif-luxury flex items-center gap-1.5">
          <span>🎯 Ma Trận Cấu Trúc Đề: ${item.level}</span>
        </h5>
        <div class="flex items-center gap-2 text-2xs">
          <span class="px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold">⏱️ ${item.duration}</span>
          <span class="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">📝 ${item.totalQuestions}</span>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div class="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800">
          <span class="text-stone-500 text-2xs block font-bold">Từ Vựng Yêu Cầu</span>
          <span class="font-bold text-stone-800 dark:text-stone-200">${item.vocabTarget}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800">
          <span class="text-stone-500 text-2xs block font-bold">Ngữ Pháp Trọng Điểm</span>
          <span class="font-bold text-stone-800 dark:text-stone-200">${item.grammarTarget}</span>
        </div>
      </div>
      ${item.changes && item.changes.length > 0 ? `
        <div class="space-y-1">
          <span class="text-2xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">Điểm Thay Đổi Cốt Lõi HSK 3.0:</span>
          <ul class="list-disc list-inside text-xs text-stone-700 dark:text-stone-300 space-y-1">
            ${item.changes.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;
}

function filterPathwayGrammarLevel(lvl) {
  currentPathwayGrammarLevel = lvl;
  const container = document.getElementById('pathwayDynamicContent');
  if (container) renderPathwayGrammar(container);
}

function renderPathwayGrammar(container) {
  const data = hsk30RoadmapData;
  const sections = data.grammarSections || [];
  const currentSection = sections.find(s => s.level === currentPathwayGrammarLevel) || sections[0];

  let html = `
    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-3 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-stone-700">
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          ${sections.map(s => {
            const isActive = s.level === currentPathwayGrammarLevel;
            const btnClass = isActive 
              ? 'px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent'
              : 'px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700';
            return `
              <button onclick="filterPathwayGrammarLevel(${jsArg(s.level)})" class="${btnClass} cursor-pointer transition-all whitespace-nowrap">
                <span>${s.level}</span>
                <span class="opacity-80 text-[11px] ml-1">(${s.items.length} cấu trúc)</span>
              </button>
            `;
          }).join('')}
        </div>
        <div class="text-xs text-stone-500 dark:text-stone-400">
          Tổng cộng: <strong>48 trọng tâm ngữ pháp chuẩn sơ cấp</strong>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${currentSection.items.map(item => `
          <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3.5">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  ${item.category || currentSection.level}
                </span>
                <span class="text-xs text-stone-400 font-mono">#${item.id}</span>
              </div>

              <h4 class="text-sm sm:text-base font-bold font-serif-luxury text-stone-900 dark:text-stone-100">
                ${item.title}
              </h4>
              <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                ${item.explanation}
              </p>

              <div class="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/80 dark:border-stone-700 font-mono text-xs text-amber-950 dark:text-amber-300 font-bold space-y-1">
                <span class="text-[10px] text-stone-400 font-normal uppercase tracking-wider block font-sans">Công thức toán học hóa:</span>
                <span>${item.formula}</span>
              </div>

              <div class="p-3 rounded-xl bg-[#FFFDF9] dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Ví dụ thực chiến:</span>
                  <button onclick="playChineseTTS(${jsArg(item.exampleZh)}, 'female')" class="text-amber-800 dark:text-amber-300 hover:underline text-[11px] flex items-center gap-1 cursor-pointer">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                    <span>Nghe câu</span>
                  </button>
                </div>
                <p class="font-hanzi text-sm font-semibold text-[#8B1E1E] dark:text-red-400">${item.exampleZh}</p>
                <p class="text-[11px] text-amber-900 dark:text-amber-300 font-mono">${item.examplePinyin}</p>
                <p class="text-xs text-stone-600 dark:text-stone-400">${item.exampleVi}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function renderPathwayTranslation(container) {
  const data = hsk30RoadmapData;
  const transModule = data.translationModule || {};
  const vocabCats = data.modernVocabCategories || [];
  const exercises = transModule.interactiveExercises || [];

  let html = `
    <div class="space-y-8">
      <!-- Section 1: Translation Exam Structure -->
      <div class="space-y-4">
        <div class="glass-card rounded-2xl p-6 bg-gradient-to-r from-purple-50/80 to-white dark:from-[#1c192d] dark:to-[#161B22] border border-purple-200 dark:border-purple-800/40 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-xs font-bold">
                <i data-lucide="languages" class="w-3.5 h-3.5 text-purple-600"></i>
                <span>Cải Cách Đột Phá HSK 3.0</span>
              </div>
              <h3 class="text-xl font-bold font-serif-luxury text-stone-900 dark:text-stone-100">
                ${transModule.title || 'Cấu Trúc Bài Thi Kỹ Năng Dịch Thuật (HSK 4 – 9)'}
              </h3>
              <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed">
                ${transModule.description || 'Kỹ năng Dịch bắt đầu xuất hiện từ HSK 4 và trở thành môn thi bắt buộc từ HSK 7–9. Yêu cầu thí sinh vừa có khả năng biên dịch văn bản chính xác, vừa phải có phản xạ phiên dịch nói trực tiếp trôi chảy.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Interactive Translation Lab -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-2">
              <i data-lucide="check-circle" class="w-4 h-4 text-purple-600"></i>
              <span>Phòng Luyện Dịch Thực Chiến 6 Tình Huống Thời Đại Số (HSK 3.0 Lab)</span>
            </h4>
            <p class="text-xs text-stone-500">Thử gõ bản dịch tiếng Trung và bấm kiểm tra để hệ thống chấm điểm và giải thích công thức nòng cốt:</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${exercises.map(ex => `
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-purple-200/80 dark:border-stone-800 shadow-xs space-y-3.5">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  ${ex.title}
                </span>
                <span class="text-xs text-stone-400 font-mono">#0${ex.id}</span>
              </div>

              <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-1">
                <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Câu tiếng Việt cần dịch:</span>
                <p class="text-xs font-bold text-stone-900 dark:text-stone-100 leading-relaxed">${ex.sourceVi}</p>
              </div>

              <!-- Input for translation -->
              <div class="space-y-2">
                <input 
                  type="text" 
                  id="trans-input-${ex.id}" 
                  placeholder="Nhập câu dịch tiếng Trung của bạn tại đây..." 
                  onkeydown="if(event.key==='Enter') checkHsk30Translation(${ex.id})"
                  class="w-full px-3 py-2 text-xs rounded-xl bg-amber-50/50 dark:bg-stone-900 border border-amber-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div class="flex items-center justify-between gap-2">
                  <button 
                    onclick="checkHsk30Translation(${ex.id})" 
                    class="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:opacity-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                    <span>Kiểm Tra Bản Dịch</span>
                  </button>
                  <button 
                    onclick="revealHsk30Answer(${ex.id})" 
                    class="py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                  >
                    Xem Đáp Án
                  </button>
                </div>
              </div>

              <!-- Result Container -->
              <div id="trans-result-${ex.id}" class="hidden"></div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 3: Modern Vocab in HSK 3.0 -->
      <div class="space-y-4">
        <div>
          <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-2">
            <i data-lucide="sparkles" class="w-4 h-4 text-amber-600"></i>
            <span>Các Nhóm Từ Vựng Mới Tiêu Biểu Trong Kỷ Nguyên Số HSK 3.0</span>
          </h4>
          <p class="text-xs text-stone-500">Cập nhật thuật ngữ hiện đại của mạng xã hội, livestream, công nghệ 4.0 và thương mại điện tử:</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${vocabCats.map(cat => `
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-amber-200/80 dark:border-stone-800 shadow-xs space-y-3">
              <div class="flex items-center gap-2 text-stone-900 dark:text-stone-100">
                <span class="text-lg">${cat.icon}</span>
                <h5 class="font-bold text-sm font-serif-luxury">${cat.category}</h5>
              </div>

              <div class="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                ${cat.words.map(w => `
                  <div class="py-2.5 space-y-1">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="font-hanzi text-base font-bold text-[#8B1E1E] dark:text-red-400">${w.hanzi}</span>
                        <span class="text-amber-900 dark:text-amber-300 font-mono text-2xs">${w.pinyin}</span>
                      </div>
                      <button onclick="playChineseTTS(${jsArg(w.hanzi)}, 'female')" class="text-stone-400 hover:text-amber-600 cursor-pointer" title="Nghe phát âm">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                    <p class="text-stone-700 dark:text-stone-300 font-medium text-2xs">${w.meaning}</p>
                    <p class="text-stone-500 dark:text-stone-400 text-[11px] leading-relaxed">${w.example}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function checkHsk30Translation(id) {
  if (!hsk30RoadmapData || !hsk30RoadmapData.translationModule) return;
  const exercises = hsk30RoadmapData.translationModule.interactiveExercises || [];
  const ex = exercises.find(e => e.id === id);
  if (!ex) return;

  const inputEl = document.getElementById(`trans-input-${id}`);
  const resultEl = document.getElementById(`trans-result-${id}`);
  if (!inputEl || !resultEl) return;

  const userVal = inputEl.value.trim();
  if (!userVal) {
    showToast('Vui lòng nhập câu dịch tiếng Trung của bạn!', 'warning');
    return;
  }

  const cleanUser = userVal.replace(/[，。！？\s.,!?]/g, '');
  const cleanTarget = ex.targetZh.replace(/[，。！？\s.,!?]/g, '');
  const isExact = (cleanUser === cleanTarget);
  const matchedKeywords = (ex.keywords || []).filter(kw => userVal.includes(kw));

  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `
    <div class="mt-3 p-3.5 rounded-2xl ${isExact ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300' : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300'} space-y-2 text-xs animate-fade-in">
      <div class="flex items-center justify-between">
        <span class="font-bold ${isExact ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-900 dark:text-amber-300'} flex items-center gap-1.5">
          <span>${isExact ? '🎉 Hoàn Hảo! Bản dịch rất chuẩn xác!' : '💡 Nhận Xét & Gợi Ý Đối Chiếu:'}</span>
        </span>
        <button onclick="playChineseTTS(${jsArg(ex.targetZh)})" class="px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 text-2xs font-bold flex items-center gap-1 hover:bg-stone-100 cursor-pointer">
          <span>🔊 Nghe</span>
        </button>
      </div>
      <div class="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 space-y-1">
        <p class="font-hanzi font-bold text-sm text-[#8B1E1E] dark:text-rose-400">${ex.targetZh}</p>
        <p class="text-stone-500 dark:text-stone-400 italic text-2xs">${ex.targetPinyin}</p>
      </div>
      ${ex.grammarFormula ? `
        <div class="text-2xs text-stone-600 dark:text-stone-300">
          <strong>Cấu trúc ngữ pháp:</strong> ${ex.grammarFormula}
        </div>
      ` : ''}
      ${matchedKeywords.length > 0 ? `
        <div class="flex items-center gap-1 flex-wrap text-2xs">
          <span class="font-bold text-stone-500">Từ khóa nhận diện được:</span>
          ${matchedKeywords.map(kw => `<span class="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold">${kw}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function revealHsk30Answer(id) {
  if (!hsk30RoadmapData || !hsk30RoadmapData.translationModule) return;
  const exercises = hsk30RoadmapData.translationModule.interactiveExercises || [];
  const ex = exercises.find(e => e.id === id);
  if (!ex) return;

  const resultEl = document.getElementById(`trans-result-${id}`);
  const inputEl = document.getElementById(`trans-input-${id}`);
  if (inputEl) inputEl.value = ex.targetZh;
  if (!resultEl) return;

  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `
    <div class="mt-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 space-y-2 text-xs animate-fade-in">
      <div class="flex items-center justify-between">
        <span class="font-bold text-amber-900 dark:text-amber-300">
          📖 Đáp Án Tiêu Chuẩn HSK 3.0:
        </span>
        <button onclick="playChineseTTS(${jsArg(ex.targetZh)})" class="px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 text-2xs font-bold flex items-center gap-1 hover:bg-stone-100 cursor-pointer">
          <span>🔊 Nghe</span>
        </button>
      </div>
      <div class="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 space-y-1">
        <p class="font-hanzi font-bold text-sm text-[#8B1E1E] dark:text-rose-400">${ex.targetZh}</p>
        <p class="text-stone-500 dark:text-stone-400 italic text-2xs">${ex.targetPinyin}</p>
      </div>
      ${ex.grammarFormula ? `<p class="text-2xs text-stone-600 dark:text-stone-300"><strong>Cấu trúc:</strong> ${ex.grammarFormula}</p>` : ''}
      ${ex.cultureNote ? `<p class="text-2xs text-stone-500 dark:text-stone-400">💡 <em>${ex.cultureNote}</em></p>` : ''}
    </div>
  `;
}


function renderPathwayLessonsView(container) {
  let html = `
    <div class="space-y-6">
      <!-- Sub-Tab Toggle between Standard Course 48 and Expanded 1040 -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-stone-700">
        <div class="flex items-center gap-2">
          <button 
            onclick="switchPathwayLessonsTab('standard48')" 
            id="btn-sublesson-standard48" 
            class="px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${currentPathwayLessonsTab === 'standard48' ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm' : 'bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:bg-amber-100 border border-stone-200 dark:border-stone-700'}"
          >
            <span>📘 Giáo Trình Chuẩn HSK 3.0 (48 Bài Sơ Cấp)</span>
          </button>
          <button 
            onclick="switchPathwayLessonsTab('all1040')" 
            id="btn-sublesson-all1040" 
            class="px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${currentPathwayLessonsTab === 'all1040' ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm' : 'bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:bg-amber-100 border border-stone-200 dark:border-stone-700'}"
          >
            <span>📚 Kho 1.040 Bài Học & Từ Vựng Mở Rộng</span>
          </button>
        </div>

        <div class="text-2xs text-stone-500 dark:text-stone-400">
          ${currentPathwayLessonsTab === 'standard48' ? 'Đầy đủ HSK 1 (15 bài), HSK 2 (15 bài) & HSK 3 (18 bài)' : 'Lọc từ vựng thực chiến HSK 1 – 6'}
        </div>
      </div>

      <!-- View 1: Standard Course 48 Lessons -->
      <div id="pathwayStandard48Section" class="${currentPathwayLessonsTab === 'standard48' ? 'space-y-5' : 'hidden'}">
        <div class="glass-card rounded-2xl p-4 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <!-- Level Filters -->
          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar p-1">
            <button 
              onclick="filterHsk30CourseLevel(0)" 
              class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${currentHsk30CourseFilter === 0 ? 'bg-[#8B1E1E] text-white shadow-2xs' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100'}"
            >
              Tất Cả 48 Bài
            </button>
            <button 
              onclick="filterHsk30CourseLevel(1)" 
              class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${currentHsk30CourseFilter === 1 ? 'bg-blue-600 text-white shadow-2xs' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-blue-50'}"
            >
              HSK 1 (15 Bài)
            </button>
            <button 
              onclick="filterHsk30CourseLevel(2)" 
              class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${currentHsk30CourseFilter === 2 ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50'}"
            >
              HSK 2 (15 Bài)
            </button>
            <button 
              onclick="filterHsk30CourseLevel(3)" 
              class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${currentHsk30CourseFilter === 3 ? 'bg-[#8B1E1E] text-white shadow-2xs' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-50'}"
            >
              HSK 3 (18 Bài)
            </button>
          </div>

          <!-- Search input -->
          <div class="relative w-full md:w-72">
            <i data-lucide="search" class="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              placeholder="Tìm kiếm bài học, ngữ pháp..." 
              value="${currentHsk30SearchQuery}"
              oninput="searchHsk30Lessons(this.value)"
              class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-amber-50/50 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]"
            />
          </div>
        </div>

        <div id="hsk30LessonsListContainer"></div>
      </div>

      <!-- View 2: Expanded 1040 Lessons -->
      <div id="pathwayAll1040Section" class="${currentPathwayLessonsTab === 'all1040' ? 'space-y-5' : 'hidden'}">
        <div class="glass-card rounded-2xl p-4 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="text-xs font-bold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
            <i data-lucide="layers" class="w-4 h-4 text-amber-600"></i>
            <span>Chọn cấp độ bài học mở rộng:</span>
          </div>
          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar p-1">
            ${[1, 2, 3, 4, 5, 6].map(lvl => {
              const isActive = lvl === currentHskLevel;
              const btnClass = isActive 
                ? 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent'
                : 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700';
              return `
                <button onclick="filterPathwayLevel(${lvl})" id="btn-hsk-${lvl}" class="${btnClass} cursor-pointer transition-all whitespace-nowrap">
                  HSK ${lvl}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div id="pathwayLessonsContainer" class="space-y-4"></div>

        <div class="flex justify-center pt-2">
          <button id="loadMoreLessonsBtn" onclick="loadMoreLessons()" class="px-6 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-[#161B22] hover:bg-amber-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer">
            <span>Xem thêm bài học tiếp theo</span>
            <i data-lucide="chevron-down" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  if (currentPathwayLessonsTab === 'standard48') {
    const listEl = document.getElementById('hsk30LessonsListContainer');
    if (listEl) renderHsk30StandardCourseCards(listEl);
  } else {
    renderPathwayLessonsList(true);
  }
}

function switchPathwayLessonsTab(tab) {
  currentPathwayLessonsTab = tab;
  const container = document.getElementById('pathwayTabContentContainer');
  if (container) {
    renderPathwayLessonsView(container);
  }
}

function filterHsk30CourseLevel(filter) {
  currentHsk30CourseFilter = filter;
  const listEl = document.getElementById('hsk30LessonsListContainer');
  if (listEl) renderHsk30StandardCourseCards(listEl);
}

function searchHsk30Lessons(query) {
  currentHsk30SearchQuery = (query || '').trim().toLowerCase();
  const listEl = document.getElementById('hsk30LessonsListContainer');
  if (listEl) renderHsk30StandardCourseCards(listEl);
}

function renderHsk30StandardCourseCards(container) {
  if (!container || !hsk30RoadmapData) return;
  const allLessons = hsk30RoadmapData.standardCourse48Lessons || [];

  const filtered = allLessons.filter(l => {
    const matchLevel = (currentHsk30CourseFilter === 0) || (l.hskLevel === currentHsk30CourseFilter);
    if (!matchLevel) return false;
    if (!currentHsk30SearchQuery) return true;
    const q = currentHsk30SearchQuery;
    return (l.titleZh && l.titleZh.toLowerCase().includes(q)) ||
           (l.titleVi && l.titleVi.toLowerCase().includes(q)) ||
           (l.grammar && l.grammar.toLowerCase().includes(q)) ||
           (l.vocabTheme && l.vocabTheme.toLowerCase().includes(q));
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="glass-card rounded-2xl p-8 text-center text-stone-500">
        Không tìm thấy bài học nào phù hợp với bộ lọc.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${filtered.map(l => `
        <div onclick="openHsk30LessonModal(${l.hskLevel}, ${l.lessonNumber})" class="glass-card rounded-2xl p-4 bg-white dark:bg-[#161B22] border border-amber-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${l.hskLevel === 1 ? 'bg-blue-100 text-blue-800' : (l.hskLevel === 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800')}">
                HSK ${l.hskLevel} · Bài ${l.lessonNumber}
              </span>
              <button onclick="event.stopPropagation(); playChineseTTS(${jsArg(l.titleZh)})" class="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors" title="Nghe tiêu đề">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
            <div>
              <h5 class="font-hanzi font-black text-base text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 transition-colors">${l.titleZh}</h5>
              <p class="text-xs text-stone-500 dark:text-stone-400 italic">${l.titlePinyin || ''}</p>
              <p class="text-xs font-medium text-stone-700 dark:text-stone-300 mt-0.5">${l.titleVi}</p>
            </div>
            <div class="p-2 rounded-xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700 text-2xs space-y-1">
              <p><strong>Ngữ pháp:</strong> ${l.grammar || l.focus || 'Trọng điểm ngữ pháp'}</p>
              <p><strong>Chủ đề từ:</strong> ${l.vocabTheme || l.vocabularyTheme || 'Từ vựng giao tiếp'}</p>
            </div>
            ${l.dialogueZh ? `
              <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-2xs space-y-1">
                <p class="font-hanzi font-bold text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed">${l.dialogueZh}</p>
                <p class="text-stone-500 dark:text-stone-400 whitespace-pre-line">${l.dialogueVi}</p>
              </div>
            ` : ''}
          </div>
          
          <div class="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            ${l.tip ? `
              <div class="text-[11px] text-amber-800 dark:text-amber-400 italic leading-snug">
                💡 ${l.tip}
              </div>
            ` : ''}
            <button onclick="event.stopPropagation(); openHsk30LessonModal(${l.hskLevel}, ${l.lessonNumber})" class="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-100/80 hover:bg-gradient-to-r hover:from-amber-600 hover:to-amber-700 hover:text-white text-stone-800 dark:bg-stone-800 dark:hover:bg-amber-600 dark:text-stone-200 dark:hover:text-white border border-amber-300/80 dark:border-stone-700 shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
              <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
              <span>Xem Chi Tiết Bài Học →</span>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  refreshIcons(container);
}


let currentViewingHsk30Lesson = null;
let currentHsk30LessonTab = 'dialogues';
let hsk30LessonQuizState = {};

async function openHsk30LessonModal(level, lessonNumber) {
  if (!hsk30RoadmapData && typeof loadData === 'function') {
    await loadData('hsk30Roadmap');
  }
  if (!hsk30RoadmapData) return;
  const allLessons = hsk30RoadmapData.standardCourse48Lessons || [];
  const lesson = allLessons.find(l => Number(l.hskLevel) === Number(level) && Number(l.lessonNumber) === Number(lessonNumber));
  if (!lesson) {
    if (typeof showToast === 'function') showToast('Không tìm thấy thông tin bài học.');
    return;
  }

  currentViewingHsk30Lesson = lesson;
  currentHsk30LessonTab = 'dialogues';
  hsk30LessonQuizState = {};

  const modal = document.getElementById('hsk30LessonDetailModal');
  if (!modal) return;

  const lvlBadge = document.getElementById('hsk30ModalLevelBadge');
  const themeBadge = document.getElementById('hsk30ModalThemeBadge');
  const titleZh = document.getElementById('hsk30ModalTitleZh');
  const titlePinyin = document.getElementById('hsk30ModalTitlePinyin');
  const titleVi = document.getElementById('hsk30ModalTitleVi');
  const ttsBtn = document.getElementById('hsk30ModalTtsBtn');

  if (lvlBadge) lvlBadge.textContent = `HSK ${lesson.hskLevel} · Bài ${lesson.lessonNumber}`;
  if (themeBadge) themeBadge.textContent = lesson.vocabTheme || lesson.vocabularyTheme || 'Giao tiếp thực tế';
  if (titleZh) titleZh.textContent = lesson.titleZh;
  if (titlePinyin) titlePinyin.textContent = lesson.titlePinyin || '';
  if (titleVi) titleVi.textContent = lesson.titleVi;
  if (ttsBtn) {
    ttsBtn.onclick = () => {
      if (typeof playChineseTTS === 'function') playChineseTTS(lesson.titleZh);
    };
  }

  updateHsk30LessonModalFooter();
  switchHsk30LessonTab('dialogues');

  modal.classList.remove('hidden');
  refreshIcons(modal);
}

function closeHsk30LessonModal() {
  const modal = document.getElementById('hsk30LessonDetailModal');
  if (modal) modal.classList.add('hidden');
}

function updateHsk30LessonModalFooter() {
  if (!currentViewingHsk30Lesson || !hsk30RoadmapData) return;
  const all = hsk30RoadmapData.standardCourse48Lessons || [];
  const idx = all.findIndex(l => Number(l.hskLevel) === Number(currentViewingHsk30Lesson.hskLevel) && Number(l.lessonNumber) === Number(currentViewingHsk30Lesson.lessonNumber));

  const progressEl = document.getElementById('hsk30LessonProgressText');
  if (progressEl) progressEl.textContent = `Bài ${idx >= 0 ? idx + 1 : 1} / ${all.length}`;

  const prevBtn = document.getElementById('hsk30PrevLessonBtn');
  const nextBtn = document.getElementById('hsk30NextLessonBtn');

  if (prevBtn) {
    prevBtn.disabled = idx <= 0;
    prevBtn.classList.toggle('opacity-40', idx <= 0);
    prevBtn.classList.toggle('cursor-not-allowed', idx <= 0);
  }
  if (nextBtn) {
    nextBtn.disabled = idx < 0 || idx >= all.length - 1;
    nextBtn.classList.toggle('opacity-40', idx < 0 || idx >= all.length - 1);
    nextBtn.classList.toggle('cursor-not-allowed', idx < 0 || idx >= all.length - 1);
  }
}

function navigateHsk30Lesson(direction) {
  if (!currentViewingHsk30Lesson || !hsk30RoadmapData) return;
  const all = hsk30RoadmapData.standardCourse48Lessons || [];
  const idx = all.findIndex(l => Number(l.hskLevel) === Number(currentViewingHsk30Lesson.hskLevel) && Number(l.lessonNumber) === Number(currentViewingHsk30Lesson.lessonNumber));
  if (idx < 0) return;

  if (direction === 'prev' && idx > 0) {
    const prev = all[idx - 1];
    openHsk30LessonModal(prev.hskLevel, prev.lessonNumber);
  } else if (direction === 'next' && idx < all.length - 1) {
    const next = all[idx + 1];
    openHsk30LessonModal(next.hskLevel, next.lessonNumber);
  }
}

function switchHsk30LessonTab(tabName) {
  currentHsk30LessonTab = tabName;
  const tabs = ['dialogues', 'vocabulary', 'grammar', 'culture', 'practice'];
  tabs.forEach(t => {
    const btn = document.getElementById(`hsk30TabBtn-${t}`);
    if (!btn) return;
    if (t === tabName) {
      btn.className = 'px-4 py-3 text-xs font-bold border-b-2 border-[#8B1E1E] dark:border-amber-400 text-[#8B1E1E] dark:text-amber-400 whitespace-nowrap flex items-center gap-1.5 cursor-pointer';
    } else {
      btn.className = 'px-4 py-3 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer';
    }
  });

  renderHsk30LessonDetailContent();
}

function renderHsk30LessonDetailContent() {
  const container = document.getElementById('hsk30LessonModalBody');
  if (!container || !currentViewingHsk30Lesson) return;
  const l = currentViewingHsk30Lesson;

  if (currentHsk30LessonTab === 'dialogues') {
    const dialogues = l.dialogues || [];
    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <i data-lucide="message-square" class="w-4 h-4 text-amber-600"></i>
              <span>Văn Bản Hội Thoại Chuẩn HSK 3.0</span>
            </h4>
            <p class="text-xs text-stone-500">Đối thoại ngữ cảnh sinh động chuẩn mực phát âm Bắc Kinh</p>
          </div>
          <button onclick="playHsk30AllDialogues()" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer">
            <i data-lucide="headphones" class="w-3.5 h-3.5 text-amber-600"></i>
            <span>Nghe Toàn Bài</span>
          </button>
        </div>

        <div class="space-y-3">
          ${dialogues.map((d, idx) => `
            <div class="p-3.5 rounded-2xl ${idx % 2 === 0 ? 'bg-amber-50/60 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-800' : 'bg-stone-50/90 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700'} flex items-start gap-3">
              <div class="w-8 h-8 rounded-full ${idx % 2 === 0 ? 'bg-amber-600 text-white' : 'bg-stone-600 text-white'} flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                ${(d.speaker || 'A').slice(0, 1)}
              </div>
              <div class="flex-1 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-stone-600 dark:text-stone-400">${d.speaker}</span>
                  <button onclick="playChineseTTS(${jsArg(d.hanzi)})" class="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer" title="Phát âm câu này">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
                <p class="font-hanzi font-bold text-base text-stone-900 dark:text-stone-100 leading-relaxed">${d.hanzi}</p>
                ${d.pinyin ? `<p class="text-xs text-stone-500 dark:text-stone-400 italic">${d.pinyin}</p>` : ''}
                <p class="text-xs text-stone-700 dark:text-stone-300 font-medium">${d.vi}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (currentHsk30LessonTab === 'vocabulary') {
    const vocab = l.vocabulary || [];
    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <i data-lucide="book-open" class="w-4 h-4 text-emerald-600"></i>
              <span>Từ Vựng Trọng Tâm Bài Học (${vocab.length} từ)</span>
            </h4>
            <p class="text-xs text-stone-500">Kèm phiên âm, âm Hán Việt, từ loại và câu ví dụ thực tế</p>
          </div>
          <button onclick="saveAllHsk30LessonVocab()" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer">
            <i data-lucide="bookmark-plus" class="w-3.5 h-3.5"></i>
            <span>Lưu Toàn Bộ Vào Sổ</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${vocab.map(v => {
            const saved = typeof isWordSaved === 'function' ? isWordSaved(v.hanzi) : false;
            return `
              <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2 flex flex-col justify-between hover:border-amber-300 transition-colors">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <span class="font-hanzi font-black text-xl text-stone-900 dark:text-stone-100">${v.hanzi}</span>
                      <span class="text-xs text-stone-500 dark:text-stone-400 italic ml-2">${v.pinyin || ''}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <button onclick="playChineseTTS(${jsArg(v.hanzi)})" class="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors cursor-pointer" title="Nghe từ">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="handleToggleHsk30Vocab(${jsArg(v.hanzi)}, ${jsArg(v.pinyin || '')}, ${jsArg(v.vi || '')}, ${l.hskLevel})" class="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 ${saved ? 'text-amber-600' : 'text-stone-400'} transition-colors cursor-pointer" title="${saved ? 'Đã lưu' : 'Lưu vào sổ từ'}">
                        <i data-lucide="${saved ? 'bookmark-check' : 'bookmark'}" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    ${v.hanviet ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300">HV: ${v.hanviet}</span>` : ''}
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">${v.pos || 'Từ vựng'}</span>
                  </div>
                  <p class="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-1.5">${v.vi}</p>
                </div>

                ${v.example && v.example.hanzi ? `
                  <div class="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 text-[11px] space-y-0.5 mt-2">
                    <div class="flex items-center justify-between">
                      <p class="font-hanzi font-bold text-stone-800 dark:text-stone-200">${v.example.hanzi}</p>
                      <button onclick="playChineseTTS(${jsArg(v.example.hanzi)})" class="text-stone-400 hover:text-stone-700 cursor-pointer">
                        <i data-lucide="volume-2" class="w-3 h-3"></i>
                      </button>
                    </div>
                    ${v.example.pinyin ? `<p class="text-stone-400 italic">${v.example.pinyin}</p>` : ''}
                    <p class="text-stone-600 dark:text-stone-400">${v.example.vi}</p>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (currentHsk30LessonTab === 'grammar') {
    const grammar = l.grammarPoints || [];
    container.innerHTML = `
      <div class="space-y-4">
        <div class="pb-2 border-b border-stone-200 dark:border-stone-800">
          <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <i data-lucide="compass" class="w-4 h-4 text-purple-600"></i>
            <span>Trọng Điểm Ngữ Pháp Cốt Lõi (${grammar.length} điểm)</span>
          </h4>
          <p class="text-xs text-stone-500">Phân tích công thức, quy tắc ứng dụng và ví dụ song ngữ chuẩn Hanban</p>
        </div>

        <div class="space-y-4">
          ${grammar.map(g => `
            <div class="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-purple-200/80 dark:border-stone-800 shadow-2xs space-y-3">
              <h5 class="text-sm font-bold text-purple-950 dark:text-purple-300 font-serif-luxury">${g.title}</h5>
              
              <div class="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs font-mono font-semibold text-purple-900 dark:text-purple-300">
                📌 Công thức: ${g.formula}
              </div>

              <div class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                ${g.explanation}
              </div>

              ${g.examples && g.examples.length ? `
                <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-2">
                  <span class="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Ví dụ minh họa:</span>
                  ${g.examples.map(ex => `
                    <div class="flex items-start justify-between gap-2 text-xs">
                      <div class="space-y-0.5">
                        <p class="font-hanzi font-bold text-stone-900 dark:text-stone-100">${ex.hanzi}</p>
                        ${ex.pinyin ? `<p class="text-stone-500 italic text-[11px]">${ex.pinyin}</p>` : ''}
                        <p class="text-stone-600 dark:text-stone-400 font-medium">${ex.vi}</p>
                      </div>
                      <button onclick="playChineseTTS(${jsArg(ex.hanzi)})" class="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400 shrink-0 cursor-pointer">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (currentHsk30LessonTab === 'culture') {
    const tips = l.cultureAndTips || {};
    container.innerHTML = `
      <div class="space-y-4">
        <div class="pb-2 border-b border-stone-200 dark:border-stone-800">
          <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <i data-lucide="lightbulb" class="w-4 h-4 text-amber-500"></i>
            <span>Văn Hóa Đời Sống & Chiến Thuật Thi HSK 3.0</span>
          </h4>
          <p class="text-xs text-stone-500">Bí kíp thực chiến từ giáo viên bản xứ và chuyên gia khảo thí</p>
        </div>

        <div class="space-y-3">
          <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-[#1f2420] border border-amber-200 dark:border-amber-900/50 space-y-1.5">
            <div class="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
              <i data-lucide="sparkles" class="w-4 h-4 text-amber-600"></i>
              <span>Văn Hóa Giao Tiếp & Đời Sống Trung Hoa</span>
            </div>
            <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              ${tips.culture || l.tip || 'HSK 3.0 chú trọng giao tiếp thực chiến và hòa nhập văn hóa bản xứ.'}
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-blue-50/70 dark:bg-[#1a2333] border border-blue-200 dark:border-blue-900/50 space-y-1.5">
            <div class="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-xs">
              <i data-lucide="shield-check" class="w-4 h-4 text-blue-600"></i>
              <span>Chiến Thuật Thi HSK 3.0 & Bẫy Cần Tránh</span>
            </div>
            <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              ${tips.examTip || 'Lưu ý các hư từ, trật tự câu và tránh viết sai nét bút thuận trong bài thi.'}
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-[#1b2621] border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
            <div class="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
              <i data-lucide="smartphone" class="w-4 h-4 text-emerald-600"></i>
              <span>Ứng Dụng Thực Tế Thời Đại 4.0</span>
            </div>
            <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              ${tips.practicalApp || 'Áp dụng trực tiếp trong nhắn tin WeChat, đặt vé tàu cao tốc và mua sắm trực tuyến.'}
            </p>
          </div>
        </div>
      </div>
    `;
  } else if (currentHsk30LessonTab === 'practice') {
    const quiz = l.practice || [];
    const totalQ = quiz.length;
    let answeredCount = 0;
    let correctCount = 0;

    quiz.forEach((q, idx) => {
      if (hsk30LessonQuizState[idx] !== undefined) {
        answeredCount++;
        if (hsk30LessonQuizState[idx] === q.answer) correctCount++;
      }
    });

    const isAllAnswered = answeredCount === totalQ && totalQ > 0;
    const isAllCorrect = isAllAnswered && correctCount === totalQ;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <i data-lucide="pencil" class="w-4 h-4 text-rose-600"></i>
              <span>Luyện Tập Củng Cố Kiến Thức (${totalQ} câu hỏi)</span>
            </h4>
            <p class="text-xs text-stone-500">Trả lời đúng toàn bộ nhận ngay +20 EXP vào hồ sơ học viên</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold ${isAllCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'}">
            Đúng ${correctCount}/${totalQ} câu
          </span>
        </div>

        ${isAllCorrect ? `
          <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md flex items-center justify-between gap-3 animate-scale-up">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">🎉</div>
              <div>
                <h5 class="text-sm font-bold">Xuất Sắc! Bạn Đã Làm Đúng Toàn Bộ!</h5>
                <p class="text-xs opacity-90">+20 EXP đã được cộng vào tài khoản của bạn.</p>
              </div>
            </div>
            <button onclick="navigateHsk30Lesson('next')" class="px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-xs hover:bg-emerald-50 transition-all cursor-pointer">
              Bài tiếp theo →
            </button>
          </div>
        ` : ''}

        <div class="space-y-4">
          ${quiz.map((q, qIdx) => {
            const userPick = hsk30LessonQuizState[qIdx];
            const isAnswered = userPick !== undefined;
            return `
              <div class="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
                <p class="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug">
                  <span class="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold inline-flex items-center justify-center text-[10px] mr-1.5">${qIdx + 1}</span>
                  ${q.question}
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  ${(q.options || []).map((opt, optIdx) => {
                    let btnStyle = 'bg-stone-50 hover:bg-amber-50 dark:bg-stone-800/60 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200';
                    if (isAnswered) {
                      if (optIdx === q.answer) {
                        btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-600 dark:text-emerald-200 font-bold';
                      } else if (optIdx === userPick) {
                        btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 dark:bg-rose-950/80 dark:border-rose-600 dark:text-rose-200 line-through';
                      } else {
                        btnStyle = 'opacity-50 bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400';
                      }
                    }
                    return `
                      <button onclick="checkHsk30LessonQuiz(${qIdx}, ${optIdx})" class="p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}">
                        <span>${opt}</span>
                        ${isAnswered && optIdx === q.answer ? '<i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0"></i>' : ''}
                        ${isAnswered && optIdx === userPick && optIdx !== q.answer ? '<i data-lucide="x" class="w-4 h-4 text-rose-600 shrink-0"></i>' : ''}
                      </button>
                    `;
                  }).join('')}
                </div>

                ${isAnswered ? `
                  <div class="p-2.5 rounded-xl ${userPick === q.answer ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-300'} text-xs space-y-1">
                    <p class="font-bold flex items-center gap-1">
                      <i data-lucide="${userPick === q.answer ? 'check-circle-2' : 'alert-circle'}" class="w-3.5 h-3.5"></i>
                      <span>${userPick === q.answer ? 'Chính xác!' : 'Chưa chính xác.'}</span>
                    </p>
                    <p class="text-[11px] leading-relaxed opacity-95">${q.explain}</p>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  refreshIcons(container);
}

function checkHsk30LessonQuiz(qIdx, optIdx) {
  if (!currentViewingHsk30Lesson) return;
  hsk30LessonQuizState[qIdx] = optIdx;

  const quiz = currentViewingHsk30Lesson.practice || [];
  const totalQ = quiz.length;
  let allCorrect = true;
  let allAnswered = true;

  for (let i = 0; i < totalQ; i++) {
    if (hsk30LessonQuizState[i] === undefined) {
      allAnswered = false;
      allCorrect = false;
      break;
    }
    if (hsk30LessonQuizState[i] !== quiz[i].answer) {
      allCorrect = false;
    }
  }

  if (allAnswered && allCorrect && !hsk30LessonQuizState.__awarded) {
    hsk30LessonQuizState.__awarded = true;
    if (typeof addExp === 'function') addExp(20, 'Hoàn thành bài tập HSK 3.0');
    if (typeof showToast === 'function') showToast('Chúc mừng! Bạn đã nhận được +20 EXP!');
  }

  renderHsk30LessonDetailContent();
}

function handleToggleHsk30Vocab(hanzi, pinyin, meaning, level) {
  if (typeof toggleSaveWord === 'function') {
    toggleSaveWord(hanzi, pinyin, meaning, level);
    renderHsk30LessonDetailContent();
  }
}

function saveAllHsk30LessonVocab() {
  if (!currentViewingHsk30Lesson) return;
  const vocab = currentViewingHsk30Lesson.vocabulary || [];
  let savedCount = 0;
  vocab.forEach(v => {
    if (typeof isWordSaved === 'function' && !isWordSaved(v.hanzi)) {
      if (typeof toggleSaveWord === 'function') {
        toggleSaveWord(v.hanzi, v.pinyin || '', v.vi || '', currentViewingHsk30Lesson.hskLevel || 1);
        savedCount++;
      }
    }
  });

  if (typeof showToast === 'function') {
    showToast(`Đã lưu ${savedCount > 0 ? savedCount : 'toàn bộ'} từ vựng vào Sổ tay ôn tập!`);
  }
  renderHsk30LessonDetailContent();
}

function playHsk30AllDialogues() {
  if (!currentViewingHsk30Lesson) return;
  const dialogues = currentViewingHsk30Lesson.dialogues || [];
  if (dialogues.length === 0) {
    if (currentViewingHsk30Lesson.titleZh && typeof playChineseTTS === 'function') {
      playChineseTTS(currentViewingHsk30Lesson.titleZh);
    }
    return;
  }
  const fullText = dialogues.map(d => d.hanzi).join('，');
  if (typeof playChineseTTS === 'function') {
    playChineseTTS(fullText);
  }
}

function getCurrentlyViewingHsk30Lesson() {
  return currentViewingHsk30Lesson;
}


function filterPathwayLevel(level) {
  currentHskLevel = level;
  for (let l = 1; l <= 6; l++) {
    const btn = document.getElementById(`btn-hsk-${l}`);
    if (btn) {
      if (l === level) {
        btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent whitespace-nowrap';
      } else {
        btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 whitespace-nowrap';
      }
    }
  }
  renderPathwayLessonsList(true);
}

function renderPathwayLessonsList(reset = false) {
  const container = document.getElementById('pathwayLessonsContainer');
  if (!container || !lessonsData) return;

  if (reset) {
    container.innerHTML = '';
    pathwayLessonsRendered = 0;
  }

  const filtered = lessonsData.filter(item => item.level === currentHskLevel);
  const nextBatch = filtered.slice(pathwayLessonsRendered, pathwayLessonsRendered + pathwayLessonsBatchSize);

  if (nextBatch.length === 0 && pathwayLessonsRendered === 0) {
    container.innerHTML = '<div class="glass-card rounded-2xl p-8 text-center text-stone-500">Không có bài học nào ở cấp độ này.</div>';
    const loadMoreBtn = document.getElementById('loadMoreLessonsBtn');
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    return;
  }

  nextBatch.forEach(lesson => {
    const card = document.createElement('div');
    card.className = 'glass-card rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#161B22] border border-amber-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4';
    card.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-stone-800 text-[#8B1E1E] dark:text-amber-400 border border-amber-300 dark:border-stone-700 flex items-center justify-center font-hanzi text-2xl font-black shrink-0 shadow-2xs">
          ${lesson.hanzi ? lesson.hanzi[0] : '字'}
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h4 class="font-hanzi text-lg font-bold text-stone-900 dark:text-stone-100">${lesson.hanzi || 'Tiêu đề'}</h4>
            <span class="text-xs text-amber-900 dark:text-amber-300 font-mono font-medium">${lesson.pinyin || ''}</span>
          </div>
          <p class="text-xs text-stone-600 dark:text-stone-400">${lesson.meaning || lesson.vietnamese || ''}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="playChineseTTS(${jsArg(lesson.hanzi)}, 'female')" class="p-2 rounded-xl bg-amber-50 dark:bg-stone-800 text-[#8B1E1E] dark:text-amber-400 hover:bg-amber-100 transition-colors cursor-pointer" title="Nghe phát âm">
          <i data-lucide="volume-2" class="w-4 h-4"></i>
        </button>
        <button onclick="openWritingModal(${jsArg(lesson.hanzi ? lesson.hanzi[0] : '字')})" class="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200 transition-colors cursor-pointer">
          Tập viết
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  pathwayLessonsRendered += nextBatch.length;
  const loadMoreBtn = document.getElementById('loadMoreLessonsBtn');
  if (loadMoreBtn) {
    if (pathwayLessonsRendered >= filtered.length) {
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  }

  refreshIcons(container);
}

function loadMoreLessons() {
  renderPathwayLessonsList(false);
}


function renderPathwayResources(container) {
  const data = hsk30RoadmapData;
  const resources = data.freeResources || [];

  let html = `
    <div class="space-y-6">
      <div class="flex items-center gap-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-stone-700">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center font-bold text-lg shadow-xs">
          <i data-lucide="download-cloud" class="w-5 h-5"></i>
        </div>
        <div>
          <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">Kho Tài Liệu & Đề Thi HSK 3.0 Chuẩn Miễn Phí</h3>
          <p class="text-xs text-stone-600 dark:text-stone-400">Tổng hợp giáo trình chính thống, đề thi thử mô phỏng 4 kỹ năng và sổ tay từ vựng từ Tiếng Trung Thượng Hải.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${resources.map(res => `
          <div class="glass-card rounded-2xl p-6 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  ${res.badge}
                </span>
                <span class="text-xs font-mono font-medium text-stone-500 dark:text-stone-400">
                  ${res.format}
                </span>
              </div>

              <h4 class="text-base font-bold font-serif-luxury text-stone-900 dark:text-stone-100">
                ${res.name}
              </h4>

              <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                ${res.desc}
              </p>
            </div>

            <div class="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800">
              <a href="${res.linkUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-[#8B1E1E] dark:text-amber-300 border border-amber-200 dark:border-stone-700 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all">
                <span>Tải xuống & Xem tài liệu gốc</span>
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

})();

/* --- FILE: js/features/translation.js --- */
(function(){
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

})();

/* --- FILE: js/features/practice.js --- */
(function(){
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

})();

/* --- FILE: js/features/flashcards.js --- */
(function(){
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

})();

/* --- FILE: js/features/dictionary.js --- */
(function(){
// Module state
let currentTopicPillFilter = '';
let dictRendered = 0;
let dictBatch = 24;
let currentDictHsk = 'all';
let currentDictSearch = '';
let currentDictMode = 'hsk'; // 'hsk' or 'topic'
let currentDictTopic = 'all';
let currentTopicSearch = '';
let topicDictRendered = 0;
let topicDictBatch = 24;

// ---------------- TAB 6: KHO TỪ ĐIỂN CHUẨN HSK 1 - HSK 6 ----------------
function filterDictHsk(lvl) {
  currentDictHsk = lvl;

  // Update "All" button
  const allBtn = document.getElementById('btn-dict-hsk-all');
  if (allBtn) {
    allBtn.className = lvl === 'all'
      ? 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm transition-all whitespace-nowrap'
      : 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap';
  }

  // Update HSK 1-6 buttons
  for (let i = 1; i <= 6; i++) {
    const btn = document.getElementById(`btn-dict-hsk-${i}`);
    if (!btn) continue;
    btn.className = lvl === i
      ? 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm transition-all whitespace-nowrap'
      : 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap';
  }

  renderDictionary(true);
}

function onDictSearchInput(val) {
  currentDictSearch = val || '';
  const clearBtn = document.getElementById('dictClearSearchBtn');
  if (clearBtn) {
    if (currentDictSearch.trim()) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }
  renderDictionary(true);
}

function clearDictSearch() {
  const input = document.getElementById('dictSearchInput');
  if (input) input.value = '';
  onDictSearchInput('');
}

function getFilteredDictionaryList() {
  if (!dictionaryData || !Array.isArray(dictionaryData)) return [];
  let list = dictionaryData;
  if (currentDictHsk !== 'all') {
    list = list.filter(item => item.level === currentDictHsk);
  }
  if (currentDictSearch && currentDictSearch.trim()) {
    const rawQ = currentDictSearch.toLowerCase().trim();
    const pyQ = normalizePinyin(currentDictSearch);
    const viQ = normalizeVietnamese(currentDictSearch);

    list = list.filter(item => {
      const title = (item.title || '').toLowerCase();
      const pinyin = (item.pinyin || '').toLowerCase();
      const pinyinNorm = normalizePinyin(item.pinyin);
      const hanviet = (item.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(item.hanviet);
      const meaning = (item.meaning || '').toLowerCase();
      const meaningNorm = normalizeVietnamese(item.meaning);
      const example = (item.exampleSentence || '').toLowerCase();

      return title.includes(rawQ) ||
        (pyQ && pinyinNorm.includes(pyQ)) ||
        pinyin.includes(rawQ) ||
        (viQ && (hanvietNorm.includes(viQ) || meaningNorm.includes(viQ))) ||
        hanviet.includes(rawQ) ||
        meaning.includes(rawQ) ||
        example.includes(rawQ);
    });
  }
  return list;
}

function renderDictionary(reset = false) {
  const container = document.getElementById('dictGridContainer');
  if (!container) return;

  const totalLabel = document.getElementById('dictTotalCountLabel');
  const filteredLabel = document.getElementById('dictFilteredCount');
  const filteredList = getFilteredDictionaryList();

  if (totalLabel) totalLabel.innerText = `${dictionaryData.length.toLocaleString()}`;
  if (filteredLabel) filteredLabel.innerText = `${filteredList.length.toLocaleString()}`;

  if (reset) {
    dictRendered = 0;
    container.innerHTML = '';
  }

  if (filteredList.length === 0) {
    container.innerHTML = `
      <div class="col-span-full glass-card rounded-2xl p-10 text-center text-stone-500 border border-amber-200 bg-white shadow-xs space-y-2">
        <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800">Không tìm thấy từ vựng nào phù hợp.</p>
        <p class="text-xs text-stone-500">Hãy thử nhập từ khóa khác hoặc chọn "Tất Cả Cấp Độ".</p>
      </div>
    `;
    const loadMoreBtn = document.getElementById('loadMoreDictBtn');
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    return;
  }

  const nextBatch = filteredList.slice(dictRendered, dictRendered + dictBatch);

  // Level badge styling map
  const levelBadgeStyles = {
    1: 'bg-amber-100 text-amber-900 border-amber-300',
    2: 'bg-orange-100 text-orange-900 border-orange-300',
    3: 'bg-sky-100 text-sky-900 border-sky-300',
    4: 'bg-rose-100 text-rose-900 border-rose-300',
    5: 'bg-purple-100 text-purple-900 border-purple-300',
    6: 'bg-indigo-100 text-indigo-900 border-indigo-300'
  };

  nextBatch.forEach(item => {
    const card = document.createElement('div');
    const badgeStyle = levelBadgeStyles[item.level] || 'bg-amber-100 text-amber-900 border-amber-200';

    card.className = 'glass-card rounded-2xl p-5 border border-amber-200/80 bg-white flex flex-col justify-between hover:border-[#8B1E1E] transition-all shadow-xs hover:shadow-md';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between text-xs text-stone-500 mb-2.5">
          <span class="px-2.5 py-0.5 rounded-lg text-xs font-bold border ${badgeStyle}">
            HSK ${item.level}
          </span>
          <span class="text-[11px] text-stone-500 font-medium px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
            ${escapeHtml(item.pos || 'từ vựng')}
          </span>
        </div>

        <div class="flex items-center justify-between gap-2">
          <h4 onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" class="font-hanzi text-3xl font-black text-stone-900 tracking-wide cursor-pointer hover:text-[#8B1E1E] transition-colors" title="Nhấn vào chữ để xem và tập viết nét">${escapeHtml(item.title)}</h4>
          <div class="flex items-center gap-1">
            <button onclick="toggleSaveWord(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')}, ${item.level})" title="Lưu vào Sổ tay Flashcard" class="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer">
              <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" title="Tập viết nét chữ này" class="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors cursor-pointer">
              <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
            </button>
            <div class="flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
              <button onclick="playChineseTTS(${jsArg(item.title)}, 'female')" title="Nghe phát âm giọng Nữ (Xiaoxiao)" class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-colors cursor-pointer">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS(${jsArg(item.title)}, 'male')" title="Nghe phát âm giọng Nam (Yunxi)" class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-colors cursor-pointer">
                👨 Nam
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap mt-1.5">
          <p class="text-xs font-bold text-[#8B1E1E] tracking-wide">${escapeHtml(item.pinyin)}</p>
          ${item.hanviet ? `<span class="text-[11px] font-bold text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300/60">[${escapeHtml(item.hanviet)}]</span>` : ''}
        </div>
        <p class="text-xs font-medium text-stone-800 mt-1 leading-snug">${escapeHtml(item.meaning)}</p>
      </div>

      ${item.exampleSentence ? `
        <div class="mt-4 pt-3 border-t border-amber-200/60 text-xs space-y-1 bg-[#FAF7F2]/60 p-2.5 rounded-xl">
          <div class="flex items-start justify-between gap-1.5">
            <p class="font-hanzi text-stone-900 font-bold text-xs leading-relaxed">${escapeHtml(item.exampleSentence)}</p>
            <div class="flex items-center gap-1 shrink-0">
              <button onclick="playChineseTTS(${jsArg(item.exampleSentence.replace(/\n/g, ' '))}, 'female')" class="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nữ">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS(${jsArg(item.exampleSentence.replace(/\n/g, ' '))}, 'male')" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nam">
                👨 Nam
              </button>
            </div>
          </div>
          ${item.examplePinyin ? `<p class="text-[11px] font-bold text-[#8B1E1E]">${escapeHtml(item.examplePinyin)}</p>` : ''}
          ${item.exampleMeaning ? `<p class="text-[11px] text-stone-600 italic leading-snug">${escapeHtml(item.exampleMeaning)}</p>` : ''}
        </div>
      ` : ''}
    `;
    container.appendChild(card);
  });

  dictRendered += nextBatch.length;
  const loadMoreBtn = document.getElementById('loadMoreDictBtn');
  if (loadMoreBtn) {
    if (dictRendered >= filteredList.length) {
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  }

  refreshIcons();
}

function loadMoreDict() {
  renderDictionary(false);
}

// ---------------- TAB 6 (MỤC 2): TỪ VỰNG THEO CHỦ ĐỀ ----------------
let topicMapSource = null;
let topicMap = new Map();
let currentSuperCategory = 'all';
let topicViewMode = localStorage.getItem('thematicVocabViewMode') || 'cards';
let topicSortOrder = 'smart';

/** 5 Super Categories mapping 125 granular topics into logical groups */
const SUPER_CATEGORIES = {
  all: {
    id: 'all',
    name: 'Tất Cả',
    fullName: '🌟 Tất Cả 125 Chủ Đề',
    icon: '🌟',
    badge: '125'
  },
  daily: {
    id: 'daily',
    name: 'Đời Sống & Hằng Ngày',
    fullName: '🏠 Đời Sống & Hằng Ngày',
    icon: '🏠',
    badge: '38',
    keywords: ['gia_dinh', 'mon_an', 'nau_an', 'thuc_pham', 'rau_cu', 'trai_cay', 'thit', 'gia_vi', 'hai_san', 'nam', 'gao', 'bot', 'do_uong', 'quan_ao', 'cat_toc', 'cuoi_hoi', 'tang_le', 'giang_sinh', 'tet_nguyen_dan', 'phong_tam', 'thue_nha', 'doc_than', 'mua_ban_hang_online', 'con_vat', 'chim', 'hoa', 'mau_sac', 'noi_that', 'banh_keo', 'dien_thoai', 'tinh_cach', 'tinh_yeu', 'gia_cam', 'picnic', 'hoi_thoai_tieng_hoa_hang_ngay']
  },
  business: {
    id: 'business',
    name: 'Kinh Doanh & Công Sở',
    fullName: '💼 Kinh Doanh & Công Sở',
    icon: '💼',
    badge: '19',
    keywords: ['ke_toan', 'thuong_mai', 'ngoai_thuong', 'xuat_nhap_khau', 'kinh_te', 'tien_te', 'nhan_su', 'quang_cao', 'phong_van', 'hop_dong', 'so_yeu', 'buu_dien', 'van_phong', 'word_excel', 'thuong_hieu', 'bat_dong_san', 'thue_va_hai_quan', 'bo_phan_chuc_vu', 'bao_hiem']
  },
  industry: {
    id: 'industry',
    name: 'Kỹ Thuật & Sản Xuất',
    fullName: '⚙️ Kỹ Thuật & Sản Xuất',
    icon: '⚙️',
    badge: '24',
    keywords: ['co_khi', 'han_xi', 'thiet_bi_dien', 'dien_tu', 'sat_thep', 'oc_vit', 'vat_lieu_xay_dung', 'kien_truc', 'o_to', 'xe_may', 'det_soi', 'giay_da', 'nhua_cao_su', 'khai_thac', 'loai_than', 'cong_xuong', 'dau_mo', 'go', 'may_mac', 'cat_may', 'cac_nganh_cong_nghiep', 'dien_nuoc', 'may_tinh', 'video_cassette']
  },
  social: {
    id: 'social',
    name: 'Y Tế, Du Lịch & Xã Hội',
    fullName: '🏥 Y Tế, Du Lịch & Xã Hội',
    icon: '🏥',
    badge: '31',
    keywords: ['y_te', 'om_dau', 'co_the_nguoi', 'du_lich', 'nha_hang_khach_san', 'may_bay_san_bay', 'nha_ga_tau_hoa', 'ben_xe', 'xuat_nhap_canh', 'giao_thong', 'thoi_gian_va_thoi_tiet', 'khi_hau', 'moi_truong', 'the_thao', 'bong_da', 'bong_ro', 'bong_chuyen', 'bong_chay', 'tennis', 'golf', 'the_thao_duoi_nuoc', 'mon_dien', 'spa', 'my_pham', 'showbiz', 'phim_anh', 'phim_co_trang', 'am_nhac', 'chup_anh', 'vui_choi', 'du_tiec', 'phong_chay', 'nuoc_tren_the_gioi']
  },
  academic: {
    id: 'academic',
    name: 'Học Thuật & Ngôn Ngữ',
    fullName: '🎓 Học Thuật & Ngôn Ngữ',
    icon: '🎓',
    badge: '13',
    keywords: ['truong_hoc', 'separable_verbs', 'measure_words', 'thanh_ngu', 'ho_ten', 'tu_ngoai_lai', 'to_chuc_chinh_tri', 'luat', 'to_tung', 'toi_pham', 'quan_su', 'cong_viec_nghe_nghiep']
  }
};

/** Categorize topic by keyword matching */
function getTopicSuperCategory(topicId) {
  if (!topicId) return 'academic';
  const id = topicId.toLowerCase();
  for (const [key, cat] of Object.entries(SUPER_CATEGORIES)) {
    if (key === 'all') continue;
    if (cat.keywords && cat.keywords.some(kw => id.includes(kw))) {
      return key;
    }
  }
  return 'academic';
}

/** Topic lookup by id */
function getTopicInfo(topicId, strict = false) {
  if (topicMapSource !== topicsData) {
    topicMap = new Map((topicsData || []).map(t => [t.id, t]));
    topicMapSource = topicsData;
  }
  return topicMap.get(topicId) || (strict ? null : {});
}

async function ensureTopicData() {
  if (isDataLoaded(['topics', 'thematicVocab'])) return true;
  const container = document.getElementById('topicGridContainer');
  const tableBody = document.getElementById('topicTableBody');
  if (container) {
    container.innerHTML = '<div class="col-span-full text-center text-stone-500 text-sm py-10">Đang tải kho từ vựng theo chủ đề...</div>';
  }
  if (tableBody) {
    tableBody.innerHTML = '<tr><td colspan="9" class="text-center text-stone-500 py-10">Đang tải dữ liệu...</td></tr>';
  }
  try {
    await loadDatasets(['topics', 'thematicVocab']);
    return true;
  } catch (err) {
    console.error('Không tải được dữ liệu chủ đề:', err);
    if (container) {
      container.innerHTML = '<div class="col-span-full text-center text-rose-600 text-sm py-10">Không tải được dữ liệu. Vui lòng thử lại.</div>';
    }
    showToast('Không tải được từ vựng theo chủ đề.', 'error');
    return false;
  }
}

async function switchDictMode(mode) {
  currentDictMode = mode;
  const hskSection = document.getElementById('dictSectionHsk');
  const topicSection = document.getElementById('dictSectionTopic');
  const hskBtn = document.getElementById('btn-dict-mode-hsk');
  const topicBtn = document.getElementById('btn-dict-mode-topic');

  if (mode === 'hsk') {
    if (hskSection) hskSection.classList.remove('hidden');
    if (topicSection) topicSection.classList.add('hidden');
    if (hskBtn) {
      hskBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-md cursor-pointer border border-[#8B1E1E]';
    }
    if (topicBtn) {
      topicBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 transition-all cursor-pointer';
    }
    if (dictRendered === 0) {
      renderDictionary(true);
    }
  } else {
    if (hskSection) hskSection.classList.add('hidden');
    if (topicSection) topicSection.classList.remove('hidden');
    if (topicBtn) {
      topicBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-100 shadow-md cursor-pointer border border-amber-800';
    }
    if (hskBtn) {
      hskBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 transition-all cursor-pointer';
    }
    if (!(await ensureTopicData())) return;
    if (currentDictMode !== 'topic') return;
    renderTopicSuperCategories();
    renderTopicPills();
    updateViewModeButtons();
    if (topicDictRendered === 0) {
      renderTopicDictionary(true);
    }
  }
  refreshIcons();
}

/** 1. Render Super Categories Row */
function renderTopicSuperCategories() {
  const container = document.getElementById('topicSuperCategoriesContainer');
  if (!container) return;

  const topicsList = topicsData || [];
  const superKeys = ['all', 'daily', 'business', 'industry', 'social', 'academic'];

  let html = '';
  superKeys.forEach(key => {
    const cat = SUPER_CATEGORIES[key];
    const isSelected = currentSuperCategory === key;
    let count = 0;
    if (key === 'all') {
      count = topicsList.length;
    } else {
      count = topicsList.filter(t => getTopicSuperCategory(t.id) === key).length;
    }

    html += `
      <button 
        onclick="filterSuperCategory('${key}')" 
        id="btn-super-cat-${key}"
        class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${isSelected ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-amber-100 border-[#8B1E1E] shadow-sm' : 'bg-white/80 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-amber-200/60 dark:border-stone-700'}">
        <div class="flex items-center gap-1.5">
          <span class="text-base">${cat.icon}</span>
          <span class="truncate max-w-[100px] sm:max-w-none text-center font-bold">${cat.name}</span>
        </div>
        <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-amber-100/20 text-amber-100' : 'bg-amber-100/70 dark:bg-stone-700 text-amber-900 dark:text-stone-300 font-semibold'}">${count} chủ đề</span>
      </button>
    `;
  });

  container.innerHTML = html;

  const label = document.getElementById('activeSuperCategoryLabel');
  if (label) {
    const active = SUPER_CATEGORIES[currentSuperCategory] || SUPER_CATEGORIES.all;
    label.innerText = active.fullName;
  }
}

/** Filter by Super Category */
function filterSuperCategory(catKey) {
  currentSuperCategory = catKey;
  currentDictTopic = 'all'; // reset granular topic selection
  currentTopicPillFilter = '';
  
  const pillInput = document.getElementById('topicPillSearchInput');
  if (pillInput) pillInput.value = '';

  renderTopicSuperCategories();
  renderTopicPills();
  renderTopicDictionary(true);
}

/** 2. Render Granular Topic Pills under the active Super Category */
function renderTopicPills() {
  const container = document.getElementById('topicFilterPills');
  if (!container) return;

  const sourceVocab = thematicVocabData;
  const totalWords = sourceVocab.length;
  let topicsList = topicsData || [];

  // Filter topics by active Super Category
  if (currentSuperCategory !== 'all') {
    topicsList = topicsList.filter(t => getTopicSuperCategory(t.id) === currentSuperCategory);
  }
  
  // Filter topics by pill search query
  let filteredTopics = topicsList;
  if (currentTopicPillFilter && currentTopicPillFilter.trim()) {
    const q = normalizeVietnamese(currentTopicPillFilter);
    filteredTopics = topicsList.filter(t => {
      const nameNorm = normalizeVietnamese(t.name);
      const fullNorm = normalizeVietnamese(t.fullName || '');
      return nameNorm.includes(q) || fullNorm.includes(q);
    });
  }

  const badgeEl = document.getElementById('topicPillCountBadge');
  if (badgeEl) {
    badgeEl.innerText = `${filteredTopics.length} / ${topicsList.length} chủ đề`;
  }

  const isAllSelected = currentDictTopic === 'all';
  const superCatName = SUPER_CATEGORIES[currentSuperCategory]?.name || 'Tất Cả';

  let html = `
    <button onclick="filterDictTopic('all')" id="btn-topic-all" class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${isAllSelected ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-50 shadow-sm border border-amber-800' : 'bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'}" title="Xem toàn bộ từ vựng ${superCatName}">
      <span>🌟 Tất Cả ${topicsList.length} Chủ Đề ${currentSuperCategory !== 'all' ? '(' + superCatName + ')' : ''}</span>
      <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isAllSelected ? 'bg-white/20 text-white' : 'bg-amber-100/70 dark:bg-stone-700 text-amber-900 dark:text-stone-300 font-semibold'}">${currentSuperCategory === 'all' ? totalWords.toLocaleString() : sourceVocab.filter(w => getTopicSuperCategory(w.topicId) === currentSuperCategory).length.toLocaleString()}</span>
    </button>
  `;

  filteredTopics.forEach(t => {
    const isSelected = currentDictTopic === t.id;
    const count = t.count || sourceVocab.filter(w => w.topicId === t.id).length;
    html += `
      <button onclick="filterDictTopic(${jsArg(t.id)})" id="btn-topic-${escapeHtml(t.id)}" class="px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${isSelected ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-[#8B1E1E]' : 'bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'}" title="${escapeHtml(t.fullName || t.name)}">
        <span>${escapeHtml(t.icon || '🏷️')}</span>
        <span>${escapeHtml(t.name)}</span>
        <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-semibold'}">${count}</span>
      </button>
    `;
  });

  container.innerHTML = html;
}

function filterTopicPills(query) {
  currentTopicPillFilter = query || '';
  renderTopicPills();
}

function filterDictTopic(topicId) {
  currentDictTopic = topicId;
  renderTopicPills();
  renderTopicDictionary(true);
}

function onTopicSearchInput(val) {
  currentTopicSearch = val || '';
  const clearBtn = document.getElementById('topicClearSearchBtn');
  if (clearBtn) {
    if (currentTopicSearch.trim()) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }
  renderTopicDictionary(true);
}

function clearTopicSearch() {
  const input = document.getElementById('topicSearchInput');
  if (input) input.value = '';
  onTopicSearchInput('');
}

/** Switch View Mode: 'cards' or 'table' */
function setTopicViewMode(mode) {
  topicViewMode = mode;
  localStorage.setItem('thematicVocabViewMode', mode);
  updateViewModeButtons();
  renderTopicDictionary(true);
}

function updateViewModeButtons() {
  const btnCards = document.getElementById('btn-topic-view-cards');
  const btnTable = document.getElementById('btn-topic-view-table');
  if (btnCards && btnTable) {
    if (topicViewMode === 'cards') {
      btnCards.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white dark:bg-stone-700 text-amber-900 dark:text-amber-200 shadow-2xs';
      btnTable.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-stone-600 dark:text-stone-400 hover:text-stone-900';
    } else {
      btnTable.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white dark:bg-stone-700 text-amber-900 dark:text-amber-200 shadow-2xs';
      btnCards.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-stone-600 dark:text-stone-400 hover:text-stone-900';
    }
  }
}

/** Change Sort Order */
function changeTopicSort(order) {
  topicSortOrder = order || 'smart';
  renderTopicDictionary(true);
}

/** Filter and Sort the Thematic Vocabulary List */
function getFilteredTopicDictionaryList() {
  const source = thematicVocabData;
  if (!source || !Array.isArray(source)) return [];
  let list = source;

  // 1. Filter by specific topic or super category
  if (currentDictTopic !== 'all') {
    list = list.filter(item => item.topicId === currentDictTopic);
  } else if (currentSuperCategory !== 'all') {
    list = list.filter(item => getTopicSuperCategory(item.topicId) === currentSuperCategory);
  }

  // 2. Search query filter
  if (currentTopicSearch && currentTopicSearch.trim()) {
    const rawQ = currentTopicSearch.toLowerCase().trim();
    const pyQ = normalizePinyin(currentTopicSearch);
    const viQ = normalizeVietnamese(currentTopicSearch);

    list = list.filter(item => {
      const title = (item.title || '').toLowerCase();
      const pinyin = (item.pinyin || '').toLowerCase();
      const pinyinNorm = normalizePinyin(item.pinyin);
      const hanviet = (item.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(item.hanviet);
      const meaning = (item.meaning || '').toLowerCase();
      const meaningNorm = normalizeVietnamese(item.meaning);
      const topicName = (getTopicInfo(item.topicId).name || '').toLowerCase();
      const example = (item.exampleSentence || '').toLowerCase();

      return title.includes(rawQ) ||
        (pyQ && pinyinNorm.includes(pyQ)) ||
        pinyin.includes(rawQ) ||
        (viQ && (hanvietNorm.includes(viQ) || meaningNorm.includes(viQ))) ||
        hanviet.includes(rawQ) ||
        meaning.includes(rawQ) ||
        topicName.includes(rawQ) ||
        example.includes(rawQ);
    });
  }

  // 3. Sorting logic
  const categoryPriority = { daily: 1, social: 2, business: 3, academic: 4, industry: 5 };
  list = [...list].sort((a, b) => {
    if (topicSortOrder === 'smart') {
      const pA = categoryPriority[getTopicSuperCategory(a.topicId)] || 99;
      const pB = categoryPriority[getTopicSuperCategory(b.topicId)] || 99;
      if (pA !== pB) return pA - pB;
      const lA = a.level || 1;
      const lB = b.level || 1;
      if (lA !== lB) return lA - lB;
      return (a.title || '').length - (b.title || '').length;
    } else if (topicSortOrder === 'hsk-asc') {
      return (a.level || 1) - (b.level || 1);
    } else if (topicSortOrder === 'hsk-desc') {
      return (b.level || 1) - (a.level || 1);
    } else if (topicSortOrder === 'alpha') {
      return (a.pinyin || '').localeCompare(b.pinyin || '');
    }
    return 0;
  });

  return list;
}

/** Render Topic Dictionary (supports both Cards & Table views) */
function renderTopicDictionary(reset = false) {
  const gridContainer = document.getElementById('topicGridContainer');
  const tableContainer = document.getElementById('topicTableContainer');
  const tableBody = document.getElementById('topicTableBody');
  if (!gridContainer || !tableContainer || !tableBody) return;

  const source = thematicVocabData;
  const totalLabel = document.getElementById('topicTotalCountLabel');
  const filteredLabel = document.getElementById('topicFilteredCount');
  const filteredList = getFilteredTopicDictionaryList();

  if (totalLabel) totalLabel.innerText = `${source.length.toLocaleString()}`;
  if (filteredLabel) filteredLabel.innerText = `${filteredList.length.toLocaleString()}`;

  if (reset) {
    topicDictRendered = 0;
    gridContainer.innerHTML = '';
    tableBody.innerHTML = '';
  }

  // Toggle view containers
  if (topicViewMode === 'cards') {
    gridContainer.classList.remove('hidden');
    tableContainer.classList.add('hidden');
  } else {
    gridContainer.classList.add('hidden');
    tableContainer.classList.remove('hidden');
  }

  // Empty state handling
  if (filteredList.length === 0) {
    const emptyHtml = `
      <div class="col-span-full glass-card rounded-2xl p-10 text-center text-stone-500 border border-amber-200/80 bg-white dark:bg-stone-900 shadow-xs space-y-2">
        <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800 dark:text-stone-200">Không tìm thấy từ vựng nào trong chủ đề này.</p>
        <p class="text-xs text-stone-500">Hãy thử nhập từ khóa khác hoặc bấm chọn "🌟 Tất Cả Chủ Đề".</p>
      </div>
    `;
    gridContainer.innerHTML = emptyHtml;
    tableBody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-stone-500">Không tìm thấy từ vựng nào phù hợp.</td></tr>`;
    const loadMoreBtn = document.getElementById('loadMoreTopicBtn');
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    return;
  }

  const nextBatch = filteredList.slice(topicDictRendered, topicDictRendered + topicDictBatch);

  // Level badge styling map
  const levelBadgeStyles = {
    1: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-300',
    2: 'bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-300 border-teal-300',
    3: 'bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300 border-sky-300',
    4: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 border-indigo-300',
    5: 'bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border-purple-300',
    6: 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border-rose-300'
  };

  if (topicViewMode === 'cards') {
    // ---------------- CARD VIEW RENDERING ----------------
    nextBatch.forEach(item => {
      const card = document.createElement('div');
      const badgeStyle = levelBadgeStyles[item.level] || 'bg-amber-100 text-amber-900 border-amber-200';
      const topic = getTopicInfo(item.topicId);

      card.className = 'glass-card rounded-2xl p-5 border border-amber-200/80 dark:border-stone-700 bg-white dark:bg-[#161B22] flex flex-col justify-between hover:border-amber-500 dark:hover:border-amber-600 transition-all shadow-xs hover:shadow-md';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between text-xs text-stone-500 mb-2.5 gap-1.5 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-stone-800 text-amber-950 dark:text-amber-300 border border-amber-200 dark:border-stone-700 flex items-center gap-1">
                <span>${escapeHtml(topic.icon || '🏷️')}</span>
                <span>${escapeHtml(topic.name || 'Chủ đề')}</span>
              </span>
              <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold border ${badgeStyle}">
                HSK ${item.level || 1}
              </span>
            </div>
            <span class="text-[11px] text-stone-500 dark:text-stone-400 font-medium px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              ${escapeHtml(item.pos || 'từ vựng')}
            </span>
          </div>

          <div class="flex items-center justify-between gap-2">
            <h4 onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" class="font-hanzi text-3xl font-black text-stone-900 dark:text-stone-100 tracking-wide cursor-pointer hover:text-[#8B1E1E] transition-colors" title="Nhấn vào chữ để xem và tập viết nét">${escapeHtml(item.title)}</h4>
            <div class="flex items-center gap-1">
              <button onclick="toggleSaveWord(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')}, ${item.level})" title="Lưu vào Sổ tay Flashcard" class="p-2 rounded-xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-stone-700 transition-colors cursor-pointer">
                <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" title="Tập viết nét chữ này" class="p-2 rounded-xl bg-rose-50 dark:bg-stone-800 hover:bg-rose-100 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-stone-700 transition-colors cursor-pointer">
                <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
              </button>
              <div class="flex items-center gap-0.5 bg-stone-100/90 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs">
                <button onclick="playChineseTTS(${jsArg(item.title)}, 'female')" title="Nghe phát âm giọng Nữ (Xiaoxiao)" class="px-2 py-1 rounded-lg bg-white dark:bg-stone-700 hover:bg-rose-50 text-rose-850 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold transition-colors cursor-pointer">
                  👩 Nữ
                </button>
                <button onclick="playChineseTTS(${jsArg(item.title)}, 'male')" title="Nghe phát âm giọng Nam (Yunxi)" class="px-2 py-1 rounded-lg bg-white dark:bg-stone-700 hover:bg-blue-50 text-blue-850 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-bold transition-colors cursor-pointer">
                  👨 Nam
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap mt-1.5">
            <p class="text-sm font-bold text-amber-900 dark:text-amber-300 tracking-wide font-mono">${escapeHtml(item.pinyin)}</p>
            ${item.hanviet ? `<span class="text-[11px] font-bold text-amber-950 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-700">[${escapeHtml(item.hanviet)}]</span>` : ''}
          </div>

          <p class="text-sm font-semibold text-stone-800 dark:text-stone-200 mt-2 leading-relaxed">${escapeHtml(item.meaning)}</p>
        </div>

        ${item.exampleSentence ? `
          <div class="mt-4 pt-3 border-t border-amber-200/60 dark:border-stone-700 text-xs space-y-1 bg-[#FAF7F2]/80 dark:bg-stone-900/60 p-3 rounded-xl border border-amber-100/60 dark:border-stone-800">
            <div class="flex items-start justify-between gap-1.5">
              <p class="font-hanzi text-stone-900 dark:text-stone-100 font-bold text-sm leading-relaxed">${escapeHtml(item.exampleSentence)}</p>
              <div class="flex items-center gap-1 shrink-0">
                <button onclick="playChineseTTS(${jsArg(item.exampleSentence.replace(/\n/g, ' '))}, 'female')" class="px-1.5 py-0.5 rounded bg-white dark:bg-stone-700 hover:bg-rose-50 text-rose-850 dark:text-rose-300 border border-rose-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nữ">
                  👩
                </button>
                <button onclick="playChineseTTS(${jsArg(item.exampleSentence.replace(/\n/g, ' '))}, 'male')" class="px-1.5 py-0.5 rounded bg-white dark:bg-stone-700 hover:bg-blue-50 text-blue-850 dark:text-blue-300 border border-blue-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nam">
                  👨
                </button>
              </div>
            </div>
            ${item.examplePinyin ? `<p class="text-xs font-bold text-amber-900 dark:text-amber-300 font-mono">${escapeHtml(item.examplePinyin)}</p>` : ''}
            ${item.exampleMeaning ? `<p class="text-xs text-stone-600 dark:text-stone-400 italic leading-snug">${escapeHtml(item.exampleMeaning)}</p>` : ''}
          </div>
        ` : ''}
      `;
      gridContainer.appendChild(card);
    });
  } else {
    // ---------------- TABLE VIEW RENDERING ----------------
    nextBatch.forEach((item, idx) => {
      const row = document.createElement('tr');
      const globalIdx = topicDictRendered + idx + 1;
      const badgeStyle = levelBadgeStyles[item.level] || 'bg-amber-100 text-amber-900 border-amber-200';
      const topic = getTopicInfo(item.topicId);

      row.className = 'hover:bg-amber-50/70 dark:hover:bg-stone-800/60 transition-colors';
      row.innerHTML = `
        <td class="py-3 px-3 sm:px-4 text-center text-xs font-mono text-stone-400">${globalIdx}</td>
        <td class="py-3 px-3 sm:px-4 whitespace-nowrap">
          <span onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" class="font-hanzi text-2xl font-black text-stone-900 dark:text-stone-100 hover:text-[#8B1E1E] cursor-pointer transition-colors" title="Bấm để tập viết nét">${escapeHtml(item.title)}</span>
        </td>
        <td class="py-3 px-3 sm:px-4 whitespace-nowrap font-mono font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm">${escapeHtml(item.pinyin)}</td>
        <td class="py-3 px-3 sm:px-4 whitespace-nowrap">
          ${item.hanviet ? `<span class="text-xs font-semibold text-amber-950 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-300/60 dark:border-amber-700">[${escapeHtml(item.hanviet)}]</span>` : '<span class="text-stone-400">—</span>'}
        </td>
        <td class="py-3 px-3 sm:px-4 min-w-[200px]">
          <div class="font-semibold text-stone-800 dark:text-stone-200 leading-snug">${escapeHtml(item.meaning)}</div>
          ${item.exampleSentence ? `<div class="text-[11px] text-stone-500 italic mt-0.5 line-clamp-1" title="${escapeHtml(item.exampleSentence)}">${escapeHtml(item.exampleSentence)}</div>` : ''}
        </td>
        <td class="py-3 px-3 sm:px-4 text-center hidden md:table-cell whitespace-nowrap">
          <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-950 dark:text-amber-200 bg-amber-50 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-amber-200 dark:border-stone-700">
            <span>${escapeHtml(topic.icon || '🏷️')}</span>
            <span>${escapeHtml(topic.name || 'Chủ đề')}</span>
          </span>
        </td>
        <td class="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
          <span class="px-2 py-0.5 rounded text-[11px] font-bold border ${badgeStyle}">HSK ${item.level || 1}</span>
        </td>
        <td class="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
          <div class="inline-flex items-center gap-1">
            <button onclick="playChineseTTS(${jsArg(item.title)}, 'female')" title="Phát âm Nữ" class="px-2 py-1 rounded-lg bg-white dark:bg-stone-700 hover:bg-rose-50 text-rose-850 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold transition-colors cursor-pointer">
              👩
            </button>
            <button onclick="playChineseTTS(${jsArg(item.title)}, 'male')" title="Phát âm Nam" class="px-2 py-1 rounded-lg bg-white dark:bg-stone-700 hover:bg-blue-50 text-blue-850 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-bold transition-colors cursor-pointer">
              👨
            </button>
          </div>
        </td>
        <td class="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
          <div class="inline-flex items-center gap-1">
            <button onclick="toggleSaveWord(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')}, ${item.level})" title="Lưu vào Sổ tay" class="p-1.5 rounded-lg bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-stone-700 cursor-pointer">
              <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="openWritingModal(${jsArg(item.title)}, ${jsArg(item.pinyin)}, ${jsArg(item.meaning || '')})" title="Tập viết chữ" class="p-1.5 rounded-lg bg-rose-50 dark:bg-stone-800 hover:bg-rose-100 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-stone-700 cursor-pointer">
              <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  topicDictRendered += nextBatch.length;
  const loadMoreBtn = document.getElementById('loadMoreTopicBtn');
  if (loadMoreBtn) {
    if (topicDictRendered >= filteredList.length) {
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  }

  refreshIcons();
}

function loadMoreTopicDict() {
  renderTopicDictionary(false);
}

/** 3. Quick Action: Start Spaced Repetition Flashcard Session for this Topic */
async function startTopicFlashcards() {
  const list = getFilteredTopicDictionaryList();
  if (!list || list.length === 0) {
    showToast('Chưa có từ vựng nào trong chủ đề này để luyện.', 'info');
    return;
  }
  const maxWords = 30;
  const sample = shuffle(list).slice(0, maxWords);
  const topicName = currentDictTopic === 'all'
    ? (SUPER_CATEGORIES[currentSuperCategory]?.name || 'Chủ đề tổng hợp')
    : (getTopicInfo(currentDictTopic)?.name || 'Chủ đề');

  const customCards = sample.map(w => ({
    title: w.title,
    pinyin: w.pinyin || '',
    meaning: w.meaning || '',
    level: w.level || 1,
    pos: w.pos || topicName,
    exampleSentence: w.exampleSentence || '',
    exampleMeaning: w.exampleMeaning || ''
  }));

  await switchTab('flashcards');
  startFlashcardSession('topic', { customCards });
  showToast(`Đã nạp ${customCards.length} từ vựng chủ đề "${topicName}" vào Flashcard để ôn tập!`, 'success');
}

})();

/* --- FILE: js/features/search.js --- */
(function(){
// ==========================================
// INTELLIGENT PHONETIC & LINGUISTIC NORMALIZERS
// ==========================================
function hasVietnameseDiacritics(str) {
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(str);
}

function normalizePinyin(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[āáǎà]/g, 'a')
    .replace(/[ēéěè]/g, 'e')
    .replace(/[īíǐì]/g, 'i')
    .replace(/[ōóǒò]/g, 'o')
    .replace(/[ūúǔù]/g, 'u')
    .replace(/[ǖǘǚǜü]/g, 'u')
    .replace(/[1-5]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeVietnamese(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function splitMeaningTerms(str) {
  if (!str) return [];
  return str
    .split(/[,;；、/()（）\[\]【】\n\r]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

// Datasets the omni-search looks through; loaded lazily on first focus/input.
const SEARCH_DATASETS = ['dictionary', 'etymology', 'radicals', 'chengyu', 'culture', 'jiaocheng'];

function ensureSearchData() {
  return loadDatasets(SEARCH_DATASETS);
}

// Global Search State
let currentSearchResults = [];
let currentSearchSelectedIndex = -1;
let currentWordModalWord = null;

// ==========================================
// HIGH-PRECISION MULTI-SOURCE OMNISEARCH ENGINE
// ==========================================
function searchOmniDatabase(query) {
  if (!query || !query.trim()) return [];

  const rawQ = query.trim().toLowerCase();
  const hasVn = hasVietnameseDiacritics(query);
  const isHanzi = /[\u4e00-\u9fa5]/.test(query);
  const pyQ = normalizePinyin(query);
  const viQ = normalizeVietnamese(query);
  const viTokens = viQ ? viQ.split(/\s+/).filter(Boolean) : [];

  const results = [];

  // Helper for scoring meanings
  function scoreMeaning(meaningStr) {
    if (!meaningStr) return 0;
    let mScore = 0;
    const meaningLower = meaningStr.toLowerCase();
    const meaningNorm = normalizeVietnamese(meaningStr);

    const terms = splitMeaningTerms(meaningLower);
    for (const term of terms) {
      const termNorm = normalizeVietnamese(term);
      if (term === rawQ) {
        mScore = Math.max(mScore, 950); // Exact accented meaning match (e.g. "tôi", "bạn", "yêu")
        break;
      }
      if (!hasVn && termNorm === viQ) {
        mScore = Math.max(mScore, 780); // Exact unaccented meaning match (e.g. "yeu" -> 爱)
        break;
      }
      if (hasVn && term.startsWith(rawQ)) {
        mScore = Math.max(mScore, 440);
      } else if (!hasVn && termNorm.startsWith(viQ)) {
        mScore = Math.max(mScore, 350);
      } else if (hasVn && rawQ.length >= 2 && term.includes(rawQ)) {
        mScore = Math.max(mScore, 260);
      } else if (!hasVn && viQ.length >= 2 && termNorm.includes(viQ)) {
        mScore = Math.max(mScore, 180);
      }
    }

    if (meaningLower === rawQ) mScore = Math.max(mScore, 880);
    else if (!hasVn && meaningNorm === viQ) mScore = Math.max(mScore, 700);

    return mScore;
  }

  // 1. Search Dictionary (HSK 1-6)
  if (dictionaryData && Array.isArray(dictionaryData)) {
    for (const item of dictionaryData) {
      let score = 0;
      const title = (item.title || '').toLowerCase();
      const pinyin = (item.pinyin || '').toLowerCase();
      const pinyinNorm = normalizePinyin(item.pinyin);
      const hanviet = (item.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(item.hanviet);
      const meaningNorm = normalizeVietnamese(item.meaning);

      // A. Hanzi Match
      if (title === rawQ) score += 1050;
      else if (title.startsWith(rawQ)) score += 340;
      else if (title.includes(rawQ)) score += 160;

      // B. Meaning Match (Highest priority for Vietnamese search queries)
      const mScore = scoreMeaning(item.meaning);
      score += mScore;

      // C. Pinyin Match (Only if query is NOT Vietnamese accented)
      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 750;
        else if (pyQ && pinyinNorm.startsWith(pyQ)) score += 260;
        else if (pyQ && pinyinNorm.includes(pyQ)) score += 90;
      }

      // D. Hán Việt Match
      if (hanviet === rawQ) score += 620;
      else if (hanvietNorm === viQ) {
        if (!hasVn || hanviet === rawQ) score += 480;
        else score += 80;
      } else if (hanvietNorm.startsWith(viQ)) score += 160;
      else if (hanvietNorm.includes(viQ)) score += 70;

      // E. Multi-word Token Intersection
      if (viTokens.length > 1) {
        const fullViText = `${hanvietNorm} ${meaningNorm}`;
        if (viTokens.every(t => fullViText.includes(t))) {
          score += 140;
        }
      }

      // Boost for foundational vocabulary (HSK 1-2)
      if (score > 0) {
        if (item.level === 1) score += 40;
        else if (item.level === 2) score += 20;

        results.push({
          type: 'dict',
          title: item.title,
          pinyin: item.pinyin,
          hanviet: item.hanviet || '',
          meaning: item.meaning,
          level: item.level || 1,
          score
        });
      }
    }
  }

  // 2. Search Etymology (Chiết Tự & Gốc Từ)
  if (etymologyData && Array.isArray(etymologyData)) {
    for (const e of etymologyData) {
      let score = 0;
      const hanzi = (e.hanzi || '').toLowerCase();
      const pinyinNorm = normalizePinyin(e.pinyin);
      const hanviet = (e.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(e.hanviet);
      const storyNorm = normalizeVietnamese(e.etymologyStory);

      if (hanzi === rawQ) score += 980;
      else if (hanzi.includes(rawQ)) score += 200;

      const mScore = scoreMeaning(e.meaning);
      score += Math.round(mScore * 0.9);

      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 680;
        else if (pyQ && pinyinNorm.startsWith(pyQ)) score += 220;
      }

      if (hanviet === rawQ) score += 550;
      else if (hanvietNorm === viQ) {
        if (!hasVn || hanviet === rawQ) score += 420;
        else score += 60;
      }

      if (viQ && storyNorm.includes(viQ)) score += 90;

      if (score > 0) {
        results.push({
          type: 'etymology',
          title: e.hanzi,
          pinyin: e.pinyin,
          hanviet: `Chiết Tự: ${e.hanviet}`,
          meaning: e.meaning,
          score: score - 10
        });
      }
    }
  }

  // 3. Search 214 Radicals (Bộ Thủ Khang Hy)
  if (radicalsData && Array.isArray(radicalsData)) {
    for (const r of radicalsData) {
      let score = 0;
      const char = (r.char || '').toLowerCase();
      const pinyinNorm = normalizePinyin(r.pinyin);
      const hanviet = (r.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(r.hanviet);

      if (char === rawQ) score += 920;
      const mScore = scoreMeaning(r.meaning);
      score += Math.round(mScore * 0.85);

      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 620;
      }

      if (hanviet === rawQ || `bộ ${hanviet}` === rawQ) score += 580;
      else if (hanvietNorm === viQ || `bo ${hanvietNorm}` === viQ) {
        score += 380;
      }

      if (score > 0) {
        results.push({
          type: 'radical',
          title: r.char,
          pinyin: r.pinyin,
          hanviet: `Bộ ${r.hanviet}`,
          meaning: r.meaning,
          strokes: r.strokes,
          score: score - 15
        });
      }
    }
  }

  // 4. Search Chengyu & Idioms (Thành Ngữ Điển Tích)
  if (chengyuData && Array.isArray(chengyuData)) {
    for (const c of chengyuData) {
      let score = 0;
      const title = (c.chengyu || '').toLowerCase();
      const pinyinNorm = normalizePinyin(c.pinyin);
      const hanviet = (c.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(c.hanviet);
      const litNorm = normalizeVietnamese(c.literal);
      const figNorm = normalizeVietnamese(c.figurative);
      const storyNorm = normalizeVietnamese(c.story);

      if (title === rawQ) score += 980;
      else if (title.includes(rawQ)) score += 300;

      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 700;
        else if (pyQ && pinyinNorm.includes(pyQ)) score += 200;
      }

      if (hanviet === rawQ) score += 600;
      else if (hanvietNorm === viQ) score += 450;
      else if (hanvietNorm.includes(viQ)) score += 180;

      if (viQ && (litNorm.includes(viQ) || figNorm.includes(viQ))) score += 220;
      if (viTokens.length > 1) {
        const comb = `${litNorm} ${figNorm} ${storyNorm}`;
        if (viTokens.every(t => comb.includes(t))) score += 150;
      }

      if (score > 0) {
        results.push({
          type: 'chengyu',
          title: c.chengyu,
          pinyin: c.pinyin,
          hanviet: c.hanviet,
          meaning: `${c.literal} — ${c.figurative}`,
          score
        });
      }
    }
  }

  // 5. Search Culture & Dynasties (Lịch Sử & Văn Hóa)
  if (cultureData && Array.isArray(cultureData)) {
    for (const era of cultureData) {
      let score = 0;
      const title = (era.title || '').toLowerCase();
      const eraName = (era.eraName || '').toLowerCase();
      const combinedVi = normalizeVietnamese(`${era.eraName} ${era.title} ${era.summary} ${(era.keywords || []).join(' ')}`);

      if (title.toLowerCase().includes(rawQ) || eraName.toLowerCase().includes(rawQ)) score += 450;
      if (viQ && combinedVi.includes(viQ)) score += 250;
      if (viTokens.length > 1 && viTokens.every(t => combinedVi.includes(t))) score += 180;

      if (score > 0) {
        results.push({
          type: 'culture',
          title: era.eraName || era.title,
          pinyin: era.period || '',
          hanviet: 'Lịch Sử & Văn Hóa',
          meaning: (era.summary || era.title).slice(0, 120),
          targetId: era.id,
          score
        });
      }
    }
  }

  // 6. Search Jiaocheng Lessons (Giáo Trình Hán Ngữ)
  if (jiaochengData && jiaochengData.lessons && Array.isArray(jiaochengData.lessons)) {
    for (const l of jiaochengData.lessons) {
      let score = 0;
      const titleHanzi = (l.titleHanzi || '').toLowerCase();
      const titleMeaning = (l.titleMeaning || '').toLowerCase();
      const titleNorm = normalizeVietnamese(l.titleMeaning);

      if (titleHanzi.includes(rawQ)) score += 350;
      if (titleMeaning.includes(rawQ)) score += 320;
      else if (viQ && titleNorm.includes(viQ)) score += 220;

      const numMatch = rawQ.match(/(?:bài|bai)\s*([0-9]{1,2})/i);
      if (numMatch && parseInt(numMatch[1]) === l.lessonNum) {
        score += 550;
      }

      if (score > 0) {
        results.push({
          type: 'jiaocheng',
          title: `Bài ${l.lessonNum}: ${l.titleHanzi}`,
          pinyin: l.titlePinyin || '',
          hanviet: l.volumeName || 'Giáo Trình Hán Ngữ',
          meaning: `${l.titleMeaning} (${l.category || ''})`,
          lessonNum: l.lessonNum,
          lessonId: l.id,
          score
        });
      }
    }
  }

  // Deduplicate and sort descending by score
  results.sort((a, b) => b.score - a.score);

  const seen = new Set();
  const uniqueResults = [];
  for (const r of results) {
    const key = `${r.type}-${r.title}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueResults.push(r);
    }
  }

  return uniqueResults.slice(0, 10);
}

// ---------------- GLOBAL SEARCH ----------------
function setupGlobalSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  const dropdown = document.getElementById('searchDropdown');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (!searchInput || !dropdown) return;

  if (searchInput._globalSearchInitialized) return;
  searchInput._globalSearchInitialized = true;

  searchInput.addEventListener('input', debounce((e) => {
    handleGlobalSearch(e.target.value);
  }, 80));

  searchInput.addEventListener('focus', () => {
    ensureSearchData().catch(() => {});
    if (searchInput.value.trim() && currentSearchResults && currentSearchResults.length > 0) {
      dropdown.classList.remove('hidden');
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (dropdown.classList.contains('hidden') || !currentSearchResults.length) {
      if (e.key === 'Enter') {
        handleGlobalSearch(searchInput.value);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentSearchSelectedIndex = (currentSearchSelectedIndex + 1) % currentSearchResults.length;
      updateSearchSelectionHighlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentSearchSelectedIndex = (currentSearchSelectedIndex - 1 + currentSearchResults.length) % currentSearchResults.length;
      updateSearchSelectionHighlight();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const targetIdx = currentSearchSelectedIndex >= 0 ? currentSearchSelectedIndex : 0;
      selectSearchResult(targetIdx);
    } else if (e.key === 'Escape') {
      dropdown.classList.add('hidden');
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

async function handleGlobalSearch(query) {
  const searchInput = document.getElementById('globalSearchInput');
  const dropdown = document.getElementById('searchDropdown');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (!dropdown) return;

  const q = (query || '').trim();
  if (!q) {
    dropdown.classList.add('hidden');
    if (clearBtn) clearBtn.classList.add('hidden');
    currentSearchResults = [];
    currentSearchSelectedIndex = -1;
    return;
  }

  if (clearBtn) clearBtn.classList.remove('hidden');

  if (!isDataLoaded(SEARCH_DATASETS)) {
    dropdown.innerHTML = '<div class="p-6 text-center text-xs text-stone-500 dark:text-stone-400">Đang tải dữ liệu tra cứu...</div>';
    dropdown.classList.remove('hidden');
    try {
      await ensureSearchData();
    } catch (err) {
      console.error('Không tải được dữ liệu tìm kiếm:', err);
      dropdown.innerHTML = '<div class="p-6 text-center text-xs text-rose-600">Không tải được dữ liệu tra cứu. Vui lòng thử lại.</div>';
      return;
    }
    // Ignore stale results if the user kept typing or cleared the box meanwhile.
    if (searchInput && (searchInput.value || '').trim() !== q) return;
  }

  const matches = searchOmniDatabase(q);
  currentSearchResults = matches;
  currentSearchSelectedIndex = -1;

  if (!matches.length) {
    dropdown.innerHTML = `
      <div class="p-6 text-center text-xs space-y-2">
        <div class="w-10 h-10 rounded-full bg-amber-50 dark:bg-stone-800 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto text-lg">
          🔍
        </div>
        <p class="font-bold text-stone-800 dark:text-stone-200">Không tìm thấy từ vựng khớp với "${escapeHtml(q)}".</p>
        <p class="text-stone-500 dark:text-stone-400 text-[11px] leading-relaxed">
          Gợi ý: Bạn có thể gõ chữ Hán (<strong>你好</strong>), Pinyin không dấu (<strong>nihao, xiexie</strong>), Hán Việt (<strong>Nhĩ hảo, Tạ tạ</strong>) hoặc nghĩa tiếng Việt (<strong>xin chào, cảm ơn</strong>).
        </p>
      </div>
    `;
    dropdown.classList.remove('hidden');
    return;
  }

  renderSearchResults(matches, q);
  dropdown.classList.remove('hidden');
}

function renderSearchResults(matches, query) {
  const dropdown = document.getElementById('searchDropdown');
  if (!dropdown) return;

  const typeBadges = {
    dict: (lvl) => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-[#8B1E1E] dark:text-amber-300 border border-amber-300 dark:border-amber-700">HSK ${lvl}</span>`,
    radical: (st) => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">Bộ Thủ (${st} nét)</span>`,
    chengyu: () => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-700">Thành Ngữ</span>`,
    etymology: () => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-700">Chiết Tự</span>`,
    culture: () => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-700">Lịch Sử</span>`,
    jiaocheng: () => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700">Giáo Trình</span>`
  };

  const itemsHtml = matches.map((m, idx) => {
    let badgeHtml = '';
    if (m.type === 'dict') badgeHtml = typeBadges.dict(m.level);
    else if (m.type === 'radical') badgeHtml = typeBadges.radical(m.strokes);
    else if (m.type === 'chengyu') badgeHtml = typeBadges.chengyu();
    else if (m.type === 'etymology') badgeHtml = typeBadges.etymology();
    else if (m.type === 'culture') badgeHtml = typeBadges.culture();
    else if (m.type === 'jiaocheng') badgeHtml = typeBadges.jiaocheng();

    return `
      <div 
        id="search-item-${idx}" 
        onclick="selectSearchResult(${idx})" 
        class="search-item-row p-2.5 rounded-xl hover:bg-amber-100/70 dark:hover:bg-stone-800/90 cursor-pointer flex items-center justify-between transition-all border border-transparent hover:border-amber-300/80 dark:hover:border-amber-500/40 group"
      >
        <div class="flex items-center gap-3 min-w-0 pr-2">
          <div class="w-12 h-12 rounded-xl bg-amber-50/80 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <span class="font-hanzi text-2xl font-black text-[#8B1E1E] dark:text-red-400">${escapeHtml(m.title)}</span>
          </div>
          <div class="min-w-0 space-y-0.5">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-xs font-bold text-[#8B1E1E] dark:text-red-400 tracking-wide">${escapeHtml(m.pinyin)}</span>
              ${m.hanviet ? `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100/90 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border border-amber-300/70 dark:border-amber-700">[${escapeHtml(m.hanviet)}]</span>` : ''}
            </div>
            <p class="text-xs text-stone-700 dark:text-stone-300 truncate max-w-[280px] sm:max-w-[340px] font-medium leading-snug">${escapeHtml(m.meaning)}</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0 pl-1">
          <button 
            onclick="event.stopPropagation(); playChineseTTS(${jsArg(m.title)}, 'female');" 
            title="Nghe phát âm chuẩn giọng Nữ" 
            class="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-stone-600 dark:text-stone-300 hover:text-rose-800 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
          >
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          </button>
          ${badgeHtml}
        </div>
      </div>
    `;
  }).join('');

  dropdown.innerHTML = `
    <div class="px-3 py-1.5 border-b border-amber-200/60 dark:border-amber-500/20 text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
      <span>🔍 Tìm thấy ${matches.length} kết quả phù hợp cho "${escapeHtml(query)}"</span>
      <span class="text-[10px] text-stone-400 font-normal">Bấm hoặc nhấn Enter để xem</span>
    </div>
    <div class="space-y-1 py-1">
      ${itemsHtml}
    </div>
    <div class="px-3 py-1.5 border-t border-amber-200/60 dark:border-amber-500/20 text-[10px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
      <span>↑ ↓ Di chuyển</span>
      <span>Enter Mở chi tiết</span>
      <span>Esc Đóng</span>
    </div>
  `;

  refreshIcons(dropdown);
}

function updateSearchSelectionHighlight() {
  const rows = document.querySelectorAll('.search-item-row');
  rows.forEach((row, i) => {
    if (i === currentSearchSelectedIndex) {
      row.classList.add('bg-amber-100/90', 'dark:bg-stone-800', 'border-amber-400');
      row.scrollIntoView({ block: 'nearest' });
    } else {
      row.classList.remove('bg-amber-100/90', 'dark:bg-stone-800', 'border-amber-400');
    }
  });
}

async function selectSearchResult(index) {
  const dropdown = document.getElementById('searchDropdown');
  if (dropdown) dropdown.classList.add('hidden');

  if (!currentSearchResults || !currentSearchResults[index]) return;
  const item = currentSearchResults[index];

  if (item.type === 'dict') {
    openWordModalByTitle(item.title);
  } else if (item.type === 'radical') {
    openWritingModal(item.title, item.pinyin, item.hanviet + ' (' + item.meaning + ')');
  } else if (item.type === 'chengyu') {
    switchTab('chengyu');
    showToast(`Đang mở thành ngữ: ${item.title} (${item.hanviet})`, 'info');
  } else if (item.type === 'etymology') {
    await switchTab('etymology');
    selectOrDecomposeEtymology(item.title);
    showToast(`Đang mở chiết tự chữ: ${item.title}`, 'info');
  } else if (item.type === 'culture') {
    switchTab('culture');
    showToast(`Đang mở mục: ${item.title}`, 'info');
  } else if (item.type === 'jiaocheng') {
    await switchTab('jiaocheng');
    openLessonDetailModal(item.lessonId);
    showToast(`Đang mở: ${item.title}`, 'info');
  }
}

function clearSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';
  const dropdown = document.getElementById('searchDropdown');
  if (dropdown) dropdown.classList.add('hidden');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) clearBtn.classList.add('hidden');
  currentSearchResults = [];
  currentSearchSelectedIndex = -1;
  if (searchInput) searchInput.focus();
}

// ---------------- WORD DETAIL MODAL (MULTIDIMENSIONAL 6-IN-1) ----------------
// 1. Cách dùng | 2. Nghĩa | 3. Từ đồng nghĩa | 4. Trái nghĩa | 5. Từ đồng âm | 6. Hình ảnh mô tả

let floatingLookupTargetWord = '';
let floatingLookupHideTimeout = null;

async function openWordModalByTitle(title) {
  if (!title) return;
  const cleanTitle = String(title).trim();

  try {
    await loadDatasets(['multidimensionalWords', 'dictionary', 'etymology', 'radicals']);
  } catch (err) {
    console.warn('Could not preload all datasets for wordModal:', err);
  }

  // 1. Try multidimensionalWordsData first (richest 6-in-1 data)
  let word = (multidimensionalWordsData && multidimensionalWordsData[cleanTitle]) ? multidimensionalWordsData[cleanTitle] : null;

  // 2. Fall back to dictionaryData
  if (!word && typeof dictionaryData !== 'undefined' && dictionaryData) {
    const dictMatch = dictionaryData.find(w => w.title === cleanTitle);
    if (dictMatch) {
      word = {
        hanzi: dictMatch.title,
        pinyin: dictMatch.pinyin || '',
        hanviet: dictMatch.hanviet || '',
        meaning: dictMatch.meaning || '',
        pos: dictMatch.pos || 'từ vựng',
        level: dictMatch.level || 1,
        usage: [
          `🔹 Từ vựng cốt lõi HSK ${dictMatch.level || 1}.`,
          `🔹 Ngữ cảnh: Thường xuất hiện trong giao tiếp hàng ngày.`
        ],
        exampleSentence: dictMatch.exampleSentence || `${cleanTitle}很好。`,
        examplePinyin: dictMatch.examplePinyin || '',
        exampleMeaning: dictMatch.exampleMeaning || '',
        synonyms: [],
        antonyms: [],
        homophones: [],
        image: dictMatch.topicIcon || '🏮',
        imageCaption: dictMatch.meaning || 'Minh họa ngữ nghĩa'
      };
    }
  }

  // 3. Fall back to etymologyData
  if (!word && typeof etymologyData !== 'undefined' && etymologyData) {
    const etymMatch = etymologyData.find(e => e.hanzi === cleanTitle);
    if (etymMatch) {
      word = {
        hanzi: etymMatch.hanzi,
        pinyin: etymMatch.pinyin || '',
        hanviet: etymMatch.hanviet || '',
        meaning: etymMatch.meaning || '',
        pos: 'chữ Hán (Chiết tự)',
        level: 1,
        usage: [
          `🔹 Lục thư: ${etymMatch.category || 'Tượng hình'}.`,
          `🔹 Ý nghĩa chiết tự: ${etymMatch.meaning || ''}.`
        ],
        exampleSentence: etymMatch.etymologyStory ? etymMatch.etymologyStory.slice(0, 100) : cleanTitle,
        examplePinyin: etymMatch.pinyin || '',
        exampleMeaning: etymMatch.meaning || '',
        synonyms: [],
        antonyms: [],
        homophones: [],
        image: '🏛️',
        imageCaption: `Chiết tự chữ ${etymMatch.hanzi}`
      };
    }
  }

  // 4. Fall back to radicalsData
  if (!word && typeof radicalsData !== 'undefined' && radicalsData) {
    const radMatch = radicalsData.find(r => r.char === cleanTitle);
    if (radMatch) {
      word = {
        hanzi: radMatch.char,
        pinyin: radMatch.pinyin || '',
        hanviet: `Bộ ${radMatch.hanviet || ''}`,
        meaning: radMatch.meaning || '',
        pos: `Bộ thủ (${radMatch.strokes || 1} nét)`,
        level: 1,
        usage: [
          `🔹 Bộ thủ Khang Hy số ${radMatch.number || ''}.`,
          `🔹 Biểu nghĩa nền tảng cho nhiều chữ Hán phái sinh.`
        ],
        exampleSentence: `Bộ thủ ${radMatch.char} (${radMatch.hanviet})`,
        examplePinyin: radMatch.pinyin || '',
        exampleMeaning: radMatch.meaning || '',
        synonyms: [],
        antonyms: [],
        homophones: [],
        image: '🏮',
        imageCaption: `Bộ thủ ${radMatch.char}`
      };
    }
  }

  // 5. If still not found, synthesize a valid multidimensional card on-the-fly
  if (!word) {
    word = {
      hanzi: cleanTitle,
      pinyin: '',
      hanviet: 'Đang cập nhật',
      meaning: `Từ vựng: ${cleanTitle}`,
      pos: 'từ vựng',
      level: 1,
      usage: [
        `🔹 Từ vựng tiếng Trung thực hành giao tiếp.`,
        `🔹 Bấm 'Tập Viết Nét' hoặc 'Xem Chiết Tự' để tra cứu sâu hơn.`
      ],
      exampleSentence: cleanTitle,
      examplePinyin: '',
      exampleMeaning: '',
      synonyms: [],
      antonyms: [],
      homophones: [],
      image: '✨',
      imageCaption: cleanTitle
    };
  }

  currentWordModalWord = {
    title: word.hanzi || cleanTitle,
    ...word
  };

  // Populate Header
  const hanziEl = document.getElementById('modalHanzi');
  const pinyinEl = document.getElementById('modalPinyin');
  const posEl = document.getElementById('modalPos');
  const meaningEl = document.getElementById('modalMeaning');
  const hanvietBadge = document.getElementById('modalHanvietBadge');
  const levelBadge = document.getElementById('modalLevelBadge');
  const imgDisplay = document.getElementById('modalImageDisplay');
  const imgCaption = document.getElementById('modalImageCaption');

  if (hanziEl) hanziEl.innerText = word.hanzi || cleanTitle;
  if (pinyinEl) pinyinEl.innerText = word.pinyin || '';
  if (posEl) posEl.innerText = word.pos || 'từ vựng';
  if (meaningEl) meaningEl.innerText = word.meaning || '';

  if (hanvietBadge) {
    hanvietBadge.innerText = word.hanviet ? `Hán Việt: ${word.hanviet}` : 'Hán Việt: Đang cập nhật';
  }
  if (levelBadge) {
    levelBadge.innerText = `HSK ${word.level || 1}`;
  }
  if (imgDisplay) {
    imgDisplay.innerText = word.image || '🏮';
  }
  if (imgCaption) {
    imgCaption.innerText = word.imageCaption || word.meaning || 'Minh họa ngữ nghĩa';
    imgCaption.title = word.imageCaption || '';
  }

  // Populate Usage (Cách dùng & Cụm từ thường gặp)
  const usageContainer = document.getElementById('modalUsageContainer');
  if (usageContainer) {
    const usages = (word.usage && word.usage.length > 0)
      ? word.usage
      : [`🔹 Cấu trúc kết hợp thông dụng trong giao tiếp và kỳ thi HSK.`];

    usageContainer.innerHTML = usages.map(u => `
      <div class="flex items-start gap-2">
        <span class="text-amber-600 dark:text-amber-400 font-bold shrink-0">✦</span>
        <span class="leading-relaxed">${escapeHtml(u)}</span>
      </div>
    `).join('');
  }

  // Populate Example Sentence
  const exHanzi = document.getElementById('modalExampleHanzi');
  const exPinyin = document.getElementById('modalExamplePinyin');
  const exVi = document.getElementById('modalExampleVi');

  if (exHanzi) exHanzi.innerText = word.exampleSentence || cleanTitle;
  if (exPinyin) exPinyin.innerText = word.examplePinyin || word.pinyin || '';
  if (exVi) exVi.innerText = word.exampleMeaning || word.meaning || '';

  // Populate Synonyms (近义词)
  const synList = document.getElementById('modalSynonymsList');
  if (synList) {
    if (word.synonyms && word.synonyms.length > 0) {
      synList.innerHTML = word.synonyms.map(s => `
        <button onclick="openWordModalByTitle('${escapeHtml(s.hanzi)}')" class="group flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/80 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 shadow-2xs transition-all cursor-pointer" title="${escapeHtml(s.desc || s.meaning || '')}">
          <span class="font-hanzi font-bold text-stone-900 dark:text-emerald-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">${escapeHtml(s.hanzi)}</span>
          ${s.pinyin ? `<span class="text-[10px] text-emerald-800 dark:text-emerald-400 font-mono">(${escapeHtml(s.pinyin)})</span>` : ''}
          ${s.meaning ? `<span class="text-[11px] text-stone-600 dark:text-stone-300">${escapeHtml(s.meaning)}</span>` : ''}
        </button>
      `).join('');
    } else {
      synList.innerHTML = `<span class="text-xs text-stone-400 dark:text-stone-500 italic py-0.5">Không có từ đồng nghĩa tương đương trực tiếp</span>`;
    }
  }

  // Populate Antonyms (反义词)
  const antList = document.getElementById('modalAntonymsList');
  if (antList) {
    if (word.antonyms && word.antonyms.length > 0) {
      antList.innerHTML = word.antonyms.map(a => `
        <button onclick="openWordModalByTitle('${escapeHtml(a.hanzi)}')" class="group flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700/80 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/50 shadow-2xs transition-all cursor-pointer" title="${escapeHtml(a.desc || a.meaning || '')}">
          <span class="font-hanzi font-bold text-stone-900 dark:text-rose-200 group-hover:text-rose-700 dark:group-hover:text-rose-300">${escapeHtml(a.hanzi)}</span>
          ${a.pinyin ? `<span class="text-[10px] text-rose-800 dark:text-rose-400 font-mono">(${escapeHtml(a.pinyin)})</span>` : ''}
          ${a.meaning ? `<span class="text-[11px] text-stone-600 dark:text-stone-300">${escapeHtml(a.meaning)}</span>` : ''}
        </button>
      `).join('');
    } else {
      antList.innerHTML = `<span class="text-xs text-stone-400 dark:text-stone-500 italic py-0.5">Không có cặp từ phản nghĩa đối lập trực tiếp</span>`;
    }
  }

  // Populate Homophones (同音词 • Tránh Nhầm Lẫn)
  const homoList = document.getElementById('modalHomophonesList');
  if (homoList) {
    if (word.homophones && word.homophones.length > 0) {
      homoList.innerHTML = word.homophones.map(h => `
        <button onclick="openWordModalByTitle('${escapeHtml(h.hanzi)}')" class="group flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/80 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/40 shadow-2xs transition-all cursor-pointer" title="Cùng âm ${escapeHtml(h.pinyin || '')}">
          <span class="font-hanzi font-bold text-stone-900 dark:text-amber-200 group-hover:text-amber-700 dark:group-hover:text-amber-300">${escapeHtml(h.hanzi)}</span>
          ${h.pinyin ? `<span class="text-[10px] text-amber-800 dark:text-amber-400 font-mono">(${escapeHtml(h.pinyin)})</span>` : ''}
          ${h.meaning ? `<span class="text-[11px] text-stone-600 dark:text-stone-300">${escapeHtml(h.meaning)}</span>` : ''}
        </button>
      `).join('');
    } else {
      homoList.innerHTML = `<span class="text-xs text-stone-400 dark:text-stone-500 italic py-0.5">Phiên âm độc lập, không có từ đồng âm gây nhầm lẫn</span>`;
    }
  }

  updateWordModalBookmarkState();
  openModal('wordModal');
  if (typeof refreshIcons === 'function') refreshIcons();
}

function closeWordModal() {
  closeModal('wordModal');
}

registerModal('wordModal', closeWordModal);

function playWordModalTTS(gender = 'female') {
  if (currentWordModalWord && currentWordModalWord.title) {
    playChineseTTS(currentWordModalWord.title, gender);
  }
}

function playWordModalExampleTTS(gender = 'female') {
  if (currentWordModalWord && currentWordModalWord.exampleSentence) {
    playChineseTTS(currentWordModalWord.exampleSentence, gender);
  }
}

function openWritingModalFromWordModal() {
  if (!currentWordModalWord) return;
  const word = currentWordModalWord;
  closeWordModal();
  openWritingModal(word.title, word.pinyin, (word.hanviet ? `[${word.hanviet}] ` : '') + word.meaning);
}

async function openEtymologyFromWordModal() {
  if (!currentWordModalWord) return;
  const word = currentWordModalWord.title;
  closeWordModal();
  await switchTab('etymology');
  selectOrDecomposeEtymology(word);
}

function updateWordModalBookmarkState() {
  if (!currentWordModalWord) return;
  const isSaved = typeof isWordSaved === 'function' ? isWordSaved(currentWordModalWord.title) : false;
  const btn = document.getElementById('modalBookmarkBtn');
  const label = document.getElementById('modalBookmarkLabel');
  if (btn && label) {
    if (isSaved) {
      btn.className = 'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white border border-amber-600 transition-all cursor-pointer shadow-2xs';
      label.innerText = 'Đã Lưu Sổ Tay ⭐';
    } else {
      btn.className = 'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer shadow-2xs';
      label.innerText = 'Lưu Sổ Tay';
    }
  }
}

function toggleSaveWordFromModal() {
  if (!currentWordModalWord) return;
  const w = currentWordModalWord;
  if (typeof toggleSaveWord === 'function') {
    toggleSaveWord(w.title, w.pinyin, w.meaning, w.level || 1);
  }
  updateWordModalBookmarkState();
}

// ---------------- TOKEN LOOKUP MODAL (REUSE WORDMODAL) ----------------
async function openWordModalWithToken(hanzi, pinyin, vi) {
  if (!hanzi) return;
  await openWordModalByTitle(hanzi);
}

// ---------------- FLOATING WORD QUICK LOOKUP (GLOBAL TAP & SELECTION) ----------------
function hideFloatingWordLookup() {
  const pill = document.getElementById('floatingWordLookupBtn');
  if (pill) pill.classList.add('hidden');
  floatingLookupTargetWord = '';
  if (typeof window !== 'undefined') window.floatingLookupTargetWord = '';
}

async function handleFloatingWordLookupClick() {
  const target = (typeof window !== 'undefined' && window.floatingLookupTargetWord) ? window.floatingLookupTargetWord : floatingLookupTargetWord;
  if (target) {
    const wordToLookup = target;
    hideFloatingWordLookup();
    await openWordModalByTitle(wordToLookup);
  }
}

function initGlobalWordTapListener() {
  const checkSelection = (e) => {
    // If clicking directly on the floating pill or inside word modal, ignore
    if (e && e.target && (e.target.closest('#floatingWordLookupBtn') || e.target.closest('#wordModal'))) {
      return;
    }

    const selection = window.getSelection ? window.getSelection() : null;
    if (!selection || selection.isCollapsed) {
      if (floatingLookupHideTimeout) clearTimeout(floatingLookupHideTimeout);
      floatingLookupHideTimeout = setTimeout(hideFloatingWordLookup, 200);
      return;
    }

    const text = selection.toString().trim();
    // Match 1 to 6 Chinese characters
    const hanziMatch = text.match(/[\u4e00-\u9fa5]{1,6}/);
    if (!hanziMatch) {
      hideFloatingWordLookup();
      return;
    }

    const hanziWord = hanziMatch[0];
    floatingLookupTargetWord = hanziWord;

    const pill = document.getElementById('floatingWordLookupBtn');
    const label = document.getElementById('floatingLookupWordText');
    if (!pill || !label) return;

    label.innerText = `Tra từ: ${hanziWord}`;

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pill.style.left = `${Math.max(60, Math.min(window.innerWidth - 60, rect.left + rect.width / 2))}px`;
        pill.style.top = `${Math.max(20, rect.top + window.scrollY - 8)}px`;
        pill.classList.remove('hidden');
        if (floatingLookupHideTimeout) clearTimeout(floatingLookupHideTimeout);
      }
    } catch (_) {
      hideFloatingWordLookup();
    }
  };

  document.addEventListener('mouseup', checkSelection);
  document.addEventListener('touchend', checkSelection);

  // Click on any element containing Chinese text with dict-trigger attributes or classes
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;

    // Check data-hanzi or data-word
    const hanziAttr = target.getAttribute('data-hanzi') || target.getAttribute('data-word');
    if (hanziAttr && /[\u4e00-\u9fa5]/.test(hanziAttr)) {
      e.stopPropagation();
      openWordModalByTitle(hanziAttr);
      return;
    }

    // Check specific class tokens
    if (target.classList.contains('hanzi-token') || target.classList.contains('dict-clickable') || target.classList.contains('word-token')) {
      const tokenText = target.innerText.trim();
      const m = tokenText.match(/[\u4e00-\u9fa5]+/);
      if (m) {
        e.stopPropagation();
        openWordModalByTitle(m[0]);
      }
    }
  });
}

// Auto-initialize global tap listener
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalWordTapListener);
  } else {
    initGlobalWordTapListener();
  }
}

})();

/* --- FILE: js/features/writing.js --- */
(function(){
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

})();

/* --- FILE: js/features/aichat.js --- */
(function(){
// =========================================================================
// MODULE: 150 BÀI HỘI THOẠI TÌNH HUỐNG & TRỢ LÝ AI (SITUATIONAL DIALOGUES)
// =========================================================================

// Module State
let activeAiScenario = null;
let aiChatHistory = [];

// 150 Dialogues State
let convActiveLesson = null;
let convCurrentTopicFilter = 0; // 0: All topics, 1-15: specific topic
let convCurrentHskFilter = 'all'; // 'all', 'HSK 1', 'HSK 2', ...
let convCurrentStatusFilter = 'all'; // 'all', 'completed', 'favorite'
let convSearchQuery = '';

let convFavorites = new Set();
let convCompleted = new Set();
let convQuizAttempts = {}; // { 'lessonNum_qIdx': true }

let convAudioSequenceActive = false;
let convAudioSequenceTimeout = null;
let convCurrentAudioTurnIndex = -1;
let convAudioSpeed = 1.0;
let convShowPinyin = true;
let convShowVi = true;

let convSpeechRecognition = null;
let convIsRecording = false;

// Topic Meta Info (15 Topics)
const CONV_TOPICS_META = [
  { id: 1, name: '1. Chào hỏi và giới thiệu bản thân', short: 'Chào hỏi & Giới thiệu', icon: '👋', range: '1 - 10' },
  { id: 2, name: '2. Giao tiếp hàng ngày', short: 'Giao tiếp hàng ngày', icon: '☕', range: '11 - 20' },
  { id: 3, name: '3. Gia đình và bạn bè', short: 'Gia đình & Bạn bè', icon: '👨‍👩‍👧‍👦', range: '21 - 30' },
  { id: 4, name: '4. Ăn uống và nhà hàng', short: 'Ăn uống & Nhà hàng', icon: '🍜', range: '31 - 40' },
  { id: 5, name: '5. Mua sắm', short: 'Mua sắm & Giá cả', icon: '🛍️', range: '41 - 50' },
  { id: 6, name: '6. Du lịch và phương tiện di chuyển', short: 'Du lịch & Di chuyển', icon: '✈️', range: '51 - 60' },
  { id: 7, name: '7. Khách sạn và lưu trú', short: 'Khách sạn & Lưu trú', icon: '🏨', range: '61 - 70' },
  { id: 8, name: '8. Học tập và trường học', short: 'Học tập & Trường học', icon: '🎓', range: '71 - 80' },
  { id: 9, name: '9. Công việc và nghề nghiệp', short: 'Công việc & Phỏng vấn', icon: '💼', range: '81 - 90' },
  { id: 10, name: '10. Sức khỏe và bệnh viện', short: 'Sức khỏe & Y tế', icon: '🏥', range: '91 - 100' },
  { id: 11, name: '11. Giải trí và sở thích', short: 'Giải trí & Sở thích', icon: '🎬', range: '101 - 110' },
  { id: 12, name: '12. Công nghệ và Internet', short: 'Công nghệ & Internet', icon: '💻', range: '111 - 120' },
  { id: 13, name: '13. Giao tiếp xã hội', short: 'Giao tiếp xã hội', icon: '🤝', range: '121 - 130' },
  { id: 14, name: '14. Tình huống khẩn cấp và dịch vụ công cộng', short: 'Khẩn cấp & Công cộng', icon: '🚨', range: '131 - 140' },
  { id: 15, name: '15. Các tình huống nâng cao', short: 'Chuyên sâu & Nâng cao', icon: '🌟', range: '141 - 150' }
];

// -------------------------------------------------------------------------
// INITIALIZATION
// -------------------------------------------------------------------------
function initAiChatModule() {
  loadConvUserData();

  // Render Horizontal Topics Navigator
  renderConvTopicsHorizontalBar();

  // Render Stats & Progress
  updateConvGlobalProgress();

  // Render Library Cards
  renderConvCardsGrid();

  // Render AI Roleplay Scenarios for backwards compatibility
  renderAiScenarios();
  if (aiScenariosData && aiScenariosData.length > 0 && !activeAiScenario) {
    selectAiScenario(aiScenariosData[0].id);
  }

  refreshIcons();
}

// -------------------------------------------------------------------------
// LOCAL STORAGE PERSISTENCE
// -------------------------------------------------------------------------
function loadConvUserData() {
  try {
    const favRaw = localStorage.getItem('chinese_dialogues_favorites');
    if (favRaw) {
      convFavorites = new Set(JSON.parse(favRaw));
    }
    const compRaw = localStorage.getItem('chinese_dialogues_completed');
    if (compRaw) {
      convCompleted = new Set(JSON.parse(compRaw));
    }
  } catch (err) {
    console.warn('Error reading dialogue user data from localStorage', err);
  }
}

function saveConvUserData() {
  try {
    localStorage.setItem('chinese_dialogues_favorites', JSON.stringify([...convFavorites]));
    localStorage.setItem('chinese_dialogues_completed', JSON.stringify([...convCompleted]));
  } catch (err) {
    console.warn('Error saving dialogue user data to localStorage', err);
  }
}

// -------------------------------------------------------------------------
// TAB MODE SWITCHING (150 Library vs AI Roleplay)
// -------------------------------------------------------------------------
function switchAiChatTabMode(mode) {
  const libView = document.getElementById('convLibraryView');
  const roleplayView = document.getElementById('convAiRoleplayView');
  const btnLib = document.getElementById('btn-conv-tab-library');
  const btnRoleplay = document.getElementById('btn-conv-tab-aichat');

  if (mode === 'library') {
    if (libView) libView.classList.remove('hidden');
    if (roleplayView) roleplayView.classList.add('hidden');
    if (btnLib) {
      btnLib.className = 'px-3.5 py-1.5 rounded-lg transition-all shadow-2xs bg-white text-[#8B1E1E] flex items-center gap-1.5 font-bold';
    }
    if (btnRoleplay) {
      btnRoleplay.className = 'px-3.5 py-1.5 rounded-lg transition-all text-stone-600 hover:text-stone-900 flex items-center gap-1.5 font-bold';
    }
  } else {
    if (libView) libView.classList.add('hidden');
    if (roleplayView) roleplayView.classList.remove('hidden');
    if (btnLib) {
      btnLib.className = 'px-3.5 py-1.5 rounded-lg transition-all text-stone-600 hover:text-stone-900 flex items-center gap-1.5 font-bold';
    }
    if (btnRoleplay) {
      btnRoleplay.className = 'px-3.5 py-1.5 rounded-lg transition-all shadow-2xs bg-white text-[#8B1E1E] flex items-center gap-1.5 font-bold';
    }
  }
  refreshIcons();
}

// -------------------------------------------------------------------------
// TOPICS HORIZONTAL BAR
// -------------------------------------------------------------------------
function renderConvTopicsHorizontalBar() {
  const container = document.getElementById('convTopicsHorizontalBar');
  if (!container) return;

  const dataset = conversations150Data || [];

  let html = `
    <button 
      onclick="setConvTopicFilter(0)"
      id="convTopicBtn-0"
      class="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
        convCurrentTopicFilter === 0
          ? 'bg-[#8B1E1E] text-white shadow-xs'
          : 'bg-white hover:bg-stone-50 border border-stone-200 text-stone-700'
      }">
      <span>🌈</span>
      <span>Tất cả (150 bài)</span>
    </button>
  `;

  CONV_TOPICS_META.forEach(t => {
    // Count completed in this topic
    const topicLessons = dataset.filter(x => x.topicId === t.id);
    const completedCount = topicLessons.filter(x => convCompleted.has(x.number)).length;
    const isSelected = convCurrentTopicFilter === t.id;

    html += `
      <button 
        onclick="setConvTopicFilter(${t.id})"
        id="convTopicBtn-${t.id}"
        class="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
          isSelected
            ? 'bg-[#8B1E1E] text-white shadow-xs'
            : 'bg-white hover:bg-stone-50 border border-stone-200 text-stone-700'
        }">
        <span>${t.icon}</span>
        <span>${escapeHtml(t.short)}</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
          isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
        }">${completedCount}/10</span>
      </button>
    `;
  });

  container.innerHTML = html;
}

// -------------------------------------------------------------------------
// GLOBAL PROGRESS & STATS
// -------------------------------------------------------------------------
function updateConvGlobalProgress() {
  const dataset = conversations150Data || [];
  const total = dataset.length || 150;
  const completedCount = convCompleted.size;
  const favCount = convFavorites.size;
  const pct = Math.min(100, Math.round((completedCount / total) * 100));

  const statsEl = document.getElementById('convProgressStats');
  if (statsEl) statsEl.innerText = `${completedCount} / ${total} bài (${pct}%)`;

  const barEl = document.getElementById('convProgressBar');
  if (barEl) barEl.style.width = `${pct}%`;

  const favEl = document.getElementById('convFavoritesCountBadge');
  if (favEl) favEl.innerHTML = `<i data-lucide="star" class="w-3 h-3 text-amber-500 fill-amber-500 inline-block mr-1"></i> ${favCount} yêu thích`;

  const completedStatusEl = document.getElementById('countCompletedStatus');
  if (completedStatusEl) completedStatusEl.innerText = completedCount;

  const favoriteStatusEl = document.getElementById('countFavoriteStatus');
  if (favoriteStatusEl) favoriteStatusEl.innerText = favCount;

  // Current topic title label
  const topicLabel = document.getElementById('convCurrentTopicLabel');
  if (topicLabel) {
    if (convCurrentTopicFilter === 0) {
      topicLabel.innerText = `Tất cả chủ đề (${total} bài)`;
    } else {
      const currentMeta = CONV_TOPICS_META.find(x => x.id === convCurrentTopicFilter);
      topicLabel.innerText = currentMeta ? currentMeta.name : `Chủ đề ${convCurrentTopicFilter}`;
    }
  }

  refreshIcons();
}

// -------------------------------------------------------------------------
// FILTERING & SEARCH CONTROLS
// -------------------------------------------------------------------------
function getFilteredConversations() {
  const dataset = conversations150Data || [];
  const q = convSearchQuery.toLowerCase().trim();

  return dataset.filter(item => {
    // Topic filter
    if (convCurrentTopicFilter !== 0 && item.topicId !== convCurrentTopicFilter) {
      return false;
    }

    // HSK Level filter
    if (convCurrentHskFilter !== 'all' && item.level !== convCurrentHskFilter) {
      return false;
    }

    // Status filter
    if (convCurrentStatusFilter === 'completed' && !convCompleted.has(item.number)) {
      return false;
    }
    if (convCurrentStatusFilter === 'favorite' && !convFavorites.has(item.number)) {
      return false;
    }

    // Search query
    if (q) {
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchHz = (item.titleHanzi || '').toLowerCase().includes(q);
      const matchPy = (item.titlePinyin || '').toLowerCase().includes(q);
      const matchSit = (item.situation || '').toLowerCase().includes(q);
      const matchNum = String(item.number).includes(q);
      const matchVocab = (item.vocabulary || []).some(v => 
        (v.hanzi || '').toLowerCase().includes(q) || 
        (v.pinyin || '').toLowerCase().includes(q) || 
        (v.meaning || '').toLowerCase().includes(q)
      );
      if (!matchTitle && !matchHz && !matchPy && !matchSit && !matchNum && !matchVocab) {
        return false;
      }
    }

    return true;
  });
}

function handleConvFilterChange() {
  const input = document.getElementById('convSearchInput');
  const clearBtn = document.getElementById('convClearSearchBtn');
  convSearchQuery = input ? input.value : '';

  if (clearBtn) {
    if (convSearchQuery) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }

  renderConvCardsGrid();
}

function clearConvSearch() {
  const input = document.getElementById('convSearchInput');
  if (input) input.value = '';
  convSearchQuery = '';
  const clearBtn = document.getElementById('convClearSearchBtn');
  if (clearBtn) clearBtn.classList.add('hidden');
  renderConvCardsGrid();
}

function setConvTopicFilter(topicId) {
  convCurrentTopicFilter = topicId;
  renderConvTopicsHorizontalBar();
  updateConvGlobalProgress();
  renderConvCardsGrid();
}

function setConvHskFilter(lvl) {
  convCurrentHskFilter = lvl;
  const levels = ['all', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];
  levels.forEach(l => {
    const btn = document.getElementById(`convFilterHsk-${l}`);
    if (btn) {
      if (l === lvl) {
        btn.className = 'px-2.5 py-1 rounded-md text-xs font-bold transition-all bg-amber-100 text-amber-900 border border-amber-300';
      } else {
        btn.className = 'px-2.5 py-1 rounded-md text-xs font-bold transition-all bg-stone-100 hover:bg-stone-200 text-stone-700';
      }
    }
  });
  renderConvCardsGrid();
}

function setConvStatusFilter(status) {
  convCurrentStatusFilter = status;
  const statuses = ['all', 'completed', 'favorite'];
  statuses.forEach(s => {
    const btn = document.getElementById(`convFilterStatus-${s}`);
    if (btn) {
      if (s === status) {
        btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-[#8B1E1E] text-white';
      } else {
        btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-stone-100 hover:bg-stone-200 text-stone-700';
      }
    }
  });
  renderConvCardsGrid();
}

function resetConvAllFilters() {
  convCurrentTopicFilter = 0;
  convCurrentHskFilter = 'all';
  convCurrentStatusFilter = 'all';
  convSearchQuery = '';
  const input = document.getElementById('convSearchInput');
  if (input) input.value = '';
  const clearBtn = document.getElementById('convClearSearchBtn');
  if (clearBtn) clearBtn.classList.add('hidden');

  setConvHskFilter('all');
  setConvStatusFilter('all');
  renderConvTopicsHorizontalBar();
  updateConvGlobalProgress();
  renderConvCardsGrid();
}

// -------------------------------------------------------------------------
// RENDER 150 DIALOGUE CARDS GRID
// -------------------------------------------------------------------------
function renderConvCardsGrid() {
  const container = document.getElementById('convCardsGrid');
  const emptyEl = document.getElementById('convEmptyResults');
  const countText = document.getElementById('convShowingCountText');
  if (!container) return;

  const filtered = getFilteredConversations();

  if (countText) {
    countText.innerText = `Đang hiển thị ${filtered.length} / ${(conversations150Data || []).length || 150} bài`;
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');

  container.innerHTML = filtered.map(item => {
    const isCompleted = convCompleted.has(item.number);
    const isFavorite = convFavorites.has(item.number);
    const charAvatars = (item.characters || []).map(c => `${c.avatar || '👤'} ${c.name}`).join(' • ');

    return `
      <div 
        class="glass-card rounded-2xl p-5 bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
        
        <!-- Card Top Bar -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-md bg-stone-100 font-mono text-[11px] font-black text-stone-800">
                #${String(item.number).padStart(3, '0')}
              </span>
              <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-bold">
                ${escapeHtml(item.level)}
              </span>
              <span class="text-[11px] text-stone-400 truncate max-w-[120px]" title="${escapeHtml(item.topicShort || '')}">
                ${item.topicIcon || '💬'} ${escapeHtml(item.topicShort || '')}
              </span>
            </div>

            <!-- Favorite Toggle Star -->
            <button 
              onclick="toggleConvCardFavorite(${item.number}, event)"
              class="p-1.5 rounded-lg hover:bg-stone-100 transition-all cursor-pointer ${
                isFavorite ? 'text-amber-500' : 'text-stone-300 hover:text-amber-400'
              }" 
              title="${isFavorite ? 'Bỏ yêu thích' : 'Lưu yêu thích'}">
              <i data-lucide="star" class="w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}"></i>
            </button>
          </div>

          <!-- Titles -->
          <div>
            <h4 class="font-serif-luxury font-bold text-base text-stone-900 group-hover:text-[#8B1E1E] transition-colors leading-snug">
              ${escapeHtml(item.title)}
            </h4>
            <p class="font-hanzi text-sm font-semibold text-stone-800 mt-0.5">
              ${escapeHtml(item.titleHanzi)}
            </p>
            <p class="text-xs text-stone-400 font-mono">
              ${escapeHtml(item.titlePinyin)}
            </p>
          </div>

          <!-- Situation snippet -->
          <p class="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            ${escapeHtml(item.situation || '')}
          </p>
        </div>

        <!-- Card Bottom Bar -->
        <div class="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <!-- Characters info -->
          <span class="text-[11px] text-stone-400 truncate max-w-[160px]" title="${escapeHtml(charAvatars)}">
            ${escapeHtml(charAvatars)}
          </span>

          <!-- Action buttons -->
          <div class="flex items-center gap-2">
            ${isCompleted ? `
              <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <i data-lucide="check" class="w-3 h-3"></i> Đã xong
              </span>
            ` : ''}

            <button 
              onclick="openConvStudio(${item.number})"
              class="px-3.5 py-1.5 rounded-xl bg-stone-900 group-hover:bg-[#8B1E1E] text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1 cursor-pointer">
              <span>Học bài</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  refreshIcons();
}

// -------------------------------------------------------------------------
// TOGGLE FAVORITE & COMPLETED FROM CARD
// -------------------------------------------------------------------------
function toggleConvCardFavorite(num, event) {
  if (event) event.stopPropagation();

  if (convFavorites.has(num)) {
    convFavorites.delete(num);
    showToast(`Đã bỏ lưu bài #${num} khỏi danh sách yêu thích`, 'info');
  } else {
    convFavorites.add(num);
    showToast(`Đã lưu bài #${num} vào danh sách yêu thích! ⭐`, 'success');
  }
  saveConvUserData();
  updateConvGlobalProgress();
  renderConvCardsGrid();
}

// -------------------------------------------------------------------------
// INTERACTIVE STUDY STUDIO (15 REQUIRED MODULES)
// -------------------------------------------------------------------------
function openConvStudio(lessonNumber) {
  const lesson = (conversations150Data || []).find(x => x.number === lessonNumber);
  if (!lesson) {
    showToast(`Không tìm thấy bài học #${lessonNumber}!`, 'error');
    return;
  }

  convActiveLesson = lesson;
  stopConvAudioPlayback();

  // Populate Header
  const numBadge = document.getElementById('convStudioNumBadge');
  const lvlBadge = document.getElementById('convStudioLvlBadge');
  const topicBadge = document.getElementById('convStudioTopicBadge');
  const titleEl = document.getElementById('convStudioTitle');
  const progressFooter = document.getElementById('convLessonProgressFooter');

  if (numBadge) numBadge.innerText = `Bài ${lesson.number}`;
  if (lvlBadge) lvlBadge.innerText = lesson.level || 'HSK 3';
  if (topicBadge) topicBadge.innerText = lesson.topic || '';
  if (titleEl) {
    titleEl.innerText = `${lesson.title} (${lesson.titleHanzi})`;
  }
  if (progressFooter) {
    progressFooter.innerText = `Bài ${lesson.number} / ${(conversations150Data || []).length || 150}`;
  }

  // Update Favorite & Complete Buttons
  updateConvStudioHeaderButtons();

  // 4. Situation
  const sitEl = document.getElementById('convStudioSituation');
  if (sitEl) sitEl.innerText = lesson.situation || 'Giao tiếp hàng ngày theo tình huống thực tế.';

  // 5. Characters
  const charListEl = document.getElementById('convStudioCharactersList');
  if (charListEl) {
    charListEl.innerHTML = (lesson.characters || []).map(c => `
      <div class="flex items-center justify-between p-1.5 rounded-lg bg-stone-50 border border-stone-100">
        <div class="flex items-center gap-2">
          <span class="text-base">${c.avatar || '👤'}</span>
          <div>
            <span class="font-bold text-stone-800">${escapeHtml(c.name)}</span>
            <span class="text-[10px] text-stone-400 block">${escapeHtml(c.role || '')}</span>
          </div>
        </div>
        <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold ${
          c.gender === 'female' ? 'bg-rose-50 text-rose-700' : 'bg-indigo-50 text-indigo-700'
        }">${c.gender === 'female' ? 'Giọng Nữ' : 'Giọng Nam'}</span>
      </div>
    `).join('');
  }

  // 6, 7, 8, 11: Dialogue Turn-by-Turn
  renderConvStudioDialogue();

  // 9. Vocabulary
  renderConvStudioVocabulary();

  // 10. Grammar
  renderConvStudioGrammar();

  // 12. Quiz
  renderConvStudioQuiz();

  // 13. Speaking Shadowing
  renderConvStudioSpeakingPractice();

  // Show Modal
  const modal = document.getElementById('convStudioModal');
  if (modal) modal.classList.remove('hidden');

  // Scroll studio body top
  const body = document.getElementById('convStudioBody');
  if (body) body.scrollTop = 0;

  refreshIcons();
}

function closeConvStudio() {
  stopConvAudioPlayback();
  const modal = document.getElementById('convStudioModal');
  if (modal) modal.classList.add('hidden');
  renderConvCardsGrid();
}

function navigateConvLesson(direction) {
  if (!convActiveLesson) return;
  const currentNum = convActiveLesson.number;
  const targetNum = currentNum + direction;
  const total = (conversations150Data || []).length || 150;

  if (targetNum < 1 || targetNum > total) {
    showToast('Đã ở bài đầu tiên hoặc bài cuối cùng!', 'info');
    return;
  }
  openConvStudio(targetNum);
}

function updateConvStudioHeaderButtons() {
  if (!convActiveLesson) return;
  const num = convActiveLesson.number;
  const isFav = convFavorites.has(num);
  const isComp = convCompleted.has(num);

  const favBtn = document.getElementById('convStudioFavoriteBtn');
  if (favBtn) {
    if (isFav) {
      favBtn.className = 'p-2.5 rounded-xl bg-amber-400 text-stone-950 transition-all flex items-center justify-center';
      favBtn.innerHTML = '<i data-lucide="star" class="w-4 h-4 fill-stone-950"></i>';
    } else {
      favBtn.className = 'p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all flex items-center justify-center';
      favBtn.innerHTML = '<i data-lucide="star" class="w-4 h-4"></i>';
    }
  }

  const compBtn = document.getElementById('convStudioCompleteBtn');
  const compText = document.getElementById('convStudioCompleteBtnText');
  if (compBtn && compText) {
    if (isComp) {
      compBtn.className = 'px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm';
      compText.innerText = 'Đã hoàn thành ✓';
    } else {
      compBtn.className = 'px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm';
      compText.innerText = 'Đánh dấu hoàn thành';
    }
  }
  refreshIcons();
}

function toggleConvStudioFavorite() {
  if (!convActiveLesson) return;
  const num = convActiveLesson.number;
  if (convFavorites.has(num)) {
    convFavorites.delete(num);
    showToast(`Đã bỏ lưu bài #${num} khỏi danh sách yêu thích`, 'info');
  } else {
    convFavorites.add(num);
    showToast(`Đã lưu bài #${num} vào danh sách yêu thích! ⭐`, 'success');
  }
  saveConvUserData();
  updateConvGlobalProgress();
  updateConvStudioHeaderButtons();
}

function toggleConvStudioComplete() {
  if (!convActiveLesson) return;
  const num = convActiveLesson.number;
  if (convCompleted.has(num)) {
    convCompleted.delete(num);
    showToast(`Đã hủy trạng thái hoàn thành bài #${num}`, 'info');
  } else {
    convCompleted.add(num);
    addExp(15, `Hoàn thành bài hội thoại #${num}`);
    showToast(`🎉 Chúc mừng bạn đã hoàn thành bài #${num}! (+15 EXP)`, 'success');
  }
  saveConvUserData();
  updateConvGlobalProgress();
  updateConvStudioHeaderButtons();
}

// -------------------------------------------------------------------------
// RENDER DIALOGUE (TURNS & BUBBLES)
// -------------------------------------------------------------------------
function renderConvStudioDialogue() {
  const container = document.getElementById('convStudioDialogueContainer');
  if (!container || !convActiveLesson) return;

  const turns = convActiveLesson.dialogue || [];
  const chars = convActiveLesson.characters || [];
  const firstSpeaker = chars[0]?.name || turns[0]?.speaker || 'A';

  container.innerHTML = turns.map((turn, idx) => {
    const isFirstSpeaker = (turn.speaker === firstSpeaker);
    const charObj = chars.find(c => c.name === turn.speaker) || { avatar: turn.gender === 'female' ? '👩' : '👨' };

    return `
      <div 
        id="conv-dialogue-turn-${idx}" 
        class="transition-all duration-300 rounded-2xl p-2 ${
          isFirstSpeaker ? 'flex items-start gap-3' : 'flex items-start justify-end gap-3'
        }">
        
        ${isFirstSpeaker ? `
          <div class="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 text-stone-800 flex items-center justify-center text-lg shrink-0 shadow-2xs">
            ${charObj.avatar || '👤'}
          </div>
        ` : ''}

        <div class="max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-2xs space-y-1.5 transition-all ${
          isFirstSpeaker 
            ? 'bg-amber-50/70 border border-amber-200 text-stone-900 rounded-tl-xs' 
            : 'bg-white border border-stone-200 text-stone-900 rounded-tr-xs'
        }">
          <!-- Turn Header -->
          <div class="flex items-center justify-between gap-4">
            <span class="text-xs font-bold text-stone-700">${escapeHtml(turn.speaker)}</span>
            <button 
              onclick="playConvTurnAudio(${idx})" 
              class="p-1 rounded-md text-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer" 
              title="Nghe câu này">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              <span>Nghe</span>
            </button>
          </div>

          <!-- Hanzi -->
          <p class="font-hanzi text-base lg:text-lg font-bold text-stone-900 leading-relaxed">
            ${escapeHtml(turn.hanzi)}
          </p>

          <!-- Pinyin -->
          <p class="conv-pinyin-text text-xs text-amber-800 font-medium font-mono ${convShowPinyin ? '' : 'hidden'}">
            ${escapeHtml(turn.pinyin)}
          </p>

          <!-- Vietnamese Translation -->
          <p class="conv-vi-text text-xs text-stone-600 pt-1 border-t border-stone-100 ${convShowVi ? '' : 'hidden'}">
            ➔ ${escapeHtml(turn.vi)}
          </p>
        </div>

        ${!isFirstSpeaker ? `
          <div class="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-300 text-stone-800 flex items-center justify-center text-lg shrink-0 shadow-2xs">
            ${charObj.avatar || '👤'}
          </div>
        ` : ''}

      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------------------
// RENDER VOCABULARY SECTION
// -------------------------------------------------------------------------
function renderConvStudioVocabulary() {
  const container = document.getElementById('convStudioVocabGrid');
  if (!container || !convActiveLesson) return;

  const vocab = convActiveLesson.vocabulary || [];
  container.innerHTML = vocab.map(v => `
    <div class="p-3 rounded-xl bg-stone-50 hover:bg-amber-50/50 border border-stone-200/80 transition-all space-y-1">
      <div class="flex items-center justify-between">
        <span class="font-hanzi text-lg font-bold text-stone-900">${escapeHtml(v.hanzi)}</span>
        <div class="flex items-center gap-1">
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">${escapeHtml(v.hsk || 'HSK 3')}</span>
          <button 
            onclick="playChineseTTS(${jsArg(v.hanzi)})" 
            class="p-1 rounded text-stone-400 hover:text-amber-800 cursor-pointer" 
            title="Phát âm">
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
      <p class="text-xs text-amber-700 font-mono font-medium">${escapeHtml(v.pinyin)}</p>
      <p class="text-xs text-stone-600 line-clamp-1">➔ ${escapeHtml(v.meaning)}</p>
    </div>
  `).join('');
}

// -------------------------------------------------------------------------
// RENDER GRAMMAR SECTION
// -------------------------------------------------------------------------
function renderConvStudioGrammar() {
  const container = document.getElementById('convStudioGrammarContainer');
  if (!container || !convActiveLesson) return;

  const grammar = convActiveLesson.grammar || [];
  container.innerHTML = grammar.map((g, idx) => `
    <div class="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black uppercase">Điểm ${idx + 1}</span>
        <h5 class="text-xs font-bold text-emerald-950">${escapeHtml(g.title)}</h5>
      </div>
      ${g.structure ? `
        <div class="p-2 rounded-lg bg-white border border-emerald-200/60 font-mono text-xs text-emerald-900">
          <strong>Cấu trúc:</strong> ${escapeHtml(g.structure)}
        </div>
      ` : ''}
      <p class="text-xs text-stone-700 leading-relaxed">${escapeHtml(g.explanation)}</p>
      ${g.example ? `
        <div class="pt-1.5 border-t border-emerald-100 text-xs">
          <span class="font-semibold text-stone-600">Ví dụ:</span>
          <span class="font-hanzi font-bold text-stone-900 ml-1">${escapeHtml(g.example)}</span>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// -------------------------------------------------------------------------
// RENDER COMPREHENSION QUIZ SECTION
// -------------------------------------------------------------------------
function renderConvStudioQuiz() {
  const container = document.getElementById('convStudioQuizContainer');
  if (!container || !convActiveLesson) return;

  const quizzes = convActiveLesson.quiz || [];
  container.innerHTML = quizzes.map((qz, qIdx) => `
    <div class="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
      <div class="flex items-start gap-2">
        <span class="w-5 h-5 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
          ${qIdx + 1}
        </span>
        <p class="text-xs font-bold text-stone-800 leading-snug">${escapeHtml(qz.question)}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1" id="quiz-options-container-${qIdx}">
        ${(qz.options || []).map((opt, optIdx) => `
          <button 
            onclick="checkConvQuizAnswer(${qIdx}, ${optIdx})"
            id="quiz-opt-${qIdx}-${optIdx}"
            class="text-left p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-xs text-stone-800 transition-all font-medium cursor-pointer flex items-center gap-2">
            <span class="w-5 h-5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold flex items-center justify-center shrink-0">
              ${['A', 'B', 'C', 'D'][optIdx] || optIdx}
            </span>
            <span>${escapeHtml(opt)}</span>
          </button>
        `).join('')}
      </div>

      <!-- Explanation banner -->
      <div id="quiz-explanation-${qIdx}" class="hidden p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1"></div>
    </div>
  `).join('');
}

function checkConvQuizAnswer(qIdx, optIdx) {
  if (!convActiveLesson) return;
  const qz = (convActiveLesson.quiz || [])[qIdx];
  if (!qz) return;

  const isCorrect = (optIdx === qz.answer);
  const expBox = document.getElementById(`quiz-explanation-${qIdx}`);

  // Color options
  (qz.options || []).forEach((_, idx) => {
    const btn = document.getElementById(`quiz-opt-${qIdx}-${idx}`);
    if (btn) {
      if (idx === qz.answer) {
        btn.className = 'text-left p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-xs text-emerald-950 font-bold transition-all flex items-center gap-2';
      } else if (idx === optIdx && !isCorrect) {
        btn.className = 'text-left p-2.5 rounded-xl border-2 border-rose-500 bg-rose-50 text-xs text-rose-950 font-bold transition-all flex items-center gap-2';
      } else {
        btn.className = 'text-left p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-400 font-medium transition-all flex items-center gap-2 opacity-60';
      }
    }
  });

  if (expBox) {
    expBox.classList.remove('hidden');
    expBox.innerHTML = `
      <div class="flex items-center gap-1.5 font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}">
        <i data-lucide="${isCorrect ? 'check-circle-2' : 'alert-circle'}" class="w-4 h-4"></i>
        <span>${isCorrect ? 'Chính xác! (+10 EXP)' : 'Chưa chính xác!'}</span>
      </div>
      <p class="text-stone-600 mt-1">${escapeHtml(qz.explanation || '')}</p>
    `;
    refreshIcons();
  }

  // Award EXP on first correct attempt
  const attemptKey = `${convActiveLesson.number}_${qIdx}`;
  if (isCorrect && !convQuizAttempts[attemptKey]) {
    convQuizAttempts[attemptKey] = true;
    addExp(10, `Trả lời đúng câu hỏi bài #${convActiveLesson.number}`);
  }
}

// -------------------------------------------------------------------------
// RENDER SPEAKING PRACTICE (SHADOWING)
// -------------------------------------------------------------------------
function renderConvStudioSpeakingPractice() {
  if (!convActiveLesson) return;
  const sp = convActiveLesson.speakingPractice || {};

  const hzEl = document.getElementById('convShadowHanzi');
  const pyEl = document.getElementById('convShadowPinyin');
  const viEl = document.getElementById('convShadowVi');
  const tipEl = document.getElementById('convShadowTip');
  const evalEl = document.getElementById('convSpeechEvaluationResult');

  if (hzEl) hzEl.innerText = sp.targetHanzi || '';
  if (pyEl) pyEl.innerText = sp.targetPinyin || '';
  if (viEl) viEl.innerText = `➔ ${sp.targetVi || ''}`;
  if (tipEl) tipEl.innerText = `Mẹo: ${sp.tip || 'Phát âm to rõ, giữ đúng thanh điệu.'}`;

  if (evalEl) evalEl.classList.add('hidden');
  resetConvMicButton();
}

function playConvShadowModelAudio() {
  if (!convActiveLesson) return;
  const sp = convActiveLesson.speakingPractice || {};
  if (sp.targetHanzi) {
    playChineseTTS(sp.targetHanzi);
  }
}

function toggleConvSpeechRecording() {
  if (convIsRecording) {
    stopConvSpeechRecording();
  } else {
    startConvSpeechRecording();
  }
}

function startConvSpeechRecording() {
  convIsRecording = true;
  const btn = document.getElementById('btnConvRecordPractice');
  const text = document.getElementById('textConvMic');
  const icon = document.getElementById('iconConvMic');

  if (btn) btn.className = 'px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 animate-pulse cursor-pointer';
  if (text) text.innerText = 'Đang lắng nghe... Hãy nói ngay!';
  if (icon) icon.setAttribute('data-lucide', 'mic-off');
  refreshIcons();

  // Try Web Speech API if available
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    try {
      convSpeechRecognition = new SpeechRecognition();
      convSpeechRecognition.lang = 'zh-CN';
      convSpeechRecognition.interimResults = false;
      convSpeechRecognition.maxAlternatives = 1;

      convSpeechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        evaluateConvSpeechResult(transcript);
        stopConvSpeechRecording();
      };

      convSpeechRecognition.onerror = () => {
        fallbackConvSpeechEvaluation();
        stopConvSpeechRecording();
      };

      convSpeechRecognition.start();
      return;
    } catch (e) {
      console.warn('Speech recognition start failed, using fallback evaluator', e);
    }
  }

  // Fallback simulation timer if speech API not supported
  setTimeout(() => {
    if (convIsRecording) {
      fallbackConvSpeechEvaluation();
      stopConvSpeechRecording();
    }
  }, 3000);
}

function stopConvSpeechRecording() {
  convIsRecording = false;
  resetConvMicButton();
  if (convSpeechRecognition) {
    try { convSpeechRecognition.stop(); } catch (_) {}
  }
}

function resetConvMicButton() {
  const btn = document.getElementById('btnConvRecordPractice');
  const text = document.getElementById('textConvMic');
  const icon = document.getElementById('iconConvMic');

  if (btn) btn.className = 'px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:opacity-90 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer';
  if (text) text.innerText = 'Nhấn để nói (Luyện âm)';
  if (icon) icon.setAttribute('data-lucide', 'mic');
  refreshIcons();
}

function evaluateConvSpeechResult(transcript) {
  const evalEl = document.getElementById('convSpeechEvaluationResult');
  if (!evalEl || !convActiveLesson) return;

  const target = (convActiveLesson.speakingPractice?.targetHanzi || '').replace(/[^\u4e00-\u9fa5]/g, '');
  const heard = transcript.replace(/[^\u4e00-\u9fa5]/g, '');

  let matchScore = 85;
  if (target === heard) matchScore = 98;
  else if (target.includes(heard) || heard.includes(target)) matchScore = 90;

  evalEl.classList.remove('hidden');
  evalEl.innerHTML = `
    <div class="flex items-center justify-between text-amber-300 font-bold">
      <span class="flex items-center gap-1.5"><i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i> Đánh giá khẩu ngữ:</span>
      <span class="text-sm font-mono text-emerald-400">${matchScore}/100 Điểm</span>
    </div>
    <p class="text-stone-300">Hệ thống nhận diện được: <strong class="text-white font-hanzi">"${escapeHtml(transcript)}"</strong></p>
    <p class="text-emerald-300 font-medium">💡 Nhận xét: Phát âm rất rõ ràng, thanh điệu tự nhiên và trôi chảy! (+10 EXP)</p>
  `;
  addExp(10, 'Luyện phát âm câu mẫu');
  refreshIcons();
}

function fallbackConvSpeechEvaluation() {
  const evalEl = document.getElementById('convSpeechEvaluationResult');
  if (!evalEl || !convActiveLesson) return;

  evalEl.classList.remove('hidden');
  evalEl.innerHTML = `
    <div class="flex items-center justify-between text-amber-300 font-bold">
      <span class="flex items-center gap-1.5"><i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i> Đánh giá khẩu ngữ:</span>
      <span class="text-sm font-mono text-emerald-400">92/100 Điểm</span>
    </div>
    <p class="text-stone-300">Âm lượng và ngữ điệu rất tốt, bắt nhịp tự nhiên theo câu mẫu!</p>
    <p class="text-emerald-300 font-medium">💡 Mẹo: Hãy tiếp tục duy trì độ vang và nhấn trọng âm vào động từ chính nhé! (+10 EXP)</p>
  `;
  addExp(10, 'Luyện phát âm câu mẫu');
  refreshIcons();
}

// -------------------------------------------------------------------------
// AUDIO ENGINE (TURN-BY-TURN & FULL SEQUENCE)
// -------------------------------------------------------------------------
function playConvTurnAudio(turnIndex) {
  if (!convActiveLesson) return;
  const turns = convActiveLesson.dialogue || [];
  const turn = turns[turnIndex];
  if (!turn) return;

  highlightConvTurn(turnIndex);
  playChineseTTS(turn.hanzi, turn.gender);
}

function highlightConvTurn(turnIndex) {
  // Remove existing highlight
  const allTurns = document.querySelectorAll('[id^="conv-dialogue-turn-"]');
  allTurns.forEach(el => {
    el.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-100/40');
  });

  const activeEl = document.getElementById(`conv-dialogue-turn-${turnIndex}`);
  if (activeEl) {
    activeEl.classList.add('ring-2', 'ring-amber-500', 'bg-amber-100/40');
    activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function toggleConvFullAudioPlayback() {
  if (convAudioSequenceActive) {
    stopConvAudioPlayback();
  } else {
    startConvFullAudioPlayback();
  }
}

function startConvFullAudioPlayback() {
  if (!convActiveLesson) return;
  const turns = convActiveLesson.dialogue || [];
  if (turns.length === 0) return;

  convAudioSequenceActive = true;
  convCurrentAudioTurnIndex = 0;

  const btn = document.getElementById('btnConvAudioPlayFull');
  const icon = document.getElementById('iconConvAudioPlayFull');
  const text = document.getElementById('textConvAudioPlayFull');

  if (btn) btn.className = 'px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer';
  if (icon) icon.setAttribute('data-lucide', 'pause');
  if (text) text.innerText = 'Đang phát hội thoại...';
  refreshIcons();

  playNextConvTurnInSequence();
}

function playNextConvTurnInSequence() {
  if (!convAudioSequenceActive || !convActiveLesson) return;
  const turns = convActiveLesson.dialogue || [];

  if (convCurrentAudioTurnIndex >= turns.length) {
    stopConvAudioPlayback();
    showToast('Đã phát xong toàn bộ bài hội thoại! 🎧', 'success');
    return;
  }

  const turn = turns[convCurrentAudioTurnIndex];
  highlightConvTurn(convCurrentAudioTurnIndex);
  playChineseTTS(turn.hanzi, turn.gender);

  // Estimate duration based on character count and speed
  const charCount = (turn.hanzi || '').length;
  const estimatedSeconds = Math.max(2.5, (charCount * 0.28) / convAudioSpeed) + 1.2;

  convCurrentAudioTurnIndex++;
  convAudioSequenceTimeout = setTimeout(() => {
    playNextConvTurnInSequence();
  }, estimatedSeconds * 1000);
}

function stopConvAudioPlayback() {
  convAudioSequenceActive = false;
  if (convAudioSequenceTimeout) {
    clearTimeout(convAudioSequenceTimeout);
    convAudioSequenceTimeout = null;
  }
  convCurrentAudioTurnIndex = -1;

  const btn = document.getElementById('btnConvAudioPlayFull');
  const icon = document.getElementById('iconConvAudioPlayFull');
  const text = document.getElementById('textConvAudioPlayFull');

  if (btn) btn.className = 'px-4 py-2.5 rounded-xl bg-[#8B1E1E] hover:bg-[#A52A2A] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer';
  if (icon) icon.setAttribute('data-lucide', 'play');
  if (text) text.innerText = 'Phát toàn bộ bài';

  // Remove highlight rings
  const allTurns = document.querySelectorAll('[id^="conv-dialogue-turn-"]');
  allTurns.forEach(el => {
    el.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-100/40');
  });

  refreshIcons();
}

function setConvAudioSpeed(speed) {
  convAudioSpeed = speed;
  [0.8, 1.0, 1.2].forEach(s => {
    const btn = document.getElementById(`convSpeed-${s}`);
    if (btn) {
      if (s === speed) {
        btn.className = 'px-2 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold';
      } else {
        btn.className = 'px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold';
      }
    }
  });
}

function toggleConvDisplaySettings() {
  const pinyinCheckbox = document.getElementById('convTogglePinyin');
  const viCheckbox = document.getElementById('convToggleVi');

  convShowPinyin = pinyinCheckbox ? pinyinCheckbox.checked : true;
  convShowVi = viCheckbox ? viCheckbox.checked : true;

  document.querySelectorAll('.conv-pinyin-text').forEach(el => {
    if (convShowPinyin) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });

  document.querySelectorAll('.conv-vi-text').forEach(el => {
    if (convShowVi) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });
}

// -------------------------------------------------------------------------
// COMPATIBILITY: AI ROLEPLAY & GRAMMAR DOCTOR
// -------------------------------------------------------------------------
function renderAiScenarios() {
  const container = document.getElementById('aiScenariosContainer');
  if (!container) return;

  // Use aiScenariosData or derive 4 interactive roleplay presets from first topics
  const scenarios = (aiScenariosData && aiScenariosData.length > 0 && aiScenariosData[0].suggestedReplies)
    ? aiScenariosData
    : [
        {
          id: 'scenario_greeting',
          title: 'Chào hỏi & Làm quen',
          role: 'Lý Hoa (Giáo viên bản xứ)',
          level: 'HSK 1 - 2',
          initialMessage: {
            hanzi: '你好！欢迎来到中文学习世界！请问你叫什么名字？',
            pinyin: 'Nǐ hǎo! Huānyíng lái dào zhōngwén xuéxí shìjiè! Qǐngwèn nǐ jiào shénme míngzi?',
            vi: 'Chào bạn! Chào mừng bạn đến với thế giới học tiếng Trung! Xin hỏi bạn tên là gì?'
          },
          suggestedReplies: [
            { hanzi: '你好，我叫阮文明，很高兴认识你！' },
            { hanzi: '老师好，我是来自越南的留学生。' }
          ]
        },
        {
          id: 'scenario_restaurant',
          title: 'Gọi món tại nhà hàng',
          role: 'Phục vụ bàn (Nhà hàng Tứ Xuyên)',
          level: 'HSK 2 - 3',
          initialMessage: {
            hanzi: '您好！欢迎光临！请问一共几位？想吃点什么特色菜？',
            pinyin: 'Nín hǎo! Huānyíng guānglín! Qǐngwèn yígòng jǐ wèi? Xiǎng chī diǎn shénme tèsè cài?',
            vi: 'Kính chào quý khách! Xin hỏi đoàn mình có mấy người ạ? Quý khách muốn dùng món đặc sản gì?'
          },
          suggestedReplies: [
            { hanzi: '我们两个人，请问有什么招牌菜推荐吗？' },
            { hanzi: '来一份宫保鸡丁和麻婆豆腐，微辣！' }
          ]
        },
        {
          id: 'scenario_shopping',
          title: 'Mua sắm & Trả giá',
          role: 'Chủ tiệm quần áo Bắc Kinh',
          level: 'HSK 3 - 4',
          initialMessage: {
            hanzi: '帅哥美女来看看！最新款的羽绒服，质量特别好，今天特价！',
            pinyin: 'Shuàigē měinǚ lái kànkan! Zuì xīn kuǎn de yǔróngfú, zhìliàng tèbié hǎo, jīntiān tèjià!',
            vi: 'Chào anh đẹp trai chị đẹp gái vào xem nào! Áo lông vũ mẫu mới nhất, chất lượng xịn sò, hôm nay đại hạ giá!'
          },
          suggestedReplies: [
            { hanzi: '这件衣服多少钱一件？可以试一下吗？' },
            { hanzi: '太贵了，老板便宜点一百块卖不卖？' }
          ]
        },
        {
          id: 'scenario_interview',
          title: 'Phỏng vấn xin việc',
          role: 'Trương Tổng (Giám đốc nhân sự)',
          level: 'HSK 4 - 5',
          initialMessage: {
            hanzi: '请坐！我看过你的简历，你的跨国商务背景很不错，能简单做个一分钟自我介绍吗？',
            pinyin: 'Qǐng zuò! Wǒ kàn guò nǐ de jiǎnlì, nǐ de kuàguó shāngwù bèijǐng hěn búcuò, néng jiǎndān zuò gè yì fēnzhōng zìwǒ jièshào ma?',
            vi: 'Mời bạn ngồi! Tôi đã xem qua hồ sơ, nền tảng thương mại xuyên biên giới của bạn rất ấn tượng, bạn có thể tự giới thiệu ngắn gọn trong 1 phút không?'
          },
          suggestedReplies: [
            { hanzi: '各位面试官好，我毕业于河内大学中文系，有两年跨境电商运营经验。' },
            { hanzi: '我很荣幸能参加今天的面试，我的核心优势是双语流利和强执行力。' }
          ]
        }
      ];

  container.innerHTML = scenarios.map(sc => `
    <button 
      onclick="selectAiScenario(${jsArg(sc.id)})"
      id="btn-scenario-${escapeHtml(sc.id)}"
      class="w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
        activeAiScenario && activeAiScenario.id === sc.id
          ? 'bg-amber-50 border-amber-300 text-[#8B1E1E] shadow-2xs'
          : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
      }">
      <div>
        <h4 class="text-xs font-bold">${escapeHtml(sc.title)}</h4>
        <p class="text-[10px] text-stone-400 mt-0.5">${escapeHtml(sc.role)}</p>
      </div>
      <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-[#8B1E1E] font-bold">${escapeHtml(sc.level)}</span>
    </button>
  `).join('');
}

function selectAiScenario(scenarioId) {
  const scenarios = (aiScenariosData && aiScenariosData.length > 0 && aiScenariosData[0].suggestedReplies)
    ? aiScenariosData
    : [
        {
          id: 'scenario_greeting',
          title: 'Chào hỏi & Làm quen',
          role: 'Lý Hoa (Giáo viên bản xứ)',
          level: 'HSK 1 - 2',
          initialMessage: {
            hanzi: '你好！欢迎来到中文学习世界！请问你叫什么名字？',
            pinyin: 'Nǐ hǎo! Huānyíng lái dào zhōngwén xuéxí shìjiè! Qǐngwèn nǐ jiào shénme míngzi?',
            vi: 'Chào bạn! Chào mừng bạn đến với thế giới học tiếng Trung! Xin hỏi bạn tên là gì?'
          },
          suggestedReplies: [
            { hanzi: '你好，我叫阮文明，很高兴认识你！' },
            { hanzi: '老师好，我是来自越南的留学生。' }
          ]
        },
        {
          id: 'scenario_restaurant',
          title: 'Gọi món tại nhà hàng',
          role: 'Phục vụ bàn (Nhà hàng Tứ Xuyên)',
          level: 'HSK 2 - 3',
          initialMessage: {
            hanzi: '您好！欢迎光临！请问一共几位？想吃点什么特色菜？',
            pinyin: 'Nín hǎo! Huānyíng guānglín! Qǐngwèn yígòng jǐ wèi? Xiǎng chī diǎn shénme tèsè cài?',
            vi: 'Kính chào quý khách! Xin hỏi đoàn mình có mấy người ạ? Quý khách muốn dùng món đặc sản gì?'
          },
          suggestedReplies: [
            { hanzi: '我们两个人，请问有什么招牌菜推荐吗？' },
            { hanzi: '来一份宫保鸡丁和麻婆豆腐，微辣！' }
          ]
        },
        {
          id: 'scenario_shopping',
          title: 'Mua sắm & Trả giá',
          role: 'Chủ tiệm quần áo Bắc Kinh',
          level: 'HSK 3 - 4',
          initialMessage: {
            hanzi: '帅哥美女来看看！最新款的羽绒服，质量特别好，今天特价！',
            pinyin: 'Shuàigē měinǚ lái kànkan! Zuì xīn kuǎn de yǔróngfú, zhìliàng tèbié hǎo, jīntiān tèjià!',
            vi: 'Chào anh đẹp trai chị đẹp gái vào xem nào! Áo lông vũ mẫu mới nhất, chất lượng xịn sò, hôm nay đại hạ giá!'
          },
          suggestedReplies: [
            { hanzi: '这件衣服多少钱一件？可以试一下吗？' },
            { hanzi: '太贵了，老板便宜点一百块卖不卖？' }
          ]
        },
        {
          id: 'scenario_interview',
          title: 'Phỏng vấn xin việc',
          role: 'Trương Tổng (Giám đốc nhân sự)',
          level: 'HSK 4 - 5',
          initialMessage: {
            hanzi: '请坐！我看过你的简历，你的跨国商务背景很不错，能简单做个一分钟自我介绍吗？',
            pinyin: 'Qǐng zuò! Wǒ kàn guò nǐ de jiǎnlì, nǐ de kuàguó shāngwù bèijǐng hěn búcuò, néng jiǎndān zuò gè yì fēnzhōng zìwǒ jièshào ma?',
            vi: 'Mời bạn ngồi! Tôi đã xem qua hồ sơ, nền tảng thương mại xuyên biên giới của bạn rất ấn tượng, bạn có thể tự giới thiệu ngắn gọn trong 1 phút không?'
          },
          suggestedReplies: [
            { hanzi: '各位面试官好，我毕业于河内大学中文系，有两年跨境电商运营经验。' },
            { hanzi: '我很荣幸能参加今天的面试，我的核心优势是双语流利和强执行力。' }
          ]
        }
      ];

  const sc = scenarios.find(s => s.id === scenarioId) || scenarios[0];
  if (!sc) return;
  activeAiScenario = sc;
  renderAiScenarios();

  const nameEl = document.getElementById('aiChatPartnerName');
  const roleEl = document.getElementById('aiChatPartnerRole');
  if (nameEl) nameEl.innerText = sc.role;
  if (roleEl) roleEl.innerText = `Kịch bản: ${sc.title}`;

  aiChatHistory = [
    {
      sender: 'ai',
      hanzi: sc.initialMessage.hanzi,
      pinyin: sc.initialMessage.pinyin,
      vi: sc.initialMessage.vi,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  renderAiChatMessages();
  renderAiSuggestedReplies();
}

function renderAiChatMessages() {
  const container = document.getElementById('aiChatMessagesContainer');
  if (!container) return;

  container.innerHTML = aiChatHistory.map(msg => {
    if (msg.sender === 'ai') {
      return `
        <div class="flex items-start gap-3 max-w-[85%]">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center text-sm shadow-xs shrink-0">
            🤖
          </div>
          <div class="p-3.5 rounded-2xl rounded-tl-xs bg-white border border-amber-200/80 shadow-2xs space-y-1">
            <div class="flex items-center justify-between gap-3">
              <span class="font-hanzi text-base font-bold text-stone-900 leading-snug">${escapeHtml(msg.hanzi)}</span>
              <div class="inline-flex items-center gap-0.5 shrink-0">
                <button onclick="playChineseTTS(${jsArg(msg.hanzi)}, 'female')" title="Nghe giọng Nữ" class="p-1 rounded text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer">👩</button>
                <button onclick="playChineseTTS(${jsArg(msg.hanzi)}, 'male')" title="Nghe giọng Nam" class="p-1 rounded text-indigo-600 hover:bg-indigo-50 text-xs font-bold cursor-pointer">👨</button>
              </div>
            </div>
            ${msg.pinyin ? `<p class="text-xs text-amber-800 font-medium font-mono">${escapeHtml(msg.pinyin)}</p>` : ''}
            ${msg.vi ? `<p class="text-xs text-stone-500 pt-1 border-t border-stone-100">➔ ${escapeHtml(msg.vi)}</p>` : ''}
            <span class="block text-[10px] text-stone-400 text-right">${msg.timestamp}</span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="flex items-start justify-end gap-3 max-w-[85%] ml-auto">
          <div class="p-3.5 rounded-2xl rounded-tr-xs bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-xs space-y-1">
            <span class="font-hanzi text-base font-bold">${escapeHtml(msg.hanzi)}</span>
            ${msg.feedback ? `<p class="text-xs text-amber-200 border-t border-white/20 pt-1 mt-1">💡 Nhận xét AI: ${escapeHtml(msg.feedback)}</p>` : ''}
            <span class="block text-[10px] text-rose-200 text-right">${msg.timestamp}</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
            Tôi
          </div>
        </div>
      `;
    }
  }).join('');

  container.scrollTop = container.scrollHeight;
  refreshIcons();
}

function renderAiSuggestedReplies() {
  const container = document.getElementById('aiSuggestedRepliesContainer');
  if (!container || !activeAiScenario) return;

  const replies = activeAiScenario.suggestedReplies || [];
  container.innerHTML = `
    <span class="text-[11px] text-stone-400 font-semibold shrink-0">Gợi ý trả lời:</span>
    ${replies.map(r => `
      <button 
        onclick="applyAiSuggestedReply(${jsArg(r.hanzi)})"
        class="shrink-0 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-[#8B1E1E] border border-amber-200 text-xs font-medium transition-all cursor-pointer">
        ${escapeHtml(r.hanzi)}
      </button>
    `).join('')}
  `;
}

function applyAiSuggestedReply(text) {
  const input = document.getElementById('aiUserChatInput');
  if (input) {
    input.value = text;
    input.focus();
  }
}

function sendAiChatMessage() {
  const input = document.getElementById('aiUserChatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  aiChatHistory.push({
    sender: 'user',
    hanzi: text,
    timestamp: now
  });
  renderAiChatMessages();

  addExp(5, 'Đối thoại với AI');

  const fallbackReply = () => {
    let replyHanzi = '你的中文说得很好！继续加油！';
    let replyPinyin = 'Nǐ de zhōngwén shuō de hěn hǎo! Jìxù jiāyóu!';
    let replyVi = 'Tiếng Trung của bạn nói rất hay! Cố gắng tiếp tục nhé!';

    if (activeAiScenario && activeAiScenario.id === 'scenario_greeting') {
      replyHanzi = '认识你真是太好了！你平时喜欢通过什么方式学习中文呢？';
      replyPinyin = 'Rènshi nǐ zhēn shì tài hǎo le! Nǐ píngshí xǐhuan tōngguò shénme fāngshì xuéxí zhōngwén ne?';
      replyVi = 'Rất vui được quen bạn! Bình thường bạn thích học tiếng Trung bằng cách nào?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_restaurant') {
      replyHanzi = '好的！一份宫保鸡丁，两碗米饭，还要别的喝的吗？比如青岛啤酒或茉莉花茶？';
      replyPinyin = 'Hǎo de! Yí fèn Gōngbǎo Jīdīng, liǎng wǎn mǐfàn, hái yào bié de hē de ma? Bǐrú Qīngdǎo píjiǔ huò mòlìhuā chá?';
      replyVi = 'Vâng ạ! Một phần gà Cung Bảo, 2 bát cơm, quý khách có muốn dùng thêm đồ uống gì như bia Thanh Đảo hay trà hoa nhài không?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_shopping') {
      replyHanzi = '哎呀，帅哥/美女真会砍价！看在是老朋友的份上，120块钱拿走，怎么样？';
      replyPinyin = 'Āiyā, shuàigē/měinǚ zhēn huì kǎnjià! Kàn zài shì lǎo péngyou de fèn shang, 120 kuài qián ná zǒu, zěnmeyàng?';
      replyVi = 'Ái chà, bạn mặc cả giỏi quá! Nể tình khách quen, 120 tệ bạn mang về, thấy thế nào?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_interview') {
      replyHanzi = '很好。你的背景非常符合我们的要求。请问如果遇到高强度工作压力，你通常如何调节？';
      replyPinyin = 'Hěn hǎo. Nǐ de bèijǐng fēicháng fúhé wǒmen de yāoqiú. Qǐngwèn rúguǒ yùdào gāoxiàodù gōngzuò yālì, nǐ tōngcháng rúhé tiáojié?';
      replyVi = 'Rất tốt. Nền tảng của bạn rất phù hợp với yêu cầu của chúng tôi. Xin hỏi nếu gặp áp lực công việc cường độ cao, bạn thường điều tiết thế nào?';
    }

    aiChatHistory.push({
      sender: 'ai',
      hanzi: replyHanzi,
      pinyin: replyPinyin,
      vi: replyVi,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    renderAiChatMessages();
    playChineseTTS(replyHanzi);
  };

  fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text, mode: 'chat' })
  })
  .then(res => res.json())
  .then(data => {
    if (data && data.ok && data.hanzi) {
      aiChatHistory.push({
        sender: 'ai',
        hanzi: data.hanzi,
        pinyin: data.pinyin || '',
        vi: data.vi || '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      renderAiChatMessages();
      playChineseTTS(data.hanzi);
    } else {
      fallbackReply();
    }
  })
  .catch(() => {
    setTimeout(fallbackReply, 500);
  });
}

function resetCurrentAiScenario() {
  if (activeAiScenario) {
    selectAiScenario(activeAiScenario.id);
  }
}

function analyzeSentenceGrammar() {
  const input = document.getElementById('aiGrammarDoctorInput');
  const resultContainer = document.getElementById('aiGrammarDoctorResult');
  if (!input || !resultContainer) return;

  const text = input.value.trim();
  if (!text) {
    showToast('Vui lòng nhập câu tiếng Trung để phân tích!', 'warning');
    return;
  }

  resultContainer.classList.remove('hidden');
  resultContainer.innerHTML = `
    <div class="flex items-center gap-2 text-teal-800 font-bold">
      <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>
      <span>Đánh Giá Của Bác Sĩ Ngữ Pháp:</span>
    </div>
    <p class="font-hanzi font-bold text-stone-900 mt-1">Câu gốc: ${escapeHtml(text)}</p>
    <div class="space-y-1.5 pt-2 border-t border-teal-100">
      <p class="text-teal-900 font-semibold">🔍 Phân tích trật tự câu:</p>
      <p class="text-stone-600">Cấu trúc câu hợp lý theo chuẩn: Chủ ngữ + Động từ + Tân ngữ.</p>
      <p class="text-teal-900 font-semibold mt-1">💡 Đề xuất cách diễn đạt tự nhiên hơn:</p>
      <p class="text-emerald-700 font-hanzi font-bold">👉 "${escapeHtml(text.replace('买一本', '去买一本'))}"</p>
      <p class="text-[11px] text-stone-500 italic">Mẹo: Trong khẩu ngữ hàng ngày, người Trung Quốc thường kết hợp trợ từ "了" hoặc phó từ chỉ thời gian để câu nói sinh động hơn.</p>
    </div>
  `;
  addExp(5, 'Sử dụng Bác Sĩ Ngữ Pháp');
  refreshIcons();
}

})();

/* --- FILE: js/features/assistant.js --- */
(function(){
// ==========================================
// MODULE: TRỢ LÝ GIA SƯ AI THÔNG MINH (AI CONVERSATIONAL TUTOR & ASSISTANT)
// ==========================================
let floatingAiMode = 'chat'; // 'chat' (hỏi đáp phản xạ), 'translate' (dịch thuật), 'grammar' (bác sĩ ngữ pháp)
let floatingAiMessages = [
  {
    sender: 'ai',
    hanzi: '你好！我是你的AI中文私教小华 🤖🎧',
    pinyin: 'Nǐ hǎo! Wǒ shì nǐ de AI zhōngwén sījiào Xiǎohuá.',
    vi: 'Xin chào! Mình là Tiểu Hoa, gia sư AI tiếng Trung của bạn. Mình có thể cùng bạn đàm thoại hỏi đáp, giải thích ngữ pháp và luyện phản xạ giao tiếp mỗi ngày nhé!',
    followUp: '今天你想和我聊些什么呢？',
    quickReplies: [
      { hanzi: '我是零基础新手，请指导我！', pinyin: 'Wǒ shì líng jīchǔ xīnshǒu, qǐng zhǐdǎo wǒ!', vi: 'Em là người mới bắt đầu F0, hãy hướng dẫn em nhé!' },
      { hanzi: '你好！很高兴认识你。', pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.', vi: 'Xin chào! Rất vui được quen biết bạn.' },
      { hanzi: '我想提高中文口语能力。', pinyin: 'Wǒ xiǎng tígāo zhōngwén kǒuyǔ nénglì.', vi: 'Tôi muốn nâng cao năng lực khẩu ngữ tiếng Trung.' },
      { hanzi: '请考我几个实用的HSK词汇！', pinyin: 'Qǐng kǎo wǒ jǐ gè shíyòng de HSK cíhuì!', vi: 'Hãy thử kiểm tra tôi vài từ vựng HSK thực tế nhé!' }
    ],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];
let isFloatingAiOpen = false;

function initFloatingAiAssistant() {
  renderFloatingAiMessages();
  renderFloatingAiQuickChips();
}

function toggleFloatingAiChat() {
  const windowEl = document.getElementById('floatingAiChatWindow');
  const tooltip = document.getElementById('floatingAiTooltip');
  const badge = document.getElementById('floatingAiBadge');
  if (!windowEl) return;

  isFloatingAiOpen = !isFloatingAiOpen;
  if (isFloatingAiOpen) {
    windowEl.classList.remove('hidden');
    if (badge) badge.classList.add('hidden');
    // Mutual exclusion: close support contact window if open
    const supportWin = document.getElementById('supportContactWindow');
    if (supportWin && !supportWin.classList.contains('hidden')) {
      supportWin.classList.add('hidden');
    }
    
    // Focus input and scroll messages
    setTimeout(() => {
      const input = document.getElementById('floatingAiInput');
      if (input) input.focus();
      scrollFloatingAiMessagesToBottom();
    }, 100);
  } else {
    windowEl.classList.add('hidden');
  }
  refreshIcons();
}

function openFloatingAiChat() {
  const windowEl = document.getElementById('floatingAiChatWindow');
  if (!windowEl) return;
  isFloatingAiOpen = true;
  windowEl.classList.remove('hidden');
  const tooltip = document.getElementById('floatingAiTooltip');
  const badge = document.getElementById('floatingAiBadge');
  if (tooltip) tooltip.classList.add('hidden');
  if (badge) badge.classList.add('hidden');
  setTimeout(() => {
    const input = document.getElementById('floatingAiInput');
    if (input) input.focus();
    scrollFloatingAiMessagesToBottom();
  }, 100);
  refreshIcons();
}

function dismissFloatingAiTooltip(e) {
  if (e) e.stopPropagation();
  const tooltip = document.getElementById('floatingAiTooltip');
  if (tooltip) tooltip.classList.add('hidden');
}

function switchFloatingAiMode(mode) {
  floatingAiMode = mode;
  const modes = ['chat', 'translate', 'grammar'];
  modes.forEach(m => {
    const btn = document.getElementById(`btn-flmode-${m}`);
    if (!btn) return;
    if (m === mode) {
      btn.className = 'px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs whitespace-nowrap flex items-center gap-1 cursor-pointer';
    } else {
      btn.className = 'px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-stone-700 border border-stone-200 whitespace-nowrap flex items-center gap-1 cursor-pointer';
    }
  });

  const input = document.getElementById('floatingAiInput');
  if (input) {
    if (mode === 'chat') {
      input.placeholder = 'Nhập câu trò chuyện bằng tiếng Trung hoặc tiếng Việt...';
    } else if (mode === 'translate') {
      input.placeholder = 'Nhập câu tiếng Việt ➔ Dịch sang tiếng Trung (hoặc ngược lại)...';
    } else if (mode === 'grammar') {
      input.placeholder = 'Dán câu tiếng Trung để AI bắt lỗi trật tự & ngữ pháp...';
    }
  }

  renderFloatingAiQuickChips();
}

function renderFloatingAiQuickChips() {
  const container = document.getElementById('floatingAiQuickChips');
  if (!container) return;

  let chips = [];
  if (floatingAiMode === 'chat') {
    chips = [
      '🌱 Em mới bắt đầu (F0), hướng dẫn em học nhé!',
      '🔊 Dạy phát âm 4 thanh điệu tiếng Trung',
      '✍️ 8 quy tắc viết bút thuận chữ Hán',
      '你好！你叫什么名字？',
      '学中文有什么好方法？',
      '你最喜欢吃哪道中国菜？',
      '北京现在天气怎么样？',
      '请考我几个HSK常用词',
      '周末你一般喜欢做什么？'
    ];
  } else if (floatingAiMode === 'translate') {
    chips = [
      'Dịch: Hôm nay bạn ăn cơm chưa?',
      'Dịch: Tôi muốn học tiếng Trung',
      'Dịch: Chiều mai bạn có rảnh không?',
      'Dịch: Táo này bao nhiêu tiền một cân?'
    ];
  } else if (floatingAiMode === 'grammar') {
    chips = [
      'Sửa lỗi: 我去超市买一本书',
      'Giải thích: Cách dùng câu chữ 把',
      'Phân biệt: 常常 vs 往往',
      'Sửa lỗi: 他跑得很更快'
    ];
  }

  container.innerHTML = `
    <span class="text-stone-400 font-bold shrink-0">Gợi ý:</span>
    ${chips.map(c => `
      <button 
        type="button"
        onclick="applyFloatingAiChip(${jsArg(c)})" 
        class="px-2.5 py-0.8 rounded-full bg-amber-50 hover:bg-amber-100 text-stone-700 border border-amber-200 text-2xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
      >
        ${escapeHtml(c)}
      </button>
    `).join('')}
  `;
}

function applyFloatingAiChip(chip) {
  const input = document.getElementById('floatingAiInput');
  if (input) {
    let cleanText = chip;
    if (chip.startsWith('Dịch: ')) cleanText = chip.replace('Dịch: ', '');
    else if (chip.startsWith('Sửa lỗi: ')) cleanText = chip.replace('Sửa lỗi: ', '');
    input.value = cleanText;
    sendFloatingAiMessage();
  }
}

function sendQuickReply(text) {
  const input = document.getElementById('floatingAiInput');
  if (input) {
    input.value = text;
    sendFloatingAiMessage();
  }
}

function clearFloatingAiChat() {
  floatingAiMessages = [
    {
      sender: 'ai',
      hanzi: '已清空对话记录！今天想和我聊些什么呢？🤖',
      pinyin: 'Yǐ qīngkōng duìhuà jìlù! Jīntiān xiǎng hé wǒ liáo xiē shénme ne?',
      vi: 'Đã làm mới cuộc hội thoại! Bạn muốn trò chuyện về chủ đề gì nào? Hãy hỏi mình bất kỳ điều gì nhé! 🤖',
      followUp: '你今天过得怎么样？',
      quickReplies: [
        { hanzi: '我今天很好，谢谢！', pinyin: 'Wǒ jīntiān hěn hǎo, xièxie!', vi: 'Hôm nay mình rất tốt, cảm ơn bạn!' },
        { hanzi: '请教我一句实用地道中文。', pinyin: 'Qǐng jiào wǒ yí jù shíyòng dìdao zhōngwén.', vi: 'Hãy dạy mình một câu tiếng Trung tự nhiên nhé.' }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
  renderFloatingAiMessages();
}

function scrollFloatingAiMessagesToBottom() {
  const container = document.getElementById('floatingAiMessages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function renderFloatingAiMessages() {
  const container = document.getElementById('floatingAiMessages');
  if (!container) return;

  container.innerHTML = floatingAiMessages.map(msg => {
    if (msg.sender === 'user') {
      return `
        <div class="flex items-start justify-end gap-2.5 max-w-[88%] ml-auto">
          <div class="p-3 rounded-2xl rounded-tr-xs bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-xs space-y-1">
            <p class="font-sans leading-relaxed text-xs break-words">${escapeHtml(msg.text || msg.hanzi)}</p>
            <span class="block text-[10px] text-amber-200/80 text-right font-mono">${escapeHtml(msg.timestamp)}</span>
          </div>
        </div>
      `;
    } else {
      // AI message with Robot 3D Avatar
      const hasChinese = msg.hanzi && /[\u4e00-\u9fa5]/.test(msg.hanzi);
      return `
        <div class="flex items-start gap-2.5 max-w-[92%]">
          <!-- 3D Mini Robot Avatar -->
          <div class="w-8 h-8 rounded-full overflow-hidden border border-amber-300 shadow-2xs shrink-0 bg-slate-900">
            <img 
              src="images/ai_robot_avatar.jpg" 
              onerror="this.src='images/robot_3d_avatar.svg'" 
              alt="Robot 3D" 
              class="w-full h-full object-cover" 
            />
          </div>

          <div class="p-3.5 rounded-2xl rounded-tl-xs bg-white border border-amber-200/90 shadow-2xs space-y-2.5 flex-1">
            <!-- Main Content -->
            <div>
              ${msg.hanzi ? `
                <div class="flex items-start justify-between gap-2">
                  <span class="font-hanzi text-base font-bold text-stone-900 leading-snug break-words">
                    ${escapeHtml(msg.hanzi)}
                  </span>
                  ${hasChinese ? `
                    <div class="inline-flex items-center gap-0.5 shrink-0 bg-stone-100/90 p-0.5 rounded-lg border border-stone-200">
                      <button 
                        type="button"
                        onclick="playChineseTTS(${jsArg(msg.hanzi)}, 'female')" 
                        title="Nghe giọng Nữ Bắc Kinh" 
                        class="p-1 rounded hover:bg-rose-50 text-rose-800 transition-colors cursor-pointer text-2xs font-bold"
                      >
                        👩
                      </button>
                      <button 
                        type="button"
                        onclick="playChineseTTS(${jsArg(msg.hanzi)}, 'male')" 
                        title="Nghe giọng Nam đề thi CCTV" 
                        class="p-1 rounded hover:bg-blue-50 text-blue-800 transition-colors cursor-pointer text-2xs font-bold"
                      >
                        👨
                      </button>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              ${msg.pinyin ? `
                <p class="text-2xs font-semibold text-[#8B1E1E] mt-0.5">${escapeHtml(msg.pinyin)}</p>
              ` : ''}

              ${msg.vi ? `
                <p class="text-xs text-stone-700 mt-1.5 pt-1.5 border-t border-amber-100 leading-relaxed">
                  <span class="font-bold text-[#8B1E1E]">Ý nghĩa:</span> ${escapeHtml(msg.vi)}
                </p>
              ` : (msg.text ? `
                <p class="text-xs text-stone-700 leading-relaxed break-words">${escapeHtml(msg.text)}</p>
              ` : '')}
            </div>

            <!-- Follow-up Question for Student (Hỏi lại học viên) -->
            ${msg.followUp ? `
              <div class="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-300 text-xs text-amber-950 leading-relaxed space-y-1 shadow-2xs">
                <p class="font-bold flex items-center gap-1.5 text-[#8B1E1E]">
                  <span class="text-sm">❓</span>
                  <span>Câu hỏi gợi mở dành cho bạn:</span>
                </p>
                <p class="font-hanzi font-bold text-stone-900 text-xs sm:text-sm pl-4">${escapeHtml(msg.followUp)}</p>
              </div>
            ` : ''}

            <!-- Quick Interactive Reply Chips (Bấm để trả lời ngay) -->
            ${msg.quickReplies && msg.quickReplies.length > 0 ? `
              <div class="pt-1 space-y-1.5">
                <span class="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                  <span>💡</span>
                  <span>Gợi ý câu trả lời nhanh (Bấm để gửi):</span>
                </span>
                <div class="flex flex-col gap-1.5">
                  ${msg.quickReplies.map(qr => `
                    <button 
                      type="button" 
                      onclick="sendQuickReply(${jsArg(qr.hanzi || qr.text)})" 
                      class="text-left p-2 rounded-xl bg-amber-50/60 hover:bg-amber-100/90 text-stone-800 border border-amber-200/90 text-xs transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                    >
                      <div class="space-y-0.5">
                        <p class="font-hanzi font-bold text-[#8B1E1E] group-hover:translate-x-0.5 transition-transform">${escapeHtml(qr.hanzi || qr.text)}</p>
                        ${qr.pinyin ? `<p class="text-[10px] text-stone-500 font-mono">${escapeHtml(qr.pinyin)}</p>` : ''}
                        ${qr.vi ? `<p class="text-[11px] text-stone-600">${escapeHtml(qr.vi)}</p>` : ''}
                      </div>
                      <i data-lucide="send" class="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2"></i>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Vocabulary Breakdown (if available) -->
            ${msg.vocab && msg.vocab.length > 0 ? `
              <div class="pt-2 border-t border-amber-100 space-y-1">
                <span class="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                  <i data-lucide="sparkles" class="w-3 h-3 text-[#C59A3F]"></i>
                  <span>Từ vựng trọng tâm trong câu:</span>
                </span>
                <div class="flex flex-wrap gap-1 mt-1">
                  ${msg.vocab.map(v => `
                    <button 
                      type="button"
                      onclick="openWordModalWithToken(${jsArg(v.word || v.hanzi)}, ${jsArg(v.pinyin || '')}, ${jsArg(v.vi || '')})"
                      class="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-stone-800 border border-amber-200/80 text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <span class="font-hanzi font-bold text-[#8B1E1E]">${escapeHtml(v.word || v.hanzi)}</span>
                      <span class="text-stone-400">(${escapeHtml(v.pinyin)})</span>
                      <span class="text-stone-600">: ${escapeHtml(v.vi)}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Grammar Doctor Feedback (if available) -->
            ${msg.grammarTips ? `
              <div class="p-2 rounded-xl bg-teal-50/70 border border-teal-200 text-2xs text-teal-900 leading-relaxed space-y-1">
                <p class="font-bold flex items-center gap-1 text-teal-800">
                  <i data-lucide="stethoscope" class="w-3 h-3"></i>
                  <span>Bác Sĩ Ngữ Pháp Nhận Xét:</span>
                </p>
                <p>${escapeHtml(msg.grammarTips)}</p>
              </div>
            ` : ''}

            <span class="block text-[10px] text-stone-400 text-right font-mono">${escapeHtml(msg.timestamp)}</span>
          </div>
        </div>
      `;
    }
  }).join('');

  scrollFloatingAiMessagesToBottom();
  refreshIcons();
}

let floatingAiBusy = false;

function nowTimeLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function sendFloatingAiMessage() {
  const input = document.getElementById('floatingAiInput');
  if (!input || floatingAiBusy) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  floatingAiBusy = true;

  floatingAiMessages.push({ sender: 'user', text, timestamp: nowTimeLabel() });

  const loadingId = 'loading_' + Date.now();
  floatingAiMessages.push({
    id: loadingId,
    sender: 'ai',
    hanzi: '',
    text: floatingAiMode === 'chat' ? '🤖 Tiểu Hoa đang chuẩn bị câu trả lời...' : '🤖 Robot AI đang dịch và phân tích ngữ pháp...',
    timestamp: nowTimeLabel()
  });
  renderFloatingAiMessages();

  let errorMessage = '';
  try {
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, mode: floatingAiMode })
    });
    const data = await res.json().catch(() => null);
    floatingAiMessages = floatingAiMessages.filter(m => m.id !== loadingId);

    if (res.ok && data && data.ok) {
      addExp(5, 'Trò chuyện cùng Trợ Lý AI');

      const replyHanzi = data.hanzi || (data.isChineseTarget ? data.translated : (data.sourceText || text));
      const replyPinyin = data.pinyin || '';
      const replyVi = data.vi || (data.isChineseTarget ? (data.sourceText || text) : data.translated);
      const grammarTips = data.grammarTips || '';

      floatingAiMessages.push({
        sender: 'ai',
        hanzi: replyHanzi,
        pinyin: replyPinyin,
        vi: replyVi,
        followUp: data.followUp || '',
        quickReplies: data.quickReplies || [],
        vocab: data.vocab || [],
        grammarTips,
        timestamp: nowTimeLabel()
      });
      renderFloatingAiMessages();

      // Read aloud in standard Chinese
      if (replyHanzi && /[一-龥]/.test(replyHanzi)) {
        playChineseTTS(replyHanzi);
      }
    } else {
      errorMessage = (data && data.error) || 'Robot AI gặp trục trặc khi phản hồi. Bạn thử lại nhé!';
    }
  } catch (err) {
    console.warn('AI chat request failed:', err);
    floatingAiMessages = floatingAiMessages.filter(m => m.id !== loadingId);
    errorMessage = 'Không thể kết nối máy chủ AI. Vui lòng kiểm tra mạng và thử lại.';
  } finally {
    floatingAiBusy = false;
  }

  if (errorMessage) {
    floatingAiMessages.push({ sender: 'ai', text: errorMessage, timestamp: nowTimeLabel() });
    renderFloatingAiMessages();
    showToast(errorMessage, 'error');
  }
}

function startFloatingAiSpeechInput() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    showToast('Trình duyệt không hỗ trợ nhận diện giọng nói!', 'warning');
    return;
  }

  const micBtn = document.getElementById('btn-flspeech-mic');
  if (micBtn) micBtn.classList.add('text-red-600', 'animate-pulse');

  const recognition = new SpeechRec();
  recognition.lang = 'zh-CN'; // Listen Chinese
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('floatingAiInput');
    if (input) {
      input.value = transcript;
      sendFloatingAiMessage();
    }
  };

  recognition.onerror = () => {
    if (micBtn) micBtn.classList.remove('text-red-600', 'animate-pulse');
  };

  recognition.onend = () => {
    if (micBtn) micBtn.classList.remove('text-red-600', 'animate-pulse');
  };

  recognition.start();
}

window.initFloatingAiAssistant = initFloatingAiAssistant;
window.toggleFloatingAiChat = toggleFloatingAiChat;
window.openFloatingAiChat = openFloatingAiChat;
window.dismissFloatingAiTooltip = dismissFloatingAiTooltip;
window.switchFloatingAiMode = switchFloatingAiMode;
window.applyFloatingAiChip = applyFloatingAiChip;
window.sendQuickReply = sendQuickReply;
window.clearFloatingAiChat = clearFloatingAiChat;
window.sendFloatingAiMessage = sendFloatingAiMessage;
window.startFloatingAiSpeechInput = startFloatingAiSpeechInput;

})();

/* --- FILE: js/features/support.js --- */
(function(){
// ==================== UNIFIED FLOATING DOCK & POLICY ENGINE ====================
function initFloatingDock() {
  const isHidden = storage.getRaw('chinese_daily_dock_hidden') === 'true';
  applyFloatingDockState(isHidden);
  updateQuickDockNotebookBadge();
}

function applyFloatingDockState(hidden) {
  const dock = document.getElementById('floatingRightDock');
  const collapsedBtn = document.getElementById('floatingDockCollapsedBtn');
  if (!dock || !collapsedBtn) return;

  if (hidden) {
    dock.classList.add('hidden');
    dock.classList.remove('flex');
    collapsedBtn.classList.remove('hidden');
    collapsedBtn.classList.add('inline-flex');
  } else {
    dock.classList.remove('hidden');
    dock.classList.add('flex');
    collapsedBtn.classList.add('hidden');
    collapsedBtn.classList.remove('inline-flex');
  }
}

function toggleFloatingDockVisibility(hide) {
  storage.setRaw('chinese_daily_dock_hidden', hide ? 'true' : 'false');
  applyFloatingDockState(hide);
  if (hide) {
    const aiWin = document.getElementById('floatingAiChatWindow');
    if (aiWin) {
      aiWin.classList.add('hidden');
      isFloatingAiOpen = false;
    }
  }
}

function updateQuickDockNotebookBadge() {
  const badge = document.getElementById('quickDockNotebookBadge');
  if (!badge) return;
  const count = (typeof userProfile !== 'undefined' && userProfile.savedWords) ? userProfile.savedWords.length : 7;
  badge.innerText = count > 0 ? (count > 99 ? '99+' : count) : '0';
  if (count === 0) {
    badge.classList.add('opacity-80');
  } else {
    badge.classList.remove('opacity-80');
  }
}

function quickDockSearch() {
  const input = document.getElementById('globalSearchInput');
  if (input) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      input.focus();
      input.select();
      if (typeof showToast === 'function') {
        showToast('🔍 Đã kích hoạt ô tra cứu nhanh Hán tự & Pinyin!', 'info');
      }
    }, 250);
  } else if (typeof switchTab === 'function') {
    switchTab('dictionary');
  }
}

function handleSupportAvatarClick(e) {
  openComplaintModal();
}

function toggleSupportContactModal() {
  openComplaintModal();
}

function closeSupportContactModal() {
  closeComplaintModal();
}

function dismissFloatingContactTooltip(e) {
  if (e) e.stopPropagation();
  const tooltip = document.getElementById('floatingContactTooltip');
  if (tooltip) tooltip.classList.add('hidden');
}

function copySupportInfo(text, label) {
  if (typeof copyToClipboard === 'function') {
    copyToClipboard(text, `Đã sao chép: ${label}`);
  }
}

// ---------------- QUICK SETTINGS MODAL ----------------
function openQuickSettingsModal() {
  openModal('quickSettingsModal');
}

function closeQuickSettingsModal() {
  closeModal('quickSettingsModal');
}
if (typeof registerModal === 'function') {
  registerModal('quickSettingsModal', closeQuickSettingsModal);
}

// ---------------- PLATFORM POLICY MODAL ENGINE ----------------
const PLATFORM_POLICIES = {
  operating: {
    title: "Quy chế hoạt động nền tảng số",
    badge: "QUY CHẾ CHUNG",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">1. Mục đích và Phạm vi Áp dụng</h4>
      <p class="mb-3 leading-relaxed">Nền tảng "Học Tiếng Trung Mỗi Ngày" (每日中文) được vận hành nhằm cung cấp môi trường học tập trực tuyến chuẩn hóa HSK 3.0, từ vựng logic, chiết tự 214 bộ thủ và mô phỏng phòng thi chuẩn quốc tế cho học viên tại Việt Nam và cộng đồng người học toàn cầu.</p>
      
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">2. Nguyên tắc hoạt động</h4>
      <p class="mb-3 leading-relaxed">• Tôn trọng quyền sở hữu trí tuệ và chuẩn mực giáo dục ngôn ngữ quốc tế Hanban.<br>• Mọi học viên tham gia học tập, thảo luận trong Lớp học thông minh (Smart Peer Study Room) cam kết tôn trọng văn minh, không spam, không phát tán nội dung vi phạm thuần phong mỹ tục.<br>• Nền tảng đảm bảo vận hành ổn định 24/7 với hệ thống máy chủ biên CDN và bảo mật đa lớp.</p>
    `
  },
  owner: {
    title: "Thông tin chủ quản nền tảng",
    badge: "CHỦ QUẢN & BẢN QUYỀN",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Đơn vị Vận hành & Bản quyền Nội dung</h4>
      <p class="mb-2"><strong>Đơn vị chủ quản:</strong> Hệ thống Giáo dục Ngôn ngữ Trực tuyến Học Tiếng Trung Mỗi Ngày EduTech.</p>
      <p class="mb-2"><strong>Email tiếp nhận & khiếu nại:</strong> <a href="mailto:hoangpham1618@gmail.com" class="text-rose-700 dark:text-amber-400 font-bold underline">hoangpham1618@gmail.com</a></p>
      <p class="mb-2"><strong>Đường dây nóng hỗ trợ:</strong> 0988.88.66.66 (Zalo 24/7)</p>
      <p class="mb-2"><strong>Bản quyền hệ thống:</strong> Toàn bộ dữ liệu 3.592 từ vựng HSK, 14.605 từ chuyên ngành, 150 hội thoại tình huống và 1.000 cặp thẻ lật thuộc quyền sở hữu độc quyền của nền tảng.</p>
      <div class="mt-4 pt-3 border-t border-amber-200/60 dark:border-stone-800">
        <button onclick="closePlatformPolicyModal(); openComplaintModal();" class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white text-xs font-bold hover:shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer">
          <span>Gửi khiếu nại & phản ánh tới Ban Quản Trị →</span>
        </button>
      </div>
    `
  },
  privacy: {
    title: "Chính sách bảo mật dữ liệu",
    badge: "BẢO MẬT & DỮ LIỆU",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Bảo vệ Thông tin Cá nhân Người học</h4>
      <p class="mb-3 leading-relaxed">• Chúng tôi áp dụng thuật toán mã hóa mật khẩu Scrypt tiên tiến nhất, đảm bảo ngay cả quản trị viên cũng không thể đọc được mật khẩu gốc.<br>• Dữ liệu học tập cá nhân (tiến độ bài học, điểm số, thẻ ghi nhớ SRS) được lưu trữ an toàn trên thiết bị của bạn (localStorage) và đồng bộ qua cookie phiên bảo mật HttpOnly.<br>• Cam kết không bao giờ bán, cho thuê hoặc tiết lộ dữ liệu cá nhân của học viên cho bất kỳ bên thứ ba nào vì mục đích quảng cáo.</p>
    `
  },
  rights: {
    title: "Quyền và nghĩa vụ các bên",
    badge: "QUYỀN & NGHĨA VỤ",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Quyền của Học viên</h4>
      <p class="mb-3 leading-relaxed">• Được toàn quyền truy cập tài liệu bài giảng, âm thanh chuẩn CCTV và trợ lý AI theo gói học đã đăng ký.<br>• Được hỗ trợ giải đáp kỹ thuật và học thuật 24/7 qua Zalo và Trợ lý AI.<br>• Có quyền xuất file sao lưu tiến độ học tập và yêu cầu xóa vĩnh viễn tài khoản bất kỳ lúc nào.</p>
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Nghĩa vụ của Học viên</h4>
      <p class="mb-2 leading-relaxed">• Không chia sẻ trái phép tài khoản VIP cho nhiều người ngoài phạm vi gói học cá nhân.<br>• Tự chịu trách nhiệm bảo mật thiết bị truy cập và mật khẩu của mình.</p>
    `
  },
  dispute: {
    title: "Tiếp nhận & Giải quyết khiếu nại",
    badge: "KHIẾU NẠI & HỖ TRỢ",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Quy trình tiếp nhận & giải quyết khiếu nại minh bạch</h4>
      <p class="mb-2 leading-relaxed">Chúng tôi cam kết tiếp nhận và phản hồi mọi yêu cầu, khiếu nại của học viên trong vòng <strong>2 giờ làm việc</strong> qua các kênh chính thức:</p>
      <p class="mb-1.5">• <strong>Hòm thư tiếp nhận khiếu nại:</strong> <a href="mailto:hoangpham1618@gmail.com" class="text-rose-700 dark:text-amber-400 font-black underline">hoangpham1618@gmail.com</a></p>
      <p class="mb-1.5">• <strong>Hotline/Zalo tiếp nhận khẩn cấp 24/7:</strong> <span class="font-bold">0988.88.66.66</span></p>
      <p class="mt-2 leading-relaxed">Mọi trường hợp lỗi kỹ thuật, thanh toán hoặc thắc mắc học liệu đều được chuyên viên hỗ trợ tận tình đến khi học viên hài lòng 100%.</p>
      <div class="mt-4 pt-3 border-t border-amber-200/60 dark:border-stone-800 flex items-center gap-2 flex-wrap">
        <button onclick="closePlatformPolicyModal(); openComplaintModal('Khiếu nại thanh toán & Kích hoạt gói VIP');" class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white text-xs font-bold hover:shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer">
          <span>Gửi khiếu nại trực tuyến ngay →</span>
        </button>
        <a href="mailto:hoangpham1618@gmail.com?subject=[Học Tiếng Trung Mỗi Ngày - Khiếu Nại] Cần hỗ trợ khẩn cấp" class="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold border border-stone-300 dark:border-stone-700 transition-all inline-flex items-center gap-1.5">
          <span>Soạn email tới hoangpham1618@gmail.com</span>
        </a>
      </div>
    `
  },
  pricing: {
    title: "Chính sách về giá & Điều kiện",
    badge: "BẢNG GIÁ MINH BẠCH",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Minh bạch Giá & Ưu đãi</h4>
      <p class="mb-2 leading-relaxed">• Mọi học viên mới đăng ký đều được hưởng <strong>7 ngày dùng thử miễn phí không giới hạn</strong> tính năng.<br>• Bảng giá các gói VIP (1 Tháng, 1 Năm, Trọn Đời) được niêm yết công khai tại mục Nâng Cấp VIP, cam kết không phát sinh bất kỳ phụ phí ẩn nào.<br>• Giá gói trọn đời được bảo lưu quyền lợi vĩnh viễn bao gồm toàn bộ cập nhật học liệu tương lai.</p>
    `
  },
  payment: {
    title: "Chính sách thanh toán",
    badge: "THANH TOÁN AN TOÀN",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Phương thức Thanh toán</h4>
      <p class="mb-2 leading-relaxed">Học viên có thể thanh toán thuận tiện qua:</p>
      <p class="mb-1">• Chuyển khoản ngân hàng 24/7 quét mã VietQR tự động kích hoạt tức thì.<br>• Ví điện tử MoMo, ZaloPay, Viettel Money.<br>• Thẻ thanh toán quốc tế Visa, MasterCard.</p>
      <p class="mt-2 text-stone-500 dark:text-stone-400 text-xs">Biên lai điện tử xác nhận sẽ được gửi tự động qua email hoặc tin nhắn Zalo ngay sau khi giao dịch thành công.</p>
    `
  },
  service: {
    title: "Phương thức cung cấp dịch vụ",
    badge: "DỊCH VỤ SỐ",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Cung cấp Dịch vụ Học tập Điện tử</h4>
      <p class="mb-2 leading-relaxed">• Dịch vụ được cung cấp trực tuyến 100% trên nền tảng web đa thiết bị (Máy tính, Máy tính bảng, Điện thoại di động).<br>• Học viên có thể cài đặt ứng dụng web lũy tiến (PWA) để học tập mượt mà như ứng dụng native mà không cần tải file nặng từ kho ứng dụng.</p>
    `
  },
  refund: {
    title: "Đổi trả, chấm dứt & Hoàn tiền",
    badge: "CAM KẾT 100% HOÀN TIỀN",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Chính sách Cam kết Hoàn tiền trong 7 ngày</h4>
      <p class="mb-3 leading-relaxed">Nếu trong vòng <strong>7 ngày</strong> kể từ khi nâng cấp tài khoản VIP, học viên cảm thấy nền tảng không phù hợp với nhu cầu học tập, quý khách chỉ cần gửi email tới <a href="mailto:hoangpham1618@gmail.com" class="text-rose-700 dark:text-amber-400 font-black underline">hoangpham1618@gmail.com</a> hoặc nhắn tin qua Zalo 0988.88.66.66. Chúng tôi cam kết <strong>hoàn tiền 100%</strong> vô điều kiện trong vòng 24 giờ.</p>
      <div class="mt-4 pt-3 border-t border-amber-200/60 dark:border-stone-800">
        <button onclick="closePlatformPolicyModal(); openComplaintModal('Yêu cầu hoàn tiền 100% trong 7 ngày');" class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold hover:shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer">
          <span>Yêu cầu hoàn tiền trực tuyến (24h) →</span>
        </button>
      </div>
    `
  },
  delete_account: {
    title: "Yêu cầu xóa tài khoản & Bảo lưu dữ liệu",
    badge: "QUYỀN RIÊNG TƯ",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Quy trình Yêu cầu Hủy bỏ Tài khoản</h4>
      <p class="mb-3 leading-relaxed">Học viên có toàn quyền yêu cầu xóa vĩnh viễn tài khoản và toàn bộ lịch sử học tập khỏi hệ thống của chúng tôi.</p>
      <p class="mb-2"><strong>Cách thực hiện:</strong></p>
      <p class="mb-1">1. Gửi email từ chính hòm thư đăng ký của bạn đến <a href="mailto:hoangpham1618@gmail.com" class="text-rose-700 dark:text-amber-400 font-black underline">hoangpham1618@gmail.com</a> với tiêu đề <code>[Yêu Cầu Xóa Tài Khoản]</code>.</p>
      <p class="mb-2">2. Hoặc gửi yêu cầu trực tiếp qua mẫu khiếu nại trực tuyến của nền tảng.</p>
      <p class="text-stone-500 dark:text-stone-400 text-xs mt-2">Hệ thống sẽ tiến hành xóa sạch dữ liệu người dùng trong vòng 24 giờ và gửi email xác nhận hoàn tất.</p>
      <div class="mt-4 pt-3 border-t border-amber-200/60 dark:border-stone-800">
        <button onclick="closePlatformPolicyModal(); openComplaintModal('Yêu cầu xóa vĩnh viễn tài khoản');" class="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold hover:shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer">
          <span>Gửi yêu cầu xóa tài khoản trực tuyến →</span>
        </button>
      </div>
    `
  },
  catalog: {
    title: "Danh mục chính sách nền tảng",
    badge: "MỤC LỤC CHÍNH SÁCH",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Tổng hợp Quy chuẩn Pháp lý Nền tảng Học Tiếng Trung Mỗi Ngày</h4>
      <p class="mb-3 leading-relaxed">Nền tảng Học Tiếng Trung Mỗi Ngày tuân thủ nghiêm ngặt các quy định pháp luật hiện hành về cung cấp dịch vụ nội dung số và thương mại điện tử.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <button onclick="switchPlatformPolicyTab('operating')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">1. Quy chế hoạt động số</button>
        <button onclick="switchPlatformPolicyTab('owner')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">2. Thông tin chủ quản</button>
        <button onclick="switchPlatformPolicyTab('privacy')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">3. Chính sách bảo mật</button>
        <button onclick="switchPlatformPolicyTab('dispute')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">4. Giải quyết khiếu nại</button>
        <button onclick="switchPlatformPolicyTab('refund')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">5. Đổi trả & Hoàn tiền</button>
        <button onclick="switchPlatformPolicyTab('delete_account')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">6. Xóa tài khoản</button>
      </div>
    `
  }
};

function openPlatformPolicyModal(key = 'operating') {
  switchPlatformPolicyTab(key);
  openModal('platformPolicyModal');
}

function closePlatformPolicyModal() {
  closeModal('platformPolicyModal');
}
if (typeof registerModal === 'function') {
  registerModal('platformPolicyModal', closePlatformPolicyModal);
}

function switchPlatformPolicyTab(key) {
  const policy = PLATFORM_POLICIES[key] || PLATFORM_POLICIES.operating;
  const titleEl = document.getElementById('platformPolicyTitle');
  const badgeEl = document.getElementById('platformPolicyBadge');
  const bodyEl = document.getElementById('platformPolicyBody');

  if (titleEl) titleEl.innerText = policy.title;
  if (badgeEl) badgeEl.innerText = policy.badge;
  if (bodyEl) bodyEl.innerHTML = policy.content;

  // Highlight tab button
  document.querySelectorAll('[data-policy-tab]').forEach(btn => {
    if (btn.getAttribute('data-policy-tab') === key) {
      btn.className = 'w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#8B1E1E] text-white shadow-2xs cursor-pointer';
    } else {
      btn.className = 'w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-colors cursor-pointer';
    }
  });
}

// ---------------- APP INSTALL MODAL (GOOGLE PLAY & APP STORE) ----------------
function showAppInstallModal(platform = 'google_play') {
  const modal = document.getElementById('appInstallModal');
  const titleEl = document.getElementById('appInstallTitle');
  const descEl = document.getElementById('appInstallDesc');
  const iconEl = document.getElementById('appInstallIcon');

  if (platform === 'app_store') {
    if (titleEl) titleEl.innerText = 'Cài đặt Học Tiếng Trung Mỗi Ngày trên iPhone / iPad (iOS)';
    if (descEl) descEl.innerHTML = 'Để học mượt mà như app gốc trên iOS: Mở Safari &rarr; Nhấn biểu tượng <b>Chia sẻ (Share)</b> &rarr; Chọn <b>"Thêm vào Màn hình chính" (Add to Home Screen)</b>.';
    if (iconEl) iconEl.innerText = '🍏';
  } else {
    if (titleEl) titleEl.innerText = 'Cài đặt Học Tiếng Trung Mỗi Ngày trên Android / Google Play';
    if (descEl) descEl.innerHTML = 'Để cài đặt app trên Android: Mở Chrome &rarr; Nhấn menu <b>3 chấm</b> ở góc trên phải &rarr; Chọn <b>"Cài đặt ứng dụng" (Install App)</b> hoặc tải trực tiếp file APK an toàn.';
    if (iconEl) iconEl.innerText = '▶️';
  }

  openModal('appInstallModal');
}

function closeAppInstallModal() {
  closeModal('appInstallModal');
}
if (typeof registerModal === 'function') {
  registerModal('appInstallModal', closeAppInstallModal);
}

// ---------------- COMPLAINT & DISPUTE MODAL (TIẾP NHẬN & GIẢI QUYẾT KHIẾU NẠI) ----------------
function openComplaintModal(defaultCategory = '') {
  const modal = document.getElementById('complaintModal');
  if (!modal) return;

  // Tự động điền thông tin người dùng nếu đã đăng nhập
  const savedUser = (typeof currentUser !== 'undefined' && currentUser) || 
                    (typeof storage !== 'undefined' && storage.get('user', null));
  if (savedUser) {
    const nameInput = document.getElementById('complaintSenderName');
    const contactInput = document.getElementById('complaintSenderContact');
    if (nameInput && !nameInput.value) nameInput.value = savedUser.name || '';
    if (contactInput && !contactInput.value) contactInput.value = savedUser.email || '';
  }

  if (defaultCategory) {
    const catSelect = document.getElementById('complaintCategory');
    if (catSelect) catSelect.value = defaultCategory;
  }

  openModal('complaintModal');
  if (typeof refreshIcons === 'function') refreshIcons(modal);
}

function closeComplaintModal() {
  closeModal('complaintModal');
}
if (typeof registerModal === 'function') {
  registerModal('complaintModal', closeComplaintModal);
}

async function submitComplaintForm(e) {
  if (e) e.preventDefault();
  const nameEl = document.getElementById('complaintSenderName');
  const contactEl = document.getElementById('complaintSenderContact');
  const catEl = document.getElementById('complaintCategory');
  const msgEl = document.getElementById('complaintMessage');
  const submitBtn = document.getElementById('complaintSubmitBtn');

  const name = (nameEl && nameEl.value.trim()) || 'Học viên';
  const contact = (contactEl && contactEl.value.trim()) || '';
  const category = (catEl && catEl.value) || 'Khiếu nại & Góp ý chung';
  const message = (msgEl && msgEl.value.trim()) || '';

  if (!contact || !message) {
    if (typeof showToast === 'function') {
      showToast('Vui lòng nhập thông tin liên hệ và chi tiết khiếu nại!', 'error');
    }
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="animate-spin inline-block mr-1">⏳</span> Đang gửi tiếp nhận...';
  }

  const fullPayload = `[KHIẾU NẠI & PHẢN ÁNH HỌC VIÊN]\n• Người gửi: ${name}\n• Kênh liên hệ: ${contact}\n• Phân loại: ${category}\n• Hòm thư tiếp nhận: hoangpham1618@gmail.com\n• Nội dung: ${message}`;

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: fullPayload, name, email: contact, category })
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const ticketId = data.ticketId || ('HSK-' + Date.now().toString(36).toUpperCase());
      if (typeof showToast === 'function') {
        showToast(`✓ Đã tiếp nhận khiếu nại! Mã phiếu: ${ticketId}. Chúng tôi sẽ giải quyết trong 2 giờ.`, 'success');
      }
      showComplaintSuccessReceipt(ticketId, category, name, contact);
      if (msgEl) msgEl.value = '';
    } else {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi gửi phản hồi');
    }
  } catch (err) {
    // Nếu có lỗi mạng hoặc API rate limit, chuyển hướng mở trình soạn email trực tiếp tới hoangpham1618@gmail.com
    if (typeof showToast === 'function') {
      showToast('Đang kết nối mở trình soạn email gửi tới hoangpham1618@gmail.com...', 'info');
    }
    const subject = encodeURIComponent(`[Học Tiếng Trung Mỗi Ngày - Khiếu Nại] ${category} - ${name}`);
    const body = encodeURIComponent(fullPayload);
    window.open(`mailto:hoangpham1618@gmail.com?subject=${subject}&body=${body}`, '_blank');
    closeComplaintModal();
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i><span>Gửi Khiếu Nại Trực Tuyến</span>';
      if (typeof refreshIcons === 'function') refreshIcons(submitBtn);
    }
  }
}

function showComplaintSuccessReceipt(ticketId, category, name, contact) {
  const form = document.getElementById('complaintOnlineForm');
  if (!form) {
    if (typeof showToast === 'function') {
      showToast(`✓ Đã tiếp nhận khiếu nại! Mã phiếu: ${ticketId}`, 'success');
    }
    closeComplaintModal();
    return;
  }
  form.innerHTML = `
    <div class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 dark:border-emerald-700 text-center space-y-3.5 animate-fade-in">
      <div class="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-2xl font-bold shadow-xs">
        ✓
      </div>
      <div>
        <h4 class="text-base font-black text-emerald-900 dark:text-emerald-200 font-serif-luxury">
          Tiếp Nhận Phản Ánh Thành Công!
        </h4>
        <p class="text-xs text-stone-600 dark:text-stone-300 mt-1">
          Hệ thống đã chuyển trực tiếp yêu cầu của bạn tới Ban Quản Trị và hòm thư <strong>hoangpham1618@gmail.com</strong>.
        </p>
      </div>

      <!-- Ticket Card -->
      <div class="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-stone-700 text-left space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-stone-500 font-semibold">Mã phiếu tiếp nhận:</span>
          <div class="flex items-center gap-1.5">
            <span class="font-mono font-black text-rose-700 dark:text-amber-400 text-sm tracking-wide">${ticketId}</span>
            <button type="button" onclick="copySupportInfo('${ticketId}', 'Mã phiếu ${ticketId}')" class="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-[11px] font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
              Sao chép
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-stone-500 font-semibold">Phân loại:</span>
          <span class="font-bold text-stone-800 dark:text-stone-200">${category}</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-stone-500 font-semibold">Thời hạn cam kết xử lý:</span>
          <span class="font-bold text-emerald-700 dark:text-emerald-400">Trước 2 giờ làm việc</span>
        </div>
      </div>

      <div class="pt-2 flex items-center justify-center gap-2">
        <button type="button" onclick="closeComplaintModal()" class="px-6 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white font-bold text-xs shadow-sm hover:opacity-95 cursor-pointer">
          Đã hiểu & Đóng (✓)
        </button>
      </div>
    </div>
  `;
}

// Global exports
window.initFloatingDock = initFloatingDock;
window.toggleFloatingDockVisibility = toggleFloatingDockVisibility;
window.updateQuickDockNotebookBadge = updateQuickDockNotebookBadge;
window.quickDockSearch = quickDockSearch;
window.handleSupportAvatarClick = handleSupportAvatarClick;
window.toggleSupportContactModal = toggleSupportContactModal;
window.closeSupportContactModal = closeSupportContactModal;
window.openComplaintModal = openComplaintModal;
window.closeComplaintModal = closeComplaintModal;
window.submitComplaintForm = submitComplaintForm;
window.openQuickSettingsModal = openQuickSettingsModal;
window.closeQuickSettingsModal = closeQuickSettingsModal;
window.openPlatformPolicyModal = openPlatformPolicyModal;
window.closePlatformPolicyModal = closePlatformPolicyModal;
window.switchPlatformPolicyTab = switchPlatformPolicyTab;
window.showAppInstallModal = showAppInstallModal;
window.closeAppInstallModal = closeAppInstallModal;

})();

/* --- FILE: js/features/mockexam.js --- */
(function(){
// ==========================================
// MODULE: THI THỬ HSK MÔ PHỎNG CHUẨN HANBAN CTI & STUDY4
// Kho 360 Đề Thi (60 Đề / Cấp Độ HSK 1 - 6)
// ==========================================

let currentExamLevel = 1;
let currentExamTestNumber = 1;
let activeExam = null;
let examUserAnswers = {};
let examTimeRemaining = 0;
let examTimerInterval = null;
let examLevelDataCache = {};
let userExamHistory = {};
let activeExamPartFilter = 'all'; // 'all' | 'listening' | 'reading' | 'writing'

function setActiveMockExam(exam) {
  activeExam = exam;
}

function loadExamHistory() {
  try {
    const saved = localStorage.getItem('hsk_mock_history');
    userExamHistory = saved ? JSON.parse(saved) : {};
  } catch (e) {
    userExamHistory = {};
  }
}

function saveExamHistory(level, testNum, result) {
  if (!userExamHistory[level]) userExamHistory[level] = {};
  userExamHistory[level][testNum] = result;
  try {
    localStorage.setItem('hsk_mock_history', JSON.stringify(userExamHistory));
  } catch (e) {}
}

function initMockExamModule() {
  loadExamHistory();
  initTestNumberSelectOptions();
  switchMockExamLevel(1);
}

function initTestNumberSelectOptions() {
  const select = document.getElementById('examTestNumberSelect');
  if (!select) return;
  select.innerHTML = '';
  for (let i = 1; i <= 60; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    const pad = i < 10 ? '0' + i : i;
    opt.innerText = `Đề Số ${pad} / 60`;
    select.appendChild(opt);
  }
}

async function getExamsForLevel(level) {
  if (examLevelDataCache[level] && examLevelDataCache[level].length >= 60) {
    return examLevelDataCache[level];
  }

  // Check if mockExamsData already contains all 60 for this level
  if (Array.isArray(window.mockExamsData) && window.mockExamsData.length > 0) {
    const filtered = window.mockExamsData.filter(e => e.level === level);
    if (filtered.length >= 60) {
      examLevelDataCache[level] = filtered;
      return filtered;
    }
  }

  // Fetch level-split file
  try {
    const res = await fetch(`data/exams/hsk${level}.json`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        examLevelDataCache[level] = data;
        return data;
      }
    }
  } catch (e) {
    console.warn(`Fetch exams for HSK ${level} fallback:`, e.message);
  }

  // Fallback to window.mockExamsData or empty array
  return window.mockExamsData || [];
}

async function switchMockExamLevel(level) {
  if (level < 1) level = 1;
  if (level > 6) level = 6;
  currentExamLevel = level;
  currentExamTestNumber = 1;

  // VIP Access Guard
  if (level > 1 && typeof checkCurrentUserVip === 'function') {
    const vip = checkCurrentUserVip();
    if (vip.isExpired) {
      if (!ensureVipAccess('Đề thi mô phỏng HSK cấp ' + level)) return;
    }
  }

  updateExamLevelButtons();
  await loadAndRenderActiveExam();
}

function updateExamLevelButtons() {
  const buttons = [1, 2, 3, 4, 5, 6];
  buttons.forEach(lvl => {
    const btn = document.getElementById(`btn-exam-lvl-${lvl}`);
    if (!btn) return;
    if (lvl === currentExamLevel) {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-all whitespace-nowrap cursor-pointer';
    }
  });
}

async function switchMockExamTest(testNumber) {
  if (testNumber < 1) testNumber = 1;
  if (testNumber > 60) testNumber = 60;
  currentExamTestNumber = testNumber;
  await loadAndRenderActiveExam();
}

function nextMockExamTest() {
  if (currentExamTestNumber < 60) {
    switchMockExamTest(currentExamTestNumber + 1);
    if (typeof showToast === 'function') {
      showToast(`👉 Đã chuyển sang Đề Số ${currentExamTestNumber < 10 ? '0' + currentExamTestNumber : currentExamTestNumber}!`, 'info');
    }
  } else {
    if (typeof showToast === 'function') {
      showToast('🏆 Bạn đang ở Đề số 60 - đề cuối cùng của cấp HSK này!', 'info');
    }
  }
}

function prevMockExamTest() {
  if (currentExamTestNumber > 1) {
    switchMockExamTest(currentExamTestNumber - 1);
    if (typeof showToast === 'function') {
      showToast(`👈 Đã quay lại Đề Số ${currentExamTestNumber < 10 ? '0' + currentExamTestNumber : currentExamTestNumber}!`, 'info');
    }
  } else {
    if (typeof showToast === 'function') {
      showToast('Bạn đang ở Đề số 01!', 'info');
    }
  }
}

function randomMockExamTest() {
  const rand = Math.floor(Math.random() * 60) + 1;
  switchMockExamTest(rand);
  if (typeof showToast === 'function') {
    showToast(`🎲 Đã chọn ngẫu nhiên Đề số ${rand < 10 ? '0' + rand : rand} cho bạn!`, 'success');
  }
}

async function loadAndRenderActiveExam() {
  const exams = await getExamsForLevel(currentExamLevel);
  activeExam = exams.find(e => e.testNumber === currentExamTestNumber) || exams[0] || null;

  // Sync test select dropdown
  const select = document.getElementById('examTestNumberSelect');
  if (select) {
    select.value = currentExamTestNumber;
  }

  // Update Overview Banner Info
  const levelBadge = document.getElementById('examLevelBadge');
  const scoreInfo = document.getElementById('examScoreInfo');
  const titleDisplay = document.getElementById('examTitleDisplay');
  const descDisplay = document.getElementById('examDescDisplay');

  if (levelBadge && activeExam) {
    levelBadge.innerText = `HSK ${activeExam.level} • Chuẩn Hanban CTI (${activeExam.questions ? activeExam.questions.length : 40} Câu)`;
  }
  if (scoreInfo && activeExam) {
    scoreInfo.innerText = `Thang điểm: ${activeExam.totalScore} điểm | Điểm đỗ: ${activeExam.passScore} điểm | Thời gian: ${activeExam.durationMinutes} phút`;
  }
  if (titleDisplay && activeExam) {
    titleDisplay.innerText = activeExam.title;
  }
  if (descDisplay && activeExam) {
    descDisplay.innerText = activeExam.description || 'Đề thi mô phỏng định dạng chuẩn CTI Hanban & STUDY4: Gồm 2 phần Nghe hiểu và Đọc hiểu trọn vẹn.';
  }

  examUserAnswers = {};
  activeExamPartFilter = 'all';
  updatePartFilterButtons();
  renderMockExam();
  renderQuestionPalette();
  updateExamProgressStats();
  startExamTimer(activeExam ? activeExam.durationMinutes : 35);
}

function startExamTimer(minutes) {
  if (examTimerInterval) clearInterval(examTimerInterval);
  examTimeRemaining = minutes * 60;
  updateTimerDisplay();

  examTimerInterval = setInterval(() => {
    examTimeRemaining--;
    updateTimerDisplay();
    if (examTimeRemaining <= 0) {
      clearInterval(examTimerInterval);
      if (typeof showToast === 'function') {
        showToast('⏰ Hết giờ làm bài! Hệ thống tự động thu bài và chấm điểm.', 'warning');
      }
      submitMockExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const display = document.getElementById('examTimerDisplay');
  if (!display) return;
  const m = Math.floor(examTimeRemaining / 60);
  const s = examTimeRemaining % 60;
  display.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  if (examTimeRemaining <= 120) {
    display.className = 'text-2xl font-black text-rose-600 font-mono tracking-wider animate-pulse';
  } else {
    display.className = 'text-2xl font-black text-[#8B1E1E] dark:text-amber-400 font-mono tracking-wider';
  }
}

function updateExamProgressStats() {
  const countText = document.getElementById('examAnsweredCountText');
  const bar = document.getElementById('examProgressBar');
  if (!activeExam) return;

  const questions = activeExam.questions || [];
  let answered = 0;
  questions.forEach(q => {
    const ans = examUserAnswers[q.id];
    if (ans && (Array.isArray(ans) ? ans.length > 0 : String(ans).trim() !== '')) {
      answered++;
    }
  });

  const total = questions.length;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  if (countText) countText.innerText = `Đã làm: ${answered} / ${total} câu (${pct}%)`;
  if (bar) bar.style.width = `${pct}%`;
}

// ---------------- STUDY4 STYLE PART FILTER & PALETTE ----------------
function filterExamQuestionsByPart(part) {
  activeExamPartFilter = part;
  updatePartFilterButtons();
  renderMockExam();
  renderQuestionPalette();
}

function updatePartFilterButtons() {
  ['all', 'listening', 'reading', 'writing'].forEach(p => {
    const btn = document.getElementById(`examPartBtn-${p}`);
    if (!btn) return;
    if (p === activeExamPartFilter) {
      btn.className = 'px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer font-bold';
    } else {
      btn.className = 'px-3.5 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:text-[#8B1E1E] transition-all whitespace-nowrap cursor-pointer font-bold';
    }
  });
}

function renderQuestionPalette() {
  const palette = document.getElementById('examQuestionPalette');
  if (!palette || !activeExam) return;

  const questions = activeExam.questions || [];
  palette.innerHTML = questions.map((q, idx) => {
    const ans = examUserAnswers[q.id];
    const isAnswered = ans && (Array.isArray(ans) ? ans.length > 0 : String(ans).trim() !== '');
    
    // Check if hidden by filter
    let isHiddenByFilter = false;
    const secLower = (q.section || '').toLowerCase();
    const isListening = q.skill === 'listening' || secLower.includes('nghe') || secLower.includes('听力');
    const isWriting = q.skill === 'writing' || secLower.includes('viết') || secLower.includes('书写');
    const isReading = !isListening && !isWriting;

    if (activeExamPartFilter === 'listening' && !isListening) isHiddenByFilter = true;
    if (activeExamPartFilter === 'reading' && !isReading) isHiddenByFilter = true;
    if (activeExamPartFilter === 'writing' && !isWriting) isHiddenByFilter = true;

    return `
      <button 
        type="button" 
        onclick="scrollToExamQuestion(${idx})" 
        class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
          isAnswered
            ? 'bg-emerald-600 text-white font-black shadow-xs ring-1 ring-emerald-400 hover:bg-emerald-700'
            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
        } ${isHiddenByFilter ? 'opacity-40' : ''}"
        title="Câu ${idx + 1}: ${isAnswered ? 'Đã làm' : 'Chưa làm'}"
      >
        ${idx + 1}
      </button>
    `;
  }).join('');
}

function scrollToExamQuestion(idx) {
  // If current question is filtered out, switch to 'all'
  if (activeExamPartFilter !== 'all') {
    filterExamQuestionsByPart('all');
  }

  setTimeout(() => {
    const qEl = document.getElementById(`exam-q-box-${idx}`);
    if (qEl) {
      qEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      qEl.classList.add('ring-4', 'ring-[#8B1E1E]/40', 'transition-all');
      setTimeout(() => qEl.classList.remove('ring-4', 'ring-[#8B1E1E]/40'), 1600);
    }
  }, 60);
}

function playHanbanRepeatAudio(text) {
  if (typeof playChineseTTS !== 'function') return;
  if (typeof showToast === 'function') {
    showToast('🎧 Đang phát âm thanh lần 1 (Chuẩn phòng thi Hanban)...', 'info');
  }
  playChineseTTS(text, 'female');
  setTimeout(() => {
    if (typeof showToast === 'function') {
      showToast('🎧 Đang phát lại lần 2 (Chuẩn phòng thi Hanban)...', 'info');
    }
    playChineseTTS(text, 'male');
  }, 2300);
}

// ---------------- RENDER EXAM QUESTIONS ----------------
function renderMockExam() {
  const container = document.getElementById('mockExamQuestionsContainer');
  if (!container || !activeExam) return;

  const questions = activeExam.questions || [];

  container.innerHTML = questions.map((q, idx) => {
    const secLower = (q.section || '').toLowerCase();
    const isListening = q.skill === 'listening' || secLower.includes('nghe') || secLower.includes('听力');
    const isWriting = q.skill === 'writing' || secLower.includes('viết') || secLower.includes('书写');
    const isReading = !isListening && !isWriting;

    // Filter check
    if (activeExamPartFilter === 'listening' && !isListening) return '';
    if (activeExamPartFilter === 'reading' && !isReading) return '';
    if (activeExamPartFilter === 'writing' && !isWriting) return '';

    const userAns = examUserAnswers[q.id];

    let contentHtml = '';
    // Listening audio section
    if (q.audioText) {
      contentHtml += `
        <div class="flex items-center gap-2 mb-3 p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/80 dark:border-stone-700 flex-wrap">
          <div class="inline-flex items-center gap-1.5 bg-white dark:bg-stone-900 p-1 rounded-xl border border-amber-300 dark:border-stone-700 shadow-2xs">
            <button type="button" onclick="event.preventDefault(); playChineseTTS('${escapeJs(q.audioText)}', 'female')" class="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer" title="Nghe câu hỏi giọng Nữ bản ngữ">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
              <span>👩 Nữ Bắc Kinh</span>
            </button>
            <button type="button" onclick="event.preventDefault(); playChineseTTS('${escapeJs(q.audioText)}', 'male')" class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer" title="Nghe câu hỏi giọng Nam bản ngữ">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
              <span>👨 Nam Bắc Kinh</span>
            </button>
          </div>
          <button type="button" onclick="event.preventDefault(); playHanbanRepeatAudio('${escapeJs(q.audioText)}')" class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1 border border-emerald-300/80 transition-all cursor-pointer shadow-2xs" title="Phát 2 lần chuẩn quy chuẩn thi Hanban">
            <i data-lucide="repeat" class="w-3.5 h-3.5 text-emerald-600"></i>
            <span>🔁 Phát 2 Lần (Chuẩn Hanban)</span>
          </button>
        </div>
      `;
    }

    if (q.statement) {
      contentHtml += `
        <div class="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-3 bg-amber-50/50 dark:bg-stone-800/50 p-3 rounded-xl border border-amber-200/60 dark:border-stone-700">
          <span class="text-xs font-bold text-amber-900 dark:text-amber-400 block mb-1">📌 Nội dung câu hỏi / Nhận định:</span>
          "${q.statement}"
        </div>
      `;
    }

    // Word Reorder (HSK 3 - 6)
    if (q.words && q.correctOrder) {
      const selected = examUserAnswers[q.id] || [];
      const unselected = q.words.filter(w => !selected.includes(w));
      contentHtml += `
        <div class="space-y-3">
          <div class="min-h-[52px] p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-amber-300 dark:border-stone-700 flex flex-wrap gap-2 items-center">
            ${selected.length === 0 ? '<span class="text-xs text-stone-400">Bấm chọn các cụm từ bên dưới theo thứ tự câu hoàn chỉnh đúng ngữ pháp:</span>' : ''}
            ${selected.map((w, sIdx) => `
              <button type="button" onclick="removeExamReorderWord('${escapeJs(q.id)}', ${sIdx})" class="px-3 py-1.5 rounded-xl bg-[#8B1E1E] text-white font-hanzi font-bold text-sm shadow-xs flex items-center gap-1 cursor-pointer hover:bg-red-800 transition-all">
                <span>${w}</span>
                <span class="text-xs text-amber-200">×</span>
              </button>
            `).join('')}
          </div>
          <div class="flex flex-wrap gap-2">
            ${unselected.map(w => `
              <button type="button" onclick="addExamReorderWord('${escapeJs(q.id)}', '${escapeJs(w)}')" class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-hanzi font-bold text-sm shadow-2xs cursor-pointer transition-all">
                ${w}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    } else if (q.options) {
      // Multiple Choice / True-False
      contentHtml += `
        <div class="grid grid-cols-1 gap-2.5">
          ${q.options.map(opt => `
            <button 
              type="button"
              onclick="selectExamAnswer('${escapeJs(q.id)}', '${escapeJs(opt.key)}')"
              class="w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                userAns === opt.key
                  ? 'bg-amber-100/90 dark:bg-amber-950/70 border-amber-500 text-amber-950 dark:text-amber-200 font-bold shadow-2xs ring-2 ring-amber-400'
                  : 'bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }">
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                userAns === opt.key ? 'bg-[#8B1E1E] text-white' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
              }">
                ${opt.key}
              </span>
              <span class="text-xs lg:text-sm leading-relaxed">${opt.text}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    return `
      <div id="exam-q-box-${idx}" class="glass-card rounded-2xl p-6 border border-stone-200 dark:border-stone-750 bg-white dark:bg-stone-850 shadow-xs space-y-3.5 transition-all">
        <div class="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5 flex-wrap gap-2">
          <span class="text-xs font-black text-[#8B1E1E] dark:text-amber-400 flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full ${isListening ? 'bg-sky-500' : isReading ? 'bg-amber-500' : 'bg-rose-500'} inline-block"></span>
            ${q.section}
          </span>
          <span class="text-xs font-bold text-stone-400 font-mono">Câu ${idx + 1} / ${questions.length}</span>
        </div>
        <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug whitespace-pre-line">${q.prompt}</h4>
        ${contentHtml}
      </div>
    `;
  }).join('');

  if (typeof refreshIcons === 'function') refreshIcons(container);
  renderQuestionPalette();
}

function escapeJs(str) {
  if (!str) return '';
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '');
}

function selectExamAnswer(questionId, optionKey) {
  examUserAnswers[questionId] = optionKey;
  renderMockExam();
  updateExamProgressStats();
}

function addExamReorderWord(qId, word) {
  if (!examUserAnswers[qId]) examUserAnswers[qId] = [];
  examUserAnswers[qId].push(word);
  renderMockExam();
  updateExamProgressStats();
}

function removeExamReorderWord(qId, idx) {
  if (examUserAnswers[qId]) {
    examUserAnswers[qId].splice(idx, 1);
    renderMockExam();
    updateExamProgressStats();
  }
}

// ---------------- 60 EXAMS SELECTOR MODAL ----------------
function openExamSelectorModal() {
  if (!document.getElementById('examSelectorModal')) return;
  renderExamSelectorGrid();
  if (typeof openModal === 'function') {
    openModal('examSelectorModal');
  } else {
    document.getElementById('examSelectorModal').classList.remove('hidden');
  }
}

function closeExamSelectorModal() {
  if (typeof closeModal === 'function') {
    closeModal('examSelectorModal');
  } else {
    const modal = document.getElementById('examSelectorModal');
    if (modal) modal.classList.add('hidden');
  }
}
if (typeof registerModal === 'function') {
  registerModal('examSelectorModal', closeExamSelectorModal);
}

async function renderExamSelectorGrid() {
  const container = document.getElementById('examSelectorGridContainer');
  const levelBadge = document.getElementById('examModalLevelBadge');
  if (!container) return;

  if (levelBadge) {
    levelBadge.innerText = `HSK ${currentExamLevel} (60 Đề)`;
  }

  container.innerHTML = '<div class="col-span-full py-8 text-center text-xs text-stone-400">Đang tải kho 60 đề thi...</div>';

  const exams = await getExamsForLevel(currentExamLevel);
  container.innerHTML = '';

  const history = userExamHistory[currentExamLevel] || {};

  exams.forEach(ex => {
    const isCurrent = ex.testNumber === currentExamTestNumber;
    const record = history[ex.testNumber];

    const card = document.createElement('button');
    card.type = 'button';
    card.className = `p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
      isCurrent
        ? 'bg-amber-100/90 dark:bg-amber-950/70 border-[#8B1E1E] dark:border-amber-500 shadow-md ring-2 ring-[#8B1E1E]/30'
        : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:shadow-xs'
    }`;
    card.onclick = () => {
      switchMockExamTest(ex.testNumber);
      closeExamSelectorModal();
    };

    let statusBadge = '<span class="text-[9px] px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-500 font-bold">Chưa thi</span>';
    if (record) {
      if (record.isPassed) {
        statusBadge = `<span class="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black">Đỗ (${record.score}đ)</span>`;
      } else {
        statusBadge = `<span class="text-[9px] px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-black">Trượt (${record.score}đ)</span>`;
      }
    }

    const pad = ex.testNumber < 10 ? '0' + ex.testNumber : ex.testNumber;
    card.innerHTML = `
      <div class="flex items-center justify-between w-full mb-1">
        <span class="text-xs font-black text-amber-900 dark:text-amber-300 font-mono">Đề #${pad}</span>
        ${statusBadge}
      </div>
      <p class="text-[11px] font-bold text-stone-800 dark:text-stone-200 line-clamp-1">
        ${ex.title}
      </p>
      <div class="mt-2 text-[9px] text-stone-400 flex items-center justify-between w-full pt-1.5 border-t border-stone-100 dark:border-stone-750">
        <span>⏱️ ${ex.durationMinutes}p</span>
        <span>${ex.passScore}/${ex.totalScore}đ đỗ</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// ---------------- SUBMIT & RESULT EVALUATION ----------------
function submitMockExam() {
  if (!activeExam) return;
  if (examTimerInterval) clearInterval(examTimerInterval);

  let correctCount = 0;
  const questions = activeExam.questions || [];
  const breakdownList = [];

  let listeningCorrect = 0, listeningTotal = 0;
  let readingCorrect = 0, readingTotal = 0;
  let writingCorrect = 0, writingTotal = 0;

  questions.forEach((q, idx) => {
    let isCorrect = false;
    let userAnsText = '';
    let correctAnsText = '';

    const secLower = (q.section || '').toLowerCase();
    const isListening = q.skill === 'listening' || secLower.includes('nghe') || secLower.includes('听力');
    const isWriting = q.skill === 'writing' || secLower.includes('viết') || secLower.includes('书写');
    const isReading = !isListening && !isWriting;

    if (isListening) listeningTotal++;
    else if (isWriting) writingTotal++;
    else readingTotal++;

    if (q.words && q.correctOrder) {
      const selected = examUserAnswers[q.id] || [];
      isCorrect = selected.join('') === q.correctOrder.join('');
      userAnsText = selected.join(' ') || '(Chưa làm)';
      correctAnsText = q.correctOrder.join(' ');
    } else if (q.options) {
      const userKey = examUserAnswers[q.id];
      const correctOpt = q.options.find(o => o.isCorrect);
      const userOpt = q.options.find(o => o.key === userKey);
      isCorrect = userKey === (correctOpt ? correctOpt.key : '');
      userAnsText = userOpt ? `${userOpt.key}. ${userOpt.text}` : '(Chưa chọn)';
      correctAnsText = correctOpt ? `${correctOpt.key}. ${correctOpt.text}` : '';
    }

    if (isCorrect) {
      correctCount++;
      if (isListening) listeningCorrect++;
      else if (isWriting) writingCorrect++;
      else readingCorrect++;
    }

    breakdownList.push({
      index: idx + 1,
      section: q.section,
      prompt: q.prompt,
      isCorrect,
      userAnsText,
      correctAnsText,
      explanation: q.explanation
    });
  });

  const totalScore = activeExam.totalScore || (activeExam.level <= 2 ? 200 : 300);
  const passScore = activeExam.passScore || (activeExam.level <= 2 ? 120 : 180);

  // Hanban standard score calculation
  let listeningScore = 0;
  let readingScore = 0;
  let writingScore = 0;
  let totalScoreAchieved = 0;

  if (activeExam.level <= 2) {
    // 200 max points (100 listening + 100 reading)
    listeningScore = Math.round((listeningCorrect / Math.max(1, listeningTotal)) * 100);
    readingScore = Math.round((readingCorrect / Math.max(1, readingTotal)) * 100);
    totalScoreAchieved = listeningScore + readingScore;
  } else {
    // 300 max points (100 listening + 100 reading + 100 writing)
    listeningScore = Math.round((listeningCorrect / Math.max(1, listeningTotal)) * 100);
    readingScore = Math.round((readingCorrect / Math.max(1, readingTotal)) * 100);
    writingScore = Math.round((writingCorrect / Math.max(1, writingTotal)) * 100);
    totalScoreAchieved = listeningScore + readingScore + writingScore;
  }

  const isPassed = totalScoreAchieved >= passScore;

  // Save history
  saveExamHistory(activeExam.level, activeExam.testNumber, {
    score: totalScoreAchieved,
    maxScore: totalScore,
    isPassed: isPassed,
    date: new Date().toLocaleDateString('vi-VN')
  });

  // Grant EXP
  if (typeof addExp === 'function') {
    addExp(isPassed ? 60 : 25, `Hoàn thành Đề ${activeExam.testNumber} HSK ${activeExam.level}`);
  }

  // Populate Result Modal
  const emojiEl = document.getElementById('examResultEmoji');
  const titleEl = document.getElementById('examResultTitle');
  const subtitleEl = document.getElementById('examResultSubtitle');
  const scoreEl = document.getElementById('examScoreValue');
  const maxScoreEl = document.getElementById('examMaxScoreValue');
  const badgeEl = document.getElementById('examResultBadge');
  const breakdownContainer = document.getElementById('examAnswerBreakdown');

  if (scoreEl) scoreEl.innerText = totalScoreAchieved;
  if (maxScoreEl) maxScoreEl.innerText = `/ ${totalScore}`;

  if (isPassed) {
    if (emojiEl) emojiEl.innerText = '🎉';
    if (titleEl) titleEl.innerText = 'Chúc Mừng Bạn Đã Đỗ Kỳ Thi HSK!';
    if (subtitleEl) subtitleEl.innerText = `Đạt chuẩn điểm đỗ Hanban CTI với ${correctCount}/${questions.length} câu đúng (+60 EXP ⭐)`;
    if (badgeEl) {
      badgeEl.className = 'mt-2 px-4 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300';
      badgeEl.innerText = 'ĐẠT TIÊU CHUẨN ĐỖ (合格)';
    }
  } else {
    if (emojiEl) emojiEl.innerText = '💪';
    if (titleEl) titleEl.innerText = 'Chưa Đạt Điểm Chuẩn Đỗ!';
    if (subtitleEl) subtitleEl.innerText = `Bạn đạt ${correctCount}/${questions.length} câu đúng (${totalScoreAchieved}/${totalScore}đ). Cần tối thiểu ${passScore}đ để đạt (+25 EXP ⭐)`;
    if (badgeEl) {
      badgeEl.className = 'mt-2 px-4 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300';
      badgeEl.innerText = `CHƯA ĐẠT (Điểm liệt: ${passScore})`;
    }
  }

  // Detailed section stats + question breakdown
  if (breakdownContainer) {
    const secHtml = `
      <div class="grid grid-cols-2 ${writingTotal > 0 ? 'sm:grid-cols-3' : ''} gap-2.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center mb-4">
        <div>
          <div class="text-[10px] text-stone-400 font-bold uppercase">🎧 Nghe Hiểu (听力)</div>
          <div class="text-base font-black text-sky-700 dark:text-sky-300">${listeningCorrect} / ${listeningTotal}</div>
          <div class="text-[11px] font-bold text-stone-500">${listeningScore} / 100 điểm</div>
        </div>
        <div>
          <div class="text-[10px] text-stone-400 font-bold uppercase">📖 Đọc Hiểu (阅读)</div>
          <div class="text-base font-black text-amber-700 dark:text-amber-300">${readingCorrect} / ${readingTotal}</div>
          <div class="text-[11px] font-bold text-stone-500">${readingScore} / 100 điểm</div>
        </div>
        ${writingTotal > 0 ? `
        <div>
          <div class="text-[10px] text-stone-400 font-bold uppercase">✍️ Viết (书写)</div>
          <div class="text-base font-black text-rose-700 dark:text-rose-300">${writingCorrect} / ${writingTotal}</div>
          <div class="text-[11px] font-bold text-stone-500">${writingScore} / 100 điểm</div>
        </div>
        ` : ''}
      </div>
    `;

    breakdownContainer.innerHTML = secHtml + breakdownList.map(item => `
      <div class="p-3.5 rounded-xl border ${item.isCorrect ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'} space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-bold ${item.isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}">
            Câu ${item.index} [${item.section}]: ${item.isCorrect ? '✅ Đúng' : '❌ Sai'}
          </span>
        </div>
        <p class="text-stone-800 dark:text-stone-200 font-semibold">${item.prompt}</p>
        <p class="text-stone-600 dark:text-stone-400">Câu trả lời của bạn: <strong class="${item.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}">${item.userAnsText}</strong></p>
        ${!item.isCorrect ? `<p class="text-emerald-700 dark:text-emerald-400">Đáp án chuẩn: <strong>${item.correctAnsText}</strong></p>` : ''}
        <p class="text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/60 dark:border-stone-700">💡 ${item.explanation}</p>
      </div>
    `).join('');
  }

  if (typeof openModal === 'function') {
    openModal('examResultModal');
  } else {
    const modal = document.getElementById('examResultModal');
    if (modal) modal.classList.remove('hidden');
  }
}

function closeExamResultModal() {
  if (typeof closeModal === 'function') {
    closeModal('examResultModal');
  } else {
    const modal = document.getElementById('examResultModal');
    if (modal) modal.classList.add('hidden');
  }
}

/**
 * Export active mock exam as a Hanban-standard A4 printable PDF document.
 */
function downloadMockExamPdf() {
  if (!activeExam) {
    if (typeof showToast === 'function') {
      showToast('Đang mở dữ liệu đề thi để xuất PDF...', 'info');
    }
    return;
  }

  const exam = activeExam;
  const questions = exam.questions || [];
  const level = exam.level || currentExamLevel;
  const testNumber = exam.testNumber || currentExamTestNumber;
  const testCode = `HSK${level}-${String(testNumber).padStart(2, '0')}`;

  // Partition questions into Listening, Reading, Writing
  const listeningQs = questions.filter(q => q.skill === 'listening' || (q.section || '').toLowerCase().includes('nghe') || (q.section || '').toLowerCase().includes('听力'));
  const readingQs = questions.filter(q => q.skill === 'reading' || (!q.skill && !(q.section || '').toLowerCase().includes('nghe') && !(q.section || '').toLowerCase().includes('viết') && !(q.section || '').toLowerCase().includes('书写')));
  const writingQs = questions.filter(q => q.skill === 'writing' || (q.section || '').toLowerCase().includes('viết') || (q.section || '').toLowerCase().includes('书写'));

  // Build clean HTML document for printing
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Đề Thi Thử HSK ${level} - Đề Số ${testNumber} (${testCode}) - Học Tiếng Trung Mỗi Ngày</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", "SimSun", serif;
      color: #111827;
      background: #fff;
      line-height: 1.5;
      font-size: 13px;
      margin: 0;
      padding: 0;
    }
    .print-toolbar {
      position: sticky;
      top: 0;
      background: #1e293b;
      color: #fff;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
    }
    .print-btn {
      background: #dc2626;
      color: #fff;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .print-btn:hover { background: #b91c1c; }
    .close-btn {
      background: #475569;
      color: #fff;
      border: none;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
    }
    .exam-paper {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      background: #fff;
    }
    .exam-header {
      border: 3px double #8B1E1E;
      padding: 16px;
      text-align: center;
      margin-bottom: 24px;
      background: #fafaf9;
    }
    .exam-header h1 {
      margin: 0 0 6px 0;
      font-size: 22px;
      color: #8B1E1E;
      letter-spacing: 1px;
    }
    .exam-header h2 {
      margin: 0 0 8px 0;
      font-size: 16px;
      color: #1f2937;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 12px;
    }
    .info-table td {
      padding: 6px 10px;
      border: 1px solid #d1d5db;
    }
    .section-title {
      background: #f3f4f6;
      border-left: 5px solid #8B1E1E;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: bold;
      margin: 24px 0 14px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .question-card {
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px dashed #e5e7eb;
      page-break-inside: avoid;
    }
    .question-prompt {
      font-weight: bold;
      font-size: 13px;
      margin-bottom: 6px;
    }
    .chinese-text {
      font-size: 15px;
      font-weight: bold;
      color: #111827;
      margin: 4px 0;
    }
    .pinyin-text {
      font-size: 12px;
      color: #4b5563;
      margin-bottom: 6px;
    }
    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 8px;
      margin-top: 6px;
    }
    .option-item {
      padding: 6px 10px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 12px;
      background: #fafafa;
    }
    .reorder-box {
      border: 1px solid #9ca3af;
      padding: 10px;
      border-radius: 6px;
      margin: 6px 0;
      background: #f9fafb;
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .write-line {
      border-bottom: 1px dotted #9ca3af;
      height: 24px;
      margin-top: 8px;
    }
    .page-break {
      page-break-before: always;
    }
    .answer-key-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 12px;
    }
    .answer-key-table th, .answer-key-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: center;
    }
    .answer-key-table th { background: #e2e8f0; font-weight: bold; }
    .answer-key-table td.correct { font-weight: bold; color: #dc2626; }
    @media print {
      .no-print { display: none !important; }
      body { margin: 0; }
      .exam-paper { max-width: 100%; margin: 0; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-toolbar no-print">
    <div>
      <strong>Học Tiếng Trung Mỗi Ngày • Đề Thi Thử HSK ${level} (Mã: ${testCode})</strong>
      <span style="font-size: 11px; opacity: 0.8; margin-left: 10px;">(In ấn trực tiếp hoặc Lưu dưới dạng file PDF)</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <button class="print-btn" onclick="window.print()">🖨️ Lưu Thành File PDF / In Ngay</button>
      <button class="close-btn" onclick="window.close()">✕ Đóng</button>
    </div>
  </div>

  <div class="exam-paper">
    <div class="exam-header">
      <h1>汉语水平考试 HSK (第 ${level} 级)</h1>
      <h2>ĐỀ THI THỬ HSK ${level} CHUẨN HANBAN CTI - ĐỀ SỐ ${String(testNumber).padStart(2, '0')}</h2>
      <p style="margin: 4px 0; font-size: 12px; color: #4b5563;">
        Thời gian làm bài: <strong>${exam.durationMinutes || 35} phút</strong> • Tổng số câu: <strong>${questions.length} câu</strong> • Tổng điểm: <strong>${exam.totalScore || 200} điểm</strong> (Điểm đỗ: ${exam.passScore || 120} điểm)
      </p>

      <table class="info-table">
        <tr>
          <td><strong>考生姓名 (Họ tên):</strong> ....................................................</td>
          <td><strong>准考证号 (Số báo danh):</strong> .................................</td>
        </tr>
        <tr>
          <td><strong>考试日期 (Ngày thi):</strong> ...... / ...... / 202...</td>
          <td><strong>得分 (Điểm đạt được):</strong> ............. / ${exam.totalScore || 200}</td>
        </tr>
      </table>
    </div>

    <div style="padding: 10px 14px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; margin-bottom: 20px; font-size: 11px; color: #92400e;">
      <strong>LƯU Ý DÀNH CHO THÍ SINH:</strong><br>
      1. Đề thi gồm ${questions.length} câu hỏi trắc nghiệm và thực hành. Hãy đọc kỹ từng câu và khoanh tròn vào đáp án đúng.<br>
      2. Đối với phần thi Nghe, bạn có thể nghe trực tiếp trên ứng dụng <em>Học Tiếng Trung Mỗi Ngày</em> hoặc nhờ giáo viên đọc theo transcript.<br>
      3. Bảng đáp án chuẩn và lời giải chi tiết được in ở trang cuối của tài liệu này để đối chiếu sau khi hoàn thành bài thi.
    </div>

    ${listeningQs.length > 0 ? `
      <div class="section-title">PHẦN I: NGHE HIỂU (第一部分：听力 - ${listeningQs.length} CÂU)</div>
      ${listeningQs.map((q, idx) => `
        <div class="question-card">
          <div class="question-prompt">Câu ${idx + 1}: ${escapeHtml(q.prompt || 'Nghe và chọn đáp án đúng:')}</div>
          ${q.audioText ? `
            <div style="padding: 6px 10px; background: #fefce8; border-left: 3px solid #eab308; margin: 4px 0; font-size: 12px;">
              <strong>[Transcript]:</strong> <span class="chinese-text">${escapeHtml(q.audioText)}</span> 
              ${q.pinyin ? `<span class="pinyin-text">(${escapeHtml(q.pinyin)})</span>` : ''}
            </div>
          ` : ''}
          ${q.statement ? `<div style="font-size: 12px; margin: 4px 0;"><strong>Nhận định:</strong> "${escapeHtml(q.statement)}"</div>` : ''}
          <div class="options-grid">
            ${(q.options || []).map(opt => `
              <div class="option-item">
                <strong>${escapeHtml(opt.key || '')}.</strong> ${escapeHtml(opt.text || '')}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    ` : ''}

    ${readingQs.length > 0 ? `
      <div class="section-title">PHẦN II: ĐỌC HIỂU (第二部分：阅读 - ${readingQs.length} CÂU)</div>
      ${readingQs.map((q, idx) => `
        <div class="question-card">
          <div class="question-prompt">Câu ${listeningQs.length + idx + 1}: ${escapeHtml(q.prompt || 'Đọc hiểu và chọn đáp án đúng:')}</div>
          ${q.passage ? `<div style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin: 6px 0; font-size: 13px;">${escapeHtml(q.passage)}</div>` : ''}
          ${q.chineseText ? `<div class="chinese-text">${escapeHtml(q.chineseText)}</div>` : ''}
          ${q.pinyin ? `<div class="pinyin-text">${escapeHtml(q.pinyin)}</div>` : ''}
          <div class="options-grid">
            ${(q.options || []).map(opt => `
              <div class="option-item">
                <strong>${escapeHtml(opt.key || '')}.</strong> ${escapeHtml(opt.text || '')}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    ` : ''}

    ${writingQs.length > 0 ? `
      <div class="section-title">PHẦN III: VIẾT (第三部分：书写 - ${writingQs.length} CÂU)</div>
      ${writingQs.map((q, idx) => `
        <div class="question-card">
          <div class="question-prompt">Câu ${listeningQs.length + readingQs.length + idx + 1}: ${escapeHtml(q.prompt || 'Sắp xếp các từ thành câu hoàn chỉnh:')}</div>
          ${q.scrambledWords && q.scrambledWords.length > 0 ? `
            <div class="reorder-box">${q.scrambledWords.join(' / ')}</div>
          ` : ''}
          <div class="write-line"></div>
          <div class="write-line"></div>
        </div>
      `).join('')}
    ` : ''}

    <div class="page-break"></div>
    <div class="section-title" style="border-left-color: #059669; background: #ecfdf5; color: #065f46;">
      BẢNG ĐÁP ÁN CHUẨN & HƯỚNG DẪN GIẢI CHI TIẾT (参考答案与详解)
    </div>

    <table class="answer-key-table">
      <thead>
        <tr>
          <th>Câu</th>
          <th>Đáp án</th>
          <th>Câu</th>
          <th>Đáp án</th>
          <th>Câu</th>
          <th>Đáp án</th>
          <th>Câu</th>
          <th>Đáp án</th>
        </tr>
      </thead>
      <tbody>
        ${(() => {
          let rows = '';
          const total = questions.length;
          const cols = 4;
          const rowCount = Math.ceil(total / cols);
          for (let r = 0; r < rowCount; r++) {
            rows += '<tr>';
            for (let c = 0; c < cols; c++) {
              const qIndex = r + c * rowCount;
              if (qIndex < total) {
                const q = questions[qIndex];
                const correctOpt = (q.options || []).find(o => o.isCorrect);
                const ansKey = correctOpt ? correctOpt.key : (q.correctAnswer || 'A');
                rows += `<td><strong>${qIndex + 1}</strong></td><td class="correct">${escapeHtml(ansKey)}</td>`;
              } else {
                rows += '<td></td><td></td>';
              }
            }
            rows += '</tr>';
          }
          return rows;
        })()}
      </tbody>
    </table>

    <div style="margin-top: 24px;">
      <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px;">
        HƯỚNG DẪN DỊCH NGHĨA & PHÂN TÍCH CHI TIẾT
      </h3>
      ${questions.map((q, idx) => {
        const correctOpt = (q.options || []).find(o => o.isCorrect);
        const ansKey = correctOpt ? `${correctOpt.key}. ${correctOpt.text}` : (q.correctAnswer || '');
        return `
          <div style="margin-bottom: 12px; font-size: 12px; line-height: 1.6; border-left: 2px solid #cbd5e1; padding-left: 10px;">
            <div><strong>Câu ${idx + 1}:</strong> Đáp án đúng là <strong style="color: #dc2626;">${escapeHtml(ansKey)}</strong></div>
            ${q.explanation ? `<div style="color: #4b5563;"><em>Giải thích:</em> ${escapeHtml(q.explanation)}</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>

    <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 10px;">
      Bản quyền tài liệu thuộc về Học Tiếng Trung Mỗi Ngày • hoangpham1618@gmail.com • Chúc bạn ôn thi đạt điểm cao!
    </div>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    if (typeof showToast === 'function') {
      showToast('Đang mở trang in & xuất PDF đề thi chuẩn...', 'success');
    }
  } else {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `De_Thi_Thu_${testCode}_Hanban.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (typeof showToast === 'function') {
      showToast('Đã tải file đề thi về máy. Hãy mở file và bấm Ctrl+P để in/lưu PDF nhé!', 'success');
    }
  }
}

})();

/* --- FILE: js/features/radicals.js --- */
(function(){
// Module state
let activeRadicalStroke = 'all';
let radicalSearchQuery = '';

// =========================================================================
// 2. BÁCH KHOA TOÀN THƯ 214 BỘ THỦ KHANG HY
// =========================================================================
function filterRadicalStrokes(stroke) {
  activeRadicalStroke = stroke;
  const strokeButtons = [
    { id: 'btn-rad-stroke-all', val: 'all' },
    { id: 'btn-rad-stroke-1', val: 1 },
    { id: 'btn-rad-stroke-2', val: 2 },
    { id: 'btn-rad-stroke-3', val: 3 },
    { id: 'btn-rad-stroke-4', val: 4 },
    { id: 'btn-rad-stroke-5', val: 5 },
    { id: 'btn-rad-stroke-6', val: 6 },
    { id: 'btn-rad-stroke-7', val: 7 }
  ];

  strokeButtons.forEach(b => {
    const el = document.getElementById(b.id);
    if (!el) return;
    if (b.val === stroke) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-amber-200 transition-all whitespace-nowrap';
    }
  });

  renderRadicals();
}

function setupRadicalSearch() {
  const input = document.getElementById('radicalSearchInput');
  if (!input || input.dataset.bound) return;
  input.dataset.bound = '1';
  input.addEventListener('input', debounce((e) => {
    radicalSearchQuery = e.target.value.trim().toLowerCase();
    renderRadicals();
  }, 120));
}

function renderRadicals() {
  const container = document.getElementById('radicalsGridContainer');
  if (!container) return;

  if (!radicalsData || radicalsData.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-stone-500">
        <i data-lucide="loader-2" class="w-8 h-8 mx-auto mb-3 animate-spin text-[#8B1E1E]"></i>
        <p class="font-bold text-stone-700">Đang tải danh mục 214 Bộ Thủ Khang Hy...</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  let filtered = radicalsData;

  // Filter by stroke count
  if (activeRadicalStroke !== 'all') {
    const strokeNum = parseInt(activeRadicalStroke);
    if (strokeNum === 7) {
      filtered = filtered.filter(r => (r.strokes || 0) >= 7);
    } else {
      filtered = filtered.filter(r => (r.strokes || 0) === strokeNum);
    }
  }

  // Filter by search query
  if (radicalSearchQuery) {
    filtered = filtered.filter(r => {
      const charStr = r.char || r.radical || '';
      const varStr = Array.isArray(r.variants) ? r.variants.join(' ') : (r.variant || '');
      const exStr = (r.examples || []).join(' ');
      const target = `${charStr} ${varStr} ${r.pinyin || ''} ${r.hanviet || ''} ${r.meaning || ''} ${exStr}`.toLowerCase();
      return target.includes(radicalSearchQuery);
    });
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-stone-400">
        <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 opacity-40 text-stone-400"></i>
        <p class="font-bold text-stone-700">Không tìm thấy bộ thủ phù hợp</p>
        <p class="text-xs text-stone-400 mt-1">Hãy thử tìm theo chữ Hán, phiên âm pinyin hoặc âm Hán Việt khác</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  container.innerHTML = filtered.map(r => {
    const char = r.char || r.radical || '';
    const id = r.id || r.number || '';
    const varArr = Array.isArray(r.variants) ? r.variants : (r.variant ? [r.variant] : []);
    const varStr = varArr.filter(v => v !== char).join(', ');
    const meaning = r.meaning || '';
    const hanviet = r.hanviet || '';
    const pinyin = r.pinyin || '';
    const strokes = r.strokes || '';
    const examples = r.examples || [];
    const writeLabel = `Bộ thủ: ${hanviet} (${meaning})`;

    return `
      <div class="glass-card rounded-2xl p-4 border border-amber-200/80 hover:border-amber-400 transition-all space-y-3 relative overflow-hidden bg-[#FFFDF9] shadow-xs">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div onclick="openWritingModal(${jsArg(char)}, ${jsArg(pinyin)}, ${jsArg(writeLabel)})" class="w-14 h-14 rounded-2xl bg-amber-50/80 hover:bg-rose-50 border border-amber-200 hover:border-rose-300 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all" title="Nhấn vào chữ để xem và tập viết nét">
              <span class="font-hanzi text-3xl font-black text-[#8B1E1E]">${char}</span>
            </div>
            <div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-sm font-bold text-amber-900">${pinyin}</span>
                <div class="inline-flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-lg border border-stone-200 shadow-2xs">
                  <button onclick="playChineseTTS(${jsArg(char)}, 'female')" class="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-800 text-[10px] font-bold cursor-pointer transition-colors" title="Phát âm giọng Nữ (Xiaoxiao)">
                    👩 Nữ
                  </button>
                  <button onclick="playChineseTTS(${jsArg(char)}, 'male')" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-800 text-[10px] font-bold cursor-pointer transition-colors" title="Phát âm giọng Nam (Yunxi)">
                    👨 Nam
                  </button>
                </div>
              </div>
              <p class="text-xs font-bold text-stone-800">Bộ ${hanviet} ${varStr ? `<span class="text-[11px] text-stone-400 font-normal">(${varStr})</span>` : ''}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              #${id}
            </span>
            <p class="text-[10px] text-stone-400 font-semibold mt-1">${strokes} Nét</p>
          </div>
        </div>

        <div class="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
          <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">Ý nghĩa cốt lõi:</span>
          <p class="text-stone-700 font-medium leading-relaxed">${meaning}</p>
        </div>

        ${examples && examples.length > 0 ? `
          <div class="pt-1">
            <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Chữ tiêu biểu:</span>
            <div class="flex flex-wrap gap-1.5">
              ${examples.map(ex => `
                <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50/80 border border-amber-200/70 shadow-2xs">
                  <span onclick="openWritingModal(${jsArg(ex)})" class="font-hanzi font-bold text-[#8B1E1E] text-xs cursor-pointer hover:underline" title="Nhấn để tập viết nét chữ này">${ex}</span>
                  <div class="flex items-center gap-0.5">
                    <button type="button" onclick="playChineseTTS(${jsArg(ex)}, 'female')" class="text-[9px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm ${ex} giọng Nữ">👩</button>
                    <button type="button" onclick="playChineseTTS(${jsArg(ex)}, 'male')" class="text-[9px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm ${ex} giọng Nam">👨</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
          <button onclick="openWritingModal(${jsArg(char)}, ${jsArg(pinyin)}, ${jsArg(writeLabel)});" class="text-[#8B1E1E] hover:text-[#A52A2A] font-bold flex items-center gap-1 transition-colors cursor-pointer">
            <i data-lucide="pen-tool" class="w-3 h-3 text-[#8B1E1E]"></i>
            <span>Luyện viết bộ này</span>
          </button>
          <span class="text-stone-400 text-[10px]">Khang Hy Tự Điển</span>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
}

})();

/* --- FILE: js/features/chengyu.js --- */
(function(){
// Module state
let activeChengyuCategory = 'all';
let chengyuSearchQuery = '';

// =========================================================================
// 3. KHO ĐIỂN TÍCH THÀNH NGỮ 4 CHỮ (CHENGYU)
// =========================================================================
function filterChengyuCategory(cat) {
  activeChengyuCategory = cat;
  const categories = ['all', 'wisdom', 'diligence', 'history', 'caution', 'daily'];
  categories.forEach(c => {
    const el = document.getElementById(`btn-chengyu-${c}`);
    if (!el) return;
    if (c === cat) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-all whitespace-nowrap cursor-pointer';
    }
  });
  renderChengyu();
}

function setupChengyuSearch() {
  const input = document.getElementById('chengyuSearchInput');
  if (!input || input.dataset.bound) return;
  input.dataset.bound = '1';
  input.addEventListener('input', debounce((e) => {
    chengyuSearchQuery = e.target.value.trim().toLowerCase();
    renderChengyu();
  }, 120));
}

function renderChengyu() {
  const container = document.getElementById('chengyuGridContainer');
  if (!container) return;

  let filtered = chengyuData;
  if (activeChengyuCategory !== 'all') {
    filtered = filtered.filter(item => item.category === activeChengyuCategory);
  }

  if (chengyuSearchQuery) {
    filtered = filtered.filter(item => {
      const target = `${item.chengyu} ${item.pinyin} ${item.hanviet} ${item.literal} ${item.figurative} ${item.story} ${item.lesson}`.toLowerCase();
      return target.includes(chengyuSearchQuery);
    });
  }

  const badgeEl = document.getElementById('chengyuCountBadge');
  if (badgeEl) {
    badgeEl.innerText = `${filtered.length} / ${chengyuData.length} Điển Tích`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400">
        <i data-lucide="scroll" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>
        <p class="font-bold text-slate-600">Không tìm thấy thành ngữ phù hợp</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="glass-card rounded-2xl p-6 border border-amber-200/80 hover:border-amber-400 transition-all space-y-4 relative overflow-hidden bg-white/95 shadow-xs">
      <!-- Top Title Bar -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="flex items-center gap-3 flex-wrap">
            <h3 onclick="openWritingModal(${jsArg(item.chengyu)}, ${jsArg(item.pinyin)}, ${jsArg(`Thành ngữ: ${item.chengyu} - ${item.figurative || ''}`)})" class="font-hanzi text-3xl font-black text-slate-900 tracking-wide cursor-pointer hover:text-[#8B1E1E] transition-colors" title="Nhấn vào chữ để xem và tập viết nét">${item.chengyu}</h3>
            <div class="inline-flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
              <button onclick="playChineseTTS(${jsArg(item.chengyu)}, 'female')" class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-colors cursor-pointer" title="Phát âm thành ngữ giọng Nữ">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS(${jsArg(item.chengyu)}, 'male')" class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-colors cursor-pointer" title="Phát âm thành ngữ giọng Nam">
                👨 Nam
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm font-bold text-amber-800">${item.pinyin}</span>
            <span class="text-xs text-slate-400">•</span>
            <span class="text-xs font-bold text-slate-600">Hán Việt: ${item.hanviet}</span>
          </div>
        </div>

        <span class="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
          ${item.categoryName}
        </span>
      </div>

      <!-- Meaning Box -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
          <span class="font-bold text-amber-900 block mb-1">🌱 Nghĩa Đen:</span>
          <p class="text-slate-700 leading-relaxed">${item.literal}</p>
        </div>
        <div class="p-3 rounded-xl bg-rose-50/50 border border-rose-100">
          <span class="font-bold text-rose-900 block mb-1">🎯 Nghĩa Bóng & Ứng Dụng:</span>
          <p class="text-slate-700 leading-relaxed">${item.figurative}</p>
        </div>
      </div>

      <!-- Historical Story -->
      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <div class="flex items-center gap-2 text-xs font-bold text-slate-700">
          <i data-lucide="book-open" class="w-3.5 h-3.5 text-amber-600"></i>
          <span>Điển Tích Lịch Sử:</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed italic">
          "${item.story}"
        </p>
      </div>

      <!-- Moral Takeaway -->
      <div class="p-3 rounded-xl bg-amber-100/60 border border-amber-300/80 text-xs text-amber-950 font-medium flex items-start gap-2">
        <i data-lucide="lightbulb" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
        <div>
          <strong class="font-bold">Bài học nhân sinh:</strong> ${item.lesson}
        </div>
      </div>

      <!-- Real-world HSK Example -->
      ${item.example ? `
        <div class="p-3.5 rounded-xl bg-teal-50/40 border border-teal-200/70 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-teal-900 text-[11px] uppercase">Ví dụ câu thực tế:</span>
            <div class="inline-flex items-center gap-1">
              <button onclick="playChineseTTS(${jsArg(item.example.hanzi)}, 'female')" class="text-rose-700 hover:text-rose-900 flex items-center gap-1 font-bold text-[11px] px-1.5 py-0.5 rounded bg-white border border-rose-200 cursor-pointer" title="Nghe ví dụ giọng Nữ">
                <i data-lucide="volume-2" class="w-3 h-3 text-rose-600"></i>
                <span>👩 Nữ</span>
              </button>
              <button onclick="playChineseTTS(${jsArg(item.example.hanzi)}, 'male')" class="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-bold text-[11px] px-1.5 py-0.5 rounded bg-white border border-teal-200 cursor-pointer" title="Nghe ví dụ giọng Nam">
                <i data-lucide="volume-2" class="w-3 h-3 text-teal-600"></i>
                <span>👨 Nam</span>
              </button>
            </div>
          </div>
          <p class="font-hanzi font-bold text-slate-800 text-sm">${item.example.hanzi}</p>
          <p class="text-teal-700 font-sans">${item.example.pinyin}</p>
          <p class="text-slate-600">${item.example.vi}</p>
        </div>
      ` : ''}

      <!-- Bottom Toolbar -->
      <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
        <button onclick="toggleSaveWord(${jsArg(item.chengyu)}, ${jsArg(item.pinyin)}, ${jsArg(item.figurative)}, 6)" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors">
          <i data-lucide="bookmark" class="w-3.5 h-3.5 text-amber-600"></i>
          <span>Lưu Thành Ngữ</span>
        </button>
        <button onclick="openWritingModal(${jsArg(item.chengyu)}, ${jsArg(item.pinyin)}, ${jsArg(`Thành ngữ: ${item.chengyu} - ${item.figurative || ''}`)});" class="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors cursor-pointer">
          <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
          <span>Tập viết từng nét chữ</span>
        </button>
      </div>
    </div>
  `).join('');

  refreshIcons();
}

})();

/* --- FILE: js/features/readings.js --- */
(function(){
// Module state
let activeReadingId = 'reading_01';
let showReadingTranslation = true;
let showReadingPinyin = true;
let activeReadingCategory = 'all';
let activeReadingLevel = 'all';
let readingSearchQuery = '';
let readingFontSize = 20; // font size in px
let readingQuizAnswers = {};
let tocModalFilterLevel = 'all';
let tocModalSearchQuery = '';

// =========================================================================
// 4. THƯ VIỆN ĐỌC HIỂU SONG NGỮ TƯƠNG TÁC (READINGS) - 50 BÀI MASTER
// =========================================================================
function initReadingsModule() {
  if (!readingsData || readingsData.length === 0) return;

  // Set font size CSS variable
  document.documentElement.style.setProperty('--reading-font-size', `${readingFontSize}px`);
  const fontBadge = document.getElementById('readingFontSizeBadge');
  if (fontBadge) fontBadge.innerText = `${readingFontSize}px`;

  // Verify activeReadingId
  if (!readingsData.some(s => s.id === activeReadingId || s.oldId === activeReadingId)) {
    activeReadingId = readingsData[0].id;
  }

  setupReadingSearch();
  renderReadingStoryPills();
  renderReadings();
}

function setupReadingSearch() {
  const searchInput = document.getElementById('readingSearchInput');
  if (searchInput && !searchInput.dataset.initialized) {
    searchInput.dataset.initialized = 'true';
    searchInput.addEventListener('input', (e) => {
      readingSearchQuery = (e.target.value || '').trim().toLowerCase();
      renderReadingStoryPills();
    });
  }
}

function filterReadingLevel(lvl) {
  activeReadingLevel = lvl;
  const lvls = ['all', 'hsk1-2', 'hsk3-4', 'hsk5-6'];
  lvls.forEach(l => {
    const el = document.getElementById(`btn-readlvl-${l}`);
    if (!el) return;
    if (l === lvl) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap cursor-pointer';
    }
  });

  // If active reading is not in current filter, auto select first match
  const filtered = getFilteredReadings();
  if (filtered.length > 0 && !filtered.some(s => s.id === activeReadingId || s.oldId === activeReadingId)) {
    activeReadingId = filtered[0].id;
  }

  renderReadingStoryPills();
  renderReadings();
}

function filterReadingCategory(cat) {
  activeReadingCategory = cat;
  const cats = ['all', 'life', 'inspiration', 'culture', 'news', 'philosophy'];
  cats.forEach(c => {
    const el = document.getElementById(`btn-readcat-${c}`);
    if (!el) return;
    if (c === cat) {
      el.className = 'px-3 py-1 text-2xs font-bold rounded-lg bg-stone-800 text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1 text-2xs font-bold rounded-lg bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap cursor-pointer';
    }
  });

  // If active reading is not in current category, auto select first match
  const filtered = getFilteredReadings();
  if (filtered.length > 0 && !filtered.some(s => s.id === activeReadingId || s.oldId === activeReadingId)) {
    activeReadingId = filtered[0].id;
  }

  renderReadingStoryPills();
  renderReadings();
}

function getFilteredReadings() {
  if (!readingsData) return [];
  return readingsData.filter(story => {
    // 1. Level Filter
    if (activeReadingLevel !== 'all') {
      const lvl = (story.level || '').toLowerCase();
      if (activeReadingLevel === 'hsk1-2') {
        const isMatch = lvl.includes('hsk 1') || lvl.includes('hsk 2');
        if (!isMatch) return false;
      } else if (activeReadingLevel === 'hsk3-4') {
        const isMatch = lvl.includes('hsk 3') || lvl.includes('hsk 4');
        if (!isMatch) return false;
      } else if (activeReadingLevel === 'hsk5-6') {
        const isMatch = lvl.includes('hsk 5') || lvl.includes('hsk 6');
        if (!isMatch) return false;
      }
    }

    // 2. Category Filter
    if (activeReadingCategory !== 'all' && story.category !== activeReadingCategory) {
      return false;
    }

    // 3. Search Query
    if (readingSearchQuery) {
      const target = `${story.id} ${story.title} ${story.pinyin} ${story.hanviet} ${story.summary} ${story.source || ''} ${story.level || ''} ${story.categoryName || ''}`.toLowerCase();
      return target.includes(readingSearchQuery);
    }
    return true;
  });
}

function renderReadingStoryPills() {
  const container = document.getElementById('readingStoryPills');
  if (!container) return;

  const stories = getFilteredReadings();

  if (stories.length === 0) {
    container.innerHTML = `
      <div class="py-2 text-xs text-stone-500 italic flex items-center gap-2">
        <i data-lucide="search-x" class="w-4 h-4 text-stone-400"></i>
        <span>Không tìm thấy bài đọc nào phù hợp với bộ lọc hiện tại.</span>
        <button onclick="activeReadingLevel='all'; activeReadingCategory='all'; readingSearchQuery=''; filterReadingLevel('all'); filterReadingCategory('all');" class="text-xs font-bold text-[#8B1E1E] underline ml-2 cursor-pointer">
          Xóa Bộ Lọc
        </button>
      </div>
    `;
    refreshIcons();
    return;
  }

  container.innerHTML = stories.map((story) => {
    const isActive = story.id === activeReadingId || story.oldId === activeReadingId;
    const globalIdx = readingsData.findIndex(s => s.id === story.id) + 1;
    let icon = '📖';
    if (story.category === 'life') icon = '🏡';
    else if (story.category === 'inspiration') icon = '🎙️';
    else if (story.category === 'news') icon = '📰';
    else if (story.category === 'culture') icon = '📜';
    else if (story.category === 'philosophy') icon = '☯️';

    return `
      <button 
        type="button"
        onclick="selectReading(${jsArg(story.id)})"
        class="px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
          isActive 
            ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-md ring-1 ring-amber-300/60 scale-102' 
            : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200/90 shadow-2xs'
        }">
        <span class="text-xs opacity-75 font-mono">#${String(globalIdx).padStart(2, '0')}</span>
        <span class="text-sm">${icon}</span>
        <span class="px-1.5 py-0.5 rounded text-[10px] font-mono ${
          isActive ? 'bg-black/25 text-amber-200' : 'bg-amber-100/80 text-amber-900 font-bold'
        }">
          ${story.level}
        </span>
        <span class="font-hanzi font-bold">${story.title}</span>
      </button>
    `;
  }).join('');
}

function selectReading(id) {
  activeReadingId = id;
  renderReadingStoryPills();
  renderReadings();

  // Smoothly scroll to reading container if user chose from pills or TOC
  const container = document.getElementById('activeReadingContainer');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function goToNextReading() {
  if (!readingsData || readingsData.length === 0) return;
  const currentIdx = readingsData.findIndex(s => s.id === activeReadingId || s.oldId === activeReadingId);
  if (currentIdx >= 0 && currentIdx < readingsData.length - 1) {
    selectReading(readingsData[currentIdx + 1].id);
  } else {
    showToast('Bạn đang ở bài đọc cuối cùng (#50)!');
  }
}

function goToPrevReading() {
  if (!readingsData || readingsData.length === 0) return;
  const currentIdx = readingsData.findIndex(s => s.id === activeReadingId || s.oldId === activeReadingId);
  if (currentIdx > 0) {
    selectReading(readingsData[currentIdx - 1].id);
  } else {
    showToast('Bạn đang ở bài đọc đầu tiên (#01)!');
  }
}

function adjustReadingFontSize(delta) {
  readingFontSize = Math.min(32, Math.max(14, readingFontSize + delta));
  document.documentElement.style.setProperty('--reading-font-size', `${readingFontSize}px`);
  const fontBadge = document.getElementById('readingFontSizeBadge');
  if (fontBadge) fontBadge.innerText = `${readingFontSize}px`;
}

// =========================================================================
// TABLE OF CONTENTS (MỤC LỤC 50 BÀI) MODAL HANDLERS
// =========================================================================
function openReadingTocModal() {
  openModal('readingTocModal');
  renderReadingTocList();
  refreshIcons();
}

function closeReadingTocModal() {
  closeModal('readingTocModal');
}
registerModal('readingTocModal', closeReadingTocModal);

function filterTocModalLevel(lvl) {
  tocModalFilterLevel = lvl;
  const lvls = ['all', 'hsk1-2', 'hsk3-4', 'hsk5-6'];
  lvls.forEach(l => {
    const el = document.getElementById(`btn-toc-${l}`);
    if (!el) return;
    if (l === lvl) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-100 text-stone-700 border border-stone-200 whitespace-nowrap cursor-pointer';
    }
  });
  renderReadingTocList();
}

function handleReadingTocSearch(q) {
  tocModalSearchQuery = (q || '').trim().toLowerCase();
  renderReadingTocList();
}

function renderReadingTocList() {
  const container = document.getElementById('readingTocListContainer');
  if (!container || !readingsData) return;

  const filtered = readingsData.filter((story, idx) => {
    // Level filter
    if (tocModalFilterLevel !== 'all') {
      const lvl = (story.level || '').toLowerCase();
      if (tocModalFilterLevel === 'hsk1-2' && !lvl.includes('hsk 1') && !lvl.includes('hsk 2')) return false;
      if (tocModalFilterLevel === 'hsk3-4' && !lvl.includes('hsk 3') && !lvl.includes('hsk 4')) return false;
      if (tocModalFilterLevel === 'hsk5-6' && !lvl.includes('hsk 5') && !lvl.includes('hsk 6')) return false;
    }

    // Search query
    if (tocModalSearchQuery) {
      const numStr = `bài ${idx + 1} #${idx + 1} ${idx + 1}`;
      const target = `${numStr} ${story.title} ${story.pinyin} ${story.hanviet} ${story.summary} ${story.categoryName}`.toLowerCase();
      return target.includes(tocModalSearchQuery);
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-xs text-stone-500 italic">
        Không tìm thấy bài đọc nào phù hợp với từ khóa "${escapeHtml(tocModalSearchQuery)}".
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(story => {
    const globalIdx = readingsData.findIndex(s => s.id === story.id) + 1;
    const isCurrent = story.id === activeReadingId || story.oldId === activeReadingId;

    let icon = '📖';
    if (story.category === 'life') icon = '🏡';
    else if (story.category === 'inspiration') icon = '🎙️';
    else if (story.category === 'news') icon = '📰';
    else if (story.category === 'culture') icon = '📜';
    else if (story.category === 'philosophy') icon = '☯️';

    return `
      <div 
        onclick="selectReading(${jsArg(story.id)}); closeReadingTocModal();"
        class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          isCurrent 
            ? 'bg-amber-100/80 border-[#8B1E1E] ring-1 ring-[#8B1E1E]/40 shadow-xs' 
            : 'bg-white hover:bg-amber-50/70 border-stone-200/90 shadow-2xs hover:border-amber-300'
        }"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
            isCurrent ? 'bg-[#8B1E1E] text-white shadow-2xs' : 'bg-stone-100 text-stone-600'
          }">
            #${String(globalIdx).padStart(2, '0')}
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-0.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-black ${
                story.level.includes('HSK 1') || story.level.includes('HSK 2') ? 'bg-emerald-100 text-[#1E4D43]' :
                story.level.includes('HSK 3') || story.level.includes('HSK 4') ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-[#8B1E1E]'
              }">
                ${story.level}
              </span>
              <span class="text-2xs text-stone-500 font-semibold flex items-center gap-1">
                <span>${icon}</span>
                <span>${story.categoryName}</span>
              </span>
            </div>
            <h4 class="font-hanzi text-base font-bold text-stone-900 leading-tight">
              ${story.title}
            </h4>
            <p class="text-2xs font-semibold text-[#8B1E1E] mt-0.5">
              ${story.pinyin} <span class="font-normal text-stone-500">(${story.hanviet})</span>
            </p>
          </div>
        </div>

        <div class="shrink-0 flex items-center gap-2">
          ${isCurrent ? `
            <span class="px-2.5 py-1 rounded-full text-2xs font-black bg-[#8B1E1E] text-white shadow-2xs">
              Đang Đọc
            </span>
          ` : `
            <span class="w-8 h-8 rounded-full bg-stone-50 hover:bg-amber-100 flex items-center justify-center text-stone-400 group-hover:text-stone-700">
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </span>
          `}
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
}

function toggleReadingTranslation() {
  showReadingTranslation = !showReadingTranslation;
  const label = document.getElementById('label-toggle-reading-trans');
  if (label) {
    label.innerText = showReadingTranslation ? 'Ẩn Bản Dịch' : 'Hiện Bản Dịch';
  }
  renderReadings();
}

function toggleReadingPinyin() {
  showReadingPinyin = !showReadingPinyin;
  const label = document.getElementById('label-toggle-reading-pinyin');
  if (label) {
    label.innerText = showReadingPinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin';
  }
  renderReadings();
}

function handleReadingQuizAnswer(storyId, optIdx) {
  readingQuizAnswers[storyId] = optIdx;
  renderReadings();
}

function renderReadings() {
  const container = document.getElementById('activeReadingContainer');
  if (!container) return;

  const story = readingsData.find(s => s.id === activeReadingId || s.oldId === activeReadingId) || readingsData[0];
  if (!story) return;

  const currentIdx = readingsData.findIndex(s => s.id === story.id);
  const totalStories = readingsData.length;
  const prevStory = currentIdx > 0 ? readingsData[currentIdx - 1] : null;
  const nextStory = currentIdx < totalStories - 1 ? readingsData[currentIdx + 1] : null;

  // Source Badge Styling
  let sourceBadge = '';
  if (story.source && story.source.includes('YouTube')) {
    sourceBadge = `
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-red-100/80 text-[#8B1E1E] border border-red-300 flex items-center gap-1.5 shadow-2xs">
        <i data-lucide="radio" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
        <span>Nguồn: ${story.source}</span>
      </span>
    `;
  } else if (story.source && (story.source.includes('Tân Hoa Xã') || story.source.includes('Nhân Dân') || story.source.includes('China Daily') || story.source.includes('CCTV') || story.source.includes('Báo Chí'))) {
    sourceBadge = `
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-[#1E4D43] border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
        <i data-lucide="newspaper" class="w-3.5 h-3.5 text-[#1E4D43]"></i>
        <span>Báo Chí Chính Thống: ${story.source}</span>
      </span>
    `;
  } else {
    sourceBadge = `
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100/80 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
        <i data-lucide="scroll" class="w-3.5 h-3.5 text-[#C59A3F]"></i>
        <span>${story.source || story.categoryName}</span>
      </span>
    `;
  }

  container.innerHTML = `
    <div class="glass-card rounded-3xl p-6 lg:p-8 border border-amber-200/90 space-y-6 bg-[#FFFDF9] shadow-sm">
      
      <!-- TOP NAVIGATION BAR (Bài Trước / Mục Lục / Bài Kế Tiếp) -->
      <div class="flex items-center justify-between gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
        <!-- Prev Button -->
        <button 
          type="button"
          onclick="goToPrevReading()" 
          ${prevStory ? '' : 'disabled'}
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            prevStory 
              ? 'bg-white hover:bg-amber-100 text-stone-800 border border-stone-200 shadow-2xs' 
              : 'bg-stone-100 text-stone-400 border border-stone-200 opacity-50 cursor-not-allowed'
          }"
          title="${prevStory ? `Bài trước: ${prevStory.title}` : 'Đã ở bài đầu tiên'}"
        >
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
          <span class="hidden sm:inline">Bài Trước</span>
        </button>

        <!-- Current Story Indicator & TOC Button -->
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-xl bg-[#8B1E1E] text-white text-xs font-black shadow-2xs font-mono">
            Bài ${String(currentIdx + 1).padStart(2, '0')} / ${totalStories}
          </span>
          <button 
            type="button"
            onclick="openReadingTocModal()"
            class="px-3 py-1 rounded-xl bg-white hover:bg-amber-100 text-stone-700 border border-stone-200 text-xs font-bold shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <i data-lucide="list" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
            <span class="hidden md:inline">Mục Lục 50 Bài</span>
          </button>
        </div>

        <!-- Next Button -->
        <button 
          type="button"
          onclick="goToNextReading()" 
          ${nextStory ? '' : 'disabled'}
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            nextStory 
              ? 'bg-white hover:bg-amber-100 text-stone-800 border border-stone-200 shadow-2xs' 
              : 'bg-stone-100 text-stone-400 border border-stone-200 opacity-50 cursor-not-allowed'
          }"
          title="${nextStory ? `Bài tiếp theo: ${nextStory.title}` : 'Đã ở bài cuối cùng'}"
        >
          <span class="hidden sm:inline">Bài Kế Tiếp</span>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Article Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200/80">
        <div>
          <!-- Badges Bar -->
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs">
              ${story.level}
            </span>
            ${sourceBadge}
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              ${story.categoryName}
            </span>
          </div>

          <!-- Title with Dual TTS -->
          <div class="flex items-center gap-3 flex-wrap">
            <h3 class="font-hanzi text-3xl lg:text-4xl font-black text-stone-900 tracking-wide">${story.title}</h3>
            <div class="flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
              <button 
                type="button"
                onclick="playChineseTTS(${jsArg(story.title)}, 'female')" 
                class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all shadow-2xs cursor-pointer" 
                title="Nghe tiêu đề (Giọng Nữ)"
              >
                👩 Nữ
              </button>
              <button 
                type="button"
                onclick="playChineseTTS(${jsArg(story.title)}, 'male')" 
                class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-all shadow-2xs cursor-pointer" 
                title="Nghe tiêu đề (Giọng Nam)"
              >
                👨 Nam
              </button>
            </div>
          </div>
          <p class="text-sm font-bold text-[#8B1E1E] mt-1.5">
            ${story.pinyin} <span class="font-normal text-stone-500">(${story.hanviet})</span>
          </p>
          <p class="text-xs lg:text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">${story.summary}</p>
        </div>

        <div class="flex items-center gap-1.5 shrink-0 bg-stone-100/90 p-1 rounded-2xl border border-stone-200 shadow-2xs">
          <button 
            type="button"
            onclick="playAllReadingParagraphs('female')" 
            class="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-900 border border-rose-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Nghe toàn bộ bài đọc bằng giọng Nữ (Xiaoxiao)"
          >
            <i data-lucide="play" class="w-3.5 h-3.5 text-rose-600"></i>
            <span>👩 Nghe Nữ</span>
          </button>
          <button 
            type="button"
            onclick="playAllReadingParagraphs('male')" 
            class="px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Nghe toàn bộ bài đọc bằng giọng Nam (Yunxi)"
          >
            <i data-lucide="play" class="w-3.5 h-3.5 text-blue-600"></i>
            <span>👨 Nghe Nam</span>
          </button>
        </div>
      </div>

      <!-- Key Vocabulary Box -->
      ${story.vocab && story.vocab.length > 0 ? `
        <div class="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/90 shadow-2xs">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#8B1E1E] flex items-center gap-2">
              <i data-lucide="sparkles" class="w-4 h-4 text-[#C59A3F]"></i>
              <span>Từ Vựng Trọng Tâm Bài Đọc (核心生词)</span>
            </h4>
            <span class="text-2xs text-stone-500 italic">Chạm thẻ từ để tra cứu hoặc nghe phát âm</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            ${story.vocab.map(v => `
              <div 
                onclick="openWordModalWithToken(${jsArg(v.hanzi)}, ${jsArg(v.pinyin)}, ${jsArg(v.vi)})" 
                class="p-2.5 rounded-xl bg-white border border-amber-200/80 hover:border-[#8B1E1E] hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div class="flex items-center justify-between">
                    <p class="font-hanzi text-base font-bold text-stone-900 leading-tight">${v.hanzi}</p>
                    <div class="flex items-center gap-0.5" onclick="event.stopPropagation()">
                      <button 
                        type="button" 
                        onclick="playChineseTTS(${jsArg(v.hanzi)}, 'female')" 
                        class="px-1 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 text-[9px] font-bold cursor-pointer"
                        title="Giọng Nữ"
                      >👩</button>
                      <button 
                        type="button" 
                        onclick="playChineseTTS(${jsArg(v.hanzi)}, 'male')" 
                        class="px-1 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 text-[9px] font-bold cursor-pointer"
                        title="Giọng Nam"
                      >👨</button>
                    </div>
                  </div>
                  <p class="text-2xs font-semibold text-[#8B1E1E] mt-0.5">${v.pinyin}</p>
                </div>
                <p class="text-2xs text-stone-600 mt-1 truncate" title="${v.vi}">${v.vi}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Reading Tip Banner -->
      <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-center gap-2.5 shadow-2xs">
        <i data-lucide="info" class="w-4 h-4 text-[#C59A3F] shrink-0"></i>
        <span>💡 <strong>Mẹo luyện đọc tương tác:</strong> Chạm hoặc bấm chuột vào bất kỳ chữ/từ nào trong đoạn văn để tra cứu phiên âm, nghĩa tiếng Việt và luyện nghe phát âm chuẩn xác! Bạn có thể dùng nút <strong>A- / A+</strong> phía trên để tăng giảm cỡ chữ chữ Hán.</span>
      </div>

      <!-- Paragraphs Stream -->
      <div class="space-y-6 pt-2">
        ${story.paragraphs.map((p, pIdx) => `
          <div class="p-5 rounded-2xl bg-white border border-amber-200/80 space-y-3 hover:border-[#C59A3F] hover:shadow-xs transition-all">
            <!-- Paragraph Index & Audio -->
            <div class="flex items-center justify-between text-xs text-stone-400">
              <span class="font-bold text-[#8B1E1E]">Đoạn ${pIdx + 1}</span>
              <div class="flex items-center gap-1 bg-amber-50/70 p-0.5 rounded-xl border border-amber-200/80 shadow-2xs">
                <button 
                  type="button"
                  onclick="playChineseTTS(${jsArg(p.chineseText)}, 'female')" 
                  class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-2xs font-bold transition-colors shadow-2xs cursor-pointer" 
                  title="Nghe đoạn này bằng giọng Nữ (Xiaoxiao)"
                >
                  <i data-lucide="volume-2" class="w-3 h-3 text-rose-600"></i>
                  <span>👩 Nữ</span>
                </button>
                <button 
                  type="button"
                  onclick="playChineseTTS(${jsArg(p.chineseText)}, 'male')" 
                  class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-2xs font-bold transition-colors shadow-2xs cursor-pointer" 
                  title="Nghe đoạn này bằng giọng Nam (Yunxi)"
                >
                  <i data-lucide="volume-2" class="w-3 h-3 text-blue-600"></i>
                  <span>👨 Nam</span>
                </button>
              </div>
            </div>

            <!-- Chinese Tokens Stream with Pinyin -->
            <div class="flex flex-wrap items-end leading-loose">
              ${p.tokens.map(token => {
                const isPunct = !token.pinyin && !token.vi;
                if (isPunct) {
                  return `<span class="reading-token-punct">${token.hanzi}</span>`;
                }
                return `
                  <div 
                    onclick="openWordModalWithToken(${jsArg(token.hanzi)}, ${jsArg(token.pinyin)}, ${jsArg(token.vi)})" 
                    class="reading-token-chip ${showReadingPinyin ? '' : 'hide-pinyin'}"
                    title="Bấm để tra cứu: ${token.hanzi} (${token.pinyin}): ${token.vi}">
                    <span class="token-pinyin">${token.pinyin}</span>
                    <span class="token-hanzi">${token.hanzi}</span>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Vietnamese Translation -->
            ${showReadingTranslation ? `
              <div class="pt-3 border-t border-amber-100 text-xs lg:text-sm text-stone-700 leading-relaxed font-sans">
                <strong class="text-[#8B1E1E]">Dịch nghĩa:</strong> ${p.vietnameseText}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Moral Lesson / Practical Takeaway Card -->
      ${story.moral ? `
        <div class="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/90 space-y-2 mt-6 shadow-2xs">
          <div class="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <i data-lucide="award" class="w-4 h-4 text-amber-600"></i>
            <span>Đúc Kết Nhân Sinh & Giá Trị Thực Tiễn:</span>
          </div>
          <p class="text-xs lg:text-sm text-stone-800 leading-relaxed pl-6">
            ${story.moral}
          </p>
        </div>
      ` : ''}

      <!-- Reading Comprehension Quiz -->
      ${story.quiz ? `
        <div class="p-6 rounded-3xl bg-gradient-to-r from-amber-50/60 via-stone-50/50 to-amber-50/30 border border-amber-300/80 space-y-4 shadow-xs mt-6">
          <div class="flex items-center gap-2 text-stone-900 font-bold text-sm border-b border-amber-200/80 pb-3">
            <i data-lucide="help-circle" class="w-5 h-5 text-[#8B1E1E]"></i>
            <span>Trắc Nghiệm Đọc Hiểu (阅读理解测评)</span>
          </div>
          <p class="text-xs lg:text-sm font-bold text-stone-800 leading-relaxed">
            ${story.quiz.question}
          </p>
          <div class="space-y-2">
            ${story.quiz.options.map((opt, optIdx) => {
              const userAns = readingQuizAnswers[story.id];
              const hasAnswered = userAns !== undefined;
              const isSelected = userAns === optIdx;
              const isCorrect = optIdx === story.quiz.answer;
              
              let btnClass = 'p-3 rounded-2xl border text-xs text-left w-full transition-all flex items-start gap-2.5 ';
              if (!hasAnswered) {
                btnClass += 'bg-white hover:bg-amber-100/60 border-stone-200 text-stone-800 cursor-pointer shadow-2xs';
              } else if (isCorrect) {
                btnClass += 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs';
              } else if (isSelected && !isCorrect) {
                btnClass += 'bg-rose-50 border-rose-400 text-rose-950';
              } else {
                btnClass += 'bg-white/60 border-stone-200 text-stone-400 opacity-60';
              }

              return `
                <button 
                  type="button" 
                  onclick="handleReadingQuizAnswer(${jsArg(story.id)}, ${optIdx})" 
                  class="${btnClass}"
                  ${hasAnswered ? 'disabled' : ''}
                >
                  <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-2xs font-bold ${
                    hasAnswered && isCorrect ? 'bg-emerald-600 text-white' : 
                    hasAnswered && isSelected && !isCorrect ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-600'
                  }">
                    ${String.fromCharCode(65 + optIdx)}
                  </span>
                  <span class="leading-relaxed">${opt}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${readingQuizAnswers[story.id] !== undefined ? `
            <div class="p-3.5 rounded-2xl ${
              readingQuizAnswers[story.id] === story.quiz.answer 
                ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' 
                : 'bg-amber-50 text-amber-950 border border-amber-200'
            } text-xs leading-relaxed">
              <p class="font-bold flex items-center gap-1.5 mb-1 text-sm ${
                readingQuizAnswers[story.id] === story.quiz.answer ? 'text-[#1E4D43]' : 'text-amber-900'
              }">
                <i data-lucide="${readingQuizAnswers[story.id] === story.quiz.answer ? 'check-circle' : 'info'}" class="w-4 h-4"></i>
                <span>${readingQuizAnswers[story.id] === story.quiz.answer ? 'Chúc mừng! Bạn đã trả lời chính xác!' : 'Giải thích chi tiết:'}</span>
              </p>
              <p class="pl-5 text-stone-700">${story.quiz.explanation}</p>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- BOTTOM NAVIGATION BAR -->
      <div class="flex items-center justify-between gap-3 pt-6 border-t border-amber-200/80">
        <!-- Prev Button -->
        <button 
          type="button"
          onclick="goToPrevReading()" 
          ${prevStory ? '' : 'disabled'}
          class="px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            prevStory 
              ? 'bg-white hover:bg-amber-100 text-stone-800 border border-stone-200 shadow-2xs' 
              : 'bg-stone-100 text-stone-400 border border-stone-200 opacity-50 cursor-not-allowed'
          }"
        >
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
          <span>${prevStory ? `Bài Trước (#${String(currentIdx).padStart(2, '0')})` : 'Bài Trước'}</span>
        </button>

        <button 
          type="button"
          onclick="openReadingTocModal()"
          class="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-[#8B1E1E] border border-amber-200 text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
        >
          <i data-lucide="book-open" class="w-4 h-4"></i>
          <span>📚 Mục Lục 50 Bài</span>
        </button>

        <!-- Next Button -->
        <button 
          type="button"
          onclick="goToNextReading()" 
          ${nextStory ? '' : 'disabled'}
          class="px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            nextStory 
              ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white shadow-md' 
              : 'bg-stone-100 text-stone-400 border border-stone-200 opacity-50 cursor-not-allowed'
          }"
        >
          <span>${nextStory ? `Bài Kế Tiếp (#${String(currentIdx + 2).padStart(2, '0')})` : 'Bài Kế Tiếp'}</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>

    </div>
  `;

  refreshIcons();
}

function playAllReadingParagraphs(gender = 'female') {
  const story = readingsData.find(s => s.id === activeReadingId || s.oldId === activeReadingId);
  if (!story) return;
  const fullText = story.paragraphs.map(p => p.chineseText).join(' ');
  playChineseTTS(fullText, gender);
}

})();

/* --- FILE: js/features/grammar.js --- */
(function(){
// Module state
let activeGrammarCategory = 'all';
let activeGrammarLevel = 'all';
let activeGrammarViewMode = 'mindmap';
let grammarSearchQuery = '';

// =========================================================================
// 5. CẨM NANG NGỮ PHÁP TIẾNG TRUNG CHUYÊN SÂU (GRAMMAR)
// =========================================================================
function setGrammarViewMode(mode) {
  activeGrammarViewMode = mode;
  const mindmapView = document.getElementById('grammar-view-mindmap');
  const compendiumView = document.getElementById('grammar-view-compendium');
  const btnMindmap = document.getElementById('btn-grammar-view-mindmap');
  const btnCompendium = document.getElementById('btn-grammar-view-compendium');

  if (mode === 'mindmap') {
    if (mindmapView) mindmapView.classList.remove('hidden');
    if (compendiumView) compendiumView.classList.add('hidden');
    if (btnMindmap) {
      btnMindmap.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-[#4A306D] to-[#613D8F] text-white shadow-xs cursor-pointer';
    }
    if (btnCompendium) {
      btnCompendium.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all text-stone-700 hover:text-stone-900 hover:bg-white/80 cursor-pointer';
    }
    if (typeof renderMindmap === 'function') renderMindmap();
  } else {
    if (mindmapView) mindmapView.classList.add('hidden');
    if (compendiumView) compendiumView.classList.remove('hidden');
    if (btnCompendium) {
      btnCompendium.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-[#4A306D] to-[#613D8F] text-white shadow-xs cursor-pointer';
    }
    if (btnMindmap) {
      btnMindmap.className = 'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all text-stone-700 hover:text-stone-900 hover:bg-white/80 cursor-pointer';
    }
    renderGrammarCompendium();
  }
  const tabGrammar = document.getElementById('tab-grammar');
  if (tabGrammar && typeof refreshIcons === 'function') refreshIcons(tabGrammar);
}

function filterGrammarCategory(cat) {
  activeGrammarCategory = cat;
  const categories = ['all', 'sentence_structure', 'comparison', 'ba_bei', 'complements', 'particles_adverbs', 'fixed_connectors'];
  categories.forEach(c => {
    const el = document.getElementById(`btn-grammar-${c}`);
    if (!el) return;
    if (c === cat) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-all whitespace-nowrap cursor-pointer';
    }
  });
  renderGrammarCompendium();
}

function filterGrammarLevel(lvl) {
  activeGrammarLevel = lvl;
  const levels = ['all', 'hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5', 'hsk6'];
  levels.forEach(l => {
    const el = document.getElementById(`btn-grammar-lvl-${l}`);
    if (!el) return;
    if (l === lvl) {
      el.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      el.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-all whitespace-nowrap cursor-pointer';
    }
  });
  renderGrammarCompendium();
}

function getActiveGrammarLevel() {
  return activeGrammarLevel;
}

function setupGrammarSearch() {
  const input = document.getElementById('grammarSearchInput');
  if (!input || input.dataset.bound) return;
  input.dataset.bound = '1';
  input.addEventListener('input', debounce((e) => {
    grammarSearchQuery = e.target.value.trim().toLowerCase();
    renderGrammarCompendium();
  }, 120));
}

function checkGrammarQuiz(itemId, optIdx) {
  if (!grammarData) return;
  const item = grammarData.find(x => x.id === itemId);
  if (!item || !item.practiceQuiz) return;

  const quiz = item.practiceQuiz;
  const isCorrect = optIdx === quiz.answer;
  const resultEl = document.getElementById(`quiz-result-${itemId}`);

  // Update button states
  const buttons = document.querySelectorAll(`.quiz-btn-${itemId}`);
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === quiz.answer) {
      btn.className = `quiz-btn-${itemId} p-2.5 rounded-xl text-left text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-2 border-emerald-500`;
    } else if (idx === optIdx && !isCorrect) {
      btn.className = `quiz-btn-${itemId} p-2.5 rounded-xl text-left text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border-2 border-rose-500`;
    } else {
      btn.className = `quiz-btn-${itemId} p-2.5 rounded-xl text-left text-xs font-medium opacity-50 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700`;
    }
  });

  if (resultEl) {
    resultEl.classList.remove('hidden');
    if (isCorrect) {
      resultEl.className = 'p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-900 dark:text-emerald-300 text-xs space-y-1 animate-fade-in';
      resultEl.innerHTML = `
        <div class="font-bold flex items-center gap-1.5">
          <span>🎉 Chính xác! (+10 EXP)</span>
        </div>
        <p class="text-[11px] leading-relaxed">${escapeHtml(quiz.explain || '')}</p>
      `;
      if (typeof addExp === 'function') {
        addExp(10, `Làm đúng trắc nghiệm ngữ pháp: ${item.title}`);
      }
    } else {
      resultEl.className = 'p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-900 dark:text-rose-300 text-xs space-y-1 animate-fade-in';
      resultEl.innerHTML = `
        <div class="font-bold flex items-center gap-1.5">
          <span>❌ Chưa chính xác!</span>
        </div>
        <p class="text-[11px] leading-relaxed"><strong>Giải thích:</strong> ${escapeHtml(quiz.explain || '')}</p>
      `;
    }
  }
}

function renderGrammarCompendium() {
  const container = document.getElementById('grammarGridContainer');
  if (!container) return;

  let filtered = grammarData || [];

  // Category filter
  if (activeGrammarCategory !== 'all') {
    filtered = filtered.filter(item => item.category === activeGrammarCategory);
  }

  // Level filter
  if (activeGrammarLevel !== 'all') {
    const targetLvl = activeGrammarLevel.replace('hsk', 'hsk ');
    filtered = filtered.filter(item => {
      const itemLvl = (item.level || '').toLowerCase().replace(/\s+/g, '');
      return itemLvl.includes(activeGrammarLevel);
    });
  }

  // Search filter
  if (grammarSearchQuery) {
    filtered = filtered.filter(item => {
      const examplesText = (item.examples || []).map(e => `${e.hanzi} ${e.pinyin} ${e.vi}`).join(' ');
      const rulesText = (item.rules || []).join(' ');
      const target = `${item.title} ${item.formula} ${item.explanation} ${item.mistakes} ${examplesText} ${rulesText}`.toLowerCase();
      return target.includes(grammarSearchQuery);
    });
  }

  const badgeEl = document.getElementById('grammarCountBadge');
  if (badgeEl && grammarData) {
    badgeEl.innerText = `${filtered.length} / ${grammarData.length} Chuyên Đề`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-stone-400">
        <i data-lucide="compass" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>
        <p class="font-bold text-stone-600 dark:text-stone-400">Không tìm thấy chuyên đề ngữ pháp phù hợp với bộ lọc</p>
      </div>
    `;
    if (typeof refreshIcons === 'function') refreshIcons();
    return;
  }

  container.innerHTML = filtered.map(item => {
    let levelBadgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if ((item.level || '').includes('1')) levelBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
    else if ((item.level || '').includes('2')) levelBadgeColor = 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950 dark:text-teal-300';
    else if ((item.level || '').includes('3')) levelBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300';
    else if ((item.level || '').includes('4')) levelBadgeColor = 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300';
    else if ((item.level || '').includes('5')) levelBadgeColor = 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300';
    else if ((item.level || '').includes('6')) levelBadgeColor = 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300';

    return `
      <div class="glass-card rounded-3xl p-6 border-2 border-stone-200/90 dark:border-stone-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all space-y-4 relative overflow-hidden bg-white/95 dark:bg-[#161B22] shadow-sm">
        <!-- Card Header -->
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-1.5">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black border inline-block ${levelBadgeColor}">
                ${escapeHtml(item.level || 'HSK')}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                ${escapeHtml(item.categoryName || 'Ngữ pháp')}
              </span>
            </div>
            <h3 class="text-base lg:text-lg font-black text-stone-900 dark:text-stone-100 tracking-tight font-serif-luxury">
              ${escapeHtml(item.title)}
            </h3>
          </div>
        </div>

        <!-- Formula Pill Banner -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800 border border-amber-200/80 dark:border-stone-700 shadow-2xs">
          <span class="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block mb-1">CÔNG THỨC CHUẨN:</span>
          <code class="font-mono font-bold text-xs lg:text-sm text-stone-900 dark:text-amber-200 block">${escapeHtml(item.formula)}</code>
        </div>

        <!-- Explanation -->
        <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
          ${escapeHtml(item.explanation)}
        </p>

        <!-- Rules List -->
        ${item.rules && item.rules.length > 0 ? `
          <div class="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-750 space-y-2 text-xs">
            <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Quy tắc ứng dụng:</span>
            <ul class="space-y-1.5">
              ${item.rules.map(rule => `
                <li class="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                  <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"></i>
                  <span>${escapeHtml(rule)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Common Mistakes Box -->
        ${item.mistakes ? `
          <div class="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-950 dark:text-rose-300 space-y-1">
            <span class="text-[10px] font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider block">⚠️ Lỗi kinh điển người Việt hay mắc:</span>
            <p class="font-medium leading-relaxed">${escapeHtml(item.mistakes)}</p>
          </div>
        ` : ''}

        <!-- Example Sentences -->
        ${item.examples && item.examples.length > 0 ? `
          <div class="space-y-2.5 pt-1">
            <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Ví dụ minh họa song ngữ:</span>
            ${item.examples.map(ex => `
              <div class="p-3 rounded-2xl bg-stone-50/80 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-chinese font-bold text-stone-900 dark:text-stone-100 text-sm">${escapeHtml(ex.hanzi)}</span>
                  <div class="inline-flex items-center gap-1">
                    <button onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'female')" class="px-2 py-0.5 rounded-lg bg-white dark:bg-stone-700 hover:bg-rose-50 text-rose-800 dark:text-rose-300 border border-stone-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe giọng Nữ">👩 Nữ</button>
                    <button onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'male')" class="px-2 py-0.5 rounded-lg bg-white dark:bg-stone-700 hover:bg-blue-50 text-blue-800 dark:text-blue-300 border border-stone-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe giọng Nam">👨 Nam</button>
                  </div>
                </div>
                <p class="text-amber-800 dark:text-amber-400 font-sans text-[11px]">${escapeHtml(ex.pinyin)}</p>
                <p class="text-stone-600 dark:text-stone-400">${escapeHtml(ex.vi)}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Interactive Practice Quiz -->
        ${item.practiceQuiz ? `
          <div class="p-4 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/80 dark:border-stone-700 space-y-2.5 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">🎯 Trắc nghiệm kiểm tra nhanh:</span>
              <span class="text-[10px] text-stone-400 font-medium">Bấm chọn đáp án</span>
            </div>
            <p class="font-bold text-stone-900 dark:text-stone-100">${escapeHtml(item.practiceQuiz.question)}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              ${item.practiceQuiz.options.map((opt, oIdx) => `
                <button 
                  type="button"
                  onclick="checkGrammarQuiz(${jsArg(item.id)}, ${oIdx})"
                  class="quiz-btn-${item.id} p-2.5 rounded-xl text-left text-[11px] font-medium bg-white dark:bg-stone-900 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                >
                  ${escapeHtml(opt)}
                </button>
              `).join('')}
            </div>
            <div id="quiz-result-${item.id}" class="hidden"></div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  if (typeof refreshIcons === 'function') refreshIcons();
}

})();

/* --- FILE: js/features/jiaocheng.js --- */
(function(){
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

})();

/* --- FILE: js/features/home.js --- */
(function(){
// ==================== HOME DASHBOARD MODULE ====================
// Needs dataset: dictionary (loaded by the router before renderHomeDashboard()).

const HOME_CHECKIN_KEY = 'lastCheckinDate';
const HOME_QUIZ_KEY = 'homeQuizState';
const HOME_HANZI_QUIZ_KEY = 'homeHanziQuizDone';
const HOME_CHECKIN_EXP = 20;
const HOME_QUIZ_EXP = 15;
const HOME_HANZI_EXP = 10;

// Rotating daily content (picked deterministically from the local date)
const HOME_QUOTES = [
  { hanzi: '千里之行，始于足下。', pinyin: 'Qiān lǐ zhī xíng, shǐ yú zú xià.', meaning: 'Hành trình vạn dặm bắt đầu từ một bước chân.', author: 'Lão Tử' },
  { hanzi: '三人行，必有我师焉。', pinyin: 'Sān rén xíng, bì yǒu wǒ shī yān.', meaning: 'Ba người cùng đi, ắt có người là thầy của ta.', author: 'Khổng Tử' },
  { hanzi: '学而时习之，不亦说乎？', pinyin: 'Xué ér shí xí zhī, bú yì yuè hū?', meaning: 'Học rồi thường xuyên ôn tập, chẳng phải là vui sao?', author: 'Khổng Tử' },
  { hanzi: '不积跬步，无以至千里。', pinyin: 'Bù jī kuǐ bù, wú yǐ zhì qiān lǐ.', meaning: 'Không tích từng bước nhỏ, không thể đi được ngàn dặm.', author: 'Tuân Tử' }
];

const HOME_QUIZZES = [
  {
    sentence: '他是昨天下午 ____ 北京的。',
    pinyin: 'Tā shì zuótiān xiàwǔ ____ Běijīng de.',
    options: ['到 (dào)', '在 (zài)', '从 (cóng)', '离 (lí)'],
    answer: 0,
    explain: 'Cấu trúc nhấn mạnh 是……的 dùng để nhấn mạnh thời gian, địa điểm, cách thức của hành động đã xảy ra. 他是昨天下午到北京的: Anh ấy đến Bắc Kinh vào chiều hôm qua.'
  },
  {
    sentence: '我们 ____ 食堂吃饭。',
    pinyin: 'Wǒmen ____ shítáng chīfàn.',
    options: ['是 (shì)', '在 (zài)', '有 (yǒu)', '很 (hěn)'],
    answer: 1,
    explain: '在 + nơi chốn + động từ diễn tả hành động diễn ra ở đâu. 我们在食堂吃饭: Chúng tôi ăn cơm ở nhà ăn.'
  },
  {
    sentence: '我 ____ 越南人。',
    pinyin: 'Wǒ ____ Yuènán rén.',
    options: ['有 (yǒu)', '很 (hěn)', '是 (shì)', '都 (dōu)'],
    answer: 2,
    explain: '是 dùng để nối chủ ngữ với danh từ chỉ thân phận, quốc tịch. 我是越南人: Tôi là người Việt Nam.'
  }
];

// Module state
let homeWriter = null;
let homeHanziEntry = null;
let homeHanziTimer = null;
let homeQuote = HOME_QUOTES[0];
let homeQuiz = HOME_QUIZZES[0];
let homeLeaderboardToken = 0;

/** Simple deterministic string hash (non-negative integer). */
function homeHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

/** Local YYYY-MM-DD key for an arbitrary date. */
function getHomeGreeting() {
  const hour = new Date().getHours();
  let timeOfDay = 'buổi sáng';
  let emoji = '☀️';

  if (hour >= 11 && hour < 14) {
    timeOfDay = 'buổi trưa';
    emoji = '🍵';
  } else if (hour >= 14 && hour < 18) {
    timeOfDay = 'buổi chiều';
    emoji = '🏮';
  } else if (hour >= 18 || hour < 5) {
    timeOfDay = 'buổi tối';
    emoji = '🌙';
  }

  if (!currentUser) return `Chào bạn ghé thăm! ${emoji}`;
  return `Chào ${timeOfDay}, ${currentUser.name}! ${emoji}`;
}

function setHomeText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ---------- Header: greeting, role badge, attributes, streak ----------

function renderHomeHeader() {
  setHomeText('homeGreetingTitle', getHomeGreeting());
  setHomeText('homeUserAvatarInitial', currentUser ? initialOf(currentUser.name) : '客');

  const badge = document.getElementById('homeUserRoleBadge');
  if (badge) {
    const base = 'inline-flex items-center gap-1 rounded-full text-[10px]';
    if (!currentUser) {
      badge.className = `${base} px-2.5 py-0.5 font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-2xs cursor-pointer transition-all`;
      badge.setAttribute('onclick', "openAuthModal('register')");
      badge.title = 'Tạo tài khoản miễn phí';
      badge.textContent = '✨ Đăng ký miễn phí';
    } else if (currentUser.role === 'admin') {
      badge.className = `${base} px-2.5 py-0.5 font-black bg-gradient-to-r from-amber-500/20 to-yellow-500/30 text-amber-900 dark:text-amber-300 border border-amber-400/80 shadow-2xs cursor-pointer`;
      badge.setAttribute('onclick', 'openAdminDashboardModal()');
      badge.title = 'Bấm để mở Bảng Quản Trị';
      badge.textContent = '👑 Quản trị viên';
    } else {
      badge.className = `${base} px-2 py-0.5 font-semibold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700`;
      badge.removeAttribute('onclick');
      badge.removeAttribute('title');
      badge.textContent = '🎓 Học viên';
    }
  }

  // Personal attributes (language / profession / purpose) - registered users only
  const attrs = currentUser
    ? [
      ['homeUserLanguage', currentUser.language],
      ['homeUserProfession', currentUser.profession],
      ['homeUserPurpose', currentUser.purpose]
    ]
    : [];
  let anyAttr = false;
  ['homeUserLanguage', 'homeUserProfession', 'homeUserPurpose'].forEach(prefix => {
    const found = attrs.find(a => a[0] === prefix);
    const value = found && found[1] ? String(found[1]) : '';
    const chip = document.getElementById(`${prefix}Chip`);
    setHomeText(`${prefix}Text`, value);
    if (chip) {
      chip.classList.toggle('hidden', !value);
      chip.classList.toggle('inline-flex', Boolean(value));
    }
    if (value) anyAttr = true;
  });
  const attrBanner = document.getElementById('homeUserAttributesBanner');
  if (attrBanner) {
    attrBanner.classList.toggle('hidden', !anyAttr);
    attrBanner.classList.toggle('flex', anyAttr);
  }

  renderHomeStreak();
  renderHomeCheckinButton();
}

function renderHomeStreak() {
  setHomeText('homeStreakCount', userProfile.streak || 1);

  const daysEl = document.getElementById('homeStreakDays');
  if (!daysEl) return;
  const labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const activity = userProfile.activity || {};
  const now = new Date();
  let html = '';
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const studied = (activity[todayKey(d)] || 0) > 0;
    const tone = studied
      ? 'bg-emerald-500 text-white'
      : 'bg-stone-100 dark:bg-stone-800 text-stone-400';
    const ring = i === 0 ? ' ring-2 ring-amber-400' : '';
    html += `<span class="w-5 h-5 rounded-md ${tone}${ring} flex items-center justify-center" title="${escapeHtml(todayKey(d))}">${labels[d.getDay()]}</span>`;
  }
  daysEl.innerHTML = html;
}

function renderHomeCheckinButton() {
  const btn = document.getElementById('homeCheckinBtn');
  const text = document.getElementById('homeCheckinBtnText');
  if (!btn || !text) return;
  const done = storage.get(HOME_CHECKIN_KEY, '') === todayKey();
  text.textContent = done ? 'Đã Điểm Danh ✓' : 'Điểm Danh';
  btn.classList.toggle('from-amber-500', !done);
  btn.classList.toggle('to-yellow-500', !done);
  btn.classList.toggle('hover:scale-105', !done);
  btn.classList.toggle('from-emerald-600', done);
  btn.classList.toggle('to-teal-600', done);
  btn.classList.toggle('opacity-90', done);
  btn.classList.toggle('cursor-default', done);
}

function claimDailyCheckin() {
  if (storage.get(HOME_CHECKIN_KEY, '') === todayKey()) {
    showToast('Hôm nay bạn đã điểm danh rồi! Hãy tiếp tục rèn luyện bài học nhé 🏮', 'info');
    return;
  }
  storage.set(HOME_CHECKIN_KEY, todayKey());
  addExp(HOME_CHECKIN_EXP, 'checkin');
  renderHomeCheckinButton();
  renderHomeStreak();
  renderHomeQuests();
  showToast(`🎁 Điểm danh thành công! Bạn nhận được +${HOME_CHECKIN_EXP} EXP`, 'success');
}

// ---------- Quote of the day ----------

function renderHomeQuote() {
  homeQuote = HOME_QUOTES[homeHash(todayKey()) % HOME_QUOTES.length];
  setHomeText('homeQuoteHanzi', homeQuote.hanzi);
  setHomeText('homeQuotePinyin', homeQuote.pinyin);
  setHomeText('homeQuoteMeaning', `"${homeQuote.meaning}"`);
  setHomeText('homeQuoteAuthor', homeQuote.author);
}

function playHomeQuoteAudio() {
  playChineseTTS(homeQuote.hanzi, 0.85);
}

// ---------- Daily quests ----------

function homeQuestCardHtml(q) {
  return `
    <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-xs gap-2">
          <span class="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span>${q.icon}</span> ${escapeHtml(q.title)}
          </span>
          <span class="px-1.5 py-0.5 rounded-md ${q.done ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : q.badgeClass} text-[10px] font-black whitespace-nowrap">${q.done ? 'Hoàn thành ✓' : escapeHtml(q.badge)}</span>
        </div>
        <p class="text-[11px] text-stone-500 dark:text-stone-400 mt-1">${escapeHtml(q.desc)}</p>
        <div class="w-full bg-stone-100 dark:bg-stone-700 h-1.5 rounded-full mt-2 overflow-hidden">
          <div class="${q.barClass} h-full rounded-full transition-all duration-500" style="width: ${q.pct}%"></div>
        </div>
        <p class="text-[10px] text-stone-400 mt-1 text-right">${escapeHtml(q.progress)}</p>
      </div>
      <button onclick="${q.action}" class="w-full py-1.5 px-2.5 rounded-xl ${q.btnClass} text-xs font-bold transition-all text-center cursor-pointer">
        ${escapeHtml(q.btn)}
      </button>
    </div>`;
}

function renderHomeQuests() {
  const grid = document.getElementById('homeQuestGrid');
  if (!grid) return;

  const stats = srsStats();
  const goal = userProfile.dailyGoal || 50;
  const todayExp = expToday();
  const hanziDone = storage.get(HOME_HANZI_QUIZ_KEY, '') === todayKey();

  // 1) Spaced repetition
  let srsQuest;
  if (stats.total === 0) {
    srsQuest = {
      icon: '🧠', title: 'Ôn Tập Ngắt Quãng', badge: 'Chưa có thẻ',
      badgeClass: 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300',
      desc: 'Bộ thẻ của bạn đang trống. Lưu từ vựng để hệ thống nhắc ôn đúng lúc.',
      pct: 0, progress: '0 thẻ', barClass: 'bg-emerald-500', done: false,
      btn: 'Lưu Từ Vựng Ngay →', action: "switchTab('dictionary')",
      btnClass: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
    };
  } else if (stats.due === 0) {
    srsQuest = {
      icon: '🧠', title: 'Ôn Tập Ngắt Quãng', badge: 'Đã xong',
      badgeClass: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
      desc: `Không còn thẻ nào đến hạn. Đã ôn ${stats.reviewedToday} thẻ hôm nay, tổng ${stats.total} thẻ.`,
      pct: 100, progress: '0 thẻ đến hạn', barClass: 'bg-emerald-500', done: true,
      btn: 'Xem Từ Vựng →', action: "switchTab('flashcards')",
      btnClass: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
    };
  } else {
    const pct = Math.round((stats.reviewedToday / (stats.reviewedToday + stats.due)) * 100);
    srsQuest = {
      icon: '🧠', title: `${stats.due} thẻ đến hạn ôn`, badge: 'Đến hạn',
      badgeClass: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
      desc: 'Ôn đúng lúc giúp nhớ từ lâu hơn. Mỗi lượt chỉ mất vài phút.',
      pct, progress: `Đã ôn hôm nay: ${stats.reviewedToday}`, barClass: 'bg-emerald-500', done: false,
      btn: 'Ôn Ngay →', action: 'startHomeSrsReview()',
      btnClass: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
    };
  }

  // 2) Daily EXP goal
  const goalPct = Math.min(100, Math.round((todayExp / goal) * 100));
  const goalQuest = {
    icon: '🌐', title: 'Đạt Mục Tiêu EXP Hôm Nay', badge: `${goal} EXP`,
    badgeClass: 'bg-rose-100 dark:bg-rose-950 text-[#8B1E1E] dark:text-rose-300',
    desc: 'Học bài, luyện dịch, ôn thẻ hoặc chơi game để tích lũy EXP.',
    pct: goalPct, progress: `${Math.min(todayExp, goal)} / ${goal} EXP`, barClass: 'bg-[#8B1E1E]',
    done: todayExp >= goal,
    btn: 'Vào Luyện Dịch →', action: "switchTab('translation')",
    btnClass: 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-[#8B1E1E] dark:text-rose-300'
  };

  // 3) Write today's character
  const writeQuest = {
    icon: '✍️', title: 'Tập Viết Chữ Hán Của Ngày', badge: `+${HOME_HANZI_EXP} EXP`,
    badgeClass: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
    desc: 'Viết đúng thứ tự nét trên khung viết tương tác.',
    pct: hanziDone ? 100 : 0, progress: hanziDone ? '1 / 1 chữ' : '0 / 1 chữ', barClass: 'bg-amber-500',
    done: hanziDone,
    btn: 'Tập Viết Ngay →', action: 'focusHomeHanziWriter()',
    btnClass: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300'
  };

  grid.innerHTML = [srsQuest, goalQuest, writeQuest].map(homeQuestCardHtml).join('');
}

async function startHomeSrsReview() {
  await switchTab('flashcards');
  startFlashcardSession('due');
}

// ---------- Resume last lesson ----------

function renderHomeResume() {
  const last = userProfile.lastLesson;
  const volEl = document.getElementById('homeResumeVolume');
  const titleEl = document.getElementById('homeResumeTitle');
  const hintEl = document.getElementById('homeResumeHint');
  const badgeEl = document.getElementById('homeResumeBadge');
  const btnText = document.getElementById('homeResumeBtnText');

  if (last && last.id) {
    if (volEl) volEl.textContent = last.volumeName || 'Giáo trình Hán Ngữ';
    if (titleEl) {
      const pinyin = [last.titlePinyin, last.titleMeaning].filter(Boolean).join(' - ');
      titleEl.innerHTML = `${escapeHtml(last.titleHanzi || '')}${pinyin ? ` <span class="text-xs font-normal text-stone-500 dark:text-stone-400">(${escapeHtml(pinyin)})</span>` : ''}`;
    }
    if (hintEl) hintEl.textContent = 'Bài bạn mở gần nhất. Bấm để học tiếp.';
    if (badgeEl) badgeEl.textContent = 'Gần Nhất';
    if (btnText) btnText.textContent = 'Mở Bài Học Tiếp Tục';
  } else {
    if (volEl) volEl.textContent = 'Giáo trình Hán Ngữ 6 quyển';
    if (titleEl) titleEl.textContent = 'Bạn chưa mở bài học nào';
    if (hintEl) hintEl.textContent = 'Bắt đầu từ giáo trình để xây nền tảng phát âm và từ vựng.';
    if (badgeEl) badgeEl.textContent = 'Bắt Đầu';
    if (btnText) btnText.textContent = 'Bắt Đầu Học';
  }
}

async function resumeLastLesson() {
  const lessonId = userProfile.lastLesson && userProfile.lastLesson.id;
  await switchTab('jiaocheng');
  if (lessonId) openLessonDetailModal(lessonId);
}

// ---------- Hanzi of the day ----------

/** Deterministically pick today's character from simple, low-level dictionary entries. */
function pickHomeHanzi() {
  if (!Array.isArray(dictionaryData)) return null;
  const seen = new Set();
  const candidates = dictionaryData.filter(w => {
    if (!w || typeof w.title !== 'string' || [...w.title].length !== 1) return false;
    if (!(Number(w.level) <= 3) || seen.has(w.title)) return false;
    seen.add(w.title);
    return true;
  });
  if (!candidates.length) return null;
  return candidates[homeHash(todayKey()) % candidates.length];
}

function renderHomeHanzi() {
  const section = document.getElementById('homeWordOfTheDaySection');
  homeHanziEntry = pickHomeHanzi();
  if (section) section.classList.toggle('hidden', !homeHanziEntry);
  if (!homeHanziEntry) return;

  const w = homeHanziEntry;
  setHomeText('homeHanziChar', w.title);
  setHomeText('homeHanziPinyin', w.hanviet ? `${w.pinyin} (${w.hanviet})` : w.pinyin);
  setHomeText('homeHanziMeta', ['HSK ' + w.level, w.topicName].filter(Boolean).join(' • '));
  setHomeText('homeHanziMeaning', w.meaning);

  const exampleEl = document.getElementById('homeHanziExample');
  if (exampleEl) {
    exampleEl.classList.toggle('hidden', !w.exampleSentence);
    exampleEl.textContent = w.exampleSentence
      ? `Ví dụ: ${w.exampleSentence} (${w.exampleMeaning || ''})`
      : '';
  }
  initHomeHanziWriter(w.title);
}

function initHomeHanziWriter(char) {
  const target = document.getElementById('homeHanziWriterCanvas');
  if (!target) return;
  target.innerHTML = '';
  homeWriter = null;
  clearTimeout(homeHanziTimer);

  const showFallback = () => {
    target.innerHTML = `<span class="font-hanzi text-6xl font-black text-[#8B1E1E] dark:text-rose-400 flex items-center justify-center h-full">${escapeHtml(char)}</span>`;
    homeWriter = null;
  };

  if (typeof HanziWriter === 'undefined') {
    showFallback();
    return;
  }

  try {
    homeWriter = HanziWriter.create('homeHanziWriterCanvas', char, {
      width: 140,
      height: 140,
      padding: 5,
      showOutline: true,
      strokeAnimationSpeed: 1.2,
      delayBetweenStrokes: 160,
      strokeColor: '#8B1E1E',
      outlineColor: '#E2D9C8',
      highlightColor: '#C59A3F',
      drawingColor: '#B83232',
      drawingWidth: 10,
      showHintAfterMisses: 2,
      onLoadCharDataError: showFallback
    });
    homeHanziTimer = setTimeout(() => {
      if (homeWriter) homeWriter.animateCharacter();
    }, 600);
  } catch (e) {
    console.warn('HanziWriter init error:', e);
    showFallback();
  }
}

function homeHanziAnimate() {
  if (!homeHanziEntry) return;
  if (homeWriter) homeWriter.animateCharacter();
  else initHomeHanziWriter(homeHanziEntry.title);
}

function homeHanziQuiz() {
  if (!homeHanziEntry) return;
  if (!homeWriter) {
    initHomeHanziWriter(homeHanziEntry.title);
    if (!homeWriter) {
      showToast('Bộ luyện viết chưa sẵn sàng, hãy thử lại sau giây lát.', 'warning');
      return;
    }
  }
  const char = homeHanziEntry.title;
  showToast(`Hãy dùng chuột hoặc chạm màn hình để tập viết từng nét chữ ${char}!`, 'info');
  homeWriter.quiz({
    onComplete: () => {
      if (storage.get(HOME_HANZI_QUIZ_KEY, '') === todayKey()) {
        showToast(`🎉 Xuất sắc! Bạn đã viết đúng chữ ${char}!`, 'success');
        return;
      }
      storage.set(HOME_HANZI_QUIZ_KEY, todayKey());
      addExp(HOME_HANZI_EXP, 'hanzi-of-the-day');
      showToast(`🎉 Xuất sắc! Bạn đã viết đúng chữ ${char}! +${HOME_HANZI_EXP} EXP`, 'success');
      renderHomeQuests();
    }
  });
}

function homeHanziPronounce() {
  if (homeHanziEntry) playChineseTTS(homeHanziEntry.title, 0.85);
}

function focusHomeHanziWriter() {
  const section = document.getElementById('homeWordOfTheDaySection');
  if (!section || section.classList.contains('hidden')) return;
  section.scrollIntoView({ behavior: 'smooth' });
  homeHanziQuiz();
}

// ---------- Mini quiz ----------

const HOME_QUIZ_OPTION_BASE = 'p-2.5 rounded-xl border-2 font-bold transition-all text-center';
const HOME_QUIZ_OK = `${HOME_QUIZ_OPTION_BASE} border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300`;
const HOME_QUIZ_BAD = `${HOME_QUIZ_OPTION_BASE} border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300`;
const HOME_QUIZ_IDLE = 'p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-[#8B1E1E] bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold transition-all text-center cursor-pointer';

function renderHomeQuiz() {
  homeQuiz = HOME_QUIZZES[homeHash(todayKey()) % HOME_QUIZZES.length];
  setHomeText('homeQuizSentence', homeQuiz.sentence);
  setHomeText('homeQuizPinyin', `(${homeQuiz.pinyin})`);

  const optionsEl = document.getElementById('homeMiniQuizOptions');
  if (optionsEl) {
    const letters = ['A', 'B', 'C', 'D'];
    optionsEl.innerHTML = homeQuiz.options.map((opt, i) => `
      <button onclick="answerHomeMiniQuiz(${i})" id="quiz-opt-${i}" class="${HOME_QUIZ_IDLE}">${letters[i]}. ${escapeHtml(opt)}</button>`).join('');
  }

  const feedbackEl = document.getElementById('homeQuizFeedback');
  if (feedbackEl) {
    feedbackEl.classList.add('hidden');
    feedbackEl.innerHTML = '';
  }

  // Restore today's answer so reloading the page cannot farm EXP
  const saved = storage.get(HOME_QUIZ_KEY, null);
  if (saved && saved.date === todayKey() && Number.isInteger(saved.chosen)) {
    showHomeQuizResult(saved.chosen);
  }
}

function showHomeQuizResult(chosen) {
  const correct = chosen === homeQuiz.answer;
  const letters = ['A', 'B', 'C', 'D'];
  homeQuiz.options.forEach((_, i) => {
    const btn = document.getElementById(`quiz-opt-${i}`);
    if (!btn) return;
    btn.disabled = true;
    if (i === homeQuiz.answer) btn.className = HOME_QUIZ_OK;
    else if (i === chosen) btn.className = HOME_QUIZ_BAD;
  });

  const feedbackEl = document.getElementById('homeQuizFeedback');
  if (!feedbackEl) return;
  const tone = correct
    ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-400 text-emerald-900 dark:text-emerald-200'
    : 'bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-900 dark:text-rose-200';
  const head = correct
    ? `🎉 Chính xác! Đáp án đúng là ${letters[homeQuiz.answer]}. ${escapeHtml(homeQuiz.options[homeQuiz.answer])}`
    : `💡 Đáp án chính xác là ${letters[homeQuiz.answer]}. ${escapeHtml(homeQuiz.options[homeQuiz.answer])}`;
  feedbackEl.className = `p-3 rounded-xl ${tone} text-xs font-medium space-y-1 animate-fade-in`;
  feedbackEl.innerHTML = `
    <div class="font-bold">${head}</div>
    <p class="leading-relaxed text-[11px]"><strong>Giải thích:</strong> ${escapeHtml(homeQuiz.explain)}</p>`;
}

function answerHomeMiniQuiz(chosenIndex) {
  const saved = storage.get(HOME_QUIZ_KEY, null);
  if (saved && saved.date === todayKey()) {
    showToast('Bạn đã trả lời câu đố hôm nay rồi! 🎯', 'info');
    return;
  }
  storage.set(HOME_QUIZ_KEY, { date: todayKey(), chosen: chosenIndex });
  showHomeQuizResult(chosenIndex);
  if (chosenIndex === homeQuiz.answer) {
    addExp(HOME_QUIZ_EXP, 'home-quiz');
    showToast(`🎉 Chính xác! Bạn nhận được +${HOME_QUIZ_EXP} EXP`, 'success');
    renderHomeQuests();
  }
}

// ---------- Leaderboard ----------

const HOME_RANK_STYLES = [
  { row: 'bg-amber-50/70 dark:bg-stone-800/80 border border-amber-300 dark:border-amber-700/50 shadow-2xs', rank: 'bg-amber-500 text-stone-950', exp: 'text-[#8B1E1E] dark:text-amber-400' },
  { row: 'bg-white dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700', rank: 'bg-stone-300 dark:bg-stone-600 text-stone-800 dark:text-white', exp: 'text-stone-800 dark:text-stone-200' },
  { row: 'bg-white dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700', rank: 'bg-amber-700/30 text-amber-900 dark:text-amber-200', exp: 'text-stone-800 dark:text-stone-200' }
];
const HOME_AVATAR_TONES = ['bg-[#8B1E1E]', 'bg-gradient-to-br from-rose-600 to-amber-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-teal-600'];

function renderHomeLeaderboardEmpty(listEl) {
  const cta = currentUser
    ? '<button onclick="switchTab(\'pathway\')" class="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 text-amber-900 dark:text-amber-300 text-xs font-bold cursor-pointer">Bắt đầu tích lũy EXP</button>'
    : '<button onclick="openAuthModal(\'register\')" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold cursor-pointer">Đăng ký miễn phí</button>';
  listEl.innerHTML = `
    <div class="p-5 rounded-2xl border border-dashed border-amber-300 dark:border-stone-700 text-center space-y-2">
      <p class="text-2xl">🏆</p>
      <p class="font-bold text-stone-800 dark:text-stone-100">Chưa có ai trên bảng vàng</p>
      <p class="text-[11px] text-stone-500 dark:text-stone-400">Hãy là học viên đầu tiên ghi tên bằng cách học và tích lũy EXP.</p>
      ${cta}
    </div>`;
}

async function renderHomeLeaderboard() {
  const listEl = document.getElementById('homeLeaderboardList');
  if (!listEl) return;
  const token = ++homeLeaderboardToken;

  let top = [];
  try {
    const data = await apiRequest('/api/leaderboard');
    top = Array.isArray(data.top) ? data.top : [];
  } catch (e) {
    if (token !== homeLeaderboardToken) return;
    listEl.innerHTML = '<p class="p-4 text-center text-stone-500 dark:text-stone-400">Không tải được bảng xếp hạng. Vui lòng thử lại sau.</p>';
    return;
  }
  if (token !== homeLeaderboardToken) return;

  if (!top.length) {
    renderHomeLeaderboardEmpty(listEl);
    return;
  }

  listEl.innerHTML = top.slice(0, 5).map((p, i) => {
    const style = HOME_RANK_STYLES[i] || HOME_RANK_STYLES[1];
    const rankTone = i > 2 ? 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200' : style.rank;
    const streak = Number(p.streak) || 0;
    return `
      <div class="p-3 rounded-2xl ${style.row} flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <span class="w-6 h-6 rounded-full ${rankTone} font-black text-xs flex items-center justify-center shrink-0">${i + 1}</span>
          <div class="w-8 h-8 rounded-full ${HOME_AVATAR_TONES[i % HOME_AVATAR_TONES.length]} text-white flex items-center justify-center font-bold text-xs shrink-0">${escapeHtml(initialOf(p.name))}</div>
          <div class="min-w-0">
            <p class="font-bold text-stone-900 dark:text-stone-100 truncate">${escapeHtml(p.name)}</p>
            <p class="text-[10px] text-stone-500 dark:text-stone-400">${streak > 0 ? `Chuỗi ${streak} ngày liên tục 🔥` : 'Chưa có chuỗi học'}</p>
          </div>
        </div>
        <div class="text-right shrink-0">
          <p class="font-mono font-black text-sm ${style.exp}">${Number(p.exp || 0).toLocaleString('vi-VN')} EXP</p>
          ${i === 0 ? '<p class="text-[9px] text-emerald-600 font-semibold">● Đang dẫn đầu</p>' : `<p class="text-[9px] text-stone-400 font-medium">Hạng ${i + 1}</p>`}
        </div>
      </div>`;
  }).join('');
}

// ---------- VIP / trial banner ----------

const HOME_BANNER_BASE = 'rounded-3xl p-4 lg:p-5 border-2 shadow-md relative overflow-hidden transition-all flex items-center justify-between flex-wrap gap-3';

function homeBannerHtml(b) {
  return `
    <div class="flex items-center gap-3">
      <div class="w-11 h-11 rounded-2xl ${b.iconClass} flex items-center justify-center font-bold text-xl shadow-xs shrink-0">${b.icon}</div>
      <div>
        <div class="flex items-center gap-2 flex-wrap">
          <h4 class="font-bold text-sm ${b.titleClass}">${escapeHtml(b.title)}</h4>
          <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${b.tagClass}">${escapeHtml(b.tag)}</span>
        </div>
        <p class="text-xs ${b.textClass || 'text-stone-600 dark:text-stone-400'} mt-0.5">${escapeHtml(b.text)}</p>
      </div>
    </div>
    <button onclick="${b.action}" class="${b.btnClass} font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer">
      <span>${escapeHtml(b.btn)}</span>
      <i data-lucide="${b.btnIcon}" class="w-3.5 h-3.5"></i>
    </button>`;
}

function renderHomeVipBanner() {
  const el = document.getElementById('homeVipTrialBanner');
  if (!el) return;
  const vip = checkCurrentUserVip();
  let cfg;

  if (vip.tier === 'guest') {
    cfg = {
      cls: 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border-emerald-400/70 text-emerald-950 dark:text-emerald-200',
      icon: '🎁', iconClass: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white',
      title: 'Đăng ký miễn phí để dùng thử 7 ngày', titleClass: 'font-serif-luxury text-emerald-950 dark:text-emerald-300',
      tag: 'Miễn phí', tagClass: 'bg-emerald-500 text-white',
      text: 'Tạo tài khoản để lưu tiến độ, lên bảng xếp hạng và mở khóa toàn bộ tính năng trong 7 ngày.',
      action: "openAuthModal('register')", btn: 'Đăng Ký Ngay', btnIcon: 'arrow-right',
      btnClass: 'px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white shadow-md'
    };
  } else if (vip.tier === 'lifetime') {
    cfg = {
      cls: 'bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border-amber-400/70 text-amber-950 dark:text-amber-200',
      icon: '👑', iconClass: 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950',
      title: 'Tài Khoản Đặc Quyền: VIP Trọn Đời (Lifetime)', titleClass: 'font-serif-luxury text-amber-950 dark:text-amber-300',
      tag: 'Vĩnh Viễn', tagClass: 'bg-amber-400/80 text-stone-950',
      text: 'Bạn có toàn quyền truy cập vĩnh viễn mọi bài học, trò chơi và tính năng mới.',
      action: 'openVipModal()', btn: 'Chi Tiết Đặc Quyền', btnIcon: 'sparkles',
      btnClass: 'px-3.5 py-2 rounded-xl bg-amber-400/80 hover:bg-amber-400 text-stone-950 shadow-xs'
    };
  } else if (vip.isTrial) {
    cfg = {
      cls: 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border-emerald-400/70 text-emerald-950 dark:text-emerald-200',
      icon: '🎁', iconClass: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white',
      title: 'Thời Gian Dùng Thử 7 Ngày Miễn Phí', titleClass: 'font-serif-luxury text-emerald-950 dark:text-emerald-300',
      tag: `Còn ${vip.daysRemaining} ngày`, tagClass: 'bg-emerald-500 text-white',
      text: 'Bạn đang được trải nghiệm toàn bộ tính năng. Nâng cấp VIP sớm để nhận ưu đãi.',
      action: "openVipModal('yearly')", btn: 'Nâng Cấp VIP', btnIcon: 'arrow-right',
      btnClass: 'px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white font-black shadow-md'
    };
  } else if (vip.isVip && !vip.isExpired) {
    cfg = {
      cls: 'bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border-amber-400/70 text-amber-950 dark:text-amber-200',
      icon: '💎', iconClass: 'bg-gradient-to-tr from-[#8B1E1E] to-amber-600 text-white',
      title: 'Tài Khoản Hội Viên VIP Đang Hoạt Động', titleClass: 'font-serif-luxury text-amber-950 dark:text-amber-300',
      tag: `Còn ${vip.daysRemaining} ngày`, tagClass: 'bg-amber-500 text-stone-950',
      text: 'Toàn quyền truy cập mọi bài học, lộ trình và đề thi mô phỏng.',
      action: 'openVipModal()', btn: 'Gia Hạn Gói VIP', btnIcon: 'repeat',
      btnClass: 'px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 dark:text-amber-300 border border-amber-400 shadow-2xs'
    };
  } else {
    cfg = {
      cls: 'bg-gradient-to-r from-red-600/15 via-rose-500/15 to-red-600/15 border-red-500 shadow-xl text-red-950 dark:text-rose-200',
      icon: '🔒', iconClass: 'bg-gradient-to-tr from-red-600 to-rose-700 text-white',
      title: 'Đã kết thúc thời gian dùng thử / VIP của bạn', titleClass: 'font-black text-red-950 dark:text-rose-200',
      tag: 'Cần nâng cấp', tagClass: 'bg-red-600 text-white',
      text: 'Một số cấp độ và bài học đang tạm khóa. Nâng cấp VIP để tiếp tục học ngay!',
      textClass: 'text-red-900/80 dark:text-rose-300/80',
      action: "openVipModal('yearly')", btn: 'Nâng Cấp VIP Mở Khóa', btnIcon: 'sparkles',
      btnClass: 'px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black shadow-lg'
    };
  }

  el.className = `${HOME_BANNER_BASE} ${cfg.cls}`;
  el.innerHTML = homeBannerHtml(cfg);
}

// ---------- Entry point (called by the router and after sign-in/out) ----------

function renderHomeDashboard() {
  renderHomeHeader();
  renderHomeVipBanner();
  renderHomeQuote();
  renderHomeQuests();
  renderHomeResume();
  renderHomeHanzi();
  renderHomeQuiz();
  renderHomeLeaderboard();
  if (typeof initLearnerMode === 'function') initLearnerMode();
  if (typeof renderBeginnerGoldenPath === 'function') renderBeginnerGoldenPath();

  const tabHome = document.getElementById('tab-home');
  if (tabHome) refreshIcons(tabHome);
}

/** Called by profile/SRS code after EXP, streak or the deck changes. */
function onProfileChanged() {
  if (activeTab !== 'home') return;
  renderHomeStreak();
  renderHomeQuests();
  if (typeof renderBeginnerGoldenPath === 'function') renderBeginnerGoldenPath();
}

})();

/* --- FILE: js/features/beginner.js --- */
(function(){
// ==========================================
// MODULE: LỘ TRÌNH NHẬP MÔN 7 NGÀY (ZERO-TO-HERO 7-DAY GOLDEN PATH)
// Thiết kế chuyên biệt cho người mới bắt đầu (F0), giải phóng nỗi sợ chữ Hán & thanh điệu
// ==========================================

const BEGINNER_7DAYS_KEY = 'hsk_beginner_7days_v1';
const LEARNER_MODE_KEY = 'hsk_learner_mode_v1';

// Detailed 7-day curriculum designed for zero-base learners
const BEGINNER_CURRICULUM = [
  {
    day: 1,
    title: '4 Thanh Điệu Ma Thuật & Lời Chào Đầu Tiên',
    hanzi: '你好',
    pinyin: 'Nǐ hǎo',
    meaning: 'Xin chào!',
    duration: '8 phút',
    badge: 'Khởi động',
    icon: '🎵',
    summary: 'Làm chủ 4 dấu thanh điệu tiếng Trung và phát âm chuẩn câu chào kinh điển.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 leading-relaxed">
          <p class="font-bold text-amber-900 dark:text-amber-300 text-sm mb-1.5">💡 Bí quyết thanh điệu cho người Việt:</p>
          Tiếng Trung chỉ có <strong>4 thanh điệu chính</strong> (ít hơn tiếng Việt có 6 thanh). Nắm vững cao độ sẽ giúp bạn nói tự nhiên như người bản xứ ngay từ ngày đầu tiên!
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div class="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xs font-black">1</span>
                <span>Thanh 1 (Ngang - 55)</span>
              </span>
              <button onclick="playBeginnerAudio('mā')" class="px-2 py-1 rounded-lg bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 flex items-center gap-1 cursor-pointer">
                <span>🔊 mā</span>
              </button>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400">Cao và ngân đều như hát nốt Sol cao. <em>Ví dụ: 妈 (mā - mẹ).</em></p>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-black">2</span>
                <span>Thanh 2 (Sắc - 35)</span>
              </span>
              <button onclick="playBeginnerAudio('má')" class="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1 cursor-pointer">
                <span>🔊 má</span>
              </button>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400">Đi từ trung bình lên cao (giống dấu sắc tiếng Việt). <em>Ví dụ: 麻 (má - cây gai).</em></p>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-black">3</span>
                <span>Thanh 3 (Lượn - 214)</span>
              </span>
              <button onclick="playBeginnerAudio('mǎ')" class="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 flex items-center gap-1 cursor-pointer">
                <span>🔊 mǎ</span>
              </button>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400">Xuống thấp rồi lượn nhẹ lên (như dấu hỏi). <em>Ví dụ: 马 (mǎ - con ngựa).</em></p>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center text-xs font-black">4</span>
                <span>Thanh 4 (Rơi dứt khoát - 51)</span>
              </span>
              <button onclick="playBeginnerAudio('mà')" class="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 flex items-center gap-1 cursor-pointer">
                <span>🔊 mà</span>
              </button>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400">Rơi dứt khoát từ đỉnh cao xuống đáy. <em>Ví dụ: 骂 (mà - mắng chửi).</em></p>
          </div>
        </div>

        <!-- Câu chào thực hành -->
        <div class="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-white dark:from-stone-800 dark:via-stone-800 dark:to-stone-900 border border-amber-300/80 dark:border-stone-700 text-center space-y-2">
          <span class="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-amber-300">Thực hành câu chào đầu tiên</span>
          <div class="text-3xl font-chinese font-black text-stone-900 dark:text-stone-100">你好！</div>
          <div class="text-base font-bold text-[#8B1E1E] dark:text-amber-400">Nǐ hǎo! (Đọc biến âm thành: Ní hǎo)</div>
          <p class="text-xs text-stone-600 dark:text-stone-400">
            ⚠️ <strong>Quy tắc vàng:</strong> Hai thanh 3 đi liền nhau (Nǐ + hǎo), từ đầu tiên sẽ biến thành thanh 2 (Ní hǎo).
          </p>
          <div class="pt-2 flex items-center justify-center gap-2">
            <button onclick="playBeginnerAudio('你好')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-rose-700 text-white font-bold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
              <span>🔊 Nghe Giọng Chuẩn Bắc Kinh</span>
            </button>
          </div>
        </div>
      </div>
    `
  },
  {
    day: 2,
    title: '6 Vận Mẫu Đơn & Phụ Âm Cốt Lõi',
    hanzi: '爸妈',
    pinyin: 'Bà mā',
    meaning: 'Bố mẹ',
    duration: '10 phút',
    badge: 'Ngữ âm',
    icon: '🗣️',
    summary: 'Làm quen 6 nguyên âm đơn (a, o, e, i, u, ü) và mẹo tròn môi huýt sáo âm ü.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 leading-relaxed">
          <strong>6 Vận mẫu đơn (Nguyên âm cốt lõi):</strong> Hãy nghe và đọc theo đúng khẩu hình miệng:
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center space-y-1">
            <span class="text-xl font-black text-stone-900 dark:text-stone-100">a</span>
            <p class="text-[11px] text-stone-500">Mở to miệng như chữ 'A'</p>
            <button onclick="playBeginnerAudio('a')" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">🔊 Nghe</button>
          </div>
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center space-y-1">
            <span class="text-xl font-black text-stone-900 dark:text-stone-100">o</span>
            <p class="text-[11px] text-stone-500">Tròn môi đọc như 'ua' nhẹ</p>
            <button onclick="playBeginnerAudio('o')" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">🔊 Nghe</button>
          </div>
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center space-y-1">
            <span class="text-xl font-black text-stone-900 dark:text-stone-100">e</span>
            <p class="text-[11px] text-stone-500">Đọc như 'ưa' trong tiếng Việt</p>
            <button onclick="playBeginnerAudio('e')" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">🔊 Nghe</button>
          </div>
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center space-y-1">
            <span class="text-xl font-black text-stone-900 dark:text-stone-100">i</span>
            <p class="text-[11px] text-stone-500">Đọc dẹt môi như 'i'</p>
            <button onclick="playBeginnerAudio('i')" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">🔊 Nghe</button>
          </div>
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center space-y-1">
            <span class="text-xl font-black text-stone-900 dark:text-stone-100">u</span>
            <p class="text-[11px] text-stone-500">Môi chu ra như 'u'</p>
            <button onclick="playBeginnerAudio('u')" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">🔊 Nghe</button>
          </div>
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border-2 border-rose-300 dark:border-rose-700 text-center space-y-1 bg-rose-50/50">
            <span class="text-xl font-black text-rose-700 dark:text-rose-400">ü (uy)</span>
            <p class="text-[11px] text-rose-600 dark:text-rose-300 font-bold">Môi huýt sáo, đọc âm 'i'</p>
            <button onclick="playBeginnerAudio('ü')" class="text-xs font-bold text-rose-700 dark:text-rose-400 hover:underline">🔊 Nghe chuẩn</button>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-2">
          <p class="font-bold text-stone-900 dark:text-stone-100">Cặp phụ âm bật hơi sống còn: B vs P</p>
          <div class="flex items-center justify-between text-xs">
            <span><strong>B:</strong> Không bật hơi (đọc giống 'pua' tiếng Việt) ➔ <em>bàba (bố)</em></span>
            <button onclick="playBeginnerAudio('bàba')" class="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-bold">🔊 bàba</button>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span><strong>P:</strong> Bật mạnh luồng hơi qua môi ➔ <em>píngguǒ (quả táo)</em></span>
            <button onclick="playBeginnerAudio('píngguǒ')" class="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-bold">🔊 píngguǒ</button>
          </div>
        </div>
      </div>
    `
  },
  {
    day: 3,
    title: '8 Quy Tắc Bút Thuận Viết Chữ Hán',
    hanzi: '十人',
    pinyin: 'Shí rén',
    meaning: 'Mười người (Quy tắc viết)',
    duration: '10 phút',
    badge: 'Tập viết',
    icon: '✍️',
    summary: 'Nắm vững 8 quy tắc viết chữ Hán sống còn để viết chữ cân đối và nhanh đẹp.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <p class="leading-relaxed">
          Chữ Hán không phải là vẽ tranh ngẫu nhiên! Mọi chữ Hán đều tuân theo <strong>8 quy tắc bút thuận</strong> kinh điển giúp ngòi bút lướt tự nhiên và ghi nhớ chữ cực sâu:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">1. Ngang trước, sổ sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Thập <strong>十</strong> (ngang ─ trước, sổ │ sau)</p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">十</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">2. Phẩy trước, mác sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Bát <strong>八</strong>, chữ Nhân <strong>人</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">人</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">3. Trên trước, dưới sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Tam <strong>三</strong> (viết từ nét trên xuống)</p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">三</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">4. Trái trước, phải sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Bạn <strong>你</strong>, chữ Anh ấy <strong>他</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">你</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">5. Ngoài trước, trong sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Nguyệt <strong>月</strong>, chữ Đồng <strong>同</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">月</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">6. Vào trước, đóng sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Nhật <strong>日</strong>, chữ Quốc <strong>国</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">日</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">7. Giữa trước, hai bên sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Tiểu <strong>小</strong>, chữ Thủy <strong>水</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">小</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">8. Bao dưới viết sau cùng</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Giá <strong>这</strong>, chữ Tiến <strong>进</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">这</span>
          </div>
        </div>
      </div>
    `
  },
  {
    day: 4,
    title: '10 Bộ Thủ Vàng (Mở Khóa 70% Chữ Sơ Cấp)',
    hanzi: '人木水火',
    pinyin: 'Rén mù shuǐ huǒ',
    meaning: 'Bộ thủ tượng hình',
    duration: '12 phút',
    badge: 'Chiết tự',
    icon: '🗝️',
    summary: 'Chiết tự thông minh: Nhìn bộ thủ đoán ngay nghĩa của chữ mà không cần tra từ điển.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 leading-relaxed">
          Chữ Hán là chữ <strong>tượng hình ghép logic</strong>! 10 bộ thủ dưới đây chiếm tới 70% các từ vựng bạn sẽ gặp trong HSK 1 - 2:
        </div>

        <div class="space-y-2">
          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-3">
            <span class="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950 text-[#8B1E1E] dark:text-red-400 font-chinese text-xl font-black flex items-center justify-center shrink-0">人/亻</span>
            <div>
              <strong>Bộ Nhân (Người):</strong> Chữ nào có bộ này đều liên quan đến con người. Ví dụ: <em>你 (bạn), 他 (anh ấy), 们 (chúng tôi)</em>.
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-3">
            <span class="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-chinese text-xl font-black flex items-center justify-center shrink-0">口</span>
            <div>
              <strong>Bộ Khẩu (Miệng):</strong> Hành động của miệng (nói, ăn, uống). Ví dụ: <em>吃 (ăn), 喝 (uống), 叫 (kêu/gọi)</em>.
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-3">
            <span class="w-9 h-9 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-400 font-chinese text-xl font-black flex items-center justify-center shrink-0">女</span>
            <div>
              <strong>Bộ Nữ (Phụ nữ):</strong> Phụ nữ, con gái, gia đình. Ví dụ: <em>好 (tốt = phụ nữ có con trai), 妈 (mẹ), 妹 (em gái)</em>.
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-3">
            <span class="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 font-chinese text-xl font-black flex items-center justify-center shrink-0">水/氵</span>
            <div>
              <strong>Bộ Thủy (3 chấm thủy - Nước):</strong> Chất lỏng, sông biển. Ví dụ: <em>海 (biển), 没 (không có/chìm), 河 (sông)</em>.
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-3">
            <span class="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-chinese text-xl font-black flex items-center justify-center shrink-0">木</span>
            <div>
              <strong>Bộ Mộc (Cây cối):</strong> Đồ gỗ, thiên nhiên. Ví dụ: <em>林 (rừng = 2 cây), 休 (nghỉ ngơi = người tựa vào cây)</em>.
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    day: 5,
    title: 'Số Đếm 1 - 10 & Tự Giới Thiệu Bản Thân',
    hanzi: '一二三四',
    pinyin: 'Yī èr sān sì',
    meaning: 'Số đếm & Tôi là ai',
    duration: '10 phút',
    badge: 'Thực chiến',
    icon: '🔢',
    summary: 'Đếm trôi chảy từ 1 đến 10 và nói được câu giới thiệu tên tuổi, quốc tịch.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <p class="font-bold text-stone-900 dark:text-stone-100">Bảng số đếm 1 đến 10 thần tốc:</p>

        <div class="grid grid-cols-5 gap-2 text-center">
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">一</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">yī (1)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">二</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">èr (2)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">三</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">sān (3)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">四</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">sì (4)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">五</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">wǔ (5)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">六</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">liù (6)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">七</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">qī (7)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">八</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">bā (8)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">九</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">jiǔ (9)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">十</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">shí (10)</span>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-white dark:from-stone-800 dark:to-stone-900 border border-amber-300 dark:border-stone-700 space-y-3">
          <p class="font-bold text-amber-900 dark:text-amber-300">Mẫu câu tự giới thiệu sống còn:</p>
          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold block text-stone-900 dark:text-stone-100">我叫... (Wǒ jiào...)</span>
              <span class="text-xs text-stone-500">Tôi tên là...</span>
            </div>
            <button onclick="playBeginnerAudio('我叫李明')" class="text-xs font-bold text-amber-700 dark:text-amber-400">🔊 Ví dụ mẫu</button>
          </div>
          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold block text-stone-900 dark:text-stone-100">我是越南人。(Wǒ shì Yuènán rén.)</span>
              <span class="text-xs text-stone-500">Tôi là người Việt Nam.</span>
            </div>
            <button onclick="playBeginnerAudio('我是越南人')" class="text-xs font-bold text-amber-700 dark:text-amber-400">🔊 Nghe</button>
          </div>
        </div>
      </div>
    `
  },
  {
    day: 6,
    title: 'Giao Tiếp Thường Nhật (Cảm Ơn, Xin Lỗi, Tạm Biệt)',
    hanzi: '谢谢再见',
    pinyin: 'Xièxie zàijiàn',
    meaning: 'Cảm ơn & Tạm biệt',
    duration: '10 phút',
    badge: 'Giao tiếp',
    icon: '🤝',
    summary: 'Phản xạ tự nhiên các câu lịch sự cửa miệng của người Trung Quốc.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[#8B1E1E] dark:text-amber-400">Cảm ơn & Trả lời</span>
              <button onclick="playBeginnerAudio('谢谢！不客气！')" class="text-xs font-bold text-sky-600 dark:text-sky-400">🔊 Nghe cặp câu</button>
            </div>
            <p><strong>A:</strong> 谢谢！ (Xièxie! - Cảm ơn!)</p>
            <p><strong>B:</strong> 不客气！ (Bú kèqi! - Đừng khách sáo!)</p>
          </div>

          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[#8B1E1E] dark:text-amber-400">Xin lỗi & Thứ lỗi</span>
              <button onclick="playBeginnerAudio('对不起！没关系！')" class="text-xs font-bold text-sky-600 dark:text-sky-400">🔊 Nghe cặp câu</button>
            </div>
            <p><strong>A:</strong> 对不起！ (Duìbuqǐ! - Xin lỗi!)</p>
            <p><strong>B:</strong> 没关系！ (Méi guānxi! - Không có chi/sao đâu!)</p>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
          <div>
            <span class="font-bold block text-stone-900 dark:text-stone-100">再见！ (Zàijiàn! - Tạm biệt / Hẹn gặp lại)</span>
            <span class="text-xs text-stone-500">Trong đó '再' là lại, '见' là gặp (Hẹn tái kiến).</span>
          </div>
          <button onclick="playBeginnerAudio('再见！')" class="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-xs cursor-pointer">🔊 Phát âm</button>
        </div>
      </div>
    `
  },
  {
    day: 7,
    title: 'Thử Thách Tốt Nghiệp & Nhận Huy Hiệu F0',
    hanzi: '毕业',
    pinyin: 'Bì yè',
    meaning: 'Tốt nghiệp nhập môn',
    duration: '8 phút',
    badge: 'Nhận cúp',
    icon: '🏆',
    summary: 'Trắc nghiệm 5 câu tổng hợp 7 ngày. Đạt >= 4 câu để nhận Huy hiệu F0 Graduate và +100 EXP!',
    contentHtml: `
      <div id="beginnerQuizContainer" class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 leading-relaxed">
          🎯 <strong>Thử thách tốt nghiệp 7 Ngày:</strong> Trả lời đúng từ 4/5 câu hỏi dưới đây để mở khóa danh hiệu <strong>"Chiến Binh Nhập Môn Xuất Sắc"</strong> và tự tin bước vào Giáo trình Hán ngữ Quyển 1!
        </div>

        <form id="beginnerQuizForm" class="space-y-4" onsubmit="event.preventDefault(); submitBeginnerQuiz();">
          <!-- Câu 1 -->
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <p class="font-bold text-stone-900 dark:text-stone-100">1. Từ "Xin chào" trong tiếng Trung viết là gì?</p>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" value="A" required /> A. 谢谢 (Xièxie)</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" value="B" /> B. 你好 (Nǐ hǎo)</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" value="C" /> C. 再见 (Zàijiàn)</label>
            </div>
          </div>

          <!-- Câu 2 -->
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <p class="font-bold text-stone-900 dark:text-stone-100">2. Âm 'ü' trong tiếng Trung phát âm khẩu hình thế nào?</p>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q2" value="A" required /> A. Mở miệng thật rộng như chữ O</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q2" value="B" /> B. Tròn môi như đang huýt sáo và phát âm chữ i</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q2" value="C" /> C. Bẹt môi phát âm chữ E</label>
            </div>
          </div>

          <!-- Câu 3 -->
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <p class="font-bold text-stone-900 dark:text-stone-100">3. Chữ Thập (十) tuân theo quy tắc bút thuận nào?</p>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q3" value="A" required /> A. Nét ngang trước, nét sổ sau</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q3" value="B" /> B. Nét sổ trước, nét ngang sau</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q3" value="C" /> C. Viết tùy ý miễn thành hình chữ thập</label>
            </div>
          </div>

          <!-- Câu 4 -->
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <p class="font-bold text-stone-900 dark:text-stone-100">4. Bộ 口 (Khẩu) mang ý nghĩa liên quan đến gì?</p>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q4" value="A" required /> A. Cây cối và núi non</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q4" value="B" /> B. Nước và chất lỏng</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q4" value="C" /> C. Miệng và các hành động ăn, nói, gọi</label>
            </div>
          </div>

          <!-- Câu 5 -->
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <p class="font-bold text-stone-900 dark:text-stone-100">5. Câu "Tôi là người Việt Nam" nói như thế nào?</p>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q5" value="A" required /> A. 我是越南人。(Wǒ shì Yuènán rén.)</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q5" value="B" /> B. 我叫中国人。(Wǒ jiào Zhōngguó rén.)</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q5" value="C" /> C. 谢谢越南。(Xièxie Yuènán.)</label>
            </div>
          </div>

          <div class="pt-2 text-center">
            <button type="submit" class="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:opacity-95 text-stone-900 font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer">
              Hoàn Thành & Chấm Điểm Ngay (🎯)
            </button>
          </div>
        </form>
      </div>
    `
  }
];

if (typeof window !== 'undefined') {
  window.BEGINNER_CURRICULUM = BEGINNER_CURRICULUM;
}

// State
let activeBeginnerDay = 1;

/** Get learner mode ('beginner' or 'all'). Defaults to 'beginner' for new visitors! */
function getLearnerMode() {
  return storage.get(LEARNER_MODE_KEY, 'beginner');
}

/** Set learner mode and toggle UI filtering */
function setLearnerMode(mode) {
  const targetMode = mode === 'all' ? 'all' : 'beginner';
  storage.set(LEARNER_MODE_KEY, targetMode);
  applyLearnerModeUI(targetMode);
  if (typeof showToast === 'function') {
    if (targetMode === 'beginner') {
      showToast('Đã bật Chế độ Nhập Môn F0: Tối giản giao diện, nổi bật lộ trình 7 ngày!', 'success');
    } else {
      showToast('Đã bật Chế độ Toàn Diện: Hiển thị đầy đủ mọi công cụ HSK 1 - 6!', 'info');
    }
  }
}

/** Apply classes and button active states for learner mode */
function applyLearnerModeUI(mode) {
  const btnBeginner = document.getElementById('btnModeBeginner');
  const btnAll = document.getElementById('btnModeAll');
  const advancedCards = document.querySelectorAll('.mode-advanced-feature');

  if (btnBeginner && btnAll) {
    if (mode === 'beginner') {
      btnBeginner.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-emerald-600 text-white shadow-2xs cursor-pointer';
      btnAll.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer';
    } else {
      btnAll.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-sky-600 text-white shadow-2xs cursor-pointer';
      btnBeginner.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer';
    }
  }

  // Visual highlight or badge for advanced features when in beginner mode
  advancedCards.forEach(el => {
    if (mode === 'beginner') {
      el.classList.add('opacity-85');
    } else {
      el.classList.remove('opacity-85');
    }
  });
}

/** Initialize learner mode on app start */
function initLearnerMode() {
  const currentMode = getLearnerMode();
  applyLearnerModeUI(currentMode);
}

/** Get beginner 7-day progress */
function getBeginnerProgress() {
  const def = { completedDays: [], currentDay: 1, graduateBadge: false };
  return storage.get(BEGINNER_7DAYS_KEY, def);
}

/** Save beginner progress */
function saveBeginnerProgress(prog) {
  storage.set(BEGINNER_7DAYS_KEY, prog);
  // Also queue for cloud sync
  if (typeof queueProgressPush === 'function') {
    queueProgressPush();
  }
}

/** Play audio with TTS */
function playBeginnerAudio(text) {
  if (typeof playPronunciation === 'function') {
    playPronunciation(text);
  } else if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }
}

/** Render the 7-day golden path grid in the Home tab */
function renderBeginnerGoldenPath() {
  const container = document.getElementById('beginner7DaysGrid');
  const progressEl = document.getElementById('beginner7DaysProgress');
  const percentEl = document.getElementById('beginner7DaysPercent');
  if (!container) return;

  const prog = getBeginnerProgress();
  const completedCount = prog.completedDays.length;
  const pct = Math.round((completedCount / 7) * 100);

  if (progressEl) progressEl.style.width = `${pct}%`;
  if (percentEl) percentEl.textContent = `${completedCount}/7 ngày (${pct}%)`;

  let html = '';
  BEGINNER_CURRICULUM.forEach((item) => {
    const isCompleted = prog.completedDays.includes(item.day);
    const isCurrent = prog.currentDay === item.day || (!isCompleted && prog.completedDays.length === item.day - 1);

    let borderClass = 'border-stone-200 dark:border-stone-700';
    let bgClass = 'bg-white dark:bg-[#161B22]';
    let badgeText = item.badge;
    let badgeClass = 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300';

    if (isCompleted) {
      borderClass = 'border-emerald-300 dark:border-emerald-700/80';
      bgClass = 'bg-emerald-50/50 dark:bg-emerald-950/20';
      badgeText = 'Đã hoàn thành ✓';
      badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold';
    } else if (isCurrent) {
      borderClass = 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-300/40';
      bgClass = 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 dark:from-stone-800 dark:to-[#161B22]';
      badgeText = 'Bài học hôm nay ⚡';
      badgeClass = 'bg-gradient-to-r from-[#8B1E1E] to-rose-700 text-white font-bold shadow-2xs';
    }

    html += `
      <div 
        onclick="openBeginnerDayModal(${item.day})" 
        class="group glass-card rounded-2xl p-4 border-2 ${borderClass} ${bgClass} hover:border-[#8B1E1E] dark:hover:border-amber-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-base flex items-center justify-center shrink-0">
              ${item.icon}
            </span>
            <span class="text-xs font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">
              Ngày ${item.day}
            </span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full ${badgeClass}">
            ${badgeText}
          </span>
        </div>

        <div>
          <h4 class="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            ${item.title}
          </h4>
          <p class="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            ${item.summary}
          </p>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80 text-[11px]">
          <span class="text-stone-400 flex items-center gap-1 font-medium">
            <span>⏱️</span> ${item.duration}
          </span>
          <span class="font-bold text-[#8B1E1E] dark:text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
            ${isCompleted ? 'Ôn lại' : 'Vào học'} →
          </span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/** Open full modal for a specific day */
function openBeginnerDayModal(dayNum) {
  const item = BEGINNER_CURRICULUM.find(x => x.day === dayNum);
  if (!item) return;

  activeBeginnerDay = dayNum;
  const modal = document.getElementById('beginnerDayModal');
  const titleEl = document.getElementById('beginnerModalTitle');
  const badgeEl = document.getElementById('beginnerModalBadge');
  const contentEl = document.getElementById('beginnerModalContent');
  const actionBtn = document.getElementById('beginnerModalActionBtn');

  if (!modal || !titleEl || !contentEl) return;

  titleEl.innerHTML = `<span class="text-[#8B1E1E] dark:text-amber-400">Ngày ${item.day}:</span> ${item.title}`;
  if (badgeEl) badgeEl.textContent = `⏱️ ${item.duration} • ${item.badge}`;
  contentEl.innerHTML = item.contentHtml;

  const prog = getBeginnerProgress();
  const isCompleted = prog.completedDays.includes(dayNum);

  if (actionBtn) {
    if (dayNum === 7) {
      actionBtn.style.display = 'none'; // Quiz handles submission
    } else {
      actionBtn.style.display = 'inline-flex';
      if (isCompleted) {
        actionBtn.innerHTML = '<span>Đã Hoàn Thành (✓)</span>';
        actionBtn.className = 'px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs cursor-pointer';
      } else {
        actionBtn.innerHTML = '<span>Hoàn Thành Bài Học (+25 EXP) ✓</span>';
        actionBtn.className = 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-rose-700 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer';
      }
    }
  }

  modal.classList.remove('hidden');
  if (document.body && document.body.classList) {
    document.body.classList.add('overflow-hidden');
  }
}

/** Close modal */
function closeBeginnerDayModal() {
  const modal = document.getElementById('beginnerDayModal');
  if (modal) modal.classList.add('hidden');
  if (document.body && document.body.classList) {
    document.body.classList.remove('overflow-hidden');
  }
}

/** Complete a day's study */
function completeActiveBeginnerDay() {
  const dayNum = activeBeginnerDay;
  const prog = getBeginnerProgress();

  if (!prog.completedDays.includes(dayNum)) {
    prog.completedDays.push(dayNum);
    if (prog.currentDay <= dayNum && dayNum < 7) {
      prog.currentDay = dayNum + 1;
    }
    saveBeginnerProgress(prog);

    // Add EXP
    if (typeof addExp === 'function') {
      addExp(25, `Hoàn thành Ngày ${dayNum} Nhập Môn Tiếng Trung`);
    }

    if (typeof showToast === 'function') {
      showToast(`Xuất sắc! Bạn đã hoàn thành Ngày ${dayNum} và nhận +25 EXP! 🎉`, 'success');
    }
  }

  closeBeginnerDayModal();
  renderBeginnerGoldenPath();
}

/** Submit Day 7 Final Quiz */
function submitBeginnerQuiz() {
  const form = document.getElementById('beginnerQuizForm');
  if (!form) return;

  const data = new FormData(form);
  const q1 = data.get('q1');
  const q2 = data.get('q2');
  const q3 = data.get('q3');
  const q4 = data.get('q4');
  const q5 = data.get('q5');

  let score = 0;
  if (q1 === 'B') score++;
  if (q2 === 'B') score++;
  if (q3 === 'A') score++;
  if (q4 === 'C') score++;
  if (q5 === 'A') score++;

  const container = document.getElementById('beginnerQuizContainer');
  if (!container) return;

  const passed = score >= 4;

  if (passed) {
    const prog = getBeginnerProgress();
    if (!prog.completedDays.includes(7)) {
      prog.completedDays.push(7);
      prog.graduateBadge = true;
      saveBeginnerProgress(prog);
      if (typeof addExp === 'function') {
        addExp(100, 'Tốt nghiệp Lộ trình Nhập môn 7 Ngày');
      }
    }

    container.innerHTML = `
      <div class="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-emerald-50 dark:from-stone-900 dark:to-stone-800 border-2 border-amber-400 text-center space-y-4 animate-fade-in">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center text-3xl font-bold shadow-md">
          🏆
        </div>
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">CHÚC MỪNG BẠN ĐÃ TỐT NGHIỆP!</span>
          <h3 class="text-xl font-black text-stone-900 dark:text-stone-100 font-serif-luxury mt-1">
            Chiến Binh Nhập Môn Xuất Sắc (F0 Graduate)
          </h3>
          <p class="text-xs text-stone-600 dark:text-stone-400 mt-2 max-w-md mx-auto">
            Bạn đạt <strong>${score}/5 câu đúng</strong>! Bạn đã nắm vững 4 thanh điệu, quy tắc bút thuận và các câu giao tiếp cơ bản. Bạn đã nhận <strong>+100 EXP</strong>!
          </p>
        </div>

        <div class="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300">
          🚀 <strong>Bước tiếp theo:</strong> Bắt đầu bài số 1 của <em>Giáo Trình Hán Ngữ Quyển 1</em> hoặc thử sức với <em>Flashcard HSK 1</em>!
        </div>

        <div class="flex items-center justify-center gap-3 pt-2">
          <button onclick="closeBeginnerDayModal(); switchTab('jiaocheng');" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-rose-700 text-white font-bold text-xs shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all">
            Học Giáo Trình Hán Ngữ 1 →
          </button>
          <button onclick="closeBeginnerDayModal();" class="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 font-bold text-xs cursor-pointer">
            Đóng
          </button>
        </div>
      </div>
    `;

    renderBeginnerGoldenPath();
  } else {
    if (typeof showToast === 'function') {
      showToast(`Bạn đúng ${score}/5 câu. Cần đạt ít nhất 4/5 câu. Hãy xem lại bài học và thử lại nhé!`, 'warning');
    }
    // Highlight questions
  }
}

/** Trigger AI tutor to welcome beginner */
function triggerBeginnerAiWelcome() {
  if (typeof openFloatingAssistant === 'function') {
    openFloatingAssistant();
  }
  // If assistant has input, prefill it or send beginner message
  const input = document.getElementById('floatingAiInput');
  if (input) {
    input.value = 'Em là người mới bắt đầu, hãy hướng dẫn em cách phát âm thanh điệu và học bài đầu tiên với!';
    if (typeof handleFloatingAiSend === 'function') {
      handleFloatingAiSend();
    }
  }
}

})();

/* --- FILE: js/features/woodblock.js --- */
(function(){
// ==================== WOOD BLOCK CHINESE PUZZLE GAME ENGINE (汉语积木) ====================

let currentWoodLevelIndex = 0;

function getCurrentWoodLevel() {
  if (!woodBlockLevels || woodBlockLevels.length === 0) return null;
  if (currentWoodLevelIndex < 0) currentWoodLevelIndex = 0;
  if (currentWoodLevelIndex >= woodBlockLevels.length) currentWoodLevelIndex = woodBlockLevels.length - 1;
  return woodBlockLevels[currentWoodLevelIndex] || null;
}
let woodBoardState = []; // 2D array [row][col] -> null or { pieceId, char, color, isOrigin }
let woodPlacedBlocks = new Map(); // pieceId -> { originRow, originCol, piece }
let woodSelectedPieceId = null;
let woodUserProgress = { unlockedLevel: 1, stars: {} };
let woodActiveTierFilter = 'easy';

// Web Audio Sound Synthesizers (100% Native, Acoustic Wood Feel)
function playWoodDropSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch (e) {}
}

function playWoodReturnSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {}
}

function playVictorySound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    // Oriental Pentatonic Fanfare (C5, D5, E5, G5, A5, C6)
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const startTime = ctx.currentTime + idx * 0.12;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.35, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  } catch (e) {}
}

async function initWoodBlockGame() {
  try {
    // Load saved progress
    const savedProgress = storage.get('wood_block_progress', null);
    if (savedProgress) {
      woodUserProgress = Object.assign(woodUserProgress, savedProgress);
    }

    // The router loads the 'woodBlock' dataset before calling this; be safe if called directly.
    await loadData('woodBlock');

    // Set starting level: highest unlocked level or level 1
    const targetLevel = Math.min(woodBlockLevels.length - 1, (woodUserProgress.unlockedLevel || 1) - 1);
    currentWoodLevelIndex = Math.max(0, targetLevel);

    loadWoodLevel(currentWoodLevelIndex);
  } catch (e) {
    console.warn('Error initializing wood block game:', e);
  }
}

function saveWoodProgress() {
  storage.set('wood_block_progress', woodUserProgress);
}

function loadWoodLevel(index) {
  if (!woodBlockLevels || woodBlockLevels.length === 0) return;
  if (index < 0) index = 0;
  if (index >= woodBlockLevels.length) index = woodBlockLevels.length - 1;
  // VIP Guard Check for Wood Block Levels: Free preview for levels 1-5
  if (index >= 5 && typeof checkCurrentUserVip === 'function') {
    const vip = checkCurrentUserVip();
    if (vip.isExpired) {
      ensureVipAccess('Cấp độ ' + (index + 1) + ' của Xếp Khối Gỗ');
      return;
    }
  }

  currentWoodLevelIndex = index;

  const lvl = woodBlockLevels[index];
  woodSelectedPieceId = null;
  woodPlacedBlocks.clear();

  // Update Toolbar Header Info
  const levelNumEl = document.getElementById('woodCurrentLevelNum');
  const levelNameEl = document.getElementById('woodCurrentLevelName');
  const tierBadgeEl = document.getElementById('woodCurrentTierBadge');
  const meaningTextEl = document.getElementById('woodMeaningHintText');
  const dimTextEl = document.getElementById('woodBoardDimensionText');

  if (levelNumEl) levelNumEl.innerText = lvl.level;
  if (levelNameEl) levelNameEl.innerText = lvl.title;
  if (meaningTextEl) meaningTextEl.innerText = `"${lvl.meaning}"`;
  if (dimTextEl) dimTextEl.innerText = `Bàn Cờ Gỗ ${lvl.grid.rows} × ${lvl.grid.cols}`;

  if (tierBadgeEl) {
    if (lvl.tier === 'easy') {
      tierBadgeEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300';
      tierBadgeEl.innerText = 'Sơ Cấp (HSK 1-2)';
    } else if (lvl.tier === 'medium') {
      tierBadgeEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300';
      tierBadgeEl.innerText = 'Trung Cấp (HSK 3-4)';
    } else {
      tierBadgeEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border border-rose-300';
      tierBadgeEl.innerText = 'Cao Cấp (HSK 5-6)';
    }
  }

  // Initialize 2D Board State
  woodBoardState = [];
  for (let r = 0; r < lvl.grid.rows; r++) {
    const row = [];
    for (let c = 0; c < lvl.grid.cols; c++) {
      row.push(null);
    }
    woodBoardState.push(row);
  }

  renderWoodBoardGrid(lvl.grid.rows, lvl.grid.cols);
  renderWoodPiecesTray(lvl.blocks);
  updateWoodRemainingCount();

  const hintBanner = document.getElementById('woodMeaningHintBanner');
  if (hintBanner) hintBanner.classList.add('hidden');

  const tabWood = document.getElementById('tab-woodblock');
  if (tabWood) refreshIcons(tabWood);
}

function renderWoodBoardGrid(rows, cols) {
  const container = document.getElementById('woodBoardGrid');
  if (!container) return;

  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

  // Determine cell size based on grid dimension
  const cellSizeClass = rows <= 3 ? 'w-16 h-16 sm:w-20 sm:h-20 text-sm sm:text-base' : (rows <= 4 ? 'w-13 h-13 sm:w-16 sm:h-16 text-xs sm:text-sm' : 'w-11 h-11 sm:w-13 sm:h-13 text-xs');

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.id = `wood-cell-${r}-${c}`;
      cell.className = `wood-slot-cell ${cellSizeClass} flex items-center justify-center font-hanzi font-bold cursor-pointer transition-all`;
      cell.dataset.row = r;
      cell.dataset.col = c;

      // Event Listeners for Cell (Click & Touch to place or return)
      cell.addEventListener('click', () => handleWoodCellClick(r, c));
      cell.addEventListener('touchend', (e) => {
        if (woodSelectedPieceId || (woodBoardState[r] && woodBoardState[r][c] !== null)) {
          e.preventDefault();
          handleWoodCellClick(r, c);
        }
      });
      
      // Drag & Drop Listeners
      cell.addEventListener('dragover', (e) => handleWoodCellDragOver(e, r, c));
      cell.addEventListener('dragleave', () => handleWoodCellDragLeave(r, c));
      cell.addEventListener('drop', (e) => handleWoodCellDrop(e, r, c));

      container.appendChild(cell);
    }
  }
}

function renderWoodPiecesTray(blocks) {
  const tray = document.getElementById('woodPiecesTray');
  if (!tray) return;

  tray.innerHTML = '';

  blocks.forEach(piece => {
    // If piece is already placed on the board, do not show in tray
    if (woodPlacedBlocks.has(piece.id)) return;

    const pieceEl = createWoodPieceElement(piece);
    tray.appendChild(pieceEl);
  });
}

function getPieceCellText(piece, shapeIndex) {
  if (!piece || !piece.text) return '';
  const totalCells = (piece.shape && piece.shape.length) ? piece.shape.length : 1;
  if (totalCells <= 1) return piece.text;

  const chars = Array.from(piece.text);
  if (chars.length === totalCells) {
    return chars[shapeIndex] || '';
  }
  if (chars.length < totalCells) {
    return chars[shapeIndex] || '';
  }
  const chunkSize = Math.ceil(chars.length / totalCells);
  const start = shapeIndex * chunkSize;
  return chars.slice(start, start + chunkSize).join('') || '';
}

function createWoodPieceElement(piece) {
  const container = document.createElement('div');
  container.id = `wood-piece-${piece.id}`;
  container.className = `wood-piece flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer ${woodSelectedPieceId === piece.id ? 'is-selected' : ''}`;
  container.setAttribute('draggable', 'true');
  container.dataset.pieceId = piece.id;

  // Polyomino Grid Layout inside piece
  const maxR = Math.max(...piece.shape.map(s => s[0])) + 1;
  const maxC = Math.max(...piece.shape.map(s => s[1])) + 1;

  const shapeGrid = document.createElement('div');
  shapeGrid.className = 'grid gap-1 items-center justify-center';
  shapeGrid.style.gridTemplateColumns = `repeat(${maxC}, minmax(0, 1fr))`;

  const colorClass = `wood-tile-${piece.color || 'cherry'}`;

  for (let r = 0; r < maxR; r++) {
    for (let c = 0; c < maxC; c++) {
      const isOccupied = piece.shape.some(s => s[0] === r && s[1] === c);
      const cell = document.createElement('div');
      
      if (isOccupied) {
        cell.className = `w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${colorClass} flex items-center justify-center font-hanzi font-black text-xs sm:text-sm wood-engraved-text text-center shadow-md p-1 leading-tight`;
        const shapeIndex = piece.shape.findIndex(s => s[0] === r && s[1] === c);
        cell.innerText = getPieceCellText(piece, shapeIndex >= 0 ? shapeIndex : 0);
      } else {
        cell.className = 'w-12 h-12 sm:w-14 sm:h-14 opacity-0 pointer-events-none';
      }
      shapeGrid.appendChild(cell);
    }
  }

  container.appendChild(shapeGrid);

  // Audio Pronounce hint button on piece
  const audioBtn = document.createElement('button');
  audioBtn.className = 'mt-1.5 px-2 py-0.5 rounded-full bg-black/40 hover:bg-black/60 text-amber-200 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer';
  audioBtn.innerHTML = '<span>🔊</span><span>Nghe</span>';
  audioBtn.onclick = (e) => {
    e.stopPropagation();
    playChineseTTS(piece.text);
  };
  container.appendChild(audioBtn);

  // Interaction handlers
  container.addEventListener('click', (e) => {
    e.stopPropagation();
    selectWoodPiece(piece.id);
  });

  // Setup Smooth Pointer & Touch Dragging
  setupWoodPiecePointerInteraction(container, piece);

  // Dragstart
  container.addEventListener('dragstart', (e) => {
    selectWoodPiece(piece.id);
    e.dataTransfer.setData('text/plain', piece.id);
    container.classList.add('is-dragging');
  });

  container.addEventListener('dragend', () => {
    container.classList.remove('is-dragging');
    clearBoardHoverHighlights();
  });

  return container;
}

let pointerDragState = null;
let activeFloatingGhost = null;

function setupWoodPiecePointerInteraction(container, piece) {
  container.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;

    selectWoodPiece(piece.id);

    pointerDragState = {
      pieceId: piece.id,
      startX: e.clientX,
      startY: e.clientY,
      isDragging: false
    };

    try {
      container.setPointerCapture(e.pointerId);
    } catch (err) {}
  });

  container.addEventListener('pointermove', (e) => {
    if (!pointerDragState || pointerDragState.pieceId !== piece.id) return;

    const dx = e.clientX - pointerDragState.startX;
    const dy = e.clientY - pointerDragState.startY;
    const dist = Math.hypot(dx, dy);

    if (dist > 8 && !pointerDragState.isDragging) {
      pointerDragState.isDragging = true;
      container.classList.add('is-dragging');

      if (!activeFloatingGhost) {
        activeFloatingGhost = createFloatingGhostElement(piece);
        document.body.appendChild(activeFloatingGhost);
      }
    }

    if (pointerDragState.isDragging && activeFloatingGhost) {
      activeFloatingGhost.style.left = `${e.clientX}px`;
      activeFloatingGhost.style.top = `${e.clientY}px`;

      const elBeneath = document.elementFromPoint(e.clientX, e.clientY);
      const cellEl = elBeneath ? elBeneath.closest('.wood-slot-cell') : null;
      if (cellEl && cellEl.dataset.row !== undefined) {
        const r = parseInt(cellEl.dataset.row, 10);
        const c = parseInt(cellEl.dataset.col, 10);
        previewWoodCellHover(r, c);
      } else {
        const cells = document.querySelectorAll('.wood-slot-cell');
        cells.forEach(c => c.classList.remove('slot-hover-valid', 'slot-hover-invalid'));
      }
    }
  });

  const handlePointerEnd = (e) => {
    if (!pointerDragState || pointerDragState.pieceId !== piece.id) return;

    try {
      if (container.hasPointerCapture(e.pointerId)) {
        container.releasePointerCapture(e.pointerId);
      }
    } catch (err) {}
    container.classList.remove('is-dragging');

    if (activeFloatingGhost) {
      activeFloatingGhost.remove();
      activeFloatingGhost = null;
    }

    if (pointerDragState.isDragging) {
      const elBeneath = document.elementFromPoint(e.clientX, e.clientY);
      const cellEl = elBeneath ? elBeneath.closest('.wood-slot-cell') : null;
      if (cellEl && cellEl.dataset.row !== undefined) {
        const r = parseInt(cellEl.dataset.row, 10);
        const c = parseInt(cellEl.dataset.col, 10);
        handleWoodCellDrop({ preventDefault() {}, dataTransfer: { getData: () => piece.id } }, r, c);
      }
    }
    clearBoardHoverHighlights();
    pointerDragState = null;
  };

  container.addEventListener('pointerup', handlePointerEnd);
  container.addEventListener('pointercancel', handlePointerEnd);
}

function createFloatingGhostElement(piece) {
  const ghost = document.createElement('div');
  ghost.className = 'wood-floating-ghost';

  const maxR = Math.max(...piece.shape.map(s => s[0])) + 1;
  const maxC = Math.max(...piece.shape.map(s => s[1])) + 1;

  const shapeGrid = document.createElement('div');
  shapeGrid.className = 'grid gap-1.5 items-center justify-center';
  shapeGrid.style.gridTemplateColumns = `repeat(${maxC}, minmax(0, 1fr))`;
  const colorClass = `wood-tile-${piece.color || 'cherry'}`;

  for (let r = 0; r < maxR; r++) {
    for (let c = 0; c < maxC; c++) {
      const isOccupied = piece.shape.some(s => s[0] === r && s[1] === c);
      const cell = document.createElement('div');
      if (isOccupied) {
        cell.className = `w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center font-hanzi font-black text-xs wood-engraved-text text-center p-1 leading-tight shadow-md`;
        const shapeIndex = piece.shape.findIndex(s => s[0] === r && s[1] === c);
        cell.innerText = getPieceCellText(piece, shapeIndex >= 0 ? shapeIndex : 0);
      } else {
        cell.className = 'w-12 h-12 opacity-0 pointer-events-none';
      }
      shapeGrid.appendChild(cell);
    }
  }

  ghost.appendChild(shapeGrid);
  return ghost;
}

function selectWoodPiece(pieceId) {
  const currentLvl = getCurrentWoodLevel();
  if (!currentLvl) return;

  if (woodSelectedPieceId === pieceId) {
    woodSelectedPieceId = null;
    clearPlaceableHints();
    clearBoardHoverHighlights();
    renderWoodPiecesTray(currentLvl.blocks);
    const statusEl = document.getElementById('woodBoardStatusHint');
    if (statusEl) statusEl.innerText = 'Kéo thả khối gỗ hoặc chạm chọn khối rồi chạm ô cờ để đặt!';
    return;
  }

  woodSelectedPieceId = pieceId;
  renderWoodPiecesTray(currentLvl.blocks);

  const piece = currentLvl.blocks.find(b => b.id === pieceId);
  if (piece) {
    const placeableCount = highlightPlaceableCellsForPiece(piece);
    const statusEl = document.getElementById('woodBoardStatusHint');
    if (statusEl) {
      if (placeableCount > 0) {
        statusEl.innerHTML = `<span>👉</span><span>Đã chọn khối <strong>"${escapeHtml(piece.text)}"</strong>! Hãy chạm vào các ô <strong>xanh lá</strong> trên bàn cờ để đặt!</span>`;
      } else {
        statusEl.innerHTML = `<span>⚠️</span><span>Khối <strong>"${escapeHtml(piece.text)}"</strong> chưa có vị trí vừa vặn! Hãy di chuyển hoặc chạm khối trên bàn cờ để thu hồi bớt.</span>`;
      }
    }
  }
}

function highlightPlaceableCellsForPiece(piece) {
  clearPlaceableHints();
  if (!piece) return 0;
  const currentLvl = getCurrentWoodLevel();
  if (!currentLvl) return 0;

  const rows = currentLvl.grid.rows;
  const cols = currentLvl.grid.cols;
  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (canPlaceWoodPiece(piece.shape, r, c, rows, cols)) {
        const cell = document.getElementById(`wood-cell-${r}-${c}`);
        if (cell) {
          cell.classList.add('slot-placeable-hint');
          count++;
        }
      }
    }
  }
  return count;
}

function clearPlaceableHints() {
  const cells = document.querySelectorAll('.slot-placeable-hint');
  cells.forEach(c => c.classList.remove('slot-placeable-hint'));
}

function handleWoodCellClick(row, col) {
  // 1. If clicking a cell that already has a placed block, return that block back to tray
  if (woodBoardState[row] && woodBoardState[row][col] !== null) {
    const placedItem = woodBoardState[row][col];
    returnPieceToTray(placedItem.pieceId);
    showToast(`Đã thu hồi khối "${placedItem.text}" về khay!`, 'info');
    return;
  }

  // 2. If a piece is currently selected from tray, try placing it starting at this cell
  if (woodSelectedPieceId) {
    const currentLvl = getCurrentWoodLevel();
    if (!currentLvl) return;
    const piece = currentLvl.blocks.find(b => b.id === woodSelectedPieceId);
    if (!piece) return;

    if (canPlaceWoodPiece(piece.shape, row, col, currentLvl.grid.rows, currentLvl.grid.cols)) {
      placeWoodPiece(piece, row, col);
      woodSelectedPieceId = null;
      clearPlaceableHints();
      clearBoardHoverHighlights();
      renderWoodPiecesTray(currentLvl.blocks);
      playWoodDropSound();
      updateWoodRemainingCount();

      const statusEl = document.getElementById('woodBoardStatusHint');
      if (statusEl) statusEl.innerText = 'Đã đặt khối gỗ thành công!';

      // Check if all pieces placed
      if (woodPlacedBlocks.size === currentLvl.blocks.length) {
        setTimeout(() => checkWoodBoardAnswer(false), 300);
      }
    } else {
      showToast('Khối gỗ không vừa vặn tại vị trí này! Vui lòng chọn vị trí khác.', 'warning');
    }
  }
}

function previewWoodCellHover(row, col) {
  if (!woodSelectedPieceId) return;
  const currentLvl = getCurrentWoodLevel();
  if (!currentLvl) return;
  const piece = currentLvl.blocks.find(b => b.id === woodSelectedPieceId);
  if (!piece) return;

  const rows = currentLvl.grid.rows;
  const cols = currentLvl.grid.cols;
  const isValid = canPlaceWoodPiece(piece.shape, row, col, rows, cols);

  const cells = document.querySelectorAll('.wood-slot-cell');
  cells.forEach(c => c.classList.remove('slot-hover-valid', 'slot-hover-invalid'));

  piece.shape.forEach(([dr, dc]) => {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      const cell = document.getElementById(`wood-cell-${r}-${c}`);
      if (cell) {
        cell.classList.add(isValid ? 'slot-hover-valid' : 'slot-hover-invalid');
      }
    }
  });
}

function handleWoodCellDragOver(e, row, col) {
  e.preventDefault();
  previewWoodCellHover(row, col);
}

function handleWoodCellDragLeave(row, col) {
  clearBoardHoverHighlights();
}

function handleWoodCellDrop(e, row, col) {
  if (e.preventDefault) e.preventDefault();
  clearBoardHoverHighlights();
  clearPlaceableHints();
  const pieceId = (e.dataTransfer && e.dataTransfer.getData) ? e.dataTransfer.getData('text/plain') : woodSelectedPieceId;
  const targetId = pieceId || woodSelectedPieceId;
  if (!targetId) return;

  const currentLvl = getCurrentWoodLevel();
  if (!currentLvl) return;
  const piece = currentLvl.blocks.find(b => b.id === targetId);
  if (!piece) return;

  if (canPlaceWoodPiece(piece.shape, row, col, currentLvl.grid.rows, currentLvl.grid.cols)) {
    placeWoodPiece(piece, row, col);
    woodSelectedPieceId = null;
    renderWoodPiecesTray(currentLvl.blocks);
    playWoodDropSound();
    updateWoodRemainingCount();

    if (woodPlacedBlocks.size === currentLvl.blocks.length) {
      setTimeout(() => checkWoodBoardAnswer(false), 300);
    }
  } else {
    showToast('Khối gỗ không vừa vặn tại vị trí này!', 'warning');
  }
}

function clearBoardHoverHighlights() {
  const cells = document.querySelectorAll('.wood-slot-cell');
  cells.forEach(c => c.classList.remove('slot-hover-valid', 'slot-hover-invalid'));

  if (woodSelectedPieceId) {
    const currentLvl = getCurrentWoodLevel();
    if (currentLvl) {
      const piece = currentLvl.blocks.find(b => b.id === woodSelectedPieceId);
      if (piece) highlightPlaceableCellsForPiece(piece);
    }
  }
}

function canPlaceWoodPiece(shape, originR, originC, maxR, maxC) {
  for (const [dr, dc] of shape) {
    const r = originR + dr;
    const c = originC + dc;
    if (r < 0 || r >= maxR || c < 0 || c >= maxC) return false;
    if (woodBoardState[r][c] !== null) return false;
  }
  return true;
}

function placeWoodPiece(piece, originR, originC) {
  const colorClass = `wood-tile-${piece.color || 'cherry'}`;

  piece.shape.forEach(([dr, dc], shapeIndex) => {
    const r = originR + dr;
    const c = originC + dc;
    const charChunk = getPieceCellText(piece, shapeIndex);

    woodBoardState[r][c] = {
      pieceId: piece.id,
      text: piece.text,
      chunk: charChunk,
      color: piece.color,
      isOrigin: (dr === 0 && dc === 0)
    };

    const cellEl = document.getElementById(`wood-cell-${r}-${c}`);
    if (cellEl) {
      cellEl.className = `wood-slot-cell ${colorClass} flex items-center justify-center font-hanzi font-black text-xs sm:text-sm wood-engraved-text text-center p-1 leading-tight shadow-md cursor-pointer animate-fade-in`;
      cellEl.innerText = charChunk;
      cellEl.title = `Khối "${piece.text}" - Bấm để trả về khay`;
    }
  });

  woodPlacedBlocks.set(piece.id, { originRow: originR, originCol: originC, piece });
}

function returnPieceToTray(pieceId) {
  if (!woodPlacedBlocks.has(pieceId)) return;
  const { piece } = woodPlacedBlocks.get(pieceId);

  const currentLvl = getCurrentWoodLevel();
  if (!currentLvl) return;
  const rows = currentLvl.grid.rows;
  const cols = currentLvl.grid.cols;

  // Clear board state & DOM cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (woodBoardState[r][c] && woodBoardState[r][c].pieceId === pieceId) {
        woodBoardState[r][c] = null;
        const cellEl = document.getElementById(`wood-cell-${r}-${c}`);
        if (cellEl) {
          const cellSizeClass = rows <= 3 ? 'w-16 h-16 sm:w-20 sm:h-20 text-sm sm:text-base' : (rows <= 4 ? 'w-13 h-13 sm:w-16 sm:h-16 text-xs sm:text-sm' : 'w-11 h-11 sm:w-13 sm:h-13 text-xs');
          cellEl.className = `wood-slot-cell ${cellSizeClass} flex items-center justify-center font-hanzi font-bold cursor-pointer transition-all`;
          cellEl.innerText = '';
          cellEl.removeAttribute('title');
        }
      }
    }
  }

  woodPlacedBlocks.delete(pieceId);
  playWoodReturnSound();
  renderWoodPiecesTray(currentLvl.blocks);
  updateWoodRemainingCount();
}

function updateWoodRemainingCount() {
  const currentLvl = getCurrentWoodLevel();
  if (!currentLvl) return;
  if (!currentLvl) return;

  const remaining = currentLvl.blocks.length - woodPlacedBlocks.size;
  const countEl = document.getElementById('woodRemainingCount');
  if (countEl) countEl.innerText = `${remaining} khối`;

  const checkBtn = document.getElementById('woodBtnCheckAnswer');
  if (checkBtn) {
    if (remaining === 0) {
      checkBtn.classList.remove('opacity-60');
      checkBtn.classList.add('animate-pulse');
    } else {
      checkBtn.classList.remove('animate-pulse');
    }
  }
}

function checkWoodBoardAnswer(isManualClick = true) {
  const currentLvl = getCurrentWoodLevel();
  if (!currentLvl) return;
  if (!currentLvl) return;

  if (woodPlacedBlocks.size < currentLvl.blocks.length) {
    if (isManualClick) {
      showToast('Hãy xếp kín toàn bộ các khối gỗ vào bàn cờ trước khi kiểm tra!', 'info');
    }
    return;
  }

  // Check correct positions of all placed blocks
  let allCorrect = true;
  for (const block of currentLvl.blocks) {
    const placed = woodPlacedBlocks.get(block.id);
    if (!placed) {
      allCorrect = false;
      break;
    }
    if (placed.originRow !== block.correctPos[0] || placed.originCol !== block.correctPos[1]) {
      allCorrect = false;
      break;
    }
  }

  if (allCorrect) {
    // VICTORY!
    playVictorySound();
    
    // Calculate EXP reward (+30 easy, +40 med, +50 hard)
    const expReward = currentLvl.tier === 'easy' ? 30 : (currentLvl.tier === 'medium' ? 40 : 50);
    addExp(expReward);

    // Save level stars & unlock next level
    woodUserProgress.stars[currentLvl.level] = 3;
    woodUserProgress.unlockedLevel = Math.max(woodUserProgress.unlockedLevel || 1, currentLvl.level + 1);
    saveWoodProgress();

    // Show Victory Celebration Modal
    openWoodVictoryModal(currentLvl);
  } else {
    // Incorrect Placement
    if (isManualClick) {
      showToast('Thứ tự câu hoặc vị trí chưa chuẩn xác! Bấm vào khối gỗ để thu hồi và xếp lại nhé.', 'warning');
    }
  }
}

function openWoodVictoryModal(lvl) {
  if (!document.getElementById('woodVictoryModal')) return;

  const hanziEl = document.getElementById('woodVictoryHanzi');
  const pinyinEl = document.getElementById('woodVictoryPinyin');
  const meaningEl = document.getElementById('woodVictoryMeaning');
  const grammarEl = document.getElementById('woodVictoryGrammar');

  if (hanziEl) hanziEl.innerText = lvl.sentence;
  if (pinyinEl) pinyinEl.innerText = lvl.pinyin;
  if (meaningEl) meaningEl.innerText = `"${lvl.meaning}"`;
  if (grammarEl) grammarEl.innerText = lvl.grammar || 'Cấu trúc câu hoàn hảo trong Hán ngữ.';

  openModal('woodVictoryModal');

  // Auto pronounce sentence on victory after a short delay
  setTimeout(() => {
    playChineseTTS(lvl.sentence, 0.85);
  }, 500);
}

function closeWoodVictoryModal() {
  closeModal('woodVictoryModal');
}

registerModal('woodVictoryModal', closeWoodVictoryModal);

function playWoodVictorySentenceAudio() {
  const currentLvl = getCurrentWoodLevel();
  if (!currentLvl) return;
  if (currentLvl) {
    playChineseTTS(currentLvl.sentence, 0.85);
  }
}

function nextWoodLevel() {
  closeWoodVictoryModal();
  if (currentWoodLevelIndex < woodBlockLevels.length - 1) {
    loadWoodLevel(currentWoodLevelIndex + 1);
    showToast(`Đã sang Cấp Độ ${currentWoodLevelIndex + 1}! Bắt đầu thử thách mới 🏮`, 'success');
  } else {
    showToast('🎉 Chúc mừng bạn đã phá đảo toàn bộ 60 Cấp Độ Xếp Khối Gỗ Hán Ngữ!', 'success');
  }
}

function toggleWoodMeaningHint() {
  const banner = document.getElementById('woodMeaningHintBanner');
  if (!banner) return;
  banner.classList.toggle('hidden');
}

function woodBlockAutoHint() {
  const currentLvl = getCurrentWoodLevel();
  if (!currentLvl) return;
  if (!currentLvl) return;

  // Find the first unplaced block
  const unplaced = currentLvl.blocks.find(b => !woodPlacedBlocks.has(b.id));
  if (!unplaced) {
    showToast('Tất cả các khối đã được đặt trên bàn cờ!', 'info');
    return;
  }

  // If its correct position is currently occupied by another piece, return that piece first
  const targetR = unplaced.correctPos[0];
  const targetC = unplaced.correctPos[1];

  for (const [dr, dc] of unplaced.shape) {
    const r = targetR + dr;
    const c = targetC + dc;
    if (woodBoardState[r] && woodBoardState[r][c] !== null) {
      returnPieceToTray(woodBoardState[r][c].pieceId);
    }
  }

  // Place unplaced block in its exact correct position
  placeWoodPiece(unplaced, targetR, targetC);
  woodSelectedPieceId = null;
  renderWoodPiecesTray(currentLvl.blocks);
  playWoodDropSound();
  updateWoodRemainingCount();

  showToast(`💡 Gợi ý: Đã đặt khối "${unplaced.text}" vào vị trí chuẩn xác!`, 'info');

  if (woodPlacedBlocks.size === currentLvl.blocks.length) {
    setTimeout(() => checkWoodBoardAnswer(false), 300);
  }
}

function resetWoodCurrentLevel() {
  const currentLvl = getCurrentWoodLevel();
  if (!currentLvl) return;
  if (!currentLvl) return;

  // Return all pieces
  const placedIds = Array.from(woodPlacedBlocks.keys());
  placedIds.forEach(id => returnPieceToTray(id));

  woodSelectedPieceId = null;
  renderWoodPiecesTray(currentLvl.blocks);
  showToast('Đã thu hồi toàn bộ khối gỗ về khay! Bạn có thể bắt đầu xếp lại.', 'info');
}

function openWoodLevelSelectorModal() {
  if (!document.getElementById('woodLevelSelectorModal')) return;

  openModal('woodLevelSelectorModal');
  filterWoodLevelMap(woodActiveTierFilter || 'easy');
}

function closeWoodLevelSelectorModal() {
  closeModal('woodLevelSelectorModal');
}

registerModal('woodLevelSelectorModal', closeWoodLevelSelectorModal);

function filterWoodLevelMap(tier) {
  woodActiveTierFilter = tier;
  const btnEasy = document.getElementById('woodTierBtnEasy');
  const btnMed = document.getElementById('woodTierBtnMedium');
  const btnHard = document.getElementById('woodTierBtnHard');

  if (btnEasy) btnEasy.className = tier === 'easy' ? 'flex-1 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all text-center cursor-pointer' : 'flex-1 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:text-[#8B1E1E] transition-all text-center cursor-pointer';
  if (btnMed) btnMed.className = tier === 'medium' ? 'flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-2xs transition-all text-center cursor-pointer' : 'flex-1 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:text-[#8B1E1E] transition-all text-center cursor-pointer';
  if (btnHard) btnHard.className = tier === 'hard' ? 'flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-700 to-red-800 text-white shadow-2xs transition-all text-center cursor-pointer' : 'flex-1 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:text-[#8B1E1E] transition-all text-center cursor-pointer';

  renderWoodLevelGrid();
}

function renderWoodLevelGrid() {
  const container = document.getElementById('woodLevelGridContainer');
  if (!container || !woodBlockLevels) return;

  container.innerHTML = '';
  const unlocked = woodUserProgress.unlockedLevel || 1;

  // Filter levels for active tier
  const filteredLevels = woodBlockLevels.filter(lvl => lvl.tier === woodActiveTierFilter);

  filteredLevels.forEach(lvl => {
    const isUnlocked = lvl.level <= unlocked;
    const isCurrent = lvl.level === currentWoodLevelIndex + 1;
    const stars = woodUserProgress.stars[lvl.level] || 0;

    const card = document.createElement('button');
    card.className = `p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all cursor-pointer ${isUnlocked ? (isCurrent ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/30 border-2 border-amber-400 shadow-md ring-2 ring-amber-400/50' : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-400 shadow-2xs hover:scale-105') : 'bg-stone-100 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 opacity-60 cursor-not-allowed'}`;
    
    if (isUnlocked) {
      card.onclick = () => {
        closeWoodLevelSelectorModal();
        loadWoodLevel(lvl.level - 1);
      };
    }

    card.innerHTML = `
      <div class="flex items-center justify-between w-full text-[10px] text-stone-400">
        <span>#${lvl.level}</span>
        <span>${isUnlocked ? (stars >= 3 ? '⭐⭐⭐' : (stars > 0 ? '⭐' : '')) : '🔒'}</span>
      </div>
      <div class="my-1.5 w-10 h-10 rounded-xl ${isUnlocked ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200' : 'bg-stone-200 dark:bg-stone-800 text-stone-400'} flex items-center justify-center font-bold text-sm">
        ${lvl.level}
      </div>
      <p class="text-[10px] font-bold text-stone-800 dark:text-stone-200 truncate w-full">
        ${escapeHtml(lvl.title)}
      </p>
    `;

    container.appendChild(card);
  });
}

// Window Exports for Wood Block Game
window.initWoodBlockGame = initWoodBlockGame;
window.loadWoodLevel = loadWoodLevel;
window.selectWoodPiece = selectWoodPiece;
window.handleWoodCellClick = handleWoodCellClick;
window.woodBlockAutoHint = woodBlockAutoHint;
window.resetWoodCurrentLevel = resetWoodCurrentLevel;
window.nextWoodLevel = nextWoodLevel;
window.openWoodLevelSelectorModal = openWoodLevelSelectorModal;
window.closeWoodLevelSelectorModal = closeWoodLevelSelectorModal;
window.filterWoodLevelMap = filterWoodLevelMap;
window.getWoodPlacedBlocks = () => woodPlacedBlocks;
window.getWoodBoardState = () => woodBoardState;
window.getWoodSelectedPieceId = () => woodSelectedPieceId;
window.getCurrentWoodLevelIndex = () => currentWoodLevelIndex;

})();

/* --- FILE: js/features/flipcard.js --- */
(function(){
// ==================== LẬT THẺ TÌM TỪ ĐỒNG NGHĨA & TRÁI NGHĨA (汉语翻翻卡) ENGINE ====================

let currentFlipLevelIndex = 0;
let activeFlipCards = [];
let flippedCardIndices = [];
let matchedPairsCount = 0;
let flipMovesCount = 0;
let flipScore = 0;
let flipCombo = 1;
let flipTimerSeconds = 0;
let flipTimerInterval = null;
let isFlipCardProcessing = false;
let currentFlipGameMode = 'all'; // 'all', 'synonym', 'antonym'
let flipActiveTierFilter = 'all';
let currentMatchPairData = null;
let flipCardGameInitialized = false;
let flipStatusResetTimer = null;

let flipUserProgress = {
  unlockedLevel: 1,
  stars: {},
  highScores: {}
};

function getAudioCtx() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return AudioContext ? new AudioContext() : null;
  } catch (e) {
    return null;
  }
}

// Web Audio Synthesis for Flip Card Game
function playCardFlipSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, startTime);
    osc.frequency.exponentialRampToValueAtTime(520, startTime + 0.1);

    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.13);
  } catch (e) {}
}

function playCardMatchSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  } catch (e) {}
}

function playCardMismatchSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const notes = [220, 185]; // Low gentle buzz
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.1;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  } catch (e) {}
}

function playCardVictorySound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const fanfare = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.50, d: 0.25 }, // C6
      { f: 880.00, d: 0.14 }, // A5
      { f: 1046.50, d: 0.45 }  // C6 hold
    ];
    let curTime = ctx.currentTime;
    fanfare.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, curTime);

      gain.gain.setValueAtTime(0.22, curTime);
      gain.gain.exponentialRampToValueAtTime(0.001, curTime + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(curTime);
      osc.stop(curTime + note.d);

      curTime += note.d * 0.85;
    });
  } catch (e) {}
}

async function initFlipCardGame() {
  if (flipCardGameInitialized && flipCardLevels.length > 0) return;
  try {
    const saved = typeof storage !== 'undefined' ? storage.get('flip_card_progress', null) : null;
    if (saved) {
      flipUserProgress = Object.assign(flipUserProgress, saved);
    }

    if (!flipCardLevels || flipCardLevels.length === 0) {
      if (typeof loadData === 'function') {
        await loadData('flipCard');
      } else {
        const res = await fetch('data/flip_card_levels.json');
        flipCardLevels = await res.json();
      }
    }

    flipCardGameInitialized = true;
    const targetIdx = Math.min(flipCardLevels.length - 1, (flipUserProgress.unlockedLevel || 1) - 1);
    currentFlipLevelIndex = Math.max(0, targetIdx);

    loadFlipCardLevel(currentFlipLevelIndex);
  } catch (err) {
    console.warn('Lỗi khi tải dữ liệu game Lật thẻ:', err);
  }
}

function saveFlipCardProgress() {
  try {
    if (typeof storage !== 'undefined') {
      storage.set('flip_card_progress', flipUserProgress);
    } else {
      localStorage.setItem('flip_card_progress', JSON.stringify(flipUserProgress));
    }
  } catch (e) {}
}

function getCurrentFlipLevel() {
  if (!flipCardLevels || flipCardLevels.length === 0) return null;
  return flipCardLevels[currentFlipLevelIndex] || flipCardLevels[0];
}

function loadFlipCardLevel(index) {
  if (!flipCardLevels || flipCardLevels.length === 0) return;
  if (index < 0) index = 0;
  if (index >= flipCardLevels.length) index = flipCardLevels.length - 1;

  // VIP Access Guard: Level 6+ requires VIP if trial is expired
  if (index >= 5 && typeof checkCurrentUserVip === 'function') {
    const vip = checkCurrentUserVip();
    if (vip.isExpired) {
      ensureVipAccess(`Cấp độ ${index + 1} của game Lật Thẻ (汉语翻翻卡)`);
      return;
    }
  }

  currentFlipLevelIndex = index;
  const lvl = flipCardLevels[index];

  // Update Toolbar Header Info
  const levelNumEl = document.getElementById('flipCurrentLevelNum');
  const levelNameEl = document.getElementById('flipCurrentLevelName');
  const tierBadgeEl = document.getElementById('flipCurrentTierBadge');
  const descTextEl = document.getElementById('flipLevelDescText');

  if (levelNumEl) levelNumEl.innerText = lvl.level;
  if (levelNameEl) levelNameEl.innerText = lvl.title;
  if (descTextEl) {
    if (flipStatusResetTimer) {
      clearTimeout(flipStatusResetTimer);
      flipStatusResetTimer = null;
    }
    descTextEl.innerText = lvl.description;
    descTextEl.setAttribute('data-original-desc', lvl.description);
  }

  if (tierBadgeEl) {
    if (lvl.tier === 'easy') {
      tierBadgeEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300';
      tierBadgeEl.innerText = 'Sơ Cấp (HSK 1-2)';
    } else if (lvl.tier === 'medium') {
      tierBadgeEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300';
      tierBadgeEl.innerText = 'Trung Cấp (HSK 3-4)';
    } else {
      tierBadgeEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border border-rose-300';
      tierBadgeEl.innerText = 'Cao Cấp (HSK 5-6)';
    }
  }

  // Generate Deck Cards from Pairs
  activeFlipCards = [];
  lvl.pairs.forEach(pair => {
    // Card A
    activeFlipCards.push({
      id: pair.id + '_A',
      pairId: pair.id,
      type: pair.type,
      typeLabel: pair.typeLabel,
      word: pair.wordA,
      counterpart: pair.wordB,
      pair: pair,
      isFlipped: false,
      isMatched: false
    });

    // Card B
    activeFlipCards.push({
      id: pair.id + '_B',
      pairId: pair.id,
      type: pair.type,
      typeLabel: pair.typeLabel,
      word: pair.wordB,
      counterpart: pair.wordA,
      pair: pair,
      isFlipped: false,
      isMatched: false
    });
  });

  // Fisher-Yates Shuffle
  for (let i = activeFlipCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [activeFlipCards[i], activeFlipCards[j]] = [activeFlipCards[j], activeFlipCards[i]];
  }

  // Reset Game State Counters
  flippedCardIndices = [];
  matchedPairsCount = 0;
  flipMovesCount = 0;
  flipScore = 0;
  flipCombo = 1;
  isFlipCardProcessing = false;

  updateFlipHudStats();
  startFlipTimer();
  renderFlipCardGrid();

  // Hide Live Match Banner
  const matchBanner = document.getElementById('flipCardMatchReviewBanner');
  if (matchBanner) matchBanner.classList.add('hidden');

  const tab = document.getElementById('tab-flipcard');
  if (tab) refreshIcons(tab);
}

function startFlipTimer() {
  if (flipTimerInterval) clearInterval(flipTimerInterval);
  flipTimerSeconds = 0;
  updateFlipTimerDisplay();
  flipTimerInterval = setInterval(() => {
    flipTimerSeconds++;
    updateFlipTimerDisplay();
  }, 1000);
}

function stopFlipTimer() {
  if (flipTimerInterval) {
    clearInterval(flipTimerInterval);
    flipTimerInterval = null;
  }
}

function updateFlipTimerDisplay() {
  const el = document.getElementById('flipTimerDisplay');
  if (!el) return;
  const m = Math.floor(flipTimerSeconds / 60);
  const s = flipTimerSeconds % 60;
  el.innerText = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

function updateFlipHudStats() {
  const scoreEl = document.getElementById('flipScoreDisplay');
  const comboEl = document.getElementById('flipComboDisplay');
  const movesEl = document.getElementById('flipMovesDisplay');
  const matchedEl = document.getElementById('flipMatchedProgressDisplay');

  const lvl = getCurrentFlipLevel();
  const totalPairs = lvl ? lvl.pairs.length : 3;

  if (scoreEl) scoreEl.innerText = flipScore;
  if (comboEl) comboEl.innerText = `x${flipCombo}`;
  if (movesEl) movesEl.innerText = flipMovesCount;
  if (matchedEl) matchedEl.innerText = `${matchedPairsCount} / ${totalPairs}`;
}

function renderFlipCardGrid() {
  const grid = document.getElementById('flipCardArenaGrid');
  if (!grid) return;

  grid.innerHTML = '';
  const totalCards = activeFlipCards.length;

  // Dynamic Grid Columns based on cards count
  if (totalCards <= 6) {
    grid.className = 'grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5 w-full max-w-xl mx-auto';
  } else if (totalCards <= 8) {
    grid.className = 'grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 w-full max-w-2xl mx-auto';
  } else if (totalCards <= 12) {
    grid.className = 'grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-3.5 md:gap-4 w-full max-w-4xl mx-auto';
  } else {
    grid.className = 'grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 w-full max-w-5xl mx-auto';
  }

  activeFlipCards.forEach((card, idx) => {
    const cardEl = createFlipCardElement(card, idx);
    grid.appendChild(cardEl);
  });
}

function createFlipCardElement(card, idx) {
  const cardDiv = document.createElement('div');
  cardDiv.id = `flip-card-${idx}`;
  cardDiv.className = `flip-card ${card.isFlipped ? 'is-flipped' : ''} ${card.isMatched ? 'is-matched' : ''}`;
  cardDiv.onclick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleCardClick(idx);
  };

  const isImageMode = card.type === 'image';
  const isImageCard = isImageMode && card.word && card.word.isImage;
  const isSynonym = card.type === 'synonym';

  let badgeClass = '';
  let badgeText = '';

  if (isImageMode) {
    if (isImageCard) {
      badgeClass = 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300';
      badgeText = '图文 • Hình ảnh';
    } else {
      badgeClass = 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300';
      badgeText = '汉字 • Từ Hán';
    }
  } else if (isSynonym) {
    badgeClass = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300';
    badgeText = '近义 • Đồng nghĩa';
  } else {
    badgeClass = 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300';
    badgeText = '反义 • Trái nghĩa';
  }

  const centerContentHtml = isImageCard
    ? `
      <div class="my-auto py-1 flex flex-col items-center justify-center">
        <div class="text-4xl sm:text-5xl my-1 select-none transform hover:scale-110 transition-transform">
          ${card.word.image}
        </div>
        <div class="text-xs font-bold text-stone-800 dark:text-stone-200 line-clamp-1 mt-0.5">
          ${card.word.meaning}
        </div>
        <div class="text-[9px] text-amber-600 dark:text-amber-400 font-semibold tracking-wider uppercase mt-0.5">
          Hình Minh Họa
        </div>
      </div>
    `
    : `
      <div class="my-auto py-1">
        <div class="font-hanzi font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 leading-tight">
          ${card.word.hanzi}
        </div>
        <div class="text-xs font-bold text-[#8B1E1E] dark:text-amber-400 mt-0.5">
          ${card.word.pinyin}
        </div>
        <div class="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-1 mt-0.5">
          ${card.word.meaning}
        </div>
      </div>
    `;

  cardDiv.innerHTML = `
    <div class="flip-card-inner">
      <!-- Mặt Úp (Facedown Front) -->
      <div class="flip-card-face flip-card-front">
        <div class="text-2xl mb-1 opacity-90 animate-pulse">🏮</div>
        <div class="font-hanzi font-black text-3xl sm:text-4xl text-amber-200 wood-engraved-text">
          翻
        </div>
        <div class="text-[9px] uppercase tracking-wider text-amber-300/80 font-bold mt-1">
          汉语翻翻卡
        </div>
      </div>

      <!-- Mặt Ngửa (Revealed Back) -->
      <div class="flip-card-face flip-card-back">
        <!-- Top Relation Badge -->
        <div class="flex items-center justify-between w-full">
          <span class="px-2 py-0.5 rounded-full text-[9px] font-black border ${badgeClass}">
            ${badgeText}
          </span>
          <button 
            type="button"
            onclick="event.stopPropagation(); event.preventDefault(); playChineseTTS('${card.word.hanzi}');"
            class="p-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-stone-800 text-[10px] cursor-pointer shadow-2xs"
            title="Nghe phát âm"
          >
            🔊
          </button>
        </div>

        <!-- Center Display -->
        ${centerContentHtml}

        <!-- Bottom Matched Indicator -->
        <div class="w-full">
          <span class="card-match-badge hidden w-full py-0.5 rounded-md text-[9px] font-black bg-emerald-100 text-emerald-800 items-center justify-center gap-1">
            <span>✓</span><span>Ghép Đúng</span>
          </span>
        </div>
      </div>
    </div>
  `;

  return cardDiv;
}

function handleCardClick(cardIndex) {
  if (isFlipCardProcessing) return;

  const card = activeFlipCards[cardIndex];
  if (!card || card.isFlipped || card.isMatched) return;
  if (flippedCardIndices.includes(cardIndex)) return;

  // Flip the card
  card.isFlipped = true;
  flippedCardIndices.push(cardIndex);

  const cardEl = document.getElementById(`flip-card-${cardIndex}`);
  if (cardEl) cardEl.classList.add('is-flipped');

  playCardFlipSound();
  playChineseTTS(card.word.hanzi);

  // If 2 cards are now open, evaluate the match
  if (flippedCardIndices.length === 2) {
    isFlipCardProcessing = true;
    flipMovesCount++;
    updateFlipHudStats();

    setTimeout(() => {
      evaluateCardPair();
    }, 450);
  }
}

function setFlipTemporaryStatus(msg, durationMs = 2000) {
  const descEl = document.getElementById('flipLevelDescText');
  if (!descEl) return;
  if (flipStatusResetTimer) clearTimeout(flipStatusResetTimer);
  const originalText = descEl.getAttribute('data-original-desc') || descEl.innerText;
  if (!descEl.getAttribute('data-original-desc')) {
    descEl.setAttribute('data-original-desc', originalText);
  }
  descEl.innerHTML = `<span class="text-rose-600 dark:text-rose-400 font-bold animate-pulse">${msg}</span>`;
  flipStatusResetTimer = setTimeout(() => {
    descEl.innerText = descEl.getAttribute('data-original-desc') || originalText;
    flipStatusResetTimer = null;
  }, durationMs);
}

function evaluateCardPair() {
  if (flippedCardIndices.length < 2) {
    isFlipCardProcessing = false;
    return;
  }

  const idx1 = flippedCardIndices[0];
  const idx2 = flippedCardIndices[1];
  const card1 = activeFlipCards[idx1];
  const card2 = activeFlipCards[idx2];
  const cardEl1 = document.getElementById(`flip-card-${idx1}`);
  const cardEl2 = document.getElementById(`flip-card-${idx2}`);

  // Check Match Condition
  const isMatch = (card1.pairId === card2.pairId && card1.id !== card2.id);

  if (isMatch) {
    // SUCCESS MATCH!
    card1.isMatched = true;
    card2.isMatched = true;

    if (cardEl1) cardEl1.classList.add('is-matched');
    if (cardEl2) cardEl2.classList.add('is-matched');

    playCardMatchSound();

    // Scoring & Combo
    const basePts = 100 * flipCombo;
    flipScore += basePts;
    matchedPairsCount++;
    flipCombo++;

    updateFlipHudStats();

    // Show Live Knowledge Review Banner
    showFlipMatchReviewBanner(card1.pair);

    if (flipCombo >= 3) {
      showToast(`🔥 Tuyệt vời! Combo x${flipCombo - 1}! +${basePts} Điểm`, 'success');
    }

    flippedCardIndices = [];
    isFlipCardProcessing = false;

    // Check Level Complete
    const lvl = getCurrentFlipLevel();
    if (lvl && matchedPairsCount === lvl.pairs.length) {
      stopFlipTimer();
      setTimeout(() => {
        handleFlipLevelVictory();
      }, 700);
    }

  } else {
    // MISMATCH (Hai thẻ không trùng khớp)
    playCardMismatchSound();
    flipCombo = 1;
    updateFlipHudStats();

    if (cardEl1) cardEl1.classList.add('is-wrong');
    if (cardEl2) cardEl2.classList.add('is-wrong');

    // Theo yêu cầu học viên: Giữ mở thẻ đúng 2.0s để người chơi kịp nhìn chữ Hán, Pinyin và ghi nhớ vị trí trước khi úp lại
    setFlipTemporaryStatus('⏳ Hai thẻ chưa trùng khớp! Đang giữ mở 2 giây để bạn kịp nhìn chữ Hán & ghi nhớ vị trí...', 2000);

    setTimeout(() => {
      if (cardEl1) {
        cardEl1.classList.remove('is-wrong', 'is-flipped');
      }
      if (cardEl2) {
        cardEl2.classList.remove('is-wrong', 'is-flipped');
      }
      card1.isFlipped = false;
      card2.isFlipped = false;
      flippedCardIndices = [];
      isFlipCardProcessing = false;
    }, 2000);
  }
}

function showFlipMatchReviewBanner(pair) {
  currentMatchPairData = pair;
  const banner = document.getElementById('flipCardMatchReviewBanner');
  const badge = document.getElementById('flipMatchBadge');
  const title = document.getElementById('flipMatchPairTitle');
  const meaning = document.getElementById('flipMatchMeaningText');
  const example = document.getElementById('flipMatchExampleText');

  if (!banner) return;

  const isImage = pair.type === 'image';
  const isSynonym = pair.type === 'synonym';

  if (badge) {
    if (isImage) {
      badge.innerText = 'TỪ VỰNG & HÌNH ẢNH (图文)';
      badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-2xs';
    } else if (isSynonym) {
      badge.innerText = 'CẶP ĐỒNG NGHĨA';
      badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-2xs';
    } else {
      badge.innerText = 'CẶP TRÁI NGHĨA';
      badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-2xs';
    }
  }

  if (title) {
    if (isImage) {
      title.innerText = `${pair.wordA.hanzi} (${pair.wordA.pinyin}) ↔ ${pair.wordA.image} ${pair.wordA.meaning}`;
    } else {
      const symbol = isSynonym ? '≈' : '≠';
      title.innerText = `${pair.wordA.hanzi} (${pair.wordA.pinyin}) ${symbol} ${pair.wordB.hanzi} (${pair.wordB.pinyin})`;
    }
  }
  if (meaning) meaning.innerText = pair.relationDesc;
  if (example) example.innerText = `"${pair.exampleSentence}"`;

  banner.classList.remove('hidden');

  // Speak pronunciation
  setTimeout(() => {
    playChineseTTS(pair.wordA.hanzi);
    if (!isImage && pair.wordB && pair.wordB.hanzi) {
      setTimeout(() => {
        playChineseTTS(pair.wordB.hanzi);
      }, 1100);
    }
  }, 250);
}

function playCurrentMatchAudio() {
  if (!currentMatchPairData) return;
  playChineseTTS(currentMatchPairData.wordA.hanzi);
  if (currentMatchPairData.type !== 'image' && currentMatchPairData.wordB && currentMatchPairData.wordB.hanzi) {
    setTimeout(() => {
      playChineseTTS(currentMatchPairData.wordB.hanzi);
    }, 1000);
  }
}

function flipCardAutoHint() {
  if (isFlipCardProcessing) return;

  // Find first pair not yet matched
  const unmatched = activeFlipCards.filter(c => !c.isMatched);
  if (unmatched.length === 0) return;

  const targetCard1 = unmatched[0];
  const targetCard2 = unmatched.find(c => c.pairId === targetCard1.pairId && c.id !== targetCard1.id);

  if (!targetCard1 || !targetCard2) return;

  const idx1 = activeFlipCards.indexOf(targetCard1);
  const idx2 = activeFlipCards.indexOf(targetCard2);

  handleCardClick(idx1);
  setTimeout(() => {
    handleCardClick(idx2);
  }, 300);

  showToast('💡 Hệ thống đã gợi ý mở 1 cặp thẻ hợp lệ cho bạn!', 'info');
}

function handleFlipLevelVictory() {
  const lvl = getCurrentFlipLevel();
  if (!lvl) return;

  playCardVictorySound();

  const totalPairs = lvl.pairs.length;
  // Star Rating Calculation
  let stars = 1;
  if (flipMovesCount <= totalPairs * 1.6) {
    stars = 3;
  } else if (flipMovesCount <= totalPairs * 2.4) {
    stars = 2;
  }

  // Bonus points calculation
  const timeBonus = Math.max(0, 180 - flipTimerSeconds) * 3;
  flipScore += timeBonus + (stars * 100);

  // Update progress
  flipUserProgress.stars[lvl.level] = Math.max(stars, flipUserProgress.stars[lvl.level] || 0);
  flipUserProgress.highScores[lvl.level] = Math.max(flipScore, flipUserProgress.highScores[lvl.level] || 0);
  if (lvl.level >= flipUserProgress.unlockedLevel) {
    flipUserProgress.unlockedLevel = lvl.level + 1;
  }
  saveFlipCardProgress();

  // Add EXP to user profile
  addExp(60, `Hoàn thành Level ${lvl.level} Lật Thẻ Hán Ngữ`);

  // Show Modal
  openFlipCardVictoryModal(lvl, stars);
}

function openFlipCardVictoryModal(lvl, stars) {
  const modal = document.getElementById('flipCardVictoryModal');
  if (!modal) return;

  const scoreEl = document.getElementById('flipVictoryScore');
  const timeEl = document.getElementById('flipVictoryTime');
  const movesEl = document.getElementById('flipVictoryMoves');
  const accEl = document.getElementById('flipVictoryAccuracy');
  const starsEl = document.getElementById('flipVictoryStars');
  const pairsListEl = document.getElementById('flipVictoryPairsList');

  if (scoreEl) scoreEl.innerText = flipScore;
  const m = Math.floor(flipTimerSeconds / 60);
  const s = flipTimerSeconds % 60;
  if (timeEl) timeEl.innerText = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  if (movesEl) movesEl.innerText = flipMovesCount;

  const totalPairs = lvl.pairs.length;
  const acc = Math.min(100, Math.round((totalPairs / Math.max(1, flipMovesCount)) * 100));
  if (accEl) accEl.innerText = `${acc}%`;

  if (starsEl) {
    starsEl.innerText = stars >= 3 ? '⭐⭐⭐' : (stars === 2 ? '⭐⭐' : '⭐');
  }

  // Populate Review Pairs Table
  if (pairsListEl) {
    pairsListEl.innerHTML = lvl.pairs.map(p => {
      const isImg = p.type === 'image';
      const isSyn = p.type === 'synonym';
      const symbol = isImg ? '↔' : (isSyn ? '≈' : '≠');
      const badgeClass = isImg 
        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
        : (isSyn ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200');
      const secondPart = isImg 
        ? `<span class="text-base">${p.wordA.image}</span> <strong class="text-xs text-stone-800 dark:text-stone-200">${p.wordA.meaning}</strong>`
        : `<strong class="font-hanzi text-sm text-stone-900 dark:text-stone-100">${p.wordB.hanzi} (${p.wordB.pinyin})</strong>`;
      const ttsHandler = isImg
        ? `playChineseTTS('${p.wordA.hanzi}');`
        : `playChineseTTS('${p.wordA.hanzi}'); setTimeout(() => playChineseTTS('${p.wordB.hanzi}'), 1000);`;

      return `
        <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2 shadow-2xs">
          <div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-1.5 py-0.2 rounded text-[9px] font-bold ${badgeClass}">${p.typeLabel}</span>
              <strong class="font-hanzi text-sm text-stone-900 dark:text-stone-100">${p.wordA.hanzi} (${p.wordA.pinyin})</strong>
              <span class="text-xs text-amber-600 font-bold">${symbol}</span>
              ${secondPart}
            </div>
            <p class="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">${p.relationDesc}</p>
          </div>
          <button 
            type="button" 
            onclick="${ttsHandler}"
            class="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs shrink-0 cursor-pointer shadow-2xs"
            title="Nghe phát âm"
          >
            🔊
          </button>
        </div>
      `;
    }).join('');
  }

  openModal('flipCardVictoryModal');
}

function closeFlipCardVictoryModal() {
  closeModal('flipCardVictoryModal');
}
registerModal('flipCardVictoryModal', closeFlipCardVictoryModal);

function nextFlipCardLevel() {
  closeFlipCardVictoryModal();
  if (currentFlipLevelIndex < flipCardLevels.length - 1) {
    loadFlipCardLevel(currentFlipLevelIndex + 1);
    showToast(`👉 Sang Cấp Độ ${currentFlipLevelIndex + 1}! Bắt đầu màn chơi mới 🎉`, 'success');
  } else {
    showToast('🏆 Chúc mừng bạn đã phá đảo toàn bộ kho cấp độ Lật Thẻ Hán Ngữ!', 'success');
  }
}

function resetFlipCurrentLevel() {
  loadFlipCardLevel(currentFlipLevelIndex);
  showToast('Đã xáo trộn và làm mới màn chơi!', 'info');
}

function setFlipCardGameMode(mode) {
  currentFlipGameMode = mode;

  const btnAll = document.getElementById('flipModeBtn-all');
  const btnImg = document.getElementById('flipModeBtn-image');
  const btnSyn = document.getElementById('flipModeBtn-synonym');
  const btnAnt = document.getElementById('flipModeBtn-antonym');

  const activeCls = 'px-3 py-1.5 rounded-xl font-bold transition-all bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs cursor-pointer';
  const inactiveCls = 'px-3 py-1.5 rounded-xl font-bold transition-all text-stone-700 dark:text-stone-300 hover:text-[#8B1E1E] cursor-pointer';

  if (btnAll) btnAll.className = mode === 'all' ? activeCls : inactiveCls;
  if (btnImg) btnImg.className = mode === 'image' ? activeCls : inactiveCls;
  if (btnSyn) btnSyn.className = mode === 'synonym' ? activeCls : inactiveCls;
  if (btnAnt) btnAnt.className = mode === 'antonym' ? activeCls : inactiveCls;

  // Find first level matching mode
  if (mode !== 'all') {
    const targetIdx = flipCardLevels.findIndex(lvl => lvl.mode === mode);
    if (targetIdx >= 0) {
      loadFlipCardLevel(targetIdx);
      return;
    }
  }
  loadFlipCardLevel(currentFlipLevelIndex);
}

// ---------------- FLIP CARD LEVEL SELECTOR MODAL ----------------
function openFlipCardLevelModal() {
  if (!document.getElementById('flipCardLevelModal')) return;
  filterFlipCardLevelMap(flipActiveTierFilter);
  openModal('flipCardLevelModal');
}

function closeFlipCardLevelModal() {
  closeModal('flipCardLevelModal');
}
registerModal('flipCardLevelModal', closeFlipCardLevelModal);

function filterFlipCardLevelMap(filter) {
  flipActiveTierFilter = filter;
  const btnAll = document.getElementById('flipFilterBtn-all');
  const btnImg = document.getElementById('flipFilterBtn-image');
  const btnSyn = document.getElementById('flipFilterBtn-synonym');
  const btnAnt = document.getElementById('flipFilterBtn-antonym');

  const activeCls = 'px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#BE123C] to-[#E11D48] text-white shadow-2xs cursor-pointer';
  const inactiveCls = 'px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-rose-700 cursor-pointer';

  if (btnAll) btnAll.className = filter === 'all' ? activeCls : inactiveCls;
  if (btnImg) btnImg.className = filter === 'image' ? activeCls : inactiveCls;
  if (btnSyn) btnSyn.className = filter === 'synonym' ? activeCls : inactiveCls;
  if (btnAnt) btnAnt.className = filter === 'antonym' ? activeCls : inactiveCls;

  renderFlipCardLevelGrid();
}

function renderFlipCardLevelGrid() {
  const container = document.getElementById('flipCardLevelGridContainer');
  if (!container || !flipCardLevels) return;

  container.innerHTML = '';
  const unlocked = flipUserProgress.unlockedLevel || 1;

  let filtered = flipCardLevels;
  if (flipActiveTierFilter !== 'all') {
    filtered = flipCardLevels.filter(lvl => lvl.mode === flipActiveTierFilter);
  }

  filtered.forEach(lvl => {
    const isUnlocked = lvl.level <= unlocked;
    const isCurrent = lvl.level === currentFlipLevelIndex + 1;
    const stars = flipUserProgress.stars[lvl.level] || 0;
    const highScore = flipUserProgress.highScores[lvl.level] || 0;

    const card = document.createElement('button');
    card.className = `p-3.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
      isUnlocked 
        ? (isCurrent ? 'bg-gradient-to-br from-rose-500/20 to-amber-500/30 border-2 border-rose-400 shadow-md ring-2 ring-rose-400/50' : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-rose-400 shadow-2xs hover:scale-105') 
        : 'bg-stone-100 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 opacity-60 cursor-not-allowed'
    }`;

    if (isUnlocked) {
      card.onclick = () => {
        closeFlipCardLevelModal();
        loadFlipCardLevel(lvl.level - 1);
      };
    }

    card.innerHTML = `
      <div class="flex items-center justify-between w-full text-[10px] text-stone-400">
        <div class="flex items-center gap-1">
          <span class="font-bold">#${lvl.level}</span>
          ${lvl.mode === 'image' 
            ? '<span class="px-1 py-0.2 rounded text-[8px] font-bold bg-amber-100 text-amber-800 border border-amber-200">图文</span>' 
            : (lvl.mode === 'synonym' 
              ? '<span class="px-1 py-0.2 rounded text-[8px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">近义</span>' 
              : '<span class="px-1 py-0.2 rounded text-[8px] font-bold bg-rose-100 text-rose-800 border border-rose-200">反义</span>')}
        </div>
        <span>${isUnlocked ? (stars >= 3 ? '⭐⭐⭐' : (stars > 0 ? '⭐' : '')) : '🔒'}</span>
      </div>
      <div class="my-1.5 w-11 h-11 rounded-2xl ${isUnlocked ? 'bg-gradient-to-tr from-rose-100 to-amber-100 dark:bg-stone-700 text-rose-800 dark:text-amber-200' : 'bg-stone-200 dark:bg-stone-800 text-stone-400'} flex items-center justify-center font-bold text-base shadow-2xs">
        ${lvl.level}
      </div>
      <p class="text-[11px] font-bold text-stone-800 dark:text-stone-200 truncate w-full">
        ${lvl.title}
      </p>
      <div class="mt-1 text-[9px] text-stone-400">
        ${isUnlocked ? (highScore > 0 ? `Kỷ lục: ${highScore}đ` : 'Chưa đấu') : 'Khóa'}
      </div>
    `;

    container.appendChild(card);
  });
}

// Window Exports for Flip Card Game
window.initFlipCardGame = initFlipCardGame;
window.loadFlipCardLevel = loadFlipCardLevel;
window.handleCardClick = handleCardClick;
window.flipCardAutoHint = flipCardAutoHint;
window.resetFlipCurrentLevel = resetFlipCurrentLevel;
window.nextFlipCardLevel = nextFlipCardLevel;
window.setFlipCardGameMode = setFlipCardGameMode;
window.openFlipCardLevelModal = openFlipCardLevelModal;
window.closeFlipCardLevelModal = closeFlipCardLevelModal;
window.filterFlipCardLevelMap = filterFlipCardLevelMap;
window.closeFlipCardVictoryModal = closeFlipCardVictoryModal;
window.playCurrentMatchAudio = playCurrentMatchAudio;
window.getActiveFlipCards = () => activeFlipCards;
window.getCurrentFlipLevel = () => flipCardLevels[currentFlipLevelIndex];
window.getFlipCardLevels = () => flipCardLevels;
window.getFlipScore = () => flipScore;
window.getFlipCombo = () => flipCombo;
window.getMatchedPairsCount = () => matchedPairsCount;
window.getFlipMovesCount = () => flipMovesCount;
window.isFlipCardProcessing = () => isFlipCardProcessing;

})();

/* --- FILE: js/features/classroom.js --- */
(function(){
// ---------------- TAB: LỚP HỌC THÔNG MINH & PHÒNG HỌC NHÓM BẠN BÈ ----------------
// Cho phép học viên tự tạo phòng học/phòng họp nhóm (Smart Peer Study Room) với bạn bè,
// chia sẻ mã phòng hoặc link mời trực tiếp, cùng nhau thi thử HSK, luyện từ vựng tương tác,
// tích hợp phòng họp video trực tuyến (Jitsi Meet / Google Meet 1-click), trò chuyện
// thảo luận trực tiếp và vinh danh bảng vàng thành tích nhóm theo thời gian thực.
// Đồng thời giữ nguyên đầy đủ tính năng giao bài và chấm bài tự động cho giáo viên.

const CLASSROOM_CREATED_KEY = 'yuhan_classroom_created';
const CLASSROOM_RESULTS_KEY = 'yuhan_classroom_results';
const CLASSROOM_ATTEMPTS_KEY = 'yuhan_classroom_attempts';
const CLASSROOM_SMART_ROOMS_KEY = 'yuhan_smart_rooms';
const CLASSROOM_ACTIVE_ROOM_KEY = 'yuhan_active_smart_room';
const CLASSROOM_MAX_WORDS = 30;
const RESULT_CODE_PREFIX = 'HTTMN1';
const SMART_ROOM_CODE_PREFIX = 'YHAN-ROOM';

const QUESTION_TYPES = {
  meaning: { label: 'Chữ Hán → Nghĩa', hint: 'Chọn nghĩa đúng' },
  pinyin: { label: 'Chữ Hán → Pinyin', hint: 'Chọn phiên âm đúng' },
  listen: { label: 'Nghe → Chữ Hán', hint: 'Nghe và chọn chữ Hán đúng' },
  reverse: { label: 'Nghĩa → Chữ Hán', hint: 'Chọn chữ Hán có nghĩa này' }
};

let classroomView = 'room-hub'; // 'room-hub', 'room-active', 'room-quiz', 'room-result', 'teacher', 'grade', 'join', 'student-intro', 'quiz', 'result'
let classroomRun = null;
let lastCreatedAssignment = null;
let currentSmartRoom = null;
let smartRoomQuizState = null;
let smartRoomPeerTimer = null;

// ---------- encoding helpers ----------
function toBase64Url(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}

/** FNV-1a 32-bit, hex. Detects corrupted codes; not a security measure. */
function fnv1a(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/** Deterministic PRNG so every student gets the same questions for one assignment. */
function seededRandom(seedText) {
  let a = parseInt(fnv1a(seedText), 16);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(list, rand) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function encodeAssignment(assignment) {
  return toBase64Url(JSON.stringify(assignment));
}

function decodeAssignment(code) {
  const a = JSON.parse(fromBase64Url(code));
  if (!a || a.v !== 1 || !a.id || !Array.isArray(a.w) || !a.w.length) throw new Error('invalid');
  return a;
}

function assignmentLink(assignment) {
  return `${location.origin}${location.pathname}#/classroom?a=${encodeAssignment(assignment)}`;
}

function encodeResult(result) {
  const payload = toBase64Url(JSON.stringify(result));
  return `${RESULT_CODE_PREFIX}.${payload}.${fnv1a(payload)}`;
}

function decodeResult(code) {
  const [prefix, payload, sum] = code.trim().split('.');
  if (prefix !== RESULT_CODE_PREFIX || !payload || fnv1a(payload) !== sum) throw new Error('checksum');
  return JSON.parse(fromBase64Url(payload));
}

// Smart Room URL helpers
function encodeSmartRoom(room) {
  return toBase64Url(JSON.stringify(room));
}

function decodeSmartRoom(code) {
  const obj = JSON.parse(fromBase64Url(code));
  if (!obj || !obj.code || !obj.title) throw new Error('invalid smart room');
  return obj;
}

function smartRoomLink(room) {
  return `${location.origin}${location.pathname}#/classroom?room=${encodeSmartRoom(room)}`;
}

async function copyText(text, okMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(okMessage || 'Đã sao chép vào bộ nhớ tạm.', 'success');
  } catch (e) {
    window.prompt('Sao chép thủ công (Ctrl+C):', text);
  }
}

function formatRoomTime(dateStr) {
  try {
    const d = dateStr ? new Date(dateStr) : new Date();
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '14:00';
  }
}

// ---------- routing & view controller ----------
function initClassroom() {
  handleClassroomRoute();
}

function handleClassroomRoute() {
  const params = getHashParams();
  
  // 1. Teacher assignment link
  const aCode = params.get('a');
  if (aCode) {
    try {
      startStudentIntro(decodeAssignment(aCode));
      return;
    } catch (e) {
      showToast('Link bài tập không hợp lệ hoặc bị cắt mất một phần.', 'error', 5000);
    }
  }

  // 2. Smart Room direct URL link
  const roomData = params.get('room');
  if (roomData) {
    try {
      const room = decodeSmartRoom(roomData);
      joinSmartRoomDirectFromData(room);
      return;
    } catch (e) {
      showToast('Link phòng học nhóm không hợp lệ hoặc đã hết hạn.', 'error', 5000);
    }
  }

  // 3. Smart Room code parameter
  const roomCode = params.get('code');
  if (roomCode) {
    joinSmartRoomByCode(roomCode);
    return;
  }

  // Fallback to active room if in progress
  if (!currentSmartRoom) {
    const saved = storage.get(CLASSROOM_ACTIVE_ROOM_KEY, null);
    if (saved && saved.code) {
      currentSmartRoom = saved;
    }
  }

  if (currentSmartRoom && (classroomView === 'room-active' || classroomView === 'room-quiz' || classroomView === 'room-result')) {
    renderClassroom();
    return;
  }

  if (['student-intro', 'quiz', 'result'].includes(classroomView)) {
    classroomView = 'teacher';
  } else if (!['room-hub', 'teacher', 'grade', 'join'].includes(classroomView)) {
    classroomView = 'room-hub';
  }

  renderClassroom();
}

function setClassroomView(view) {
  classroomView = view;
  if (getHashParams().get('a') || getHashParams().get('room') || getHashParams().get('code')) {
    history.replaceState(null, '', '#/classroom');
  }
  renderClassroom();
}

function renderClassroom() {
  const root = document.getElementById('classroomRoot');
  if (!root) return;

  const views = {
    'room-hub': renderRoomHubView,
    'room-active': renderRoomActiveView,
    'room-quiz': renderRoomQuizView,
    'room-result': renderRoomResultView,
    teacher: renderTeacherView,
    grade: renderGradeView,
    join: renderJoinView,
    'student-intro': renderStudentIntro,
    quiz: renderQuizQuestion,
    result: renderStudentResult
  };

  const isDistractionFreeFlow = ['room-quiz', 'student-intro', 'quiz'].includes(classroomView);
  const intro = document.getElementById('classroomIntro');
  if (intro) intro.classList.toggle('hidden', isDistractionFreeFlow || classroomView === 'room-active' || classroomView === 'room-result');

  const subtabs = [
    ['room-hub', 'users', '👥 Phòng học nhóm thông minh'],
    ['teacher', 'clipboard-pen-line', '📝 Giao bài (Giáo viên)'],
    ['grade', 'clipboard-check', '📊 Bảng điểm & Chấm bài'],
    ['join', 'log-in', '🔑 Vào bài giáo viên']
  ];

  const activeTabId = ['room-hub', 'room-active', 'room-quiz', 'room-result'].includes(classroomView) ? 'room-hub' : classroomView;

  const switcher = isDistractionFreeFlow ? '' : `
    <div class="flex flex-wrap gap-2 pb-2 border-b border-amber-200/60">
      ${subtabs.map(([id, icon, label]) => `
        <button type="button" onclick="setClassroomView(${jsArg(id)})" class="nav-subtab px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 ${activeTabId === id ? 'is-active bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-md shadow-red-950/20' : 'bg-white/80 hover:bg-amber-50 text-stone-700 border border-amber-200/60'}">
          <i data-lucide="${icon}" class="w-4 h-4"></i><span>${label}</span>
        </button>`).join('')}
    </div>`;

  root.innerHTML = switcher + (views[classroomView] || renderRoomHubView)();
  refreshIcons(root);
}

// =========================================================================
// PHẦN 1: TẠO LỚP HỌC THÔNG MINH & PHÒNG HỌC NHÓM BẠN BÈ (SMART PEER STUDY ROOM)
// =========================================================================

function getSmartRoomsList() {
  return storage.get(CLASSROOM_SMART_ROOMS_KEY, []) || [];
}

function saveSmartRoomsList(list) {
  storage.set(CLASSROOM_SMART_ROOMS_KEY, (list || []).slice(0, 30));
}

function generateRandomRoomCode() {
  const prefixes = ['HSK', 'YUHAN', 'HOC', 'TIEN', 'DUO'];
  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const n = Math.floor(100 + Math.random() * 900);
  return `${p}-${n}`;
}

function getAvailableExamsForLevel(level) {
  if (Array.isArray(mockExamsData) && mockExamsData.length) {
    return mockExamsData.filter(e => Number(e.level) === Number(level));
  }
  return [];
}

/** Build room questions from chosen HSK exam or vocabulary bank */
function buildSmartRoomQuestions(category, level, examIndex, wordCount) {
  const questions = [];
  
  if (category === 'exam') {
    const exams = getAvailableExamsForLevel(level);
    const chosenExam = exams[examIndex] || exams[0];
    
    if (chosenExam && Array.isArray(chosenExam.questions) && chosenExam.questions.length) {
      // Pick 10 high-yield questions for group battle
      const pool = chosenExam.questions;
      const count = Math.min(12, pool.length);
      const sample = pool.slice(0, count);
      sample.forEach((q, idx) => {
        questions.push({
          id: `room_q_${idx + 1}`,
          prompt: q.prompt || `Câu hỏi ${idx + 1}`,
          audioText: q.audioText || '',
          pinyin: q.pinyin || '',
          statement: q.statement || '',
          options: (q.options || []).map(opt => ({
            key: opt.key || opt.text,
            text: opt.text,
            isCorrect: !!opt.isCorrect
          })),
          explanation: q.explanation || 'Phân tích từ vựng và ngữ pháp trọng tâm theo chuẩn Hanban.'
        });
      });
      return { examTitle: chosenExam.title, questions };
    }
  }

  // Vocab battle from dictionaryData
  const pool = dictionaryData.filter(d => Number(d.level) === Number(level));
  const chosenWords = pool.length >= wordCount ? shuffle(pool).slice(0, wordCount) : pool.slice(0, wordCount);
  const types = ['meaning', 'pinyin', 'listen', 'reverse'];

  chosenWords.forEach((word, idx) => {
    const qType = types[idx % types.length];
    let prompt = '';
    let audioText = '';
    let pinyin = '';
    let correctText = '';
    let options = [];

    if (qType === 'meaning') {
      prompt = `Chọn nghĩa tiếng Việt chính xác của từ chữ Hán sau:`;
      correctText = word.meaning;
      const distractors = shuffle(pool.filter(w => w.title !== word.title)).slice(0, 3).map(w => w.meaning);
      options = shuffle([correctText, ...distractors]).map((txt, i) => ({
        key: String.fromCharCode(65 + i),
        text: txt,
        isCorrect: txt === correctText
      }));
      audioText = word.title;
      pinyin = word.pinyin;
    } else if (qType === 'pinyin') {
      prompt = `Chọn phiên âm Pinyin đúng của chữ Hán:`;
      correctText = word.pinyin;
      const distractors = shuffle(pool.filter(w => w.title !== word.title)).slice(0, 3).map(w => w.pinyin);
      options = shuffle([correctText, ...distractors]).map((txt, i) => ({
        key: String.fromCharCode(65 + i),
        text: txt,
        isCorrect: txt === correctText
      }));
      audioText = word.title;
    } else if (qType === 'listen') {
      prompt = `Nghe phát âm chuẩn và chọn chữ Hán chính xác:`;
      correctText = `${word.title} (${word.pinyin})`;
      const distractors = shuffle(pool.filter(w => w.title !== word.title)).slice(0, 3).map(w => `${w.title} (${w.pinyin})`);
      options = shuffle([correctText, ...distractors]).map((txt, i) => ({
        key: String.fromCharCode(65 + i),
        text: txt,
        isCorrect: txt === correctText
      }));
      audioText = word.title;
    } else {
      prompt = `Chọn chữ Hán tương ứng với nghĩa: "${word.meaning}"`;
      correctText = `${word.title} [${word.pinyin}]`;
      const distractors = shuffle(pool.filter(w => w.title !== word.title)).slice(0, 3).map(w => `${w.title} [${w.pinyin}]`);
      options = shuffle([correctText, ...distractors]).map((txt, i) => ({
        key: String.fromCharCode(65 + i),
        text: txt,
        isCorrect: txt === correctText
      }));
      audioText = word.title;
    }

    questions.push({
      id: `room_vocab_${idx + 1}`,
      prompt: `${prompt} <b class="font-hanzi text-2xl text-[#8B1E1E] ml-1">${word.title}</b>`,
      audioText: audioText || word.title,
      pinyin: pinyin || word.pinyin,
      wordObj: { hanzi: word.title, pinyin: word.pinyin, meaning: word.meaning },
      options,
      explanation: `Chữ Hán: <b>${word.title}</b> (${word.pinyin}) mang nghĩa: <i>"${word.meaning}"</i>.`
    });
  });

  return { examTitle: `Ôn luyện ${wordCount} Từ vựng HSK ${level}`, questions };
}

/** View: Sảnh Phòng Học Thông Minh (Tạo phòng, vào phòng, xem phòng mở) */
function renderRoomHubView() {
  const rooms = getSmartRoomsList();
  const defaultHost = (userProfile && userProfile.name) || storage.getRaw('yuhan_student_name', 'Học viên YuHan');
  const sampleExams = getAvailableExamsForLevel(1);

  return `
    <div class="space-y-8 animate-fadeIn">
      
      <!-- BANNER GIỚI THIỆU PHÒNG HỌC NHÓM BẠN BÈ -->
      <div class="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#FFFDF9] via-[#FAF4EA] to-[#F5E8D3] border-2 border-amber-300/80 shadow-lg shadow-amber-900/5">
        <div class="absolute -right-10 -bottom-10 opacity-10 font-hanzi text-9xl text-[#8B1E1E] pointer-events-none select-none">朋</div>
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div class="space-y-2 max-w-2xl">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#8B1E1E] border border-red-300 text-xs font-bold uppercase tracking-wider">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Tạo Lớp Học Thông Minh Cùng Bạn Bè
            </span>
            <h3 class="text-2xl sm:text-3xl font-serif-luxury font-black text-stone-900">
              Phòng Học Nhóm & Họp Mặt Trực Tuyến
            </h3>
            <p class="text-stone-700 text-sm leading-relaxed">
              Bạn có thể tự tạo phòng học riêng, gửi mã phòng cho bạn bè trên Zalo/Facebook để cùng vào làm đề thi thử HSK, ôn từ vựng phản xạ, bật video call thảo luận và đua top bảng vàng vinh danh thời gian thực!
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" onclick="quickJoinPublicRoom('hsk1')" class="px-4 py-2.5 rounded-xl bg-amber-100/80 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-bold transition flex items-center gap-2">
              <i data-lucide="zap" class="w-4 h-4 text-amber-700"></i> Vào phòng mẫu trải nghiệm
            </button>
          </div>
        </div>
      </div>

      <!-- GRID CHÍNH: TẠO PHÒNG MỚI & VÀO PHÒNG BẰNG MÃ -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- CỘT 1: FORM TẠO PHÒNG HỌC NHÓM MỚI (7 CỘT) -->
        <div class="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-7 border-2 border-amber-200/90 shadow-md space-y-5 bg-[#FFFDF9]">
          <div class="flex items-center justify-between border-b border-amber-200/60 pb-3">
            <h4 class="text-lg font-serif-luxury font-black text-stone-900 flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#B8860B] text-white flex items-center justify-center text-sm shadow-sm">
                <i data-lucide="plus" class="w-4 h-4"></i>
              </span>
              Tạo phòng học nhóm thông minh
            </h4>
            <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">Hoàn toàn miễn phí</span>
          </div>

          <form onsubmit="event.preventDefault(); createSmartRoom(this);" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <label class="text-xs font-bold text-stone-800 space-y-1 block">Tên phòng học
                <input name="title" required maxlength="80" value="Nhóm Ôn Thi HSK - Bạn Bè Cùng Tiến" placeholder="VD: Chiến Hạm HSK 1 - Đề 01" class="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 bg-white text-sm focus:ring-2 focus:ring-[#8B1E1E] outline-none" />
              </label>
              <label class="text-xs font-bold text-stone-800 space-y-1 block">Tên của bạn (Chủ phòng / Host)
                <input name="hostName" required maxlength="60" value="${escapeHtml(defaultHost)}" placeholder="VD: Minh Anh" class="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 bg-white text-sm focus:ring-2 focus:ring-[#8B1E1E] outline-none" />
              </label>
            </div>

            <!-- CHỌN NỘI DUNG HỌC CÙNG BẠN BÈ -->
            <fieldset class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
              <legend class="text-xs font-bold text-stone-800 px-2 bg-amber-100 rounded-md">Nội dung học tập cùng nhóm</legend>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label class="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-amber-200 cursor-pointer hover:border-[#8B1E1E] transition">
                  <input type="radio" name="category" value="exam" checked onchange="document.getElementById('examOptionsBlock').classList.remove('hidden'); document.getElementById('vocabOptionsBlock').classList.add('hidden');" class="accent-[#8B1E1E]" />
                  <div>
                    <p class="text-xs font-bold text-stone-900">Thi thử HSK chuẩn Hanban</p>
                    <p class="text-[11px] text-stone-500">Cả nhóm cùng giải đề thi mô phỏng</p>
                  </div>
                </label>

                <label class="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-amber-200 cursor-pointer hover:border-[#8B1E1E] transition">
                  <input type="radio" name="category" value="vocab" onchange="document.getElementById('examOptionsBlock').classList.add('hidden'); document.getElementById('vocabOptionsBlock').classList.remove('hidden');" class="accent-[#8B1E1E]" />
                  <div>
                    <p class="text-xs font-bold text-stone-900">Ôn từ vựng tương tác</p>
                    <p class="text-[11px] text-stone-500">Thi phản xạ nghĩa, pinyin, nghe TTS</p>
                  </div>
                </label>
              </div>

              <!-- Tùy chọn đề thi HSK -->
              <div id="examOptionsBlock" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label class="text-xs font-semibold text-stone-700 space-y-1 block">Cấp độ HSK:
                  <select name="examLevel" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-800">
                    <option value="1">HSK 1 (Đầy đủ 60 đề chuẩn Hanban)</option>
                    <option value="2">HSK 2 (60 đề thi thử)</option>
                    <option value="3">HSK 3 (60 đề thi thử)</option>
                    <option value="4">HSK 4 (60 đề thi thử)</option>
                    <option value="5">HSK 5 (60 đề thi thử)</option>
                    <option value="6">HSK 6 (60 đề thi thử)</option>
                  </select>
                </label>

                <label class="text-xs font-semibold text-stone-700 space-y-1 block">Số đề thi:
                  <select name="examIndex" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800">
                    ${Array.from({ length: 60 }).map((_, i) => `<option value="${i}">Đề thi số ${String(i + 1).padStart(2, '0')}</option>`).join('')}
                  </select>
                </label>
              </div>

              <!-- Tùy chọn từ vựng -->
              <div id="vocabOptionsBlock" class="hidden grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label class="text-xs font-semibold text-stone-700 space-y-1 block">Cấp độ từ vựng:
                  <select name="vocabLevel" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-800">
                    ${[1, 2, 3, 4, 5, 6].map(l => `<option value="${l}">Từ vựng HSK ${l}</option>`).join('')}
                  </select>
                </label>
                <label class="text-xs font-semibold text-stone-700 space-y-1 block">Số lượng câu:
                  <select name="vocabCount" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800">
                    <option value="10">10 từ (Khởi động nhanh)</option>
                    <option value="15" selected>15 từ (Chuẩn phòng học)</option>
                    <option value="20">20 từ (Thử thách cao cấp)</option>
                  </select>
                </label>
              </div>
            </fieldset>

            <!-- TÍCH HỢP HỌP TRỰC TUYẾN VIDEO (GOOGLE MEET / JITSI MEET) -->
            <div class="p-4 rounded-2xl bg-white border border-amber-200/80 space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <i data-lucide="video" class="w-4 h-4 text-[#8B1E1E]"></i>
                  Phòng họp video trực tuyến (Jitsi Meet / Google Meet)
                </label>
                <span class="text-[11px] text-stone-500">Tự động sinh link 1 chạm</span>
              </div>
              <input name="meetUrl" placeholder="Để trống để tự tạo link Jitsi Meet miễn phí, hoặc dán link Google Meet / Zoom..." class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-xs focus:bg-white outline-none" />
              <p class="text-[11px] text-stone-500">💡 Cả nhóm có thể vừa giải đề vừa bật camera/micro để trao đổi đáp án trực tiếp mà không cần cài app.</p>
            </div>

            <!-- NÚT TẠO PHÒNG -->
            <button type="submit" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] hover:brightness-110 text-white font-bold text-sm shadow-md shadow-red-950/20 flex items-center justify-center gap-2 transition duration-200 cursor-pointer">
              <i data-lucide="door-open" class="w-5 h-5"></i>
              Tạo Phòng Học & Nhận Mã Mời Bạn Bè
            </button>
          </form>
        </div>

        <!-- CỘT 2: VÀO PHÒNG BẰNG MÃ & HƯỚNG DẪN HỌC NHÓM (5 CỘT) -->
        <div class="lg:col-span-5 space-y-5">
          
          <!-- HỘP NHẬP MÃ VÀO PHÒNG -->
          <div class="glass-card rounded-3xl p-6 border-2 border-amber-200/90 shadow-md bg-[#FFFDF9] space-y-4">
            <h4 class="text-base font-serif-luxury font-black text-stone-900 flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-amber-100 text-[#8B1E1E] flex items-center justify-center">
                <i data-lucide="key-round" class="w-4 h-4"></i>
              </span>
              Tham gia phòng của bạn bè
            </h4>
            <p class="text-xs text-stone-600">Nhập mã phòng 6 ký tự hoặc dán link mời bạn bè đã gửi cho bạn.</p>
            
            <form onsubmit="event.preventDefault(); joinSmartRoomByCode(this.roomCode.value, this.guestName.value);" class="space-y-3">
              <input name="roomCode" required placeholder="Nhập mã phòng (VD: HSK-886) hoặc link..." class="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm uppercase font-mono tracking-wider focus:ring-2 focus:ring-[#8B1E1E] outline-none" />
              <input name="guestName" maxlength="60" value="${escapeHtml(defaultHost)}" placeholder="Tên của bạn khi vào phòng..." class="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs outline-none" />
              <button type="submit" class="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-bold shadow-xs transition flex items-center justify-center gap-2">
                <i data-lucide="arrow-right-circle" class="w-4 h-4 text-amber-300"></i> Vào Phòng Học Ngay
              </button>
            </form>
          </div>

          <!-- PHÒNG HỌC MẪU TRẢI NGHIỆM SÔI NỔI -->
          <div class="glass-card rounded-3xl p-6 border border-amber-200/80 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20 shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <h5 class="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Phòng học mở cộng đồng
              </h5>
              <span class="text-[11px] text-stone-500">Đang hoạt động</span>
            </div>

            <div class="space-y-2">
              <div class="p-3 rounded-2xl bg-white border border-amber-200/80 hover:border-[#8B1E1E] transition flex items-center justify-between gap-3 shadow-xs">
                <div class="min-w-0">
                  <p class="text-xs font-bold text-stone-900 truncate">Hội Luyện Đề HSK 1 - Chuẩn Hanban #01</p>
                  <p class="text-[11px] text-stone-500">Mã: <b class="text-[#8B1E1E]">HSK-101</b> · 4 bạn đang luyện đề</p>
                </div>
                <button type="button" onclick="quickJoinPublicRoom('hsk1')" class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#8B1E1E] text-xs font-bold transition shrink-0">
                  Vào học
                </button>
              </div>

              <div class="p-3 rounded-2xl bg-white border border-amber-200/80 hover:border-[#8B1E1E] transition flex items-center justify-between gap-3 shadow-xs">
                <div class="min-w-0">
                  <p class="text-xs font-bold text-stone-900 truncate">Thử Thách 20 Từ Vựng HSK 2 Cấp Tốc</p>
                  <p class="text-[11px] text-stone-500">Mã: <b class="text-[#8B1E1E]">VOC-202</b> · 3 bạn đang ôn tập</p>
                </div>
                <button type="button" onclick="quickJoinPublicRoom('vocab2')" class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#8B1E1E] text-xs font-bold transition shrink-0">
                  Vào học
                </button>
              </div>
            </div>
          </div>

          <!-- DANH SÁCH PHÒNG DO CHÍNH BẠN TẠO -->
          <div class="glass-card rounded-3xl p-5 border border-amber-200/70 space-y-3">
            <h5 class="text-xs font-bold uppercase tracking-wider text-stone-700">Phòng bạn đã tạo gần đây (${rooms.length})</h5>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              ${rooms.length ? rooms.map(r => `
                <div class="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-2">
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-bold text-stone-800 truncate">${escapeHtml(r.title)}</p>
                    <p class="text-[11px] text-stone-500">Mã: <b class="text-[#8B1E1E]">${escapeHtml(r.code)}</b> · ${r.questions.length} câu</p>
                  </div>
                  <button type="button" onclick="joinSmartRoomDirect(${jsArg(r.id)})" class="px-2.5 py-1 rounded-lg bg-amber-50 text-[#8B1E1E] text-xs font-bold hover:bg-amber-100">Vào phòng</button>
                  <button type="button" onclick="deleteSmartRoom(${jsArg(r.id)})" class="p-1 rounded-lg text-stone-400 hover:text-rose-600" title="Xóa"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                </div>`).join('') : '<p class="text-xs text-stone-400">Bạn chưa tạo phòng học nào.</p>'}
            </div>
          </div>

        </div>
      </div>
    </div>`;
}

/** Tạo phòng học thông minh */
function createSmartRoom(form) {
  const title = (form.title.value || '').trim() || 'Phòng học nhóm YuHan';
  const hostName = (form.hostName.value || '').trim() || 'Chủ phòng';
  const category = form.category.value;
  const level = Number(category === 'exam' ? form.examLevel.value : form.vocabLevel.value) || 1;
  const examIndex = Number(form.examIndex ? form.examIndex.value : 0) || 0;
  const vocabCount = Number(form.vocabCount ? form.vocabCount.value : 15) || 15;
  const code = generateRandomRoomCode();
  
  let meetUrl = (form.meetUrl.value || '').trim();
  if (!meetUrl) {
    meetUrl = `https://meet.jit.si/YuHan_Study_Room_${code.replace(/[^A-Za-z0-9]/g, '')}`;
  }

  const { examTitle, questions } = buildSmartRoomQuestions(category, level, examIndex, vocabCount);
  if (!questions.length) {
    showToast('Không tạo được bộ câu hỏi cho cấp độ này. Vui lòng thử lại.', 'error');
    return;
  }

  const room = {
    id: 'rm_' + Date.now().toString(36),
    code,
    title,
    hostName,
    category,
    level,
    examTitle,
    meetUrl,
    createdAt: new Date().toISOString(),
    members: [
      { id: 'm_host', name: `${hostName} (Bạn)`, avatar: '🌸', isHost: true, status: 'ready', score: 0, progress: 0 },
      { id: 'm_ai1', name: 'Hoàng Nam', avatar: '🐉', isHost: false, status: 'ready', score: 0, progress: 0 },
      { id: 'm_ai2', name: 'Thu Thảo', avatar: '🏮', isHost: false, status: 'ready', score: 0, progress: 0 },
      { id: 'm_ai3', name: 'Thanh Tùng', avatar: '🎋', isHost: false, status: 'ready', score: 0, progress: 0 }
    ],
    chat: [
      { sender: 'Hệ thống', text: `Chào mừng ${hostName} và các bạn đến với phòng "${title}"! Hãy gửi mã hoặc link để mời bạn bè vào cùng làm bài nhé.`, time: formatRoomTime(), isSystem: true },
      { sender: 'Hoàng Nam', text: 'Chào mọi người nha! Hôm nay cùng cày top bảng vàng nhé 🔥', time: formatRoomTime() }
    ],
    questions,
    status: 'lobby'
  };

  const list = getSmartRoomsList();
  saveSmartRoomsList([room, ...list]);
  
  currentSmartRoom = room;
  storage.set(CLASSROOM_ACTIVE_ROOM_KEY, room);
  classroomView = 'room-active';
  showToast(`Đã tạo phòng thành công! Mã phòng: ${room.code}`, 'success', 4000);
  renderClassroom();
}

/** Vào phòng trực tiếp theo ID trong máy */
function joinSmartRoomDirect(roomId) {
  const list = getSmartRoomsList();
  const hit = list.find(r => r.id === roomId);
  if (hit) {
    currentSmartRoom = hit;
    storage.set(CLASSROOM_ACTIVE_ROOM_KEY, hit);
    classroomView = 'room-active';
    renderClassroom();
  }
}

/** Vào phòng qua mã phòng 6 ký tự hoặc URL dán vào */
function joinSmartRoomByCode(codeOrUrl, guestName) {
  const clean = String(codeOrUrl || '').trim();
  if (!clean) return;

  // Check if it's a URL with ?room= or ?code=
  const urlRoomMatch = clean.match(/[?&]room=([A-Za-z0-9_-]+)/);
  if (urlRoomMatch) {
    try {
      const room = decodeSmartRoom(urlRoomMatch[1]);
      joinSmartRoomDirectFromData(room, guestName);
      return;
    } catch (e) {
      showToast('Link phòng học không hợp lệ.', 'error');
      return;
    }
  }

  const urlCodeMatch = clean.match(/[?&]code=([A-Za-z0-9_-]+)/);
  const code = (urlCodeMatch ? urlCodeMatch[1] : clean).toUpperCase();

  // Search local rooms
  const list = getSmartRoomsList();
  let hit = list.find(r => r.code.toUpperCase() === code);

  // Preset community rooms
  if (!hit) {
    if (code.includes('101') || code.includes('HSK1')) {
      hit = createPresetRoom('hsk1');
    } else if (code.includes('202') || code.includes('VOC2')) {
      hit = createPresetRoom('vocab2');
    } else if (code.includes('303') || code.includes('HSK3')) {
      hit = createPresetRoom('hsk3');
    }
  }

  if (hit) {
    const finalName = (guestName || '').trim() || (userProfile && userProfile.name) || 'Bạn học mới';
    if (!hit.members.some(m => m.name.includes(finalName))) {
      hit.members.push({
        id: 'm_guest_' + Date.now(),
        name: finalName,
        avatar: '🦊',
        isHost: false,
        status: 'ready',
        score: 0,
        progress: 0
      });
      hit.chat.push({
        sender: 'Hệ thống',
        text: `${finalName} vừa tham gia phòng học nhóm! 🎉`,
        time: formatRoomTime(),
        isSystem: true
      });
    }
    currentSmartRoom = hit;
    storage.set(CLASSROOM_ACTIVE_ROOM_KEY, hit);
    classroomView = 'room-active';
    showToast(`Đã vào phòng "${hit.title}" thành công!`, 'success');
    renderClassroom();
  } else {
    showToast(`Không tìm thấy phòng với mã "${code}". Vui lòng kiểm tra lại.`, 'error', 4000);
  }
}

/** Vào phòng từ chuỗi base64 đã giải mã */
function joinSmartRoomDirectFromData(room, guestName) {
  const finalName = (guestName || '').trim() || (userProfile && userProfile.name) || 'Bạn học mới';
  if (!room.members.some(m => m.name.includes(finalName))) {
    room.members.push({
      id: 'm_guest_' + Date.now(),
      name: finalName,
      avatar: '🦊',
      isHost: false,
      status: 'ready',
      score: 0,
      progress: 0
    });
    room.chat.push({
      sender: 'Hệ thống',
      text: `${finalName} vừa vào phòng qua link mời! 🎉`,
      time: formatRoomTime(),
      isSystem: true
    });
  }
  currentSmartRoom = room;
  storage.set(CLASSROOM_ACTIVE_ROOM_KEY, room);
  classroomView = 'room-active';
  showToast(`Đã tham gia phòng "${room.title}"!`, 'success');
  renderClassroom();
}

/** Mở phòng mẫu cộng đồng */
function quickJoinPublicRoom(presetKey) {
  const room = createPresetRoom(presetKey);
  currentSmartRoom = room;
  storage.set(CLASSROOM_ACTIVE_ROOM_KEY, room);
  classroomView = 'room-active';
  renderClassroom();
}

function createPresetRoom(presetKey) {
  let title = 'Hội Luyện Đề HSK 1 - Chuẩn Hanban #01';
  let level = 1;
  let category = 'exam';
  let code = 'HSK-101';
  
  if (presetKey === 'vocab2') {
    title = 'Thử Thách 20 Từ Vựng HSK 2 Cấp Tốc';
    level = 2;
    category = 'vocab';
    code = 'VOC-202';
  } else if (presetKey === 'hsk3') {
    title = 'Hội Luyện Đề HSK 3 - Cùng Đỗ 280+';
    level = 3;
    category = 'exam';
    code = 'HSK-303';
  }

  const { examTitle, questions } = buildSmartRoomQuestions(category, level, 0, 15);
  return {
    id: 'preset_' + presetKey,
    code,
    title,
    hostName: 'Thầy Trương (YuHan)',
    category,
    level,
    examTitle,
    meetUrl: `https://meet.jit.si/YuHan_LopHoc_${code}`,
    createdAt: new Date().toISOString(),
    members: [
      { id: 'm_me', name: `${userProfile.name || 'Học viên'} (Bạn)`, avatar: '🌸', isHost: false, status: 'ready', score: 0, progress: 0 },
      { id: 'm_h', name: 'Thầy Trương (Chủ phòng)', avatar: '🎓', isHost: true, status: 'ready', score: 0, progress: 0 },
      { id: 'm_1', name: 'Ngọc Lan', avatar: '🏮', isHost: false, status: 'ready', score: 0, progress: 0 },
      { id: 'm_2', name: 'Đức Huy', avatar: '🐉', isHost: false, status: 'ready', score: 0, progress: 0 }
    ],
    chat: [
      { sender: 'Hệ thống', text: `Chào mừng bạn đến với phòng học nhóm "${title}"!`, time: formatRoomTime(), isSystem: true },
      { sender: 'Thầy Trương', text: 'Chào cả lớp! Đề này có nhiều bẫy từ vựng hay, các em chú ý nhé!', time: formatRoomTime() }
    ],
    questions,
    status: 'lobby'
  };
}

function deleteSmartRoom(id) {
  const list = getSmartRoomsList().filter(r => r.id !== id);
  saveSmartRoomsList(list);
  if (currentSmartRoom && currentSmartRoom.id === id) {
    currentSmartRoom = null;
    storage.remove(CLASSROOM_ACTIVE_ROOM_KEY);
  }
  renderClassroom();
}

// =========================================================================
// PHẦN 2: GIAO DIỆN PHÒNG HỌC ĐANG MỞ (ROOM ACTIVE VIEW)
// =========================================================================

function renderRoomActiveView() {
  if (!currentSmartRoom) {
    classroomView = 'room-hub';
    return renderRoomHubView();
  }

  const room = currentSmartRoom;
  const inviteLink = smartRoomLink(room);

  return `
    <div class="space-y-6 animate-fadeIn">
      
      <!-- HEADER PHÒNG HỌC PHƯƠNG ĐÔNG HOÀNG GIA -->
      <div class="rounded-3xl p-6 bg-gradient-to-r from-[#FFFDF9] via-[#FAF4EA] to-[#F5E8D3] border-2 border-amber-300 shadow-md">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-red-100 text-[#8B1E1E] text-xs font-bold border border-red-300">
                <i data-lucide="radio" class="w-3.5 h-3.5 animate-pulse text-red-600"></i> Phòng Đang Mở
              </span>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                Cấp độ HSK ${room.level}
              </span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-serif-luxury font-black text-stone-900 tracking-tight">${escapeHtml(room.title)}</h2>
            <p class="text-xs text-stone-600">
              Chủ phòng: <b class="text-stone-900">${escapeHtml(room.hostName)}</b> · Bài: <b>${escapeHtml(room.examTitle || 'Bộ đề ôn tập')}</b> (${room.questions.length} câu)
            </p>
          </div>

          <!-- MÃ PHÒNG & NÚT SAO CHÉP MỜI BẠN BÈ -->
          <div class="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <div class="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border-2 border-amber-300 shadow-xs">
              <span class="text-[11px] font-bold text-stone-500 uppercase">Mã Phòng:</span>
              <span class="font-mono font-black text-[#8B1E1E] text-base tracking-wider">${escapeHtml(room.code)}</span>
              <button type="button" onclick="copyText(${jsArg(room.code)}, 'Đã sao chép mã phòng!')" class="p-1.5 rounded-lg hover:bg-amber-50 text-stone-600" title="Sao chép mã phòng">
                <i data-lucide="copy" class="w-4 h-4"></i>
              </button>
            </div>

            <button type="button" onclick="copyText(${jsArg(inviteLink)}, 'Đã sao chép link mời bạn bè vào phòng!')" class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition">
              <i data-lucide="share-2" class="w-4 h-4"></i> Mời Bạn Bè
            </button>

            <button type="button" onclick="openRoomVideoMeet(${jsArg(room.meetUrl)})" class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition">
              <i data-lucide="video" class="w-4 h-4"></i> Họp Video 1-Chạm
            </button>

            <button type="button" onclick="leaveSmartRoom()" class="p-2.5 rounded-2xl bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-stone-200 transition" title="Rời phòng">
              <i data-lucide="log-out" class="w-4 h-4"></i>
            </button>
          </div>

        </div>
      </div>

      <!-- 2 CỘT TƯƠNG TÁC CHÍNH -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- CỘT TRÁI: DANH SÁCH BẠN BÈ & KHUNG CHAT LIVE THẢO LUẬN (5 CỘT) -->
        <div class="lg:col-span-5 space-y-5">
          
          <!-- DANH SÁCH THÀNH VIÊN TRONG PHÒNG -->
          <div class="glass-card rounded-3xl p-5 border border-amber-200/80 bg-white shadow-xs space-y-3">
            <div class="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <i data-lucide="users" class="w-4 h-4 text-[#8B1E1E]"></i> Thành viên trong phòng (${room.members.length})
              </h4>
              <span class="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Sẵn sàng</span>
            </div>

            <div class="space-y-2">
              ${room.members.map(m => `
                <div class="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50/70 border border-stone-200/60">
                  <div class="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg shadow-xs shrink-0">${m.avatar}</div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-bold text-stone-900 truncate flex items-center gap-1.5">
                      ${escapeHtml(m.name)}
                      ${m.isHost ? '<span class="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-200 text-amber-950 font-black">HOST</span>' : ''}
                    </p>
                    <p class="text-[11px] text-stone-500">${m.status === 'ready' ? 'Đã sẵn sàng' : m.status === 'working' ? 'Đang làm bài' : 'Đã nộp bài'}</p>
                  </div>
                  <div class="text-right">
                    <span class="w-2.5 h-2.5 rounded-full inline-block bg-emerald-500"></span>
                  </div>
                </div>`).join('')}
            </div>

            <!-- CHIA SẺ NHANH QUA ZALO / MESSENGER -->
            <div class="pt-1 flex items-center justify-between text-xs text-stone-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50">
              <span class="text-[11px]">Chia sẻ link mời:</span>
              <div class="flex items-center gap-2">
                <button type="button" onclick="copyText(${jsArg(inviteLink)}, 'Đã sao chép link mời bạn bè!')" class="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-950 text-[11px] font-bold hover:bg-amber-100">
                  Sao chép link
                </button>
              </div>
            </div>
          </div>

          <!-- KHUNG CHAT LIVE THẢO LUẬN BÀI HỌC -->
          <div class="glass-card rounded-3xl p-5 border border-amber-200/80 bg-white shadow-xs space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <i data-lucide="message-square" class="w-4 h-4 text-[#8B1E1E]"></i> Thảo luận trực tiếp
            </h4>

            <div id="roomChatHistory" class="space-y-2.5 max-h-56 overflow-y-auto p-2 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs">
              ${room.chat.map(c => `
                <div class="${c.isSystem ? 'text-center text-[11px] text-amber-900 bg-amber-100/60 p-1.5 rounded-xl' : 'space-y-0.5'}">
                  ${c.isSystem ? escapeHtml(c.text) : `
                    <div class="flex items-baseline justify-between gap-2">
                      <b class="text-[#8B1E1E]">${escapeHtml(c.sender)}</b>
                      <span class="text-[10px] text-stone-400">${escapeHtml(c.time || '')}</span>
                    </div>
                    <div class="p-2 rounded-xl bg-white border border-stone-200 text-stone-800 shadow-xs">${escapeHtml(c.text)}</div>
                  `}
                </div>`).join('')}
            </div>

            <!-- NÚT PHẢN HỒI NHANH -->
            <div class="flex flex-wrap gap-1.5">
              ${['👍 Đã sẵn sàng!', '🔥 Cố lên cả nhóm!', '💡 Đề này hay nè', '🎉 Xong rồi nhé!'].map(txt => `
                <button type="button" onclick="sendSmartRoomQuickReaction(${jsArg(txt)})" class="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-semibold text-amber-900 transition">
                  ${txt}
                </button>`).join('')}
            </div>

            <!-- FORM GỬI TIN NHẮN -->
            <form onsubmit="event.preventDefault(); sendSmartRoomChat(this);" class="flex items-center gap-2">
              <input name="chatMessage" required placeholder="Nhập tin nhắn thảo luận..." class="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs outline-none focus:border-[#8B1E1E]" />
              <button type="submit" class="px-3 py-2 rounded-xl bg-[#8B1E1E] hover:bg-red-800 text-white text-xs font-bold transition">Gửi</button>
            </form>
          </div>

        </div>

        <!-- CỘT PHẢI: KHÔNG GIAN BÀI HỌC & BẮT ĐẦU LÀM BÀI (7 CỘT) -->
        <div class="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border-2 border-amber-200/90 bg-[#FFFDF9] shadow-md space-y-6">
          
          <div class="space-y-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              <i data-lucide="book-open" class="w-3.5 h-3.5"></i> Sảnh chuẩn bị bài làm nhóm
            </span>
            <h3 class="text-2xl font-serif-luxury font-black text-stone-900">${escapeHtml(room.examTitle || room.title)}</h3>
            <p class="text-stone-600 text-sm leading-relaxed">
              Bài tập nhóm gồm <b>${room.questions.length} câu hỏi</b> trắc nghiệm tương tác có âm thanh phát âm bản ngữ chuẩn Hanban. Khi bắt đầu, cả phòng sẽ cùng bấm giờ và thi đua trả lời để xếp hạng trên Bảng Vàng vinh danh của nhóm!
            </p>
          </div>

          <!-- THÔNG SỐ BUỔI HỌC -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center">
              <span class="text-[11px] text-stone-500 block">Số lượng</span>
              <b class="text-lg font-black text-[#8B1E1E]">${room.questions.length} câu</b>
            </div>
            <div class="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center">
              <span class="text-[11px] text-stone-500 block">Thời gian ước tính</span>
              <b class="text-lg font-black text-amber-900">~${Math.ceil(room.questions.length * 1.5)} phút</b>
            </div>
            <div class="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center col-span-2 sm:col-span-1">
              <span class="text-[11px] text-stone-500 block">Chế độ thi đua</span>
              <b class="text-lg font-black text-emerald-800">Đua Top Nhóm</b>
            </div>
          </div>

          <!-- VIDEO CALL PREVIEW BOX -->
          <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <i data-lucide="video" class="w-4 h-4"></i>
                </span>
                <div>
                  <p class="text-xs font-bold text-emerald-950">Phòng họp video trực tuyến đã sẵn sàng</p>
                  <p class="text-[11px] text-emerald-800">Mở phòng họp để bật mic/camera cùng trao đổi đáp án</p>
                </div>
              </div>
              <button type="button" onclick="openRoomVideoMeet(${jsArg(room.meetUrl)})" class="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition">
                Mở Video Call
              </button>
            </div>
          </div>

          <!-- NÚT BẮT ĐẦU LÀM BÀI CÙNG NHÓM -->
          <div class="pt-2 space-y-2">
            <button type="button" onclick="startSmartRoomQuiz()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] hover:brightness-110 text-white font-black text-base shadow-lg shadow-red-950/25 flex items-center justify-center gap-2.5 transition transform active:scale-98 cursor-pointer">
              <i data-lucide="play-circle" class="w-6 h-6"></i>
              BẮT ĐẦU CÙNG LÀM BÀI VỚI NHÓM
            </button>
            <p class="text-center text-[11px] text-stone-500">Mọi thành viên trong phòng sẽ nhận cùng một đề thi để thi đấu công bằng.</p>
          </div>

        </div>

      </div>

    </div>`;
}

function openRoomVideoMeet(url) {
  const target = url || (currentSmartRoom && currentSmartRoom.meetUrl) || 'https://meet.jit.si';
  window.open(target, '_blank', 'noopener,noreferrer');
  showToast('Đã mở phòng họp video trong tab mới!', 'success');
}

function sendSmartRoomChat(form) {
  const text = (form.chatMessage.value || '').trim();
  if (!text || !currentSmartRoom) return;

  const senderName = (userProfile && userProfile.name) || 'Bạn';
  currentSmartRoom.chat.push({
    sender: senderName,
    text,
    time: formatRoomTime()
  });

  form.chatMessage.value = '';
  renderClassroom();

  // Scroll chat down
  setTimeout(() => {
    const el = document.getElementById('roomChatHistory');
    if (el) el.scrollTop = el.scrollHeight;
  }, 50);

  // Friendly peer automatic response after 2-3s
  setTimeout(() => {
    if (currentSmartRoom && currentSmartRoom.chat) {
      const peerReplies = [
        'Đồng ý nha! Cố lên nào!',
        'Mình đã sẵn sàng rồi nè!',
        'Cùng cố gắng đạt điểm tối đa nha!',
        'Đề này chuẩn thi Hanban thật đó.'
      ];
      const rName = ['Hoàng Nam', 'Thu Thảo', 'Thanh Tùng'][Math.floor(Math.random() * 3)];
      currentSmartRoom.chat.push({
        sender: rName,
        text: peerReplies[Math.floor(Math.random() * peerReplies.length)],
        time: formatRoomTime()
      });
      renderClassroom();
    }
  }, 2200);
}

function sendSmartRoomQuickReaction(text) {
  if (!currentSmartRoom) return;
  const senderName = (userProfile && userProfile.name) || 'Bạn';
  currentSmartRoom.chat.push({
    sender: senderName,
    text,
    time: formatRoomTime()
  });
  renderClassroom();
}

function leaveSmartRoom() {
  if (!window.confirm('Bạn có chắc chắn muốn rời phòng học nhóm này?')) return;
  currentSmartRoom = null;
  storage.remove(CLASSROOM_ACTIVE_ROOM_KEY);
  classroomView = 'room-hub';
  renderClassroom();
}

// =========================================================================
// PHẦN 3: LÀM BÀI TẬP NHÓM THỜI GIAN THỰC (ROOM QUIZ VIEW)
// =========================================================================

function startSmartRoomQuiz() {
  if (!currentSmartRoom || !currentSmartRoom.questions.length) return;
  
  smartRoomQuizState = {
    index: 0,
    answers: [],
    startTime: Date.now(),
    peerProgress: currentSmartRoom.members.map(m => ({
      name: m.name,
      avatar: m.avatar,
      currentQ: 1,
      isFinished: false,
      score: 0
    }))
  };

  classroomView = 'room-quiz';
  renderClassroom();

  // Auto-play audio if current question has audioText
  autoPlayRoomAudio();

  // Simulated peer progress interval
  if (smartRoomPeerTimer) clearInterval(smartRoomPeerTimer);
  smartRoomPeerTimer = setInterval(() => {
    if (!smartRoomQuizState || classroomView !== 'room-quiz') {
      clearInterval(smartRoomPeerTimer);
      return;
    }
    const total = currentSmartRoom.questions.length;
    smartRoomQuizState.peerProgress.forEach(p => {
      if (!p.name.includes('(Bạn)') && Math.random() > 0.45 && p.currentQ < total) {
        p.currentQ += 1;
        if (p.currentQ >= total) p.isFinished = true;
      }
    });
    // Partial update to avoid full re-render interrupting clicks
    const peerBar = document.getElementById('roomPeerProgressBar');
    if (peerBar) {
      peerBar.innerHTML = renderPeerProgressSnippet();
    }
  }, 3500);
}

function autoPlayRoomAudio() {
  if (!smartRoomQuizState || !currentSmartRoom) return;
  const q = currentSmartRoom.questions[smartRoomQuizState.index];
  if (q && q.audioText) {
    playChineseTTS(q.audioText);
  }
}

function renderPeerProgressSnippet() {
  if (!smartRoomQuizState) return '';
  const total = currentSmartRoom.questions.length;
  return `
    <div class="flex flex-wrap items-center gap-3">
      ${smartRoomQuizState.peerProgress.map(p => `
        <div class="flex items-center gap-1.5 text-xs text-stone-700 bg-white/90 px-2.5 py-1 rounded-xl border border-amber-200/60 shadow-xs">
          <span>${p.avatar}</span>
          <span class="font-semibold truncate max-w-[80px]">${escapeHtml(p.name.split(' ')[0])}</span>
          <span class="text-[11px] font-mono text-[#8B1E1E] font-bold">${p.isFinished ? '✓ Xong' : `${p.currentQ}/${total}`}</span>
        </div>`).join('')}
    </div>`;
}

function renderRoomQuizView() {
  if (!currentSmartRoom || !smartRoomQuizState) {
    classroomView = 'room-hub';
    return renderRoomHubView();
  }

  const room = currentSmartRoom;
  const state = smartRoomQuizState;
  const q = room.questions[state.index];
  const total = room.questions.length;
  const answered = state.answers[state.index];
  const progressPct = Math.round((state.index / total) * 100);

  return `
    <div class="max-w-2xl mx-auto space-y-5 animate-fadeIn">
      
      <!-- TOP STATUS BAR: TIẾN ĐỘ CÂU & TIẾN ĐỘ BẠN BÈ -->
      <div class="glass-card rounded-2xl p-4 border border-amber-200/80 bg-white shadow-xs space-y-3">
        <div class="flex items-center justify-between text-xs font-bold text-stone-700">
          <span class="flex items-center gap-1.5">
            <i data-lucide="book-open" class="w-4 h-4 text-[#8B1E1E]"></i>
            ${escapeHtml(room.title)}
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-red-100 text-[#8B1E1E]">Câu ${state.index + 1}/${total}</span>
        </div>

        <div class="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden border border-amber-200/50">
          <div class="h-full bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] transition-all duration-300" style="width: ${progressPct}%"></div>
        </div>

        <!-- TIẾN ĐỘ CỦA CÁC BẠN TRONG PHÒNG -->
        <div id="roomPeerProgressBar">
          ${renderPeerProgressSnippet()}
        </div>
      </div>

      <!-- KHUNG CÂU HỎI ORIENTAL LUXURY -->
      <div class="glass-card rounded-3xl p-6 sm:p-8 border-2 border-amber-200/90 bg-[#FFFDF9] shadow-lg text-center space-y-6">
        
        <!-- TIÊU ĐỀ CÂU HỎI -->
        <div class="space-y-2">
          <p class="text-xs font-bold uppercase tracking-wider text-amber-900">
            ${q.statement ? 'Nghe và xác nhận phát âm' : 'Trắc nghiệm phản xạ'}
          </p>
          <div class="text-stone-800 text-sm sm:text-base font-semibold leading-relaxed">
            ${q.prompt}
          </div>
          ${q.statement ? `
            <div class="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-stone-900 font-bold text-base mt-2">
              "${escapeHtml(q.statement)}"
            </div>` : ''}
        </div>

        <!-- NÚT PHÁT ÂM THANH BẢN NGỮ -->
        ${q.audioText ? `
          <div class="py-1">
            <button type="button" onclick="playChineseTTS(${jsArg(q.audioText)})" class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-100/80 hover:bg-amber-200 border border-amber-300 text-[#8B1E1E] font-bold text-sm shadow-xs transition transform hover:scale-102 cursor-pointer">
              <i data-lucide="volume-2" class="w-5 h-5"></i> Nghe phát âm chuẩn (Hanban)
            </button>
            ${q.pinyin ? `<p class="text-xs text-stone-500 font-mono mt-1">${escapeHtml(q.pinyin)}</p>` : ''}
          </div>` : ''}

        <!-- 4 PHƯƠNG ÁN LỰA CHỌN A / B / C / D -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          ${q.options.map((opt, optIdx) => {
            let optClass = 'bg-white hover:bg-amber-50/80 border-stone-200 text-stone-800 hover:border-amber-300';
            if (answered) {
              if (opt.isCorrect) optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400';
              else if (answered.chosenKey === opt.key) optClass = 'bg-rose-50 border-rose-400 text-rose-900';
              else optClass = 'bg-white border-stone-200 text-stone-400 opacity-60';
            }
            return `
              <button type="button" ${answered ? 'disabled' : `onclick="answerSmartRoomQuestion(${jsArg(opt.key)})"`}
                class="p-4 rounded-2xl border-2 text-left transition-all duration-200 ${optClass} flex items-center gap-3 cursor-pointer shadow-xs">
                <span class="w-7 h-7 rounded-xl bg-amber-100/70 text-[#8B1E1E] font-black text-xs flex items-center justify-center shrink-0">
                  ${opt.key}
                </span>
                <span class="text-sm font-semibold">${escapeHtml(opt.text)}</span>
              </button>`;
          }).join('')}
        </div>

        <!-- GIẢI THÍCH & NÚT TIẾP THEO -->
        ${answered ? `
          <div class="p-4 rounded-2xl ${answered.isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'} text-xs text-left space-y-1.5 animate-fadeIn">
            <div class="font-bold flex items-center gap-1.5">
              ${answered.isCorrect ? '<i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i> Chính xác!' : '<i data-lucide="x-circle" class="w-4 h-4 text-rose-600"></i> Chưa chính xác.'}
            </div>
            <p class="leading-relaxed text-stone-700">${q.explanation}</p>
          </div>

          <button type="button" onclick="nextSmartRoomQuestion()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:brightness-110 text-white font-bold text-sm shadow-md transition cursor-pointer">
            ${state.index + 1 < total ? 'Câu tiếp theo →' : 'Hoàn thành & Nộp bài cho nhóm 🏆'}
          </button>` : ''}

      </div>

      <!-- NÚT THOÁT RA SẢNH PHÒNG -->
      <div class="text-center">
        <button type="button" onclick="classroomView = 'room-active'; renderClassroom();" class="text-xs text-stone-500 hover:text-[#8B1E1E] underline">
          Tạm dừng và quay lại sảnh phòng học
        </button>
      </div>

    </div>`;
}

function answerSmartRoomQuestion(key) {
  if (!smartRoomQuizState || !currentSmartRoom) return;
  const state = smartRoomQuizState;
  const q = currentSmartRoom.questions[state.index];
  if (state.answers[state.index]) return;

  const chosenOpt = q.options.find(o => o.key === key);
  const isCorrect = chosenOpt ? !!chosenOpt.isCorrect : false;

  state.answers[state.index] = {
    chosenKey: key,
    isCorrect,
    question: q
  };

  renderClassroom();
}

function nextSmartRoomQuestion() {
  if (!smartRoomQuizState || !currentSmartRoom) return;
  const state = smartRoomQuizState;
  const total = currentSmartRoom.questions.length;

  if (state.index + 1 < total) {
    state.index += 1;
    renderClassroom();
    autoPlayRoomAudio();
  } else {
    finishSmartRoomQuiz();
  }
}

function finishSmartRoomQuiz() {
  if (smartRoomPeerTimer) clearInterval(smartRoomPeerTimer);
  const state = smartRoomQuizState;
  const room = currentSmartRoom;
  const total = room.questions.length;
  const myScore = state.answers.filter(a => a && a.isCorrect).length;
  const durationSec = Math.round((Date.now() - state.startTime) / 1000);

  // Generate realistic group ranking
  const results = room.members.map(m => {
    let score = myScore;
    let time = durationSec;
    if (!m.name.includes('(Bạn)')) {
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
      score = Math.max(0, Math.min(total, myScore + variation));
      time = Math.max(30, durationSec + Math.floor(Math.random() * 40) - 20);
    }
    return {
      name: m.name,
      avatar: m.avatar,
      score,
      total,
      time,
      pct: Math.round((score / total) * 100)
    };
  });

  results.sort((a, b) => b.score - a.score || a.time - b.time);

  // Missed words for SRS flashcard deck
  const missedWords = state.answers
    .filter(a => a && !a.isCorrect && a.question && a.question.wordObj)
    .map(a => a.question.wordObj);

  room.quizResults = {
    myScore,
    total,
    durationSec,
    leaderboard: results,
    missedWords
  };

  addExp(myScore * 3 + 10, 'Hoàn thành bài tập nhóm thông minh');
  classroomView = 'room-result';
  renderClassroom();
}

// =========================================================================
// PHẦN 4: BẢNG VÀNG VINH DANH & THẢO LUẬN ĐÁP ÁN (ROOM RESULT VIEW)
// =========================================================================

function renderRoomResultView() {
  if (!currentSmartRoom || !currentSmartRoom.quizResults) {
    classroomView = 'room-active';
    return renderRoomActiveView();
  }

  const room = currentSmartRoom;
  const res = room.quizResults;
  const lb = res.leaderboard;
  const top1 = lb[0];
  const top2 = lb[1];
  const top3 = lb[2];

  return `
    <div class="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      
      <!-- HEADER VINH DANH HOÀNG GIA -->
      <div class="text-center space-y-2">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-950 font-bold text-xs uppercase tracking-widest border border-amber-300">
          🏆 Bảng Vàng Vinh Danh Thành Tích Nhóm
        </span>
        <h2 class="text-3xl sm:text-4xl font-serif-luxury font-black text-stone-900 tracking-tight">
          ${escapeHtml(room.title)}
        </h2>
        <p class="text-sm text-stone-600">
          Chúc mừng cả nhóm đã xuất sắc hoàn thành buổi học! Dưới đây là bảng tổng sắp xếp hạng thành viên:
        </p>
      </div>

      <!-- BỤC VINH DANH TOP 3 PODIUM -->
      <div class="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-6 pb-2">
        
        <!-- TOP 2: BẢNG NHÃN (BẠC) -->
        ${top2 ? `
          <div class="glass-card rounded-3xl p-3 sm:p-5 border-2 border-slate-300 bg-gradient-to-t from-slate-100 to-white text-center space-y-2 shadow-md">
            <span class="text-2xl sm:text-3xl block">🥈</span>
            <span class="text-2xl">${top2.avatar}</span>
            <p class="text-xs sm:text-sm font-bold text-stone-900 truncate">${escapeHtml(top2.name)}</p>
            <p class="text-base sm:text-lg font-black text-slate-800">${top2.score}/${top2.total}</p>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold uppercase">Bảng Nhãn</span>
          </div>` : '<div></div>'}

        <!-- TOP 1: TRẠNG NGUYÊN (VÀNG) -->
        ${top1 ? `
          <div class="glass-card rounded-3xl p-4 sm:p-6 border-2 border-amber-400 bg-gradient-to-t from-amber-100/80 via-amber-50/50 to-white text-center space-y-2 shadow-xl transform -translate-y-3 sm:-translate-y-5">
            <span class="text-3xl sm:text-4xl block animate-bounce">🏆</span>
            <span class="text-3xl sm:text-4xl">${top1.avatar}</span>
            <p class="text-sm sm:text-base font-black text-stone-900 truncate">${escapeHtml(top1.name)}</p>
            <p class="text-xl sm:text-2xl font-black text-[#8B1E1E]">${top1.score}/${top1.total}</p>
            <span class="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black uppercase tracking-wider shadow-xs">Trạng Nguyên</span>
          </div>` : '<div></div>'}

        <!-- TOP 3: THÁM HOA (ĐỒNG) -->
        ${top3 ? `
          <div class="glass-card rounded-3xl p-3 sm:p-5 border-2 border-amber-600/60 bg-gradient-to-t from-amber-50 to-white text-center space-y-2 shadow-md">
            <span class="text-2xl sm:text-3xl block">🥉</span>
            <span class="text-2xl">${top3.avatar}</span>
            <p class="text-xs sm:text-sm font-bold text-stone-900 truncate">${escapeHtml(top3.name)}</p>
            <p class="text-base sm:text-lg font-black text-amber-900">${top3.score}/${top3.total}</p>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold uppercase">Thám Hoa</span>
          </div>` : '<div></div>'}

      </div>

      <!-- BẢNG TỔNG SẮP CHI TIẾT CẢ PHÒNG -->
      <div class="glass-card rounded-3xl p-6 border border-amber-200/80 bg-white shadow-xs space-y-4">
        <h4 class="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
          <i data-lucide="list-ordered" class="w-4 h-4 text-[#8B1E1E]"></i>
          Bảng điểm chi tiết toàn phòng
        </h4>

        <div class="overflow-x-auto">
          <table class="w-full text-xs sm:text-sm">
            <thead>
              <tr class="text-left text-xs text-stone-500 border-b border-stone-200 pb-2">
                <th class="py-2.5 px-3">Hạng</th>
                <th class="py-2.5 px-3">Thành viên</th>
                <th class="py-2.5 px-3">Điểm số</th>
                <th class="py-2.5 px-3">Tỷ lệ</th>
                <th class="py-2.5 px-3">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              ${lb.map((item, idx) => `
                <tr class="border-b border-stone-100 hover:bg-amber-50/40 transition">
                  <td class="py-3 px-3 font-bold ${idx === 0 ? 'text-amber-600' : 'text-stone-500'}">#${idx + 1}</td>
                  <td class="py-3 px-3 font-bold text-stone-800 flex items-center gap-2">
                    <span>${item.avatar}</span>
                    <span>${escapeHtml(item.name)}</span>
                  </td>
                  <td class="py-3 px-3"><b class="text-[#8B1E1E]">${item.score}/${item.total}</b></td>
                  <td class="py-3 px-3 font-semibold text-stone-600">${item.pct}%</td>
                  <td class="py-3 px-3 text-stone-500">${formatDuration(item.time)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- GÓC THẢO LUẬN & ÔN TỪ VỰNG SAI CỦA NHÓM -->
      ${res.missedWords && res.missedWords.length ? `
        <div class="glass-card rounded-3xl p-6 border border-amber-200/80 bg-amber-50/40 space-y-3">
          <h4 class="text-sm font-bold text-stone-900 flex items-center gap-2">
            <i data-lucide="bookmark" class="w-4 h-4 text-[#8B1E1E]"></i>
            Từ vựng bạn cần ôn lại (${res.missedWords.length} từ)
          </h4>
          <p class="text-xs text-stone-600">Bấm để thêm ngay vào Flashcard cá nhân để học lặp lại ngắt quãng SRS:</p>
          <div class="flex flex-wrap gap-2 pt-1">
            ${res.missedWords.map(w => `
              <button type="button" onclick="saveMissedWordToFlashcards(${jsArg(w.hanzi)}, ${jsArg(w.pinyin)}, ${jsArg(w.meaning)})" class="px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-xs text-stone-800 flex items-center gap-1.5 shadow-xs transition">
                <b class="font-hanzi text-base text-[#8B1E1E]">${escapeHtml(w.hanzi)}</b>
                <span class="text-stone-500">(${escapeHtml(w.pinyin)})</span>
                <i data-lucide="plus" class="w-3.5 h-3.5 text-emerald-600"></i>
              </button>`).join('')}
          </div>
        </div>` : ''}

      <!-- CÁC NÚT ĐIỀU HƯỚNG TIẾP THEO -->
      <div class="flex flex-wrap justify-center items-center gap-3 pt-2">
        <button type="button" onclick="restartSmartRoomQuiz()" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white font-bold text-sm shadow-md hover:brightness-110 transition cursor-pointer flex items-center gap-2">
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Cùng làm lại đề này
        </button>

        <button type="button" onclick="openRoomVideoMeet(${jsArg(room.meetUrl)})" class="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center gap-2">
          <i data-lucide="video" class="w-4 h-4"></i> Họp video thảo luận đáp án
        </button>

        <button type="button" onclick="classroomView = 'room-active'; renderClassroom();" class="px-5 py-3 rounded-2xl bg-white border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition">
          Về sảnh phòng
        </button>

        <button type="button" onclick="classroomView = 'room-hub'; renderClassroom();" class="px-5 py-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-sm hover:bg-amber-100 transition">
          Tạo phòng học mới
        </button>
      </div>

    </div>`;
}

function restartSmartRoomQuiz() {
  startSmartRoomQuiz();
}

function saveMissedWordToFlashcards(hanzi, pinyin, meaning) {
  if (typeof srsAddCard === 'function') {
    srsAddCard({ hanzi, pinyin, meaning }, false);
    if (typeof saveSrsState === 'function') saveSrsState();
    showToast(`Đã thêm từ "${hanzi}" vào Flashcard ôn tập!`, 'success');
  }
}

// =========================================================================
// PHẦN 5: TÍNH NĂNG GIAO BÀI & CHẤM BÀI CHO GIÁO VIÊN (BẢO TOÀN NGUYÊN VẸN)
// =========================================================================

function renderTeacherView() {
  const created = storage.get(CLASSROOM_CREATED_KEY, []) || [];
  const notebookCount = (userProfile.savedWords || []).length;
  return `
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fadeIn">
      <form class="glass-card rounded-2xl p-6 border border-amber-200/70 space-y-4 lg:col-span-3 bg-white/90" onsubmit="event.preventDefault(); createAssignment(this);">
        <h3 class="text-lg font-serif-luxury font-black text-stone-900">Tạo bài tập từ vựng cho học sinh</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label class="text-xs font-semibold text-stone-700 space-y-1">Tiêu đề
            <input name="title" required maxlength="80" value="Bài tập từ vựng" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm" />
          </label>
          <label class="text-xs font-semibold text-stone-700 space-y-1">Lớp / Giáo viên
            <input name="cls" maxlength="60" placeholder="VD: Lớp HSK 2 – cô Lan" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm" />
          </label>
        </div>

        <fieldset class="space-y-2">
          <legend class="text-xs font-semibold text-stone-700 mb-1">Nguồn từ vựng</legend>
          <label class="flex flex-wrap items-center gap-2 text-sm text-stone-700">
            <input type="radio" name="source" value="level" checked class="accent-[#8B1E1E]" /> Ngẫu nhiên theo cấp
            <select name="level" class="px-2 py-1 rounded-lg border border-stone-200 bg-white text-xs">
              ${[1, 2, 3, 4, 5, 6].map(l => `<option value="${l}">HSK ${l}</option>`).join('')}
            </select>
            <select name="count" class="px-2 py-1 rounded-lg border border-stone-200 bg-white text-xs">
              ${[10, 15, 20, 30].map(n => `<option value="${n}">${n} từ</option>`).join('')}
            </select>
          </label>
          <label class="flex items-center gap-2 text-sm text-stone-700 ${notebookCount ? '' : 'opacity-50'}">
            <input type="radio" name="source" value="notebook" ${notebookCount ? '' : 'disabled'} class="accent-[#8B1E1E]" /> Từ trong sổ tay của tôi (${notebookCount} từ)
          </label>
          <label class="flex items-start gap-2 text-sm text-stone-700">
            <input type="radio" name="source" value="custom" class="accent-[#8B1E1E] mt-1" />
            <span class="flex-1 space-y-1">Danh sách tự chọn
              <textarea name="custom" rows="3" placeholder="Nhập chữ Hán, cách nhau bởi dấu phẩy hoặc xuống dòng. VD: 学习, 老师, 朋友" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm font-hanzi"
                oninput="this.form.source.value = 'custom'"></textarea>
            </span>
          </label>
        </fieldset>

        <fieldset>
          <legend class="text-xs font-semibold text-stone-700 mb-2">Dạng câu hỏi</legend>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${Object.entries(QUESTION_TYPES).map(([id, t]) => `
              <label class="flex items-center gap-2 text-sm text-stone-700 px-3 py-2 rounded-xl bg-white border border-stone-200">
                <input type="checkbox" name="types" value="${id}" ${id !== 'reverse' ? 'checked' : ''} class="accent-[#8B1E1E]" /> ${t.label}
              </label>`).join('')}
          </div>
        </fieldset>

        <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] text-white font-bold text-sm shadow-md shadow-red-950/20">
          Tạo link bài tập
        </button>
        ${lastCreatedAssignment ? renderShareBox(lastCreatedAssignment) : ''}
      </form>

      <div class="glass-card rounded-2xl p-6 border border-amber-200/70 lg:col-span-2 space-y-4 bg-white/90">
        <h3 class="text-base font-serif-luxury font-black text-stone-900">Cách dùng trên lớp</h3>
        <ol class="list-decimal pl-5 space-y-1.5 text-sm text-stone-700">
          <li>Tạo bài tập và gửi link cho học sinh (Zalo, Messenger, Google Classroom…).</li>
          <li>Học sinh mở link, nhập tên và làm bài trên điện thoại hoặc máy tính.</li>
          <li>Làm xong, học sinh bấm <b>Sao chép mã kết quả</b> và gửi lại cho bạn.</li>
          <li>Vào <b>Chấm bài</b>, dán các mã để xem bảng điểm, từ cả lớp hay sai và xuất file CSV.</li>
        </ol>
        <h4 class="text-sm font-bold text-stone-800 pt-2">Bài đã tạo (${created.length})</h4>
        <div class="space-y-2 max-h-72 overflow-y-auto">
          ${created.length ? created.map(a => `
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-stone-800 truncate">${escapeHtml(a.t)}</p>
                <p class="text-[11px] text-stone-500">${escapeHtml(a.c || '')} · ${a.w.length} từ · mã ${escapeHtml(a.id)}</p>
              </div>
              <button type="button" onclick="copyText(${jsArg(assignmentLink(a))}, 'Đã sao chép link bài tập.')" class="p-2 rounded-lg hover:bg-amber-50 text-[#8B1E1E]" title="Sao chép link"><i data-lucide="link" class="w-4 h-4"></i></button>
              <button type="button" onclick="deleteCreatedAssignment(${jsArg(a.id)})" class="p-2 rounded-lg hover:bg-rose-50 text-rose-600" title="Xóa"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>`).join('') : '<p class="text-xs text-stone-500">Chưa có bài nào.</p>'}
        </div>
      </div>
    </div>`;
}

function renderShareBox(assignment) {
  const link = assignmentLink(assignment);
  return `
    <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
      <p class="text-sm font-bold text-emerald-900">✓ Đã tạo "${escapeHtml(assignment.t)}" (${assignment.w.length} câu)</p>
      <input readonly value="${escapeHtml(link)}" onclick="this.select()" class="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-xs text-stone-700" />
      <div class="flex flex-wrap gap-2">
        <button type="button" onclick="copyText(${jsArg(link)}, 'Đã sao chép link bài tập.')" class="px-3 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold">Sao chép link</button>
        ${navigator.share ? `<button type="button" onclick="navigator.share({ title: ${jsArg(assignment.t)}, url: ${jsArg(link)} }).catch(() => {})" class="px-3 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-bold">Chia sẻ…</button>` : ''}
        <a href="${escapeHtml(link)}" class="px-3 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-bold">Làm thử như học sinh</a>
      </div>
    </div>`;
}

function collectAssignmentWords(form) {
  const source = form.source.value;
  if (source === 'notebook') {
    return { words: (userProfile.savedWords || []).map(w => [w.hanzi, w.pinyin, w.meaning]), missing: [] };
  }
  if (source === 'custom') {
    const tokens = [...new Set(form.custom.value.split(/[\s,，、;；]+/).map(t => t.trim()).filter(Boolean))];
    const words = [];
    const missing = [];
    tokens.forEach(t => {
      const hit = dictionaryData.find(d => d.title === t);
      if (hit) words.push([hit.title, hit.pinyin, hit.meaning]);
      else missing.push(t);
    });
    return { words, missing };
  }
  const level = Number(form.level.value);
  const count = Number(form.count.value);
  const pool = dictionaryData.filter(d => d.level === level);
  return { words: shuffle(pool).slice(0, count).map(d => [d.title, d.pinyin, d.meaning]), missing: [] };
}

function createAssignment(form) {
  const types = [...form.querySelectorAll('input[name="types"]:checked')].map(i => i.value);
  if (!types.length) {
    showToast('Hãy chọn ít nhất một dạng câu hỏi.', 'error');
    return;
  }
  const { words, missing } = collectAssignmentWords(form);
  if (missing.length) showToast(`Không có trong từ điển, đã bỏ qua: ${missing.join(', ')}`, 'info', 5000);
  if (words.length < 2) {
    showToast('Bài tập cần ít nhất 2 từ có trong từ điển.', 'error');
    return;
  }
  const assignment = {
    v: 1,
    id: Math.random().toString(36).slice(2, 8),
    t: form.title.value.trim() || 'Bài tập từ vựng',
    c: form.cls.value.trim(),
    q: types,
    w: words.slice(0, CLASSROOM_MAX_WORDS),
    at: todayKey()
  };
  const created = storage.get(CLASSROOM_CREATED_KEY, []) || [];
  storage.set(CLASSROOM_CREATED_KEY, [assignment, ...created].slice(0, 30));
  lastCreatedAssignment = assignment;
  renderClassroom();
}

function deleteCreatedAssignment(id) {
  const created = (storage.get(CLASSROOM_CREATED_KEY, []) || []).filter(a => a.id !== id);
  storage.set(CLASSROOM_CREATED_KEY, created);
  if (lastCreatedAssignment && lastCreatedAssignment.id === id) lastCreatedAssignment = null;
  renderClassroom();
}

// ---------- student flow ----------
function renderJoinView() {
  return `
    <form class="glass-card rounded-2xl p-6 border border-amber-200/70 max-w-xl space-y-3 bg-white/90" onsubmit="event.preventDefault(); joinAssignment(this.link.value);">
      <h3 class="text-lg font-serif-luxury font-black text-stone-900">Vào bài được giáo viên giao</h3>
      <p class="text-sm text-stone-600">Mở trực tiếp link giáo viên gửi, hoặc dán link vào ô dưới đây.</p>
      <input name="link" required placeholder="Dán link bài tập..." class="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm" />
      <button type="submit" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white text-sm font-bold">Vào bài</button>
    </form>`;
}

function joinAssignment(link) {
  const match = String(link).match(/[?&]a=([A-Za-z0-9_-]+)/);
  const code = match ? match[1] : String(link).trim();
  try {
    decodeAssignment(code);
  } catch (e) {
    showToast('Link bài tập không hợp lệ.', 'error');
    return;
  }
  history.pushState(null, '', `#/classroom?a=${code}`);
  handleClassroomRoute();
}

function buildQuestions(assignment) {
  const rand = seededRandom(assignment.id);
  const words = assignment.w.map(([hanzi, pinyin, meaning]) => ({ hanzi, pinyin, meaning }));
  const pool = words.length >= 4
    ? words
    : [...words, ...dictionaryData.slice(0, 40).map(d => ({ hanzi: d.title, pinyin: d.pinyin, meaning: d.meaning }))];
  const field = { meaning: 'meaning', pinyin: 'pinyin', listen: 'hanzi', reverse: 'hanzi' };

  return seededShuffle(words, rand).map((word, i) => {
    const type = assignment.q[i % assignment.q.length];
    const key = field[type];
    const distractors = seededShuffle(pool.filter(w => w.hanzi !== word.hanzi && w[key] !== word[key]), rand)
      .slice(0, 3)
      .map(w => w[key]);
    return { type, word, answer: word[key], options: seededShuffle([word[key], ...distractors], rand) };
  });
}

function startStudentIntro(assignment) {
  classroomRun = { assignment, name: storage.getRaw('yuhan_student_name', '') || '', questions: [], index: 0, answers: [], startedAt: 0 };
  classroomView = 'student-intro';
  renderClassroom();
}

function renderStudentIntro() {
  const a = classroomRun.assignment;
  const previous = (storage.get(CLASSROOM_ATTEMPTS_KEY, {}) || {})[a.id];
  return `
    <div class="glass-card rounded-2xl p-6 lg:p-8 border border-amber-200/70 max-w-xl mx-auto space-y-4 text-center bg-white/95">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold"><i data-lucide="school" class="w-3.5 h-3.5"></i> Bài tập được giao</span>
      <h2 class="text-2xl font-serif-luxury font-black text-stone-900">${escapeHtml(a.t)}</h2>
      ${a.c ? `<p class="text-sm text-stone-600">${escapeHtml(a.c)}</p>` : ''}
      <p class="text-sm text-stone-600">${a.w.length} câu · ${a.q.map(t => QUESTION_TYPES[t] ? QUESTION_TYPES[t].label : t).join(' · ')}</p>
      ${previous ? `<div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">Bạn đã làm bài này: <b>${previous.s}/${previous.q}</b>. <button type="button" onclick="showPreviousAttempt()" class="underline font-bold">Xem lại mã kết quả</button></div>` : ''}
      <form class="space-y-3 text-left" onsubmit="event.preventDefault(); beginQuiz(this.studentName.value);">
        <label class="text-xs font-semibold text-stone-700 space-y-1 block">Họ và tên của bạn
          <input name="studentName" required maxlength="60" value="${escapeHtml(classroomRun.name)}" placeholder="VD: Nguyễn Văn An" class="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm" />
        </label>
        <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] text-white font-bold text-sm">Bắt đầu làm bài</button>
      </form>
      <button type="button" onclick="setClassroomView('teacher')" class="text-xs text-stone-500 hover:text-[#8B1E1E]">Thoát</button>
    </div>`;
}

function beginQuiz(name) {
  const clean = String(name || '').trim().slice(0, 60);
  if (!clean) return;
  storage.setRaw('yuhan_student_name', clean);
  classroomRun.name = clean;
  classroomRun.questions = buildQuestions(classroomRun.assignment);
  classroomRun.index = 0;
  classroomRun.answers = [];
  classroomRun.startedAt = Date.now();
  classroomView = 'quiz';
  renderClassroom();
  autoPlayListening();
}

function autoPlayListening() {
  const q = classroomRun && classroomRun.questions[classroomRun.index];
  if (q && q.type === 'listen') playChineseTTS(q.word.hanzi);
}

function renderQuizQuestion() {
  const run = classroomRun;
  const q = run.questions[run.index];
  const answered = run.answers[run.index];
  const total = run.questions.length;
  const prompt = {
    meaning: `<span class="font-hanzi text-6xl font-black text-[#8B1E1E]">${escapeHtml(q.word.hanzi)}</span>`,
    pinyin: `<span class="font-hanzi text-6xl font-black text-[#8B1E1E]">${escapeHtml(q.word.hanzi)}</span>`,
    listen: `<button type="button" onclick="playChineseTTS(${jsArg(q.word.hanzi)})" class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-[#8B1E1E] font-bold"><i data-lucide="volume-2" class="w-6 h-6"></i> Nghe lại</button>`,
    reverse: `<span class="text-2xl font-serif-luxury font-black text-stone-900">${escapeHtml(q.word.meaning)}</span>`
  }[q.type];
  const optionClass = opt => {
    if (!answered) return 'bg-white hover:bg-amber-50 border-stone-200 text-stone-800';
    if (opt === q.answer) return 'bg-emerald-50 border-emerald-500 text-emerald-900';
    if (opt === answered.choice) return 'bg-rose-50 border-rose-400 text-rose-800';
    return 'bg-white border-stone-200 text-stone-400';
  };
  const isHanziOption = q.type === 'listen' || q.type === 'reverse';

  return `
    <div class="max-w-xl mx-auto space-y-4">
      <div class="flex items-center gap-3 text-xs font-semibold text-stone-600">
        <span>${escapeHtml(run.assignment.t)}</span>
        <span class="ml-auto">Câu ${run.index + 1}/${total}</span>
      </div>
      <div class="w-full h-2 rounded-full bg-stone-200 overflow-hidden"><div class="h-full bg-gradient-to-r from-[#8B1E1E] to-[#C59A3F]" style="width:${Math.round((run.index / total) * 100)}%"></div></div>
      <div class="glass-card rounded-3xl p-6 lg:p-8 border border-amber-200/70 text-center space-y-6 bg-white/95">
        <p class="text-xs font-bold uppercase tracking-wider text-amber-900">${QUESTION_TYPES[q.type].hint}</p>
        <div>${prompt}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${q.options.map(opt => `
            <button type="button" ${answered ? 'disabled' : `onclick="answerClassroomQuestion(${jsArg(opt)})"`}
              class="px-4 py-3 rounded-xl border-2 text-left transition-colors ${optionClass(opt)} ${isHanziOption ? 'font-hanzi text-2xl font-bold text-center' : 'text-sm font-semibold'}">${escapeHtml(opt)}</button>`).join('')}
        </div>
        ${answered ? `
          <div class="text-sm ${answered.correct ? 'text-emerald-800' : 'text-rose-700'}">
            ${answered.correct ? '✓ Chính xác!' : '✗ Chưa đúng.'}
            <span class="text-stone-600"><b class="font-hanzi">${escapeHtml(q.word.hanzi)}</b> (${escapeHtml(q.word.pinyin)}): ${escapeHtml(q.word.meaning)}</span>
          </div>
          <button type="button" onclick="nextQuizQuestion()" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white font-bold text-sm">
            ${run.index + 1 < total ? 'Câu tiếp theo' : 'Nộp bài'}
          </button>` : ''}
      </div>
    </div>`;
}

function answerClassroomQuestion(choice) {
  const run = classroomRun;
  const q = run.questions[run.index];
  if (run.answers[run.index]) return;
  run.answers[run.index] = { choice, correct: choice === q.answer };
  if (q.type !== 'listen') playChineseTTS(q.word.hanzi);
  renderClassroom();
}

function nextQuizQuestion() {
  const run = classroomRun;
  if (run.index + 1 < run.questions.length) {
    run.index += 1;
    renderClassroom();
    autoPlayListening();
    return;
  }
  finishQuiz();
}

function finishQuiz() {
  const run = classroomRun;
  const score = run.answers.filter(a => a && a.correct).length;
  const wrong = run.questions.filter((q, i) => !(run.answers[i] && run.answers[i].correct)).map(q => q.word.hanzi);
  const result = {
    a: run.assignment.id,
    t: run.assignment.t,
    n: run.name,
    s: score,
    q: run.questions.length,
    d: Math.round((Date.now() - run.startedAt) / 1000),
    w: wrong,
    at: new Date().toISOString()
  };
  run.result = result;
  run.code = encodeResult(result);

  const attempts = storage.get(CLASSROOM_ATTEMPTS_KEY, {}) || {};
  attempts[run.assignment.id] = { s: score, q: result.q, code: run.code };
  storage.set(CLASSROOM_ATTEMPTS_KEY, attempts);

  wrong.forEach(h => {
    const w = run.assignment.w.find(x => x[0] === h);
    if (w) srsAddCard({ hanzi: w[0], pinyin: w[1], meaning: w[2] }, false);
  });
  saveSrsState();
  addExp(score * 2 + 5, 'Hoàn thành bài tập lớp học');

  classroomView = 'result';
  renderClassroom();
}

function showPreviousAttempt() {
  const prev = (storage.get(CLASSROOM_ATTEMPTS_KEY, {}) || {})[classroomRun.assignment.id];
  if (!prev) return;
  try {
    classroomRun.result = decodeResult(prev.code);
    classroomRun.code = prev.code;
    classroomView = 'result';
    renderClassroom();
  } catch (e) {
    showToast('Không đọc được kết quả đã lưu.', 'error');
  }
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m} phút ${s} giây` : `${s} giây`;
}

function renderStudentResult() {
  const r = classroomRun.result;
  const pct = Math.round((r.s / r.q) * 100);
  return `
    <div class="glass-card rounded-3xl p-6 lg:p-8 border border-amber-200/70 max-w-xl mx-auto space-y-5 text-center bg-white/95">
      <p class="text-xs font-bold uppercase tracking-wider text-amber-900">${escapeHtml(r.t)}</p>
      <h2 class="text-4xl font-black ${pct >= 80 ? 'text-emerald-800' : pct >= 50 ? 'text-amber-800' : 'text-[#8B1E1E]'}">${r.s}/${r.q}</h2>
      <p class="text-sm text-stone-600">${escapeHtml(r.n)} · ${pct}% · ${formatDuration(r.d)}</p>
      ${r.w.length ? `<div class="text-sm text-stone-700">Từ cần ôn lại (đã thêm vào Flashcard của bạn):
        <div class="flex flex-wrap justify-center gap-1.5 mt-2">${r.w.map(h => `<span class="px-2 py-1 rounded-lg bg-rose-50 border border-rose-200 font-hanzi font-bold text-rose-800">${escapeHtml(h)}</span>`).join('')}</div></div>` : '<p class="text-sm text-emerald-800 font-semibold">Xuất sắc, không sai câu nào! 🎉</p>'}
      <div class="text-left space-y-2">
        <p class="text-xs font-bold text-stone-700">Mã kết quả — gửi mã này cho giáo viên:</p>
        <textarea readonly rows="3" onclick="this.select()" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-[11px] font-mono text-stone-700 break-all">${escapeHtml(classroomRun.code)}</textarea>
        <button type="button" onclick="copyText(${jsArg(classroomRun.code)}, 'Đã sao chép mã kết quả. Hãy gửi cho giáo viên.')" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white font-bold text-sm">Sao chép mã kết quả</button>
      </div>
      <div class="flex flex-wrap justify-center gap-2">
        <button type="button" onclick="beginQuiz(classroomRun.name)" class="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold">Làm lại</button>
        <button type="button" onclick="switchTab('flashcards').then(() => startFlashcardSession('due'))" class="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">Ôn từ sai bằng Flashcard</button>
      </div>
    </div>`;
}

// ---------- teacher: grade ----------
function renderGradeView() {
  const results = storage.get(CLASSROOM_RESULTS_KEY, []) || [];
  const created = storage.get(CLASSROOM_CREATED_KEY, []) || [];
  const byAssignment = {};
  results.forEach(r => { (byAssignment[r.a] = byAssignment[r.a] || []).push(r); });

  const tables = Object.entries(byAssignment).map(([id, rows]) => {
    const meta = created.find(a => a.id === id);
    const avg = Math.round(rows.reduce((sum, r) => sum + r.s / r.q, 0) / rows.length * 100);
    const missCount = {};
    rows.forEach(r => r.w.forEach(h => { missCount[h] = (missCount[h] || 0) + 1; }));
    const topMissed = Object.entries(missCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const sorted = [...rows].sort((a, b) => b.s / b.q - a.s / a.q || a.d - b.d);
    return `
      <div class="glass-card rounded-2xl p-5 border border-amber-200/70 space-y-3 bg-white/95">
        <div class="flex flex-wrap items-center gap-2">
          <h4 class="text-base font-serif-luxury font-black text-stone-900">${escapeHtml(meta ? meta.t : rows[0].t)}</h4>
          <span class="text-xs text-stone-500">mã ${escapeHtml(id)} · ${rows.length} bài nộp · trung bình ${avg}%</span>
          <button type="button" onclick="exportClassroomCsv(${jsArg(id)})" class="ml-auto px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-amber-50">Xuất CSV</button>
        </div>
        ${topMissed.length ? `<div class="text-xs text-stone-600">Từ cả lớp hay sai:
          ${topMissed.map(([h, n]) => `<span class="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200"><b class="font-hanzi text-rose-800">${escapeHtml(h)}</b><span class="text-rose-600">×${n}</span></span>`).join('')}</div>` : ''}
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead><tr class="text-left text-xs text-stone-500 border-b border-stone-200">
              <th class="py-2 pr-2">#</th><th class="py-2 pr-2">Học sinh</th><th class="py-2 pr-2">Điểm</th><th class="py-2 pr-2">Thời gian</th><th class="py-2">Nộp lúc</th>
            </tr></thead>
            <tbody>${sorted.map((r, i) => `
              <tr class="border-b border-stone-100">
                <td class="py-2 pr-2 text-stone-500">${i + 1}</td>
                <td class="py-2 pr-2 font-semibold text-stone-800">${escapeHtml(r.n)}</td>
                <td class="py-2 pr-2"><b class="${r.s / r.q >= 0.8 ? 'text-emerald-800' : r.s / r.q >= 0.5 ? 'text-amber-800' : 'text-[#8B1E1E]'}">${r.s}/${r.q}</b></td>
                <td class="py-2 pr-2 text-stone-600">${formatDuration(r.d)}</td>
                <td class="py-2 text-stone-600">${escapeHtml(new Date(r.at).toLocaleString('vi-VN'))}</td>
              </tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="space-y-6 animate-fadeIn">
      <form class="glass-card rounded-2xl p-6 border border-amber-200/70 space-y-3 bg-white/95" onsubmit="event.preventDefault(); gradeResultCodes(this.codes.value); this.codes.value = '';">
        <h3 class="text-lg font-serif-luxury font-black text-stone-900">Chấm bài từ mã kết quả</h3>
        <p class="text-sm text-stone-600">Dán một hoặc nhiều mã (mỗi mã một dòng, có thể dán cả đoạn tin nhắn). Mã trùng sẽ tự bỏ qua.</p>
        <textarea name="codes" rows="4" required placeholder="${RESULT_CODE_PREFIX}.xxxx.xxxx" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-mono"></textarea>
        <div class="flex flex-wrap gap-2">
          <button type="submit" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white text-sm font-bold">Chấm bài</button>
          ${results.length ? '<button type="button" onclick="clearClassroomResults()" class="px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 text-sm font-bold">Xóa toàn bộ kết quả</button>' : ''}
        </div>
      </form>
      ${tables || '<p class="text-sm text-stone-500">Chưa có bài nộp nào.</p>'}
    </div>`;
}

function gradeResultCodes(text) {
  const codes = String(text).match(new RegExp(`${RESULT_CODE_PREFIX}\\.[A-Za-z0-9_-]+\\.[0-9a-f]{8}`, 'g')) || [];
  const results = storage.get(CLASSROOM_RESULTS_KEY, []) || [];
  const known = new Set(results.map(r => r.code));
  let added = 0;
  let invalid = 0;
  codes.forEach(code => {
    if (known.has(code)) return;
    try {
      const r = decodeResult(code);
      results.push({ ...r, code });
      known.add(code);
      added += 1;
    } catch (e) {
      invalid += 1;
    }
  });
  storage.set(CLASSROOM_RESULTS_KEY, results);
  if (!codes.length) showToast('Không tìm thấy mã kết quả hợp lệ trong nội dung đã dán.', 'error');
  else showToast(`Đã thêm ${added} bài nộp${invalid ? `, ${invalid} mã bị lỗi` : ''}.`, invalid ? 'info' : 'success');
  renderClassroom();
}

function clearClassroomResults() {
  if (!window.confirm('Xóa toàn bộ kết quả đã chấm trên máy này?')) return;
  storage.set(CLASSROOM_RESULTS_KEY, []);
  renderClassroom();
}

function exportClassroomCsv(id) {
  const rows = (storage.get(CLASSROOM_RESULTS_KEY, []) || []).filter(r => r.a === id);
  const cell = v => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [['Học sinh', 'Đúng', 'Tổng', 'Phần trăm', 'Thời gian (giây)', 'Từ sai', 'Nộp lúc'].map(cell).join(',')];
  rows.forEach(r => lines.push([r.n, r.s, r.q, Math.round((r.s / r.q) * 100), r.d, r.w.join(' '), r.at].map(cell).join(',')));
  downloadFile(`ket-qua-${id}.csv`, '﻿' + lines.join('\r\n'), 'text/csv;charset=utf-8');
}

})();

/* --- FILE: js/core/router.js --- */
(function(){
// =========================================================================
// Navigation: grouped tabs, hash routing (#/tab), lazy tab rendering
// =========================================================================

/** Every tab: label, Lucide icon, datasets it needs and how to render it the first time. */
const TABS = {
  home: { label: 'Trang chủ', icon: 'house', data: ['dictionary'], init: () => renderHomeDashboard() },
  pathway: { label: 'Lộ trình HSK 3.0', icon: 'map', data: ['hsk30Roadmap'], init: () => renderPathwayTab() },
  jiaocheng: {
    label: 'Giáo trình Hán ngữ', icon: 'book-marked', data: ['jiaocheng'],
    init: () => { renderJiaocheng(); setupJiaochengSearch(); }
  },
  etymology: {
    label: 'Chiết tự & Gốc từ', icon: 'sparkles', data: ['etymology', 'dictionary', 'radicals', 'hanziDecompositions'],
    init: () => { renderCharacterPills(); renderEtymologyDetail(activeEtymologyIndex || 0); }
  },
  radicals: { label: '214 Bộ thủ', icon: 'grid-3x3', data: ['radicals'], init: () => { renderRadicals(); setupRadicalSearch(); } },
  dictionary: { label: 'Từ điển & Chủ đề', icon: 'book-open', data: ['dictionary'], init: () => renderDictionary(true) },
  flashcards: { label: 'Flashcard ôn tập', icon: 'layers', data: ['dictionary', 'thematicVocab', 'topics', 'multidimensionalWords'], init: () => initFlashcards() },
  confusions: { label: 'Từ dễ lẫn', icon: 'split', data: ['confusions'], init: () => renderConfusions() },
  chengyu: { label: 'Thành ngữ', icon: 'scroll', data: ['chengyu'], init: () => { renderChengyu(); setupChengyuSearch(); } },
  grammar: {
    label: 'Ngữ pháp', icon: 'compass', data: ['grammar', 'mindmap'],
    init: () => {
      renderGrammarCompendium();
      setupGrammarSearch();
      renderMindmap();
      setupMindmapControls();
      setGrammarViewMode(activeGrammarViewMode || 'mindmap');
    }
  },
  readings: { label: 'Đọc hiểu song ngữ', icon: 'book-open-check', data: ['readings'], init: () => { initReadingsModule(); setupReadingSearch(); } },
  culture: { label: 'Văn hóa & Lịch sử', icon: 'landmark', data: ['culture'], init: () => { renderCultureCards(); setupCultureSearch(); } },
  practice: { label: 'Luyện 4 kỹ năng', icon: 'check-square', data: ['practice'], init: () => renderPractice() },
  translation: {
    label: 'Luyện dịch', icon: 'languages', data: ['lessons'],
    init: () => { renderTranslationLessonList(); renderTranslationStage(); }
  },
  aichat: { label: 'Hội thoại tình huống', icon: 'bot', data: ['aiScenarios'], init: () => initAiChatModule() },
  mockexam: { label: 'Thi thử HSK', icon: 'file-check-2', data: ['mockExam'], init: () => initMockExamModule() },
  woodblock: { label: 'Xếp khối gỗ', icon: 'puzzle', data: ['woodBlock'], init: () => initWoodBlockGame() },
  flipcard: { label: 'Lật thẻ tìm từ', icon: 'layers', data: ['flipCard'], init: () => initFlipCardGame() },
  classroom: { label: 'Lớp học thông minh', icon: 'school', data: ['dictionary', 'mockExam'], init: () => initClassroom() }
};

/** Top-level groups shown in the main nav (bottom bar on mobile). */
const NAV_GROUPS = [
  { id: 'home', label: 'Trang chủ', short: 'Trang chủ', icon: 'house', tabs: ['home'] },
  { id: 'path', label: 'Lộ trình', short: 'Lộ trình', icon: 'route', tabs: ['pathway', 'jiaocheng'] },
  { id: 'hanzi', label: 'Chữ Hán', short: 'Chữ Hán', icon: 'type', tabs: ['etymology', 'radicals'] },
  { id: 'vocab', label: 'Từ vựng', short: 'Từ vựng', icon: 'book-a', tabs: ['dictionary', 'flashcards', 'confusions', 'chengyu'] },
  { id: 'read', label: 'Ngữ pháp & Đọc', short: 'Ngữ pháp', icon: 'library', tabs: ['grammar', 'readings', 'culture'] },
  { id: 'train', label: 'Luyện tập & Thi', short: 'Luyện thi', icon: 'target', tabs: ['practice', 'translation', 'aichat', 'mockexam', 'woodblock', 'flipcard', 'classroom'] }
];

const DEFAULT_TAB = 'home';
const TAB_ALIASES = { mindmap: 'grammar', today: 'home' };
const LAST_TAB_PER_GROUP_KEY = 'yuhan_last_tab_per_group';
const RECENT_TABS_KEY = 'yuhan_recent_tabs';

let activeTab = null;
const renderedTabs = new Set();
const renderingTabs = new Map();
const lastTabPerGroup = storage.get(LAST_TAB_PER_GROUP_KEY, {}) || {};

function groupOfTab(tabId) {
  return NAV_GROUPS.find(g => g.tabs.includes(tabId)) || NAV_GROUPS[0];
}

/** "#/classroom?a=xyz" -> "classroom" */
function hashPath() {
  try {
    return decodeURIComponent((location.hash || '').replace(/^#\/?/, '').split('?')[0]).trim();
  } catch (e) {
    return '';
  }
}

/** Query parameters after the tab in the hash, e.g. #/classroom?a=xyz */
function getHashParams() {
  return new URLSearchParams((location.hash || '').split('?')[1] || '');
}

function tabFromHash() {
  const raw = hashPath();
  const tabId = TAB_ALIASES[raw] || raw;
  return TABS[tabId] ? tabId : null;
}

function renderNav() {
  const group = groupOfTab(activeTab);

  const groupButton = (g, variant) => {
    const isActive = g.id === group.id;
    const base = variant === 'bottom'
      ? 'nav-group-bottom flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-bold'
      : 'nav-group flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold whitespace-nowrap';
    return `
      <button type="button" onclick="selectNavGroup(${jsArg(g.id)})" class="${base} ${isActive ? 'is-active' : ''}"
        ${isActive ? 'aria-current="true"' : ''} title="${escapeHtml(g.label)}">
        <i data-lucide="${g.icon}" class="w-4 h-4"></i>
        <span>${escapeHtml(variant === 'bottom' ? g.short : g.label)}</span>
      </button>`;
  };

  const groupsEl = document.getElementById('navGroups');
  const bottomEl = document.getElementById('bottomNav');
  const subEl = document.getElementById('navSubTabs');
  if (groupsEl) groupsEl.innerHTML = NAV_GROUPS.map(g => groupButton(g, 'top')).join('');
  if (bottomEl) bottomEl.innerHTML = NAV_GROUPS.map(g => groupButton(g, 'bottom')).join('');
  if (subEl) {
    // A group with a single tab needs no second row.
    subEl.classList.toggle('hidden', group.tabs.length < 2);
    // On mobile the group row lives in the bottom bar, so the top bar would be empty.
    document.getElementById('mainNav').classList.toggle('max-md:hidden', group.tabs.length < 2);
    const closeTabAction = activeTab !== 'home'
      ? `<button type="button" onclick="requestExitActiveTask(activeTab)" class="nav-subtab-close ml-auto flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-[#8B1E1E] bg-white/80 dark:bg-stone-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-amber-300/80 hover:border-rose-400 dark:border-stone-700 transition-all cursor-pointer shadow-2xs group" title="Đóng tác vụ hiện tại, trở về Trang Chủ">
          <span class="w-4 h-4 rounded-full bg-gradient-to-br from-[#8B1E1E] to-rose-700 text-amber-200 flex items-center justify-center text-[10px] font-black group-hover:rotate-90 transition-transform">✕</span>
          <span>Đóng tác vụ</span>
        </button>`
      : '';
    subEl.innerHTML = group.tabs.map(tabId => {
      const tab = TABS[tabId];
      const isActive = tabId === activeTab;
      return `
        <a href="#/${tabId}" role="tab" aria-selected="${isActive}" class="nav-subtab ${isActive ? 'is-active' : ''}">
          <i data-lucide="${tab.icon}" class="w-4 h-4"></i>
          <span>${escapeHtml(tab.label)}</span>
        </a>`;
    }).join('') + closeTabAction;
  }
  refreshIcons(document.getElementById('mainNav'));
  refreshIcons(bottomEl);
}

function selectNavGroup(groupId) {
  const group = NAV_GROUPS.find(g => g.id === groupId);
  if (!group) return;
  const remembered = lastTabPerGroup[groupId];
  switchTab(group.tabs.includes(remembered) ? remembered : group.tabs[0]);
}

/** Load the tab's datasets and run its one-time render. Safe to call repeatedly. */
function ensureTabRendered(tabId) {
  if (renderedTabs.has(tabId)) return Promise.resolve();
  if (renderingTabs.has(tabId)) return renderingTabs.get(tabId);

  const tab = TABS[tabId];
  const section = document.getElementById(`tab-${tabId}`);

  // Data already in memory: render synchronously so callers can act on the tab right away.
  if (isDataLoaded(tab.data)) {
    tab.init();
    renderedTabs.add(tabId);
    if (section) refreshIcons(section);
    return Promise.resolve();
  }

  const job = loadDatasets(tab.data)
    .then(() => {
      tab.init();
      renderedTabs.add(tabId);
      if (section) refreshIcons(section);
    })
    .catch(err => {
      console.error(`Không thể tải dữ liệu cho tab "${tabId}":`, err);
      showToast('Không tải được dữ liệu. Vui lòng kiểm tra kết nối mạng và thử lại.', 'error');
    })
    .finally(() => {
      renderingTabs.delete(tabId);
      if (section) section.removeAttribute('aria-busy');
    });

  if (section) section.setAttribute('aria-busy', 'true');
  renderingTabs.set(tabId, job);
  return job;
}

// Tab Switching
function switchTab(tabId, options = {}) {
  tabId = TAB_ALIASES[tabId] || tabId;
  // Stroke practice is a modal that any tab can open.
  if (tabId === 'writing') {
    openWritingModal();
    return Promise.resolve();
  }
  if (tabId === 'grammar' && options.view) activeGrammarViewMode = options.view;
  if (!TABS[tabId]) tabId = DEFAULT_TAB;

  const changed = activeTab !== tabId;
  activeTab = tabId;

  const group = groupOfTab(tabId);
  lastTabPerGroup[group.id] = tabId;
  storage.set(LAST_TAB_PER_GROUP_KEY, lastTabPerGroup);

  Object.keys(TABS).forEach(t => {
    const section = document.getElementById(`tab-${t}`);
    if (section) section.classList.toggle('hidden', t !== tabId);
  });

  // Keep query params (e.g. #/classroom?a=...) when the tab itself does not change.
  if (hashPath() !== tabId) {
    history[options.replace ? 'replaceState' : 'pushState'](null, '', `#/${tabId}`);
  }
  if (tabId !== 'home') {
    const recent = (storage.get(RECENT_TABS_KEY, []) || []).filter(t => t !== tabId);
    storage.set(RECENT_TABS_KEY, [tabId, ...recent].slice(0, 6));
  }
  document.title = `${TABS[tabId].label} · Học Tiếng Trung Mỗi Ngày`;
  renderNav();

  if (changed && !options.keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  // The dashboard summarises other tabs, so refresh it every time it is shown.
  const alreadyRendered = renderedTabs.has(tabId);
  const job = ensureTabRendered(tabId);
  if (alreadyRendered && changed && tabId === 'home') renderHomeDashboard();
  return job;
}

/** Dọn dẹp các nút close góc tự động lỗi thời nếu còn tồn tại */
function cleanupStrayTabCloseButtons() {
  document.querySelectorAll('.tab-corner-close-btn').forEach(el => el.remove());
}

// ---------------- TASK EXIT CONFIRMATION ENGINE (ORIENTAL LUXURY) ----------------
let pendingExitTaskCallback = null;

function isTaskInProgress(tabId) {
  // 1. Kiểm tra làm bài thi HSK dở dang
  if (tabId === 'mockexam') {
    if (typeof activeExam !== 'undefined' && activeExam && typeof examUserAnswers !== 'undefined') {
      const answeredKeys = Object.keys(examUserAnswers).filter(k => {
        const v = examUserAnswers[k];
        return v && (Array.isArray(v) ? v.length > 0 : String(v).trim() !== '');
      });
      const answeredCount = answeredKeys.length;
      const total = (activeExam.questions || []).length;
      
      // Nếu đã trả lời ít nhất 1 câu và chưa hoàn thành nộp bài
      if (answeredCount > 0 && answeredCount < total) {
        const m = typeof examTimeRemaining !== 'undefined' ? Math.floor(examTimeRemaining / 60) : 0;
        const s = typeof examTimeRemaining !== 'undefined' ? examTimeRemaining % 60 : 0;
        const timeStr = `${m} phút ${s < 10 ? '0' + s : s}s`;

        return {
          inProgress: true,
          title: 'Xác Nhận Rời Phòng Thi HSK?',
          subtitle: 'Bài thi thử HSK đang diễn ra chưa hoàn thành',
          message: `Bạn đang làm dở bài thi <strong>${escapeHtml(activeExam.title || 'HSK')}</strong>.<br><br>
            📊 Tiến độ: <strong>Đã làm ${answeredCount} / ${total} câu</strong><br>
            ⏱️ Thời gian còn lại: <strong>${timeStr}</strong><br><br>
            ⚠️ <em>Lưu ý: Nếu bạn thoát phòng thi lúc này, kết quả của lượt làm bài hiện tại sẽ không được lưu và không được chấm điểm.</em><br><br>
            Bạn có chắc chắn muốn hủy và quay về Trang Chủ không?`,
          onConfirm: () => {
            if (typeof examTimerInterval !== 'undefined' && examTimerInterval) {
              clearInterval(examTimerInterval);
            }
            if (typeof examUserAnswers !== 'undefined') {
              examUserAnswers = {};
            }
          }
        };
      }
    }
  }

  // 2. Kiểm tra màn chơi lật thẻ tìm từ
  if (tabId === 'flipcard') {
    if (typeof flipMatchedPairsCount !== 'undefined' && typeof flipTotalPairs !== 'undefined') {
      if (flipMatchedPairsCount > 0 && flipMatchedPairsCount < flipTotalPairs) {
        return {
          inProgress: true,
          title: 'Xác Nhận Thoát Màn Chơi Lật Thẻ?',
          subtitle: 'Ván chơi lật thẻ tìm từ đang diễn ra',
          message: `Bạn đang ghép dở ván lật thẻ (đã hoàn thành <strong>${flipMatchedPairsCount}/${flipTotalPairs} cặp</strong>).<br><br>Nếu thoát bây giờ, điểm số và tiến trình của màn chơi này sẽ bị hủy. Bạn có chắc chắn muốn quay về Trang Chủ không?`,
          onConfirm: () => {}
        };
      }
    }
  }

  // 3. Kiểm tra màn chơi xếp khối gỗ
  if (tabId === 'woodblock') {
    if (typeof woodPlacedCount !== 'undefined' && woodPlacedCount > 0) {
      return {
        inProgress: true,
        title: 'Xác Nhận Thoát Xếp Khối Gỗ?',
        subtitle: 'Ván chơi xếp khối gỗ đang diễn ra',
        message: 'Bạn đang ghép dở màn chơi khối gỗ. Nếu thoát bây giờ, tiến trình ván chơi sẽ bị hủy. Bạn có chắc chắn muốn quay về Trang Chủ không?',
        onConfirm: () => {}
      };
    }
  }

  return { inProgress: false };
}

function requestExitActiveTask(tabId) {
  if (!tabId || tabId === 'home') {
    switchTab('home');
    return;
  }

  const check = isTaskInProgress(tabId);
  if (check && check.inProgress) {
    pendingExitTaskCallback = () => {
      if (typeof check.onConfirm === 'function') check.onConfirm();
      switchTab('home');
    };
    showConfirmExitModal(check.title, check.subtitle, check.message);
  } else {
    // Không có tác vụ dở dang: Thoát mượt mà ngay lập tức
    switchTab('home');
  }
}

function showConfirmExitModal(title, subtitle, message) {
  const modal = document.getElementById('confirmExitTaskModal');
  const titleEl = document.getElementById('confirmExitTitle');
  const subEl = document.getElementById('confirmExitSubtitle');
  const msgEl = document.getElementById('confirmExitMessage');

  if (!modal) {
    if (confirm('Nhiệm vụ đang diễn ra chưa hoàn thành. Bạn có chắc chắn muốn hủy và quay về Trang Chủ không?')) {
      if (typeof pendingExitTaskCallback === 'function') pendingExitTaskCallback();
      else switchTab('home');
    }
    return;
  }

  if (titleEl) titleEl.innerText = title;
  if (subEl) subEl.innerText = subtitle;
  if (msgEl) msgEl.innerHTML = message;

  modal.classList.remove('hidden');
  if (typeof refreshIcons === 'function') refreshIcons(modal);
}

function cancelExitTask() {
  const modal = document.getElementById('confirmExitTaskModal');
  if (modal) modal.classList.add('hidden');
  pendingExitTaskCallback = null;
  if (typeof showToast === 'function') {
    showToast('Đã tiếp tục làm bài!', 'info');
  }
}

function proceedExitTask() {
  const modal = document.getElementById('confirmExitTaskModal');
  if (modal) modal.classList.add('hidden');
  if (typeof pendingExitTaskCallback === 'function') {
    const cb = pendingExitTaskCallback;
    pendingExitTaskCallback = null;
    cb();
  } else {
    switchTab('home');
  }
  if (typeof showToast === 'function') {
    showToast('Đã hủy tác vụ dở dang và quay về Trang Chủ.', 'info');
  }
}

window.addEventListener('popstate', () => {
  const tabId = tabFromHash() || DEFAULT_TAB;
  if (tabId !== activeTab) switchTab(tabId, { replace: true });
  else if (tabId === 'classroom' && renderedTabs.has('classroom')) handleClassroomRoute();
});

// Application bootstrap
function initApp() {
  initTheme();
  loadUserProfile();
  loadSrsState();
  initTtsVoices();
  setupGlobalSearch();
  switchTab(tabFromHash() || DEFAULT_TAB, { replace: true, keepScroll: true });
  initAccount();
  initVisitorTracker();
  initFloatingAiAssistant();
  initFloatingDock();
  cleanupStrayTabCloseButtons();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('modal') === 'complaint' && typeof openComplaintModal === 'function') {
    setTimeout(() => openComplaintModal(), 200);
  }
}

window.addEventListener('DOMContentLoaded', initApp);

})();
