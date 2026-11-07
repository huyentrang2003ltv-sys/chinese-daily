// test/vocab_expansion.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');
const vocabExpDataPath = path.join(rootDir, 'public/data/vocab_expansion.json');
const indexPath = path.join(rootDir, 'public/index.html');
const routerJsPath = path.join(rootDir, 'public/js/core/router.js');
const dataJsPath = path.join(rootDir, 'public/js/core/data.js');
const dictJsPath = path.join(rootDir, 'public/js/features/dictionary.js');
const vocabExpJsPath = path.join(rootDir, 'public/js/features/vocab_expansion.js');

test('Cẩm Nang Mở Rộng Từ Vựng Tiếng Trung (Radial Mindmap & Word Tree)', async (t) => {
  const vocabExpData = JSON.parse(fs.readFileSync(vocabExpDataPath, 'utf8'));
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const routerJs = fs.readFileSync(routerJsPath, 'utf8');
  const dataJs = fs.readFileSync(dataJsPath, 'utf8');
  const dictJs = fs.readFileSync(dictJsPath, 'utf8');
  const vocabExpJs = fs.readFileSync(vocabExpJsPath, 'utf8');

  await t.test('1. Validates dataset integrity and book pedagogical structure', () => {
    assert.ok(Array.isArray(vocabExpData), 'vocab_expansion.json must be an array of root characters');
    assert.ok(vocabExpData.length >= 26, `Must have at least 26 root characters, got ${vocabExpData.length}`);

    let totalCompounds = 0;
    const allowedCategories = ['action', 'entity', 'modifier', 'auxiliary'];

    vocabExpData.forEach((root, idx) => {
      assert.ok(root.id, `Root ${idx} missing id`);
      assert.ok(root.char && root.char.length === 1, `Root ${root.id} must have a single Hanzi character`);
      assert.ok(root.pinyin, `Root ${root.id} missing pinyin`);
      assert.ok(root.hanviet, `Root ${root.id} missing Hán Việt`);
      assert.ok(root.meaning, `Root ${root.id} missing meaning`);
      assert.ok(allowedCategories.includes(root.category), `Root ${root.id} invalid category: ${root.category}`);
      assert.ok(Array.isArray(root.compounds), `Root ${root.id} compounds must be an array`);
      assert.ok(root.compounds.length >= 6, `Root ${root.id} should have at least 6 compound words, got ${root.compounds.length}`);

      root.compounds.forEach((c, cIdx) => {
        totalCompounds++;
        assert.ok(c.word && c.word.length >= 2, `Root ${root.id} compound ${cIdx} must be a multi-character word`);
        assert.ok(c.word.includes(root.char), `Root ${root.id} compound ${c.word} must contain root character ${root.char}`);
        assert.ok(c.pinyin, `Compound ${c.word} missing pinyin`);
        assert.ok(c.hanviet, `Compound ${c.word} missing Hán Việt`);
        assert.ok(c.meaning, `Compound ${c.word} missing meaning`);
        assert.ok(c.pos, `Compound ${c.word} missing part of speech (pos)`);
        assert.ok(c.structure, `Compound ${c.word} missing word formation structure`);
        assert.ok(c.example, `Compound ${c.word} missing example`);
        assert.ok(c.example.zh, `Compound ${c.word} example missing zh`);
        assert.ok(c.example.pinyin, `Compound ${c.word} example missing pinyin`);
        assert.ok(c.example.vi, `Compound ${c.word} example missing vi`);
      });
    });

    assert.ok(totalCompounds >= 200, `Total compounds should be at least 200, got ${totalCompounds}`);
  });

  await t.test('2. Validates data layer and router registration', () => {
    assert.ok(dataJs.includes('vocabExpansionData = []'), 'data.js must declare vocabExpansionData');
    assert.ok(dataJs.includes('vocabExpansion:'), 'data.js DATASETS must include vocabExpansion');
    assert.ok(routerJs.includes("'vocabExpansion'"), 'router.js dictionary route must prefetch vocabExpansion');
  });

  await t.test('3. Validates index.html markup and script references', () => {
    assert.ok(indexHtml.includes('id="btn-dict-mode-expansion"'), 'index.html must have segmented switch button for expansion mode');
    assert.ok(indexHtml.includes('id="dictSectionExpansion"'), 'index.html must have dictSectionExpansion container');
    assert.ok(indexHtml.includes('id="vocabExpSearchInput"'), 'index.html must have vocab search input');
    assert.ok(indexHtml.includes('id="vocabExpCategoryTabs"'), 'index.html must have category tabs container');
    assert.ok(indexHtml.includes('id="vocabExpRootPills"'), 'index.html must have root pills container');
    assert.ok(indexHtml.includes('id="vocabExpContentArea"'), 'index.html must have content area container');
    assert.ok(indexHtml.includes('id="btnVocabExpViewMindmap"'), 'index.html must have mindmap view button');
    assert.ok(indexHtml.includes('id="btnVocabExpViewGrid"'), 'index.html must have grid view button');
    assert.ok(indexHtml.includes('src="js/features/vocab_expansion.js"'), 'index.html must include vocab_expansion.js script tag');
    assert.ok(indexHtml.includes('switchDictMode(\'expansion\')'), 'index.html must have 1-click Hub navigation from home dashboard');
  });

  await t.test('4. Validates dictionary.js mode switcher logic', () => {
    assert.ok(dictJs.includes("mode === 'expansion'"), 'dictionary.js switchDictMode must handle expansion mode');
    assert.ok(dictJs.includes('initVocabExpansion'), 'dictionary.js must invoke initVocabExpansion');
  });

  await t.test('5. Validates VM execution of vocab_expansion.js logic', () => {
    const sandbox = {
      window: {},
      document: {
        getElementById: (id) => {
          return {
            id,
            className: '',
            classList: {
              add: () => {},
              remove: () => {},
              contains: () => false
            },
            innerHTML: '',
            value: '',
            scrollTop: 0,
            scrollIntoView: () => {}
          };
        }
      },
      vocabExpansionData: vocabExpData,
      storage: {
        data: {},
        get: function(k) { return this.data[k] || null; },
        set: function(k, v) { this.data[k] = v; }
      },
      escapeHtml: (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      jsArg: (s) => JSON.stringify(s),
      playChineseTTS: () => {},
      refreshIcons: () => {},
      showToast: () => {},
      console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(vocabExpJs, sandbox);

    assert.equal(typeof sandbox.initVocabExpansion, 'function', 'initVocabExpansion must be defined');
    assert.equal(typeof sandbox.filterVocabExpCategory, 'function', 'filterVocabExpCategory must be defined');
    assert.equal(typeof sandbox.selectVocabExpRoot, 'function', 'selectVocabExpRoot must be defined');
    assert.equal(typeof sandbox.handleVocabExpSearch, 'function', 'handleVocabExpSearch must be defined');
    assert.equal(typeof sandbox.toggleVocabExpViewMode, 'function', 'toggleVocabExpViewMode must be defined');
    assert.equal(typeof sandbox.saveVocabExpToNotebook, 'function', 'saveVocabExpToNotebook must be defined');

    // Test saving to notebook
    sandbox.saveVocabExpToNotebook('不能', 'bù néng', 'Không thể', 'Bất năng');
    const notebook = sandbox.storage.get('yuhan_notebook_words');
    assert.ok(Array.isArray(notebook), 'Notebook should be an array');
    assert.equal(notebook.length, 1);
    assert.equal(notebook[0].word, '不能');

    // Test duplicate prevent
    sandbox.saveVocabExpToNotebook('不能', 'bù néng', 'Không thể', 'Bất năng');
    assert.equal(sandbox.storage.get('yuhan_notebook_words').length, 1, 'Should not add duplicates');
  });
});
