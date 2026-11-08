// scripts/verify_hsk90_visual.cjs
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/fcd0de37-cc82-48cb-abc3-c70b90fef4d4';

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.resolve('tmp/edge_vis_hsk90_' + Date.now());
  const cdpPort = 9245;

  console.log('Launching headless Edge on CDP port', cdpPort);
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1100'
  ]);

  await new Promise(r => setTimeout(r, 1800));

  function cdpGet(urlPath) {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${cdpPort}${urlPath}`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  const targets = await cdpGet('/json');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  await new Promise(resolve => ws.on('open', resolve));

  let reqId = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const handler = (msg) => {
        const parsed = JSON.parse(msg);
        if (parsed.id === id) {
          ws.off('message', handler);
          if (parsed.error) reject(parsed.error);
          else resolve(parsed.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Navigating to http://localhost:3005/#/hsk90 ...');
  await send('Page.navigate', { url: 'http://localhost:3005/#/hsk90' });
  await new Promise(r => setTimeout(r, 2500));

  // Await switchTab and data loading
  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        if (typeof window.switchTab === 'function') {
          await window.switchTab('hsk90');
        }
        if (typeof window.ensureTabRendered === 'function') {
          await window.ensureTabRendered('hsk90');
        }
        if (window.renderHsk90Tab) {
          window.renderHsk90Tab();
        }
        return {
          title: document.title,
          activeTabSection: document.getElementById('tab-hsk90') ? !document.getElementById('tab-hsk90').classList.contains('hidden') : false,
          hasContent: document.getElementById('tab-hsk90') ? document.getElementById('tab-hsk90').innerHTML.length : 0
        };
      })()
    `,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Evaluation result:', evalRes.result ? evalRes.result.value : evalRes);

  await new Promise(r => setTimeout(r, 2000));

  // Scroll to tab-hsk90
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('tab-hsk90');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // Capture screenshot 1: Full Masterclass Roadmap & Studio Overview
  const snap1 = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const out1 = path.join(ARTIFACTS_DIR, 'hsk90_roadmap_masterclass_studio_verified.png');
  fs.writeFileSync(out1, Buffer.from(snap1.data, 'base64'));
  console.log('Saved screenshot 1 to', out1);

  // Switch to Grammar tab & interactive practice
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        if (window.switchHsk90LectureTab) window.switchHsk90LectureTab('grammar');
        if (window.switchHsk90PracticeMode) window.switchHsk90PracticeMode('reorder');
        const studio = document.getElementById('hsk90LectureContentArea');
        if (studio) studio.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // Capture screenshot 2: Grammar Formula & Sentence Scramble
  const snap2 = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const out2 = path.join(ARTIFACTS_DIR, 'hsk90_grammar_and_practice_lab_verified.png');
  fs.writeFileSync(out2, Buffer.from(snap2.data, 'base64'));
  console.log('Saved screenshot 2 to', out2);

  ws.close();
  browserProc.kill();
  console.log('Verification finished successfully!');
}

run().catch(e => {
  console.error('Visual verification failed:', e);
  process.exit(1);
});
