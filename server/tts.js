'use strict';

// TTS: Microsoft Edge neural voices (Xiaoxiao female / Yunxi male), Youdao as fallback.
const { TTS_RATE_LIMIT } = require('./config');
const { send, sendJson, clientIp, createRateLimiter } = require('./http');

let EdgeTTS = null;
try {
  EdgeTTS = require('node-edge-tts').EdgeTTS;
} catch (e) {
  console.warn('node-edge-tts not loaded, TTS will fall back to Youdao:', e.message);
}

const TTS_MAX_CHARS = 1000;
const TTS_CACHE_MAX_BYTES = 64 * 1024 * 1024;
const TTS_TIMEOUT_MS = 15000;
const VOICES = { female: 'zh-CN-XiaoxiaoNeural', male: 'zh-CN-YunyangNeural' };

const PINYIN_INITIALS_MAP = {
  'b': '玻', 'p': '坡', 'm': '摸', 'f': '佛',
  'd': '得', 't': '特', 'n': '讷', 'l': '勒',
  'g': '哥', 'k': '科', 'h': '喝',
  'j': '基', 'q': '期', 'x': '希',
  'zh': '知', 'ch': '吃', 'sh': '诗', 'r': '日',
  'z': '资', 'c': '疵', 's': '思',
  'y': '衣', 'w': '乌'
};

const PINYIN_FINALS_MAP = {
  'a': '阿', 'o': '喔', 'e': '婀', 'i': '衣', 'u': '乌', 'ü': '迂', 'v': '迂',
  'ai': '哀', 'ei': '诶', 'ao': '凹', 'ou': '欧',
  'ia': '鸭', 'ie': '耶', 'ua': '蛙', 'uo': '窝', 'üe': '约', 've': '约',
  'iao': '腰', 'iu': '优', 'iou': '优', 'iu (iou)': '优', 'iu(iou)': '优',
  'uai': '歪', 'ui': '微', 'uei': '微', 'ui (uei)': '微', 'ui(uei)': '微',
  'an': '安', 'en': '恩', 'in': '音', 'ün': '晕', 'vn': '晕',
  'ian': '烟', 'uan': '弯', 'üan': '冤', 'van': '冤',
  'un': '温', 'uen': '温', 'un (uen)': '温', 'un(uen)': '温',
  'ang': '肮', 'eng': '鞥', 'ing': '英', 'ong': '翁',
  'iang': '央', 'uang': '汪', 'iong': '拥', 'ueng': '翁',
  'er': '耳'
};

function resolvePinyinToChinesePhonetic(rawText) {
  if (!rawText || typeof rawText !== 'string') return rawText;
  const trimmed = rawText.trim();
  const lower = trimmed.toLowerCase();

  // Full alphabet of 23 initials
  const compactLower = lower.replace(/[\s,，、.]/g, '');
  if (compactLower === 'bpmfdtnlgkhjqxzhchshrzcsyw') {
    return '玻、坡、摸、佛、得、特、讷、勒、哥、科、喝、基、期、希、知、吃、诗、日、资、疵、思、衣、乌';
  }
  if (compactLower === 'aoeiuü' || compactLower === 'aoeiuv') {
    return '阿、喔、婀、衣、乌、迂';
  }

  // Direct initials match
  if (PINYIN_INITIALS_MAP[lower]) return PINYIN_INITIALS_MAP[lower];

  // Direct finals match
  if (PINYIN_FINALS_MAP[lower]) return PINYIN_FINALS_MAP[lower];

  const normalizedKey = lower.replace(/\s+/g, ' ');
  if (PINYIN_FINALS_MAP[normalizedKey]) return PINYIN_FINALS_MAP[normalizedKey];

  return trimmed;
}


/** Simple LRU keyed by voice/rate/text, bounded by total bytes. */
const ttsCache = new Map();
let ttsCacheBytes = 0;
const ttsInFlight = new Map();

function ttsCacheGet(key) {
  const buf = ttsCache.get(key);
  if (!buf) return null;
  ttsCache.delete(key);
  ttsCache.set(key, buf);
  return buf;
}

function ttsCacheSet(key, buf) {
  if (buf.length > TTS_CACHE_MAX_BYTES / 8) return;
  ttsCache.set(key, buf);
  ttsCacheBytes += buf.length;
  while (ttsCacheBytes > TTS_CACHE_MAX_BYTES) {
    const [oldKey, oldBuf] = ttsCache.entries().next().value;
    ttsCache.delete(oldKey);
    ttsCacheBytes -= oldBuf.length;
  }
}

/** Limits uncached synthesis requests per IP. */
const isRateLimited = createRateLimiter({ windowMs: 60 * 1000, max: TTS_RATE_LIMIT });

function speedToRate(speed) {
  if (speed <= 0.75) return '-20%';
  if (speed <= 0.85) return '-10%';
  if (speed >= 1.1) return '+15%';
  return '+0%';
}

async function synthesize(text, voice, rate) {
  const tts = new EdgeTTS({ voice, lang: 'zh-CN', rate, timeout: TTS_TIMEOUT_MS });
  const chunks = [];
  for await (const chunk of tts.streamAudio(text)) {
    if (Buffer.isBuffer(chunk)) chunks.push(chunk);
  }
  const audio = Buffer.concat(chunks);
  if (!audio.length) throw new Error('Empty audio from TTS service');
  return audio;
}

function youdaoFallback(res, text) {
  const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=zh`;
  send(res, 302, { Location: url, 'Cache-Control': 'no-store' });
}

async function handleTts(req, res, url) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, { Allow: 'GET, HEAD' }, '');
    return;
  }

  const rawText = (url.searchParams.get('text') || '').trim();
  const text = resolvePinyinToChinesePhonetic(rawText);
  const gender = url.searchParams.get('gender') === 'male' ? 'male' : 'female';
  const speed = parseFloat(url.searchParams.get('speed')) || 0.85;

  if (!text) {
    sendJson(res, 400, { error: 'Thiếu nội dung cần phát âm (text)' });
    return;
  }
  if (text.length > TTS_MAX_CHARS) {
    sendJson(res, 413, { error: `Văn bản quá dài (tối đa ${TTS_MAX_CHARS} ký tự)` });
    return;
  }

  const voice = VOICES[gender];
  const rate = speedToRate(speed);
  const key = `${voice}|${rate}|${text}`;
  const audioHeaders = buf => ({
    'Content-Type': 'audio/mpeg',
    'Content-Length': buf.length,
    'Cache-Control': 'public, max-age=604800, immutable'
  });

  const cached = ttsCacheGet(key);
  if (cached) {
    send(res, 200, audioHeaders(cached), req.method === 'HEAD' ? undefined : cached);
    return;
  }

  if (!EdgeTTS) {
    youdaoFallback(res, text);
    return;
  }

  if (isRateLimited(clientIp(req))) {
    sendJson(res, 429, { error: 'Quá nhiều yêu cầu phát âm, vui lòng thử lại sau.' }, { 'Retry-After': '60' });
    return;
  }

  try {
    let pending = ttsInFlight.get(key);
    if (!pending) {
      pending = synthesize(text, voice, rate).finally(() => ttsInFlight.delete(key));
      ttsInFlight.set(key, pending);
    }
    const audio = await pending;
    ttsCacheSet(key, audio);
    send(res, 200, audioHeaders(audio), req.method === 'HEAD' ? undefined : audio);
  } catch (err) {
    console.error('TTS error:', err.message);
    youdaoFallback(res, text);
  }
}

module.exports = { handleTts, resolvePinyinToChinesePhonetic };
