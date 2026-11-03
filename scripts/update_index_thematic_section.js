const fs = require('fs');

// 1. UPDATE index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

const oldHeaderSection = `              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-950 border border-emerald-200 text-xs font-bold mb-3">
                <i data-lucide="layout-grid" class="w-3.5 h-3.5 text-emerald-800"></i>
                <span>14 Chủ Đề Thực Tế & Giao Tiếp Đời Sống Chuyên Sâu</span>
              </div>
              <h2 class="text-2xl lg:text-3xl font-serif-luxury font-black text-stone-900 tracking-tight mb-2">
                Từ Vựng Tiếng Trung Theo Chủ Đề (主题分类词汇)
              </h2>
              <p class="text-sm text-stone-600 max-w-2xl">
                Khám phá kho từ vựng được phân loại khoa học theo 14 lĩnh vực thông dụng: Ẩm thực, Gia đình, Du lịch, Công sở, Trường học, Y tế, Mua sắm, Công nghệ... Đầy đủ câu ví dụ song ngữ ngữ cảnh và hai giọng đọc Nữ/Nam.
              </p>`;

const newHeaderSection = `              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-950 border border-emerald-200 text-xs font-bold mb-3">
                <i data-lucide="layout-grid" class="w-3.5 h-3.5 text-emerald-800"></i>
                <span>125 Chủ Đề Thực Tế & Chuyên Ngành Theo Tiếng Trung Giỏi (14,605+ Từ)</span>
              </div>
              <h2 class="text-2xl lg:text-3xl font-serif-luxury font-black text-stone-900 tracking-tight mb-2">
                Từ Vựng Tiếng Trung Theo Chủ Đề (主题分类词汇)
              </h2>
              <p class="text-sm text-stone-600 max-w-2xl">
                Đồng bộ chuyên sâu từ <strong>Tiếng Trung Giỏi (tiengtrunggioi.vn)</strong>: 125 chủ đề thực tế từ Đời sống, Gia đình, Trường học, Y tế, Kế toán, Thương mại, Khách sạn đến Kỹ thuật, Cơ khí, Hàn xì, May mặc... Đầy đủ phát âm chuẩn 2 giọng Bắc Kinh và tập viết nét.
              </p>`;

indexHtml = indexHtml.replace(oldHeaderSection, newHeaderSection);

const oldPillsSection = `            <!-- Topic Pills Container (Horizontal scrollable & wrap-friendly) -->
            <div id="topicFilterPills" class="flex flex-wrap gap-2 pt-1 pb-1">
              <!-- Dynamically populated by renderTopicPills() -->
            </div>`;

const newPillsSection = `            <!-- Fast Topic Search Filter -->
            <div class="flex items-center gap-2 pt-1 pb-1 flex-wrap">
              <div class="relative flex-1 max-w-sm">
                <i data-lucide="filter" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400"></i>
                <input 
                  id="topicPillSearchInput"
                  type="text"
                  oninput="filterTopicPills(this.value)"
                  placeholder="Lọc 125 chủ đề (vd: kế toán, y tế, hàn xì, gia đình...)..."
                  class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>
              <span id="topicPillCountBadge" class="text-[11px] font-bold text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-xl border border-emerald-200">
                125 chủ đề
              </span>
            </div>

            <!-- Topic Pills Container (Scrollable clean grid) -->
            <div id="topicFilterPills" class="flex flex-wrap gap-2 pt-1 pb-1 max-h-56 overflow-y-auto custom-scrollbar p-1.5 rounded-2xl bg-white/50 dark:bg-stone-900/40 border border-emerald-200/50 dark:border-stone-700/50">
              <!-- Dynamically populated by renderTopicPills() -->
            </div>`;

indexHtml = indexHtml.replace(oldPillsSection, newPillsSection);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Successfully updated index.html for Section 2 (125 topics from tiengtrunggioi.vn)!');
