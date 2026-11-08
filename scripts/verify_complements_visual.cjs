// scripts/verify_complements_visual.cjs
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/fcd0de37-cc82-48cb-abc3-c70b90fef4d4';

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.resolve('tmp/edge_vis_cmp_' + Date.now());
  const cdpPort = 9228;

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

  // Navigate to grammar tab and switch to complements view
  console.log('Switching to Grammar -> Bách Khoa Bổ Ngữ...');
  await sendCDP('Runtime.evaluate', {
    expression: `
      if (typeof switchTab === 'function') {
        switchTab('grammar');
      }
      setTimeout(() => {
        if (typeof setGrammarViewMode === 'function') {
          setGrammarViewMode('complements');
        }
      }, 400);
      window.scrollTo(0, 0);
    `
  });
  await new Promise(r => setTimeout(r, 1500));
  await takeScreenshot(path.join(ARTIFACTS_DIR, 'complements_masterclass_verified.png'));

  // Interact with Quiz
  console.log('Interacting with complement quiz...');
  await sendCDP('Runtime.evaluate', {
    expression: `
      if (typeof checkComplementQuiz === 'function') {
        checkComplementQuiz('cmp_res_wan', 0, 0);
      }
      window.scrollTo(0, 380);
    `
  });
  await new Promise(r => setTimeout(r, 800));
  await takeScreenshot(path.join(ARTIFACTS_DIR, 'complements_quiz_interactive_verified.png'));

  // Close browser
  ws.close();
  browserProc.kill();
  console.log('Complements visual verification complete!');
  process.exit(0);
}

run().catch(err => {
  console.error('Error during visual verification:', err);
  process.exit(1);
});
