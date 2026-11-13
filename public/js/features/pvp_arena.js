// =========================================================================
// ⚔️ ĐẤU TRƯỜNG HÁN TỰ 1VS1 (PVP HANZI BATTLE ARENA / ĐẤU TRÍ PHẢN XẠ 60S)
// Edutainment & Viral Speed Quiz Engine for Chinese Learners
// Highly Optimized: Per-Question Speed Gauge, Audio Mute Toggle, Screen Shake & Combat Float
// =========================================================================

(function(root) {
  'use strict';

  // ---------------- AUDIO SYNTHESIZER ----------------
  let pvpAudioCtx = null;
  let isPvPAudioMuted = false;

  function getPvPAudioContext() {
    try {
      if (!pvpAudioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) pvpAudioCtx = new AudioCtx();
      }
      if (pvpAudioCtx && pvpAudioCtx.state === 'suspended') {
        pvpAudioCtx.resume();
      }
      return pvpAudioCtx;
    } catch (e) {
      return null;
    }
  }

  function playPvPSfx(type, streak = 1) {
    if (isPvPAudioMuted) return;
    try {
      const ctx = getPvPAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.setValueAtTime(440, t);
        g.gain.setValueAtTime(0.06, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
      } else if (type === 'countdown') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, t);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.08);
      } else if (type === 'start') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, t);
        osc.frequency.exponentialRampToValueAtTime(1046.5, t + 0.2);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      } else if (type === 'correct') {
        const freqs = [587.33, 880];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t + idx * 0.06;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0.16, start);
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.2);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.linearRampToValueAtTime(90, t + 0.2);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      } else if (type === 'combo') {
        const base = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        const count = Math.min(base.length, Math.max(2, streak));
        for (let i = 0; i < count; i++) {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t + i * 0.05;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(base[i], start);
          g.gain.setValueAtTime(0.16, start);
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.16);
        }
      } else if (type === 'victory') {
        const fanfare = [
          { f: 523.25, d: 0.12 },
          { f: 659.25, d: 0.12 },
          { f: 783.99, d: 0.12 },
          { f: 1046.50, d: 0.28 },
          { f: 880.00, d: 0.14 },
          { f: 1046.50, d: 0.45 }
        ];
        let offset = 0;
        fanfare.forEach(note => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t + offset;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.f, start);
          g.gain.setValueAtTime(0.2, start);
          g.gain.exponentialRampToValueAtTime(0.001, start + note.d);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + note.d + 0.02);
          offset += note.d * 0.85;
        });
      } else if (type === 'defeat') {
        const sadNotes = [392, 370, 349, 311];
        sadNotes.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t + idx * 0.12;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, start);
          g.gain.setValueAtTime(0.13, start);
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.22);
        });
      }
    } catch (e) {}
  }

  function togglePvPAudio() {
    isPvPAudioMuted = !isPvPAudioMuted;
    const btn = document.getElementById('pvpAudioToggleBtn');
    if (btn) {
      btn.innerHTML = isPvPAudioMuted ? '🔇' : '🔊';
      btn.title = isPvPAudioMuted ? 'Bật âm thanh' : 'Tắt âm thanh';
    }
    if (typeof showToast === 'function') {
      showToast(isPvPAudioMuted ? 'Đã tắt âm thanh trận đấu' : 'Đã bật âm thanh trận đấu', 'info');
    }
  }

  // ---------------- AI RIVALS ----------------
  const AI_RIVALS = {
    easy: {
      id: 'easy',
      name: 'Tiểu Vũ (Tân Binh)',
      avatar: '🐼',
      levelText: 'Sơ cấp HSK 1-2',
      speedMin: 2800,
      speedMax: 3800,
      accuracy: 0.68,
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      intro: 'Tân binh gặm trúc đáng yêu, phản xạ nhẹ nhàng!'
    },
    normal: {
      id: 'normal',
      name: 'Đại Lực (Chiến Binh)',
      avatar: '🐯',
      levelText: 'Trung cấp HSK 3-4',
      speedMin: 1800,
      speedMax: 2600,
      accuracy: 0.84,
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      intro: 'Chiến binh dày dạn kinh nghiệm luyện đề, phản xạ nhanh!'
    },
    hard: {
      id: 'hard',
      name: 'Lão Sư Trương (Đại Sư)',
      avatar: '🐉',
      levelText: 'Cao cấp HSK 5-6',
      speedMin: 1100,
      speedMax: 1800,
      accuracy: 0.94,
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      intro: 'Giáo sư thông thạo tứ thư ngũ kinh, tốc độ sấm chớp!'
    }
  };

  // ---------------- FALLBACK QUESTION BANK ----------------
  const FALLBACK_QUESTIONS = [
    {
      category: 'Từ Vựng HSK',
      prompt: '“熊猫” có nghĩa là gì?',
      options: ['Gấu trúc', 'Chim cánh cụt', 'Mèo con', 'Sư tử'],
      correct: 0,
      explanation: '熊猫 (xióngmāo) nghĩa là gấu trúc.'
    },
    {
      category: 'Pinyin & Thanh Điệu',
      prompt: 'Pinyin chuẩn của chữ “老师” là gì?',
      options: ['lǎoshī', 'lǎosī', 'liǎoshī', 'lǎoshi'],
      correct: 0,
      explanation: '老师 đọc là lǎoshī (Giáo viên).'
    },
    {
      category: 'Lượng Từ Chuẩn Xác',
      prompt: 'Điền lượng từ phù hợp: “一 ___ 书”',
      options: ['本', '张', '条', '只'],
      correct: 0,
      explanation: 'Lượng từ của sách báo là “本” (yì běn shū).'
    },
    {
      category: 'Từ Trái Nghĩa',
      prompt: 'Từ trái nghĩa của “买” (Mua) là gì?',
      options: ['卖 (Bán)', '送 (Tặng)', '借 (Mượn)', '拿 (Lấy)'],
      correct: 0,
      explanation: '买 (mǎi - Mua) đối lập với 卖 (mài - Bán).'
    },
    {
      category: 'Thành Ngữ 4 Chữ',
      prompt: 'Điền chữ còn thiếu: “画蛇添 ___”',
      options: ['足', '手', '头', '尾'],
      correct: 0,
      explanation: '画蛇添足 (huà shé tiān zú): Vẽ rắn thêm chân.'
    },
    {
      category: 'Từ Vựng HSK',
      prompt: '“热情” có nghĩa là gì?',
      options: ['Nhiệt tình, hiếu khách', 'Nóng nảy', 'Lạnh lùng', 'Sốt ruột'],
      correct: 0,
      explanation: '热情 (rèqíng) nghĩa là nhiệt tình, nồng hậu.'
    },
    {
      category: 'Lượng Từ Chuẩn Xác',
      prompt: 'Điền lượng từ phù hợp: “一 ___ 鱼”',
      options: ['条', '只', '头', '把'],
      correct: 0,
      explanation: 'Lượng từ của cá, sông, đường dài thon là “条” (yì tiáo yú).'
    },
    {
      category: 'Pinyin & Thanh Điệu',
      prompt: 'Pinyin của từ “便宜” trong “便宜的东西” là gì?',
      options: ['piányi', 'biànyí', 'piányí', 'biányi'],
      correct: 0,
      explanation: '便宜 nghĩa là rẻ, đọc là piányi (thanh nhẹ ở chữ 宜).'
    },
    {
      category: 'Từ Trái Nghĩa',
      prompt: 'Từ trái nghĩa của “复杂” (Phức tạp) là:',
      options: ['简单 (Đơn giản)', '容易 (Dễ dàng)', '方便 (Tiện lợi)', '清楚 (Rõ ràng)'],
      correct: 0,
      explanation: '复杂 (fùzá - Phức tạp) đối nghĩa với 简单 (jiǎndān - Đơn giản).'
    },
    {
      category: 'Ngữ Pháp Nhanh',
      prompt: 'Chọn trợ từ đúng: “他跑 ___ 很快。”',
      options: ['得', '的', '地', '在'],
      correct: 0,
      explanation: 'Bổ ngữ trạng thái dùng “得” sau động từ: 跑得很快.'
    },
    {
      category: 'Từ Vựng HSK',
      prompt: '“马虎” dùng để chỉ tính cách gì?',
      options: ['Cẩu thả, qua loa', 'Dũng cảm như hổ', 'Chăm chỉ', 'Thông minh'],
      correct: 0,
      explanation: '马虎 (mǎhu) nghĩa là đại khái, cẩu thả, không cẩn thận.'
    },
    {
      category: 'Lượng Từ Chuẩn Xác',
      prompt: 'Điền lượng từ: “一 ___ 咖啡”',
      options: ['杯', '碗', '瓶', '袋'],
      correct: 0,
      explanation: 'Một tách/ly cà phê là “一杯咖啡” (yì bēi kāfēi).'
    },
    {
      category: 'Thành Ngữ 4 Chữ',
      prompt: 'Thành ngữ “卧薪尝胆” kể về nhân vật lịch sử nào?',
      options: ['Việt Vương Câu Tiễn', 'Tần Thủy Hoàng', 'Gia Cát Lượng', 'Tào Tháo'],
      correct: 0,
      explanation: '卧薪尝胆: Câu Tiễn nằm gai nếm mật phục thù nước Ngô.'
    },
    {
      category: 'Từ Vựng HSK',
      prompt: '“打算” có nghĩa phổ biến nhất là:',
      options: ['Dự định / Kế hoạch', 'Đánh đập', 'Dọn dẹp', 'Thắc mắc'],
      correct: 0,
      explanation: '打算 (dǎsuan) nghĩa là kế hoạch, dự định làm việc gì.'
    },
    {
      category: 'Từ Trái Nghĩa',
      prompt: 'Từ trái nghĩa của “骄傲” (Kiêu ngạo) là gì?',
      options: ['谦虚 (Khiêm tốn)', '自信 (Tự tin)', '诚实 (Thành thật)', '礼貌 (Lịch sự)'],
      correct: 0,
      explanation: '骄傲 (jiāo\'ào - Kiêu ngạo) đối nghĩa với 谦虚 (qiānxū - Khiêm tốn).'
    },
    {
      category: 'Pinyin & Thanh Điệu',
      prompt: 'Thanh điệu của chữ “一” trong “一个人” biến âm thành:',
      options: ['Thanh 2 (yí)', 'Thanh 4 (yì)', 'Thanh 1 (yī)', 'Thanh nhẹ (yi)'],
      correct: 0,
      explanation: 'Trước âm tiết mang thanh 4 (gè), “一” đổi sang thanh 2 (yí gèrén).'
    },
    {
      category: 'Lượng Từ Chuẩn Xác',
      prompt: 'Điền lượng từ: “一 ___ 伞” (Một chiếc ô)',
      options: ['把', '张', '顶', '根'],
      correct: 0,
      explanation: 'Vật có cán cầm như ô, dao, kéo dùng lượng từ “把” (yì bǎ sǎn).'
    },
    {
      category: 'Từ Vựng HSK',
      prompt: '“究竟” trong câu hỏi đồng nghĩa với từ nào?',
      options: ['到底 (Rốt cuộc)', '也许 (Có lẽ)', '必须 (Phải)', '特别 (Đặc biệt)'],
      correct: 0,
      explanation: '究竟 (jiūjìng) nghĩa là rốt cuộc, đồng nghĩa với 到底.'
    }
  ];

  // ---------------- SEEDED PSEUDO RANDOM NUMBER GENERATOR ----------------
  function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function hashStringToInt(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  // ---------------- STATE MANAGEMENT ----------------
  const ARENA_STORAGE_KEY = 'yuhan_pvp_arena_stats';
  let arenaStats = {
    wins: 0,
    losses: 0,
    draws: 0,
    highScore: 0,
    winStreak: 0,
    maxStreak: 0
  };

  let activeMode = 'ai';
  let currentDifficulty = 'normal';
  let currentRival = AI_RIVALS.normal;
  let friendChallengeConfig = null;

  let matchQuestions = [];
  let currentQuestionIndex = 0;
  let userScore = 0;
  let rivalScore = 0;
  let userStreak = 0;
  let maxMatchStreak = 0;
  let correctCount = 0;
  let battleTimeRemaining = 60;
  let battleTimerInterval = null;
  let rivalTimerTimeout = null;
  let speedGaugeInterval = null;
  let questionStartTime = 0;
  let isAnswerLocked = false;
  let isMatchRunning = false;
  let userAnswersLog = [];

  function loadArenaStats() {
    try {
      const saved = localStorage.getItem(ARENA_STORAGE_KEY);
      if (saved) arenaStats = Object.assign(arenaStats, JSON.parse(saved));
    } catch (e) {}
  }

  function saveArenaStats() {
    try {
      localStorage.setItem(ARENA_STORAGE_KEY, JSON.stringify(arenaStats));
    } catch (e) {}
  }

  // ---------------- QUESTION GENERATOR ----------------
  function generateMatchQuestions(count = 20, seedStr = null) {
    const rng = seedStr ? mulberry32(hashStringToInt(seedStr)) : Math.random;
    const pool = [];

    // Pull dynamic items from dictionaryData if available
    if (typeof dictionaryData !== 'undefined' && Array.isArray(dictionaryData) && dictionaryData.length > 50) {
      const dictSample = [...dictionaryData].sort(() => rng() - 0.5).slice(0, 30);
      dictSample.forEach(w => {
        if (!w.hanzi || !w.meaning) return;
        const distractors = dictionaryData
          .filter(d => d.hanzi !== w.hanzi && d.meaning)
          .sort(() => rng() - 0.5)
          .slice(0, 3)
          .map(d => d.meaning.split(/[,;]/)[0].trim());

        if (distractors.length === 3) {
          const mainMeaning = w.meaning.split(/[,;]/)[0].trim();
          const allOptions = [mainMeaning, ...distractors];
          const shuffled = allOptions
            .map((v, i) => ({ v, orig: i }))
            .sort(() => rng() - 0.5);

          pool.push({
            category: `Từ Vựng HSK ${w.hsk || ''}`,
            prompt: `Từ “${w.hanzi}” (${w.pinyin || ''}) có nghĩa là:`,
            options: shuffled.map(s => s.v),
            correct: shuffled.findIndex(s => s.orig === 0),
            explanation: `${w.hanzi} [${w.pinyin || ''}]: ${w.meaning}`
          });
        }
      });
    }

    // Pull from classifiers
    if (typeof classifiersData !== 'undefined' && Array.isArray(classifiersData) && classifiersData.length > 5) {
      const clsSample = [...classifiersData].sort(() => rng() - 0.5).slice(0, 8);
      clsSample.forEach(c => {
        if (!c.char || !c.examples || !c.examples.length) return;
        const ex = c.examples[Math.floor(rng() * c.examples.length)];
        const promptText = `Lượng từ chuẩn cho “${ex.noun || ex.hanzi || '...' }” là:`;
        const distractors = classifiersData
          .filter(x => x.char !== c.char)
          .sort(() => rng() - 0.5)
          .slice(0, 3)
          .map(x => x.char);
        if (distractors.length === 3) {
          const allOpts = [c.char, ...distractors];
          const shuffled = allOpts
            .map((v, i) => ({ v, orig: i }))
            .sort(() => rng() - 0.5);
          pool.push({
            category: 'Lượng Từ Chuẩn Xác',
            prompt: promptText,
            options: shuffled.map(s => s.v),
            correct: shuffled.findIndex(s => s.orig === 0),
            explanation: `Lượng từ chuẩn là “${c.char}” (${c.pinyin || ''}). ${c.usage || ''}`
          });
        }
      });
    }

    // Blend in curated fallback questions
    FALLBACK_QUESTIONS.forEach(q => {
      const shuffled = q.options
        .map((v, i) => ({ v, orig: i }))
        .sort(() => rng() - 0.5);
      pool.push({
        category: q.category,
        prompt: q.prompt,
        options: shuffled.map(s => s.v),
        correct: shuffled.findIndex(s => s.orig === q.correct),
        explanation: q.explanation
      });
    });

    return pool.sort(() => rng() - 0.5).slice(0, count);
  }

  // ---------------- DOM TARGET & RENDER ----------------
  function getArenaContainer() {
    return document.getElementById('pvpArenaContent') || document.getElementById('tab-arena-content');
  }

  function openPvPArenaModal(mode = 'ai', params = {}) {
    loadArenaStats();
    activeMode = mode;
    friendChallengeConfig = params.room ? params : null;

    if (friendChallengeConfig && friendChallengeConfig.difficulty) {
      currentDifficulty = friendChallengeConfig.difficulty;
    }
    currentRival = AI_RIVALS[currentDifficulty] || AI_RIVALS.normal;

    // Preload heavy data in background
    if (typeof window.loadDatasets === 'function') {
      window.loadDatasets(['dictionary', 'classifiers', 'chengyu']);
    }

    const modal = document.getElementById('pvpArenaModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    renderArenaLobby();
    if (typeof refreshIcons === 'function') refreshIcons(modal);

    getPvPAudioContext();
  }

  function closePvPArenaModal() {
    if (isMatchRunning) {
      if (!confirm('Trận đấu đang diễn ra! Bạn có chắc muốn rút lui và bị xử thua ván này không?')) {
        return;
      }
      endPvPMatch(false);
    }
    const modal = document.getElementById('pvpArenaModal');
    if (modal) modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    clearInterval(battleTimerInterval);
    clearInterval(speedGaugeInterval);
    clearTimeout(rivalTimerTimeout);
    isMatchRunning = false;
  }

  function selectPvPArenaDifficulty(diff) {
    if (!AI_RIVALS[diff]) return;
    currentDifficulty = diff;
    currentRival = AI_RIVALS[diff];
    playPvPSfx('click');
    renderArenaLobby();
  }

  function renderArenaLobby() {
    const container = getArenaContainer();
    if (!container) return;

    const myName = (typeof userProfile !== 'undefined' && userProfile.name) || 'Học Viên Hán Ngữ';
    const myAvatar = '🧑‍🎓';

    let friendBoxHtml = '';
    if (activeMode === 'friend' && friendChallengeConfig) {
      friendBoxHtml = `
        <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-left space-y-1.5 mb-3">
          <div class="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <span>⚔️ LỜI THÁCH ĐẤU TỪ BẠN BÈ:</span>
            <span class="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[10px]">${friendChallengeConfig.room || 'PHÒNG ĐẤU'}</span>
          </div>
          <p class="text-xs text-stone-300">
            Bạn đang so tài với mục tiêu: <strong class="text-amber-300 font-mono text-sm">${friendChallengeConfig.target || 1200} điểm</strong> của <strong>${friendChallengeConfig.creator || 'Chiến Hữu'}</strong>!
          </p>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-4 text-center animate-fade-in py-1 select-none">
        <!-- Top Toolbar with Audio Toggle -->
        <div class="flex items-center justify-between pb-2 border-b border-amber-500/20">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black">
            <span>⚡ TỐC CHIẾN 60 GIÂY • ĐỐI KHÁNG 1VS1</span>
          </div>
          <button id="pvpAudioToggleBtn" onclick="togglePvPAudio()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm flex items-center justify-center transition-colors cursor-pointer" title="Bật/Tắt âm thanh">
            ${isPvPAudioMuted ? '🔇' : '🔊'}
          </button>
        </div>

        <div>
          <h2 class="text-xl sm:text-3xl font-serif-luxury font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
            Đấu Trường Hán Tự 1vs1
          </h2>
          <p class="text-[11px] sm:text-xs text-stone-300 mt-0.5 max-w-md mx-auto">
            Nhận diện chữ Hán, nghĩa từ vựng & pinyin với phản xạ cực nhanh trong 60 giây!
          </p>
        </div>

        ${friendBoxHtml}

        <!-- Dual Avatars Face-off -->
        <div class="grid grid-cols-5 items-center gap-2 p-3 sm:p-5 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-xl relative overflow-hidden">
          <!-- Player (Left) -->
          <div class="col-span-2 flex flex-col items-center space-y-1.5 relative z-10">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 border-2 border-cyan-300 flex items-center justify-center text-3xl shadow-lg ring-4 ring-blue-500/20">
              ${myAvatar}
            </div>
            <div class="text-center">
              <span class="text-xs font-bold text-white block truncate max-w-[110px] sm:max-w-none">${myName}</span>
              <span class="text-[9px] text-cyan-300 font-mono">BẠN (Phe Xanh)</span>
            </div>
          </div>

          <!-- VS Center Badge -->
          <div class="col-span-1 flex flex-col items-center justify-center relative z-10">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-600 via-amber-600 to-yellow-500 flex items-center justify-center font-black text-stone-950 text-xs sm:text-sm shadow-xl animate-pulse ring-4 ring-amber-400/30">
              VS
            </div>
            <span class="text-[8px] text-amber-200/90 font-bold mt-1">60 GIÂY</span>
          </div>

          <!-- Rival (Right) -->
          <div class="col-span-2 flex flex-col items-center space-y-1.5 relative z-10">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-800 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg ring-4 ring-red-500/20">
              ${currentRival.avatar}
            </div>
            <div class="text-center">
              <span class="text-xs font-bold text-white block truncate max-w-[110px] sm:max-w-none">${currentRival.name}</span>
              <span class="text-[9px] text-rose-300 font-mono">ĐỐI THỦ (Phe Đỏ)</span>
            </div>
          </div>
        </div>

        <!-- AI Selector -->
        <div class="space-y-1.5 text-left">
          <label class="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
            <i data-lucide="crosshair" class="w-3.5 h-3.5 text-amber-400"></i>
            <span>CHỌN ĐỐI THỦ SO TÀI:</span>
          </label>
          <div class="grid grid-cols-3 gap-2">
            ${['easy', 'normal', 'hard'].map(k => {
              const r = AI_RIVALS[k];
              const isSel = currentDifficulty === k;
              return `
                <button onclick="selectPvPArenaDifficulty('${k}')" class="p-2.5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${isSel ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/50 shadow-md' : 'bg-slate-900/60 border-slate-700/80 text-stone-400 hover:border-slate-500'}">
                  <div class="flex items-center justify-between">
                    <span class="text-lg">${r.avatar}</span>
                    <span class="text-[8px] px-1.5 py-0.2 rounded-full ${r.badge}">${r.levelText.split(' ')[0]}</span>
                  </div>
                  <div class="mt-1.5">
                    <span class="text-[11px] font-bold block text-stone-100">${r.name.split(' ')[0]}</span>
                    <span class="text-[9px] text-stone-400 block">${r.levelText}</span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Stats Strip -->
        <div class="grid grid-cols-4 gap-2 p-2.5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs">
          <div>
            <span class="text-[9px] text-stone-400 block">Thắng / Thua</span>
            <span class="font-bold text-emerald-400 font-mono">${arenaStats.wins}W</span>
            <span class="text-stone-500">/</span>
            <span class="font-bold text-rose-400 font-mono">${arenaStats.losses}L</span>
          </div>
          <div>
            <span class="text-[9px] text-stone-400 block">Kỷ lục điểm</span>
            <span class="font-bold text-amber-300 font-mono">${arenaStats.highScore.toLocaleString('vi-VN')}</span>
          </div>
          <div>
            <span class="text-[9px] text-stone-400 block">Chuỗi thắng</span>
            <span class="font-bold text-yellow-400 font-mono">🔥 ${arenaStats.winStreak}</span>
          </div>
          <div>
            <span class="text-[9px] text-stone-400 block">Max Combo</span>
            <span class="font-bold text-cyan-300 font-mono">⚡ x${arenaStats.maxStreak || 1}</span>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
          <button onclick="startPvPMatch()" class="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-stone-950 font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span class="text-base">⚔️</span>
            <span>VÀO TRẬN NGAY (CHIẾN!)</span>
          </button>
          <button onclick="copyPvPChallengeLink()" class="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-400/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <i data-lucide="share-2" class="w-4 h-4"></i>
            <span>Tạo Link Thách Đấu Bạn Bè</span>
          </button>
        </div>
      </div>
    `;

    if (typeof refreshIcons === 'function') refreshIcons(container);
  }

  // ---------------- COUNTDOWN & BATTLE ----------------
  function startPvPMatch() {
    isMatchRunning = true;
    userScore = 0;
    rivalScore = 0;
    userStreak = 0;
    maxMatchStreak = 0;
    correctCount = 0;
    battleTimeRemaining = 60;
    currentQuestionIndex = 0;
    userAnswersLog = [];
    isAnswerLocked = false;

    const seed = friendChallengeConfig ? friendChallengeConfig.room : null;
    matchQuestions = generateMatchQuestions(30, seed);

    playPvPSfx('click');

    const container = getArenaContainer();
    if (!container) return;

    let countdown = 3;
    container.innerHTML = `
      <div class="h-72 flex flex-col items-center justify-center space-y-3 animate-fade-in select-none">
        <span class="text-xs font-bold text-amber-300 uppercase tracking-widest">SẴN SÀNG PHẢN XẠ</span>
        <div id="pvpCountdownNumber" class="text-7xl sm:text-8xl font-black font-serif-luxury text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-red-600 animate-bounce">
          ${countdown}
        </div>
        <p class="text-xs text-stone-400 font-mono">Trận đấu bắt đầu sau giây lát...</p>
      </div>
    `;

    playPvPSfx('countdown');

    const cdInterval = setInterval(() => {
      countdown--;
      const el = document.getElementById('pvpCountdownNumber');
      if (countdown > 0) {
        if (el) el.innerText = countdown;
        playPvPSfx('countdown');
      } else if (countdown === 0) {
        if (el) {
          el.innerText = 'CHIẾN!';
          el.className = 'text-5xl sm:text-7xl font-black text-amber-300 animate-pulse';
        }
        playPvPSfx('start');
      } else {
        clearInterval(cdInterval);
        launchBattleLoop();
      }
    }, 850);
  }

  function launchBattleLoop() {
    renderBattleStage();

    clearInterval(battleTimerInterval);
    battleTimerInterval = setInterval(() => {
      battleTimeRemaining--;
      updateBattleTimerUI();

      if (battleTimeRemaining <= 0) {
        clearInterval(battleTimerInterval);
        clearInterval(speedGaugeInterval);
        clearTimeout(rivalTimerTimeout);
        endPvPMatch(true);
      }
    }, 1000);

    presentQuestion(0);
  }

  function renderBattleStage() {
    const container = getArenaContainer();
    if (!container) return;

    const myName = (typeof userProfile !== 'undefined' && userProfile.name) || 'Bạn';

    container.innerHTML = `
      <div class="space-y-3 max-w-2xl mx-auto animate-fade-in select-none relative">
        <!-- Floating Score/Combat Popups Container -->
        <div id="pvpFloatingPopupLayer" class="absolute inset-0 pointer-events-none z-30"></div>

        <!-- Top Combat Status Bar -->
        <div class="grid grid-cols-12 items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-slate-900/95 border border-amber-500/40 shadow-xl">
          <!-- Player Profile (Left) -->
          <div class="col-span-5 flex items-center gap-2">
            <div id="pvpPlayerAvatarBox" class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-600/30 border border-cyan-400 flex items-center justify-center text-lg sm:text-xl shrink-0 transition-transform">
              🧑‍🎓
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1">
                <span class="text-xs font-bold text-white truncate">${myName}</span>
                <span id="pvpUserStreakBadge" class="hidden text-[9px] px-1.5 py-0.2 rounded-full bg-yellow-400 text-stone-950 font-black">x1</span>
              </div>
              <div class="text-sm sm:text-lg font-black font-mono text-cyan-300" id="pvpUserScore">
                0
              </div>
            </div>
          </div>

          <!-- Central Timer -->
          <div class="col-span-2 flex flex-col items-center justify-center">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-400/80 bg-slate-950 flex flex-col items-center justify-center shadow-lg relative" id="pvpTimerCircle">
              <span class="text-xs sm:text-sm font-black font-mono text-amber-300" id="pvpTimerDisplay">60</span>
              <span class="text-[6px] text-stone-400 -mt-1 font-bold">GIÂY</span>
            </div>
          </div>

          <!-- Rival Profile (Right) -->
          <div class="col-span-5 flex items-center justify-end gap-2 text-right">
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-end gap-1">
                <span id="pvpRivalActionBadge" class="hidden text-[9px] px-1.5 py-0.2 rounded bg-rose-500 text-white font-bold">+100</span>
                <span class="text-xs font-bold text-white truncate">${currentRival.name.split(' ')[0]}</span>
              </div>
              <div class="text-sm sm:text-lg font-black font-mono text-rose-400" id="pvpRivalScore">
                0
              </div>
            </div>
            <div id="pvpRivalAvatarBox" class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-rose-600/30 border border-rose-400 flex items-center justify-center text-lg sm:text-xl shrink-0 transition-transform">
              ${currentRival.avatar}
            </div>
          </div>
        </div>

        <!-- Relative Score Tug-of-War Bar -->
        <div class="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
          <div id="pvpUserScoreBar" class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300" style="width: 50%;"></div>
          <div id="pvpRivalScoreBar" class="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-300" style="width: 50%;"></div>
        </div>

        <!-- Question Card with Per-Item Speed Gauge Bar -->
        <div id="pvpQuestionCard" class="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border-2 border-amber-400/40 shadow-2xl space-y-4 text-center relative overflow-hidden transition-all">
          <!-- Speed Gauge Bar (Shrinks across 4 seconds) -->
          <div class="w-full bg-slate-950 h-1 rounded-full overflow-hidden absolute top-0 left-0 right-0">
            <div id="pvpSpeedGaugeBar" class="h-full bg-gradient-to-r from-amber-400 to-yellow-300 w-full transition-all duration-100 ease-linear"></div>
          </div>

          <div class="flex items-center justify-between text-xs text-stone-400 border-b border-slate-800 pb-2">
            <span id="pvpQuestionCategory" class="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
              TỪ VỰNG HSK
            </span>
            <span id="pvpQuestionCounter" class="font-mono text-stone-400 text-xs">
              Câu 1 / 30
            </span>
          </div>

          <!-- Prompt -->
          <div class="py-1">
            <h3 id="pvpQuestionPrompt" class="text-lg sm:text-2xl font-chinese font-bold text-amber-100 tracking-wide min-h-[46px] flex items-center justify-center">
              Đang tải câu hỏi...
            </h3>
          </div>

          <!-- 4 Answer Options -->
          <div id="pvpOptionsGrid" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1"></div>
        </div>
      </div>
    `;

    updateBattleTimerUI();
  }

  function updateBattleTimerUI() {
    const timerDisplay = document.getElementById('pvpTimerDisplay');
    const timerCircle = document.getElementById('pvpTimerCircle');
    if (!timerDisplay) return;

    timerDisplay.innerText = battleTimeRemaining;
    if (battleTimeRemaining <= 10) {
      timerDisplay.className = 'text-xs sm:text-sm font-black font-mono text-red-400 animate-pulse';
      if (timerCircle) timerCircle.className = 'w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-red-500 bg-red-950/40 flex flex-col items-center justify-center shadow-lg relative animate-pulse ring-4 ring-red-500/30';
      if (battleTimeRemaining % 2 === 0) playPvPSfx('countdown');
    }
  }

  function updateScoreBars() {
    const total = userScore + rivalScore;
    const userBar = document.getElementById('pvpUserScoreBar');
    const rivalBar = document.getElementById('pvpRivalScoreBar');
    const userDisplay = document.getElementById('pvpUserScore');
    const rivalDisplay = document.getElementById('pvpRivalScore');

    if (userDisplay) userDisplay.innerText = userScore.toLocaleString('vi-VN');
    if (rivalDisplay) rivalDisplay.innerText = rivalScore.toLocaleString('vi-VN');

    if (userBar && rivalBar) {
      if (total === 0) {
        userBar.style.width = '50%';
        rivalBar.style.width = '50%';
      } else {
        const uPct = Math.max(10, Math.min(90, Math.round((userScore / total) * 100)));
        userBar.style.width = `${uPct}%`;
        rivalBar.style.width = `${100 - uPct}%`;
      }
    }
  }

  // ---------------- PRESENT QUESTION & SPEED GAUGE ----------------
  function presentQuestion(idx) {
    if (idx >= matchQuestions.length || battleTimeRemaining <= 0) {
      endPvPMatch(true);
      return;
    }

    currentQuestionIndex = idx;
    const q = matchQuestions[idx];
    questionStartTime = Date.now();
    isAnswerLocked = false;

    const catEl = document.getElementById('pvpQuestionCategory');
    const countEl = document.getElementById('pvpQuestionCounter');
    const promptEl = document.getElementById('pvpQuestionPrompt');
    const gridEl = document.getElementById('pvpOptionsGrid');

    if (catEl) catEl.innerText = q.category;
    if (countEl) countEl.innerText = `Câu ${idx + 1} / ${matchQuestions.length}`;
    if (promptEl) promptEl.innerText = q.prompt;

    if (gridEl) {
      gridEl.innerHTML = q.options.map((opt, optIdx) => `
        <button 
          id="pvpOptBtn_${optIdx}"
          onclick="submitPvPAnswer(${optIdx})"
          class="p-3 sm:p-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400 text-stone-100 font-bold text-xs sm:text-sm transition-all duration-100 flex items-center gap-2.5 cursor-pointer group text-left">
          <span class="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 text-xs font-mono flex items-center justify-center shrink-0 group-hover:border-amber-400">
            ${['A', 'B', 'C', 'D'][optIdx]}
          </span>
          <span class="flex-1">${opt}</span>
        </button>
      `).join('');
    }

    // Start per-question speed gauge (4 seconds)
    startQuestionSpeedGauge();

    // Schedule AI Rival
    scheduleRivalResponse(q);
  }

  function startQuestionSpeedGauge() {
    clearInterval(speedGaugeInterval);
    const gauge = document.getElementById('pvpSpeedGaugeBar');
    if (!gauge) return;
    gauge.style.width = '100%';

    const duration = 4000;
    const start = Date.now();
    speedGaugeInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      if (gauge) gauge.style.width = `${pct}%`;
      if (pct <= 0) clearInterval(speedGaugeInterval);
    }, 100);
  }

  function scheduleRivalResponse(question) {
    clearTimeout(rivalTimerTimeout);
    let delay;
    let isCorrect;

    if (activeMode === 'friend' && friendChallengeConfig && friendChallengeConfig.target) {
      delay = 1800 + Math.random() * 1400;
      isCorrect = Math.random() < 0.85;
    } else {
      const minD = currentRival.speedMin || 1800;
      const maxD = currentRival.speedMax || 2800;
      delay = minD + Math.random() * (maxD - minD);
      isCorrect = Math.random() < currentRival.accuracy;
    }

    rivalTimerTimeout = setTimeout(() => {
      if (!isMatchRunning) return;

      if (isCorrect) {
        const pts = 100 + Math.floor(Math.random() * 30);
        rivalScore += pts;
        showRivalActionFeedback(`+${pts}`);
      } else {
        showRivalActionFeedback('Sai!');
      }
      updateScoreBars();
    }, delay);
  }

  function showRivalActionFeedback(text) {
    const badge = document.getElementById('pvpRivalActionBadge');
    if (!badge) return;
    badge.innerText = text;
    badge.className = 'text-[9px] px-1.5 py-0.2 rounded font-bold animate-bounce ' +
      (text.includes('+') ? 'bg-emerald-500 text-white' : 'bg-stone-700 text-stone-300');
    badge.classList.remove('hidden');
    setTimeout(() => {
      badge.classList.add('hidden');
    }, 1200);
  }

  // ---------------- SUBMIT ANSWER & COMBAT DYNAMICS ----------------
  function submitPvPAnswer(optIdx) {
    if (isAnswerLocked || !isMatchRunning) return;
    isAnswerLocked = true;
    clearInterval(speedGaugeInterval);

    const q = matchQuestions[currentQuestionIndex];
    const isCorrect = optIdx === q.correct;
    const responseDuration = (Date.now() - questionStartTime) / 1000;

    userAnswersLog.push({
      question: q,
      chosen: optIdx,
      isCorrect: isCorrect,
      time: responseDuration
    });

    const chosenBtn = document.getElementById(`pvpOptBtn_${optIdx}`);
    const correctBtn = document.getElementById(`pvpOptBtn_${q.correct}`);
    const cardEl = document.getElementById('pvpQuestionCard');

    if (isCorrect) {
      correctCount++;
      userStreak++;
      if (userStreak > maxMatchStreak) maxMatchStreak = userStreak;

      const speedBonus = Math.max(0, Math.floor((3.5 - responseDuration) * 10));
      let multiplier = 1.0;
      if (userStreak >= 5) multiplier = 2.0;
      else if (userStreak >= 3) multiplier = 1.5;
      else if (userStreak >= 2) multiplier = 1.2;

      const earnedPts = Math.round((100 + speedBonus) * multiplier);
      userScore += earnedPts;

      if (chosenBtn) {
        chosenBtn.className = 'p-3 sm:p-3.5 rounded-2xl bg-emerald-600/95 border-2 border-emerald-300 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2.5';
      }

      // Spawn floating score popup
      spawnFloatingScore(`+${earnedPts} PTS` + (userStreak >= 2 ? ` (Combo x${multiplier})` : ''));

      if (userStreak >= 2) {
        playPvPSfx('combo', userStreak);
        showStreakBanner(userStreak);
      } else {
        playPvPSfx('correct');
      }
    } else {
      userStreak = 0;
      playPvPSfx('wrong');

      if (chosenBtn) {
        chosenBtn.className = 'p-3 sm:p-3.5 rounded-2xl bg-rose-600/95 border-2 border-rose-300 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2.5';
      }
      if (correctBtn) {
        correctBtn.className = 'p-3 sm:p-3.5 rounded-2xl bg-emerald-700/60 border border-emerald-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5';
      }

      // Screen shake on wrong answer
      if (cardEl) {
        cardEl.classList.remove('arena-screen-shake');
        void cardEl.offsetWidth;
        cardEl.classList.add('arena-screen-shake');
      }

      hideStreakBanner();
    }

    updateScoreBars();

    setTimeout(() => {
      if (isMatchRunning) {
        presentQuestion(currentQuestionIndex + 1);
      }
    }, 420);
  }

  function spawnFloatingScore(text) {
    const layer = document.getElementById('pvpFloatingPopupLayer');
    if (!layer) return;

    const popup = document.createElement('div');
    popup.className = 'absolute top-10 left-12 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-stone-950 font-black text-xs font-mono shadow-xl float-score-popup z-40';
    popup.innerText = text;
    layer.appendChild(popup);

    setTimeout(() => popup.remove(), 950);
  }

  function showStreakBanner(streak) {
    const badge = document.getElementById('pvpUserStreakBadge');
    if (!badge) return;
    badge.innerText = `Combo x${streak}!`;
    badge.classList.remove('hidden');
  }

  function hideStreakBanner() {
    const badge = document.getElementById('pvpUserStreakBadge');
    if (badge) badge.classList.add('hidden');
  }

  // ---------------- MATCH FINISH & EVALUATION ----------------
  function endPvPMatch(naturalFinish = true) {
    isMatchRunning = false;
    clearInterval(battleTimerInterval);
    clearInterval(speedGaugeInterval);
    clearTimeout(rivalTimerTimeout);

    const isVictory = userScore > rivalScore;
    const isDraw = userScore === rivalScore;

    if (isVictory) {
      arenaStats.wins++;
      arenaStats.winStreak++;
      if (arenaStats.winStreak > arenaStats.maxStreak) arenaStats.maxStreak = arenaStats.winStreak;
      playPvPSfx('victory');
    } else if (isDraw) {
      arenaStats.draws++;
    } else {
      arenaStats.losses++;
      arenaStats.winStreak = 0;
      playPvPSfx('defeat');
    }

    if (userScore > arenaStats.highScore) arenaStats.highScore = userScore;
    saveArenaStats();

    const expAwarded = isVictory ? 50 : (isDraw ? 25 : 15);
    if (typeof addExp === 'function') addExp(expAwarded, 'pvp_arena');

    renderMatchResult(isVictory, isDraw, expAwarded);
  }

  function renderMatchResult(isVictory, isDraw, expEarned) {
    const container = getArenaContainer();
    if (!container) return;

    let bannerGradient = 'from-emerald-600 via-teal-600 to-emerald-800';
    let bannerTitle = '🏆 THẮNG LỢI VANG DỘI!';
    let bannerSubtitle = 'Bạn đã đánh bại đối thủ bằng tốc độ phản xạ xuất sắc!';
    let trophyIcon = '👑';

    if (isDraw) {
      bannerGradient = 'from-amber-600 via-yellow-600 to-amber-700';
      bannerTitle = '🤝 BẤT PHÂN THẮNG BẠI!';
      bannerSubtitle = 'Hai cao thủ giằng co ngang ngửa đến giây cuối cùng!';
      trophyIcon = '⚖️';
    } else if (!isVictory) {
      bannerGradient = 'from-rose-700 via-red-800 to-slate-900';
      bannerTitle = '💔 THUA CUỘC TIẾC NUỐI!';
      bannerSubtitle = 'Đối thủ nhanh tay hơn một nhịp. Hãy phục thù ván sau ngay!';
      trophyIcon = '🛡️';
    }

    container.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-4 text-center animate-fade-in py-1 select-none">
        <div class="p-5 sm:p-7 rounded-3xl bg-gradient-to-br ${bannerGradient} text-white shadow-2xl relative overflow-hidden border-2 border-amber-400/50">
          <div class="text-4xl sm:text-5xl mb-1 animate-bounce">${trophyIcon}</div>
          <h2 class="text-xl sm:text-3xl font-serif-luxury font-black tracking-tight">${bannerTitle}</h2>
          <p class="text-xs text-amber-100/90 mt-0.5 max-w-md mx-auto">${bannerSubtitle}</p>

          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/60 border border-amber-300/40 text-amber-300 font-bold text-xs mt-3">
            <span>🎁 THƯỞNG KẾT TRẬN:</span>
            <span class="font-mono text-white text-sm font-black">+${expEarned} EXP</span>
          </div>
        </div>

        <!-- Scoreboard Comparison -->
        <div class="grid grid-cols-2 gap-3 p-4 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-stone-100">
          <div class="text-center p-3 rounded-2xl bg-blue-500/10 border border-cyan-400/30">
            <span class="text-xs text-cyan-300 font-bold block">ĐIỂM CỦA BẠN</span>
            <span class="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5 block">
              ${userScore.toLocaleString('vi-VN')}
            </span>
            <span class="text-[10px] text-stone-400">Đúng ${correctCount}/${userAnswersLog.length} • Max x${maxMatchStreak || 1}</span>
          </div>

          <div class="text-center p-3 rounded-2xl bg-rose-500/10 border border-rose-400/30">
            <span class="text-xs text-rose-300 font-bold block">${currentRival.name}</span>
            <span class="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5 block">
              ${rivalScore.toLocaleString('vi-VN')}
            </span>
            <span class="text-[10px] text-stone-400">${currentRival.levelText}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button onclick="startPvPMatch()" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 text-stone-950 font-black text-xs shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span>🔄</span>
            <span>TÁI ĐẤU NGAY</span>
          </button>
          <button onclick="copyPvPChallengeLink(${userScore})" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
            <span>Thách Đấu (${userScore} Điểm)</span>
          </button>
          <button onclick="renderArenaLobby()" class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs cursor-pointer">
            <span>Về Phòng Chờ</span>
          </button>
        </div>

        <!-- Answers Review Accordion -->
        <details class="text-left p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs cursor-pointer">
          <summary class="font-bold text-amber-300 flex items-center justify-between">
            <span>📖 Xem lại đáp án trong trận (${userAnswersLog.length} câu)</span>
            <span class="text-[10px] text-stone-500">Mở</span>
          </summary>
          <div class="space-y-2 pt-2.5 mt-2.5 border-t border-slate-800 text-stone-300">
            ${userAnswersLog.map((log, i) => `
              <div class="p-2 rounded-xl ${log.isCorrect ? 'bg-emerald-950/30 border border-emerald-500/30' : 'bg-rose-950/30 border border-rose-500/30'}">
                <div class="flex items-center justify-between font-bold">
                  <span>Câu ${i + 1}: ${log.question.prompt}</span>
                  <span class="${log.isCorrect ? 'text-emerald-400' : 'text-rose-400'}">${log.isCorrect ? '✓ Đúng' : '✗ Sai'}</span>
                </div>
                <p class="text-[11px] text-stone-400 mt-0.5">${log.question.explanation}</p>
              </div>
            `).join('')}
          </div>
        </details>
      </div>
    `;

    if (typeof refreshIcons === 'function') refreshIcons(container);
  }

  // ---------------- VIRAL CHALLENGE SHARE ----------------
  function copyPvPChallengeLink(score = null) {
    const targetScore = score || arenaStats.highScore || 1000;
    const roomCode = 'ARENA-' + Math.floor(10000 + Math.random() * 90000);
    const myName = (typeof userProfile !== 'undefined' && userProfile.name) || 'Học viên Hán Ngữ';

    const challengeUrl = `${window.location.origin}${window.location.pathname}#/arena?room=${roomCode}&target=${targetScore}&creator=${encodeURIComponent(myName)}`;
    const shareText = `⚔️ Tôi vừa đạt ${targetScore.toLocaleString('vi-VN')} điểm trong Đấu Trường Hán Tự 1vs1! Bạn có dám vào so tài phản xạ tiếng Trung với tôi không? 👉 ${challengeUrl}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        if (typeof showToast === 'function') {
          showToast('Đã sao chép link thách đấu! Hãy gửi cho bạn bè qua Zalo, Facebook hoặc Threads!', 'success');
        } else {
          alert('Đã sao chép link thách đấu!');
        }
      }).catch(() => {
        prompt('Hãy sao chép link sau để gửi cho bạn bè:', shareText);
      });
    } else {
      prompt('Hãy sao chép link sau để gửi cho bạn bè:', shareText);
    }
  }

  function initPvPArenaTab() {
    loadArenaStats();
    activeMode = 'ai';
    const params = typeof getHashParams === 'function' ? getHashParams() : new URLSearchParams();
    friendChallengeConfig = params.get('room') ? {
      room: params.get('room'),
      target: parseInt(params.get('target') || '1200', 10),
      creator: params.get('creator') || 'Chiến Hữu'
    } : null;

    if (friendChallengeConfig && friendChallengeConfig.difficulty) {
      currentDifficulty = friendChallengeConfig.difficulty;
    }
    currentRival = AI_RIVALS[currentDifficulty] || AI_RIVALS.normal;

    renderArenaLobby();
    const tabEl = document.getElementById('tab-arena');
    if (typeof refreshIcons === 'function' && tabEl) refreshIcons(tabEl);
    getPvPAudioContext();
  }

  function isPvPBattleActive() {
    return isMatchRunning;
  }

  // ---------------- EXPORTS ----------------
  root.initPvPArenaTab = initPvPArenaTab;
  root.openPvPArenaModal = openPvPArenaModal;
  root.closePvPArenaModal = closePvPArenaModal;
  root.selectPvPArenaDifficulty = selectPvPArenaDifficulty;
  root.startPvPMatch = startPvPMatch;
  root.submitPvPAnswer = submitPvPAnswer;
  root.copyPvPChallengeLink = copyPvPChallengeLink;
  root.isPvPBattleActive = isPvPBattleActive;
  root.togglePvPAudio = togglePvPAudio;

})(typeof window !== 'undefined' ? window : globalThis);
