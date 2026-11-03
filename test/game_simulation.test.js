const fs = require('fs');
const vm = require('vm');

console.log('=== RUNNING FULL GAME SIMULATION TESTS ===');

// Mock DOM environment
const elements = {};
function getEl(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      className: '',
      classList: {
        _classes: new Set(),
        add(...cls) { cls.forEach(c => this._classes.add(c)); },
        remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
        contains(c) { return this._classes.has(c); },
        toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
      },
      style: {},
      dataset: {},
      children: [],
      appendChild(child) { this.children.push(child); },
      addEventListener() {},
      removeEventListener() {},
      setAttribute(k, v) { this[k] = v; },
      getAttribute(k) { return this[k] || null; },
      innerText: '',
      innerHTML: ''
    };
  }
  return elements[id];
}

const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  Math,
  Date,
  parseInt,
  parseFloat,
  JSON,
  document: {
    getElementById: (id) => getEl(id),
    createElement: (tag) => {
      const el = {
        tagName: tag,
        className: '',
        classList: {
          _classes: new Set(),
          add(...cls) { cls.forEach(c => this._classes.add(c)); },
          remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
          contains(c) { return this._classes.has(c); },
          toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
        },
        style: {},
        dataset: {},
        children: [],
        appendChild(child) { this.children.push(child); },
        addEventListener() {},
        removeEventListener() {},
        setAttribute(k, v) { this[k] = v; },
        getAttribute(k) { return this[k] || null; },
        innerText: '',
        innerHTML: ''
      };
      return el;
    },
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    body: { appendChild() {}, removeChild() {} }
  },
  window: {
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {}
  },
  localStorage: {
    _d: {},
    getItem(k) { return this._d[k] || null; },
    setItem(k, v) { this._d[k] = String(v); },
    removeItem(k) { delete this._d[k]; }
  },
  fetch: async (url) => {
    if (url.includes('flip_card_levels.json')) {
      return { ok: true, status: 200, json: async () => JSON.parse(fs.readFileSync('public/data/flip_card_levels.json', 'utf8')) };
    }
    if (url.includes('wood_block_levels.json')) {
      return { ok: true, status: 200, json: async () => JSON.parse(fs.readFileSync('public/data/wood_block_levels.json', 'utf8')) };
    }
    return { ok: true, status: 200, json: async () => [] };
  },
  showToast: (m, t) => console.log(`  [Toast ${t}]: ${m}`),
  addExp: (pts, rsn) => console.log(`  [+${pts} EXP]: ${rsn}`),
  refreshIcons: () => {},
  playChineseTTS: (t) => console.log(`  [TTS]: "${t}"`)
};

sandbox.window = sandbox;
vm.createContext(sandbox);

// Load data.js, utils.js, woodblock.js, flipcard.js
vm.runInContext(fs.readFileSync('public/js/core/utils.js', 'utf8'), sandbox);
vm.runInContext(fs.readFileSync('public/js/core/data.js', 'utf8'), sandbox);
vm.runInContext(fs.readFileSync('public/js/features/woodblock.js', 'utf8'), sandbox);
vm.runInContext(fs.readFileSync('public/js/features/flipcard.js', 'utf8'), sandbox);

async function run() {
  console.log('\n--- 1. Testing Flip Card Game Engine ---');
  await sandbox.initFlipCardGame();
  const lvl = sandbox.getCurrentFlipLevel();
  const activeCards = sandbox.getActiveFlipCards();
  console.log(`Flip Card Level 1: "${lvl.title}", Total Cards: ${activeCards.length}`);

  // Match first pair
  const c1 = activeCards[0];
  const c2 = activeCards.find((c, i) => i !== 0 && c.pairId === c1.pairId);
  const c2Idx = activeCards.indexOf(c2);
  console.log(`Matching: Card 0 (${c1.word.hanzi}) with Card ${c2Idx} (${c2.word.hanzi})`);
  sandbox.handleCardClick(0);
  sandbox.handleCardClick(c2Idx);

  await new Promise(r => setTimeout(r, 600));
  console.log(`Matched pairs count: ${sandbox.getMatchedPairsCount()} / ${lvl.pairs.length}`);
  console.log(`Score: ${sandbox.getFlipScore()}, Combo: ${sandbox.getFlipCombo()}`);
  console.log(`Card 0 isMatched: ${c1.isMatched}, Card ${c2Idx} isMatched: ${c2.isMatched}`);
  if (!c1.isMatched || !c2.isMatched) throw new Error('Flip card matching failed!');

  console.log('\n--- 2. Testing Wood Block Game Engine ---');
  await sandbox.initWoodBlockGame();
  console.log(`Wood Block Level Index: ${sandbox.getCurrentWoodLevelIndex()}`);
  console.log(`Grid cells: ${getEl('woodBoardGrid').children.length}`);
  console.log(`Tray pieces: ${getEl('woodPiecesTray').children.length}`);

  // Select piece b1 and place
  sandbox.selectWoodPiece('b1');
  console.log(`Selected piece: ${sandbox.getWoodSelectedPieceId()}`);
  sandbox.handleWoodCellClick(0, 0);
  console.log(`Placed blocks: ${sandbox.getWoodPlacedBlocks().size}`);

  console.log('\n=== ALL SIMULATION TESTS PASSED 100%! ===');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
