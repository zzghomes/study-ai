# -*- coding: utf-8 -*-
# 修复 data-21days.js 中的图标路径

import re

file_path = 'C:\\Users\\Administrator\\.openclaw\\workspace\\AI21\\data-21days.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 替换 DeepSeek 图标
content = re.sub(
    r"(id: 'deepseek',\s+name: 'DeepSeek',\s+company: '深度求索',\s+)icon: '[^']+'",
    r"\1icon: 'logos/deepseek.png'",
    content
)

# 替换 Kimi 图标
content = re.sub(
    r"(id: 'kimi',\s+name: 'Kimi',\s+company: '月之暗面',\s+)icon: '[^']+'",
    r"\1icon: 'logos/kimi.png'",
    content
)

# 替换文心一言图标
content = re.sub(
    r"(id: 'ernie',\s+name: '文心一言',\s+company: '百度',\s+)icon: '[^']+'",
    r"\1icon: 'logos/wenxin.png'",
    content
)

# 替换智谱清言图标
content = re.sub(
    r"(id: 'glm',\s+name: '智谱清言',\s+company: '智谱 AI',\s+)icon: '[^']+'",
    r"\1icon: 'logos/qingyan.png'",
    content
)

# 替换腾讯元宝图标
content = re.sub(
    r"(id: 'yuanbao',\s+name: '腾讯元宝',\s+company: '腾讯',\s+)icon: '[^']+'",
    r"\1icon: 'logos/yuanbao.png'",
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Icon paths updated successfully!')
print('Updated platforms:')
print('  - DeepSeek -> logos/deepseek.png')
print('  - Kimi -> logos/kimi.png')
print('  - Wenxin Yiyiyan -> logos/wenxin.png')
print('  - Zhipu Qingyan -> logos/qingyan.png')
print('  - Tencent Yuanbao -> logos/yuanbao.png')
print('Please refresh page with Ctrl+Shift+R!')
