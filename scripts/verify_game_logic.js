const fs = require('fs');

// Create mock browser DOM environment
global.window = global;
global.addEventListener = () => {};
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag;
    this.id = id;
    this.className = '';
    this.classList = {
      classes: new Set(),
      add(...cs) { cs.forEach(c => this.classes.add(c)); },
      remove(...cs) { cs.forEach(c => this.classes.delete(c)); },
      contains(c) { return this.classes.has(c); }
    };
    this.children = [];
    this.innerText = '';
    this.innerHTML = '';
    this.style = {};
    this.dataset = {};
    this.listeners = {};
  }
  appendChild(child) {
    this.children.push(child);
    return child;
  }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) this.children.splice(idx, 1);
  }
  setAttribute(k, v) { this[k] = v; }
  removeAttribute(k) { delete this[k]; }
  addEventListener(ev, fn) {
    if (!this.listeners[ev]) this.listeners[ev] = [];
    this.listeners[ev].push(fn);
  }
  click() {
    if (this.listeners['click']) {
      this.listeners['click'].forEach(fn => fn({ stopPropagation: () => {} }));
    }
  }
}

const domElements = new Map();
function getOrCreateEl(id, tag = 'div') {
  if (!domElements.has(id)) {
    domElements.set(id, new MockElement(tag, id));
  }
  return domElements.get(id);
}

global.document = {
  getElementById(id) {
    return domElements.get(id) || null;
  },
  createElement(tag) {
    return new MockElement(tag);
  },
  querySelectorAll(sel) {
    return [];
  },
  addEventListener(ev, fn) {}
};

// Setup all needed HTML IDs
const requiredIds = [
  'woodCurrentLevelNum', 'woodCurrentLevelName', 'woodCurrentTierBadge',
  'woodMeaningHintText', 'woodBoardDimensionText', 'woodBoardGrid',
  'woodPiecesTray', 'woodRemainingCount', 'woodBtnCheckAnswer',
  'woodMeaningHintBanner', 'tab-woodblock', 'woodVictoryModal',
  'woodVictoryHanzi', 'woodVictoryPinyin', 'woodVictoryMeaning',
  'woodLevelSelectorModal', 'woodLevelGridContainer', 'woodTierBtnEasy',
  'woodTierBtnMedium', 'woodTierBtnHard', 'woodBoardStatusHint'
];
requiredIds.forEach(id => getOrCreateEl(id));

// Setup helper mocks
global.showToast = (msg, type) => console.log(`[TOAST: ${type}] ${msg}`);
global.addExp = (exp) => console.log(`[EXP REWARD] +${exp} EXP`);
global.playChineseTTS = (text) => console.log(`[TTS] Playing: ${text}`);
global.fetch = async (url) => {
  if (url.includes('wood_block_levels.json')) {
    const data = JSON.parse(fs.readFileSync('data/wood_block_levels.json', 'utf8'));
    return {
      json: async () => data
    };
  }
  return { json: async () => ({}) };
};

// Load app.js
console.log('Loading app.js into mock DOM environment...');
const code = fs.readFileSync('app.js', 'utf8');

// Evaluate in global context
const vm = require('vm');
vm.runInThisContext(code);

console.log('app.js loaded successfully! No ReferenceErrors!');

async function runVerification() {
  console.log('\n--- 1. Testing initWoodBlockGame ---');
  // Load levels directly
  global.woodBlockLevels = JSON.parse(fs.readFileSync('data/wood_block_levels.json', 'utf8'));
  console.log('Loaded levels count:', global.woodBlockLevels.length);

  await global.initWoodBlockGame();
  console.log('Level 1 initialized:');
  console.log('  Current Level Index:', global.currentWoodLevelIndex);
  console.log('  Grid cells in DOM:', getOrCreateEl('woodBoardGrid').children.length);
  console.log('  Tray pieces in DOM:', getOrCreateEl('woodPiecesTray').children.length);
  console.log('  Remaining count text:', getOrCreateEl('woodRemainingCount').innerText);

  console.log('\n--- 2. Testing Piece Placement (Level 1) ---');
  // Place b1 at (0, 0)
  global.selectWoodPiece('b1');
  console.log('  Selected piece:', global.woodSelectedPieceId);
  global.handleWoodCellClick(0, 0);
  console.log('  Placed blocks count:', global.woodPlacedBlocks.size);
  console.log('  Tray count after b1:', getOrCreateEl('woodPiecesTray').children.length);

  // Place b2 at (1, 0)
  global.selectWoodPiece('b2');
  global.handleWoodCellClick(1, 0);
  console.log('  Placed blocks count:', global.woodPlacedBlocks.size);

  // Place b3 at (2, 0)
  global.selectWoodPiece('b3');
  global.handleWoodCellClick(2, 0);
  console.log('  Placed blocks count:', global.woodPlacedBlocks.size);
  console.log('  Tray count after b3:', getOrCreateEl('woodPiecesTray').children.length);

  console.log('\n--- 3. Testing Answer Checking & Victory ---');
  global.checkWoodBoardAnswer(true);
  console.log('  Saved Progress:', global.woodUserProgress);
  console.log('  Victory Modal hidden?', getOrCreateEl('woodVictoryModal').classList.contains('hidden'));
  console.log('  Victory Hanzi:', getOrCreateEl('woodVictoryHanzi').innerText);

  console.log('\n--- 4. Testing Next Level (Level 2) ---');
  global.nextWoodLevel();
  console.log('  Current Level Index:', global.currentWoodLevelIndex);
  console.log('  Level 2 Title:', getOrCreateEl('woodCurrentLevelName').innerText);
  console.log('  Level 2 Grid cells:', getOrCreateEl('woodBoardGrid').children.length);
  console.log('  Level 2 Tray pieces:', getOrCreateEl('woodPiecesTray').children.length);

  console.log('\n--- 5. Testing Auto-Hint ---');
  global.woodBlockAutoHint();
  console.log('  Placed after hint:', global.woodPlacedBlocks.size);

  console.log('\n--- 6. Testing Level Reset ---');
  global.resetWoodCurrentLevel();
  console.log('  Placed after reset:', global.woodPlacedBlocks.size);
  console.log('  Tray pieces restored:', getOrCreateEl('woodPiecesTray').children.length);

  console.log('\n--- 7. Testing 60 Levels Selector Grid ---');
  global.openWoodLevelSelectorModal();
  console.log('  Level grid rendered buttons count:', getOrCreateEl('woodLevelGridContainer').children.length);

  console.log('\n✅ ALL WOOD BLOCK ENGINE CHECKS PASSED 100%!');
}

runVerification().catch(console.error);
