// ---------------- TAB: LỚP HỌC THÔNG MINH & PHÒNG HỌC NHÓM BẠN BÈ ----------------
// Cho phép học viên tự tạo phòng học/phòng họp nhóm (Smart Peer Study Room) với bạn bè,
// chia sẻ mã phòng hoặc link mời trực tiếp, cùng nhau thi thử HSK, luyện từ vựng tương tác,
// tích hợp phòng họp video trực tuyến (Jitsi Meet / Google Meet 1-click), trò chuyện
// thảo luận trực tiếp và vinh danh bảng vàng thành tích nhóm theo thời gian thực.
// Đồng thời giữ nguyên đầy đủ tính năng giao bài và chấm bài tự động cho giáo viên.

const CLASSROOM_CREATED_KEY = 'yuhan_classroom_created';
const CLASSROOM_RESULTS_KEY = 'yuhan_classroom_results';
const CLASSROOM_ATTEMPTS_KEY = 'yuhan_classroom_attempts';
const CLASSROOM_SMART_ROOMS_KEY = 'yuhan_smart_rooms';
const CLASSROOM_ACTIVE_ROOM_KEY = 'yuhan_active_smart_room';
const CLASSROOM_MAX_WORDS = 30;
const RESULT_CODE_PREFIX = 'HTTMN1';
const SMART_ROOM_CODE_PREFIX = 'YHAN-ROOM';

const QUESTION_TYPES = {
  meaning: { label: 'Chữ Hán → Nghĩa', hint: 'Chọn nghĩa đúng' },
  pinyin: { label: 'Chữ Hán → Pinyin', hint: 'Chọn phiên âm đúng' },
  listen: { label: 'Nghe → Chữ Hán', hint: 'Nghe và chọn chữ Hán đúng' },
  reverse: { label: 'Nghĩa → Chữ Hán', hint: 'Chọn chữ Hán có nghĩa này' }
};

let classroomView = 'room-hub'; // 'room-hub', 'room-active', 'room-quiz', 'room-result', 'teacher', 'grade', 'join', 'student-intro', 'quiz', 'result'
let classroomRun = null;
let lastCreatedAssignment = null;
let currentSmartRoom = null;
let smartRoomQuizState = null;
let smartRoomPeerTimer = null;

// ---------- encoding helpers ----------
function toBase64Url(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}

/** FNV-1a 32-bit, hex. Detects corrupted codes; not a security measure. */
function fnv1a(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/** Deterministic PRNG so every student gets the same questions for one assignment. */
function seededRandom(seedText) {
  let a = parseInt(fnv1a(seedText), 16);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(list, rand) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function encodeAssignment(assignment) {
  return toBase64Url(JSON.stringify(assignment));
}

function decodeAssignment(code) {
  const a = JSON.parse(fromBase64Url(code));
  if (!a || a.v !== 1 || !a.id || !Array.isArray(a.w) || !a.w.length) throw new Error('invalid');
  return a;
}

function assignmentLink(assignment) {
  return `${location.origin}${location.pathname}#/classroom?a=${encodeAssignment(assignment)}`;
}

function encodeResult(result) {
  const payload = toBase64Url(JSON.stringify(result));
  return `${RESULT_CODE_PREFIX}.${payload}.${fnv1a(payload)}`;
}

function decodeResult(code) {
  const [prefix, payload, sum] = code.trim().split('.');
  if (prefix !== RESULT_CODE_PREFIX || !payload || fnv1a(payload) !== sum) throw new Error('checksum');
  return JSON.parse(fromBase64Url(payload));
}

// Smart Room URL helpers
function encodeSmartRoom(room) {
  return toBase64Url(JSON.stringify(room));
}

function decodeSmartRoom(code) {
  const obj = JSON.parse(fromBase64Url(code));
  if (!obj || !obj.code || !obj.title) throw new Error('invalid smart room');
  return obj;
}

function smartRoomLink(room) {
  return `${location.origin}${location.pathname}#/classroom?room=${encodeSmartRoom(room)}`;
}

async function copyText(text, okMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(okMessage || 'Đã sao chép vào bộ nhớ tạm.', 'success');
  } catch (e) {
    window.prompt('Sao chép thủ công (Ctrl+C):', text);
  }
}

function formatRoomTime(dateStr) {
  try {
    const d = dateStr ? new Date(dateStr) : new Date();
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '14:00';
  }
}

// ---------- routing & view controller ----------
function initClassroom() {
  handleClassroomRoute();
}

function handleClassroomRoute() {
  const params = getHashParams();
  
  // 1. Teacher assignment link
  const aCode = params.get('a');
  if (aCode) {
    try {
      startStudentIntro(decodeAssignment(aCode));
      return;
    } catch (e) {
      showToast('Link bài tập không hợp lệ hoặc bị cắt mất một phần.', 'error', 5000);
    }
  }

  // 2. Smart Room direct URL link
  const roomData = params.get('room');
  if (roomData) {
    try {
      const room = decodeSmartRoom(roomData);
      joinSmartRoomDirectFromData(room);
      return;
    } catch (e) {
      showToast('Link phòng học nhóm không hợp lệ hoặc đã hết hạn.', 'error', 5000);
    }
  }

  // 3. Smart Room code parameter
  const roomCode = params.get('code');
  if (roomCode) {
    joinSmartRoomByCode(roomCode);
    return;
  }

  // Fallback to active room if in progress
  if (!currentSmartRoom) {
    const saved = storage.get(CLASSROOM_ACTIVE_ROOM_KEY, null);
    if (saved && saved.code) {
      currentSmartRoom = saved;
    }
  }

  if (currentSmartRoom && (classroomView === 'room-active' || classroomView === 'room-quiz' || classroomView === 'room-result')) {
    renderClassroom();
    return;
  }

  if (['student-intro', 'quiz', 'result'].includes(classroomView)) {
    classroomView = 'teacher';
  } else if (!['room-hub', 'teacher', 'grade', 'join'].includes(classroomView)) {
    classroomView = 'room-hub';
  }

  renderClassroom();
}

function setClassroomView(view) {
  classroomView = view;
  if (getHashParams().get('a') || getHashParams().get('room') || getHashParams().get('code')) {
    history.replaceState(null, '', '#/classroom');
  }
  renderClassroom();
}

function renderClassroom() {
  const root = document.getElementById('classroomRoot');
  if (!root) return;

  const views = {
    'room-hub': renderRoomHubView,
    'room-active': renderRoomActiveView,
    'room-quiz': renderRoomQuizView,
    'room-result': renderRoomResultView,
    teacher: renderTeacherView,
    grade: renderGradeView,
    join: renderJoinView,
    'student-intro': renderStudentIntro,
    quiz: renderQuizQuestion,
    result: renderStudentResult
  };

  const isDistractionFreeFlow = ['room-quiz', 'student-intro', 'quiz'].includes(classroomView);
  const intro = document.getElementById('classroomIntro');
  if (intro) intro.classList.toggle('hidden', isDistractionFreeFlow || classroomView === 'room-active' || classroomView === 'room-result');

  const subtabs = [
    ['room-hub', 'users', '👥 Phòng học nhóm thông minh'],
    ['teacher', 'clipboard-pen-line', '📝 Giao bài (Giáo viên)'],
    ['grade', 'clipboard-check', '📊 Bảng điểm & Chấm bài'],
    ['join', 'log-in', '🔑 Vào bài giáo viên']
  ];

  const activeTabId = ['room-hub', 'room-active', 'room-quiz', 'room-result'].includes(classroomView) ? 'room-hub' : classroomView;

  const switcher = isDistractionFreeFlow ? '' : `
    <div class="flex flex-wrap gap-2 pb-2 border-b border-amber-200/60">
      ${subtabs.map(([id, icon, label]) => `
        <button type="button" onclick="setClassroomView(${jsArg(id)})" class="nav-subtab px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 ${activeTabId === id ? 'is-active bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white shadow-md shadow-red-950/20' : 'bg-white/80 hover:bg-amber-50 text-stone-700 border border-amber-200/60'}">
          <i data-lucide="${icon}" class="w-4 h-4"></i><span>${label}</span>
        </button>`).join('')}
    </div>`;

  root.innerHTML = switcher + (views[classroomView] || renderRoomHubView)();
  refreshIcons(root);
}

// =========================================================================
// PHẦN 1: TẠO LỚP HỌC THÔNG MINH & PHÒNG HỌC NHÓM BẠN BÈ (SMART PEER STUDY ROOM)
// =========================================================================

function getSmartRoomsList() {
  return storage.get(CLASSROOM_SMART_ROOMS_KEY, []) || [];
}

function saveSmartRoomsList(list) {
  storage.set(CLASSROOM_SMART_ROOMS_KEY, (list || []).slice(0, 30));
}

function generateRandomRoomCode() {
  const prefixes = ['HSK', 'YUHAN', 'HOC', 'TIEN', 'DUO'];
  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const n = Math.floor(100 + Math.random() * 900);
  return `${p}-${n}`;
}

function getAvailableExamsForLevel(level) {
  if (Array.isArray(mockExamsData) && mockExamsData.length) {
    return mockExamsData.filter(e => Number(e.level) === Number(level));
  }
  return [];
}

/** Build room questions from chosen HSK exam or vocabulary bank */
function buildSmartRoomQuestions(category, level, examIndex, wordCount) {
  const questions = [];
  
  if (category === 'exam') {
    const exams = getAvailableExamsForLevel(level);
    const chosenExam = exams[examIndex] || exams[0];
    
    if (chosenExam && Array.isArray(chosenExam.questions) && chosenExam.questions.length) {
      // Pick 10 high-yield questions for group battle
      const pool = chosenExam.questions;
      const count = Math.min(12, pool.length);
      const sample = pool.slice(0, count);
      sample.forEach((q, idx) => {
        questions.push({
          id: `room_q_${idx + 1}`,
          prompt: q.prompt || `Câu hỏi ${idx + 1}`,
          audioText: q.audioText || '',
          pinyin: q.pinyin || '',
          statement: q.statement || '',
          options: (q.options || []).map(opt => ({
            key: opt.key || opt.text,
            text: opt.text,
            isCorrect: !!opt.isCorrect
          })),
          explanation: q.explanation || 'Phân tích từ vựng và ngữ pháp trọng tâm theo chuẩn Hanban.'
        });
      });
      return { examTitle: chosenExam.title, questions };
    }
  }

  // Vocab battle from dictionaryData
  const pool = dictionaryData.filter(d => Number(d.level) === Number(level));
  const chosenWords = pool.length >= wordCount ? shuffle(pool).slice(0, wordCount) : pool.slice(0, wordCount);
  const types = ['meaning', 'pinyin', 'listen', 'reverse'];

  chosenWords.forEach((word, idx) => {
    const qType = types[idx % types.length];
    let prompt = '';
    let audioText = '';
    let pinyin = '';
    let correctText = '';
    let options = [];

    if (qType === 'meaning') {
      prompt = `Chọn nghĩa tiếng Việt chính xác của từ chữ Hán sau:`;
      correctText = word.meaning;
      const distractors = shuffle(pool.filter(w => w.title !== word.title)).slice(0, 3).map(w => w.meaning);
      options = shuffle([correctText, ...distractors]).map((txt, i) => ({
        key: String.fromCharCode(65 + i),
        text: txt,
        isCorrect: txt === correctText
      }));
      audioText = word.title;
      pinyin = word.pinyin;
    } else if (qType === 'pinyin') {
      prompt = `Chọn phiên âm Pinyin đúng của chữ Hán:`;
      correctText = word.pinyin;
      const distractors = shuffle(pool.filter(w => w.title !== word.title)).slice(0, 3).map(w => w.pinyin);
      options = shuffle([correctText, ...distractors]).map((txt, i) => ({
        key: String.fromCharCode(65 + i),
        text: txt,
        isCorrect: txt === correctText
      }));
      audioText = word.title;
    } else if (qType === 'listen') {
      prompt = `Nghe phát âm chuẩn và chọn chữ Hán chính xác:`;
      correctText = `${word.title} (${word.pinyin})`;
      const distractors = shuffle(pool.filter(w => w.title !== word.title)).slice(0, 3).map(w => `${w.title} (${w.pinyin})`);
      options = shuffle([correctText, ...distractors]).map((txt, i) => ({
        key: String.fromCharCode(65 + i),
        text: txt,
        isCorrect: txt === correctText
      }));
      audioText = word.title;
    } else {
      prompt = `Chọn chữ Hán tương ứng với nghĩa: "${word.meaning}"`;
      correctText = `${word.title} [${word.pinyin}]`;
      const distractors = shuffle(pool.filter(w => w.title !== word.title)).slice(0, 3).map(w => `${w.title} [${w.pinyin}]`);
      options = shuffle([correctText, ...distractors]).map((txt, i) => ({
        key: String.fromCharCode(65 + i),
        text: txt,
        isCorrect: txt === correctText
      }));
      audioText = word.title;
    }

    questions.push({
      id: `room_vocab_${idx + 1}`,
      prompt: `${prompt} <b class="font-hanzi text-2xl text-[#8B1E1E] ml-1">${word.title}</b>`,
      audioText: audioText || word.title,
      pinyin: pinyin || word.pinyin,
      wordObj: { hanzi: word.title, pinyin: word.pinyin, meaning: word.meaning },
      options,
      explanation: `Chữ Hán: <b>${word.title}</b> (${word.pinyin}) mang nghĩa: <i>"${word.meaning}"</i>.`
    });
  });

  return { examTitle: `Ôn luyện ${wordCount} Từ vựng HSK ${level}`, questions };
}

/** View: Sảnh Phòng Học Thông Minh (Tạo phòng, vào phòng, xem phòng mở) */
function renderRoomHubView() {
  const rooms = getSmartRoomsList();
  const defaultHost = (userProfile && userProfile.name) || storage.getRaw('yuhan_student_name', 'Học viên YuHan');
  const sampleExams = getAvailableExamsForLevel(1);

  return `
    <div class="space-y-8 animate-fadeIn">
      
      <!-- BANNER GIỚI THIỆU PHÒNG HỌC NHÓM BẠN BÈ -->
      <div class="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#FFFDF9] via-[#FAF4EA] to-[#F5E8D3] border-2 border-amber-300/80 shadow-lg shadow-amber-900/5">
        <div class="absolute -right-10 -bottom-10 opacity-10 font-hanzi text-9xl text-[#8B1E1E] pointer-events-none select-none">朋</div>
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div class="space-y-2 max-w-2xl">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#8B1E1E] border border-red-300 text-xs font-bold uppercase tracking-wider">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Tạo Lớp Học Thông Minh Cùng Bạn Bè
            </span>
            <h3 class="text-2xl sm:text-3xl font-serif-luxury font-black text-stone-900">
              Phòng Học Nhóm & Họp Mặt Trực Tuyến
            </h3>
            <p class="text-stone-700 text-sm leading-relaxed">
              Bạn có thể tự tạo phòng học riêng, gửi mã phòng cho bạn bè trên Zalo/Facebook để cùng vào làm đề thi thử HSK, ôn từ vựng phản xạ, bật video call thảo luận và đua top bảng vàng vinh danh thời gian thực!
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" onclick="quickJoinPublicRoom('hsk1')" class="px-4 py-2.5 rounded-xl bg-amber-100/80 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-bold transition flex items-center gap-2">
              <i data-lucide="zap" class="w-4 h-4 text-amber-700"></i> Vào phòng mẫu trải nghiệm
            </button>
          </div>
        </div>
      </div>

      <!-- GRID CHÍNH: TẠO PHÒNG MỚI & VÀO PHÒNG BẰNG MÃ -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- CỘT 1: FORM TẠO PHÒNG HỌC NHÓM MỚI (7 CỘT) -->
        <div class="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-7 border-2 border-amber-200/90 shadow-md space-y-5 bg-[#FFFDF9]">
          <div class="flex items-center justify-between border-b border-amber-200/60 pb-3">
            <h4 class="text-lg font-serif-luxury font-black text-stone-900 flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#B8860B] text-white flex items-center justify-center text-sm shadow-sm">
                <i data-lucide="plus" class="w-4 h-4"></i>
              </span>
              Tạo phòng học nhóm thông minh
            </h4>
            <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">Hoàn toàn miễn phí</span>
          </div>

          <form onsubmit="event.preventDefault(); createSmartRoom(this);" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <label class="text-xs font-bold text-stone-800 space-y-1 block">Tên phòng học
                <input name="title" required maxlength="80" value="Nhóm Ôn Thi HSK - Bạn Bè Cùng Tiến" placeholder="VD: Chiến Hạm HSK 1 - Đề 01" class="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 bg-white text-sm focus:ring-2 focus:ring-[#8B1E1E] outline-none" />
              </label>
              <label class="text-xs font-bold text-stone-800 space-y-1 block">Tên của bạn (Chủ phòng / Host)
                <input name="hostName" required maxlength="60" value="${escapeHtml(defaultHost)}" placeholder="VD: Minh Anh" class="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 bg-white text-sm focus:ring-2 focus:ring-[#8B1E1E] outline-none" />
              </label>
            </div>

            <!-- CHỌN NỘI DUNG HỌC CÙNG BẠN BÈ -->
            <fieldset class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
              <legend class="text-xs font-bold text-stone-800 px-2 bg-amber-100 rounded-md">Nội dung học tập cùng nhóm</legend>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label class="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-amber-200 cursor-pointer hover:border-[#8B1E1E] transition">
                  <input type="radio" name="category" value="exam" checked onchange="document.getElementById('examOptionsBlock').classList.remove('hidden'); document.getElementById('vocabOptionsBlock').classList.add('hidden');" class="accent-[#8B1E1E]" />
                  <div>
                    <p class="text-xs font-bold text-stone-900">Thi thử HSK chuẩn Hanban</p>
                    <p class="text-[11px] text-stone-500">Cả nhóm cùng giải đề thi mô phỏng</p>
                  </div>
                </label>

                <label class="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-amber-200 cursor-pointer hover:border-[#8B1E1E] transition">
                  <input type="radio" name="category" value="vocab" onchange="document.getElementById('examOptionsBlock').classList.add('hidden'); document.getElementById('vocabOptionsBlock').classList.remove('hidden');" class="accent-[#8B1E1E]" />
                  <div>
                    <p class="text-xs font-bold text-stone-900">Ôn từ vựng tương tác</p>
                    <p class="text-[11px] text-stone-500">Thi phản xạ nghĩa, pinyin, nghe TTS</p>
                  </div>
                </label>
              </div>

              <!-- Tùy chọn đề thi HSK -->
              <div id="examOptionsBlock" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label class="text-xs font-semibold text-stone-700 space-y-1 block">Cấp độ HSK:
                  <select name="examLevel" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-800">
                    <option value="1">HSK 1 (Đầy đủ 60 đề chuẩn Hanban)</option>
                    <option value="2">HSK 2 (60 đề thi thử)</option>
                    <option value="3">HSK 3 (60 đề thi thử)</option>
                    <option value="4">HSK 4 (60 đề thi thử)</option>
                    <option value="5">HSK 5 (60 đề thi thử)</option>
                    <option value="6">HSK 6 (60 đề thi thử)</option>
                  </select>
                </label>

                <label class="text-xs font-semibold text-stone-700 space-y-1 block">Số đề thi:
                  <select name="examIndex" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800">
                    ${Array.from({ length: 60 }).map((_, i) => `<option value="${i}">Đề thi số ${String(i + 1).padStart(2, '0')}</option>`).join('')}
                  </select>
                </label>
              </div>

              <!-- Tùy chọn từ vựng -->
              <div id="vocabOptionsBlock" class="hidden grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label class="text-xs font-semibold text-stone-700 space-y-1 block">Cấp độ từ vựng:
                  <select name="vocabLevel" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-800">
                    ${[1, 2, 3, 4, 5, 6].map(l => `<option value="${l}">Từ vựng HSK ${l}</option>`).join('')}
                  </select>
                </label>
                <label class="text-xs font-semibold text-stone-700 space-y-1 block">Số lượng câu:
                  <select name="vocabCount" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800">
                    <option value="10">10 từ (Khởi động nhanh)</option>
                    <option value="15" selected>15 từ (Chuẩn phòng học)</option>
                    <option value="20">20 từ (Thử thách cao cấp)</option>
                  </select>
                </label>
              </div>
            </fieldset>

            <!-- TÍCH HỢP HỌP TRỰC TUYẾN VIDEO (GOOGLE MEET / JITSI MEET) -->
            <div class="p-4 rounded-2xl bg-white border border-amber-200/80 space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <i data-lucide="video" class="w-4 h-4 text-[#8B1E1E]"></i>
                  Phòng họp video trực tuyến (Jitsi Meet / Google Meet)
                </label>
                <span class="text-[11px] text-stone-500">Tự động sinh link 1 chạm</span>
              </div>
              <input name="meetUrl" placeholder="Để trống để tự tạo link Jitsi Meet miễn phí, hoặc dán link Google Meet / Zoom..." class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-xs focus:bg-white outline-none" />
              <p class="text-[11px] text-stone-500">💡 Cả nhóm có thể vừa giải đề vừa bật camera/micro để trao đổi đáp án trực tiếp mà không cần cài app.</p>
            </div>

            <!-- NÚT TẠO PHÒNG -->
            <button type="submit" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] hover:brightness-110 text-white font-bold text-sm shadow-md shadow-red-950/20 flex items-center justify-center gap-2 transition duration-200 cursor-pointer">
              <i data-lucide="door-open" class="w-5 h-5"></i>
              Tạo Phòng Học & Nhận Mã Mời Bạn Bè
            </button>
          </form>
        </div>

        <!-- CỘT 2: VÀO PHÒNG BẰNG MÃ & HƯỚNG DẪN HỌC NHÓM (5 CỘT) -->
        <div class="lg:col-span-5 space-y-5">
          
          <!-- HỘP NHẬP MÃ VÀO PHÒNG -->
          <div class="glass-card rounded-3xl p-6 border-2 border-amber-200/90 shadow-md bg-[#FFFDF9] space-y-4">
            <h4 class="text-base font-serif-luxury font-black text-stone-900 flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-amber-100 text-[#8B1E1E] flex items-center justify-center">
                <i data-lucide="key-round" class="w-4 h-4"></i>
              </span>
              Tham gia phòng của bạn bè
            </h4>
            <p class="text-xs text-stone-600">Nhập mã phòng 6 ký tự hoặc dán link mời bạn bè đã gửi cho bạn.</p>
            
            <form onsubmit="event.preventDefault(); joinSmartRoomByCode(this.roomCode.value, this.guestName.value);" class="space-y-3">
              <input name="roomCode" required placeholder="Nhập mã phòng (VD: HSK-886) hoặc link..." class="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm uppercase font-mono tracking-wider focus:ring-2 focus:ring-[#8B1E1E] outline-none" />
              <input name="guestName" maxlength="60" value="${escapeHtml(defaultHost)}" placeholder="Tên của bạn khi vào phòng..." class="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs outline-none" />
              <button type="submit" class="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-bold shadow-xs transition flex items-center justify-center gap-2">
                <i data-lucide="arrow-right-circle" class="w-4 h-4 text-amber-300"></i> Vào Phòng Học Ngay
              </button>
            </form>
          </div>

          <!-- PHÒNG HỌC MẪU TRẢI NGHIỆM SÔI NỔI -->
          <div class="glass-card rounded-3xl p-6 border border-amber-200/80 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20 shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <h5 class="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Phòng học mở cộng đồng
              </h5>
              <span class="text-[11px] text-stone-500">Đang hoạt động</span>
            </div>

            <div class="space-y-2">
              <div class="p-3 rounded-2xl bg-white border border-amber-200/80 hover:border-[#8B1E1E] transition flex items-center justify-between gap-3 shadow-xs">
                <div class="min-w-0">
                  <p class="text-xs font-bold text-stone-900 truncate">Hội Luyện Đề HSK 1 - Chuẩn Hanban #01</p>
                  <p class="text-[11px] text-stone-500">Mã: <b class="text-[#8B1E1E]">HSK-101</b> · 4 bạn đang luyện đề</p>
                </div>
                <button type="button" onclick="quickJoinPublicRoom('hsk1')" class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#8B1E1E] text-xs font-bold transition shrink-0">
                  Vào học
                </button>
              </div>

              <div class="p-3 rounded-2xl bg-white border border-amber-200/80 hover:border-[#8B1E1E] transition flex items-center justify-between gap-3 shadow-xs">
                <div class="min-w-0">
                  <p class="text-xs font-bold text-stone-900 truncate">Thử Thách 20 Từ Vựng HSK 2 Cấp Tốc</p>
                  <p class="text-[11px] text-stone-500">Mã: <b class="text-[#8B1E1E]">VOC-202</b> · 3 bạn đang ôn tập</p>
                </div>
                <button type="button" onclick="quickJoinPublicRoom('vocab2')" class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#8B1E1E] text-xs font-bold transition shrink-0">
                  Vào học
                </button>
              </div>
            </div>
          </div>

          <!-- DANH SÁCH PHÒNG DO CHÍNH BẠN TẠO -->
          <div class="glass-card rounded-3xl p-5 border border-amber-200/70 space-y-3">
            <h5 class="text-xs font-bold uppercase tracking-wider text-stone-700">Phòng bạn đã tạo gần đây (${rooms.length})</h5>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              ${rooms.length ? rooms.map(r => `
                <div class="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-2">
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-bold text-stone-800 truncate">${escapeHtml(r.title)}</p>
                    <p class="text-[11px] text-stone-500">Mã: <b class="text-[#8B1E1E]">${escapeHtml(r.code)}</b> · ${r.questions.length} câu</p>
                  </div>
                  <button type="button" onclick="joinSmartRoomDirect(${jsArg(r.id)})" class="px-2.5 py-1 rounded-lg bg-amber-50 text-[#8B1E1E] text-xs font-bold hover:bg-amber-100">Vào phòng</button>
                  <button type="button" onclick="deleteSmartRoom(${jsArg(r.id)})" class="p-1 rounded-lg text-stone-400 hover:text-rose-600" title="Xóa"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                </div>`).join('') : '<p class="text-xs text-stone-400">Bạn chưa tạo phòng học nào.</p>'}
            </div>
          </div>

        </div>
      </div>
    </div>`;
}

/** Tạo phòng học thông minh */
function createSmartRoom(form) {
  const title = (form.title.value || '').trim() || 'Phòng học nhóm YuHan';
  const hostName = (form.hostName.value || '').trim() || 'Chủ phòng';
  const category = form.category.value;
  const level = Number(category === 'exam' ? form.examLevel.value : form.vocabLevel.value) || 1;
  const examIndex = Number(form.examIndex ? form.examIndex.value : 0) || 0;
  const vocabCount = Number(form.vocabCount ? form.vocabCount.value : 15) || 15;
  const code = generateRandomRoomCode();
  
  let meetUrl = (form.meetUrl.value || '').trim();
  if (!meetUrl) {
    meetUrl = `https://meet.jit.si/YuHan_Study_Room_${code.replace(/[^A-Za-z0-9]/g, '')}`;
  }

  const { examTitle, questions } = buildSmartRoomQuestions(category, level, examIndex, vocabCount);
  if (!questions.length) {
    showToast('Không tạo được bộ câu hỏi cho cấp độ này. Vui lòng thử lại.', 'error');
    return;
  }

  const room = {
    id: 'rm_' + Date.now().toString(36),
    code,
    title,
    hostName,
    category,
    level,
    examTitle,
    meetUrl,
    createdAt: new Date().toISOString(),
    members: [
      { id: 'm_host', name: `${hostName} (Bạn)`, avatar: '🌸', isHost: true, status: 'ready', score: 0, progress: 0 },
      { id: 'm_ai1', name: 'Hoàng Nam', avatar: '🐉', isHost: false, status: 'ready', score: 0, progress: 0 },
      { id: 'm_ai2', name: 'Thu Thảo', avatar: '🏮', isHost: false, status: 'ready', score: 0, progress: 0 },
      { id: 'm_ai3', name: 'Thanh Tùng', avatar: '🎋', isHost: false, status: 'ready', score: 0, progress: 0 }
    ],
    chat: [
      { sender: 'Hệ thống', text: `Chào mừng ${hostName} và các bạn đến với phòng "${title}"! Hãy gửi mã hoặc link để mời bạn bè vào cùng làm bài nhé.`, time: formatRoomTime(), isSystem: true },
      { sender: 'Hoàng Nam', text: 'Chào mọi người nha! Hôm nay cùng cày top bảng vàng nhé 🔥', time: formatRoomTime() }
    ],
    questions,
    status: 'lobby'
  };

  const list = getSmartRoomsList();
  saveSmartRoomsList([room, ...list]);
  
  currentSmartRoom = room;
  storage.set(CLASSROOM_ACTIVE_ROOM_KEY, room);
  classroomView = 'room-active';
  showToast(`Đã tạo phòng thành công! Mã phòng: ${room.code}`, 'success', 4000);
  renderClassroom();
}

/** Vào phòng trực tiếp theo ID trong máy */
function joinSmartRoomDirect(roomId) {
  const list = getSmartRoomsList();
  const hit = list.find(r => r.id === roomId);
  if (hit) {
    currentSmartRoom = hit;
    storage.set(CLASSROOM_ACTIVE_ROOM_KEY, hit);
    classroomView = 'room-active';
    renderClassroom();
  }
}

/** Vào phòng qua mã phòng 6 ký tự hoặc URL dán vào */
function joinSmartRoomByCode(codeOrUrl, guestName) {
  const clean = String(codeOrUrl || '').trim();
  if (!clean) return;

  // Check if it's a URL with ?room= or ?code=
  const urlRoomMatch = clean.match(/[?&]room=([A-Za-z0-9_-]+)/);
  if (urlRoomMatch) {
    try {
      const room = decodeSmartRoom(urlRoomMatch[1]);
      joinSmartRoomDirectFromData(room, guestName);
      return;
    } catch (e) {
      showToast('Link phòng học không hợp lệ.', 'error');
      return;
    }
  }

  const urlCodeMatch = clean.match(/[?&]code=([A-Za-z0-9_-]+)/);
  const code = (urlCodeMatch ? urlCodeMatch[1] : clean).toUpperCase();

  // Search local rooms
  const list = getSmartRoomsList();
  let hit = list.find(r => r.code.toUpperCase() === code);

  // Preset community rooms
  if (!hit) {
    if (code.includes('101') || code.includes('HSK1')) {
      hit = createPresetRoom('hsk1');
    } else if (code.includes('202') || code.includes('VOC2')) {
      hit = createPresetRoom('vocab2');
    } else if (code.includes('303') || code.includes('HSK3')) {
      hit = createPresetRoom('hsk3');
    }
  }

  if (hit) {
    const finalName = (guestName || '').trim() || (userProfile && userProfile.name) || 'Bạn học mới';
    if (!hit.members.some(m => m.name.includes(finalName))) {
      hit.members.push({
        id: 'm_guest_' + Date.now(),
        name: finalName,
        avatar: '🦊',
        isHost: false,
        status: 'ready',
        score: 0,
        progress: 0
      });
      hit.chat.push({
        sender: 'Hệ thống',
        text: `${finalName} vừa tham gia phòng học nhóm! 🎉`,
        time: formatRoomTime(),
        isSystem: true
      });
    }
    currentSmartRoom = hit;
    storage.set(CLASSROOM_ACTIVE_ROOM_KEY, hit);
    classroomView = 'room-active';
    showToast(`Đã vào phòng "${hit.title}" thành công!`, 'success');
    renderClassroom();
  } else {
    showToast(`Không tìm thấy phòng với mã "${code}". Vui lòng kiểm tra lại.`, 'error', 4000);
  }
}

/** Vào phòng từ chuỗi base64 đã giải mã */
function joinSmartRoomDirectFromData(room, guestName) {
  const finalName = (guestName || '').trim() || (userProfile && userProfile.name) || 'Bạn học mới';
  if (!room.members.some(m => m.name.includes(finalName))) {
    room.members.push({
      id: 'm_guest_' + Date.now(),
      name: finalName,
      avatar: '🦊',
      isHost: false,
      status: 'ready',
      score: 0,
      progress: 0
    });
    room.chat.push({
      sender: 'Hệ thống',
      text: `${finalName} vừa vào phòng qua link mời! 🎉`,
      time: formatRoomTime(),
      isSystem: true
    });
  }
  currentSmartRoom = room;
  storage.set(CLASSROOM_ACTIVE_ROOM_KEY, room);
  classroomView = 'room-active';
  showToast(`Đã tham gia phòng "${room.title}"!`, 'success');
  renderClassroom();
}

/** Mở phòng mẫu cộng đồng */
function quickJoinPublicRoom(presetKey) {
  const room = createPresetRoom(presetKey);
  currentSmartRoom = room;
  storage.set(CLASSROOM_ACTIVE_ROOM_KEY, room);
  classroomView = 'room-active';
  renderClassroom();
}

function createPresetRoom(presetKey) {
  let title = 'Hội Luyện Đề HSK 1 - Chuẩn Hanban #01';
  let level = 1;
  let category = 'exam';
  let code = 'HSK-101';
  
  if (presetKey === 'vocab2') {
    title = 'Thử Thách 20 Từ Vựng HSK 2 Cấp Tốc';
    level = 2;
    category = 'vocab';
    code = 'VOC-202';
  } else if (presetKey === 'hsk3') {
    title = 'Hội Luyện Đề HSK 3 - Cùng Đỗ 280+';
    level = 3;
    category = 'exam';
    code = 'HSK-303';
  }

  const { examTitle, questions } = buildSmartRoomQuestions(category, level, 0, 15);
  return {
    id: 'preset_' + presetKey,
    code,
    title,
    hostName: 'Thầy Trương (YuHan)',
    category,
    level,
    examTitle,
    meetUrl: `https://meet.jit.si/YuHan_LopHoc_${code}`,
    createdAt: new Date().toISOString(),
    members: [
      { id: 'm_me', name: `${userProfile.name || 'Học viên'} (Bạn)`, avatar: '🌸', isHost: false, status: 'ready', score: 0, progress: 0 },
      { id: 'm_h', name: 'Thầy Trương (Chủ phòng)', avatar: '🎓', isHost: true, status: 'ready', score: 0, progress: 0 },
      { id: 'm_1', name: 'Ngọc Lan', avatar: '🏮', isHost: false, status: 'ready', score: 0, progress: 0 },
      { id: 'm_2', name: 'Đức Huy', avatar: '🐉', isHost: false, status: 'ready', score: 0, progress: 0 }
    ],
    chat: [
      { sender: 'Hệ thống', text: `Chào mừng bạn đến với phòng học nhóm "${title}"!`, time: formatRoomTime(), isSystem: true },
      { sender: 'Thầy Trương', text: 'Chào cả lớp! Đề này có nhiều bẫy từ vựng hay, các em chú ý nhé!', time: formatRoomTime() }
    ],
    questions,
    status: 'lobby'
  };
}

function deleteSmartRoom(id) {
  const list = getSmartRoomsList().filter(r => r.id !== id);
  saveSmartRoomsList(list);
  if (currentSmartRoom && currentSmartRoom.id === id) {
    currentSmartRoom = null;
    storage.remove(CLASSROOM_ACTIVE_ROOM_KEY);
  }
  renderClassroom();
}

// =========================================================================
// PHẦN 2: GIAO DIỆN PHÒNG HỌC ĐANG MỞ (ROOM ACTIVE VIEW)
// =========================================================================

function renderRoomActiveView() {
  if (!currentSmartRoom) {
    classroomView = 'room-hub';
    return renderRoomHubView();
  }

  const room = currentSmartRoom;
  const inviteLink = smartRoomLink(room);

  return `
    <div class="space-y-6 animate-fadeIn">
      
      <!-- HEADER PHÒNG HỌC PHƯƠNG ĐÔNG HOÀNG GIA -->
      <div class="rounded-3xl p-6 bg-gradient-to-r from-[#FFFDF9] via-[#FAF4EA] to-[#F5E8D3] border-2 border-amber-300 shadow-md">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-red-100 text-[#8B1E1E] text-xs font-bold border border-red-300">
                <i data-lucide="radio" class="w-3.5 h-3.5 animate-pulse text-red-600"></i> Phòng Đang Mở
              </span>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                Cấp độ HSK ${room.level}
              </span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-serif-luxury font-black text-stone-900 tracking-tight">${escapeHtml(room.title)}</h2>
            <p class="text-xs text-stone-600">
              Chủ phòng: <b class="text-stone-900">${escapeHtml(room.hostName)}</b> · Bài: <b>${escapeHtml(room.examTitle || 'Bộ đề ôn tập')}</b> (${room.questions.length} câu)
            </p>
          </div>

          <!-- MÃ PHÒNG & NÚT SAO CHÉP MỜI BẠN BÈ -->
          <div class="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <div class="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border-2 border-amber-300 shadow-xs">
              <span class="text-[11px] font-bold text-stone-500 uppercase">Mã Phòng:</span>
              <span class="font-mono font-black text-[#8B1E1E] text-base tracking-wider">${escapeHtml(room.code)}</span>
              <button type="button" onclick="copyText(${jsArg(room.code)}, 'Đã sao chép mã phòng!')" class="p-1.5 rounded-lg hover:bg-amber-50 text-stone-600" title="Sao chép mã phòng">
                <i data-lucide="copy" class="w-4 h-4"></i>
              </button>
            </div>

            <button type="button" onclick="copyText(${jsArg(inviteLink)}, 'Đã sao chép link mời bạn bè vào phòng!')" class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition">
              <i data-lucide="share-2" class="w-4 h-4"></i> Mời Bạn Bè
            </button>

            <button type="button" onclick="openRoomVideoMeet(${jsArg(room.meetUrl)})" class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition">
              <i data-lucide="video" class="w-4 h-4"></i> Họp Video 1-Chạm
            </button>

            <button type="button" onclick="leaveSmartRoom()" class="p-2.5 rounded-2xl bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-stone-200 transition" title="Rời phòng">
              <i data-lucide="log-out" class="w-4 h-4"></i>
            </button>
          </div>

        </div>
      </div>

      <!-- 2 CỘT TƯƠNG TÁC CHÍNH -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- CỘT TRÁI: DANH SÁCH BẠN BÈ & KHUNG CHAT LIVE THẢO LUẬN (5 CỘT) -->
        <div class="lg:col-span-5 space-y-5">
          
          <!-- DANH SÁCH THÀNH VIÊN TRONG PHÒNG -->
          <div class="glass-card rounded-3xl p-5 border border-amber-200/80 bg-white shadow-xs space-y-3">
            <div class="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <i data-lucide="users" class="w-4 h-4 text-[#8B1E1E]"></i> Thành viên trong phòng (${room.members.length})
              </h4>
              <span class="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Sẵn sàng</span>
            </div>

            <div class="space-y-2">
              ${room.members.map(m => `
                <div class="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50/70 border border-stone-200/60">
                  <div class="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg shadow-xs shrink-0">${m.avatar}</div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-bold text-stone-900 truncate flex items-center gap-1.5">
                      ${escapeHtml(m.name)}
                      ${m.isHost ? '<span class="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-200 text-amber-950 font-black">HOST</span>' : ''}
                    </p>
                    <p class="text-[11px] text-stone-500">${m.status === 'ready' ? 'Đã sẵn sàng' : m.status === 'working' ? 'Đang làm bài' : 'Đã nộp bài'}</p>
                  </div>
                  <div class="text-right">
                    <span class="w-2.5 h-2.5 rounded-full inline-block bg-emerald-500"></span>
                  </div>
                </div>`).join('')}
            </div>

            <!-- CHIA SẺ NHANH QUA ZALO / MESSENGER -->
            <div class="pt-1 flex items-center justify-between text-xs text-stone-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50">
              <span class="text-[11px]">Chia sẻ link mời:</span>
              <div class="flex items-center gap-2">
                <button type="button" onclick="copyText(${jsArg(inviteLink)}, 'Đã sao chép link mời bạn bè!')" class="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-950 text-[11px] font-bold hover:bg-amber-100">
                  Sao chép link
                </button>
              </div>
            </div>
          </div>

          <!-- KHUNG CHAT LIVE THẢO LUẬN BÀI HỌC -->
          <div class="glass-card rounded-3xl p-5 border border-amber-200/80 bg-white shadow-xs space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <i data-lucide="message-square" class="w-4 h-4 text-[#8B1E1E]"></i> Thảo luận trực tiếp
            </h4>

            <div id="roomChatHistory" class="space-y-2.5 max-h-56 overflow-y-auto p-2 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs">
              ${room.chat.map(c => `
                <div class="${c.isSystem ? 'text-center text-[11px] text-amber-900 bg-amber-100/60 p-1.5 rounded-xl' : 'space-y-0.5'}">
                  ${c.isSystem ? escapeHtml(c.text) : `
                    <div class="flex items-baseline justify-between gap-2">
                      <b class="text-[#8B1E1E]">${escapeHtml(c.sender)}</b>
                      <span class="text-[10px] text-stone-400">${escapeHtml(c.time || '')}</span>
                    </div>
                    <div class="p-2 rounded-xl bg-white border border-stone-200 text-stone-800 shadow-xs">${escapeHtml(c.text)}</div>
                  `}
                </div>`).join('')}
            </div>

            <!-- NÚT PHẢN HỒI NHANH -->
            <div class="flex flex-wrap gap-1.5">
              ${['👍 Đã sẵn sàng!', '🔥 Cố lên cả nhóm!', '💡 Đề này hay nè', '🎉 Xong rồi nhé!'].map(txt => `
                <button type="button" onclick="sendSmartRoomQuickReaction(${jsArg(txt)})" class="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-semibold text-amber-900 transition">
                  ${txt}
                </button>`).join('')}
            </div>

            <!-- FORM GỬI TIN NHẮN -->
            <form onsubmit="event.preventDefault(); sendSmartRoomChat(this);" class="flex items-center gap-2">
              <input name="chatMessage" required placeholder="Nhập tin nhắn thảo luận..." class="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs outline-none focus:border-[#8B1E1E]" />
              <button type="submit" class="px-3 py-2 rounded-xl bg-[#8B1E1E] hover:bg-red-800 text-white text-xs font-bold transition">Gửi</button>
            </form>
          </div>

        </div>

        <!-- CỘT PHẢI: KHÔNG GIAN BÀI HỌC & BẮT ĐẦU LÀM BÀI (7 CỘT) -->
        <div class="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border-2 border-amber-200/90 bg-[#FFFDF9] shadow-md space-y-6">
          
          <div class="space-y-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              <i data-lucide="book-open" class="w-3.5 h-3.5"></i> Sảnh chuẩn bị bài làm nhóm
            </span>
            <h3 class="text-2xl font-serif-luxury font-black text-stone-900">${escapeHtml(room.examTitle || room.title)}</h3>
            <p class="text-stone-600 text-sm leading-relaxed">
              Bài tập nhóm gồm <b>${room.questions.length} câu hỏi</b> trắc nghiệm tương tác có âm thanh phát âm bản ngữ chuẩn Hanban. Khi bắt đầu, cả phòng sẽ cùng bấm giờ và thi đua trả lời để xếp hạng trên Bảng Vàng vinh danh của nhóm!
            </p>
          </div>

          <!-- THÔNG SỐ BUỔI HỌC -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center">
              <span class="text-[11px] text-stone-500 block">Số lượng</span>
              <b class="text-lg font-black text-[#8B1E1E]">${room.questions.length} câu</b>
            </div>
            <div class="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center">
              <span class="text-[11px] text-stone-500 block">Thời gian ước tính</span>
              <b class="text-lg font-black text-amber-900">~${Math.ceil(room.questions.length * 1.5)} phút</b>
            </div>
            <div class="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center col-span-2 sm:col-span-1">
              <span class="text-[11px] text-stone-500 block">Chế độ thi đua</span>
              <b class="text-lg font-black text-emerald-800">Đua Top Nhóm</b>
            </div>
          </div>

          <!-- VIDEO CALL PREVIEW BOX -->
          <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <i data-lucide="video" class="w-4 h-4"></i>
                </span>
                <div>
                  <p class="text-xs font-bold text-emerald-950">Phòng họp video trực tuyến đã sẵn sàng</p>
                  <p class="text-[11px] text-emerald-800">Mở phòng họp để bật mic/camera cùng trao đổi đáp án</p>
                </div>
              </div>
              <button type="button" onclick="openRoomVideoMeet(${jsArg(room.meetUrl)})" class="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition">
                Mở Video Call
              </button>
            </div>
          </div>

          <!-- NÚT BẮT ĐẦU LÀM BÀI CÙNG NHÓM -->
          <div class="pt-2 space-y-2">
            <button type="button" onclick="startSmartRoomQuiz()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] hover:brightness-110 text-white font-black text-base shadow-lg shadow-red-950/25 flex items-center justify-center gap-2.5 transition transform active:scale-98 cursor-pointer">
              <i data-lucide="play-circle" class="w-6 h-6"></i>
              BẮT ĐẦU CÙNG LÀM BÀI VỚI NHÓM
            </button>
            <p class="text-center text-[11px] text-stone-500">Mọi thành viên trong phòng sẽ nhận cùng một đề thi để thi đấu công bằng.</p>
          </div>

        </div>

      </div>

    </div>`;
}

function openRoomVideoMeet(url) {
  const target = url || (currentSmartRoom && currentSmartRoom.meetUrl) || 'https://meet.jit.si';
  window.open(target, '_blank', 'noopener,noreferrer');
  showToast('Đã mở phòng họp video trong tab mới!', 'success');
}

function sendSmartRoomChat(form) {
  const text = (form.chatMessage.value || '').trim();
  if (!text || !currentSmartRoom) return;

  const senderName = (userProfile && userProfile.name) || 'Bạn';
  currentSmartRoom.chat.push({
    sender: senderName,
    text,
    time: formatRoomTime()
  });

  form.chatMessage.value = '';
  renderClassroom();

  // Scroll chat down
  setTimeout(() => {
    const el = document.getElementById('roomChatHistory');
    if (el) el.scrollTop = el.scrollHeight;
  }, 50);

  // Friendly peer automatic response after 2-3s
  setTimeout(() => {
    if (currentSmartRoom && currentSmartRoom.chat) {
      const peerReplies = [
        'Đồng ý nha! Cố lên nào!',
        'Mình đã sẵn sàng rồi nè!',
        'Cùng cố gắng đạt điểm tối đa nha!',
        'Đề này chuẩn thi Hanban thật đó.'
      ];
      const rName = ['Hoàng Nam', 'Thu Thảo', 'Thanh Tùng'][Math.floor(Math.random() * 3)];
      currentSmartRoom.chat.push({
        sender: rName,
        text: peerReplies[Math.floor(Math.random() * peerReplies.length)],
        time: formatRoomTime()
      });
      renderClassroom();
    }
  }, 2200);
}

function sendSmartRoomQuickReaction(text) {
  if (!currentSmartRoom) return;
  const senderName = (userProfile && userProfile.name) || 'Bạn';
  currentSmartRoom.chat.push({
    sender: senderName,
    text,
    time: formatRoomTime()
  });
  renderClassroom();
}

function leaveSmartRoom() {
  if (!window.confirm('Bạn có chắc chắn muốn rời phòng học nhóm này?')) return;
  currentSmartRoom = null;
  storage.remove(CLASSROOM_ACTIVE_ROOM_KEY);
  classroomView = 'room-hub';
  renderClassroom();
}

// =========================================================================
// PHẦN 3: LÀM BÀI TẬP NHÓM THỜI GIAN THỰC (ROOM QUIZ VIEW)
// =========================================================================

function startSmartRoomQuiz() {
  if (!currentSmartRoom || !currentSmartRoom.questions.length) return;
  
  smartRoomQuizState = {
    index: 0,
    answers: [],
    startTime: Date.now(),
    peerProgress: currentSmartRoom.members.map(m => ({
      name: m.name,
      avatar: m.avatar,
      currentQ: 1,
      isFinished: false,
      score: 0
    }))
  };

  classroomView = 'room-quiz';
  renderClassroom();

  // Auto-play audio if current question has audioText
  autoPlayRoomAudio();

  // Simulated peer progress interval
  if (smartRoomPeerTimer) clearInterval(smartRoomPeerTimer);
  smartRoomPeerTimer = setInterval(() => {
    if (!smartRoomQuizState || classroomView !== 'room-quiz') {
      clearInterval(smartRoomPeerTimer);
      return;
    }
    const total = currentSmartRoom.questions.length;
    smartRoomQuizState.peerProgress.forEach(p => {
      if (!p.name.includes('(Bạn)') && Math.random() > 0.45 && p.currentQ < total) {
        p.currentQ += 1;
        if (p.currentQ >= total) p.isFinished = true;
      }
    });
    // Partial update to avoid full re-render interrupting clicks
    const peerBar = document.getElementById('roomPeerProgressBar');
    if (peerBar) {
      peerBar.innerHTML = renderPeerProgressSnippet();
    }
  }, 3500);
}

function autoPlayRoomAudio() {
  if (!smartRoomQuizState || !currentSmartRoom) return;
  const q = currentSmartRoom.questions[smartRoomQuizState.index];
  if (q && q.audioText) {
    playChineseTTS(q.audioText);
  }
}

function renderPeerProgressSnippet() {
  if (!smartRoomQuizState) return '';
  const total = currentSmartRoom.questions.length;
  return `
    <div class="flex flex-wrap items-center gap-3">
      ${smartRoomQuizState.peerProgress.map(p => `
        <div class="flex items-center gap-1.5 text-xs text-stone-700 bg-white/90 px-2.5 py-1 rounded-xl border border-amber-200/60 shadow-xs">
          <span>${p.avatar}</span>
          <span class="font-semibold truncate max-w-[80px]">${escapeHtml(p.name.split(' ')[0])}</span>
          <span class="text-[11px] font-mono text-[#8B1E1E] font-bold">${p.isFinished ? '✓ Xong' : `${p.currentQ}/${total}`}</span>
        </div>`).join('')}
    </div>`;
}

function renderRoomQuizView() {
  if (!currentSmartRoom || !smartRoomQuizState) {
    classroomView = 'room-hub';
    return renderRoomHubView();
  }

  const room = currentSmartRoom;
  const state = smartRoomQuizState;
  const q = room.questions[state.index];
  const total = room.questions.length;
  const answered = state.answers[state.index];
  const progressPct = Math.round((state.index / total) * 100);

  return `
    <div class="max-w-2xl mx-auto space-y-5 animate-fadeIn">
      
      <!-- TOP STATUS BAR: TIẾN ĐỘ CÂU & TIẾN ĐỘ BẠN BÈ -->
      <div class="glass-card rounded-2xl p-4 border border-amber-200/80 bg-white shadow-xs space-y-3">
        <div class="flex items-center justify-between text-xs font-bold text-stone-700">
          <span class="flex items-center gap-1.5">
            <i data-lucide="book-open" class="w-4 h-4 text-[#8B1E1E]"></i>
            ${escapeHtml(room.title)}
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-red-100 text-[#8B1E1E]">Câu ${state.index + 1}/${total}</span>
        </div>

        <div class="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden border border-amber-200/50">
          <div class="h-full bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] transition-all duration-300" style="width: ${progressPct}%"></div>
        </div>

        <!-- TIẾN ĐỘ CỦA CÁC BẠN TRONG PHÒNG -->
        <div id="roomPeerProgressBar">
          ${renderPeerProgressSnippet()}
        </div>
      </div>

      <!-- KHUNG CÂU HỎI ORIENTAL LUXURY -->
      <div class="glass-card rounded-3xl p-6 sm:p-8 border-2 border-amber-200/90 bg-[#FFFDF9] shadow-lg text-center space-y-6">
        
        <!-- TIÊU ĐỀ CÂU HỎI -->
        <div class="space-y-2">
          <p class="text-xs font-bold uppercase tracking-wider text-amber-900">
            ${q.statement ? 'Nghe và xác nhận phát âm' : 'Trắc nghiệm phản xạ'}
          </p>
          <div class="text-stone-800 text-sm sm:text-base font-semibold leading-relaxed">
            ${q.prompt}
          </div>
          ${q.statement ? `
            <div class="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-stone-900 font-bold text-base mt-2">
              "${escapeHtml(q.statement)}"
            </div>` : ''}
        </div>

        <!-- NÚT PHÁT ÂM THANH BẢN NGỮ -->
        ${q.audioText ? `
          <div class="py-1">
            <button type="button" onclick="playChineseTTS(${jsArg(q.audioText)})" class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-100/80 hover:bg-amber-200 border border-amber-300 text-[#8B1E1E] font-bold text-sm shadow-xs transition transform hover:scale-102 cursor-pointer">
              <i data-lucide="volume-2" class="w-5 h-5"></i> Nghe phát âm chuẩn (Hanban)
            </button>
            ${q.pinyin ? `<p class="text-xs text-stone-500 font-mono mt-1">${escapeHtml(q.pinyin)}</p>` : ''}
          </div>` : ''}

        <!-- 4 PHƯƠNG ÁN LỰA CHỌN A / B / C / D -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          ${q.options.map((opt, optIdx) => {
            let optClass = 'bg-white hover:bg-amber-50/80 border-stone-200 text-stone-800 hover:border-amber-300';
            if (answered) {
              if (opt.isCorrect) optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400';
              else if (answered.chosenKey === opt.key) optClass = 'bg-rose-50 border-rose-400 text-rose-900';
              else optClass = 'bg-white border-stone-200 text-stone-400 opacity-60';
            }
            return `
              <button type="button" ${answered ? 'disabled' : `onclick="answerSmartRoomQuestion(${jsArg(opt.key)})"`}
                class="p-4 rounded-2xl border-2 text-left transition-all duration-200 ${optClass} flex items-center gap-3 cursor-pointer shadow-xs">
                <span class="w-7 h-7 rounded-xl bg-amber-100/70 text-[#8B1E1E] font-black text-xs flex items-center justify-center shrink-0">
                  ${opt.key}
                </span>
                <span class="text-sm font-semibold">${escapeHtml(opt.text)}</span>
              </button>`;
          }).join('')}
        </div>

        <!-- GIẢI THÍCH & NÚT TIẾP THEO -->
        ${answered ? `
          <div class="p-4 rounded-2xl ${answered.isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'} text-xs text-left space-y-1.5 animate-fadeIn">
            <div class="font-bold flex items-center gap-1.5">
              ${answered.isCorrect ? '<i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i> Chính xác!' : '<i data-lucide="x-circle" class="w-4 h-4 text-rose-600"></i> Chưa chính xác.'}
            </div>
            <p class="leading-relaxed text-stone-700">${q.explanation}</p>
          </div>

          <button type="button" onclick="nextSmartRoomQuestion()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] hover:brightness-110 text-white font-bold text-sm shadow-md transition cursor-pointer">
            ${state.index + 1 < total ? 'Câu tiếp theo →' : 'Hoàn thành & Nộp bài cho nhóm 🏆'}
          </button>` : ''}

      </div>

      <!-- NÚT THOÁT RA SẢNH PHÒNG -->
      <div class="text-center">
        <button type="button" onclick="classroomView = 'room-active'; renderClassroom();" class="text-xs text-stone-500 hover:text-[#8B1E1E] underline">
          Tạm dừng và quay lại sảnh phòng học
        </button>
      </div>

    </div>`;
}

function answerSmartRoomQuestion(key) {
  if (!smartRoomQuizState || !currentSmartRoom) return;
  const state = smartRoomQuizState;
  const q = currentSmartRoom.questions[state.index];
  if (state.answers[state.index]) return;

  const chosenOpt = q.options.find(o => o.key === key);
  const isCorrect = chosenOpt ? !!chosenOpt.isCorrect : false;

  state.answers[state.index] = {
    chosenKey: key,
    isCorrect,
    question: q
  };

  renderClassroom();
}

function nextSmartRoomQuestion() {
  if (!smartRoomQuizState || !currentSmartRoom) return;
  const state = smartRoomQuizState;
  const total = currentSmartRoom.questions.length;

  if (state.index + 1 < total) {
    state.index += 1;
    renderClassroom();
    autoPlayRoomAudio();
  } else {
    finishSmartRoomQuiz();
  }
}

function finishSmartRoomQuiz() {
  if (smartRoomPeerTimer) clearInterval(smartRoomPeerTimer);
  const state = smartRoomQuizState;
  const room = currentSmartRoom;
  const total = room.questions.length;
  const myScore = state.answers.filter(a => a && a.isCorrect).length;
  const durationSec = Math.round((Date.now() - state.startTime) / 1000);

  // Generate realistic group ranking
  const results = room.members.map(m => {
    let score = myScore;
    let time = durationSec;
    if (!m.name.includes('(Bạn)')) {
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
      score = Math.max(0, Math.min(total, myScore + variation));
      time = Math.max(30, durationSec + Math.floor(Math.random() * 40) - 20);
    }
    return {
      name: m.name,
      avatar: m.avatar,
      score,
      total,
      time,
      pct: Math.round((score / total) * 100)
    };
  });

  results.sort((a, b) => b.score - a.score || a.time - b.time);

  // Missed words for SRS flashcard deck
  const missedWords = state.answers
    .filter(a => a && !a.isCorrect && a.question && a.question.wordObj)
    .map(a => a.question.wordObj);

  room.quizResults = {
    myScore,
    total,
    durationSec,
    leaderboard: results,
    missedWords
  };

  addExp(myScore * 3 + 10, 'Hoàn thành bài tập nhóm thông minh');
  classroomView = 'room-result';
  renderClassroom();
}

// =========================================================================
// PHẦN 4: BẢNG VÀNG VINH DANH & THẢO LUẬN ĐÁP ÁN (ROOM RESULT VIEW)
// =========================================================================

function renderRoomResultView() {
  if (!currentSmartRoom || !currentSmartRoom.quizResults) {
    classroomView = 'room-active';
    return renderRoomActiveView();
  }

  const room = currentSmartRoom;
  const res = room.quizResults;
  const lb = res.leaderboard;
  const top1 = lb[0];
  const top2 = lb[1];
  const top3 = lb[2];

  return `
    <div class="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      
      <!-- HEADER VINH DANH HOÀNG GIA -->
      <div class="text-center space-y-2">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-950 font-bold text-xs uppercase tracking-widest border border-amber-300">
          🏆 Bảng Vàng Vinh Danh Thành Tích Nhóm
        </span>
        <h2 class="text-3xl sm:text-4xl font-serif-luxury font-black text-stone-900 tracking-tight">
          ${escapeHtml(room.title)}
        </h2>
        <p class="text-sm text-stone-600">
          Chúc mừng cả nhóm đã xuất sắc hoàn thành buổi học! Dưới đây là bảng tổng sắp xếp hạng thành viên:
        </p>
      </div>

      <!-- BỤC VINH DANH TOP 3 PODIUM -->
      <div class="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-6 pb-2">
        
        <!-- TOP 2: BẢNG NHÃN (BẠC) -->
        ${top2 ? `
          <div class="glass-card rounded-3xl p-3 sm:p-5 border-2 border-slate-300 bg-gradient-to-t from-slate-100 to-white text-center space-y-2 shadow-md">
            <span class="text-2xl sm:text-3xl block">🥈</span>
            <span class="text-2xl">${top2.avatar}</span>
            <p class="text-xs sm:text-sm font-bold text-stone-900 truncate">${escapeHtml(top2.name)}</p>
            <p class="text-base sm:text-lg font-black text-slate-800">${top2.score}/${top2.total}</p>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold uppercase">Bảng Nhãn</span>
          </div>` : '<div></div>'}

        <!-- TOP 1: TRẠNG NGUYÊN (VÀNG) -->
        ${top1 ? `
          <div class="glass-card rounded-3xl p-4 sm:p-6 border-2 border-amber-400 bg-gradient-to-t from-amber-100/80 via-amber-50/50 to-white text-center space-y-2 shadow-xl transform -translate-y-3 sm:-translate-y-5">
            <span class="text-3xl sm:text-4xl block animate-bounce">🏆</span>
            <span class="text-3xl sm:text-4xl">${top1.avatar}</span>
            <p class="text-sm sm:text-base font-black text-stone-900 truncate">${escapeHtml(top1.name)}</p>
            <p class="text-xl sm:text-2xl font-black text-[#8B1E1E]">${top1.score}/${top1.total}</p>
            <span class="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black uppercase tracking-wider shadow-xs">Trạng Nguyên</span>
          </div>` : '<div></div>'}

        <!-- TOP 3: THÁM HOA (ĐỒNG) -->
        ${top3 ? `
          <div class="glass-card rounded-3xl p-3 sm:p-5 border-2 border-amber-600/60 bg-gradient-to-t from-amber-50 to-white text-center space-y-2 shadow-md">
            <span class="text-2xl sm:text-3xl block">🥉</span>
            <span class="text-2xl">${top3.avatar}</span>
            <p class="text-xs sm:text-sm font-bold text-stone-900 truncate">${escapeHtml(top3.name)}</p>
            <p class="text-base sm:text-lg font-black text-amber-900">${top3.score}/${top3.total}</p>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold uppercase">Thám Hoa</span>
          </div>` : '<div></div>'}

      </div>

      <!-- BẢNG TỔNG SẮP CHI TIẾT CẢ PHÒNG -->
      <div class="glass-card rounded-3xl p-6 border border-amber-200/80 bg-white shadow-xs space-y-4">
        <h4 class="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
          <i data-lucide="list-ordered" class="w-4 h-4 text-[#8B1E1E]"></i>
          Bảng điểm chi tiết toàn phòng
        </h4>

        <div class="overflow-x-auto">
          <table class="w-full text-xs sm:text-sm">
            <thead>
              <tr class="text-left text-xs text-stone-500 border-b border-stone-200 pb-2">
                <th class="py-2.5 px-3">Hạng</th>
                <th class="py-2.5 px-3">Thành viên</th>
                <th class="py-2.5 px-3">Điểm số</th>
                <th class="py-2.5 px-3">Tỷ lệ</th>
                <th class="py-2.5 px-3">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              ${lb.map((item, idx) => `
                <tr class="border-b border-stone-100 hover:bg-amber-50/40 transition">
                  <td class="py-3 px-3 font-bold ${idx === 0 ? 'text-amber-600' : 'text-stone-500'}">#${idx + 1}</td>
                  <td class="py-3 px-3 font-bold text-stone-800 flex items-center gap-2">
                    <span>${item.avatar}</span>
                    <span>${escapeHtml(item.name)}</span>
                  </td>
                  <td class="py-3 px-3"><b class="text-[#8B1E1E]">${item.score}/${item.total}</b></td>
                  <td class="py-3 px-3 font-semibold text-stone-600">${item.pct}%</td>
                  <td class="py-3 px-3 text-stone-500">${formatDuration(item.time)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- GÓC THẢO LUẬN & ÔN TỪ VỰNG SAI CỦA NHÓM -->
      ${res.missedWords && res.missedWords.length ? `
        <div class="glass-card rounded-3xl p-6 border border-amber-200/80 bg-amber-50/40 space-y-3">
          <h4 class="text-sm font-bold text-stone-900 flex items-center gap-2">
            <i data-lucide="bookmark" class="w-4 h-4 text-[#8B1E1E]"></i>
            Từ vựng bạn cần ôn lại (${res.missedWords.length} từ)
          </h4>
          <p class="text-xs text-stone-600">Bấm để thêm ngay vào Flashcard cá nhân để học lặp lại ngắt quãng SRS:</p>
          <div class="flex flex-wrap gap-2 pt-1">
            ${res.missedWords.map(w => `
              <button type="button" onclick="saveMissedWordToFlashcards(${jsArg(w.hanzi)}, ${jsArg(w.pinyin)}, ${jsArg(w.meaning)})" class="px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-xs text-stone-800 flex items-center gap-1.5 shadow-xs transition">
                <b class="font-hanzi text-base text-[#8B1E1E]">${escapeHtml(w.hanzi)}</b>
                <span class="text-stone-500">(${escapeHtml(w.pinyin)})</span>
                <i data-lucide="plus" class="w-3.5 h-3.5 text-emerald-600"></i>
              </button>`).join('')}
          </div>
        </div>` : ''}

      <!-- CÁC NÚT ĐIỀU HƯỚNG TIẾP THEO -->
      <div class="flex flex-wrap justify-center items-center gap-3 pt-2">
        <button type="button" onclick="restartSmartRoomQuiz()" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white font-bold text-sm shadow-md hover:brightness-110 transition cursor-pointer flex items-center gap-2">
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Cùng làm lại đề này
        </button>

        <button type="button" onclick="openRoomVideoMeet(${jsArg(room.meetUrl)})" class="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center gap-2">
          <i data-lucide="video" class="w-4 h-4"></i> Họp video thảo luận đáp án
        </button>

        <button type="button" onclick="classroomView = 'room-active'; renderClassroom();" class="px-5 py-3 rounded-2xl bg-white border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition">
          Về sảnh phòng
        </button>

        <button type="button" onclick="classroomView = 'room-hub'; renderClassroom();" class="px-5 py-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-sm hover:bg-amber-100 transition">
          Tạo phòng học mới
        </button>
      </div>

    </div>`;
}

function restartSmartRoomQuiz() {
  startSmartRoomQuiz();
}

function saveMissedWordToFlashcards(hanzi, pinyin, meaning) {
  if (typeof srsAddCard === 'function') {
    srsAddCard({ hanzi, pinyin, meaning }, false);
    if (typeof saveSrsState === 'function') saveSrsState();
    showToast(`Đã thêm từ "${hanzi}" vào Flashcard ôn tập!`, 'success');
  }
}

// =========================================================================
// PHẦN 5: TÍNH NĂNG GIAO BÀI & CHẤM BÀI CHO GIÁO VIÊN (BẢO TOÀN NGUYÊN VẸN)
// =========================================================================

function renderTeacherView() {
  const created = storage.get(CLASSROOM_CREATED_KEY, []) || [];
  const notebookCount = (userProfile.savedWords || []).length;
  return `
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fadeIn">
      <form class="glass-card rounded-2xl p-6 border border-amber-200/70 space-y-4 lg:col-span-3 bg-white/90" onsubmit="event.preventDefault(); createAssignment(this);">
        <h3 class="text-lg font-serif-luxury font-black text-stone-900">Tạo bài tập từ vựng cho học sinh</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label class="text-xs font-semibold text-stone-700 space-y-1">Tiêu đề
            <input name="title" required maxlength="80" value="Bài tập từ vựng" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm" />
          </label>
          <label class="text-xs font-semibold text-stone-700 space-y-1">Lớp / Giáo viên
            <input name="cls" maxlength="60" placeholder="VD: Lớp HSK 2 – cô Lan" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm" />
          </label>
        </div>

        <fieldset class="space-y-2">
          <legend class="text-xs font-semibold text-stone-700 mb-1">Nguồn từ vựng</legend>
          <label class="flex flex-wrap items-center gap-2 text-sm text-stone-700">
            <input type="radio" name="source" value="level" checked class="accent-[#8B1E1E]" /> Ngẫu nhiên theo cấp
            <select name="level" class="px-2 py-1 rounded-lg border border-stone-200 bg-white text-xs">
              ${[1, 2, 3, 4, 5, 6].map(l => `<option value="${l}">HSK ${l}</option>`).join('')}
            </select>
            <select name="count" class="px-2 py-1 rounded-lg border border-stone-200 bg-white text-xs">
              ${[10, 15, 20, 30].map(n => `<option value="${n}">${n} từ</option>`).join('')}
            </select>
          </label>
          <label class="flex items-center gap-2 text-sm text-stone-700 ${notebookCount ? '' : 'opacity-50'}">
            <input type="radio" name="source" value="notebook" ${notebookCount ? '' : 'disabled'} class="accent-[#8B1E1E]" /> Từ trong sổ tay của tôi (${notebookCount} từ)
          </label>
          <label class="flex items-start gap-2 text-sm text-stone-700">
            <input type="radio" name="source" value="custom" class="accent-[#8B1E1E] mt-1" />
            <span class="flex-1 space-y-1">Danh sách tự chọn
              <textarea name="custom" rows="3" placeholder="Nhập chữ Hán, cách nhau bởi dấu phẩy hoặc xuống dòng. VD: 学习, 老师, 朋友" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm font-hanzi"
                oninput="this.form.source.value = 'custom'"></textarea>
            </span>
          </label>
        </fieldset>

        <fieldset>
          <legend class="text-xs font-semibold text-stone-700 mb-2">Dạng câu hỏi</legend>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${Object.entries(QUESTION_TYPES).map(([id, t]) => `
              <label class="flex items-center gap-2 text-sm text-stone-700 px-3 py-2 rounded-xl bg-white border border-stone-200">
                <input type="checkbox" name="types" value="${id}" ${id !== 'reverse' ? 'checked' : ''} class="accent-[#8B1E1E]" /> ${t.label}
              </label>`).join('')}
          </div>
        </fieldset>

        <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] text-white font-bold text-sm shadow-md shadow-red-950/20">
          Tạo link bài tập
        </button>
        ${lastCreatedAssignment ? renderShareBox(lastCreatedAssignment) : ''}
      </form>

      <div class="glass-card rounded-2xl p-6 border border-amber-200/70 lg:col-span-2 space-y-4 bg-white/90">
        <h3 class="text-base font-serif-luxury font-black text-stone-900">Cách dùng trên lớp</h3>
        <ol class="list-decimal pl-5 space-y-1.5 text-sm text-stone-700">
          <li>Tạo bài tập và gửi link cho học sinh (Zalo, Messenger, Google Classroom…).</li>
          <li>Học sinh mở link, nhập tên và làm bài trên điện thoại hoặc máy tính.</li>
          <li>Làm xong, học sinh bấm <b>Sao chép mã kết quả</b> và gửi lại cho bạn.</li>
          <li>Vào <b>Chấm bài</b>, dán các mã để xem bảng điểm, từ cả lớp hay sai và xuất file CSV.</li>
        </ol>
        <h4 class="text-sm font-bold text-stone-800 pt-2">Bài đã tạo (${created.length})</h4>
        <div class="space-y-2 max-h-72 overflow-y-auto">
          ${created.length ? created.map(a => `
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-stone-800 truncate">${escapeHtml(a.t)}</p>
                <p class="text-[11px] text-stone-500">${escapeHtml(a.c || '')} · ${a.w.length} từ · mã ${escapeHtml(a.id)}</p>
              </div>
              <button type="button" onclick="copyText(${jsArg(assignmentLink(a))}, 'Đã sao chép link bài tập.')" class="p-2 rounded-lg hover:bg-amber-50 text-[#8B1E1E]" title="Sao chép link"><i data-lucide="link" class="w-4 h-4"></i></button>
              <button type="button" onclick="deleteCreatedAssignment(${jsArg(a.id)})" class="p-2 rounded-lg hover:bg-rose-50 text-rose-600" title="Xóa"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>`).join('') : '<p class="text-xs text-stone-500">Chưa có bài nào.</p>'}
        </div>
      </div>
    </div>`;
}

function renderShareBox(assignment) {
  const link = assignmentLink(assignment);
  return `
    <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
      <p class="text-sm font-bold text-emerald-900">✓ Đã tạo "${escapeHtml(assignment.t)}" (${assignment.w.length} câu)</p>
      <input readonly value="${escapeHtml(link)}" onclick="this.select()" class="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-xs text-stone-700" />
      <div class="flex flex-wrap gap-2">
        <button type="button" onclick="copyText(${jsArg(link)}, 'Đã sao chép link bài tập.')" class="px-3 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold">Sao chép link</button>
        ${navigator.share ? `<button type="button" onclick="navigator.share({ title: ${jsArg(assignment.t)}, url: ${jsArg(link)} }).catch(() => {})" class="px-3 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-bold">Chia sẻ…</button>` : ''}
        <a href="${escapeHtml(link)}" class="px-3 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-bold">Làm thử như học sinh</a>
      </div>
    </div>`;
}

function collectAssignmentWords(form) {
  const source = form.source.value;
  if (source === 'notebook') {
    return { words: (userProfile.savedWords || []).map(w => [w.hanzi, w.pinyin, w.meaning]), missing: [] };
  }
  if (source === 'custom') {
    const tokens = [...new Set(form.custom.value.split(/[\s,，、;；]+/).map(t => t.trim()).filter(Boolean))];
    const words = [];
    const missing = [];
    tokens.forEach(t => {
      const hit = dictionaryData.find(d => d.title === t);
      if (hit) words.push([hit.title, hit.pinyin, hit.meaning]);
      else missing.push(t);
    });
    return { words, missing };
  }
  const level = Number(form.level.value);
  const count = Number(form.count.value);
  const pool = dictionaryData.filter(d => d.level === level);
  return { words: shuffle(pool).slice(0, count).map(d => [d.title, d.pinyin, d.meaning]), missing: [] };
}

function createAssignment(form) {
  const types = [...form.querySelectorAll('input[name="types"]:checked')].map(i => i.value);
  if (!types.length) {
    showToast('Hãy chọn ít nhất một dạng câu hỏi.', 'error');
    return;
  }
  const { words, missing } = collectAssignmentWords(form);
  if (missing.length) showToast(`Không có trong từ điển, đã bỏ qua: ${missing.join(', ')}`, 'info', 5000);
  if (words.length < 2) {
    showToast('Bài tập cần ít nhất 2 từ có trong từ điển.', 'error');
    return;
  }
  const assignment = {
    v: 1,
    id: Math.random().toString(36).slice(2, 8),
    t: form.title.value.trim() || 'Bài tập từ vựng',
    c: form.cls.value.trim(),
    q: types,
    w: words.slice(0, CLASSROOM_MAX_WORDS),
    at: todayKey()
  };
  const created = storage.get(CLASSROOM_CREATED_KEY, []) || [];
  storage.set(CLASSROOM_CREATED_KEY, [assignment, ...created].slice(0, 30));
  lastCreatedAssignment = assignment;
  renderClassroom();
}

function deleteCreatedAssignment(id) {
  const created = (storage.get(CLASSROOM_CREATED_KEY, []) || []).filter(a => a.id !== id);
  storage.set(CLASSROOM_CREATED_KEY, created);
  if (lastCreatedAssignment && lastCreatedAssignment.id === id) lastCreatedAssignment = null;
  renderClassroom();
}

// ---------- student flow ----------
function renderJoinView() {
  return `
    <form class="glass-card rounded-2xl p-6 border border-amber-200/70 max-w-xl space-y-3 bg-white/90" onsubmit="event.preventDefault(); joinAssignment(this.link.value);">
      <h3 class="text-lg font-serif-luxury font-black text-stone-900">Vào bài được giáo viên giao</h3>
      <p class="text-sm text-stone-600">Mở trực tiếp link giáo viên gửi, hoặc dán link vào ô dưới đây.</p>
      <input name="link" required placeholder="Dán link bài tập..." class="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm" />
      <button type="submit" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white text-sm font-bold">Vào bài</button>
    </form>`;
}

function joinAssignment(link) {
  const match = String(link).match(/[?&]a=([A-Za-z0-9_-]+)/);
  const code = match ? match[1] : String(link).trim();
  try {
    decodeAssignment(code);
  } catch (e) {
    showToast('Link bài tập không hợp lệ.', 'error');
    return;
  }
  history.pushState(null, '', `#/classroom?a=${code}`);
  handleClassroomRoute();
}

function buildQuestions(assignment) {
  const rand = seededRandom(assignment.id);
  const words = assignment.w.map(([hanzi, pinyin, meaning]) => ({ hanzi, pinyin, meaning }));
  const pool = words.length >= 4
    ? words
    : [...words, ...dictionaryData.slice(0, 40).map(d => ({ hanzi: d.title, pinyin: d.pinyin, meaning: d.meaning }))];
  const field = { meaning: 'meaning', pinyin: 'pinyin', listen: 'hanzi', reverse: 'hanzi' };

  return seededShuffle(words, rand).map((word, i) => {
    const type = assignment.q[i % assignment.q.length];
    const key = field[type];
    const distractors = seededShuffle(pool.filter(w => w.hanzi !== word.hanzi && w[key] !== word[key]), rand)
      .slice(0, 3)
      .map(w => w[key]);
    return { type, word, answer: word[key], options: seededShuffle([word[key], ...distractors], rand) };
  });
}

function startStudentIntro(assignment) {
  classroomRun = { assignment, name: storage.getRaw('yuhan_student_name', '') || '', questions: [], index: 0, answers: [], startedAt: 0 };
  classroomView = 'student-intro';
  renderClassroom();
}

function renderStudentIntro() {
  const a = classroomRun.assignment;
  const previous = (storage.get(CLASSROOM_ATTEMPTS_KEY, {}) || {})[a.id];
  return `
    <div class="glass-card rounded-2xl p-6 lg:p-8 border border-amber-200/70 max-w-xl mx-auto space-y-4 text-center bg-white/95">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold"><i data-lucide="school" class="w-3.5 h-3.5"></i> Bài tập được giao</span>
      <h2 class="text-2xl font-serif-luxury font-black text-stone-900">${escapeHtml(a.t)}</h2>
      ${a.c ? `<p class="text-sm text-stone-600">${escapeHtml(a.c)}</p>` : ''}
      <p class="text-sm text-stone-600">${a.w.length} câu · ${a.q.map(t => QUESTION_TYPES[t] ? QUESTION_TYPES[t].label : t).join(' · ')}</p>
      ${previous ? `<div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">Bạn đã làm bài này: <b>${previous.s}/${previous.q}</b>. <button type="button" onclick="showPreviousAttempt()" class="underline font-bold">Xem lại mã kết quả</button></div>` : ''}
      <form class="space-y-3 text-left" onsubmit="event.preventDefault(); beginQuiz(this.studentName.value);">
        <label class="text-xs font-semibold text-stone-700 space-y-1 block">Họ và tên của bạn
          <input name="studentName" required maxlength="60" value="${escapeHtml(classroomRun.name)}" placeholder="VD: Nguyễn Văn An" class="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm" />
        </label>
        <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] via-[#A52A2A] to-[#B8860B] text-white font-bold text-sm">Bắt đầu làm bài</button>
      </form>
      <button type="button" onclick="setClassroomView('teacher')" class="text-xs text-stone-500 hover:text-[#8B1E1E]">Thoát</button>
    </div>`;
}

function beginQuiz(name) {
  const clean = String(name || '').trim().slice(0, 60);
  if (!clean) return;
  storage.setRaw('yuhan_student_name', clean);
  classroomRun.name = clean;
  classroomRun.questions = buildQuestions(classroomRun.assignment);
  classroomRun.index = 0;
  classroomRun.answers = [];
  classroomRun.startedAt = Date.now();
  classroomView = 'quiz';
  renderClassroom();
  autoPlayListening();
}

function autoPlayListening() {
  const q = classroomRun && classroomRun.questions[classroomRun.index];
  if (q && q.type === 'listen') playChineseTTS(q.word.hanzi);
}

function renderQuizQuestion() {
  const run = classroomRun;
  const q = run.questions[run.index];
  const answered = run.answers[run.index];
  const total = run.questions.length;
  const prompt = {
    meaning: `<span class="font-hanzi text-6xl font-black text-[#8B1E1E]">${escapeHtml(q.word.hanzi)}</span>`,
    pinyin: `<span class="font-hanzi text-6xl font-black text-[#8B1E1E]">${escapeHtml(q.word.hanzi)}</span>`,
    listen: `<button type="button" onclick="playChineseTTS(${jsArg(q.word.hanzi)})" class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-[#8B1E1E] font-bold"><i data-lucide="volume-2" class="w-6 h-6"></i> Nghe lại</button>`,
    reverse: `<span class="text-2xl font-serif-luxury font-black text-stone-900">${escapeHtml(q.word.meaning)}</span>`
  }[q.type];
  const optionClass = opt => {
    if (!answered) return 'bg-white hover:bg-amber-50 border-stone-200 text-stone-800';
    if (opt === q.answer) return 'bg-emerald-50 border-emerald-500 text-emerald-900';
    if (opt === answered.choice) return 'bg-rose-50 border-rose-400 text-rose-800';
    return 'bg-white border-stone-200 text-stone-400';
  };
  const isHanziOption = q.type === 'listen' || q.type === 'reverse';

  return `
    <div class="max-w-xl mx-auto space-y-4">
      <div class="flex items-center gap-3 text-xs font-semibold text-stone-600">
        <span>${escapeHtml(run.assignment.t)}</span>
        <span class="ml-auto">Câu ${run.index + 1}/${total}</span>
      </div>
      <div class="w-full h-2 rounded-full bg-stone-200 overflow-hidden"><div class="h-full bg-gradient-to-r from-[#8B1E1E] to-[#C59A3F]" style="width:${Math.round((run.index / total) * 100)}%"></div></div>
      <div class="glass-card rounded-3xl p-6 lg:p-8 border border-amber-200/70 text-center space-y-6 bg-white/95">
        <p class="text-xs font-bold uppercase tracking-wider text-amber-900">${QUESTION_TYPES[q.type].hint}</p>
        <div>${prompt}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${q.options.map(opt => `
            <button type="button" ${answered ? 'disabled' : `onclick="answerClassroomQuestion(${jsArg(opt)})"`}
              class="px-4 py-3 rounded-xl border-2 text-left transition-colors ${optionClass(opt)} ${isHanziOption ? 'font-hanzi text-2xl font-bold text-center' : 'text-sm font-semibold'}">${escapeHtml(opt)}</button>`).join('')}
        </div>
        ${answered ? `
          <div class="text-sm ${answered.correct ? 'text-emerald-800' : 'text-rose-700'}">
            ${answered.correct ? '✓ Chính xác!' : '✗ Chưa đúng.'}
            <span class="text-stone-600"><b class="font-hanzi">${escapeHtml(q.word.hanzi)}</b> (${escapeHtml(q.word.pinyin)}): ${escapeHtml(q.word.meaning)}</span>
          </div>
          <button type="button" onclick="nextQuizQuestion()" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white font-bold text-sm">
            ${run.index + 1 < total ? 'Câu tiếp theo' : 'Nộp bài'}
          </button>` : ''}
      </div>
    </div>`;
}

function answerClassroomQuestion(choice) {
  const run = classroomRun;
  const q = run.questions[run.index];
  if (run.answers[run.index]) return;
  run.answers[run.index] = { choice, correct: choice === q.answer };
  if (q.type !== 'listen') playChineseTTS(q.word.hanzi);
  renderClassroom();
}

function nextQuizQuestion() {
  const run = classroomRun;
  if (run.index + 1 < run.questions.length) {
    run.index += 1;
    renderClassroom();
    autoPlayListening();
    return;
  }
  finishQuiz();
}

function finishQuiz() {
  const run = classroomRun;
  const score = run.answers.filter(a => a && a.correct).length;
  const wrong = run.questions.filter((q, i) => !(run.answers[i] && run.answers[i].correct)).map(q => q.word.hanzi);
  const result = {
    a: run.assignment.id,
    t: run.assignment.t,
    n: run.name,
    s: score,
    q: run.questions.length,
    d: Math.round((Date.now() - run.startedAt) / 1000),
    w: wrong,
    at: new Date().toISOString()
  };
  run.result = result;
  run.code = encodeResult(result);

  const attempts = storage.get(CLASSROOM_ATTEMPTS_KEY, {}) || {};
  attempts[run.assignment.id] = { s: score, q: result.q, code: run.code };
  storage.set(CLASSROOM_ATTEMPTS_KEY, attempts);

  wrong.forEach(h => {
    const w = run.assignment.w.find(x => x[0] === h);
    if (w) srsAddCard({ hanzi: w[0], pinyin: w[1], meaning: w[2] }, false);
  });
  saveSrsState();
  addExp(score * 2 + 5, 'Hoàn thành bài tập lớp học');

  classroomView = 'result';
  renderClassroom();
}

function showPreviousAttempt() {
  const prev = (storage.get(CLASSROOM_ATTEMPTS_KEY, {}) || {})[classroomRun.assignment.id];
  if (!prev) return;
  try {
    classroomRun.result = decodeResult(prev.code);
    classroomRun.code = prev.code;
    classroomView = 'result';
    renderClassroom();
  } catch (e) {
    showToast('Không đọc được kết quả đã lưu.', 'error');
  }
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m} phút ${s} giây` : `${s} giây`;
}

function renderStudentResult() {
  const r = classroomRun.result;
  const pct = Math.round((r.s / r.q) * 100);
  return `
    <div class="glass-card rounded-3xl p-6 lg:p-8 border border-amber-200/70 max-w-xl mx-auto space-y-5 text-center bg-white/95">
      <p class="text-xs font-bold uppercase tracking-wider text-amber-900">${escapeHtml(r.t)}</p>
      <h2 class="text-4xl font-black ${pct >= 80 ? 'text-emerald-800' : pct >= 50 ? 'text-amber-800' : 'text-[#8B1E1E]'}">${r.s}/${r.q}</h2>
      <p class="text-sm text-stone-600">${escapeHtml(r.n)} · ${pct}% · ${formatDuration(r.d)}</p>
      ${r.w.length ? `<div class="text-sm text-stone-700">Từ cần ôn lại (đã thêm vào Flashcard của bạn):
        <div class="flex flex-wrap justify-center gap-1.5 mt-2">${r.w.map(h => `<span class="px-2 py-1 rounded-lg bg-rose-50 border border-rose-200 font-hanzi font-bold text-rose-800">${escapeHtml(h)}</span>`).join('')}</div></div>` : '<p class="text-sm text-emerald-800 font-semibold">Xuất sắc, không sai câu nào! 🎉</p>'}
      <div class="text-left space-y-2">
        <p class="text-xs font-bold text-stone-700">Mã kết quả — gửi mã này cho giáo viên:</p>
        <textarea readonly rows="3" onclick="this.select()" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-[11px] font-mono text-stone-700 break-all">${escapeHtml(classroomRun.code)}</textarea>
        <button type="button" onclick="copyText(${jsArg(classroomRun.code)}, 'Đã sao chép mã kết quả. Hãy gửi cho giáo viên.')" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white font-bold text-sm">Sao chép mã kết quả</button>
      </div>
      <div class="flex flex-wrap justify-center gap-2">
        <button type="button" onclick="beginQuiz(classroomRun.name)" class="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold">Làm lại</button>
        <button type="button" onclick="switchTab('flashcards').then(() => startFlashcardSession('due'))" class="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">Ôn từ sai bằng Flashcard</button>
      </div>
    </div>`;
}

// ---------- teacher: grade ----------
function renderGradeView() {
  const results = storage.get(CLASSROOM_RESULTS_KEY, []) || [];
  const created = storage.get(CLASSROOM_CREATED_KEY, []) || [];
  const byAssignment = {};
  results.forEach(r => { (byAssignment[r.a] = byAssignment[r.a] || []).push(r); });

  const tables = Object.entries(byAssignment).map(([id, rows]) => {
    const meta = created.find(a => a.id === id);
    const avg = Math.round(rows.reduce((sum, r) => sum + r.s / r.q, 0) / rows.length * 100);
    const missCount = {};
    rows.forEach(r => r.w.forEach(h => { missCount[h] = (missCount[h] || 0) + 1; }));
    const topMissed = Object.entries(missCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const sorted = [...rows].sort((a, b) => b.s / b.q - a.s / a.q || a.d - b.d);
    return `
      <div class="glass-card rounded-2xl p-5 border border-amber-200/70 space-y-3 bg-white/95">
        <div class="flex flex-wrap items-center gap-2">
          <h4 class="text-base font-serif-luxury font-black text-stone-900">${escapeHtml(meta ? meta.t : rows[0].t)}</h4>
          <span class="text-xs text-stone-500">mã ${escapeHtml(id)} · ${rows.length} bài nộp · trung bình ${avg}%</span>
          <button type="button" onclick="exportClassroomCsv(${jsArg(id)})" class="ml-auto px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-amber-50">Xuất CSV</button>
        </div>
        ${topMissed.length ? `<div class="text-xs text-stone-600">Từ cả lớp hay sai:
          ${topMissed.map(([h, n]) => `<span class="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200"><b class="font-hanzi text-rose-800">${escapeHtml(h)}</b><span class="text-rose-600">×${n}</span></span>`).join('')}</div>` : ''}
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead><tr class="text-left text-xs text-stone-500 border-b border-stone-200">
              <th class="py-2 pr-2">#</th><th class="py-2 pr-2">Học sinh</th><th class="py-2 pr-2">Điểm</th><th class="py-2 pr-2">Thời gian</th><th class="py-2">Nộp lúc</th>
            </tr></thead>
            <tbody>${sorted.map((r, i) => `
              <tr class="border-b border-stone-100">
                <td class="py-2 pr-2 text-stone-500">${i + 1}</td>
                <td class="py-2 pr-2 font-semibold text-stone-800">${escapeHtml(r.n)}</td>
                <td class="py-2 pr-2"><b class="${r.s / r.q >= 0.8 ? 'text-emerald-800' : r.s / r.q >= 0.5 ? 'text-amber-800' : 'text-[#8B1E1E]'}">${r.s}/${r.q}</b></td>
                <td class="py-2 pr-2 text-stone-600">${formatDuration(r.d)}</td>
                <td class="py-2 text-stone-600">${escapeHtml(new Date(r.at).toLocaleString('vi-VN'))}</td>
              </tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="space-y-6 animate-fadeIn">
      <form class="glass-card rounded-2xl p-6 border border-amber-200/70 space-y-3 bg-white/95" onsubmit="event.preventDefault(); gradeResultCodes(this.codes.value); this.codes.value = '';">
        <h3 class="text-lg font-serif-luxury font-black text-stone-900">Chấm bài từ mã kết quả</h3>
        <p class="text-sm text-stone-600">Dán một hoặc nhiều mã (mỗi mã một dòng, có thể dán cả đoạn tin nhắn). Mã trùng sẽ tự bỏ qua.</p>
        <textarea name="codes" rows="4" required placeholder="${RESULT_CODE_PREFIX}.xxxx.xxxx" class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-mono"></textarea>
        <div class="flex flex-wrap gap-2">
          <button type="submit" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#A52A2A] text-white text-sm font-bold">Chấm bài</button>
          ${results.length ? '<button type="button" onclick="clearClassroomResults()" class="px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 text-sm font-bold">Xóa toàn bộ kết quả</button>' : ''}
        </div>
      </form>
      ${tables || '<p class="text-sm text-stone-500">Chưa có bài nộp nào.</p>'}
    </div>`;
}

function gradeResultCodes(text) {
  const codes = String(text).match(new RegExp(`${RESULT_CODE_PREFIX}\\.[A-Za-z0-9_-]+\\.[0-9a-f]{8}`, 'g')) || [];
  const results = storage.get(CLASSROOM_RESULTS_KEY, []) || [];
  const known = new Set(results.map(r => r.code));
  let added = 0;
  let invalid = 0;
  codes.forEach(code => {
    if (known.has(code)) return;
    try {
      const r = decodeResult(code);
      results.push({ ...r, code });
      known.add(code);
      added += 1;
    } catch (e) {
      invalid += 1;
    }
  });
  storage.set(CLASSROOM_RESULTS_KEY, results);
  if (!codes.length) showToast('Không tìm thấy mã kết quả hợp lệ trong nội dung đã dán.', 'error');
  else showToast(`Đã thêm ${added} bài nộp${invalid ? `, ${invalid} mã bị lỗi` : ''}.`, invalid ? 'info' : 'success');
  renderClassroom();
}

function clearClassroomResults() {
  if (!window.confirm('Xóa toàn bộ kết quả đã chấm trên máy này?')) return;
  storage.set(CLASSROOM_RESULTS_KEY, []);
  renderClassroom();
}

function exportClassroomCsv(id) {
  const rows = (storage.get(CLASSROOM_RESULTS_KEY, []) || []).filter(r => r.a === id);
  const cell = v => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [['Học sinh', 'Đúng', 'Tổng', 'Phần trăm', 'Thời gian (giây)', 'Từ sai', 'Nộp lúc'].map(cell).join(',')];
  rows.forEach(r => lines.push([r.n, r.s, r.q, Math.round((r.s / r.q) * 100), r.d, r.w.join(' '), r.at].map(cell).join(',')));
  downloadFile(`ket-qua-${id}.csv`, '﻿' + lines.join('\r\n'), 'text/csv;charset=utf-8');
}
