// test/multidimensional_word_lookup.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

test('Multidimensional Word Data integrity (6-in-1 requirements)', () => {
  const jsonPath = path.join(__dirname, '../public/data/multidimensional_words.json');
  assert.ok(fs.existsSync(jsonPath), 'multidimensional_words.json must exist');

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const wordCount = Object.keys(data).length;
  assert.ok(wordCount >= 3500, `Expected at least 3500 words, got ${wordCount}`);

  // Test Sample: 高兴
  const gaoxing = data['高兴'];
  assert.ok(gaoxing, 'Word 高兴 must exist');
  assert.equal(gaoxing.hanzi, '高兴');
  assert.ok(gaoxing.pinyin, 'Pinyin must exist');
  assert.ok(gaoxing.meaning, 'Meaning must exist');
  assert.ok(gaoxing.usage && gaoxing.usage.length > 0, 'Usage must have points');
  assert.ok(gaoxing.synonyms && gaoxing.synonyms.length > 0, 'Synonyms must exist for 高兴');
  assert.ok(gaoxing.synonyms.some(s => s.hanzi === '开心'), '开心 must be a synonym of 高兴');
  assert.ok(gaoxing.image, 'Image illustration must exist for 高兴');
  assert.ok(gaoxing.imageCaption, 'Image caption must exist for 高兴');

  // Test Sample: 开心 (Bidirectional synonym)
  const kaixin = data['开心'];
  assert.ok(kaixin, 'Word 开心 must exist');
  assert.ok(kaixin.synonyms.some(s => s.hanzi === '高兴'), '高兴 must be a synonym of 开心');

  // Test Sample: 大 & 小 (Bidirectional antonyms)
  const da = data['大'];
  const xiao = data['小'];
  assert.ok(da, 'Word 大 must exist');
  assert.ok(xiao, 'Word 小 must exist');
  assert.ok(da.antonyms.some(a => a.hanzi === '小'), '小 must be an antonym of 大');
  assert.ok(xiao.antonyms.some(a => a.hanzi === '大'), '大 must be an antonym of 小');

  // Test Sample: 好 & 坏 (Bidirectional antonyms)
  const hao = data['好'];
  const huai = data['坏'];
  assert.ok(hao, 'Word 好 must exist');
  assert.ok(huai, 'Word 坏 must exist');
  assert.ok(hao.antonyms.some(a => a.hanzi === '坏'), '坏 must be an antonym of 好');
  assert.ok(huai.antonyms.some(a => a.hanzi === '好'), '好 must be an antonym of 坏');

  // Test Sample: 是 & 事 (Homophones)
  const shiWord = data['是'];
  assert.ok(shiWord, 'Word 是 must exist');
  assert.ok(shiWord.homophones && shiWord.homophones.length > 0, 'Homophones must exist for 是');
  assert.ok(shiWord.homophones.some(h => h.hanzi === '事'), '事 must be a homophone of 是');

  // Ensure 100% of words have visual illustrations
  let missingImageCount = 0;
  for (const [k, v] of Object.entries(data)) {
    if (!v.image || !v.imageCaption) missingImageCount++;
  }
  assert.equal(missingImageCount, 0, 'All words must have visual image and caption');
});

test('Multidimensional Word Modal UI & Interaction in VM Sandbox', async () => {
  const jsonPath = path.join(__dirname, '../public/data/multidimensional_words.json');
  const multiData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

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

  let openedModals = [];
  let closedModals = [];

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
      createElement: (tag) => getEl('created_' + Math.random().toString(36).slice(2)),
      querySelectorAll: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      body: {
        classList: {
          _classes: new Set(),
          add(...cls) { cls.forEach(c => this._classes.add(c)); },
          remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
          contains(c) { return this._classes.has(c); }
        },
        appendChild() {},
        removeChild() {}
      }
    },
    localStorage: {
      _d: {},
      getItem(k) { return this._d[k] || null; },
      setItem(k, v) { this._d[k] = String(v); },
      removeItem(k) { delete this._d[k]; }
    },
    fetch: async (url) => {
      if (url.includes('multidimensional_words')) {
        return { ok: true, status: 200, json: async () => multiData };
      }
      return { ok: true, status: 200, json: async () => [] };
    },
    showToast: () => {},
    playChineseTTS: () => {},
    openModal: (id) => { openedModals.push(id); },
    closeModal: (id) => { closedModals.push(id); },
    registerModal: () => {},
    refreshIcons: () => {}
  };

  sandbox.window = sandbox;
  vm.createContext(sandbox);

  // Load scripts
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../public/js/core/utils.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../public/js/core/data.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../public/js/features/search.js'), 'utf8'), sandbox);

  // Test openWordModalByTitle with 高兴
  await sandbox.openWordModalByTitle('高兴');

  assert.equal(getEl('modalHanzi').innerText, '高兴');
  assert.equal(getEl('modalPinyin').innerText, 'gāoxìng');
  assert.ok(getEl('modalMeaning').innerText.includes('vui'), 'Meaning should describe happiness');
  assert.ok(getEl('modalImageDisplay').innerText.length > 0, 'Image emoji should be populated');
  assert.ok(getEl('modalImageCaption').innerText.length > 0, 'Image caption should be populated');
  assert.ok(getEl('modalUsageContainer').innerHTML.includes('✦'), 'Usage points should render with bullet ✦');
  assert.ok(getEl('modalSynonymsList').innerHTML.includes('开心'), 'Synonym list should render 开心');
  // Verify modal is visible (hidden class removed by openModal)
  assert.equal(getEl('wordModal').classList.contains('hidden'), false, 'wordModal must be visible without hidden class');

  // Test openWordModalByTitle with 大 (Antonyms)
  await sandbox.openWordModalByTitle('大');
  assert.equal(getEl('modalHanzi').innerText, '大');
  assert.ok(getEl('modalAntonymsList').innerHTML.includes('小'), 'Antonym list should render 小');

  // Test openWordModalByTitle with 是 (Homophones)
  await sandbox.openWordModalByTitle('是');
  assert.equal(getEl('modalHanzi').innerText, '是');
  assert.ok(getEl('modalHomophonesList').innerHTML.includes('事'), 'Homophone list should render 事');

  // Test Floating word quick lookup
  sandbox.floatingLookupTargetWord = '开心';
  await sandbox.handleFloatingWordLookupClick();
  assert.equal(getEl('modalHanzi').innerText, '开心');
});
