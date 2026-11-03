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
    const supportWin = document.getElementById('supportContactWindow');
    const aiWin = document.getElementById('floatingAiChatWindow');
    if (supportWin) supportWin.classList.add('hidden');
    if (aiWin) {
      aiWin.classList.add('hidden');
      isFloatingAiOpen = false;
    }
  }
}

function toggleSupportContactModal() {
  const win = document.getElementById('supportContactWindow');
  if (!win) return;

  const isHidden = win.classList.contains('hidden');
  if (isHidden) {
    win.classList.remove('hidden');
    // Mutual exclusion: close AI chat window if open
    const aiWin = document.getElementById('floatingAiChatWindow');
    if (aiWin && !aiWin.classList.contains('hidden')) {
      aiWin.classList.add('hidden');
      isFloatingAiOpen = false;
    }
    refreshIcons(win);
  } else {
    win.classList.add('hidden');
  }
}

function closeSupportContactModal() {
  const win = document.getElementById('supportContactWindow');
  if (win) win.classList.add('hidden');
}

function dismissFloatingContactTooltip(e) {
  if (e) e.stopPropagation();
  const tooltip = document.getElementById('floatingContactTooltip');
  if (tooltip) tooltip.classList.add('hidden');
}

function copySupportInfo(text, label) {
  copyToClipboard(text, `Đã sao chép: ${label}`);
}

async function sendQuickSupportFeedback() {
  const input = document.getElementById('supportQuickMsgInput');
  if (!input) return;
  const message = input.value.trim();
  if (!message) {
    showToast('Vui lòng nhập nội dung cần hỗ trợ hoặc phản hồi!', 'error');
    input.focus();
    return;
  }

  showToast('Đang gửi lời nhắn hỗ trợ...', 'info');

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      input.value = '';
      showToast('Đã gửi lời nhắn thành công! Đội ngũ hỗ trợ sẽ phản hồi sớm nhất.', 'success');
    } else {
      showToast(data.error || 'Không gửi được lời nhắn, vui lòng thử lại sau.', 'error');
    }
  } catch (err) {
    console.error('Lỗi khi gửi phản hồi:', err);
    showToast('Không thể kết nối máy chủ. Vui lòng thử lại sau.', 'error');
  }
}
