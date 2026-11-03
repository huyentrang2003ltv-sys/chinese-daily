const fs = require('fs');

const appPath = 'app.js';
let appCode = fs.readFileSync(appPath, 'utf8');

// Replace normalizePinyin, normalizeVietnamese, and searchOmniDatabase up to setupGlobalSearch
const searchOmniDatabaseCode = `function hasVietnameseDiacritics(str) {
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(str);
}

function normalizePinyin(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[āáǎà]/g, 'a')
    .replace(/[ēéěè]/g, 'e')
    .replace(/[īíǐì]/g, 'i')
    .replace(/[ōóǒò]/g, 'o')
    .replace(/[ūúǔù]/g, 'u')
    .replace(/[ǖǘǚǜü]/g, 'u')
    .replace(/[1-5]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeVietnamese(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\\s]/g, '')
    .trim()
    .replace(/\\s+/g, ' ');
}

function splitMeaningTerms(str) {
  if (!str) return [];
  return str
    .split(/[,;；、/()（）\\[\\]【】\\n\\r]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

// Global Search State
let currentSearchResults = [];
let currentSearchSelectedIndex = -1;
let currentWordModalWord = null;

// ==========================================
// HIGH-PRECISION MULTI-SOURCE OMNISEARCH ENGINE
// ==========================================
function searchOmniDatabase(query) {
  if (!query || !query.trim()) return [];

  const rawQ = query.trim().toLowerCase();
  const hasVn = hasVietnameseDiacritics(query);
  const isHanzi = /[\\u4e00-\\u9fa5]/.test(query);
  const pyQ = normalizePinyin(query);
  const viQ = normalizeVietnamese(query);
  const viTokens = viQ ? viQ.split(/\\s+/).filter(Boolean) : [];

  const results = [];

  // Helper for scoring meanings
  function scoreMeaning(meaningStr) {
    if (!meaningStr) return 0;
    let mScore = 0;
    const meaningLower = meaningStr.toLowerCase();
    const meaningNorm = normalizeVietnamese(meaningStr);

    const terms = splitMeaningTerms(meaningLower);
    for (const term of terms) {
      const termNorm = normalizeVietnamese(term);
      if (term === rawQ) {
        mScore = Math.max(mScore, 950); // Exact accented meaning match (e.g. "tôi", "bạn", "yêu")
        break;
      }
      if (!hasVn && termNorm === viQ) {
        mScore = Math.max(mScore, 780); // Exact unaccented meaning match (e.g. "yeu" -> 爱)
        break;
      }
      if (hasVn && term.startsWith(rawQ)) {
        mScore = Math.max(mScore, 440);
      } else if (!hasVn && termNorm.startsWith(viQ)) {
        mScore = Math.max(mScore, 350);
      } else if (hasVn && rawQ.length >= 2 && term.includes(rawQ)) {
        mScore = Math.max(mScore, 260);
      } else if (!hasVn && viQ.length >= 2 && termNorm.includes(viQ)) {
        mScore = Math.max(mScore, 180);
      }
    }

    if (meaningLower === rawQ) mScore = Math.max(mScore, 880);
    else if (!hasVn && meaningNorm === viQ) mScore = Math.max(mScore, 700);

    return mScore;
  }

  // 1. Search Dictionary (HSK 1-6 & Chủ đề)
  if (dictionaryData && Array.isArray(dictionaryData)) {
    for (const item of dictionaryData) {
      let score = 0;
      const title = (item.title || '').toLowerCase();
      const pinyin = (item.pinyin || '').toLowerCase();
      const pinyinNorm = normalizePinyin(item.pinyin);
      const hanviet = (item.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(item.hanviet);
      const meaningNorm = normalizeVietnamese(item.meaning);

      // A. Hanzi Match
      if (title === rawQ) score += 1050;
      else if (title.startsWith(rawQ)) score += 340;
      else if (title.includes(rawQ)) score += 160;

      // B. Meaning Match (Highest priority for Vietnamese search queries)
      const mScore = scoreMeaning(item.meaning);
      score += mScore;

      // C. Pinyin Match (Only if query is NOT Vietnamese accented)
      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 750;
        else if (pyQ && pinyinNorm.startsWith(pyQ)) score += 260;
        else if (pyQ && pinyinNorm.includes(pyQ)) score += 90;
      }

      // D. Hán Việt Match
      if (hanviet === rawQ) score += 620;
      else if (hanvietNorm === viQ) {
        if (!hasVn || hanviet === rawQ) score += 480;
        else score += 80;
      } else if (hanvietNorm.startsWith(viQ)) score += 160;
      else if (hanvietNorm.includes(viQ)) score += 70;

      // E. Multi-word Token Intersection
      if (viTokens.length > 1) {
        const fullViText = \`\${hanvietNorm} \${meaningNorm}\`;
        if (viTokens.every(t => fullViText.includes(t))) {
          score += 140;
        }
      }

      // Boost for foundational vocabulary (HSK 1-2)
      if (score > 0) {
        if (item.level === 1) score += 40;
        else if (item.level === 2) score += 20;

        results.push({
          type: 'dict',
          title: item.title,
          pinyin: item.pinyin,
          hanviet: item.hanviet || '',
          meaning: item.meaning,
          level: item.level || 1,
          topicName: item.topicName || '',
          score
        });
      }
    }
  }

  // 2. Search Etymology (Chiết Tự & Gốc Từ)
  if (etymologyData && Array.isArray(etymologyData)) {
    for (const e of etymologyData) {
      let score = 0;
      const hanzi = (e.hanzi || '').toLowerCase();
      const pinyinNorm = normalizePinyin(e.pinyin);
      const hanviet = (e.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(e.hanviet);
      const storyNorm = normalizeVietnamese(e.etymologyStory);

      if (hanzi === rawQ) score += 980;
      else if (hanzi.includes(rawQ)) score += 200;

      const mScore = scoreMeaning(e.meaning);
      score += Math.round(mScore * 0.9);

      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 680;
        else if (pyQ && pinyinNorm.startsWith(pyQ)) score += 220;
      }

      if (hanviet === rawQ) score += 550;
      else if (hanvietNorm === viQ) {
        if (!hasVn || hanviet === rawQ) score += 420;
        else score += 60;
      }

      if (viQ && storyNorm.includes(viQ)) score += 90;

      if (score > 0) {
        results.push({
          type: 'etymology',
          title: e.hanzi,
          pinyin: e.pinyin,
          hanviet: \`Chiết Tự: \${e.hanviet}\`,
          meaning: e.meaning,
          score: score - 10
        });
      }
    }
  }

  // 3. Search 214 Radicals (Bộ Thủ Khang Hy)
  if (radicalsData && Array.isArray(radicalsData)) {
    for (const r of radicalsData) {
      let score = 0;
      const char = (r.char || '').toLowerCase();
      const pinyinNorm = normalizePinyin(r.pinyin);
      const hanviet = (r.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(r.hanviet);

      if (char === rawQ) score += 920;
      const mScore = scoreMeaning(r.meaning);
      score += Math.round(mScore * 0.85);

      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 620;
      }

      if (hanviet === rawQ || \`bộ \${hanviet}\` === rawQ) score += 580;
      else if (hanvietNorm === viQ || \`bo \${hanvietNorm}\` === viQ) {
        score += 380;
      }

      if (score > 0) {
        results.push({
          type: 'radical',
          title: r.char,
          pinyin: r.pinyin,
          hanviet: \`Bộ \${r.hanviet}\`,
          meaning: r.meaning,
          strokes: r.strokes,
          score: score - 15
        });
      }
    }
  }

  // 4. Search Chengyu & Idioms (Thành Ngữ Điển Tích)
  if (chengyuData && Array.isArray(chengyuData)) {
    for (const c of chengyuData) {
      let score = 0;
      const title = (c.chengyu || '').toLowerCase();
      const pinyinNorm = normalizePinyin(c.pinyin);
      const hanviet = (c.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(c.hanviet);
      const litNorm = normalizeVietnamese(c.literal);
      const figNorm = normalizeVietnamese(c.figurative);
      const storyNorm = normalizeVietnamese(c.story);

      if (title === rawQ) score += 980;
      else if (title.includes(rawQ)) score += 300;

      if (!hasVn && !isHanzi) {
        if (pyQ && pinyinNorm === pyQ) score += 700;
        else if (pyQ && pinyinNorm.includes(pyQ)) score += 200;
      }

      if (hanviet === rawQ) score += 600;
      else if (hanvietNorm === viQ) score += 450;
      else if (hanvietNorm.includes(viQ)) score += 180;

      if (viQ && (litNorm.includes(viQ) || figNorm.includes(viQ))) score += 220;
      if (viTokens.length > 1) {
        const comb = \`\${litNorm} \${figNorm} \${storyNorm}\`;
        if (viTokens.every(t => comb.includes(t))) score += 150;
      }

      if (score > 0) {
        results.push({
          type: 'chengyu',
          title: c.chengyu,
          pinyin: c.pinyin,
          hanviet: c.hanviet,
          meaning: \`\${c.literal} — \${c.figurative}\`,
          score
        });
      }
    }
  }

  // 5. Search Culture & Dynasties (Lịch Sử & Văn Hóa)
  if (cultureData && Array.isArray(cultureData)) {
    for (const era of cultureData) {
      let score = 0;
      const title = (era.title || '').toLowerCase();
      const eraName = (era.eraName || '').toLowerCase();
      const combinedVi = normalizeVietnamese(\`\${era.eraName} \${era.title} \${era.summary} \${(era.keywords || []).join(' ')}\`);

      if (title.toLowerCase().includes(rawQ) || eraName.toLowerCase().includes(rawQ)) score += 450;
      if (viQ && combinedVi.includes(viQ)) score += 250;
      if (viTokens.length > 1 && viTokens.every(t => combinedVi.includes(t))) score += 180;

      if (score > 0) {
        results.push({
          type: 'culture',
          title: era.eraName || era.title,
          pinyin: era.period || '',
          hanviet: 'Lịch Sử & Văn Hóa',
          meaning: (era.summary || era.title).slice(0, 120),
          targetId: era.id,
          score
        });
      }
    }
  }

  // 6. Search Jiaocheng Lessons (Giáo Trình Hán Ngữ)
  if (jiaochengData && jiaochengData.lessons && Array.isArray(jiaochengData.lessons)) {
    for (const l of jiaochengData.lessons) {
      let score = 0;
      const titleHanzi = (l.titleHanzi || '').toLowerCase();
      const titleMeaning = (l.titleMeaning || '').toLowerCase();
      const titleNorm = normalizeVietnamese(l.titleMeaning);

      if (titleHanzi.includes(rawQ)) score += 350;
      if (titleMeaning.includes(rawQ)) score += 320;
      else if (viQ && titleNorm.includes(viQ)) score += 220;

      const numMatch = rawQ.match(/(?:bài|bai)\\s*([0-9]{1,2})/i);
      if (numMatch && parseInt(numMatch[1]) === l.lessonNum) {
        score += 550;
      }

      if (score > 0) {
        results.push({
          type: 'jiaocheng',
          title: \`Bài \${l.lessonNum}: \${l.titleHanzi}\`,
          pinyin: l.titlePinyin || '',
          hanviet: l.volumeName || 'Giáo Trình Hán Ngữ',
          meaning: \`\${l.titleMeaning} (\${l.category || ''})\`,
          lessonNum: l.lessonNum,
          lessonId: l.id,
          score
        });
      }
    }
  }

  // Deduplicate and sort descending by score
  results.sort((a, b) => b.score - a.score);

  const seen = new Set();
  const uniqueResults = [];
  for (const r of results) {
    const key = \`\${r.type}-\${r.title}\`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueResults.push(r);
    }
  }

  return uniqueResults.slice(0, 10);
}`;

// Find start and end of searchOmniDatabase block in app.js
const startMarker = 'function normalizePinyin(';
const endMarker = '// ---------------- GLOBAL SEARCH ----------------';

const startIdx = appCode.indexOf(startMarker);
const endIdx = appCode.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not locate markers in app.js!');
  process.exit(1);
}

appCode = appCode.slice(0, startIdx) + searchOmniDatabaseCode + '\n\n' + appCode.slice(endIdx);

// Also update renderSearchResults to include jiaocheng badge
const oldBadges = `    culture: () => \`<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-700">Lịch Sử</span>\``;
const newBadges = `    culture: () => \`<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-700">Lịch Sử</span>\`,
    jiaocheng: () => \`<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700">Giáo Trình</span>\``;

appCode = appCode.replace(oldBadges, newBadges);

// Also update selectSearchResult for jiaocheng
const oldSelect = `  } else if (item.type === 'culture') {
    switchTab('culture');
    showToast(\`Đang mở mục: \${item.title}\`, 'info');
  }`;

const newSelect = `  } else if (item.type === 'culture') {
    switchTab('culture');
    showToast(\`Đang mở mục: \${item.title}\`, 'info');
  } else if (item.type === 'jiaocheng') {
    switchTab('curriculum');
    setTimeout(() => {
      if (typeof openLessonDetailModal === 'function') {
        openLessonDetailModal(item.lessonId);
      }
    }, 100);
    showToast(\`Đang mở: \${item.title}\`, 'info');
  }`;

appCode = appCode.replace(oldSelect, newSelect);

// Also enhance openWordModalByTitle to fallback to etymology/radicals
const oldWordModalByTitle = `function openWordModalByTitle(title) {
  const word = (dictionaryData || []).find(w => w.title === title);
  if (!word) {
    showToast(\`Không tìm thấy chi tiết từ "\${title}"\`, 'warning');
    return;
  }
  currentWordModalWord = word;`;

const newWordModalByTitle = `function openWordModalByTitle(title) {
  let word = (dictionaryData || []).find(w => w.title === title);
  if (!word && etymologyData) {
    const etymMatch = etymologyData.find(e => e.hanzi === title);
    if (etymMatch) {
      word = {
        title: etymMatch.hanzi,
        pinyin: etymMatch.pinyin,
        hanviet: etymMatch.hanviet,
        meaning: etymMatch.meaning,
        level: 1,
        pos: 'chữ Hán',
        exampleSentence: etymMatch.etymologyStory ? etymMatch.etymologyStory.slice(0, 100) : title,
        examplePinyin: etymMatch.pinyin,
        exampleMeaning: etymMatch.meaning
      };
    }
  }
  if (!word && radicalsData) {
    const radMatch = radicalsData.find(r => r.char === title);
    if (radMatch) {
      word = {
        title: radMatch.char,
        pinyin: radMatch.pinyin,
        hanviet: \`Bộ \${radMatch.hanviet}\`,
        meaning: radMatch.meaning,
        level: 1,
        pos: \`Bộ thủ (\${radMatch.strokes} nét)\`,
        exampleSentence: \`Bộ thủ Khang Hy: \${radMatch.char} (\${radMatch.hanviet})\`,
        examplePinyin: radMatch.pinyin,
        exampleMeaning: radMatch.meaning
      };
    }
  }
  if (!word) {
    showToast(\`Không tìm thấy chi tiết từ "\${title}"\`, 'warning');
    return;
  }
  currentWordModalWord = word;`;

appCode = appCode.replace(oldWordModalByTitle, newWordModalByTitle);

// Also add focus listener in setupGlobalSearch
const oldInputListen = `  searchInput.addEventListener('input', debounce((e) => {
    handleGlobalSearch(e.target.value);
  }, 80));`;

const newInputListen = `  searchInput.addEventListener('input', debounce((e) => {
    handleGlobalSearch(e.target.value);
  }, 80));

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim() && currentSearchResults && currentSearchResults.length > 0) {
      dropdown.classList.remove('hidden');
    }
  });`;

appCode = appCode.replace(oldInputListen, newInputListen);

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('Successfully updated app.js with high-precision omni search engine!');
