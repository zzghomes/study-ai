# 修复 data-21days.js 中的图标路径

$file = "C:\Users\Administrator\.openclaw\workspace\AI21\data-21days.js"
$content = Get-Content $file -Encoding UTF8 -Raw

# DeepSeek 图标替换
$content = $content -replace "(id: 'deepseek',\s+name: 'DeepSeek',\s+company: '深度求索',\s+)icon: '[^']+'", "`$1icon: 'logos/deepseek.png'"

# Kimi 图标替换
$content = $content -replace "(id: 'kimi',\s+name: 'Kimi',\s+company: '月之暗面',\s+)icon: '[^']+'", "`$1icon: 'logos/kimi.png'"

# 文心一言图标替换
$content = $content -replace "(id: 'ernie',\s+name: '文心一言',\s+company: '百度',\s+)icon: '[^']+'", "`$1icon: 'logos/wenxin.png'"

# 智谱清言图标替换
$content = $content -replace "(id: 'glm',\s+name: '智谱清言',\s+company: '智谱 AI',\s+)icon: '[^']+'", "`$1icon: 'logos/qingyan.png'"

# 腾讯元宝图标替换
$content = $content -replace "(id: 'yuanbao',\s+name: '腾讯元宝',\s+company: '腾讯',\s+)icon: '[^']+'", "`$1icon: 'logos/yuanbao.png'"

# 保存文件
$content | Set-Content $file -Encoding UTF8

Write-Host "✅ 图标路径已更新！" -ForegroundColor Green
Write-Host ""
Write-Host "已更新的平台图标：" -ForegroundColor Cyan
Write-Host "  ✅ DeepSeek → logos/deepseek.png"
Write-Host "  ✅ Kimi → logos/kimi.png"
Write-Host "  ✅ 文心一言 → logos/wenxin.png"
Write-Host "  ✅ 智谱清言 → logos/qingyan.png"
Write-Host "  ✅ 腾讯元宝 → logos/yuanbao.png"
Write-Host ""
Write-Host "请刷新页面查看效果！" -ForegroundColor Yellow
