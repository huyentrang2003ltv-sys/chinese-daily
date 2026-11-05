'use strict';

const path = require('path');
const fs = require('fs');
const { STORAGE_DIR } = require('./config');

let db = null;
let isSqliteAvailable = false;

try {
  const { DatabaseSync } = require('node:sqlite');
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
  const dbPath = path.join(STORAGE_DIR, 'app.sqlite');
  db = new DatabaseSync(dbPath);
  
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA synchronous = NORMAL;');
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'student',
      language TEXT DEFAULT '',
      profession TEXT DEFAULT '',
      purpose TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      trial_started_at TEXT NOT NULL,
      vip_tier TEXT,
      vip_expires_at TEXT,
      session_version INTEGER DEFAULT 1,
      progress_json TEXT DEFAULT '{}',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS feedback_tickets (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      sender_name TEXT,
      sender_contact TEXT,
      category TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cloud_sync_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      details TEXT,
      synced_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_tickets_created ON feedback_tickets(created_at);
  `);
  
  isSqliteAvailable = true;
} catch (e) {
  console.warn('[db] SQLite could not be initialized, falling back to JSON store:', e.message);
}

function syncUser(u) {
  if (!db || !u || !u.id || !u.email) return;
  try {
    const stmt = db.prepare(`
      INSERT INTO users (
        id, email, name, password_hash, role, language, profession, purpose,
        created_at, trial_started_at, vip_tier, vip_expires_at, session_version,
        progress_json, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email=excluded.email,
        name=excluded.name,
        password_hash=excluded.password_hash,
        role=excluded.role,
        language=excluded.language,
        profession=excluded.profession,
        purpose=excluded.purpose,
        trial_started_at=excluded.trial_started_at,
        vip_tier=excluded.vip_tier,
        vip_expires_at=excluded.vip_expires_at,
        session_version=excluded.session_version,
        progress_json=excluded.progress_json,
        updated_at=excluded.updated_at
    `);
    
    stmt.run(
      u.id,
      u.email.toLowerCase(),
      u.name || 'Học viên',
      u.passwordHash || null,
      u.role || 'student',
      u.language || '',
      u.profession || '',
      u.purpose || '',
      u.createdAt || new Date().toISOString(),
      u.trialStartedAt || new Date().toISOString(),
      u.vipTier || null,
      u.vipExpiresAt || null,
      u.sessionVersion || 1,
      JSON.stringify(u.progress || {}),
      new Date().toISOString()
    );
  } catch (err) {
    console.error('[db] Error syncing user to SQLite:', err.message);
  }
}

function recordFeedbackTicket({ id, userId, name, contact, category, message }) {
  if (!db) return false;
  try {
    const stmt = db.prepare(`
      INSERT INTO feedback_tickets (id, user_id, sender_name, sender_contact, category, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'received', ?)
    `);
    stmt.run(id, userId || null, name || 'Khách', contact || '', category || 'Khiếu nại chung', message, new Date().toISOString());
    return true;
  } catch (err) {
    console.error('[db] Error recording feedback ticket:', err.message);
    return false;
  }
}

function recordSyncEvent(userId, eventType, details = '') {
  if (!db || !userId) return;
  try {
    db.prepare('INSERT INTO cloud_sync_events (user_id, event_type, details, synced_at) VALUES (?, ?, ?, ?)')
      .run(userId, eventType, typeof details === 'object' ? JSON.stringify(details) : String(details), new Date().toISOString());
  } catch (e) {
    // best-effort
  }
}

function getStats() {
  if (!db) return { sqlite: false };
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const ticketCount = db.prepare('SELECT COUNT(*) as count FROM feedback_tickets').get().count;
    return { sqlite: true, userCount, ticketCount };
  } catch (e) {
    return { sqlite: false, error: e.message };
  }
}

module.exports = {
  db,
  isSqliteAvailable,
  syncUser,
  recordFeedbackTicket,
  recordSyncEvent,
  getStats
};
