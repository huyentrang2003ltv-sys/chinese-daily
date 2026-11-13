const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/fcd0de37-cc82-48cb-abc3-c70b90fef4d4';

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.resolve('tmp/edge_ent_' + Date.now());
  const cdpPort = 9260;

  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1400,1000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

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
  await send('Page.navigate', { url: 'http://localhost:3005/#/home' });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Capture Home Featured Entertainment Cards
  await send('Runtime.evaluate', {
    expression: `
      const el = document.querySelector('.grid.grid-cols-1.md\\\\:grid-cols-2.gap-4.mb-4') || document.querySelector('[onclick*="openPvPArenaModal"]');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 500));
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'home_edutainment_cards_verified.png'), Buffer.from(shot1.data, 'base64'));
  console.log('✓ Captured home_edutainment_cards_verified.png');

  // 2. Open PvP Arena Modal (Lobby)
  await send('Runtime.evaluate', {
    expression: `window.openPvPArenaModal('ai');`
  });
  await new Promise(r => setTimeout(r, 800));
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'pvp_arena_lobby_verified.png'), Buffer.from(shot2.data, 'base64'));
  console.log('✓ Captured pvp_arena_lobby_verified.png');

  // 3. Start PvP Match and answer 1 question to verify live battle gameplay
  await send('Runtime.evaluate', {
    expression: `
      window.startPvPMatch();
    `
  });
  // Wait for 3-2-1 countdown (3.2s)
  await new Promise(r => setTimeout(r, 3800));
  // Answer question
  await send('Runtime.evaluate', {
    expression: `
      if (typeof window.submitPvPAnswer === 'function') {
        window.submitPvPAnswer(0);
      }
    `
  });
  await new Promise(r => setTimeout(r, 700));
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'pvp_arena_gameplay_verified.png'), Buffer.from(shot3.data, 'base64'));
  console.log('✓ Captured pvp_arena_gameplay_verified.png');

  // 4. Close PvP Arena and Open Wordle Modal
  await send('Runtime.evaluate', {
    expression: `
      if (typeof window.closePvPArenaModal === 'function') {
        window.isMatchRunning = false;
        const modal = document.getElementById('pvpArenaModal');
        if (modal) modal.classList.add('hidden');
      }
      window.openWordleModal(true);
    `
  });
  await new Promise(r => setTimeout(r, 800));
  const shot4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'wordle_stage_verified.png'), Buffer.from(shot4.data, 'base64'));
  console.log('✓ Captured wordle_stage_verified.png');

  // 5. Input characters and evaluate
  await send('Runtime.evaluate', {
    expression: `
      // Guess 1
      window.handleWordleCharInput('画');
      window.handleWordleCharInput('蛇');
      window.handleWordleCharInput('添');
      window.handleWordleCharInput('足');
      window.handleWordleSubmit();
    `
  });
  await new Promise(r => setTimeout(r, 1000));
  const shot5 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'wordle_solved_card_verified.png'), Buffer.from(shot5.data, 'base64'));
  console.log('✓ Captured wordle_solved_card_verified.png');

  ws.close();
  browserProc.kill();
  console.log('All entertainment verification screenshots saved successfully!');
}

run().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
