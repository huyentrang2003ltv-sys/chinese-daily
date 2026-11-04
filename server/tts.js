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

  const text = (url.searchParams.get('text') || '').trim();
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

module.exports = { handleTts };
