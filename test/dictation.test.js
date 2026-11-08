// test/dictation.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const dictationModule = require('../public/js/features/dictation');

test('Phòng Luyện Nghe Phản Xạ & Chép Chính Tả (Shadowing & Dictation Lab)', async (t) => {

  await t.test('1. Validates dictation_sentences.json dataset integrity across HSK 1 - 6', async () => {
    const dataFile = path.join(__dirname, '..', 'public', 'data', 'dictation_sentences.json');
    assert.ok(fs.existsSync(dataFile), 'dictation_sentences.json must exist');

    const raw = fs.readFileSync(dataFile, 'utf8');
    const sentences = JSON.parse(raw);

    assert.ok(Array.isArray(sentences), 'Dataset must be an array');
    assert.strictEqual(sentences.length, 60, 'Dataset must have exactly 60 sentences');

    // Count per level HSK 1 to 6
    for (let lvl = 1; lvl <= 6; lvl++) {
      const perLvl = sentences.filter(s => s.level === lvl);
      assert.strictEqual(perLvl.length, 10, `HSK ${lvl} must have exactly 10 sentences`);
    }

    // Check schema of every sentence
    sentences.forEach((s, idx) => {
      assert.ok(s.id, `Item ${idx} must have id`);
      assert.ok(s.zh && s.zh.length > 0, `Item ${idx} must have Hanzi text`);
      assert.ok(s.pinyin && s.pinyin.length > 0, `Item ${idx} must have Pinyin`);
      assert.ok(s.vi && s.vi.length > 0, `Item ${idx} must have Vietnamese translation`);
      assert.ok(s.grammarPoint && s.grammarPoint.length > 0, `Item ${idx} must have grammarPoint`);
      assert.ok(s.pauseMarks && s.pauseMarks.includes('/'), `Item ${idx} must have pauseMarks with rhythm '/'`);
      assert.ok(Array.isArray(s.chunks) && s.chunks.length >= 2, `Item ${idx} must have at least 2 shadowing chunks`);
      s.chunks.forEach(ch => {
        assert.ok(ch.text, 'Chunk must have text');
        assert.ok(ch.pinyin, 'Chunk must have pinyin');
      });
    });
  });

  await t.test('2. Validates character diff comparator computeHanziDiff', async () => {
    const { computeHanziDiff } = dictationModule;
    assert.strictEqual(typeof computeHanziDiff, 'function');

    // Case A: 100% Perfect match
    const target = '明天下午我想去商店买水。';
    const perfectInput = '明天下午我想去商店买水。';
    const resA = computeHanziDiff(perfectInput, target);
    assert.strictEqual(resA.accuracy, 100);
    assert.strictEqual(resA.isPerfect, true);
    assert.strictEqual(resA.matches, 11);
    assert.strictEqual(resA.total, 11);
    assert.ok(resA.charDiffs.every(d => d.status === 'correct'));

    // Case B: Without punctuation in user input (should still match Hanzi)
    const noPunctInput = '明天下午我想去商店买水';
    const resB = computeHanziDiff(noPunctInput, target);
    assert.strictEqual(resB.accuracy, 100);
    assert.strictEqual(resB.matches, 11);

    // Case C: Partial mismatch
    // User types "明天上午" instead of "明天下午" (1 character wrong: 上 vs 下)
    const partialInput = '明天上午我想去商店买水。';
    const resC = computeHanziDiff(partialInput, target);
    assert.strictEqual(resC.matches, 10);
    assert.strictEqual(resC.total, 11);
    assert.strictEqual(resC.accuracy, 91);
    assert.strictEqual(resC.isPerfect, false);
    const wrongChar = resC.charDiffs.find(d => d.status === 'wrong');
    assert.ok(wrongChar);
    assert.strictEqual(wrongChar.char, '下');
    assert.strictEqual(wrongChar.actual, '上');

    // Case D: Incomplete / missing characters
    const shortInput = '明天下午';
    const resD = computeHanziDiff(shortInput, target);
    assert.strictEqual(resD.matches, 4);
    assert.strictEqual(resD.accuracy, 36);
    assert.ok(resD.charDiffs.some(d => d.status === 'missing'));
  });

  await t.test('3. Validates core data layer & router registration', async () => {
    const dataJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'core', 'data.js'), 'utf8');
    assert.ok(dataJs.includes('let dictationData = [];'), 'dictationData must be declared in data.js');
    assert.ok(dataJs.includes("dictation: { url: 'data/dictation_sentences.json'"), 'dictation dataset must be in DATASETS');

    const routerJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'core', 'router.js'), 'utf8');
    assert.ok(routerJs.includes("dictation: 'practice'"), 'TAB_ALIASES must route dictation to practice');
    assert.ok(routerJs.includes("shadowing: 'practice'"), 'TAB_ALIASES must route shadowing to practice');
    assert.ok(routerJs.includes("data: ['practice', 'dictation']"), 'TABS.practice must preload dictation');
  });

  await t.test('4. Validates HTML integration and UI mode switcher elements', async () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    assert.ok(html.includes('id="btn-practice-mode-questions"'), 'Question mode button must exist');
    assert.ok(html.includes('id="btn-practice-mode-dictation"'), 'Dictation mode button must exist');
    assert.ok(html.includes('id="practice-view-questions"'), 'practice-view-questions container must exist');
    assert.ok(html.includes('id="practice-view-dictation"'), 'practice-view-dictation container must exist');
    assert.ok(html.includes('src="js/features/dictation.js"'), 'Script dictation.js must be loaded');
    assert.ok(html.includes('Phòng Luyện Nghe Phản Xạ & Chép Chính Tả (汉语听写与跟读实验室)'), 'Home Hub card must exist');
  });

});
