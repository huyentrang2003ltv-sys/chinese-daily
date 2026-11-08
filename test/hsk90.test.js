'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const CURRICULUM_PATH = path.join(ROOT, 'public', 'data', 'hsk90_curriculum.json');
const FEATURE_JS_PATH = path.join(ROOT, 'public', 'js', 'features', 'hsk90.js');
const DATA_JS_PATH = path.join(ROOT, 'public', 'js', 'core', 'data.js');
const ROUTER_JS_PATH = path.join(ROOT, 'public', 'js', 'core', 'router.js');
const HTML_PATH = path.join(ROOT, 'public', 'index.html');

test('Lộ Trình Gia Tốc 90 Ngày Chinh Phục HSK 3 (Masterclass & Practice)', async (t) => {

  await t.test('1. Validates hsk90_curriculum.json Schema & Completeness', () => {
    assert.ok(fs.existsSync(CURRICULUM_PATH), 'hsk90_curriculum.json must exist');
    const jsonStr = fs.readFileSync(CURRICULUM_PATH, 'utf8');
    const data = JSON.parse(jsonStr);

    // Meta / Overview checks
    assert.ok(data.overview, 'curriculum must have overview');
    assert.match(data.overview.title, /90 Ngày/i, 'title must emphasize 90 days');
    assert.ok(data.overview.duration, 'duration defined');
    assert.ok(data.overview.targetVocab, 'targetVocab defined');
    assert.ok(data.overview.targetScore, 'targetScore defined');
    assert.ok(Array.isArray(data.overview.strategyPhases), 'strategyPhases must be an array');
    assert.equal(data.overview.strategyPhases.length, 3, 'Must have 3 strategic phases');

    const phaseNumbers = data.overview.strategyPhases.map(p => p.phase);
    assert.deepEqual(phaseNumbers, [1, 2, 3], 'Phases must be 1, 2, 3');

    // Modules checks
    assert.ok(Array.isArray(data.modules), 'modules must be an array');
    assert.equal(data.modules.length, 12, 'Must have exactly 12 weekly milestone masterclasses covering 90 days');

    const weeks = data.modules.map(m => m.weekNumber);
    assert.deepEqual(weeks, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 'Weeks must run sequentially 1 through 12');

    // Every module check
    data.modules.forEach(m => {
      assert.ok(m.title && m.title.length > 5, `Module week ${m.weekNumber} must have descriptive title`);
      assert.ok(m.dayRange && /Ngày\s+\d+/i.test(m.dayRange), `Module week ${m.weekNumber} must have dayRange`);
      assert.ok([1, 2, 3].includes(m.phase), `Module week ${m.weekNumber} phase must be 1, 2, or 3`);
      assert.ok(Array.isArray(m.objectives) && m.objectives.length >= 2, `Module week ${m.weekNumber} must have learning objectives`);

      // 4-part Lecture
      const lec = m.lecture;
      assert.ok(lec, `Module week ${m.weekNumber} must have lecture object`);
      assert.ok(lec.dialogue && Array.isArray(lec.dialogue.lines) && lec.dialogue.lines.length >= 2, `Module week ${m.weekNumber} dialogue must have lines`);
      assert.ok(Array.isArray(lec.etymology) && lec.etymology.length >= 1, `Module week ${m.weekNumber} must have etymology breakdowns`);
      assert.ok(lec.grammar && lec.grammar.formula && lec.grammar.explanation, `Module week ${m.weekNumber} must have grammar formula`);
      assert.ok(lec.examTips && lec.examTips.length > 10, `Module week ${m.weekNumber} must have CTI exam tips`);

      // 4-part Practice
      const prac = m.practice;
      assert.ok(prac, `Module week ${m.weekNumber} must have practice object`);
      assert.ok(prac.quiz && Array.isArray(prac.quiz.options) && prac.quiz.options.length === 4, `Module week ${m.weekNumber} quiz must have 4 options`);
      assert.ok(prac.quiz.answer >= 0 && prac.quiz.answer < 4, `Module week ${m.weekNumber} quiz answer must be valid index`);
      assert.ok(prac.dictation && prac.dictation.audioText && prac.dictation.meaning, `Module week ${m.weekNumber} dictation must have audioText`);
      assert.ok(prac.reorder && Array.isArray(prac.reorder.tokens) && prac.reorder.tokens.length >= 3, `Module week ${m.weekNumber} reorder must have tokens`);
      assert.ok(prac.production && prac.production.prompt && prac.production.sampleAnswer, `Module week ${m.weekNumber} production must have prompt & sample`);
    });
  });

  await t.test('2. Validates Data Layer & Router Configuration', () => {
    const dataJs = fs.readFileSync(DATA_JS_PATH, 'utf8');
    assert.match(dataJs, /hsk90CurriculumData/, 'data.js must declare hsk90CurriculumData');
    assert.match(dataJs, /hsk90Curriculum:\s*\{\s*url:\s*'data\/hsk90_curriculum\.json'/, 'DATASETS must define hsk90Curriculum');

    const routerJs = fs.readFileSync(ROUTER_JS_PATH, 'utf8');
    assert.match(routerJs, /hsk90:\s*\{/, 'TABS must define hsk90');
    assert.match(routerJs, /data:\s*\[['"]hsk90Curriculum['"]\]/, 'hsk90 tab must require hsk90Curriculum dataset');
    assert.match(routerJs, /tabs:\s*\[[^\]]*'hsk90'[^\]]*\]/, 'NAV_GROUPS[1] must include hsk90 tab');
    assert.match(routerJs, /TAB_ALIASES[\s\S]*?hsk90/, 'TAB_ALIASES must register hsk90 aliases');
  });

  await t.test('3. Validates HTML Container & Script Tags', () => {
    const html = fs.readFileSync(HTML_PATH, 'utf8');
    assert.match(html, /<section id="tab-hsk90" class="hidden space-y-6">/, 'index.html must have #tab-hsk90 section');
    assert.match(html, /<script defer src="js\/features\/hsk90\.js"><\/script>/, 'index.html must load hsk90.js');
  });

  await t.test('4. Simulates hsk90.js Interactive Logic in Sandbox', () => {
    const curriculumData = JSON.parse(fs.readFileSync(CURRICULUM_PATH, 'utf8'));
    const featureCode = fs.readFileSync(FEATURE_JS_PATH, 'utf8');

    // Minimal DOM & Storage simulation
    const domElements = {
      'tab-hsk90': { innerHTML: '' },
      'hsk90LectureContentArea': { innerHTML: '' },
      'hsk90PracticeArea': { innerHTML: '' },
      'hsk90DictationInput': { value: '你好！很高兴认识你！' },
      'hsk90WritingInput': { value: '我是越南人，我叫 Minh。' }
    };

    const mockStorage = {};
    const windowMock = {
      hsk90CurriculumData: curriculumData,
      localStorage: {
        getItem: (k) => mockStorage[k] || null,
        setItem: (k, v) => { mockStorage[k] = String(v); }
      },
      document: {
        getElementById: (id) => domElements[id] || null
      },
      alert: () => {},
      lucide: { createIcons: () => {} }
    };

    const sandbox = {
      window: windowMock,
      localStorage: windowMock.localStorage,
      document: windowMock.document,
      alert: windowMock.alert,
      console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(featureCode, sandbox);

    // Verify window exports
    assert.equal(typeof windowMock.renderHsk90Tab, 'function');
    assert.equal(typeof windowMock.selectHsk90Phase, 'function');
    assert.equal(typeof windowMock.selectHsk90Week, 'function');
    assert.equal(typeof windowMock.switchHsk90LectureTab, 'function');
    assert.equal(typeof windowMock.switchHsk90PracticeMode, 'function');
    assert.equal(typeof windowMock.completeHsk90Day, 'function');

    // 1. Initial Render
    windowMock.renderHsk90Tab();
    assert.ok(domElements['tab-hsk90'].innerHTML.includes('Lộ Trình Gia Tốc 90 Ngày'), 'Should render hero banner');
    assert.ok(domElements['tab-hsk90'].innerHTML.includes('Tuần 1'), 'Should render week 1 by default');

    // 2. Switch Lecture Subtabs
    windowMock.switchHsk90LectureTab('etymology');
    assert.ok(domElements['hsk90LectureContentArea'].innerHTML.includes('Logic Chiết tự:'), 'Should render etymology view');

    windowMock.switchHsk90LectureTab('grammar');
    assert.ok(domElements['hsk90LectureContentArea'].innerHTML.includes('Công Thức Ngữ Pháp Cốt Lõi:'), 'Should render grammar view');

    windowMock.switchHsk90LectureTab('tips');
    assert.ok(domElements['hsk90LectureContentArea'].innerHTML.includes('Chiến Thuật Thi CTI'), 'Should render tips view');

    // 3. Practice Modes
    windowMock.switchHsk90PracticeMode('quiz');
    assert.ok(domElements['hsk90PracticeArea'].innerHTML.includes('Kiểm Tra Đáp Án'), 'Should render quiz prompt');
    windowMock.selectHsk90QuizOption(0);
    windowMock.submitHsk90Quiz();
    assert.ok(domElements['hsk90PracticeArea'].innerHTML.includes('Chính xác!') || domElements['hsk90PracticeArea'].innerHTML.includes('Chưa chính xác!'), 'Should validate quiz');

    // 4. Dictation check
    windowMock.switchHsk90PracticeMode('dictation');
    windowMock.checkHsk90Dictation();
    assert.ok(domElements['hsk90PracticeArea'].innerHTML.includes('Độ chính xác:'), 'Should show dictation score');

    // 5. Reorder check
    windowMock.switchHsk90PracticeMode('reorder');
    const week1ReorderTokens = curriculumData.modules[0].practice.reorder.correctOrder;
    week1ReorderTokens.forEach(t => windowMock.addHsk90ReorderToken(t));
    windowMock.checkHsk90Reorder();
    assert.ok(domElements['hsk90PracticeArea'].innerHTML.includes('Tuyệt vời! Bạn sắp xếp hoàn toàn chuẩn xác.'), 'Reorder should be correct');

    // 6. Production writing
    windowMock.switchHsk90PracticeMode('writing');
    windowMock.evaluateHsk90Writing();
    assert.ok(domElements['hsk90PracticeArea'].innerHTML.includes('Rất Tốt!') || domElements['hsk90PracticeArea'].innerHTML.includes('điểm'), 'Writing grader should provide feedback');

    // 7. Complete milestone day
    windowMock.completeHsk90Day(1);
    const progress = JSON.parse(mockStorage['yuhan_hsk90_progress']);
    assert.ok(progress.completedWeeks.includes(1), 'Week 1 should be recorded in completedWeeks');
    assert.ok(progress.totalExp >= 30, 'EXP should be rewarded');
  });

});
