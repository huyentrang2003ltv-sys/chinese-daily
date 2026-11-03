// ==========================================
// MODULE: TRỢ LÝ DỊCH AI NỔI (FLOATING AI ASSISTANT CHAT WIDGET)
// ==========================================
let floatingAiMode = 'translate'; // 'translate', 'chat', 'grammar'
let floatingAiMessages = [
  {
    sender: 'ai',
    hanzi: '你好！我是你的AI翻译与口语助教 🤖🎧',
    pinyin: 'Nǐ hǎo! Wǒ shì nǐ de AI fānyì yǔ kǒuyǔ zhùjiào.',
    vi: 'Xin chào! Mình là Trợ lý Dịch AI & Khẩu Ngữ. Bạn có thể nhập bất kỳ câu tiếng Việt nào để dịch sang tiếng Trung, dán câu tiếng Trung cần tra cứu, hoặc luyện đàm thoại cùng mình nhé!',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];
let isFloatingAiOpen = false;

function initFloatingAiAssistant() {
  renderFloatingAiMessages();
  renderFloatingAiQuickChips();
}

function toggleFloatingAiChat() {
  const windowEl = document.getElementById('floatingAiChatWindow');
  const tooltip = document.getElementById('floatingAiTooltip');
  const badge = document.getElementById('floatingAiBadge');
  if (!windowEl) return;

  isFloatingAiOpen = !isFloatingAiOpen;
  if (isFloatingAiOpen) {
    windowEl.classList.remove('hidden');
    if (badge) badge.classList.add('hidden');
    // Mutual exclusion: close support contact window if open
    const supportWin = document.getElementById('supportContactWindow');
    if (supportWin && !supportWin.classList.contains('hidden')) {
      supportWin.classList.add('hidden');
    }
    
    // Focus input and scroll messages
    setTimeout(() => {
      const input = document.getElementById('floatingAiInput');
      if (input) input.focus();
      scrollFloatingAiMessagesToBottom();
    }, 100);
  } else {
    windowEl.classList.add('hidden');
  }
  refreshIcons();
}

function openFloatingAiChat() {
  const windowEl = document.getElementById('floatingAiChatWindow');
  if (!windowEl) return;
  isFloatingAiOpen = true;
  windowEl.classList.remove('hidden');
  const tooltip = document.getElementById('floatingAiTooltip');
  const badge = document.getElementById('floatingAiBadge');
  if (tooltip) tooltip.classList.add('hidden');
  if (badge) badge.classList.add('hidden');
  setTimeout(() => {
    const input = document.getElementById('floatingAiInput');
    if (input) input.focus();
    scrollFloatingAiMessagesToBottom();
  }, 100);
  refreshIcons();
}

function dismissFloatingAiTooltip(e) {
  if (e) e.stopPropagation();
  const tooltip = document.getElementById('floatingAiTooltip');
  if (tooltip) tooltip.classList.add('hidden');
}

function switchFloatingAiMode(mode) {
  floatingAiMode = mode;
  const modes = ['translate', 'chat', 'grammar'];
  modes.forEach(m => {
    const btn = document.getElementById(`btn-flmode-${m}`);
    if (!btn) return;
    if (m === mode) {
      btn.className = 'px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-2xs whitespace-nowrap flex items-center gap-1 cursor-pointer';
    } else {
      btn.className = 'px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-stone-700 border border-stone-200 whitespace-nowrap flex items-center gap-1 cursor-pointer';
    }
  });

  const input = document.getElementById('floatingAiInput');
  if (input) {
    if (mode === 'translate') {
      input.placeholder = 'Nhập câu tiếng Việt ➔ Dịch sang tiếng Trung (hoặc ngược lại)...';
    } else if (mode === 'chat') {
      input.placeholder = 'Nhập câu trò chuyện bằng tiếng Trung hoặc tiếng Việt...';
    } else if (mode === 'grammar') {
      input.placeholder = 'Dán câu tiếng Trung để AI bắt lỗi trật tự & ngữ pháp...';
    }
  }

  renderFloatingAiQuickChips();
}

function renderFloatingAiQuickChips() {
  const container = document.getElementById('floatingAiQuickChips');
  if (!container) return;

  let chips = [];
  if (floatingAiMode === 'translate') {
    chips = [
      'Dịch: Hôm nay bạn ăn cơm chưa?',
      'Dịch: Tôi muốn học tiếng Trung',
      'Dịch: Chiều mai bạn có rảnh không?',
      'Dịch: Táo này bao nhiêu tiền một cân?'
    ];
  } else if (floatingAiMode === 'chat') {
    chips = [
      '你好！你叫什么名字？',
      '今天北京天气怎么样？',
      '你觉得学习中文难吗？',
      '请推荐一道好吃的中国菜'
    ];
  } else if (floatingAiMode === 'grammar') {
    chips = [
      'Sửa lỗi: 我去超市买一本书',
      'Giải thích: Cách dùng câu chữ 把',
      'Phân biệt: 常常 vs 往往',
      'Sửa lỗi: 他跑得很更快'
    ];
  }

  container.innerHTML = `
    <span class="text-stone-400 font-bold shrink-0">Gợi ý:</span>
    ${chips.map(c => `
      <button 
        type="button"
        onclick="applyFloatingAiChip(${jsArg(c)})" 
        class="px-2.5 py-0.8 rounded-full bg-amber-50 hover:bg-amber-100 text-stone-700 border border-amber-200 text-2xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
      >
        ${escapeHtml(c)}
      </button>
    `).join('')}
  `;
}

function applyFloatingAiChip(chip) {
  const input = document.getElementById('floatingAiInput');
  if (input) {
    let cleanText = chip;
    if (chip.startsWith('Dịch: ')) cleanText = chip.replace('Dịch: ', '');
    else if (chip.startsWith('Sửa lỗi: ')) cleanText = chip.replace('Sửa lỗi: ', '');
    input.value = cleanText;
    sendFloatingAiMessage();
  }
}

function clearFloatingAiChat() {
  floatingAiMessages = [
    {
      sender: 'ai',
      hanzi: 'Đã làm mới cuộc hội thoại! Hãy hỏi mình bất kỳ điều gì nhé! 🤖',
      pinyin: '',
      vi: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
  renderFloatingAiMessages();
}

function scrollFloatingAiMessagesToBottom() {
  const container = document.getElementById('floatingAiMessages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function renderFloatingAiMessages() {
  const container = document.getElementById('floatingAiMessages');
  if (!container) return;

  container.innerHTML = floatingAiMessages.map(msg => {
    if (msg.sender === 'user') {
      return `
        <div class="flex items-start justify-end gap-2.5 max-w-[88%] ml-auto">
          <div class="p-3 rounded-2xl rounded-tr-xs bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-xs space-y-1">
            <p class="font-sans leading-relaxed text-xs break-words">${escapeHtml(msg.text || msg.hanzi)}</p>
            <span class="block text-[10px] text-amber-200/80 text-right font-mono">${escapeHtml(msg.timestamp)}</span>
          </div>
        </div>
      `;
    } else {
      // AI message with Robot 3D Avatar
      const hasChinese = msg.hanzi && /[\u4e00-\u9fa5]/.test(msg.hanzi);
      return `
        <div class="flex items-start gap-2.5 max-w-[92%]">
          <!-- 3D Mini Robot Avatar -->
          <div class="w-8 h-8 rounded-full overflow-hidden border border-amber-300 shadow-2xs shrink-0 bg-slate-900">
            <img 
              src="images/ai_robot_avatar.jpg" 
              onerror="this.src='images/robot_3d_avatar.svg'" 
              alt="Robot 3D" 
              class="w-full h-full object-cover" 
            />
          </div>

          <div class="p-3.5 rounded-2xl rounded-tl-xs bg-white border border-amber-200/90 shadow-2xs space-y-2 flex-1">
            <!-- Main Content -->
            <div>
              ${msg.hanzi ? `
                <div class="flex items-start justify-between gap-2">
                  <span class="font-hanzi text-base font-bold text-stone-900 leading-snug break-words">
                    ${escapeHtml(msg.hanzi)}
                  </span>
                  ${hasChinese ? `
                    <div class="inline-flex items-center gap-0.5 shrink-0 bg-stone-100/90 p-0.5 rounded-lg border border-stone-200">
                      <button 
                        type="button"
                        onclick="playChineseTTS(${jsArg(msg.hanzi)}, 'female')" 
                        title="Nghe giọng Nữ" 
                        class="p-1 rounded hover:bg-rose-50 text-rose-800 transition-colors cursor-pointer text-2xs font-bold"
                      >
                        👩
                      </button>
                      <button 
                        type="button"
                        onclick="playChineseTTS(${jsArg(msg.hanzi)}, 'male')" 
                        title="Nghe giọng Nam" 
                        class="p-1 rounded hover:bg-blue-50 text-blue-800 transition-colors cursor-pointer text-2xs font-bold"
                      >
                        👨
                      </button>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              ${msg.pinyin ? `
                <p class="text-2xs font-semibold text-[#8B1E1E] mt-0.5">${escapeHtml(msg.pinyin)}</p>
              ` : ''}

              ${msg.vi ? `
                <p class="text-xs text-stone-700 mt-1.5 pt-1.5 border-t border-amber-100 leading-relaxed">
                  <span class="font-bold text-[#8B1E1E]">Dịch nghĩa:</span> ${escapeHtml(msg.vi)}
                </p>
              ` : (msg.text ? `
                <p class="text-xs text-stone-700 leading-relaxed break-words">${escapeHtml(msg.text)}</p>
              ` : '')}
            </div>

            <!-- Vocabulary Breakdown (if available) -->
            ${msg.vocab && msg.vocab.length > 0 ? `
              <div class="pt-2 border-t border-amber-100 space-y-1">
                <span class="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                  <i data-lucide="sparkles" class="w-3 h-3 text-[#C59A3F]"></i>
                  <span>Từ vựng trọng tâm trong câu:</span>
                </span>
                <div class="flex flex-wrap gap-1 mt-1">
                  ${msg.vocab.map(v => `
                    <button 
                      type="button"
                      onclick="openWordModalWithToken(${jsArg(v.word || v.hanzi)}, ${jsArg(v.pinyin || '')}, ${jsArg(v.vi || '')})"
                      class="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-stone-800 border border-amber-200/80 text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <span class="font-hanzi font-bold text-[#8B1E1E]">${escapeHtml(v.word || v.hanzi)}</span>
                      <span class="text-stone-400">(${escapeHtml(v.pinyin)})</span>
                      <span class="text-stone-600">: ${escapeHtml(v.vi)}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Grammar Doctor Feedback (if available) -->
            ${msg.grammarTips ? `
              <div class="p-2 rounded-xl bg-teal-50/70 border border-teal-200 text-2xs text-teal-900 leading-relaxed space-y-1">
                <p class="font-bold flex items-center gap-1 text-teal-800">
                  <i data-lucide="stethoscope" class="w-3 h-3"></i>
                  <span>Bác Sĩ Ngữ Pháp Nhận Xét:</span>
                </p>
                <p>${escapeHtml(msg.grammarTips)}</p>
              </div>
            ` : ''}

            <span class="block text-[10px] text-stone-400 text-right font-mono">${escapeHtml(msg.timestamp)}</span>
          </div>
        </div>
      `;
    }
  }).join('');

  scrollFloatingAiMessagesToBottom();
  refreshIcons();
}

let floatingAiBusy = false;

function nowTimeLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function sendFloatingAiMessage() {
  const input = document.getElementById('floatingAiInput');
  if (!input || floatingAiBusy) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  floatingAiBusy = true;

  floatingAiMessages.push({ sender: 'user', text, timestamp: nowTimeLabel() });

  const loadingId = 'loading_' + Date.now();
  floatingAiMessages.push({
    id: loadingId,
    sender: 'ai',
    hanzi: '',
    text: '🤖 Robot AI đang dịch và phân tích ngữ pháp...',
    timestamp: nowTimeLabel()
  });
  renderFloatingAiMessages();

  let errorMessage = '';
  try {
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, mode: floatingAiMode })
    });
    const data = await res.json().catch(() => null);
    floatingAiMessages = floatingAiMessages.filter(m => m.id !== loadingId);

    if (res.ok && data && data.ok) {
      addExp(5, 'Trò chuyện cùng Trợ Lý Dịch AI');
      // Source Vietnamese -> translated is Chinese; source Chinese -> translated is Vietnamese.
      const source = data.sourceText || text;
      const replyHanzi = data.isChineseTarget ? data.translated : source;
      const replyVi = data.isChineseTarget ? source : data.translated;
      const grammarTips = (floatingAiMode === 'grammar' || /[把被比了]/.test(text))
        ? '• Điểm lưu ý: Câu có cấu trúc biểu đạt tự nhiên. Hãy chú ý trật tự từ và trợ từ để câu văn chuẩn văn phong bản ngữ nhất.'
        : '';

      floatingAiMessages.push({
        sender: 'ai',
        hanzi: replyHanzi,
        pinyin: data.pinyin || '',
        vi: replyVi,
        vocab: data.vocab || [],
        grammarTips,
        timestamp: nowTimeLabel()
      });
      renderFloatingAiMessages();

      // Read the answer aloud when it is Chinese.
      if (replyHanzi && /[一-龥]/.test(replyHanzi)) {
        playChineseTTS(replyHanzi);
      }
    } else {
      errorMessage = (data && data.error) || 'Robot AI gặp trục trặc khi dịch. Bạn thử lại nhé!';
    }
  } catch (err) {
    console.warn('AI chat request failed:', err);
    floatingAiMessages = floatingAiMessages.filter(m => m.id !== loadingId);
    errorMessage = 'Không thể kết nối máy chủ dịch thuật. Vui lòng kiểm tra mạng và thử lại.';
  } finally {
    floatingAiBusy = false;
  }

  if (errorMessage) {
    floatingAiMessages.push({ sender: 'ai', text: errorMessage, timestamp: nowTimeLabel() });
    renderFloatingAiMessages();
    showToast(errorMessage, 'error');
  }
}

function startFloatingAiSpeechInput() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    showToast('Trình duyệt không hỗ trợ nhận diện giọng nói!', 'warning');
    return;
  }

  const micBtn = document.getElementById('btn-flspeech-mic');
  if (micBtn) micBtn.classList.add('text-red-600', 'animate-pulse');

  const recognition = new SpeechRec();
  recognition.lang = 'zh-CN'; // Listen Chinese
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('floatingAiInput');
    if (input) {
      input.value = transcript;
      sendFloatingAiMessage();
    }
  };

  recognition.onerror = () => {
    if (micBtn) micBtn.classList.remove('text-red-600', 'animate-pulse');
  };

  recognition.onend = () => {
    if (micBtn) micBtn.classList.remove('text-red-600', 'animate-pulse');
  };

  recognition.start();
}
