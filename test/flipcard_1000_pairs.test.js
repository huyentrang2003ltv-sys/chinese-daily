// test/flipcard_1000_pairs.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

test('Flip Card 1000 Pairs Engine & Data Integrity', async (t) => {
  const levelsPath = path.join(__dirname, '../public/data/flip_card_levels.json');
  const levels = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));

  await t.test('Total Level & Pair Counts are Exact', () => {
    assert.strictEqual(levels.length, 200, 'Should have exactly 200 levels');
    let totalPairs = 0;
    levels.forEach(lvl => {
      totalPairs += lvl.pairs.length;
    });
    assert.strictEqual(totalPairs, 1000, 'Should have exactly 1000 pairs');
  });

  await t.test('Distribution of 3 Game Modes', () => {
    const synLevels = levels.filter(l => l.mode === 'synonym');
    const antLevels = levels.filter(l => l.mode === 'antonym');
    const imgLevels = levels.filter(l => l.mode === 'image');

    assert.strictEqual(synLevels.length, 70, 'Synonyms should have 70 levels');
    assert.strictEqual(antLevels.length, 60, 'Antonyms should have 60 levels');
    assert.strictEqual(imgLevels.length, 70, 'Image match should have 70 levels');

    const synPairs = synLevels.reduce((sum, l) => sum + l.pairs.length, 0);
    const antPairs = antLevels.reduce((sum, l) => sum + l.pairs.length, 0);
    const imgPairs = imgLevels.reduce((sum, l) => sum + l.pairs.length, 0);

    assert.strictEqual(synPairs, 350, 'Synonyms should have 350 pairs');
    assert.strictEqual(antPairs, 300, 'Antonyms should have 300 pairs');
    assert.strictEqual(imgPairs, 350, 'Image match should have 350 pairs');
  });

  await t.test('Image Level Structure and Matching Simulation', async () => {
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
      localStorage: {
        _d: {},
        getItem(k) { return this._d[k] || null; },
        setItem(k, v) { this._d[k] = String(v); },
        removeItem(k) { delete this._d[k]; }
      },
      fetch: async (url) => {
        return { ok: true, status: 200, json: async () => levels };
      },
      showToast: () => {},
      addExp: () => {},
      refreshIcons: () => {},
      playChineseTTS: () => {}
    };

    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync('public/js/core/utils.js', 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync('public/js/core/data.js', 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync('public/js/features/flipcard.js', 'utf8'), sandbox);

    await sandbox.initFlipCardGame();

    // Load Level 131 (First Image Match level)
    sandbox.loadFlipCardLevel(130);
    const lvl131 = sandbox.getCurrentFlipLevel();
    assert.strictEqual(lvl131.mode, 'image');
    assert.strictEqual(lvl131.level, 131);

    const cards = sandbox.getActiveFlipCards();
    assert.strictEqual(cards.length, 10, 'Level 131 should have 10 cards (5 pairs)');

    // Verify presence of Hanzi card and Image card
    const cardHanzi = cards.find(c => !c.word.isImage);
    const cardImg = cards.find(c => c.word.isImage && c.pairId === cardHanzi.pairId);

    assert.ok(cardHanzi, 'Must have a Hanzi word card');
    assert.ok(cardImg, 'Must have an Image visual card');
    assert.strictEqual(cardHanzi.pairId, cardImg.pairId);
    assert.strictEqual(cardHanzi.word.hanzi, cardImg.word.hanzi);
    assert.ok(cardImg.word.image, 'Image card must have an emoji/image');

    // Click and match the pair
    const idx1 = cards.indexOf(cardHanzi);
    const idx2 = cards.indexOf(cardImg);
    sandbox.handleCardClick(idx1);
    sandbox.handleCardClick(idx2);

    // Wait for the 400ms card evaluation delay
    await new Promise(r => setTimeout(r, 600));
    assert.strictEqual(cardHanzi.isMatched, true, 'Hanzi card should be matched');
    assert.strictEqual(cardImg.isMatched, true, 'Image card should be matched');
    assert.strictEqual(sandbox.getMatchedPairsCount(), 1);
  });
});
