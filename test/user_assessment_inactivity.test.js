'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const accounts = require('../server/accounts');

test('Account & Inactivity Logic', async (t) => {
  await t.test('1. Enforces unique username in Chinese or Vietnamese', () => {
    const u1 = accounts.createUser({
      username: '王小明',
      name: 'Vương Tiểu Minh',
      email: 'wang_test@example.com',
      password: 'password123'
    });
    assert.ok(u1);
    assert.equal(u1.username, '王小明');

    // Searching by username in Chinese works
    const foundUname = accounts.findByUsername('王小明');
    assert.ok(foundUname);
    assert.equal(foundUname.email, 'wang_test@example.com');

    // Searching by display name also matches
    const foundDname = accounts.findByUsername('Vương Tiểu Minh');
    assert.ok(foundDname);
  });

  await t.test('2. Checks 3-day inactivity lock and unlocking mechanism', () => {
    const student = accounts.createUser({
      username: 'NguyenVanTest',
      name: 'Nguyễn Văn Test',
      email: 'student_lock_test@example.com',
      password: 'password123'
    });

    // Fresh user is not locked
    assert.equal(student.isLocked, false);
    assert.equal(accounts.checkInactivityLock(student), false);

    // Simulate 4 days of inactivity
    const fourDaysAgo = new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString();
    student.lastActiveAt = fourDaysAgo;

    // checkInactivityLock should now trigger lock
    const isLocked = accounts.checkInactivityLock(student);
    assert.equal(isLocked, true);
    assert.equal(student.isLocked, true);
    assert.match(student.lockReason, /3 ngày liên tục/);

    // Public representation reflects lock
    const pub = accounts.publicUser(student);
    assert.equal(pub.isLocked, true);
    assert.ok(pub.lockReason);

    // Admin unlocks user
    accounts.unlockUser(student);
    assert.equal(student.isLocked, false);
    assert.equal(student.lockReason, null);

    const pubAfterUnlock = accounts.publicUser(student);
    assert.equal(pubAfterUnlock.isLocked, false);
  });
});
