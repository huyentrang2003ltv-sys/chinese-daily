// test/complements.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

describe('Bách Khoa Bổ Ngữ Tiếng Hán Toàn Diện (Chinese Complements Masterclass)', () => {
  const cmpPath = path.join(ROOT, 'public/data/complements.json');
  const dataJsPath = path.join(ROOT, 'public/js/core/data.js');
  const routerJsPath = path.join(ROOT, 'public/js/core/router.js');
  const grammarJsPath = path.join(ROOT, 'public/js/features/grammar.js');
  const indexHtmlPath = path.join(ROOT, 'public/index.html');
  const complementsJs = require(path.join(ROOT, 'public/js/features/complements.js'));

  it('1. Validates Complements Dataset (33 Complements & 7 Core Linguistic Categories)', () => {
    assert.ok(fs.existsSync(cmpPath), 'complements.json must exist');
    const complements = JSON.parse(fs.readFileSync(cmpPath, 'utf8'));
    assert.ok(complements.length >= 30, `Must contain at least 30 complements (found ${complements.length})`);

    const expectedTypes = new Set([
      'result', 'direction', 'potential', 'state_degree', 'duration_quantity', 'action_measure', 'prepositional'
    ]);

    const seenIds = new Set();
    const typeDistribution = {};

    complements.forEach((c, idx) => {
      assert.ok(c.id, `Complement at ${idx} must have id`);
      assert.ok(!seenIds.has(c.id), `Duplicate complement id: ${c.id}`);
      seenIds.add(c.id);

      assert.ok(c.name, `Complement ${c.id} must have name`);
      assert.ok(expectedTypes.has(c.type), `Invalid complement type: ${c.type}`);
      assert.ok(c.typeName, `Complement ${c.id} must have typeName`);
      assert.ok(c.marker, `Complement ${c.id} must have marker`);
      assert.ok(c.formula, `Complement ${c.id} must have formula`);
      assert.ok(c.deepExplanation, `Complement ${c.id} must have deepExplanation`);

      typeDistribution[c.type] = (typeDistribution[c.type] || 0) + 1;

      // Collocations
      if (c.collocations) {
        assert.ok(Array.isArray(c.collocations));
        c.collocations.forEach(col => {
          assert.ok(col.zh && col.py && col.vi, `Collocation for ${c.id} must have zh, py, vi`);
        });
      }

      // Examples
      assert.ok(Array.isArray(c.examples) && c.examples.length >= 1, `Complement ${c.id} must have at least 1 example`);
      c.examples.forEach(ex => {
        assert.ok(ex.zh && ex.py && ex.vi, `Example for ${c.id} must have zh, py, vi`);
      });

      // HSK Traps
      assert.ok(c.hskTraps && c.hskTraps.length > 5, `Complement ${c.id} must have hskTraps`);

      // Quiz
      assert.ok(c.quiz, `Complement ${c.id} must have quiz`);
      assert.ok(c.quiz.question, `Quiz question missing for ${c.id}`);
      assert.ok(Array.isArray(c.quiz.options) && c.quiz.options.length >= 2, `Quiz options must have >= 2 items`);
      assert.ok(c.quiz.answer >= 0 && c.quiz.answer < c.quiz.options.length, `Quiz answer out of bounds for ${c.id}`);
      assert.ok(c.quiz.explain, `Quiz explain missing for ${c.id}`);
    });

    // Verify all 7 categories exist in dataset
    expectedTypes.forEach(t => {
      assert.ok(typeDistribution[t] > 0, `Category ${t} must have at least 1 complement entry`);
    });
  });

  it('2. Validates Data Layer, Router Registration & Aliases', () => {
    const dataJs = fs.readFileSync(dataJsPath, 'utf8');
    assert.ok(dataJs.includes('complementsData = []'), 'data.js must declare complementsData');
    assert.ok(dataJs.includes("complements: { url: 'data/complements.json'"), 'DATASETS must register complements');

    const routerJs = fs.readFileSync(routerJsPath, 'utf8');
    assert.ok(routerJs.includes("'complements'"), 'router.js grammar tab must preload complements');
    assert.ok(routerJs.includes("complements: 'grammar'"), 'router.js TAB_ALIASES must route complements to grammar');
  });

  it('3. Validates HTML Integration & Tri-Mode Grammar View', () => {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');

    // Button in grammar switcher
    assert.ok(html.includes('id="btn-grammar-view-complements"'), 'index.html must have btn-grammar-view-complements');

    // Section container
    assert.ok(html.includes('id="grammar-view-complements"'), 'index.html must have grammar-view-complements');
    assert.ok(html.includes('id="complementCategoryTabs"'), 'index.html must have complementCategoryTabs');
    assert.ok(html.includes('id="complementGridContainer"'), 'index.html must have complementGridContainer');

    // Script tag
    assert.ok(html.includes('<script defer src="js/features/complements.js"></script>'), 'index.html must include complements.js');

    // grammar.js view mode switcher
    const grammarJs = fs.readFileSync(grammarJsPath, 'utf8');
    assert.ok(grammarJs.includes("mode === 'complements'"), 'grammar.js must support complements mode');
    assert.ok(grammarJs.includes('initComplements()'), 'grammar.js must initialize complements');
  });

  it('4. Validates Functional Logic of Complements Feature', () => {
    const complements = JSON.parse(fs.readFileSync(cmpPath, 'utf8'));
    global.complementsData = complements;

    // Categories
    assert.equal(complementsJs.COMPLEMENT_CATEGORIES.length, 8); // all + 7 types

    // Filter by type: result
    complementsJs.filterComplementCategory('result');
    let resList = complementsJs.getFilteredComplements();
    assert.ok(resList.length > 0 && resList.every(x => x.type === 'result'));

    // Reset and search by keyword "听不懂"
    complementsJs.filterComplementCategory('all');
    complementsJs.handleComplementSearch('听不懂');
    let searchList = complementsJs.getFilteredComplements();
    assert.ok(searchList.some(x => x.id === 'cmp_pot_formula'), 'Search for 听不懂 should find potential complement formula');

    // Reset search
    complementsJs.handleComplementSearch('');
    assert.equal(complementsJs.getFilteredComplements().length, complements.length);
  });
});
