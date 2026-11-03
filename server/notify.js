'use strict';

// Admin notifications via Telegram. Configured only through environment variables.
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = require('./config');

const isConfigured = () => Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

/** Fire a Telegram message to the admin chat. Resolves to true when Telegram accepted it. */
async function notifyAdmin(text) {
  if (!isConfigured()) {
    console.info('[notify] Telegram chưa cấu hình, bỏ qua:', text.split('\n')[0]);
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text.slice(0, 4000), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) console.warn('[notify] Telegram trả về', res.status);
    return res.ok;
  } catch (e) {
    console.warn('[notify] Lỗi gửi Telegram:', e.message);
    return false;
  }
}

module.exports = { notifyAdmin, isNotifyConfigured: isConfigured };
