const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Situational Dialogues, Routing & Modal Architecture Integrity', async (t) => {
  const indexHtml = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
  const routerJs = fs.readFileSync(path.join(__dirname, '../public/js/core/router.js'), 'utf8');
  const aichatJs = fs.readFileSync(path.join(__dirname, '../public/js/features/aichat.js'), 'utf8');
  const ttsJs = fs.readFileSync(path.join(__dirname, '../public/js/core/tts.js'), 'utf8');

  await t.test('1. Router TAB_ALIASES includes conversations and related aliases', () => {
    assert.match(routerJs, /conversations:\s*['"]aichat['"]/);
    assert.match(routerJs, /conversation:\s*['"]aichat['"]/);
    assert.match(routerJs, /hoithoai:\s*['"]aichat['"]/);
    assert.match(routerJs, /scenarios:\s*['"]aichat['"]/);
  });

  await t.test('2. convStudioModal is relocated outside <main> at the root with z-[100] and backdrop click', () => {
    // Must be after </main>
    const mainCloseIdx = indexHtml.indexOf('</main>');
    const modalIdx = indexHtml.indexOf('id="convStudioModal"');
    assert.ok(mainCloseIdx > 0, '</main> must exist');
    assert.ok(modalIdx > mainCloseIdx, '#convStudioModal must be placed outside and after </main>');
    assert.match(indexHtml, /id="convStudioModal"[^>]*z-\[100\]/);
    assert.match(indexHtml, /id="convStudioModal"[^>]*closeConvStudio\(\)/);
  });

  await t.test('3. Home page (tab-home) includes prominent Hub 5 for 150 Hội Thoại Tình Huống', () => {
    assert.match(indexHtml, /150 Hội Thoại Tình Huống/);
    assert.match(indexHtml, /switchTab\(['"]aichat['"]\)[^>]*glass-card/);
  });

  await t.test('4. stopChineseTTS is properly exported and integrated', () => {
    assert.match(ttsJs, /function\s+stopChineseTTS\s*\(\)/);
    assert.match(aichatJs, /stopChineseTTS\(\)/);
  });

  await t.test('5. aichat.js switchAiChatTabMode matches roleplay button ID', () => {
    assert.match(aichatJs, /btn-conv-tab-roleplay/);
  });

  await t.test('6. aichat.js card rendering attaches onclick to outer card', () => {
    assert.match(aichatJs, /onclick="openConvStudio\(\$\{item\.number\}\)"/);
  });
});
