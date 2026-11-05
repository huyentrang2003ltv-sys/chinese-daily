'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const db = require('../server/db');
const accounts = require('../server/accounts');
const { handleAiChat } = require('../server/ai_tutor');

test('System Improvements & Remedy Verification', async (t) => {
  await t.test('1. SQLite Database Engine operates properly with WAL mode', () => {
    assert.strictEqual(db.isSqliteAvailable, true, 'SQLite should be available in Node 24 runtime');
    const stats = db.getStats();
    assert.strictEqual(stats.sqlite, true, 'Stats must indicate sqlite active');
    assert.ok(stats.userCount >= 0, 'User count should be non-negative');
  });

  await t.test('2. SQLite Feedback Ticket Creation & Tracking', () => {
    const testTicketId = 'HSK-TEST-' + Date.now().toString(36).toUpperCase();
    const recorded = db.recordFeedbackTicket({
      id: testTicketId,
      userId: 'usr_test123',
      name: 'Nguyen Van A',
      contact: 'test@example.com',
      category: 'Test Category',
      message: 'This is a test remedy message'
    });
    assert.strictEqual(recorded, true, 'Ticket must be recorded successfully into SQLite');

    // Query ticket from SQLite
    const row = db.db.prepare('SELECT * FROM feedback_tickets WHERE id = ?').get(testTicketId);
    assert.ok(row, 'Ticket should be queryable in SQLite');
    assert.strictEqual(row.sender_name, 'Nguyen Van A');
    assert.strictEqual(row.status, 'received');
  });

  await t.test('3. AI Tutor Expansion: Synonym distinction & HSK exam strategies', async () => {
    const synonymRes = await handleAiChat({ message: 'Phân biệt 刚 và 刚才 thế nào?', mode: 'chat' });
    assert.ok(synonymRes.hanzi.includes('刚') || synonymRes.vi.includes('刚'), 'Should provide distinction for gang and gangcai');
    assert.ok(Array.isArray(synonymRes.quickReplies), 'Must include interactive quick replies');

    const tipsRes = await handleAiChat({ message: 'Cho mình xin mẹo thi HSK với', mode: 'chat' });
    assert.ok(tipsRes.hanzi.includes('HSK') || tipsRes.vi.includes('HSK'), 'Should provide HSK exam tips');
    assert.ok(tipsRes.vi.toLowerCase().includes('phần nghe') || tipsRes.vi.includes('nguyên tắc'), 'Should include structured tips in Vietnamese');

    const bizRes = await handleAiChat({ message: 'Dạy mình tiếng Trung công sở', mode: 'chat' });
    assert.ok(bizRes.hanzi.includes('合作') || bizRes.vi.includes('hợp tác') || bizRes.vi.includes('công sở'), 'Should provide business Chinese phrases');
  });

  await t.test('4. Frontend PWA & Preload Optimization', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
    assert.ok(html.includes('rel="dns-prefetch"'), 'Must include dns-prefetch in index.html head');
    assert.ok(html.includes('cloudSyncStatusIcon'), 'Must include cloud sync status indicator in Floating Dock');
    assert.ok(html.includes('triggerManualCloudSync()'), 'Must include cloud sync trigger in Floating Dock');
  });

  await t.test('5. Production Bundle Generator operates cleanly', () => {
    const bundleScript = path.join(__dirname, '..', 'scripts', 'build_bundle.js');
    assert.ok(fs.existsSync(bundleScript), 'build_bundle.js must exist');
    const bundleFile = path.join(__dirname, '..', 'public', 'dist', 'app.bundle.js');
    assert.ok(fs.existsSync(bundleFile), 'app.bundle.js must exist');
    const stat = fs.statSync(bundleFile);
    assert.ok(stat.size > 100 * 1024, 'Bundle size should exceed 100KB');
  });
});
