// scripts/verify_classifiers_and_polyphonic_visual.cjs
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/fcd0de37-cc82-48cb-abc3-c70b90fef4d4';

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.resolve('tmp/edge_vis_' + Date.now());
  const cdpPort = 9227;

  console.log('Launching headless Edge on CDP port', cdpPort);
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1400,1050'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  function cdpGet(urlPath) {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${cdpPort}${urlPath}`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  const tabs = await cdpGet('/json');
  const targetTab = tabs.find(t => t.type === 'page') || tabs[0];
  console.log('Target tab id:', targetTab.id);

  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  ws.on('open', () => console.log('WebSocket connected'));
  ws.on('message', raw => {
    const msg = JSON.parse(raw);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  });

  function sendCDP(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, res => {
        if (res.error) reject(res.error);
        else resolve(res.result);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(r => ws.on('open', r));

  console.log('Navigating to http://localhost:3005...');
  await sendCDP('Page.enable');
  await sendCDP('Page.navigate', { url: 'http://localhost:3005' });
  await new Promise(r => setTimeout(r, 2500));

  async function takeScreenshot(filePath) {
    const res = await sendCDP('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filePath);
  }

  // 1. Home tab with Hub Cards
  console.log('Evaluating Home Hub cards...');
  await sendCDP('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, 700);
    `
  });
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot(path.join(ARTIFACTS_DIR, 'home_hub_academic_modules_verified.png'));

  // 2. Classifiers Compendium
  console.log('Switching to Bách Khoa Lượng Từ...');
  await sendCDP('Runtime.evaluate', {
    expression: `
      if (typeof switchDictMode === 'function') {
        switchDictMode('classifier');
      }
      window.scrollTo(0, 0);
    `
  });
  await new Promise(r => setTimeout(r, 1200));
  await takeScreenshot(path.join(ARTIFACTS_DIR, 'classifiers_compendium_verified.png'));

  // 3. Classifier Quiz Interaction
  console.log('Interacting with classifier quiz...');
  await sendCDP('Runtime.evaluate', {
    expression: `
      if (typeof checkClassifierQuiz === 'function') {
        checkClassifierQuiz('clf_zhang', 0, 0);
      }
      window.scrollTo(0, 350);
    `
  });
  await new Promise(r => setTimeout(r, 800));
  await takeScreenshot(path.join(ARTIFACTS_DIR, 'classifiers_quiz_verified.png'));

  // 4. Polyphonic Words Compendium
  console.log('Switching to Chữ Đa Âm Đa Nghĩa...');
  await sendCDP('Runtime.evaluate', {
    expression: `
      if (typeof switchDictMode === 'function') {
        switchDictMode('polyphonic');
      }
      window.scrollTo(0, 0);
    `
  });
  await new Promise(r => setTimeout(r, 1200));
  await takeScreenshot(path.join(ARTIFACTS_DIR, 'polyphonic_compendium_verified.png'));

  // Close browser
  ws.close();
  browserProc.kill();
  console.log('Visual verification complete!');
  process.exit(0);
}

run().catch(err => {
  console.error('Error during visual verification:', err);
  process.exit(1);
});
