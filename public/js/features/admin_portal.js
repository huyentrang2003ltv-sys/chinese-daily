// =========================================================================
// Hi HSK - Hệ Thống Quản Trị Hệ Thống & Bảng Điều Khiển (Admin Portal)
// Route: #/admin (hoặc #/admin-portal, #/quantri)
// Quyền hạn: Chỉ tài khoản Admin (hoangpham1618@gmail.com) mới có thể truy cập
// =========================================================================

(function(window) {
  'use strict';

  // State Management
  let adminUsersList = [];
  let adminVisitorStats = { online: 0, today: 0, total: 0 };
  let adminBroadcast = { enabled: false, message: '', type: 'info', updatedAt: null };
  let adminActiveSubTab = 'users'; // 'users' | 'broadcast' | 'tools'
  let adminSearchQuery = '';
  let adminFilterStatus = 'all'; // 'all' | 'pending_vip' | 'vip' | 'trial' | 'locked' | 'needs_password_reset'
  let adminIsLoading = false;
  let adminLastFetchTime = null;

  function safeEscape(str) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeNotify(msg, type = 'info') {
    if (typeof window.showToast === 'function') {
      window.showToast(msg, type);
    } else if (typeof window.alert === 'function') {
      window.alert(msg);
    } else {
      console.log(`[Admin Portal ${type.toUpperCase()}] ${msg}`);
    }
  }

  function isAdminUser() {
    if (typeof window.isAdmin === 'function') return window.isAdmin();
    return Boolean(window.currentUser && window.currentUser.role === 'admin');
  }

  async function safeApiRequest(url, opts = {}) {
    if (typeof window.apiRequest === 'function') {
      return window.apiRequest(url, opts);
    }
    const res = await fetch(url, {
      method: opts.method || 'GET',
      headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      credentials: 'same-origin'
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      const err = new Error(data.error || `HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function getContainer() {
    return document.getElementById('adminPortalContainer') || document.getElementById('tab-admin');
  }

  // ---------------------------------------------------------------------------
  // DATA FETCHING LAYER
  // ---------------------------------------------------------------------------
  async function loadAdminPortalData(force = false) {
    if (!isAdminUser()) return;
    if (adminIsLoading) return;
    adminIsLoading = true;

    const container = getContainer();
    if (container && (!adminUsersList || adminUsersList.length === 0 || force)) {
      renderLoadingSkeleton();
    }

    try {
      const [usersRes, visitorsRes, broadcastRes] = await Promise.allSettled([
        safeApiRequest('/api/admin/users'),
        safeApiRequest('/api/visitors'),
        safeApiRequest('/api/system/broadcast')
      ]);

      if (usersRes.status === 'fulfilled' && usersRes.value && usersRes.value.users) {
        adminUsersList = usersRes.value.users;
      }
      if (visitorsRes.status === 'fulfilled' && visitorsRes.value) {
        adminVisitorStats = visitorsRes.value;
      }
      if (broadcastRes.status === 'fulfilled' && broadcastRes.value && broadcastRes.value.broadcast) {
        adminBroadcast = broadcastRes.value.broadcast;
      }

      adminLastFetchTime = new Date();
    } catch (err) {
      console.error('[Admin Portal] Lỗi nạp dữ liệu:', err);
      safeNotify('Không thể tải đủ dữ liệu quản trị: ' + (err.message || 'Lỗi kết nối'), 'error');
    } finally {
      adminIsLoading = false;
      renderAdminPortal();
    }
  }

  function renderLoadingSkeleton() {
    const container = getContainer();
    if (!container) return;
    container.innerHTML = `
      <div class="space-y-6 animate-pulse">
        <div class="p-6 rounded-3xl bg-amber-500/10 border border-amber-300/60 dark:border-amber-700/60 h-32 flex items-center justify-center">
          <div class="flex items-center gap-3 text-amber-900 dark:text-amber-200 font-bold">
            <span class="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
            <span>Đang xác thực bảo mật và tải dữ liệu quản trị hệ thống...</span>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="h-24 rounded-2xl bg-stone-200 dark:bg-stone-800"></div>
          <div class="h-24 rounded-2xl bg-stone-200 dark:bg-stone-800"></div>
          <div class="h-24 rounded-2xl bg-stone-200 dark:bg-stone-800"></div>
          <div class="h-24 rounded-2xl bg-stone-200 dark:bg-stone-800"></div>
        </div>
        <div class="h-96 rounded-3xl bg-stone-200 dark:bg-stone-800"></div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // MAIN RENDER GATEKEEPER
  // ---------------------------------------------------------------------------
  function renderAdminPortal() {
    const container = getContainer();
    if (!container) return;

    // Check RBAC Authorization
    if (!isAdminUser()) {
      renderAccessDenied(container);
      return;
    }

    // If data not loaded yet, fetch it
    if (!adminLastFetchTime && !adminIsLoading) {
      loadAdminPortalData();
      return;
    }

    renderAuthorizedDashboard(container);
    if (typeof window.lucide !== 'undefined' && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  }

  // ---------------------------------------------------------------------------
  // VIEW: ACCESS DENIED (CHẶN HỌC VIÊN HOẶC CHƯA ĐĂNG NHẬP)
  // ---------------------------------------------------------------------------
  function renderAccessDenied(container) {
    const isGuest = !window.currentUser;
    container.innerHTML = `
      <div class="max-w-2xl mx-auto py-12 px-4 animate-fade-in text-center space-y-6">
        <div class="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-600 text-white flex items-center justify-center shadow-xl border-4 border-amber-200/80 dark:border-stone-800">
          <i data-lucide="shield-alert" class="w-12 h-12"></i>
        </div>

        <div class="space-y-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300">
            🔒 YÊU CẦU QUYỀN HẠN QUẢN TRỊ VIÊN (ADMIN ONLY)
          </span>
          <h2 class="text-2xl lg:text-3xl font-serif-luxury font-black text-stone-900 dark:text-stone-100">
            Khu Vực Quản Trị Hệ Thống Hi HSK
          </h2>
          <p class="text-sm text-stone-600 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
            Đường dẫn <code class="font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-rose-600 font-bold">#/admin</code> chỉ dành riêng cho Ban Quản trị (<strong class="text-amber-800 dark:text-amber-400 font-mono">hoangpham1618@gmail.com</strong>) để quản lý danh sách học viên, kích hoạt VIP và vận hành máy chủ.
          </p>
        </div>

        ${!isGuest ? `
          <div class="p-4 rounded-2xl bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 max-w-md mx-auto">
            <p>Bạn hiện đang đăng nhập với tài khoản: <strong>${safeEscape(window.currentUser.name)}</strong> (<span class="font-mono text-stone-500">${safeEscape(window.currentUser.email)}</span>).</p>
            <p class="mt-1 text-rose-600 font-medium">Tài khoản này có vai trò là Học viên, không có quyền truy cập trang quản trị.</p>
          </div>
        ` : ''}

        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          ${isGuest ? `
            <button onclick="if(window.openAuthModal) window.openAuthModal('login');" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer">
              <i data-lucide="log-in" class="w-4 h-4"></i>
              <span>Đăng nhập tài khoản Quản trị</span>
            </button>
          ` : `
            <button onclick="if(window.handleLogout){ window.handleLogout().then(() => { if(window.openAuthModal) window.openAuthModal('login'); }); }" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:opacity-95 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
              <span>Chuyển sang tài khoản Quản trị</span>
            </button>
          `}
          <button onclick="if(window.switchTab) window.switchTab('home');" class="px-6 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm border border-stone-300 dark:border-stone-700 transition-all flex items-center gap-2 cursor-pointer">
            <i data-lucide="home" class="w-4 h-4"></i>
            <span>Trở về Trang chủ</span>
          </button>
        </div>
      </div>
    `;
    if (typeof window.lucide !== 'undefined' && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  }

  // ---------------------------------------------------------------------------
  // VIEW: AUTHORIZED ADMIN DASHBOARD
  // ---------------------------------------------------------------------------
  function renderAuthorizedDashboard(container) {
    const users = adminUsersList || [];
    const totalUsers = users.length;
    const onlineVisitors = adminVisitorStats.online || 0;
    const todayVisitors = adminVisitorStats.today || 0;

    // Computed Stats
    const vipUsers = users.filter(u => u.vipInfo && u.vipInfo.isVip && !u.vipInfo.isTrial);
    const pendingVipRequests = users.filter(u => Boolean(u.vipRequest));
    const lockedUsers = users.filter(u => Boolean(u.isLocked));
    const trialUsers = users.filter(u => u.vipInfo && u.vipInfo.isTrial);
    const totalExp = users.reduce((acc, u) => acc + (Number(u.exp) || 0), 0);

    const currentUserObj = window.currentUser || { name: 'Super Admin', email: 'hoangpham1618@gmail.com' };

    container.innerHTML = `
      <div class="space-y-6 animate-fade-in pb-12">
        
        <!-- ==================== 1. PORTAL HERO HEADER ==================== -->
        <div class="p-6 lg:p-7 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-amber-50/70 to-rose-50/50 dark:from-[#161B22] dark:via-[#1a202c] dark:to-stone-900 border-2 border-amber-400/90 dark:border-amber-500/50 shadow-xl relative overflow-hidden">
          <div class="absolute -right-12 -top-12 w-48 h-48 bg-radial from-amber-400/20 to-transparent rounded-full pointer-events-none"></div>

          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
            <!-- Left Info -->
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 text-white flex items-center justify-center font-bold text-3xl shadow-lg border-2 border-amber-300 shrink-0">
                👑
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="text-xl lg:text-2xl font-serif-luxury font-black text-amber-950 dark:text-amber-300">
                    Bảng Điều Khiển Quản Trị Hệ Thống (Hi HSK Admin Portal)
                  </h1>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-2xs">
                    ROOT ACCESS
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                    ● PRODUCTION LIVE
                  </span>
                </div>
                <p class="text-xs text-stone-600 dark:text-stone-400 mt-1 flex items-center gap-2 flex-wrap">
                  <span>Quản trị viên: <strong class="text-stone-900 dark:text-stone-100">${safeEscape(currentUserObj.name)}</strong> (<span class="font-mono text-amber-800 dark:text-amber-300">${safeEscape(currentUserObj.email)}</span>)</span>
                  <span class="text-stone-300 dark:text-stone-700">|</span>
                  <span>Cập nhật lúc: <strong class="font-mono">${adminLastFetchTime ? adminLastFetchTime.toLocaleTimeString('vi-VN') : '–'}</strong></span>
                </p>
              </div>
            </div>

            <!-- Right Action Toolbar -->
            <div class="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto justify-end">
              <button 
                onclick="window.loadAdminPortalData(true)" 
                class="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200/90 dark:bg-stone-800 dark:hover:bg-stone-700 text-amber-950 dark:text-amber-200 text-xs font-bold border border-amber-300/80 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Làm mới lại toàn bộ số liệu thời gian thực"
              >
                <i data-lucide="refresh-cw" class="w-3.5 h-3.5 ${adminIsLoading ? 'animate-spin' : ''}"></i>
                <span>Làm Mới</span>
              </button>

              <button 
                onclick="window.adminSendTelegramPing()" 
                class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Gửi tin nhắn test tới Telegram Admin Bot"
              >
                <i data-lucide="send" class="w-3.5 h-3.5"></i>
                <span>Ping Telegram</span>
              </button>

              <button 
                onclick="window.adminExportUsersJson()" 
                class="px-3.5 py-2 rounded-xl bg-stone-700 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Sao lưu danh sách học viên ra file JSON"
              >
                <i data-lucide="download" class="w-3.5 h-3.5"></i>
                <span>Xuất JSON</span>
              </button>

              <button 
                onclick="if(window.switchTab) window.switchTab('home');" 
                class="px-3.5 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#A52A2A] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Về Trang chủ học tập"
              >
                <i data-lucide="home" class="w-3.5 h-3.5"></i>
                <span>Trang Chủ</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ==================== 2. EXECUTIVE KPI CARDS GRID ==================== -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <!-- Card 1: Tổng học viên -->
          <div class="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
            <div class="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
              <span>Tổng Học Viên</span>
              <i data-lucide="users" class="w-4 h-4 text-amber-600"></i>
            </div>
            <div class="text-2xl lg:text-3xl font-black text-stone-900 dark:text-stone-100 font-mono">
              ${totalUsers.toLocaleString('vi-VN')}
            </div>
            <p class="text-[10px] text-stone-500">Tài khoản trong cơ sở dữ liệu</p>
          </div>

          <!-- Card 2: Đang online -->
          <div class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 shadow-sm space-y-1">
            <div class="flex items-center justify-between text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>Đang Trực Tuyến</span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div class="text-2xl lg:text-3xl font-black text-emerald-900 dark:text-emerald-200 font-mono">
              ${onlineVisitors.toLocaleString('vi-VN')}
            </div>
            <p class="text-[10px] text-emerald-700 dark:text-emerald-400">Hôm nay: ${todayVisitors.toLocaleString('vi-VN')} lượt truy cập</p>
          </div>

          <!-- Card 3: VIP Members -->
          <div class="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 shadow-sm space-y-1">
            <div class="flex items-center justify-between text-amber-800 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span>Học Viên VIP</span>
              <span class="text-sm">👑</span>
            </div>
            <div class="text-2xl lg:text-3xl font-black text-amber-950 dark:text-amber-200 font-mono">
              ${vipUsers.length.toLocaleString('vi-VN')}
            </div>
            <p class="text-[10px] text-amber-700 dark:text-amber-400">
              ${pendingVipRequests.length > 0 ? `<strong class="text-rose-600 font-bold animate-pulse">⏳ ${pendingVipRequests.length} yêu cầu chờ duyệt!</strong>` : 'Đang hoạt động'}
            </p>
          </div>

          <!-- Card 4: Locked Users -->
          <div class="p-4 rounded-2xl ${lockedUsers.length > 0 ? 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-400 dark:border-rose-800' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'} border shadow-sm space-y-1">
            <div class="flex items-center justify-between text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              <span>Bị Khóa 3 Ngày</span>
              <i data-lucide="lock" class="w-4 h-4 text-rose-600"></i>
            </div>
            <div class="text-2xl lg:text-3xl font-black text-rose-900 dark:text-rose-200 font-mono">
              ${lockedUsers.length.toLocaleString('vi-VN')}
            </div>
            <p class="text-[10px] text-rose-600 dark:text-rose-400">
              ${lockedUsers.length > 0 ? 'Cần hỗ trợ / mở khóa ngay' : 'Không có tài khoản bị khóa'}
            </p>
          </div>

          <!-- Card 5: Total EXP Points -->
          <div class="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 shadow-sm space-y-1 col-span-2 md:col-span-1">
            <div class="flex items-center justify-between text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <span>Tổng EXP Hệ Thống</span>
              <i data-lucide="sparkles" class="w-4 h-4 text-indigo-600"></i>
            </div>
            <div class="text-2xl lg:text-3xl font-black text-indigo-900 dark:text-indigo-200 font-mono">
              ${totalExp.toLocaleString('vi-VN')}
            </div>
            <p class="text-[10px] text-indigo-600 dark:text-indigo-400">Điểm kinh nghiệm tích lũy</p>
          </div>
        </div>

        <!-- ==================== 3. SUB-TAB SWITCHER NAVIGATION ==================== -->
        <div class="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto">
          <button 
            onclick="window.setAdminSubTab('users')" 
            class="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${adminActiveSubTab === 'users' ? 'bg-[#8B1E1E] text-white shadow-sm' : 'bg-white dark:bg-stone-800 hover:bg-amber-100 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'}"
          >
            <i data-lucide="users" class="w-4 h-4"></i>
            <span>Quản Lý Học Viên & VIP</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono ${adminActiveSubTab === 'users' ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'}">${totalUsers}</span>
            ${pendingVipRequests.length > 0 ? `<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>` : ''}
          </button>

          <button 
            onclick="window.setAdminSubTab('broadcast')" 
            class="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${adminActiveSubTab === 'broadcast' ? 'bg-[#8B1E1E] text-white shadow-sm' : 'bg-white dark:bg-stone-800 hover:bg-amber-100 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'}"
          >
            <i data-lucide="megaphone" class="w-4 h-4"></i>
            <span>Thông Báo Toàn Trang (Broadcast)</span>
            ${adminBroadcast && adminBroadcast.enabled ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500 text-white">ON</span>` : ''}
          </button>

          <button 
            onclick="window.setAdminSubTab('tools')" 
            class="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${adminActiveSubTab === 'tools' ? 'bg-[#8B1E1E] text-white shadow-sm' : 'bg-white dark:bg-stone-800 hover:bg-amber-100 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'}"
          >
            <i data-lucide="wrench" class="w-4 h-4"></i>
            <span>Công Cụ Hệ Thống & Chẩn Đoán</span>
          </button>
        </div>

        <!-- ==================== 4. ACTIVE SUB-TAB VIEW ==================== -->
        ${adminActiveSubTab === 'users' ? renderUsersTab(users, pendingVipRequests, lockedUsers, trialUsers, vipUsers) : ''}
        ${adminActiveSubTab === 'broadcast' ? renderBroadcastTab() : ''}
        ${adminActiveSubTab === 'tools' ? renderToolsTab() : ''}

      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // TAB 1: USERS & VIP TABLE
  // ---------------------------------------------------------------------------
  function renderUsersTab(users, pendingVipRequests, lockedUsers, trialUsers, vipUsers) {
    // Filter users
    let filtered = [...users];

    // Filter by quick chip
    if (adminFilterStatus === 'pending_vip') {
      filtered = filtered.filter(u => Boolean(u.vipRequest));
    } else if (adminFilterStatus === 'vip') {
      filtered = filtered.filter(u => u.vipInfo && u.vipInfo.isVip && !u.vipInfo.isTrial);
    } else if (adminFilterStatus === 'trial') {
      filtered = filtered.filter(u => u.vipInfo && u.vipInfo.isTrial);
    } else if (adminFilterStatus === 'locked') {
      filtered = filtered.filter(u => Boolean(u.isLocked));
    } else if (adminFilterStatus === 'needs_password_reset') {
      filtered = filtered.filter(u => Boolean(u.needsPasswordReset));
    }

    // Filter by search query
    if (adminSearchQuery.trim()) {
      const q = adminSearchQuery.trim().toLowerCase();
      filtered = filtered.filter(u => {
        const name = String(u.name || '').toLowerCase();
        const email = String(u.email || '').toLowerCase();
        const uname = String(u.username || '').toLowerCase();
        return name.includes(q) || email.includes(q) || uname.includes(q);
      });
    }

    const chipClass = (key, count, alertColor) => {
      const active = adminFilterStatus === key;
      const base = 'px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer';
      if (active) return `${base} bg-amber-500 text-amber-950 font-black shadow-2xs`;
      if (count > 0 && alertColor) return `${base} bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400`;
      return `${base} bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50`;
    };

    return `
      <div class="space-y-4">
        
        <!-- Filter & Search Toolbar -->
        <div class="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
          <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <!-- Search Bar -->
            <div class="relative flex-1 max-w-md">
              <i data-lucide="search" class="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
              <input 
                type="text" 
                value="${safeEscape(adminSearchQuery)}"
                oninput="window.handleAdminSearch(event)" 
                placeholder="Tìm học viên theo Tên, Email hoặc Username..." 
                class="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:border-amber-500 text-stone-900 dark:text-stone-100 transition-colors"
              />
              ${adminSearchQuery ? `
                <button onclick="window.clearAdminSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs">✕</button>
              ` : ''}
            </div>

            <!-- Result Count & Quick Reset -->
            <div class="flex items-center gap-2 text-xs text-stone-500">
              <span>Hiển thị <strong>${filtered.length}</strong> / ${users.length} học viên</span>
            </div>
          </div>

          <!-- Filter Chips -->
          <div class="flex items-center gap-2 flex-wrap pt-1 border-t border-stone-100 dark:border-stone-800">
            <button onclick="window.setAdminFilter('all')" class="${chipClass('all', users.length)}">
              <span>Tất cả</span>
              <span class="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 dark:bg-stone-700">${users.length}</span>
            </button>

            <button onclick="window.setAdminFilter('pending_vip')" class="${chipClass('pending_vip', pendingVipRequests.length, true)}">
              <span>⏳ Chờ duyệt nạp VIP</span>
              <span class="font-mono text-[10px] px-1.5 py-0.2 rounded-full ${pendingVipRequests.length > 0 ? 'bg-red-500 text-white font-bold animate-pulse' : 'bg-stone-100 dark:bg-stone-700'}">${pendingVipRequests.length}</span>
            </button>

            <button onclick="window.setAdminFilter('vip')" class="${chipClass('vip', vipUsers.length)}">
              <span>👑 Học viên VIP</span>
              <span class="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 dark:bg-stone-700">${vipUsers.length}</span>
            </button>

            <button onclick="window.setAdminFilter('trial')" class="${chipClass('trial', trialUsers.length)}">
              <span>🎁 Dùng thử</span>
              <span class="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 dark:bg-stone-700">${trialUsers.length}</span>
            </button>

            <button onclick="window.setAdminFilter('locked')" class="${chipClass('locked', lockedUsers.length, true)}">
              <span>🔒 Bị khóa 3 ngày</span>
              <span class="font-mono text-[10px] px-1.5 py-0.2 rounded-full ${lockedUsers.length > 0 ? 'bg-red-600 text-white font-bold' : 'bg-stone-100 dark:bg-stone-700'}">${lockedUsers.length}</span>
            </button>

            <button onclick="window.setAdminFilter('needs_password_reset')" class="${chipClass('needs_password_reset', 0)}">
              <span>⚠️ Cần đặt lại MK</span>
            </button>
          </div>
        </div>

        <!-- Student Data Table Container -->
        <div class="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-amber-100/70 dark:bg-stone-800 text-[11px] uppercase font-bold text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 select-none">
                <tr>
                  <th class="p-3.5 pl-4">Học Viên</th>
                  <th class="p-3.5">Tiến Độ (EXP & Streak)</th>
                  <th class="p-3.5">Gói VIP & Hạn Dùng</th>
                  <th class="p-3.5">Trạng Thái</th>
                  <th class="p-3.5 pr-4 text-right">Thao Tác Nhanh</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-200 dark:divide-stone-800">
                ${filtered.length === 0 ? `
                  <tr>
                    <td colspan="5" class="p-8 text-center text-stone-500 text-xs">
                      Không tìm thấy học viên nào phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>
                ` : filtered.map(u => renderUserTableRow(u)).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  function renderUserTableRow(u) {
    const isLocked = Boolean(u.isLocked);
    const hasVipRequest = Boolean(u.vipRequest);
    const isAdmin = u.role === 'admin';
    const initial = (String(u.name || '').trim().charAt(0) || '?').toUpperCase();
    const createdStr = u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '–';
    const lastActiveStr = u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleString('vi-VN') : createdStr;

    return `
      <tr class="hover:bg-amber-50/40 dark:hover:bg-stone-850/60 transition-colors">
        <!-- Học Viên -->
        <td class="p-3.5 pl-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-2xl ${isAdmin ? 'bg-gradient-to-tr from-amber-500 to-amber-700 text-white' : 'bg-amber-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200'} flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
              ${isAdmin ? '👑' : initial}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-bold text-stone-900 dark:text-stone-100">${safeEscape(u.name)}</span>
                ${isAdmin ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500 text-amber-950">ADMIN</span>` : ''}
                ${u.username && u.username !== u.name ? `<span class="text-[10px] text-stone-500">(@${safeEscape(u.username)})</span>` : ''}
              </div>
              <div class="text-[11px] font-mono text-stone-500 dark:text-stone-400 mt-0.5">${safeEscape(u.email)}</div>
              <div class="text-[10px] text-stone-400 mt-0.5">Tạo ngày: ${createdStr} · Hoạt động: ${lastActiveStr}</div>
              ${u.needsPasswordReset ? `<div class="text-[10px] font-bold text-rose-600 mt-0.5">⚠️ Chưa đổi mật khẩu mặc định</div>` : ''}
            </div>
          </div>
        </td>

        <!-- Tiến Độ -->
        <td class="p-3.5">
          <div class="space-y-1">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-mono font-bold text-amber-900 dark:text-amber-300">${(Number(u.exp) || 0).toLocaleString('vi-VN')}</span>
              <span class="text-[10px] text-stone-400 font-bold">EXP</span>
            </div>
            <div class="text-[11px] text-stone-500 flex items-center gap-1">
              <span>🔥 Chuỗi:</span>
              <strong class="font-mono text-stone-700 dark:text-stone-300">${Number(u.streak) || 0} ngày</strong>
            </div>
          </div>
        </td>

        <!-- Gói VIP & Hạn Dùng -->
        <td class="p-3.5">
          <div class="space-y-1">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${getVipBadgeClass(u.vipInfo)} border shadow-2xs">
              ${safeEscape(u.vipInfo ? u.vipInfo.label : 'Chưa có thông tin')}
            </span>

            ${hasVipRequest ? `
              <div class="mt-1.5 p-2 rounded-xl bg-amber-100/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-[10px] text-amber-950 dark:text-amber-200">
                <div class="font-bold flex items-center gap-1">
                  <span>⏳ Chờ duyệt gói:</span>
                  <span class="uppercase tracking-wider px-1 py-0.2 rounded bg-amber-500 text-white font-black">${safeEscape(u.vipRequest.tier)}</span>
                </div>
                <div class="text-[9px] text-amber-800 dark:text-amber-300 mt-0.5">Yêu cầu lúc: ${new Date(u.vipRequest.at).toLocaleString('vi-VN')}</div>
                <button 
                  onclick="window.adminSetUserVip(${safeArg(u.email)}, ${safeArg(u.vipRequest.tier)})" 
                  class="mt-1 px-2 py-0.5 rounded-md bg-[#8B1E1E] hover:bg-rose-800 text-white font-bold text-[9px] shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>✓ Xác nhận duyệt gói ${safeEscape(u.vipRequest.tier)}</span>
                </button>
              </div>
            ` : ''}
          </div>
        </td>

        <!-- Trạng Thái -->
        <td class="p-3.5">
          ${isLocked ? `
            <div class="space-y-1">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 shadow-2xs">
                <span>🔒 Tạm khóa 3 ngày</span>
              </span>
              <p class="text-[9px] text-rose-600 dark:text-rose-400 max-w-xs leading-tight">
                ${safeEscape(u.lockReason || 'Quá 3 ngày không học 10p')}
              </p>
            </div>
          ` : `
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
              <span>● Bình thường</span>
            </span>
          `}
        </td>

        <!-- Thao Tác Nhanh -->
        <td class="p-3.5 pr-4 text-right">
          ${isAdmin ? `
            <span class="text-[10px] text-stone-400 italic">Tài khoản Quản trị</span>
          ` : `
            <div class="inline-flex flex-wrap items-center justify-end gap-1.5">
              ${isLocked ? `
                <button 
                  onclick="window.adminUnlockUser(${safeArg(u.email)})" 
                  class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                  title="Mở khóa tài khoản học viên"
                >
                  <i data-lucide="unlock" class="w-3 h-3"></i>
                  <span>Mở Khóa</span>
                </button>
              ` : ''}

              <!-- VIP Dropdown Actions -->
              <div class="inline-flex items-center rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden text-[10px] font-bold bg-stone-50 dark:bg-stone-800">
                <button 
                  onclick="window.adminSetUserVip(${safeArg(u.email)}, 'monthly')" 
                  class="px-2 py-1 hover:bg-amber-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer border-r border-stone-200 dark:border-stone-700" 
                  title="Kích hoạt 30 ngày VIP"
                >+1 Tháng</button>
                <button 
                  onclick="window.adminSetUserVip(${safeArg(u.email)}, 'yearly')" 
                  class="px-2 py-1 hover:bg-amber-500 hover:text-white text-stone-800 dark:text-stone-200 transition-colors cursor-pointer border-r border-stone-200 dark:border-stone-700" 
                  title="Kích hoạt 1 năm VIP"
                >+1 Năm</button>
                <button 
                  onclick="window.adminSetUserVip(${safeArg(u.email)}, 'lifetime')" 
                  class="px-2 py-1 bg-[#8B1E1E]/90 hover:bg-[#8B1E1E] text-white transition-colors cursor-pointer" 
                  title="Cấp VIP Trọn Đời"
                >👑 Trọn Đời</button>
              </div>

              <!-- More Options (Reset Pass, Trial, Revoke) -->
              <div class="inline-flex items-center gap-1">
                <button 
                  onclick="window.adminPromptResetPassword(${safeArg(u.email)}, ${safeArg(u.name)})" 
                  class="p-1 rounded-md text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer" 
                  title="Đặt lại mật khẩu cho học viên"
                >
                  <i data-lucide="key" class="w-3.5 h-3.5"></i>
                </button>

                <button 
                  onclick="window.adminSetUserVip(${safeArg(u.email)}, 'trial')" 
                  class="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors cursor-pointer" 
                  title="Cấp lại 7 ngày dùng thử"
                >
                  <i data-lucide="gift" class="w-3.5 h-3.5"></i>
                </button>

                <button 
                  onclick="if(confirm('Khóa / Kết thúc VIP của ' + ${safeArg(u.name)} + '?')) window.adminSetUserVip(${safeArg(u.email)}, 'expire')" 
                  class="p-1 rounded-md text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer" 
                  title="Kết thúc VIP / Chuyển sang hết hạn"
                >
                  <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          `}
        </td>
      </tr>
    `;
  }

  function getVipBadgeClass(vipInfo) {
    if (!vipInfo) return 'bg-stone-100 text-stone-700 border-stone-200';
    if (vipInfo.tier === 'lifetime') return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-300';
    if (vipInfo.tier === 'yearly') return 'bg-amber-100 text-amber-900 border-amber-400';
    if (vipInfo.tier === 'monthly') return 'bg-blue-100 text-blue-900 border-blue-300';
    if (vipInfo.isTrial) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    return 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700';
  }

  // ---------------------------------------------------------------------------
  // TAB 2: BROADCAST SYSTEM BANNER
  // ---------------------------------------------------------------------------
  function renderBroadcastTab() {
    const b = adminBroadcast || { enabled: false, message: '', type: 'info' };

    return `
      <div class="max-w-3xl space-y-5 animate-fade-in">
        <div class="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h3 class="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <i data-lucide="megaphone" class="w-4 h-4 text-amber-600"></i>
                <span>Cấu Hình Băng Rôn Thông Báo Toàn Hệ Thống (Broadcast Banner)</span>
              </h3>
              <p class="text-xs text-stone-500 mt-0.5">
                Thông điệp này sẽ hiển thị nổi bật trên đỉnh trang cho toàn bộ học viên và khách truy cập.
              </p>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${b.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}">
              ${b.enabled ? 'Đang Phát Sóng' : 'Đang Tắt'}
            </span>
          </div>

          <!-- Form Fields -->
          <div class="space-y-3.5 text-xs">
            <div class="flex items-center gap-3">
              <label class="font-bold text-stone-700 dark:text-stone-300">Trạng thái phát sóng:</label>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="adminBroadcastEnabledInput" 
                  class="sr-only peer" 
                  ${b.enabled ? 'checked' : ''} 
                  onchange="window.updateBroadcastPreview()"
                />
                <div class="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span class="ml-3 font-medium text-stone-700 dark:text-stone-300">Bật hiển thị thông báo</span>
              </label>
            </div>

            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Loại thông báo & Màu sắc:</label>
              <select 
                id="adminBroadcastTypeSelect" 
                class="w-full sm:w-64 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:border-amber-500 font-bold"
                onchange="window.updateBroadcastPreview()"
              >
                <option value="info" ${b.type === 'info' ? 'selected' : ''}>ℹ️ Thông Tin Chung (Xanh Biển)</option>
                <option value="promo" ${b.type === 'promo' ? 'selected' : ''}>🎁 Khuyến Mãi / Ưu Đãi (Đỏ Hoàng Gia)</option>
                <option value="warning" ${b.type === 'warning' ? 'selected' : ''}>⚠️ Cảnh Báo / Bảo Trì (Vàng Cam)</option>
                <option value="success" ${b.type === 'success' ? 'selected' : ''}>✅ Tin Vui / Chúc Mừng (Xanh Lá)</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Nội dung thông báo:</label>
              <textarea 
                id="adminBroadcastMessageInput" 
                rows="3" 
                class="w-full p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:border-amber-500 text-stone-900 dark:text-stone-100"
                placeholder="Nhập nội dung thông báo hiển thị cho toàn bộ học viên..."
                oninput="window.updateBroadcastPreview()"
              >${safeEscape(b.message)}</textarea>
            </div>

            <!-- Live Preview -->
            <div>
              <label class="block font-bold text-stone-500 mb-1 text-[11px] uppercase tracking-wider">Xem trước hiển thị thực tế (Live Preview):</label>
              <div id="adminBroadcastLivePreview">
                ${renderBroadcastBannerHtml(b)}
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button 
                onclick="window.adminSaveBroadcast()" 
                class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <i data-lucide="save" class="w-4 h-4"></i>
                <span>Lưu & Phát Sóng Thông Báo Ngay</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderBroadcastBannerHtml(b) {
    if (!b || !b.message) {
      return `<div class="p-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center text-stone-400 text-xs italic">Chưa có thông báo nào được soạn thảo.</div>`;
    }
    const colorMap = {
      promo: 'from-[#8B1E1E] via-rose-700 to-amber-700 text-white border-amber-300/60',
      info: 'from-blue-600 via-indigo-600 to-sky-700 text-white border-blue-300/60',
      warning: 'from-amber-600 via-orange-600 to-yellow-600 text-white border-amber-200/80',
      success: 'from-emerald-600 via-teal-600 to-green-700 text-white border-emerald-300/60'
    };
    const cls = colorMap[b.type] || colorMap.info;

    return `
      <div class="w-full p-3 rounded-2xl bg-gradient-to-r ${cls} border shadow-md flex items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="text-base shrink-0">${b.type === 'promo' ? '🎁' : b.type === 'warning' ? '⚠️' : b.type === 'success' ? '🎉' : '📢'}</span>
          <p class="font-medium truncate">${safeEscape(b.message)}</p>
        </div>
        <span class="text-[10px] font-bold opacity-80 shrink-0">Hi HSK Thông Báo</span>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // TAB 3: TOOLS & SYSTEM DIAGNOSTICS
  // ---------------------------------------------------------------------------
  function renderToolsTab() {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in text-xs">
        
        <!-- Tool 1: Telegram Ping Test -->
        <div class="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
                <i data-lucide="send" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-bold text-stone-900 dark:text-stone-100 text-sm">Kiểm Tra Bot Telegram</h4>
                <p class="text-[11px] text-stone-500">Gửi tin nhắn test tới Admin Chat</p>
              </div>
            </div>
            <p class="text-stone-600 dark:text-stone-400 leading-relaxed text-[11px]">
              Gửi một gói tin kiểm tra đến Bot Telegram được cấu hình trong máy chủ (<code class="font-mono text-blue-600">TELEGRAM_BOT_TOKEN</code> & <code class="font-mono text-blue-600">TELEGRAM_CHAT_ID</code>) để xác nhận hệ thống thông báo hoạt động tốt.
            </p>
            <div id="adminTelegramStatusLog" class="hidden p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 text-[10px] font-mono"></div>
          </div>

          <button 
            onclick="window.adminSendTelegramPing()" 
            class="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
            <span>Gửi Tin Nhắn Ping Telegram Ngay</span>
          </button>
        </div>

        <!-- Tool 2: Backup Data Export -->
        <div class="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold shadow-2xs">
                <i data-lucide="download-cloud" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-bold text-stone-900 dark:text-stone-100 text-sm">Sao Lưu Dữ Liệu Học Viên</h4>
                <p class="text-[11px] text-stone-500">Tải về danh sách học viên định dạng JSON</p>
              </div>
            </div>
            <p class="text-stone-600 dark:text-stone-400 leading-relaxed text-[11px]">
              Tạo và xuất tệp JSON chứa toàn bộ danh sách tài khoản học viên (tên, email, tiến độ EXP, thời hạn VIP). Dữ liệu bảo mật không bao gồm mật khẩu.
            </p>
          </div>

          <button 
            onclick="window.adminExportUsersJson()" 
            class="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>Tải Xuống Tệp Dữ Liệu (JSON)</span>
          </button>
        </div>

        <!-- Tool 3: Clear Browser Cache & Reload -->
        <div class="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold shadow-2xs">
                <i data-lucide="rotate-ccw" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-bold text-stone-900 dark:text-stone-100 text-sm">Làm Sạch Bộ Nhớ & Tải Lại</h4>
                <p class="text-[11px] text-stone-500">Hard reload app bundle</p>
              </div>
            </div>
            <p class="text-stone-600 dark:text-stone-400 leading-relaxed text-[11px]">
              Tải lại ứng dụng, ép buộc trình duyệt cập nhật lại toàn bộ tài nguyên JavaScript và CSS mới nhất từ máy chủ VPS.
            </p>
          </div>

          <button 
            onclick="window.location.reload(true)" 
            class="w-full py-2.5 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
            <span>Tải Lại Ứng Dụng (Hard Reload)</span>
          </button>
        </div>

        <!-- Tool 4: Visitors Analytics Details -->
        <div class="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold shadow-2xs">
                <i data-lucide="bar-chart-2" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-bold text-stone-900 dark:text-stone-100 text-sm">Thống Kê Khách Truy Cập</h4>
                <p class="text-[11px] text-stone-500">Phân tích lượt truy cập tự động</p>
              </div>
            </div>
            <div class="space-y-1.5 text-[11px] font-mono text-stone-600 dark:text-stone-400">
              <div class="flex justify-between border-b border-stone-100 dark:border-stone-800 py-1">
                <span>Số người đang online:</span>
                <strong class="text-emerald-600">${adminVisitorStats.online || 0}</strong>
              </div>
              <div class="flex justify-between border-b border-stone-100 dark:border-stone-800 py-1">
                <span>Lượt truy cập hôm nay:</span>
                <strong class="text-stone-900 dark:text-stone-100">${adminVisitorStats.today || 0}</strong>
              </div>
              <div class="flex justify-between py-1">
                <span>Tổng lượt truy cập:</span>
                <strong class="text-amber-600">${adminVisitorStats.total || 0}</strong>
              </div>
            </div>
          </div>

          <button 
            onclick="if(window.toggleVisitorStatsModal) window.toggleVisitorStatsModal();" 
            class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i data-lucide="pie-chart" class="w-3.5 h-3.5"></i>
            <span>Mở Bảng Phân Tích Chi Tiết</span>
          </button>
        </div>

      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE ACTION HANDLERS
  // ---------------------------------------------------------------------------
  function setAdminSubTab(tab) {
    adminActiveSubTab = tab;
    renderAdminPortal();
  }

  function setAdminFilter(filter) {
    adminFilterStatus = filter;
    renderAdminPortal();
  }

  function handleAdminSearch(e) {
    adminSearchQuery = e.target.value;
    renderAdminPortal();
  }

  function clearAdminSearch() {
    adminSearchQuery = '';
    renderAdminPortal();
  }

  function updateBroadcastPreview() {
    const enabledInput = document.getElementById('adminBroadcastEnabledInput');
    const typeSelect = document.getElementById('adminBroadcastTypeSelect');
    const msgInput = document.getElementById('adminBroadcastMessageInput');
    const previewContainer = document.getElementById('adminBroadcastLivePreview');
    if (!previewContainer) return;

    const previewData = {
      enabled: enabledInput ? enabledInput.checked : false,
      type: typeSelect ? typeSelect.value : 'info',
      message: msgInput ? msgInput.value.trim() : ''
    };
    previewContainer.innerHTML = renderBroadcastBannerHtml(previewData);
  }

  async function adminSetUserVip(targetEmail, tier) {
    try {
      const result = await safeApiRequest('/api/admin/set-vip', {
        method: 'POST',
        body: { targetEmail, tier }
      });
      safeNotify(result.message || 'Cập nhật VIP thành công!', 'success');
      // If updating current user, refresh profile
      if (window.currentUser && window.currentUser.email === targetEmail) {
        window.currentUser.vipInfo = result.user.vipInfo;
        if (typeof window.renderAccountUi === 'function') window.renderAccountUi();
      }
      loadAdminPortalData(true);
    } catch (err) {
      safeNotify(err.message || 'Lỗi cập nhật gói VIP', 'error');
    }
  }

  async function adminUnlockUser(email) {
    try {
      const result = await safeApiRequest('/api/admin/unlock-user', {
        method: 'POST',
        body: { email }
      });
      safeNotify(result.message || 'Đã mở khóa tài khoản thành công!', 'success');
      loadAdminPortalData(true);
    } catch (err) {
      safeNotify(err.message || 'Lỗi mở khóa tài khoản', 'error');
    }
  }

  async function adminPromptResetPassword(email, name) {
    const newPass = prompt(`Nhập mật khẩu mới cho học viên ${name} (${email})\n(Yêu cầu tối thiểu 8 ký tự):`);
    if (!newPass) return;
    if (newPass.length < 8) {
      safeNotify('Mật khẩu quá ngắn, vui lòng nhập ít nhất 8 ký tự.', 'error');
      return;
    }

    try {
      const result = await safeApiRequest('/api/admin/reset-password', {
        method: 'POST',
        body: { email, newPassword: newPass }
      });
      safeNotify(result.message || `Đã đặt lại mật khẩu cho ${name}!`, 'success');
      loadAdminPortalData(true);
    } catch (err) {
      safeNotify(err.message || 'Lỗi đặt lại mật khẩu', 'error');
    }
  }

  async function adminSendTelegramPing() {
    const logEl = document.getElementById('adminTelegramStatusLog');
    if (logEl) {
      logEl.classList.remove('hidden');
      logEl.textContent = 'Đang gửi gói tin kiểm tra tới Telegram...';
      logEl.className = 'p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-mono';
    }

    try {
      await safeApiRequest('/api/admin/test-notify', { method: 'POST', body: {} });
      safeNotify('Đã gửi tin nhắn kiểm tra thành công tới Telegram!', 'success');
      if (logEl) {
        logEl.textContent = '✅ Kết nối Telegram thành công! Tin nhắn đã được phân phối tới Admin Chat.';
        logEl.className = 'p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono';
      }
    } catch (err) {
      safeNotify(err.message || 'Lỗi kết nối Telegram', 'error');
      if (logEl) {
        logEl.textContent = '❌ Lỗi: ' + err.message;
        logEl.className = 'p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[10px] font-mono';
      }
    }
  }

  async function adminSaveBroadcast() {
    const enabledInput = document.getElementById('adminBroadcastEnabledInput');
    const typeSelect = document.getElementById('adminBroadcastTypeSelect');
    const msgInput = document.getElementById('adminBroadcastMessageInput');

    const enabled = enabledInput ? enabledInput.checked : false;
    const type = typeSelect ? typeSelect.value : 'info';
    const message = msgInput ? msgInput.value.trim() : '';

    try {
      const result = await safeApiRequest('/api/admin/broadcast', {
        method: 'POST',
        body: { enabled, type, message }
      });
      safeNotify(result.message || 'Đã cập nhật thông báo toàn trang!', 'success');
      adminBroadcast = result.broadcast;
      renderAdminPortal();
      checkAndRenderSiteBroadcast();
    } catch (err) {
      safeNotify(err.message || 'Lỗi lưu thông báo', 'error');
    }
  }

  function adminExportUsersJson() {
    if (!adminUsersList || adminUsersList.length === 0) {
      safeNotify('Chưa có dữ liệu học viên để xuất.', 'warning');
      return;
    }
    const cleanList = adminUsersList.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.role,
      vipTier: u.vipInfo ? u.vipInfo.tier : 'none',
      isVip: Boolean(u.vipInfo && u.vipInfo.isVip),
      exp: u.exp || 0,
      streak: u.streak || 0,
      isLocked: Boolean(u.isLocked),
      createdAt: u.createdAt,
      lastActiveAt: u.lastActiveAt
    }));

    const jsonStr = JSON.stringify(cleanList, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hihsk_users_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    safeNotify(`Đã xuất ${cleanList.length} tài khoản ra tệp JSON thành công!`, 'success');
  }

  // ---------------------------------------------------------------------------
  // SITE-WIDE BROADCAST BANNER FOR ALL LEARNERS
  // ---------------------------------------------------------------------------
  async function checkAndRenderSiteBroadcast() {
    const bannerContainer = document.getElementById('siteBroadcastBanner');
    if (!bannerContainer) return;

    try {
      const res = await safeApiRequest('/api/system/broadcast');
      if (res && res.broadcast && res.broadcast.enabled && res.broadcast.message) {
        bannerContainer.classList.remove('hidden');
        bannerContainer.innerHTML = renderBroadcastBannerHtml(res.broadcast);
      } else {
        bannerContainer.classList.add('hidden');
        bannerContainer.innerHTML = '';
      }
    } catch (err) {
      bannerContainer.classList.add('hidden');
    }
  }

  function safeArg(val) {
    if (typeof window.jsArg === 'function') return window.jsArg(val);
    return JSON.stringify(val);
  }

  // Auto initialize broadcast banner check on page load
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkAndRenderSiteBroadcast);
    } else if (typeof setTimeout === 'function') {
      setTimeout(checkAndRenderSiteBroadcast, 1000);
    }
  }

  // Export to Global Window Scope
  window.renderAdminPortal = renderAdminPortal;
  window.loadAdminPortalData = loadAdminPortalData;
  window.setAdminSubTab = setAdminSubTab;
  window.setAdminFilter = setAdminFilter;
  window.handleAdminSearch = handleAdminSearch;
  window.clearAdminSearch = clearAdminSearch;
  window.updateBroadcastPreview = updateBroadcastPreview;
  window.adminSetUserVip = adminSetUserVip;
  window.adminUnlockUser = adminUnlockUser;
  window.adminPromptResetPassword = adminPromptResetPassword;
  window.adminSendTelegramPing = adminSendTelegramPing;
  window.adminSaveBroadcast = adminSaveBroadcast;
  window.adminExportUsersJson = adminExportUsersJson;
  window.checkAndRenderSiteBroadcast = checkAndRenderSiteBroadcast;

})(typeof window !== 'undefined' ? window : globalThis);
