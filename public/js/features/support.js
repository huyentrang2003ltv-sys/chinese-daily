// ==================== UNIFIED FLOATING DOCK & POLICY ENGINE ====================
function initFloatingDock() {
  const isHidden = storage.getRaw('chinese_daily_dock_hidden') === 'true';
  applyFloatingDockState(isHidden);
  updateQuickDockNotebookBadge();
}

function applyFloatingDockState(hidden) {
  const dock = document.getElementById('floatingRightDock');
  const collapsedBtn = document.getElementById('floatingDockCollapsedBtn');
  if (!dock || !collapsedBtn) return;

  if (hidden) {
    dock.classList.add('hidden');
    dock.classList.remove('flex');
    collapsedBtn.classList.remove('hidden');
    collapsedBtn.classList.add('inline-flex');
  } else {
    dock.classList.remove('hidden');
    dock.classList.add('flex');
    collapsedBtn.classList.add('hidden');
    collapsedBtn.classList.remove('inline-flex');
  }
}

function toggleFloatingDockVisibility(hide) {
  storage.setRaw('chinese_daily_dock_hidden', hide ? 'true' : 'false');
  applyFloatingDockState(hide);
  if (hide) {
    const aiWin = document.getElementById('floatingAiChatWindow');
    if (aiWin) {
      aiWin.classList.add('hidden');
      isFloatingAiOpen = false;
    }
  }
}

function updateQuickDockNotebookBadge() {
  const badge = document.getElementById('quickDockNotebookBadge');
  if (!badge) return;
  const count = (typeof userProfile !== 'undefined' && userProfile.savedWords) ? userProfile.savedWords.length : 7;
  badge.innerText = count > 0 ? (count > 99 ? '99+' : count) : '0';
  if (count === 0) {
    badge.classList.add('opacity-80');
  } else {
    badge.classList.remove('opacity-80');
  }
}

function quickDockSearch() {
  const input = document.getElementById('globalSearchInput');
  if (input) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      input.focus();
      input.select();
      if (typeof showToast === 'function') {
        showToast('🔍 Đã kích hoạt ô tra cứu nhanh Hán tự & Pinyin!', 'info');
      }
    }, 250);
  } else if (typeof switchTab === 'function') {
    switchTab('dictionary');
  }
}

function handleSupportAvatarClick(e) {
  if (typeof showToast === 'function') {
    showToast('Đang kết nối Zalo Trợ Lý Hỗ Trợ 24/7 (Hotline: 0988886666)...', 'success');
  }
}

function toggleSupportContactModal() {
  if (typeof showToast === 'function') {
    showToast('Đang kết nối Zalo Trợ Lý Hỗ Trợ 24/7 (Hotline: 0988886666)...', 'success');
  }
  window.open('https://zalo.me/0988886666', '_blank');
}

function closeSupportContactModal() {
  // Backwards compatibility stub
}

function dismissFloatingContactTooltip(e) {
  if (e) e.stopPropagation();
  const tooltip = document.getElementById('floatingContactTooltip');
  if (tooltip) tooltip.classList.add('hidden');
}

function copySupportInfo(text, label) {
  if (typeof copyToClipboard === 'function') {
    copyToClipboard(text, `Đã sao chép: ${label}`);
  }
}

// ---------------- QUICK SETTINGS MODAL ----------------
function openQuickSettingsModal() {
  openModal('quickSettingsModal');
}

function closeQuickSettingsModal() {
  closeModal('quickSettingsModal');
}
if (typeof registerModal === 'function') {
  registerModal('quickSettingsModal', closeQuickSettingsModal);
}

// ---------------- PLATFORM POLICY MODAL ENGINE ----------------
const PLATFORM_POLICIES = {
  operating: {
    title: "Quy chế hoạt động nền tảng số",
    badge: "QUY CHẾ CHUNG",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">1. Mục đích và Phạm vi Áp dụng</h4>
      <p class="mb-3 leading-relaxed">Nền tảng "Hi HSK - Học Tiếng Trung Mỗi Ngày" (每日中文) được vận hành nhằm cung cấp môi trường học tập trực tuyến chuẩn hóa HSK 3.0, từ vựng logic, chiết tự 214 bộ thủ và mô phỏng phòng thi chuẩn quốc tế cho học viên tại Việt Nam và cộng đồng người học toàn cầu.</p>
      
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">2. Nguyên tắc hoạt động</h4>
      <p class="mb-3 leading-relaxed">• Tôn trọng quyền sở hữu trí tuệ và chuẩn mực giáo dục ngôn ngữ quốc tế Hanban.<br>• Mọi học viên tham gia học tập, thảo luận trong Lớp học thông minh (Smart Peer Study Room) cam kết tôn trọng văn minh, không spam, không phát tán nội dung vi phạm thuần phong mỹ tục.<br>• Nền tảng đảm bảo vận hành ổn định 24/7 với hệ thống máy chủ biên CDN và bảo mật đa lớp.</p>
    `
  },
  owner: {
    title: "Thông tin chủ quản nền tảng",
    badge: "CHỦ QUẢN & BẢN QUYỀN",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Đơn vị Vận hành & Bản quyền Nội dung</h4>
      <p class="mb-2"><strong>Đơn vị chủ quản:</strong> Hệ thống Giáo dục Ngôn ngữ Trực tuyến Hi HSK EduTech.</p>
      <p class="mb-2"><strong>Email chính thức:</strong> <a href="mailto:hihsk.com@gmail.com" class="text-rose-700 dark:text-amber-400 underline">hihsk.com@gmail.com</a></p>
      <p class="mb-2"><strong>Đường dây nóng hỗ trợ:</strong> 0988.88.66.66 (Zalo 24/7)</p>
      <p class="mb-2"><strong>Bản quyền hệ thống:</strong> Toàn bộ dữ liệu 3.592 từ vựng HSK, 14.605 từ chuyên ngành, 150 hội thoại tình huống và 1.000 cặp thẻ lật thuộc quyền sở hữu độc quyền của nền tảng.</p>
    `
  },
  privacy: {
    title: "Chính sách bảo mật dữ liệu",
    badge: "BẢO MẬT & DỮ LIỆU",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Bảo vệ Thông tin Cá nhân Người học</h4>
      <p class="mb-3 leading-relaxed">• Chúng tôi áp dụng thuật toán mã hóa mật khẩu Scrypt tiên tiến nhất, đảm bảo ngay cả quản trị viên cũng không thể đọc được mật khẩu gốc.<br>• Dữ liệu học tập cá nhân (tiến độ bài học, điểm số, thẻ ghi nhớ SRS) được lưu trữ an toàn trên thiết bị của bạn (localStorage) và đồng bộ qua cookie phiên bảo mật HttpOnly.<br>• Cam kết không bao giờ bán, cho thuê hoặc tiết lộ dữ liệu cá nhân của học viên cho bất kỳ bên thứ ba nào vì mục đích quảng cáo.</p>
    `
  },
  rights: {
    title: "Quyền và nghĩa vụ các bên",
    badge: "QUYỀN & NGHĨA VỤ",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Quyền của Học viên</h4>
      <p class="mb-3 leading-relaxed">• Được toàn quyền truy cập tài liệu bài giảng, âm thanh chuẩn CCTV và trợ lý AI theo gói học đã đăng ký.<br>• Được hỗ trợ giải đáp kỹ thuật và học thuật 24/7 qua Zalo và Trợ lý AI.<br>• Có quyền xuất file sao lưu tiến độ học tập và yêu cầu xóa vĩnh viễn tài khoản bất kỳ lúc nào.</p>
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Nghĩa vụ của Học viên</h4>
      <p class="mb-2 leading-relaxed">• Không chia sẻ trái phép tài khoản VIP cho nhiều người ngoài phạm vi gói học cá nhân.<br>• Tự chịu trách nhiệm bảo mật thiết bị truy cập và mật khẩu của mình.</p>
    `
  },
  dispute: {
    title: "Tiếp nhận & Giải quyết khiếu nại",
    badge: "KHIẾU NẠI & HỖ TRỢ",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Quy trình xử lý phản ánh & khiếu nại</h4>
      <p class="mb-2 leading-relaxed Chúng tôi cam kết tiếp nhận và phản hồi mọi yêu cầu của học viên trong vòng <strong>2 giờ làm việc</strong> qua các kênh:</p>
      <p class="mb-1">• <strong>Email phản ánh trực tiếp:</strong> <a href="mailto:hihsk.com@gmail.com" class="text-rose-700 dark:text-amber-400 font-bold underline">hihsk.com@gmail.com</a></p>
      <p class="mb-1">• <strong>Hotline/Zalo tiếp nhận khiếu nại 24/7:</strong> 0988.88.66.66</p>
      <p class="mt-2 leading-relaxed">Mọi trường hợp lỗi kỹ thuật, thanh toán hoặc thắc mắc học liệu đều được chuyên viên hỗ trợ tận tình đến khi học viên hài lòng 100%.</p>
    `
  },
  pricing: {
    title: "Chính sách về giá & Điều kiện",
    badge: "BẢNG GIÁ MINH BẠCH",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Minh bạch Giá & Ưu đãi</h4>
      <p class="mb-2 leading-relaxed">• Mọi học viên mới đăng ký đều được hưởng <strong>7 ngày dùng thử miễn phí không giới hạn</strong> tính năng.<br>• Bảng giá các gói VIP (1 Tháng, 1 Năm, Trọn Đời) được niêm yết công khai tại mục Nâng Cấp VIP, cam kết không phát sinh bất kỳ phụ phí ẩn nào.<br>• Giá gói trọn đời được bảo lưu quyền lợi vĩnh viễn bao gồm toàn bộ cập nhật học liệu tương lai.</p>
    `
  },
  payment: {
    title: "Chính sách thanh toán",
    badge: "THANH TOÁN AN TOÀN",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Phương thức Thanh toán</h4>
      <p class="mb-2 leading-relaxed">Học viên có thể thanh toán thuận tiện qua:</p>
      <p class="mb-1">• Chuyển khoản ngân hàng 24/7 quét mã VietQR tự động kích hoạt tức thì.<br>• Ví điện tử MoMo, ZaloPay, Viettel Money.<br>• Thẻ thanh toán quốc tế Visa, MasterCard.</p>
      <p class="mt-2 text-stone-500 dark:text-stone-400 text-xs">Biên lai điện tử xác nhận sẽ được gửi tự động qua email hoặc tin nhắn Zalo ngay sau khi giao dịch thành công.</p>
    `
  },
  service: {
    title: "Phương thức cung cấp dịch vụ",
    badge: "DỊCH VỤ SỐ",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Cung cấp Dịch vụ Học tập Điện tử</h4>
      <p class="mb-2 leading-relaxed">• Dịch vụ được cung cấp trực tuyến 100% trên nền tảng web đa thiết bị (Máy tính, Máy tính bảng, Điện thoại di động).<br>• Học viên có thể cài đặt ứng dụng web lũy tiến (PWA) để học tập mượt mà như ứng dụng native mà không cần tải file nặng từ kho ứng dụng.</p>
    `
  },
  refund: {
    title: "Đổi trả, chấm dứt & Hoàn tiền",
    badge: "CAM KẾT 100% HOÀN TIỀN",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Chính sách Cam kết Hoàn tiền trong 7 ngày</h4>
      <p class="mb-3 leading-relaxed">Nếu trong vòng <strong>7 ngày</strong> kể từ khi nâng cấp tài khoản VIP, học viên cảm thấy nền tảng không phù hợp với nhu cầu học tập, quý khách chỉ cần gửi email tới <a href="mailto:hihsk.com@gmail.com" class="text-rose-700 dark:text-amber-400 font-bold underline">hihsk.com@gmail.com</a> hoặc nhắn tin qua Zalo 0988.88.66.66. Chúng tôi cam kết <strong>hoàn tiền 100%</strong> vô điều kiện trong vòng 24 giờ.</p>
    `
  },
  delete_account: {
    title: "Yêu cầu xóa tài khoản & Bảo lưu dữ liệu",
    badge: "QUYỀN RIÊNG TƯ",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Quy trình Yêu cầu Hủy bỏ Tài khoản</h4>
      <p class="mb-3 leading-relaxed">Học viên có toàn quyền yêu cầu xóa vĩnh viễn tài khoản và toàn bộ lịch sử học tập khỏi hệ thống của chúng tôi.</p>
      <p class="mb-2"><strong>Cách thực hiện:</strong></p>
      <p class="mb-1">1. Gửi email từ chính hòm thư đăng ký của bạn đến <a href="mailto:hihsk.com@gmail.com" class="text-rose-700 dark:text-amber-400 font-bold underline">hihsk.com@gmail.com</a> với tiêu đề <code>[Yêu Cầu Xóa Tài Khoản]</code>.</p>
      <p class="mb-2">2. Hoặc liên hệ trực tiếp qua Zalo Quản trị viên: 0988.88.66.66.</p>
      <p class="text-stone-500 dark:text-stone-400 text-xs mt-2">Hệ thống sẽ tiến hành xóa sạch dữ liệu người dùng trong vòng 24 giờ và gửi email xác nhận hoàn tất.</p>
    `
  },
  catalog: {
    title: "Danh mục chính sách nền tảng",
    badge: "MỤC LỤC CHÍNH SÁCH",
    content: `
      <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Tổng hợp Quy chuẩn Pháp lý Nền tảng Hi HSK</h4>
      <p class="mb-3 leading-relaxed">Nền tảng Hi HSK tuân thủ nghiêm ngặt các quy định pháp luật hiện hành về cung cấp dịch vụ nội dung số và thương mại điện tử.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <button onclick="switchPlatformPolicyTab('operating')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">1. Quy chế hoạt động số</button>
        <button onclick="switchPlatformPolicyTab('owner')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">2. Thông tin chủ quản</button>
        <button onclick="switchPlatformPolicyTab('privacy')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">3. Chính sách bảo mật</button>
        <button onclick="switchPlatformPolicyTab('dispute')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">4. Giải quyết khiếu nại</button>
        <button onclick="switchPlatformPolicyTab('refund')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">5. Đổi trả & Hoàn tiền</button>
        <button onclick="switchPlatformPolicyTab('delete_account')" class="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-left hover:bg-rose-50 hover:text-rose-700 font-bold cursor-pointer">6. Xóa tài khoản</button>
      </div>
    `
  }
};

function openPlatformPolicyModal(key = 'operating') {
  switchPlatformPolicyTab(key);
  openModal('platformPolicyModal');
}

function closePlatformPolicyModal() {
  closeModal('platformPolicyModal');
}
if (typeof registerModal === 'function') {
  registerModal('platformPolicyModal', closePlatformPolicyModal);
}

function switchPlatformPolicyTab(key) {
  const policy = PLATFORM_POLICIES[key] || PLATFORM_POLICIES.operating;
  const titleEl = document.getElementById('platformPolicyTitle');
  const badgeEl = document.getElementById('platformPolicyBadge');
  const bodyEl = document.getElementById('platformPolicyBody');

  if (titleEl) titleEl.innerText = policy.title;
  if (badgeEl) badgeEl.innerText = policy.badge;
  if (bodyEl) bodyEl.innerHTML = policy.content;

  // Highlight tab button
  document.querySelectorAll('[data-policy-tab]').forEach(btn => {
    if (btn.getAttribute('data-policy-tab') === key) {
      btn.className = 'w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#8B1E1E] text-white shadow-2xs cursor-pointer';
    } else {
      btn.className = 'w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-colors cursor-pointer';
    }
  });
}

// ---------------- APP INSTALL MODAL (GOOGLE PLAY & APP STORE) ----------------
function showAppInstallModal(platform = 'google_play') {
  const modal = document.getElementById('appInstallModal');
  const titleEl = document.getElementById('appInstallTitle');
  const descEl = document.getElementById('appInstallDesc');
  const iconEl = document.getElementById('appInstallIcon');

  if (platform === 'app_store') {
    if (titleEl) titleEl.innerText = 'Cài đặt Hi HSK trên iPhone / iPad (iOS)';
    if (descEl) descEl.innerHTML = 'Để học mượt mà như app gốc trên iOS: Mở Safari &rarr; Nhấn biểu tượng <b>Chia sẻ (Share)</b> &rarr; Chọn <b>"Thêm vào Màn hình chính" (Add to Home Screen)</b>.';
    if (iconEl) iconEl.innerText = '🍏';
  } else {
    if (titleEl) titleEl.innerText = 'Cài đặt Hi HSK trên Android / Google Play';
    if (descEl) descEl.innerHTML = 'Để cài đặt app trên Android: Mở Chrome &rarr; Nhấn menu <b>3 chấm</b> ở góc trên phải &rarr; Chọn <b>"Cài đặt ứng dụng" (Install App)</b> hoặc tải trực tiếp file APK an toàn.';
    if (iconEl) iconEl.innerText = '▶️';
  }

  openModal('appInstallModal');
}

function closeAppInstallModal() {
  closeModal('appInstallModal');
}
if (typeof registerModal === 'function') {
  registerModal('appInstallModal', closeAppInstallModal);
}

// Global exports
window.initFloatingDock = initFloatingDock;
window.toggleFloatingDockVisibility = toggleFloatingDockVisibility;
window.updateQuickDockNotebookBadge = updateQuickDockNotebookBadge;
window.quickDockSearch = quickDockSearch;
window.handleSupportAvatarClick = handleSupportAvatarClick;
window.toggleSupportContactModal = toggleSupportContactModal;
window.closeSupportContactModal = closeSupportContactModal;
window.openQuickSettingsModal = openQuickSettingsModal;
window.closeQuickSettingsModal = closeQuickSettingsModal;
window.openPlatformPolicyModal = openPlatformPolicyModal;
window.closePlatformPolicyModal = closePlatformPolicyModal;
window.switchPlatformPolicyTab = switchPlatformPolicyTab;
window.showAppInstallModal = showAppInstallModal;
window.closeAppInstallModal = closeAppInstallModal;
