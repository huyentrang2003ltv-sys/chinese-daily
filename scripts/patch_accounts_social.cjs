const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../server/accounts.js');
let code = fs.readFileSync(filePath, 'utf8');

const socialFunc = `
function findOrCreateSocialUser({ email, name, provider = 'google', providerId, avatar }) {
  if (!email) throw new Error('Email từ nhà cung cấp không hợp lệ.');
  email = String(email).trim().toLowerCase();
  let user = findByEmail(email);

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
  const isAdmin = email === 'hoangpham1618@gmail.com';
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
`;

// Insert before publicUser
code = code.replace('function publicUser(user) {', `${socialFunc}\nfunction publicUser(user) {`);

// Update publicUser to include avatar and authProvider
code = code.replace(
  "    role: user.role,\n",
  "    role: user.role,\n    avatar: user.avatar || null,\n    authProvider: user.authProvider || 'local',\n"
);
code = code.replace(
  "    role: user.role,\r\n",
  "    role: user.role,\r\n    avatar: user.avatar || null,\r\n    authProvider: user.authProvider || 'local',\r\n"
);

// Update module.exports
code = code.replace(
  "  setBroadcast\n};",
  "  setBroadcast,\n  findOrCreateSocialUser\n};"
);
code = code.replace(
  "  setBroadcast\r\n};",
  "  setBroadcast,\r\n  findOrCreateSocialUser\r\n};"
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('accounts.js patched for social auth successfully!');
