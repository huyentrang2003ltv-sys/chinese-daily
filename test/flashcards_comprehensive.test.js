const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

describe('Flashcards Comprehensive Review System & Vocabulary Integration', () => {
  const dictData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/dictionary.json'), 'utf8'));
  const thematicData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/thematic_vocab.json'), 'utf8'));
  const topicsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/topics.json'), 'utf8'));
  const multiData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/multidimensional_words.json'), 'utf8'));

  it('Verifies full dictionary vocabulary expansion to 3,592 words across HSK 1 - 6', () => {
    assert.ok(dictData.length >= 3592, `Expected at least 3592 dictionary words, got ${dictData.length}`);
    const levels = new Set(dictData.map(d => d.level));
    for (let l = 1; l <= 6; l++) {
      assert.ok(levels.has(l), `Missing HSK level ${l} in dictionary`);
    }
  });

  it('Verifies full thematic vocabulary has 14,605 words across 125 topics', () => {
    assert.equal(thematicData.length, 14605, `Expected 14,605 thematic words, got ${thematicData.length}`);
    assert.equal(topicsData.length, 125, `Expected 125 topics, got ${topicsData.length}`);
  });

  it('Simulates flashcards.js in VM sandbox and verifies queue building for all modes', () => {
    const flashcardsCode = fs.readFileSync(path.join(__dirname, '../public/js/features/flashcards.js'), 'utf8');

    // Setup browser/app environment sandbox
    const sandbox = {
      dictionaryData: dictData,
      thematicVocabData: thematicData,
      topicsData: topicsData,
      multidimensionalWordsData: multiData,
      srsState: { cards: {} },
      userProfile: { savedWords: [{ hanzi: '爱', pinyin: 'ài', meaning: 'yêu', hsk: 1 }] },
      srsStats: () => ({ due: 0, learning: 0, mastered: 0, total: 0 }),
      srsDueCards: () => [],
      srsAddCard: () => true,
      srsReview: () => {},
      addExp: () => {},
      showToast: () => {},
      refreshIcons: () => {},
      jsArg: arg => JSON.stringify(arg),
      document: {
        addEventListener: () => {},
        removeEventListener: () => {},
        getElementById: () => null,
        querySelector: () => null
      },
      window: {},
      console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(flashcardsCode, sandbox);

    // Test 1: toFlashcard enriched with Hán Việt & examples
    const cardAi = sandbox.window.toFlashcard({ title: '爱' });
    assert.ok(cardAi, 'Card should be created');
    assert.equal(cardAi.title, '爱');
    assert.equal(cardAi.hanviet, 'Ái', 'Hán Việt should be populated');
    assert.ok(cardAi.exampleSentence, 'Example sentence should be populated');

    // Test 2: HSK All mode (3592 words available, batch sized to 10)
    sandbox.window.startFlashcardSession('new', { level: 'all', batchSize: 10 });
    const queueAll10 = sandbox.window.getFlashcardQueue();
    assert.equal(queueAll10.length, 10, 'Queue should slice to 10 cards');

    // Test 3: Batch size of 50
    sandbox.window.startFlashcardSession('new', { level: 'all', batchSize: 50 });
    const queueAll50 = sandbox.window.getFlashcardQueue();
    assert.equal(queueAll50.length, 50, 'Queue should slice to 50 cards');

    // Test 4: Batch size 0 (All cards)
    sandbox.window.startFlashcardSession('new', { level: 1, batchSize: 0 });
    const queueHsk1All = sandbox.window.getFlashcardQueue();
    const hsk1Count = dictData.filter(d => d.level === 1).length;
    assert.equal(queueHsk1All.length, hsk1Count, `Expected ${hsk1Count} HSK 1 cards, got ${queueHsk1All.length}`);

    // Test 5: Thematic Topic Mode
    sandbox.window.startFlashcardSession('topic', { topic: 'tu_vung_chu_de_truong_hoc', batchSize: 20 });
    const topicQueue = sandbox.window.getFlashcardQueue();
    assert.equal(topicQueue.length, 20, 'Topic queue should return 20 cards');
    assert.ok(topicQueue[0].topicName.includes('trường học') || topicQueue[0].topicId === 'tu_vung_chu_de_truong_hoc');

    // Test 6: Browse Mode
    sandbox.window.startFlashcardSession('browse', { level: 'all', batchSize: 100 });
    const browseQueue = sandbox.window.getFlashcardQueue();
    assert.equal(browseQueue.length, 100, 'Browse queue should return 100 cards');
  });
});
