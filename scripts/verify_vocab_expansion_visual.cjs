const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/fcd0de37-cc82-48cb-abc3-c70b90fef4d4';

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.resolve('tmp/edge_vis_' + Date.now());
  const cdpPort = 9226;

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

  function sendCmd(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(r => ws.on('open', r));
  await sendCmd('Page.enable');
  await sendCmd('Runtime.enable');

  console.log('Navigating to http://127.0.0.1:3005 ...');
  await sendCmd('Page.navigate', { url: 'http://127.0.0.1:3005' });
  await new Promise(r => setTimeout(r, 2500));

  // --- Snapshot 1: Home Dashboard Hub Card for Cẩm Nang Mở Rộng Từ Vựng ---
  console.log('Capturing Snapshot 1: Home Hub Card...');
  await sendCmd('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, 850);
    `
  });
  await new Promise(r => setTimeout(r, 600));
  const snap1 = await sendCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'vocab_expansion_home_hub_verified.png'), Buffer.from(snap1.result.data, 'base64'));
  console.log('Saved vocab_expansion_home_hub_verified.png');

  // --- Snapshot 2: Switch to Dictionary tab and expansion mode ---
  console.log('Switching to Dictionary -> Cẩm Nang Mở Rộng Từ Vựng...');
  const resExp = await sendCmd('Runtime.evaluate', {
    expression: `
      (async () => {
        if (typeof switchTab === 'function') switchTab('dictionary');
        await new Promise(r => setTimeout(r, 500));
        if (typeof switchDictMode === 'function') await switchDictMode('expansion');
        await new Promise(r => setTimeout(r, 600));
        const rootEl = document.getElementById('dictSectionExpansion');
        if (rootEl) rootEl.scrollIntoView({ block: 'start' });
        return {
          currentDictMode: typeof currentDictMode !== 'undefined' ? currentDictMode : null,
          hasSection: !!document.getElementById('dictSectionExpansion'),
          hasMindmap: !!document.querySelector('#vocabExpContentArea .font-hanzi'),
          rootChar: document.querySelector('#vocabExpContentArea .font-hanzi')?.innerText
        };
      })()
    `,
    returnByValue: true,
    awaitPromise: true
  });
  console.log('Eval result:', JSON.stringify(resExp, null, 2));
  await new Promise(r => setTimeout(r, 1000));

  const snap2 = await sendCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'vocab_expansion_mindmap_verified.png'), Buffer.from(snap2.result.data, 'base64'));
  console.log('Saved vocab_expansion_mindmap_verified.png');

  // --- Snapshot 3: Scroll down to Example Sentence Cards ---
  console.log('Capturing Snapshot 3: Example Sentence Cards...');
  await sendCmd('Runtime.evaluate', {
    expression: `
      const exHeader = document.querySelector('#vocabExpContentArea h3:last-of-type') || document.querySelector('#vocabExpContentArea .grid.grid-cols-1.md\\\\:grid-cols-2');
      if (exHeader) exHeader.scrollIntoView({ block: 'start' });
      else window.scrollBy(0, 600);
    `
  });
  await new Promise(r => setTimeout(r, 800));
  const snap3 = await sendCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'vocab_expansion_examples_verified.png'), Buffer.from(snap3.result.data, 'base64'));
  console.log('Saved vocab_expansion_examples_verified.png');

  // Clean up
  ws.close();
  browserProc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('Visual verification complete!');
  process.exit(0);
}

run().catch(err => {
  console.error('Visual verification failed:', err);
  process.exit(1);
});
