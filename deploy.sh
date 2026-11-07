#!/usr/bin/env bash
# ========================================================
# CHINESE DAILY (Học Tiếng Trung Mỗi Ngày) - VPS Production Deployment
# Target Directory: /opt/chinese-daily
# Port: 3005 (Behind Nginx reverse proxy on 80/443)
# ========================================================
set -euo pipefail

APP_NAME="chinese-daily"
APP_DIR="/opt/chinese-daily"
APP_PORT="${PORT:-3005}"
LOG_DIR="/var/log/chinese-daily"

echo "========================================================"
echo "🚀 [CHINESE DAILY] Starting production deployment..."
echo "========================================================"

# 1. Ensure required system packages
if ! command -v node >/dev/null 2>&1; then
  echo "📦 Installing Node.js 20.x..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "✓ Node $(node -v) / npm $(npm -v)"

if ! command -v git >/dev/null 2>&1; then
  echo "📦 Installing git..."
  apt-get update -y && apt-get install -y git
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "📦 Installing PM2 globally..."
  npm install -g pm2
fi

# 2. Setup target directories
echo "📁 Setting up directories..."
mkdir -p "$APP_DIR" "$APP_DIR/storage" "$LOG_DIR"

cd "$APP_DIR"

# 3. Pull latest code if git repo exists, otherwise clone
if [ ! -d ".git" ]; then
  echo "📥 Cloning repository from GitHub..."
  git clone https://github.com/huyentrang2003ltv-sys/chinese-daily.git .
else
  echo "📥 Fetching and pulling latest changes..."
  git reset --hard HEAD
  git pull origin main
fi

# 4. Install production dependencies and build assets
echo "📦 Installing dependencies & building assets..."
npm ci
npm run build
npm prune --omit=dev

# 5. Setup PM2 Process Management
echo "⚡ Starting/Reloading application with PM2..."
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

# 6. Configure Nginx if installed
if command -v nginx >/dev/null 2>&1; then
  echo "🌐 Configuring Nginx reverse proxy..."
  if [ -f "$APP_DIR/deploy/nginx.conf" ]; then
    cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/chinese-daily
    ln -sf /etc/nginx/sites-available/chinese-daily /etc/nginx/sites-enabled/chinese-daily
    rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
    nginx -t && systemctl reload nginx || echo "⚠️ Nginx test failed, check manual configuration"
  fi
fi

echo "========================================================"
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "   Status:      pm2 status"
echo "   Logs:        pm2 logs $APP_NAME"
echo "   Log files:   $LOG_DIR/access.log & $LOG_DIR/error.log"
echo "   Healthcheck: curl http://127.0.0.1:$APP_PORT/healthz"
echo "========================================================"
