const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

async function snapCheerAndComfort() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\fcd0de37-cc82-48cb-abc3-c70b90fef4d4';
  const outCheer = path.join(outDir, 'cheer_modal_encouragement_verified.png');
  const outComfort = path.join(outDir, 'comfort_modal_verified.png');
  const port = 9338;
  const userDataDir = path.join(__dirname, '..', 'tmp', 'edge_cheer_' + Date.now());

  const browserProc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-fre',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-sync',
    '--window-size=1280,1000',
    'http://localhost:3005/'
  ]);

  await new Promise(r => setTimeout(r, 3000));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json/list`, res => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => resolve(JSON.parse(raw)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.url && t.url.includes('localhost:3005')) || targets.find(t => t.type === 'page');
    console.log('Using target:', pageTarget.url);

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let id = 1;
    const pending = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    };

    await new Promise((resolve) => ws.onopen = resolve);
    const send = (method, params = {}) => new Promise((resolve) => {
      const reqId = id++;
      pending.set(reqId, resolve);
      ws.send(JSON.stringify({ id: reqId, method, params }));
    });

    await send('Runtime.enable');
    await send('Page.enable');

    // 1. Trigger High Score Encouragement Modal
    console.log('Triggering Cheer Encouragement Modal...');
    await send('Runtime.evaluate', {
      expression: `
        window.showCheerOrComfortModal({
          type: 'exam',
          level: 'HSK 3 (Đề số 01)',
          score: 285,
          maxScore: 300,
          isPassed: true
        });
      `,
      awaitPromise: true
    });

    await new Promise(r => setTimeout(r, 1200));

    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outCheer, Buffer.from(snap1.result.data, 'base64'));
    console.log('Saved Encouragement snapshot:', outCheer, fs.statSync(outCheer).size);

    // 2. Trigger Low Score Comforting Modal
    console.log('Triggering Comfort Consolation Modal...');
    await send('Runtime.evaluate', {
      expression: `
        window.showCheerOrComfortModal({
          type: 'exam',
          level: 'HSK 3 (Đề số 02)',
          score: 110,
          maxScore: 300,
          isPassed: false
        });
      `,
      awaitPromise: true
    });

    await new Promise(r => setTimeout(r, 1200));

    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outComfort, Buffer.from(snap2.result.data, 'base64'));
    console.log('Saved Comfort snapshot:', outComfort, fs.statSync(outComfort).size);

    ws.close();
  } catch (err) {
    console.error('Error in snapCheerAndComfort:', err);
  } finally {
    browserProc.kill();
  }
}

snapCheerAndComfort();
