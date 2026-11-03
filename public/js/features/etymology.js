// Module state
let activeEtymologyIndex = 0;
let currentEtymologySearch = '';
let filteredEtymologyIndices = [];

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

    if (hanzi === rawQ) score += 300;
    else if (hanzi.includes(rawQ)) score += 180;

    if (pinyin === rawQ || pinyinNorm === pyQ) score += 200;
    else if (pinyinNorm.includes(pyQ)) score += 100;

    if (hanviet === rawQ || hanvietNorm === viQ) score += 190;
    else if (hanvietNorm.includes(viQ)) score += 95;

    if (meaningNorm.includes(viQ)) score += 80;

    if (item.radicals && Array.isArray(item.radicals)) {
      item.radicals.forEach(r => {
        const rName = normalizeVietnamese(r.name);
        const rMean = normalizeVietnamese(r.meaning);
        if (rName.includes(viQ) || rMean.includes(viQ)) score += 85;
      });
    }

    if (score > 0) {
      matchedEtymo.push({ index: idx, item, score });
    }
  });

  matchedEtymo.sort((a, b) => b.score - a.score);
  filteredEtymologyIndices = matchedEtymo.map(m => m.index);

  // 2. Search in dictionaryData for words/characters not in etymologyData
  const dictMatches = [];
  if (dictionaryData && Array.isArray(dictionaryData)) {
    for (const d of dictionaryData) {
      if (!d.title) continue;
      const inEtymo = etymologyData.some(e => e.hanzi === d.title);
      if (inEtymo) continue;

      let score = 0;
      const title = d.title.toLowerCase();
      const pinyin = (d.pinyin || '').toLowerCase();
      const pinyinNorm = normalizePinyin(d.pinyin);
      const hanviet = (d.hanviet || '').toLowerCase();
      const hanvietNorm = normalizeVietnamese(d.hanviet);
      const meaningNorm = normalizeVietnamese(d.meaning);

      if (title === rawQ) score += 280;
      else if (title.includes(rawQ)) score += 140;

      if (pinyin === rawQ || pinyinNorm === pyQ) score += 180;
      else if (pinyinNorm.includes(pyQ)) score += 90;

      if (hanviet === rawQ || hanvietNorm === viQ) score += 170;
      else if (hanvietNorm.includes(viQ)) score += 85;

      if (meaningNorm.includes(viQ)) score += 75;

      if (score > 0) {
        dictMatches.push({ item: d, score });
      }
    }
    dictMatches.sort((a, b) => b.score - a.score);
  }

  // 3. Render suggestions list in #etymologyResultsList
  const totalFound = matchedEtymo.length + dictMatches.length;

  if (resultsContainer && resultsList) {
    resultsContainer.classList.remove('hidden');
    if (countText) countText.textContent = `${totalFound} kết quả`;
    if (countBadge) countBadge.innerHTML = `Tìm thấy: <strong>${totalFound}</strong> kết quả`;

    if (totalFound === 0) {
      resultsList.innerHTML = `
        <div class="col-span-full py-4 text-center text-xs text-stone-500 dark:text-stone-400">
          <p class="mb-2">Không tìm thấy chữ Hán nào khớp sẵn với từ khóa "<strong>${escapeHtml(currentEtymologySearch)}</strong>".</p>
          <button onclick="selectOrDecomposeEtymology(${jsArg(currentEtymologySearch)})" class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 text-[#8B1E1E] dark:text-amber-300 border border-amber-300 dark:border-amber-800 transition-all cursor-pointer">
            ✨ Tạo chiết tự tự động cho từ "<strong>${escapeHtml(currentEtymologySearch)}</strong>" ngay
          </button>
        </div>
      `;
    } else {
      let cardsHtml = '';

      // Existing etymology cards (first 18)
      matchedEtymo.slice(0, 18).forEach(m => {
        const item = m.item;
        cardsHtml += `
          <div onclick="selectOrDecomposeEtymology(${jsArg(item.hanzi)})" class="p-2.5 rounded-xl bg-white dark:bg-[#161B22] hover:bg-amber-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="font-hanzi text-2xl font-black text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 transition-colors">${item.hanzi}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">Chiết Tự</span>
            </div>
            <div>
              <p class="text-[11px] font-bold text-amber-700 dark:text-amber-400 truncate">${item.pinyin} ${item.hanviet ? `• ${item.hanviet}` : ''}</p>
              <p class="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">${item.meaning || ''}</p>
            </div>
          </div>
        `;
      });

      // Dictionary matches that can be auto-decomposed (first 12)
      dictMatches.slice(0, 12).forEach(dm => {
        const item = dm.item;
        cardsHtml += `
          <div onclick="selectOrDecomposeEtymology(${jsArg(item.title)})" class="p-2.5 rounded-xl bg-gradient-to-br from-white to-amber-50/40 dark:from-[#161B22] dark:to-stone-800 hover:bg-amber-100/50 dark:hover:bg-stone-700 border border-amber-200 dark:border-amber-800/60 hover:border-amber-400 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="font-hanzi text-2xl font-black text-[#8B1E1E] dark:text-amber-300 group-hover:scale-105 transition-transform">${item.title}</span>
              <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">✨ Khám phá</span>
            </div>
            <div>
              <p class="text-[11px] font-bold text-amber-700 dark:text-amber-400 truncate">${item.pinyin} ${item.hanviet ? `• ${item.hanviet}` : ''}</p>
              <p class="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">${item.meaning || ''}</p>
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

  // Check if character is directly in etymologyData
  const foundIdx = etymologyData.findIndex(item => item.hanzi === targetChar);
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

  // Decompose dynamically
  createAndShowEtymology(targetChar);
}

function createAndShowEtymology(wordOrChar) {
  const char = wordOrChar.trim();
  if (!char) return;

  let dictEntry = null;
  if (dictionaryData && Array.isArray(dictionaryData)) {
    dictEntry = dictionaryData.find(d => d.title === char) || null;
  }

  let radEntry = null;
  if (radicalsData && Array.isArray(radicalsData)) {
    radEntry = radicalsData.find(r => r.char === char) || null;
  }

  const detectedRadicals = [];
  
  if (radEntry) {
    detectedRadicals.push({
      char: radEntry.char,
      name: radEntry.hanviet ? radEntry.hanviet.replace(/^Bộ\s+/i, '').trim() : 'Gốc',
      meaning: radEntry.meaning || 'Bộ thủ nguyên thủy'
    });
  }

  const COMMON_RADICALS_LOOKUP = [
    { char: "氵", name: "Ba chấm thủy", meaning: "Dòng nước, chất lỏng" },
    { char: "亻", name: "Nhân đứng", meaning: "Con người, hành vi nhân thế" },
    { char: "扌", name: "Thủ (tay)", meaning: "Bàn tay, động tác thao tác" },
    { char: "口", name: "Khẩu", meaning: "Cái miệng, ăn uống, lời nói" },
    { char: "讠", name: "Ngôn", meaning: "Lời nói, phát ngôn, giao tiếp" },
    { char: "艹", name: "Thảo đầu", meaning: "Cỏ cây, thực vật, hoa lá" },
    { char: "女", name: "Nữ", meaning: "Người phụ nữ, nữ tính, gia đình" },
    { char: "宀", name: "Miên", meaning: "Mái nhà, nơi cư trú" },
    { char: "忄", name: "Tâm đứng", meaning: "Trái tim, tình cảm, cảm xúc" },
    { char: "心", name: "Tâm", meaning: "Trái tim, tấm lòng" },
    { char: "辶", name: "Xước", meaning: "Bước chân đi, di chuyển trên đường" },
    { char: "饣", name: "Thực", meaning: "Đồ ăn, ẩm thực" },
    { char: "钅", name: "Kim", meaning: "Kim loại, vàng bạc, công cụ" },
    { char: "木", name: "Mộc", meaning: "Cây gỗ, đồ đạc bằng gỗ" },
    { char: "目", name: "Mục", meaning: "Đôi mắt, nhìn ngắm" },
    { char: "日", name: "Nhật", meaning: "Mặt trời, thời gian, ánh sáng" },
    { char: "月", name: "Nguyệt", meaning: "Mặt trăng, cơ thể (nhục)" },
    { char: "纟", name: "Mịch", meaning: "Sợi tơ, vải vóc, ràng buộc" },
    { char: "土", name: "Thổ", meaning: "Đất đai, địa hạt" },
    { char: "火", name: "Hỏa", meaning: "Ngọn lửa, sức nóng" },
    { char: "灬", name: "Hỏa (4 chấm)", meaning: "Nấu nướng, nhiệt độ" },
    { char: "阝", name: "Phụ / Ấp", meaning: "Gò đất cao hoặc đô thị" },
    { char: "疒", name: "Nạch", meaning: "Bệnh tật, đau ốm" },
    { char: "禾", name: "Hòa", meaning: "Cây lúa, hoa màu" },
    { char: "穴", name: "Huyệt", meaning: "Hang hốc, khoảng trống" },
    { char: "竹", name: "Trúc", meaning: "Tre trúc, ghi chép" },
    { char: "门", name: "Môn", meaning: "Cánh cửa, ngõ lối" },
    { char: "雨", name: "Vũ", meaning: "Mưa, thời tiết mây gió" },
    { char: "车", name: "Xa", meaning: "Xe cộ, vận tải" },
    { char: "力", name: "Lực", meaning: "Sức lực, sự dũng mãnh" },
    { char: "犬", name: "Khuyển", meaning: "Loài chó, loài thú" },
    { char: "犭", name: "Khuyển đứng", meaning: "Loài thú bốn chân" },
    { char: "大", name: "Đại", meaning: "To lớn" },
    { char: "小", name: "Tiểu", meaning: "Nhỏ bé" },
    { char: "子", name: "Tử", meaning: "Đứa con, trẻ nhỏ" },
    { char: "石", name: "Thạch", meaning: "Hòn đá, khoáng vật" },
    { char: "田", name: "Điền", meaning: "Ruộng đồng đất đai" },
    { char: "鸟", name: "Điểu", meaning: "Loài chim bay" },
    { char: "鱼", name: "Ngư", meaning: "Loài cá dưới nước" }
  ];

  if (radicalsData && Array.isArray(radicalsData)) {
    for (const r of radicalsData) {
      if (r.examples && Array.isArray(r.examples) && r.examples.includes(char)) {
        if (!detectedRadicals.some(dr => dr.char === r.char)) {
          detectedRadicals.push({
            char: r.char,
            name: r.hanviet ? r.hanviet.replace(/^Bộ\s+/i, '').trim() : 'Bộ thủ',
            meaning: r.meaning || 'Gốc chữ'
          });
        }
      }
    }
  }

  for (const r of COMMON_RADICALS_LOOKUP) {
    if (char.includes(r.char) && !detectedRadicals.some(dr => dr.char === r.char)) {
      detectedRadicals.push({ char: r.char, name: r.name, meaning: r.meaning });
    }
  }

  if (detectedRadicals.length === 0) {
    detectedRadicals.push({
      char: char[0],
      name: (dictEntry && dictEntry.hanviet) ? dictEntry.hanviet : 'Tự nguyên',
      meaning: (dictEntry && dictEntry.meaning) ? dictEntry.meaning : 'Gốc chữ tạo nghĩa'
    });
  }

  const pinyin = (dictEntry && dictEntry.pinyin) || (radEntry && radEntry.pinyin) || '';
  const hanviet = (dictEntry && dictEntry.hanviet) || (radEntry && radEntry.hanviet) || '';
  const meaning = (dictEntry && dictEntry.meaning) || (radEntry && radEntry.meaning) || 'Từ vựng tiếng Hán';
  const level = (dictEntry && dictEntry.level) || 1;
  const strokeCount = char.length * 4;

  const radSummary = detectedRadicals.map(r => `bộ ${r.name} (${r.meaning})`).join(', ');

  const story = `Chữ 「${char}」 (Pinyin: ${pinyin} ${hanviet ? `• Hán Việt: [ ${hanviet} ]` : ''}): ${meaning}. Cấu tạo văn tự kết hợp thành tố ${radSummary}. Trong ngữ cảnh tiếng Trung hiện đại, chữ thể hiện sự liên kết mật thiết giữa hình thể tượng hình và trường nghĩa đời sống sinh hoạt, văn hóa truyền thống.`;

  const memoryTip = `Khắc sâu chữ 「${char}」 qua ${detectedRadicals[0].name} (${detectedRadicals[0].meaning}): Biểu đạt ý nghĩa ${meaning}.`;

  let familyWords = [];
  if (dictionaryData && Array.isArray(dictionaryData)) {
    familyWords = dictionaryData.filter(d => d.title && d.title !== char && (d.title.includes(char) || char.includes(d.title))).slice(0, 5);
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
    family: familyWords.map(w => ({
      char: w.title,
      pinyin: w.pinyin || '',
      meaning: w.meaning || ''
    })),
    commonWords: familyWords.map(w => `${w.title} (${w.pinyin}: ${w.meaning})`),
    example: {
      hanzi: (dictEntry && dictEntry.exampleSentence) || `我们要学好汉字「${char}」的用法。`,
      pinyin: (dictEntry && dictEntry.examplePinyin) || `Wǒmen yào xuéhǎo hànzì "${char}" de yòngfǎ.`,
      vi: (dictEntry && dictEntry.exampleMeaning) || `Chúng ta cần nắm vững cách dùng của chữ 「${char}」.`
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

function handleEtymologySearchKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const input = document.getElementById('etymologySearchInput');
    const val = input ? input.value.trim() : '';
    if (!val) return;

    if (filteredEtymologyIndices.length > 0) {
      renderEtymologyDetail(filteredEtymologyIndices[0]);
      const resultsContainer = document.getElementById('etymologySearchResults');
      if (resultsContainer) resultsContainer.classList.add('hidden');
    } else {
      selectOrDecomposeEtymology(val);
    }
  } else if (event.key === 'Escape') {
    clearEtymologySearch();
  }
}

function clearEtymologySearch() {
  const input = document.getElementById('etymologySearchInput');
  if (input) input.value = '';
  handleEtymologySearch('');
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
      <div class="glass-card rounded-2xl p-6 lg:p-8 flex flex-col justify-between border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161B22] shadow-sm">
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
              <span class="text-2xl font-bold text-amber-700 dark:text-amber-400">${data.pinyin}</span>
              <div class="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <button onclick="playChineseTTS(${jsArg(data.hanzi)}, 'female')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-rose-50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-xs font-bold transition-colors cursor-pointer" title="Phát âm giọng Nữ">
                  👩 Nữ
                </button>
                <button onclick="playChineseTTS(${jsArg(data.hanzi)}, 'male')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-blue-50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 text-xs font-bold transition-colors cursor-pointer" title="Phát âm giọng Nam">
                  👨 Nam
                </button>
              </div>
            </div>
            ${data.hanviet ? `<p class="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-2">Hán Việt: [ ${data.hanviet} ]</p>` : ''}
            <p class="text-base text-stone-800 dark:text-stone-200 mt-2 font-medium">${data.meaning || ''}</p>
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
        
        <!-- Radicals Decomposition Badges -->
        <div class="glass-card rounded-2xl p-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161B22]">
          <h3 class="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <i data-lucide="layers" class="w-4 h-4 text-amber-600"></i>
            <span>Bộ Thủ Cấu Thành (Phân rã nét)</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            ${radicalsList.map(r => `
              <div class="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#A52A2A] text-white flex items-center justify-center shadow-xs shrink-0">
                  <span class="font-hanzi text-2xl font-bold">${r.char}</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">Bộ ${r.name}</h4>
                  <p class="text-xs text-stone-600 dark:text-stone-400">${r.meaning}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Mnemonic Story -->
        <div class="glass-card rounded-2xl p-6 border-stone-200 dark:border-stone-800 bg-gradient-to-r from-amber-50/50 via-white to-white dark:from-[#161B22] dark:via-[#1c222d] dark:to-[#161B22]">
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
        <div class="glass-card rounded-2xl p-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161B22]">
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
                    <span class="text-xs font-bold text-amber-700 dark:text-amber-400">${f.pinyin}</span>
                  </div>
                  <p class="text-xs text-stone-600 dark:text-stone-400 font-medium">${f.meaning}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Sample Sentence -->
        <div class="glass-card rounded-2xl p-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161B22]">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="quote" class="w-4 h-4 text-amber-600"></i>
              <span>Ứng Dụng Trong Mẫu Câu</span>
            </h3>
            <div class="flex items-center gap-1">
              <button onclick="playChineseTTS(${jsArg(example.hanzi || '')}, 'female')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-rose-50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu mẫu giọng Nữ">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                <span>👩 Nữ</span>
              </button>
              <button onclick="playChineseTTS(${jsArg(example.hanzi || '')}, 'male')" class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#21262D] hover:bg-blue-50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 text-xs font-bold transition-colors cursor-pointer" title="Nghe câu mẫu giọng Nam">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                <span>👨 Nam</span>
              </button>
            </div>
          </div>
          <div class="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50">
            <p class="font-hanzi text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">${example.hanzi}</p>
            <p class="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">${example.pinyin}</p>
            <p class="text-sm text-stone-700 dark:text-stone-300">${example.vi}</p>
          </div>
        </div>

      </div>
    </div>
  `;

  refreshIcons();
}
