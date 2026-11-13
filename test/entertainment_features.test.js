'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const HTML_PATH = path.join(ROOT, 'public', 'index.html');
const PVP_JS_PATH = path.join(ROOT, 'public', 'js', 'features', 'pvp_arena.js');
const WORDLE_JS_PATH = path.join(ROOT, 'public', 'js', 'features', 'wordle.js');
const ROUTER_JS_PATH = path.join(ROOT, 'public', 'js', 'core', 'router.js');
const CHENGYU_PATH = path.join(ROOT, 'public', 'data', 'chengyu.json');

test('⚔️ & 🧩 Entertainment & Gamification Suite (PvP Arena & Chengyu Wordle)', async (t) => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const pvpCode = fs.readFileSync(PVP_JS_PATH, 'utf8');
  const wordleCode = fs.readFileSync(WORDLE_JS_PATH, 'utf8');
  const routerCode = fs.readFileSync(ROUTER_JS_PATH, 'utf8');
  const chengyuList = JSON.parse(fs.readFileSync(CHENGYU_PATH, 'utf8'));

  await t.test('1. Validates HTML Markup, Modals & Script Tags', () => {
    // Scripts
    assert.ok(html.includes('<script defer src="js/features/pvp_arena.js"></script>'), 'Must include pvp_arena.js script tag');
    assert.ok(html.includes('<script defer src="js/features/wordle.js"></script>'), 'Must include wordle.js script tag');

    // Modals
    assert.ok(html.includes('id="pvpArenaModal"'), 'Must contain pvpArenaModal');
    assert.ok(html.includes('id="pvpArenaContent"'), 'Must contain pvpArenaContent target');
    assert.ok(html.includes('id="wordleModal"'), 'Must contain wordleModal');
    assert.ok(html.includes('id="wordleContent"'), 'Must contain wordleContent target');

    // Dedicated Tab Sections
    assert.ok(html.includes('id="tab-arena"'), 'Must contain tab-arena section');
    assert.ok(html.includes('id="tab-arena-content"'), 'Must contain tab-arena-content target');
    assert.ok(html.includes('id="tab-wordle"'), 'Must contain tab-wordle section');
    assert.ok(html.includes('id="tab-wordle-content"'), 'Must contain tab-wordle-content target');

    // Home Action Cards & Arcade Hub
    assert.ok(html.includes("openPvPArenaModal('ai')"), 'Home must have 1-click PvP Arena trigger');
    assert.ok(html.includes("openWordleModal(true)"), 'Home must have 1-click Wordle trigger');
    assert.ok(html.includes('Đại Sảnh Trò Chơi & Đấu Trường Hán Ngữ'), 'Home must display Edutainment Arcade Hub title');
    assert.ok(html.includes('Wordle Thành Ngữ'), 'Home card must display Wordle title');
  });

  await t.test('2. Validates Router Navigation, Tab Registration & Active Task Guards', () => {
    assert.ok(routerCode.includes("arena: {"), 'Router TABS must include arena');
    assert.ok(routerCode.includes("wordle: {"), 'Router TABS must include wordle');
    assert.ok(routerCode.includes("'arena'"), 'NAV_GROUPS must include arena');
    assert.ok(routerCode.includes("'wordle'"), 'NAV_GROUPS must include wordle');
    assert.ok(routerCode.includes("'dautruong': 'arena'"), 'TAB_ALIASES must alias dautruong to arena');
    assert.ok(routerCode.includes("'pvp': 'arena'"), 'TAB_ALIASES must alias pvp to arena');
    assert.ok(routerCode.includes("'chudoan': 'wordle'"), 'TAB_ALIASES must alias chudoan to wordle');
    assert.ok(routerCode.includes("isPvPBattleActive"), 'isTaskInProgress must guard active arena battle');
  });

  await t.test('3. Validates PvP Arena Sandbox VM Logic & AI Opponents', () => {
    const sandbox = {
      window: {},
      document: {
        getElementById: () => null,
        body: { classList: { add: () => {}, remove: () => {} } }
      },
      localStorage: {
        getItem: () => null,
        setItem: () => {}
      },
      navigator: {},
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      setInterval: setInterval,
      clearInterval: clearInterval,
      Date: Date,
      Math: Math,
      userProfile: { name: 'Nguyễn Văn A', exp: 120 }
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;

    vm.createContext(sandbox);
    vm.runInContext(pvpCode, sandbox);

    assert.equal(typeof sandbox.openPvPArenaModal, 'function');
    assert.equal(typeof sandbox.closePvPArenaModal, 'function');
    assert.equal(typeof sandbox.selectPvPArenaDifficulty, 'function');
    assert.equal(typeof sandbox.startPvPMatch, 'function');
    assert.equal(typeof sandbox.submitPvPAnswer, 'function');
    assert.equal(typeof sandbox.copyPvPChallengeLink, 'function');
    assert.equal(typeof sandbox.isPvPBattleActive, 'function');
    assert.equal(typeof sandbox.initPvPArenaTab, 'function');
    assert.equal(typeof sandbox.togglePvPAudio, 'function');

    // Battle should initially be inactive
    assert.equal(sandbox.isPvPBattleActive(), false);
  });

  await t.test('4. Validates Chengyu Wordle Sandbox VM Logic & Evaluation Engine', () => {
    const sandbox = {
      window: {},
      document: {
        getElementById: () => null,
        body: { classList: { add: () => {}, remove: () => {} } }
      },
      localStorage: {
        getItem: () => null,
        setItem: () => {}
      },
      navigator: {},
      chengyuData: chengyuList,
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      Date: Date,
      Math: Math
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;

    vm.createContext(sandbox);
    vm.runInContext(wordleCode, sandbox);

    assert.equal(typeof sandbox.openWordleModal, 'function');
    assert.equal(typeof sandbox.closeWordleModal, 'function');
    assert.equal(typeof sandbox.handleWordleCharInput, 'function');
    assert.equal(typeof sandbox.handleWordleBackspace, 'function');
    assert.equal(typeof sandbox.handleWordleSubmit, 'function');
    assert.equal(typeof sandbox.requestWordleHint, 'function');
    assert.equal(typeof sandbox.startWordlePractice, 'function');
    assert.equal(typeof sandbox.shareWordleResult, 'function');
    assert.equal(typeof sandbox.initWordleTab, 'function');
  });

  await t.test('5. Validates Wordle Evaluation Algorithm Accuracy', () => {
    // Standalone evaluation function matching wordle.js spec
    function evaluateGuess(guess, target) {
      const res = Array(4).fill('absent');
      const targetArr = target.split('');
      const guessArr = guess.split('');
      const targetCounts = {};
      for (let c of targetArr) targetCounts[c] = (targetCounts[c] || 0) + 1;

      // Pass 1: exact
      for (let i = 0; i < 4; i++) {
        if (guessArr[i] === targetArr[i]) {
          res[i] = 'correct';
          targetCounts[guessArr[i]]--;
        }
      }
      // Pass 2: present
      for (let i = 0; i < 4; i++) {
        if (res[i] !== 'correct') {
          const char = guessArr[i];
          if (targetCounts[char] && targetCounts[char] > 0) {
            res[i] = 'present';
            targetCounts[char]--;
          }
        }
      }
      return res;
    }

    // Test 1: Full match
    assert.deepEqual(
      evaluateGuess('画蛇添足', '画蛇添足'),
      ['correct', 'correct', 'correct', 'correct']
    );

    // Test 2: Inverted characters
    assert.deepEqual(
      evaluateGuess('蛇画足添', '画蛇添足'),
      ['present', 'present', 'present', 'present']
    );

    // Test 3: Completely wrong characters
    assert.deepEqual(
      evaluateGuess('一二三四', '画蛇添足'),
      ['absent', 'absent', 'absent', 'absent']
    );

    // Test 4: Mixed
    assert.deepEqual(
      evaluateGuess('画鸟添翼', '画蛇添足'),
      ['correct', 'absent', 'correct', 'absent']
    );
  });
});
