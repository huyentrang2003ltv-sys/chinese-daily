// ---------------- TAB: LỚP HỌC (Classroom assignments, no backend) ----------------
// Teacher builds a vocabulary quiz -> the whole assignment is encoded in a share link
// (#/classroom?a=...). Students take it and get a result code; the teacher pastes the
// codes back to grade the class. The checksum only catches typos / copy errors: without
// a server, a determined student could forge a code, so treat scores as formative.
const CLASSROOM_CREATED_KEY = 'yuhan_classroom_created';
const CLASSROOM_RESULTS_KEY = 'yuhan_classroom_results';
const CLASSROOM_ATTEMPTS_KEY = 'yuhan_classroom_attempts';
const CLASSROOM_MAX_WORDS = 30;
const RESULT_CODE_PREFIX = 'HTTMN1';
const QUESTION_TYPES = {
  meaning: { label: 'Chữ Hán → Nghĩa', hint: 'Chọn nghĩa đúng' },
  pinyin: { label: 'Chữ Hán → Pinyin', hint: 'Chọn phiên âm đúng' },
  listen: { label: 'Nghe → Chữ Hán', hint: 'Nghe và chọn chữ Hán đúng' },
  reverse: { label: 'Nghĩa → Chữ Hán', hint: 'Chọn chữ Hán có nghĩa này' }
};

let classroomView = 'teacher';
let classroomRun = null;
let lastCreatedAssignment = null;

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

async function copyText(text, okMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(okMessage || 'Đã sao chép.', 'success');
  } catch (e) {
    window.prompt('Sao chép thủ công (Ctrl+C):', text);
  }
}

// ---------- routing ----------
function initClassroom() {
  handleClassroomRoute();
}

function handleClassroomRoute() {
  const code = getHashParams().get('a');
  if (code) {
    try {
      startStudentIntro(decodeAssignment(code));
      return;
    } catch (e) {
      showToast('Link bài tập không hợp lệ hoặc bị cắt mất một phần.', 'error', 5000);
    }
  }
  if (classroomView === 'student-intro' || classroomView === 'quiz' || classroomView === 'result') classroomView = 'teacher';
  renderClassroom();
}

function setClassroomView(view) {
  classroomView = view;
  if (getHashParams().get('a')) history.replaceState(null, '', '#/classroom');
  renderClassroom();
}

function renderClassroom() {
  const root = document.getElementById('classroomRoot');
  if (!root) return;
  const views = {
    teacher: renderTeacherView,
    grade: renderGradeView,
    join: renderJoinView,
    'student-intro': renderStudentIntro,
    quiz: renderQuizQuestion,
    result: renderStudentResult
  };
  const isStudentFlow = ['student-intro', 'quiz', 'result'].includes(classroomView);
  // Students only need the quiz; the teacher-facing intro would push it below the fold.
  const intro = document.getElementById('classroomIntro');
  if (intro) intro.classList.toggle('hidden', isStudentFlow);
  const switcher = isStudentFlow ? '' : `
    <div class="flex flex-wrap gap-1.5">
      ${[['teacher', 'clipboard-pen-line', 'Giao bài'], ['grade', 'clipboard-check', 'Chấm bài'], ['join', 'log-in', 'Học sinh: vào bài']].map(([id, icon, label]) => `
        <button type="button" onclick="setClassroomView(${jsArg(id)})" class="nav-subtab ${classroomView === id ? 'is-active' : ''}">
          <i data-lucide="${icon}" class="w-4 h-4"></i><span>${label}</span>
        </button>`).join('')}
    </div>`;
  root.innerHTML = switcher + (views[classroomView] || renderTeacherView)();
  refreshIcons(root);
}

// ---------- teacher: create ----------
function renderTeacherView() {
  const created = storage.get(CLASSROOM_CREATED_KEY, []) || [];
  const notebookCount = (userProfile.savedWords || []).length;
  return `
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <form class="glass-card rounded-2xl p-6 border border-amber-200/70 space-y-4 lg:col-span-3" onsubmit="event.preventDefault(); createAssignment(this);">
        <h3 class="text-lg font-serif-luxury font-black text-stone-900">Tạo bài tập từ vựng</h3>
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

      <div class="glass-card rounded-2xl p-6 border border-amber-200/70 lg:col-span-2 space-y-4">
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
              <button type="button" onclick="copyText(${jsArg(assignmentLink(a))}, 'Đã sao chép link bài tập.')" class="p-2 rounded-lg hover:bg-amber-50 text-[#8B1E1E]" title="Sao chép link" aria-label="Sao chép link"><i data-lucide="link" class="w-4 h-4"></i></button>
              <button type="button" onclick="deleteCreatedAssignment(${jsArg(a.id)})" class="p-2 rounded-lg hover:bg-rose-50 text-rose-600" title="Xóa khỏi danh sách" aria-label="Xóa"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
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

// ---------- student ----------
function renderJoinView() {
  return `
    <form class="glass-card rounded-2xl p-6 border border-amber-200/70 max-w-xl space-y-3" onsubmit="event.preventDefault(); joinAssignment(this.link.value);">
      <h3 class="text-lg font-serif-luxury font-black text-stone-900">Vào bài được giao</h3>
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
  // Pad the distractor pool from the dictionary when the list is short.
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
    <div class="glass-card rounded-2xl p-6 lg:p-8 border border-amber-200/70 max-w-xl mx-auto space-y-4 text-center">
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
      <div class="glass-card rounded-3xl p-6 lg:p-8 border border-amber-200/70 text-center space-y-6">
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

  // Missed words go into the learner's own review deck.
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
    <div class="glass-card rounded-3xl p-6 lg:p-8 border border-amber-200/70 max-w-xl mx-auto space-y-5 text-center">
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
      <div class="glass-card rounded-2xl p-5 border border-amber-200/70 space-y-3">
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
    <div class="space-y-6">
      <form class="glass-card rounded-2xl p-6 border border-amber-200/70 space-y-3" onsubmit="event.preventDefault(); gradeResultCodes(this.codes.value); this.codes.value = '';">
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
  // BOM so Excel opens UTF-8 Vietnamese/Chinese text correctly
  downloadFile(`ket-qua-${id}.csv`, '﻿' + lines.join('\r\n'), 'text/csv;charset=utf-8');
}
