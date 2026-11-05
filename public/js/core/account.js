// =========================================================================
// Accounts: sign-in state (HttpOnly session cookie), progress sync, user menu, admin panel
// =========================================================================
// The server is the only source of truth for who is signed in, their role and VIP status.
// Progress (EXP, streak, notebook, SRS deck) lives in localStorage and is mirrored to the
// account while signed in, so it follows the learner across devices.
let currentUser = null;
let progressSyncTimer = null;
const PROGRESS_SYNC_DELAY_MS = 3000;

async function apiRequest(url, { method = 'GET', body } = {}) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin'
  });
  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    // Non-JSON error page
  }
  if (!res.ok || data.ok === false) {
    const err = new Error(data.error || `Lỗi máy chủ (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const isAdmin = () => Boolean(currentUser && currentUser.role === 'admin');

async function initAccount() {
  try {
    const { user } = await apiRequest('/api/auth/me');
    if (user) applySignedInUser(user, { merge: true });
  } catch (e) {
    // Offline or static hosting: the app keeps working as a guest.
  }
  renderAccountUi();
}

// ---------------- Progress sync ----------------
function progressSnapshot() {
  return {
    exp: userProfile.exp || 0,
    streak: userProfile.streak || 0,
    lastStudyDate: userProfile.lastStudyDate,
    dailyGoal: userProfile.dailyGoal,
    savedWords: userProfile.savedWords || [],
    activity: userProfile.activity || {},
    lastLesson: userProfile.lastLesson || null,
    srs: srsState
  };
}

function scheduleProgressSync() {
  if (!currentUser) return;
  clearTimeout(progressSyncTimer);
  progressSyncTimer = setTimeout(syncProgressNow, PROGRESS_SYNC_DELAY_MS);
}

async function syncProgressNow() {
  clearTimeout(progressSyncTimer);
  if (!currentUser) return;
  try {
    await apiRequest('/api/me/progress', { method: 'PUT', body: progressSnapshot() });
  } catch (e) {
    if (e.status === 401) {
      currentUser = null;
      renderAccountUi();
    }
  }
}

// Push pending changes when the learner leaves the page.
document.addEventListener('visibilitychange', () => {
  if (document.hidden && progressSyncTimer) syncProgressNow();
});

/** Combine what this browser has with what the account has (never loses progress on either side). */
function mergeServerProgress(remote) {
  if (!remote || typeof remote !== 'object') return;
  userProfile.exp = Math.max(userProfile.exp || 0, remote.exp || 0);
  userProfile.streak = Math.max(userProfile.streak || 0, remote.streak || 0);
  if (remote.dailyGoal && !storage.get(PROFILE_STORAGE_KEY)) userProfile.dailyGoal = remote.dailyGoal;

  const saved = new Map((userProfile.savedWords || []).map(w => [w.hanzi, w]));
  (remote.savedWords || []).forEach(w => {
    if (w && w.hanzi && !saved.has(w.hanzi)) {
      saved.set(w.hanzi, w);
      srsAddCard({ hanzi: w.hanzi, pinyin: w.pinyin, meaning: w.meaning, level: w.hsk }, false);
    }
  });
  userProfile.savedWords = [...saved.values()];

  Object.entries(remote.activity || {}).forEach(([day, points]) => {
    userProfile.activity[day] = Math.max(userProfile.activity[day] || 0, Number(points) || 0);
  });
  if (!userProfile.lastLesson && remote.lastLesson) userProfile.lastLesson = remote.lastLesson;

  const remoteCards = (remote.srs && remote.srs.cards) || {};
  Object.entries(remoteCards).forEach(([hanzi, card]) => {
    const local = srsState.cards[hanzi];
    if (!local || (card.reviews || 0) > (local.reviews || 0)) srsState.cards[hanzi] = card;
  });
  storage.set(SRS_STORAGE_KEY, srsState);
}

function applySignedInUser(user, { merge = false } = {}) {
  currentUser = user;
  if (!userProfile.name) userProfile.name = user.name;
  userProfile.name = user.name;
  if (merge) mergeServerProgress(user.progress);
  saveUserProfile();
  renderAccountUi();
  if (typeof onProfileChanged === 'function') onProfileChanged();
}

// ---------------- Header & user menu ----------------
function initialOf(name) {
  const trimmed = String(name || '').trim();
  const lastSpace = trimmed.lastIndexOf(' ');
  return (trimmed.charAt(lastSpace + 1) || trimmed.charAt(0) || '?').toUpperCase();
}

function renderAccountUi() {
  const signedIn = Boolean(currentUser);
  const show = (id, visible, display = 'flex') => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('hidden', !visible);
    el.classList.toggle(display, visible);
  };
  const text = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  show('headerUserBtn', signedIn);
  show('headerLoginBtn', !signedIn);
  show('headerAdminCrown', isAdmin(), 'inline');
  show('dropdownCrownIcon', isAdmin(), 'inline');
  const adminBtn = document.getElementById('dropdownAdminPanelBtn');
  if (adminBtn) adminBtn.hidden = !isAdmin();

  if (signedIn) {
    text('headerUserName', currentUser.name);
    text('headerUserInitial', initialOf(currentUser.name));
    text('dropdownUserName', currentUser.name);
    text('dropdownUserInitial', initialOf(currentUser.name));
    text('dropdownUserEmail', currentUser.email);
    const badge = document.getElementById('dropdownUserRoleBadge');
    if (badge) badge.textContent = isAdmin() ? '👑 Quản trị viên' : '🎓 Học viên';
  } else {
    closeUserDropdown();
  }
  renderVipBadge();
  if (activeTab === 'home' && typeof renderHomeDashboard === 'function') renderHomeDashboard();
}

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

document.addEventListener('click', e => {
  const container = document.getElementById('userAuthContainer');
  if (container && !container.contains(e.target)) closeUserDropdown();
});

// ---------------- Sign-in / sign-up modal ----------------
const AUTH_TAB_CLASSES = {
  active: {
    login: 'flex-1 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer',
    register: 'flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer'
  },
  idle: 'flex-1 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:text-[#8B1E1E] dark:hover:text-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer'
};

function setAuthError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message || '';
  el.classList.toggle('hidden', !message);
}

function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('authLoginView')?.classList.toggle('hidden', !isLogin);
  document.getElementById('authRegisterView')?.classList.toggle('hidden', isLogin);
  const btnLogin = document.getElementById('authTabBtnLogin');
  const btnRegister = document.getElementById('authTabBtnRegister');
  if (btnLogin) btnLogin.className = isLogin ? AUTH_TAB_CLASSES.active.login : AUTH_TAB_CLASSES.idle;
  if (btnRegister) btnRegister.className = isLogin ? AUTH_TAB_CLASSES.idle : AUTH_TAB_CLASSES.active.register;
  setAuthError('loginErrorMsg', '');
  setAuthError('registerErrorMsg', '');
  refreshIcons(document.getElementById('authModal'));
}

function openAuthModal(defaultTab = 'login') {
  closeUserDropdown();
  switchAuthTab(defaultTab);
  openModal('authModal');
}

function closeAuthModal() {
  closeModal('authModal');
}
registerModal('authModal', closeAuthModal);

function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const reveal = input.type === 'password';
  input.type = reveal ? 'text' : 'password';
  const icon = document.getElementById(iconId);
  if (icon) icon.setAttribute('data-lucide', reveal ? 'eye-off' : 'eye');
  refreshIcons(document.getElementById('authModal'));
}

/** Disable a submit button and show a label while `task` runs. */
async function withBusyButton(buttonId, busyLabel, task) {
  const btn = document.getElementById(buttonId);
  const original = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.textContent = busyLabel;
  }
  try {
    return await task();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = original;
      refreshIcons(btn);
    }
  }
}

const fieldValue = id => {
  const el = document.getElementById(id);
  return el ? el.value : '';
};

async function handleAuthLoginSubmit(e) {
  if (e) e.preventDefault();
  const email = fieldValue('loginEmailInput').trim().toLowerCase();
  const password = fieldValue('loginPasswordInput');
  if (!email || !password) {
    setAuthError('loginErrorMsg', 'Vui lòng nhập email và mật khẩu.');
    return;
  }
  setAuthError('loginErrorMsg', '');
  await withBusyButton('loginSubmitBtn', 'Đang đăng nhập...', async () => {
    try {
      const { user } = await apiRequest('/api/auth/login', { method: 'POST', body: { email, password } });
      applySignedInUser(user, { merge: true });
      syncProgressNow();
      closeAuthModal();
      showToast(`Chào mừng ${user.name} quay lại!`, 'success');
    } catch (err) {
      setAuthError('loginErrorMsg', err.message);
    }
  });
}

async function handleAuthRegisterSubmit(e) {
  if (e) e.preventDefault();
  const name = fieldValue('registerNameInput').trim();
  const email = fieldValue('registerEmailInput').trim().toLowerCase();
  const password = fieldValue('registerPasswordInput');
  const confirm = fieldValue('registerConfirmPasswordInput');

  if (!name || !email || !password) return setAuthError('registerErrorMsg', 'Vui lòng điền đầy đủ thông tin đăng ký.');
  if (password.length < 8) return setAuthError('registerErrorMsg', 'Mật khẩu cần tối thiểu 8 ký tự.');
  if (password !== confirm) return setAuthError('registerErrorMsg', 'Mật khẩu xác nhận không khớp.');
  setAuthError('registerErrorMsg', '');

  await withBusyButton('registerSubmitBtn', 'Đang tạo tài khoản...', async () => {
    try {
      const { user } = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: {
          name,
          email,
          password,
          language: fieldValue('registerLanguageSelect'),
          profession: fieldValue('registerProfessionSelect'),
          purpose: fieldValue('registerPurposeSelect'),
          // What the visitor earned before signing up carries over to the new account.
          progress: progressSnapshot()
        }
      });
      applySignedInUser(user);
      closeAuthModal();
      showToast(`Chào mừng ${user.name}! Bạn có ${user.vipInfo.daysRemaining} ngày dùng thử đầy đủ tính năng.`, 'success');
    } catch (err) {
      setAuthError('registerErrorMsg', err.message);
    }
  });
}

async function handleLogout() {
  closeUserDropdown();
  await syncProgressNow();
  try {
    await apiRequest('/api/auth/logout', { method: 'POST', body: {} });
  } catch (e) {
    // Cookie is cleared server-side; nothing else to do offline.
  }
  currentUser = null;
  renderAccountUi();
  showToast('Đã đăng xuất. Tiến độ trên máy này vẫn được giữ lại.', 'info');
}

// ---------------- Admin panel ----------------
function openAdminDashboardModal() {
  if (!isAdmin()) {
    showToast('Chỉ quản trị viên mới mở được bảng điều khiển.', 'warning');
    return;
  }
  const online = document.getElementById('adminKpiOnline');
  const live = document.getElementById('liveVisitorCount');
  if (online && live) online.textContent = live.textContent;
  openModal('adminDashboardModal');
  loadAdminUserVipTable();
}

function closeAdminDashboardModal() {
  closeModal('adminDashboardModal');
}
registerModal('adminDashboardModal', closeAdminDashboardModal);

async function adminSendTelegramNotification() {
  try {
    await apiRequest('/api/admin/test-notify', { method: 'POST', body: {} });
    showToast('Đã gửi tin nhắn kiểm tra qua Telegram.', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function adminClearCacheAndReload() {
  showToast('Đang tải lại ứng dụng...', 'info');
  setTimeout(() => window.location.reload(), 400);
}

async function loadAdminUserVipTable() {
  const container = document.getElementById('adminUserVipTableContainer');
  if (!container) return;
  container.innerHTML = '<div class="p-4 text-center text-xs text-stone-500">Đang tải danh sách học viên...</div>';

  let users;
  try {
    ({ users } = await apiRequest('/api/admin/users'));
  } catch (err) {
    container.innerHTML = `<div class="p-4 text-center text-xs text-rose-500">${escapeHtml(err.message)}</div>`;
    return;
  }
  if (!users.length) {
    container.innerHTML = '<div class="p-4 text-center text-xs text-stone-500">Chưa có học viên nào.</div>';
    return;
  }

  const actionBtn = (email, tier, label, cls, title) =>
    `<button onclick="adminSetUserVip(${jsArg(email)}, ${jsArg(tier)})" class="px-2 py-0.5 rounded-md text-[10px] font-bold ${cls}" title="${title}">${label}</button>`;

  container.innerHTML = `
    <table class="w-full text-left text-xs border-collapse">
      <thead class="bg-amber-100/60 dark:bg-stone-800 text-[10px] uppercase font-bold text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700">
        <tr><th class="p-2.5">Học viên</th><th class="p-2.5">EXP</th><th class="p-2.5">Trạng thái</th><th class="p-2.5 text-right">Kích hoạt</th></tr>
      </thead>
      <tbody class="divide-y divide-stone-200 dark:divide-stone-800">
        ${users.map(u => `
          <tr class="hover:bg-amber-50/50 dark:hover:bg-stone-800/50">
            <td class="p-2.5">
              <div class="font-bold text-stone-900 dark:text-stone-100">${escapeHtml(u.name)} ${u.role === 'admin' ? '<span title="Quản trị viên">👑</span>' : ''}</div>
              <div class="text-[10px] text-stone-500 font-mono">${escapeHtml(u.email)}</div>
              ${u.vipRequest ? `<div class="text-[10px] text-amber-700 font-bold">⏳ Chờ duyệt gói ${escapeHtml(u.vipRequest.tier)} · ${escapeHtml(new Date(u.vipRequest.at).toLocaleString('vi-VN'))}</div>` : ''}
              ${u.needsPasswordReset ? '<div class="text-[10px] text-rose-600 font-bold">Cần đặt lại mật khẩu</div>' : ''}
            </td>
            <td class="p-2.5 font-mono">${(u.exp || 0).toLocaleString('vi-VN')}</td>
            <td class="p-2.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">${escapeHtml(u.vipInfo.label)}</span></td>
            <td class="p-2.5 text-right">
              ${u.role === 'admin' ? '' : `<div class="inline-flex flex-wrap justify-end gap-1">
                ${actionBtn(u.email, 'monthly', '+1 tháng', 'bg-stone-100 hover:bg-amber-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200', 'Kích hoạt 30 ngày VIP')}
                ${actionBtn(u.email, 'yearly', '+1 năm', 'bg-amber-500 hover:bg-amber-600 text-white', 'Kích hoạt 365 ngày VIP')}
                ${actionBtn(u.email, 'lifetime', 'Trọn đời', 'bg-[#8B1E1E] hover:bg-red-800 text-white', 'Kích hoạt VIP trọn đời')}
                ${actionBtn(u.email, 'trial', 'Dùng thử lại', 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800', 'Cấp lại 7 ngày dùng thử')}
                ${actionBtn(u.email, 'expire', 'Khóa', 'bg-rose-100 hover:bg-rose-200 text-rose-800', 'Kết thúc VIP / dùng thử')}
              </div>`}
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

async function adminSetUserVip(targetEmail, tier) {
  try {
    const result = await apiRequest('/api/admin/set-vip', { method: 'POST', body: { targetEmail, tier } });
    showToast(result.message, 'success');
    if (currentUser && currentUser.email === result.user.email) currentUser.vipInfo = result.user.vipInfo;
    renderAccountUi();
    loadAdminUserVipTable();
  } catch (err) {
    showToast(err.message, 'error');
  }
}


// ---------------- CLOUD DATA SYNC STATUS & ACTIONS ----------------
function updateCloudSyncStatus(status) {
  const icon = document.getElementById('cloudSyncStatusIcon');
  const text = document.getElementById('cloudSyncStatusText');
  if (icon) {
    if (status === 'syncing') {
      icon.innerHTML = '⏳';
      icon.className = 'animate-spin inline-block text-xs';
    } else if (status === 'synced') {
      icon.innerHTML = '☁️✓';
      icon.className = 'text-xs text-emerald-600 font-bold';
    } else if (status === 'error') {
      icon.innerHTML = '⚠️';
      icon.className = 'text-xs text-amber-500 font-bold';
    }
  }
  if (text) {
    if (status === 'syncing') text.innerText = 'Đang đồng bộ...';
    else if (status === 'synced') text.innerText = 'Đã lưu đám mây';
    else if (status === 'error') text.innerText = 'Chưa đồng bộ';
  }
}

async function triggerManualCloudSync() {
  if (!currentUser) {
    if (typeof showToast === 'function') {
      showToast('Vui lòng đăng nhập để đồng bộ tiến độ học lên đám mây!', 'info');
    }
    if (typeof openAuthModal === 'function') openAuthModal('login');
    return;
  }
  updateCloudSyncStatus('syncing');
  try {
    await apiRequest('/api/me/merge-sync', { method: 'POST', body: progressSnapshot() });
    updateCloudSyncStatus('synced');
    if (typeof showToast === 'function') {
      showToast('✓ Đã đồng bộ tiến độ học tập và sổ tay lên đám mây an toàn!', 'success');
    }
  } catch (err) {
    updateCloudSyncStatus('error');
    if (typeof showToast === 'function') {
      showToast('Lỗi đồng bộ đám mây: ' + err.message, 'error');
    }
  }
}

window.updateCloudSyncStatus = updateCloudSyncStatus;
window.triggerManualCloudSync = triggerManualCloudSync;
