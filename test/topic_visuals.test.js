'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

describe('Thematic Vocabulary Visual Illustration Engine (Hình Ảnh Minh Họa Từ Vựng Theo Chủ Đề)', () => {
  const root = path.join(__dirname, '..');
  const visualsScriptPath = path.join(root, 'public', 'js', 'features', 'topic_visuals.js');
  const indexHtmlPath = path.join(root, 'public', 'index.html');
  const serverHttpPath = path.join(root, 'server', 'http.js');

  it('1. Validates topic_visuals.js exists and exports required methods in VM sandbox', () => {
    assert.ok(fs.existsSync(visualsScriptPath), 'topic_visuals.js must exist');
    const code = fs.readFileSync(visualsScriptPath, 'utf8');

    const sandbox = {
      window: {},
      localStorage: {
        getItem: () => null,
        setItem: () => {}
      },
      document: {
        getElementById: () => null
      }
    };
    sandbox.window = sandbox;

    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);

    assert.strictEqual(typeof sandbox.getWordIllustration, 'function', 'getWordIllustration must be exported');
    assert.strictEqual(typeof sandbox.getTopicCoverInfo, 'function', 'getTopicCoverInfo must be exported');
    assert.strictEqual(typeof sandbox.renderTopicHeroBanner, 'function', 'renderTopicHeroBanner must be exported');
    assert.strictEqual(typeof sandbox.toggleTopicImages, 'function', 'toggleTopicImages must be exported');
  });

  it('2. Correctly matches concrete high-frequency vocabulary words with illustrative images', () => {
    const code = fs.readFileSync(visualsScriptPath, 'utf8');
    const sandbox = {
      window: {},
      localStorage: { getItem: () => null, setItem: () => {} },
      document: { getElementById: () => null }
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);

    const apple = sandbox.getWordIllustration({ title: '苹果', meaning: 'quả táo', topicId: 'tu_vung_cac_loai_trai_cay' });
    assert.ok(apple && apple.url, 'Apple should have image URL');
    assert.strictEqual(apple.isSpecific, true, 'Apple should be specific match');
    assert.ok(apple.url.includes('unsplash.com'), 'URL should come from verified CDN');

    const cat = sandbox.getWordIllustration({ title: '猫', meaning: 'con mèo', topicId: 'tu_vung_chu_de_con_vat_dong_vat' });
    assert.ok(cat && cat.url, 'Cat should have image URL');
    assert.strictEqual(cat.isSpecific, true);

    const school = sandbox.getWordIllustration({ title: '学校', meaning: 'trường học', topicId: 'tu_vung_chu_de_truong_hoc' });
    assert.ok(school && school.url, 'School should have image URL');
    assert.strictEqual(school.isSpecific, true);

    // Fallback to topic cover
    const weldingTool = sandbox.getWordIllustration({ title: '熔渣', meaning: 'xỉ hàn', topicId: 'tu_vung_chuyen_nganh_han_xi' });
    assert.ok(weldingTool && weldingTool.url, 'Should fallback to topic illustration for generic words');
  });

  it('3. Validates Topic Cover Info across super categories and granular topics', () => {
    const code = fs.readFileSync(visualsScriptPath, 'utf8');
    const sandbox = {
      window: {},
      localStorage: { getItem: () => null, setItem: () => {} },
      document: { getElementById: () => null }
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);

    const allCover = sandbox.getTopicCoverInfo('all', 'all');
    assert.ok(allCover && allCover.url, 'Default cover must have url');

    const schoolCover = sandbox.getTopicCoverInfo('tu_vung_chu_de_truong_hoc', 'daily');
    assert.ok(schoolCover && schoolCover.url.includes('unsplash.com'), 'School topic cover must exist');
    assert.ok(schoolCover.titleZh, 'School topic cover should have Chinese title');
  });

  it('4. Validates CSP in server/http.js permits images.unsplash.com', () => {
    const serverHttpCode = fs.readFileSync(serverHttpPath, 'utf8');
    assert.ok(serverHttpCode.includes('https://images.unsplash.com'), 'CSP img-src must whitelist images.unsplash.com');
  });

  it('5. Validates index.html integration: script tag, hero banner, and image toggle control', () => {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');
    assert.ok(html.includes('js/features/topic_visuals.js'), 'index.html must load topic_visuals.js');
    assert.ok(html.includes('id="topicHeroBanner"'), 'index.html must have #topicHeroBanner');
    assert.ok(html.includes('id="btn-topic-toggle-images"'), 'index.html must have toggle images button');
  });
});
