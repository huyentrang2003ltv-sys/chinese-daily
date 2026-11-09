const fs = require('fs');
const path = require('path');

// 1. Patch public/index.html
const indexPath = path.join(__dirname, '../public/index.html');
let indexCode = fs.readFileSync(indexPath, 'utf8');

// Fix Facebook buttons with inline style
indexCode = indexCode.replace(
  /class="w-full py-2\.5 px-4 rounded-2xl bg-\[#1877F2\] hover:bg-\[#166fe5\] text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer group"/g,
  'style="background-color: #1877F2 !important;" class="w-full py-2.5 px-4 rounded-2xl hover:brightness-105 text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer group"'
);

// Fix Tab Navigation Bar in hsk30LessonDetailModal
const oldTabBar = `      <!-- Tab Navigation -->
      <div class="shrink-0 min-h-[48px] h-12 border-b border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-stone-900 flex items-center overflow-x-auto custom-scrollbar px-3 z-10">
        <button id="hsk30TabBtn-dialogues" onclick="switchHsk30LessonTab('dialogues')" class="h-12 px-4 py-2 text-xs font-bold border-b-2 border-[#8B1E1E] dark:border-amber-400 text-[#8B1E1E] dark:text-amber-400 whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
          <span>💬 Hội Thoại & Bài Đọc</span>
        </button>
        <button id="hsk30TabBtn-vocabulary" onclick="switchHsk30LessonTab('vocabulary')" class="h-12 px-4 py-2 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
          <span>📖 Từ Vựng Trọng Tâm</span>
        </button>
        <button id="hsk30TabBtn-grammar" onclick="switchHsk30LessonTab('grammar')" class="h-12 px-4 py-2 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="compass" class="w-3.5 h-3.5"></i>
          <span>🎯 Trọng Điểm Ngữ Pháp</span>
        </button>
        <button id="hsk30TabBtn-culture" onclick="switchHsk30LessonTab('culture')" class="h-12 px-4 py-2 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="lightbulb" class="w-3.5 h-3.5"></i>
          <span>💡 Văn Hóa & Mẹo HSK 3.0</span>
        </button>
        <button id="hsk30TabBtn-practice" onclick="switchHsk30LessonTab('practice')" class="h-12 px-4 py-2 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
          <span>✍️ Luyện Tập Củng Cố</span>
        </button>
      </div>`;

const newTabBar = `      <!-- Tab Navigation -->
      <div class="shrink-0 min-h-[50px] h-[50px] border-b border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-stone-900 flex items-center overflow-x-auto no-scrollbar px-3 z-10">
        <button id="hsk30TabBtn-dialogues" onclick="switchHsk30LessonTab('dialogues')" class="h-full px-4 text-xs font-bold border-b-2 border-[#8B1E1E] dark:border-amber-400 text-[#8B1E1E] dark:text-amber-400 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer">
          <i data-lucide="message-square" class="w-4 h-4"></i>
          <span>Hội Thoại & Bài Đọc</span>
        </button>
        <button id="hsk30TabBtn-vocabulary" onclick="switchHsk30LessonTab('vocabulary')" class="h-full px-4 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer">
          <i data-lucide="book-open" class="w-4 h-4"></i>
          <span>Từ Vựng Trọng Tâm</span>
        </button>
        <button id="hsk30TabBtn-grammar" onclick="switchHsk30LessonTab('grammar')" class="h-full px-4 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer">
          <i data-lucide="compass" class="w-4 h-4"></i>
          <span>Trọng Điểm Ngữ Pháp</span>
        </button>
        <button id="hsk30TabBtn-culture" onclick="switchHsk30LessonTab('culture')" class="h-full px-4 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer">
          <i data-lucide="lightbulb" class="w-4 h-4"></i>
          <span>Văn Hóa & Mẹo HSK</span>
        </button>
        <button id="hsk30TabBtn-practice" onclick="switchHsk30LessonTab('practice')" class="h-full px-4 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer">
          <i data-lucide="pencil" class="w-4 h-4"></i>
          <span>Luyện Tập Củng Cố</span>
        </button>
      </div>`;

if (indexCode.includes(oldTabBar)) {
  indexCode = indexCode.replace(oldTabBar, newTabBar);
  console.log('Replaced TabBar in public/index.html');
} else {
  console.log('oldTabBar not matched in public/index.html');
}

fs.writeFileSync(indexPath, indexCode, 'utf8');

// 2. Patch public/js/features/pathway.js
const pathwayPath = path.join(__dirname, '../public/js/features/pathway.js');
let pathwayCode = fs.readFileSync(pathwayPath, 'utf8');

pathwayCode = pathwayCode.replace(
  `btn.className = 'h-12 px-4 py-2 text-xs font-bold border-b-2 border-[#8B1E1E] dark:border-amber-400 text-[#8B1E1E] dark:text-amber-400 whitespace-nowrap flex items-center gap-1.5 cursor-pointer';`,
  `btn.className = 'h-full px-4 text-xs font-bold border-b-2 border-[#8B1E1E] dark:border-amber-400 text-[#8B1E1E] dark:text-amber-400 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer';`
);

pathwayCode = pathwayCode.replace(
  `btn.className = 'h-12 px-4 py-2 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer';`,
  `btn.className = 'h-full px-4 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer';`
);

fs.writeFileSync(pathwayPath, pathwayCode, 'utf8');
console.log('Patched public/js/features/pathway.js');
