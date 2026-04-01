# 📸 豆包图标替换说明

## 步骤

### 1. 保存图片
将你发送的豆包图标图片保存到：
```
C:\Users\Administrator\.openclaw\workspace\ai-explorer\logos\doubao.png
```

**保存方法：**
- 右键点击图片 → "另存为" → 保存到上述文件夹
- 或者截图后粘贴到画图工具 → 保存为 `doubao.png`

### 2. 确认文件名
确保文件名为：`doubao.png`

如果图片格式是其他格式（如 .jpg, .jpeg），请修改 `data.js` 第 9 行：
```javascript
icon: 'logos/doubao.jpg',  // 根据实际格式修改
```

### 3. 测试
双击打开 `index.html`，检查首页快捷入口第一个卡片是否显示新图标。

---

## 文件位置
```
ai-explorer/
├── logos/
│   └── doubao.png    ← 把图片放这里
├── data.js           ← 已修改
└── index.html
```

---

## 如果图标不显示

1. **检查文件路径** - 确保图片在正确的文件夹
2. **检查文件名** - 确保文件名拼写正确（区分大小写）
3. **清除浏览器缓存** - 按 Ctrl+F5 强制刷新
4. **检查控制台** - 按 F12 查看是否有图片加载错误
