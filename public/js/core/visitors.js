// =========================================================================
// Visitor counters (real numbers from /api/visitors; anonymous random client id)
// =========================================================================
const VISITOR_ID_KEY = 'yuhan_visitor_id';
const VISITOR_PING_MS = 2 * 60 * 1000;

function visitorId() {
  let id = storage.getRaw(VISITOR_ID_KEY);
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()).replace(/[^\w-]/g, '');
    storage.setRaw(VISITOR_ID_KEY, id);
  }
  return id;
}

async function pingVisitors() {
  if (document.hidden) return;
  try {
    const res = await fetch('/api/visitors/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cid: visitorId() })
    });
    if (res.ok) updateVisitorUI(await res.json());
  } catch (e) {
    // Offline or static hosting without the API: hide the badge.
    const badge = document.getElementById('headerVisitorBadge');
    if (badge) badge.classList.add('!hidden');
  }
}

function updateVisitorUI(stats) {
  const fmt = n => (Number(n) || 0).toLocaleString('vi-VN');
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  set('liveVisitorCount', fmt(stats.online));
  set('modalOnlineCount', fmt(stats.online));
  set('modalTodayCount', fmt(stats.today));
  set('modalTotalCount', fmt(stats.total));
  set('modalPeakCount', fmt(stats.peak));
}

function initVisitorTracker() {
  pingVisitors();
  setInterval(pingVisitors, VISITOR_PING_MS);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) pingVisitors();
  });
}

function openVisitorStatsModal() {
  openModal('visitorStatsModal');
  pingVisitors();
}

function closeVisitorStatsModal() {
  closeModal('visitorStatsModal');
}
registerModal('visitorStatsModal', closeVisitorStatsModal);

function toggleVisitorStatsModal() {
  const modal = document.getElementById('visitorStatsModal');
  if (modal && !modal.classList.contains('hidden')) closeVisitorStatsModal();
  else openVisitorStatsModal();
}
