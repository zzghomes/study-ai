# 🎨 粘土质感测试指南

**更新时间：** 2026 年 3 月 19 日 17:20

---

## 🔍 问题诊断

如果您看不到粘土橡皮泥质感，请按以下步骤操作：

---

## ✅ 步骤 1: 清除浏览器缓存（最重要！）

### Chrome/Edge:
1. 按 `Ctrl + Shift + Delete`
2. 选择"缓存的图片和文件"
3. 时间范围选择"全部时间"
4. 点击"清除数据"

### 或者强制刷新:
- 按 `Ctrl + F5` (Windows)
- 或 `Ctrl + Shift + R` (Mac/Linux)

---

## ✅ 步骤 2: 测试独立页面

打开测试页面验证粘土效果是否正常：

```
ai-explorer/clay-test.html
```

**直接双击打开** 或拖到浏览器中。

### 应该看到的效果：

1. **卡片有厚重阴影**
   ```
   ┌─────────────────────┐
   │   🚀 AI 探险家       │  ← 卡片浮起
   │   探索 15+ 主流 AI 平台  │
   └─────────────────────┘
      明显阴影区
   ```

2. **按钮是 3D 凸起的**
   - 默认状态：凸起
   - 悬停：上浮
   - 点击：压扁

3. **进度条有凹槽**
   ```
   ╭──────────────────╮  ← 凹槽边缘
   │████████░░░░░░░░│  ← 凸起填充
   ╰──────────────────╯
   ```

4. **连击计数器是圆球**
   - 圆形胶囊状
   - 有脉动动画
   - 明显高光和阴影

---

## ✅ 步骤 3: 检查主题切换

1. 打开 `index.html`
2. 点击右下角主题切换器
3. **确保选择第一个"🎨 粘土风"**

主题按钮颜色：
- 🎨 粘土风 = 粉橙色渐变
- 🪸 珊瑚橙 = 橙红色
- 🌿 薄荷绿 = 青绿色
- 等等...

---

## ✅ 步骤 4: 检查元素样式

### 在浏览器中按 F12 打开开发者工具

1. **检查卡片样式**
   ```javascript
   // 在控制台执行
   const card = document.querySelector('.hero-section');
   console.log('背景:', getComputedStyle(card).background);
   console.log('阴影:', getComputedStyle(card).boxShadow);
   console.log('圆角:', getComputedStyle(card).borderRadius);
   ```

   **应该输出：**
   ```
   背景：rgb(255, 255, 255) 或 #FFFFFF
   阴影：rgba(180, 140, 120, 0.18) ... (双层阴影)
   圆角：32px
   ```

2. **检查当前主题**
   ```javascript
   console.log('当前主题:', document.documentElement.getAttribute('data-theme'));
   ```
   
   **应该输出：** `clay`

3. **如果主题不对，手动设置**
   ```javascript
   document.documentElement.setAttribute('data-theme', 'clay');
   ```

---

## 🎯 粘土质感关键特征

### 视觉上应该看到：

| 元素 | 特征 | 检查点 |
|------|------|--------|
| **卡片** | 厚重、浮起 | 底部有明显阴影 |
| **按钮** | 3D 凸起 | 点击会压扁 |
| **进度条** | 凹槽背景 | 填充条凸起 |
| **输入框** | 凹陷 | 像刻进去的 |
| **圆角** | 超大 | 至少 20px+ |
| **颜色** | 温暖奶油调 | 粉橙色系 |

### 不应该看到：

- ❌ 纯平的设计
- ❌ 锐利的直角
- ❌ 冷色调（蓝色/紫色为主）
- ❌ 单层淡阴影
- ❌ 透明毛玻璃效果

---

## 🔧 常见问题解决

### 问题 1: 卡片还是平的

**原因：** CSS 未加载或被覆盖

**解决：**
```javascript
// 在控制台执行，强制应用样式
document.querySelectorAll('.hero-section, .progress-card, .task-card').forEach(el => {
  el.style.boxShadow = '12px 12px 24px rgba(180, 140, 120, 0.18), -8px -8px 20px rgba(255, 255, 255, 1)';
  el.style.borderRadius = '32px';
  el.style.background = '#FFFFFF';
});
```

### 问题 2: 主题切换没反应

**原因：** 缓存或 JS 错误

**解决：**
1. 清除缓存（步骤 1）
2. 检查控制台是否有错误（F12 → Console）
3. 手动设置主题：
   ```javascript
   document.documentElement.setAttribute('data-theme', 'clay');
   ```

### 问题 3: 阴影太淡

**原因：** 浏览器渲染问题

**解决：**
```javascript
// 加强阴影
document.documentElement.style.setProperty('--clay-shadow', 
  '16px 16px 32px rgba(180, 140, 120, 0.25), -10px -10px 24px rgba(255, 255, 255, 1)');
```

### 问题 4: 颜色不对

**检查主题变量：**
```javascript
// 在控制台执行
const styles = getComputedStyle(document.documentElement);
console.log('背景主色:', styles.getPropertyValue('--bg-primary'));
console.log('强调色:', styles.getPropertyValue('--accent-primary'));
```

**应该输出：**
```
背景主色：#FFEBE0 或 rgb(255, 235, 224)
强调色：#FF6B5B 或 rgb(255, 107, 91)
```

---

## 📸 效果对比

### 粘土风 ✅
```
╭───────────────────────────╮
│   🚀 AI 探险家             │  ← 圆角 32px
│   探索 15+ 主流 AI 平台      │  ← 白色背景
╰───────────────────────────╯
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← 厚重阴影
```

### 普通扁平 ❌
```
┌───────────────────────────┐
│   🚀 AI 探险家             │  ← 直角或小圆角
│   探索 15+ 主流 AI 平台      │  ← 可能透明
└───────────────────────────┘
  （无明显阴影或很淡）
```

---

## 🎨 粘土风配色参考

```
背景：#FFEBE0 █ 奶油米色
卡片：#FFFFFF █ 纯白
强调：#FF6B5B █ 珊瑚粉橙
次要：#FFA06B █ 柔和桃色
文字：#4A3F45 █ 深灰紫
```

---

## 📝 检查清单

打开页面后，逐一检查：

- [ ] 主题是"🎨 粘土风"（第一个）
- [ ] 卡片是白色背景
- [ ] 卡片有厚重阴影（右下深色 + 左上浅色）
- [ ] 卡片圆角很大（32px）
- [ ] 按钮是粉橙色渐变
- [ ] 按钮点击有压缩效果
- [ ] 进度条有凹槽感
- [ ] 整体色调温暖（粉橙色系）
- [ ] 没有透明毛玻璃效果

**如果以上都满足** → 粘土质感正确 ✅

**如果有不满足的** → 按对应步骤解决

---

## 🆘 还是不行？

### 终极解决方案

1. **完全刷新：**
   - 关闭浏览器
   - 重新打开
   - 按 `Ctrl + Shift + Delete` 清除所有缓存
   - 重新访问页面

2. **手动应用样式：**
   ```javascript
   // 在控制台执行全部
   document.documentElement.setAttribute('data-theme', 'clay');
   
   document.querySelectorAll('.hero-section, .progress-card, .today-card, .task-card, .platform-card').forEach(el => {
     el.style.background = '#FFFFFF !important';
     el.style.borderRadius = '32px !important';
     el.style.boxShadow = '12px 12px 24px rgba(180, 140, 120, 0.18), -8px -8px 20px rgba(255, 255, 255, 1)';
   });
   ```

3. **使用测试页面：**
   - 直接打开 `clay-test.html`
   - 这个页面独立于主应用，不受其他样式影响

---

## 📞 需要帮助？

请提供以下信息：

1. **浏览器名称和版本**
   - Chrome: `chrome://version`
   - Edge: `edge://version`

2. **控制台截图**
   - F12 → Console → 截图

3. **元素样式截图**
   - F12 → Elements → 选择 `.hero-section` → 截图 Styles 面板

4. **当前主题**
   ```javascript
   console.log(document.documentElement.getAttribute('data-theme'));
   ```

---

**祝测试顺利！** 🎨✨
