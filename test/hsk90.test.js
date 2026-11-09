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

test('Lộ Trình Gia Tốc 90 Ngày Chinh Phục HSK 3 (Giáo Án Từng Ngày & Thực Hành)', async (t) => {

  await t.test('1. Validates hsk90_curriculum.json Schema & 90 Days Completeness', () => {
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

    // 90 Days Array Check
    assert.ok(Array.isArray(data.days), 'curriculum must have days array');
    assert.equal(data.days.length, 90, 'Must have exactly 90 days of lessons');

    // Validate 30 days per phase
    const p1 = data.days.filter(d => d.phase === 1);
    const p2 = data.days.filter(d => d.phase === 2);
    const p3 = data.days.filter(d => d.phase === 3);
    assert.equal(p1.length, 30, 'Phase 1 must contain exactly 30 days');
    assert.equal(p2.length, 30, 'Phase 2 must contain exactly 30 days');
    assert.equal(p3.length, 30, 'Phase 3 must contain exactly 30 days');

    // Every single day from 1 to 90 must have the 4-step teacher lesson plan schema
    for (let dayNum = 1; dayNum <= 90; dayNum++) {
      const d = data.days.find(x => x.day === dayNum);
      assert.ok(d, `Day ${dayNum} must exist in curriculum`);
      assert.ok(d.title && d.title.length > 5, `Day ${dayNum} must have descriptive title`);
      assert.ok(d.themeZh, `Day ${dayNum} must have Chinese theme`);
      assert.ok(['lesson', 'review', 'checkpoint'].includes(d.type), `Day ${dayNum} must have valid type`);

      // Bước 1: Khởi động & Mục tiêu
      assert.ok(d.warmup && d.warmup.hook, `Day ${dayNum} must have warmup hook`);
      assert.ok(Array.isArray(d.warmup.objectives) && d.warmup.objectives.length >= 2, `Day ${dayNum} must have 2+ objectives`);

      // Bước 2: Bài giảng trọng tâm
      assert.ok(d.lecture, `Day ${dayNum} must have lecture object`);
      assert.ok(Array.isArray(d.lecture.vocab) && d.lecture.vocab.length >= 1, `Day ${dayNum} must have vocabulary`);
      assert.ok(d.lecture.grammar && d.lecture.grammar.formula, `Day ${dayNum} must have grammar formula`);
      assert.ok(d.lecture.dialogue && Array.isArray(d.lecture.dialogue.lines), `Day ${dayNum} must have dialogue`);

      // Bước 3: Thực hành phản xạ
      assert.ok(d.practice, `Day ${dayNum} must have practice object`);
      assert.ok(d.practice.quiz && Array.isArray(d.practice.quiz.options) && d.practice.quiz.options.length === 4, `Day ${dayNum} quiz must have 4 options`);
      assert.ok(d.practice.dictation && d.practice.dictation.audioText, `Day ${dayNum} dictation must have audio`);
      assert.ok(d.practice.reorder && Array.isArray(d.practice.reorder.tokens), `Day ${dayNum} reorder must have tokens`);
      assert.ok(d.practice.production && d.practice.production.sampleAnswer, `Day ${dayNum} production must have sample`);

      // Bước 4: Nhiệm vụ về nhà
      assert.ok(d.homework && Array.isArray(d.homework.tasks), `Day ${dayNum} must have homework tasks`);
      assert.ok(Array.isArray(d.homework.flashcardsToReview), `Day ${dayNum} must have flashcards`);
    }
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

  await t.test('4. Simulates hsk90.js 4-Step Daily Lesson Logic in Sandbox', async () => {
    const curriculumData = JSON.parse(fs.readFileSync(CURRICULUM_PATH, 'utf8'));
    const featureCode = fs.readFileSync(FEATURE_JS_PATH, 'utf8');

    // Minimal DOM & Storage simulation
    const domElements = {
      'tab-hsk90': { innerHTML: '' },
      'hsk90DailyLessonContainer': { innerHTML: '', scrollIntoView: () => {} },
      'hsk90LectureSubArea': { innerHTML: '' },
      'hsk90PracticeSubArea': { innerHTML: '' },
      'hsk90DictationInput': { value: '你好！你好吗？' },
      'hsk90WritingInput': { value: '我是学生，我叫 Minh。' }
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
    assert.equal(typeof windowMock.selectHsk90Day, 'function');
    assert.equal(typeof windowMock.nextHsk90Day, 'function');
    assert.equal(typeof windowMock.prevHsk90Day, 'function');
    assert.equal(typeof windowMock.switchHsk90LectureTab, 'function');
    assert.equal(typeof windowMock.switchHsk90PracticeMode, 'function');
    assert.equal(typeof windowMock.completeHsk90Day, 'function');

    // 1. Initial Render Day 1
    await windowMock.renderHsk90Tab();
    assert.ok(domElements['tab-hsk90'].innerHTML.includes('Ngày 1 / 90'), 'Should render Day 1 header');
    assert.ok(domElements['tab-hsk90'].innerHTML.includes('BƯỚC 1: KHỞI ĐỘNG'), 'Should render Step 1 Warmup');
    assert.ok(domElements['tab-hsk90'].innerHTML.includes('BƯỚC 2: BÀI GIẢNG TRỌNG TÂM'), 'Should render Step 2 Lecture');
    assert.ok(domElements['tab-hsk90'].innerHTML.includes('BƯỚC 3: THỰC HÀNH PHẢN XẠ'), 'Should render Step 3 Practice');
    assert.ok(domElements['tab-hsk90'].innerHTML.includes('BƯỚC 4: NHIỆM VỤ VỀ NHÀ'), 'Should render Step 4 Homework');

    // 2. Select Day 2
    windowMock.selectHsk90Day(2);
    await windowMock.renderHsk90Tab();
    assert.ok(domElements['tab-hsk90'].innerHTML.includes('Ngày 2 / 90'), 'Should switch to Day 2');

    // 3. Navigate with Next Day / Prev Day
    windowMock.nextHsk90Day();
    await windowMock.renderHsk90Tab();
    assert.ok(domElements['tab-hsk90'].innerHTML.includes('Ngày 3 / 90'), 'Should advance to Day 3');

    windowMock.prevHsk90Day();
    await windowMock.renderHsk90Tab();
    assert.ok(domElements['tab-hsk90'].innerHTML.includes('Ngày 2 / 90'), 'Should go back to Day 2');

    // 4. Test Lecture Subtabs
    windowMock.switchHsk90LectureTab('grammar');
    assert.ok(domElements['hsk90LectureSubArea'].innerHTML.includes('Công Thức Ngữ Pháp Ngày 2:'), 'Should render grammar subtab');

    windowMock.switchHsk90LectureTab('dialogue');
    assert.ok(domElements['hsk90LectureSubArea'].innerHTML.includes('Hỏi thăm sức khỏe'), 'Should render dialogue subtab');

    windowMock.switchHsk90LectureTab('etymology');
    assert.ok(domElements['hsk90LectureSubArea'].innerHTML.includes('Giải Mã Chiết Tự'), 'Should render etymology subtab');

    // 5. Test Practice Lab (Quiz, Dictation, Reorder, Writing)
    windowMock.switchHsk90PracticeMode('quiz');
    windowMock.selectHsk90QuizOption(0);
    windowMock.submitHsk90Quiz();
    assert.ok(domElements['hsk90PracticeSubArea'].innerHTML.includes('Chính xác!') || domElements['hsk90PracticeSubArea'].innerHTML.includes('Chưa chính xác!'), 'Should check quiz');

    windowMock.switchHsk90PracticeMode('dictation');
    windowMock.checkHsk90Dictation();
    assert.ok(domElements['hsk90PracticeSubArea'].innerHTML.includes('Độ chính xác:'), 'Should score dictation');

    windowMock.switchHsk90PracticeMode('reorder');
    windowMock.addHsk90ReorderToken('我');
    windowMock.addHsk90ReorderToken('很');
    windowMock.addHsk90ReorderToken('好');
    windowMock.checkHsk90Reorder();
    assert.ok(domElements['hsk90PracticeSubArea'].innerHTML.includes('Tuyệt vời!') || domElements['hsk90PracticeSubArea'].innerHTML.includes('Thứ tự'), 'Should check reorder');

    windowMock.switchHsk90PracticeMode('writing');
    windowMock.evaluateHsk90Writing();
    assert.ok(domElements['hsk90PracticeSubArea'].innerHTML.includes('điểm'), 'Should evaluate writing');

    // 6. Complete Day
    windowMock.completeHsk90Day(2);
    const progress = JSON.parse(mockStorage['yuhan_hsk90_progress']);
    assert.ok(progress.completedDays.includes(2), 'Day 2 should be in completedDays');
    assert.ok(progress.totalExp >= 30, 'EXP reward added');
  });

});
