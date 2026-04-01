@echo off
chcp 65001 >nul
echo 正在打开测试页面...
start "" "%~dp0internal-test.html"
timeout /t 2 /nobreak >nul
start "" "%~dp0index.html"
echo 已打开：
echo 1. 内部测试页面
echo 2. AI 探险家主页
echo.
echo 请按 Ctrl+Shift+R 强制刷新查看效果
pause
