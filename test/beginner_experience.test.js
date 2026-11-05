'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { handleAiChat } = require('../server/ai_tutor');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

test('Beginner Experience & 7-Day Golden Path (Zero-to-Hero)', async (t) => {
  const beginnerCode = fs.readFileSync(path.join(PUBLIC, 'js', 'features', 'beginner.js'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');

  await t.test('1. Validates 7-Day Curriculum Structure & Content', () => {
    assert.strictEqual(indexHtml.includes('id="beginnerGoldenPathSection"'), true, 'Index HTML contains beginner section');
    assert.strictEqual(indexHtml.includes('id="btnModeBeginner"'), true, 'Index HTML contains beginner mode button');
    assert.strictEqual(indexHtml.includes('id="btnModeAll"'), true, 'Index HTML contains all mode button');
    assert.strictEqual(indexHtml.includes('id="beginnerDayModal"'), true, 'Index HTML contains beginner day modal');
    assert.strictEqual(indexHtml.includes('js/features/beginner.js'), true, 'Index HTML links beginner.js');

    // Run in sandbox
    const mockStorage = new Map();
    const context = {
      console,
      storage: {
        get: (k, d) => (mockStorage.has(k) ? mockStorage.get(k) : d),
        set: (k, v) => mockStorage.set(k, v)
      },
      addExp: () => {},
      showToast: () => {},
      document: {
        body: { classList: { add() {}, remove() {} } },
        getElementById: () => null,
        querySelectorAll: () => []
      },
      window: {}
    };

    vm.createContext(context);
    vm.runInContext(beginnerCode, context);

    const curriculum = context.window.BEGINNER_CURRICULUM;
    assert.ok(Array.isArray(curriculum), 'Curriculum must be an array');
    assert.strictEqual(curriculum.length, 7, 'Must have exactly 7 days in curriculum');
    
    // Day 1 check
    const day1 = curriculum[0];
    assert.strictEqual(day1.day, 1);
    assert.strictEqual(day1.title.includes('Thanh Điệu'), true);
    assert.strictEqual(day1.contentHtml.includes('Thanh 1'), true);
    assert.strictEqual(day1.contentHtml.includes('Thanh 4'), true);
    assert.strictEqual(day1.contentHtml.includes('你好'), true);

    // Day 3 check
    const day3 = curriculum[2];
    assert.strictEqual(day3.day, 3);
    assert.strictEqual(day3.title.includes('Bút Thuận'), true);
    assert.strictEqual(day3.contentHtml.includes('Ngang trước, sổ sau'), true);

    // Day 4 check
    const day4 = curriculum[3];
    assert.strictEqual(day4.day, 4);
    assert.strictEqual(day4.title.includes('Bộ Thủ'), true);

    // Day 7 check
    const day7 = curriculum[6];
    assert.strictEqual(day7.day, 7);
    assert.strictEqual(day7.title.includes('Tốt Nghiệp'), true);
  });

  await t.test('2. Learner Mode Toggle Operates Cleanly', () => {
    const mockStorage = new Map();
    const context = {
      console,
      storage: {
        get: (k, d) => (mockStorage.has(k) ? mockStorage.get(k) : d),
        set: (k, v) => mockStorage.set(k, v)
      },
      showToast: () => {},
      document: {
        body: { classList: { add() {}, remove() {} } },
        getElementById: () => null,
        querySelectorAll: () => []
      },
      window: {}
    };
    vm.createContext(context);
    vm.runInContext(beginnerCode, context);

    // Defaults to beginner
    assert.strictEqual(context.getLearnerMode(), 'beginner');

    // Switch to all
    context.setLearnerMode('all');
    assert.strictEqual(context.getLearnerMode(), 'all');

    // Switch back to beginner
    context.setLearnerMode('beginner');
    assert.strictEqual(context.getLearnerMode(), 'beginner');
  });

  await t.test('3. Day Completion Rewards EXP & Progress Tracking', () => {
    const mockStorage = new Map();
    let totalExp = 0;
    const context = {
      console,
      storage: {
        get: (k, d) => (mockStorage.has(k) ? mockStorage.get(k) : d),
        set: (k, v) => mockStorage.set(k, v)
      },
      addExp: (amt) => { totalExp += amt; },
      showToast: () => {},
      renderBeginnerGoldenPath: () => {},
      closeBeginnerDayModal: () => {},
      document: {
        body: { classList: { add() {}, remove() {} } },
        getElementById: () => null,
        querySelectorAll: () => []
      },
      window: {}
    };
    vm.createContext(context);
    vm.runInContext(beginnerCode, context);

    // Open Day 1 and complete
    context.openBeginnerDayModal(1);
    context.completeActiveBeginnerDay();

    assert.strictEqual(totalExp, 25, 'Awarded 25 EXP for Day 1');
    const prog = context.getBeginnerProgress();
    assert.strictEqual(prog.completedDays.includes(1), true, 'Day 1 marked completed');
    assert.strictEqual(prog.currentDay, 2, 'Advanced to Day 2');
  });

  await t.test('4. AI Tutor Responds Warmly to Beginner Inquiries', async () => {
    // 1) Zero-base beginner inquiry
    const r1 = await handleAiChat({ message: 'Em là người mới bắt đầu F0, nên học từ đâu ạ?', mode: 'chat' });
    assert.strictEqual(r1.vi.toLowerCase().includes('người mới bắt đầu') || r1.vi.toLowerCase().includes('lộ trình nhập môn'), true);
    assert.strictEqual(r1.quickReplies.length > 0, true);

    // 2) Tones inquiry
    const r2 = await handleAiChat({ message: 'Làm sao để phân biệt 4 thanh điệu tiếng Trung?', mode: 'chat' });
    assert.strictEqual(r2.vi.includes('4 thanh điệu chính'), true);
    assert.strictEqual(r2.vi.includes('Thanh 1'), true);

    // 3) Stroke order inquiry
    const r3 = await handleAiChat({ message: 'Quy tắc bút thuận viết chữ Hán là gì?', mode: 'chat' });
    assert.strictEqual(r3.vi.includes('bút thuận'), true);
    assert.strictEqual(r3.vi.includes('Ngang trước sổ sau'), true);
  });
});
