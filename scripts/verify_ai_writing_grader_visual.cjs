// scripts/verify_ai_writing_grader_visual.cjs
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/fcd0de37-cc82-48cb-abc3-c70b90fef4d4';

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.resolve('tmp/edge_vis_aiwrite_' + Date.now());
  const cdpPort = 9230;

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

  // 1. Open AI Writing Grader modal
  console.log('Opening AI Writing Grader modal...');
  await sendCDP('Runtime.evaluate', {
    expression: `
      if (typeof openWritingGraderModal === 'function') {
        openWritingGraderModal();
      }
    `
  });
  await new Promise(r => setTimeout(r, 1200));
  await takeScreenshot(path.join(ARTIFACTS_DIR, 'ai_writing_grader_modal_verified.png'));

  // 2. Load sample text and submit for grading
  console.log('Loading sample text and submitting for grading...');
  await sendCDP('Runtime.evaluate', {
    expression: `
      if (typeof loadSampleWritingText === 'function') {
        loadSampleWritingText();
      }
      if (typeof submitWritingForAiGrading === 'function') {
        submitWritingForAiGrading();
      }
    `
  });
  await new Promise(r => setTimeout(r, 2500));

  // Scroll down within modal to see results cleanly
  await sendCDP('Runtime.evaluate', {
    expression: `
      const modalBody = document.querySelector('#aiWritingGraderModal .custom-scrollbar');
      if (modalBody) {
        modalBody.scrollTop = 350;
      }
    `
  });
  await new Promise(r => setTimeout(r, 800));
  await takeScreenshot(path.join(ARTIFACTS_DIR, 'ai_writing_grader_result_verified.png'));

  console.log('Completed screenshots successfully!');
  ws.close();
  browserProc.kill();
}

run().catch(err => {
  console.error('Visual verification error:', err);
  process.exit(1);
});
