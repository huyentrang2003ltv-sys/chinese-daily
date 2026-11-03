const fs = require('fs');

const appPath = 'app.js';
let appCode = fs.readFileSync(appPath, 'utf8');

// 1. Add thematic state variables
const oldVars = `let topicsData = [];
let activeJiaochengVolume = 'all';`;

const newVars = `let topicsData = [];
let thematicVocabData = [];
let currentTopicPillFilter = '';
let activeJiaochengVolume = 'all';`;

appCode = appCode.replace(oldVars, newVars);

// 2. Add fetch('data/thematic_vocab.json') in initApp()
const oldFetchList = `      fetch('data/hanyu_jiaocheng.json').then(r => r.json()).catch(() => null),
      fetch('data/topics.json').then(r => r.json()).catch(() => []),
      fetch('data/hsk30_roadmap.json').then(r => r.json()).catch(() => null)
    ]).then(([dictRes, mindmapRes, confRes, practRes, cultRes, examRes, aiRes, radRes, chengRes, readRes, gramRes, jcRes, topRes, roadmapRes]) => {`;

const newFetchList = `      fetch('data/hanyu_jiaocheng.json').then(r => r.json()).catch(() => null),
      fetch('data/topics.json').then(r => r.json()).catch(() => []),
      fetch('data/thematic_vocab.json').then(r => r.json()).catch(() => []),
      fetch('data/hsk30_roadmap.json').then(r => r.json()).catch(() => null)
    ]).then(([dictRes, mindmapRes, confRes, practRes, cultRes, examRes, aiRes, radRes, chengRes, readRes, gramRes, jcRes, topRes, themRes, roadmapRes]) => {`;

appCode = appCode.replace(oldFetchList, newFetchList);

const oldAssign = `      jiaochengData = jcRes;
      topicsData = topRes || [];
      hsk30RoadmapData = roadmapRes;`;

const newAssign = `      jiaochengData = jcRes;
      topicsData = topRes || [];
      thematicVocabData = themRes || [];
      hsk30RoadmapData = roadmapRes;

      if (activeDictSubTab === 'topics' && activeTab === 'dict') {
        renderTopicPills();
        renderTopicDictionary(true);
      }`;

appCode = appCode.replace(oldAssign, newAssign);

// 3. Replace renderTopicPills, filterDictTopic, getFilteredTopicDictionaryList, renderTopicDictionary
const startSection = 'function renderTopicPills() {';
const endSection = '// ==========================================\n// INTELLIGENT PHONETIC & LINGUISTIC NORMALIZERS';

const startIdx = appCode.indexOf(startSection);
const endIdx = appCode.indexOf(endSection);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find markers for renderTopicPills in app.js');
  process.exit(1);
}

const newThematicFunctions = `function renderTopicPills() {
  const container = document.getElementById('topicFilterPills');
  if (!container) return;

  const sourceVocab = (thematicVocabData && thematicVocabData.length > 0) ? thematicVocabData : (dictionaryData || []);
  const totalWords = sourceVocab.length;
  const topicsList = (topicsData && topicsData.length > 0) ? topicsData : [];
  
  // Filter topics by pill search query
  let filteredTopics = topicsList;
  if (currentTopicPillFilter && currentTopicPillFilter.trim()) {
    const q = normalizeVietnamese(currentTopicPillFilter);
    filteredTopics = topicsList.filter(t => {
      const nameNorm = normalizeVietnamese(t.name);
      const fullNorm = normalizeVietnamese(t.fullName || '');
      return nameNorm.includes(q) || fullNorm.includes(q);
    });
  }

  const badgeEl = document.getElementById('topicPillCountBadge');
  if (badgeEl) {
    badgeEl.innerText = \`\${filteredTopics.length} / \${topicsList.length} chủ đề\`;
  }

  let html = \`
    <button onclick="filterDictTopic('all')" id="btn-topic-all" class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 \${currentDictTopic === 'all' ? 'bg-gradient-to-r from-emerald-700 to-[#1E4D43] text-white shadow-sm border border-emerald-800' : 'bg-white dark:bg-stone-800 hover:bg-emerald-50 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'}" title="Xem toàn bộ từ vựng">
      <span>🌟 Tất Cả \${topicsList.length} Chủ Đề</span>
      <span class="text-[10px] px-1.5 py-0.2 rounded-full \${currentDictTopic === 'all' ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-semibold'}">\${totalWords.toLocaleString()}</span>
    </button>
  \`;

  filteredTopics.forEach(t => {
    const isSelected = currentDictTopic === t.id;
    const count = t.count || sourceVocab.filter(w => w.topicId === t.id).length;
    html += \`
      <button onclick="filterDictTopic('\${t.id}')" id="btn-topic-\${t.id}" class="px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 \${isSelected ? 'bg-gradient-to-r from-emerald-700 to-[#1E4D43] text-white shadow-sm border border-emerald-800' : 'bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'}" title="\${t.fullName || t.name}">
        <span>\${t.icon || '🏷️'}</span>
        <span>\${t.name}</span>
        <span class="text-[10px] px-1.5 py-0.2 rounded-full \${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-semibold'}">\${count}</span>
      </button>
    \`;
  });

  container.innerHTML = html;
}

function filterTopicPills(query) {
  currentTopicPillFilter = query || '';
  renderTopicPills();
}

function filterDictTopic(topicId) {
  currentDictTopic = topicId;
  renderTopicPills();

  const label = document.getElementById('activeTopicLabel');
  if (label) {
    if (topicId === 'all') {
      const sourceVocab = (thematicVocabData && thematicVocabData.length > 0) ? thematicVocabData : (dictionaryData || []);
      const total = sourceVocab.length;
      label.innerText = \`🌟 Tất Cả 125 Chủ Đề (\${total.toLocaleString()} từ)\`;
      label.className = 'text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-700';
    } else {
      const found = (topicsData || []).find(t => t.id === topicId);
      const name = found ? \`\${found.icon} \${found.name} (\${found.count} từ)\` : \`Chủ đề: \${topicId}\`;
      label.innerText = name;
      label.className = 'text-xs font-bold text-emerald-950 dark:text-emerald-200 bg-emerald-200/90 dark:bg-emerald-900/90 px-2.5 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-600';
    }
  }

  renderTopicDictionary(true);
}

function onTopicSearchInput(val) {
  currentTopicSearch = val || '';
  const clearBtn = document.getElementById('topicClearSearchBtn');
  if (clearBtn) {
    if (currentTopicSearch.trim()) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }
  renderTopicDictionary(true);
}

function clearTopicSearch() {
  const input = document.getElementById('topicSearchInput');
  if (input) input.value = '';
  onTopicSearchInput('');
}

function getFilteredTopicDictionaryList() {
  const source = (thematicVocabData && thematicVocabData.length > 0) ? thematicVocabData : (dictionaryData || []);
  if (!source || !Array.isArray(source)) return [];
  let list = source;

  if (currentDictTopic !== 'all') {
    list = list.filter(item => item.topicId === currentDictTopic);
  }

  if (currentTopicSearch && currentTopicSearch.trim()) {
    const rawQ = currentTopicSearch.toLowerCase().trim();
    const pyQ = normalizePinyin(currentTopicSearch);
    const viQ = normalizeVietnamese(currentTopicSearch);

    list = list.filter(item => {
      const title = (item.title || '').toLowerCase();
      const pinyin = (item.pinyin || '').toLowerCase();
      const pinyinNorm = normalizePinyin(item.pinyin);
      const hanviet = (item.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(item.hanviet);
      const meaning = (item.meaning || '').toLowerCase();
      const meaningNorm = normalizeVietnamese(item.meaning);
      const topicName = (item.topicName || '').toLowerCase();
      const example = (item.exampleSentence || '').toLowerCase();

      return title.includes(rawQ) ||
        (pyQ && pinyinNorm.includes(pyQ)) ||
        pinyin.includes(rawQ) ||
        (viQ && (hanvietNorm.includes(viQ) || meaningNorm.includes(viQ))) ||
        hanviet.includes(rawQ) ||
        meaning.includes(rawQ) ||
        topicName.includes(rawQ) ||
        example.includes(rawQ);
    });
  }
  return list;
}

function renderTopicDictionary(reset = false) {
  const container = document.getElementById('topicGridContainer');
  if (!container) return;

  const source = (thematicVocabData && thematicVocabData.length > 0) ? thematicVocabData : (dictionaryData || []);
  const totalLabel = document.getElementById('topicTotalCountLabel');
  const filteredLabel = document.getElementById('topicFilteredCount');
  const filteredList = getFilteredTopicDictionaryList();

  if (totalLabel) totalLabel.innerText = \`\${source.length.toLocaleString()}\`;
  if (filteredLabel) filteredLabel.innerText = \`\${filteredList.length.toLocaleString()}\`;

  if (reset) {
    topicDictRendered = 0;
    container.innerHTML = '';
  }

  if (filteredList.length === 0) {
    container.innerHTML = \`
      <div class="col-span-full glass-card rounded-2xl p-10 text-center text-stone-500 border border-emerald-200 bg-white dark:bg-stone-900 shadow-xs space-y-2">
        <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-xl">🔍</div>
        <p class="font-bold text-stone-800 dark:text-stone-200">Không tìm thấy từ vựng nào trong chủ đề này.</p>
        <p class="text-xs text-stone-500">Hãy thử nhập từ khóa khác hoặc bấm chọn "🌟 Tất Cả 125 Chủ Đề".</p>
      </div>
    \`;
    const loadMoreBtn = document.getElementById('loadMoreTopicBtn');
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    return;
  }

  const nextBatch = filteredList.slice(topicDictRendered, topicDictRendered + topicDictBatch);

  // Level badge styling map
  const levelBadgeStyles = {
    1: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-300',
    2: 'bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-300 border-teal-300',
    3: 'bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300 border-sky-300',
    4: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 border-indigo-300',
    5: 'bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border-purple-300',
    6: 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border-rose-300'
  };

  nextBatch.forEach(item => {
    const card = document.createElement('div');
    const badgeStyle = levelBadgeStyles[item.level] || 'bg-amber-100 text-amber-900 border-amber-200';

    card.className = 'glass-card rounded-2xl p-5 border border-emerald-200/80 dark:border-stone-700 bg-white dark:bg-[#161B22] flex flex-col justify-between hover:border-emerald-600 transition-all shadow-xs hover:shadow-md';
    card.innerHTML = \`
      <div>
        <div class="flex items-center justify-between text-xs text-stone-500 mb-2.5 gap-1.5 flex-wrap">
          <div class="flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <span>\${item.topicIcon || '🏷️'}</span>
              <span>\${item.topicName || 'Chủ đề'}</span>
            </span>
            <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold border \${badgeStyle}">
              HSK \${item.level}
            </span>
          </div>
          <span class="text-[11px] text-stone-500 dark:text-stone-400 font-medium px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            \${item.pos || 'từ vựng'}
          </span>
        </div>

        <div class="flex items-center justify-between gap-2">
          <h4 onclick="openWritingModal('\${item.title}', '\${item.pinyin}', '\${(item.meaning || '').replace(/'/g, "\\\\'")}')" class="font-hanzi text-3xl font-black text-stone-900 dark:text-stone-100 tracking-wide cursor-pointer hover:text-[#8B1E1E] transition-colors" title="Nhấn vào chữ để xem và tập viết nét">\${item.title}</h4>
          <div class="flex items-center gap-1">
            <button onclick="toggleSaveWord('\${item.title}', '\${item.pinyin}', '\${(item.meaning || '').replace(/'/g, "\\\\'")}', \${item.level})" title="Lưu vào Sổ tay Flashcard" class="p-2 rounded-xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-stone-700 transition-colors cursor-pointer">
              <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="openWritingModal('\${item.title}', '\${item.pinyin}', '\${(item.meaning || '').replace(/'/g, "\\\\'")}')" title="Tập viết nét chữ này" class="p-2 rounded-xl bg-rose-50 dark:bg-stone-800 hover:bg-rose-100 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-stone-700 transition-colors cursor-pointer">
              <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
            </button>
            <div class="flex items-center gap-0.5 bg-stone-100/90 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs">
              <button onclick="playChineseTTS('\${item.title}', 'female')" title="Nghe phát âm giọng Nữ (Xiaoxiao)" class="px-2 py-1 rounded-lg bg-white dark:bg-stone-700 hover:bg-rose-50 text-rose-850 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold transition-colors cursor-pointer">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS('\${item.title}', 'male')" title="Nghe phát âm giọng Nam (Yunxi)" class="px-2 py-1 rounded-lg bg-white dark:bg-stone-700 hover:bg-blue-50 text-blue-850 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-bold transition-colors cursor-pointer">
                👨 Nam
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap mt-1.5">
          <p class="text-xs font-bold text-emerald-800 dark:text-emerald-400 tracking-wide">\${item.pinyin}</p>
          \${item.hanviet ? \`<span class="text-[11px] font-bold text-amber-950 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-700">[\${item.hanviet}]</span>\` : ''}
        </div>
        <p class="text-xs font-medium text-stone-800 dark:text-stone-200 mt-1 leading-snug">\${item.meaning}</p>
      </div>

      \${item.exampleSentence ? \`
        <div class="mt-4 pt-3 border-t border-emerald-200/60 dark:border-stone-700 text-xs space-y-1 bg-[#FAF7F2]/60 dark:bg-stone-900/60 p-2.5 rounded-xl">
          <div class="flex items-start justify-between gap-1.5">
            <p class="font-hanzi text-stone-900 dark:text-stone-100 font-bold text-xs leading-relaxed">\${item.exampleSentence}</p>
            <div class="flex items-center gap-1 shrink-0">
              <button onclick="playChineseTTS('\${item.exampleSentence.replace(/'/g, "\\\\'").replace(/\\n/g, ' ')}', 'female')" class="px-1.5 py-0.5 rounded bg-white dark:bg-stone-700 hover:bg-rose-50 text-rose-850 dark:text-rose-300 border border-rose-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nữ">
                👩 Nữ
              </button>
              <button onclick="playChineseTTS('\${item.exampleSentence.replace(/'/g, "\\\\'").replace(/\\n/g, ' ')}', 'male')" class="px-1.5 py-0.5 rounded bg-white dark:bg-stone-700 hover:bg-blue-50 text-blue-850 dark:text-blue-300 border border-blue-200 dark:border-stone-600 text-[10px] font-bold transition-colors cursor-pointer" title="Nghe ví dụ giọng Nam">
                👨 Nam
              </button>
            </div>
          </div>
          \${item.examplePinyin ? \`<p class="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">\${item.examplePinyin}</p>\` : ''}
          \${item.exampleMeaning ? \`<p class="text-[11px] text-stone-600 dark:text-stone-400 italic leading-snug">\${item.exampleMeaning}</p>\` : ''}
        </div>
      \` : ''}
    \`;
    container.appendChild(card);
  });

  topicDictRendered += nextBatch.length;
  const loadMoreBtn = document.getElementById('loadMoreTopicBtn');
  if (loadMoreBtn) {
    if (topicDictRendered >= filteredList.length) {
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  }

  refreshIcons();
}

function loadMoreTopicDict() {
  renderTopicDictionary(false);
}
\n`;

appCode = appCode.slice(0, startIdx) + newThematicFunctions + appCode.slice(endIdx);

// Also export filterTopicPills to window
const oldExports = `window.filterDictTopic = filterDictTopic;`;
const newExports = `window.filterDictTopic = filterDictTopic;
window.filterTopicPills = filterTopicPills;`;

appCode = appCode.replace(oldExports, newExports);

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('Successfully updated app.js with 125 thematic topics and 14,605 words!');
