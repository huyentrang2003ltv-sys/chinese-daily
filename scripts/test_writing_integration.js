const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

console.log('Testing writing integration:');

// 1. Ensure tab-btn-writing is removed from menu
const hasNavWriting = html.includes('id="tab-btn-writing"');
console.log('Nav button tab-btn-writing removed:', !hasNavWriting ? 'OK (Removed)' : 'FAIL (Still exists)');

// 2. Ensure section tab-writing is removed
const hasTabWriting = html.includes('id="tab-writing"');
console.log('Section tab-writing removed:', !hasTabWriting ? 'OK (Removed)' : 'FAIL (Still exists)');

// 3. Ensure writingModal exists
const hasWritingModal = html.includes('id="writingModal"');
console.log('Writing modal exists:', hasWritingModal ? 'OK' : 'FAIL');

// 4. Check modal inner elements
const modalElements = [
  'writingModalTitleWord',
  'writingCharPinyin',
  'writingCharMeaning',
  'writingCharTabsContainer',
  'writingStatusBadge',
  'hanziWriterTarget',
  'writingFeedbackMsg',
  'customWritingInput',
  'writingQuickPickContainer'
];

modalElements.forEach(id => {
  const exists = html.includes(`id="${id}"`);
  console.log(`Element #${id}:`, exists ? 'OK' : 'MISSING');
});

// 5. Check app.js exports
const expectedExports = [
  'window.openWritingModal',
  'window.closeWritingModal',
  'window.selectWritingModalChar'
];

expectedExports.forEach(exp => {
  const exists = app.includes(exp);
  console.log(`Export ${exp}:`, exists ? 'OK' : 'MISSING');
});
