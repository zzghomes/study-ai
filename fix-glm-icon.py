# -*- coding: utf-8 -*-
import re

file_path = 'C:\\Users\\Administrator\\.openclaw\\workspace\\AI21\\data-21days.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 替换智谱清言图标（glm）
content = re.sub(
    r"(id: 'glm',\s+name: '智谱清言',\s+company: '智谱 AI[^,]*,\s+)icon: '[^']+'",
    r"\1icon: 'logos/qingyan.png'",
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Zhipu Qingyan icon updated to logos/qingyan.png!')
