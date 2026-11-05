// ==========================================
// MODULE: LỘ TRÌNH NHẬP MÔN 7 NGÀY (ZERO-TO-HERO 7-DAY GOLDEN PATH)
// Thiết kế chuyên biệt cho người mới bắt đầu (F0), giải phóng nỗi sợ chữ Hán & thanh điệu
// ==========================================

const BEGINNER_7DAYS_KEY = 'hsk_beginner_7days_v1';
const LEARNER_MODE_KEY = 'hsk_learner_mode_v1';

// Detailed 7-day curriculum designed for zero-base learners
const BEGINNER_CURRICULUM = [
  {
    day: 1,
    title: '4 Thanh Điệu Ma Thuật & Lời Chào Đầu Tiên',
    hanzi: '你好',
    pinyin: 'Nǐ hǎo',
    meaning: 'Xin chào!',
    duration: '8 phút',
    badge: 'Khởi động',
    icon: '🎵',
    summary: 'Làm chủ 4 dấu thanh điệu tiếng Trung và phát âm chuẩn câu chào kinh điển.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 leading-relaxed">
          <p class="font-bold text-amber-900 dark:text-amber-300 text-sm mb-1.5">💡 Bí quyết thanh điệu cho người Việt:</p>
          Tiếng Trung chỉ có <strong>4 thanh điệu chính</strong> (ít hơn tiếng Việt có 6 thanh). Nắm vững cao độ sẽ giúp bạn nói tự nhiên như người bản xứ ngay từ ngày đầu tiên!
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div class="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xs font-black">1</span>
                <span>Thanh 1 (Ngang - 55)</span>
              </span>
              <button onclick="playBeginnerAudio('mā')" class="px-2 py-1 rounded-lg bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 flex items-center gap-1 cursor-pointer">
                <span>🔊 mā</span>
              </button>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400">Cao và ngân đều như hát nốt Sol cao. <em>Ví dụ: 妈 (mā - mẹ).</em></p>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-black">2</span>
                <span>Thanh 2 (Sắc - 35)</span>
              </span>
              <button onclick="playBeginnerAudio('má')" class="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1 cursor-pointer">
                <span>🔊 má</span>
              </button>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400">Đi từ trung bình lên cao (giống dấu sắc tiếng Việt). <em>Ví dụ: 麻 (má - cây gai).</em></p>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-black">3</span>
                <span>Thanh 3 (Lượn - 214)</span>
              </span>
              <button onclick="playBeginnerAudio('mǎ')" class="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 flex items-center gap-1 cursor-pointer">
                <span>🔊 mǎ</span>
              </button>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400">Xuống thấp rồi lượn nhẹ lên (như dấu hỏi). <em>Ví dụ: 马 (mǎ - con ngựa).</em></p>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center text-xs font-black">4</span>
                <span>Thanh 4 (Rơi dứt khoát - 51)</span>
              </span>
              <button onclick="playBeginnerAudio('mà')" class="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 flex items-center gap-1 cursor-pointer">
                <span>🔊 mà</span>
              </button>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400">Rơi dứt khoát từ đỉnh cao xuống đáy. <em>Ví dụ: 骂 (mà - mắng chửi).</em></p>
          </div>
        </div>

        <!-- Câu chào thực hành -->
        <div class="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-white dark:from-stone-800 dark:via-stone-800 dark:to-stone-900 border border-amber-300/80 dark:border-stone-700 text-center space-y-2">
          <span class="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-amber-300">Thực hành câu chào đầu tiên</span>
          <div class="text-3xl font-chinese font-black text-stone-900 dark:text-stone-100">你好！</div>
          <div class="text-base font-bold text-[#8B1E1E] dark:text-amber-400">Nǐ hǎo! (Đọc biến âm thành: Ní hǎo)</div>
          <p class="text-xs text-stone-600 dark:text-stone-400">
            ⚠️ <strong>Quy tắc vàng:</strong> Hai thanh 3 đi liền nhau (Nǐ + hǎo), từ đầu tiên sẽ biến thành thanh 2 (Ní hǎo).
          </p>
          <div class="pt-2 flex items-center justify-center gap-2">
            <button onclick="playBeginnerAudio('你好')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-rose-700 text-white font-bold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
              <span>🔊 Nghe Giọng Chuẩn Bắc Kinh</span>
            </button>
          </div>
        </div>
      </div>
    `
  },
  {
    day: 2,
    title: '6 Vận Mẫu Đơn & Phụ Âm Cốt Lõi',
    hanzi: '爸妈',
    pinyin: 'Bà mā',
    meaning: 'Bố mẹ',
    duration: '10 phút',
    badge: 'Ngữ âm',
    icon: '🗣️',
    summary: 'Làm quen 6 nguyên âm đơn (a, o, e, i, u, ü) và mẹo tròn môi huýt sáo âm ü.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 leading-relaxed">
          <strong>6 Vận mẫu đơn (Nguyên âm cốt lõi):</strong> Hãy nghe và đọc theo đúng khẩu hình miệng:
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center space-y-1">
            <span class="text-xl font-black text-stone-900 dark:text-stone-100">a</span>
            <p class="text-[11px] text-stone-500">Mở to miệng như chữ 'A'</p>
            <button onclick="playBeginnerAudio('a')" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">🔊 Nghe</button>
          </div>
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center space-y-1">
            <span class="text-xl font-black text-stone-900 dark:text-stone-100">o</span>
            <p class="text-[11px] text-stone-500">Tròn môi đọc như 'ua' nhẹ</p>
            <button onclick="playBeginnerAudio('o')" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">🔊 Nghe</button>
          </div>
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center space-y-1">
            <span class="text-xl font-black text-stone-900 dark:text-stone-100">e</span>
            <p class="text-[11px] text-stone-500">Đọc như 'ưa' trong tiếng Việt</p>
            <button onclick="playBeginnerAudio('e')" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">🔊 Nghe</button>
          </div>
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center space-y-1">
            <span class="text-xl font-black text-stone-900 dark:text-stone-100">i</span>
            <p class="text-[11px] text-stone-500">Đọc dẹt môi như 'i'</p>
            <button onclick="playBeginnerAudio('i')" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">🔊 Nghe</button>
          </div>
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center space-y-1">
            <span class="text-xl font-black text-stone-900 dark:text-stone-100">u</span>
            <p class="text-[11px] text-stone-500">Môi chu ra như 'u'</p>
            <button onclick="playBeginnerAudio('u')" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">🔊 Nghe</button>
          </div>
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border-2 border-rose-300 dark:border-rose-700 text-center space-y-1 bg-rose-50/50">
            <span class="text-xl font-black text-rose-700 dark:text-rose-400">ü (uy)</span>
            <p class="text-[11px] text-rose-600 dark:text-rose-300 font-bold">Môi huýt sáo, đọc âm 'i'</p>
            <button onclick="playBeginnerAudio('ü')" class="text-xs font-bold text-rose-700 dark:text-rose-400 hover:underline">🔊 Nghe chuẩn</button>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-2">
          <p class="font-bold text-stone-900 dark:text-stone-100">Cặp phụ âm bật hơi sống còn: B vs P</p>
          <div class="flex items-center justify-between text-xs">
            <span><strong>B:</strong> Không bật hơi (đọc giống 'pua' tiếng Việt) ➔ <em>bàba (bố)</em></span>
            <button onclick="playBeginnerAudio('bàba')" class="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-bold">🔊 bàba</button>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span><strong>P:</strong> Bật mạnh luồng hơi qua môi ➔ <em>píngguǒ (quả táo)</em></span>
            <button onclick="playBeginnerAudio('píngguǒ')" class="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-bold">🔊 píngguǒ</button>
          </div>
        </div>
      </div>
    `
  },
  {
    day: 3,
    title: '8 Quy Tắc Bút Thuận Viết Chữ Hán',
    hanzi: '十人',
    pinyin: 'Shí rén',
    meaning: 'Mười người (Quy tắc viết)',
    duration: '10 phút',
    badge: 'Tập viết',
    icon: '✍️',
    summary: 'Nắm vững 8 quy tắc viết chữ Hán sống còn để viết chữ cân đối và nhanh đẹp.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <p class="leading-relaxed">
          Chữ Hán không phải là vẽ tranh ngẫu nhiên! Mọi chữ Hán đều tuân theo <strong>8 quy tắc bút thuận</strong> kinh điển giúp ngòi bút lướt tự nhiên và ghi nhớ chữ cực sâu:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">1. Ngang trước, sổ sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Thập <strong>十</strong> (ngang ─ trước, sổ │ sau)</p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">十</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">2. Phẩy trước, mác sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Bát <strong>八</strong>, chữ Nhân <strong>人</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">人</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">3. Trên trước, dưới sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Tam <strong>三</strong> (viết từ nét trên xuống)</p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">三</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">4. Trái trước, phải sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Bạn <strong>你</strong>, chữ Anh ấy <strong>他</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">你</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">5. Ngoài trước, trong sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Nguyệt <strong>月</strong>, chữ Đồng <strong>同</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">月</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">6. Vào trước, đóng sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Nhật <strong>日</strong>, chữ Quốc <strong>国</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">日</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">7. Giữa trước, hai bên sau</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Tiểu <strong>小</strong>, chữ Thủy <strong>水</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">小</span>
          </div>

          <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold text-stone-900 dark:text-stone-100">8. Bao dưới viết sau cùng</span>
              <p class="text-[11px] text-stone-500">Ví dụ: chữ Giá <strong>这</strong>, chữ Tiến <strong>进</strong></p>
            </div>
            <span class="font-chinese text-2xl font-black text-amber-700 dark:text-amber-400">这</span>
          </div>
        </div>
      </div>
    `
  },
  {
    day: 4,
    title: '10 Bộ Thủ Vàng (Mở Khóa 70% Chữ Sơ Cấp)',
    hanzi: '人木水火',
    pinyin: 'Rén mù shuǐ huǒ',
    meaning: 'Bộ thủ tượng hình',
    duration: '12 phút',
    badge: 'Chiết tự',
    icon: '🗝️',
    summary: 'Chiết tự thông minh: Nhìn bộ thủ đoán ngay nghĩa của chữ mà không cần tra từ điển.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 leading-relaxed">
          Chữ Hán là chữ <strong>tượng hình ghép logic</strong>! 10 bộ thủ dưới đây chiếm tới 70% các từ vựng bạn sẽ gặp trong HSK 1 - 2:
        </div>

        <div class="space-y-2">
          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-3">
            <span class="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950 text-[#8B1E1E] dark:text-red-400 font-chinese text-xl font-black flex items-center justify-center shrink-0">人/亻</span>
            <div>
              <strong>Bộ Nhân (Người):</strong> Chữ nào có bộ này đều liên quan đến con người. Ví dụ: <em>你 (bạn), 他 (anh ấy), 们 (chúng tôi)</em>.
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-3">
            <span class="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-chinese text-xl font-black flex items-center justify-center shrink-0">口</span>
            <div>
              <strong>Bộ Khẩu (Miệng):</strong> Hành động của miệng (nói, ăn, uống). Ví dụ: <em>吃 (ăn), 喝 (uống), 叫 (kêu/gọi)</em>.
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-3">
            <span class="w-9 h-9 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-400 font-chinese text-xl font-black flex items-center justify-center shrink-0">女</span>
            <div>
              <strong>Bộ Nữ (Phụ nữ):</strong> Phụ nữ, con gái, gia đình. Ví dụ: <em>好 (tốt = phụ nữ có con trai), 妈 (mẹ), 妹 (em gái)</em>.
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-3">
            <span class="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 font-chinese text-xl font-black flex items-center justify-center shrink-0">水/氵</span>
            <div>
              <strong>Bộ Thủy (3 chấm thủy - Nước):</strong> Chất lỏng, sông biển. Ví dụ: <em>海 (biển), 没 (không có/chìm), 河 (sông)</em>.
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-3">
            <span class="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-chinese text-xl font-black flex items-center justify-center shrink-0">木</span>
            <div>
              <strong>Bộ Mộc (Cây cối):</strong> Đồ gỗ, thiên nhiên. Ví dụ: <em>林 (rừng = 2 cây), 休 (nghỉ ngơi = người tựa vào cây)</em>.
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    day: 5,
    title: 'Số Đếm 1 - 10 & Tự Giới Thiệu Bản Thân',
    hanzi: '一二三四',
    pinyin: 'Yī èr sān sì',
    meaning: 'Số đếm & Tôi là ai',
    duration: '10 phút',
    badge: 'Thực chiến',
    icon: '🔢',
    summary: 'Đếm trôi chảy từ 1 đến 10 và nói được câu giới thiệu tên tuổi, quốc tịch.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <p class="font-bold text-stone-900 dark:text-stone-100">Bảng số đếm 1 đến 10 thần tốc:</p>

        <div class="grid grid-cols-5 gap-2 text-center">
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">一</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">yī (1)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">二</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">èr (2)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">三</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">sān (3)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">四</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">sì (4)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">五</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">wǔ (5)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">六</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">liù (6)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">七</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">qī (7)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">八</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">bā (8)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">九</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">jiǔ (9)</span>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span class="font-chinese text-lg font-bold block">十</span>
            <span class="text-xs text-[#8B1E1E] dark:text-amber-400 font-bold">shí (10)</span>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-white dark:from-stone-800 dark:to-stone-900 border border-amber-300 dark:border-stone-700 space-y-3">
          <p class="font-bold text-amber-900 dark:text-amber-300">Mẫu câu tự giới thiệu sống còn:</p>
          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold block text-stone-900 dark:text-stone-100">我叫... (Wǒ jiào...)</span>
              <span class="text-xs text-stone-500">Tôi tên là...</span>
            </div>
            <button onclick="playBeginnerAudio('我叫李明')" class="text-xs font-bold text-amber-700 dark:text-amber-400">🔊 Ví dụ mẫu</button>
          </div>
          <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span class="font-bold block text-stone-900 dark:text-stone-100">我是越南人。(Wǒ shì Yuènán rén.)</span>
              <span class="text-xs text-stone-500">Tôi là người Việt Nam.</span>
            </div>
            <button onclick="playBeginnerAudio('我是越南人')" class="text-xs font-bold text-amber-700 dark:text-amber-400">🔊 Nghe</button>
          </div>
        </div>
      </div>
    `
  },
  {
    day: 6,
    title: 'Giao Tiếp Thường Nhật (Cảm Ơn, Xin Lỗi, Tạm Biệt)',
    hanzi: '谢谢再见',
    pinyin: 'Xièxie zàijiàn',
    meaning: 'Cảm ơn & Tạm biệt',
    duration: '10 phút',
    badge: 'Giao tiếp',
    icon: '🤝',
    summary: 'Phản xạ tự nhiên các câu lịch sự cửa miệng của người Trung Quốc.',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[#8B1E1E] dark:text-amber-400">Cảm ơn & Trả lời</span>
              <button onclick="playBeginnerAudio('谢谢！不客气！')" class="text-xs font-bold text-sky-600 dark:text-sky-400">🔊 Nghe cặp câu</button>
            </div>
            <p><strong>A:</strong> 谢谢！ (Xièxie! - Cảm ơn!)</p>
            <p><strong>B:</strong> 不客气！ (Bú kèqi! - Đừng khách sáo!)</p>
          </div>

          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[#8B1E1E] dark:text-amber-400">Xin lỗi & Thứ lỗi</span>
              <button onclick="playBeginnerAudio('对不起！没关系！')" class="text-xs font-bold text-sky-600 dark:text-sky-400">🔊 Nghe cặp câu</button>
            </div>
            <p><strong>A:</strong> 对不起！ (Duìbuqǐ! - Xin lỗi!)</p>
            <p><strong>B:</strong> 没关系！ (Méi guānxi! - Không có chi/sao đâu!)</p>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
          <div>
            <span class="font-bold block text-stone-900 dark:text-stone-100">再见！ (Zàijiàn! - Tạm biệt / Hẹn gặp lại)</span>
            <span class="text-xs text-stone-500">Trong đó '再' là lại, '见' là gặp (Hẹn tái kiến).</span>
          </div>
          <button onclick="playBeginnerAudio('再见！')" class="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-xs cursor-pointer">🔊 Phát âm</button>
        </div>
      </div>
    `
  },
  {
    day: 7,
    title: 'Thử Thách Tốt Nghiệp & Nhận Huy Hiệu F0',
    hanzi: '毕业',
    pinyin: 'Bì yè',
    meaning: 'Tốt nghiệp nhập môn',
    duration: '8 phút',
    badge: 'Nhận cúp',
    icon: '🏆',
    summary: 'Trắc nghiệm 5 câu tổng hợp 7 ngày. Đạt >= 4 câu để nhận Huy hiệu F0 Graduate và +100 EXP!',
    contentHtml: `
      <div id="beginnerQuizContainer" class="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 leading-relaxed">
          🎯 <strong>Thử thách tốt nghiệp 7 Ngày:</strong> Trả lời đúng từ 4/5 câu hỏi dưới đây để mở khóa danh hiệu <strong>"Chiến Binh Nhập Môn Xuất Sắc"</strong> và tự tin bước vào Giáo trình Hán ngữ Quyển 1!
        </div>

        <form id="beginnerQuizForm" class="space-y-4" onsubmit="event.preventDefault(); submitBeginnerQuiz();">
          <!-- Câu 1 -->
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <p class="font-bold text-stone-900 dark:text-stone-100">1. Từ "Xin chào" trong tiếng Trung viết là gì?</p>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" value="A" required /> A. 谢谢 (Xièxie)</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" value="B" /> B. 你好 (Nǐ hǎo)</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" value="C" /> C. 再见 (Zàijiàn)</label>
            </div>
          </div>

          <!-- Câu 2 -->
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <p class="font-bold text-stone-900 dark:text-stone-100">2. Âm 'ü' trong tiếng Trung phát âm khẩu hình thế nào?</p>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q2" value="A" required /> A. Mở miệng thật rộng như chữ O</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q2" value="B" /> B. Tròn môi như đang huýt sáo và phát âm chữ i</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q2" value="C" /> C. Bẹt môi phát âm chữ E</label>
            </div>
          </div>

          <!-- Câu 3 -->
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <p class="font-bold text-stone-900 dark:text-stone-100">3. Chữ Thập (十) tuân theo quy tắc bút thuận nào?</p>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q3" value="A" required /> A. Nét ngang trước, nét sổ sau</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q3" value="B" /> B. Nét sổ trước, nét ngang sau</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q3" value="C" /> C. Viết tùy ý miễn thành hình chữ thập</label>
            </div>
          </div>

          <!-- Câu 4 -->
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <p class="font-bold text-stone-900 dark:text-stone-100">4. Bộ 口 (Khẩu) mang ý nghĩa liên quan đến gì?</p>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q4" value="A" required /> A. Cây cối và núi non</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q4" value="B" /> B. Nước và chất lỏng</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q4" value="C" /> C. Miệng và các hành động ăn, nói, gọi</label>
            </div>
          </div>

          <!-- Câu 5 -->
          <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <p class="font-bold text-stone-900 dark:text-stone-100">5. Câu "Tôi là người Việt Nam" nói như thế nào?</p>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q5" value="A" required /> A. 我是越南人。(Wǒ shì Yuènán rén.)</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q5" value="B" /> B. 我叫中国人。(Wǒ jiào Zhōngguó rén.)</label>
              <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q5" value="C" /> C. 谢谢越南。(Xièxie Yuènán.)</label>
            </div>
          </div>

          <div class="pt-2 text-center">
            <button type="submit" class="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:opacity-95 text-stone-900 font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer">
              Hoàn Thành & Chấm Điểm Ngay (🎯)
            </button>
          </div>
        </form>
      </div>
    `
  }
];

if (typeof window !== 'undefined') {
  window.BEGINNER_CURRICULUM = BEGINNER_CURRICULUM;
}

// State
let activeBeginnerDay = 1;

/** Get learner mode ('beginner' or 'all'). Defaults to 'beginner' for new visitors! */
function getLearnerMode() {
  return storage.get(LEARNER_MODE_KEY, 'beginner');
}

/** Set learner mode and toggle UI filtering */
function setLearnerMode(mode) {
  const targetMode = mode === 'all' ? 'all' : 'beginner';
  storage.set(LEARNER_MODE_KEY, targetMode);
  applyLearnerModeUI(targetMode);
  if (typeof showToast === 'function') {
    if (targetMode === 'beginner') {
      showToast('Đã bật Chế độ Nhập Môn F0: Tối giản giao diện, nổi bật lộ trình 7 ngày!', 'success');
    } else {
      showToast('Đã bật Chế độ Toàn Diện: Hiển thị đầy đủ mọi công cụ HSK 1 - 6!', 'info');
    }
  }
}

/** Apply classes and button active states for learner mode */
function applyLearnerModeUI(mode) {
  const btnBeginner = document.getElementById('btnModeBeginner');
  const btnAll = document.getElementById('btnModeAll');
  const advancedCards = document.querySelectorAll('.mode-advanced-feature');

  if (btnBeginner && btnAll) {
    if (mode === 'beginner') {
      btnBeginner.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-emerald-600 text-white shadow-2xs cursor-pointer';
      btnAll.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer';
    } else {
      btnAll.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-sky-600 text-white shadow-2xs cursor-pointer';
      btnBeginner.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer';
    }
  }

  // Visual highlight or badge for advanced features when in beginner mode
  advancedCards.forEach(el => {
    if (mode === 'beginner') {
      el.classList.add('opacity-85');
    } else {
      el.classList.remove('opacity-85');
    }
  });
}

/** Initialize learner mode on app start */
function initLearnerMode() {
  const currentMode = getLearnerMode();
  applyLearnerModeUI(currentMode);
}

/** Get beginner 7-day progress */
function getBeginnerProgress() {
  const def = { completedDays: [], currentDay: 1, graduateBadge: false };
  return storage.get(BEGINNER_7DAYS_KEY, def);
}

/** Save beginner progress */
function saveBeginnerProgress(prog) {
  storage.set(BEGINNER_7DAYS_KEY, prog);
  // Also queue for cloud sync
  if (typeof queueProgressPush === 'function') {
    queueProgressPush();
  }
}

/** Play audio with TTS */
function playBeginnerAudio(text) {
  if (typeof playPronunciation === 'function') {
    playPronunciation(text);
  } else if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }
}

/** Render the 7-day golden path grid in the Home tab */
function renderBeginnerGoldenPath() {
  const container = document.getElementById('beginner7DaysGrid');
  const progressEl = document.getElementById('beginner7DaysProgress');
  const percentEl = document.getElementById('beginner7DaysPercent');
  if (!container) return;

  const prog = getBeginnerProgress();
  const completedCount = prog.completedDays.length;
  const pct = Math.round((completedCount / 7) * 100);

  if (progressEl) progressEl.style.width = `${pct}%`;
  if (percentEl) percentEl.textContent = `${completedCount}/7 ngày (${pct}%)`;

  let html = '';
  BEGINNER_CURRICULUM.forEach((item) => {
    const isCompleted = prog.completedDays.includes(item.day);
    const isCurrent = prog.currentDay === item.day || (!isCompleted && prog.completedDays.length === item.day - 1);

    let borderClass = 'border-stone-200 dark:border-stone-700';
    let bgClass = 'bg-white dark:bg-[#161B22]';
    let badgeText = item.badge;
    let badgeClass = 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300';

    if (isCompleted) {
      borderClass = 'border-emerald-300 dark:border-emerald-700/80';
      bgClass = 'bg-emerald-50/50 dark:bg-emerald-950/20';
      badgeText = 'Đã hoàn thành ✓';
      badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold';
    } else if (isCurrent) {
      borderClass = 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-300/40';
      bgClass = 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 dark:from-stone-800 dark:to-[#161B22]';
      badgeText = 'Bài học hôm nay ⚡';
      badgeClass = 'bg-gradient-to-r from-[#8B1E1E] to-rose-700 text-white font-bold shadow-2xs';
    }

    html += `
      <div 
        onclick="openBeginnerDayModal(${item.day})" 
        class="group glass-card rounded-2xl p-4 border-2 ${borderClass} ${bgClass} hover:border-[#8B1E1E] dark:hover:border-amber-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-base flex items-center justify-center shrink-0">
              ${item.icon}
            </span>
            <span class="text-xs font-bold text-stone-900 dark:text-stone-100 font-serif-luxury">
              Ngày ${item.day}
            </span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full ${badgeClass}">
            ${badgeText}
          </span>
        </div>

        <div>
          <h4 class="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 group-hover:text-[#8B1E1E] dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            ${item.title}
          </h4>
          <p class="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            ${item.summary}
          </p>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80 text-[11px]">
          <span class="text-stone-400 flex items-center gap-1 font-medium">
            <span>⏱️</span> ${item.duration}
          </span>
          <span class="font-bold text-[#8B1E1E] dark:text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
            ${isCompleted ? 'Ôn lại' : 'Vào học'} →
          </span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/** Open full modal for a specific day */
function openBeginnerDayModal(dayNum) {
  const item = BEGINNER_CURRICULUM.find(x => x.day === dayNum);
  if (!item) return;

  activeBeginnerDay = dayNum;
  const modal = document.getElementById('beginnerDayModal');
  const titleEl = document.getElementById('beginnerModalTitle');
  const badgeEl = document.getElementById('beginnerModalBadge');
  const contentEl = document.getElementById('beginnerModalContent');
  const actionBtn = document.getElementById('beginnerModalActionBtn');

  if (!modal || !titleEl || !contentEl) return;

  titleEl.innerHTML = `<span class="text-[#8B1E1E] dark:text-amber-400">Ngày ${item.day}:</span> ${item.title}`;
  if (badgeEl) badgeEl.textContent = `⏱️ ${item.duration} • ${item.badge}`;
  contentEl.innerHTML = item.contentHtml;

  const prog = getBeginnerProgress();
  const isCompleted = prog.completedDays.includes(dayNum);

  if (actionBtn) {
    if (dayNum === 7) {
      actionBtn.style.display = 'none'; // Quiz handles submission
    } else {
      actionBtn.style.display = 'inline-flex';
      if (isCompleted) {
        actionBtn.innerHTML = '<span>Đã Hoàn Thành (✓)</span>';
        actionBtn.className = 'px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs cursor-pointer';
      } else {
        actionBtn.innerHTML = '<span>Hoàn Thành Bài Học (+25 EXP) ✓</span>';
        actionBtn.className = 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-rose-700 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer';
      }
    }
  }

  modal.classList.remove('hidden');
  if (document.body && document.body.classList) {
    document.body.classList.add('overflow-hidden');
  }
}

/** Close modal */
function closeBeginnerDayModal() {
  const modal = document.getElementById('beginnerDayModal');
  if (modal) modal.classList.add('hidden');
  if (document.body && document.body.classList) {
    document.body.classList.remove('overflow-hidden');
  }
}

/** Complete a day's study */
function completeActiveBeginnerDay() {
  const dayNum = activeBeginnerDay;
  const prog = getBeginnerProgress();

  if (!prog.completedDays.includes(dayNum)) {
    prog.completedDays.push(dayNum);
    if (prog.currentDay <= dayNum && dayNum < 7) {
      prog.currentDay = dayNum + 1;
    }
    saveBeginnerProgress(prog);

    // Add EXP
    if (typeof addExp === 'function') {
      addExp(25, `Hoàn thành Ngày ${dayNum} Nhập Môn Tiếng Trung`);
    }

    if (typeof showToast === 'function') {
      showToast(`Xuất sắc! Bạn đã hoàn thành Ngày ${dayNum} và nhận +25 EXP! 🎉`, 'success');
    }
  }

  closeBeginnerDayModal();
  renderBeginnerGoldenPath();
}

/** Submit Day 7 Final Quiz */
function submitBeginnerQuiz() {
  const form = document.getElementById('beginnerQuizForm');
  if (!form) return;

  const data = new FormData(form);
  const q1 = data.get('q1');
  const q2 = data.get('q2');
  const q3 = data.get('q3');
  const q4 = data.get('q4');
  const q5 = data.get('q5');

  let score = 0;
  if (q1 === 'B') score++;
  if (q2 === 'B') score++;
  if (q3 === 'A') score++;
  if (q4 === 'C') score++;
  if (q5 === 'A') score++;

  const container = document.getElementById('beginnerQuizContainer');
  if (!container) return;

  const passed = score >= 4;

  if (passed) {
    const prog = getBeginnerProgress();
    if (!prog.completedDays.includes(7)) {
      prog.completedDays.push(7);
      prog.graduateBadge = true;
      saveBeginnerProgress(prog);
      if (typeof addExp === 'function') {
        addExp(100, 'Tốt nghiệp Lộ trình Nhập môn 7 Ngày');
      }
    }

    container.innerHTML = `
      <div class="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-emerald-50 dark:from-stone-900 dark:to-stone-800 border-2 border-amber-400 text-center space-y-4 animate-fade-in">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center text-3xl font-bold shadow-md">
          🏆
        </div>
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">CHÚC MỪNG BẠN ĐÃ TỐT NGHIỆP!</span>
          <h3 class="text-xl font-black text-stone-900 dark:text-stone-100 font-serif-luxury mt-1">
            Chiến Binh Nhập Môn Xuất Sắc (F0 Graduate)
          </h3>
          <p class="text-xs text-stone-600 dark:text-stone-400 mt-2 max-w-md mx-auto">
            Bạn đạt <strong>${score}/5 câu đúng</strong>! Bạn đã nắm vững 4 thanh điệu, quy tắc bút thuận và các câu giao tiếp cơ bản. Bạn đã nhận <strong>+100 EXP</strong>!
          </p>
        </div>

        <div class="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300">
          🚀 <strong>Bước tiếp theo:</strong> Bắt đầu bài số 1 của <em>Giáo Trình Hán Ngữ Quyển 1</em> hoặc thử sức với <em>Flashcard HSK 1</em>!
        </div>

        <div class="flex items-center justify-center gap-3 pt-2">
          <button onclick="closeBeginnerDayModal(); switchTab('jiaocheng');" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-rose-700 text-white font-bold text-xs shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all">
            Học Giáo Trình Hán Ngữ 1 →
          </button>
          <button onclick="closeBeginnerDayModal();" class="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 font-bold text-xs cursor-pointer">
            Đóng
          </button>
        </div>
      </div>
    `;

    renderBeginnerGoldenPath();
  } else {
    if (typeof showToast === 'function') {
      showToast(`Bạn đúng ${score}/5 câu. Cần đạt ít nhất 4/5 câu. Hãy xem lại bài học và thử lại nhé!`, 'warning');
    }
    // Highlight questions
  }
}

/** Trigger AI tutor to welcome beginner */
function triggerBeginnerAiWelcome() {
  if (typeof openFloatingAssistant === 'function') {
    openFloatingAssistant();
  }
  // If assistant has input, prefill it or send beginner message
  const input = document.getElementById('floatingAiInput');
  if (input) {
    input.value = 'Em là người mới bắt đầu, hãy hướng dẫn em cách phát âm thanh điệu và học bài đầu tiên với!';
    if (typeof handleFloatingAiSend === 'function') {
      handleFloatingAiSend();
    }
  }
}
