const fs = require('fs');

// 1. UPDATE index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Target the 3 buttons in Header
const headerTarget = `        <!-- Sổ tay từ vựng -->
        <button 
          onclick="openNotebookModal()" 
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF9] hover:bg-amber-50 text-stone-800 border border-amber-200 transition-all shadow-2xs" title="Xem sổ tay từ vựng đã lưu">
          <i data-lucide="bookmark" class="w-3.5 h-3.5 text-amber-700"></i>
          <span>Sổ tay</span>
          <span id="headerNotebookCount" class="px-1.5 py-0.2 rounded-full bg-[#8B1E1E] text-white text-[10px]">0</span>
        </button>

        <!-- Telegram Button -->
        <button 
          onclick="openTelegramModal()" 
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all shadow-2xs">
          <i data-lucide="send" class="w-3.5 h-3.5 text-amber-700"></i>
          <span class="hidden sm:inline">Telegram</span>
        </button>

        <!-- Nút Liên Hệ Hỗ Trợ Zalo / Messenger / Gmail -->
        <button 
          onclick="toggleSupportContactModal()" 
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 hover:from-rose-100 hover:to-amber-100 text-rose-950 border border-rose-300 transition-all shadow-2xs cursor-pointer"
          title="Liên hệ hỗ trợ khi có vấn đề qua Zalo, Messenger, Gmail"
        >
          <div class="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-rose-400">
            <img src="images/support_avatar.png" onerror="this.src='images/support_avatar.svg'" alt="Avt Hỗ Trợ" class="w-full h-full object-cover" />
          </div>
          <span class="hidden sm:inline">Hỗ Trợ</span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>`;

const userAuthHeaderHtml = `        <!-- User Auth & Profile Component (Thay thế cụm nút bằng Tên Người Dùng khi Đăng Nhập) -->
        <div class="relative" id="userAuthContainer">
          <!-- Khi ĐÃ Đăng Nhập: Hiển thị Tên Người Dùng & Avatar -->
          <button 
            id="headerUserBtn"
            onclick="toggleUserDropdown()"
            class="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 hover:from-amber-500/20 hover:to-red-500/20 text-[#8B1E1E] dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 shadow-2xs transition-all cursor-pointer select-none group"
            title="Tài khoản cá nhân: Bấm để xem thông tin, sổ tay & hỗ trợ"
          >
            <div class="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-amber-400 bg-amber-100 dark:bg-stone-800 flex items-center justify-center font-bold text-[10px] text-[#8B1E1E] dark:text-amber-400 shadow-2xs">
              <span id="headerUserInitial">H</span>
            </div>
            <span id="headerUserName" class="max-w-[120px] truncate">Phạm Hoàng</span>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 group-hover:translate-y-0.5 transition-transform"></i>
          </button>

          <!-- Khi CHƯA Đăng Nhập: Hiển thị Nút Đăng Nhập -->
          <button 
            id="headerLoginBtn"
            onclick="openAuthModal()"
            class="hidden items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white shadow-xs transition-all cursor-pointer"
            title="Đăng nhập tài khoản học viên"
          >
            <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
            <span>Đăng nhập</span>
          </button>

          <!-- Dropdown Menu Hồ Sơ Người Dùng -->
          <div 
            id="userDropdownMenu"
            class="hidden absolute right-0 top-full mt-2 w-64 bg-[#FFFDF9] dark:bg-[#161B22] rounded-2xl shadow-2xl border border-amber-300/80 dark:border-amber-500/30 p-2.5 z-50 space-y-2 animate-fade-in text-stone-900 dark:text-stone-100"
          >
            <!-- Thẻ tóm tắt thông tin học viên -->
            <div class="p-2.5 rounded-xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/80 dark:border-stone-700 flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8B1E1E] to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                <span id="dropdownUserInitial">H</span>
              </div>
              <div class="min-w-0 flex-1">
                <p id="dropdownUserName" class="text-xs font-bold truncate text-[#8B1E1E] dark:text-amber-300">Phạm Hoàng</p>
                <p id="dropdownUserEmail" class="text-[11px] text-stone-500 dark:text-stone-400 truncate">hoangpham1618@gmail.com</p>
              </div>
            </div>

            <!-- Các tác vụ nhanh -->
            <div class="space-y-1">
              <button 
                onclick="closeUserDropdown(); openNotebookModal();" 
                class="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-amber-100/70 dark:hover:bg-stone-800 text-xs font-medium text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-2">
                  <i data-lucide="bookmark" class="w-4 h-4 text-amber-700 dark:text-amber-400"></i>
                  <span>Sổ tay từ vựng</span>
                </div>
                <span id="dropdownNotebookCount" class="px-1.5 py-0.2 rounded-full bg-[#8B1E1E] text-white text-[10px] font-bold">0</span>
              </button>

              <button 
                onclick="closeUserDropdown(); toggleSupportContactModal();" 
                class="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-rose-100/70 dark:hover:bg-rose-950/40 text-xs font-medium text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-2">
                  <i data-lucide="headphones" class="w-4 h-4 text-rose-700 dark:text-rose-400"></i>
                  <span>Liên hệ Hỗ Trợ (Zalo/Mess/Gmail)</span>
                </div>
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              </button>

              <button 
                onclick="closeUserDropdown(); openTelegramModal();" 
                class="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-amber-100/70 dark:hover:bg-stone-800 text-xs font-medium text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-2">
                  <i data-lucide="send" class="w-4 h-4 text-amber-700 dark:text-amber-400"></i>
                  <span>Gửi link Telegram</span>
                </div>
              </button>
            </div>

            <div class="h-[1px] bg-amber-200/60 dark:bg-stone-700 my-1"></div>

            <!-- Tùy chọn tài khoản -->
            <div class="space-y-1">
              <button 
                onclick="openEditNameModal();" 
                class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-amber-100/60 dark:hover:bg-stone-800 text-xs text-stone-600 dark:text-stone-400 transition-colors cursor-pointer"
              >
                <i data-lucide="user-pen" class="w-3.5 h-3.5 text-stone-500"></i>
                <span>Đổi tên hiển thị / Tài khoản</span>
              </button>

              <button 
                onclick="handleLogout();" 
                class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-xs text-red-600 dark:text-red-400 font-semibold transition-colors cursor-pointer"
              >
                <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>`;

if (!indexHtml.includes(headerTarget)) {
  console.error('Could not find headerTarget in index.html');
  process.exit(1);
}

indexHtml = indexHtml.replace(headerTarget, userAuthHeaderHtml);

// Add Auth Modal before telegramModal
const authModalHtml = `
  <!-- User Authentication Modal (Đăng Nhập / Đăng Ký Tài Khoản Học Viên) -->
  <div id="authModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
    <div class="bg-[#FFFDF9] dark:bg-[#161B22] w-full max-w-md rounded-2xl border border-amber-300/80 dark:border-amber-500/30 p-6 shadow-2xl relative space-y-5 animate-fade-in text-stone-900 dark:text-stone-100">
      
      <!-- Close button -->
      <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <!-- Modal Header -->
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8B1E1E] to-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
          <i data-lucide="user-check" class="w-6 h-6"></i>
        </div>
        <div>
          <h3 id="authModalTitle" class="text-lg font-serif-luxury font-bold text-stone-900 dark:text-stone-100">Tài Khoản Học Viên</h3>
          <p class="text-xs text-stone-500 dark:text-stone-400">Đồng bộ tiến độ học, từ vựng sổ tay & chuỗi ngày học</p>
        </div>
      </div>

      <!-- Quick 1-Click Demo Login (Phạm Hoàng) -->
      <div class="p-3 rounded-xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/90 dark:border-amber-700/50 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
            <span>✨</span> Đăng nhập nhanh 1-chạm:
          </span>
          <span class="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-bold">Khuyên dùng</span>
        </div>
        <button 
          type="button"
          onclick="quickLoginDemo('Phạm Hoàng', 'hoangpham1618@gmail.com')"
          class="w-full py-2 px-3 rounded-xl bg-white dark:bg-stone-700 hover:bg-amber-100/70 dark:hover:bg-stone-600 border border-amber-300/80 dark:border-stone-600 text-xs font-bold text-[#8B1E1E] dark:text-amber-300 flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
        >
          <div class="flex items-center gap-2 text-left">
            <div class="w-7 h-7 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center font-bold text-xs">
              H
            </div>
            <div>
              <p class="font-bold leading-tight">Phạm Hoàng</p>
              <p class="text-[10px] font-normal text-stone-500 dark:text-stone-400">hoangpham1618@gmail.com</p>
            </div>
          </div>
          <span class="text-xs text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">Vào học →</span>
        </button>
      </div>

      <!-- Form Inputs -->
      <form onsubmit="handleAuthFormSubmit(event)" class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Tên Người Dùng / Họ & Tên</label>
          <div class="relative">
            <i data-lucide="user" class="absolute left-3 top-3 w-4 h-4 text-stone-400"></i>
            <input 
              id="authNameInput" 
              type="text" 
              placeholder="Nhập tên hiển thị (vd: Phạm Hoàng, Nguyễn Văn A...)" 
              required
              class="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]" 
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Email Học Viên</label>
          <div class="relative">
            <i data-lucide="mail" class="absolute left-3 top-3 w-4 h-4 text-stone-400"></i>
            <input 
              id="authEmailInput" 
              type="email" 
              placeholder="ví dụ: hoangpham1618@gmail.com" 
              required
              class="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          class="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] hover:opacity-95 text-white font-bold text-xs transition-all shadow-md shadow-red-950/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <i data-lucide="check-circle" class="w-4 h-4"></i>
          <span>Lưu & Đồng Bộ Tài Khoản</span>
        </button>
      </form>
    </div>
  </div>
`;

indexHtml = indexHtml.replace('  <!-- Telegram Send Modal -->', authModalHtml + '\n  <!-- Telegram Send Modal -->');
fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Successfully updated index.html with user auth component and auth modal!');
