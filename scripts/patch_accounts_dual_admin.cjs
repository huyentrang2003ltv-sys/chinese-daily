const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../server/accounts.js');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Update require('./config')
code = code.replace(
  "const { ROOT, SESSION_SECRET } = require('./config');",
  "const { ROOT, SESSION_SECRET, ADMIN_EMAILS: CONFIG_ADMIN_EMAILS } = require('./config');"
);

// 2. Add ADMIN_EMAILS definition and ensureAdminAccounts right before users store
const adminDefs = `
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
  const allUsers = users();
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
`;

code = code.replace(
  "// Users store (+ one-time import of the old data/users.json)\n// ---------------------------------------------------------------------------",
  adminDefs + "\n// ---------------------------------------------------------------------------\n// Users store (+ one-time import of the old data/users.json)\n// ---------------------------------------------------------------------------"
);

// 3. Call ensureAdminAccounts() on initialization
code = code.replace(
  "if (Array.isArray(store.get())) {\n  store.get().forEach(u => syncUser(u));\n}",
  "if (Array.isArray(store.get())) {\n  store.get().forEach(u => syncUser(u));\n  ensureAdminAccounts();\n}"
);

// 4. Update createUser with isAdmin check
code = code.replace(
  `function createUser({ username, name, email, password, language, profession, purpose, progress }) {
  const now = new Date().toISOString();
  const user = {
    id: newId(),
    username: username || name,
    name: name || username,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    role: 'student',`,
  `function createUser({ username, name, email, password, language, profession, purpose, progress }) {
  const now = new Date().toISOString();
  const isAdmin = isSystemAdminEmail(email);
  const user = {
    id: newId(),
    username: username || name,
    name: name || username,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    role: isAdmin ? 'admin' : 'student',`
);

code = code.replace(
  `    trialStartedAt: now,
    vipTier: null,`,
  `    trialStartedAt: now,
    vipTier: isAdmin ? 'lifetime' : null,`
);

// 5. Update findOrCreateSocialUser with isSystemAdminEmail
code = code.replace(
  `  let user = findByEmail(email);

  if (user) {
    user.authProvider = provider;
    if (providerId) user.providerId = providerId;
    if (avatar && !user.avatar) user.avatar = avatar;
    user.lastActiveAt = new Date().toISOString();
    store.save();
    syncUser(user);
    return { user, isNew: false };
  }

  // Create new user from social auth
  let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_\\u4e00-\\u9fa5]/g, '');
  if (!baseUsername) baseUsername = 'hocvien';
  let uniqueUsername = baseUsername;
  let counter = 1;
  while (findByUsername(uniqueUsername)) {
    uniqueUsername = \`\${baseUsername}\${counter++}\`;
  }

  const now = new Date().toISOString();
  const isAdmin = email === 'hoangpham1618@gmail.com';`,
  `  let user = findByEmail(email);
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
  let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_\\u4e00-\\u9fa5]/g, '');
  if (!baseUsername) baseUsername = 'hocvien';
  let uniqueUsername = baseUsername;
  let counter = 1;
  while (findByUsername(uniqueUsername)) {
    uniqueUsername = \`\${baseUsername}\${counter++}\`;
  }

  const now = new Date().toISOString();`
);

// 6. Export ADMIN_EMAILS, isSystemAdminEmail, ensureAdminAccounts
code = code.replace(
  "  findOrCreateSocialUser\n};",
  "  findOrCreateSocialUser,\n  ADMIN_EMAILS,\n  isSystemAdminEmail,\n  ensureAdminAccounts\n};"
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('server/accounts.js patched with dual admin support!');
