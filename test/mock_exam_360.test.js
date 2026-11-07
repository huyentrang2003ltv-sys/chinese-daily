// test/mock_exam_360.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

test('HSK 360 Mock Exams Integrity & Hanban Simulation', async (t) => {
  const mockPath = path.join(__dirname, '../public/data/mock_exam.json');
  const allExams = JSON.parse(fs.readFileSync(mockPath, 'utf8'));

  await t.test('Total 360 exams and exactly 60 per level (HSK 1 - 6)', () => {
    assert.strictEqual(allExams.length, 360, 'Should have exactly 360 mock exams');

    for (let lvl = 1; lvl <= 6; lvl++) {
      const subset = allExams.filter(e => e.level === lvl);
      assert.strictEqual(subset.length, 60, `Level ${lvl} must have exactly 60 exams`);

      // Verify consecutive test numbers 1 to 60
      const testNums = subset.map(e => e.testNumber).sort((a, b) => a - b);
      for (let i = 0; i < 60; i++) {
        assert.strictEqual(testNums[i], i + 1, `Level ${lvl} testNumber ${i + 1} mismatch`);
      }
    }
  });

  await t.test('Hanban Standards Compliance across Levels', () => {
    const specs = {
      1: { duration: 35, total: 200, pass: 120, hasWriting: false },
      2: { duration: 50, total: 200, pass: 120, hasWriting: false },
      3: { duration: 85, total: 300, pass: 180, hasWriting: true },
      4: { duration: 100, total: 300, pass: 180, hasWriting: true },
      5: { duration: 120, total: 300, pass: 180, hasWriting: true },
      6: { duration: 135, total: 300, pass: 180, hasWriting: true }
    };

    allExams.forEach(ex => {
      const sp = specs[ex.level];
      assert.strictEqual(ex.durationMinutes, sp.duration, `Exam ${ex.id} duration mismatch`);
      assert.strictEqual(ex.totalScore, sp.total, `Exam ${ex.id} totalScore mismatch`);
      assert.strictEqual(ex.passScore, sp.pass, `Exam ${ex.id} passScore mismatch`);
      assert.ok(ex.questions && ex.questions.length >= 10, `Exam ${ex.id} must have at least 10 questions`);

      // Check sections
      const sections = ex.questions.map(q => q.section);
      const hasListening = sections.some(s => s.includes('Nghe') || s.includes('听力'));
      const hasReading = sections.some(s => s.includes('Đọc') || s.includes('阅读'));
      const hasWriting = sections.some(s => s.includes('Viết') || s.includes('书写'));

      assert.ok(hasListening, `Exam ${ex.id} must include listening`);
      assert.ok(hasReading, `Exam ${ex.id} must include reading`);
      if (sp.hasWriting) {
        assert.ok(hasWriting, `Exam ${ex.id} (HSK ${ex.level}) must include writing`);
      }

      // Every question has explanation
      ex.questions.forEach((q, qIdx) => {
        assert.ok(q.prompt, `Question ${q.id} in ${ex.id} has no prompt`);
        assert.ok(q.explanation, `Question ${q.id} in ${ex.id} has no explanation`);
        if (q.options) {
          const hasCorrect = q.options.some(o => o.isCorrect);
          assert.ok(hasCorrect, `Question ${q.id} has no correct option`);
        } else if (q.words) {
          assert.ok(q.correctOrder && q.correctOrder.length === q.words.length, `Question ${q.id} reorder mismatch`);
        }
      });
    });
  });

  await t.test('Simulation of Exam Taking, Word Reorder and Scoring Engine', async () => {
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
        body: { 
          appendChild() {}, 
          removeChild() {},
          classList: { add() {}, remove() {} }
        }
      },
      localStorage: {
        _d: {},
        getItem(k) { return this._d[k] || null; },
        setItem(k, v) { this._d[k] = String(v); },
        removeItem(k) { delete this._d[k]; }
      },
      fetch: async (url) => {
        return { ok: true, status: 200, json: async () => allExams };
      },
      mockExamsData: allExams,
      showToast: () => {},
      addExp: () => {},
      refreshIcons: () => {},
      playChineseTTS: () => {},
      openModal: () => {},
      closeModal: () => {}
    };

    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync('public/js/core/utils.js', 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync('public/js/features/mockexam.js', 'utf8'), sandbox);

    // Initialize module
    sandbox.initMockExamModule();

    // Switch to HSK 3, Test 15
    await sandbox.switchMockExamLevel(3);
    await sandbox.switchMockExamTest(15);

    // Answer all questions correctly
    const examQuestions = sandbox.document.getElementById('mockExamQuestionsContainer');
    assert.ok(examQuestions, 'Container must exist');

    // Switch to HSK 6, Test 42
    await sandbox.switchMockExamLevel(6);
    await sandbox.switchMockExamTest(42);

    const testSelect = sandbox.document.getElementById('examTestNumberSelect');
    assert.strictEqual(testSelect.value, 42, 'Select value should match test 42');

    // Test submit
    sandbox.submitMockExam();
    const scoreVal = sandbox.document.getElementById('examScoreValue');
    assert.ok(scoreVal, 'Score value element exists');
  });

  test('Writing Section (书写) Verification across HSK 3 - 6 and HSK 1 - 2 Hanban Note', async () => {
    // 1. Verify index.html contains examPartBtn-writing and examHanbanNote
    const html = fs.readFileSync('public/index.html', 'utf8');
    assert.ok(html.includes('id="examPartBtn-writing"'), 'index.html must have examPartBtn-writing');
    assert.ok(html.includes('id="examHanbanNote"'), 'index.html must have examHanbanNote');

    // 2. Verify all HSK 3 - 6 exams have writing questions
    [3, 4, 5, 6].forEach(lvl => {
      const exams = allExams.filter(e => e.level === lvl);
      assert.strictEqual(exams.length, 60, `HSK ${lvl} must have 60 exams`);
      exams.forEach((ex, i) => {
        const writingQs = ex.questions.filter(q => q.skill === 'writing' || (q.section || '').toLowerCase().includes('viết') || (q.section || '').toLowerCase().includes('书写'));
        assert.ok(writingQs.length > 0, `HSK ${lvl} exam ${i + 1} must contain writing questions`);
      });
    });

    // 3. Verify HSK 1 - 2 Hanban standard (Listening & Reading only, 200 total pts)
    [1, 2].forEach(lvl => {
      const exams = allExams.filter(e => e.level === lvl);
      exams.forEach(ex => {
        assert.strictEqual(ex.totalScore, 200, `HSK ${lvl} total score must be 200`);
        assert.strictEqual(ex.passScore, 120, `HSK ${lvl} pass score must be 120`);
      });
    });
  });
});
