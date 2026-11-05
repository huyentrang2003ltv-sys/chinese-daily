'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf8');
const supportJs = fs.readFileSync(path.join(rootDir, 'public', 'js', 'features', 'support.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(rootDir, 'public', 'styles.css'), 'utf8');

test('Dispute Resolution & Contact Channel Integrity (hoangpham1618@gmail.com)', async (t) => {
  await t.test('Guarantees 0 occurrences of legacy email hihsk.com@gmail.com', () => {
    assert.strictEqual(indexHtml.includes('hihsk.com@gmail.com'), false, 'index.html must not contain legacy email');
    assert.strictEqual(supportJs.includes('hihsk.com@gmail.com'), false, 'support.js must not contain legacy email');
  });

  await t.test('Verifies hoangpham1618@gmail.com is configured across Footer and Policies', () => {
    assert.ok(indexHtml.includes('mailto:hoangpham1618@gmail.com'), 'Footer must contain mailto:hoangpham1618@gmail.com');
    assert.ok(supportJs.includes('hoangpham1618@gmail.com'), 'Support policies must reference hoangpham1618@gmail.com');
    assert.ok(indexHtml.includes('openComplaintModal()'), 'Footer link must invoke openComplaintModal()');
  });

  await t.test('Validates complaint modal structure and high-priority stacking', () => {
    assert.ok(indexHtml.includes('id="complaintModal"'), 'index.html must define complaintModal');
    assert.ok(indexHtml.includes('id="complaintSenderName"'), 'Modal must have name input');
    assert.ok(indexHtml.includes('id="complaintSenderContact"'), 'Modal must have contact input');
    assert.ok(indexHtml.includes('id="complaintCategory"'), 'Modal must have category select');
    assert.ok(indexHtml.includes('id="complaintMessage"'), 'Modal must have message textarea');
    assert.ok(indexHtml.includes('id="complaintSubmitBtn"'), 'Modal must have submit button');
    assert.ok(stylesCss.includes('#complaintModal'), 'styles.css must include #complaintModal in high-priority stacking context');
  });

  await t.test('Verifies support.js exports complaint functions to window', () => {
    assert.ok(supportJs.includes('window.openComplaintModal = openComplaintModal;'), 'Must export openComplaintModal');
    assert.ok(supportJs.includes('window.closeComplaintModal = closeComplaintModal;'), 'Must export closeComplaintModal');
    assert.ok(supportJs.includes('window.submitComplaintForm = submitComplaintForm;'), 'Must export submitComplaintForm');
  });
});
