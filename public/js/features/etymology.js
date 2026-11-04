'use strict';

// Module state
let activeEtymologyIndex = 0;
let currentEtymologySearch = '';
let filteredEtymologyIndices = [];

// Common extra components lookup to supplement 214 standard Kangxi radicals
const EXTRA_COMPONENTS = {
  '巴': { char: '巴', name: 'Ba', meaning: 'Con trăn uốn khúc, tạo âm đọc Ba' },
  '相': { char: '相', name: 'Tương', meaning: 'Quan sát, tương hỗ, diện mạo' },
  '与': { char: '与', name: 'Dữ', meaning: 'Cùng với, tham dự' },
  '乞': { char: '乞', name: 'Khất', meaning: 'Cầu khẩn, xin ăn' },
  '曷': { char: '曷', name: 'Hạt', meaning: 'Sao lại, cớ sao / Gốc âm đọc Hạt' },
  '豕': { char: '豕', name: 'Thỉ', meaning: 'Con heo, gia súc ấm no' },
  '卖': { char: '卖', name: 'Mại', meaning: 'Bán ra, phô diễn tri thức' },
  '耳': { char: '耳', name: 'Nhĩ', meaning: 'Cái tai, lắng nghe tin tức' },
  '见': { char: '见', name: 'Kiến', meaning: 'Đôi mắt nhìn thấu, thấy rõ' },
  '完': { char: '完', name: 'Hoàn', meaning: 'Trọn vẹn, toàn vẹn' },
  '景': { char: '景', name: 'Cảnh', meaning: 'Ánh nắng mặt trời trên kinh đô' },
  '彡': { char: '彡', name: 'Sam', meaning: 'Tia sáng rực rỡ, hoa văn' },
  '礻': { char: '礻', name: 'Thị', meaning: 'Bàn thờ tổ tiên, thần linh chúc phúc' },
  '覀': { char: '覀', name: 'Á', meaning: 'Nắp che đậy, phương Tây' },
  '又': { char: '又', name: 'Hựu', meaning: 'Bàn tay phải, lặp lại' },
  '己': { char: '己', name: 'Kỷ', meaning: 'Bản thân mình' },
  '各': { char: '各', name: 'Các', meaning: 'Mỗi người, từng phần riêng biệt' },
  '夕': { char: '夕', name: 'Tịch', meaning: 'Buổi chiều tà, hoàng hôn' },
  '卜': { char: '卜', name: 'Bốc', meaning: 'Bói toán, vết nứt mai rùa' },
  '亥': { char: '亥', name: 'Hợi', meaning: 'Địa chi thứ 12' },
  '⺍': { char: '⺍', name: 'Bát (biến thể)', meaning: 'Vạch hào toán học, ánh sáng' },
  '爻': { char: '爻', name: 'Hào', meaning: 'Quẻ bát quái, vạch toán tri thức' },
  '隹': { char: '隹', name: 'Chuy', meaning: 'Chim đuôi ngắn' },
  '页': { char: '页', name: 'Hiệt', meaning: 'Đầu người, trang giấy' },
  '戈': { char: '戈', name: 'Qua', meaning: 'Cây giáo, binh khí bảo vệ' }
};

// ---------------- TAB 1: CHIẾT TỰ & GỐC TỪ (TÌM KIẾM & PHÂN RÃ HÁN TỰ) ----------------

function renderCharacterPills() {
  const container = document.getElementById('characterPills');
  if (!container) return;

  let indicesToRender = [];
  if (currentEtymologySearch && filteredEtymologyIndices.length > 0) {
    indicesToRender = filteredEtymologyIndices;
  } else {
    // Show top 35 featured characters for quick selection
    indicesToRender = etymologyData.map((_, i) => i).slice(0, 35);
  }

  container.innerHTML = indicesToRender.map(index => {
    const item = etymologyData[index];
    if (!item) return '';
    const isActive = index === activeEtymologyIndex;
    return `
      <button 
        onclick="renderEtymologyDetail(${index})"
        id="pill-char-${index}"
        class="px-3.5 py-1.5 rounded-xl font-hanzi font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
          isActive 
            ? 'bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-amber-100 shadow-sm border border-amber-300/40 scale-105' 
            : 'bg-[#FFFDF9] dark:bg-[#161B22] hover:bg-amber-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
        }">
        ${item.hanzi} <span class="font-sans text-xs ${isActive ? 'text-amber-200' : 'text-stone-400 dark:text-stone-500'} font-normal">(${item.pinyin})</span>
      </button>
    `;
  }).join('');
}

function handleEtymologySearch(query) {
  currentEtymologySearch = (query || '').trim();
  const clearBtn = document.getElementById('clearEtymologySearchBtn');
  const resultsContainer = document.getElementById('etymologySearchResults');
  const resultsList = document.getElementById('etymologyResultsList');
  const countBadge = document.getElementById('etymologyMatchBadge');
  const countText = document.getElementById('etymologyResultsCountText');

  if (clearBtn) {
    if (currentEtymologySearch) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }

  if (!currentEtymologySearch) {
    filteredEtymologyIndices = [];
    if (resultsContainer) resultsContainer.classList.add('hidden');
    if (countBadge) countBadge.innerHTML = `Kho chiết tự: <strong id="etymologyCountNum">${etymologyData.length}</strong> chữ`;
    renderCharacterPills();
    return;
  }

  const rawQ = currentEtymologySearch.toLowerCase();
  const pyQ = normalizePinyin(currentEtymologySearch);
  const viQ = normalizeVietnamese(currentEtymologySearch);

  // 1. Search in existing etymologyData
  const matchedEtymo = [];
  etymologyData.forEach((item, idx) => {
    let score = 0;
    const hanzi = (item.hanzi || '').toLowerCase();
    const pinyin = (item.pinyin || '').toLowerCase();
    const pinyinNorm = normalizePinyin(item.pinyin);
    const hanviet = (item.hanviet || '').toLowerCase();
    const hanvietNorm = normalizeVietnamese(item.hanviet);
    const meaning = (item.meaning || '').toLowerCase();
    const meaningNorm = normalizeVietnamese(item.meaning);

    if (hanzi === rawQ) score += 400;
    else if (hanzi.includes(rawQ) || rawQ.includes(hanzi)) score += 200;

    if (pinyin === rawQ || pinyinNorm === pyQ) score += 250;
    else if (pinyinNorm.includes(pyQ)) score += 120;

    if (hanviet === rawQ || hanvietNorm === viQ) score += 220;
    else if (hanvietNorm.includes(viQ)) score += 110;

    if (meaningNorm.includes(viQ)) score += 90;

    if (item.radicals && Array.isArray(item.radicals)) {
      item.radicals.forEach(r => {
        const rName = normalizeVietnamese(r.name);
        const rMean = normalizeVietnamese(r.meaning);
        if (rName.includes(viQ) || rMean.includes(viQ)) score += 95;
      });
    }

    if (score > 0) {
      matchedEtymo.push({ index: idx, item, score });
    }
  });

  matchedEtymo.sort((a, b) => b.score - a.score);
  filteredEtymologyIndices = matchedEtymo.map(m => m.index);

  // 2. Search in 9,574 Hanzi Decompositions and Dictionary
  const dynamicMatches = [];
  const processedChars = new Set(matchedEtymo.map(m => m.item.hanzi));

  // If query contains Chinese characters directly (e.g. "爸", "北京", "国家")
  for (const ch of currentEtymologySearch) {
    if (ch >= '\u4e00' && ch <= '\u9fff' && !processedChars.has(ch)) {
      processedChars.add(ch);
      const decomp = (typeof hanziDecompositionsData !== 'undefined' && hanziDecompositionsData) ? hanziDecompositionsData[ch] : null;
      const dictMatch = (dictionaryData && Array.isArray(dictionaryData)) ? dictionaryData.find(d => d.title === ch) : null;
      
      dynamicMatches.push({
        hanzi: ch,
        pinyin: dictMatch ? dictMatch.pinyin : '',
        hanviet: dictMatch ? dictMatch.hanviet : '',
        meaning: dictMatch ? dictMatch.meaning : (decomp ? decomp.m : 'Chữ Hán'),
        decomp: decomp,
        score: 500
      });
    }
  }

  // Also search dictionaryData for Pinyin / Hán Việt / Meaning matches not yet processed
  if (dictionaryData && Array.isArray(dictionaryData)) {
    for (const d of dictionaryData) {
      if (!d.title) continue;
      // Single character title
      if (d.title.length === 1 && !processedChars.has(d.title)) {
        let score = 0;
        const title = d.title.toLowerCase();
        const pinyin = (d.pinyin || '').toLowerCase();
        const pinyinNorm = normalizePinyin(d.pinyin);
        const hanviet = (d.hanviet || '').toLowerCase();
        const hanvietNorm = normalizeVietnamese(d.hanviet);
        const meaningNorm = normalizeVietnamese(d.meaning);

        if (title === rawQ) score += 350;
        else if (title.includes(rawQ)) score += 180;
        if (pinyin === rawQ || pinyinNorm === pyQ) score += 220;
        else if (pinyinNorm.includes(pyQ)) score += 110;
        if (hanviet === rawQ || hanvietNorm === viQ) score += 200;
        else if (hanvietNorm.includes(viQ)) score += 100;
        if (meaningNorm.includes(viQ)) score += 80;

        if (score > 0) {
          processedChars.add(d.title);
          const decomp = (typeof hanziDecompositionsData !== 'undefined' && hanziDecompositionsData) ? hanziDecompositionsData[d.title] : null;
          dynamicMatches.push({
            hanzi: d.title,
            pinyin: d.pinyin || '',
            hanviet: d.hanviet || '',
            meaning: d.meaning || '',
            decomp: decomp,
            score: score
          });
        }
      }
    }
  }

  dynamicMatches.sort((a, b) => b.score - a.score);

  // 3. Render suggestions list in #etymologyResultsList
  const totalFound = matchedEtymo.length + dynamicMatches.length;

  if (resultsContainer && resultsList) {
    resultsContainer.classList.remove('hidden');
    if (countText) countText.textContent = `${totalFound} kết quả`;
    if (countBadge) countBadge.innerHTML = `Tìm thấy: <strong>${totalFound}</strong> kết quả`;

    if (totalFound === 0) {
      // Allow instant decomposition for any character typed
      const firstChar = [...currentEtymologySearch].find(c => c >= '\u4e00' && c <= '\u9fff') || currentEtymologySearch;
      resultsList.innerHTML = `
        <div class="col-span-full py-4 text-center text-xs text-stone-500 dark:text-stone-400">
          <p class="mb-2">Chưa có trong danh mục hiển thị sẵn cho từ khóa "<strong>${escapeHtml(currentEtymologySearch)}</strong>".</p>
          <button onclick="selectOrDecomposeEtymology(${jsArg(firstChar)})" class="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-amber-100 border border-[#8B1E1E] transition-all cursor-pointer shadow-xs">
            ✨ Phân rã nét & xem chiết tự chữ "<strong>${escapeHtml(firstChar)}</strong>" ngay
          </button>
        </div>
      `;
    } else {
      let cardsHtml = '';

      // Existing etymology cards
      matchedEtymo.slice(0, 12).forEach(m => {
        const item = m.item;
        cardsHtml += `
          <div onclick="selectOrDecomposeEtymology(${jsArg(item.hanzi)})" class="p-3 rounded-xl bg-white dark:bg-[#161B22] hover:bg-amber-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="font-hanzi text-3xl font-black text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 transition-colors">${item.hanzi}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">Chiết Tự</span>
            </div>
            <div>
              <p class="text-xs font-bold text-amber-800 dark:text-amber-400 truncate">${item.pinyin} ${item.hanviet ? '• ' + item.hanviet : ''}</p>
              <p class="text-[11px] text-stone-600 dark:text-stone-400 truncate mt-0.5">${item.meaning || ''}</p>
            </div>
          </div>
        `;
      });

      // Dynamic decomposition matches (from 9,574 character decomposition database)
      dynamicMatches.slice(0, 16).forEach(dm => {
        const decompInfo = dm.decomp;
        const compStr = decompInfo && decompInfo.c && decompInfo.c.length > 0 ? decompInfo.c.join(' + ') : '';
        cardsHtml += `
          <div onclick="selectOrDecomposeEtymology(${jsArg(dm.hanzi)})" class="p-3 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-[#161B22] dark:to-stone-800 hover:bg-amber-100/50 dark:hover:bg-stone-700 border border-amber-300/80 dark:border-amber-800/60 hover:border-amber-500 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="font-hanzi text-3xl font-black text-[#8B1E1E] dark:text-amber-300 group-hover:scale-105 transition-transform">${dm.hanzi}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-2xs">✨ Phân rã nét</span>
            </div>
            <div>
              <p class="text-xs font-bold text-amber-900 dark:text-amber-300 truncate">${dm.pinyin} ${dm.hanviet ? '• ' + dm.hanviet : ''}</p>
              <p class="text-[11px] text-stone-700 dark:text-stone-300 truncate mt-0.5">${dm.meaning || ''}</p>
              ${compStr ? `<p class="text-[10px] text-amber-700 dark:text-amber-400 font-mono mt-1">Bộ thủ: ${compStr}</p>` : ''}
            </div>
          </div>
        `;
      });

      resultsList.innerHTML = cardsHtml;
    }
  }

  renderCharacterPills();
}

function selectOrDecomposeEtymology(char) {
  if (!char) return;
  const targetChar = char.trim();

  // If input has multiple characters (e.g. "北京"), extract the first Hanzi
  const hanziList = [...targetChar].filter(c => c >= '\u4e00' && c <= '\u9fff');
  const selectedChar = hanziList.length > 0 ? hanziList[0] : targetChar;

  // 1. Check if character is directly in etymologyData
  const foundIdx = etymologyData.findIndex(item => item.hanzi === selectedChar);
  if (foundIdx !== -1) {
    activeEtymologyIndex = foundIdx;
    renderEtymologyDetail(foundIdx);

    const resultsContainer = document.getElementById('etymologySearchResults');
    if (resultsContainer) resultsContainer.classList.add('hidden');

    const container = document.getElementById('activeEtymologyContainer');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    return;
  }

  // 2. Decompose dynamically using 9,574 character database
  createAndShowEtymology(selectedChar);
}

function createAndShowEtymology(wordOrChar) {
  const char = wordOrChar.trim();
  if (!char) return;

  // Check existing
  const existingIdx = etymologyData.findIndex(item => item.hanzi === char);
  if (existingIdx !== -1) {
    activeEtymologyIndex = existingIdx;
    renderEtymologyDetail(existingIdx);
    return;
  }

  // Look up in 9,574 character database
  const decomp = (typeof hanziDecompositionsData !== 'undefined' && hanziDecompositionsData) ? hanziDecompositionsData[char] : null;

  let dictEntry = null;
  if (dictionaryData && Array.isArray(dictionaryData)) {
    dictEntry = dictionaryData.find(d => d.title === char) || dictionaryData.find(d => d.title && d.title.includes(char)) || null;
  }

  let radEntry = null;
  if (radicalsData && Array.isArray(radicalsData)) {
    radEntry = radicalsData.find(r => r.char === char) || null;
  }

  // Build 214 radicals lookup map
  const radMap = new Map();
  if (radicalsData && Array.isArray(radicalsData)) {
    radicalsData.forEach(r => {
      const cleanName = r.hanviet ? r.hanviet.replace(/^Bộ\s+/i, '').trim() : 'Bộ';
      radMap.set(r.char, { char: r.char, name: cleanName, meaning: r.meaning || 'Bộ thủ gốc' });
      (r.variants || []).forEach(v => {
        radMap.set(v, { char: v, name: cleanName, meaning: r.meaning || 'Biến thể bộ thủ' });
      });
    });
  }

  const detectedRadicals = [];
  const rawComponents = decomp ? (decomp.c || []) : [];

  // Extract components from decomposition
  rawComponents.forEach(c => {
    if (c === char) return;
    const found = radMap.get(c);
    if (found) {
      if (!detectedRadicals.some(dr => dr.char === found.char)) {
        detectedRadicals.push({ char: found.char, name: found.name, meaning: found.meaning });
      }
    } else {
      const extra = EXTRA_COMPONENTS[c];
      if (extra) {
        if (!detectedRadicals.some(dr => dr.char === extra.char)) {
          detectedRadicals.push({ char: extra.char, name: extra.name, meaning: extra.meaning });
        }
      } else {
        const dictMatch = dictionaryData?.find(d => d.title === c);
        detectedRadicals.push({
          char: c,
          name: dictMatch?.hanviet || `Thành tố ${c}`,
          meaning: dictMatch?.meaning || `Thành phần tạo chữ ${c}`
        });
      }
    }
  });

  // If primary radical is known and not in components, insert at head
  if (decomp && decomp.r && decomp.r !== char && !detectedRadicals.some(dr => dr.char === decomp.r)) {
    const mainRad = radMap.get(decomp.r);
    if (mainRad) {
      detectedRadicals.unshift({ char: mainRad.char, name: mainRad.name, meaning: mainRad.meaning });
    }
  }

  // Fallback for single primitive radicals
  if (detectedRadicals.length === 0) {
    if (radEntry) {
      detectedRadicals.push({
        char: radEntry.char,
        name: radEntry.hanviet.replace(/^Bộ\s+/i, '').trim(),
        meaning: radEntry.meaning || 'Bộ thủ nguyên thủy'
      });
    } else {
      detectedRadicals.push({
        char: char,
        name: dictEntry?.hanviet || 'Tượng hình',
        meaning: dictEntry?.meaning || 'Văn tự nguyên bản'
      });
    }
  }

  const pinyin = dictEntry?.pinyin || radEntry?.pinyin || '';
  const hanviet = dictEntry?.hanviet || radEntry?.hanviet || '';
  const meaning = dictEntry?.meaning || decomp?.m || radEntry?.meaning || 'Từ vựng tiếng Hán';
  const level = dictEntry?.level || 1;
  const strokeCount = char.length * 4;

  const etymType = decomp?.t || (detectedRadicals.length > 1 ? 'Hội ý (会意)' : 'Tượng hình (象形)');
  const radSummary = detectedRadicals.map(r => `Bộ ${r.name} (${r.char}: ${r.meaning})`).join(' kết hợp với ');

  let story = '';
  let memoryTip = '';

  if (etymType.includes('Hình thanh')) {
    const phoneticChar = decomp?.p || (detectedRadicals[1]?.char || '');
    story = `Chữ 「${char}」 (${pinyin} • Hán Việt: [${hanviet}]) thuộc quy luật tạo chữ Hình thanh (形声) kinh điển: Trong đó thành phần biểu ý là Bộ ${detectedRadicals[0].name} (${detectedRadicals[0].char}: ${detectedRadicals[0].meaning}) đóng vai trò tạo trường nghĩa, kết hợp với thành phần biểu âm ${phoneticChar ? `chữ ${phoneticChar}` : 'bộ phận biểu âm'} mượn âm đọc tương cận. Nghĩa chính của chữ: ${meaning}.`;
    memoryTip = `Nhận diện chữ 「${char}」: Lấy nghĩa từ Bộ ${detectedRadicals[0].name} (${detectedRadicals[0].meaning}) + mượn âm từ ${phoneticChar || 'thành tố âm'}.`;
  } else if (etymType.includes('Hội ý')) {
    story = `Chữ 「${char}」 (${pinyin} • Hán Việt: [${hanviet}]) được sáng tạo theo phép Hội ý (会意) sâu sắc: Cấu thành từ sự kết hợp tương hỗ giữa ${radSummary}. Khi các bộ thủ này kết hợp lại, chúng cộng hưởng tạo nên nghĩa biểu đạt: ${meaning}. Phản ánh tư duy quan sát đời sống tinh tế của người xưa.`;
    memoryTip = `Ghép ${detectedRadicals.map(r => r.name).join(' + ')} thành chữ 「${char}」 mang nghĩa: ${meaning}.`;
  } else if (etymType.includes('Tượng hình')) {
    story = `Chữ 「${char}」 (${pinyin} • Hán Việt: [${hanviet}]) là chữ Tượng hình (象形) cổ xưa, phác họa lại trực quan hình tượng của: ${meaning}. Trải qua các thời kỳ Giáp cốt văn đến Khải thư, chữ giữ nguyên cốt cách tạo hình độc đáo của văn tự phương Đông.`;
    memoryTip = `Chữ 「${char}」 là bức tranh tượng hình cổ phác họa lại: ${meaning}.`;
  } else {
    story = `Chữ 「${char}」 (${pinyin} • Hán Việt: [${hanviet}]) có cấu tạo gồm ${radSummary}. Mang nghĩa biểu đạt: ${meaning}.`;
    memoryTip = `Khắc sâu chữ 「${char}」 qua các bộ thủ: ${detectedRadicals.map(r => r.name).join(' + ')}.`;
  }

  // Related Family Words
  let familyWords = [];
  if (dictionaryData && Array.isArray(dictionaryData)) {
    familyWords = dictionaryData
      .filter(d => d.title && d.title !== char && d.title.includes(char))
      .slice(0, 5)
      .map(w => ({
        char: w.title,
        pinyin: w.pinyin || '',
        meaning: w.meaning || ''
      }));
  }

  // Common Words
  let commonWords = [];
  if (dictionaryData && Array.isArray(dictionaryData)) {
    commonWords = dictionaryData
      .filter(d => d.title && d.title !== char && d.title.includes(char))
      .slice(0, 5)
      .map(w => `${w.title} (${w.pinyin || ''}: ${w.meaning || ''})`);
  }

  const newEntry = {
    hanzi: char,
    pinyin: pinyin,
    hanviet: hanviet,
    meaning: meaning,
    level: level,
    strokeCount: strokeCount,
    radicals: detectedRadicals,
    etymologyStory: story,
    memoryTip: memoryTip,
    family: familyWords,
    commonWords: commonWords,
    example: {
      hanzi: dictEntry?.exampleSentence || `我们要学好汉字「${char}」的用法。`,
      pinyin: dictEntry?.examplePinyin || `Wǒmen yào xuéhǎo hànzì "${char}" de yòngfǎ.`,
      vi: dictEntry?.exampleMeaning || `Chúng ta cần nắm vững cách dùng của chữ 「${char}」.`
    }
  };

  etymologyData.unshift(newEntry);
  activeEtymologyIndex = 0;

  const countNum = document.getElementById('etymologyCountNum');
  if (countNum) countNum.textContent = etymologyData.length;

  renderEtymologyDetail(0);

  const resultsContainer = document.getElementById('etymologySearchResults');
  if (resultsContainer) resultsContainer.classList.add('hidden');

  const container = document.getElementById('activeEtymologyContainer');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderEtymologyDetail(index) {
  activeEtymologyIndex = index;
  renderCharacterPills();
  const data = etymologyData[index] || etymologyData[0];
  const container = document.getElementById('activeEtymologyContainer');
  if (!container || !data) return;

  const radicalsList = Array.isArray(data.radicals) ? data.radicals : [];
  const familyList = Array.isArray(data.family) ? data.family : [];
  const commonWordsList = Array.isArray(data.commonWords) ? data.commonWords : [];
  const example = data.example || { hanzi: '', pinyin: '', vi: '' };

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Main Character Card -->
      <div class="glass-card rounded-2xl p-6 lg:p-8 flex flex-col justify-between border-amber-200/80 dark:border-stone-800 bg-white dark:bg-[#161B22] shadow-sm">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
              HSK ${data.level || 1}
            </span>
            <span class="text-xs text-stone-500 dark:text-stone-400 font-medium">Số nét: <strong>${data.strokeCount || 1}</strong></span>
          </div>

          <div class="text-center py-6">
            <h1 onclick="openWritingModal(${jsArg(data.hanzi)}, ${jsArg(data.pinyin || '')}, ${jsArg(data.meaning || '')}); closeWordModal();" class="font-hanzi text-8xl font-black text-stone-900 dark:text-stone-100 tracking-wider mb-2 cursor-pointer hover:text-[#8B1E1E] dark:hover:text-amber-400 transition-colors" title="Nhấn vào chữ để xem và tập viết nét">${data.hanzi}</h1>
            <div class="flex items-center justify-center gap-3">
              <span class="text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono">${data.pinyin}</span>
              <div class="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <button onclick="playChineseTTS(${jsArg(data.hanzi)}, 'female')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-rose-50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-xs font-bold transition-colors cursor-pointer" title="Phát âm giọng Nữ">
                  👩 Nữ
                </button>
                <button onclick="playChineseTTS(${jsArg(data.hanzi)}, 'male')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-blue-50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 text-xs font-bold transition-colors cursor-pointer" title="Phát âm giọng Nam">
                  👨 Nam
                </button>
              </div>
            </div>
            ${data.hanviet ? `<p class="text-sm font-bold text-emerald-800 dark:text-emerald-400 mt-2">Hán Việt: [ ${data.hanviet} ]</p>` : ''}
            <p class="text-base text-stone-800 dark:text-stone-200 mt-2 font-medium leading-relaxed">${data.meaning || ''}</p>
            <div class="flex items-center justify-center gap-2 mt-4">
              <button onclick="openWritingModal(${jsArg(data.hanzi)}, ${jsArg(data.pinyin || '')}, ${jsArg(data.meaning || '')}); closeWordModal();" class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
                <i data-lucide="pen-tool" class="w-4 h-4"></i>
                <span>Tập Viết Nét</span>
              </button>
              <button onclick="toggleSaveWord(${jsArg(data.hanzi)}, ${jsArg(data.pinyin || '')}, ${jsArg(data.meaning || '')}, ${data.level || 1})" class="px-4 py-2 rounded-xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-stone-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                <i data-lucide="bookmark" class="w-4 h-4 text-amber-600"></i>
                <span>Lưu Sổ Tay</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Common Words -->
        <div class="pt-4 border-t border-stone-100 dark:border-stone-800">
          <p class="text-xs text-stone-500 dark:text-stone-400 font-bold mb-2 uppercase tracking-wide">Từ ghép thông dụng:</p>
          <div class="flex flex-wrap gap-2">
            ${commonWordsList.map(w => `
              <span class="px-2.5 py-1 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 text-xs text-stone-800 dark:text-stone-200 border border-amber-200 dark:border-amber-800/50 font-medium">
                ${w}
              </span>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: Radicals & Etymology Breakdown -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Radicals Decomposition Badges (BỘ THỦ CẤU THÀNH) -->
        <div class="glass-card rounded-2xl p-6 border-amber-200/80 dark:border-stone-800 bg-white dark:bg-[#161B22] shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="layers" class="w-4 h-4 text-amber-600"></i>
              <span>Bộ Thủ Cấu Thành (Phân rã nét)</span>
            </h3>
            <span class="text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950 px-2.5 py-0.5 rounded-lg border border-amber-200">
              ${radicalsList.length} Thành Tố
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            ${radicalsList.map(r => `
              <div class="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 flex items-center gap-4 hover:border-amber-400 transition-all">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center shadow-xs shrink-0">
                  <span class="font-hanzi text-2xl font-bold">${r.char}</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">Bộ ${r.name}</h4>
                  <p class="text-xs text-stone-600 dark:text-stone-400 leading-snug">${r.meaning}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Mnemonic Story & Etymology Origin (CÂU CHUYỆN CHIẾT TỰ & NGUỒN GỐC) -->
        <div class="glass-card rounded-2xl p-6 border-amber-200/80 dark:border-stone-800 bg-gradient-to-r from-amber-50/60 via-white to-white dark:from-[#161B22] dark:via-[#1c222d] dark:to-[#161B22] shadow-sm">
          <h3 class="text-sm font-bold text-[#8B1E1E] dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i data-lucide="lightbulb" class="w-4 h-4 text-amber-500"></i>
            <span>Câu Chuyện Chiết Tự & Nguồn Gốc</span>
          </h3>
          <p class="text-sm lg:text-base text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
            ${data.etymologyStory || ''}
          </p>
          <div class="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
            <i data-lucide="sparkles" class="w-5 h-5 text-amber-600 flex-shrink-0"></i>
            <p class="text-xs font-semibold text-amber-950 dark:text-amber-200">
              <strong class="text-[#8B1E1E] dark:text-amber-400">Mẹo nhớ nhanh:</strong> ${data.memoryTip || ''}
            </p>
          </div>
        </div>

        <!-- Character Family Tree -->
        <div class="glass-card rounded-2xl p-6 border-amber-200/80 dark:border-stone-800 bg-white dark:bg-[#161B22] shadow-sm">
          <h3 class="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <i data-lucide="git-merge" class="w-4 h-4 text-amber-600"></i>
            <span>Cây Phả Hệ Chữ Họ Hàng (Cùng Gốc)</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${familyList.map(f => `
              <div onclick="selectOrDecomposeEtymology(${jsArg(f.char)})" class="p-3.5 rounded-xl bg-white dark:bg-[#21262D] hover:bg-amber-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 hover:border-amber-400 transition-all flex items-center gap-3 shadow-xs cursor-pointer group">
                <span class="font-hanzi text-3xl font-black text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 w-10 text-center transition-colors">${f.char}</span>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">${f.pinyin}</span>
                  </div>
                  <p class="text-xs text-stone-600 dark:text-stone-400 truncate mt-0.5">${f.meaning}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Bilingual Example Context -->
        ${example.hanzi ? `
          <div class="glass-card rounded-2xl p-6 border-amber-200/80 dark:border-stone-800 bg-[#FAF7F2] dark:bg-[#161B22] shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="quote" class="w-4 h-4 text-amber-600"></i>
                <span>Ví Dụ Ứng Dụng Ngữ Cảnh</span>
              </h3>
              <div class="flex items-center gap-1 bg-white dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <button onclick="playChineseTTS(${jsArg(example.hanzi)}, 'female')" class="px-2.5 py-1 rounded-lg hover:bg-rose-50 text-rose-800 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu ví dụ giọng Nữ">
                  👩 Nữ
                </button>
                <button onclick="playChineseTTS(${jsArg(example.hanzi)}, 'male')" class="px-2.5 py-1 rounded-lg hover:bg-blue-50 text-blue-800 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu ví dụ giọng Nam">
                  👨 Nam
                </button>
              </div>
            </div>
            <p class="font-hanzi text-xl font-bold text-stone-900 dark:text-stone-100 leading-relaxed mb-1">${example.hanzi}</p>
            <p class="text-xs text-amber-800 dark:text-amber-400 font-mono mb-2">${example.pinyin}</p>
            <p class="text-sm text-stone-600 dark:text-stone-300 italic">${example.vi}</p>
          </div>
        ` : ''}

      </div>
    </div>
  `;

  refreshIcons();
}

function clearEtymologySearch() {
  const input = document.getElementById('etymologySearchInput');
  if (input) input.value = '';
  handleEtymologySearch('');
}

function handleEtymologySearchKeyDown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const input = document.getElementById('etymologySearchInput');
    if (input && input.value.trim()) {
      selectOrDecomposeEtymology(input.value.trim());
    }
  } else if (e.key === 'Escape') {
    clearEtymologySearch();
  }
}

