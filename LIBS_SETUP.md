# PDF 导出库本地化说明

## 概述

为了减少对外部 CDN 的依赖，PDF 导出功能已改为优先使用本地库文件。如果本地库不存在，仍会使用 CDN 作为后备方案。

## 需要下载的库文件

### 1. jsPDF (v2.5.1)

**用途**：生成 PDF 文档

**下载地址**：
- GitHub: https://github.com/parallax/jsPDF/releases/tag/v2.5.1
- CDN: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js

**安装步骤**：
1. 访问上述任一地址下载 jsPDF 库
2. 将下载的文件重命名为 `jspdf.min.js`
3. 放到项目的 `libs/` 目录下

### 2. html2canvas (v1.4.1)

**用途**：将 HTML 元素转换为 canvas，用于生成 PDF 截图

**下载地址**：
- GitHub: https://github.com/niklasvh/html2canvas/releases/tag/v1.4.1
- CDN: https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js

**安装步骤**：
1. 访问上述任一地址下载 html2canvas 库
2. 将下载的文件重命名为 `html2canvas.min.js`
3. 放到项目的 `libs/` 目录下

## 快速下载脚本

### Windows (PowerShell)

```powershell
# 下载 jsPDF
Invoke-WebRequest -Uri "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" -OutFile "libs/jspdf.min.js"

# 下载 html2canvas
Invoke-WebRequest -Uri "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" -OutFile "libs/html2canvas.min.js"
```

### macOS / Linux (curl)

```bash
# 下载 jsPDF
curl -o libs/jspdf.min.js https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js

# 下载 html2canvas
curl -o libs/html2canvas.min.js https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
```

## 加载优先级

PDF 导出功能加载库的顺序如下：

1. **检查是否已加载** - 如果库已从其他来源加载，直接使用
2. **本地加载** - 尝试从 `libs/` 目录加载
3. **CDN 后备** - 如果本地加载失败，使用 CDN

## 验证安装

打开浏览器控制台，访问应用后执行 PDF 导出功能。如果看到以下日志，说明库加载成功：

```
📄 jsPDF 从本地加载成功
🖼️ html2canvas 从本地加载成功
```

如果看到以下日志，说明使用的是 CDN：

```
📄 jsPDF 从 CDN 加载成功
🖼️ html2canvas 从 CDN 加载成功
```

## 注意事项

1. 库文件较大（约 200KB+），请确保完整下载
2. 如果只下载了占位文件，PDF 导出功能将无法正常工作
3. 建议下载官方发布的稳定版本
4. 本地库文件不需要提交到 git 仓库（已添加到 .gitignore）

## 文件结构

```
01/
├── libs/
│   ├── jspdf.min.js          # 需要下载
│   └── html2canvas.min.js    # 需要下载
├── utils/
│   └── pdf-export.js         # PDF 导出模块（已更新）
└── LIBS_SETUP.md             # 本说明文件
```

## 替代方案

如果不想使用本地库，可以直接修改 `utils/pdf-export.js` 中的 `loadLibraries()` 方法，移除本地加载逻辑，直接使用 CDN。

## 更新日志

- **2026-03-25**: 实现 PDF 导出库本地化，优先使用本地文件，CDN 作为后备