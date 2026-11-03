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
