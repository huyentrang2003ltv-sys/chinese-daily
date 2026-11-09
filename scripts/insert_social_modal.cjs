const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, '../public/index.html');
let code = fs.readFileSync(indexPath, 'utf8');

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

if (!code.includes('id="socialAuthQuickModal"')) {
  code = code.replace(
    '<!-- ==================== SUPER ADMIN DASHBOARD MODAL ==================== -->',
    socialQuickModalHtml + '\n  <!-- ==================== SUPER ADMIN DASHBOARD MODAL ==================== -->'
  );
  fs.writeFileSync(indexPath, code, 'utf8');
  console.log('Successfully inserted socialAuthQuickModal into public/index.html');
} else {
  console.log('socialAuthQuickModal already present');
}
