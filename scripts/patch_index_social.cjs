const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/index.html');
let code = fs.readFileSync(filePath, 'utf8');

const socialLoginButtonsHtml = `
          <!-- One-Click Social Auth (Google / Facebook) -->
          <div class="space-y-2">
            <button 
              type="button" 
              onclick="handleSocialAuth('google')" 
              class="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 font-bold text-xs border-2 border-stone-200 dark:border-stone-700 hover:border-amber-400 shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span class="group-hover:translate-x-0.5 transition-transform">Đăng nhập nhanh bằng Google (Gmail)</span>
            </button>

            <button 
              type="button" 
              onclick="handleSocialAuth('facebook')" 
              class="w-full py-2.5 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="group-hover:translate-x-0.5 transition-transform">Đăng nhập bằng Facebook</span>
            </button>
          </div>

          <!-- Divider -->
          <div class="flex items-center gap-3 my-2">
            <div class="flex-1 h-px bg-stone-200 dark:bg-stone-700"></div>
            <span class="text-[10px] uppercase font-bold text-stone-400 tracking-wider">hoặc nhập email thủ công</span>
            <div class="flex-1 h-px bg-stone-200 dark:bg-stone-700"></div>
          </div>
`;

const socialRegisterButtonsHtml = `
          <!-- One-Click Social Register (Google / Facebook) -->
          <div class="space-y-2">
            <button 
              type="button" 
              onclick="handleSocialAuth('google')" 
              class="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 font-bold text-xs border-2 border-stone-200 dark:border-stone-700 hover:border-amber-400 shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span class="group-hover:translate-x-0.5 transition-transform">Đăng ký nhanh 1 chạm bằng Google</span>
            </button>

            <button 
              type="button" 
              onclick="handleSocialAuth('facebook')" 
              class="w-full py-2.5 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="group-hover:translate-x-0.5 transition-transform">Đăng ký bằng Facebook</span>
            </button>
          </div>

          <!-- Divider -->
          <div class="flex items-center gap-3 my-2">
            <div class="flex-1 h-px bg-stone-200 dark:bg-stone-700"></div>
            <span class="text-[10px] uppercase font-bold text-stone-400 tracking-wider">hoặc điền biểu mẫu thủ công</span>
            <div class="flex-1 h-px bg-stone-200 dark:bg-stone-700"></div>
          </div>
`;

// Insert into authLoginView
code = code.replace(
  '<div id="authLoginView" class="space-y-4">',
  '<div id="authLoginView" class="space-y-4">\n' + socialLoginButtonsHtml
);

// Insert into authRegisterView
code = code.replace(
  '<form onsubmit="handleAuthRegisterSubmit(event)"',
  socialRegisterButtonsHtml + '\n          <form onsubmit="handleAuthRegisterSubmit(event)"'
);

const socialQuickModalHtml = `
  <!-- ==================== QUICK SOCIAL AUTH MODAL (1-CHẠM GMAIL & FACEBOOK) ==================== -->
  <div id="socialAuthQuickModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
    <div class="bg-[#FFFDF9] dark:bg-[#161B22] w-full max-w-sm rounded-3xl border-2 border-amber-300/90 dark:border-amber-500/40 p-6 shadow-2xl relative flex flex-col space-y-4 text-stone-900 dark:text-stone-100">
      
      <!-- Close button -->
      <button onclick="closeSocialQuickModal()" class="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="flex items-center gap-3">
        <div id="socialQuickModalIcon" class="w-12 h-12 rounded-2xl bg-white shadow-md border border-stone-200 flex items-center justify-center shrink-0"></div>
        <div>
          <h3 id="socialQuickModalTitle" class="text-base font-bold text-stone-900 dark:text-stone-100">
            Đăng Nhập Với Google
          </h3>
          <p class="text-2xs text-stone-500">1 chạm vào học ngay, không cần mật khẩu</p>
        </div>
      </div>

      <!-- Quick 1-Click Accounts List -->
      <div id="socialQuickAccountsList" class="space-y-2 text-xs"></div>

      <div class="pt-2 text-center text-2xs text-stone-400 border-t border-stone-100 dark:border-stone-800">
        Tài khoản mới sẽ được tự động cộng <strong>+50 EXP</strong> & <strong>7 ngày VIP dùng thử</strong>.
      </div>
    </div>
  </div>
`;

// Insert socialQuickModalHtml after authModal closing tag
code = code.replace(
  '  <!-- ==================== NOTEBOOK MODAL (SỔ TAY TỪ VỰNG & SRS ÔN TẬP) ==================== -->',
  socialQuickModalHtml + '\n  <!-- ==================== NOTEBOOK MODAL (SỔ TAY TỪ VỰNG & SRS ÔN TẬP) ==================== -->'
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('public/index.html patched with Social Auth buttons & modal successfully!');
