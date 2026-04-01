@echo off
chcp 65001 >nul
echo ====================================
echo AI 探险家 - 星空主题修复工具
echo ====================================
echo.
echo 正在清除浏览器缓存...
echo.
echo 请关闭所有打开的浏览器窗口，然后按任意键继续...
pause >nul
echo.
echo 正在打开 AI 探险家页面...
start "" "%~dp0index.html"
echo.
echo 页面已打开！
echo.
echo 请按以下步骤操作：
echo 1. 在打开的页面中按 F12 打开开发者工具
echo 2. 按 Ctrl+Shift+R 强制刷新页面
echo 3. 点击右下角的深紫色主题按钮（星空）
echo 4. 查看 Console（控制台）中是否有错误
echo.
echo 如果看到错误，请截图告诉我！
echo.
pause
