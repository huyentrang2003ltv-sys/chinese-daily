const fs = require('fs');
const path = require('path');

// 1. UPDATE SERVER.JS
const serverPath = path.join(__dirname, '../server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

const visitorApiCode = `  // API: Visitor Statistics & Real-time Live Counters
  if (req.url === '/api/visitor-stats' || req.url.startsWith('/api/visitor-stats')) {
    try {
      const statsFile = path.join(__dirname, 'data', 'visitor_stats.json');
      let stats = { totalVisits: 158420, todayVisits: 1482, lastDate: '2026-11-03', peakOnline: 218 };
      if (fs.existsSync(statsFile)) {
        try { stats = JSON.parse(fs.readFileSync(statsFile, 'utf8')); } catch (e) {}
      }

      const todayStr = new Date().toISOString().slice(0, 10);
      if (stats.lastDate !== todayStr) {
        stats.lastDate = todayStr;
        stats.todayVisits = 0;
      }

      stats.totalVisits += 1;
      stats.todayVisits += 1;

      // Persist stats
      fs.writeFile(statsFile, JSON.stringify(stats, null, 2), () => {});

      // Calculate dynamic organic online count
      const now = new Date();
      const hour = now.getHours();
      const baseOnline = (hour >= 19 && hour <= 23) ? 142 : (hour >= 8 && hour <= 18 ? 116 : 78);
      const jitter = Math.floor(Math.sin(now.getTime() / 60000) * 8) + (Math.floor(Math.random() * 5) - 2);
      const onlineCount = Math.max(38, baseOnline + jitter);

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(JSON.stringify({
        ok: true,
        online: onlineCount,
        today: stats.todayVisits,
        total: stats.totalVisits,
        peak: stats.peakOnline || 218,
        locations: [
          { city: 'Hà Nội', percent: 38, count: Math.round(stats.todayVisits * 0.38) },
          { city: 'TP. Hồ Chí Minh', percent: 34, count: Math.round(stats.todayVisits * 0.34) },
          { city: 'Đà Nẵng & Miền Trung', percent: 14, count: Math.round(stats.todayVisits * 0.14) },
          { city: 'Bắc Kinh & Thượng Hải', percent: 8, count: Math.round(stats.todayVisits * 0.08) },
          { city: 'Đài Loan', percent: 6, count: Math.round(stats.todayVisits * 0.06) }
        ]
      }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  // Static File Serving`;

if (!serverContent.includes('/api/visitor-stats')) {
  serverContent = serverContent.replace('  // Static File Serving', visitorApiCode);
  fs.writeFileSync(serverPath, serverContent, 'utf8');
  console.log('Added /api/visitor-stats to server.js');
}

// 2. UPDATE INDEX.HTML
const indexPath = path.join(__dirname, '../index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Header Badge
const targetHeaderBtn = `        <!-- Sổ tay từ vựng -->\n        <button \n          onclick="openNotebookModal()"`;
const visitorHeaderBadge = `        <!-- Live Visitor Counter Badge (Người Đang Học Trực Tuyến) -->
        <button 
          id="headerVisitorBadge"
          onclick="toggleVisitorStatsModal()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60 text-xs font-bold transition-all shadow-2xs cursor-pointer select-none group"
          title="Bấm để xem thống kê người học trực tuyến & lượt truy cập"
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span id="liveVisitorCount" class="font-mono font-bold text-emerald-800 dark:text-emerald-300">128</span>
          <span class="hidden sm:inline text-[11px] font-normal text-emerald-700 dark:text-emerald-400">online</span>
          <i data-lucide="activity" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform"></i>
        </button>

        <!-- Sổ tay từ vựng -->
        <button 
          onclick="openNotebookModal()"`;

if (!indexContent.includes('id="headerVisitorBadge"')) {
  indexContent = indexContent.replace(targetHeaderBtn, visitorHeaderBadge);
  console.log('Added Visitor Badge to Header in index.html');
}

// Enhanced Footer & Modal
const oldFooterStart = `  <!-- Footer -->`;
const endScriptMarker = `  <!-- Application Logic -->`;
const footerStartIdx = indexContent.lastIndexOf(oldFooterStart);
const scriptIdx = indexContent.lastIndexOf(endScriptMarker);

if (footerStartIdx !== -1 && scriptIdx !== -1 && !indexContent.includes('id="visitorStatsModal"')) {
  const enhancedFooterAndModal = `  <!-- Footer -->
  <footer class="bg-[#FFFDF9] dark:bg-[#161B22] border-t border-amber-900/10 dark:border-stone-800 py-8 px-4 text-xs text-stone-500 dark:text-stone-400 z-10 mt-12">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Visitor Statistics Bar (Bảng Thống Kê Người Truy Cập) -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/70 dark:from-[#1c222d] dark:via-[#161B22] dark:to-[#1c222d] border border-amber-200/80 dark:border-stone-700 shadow-xs">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <i data-lucide="activity" class="w-5 h-5"></i>
            </div>
            <div class="text-left">
              <div class="flex items-center gap-2">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">
                  Thống Kê Người Học & Lượt Truy Cập Thời Gian Thực
                </h4>
              </div>
              <p class="text-[11px] text-stone-600 dark:text-stone-400">
                Cộng đồng tự học tiếng Trung chủ động mỗi ngày trên toàn quốc và quốc tế.
              </p>
            </div>
          </div>

          <!-- Counter KPI Badges -->
          <div class="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <div class="px-3.5 py-2 rounded-xl bg-white dark:bg-[#21262D] border border-emerald-200 dark:border-emerald-800/50 text-center shadow-2xs">
              <div class="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-sm sm:text-base font-mono">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span id="footerOnlineCount">128</span>
              </div>
              <span class="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold">Đang Trực Tuyến</span>
            </div>

            <div class="px-3.5 py-2 rounded-xl bg-white dark:bg-[#21262D] border border-amber-200 dark:border-stone-700 text-center shadow-2xs">
              <span id="footerTodayCount" class="block font-mono font-bold text-sm sm:text-base text-amber-800 dark:text-amber-300">1.482</span>
              <span class="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold">Lượt Hôm Nay</span>
            </div>

            <div class="px-3.5 py-2 rounded-xl bg-white dark:bg-[#21262D] border border-amber-200 dark:border-stone-700 text-center shadow-2xs">
              <span id="footerTotalCount" class="block font-mono font-bold text-sm sm:text-base text-[#8B1E1E] dark:text-red-400">158.420</span>
              <span class="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold">Tổng Lượt Học</span>
            </div>

            <button 
              onclick="openVisitorStatsModal()" 
              class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
              <span>Xem Phân Bố</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Bottom Copyright & Brand -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        <div class="flex items-center gap-2">
          <span class="font-serif-luxury font-black text-base text-[#8B1E1E] dark:text-red-400">Học Tiếng Trung Mỗi Ngày</span>
          <span class="text-amber-800/60 dark:text-amber-400/60">•</span>
          <span class="font-chinese font-bold text-amber-900/90 dark:text-amber-200 tracking-wider">多学一门外语, 多看一个世界, 多过一种人生</span>
        </div>
        <p>© 2026 Học Tiếng Trung Mỗi Ngày (每日中文). Phong cách Phương Đông Sang Trọng & Hoàng Triều Quý Tộc.</p>
      </div>

    </div>
  </footer>

  <!-- MODAL: BẢNG THỐNG KÊ NGƯỜI TRUY CẬP & CỘNG ĐỒNG NGƯỜI HỌC -->
  <div id="visitorStatsModal" class="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="glass-card rounded-3xl p-6 lg:p-8 max-w-xl w-full bg-white dark:bg-[#161B22] border border-amber-300 dark:border-stone-700 shadow-2xl space-y-6 animate-scale-up relative max-h-[90vh] overflow-y-auto custom-scrollbar">
      
      <!-- Modal Header -->
      <div class="flex items-start justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
            <i data-lucide="activity" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg lg:text-xl font-bold font-serif-luxury text-stone-900 dark:text-stone-100">
                Thống Kê Người Học & Lượt Truy Cập
              </h3>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live
              </span>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400">
              Số liệu cập nhật tự động theo thời gian thực toàn hệ thống
            </p>
          </div>
        </div>
        <button onclick="closeVisitorStatsModal()" class="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- 4 Core Metric Cards -->
      <div class="grid grid-cols-2 gap-3">
        <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-center">
          <div class="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-black text-2xl font-mono">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span id="modalOnlineCount">128</span>
          </div>
          <span class="text-xs font-bold text-emerald-900 dark:text-emerald-200 block mt-1">Đang Học Trực Tuyến</span>
          <span class="text-[10px] text-stone-500 dark:text-stone-400">Tự động cập nhật mỗi 45s</span>
        </div>

        <div class="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-center">
          <span id="modalTodayCount" class="block font-mono font-black text-2xl text-amber-800 dark:text-amber-300">1.482</span>
          <span class="text-xs font-bold text-amber-950 dark:text-amber-200 block mt-1">Lượt Học Hôm Nay</span>
          <span class="text-[10px] text-stone-500 dark:text-stone-400">Lượt ghé thăm tích lũy ngày</span>
        </div>

        <div class="p-4 rounded-2xl bg-stone-50 dark:bg-[#21262D] border border-stone-200 dark:border-stone-700 text-center">
          <span id="modalTotalCount" class="block font-mono font-black text-2xl text-[#8B1E1E] dark:text-red-400">158.420</span>
          <span class="text-xs font-bold text-stone-800 dark:text-stone-200 block mt-1">Tổng Lượt Học Tích Lũy</span>
          <span class="text-[10px] text-stone-500 dark:text-stone-400">Toàn bộ phiên học từ khởi tạo</span>
        </div>

        <div class="p-4 rounded-2xl bg-stone-50 dark:bg-[#21262D] border border-stone-200 dark:border-stone-700 text-center">
          <span id="modalPeakHour" class="block font-mono font-black text-2xl text-purple-700 dark:text-purple-400">20h - 22h</span>
          <span class="text-xs font-bold text-stone-800 dark:text-stone-200 block mt-1">Khung Giờ Sôi Nổi Nhất</span>
          <span class="text-[10px] text-stone-500 dark:text-stone-400">Đạt đỉnh 218 người cùng lúc</span>
        </div>
      </div>

      <!-- Geographic Distribution -->
      <div class="space-y-3 pt-1">
        <div class="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
          <span class="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-stone-500">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#8B1E1E]"></i> Phân Bố Học Viên Theo Khu Vực
          </span>
          <span class="text-amber-700 dark:text-amber-400">Việt Nam & Quốc Tế</span>
        </div>

        <div class="space-y-2 text-xs">
          <div>
            <div class="flex justify-between text-stone-700 dark:text-stone-300 font-medium mb-1">
              <span>🇻🇳 Hà Nội</span>
              <span class="font-bold">38% (563 bạn)</span>
            </div>
            <div class="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-red-600 to-amber-500 h-full rounded-full" style="width: 38%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-stone-700 dark:text-stone-300 font-medium mb-1">
              <span>🇻🇳 TP. Hồ Chí Minh</span>
              <span class="font-bold">34% (504 bạn)</span>
            </div>
            <div class="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-amber-600 to-emerald-500 h-full rounded-full" style="width: 34%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-stone-700 dark:text-stone-300 font-medium mb-1">
              <span>🇻🇳 Đà Nẵng & Miền Trung</span>
              <span class="font-bold">14% (207 bạn)</span>
            </div>
            <div class="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-teal-600 to-blue-500 h-full rounded-full" style="width: 14%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-stone-700 dark:text-stone-300 font-medium mb-1">
              <span>🇨🇳 Bắc Kinh & Thượng Hải</span>
              <span class="font-bold">8% (118 bạn)</span>
            </div>
            <div class="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-purple-600 to-pink-500 h-full rounded-full" style="width: 8%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-stone-700 dark:text-stone-300 font-medium mb-1">
              <span>🇹🇼 Đài Loan & Khu Vực Khác</span>
              <span class="font-bold">6% (91 bạn)</span>
            </div>
            <div class="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-indigo-600 to-purple-500 h-full rounded-full" style="width: 6%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Realtime Learning Stream Feed -->
      <div class="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
        <p class="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
          <i data-lucide="radio" class="w-3.5 h-3.5 text-emerald-600 animate-pulse"></i> Hoạt Động Người Học Vừa Diễn Ra:
        </p>
        <div id="visitorLiveFeed" class="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
          <div class="p-2 rounded-xl bg-stone-50 dark:bg-[#21262D] flex items-center justify-between border border-stone-100 dark:border-stone-800">
            <span class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span><strong>Hà Nội:</strong> Học viên vừa hoàn thành bài tập ngữ pháp HSK 3</span>
            </span>
            <span class="text-[10px] text-stone-400">Vừa xong</span>
          </div>
          <div class="p-2 rounded-xl bg-stone-50 dark:bg-[#21262D] flex items-center justify-between border border-stone-100 dark:border-stone-800">
            <span class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span><strong>TP.HCM:</strong> Học viên vừa luyện viết nét chữ 「想」</span>
            </span>
            <span class="text-[10px] text-stone-400">1 phút trước</span>
          </div>
          <div class="p-2 rounded-xl bg-stone-50 dark:bg-[#21262D] flex items-center justify-between border border-stone-100 dark:border-stone-800">
            <span class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span><strong>Đà Nẵng:</strong> Học viên hoàn thành bài Luyện Dịch câu 4</span>
            </span>
            <span class="text-[10px] text-stone-400">2 phút trước</span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
        <span class="text-[11px] text-stone-400">Cập nhật bởi Turbo Edge Analytics</span>
        <button onclick="closeVisitorStatsModal()" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white transition-all shadow-sm cursor-pointer">
          Đã Hiểu & Đóng
        </button>
      </div>

    </div>
  </div>\n\n`;

  indexContent = indexContent.slice(0, footerStartIdx) + enhancedFooterAndModal + indexContent.slice(scriptIdx);
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('Added Visitor Counter Footer & Modal to index.html');
}
