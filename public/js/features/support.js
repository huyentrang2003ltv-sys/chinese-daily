// ==================== UNIFIED FLOATING DOCK LOGIC ====================
function initFloatingDock() {
  const isHidden = storage.getRaw('chinese_daily_dock_hidden') === 'true';
  applyFloatingDockState(isHidden);
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
