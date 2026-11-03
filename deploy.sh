#!/usr/bin/env bash
# ========================================================
# YUHAN HSK - VPS deploy script (Ubuntu 20.04+ / Debian 11+)
# Run from the root of a cloned repository:
#   git clone <repo> /var/www/yuhan-hsk && cd /var/www/yuhan-hsk && sudo ./deploy.sh
# The app listens on PORT (default 3000); put Caddy/nginx in front for 80/443.
# ========================================================
set -euo pipefail

APP_NAME="yuhan-hsk"
APP_PORT="${PORT:-3000}"
cd "$(dirname "$0")"

echo "🚀 [YUHAN HSK] Deploying from $(pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "📦 Installing Node.js 20.x..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "Node $(node -v) / npm $(npm -v)"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "📦 Installing PM2..."
  npm install -g pm2
fi

# One-time migration: older versions kept accounts in data/users.json inside the repo.
# Keep a copy for the server to import, then drop the local changes so `git pull` can proceed.
if [ -f data/users.json ] && [ ! -f storage/users.json ]; then
  echo "🗂️  Migrating data/users.json -> storage/legacy-users.json"
  mkdir -p storage
  cp data/users.json storage/legacy-users.json
fi
git checkout -- data/users.json data/visitor_stats.json 2>/dev/null || true

echo "📦 Installing dependencies & building assets..."
git pull --ff-only || true
npm ci
npm run build
npm prune --omit=dev

echo "⚡ (Re)starting $APP_NAME on port $APP_PORT..."
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  PORT="$APP_PORT" NODE_ENV=production pm2 reload "$APP_NAME" --update-env
else
  PORT="$APP_PORT" NODE_ENV=production pm2 start server.js --name "$APP_NAME" --time
fi
pm2 save
pm2 startup systemd -u "$(logname 2>/dev/null || echo root)" --hp "$HOME" >/dev/null 2>&1 || true

echo "========================================================"
echo "🎉 Deployed. Health check: curl http://127.0.0.1:${APP_PORT}/healthz"
echo "   Logs: pm2 logs ${APP_NAME}"
echo "   Expose publicly via a reverse proxy, e.g. Caddyfile:"
echo "     your-domain.com { reverse_proxy 127.0.0.1:${APP_PORT} }"
echo "========================================================"
