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

  const tabHome = document.getElementById('tab-home');
  if (tabHome) refreshIcons(tabHome);
}

/** Called by profile/SRS code after EXP, streak or the deck changes. */
function onProfileChanged() {
  if (activeTab !== 'home') return;
  renderHomeStreak();
  renderHomeQuests();
}
