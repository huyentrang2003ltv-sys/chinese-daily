'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('Cheer & Comfort Companion System (Chế độ Khuyến Khích & An Ủi Học Viên)', async (t) => {
  const root = path.join(__dirname, '..');
  const quotesPath = path.join(root, 'public', 'data', 'cheer_comfort_quotes.json');
  const scriptPath = path.join(root, 'public', 'js', 'features', 'cheer_comfort.js');

  await t.test('1. Validates cheer_comfort_quotes.json integrity & schema', () => {
    assert.ok(fs.existsSync(quotesPath), 'File cheer_comfort_quotes.json must exist');
    const data = JSON.parse(fs.readFileSync(quotesPath, 'utf8'));

    // Check modes
    assert.ok(data.modes);
    assert.ok(data.modes.gentle);
    assert.ok(data.modes.energetic);
    assert.ok(data.modes.philosophical);

    // Check encouragement quotes
    assert.ok(data.encouragement);
    assert.ok(Array.isArray(data.encouragement.quotes));
    assert.ok(data.encouragement.quotes.length >= 4);
    data.encouragement.quotes.forEach(q => {
      assert.ok(q.chinese, 'Quote must have chinese');
      assert.ok(q.pinyin, 'Quote must have pinyin');
      assert.ok(q.vietnamese, 'Quote must have vietnamese');
      assert.ok(q.message, 'Quote must have message');
    });

    // Check comfort quotes
    assert.ok(data.comfort);
    assert.ok(Array.isArray(data.comfort.quotes));
    assert.ok(data.comfort.quotes.length >= 4);
    data.comfort.quotes.forEach(q => {
      assert.ok(q.chinese, 'Comfort quote must have chinese');
      assert.ok(q.pinyin, 'Comfort quote must have pinyin');
      assert.ok(q.vietnamese, 'Comfort quote must have vietnamese');
      assert.ok(q.message, 'Comfort quote must have comforting message');
    });
  });

  await t.test('2. Simulates cheer_comfort.js in VM sandbox', () => {
    const code = fs.readFileSync(scriptPath, 'utf8');

    const domStorage = {};
    const mockElements = {};

    function createMockElement(tag, id = '') {
      return {
        tagName: tag.toUpperCase(),
        id,
        style: {},
        innerHTML: '',
        textContent: '',
        classList: {
          add: () => {},
          remove: () => {},
          toggle: () => {},
          contains: () => false
        },
        appendChild: (child) => child,
        removeChild: (child) => child,
        getContext: () => ({
          clearRect: () => {},
          fillRect: () => {},
          beginPath: () => {},
          arc: () => {},
          lineTo: () => {},
          closePath: () => {},
          fill: () => {},
          save: () => {},
          restore: () => {}
        })
      };
    }

    const sandbox = {
      window: {
        innerWidth: 1024,
        innerHeight: 768,
        localStorage: {
          getItem: (k) => domStorage[k] || null,
          setItem: (k, v) => { domStorage[k] = String(v); }
        }
      },
      document: {
        body: createMockElement('body', 'body'),
        getElementById: (id) => mockElements[id] || null,
        createElement: (tag) => {
          const el = createMockElement(tag);
          return el;
        }
      },
      localStorage: {
        getItem: (k) => domStorage[k] || null,
        setItem: (k, v) => { domStorage[k] = String(v); }
      },
      fetch: async () => ({
        ok: true,
        json: async () => JSON.parse(fs.readFileSync(quotesPath, 'utf8'))
      }),
      requestAnimationFrame: (fn) => setTimeout(fn, 16),
      console: { log: () => {}, warn: () => {}, error: () => {} },
      Date,
      Math,
      JSON,
      setTimeout,
      clearTimeout
    };

    sandbox.window.document = sandbox.document;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);

    // Verify exported functions
    assert.equal(typeof sandbox.window.showCheerOrComfortModal, 'function');
    assert.equal(typeof sandbox.window.closeCheerComfortModal, 'function');
    assert.equal(typeof sandbox.window.setCompanionMode, 'function');
    assert.equal(typeof sandbox.window.getCompanionMode, 'function');
    assert.equal(typeof sandbox.window.playCheerAudioChime, 'function');
    assert.equal(typeof sandbox.window.playComfortAudioChime, 'function');

    // Test companion mode persistence
    sandbox.window.setCompanionMode('energetic');
    assert.equal(sandbox.window.getCompanionMode(), 'energetic');
    assert.equal(domStorage['yh_cheer_comfort_mode'], 'energetic');
  });

  await t.test('3. Verifies modal presentation for High Score (Khuyến khích) and Low Score (An ủi)', async () => {
    const code = fs.readFileSync(scriptPath, 'utf8');
    const domStorage = {};
    const createdElements = [];

    const sandbox = {
      window: {
        innerWidth: 1024,
        innerHeight: 768,
        localStorage: {
          getItem: (k) => domStorage[k] || null,
          setItem: (k, v) => { domStorage[k] = String(v); }
        }
      },
      document: {
        body: {
          appendChild: (child) => {
            createdElements.push(child);
            return child;
          }
        },
        getElementById: (id) => createdElements.find(e => e.id === id) || null,
        createElement: (tag) => {
          const el = {
            tagName: tag.toUpperCase(),
            style: {},
            innerHTML: '',
            getContext: () => ({
              clearRect: () => {},
              fillRect: () => {},
              beginPath: () => {},
              arc: () => {},
              lineTo: () => {},
              closePath: () => {},
              fill: () => {},
              save: () => {},
              restore: () => {}
            })
          };
          return el;
        }
      },
      localStorage: {
        getItem: (k) => domStorage[k] || null,
        setItem: (k, v) => { domStorage[k] = String(v); }
      },
      fetch: async () => ({
        ok: true,
        json: async () => JSON.parse(fs.readFileSync(quotesPath, 'utf8'))
      }),
      requestAnimationFrame: () => {},
      console: { log: () => {}, warn: () => {}, error: () => {} },
      Date,
      Math,
      JSON,
      setTimeout,
      clearTimeout
    };

    sandbox.window.document = sandbox.document;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);

    // Case 1: High Score -> Khuyến khích
    await sandbox.window.showCheerOrComfortModal({
      score: 180,
      maxScore: 200,
      isPassed: true,
      level: 'HSK 2'
    });

    const modalHigh = createdElements.find(e => e.id === 'cheerComfortModal');
    assert.ok(modalHigh, 'Modal element must be created');
    assert.match(modalHigh.innerHTML, /KHUYẾN KHÍCH & VINH DANH THÀNH TÍCH/);
    assert.match(modalHigh.innerHTML, /ĐẠT CHUẨN/);
    assert.match(modalHigh.innerHTML, /\+50 EXP/);

    // Case 2: Low Score -> An ủi & Vỗ về
    await sandbox.window.showCheerOrComfortModal({
      score: 45,
      maxScore: 200,
      isPassed: false,
      level: 'HSK 2'
    });

    assert.match(modalHigh.innerHTML, /TIẾP SỨC & AN ỦI ĐỒNG HÀNH/);
    assert.match(modalHigh.innerHTML, /CHỜ BỨT PHÁ/);
    assert.match(modalHigh.innerHTML, /Bảo hiểm an ủi/);
    assert.match(modalHigh.innerHTML, /Vỗ về & Tiếp sức/);
  });
});
