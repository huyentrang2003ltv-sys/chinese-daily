// Module state
let mindmapActiveBranch = 'all';
let mindmapSearchQuery = '';
let expandedMindmapNodes = new Set();

// ---------------- TAB 2: BẢN ĐỒ CÂY TƯ DUY NGỮ PHÁP TIẾNG TRUNG ----------------

/** Whether a mindmap node (or any of its subtypes) matches the lower-cased query. */
function mindmapNodeMatches(node, q) {
  const has = (v) => (v || '').toLowerCase().includes(q);
  return has(node.title) || has(node.summary) || has(node.formula) ||
    (node.subtypes || []).some(s => has(s.name) || has(s.formula) || has(s.usage) || has(s.example));
}

function setupMindmapControls() {
  const searchInput = document.getElementById('mindmapSearchInput');
  if (searchInput && !searchInput.dataset.initialized) {
    searchInput.dataset.initialized = 'true';
    searchInput.addEventListener('input', (e) => {
      mindmapSearchQuery = (e.target.value || '').trim().toLowerCase();
      if (mindmapSearchQuery && mindmapData && mindmapData.nodes) {
        mindmapData.nodes.forEach(node => {
          if (mindmapNodeMatches(node, mindmapSearchQuery)) expandedMindmapNodes.add(node.id);
        });
      }
      renderMindmap();
    });
  }
}

function filterMindmapBranch(branchId) {
  mindmapActiveBranch = branchId;
  const buttons = [
    { id: 'btn-branch-all', key: 'all' },
    { id: 'btn-branch-word_order', key: 'word_order' },
    { id: 'btn-branch-complements', key: 'complements' },
    { id: 'btn-branch-special_sentences', key: 'special_sentences' },
    { id: 'btn-branch-three_de', key: 'three_de' },
    { id: 'btn-branch-aspect_particles', key: 'aspect_particles' },
    { id: 'btn-branch-connectors', key: 'connectors' },
  ];

  buttons.forEach(b => {
    const el = document.getElementById(b.id);
    if (!el) return;
    if (b.key === branchId) {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs transition-all whitespace-nowrap';
    } else {
      el.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap';
    }
  });

  if (branchId !== 'all') {
    expandedMindmapNodes.add(branchId);
  }
  renderMindmap();
}

function expandAllMindmapNodes() {
  if (!mindmapData || !mindmapData.nodes) return;
  mindmapData.nodes.forEach(n => expandedMindmapNodes.add(n.id));
  renderMindmap();
}

function collapseAllMindmapNodes() {
  expandedMindmapNodes.clear();
  renderMindmap();
}

function toggleMindmapNode(nodeId) {
  if (expandedMindmapNodes.has(nodeId)) {
    expandedMindmapNodes.delete(nodeId);
  } else {
    expandedMindmapNodes.add(nodeId);
  }
  renderMindmap();
}

function renderMindmap() {
  if (!mindmapData || !mindmapData.nodes) return;
  const container = document.getElementById('mindmapNodesContainer');
  if (!container) return;

  // Filter branches according to active branch and search query
  let nodes = mindmapData.nodes;
  if (mindmapActiveBranch !== 'all') {
    nodes = nodes.filter(n => n.id === mindmapActiveBranch);
  }

  if (mindmapSearchQuery) {
    nodes = nodes.filter(node => mindmapNodeMatches(node, mindmapSearchQuery));
  }

  // Branch index map for luxury badge labeling
  const branchLabels = {
    word_order: { num: 'Nhánh 1', hanzi: '语序之轴', color: 'from-[#8B1E1E] to-[#A52A2A]' },
    complements: { num: 'Nhánh 2', hanzi: '七大补语', color: 'from-[#1E4D43] to-[#2D6A4F]' },
    special_sentences: { num: 'Nhánh 3', hanzi: '特殊句型', color: 'from-[#C59A3F] to-[#B38728]' },
    three_de: { num: 'Nhánh 4', hanzi: '三的结构', color: 'from-[#6E1414] to-[#8B1E1E]' },
    aspect_particles: { num: 'Nhánh 5', hanzi: '时态助词', color: 'from-[#1E4D43] to-[#155e75]' },
    connectors: { num: 'Nhánh 6', hanzi: '逻辑连词', color: 'from-[#854d0e] to-[#C59A3F]' }
  };

  // Build Root Tree Hub HTML (Only show when viewing all or as tree head)
  const isFiltered = mindmapActiveBranch !== 'all' || mindmapSearchQuery.length > 0;
  
  const rootTreeHtml = `
    <!-- GỐC CÂY ĐẠI THỤ NGỮ PHÁP -->
    <div class="relative bg-gradient-to-b from-[#8B1E1E] via-[#6E1414] to-[#450A0A] text-white rounded-3xl p-6 lg:p-8 shadow-xl border-2 border-[#C59A3F]/50 overflow-hidden text-center">
      <div class="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#C59A3F]/15 blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#8B1E1E]/30 blur-3xl pointer-events-none"></div>

      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C59A3F]/20 text-[#E0C27D] border border-[#C59A3F]/40 text-xs font-bold mb-3 shadow-inner">
        <span class="w-2 h-2 rounded-full bg-[#E0C27D] animate-ping"></span>
        <span>GỐC RỄ ĐẠI THỤ NGỮ PHÁP (汉语语法大树根基)</span>
      </div>

      <h3 class="text-2xl lg:text-3xl font-serif-luxury font-black text-amber-100 tracking-wide mb-3">
        Tư Duy Cốt Lõi: Ngữ Pháp Là Không Gian & Thời Gian
      </h3>

      <p class="max-w-2xl mx-auto text-xs lg:text-sm text-stone-200 leading-relaxed font-normal mb-5">
        Ngữ pháp tiếng Trung <strong>không chia thì, không biến đổi đuôi động từ</strong>, mà vận hành nghiêm ngặt theo trục tư duy điện ảnh: <em>"Cái gì xuất hiện trước, việc gì xảy ra trước thì đặt trước"</em>. Từ gốc rễ này đâm chồi thành <strong>6 Trụ Cột Nhánh Lớn</strong> và nở rộ thành <strong>26 Nhánh Con Chi Tiết</strong>.
      </p>

      <!-- Tree Overview Stats -->
      <div class="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#C59A3F]/25 text-xs">
        <div class="px-3.5 py-1.5 rounded-xl bg-black/30 border border-[#C59A3F]/30 text-amber-200 flex items-center gap-2">
          <i data-lucide="git-branch" class="w-4 h-4 text-[#E0C27D]"></i>
          <span><strong>6</strong> Trụ Cột Cây Cấp 1</span>
        </div>
        <div class="px-3.5 py-1.5 rounded-xl bg-black/30 border border-[#C59A3F]/30 text-amber-200 flex items-center gap-2">
          <i data-lucide="layers" class="w-4 h-4 text-[#E0C27D]"></i>
          <span><strong>26</strong> Nhánh Con Chi Tiết Cấp 2</span>
        </div>
        <div class="px-3.5 py-1.5 rounded-xl bg-black/30 border border-[#C59A3F]/30 text-amber-200 flex items-center gap-2">
          <i data-lucide="volume-2" class="w-4 h-4 text-[#E0C27D]"></i>
          <span>100% Phát Âm TTS & Đối Chiếu Song Ngữ</span>
        </div>
      </div>
    </div>

    <!-- THÂN CÂY PHÂN NHÁNH VÀNG HOÀNG KIM (VERTICAL TRUNK CONNECTOR) -->
    <div class="flex flex-col items-center justify-center -my-2 relative z-10">
      <div class="tree-stem-vertical h-10 w-1 bg-gradient-to-b from-[#8B1E1E] to-[#C59A3F] rounded-full"></div>
      <div class="px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-stone-700 text-xs font-bold flex items-center gap-2 shadow-sm my-1">
        <i data-lucide="git-fork" class="w-3.5 h-3.5 text-[#8B1E1E]"></i>
        <span>${isFiltered ? 'Đang lọc nhánh được chọn' : 'Thân cây tỏa ra 6 cành nhánh tư duy chính (Bấm vào cành để bung nở nhánh con)'}</span>
      </div>
      <div class="tree-stem-vertical h-8 w-1 bg-gradient-to-b from-[#C59A3F] to-[#8B1E1E] rounded-full"></div>
    </div>
  `;

  if (nodes.length === 0) {
    container.innerHTML = `
      ${rootTreeHtml}
      <div class="p-12 text-center rounded-3xl bg-white border border-amber-200 shadow-sm mt-4">
        <i data-lucide="search-x" class="w-12 h-12 text-stone-300 mx-auto mb-3"></i>
        <h4 class="text-base font-bold text-stone-700">Không tìm thấy nhánh ngữ pháp phù hợp</h4>
        <p class="text-xs text-stone-500 mt-1">Hãy thử tìm từ khóa khác như "bổ ngữ", "câu chữ ba", "thời gian", "trợ từ"...</p>
        <button onclick="document.getElementById('mindmapSearchInput').value=''; mindmapSearchQuery=''; filterMindmapBranch('all');" class="mt-4 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold">
          Xem Toàn Bộ 6 Nhánh Cây
        </button>
      </div>
    `;
    refreshIcons();
    return;
  }

  // Build Branches HTML
  const branchesHtml = nodes.map((node, nodeIdx) => {
    const isExpanded = expandedMindmapNodes.has(node.id);
    const meta = branchLabels[node.id] || { num: `Nhánh ${nodeIdx + 1}`, hanzi: '语法分支', color: 'from-[#8B1E1E] to-[#A52A2A]' };
    const subCount = node.subtypes ? node.subtypes.length : 0;

    return `
      <!-- CÀNH NHÁNH CẤP 1: ${node.title} -->
      <div class="tree-branch-container rounded-3xl border ${isExpanded ? 'border-[#C59A3F] shadow-lg ring-1 ring-[#C59A3F]/30' : 'border-amber-200/80 shadow-xs'} bg-[#FFFDF9] transition-all overflow-hidden mb-6">
        
        <!-- Header cành cây (Click để bung/thu nhánh) -->
        <div onclick="toggleMindmapNode(${jsArg(node.id)})" class="tree-branch-header p-5 lg:p-6 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${isExpanded ? 'border-amber-200' : 'border-transparent'}">
          <div class="flex items-start gap-4">
            <!-- Seal số nhánh -->
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.color} text-white font-hanzi font-bold flex flex-col items-center justify-center shrink-0 shadow-md border border-amber-300/40">
              <span class="text-xs leading-none text-amber-200 opacity-90">${meta.num}</span>
              <span class="text-sm leading-tight">${meta.hanzi.substring(0, 2)}</span>
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h3 class="text-lg lg:text-xl font-serif-luxury font-black text-stone-900 tracking-tight">
                  ${node.title}
                </h3>
                <span class="px-2.5 py-0.5 rounded-full ${isExpanded ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-600'} text-2xs font-bold">
                  ${subCount} nhánh con
                </span>
              </div>
              <p class="text-xs lg:text-sm text-stone-600 leading-relaxed max-w-2xl">${node.summary}</p>
            </div>
          </div>

          <!-- Formula & Expand/Collapse Trigger -->
          <div class="flex items-center gap-3 self-end md:self-center shrink-0">
            ${node.formula ? `
              <div class="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs font-mono font-bold text-stone-800 shadow-2xs max-w-xs truncate" title="${escapeHtml(node.formula)}">
                ${node.formula}
              </div>
            ` : ''}

            <button type="button" class="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${isExpanded ? 'bg-[#8B1E1E] text-white shadow-sm' : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200'}">
              <span>${isExpanded ? 'Thu Gọn Nhánh' : `Bung ${subCount} Nhánh Con`}</span>
              <i data-lucide="${isExpanded ? 'chevron-up' : 'chevron-down'}" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- PREVIEW MINI-CHIPS KHI NHÁNH ĐANG THU GỌN -->
        ${!isExpanded && node.subtypes ? `
          <div class="px-6 py-3 bg-amber-50/30 border-t border-amber-100/60 flex flex-wrap items-center gap-2 text-2xs">
            <span class="text-stone-400 font-semibold flex items-center gap-1">
              <i data-lucide="git-commit" class="w-3 h-3 text-[#C59A3F]"></i>
              Nhánh con:
            </span>
            ${node.subtypes.map(sub => `
              <button onclick="event.stopPropagation(); toggleMindmapNode(${jsArg(node.id)});" class="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100/70 border border-amber-200/80 text-stone-700 hover:text-stone-900 font-medium transition-all shadow-2xs">
                🌱 ${sub.name.split(':')[0]}
              </button>
            `).join('')}
            <span onclick="event.stopPropagation(); toggleMindmapNode(${jsArg(node.id)});" class="cursor-pointer text-[#8B1E1E] hover:underline font-bold ml-1">
              + Xem chi tiết ➔
            </span>
          </div>
        ` : ''}

        <!-- NỘI DUNG NHÁNH CHI TIẾT KHI ĐƯỢC BUNG NỞ (EXPANDED) -->
        ${isExpanded ? `
          <div class="p-6 lg:p-8 space-y-6 bg-gradient-to-b from-white via-[#FFFDF9] to-amber-50/20">

            <!-- Formula Banner (Mobile & Desktop) -->
            ${node.formula ? `
              <div class="p-4 rounded-2xl bg-amber-50/80 border border-amber-300/80 shadow-2xs">
                <span class="text-2xs font-bold text-amber-900 uppercase tracking-wider block mb-1">
                  Công thức tổng quát của nhánh:
                </span>
                <code class="text-xs lg:text-sm font-mono font-bold text-[#8B1E1E] break-words">
                  ${node.formula}
                </code>
              </div>
            ` : ''}

            <!-- Tư duy đối chiếu Tiếng Trung vs Tiếng Việt (Contrast with Vietnamese) -->
            ${node.contrastVi ? `
              <div class="p-4 lg:p-5 rounded-2xl bg-gradient-to-r from-red-50/60 via-amber-50/50 to-stone-50 border border-red-200/80 text-xs lg:text-sm text-stone-800 shadow-2xs">
                <div class="flex items-center gap-2 text-[#8B1E1E] font-bold mb-2">
                  <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
                  <span>So Sánh Tư Duy Ngữ Pháp Với Tiếng Việt (Tư Duy Đảo Ngược):</span>
                </div>
                <p class="leading-relaxed text-stone-700 font-normal pl-6">
                  ${node.contrastVi}
                </p>
              </div>
            ` : ''}

            <!-- 26 NHÁNH CON CHI TIẾT (SUBTYPES / LEAVES) -->
            ${node.subtypes ? `
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <i data-lucide="sparkles" class="w-4 h-4 text-[#C59A3F]"></i>
                    <h4 class="text-sm font-bold text-stone-900 uppercase tracking-wider">
                      Các Nhánh Con Chi Tiết (${node.subtypes.length} Nhánh):
                    </h4>
                  </div>
                  <span class="text-2xs text-stone-500 font-medium italic">Bấm biểu tượng loa để nghe phát âm mẫu</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  ${node.subtypes.map(sub => `
                    <div class="tree-sub-branch-leaf rounded-2xl bg-white border border-amber-200/90 p-4 lg:p-5 shadow-xs hover:border-[#C59A3F] hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <!-- Leaf Title -->
                        <div class="flex items-start justify-between gap-2 mb-2">
                          <h5 class="text-sm font-serif-luxury font-bold text-stone-900 leading-snug">
                            🍃 ${sub.name}
                          </h5>
                        </div>

                        <!-- Formula Tag -->
                        <div class="inline-block px-3 py-1 rounded-lg bg-amber-50/80 text-xs font-mono font-bold text-[#8B1E1E] border border-amber-200 mb-3 shadow-2xs">
                          ${sub.formula}
                        </div>

                        <!-- Usage -->
                        ${sub.usage ? `
                          <p class="text-xs text-stone-600 mb-2 leading-relaxed">
                            ${sub.usage}
                          </p>
                        ` : ''}

                        <!-- Mandatory Conditions -->
                        ${sub.conditions ? `
                          <div class="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-2xs text-amber-900 mb-2 leading-relaxed">
                            <strong class="font-bold text-[#8B1E1E]">⚠️ Điều kiện:</strong> ${sub.conditions}
                          </div>
                        ` : ''}

                        <!-- Memory Tip -->
                        ${sub.tip ? `
                          <div class="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-2xs text-emerald-950 mb-2 leading-relaxed">
                            <strong class="font-bold text-[#1E4D43]">💡 Mẹo nhớ:</strong> ${sub.tip}
                          </div>
                        ` : ''}
                      </div>

                      <!-- Leaf Example with TTS Audio -->
                      ${sub.example ? `
                        <div class="pt-3 mt-2 border-t border-amber-100 flex items-center justify-between gap-2">
                          <div class="text-xs font-hanzi font-medium text-stone-800 leading-relaxed">
                            ${sub.example}
                          </div>
                          <div class="inline-flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shrink-0 shadow-2xs">
                            <button 
                              type="button"
                              onclick="playChineseTTS(${jsArg(sub.example.split('(')[0].trim())}, 'female')" 
                              title="Nghe giọng Nữ"
                              class="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                            >
                              👩 Nữ
                            </button>
                            <button 
                              type="button"
                              onclick="playChineseTTS(${jsArg(sub.example.split('(')[0].trim())}, 'male')" 
                              title="Nghe giọng Nam"
                              class="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer"
                            >
                              👨 Nam
                            </button>
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Core Rules Grid -->
            ${node.rules ? `
              <div class="pt-4 border-t border-amber-200/70">
                <p class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <i data-lucide="shield-check" class="w-4 h-4 text-[#1E4D43]"></i>
                  <span>Quy Tắc Trọng Tâm Bắt Buộc Ghi Nhớ:</span>
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  ${node.rules.map(r => `
                    <div class="p-3.5 rounded-2xl bg-white border border-amber-200/80 text-xs text-stone-700 flex items-start gap-2.5 shadow-2xs">
                      <i data-lucide="check-circle-2" class="w-4 h-4 text-[#1E4D43] shrink-0 mt-0.5"></i>
                      <span class="leading-relaxed">${r}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Standard Examples -->
            ${node.examples ? `
              <div class="pt-4 border-t border-amber-200/70">
                <p class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <i data-lucide="book-open" class="w-4 h-4 text-[#8B1E1E]"></i>
                  <span>Ví Dụ Mẫu Chuẩn Khảo Thí HSK:</span>
                </p>
                <div class="space-y-2.5">
                  ${node.examples.map(ex => `
                    <div class="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/80 flex items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <p class="font-hanzi text-sm lg:text-base font-bold text-stone-900">${ex.hanzi}</p>
                        <p class="text-xs font-semibold text-[#8B1E1E] mt-0.5">${ex.pinyin}</p>
                        <p class="text-xs text-stone-600 mt-0.5">${ex.vi}</p>
                      </div>
                      <div class="inline-flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200 shrink-0 shadow-2xs">
                        <button 
                          type="button"
                          onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'female')" 
                          title="Nghe câu ví dụ giọng Nữ"
                          class="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-850 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          👩 Nữ
                        </button>
                        <button 
                          type="button"
                          onclick="playChineseTTS(${jsArg(ex.hanzi)}, 'male')" 
                          title="Nghe câu ví dụ giọng Nam"
                          class="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-850 border border-blue-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          👨 Nam
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

          </div>
        ` : ''}

      </div>
    `;
  }).join('');

  container.innerHTML = `
    ${rootTreeHtml}
    <div class="space-y-4">
      ${branchesHtml}
    </div>
  `;

  refreshIcons();
}
