/**
 * cheer_comfort.js
 * Chế độ Khuyến Khích & An Ủi Người Dùng Khi Hoàn Thành Bài
 * YUHAN HSK - Chinese Daily
 */

let cheerComfortQuotes = null;
let audioCtx = null;

// -------------------------------------------------------------
// 1. Audio Synthesis (Victory Chime & Gentle Comforting Chord)
// -------------------------------------------------------------
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

window.playCheerAudioChime = function () {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Arpeggio)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.65);
    });
  } catch (e) {
    console.warn('Audio chime unsupported or blocked:', e);
  }
};

window.playComfortAudioChime = function () {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [349.23, 440.00, 523.25, 698.46]; // F4, A4, C5, F5 (Gentle soothing chord)
    notes.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
    });
  } catch (e) {
    console.warn('Audio comfort unsupported or blocked:', e);
  }
};

// -------------------------------------------------------------
// 2. Canvas Confetti & Healing Petals Animation
// -------------------------------------------------------------
function startCanvasCelebration(isVictory) {
  let canvas = document.getElementById('cheerComfortCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'cheerComfortCanvas';
    canvas.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 9999999; width: 100vw; height: 100vh;';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = isVictory ? 75 : 45;
  const colors = isVictory
    ? ['#D4AF37', '#8B0000', '#FFD700', '#FF4D4F', '#52C41A', '#1890FF']
    : ['#EADBC8', '#D4AF37', '#87D068', '#FFA39E', '#B7EB8F', '#FFE58F'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: isVictory ? -20 - Math.random() * 50 : Math.random() * (canvas.height * 0.3),
      r: isVictory ? Math.random() * 6 + 4 : Math.random() * 5 + 3,
      dx: (Math.random() - 0.5) * (isVictory ? 4 : 2),
      dy: Math.random() * (isVictory ? 3 : 1.5) + 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      shape: isVictory ? (Math.random() > 0.5 ? 'rect' : 'circle') : (Math.random() > 0.6 ? 'heart' : 'circle'),
      spin: Math.random() * 0.2
    });
  }

  let animationFrame;
  let startTime = Date.now();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;
    if (elapsed > 3500) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      return;
    }

    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha * (1 - elapsed / 3500));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.shape === 'rect') {
        ctx.fillRect(p.x, p.y, p.r * 1.5, p.r);
      } else if (p.shape === 'heart') {
        // Draw little heart
        const size = p.r * 1.2;
        ctx.arc(p.x - size / 4, p.y, size / 4, Math.PI, 0, false);
        ctx.arc(p.x + size / 4, p.y, size / 4, Math.PI, 0, false);
        ctx.lineTo(p.x, p.y + size / 2);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      p.x += p.dx;
      p.y += p.dy;
    });

    animationFrame = requestAnimationFrame(draw);
  }

  draw();
}

// -------------------------------------------------------------
// 3. Data Loader & Quote Picker
// -------------------------------------------------------------
async function loadCheerQuotes() {
  if (cheerComfortQuotes) return cheerComfortQuotes;
  try {
    const res = await fetch('/data/cheer_comfort_quotes.json');
    if (res.ok) {
      cheerComfortQuotes = await res.json();
      return cheerComfortQuotes;
    }
  } catch (e) {
    console.error('Không thể nạp dữ liệu danh ngôn khuyến khích:', e);
  }
  return null;
}

function pickRandomQuote(list) {
  if (!Array.isArray(list) || !list.length) {
    return {
      chinese: "千里之行，始于足下。",
      pinyin: "Qiānlǐ zhī xíng, shǐ yú zú xià.",
      vietnamese: "Hành trình vạn dặm khởi đầu từ một bước chân.",
      message: "Bạn đã rất kiên trì và hoàn thành trọn vẹn bài hôm nay!"
    };
  }
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

// -------------------------------------------------------------
// 4. Modal Engine: showCheerOrComfortModal
// -------------------------------------------------------------
window.showCheerOrComfortModal = async function (opts = {}) {
  const data = await loadCheerQuotes();
  const score = Number(opts.score) || 0;
  const maxScore = Number(opts.maxScore) || 100;
  const pct = opts.percentage !== undefined ? Number(opts.percentage) : Math.round((score / Math.max(1, maxScore)) * 100);
  const isPassed = opts.isPassed !== undefined ? Boolean(opts.isPassed) : pct >= 65;
  const type = opts.type || 'bài tập';

  const category = isPassed ? 'encouragement' : 'comfort';
  const categoryData = (data && data[category]) || {};
  const quote = pickRandomQuote(categoryData.quotes);

  // Sound & Particle celebration
  if (isPassed) {
    window.playCheerAudioChime();
    startCanvasCelebration(true);
    if (window.playChineseTTS && categoryData.audioChinese) {
      setTimeout(() => window.playChineseTTS(categoryData.audioChinese, 'female'), 400);
    }
  } else {
    window.playComfortAudioChime();
    startCanvasCelebration(false);
    if (window.playChineseTTS && categoryData.audioChinese) {
      setTimeout(() => window.playChineseTTS(categoryData.audioChinese, 'female'), 400);
    }
  }

  // Bonus EXP award
  const expReward = isPassed ? 50 : 30;
  try {
    const raw = localStorage.getItem('yh_student_progress');
    const p = raw ? JSON.parse(raw) : {};
    p.exp = (p.exp || 0) + expReward;
    localStorage.setItem('yh_student_progress', JSON.stringify(p));
    if (window.addExp) window.addExp(expReward, isPassed ? 'Thành tích xuất sắc' : 'Bảo hiểm an ủi nỗ lực');
  } catch (e) {}

  let modal = document.getElementById('cheerComfortModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cheerComfortModal';
    modal.style.cssText = 'position: fixed; inset: 0; z-index: 99999999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.75); backdrop-filter: blur(5px); padding: 1rem; font-family: inherit;';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background: #FFFDF9; border: 2px solid ${isPassed ? '#D4AF37' : '#8B0000'}; border-radius: 1.5rem; max-width: 620px; width: 100%; box-shadow: 0 25px 60px rgba(0,0,0,0.4); overflow: hidden; display: flex; flex-direction: column; animation: cheerModalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
      
      <!-- Modal Header -->
      <div style="background: ${isPassed ? 'linear-gradient(135deg, #10B981 0%, #047857 100%)' : 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)'}; color: #FFF; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D4AF37;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.75rem;">${isPassed ? '🏆' : '🍵'}</span>
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0; letter-spacing: 0.5px; text-transform: uppercase;">
              ${isPassed ? 'KHUYẾN KHÍCH & VINH DANH THÀNH TÍCH' : 'TIẾP SỨC & AN ỦI ĐỒNG HÀNH'}
            </h3>
            <p style="font-size: 0.8rem; margin: 0.2rem 0 0 0; opacity: 0.95;">
              ${isPassed ? 'Bạn đã hoàn thành xuất sắc mục tiêu học tập hôm nay!' : 'Đừng nản lòng, học tiếng Trung là một hành trình kỳ diệu!'}
            </p>
          </div>
        </div>
        <button onclick="closeCheerComfortModal()" style="background: rgba(255,255,255,0.2); border: none; color: #FFF; font-size: 1.2rem; cursor: pointer; border-radius: 9999px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; line-height: 1;">✕</button>
      </div>

      <!-- Modal Body -->
      <div style="padding: 1.5rem; overflow-y: auto; max-height: 75vh; space-y-4;">
        
        <!-- Result KPI Strip -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; background: ${isPassed ? '#ECFDF5' : '#FFF5F5'}; border: 1px solid ${isPassed ? '#A7F3D0' : '#FECACA'}; border-radius: 1rem; padding: 1rem; text-align: center; margin-bottom: 1.25rem;">
          <div>
            <div style="font-size: 0.75rem; color: #666; font-weight: 700; text-transform: uppercase;">Kết Quả</div>
            <div style="font-size: 1.4rem; font-weight: 900; color: ${isPassed ? '#059669' : '#DC2626'}; font-family: monospace;">${score} / ${maxScore}</div>
            <div style="font-size: 0.75rem; font-weight: 700; color: ${isPassed ? '#047857' : '#991B1B'};">${pct}% Độ chính xác</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: #666; font-weight: 700; text-transform: uppercase;">Phần Thưởng</div>
            <div style="font-size: 1.4rem; font-weight: 900; color: #D4AF37; font-family: monospace;">+${expReward} EXP</div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #8B4513;">${isPassed ? '⭐ Vinh danh nỗ lực' : '🛡️ Bảo hiểm an ủi'}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: #666; font-weight: 700; text-transform: uppercase;">Trạng Thái</div>
            <div style="font-size: 1.2rem; font-weight: 900; color: ${isPassed ? '#059669' : '#8B0000'}; margin-top: 0.15rem;">
              ${isPassed ? 'ĐẠT CHUẨN ✅' : 'CHỜ BỨT PHÁ 🚀'}
            </div>
            <div style="font-size: 0.75rem; color: #666;">${opts.level || 'HSK'}</div>
          </div>
        </div>

        <!-- Oriental Quote Card (Thư Họa Danh Ngôn) -->
        <div style="background: #FFFDF7; border: 2px solid #E8DCB8; border-radius: 1rem; padding: 1.25rem; position: relative; box-shadow: 0 4px 12px rgba(139, 0, 0, 0.05); margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #8B0000; background: #FEE2E2; padding: 0.2rem 0.6rem; border-radius: 9999px;">
              🏮 ${isPassed ? 'Lời Khen Khích Lệ' : 'Lời Vỗ Về Tâm Lý'}
            </span>
            <button onclick="playChineseTTS(${JSON.stringify(quote.chinese)}, 'female')" style="background: #FDF6E2; border: 1px solid #D4AF37; color: #8B4513; border-radius: 0.5rem; padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.3rem;">
              🔊 Nghe câu này
            </button>
          </div>

          <div style="font-size: 1.25rem; font-weight: 800; color: #8B0000; font-family: 'Noto Serif SC', serif; margin-bottom: 0.25rem; line-height: 1.4;">
            ${quote.chinese}
          </div>
          <div style="font-size: 0.85rem; font-style: italic; color: #8B4513; margin-bottom: 0.4rem;">
            ${quote.pinyin}
          </div>
          <div style="font-size: 0.85rem; font-weight: 600; color: #2C1810; margin-bottom: 0.75rem; border-left: 3px solid #D4AF37; padding-left: 0.6rem;">
            "${quote.vietnamese}"
          </div>
          
          <div style="background: rgba(212, 175, 55, 0.1); border-radius: 0.75rem; padding: 0.85rem; font-size: 0.875rem; line-height: 1.6; color: #374151;">
            ${isPassed ? `
              🎉 <strong>Tán dương:</strong> ${quote.message}
              <br/><span style="color: #047857; font-size: 0.8rem; font-weight: 600;">Gợi ý: Hãy tiếp tục giải thêm 1 bài nữa để giữ chuỗi ngày học thăng hoa nhé!</span>
            ` : `
              ❤️ <strong>Vỗ về & Tiếp sức:</strong> ${quote.message}
              <br/><span style="color: #8B0000; font-size: 0.8rem; font-weight: 600;">Gợi ý: Đừng vội nản lòng. Bạn hãy bấm vào nút xem lại các câu sai để xem lời giải chi tiết và cách ghi nhớ nhé!</span>
            `}
          </div>
        </div>

        <!-- Encouragement Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
          ${!isPassed && typeof opts.onReviewMistakes === 'function' ? `
            <button id="cheerReviewBtn" style="background: #FFF; border: 2px solid #8B0000; color: #8B0000; padding: 0.75rem 1rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s;">
              <span>💡 Xem Chi Tiết Từng Câu Sai & Mẹo Ghi Nhớ</span>
            </button>
          ` : ''}

          <div style="display: flex; gap: 0.75rem;">
            ${typeof opts.onRetry === 'function' ? `
              <button id="cheerRetryBtn" style="flex: 1; background: #F3F4F6; border: 1px solid #D1D5DB; color: #374151; padding: 0.75rem 1rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <span>🔄 Làm Lại (Không tính điểm)</span>
              </button>
            ` : ''}

            <button id="cheerContinueBtn" style="flex: 1; background: ${isPassed ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #8B0000, #A52A2A)'}; border: none; color: #FFF; padding: 0.75rem 1.25rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 12px ${isPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(139, 0, 0, 0.25)'};">
              <span>${isPassed ? 'Tiếp Tục Bài Học Mới →' : 'Đã Hiểu & Tiếp Tục Cố Gắng ❤️'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  `;

  modal.style.display = 'flex';

  // Attach button events
  const reviewBtn = document.getElementById('cheerReviewBtn');
  if (reviewBtn) {
    reviewBtn.onclick = () => {
      closeCheerComfortModal();
      if (typeof opts.onReviewMistakes === 'function') opts.onReviewMistakes();
    };
  }

  const retryBtn = document.getElementById('cheerRetryBtn');
  if (retryBtn) {
    retryBtn.onclick = () => {
      closeCheerComfortModal();
      if (typeof opts.onRetry === 'function') opts.onRetry();
    };
  }

  const continueBtn = document.getElementById('cheerContinueBtn');
  if (continueBtn) {
    continueBtn.onclick = () => {
      closeCheerComfortModal();
      if (typeof opts.onContinue === 'function') opts.onContinue();
    };
  }
};

window.closeCheerComfortModal = function () {
  const modal = document.getElementById('cheerComfortModal');
  if (modal) modal.style.display = 'none';
};

window.setCompanionMode = function (mode) {
  localStorage.setItem('yh_cheer_comfort_mode', mode || 'gentle');
  if (typeof showToast === 'function') {
    const label = mode === 'gentle' ? 'Dịu dàng & Vỗ về (Ấm áp)' : (mode === 'energetic' ? 'Hừng hực khí thế (Thúc đẩy)' : 'Trầm tĩnh & Trí tuệ (Triết lý)');
    showToast(`Đã lưu phong cách đồng hành: ${label}`, 'success');
  }
};

window.getCompanionMode = function () {
  return localStorage.getItem('yh_cheer_comfort_mode') || 'gentle';
};
