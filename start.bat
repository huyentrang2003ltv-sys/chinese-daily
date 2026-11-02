@echo off
chcp 65001 >nul
echo ========================================================
echo   🏮 Học Tiếng Trung Mỗi Ngày - 每日中文
echo   📜 多学一门外语, 多看一个世界, 多过一种人生
echo ========================================================
echo.
echo Đang khởi động máy chủ nội bộ & Bộ quản lý Tunnel tự kết nối lại...
start "Học Tiếng Trung Mỗi Ngày Server" node server.js
timeout /t 2 /nobreak >nul
start "Học Tiếng Trung Mỗi Ngày Tunnel Manager" node tunnel_manager.js
timeout /t 3 /nobreak >nul
echo.
echo Khởi chạy trình duyệt tại: http://localhost:3005
start http://localhost:3005
echo.
echo Đã kích hoạt hệ thống Auto-Reconnect Tunnel! Link sẽ tự động đồng bộ vào Telegram của bạn.
echo.
pause
