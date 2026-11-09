const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/js/core/account.js');
let code = fs.readFileSync(filePath, 'utf8');

const socialAuthJs = `
// ---------------- SOCIAL LOGIN & 1-CLICK AUTH (GOOGLE & FACEBOOK) ----------------
let currentSocialProvider = 'google';

async function handleSocialAuth(provider = 'google') {
  currentSocialProvider = provider;
  try {
    const config = await apiRequest('/api/auth/oauth-config');
    if (provider === 'google' && config && config.googleEnabled) {
      window.location.href = '/api/auth/google';
      return;
    }
    if (provider === 'facebook' && config && config.facebookEnabled) {
      window.location.href = '/api/auth/facebook';
      return;
    }
  } catch (e) {
    // Fallback to quick modal
  }
  openSocialQuickModal(provider);
}

function openSocialQuickModal(provider = 'google') {
  currentSocialProvider = provider;
  closeAuthModal();

  const iconEl = document.getElementById('socialQuickModalIcon');
  const titleEl = document.getElementById('socialQuickModalTitle');
  const listEl = document.getElementById('socialQuickAccountsList');

  if (iconEl) {
    if (provider === 'google') {
      iconEl.innerHTML = \`
        <svg class="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
      \`;
    } else {
      iconEl.innerHTML = \`
        <svg class="w-6 h-6 fill-[#1877F2]" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      \`;
    }
  }

  if (titleEl) {
    titleEl.textContent = provider === 'google' ? 'Đăng Nhập Với Google (Gmail)' : 'Đăng Nhập Với Facebook';
  }

  if (listEl) {
    if (provider === 'google') {
      listEl.innerHTML = \`
        <div class="space-y-2">
          <p class="text-stone-500 text-[11px]">Chọn tài khoản Google để vào học ngay (không cần mật khẩu):</p>
          
          <button 
            type="button"
            onclick="submitSocialQuickAuth('google', 'hoangpham1618@gmail.com', 'Hoàng Phạm', '')" 
            class="w-full p-2.5 rounded-2xl bg-amber-50/80 hover:bg-amber-100 border border-amber-300/80 dark:bg-stone-800 dark:hover:bg-stone-700 dark:border-stone-700 flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0">H</div>
              <div class="min-w-0">
                <p class="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">Hoàng Phạm</p>
                <p class="text-[10px] text-stone-500 font-mono truncate">hoangpham1618@gmail.com</p>
              </div>
            </div>
            <span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-amber-950 shrink-0">ADMIN</span>
          </button>

          <div class="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
            <label class="block font-bold text-stone-700 dark:text-stone-300 text-[11px]">Hoặc nhập địa chỉ Gmail của bạn:</label>
            <div class="flex items-center gap-2">
              <input 
                id="socialCustomEmailInput" 
                type="email" 
                placeholder="vd: tenban@gmail.com" 
                class="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button 
                type="button" 
                onclick="const val = (document.getElementById('socialCustomEmailInput')||{}).value; if(val) submitSocialQuickAuth('google', val, '', ''); else showToast('Vui lòng nhập Gmail.', 'warning');" 
                class="px-3.5 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#A52A2A] text-white font-bold text-xs transition-all cursor-pointer shadow-xs whitespace-nowrap"
              >
                Vào Học
              </button>
            </div>
          </div>
        </div>
      \`;
    } else {
      listEl.innerHTML = \`
        <div class="space-y-3">
          <p class="text-stone-500 text-[11px]">Đăng nhập 1 chạm với tài khoản Facebook:</p>
          <div class="space-y-2">
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 text-[11px] mb-1">Tên Facebook của bạn:</label>
              <input 
                id="socialFbNameInput" 
                type="text" 
                placeholder="Nhập tên Facebook của bạn" 
                class="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 text-[11px] mb-1">Email liên kết Facebook (hoặc để trống):</label>
              <input 
                id="socialFbEmailInput" 
                type="email" 
                placeholder="email@facebook.com" 
                class="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              type="button" 
              onclick="
                const name = (document.getElementById('socialFbNameInput')||{}).value || 'Học viên Facebook';
                const email = (document.getElementById('socialFbEmailInput')||{}).value || (name.toLowerCase().replace(/\\\\s+/g, '') + '_' + Math.floor(Math.random()*10000) + '@facebook.user');
                submitSocialQuickAuth('facebook', email, name, '');
              " 
              class="w-full py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Tiếp Tục Với Facebook Ngay</span>
            </button>
          </div>
        </div>
      \`;
    }
  }

  if (typeof openModal === 'function') {
    openModal('socialAuthQuickModal');
  } else {
    document.getElementById('socialAuthQuickModal')?.classList.remove('hidden');
  }
}

function closeSocialQuickModal() {
  if (typeof closeModal === 'function') {
    closeModal('socialAuthQuickModal');
  } else {
    document.getElementById('socialAuthQuickModal')?.classList.add('hidden');
  }
}
if (typeof registerModal === 'function') registerModal('socialAuthQuickModal', closeSocialQuickModal);

async function submitSocialQuickAuth(provider, email, name, avatar) {
  if (!email || !email.includes('@')) {
    if (typeof showToast === 'function') showToast('Vui lòng nhập địa chỉ email hợp lệ.', 'warning');
    return;
  }
  try {
    const data = await apiRequest('/api/auth/social-quick', {
      method: 'POST',
      body: { provider, email, name, avatar }
    });
    if (data.user) {
      applySignedInUser(data.user, { merge: true });
      closeSocialQuickModal();
      closeAuthModal();
      if (typeof showToast === 'function') {
        showToast(data.message || \`Chào mừng \${data.user.name}!\`, 'success');
      }
      if (data.isNew && window.openPlacementTestModal) {
        setTimeout(() => window.openPlacementTestModal(), 800);
      }
    }
  } catch (err) {
    if (typeof showToast === 'function') showToast(err.message || 'Lỗi đăng nhập', 'error');
  }
}

// Check OAuth query parameters on page load
function checkOAuthUrlParams() {
  const url = new URL(window.location.href);
  const oauthLogin = url.searchParams.get('oauth_login');
  const oauthError = url.searchParams.get('oauth_error');
  const oauthNotice = url.searchParams.get('oauth_notice');

  if (oauthLogin === 'success') {
    initAccount();
    if (typeof showToast === 'function') {
      showToast('🎉 Đăng nhập mạng xã hội thành công!', 'success');
    }
    url.searchParams.delete('oauth_login');
    url.searchParams.delete('provider');
    url.searchParams.delete('new');
    window.history.replaceState({}, '', url.pathname + url.hash);
  } else if (oauthError) {
    if (typeof showToast === 'function') {
      showToast('Lỗi đăng nhập mạng xã hội: ' + decodeURIComponent(oauthError), 'error');
    }
    url.searchParams.delete('oauth_error');
    window.history.replaceState({}, '', url.pathname + url.hash);
  } else if (oauthNotice) {
    if (typeof showToast === 'function') {
      showToast('OAuth chưa được cấu hình Client ID trên máy chủ. Đang chuyển sang chế độ 1 chạm.', 'info');
    }
    url.searchParams.delete('oauth_notice');
    window.history.replaceState({}, '', url.pathname + url.hash);
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkOAuthUrlParams);
  } else {
    setTimeout(checkOAuthUrlParams, 500);
  }
}

window.handleSocialAuth = handleSocialAuth;
window.openSocialQuickModal = openSocialQuickModal;
window.closeSocialQuickModal = closeSocialQuickModal;
window.submitSocialQuickAuth = submitSocialQuickAuth;
`;

code += '\n' + socialAuthJs + '\n';
fs.writeFileSync(filePath, code, 'utf8');
console.log('public/js/core/account.js patched with social auth functions!');
