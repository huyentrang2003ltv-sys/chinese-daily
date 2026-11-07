/**
 * placement_test.js
 * 1. Đánh giá năng lực đầu vào 15 phút (Placement Test) & Tư vấn cấp độ phù hợp
 * 2. Cảnh báo khóa tài khoản tạm thời khi không học quá 3 ngày liên tục
 * 3. Chế độ tự động nhắc nhở học bài mỗi ngày cho tài khoản VIP
 */

let placementData = null;
let currentPlacementState = {
  questions: [],
  currentIndex: 0,
  answers: {},
  timerInterval: null,
  remainingSeconds: 15 * 60,
  startTime: null
};

// -------------------------------------------------------------
// 1. Placement Test Engine
// -------------------------------------------------------------
async function loadPlacementData() {
  if (placementData) return placementData;
  try {
    const res = await fetch('/data/placement_test.json');
    if (res.ok) {
      placementData = await res.json();
      return placementData;
    }
  } catch (err) {
    console.error('Không thể tải đề đánh giá năng lực:', err);
  }
  return null;
}

window.openPlacementTestModal = async function () {
  const data = await loadPlacementData();
  if (!data) {
    if (window.showToast) window.showToast('Không thể tải bài kiểm tra, vui lòng thử lại sau!', 'error');
    return;
  }

  currentPlacementState.questions = data.questions || [];
  currentPlacementState.currentIndex = 0;
  currentPlacementState.answers = {};
  currentPlacementState.remainingSeconds = (data.durationMinutes || 15) * 60;

  let modal = document.getElementById('placementTestModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'placementTestModal';
    modal.style.cssText = 'position: fixed; inset: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 1rem;';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background: #FFFDF9; border: 2px solid #D4AF37; border-radius: 1.25rem; max-width: 720px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(139, 0, 0, 0.25); overflow: hidden; font-family: inherit;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #8B0000 0%, #5B0000 100%); color: #FFF8DC; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D4AF37;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.25rem;">📝</span>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0; letter-spacing: 0.5px;">BÀI ĐÁNH GIÁ NĂNG LỰC ĐẦU VÀO</h3>
          </div>
          <p style="font-size: 0.8rem; margin: 0.25rem 0 0 0; opacity: 0.9;">15 Phút • Đánh giá HSK 1 - 4 • Tư vấn lộ trình tránh chán nản</p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div id="placementTimerBadge" style="background: rgba(0,0,0,0.4); border: 1px solid #D4AF37; padding: 0.4rem 0.8rem; border-radius: 9999px; font-weight: 700; font-size: 0.95rem; color: #FFD700; font-family: monospace;">
            ⏱️ 15:00
          </div>
          <button onclick="closePlacementTestModal()" style="background: none; border: none; color: #FFF8DC; font-size: 1.5rem; cursor: pointer; line-height: 1; padding: 0.25rem;" title="Đóng">✕</button>
        </div>
      </div>

      <!-- Question & Content Body -->
      <div id="placementModalBody" style="padding: 1.5rem; overflow-y: auto; flex: 1;">
        <!-- Rendered by renderPlacementQuestion() -->
      </div>

      <!-- Footer navigation -->
      <div id="placementModalFooter" style="background: #FDF6E2; padding: 1rem 1.5rem; border-top: 1px solid #E6D5AC; display: flex; justify-content: space-between; align-items: center;">
        <!-- Rendered by renderPlacementFooter() -->
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  startPlacementTimer();
  renderPlacementQuestion();
};

window.closePlacementTestModal = function () {
  if (currentPlacementState.timerInterval) {
    clearInterval(currentPlacementState.timerInterval);
    currentPlacementState.timerInterval = null;
  }
  const modal = document.getElementById('placementTestModal');
  if (modal) modal.style.display = 'none';
};

function startPlacementTimer() {
  if (currentPlacementState.timerInterval) clearInterval(currentPlacementState.timerInterval);
  currentPlacementState.timerInterval = setInterval(() => {
    currentPlacementState.remainingSeconds--;
    const badge = document.getElementById('placementTimerBadge');
    if (badge) {
      const mins = Math.floor(currentPlacementState.remainingSeconds / 60);
      const secs = currentPlacementState.remainingSeconds % 60;
      badge.textContent = `⏱️ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (currentPlacementState.remainingSeconds <= 120) {
        badge.style.color = '#FF4D4F';
        badge.style.borderColor = '#FF4D4F';
      }
    }
    if (currentPlacementState.remainingSeconds <= 0) {
      clearInterval(currentPlacementState.timerInterval);
      submitPlacementTest(true);
    }
  }, 1000);
}

function renderPlacementQuestion() {
  const body = document.getElementById('placementModalBody');
  const footer = document.getElementById('placementModalFooter');
  if (!body || !footer) return;

  const idx = currentPlacementState.currentIndex;
  const q = currentPlacementState.questions[idx];
  if (!q) return;

  const answeredCount = Object.keys(currentPlacementState.answers).length;
  const total = currentPlacementState.questions.length;
  const progressPct = Math.round(((idx + 1) / total) * 100);

  body.innerHTML = `
    <!-- Progress bar -->
    <div style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: #8B4513; margin-bottom: 0.4rem;">
        <span>Câu ${idx + 1} / ${total} (${q.level || 'HSK'})</span>
        <span>Đã làm: ${answeredCount}/${total}</span>
      </div>
      <div style="height: 6px; background: #EADBC8; border-radius: 9999px; overflow: hidden;">
        <div style="width: ${progressPct}%; height: 100%; background: linear-gradient(90deg, #D4AF37, #8B0000); transition: width 0.3s ease;"></div>
      </div>
    </div>

    <!-- Question content -->
    <div style="background: #FFF; border: 1px solid #EADBC8; border-radius: 1rem; padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);">
      <span style="display: inline-block; background: #8B0000; color: #FFF; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 0.35rem; margin-bottom: 0.6rem;">${q.level}</span>
      <h4 style="font-size: 1.05rem; font-weight: 700; color: #2C1810; margin: 0 0 0.5rem 0; line-height: 1.5;">${q.question}</h4>
    </div>

    <!-- Options -->
    <div style="display: flex; flex-direction: column; gap: 0.65rem;">
      ${q.options.map((opt, optIdx) => {
        const isSelected = currentPlacementState.answers[q.id] === optIdx;
        return `
          <button onclick="selectPlacementOption(${q.id}, ${optIdx})" style="text-align: left; background: ${isSelected ? '#FFF8DC' : '#FFFFFF'}; border: 2px solid ${isSelected ? '#8B0000' : '#E8DCB8'}; color: #2C1810; padding: 0.85rem 1.15rem; border-radius: 0.75rem; font-size: 0.95rem; font-weight: ${isSelected ? '700' : '500'}; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: space-between;">
            <span>${opt}</span>
            <span style="font-size: 1.1rem;">${isSelected ? '✓' : '○'}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;

  footer.innerHTML = `
    <button onclick="navPlacementQuestion(-1)" ${idx === 0 ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : 'style="cursor: pointer;"'} class="px-4 py-2 rounded-lg bg-stone-200 text-stone-700 font-semibold text-sm">
      ← Câu trước
    </button>
    <div style="display: flex; gap: 0.5rem;">
      ${idx < total - 1 ? `
        <button onclick="navPlacementQuestion(1)" style="cursor: pointer; background: #8B0000; color: #FFF; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; border: none;">
          Câu tiếp →
        </button>
      ` : `
        <button onclick="submitPlacementTest(false)" style="cursor: pointer; background: linear-gradient(135deg, #10B981, #059669); color: #FFF; padding: 0.5rem 1.5rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; border: none; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);">
          Hoàn Thành & Xem Tư Vấn
        </button>
      `}
    </div>
  `;
}

window.selectPlacementOption = function (qId, optIdx) {
  currentPlacementState.answers[qId] = optIdx;
  renderPlacementQuestion();
};

window.navPlacementQuestion = function (step) {
  const nextIdx = currentPlacementState.currentIndex + step;
  if (nextIdx >= 0 && nextIdx < currentPlacementState.questions.length) {
    currentPlacementState.currentIndex = nextIdx;
    renderPlacementQuestion();
  }
};

window.submitPlacementTest = function (autoExpired = false) {
  if (currentPlacementState.timerInterval) {
    clearInterval(currentPlacementState.timerInterval);
    currentPlacementState.timerInterval = null;
  }

  let correctCount = 0;
  const questions = currentPlacementState.questions;
  questions.forEach(q => {
    if (currentPlacementState.answers[q.id] === q.correct) correctCount++;
  });

  const total = questions.length;
  const pct = Math.round((correctCount / total) * 100);

  let recKey = 'hsk1';
  if (correctCount >= 13) recKey = 'hsk4';
  else if (correctCount >= 10) recKey = 'hsk3';
  else if (correctCount >= 6) recKey = 'hsk2';

  const rec = (placementData && placementData.recommendations && placementData.recommendations[recKey]) || {
    level: 'HSK 1',
    badge: '🌱 Nhập môn',
    advice: 'Bắt đầu vững vàng từ bảng Pinyin và HSK 1!',
    targetTab: 'pinyin'
  };

  // Sync to user progress
  try {
    const raw = localStorage.getItem('yh_student_progress');
    const p = raw ? JSON.parse(raw) : {};
    p.placementTest = {
      completedAt: new Date().toISOString(),
      score: correctCount,
      total,
      pct,
      recommendedLevel: rec.level,
      targetTab: rec.targetTab
    };
    p.exp = (p.exp || 0) + 100; // Reward 100 EXP for completing test
    localStorage.setItem('yh_student_progress', JSON.stringify(p));

    // Also push to server if logged in
    fetch('/api/me/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    }).catch(() => {});
  } catch (e) {
    console.error('Error saving placement test progress:', e);
  }

  // Trigger Cheer or Comfort Modal
  if (typeof window.showCheerOrComfortModal === 'function') {
    setTimeout(() => {
      window.showCheerOrComfortModal({
        type: 'placement',
        level: rec.level,
        score: correctCount,
        maxScore: total,
        percentage: pct,
        isPassed: pct >= 50
      });
    }, 300);
  }

  const body = document.getElementById('placementModalBody');
  const footer = document.getElementById('placementModalFooter');
  if (!body || !footer) return;

  body.innerHTML = `
    <div style="text-align: center; padding: 1.5rem 1rem;">
      <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
      <h3 style="font-size: 1.35rem; font-weight: 800; color: #8B0000; margin: 0 0 0.5rem 0;">KẾT QUẢ ĐÁNH GIÁ NĂNG LỰC</h3>
      <p style="font-size: 0.875rem; color: #555; margin: 0 0 1.25rem 0;">${autoExpired ? 'Hết 15 phút làm bài!' : 'Bạn đã xuất sắc hoàn thành bài test đầu vào!'}</p>

      <!-- Score Box -->
      <div style="background: #FFF8DC; border: 2px dashed #D4AF37; border-radius: 1rem; padding: 1.25rem; margin-bottom: 1.5rem; display: inline-block; min-width: 260px;">
        <div style="font-size: 2.25rem; font-weight: 900; color: #8B0000; font-family: monospace;">${correctCount} / ${total}</div>
        <div style="font-size: 0.9rem; font-weight: 700; color: #8B4513;">Đạt ${pct}% • Nhận ngay +100 EXP 🌟</div>
      </div>

      <!-- Recommendation Card -->
      <div style="background: #FFF; border: 2px solid #8B0000; border-radius: 1rem; padding: 1.25rem; text-align: left; margin-bottom: 1rem; box-shadow: 0 10px 15px -3px rgba(139, 0, 0, 0.1);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="background: #8B0000; color: #FFF; font-weight: 700; font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: 9999px;">CẤP ĐỘ KHUYÊN HỌC</span>
          <span style="font-weight: 700; color: #D4AF37;">${rec.badge}</span>
        </div>
        <h4 style="font-size: 1.15rem; font-weight: 800; color: #8B0000; margin: 0 0 0.5rem 0;">${rec.level}</h4>
        <p style="font-size: 0.9rem; line-height: 1.6; color: #333; margin: 0;">${rec.advice}</p>
      </div>
      <p style="font-size: 0.8rem; color: #666; font-style: italic;">Lộ trình này được thiết kế cá nhân hóa để bạn cảm thấy vừa sức, không chán nản và đạt tiến bộ rõ rệt nhất!</p>
    </div>
  `;

  footer.innerHTML = `
    <button onclick="closePlacementTestModal()" class="px-4 py-2 rounded-lg bg-stone-200 text-stone-700 font-semibold text-sm">
      Đóng
    </button>
    <button onclick="startRecommendedLearning('${rec.targetTab}')" style="background: #8B0000; color: #FFF; padding: 0.6rem 1.5rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.9rem; border: none; cursor: pointer; box-shadow: 0 4px 10px rgba(139, 0, 0, 0.25);">
      Bắt đầu học ngay với ${rec.level} →
    </button>
  `;
};

window.startRecommendedLearning = function (targetTab) {
  closePlacementTestModal();
  if (window.switchTab) {
    window.switchTab(targetTab || 'hsk30');
  }
};

// -------------------------------------------------------------
// 2. Inactivity Lock Modal Check & Display
// -------------------------------------------------------------
window.checkUserInactivityLock = function (user) {
  if (!user || user.role === 'admin') return;
  if (!user.isLocked) return;

  let overlay = document.getElementById('accountLockedOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'accountLockedOverlay';
    overlay.style.cssText = 'position: fixed; inset: 0; z-index: 9999999; background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 1.5rem;';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div style="background: #FFFDF9; border: 3px solid #8B0000; border-radius: 1.25rem; max-width: 580px; width: 100%; padding: 2rem; box-shadow: 0 25px 50px rgba(0,0,0,0.5); text-align: center; font-family: inherit;">
      <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">🔒</div>
      <h3 style="font-size: 1.35rem; font-weight: 800; color: #8B0000; margin: 0 0 0.75rem 0;">TÀI KHOẢN TẠM KHÓA DO GIÁN ĐOẠN HỌC TẬP</h3>
      
      <div style="background: #FFF5F5; border: 1px solid #FEB2B2; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1.25rem; text-align: left; font-size: 0.875rem; color: #742A2A; line-height: 1.6;">
        <p style="margin: 0 0 0.5rem 0;"><strong>Quy định trung tâm:</strong> Để đảm bảo học viên tiếp thu từ vựng và phản xạ ngữ pháp hiệu quả, mỗi học viên cần hoàn thành tối thiểu <strong>10 phút học tập mỗi ngày</strong>.</p>
        <p style="margin: 0;">Tài khoản của bạn đã ngưng học quá <strong>3 ngày liên tục</strong> nên hệ thống đã tự động kích hoạt chế độ bảo lưu tạm thời nhằm tránh lãng phí thời gian học của bạn.</p>
      </div>

      <p style="font-size: 0.9rem; color: #4A5568; margin-bottom: 1.5rem; line-height: 1.5;">
        👉 Vui lòng liên hệ trực tiếp Quản trị viên (Admin) để được mở khóa ngay và nhận hướng dẫn lộ trình khôi phục:
      </p>

      <div style="background: #FDF6E2; border: 1px solid #D4AF37; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1.5rem; text-align: left; font-size: 0.875rem;">
        <div style="margin-bottom: 0.4rem;"><strong>📧 Email hỗ trợ:</strong> <a href="mailto:hoangpham1618@gmail.com" style="color: #8B0000; font-weight: 700; text-decoration: underline;">hoangpham1618@gmail.com</a></div>
        <div><strong>👤 Phụ trách:</strong> Admin Hoàng Phạm (Hỗ trợ mở khóa 24/7)</div>
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: center;">
        <a href="mailto:hoangpham1618@gmail.com?subject=Yêu%20cầu%20mở%20khóa%20tài%20khoản%20${encodeURIComponent(user.email || '')}&body=Chào%20Admin%2C%20tài%20khoản%20của%20tôi%20(${encodeURIComponent(user.email || '')})%20bị%20tạm%20khóa%20do%20quá%203%20ngày%20chưa%20học.%20Nhờ%20Admin%20hỗ%20trợ%20mở%20khóa%20giúp%20tôi!" 
           style="background: #8B0000; color: #FFF; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.9rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
          ✉️ Gửi Email Mở Khóa Ngay
        </a>
      </div>
    </div>
  `;
  overlay.style.display = 'flex';
};

// -------------------------------------------------------------
// 3. VIP Study Reminder Scheduler
// -------------------------------------------------------------
window.initVipStudyReminder = function (user) {
  if (!user) return;
  const isVip = user.vipInfo && user.vipInfo.isVip;
  if (!isVip) return;

  const reminder = (user.progress && user.progress.reminder) || { enabled: true, time: '20:00' };
  if (!reminder.enabled) return;

  // Check every minute if current time matches reminder time
  if (window._vipReminderInterval) clearInterval(window._vipReminderInterval);
  window._vipReminderInterval = setInterval(() => {
    const now = new Date();
    const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const todayKey = now.toISOString().slice(0, 10);

    if (currentHM === reminder.time && window._lastRemindedDate !== todayKey) {
      window._lastRemindedDate = todayKey;
      triggerStudyNotification();
    }
  }, 30000);
};

function triggerStudyNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🔔 Nhắc nhở học tiếng Trung!', {
      body: 'Đã đến giờ vàng học bài! Hãy dành 10 phút luyện tập hôm nay để duy trì chuỗi học và giữ tài khoản luôn hoạt động nhé!',
      icon: '/assets/favicon.ico'
    });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
  if (window.showToast) {
    window.showToast('🔔 Đến giờ học tiếng Trung rồi! Cùng luyện tập 10 phút nhé!', 'info');
  }
}
