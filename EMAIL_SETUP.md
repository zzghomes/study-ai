# 📧 AI21 - 邮件自动发送配置

## ✅ 已配置完成

| 项目 | 状态 |
|------|------|
| Python 环境 | D:\Python\Python314 |
| SMTP 授权码 | 已配置 |
| 邮件脚本 | ✅ 已复制到 AI21/utils |
| 自动任务脚本 | ✅ 已创建 |

---

## 📁 文件位置

**AI21 目录：**
```
C:\Users\Administrator\.openclaw\workspace\AI21\utils\
├── send_vocab_email.py        # 邮件发送脚本
├── send_email_daily.bat       # 每日自动发送
└── 创建自动任务.bat            # Windows 任务配置
```

---

## 🚀 使用步骤

### **1. 测试邮件发送**

```cmd
cd C:\Users\Administrator\.openclaw\workspace\AI21\utils
D:\Python\Python314\python.exe send_vocab_email.py
```

### **2. 配置自动任务**

**右键 → 以管理员身份运行：**
```
创建自动任务.bat
```

### **3. 验证任务**

```cmd
schtasks /Query /TN "AI 词汇库邮件自动发送-AI21"
```

---

## 📊 与 AI 目录的区别

| 项目 | AI | AI21 |
|------|-----|------|
| 任务名称 | AI 词汇库邮件自动发送 | AI 词汇库邮件自动发送-AI21 |
| 词库路径 | memory/ai-vocab-complete.md | memory/ai-vocab-complete.md |
| 收件邮箱 | zzghomes@163.com | zzghomes@163.com |

---

## ⚠️ 注意事项

1. **词库文件路径** - 两个项目共用同一个词库文件
2. **SMTP 配置** - 已同步 AI 目录的配置
3. **执行时间** - 都是每天 11:35

---

**后续所有修改都在 AI21 目录下进行！** 📧✨
