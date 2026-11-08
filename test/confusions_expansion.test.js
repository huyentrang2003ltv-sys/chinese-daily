// test/confusions_expansion.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

describe('Cẩm Nang Phân Biệt Cặp Từ Gần Nghĩa HSK (Confusing Synonym Pairs Compendium)', () => {
  const confPath = path.join(ROOT, 'public/data/confusions.json');
  const indexHtmlPath = path.join(ROOT, 'public/index.html');
  const confusionsJs = require(path.join(ROOT, 'public/js/features/confusions.js'));

  it('1. Validates Confusions Dataset (36 High-Frequency Synonym Pairs)', () => {
    assert.ok(fs.existsSync(confPath), 'confusions.json must exist');
    const list = JSON.parse(fs.readFileSync(confPath, 'utf8'));
    assert.equal(list.length, 36, 'Must contain exactly 36 synonym pairs');

    const seenIds = new Set();
    list.forEach((item, idx) => {
      assert.ok(item.id, `Item ${idx} must have id`);
      assert.ok(!seenIds.has(item.id), `Duplicate id: ${item.id}`);
      seenIds.add(item.id);

      assert.ok(item.pair, `Item ${item.id} must have pair title`);
      assert.ok(item.meaning, `Item ${item.id} must have meaning`);
      assert.ok(item.difference, `Item ${item.id} must have difference explanation`);
      assert.ok(Array.isArray(item.comparisonTable) && item.comparisonTable.length >= 2, `Item ${item.id} must have comparisonTable with >= 2 rows`);

      item.comparisonTable.forEach(row => {
        assert.ok(row.aspect, `Row in ${item.id} must have aspect`);
        assert.ok(row.wordA, `Row in ${item.id} must have wordA`);
      });

      assert.ok(item.mnemonic, `Item ${item.id} must have mnemonic`);
      assert.ok(item.quiz, `Item ${item.id} must have quiz`);
      assert.ok(item.quiz.question, `Quiz in ${item.id} must have question`);
      assert.ok(Array.isArray(item.quiz.options) && item.quiz.options.length >= 2, `Quiz in ${item.id} must have >= 2 options`);
      assert.ok(item.quiz.correct >= 0 && item.quiz.correct < item.quiz.options.length, `Quiz correct out of bounds in ${item.id}`);
      assert.ok(item.quiz.explanation, `Quiz in ${item.id} must have explanation`);
    });
  });

  it('2. Validates HTML Integration & Search Toolbar in tab-confusions', () => {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');
    assert.ok(html.includes('id="tab-confusions"'), 'index.html must have tab-confusions');
    assert.ok(html.includes('id="confusionsSearchInput"'), 'index.html must have confusionsSearchInput');
    assert.ok(html.includes('id="confusionsFilteredCount"'), 'index.html must have confusionsFilteredCount');
    assert.ok(html.includes('id="confusionsListContainer"'), 'index.html must have confusionsListContainer');
  });

  it('3. Validates Functional Search in confusions.js', () => {
    const list = JSON.parse(fs.readFileSync(confPath, 'utf8'));
    global.confusionsData = list;

    // Search for 表达
    confusionsJs.handleConfusionsSearch('表达');
    let res1 = confusionsJs.getFilteredConfusions();
    assert.ok(res1.length > 0 && res1.some(x => x.id === 'biaoshi_biaoda_biaoxian'));

    // Search for 渡过
    confusionsJs.handleConfusionsSearch('渡过');
    let res2 = confusionsJs.getFilteredConfusions();
    assert.ok(res2.length > 0 && res2.some(x => x.id === 'duguo_duguo2'));

    // Reset search
    confusionsJs.handleConfusionsSearch('');
    assert.equal(confusionsJs.getFilteredConfusions().length, 36);
  });
});
