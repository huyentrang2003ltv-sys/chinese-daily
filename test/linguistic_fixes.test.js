'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Linguistic Integrity, Phonetics & Mobile UX Audit Suite', async (t) => {
  const dictPath = path.join(__dirname, '../public/data/dictionary.json');
  const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

  await t.test('1. dictionary.json: 0 words contain "Đang cập nhật" placeholder', () => {
    const updating = dict.filter(w => w.hanviet && w.hanviet.includes('cập nhật'));
    assert.equal(updating.length, 0, 'Must have 0 words with "Đang cập nhật" in hanviet field');
  });

  await t.test('2. dictionary.json: Word "拉" has correct Sino-Vietnamese, native example sentence & translation', () => {
    const la = dict.find(w => w.title === '拉');
    assert.ok(la, 'Word 拉 must exist in dictionary');
    assert.ok(la.hanviet.includes('Lạp') || la.hanviet.includes('Lôi'), 'Hanviet of 拉 must be Lạp or Lôi');
    assert.ok(la.exampleSentence.includes('门上写着'), 'Example must be authentic Chinese');
    assert.ok(la.examplePinyin.length > 0, 'Example pinyin must not be empty');
    assert.ok(la.exampleMeaning.includes('kéo'), 'Example meaning must accurately translate to Vietnamese');
  });

  await t.test('3. dictionary.json: Core high-frequency vocabulary have valid capitalized Hanviet readings', () => {
    const sampleWords = ['美丽', '经常', '祝贺', '寒冷', '富裕', '结束', '突然'];
    sampleWords.forEach(wTitle => {
      const entry = dict.find(w => w.title === wTitle);
      assert.ok(entry, `Entry for ${wTitle} must exist`);
      assert.ok(entry.hanviet && entry.hanviet.length > 1, `Hanviet for ${wTitle} must exist`);
      assert.ok(!entry.hanviet.includes('cập nhật'), `Hanviet for ${wTitle} must not be placeholder`);
      assert.equal(entry.hanviet.charAt(0), entry.hanviet.charAt(0).toUpperCase(), 'Must be capitalized');
    });
  });

  await t.test('4. index.html: Heading correctly states "6 Trụ Cột Học Tập Trọng Tâm"', () => {
    const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    assert.ok(html.includes('Hệ Thống 6 Trụ Cột Học Tập Trọng Tâm') || html.includes('6 Trụ Cột Học Tập Trọng Tâm'));
    assert.ok(!html.includes('5 Trụ Cột Học Tập Trọng Tâm'), 'Must eliminate 5 Trụ Cột typo');
  });

  await t.test('5. index.html: Mobile floating toolbar is hidden by default to prevent blocking content', () => {
    const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    assert.ok(html.includes('id="quickFloatingToolbar" class="hidden md:flex'), 'Toolbar must be hidden on mobile (hidden md:flex)');
    assert.ok(html.includes('id="btnHideFloatingDock"\n      onclick="toggleFloatingDockVisibility(true)" \n      title="Ẩn trợ lý & hỗ trợ nếu không cần thiết"\n      class="group hidden md:flex') || html.includes('id="btnHideFloatingDock"') && html.includes('hidden md:flex'));
  });

  await t.test('6. pinyin_guide.json: Contains complete tone sandhi and spelling rules', () => {
    const pinyinGuide = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/pinyin_guide.json'), 'utf8'));
    assert.ok(Array.isArray(pinyinGuide.toneSandhiRules));
    assert.ok(pinyinGuide.toneSandhiRules.length >= 4, 'Must have at least 4 tone sandhi rules (3+3, bù, yī, half-3)');
    assert.ok(pinyinGuide.toneSandhiRules.some(r => r.title.includes('3 + 3')));
    assert.ok(pinyinGuide.toneSandhiRules.some(r => r.title.includes('不')));
    assert.ok(pinyinGuide.toneSandhiRules.some(r => r.title.includes('一')));
  });

  await t.test('7. polyphonic_words.json: Contains core polyphonic characters 得, 行, 重, 长', () => {
    const poly = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/polyphonic_words.json'), 'utf8'));
    const chars = poly.map(p => p.char);
    assert.ok(chars.includes('得'), 'Must include 得');
    assert.ok(chars.includes('行'), 'Must include 行');
    assert.ok(chars.includes('重'), 'Must include 重');
    assert.ok(chars.includes('长'), 'Must include 长');
  });
});
