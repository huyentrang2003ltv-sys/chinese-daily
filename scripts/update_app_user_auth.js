const fs = require('fs');

const appPath = 'app.js';
let appCode = fs.readFileSync(appPath, 'utf8');

// 1. Update initial userProfile
const oldProfileDef = `// Gamification & Profile State
let userProfile = {
  streak: 1,
  exp: 50,
  lastStudyDate: new Date().toISOString().split('T')[0],
  savedWords: []
};`;

const newProfileDef = `// Gamification & User Auth Profile State
let userProfile = {
  name: 'Phạm Hoàng',
  email: 'hoangpham1618@gmail.com',
  isLoggedIn: true,
  streak: 1,
  exp: 50,
  lastStudyDate: new Date().toISOString().split('T')[0],
  savedWords: []
};`;

appCode = appCode.replace(oldProfileDef, newProfileDef);

// 2. Enhance loadUserProfile and updateProfileUI
const oldProfileSection = `function updateProfileUI() {
  const streakEl = document.getElementById('headerStreak');
  const expEl = document.getElementById('headerExp');
  const notebookCountEl = document.getElementById('headerNotebookCount');
  
  if (streakEl) streakEl.innerText = userProfile.streak || 1;
  if (expEl) expEl.innerText = userProfile.exp || 0;
  if (notebookCountEl) notebookCountEl.innerText = (userProfile.savedWords || []).length;
}`;

const newProfileSection = `function updateProfileUI() {
  const streakEl = document.getElementById('headerStreak');
  const expEl = document.getElementById('headerExp');
  const notebookCountEl = document.getElementById('headerNotebookCount');
  
  if (streakEl) streakEl.innerText = userProfile.streak || 1;
  if (expEl) expEl.innerText = userProfile.exp || 0;
  if (notebookCountEl) notebookCountEl.innerText = (userProfile.savedWords || []).length;

  const headerUserBtn = document.getElementById('headerUserBtn');
  const headerLoginBtn = document.getElementById('headerLoginBtn');
  const headerUserName = document.getElementById('headerUserName');
  const headerUserInitial = document.getElementById('headerUserInitial');
  const dropdownUserName = document.getElementById('dropdownUserName');
  const dropdownUserEmail = document.getElementById('dropdownUserEmail');
  const dropdownUserInitial = document.getElementById('dropdownUserInitial');
  const dropdownNotebookCount = document.getElementById('dropdownNotebookCount');

  const isLoggedIn = userProfile.isLoggedIn !== false;
  const name = userProfile.name || 'Phạm Hoàng';
  const email = userProfile.email || 'hoangpham1618@gmail.com';
  
  // Extract initial (last word first char, or first char)
  const trimmed = name.trim();
  const lastSpace = trimmed.lastIndexOf(' ');
  const initialChar = (lastSpace >= 0 ? trimmed.charAt(lastSpace + 1) : trimmed.charAt(0)) || 'H';

  if (headerUserBtn && headerLoginBtn) {
    if (isLoggedIn) {
      headerUserBtn.classList.remove('hidden');
      headerUserBtn.classList.add('flex');
      headerLoginBtn.classList.add('hidden');
      headerLoginBtn.classList.remove('flex');
      if (headerUserName) headerUserName.innerText = name;
      if (headerUserInitial) headerUserInitial.innerText = initialChar.toUpperCase();
    } else {
      headerUserBtn.classList.add('hidden');
      headerUserBtn.classList.remove('flex');
      headerLoginBtn.classList.remove('hidden');
      headerLoginBtn.classList.add('flex');
    }
  }

  if (dropdownUserName) dropdownUserName.innerText = name;
  if (dropdownUserEmail) dropdownUserEmail.innerText = email;
  if (dropdownUserInitial) dropdownUserInitial.innerText = initialChar.toUpperCase();
  if (dropdownNotebookCount) dropdownNotebookCount.innerText = (userProfile.savedWords || []).length;
}

// ---------------- USER AUTHENTICATION & PROFILE HANDLERS ----------------
function toggleUserDropdown() {
  const menu = document.getElementById('userDropdownMenu');
  if (!menu) return;
  menu.classList.toggle('hidden');
  refreshIcons(menu);
}

function closeUserDropdown() {
  const menu = document.getElementById('userDropdownMenu');
  if (menu) menu.classList.add('hidden');
}

function openAuthModal() {
  closeUserDropdown();
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('hidden');
    const nameInput = document.getElementById('authNameInput');
    const emailInput = document.getElementById('authEmailInput');
    if (nameInput) nameInput.value = userProfile.name || '';
    if (emailInput) emailInput.value = userProfile.email || '';
    refreshIcons(modal);
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('hidden');
}

function quickLoginDemo(name, email) {
  userProfile.name = name;
  userProfile.email = email;
  userProfile.isLoggedIn = true;
  saveUserProfile();
  closeAuthModal();
  showToast(\`Chào mừng bạn \${name} đã đăng nhập thành công!\`, 'success');
}

function handleAuthFormSubmit(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('authNameInput');
  const emailInput = document.getElementById('authEmailInput');
  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  
  if (!name) {
    showToast('Vui lòng nhập tên người dùng!', 'warning');
    return;
  }

  userProfile.name = name;
  if (email) userProfile.email = email;
  userProfile.isLoggedIn = true;
  saveUserProfile();
  closeAuthModal();
  showToast(\`Đăng nhập thành công! Chào bạn \${name}\`, 'success');
}

function handleLogout() {
  closeUserDropdown();
  userProfile.isLoggedIn = false;
  saveUserProfile();
  showToast('Đã đăng xuất tài khoản. Bạn có thể đăng nhập lại bất cứ lúc nào.', 'info');
}

function openEditNameModal() {
  openAuthModal();
}`;

appCode = appCode.replace(oldProfileSection, newProfileSection);

// 3. Add click outside handler
const oldDocClick = `  // Close theme dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const themeContainer = document.getElementById('themeDropdownContainer');
    const themeMenu = document.getElementById('themeDropdownMenu');
    if (themeContainer && themeMenu && !themeContainer.contains(e.target)) {
      themeMenu.classList.add('hidden');
    }
  });`;

const newDocClick = `  // Close theme dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const themeContainer = document.getElementById('themeDropdownContainer');
    const themeMenu = document.getElementById('themeDropdownMenu');
    if (themeContainer && themeMenu && !themeContainer.contains(e.target)) {
      themeMenu.classList.add('hidden');
    }

    const userAuthContainer = document.getElementById('userAuthContainer');
    const userMenu = document.getElementById('userDropdownMenu');
    if (userAuthContainer && userMenu && !userAuthContainer.contains(e.target)) {
      userMenu.classList.add('hidden');
    }
  });`;

appCode = appCode.replace(oldDocClick, newDocClick);

// 4. Update Escape listener and export window bindings
const oldWindowBindings = `window.toggleVisitorStatsModal = toggleVisitorStatsModal;
window.openVisitorStatsModal = openVisitorStatsModal;
window.closeVisitorStatsModal = closeVisitorStatsModal;
window.refreshVisitorFeed = refreshVisitorFeed;`;

const newWindowBindings = `window.toggleVisitorStatsModal = toggleVisitorStatsModal;
window.openVisitorStatsModal = openVisitorStatsModal;
window.closeVisitorStatsModal = closeVisitorStatsModal;
window.refreshVisitorFeed = refreshVisitorFeed;
window.toggleUserDropdown = toggleUserDropdown;
window.closeUserDropdown = closeUserDropdown;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.quickLoginDemo = quickLoginDemo;
window.handleAuthFormSubmit = handleAuthFormSubmit;
window.handleLogout = handleLogout;
window.openEditNameModal = openEditNameModal;`;

appCode = appCode.replace(oldWindowBindings, newWindowBindings);

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('Successfully updated app.js with user authentication logic!');
