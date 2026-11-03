// Module state
let activeAiScenario = null;
let aiChatHistory = [];

// ==========================================
// MODULE: TRỢ LÝ AI HỘI THOẠI & SỬA BÀI (AI TUTOR)
// ==========================================
function initAiChatModule() {
  renderAiScenarios();
  if (aiScenariosData && aiScenariosData.length > 0) {
    selectAiScenario(aiScenariosData[0].id);
  }
}

function renderAiScenarios() {
  const container = document.getElementById('aiScenariosContainer');
  if (!container || !aiScenariosData) return;

  container.innerHTML = aiScenariosData.map((sc, idx) => `
    <button 
      onclick="selectAiScenario(${jsArg(sc.id)})"
      id="btn-scenario-${escapeHtml(sc.id)}"
      class="w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
        activeAiScenario && activeAiScenario.id === sc.id
          ? 'bg-violet-50 border-violet-300 text-violet-900 shadow-2xs'
          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
      }">
      <div>
        <h4 class="text-xs font-bold">${escapeHtml(sc.title)}</h4>
        <p class="text-[10px] text-slate-400 mt-0.5">${escapeHtml(sc.role)}</p>
      </div>
      <span class="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-bold">${escapeHtml(sc.level)}</span>
    </button>
  `).join('');
}

function selectAiScenario(scenarioId) {
  const sc = (aiScenariosData || []).find(s => s.id === scenarioId);
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
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
            🤖
          </div>
          <div class="p-3.5 rounded-2xl rounded-tl-xs bg-white border border-violet-100 shadow-2xs space-y-1">
            <div class="flex items-center justify-between gap-3">
              <span class="font-hanzi text-base font-bold text-slate-900 leading-snug">${escapeHtml(msg.hanzi)}</span>
              <div class="inline-flex items-center gap-0.5 shrink-0">
                <button onclick="playChineseTTS(${jsArg(msg.hanzi)}, 'female')" title="Nghe giọng Nữ" class="p-1 rounded text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer">👩</button>
                <button onclick="playChineseTTS(${jsArg(msg.hanzi)}, 'male')" title="Nghe giọng Nam" class="p-1 rounded text-indigo-600 hover:bg-indigo-50 text-xs font-bold cursor-pointer">👨</button>
              </div>
            </div>
            ${msg.pinyin ? `<p class="text-xs text-violet-700 font-medium">${escapeHtml(msg.pinyin)}</p>` : ''}
            ${msg.vi ? `<p class="text-xs text-slate-500 pt-1 border-t border-slate-100">➔ ${escapeHtml(msg.vi)}</p>` : ''}
            <span class="block text-[10px] text-slate-400 text-right">${msg.timestamp}</span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="flex items-start justify-end gap-3 max-w-[85%] ml-auto">
          <div class="p-3.5 rounded-2xl rounded-tr-xs bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs space-y-1">
            <span class="font-hanzi text-base font-bold">${escapeHtml(msg.hanzi)}</span>
            ${msg.feedback ? `<p class="text-xs text-violet-200 border-t border-violet-500/40 pt-1 mt-1">💡 Nhận xét AI: ${escapeHtml(msg.feedback)}</p>` : ''}
            <span class="block text-[10px] text-violet-200 text-right">${msg.timestamp}</span>
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
    <span class="text-[11px] text-slate-400 font-semibold shrink-0">Gợi ý trả lời:</span>
    ${replies.map(r => `
      <button 
        onclick="applyAiSuggestedReply(${jsArg(r.hanzi)})"
        class="shrink-0 px-3 py-1 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 text-xs font-medium transition-all">
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

  // Add Exp
  addExp(5, 'Đối thoại với AI');

  // Simulate intelligent contextual AI reply
  setTimeout(() => {
    let replyHanzi = '你的中文说得很好！继续加油！';
    let replyPinyin = 'Nǐ de zhōngwén shuō de hěn hǎo! Jìxù jiāyóu!';
    let replyVi = 'Tiếng Trung của bạn nói rất hay! Cố gắng tiếp tục nhé!';

    if (activeAiScenario && activeAiScenario.id === 'scenario_greeting') {
      replyHanzi = '认识你真是太好了！你平时喜欢学习中文吗？';
      replyPinyin = 'Rènshi nǐ zhēn shì tài hǎo le! Nǐ píngshí xǐhuan xuéxí zhōngwén ma?';
      replyVi = 'Rất vui được quen bạn! Bình thường bạn có thích học tiếng Trung không?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_restaurant') {
      replyHanzi = '好的！一份宫保鸡丁，两碗米饭，还要别的喝的吗？比如青岛啤酒或茉莉花茶？';
      replyPinyin = 'Hǎo de! Yí fèn Gōngbǎo Jīdīng, liǎng wǎn mǐfàn, hái yào bié de hē de ma? Bǐrú Qīngdǎo píjiǔ huò mòlìhuā chá?';
      replyVi = 'Vâng ạ! Một phần gà Cung Bảo, 2 bát cơm, quý khách có muốn dùng thêm đồ uống gì như bia Thanh Đảo hay trà hoa nhài không?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_shopping') {
      replyHanzi = '哎呀，帅哥/美女真会砍价！看在是老朋友的份上，120块钱拿走，怎么样？';
      replyPinyin = 'Āiyā, shuàigē/měinǚ zhēn huì kǎnjià! Kàn zài shì lǎo péngyou de fèn shang, 120 kuài qián ná zǒu, zěnmeyàng?';
      replyVi = 'Ái chà, bạn mặc cả giỏi quá! Nể tình khách quen, 120 tệ bạn mang về, thấy thế nào?';
    } else if (activeAiScenario && activeAiScenario.id === 'scenario_interview') {
      replyHanzi = '很好。你的背景非常符合我们的要求。请问如果遇到工作压力，你通常如何解决？';
      replyPinyin = 'Hěn hǎo. Nǐ de bèijǐng fēicháng fúhé wǒmen de yāoqiú. Qǐngwèn rúguǒ yùdào gōngzuò yālì, nǐ tōngcháng rúhé jiějué?';
      replyVi = 'Rất tốt. Nền tảng của bạn rất phù hợp với yêu cầu của chúng tôi. Xin hỏi nếu gặp áp lực công việc, bạn thường giải quyết thế nào?';
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
  }, 800);
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
    <p class="font-hanzi font-bold text-slate-900 mt-1">Câu gốc: ${escapeHtml(text)}</p>
    <div class="space-y-1 pt-2 border-t border-teal-100">
      <p class="text-teal-900 font-semibold">🔍 Phân tích trật tự câu:</p>
      <p class="text-slate-600">Cấu trúc câu hợp lý theo chuẩn: Chủ ngữ + Động từ + Tân ngữ.</p>
      <p class="text-teal-900 font-semibold mt-1">💡 Đề xuất cách diễn đạt tự nhiên hơn:</p>
      <p class="text-emerald-700 font-hanzi font-bold">👉 "${escapeHtml(text.replace('买一本', '去买一本'))}"</p>
      <p class="text-[11px] text-slate-500 italic">Mẹo: Trong khẩu ngữ hàng ngày, người Trung Quốc thường kết hợp trợ từ "了" hoặc phó từ chỉ thời gian để câu nói sinh động hơn.</p>
    </div>
  `;
  addExp(5, 'Sử dụng Bác Sĩ Ngữ Pháp');
  refreshIcons();
}
