// =========================================================================
// Navigation: grouped tabs, hash routing (#/tab), lazy tab rendering
// =========================================================================

/** Every tab: label, Lucide icon, datasets it needs and how to render it the first time. */
const TABS = {
  home: { label: 'Trang chủ', icon: 'house', data: ['dictionary'], init: () => renderHomeDashboard() },
  pathway: { label: 'Lộ trình HSK 3.0', icon: 'map', data: ['hsk30Roadmap'], init: () => renderPathwayTab() },
  jiaocheng: {
    label: 'Giáo trình Hán ngữ', icon: 'book-marked', data: ['jiaocheng'],
    init: () => { renderJiaocheng(); setupJiaochengSearch(); }
  },
  etymology: {
    label: 'Chiết tự & Gốc từ', icon: 'sparkles', data: ['etymology', 'dictionary', 'radicals'],
    init: () => { renderCharacterPills(); renderEtymologyDetail(activeEtymologyIndex || 0); }
  },
  radicals: { label: '214 Bộ thủ', icon: 'grid-3x3', data: ['radicals'], init: () => { renderRadicals(); setupRadicalSearch(); } },
  dictionary: { label: 'Từ điển & Chủ đề', icon: 'book-open', data: ['dictionary'], init: () => renderDictionary(true) },
  flashcards: { label: 'Flashcard ôn tập', icon: 'layers', data: ['dictionary'], init: () => initFlashcards() },
  confusions: { label: 'Từ dễ lẫn', icon: 'split', data: ['confusions'], init: () => renderConfusions() },
  chengyu: { label: 'Thành ngữ', icon: 'scroll', data: ['chengyu'], init: () => { renderChengyu(); setupChengyuSearch(); } },
  grammar: {
    label: 'Ngữ pháp', icon: 'compass', data: ['grammar', 'mindmap'],
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
  practice: { label: 'Luyện 4 kỹ năng', icon: 'check-square', data: ['practice'], init: () => renderPractice() },
  translation: {
    label: 'Luyện dịch', icon: 'languages', data: ['lessons'],
    init: () => { renderTranslationLessonList(); renderTranslationStage(); }
  },
  aichat: { label: 'Hội thoại tình huống', icon: 'bot', data: ['aiScenarios'], init: () => initAiChatModule() },
  mockexam: { label: 'Thi thử HSK', icon: 'file-check-2', data: ['mockExam'], init: () => initMockExamModule() },
  woodblock: { label: 'Xếp khối gỗ', icon: 'puzzle', data: ['woodBlock'], init: () => initWoodBlockGame() },
  flipcard: { label: 'Lật thẻ tìm từ', icon: 'layers', data: ['flipCard'], init: () => initFlipCardGame() },
  classroom: { label: 'Lớp học', icon: 'school', data: ['dictionary'], init: () => initClassroom() }
};

/** Top-level groups shown in the main nav (bottom bar on mobile). */
const NAV_GROUPS = [
  { id: 'home', label: 'Trang chủ', short: 'Trang chủ', icon: 'house', tabs: ['home'] },
  { id: 'path', label: 'Lộ trình', short: 'Lộ trình', icon: 'route', tabs: ['pathway', 'jiaocheng'] },
  { id: 'hanzi', label: 'Chữ Hán', short: 'Chữ Hán', icon: 'type', tabs: ['etymology', 'radicals'] },
  { id: 'vocab', label: 'Từ vựng', short: 'Từ vựng', icon: 'book-a', tabs: ['dictionary', 'flashcards', 'confusions', 'chengyu'] },
  { id: 'read', label: 'Ngữ pháp & Đọc', short: 'Ngữ pháp', icon: 'library', tabs: ['grammar', 'readings', 'culture'] },
  { id: 'train', label: 'Luyện tập & Thi', short: 'Luyện thi', icon: 'target', tabs: ['practice', 'translation', 'aichat', 'mockexam', 'woodblock', 'flipcard', 'classroom'] }
];

const DEFAULT_TAB = 'home';
const TAB_ALIASES = { mindmap: 'grammar', today: 'home' };
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
    subEl.innerHTML = group.tabs.map(tabId => {
      const tab = TABS[tabId];
      const isActive = tabId === activeTab;
      return `
        <a href="#/${tabId}" role="tab" aria-selected="${isActive}" class="nav-subtab ${isActive ? 'is-active' : ''}">
          <i data-lucide="${tab.icon}" class="w-4 h-4"></i>
          <span>${escapeHtml(tab.label)}</span>
        </a>`;
    }).join('');
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
}

window.addEventListener('DOMContentLoaded', initApp);
