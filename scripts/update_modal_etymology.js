const fs = require('fs');
const path = require('path');

// 1. Update index.html
const indexPath = path.join(__dirname, '../index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const targetWordModalBtn = `<button id="modalBookmarkBtn" onclick="toggleSaveWordFromModal()"`;
const etymoBtnHtml = `<button onclick="openEtymologyFromWordModal()" class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-[#8B1E1E] dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-all cursor-pointer shadow-2xs">
            <i data-lucide="network" class="w-3.5 h-3.5 text-[#8B1E1E] dark:text-rose-400"></i>
            <span>Xem Chiết Tự</span>
          </button>\n          <button id="modalBookmarkBtn" onclick="toggleSaveWordFromModal()"`;

if (!indexContent.includes('openEtymologyFromWordModal()') && indexContent.includes(targetWordModalBtn)) {
  indexContent = indexContent.replace(targetWordModalBtn, etymoBtnHtml);
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('Added "Xem Chiết Tự" button to Word Modal in index.html');
}

// 2. Update app.js
const appPath = path.join(__dirname, '../app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('function openEtymologyFromWordModal()')) {
  const insertBefore = 'function updateWordModalBookmarkState() {';
  const newFunc = `function openEtymologyFromWordModal() {
  if (!currentWordModalWord) return;
  const word = currentWordModalWord.title;
  closeWordModal();
  switchTab('etymology');
  setTimeout(() => {
    selectOrDecomposeEtymology(word);
  }, 80);
}

function updateWordModalBookmarkState() {`;

  appContent = appContent.replace(insertBefore, newFunc);
  
  // Also export on window
  appContent = appContent.replace(
    'window.openWritingModalFromWordModal = openWritingModalFromWordModal;',
    'window.openWritingModalFromWordModal = openWritingModalFromWordModal;\nwindow.openEtymologyFromWordModal = openEtymologyFromWordModal;'
  );

  // Update selectSearchResult etymology branch
  const oldSelectEtymo = `  } else if (item.type === 'etymology') {
    switchTab('etymology');
    showToast(\`Đang mở chiết tự chữ: \${item.title}\`, 'info');
  }`;

  const newSelectEtymo = `  } else if (item.type === 'etymology') {
    switchTab('etymology');
    setTimeout(() => {
      selectOrDecomposeEtymology(item.title);
    }, 80);
    showToast(\`Đang mở chiết tự chữ: \${item.title}\`, 'info');
  }`;

  if (appContent.includes(oldSelectEtymo)) {
    appContent = appContent.replace(oldSelectEtymo, newSelectEtymo);
    console.log('Updated selectSearchResult for etymology');
  }

  fs.writeFileSync(appPath, appContent, 'utf8');
  console.log('Added openEtymologyFromWordModal to app.js');
}
