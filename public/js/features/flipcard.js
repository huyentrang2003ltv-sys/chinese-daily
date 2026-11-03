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
  if (descTextEl) descTextEl.innerText = lvl.description;

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
  cardDiv.onclick = () => handleCardClick(idx);

  const isSynonym = card.type === 'synonym';
  const badgeClass = isSynonym 
    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300' 
    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300';
  const badgeText = isSynonym ? '近义 • Đồng nghĩa' : '反义 • Trái nghĩa';

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
            onclick="event.stopPropagation(); playChineseTTS('${card.word.hanzi}');"
            class="p-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-stone-800 text-[10px] cursor-pointer shadow-2xs"
            title="Nghe phát âm"
          >
            🔊
          </button>
        </div>

        <!-- Center Hanzi & Pinyin -->
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
    // MISMATCH
    playCardMismatchSound();
    flipCombo = 1;
    updateFlipHudStats();

    if (cardEl1) cardEl1.classList.add('is-wrong');
    if (cardEl2) cardEl2.classList.add('is-wrong');

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
    }, 850);
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

  const isSynonym = pair.type === 'synonym';
  if (badge) {
    badge.innerText = isSynonym ? 'CẶP ĐỒNG NGHĨA' : 'CẶP TRÁI NGHĨA';
    badge.className = isSynonym 
      ? 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-2xs' 
      : 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-2xs';
  }

  const symbol = isSynonym ? '≈' : '≠';
  if (title) {
    title.innerText = `${pair.wordA.hanzi} (${pair.wordA.pinyin}) ${symbol} ${pair.wordB.hanzi} (${pair.wordB.pinyin})`;
  }
  if (meaning) meaning.innerText = pair.relationDesc;
  if (example) example.innerText = `"${pair.exampleSentence}"`;

  banner.classList.remove('hidden');

  // Speak both words
  setTimeout(() => {
    playChineseTTS(pair.wordA.hanzi);
    setTimeout(() => {
      playChineseTTS(pair.wordB.hanzi);
    }, 1100);
  }, 250);
}

function playCurrentMatchAudio() {
  if (!currentMatchPairData) return;
  playChineseTTS(currentMatchPairData.wordA.hanzi);
  setTimeout(() => {
    playChineseTTS(currentMatchPairData.wordB.hanzi);
  }, 1000);
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
      const isSyn = p.type === 'synonym';
      const symbol = isSyn ? '≈' : '≠';
      const badgeClass = isSyn ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800';
      return `
        <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2 shadow-2xs">
          <div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-1.5 py-0.2 rounded text-[9px] font-bold ${badgeClass}">${p.typeLabel}</span>
              <strong class="font-hanzi text-sm text-stone-900 dark:text-stone-100">${p.wordA.hanzi} (${p.wordA.pinyin})</strong>
              <span class="text-xs text-amber-600 font-bold">${symbol}</span>
              <strong class="font-hanzi text-sm text-stone-900 dark:text-stone-100">${p.wordB.hanzi} (${p.wordB.pinyin})</strong>
            </div>
            <p class="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">${p.relationDesc}</p>
          </div>
          <button 
            type="button" 
            onclick="playChineseTTS('${p.wordA.hanzi}'); setTimeout(() => playChineseTTS('${p.wordB.hanzi}'), 1000);"
            class="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs shrink-0 cursor-pointer shadow-2xs"
            title="Nghe phát âm cả cặp từ"
          >
            🔊
          </button>
        </div>
      `;
    }).join('');
  }

  modal.classList.remove('hidden');
  refreshIcons(modal);
}

function closeFlipCardVictoryModal() {
  const modal = document.getElementById('flipCardVictoryModal');
  if (modal) modal.classList.add('hidden');
}

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
  const btnSyn = document.getElementById('flipModeBtn-synonym');
  const btnAnt = document.getElementById('flipModeBtn-antonym');

  const activeCls = 'px-3 py-1.5 rounded-xl font-bold transition-all bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs cursor-pointer';
  const inactiveCls = 'px-3 py-1.5 rounded-xl font-bold transition-all text-stone-700 dark:text-stone-300 hover:text-[#8B1E1E] cursor-pointer';

  if (btnAll) btnAll.className = mode === 'all' ? activeCls : inactiveCls;
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
  const modal = document.getElementById('flipCardLevelModal');
  if (!modal) return;
  filterFlipCardLevelMap(flipActiveTierFilter);
  modal.classList.remove('hidden');
  refreshIcons(modal);
}

function closeFlipCardLevelModal() {
  const modal = document.getElementById('flipCardLevelModal');
  if (modal) modal.classList.add('hidden');
}

function filterFlipCardLevelMap(filter) {
  flipActiveTierFilter = filter;
  const btnAll = document.getElementById('flipFilterBtn-all');
  const btnSyn = document.getElementById('flipFilterBtn-synonym');
  const btnAnt = document.getElementById('flipFilterBtn-antonym');
  const btnMix = document.getElementById('flipFilterBtn-mixed');

  const activeCls = 'px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#BE123C] to-[#E11D48] text-white shadow-2xs cursor-pointer';
  const inactiveCls = 'px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-rose-700 cursor-pointer';

  if (btnAll) btnAll.className = filter === 'all' ? activeCls : inactiveCls;
  if (btnSyn) btnSyn.className = filter === 'synonym' ? activeCls : inactiveCls;
  if (btnAnt) btnAnt.className = filter === 'antonym' ? activeCls : inactiveCls;
  if (btnMix) btnMix.className = filter === 'mixed' ? activeCls : inactiveCls;

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
        <span>#${lvl.level}</span>
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
