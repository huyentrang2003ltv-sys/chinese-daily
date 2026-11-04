const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('150 Situational Dialogues Data Integrity & Completeness', async (t) => {
  const filePath = path.resolve(__dirname, '../public/data/conversations_150.json');
  assert.ok(fs.existsSync(filePath), 'conversations_150.json must exist');

  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);

  await t.test('Total count is exactly 150', () => {
    assert.equal(data.length, 150, 'Must have exactly 150 dialogues');
  });

  await t.test('Consecutive numbers from 1 to 150', () => {
    for (let i = 1; i <= 150; i++) {
      const item = data.find(x => x.number === i);
      assert.ok(item, `Dialogue #${i} must exist`);
      assert.equal(item.number, i);
      assert.equal(item.id, `conv_${i}`);
    }
  });

  await t.test('15 Topics each have exactly 10 dialogues', () => {
    const topicCounts = {};
    data.forEach(item => {
      topicCounts[item.topicId] = (topicCounts[item.topicId] || 0) + 1;
    });

    for (let tId = 1; tId <= 15; tId++) {
      assert.equal(topicCounts[tId], 10, `Topic ${tId} must contain exactly 10 dialogues`);
    }
  });

  await t.test('Every single dialogue contains all 15 required components', () => {
    data.forEach((item, idx) => {
      const num = item.number;

      // 1. Title
      assert.ok(item.title && item.title.trim().length > 0, `#${num} missing title`);
      assert.ok(item.titleHanzi && item.titleHanzi.trim().length > 0, `#${num} missing titleHanzi`);
      assert.ok(item.titlePinyin && item.titlePinyin.trim().length > 0, `#${num} missing titlePinyin`);

      // 2. Topic
      assert.ok(item.topicId >= 1 && item.topicId <= 15, `#${num} invalid topicId`);
      assert.ok(item.topic && item.topic.length > 0, `#${num} missing topic`);

      // 3. Level
      assert.ok(item.level && item.level.startsWith('HSK'), `#${num} invalid level`);

      // 4. Situation
      assert.ok(item.situation && item.situation.length > 5, `#${num} missing situation`);

      // 5. Characters
      assert.ok(Array.isArray(item.characters) && item.characters.length >= 2, `#${num} must have at least 2 characters`);
      item.characters.forEach(c => {
        assert.ok(c.name, `#${num} character missing name`);
        assert.ok(c.role, `#${num} character missing role`);
        assert.ok(c.gender === 'male' || c.gender === 'female', `#${num} character gender must be male/female`);
        assert.ok(c.avatar, `#${num} character missing avatar`);
      });

      // 6, 7, 8: Dialogue turns, pinyin, vi
      assert.ok(Array.isArray(item.dialogue) && item.dialogue.length >= 4, `#${num} dialogue must have at least 4 turns`);
      item.dialogue.forEach((turn, tIdx) => {
        assert.ok(turn.speaker, `#${num} turn ${tIdx} missing speaker`);
        assert.ok(turn.hanzi && turn.hanzi.length > 0, `#${num} turn ${tIdx} missing hanzi`);
        assert.ok(turn.pinyin && turn.pinyin.length > 0, `#${num} turn ${tIdx} missing pinyin`);
        assert.ok(turn.vi && turn.vi.length > 0, `#${num} turn ${tIdx} missing vi`);
      });

      // 9. Vocabulary
      assert.ok(Array.isArray(item.vocabulary) && item.vocabulary.length >= 3, `#${num} vocabulary must have at least 3 words`);
      item.vocabulary.forEach((v, vIdx) => {
        assert.ok(v.hanzi, `#${num} vocab ${vIdx} missing hanzi`);
        assert.ok(v.pinyin, `#${num} vocab ${vIdx} missing pinyin`);
        assert.ok(v.meaning, `#${num} vocab ${vIdx} missing meaning`);
      });

      // 10. Grammar
      assert.ok(Array.isArray(item.grammar) && item.grammar.length >= 1, `#${num} grammar must have at least 1 note`);
      item.grammar.forEach((g, gIdx) => {
        assert.ok(g.title, `#${num} grammar ${gIdx} missing title`);
        assert.ok(g.explanation, `#${num} grammar ${gIdx} missing explanation`);
      });

      // 12. Quiz
      assert.ok(Array.isArray(item.quiz) && item.quiz.length >= 1, `#${num} quiz must have at least 1 question`);
      item.quiz.forEach((q, qIdx) => {
        assert.ok(q.question, `#${num} quiz ${qIdx} missing question`);
        assert.ok(Array.isArray(q.options) && q.options.length === 4, `#${num} quiz ${qIdx} must have 4 options`);
        assert.ok(typeof q.answer === 'number' && q.answer >= 0 && q.answer <= 3, `#${num} quiz ${qIdx} answer index must be 0-3`);
      });

      // 13. Speaking practice
      assert.ok(item.speakingPractice, `#${num} missing speakingPractice`);
      assert.ok(item.speakingPractice.targetHanzi, `#${num} speakingPractice missing targetHanzi`);
      assert.ok(item.speakingPractice.targetPinyin, `#${num} speakingPractice missing targetPinyin`);
      assert.ok(item.speakingPractice.targetVi, `#${num} speakingPractice missing targetVi`);
    });
  });
});
