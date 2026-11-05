// test/pinyin_pronunciation_guide.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');
const pinyinDataPath = path.join(rootDir, 'public/data/pinyin_guide.json');
const indexPath = path.join(rootDir, 'public/index.html');
const routerJsPath = path.join(rootDir, 'public/js/core/router.js');
const pinyinJsPath = path.join(rootDir, 'public/js/features/pinyin.js');

test('Comprehensive Chinese Pinyin Pronunciation Guide & Interactive System', async (t) => {
  const pinyinData = JSON.parse(fs.readFileSync(pinyinDataPath, 'utf8'));
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const routerJs = fs.readFileSync(routerJsPath, 'utf8');
  const pinyinJs = fs.readFileSync(pinyinJsPath, 'utf8');

  await t.test('1. Validates Pinyin dataset structure and pedagogical completeness', () => {
    assert.ok(pinyinData.title, 'Dataset must have a title');
    assert.ok(pinyinData.overview && pinyinData.overview.goldenRules.length >= 3, 'Must have golden pronunciation rules');

    // Initials: 23 initials
    assert.ok(Array.isArray(pinyinData.initials), 'initials must be an array');
    assert.equal(pinyinData.initials.length, 23, 'Must have exactly 23 initials (21 consonants + y, w)');

    const expectedInitials = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'];
    const actualInitials = pinyinData.initials.map(i => i.symbol);
    assert.deepEqual(actualInitials, expectedInitials, 'Initials must match standard Mandarin phonetics');

    pinyinData.initials.forEach(i => {
      assert.ok(i.symbol && i.name && i.group, `${i.symbol} missing basic info`);
      assert.ok(i.mouthShape && i.mouthShape.length > 10, `${i.symbol} missing detailed mouth shape instruction`);
      assert.ok(i.vietnameseComparison, `${i.symbol} missing Vietnamese comparison`);
      assert.ok(i.secretTip, `${i.symbol} missing secret tip`);
      assert.ok(i.example && i.example.hanzi && i.example.pinyin && i.example.meaning, `${i.symbol} missing example word`);
    });

    // Finals: 36 finals
    assert.ok(Array.isArray(pinyinData.finals), 'finals must be an array');
    assert.equal(pinyinData.finals.length, 36, 'Must have exactly 36 finals');

    pinyinData.finals.forEach(f => {
      assert.ok(f.symbol && f.category && f.mouthShape, `${f.symbol} missing final info`);
      assert.ok(f.vietnameseComparison, `${f.symbol} missing Vietnamese comparison`);
    });

    // Tones: 5 tones
    assert.ok(Array.isArray(pinyinData.tones), 'tones must be an array');
    assert.equal(pinyinData.tones.length, 5, 'Must have 5 tones (4 main tones + neutral tone)');

    // Tone Sandhi Rules: at least 4 rules
    assert.ok(Array.isArray(pinyinData.toneSandhiRules), 'toneSandhiRules must be an array');
    assert.ok(pinyinData.toneSandhiRules.length >= 4, 'Must have at least 4 essential tone sandhi rules');

    // Confusing Pairs: 7 pairs
    assert.ok(Array.isArray(pinyinData.confusingPairs), 'confusingPairs must be an array');
    assert.ok(pinyinData.confusingPairs.length >= 7, 'Must have at least 7 confusing sound pairs');
    pinyinData.confusingPairs.forEach(p => {
      assert.ok(p.soundA && p.soundB, 'Pair missing sound symbols');
      assert.ok(p.pairWords && p.pairWords.length >= 2, 'Pair missing comparison words');
      assert.ok(p.tongueTwister, 'Pair missing tongue twister');
    });

    // Ear Training Quiz: at least 8 questions
    assert.ok(Array.isArray(pinyinData.earTrainingQuiz), 'earTrainingQuiz must be an array');
    assert.ok(pinyinData.earTrainingQuiz.length >= 8, 'Quiz must have at least 8 questions');
    pinyinData.earTrainingQuiz.forEach((q, idx) => {
      assert.ok(q.question && q.audioTarget, `Question ${idx + 1} missing prompt or audioTarget`);
      assert.ok(q.options && q.options.length === 4, `Question ${idx + 1} must have 4 options`);
      const correctOpts = q.options.filter(o => o.isCorrect);
      assert.equal(correctOpts.length, 1, `Question ${idx + 1} must have exactly 1 correct option`);
      assert.ok(q.explain, `Question ${idx + 1} missing explanation`);
    });
  });

  await t.test('2. Validates router integration, markup sections, and aliases', () => {
    // Router tab definition
    assert.ok(routerJs.includes("pinyin: { label: 'Bảng phiên âm Pinyin'"), 'TABS must define pinyin tab');
    assert.ok(routerJs.includes("tabs: ['pinyin', 'pathway', 'jiaocheng']"), 'NAV_GROUPS must include pinyin');
    assert.ok(routerJs.includes("pinyin: 'pinyin'") && routerJs.includes("bangphienam: 'pinyin'"), 'TAB_ALIASES must route pinyin aliases');

    // HTML section
    assert.ok(indexHtml.includes('id="tab-pinyin"'), 'index.html must contain section #tab-pinyin');
    assert.ok(indexHtml.includes('src="js/features/pinyin.js"'), 'index.html must load pinyin.js script');
    assert.ok(indexHtml.includes("switchTab('pinyin')"), 'index.html must have clickable entry points to pinyin');
  });

  await t.test('3. Simulates Pinyin UI rendering and interaction in VM sandbox', () => {
    // Set up mock DOM
    const elements = {};
    function createMockElement(id, tag = 'div') {
      const el = {
        id,
        tagName: tag.toUpperCase(),
        style: {},
        classList: {
          classes: new Set(),
          contains(c) { return this.classes.has(c); },
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          toggle(c) { if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c); }
        },
        innerHTML: '',
        textContent: '',
        className: '',
        appendChild(child) {
          if (child && child.id) elements[child.id] = child;
          return child;
        },
        remove() {
          if (this.id && elements[this.id]) delete elements[this.id];
        }
      };
      elements[id] = el;
      return el;
    }

    createMockElement('tab-pinyin');
    createMockElement('pinyinDynamicContent');

    const mockDocument = {
      getElementById(id) {
        if (!elements[id]) {
          return createMockElement(id);
        }
        return elements[id];
      },
      createElement(tag) {
        return createMockElement('el_' + Math.random().toString(36).slice(2), tag);
      },
      body: createMockElement('body')
    };

    let playedAudioText = null;
    const sandbox = {
      window: {},
      document: mockDocument,
      pinyinGuideData: pinyinData,
      currentPinyinSubTab: 'matrix',
      currentInitialsFilter: 'all',
      currentFinalsFilter: 'all',
      currentMatrixFilter: 'all',
      currentMatrixSearchQuery: '',
      pinyinQuizAnswers: {},
      escapeHtml(str) { return String(str || ''); },
      playChineseTTS(text) { playedAudioText = text; },
      refreshIcons() {},
      console
    };
    vm.createContext(sandbox);

    // Run pinyin.js script in sandbox
    vm.runInContext(pinyinJs, sandbox);

    // Initialize module
    sandbox.initPinyinModule();
    const tabEl = elements['tab-pinyin'];
    assert.ok(tabEl.innerHTML.includes('Bảng Phiên Âm Pinyin'), 'Hero banner must render');

    // Check Subtab 1: Matrix
    sandbox.switchPinyinSubTab('matrix');
    const dynamicContent = elements['pinyinDynamicContent'];
    assert.ok(dynamicContent.innerHTML.includes('ba'), 'Matrix must render syllable ba');
    assert.ok(!dynamicContent.innerHTML.includes('undefined'), 'Matrix HTML must not contain undefined');

    // Test Audio play
    sandbox.playPinyinAudio('bàba');
    assert.equal(playedAudioText, 'bàba', 'Should trigger audio for bàba');

    // Test Syllable modal
    sandbox.openPinyinSyllableModal('ba');
    const modal = elements['pinyinSyllableDetailModal'];
    assert.ok(modal, 'Syllable modal must be created and appended to document');
    assert.ok(modal.innerHTML.includes('bā'), 'Modal must render tone bā');
    assert.ok(modal.innerHTML.includes('bà'), 'Modal must render tone bà');

    sandbox.closePinyinSyllableModal();
    assert.equal(elements['pinyinSyllableDetailModal'], undefined, 'Modal must be removed on close');

    // Check Subtab 2: Initials (23 Thanh Mẫu)
    sandbox.switchPinyinSubTab('initials');
    assert.ok(dynamicContent.innerHTML.includes('Âm hai môi b'), 'Initials must render b');
    assert.ok(dynamicContent.innerHTML.includes('Âm uốn lưỡi zh'), 'Initials must render zh');
    assert.ok(dynamicContent.innerHTML.includes('Khẩu hình miệng chuẩn'), 'Initials must show mouth shape');

    // Filter initials
    sandbox.filterPinyinInitialsGroup('retroflex');
    assert.ok(dynamicContent.innerHTML.includes('zh'), 'Filtered initials must show zh');

    // Check Subtab 3: Finals (36 Vận Mẫu)
    sandbox.switchPinyinSubTab('finals');
    assert.ok(dynamicContent.innerHTML.includes('单韵母'), 'Finals must render single finals');
    assert.ok(dynamicContent.innerHTML.includes('ü'), 'Finals must render ü');

    // Check Subtab 4: Tones & Sandhi
    sandbox.switchPinyinSubTab('tones');
    assert.ok(dynamicContent.innerHTML.includes('Thanh 1 (Âm Bình'), 'Tones must render tone 1');
    assert.ok(dynamicContent.innerHTML.includes('Biến điệu hai thanh 3'), 'Tones must render sandhi rules');
    assert.ok(dynamicContent.innerHTML.includes('Biến điệu chữ 不'), 'Tones must render rule for 不');

    // Check Subtab 5: Confusing Pairs
    sandbox.switchPinyinSubTab('confusions');
    assert.ok(dynamicContent.innerHTML.includes('Cặp Âm Hai Môi: b'), 'Confusing pairs must render b vs p');
    assert.ok(dynamicContent.innerHTML.includes('Bài vè luyện dẻo miệng'), 'Confusing pairs must render tongue twister');

    // Check Subtab 6: Quiz
    sandbox.switchPinyinSubTab('quiz');
    assert.ok(dynamicContent.innerHTML.includes('Thử Thách Luyện Tai & Phản Xạ Ngữ Âm Pinyin'), 'Quiz must render');

    // Answer question 0 with correct option
    sandbox.answerPinyinQuiz(0, 1);
    assert.ok(dynamicContent.innerHTML.includes('Giải thích:'), 'Must show explanation after answering');
    assert.ok(dynamicContent.innerHTML.includes('1 / 8 đúng'), 'Score must update to 1');
  });
});
