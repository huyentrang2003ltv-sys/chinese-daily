// =========================================================================
// Dual-Voice Beijing TTS Engine (Giọng Đọc Chuẩn Bắc Kinh 普通话: Nam & Nữ)
// =========================================================================
let currentTtsGender = storage.getRaw('yuhan_tts_gender') === 'male' ? 'male' : 'female';
let currentTtsSpeed = parseFloat(storage.getRaw('yuhan_tts_speed')) || 0.85;
let beijingFemaleVoice = null;
let beijingMaleVoice = null;
let voicesLoaded = false;

function initTtsVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return;

  // Filter Chinese Mandarin/Beijing voices (zh-CN, zh, cmn-Hans, etc.)
  const zhVoices = voices.filter(v => 
    v.lang && (v.lang.toLowerCase().startsWith('zh') || v.lang.toLowerCase().includes('cmn'))
  );

  // Beijing Female priority: Xiaoxiao (ultra-natural Beijing), Huihui, Xiaoyi, Yaoyao, Tingting, Sinji
  beijingFemaleVoice = zhVoices.find(v => 
    /xiaoxiao|huihui|xiaoyi|yaoyao|tingting|sinji|female/i.test(v.name)
  ) || zhVoices.find(v => /china|mainland|chinese|普通话/i.test(v.name)) || zhVoices[0] || null;

  // Beijing Male priority: Yunxi (standard Beijing male), Yunjian, Kangkang, Yunyang, Danny, Bochuan, Male
  beijingMaleVoice = zhVoices.find(v => 
    /yunxi|yunjian|kangkang|yunyang|bochuan|danny|male/i.test(v.name)
  ) || null;

  voicesLoaded = true;
  updateVoiceUi();
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    initTtsVoices();
  };
}

let currentTtsAudio = null;

function playChineseTTS(text, forceGender = null) {
  if (!text || !text.toString().trim()) return;
  const cleanText = text.toString().trim();
  const targetGender = forceGender || currentTtsGender || 'female';
  const targetSpeed = currentTtsSpeed || 0.85;

  // 1. Try High-Fidelity Studio Neural Beijing Audio (EdgeTTS Server API)
  try {
    if (currentTtsAudio) {
      try {
        currentTtsAudio.pause();
        currentTtsAudio.currentTime = 0;
      } catch (e) {}
    }

    const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&gender=${targetGender}&speed=${targetSpeed}`;
    const audio = new Audio(ttsUrl);
    currentTtsAudio = audio;

    let hasStarted = false;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        hasStarted = true;
      }).catch(err => {
        console.warn('Audio playback error, falling back to WebSpeech:', err);
        if (!hasStarted) {
          playWebSpeechFallback(cleanText, targetGender, targetSpeed);
        }
      });
    }

    audio.onerror = () => {
      if (!hasStarted) {
        playWebSpeechFallback(cleanText, targetGender, targetSpeed);
      }
    };
    return;
  } catch (err) {
    console.warn('Neural audio init error:', err);
    playWebSpeechFallback(cleanText, targetGender, targetSpeed);
  }
}

function stopChineseTTS() {
  if (currentTtsAudio) {
    try {
      currentTtsAudio.pause();
      currentTtsAudio.currentTime = 0;
    } catch (e) {}
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

function playWebSpeechFallback(text, targetGender, targetSpeed) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = targetSpeed || 0.85;

    if (!voicesLoaded) {
      initTtsVoices();
    }

    if (targetGender === 'male') {
      if (beijingMaleVoice) {
        utterance.voice = beijingMaleVoice;
        utterance.pitch = 0.92;
      } else if (beijingFemaleVoice) {
        utterance.voice = beijingFemaleVoice;
        utterance.pitch = 0.80;
      } else {
        utterance.pitch = 0.80;
      }
    } else {
      if (beijingFemaleVoice) {
        utterance.voice = beijingFemaleVoice;
        utterance.pitch = 1.05;
      } else {
        utterance.pitch = 1.05;
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('SpeechSynthesis error:', e);
  }
}

function setTtsGender(gender) {
  currentTtsGender = gender;
  try {
    localStorage.setItem('yuhan_tts_gender', gender);
  } catch (e) {}
  updateVoiceUi();
  const sample = gender === 'male' ? '你好！我是北京男声老师。' : '你好！我是北京女声老师。';
  playChineseTTS(sample, gender);
}

function setTtsSpeed(speed) {
  currentTtsSpeed = speed;
  try {
    localStorage.setItem('yuhan_tts_speed', speed.toString());
  } catch (e) {}
  updateVoiceUi();
  playChineseTTS('语速已更新。', currentTtsGender);
}

function testBeijingVoice() {
  const sampleText = currentTtsGender === 'male'
    ? '您好！我是北京普通话男声老师。多学一门外语，多看一个世界！'
    : '您好！我是北京普通话女声老师。多学一门外语，多看一个世界！';
  playChineseTTS(sampleText, currentTtsGender);
}

function toggleVoiceDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('voiceSettingsDropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function updateVoiceUi() {
  const icon = document.getElementById('voiceHeaderIcon');
  const label = document.getElementById('voiceHeaderLabel');
  if (icon && label) {
    if (currentTtsGender === 'male') {
      icon.innerText = '👨';
      label.innerText = 'Nam Đề Thi (CCTV)';
    } else {
      icon.innerText = '👩';
      label.innerText = 'Nữ Chuẩn HSK (Bắc Kinh)';
    }
  }

  const btnFemale = document.getElementById('btnVoiceFemale');
  const btnMale = document.getElementById('btnVoiceMale');
  if (btnFemale && btnMale) {
    if (currentTtsGender === 'female') {
      btnFemale.className = 'flex flex-col items-center justify-center p-2.5 rounded-xl border-2 border-[#8B1E1E] bg-rose-50/80 text-[#8B1E1E] font-medium text-xs transition-all shadow-xs';
      btnMale.className = 'flex flex-col items-center justify-center p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs transition-all';
    } else {
      btnFemale.className = 'flex flex-col items-center justify-center p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs transition-all';
      btnMale.className = 'flex flex-col items-center justify-center p-2.5 rounded-xl border-2 border-[#1E4D43] bg-teal-50/80 text-[#1E4D43] font-medium text-xs transition-all shadow-xs';
    }
  }

  const speeds = [0.75, 0.85, 1.0];
  speeds.forEach(s => {
    const btn = document.getElementById(`btnSpeed${s.toString().replace('.', '')}`);
    if (btn) {
      if (Math.abs(currentTtsSpeed - s) < 0.01) {
        btn.className = 'flex-1 py-1 rounded-lg text-xs font-bold bg-[#8B1E1E] text-white shadow-2xs transition-all';
      } else {
        btn.className = 'flex-1 py-1 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 transition-all';
      }
    }
  });
}

// Global outside-click listener to dismiss voice dropdown
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const container = document.getElementById('voiceSelectorContainer');
    const dropdown = document.getElementById('voiceSettingsDropdown');
    if (dropdown && !dropdown.classList.contains('hidden')) {
      if (container && !container.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    }
  });
}
