#!/usr/bin/env bash
# ========================================================
# CHINESE DAILY (Học Tiếng Trung Mỗi Ngày) - VPS Production Deployment
# Target: Auto-detects current repo or /opt/chinese-daily
# Port: 3005 (Behind Nginx reverse proxy on 80/443)
# ========================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${APP_DIR:-$SCRIPT_DIR}"
APP_NAME="${APP_NAME:-yuhan-hsk}"
APP_PORT="${PORT:-3005}"
LOG_DIR="$APP_DIR/logs"

echo "========================================================"
echo "🚀 [CHINESE DAILY] Starting production deployment..."
echo "   Directory: $APP_DIR"
echo "   App Name:  $APP_NAME"
echo "   Port:      $APP_PORT"
echo "========================================================"

# Find Node, NPM and PM2
export PATH="$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node 2>/dev/null | tail -n 1)/bin:$HOME/.local/bin:/usr/local/bin:$PATH"

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js not found in PATH"
  exit 1
fi
echo "✓ Node $(node -v) / npm $(npm -v)"

PM2_BIN="$(command -v pm2 || find $HOME -name pm2 2>/dev/null | grep '/bin/pm2$' | head -n 1 || echo 'pm2')"
echo "✓ PM2 binary: $PM2_BIN"

# 2. Setup target directories
echo "📁 Setting up storage and logs..."
mkdir -p "$APP_DIR/storage" "$LOG_DIR"

cd "$APP_DIR"

# 3. Pull latest code if git repo exists
if [ -d ".git" ]; then
  echo "📥 Fetching and pulling latest changes from main..."
  git reset --hard HEAD
  git pull origin main
fi

# 4. Install production dependencies and build assets
echo "📦 Installing dependencies & building assets..."
npm install --omit=dev --no-audit --no-fund

# 5. Setup PM2 Process Management
echo "⚡ Starting/Reloading application with PM2..."
if $PM2_BIN describe "$APP_NAME" >/dev/null 2>&1; then
  $PM2_BIN reload ecosystem.config.cjs --update-env || $PM2_BIN restart "$APP_NAME"
else
  $PM2_BIN start ecosystem.config.cjs
fi
$PM2_BIN save || true

# 6. Verify Healthcheck
sleep 2
echo "🔍 Checking application health on http://127.0.0.1:$APP_PORT/healthz..."
if curl -sf "http://127.0.0.1:$APP_PORT/healthz" >/dev/null 2>&1 || curl -sf "http://127.0.0.1:$APP_PORT/" >/dev/null 2>&1; then
  echo "✅ Server is running healthy on port $APP_PORT!"
else
  echo "⚠️ Note: Application is starting up, check with: $PM2_BIN logs $APP_NAME"
fi

echo "========================================================"
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "   Status:      $PM2_BIN status"
echo "   Logs:        $PM2_BIN logs $APP_NAME"
echo "   Log dir:     $LOG_DIR"
echo "   Local URL:   http://127.0.0.1:$APP_PORT"
echo "========================================================"
