'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

test('Comprehensive Grammar Compendium & Mock Exam PDF Export', async (t) => {
  const grammarJson = JSON.parse(fs.readFileSync(path.join(PUBLIC, 'data', 'grammar_compendium.json'), 'utf8'));
  const grammarJs = fs.readFileSync(path.join(PUBLIC, 'js', 'features', 'grammar.js'), 'utf8');
  const mockexamJs = fs.readFileSync(path.join(PUBLIC, 'js', 'features', 'mockexam.js'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');

  await t.test('1. Grammar Compendium Completeness Across HSK 1 to HSK 6', () => {
    assert.ok(grammarJson.length >= 50, `Grammar compendium should have at least 50 topics (actual: ${grammarJson.length})`);
    
    // Check level coverage
    const hasHsk1 = grammarJson.some(x => (x.level || '').includes('1'));
    const hasHsk2 = grammarJson.some(x => (x.level || '').includes('2'));
    const hasHsk3 = grammarJson.some(x => (x.level || '').includes('3'));
    const hasHsk4 = grammarJson.some(x => (x.level || '').includes('4'));
    const hasHsk5 = grammarJson.some(x => (x.level || '').includes('5'));
    const hasHsk6 = grammarJson.some(x => (x.level || '').includes('6'));

    assert.strictEqual(hasHsk1, true, 'Must have HSK 1 grammar topics');
    assert.strictEqual(hasHsk2, true, 'Must have HSK 2 grammar topics');
    assert.strictEqual(hasHsk3, true, 'Must have HSK 3 grammar topics');
    assert.strictEqual(hasHsk4, true, 'Must have HSK 4 grammar topics');
    assert.strictEqual(hasHsk5, true, 'Must have HSK 5 grammar topics');
    assert.strictEqual(hasHsk6, true, 'Must have HSK 6 grammar topics');

    // Schema validation for all topics
    grammarJson.forEach((item, idx) => {
      assert.ok(item.id, `Item ${idx} must have id`);
      assert.ok(item.title, `Item ${idx} must have title`);
      assert.ok(item.formula, `Item ${idx} must have formula`);
      assert.ok(item.explanation, `Item ${idx} must have explanation`);
      assert.ok(Array.isArray(item.examples) && item.examples.length > 0, `Item ${idx} must have examples`);
      assert.ok(item.practiceQuiz, `Item ${idx} must have practiceQuiz`);
      assert.ok(Array.isArray(item.practiceQuiz.options), `Item ${idx} practiceQuiz must have options`);
    });
  });

  await t.test('2. Grammar Level Filtering and Interactive Quiz Logic', () => {
    assert.strictEqual(indexHtml.includes('id="btn-grammar-lvl-hsk1"'), true, 'Index HTML contains HSK 1 level button');
    assert.strictEqual(indexHtml.includes('id="btn-grammar-lvl-hsk6"'), true, 'Index HTML contains HSK 6 level button');

    let expAdded = 0;
    const context = {
      console,
      grammarData: grammarJson,
      escapeHtml: (s) => s,
      jsArg: (s) => JSON.stringify(s),
      refreshIcons: () => {},
      addExp: (amt) => { expAdded += amt; },
      document: {
        getElementById: () => ({ innerText: '', innerHTML: '', classList: { add() {}, remove() {} } }),
        querySelectorAll: () => []
      }
    };

    vm.createContext(context);
    vm.runInContext(grammarJs, context);

    // Test level filter
    assert.strictEqual(typeof context.filterGrammarLevel, 'function', 'filterGrammarLevel must be defined');
    assert.strictEqual(context.getActiveGrammarLevel(), 'all', 'Initial level is all');
    context.filterGrammarLevel('hsk1');
    assert.strictEqual(context.getActiveGrammarLevel(), 'hsk1', 'Active grammar level updated to hsk1');

    // Test quiz checking
    assert.strictEqual(typeof context.checkGrammarQuiz, 'function', 'checkGrammarQuiz must be defined');
    const itemWithQuiz = grammarJson.find(x => x.practiceQuiz);
    assert.ok(itemWithQuiz);
    
    // Correct answer
    context.checkGrammarQuiz(itemWithQuiz.id, itemWithQuiz.practiceQuiz.answer);
    assert.strictEqual(expAdded, 10, 'Awarded 10 EXP for correct quiz answer');
  });

  await t.test('3. Mock Exam PDF Export Engine and Print Document Generation', () => {
    assert.strictEqual(mockexamJs.includes('function downloadMockExamPdf'), true, 'mockexam.js declares downloadMockExamPdf');
    assert.strictEqual(indexHtml.includes('downloadMockExamPdf()'), true, 'index.html contains downloadMockExamPdf handler call');

    // Simulate PDF generation in VM sandbox
    let printedHtml = '';
    let printCalled = false;
    const context = {
      console,
      escapeHtml: (s) => s,
      showToast: () => {},
      window: {
        open: () => ({
          document: {
            open: () => {},
            write: (content) => { printedHtml = content; },
            close: () => { printCalled = true; }
          }
        })
      }
    };

    vm.createContext(context);
    vm.runInContext(mockexamJs, context);

    // Set active exam using the dedicated setter
    context.setActiveMockExam({
      level: 1,
      testNumber: 1,
      title: 'Đề Thi Thử HSK 1 Chuẩn Hanban - Đề Số 01',
      durationMinutes: 35,
      totalScore: 200,
      passScore: 120,
      questions: [
        {
          id: 'q1',
          skill: 'listening',
          prompt: 'Nghe và chọn Đúng/Sai',
          audioText: '猫在桌子下面。',
          pinyin: 'Māo zài zhuōzi xiàmiàn.',
          options: [{ key: 'A', text: 'Đúng', isCorrect: false }, { key: 'B', text: 'Sai', isCorrect: true }],
          explanation: 'Mèo ở dưới bàn.'
        },
        {
          id: 'q2',
          skill: 'reading',
          prompt: 'Đọc và chọn đáp án:',
          chineseText: '我想喝茶。',
          pinyin: 'Wǒ xiǎng hē chá.',
          options: [{ key: 'A', text: 'Uống trà', isCorrect: true }, { key: 'B', text: 'Uống nước', isCorrect: false }],
          explanation: '我想喝茶 nghĩa là tôi muốn uống trà.'
        },
        {
          id: 'q3',
          skill: 'writing',
          prompt: 'Sắp xếp câu:',
          scrambledWords: ['好', '你'],
          options: [{ key: 'A', text: '你好', isCorrect: true }],
          explanation: 'Câu chào 你好.'
        }
      ]
    });

    context.downloadMockExamPdf();

    assert.strictEqual(printCalled, true, 'PDF window must be opened and closed for printing');
    assert.ok(printedHtml.includes('汉语水平考试 HSK'), 'Print document contains Hanban CTI header');
    assert.ok(printedHtml.includes('PHẦN I: NGHE HIỂU'), 'Print document contains listening section');
    assert.ok(printedHtml.includes('PHẦN II: ĐỌC HIỂU'), 'Print document contains reading section');
    assert.ok(printedHtml.includes('PHẦN III: VIẾT'), 'Print document contains writing section');
    assert.ok(printedHtml.includes('BẢNG ĐÁP ÁN CHUẨN'), 'Print document contains answer key table');
    assert.ok(printedHtml.includes('window.print()'), 'Print document contains direct print button trigger');
  });
});
