'use strict';

// Real visitor counters: each browser sends a random client id when the page opens and
// every few minutes while it stays open. "Online" = distinct ids seen in the last 5 minutes.
const { createJsonStore } = require('./store');

const ONLINE_WINDOW_MS = 5 * 60 * 1000;
const store = createJsonStore('visitors.json', { total: 0, today: 0, date: '', peakOnline: 0 }, { delayMs: 5000 });
if (!store.get() || typeof store.get() !== 'object') store.set({ total: 0, today: 0, date: '', peakOnline: 0 });
const lastSeen = new Map();
let seenToday = new Set();

const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function rollDay() {
  const data = store.get();
  const today = localDate();
  if (data.date !== today) {
    data.date = today;
    data.today = 0;
    seenToday = new Set();
    store.save();
  }
  return data;
}

function onlineCount() {
  const cutoff = Date.now() - ONLINE_WINDOW_MS;
  for (const [cid, at] of lastSeen) if (at < cutoff) lastSeen.delete(cid);
  return lastSeen.size;
}

function stats() {
  const data = rollDay();
  return { online: onlineCount(), today: data.today, total: data.total, peak: data.peakOnline };
}

function ping(cid) {
  const data = rollDay();
  if (cid && /^[\w-]{8,64}$/.test(cid)) {
    if (lastSeen.size < 100000) lastSeen.set(cid, Date.now());
    if (!seenToday.has(cid)) {
      seenToday.add(cid);
      data.today += 1;
      data.total += 1;
      store.save();
    }
  }
  const online = onlineCount();
  if (online > data.peakOnline) {
    data.peakOnline = online;
    store.save();
  }
  return stats();
}

module.exports = { ping, stats, flush: () => store.flush() };
