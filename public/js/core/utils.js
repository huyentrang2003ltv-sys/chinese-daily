// =========================================================================
// Shared helpers (loaded first; every other module may use them)
// =========================================================================

// Debounce Utility for fast input performance
function debounce(func, wait = 120) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Scoped Lucide Icons Refresh (Zero Main-Thread Lockup)
function refreshIcons(container) {
  if (!window.lucide) return;
  if (container && container.nodeType) {
    window.lucide.createIcons({ root: container });
  } else {
    window.lucide.createIcons();
  }
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape a value for safe insertion as HTML text or attribute value. */
function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

/**
 * Encode a value as a JS string literal for inline handlers:
 *   `<button onclick="playChineseTTS(${jsArg(text)})">`
 * Survives quotes, apostrophes and newlines in the data.
 */
function jsArg(value) {
  return escapeHtml(JSON.stringify(value == null ? '' : String(value)));
}

/** localStorage wrappers that never throw (private mode, quota, disabled storage). */
const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  getRaw(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : raw;
    } catch (e) {
      return fallback;
    }
  },
  setRaw(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }
};

/** Local date as YYYY-MM-DD (toISOString() would use UTC and break streaks around midnight in VN). */
function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Non-blocking notification replacing window.alert(). type: info | success | warning | error */
function showToast(message, type = 'info', timeout = 3500) {
  let host = document.getElementById('toastHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toastHost';
    host.className = 'fixed z-[60] top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 w-[calc(100%-2rem)] max-w-md pointer-events-none';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
  }
  const tones = {
    info: 'bg-stone-900 text-amber-50 border-stone-700',
    success: 'bg-emerald-800 text-emerald-50 border-emerald-600',
    warning: 'bg-amber-600 text-amber-50 border-amber-400',
    error: 'bg-[#8B1E1E] text-red-50 border-red-400'
  };
  const toast = document.createElement('div');
  toast.className = `toast-item pointer-events-auto w-full px-4 py-3 rounded-xl border shadow-xl text-sm font-medium ${tones[type] || tones.info}`;
  toast.textContent = message;
  host.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-leave');
    setTimeout(() => toast.remove(), 300);
  }, timeout);
}

// ---------------- Modals ----------------
// Each modal is a `.hidden` fixed overlay; its close function is registered here so
// Esc and backdrop clicks run the same cleanup as the close button.
const MODAL_CLOSERS = {};

function registerModal(id, closeFn) {
  MODAL_CLOSERS[id] = closeFn;
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  document.body.classList.add('overflow-hidden');
  refreshIcons(modal);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
  if (!document.querySelector('[aria-modal="true"]:not(.hidden)')) {
    document.body.classList.remove('overflow-hidden');
  }
}

function closeTopModal() {
  const open = [...document.querySelectorAll('[aria-modal="true"]:not(.hidden)')].pop();
  if (!open) return false;
  (MODAL_CLOSERS[open.id] || (() => closeModal(open.id)))();
  return true;
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeTopModal();
});

document.addEventListener('click', e => {
  // Click on the dimmed backdrop itself (not on the dialog content) closes it.
  const target = e.target;
  if (target && target.getAttribute && target.getAttribute('aria-modal') === 'true') {
    (MODAL_CLOSERS[target.id] || (() => closeModal(target.id)))();
  }
});

/** Copy text to the clipboard and confirm with a toast; falls back to a manual prompt. */
async function copyToClipboard(text, successMessage = 'Đã sao chép!') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage, 'success');
    return true;
  } catch (e) {
    window.prompt('Sao chép nội dung dưới đây:', text);
    return false;
  }
}
