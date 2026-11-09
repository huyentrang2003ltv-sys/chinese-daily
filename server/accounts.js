'use strict';

// User accounts: storage, password hashing, signed session cookies and VIP status.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { ROOT, SESSION_SECRET, ADMIN_EMAILS: CONFIG_ADMIN_EMAILS } = require('./config');
const { createJsonStore, readJsonFile, storagePath } = require('./store');
const { syncUser } = require('./db');

const DAY_MS = 24 * 60 * 60 * 1000;
const TRIAL_DAYS = 7;
const SESSION_DAYS = 30;
const SESSION_COOKIE = 'yh_session';
const VIP_TIERS = { monthly: 30, yearly: 365, lifetime: null };

// ---------------------------------------------------------------------------
// Passwords: scrypt with a per-user salt
// ---------------------------------------------------------------------------
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 32 };

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, SCRYPT.keylen, SCRYPT);
  return `scrypt$${SCRYPT.N}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

/** Returns 'ok', 'ok-legacy' (old unsalted sha256, should be upgraded) or 'fail'. */
function verifyPassword(password, stored) {
  if (typeof stored !== 'string') return 'fail';
  if (stored.startsWith('scrypt$')) {
    const parts = stored.split('$');
    const n = Number(parts[1]);
    const salt = Buffer.from(parts[2] || '', 'base64');
    const expected = Buffer.from(parts[3] || '', 'base64');
    // A malformed or hostile stored value must fail the login, never crash or burn memory.
    if (parts.length !== 4 || !Number.isInteger(n) || n < 2 || n > 1 << 20 || (n & (n - 1)) !== 0 ||
        !salt.length || expected.length < 16 || expected.length > 128) return 'fail';
    try {
      const actual = crypto.scryptSync(password, salt, expected.length, { ...SCRYPT, N: n });
      return crypto.timingSafeEqual(actual, expected) ? 'ok' : 'fail';
    } catch (e) {
      return 'fail';
    }
  }
  if (/^[a-f0-9]{64}$/i.test(stored)) {
    // The old server trimmed passwords before hashing.
    const actual = crypto.createHash('sha256').update(password.trim()).digest();
    return crypto.timingSafeEqual(actual, Buffer.from(stored, 'hex')) ? 'ok-legacy' : 'fail';
  }
  return 'fail';
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Designated System Administrator Accounts
// ---------------------------------------------------------------------------
const ADMIN_EMAILS = new Set(
  (Array.isArray(CONFIG_ADMIN_EMAILS) && CONFIG_ADMIN_EMAILS.length ? CONFIG_ADMIN_EMAILS : ['hoangpham1618@gmail.com', 'huyentrang2003ltv@gmail.com'])
    .map(e => String(e).trim().toLowerCase())
);

function isSystemAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return ADMIN_EMAILS.has(email.trim().toLowerCase());
}

function ensureAdminAccounts() {
  const allUsers = store.get() || [];
  let modified = false;
  for (const u of allUsers) {
    if (isSystemAdminEmail(u.email)) {
      if (u.role !== 'admin' || u.isLocked || u.vipTier !== 'lifetime') {
        u.role = 'admin';
        u.isLocked = false;
        u.lockReason = null;
        u.lockedAt = null;
        u.vipTier = 'lifetime';
        syncUser(u);
        modified = true;
      }
    }
  }
  if (modified) {
    store.save();
    console.log('[accounts] Đã kích hoạt quyền Quản Trị Viên & VIP trọn đời cho Ban Quản Trị:', Array.from(ADMIN_EMAILS).join(', '));
  }
}

// ---------------------------------------------------------------------------
// Users store (+ one-time import of the old data/users.json)
// ---------------------------------------------------------------------------
const store = createJsonStore('users.json', null);
/** Verified against when an email is unknown, so login timing does not reveal which emails exist. */
const DUMMY_HASH = hashPassword('dummy-password-for-timing');
const LEGACY_DEFAULT_HASH = crypto.createHash('sha256').update('admin123').digest('hex');

function importLegacyUsers() {
  const candidates = [storagePath('legacy-users.json'), path.join(ROOT, 'data', 'users.json')];
  const legacyFile = candidates.find(f => fs.existsSync(f));
  const legacy = legacyFile ? readJsonFile(legacyFile, []) : [];
  const users = (Array.isArray(legacy) ? legacy : []).filter(u => u && u.email).map(u => {
    const progress = { exp: Number(u.exp) || 0, streak: Number(u.streak) || 0, savedWords: Array.isArray(u.savedWords) ? u.savedWords : [] };
    return {
      id: u.id || newId(),
      name: String(u.name || 'Học viên').slice(0, 60),
      email: String(u.email).toLowerCase(),
      // Accounts still on the old shared default password must set a new one first.
      passwordHash: u.passwordHash === LEGACY_DEFAULT_HASH ? null : u.passwordHash,
      role: u.role === 'super_admin' || u.role === 'admin' ? 'admin' : 'student',
      language: u.language || '',
      profession: u.profession || '',
      purpose: u.purpose || u.goal || '',
      createdAt: u.createdAt || new Date().toISOString(),
      trialStartedAt: u.trialStartedAt || u.createdAt || new Date().toISOString(),
      vipTier: ['monthly', 'yearly', 'lifetime', 'expired'].includes(u.vipTier) ? u.vipTier : null,
      vipExpiresAt: u.vipExpiresAt || null,
      sessionVersion: 1,
      progress
    };
  });
  if (legacyFile) console.log(`[accounts] Đã nhập ${users.length} tài khoản từ ${path.relative(ROOT, legacyFile)}`);
  return users;
}

if (!Array.isArray(store.get())) {
  store.set(importLegacyUsers());
  store.flush();
}
if (Array.isArray(store.get())) {
  store.get().forEach(u => syncUser(u));
  ensureAdminAccounts();
}

const users = () => store.get();
const findByEmail = email => users().find(u => u.email === String(email || '').trim().toLowerCase()) || null;
const findByUsername = uname => {
  const target = String(uname || '').trim().toLowerCase();
  if (!target) return null;
  return users().find(u => {
    const uName = String(u.username || '').trim().toLowerCase();
    const dName = String(u.name || '').trim().toLowerCase();
    return uName === target || dName === target;
  }) || null;
};
const findByName = name => {
  const target = String(name || '').trim().toLowerCase();
  if (!target) return null;
  return users().find(u => String(u.name || '').trim().toLowerCase() === target) || null;
};
const findById = id => users().find(u => u.id === id) || null;

const INACTIVITY_LOCK_DAYS = 3;

function checkInactivityLock(user) {
  if (!user || user.role === 'admin') return false;
  if (user.isLocked) return true;
  const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt).getTime() : new Date(user.createdAt || Date.now()).getTime();
  const diffDays = (Date.now() - lastActive) / DAY_MS;
  if (diffDays > INACTIVITY_LOCK_DAYS) {
    user.isLocked = true;
    user.lockReason = 'Tài khoản bị tạm khóa do quá 3 ngày liên tục chưa hoàn thành 10 phút học tập mỗi ngày.';
    user.lockedAt = new Date().toISOString();
    store.save();
    syncUser(user);
    return true;
  }
  return false;
}

function unlockUser(user) {
  if (!user) return;
  user.isLocked = false;
  user.lockReason = null;
  user.lockedAt = null;
  user.lastActiveAt = new Date().toISOString();
  store.save();
  syncUser(user);
}

function touchUserActivity(user) {
  if (!user) return;
  user.lastActiveAt = new Date().toISOString();
  store.save();
}

function newId() {
  return 'usr_' + crypto.randomBytes(9).toString('base64url');
}

function createUser({ username, name, email, password, language, profession, purpose, progress }) {
  const now = new Date().toISOString();
  const isAdmin = isSystemAdminEmail(email);
  const user = {
    id: newId(),
    username: username || name,
    name: name || username,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    role: isAdmin ? 'admin' : 'student',
    language,
    profession,
    purpose,
    createdAt: now,
    lastActiveAt: now,
    isLocked: false,
    lockReason: null,
    lockedAt: null,
    trialStartedAt: now,
    vipTier: isAdmin ? 'lifetime' : null,
    vipExpiresAt: null,
    sessionVersion: 1,
    progress: progress || { exp: 0, streak: 1, savedWords: [] }
  };
  users().push(user);
  store.save();
  syncUser(user);
  return user;
}

function setPassword(user, password) {
  user.passwordHash = hashPassword(password);
  user.sessionVersion = (user.sessionVersion || 1) + 1;
  store.save();
  syncUser(user);
}

function setVipTier(user, tier) {
  const now = Date.now();
  if (tier === 'trial') {
    user.vipTier = null;
    user.vipExpiresAt = null;
    user.trialStartedAt = new Date(now).toISOString();
  } else if (tier === 'expire') {
    user.vipTier = 'expired';
    user.vipExpiresAt = new Date(now - 1000).toISOString();
    // Also end any running trial.
    user.trialStartedAt = new Date(now - TRIAL_DAYS * DAY_MS - 1000).toISOString();
  } else if (Object.hasOwn(VIP_TIERS, tier)) {
    const days = VIP_TIERS[tier];
    user.vipTier = tier;
    user.vipExpiresAt = days ? new Date(now + days * DAY_MS).toISOString() : null;
  } else {
    throw new Error('Gói VIP không hợp lệ');
  }
  store.save();
  syncUser(user);
}

/** VIP status, computed on the server so the client cannot grant itself access. */
function vipInfo(user) {
  if (!user) return { isVip: false, isTrial: false, isExpired: true, daysRemaining: 0, label: 'Chưa đăng nhập', tier: 'none', expiresAt: null };
  const now = Date.now();
  const lifetime = { isVip: true, isTrial: false, isExpired: false, daysRemaining: null, label: '👑 VIP Trọn Đời', tier: 'lifetime', expiresAt: null };
  if (user.role === 'admin' || user.vipTier === 'lifetime') return lifetime;

  if (user.vipTier === 'monthly' || user.vipTier === 'yearly') {
    const expires = new Date(user.vipExpiresAt).getTime();
    const days = Math.ceil((expires - now) / DAY_MS);
    if (days > 0) {
      return { isVip: true, isTrial: false, isExpired: false, daysRemaining: days, label: `💎 VIP (${days} ngày)`, tier: user.vipTier, expiresAt: user.vipExpiresAt };
    }
    return { isVip: false, isTrial: false, isExpired: true, daysRemaining: 0, label: '⚠️ Đã Hết Hạn VIP', tier: 'expired', expiresAt: user.vipExpiresAt };
  }

  const trialEnd = new Date(user.trialStartedAt || user.createdAt).getTime() + TRIAL_DAYS * DAY_MS;
  const days = Math.ceil((trialEnd - now) / DAY_MS);
  if (user.vipTier !== 'expired' && days > 0) {
    return { isVip: true, isTrial: true, isExpired: false, daysRemaining: days, label: `🎁 Dùng Thử (${days} ngày)`, tier: 'trial', expiresAt: new Date(trialEnd).toISOString() };
  }
  return { isVip: false, isTrial: false, isExpired: true, daysRemaining: 0, label: '🔒 Hết Hạn Dùng Thử', tier: 'expired', expiresAt: new Date(trialEnd).toISOString() };
}

/** The user as sent to their own browser (no password hash). */

function findOrCreateSocialUser({ email, name, provider = 'google', providerId, avatar }) {
  if (!email) throw new Error('Email từ nhà cung cấp không hợp lệ.');
  email = String(email).trim().toLowerCase();
  let user = findByEmail(email);
  const isAdmin = isSystemAdminEmail(email);

  if (user) {
    if (isAdmin && (user.role !== 'admin' || user.isLocked || user.vipTier !== 'lifetime')) {
      user.role = 'admin';
      user.isLocked = false;
      user.lockReason = null;
      user.lockedAt = null;
      user.vipTier = 'lifetime';
    }
    user.authProvider = provider;
    if (providerId) user.providerId = providerId;
    if (avatar && !user.avatar) user.avatar = avatar;
    user.lastActiveAt = new Date().toISOString();
    store.save();
    syncUser(user);
    return { user, isNew: false };
  }

  // Create new user from social auth
  let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '');
  if (!baseUsername) baseUsername = 'hocvien';
  let uniqueUsername = baseUsername;
  let counter = 1;
  while (findByUsername(uniqueUsername)) {
    uniqueUsername = `${baseUsername}${counter++}`;
  }

  const now = new Date().toISOString();
  user = {
    id: newId(),
    username: uniqueUsername,
    name: name || uniqueUsername,
    email: email,
    passwordHash: null,
    role: isAdmin ? 'admin' : 'student',
    authProvider: provider,
    providerId: providerId || null,
    avatar: avatar || null,
    language: 'Tiếng Trung Giản Thể (Chuẩn Phổ Thông)',
    profession: 'Học viên tự do',
    purpose: 'Học tiếng Trung giao tiếp & thi HSK',
    createdAt: now,
    lastActiveAt: now,
    isLocked: false,
    lockReason: null,
    lockedAt: null,
    trialStartedAt: now,
    vipTier: isAdmin ? 'lifetime' : null,
    vipExpiresAt: null,
    sessionVersion: 1,
    progress: { exp: 50, streak: 1, savedWords: [] }
  };

  users().push(user);
  store.save();
  syncUser(user);
  return { user, isNew: true };
}

function publicUser(user) {
  if (!user) return null;
  checkInactivityLock(user);
  return {
    id: user.id,
    username: user.username || user.name,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || null,
    authProvider: user.authProvider || 'local',
    language: user.language,
    profession: user.profession,
    purpose: user.purpose,
    createdAt: user.createdAt,
    lastActiveAt: user.lastActiveAt || user.createdAt,
    isLocked: Boolean(user.isLocked),
    lockReason: user.lockReason || null,
    lockedAt: user.lockedAt || null,
    vipInfo: vipInfo(user),
    progress: user.progress || {}
  };
}

// ---------------------------------------------------------------------------
// Sessions: HMAC-signed cookie "<payload>.<signature>", stateless across restarts
// ---------------------------------------------------------------------------
function loadSecret() {
  if (SESSION_SECRET) return SESSION_SECRET;
  const file = storagePath('session.key');
  try {
    const existing = fs.readFileSync(file, 'utf8').trim();
    if (existing.length >= 32) return existing;
  } catch (e) {
    // fall through and create one
  }
  const created = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(file, created, { mode: 0o600 });
  return created;
}
const secret = loadSecret();

const sign = payload => crypto.createHmac('sha256', secret).update(payload).digest('base64url');

function createSessionToken(user) {
  const payload = Buffer.from(JSON.stringify({
    uid: user.id,
    v: user.sessionVersion || 1,
    exp: Date.now() + SESSION_DAYS * DAY_MS
  })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function userFromSessionToken(token) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(payload));
  // Compare bytes, not string lengths: non-ASCII input can differ in byte length.
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data || typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    const user = findById(data.uid);
    return user && (user.sessionVersion || 1) === data.v ? user : null;
  } catch (e) {
    return null;
  }
}

function sessionCookie(token, { secure, clear = false } = {}) {
  const parts = [
    `${SESSION_COOKIE}=${clear ? '' : token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${clear ? 0 : SESSION_DAYS * 24 * 3600}`
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

// ---------------------------------------------------------------------------
// System Broadcast Announcement Store
// ---------------------------------------------------------------------------
const broadcastStore = createJsonStore('broadcast.json', {
  enabled: false,
  message: '',
  type: 'info',
  updatedAt: null
});

function getBroadcast() {
  return broadcastStore.get() || { enabled: false, message: '', type: 'info', updatedAt: null };
}

function setBroadcast({ enabled, message, type }) {
  const data = {
    enabled: Boolean(enabled),
    message: String(message || '').trim(),
    type: ['info', 'warning', 'success', 'promo'].includes(type) ? type : 'info',
    updatedAt: new Date().toISOString()
  };
  broadcastStore.set(data);
  broadcastStore.flush();
  return data;
}

module.exports = {
  SESSION_COOKIE,
  VIP_TIERS,
  users,
  saveUsers: () => store.save(),
  flushUsers: () => store.flush(),
  findByEmail,
  findByUsername,
  findByName,
  findById,
  createUser,
  setPassword,
  setVipTier,
  verifyPassword,
  DUMMY_HASH,
  vipInfo,
  publicUser,
  checkInactivityLock,
  unlockUser,
  touchUserActivity,
  createSessionToken,
  userFromSessionToken,
  sessionCookie,
  getBroadcast,
  setBroadcast,
  findOrCreateSocialUser,
  ADMIN_EMAILS,
  isSystemAdminEmail,
  ensureAdminAccounts
};
