@echo off
chcp 65001 >nul
echo ====================================
echo AI 探险家 - 星空主题修复
echo ====================================
echo.
echo 正在清除缓存...
echo.

REM 清除浏览器缓存
taskkill /f /im chrome.exe >nul 2>&1
taskkill /f /im msedge.exe >nul 2>&1
taskkill /f /im firefox.exe >nul 2>&1

timeout /t 2 /nobreak >nul

echo 正在打开 AI 探险家页面...
start "" "%~dp0index.html?v=%random%"
echo.
echo 页面已打开！
echo.
echo 请按以下步骤操作：
echo 1. 按 F12 打开开发者工具
echo 2. 在 Network（网络）标签勾选"Disable cache"
echo 3. 按 Ctrl+Shift+R 强制刷新
echo 4. 点击右下角深紫色按钮（星空主题）
echo.
echo 如果还是看不到星星，请查看 Console 标签的错误信息
echo.
pause
