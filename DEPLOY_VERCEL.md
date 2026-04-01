# 🚀 Vercel 部署完整教程

将 AI 探险家应用部署到 Vercel，5 分钟上线你的网站！

---

## 📋 目录

1. [准备工作](#1-准备工作)
2. [创建 GitHub 账号](#2-创建 github 账号)
3. [创建仓库并上传代码](#3-创建仓库并上传代码)
4. [注册 Vercel](#4-注册-vercel)
5. [部署项目](#5-部署项目)
6. [自定义域名（可选）](#6-自定义域名可选)
7. [部署后优化](#7-部署后优化)
8. [常见问题](#8-常见问题)

---

## 1. 准备工作

### 1.1 确认项目文件

确保你的项目文件夹包含以下核心文件：

```
01/
├── index.html              # 主页面
├── styles.css              # 样式文件
├── themes.css              # 主题样式
├── app.js                  # 主程序
├── certificate.js          # 证书生成
├── sounds.js               # 音效管理
├── data-21days.js          # 21 天任务数据
├── manifest.json           # PWA 清单
├── utils/                  # 工具模块目录
│   ├── knowledge.js
│   ├── learning-log.js
│   ├── portfolio.js
│   ├── heatmap.js
│   ├── pdf-export.js
│   └── ...
├── assets/                 # 资源文件
│   └── kling_01.mp4
└── logos/                  # Logo 图片
    └── *.png
```

### 1.2 检查清单

- [ ] 所有 CSS、JS 文件路径使用相对路径
- [ ] 图片、视频资源路径正确
- [ ] 没有本地绝对路径引用
- [ ] 项目可以在本地浏览器正常运行

---

## 2. 创建 GitHub 账号

### 2.1 注册账号

1. 访问 https://github.com
2. 点击 "Sign up" 按钮
3. 输入邮箱地址
4. 设置密码
5. 输入用户名（这将是你未来的网址一部分）
6. 完成验证
7. 点击 "Create account"

### 2.2 验证邮箱

检查邮箱，点击 GitHub 发送的验证链接完成验证。

---

## 3. 创建仓库并上传代码

### 3.1 创建新仓库

1. 登录 GitHub 后，点击右上角头像旁的 "+" 号
2. 选择 "New repository"

### 3.2 填写仓库信息

| 字段 | 填写内容 | 说明 |
|------|----------|------|
| Repository name | `ai-explorer` | 仓库名称，可以自定义 |
| Description | AI 探险家 - 少儿 AI 学习乐园 | 可选，仓库描述 |
| Public | ✅ 选中 | 必须公开才能使用 Vercel 免费部署 |
| Initialize with README | ❌ 不选 | 避免后续上传冲突 |

### 3.3 上传文件

#### 方法 A：网页上传（推荐新手）

1. 仓库创建成功后，点击 "uploading an existing file" 链接
2. 打开项目文件夹，全选所有文件
3. 拖拽到上传区域
4. 等待上传完成
5. 在 "Commit changes" 框中输入 "Initial commit"
6. 点击 "Commit changes" 按钮

#### 方法 B：使用 Git 命令（推荐有经验用户）

```bash
# 进入项目目录
cd c:\Users\Administrator\Documents\trae_projects\01

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 关联远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/ai-explorer.git

# 推送代码
git branch -M main
git push -u origin main
```

### 3.4 验证上传成功

1. 刷新仓库页面
2. 确认所有文件都已显示
3. 检查文件内容是否完整

---

## 4. 注册 Vercel

### 4.1 访问 Vercel

1. 打开浏览器访问：https://vercel.com
2. 点击页面右上角的 "Sign Up" 按钮

### 4.2 使用 GitHub 登录

1. 点击 "Continue with GitHub" 按钮
2. 如果提示授权，点击 "Authorize Vercel" 授权
3. 完成登录后会自动跳转到 Vercel 控制台

### 4.3 完成初始设置

1. 输入你的名字（可选）
2. 选择使用场景（可选）
3. 点击 "Done" 完成

---

## 5. 部署项目

### 5.1 导入项目

1. 在 Vercel 控制台点击 "Add New..." → "Project"
2. 在 "Import Git Repository" 页面找到你的仓库
   - 如果没看到，点击 "Adjust GitHub App Permissions" 授权
3. 点击仓库名旁的 "Import" 按钮

### 5.2 配置项目

在 "Configure Project" 页面：

| 配置项 | 设置 | 说明 |
|--------|------|------|
| Project Name | ai-explorer | 可自定义，会影响网址 |
| Framework Preset | Other | 静态网站选择 Other |
| Root Directory | `./` | 保持默认 |
| Build Command | 留空 | 静态网站不需要构建 |
| Output Directory | 留空 | 保持默认 |
| Install Command | 留空 | 不需要安装依赖 |

### 5.3 开始部署

1. 点击 "Deploy" 按钮
2. 等待部署完成（约 1-2 分钟）
3. 看到 "🎉 Congratulations!" 表示部署成功

### 5.4 获取网址

部署成功后，你会获得一个免费网址：

```
https://ai-explorer-xxxx.vercel.app
```

- `xxxx` 是随机字符
- 点击 "Visit" 按钮访问你的网站
- 点击 "Share" 可以获取分享链接和二维码

---

## 6. 自定义域名（可选）

### 6.1 准备域名

如果你有自己的域名（如 `my-ai-app.com`）：

### 6.2 在 Vercel 添加域名

1. 进入项目页面
2. 点击 "Settings" 标签
3. 左侧菜单点击 "Domains"
4. 在输入框输入你的域名
5. 点击 "Add"

### 6.3 配置 DNS

根据提示配置 DNS 记录：

#### 方式 A：使用 Vercel  Nameservers（推荐）

```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
```

在域名注册商处修改 Nameservers 为以上地址。

#### 方式 B：添加 A 记录

```
类型：A
主机记录：@
记录值：76.76.21.21
TTL：自动
```

#### 方式 C：添加 CNAME 记录

```
类型：CNAME
主机记录：www
记录值：cname.vercel-dns.com
TTL：自动
```

### 6.4 等待生效

DNS 生效时间：通常 5-30 分钟，最长 48 小时

---

## 7. 部署后优化

### 7.1 配置自动部署

Vercel 默认会自动部署：
- 每次推送到 main 分支时自动更新
- 可以在 Settings → Git 中查看配置

### 7.2 添加环境变量（如需要）

如果项目需要 API 密钥等：

1. Settings → Environment Variables
2. 点击 "Add" 添加变量
3. 选择环境（Production/Preview/Development）
4. 保存后重新部署

### 7.3 启用分析功能

1. 在 Vercel 控制台点击 "Analytics"
2. 点击 "Enable" 启用
3. 可以查看访问统计

### 7.4 配置缓存策略

创建 `vercel.json` 文件优化缓存：

```json
{
  "headers": [
    {
      "source": "/(.*\\.css)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.js)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 8. 常见问题

### Q1: 部署后页面空白/404

**原因**：文件路径错误或未正确上传

**解决方法**：
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签的错误信息
3. 检查 Network 标签哪些文件加载失败
4. 确认所有文件都已上传到 GitHub

### Q2: 样式/脚本加载失败

**原因**：路径引用问题

**解决方法**：
1. 确保使用相对路径（如 `./styles.css`）
2. 检查文件是否在正确目录
3. 清除浏览器缓存后重试

### Q3: 数据无法保存

**原因**：localStorage 限制或 HTTPS 问题

**解决方法**：
1. Vercel 默认提供 HTTPS，确保访问 `https://` 开头
2. 检查浏览器是否允许第三方 Cookie
3. 尝试无痕模式测试

### Q4: 图片/视频无法显示

**原因**：资源路径错误

**解决方法**：
1. 检查 `assets/` 和 `logos/` 目录是否上传
2. 确认 HTML 中的路径是相对路径
3. 路径区分大小写（`Assets/` ≠ `assets/`）

### Q5: 如何更新代码？

**方法 A：网页更新**
1. 在 GitHub 仓库页面点击要修改的文件
2. 点击右上角铅笔图标
3. 修改后点击 "Commit changes"
4. Vercel 会自动重新部署（约 1 分钟）

**方法 B：本地更新后推送**
```bash
# 修改文件后
git add .
git commit -m "修复 xxx 问题"
git push
# Vercel 会自动部署
```

### Q6: 如何回滚到之前的版本？

1. 进入 Vercel 项目页面
2. 点击 "Deployments" 标签
3. 找到要回滚的版本
4. 点击 "..." → "Promote to Production"

### Q7: 访问速度慢怎么办？

**解决方法**：
1. Vercel 自带全球 CDN，通常速度很快
2. 如在中国访问慢，可考虑：
   - 使用自定义国内域名
   - 添加 CDN 加速
   - 使用国内部署平台（如阿里云）

### Q8: 免费额度限制

| 资源 | 免费额度 | 说明 |
|------|----------|------|
| 带宽 | 100GB/月 | 个人使用足够 |
| 构建时间 | 6000 分钟/月 | 约 100 小时 |
| 部署次数 | 无限 | 无限制 |
| 域名 | 免费 .vercel.app | 可绑定自定义域名 |

---

## 🎉 部署完成！

恭喜！你的 AI 探险家应用已经部署到互联网了！

### 下一步

1. **分享网址** - 发送给朋友、家人
2. **生成二维码** - 使用 Vercel 的 Share 功能
3. **收集反馈** - 让用户体验并提供建议
4. **持续优化** - 根据反馈改进功能

### 分享文案模板

```
🎉 我开发的 AI 探险家上线啦！
这是一个帮助孩子们学习使用 AI 工具的互动平台
✨ 21 天任务挑战
🏆 成就徽章系统
📊 学习进度追踪
🤖 AI 术语词典

立即体验：https://你的网址.vercel.app
```

---

## 📞 获取帮助

- Vercel 文档：https://vercel.com/docs
- Vercel 社区：https://github.com/vercel/vercel/discussions
- GitHub 文档：https://docs.github.com

---

**祝你部署顺利！** 🚀