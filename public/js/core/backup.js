// =========================================================================
// Progress backup / restore (all learner data lives in localStorage)
// =========================================================================
const BACKUP_KEY_PREFIX = 'yuhan_';
const BACKUP_FORMAT = 'mei-ri-zhongwen-backup';

function collectProgress() {
  const data = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(BACKUP_KEY_PREFIX)) data[key] = localStorage.getItem(key);
    }
  } catch (e) {}
  return data;
}

/** Hand the viewer a client-side generated file (no server round trip). */
function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportProgress() {
  const payload = { format: BACKUP_FORMAT, version: 1, exportedAt: new Date().toISOString(), data: collectProgress() };
  downloadFile(`hoc-tieng-trung-sao-luu-${todayKey()}.json`, JSON.stringify(payload, null, 2), 'application/json');
  showToast('Đã tải bản sao lưu tiến độ học tập.', 'success');
}

async function importProgress(file) {
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    if (!payload || payload.format !== BACKUP_FORMAT || typeof payload.data !== 'object') {
      throw new Error('Tệp không phải bản sao lưu của Học Tiếng Trung Mỗi Ngày.');
    }
    const entries = Object.entries(payload.data).filter(([k, v]) => k.startsWith(BACKUP_KEY_PREFIX) && typeof v === 'string');
    if (!entries.length) throw new Error('Bản sao lưu không có dữ liệu.');
    if (!window.confirm(`Khôi phục ${entries.length} mục dữ liệu? Tiến độ hiện tại trên trình duyệt này sẽ bị thay thế.`)) return;
    entries.forEach(([k, v]) => storage.setRaw(k, v));
    showToast('Đã khôi phục tiến độ. Đang tải lại...', 'success');
    setTimeout(() => location.reload(), 800);
  } catch (e) {
    showToast(`Không khôi phục được: ${e.message}`, 'error', 5000);
  }
}
