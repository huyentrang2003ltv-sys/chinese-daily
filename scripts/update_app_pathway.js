const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '../app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

// 1. Add state variables if not present
if (!content.includes('let hsk30RoadmapData = null;')) {
  const targetState = 'let pathwayLessonsRendered = 0;';
  const newState = `let hsk30RoadmapData = null;\nlet currentPathwaySubTab = 'stages';\nlet currentPathwayGrammarLevel = 'HSK 1';\nlet pathwayLessonsRendered = 0;`;
  content = content.replace(targetState, newState);
  console.log('Added state variables');
}

// 2. In ensureTabRendered: change renderPathwayLessons(true) to renderPathwayTab()
const oldEnsure = `    case 'pathway':\n      renderPathwayLessons(true);\n      break;`;
const newEnsure = `    case 'pathway':\n      renderPathwayTab();\n      break;`;
if (content.includes(oldEnsure)) {
  content = content.replace(oldEnsure, newEnsure);
  console.log('Updated ensureTabRendered for pathway');
}

// 3. In initApp secondary Promise.all: fetch hsk30_roadmap.json
const oldSecondaryFetch = `      fetch('data/hanyu_jiaocheng.json').then(r => r.json()).catch(() => null),\n      fetch('data/topics.json').then(r => r.json()).catch(() => [])\n    ]).then(([dictRes, mindmapRes, confRes, practRes, cultRes, examRes, aiRes, radRes, chengRes, readRes, gramRes, jcRes, topRes]) => {`;

const newSecondaryFetch = `      fetch('data/hanyu_jiaocheng.json').then(r => r.json()).catch(() => null),\n      fetch('data/topics.json').then(r => r.json()).catch(() => []),\n      fetch('data/hsk30_roadmap.json').then(r => r.json()).catch(() => null)\n    ]).then(([dictRes, mindmapRes, confRes, practRes, cultRes, examRes, aiRes, radRes, chengRes, readRes, gramRes, jcRes, topRes, roadmapRes]) => {`;

if (content.includes(oldSecondaryFetch)) {
  content = content.replace(oldSecondaryFetch, newSecondaryFetch);
  // Add hsk30RoadmapData = roadmapRes;
  const oldAssign = `topicsData = topRes || [];`;
  const newAssign = `topicsData = topRes || [];\n      hsk30RoadmapData = roadmapRes;`;
  content = content.replace(oldAssign, newAssign);
  console.log('Updated secondary fetch in initApp');
}

// 4. Replace Tab 4 pathway implementation with the full comprehensive 6-subtab system
const oldPathwayMarker = `// ---------------- TAB 4: LỘ TRÌNH HSK 3.0 ----------------`;
const nextTabMarker = `// ---------------- TAB: LUYỆN DỊCH HSK (HIHSK PRO) ----------------`;

const startIdx = content.indexOf(oldPathwayMarker);
const endIdx = content.indexOf(nextTabMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const newPathwayCode = `// ---------------- TAB 4: LỘ TRÌNH HSK 3.0 TOÀN DIỆN (3 CẤP 9 BẬC) ----------------

function switchPathwaySubTab(subTab) {
  currentPathwaySubTab = subTab;
  const tabs = ['stages', 'standards', 'grammar', 'translation', 'lessons', 'resources'];
  tabs.forEach(tab => {
    const btn = document.getElementById(\`btn-pathway-sub-\${tab}\`);
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

  if (!hsk30RoadmapData) {
    try {
      const res = await fetch('data/hsk30_roadmap.json');
      hsk30RoadmapData = await res.json();
    } catch (e) {
      console.warn('Lỗi khi tải dữ liệu hsk30_roadmap.json:', e);
    }
  }

  if (!hsk30RoadmapData) {
    container.innerHTML = \`
      <div class="glass-card rounded-2xl p-8 text-center text-stone-500">
        <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto mb-3 text-amber-600"></i>
        <p>Đang tải dữ liệu Lộ Trình HSK 3.0...</p>
      </div>
    \`;
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

  let html = \`
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center font-bold text-lg shadow-xs">
            <i data-lucide="map" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">Lộ Trình Tự Học Chuẩn HSK 3.0 (Từ Con Số 0 Đến HSK 6 & 7-9)</h3>
            <p class="text-xs text-stone-600 dark:text-stone-400">Phân kỳ 6 giai đoạn khoa học theo phương pháp Tiếng Trung Thượng Hải: Thời lượng rõ ràng, thời gian biểu hàng ngày và chuẩn đầu ra đo lường được.</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
  \`;

  stages.forEach(st => {
    let actionBtnHtml = '';
    if (st.stageNumber === 1) {
      actionBtnHtml = \`<button onclick="goToPathwayLevel(1)" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"><span>Vào học bài HSK 1 & 2</span><i data-lucide="arrow-right" class="w-4 h-4"></i></button>\`;
    } else if (st.stageNumber === 2) {
      actionBtnHtml = \`<button onclick="goToPathwayLevel(3)" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-700 to-amber-800 hover:opacity-95 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"><span>Vào học bài HSK 3</span><i data-lucide="arrow-right" class="w-4 h-4"></i></button>\`;
    } else if (st.stageNumber === 3) {
      actionBtnHtml = \`<button onclick="goToPathwayLevel(4)" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-700 to-teal-800 hover:opacity-95 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"><span>Vào học bài HSK 4</span><i data-lucide="arrow-right" class="w-4 h-4"></i></button>\`;
    } else if (st.stageNumber === 4) {
      actionBtnHtml = \`<button onclick="goToPathwayLevel(5)" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-700 to-blue-800 hover:opacity-95 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"><span>Vào học bài HSK 5</span><i data-lucide="arrow-right" class="w-4 h-4"></i></button>\`;
    } else if (st.stageNumber === 5) {
      actionBtnHtml = \`<button onclick="goToPathwayLevel(6)" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 to-purple-800 hover:opacity-95 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"><span>Vào học bài HSK 6</span><i data-lucide="arrow-right" class="w-4 h-4"></i></button>\`;
    } else {
      actionBtnHtml = \`<button onclick="switchPathwaySubTab('translation')" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-700 to-indigo-800 hover:opacity-95 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"><span>Khám phá kỹ năng Dịch thuật HSK 7-9</span><i data-lucide="languages" class="w-4 h-4"></i></button>\`;
    }

    html += \`
      <div class="glass-card rounded-2xl p-6 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div class="space-y-4">
          <!-- Top Tag & Stage badge -->
          <div class="flex items-center justify-between gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Giai Đoạn \${st.stageNumber}
            </span>
            <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              \${st.targetLevel}
            </span>
          </div>

          <div>
            <h4 class="text-lg font-bold font-serif-luxury text-stone-900 dark:text-stone-100 mb-1">\${st.title}</h4>
            <div class="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-2">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-50 dark:bg-[#21262D] border border-stone-200 dark:border-stone-700">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-600"></i> \${st.duration}
              </span>
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-50 dark:bg-[#21262D] border border-stone-200 dark:border-stone-700">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-blue-600"></i> \${st.dailyTime}
              </span>
            </div>
          </div>

          <!-- Target stats -->
          <div class="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs">
            <strong class="text-amber-900 dark:text-amber-300">🎯 Mục tiêu chuẩn:</strong>
            <span class="text-stone-700 dark:text-stone-300 ml-1 font-medium">\${st.targetWords}</span>
          </div>

          <!-- Daily Schedule Plan -->
          <div class="space-y-2">
            <p class="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <i data-lucide="list-checks" class="w-3.5 h-3.5 text-emerald-600"></i> Thời Gian Biểu Chi Tiết Mỗi Ngày:
            </p>
            <div class="space-y-1.5">
              \${st.dailyPlan.map(p => \`
                <div class="flex items-start gap-2.5 p-2 rounded-lg bg-stone-50 dark:bg-[#21262D] text-xs text-stone-700 dark:text-stone-300 border border-stone-100 dark:border-stone-800">
                  <span class="px-2 py-0.5 rounded bg-amber-100/80 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-bold shrink-0 text-[11px]">\${p.time}</span>
                  <span class="leading-relaxed">\${p.task}</span>
                </div>
              \`).join('')}
            </div>
          </div>

          <!-- Milestone Output Ability -->
          <div class="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs leading-relaxed text-emerald-950 dark:text-emerald-200">
            <strong>⭐ Chuẩn năng lực đạt được:</strong> \${st.milestone}
          </div>
        </div>

        <div class="pt-4 mt-2">
          \${actionBtnHtml}
        </div>
      </div>
    \`;
  });

  html += \`
      </div>
    </div>
  \`;

  container.innerHTML = html;
}

function renderPathwayStandards(container) {
  const data = hsk30RoadmapData;
  const rows = data.standardsTable || [];

  let html = \`
    <div class="space-y-6">
      <!-- Philosophy Banner -->
      <div class="glass-card rounded-2xl p-6 bg-gradient-to-r from-amber-50/80 to-white dark:from-[#161B22] dark:to-[#1c222d] border border-amber-300/80 dark:border-stone-700 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-[#8B1E1E] dark:text-amber-400 flex items-center justify-center shrink-0">
            <i data-lucide="scale" class="w-5 h-5"></i>
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">Triết Lý Cải Cách HSK 3.0: Từ "Hiểu Thụ Động" Sang "Ứng Dụng Đa Chiều & Dịch Thuật"</h3>
            <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              HSK 3.0 chuyển từ cấu trúc 6 cấp truyền thống sang <strong>3 Cấp 9 Bậc</strong> (Sơ cấp 1–3, Trung cấp 4–6, Cao cấp 7–9). Khung chuẩn mới nâng tổng từ vựng lên <strong>11.092 từ</strong>, yêu cầu bắt buộc <strong>3.000 chữ Hán viết tay</strong> (nhận diện nét bút thuận, tránh lạm dụng gõ pinyin) và bổ sung kỹ năng <strong>Dịch thuật hai chiều</strong> từ HSK 4 trở lên.
            </p>
          </div>
        </div>
      </div>

      <!-- Standards Table -->
      <div class="glass-card rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm bg-white dark:bg-[#161B22]">
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-amber-100/70 dark:bg-[#21262D] text-stone-900 dark:text-stone-200 border-b border-amber-200 dark:border-stone-700 font-bold">
                <th class="p-3.5 whitespace-nowrap">Cấp Độ HSK</th>
                <th class="p-3.5 whitespace-nowrap">Phân Hạng</th>
                <th class="p-3.5 whitespace-nowrap text-stone-500">Từ HSK 2.0 (Cũ)</th>
                <th class="p-3.5 whitespace-nowrap text-[#8B1E1E] dark:text-amber-400">Từ HSK 3.0 (Mới)</th>
                <th class="p-3.5 whitespace-nowrap">Chữ Viết Tay</th>
                <th class="p-3.5 whitespace-nowrap">Ngữ Pháp</th>
                <th class="p-3.5 whitespace-nowrap">Khung CEFR</th>
                <th class="p-3.5 min-w-[280px]">Năng Lực Đầu Ra Thực Chiến</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
  \`;

  rows.forEach((r, idx) => {
    const isSpecial = r.level.includes('7');
    const rowBg = idx % 2 === 0 ? 'bg-white dark:bg-[#161B22]' : 'bg-stone-50/50 dark:bg-[#1a202c]';
    html += \`
      <tr class="\${rowBg} hover:bg-amber-50/40 dark:hover:bg-stone-800/60 transition-colors">
        <td class="p-3.5 font-bold font-serif-luxury \${isSpecial ? 'text-purple-700 dark:text-purple-400' : 'text-[#8B1E1E] dark:text-amber-300'} whitespace-nowrap">
          \${r.level}
        </td>
        <td class="p-3.5 whitespace-nowrap">
          <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
            \${r.tier}
          </span>
        </td>
        <td class="p-3.5 font-mono text-stone-400 dark:text-stone-500 line-through">
          \${r.wordsOld}
        </td>
        <td class="p-3.5 font-mono font-bold text-base text-[#8B1E1E] dark:text-amber-400">
          \${typeof r.wordsNew === 'number' ? r.wordsNew.toLocaleString() : r.wordsNew}
        </td>
        <td class="p-3.5 font-mono font-medium text-emerald-700 dark:text-emerald-400">
          \${typeof r.charsNew === 'number' ? r.charsNew.toLocaleString() : r.charsNew} chữ
        </td>
        <td class="p-3.5 font-mono text-blue-700 dark:text-blue-400">
          \${r.grammarPoints} điểm
        </td>
        <td class="p-3.5">
          <span class="px-2 py-0.5 rounded text-[11px] font-black bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
            \${r.cefr}
          </span>
        </td>
        <td class="p-3.5 leading-relaxed text-stone-600 dark:text-stone-300">
          \${r.targetAbility}
        </td>
      </tr>
    \`;
  });

  html += \`
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3 Tier Highlights -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-amber-200/80 dark:border-stone-700 space-y-2">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs font-bold">
            <i data-lucide="sprout" class="w-3.5 h-3.5"></i>
            <span>Sơ Cấp (Bậc 1 – 3)</span>
          </div>
          <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100">Xây Dựng Khẩu Ngữ & Phản Xạ</h4>
          <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Tập trung chuẩn hóa ngữ âm Pinyin, nhận diện 214 Bộ Thủ, tích lũy 2.245 từ vựng và luyện viết tay 900 chữ cơ bản. Đủ sức giao tiếp tự tin trong đời sống du lịch và sinh hoạt.
          </p>
        </div>

        <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-teal-200/80 dark:border-stone-700 space-y-2">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-300 text-xs font-bold">
            <i data-lucide="feather" class="w-3.5 h-3.5"></i>
            <span>Trung Cấp (Bậc 4 – 6)</span>
          </div>
          <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100">Kỹ Năng Dịch Thuật & Tranh Luận</h4>
          <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Tiếp cận văn bản báo chí, kinh tế, xã hội. Đòi hỏi kỹ năng biên dịch đoạn văn hai chiều Trung - Việt chuẩn xác và viết bài luận học thuật 400 - 600 chữ.
          </p>
        </div>

        <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-purple-200/80 dark:border-stone-700 space-y-2">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 text-xs font-bold">
            <i data-lucide="crown" class="w-3.5 h-3.5"></i>
            <span>Cao Cấp (Bậc 7 – 9)</span>
          </div>
          <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100">Biên & Phiên Dịch Chuyên Nghiệp</h4>
          <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Kỳ thi hợp nhất với 11.092 từ vựng, xếp hạng từ bậc 7 đến 9 dựa trên thang điểm. Đánh giá khả năng phiên dịch nối tiếp/cabin, văn bản ngoại giao và nghiên cứu văn học cổ điển.
          </p>
        </div>
      </div>
    </div>
  \`;

  container.innerHTML = html;
}

function filterPathwayGrammarLevel(lvl) {
  currentPathwayGrammarLevel = lvl;
  const container = document.getElementById('pathwayDynamicContent');
  if (container) renderPathwayGrammar(container);
}

function renderPathwayGrammar(container) {
  const data = hsk30RoadmapData;
  const sections = data.grammarSections || [];
  const currentSection = sections.find(s => s.level === currentPathwayGrammarLevel) || sections[0];

  let html = \`
    <div class="space-y-6">
      <!-- Level Tabs Selector -->
      <div class="flex items-center justify-between flex-wrap gap-3 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-stone-700">
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          \${sections.map(s => {
            const isActive = s.level === currentPathwayGrammarLevel;
            const btnClass = isActive 
              ? 'px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent'
              : 'px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700';
            return \`
              <button onclick="filterPathwayGrammarLevel('\${s.level}')" class="\${btnClass} cursor-pointer transition-all whitespace-nowrap">
                <span>\${s.level}</span>
                <span class="opacity-80 text-[11px] ml-1">(\${s.items.length} cấu trúc)</span>
              </button>
            \`;
          }).join('')}
        </div>
        <div class="text-xs text-stone-500 dark:text-stone-400">
          Tổng cộng: <strong>48 trọng tâm ngữ pháp chuẩn</strong>
        </div>
      </div>

      <!-- Section Info Banner -->
      <div class="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 flex items-center gap-2">
        <i data-lucide="info" class="w-4 h-4 text-amber-600 shrink-0"></i>
        <span>\${currentSection.description}</span>
      </div>

      <!-- Grammar Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  \`;

  currentSection.items.forEach((item, idx) => {
    html += \`
      <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm space-y-3.5 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
        <!-- Card Header -->
        <div class="flex items-start justify-between gap-2">
          <div class="space-y-1">
            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              #\${idx + 1} • \${currentSection.level}
            </span>
            <h4 class="text-base font-bold font-serif-luxury text-stone-900 dark:text-stone-100 leading-snug">
              \${item.title}
            </h4>
          </div>
          <!-- Dual-Voice TTS Audio for Example Sentence -->
          <div class="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 shrink-0">
            <button onclick="playChineseTTS('\${item.example.replace(/'/g, "\\\\'")}', 'female')" class="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-rose-50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-[11px] font-bold cursor-pointer transition-colors" title="Nghe câu ví dụ giọng Nữ">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
              <span>👩 Nữ</span>
            </button>
            <button onclick="playChineseTTS('\${item.example.replace(/'/g, "\\\\'")}', 'male')" class="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-blue-50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 text-[11px] font-bold cursor-pointer transition-colors" title="Nghe câu ví dụ giọng Nam">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-blue-600"></i>
              <span>👨 Nam</span>
            </button>
          </div>
        </div>

        <!-- Pattern Formula -->
        <div class="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs font-mono font-bold text-[#8B1E1E] dark:text-amber-300">
          📐 \${item.pattern}
        </div>

        <!-- Explanation -->
        <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          \${item.explanation}
        </p>

        <!-- Example Block -->
        <div class="p-3 rounded-xl bg-stone-50 dark:bg-[#21262D] border border-stone-200/70 dark:border-stone-700 space-y-1">
          <p class="font-hanzi text-base font-bold text-stone-900 dark:text-stone-100">\${item.example}</p>
          <p class="text-xs font-bold text-amber-700 dark:text-amber-400">\${item.pinyin}</p>
          <p class="text-xs text-stone-600 dark:text-stone-300">\${item.translation}</p>
        </div>

        <!-- Note if available -->
        \${item.notes ? \`
          <div class="text-[11px] text-stone-500 dark:text-stone-400 italic flex items-start gap-1.5 pt-1">
            <i data-lucide="lightbulb" class="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"></i>
            <span>\${item.notes}</span>
          </div>
        \` : ''}
      </div>
    \`;
  });

  html += \`
      </div>
    </div>
  \`;

  container.innerHTML = html;
}

function renderPathwayTranslation(container) {
  const data = hsk30RoadmapData;
  const transModule = data.translationModule || {};
  const vocabCats = data.modernVocabCategories || [];

  let html = \`
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
                \${transModule.title || 'Cấu Trúc Bài Thi Kỹ Năng Dịch Thuật (HSK 4 – 9)'}
              </h3>
              <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed">
                \${transModule.description || 'Kỹ năng Dịch bắt đầu xuất hiện từ HSK 4 và trở thành môn thi bắt buộc từ HSK 7–9. Yêu cầu thí sinh vừa có khả năng biên dịch văn bản chính xác, vừa phải có phản xạ phiên dịch nói trực tiếp trôi chảy.'}
              </p>
            </div>
            <button onclick="switchTab('translation')" class="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>Vào Luyện Dịch HiHSK Pro Ngay</span>
            </button>
          </div>
        </div>

        <!-- 2 Format Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          \${(transModule.formats || []).map(f => \`
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <div class="flex items-center gap-2">
                <span class="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-300">
                  <i data-lucide="\${f.type.includes('Biên') ? 'file-text' : 'mic'}" class="w-4 h-4"></i>
                </span>
                <h4 class="text-base font-bold font-serif-luxury text-stone-900 dark:text-stone-100">\${f.type}</h4>
              </div>

              <div class="text-xs space-y-2 text-stone-600 dark:text-stone-300 leading-relaxed">
                <p><strong>Hình thức thi:</strong> \${f.format}</p>
                <p><strong>Chủ đề cốt lõi:</strong> \${f.topics}</p>
                <div class="p-3 rounded-xl bg-stone-50 dark:bg-[#21262D] border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200">
                  <strong>🎯 Tiêu chí chấm điểm:</strong> \${f.criteria}
                </div>
              </div>
            </div>
          \`).join('')}
        </div>
      </div>

      <!-- Section 2: Modern Vocabulary Categories -->
      <div class="space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h3 class="text-lg font-bold font-serif-luxury text-stone-900 dark:text-stone-100">
              4 Nhóm Chủ Đề Từ Vựng Hiện Đại Mới Nhất Trong HSK 3.0
            </h3>
            <p class="text-xs text-stone-600 dark:text-stone-400">
              Cập nhật các thuật ngữ mới của Kỷ nguyên số, AI, Kinh tế nền tảng và Lối sống xanh theo chuẩn Bộ Giáo Dục Trung Quốc.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          \${vocabCats.map(cat => \`
            <div class="glass-card rounded-2xl p-5 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <div class="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
                <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury flex items-center gap-1.5">
                  <span>\${cat.category}</span>
                </h4>
                <span class="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/40">
                  \${cat.words.length} từ tiêu biểu
                </span>
              </div>

              <div class="divide-y divide-stone-100 dark:divide-stone-800">
                \${cat.words.map(w => \`
                  <div class="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-hanzi text-base font-bold text-stone-900 dark:text-stone-100 cursor-pointer hover:text-amber-700 transition-colors" onclick="openWordModalByTitle('\${w.hanzi}')">
                          \${w.hanzi}
                        </span>
                        <span class="text-xs font-bold text-amber-700 dark:text-amber-400">
                          \${w.pinyin}
                        </span>
                      </div>
                      <p class="text-xs text-stone-600 dark:text-stone-300 mt-0.5">\${w.meaning}</p>
                    </div>

                    <div class="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 shrink-0">
                      <button onclick="playChineseTTS('\${w.hanzi}', 'female')" class="p-1.5 rounded-lg bg-white dark:bg-[#21262D] hover:bg-rose-50 text-rose-800 dark:text-rose-300 text-xs cursor-pointer transition-colors" title="Nghe giọng Nữ">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
                      </button>
                      <button onclick="playChineseTTS('\${w.hanzi}', 'male')" class="p-1.5 rounded-lg bg-white dark:bg-[#21262D] hover:bg-blue-50 text-blue-800 dark:text-blue-300 text-xs cursor-pointer transition-colors" title="Nghe giọng Nam">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5 text-blue-600"></i>
                      </button>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>
          \`).join('')}
        </div>
      </div>
    </div>
  \`;

  container.innerHTML = html;
}

function renderPathwayLessonsView(container) {
  let html = \`
    <div class="space-y-6">
      <!-- Level Filter Pills for HSK 1 to 6 -->
      <div class="glass-card rounded-2xl p-4 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="text-xs font-bold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
          <i data-lucide="layers" class="w-4 h-4 text-amber-600"></i>
          <span>Chọn cấp độ bài học (1.040 bài thực tế):</span>
        </div>
        <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar p-1">
          \${[1, 2, 3, 4, 5, 6].map(lvl => {
            const isActive = lvl === currentHskLevel;
            const btnClass = isActive 
              ? 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-sm border border-transparent'
              : 'px-3.5 py-1.5 text-xs font-bold rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700';
            return \`
              <button onclick="filterPathwayLevel(\${lvl})" id="btn-hsk-\${lvl}" class="\${btnClass} cursor-pointer transition-all whitespace-nowrap">
                HSK \${lvl}
              </button>
            \`;
          }).join('')}
        </div>
      </div>

      <!-- Lessons Cards Container -->
      <div id="pathwayLessonsContainer" class="space-y-4"></div>

      <!-- Pagination / Load More -->
      <div class="flex justify-center pt-2">
        <button id="loadMoreLessonsBtn" onclick="loadMoreLessons()" class="px-6 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-[#161B22] hover:bg-amber-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer">
          <span>Xem thêm bài học tiếp theo</span>
          <i data-lucide="chevron-down" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  \`;

  container.innerHTML = html;
  renderPathwayLessonsList(true);
}

function filterPathwayLevel(level) {
  currentHskLevel = level;
  for (let l = 1; l <= 6; l++) {
    const btn = document.getElementById(\`btn-hsk-\${l}\`);
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
  if (!container) return;
  if (reset) {
    pathwayLessonsRendered = 0;
    container.innerHTML = '';
  }

  const filtered = lessonsData.filter(item => item.level === currentHskLevel);
  const nextBatch = filtered.slice(pathwayLessonsRendered, pathwayLessonsRendered + pathwayLessonsBatch);

  if (filtered.length === 0) {
    container.innerHTML = \`
      <div class="glass-card rounded-2xl p-8 text-center text-stone-500 dark:text-stone-400">
        <i data-lucide="book-open" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
        <p>Đang chuẩn bị thêm dữ liệu bài học cho cấp độ HSK \${currentHskLevel}...</p>
      </div>
    \`;
    const loadMoreBtn = document.getElementById('loadMoreLessonsBtn');
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    refreshIcons();
    return;
  }

  nextBatch.forEach(item => {
    const card = document.createElement('div');
    card.className = 'glass-card rounded-2xl p-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161B22] shadow-sm space-y-4';
    card.innerHTML = \`
      <div class="flex items-center justify-between text-xs text-slate-500">
        <span class="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 font-bold">
          HSK \${item.level} • Bài \${item.lesson}
        </span>
        <div class="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs">
          <button onclick="playChineseTTS('\${item.hanzi.replace(/'/g, "\\\\'")}', 'female')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-rose-50 text-rose-850 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu mẫu giọng Nữ">
            <i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-600"></i>
            <span>👩 Nữ</span>
          </button>
          <button onclick="playChineseTTS('\${item.hanzi.replace(/'/g, "\\\\'")}', 'male')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-blue-50 text-blue-850 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu mẫu giọng Nam">
            <i data-lucide="volume-2" class="w-3.5 h-3.5 text-blue-600"></i>
            <span>👨 Nam</span>
          </button>
        </div>
      </div>

      <div>
        <h3 class="font-hanzi text-xl lg:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-1 tracking-wide">\${item.hanzi}</h3>
        <p class="text-sm font-bold text-amber-700 dark:text-amber-400 mb-1">\${item.pinyin}</p>
        <p class="text-sm text-stone-700 dark:text-stone-300">\${item.vietnamese}</p>
      </div>

      <!-- Highlighted Words in Sentence -->
      \${item.words && item.words.length ? \`
        <div class="pt-3 border-t border-stone-100 dark:border-stone-800">
          <p class="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Từ vựng then chốt:</p>
          <div class="flex flex-wrap gap-2">
            \${item.words.map(w => \`
              <div onclick="openWordModalByTitle('\${w.title}')" class="cursor-pointer px-2.5 py-1 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 text-xs transition-colors">
                <span class="font-hanzi font-bold text-amber-950 dark:text-amber-200">\${w.title}</span>
                <span class="text-amber-700 dark:text-amber-400">(\${w.pinyin})</span>:
                <span class="text-stone-600 dark:text-stone-400">\${w.meaning}</span>
              </div>
            \`).join('')}
          </div>
        </div>
      \` : ''}

      <!-- Grammar Explanation -->
      \${item.explanation ? \`
        <div class="p-3.5 rounded-xl bg-stone-50 dark:bg-[#21262D] border border-stone-200/60 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed">
          \${item.explanation}
        </div>
      \` : ''}
    \`;
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

  refreshIcons();
}

function loadMoreLessons() {
  renderPathwayLessonsList(false);
}

function renderPathwayResources(container) {
  const data = hsk30RoadmapData;
  const resources = data.freeResources || [];

  let html = \`
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
        \${resources.map(res => \`
          <div class="glass-card rounded-2xl p-6 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950 text-[#8B1E1E] dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  \${res.badge}
                </span>
                <span class="text-xs font-mono font-medium text-stone-500 dark:text-stone-400">
                  \${res.format}
                </span>
              </div>

              <h4 class="text-base font-bold font-serif-luxury text-stone-900 dark:text-stone-100">
                \${res.name}
              </h4>

              <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                \${res.desc}
              </p>
            </div>

            <div class="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800">
              <a href="\${res.linkUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-[#8B1E1E] dark:text-amber-300 border border-amber-200 dark:border-stone-700 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all">
                <span>Tải xuống & Xem tài liệu gốc</span>
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          </div>
        \`).join('')}
      </div>
    </div>
  \`;

  container.innerHTML = html;
}

`;

  content = content.slice(0, startIdx) + newPathwayCode + content.slice(endIdx);
  console.log('Replaced pathway functions with full 6 subtab system');
}

// 5. Update window exports
const windowExportTarget = `window.toggleSaveWordFromModal = toggleSaveWordFromModal;`;
const windowExports = `window.toggleSaveWordFromModal = toggleSaveWordFromModal;
window.switchPathwaySubTab = switchPathwaySubTab;
window.renderPathwayTab = renderPathwayTab;
window.goToPathwayLevel = goToPathwayLevel;
window.filterPathwayGrammarLevel = filterPathwayGrammarLevel;
window.filterPathwayLevel = filterPathwayLevel;
window.renderPathwayLessons = renderPathwayLessonsList;
window.loadMoreLessons = loadMoreLessons;`;

if (!content.includes('window.switchPathwaySubTab = switchPathwaySubTab;')) {
  content = content.replace(windowExportTarget, windowExports);
  console.log('Exported pathway functions on window');
}

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('app.js updated successfully!');
