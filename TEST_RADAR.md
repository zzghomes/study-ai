# 🧪 能力雷达图功能测试指南

## 问题排查步骤

### 1. 清除浏览器缓存
由于更新了 JS 文件，需要清除缓存：

**Chrome/Edge:**
- 按 `Ctrl+Shift+Delete`
- 选择"缓存的图片和文件"
- 点击"清除数据"

**或者强制刷新:**
- 按 `Ctrl+F5` (Windows)
- 或 `Ctrl+Shift+R` (Mac)

### 2. 打开浏览器控制台
1. 打开 `index.html`
2. 按 `F12` 打开开发者工具
3. 切换到 "Console" (控制台) 标签
4. 点击"家长"导航按钮
5. 输入密码进入家长页面
6. 点击"💡 个性化推荐"按钮

### 3. 查看控制台输出

**正常情况应该看到:**
```
🔍 点击个性化推荐按钮
当前面板显示状态：none
显示推荐面板
```

**如果看到错误:**
- `Cannot read property 'showRecommendations' of null` → app 对象未初始化
- `Cannot find element` → DOM 元素未加载
- 其他错误 → 请复制完整错误信息

### 4. 手动测试 app 对象

在控制台输入：
```javascript
console.log('app 对象:', window.app);
console.log('showRecommendations 方法:', window.app.showRecommendations);
```

**应该看到:**
- `app 对象:` 后面显示 AIExplorerApp 实例
- `showRecommendations 方法:` 显示函数定义

### 5. 手动调用函数

在控制台输入：
```javascript
window.app.showRecommendations();
```

如果面板展开，说明函数正常，问题在按钮绑定。
如果没反应，查看控制台错误信息。

---

## 常见问题解决

### 问题 1: 点击按钮没反应

**原因:** 浏览器缓存了旧版本 JS 文件

**解决:**
1. 按 `Ctrl+Shift+Delete` 清除缓存
2. 或按 `Ctrl+F5` 强制刷新
3. 或在 URL 后加 `?t=123456` 强制刷新

### 问题 2: 控制台显示 "app is not defined"

**原因:** app 对象未暴露到全局作用域

**解决:**
已修复，代码中添加了 `window.app = app;`

### 问题 3: 面板展开但没有内容

**原因:** 没有学习数据

**解决:**
1. 先完成几个学习任务
2. 或者在控制台手动设置测试数据：
```javascript
LEARNING_TASKS[0].completed = true;
LEARNING_TASKS[0].completedCases = [0, 1, 2];
app.saveData();
app.renderParents();
```

### 问题 4: 样式显示异常

**原因:** CSS 缓存

**解决:**
1. 清除浏览器缓存
2. 强制刷新页面

---

## 快速测试命令

在浏览器控制台依次执行：

```javascript
// 1. 检查 app 对象
console.log('App:', window.app !== undefined);

// 2. 检查方法
console.log('Method:', typeof window.app.showRecommendations);

// 3. 检查 DOM 元素
console.log('Panel:', document.getElementById('recommendation-panel'));

// 4. 手动调用
window.app.showRecommendations();
```

---

## 如果问题依然存在

请提供以下信息：

1. **浏览器版本:** (Chrome/Edge/Firefox 等)
2. **控制台完整错误信息:** (截图或复制文字)
3. **操作步骤:** (详细点击顺序)
4. **是否清除缓存:** (是/否)
5. **URL 地址:** (本地文件路径或服务器地址)

---

## 更新日期
2026 年 3 月 19 日 16:45
