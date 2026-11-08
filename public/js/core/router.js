// =========================================================================
// Navigation: grouped tabs, hash routing (#/tab), lazy tab rendering
// =========================================================================

/** Every tab: label, Lucide icon, datasets it needs and how to render it the first time. */
const TABS = {
  home: { label: 'Trang chủ', icon: 'house', data: ['dictionary'], init: () => renderHomeDashboard() },
  pinyin: { label: 'Bảng phiên âm Pinyin', icon: 'volume-2', data: ['pinyinData'], init: () => initPinyinModule() },
  hsk90: {
    label: 'Khung 90 Ngày HSK 3', icon: 'flame', data: ['hsk90Curriculum'],
    init: () => { if (typeof renderHsk90Tab === 'function') renderHsk90Tab(); else if (window.renderHsk90Tab) window.renderHsk90Tab(); }
  },
  pathway: { label: 'Lộ trình HSK 3.0', icon: 'map', data: ['hsk30Roadmap'], init: () => renderPathwayTab() },
  hsk30: {
    label: 'Giáo trình HSK 3.0', icon: 'graduation-cap', data: ['hsk30Roadmap'],
    init: () => renderHsk30DedicatedTab()
  },
  jiaocheng: {
    label: 'Giáo trình Hán ngữ', icon: 'book-marked', data: ['jiaocheng'],
    init: () => { renderJiaocheng(); setupJiaochengSearch(); }
  },
  etymology: {
    label: 'Chiết tự & Gốc từ', icon: 'sparkles', data: ['etymology', 'dictionary', 'radicals', 'hanziDecompositions'],
    init: () => { renderCharacterPills(); renderEtymologyDetail(activeEtymologyIndex || 0); }
  },
  radicals: { label: '214 Bộ thủ', icon: 'grid-3x3', data: ['radicals'], init: () => { renderRadicals(); setupRadicalSearch(); } },
  dictionary: { label: 'Từ điển & Chủ đề', icon: 'book-open', data: ['dictionary', 'vocabExpansion', 'classifiers', 'polyphonicWords'], init: () => renderDictionary(true) },
  flashcards: { label: 'Flashcard ôn tập', icon: 'layers', data: ['dictionary', 'thematicVocab', 'topics', 'multidimensionalWords'], init: () => initFlashcards() },
  confusions: { label: 'Từ dễ lẫn', icon: 'split', data: ['confusions'], init: () => renderConfusions() },
  chengyu: { label: 'Thành ngữ', icon: 'scroll', data: ['chengyu'], init: () => { renderChengyu(); setupChengyuSearch(); } },
  grammar: {
    label: 'Ngữ pháp', icon: 'compass', data: ['grammar', 'mindmap', 'complements'],
    init: () => {
      renderGrammarCompendium();
      setupGrammarSearch();
      renderMindmap();
      setupMindmapControls();
      setGrammarViewMode(activeGrammarViewMode || 'mindmap');
    }
  },
  readings: { label: 'Đọc hiểu song ngữ', icon: 'book-open-check', data: ['readings'], init: () => { initReadingsModule(); setupReadingSearch(); } },
  culture: { label: 'Văn hóa & Lịch sử', icon: 'landmark', data: ['culture'], init: () => { renderCultureCards(); setupCultureSearch(); } },
  practice: {
    label: 'Luyện 4 kỹ năng', icon: 'check-square', data: ['practice', 'dictation'],
    init: () => {
      renderPractice();
      if (typeof initDictationLab === 'function') initDictationLab();
    }
  },
  translation: {
    label: 'Luyện dịch', icon: 'languages', data: ['lessons'],
    init: () => { renderTranslationLessonList(); renderTranslationStage(); }
  },
  aichat: { label: 'Hội thoại tình huống', icon: 'messages-square', data: ['aiScenarios'], init: () => initAiChatModule() },
  mockexam: { label: 'Thi thử HSK', icon: 'file-check-2', data: ['mockExam'], init: () => initMockExamModule() },
  woodblock: { label: 'Xếp khối gỗ', icon: 'puzzle', data: ['woodBlock'], init: () => initWoodBlockGame() },
  flipcard: { label: 'Lật thẻ tìm từ', icon: 'layers', data: ['flipCard'], init: () => initFlipCardGame() },
  classroom: { label: 'Lớp học thông minh', icon: 'school', data: ['dictionary', 'mockExam'], init: () => initClassroom() }
};

/** Top-level groups shown in the main nav (bottom bar on mobile). */
const NAV_GROUPS = [
  { id: 'home', label: 'Trang chủ', short: 'Trang chủ', icon: 'house', tabs: ['home'] },
  { id: 'path', label: 'Lộ trình & Ngữ âm', short: 'Lộ trình', icon: 'route', tabs: ['pinyin', 'hsk90', 'pathway', 'hsk30', 'jiaocheng'] },
  { id: 'hanzi', label: 'Chữ Hán', short: 'Chữ Hán', icon: 'type', tabs: ['etymology', 'radicals'] },
  { id: 'vocab', label: 'Từ vựng', short: 'Từ vựng', icon: 'book-a', tabs: ['dictionary', 'flashcards', 'confusions', 'chengyu'] },
  { id: 'read', label: 'Ngữ pháp & Đọc', short: 'Ngữ pháp', icon: 'library', tabs: ['grammar', 'readings', 'culture'] },
  { id: 'train', label: 'Luyện tập & Thi', short: 'Luyện thi', icon: 'target', tabs: ['practice', 'translation', 'aichat', 'mockexam', 'woodblock', 'flipcard', 'classroom'] }
];

const DEFAULT_TAB = 'home';
const TAB_ALIASES = {
  hsk90: 'hsk90',
  '90ngay': 'hsk90',
  lotrinh90: 'hsk90',
  lotrinh90ngay: 'hsk90',
  khung90ngay: 'hsk90',
  hsk30: 'hsk30',
  giaotrinhhsk: 'hsk30',
  giaotrinhhsk30: 'hsk30',
  hskcourse: 'hsk30',
  hskcourse68: 'hsk30',
  mindmap: 'grammar',
  complements: 'grammar',
  complement: 'grammar',
  bongu: 'grammar',
  today: 'home',
  pinyin: 'pinyin',
  nguam: 'pinyin',
  phienam: 'pinyin',
  bangphienam: 'pinyin',
  bangpinyin: 'pinyin',
  bophatam: 'pinyin',
  tones: 'pinyin',
  initials: 'pinyin',
  finals: 'pinyin',
  conversations: 'aichat',
  conversation: 'aichat',
  hoithoai: 'aichat',
  scenario: 'aichat',
  scenarios: 'aichat',
  dialogue: 'aichat',
  dialogues: 'aichat',
  dictation: 'practice',
  shadowing: 'practice',
  chepchinhta: 'practice',
  nghenhai: 'practice'
};
const LAST_TAB_PER_GROUP_KEY = 'yuhan_last_tab_per_group';
const RECENT_TABS_KEY = 'yuhan_recent_tabs';

let activeTab = null;
const renderedTabs = new Set();
const renderingTabs = new Map();
const lastTabPerGroup = storage.get(LAST_TAB_PER_GROUP_KEY, {}) || {};

function groupOfTab(tabId) {
  return NAV_GROUPS.find(g => g.tabs.includes(tabId)) || NAV_GROUPS[0];
}

/** "#/classroom?a=xyz" -> "classroom" */
function hashPath() {
  try {
    return decodeURIComponent((location.hash || '').replace(/^#\/?/, '').split('?')[0]).trim();
  } catch (e) {
    return '';
  }
}

/** Query parameters after the tab in the hash, e.g. #/classroom?a=xyz */
function getHashParams() {
  return new URLSearchParams((location.hash || '').split('?')[1] || '');
}

function tabFromHash() {
  const raw = hashPath();
  const tabId = TAB_ALIASES[raw] || raw;
  return TABS[tabId] ? tabId : null;
}

function renderNav() {
  const group = groupOfTab(activeTab);

  const groupButton = (g, variant) => {
    const isActive = g.id === group.id;
    const base = variant === 'bottom'
      ? 'nav-group-bottom flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-bold'
      : 'nav-group flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold whitespace-nowrap';
    return `
      <button type="button" onclick="selectNavGroup(${jsArg(g.id)})" class="${base} ${isActive ? 'is-active' : ''}"
        ${isActive ? 'aria-current="true"' : ''} title="${escapeHtml(g.label)}">
        <i data-lucide="${g.icon}" class="w-4 h-4"></i>
        <span>${escapeHtml(variant === 'bottom' ? g.short : g.label)}</span>
      </button>`;
  };

  const groupsEl = document.getElementById('navGroups');
  const bottomEl = document.getElementById('bottomNav');
  const subEl = document.getElementById('navSubTabs');
  if (groupsEl) groupsEl.innerHTML = NAV_GROUPS.map(g => groupButton(g, 'top')).join('');
  if (bottomEl) bottomEl.innerHTML = NAV_GROUPS.map(g => groupButton(g, 'bottom')).join('');
  if (subEl) {
    // A group with a single tab needs no second row.
    subEl.classList.toggle('hidden', group.tabs.length < 2);
    // On mobile the group row lives in the bottom bar, so the top bar would be empty.
    document.getElementById('mainNav').classList.toggle('max-md:hidden', group.tabs.length < 2);
    const closeTabAction = activeTab !== 'home'
      ? `<button type="button" onclick="requestExitActiveTask(activeTab)" class="nav-subtab-close ml-auto flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-[#8B1E1E] bg-white/80 dark:bg-stone-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-amber-300/80 hover:border-rose-400 dark:border-stone-700 transition-all cursor-pointer shadow-2xs group" title="Đóng tác vụ hiện tại, trở về Trang Chủ">
          <span class="w-4 h-4 rounded-full bg-gradient-to-br from-[#8B1E1E] to-rose-700 text-amber-200 flex items-center justify-center text-[10px] font-black group-hover:rotate-90 transition-transform">✕</span>
          <span>Đóng tác vụ</span>
        </button>`
      : '';
    subEl.innerHTML = group.tabs.map(tabId => {
      const tab = TABS[tabId];
      const isActive = tabId === activeTab;
      return `
        <a href="#/${tabId}" role="tab" aria-selected="${isActive}" class="nav-subtab ${isActive ? 'is-active' : ''}">
          <i data-lucide="${tab.icon}" class="w-4 h-4"></i>
          <span>${escapeHtml(tab.label)}</span>
        </a>`;
    }).join('') + closeTabAction;
  }
  refreshIcons(document.getElementById('mainNav'));
  refreshIcons(bottomEl);
}

function selectNavGroup(groupId) {
  const group = NAV_GROUPS.find(g => g.id === groupId);
  if (!group) return;
  const remembered = lastTabPerGroup[groupId];
  switchTab(group.tabs.includes(remembered) ? remembered : group.tabs[0]);
}

/** Load the tab's datasets and run its one-time render. Safe to call repeatedly. */
function ensureTabRendered(tabId) {
  if (renderedTabs.has(tabId)) return Promise.resolve();
  if (renderingTabs.has(tabId)) return renderingTabs.get(tabId);

  const tab = TABS[tabId];
  const section = document.getElementById(`tab-${tabId}`);

  // Data already in memory: render synchronously so callers can act on the tab right away.
  if (isDataLoaded(tab.data)) {
    tab.init();
    renderedTabs.add(tabId);
    if (section) refreshIcons(section);
    return Promise.resolve();
  }

  const job = loadDatasets(tab.data)
    .then(() => {
      tab.init();
      renderedTabs.add(tabId);
      if (section) refreshIcons(section);
    })
    .catch(err => {
      console.error(`Không thể tải dữ liệu cho tab "${tabId}":`, err);
      showToast('Không tải được dữ liệu. Vui lòng kiểm tra kết nối mạng và thử lại.', 'error');
    })
    .finally(() => {
      renderingTabs.delete(tabId);
      if (section) section.removeAttribute('aria-busy');
    });

  if (section) section.setAttribute('aria-busy', 'true');
  renderingTabs.set(tabId, job);
  return job;
}

// Tab Switching
function switchTab(tabId, options = {}) {
  tabId = TAB_ALIASES[tabId] || tabId;
  // Stroke practice is a modal that any tab can open.
  if (tabId === 'writing') {
    openWritingModal();
    return Promise.resolve();
  }
  if (tabId === 'grammar' && options.view) activeGrammarViewMode = options.view;
  if (!TABS[tabId]) tabId = DEFAULT_TAB;

  const changed = activeTab !== tabId;
  activeTab = tabId;

  const group = groupOfTab(tabId);
  lastTabPerGroup[group.id] = tabId;
  storage.set(LAST_TAB_PER_GROUP_KEY, lastTabPerGroup);

  Object.keys(TABS).forEach(t => {
    const section = document.getElementById(`tab-${t}`);
    if (section) section.classList.toggle('hidden', t !== tabId);
  });

  // Keep query params (e.g. #/classroom?a=...) when the tab itself does not change.
  if (hashPath() !== tabId) {
    history[options.replace ? 'replaceState' : 'pushState'](null, '', `#/${tabId}`);
  }
  if (tabId !== 'home') {
    const recent = (storage.get(RECENT_TABS_KEY, []) || []).filter(t => t !== tabId);
    storage.set(RECENT_TABS_KEY, [tabId, ...recent].slice(0, 6));
  }
  document.title = `${TABS[tabId].label} · Học Tiếng Trung Mỗi Ngày`;
  renderNav();

  if (changed && !options.keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  // The dashboard summarises other tabs, so refresh it every time it is shown.
  const alreadyRendered = renderedTabs.has(tabId);
  const job = ensureTabRendered(tabId);
  if (alreadyRendered && changed && tabId === 'home') renderHomeDashboard();
  return job;
}

/** Dọn dẹp các nút close góc tự động lỗi thời nếu còn tồn tại */
function cleanupStrayTabCloseButtons() {
  document.querySelectorAll('.tab-corner-close-btn').forEach(el => el.remove());
}

// ---------------- TASK EXIT CONFIRMATION ENGINE (ORIENTAL LUXURY) ----------------
let pendingExitTaskCallback = null;

function isTaskInProgress(tabId) {
  // 1. Kiểm tra làm bài thi HSK dở dang
  if (tabId === 'mockexam') {
    if (typeof activeExam !== 'undefined' && activeExam && typeof examUserAnswers !== 'undefined') {
      const answeredKeys = Object.keys(examUserAnswers).filter(k => {
        const v = examUserAnswers[k];
        return v && (Array.isArray(v) ? v.length > 0 : String(v).trim() !== '');
      });
      const answeredCount = answeredKeys.length;
      const total = (activeExam.questions || []).length;
      
      // Nếu đã trả lời ít nhất 1 câu và chưa hoàn thành nộp bài
      if (answeredCount > 0 && answeredCount < total) {
        const m = typeof examTimeRemaining !== 'undefined' ? Math.floor(examTimeRemaining / 60) : 0;
        const s = typeof examTimeRemaining !== 'undefined' ? examTimeRemaining % 60 : 0;
        const timeStr = `${m} phút ${s < 10 ? '0' + s : s}s`;

        return {
          inProgress: true,
          title: 'Xác Nhận Rời Phòng Thi HSK?',
          subtitle: 'Bài thi thử HSK đang diễn ra chưa hoàn thành',
          message: `Bạn đang làm dở bài thi <strong>${escapeHtml(activeExam.title || 'HSK')}</strong>.<br><br>
            📊 Tiến độ: <strong>Đã làm ${answeredCount} / ${total} câu</strong><br>
            ⏱️ Thời gian còn lại: <strong>${timeStr}</strong><br><br>
            ⚠️ <em>Lưu ý: Nếu bạn thoát phòng thi lúc này, kết quả của lượt làm bài hiện tại sẽ không được lưu và không được chấm điểm.</em><br><br>
            Bạn có chắc chắn muốn hủy và quay về Trang Chủ không?`,
          onConfirm: () => {
            if (typeof examTimerInterval !== 'undefined' && examTimerInterval) {
              clearInterval(examTimerInterval);
            }
            if (typeof examUserAnswers !== 'undefined') {
              examUserAnswers = {};
            }
          }
        };
      }
    }
  }

  // 2. Kiểm tra màn chơi lật thẻ tìm từ
  if (tabId === 'flipcard') {
    if (typeof flipMatchedPairsCount !== 'undefined' && typeof flipTotalPairs !== 'undefined') {
      if (flipMatchedPairsCount > 0 && flipMatchedPairsCount < flipTotalPairs) {
        return {
          inProgress: true,
          title: 'Xác Nhận Thoát Màn Chơi Lật Thẻ?',
          subtitle: 'Ván chơi lật thẻ tìm từ đang diễn ra',
          message: `Bạn đang ghép dở ván lật thẻ (đã hoàn thành <strong>${flipMatchedPairsCount}/${flipTotalPairs} cặp</strong>).<br><br>Nếu thoát bây giờ, điểm số và tiến trình của màn chơi này sẽ bị hủy. Bạn có chắc chắn muốn quay về Trang Chủ không?`,
          onConfirm: () => {}
        };
      }
    }
  }

  // 3. Kiểm tra màn chơi xếp khối gỗ
  if (tabId === 'woodblock') {
    if (typeof woodPlacedCount !== 'undefined' && woodPlacedCount > 0) {
      return {
        inProgress: true,
        title: 'Xác Nhận Thoát Xếp Khối Gỗ?',
        subtitle: 'Ván chơi xếp khối gỗ đang diễn ra',
        message: 'Bạn đang ghép dở màn chơi khối gỗ. Nếu thoát bây giờ, tiến trình ván chơi sẽ bị hủy. Bạn có chắc chắn muốn quay về Trang Chủ không?',
        onConfirm: () => {}
      };
    }
  }

  return { inProgress: false };
}

function requestExitActiveTask(tabId) {
  if (!tabId || tabId === 'home') {
    switchTab('home');
    return;
  }

  const check = isTaskInProgress(tabId);
  if (check && check.inProgress) {
    pendingExitTaskCallback = () => {
      if (typeof check.onConfirm === 'function') check.onConfirm();
      switchTab('home');
    };
    showConfirmExitModal(check.title, check.subtitle, check.message);
  } else {
    // Không có tác vụ dở dang: Thoát mượt mà ngay lập tức
    switchTab('home');
  }
}

function showConfirmExitModal(title, subtitle, message) {
  const modal = document.getElementById('confirmExitTaskModal');
  const titleEl = document.getElementById('confirmExitTitle');
  const subEl = document.getElementById('confirmExitSubtitle');
  const msgEl = document.getElementById('confirmExitMessage');

  if (!modal) {
    if (confirm('Nhiệm vụ đang diễn ra chưa hoàn thành. Bạn có chắc chắn muốn hủy và quay về Trang Chủ không?')) {
      if (typeof pendingExitTaskCallback === 'function') pendingExitTaskCallback();
      else switchTab('home');
    }
    return;
  }

  if (titleEl) titleEl.innerText = title;
  if (subEl) subEl.innerText = subtitle;
  if (msgEl) msgEl.innerHTML = message;

  modal.classList.remove('hidden');
  if (typeof refreshIcons === 'function') refreshIcons(modal);
}

function cancelExitTask() {
  const modal = document.getElementById('confirmExitTaskModal');
  if (modal) modal.classList.add('hidden');
  pendingExitTaskCallback = null;
  if (typeof showToast === 'function') {
    showToast('Đã tiếp tục làm bài!', 'info');
  }
}

function proceedExitTask() {
  const modal = document.getElementById('confirmExitTaskModal');
  if (modal) modal.classList.add('hidden');
  if (typeof pendingExitTaskCallback === 'function') {
    const cb = pendingExitTaskCallback;
    pendingExitTaskCallback = null;
    cb();
  } else {
    switchTab('home');
  }
  if (typeof showToast === 'function') {
    showToast('Đã hủy tác vụ dở dang và quay về Trang Chủ.', 'info');
  }
}

window.addEventListener('popstate', () => {
  const tabId = tabFromHash() || DEFAULT_TAB;
  if (tabId !== activeTab) switchTab(tabId, { replace: true });
  else if (tabId === 'classroom' && renderedTabs.has('classroom')) handleClassroomRoute();
});

// Application bootstrap
function initApp() {
  initTheme();
  loadUserProfile();
  loadSrsState();
  initTtsVoices();
  setupGlobalSearch();
  switchTab(tabFromHash() || DEFAULT_TAB, { replace: true, keepScroll: true });
  initAccount();
  initVisitorTracker();
  initFloatingAiAssistant();
  initFloatingDock();
  cleanupStrayTabCloseButtons();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('modal') === 'complaint' && typeof openComplaintModal === 'function') {
    setTimeout(() => openComplaintModal(), 200);
  }
}

window.addEventListener('DOMContentLoaded', initApp);
