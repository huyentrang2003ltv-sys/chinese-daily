const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { handleAiChat } = require('../server/ai_tutor');

describe('AI Conversational Tutor Engine (Hỏi & Trả Lời Thông Minh)', () => {
  it('rejects empty message with meaningful error', async () => {
    await assert.rejects(
      async () => handleAiChat({ message: '' }),
      /Thiếu nội dung tin nhắn/
    );
  });

  it('answers greeting with Chinese, Pinyin, Vietnamese and interactive follow-up question', async () => {
    const res = await handleAiChat({ message: 'Xin chào bạn nhé', mode: 'chat' });
    assert.ok(res.hanzi, 'Must have Chinese response');
    assert.ok(res.pinyin, 'Must have Pinyin');
    assert.ok(res.vi, 'Must have Vietnamese translation');
    assert.ok(res.followUp, 'Must have interactive follow-up question');
    assert.ok(Array.isArray(res.quickReplies) && res.quickReplies.length > 0, 'Must provide quick reply suggestions');
    assert.ok(res.quickReplies[0].hanzi, 'Quick reply must have hanzi');
  });

  it('answers name inquiry by introducing itself and asking student name', async () => {
    const res = await handleAiChat({ message: 'Bạn tên là gì vậy?', mode: 'chat' });
    assert.ok(res.hanzi.includes('小华'), 'Should introduce as Xiao Hua');
    assert.ok(res.followUp.includes('名字'), 'Should ask user name back');
    assert.ok(res.quickReplies.length >= 2, 'Should give user name reply options');
  });

  it('answers food and dining inquiry with cultural knowledge and asking favorite food', async () => {
    const res = await handleAiChat({ message: 'Bạn ăn cơm chưa? Có món gì ngon không?', mode: 'chat' });
    assert.ok(res.hanzi.includes('菜') || res.hanzi.includes('吃'), 'Should talk about food');
    assert.ok(res.followUp, 'Should ask a food question');
    assert.ok(res.quickReplies.some(q => q.hanzi.includes('吃') || q.hanzi.includes('火锅') || q.hanzi.includes('菜')));
  });

  it('answers weather question and asks about student local weather', async () => {
    const res = await handleAiChat({ message: 'Hôm nay trời mưa hay nắng?', mode: 'chat' });
    assert.ok(res.hanzi.includes('天气'), 'Should discuss weather');
    assert.ok(res.followUp.includes('天气'), 'Should ask about student weather');
  });

  it('answers study tips and HSK questions encouragingly', async () => {
    const res = await handleAiChat({ message: 'Học tiếng Trung có khó không bạn ơi?', mode: 'chat' });
    assert.ok(res.hanzi.includes('中文') || res.hanzi.includes('汉字'), 'Should give study advice');
    assert.ok(res.followUp, 'Should ask follow-up study question');
  });

  it('handles grammar doctor mode with structural tips and feedback', async () => {
    const res = await handleAiChat({ message: '我把作业做完了。', mode: 'grammar' });
    assert.ok(res.grammarTips, 'Must have grammar doctor tips');
    assert.ok(res.grammarTips.includes('把'), 'Must mention 把 structure');
    assert.ok(res.quickReplies.length > 0, 'Must have grammar quick replies');
  });

  it('handles general arbitrary query and always maintains conversation loop', async () => {
    const res = await handleAiChat({ message: 'Tôi muốn đi Bắc Kinh du lịch', mode: 'chat' });
    assert.ok(res.hanzi, 'Must generate coherent Chinese response');
    assert.ok(res.pinyin, 'Must provide pinyin');
    assert.ok(res.vi, 'Must provide translation');
    assert.ok(res.followUp, 'Must always follow up with a question so the conversation does not end');
    assert.ok(res.quickReplies.length > 0, 'Must provide quick reply choices');
  });
});
