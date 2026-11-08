// test/classifiers_and_polyphonic.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

describe('Bách Khoa Lượng Từ & Cẩm Nang Chữ Đa Âm Đa Nghĩa (Academic Linguistic Modules)', () => {

  const clfPath = path.join(ROOT, 'public/data/classifiers.json');
  const polyPath = path.join(ROOT, 'public/data/polyphonic_words.json');
  const dataJsPath = path.join(ROOT, 'public/js/core/data.js');
  const routerJsPath = path.join(ROOT, 'public/js/core/router.js');
  const dictJsPath = path.join(ROOT, 'public/js/features/dictionary.js');
  const indexHtmlPath = path.join(ROOT, 'public/index.html');
  const classifiersJs = require(path.join(ROOT, 'public/js/features/classifiers.js'));
  const polyphonicJs = require(path.join(ROOT, 'public/js/features/polyphonic.js'));

  it('1. Validates Classifiers Dataset (45 Measure Words & 6 Scientific Categories)', () => {
    assert.ok(fs.existsSync(clfPath), 'classifiers.json must exist');
    const classifiers = JSON.parse(fs.readFileSync(clfPath, 'utf8'));
    assert.equal(classifiers.length, 45, 'Must contain exactly 45 comprehensive classifiers');

    const expectedCategories = new Set([
      'shape', 'items', 'living', 'vehicles_buildings', 'sets_measures', 'verbal'
    ]);

    const seenIds = new Set();
    const seenChars = new Set();

    classifiers.forEach((c, idx) => {
      assert.ok(c.id, `Classifier at ${idx} must have id`);
      assert.ok(!seenIds.has(c.id), `Duplicate classifier id: ${c.id}`);
      seenIds.add(c.id);

      assert.ok(c.char, `Classifier at ${idx} must have char`);
      assert.ok(!seenChars.has(c.char), `Duplicate classifier char: ${c.char}`);
      seenChars.add(c.char);

      assert.ok(c.pinyin, `Classifier ${c.char} must have pinyin`);
      assert.ok(c.hanviet, `Classifier ${c.char} must have hanviet`);
      assert.ok(c.meaning, `Classifier ${c.char} must have meaning`);
      assert.ok(expectedCategories.has(c.category), `Invalid category: ${c.category}`);
      assert.ok(c.categoryName, `Classifier ${c.char} must have categoryName`);
      assert.ok(c.applicableObjects, `Classifier ${c.char} must describe applicable objects`);

      // Collocations
      assert.ok(Array.isArray(c.collocations) && c.collocations.length >= 2, `Classifier ${c.char} must have at least 2 collocations`);
      c.collocations.forEach(col => {
        assert.ok(col.zh && col.py && col.vi, `Collocation for ${c.char} must have zh, py, vi`);
      });

      // Example sentence
      assert.ok(c.example && c.example.zh && c.example.py && c.example.vi, `Classifier ${c.char} must have bilingual example`);

      // Tip
      assert.ok(c.tip && c.tip.length > 5, `Classifier ${c.char} must have HSK pedagogical tip`);

      // Quiz
      assert.ok(c.quiz, `Classifier ${c.char} must have quiz`);
      assert.ok(c.quiz.question, `Quiz question missing for ${c.char}`);
      assert.ok(Array.isArray(c.quiz.options) && c.quiz.options.length >= 2, `Quiz options must have >= 2 items`);
      assert.ok(c.quiz.answer >= 0 && c.quiz.answer < c.quiz.options.length, `Quiz answer out of bounds`);
      assert.ok(c.quiz.explain, `Quiz explain missing for ${c.char}`);
    });
  });

  it('2. Validates Polyphonic Words Dataset (26+ Core Polyphonic Characters)', () => {
    assert.ok(fs.existsSync(polyPath), 'polyphonic_words.json must exist');
    const polyList = JSON.parse(fs.readFileSync(polyPath, 'utf8'));
    assert.ok(polyList.length >= 25, `Must contain at least 25 polyphonic characters (currently ${polyList.length})`);

    const seenIds = new Set();
    const seenChars = new Set();

    polyList.forEach((p, idx) => {
      assert.ok(p.id, `Polyphonic word at ${idx} must have id`);
      assert.ok(!seenIds.has(p.id), `Duplicate poly id: ${p.id}`);
      seenIds.add(p.id);

      assert.ok(p.char, `Polyphonic word at ${idx} must have char`);
      assert.ok(!seenChars.has(p.char), `Duplicate poly char: ${p.char}`);
      seenChars.add(p.char);

      assert.ok(p.hanviet, `Polyphonic word ${p.char} must have hanviet`);
      assert.ok(p.summaryMnemonic, `Polyphonic word ${p.char} must have summary mnemonic`);
      assert.ok(Array.isArray(p.readings) && p.readings.length >= 2, `Polyphonic word ${p.char} must have at least 2 distinct readings`);

      p.readings.forEach(r => {
        assert.ok(r.pinyin, `Reading for ${p.char} must have pinyin`);
        assert.ok(r.tone, `Reading for ${p.char} must have tone`);
        assert.ok(r.pos, `Reading for ${p.char} must have pos`);
        assert.ok(r.meaning, `Reading for ${p.char} must have meaning`);
        assert.ok(Array.isArray(r.collocations) && r.collocations.length >= 1, `Reading for ${p.char} must have collocations`);
        assert.ok(r.example && r.example.zh && r.example.py && r.example.vi, `Reading for ${p.char} must have example`);
      });

      // Quiz
      assert.ok(p.quiz, `Polyphonic word ${p.char} must have quiz`);
      assert.ok(p.quiz.question, `Quiz question missing for ${p.char}`);
      assert.ok(Array.isArray(p.quiz.options) && p.quiz.options.length >= 2, `Quiz options must have >= 2 items`);
      assert.ok(p.quiz.answer >= 0 && p.quiz.answer < p.quiz.options.length, `Quiz answer out of bounds`);
      assert.ok(p.quiz.explain, `Quiz explain missing for ${p.char}`);
    });
  });

  it('3. Validates Core Data Layer & Router Preload Config', () => {
    const dataJs = fs.readFileSync(dataJsPath, 'utf8');
    assert.ok(dataJs.includes('classifiersData = []'), 'data.js must declare classifiersData');
    assert.ok(dataJs.includes('polyphonicWordsData = []'), 'data.js must declare polyphonicWordsData');
    assert.ok(dataJs.includes("classifiers: { url: 'data/classifiers.json'"), 'DATASETS must register classifiers');
    assert.ok(dataJs.includes("polyphonicWords: { url: 'data/polyphonic_words.json'"), 'DATASETS must register polyphonicWords');

    const routerJs = fs.readFileSync(routerJsPath, 'utf8');
    assert.ok(routerJs.includes("'classifiers'"), 'router.js dictionary tab must preload classifiers');
    assert.ok(routerJs.includes("'polyphonicWords'"), 'router.js dictionary tab must preload polyphonicWords');
  });

  it('4. Validates HTML Integration & UI Mode Switcher Elements', () => {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');

    // Switcher buttons
    assert.ok(html.includes('id="btn-dict-mode-classifier"'), 'index.html must have btn-dict-mode-classifier');
    assert.ok(html.includes('id="btn-dict-mode-polyphonic"'), 'index.html must have btn-dict-mode-polyphonic');

    // Containers
    assert.ok(html.includes('id="dictSectionClassifier"'), 'index.html must have dictSectionClassifier');
    assert.ok(html.includes('id="dictSectionPolyphonic"'), 'index.html must have dictSectionPolyphonic');
    assert.ok(html.includes('id="classifierCategoryTabs"'), 'index.html must have classifierCategoryTabs');
    assert.ok(html.includes('id="classifierGridContainer"'), 'index.html must have classifierGridContainer');
    assert.ok(html.includes('id="polyphonicGridContainer"'), 'index.html must have polyphonicGridContainer');

    // Script tags
    assert.ok(html.includes('<script defer src="js/features/classifiers.js"></script>'), 'index.html must include classifiers.js');
    assert.ok(html.includes('<script defer src="js/features/polyphonic.js"></script>'), 'index.html must include polyphonic.js');

    // Home Hub cards
    assert.ok(html.includes("switchDictMode('classifier')"), 'Home hub must include switchDictMode for classifier');
    assert.ok(html.includes("switchDictMode('polyphonic')"), 'Home hub must include switchDictMode for polyphonic');

    // dictionary.js logic
    const dictJs = fs.readFileSync(dictJsPath, 'utf8');
    assert.ok(dictJs.includes("mode === 'classifier'"), 'dictionary.js must handle classifier mode');
    assert.ok(dictJs.includes("mode === 'polyphonic'"), 'dictionary.js must handle polyphonic mode');
  });

  it('5. Validates Functional Logic of Classifiers Feature', () => {
    const classifiers = JSON.parse(fs.readFileSync(clfPath, 'utf8'));
    global.classifiersData = classifiers;

    // Test categories
    assert.equal(classifiersJs.CLASSIFIER_CATEGORIES.length, 7);

    // Test filter function
    classifiersJs.filterClassifierCategory('shape');
    let shapeList = classifiersJs.getFilteredClassifiers();
    assert.ok(shapeList.length > 0 && shapeList.every(x => x.category === 'shape'));

    // Reset category to all before testing global search
    classifiersJs.filterClassifierCategory('all');

    // Test search function
    classifiersJs.handleClassifierSearch('帽子');
    let searchList = classifiersJs.getFilteredClassifiers();
    assert.ok(searchList.some(x => x.char === '顶'), 'Search for 帽子 should find 顶');

    // Reset search & category
    classifiersJs.filterClassifierCategory('all');
    classifiersJs.handleClassifierSearch('');
    assert.equal(classifiersJs.getFilteredClassifiers().length, 45);
  });

  it('6. Validates Functional Logic of Polyphonic Words Feature', () => {
    const polyList = JSON.parse(fs.readFileSync(polyPath, 'utf8'));
    global.polyphonicWordsData = polyList;

    // Test search for "děi" or "得"
    polyphonicJs.handlePolyphonicSearch('děi');
    let deList = polyphonicJs.getFilteredPolyphonic();
    assert.ok(deList.some(x => x.char === '得'), 'Search for děi should return 得');

    // Test search for "首都"
    polyphonicJs.handlePolyphonicSearch('首都');
    let douList = polyphonicJs.getFilteredPolyphonic();
    assert.ok(douList.some(x => x.char === '都'), 'Search for 首都 should return 都');

    // Reset search
    polyphonicJs.handlePolyphonicSearch('');
    assert.equal(polyphonicJs.getFilteredPolyphonic().length, polyList.length);
  });

});
