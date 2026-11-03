// Module state
let currentAppTheme = storage.getRaw('appTheme') || 'light';

// ==========================================
// THEME SWITCHER LOGIC (Light / Dark / System)
// ==========================================
function initTheme() {
  currentAppTheme = storage.getRaw('appTheme') || 'light';
  applyAppTheme(currentAppTheme);

  // Listen for OS system theme changes if set to system
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (currentAppTheme === 'system') {
        applyAppTheme('system');
      }
    });
  }

  // Close theme dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const container = document.getElementById('themeDropdownContainer');
    const menu = document.getElementById('themeDropdownMenu');
    if (container && menu && !container.contains(e.target) && !menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
    }
  });
}

function toggleThemeDropdown() {
  const menu = document.getElementById('themeDropdownMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function setAppTheme(theme) {
  currentAppTheme = theme;
  storage.setRaw('appTheme', theme);
  applyAppTheme(theme);
  
  const menu = document.getElementById('themeDropdownMenu');
  if (menu) {
    menu.classList.add('hidden');
  }

  const themeLabels = {
    light: 'Đã chuyển sang Giao diện Sáng ☀️',
    dark: 'Đã chuyển sang Giao diện Tối 🌙',
    system: 'Đã chuyển sang Giao diện Theo Hệ Thống 💻'
  };
  showToast(themeLabels[theme] || 'Đã cập nhật giao diện', 'success');
}

function applyAppTheme(theme) {
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Update button icon & label
  const iconEl = document.getElementById('themeCurrentIcon');
  const labelEl = document.getElementById('themeCurrentLabel');
  if (iconEl && labelEl) {
    if (theme === 'dark') {
      iconEl.textContent = '🌙';
      labelEl.textContent = 'Tối';
    } else if (theme === 'system') {
      iconEl.textContent = '💻';
      labelEl.textContent = 'Hệ Thống';
    } else {
      iconEl.textContent = '☀️';
      labelEl.textContent = 'Sáng';
    }
  }

  // Update checkmarks in dropdown
  const checkLight = document.getElementById('theme-check-light');
  const checkDark = document.getElementById('theme-check-dark');
  const checkSystem = document.getElementById('theme-check-system');
  if (checkLight && checkDark && checkSystem) {
    checkLight.classList.toggle('hidden', theme !== 'light');
    checkDark.classList.toggle('hidden', theme !== 'dark');
    checkSystem.classList.toggle('hidden', theme !== 'system');
  }
}
