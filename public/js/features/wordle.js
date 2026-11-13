// =========================================================================
// 🧩 WORDLE THÀNH NGỮ CHỮ HÁN (DAILY CHENGYU WORDLE - GIẢI MẬT MỖI NGÀY)
// Edutainment & Viral Daily Puzzle Engine for Chinese Learners
// =========================================================================

(function(root) {
  'use strict';

  // ---------------- FALLBACK CHENGYU DATASET (IN CASE OF OFFLINE / LAZY LOAD) ----------------
  const FALLBACK_CHENYU = [
    {
      id: 'chengyu_1',
      chengyu: '画蛇添足',
      pinyin: 'huà shé tiān zú',
      hanviet: 'Họa Xà Thiêm Túc',
      literal: 'Vẽ rắn thêm chân',
      figurative: 'Làm việc thừa thãi, vẽ vời vô ích khiến việc tốt hóa hỏng.',
      story: 'Thời Chiến Quốc, nước Sở có người thi vẽ rắn trên đất, ai vẽ xong trước được uống rượu. Một người vẽ xong trước, tự đắc vẽ thêm chân cho rắn, kết quả bị người thứ hai giật mất bình rượu.',
      lesson: 'Biết đủ là phúc, làm việc gì cũng cần biết điểm dừng, chớ tham lam thể hiện thái quá.',
      example: {
        hanzi: '你这篇文章已经很完美了，再加这段话简直是画蛇添足。',
        pinyin: 'Nǐ zhè piān wénzhāng yǐjīng hěn wánměi le, zài jiā zhè duàn huà jiǎnzhí shì huà shé tiān zú.',
        vi: 'Bài viết này của bạn đã rất hoàn hảo rồi, thêm đoạn này vào quả thực là vẽ rắn thêm chân.'
      }
    },
    {
      id: 'chengyu_2',
      chengyu: '卧薪尝胆',
      pinyin: 'wò xīn cháng dǎn',
      hanviet: 'Ngọa Tân Nếm Đảm',
      literal: 'Nằm trên củi gai, nếm mật đắng',
      figurative: 'Kiên trì nhẫn nhục, chịu đựng gian khổ tột cùng để nuôi chí lớn phục thù.',
      story: 'Việt Vương Câu Tiễn sau khi bị Ngô Vương Phù Sai bắt làm tù binh, đã nằm trên đống củi gai và nếm mật lợn đắng mỗi ngày để ghi nhớ mối thù mất nước, cuối cùng xưng bá chư hầu.',
      lesson: 'Khổ ải là lò luyện người tài. Chỉ cần giữ vững ý chí kiên định, thất bại hôm nay sẽ là bàn đạp ngày mai.',
      example: {
        hanzi: '经过十年的卧薪尝胆，他的公司终于成功上市。',
        pinyin: 'Jīngguò shí nián de wò xīn cháng dǎn, tā de gōngsī zhōngyú chénggōng shàngshì.',
        vi: 'Trải qua 10 năm nằm gai nếm mật, công ty của anh ấy cuối cùng đã niêm yết thành công.'
      }
    },
    {
      id: 'chengyu_3',
      chengyu: '刻舟求剑',
      pinyin: 'kè zhōu qiú jiàn',
      hanviet: 'Khắc Chu Cầu Kiếm',
      literal: 'Khắc dấu mạn thuyền tìm gươm',
      figurative: 'Tư duy máy móc, bảo thủ theo lối mòn cũ mà không biết thích nghi hoàn cảnh mới.',
      story: 'Người nước Sở đánh rơi bảo kiếm xuống sông giữa dòng, liền khắc dấu lên mạn thuyền. Đến khi thuyền cập bến mới nhảy xuống mò kiếm.',
      lesson: 'Thế giới vận động không ngừng, chớ dùng quy tắc xơ cứng để giải quyết việc mới.',
      example: {
        hanzi: '在快速变化的市场里，墨守成规无异于刻舟求剑。',
        pinyin: 'Zài kuàisù biànhuà de shìchǎng lǐ, mòshǒuchéngguī wúyì yú kè zhōu qiú jiàn.',
        vi: 'Trong thị trường thay đổi nhanh chóng, bám chặt lối mòn cũ chẳng khác nào khắc thuyền tìm kiếm.'
      }
    },
    {
      id: 'chengyu_4',
      chengyu: '知己知彼',
      pinyin: 'zhī jǐ zhī bǐ',
      hanviet: 'Tri Kỷ Tri Bỉ',
      literal: 'Biết mình biết người',
      figurative: 'Hiểu rõ điểm mạnh yếu của mình và đối thủ thì trăm trận trăm thắng.',
      story: 'Binh pháp Tôn Tử đúc kết: Tri kỷ tri bỉ, bách chiến bất đãi; bất tri bỉ nhi tri kỷ, nhất thắng nhất phụ.',
      lesson: 'Tự lượng sức mình và nắm bắt đối phương là chìa khóa then chốt của mọi chiến thắng.',
      example: {
        hanzi: '谈判前必须充分调查，做到知己知彼。',
        pinyin: 'Tánpàn qián bìxū chōngfèn diàochá, zuò dào zhī jǐ zhī bǐ.',
        vi: 'Trước buổi đàm phán cần tìm hiểu kỹ càng, đạt được biết mình biết người.'
      }
    },
    {
      id: 'chengyu_5',
      chengyu: '一箭双雕',
      pinyin: 'yī jiàn shuāng diāo',
      hanviet: 'Nhất Tiễn Song Điêu',
      literal: 'Một mũi tên bắn trúng hai con chim điêu',
      figurative: 'Làm một việc đạt được hai mục đích tốt đẹp cùng lúc (Nhất cử lưỡng tiện).',
      story: 'Thời Bắc Chu, Trưởng Tôn Thạnh giương cung bắn một phát xuyên qua cả hai con chim điêu đang tranh mồi trên trời.',
      lesson: 'Người thông minh luôn biết kết hợp tài nguyên để tối đa hóa hiệu quả.',
      example: {
        hanzi: '学汉语既能考级又能交朋友，真是一箭双雕。',
        pinyin: 'Xué Hànyǔ jì néng kǎojí yòu néng jiāo péngyou, zhēn shì yī jiàn shuāng diāo.',
        vi: 'Học tiếng Trung vừa thi được chứng chỉ vừa kết thêm bạn mới, thật là nhất tiễn song điêu.'
      }
    },
    {
      id: 'chengyu_6',
      chengyu: '井底之蛙',
      pinyin: 'jǐng dǐ zhī wā',
      hanviet: 'Tỉnh Đề Chi Oa',
      literal: 'Ếch ngồi đáy giếng',
      figurative: 'Tầm nhìn hạn hẹp, thiển cận nhưng lại tự cho mình hiểu biết rộng lớn.',
      story: 'Con ếch sống dưới đáy giếng cạn khoe khoang giếng nước là cả vũ trụ, cho đến khi rùa biển Đông kể cho nó nghe về sự bao la của đại dương.',
      lesson: 'Biển học vô bờ, hãy luôn khiêm tốn mở rộng tầm mắt ra thế giới rộng lớn.',
      example: {
        hanzi: '不走出国门，怎么知道自己不是井底之蛙？',
        pinyin: 'Bù zǒu chū guómén, zěnme zhīdào zìjǐ bú shì jǐng dǐ zhī wā?',
        vi: 'Không bước chân ra thế giới, sao biết được mình không phải là ếch ngồi đáy giếng?'
      }
    },
    {
      id: 'chengyu_7',
      chengyu: '守株待兔',
      pinyin: 'shǒu zhū dài tù',
      hanviet: 'Thủ Chu Đãi Thố',
      literal: 'Ôm gốc cây đợi thỏ',
      figurative: 'Trông chờ vào may mắn ngẫu nhiên mà không chịu nỗ lực lao động chân chính.',
      story: 'Người nông dân nước Tống thấy con thỏ chạy đâm đầu vào gốc cây chết tốt, liền bỏ cày bừa cả ngày ngồi canh gốc cây chờ thỏ tới đâm đầu vào.',
      lesson: 'Không có bữa trưa nào miễn phí; muốn thành công phải kiên trì rèn luyện chứ không thể ăn may.',
      example: {
        hanzi: '只有努力学习才能通过考试，守株待兔是行不通的。',
        pinyin: 'Zhǐyǒu nǔlì xuéxí cái néng tōngguò kǎoshì, shǒuzhūdàitù shì xíngbutōng de.',
        vi: 'Chỉ có chăm chỉ học tập mới đỗ kỳ thi, ôm cây đợi thỏ là điều không tưởng.'
      }
    },
    {
      id: 'chengyu_8',
      chengyu: '亡羊补牢',
      pinyin: 'wáng yáng bǔ láo',
      hanviet: 'Vong Dương Bổ Lao',
      literal: 'Mất cừu mới sửa chuồng',
      figurative: 'Dù đã xảy ra tổn thất nhưng kịp thời sửa chữa, rút kinh nghiệm thì vẫn chưa muộn.',
      story: 'Trang Ấp khuyên Sở Tương Vương: Thấy thỏ mới thả chó săn vẫn chưa muộn, mất cừu rồi sửa lại chuồng vẫn kịp.',
      lesson: 'Sai lầm là bài học, quan trọng là biết sửa đổi ngay lập tức để ngăn ngừa thảm họa lớn hơn.',
      example: {
        hanzi: '这次模拟考考砸了没关系，亡羊补牢，为时不晚。',
        pinyin: 'Zhè cì mónǐ kǎo kǎozále méiguānxi, wáng yáng bǔ láo, wéishí bù wǎn.',
        vi: 'Lần thi thử này làm hỏng không sao, mất bò mới lo làm chuồng vẫn còn kịp.'
      }
    }
  ];

  // Common characters to use as distractors in keyboard
  const COMMON_KEYBOARD_DISTRACTORS = [
    '天', '地', '人', '山', '水', '风', '月', '日', '心', '目', '手', '口',
    '龙', '虎', '马', '鸟', '鱼', '金', '木', '火', '土', '大', '小', '高',
    '长', '自', '相', '一', '百', '千', '万', '有', '无', '同', '生', '死'
  ];

  // ---------------- WORDLE STATE & PERSISTENCE ----------------
  const WORDLE_STORAGE_KEY = 'yuhan_chengyu_wordle_state';
  const WORDLE_STATS_KEY = 'yuhan_chengyu_wordle_stats';

  let currentIdiom = null;
  let isDailyMode = true;
  let puzzleDateStr = '';
  let puzzleNumber = 1;

  // Grid state
  const MAX_ATTEMPTS = 6;
  const WORD_LENGTH = 4;
  let currentRowIndex = 0;
  let currentTileIndex = 0; // 0..3
  let guesses = []; // Array of strings e.g. ['画蛇添足', ...]
  let evaluations = []; // Array of arrays e.g. [['correct', 'absent', ...], ...]
  let isGameOver = false;
  let isGameWon = false;
  let keyboardCharStatus = {}; // char -> 'correct' | 'present' | 'absent'
  let keyboardPool = []; // 16-20 characters displayed on screen
  let hintsRevealed = 0;

  let wordleStats = {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0] // 1..6 tries
  };

  // ---------------- SOUND EFFECTS ----------------
  function playWordleSfx(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;

      if (type === 'type') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.setValueAtTime(500, t);
        g.gain.setValueAtTime(0.04, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
      } else if (type === 'delete') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.setValueAtTime(300, t);
        g.gain.setValueAtTime(0.05, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
      } else if (type === 'flip') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.08);
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      } else if (type === 'win') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t + i * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0.18, start);
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.27);
        });
      } else if (type === 'lose') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.linearRampToValueAtTime(140, t + 0.25);
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      }
    } catch (e) {}
  }

  // ---------------- DATE & IDIOM SELECTION ----------------
  function getTodayDateString() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function hashDate(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function getActiveIdiomList() {
    if (typeof chengyuData !== 'undefined' && Array.isArray(chengyuData) && chengyuData.length > 0) {
      return chengyuData.filter(c => c.chengyu && c.chengyu.length === 4);
    }
    return FALLBACK_CHENYU;
  }

  function selectDailyIdiom(dateStr) {
    const list = getActiveIdiomList();
    const hash = hashDate(dateStr);
    const idx = hash % list.length;
    // Calculate puzzle number as days since Jan 1, 2026
    const epoch = new Date('2026-01-01').getTime();
    const current = new Date(dateStr).getTime();
    puzzleNumber = Math.max(1, Math.floor((current - epoch) / (1000 * 60 * 60 * 24)));
    return list[idx];
  }

  // ---------------- STATS MANAGEMENT ----------------
  function loadWordleStats() {
    try {
      const saved = localStorage.getItem(WORDLE_STATS_KEY);
      if (saved) wordleStats = Object.assign(wordleStats, JSON.parse(saved));
    } catch (e) {}
  }

  function saveWordleStats() {
    try {
      localStorage.setItem(WORDLE_STATS_KEY, JSON.stringify(wordleStats));
    } catch (e) {}
  }

  // ---------------- GAME INITIALIZATION ----------------
  function initWordleGame(daily = true) {
    loadWordleStats();
    isDailyMode = daily;
    puzzleDateStr = getTodayDateString();

    if (daily) {
      currentIdiom = selectDailyIdiom(puzzleDateStr);
    } else {
      const list = getActiveIdiomList();
      currentIdiom = list[Math.floor(Math.random() * list.length)];
      puzzleNumber = Math.floor(100 + Math.random() * 900);
    }

    currentRowIndex = 0;
    currentTileIndex = 0;
    guesses = [];
    evaluations = [];
    isGameOver = false;
    isGameWon = false;
    keyboardCharStatus = {};
    hintsRevealed = 0;

    // Check if daily game state was saved for today
    if (daily) {
      try {
        const savedRaw = localStorage.getItem(`${WORDLE_STORAGE_KEY}_${puzzleDateStr}`);
        if (savedRaw) {
          const savedState = JSON.parse(savedRaw);
          guesses = savedState.guesses || [];
          evaluations = savedState.evaluations || [];
          isGameOver = savedState.isGameOver || false;
          isGameWon = savedState.isGameWon || false;
          currentRowIndex = guesses.length;
          keyboardCharStatus = savedState.keyboardCharStatus || {};
          hintsRevealed = savedState.hintsRevealed || 0;
        }
      } catch (e) {}
    }

    // Generate virtual keyboard character pool (target 4 chars + distractors)
    generateKeyboardPool();
  }

  function generateKeyboardPool() {
    const targetChars = currentIdiom.chengyu.split('');
    const distractors = [...COMMON_KEYBOARD_DISTRACTORS]
      .filter(c => !targetChars.includes(c))
      .sort(() => 0.5 - Math.random())
      .slice(0, 14);

    keyboardPool = [...targetChars, ...distractors].sort(() => 0.5 - Math.random());
  }

  function saveDailyState() {
    if (!isDailyMode) return;
    try {
      const state = {
        guesses,
        evaluations,
        isGameOver,
        isGameWon,
        keyboardCharStatus,
        hintsRevealed
      };
      localStorage.setItem(`${WORDLE_STORAGE_KEY}_${puzzleDateStr}`, JSON.stringify(state));
    } catch (e) {}
  }

  // ---------------- EVALUATION ENGINE ----------------
  function evaluateGuess(guess, target) {
    const res = Array(WORD_LENGTH).fill('absent');
    const targetArr = target.split('');
    const guessArr = guess.split('');

    const targetCounts = {};
    for (let c of targetArr) {
      targetCounts[c] = (targetCounts[c] || 0) + 1;
    }

    // 1st pass: Exact matches (green)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessArr[i] === targetArr[i]) {
        res[i] = 'correct';
        targetCounts[guessArr[i]]--;
      }
    }

    // 2nd pass: Present matches (yellow)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (res[i] !== 'correct') {
        const char = guessArr[i];
        if (targetCounts[char] && targetCounts[char] > 0) {
          res[i] = 'present';
          targetCounts[char]--;
        }
      }
    }

    return res;
  }

  // ---------------- UI RENDERING ----------------
  function openWordleModal(daily = true) {
    initWordleGame(daily);
    const modal = document.getElementById('wordleModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    renderWordleStage();
    if (typeof refreshIcons === 'function') refreshIcons(modal);
  }

  function closeWordleModal() {
    const modal = document.getElementById('wordleModal');
    if (modal) modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  function getWordleContainer() {
    return document.getElementById('wordleContent') || document.getElementById('tab-wordle-content');
  }

  function renderWordleStage() {
    const container = getWordleContainer();
    if (!container) return;

    container.innerHTML = `
      <div class="max-w-xl mx-auto space-y-5 text-center animate-fade-in py-1">
        <!-- Top Bar -->
        <div class="flex items-center justify-between border-b border-amber-300/30 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-base shadow-xs">
              🧩
            </span>
            <div class="text-left">
              <h2 class="text-base sm:text-lg font-serif-luxury font-black text-amber-100 flex items-center gap-2">
                <span>Wordle Thành Ngữ</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full ${isDailyMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'} font-bold">
                  ${isDailyMode ? `Hôm Nay #${puzzleNumber}` : 'Luyện Tập Tự Do'}
                </span>
              </h2>
              <p class="text-[11px] text-stone-400">Giải mật mã 4 chữ Hán trong 6 lượt đoán</p>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button onclick="requestWordleHint()" class="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer" title="Xem gợi ý nếu gặp câu khó">
              <i data-lucide="lightbulb" class="w-3.5 h-3.5"></i>
              <span class="hidden sm:inline">Gợi ý</span>
            </button>
            <button onclick="startWordlePractice()" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-stone-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer" title="Đổi câu mới để luyện tập">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
              <span class="hidden sm:inline">Ván mới</span>
            </button>
          </div>
        </div>

        <!-- Hint Banner (if any) -->
        <div id="wordleHintBanner" class="${hintsRevealed > 0 ? '' : 'hidden'} p-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-xs text-amber-200 text-left flex items-start gap-2">
          <i data-lucide="sparkles" class="w-4 h-4 text-amber-300 shrink-0 mt-0.5"></i>
          <span id="wordleHintText">${getHintMessage()}</span>
        </div>

        <!-- 6x4 Wordle Grid -->
        <div class="flex justify-center py-2">
          <div id="wordleGrid" class="grid grid-rows-6 gap-2 sm:gap-2.5">
            ${renderGridRowsHtml()}
          </div>
        </div>

        <!-- Optional Direct Typing Input for IME users -->
        <div class="flex items-center justify-center gap-2 max-w-xs mx-auto">
          <input 
            type="text" 
            id="wordleDirectInput" 
            maxlength="4" 
            placeholder="Gõ hoặc dán chữ Hán..." 
            class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-chinese text-center text-sm font-bold focus:border-amber-400 focus:outline-none"
            onkeydown="if(event.key==='Enter') submitDirectWordleInput()"
          />
          <button onclick="submitDirectWordleInput()" class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shrink-0 cursor-pointer">
            Gửi
          </button>
        </div>

        <!-- Character Keyboard Pool -->
        <div class="space-y-2 pt-1">
          <div class="text-[10px] text-stone-400 flex items-center justify-between px-1">
            <span>BÀN PHÍM KÝ TỰ (Chạm vào chữ để nhập):</span>
            <span class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Đúng</span>
              <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Sai vị trí</span>
            </span>
          </div>

          <div id="wordleKeyboard" class="flex flex-wrap justify-center gap-1.5 sm:gap-2 select-none">
            ${renderKeyboardHtml()}
          </div>

          <!-- Bottom Control Buttons -->
          <div class="flex items-center justify-center gap-3 pt-2">
            <button onclick="handleWordleBackspace()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
              <span>⌫ Xóa chữ</span>
            </button>
            <button onclick="handleWordleSubmit()" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
              <span>✓ GỬI ĐOÁN (SUBMIT)</span>
            </button>
          </div>
        </div>

        <!-- Post-Game Result Card (rendered dynamically if game over) -->
        <div id="wordleResultCard" class="${isGameOver ? '' : 'hidden'} mt-4">
          ${isGameOver ? renderResultCardHtml() : ''}
        </div>
      </div>
    `;

    if (typeof refreshIcons === 'function') refreshIcons(container);
  }

  function renderGridRowsHtml() {
    let rowsHtml = '';
    for (let r = 0; r < MAX_ATTEMPTS; r++) {
      const isPast = r < guesses.length;
      const isCurrent = r === currentRowIndex && !isGameOver;
      const guessStr = isPast ? guesses[r] : (isCurrent ? (guesses[currentRowIndex] || '') : '');
      const evalRow = isPast ? evaluations[r] : null;

      rowsHtml += `<div class="grid grid-cols-4 gap-2 sm:gap-2.5">`;
      for (let c = 0; c < WORD_LENGTH; c++) {
        const char = guessStr[c] || '';
        let tileClass = 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-chinese font-bold text-xl sm:text-2xl transition-all duration-300 ';

        if (evalRow) {
          const status = evalRow[c];
          if (status === 'correct') {
            tileClass += 'bg-emerald-600 text-white border-2 border-emerald-400 shadow-lg';
          } else if (status === 'present') {
            tileClass += 'bg-amber-500 text-stone-950 border-2 border-amber-300 shadow-md';
          } else {
            tileClass += 'bg-slate-800/80 text-stone-400 border border-slate-700';
          }
        } else if (isCurrent && char) {
          tileClass += 'bg-slate-900 border-2 border-amber-400 text-amber-200 animate-pulse';
        } else if (isCurrent && c === currentTileIndex) {
          tileClass += 'bg-slate-900/60 border-2 border-cyan-400 text-stone-300';
        } else {
          tileClass += 'bg-slate-900/40 border border-slate-800 text-stone-600';
        }

        rowsHtml += `
          <div class="${tileClass}">
            ${char}
          </div>
        `;
      }
      rowsHtml += `</div>`;
    }
    return rowsHtml;
  }

  function renderKeyboardHtml() {
    return keyboardPool.map(char => {
      const status = keyboardCharStatus[char];
      let btnClass = 'w-9 h-10 sm:w-11 sm:h-12 rounded-xl font-chinese font-bold text-base sm:text-lg border flex items-center justify-center transition-all cursor-pointer transform active:scale-95 ';

      if (status === 'correct') {
        btnClass += 'bg-emerald-600 border-emerald-400 text-white shadow-md';
      } else if (status === 'present') {
        btnClass += 'bg-amber-500 border-amber-300 text-stone-950 shadow-sm';
      } else if (status === 'absent') {
        btnClass += 'bg-slate-900/40 border-slate-800 text-stone-600 opacity-40';
      } else {
        btnClass += 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-stone-100 hover:border-amber-400/60';
      }

      return `
        <button onclick="handleWordleCharInput('${char}')" class="${btnClass}">
          ${char}
        </button>
      `;
    }).join('');
  }

  function getHintMessage() {
    if (!currentIdiom) return '';
    if (hintsRevealed >= 2) {
      return `<strong>Gợi ý nghĩa bóng:</strong> ${currentIdiom.figurative} (Pinyin: ${currentIdiom.pinyin})`;
    }
    if (hintsRevealed >= 1) {
      return `<strong>Gợi ý chữ đầu:</strong> Thành ngữ bắt đầu bằng âm “${currentIdiom.pinyin.split(' ')[0]}” và có nghĩa liên quan đến: ${currentIdiom.literal}`;
    }
    return '';
  }

  // ---------------- INPUT HANDLERS ----------------
  function handleWordleCharInput(char) {
    if (isGameOver) return;
    let currentGuess = guesses[currentRowIndex] || '';
    if (currentGuess.length >= WORD_LENGTH) return;

    currentGuess += char;
    guesses[currentRowIndex] = currentGuess;
    currentTileIndex = currentGuess.length;

    playWordleSfx('type');
    renderWordleStage();
  }

  function handleWordleBackspace() {
    if (isGameOver) return;
    let currentGuess = guesses[currentRowIndex] || '';
    if (currentGuess.length === 0) return;

    currentGuess = currentGuess.slice(0, -1);
    guesses[currentRowIndex] = currentGuess;
    currentTileIndex = currentGuess.length;

    playWordleSfx('delete');
    renderWordleStage();
  }

  function submitDirectWordleInput() {
    const input = document.getElementById('wordleDirectInput');
    if (!input || !input.value) return;
    const val = input.value.trim();
    if (val.length !== 4) {
      if (typeof showToast === 'function') showToast('Vui lòng nhập đúng 4 chữ Hán!', 'warning');
      return;
    }
    guesses[currentRowIndex] = val;
    input.value = '';
    handleWordleSubmit();
  }

  function handleWordleSubmit() {
    if (isGameOver) return;
    const currentGuess = guesses[currentRowIndex] || '';

    if (currentGuess.length < WORD_LENGTH) {
      if (typeof showToast === 'function') {
        showToast(`Cần nhập đủ 4 chữ Hán! (Hiện có ${currentGuess.length}/4 chữ)`, 'warning');
      }
      return;
    }

    const evaluation = evaluateGuess(currentGuess, currentIdiom.chengyu);
    evaluations.push(evaluation);

    // Update keyboard color status
    currentGuess.split('').forEach((c, idx) => {
      const status = evaluation[idx];
      const prev = keyboardCharStatus[c];
      if (status === 'correct') {
        keyboardCharStatus[c] = 'correct';
      } else if (status === 'present' && prev !== 'correct') {
        keyboardCharStatus[c] = 'present';
      } else if (!prev) {
        keyboardCharStatus[c] = 'absent';
      }
    });

    playWordleSfx('flip');

    // Check Win / Lose
    const isWin = evaluation.every(s => s === 'correct');
    if (isWin) {
      isGameOver = true;
      isGameWon = true;
      playWordleSfx('win');

      // Update statistics
      wordleStats.played++;
      wordleStats.won++;
      wordleStats.currentStreak++;
      if (wordleStats.currentStreak > wordleStats.maxStreak) {
        wordleStats.maxStreak = wordleStats.currentStreak;
      }
      wordleStats.distribution[currentRowIndex]++;
      saveWordleStats();

      // Award EXP
      if (typeof addExp === 'function') {
        addExp(40, 'wordle_win');
      }

      saveDailyState();
      renderWordleStage();
      return;
    }

    if (currentRowIndex + 1 >= MAX_ATTEMPTS) {
      isGameOver = true;
      isGameWon = false;
      playWordleSfx('lose');

      wordleStats.played++;
      wordleStats.currentStreak = 0;
      saveWordleStats();

      saveDailyState();
      renderWordleStage();
      return;
    }

    // Advance to next row
    currentRowIndex++;
    currentTileIndex = 0;
    saveDailyState();
    renderWordleStage();
  }

  function requestWordleHint() {
    if (hintsRevealed >= 2) {
      if (typeof showToast === 'function') showToast('Đã mở toàn bộ gợi ý tối đa cho câu này!', 'info');
      return;
    }
    hintsRevealed++;
    saveDailyState();
    playWordleSfx('type');
    renderWordleStage();

    if (typeof showToast === 'function') {
      showToast('Đã mở khóa gợi ý mới phía trên bảng chữ!', 'success');
    }
  }

  function startWordlePractice() {
    initWordleGame(false);
    renderWordleStage();
    if (typeof showToast === 'function') {
      showToast('Đã tạo thành ngữ mới cho chế độ Luyện tập tự do!', 'info');
    }
  }

  // ---------------- RESULT CARD & VIRAL SHARE ----------------
  function renderResultCardHtml() {
    if (!currentIdiom) return '';

    const isWin = isGameWon;
    const title = isWin ? '🎉 CHÚC MỪNG BẠN ĐÃ GIẢI MÃ THÀNH CÔNG!' : '💡 ĐỪNG NẢN LÒNG, ĐÁP ÁN LÀ:';
    const bannerBg = isWin ? 'bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900' : 'bg-gradient-to-br from-stone-800 via-slate-900 to-stone-900';

    return `
      <div class="p-5 sm:p-7 rounded-3xl ${bannerBg} border-2 border-amber-400/50 text-white shadow-2xl space-y-4 text-left animate-fade-in">
        <div class="text-center">
          <span class="text-xs font-bold text-amber-300 uppercase tracking-widest">${title}</span>
          <div class="mt-2 flex items-center justify-center gap-3">
            <span class="text-3xl sm:text-5xl font-chinese font-black text-amber-200 tracking-wider">
              ${currentIdiom.chengyu}
            </span>
            <button onclick="if(typeof playTts==='function') playTts('${currentIdiom.chengyu}', 'zh-CN')" class="w-10 h-10 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-400/40 flex items-center justify-center transition-all cursor-pointer" title="Nghe phát âm chuẩn">
              <i data-lucide="volume-2" class="w-5 h-5"></i>
            </button>
          </div>
          <div class="text-xs sm:text-sm font-mono text-cyan-300 mt-1">
            ${currentIdiom.pinyin} • <span class="text-amber-100 font-serif-luxury font-bold">${currentIdiom.hanviet}</span>
          </div>
        </div>

        <!-- Meaning Breakdown -->
        <div class="p-3.5 rounded-2xl bg-slate-950/50 border border-amber-400/20 text-xs space-y-2">
          <div>
            <strong class="text-amber-300">📖 Nghĩa đen:</strong>
            <span class="text-stone-300 ml-1">${currentIdiom.literal}</span>
          </div>
          <div>
            <strong class="text-emerald-300">💡 Nghĩa bóng:</strong>
            <span class="text-stone-300 ml-1">${currentIdiom.figurative}</span>
          </div>
          ${currentIdiom.story ? `
            <div class="pt-1 border-t border-slate-800 text-[11px] text-stone-400 leading-relaxed">
              <strong class="text-amber-200">Điển tích:</strong> ${currentIdiom.story}
            </div>
          ` : ''}
          ${currentIdiom.example ? `
            <div class="pt-1 text-[11px] text-cyan-200/90 italic">
              Ví dụ: “${currentIdiom.example.hanzi}” (${currentIdiom.example.vi})
            </div>
          ` : ''}
        </div>

        <!-- Wordle Lifetime Stats -->
        <div class="grid grid-cols-4 gap-2 text-center p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
          <div>
            <span class="text-[10px] text-stone-400 block">Số ván</span>
            <span class="font-bold text-white font-mono">${wordleStats.played}</span>
          </div>
          <div>
            <span class="text-[10px] text-stone-400 block">Tỷ lệ thắng</span>
            <span class="font-bold text-emerald-400 font-mono">${wordleStats.played > 0 ? Math.round((wordleStats.won / wordleStats.played) * 100) : 0}%</span>
          </div>
          <div>
            <span class="text-[10px] text-stone-400 block">Chuỗi thắng</span>
            <span class="font-bold text-amber-300 font-mono">🔥 ${wordleStats.currentStreak}</span>
          </div>
          <div>
            <span class="text-[10px] text-stone-400 block">Kỷ lục chuỗi</span>
            <span class="font-bold text-yellow-400 font-mono">👑 ${wordleStats.maxStreak}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button onclick="shareWordleResult()" class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 font-black text-xs shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <i data-lucide="share-2" class="w-4 h-4"></i>
            <span>CHIA SẺ KẾT QUẢ (COPY EMOJI)</span>
          </button>
          <button onclick="startWordlePractice()" class="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-stone-200 border border-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
            <span>Chơi Ván Khác (Luyện Tập)</span>
          </button>
        </div>
      </div>
    `;
  }

  function shareWordleResult() {
    const totalTries = isGameWon ? guesses.length : 'X';
    let emojiGrid = '';

    evaluations.forEach(row => {
      row.forEach(status => {
        if (status === 'correct') emojiGrid += '🟩';
        else if (status === 'present') emojiGrid += '🟨';
        else emojiGrid += '⬜';
      });
      emojiGrid += '\n';
    });

    const shareText = `🧩 Wordle Thành Ngữ Chữ Hán #${puzzleNumber} (${totalTries}/6)\n\n${emojiGrid}\n👉 Thử sức ngay: ${window.location.origin}${window.location.pathname}#/wordle`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        if (typeof showToast === 'function') {
          showToast('Đã sao chép lưới emoji! Bạn có thể dán lên Facebook, Zalo, Telegram hoặc Threads!', 'success');
        } else {
          alert('Đã sao chép kết quả!');
        }
      }).catch(() => {
        prompt('Sao chép kết quả của bạn:', shareText);
      });
    } else {
      prompt('Sao chép kết quả của bạn:', shareText);
    }
  }

  function initWordleTab() {
    initWordleGame(true);
    renderWordleStage();
    const container = document.getElementById('tab-wordle');
    if (typeof refreshIcons === 'function' && container) refreshIcons(container);
  }

  // ---------------- EXPORTS ----------------
  root.initWordleTab = initWordleTab;
  root.openWordleModal = openWordleModal;
  root.closeWordleModal = closeWordleModal;
  root.handleWordleCharInput = handleWordleCharInput;
  root.handleWordleBackspace = handleWordleBackspace;
  root.handleWordleSubmit = handleWordleSubmit;
  root.submitDirectWordleInput = submitDirectWordleInput;
  root.requestWordleHint = requestWordleHint;
  root.startWordlePractice = startWordlePractice;
  root.shareWordleResult = shareWordleResult;

})(typeof window !== 'undefined' ? window : globalThis);
