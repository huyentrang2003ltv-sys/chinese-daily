const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const targetStr = `      <!-- Quick Character Selector Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2">
        <span class="text-xs text-slate-500 font-semibold whitespace-nowrap">Chọn chữ phân tích:</span>
        <div id="characterPills" class="flex items-center gap-2"></div>
      </div>`;

const replacementStr = `      <!-- Search & Discovery Bar for Chiết Tự & Gốc Từ -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-50/90 via-[#FAF7F2] to-white dark:from-[#161B22] dark:via-[#1c222d] dark:to-[#161B22] border border-amber-300/80 dark:border-stone-700 shadow-sm relative">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div class="relative flex-1">
            <i data-lucide="search" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500"></i>
            <input 
              type="text" 
              id="etymologySearchInput"
              oninput="handleEtymologySearch(this.value)"
              onkeydown="handleEtymologySearchKeyDown(event)"
              placeholder="Tra cứu chiết tự, phân rã chữ Hán (nhập Hán tự: 想, 学, 爱... Pinyin: xiang, xue... Hán Việt: tưởng, học, ái... hoặc nghĩa)..." 
              class="w-full pl-10 pr-20 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#0D1117] text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-900/30 transition-all placeholder:text-stone-400"
            />
            <button 
              id="clearEtymologySearchBtn"
              onclick="clearEtymologySearch()"
              class="hidden absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-xs font-bold text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
            >
              ✕ Xóa
            </button>
          </div>
          
          <div class="flex items-center gap-2 shrink-0 text-xs font-bold text-stone-600 dark:text-stone-400">
            <span id="etymologyMatchBadge" class="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-[#8B1E1E] dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
              Kho chiết tự: <strong id="etymologyCountNum">531</strong> chữ
            </span>
          </div>
        </div>

        <!-- Dynamic Instant Search Suggestions Grid -->
        <div id="etymologySearchResults" class="hidden mt-3 pt-3 border-t border-amber-200/60 dark:border-stone-700/60">
          <div class="flex items-center justify-between mb-2">
            <p class="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Kết quả tra cứu chiết tự phù hợp:
            </p>
            <span id="etymologyResultsCountText" class="text-[11px] text-amber-700 dark:text-amber-400 font-bold"></span>
          </div>
          <div id="etymologyResultsList" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-64 overflow-y-auto custom-scrollbar p-1"></div>
        </div>
      </div>

      <!-- Quick Character Selector Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <span class="text-xs text-stone-500 dark:text-stone-400 font-semibold whitespace-nowrap">Chọn chữ phân tích:</span>
        <div id="characterPills" class="flex items-center gap-2"></div>
      </div>`;

if (content.includes('id="characterPills"')) {
  // Check if search bar already exists
  if (!content.includes('id="etymologySearchInput"')) {
    // Replace around characterPills
    const startPill = content.indexOf('<!-- Quick Character Selector Pills -->');
    const endPill = content.indexOf('<!-- Active Etymology Detail View -->');
    if (startPill !== -1 && endPill !== -1) {
      content = content.slice(0, startPill) + replacementStr + '\n\n      ' + content.slice(endPill);
      console.log('Successfully inserted Etymology Search Bar into index.html');
      fs.writeFileSync(indexPath, content, 'utf8');
    }
  } else {
    console.log('Etymology Search Bar already present');
  }
} else {
  console.error('Could not find characterPills in index.html');
}
