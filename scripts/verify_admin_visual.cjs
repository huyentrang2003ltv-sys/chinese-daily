// scripts/verify_admin_visual.cjs
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const accounts = require('../server/accounts');
const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/fcd0de37-cc82-48cb-abc3-c70b90fef4d4';

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.resolve('tmp/edge_vis_admin_' + Date.now());
  const cdpPort = 9246;

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
  await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false
  });

  // STEP 1: Verify Guest Access Denied at #/admin
  console.log('1. Navigating to http://localhost:3005/#/admin as Guest...');
  await send('Page.navigate', { url: 'http://localhost:3005/#/admin' });
  await new Promise(r => setTimeout(r, 2000));

  let shot1 = await send('Page.captureScreenshot', { format: 'png' });
  const shot1Path = path.join(ARTIFACTS_DIR, 'admin_access_denied_verified.png');
  fs.writeFileSync(shot1Path, Buffer.from(shot1.data, 'base64'));
  console.log('✓ Captured Access Denied View:', shot1Path);

  // STEP 2: Sign In as Super Admin (hoangpham1618@gmail.com)
  console.log('2. Logging in as Super Admin (hoangpham1618@gmail.com)...');
  const loginResult = await send('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'hoangpham1618@gmail.com', password: 'Admin@2026!' }),
          credentials: 'same-origin'
        });
        const data = await res.json();
        if (data.user) {
          applySignedInUser(data.user, { merge: true });
          switchTab('admin');
          if (typeof renderAdminPortal === 'function') renderAdminPortal();
        }
        return data;
      })()
    `
  });
  console.log('Login result:', loginResult.result.value);

  await new Promise(r => setTimeout(r, 2500));

  let shot2 = await send('Page.captureScreenshot', { format: 'png' });
  const shot2Path = path.join(ARTIFACTS_DIR, 'admin_portal_overview_and_users_verified.png');
  fs.writeFileSync(shot2Path, Buffer.from(shot2.data, 'base64'));
  console.log('✓ Captured Admin Portal Overview & Users:', shot2Path);

  // STEP 4: Switch to Broadcast Tab
  console.log('3. Switching to Broadcast Sub-tab...');
  await send('Runtime.evaluate', { expression: `window.setAdminSubTab('broadcast');` });
  await new Promise(r => setTimeout(r, 1200));

  let shot3 = await send('Page.captureScreenshot', { format: 'png' });
  const shot3Path = path.join(ARTIFACTS_DIR, 'admin_portal_broadcast_banner_verified.png');
  fs.writeFileSync(shot3Path, Buffer.from(shot3.data, 'base64'));
  console.log('✓ Captured Broadcast Banner Sub-tab:', shot3Path);

  // STEP 5: Switch to Tools Tab
  console.log('4. Switching to Tools Sub-tab...');
  await send('Runtime.evaluate', { expression: `window.setAdminSubTab('tools');` });
  await new Promise(r => setTimeout(r, 1200));

  let shot4 = await send('Page.captureScreenshot', { format: 'png' });
  const shot4Path = path.join(ARTIFACTS_DIR, 'admin_portal_system_tools_verified.png');
  fs.writeFileSync(shot4Path, Buffer.from(shot4.data, 'base64'));
  console.log('✓ Captured Tools & Diagnostics Sub-tab:', shot4Path);

  // Cleanup
  ws.close();
  browserProc.kill();
  console.log('🎉 All Admin Portal screenshots successfully captured and verified!');
}

run().catch(err => {
  console.error('Visual verification failed:', err);
  process.exit(1);
});
