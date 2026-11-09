// Module state
let currentHskLevel = 1;
let currentPathwayLessonsTab = 'standard48'; // 'standard48' or 'all1040'
let currentExamMatrixLevel = 'HSK 1';
let currentHsk30CourseFilter = 0; // 0: all, 1: HSK 1, 2: HSK 2, 3: HSK 3
let currentHsk30SearchQuery = '';
let pathwayLessonsBatchSize = 10;
let currentPathwaySubTab = 'stages';
let currentPathwayGrammarLevel = 'HSK 1';
let pathwayLessonsRendered = 0;

// ---------------- TAB 4: LỘ TRÌNH HSK 3.0 TOÀN DIỆN (3 CẤP 9 BẬC) ----------------

function switchPathwaySubTab(subTab) {
  currentPathwaySubTab = subTab;
  const tabs = ['stages', 'standards', 'grammar', 'translation', 'lessons', 'resources'];
  tabs.forEach(tab => {
    const btn = document.getElementById(`btn-pathway-sub-${tab}`);
    if (!btn) return;
    if (tab === subTab) {
      btn.className = 'pathway-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm flex items-center gap-1.5 cursor-pointer border border-transparent';
    } else {
      btn.className = 'pathway-sub-btn px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 cursor-pointer';
    }
  });
  renderPathwayTab();
}

async function renderPathwayTab() {
  const container = document.getElementById('pathwayDynamicContent');
  if (!container) return;

  if (!hsk30RoadmapData) await loadData('hsk30Roadmap');

  if (!hsk30RoadmapData) {
    container.innerHTML = `
      <div class="glass-card rounded-2xl p-8 text-center text-stone-500">
        <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto mb-3 text-amber-600"></i>
        <p>Đang tải dữ liệu Lộ Trình HSK 3.0...</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  switch (currentPathwaySubTab) {
    case 'stages':
      renderPathwayStages(container);
      break;
    case 'standards':
      renderPathwayStandards(container);
      break;
    case 'grammar':
      renderPathwayGrammar(container);
      break;
    case 'translation':
      renderPathwayTranslation(container);
      break;
    case 'lessons':
      renderPathwayLessonsView(container);
      break;
    case 'resources':
      renderPathwayResources(container);
      break;
    default:
      renderPathwayStages(container);
  }
  refreshIcons();
}

function goToPathwayLevel(lvl) {
  currentHskLevel = lvl;
  switchPathwaySubTab('lessons');
}

function renderPathwayStages(container) {
  const data = hsk30RoadmapData;
  const stages = data.stages || [];

  let html = `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-[#FAF7F2] to-amber-50/50 dark:from-[#1c222d] dark:via-[#161B22] dark:to-[#1c222d] border border-amber-300/80 dark:border-stone-700 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            <i data-lucide="compass" class="w-6 h-6"></i>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">Lộ Trình Tự Học 6 Giai Đoạn HSK 3.0 (Từ Con Số 0 Đến HSK 6 & 7–9)</h3>
            <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Phân kỳ khoa học theo phương pháp Tiếng Trung Thượng Hải: Thời lượng rõ ràng, giáo trình bám sát mục tiêu và quy tắc cuốn chiếu nhớ lâu.
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
  `;

  stages.forEach(st => {
    let actionBtnHtml = '';
    if (st.stageNumber === 1 || st.stageNumber === 2) {
      actionBtnHtml = `
        <button onclick="goToPathwayLevel(1)" class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
          <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
          <span>Học Ngay Bài Học ${st.targetLevel}</span>
        </button>
      `;
    } else {
      actionBtnHtml = `
        <button onclick="switchTab('flashcards')" class="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer">
          <i data-lucide="layers" class="w-3.5 h-3.5 text-amber-600"></i>
          <span>Luyện Từ Vựng Flashcard</span>
        </button>
      `;
    }

    html += `
      <div class="glass-card rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-[#8B1E1E] dark:text-amber-400 border border-amber-300 dark:border-amber-700">
              Giai Đoạn ${st.stageNumber}
            </span>
            <span class="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
              ${st.duration}
            </span>
          </div>

          <div>
            <h4 class="text-base font-bold font-serif-luxury text-stone-900 dark:text-stone-100">
              ${st.title}
            </h4>
            <div class="flex items-center gap-2 mt-1 flex-wrap text-2xs text-stone-500 dark:text-stone-400">
              <span class="font-bold text-[#8B1E1E] dark:text-red-400">Mục tiêu: ${st.targetLevel}</span>
              <span>•</span>
              <span>Từ vựng: ${st.targetWords}</span>
              <span>•</span>
              <span>Thời gian: ${st.dailyTime}</span>
            </div>
          </div>

          ${st.coreBook ? `
            <div class="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/70 border border-amber-200/80 dark:border-stone-700 text-xs space-y-1">
              <span class="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1 text-[11px]">
                <i data-lucide="book" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
                <span>Giáo trình khuyến nghị:</span>
              </span>
              <p class="text-stone-700 dark:text-stone-300 font-medium text-[11px]">${st.coreBook}</p>
              ${st.lessonsCount ? `<p class="text-stone-500 dark:text-stone-400 text-[10px]">Quy mô: ${st.lessonsCount}</p>` : ''}
            </div>
          ` : ''}

          <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 text-xs space-y-1.5">
            <span class="font-bold text-stone-700 dark:text-stone-300 text-[11px] flex items-center gap-1">
              <i data-lucide="clock" class="w-3 h-3 text-amber-600"></i>
              <span>Lịch biểu tự học mỗi ngày:</span>
            </span>
            <div class="grid grid-cols-3 gap-1.5 text-center text-[10px] text-stone-600 dark:text-stone-400 pt-0.5">
              <div class="p-1 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span class="font-bold block text-stone-800 dark:text-stone-200">Sáng (30p)</span>
                <span>Từ mới & phát âm</span>
              </div>
              <div class="p-1 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span class="font-bold block text-stone-800 dark:text-stone-200">Trưa (15p)</span>
                <span>Ôn thẻ Flashcard</span>
              </div>
              <div class="p-1 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span class="font-bold block text-stone-800 dark:text-stone-200">Tối (45p)</span>
                <span>Làm bài & luyện dịch</span>
              </div>
            </div>
          </div>

          <div class="text-2xs text-stone-500 dark:text-stone-400 border-l-2 border-emerald-500 pl-2 py-0.5">
            <strong>Cột mốc kiểm tra:</strong> ${st.milestone}
          </div>
        </div>

        ${actionBtnHtml}
      </div>
    `;
  });

  html += `
      </div>

      <!-- Expert Strategy Box -->
      <div class="glass-card rounded-2xl p-6 bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/60 dark:from-[#16221c] dark:via-[#161B22] dark:to-[#16221c] border border-emerald-200 dark:border-emerald-800/60 shadow-xs space-y-3">
        <div class="flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
          <i data-lucide="shield-check" class="w-5 h-5 text-emerald-600"></i>
          <h4 class="text-sm font-bold font-serif-luxury">Bí Kíp Tự Học "Quy Tắc Cuốn Chiếu 5 Bước" (Tiếng Trung Thượng Hải)</h4>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs text-stone-700 dark:text-stone-300">
          <div class="p-3 rounded-xl bg-white/90 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">1</span>
            <p class="font-bold text-stone-900 dark:text-stone-100">Chiết Tự 214 Bộ</p>
            <p class="text-[11px] text-stone-500 leading-relaxed">Hiểu ý nghĩa từng bộ thủ thay vì học vẹt từng nét chữ Hán.</p>
          </div>
          <div class="p-3 rounded-xl bg-white/90 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">2</span>
            <p class="font-bold text-stone-900 dark:text-stone-100">Từ Vựng Theo Cụm</p>
            <p class="text-[11px] text-stone-500 leading-relaxed">Học cả cụm Động-Tân (ngồi xe, đặt đồ ăn) thay vì học từ đơn lẻ.</p>
          </div>
          <div class="p-3 rounded-xl bg-white/90 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">3</span>
            <p class="font-bold text-stone-900 dark:text-stone-100">Toán Học Ngữ Pháp</p>
            <p class="text-[11px] text-stone-500 leading-relaxed">Ghi nhớ công thức nòng cốt S + Trạng ngữ + V + Bổ ngữ + Tân ngữ.</p>
          </div>
          <div class="p-3 rounded-xl bg-white/90 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">4</span>
            <p class="font-bold text-stone-900 dark:text-stone-100">Luyện Dịch Hai Chiều</p>
            <p class="text-[11px] text-stone-500 leading-relaxed">Thực hành dịch Trung-Việt và Việt-Trung ngay từ sơ cấp.</p>
          </div>
          <div class="p-3 rounded-xl bg-white/90 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">5</span>
            <p class="font-bold text-stone-900 dark:text-stone-100">Shadowing Bản Xứ</p>
            <p class="text-[11px] text-stone-500 leading-relaxed">Bật audio Bắc Kinh, nhắc lại ngay lập tức để rèn ngữ điệu.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function renderPathwayStandards(container) {
  const data = hsk30RoadmapData;
  const rows = data.standardsTable || [];
  const matrix = data.examMatrix || { levels: [] };
  const comparison = data.textbookComparison || { books: [] };

  let html = `
    <div class="space-y-8">
      <!-- Philosophy Banner -->
      <div class="glass-card rounded-2xl p-6 bg-gradient-to-r from-amber-50/80 to-white dark:from-[#161B22] dark:to-[#1c222d] border border-amber-300/80 dark:border-stone-700 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-[#8B1E1E] dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
            <i data-lucide="scale" class="w-5 h-5"></i>
          </div>
          <div class="space-y-1.5">
            <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">Triết Lý Cải Cách HSK 3.0: Từ "Hiểu Thụ Động" Sang "Ứng Dụng Đa Chiều & Dịch Thuật"</h3>
            <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              HSK 3.0 chuyển từ cấu trúc 6 cấp truyền thống sang <strong>3 Cấp 9 Bậc</strong> (Sơ cấp 1–3, Trung cấp 4–6, Cao cấp 7–9). Khung chuẩn mới nâng tổng từ vựng lên <strong>11.092 từ</strong>, yêu cầu <strong>3.000 chữ Hán viết tay</strong> (nhận diện nét bút thuận, tránh lạm dụng gõ pinyin) và bổ sung kỹ năng <strong>Dịch thuật hai chiều</strong> từ HSK 4 trở lên.
            </p>
          </div>
        </div>
      </div>

      <!-- Standards Table -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-2">
            <i data-lucide="table-2" class="w-4 h-4 text-[#8B1E1E]"></i>
            <span>1. Bảng Tiêu Chuẩn Định Lượng 3 Cấp 9 Bậc HSK 3.0 (Hanban / CTI)</span>
          </h4>
          <span class="text-2xs text-stone-500 font-medium">Đối chiếu CEFR Khung Châu Âu</span>
        </div>

        <div class="glass-card rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm bg-white dark:bg-[#161B22]">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-amber-100/70 dark:bg-[#21262D] text-stone-900 dark:text-stone-100 font-bold border-b border-amber-200 dark:border-stone-700">
                  <th class="p-3.5 whitespace-nowrap">Cấp Độ</th>
                  <th class="p-3.5 whitespace-nowrap">Bậc Năng Lực</th>
                  <th class="p-3.5 whitespace-nowrap text-stone-400">Từ Vựng HSK 2.0</th>
                  <th class="p-3.5 whitespace-nowrap text-[#8B1E1E] dark:text-amber-400 font-black">Từ Vựng HSK 3.0</th>
                  <th class="p-3.5 whitespace-nowrap">Chữ Viết Tay</th>
                  <th class="p-3.5 whitespace-nowrap">Điểm Ngữ Pháp</th>
                  <th class="p-3.5 whitespace-nowrap">Quy Đổi CEFR</th>
                  <th class="p-3.5 min-w-[200px]">Năng Lực Mục Tiêu</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                ${rows.map((r, idx) => {
                  const isSpecial = r.level.includes('7');
                  const rowBg = idx % 2 === 0 ? 'bg-white dark:bg-[#161B22]' : 'bg-stone-50/50 dark:bg-[#1c222d]/40';
                  return `
                    <tr class="${rowBg} hover:bg-amber-50/50 dark:hover:bg-stone-800/50 transition-colors">
                      <td class="p-3.5 font-bold font-serif-luxury text-stone-900 dark:text-stone-100 whitespace-nowrap">
                        <span class="px-2 py-0.5 rounded ${isSpecial ? 'bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 font-black' : 'bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-400'}">
                          ${r.level}
                        </span>
                      </td>
                      <td class="p-3.5 font-semibold text-stone-800 dark:text-stone-200 whitespace-nowrap">${r.tier}</td>
                      <td class="p-3.5 text-stone-400 font-mono">${r.wordsOld} từ</td>
                      <td class="p-3.5 font-bold font-mono text-[#8B1E1E] dark:text-amber-400 whitespace-nowrap">
                        ${r.wordsNew.toLocaleString()} từ
                        <span class="text-[10px] font-normal text-stone-400 block">${r.wordsOld !== '/////' ? '+' + (r.wordsNew - r.wordsOld) + ' từ' : 'Bậc cao cấp'}</span>
                      </td>
                      <td class="p-3.5 font-mono">${r.charsNew} chữ</td>
                      <td class="p-3.5 font-mono">${r.grammarPoints} điểm</td>
                      <td class="p-3.5 font-bold text-amber-700 dark:text-amber-400 font-mono">${r.cefr}</td>
                      <td class="p-3.5 text-2xs leading-relaxed text-stone-600 dark:text-stone-400">${r.targetAbility}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Section 2: Exam Matrix Breakdown -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-2">
              <i data-lucide="layout-grid" class="w-4 h-4 text-[#8B1E1E]"></i>
              <span>2. Ma Trận Đổi Mới Cấu Trúc Đề Thi HSK 3.0 & HSKK (Tiếng Trung Thượng Hải)</span>
            </h4>
            <p class="text-xs text-stone-500">Bấm chọn từng cấp độ để xem phân tích số câu, thời gian và dạng bài thay đổi:</p>
          </div>
        </div>

        <!-- Level Pills -->
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar p-1">
          ${matrix.levels.map(l => {
            const isActive = l.level === currentExamMatrixLevel;
            const btnClass = isActive 
              ? 'btn-matrix-lvl px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent cursor-pointer whitespace-nowrap'
              : 'btn-matrix-lvl px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer whitespace-nowrap';
            return `
              <button onclick="filterExamMatrixLevel(${jsArg(l.level)})" data-level="${l.level}" class="${btnClass}">
                ${l.level}
              </button>
            `;
          }).join('')}
        </div>

        <div id="examMatrixDetailCard"></div>
      </div>

      <!-- Section 3: Textbook Comparison -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-2">
              <i data-lucide="book-marked" class="w-4 h-4 text-[#8B1E1E]"></i>
              <span>3. Cẩm Nang So Sánh 4 Bộ Giáo Trình Học Tiếng Trung Phổ Biến Nhất</span>
            </h4>
            <p class="text-xs text-stone-500">Giúp người học tự chọn đúng giáo trình phù hợp nhất với năng lực và mục tiêu.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${comparison.books.map(b => `
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-amber-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <h5 class="font-bold text-sm text-[#8B1E1E] dark:text-amber-400 font-serif-luxury">${b.name}</h5>
                </div>
                <p class="text-2xs text-stone-400 font-medium">${b.publisher}</p>
                <p class="text-xs text-stone-600 dark:text-stone-300"><strong>Đối tượng:</strong> ${b.audience}</p>
                
                <div class="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-2xs space-y-1">
                  <span class="font-bold text-emerald-900 dark:text-emerald-300">Ưu điểm:</span>
                  <p class="text-stone-700 dark:text-stone-300 leading-relaxed">${b.pros}</p>
                </div>

                <div class="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-2xs space-y-1">
                  <span class="font-bold text-amber-900 dark:text-amber-300">Hạn chế:</span>
                  <p class="text-stone-700 dark:text-stone-300 leading-relaxed">${b.cons}</p>
                </div>
              </div>

              <div class="pt-2 border-t border-stone-100 dark:border-stone-800 text-2xs text-[#8B1E1E] dark:text-amber-300 font-semibold">
                💡 Lời khuyên: ${b.recommendation}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  filterExamMatrixLevel(currentExamMatrixLevel);
}

function filterExamMatrixLevel(lvl) {
  currentExamMatrixLevel = lvl;
  const container = document.getElementById('examMatrixDetailCard');
  const btns = document.querySelectorAll('.btn-matrix-lvl');
  btns.forEach(btn => {
    const isAct = btn.getAttribute('data-level') === lvl;
    if (isAct) {
      btn.className = 'btn-matrix-lvl px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent cursor-pointer whitespace-nowrap';
    } else {
      btn.className = 'btn-matrix-lvl px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer whitespace-nowrap';
    }
  });

  if (!container || !hsk30RoadmapData || !hsk30RoadmapData.examMatrix) return;
  const item = (hsk30RoadmapData.examMatrix.levels || []).find(l => l.level === lvl) || hsk30RoadmapData.examMatrix.levels[0];
  if (!item) return;

  container.innerHTML = `
    <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-300/70 dark:border-stone-700 space-y-3 animate-fade-in">
      <div class="flex items-center justify-between flex-wrap gap-2 border-b border-amber-200 dark:border-stone-700 pb-2">
        <h5 class="font-bold text-sm text-[#8B1E1E] dark:text-amber-400 font-serif-luxury flex items-center gap-1.5">
          <span>🎯 Ma Trận Cấu Trúc Đề: ${item.level}</span>
        </h5>
        <div class="flex items-center gap-2 text-2xs">
          <span class="px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold">⏱️ ${item.duration}</span>
          <span class="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">📝 ${item.totalQuestions}</span>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div class="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800">
          <span class="text-stone-500 text-2xs block font-bold">Từ Vựng Yêu Cầu</span>
          <span class="font-bold text-stone-800 dark:text-stone-200">${item.vocabTarget}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800">
          <span class="text-stone-500 text-2xs block font-bold">Ngữ Pháp Trọng Điểm</span>
          <span class="font-bold text-stone-800 dark:text-stone-200">${item.grammarTarget}</span>
        </div>
      </div>
      ${item.changes && item.changes.length > 0 ? `
        <div class="space-y-1">
          <span class="text-2xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">Điểm Thay Đổi Cốt Lõi HSK 3.0:</span>
          <ul class="list-disc list-inside text-xs text-stone-700 dark:text-stone-300 space-y-1">
            ${item.changes.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;
}

function filterPathwayGrammarLevel(lvl) {
  currentPathwayGrammarLevel = lvl;
  const container = document.getElementById('pathwayDynamicContent');
  if (container) {
    renderPathwayGrammar(container);
    if (typeof refreshIcons === 'function') refreshIcons(container);
  }
}

function renderPathwayGrammar(container) {
  const data = hsk30RoadmapData || {};
  const sections = data.grammarSections || [];
  if (!sections.length) {
    container.innerHTML = '<div class="p-8 text-center text-stone-500">Đang tải dữ liệu trọng tâm ngữ pháp HSK 3.0...</div>';
    return;
  }
  const currentSection = sections.find(s => s.level === currentPathwayGrammarLevel) || sections[0];
  const items = currentSection.items || [];
  const totalCount = sections.reduce((acc, s) => acc + (s.items?.length || 0), 0);

  let html = `
    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-3 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-stone-700">
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          ${sections.map(s => {
            const isActive = s.level === currentSection.level;
            const btnClass = isActive 
              ? 'px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent'
              : 'px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700';
            return `
              <button onclick="filterPathwayGrammarLevel(${jsArg(s.level)})" class="${btnClass} cursor-pointer transition-all whitespace-nowrap">
                <span>${escapeHtml(s.level)}</span>
                <span class="opacity-80 text-[11px] ml-1">(${(s.items || []).length} cấu trúc)</span>
              </button>
            `;
          }).join('')}
        </div>
        <div class="text-xs text-stone-500 dark:text-stone-400">
          Tổng cộng: <strong>${totalCount} trọng tâm ngữ pháp chuẩn HSK 3.0</strong>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${items.map((item, idx) => {
          const id = item.id || ('g_' + (idx + 1));
          const title = item.title || item.name || 'Cấu trúc ngữ pháp';
          const category = item.category || currentSection.level;
          const explanation = item.explanation || item.notes || 'Cấu trúc nòng cốt thường gặp trong đề thi HSK.';
          const formula = item.formula || item.pattern || 'Công thức chuẩn';
          const exampleZh = item.exampleZh || (item.example ? item.example.split(/[\(（]/)[0].trim() : '') || item.example || '';
          const examplePinyin = item.examplePinyin || item.pinyin || '';
          const exampleVi = item.exampleVi || item.translation || (item.example && item.example.includes('(') ? item.example.match(/[\(（]([^\)）]+)[\)）]/)?.[1] : '') || '';

          return `
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3.5 hover:shadow-md transition-shadow">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    ${escapeHtml(category)}
                  </span>
                  <span class="text-xs text-stone-400 font-mono">#${escapeHtml(String(id))}</span>
                </div>

                <h4 class="text-sm sm:text-base font-bold font-serif-luxury text-stone-900 dark:text-stone-100">
                  ${escapeHtml(title)}
                </h4>
                <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  ${escapeHtml(explanation)}
                </p>

                <div class="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/80 dark:border-stone-700 font-mono text-xs text-amber-950 dark:text-amber-300 font-bold space-y-1">
                  <span class="text-[10px] text-stone-400 font-normal uppercase tracking-wider block font-sans">Công thức toán học hóa:</span>
                  <span>${escapeHtml(formula)}</span>
                </div>

                <div class="p-3 rounded-xl bg-[#FFFDF9] dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Ví dụ thực chiến:</span>
                    ${exampleZh ? `
                      <button onclick="playChineseTTS(${jsArg(exampleZh)}, 'female')" class="text-amber-800 dark:text-amber-300 hover:underline text-[11px] flex items-center gap-1 cursor-pointer">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                        <span>Nghe câu</span>
                      </button>
                    ` : ''}
                  </div>
                  <p class="font-hanzi text-sm font-semibold text-[#8B1E1E] dark:text-red-400">${escapeHtml(exampleZh)}</p>
                  ${examplePinyin ? `<p class="text-[11px] text-amber-900 dark:text-amber-300 font-mono">${escapeHtml(examplePinyin)}</p>` : ''}
                  ${exampleVi ? `<p class="text-xs text-stone-600 dark:text-stone-400">${escapeHtml(exampleVi)}</p>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (typeof refreshIcons === 'function') {
    refreshIcons(container);
  }
}

function renderPathwayTranslation(container) {
  const data = hsk30RoadmapData;
  const transModule = data.translationModule || {};
  const vocabCats = data.modernVocabCategories || [];
  const exercises = transModule.interactiveExercises || [];

  let html = `
    <div class="space-y-8">
      <!-- Section 1: Translation Exam Structure -->
      <div class="space-y-4">
        <div class="glass-card rounded-2xl p-6 bg-gradient-to-r from-purple-50/80 to-white dark:from-[#1c192d] dark:to-[#161B22] border border-purple-200 dark:border-purple-800/40 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-xs font-bold">
                <i data-lucide="languages" class="w-3.5 h-3.5 text-purple-600"></i>
                <span>Cải Cách Đột Phá HSK 3.0</span>
              </div>
              <h3 class="text-xl font-bold font-serif-luxury text-stone-900 dark:text-stone-100">
                ${transModule.title || 'Cấu Trúc Bài Thi Kỹ Năng Dịch Thuật (HSK 4 – 9)'}
              </h3>
              <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed">
                ${transModule.description || 'Kỹ năng Dịch bắt đầu xuất hiện từ HSK 4 và trở thành môn thi bắt buộc từ HSK 7–9. Yêu cầu thí sinh vừa có khả năng biên dịch văn bản chính xác, vừa phải có phản xạ phiên dịch nói trực tiếp trôi chảy.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Interactive Translation Lab -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-2">
              <i data-lucide="check-circle" class="w-4 h-4 text-purple-600"></i>
              <span>Phòng Luyện Dịch Thực Chiến 6 Tình Huống Thời Đại Số (HSK 3.0 Lab)</span>
            </h4>
            <p class="text-xs text-stone-500">Thử gõ bản dịch tiếng Trung và bấm kiểm tra để hệ thống chấm điểm và giải thích công thức nòng cốt:</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${exercises.map(ex => `
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-purple-200/80 dark:border-stone-800 shadow-xs space-y-3.5">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  ${ex.title}
                </span>
                <span class="text-xs text-stone-400 font-mono">#0${ex.id}</span>
              </div>

              <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-1">
                <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Câu tiếng Việt cần dịch:</span>
                <p class="text-xs font-bold text-stone-900 dark:text-stone-100 leading-relaxed">${ex.sourceVi}</p>
              </div>

              <!-- Input for translation -->
              <div class="space-y-2">
                <input 
                  type="text" 
                  id="trans-input-${ex.id}" 
                  placeholder="Nhập câu dịch tiếng Trung của bạn tại đây..." 
                  onkeydown="if(event.key==='Enter') checkHsk30Translation(${ex.id})"
                  class="w-full px-3 py-2 text-xs rounded-xl bg-amber-50/50 dark:bg-stone-900 border border-amber-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div class="flex items-center justify-between gap-2">
                  <button 
                    onclick="checkHsk30Translation(${ex.id})" 
                    class="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:opacity-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                    <span>Kiểm Tra Bản Dịch</span>
                  </button>
                  <button 
                    onclick="revealHsk30Answer(${ex.id})" 
                    class="py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                  >
                    Xem Đáp Án
                  </button>
                </div>
              </div>

              <!-- Result Container -->
              <div id="trans-result-${ex.id}" class="hidden"></div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 3: Modern Vocab in HSK 3.0 -->
      <div class="space-y-4">
        <div>
          <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-2">
            <i data-lucide="sparkles" class="w-4 h-4 text-amber-600"></i>
            <span>Các Nhóm Từ Vựng Mới Tiêu Biểu Trong Kỷ Nguyên Số HSK 3.0</span>
          </h4>
          <p class="text-xs text-stone-500">Cập nhật thuật ngữ hiện đại của mạng xã hội, livestream, công nghệ 4.0 và thương mại điện tử:</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${vocabCats.map(cat => `
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-amber-200/80 dark:border-stone-800 shadow-xs space-y-3">
              <div class="flex items-center gap-2 text-stone-900 dark:text-stone-100">
                <span class="text-lg">${cat.icon}</span>
                <h5 class="font-bold text-sm font-serif-luxury">${cat.category}</h5>
              </div>

              <div class="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                ${cat.words.map(w => `
                  <div class="py-2.5 space-y-1">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="font-hanzi text-base font-bold text-[#8B1E1E] dark:text-red-400">${w.hanzi}</span>
                        <span class="text-amber-900 dark:text-amber-300 font-mono text-2xs">${w.pinyin}</span>
                      </div>
                      <button onclick="playChineseTTS(${jsArg(w.hanzi)}, 'female')" class="text-stone-400 hover:text-amber-600 cursor-pointer" title="Nghe phát âm">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                    <p class="text-stone-700 dark:text-stone-300 font-medium text-2xs">${w.meaning}</p>
                    <p class="text-stone-500 dark:text-stone-400 text-[11px] leading-relaxed">${w.example}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function checkHsk30Translation(id) {
  if (!hsk30RoadmapData || !hsk30RoadmapData.translationModule) return;
  const exercises = hsk30RoadmapData.translationModule.interactiveExercises || [];
  const ex = exercises.find(e => e.id === id);
  if (!ex) return;

  const inputEl = document.getElementById(`trans-input-${id}`);
  const resultEl = document.getElementById(`trans-result-${id}`);
  if (!inputEl || !resultEl) return;

  const userVal = inputEl.value.trim();
  if (!userVal) {
    showToast('Vui lòng nhập câu dịch tiếng Trung của bạn!', 'warning');
    return;
  }

  const cleanUser = userVal.replace(/[，。！？\s.,!?]/g, '');
  const cleanTarget = ex.targetZh.replace(/[，。！？\s.,!?]/g, '');
  const isExact = (cleanUser === cleanTarget);
  const matchedKeywords = (ex.keywords || []).filter(kw => userVal.includes(kw));

  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `
    <div class="mt-3 p-3.5 rounded-2xl ${isExact ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300' : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300'} space-y-2 text-xs animate-fade-in">
      <div class="flex items-center justify-between">
        <span class="font-bold ${isExact ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-900 dark:text-amber-300'} flex items-center gap-1.5">
          <span>${isExact ? '🎉 Hoàn Hảo! Bản dịch rất chuẩn xác!' : '💡 Nhận Xét & Gợi Ý Đối Chiếu:'}</span>
        </span>
        <button onclick="playChineseTTS(${jsArg(ex.targetZh)})" class="px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 text-2xs font-bold flex items-center gap-1 hover:bg-stone-100 cursor-pointer">
          <span>🔊 Nghe</span>
        </button>
      </div>
      <div class="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 space-y-1">
        <p class="font-hanzi font-bold text-sm text-[#8B1E1E] dark:text-rose-400">${ex.targetZh}</p>
        <p class="text-stone-500 dark:text-stone-400 italic text-2xs">${ex.targetPinyin}</p>
      </div>
      ${ex.grammarFormula ? `
        <div class="text-2xs text-stone-600 dark:text-stone-300">
          <strong>Cấu trúc ngữ pháp:</strong> ${ex.grammarFormula}
        </div>
      ` : ''}
      ${matchedKeywords.length > 0 ? `
        <div class="flex items-center gap-1 flex-wrap text-2xs">
          <span class="font-bold text-stone-500">Từ khóa nhận diện được:</span>
          ${matchedKeywords.map(kw => `<span class="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold">${kw}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function revealHsk30Answer(id) {
  if (!hsk30RoadmapData || !hsk30RoadmapData.translationModule) return;
  const exercises = hsk30RoadmapData.translationModule.interactiveExercises || [];
  const ex = exercises.find(e => e.id === id);
  if (!ex) return;

  const resultEl = document.getElementById(`trans-result-${id}`);
  const inputEl = document.getElementById(`trans-input-${id}`);
  if (inputEl) inputEl.value = ex.targetZh;
  if (!resultEl) return;

  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `
    <div class="mt-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 space-y-2 text-xs animate-fade-in">
      <div class="flex items-center justify-between">
        <span class="font-bold text-amber-900 dark:text-amber-300">
          📖 Đáp Án Tiêu Chuẩn HSK 3.0:
        </span>
        <button onclick="playChineseTTS(${jsArg(ex.targetZh)})" class="px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 text-2xs font-bold flex items-center gap-1 hover:bg-stone-100 cursor-pointer">
          <span>🔊 Nghe</span>
        </button>
      </div>
      <div class="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 space-y-1">
        <p class="font-hanzi font-bold text-sm text-[#8B1E1E] dark:text-rose-400">${ex.targetZh}</p>
        <p class="text-stone-500 dark:text-stone-400 italic text-2xs">${ex.targetPinyin}</p>
      </div>
      ${ex.grammarFormula ? `<p class="text-2xs text-stone-600 dark:text-stone-300"><strong>Cấu trúc:</strong> ${ex.grammarFormula}</p>` : ''}
      ${ex.cultureNote ? `<p class="text-2xs text-stone-500 dark:text-stone-400">💡 <em>${ex.cultureNote}</em></p>` : ''}
    </div>
  `;
}


function renderPathwayLessonsView(container) {
  let html = `
    <div class="space-y-6">
      <!-- Sub-Tab Toggle between Standard Course 48 and Expanded 1040 -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-stone-700">
        <div class="flex items-center gap-2">
          <button 
            onclick="switchPathwayLessonsTab('standard48')" 
            id="btn-sublesson-standard48" 
            class="px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${currentPathwayLessonsTab === 'standard48' ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm' : 'bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:bg-amber-100 border border-stone-200 dark:border-stone-700'}"
          >
            <span>📘 Giáo Trình Chuẩn HSK 3.0 (68 Bài Học HSK 1 - 4)</span>
          </button>
          <button 
            onclick="switchPathwayLessonsTab('all1040')" 
            id="btn-sublesson-all1040" 
            class="px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${currentPathwayLessonsTab === 'all1040' ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm' : 'bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:bg-amber-100 border border-stone-200 dark:border-stone-700'}"
          >
            <span>📚 Kho 1.040 Bài Học & Từ Vựng Mở Rộng</span>
          </button>
        </div>

        <div class="text-2xs text-stone-500 dark:text-stone-400">
          ${currentPathwayLessonsTab === 'standard48' ? 'Đầy đủ HSK 1 (15 bài), HSK 2 (15 bài), HSK 3 (18 bài) & HSK 4 (20 bài)' : 'Lọc từ vựng thực chiến HSK 1 – 6'}
        </div>
      </div>

      <!-- View 1: Standard Course 48 Lessons -->
      <div id="pathwayStandard48Section" class="${currentPathwayLessonsTab === 'standard48' ? 'space-y-5' : 'hidden'}">
        <div class="glass-card rounded-2xl p-4 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <!-- Level Filters -->
          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar p-1">
            <button 
              onclick="filterHsk30CourseLevel(0)" 
              class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${currentHsk30CourseFilter === 0 ? 'bg-[#8B1E1E] text-white shadow-2xs' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100'}"
            >
              Tất Cả 68 Bài
            </button>
            <button 
              onclick="filterHsk30CourseLevel(1)" 
              class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${currentHsk30CourseFilter === 1 ? 'bg-blue-600 text-white shadow-2xs' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-blue-50'}"
            >
              HSK 1 (15 Bài)
            </button>
            <button 
              onclick="filterHsk30CourseLevel(2)" 
              class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${currentHsk30CourseFilter === 2 ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50'}"
            >
              HSK 2 (15 Bài)
            </button>
            <button 
              onclick="filterHsk30CourseLevel(3)" 
              class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${currentHsk30CourseFilter === 3 ? 'bg-[#8B1E1E] text-white shadow-2xs' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-50'}"
            >
              HSK 3 (18 Bài)
            </button>
          </div>

          <!-- Search input -->
          <div class="relative w-full md:w-72">
            <i data-lucide="search" class="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              placeholder="Tìm kiếm bài học, ngữ pháp..." 
              value="${currentHsk30SearchQuery}"
              oninput="searchHsk30Lessons(this.value)"
              class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-amber-50/50 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]"
            />
          </div>
        </div>

        <div id="hsk30LessonsListContainer"></div>
      </div>

      <!-- View 2: Expanded 1040 Lessons -->
      <div id="pathwayAll1040Section" class="${currentPathwayLessonsTab === 'all1040' ? 'space-y-5' : 'hidden'}">
        <div class="glass-card rounded-2xl p-4 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="text-xs font-bold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
            <i data-lucide="layers" class="w-4 h-4 text-amber-600"></i>
            <span>Chọn cấp độ bài học mở rộng:</span>
          </div>
          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar p-1">
            ${[1, 2, 3, 4, 5, 6].map(lvl => {
              const isActive = lvl === currentHskLevel;
              const btnClass = isActive 
                ? 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent'
                : 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700';
              return `
                <button onclick="filterPathwayLevel(${lvl})" id="btn-hsk-${lvl}" class="${btnClass} cursor-pointer transition-all whitespace-nowrap">
                  HSK ${lvl}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div id="pathwayLessonsContainer" class="space-y-4"></div>

        <div class="flex justify-center pt-2">
          <button id="loadMoreLessonsBtn" onclick="loadMoreLessons()" class="px-6 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-[#161B22] hover:bg-amber-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer">
            <span>Xem thêm bài học tiếp theo</span>
            <i data-lucide="chevron-down" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  if (currentPathwayLessonsTab === 'standard48') {
    const listEl = document.getElementById('hsk30LessonsListContainer');
    if (listEl) renderHsk30StandardCourseCards(listEl);
  } else {
    renderPathwayLessonsList(true);
  }
}

function switchPathwayLessonsTab(tab) {
  currentPathwayLessonsTab = tab;
  const container = document.getElementById('pathwayTabContentContainer');
  if (container) {
    renderPathwayLessonsView(container);
  }
}

function filterHsk30CourseLevel(filter) {
  currentHsk30CourseFilter = filter;
  const listEl = document.getElementById('hsk30LessonsListContainer');
  if (listEl) renderHsk30StandardCourseCards(listEl);
}

function searchHsk30Lessons(query) {
  currentHsk30SearchQuery = (query || '').trim().toLowerCase();
  const listEl = document.getElementById('hsk30LessonsListContainer');
  if (listEl) renderHsk30StandardCourseCards(listEl);
}

function renderHsk30StandardCourseCards(container) {
  if (!container || !hsk30RoadmapData) return;
  const allLessons = hsk30RoadmapData.standardCourse48Lessons || [];

  const filtered = allLessons.filter(l => {
    const matchLevel = (currentHsk30CourseFilter === 0) || (l.hskLevel === currentHsk30CourseFilter);
    if (!matchLevel) return false;
    if (!currentHsk30SearchQuery) return true;
    const q = currentHsk30SearchQuery;
    return (l.titleZh && l.titleZh.toLowerCase().includes(q)) ||
           (l.titleVi && l.titleVi.toLowerCase().includes(q)) ||
           (l.grammar && l.grammar.toLowerCase().includes(q)) ||
           (l.vocabTheme && l.vocabTheme.toLowerCase().includes(q));
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="glass-card rounded-2xl p-8 text-center text-stone-500">
        Không tìm thấy bài học nào phù hợp với bộ lọc.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${filtered.map(l => `
        <div onclick="openHsk30LessonModal(${l.hskLevel}, ${l.lessonNumber})" class="glass-card rounded-2xl p-4 bg-white dark:bg-[#161B22] border border-amber-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${l.hskLevel === 1 ? 'bg-blue-100 text-blue-800' : (l.hskLevel === 2 ? 'bg-emerald-100 text-emerald-800' : (l.hskLevel === 3 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'))}">
                HSK ${l.hskLevel} · Bài ${l.lessonNumber}
              </span>
              <button onclick="event.stopPropagation(); playChineseTTS(${jsArg(l.titleZh)})" class="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors" title="Nghe tiêu đề">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
            <div>
              <h5 class="font-hanzi font-black text-base text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 transition-colors">${l.titleZh}</h5>
              <p class="text-xs text-stone-500 dark:text-stone-400 italic">${l.titlePinyin || ''}</p>
              <p class="text-xs font-medium text-stone-700 dark:text-stone-300 mt-0.5">${l.titleVi}</p>
            </div>
            <div class="p-2 rounded-xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700 text-2xs space-y-1">
              <p><strong>Ngữ pháp:</strong> ${l.grammar || l.focus || 'Trọng điểm ngữ pháp'}</p>
              <p><strong>Chủ đề từ:</strong> ${l.vocabTheme || l.vocabularyTheme || 'Từ vựng giao tiếp'}</p>
            </div>
            ${l.dialogueZh ? `
              <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-2xs space-y-1">
                <p class="font-hanzi font-bold text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed">${l.dialogueZh}</p>
                <p class="text-stone-500 dark:text-stone-400 whitespace-pre-line">${l.dialogueVi}</p>
              </div>
            ` : ''}
          </div>
          
          <div class="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            ${l.tip ? `
              <div class="text-[11px] text-amber-800 dark:text-amber-400 italic leading-snug">
                💡 ${l.tip}
              </div>
            ` : ''}
            <button onclick="event.stopPropagation(); openHsk30LessonModal(${l.hskLevel}, ${l.lessonNumber})" class="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-100/80 hover:bg-gradient-to-r hover:from-amber-600 hover:to-amber-700 hover:text-white text-stone-800 dark:bg-stone-800 dark:hover:bg-amber-600 dark:text-stone-200 dark:hover:text-white border border-amber-300/80 dark:border-stone-700 shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
              <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
              <span>Xem Chi Tiết Bài Học →</span>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  refreshIcons(container);
}


let currentViewingHsk30Lesson = null;
let currentHsk30LessonTab = 'dialogues';
let hsk30LessonQuizState = {};

async function openHsk30LessonModal(level, lessonNumber) {
  if (!hsk30RoadmapData && typeof loadData === 'function') {
    await loadData('hsk30Roadmap');
  }
  if (!hsk30RoadmapData) return;
  const allLessons = hsk30RoadmapData.standardCourse68Lessons || hsk30RoadmapData.standardCourseLessons || hsk30RoadmapData.standardCourse48Lessons || [];
  const lesson = allLessons.find(l => Number(l.hskLevel) === Number(level) && Number(l.lessonNumber) === Number(lessonNumber));
  if (!lesson) {
    if (typeof showToast === 'function') showToast('Không tìm thấy thông tin bài học.');
    return;
  }

  currentViewingHsk30Lesson = lesson;
  currentHsk30LessonTab = 'dialogues';
  hsk30LessonQuizState = {};

  const modal = document.getElementById('hsk30LessonDetailModal');
  if (!modal) return;

  const lvlBadge = document.getElementById('hsk30ModalLevelBadge');
  const themeBadge = document.getElementById('hsk30ModalThemeBadge');
  const titleZh = document.getElementById('hsk30ModalTitleZh');
  const titlePinyin = document.getElementById('hsk30ModalTitlePinyin');
  const titleVi = document.getElementById('hsk30ModalTitleVi');
  const ttsBtn = document.getElementById('hsk30ModalTtsBtn');

  if (lvlBadge) lvlBadge.textContent = `HSK ${lesson.hskLevel} · Bài ${lesson.lessonNumber}`;
  if (themeBadge) themeBadge.textContent = lesson.vocabTheme || lesson.vocabularyTheme || 'Giao tiếp thực tế';
  if (titleZh) titleZh.textContent = lesson.titleZh;
  if (titlePinyin) titlePinyin.textContent = lesson.titlePinyin || '';
  if (titleVi) titleVi.textContent = lesson.titleVi;
  if (ttsBtn) {
    ttsBtn.onclick = () => {
      if (typeof playChineseTTS === 'function') playChineseTTS(lesson.titleZh);
    };
  }

  updateHsk30LessonModalFooter();
  switchHsk30LessonTab('dialogues');

  const container = document.getElementById('hsk30LessonModalBody');
  if (container) container.scrollTop = 0;

  modal.classList.remove('hidden');
  refreshIcons(modal);
}

function closeHsk30LessonModal() {
  const modal = document.getElementById('hsk30LessonDetailModal');
  if (modal) modal.classList.add('hidden');
}

function updateHsk30LessonModalFooter() {
  if (!currentViewingHsk30Lesson || !hsk30RoadmapData) return;
  const all = hsk30RoadmapData.standardCourse68Lessons || hsk30RoadmapData.standardCourseLessons || hsk30RoadmapData.standardCourse48Lessons || [];
  const idx = all.findIndex(l => Number(l.hskLevel) === Number(currentViewingHsk30Lesson.hskLevel) && Number(l.lessonNumber) === Number(currentViewingHsk30Lesson.lessonNumber));

  const progressEl = document.getElementById('hsk30LessonProgressText');
  if (progressEl) progressEl.textContent = `Bài ${idx >= 0 ? idx + 1 : 1} / ${all.length}`;

  const prevBtn = document.getElementById('hsk30PrevLessonBtn');
  const nextBtn = document.getElementById('hsk30NextLessonBtn');

  if (prevBtn) {
    prevBtn.disabled = idx <= 0;
    prevBtn.classList.toggle('opacity-40', idx <= 0);
    prevBtn.classList.toggle('cursor-not-allowed', idx <= 0);
  }
  if (nextBtn) {
    nextBtn.disabled = idx < 0 || idx >= all.length - 1;
    nextBtn.classList.toggle('opacity-40', idx < 0 || idx >= all.length - 1);
    nextBtn.classList.toggle('cursor-not-allowed', idx < 0 || idx >= all.length - 1);
  }
}

function navigateHsk30Lesson(direction) {
  if (!currentViewingHsk30Lesson || !hsk30RoadmapData) return;
  const all = hsk30RoadmapData.standardCourse68Lessons || hsk30RoadmapData.standardCourseLessons || hsk30RoadmapData.standardCourse48Lessons || [];
  const idx = all.findIndex(l => Number(l.hskLevel) === Number(currentViewingHsk30Lesson.hskLevel) && Number(l.lessonNumber) === Number(currentViewingHsk30Lesson.lessonNumber));
  if (idx < 0) return;

  if (direction === 'prev' && idx > 0) {
    const prev = all[idx - 1];
    openHsk30LessonModal(prev.hskLevel, prev.lessonNumber);
  } else if (direction === 'next' && idx < all.length - 1) {
    const next = all[idx + 1];
    openHsk30LessonModal(next.hskLevel, next.lessonNumber);
  }
}

function switchHsk30LessonTab(tabName) {
  currentHsk30LessonTab = tabName;
  const tabs = ['dialogues', 'vocabulary', 'grammar', 'culture', 'practice'];
  tabs.forEach(t => {
    const btn = document.getElementById(`hsk30TabBtn-${t}`);
    if (!btn) return;
    if (t === tabName) {
      btn.className = 'h-full px-4 text-xs font-bold border-b-2 border-[#8B1E1E] dark:border-amber-400 text-[#8B1E1E] dark:text-amber-400 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer';
    } else {
      btn.className = 'h-full px-4 text-xs font-bold border-b-2 border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer';
    }
  });

  const container = document.getElementById('hsk30LessonModalBody');
  if (container) container.scrollTop = 0;

  renderHsk30LessonDetailContent();
}

function renderHsk30LessonDetailContent() {
  const container = document.getElementById('hsk30LessonModalBody');
  if (!container || !currentViewingHsk30Lesson) return;
  const l = currentViewingHsk30Lesson;

  if (currentHsk30LessonTab === 'dialogues') {
    const dialogues = l.dialogues || [];
    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <i data-lucide="message-square" class="w-4 h-4 text-amber-600"></i>
              <span>Văn Bản Hội Thoại Chuẩn HSK 3.0</span>
            </h4>
            <p class="text-xs text-stone-500">Đối thoại ngữ cảnh sinh động chuẩn mực phát âm Bắc Kinh</p>
          </div>
          <button onclick="playHsk30AllDialogues()" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer">
            <i data-lucide="headphones" class="w-3.5 h-3.5 text-amber-600"></i>
            <span>Nghe Toàn Bài</span>
          </button>
        </div>

        <div class="space-y-3">
          ${dialogues.map((d, idx) => `
            <div class="p-3.5 rounded-2xl ${idx % 2 === 0 ? 'bg-amber-50/60 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-800' : 'bg-stone-50/90 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700'} flex items-start gap-3">
              <div class="w-8 h-8 rounded-full ${idx % 2 === 0 ? 'bg-amber-600 text-white' : 'bg-stone-600 text-white'} flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                ${(d.speaker || 'A').slice(0, 1)}
              </div>
              <div class="flex-1 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-stone-600 dark:text-stone-400">${d.speaker}</span>
                  <button onclick="playChineseTTS(${jsArg(d.hanzi)})" class="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer" title="Phát âm câu này">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
                <p class="font-hanzi font-bold text-base text-stone-900 dark:text-stone-100 leading-relaxed">${d.hanzi}</p>
                ${d.pinyin ? `<p class="text-xs text-stone-500 dark:text-stone-400 italic">${d.pinyin}</p>` : ''}
                <p class="text-xs text-stone-700 dark:text-stone-300 font-medium">${d.vi}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (currentHsk30LessonTab === 'vocabulary') {
    const vocab = l.vocabulary || [];
    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <i data-lucide="book-open" class="w-4 h-4 text-emerald-600"></i>
              <span>Từ Vựng Trọng Tâm Bài Học (${vocab.length} từ)</span>
            </h4>
            <p class="text-xs text-stone-500">Kèm phiên âm, âm Hán Việt, từ loại và câu ví dụ thực tế</p>
          </div>
          <button onclick="saveAllHsk30LessonVocab()" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer">
            <i data-lucide="bookmark-plus" class="w-3.5 h-3.5"></i>
            <span>Lưu Toàn Bộ Vào Sổ</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${vocab.map(v => {
            const saved = typeof isWordSaved === 'function' ? isWordSaved(v.hanzi) : false;
            return `
              <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2 flex flex-col justify-between hover:border-amber-300 transition-colors">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <span class="font-hanzi font-black text-xl text-stone-900 dark:text-stone-100">${v.hanzi}</span>
                      <span class="text-xs text-stone-500 dark:text-stone-400 italic ml-2">${v.pinyin || ''}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <button onclick="playChineseTTS(${jsArg(v.hanzi)})" class="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors cursor-pointer" title="Nghe từ">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="handleToggleHsk30Vocab(${jsArg(v.hanzi)}, ${jsArg(v.pinyin || '')}, ${jsArg(v.vi || '')}, ${l.hskLevel})" class="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 ${saved ? 'text-amber-600' : 'text-stone-400'} transition-colors cursor-pointer" title="${saved ? 'Đã lưu' : 'Lưu vào sổ từ'}">
                        <i data-lucide="${saved ? 'bookmark-check' : 'bookmark'}" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    ${v.hanviet ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300">HV: ${v.hanviet}</span>` : ''}
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">${v.pos || 'Từ vựng'}</span>
                  </div>
                  <p class="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-1.5">${v.vi}</p>
                </div>

                ${v.example && v.example.hanzi ? `
                  <div class="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 text-[11px] space-y-0.5 mt-2">
                    <div class="flex items-center justify-between">
                      <p class="font-hanzi font-bold text-stone-800 dark:text-stone-200">${v.example.hanzi}</p>
                      <button onclick="playChineseTTS(${jsArg(v.example.hanzi)})" class="text-stone-400 hover:text-stone-700 cursor-pointer">
                        <i data-lucide="volume-2" class="w-3 h-3"></i>
                      </button>
                    </div>
                    ${v.example.pinyin ? `<p class="text-stone-400 italic">${v.example.pinyin}</p>` : ''}
                    <p class="text-stone-600 dark:text-stone-400">${v.example.vi}</p>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (currentHsk30LessonTab === 'grammar') {
    const grammar = l.grammarPoints || [];
    container.innerHTML = `
      <div class="space-y-4">
        <div class="pb-2 border-b border-stone-200 dark:border-stone-800">
          <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <i data-lucide="compass" class="w-4 h-4 text-purple-600"></i>
            <span>Trọng Điểm Ngữ Pháp Cốt Lõi (${grammar.length} điểm)</span>
          </h4>
          <p class="text-xs text-stone-500">Phân tích công thức, quy tắc ứng dụng và ví dụ song ngữ chuẩn Hanban</p>
        </div>

        <div class="space-y-4">
          ${grammar.map(g => `
            <div class="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-purple-200/80 dark:border-stone-800 shadow-2xs space-y-3">
              <h5 class="text-sm font-bold text-purple-950 dark:text-purple-300 font-serif-luxury">${g.title}</h5>
              
              <div class="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs font-mono font-semibold text-purple-900 dark:text-purple-300">
                📌 Công thức: ${g.formula}
              </div>

              <div class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                ${g.explanation}
              </div>

              ${g.examples && g.examples.length ? `
                <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-2">
                  <span class="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Ví dụ minh họa:</span>
                  ${g.examples.map(ex => `
                    <div class="flex items-start justify-between gap-2 text-xs">
                      <div class="space-y-0.5">
                        <p class="font-hanzi font-bold text-stone-900 dark:text-stone-100">${ex.hanzi}</p>
                        ${ex.pinyin ? `<p class="text-stone-500 italic text-[11px]">${ex.pinyin}</p>` : ''}
                        <p class="text-stone-600 dark:text-stone-400 font-medium">${ex.vi}</p>
                      </div>
                      <button onclick="playChineseTTS(${jsArg(ex.hanzi)})" class="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400 shrink-0 cursor-pointer">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (currentHsk30LessonTab === 'culture') {
    const tips = l.cultureAndTips || {};
    container.innerHTML = `
      <div class="space-y-4">
        <div class="pb-2 border-b border-stone-200 dark:border-stone-800">
          <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <i data-lucide="lightbulb" class="w-4 h-4 text-amber-500"></i>
            <span>Văn Hóa Đời Sống & Chiến Thuật Thi HSK 3.0</span>
          </h4>
          <p class="text-xs text-stone-500">Bí kíp thực chiến từ giáo viên bản xứ và chuyên gia khảo thí</p>
        </div>

        <div class="space-y-3">
          <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-[#1f2420] border border-amber-200 dark:border-amber-900/50 space-y-1.5">
            <div class="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
              <i data-lucide="sparkles" class="w-4 h-4 text-amber-600"></i>
              <span>Văn Hóa Giao Tiếp & Đời Sống Trung Hoa</span>
            </div>
            <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              ${tips.culture || l.tip || 'HSK 3.0 chú trọng giao tiếp thực chiến và hòa nhập văn hóa bản xứ.'}
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-blue-50/70 dark:bg-[#1a2333] border border-blue-200 dark:border-blue-900/50 space-y-1.5">
            <div class="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-xs">
              <i data-lucide="shield-check" class="w-4 h-4 text-blue-600"></i>
              <span>Chiến Thuật Thi HSK 3.0 & Bẫy Cần Tránh</span>
            </div>
            <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              ${tips.examTip || 'Lưu ý các hư từ, trật tự câu và tránh viết sai nét bút thuận trong bài thi.'}
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-[#1b2621] border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
            <div class="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
              <i data-lucide="smartphone" class="w-4 h-4 text-emerald-600"></i>
              <span>Ứng Dụng Thực Tế Thời Đại 4.0</span>
            </div>
            <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              ${tips.practicalApp || 'Áp dụng trực tiếp trong nhắn tin WeChat, đặt vé tàu cao tốc và mua sắm trực tuyến.'}
            </p>
          </div>
        </div>
      </div>
    `;
  } else if (currentHsk30LessonTab === 'practice') {
    const quiz = l.practice || [];
    const totalQ = quiz.length;
    let answeredCount = 0;
    let correctCount = 0;

    quiz.forEach((q, idx) => {
      if (hsk30LessonQuizState[idx] !== undefined) {
        answeredCount++;
        if (hsk30LessonQuizState[idx] === q.answer) correctCount++;
      }
    });

    const isAllAnswered = answeredCount === totalQ && totalQ > 0;
    const isAllCorrect = isAllAnswered && correctCount === totalQ;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <i data-lucide="pencil" class="w-4 h-4 text-rose-600"></i>
              <span>Luyện Tập Củng Cố Kiến Thức (${totalQ} câu hỏi)</span>
            </h4>
            <p class="text-xs text-stone-500">Trả lời đúng toàn bộ nhận ngay +20 EXP vào hồ sơ học viên</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold ${isAllCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'}">
            Đúng ${correctCount}/${totalQ} câu
          </span>
        </div>

        ${isAllCorrect ? `
          <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md flex items-center justify-between gap-3 animate-scale-up">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">🎉</div>
              <div>
                <h5 class="text-sm font-bold">Xuất Sắc! Bạn Đã Làm Đúng Toàn Bộ!</h5>
                <p class="text-xs opacity-90">+20 EXP đã được cộng vào tài khoản của bạn.</p>
              </div>
            </div>
            <button onclick="navigateHsk30Lesson('next')" class="px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-xs hover:bg-emerald-50 transition-all cursor-pointer">
              Bài tiếp theo →
            </button>
          </div>
        ` : ''}

        <div class="space-y-4">
          ${quiz.map((q, qIdx) => {
            const userPick = hsk30LessonQuizState[qIdx];
            const isAnswered = userPick !== undefined;
            return `
              <div class="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
                <p class="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug">
                  <span class="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold inline-flex items-center justify-center text-[10px] mr-1.5">${qIdx + 1}</span>
                  ${q.question}
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  ${(q.options || []).map((opt, optIdx) => {
                    let btnStyle = 'bg-stone-50 hover:bg-amber-50 dark:bg-stone-800/60 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200';
                    if (isAnswered) {
                      if (optIdx === q.answer) {
                        btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-600 dark:text-emerald-200 font-bold';
                      } else if (optIdx === userPick) {
                        btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 dark:bg-rose-950/80 dark:border-rose-600 dark:text-rose-200 line-through';
                      } else {
                        btnStyle = 'opacity-50 bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400';
                      }
                    }
                    return `
                      <button onclick="checkHsk30LessonQuiz(${qIdx}, ${optIdx})" class="p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}">
                        <span>${opt}</span>
                        ${isAnswered && optIdx === q.answer ? '<i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0"></i>' : ''}
                        ${isAnswered && optIdx === userPick && optIdx !== q.answer ? '<i data-lucide="x" class="w-4 h-4 text-rose-600 shrink-0"></i>' : ''}
                      </button>
                    `;
                  }).join('')}
                </div>

                ${isAnswered ? `
                  <div class="p-2.5 rounded-xl ${userPick === q.answer ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-300'} text-xs space-y-1">
                    <p class="font-bold flex items-center gap-1">
                      <i data-lucide="${userPick === q.answer ? 'check-circle-2' : 'alert-circle'}" class="w-3.5 h-3.5"></i>
                      <span>${userPick === q.answer ? 'Chính xác!' : 'Chưa chính xác.'}</span>
                    </p>
                    <p class="text-[11px] leading-relaxed opacity-95">${q.explain}</p>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  refreshIcons(container);
}

function checkHsk30LessonQuiz(qIdx, optIdx) {
  if (!currentViewingHsk30Lesson) return;
  hsk30LessonQuizState[qIdx] = optIdx;

  const quiz = currentViewingHsk30Lesson.practice || [];
  const totalQ = quiz.length;
  let allCorrect = true;
  let allAnswered = true;

  for (let i = 0; i < totalQ; i++) {
    if (hsk30LessonQuizState[i] === undefined) {
      allAnswered = false;
      allCorrect = false;
      break;
    }
    if (hsk30LessonQuizState[i] !== quiz[i].answer) {
      allCorrect = false;
    }
  }

  if (allAnswered && allCorrect && !hsk30LessonQuizState.__awarded) {
    hsk30LessonQuizState.__awarded = true;
    if (typeof addExp === 'function') addExp(20, 'Hoàn thành bài tập HSK 3.0');
    if (typeof showToast === 'function') showToast('Chúc mừng! Bạn đã nhận được +20 EXP!');
  }

  renderHsk30LessonDetailContent();
}

function handleToggleHsk30Vocab(hanzi, pinyin, meaning, level) {
  if (typeof toggleSaveWord === 'function') {
    toggleSaveWord(hanzi, pinyin, meaning, level);
    renderHsk30LessonDetailContent();
  }
}

function saveAllHsk30LessonVocab() {
  if (!currentViewingHsk30Lesson) return;
  const vocab = currentViewingHsk30Lesson.vocabulary || [];
  let savedCount = 0;
  vocab.forEach(v => {
    if (typeof isWordSaved === 'function' && !isWordSaved(v.hanzi)) {
      if (typeof toggleSaveWord === 'function') {
        toggleSaveWord(v.hanzi, v.pinyin || '', v.vi || '', currentViewingHsk30Lesson.hskLevel || 1);
        savedCount++;
      }
    }
  });

  if (typeof showToast === 'function') {
    showToast(`Đã lưu ${savedCount > 0 ? savedCount : 'toàn bộ'} từ vựng vào Sổ tay ôn tập!`);
  }
  renderHsk30LessonDetailContent();
}

function playHsk30AllDialogues() {
  if (!currentViewingHsk30Lesson) return;
  const dialogues = currentViewingHsk30Lesson.dialogues || [];
  if (dialogues.length === 0) {
    if (currentViewingHsk30Lesson.titleZh && typeof playChineseTTS === 'function') {
      playChineseTTS(currentViewingHsk30Lesson.titleZh);
    }
    return;
  }
  const fullText = dialogues.map(d => d.hanzi).join('，');
  if (typeof playChineseTTS === 'function') {
    playChineseTTS(fullText);
  }
}

function getCurrentlyViewingHsk30Lesson() {
  return currentViewingHsk30Lesson;
}


function filterPathwayLevel(level) {
  currentHskLevel = level;
  for (let l = 1; l <= 6; l++) {
    const btn = document.getElementById(`btn-hsk-${l}`);
    if (btn) {
      if (l === level) {
        btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent whitespace-nowrap';
      } else {
        btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 whitespace-nowrap';
      }
    }
  }
  renderPathwayLessonsList(true);
}

function renderPathwayLessonsList(reset = false) {
  const container = document.getElementById('pathwayLessonsContainer');
  if (!container || !lessonsData) return;

  if (reset) {
    container.innerHTML = '';
    pathwayLessonsRendered = 0;
  }

  const filtered = lessonsData.filter(item => item.level === currentHskLevel);
  const nextBatch = filtered.slice(pathwayLessonsRendered, pathwayLessonsRendered + pathwayLessonsBatchSize);

  if (nextBatch.length === 0 && pathwayLessonsRendered === 0) {
    container.innerHTML = '<div class="glass-card rounded-2xl p-8 text-center text-stone-500">Không có bài học nào ở cấp độ này.</div>';
    const loadMoreBtn = document.getElementById('loadMoreLessonsBtn');
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    return;
  }

  nextBatch.forEach(lesson => {
    const card = document.createElement('div');
    card.className = 'glass-card rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#161B22] border border-amber-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4';
    card.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-stone-800 text-[#8B1E1E] dark:text-amber-400 border border-amber-300 dark:border-stone-700 flex items-center justify-center font-hanzi text-2xl font-black shrink-0 shadow-2xs">
          ${lesson.hanzi ? lesson.hanzi[0] : '字'}
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h4 class="font-hanzi text-lg font-bold text-stone-900 dark:text-stone-100">${lesson.hanzi || 'Tiêu đề'}</h4>
            <span class="text-xs text-amber-900 dark:text-amber-300 font-mono font-medium">${lesson.pinyin || ''}</span>
          </div>
          <p class="text-xs text-stone-600 dark:text-stone-400">${lesson.meaning || lesson.vietnamese || ''}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="playChineseTTS(${jsArg(lesson.hanzi)}, 'female')" class="p-2 rounded-xl bg-amber-50 dark:bg-stone-800 text-[#8B1E1E] dark:text-amber-400 hover:bg-amber-100 transition-colors cursor-pointer" title="Nghe phát âm">
          <i data-lucide="volume-2" class="w-4 h-4"></i>
        </button>
        <button onclick="openWritingModal(${jsArg(lesson.hanzi ? lesson.hanzi[0] : '字')})" class="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200 transition-colors cursor-pointer">
          Tập viết
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  pathwayLessonsRendered += nextBatch.length;
  const loadMoreBtn = document.getElementById('loadMoreLessonsBtn');
  if (loadMoreBtn) {
    if (pathwayLessonsRendered >= filtered.length) {
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  }

  refreshIcons(container);
}

function loadMoreLessons() {
  renderPathwayLessonsList(false);
}


function renderPathwayResources(container) {
  const data = hsk30RoadmapData;
  const resources = data.freeResources || [];

  let html = `
    <div class="space-y-6">
      <div class="flex items-center gap-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-stone-700">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center font-bold text-lg shadow-xs">
          <i data-lucide="download-cloud" class="w-5 h-5"></i>
        </div>
        <div>
          <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">Kho Tài Liệu & Đề Thi HSK 3.0 Chuẩn Miễn Phí</h3>
          <p class="text-xs text-stone-600 dark:text-stone-400">Tổng hợp giáo trình chính thống, đề thi thử mô phỏng 4 kỹ năng và sổ tay từ vựng từ Tiếng Trung Thượng Hải.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${resources.map(res => `
          <div class="glass-card rounded-2xl p-6 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  ${res.badge}
                </span>
                <span class="text-xs font-mono font-medium text-stone-500 dark:text-stone-400">
                  ${res.format}
                </span>
              </div>

              <h4 class="text-base font-bold font-serif-luxury text-stone-900 dark:text-stone-100">
                ${res.name}
              </h4>

              <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                ${res.desc}
              </p>
            </div>

            <div class="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800">
              <a href="${res.linkUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-[#8B1E1E] dark:text-amber-300 border border-amber-200 dark:border-stone-700 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all">
                <span>Tải xuống & Xem tài liệu gốc</span>
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}


// =========================================================================
// TAB: GIÁO TRÌNH CHUẨN HSK 3.0 TOÀN TẬP (DEDICATED TOP-LEVEL VIEW)
// =========================================================================
let currentHsk30DedicatedFilter = 0;
let currentHsk30DedicatedSearchQuery = '';

async function renderHsk30DedicatedTab() {
  if (!hsk30RoadmapData && typeof loadData === 'function') {
    await loadData('hsk30Roadmap');
  }
  const container = document.getElementById('hsk30DedicatedCardsContainer');
  if (!container) return;
  renderHsk30DedicatedCards(container);
  if (window.lucide) lucide.createIcons();
}

function filterHsk30DedicatedLevel(level) {
  currentHsk30DedicatedFilter = level;
  const levels = [0, 1, 2, 3, 4];
  levels.forEach(lvl => {
    const btn = document.getElementById(`btn-hsk30-dedicated-${lvl}`);
    if (!btn) return;
    if (lvl === level) {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer';
    } else {
      btn.className = 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap cursor-pointer';
    }
  });
  const container = document.getElementById('hsk30DedicatedCardsContainer');
  if (container) renderHsk30DedicatedCards(container);
}

function searchHsk30DedicatedLessons(query) {
  currentHsk30DedicatedSearchQuery = (query || '').trim().toLowerCase();
  const container = document.getElementById('hsk30DedicatedCardsContainer');
  if (container) renderHsk30DedicatedCards(container);
}

function renderHsk30DedicatedCards(container) {
  if (!container || !hsk30RoadmapData) return;
  const allLessons = hsk30RoadmapData.standardCourse68Lessons || hsk30RoadmapData.standardCourseLessons || hsk30RoadmapData.standardCourse48Lessons || [];

  const filtered = allLessons.filter(l => {
    const matchLevel = (currentHsk30DedicatedFilter === 0) || (Number(l.hskLevel) === Number(currentHsk30DedicatedFilter));
    if (!matchLevel) return false;
    if (!currentHsk30DedicatedSearchQuery) return true;
    const q = currentHsk30DedicatedSearchQuery;
    return (l.titleZh && l.titleZh.toLowerCase().includes(q)) ||
           (l.titleVi && l.titleVi.toLowerCase().includes(q)) ||
           (l.grammar && l.grammar.toLowerCase().includes(q)) ||
           (l.vocabTheme && l.vocabTheme.toLowerCase().includes(q));
  });

  const totalEl = document.getElementById('hsk30DedicatedTotalCount');
  if (totalEl) totalEl.textContent = allLessons.length;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="glass-card rounded-2xl p-8 text-center text-stone-500">
        Không tìm thấy bài học nào phù hợp với bộ lọc "${currentHsk30DedicatedSearchQuery}".
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${filtered.map(l => `
        <div onclick="openHsk30LessonModal(${l.hskLevel}, ${l.lessonNumber})" class="glass-card rounded-2xl p-4 bg-white dark:bg-[#161B22] border border-amber-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${l.hskLevel === 1 ? 'bg-blue-100 text-blue-800' : (l.hskLevel === 2 ? 'bg-emerald-100 text-emerald-800' : (l.hskLevel === 3 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'))}">
                HSK ${l.hskLevel} · Bài ${l.lessonNumber}
              </span>
              <button onclick="event.stopPropagation(); playChineseTTS(${jsArg(l.titleZh)})" class="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors" title="Nghe tiêu đề">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
            <div>
              <h5 class="font-hanzi font-black text-base text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 transition-colors">${l.titleZh}</h5>
              <p class="text-xs text-stone-500 dark:text-stone-400 italic">${l.titlePinyin || ''}</p>
              <p class="text-xs font-medium text-stone-700 dark:text-stone-300 mt-0.5">${l.titleVi}</p>
            </div>
            <div class="p-2 rounded-xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700 text-2xs space-y-1">
              <p><strong>Ngữ pháp:</strong> ${l.grammar || l.focus || 'Trọng điểm ngữ pháp'}</p>
              <p><strong>Chủ đề từ:</strong> ${l.vocabTheme || l.vocabularyTheme || 'Từ vựng giao tiếp'}</p>
            </div>
            ${l.dialogueZh ? `
              <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-2xs space-y-1">
                <p class="font-hanzi font-bold text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed">${l.dialogueZh}</p>
                <p class="text-stone-500 dark:text-stone-400 whitespace-pre-line">${l.dialogueVi}</p>
              </div>
            ` : ''}
          </div>
          
          <div class="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            ${l.tip ? `
              <div class="text-[11px] text-amber-800 dark:text-amber-400 italic leading-snug">
                💡 ${l.tip}
              </div>
            ` : ''}
            <button onclick="event.stopPropagation(); openHsk30LessonModal(${l.hskLevel}, ${l.lessonNumber})" class="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-100/80 hover:bg-gradient-to-r hover:from-amber-600 hover:to-amber-700 hover:text-white text-stone-800 dark:bg-stone-800 dark:hover:bg-amber-600 dark:text-stone-200 dark:hover:text-white border border-amber-300/80 dark:border-stone-700 shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
              <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
              <span>Xem Chi Tiết Bài Học →</span>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}
