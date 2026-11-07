const { execSync, spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.resolve('tmp/edge_writing_' + Date.now());
  const cdpPort = 9225;

  console.log('Launching headless Edge on CDP port', cdpPort);
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,1000'
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

  const WebSocket = require('ws');
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

  console.log('Navigating to http://127.0.0.1:3005/#exam ...');
  await sendCmd('Page.navigate', { url: 'http://127.0.0.1:3005/#exam' });
  await new Promise(r => setTimeout(r, 3000));

  // Switch to HSK 3 and filter by writing
  console.log('Evaluating script to switch to HSK 3 and filter by writing...');
  const res = await sendCmd('Runtime.evaluate', {
    expression: `
      (async () => {
        if (typeof currentUser !== 'undefined') {
          currentUser = { email: 'admin@chinese-daily.com', name: 'Học Viên VIP', isVip: true, vipInfo: { tier: 'lifetime', isVip: true, expiryDate: '2099-12-31' } };
        }
        localStorage.setItem('hsk_current_user', JSON.stringify({ email: 'admin@chinese-daily.com', isVip: true, vipInfo: { tier: 'lifetime', isVip: true } }));
        if (typeof switchTab === 'function') switchTab('mockexam');
        if (typeof switchMockExamLevel === 'function') await switchMockExamLevel(3);
        await new Promise(r => setTimeout(r, 600));
        if (typeof filterExamQuestionsByPart === 'function') filterExamQuestionsByPart('writing');
        document.getElementById('tab-exam')?.scrollIntoView();
        const firstBox = document.querySelector('#mockExamQuestionsContainer > div');
        if (firstBox) firstBox.scrollIntoView({ block: 'center' });
        return {
          currentLevel: typeof currentExamLevel !== 'undefined' ? currentExamLevel : null,
          hasWritingBtn: !!document.getElementById('examPartBtn-writing'),
          writingBtnText: document.getElementById('examPartBtn-writing')?.innerText,
          writingBtnVisible: !document.getElementById('examPartBtn-writing')?.classList.contains('hidden'),
          qCount: document.querySelectorAll('#mockExamQuestionsContainer > div').length
        };
      })()
    `,
    returnByValue: true,
    awaitPromise: true
  });

  console.log('Full res:', JSON.stringify(res, null, 2));

  await new Promise(r => setTimeout(r, 1200));

  // Capture screenshot
  const screenshotRes = await sendCmd('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:/Users/Admin/.gemini/antigravity/brain/fcd0de37-cc82-48cb-abc3-c70b90fef4d4/mock_exam_writing_section_verified.png';
  fs.writeFileSync(outPath, Buffer.from(screenshotRes.result.data, 'base64'));
  console.log('Saved screenshot to:', outPath);

  ws.close();
  browserProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
