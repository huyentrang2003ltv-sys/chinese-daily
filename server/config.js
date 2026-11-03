'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

/** Load KEY=VALUE pairs from ./.env without overriding variables that are already set. */
function loadDotEnv(file) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (e) {
    return;
  }
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (!match || match[1] in process.env) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
if (process.env.NODE_ENV !== 'test') loadDotEnv(path.join(ROOT, '.env'));

module.exports = {
  ROOT,
  PUBLIC_DIR: path.join(ROOT, 'public'),
  /** Runtime data (accounts, sessions key, visitor counters). Never served, never committed. */
  STORAGE_DIR: path.resolve(ROOT, process.env.STORAGE_DIR || 'storage'),
  PORT: Number(process.env.PORT) || 3005,
  HOST: process.env.HOST || '0.0.0.0',
  IS_PROD: process.env.NODE_ENV === 'production',
  /** Trust X-Forwarded-For / X-Forwarded-Proto (set when running behind nginx or Cloudflare). */
  TRUST_PROXY: /^(1|true|yes|on)$/i.test(process.env.TRUST_PROXY || ''),
  SESSION_SECRET: process.env.SESSION_SECRET || '',
  TTS_RATE_LIMIT: Number(process.env.TTS_RATE_LIMIT) || 120,
  /** VIP payment details shown to students (VietQR). */
  PAYMENT: {
    bankBin: String(process.env.PAYMENT_BANK_BIN || '').trim(),
    bankName: String(process.env.PAYMENT_BANK_NAME || '').trim(),
    accountNo: String(process.env.PAYMENT_ACCOUNT_NO || '').trim(),
    accountName: String(process.env.PAYMENT_ACCOUNT_NAME || '').trim()
  },
  VIP_PRICES: { monthly: 99000, yearly: 499000, lifetime: 899000 },
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || ''
};
