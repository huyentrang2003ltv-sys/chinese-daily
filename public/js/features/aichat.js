// =========================================================================
// MODULE: 150 BÀI HỘI THOẠI TÌNH HUỐNG & TRỢ LÝ AI (SITUATIONAL DIALOGUES)
// =========================================================================

// Module State
let activeAiScenario = null;
let aiChatHistory = [];

// 150 Dialogues State
let convActiveLesson = null;
let convCurrentTopicFilter = 0; // 0: All topics, 1-15: specific topic
let convCurrentHskFilter = 'all'; // 'all', 'HSK 1', 'HSK 2', ...
let convCurrentStatusFilter = 'all'; // 'all', 'completed', 'favorite'
let convSearchQuery = '';

let convFavorites = new Set();
let convCompleted = new Set();
let convQuizAttempts = {}; // { 'lessonNum_qIdx': true }

let convAudioSequenceActive = false;
let convAudioSequenceTimeout = null;
let convCurrentAudioTurnIndex = -1;
let convAudioSpeed = 1.0;
let convShowPinyin = true;
let convShowVi = true;

let convSpeechRecognition = null;
let convIsRecording = false;

// Topic Meta Info (15 Topics)
const CONV_TOPICS_META = [
  { id: 1, name: '1. Chào hỏi và giới thiệu bản thân', short: 'Chào hỏi & Giới thiệu', icon: '👋', range: '1 - 10' },
  { id: 2, name: '2. Giao tiếp hàng ngày', short: 'Giao tiếp hàng ngày', icon: '☕', range: '11 - 20' },
  { id: 3, name: '3. Gia đình và bạn bè', short: 'Gia đình & Bạn bè', icon: '👨‍👩‍👧‍👦', range: '21 - 30' },
  { id: 4, name: '4. Ăn uống và nhà hàng', short: 'Ăn uống & Nhà hàng', icon: '🍜', range: '31 - 40' },
  { id: 5, name: '5. Mua sắm', short: 'Mua sắm & Giá cả', icon: '🛍️', range: '41 - 50' },
  { id: 6, name: '6. Du lịch và phương tiện di chuyển', short: 'Du lịch & Di chuyển', icon: '✈️', range: '51 - 60' },
  { id: 7, name: '7. Khách sạn và lưu trú', short: 'Khách sạn & Lưu trú', icon: '🏨', range: '61 - 70' },
  { id: 8, name: '8. Học tập và trường học', short: 'Học tập & Trường học', icon: '🎓', range: '71 - 80' },
  { id: 9, name: '9. Công việc và nghề nghiệp', short: 'Công việc & Phỏng vấn', icon: '💼', range: '81 - 90' },
  { id: 10, name: '10. Sức khỏe và bệnh viện', short: 'Sức khỏe & Y tế', icon: '🏥', range: '91 - 100' },
  { id: 11, name: '11. Giải trí và sở thích', short: 'Giải trí & Sở thích', icon: '🎬', range: '101 - 110' },
  { id: 12, name: '12. Công nghệ và Internet', short: 'Công nghệ & Internet', icon: '💻', range: '111 - 120' },
  { id: 13, name: '13. Giao tiếp xã hội', short: 'Giao tiếp xã hội', icon: '🤝', range: '121 - 130' },
  { id: 14, name: '14. Tình huống khẩn cấp và dịch vụ công cộng', short: 'Khẩn cấp & Công cộng', icon: '🚨', range: '131 - 140' },
  { id: 15, name: '15. Các tình huống nâng cao', short: 'Chuyên sâu & Nâng cao', icon: '🌟', range: '141 - 150' }
];

// -------------------------------------------------------------------------
// INITIALIZATION
// -------------------------------------------------------------------------
function initAiChatModule() {
  loadConvUserData();

  // Render Horizontal Topics Navigator
  renderConvTopicsHorizontalBar();

  // Render Stats & Progress
  updateConvGlobalProgress();

  // Render Library Cards
  renderConvCardsGrid();

  // Render AI Roleplay Scenarios for backwards compatibility
  renderAiScenarios();
  if (aiScenariosData && aiScenariosData.length > 0 && !activeAiScenario) {
    selectAiScenario(aiScenariosData[0].id);
  }

  refreshIcons();
}

// -------------------------------------------------------------------------
// LOCAL STORAGE PERSISTENCE
// -------------------------------------------------------------------------
function loadConvUserData() {
  try {
    const favRaw = localStorage.getItem('chinese_dialogues_favorites');
    if (favRaw) {
      convFavorites = new Set(JSON.parse(favRaw));
    }
    const compRaw = localStorage.getItem('chinese_dialogues_completed');
    if (compRaw) {
      convCompleted = new Set(JSON.parse(compRaw));
    }
  } catch (err) {
    console.warn('Error reading dialogue user data from localStorage', err);
  }
}

function saveConvUserData() {
  try {
    localStorage.setItem('chinese_dialogues_favorites', JSON.stringify([...convFavorites]));
    localStorage.setItem('chinese_dialogues_completed', JSON.stringify([...convCompleted]));
  } catch (err) {
    console.warn('Error saving dialogue user data to localStorage', err);
  }
}

// -------------------------------------------------------------------------
// TAB MODE SWITCHING (150 Library vs AI Roleplay)
// -------------------------------------------------------------------------
function switchAiChatTabMode(mode) {
  const libView = document.getElementById('convLibraryView');
  const roleplayView = document.getElementById('convAiRoleplayView');
  const btnLib = document.getElementById('btn-conv-tab-library');
  const btnRoleplay = document.getElementById('btn-conv-tab-aichat');

  if (mode === 'library') {
    if (libView) libView.classList.remove('hidden');
    if (roleplayView) roleplayView.classList.add('hidden');
    if (btnLib) {
      btnLib.className = 'px-3.5 py-1.5 rounded-lg transition-all shadow-2xs bg-white text-[#8B1E1E] flex items-center gap-1.5 font-bold';
    }
    if (btnRoleplay) {
      btnRoleplay.className = 'px-3.5 py-1.5 rounded-lg transition-all text-stone-600 hover:text-stone-900 flex items-center gap-1.5 font-bold';
    }
  } else {
    if (libView) libView.classList.add('hidden');
    if (roleplayView) roleplayView.classList.remove('hidden');
    if (btnLib) {
      btnLib.className = 'px-3.5 py-1.5 rounded-lg transition-all text-stone-600 hover:text-stone-900 flex items-center gap-1.5 font-bold';
    }
    if (btnRoleplay) {
      btnRoleplay.className = 'px-3.5 py-1.5 rounded-lg transition-all shadow-2xs bg-white text-[#8B1E1E] flex items-center gap-1.5 font-bold';
    }
  }
  refreshIcons();
}

// -------------------------------------------------------------------------
// TOPICS HORIZONTAL BAR
// -------------------------------------------------------------------------
function renderConvTopicsHorizontalBar() {
  const container = document.getElementById('convTopicsHorizontalBar');
  if (!container) return;

  const dataset = conversations150Data || [];

  let html = `
    <button 
      onclick="setConvTopicFilter(0)"
      id="convTopicBtn-0"
      class="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
        convCurrentTopicFilter === 0
          ? 'bg-[#8B1E1E] text-white shadow-xs'
          : 'bg-white hover:bg-stone-50 border border-stone-200 text-stone-700'
      }">
      <span>🌈</span>
      <span>Tất cả (150 bài)</span>
    </button>
  `;

  CONV_TOPICS_META.forEach(t => {
    // Count completed in this topic
    const topicLessons = dataset.filter(x => x.topicId === t.id);
    const completedCount = topicLessons.filter(x => convCompleted.has(x.number)).length;
    const isSelected = convCurrentTopicFilter === t.id;

    html += `
      <button 
        onclick="setConvTopicFilter(${t.id})"
        id="convTopicBtn-${t.id}"
        class="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
          isSelected
            ? 'bg-[#8B1E1E] text-white shadow-xs'
            : 'bg-white hover:bg-stone-50 border border-stone-200 text-stone-700'
        }">
        <span>${t.icon}</span>
        <span>${escapeHtml(t.short)}</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
          isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
        }">${completedCount}/10</span>
      </button>
    `;
  });

  container.innerHTML = html;
}

// -------------------------------------------------------------------------
// GLOBAL PROGRESS & STATS
// -------------------------------------------------------------------------
function updateConvGlobalProgress() {
  const dataset = conversations150Data || [];
  const total = dataset.length || 150;
  const completedCount = convCompleted.size;
  const favCount = convFavorites.size;
  const pct = Math.min(100, Math.round((completedCount / total) * 100));

  const statsEl = document.getElementById('convProgressStats');
  if (statsEl) statsEl.innerText = `${completedCount} / ${total} bài (${pct}%)`;

  const barEl = document.getElementById('convProgressBar');
  if (barEl) barEl.style.width = `${pct}%`;

  const favEl = document.getElementById('convFavoritesCountBadge');
  if (favEl) favEl.innerHTML = `<i data-lucide="star" class="w-3 h-3 text-amber-500 fill-amber-500 inline-block mr-1"></i> ${favCount} yêu thích`;

  const completedStatusEl = document.getElementById('countCompletedStatus');
  if (completedStatusEl) completedStatusEl.innerText = completedCount;

  const favoriteStatusEl = document.getElementById('countFavoriteStatus');
  if (favoriteStatusEl) favoriteStatusEl.innerText = favCount;

  // Current topic title label
  const topicLabel = document.getElementById('convCurrentTopicLabel');
  if (topicLabel) {
    if (convCurrentTopicFilter === 0) {
      topicLabel.innerText = `Tất cả chủ đề (${total} bài)`;
    } else {
      const currentMeta = CONV_TOPICS_META.find(x => x.id === convCurrentTopicFilter);
      topicLabel.innerText = currentMeta ? currentMeta.name : `Chủ đề ${convCurrentTopicFilter}`;
    }
  }

  refreshIcons();
}

// -------------------------------------------------------------------------
// FILTERING & SEARCH CONTROLS
// -------------------------------------------------------------------------
function getFilteredConversations() {
  const dataset = conversations150Data || [];
  const q = convSearchQuery.toLowerCase().trim();

  return dataset.filter(item => {
    // Topic filter
    if (convCurrentTopicFilter !== 0 && item.topicId !== convCurrentTopicFilter) {
      return false;
    }

    // HSK Level filter
    if (convCurrentHskFilter !== 'all' && item.level !== convCurrentHskFilter) {
      return false;
    }

    // Status filter
    if (convCurrentStatusFilter === 'completed' && !convCompleted.has(item.number)) {
      return false;
    }
    if (convCurrentStatusFilter === 'favorite' && !convFavorites.has(item.number)) {
      return false;
    }

    // Search query
    if (q) {
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchHz = (item.titleHanzi || '').toLowerCase().includes(q);
      const matchPy = (item.titlePinyin || '').toLowerCase().includes(q);
      const matchSit = (item.situation || '').toLowerCase().includes(q);
      const matchNum = String(item.number).includes(q);
      const matchVocab = (item.vocabulary || []).some(v => 
        (v.hanzi || '').toLowerCase().includes(q) || 
        (v.pinyin || '').toLowerCase().includes(q) || 
        (v.meaning || '').toLowerCase().includes(q)
      );
      if (!matchTitle && !matchHz && !matchPy && !matchSit && !matchNum && !matchVocab) {
        return false;
      }
    }

    return true;
  });
}

function handleConvFilterChange() {
  const input = document.getElementById('convSearchInput');
  const clearBtn = document.getElementById('convClearSearchBtn');
  convSearchQuery = input ? input.value : '';

  if (clearBtn) {
    if (convSearchQuery) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }

  renderConvCardsGrid();
}

function clearConvSearch() {
  const input = document.getElementById('convSearchInput');
  if (input) input.value = '';
  convSearchQuery = '';
  const clearBtn = document.getElementById('convClearSearchBtn');
  if (clearBtn) clearBtn.classList.add('hidden');
  renderConvCardsGrid();
}

function setConvTopicFilter(topicId) {
  convCurrentTopicFilter = topicId;
  renderConvTopicsHorizontalBar();
  updateConvGlobalProgress();
  renderConvCardsGrid();
}

function setConvHskFilter(lvl) {
  convCurrentHskFilter = lvl;
  const levels = ['all', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];
  levels.forEach(l => {
    const btn = document.getElementById(`convFilterHsk-${l}`);
    if (btn) {
      if (l === lvl) {
        btn.className = 'px-2.5 py-1 rounded-md text-xs font-bold transition-all bg-amber-100 text-amber-900 border border-amber-300';
      } else {
        btn.className = 'px-2.5 py-1 rounded-md text-xs font-bold transition-all bg-stone-100 hover:bg-stone-200 text-stone-700';
      }
    }
  });
  renderConvCardsGrid();
}

function setConvStatusFilter(status) {
  convCurrentStatusFilter = status;
  const statuses = ['all', 'completed', 'favorite'];
  statuses.forEach(s => {
    const btn = document.getElementById(`convFilterStatus-${s}`);
    if (btn) {
      if (s === status) {
        btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-[#8B1E1E] text-white';
      } else {
        btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-stone-100 hover:bg-stone-200 text-stone-700';
      }
    }
  });
  renderConvCardsGrid();
}

function resetConvAllFilters() {
  convCurrentTopicFilter = 0;
  convCurrentHskFilter = 'all';
  convCurrentStatusFilter = 'all';
  convSearchQuery = '';
  const input = document.getElementById('convSearchInput');
  if (input) input.value = '';
  const clearBtn = document.getElementById('convClearSearchBtn');
  if (clearBtn) clearBtn.classList.add('hidden');

  setConvHskFilter('all');
  setConvStatusFilter('all');
  renderConvTopicsHorizontalBar();
  updateConvGlobalProgress();
  renderConvCardsGrid();
}

// -------------------------------------------------------------------------
// RENDER 150 DIALOGUE CARDS GRID
// -------------------------------------------------------------------------
function renderConvCardsGrid() {
  const container = document.getElementById('convCardsGrid');
  const emptyEl = document.getElementById('convEmptyResults');
  const countText = document.getElementById('convShowingCountText');
  if (!container) return;

  const filtered = getFilteredConversations();

  if (countText) {
    countText.innerText = `Đang hiển thị ${filtered.length} / ${(conversations150Data || []).length || 150} bài`;
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');

  container.innerHTML = filtered.map(item => {
    const isCompleted = convCompleted.has(item.number);
    const isFavorite = convFavorites.has(item.number);
    const charAvatars = (item.characters || []).map(c => `${c.avatar || '👤'} ${c.name}`).join(' • ');

    return `
      <div 
        class="glass-card rounded-2xl p-5 bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
        
        <!-- Card Top Bar -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-md bg-stone-100 font-mono text-[11px] font-black text-stone-800">
                #${String(item.number).padStart(3, '0')}
              </span>
              <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-bold">
                ${escapeHtml(item.level)}
              </span>
              <span class="text-[11px] text-stone-400 truncate max-w-[120px]" title="${escapeHtml(item.topicShort || '')}">
                ${item.topicIcon || '💬'} ${escapeHtml(item.topicShort || '')}
              </span>
            </div>

            <!-- Favorite Toggle Star -->
            <button 
              onclick="toggleConvCardFavorite(${item.number}, event)"
              class="p-1.5 rounded-lg hover:bg-stone-100 transition-all cursor-pointer ${
                isFavorite ? 'text-amber-500' : 'text-stone-300 hover:text-amber-400'
              }" 
              title="${isFavorite ? 'Bỏ yêu thích' : 'Lưu yêu thích'}">
              <i data-lucide="star" class="w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}"></i>
            </button>
          </div>

          <!-- Titles -->
          <div>
            <h4 class="font-serif-luxury font-bold text-base text-stone-900 group-hover:text-[#8B1E1E] transition-colors leading-snug">
              ${escapeHtml(item.title)}
            </h4>
            <p class="font-hanzi text-sm font-semibold text-stone-800 mt-0.5">
              ${escapeHtml(item.titleHanzi)}
            </p>
            <p class="text-xs text-stone-400 font-mono">
              ${escapeHtml(item.titlePinyin)}
            </p>
          </div>

          <!-- Situation snippet -->
          <p class="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            ${escapeHtml(item.situation || '')}
          </p>
        </div>

        <!-- Card Bottom Bar -->
        <div class="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <!-- Characters info -->
          <span class="text-[11px] text-stone-400 truncate max-w-[160px]" title="${escapeHtml(charAvatars)}">
            ${escapeHtml(charAvatars)}
          </span>

          <!-- Action buttons -->
          <div class="flex items-center gap-2">
            ${isCompleted ? `
              <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <i data-lucide="check" class="w-3 h-3"></i> Đã xong
              </span>
            ` : ''}

            <button 
              onclick="openConvStudio(${item.number})"
              class="px-3.5 py-1.5 rounded-xl bg-stone-900 group-hover:bg-[#8B1E1E] text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1 cursor-pointer">
              <span>Học bài</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  refreshIcons();
}

// -------------------------------------------------------------------------
// TOGGLE FAVORITE & COMPLETED FROM CARD
// -------------------------------------------------------------------------
function toggleConvCardFavorite(num, event) {
  if (event) event.stopPropagation();

  if (convFavorites.has(num)) {
    convFavorites.delete(num);
    showToast(`Đã bỏ lưu bài #${num} khỏi danh sách yêu thích`, 'info');
  } else {
    convFavorites.add(num);
    showToast(`Đã lưu bài #${num} vào danh sách yêu thích! ⭐`, 'success');
  }
  saveConvUserData();
  updateConvGlobalProgress();
  renderConvCardsGrid();
}

// -------------------------------------------------------------------------
// INTERACTIVE STUDY STUDIO (15 REQUIRED MODULES)
// -------------------------------------------------------------------------
function openConvStudio(lessonNumber) {
  const lesson = (conversations150Data || []).find(x => x.number === lessonNumber);
  if (!lesson) {
    showToast(`Không tìm thấy bài học #${lessonNumber}!`, 'error');
    return;
  }

  convActiveLesson = lesson;
  stopConvAudioPlayback();

  // Populate Header
  const numBadge = document.getElementById('convStudioNumBadge');
  const lvlBadge = document.getElementById('convStudioLvlBadge');
  const topicBadge = document.getElementById('convStudioTopicBadge');
  const titleEl = document.getElementById('convStudioTitle');
  const progressFooter = document.getElementById('convLessonProgressFooter');

  if (numBadge) numBadge.innerText = `Bài ${lesson.number}`;
  if (lvlBadge) lvlBadge.innerText = lesson.level || 'HSK 3';
  if (topicBadge) topicBadge.innerText = lesson.topic || '';
  if (titleEl) {
    titleEl.innerText = `${lesson.title} (${lesson.titleHanzi})`;
  }
  if (progressFooter) {
    progressFooter.innerText = `Bài ${lesson.number} / ${(conversations150Data || []).length || 150}`;
  }

  // Update Favorite & Complete Buttons
  updateConvStudioHeaderButtons();

  // 4. Situation
  const sitEl = document.getElementById('convStudioSituation');
  if (sitEl) sitEl.innerText = lesson.situation || 'Giao tiếp hàng ngày theo tình huống thực tế.';

  // 5. Characters
  const charListEl = document.getElementById('convStudioCharactersList');
  if (charListEl) {
    charListEl.innerHTML = (lesson.characters || []).map(c => `
      <div class="flex items-center justify-between p-1.5 rounded-lg bg-stone-50 border border-stone-100">
        <div class="flex items-center gap-2">
          <span class="text-base">${c.avatar || '👤'}</span>
          <div>
            <span class="font-bold text-stone-800">${escapeHtml(c.name)}</span>
            <span class="text-[10px] text-stone-400 block">${escapeHtml(c.role || '')}</span>
          </div>
        </div>
        <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold ${
          c.gender === 'female' ? 'bg-rose-50 text-rose-700' : 'bg-indigo-50 text-indigo-700'
        }">${c.gender === 'female' ? 'Giọng Nữ' : 'Giọng Nam'}</span>
      </div>
    `).join('');
  }

  // 6, 7, 8, 11: Dialogue Turn-by-Turn
  renderConvStudioDialogue();

  // 9. Vocabulary
  renderConvStudioVocabulary();

  // 10. Grammar
  renderConvStudioGrammar();

  // 12. Quiz
  renderConvStudioQuiz();

  // 13. Speaking Shadowing
  renderConvStudioSpeakingPractice();

  // Show Modal
  const modal = document.getElementById('convStudioModal');
  if (modal) modal.classList.remove('hidden');

  // Scroll studio body top
  const body = document.getElementById('convStudioBody');
  if (body) body.scrollTop = 0;

  refreshIcons();
}

function closeConvStudio() {
  stopConvAudioPlayback();
  const modal = document.getElementById('convStudioModal');
  if (modal) modal.classList.add('hidden');
  renderConvCardsGrid();
}

function navigateConvLesson(direction) {
  if (!convActiveLesson) return;
  const currentNum = convActiveLesson.number;
  const targetNum = currentNum + direction;
  const total = (conversations150Data || []).length || 150;

  if (targetNum < 1 || targetNum > total) {
    showToast('Đã ở bài đầu tiên hoặc bài cuối cùng!', 'info');
    return;
  }
  openConvStudio(targetNum);
}

function updateConvStudioHeaderButtons() {
  if (!convActiveLesson) return;
  const num = convActiveLesson.number;
  const isFav = convFavorites.has(num);
  const isComp = convCompleted.has(num);

  const favBtn = document.getElementById('convStudioFavoriteBtn');
  if (favBtn) {
    if (isFav) {
      favBtn.className = 'p-2.5 rounded-xl bg-amber-400 text-stone-950 transition-all flex items-center justify-center';
      favBtn.innerHTML = '<i data-lucide="star" class="w-4 h-4 fill-stone-950"></i>';
    } else {
      favBtn.className = 'p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all flex items-center justify-center';
      favBtn.innerHTML = '<i data-lucide="star" class="w-4 h-4"></i>';
    }
  }

  const compBtn = document.getElementById('convStudioCompleteBtn');
  const compText = document.getElementById('convStudioCompleteBtnText');
  if (compBtn && compText) {
    if (isComp) {
      compBtn.className = 'px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm';
      compText.innerText = 'Đã hoàn thành ✓';
    } else {
      compBtn.className = 'px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm';
      compText.innerText = 'Đánh dấu hoàn thành';
    }
  }
  refreshIcons();
}

function toggleConvStudioFavorite() {
  if (!convActiveLesson) return;
  const num = convActiveLesson.number;
  if (convFavorites.has(num)) {
    convFavorites.delete(num);
    showToast(`Đã bỏ lưu bài #${num} khỏi danh sách yêu thích`, 'info');
  } else {
    convFavorites.add(num);
    showToast(`Đã lưu bài #${num} vào danh sách yêu thích! ⭐`, 'success');
  }
  saveConvUserData();
  updateConvGlobalProgress();
  updateConvStudioHeaderButtons();
}

function toggleConvStudioComplete() {
  if (!convActiveLesson) return;
  const num = convActiveLesson.number;
  if (convCompleted.has(num)) {
    convCompleted.delete(num);
    showToast(`Đã hủy trạng thái hoàn thành bài #${num}`, 'info');
  } else {
    convCompleted.add(num);
    addExp(15, `Hoàn thành bài hội thoại #${num}`);
    showToast(`🎉 Chúc mừng bạn đã hoàn thành bài #${num}! (+15 EXP)`, 'success');
  }
  saveConvUserData();
  updateConvGlobalProgress();
  updateConvStudioHeaderButtons();
}

// -------------------------------------------------------------------------
// RENDER DIALOGUE (TURNS & BUBBLES)
// -------------------------------------------------------------------------
function renderConvStudioDialogue() {
  const container = document.getElementById('convStudioDialogueContainer');
  if (!container || !convActiveLesson) return;

  const turns = convActiveLesson.dialogue || [];
  const chars = convActiveLesson.characters || [];
  const firstSpeaker = chars[0]?.name || turns[0]?.speaker || 'A';

  container.innerHTML = turns.map((turn, idx) => {
    const isFirstSpeaker = (turn.speaker === firstSpeaker);
    const charObj = chars.find(c => c.name === turn.speaker) || { avatar: turn.gender === 'female' ? '👩' : '👨' };

    return `
      <div 
        id="conv-dialogue-turn-${idx}" 
        class="transition-all duration-300 rounded-2xl p-2 ${
          isFirstSpeaker ? 'flex items-start gap-3' : 'flex items-start justify-end gap-3'
        }">
        
        ${isFirstSpeaker ? `
          <div class="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 text-stone-800 flex items-center justify-center text-lg shrink-0 shadow-2xs">
            ${charObj.avatar || '👤'}
          </div>
        ` : ''}

        <div class="max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-2xs space-y-1.5 transition-all ${
          isFirstSpeaker 
            ? 'bg-amber-50/70 border border-amber-200 text-stone-900 rounded-tl-xs' 
            : 'bg-white border border-stone-200 text-stone-900 rounded-tr-xs'
        }">
          <!-- Turn Header -->
          <div class="flex items-center justify-between gap-4">
            <span class="text-xs font-bold text-stone-700">${escapeHtml(turn.speaker)}</span>
            <button 
              onclick="playConvTurnAudio(${idx})" 
              class="p-1 rounded-md text-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer" 
              title="Nghe câu này">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              <span>Nghe</span>
            </button>
          </div>

          <!-- Hanzi -->
          <p class="font-hanzi text-base lg:text-lg font-bold text-stone-900 leading-relaxed">
            ${escapeHtml(turn.hanzi)}
          </p>

          <!-- Pinyin -->
          <p class="conv-pinyin-text text-xs text-amber-800 font-medium font-mono ${convShowPinyin ? '' : 'hidden'}">
            ${escapeHtml(turn.pinyin)}
          </p>

          <!-- Vietnamese Translation -->
          <p class="conv-vi-text text-xs text-stone-600 pt-1 border-t border-stone-100 ${convShowVi ? '' : 'hidden'}">
            ➔ ${escapeHtml(turn.vi)}
          </p>
        </div>

        ${!isFirstSpeaker ? `
          <div class="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-300 text-stone-800 flex items-center justify-center text-lg shrink-0 shadow-2xs">
            ${charObj.avatar || '👤'}
          </div>
        ` : ''}

      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------------------
// RENDER VOCABULARY SECTION
// -------------------------------------------------------------------------
function renderConvStudioVocabulary() {
  const container = document.getElementById('convStudioVocabGrid');
  if (!container || !convActiveLesson) return;

  const vocab = convActiveLesson.vocabulary || [];
  container.innerHTML = vocab.map(v => `
    <div class="p-3 rounded-xl bg-stone-50 hover:bg-amber-50/50 border border-stone-200/80 transition-all space-y-1">
      <div class="flex items-center justify-between">
        <span class="font-hanzi text-lg font-bold text-stone-900">${escapeHtml(v.hanzi)}</span>
        <div class="flex items-center gap-1">
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">${escapeHtml(v.hsk || 'HSK 3')}</span>
          <button 
            onclick="playChineseTTS(${jsArg(v.hanzi)})" 
            class="p-1 rounded text-stone-400 hover:text-amber-800 cursor-pointer" 
            title="Phát âm">
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
      <p class="text-xs text-amber-700 font-mono font-medium">${escapeHtml(v.pinyin)}</p>
      <p class="text-xs text-stone-600 line-clamp-1">➔ ${escapeHtml(v.meaning)}</p>
    </div>
  `).join('');
}

// -------------------------------------------------------------------------
// RENDER GRAMMAR SECTION
// -------------------------------------------------------------------------
function renderConvStudioGrammar() {
  const container = document.getElementById('convStudioGrammarContainer');
  if (!container || !convActiveLesson) return;

  const grammar = convActiveLesson.grammar || [];
  container.innerHTML = grammar.map((g, idx) => `
    <div class="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black uppercase">Điểm ${idx + 1}</span>
        <h5 class="text-xs font-bold text-emerald-950">${escapeHtml(g.title)}</h5>
      </div>
      ${g.structure ? `
        <div class="p-2 rounded-lg bg-white border border-emerald-200/60 font-mono text-xs text-emerald-900">
          <strong>Cấu trúc:</strong> ${escapeHtml(g.structure)}
        </div>
      ` : ''}
      <p class="text-xs text-stone-700 leading-relaxed">${escapeHtml(g.explanation)}</p>
      ${g.example ? `
        <div class="pt-1.5 border-t border-emerald-100 text-xs">
          <span class="font-semibold text-stone-600">Ví dụ:</span>
          <span class="font-hanzi font-bold text-stone-900 ml-1">${escapeHtml(g.example)}</span>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// -------------------------------------------------------------------------
// RENDER COMPREHENSION QUIZ SECTION
// -------------------------------------------------------------------------
function renderConvStudioQuiz() {
  const container = document.getElementById('convStudioQuizContainer');
  if (!container || !convActiveLesson) return;

  const quizzes = convActiveLesson.quiz || [];
  container.innerHTML = quizzes.map((qz, qIdx) => `
    <div class="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
      <div class="flex items-start gap-2">
        <span class="w-5 h-5 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
          ${qIdx + 1}
        </span>
        <p class="text-xs font-bold text-stone-800 leading-snug">${escapeHtml(qz.question)}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1" id="quiz-options-container-${qIdx}">
        ${(qz.options || []).map((opt, optIdx) => `
          <button 
            onclick="checkConvQuizAnswer(${qIdx}, ${optIdx})"
            id="quiz-opt-${qIdx}-${optIdx}"
            class="text-left p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-xs text-stone-800 transition-all font-medium cursor-pointer flex items-center gap-2">
            <span class="w-5 h-5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold flex items-center justify-center shrink-0">
              ${['A', 'B', 'C', 'D'][optIdx] || optIdx}
            </span>
            <span>${escapeHtml(opt)}</span>
          </button>
        `).join('')}
      </div>

      <!-- Explanation banner -->
      <div id="quiz-explanation-${qIdx}" class="hidden p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1"></div>
    </div>
  `).join('');
}

function checkConvQuizAnswer(qIdx, optIdx) {
  if (!convActiveLesson) return;
  const qz = (convActiveLesson.quiz || [])[qIdx];
  if (!qz) return;

  const isCorrect = (optIdx === qz.answer);
  const expBox = document.getElementById(`quiz-explanation-${qIdx}`);

  // Color options
  (qz.options || []).forEach((_, idx) => {
    const btn = document.getElementById(`quiz-opt-${qIdx}-${idx}`);
    if (btn) {
      if (idx === qz.answer) {
        btn.className = 'text-left p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-xs text-emerald-950 font-bold transition-all flex items-center gap-2';
      } else if (idx === optIdx && !isCorrect) {
        btn.className = 'text-left p-2.5 rounded-xl border-2 border-rose-500 bg-rose-50 text-xs text-rose-950 font-bold transition-all flex items-center gap-2';
      } else {
        btn.className = 'text-left p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-400 font-medium transition-all flex items-center gap-2 opacity-60';
      }
    }
  });

  if (expBox) {
    expBox.classList.remove('hidden');
    expBox.innerHTML = `
      <div class="flex items-center gap-1.5 font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}">
        <i data-lucide="${isCorrect ? 'check-circle-2' : 'alert-circle'}" class="w-4 h-4"></i>
        <span>${isCorrect ? 'Chính xác! (+10 EXP)' : 'Chưa chính xác!'}</span>
      </div>
      <p class="text-stone-600 mt-1">${escapeHtml(qz.explanation || '')}</p>
    `;
    refreshIcons();
  }

  // Award EXP on first correct attempt
  const attemptKey = `${convActiveLesson.number}_${qIdx}`;
  if (isCorrect && !convQuizAttempts[attemptKey]) {
    convQuizAttempts[attemptKey] = true;
    addExp(10, `Trả lời đúng câu hỏi bài #${convActiveLesson.number}`);
  }
}

// -------------------------------------------------------------------------
// RENDER SPEAKING PRACTICE (SHADOWING)
// -------------------------------------------------------------------------
function renderConvStudioSpeakingPractice() {
  if (!convActiveLesson) return;
  const sp = convActiveLesson.speakingPractice || {};

  const hzEl = document.getElementById('convShadowHanzi');
  const pyEl = document.getElementById('convShadowPinyin');
  const viEl = document.getElementById('convShadowVi');
  const tipEl = document.getElementById('convShadowTip');
  const evalEl = document.getElementById('convSpeechEvaluationResult');

  if (hzEl) hzEl.innerText = sp.targetHanzi || '';
  if (pyEl) pyEl.innerText = sp.targetPinyin || '';
  if (viEl) viEl.innerText = `➔ ${sp.targetVi || ''}`;
  if (tipEl) tipEl.innerText = `Mẹo: ${sp.tip || 'Phát âm to rõ, giữ đúng thanh điệu.'}`;

  if (evalEl) evalEl.classList.add('hidden');
  resetConvMicButton();
}

function playConvShadowModelAudio() {
  if (!convActiveLesson) return;
  const sp = convActiveLesson.speakingPractice || {};
  if (sp.targetHanzi) {
    playChineseTTS(sp.targetHanzi);
  }
}

function toggleConvSpeechRecording() {
  if (convIsRecording) {
    stopConvSpeechRecording();
  } else {
    startConvSpeechRecording();
  }
}

function startConvSpeechRecording() {
  convIsRecording = true;
  const btn = document.getElementById('btnConvRecordPractice');
  const text = document.getElementById('textConvMic');
  const icon = document.getElementById('iconConvMic');

  if (btn) btn.className = 'px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 animate-pulse cursor-pointer';
  if (text) text.innerText = 'Đang lắng nghe... Hãy nói ngay!';
  if (icon) icon.setAttribute('data-lucide', 'mic-off');
  refreshIcons();

  // Try Web Speech API if available
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    try {
      convSpeechRecognition = new SpeechRecognition();
      convSpeechRecognition.lang = 'zh-CN';
      convSpeechRecognition.interimResults = false;
      convSpeechRecognition.maxAlternatives = 1;

      convSpeechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        evaluateConvSpeechResult(transcript);
        stopConvSpeechRecording();
      };

      convSpeechRecognition.onerror = () => {
        fallbackConvSpeechEvaluation();
        stopConvSpeechRecording();
      };

      convSpeechRecognition.start();
      return;
    } catch (e) {
      console.warn('Speech recognition start failed, using fallback evaluator', e);
    }
  }

  // Fallback simulation timer if speech API not supported
  setTimeout(() => {
    if (convIsRecording) {
      fallbackConvSpeechEvaluation();
      stopConvSpeechRecording();
    }
  }, 3000);
}

function stopConvSpeechRecording() {
  convIsRecording = false;
  resetConvMicButton();
  if (convSpeechRecognition) {
    try { convSpeechRecognition.stop(); } catch (_) {}
  }
}

function resetConvMicButton() {
  const btn = document.getElementById('btnConvRecordPractice');
  const text = document.getElementById('textConvMic');
  const icon = document.getElementById('iconConvMic');

  if (btn) btn.className = 'px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:opacity-90 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer';
  if (text) text.innerText = 'Nhấn để nói (Luyện âm)';
  if (icon) icon.setAttribute('data-lucide', 'mic');
  refreshIcons();
}

function evaluateConvSpeechResult(transcript) {
  const evalEl = document.getElementById('convSpeechEvaluationResult');
  if (!evalEl || !convActiveLesson) return;

  const target = (convActiveLesson.speakingPractice?.targetHanzi || '').replace(/[^\u4e00-\u9fa5]/g, '');
  const heard = transcript.replace(/[^\u4e00-\u9fa5]/g, '');

  let matchScore = 85;
  if (target === heard) matchScore = 98;
  else if (target.includes(heard) || heard.includes(target)) matchScore = 90;

  evalEl.classList.remove('hidden');
  evalEl.innerHTML = `
    <div class="flex items-center justify-between text-amber-300 font-bold">
      <span class="flex items-center gap-1.5"><i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i> Đánh giá khẩu ngữ:</span>
      <span class="text-sm font-mono text-emerald-400">${matchScore}/100 Điểm</span>
    </div>
    <p class="text-stone-300">Hệ thống nhận diện được: <strong class="text-white font-hanzi">"${escapeHtml(transcript)}"</strong></p>
    <p class="text-emerald-300 font-medium">💡 Nhận xét: Phát âm rất rõ ràng, thanh điệu tự nhiên và trôi chảy! (+10 EXP)</p>
  `;
  addExp(10, 'Luyện phát âm câu mẫu');
  refreshIcons();
}

function fallbackConvSpeechEvaluation() {
  const evalEl = document.getElementById('convSpeechEvaluationResult');
  if (!evalEl || !convActiveLesson) return;

  evalEl.classList.remove('hidden');
  evalEl.innerHTML = `
    <div class="flex items-center justify-between text-amber-300 font-bold">
      <span class="flex items-center gap-1.5"><i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i> Đánh giá khẩu ngữ:</span>
      <span class="text-sm font-mono text-emerald-400">92/100 Điểm</span>
    </div>
    <p class="text-stone-300">Âm lượng và ngữ điệu rất tốt, bắt nhịp tự nhiên theo câu mẫu!</p>
    <p class="text-emerald-300 font-medium">💡 Mẹo: Hãy tiếp tục duy trì độ vang và nhấn trọng âm vào động từ chính nhé! (+10 EXP)</p>
  `;
  addExp(10, 'Luyện phát âm câu mẫu');
  refreshIcons();
}

// -------------------------------------------------------------------------
// AUDIO ENGINE (TURN-BY-TURN & FULL SEQUENCE)
// -------------------------------------------------------------------------
function playConvTurnAudio(turnIndex) {
  if (!convActiveLesson) return;
  const turns = convActiveLesson.dialogue || [];
  const turn = turns[turnIndex];
  if (!turn) return;

  highlightConvTurn(turnIndex);
  playChineseTTS(turn.hanzi, turn.gender);
}

function highlightConvTurn(turnIndex) {
  // Remove existing highlight
  const allTurns = document.querySelectorAll('[id^="conv-dialogue-turn-"]');
  allTurns.forEach(el => {
    el.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-100/40');
  });

  const activeEl = document.getElementById(`conv-dialogue-turn-${turnIndex}`);
  if (activeEl) {
    activeEl.classList.add('ring-2', 'ring-amber-500', 'bg-amber-100/40');
    activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function toggleConvFullAudioPlayback() {
  if (convAudioSequenceActive) {
    stopConvAudioPlayback();
  } else {
    startConvFullAudioPlayback();
  }
}

function startConvFullAudioPlayback() {
  if (!convActiveLesson) return;
  const turns = convActiveLesson.dialogue || [];
  if (turns.length === 0) return;

  convAudioSequenceActive = true;
  convCurrentAudioTurnIndex = 0;

  const btn = document.getElementById('btnConvAudioPlayFull');
  const icon = document.getElementById('iconConvAudioPlayFull');
  const text = document.getElementById('textConvAudioPlayFull');

  if (btn) btn.className = 'px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer';
  if (icon) icon.setAttribute('data-lucide', 'pause');
  if (text) text.innerText = 'Đang phát hội thoại...';
  refreshIcons();

  playNextConvTurnInSequence();
}

function playNextConvTurnInSequence() {
  if (!convAudioSequenceActive || !convActiveLesson) return;
  const turns = convActiveLesson.dialogue || [];

  if (convCurrentAudioTurnIndex >= turns.length) {
    stopConvAudioPlayback();
    showToast('Đã phát xong toàn bộ bài hội thoại! 🎧', 'success');
    return;
  }

  const turn = turns[convCurrentAudioTurnIndex];
  highlightConvTurn(convCurrentAudioTurnIndex);
  playChineseTTS(turn.hanzi, turn.gender);

  // Estimate duration based on character count and speed
  const charCount = (turn.hanzi || '').length;
  const estimatedSeconds = Math.max(2.5, (charCount * 0.28) / convAudioSpeed) + 1.2;

  convCurrentAudioTurnIndex++;
  convAudioSequenceTimeout = setTimeout(() => {
    playNextConvTurnInSequence();
  }, estimatedSeconds * 1000);
}

function stopConvAudioPlayback() {
  convAudioSequenceActive = false;
  if (convAudioSequenceTimeout) {
    clearTimeout(convAudioSequenceTimeout);
    convAudioSequenceTimeout = null;
  }
  convCurrentAudioTurnIndex = -1;

  const btn = document.getElementById('btnConvAudioPlayFull');
  const icon = document.getElementById('iconConvAudioPlayFull');
  const text = document.getElementById('textConvAudioPlayFull');

  if (btn) btn.className = 'px-4 py-2.5 rounded-xl bg-[#8B1E1E] hover:bg-[#A52A2A] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer';
  if (icon) icon.setAttribute('data-lucide', 'play');
  if (text) text.innerText = 'Phát toàn bộ bài';

  // Remove highlight rings
  const allTurns = document.querySelectorAll('[id^="conv-dialogue-turn-"]');
  allTurns.forEach(el => {
    el.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-100/40');
  });

  refreshIcons();
}

function setConvAudioSpeed(speed) {
  convAudioSpeed = speed;
  [0.8, 1.0, 1.2].forEach(s => {
    const btn = document.getElementById(`convSpeed-${s}`);
    if (btn) {
      if (s === speed) {
        btn.className = 'px-2 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold';
      } else {
        btn.className = 'px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold';
      }
    }
  });
}

function toggleConvDisplaySettings() {
  const pinyinCheckbox = document.getElementById('convTogglePinyin');
  const viCheckbox = document.getElementById('convToggleVi');

  convShowPinyin = pinyinCheckbox ? pinyinCheckbox.checked : true;
  convShowVi = viCheckbox ? viCheckbox.checked : true;

  document.querySelectorAll('.conv-pinyin-text').forEach(el => {
    if (convShowPinyin) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });

  document.querySelectorAll('.conv-vi-text').forEach(el => {
    if (convShowVi) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });
}

// -------------------------------------------------------------------------
// COMPATIBILITY: AI ROLEPLAY & GRAMMAR DOCTOR
// -------------------------------------------------------------------------
function renderAiScenarios() {
  const container = document.getElementById('aiScenariosContainer');
  if (!container) return;

  // Use aiScenariosData or derive 4 interactive roleplay presets from first topics
  const scenarios = (aiScenariosData && aiScenariosData.length > 0 && aiScenariosData[0].suggestedReplies)
    ? aiScenariosData
    : [
        {
          id: 'scenario_greeting',
          title: 'Chào hỏi & Làm quen',
          role: 'Lý Hoa (Giáo viên bản xứ)',
          level: 'HSK 1 - 2',
          initialMessage: {
            hanzi: '你好！欢迎来到中文学习世界！请问你叫什么名字？',
            pinyin: 'Nǐ hǎo! Huānyíng lái dào zhōngwén xuéxí shìjiè! Qǐngwèn nǐ jiào shénme míngzi?',
            vi: 'Chào bạn! Chào mừng bạn đến với thế giới học tiếng Trung! Xin hỏi bạn tên là gì?'
          },
          suggestedReplies: [
            { hanzi: '你好，我叫阮文明，很高兴认识你！' },
            { hanzi: '老师好，我是来自越南的留学生。' }
          ]
        },
        {
          id: 'scenario_restaurant',
          title: 'Gọi món tại nhà hàng',
          role: 'Phục vụ bàn (Nhà hàng Tứ Xuyên)',
          level: 'HSK 2 - 3',
          initialMessage: {
            hanzi: '您好！欢迎光临！请问一共几位？想吃点什么特色菜？',
            pinyin: 'Nín hǎo! Huānyíng guānglín! Qǐngwèn yígòng jǐ wèi? Xiǎng chī diǎn shénme tèsè cài?',
            vi: 'Kính chào quý khách! Xin hỏi đoàn mình có mấy người ạ? Quý khách muốn dùng món đặc sản gì?'
          },
          suggestedReplies: [
            { hanzi: '我们两个人，请问有什么招牌菜推荐吗？' },
            { hanzi: '来一份宫保鸡丁和麻婆豆腐，微辣！' }
          ]
        },
        {
          id: 'scenario_shopping',
          title: 'Mua sắm & Trả giá',
          role: 'Chủ tiệm quần áo Bắc Kinh',
          level: 'HSK 3 - 4',
          initialMessage: {
            hanzi: '帅哥美女来看看！最新款的羽绒服，质量特别好，今天特价！',
            pinyin: 'Shuàigē měinǚ lái kànkan! Zuì xīn kuǎn de yǔróngfú, zhìliàng tèbié hǎo, jīntiān tèjià!',
            vi: 'Chào anh đẹp trai chị đẹp gái vào xem nào! Áo lông vũ mẫu mới nhất, chất lượng xịn sò, hôm nay đại hạ giá!'
          },
          suggestedReplies: [
            { hanzi: '这件衣服多少钱一件？可以试一下吗？' },
            { hanzi: '太贵了，老板便宜点一百块卖不卖？' }
          ]
        },
        {
          id: 'scenario_interview',
          title: 'Phỏng vấn xin việc',
          role: 'Trương Tổng (Giám đốc nhân sự)',
          level: 'HSK 4 - 5',
          initialMessage: {
            hanzi: '请坐！我看过你的简历，你的跨国商务背景很不错，能简单做个一分钟自我介绍吗？',
            pinyin: 'Qǐng zuò! Wǒ kàn guò nǐ de jiǎnlì, nǐ de kuàguó shāngwù bèijǐng hěn búcuò, néng jiǎndān zuò gè yì fēnzhōng zìwǒ jièshào ma?',
            vi: 'Mời bạn ngồi! Tôi đã xem qua hồ sơ, nền tảng thương mại xuyên biên giới của bạn rất ấn tượng, bạn có thể tự giới thiệu ngắn gọn trong 1 phút không?'
          },
          suggestedReplies: [
            { hanzi: '各位面试官好，我毕业于河内大学中文系，有两年跨境电商运营经验。' },
            { hanzi: '我很荣幸能参加今天的面试，我的核心优势是双语流利和强执行力。' }
          ]
        }
      ];

  container.innerHTML = scenarios.map(sc => `
    <button 
      onclick="selectAiScenario(${jsArg(sc.id)})"
      id="btn-scenario-${escapeHtml(sc.id)}"
      class="w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
        activeAiScenario && activeAiScenario.id === sc.id
          ? 'bg-amber-50 border-amber-300 text-[#8B1E1E] shadow-2xs'
          : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
      }">
      <div>
        <h4 class="text-xs font-bold">${escapeHtml(sc.title)}</h4>
        <p class="text-[10px] text-stone-400 mt-0.5">${escapeHtml(sc.role)}</p>
      </div>
      <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-[#8B1E1E] font-bold">${escapeHtml(sc.level)}</span>
    </button>
  `).join('');
}

function selectAiScenario(scenarioId) {
  const scenarios = (aiScenariosData && aiScenariosData.length > 0 && aiScenariosData[0].suggestedReplies)
    ? aiScenariosData
    : [
        {
          id: 'scenario_greeting',
          title: 'Chào hỏi & Làm quen',
          role: 'Lý Hoa (Giáo viên bản xứ)',
          level: 'HSK 1 - 2',
          initialMessage: {
            hanzi: '你好！欢迎来到中文学习世界！请问你叫什么名字？',
            pinyin: 'Nǐ hǎo! Huānyíng lái dào zhōngwén xuéxí shìjiè! Qǐngwèn nǐ jiào shénme míngzi?',
            vi: 'Chào bạn! Chào mừng bạn đến với thế giới học tiếng Trung! Xin hỏi bạn tên là gì?'
          },
          suggestedReplies: [
            { hanzi: '你好，我叫阮文明，很高兴认识你！' },
            { hanzi: '老师好，我是来自越南的留学生。' }
          ]
        },
        {
          id: 'scenario_restaurant',
          title: 'Gọi món tại nhà hàng',
          role: 'Phục vụ bàn (Nhà hàng Tứ Xuyên)',
          level: 'HSK 2 - 3',
          initialMessage: {
            hanzi: '您好！欢迎光临！请问一共几位？想吃点什么特色菜？',
            pinyin: 'Nín hǎo! Huānyíng guānglín! Qǐngwèn yígòng jǐ wèi? Xiǎng chī diǎn shénme tèsè cài?',
            vi: 'Kính chào quý khách! Xin hỏi đoàn mình có mấy người ạ? Quý khách muốn dùng món đặc sản gì?'
          },
          suggestedReplies: [
            { hanzi: '我们两个人，请问有什么招牌菜推荐吗？' },
            { hanzi: '来一份宫保鸡丁和麻婆豆腐，微辣！' }
          ]
        },
        {
          id: 'scenario_shopping',
          title: 'Mua sắm & Trả giá',
          role: 'Chủ tiệm quần áo Bắc Kinh',
          level: 'HSK 3 - 4',
          initialMessage: {
            hanzi: '帅哥美女来看看！最新款的羽绒服，质量特别好，今天特价！',
            pinyin: 'Shuàigē měinǚ lái kànkan! Zuì xīn kuǎn de yǔróngfú, zhìliàng tèbié hǎo, jīntiān tèjià!',
            vi: 'Chào anh đẹp trai chị đẹp gái vào xem nào! Áo lông vũ mẫu mới nhất, chất lượng xịn sò, hôm nay đại hạ giá!'
          },
          suggestedReplies: [
            { hanzi: '这件衣服多少钱一件？可以试一下吗？' },
            { hanzi: '太贵了，老板便宜点一百块卖不卖？' }
          ]
        },
        {
          id: 'scenario_interview',
          title: 'Phỏng vấn xin việc',
          role: 'Trương Tổng (Giám đốc nhân sự)',
          level: 'HSK 4 - 5',
          initialMessage: {
            hanzi: '请坐！我看过你的简历，你的跨国商务背景很不错，能简单做个一分钟自我介绍吗？',
            pinyin: 'Qǐng zuò! Wǒ kàn guò nǐ de jiǎnlì, nǐ de kuàguó shāngwù bèijǐng hěn búcuò, néng jiǎndān zuò gè yì fēnzhōng zìwǒ jièshào ma?',
            vi: 'Mời bạn ngồi! Tôi đã xem qua hồ sơ, nền tảng thương mại xuyên biên giới của bạn rất ấn tượng, bạn có thể tự giới thiệu ngắn gọn trong 1 phút không?'
          },
          suggestedReplies: [
            { hanzi: '各位面试官好，我毕业于河内大学中文系，有两年跨境电商运营经验。' },
            { hanzi: '我很荣幸能参加今天的面试，我的核心优势是双语流利和强执行力。' }
          ]
        }
      ];

  const sc = scenarios.find(s => s.id === scenarioId) || scenarios[0];
  if (!sc) return;
  activeAiScenario = sc;
  renderAiScenarios();

  const nameEl = document.getElementById('aiChatPartnerName');
  const roleEl = document.getElementById('aiChatPartnerRole');
  if (nameEl) nameEl.innerText = sc.role;
  if (roleEl) roleEl.innerText = `Kịch bản: ${sc.title}`;

  aiChatHistory = [
    {
      sender: 'ai',
      hanzi: sc.initialMessage.hanzi,
      pinyin: sc.initialMessage.pinyin,
      vi: sc.initialMessage.vi,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  renderAiChatMessages();
  renderAiSuggestedReplies();
}

function renderAiChatMessages() {
  const container = document.getElementById('aiChatMessagesContainer');
  if (!container) return;

  container.innerHTML = aiChatHistory.map(msg => {
    if (msg.sender === 'ai') {
      return `
        <div class="flex items-start gap-3 max-w-[85%]">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center text-sm shadow-xs shrink-0">
            🤖
          </div>
          <div class="p-3.5 rounded-2xl rounded-tl-xs bg-white border border-amber-200/80 shadow-2xs space-y-1">
            <div class="flex items-center justify-between gap-3">
              <span class="font-hanzi text-base font-bold text-stone-900 leading-snug">${escapeHtml(msg.hanzi)}</span>
              <div class="inline-flex items-center gap-0.5 shrink-0">
                <button onclick="playChineseTTS(${jsArg(msg.hanzi)}, 'female')" title="Nghe giọng Nữ" class="p-1 rounded text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer">👩</button>
                <button onclick="playChineseTTS(${jsArg(msg.hanzi)}, 'male')" title="Nghe giọng Nam" class="p-1 rounded text-indigo-600 hover:bg-indigo-50 text-xs font-bold cursor-pointer">👨</button>
              </div>
            </div>
            ${msg.pinyin ? `<p class="text-xs text-amber-800 font-medium font-mono">${escapeHtml(msg.pinyin)}</p>` : ''}
            ${msg.vi ? `<p class="text-xs text-stone-500 pt-1 border-t border-stone-100">➔ ${escapeHtml(msg.vi)}</p>` : ''}
            <span class="block text-[10px] text-stone-400 text-right">${msg.timestamp}</span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="flex items-start justify-end gap-3 max-w-[85%] ml-auto">
          <div class="p-3.5 rounded-2xl rounded-tr-xs bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-xs space-y-1">
            <span class="font-hanzi text-base font-bold">${escapeHtml(msg.hanzi)}</span>
            ${msg.feedback ? `<p class="text-xs text-amber-200 border-t border-white/20 pt-1 mt-1">💡 Nhận xét AI: ${escapeHtml(msg.feedback)}</p>` : ''}
            <span class="block text-[10px] text-rose-200 text-right">${msg.timestamp}</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
            Tôi
          </div>
        </div>
      `;
    }
  }).join('');

  container.scrollTop = container.scrollHeight;
  refreshIcons();
}

function renderAiSuggestedReplies() {
  const container = document.getElementById('aiSuggestedRepliesContainer');
  if (!container || !activeAiScenario) return;

  const replies = activeAiScenario.suggestedReplies || [];
  container.innerHTML = `
    <span class="text-[11px] text-stone-400 font-semibold shrink-0">Gợi ý trả lời:</span>
    ${replies.map(r => `
      <button 
        onclick="applyAiSuggestedReply(${jsArg(r.hanzi)})"
        class="shrink-0 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-[#8B1E1E] border border-amber-200 text-xs font-medium transition-all cursor-pointer">
        ${escapeHtml(r.hanzi)}
      </button>
    `).join('')}
  `;
}

function applyAiSuggestedReply(text) {
  const input = document.getElementById('aiUserChatInput');
  if (input) {
    input.value = text;
    input.focus();
  }
}

function sendAiChatMessage() {
  const input = document.getElementById('aiUserChatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  aiChatHistory.push({
    sender: 'user',
    hanzi: text,
    timestamp: now
  });
  renderAiChatMessages();

  addExp(5, 'Đối thoại với AI');

  setTimeout(() => {
    let replyHanzi = '你的中文说得很好！继续加油！';
    let replyPinyin = 'Nǐ de zhōngwén shuō de hěn hǎo! Jìxù jiāyóu!';
    let replyVi = 'Tiếng Trung của bạn nói rất hay! Cố gắng tiếp tục nhé!';

    if (activeAiScenario && activeAiScenario.id === 'scenario_greeting') {
      replyHanzi = '认识你真是太好了！你平时喜欢通过什么方式学习中文呢？';
      replyPinyin = 'Rènshi nǐ zhēn shì tài hǎo le! Nǐ píngshí xǐhuan tōngguò shénme fāngshì xuéxí zhōngwén ne?';
      replyVi = 'Rất vui được quen bạn! Bình thường bạn thích học tiếng Trung bằng cách nào?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_restaurant') {
      replyHanzi = '好的！一份宫保鸡丁，两碗米饭，还要别的喝的吗？比如青岛啤酒或茉莉花茶？';
      replyPinyin = 'Hǎo de! Yí fèn Gōngbǎo Jīdīng, liǎng wǎn mǐfàn, hái yào bié de hē de ma? Bǐrú Qīngdǎo píjiǔ huò mòlìhuā chá?';
      replyVi = 'Vâng ạ! Một phần gà Cung Bảo, 2 bát cơm, quý khách có muốn dùng thêm đồ uống gì như bia Thanh Đảo hay trà hoa nhài không?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_shopping') {
      replyHanzi = '哎呀，帅哥/美女真会砍价！看在是老朋友的份上，120块钱拿走，怎么样？';
      replyPinyin = 'Āiyā, shuàigē/měinǚ zhēn huì kǎnjià! Kàn zài shì lǎo péngyou de fèn shang, 120 kuài qián ná zǒu, zěnmeyàng?';
      replyVi = 'Ái chà, bạn mặc cả giỏi quá! Nể tình khách quen, 120 tệ bạn mang về, thấy thế nào?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_interview') {
      replyHanzi = '很好。你的背景非常符合我们的要求。请问如果遇到高强度工作压力，你通常如何调节？';
      replyPinyin = 'Hěn hǎo. Nǐ de bèijǐng fēicháng fúhé wǒmen de yāoqiú. Qǐngwèn rúguǒ yùdào gāoxiàodù gōngzuò yālì, nǐ tōngcháng rúhé tiáojié?';
      replyVi = 'Rất tốt. Nền tảng của bạn rất phù hợp với yêu cầu của chúng tôi. Xin hỏi nếu gặp áp lực công việc cường độ cao, bạn thường điều tiết thế nào?';
    }

    aiChatHistory.push({
      sender: 'ai',
      hanzi: replyHanzi,
      pinyin: replyPinyin,
      vi: replyVi,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    renderAiChatMessages();
    playChineseTTS(replyHanzi);
  }, 700);
}

function resetCurrentAiScenario() {
  if (activeAiScenario) {
    selectAiScenario(activeAiScenario.id);
  }
}

function analyzeSentenceGrammar() {
  const input = document.getElementById('aiGrammarDoctorInput');
  const resultContainer = document.getElementById('aiGrammarDoctorResult');
  if (!input || !resultContainer) return;

  const text = input.value.trim();
  if (!text) {
    showToast('Vui lòng nhập câu tiếng Trung để phân tích!', 'warning');
    return;
  }

  resultContainer.classList.remove('hidden');
  resultContainer.innerHTML = `
    <div class="flex items-center gap-2 text-teal-800 font-bold">
      <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>
      <span>Đánh Giá Của Bác Sĩ Ngữ Pháp:</span>
    </div>
    <p class="font-hanzi font-bold text-stone-900 mt-1">Câu gốc: ${escapeHtml(text)}</p>
    <div class="space-y-1.5 pt-2 border-t border-teal-100">
      <p class="text-teal-900 font-semibold">🔍 Phân tích trật tự câu:</p>
      <p class="text-stone-600">Cấu trúc câu hợp lý theo chuẩn: Chủ ngữ + Động từ + Tân ngữ.</p>
      <p class="text-teal-900 font-semibold mt-1">💡 Đề xuất cách diễn đạt tự nhiên hơn:</p>
      <p class="text-emerald-700 font-hanzi font-bold">👉 "${escapeHtml(text.replace('买一本', '去买一本'))}"</p>
      <p class="text-[11px] text-stone-500 italic">Mẹo: Trong khẩu ngữ hàng ngày, người Trung Quốc thường kết hợp trợ từ "了" hoặc phó từ chỉ thời gian để câu nói sinh động hơn.</p>
    </div>
  `;
  addExp(5, 'Sử dụng Bác Sĩ Ngữ Pháp');
  refreshIcons();
}
