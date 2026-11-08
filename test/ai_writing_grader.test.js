// test/ai_writing_grader.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const http = require('http');

const { gradeWritingSubmission } = require('../server/ai_tutor');
const clientModule = require('../public/js/features/ai_writing_grader');

test('AI Writing Grader & Error Corrector (Trợ Lý AI Chấm Điểm & Sửa Lỗi Tự Luận Viết HSK)', async (t) => {

  await t.test('1. Validates gradeWritingSubmission server logic and error cases', async () => {
    // Empty submission
    const emptyRes = await gradeWritingSubmission({ text: '   ' });
    assert.strictEqual(emptyRes.ok, false);
    assert.match(emptyRes.error, /Vui lòng nhập/);

    // Short text penalty
    const shortRes = await gradeWritingSubmission({
      text: '你好世界。',
      targetLevel: 5
    });
    assert.strictEqual(shortRes.ok, true);
    assert.strictEqual(shortRes.charCount, 4);
    assert.ok(shortRes.diagnostics.some(d => d.tag === 'Độ dài' && d.type === 'error'));
    assert.ok(shortRes.scores.total < 70);

    // High quality essay with keywords and connectors
    const goodEssay = '明天上午我有一场非常重要的求职面试。虽然心里难免感到有些紧张，但我早就做好了充分的准备。机会永远只留给有准备的人，我相信只要放平心态，就一定能取得成功！此外，我也会准时到达面试现场。';
    const goodRes = await gradeWritingSubmission({
      text: goodEssay,
      targetLevel: 5,
      keywords: ['面试', '紧张', '准备', '机会', '成功']
    });
    assert.strictEqual(goodRes.ok, true);
    assert.ok(goodRes.charCount >= 80);
    assert.ok(goodRes.scores.total >= 80);
    assert.ok(['A', 'A+'].includes(goodRes.scores.grade));
    assert.ok(goodRes.diagnostics.some(d => d.tag === 'Từ khóa đề bài' && d.type === 'praise'));
    assert.ok(goodRes.sentenceCorrections.length > 0);
  });

  await t.test('2. Validates grammar diagnostics: 的/地/得, 把 sentence, and connectives', async () => {
    // Wrong DE: 跑的快 instead of 跑得快
    const wrongDeText = '他每天早上在操场上跑的快，身体很健康。我们不仅要锻炼，而且要注意饮食，此外还要保证睡眠。';
    const deRes = await gradeWritingSubmission({
      text: wrongDeText,
      targetLevel: 4
    });
    assert.ok(deRes.diagnostics.some(d => d.tag === 'Trợ từ kết cấu' && d.message.includes('得')));
    // Sentence polish should offer correction
    assert.ok(deRes.sentenceCorrections.some(sc => sc.polished.includes('跑得快')));

    // Bare 把 sentence without complement
    const bareBaText = '他把苹果吃。随后他又把作业做。虽然很忙，但是很有序。';
    const baRes = await gradeWritingSubmission({
      text: bareBaText,
      targetLevel: 4
    });
    assert.ok(baRes.diagnostics.some(d => d.tag === 'Câu chữ 把' && d.type === 'error'));

    // Coherence check with multiple connectives
    const coherentText = '不仅如此，虽然遇到了困难，但是大家齐心协力，此外领导也给予了支持，总而言之我们成功了。';
    const cohRes = await gradeWritingSubmission({
      text: coherentText,
      targetLevel: 5
    });
    assert.ok(cohRes.diagnostics.some(d => d.tag === 'Tính liên kết' && d.type === 'success'));
  });

  await t.test('3. Validates client-side presets and fallback simulation', async () => {
    assert.ok(Array.isArray(clientModule.WRITING_TOPIC_PRESETS));
    assert.strictEqual(clientModule.WRITING_TOPIC_PRESETS.length, 4);

    const preset5 = clientModule.WRITING_TOPIC_PRESETS.find(p => p.id === 'hsk5_interview');
    assert.ok(preset5);
    assert.strictEqual(preset5.level, 5);
    assert.strictEqual(preset5.keywords.length, 5);
    assert.ok(preset5.sampleText.length >= 80);

    // Fallback simulation
    const simRes = clientModule.simulateClientSideGrading(preset5.sampleText, 5, preset5.keywords);
    assert.strictEqual(simRes.ok, true);
    assert.ok(simRes.scores.total >= 80);
    assert.ok(simRes.sentenceCorrections.length > 0);
  });

  await t.test('4. Validates index.html markup and script references', async () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    assert.ok(html.includes('id="aiWritingGraderModal"'), 'Modal must exist');
    assert.ok(html.includes('id="writingGraderTextInput"'), 'Text input must exist');
    assert.ok(html.includes('id="writingGraderPresetSelect"'), 'Preset select must exist');
    assert.ok(html.includes('id="writingGraderResultArea"'), 'Result area must exist');
    assert.ok(html.includes('src="js/features/ai_writing_grader.js"'), 'Script must be included in index.html');
    assert.ok(html.includes('openWritingGraderModal()'), 'Launcher buttons must exist');
  });

});
