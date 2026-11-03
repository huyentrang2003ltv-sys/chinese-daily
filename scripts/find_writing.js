const fs = require('fs');
const path = require('path');

const app = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
const lines = app.split('\n');
lines.forEach((l, i) => {
  if (l.includes('writing') || l.includes('tab-btn-writing') || l.includes('tab-writing') || l.includes("switchTab('writing')")) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
