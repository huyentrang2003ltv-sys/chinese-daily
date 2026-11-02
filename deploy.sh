#!/usr/bin/env bash
# ========================================================
# YUHAN HSK - One-Click VPS Auto-Deploy Script
# Hệ điều hành hỗ trợ: Ubuntu 20.04+, Debian 11+, CentOS 8+
# ========================================================

set -e

echo "🚀 [YUHAN HSK] Bắt đầu triển khai ứng dụng lên VPS..."

# 1. Update system packages
echo "📦 1/5 Đang cập nhật gói hệ thống..."
if [ -x "$(command -v apt-get)" ]; then
    apt-get update -y
    apt-get install -y curl wget git unzip ufw
elif [ -x "$(command -v yum)" ]; then
    yum update -y
    yum install -y curl wget git unzip
fi

# 2. Install Node.js 20.x LTS if not installed
echo "📦 2/5 Kiểm tra và cài đặt Node.js LTS..."
if ! command -v node &> /dev/null; then
    echo "Đang tải Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs || yum install -y nodejs
fi
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Install PM2 (Process Manager) globally
echo "📦 3/5 Cài đặt PM2 để duy trì web chạy 24/7 vĩnh viễn..."
npm install -g pm2

# 4. Configure Application
APP_DIR="/var/www/yuhan-hsk"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

echo "📂 Thư mục triển khai: $APP_DIR"

# 5. Open Ports in Firewall (Port 80 & 3000)
echo "🔒 4/5 Mở cổng tường lửa Firewall (Port 80, 3000, 443)..."
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp
    ufw allow 3000/tcp
    ufw allow 443/tcp
    ufw allow 22/tcp
    ufw --force enable || true
fi

# 6. Start / Restart App with PM2
echo "⚡ 5/5 Khởi động ứng dụng YUHAN HSK bằng PM2..."
pm2 stop yuhan-hsk 2>/dev/null || true
PORT=80 pm2 start server.js --name "yuhan-hsk" --time

# Configure PM2 startup to auto restart on VPS reboot
pm2 startup | tail -n 1 | bash 2>/dev/null || true
pm2 save

PUBLIC_IP=$(curl -s ifconfig.me || curl -s icanhazip.com || echo "IP_CUA_BAN")

echo "========================================================"
echo "🎉 CHÚC MỪNG! Triển khai YUHAN HSK lên VPS thành công!"
echo "🌐 Bạn có thể truy cập ngay tại:"
echo "   👉 http://${PUBLIC_IP}"
echo "   👉 http://${PUBLIC_IP}:3000"
echo "========================================================"
echo "💡 Các lệnh quản trị hữu ích trên VPS:"
echo "   • Xem trạng thái web: pm2 status"
echo "   • Xem log trực tiếp:  pm2 logs yuhan-hsk"
echo "   • Khởi động lại web:  pm2 restart yuhan-hsk"
echo "========================================================"
