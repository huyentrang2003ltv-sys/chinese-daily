@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================================
echo   🏮 Học Tiếng Trung Mỗi Ngày - 每日中文
echo   📜 多学一门外语, 多看一个世界, 多过一种人生
echo ========================================================
echo.
if not exist node_modules (
  echo Đang cài đặt thư viện lần đầu...
  call npm install
)
echo Đang build giao diện (Tailwind CSS)...
call npm run build:css
echo Đang khởi động máy chủ nội bộ...
start "Học Tiếng Trung Mỗi Ngày Server" node server.js
if exist .env (
  timeout /t 2 /nobreak >nul
  start "Học Tiếng Trung Mỗi Ngày Tunnel Manager" node --env-file=.env tunnel_manager.js
)
timeout /t 2 /nobreak >nul
echo Khởi chạy trình duyệt tại: http://localhost:3005
start http://localhost:3005
echo.
pause
