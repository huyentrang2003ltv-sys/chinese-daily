'use strict';

const fs = require('fs');
const path = require('path');
const { STORAGE_DIR } = require('./config');

fs.mkdirSync(STORAGE_DIR, { recursive: true });

function storagePath(name) {
  return path.join(STORAGE_DIR, name);
}

function readJsonFile(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.error(`Không đọc được ${file}:`, e.message);
      // Keep the unreadable file so the fallback never silently overwrites real data.
      try {
        fs.copyFileSync(file, `${file}.corrupt-${Date.now()}`);
      } catch (copyErr) {
        // best effort
      }
    }
    return fallback;
  }
}

/** Write via temp file + rename so a crash never leaves a half-written file. */
function writeJsonFileAtomic(file, data) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

/**
 * A JSON document kept in memory and flushed to disk shortly after each change.
 * Fine for a single Node process with a few thousand records.
 */
function createJsonStore(name, fallback, { delayMs = 200 } = {}) {
  const file = storagePath(name);
  let data = readJsonFile(file, fallback);
  let timer = null;

  function flush() {
    clearTimeout(timer);
    timer = null;
    try {
      writeJsonFileAtomic(file, data);
    } catch (e) {
      console.error(`Không ghi được ${file}:`, e.message);
      // Typically a transient lock (antivirus, backup tool, Windows rename): try again shortly.
      if (!timer) timer = setTimeout(flush, 1000);
    }
  }

  return {
    file,
    get: () => data,
    set(next) {
      data = next;
      this.save();
    },
    save() {
      if (!timer) timer = setTimeout(flush, delayMs);
    },
    flush
  };
}

module.exports = { storagePath, readJsonFile, writeJsonFileAtomic, createJsonStore };
