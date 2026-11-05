const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Practice 4-Skills Comprehensive Question Bank Integrity', async (t) => {
  const practicePath = path.join(__dirname, '..', 'public', 'data', 'practice.json');
  assert.ok(fs.existsSync(practicePath), 'practice.json file must exist');

  const questions = JSON.parse(fs.readFileSync(practicePath, 'utf8'));

  await t.test('Total questions count is expanded to at least 180', () => {
    assert.ok(questions.length >= 180, `Expected >= 180 questions, got ${questions.length}`);
  });

  await t.test('Balanced across all 6 HSK levels (at least 20 per level)', () => {
    const levelCounts = {};
    for (let l = 1; l <= 6; l++) levelCounts[l] = 0;
    questions.forEach(q => {
      levelCounts[q.level] = (levelCounts[q.level] || 0) + 1;
    });

    for (let l = 1; l <= 6; l++) {
      assert.ok(levelCounts[l] >= 20, `Level HSK ${l} must have at least 20 questions, got ${levelCounts[l]}`);
    }
  });

  await t.test('Balanced across all 4 core language skills (at least 35 per skill)', () => {
    const skillCounts = {
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0
    };
    questions.forEach(q => {
      if (skillCounts[q.skill] !== undefined) {
        skillCounts[q.skill]++;
      }
    });

    assert.ok(skillCounts.listening >= 35, `Listening must have >= 35 questions, got ${skillCounts.listening}`);
    assert.ok(skillCounts.speaking >= 35, `Speaking must have >= 35 questions, got ${skillCounts.speaking}`);
    assert.ok(skillCounts.reading >= 35, `Reading must have >= 35 questions, got ${skillCounts.reading}`);
    assert.ok(skillCounts.writing >= 35, `Writing must have >= 35 questions, got ${skillCounts.writing}`);
  });

  await t.test('Schema validation for every single question', () => {
    questions.forEach((q, idx) => {
      assert.ok(q.id, `Question at index ${idx} must have an id`);
      assert.ok(q.level >= 1 && q.level <= 6, `Question ${q.id} has invalid level`);
      assert.ok(['listening', 'speaking', 'reading', 'writing'].includes(q.skill), `Question ${q.id} has invalid skill`);
      assert.ok(q.explanation && q.explanation.length > 5, `Question ${q.id} must have detailed explanation`);

      if (q.skill === 'speaking') {
        assert.ok(q.targetText, `Speaking question ${q.id} must have targetText`);
        assert.ok(q.targetPinyin, `Speaking question ${q.id} must have targetPinyin`);
      } else if (q.skill === 'writing' && q.subType === 'reorder') {
        assert.ok(Array.isArray(q.words) && q.words.length >= 2, `Writing question ${q.id} must have words array`);
        assert.ok(Array.isArray(q.correctOrder) && q.correctOrder.length >= 2, `Writing question ${q.id} must have correctOrder array`);
        assert.equal(q.words.length, q.correctOrder.length, `Writing question ${q.id} words and correctOrder length must match`);
      } else {
        assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Question ${q.id} must have options array`);
        assert.ok(q.options.some(o => o.isCorrect === true), `Question ${q.id} must have at least one correct option`);
      }
    });
  });
});
