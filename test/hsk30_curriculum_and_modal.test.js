// test/hsk30_curriculum_and_modal.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');
const roadmapPath = path.join(rootDir, 'public/data/hsk30_roadmap.json');
const indexPath = path.join(rootDir, 'public/index.html');
const pathwayJsPath = path.join(rootDir, 'public/js/features/pathway.js');

test('HSK 3.0 Standard Course Curriculum & Interactive Lesson Detail Modal', async (t) => {
  const roadmapData = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const pathwayJs = fs.readFileSync(pathwayJsPath, 'utf8');

  await t.test('1. Validates all 48 lessons have comprehensive pedagogical depth', () => {
    assert.ok(Array.isArray(roadmapData.standardCourse48Lessons), 'standardCourse48Lessons must be an array');
    assert.equal(roadmapData.standardCourse48Lessons.length, 48, 'Must have exactly 48 lessons across HSK 1, 2, 3');

    // Check level distribution: HSK 1 = 15, HSK 2 = 15, HSK 3 = 18
    const hsk1 = roadmapData.standardCourse48Lessons.filter(l => l.hskLevel === 1);
    const hsk2 = roadmapData.standardCourse48Lessons.filter(l => l.hskLevel === 2);
    const hsk3 = roadmapData.standardCourse48Lessons.filter(l => l.hskLevel === 3);

    assert.equal(hsk1.length, 15, 'HSK 1 must have 15 standard course lessons');
    assert.equal(hsk2.length, 15, 'HSK 2 must have 15 standard course lessons');
    assert.equal(hsk3.length, 18, 'HSK 3 must have 18 standard course lessons');

    // Validate completeness of every lesson
    roadmapData.standardCourse48Lessons.forEach((l, idx) => {
      const tag = `Lesson ${idx + 1} (HSK ${l.hskLevel} B${l.lessonNumber}): ${l.titleZh}`;

      assert.ok(l.titleZh && l.titleVi, `${tag} must have Chinese and Vietnamese titles`);
      assert.ok(l.dialogues && l.dialogues.length >= 2, `${tag} must have multi-turn dialogues`);
      l.dialogues.forEach(d => {
        assert.ok(d.speaker && d.hanzi && d.vi, `${tag} dialogue turn must have speaker, hanzi and vi`);
      });

      assert.ok(l.vocabulary && l.vocabulary.length >= 5, `${tag} must have rich core vocabulary`);
      l.vocabulary.forEach(v => {
        assert.ok(v.hanzi && v.pos && v.vi, `${tag} vocabulary word must have hanzi, pos and vi`);
      });

      assert.ok(l.grammarPoints && l.grammarPoints.length >= 1, `${tag} must have structured grammar points`);
      l.grammarPoints.forEach(g => {
        assert.ok(g.title && g.formula && g.explanation, `${tag} grammar must have title, formula and explanation`);
      });

      assert.ok(l.cultureAndTips && (l.cultureAndTips.culture || l.cultureAndTips.examTip), `${tag} must have culture & exam tips`);

      assert.ok(l.practice && l.practice.length >= 2, `${tag} must have interactive practice questions`);
      l.practice.forEach(q => {
        assert.ok(q.question && q.options && q.options.length >= 2 && q.explain, `${tag} quiz item must be valid`);
      });
    });
  });

  await t.test('2. Validates modal markup and action bindings in public/index.html', () => {
    assert.ok(indexHtml.includes('id="hsk30LessonDetailModal"'), 'index.html must contain #hsk30LessonDetailModal');
    assert.ok(indexHtml.includes('id="hsk30ModalTitleZh"'), 'index.html must contain title element');
    assert.ok(indexHtml.includes('id="hsk30ModalTtsBtn"'), 'index.html must contain modal TTS button');
    assert.ok(indexHtml.includes('id="hsk30LessonModalBody"'), 'index.html must contain modal body container');
    assert.ok(indexHtml.includes('id="hsk30PrevLessonBtn"'), 'index.html must contain previous lesson button');
    assert.ok(indexHtml.includes('id="hsk30NextLessonBtn"'), 'index.html must contain next lesson button');

    // Tab buttons
    assert.ok(indexHtml.includes('id="hsk30TabBtn-dialogues"'), 'Must have dialogues tab button');
    assert.ok(indexHtml.includes('id="hsk30TabBtn-vocabulary"'), 'Must have vocabulary tab button');
    assert.ok(indexHtml.includes('id="hsk30TabBtn-grammar"'), 'Must have grammar tab button');
    assert.ok(indexHtml.includes('id="hsk30TabBtn-culture"'), 'Must have culture tab button');
    assert.ok(indexHtml.includes('id="hsk30TabBtn-practice"'), 'Must have practice tab button');
  });

  await t.test('3. Simulates lesson modal interaction & navigation in VM sandbox', () => {
    // Set up mock DOM
    const elements = {};
    function createMockElement(id) {
      const el = {
        id,
        classList: {
          classes: new Set(['hidden']),
          contains(c) { return this.classes.has(c); },
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          toggle(c, force) {
            if (force === undefined) {
              if (this.classes.has(c)) this.classes.delete(c);
              else this.classes.add(c);
            } else if (force) this.classes.add(c);
            else this.classes.delete(c);
          }
        },
        innerHTML: '',
        textContent: '',
        onclick: null,
        disabled: false
      };
      elements[id] = el;
      return el;
    }

    [
      'hsk30LessonDetailModal',
      'hsk30ModalLevelBadge',
      'hsk30ModalThemeBadge',
      'hsk30ModalTitleZh',
      'hsk30ModalTitlePinyin',
      'hsk30ModalTitleVi',
      'hsk30ModalTtsBtn',
      'hsk30LessonModalBody',
      'hsk30LessonProgressText',
      'hsk30PrevLessonBtn',
      'hsk30NextLessonBtn',
      'hsk30TabBtn-dialogues',
      'hsk30TabBtn-vocabulary',
      'hsk30TabBtn-grammar',
      'hsk30TabBtn-culture',
      'hsk30TabBtn-practice'
    ].forEach(id => createMockElement(id));

    let ttsSpoken = null;
    let toastMsg = null;
    let awardedExp = 0;

    const sandbox = {
      console,
      document: {
        getElementById: (id) => elements[id] || null,
        querySelectorAll: () => []
      },
      hsk30RoadmapData: roadmapData,
      playChineseTTS: (text) => { ttsSpoken = text; },
      showToast: (msg) => { toastMsg = msg; },
      addExp: (points) => { awardedExp += points; },
      isWordSaved: (hanzi) => false,
      toggleSaveWord: () => {},
      refreshIcons: () => {},
      jsArg: (str) => JSON.stringify(str)
    };

    vm.createContext(sandbox);
    vm.runInContext(pathwayJs, sandbox);

    // Test openHsk30LessonModal for Lesson 1
    assert.equal(typeof sandbox.openHsk30LessonModal, 'function');
    sandbox.openHsk30LessonModal(1, 1);

    const modal = elements['hsk30LessonDetailModal'];
    assert.equal(modal.classList.contains('hidden'), false, 'Modal must not be hidden after open');
    assert.equal(elements['hsk30ModalTitleZh'].textContent, 'AI小语，你好！');
    assert.ok(elements['hsk30LessonProgressText'].textContent.includes('Bài 1 / 48'));

    // Check active lesson in state
    const viewing = sandbox.getCurrentlyViewingHsk30Lesson();
    assert.ok(viewing, 'Viewing lesson must be set');
    assert.equal(viewing.lessonNumber, 1);
    assert.equal(viewing.hskLevel, 1);

    // Test tab switches
    sandbox.switchHsk30LessonTab('vocabulary');
    assert.ok(elements['hsk30LessonModalBody'].innerHTML.includes('Từ Vựng Trọng Tâm'));

    sandbox.switchHsk30LessonTab('grammar');
    assert.ok(elements['hsk30LessonModalBody'].innerHTML.includes('Trọng Điểm Ngữ Pháp Cốt Lõi'));

    sandbox.switchHsk30LessonTab('culture');
    assert.ok(elements['hsk30LessonModalBody'].innerHTML.includes('Văn Hóa Đời Sống'));

    sandbox.switchHsk30LessonTab('practice');
    assert.ok(elements['hsk30LessonModalBody'].innerHTML.includes('Luyện Tập Củng Cố Kiến Thức'));

    // Test answering practice quiz
    const quiz = viewing.practice;
    assert.ok(quiz && quiz.length > 0);
    // Answer all correctly
    quiz.forEach((q, idx) => {
      sandbox.checkHsk30LessonQuiz(idx, q.answer);
    });
    assert.equal(awardedExp, 20, 'Should award 20 EXP for completing quiz correctly');

    // Test navigation: next lesson -> Lesson 2
    sandbox.navigateHsk30Lesson('next');
    const viewing2 = sandbox.getCurrentlyViewingHsk30Lesson();
    assert.equal(viewing2.lessonNumber, 2);
    assert.equal(viewing2.hskLevel, 1);
    assert.equal(elements['hsk30ModalTitleZh'].textContent, '我叫李文');

    // Test navigation: prev lesson -> back to Lesson 1
    sandbox.navigateHsk30Lesson('prev');
    const viewing1Again = sandbox.getCurrentlyViewingHsk30Lesson();
    assert.equal(viewing1Again.lessonNumber, 1);

    // Test close modal
    sandbox.closeHsk30LessonModal();
    assert.equal(modal.classList.contains('hidden'), true, 'Modal must have hidden class after close');
  });

  await t.test('4. Validates all 48 grammar structures and verifies renderPathwayGrammar has 0 undefined', () => {
    assert.ok(Array.isArray(roadmapData.grammarSections), 'grammarSections must be an array');
    const sections = roadmapData.grammarSections;
    assert.equal(sections.length, 4, 'Must have 4 grammar sections: HSK 1, 2, 3, 4 - 6');

    const totalGrammarItems = sections.reduce((acc, s) => acc + (s.items ? s.items.length : 0), 0);
    assert.equal(totalGrammarItems, 48, 'Must have exactly 48 grammar structures in total');

    // Expected distribution
    const hsk1Sec = sections.find(s => s.level === 'HSK 1');
    const hsk2Sec = sections.find(s => s.level === 'HSK 2');
    const hsk3Sec = sections.find(s => s.level === 'HSK 3');
    const hsk4Sec = sections.find(s => s.level === 'HSK 4 - 6');

    assert.ok(hsk1Sec && hsk1Sec.items.length === 14, 'HSK 1 must have 14 grammar structures');
    assert.ok(hsk2Sec && hsk2Sec.items.length === 12, 'HSK 2 must have 12 grammar structures');
    assert.ok(hsk3Sec && hsk3Sec.items.length === 8, 'HSK 3 must have 8 grammar structures');
    assert.ok(hsk4Sec && hsk4Sec.items.length === 14, 'HSK 4 - 6 must have 14 grammar structures');

    // Thorough data schema verification
    sections.forEach(sec => {
      sec.items.forEach((item, idx) => {
        const tag = `${sec.level} Item ${idx + 1} (${item.title || item.name})`;
        assert.ok(item.id, `${tag} missing id`);
        assert.ok(item.title, `${tag} missing title`);
        assert.ok(item.formula || item.pattern, `${tag} missing formula`);
        assert.ok(item.explanation, `${tag} missing explanation`);
        assert.ok(item.exampleZh, `${tag} missing exampleZh`);
        assert.ok(item.examplePinyin, `${tag} missing examplePinyin`);
        assert.ok(item.exampleVi, `${tag} missing exampleVi`);

        // Check for literal "undefined" string
        assert.ok(!String(item.id).includes('undefined'), `${tag} id has undefined`);
        assert.ok(!String(item.title).includes('undefined'), `${tag} title has undefined`);
        assert.ok(!String(item.formula).includes('undefined'), `${tag} formula has undefined`);
        assert.ok(!String(item.explanation).includes('undefined'), `${tag} explanation has undefined`);
        assert.ok(!String(item.exampleZh).includes('undefined'), `${tag} exampleZh has undefined`);
        assert.ok(!String(item.examplePinyin).includes('undefined'), `${tag} examplePinyin has undefined`);
        assert.ok(!String(item.exampleVi).includes('undefined'), `${tag} exampleVi has undefined`);
      });
    });

    // Test frontend render execution in sandbox
    const container = { innerHTML: '' };
    const elements = { pathwayDynamicContent: container };
    const mockDocument = {
      getElementById(id) { return elements[id] || null; },
      querySelectorAll() { return []; }
    };
    const sandbox = {
      window: {},
      document: mockDocument,
      hsk30RoadmapData: roadmapData,
      currentPathwayGrammarLevel: 'HSK 1',
      escapeHtml(str) { return String(str || ''); },
      jsArg(v) { return JSON.stringify(v); },
      refreshIcons() {},
      console
    };
    vm.createContext(sandbox);

    // Run pathway script
    vm.runInContext(pathwayJs, sandbox);

    // Test rendering for each section
    ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4 - 6'].forEach(lvl => {
      sandbox.filterPathwayGrammarLevel(lvl);
      const renderedHtml = container.innerHTML;

      assert.ok(renderedHtml.length > 0, `HTML rendered for ${lvl} must not be empty`);
      assert.ok(!renderedHtml.includes('#undefined'), `Rendered HTML for ${lvl} must not contain #undefined`);
      assert.ok(!renderedHtml.includes('>undefined<'), `Rendered HTML for ${lvl} must not contain >undefined<`);
      assert.ok(!renderedHtml.includes('undefined'), `Rendered HTML for ${lvl} must not contain the word undefined`);
      assert.ok(renderedHtml.includes('48 trọng tâm ngữ pháp chuẩn HSK 3.0'), 'Must show total 48 grammar structures');
    });
  });
});
