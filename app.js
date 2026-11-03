// Học Tiếng Trung Mỗi Ngày (每日中文) Core Application Logic - Oriental Luxury Edition
// Slogan: 多学一门外语, 多看一个世界, 多过一种人生
let dictionaryData = [];
let lessonsData = [];
let etymologyData = [];
let mindmapData = null;
let confusionsData = [];
let practiceData = [];
let cultureData = [];
let mockExamsData = [];
let aiScenariosData = [];
let radicalsData = [];
let chengyuData = [];
let readingsData = [];
let grammarData = [];
let jiaochengData = null;
let topicsData = [];
let activeJiaochengVolume = 'all';
let jiaochengSearchQuery = '';

// Gamification & Profile State
let userProfile = {
  streak: 1,
  exp: 50,
  lastStudyDate: new Date().toISOString().split('T')[0],
  savedWords: []
};

// State
let activeTab = 'etymology';
let activeCultureCategory = 'all';
let cultureSearchQuery = '';
let activeRadicalStroke = 'all';
let radicalSearchQuery = '';
let activeChengyuCategory = 'all';
let chengyuSearchQuery = '';
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
let activeGrammarCategory = 'all';
let activeGrammarViewMode = 'mindmap';
let grammarSearchQuery = '';
let mindmapActiveBranch = 'all';
let mindmapSearchQuery = '';
let expandedMindmapNodes = new Set();
let activeEtymologyIndex = 0;
let currentHskLevel = 1;
let currentPracticeLevel = 1;
let currentPracticeSkill = 'all';
let practiceUserAnswers = {};
let practiceReorderState = {};
let practiceListeningReveal = {};
let practiceRecordingState = {};
let practiceSpeechRecognition = null;

// HanziWriter State
let currentWriter = null;
let currentWritingChar = '你';
let isWritingQuizActive = false;

// AI Chat State
let activeAiScenario = null;
let aiChatHistory = [];

// Mock Exam State
let currentExamLevel = 1;
let activeExam = null;
let examUserAnswers = {};
let examTimeRemaining = 0;
let examTimerInterval = null;

// Translation Practice State (HiHSK Pro)
let currentTransLevel = 1;
let currentTransLesson = 4; // Defaults to Lesson 4 as in hihsk.com/hsk30/luyen-dich/1/4
let currentTransQuestionIdx = 0;
let transEvaluationResults = {};
let showWordBank = false;

let pathwayLessonsRendered = 0;
let pathwayLessonsBatch = 10;
let dictRendered = 0;
let dictBatch = 24;
let currentDictHsk = 'all';
let currentDictSearch = '';
let currentDictMode = 'hsk'; // 'hsk' or 'topic'
let currentDictTopic = 'all';
let currentTopicSearch = '';
let topicDictRendered = 0;
let topicDictBatch = 24;

// Flashcard State
let flashcardQueue = [];
let currentFlashcardIndex = 0;
let masteredWords = new Set();
let isCardFlipped = false;

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

// =========================================================================
// Dual-Voice Beijing TTS Engine (Giọng Đọc Chuẩn Bắc Kinh 普通话: Nam & Nữ)
// =========================================================================
let currentTtsGender = (typeof localStorage !== 'undefined' && localStorage.getItem('yuhan_tts_gender')) || 'female';
let currentTtsSpeed = (typeof localStorage !== 'undefined' && parseFloat(localStorage.getItem('yuhan_tts_speed'))) || 0.85;
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
      label.innerText = 'Bắc Kinh (Nam)';
    } else {
      icon.innerText = '👩';
      label.innerText = 'Bắc Kinh (Nữ)';
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

// Gamification Functions
function loadUserProfile() {
  try {
    const saved = localStorage.getItem('yuhan_hsk_user_profile');
    if (saved) {
      userProfile = Object.assign(userProfile, JSON.parse(saved));
    }
  } catch (e) {
    console.warn('LocalStorage not available');
  }

  // Check streak
  const today = new Date().toISOString().split('T')[0];
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
  try {
    localStorage.setItem('yuhan_hsk_user_profile', JSON.stringify(userProfile));
  } catch (e) {}
  updateProfileUI();
}

function addExp(points, reason) {
  userProfile.exp = (userProfile.exp || 0) + points;
  saveUserProfile();
}

function updateProfileUI() {
  const streakEl = document.getElementById('headerStreak');
  const expEl = document.getElementById('headerExp');
  const notebookCountEl = document.getElementById('headerNotebookCount');
  
  if (streakEl) streakEl.innerText = userProfile.streak || 1;
  if (expEl) expEl.innerText = userProfile.exp || 0;
  if (notebookCountEl) notebookCountEl.innerText = (userProfile.savedWords || []).length;
}

function toggleSaveWord(hanzi, pinyin, meaning, hsk = 1) {
  if (!userProfile.savedWords) userProfile.savedWords = [];
  const idx = userProfile.savedWords.findIndex(w => w.hanzi === hanzi);
  let isSaved = false;
  if (idx >= 0) {
    userProfile.savedWords.splice(idx, 1);
    isSaved = false;
  } else {
    userProfile.savedWords.push({ hanzi, pinyin, meaning, hsk, addedAt: new Date().toISOString() });
    addExp(5, 'Lưu từ mới vào sổ tay');
    isSaved = true;
  }
  saveUserProfile();
  renderNotebookList();
  updateHeaderStats();
  return isSaved;
}

function isWordSaved(hanzi) {
  if (!userProfile || !userProfile.savedWords) return false;
  return userProfile.savedWords.some(w => w.hanzi === hanzi);
}

function toggleSaveWordFromLesson(hanzi, pinyin, meaning) {
  const isSaved = toggleSaveWord(hanzi, pinyin, meaning);
  const btn = document.getElementById(`btnSaveVocab-${hanzi}`);
  if (btn) {
    if (isSaved) {
      btn.className = 'p-1.5 rounded-lg bg-amber-500 text-white border-amber-500 transition-all cursor-pointer';
      btn.title = 'Đã lưu trong Sổ tay';
    } else {
      btn.className = 'p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-amber-600 border-stone-200 transition-all cursor-pointer';
      btn.title = 'Lưu vào Sổ tay';
    }
  }
}

function openNotebookModal() {
  renderNotebookList();
  const modal = document.getElementById('notebookModal');
  if (modal) modal.classList.remove('hidden');
  refreshIcons();
}

function closeNotebookModal() {
  const modal = document.getElementById('notebookModal');
  if (modal) modal.classList.add('hidden');
}

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
        <span class="font-hanzi text-2xl font-bold text-slate-900 w-10 text-center">${w.hanzi}</span>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-teal-700 font-sans">${w.pinyin}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-semibold">HSK ${w.hsk || 1}</span>
          </div>
          <p class="text-xs text-slate-600 font-medium">${w.meaning}</p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 flex-wrap">
        <div class="inline-flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
          <button onclick="playChineseTTS('${w.hanzi}', 'female')" title="Phát âm giọng Nữ" class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer">
            👩 Nữ
          </button>
          <button onclick="playChineseTTS('${w.hanzi}', 'male')" title="Phát âm giọng Nam" class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer">
            👨 Nam
          </button>
        </div>
        <button onclick="switchTab('writing'); loadWritingChar('${w.hanzi}', '${w.pinyin}', '${w.meaning}'); closeNotebookModal();" title="Luyện viết chữ này" class="p-2 rounded-xl bg-white hover:bg-rose-100 text-rose-700 border border-slate-200 transition-all">
          <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
        </button>
        <button onclick="toggleSaveWord('${w.hanzi}', '', '')" title="Xóa khỏi sổ tay" class="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-500 border border-slate-200 transition-all">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `).join('');

  refreshIcons();
}

function reviewNotebookInFlashcards() {
  const words = userProfile.savedWords || [];
  if (words.length === 0) {
    alert('Sổ tay của bạn hiện chưa có từ nào để ôn tập.');
    return;
  }
  flashcardQueue = words.map(w => ({
    title: w.hanzi,
    pinyin: w.pinyin,
    meaning: w.meaning,
    level: w.hsk || 1,
    pos: 'Từ vựng đã lưu'
  }));
  currentFlashcardIndex = 0;
  closeNotebookModal();
  switchTab('flashcards');
  renderCurrentFlashcard();
}

// Set to track rendered tabs (Lazy Loading Architecture)
const renderedTabs = new Set();

function ensureTabRendered(tabId) {
  if (renderedTabs.has(tabId)) return;
  renderedTabs.add(tabId);

  switch (tabId) {
    case 'etymology':
      if (etymologyData && etymologyData.length) {
        renderCharacterPills();
        renderEtymologyDetail(activeEtymologyIndex || 0);
      }
      break;
    case 'jiaocheng':
      renderJiaocheng();
      setupJiaochengSearch();
      break;
    case 'radicals':
      if (radicalsData && radicalsData.length > 0) {
        renderRadicals();
      } else {
        renderedTabs.delete('radicals');
        renderRadicals();
      }
      setupRadicalSearch();
      break;
    case 'writing':
      initWritingModule();
      break;
    case 'chengyu':
      renderChengyu();
      setupChengyuSearch();
      break;
    case 'readings':
      initReadingsModule();
      setupReadingSearch();
      break;
    case 'grammar':
      renderGrammarCompendium();
      setupGrammarSearch();
      renderMindmap();
      setupMindmapControls();
      setGrammarViewMode(activeGrammarViewMode || 'mindmap');
      break;
    case 'culture':
      renderCultureCards();
      setupCultureSearch();
      break;
    case 'confusions':
      renderConfusions();
      break;
    case 'translation':
      renderTranslationLessonList();
      renderTranslationStage();
      break;
    case 'aichat':
      initAiChatModule();
      break;
    case 'mockexam':
      initMockExamModule();
      break;
    case 'pathway':
      renderPathwayLessons(true);
      break;
    case 'practice':
      renderPractice();
      break;
    case 'flashcards':
      initFlashcards();
      break;
    case 'dictionary':
      if (currentDictMode === 'hsk') {
        renderDictionary(true);
      } else {
        renderTopicPills();
        renderTopicDictionary(true);
      }
      break;
  }

  const container = document.getElementById(`tab-${tabId}`);
  if (container) {
    refreshIcons(container);
  }
}

// Load Application Data (Fast First Paint + Progressive Hydration)
async function initApp() {
  try {
    loadUserProfile();
    initTtsVoices();
    updateVoiceUi();

    // 1. Fetch critical initial data first for sub-50ms instant display
    const [etymoRes, lessonsRes] = await Promise.all([
      fetch('data/etymology.json').then(r => r.json()),
      fetch('data/lessons.json').then(r => r.json())
    ]);

    etymologyData = etymoRes;
    lessonsData = lessonsRes;

    // Immediately render active view (Tab 1)
    ensureTabRendered('etymology');
    initFloatingAiAssistant();

    // 2. Load all secondary data asynchronously in background
    Promise.all([
      fetch('data/dictionary.json').then(r => r.json()).catch(() => []),
      fetch('data/mindmap.json').then(r => r.json()).catch(() => null),
      fetch('data/confusions.json').then(r => r.json()).catch(() => []),
      fetch('data/practice.json').then(r => r.json()).catch(() => []),
      fetch('data/culture.json').then(r => r.json()).catch(() => []),
      fetch('data/mock_exam.json').then(r => r.json()).catch(() => []),
      fetch('data/ai_scenarios.json').then(r => r.json()).catch(() => []),
      fetch('data/radicals.json').then(r => r.json()).catch(() => []),
      fetch('data/chengyu.json').then(r => r.json()).catch(() => []),
      fetch('data/readings.json').then(r => r.json()).catch(() => []),
      fetch('data/grammar_compendium.json').then(r => r.json()).catch(() => []),
      fetch('data/hanyu_jiaocheng.json').then(r => r.json()).catch(() => null),
      fetch('data/topics.json').then(r => r.json()).catch(() => [])
    ]).then(([dictRes, mindmapRes, confRes, practRes, cultRes, examRes, aiRes, radRes, chengRes, readRes, gramRes, jcRes, topRes]) => {
      dictionaryData = dictRes;
      mindmapData = mindmapRes;
      confusionsData = confRes;
      practiceData = practRes;
      cultureData = cultRes;
      mockExamsData = examRes;
      aiScenariosData = aiRes;
      radicalsData = radRes;
      chengyuData = chengRes;
      readingsData = readRes;
      grammarData = gramRes;
      jiaochengData = jcRes;
      topicsData = topRes || [];

      setupGlobalSearch();

      // If user switched to another tab while data was arriving, render it now
      if (activeTab && activeTab !== 'etymology') {
        renderedTabs.delete(activeTab);
        ensureTabRendered(activeTab);
      }
    });

  } catch (err) {
    console.error('Lỗi khi tải dữ liệu Học Tiếng Trung Mỗi Ngày:', err);
  }
}

// Tab Switching
function switchTab(tabId) {
  if (tabId === 'mindmap') {
    tabId = 'grammar';
    setGrammarViewMode('mindmap');
  }
  if (tabId === 'aichat') {
    openFloatingAiChat();
    return;
  }
  activeTab = tabId;
  const tabs = [
    'etymology', 'jiaocheng', 'radicals', 'writing', 'chengyu', 'readings', 'grammar',
    'culture', 'confusions', 'translation', 'mockexam',
    'pathway', 'practice', 'flashcards', 'dictionary'
  ];
  
  ensureTabRendered(tabId);

  tabs.forEach(t => {
    const section = document.getElementById(`tab-${t}`);
    const btn = document.getElementById(`tab-btn-${t}`);
    if (!section || !btn) return;
    if (t === tabId) {
      section.classList.remove('hidden');
      if (t === 'etymology') {
        btn.className = 'nav-tab active-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] text-[#FFFDF9] shadow-md shadow-red-950/20 border border-amber-300/40';
      } else if (t === 'jiaocheng') {
        btn.className = 'nav-tab active-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] text-[#FFFDF9] shadow-md shadow-red-950/20 border border-amber-300/40';
      } else if (t === 'radicals') {
        btn.className = 'nav-tab active-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#1E4D43] via-[#2A6559] to-[#C59A3F] text-[#FFFDF9] shadow-md shadow-emerald-950/20 border border-amber-300/40';
      } else if (t === 'writing') {
        btn.className = 'nav-tab active-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#8B1E1E] via-[#A82828] to-[#C59A3F] text-[#FFFDF9] shadow-md shadow-red-950/20 border border-amber-300/40';
      } else if (t === 'chengyu') {
        btn.className = 'nav-tab active-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#9B6D28] via-[#B8860B] to-[#8B1E1E] text-[#FFFDF9] shadow-md shadow-amber-950/20 border border-amber-300/40';
      } else if (t === 'readings') {
        btn.className = 'nav-tab active-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#205060] via-[#2B687D] to-[#B8860B] text-[#FFFDF9] shadow-md shadow-cyan-950/20 border border-amber-300/40';
      } else if (t === 'grammar') {
        btn.className = 'nav-tab active-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#4A306D] via-[#613D8F] to-[#C59A3F] text-[#FFFDF9] shadow-md shadow-purple-950/20 border border-amber-300/40';
      } else if (t === 'culture') {
        btn.className = 'nav-tab active-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#8B1E1E] via-[#B8860B] to-[#A52A2A] text-[#FFFDF9] shadow-md shadow-red-950/20 border border-amber-300/40';
      } else if (t === 'mockexam') {
        btn.className = 'nav-tab active-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#9B6D28] via-[#B8860B] to-[#8B1E1E] text-[#FFFDF9] shadow-md shadow-amber-950/20 border border-amber-300/40';
      } else if (t === 'aichat') {
        btn.className = 'nav-tab active-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#4A306D] via-[#613D8F] to-[#8B1E1E] text-[#FFFDF9] shadow-md shadow-purple-950/20 border border-amber-300/40';
      } else {
        btn.className = 'nav-tab active-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#8B1E1E] to-[#C59A3F] text-[#FFFDF9] shadow-md shadow-red-950/20 border border-amber-300/40';
      }
    } else {
      section.classList.add('hidden');
      btn.className = 'nav-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap text-stone-700 hover:text-[#8B1E1E] hover:bg-[#F6EFE5]';
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  const activeSection = document.getElementById(`tab-${tabId}`);
  if (activeSection) {
    refreshIcons(activeSection);
  }

  // If switched to writing tab, re-initialize or redraw writer
  if (tabId === 'writing' && !currentWriter) {
    loadWritingChar('你', 'nǐ', 'Bạn, anh, chị (ngôi thứ hai)');
  }
}

// ---------------- TAB 1: CHIẾT TỰ ----------------
function renderCharacterPills() {
  const container = document.getElementById('characterPills');
  container.innerHTML = etymologyData.map((item, index) => `
    <button 
      onclick="renderEtymologyDetail(${index})"
      id="pill-char-${index}"
      class="px-3.5 py-1.5 rounded-xl font-hanzi font-bold text-sm transition-all ${
        index === activeEtymologyIndex 
          ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-amber-100 shadow-sm border border-amber-300/40 scale-105' 
          : 'bg-[#FFFDF9] hover:bg-amber-50 text-stone-700 border border-stone-200'
      }">
      ${item.hanzi} <span class="font-sans text-xs ${index === activeEtymologyIndex ? 'text-amber-200' : 'text-stone-400'} font-normal">(${item.pinyin})</span>
    </button>
  `).join('');
}

function renderEtymologyDetail(index) {
  activeEtymologyIndex = index;
  renderCharacterPills();
  const data = etymologyData[index];
  const container = document.getElementById('activeEtymologyContainer');

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Main Character Card -->
      <div class="glass-card rounded-2xl p-6 lg:p-8 flex flex-col justify-between border-teal-100 bg-white shadow-sm">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              HSK ${data.level}
            </span>
            <span class="text-xs text-slate-500 font-medium">Số nét: <strong>${data.strokeCount}</strong></span>
          </div>

          <div class="text-center py-6">
            <h1 class="font-hanzi text-8xl font-black text-teal-950 tracking-wider mb-2">${data.hanzi}</h1>
            <div class="flex items-center justify-center gap-3">
              <span class="text-2xl font-bold text-teal-600">${data.pinyin}</span>
              <div class="flex items-center gap-1 bg-stone-100/80 p-0.5 rounded-xl border border-stone-200">
                <button onclick="playChineseTTS('${data.hanzi}', 'female')" class="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold transition-colors cursor-pointer" title="Phát âm giọng Nữ (Xiaoxiao)">
                  👩 Nữ
                </button>
                <button onclick="playChineseTTS('${data.hanzi}', 'male')" class="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold transition-colors cursor-pointer" title="Phát âm giọng Nam (Yunxi)">
                  👨 Nam
                </button>
              </div>
            </div>
            <p class="text-sm font-bold text-emerald-700 mt-2">Hán Việt: [ ${data.hanviet} ]</p>
            <p class="text-base text-slate-800 mt-2 font-medium">${data.meaning}</p>
            <div class="flex items-center justify-center gap-2 mt-4">
              <button onclick="switchTab('writing'); loadWritingChar('${data.hanzi}', '${data.pinyin}', '${(data.meaning || '').replace(/'/g, "\\'")}');" class="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all">
                <i data-lucide="pen-tool" class="w-4 h-4"></i>
                <span>Tập Viết Nét</span>
              </button>
              <button onclick="toggleSaveWord('${data.hanzi}', '${data.pinyin}', '${(data.meaning || '').replace(/'/g, "\\'")}', 1)" class="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition-all">
                <i data-lucide="bookmark" class="w-4 h-4 text-amber-600"></i>
                <span>Lưu Sổ Tay</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Common Words -->
        <div class="pt-4 border-t border-teal-100">
          <p class="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wide">Từ ghép thông dụng:</p>
          <div class="flex flex-wrap gap-2">
            ${data.commonWords.map(w => `
              <span class="px-2.5 py-1 rounded-lg bg-teal-50/80 text-xs text-teal-900 border border-teal-200 font-medium">
                ${w}
              </span>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: Radicals & Etymology Breakdown -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Radicals Decomposition Badges -->
        <div class="glass-card rounded-2xl p-6 border-teal-100 bg-white">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <i data-lucide="layers" class="w-4 h-4 text-teal-600"></i>
            <span>Bộ Thủ Cấu Thành (Phân rã nét)</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            ${data.radicals.map(r => `
              <div class="p-4 rounded-xl bg-teal-50/50 border border-teal-100 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <span class="font-hanzi text-2xl font-bold">${r.char}</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-teal-950">Bộ ${r.name}</h4>
                  <p class="text-xs text-slate-600">${r.meaning}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Mnemonic Story -->
        <div class="glass-card rounded-2xl p-6 border-teal-100 bg-gradient-to-r from-teal-50/60 via-white to-white">
          <h3 class="text-sm font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i data-lucide="lightbulb" class="w-4 h-4 text-amber-500"></i>
            <span>Câu Chuyện Chiết Tự & Nguồn Gốc</span>
          </h3>
          <p class="text-sm lg:text-base text-slate-700 leading-relaxed mb-4">
            ${data.etymologyStory}
          </p>
          <div class="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-3">
            <i data-lucide="sparkles" class="w-5 h-5 text-teal-600 flex-shrink-0"></i>
            <p class="text-xs font-semibold text-teal-900">
              <strong class="text-teal-700">Mẹo nhớ nhanh:</strong> ${data.memoryTip}
            </p>
          </div>
        </div>

        <!-- Character Family Tree -->
        <div class="glass-card rounded-2xl p-6 border-teal-100 bg-white">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <i data-lucide="git-merge" class="w-4 h-4 text-teal-600"></i>
            <span>Cây Phả Hệ Chữ Họ Hàng (Cùng Gốc)</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${data.family.map(f => `
              <div class="p-3.5 rounded-xl bg-white hover:bg-teal-50/60 border border-teal-100 transition-all flex items-center gap-3 shadow-xs">
                <span class="font-hanzi text-3xl font-black text-teal-950 w-10 text-center">${f.char}</span>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-teal-700">${f.pinyin}</span>
                  </div>
                  <p class="text-xs text-slate-600 font-medium">${f.meaning}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Sample Sentence -->
        <div class="glass-card rounded-2xl p-6 border-teal-100 bg-white">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="quote" class="w-4 h-4 text-teal-600"></i>
              <span>Ứng Dụng Trong Mẫu Câu</span>
            </h3>
            <div class="flex items-center gap-1">
              <button onclick="playChineseTTS('${data.example.hanzi}', 'female')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu mẫu giọng Nữ">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                <span>👩 Nữ</span>
              </button>
              <button onclick="playChineseTTS('${data.example.hanzi}', 'male')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu mẫu giọng Nam">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                <span>👨 Nam</span>
              </button>
            </div>
          </div>
          <div class="p-4 rounded-xl bg-teal-50/40 border border-teal-100">
            <p class="font-hanzi text-lg font-bold text-slate-900 mb-1">${data.example.hanzi}</p>
            <p class="text-xs font-semibold text-teal-700 mb-1">${data.example.pinyin}</p>
            <p class="text-xs text-slate-600">${data.example.vi}</p>
          </div>
        </div>

      </div>
    </div>
  `;
  refreshIcons();
}

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
  if (!searchInput) return;
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
          <button type="button" onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(k.hanzi)}'), 'female')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm Nữ">👩</button>
          <button type="button" onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(k.hanzi)}'), 'male')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm Nam">👨</button>
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
            <button onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(item.quote.hanzi)}'), 'female')" title="Nghe câu danh ngôn giọng Nữ" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer">
              👩 Nữ
            </button>
            <button onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(item.quote.hanzi)}'), 'male')" title="Nghe câu danh ngôn giọng Nam" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer">
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

// ---------------- TAB 2: BẢN ĐỒ CÂY TƯ DUY NGỮ PHÁP TIẾNG TRUNG ----------------

function setupMindmapControls() {
  const searchInput = document.getElementById('mindmapSearchInput');
  if (searchInput && !searchInput.dataset.initialized) {
    searchInput.dataset.initialized = 'true';
    searchInput.addEventListener('input', (e) => {
      mindmapSearchQuery = (e.target.value || '').trim().toLowerCase();
      if (mindmapSearchQuery && mindmapData && mindmapData.nodes) {
        mindmapData.nodes.forEach(node => {
          const matchTitle = (node.title || '').toLowerCase().includes(mindmapSearchQuery);
          const matchSummary = (node.summary || '').toLowerCase().includes(mindmapSearchQuery);
          const matchFormula = (node.formula || '').toLowerCase().includes(mindmapSearchQuery);
          const matchSub = (node.subtypes || []).some(s =>
            (s.name || '').toLowerCase().includes(mindmapSearchQuery) ||
            (s.formula || '').toLowerCase().includes(mindmapSearchQuery) ||
            (s.usage || '').toLowerCase().includes(mindmapSearchQuery) ||
            (s.example || '').toLowerCase().includes(mindmapSearchQuery)
          );
          if (matchTitle || matchSummary || matchFormula || matchSub) {
            expandedMindmapNodes.add(node.id);
          }
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
    nodes = nodes.filter(node => {
      const matchTitle = (node.title || '').toLowerCase().includes(mindmapSearchQuery);
      const matchSummary = (node.summary || '').toLowerCase().includes(mindmapSearchQuery);
      const matchFormula = (node.formula || '').toLowerCase().includes(mindmapSearchQuery);
      const matchSub = (node.subtypes || []).some(s =>
        (s.name || '').toLowerCase().includes(mindmapSearchQuery) ||
        (s.formula || '').toLowerCase().includes(mindmapSearchQuery) ||
        (s.usage || '').toLowerCase().includes(mindmapSearchQuery) ||
        (s.example || '').toLowerCase().includes(mindmapSearchQuery)
      );
      return matchTitle || matchSummary || matchFormula || matchSub;
    });
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
        <div onclick="toggleMindmapNode('${node.id}')" class="tree-branch-header p-5 lg:p-6 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${isExpanded ? 'border-amber-200' : 'border-transparent'}">
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
              <div class="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs font-mono font-bold text-stone-800 shadow-2xs max-w-xs truncate" title="${node.formula}">
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
              <button onclick="event.stopPropagation(); toggleMindmapNode('${node.id}');" class="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100/70 border border-amber-200/80 text-stone-700 hover:text-stone-900 font-medium transition-all shadow-2xs">
                🌱 ${sub.name.split(':')[0]}
              </button>
            `).join('')}
            <span onclick="event.stopPropagation(); toggleMindmapNode('${node.id}');" class="cursor-pointer text-[#8B1E1E] hover:underline font-bold ml-1">
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
                              onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(sub.example.split('(')[0].trim())}'), 'female')" 
                              title="Nghe giọng Nữ"
                              class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                            >
                              👩 Nữ
                            </button>
                            <button 
                              type="button"
                              onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(sub.example.split('(')[0].trim())}'), 'male')" 
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
                          onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(ex.hanzi)}'), 'female')" 
                          title="Nghe câu ví dụ giọng Nữ"
                          class="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          👩 Nữ
                        </button>
                        <button 
                          type="button"
                          onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(ex.hanzi)}'), 'male')" 
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

// ---------------- TAB 3: PHÂN BIỆT TỪ DỄ LẪN ----------------
function renderConfusions() {
  const container = document.getElementById('confusionsListContainer');

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
  const isCorrect = (selectedOptIdx === item.quiz.correct);

  item.quiz.options.forEach((opt, optIdx) => {
    const btn = document.getElementById(`quiz-btn-${itemIdx}-${optIdx}`);
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

// ---------------- TAB 4: LỘ TRÌNH HSK 3.0 ----------------
function filterPathwayLevel(level) {
  currentHskLevel = level;
  [1, 2, 3].forEach(l => {
    const btn = document.getElementById(`btn-hsk-${l}`);
    if (l === level) {
      btn.className = 'px-4 py-2 text-xs font-bold rounded-lg bg-teal-600 text-white shadow-sm transition-all';
    } else {
      btn.className = 'px-4 py-2 text-xs font-bold rounded-lg text-teal-800 hover:bg-teal-100 transition-all';
    }
  });
  renderPathwayLessons(true);
}

function renderPathwayLessons(reset = false) {
  const container = document.getElementById('pathwayLessonsContainer');
  if (reset) {
    pathwayLessonsRendered = 0;
    container.innerHTML = '';
  }

  const filtered = lessonsData.filter(item => item.level === currentHskLevel);
  const nextBatch = filtered.slice(pathwayLessonsRendered, pathwayLessonsRendered + pathwayLessonsBatch);

  nextBatch.forEach(item => {
    const card = document.createElement('div');
    card.className = 'glass-card rounded-2xl p-6 border-teal-100 bg-white shadow-sm space-y-4';
    card.innerHTML = `
      <div class="flex items-center justify-between text-xs text-slate-500">
        <span class="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 font-bold">
          HSK ${item.level} • Bài ${item.lesson}
        </span>
        <div class="inline-flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
          <button onclick="playChineseTTS('${item.hanzi}', 'female')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu mẫu giọng Nữ">
            <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
            <span>👩 Nữ</span>
          </button>
          <button onclick="playChineseTTS('${item.hanzi}', 'male')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu mẫu giọng Nam">
            <i data-lucide="volume-2" class="w-3.5 h-3.5 text-blue-600"></i>
            <span>👨 Nam</span>
          </button>
        </div>
      </div>

      <div>
        <h3 class="font-hanzi text-xl lg:text-2xl font-bold text-slate-900 mb-1 tracking-wide">${item.hanzi}</h3>
        <p class="text-sm font-bold text-teal-600 mb-1">${item.pinyin}</p>
        <p class="text-sm text-slate-700">${item.vietnamese}</p>
      </div>

      <!-- Highlighted Words in Sentence -->
      ${item.words && item.words.length ? `
        <div class="pt-3 border-t border-teal-100">
          <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Từ vựng then chốt:</p>
          <div class="flex flex-wrap gap-2">
            ${item.words.map(w => `
              <div onclick="openWordModalByTitle('${w.title}')" class="cursor-pointer px-2.5 py-1 rounded-lg bg-teal-50/70 hover:bg-teal-100 border border-teal-200 text-xs transition-colors">
                <span class="font-hanzi font-bold text-teal-950">${w.title}</span>
                <span class="text-teal-700">(${w.pinyin})</span>:
                <span class="text-slate-600">${w.meaning}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Grammar Explanation -->
      ${item.explanation ? `
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
          ${item.explanation}
        </div>
      ` : ''}
    `;
    container.appendChild(card);
  });

  pathwayLessonsRendered += nextBatch.length;
  const loadMoreBtn = document.getElementById('loadMoreLessonsBtn');
  if (pathwayLessonsRendered >= filtered.length) {
    loadMoreBtn.classList.add('hidden');
  } else {
    loadMoreBtn.classList.remove('hidden');
  }

  refreshIcons();
}

function loadMoreLessons() {
  renderPathwayLessons(false);
}

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
  const start = input.selectionStart || input.value.length;
  const end = input.selectionEnd || input.value.length;
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
    alert('Vui lòng nhập câu dịch của bạn trước khi chấm điểm!');
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
              onclick="insertTransWord('${w.title}')" 
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
            class="w-full p-4 text-base font-hanzi rounded-2xl bg-slate-50/80 border border-teal-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-inner transition-all leading-relaxed">${evalResult && evalResult.userText ? evalResult.userText : ''}</textarea>
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
                ${evalResult.userText ? `<p class="text-xs text-slate-600">Bài làm của bạn: <strong class="font-hanzi text-slate-900">"${evalResult.userText}"</strong></p>` : ''}
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
                <button onclick="playChineseTTS('${q.hanzi}', 'female')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-850 border border-rose-200 text-xs font-bold transition-colors cursor-pointer" title="Nghe giọng Nữ">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
                  <span>👩 Nữ</span>
                </button>
                <button onclick="playChineseTTS('${q.hanzi}', 'male')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-850 border border-teal-200 text-xs font-bold transition-colors cursor-pointer" title="Nghe giọng Nam">
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
                            <button onclick="playChineseTTS('${w.title}', 'female')" class="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200 cursor-pointer" title="Giọng Nữ">👩</button>
                            <button onclick="playChineseTTS('${w.title}', 'male')" class="p-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-bold border border-teal-200 cursor-pointer" title="Giọng Nam">👨</button>
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
    alert('Vui lòng ghép đầy đủ các mảnh từ trước khi kiểm tra!');
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
    alert("Trình duyệt hiện tại chưa hỗ trợ Web Speech API nhận diện giọng nói tiếng Trung. Bạn có thể sử dụng Google Chrome hoặc Microsoft Edge để trải nghiệm tính năng này.");
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
        statusEl.innerHTML = `<span class="text-amber-700 text-xs font-semibold">Ghi âm gián đoạn (${event.error}). Vui lòng nghe lại câu mẫu và nhấn nút thử lại nhé!</span>`;
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
    console.error("Speech recognition error:", err);
    alert("Không thể khởi động ghi âm: " + err.message);
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
            <button onclick="playChineseTTS('${q.audioText.replace(/'/g, "\\'").replace(/\n/g, ' ')}', 'female')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer" title="Nghe audio mẫu giọng Nữ">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
              <span>👩 Nữ</span>
            </button>
            <button onclick="playChineseTTS('${q.audioText.replace(/'/g, "\\'").replace(/\n/g, ' ')}', 'male')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer" title="Nghe audio mẫu giọng Nam">
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
                <button onclick="playChineseTTS('${(q.audioText || q.targetText).replace(/'/g, "\\'").replace(/\n/g, ' ')}', 'female')" class="px-3 py-2 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer" title="Nghe mẫu giọng Nữ">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
                  <span>1. 👩 Mẫu Nữ</span>
                </button>
                <button onclick="playChineseTTS('${(q.audioText || q.targetText).replace(/'/g, "\\'").replace(/\n/g, ' ')}', 'male')" class="px-3 py-2 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer" title="Nghe mẫu giọng Nam">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5 text-blue-600"></i>
                  <span>1. 👨 Mẫu Nam</span>
                </button>
              </div>
              <button id="speech-btn-${q.id}" onclick="startPracticeSpeechRecognition('${q.id}', '${(q.targetText || q.audioText).replace(/'/g, "\\'")}')" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
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
              ${answer.spokenText ? `<p class="text-stone-700">Giọng bạn nói nhận diện được: <strong class="font-hanzi text-sm text-stone-900">${answer.spokenText}</strong></p>` : ''}
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
                ${!isAnswered ? `onclick="removePracticeWordTile('${q.id}', ${wIdx})"` : ''} 
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
                      onclick="addPracticeWordTile('${q.id}', '${w.replace(/'/g, "\\'")}')" 
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
                onclick="submitPracticeReorder('${q.id}')" 
                class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-90 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="check" class="w-4 h-4"></i>
                <span>Kiểm Tra Đáp Án</span>
              </button>
              <button 
                onclick="clearPracticeReorder('${q.id}')" 
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
                  <button onclick="playChineseTTS('${q.hanzi.replace(/'/g, "\\'")}', 'female')" class="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer" title="Nghe câu chuẩn giọng Nữ">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
                    <span>👩 Nữ</span>
                  </button>
                  <button onclick="playChineseTTS('${q.hanzi.replace(/'/g, "\\'")}', 'male')" class="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer" title="Nghe câu chuẩn giọng Nam">
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
                <button onclick="playChineseTTS('${(q.audioText || q.passageText).replace(/'/g, "\\'").replace(/\n/g, ' ')}', 'female')" class="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer" title="Phát bài nghe giọng Nữ">
                  <i data-lucide="play" class="w-3.5 h-3.5 fill-current text-rose-600"></i>
                  <span>👩 Nghe Nữ</span>
                </button>
                <button onclick="playChineseTTS('${(q.audioText || q.passageText).replace(/'/g, "\\'").replace(/\n/g, ' ')}', 'male')" class="px-3 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer" title="Phát bài nghe giọng Nam">
                  <i data-lucide="play" class="w-3.5 h-3.5 fill-current text-sky-600"></i>
                  <span>👨 Nghe Nam</span>
                </button>
              </div>
              <button onclick="togglePracticeListeningReveal('${q.id}')" class="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold border border-stone-200 transition-all cursor-pointer">
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
                onclick="selectPracticeChoice('${q.id}', ${optIdx})" 
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

// ---------------- TAB 5: FLASHCARD SPURRED REPETITION ----------------
function initFlashcards() {
  flashcardQueue = [...dictionaryData];
  // Shuffle flashcardQueue
  flashcardQueue.sort(() => Math.random() - 0.5);
  currentFlashcardIndex = 0;
  updateFlashcardUI();
}

let currentFlashcard = null;

function updateFlashcardUI() {
  if (!flashcardQueue.length) return;
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

  // Update Progress
  document.getElementById('fcMasteredCount').innerText = masteredWords.size;
  document.getElementById('fcTotalCount').innerText = flashcardQueue.length;
  const percent = Math.round((masteredWords.size / flashcardQueue.length) * 100);
  document.getElementById('fcProgressBar').style.width = `${percent}%`;

  refreshIcons();
}

function flipFlashcard() {
  const inner = document.getElementById('flashcardInner');
  isCardFlipped = !isCardFlipped;
  if (isCardFlipped) {
    inner.classList.add('rotate-y-180');
  } else {
    inner.classList.remove('rotate-y-180');
  }
}

function markFlashcard(mastered) {
  if (mastered) {
    masteredWords.add(currentFlashcard.title);
  }
  currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcardQueue.length;
  updateFlashcardUI();
}

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
    const q = currentDictSearch.toLowerCase().trim();
    list = list.filter(item => 
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.pinyin && item.pinyin.toLowerCase().includes(q)) ||
      (item.meaning && item.meaning.toLowerCase().includes(q)) ||
      (item.exampleSentence && item.exampleSentence.toLowerCase().includes(q))
    );
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
            ${item.pos || 'từ vựng'}
          </span>
        </div>

        <div class="flex items-center justify-between gap-2">
          <h4 class="font-hanzi text-3xl font-black text-stone-900 tracking-wide">${item.title}</h4>
          <div class="flex items-center gap-1">
            <button onclick="toggleSaveWord('${item.title}', '${item.pinyin}', '${(item.meaning || '').replace(/'/g, "\\'")}', ${item.level})" title="Lưu vào Sổ tay Flashcard" class="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer">
              <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="switchTab('writing'); loadWritingChar('${item.title[0]}', '${item.pinyin}', '${(item.meaning || '').replace(/'/g, "\\'")}');" title="Tập viết nét chữ này" class="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors cursor-pointer">
              <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
            </button>
            <div class="flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
              <button onclick="playChineseTTS('${item.title}', 'female')" title="Nghe phát âm giọng Nữ (Xiaoxiao)" class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-colors cursor-pointer">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS('${item.title}', 'male')" title="Nghe phát âm giọng Nam (Yunxi)" class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-colors cursor-pointer">
                👨 Nam
              </button>
            </div>
          </div>
        </div>

        <p class="text-xs font-bold text-[#8B1E1E] mt-1.5 tracking-wide">${item.pinyin}</p>
        <p class="text-xs font-medium text-stone-800 mt-1 leading-snug">${item.meaning}</p>
      </div>

      ${item.exampleSentence ? `
        <div class="mt-4 pt-3 border-t border-amber-200/60 text-xs space-y-1 bg-[#FAF7F2]/60 p-2.5 rounded-xl">
          <div class="flex items-start justify-between gap-1.5">
            <p class="font-hanzi text-stone-900 font-bold text-xs leading-relaxed">${item.exampleSentence}</p>
            <div class="flex items-center gap-1 shrink-0">
              <button onclick="playChineseTTS('${item.exampleSentence.replace(/'/g, "\\'").replace(/\n/g, ' ')}', 'female')" class="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nữ">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS('${item.exampleSentence.replace(/'/g, "\\'").replace(/\n/g, ' ')}', 'male')" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nam">
                👨 Nam
              </button>
            </div>
          </div>
          ${item.examplePinyin ? `<p class="text-[11px] font-bold text-[#8B1E1E]">${item.examplePinyin}</p>` : ''}
          ${item.exampleMeaning ? `<p class="text-[11px] text-stone-600 italic leading-snug">${item.exampleMeaning}</p>` : ''}
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
function switchDictMode(mode) {
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
      topicBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-700 to-[#1E4D43] text-white shadow-md cursor-pointer border border-emerald-800';
    }
    if (hskBtn) {
      hskBtn.className = 'py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 transition-all cursor-pointer';
    }
    renderTopicPills();
    if (topicDictRendered === 0) {
      renderTopicDictionary(true);
    }
  }
  refreshIcons();
}

function renderTopicPills() {
  const container = document.getElementById('topicFilterPills');
  if (!container) return;

  const totalWords = dictionaryData ? dictionaryData.length : 0;
  
  let html = `
    <button onclick="filterDictTopic('all')" id="btn-topic-all" class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${currentDictTopic === 'all' ? 'bg-gradient-to-r from-emerald-700 to-[#1E4D43] text-white shadow-sm border border-emerald-800' : 'bg-white hover:bg-emerald-50 text-stone-700 border border-stone-200'}">
      <span>🌟 Tất Cả 14 Chủ Đề</span>
      <span class="text-[10px] px-1.5 py-0.2 rounded-full ${currentDictTopic === 'all' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600 font-semibold'}">${totalWords}</span>
    </button>
  `;

  const fallbackTopics = [
    { id: 'food', name: 'Ẩm Thực & Đồ Ăn', icon: '🍜' },
    { id: 'family', name: 'Gia Đình & Xưng Hô', icon: '👨‍👩‍👧‍👦' },
    { id: 'travel', name: 'Du Lịch & Khách Sạn', icon: '✈️' },
    { id: 'work', name: 'Công Sở & Kinh Doanh', icon: '💼' },
    { id: 'education', name: 'Giáo Dục & Trường Học', icon: '🎓' },
    { id: 'shopping', name: 'Mua Sắm & Thời Trang', icon: '🛍️' },
    { id: 'health', name: 'Sức Khỏe & Y Tế', icon: '🏥' },
    { id: 'daily', name: 'Đời Sống & Nhà Cửa', icon: '🏠' },
    { id: 'traffic', name: 'Giao Thông & Đi Lại', icon: '🚗' },
    { id: 'tech', name: 'Công Nghệ & Kỹ Thuật Số', icon: '📱' },
    { id: 'weather', name: 'Thời Tiết & Thiên Nhiên', icon: '🌦️' },
    { id: 'emotions', name: 'Cảm Xúc & Tâm Lý', icon: '💬' },
    { id: 'appearance', name: 'Tính Cách & Ngoại Hình', icon: '🎨' },
    { id: 'society', name: 'Giao Tiếp & Xã Hội', icon: '🌐' }
  ];

  const topicsList = (topicsData && topicsData.length > 0) ? topicsData : fallbackTopics;

  topicsList.forEach(t => {
    const isSelected = currentDictTopic === t.id;
    const count = t.count || (dictionaryData ? dictionaryData.filter(w => w.topicId === t.id).length : 0);
    html += `
      <button onclick="filterDictTopic('${t.id}')" id="btn-topic-${t.id}" class="px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${isSelected ? 'bg-gradient-to-r from-emerald-700 to-[#1E4D43] text-white shadow-sm border border-emerald-800' : 'bg-white hover:bg-emerald-50 text-stone-700 border border-stone-200'}">
        <span>${t.icon || '🏷️'}</span>
        <span>${t.name}</span>
        <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600 font-semibold'}">${count}</span>
      </button>
    `;
  });

  container.innerHTML = html;
}

function filterDictTopic(topicId) {
  currentDictTopic = topicId;
  renderTopicPills();

  const label = document.getElementById('activeTopicLabel');
  if (label) {
    if (topicId === 'all') {
      label.innerText = '🌟 Tất Cả 14 Chủ Đề';
      label.className = 'text-xs font-bold text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg border border-emerald-200';
    } else {
      const found = (topicsData || []).find(t => t.id === topicId);
      const name = found ? `${found.icon} ${found.name}` : `Chủ đề: ${topicId}`;
      label.innerText = name;
      label.className = 'text-xs font-bold text-emerald-950 bg-emerald-200/90 px-2.5 py-0.5 rounded-lg border border-emerald-300';
    }
  }

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

function getFilteredTopicDictionaryList() {
  if (!dictionaryData || !Array.isArray(dictionaryData)) return [];
  let list = dictionaryData;

  if (currentDictTopic !== 'all') {
    list = list.filter(item => item.topicId === currentDictTopic);
  }

  if (currentTopicSearch && currentTopicSearch.trim()) {
    const q = currentTopicSearch.toLowerCase().trim();
    list = list.filter(item => 
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.pinyin && item.pinyin.toLowerCase().includes(q)) ||
      (item.meaning && item.meaning.toLowerCase().includes(q)) ||
      (item.topicName && item.topicName.toLowerCase().includes(q)) ||
      (item.exampleSentence && item.exampleSentence.toLowerCase().includes(q))
    );
  }
  return list;
}

function renderTopicDictionary(reset = false) {
  const container = document.getElementById('topicGridContainer');
  if (!container) return;

  const totalLabel = document.getElementById('topicTotalCountLabel');
  const filteredLabel = document.getElementById('topicFilteredCount');
  const filteredList = getFilteredTopicDictionaryList();

  if (totalLabel) totalLabel.innerText = `${dictionaryData.length.toLocaleString()}`;
  if (filteredLabel) filteredLabel.innerText = `${filteredList.length.toLocaleString()}`;

  if (reset) {
    topicDictRendered = 0;
    container.innerHTML = '';
  }

  if (filteredList.length === 0) {
    container.innerHTML = `
      <div class="col-span-full glass-card rounded-2xl p-10 text-center text-stone-500 border border-emerald-200 bg-white shadow-xs space-y-2">
        <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800">Không tìm thấy từ vựng nào trong chủ đề này.</p>
        <p class="text-xs text-stone-500">Hãy thử nhập từ khóa khác hoặc bấm chọn "🌟 Tất Cả 14 Chủ Đề".</p>
      </div>
    `;
    const loadMoreBtn = document.getElementById('loadMoreTopicBtn');
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    return;
  }

  const nextBatch = filteredList.slice(topicDictRendered, topicDictRendered + topicDictBatch);

  // Level badge styling map
  const levelBadgeStyles = {
    1: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    2: 'bg-teal-100 text-teal-900 border-teal-300',
    3: 'bg-sky-100 text-sky-900 border-sky-300',
    4: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    5: 'bg-purple-100 text-purple-900 border-purple-300',
    6: 'bg-rose-100 text-rose-900 border-rose-300'
  };

  nextBatch.forEach(item => {
    const card = document.createElement('div');
    const badgeStyle = levelBadgeStyles[item.level] || 'bg-amber-100 text-amber-900 border-amber-200';

    card.className = 'glass-card rounded-2xl p-5 border border-emerald-200/80 bg-white flex flex-col justify-between hover:border-emerald-600 transition-all shadow-xs hover:shadow-md';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between text-xs text-stone-500 mb-2.5 gap-1.5 flex-wrap">
          <div class="flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1">
              <span>${item.topicIcon || '🏷️'}</span>
              <span>${item.topicName || 'Chủ đề'}</span>
            </span>
            <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold border ${badgeStyle}">
              HSK ${item.level}
            </span>
          </div>
          <span class="text-[11px] text-stone-500 font-medium px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
            ${item.pos || 'từ vựng'}
          </span>
        </div>

        <div class="flex items-center justify-between gap-2">
          <h4 class="font-hanzi text-3xl font-black text-stone-900 tracking-wide">${item.title}</h4>
          <div class="flex items-center gap-1">
            <button onclick="toggleSaveWord('${item.title}', '${item.pinyin}', '${(item.meaning || '').replace(/'/g, "\\'")}', ${item.level})" title="Lưu vào Sổ tay Flashcard" class="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer">
              <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="switchTab('writing'); loadWritingChar('${item.title[0]}', '${item.pinyin}', '${(item.meaning || '').replace(/'/g, "\\'")}');" title="Tập viết nét chữ này" class="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors cursor-pointer">
              <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
            </button>
            <div class="flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
              <button onclick="playChineseTTS('${item.title}', 'female')" title="Nghe phát âm giọng Nữ (Xiaoxiao)" class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-colors cursor-pointer">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS('${item.title}', 'male')" title="Nghe phát âm giọng Nam (Yunxi)" class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-colors cursor-pointer">
                👨 Nam
              </button>
            </div>
          </div>
        </div>

        <p class="text-xs font-bold text-emerald-800 mt-1.5 tracking-wide">${item.pinyin}</p>
        <p class="text-xs font-medium text-stone-800 mt-1 leading-snug">${item.meaning}</p>
      </div>

      ${item.exampleSentence ? `
        <div class="mt-4 pt-3 border-t border-emerald-200/60 text-xs space-y-1 bg-[#FAF7F2]/60 p-2.5 rounded-xl">
          <div class="flex items-start justify-between gap-1.5">
            <p class="font-hanzi text-stone-900 font-bold text-xs leading-relaxed">${item.exampleSentence}</p>
            <div class="flex items-center gap-1 shrink-0">
              <button onclick="playChineseTTS('${item.exampleSentence.replace(/'/g, "\\'").replace(/\n/g, ' ')}', 'female')" class="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nữ">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS('${item.exampleSentence.replace(/'/g, "\\'").replace(/\n/g, ' ')}', 'male')" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nam">
                👨 Nam
              </button>
            </div>
          </div>
          ${item.examplePinyin ? `<p class="text-[11px] font-bold text-emerald-800">${item.examplePinyin}</p>` : ''}
          ${item.exampleMeaning ? `<p class="text-[11px] text-stone-600 italic leading-snug">${item.exampleMeaning}</p>` : ''}
        </div>
      ` : ''}
    `;
    container.appendChild(card);
  });

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

// ---------------- GLOBAL SEARCH ----------------
function setupGlobalSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  const dropdown = document.getElementById('searchDropdown');
  const clearBtn = document.getElementById('clearSearchBtn');

  searchInput.addEventListener('input', debounce((e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      dropdown.classList.add('hidden');
      clearBtn.classList.add('hidden');
      return;
    }
    clearBtn.classList.remove('hidden');

    const matches = (dictionaryData || []).filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.pinyin.toLowerCase().includes(q) ||
      item.meaning.toLowerCase().includes(q)
    ).slice(0, 8);

    if (!matches.length) {
      dropdown.innerHTML = `
        <div class="p-4 text-center text-xs text-slate-500">
          Không tìm thấy từ vựng khớp với "${q}".
        </div>
      `;
      dropdown.classList.remove('hidden');
      return;
    }

    dropdown.innerHTML = matches.map(m => `
      <div onclick="selectSearchResult('${m.title}')" class="p-2.5 rounded-lg hover:bg-teal-50 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-50 last:border-none">
        <div class="flex items-center gap-3">
          <span class="font-hanzi text-xl font-bold text-teal-950">${m.title}</span>
          <div>
            <span class="text-xs font-bold text-teal-600">${m.pinyin}</span>
            <span class="text-xs text-slate-600 block truncate max-w-[200px]">${m.meaning}</span>
          </div>
        </div>
        <span class="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
          HSK ${m.level}
        </span>
      </div>
    `).join('');
    dropdown.classList.remove('hidden');
  }, 100));

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

function clearSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  searchInput.value = '';
  document.getElementById('searchDropdown').classList.add('hidden');
  document.getElementById('clearSearchBtn').classList.add('hidden');
  searchInput.focus();
}

function selectSearchResult(title) {
  document.getElementById('searchDropdown').classList.add('hidden');
  openWordModalByTitle(title);
}

// ---------------- WORD DETAIL MODAL ----------------
function openWordModalByTitle(title) {
  const word = dictionaryData.find(w => w.title === title);
  if (!word) return;

  document.getElementById('modalHanzi').innerText = word.title;
  document.getElementById('modalPinyin').innerText = word.pinyin;
  document.getElementById('modalPos').innerText = word.pos || 'từ vựng';
  document.getElementById('modalMeaning').innerText = word.meaning;
  document.getElementById('modalExampleHanzi').innerText = word.exampleSentence || word.title;
  document.getElementById('modalExamplePinyin').innerText = word.examplePinyin || word.pinyin;
  document.getElementById('modalExampleVi').innerText = word.exampleMeaning || word.meaning;

  document.getElementById('wordModal').classList.remove('hidden');
  refreshIcons();
}

function closeWordModal() {
  document.getElementById('wordModal').classList.add('hidden');
}

// ---------------- TELEGRAM INTEGRATION ----------------
function openTelegramModal() {
  document.getElementById('telegramModal').classList.remove('hidden');
  refreshIcons();
}

function closeTelegramModal() {
  document.getElementById('telegramModal').classList.add('hidden');
}

async function submitTelegramLink() {
  const chatId = document.getElementById('tgChatIdInput').value.trim();
  const botToken = document.getElementById('tgBotTokenInput').value.trim();
  const statusMsg = document.getElementById('tgStatusMsg');
  const submitBtn = document.getElementById('tgSubmitBtn');

  if (!chatId || !botToken) {
    statusMsg.className = 'p-3 rounded-xl text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200';
    statusMsg.innerText = 'Vui lòng nhập đầy đủ Telegram Chat ID và Bot Token!';
    statusMsg.classList.remove('hidden');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Đang gửi link vào Telegram...</span>';

  const currentUrl = window.location.href;
  const messageText = `🏮 *HỌC TIẾNG TRUNG MỖI NGÀY - 多学一门外语, 多看一个世界, 多过一种人生*\n\n` +
    `Chào bạn! Cổng học tiếng Trung Mỗi Ngày (每日中文) phong cách Sang trọng phương Đông kết hợp trọn vẹn 16 phân hệ học thuật & văn hóa:\n\n` +
    `🔗 *Link truy cập:* ${currentUrl}\n\n` +
    `🎨 *Giao diện mới:* Sắc Đỏ Chu Sa, Hoàng Kim Cung Đình & Ngọc Phỉ Thúy trên nền Giấy Xuyến cổ kính, kết hợp Ấn Triện Chu Sa hoàng gia.\n\n` +
    `🏮 *Phân Hệ Mới - Văn Hóa, Truyền Thống & Lịch Sử:* \n` +
    `• 👑 *Triều Đại Lịch Sử:* Tần (thống nhất chữ viết), Hán (khởi nguồn Hán tộc & Con đường tơ lụa), Đường (thời kỳ hoàng kim thi ca), Tống - Minh - Thanh (Cố Cung & Tứ khố toàn thư).\n` +
    `• 🏮 *Lễ Hội & Phong Tục Cổ Truyền:* Tết Nguyên Đán, Tết Nguyên Tiêu, Tết Đoan Ngọ & Tết Trung Thu.\n` +
    `• 📜 *Danh Tác & Phát Minh:* Tứ Đại Danh Tác & Tứ Đại Phát Minh làm thay đổi thế giới.\n` +
    `• 🍵 *Tinh Hoa Nghệ Thuật:* Trà Đạo Trung Hoa, Kinh Kịch & Nghệ thuật Thư Pháp.\n` +
    `• 🔊 *Tích hợp phát âm giọng chuẩn:* Nghe từ vựng then chốt & thi từ danh ngôn kinh điển.\n\n` +
    `🌟 *Cùng các tính năng học thuật cốt lõi:* Luyện Dịch HiHSK Pro, Luyện Tập HSK 1-5, Chiết Tự Cây Phả Hệ, Bản Đồ Tư Duy Ngữ Pháp, Ma Trận 16 Cặp Từ Dễ Nhầm.\n\n` +
    `Chúc bạn luôn tìm thấy niềm hứng khởi mỗi ngày khi khám phá tiếng Trung cùng Học Tiếng Trung Mỗi Ngày!`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown'
      })
    });

    const resData = await response.json();
    if (resData.ok) {
      statusMsg.className = 'p-3 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200';
      statusMsg.innerText = '🎉 Đã gửi thành công link cập nhật vào Telegram của bạn!';
      statusMsg.classList.remove('hidden');
    } else {
      throw new Error(resData.description || 'Lỗi gửi tin nhắn Telegram');
    }
  } catch (err) {
    statusMsg.className = 'p-3 rounded-xl text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200';
    statusMsg.innerText = `Có lỗi xảy ra: ${err.message}`;
    statusMsg.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i><span>Gửi Link Ngay Lập Tức</span>';
    refreshIcons();
  }
}

// ==========================================
// MODULE: LUYỆN VIẾT NÉT CHỮ HÁN TƯƠNG TÁC (HANZIWRITER)
// ==========================================
function initWritingModule() {
  renderWritingQuickPick();
  loadWritingChar('你', 'nǐ', 'Bạn, anh, chị (ngôi thứ hai)');
}

function renderWritingQuickPick() {
  const container = document.getElementById('writingQuickPickContainer');
  if (!container) return;

  const quickChars = [
    { char: '你', pinyin: 'nǐ', meaning: 'Bạn, anh, chị' },
    { char: '好', pinyin: 'hǎo', meaning: 'Tốt, đẹp, hay' },
    { char: '我', pinyin: 'wǒ', meaning: 'Tôi, bản thân' },
    { char: '爱', pinyin: 'ài', meaning: 'Yêu thương' },
    { char: '学', pinyin: 'xué', meaning: 'Học tập' },
    { char: '国', pinyin: 'guó', meaning: 'Đất nước' },
    { char: '中', pinyin: 'zhōng', meaning: 'Ở giữa, trung tâm' },
    { char: '龙', pinyin: 'lóng', meaning: 'Rồng, Long' },
    { char: '福', pinyin: 'fú', meaning: 'Phúc lành, may mắn' },
    { char: '家', pinyin: 'jiā', meaning: 'Gia đình, nhà' },
    { char: '水', pinyin: 'shuǐ', meaning: 'Nước, thủy' },
    { char: '火', pinyin: 'huǒ', meaning: 'Lửa, hỏa' },
    { char: '山', pinyin: 'shān', meaning: 'Núi, sơn' },
    { char: '木', pinyin: 'mù', meaning: 'Cây, mộc' },
    { char: '月', pinyin: 'yuè', meaning: 'Trăng, nguyệt' },
    { char: '日', pinyin: 'rì', meaning: 'Mặt trời, nhật' }
  ];

  container.innerHTML = quickChars.map(item => `
    <button 
      onclick="loadWritingChar('${item.char}', '${item.pinyin}', '${item.meaning}')"
      class="px-3 py-1.5 rounded-xl font-hanzi font-bold text-base transition-all bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-300">
      ${item.char}
    </button>
  `).join('');
}

function loadWritingChar(char, pinyin, meaning) {
  currentWritingChar = char;
  isWritingQuizActive = false;

  const pinyinEl = document.getElementById('writingCharPinyin');
  const meaningEl = document.getElementById('writingCharMeaning');
  const badgeEl = document.getElementById('writingStatusBadge');
  const feedbackEl = document.getElementById('writingFeedbackMsg');

  if (pinyinEl) pinyinEl.innerText = pinyin || '';
  if (meaningEl) meaningEl.innerText = meaning || '';
  if (badgeEl) {
    badgeEl.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200';
    badgeEl.innerText = 'Chế độ: Xem nét';
  }
  if (feedbackEl) {
    feedbackEl.className = 'w-full mt-4 p-3 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-xs text-center font-medium';
    feedbackEl.innerHTML = `💡 Đang tải chữ <strong>${char}</strong>. Bấm <strong>"Xem Hoạt Họa Nét"</strong> hoặc <strong>"Tự Luyện Viết"</strong>!`;
  }

  const target = document.getElementById('hanziWriterTarget');
  if (!target) return;
  target.innerHTML = '';

  if (typeof HanziWriter === 'undefined') {
    target.innerHTML = `<span class="font-hanzi text-8xl font-black text-rose-800">${char}</span>`;
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
  }, 300);
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
        feedbackEl.innerHTML = `🎉 XUẤT SẮC! Bạn đã viết hoàn chỉnh chữ "${currentWritingChar}" (+10 EXP ⭐)!`;
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
    alert('Vui lòng nhập 1 chữ Hán để luyện viết!');
    return;
  }
  const char = val[0];
  loadWritingChar(char, '', 'Chữ tự chọn');
}

// ==========================================
// MODULE: TRỢ LÝ AI HỘI THOẠI & SỬA BÀI (AI TUTOR)
// ==========================================
function initAiChatModule() {
  renderAiScenarios();
  if (aiScenariosData && aiScenariosData.length > 0) {
    selectAiScenario(aiScenariosData[0].id);
  }
}

function renderAiScenarios() {
  const container = document.getElementById('aiScenariosContainer');
  if (!container || !aiScenariosData) return;

  container.innerHTML = aiScenariosData.map((sc, idx) => `
    <button 
      onclick="selectAiScenario('${sc.id}')"
      id="btn-scenario-${sc.id}"
      class="w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
        activeAiScenario && activeAiScenario.id === sc.id
          ? 'bg-violet-50 border-violet-300 text-violet-900 shadow-2xs'
          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
      }">
      <div>
        <h4 class="text-xs font-bold">${sc.title}</h4>
        <p class="text-[10px] text-slate-400 mt-0.5">${sc.role}</p>
      </div>
      <span class="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-bold">${sc.level}</span>
    </button>
  `).join('');
}

function selectAiScenario(scenarioId) {
  const sc = (aiScenariosData || []).find(s => s.id === scenarioId);
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
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
            🤖
          </div>
          <div class="p-3.5 rounded-2xl rounded-tl-xs bg-white border border-violet-100 shadow-2xs space-y-1">
            <div class="flex items-center justify-between gap-3">
              <span class="font-hanzi text-base font-bold text-slate-900 leading-snug">${msg.hanzi}</span>
              <div class="inline-flex items-center gap-0.5 shrink-0">
                <button onclick="playChineseTTS('${msg.hanzi}', 'female')" title="Nghe giọng Nữ" class="p-1 rounded text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer">👩</button>
                <button onclick="playChineseTTS('${msg.hanzi}', 'male')" title="Nghe giọng Nam" class="p-1 rounded text-indigo-600 hover:bg-indigo-50 text-xs font-bold cursor-pointer">👨</button>
              </div>
            </div>
            ${msg.pinyin ? `<p class="text-xs text-violet-700 font-medium">${msg.pinyin}</p>` : ''}
            ${msg.vi ? `<p class="text-xs text-slate-500 pt-1 border-t border-slate-100">➔ ${msg.vi}</p>` : ''}
            <span class="block text-[10px] text-slate-400 text-right">${msg.timestamp}</span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="flex items-start justify-end gap-3 max-w-[85%] ml-auto">
          <div class="p-3.5 rounded-2xl rounded-tr-xs bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs space-y-1">
            <span class="font-hanzi text-base font-bold">${msg.hanzi}</span>
            ${msg.feedback ? `<p class="text-xs text-violet-200 border-t border-violet-500/40 pt-1 mt-1">💡 Nhận xét AI: ${msg.feedback}</p>` : ''}
            <span class="block text-[10px] text-violet-200 text-right">${msg.timestamp}</span>
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
    <span class="text-[11px] text-slate-400 font-semibold shrink-0">Gợi ý trả lời:</span>
    ${replies.map(r => `
      <button 
        onclick="applyAiSuggestedReply('${r.hanzi}')"
        class="shrink-0 px-3 py-1 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 text-xs font-medium transition-all">
        ${r.hanzi}
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

  // Add Exp
  addExp(5, 'Đối thoại với AI');

  // Simulate intelligent contextual AI reply
  setTimeout(() => {
    let replyHanzi = '你的中文说得很好！继续加油！';
    let replyPinyin = 'Nǐ de zhōngwén shuō de hěn hǎo! Jìxù jiāyóu!';
    let replyVi = 'Tiếng Trung của bạn nói rất hay! Cố gắng tiếp tục nhé!';

    if (activeAiScenario && activeAiScenario.id === 'scenario_greeting') {
      replyHanzi = '认识你真是太好了！你平时喜欢学习中文吗？';
      replyPinyin = 'Rènshi nǐ zhēn shì tài hǎo le! Nǐ píngshí xǐhuan xuéxí zhōngwén ma?';
      replyVi = 'Rất vui được quen bạn! Bình thường bạn có thích học tiếng Trung không?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_restaurant') {
      replyHanzi = '好的！一份宫保鸡丁，两碗米饭，还要别的喝的吗？比如青岛啤酒或茉莉花茶？';
      replyPinyin = 'Hǎo de! Yí fèn Gōngbǎo Jīdīng, liǎng wǎn mǐfàn, hái yào bié de hē de ma? Bǐrú Qīngdǎo píjiǔ huò mòlìhuā chá?';
      replyVi = 'Vâng ạ! Một phần gà Cung Bảo, 2 bát cơm, quý khách có muốn dùng thêm đồ uống gì như bia Thanh Đảo hay trà hoa nhài không?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_shopping') {
      replyHanzi = '哎呀，帅哥/美女真会砍价！看在是老朋友的份上，120块钱拿走，怎么样？';
      replyPinyin = 'Āiyā, shuàigē/měinǚ zhēn huì kǎnjià! Kàn zài shì lǎo péngyou de fèn shang, 120 kuài qián ná zǒu, zěnmeyàng?';
      replyVi = 'Ái chà, bạn mặc cả giỏi quá! Nể tình khách quen, 120 tệ bạn mang về, thấy thế nào?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_interview') {
      replyHanzi = '很好。你的背景非常符合我们的要求。请问如果遇到工作压力，你通常如何解决？';
      replyPinyin = 'Hěn hǎo. Nǐ de bèijǐng fēicháng fúhé wǒmen de yāoqiú. Qǐngwèn rúguǒ yùdào gōngzuò yālì, nǐ tōngcháng rúhé jiějué?';
      replyVi = 'Rất tốt. Nền tảng của bạn rất phù hợp với yêu cầu của chúng tôi. Xin hỏi nếu gặp áp lực công việc, bạn thường giải quyết thế nào?';
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
  }, 800);
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
    alert('Vui lòng nhập câu tiếng Trung để phân tích!');
    return;
  }

  resultContainer.classList.remove('hidden');
  resultContainer.innerHTML = `
    <div class="flex items-center gap-2 text-teal-800 font-bold">
      <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>
      <span>Đánh Giá Của Bác Sĩ Ngữ Pháp:</span>
    </div>
    <p class="font-hanzi font-bold text-slate-900 mt-1">Câu gốc: ${text}</p>
    <div class="space-y-1 pt-2 border-t border-teal-100">
      <p class="text-teal-900 font-semibold">🔍 Phân tích trật tự câu:</p>
      <p class="text-slate-600">Cấu trúc câu hợp lý theo chuẩn: Chủ ngữ + Động từ + Tân ngữ.</p>
      <p class="text-teal-900 font-semibold mt-1">💡 Đề xuất cách diễn đạt tự nhiên hơn:</p>
      <p class="text-emerald-700 font-hanzi font-bold">👉 "${text.replace('买一本', '去买一本')}"</p>
      <p class="text-[11px] text-slate-500 italic">Mẹo: Trong khẩu ngữ hàng ngày, người Trung Quốc thường kết hợp trợ từ "了" hoặc phó từ chỉ thời gian để câu nói sinh động hơn.</p>
    </div>
  `;
  addExp(5, 'Sử dụng Bác Sĩ Ngữ Pháp');
  refreshIcons();
}

// ==========================================
// MODULE: TRỢ LÝ DỊCH AI NỔI (FLOATING AI ASSISTANT CHAT WIDGET)
// ==========================================
let floatingAiMode = 'translate'; // 'translate', 'chat', 'grammar'
let floatingAiMessages = [
  {
    sender: 'ai',
    hanzi: '你好！我是你的AI翻译与口语助教 🤖🎧',
    pinyin: 'Nǐ hǎo! Wǒ shì nǐ de AI fānyì yǔ kǒuyǔ zhùjiào.',
    vi: 'Xin chào! Mình là Trợ lý Dịch AI & Khẩu Ngữ. Bạn có thể nhập bất kỳ câu tiếng Việt nào để dịch sang tiếng Trung, dán câu tiếng Trung cần tra cứu, hoặc luyện đàm thoại cùng mình nhé!',
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
    if (tooltip) tooltip.classList.add('hidden');
    if (badge) badge.classList.add('hidden');
    
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
  const modes = ['translate', 'chat', 'grammar'];
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
    if (mode === 'translate') {
      input.placeholder = 'Nhập câu tiếng Việt ➔ Dịch sang tiếng Trung (hoặc ngược lại)...';
    } else if (mode === 'chat') {
      input.placeholder = 'Nhập câu trò chuyện bằng tiếng Trung hoặc tiếng Việt...';
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
  if (floatingAiMode === 'translate') {
    chips = [
      'Dịch: Hôm nay bạn ăn cơm chưa?',
      'Dịch: Tôi muốn học tiếng Trung',
      'Dịch: Chiều mai bạn có rảnh không?',
      'Dịch: Táo này bao nhiêu tiền một cân?'
    ];
  } else if (floatingAiMode === 'chat') {
    chips = [
      '你好！你叫什么名字？',
      '今天北京天气怎么样？',
      '你觉得学习中文难吗？',
      '请推荐一道好吃的中国菜'
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
        onclick="applyFloatingAiChip('${encodeURIComponent(c)}')" 
        class="px-2.5 py-0.8 rounded-full bg-amber-50 hover:bg-amber-100 text-stone-700 border border-amber-200 text-2xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
      >
        ${c}
      </button>
    `).join('')}
  `;
}

function applyFloatingAiChip(encodedChip) {
  const chip = decodeURIComponent(encodedChip);
  const input = document.getElementById('floatingAiInput');
  if (input) {
    let cleanText = chip;
    if (chip.startsWith('Dịch: ')) cleanText = chip.replace('Dịch: ', '');
    else if (chip.startsWith('Sửa lỗi: ')) cleanText = chip.replace('Sửa lỗi: ', '');
    input.value = cleanText;
    sendFloatingAiMessage();
  }
}

function clearFloatingAiChat() {
  floatingAiMessages = [
    {
      sender: 'ai',
      hanzi: 'Đã làm mới cuộc hội thoại! Hãy hỏi mình bất kỳ điều gì nhé! 🤖',
      pinyin: '',
      vi: '',
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
            <p class="font-sans leading-relaxed text-xs break-words">${msg.text || msg.hanzi}</p>
            <span class="block text-[10px] text-amber-200/80 text-right font-mono">${msg.timestamp}</span>
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
              src="images/ai_robot_avatar.png" 
              onerror="this.src='images/robot_3d_avatar.svg'" 
              alt="Robot 3D" 
              class="w-full h-full object-cover" 
            />
          </div>

          <div class="p-3.5 rounded-2xl rounded-tl-xs bg-white border border-amber-200/90 shadow-2xs space-y-2 flex-1">
            <!-- Main Content -->
            <div>
              ${msg.hanzi ? `
                <div class="flex items-start justify-between gap-2">
                  <span class="font-hanzi text-base font-bold text-stone-900 leading-snug break-words">
                    ${msg.hanzi}
                  </span>
                  ${hasChinese ? `
                    <div class="inline-flex items-center gap-0.5 shrink-0 bg-stone-100/90 p-0.5 rounded-lg border border-stone-200">
                      <button 
                        type="button"
                        onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(msg.hanzi)}'), 'female')" 
                        title="Nghe giọng Nữ" 
                        class="p-1 rounded hover:bg-rose-50 text-rose-800 transition-colors cursor-pointer text-2xs font-bold"
                      >
                        👩
                      </button>
                      <button 
                        type="button"
                        onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(msg.hanzi)}'), 'male')" 
                        title="Nghe giọng Nam" 
                        class="p-1 rounded hover:bg-blue-50 text-blue-800 transition-colors cursor-pointer text-2xs font-bold"
                      >
                        👨
                      </button>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              ${msg.pinyin ? `
                <p class="text-2xs font-semibold text-[#8B1E1E] mt-0.5">${msg.pinyin}</p>
              ` : ''}

              ${msg.vi ? `
                <p class="text-xs text-stone-700 mt-1.5 pt-1.5 border-t border-amber-100 leading-relaxed">
                  <span class="font-bold text-[#8B1E1E]">Dịch nghĩa:</span> ${msg.vi}
                </p>
              ` : (msg.text ? `
                <p class="text-xs text-stone-700 leading-relaxed break-words">${msg.text}</p>
              ` : '')}
            </div>

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
                      onclick="openWordModalWithToken('${v.word || v.hanzi}', '${v.pinyin || ''}', '${v.vi || ''}')"
                      class="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-stone-800 border border-amber-200/80 text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <span class="font-hanzi font-bold text-[#8B1E1E]">${v.word || v.hanzi}</span>
                      <span class="text-stone-400">(${v.pinyin})</span>
                      <span class="text-stone-600">: ${v.vi}</span>
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
                <p>${msg.grammarTips}</p>
              </div>
            ` : ''}

            <span class="block text-[10px] text-stone-400 text-right font-mono">${msg.timestamp}</span>
          </div>
        </div>
      `;
    }
  }).join('');

  scrollFloatingAiMessagesToBottom();
  refreshIcons();
}

async function sendFloatingAiMessage() {
  const input = document.getElementById('floatingAiInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add User Message
  floatingAiMessages.push({
    sender: 'user',
    text: text,
    timestamp: now
  });

  // Add Loading Message Placeholder
  const loadingId = 'loading_' + Date.now();
  floatingAiMessages.push({
    id: loadingId,
    sender: 'ai',
    hanzi: '',
    text: '🤖 Robot AI đang dịch và phân tích ngữ pháp...',
    timestamp: now
  });
  renderFloatingAiMessages();

  addExp(5, 'Trò chuyện cùng Trợ Lý Dịch AI');

  try {
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, mode: floatingAiMode })
    });
    const data = await res.json();

    // Remove loading placeholder
    floatingAiMessages = floatingAiMessages.filter(m => m.id !== loadingId);

    if (data && data.ok) {
      let replyHanzi = '';
      let replyPinyin = data.pinyin || '';
      let replyVi = '';
      let grammarTips = '';

      if (data.isChineseTarget) {
        // Source was Vietnamese/English, Translated is Chinese
        replyHanzi = data.translated;
        replyVi = text;
      } else {
        // Source was Chinese, Translated is Vietnamese
        replyHanzi = text;
        replyVi = data.translated;
      }

      // Add grammar hints if grammar mode or special pattern
      if (floatingAiMode === 'grammar' || text.includes('把') || text.includes('被') || text.includes('比') || text.includes('了')) {
        grammarTips = `• Điểm lưu ý: Câu có cấu trúc biểu đạt tự nhiên. Hãy chú ý trật tự từ và trợ từ để câu văn chuẩn văn phong bản ngữ nhất.`;
      }

      floatingAiMessages.push({
        sender: 'ai',
        hanzi: replyHanzi,
        pinyin: replyPinyin,
        vi: replyVi,
        vocab: data.vocab || [],
        grammarTips: grammarTips,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      renderFloatingAiMessages();

      // Automatically play TTS if translated to Chinese
      if (replyHanzi && /[\u4e00-\u9fa5]/.test(replyHanzi)) {
        playChineseTTS(replyHanzi);
      }
    } else {
      floatingAiMessages.push({
        sender: 'ai',
        text: 'Xin lỗi bạn, robot AI gặp chút trục trặc khi kết nối máy chủ dịch thuật. Bạn thử lại nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      renderFloatingAiMessages();
    }
  } catch (err) {
    console.warn('AI Chat API fallback:', err);
    // Remove loading placeholder
    floatingAiMessages = floatingAiMessages.filter(m => m.id !== loadingId);

    // Smart Local Fallback
    const isChinese = /[\u4e00-\u9fa5]/.test(text);
    floatingAiMessages.push({
      sender: 'ai',
      hanzi: isChinese ? text : `学好中文，走遍天下都不怕！`,
      pinyin: isChinese ? '' : `Xué hǎo zhōngwén, zǒu biàn tiānxià dōu bú pà!`,
      vi: isChinese ? `Đã ghi nhận câu tiếng Trung của bạn.` : `Học tốt tiếng Trung, đi khắp thiên hạ đều chẳng ngại! (Dịch câu: ${text})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    renderFloatingAiMessages();
  }
}

function startFloatingAiSpeechInput() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    showToast('Trình duyệt không hỗ trợ nhận diện giọng nói!');
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

// ==========================================
// MODULE: THI THỬ HSK MÔ PHỎNG (MOCK EXAM)
// ==========================================
function initMockExamModule() {
  switchMockExamLevel(1);
}

function switchMockExamLevel(level) {
  currentExamLevel = level;
  const buttons = [1, 2, 3, 4, 5];
  buttons.forEach(lvl => {
    const btn = document.getElementById(`btn-exam-lvl-${lvl}`);
    if (!btn) return;
    if (lvl === level) {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap';
    } else {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap';
    }
  });

  activeExam = (mockExamsData || []).find(e => e.level === level) || (mockExamsData[0] || null);
  examUserAnswers = {};
  renderMockExam();
  startExamTimer(activeExam ? activeExam.durationMinutes : 15);
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
      alert('Hết giờ làm bài! Hệ thống sẽ tự động nộp bài và chấm điểm.');
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
    display.className = 'text-2xl font-black text-amber-900 font-mono tracking-wider';
  }
}

function renderMockExam() {
  const container = document.getElementById('mockExamQuestionsContainer');
  if (!container || !activeExam) return;

  const questions = activeExam.questions || [];
  container.innerHTML = questions.map((q, idx) => {
    const userAns = examUserAnswers[q.id];

    let contentHtml = '';
    if (q.audioText) {
      contentHtml += `
        <div class="flex items-center gap-2 mb-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
          <div class="inline-flex items-center gap-1 bg-white/90 p-0.5 rounded-xl border border-amber-300 shadow-2xs">
            <button onclick="playChineseTTS('${q.audioText}', 'female')" class="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-850 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer" title="Nghe câu hỏi giọng Nữ">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
              <span>👩 Nghe Nữ</span>
            </button>
            <button onclick="playChineseTTS('${q.audioText}', 'male')" class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer" title="Nghe câu hỏi giọng Nam">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
              <span>👨 Nghe Nam</span>
            </button>
          </div>
          <span class="text-xs text-amber-800 font-medium">Bấm để nghe audio bản ngữ</span>
        </div>
      `;
    }

    if (q.statement) {
      contentHtml += `
        <p class="text-sm font-semibold text-slate-800 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          Nhận định: "${q.statement}"
        </p>
      `;
    }

    if (q.words && q.correctOrder) {
      // Reorder question in exam
      const selected = examUserAnswers[q.id] || [];
      const unselected = q.words.filter(w => !selected.includes(w));
      contentHtml += `
        <div class="space-y-3">
          <div class="min-h-[48px] p-3 rounded-xl bg-slate-50 border-2 border-dashed border-amber-300 flex flex-wrap gap-2 items-center">
            ${selected.length === 0 ? '<span class="text-xs text-slate-400">Bấm chọn các từ bên dưới theo thứ tự câu đúng:</span>' : ''}
            ${selected.map((w, sIdx) => `
              <button onclick="removeExamReorderWord('${q.id}', ${sIdx})" class="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-hanzi font-bold text-sm shadow-xs flex items-center gap-1">
                <span>${w}</span>
                <span class="text-xs text-amber-200">×</span>
              </button>
            `).join('')}
          </div>
          <div class="flex flex-wrap gap-2">
            ${unselected.map(w => `
              <button onclick="addExamReorderWord('${q.id}', '${w}')" class="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-slate-800 border border-slate-200 font-hanzi font-bold text-sm shadow-2xs">
                ${w}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    } else if (q.options) {
      // Multiple choice
      contentHtml += `
        <div class="grid grid-cols-1 gap-2.5">
          ${q.options.map(opt => `
            <button 
              onclick="selectExamAnswer('${q.id}', '${opt.key}')"
              class="w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                userAns === opt.key
                  ? 'bg-amber-100/70 border-amber-400 text-amber-950 font-bold shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }">
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                userAns === opt.key ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
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
      <div class="glass-card rounded-2xl p-6 border-slate-200 bg-white shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <span class="text-xs font-bold text-amber-800">${q.section}</span>
          <span class="text-xs font-bold text-slate-400">Câu ${idx + 1} / ${questions.length}</span>
        </div>
        <h4 class="text-sm font-bold text-slate-900 leading-snug">${q.prompt}</h4>
        ${contentHtml}
      </div>
    `;
  }).join('');

  refreshIcons();
}

function selectExamAnswer(questionId, optionKey) {
  examUserAnswers[questionId] = optionKey;
  renderMockExam();
}

function addExamReorderWord(qId, word) {
  if (!examUserAnswers[qId]) examUserAnswers[qId] = [];
  examUserAnswers[qId].push(word);
  renderMockExam();
}

function removeExamReorderWord(qId, idx) {
  if (examUserAnswers[qId]) {
    examUserAnswers[qId].splice(idx, 1);
    renderMockExam();
  }
}

function submitMockExam() {
  if (!activeExam) return;
  if (examTimerInterval) clearInterval(examTimerInterval);

  let correctCount = 0;
  const questions = activeExam.questions || [];
  const breakdownList = [];

  questions.forEach((q, idx) => {
    let isCorrect = false;
    let userAnsText = '';
    let correctAnsText = '';

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

    if (isCorrect) correctCount++;

    breakdownList.push({
      index: idx + 1,
      prompt: q.prompt,
      isCorrect,
      userAnsText,
      correctAnsText,
      explanation: q.explanation
    });
  });

  const scorePerQuestion = Math.round(activeExam.totalScore / questions.length);
  const totalScoreAchieved = correctCount * scorePerQuestion;
  const isPassed = totalScoreAchieved >= activeExam.passScore;

  // Add Exp
  addExp(isPassed ? 50 : 20, 'Hoàn thành đề thi thử HSK');

  // Show Modal
  const modal = document.getElementById('examResultModal');
  const emojiEl = document.getElementById('examResultEmoji');
  const titleEl = document.getElementById('examResultTitle');
  const subtitleEl = document.getElementById('examResultSubtitle');
  const scoreEl = document.getElementById('examScoreValue');
  const maxScoreEl = document.getElementById('examMaxScoreValue');
  const badgeEl = document.getElementById('examResultBadge');
  const breakdownContainer = document.getElementById('examAnswerBreakdown');

  if (scoreEl) scoreEl.innerText = totalScoreAchieved;
  if (maxScoreEl) maxScoreEl.innerText = `/ ${activeExam.totalScore}`;

  if (isPassed) {
    if (emojiEl) emojiEl.innerText = '🎉';
    if (titleEl) titleEl.innerText = 'Chúc Mừng Bạn Đã Đỗ Kỳ Thi!';
    if (subtitleEl) subtitleEl.innerText = `Bạn đã đạt ${correctCount}/${questions.length} câu đúng (+50 EXP ⭐)`;
    if (badgeEl) {
      badgeEl.className = 'mt-2 px-4 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300';
      badgeEl.innerText = 'ĐẠT TIÊU CHUẨN ĐỖ (合格)';
    }
  } else {
    if (emojiEl) emojiEl.innerText = '💪';
    if (titleEl) titleEl.innerText = 'Chưa Đạt Điểm Chuẩn!';
    if (subtitleEl) subtitleEl.innerText = `Bạn đạt ${correctCount}/${questions.length} câu đúng. Hãy ôn luyện thêm nhé (+20 EXP ⭐)`;
    if (badgeEl) {
      badgeEl.className = 'mt-2 px-4 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300';
      badgeEl.innerText = `CHƯA ĐẠT (Điểm liệt: ${activeExam.passScore})`;
    }
  }

  if (breakdownContainer) {
    breakdownContainer.innerHTML = breakdownList.map(item => `
      <div class="p-3.5 rounded-xl border ${item.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'} space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-bold ${item.isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
            Câu ${item.index}: ${item.isCorrect ? '✅ Đúng' : '❌ Sai'}
          </span>
        </div>
        <p class="text-slate-800 font-semibold">${item.prompt}</p>
        <p class="text-slate-600">Câu trả lời của bạn: <strong class="${item.isCorrect ? 'text-emerald-700' : 'text-rose-700'}">${item.userAnsText}</strong></p>
        ${!item.isCorrect ? `<p class="text-emerald-700">Đáp án chuẩn: <strong>${item.correctAnsText}</strong></p>` : ''}
        <p class="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">💡 ${item.explanation}</p>
      </div>
    `).join('');
  }

  if (modal) modal.classList.remove('hidden');
}

function closeExamResultModal() {
  const modal = document.getElementById('examResultModal');
  if (modal) modal.classList.add('hidden');
}

// =========================================================================
// 1. TOKEN LOOKUP MODAL (REUSE WORDMODAL)
// =========================================================================
function openWordModalWithToken(hanzi, pinyin, vi) {
  if (!hanzi) return;
  // Try dictionary first for rich data
  const dictMatch = dictionaryData.find(w => w.title === hanzi);
  if (dictMatch) {
    openWordModalByTitle(dictMatch.title);
    return;
  }
  
  // Set values into existing wordModal
  const mHanzi = document.getElementById('modalHanzi');
  const mPinyin = document.getElementById('modalPinyin');
  const mPos = document.getElementById('modalPos');
  const mMeaning = document.getElementById('modalMeaning');
  const mExHanzi = document.getElementById('modalExampleHanzi');
  const mExPinyin = document.getElementById('modalExamplePinyin');
  const mExVi = document.getElementById('modalExampleVi');

  if (mHanzi) mHanzi.innerText = hanzi;
  if (mPinyin) mPinyin.innerText = pinyin || '';
  if (mPos) mPos.innerText = 'Từ Vựng Bài Đọc';
  if (mMeaning) mMeaning.innerText = vi || 'Chưa có chú giải';
  if (mExHanzi) mExHanzi.innerText = hanzi;
  if (mExPinyin) mExPinyin.innerText = pinyin || '';
  if (mExVi) mExVi.innerText = vi || '';

  const modal = document.getElementById('wordModal');
  if (modal) modal.classList.remove('hidden');
  refreshIcons();
}

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
  if (!input) return;
  if (!input._hasListener) {
    input._hasListener = true;
    input.addEventListener('input', debounce((e) => {
      radicalSearchQuery = e.target.value.trim().toLowerCase();
      renderRadicals();
    }, 120));
  }
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
    const escapedMeaning = meaning.replace(/'/g, "\\'");

    return `
      <div class="glass-card rounded-2xl p-4 border border-amber-200/80 hover:border-amber-400 transition-all space-y-3 relative overflow-hidden bg-[#FFFDF9] shadow-xs">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
              <span class="font-hanzi text-3xl font-black text-[#8B1E1E]">${char}</span>
            </div>
            <div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-sm font-bold text-amber-900">${pinyin}</span>
                <div class="inline-flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-lg border border-stone-200 shadow-2xs">
                  <button onclick="playChineseTTS('${char}', 'female')" class="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-800 text-[10px] font-bold cursor-pointer transition-colors" title="Phát âm giọng Nữ (Xiaoxiao)">
                    👩 Nữ
                  </button>
                  <button onclick="playChineseTTS('${char}', 'male')" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-800 text-[10px] font-bold cursor-pointer transition-colors" title="Phát âm giọng Nam (Yunxi)">
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
                  <span class="font-hanzi font-bold text-[#8B1E1E] text-xs">${ex}</span>
                  <div class="flex items-center gap-0.5">
                    <button type="button" onclick="playChineseTTS('${ex}', 'female')" class="text-[9px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm ${ex} giọng Nữ">👩</button>
                    <button type="button" onclick="playChineseTTS('${ex}', 'male')" class="text-[9px] hover:scale-125 transition-transform cursor-pointer" title="Phát âm ${ex} giọng Nam">👨</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
          <button onclick="loadWritingChar('${char}', '${pinyin}', 'Bộ thủ: ${hanviet} (${escapedMeaning})'); switchTab('writing');" class="text-[#8B1E1E] hover:text-[#A52A2A] font-bold flex items-center gap-1 transition-colors">
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

// =========================================================================
// 3. KHO ĐIỂN TÍCH THÀNH NGỮ 4 CHỮ (CHENGYU)
// =========================================================================
function filterChengyuCategory(cat) {
  activeChengyuCategory = cat;
  const categories = ['all', 'wisdom', 'diligence', 'history'];
  categories.forEach(c => {
    const el = document.getElementById(`btn-chengyu-${c}`);
    if (!el) return;
    if (c === cat) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-600 text-white shadow-2xs transition-all whitespace-nowrap';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-slate-700 border border-slate-200 transition-all whitespace-nowrap';
    }
  });
  renderChengyu();
}

function setupChengyuSearch() {
  const input = document.getElementById('chengyuSearchInput');
  if (!input) return;
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
            <h3 class="font-hanzi text-3xl font-black text-slate-900 tracking-wide">${item.chengyu}</h3>
            <div class="inline-flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
              <button onclick="playChineseTTS('${item.chengyu}', 'female')" class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-colors cursor-pointer" title="Phát âm thành ngữ giọng Nữ">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS('${item.chengyu}', 'male')" class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-colors cursor-pointer" title="Phát âm thành ngữ giọng Nam">
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
              <button onclick="playChineseTTS('${item.example.hanzi.replace(/'/g, "\\'")}', 'female')" class="text-rose-700 hover:text-rose-900 flex items-center gap-1 font-bold text-[11px] px-1.5 py-0.5 rounded bg-white border border-rose-200 cursor-pointer" title="Nghe ví dụ giọng Nữ">
                <i data-lucide="volume-2" class="w-3 h-3 text-rose-600"></i>
                <span>👩 Nữ</span>
              </button>
              <button onclick="playChineseTTS('${item.example.hanzi.replace(/'/g, "\\'")}', 'male')" class="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-bold text-[11px] px-1.5 py-0.5 rounded bg-white border border-teal-200 cursor-pointer" title="Nghe ví dụ giọng Nam">
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
        <button onclick="saveWordToNotebook({ title: '${item.chengyu}', pinyin: '${item.pinyin}', meaning: '${item.figurative.replace(/'/g, "\\'")}', hsk: 'HSK 5-6', example: '${item.example ? item.example.hanzi.replace(/'/g, "\\'") : ''}' })" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors">
          <i data-lucide="bookmark" class="w-3.5 h-3.5 text-amber-600"></i>
          <span>Lưu Thành Ngữ</span>
        </button>
        <button onclick="loadWritingChar('${item.chengyu[0]}', '', 'Thành ngữ: ${item.chengyu}'); switchTab('writing');" class="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors">
          <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
          <span>Tập viết chữ đầu (${item.chengyu[0]})</span>
        </button>
      </div>
    </div>
  `).join('');

  refreshIcons();
}

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
        onclick="selectReading('${story.id}')"
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
  const modal = document.getElementById('readingTocModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  renderReadingTocList();
  refreshIcons();
}

function closeReadingTocModal() {
  const modal = document.getElementById('readingTocModal');
  if (!modal) return;
  modal.classList.add('hidden');
}

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
        Không tìm thấy bài đọc nào phù hợp với từ khóa "${tocModalSearchQuery}".
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
        onclick="selectReading('${story.id}'); closeReadingTocModal();"
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
                onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(story.title)}'), 'female')" 
                class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all shadow-2xs cursor-pointer" 
                title="Nghe tiêu đề (Giọng Nữ)"
              >
                👩 Nữ
              </button>
              <button 
                type="button"
                onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(story.title)}'), 'male')" 
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
                onclick="openWordModalWithToken('${v.hanzi}', '${v.pinyin}', '${v.vi}')" 
                class="p-2.5 rounded-xl bg-white border border-amber-200/80 hover:border-[#8B1E1E] hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div class="flex items-center justify-between">
                    <p class="font-hanzi text-base font-bold text-stone-900 leading-tight">${v.hanzi}</p>
                    <div class="flex items-center gap-0.5" onclick="event.stopPropagation()">
                      <button 
                        type="button" 
                        onclick="playChineseTTS('${v.hanzi}', 'female')" 
                        class="px-1 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 text-[9px] font-bold cursor-pointer"
                        title="Giọng Nữ"
                      >👩</button>
                      <button 
                        type="button" 
                        onclick="playChineseTTS('${v.hanzi}', 'male')" 
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
                  onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(p.chineseText)}'), 'female')" 
                  class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-2xs font-bold transition-colors shadow-2xs cursor-pointer" 
                  title="Nghe đoạn này bằng giọng Nữ (Xiaoxiao)"
                >
                  <i data-lucide="volume-2" class="w-3 h-3 text-rose-600"></i>
                  <span>👩 Nữ</span>
                </button>
                <button 
                  type="button"
                  onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(p.chineseText)}'), 'male')" 
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
                    onclick="openWordModalWithToken('${token.hanzi}', '${token.pinyin}', '${token.vi}')" 
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
                  onclick="handleReadingQuizAnswer('${story.id}', ${optIdx})" 
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
    renderMindmap();
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
  if (tabGrammar) refreshIcons(tabGrammar);
}

function filterGrammarCategory(cat) {
  activeGrammarCategory = cat;
  const categories = ['all', 'comparison', 'ba_bei', 'complements', 'particles_adverbs', 'fixed_connectors'];
  categories.forEach(c => {
    const el = document.getElementById(`btn-grammar-${c}`);
    if (!el) return;
    if (c === cat) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-2xs transition-all whitespace-nowrap';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200 transition-all whitespace-nowrap';
    }
  });
  renderGrammarCompendium();
}

function setupGrammarSearch() {
  const input = document.getElementById('grammarSearchInput');
  if (!input) return;
  input.addEventListener('input', debounce((e) => {
    grammarSearchQuery = e.target.value.trim().toLowerCase();
    renderGrammarCompendium();
  }, 120));
}

function renderGrammarCompendium() {
  const container = document.getElementById('grammarGridContainer');
  if (!container) return;

  let filtered = grammarData;
  if (activeGrammarCategory !== 'all') {
    filtered = filtered.filter(item => item.category === activeGrammarCategory);
  }

  if (grammarSearchQuery) {
    filtered = filtered.filter(item => {
      const examplesText = (item.examples || []).map(e => `${e.hanzi} ${e.pinyin} ${e.vi}`).join(' ');
      const rulesText = (item.rules || []).join(' ');
      const target = `${item.title} ${item.formula} ${item.explanation} ${item.mistakes} ${examplesText} ${rulesText}`.toLowerCase();
      return target.includes(grammarSearchQuery);
    });
  }

  const badgeEl = document.getElementById('grammarCountBadge');
  if (badgeEl) {
    badgeEl.innerText = `${filtered.length} / ${grammarData.length} Chuyên Đề`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400">
        <i data-lucide="compass" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>
        <p class="font-bold text-slate-600">Không tìm thấy chủ điểm ngữ pháp phù hợp</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="glass-card rounded-2xl p-6 border border-indigo-200/80 hover:border-indigo-400 transition-all space-y-4 relative overflow-hidden bg-white/95 shadow-xs">
      <!-- Card Header -->
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200 inline-block mb-1.5">
            ${item.level} • ${item.categoryName}
          </span>
          <h3 class="text-base lg:text-lg font-black text-slate-900 tracking-tight">${item.title}</h3>
        </div>
      </div>

      <!-- Formula Pill Banner -->
      <div class="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80">
        <span class="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">CÔNG THỨC CHUẨN:</span>
        <code class="font-mono font-bold text-xs lg:text-sm text-indigo-950 block">${item.formula}</code>
      </div>

      <!-- Explanation -->
      <p class="text-xs text-slate-700 leading-relaxed">
        ${item.explanation}
      </p>

      <!-- Rules List -->
      ${item.rules && item.rules.length > 0 ? `
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Quy tắc ứng dụng:</span>
          <ul class="space-y-1.5">
            ${item.rules.map(rule => `
              <li class="flex items-start gap-2 text-slate-700">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5"></i>
                <span>${rule}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Common Mistakes Box -->
      ${item.mistakes ? `
        <div class="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-1">
          <span class="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">⚠️ Lỗi kinh điển người Việt hay mắc:</span>
          <p class="font-medium">${item.mistakes}</p>
        </div>
      ` : ''}

      <!-- Example Sentences -->
      ${item.examples && item.examples.length > 0 ? `
        <div class="space-y-2.5 pt-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ví dụ minh họa:</span>
          ${item.examples.map(ex => `
            <div class="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-hanzi font-bold text-slate-900 text-sm">${ex.hanzi}</span>
                <div class="inline-flex items-center gap-0.5">
                  <button onclick="playChineseTTS('${ex.hanzi.replace(/'/g, "\\'")}', 'female')" class="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe giọng Nữ">👩 Nữ</button>
                  <button onclick="playChineseTTS('${ex.hanzi.replace(/'/g, "\\'")}', 'male')" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe giọng Nam">👨 Nam</button>
                </div>
              </div>
              <p class="text-indigo-700 font-sans text-[11px]">${ex.pinyin}</p>
              <p class="text-slate-600">${ex.vi}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');

  refreshIcons();
}

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
  if (!input) return;
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
    const safeTitle = (lesson.titleHanzi || '').replace(/'/g, "\\'");
    const firstDialogue = lesson.dialogues && lesson.dialogues[0] ? lesson.dialogues[0] : null;
    const safeDialogue = firstDialogue ? firstDialogue.hanzi.replace(/'/g, "\\'") : '';
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
            <div class="cursor-pointer group/title flex-1" onclick="openLessonDetailModal('${lesson.id}')" title="Bấm vào đây để mở chi tiết toàn bộ bài học">
              <div class="flex items-baseline gap-2 flex-wrap">
                <h3 class="text-xl font-bold font-hanzi text-stone-900 group-hover/title:text-[#8B1E1E] transition-colors tracking-wide">${lesson.titleHanzi}</h3>
                <span class="text-xs font-semibold text-[#8B1E1E]">${lesson.titlePinyin}</span>
              </div>
              <p class="text-xs font-medium text-stone-600 mt-0.5 group-hover/title:text-stone-900 transition-colors">"${lesson.titleMeaning}"</p>
            </div>
            <div class="inline-flex items-center gap-0.5 bg-amber-50/80 p-0.5 rounded-xl border border-amber-200 shrink-0 shadow-2xs">
              <button 
                onclick="playChineseTTS('${safeTitle}', 'female')" 
                class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer" 
                title="Phát âm tên bài học (Giọng Nữ)">
                👩 Nữ
              </button>
              <button 
                onclick="playChineseTTS('${safeTitle}', 'male')" 
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
                  <button onclick="playChineseTTS('${safeDialogue}', 'female')" class="text-rose-700 hover:text-rose-900 font-bold text-[10px] px-1 py-0.5 rounded bg-white border border-rose-200 cursor-pointer" title="Nghe giọng Nữ">👩</button>
                  <button onclick="playChineseTTS('${safeDialogue}', 'male')" class="text-blue-700 hover:text-blue-900 font-bold text-[10px] px-1 py-0.5 rounded bg-white border border-blue-200 cursor-pointer" title="Nghe giọng Nam">👨</button>
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
            onclick="openLessonDetailModal('${lesson.id}')"
            class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <i data-lucide="book-open" class="w-4 h-4"></i>
            <span>Xem Chi Tiết Toàn Bộ Bài Học</span>
          </button>
          
          <div class="flex items-center justify-between text-xs pt-1">
            <button 
              onclick="quickSearchFromLesson('${lesson.titleHanzi}')" 
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
    if (!jiaochengData || !jiaochengData.lessons) {
      const res = await fetch('data/hanyu_jiaocheng.json');
      jiaochengData = await res.json();
    }
    const lesson = jiaochengData && jiaochengData.lessons ? jiaochengData.lessons.find(l => l.id === lessonId) : null;
    if (!lesson) {
      console.warn('Không tìm thấy bài học:', lessonId);
      return;
    }

    currentActiveLesson = lesson;
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
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      const contentArea = document.getElementById('lessonModalContentArea');
      if (contentArea) contentArea.scrollTop = 0;
      refreshIcons(modal);
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
  const modal = document.getElementById('lessonDetailModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

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
    const safeText = d.hanzi.replace(/'/g, "\\'");
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
            onclick="playChineseTTS('${safeText}', 'female')" 
            class="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${isFemale ? 'bg-rose-100 text-rose-900 ring-1 ring-rose-300 font-black' : 'bg-white text-stone-600 hover:text-rose-700'}"
            title="Nghe giọng Nữ (Xiaoxiao Bắc Kinh)${isFemale ? ' • Giọng gốc nhân vật' : ''}">
            <span>👩 Nữ</span>
            ${isFemale ? '<span class="text-[9px] bg-rose-200/90 text-rose-800 px-1 rounded font-black tracking-tight">Gốc</span>' : ''}
          </button>
          <button 
            onclick="playChineseTTS('${safeText}', 'male')" 
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
          <button onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(narrative.titleHanzi)}'), 'female')" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer" title="Phát âm tiêu đề giọng Nữ">
            👩 Nữ
          </button>
          <button onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(narrative.titleHanzi)}'), 'male')" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer" title="Phát âm tiêu đề giọng Nam">
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
        const safeH = tok.hanzi.replace(/'/g, "\\'");
        const safeP = (tok.pinyin || '').replace(/'/g, "\\'");
        const safeV = (tok.vi || '').replace(/'/g, "\\'");
        html += `
          <div 
            onclick="openWordModalWithToken('${safeH}', '${safeP}', '${safeV}')" 
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
                  <button type="button" onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(qa.qHanzi)}'), 'female')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Nghe câu hỏi giọng Nữ">👩</button>
                  <button type="button" onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(qa.qHanzi)}'), 'male')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Nghe câu hỏi giọng Nam">👨</button>
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
                <button type="button" onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(qa.aHanzi)}'), 'female')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Nghe đáp án giọng Nữ">👩</button>
                <button type="button" onclick="playChineseTTS(decodeURIComponent('${encodeURIComponent(qa.aHanzi)}'), 'male')" class="text-[10px] hover:scale-125 transition-transform cursor-pointer" title="Nghe đáp án giọng Nam">👨</button>
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
    const safeHanzi = v.hanzi.replace(/'/g, "\\'");
    const safeMeaning = (v.meaning || '').replace(/'/g, "\\'");
    const safeExample = (v.example || '').replace(/'/g, "\\'");
    const isSaved = isWordSaved(v.hanzi);

    return `
      <div class="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-all space-y-2.5 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-baseline gap-2 flex-wrap">
              <span class="font-hanzi text-2xl font-black text-stone-900 tracking-wide">${v.hanzi}</span>
              <span class="text-xs font-bold text-[#8B1E1E]">${v.pinyin}</span>
              ${v.sinoViet ? `<span class="text-[11px] font-semibold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md">Hán-Việt: ${v.sinoViet}</span>` : ''}
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <div class="flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
                <button 
                  onclick="playChineseTTS('${safeHanzi}', 'female')" 
                  class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 transition-all text-xs font-bold cursor-pointer"
                  title="Nghe từ này (Giọng Nữ)">
                  👩 Nữ
                </button>
                <button 
                  onclick="playChineseTTS('${safeHanzi}', 'male')" 
                  class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 transition-all text-xs font-bold cursor-pointer"
                  title="Nghe từ này (Giọng Nam)">
                  👨 Nam
                </button>
              </div>
              <button 
                id="btnSaveVocab-${safeHanzi}"
                onclick="toggleSaveWordFromLesson('${safeHanzi}', '${v.pinyin}', '${safeMeaning}')" 
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
                  <button onclick="playChineseTTS('${safeExample}', 'female')" class="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-[10px] font-bold transition-all cursor-pointer" title="Nghe ví dụ (Giọng Nữ)">
                    👩 Nữ
                  </button>
                  <button onclick="playChineseTTS('${safeExample}', 'male')" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-[10px] font-bold transition-all cursor-pointer" title="Nghe ví dụ (Giọng Nam)">
                    👨 Nam
                  </button>
                </div>
              </div>
              <p class="font-hanzi font-bold text-stone-900 text-xs">${v.example}</p>
            </div>
          ` : ''}
        </div>

        <div class="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
          <button onclick="quickSearchFromLesson('${safeHanzi}')" class="text-[#8B1E1E] hover:underline flex items-center gap-1 font-medium cursor-pointer">
            <i data-lucide="search" class="w-3 h-3"></i>
            Chiết tự & Thứ tự nét
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
              const safeHanzi = ex.hanzi.replace(/'/g, "\\'");
              return `
                <div class="p-3 rounded-xl bg-purple-50/30 border border-purple-100 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p class="font-hanzi font-bold text-stone-900 text-sm">${ex.hanzi}</p>
                    <p class="text-stone-500 font-semibold">${ex.pinyin}</p>
                    <p class="text-stone-700 italic">${ex.vi}</p>
                  </div>
                  <div class="inline-flex items-center gap-0.5 shrink-0 bg-white p-0.5 rounded-lg border border-purple-200">
                    <button onclick="playChineseTTS('${safeHanzi}', 'female')" class="px-1.5 py-0.5 rounded hover:bg-rose-50 text-rose-800 text-[10px] font-bold cursor-pointer" title="Nghe giọng Nữ">👩</button>
                    <button onclick="playChineseTTS('${safeHanzi}', 'male')" class="px-1.5 py-0.5 rounded hover:bg-purple-50 text-purple-800 text-[10px] font-bold cursor-pointer" title="Nghe giọng Nam">👨</button>
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
    const safeQ = q.questionHanzi.replace(/'/g, "\\'");
    const safeA = q.answerHanzi.replace(/'/g, "\\'");

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
              onclick="playChineseTTS('${safeQ}', 'female')" 
              class="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
              title="Nghe câu hỏi giọng Nữ">
              👩 Nữ
            </button>
            <button 
              onclick="playChineseTTS('${safeQ}', 'male')" 
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
                onclick="playChineseTTS('${safeA}', 'female')" 
                class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-rose-50 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
                title="Nghe câu trả lời giọng Nữ">
                👩 Nữ
              </button>
              <button 
                onclick="playChineseTTS('${safeA}', 'male')" 
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
                  onclick="selectFIBOption(${fibIdx}, ${b.blankNum}, '${opt}')"
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

function quickSearchFromLesson(text) {
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.value = text;
    handleGlobalSearch(text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Explicit Window Bindings for Dynamic Inline Handlers
window.openLessonDetailModal = openLessonDetailModal;
window.closeLessonDetailModal = closeLessonDetailModal;
window.switchLessonSubTab = switchLessonSubTab;
window.navigateToAdjacentLesson = navigateToAdjacentLesson;
window.updateLessonModalNavButtons = updateLessonModalNavButtons;
window.toggleLessonQAAnswer = toggleLessonQAAnswer;
window.selectFIBOption = selectFIBOption;
window.checkFIBAnswers = checkFIBAnswers;
window.resetFIBExercise = resetFIBExercise;
window.playLessonTitleAudio = playLessonTitleAudio;
window.playWritingCharTTS = playWritingCharTTS;
window.playDialogueSequence = playDialogueSequence;
window.stopDialogueSequence = stopDialogueSequence;
window.toggleSaveWordFromLesson = toggleSaveWordFromLesson;
window.isWordSaved = isWordSaved;
window.quickSearchFromLesson = quickSearchFromLesson;
window.toggleNarrativePinyin = toggleNarrativePinyin;
window.toggleNarrativeTranslation = toggleNarrativeTranslation;
window.playAllNarrativeText = playAllNarrativeText;
window.stopNarrativeSpeech = stopNarrativeSpeech;
window.playNarrativeParagraph = playNarrativeParagraph;
window.playNarrativeParagraphVoice = playNarrativeParagraphVoice;
window.playAllReadingParagraphs = playAllReadingParagraphs;
window.toggleNarrativeQA = toggleNarrativeQA;
window.scrollToEra = scrollToEra;
window.filterCultureCategory = filterCultureCategory;
window.switchDictMode = switchDictMode;
window.filterDictTopic = filterDictTopic;
window.onTopicSearchInput = onTopicSearchInput;
window.clearTopicSearch = clearTopicSearch;
window.loadMoreTopicDict = loadMoreTopicDict;

// Global Escape Key to close open modals
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLessonDetailModal();
    closeWordModal();
    closeNotebookModal();
    closeTelegramModal();
    closeReadingTocModal();
  }
});

// Run on page load
window.addEventListener('DOMContentLoaded', initApp);
