const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/fcd0de37-cc82-48cb-abc3-c70b90fef4d4';

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.resolve('tmp/edge_vis_dual_admin_' + Date.now());
  const cdpPort = 9250;

  console.log('Launching headless Edge on CDP port', cdpPort);
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1100'
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1050,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:3005...');
  await send('Page.navigate', { url: 'http://localhost:3005' });
  await new Promise(r => setTimeout(r, 3000));

  async function takeScreenshot(fileName) {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(data, 'base64');
    const outPath = path.join(ARTIFACTS_DIR, fileName);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved screenshot: ${outPath} (${buffer.length} bytes)`);
  }

  // 1. Open quick social auth modal to verify dual admin cards
  console.log('1. Opening social quick modal...');
  await send('Runtime.evaluate', {
    expression: `
      if (typeof openSocialQuickModal === 'function') openSocialQuickModal('google');
    `
  });
  await new Promise(r => setTimeout(r, 1200));
  await takeScreenshot('dual_admin_quick_modal_verified.png');

  // 2. Perform 1-click login as Huyền Trang (huyentrang2003ltv@gmail.com)
  console.log('2. Performing 1-click login as Huyền Trang...');
  const loginRes = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        return await submitSocialQuickAuth('google', 'huyentrang2003ltv@gmail.com', 'Huyền Trang');
      })()
    `,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Login result:', loginRes.result.value);
  await new Promise(r => setTimeout(r, 2000));
  await takeScreenshot('huyentrang_admin_logged_in_verified.png');

  // 3. Open Admin Portal (#/admin)
  console.log('3. Navigating to #/admin as Huyền Trang...');
  await send('Runtime.evaluate', {
    expression: `
      if (typeof switchTab === 'function') switchTab('admin');
      else window.location.hash = '#/admin';
    `
  });
  await new Promise(r => setTimeout(r, 2000));
  await takeScreenshot('huyentrang_admin_portal_verified.png');

  console.log('Dual Admin visual verification complete!');
  ws.close();
  browserProc.kill();
}

run().catch(err => {
  console.error('Visual verification failed:', err);
  process.exit(1);
});
