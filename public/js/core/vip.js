// =========================================================================
// VIP subscription: status comes from the server (account), payment via VietQR transfer
// =========================================================================
// Content files are public, so this gate is a product nudge rather than DRM; the
// status itself is computed by the server and cannot be granted from the browser.
const VIP_PACKAGES = {
  monthly: { label: 'VIP 1 tháng' },
  yearly: { label: 'VIP 1 năm' },
  lifetime: { label: 'VIP trọn đời' }
};
const GUEST_VIP = { isVip: false, isTrial: false, isExpired: true, daysRemaining: 0, label: 'Khách', tier: 'guest', expiresAt: null };

let selectedVipPackageTier = 'yearly';
let paymentInfo = null;

function checkCurrentUserVip() {
  return (currentUser && currentUser.vipInfo) || GUEST_VIP;
}

/** True when the learner may open a VIP feature; otherwise explains how to unlock it. */
function ensureVipAccess(featureName = 'tính năng này') {
  const vip = checkCurrentUserVip();
  if (vip.isVip && !vip.isExpired) return true;
  if (!currentUser) {
    showToast(`Đăng ký miễn phí để dùng thử ${featureName} trong 7 ngày.`, 'info');
    openAuthModal('register');
  } else {
    showToast(`Thời gian dùng thử đã hết. Nâng cấp VIP để mở ${featureName}.`, 'warning');
    openVipModal('yearly');
  }
  return false;
}

const VIP_BADGE_STYLES = {
  lifetime: ['👑', 'VIP trọn đời', '', 'bg-amber-500/15 text-amber-950 dark:text-amber-300 border-amber-400'],
  trial: ['🎁', null, 'NÂNG CẤP', 'bg-emerald-500/10 text-emerald-950 dark:text-emerald-300 border-emerald-400/80'],
  active: ['💎', null, 'GIA HẠN', 'bg-amber-500/10 text-[#8B1E1E] dark:text-amber-300 border-amber-300/80'],
  expired: ['🔒', 'Hết hạn', 'MỞ KHÓA', 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/70'],
  guest: ['🎁', 'Dùng thử 7 ngày', 'MIỄN PHÍ', 'bg-emerald-500/10 text-emerald-950 dark:text-emerald-300 border-emerald-400/80']
};

function renderVipBadge() {
  const badge = document.getElementById('headerVipBadge');
  if (!badge) return;
  const vip = checkCurrentUserVip();
  const key = vip.tier === 'lifetime' ? 'lifetime'
    : vip.tier === 'guest' ? 'guest'
      : vip.isTrial ? 'trial'
        : vip.isVip ? 'active' : 'expired';
  const [icon, text, pill, tone] = VIP_BADGE_STYLES[key];
  badge.className = `hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs transition-all cursor-pointer select-none ${tone}`;
  badge.onclick = () => (currentUser ? openVipModal() : openAuthModal('register'));
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  set('headerVipIcon', icon);
  set('headerVipText', text || (vip.isTrial ? `Dùng thử (${vip.daysRemaining} ngày)` : `VIP (${vip.daysRemaining} ngày)`));
  const pillEl = document.getElementById('headerVipPill');
  if (pillEl) {
    pillEl.textContent = pill;
    pillEl.classList.toggle('hidden', !pill);
  }
}

async function loadPaymentInfo() {
  if (paymentInfo) return paymentInfo;
  try {
    const res = await fetch('/api/payment-info');
    paymentInfo = res.ok ? await res.json() : { configured: false };
  } catch (e) {
    paymentInfo = { configured: false };
  }
  return paymentInfo;
}

async function openVipModal(tier = 'yearly') {
  if (!currentUser) {
    showToast('Vui lòng đăng nhập để nâng cấp VIP.', 'info');
    openAuthModal('login');
    return;
  }
  const vip = checkCurrentUserVip();
  const emailEl = document.getElementById('vipModalUserEmail');
  if (emailEl) emailEl.textContent = currentUser.email;
  const badgeEl = document.getElementById('vipModalStatusBadge');
  if (badgeEl) badgeEl.textContent = vip.label;
  const feedbackBox = document.getElementById('vipUpgradeFeedbackBox');
  if (feedbackBox) feedbackBox.classList.add('hidden');

  openModal('vipUpgradeModal');
  await loadPaymentInfo();
  document.getElementById('vipPaymentBox')?.classList.toggle('hidden', !paymentInfo.configured);
  document.getElementById('vipPaymentUnavailable')?.classList.toggle('hidden', Boolean(paymentInfo.configured));
  document.getElementById('vipConfirmPaymentBtn')?.toggleAttribute('disabled', !paymentInfo.configured);
  selectVipPackage(tier);
}

function closeVipModal() {
  closeModal('vipUpgradeModal');
}
registerModal('vipUpgradeModal', closeVipModal);

const vipTransferNote = () => `NAPVIP ${currentUser ? currentUser.email : ''}`.trim();
const vipAmount = tier => (paymentInfo && paymentInfo.prices && paymentInfo.prices[tier]) || 0;

function selectVipPackage(tier) {
  selectedVipPackageTier = VIP_PACKAGES[tier] ? tier : 'yearly';
  Object.keys(VIP_PACKAGES).forEach(key => {
    const btn = document.getElementById(`vipPackageBtn-${key}`);
    if (!btn) return;
    const selected = key === selectedVipPackageTier;
    btn.classList.toggle('border-amber-500', selected);
    btn.classList.toggle('ring-2', selected);
    btn.classList.toggle('ring-amber-400/40', selected);
    btn.classList.toggle('opacity-80', !selected);
    btn.setAttribute('aria-pressed', String(selected));
  });

  if (!paymentInfo || !paymentInfo.configured) return;
  const amount = vipAmount(selectedVipPackageTier);
  const note = vipTransferNote();
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  set('vipBankName', paymentInfo.bankName);
  set('vipAccountNo', paymentInfo.accountNo);
  set('vipAccountName', paymentInfo.accountName);
  set('vipModalAmountText', `${amount.toLocaleString('vi-VN')}đ`);
  set('vipModalTransferNoteText', note);
  const qr = document.getElementById('vipVietQrImage');
  if (qr) {
    const params = new URLSearchParams({ amount: String(amount), addInfo: note, accountName: paymentInfo.accountName });
    qr.src = `https://api.vietqr.io/image/${encodeURIComponent(paymentInfo.bankBin)}-${encodeURIComponent(paymentInfo.accountNo)}-compact2.png?${params}`;
  }
}

function copyVipField(field) {
  if (paymentInfo && paymentInfo[field]) copyToClipboard(paymentInfo[field], 'Đã sao chép!');
}

function copyVipAmount() {
  copyToClipboard(String(vipAmount(selectedVipPackageTier)), 'Đã sao chép số tiền.');
}

function copyVipNote() {
  copyToClipboard(vipTransferNote(), 'Đã sao chép nội dung chuyển khoản.');
}

async function confirmVipPaymentTransfer() {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }
  const feedbackBox = document.getElementById('vipUpgradeFeedbackBox');
  await withBusyButton('vipConfirmPaymentBtn', 'Đang gửi thông báo...', async () => {
    try {
      const result = await apiRequest('/api/vip/upgrade-request', {
        method: 'POST',
        body: { packageTier: selectedVipPackageTier, txNote: vipTransferNote() }
      });
      if (feedbackBox) {
        feedbackBox.className = 'p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-medium';
        feedbackBox.textContent = result.message;
      }
      showToast('Đã báo quản trị viên. VIP sẽ được kích hoạt sau khi xác nhận chuyển khoản.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
