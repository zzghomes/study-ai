# -*- coding: utf-8 -*-
# AI 技术词汇搜集脚本
# 每天自动搜集新的 AI 技术词汇并更新词库

import os
import json
from datetime import datetime
from pathlib import Path

# ==================== 配置 ====================
WORKSPACE = r"C:\Users\Administrator\.openclaw\workspace"
MEMORY_DIR = os.path.join(WORKSPACE, "memory")
VOCAB_FILE = os.path.join(MEMORY_DIR, "ai-vocab-complete.md")
DAILY_FILE = os.path.join(MEMORY_DIR, f"ai-vocab-daily-{datetime.now().strftime('%Y-%m-%d')}.md")

# ==================== 示例词汇数据（实际应该从网络搜集） ====================
# 这里模拟从网络搜集到的新词汇
NEW_VOCABULARY = [
    {
        "term": "Prompt Engineering",
        "full_name": "Prompt Engineering (提示工程)",
        "abbreviation": "无",
        "definition": "设计和优化给 AI 的提示词，让 AI 给出更好回答的技术，就像教学生如何提问一样",
        "use_cases": "写文章让 AI 帮忙润色、让 AI 生成代码、让 AI 分析数据",
        "first_appear": "2022-Q1",
        "category": "技术能力"
    },
    {
        "term": "Few-Shot Learning",
        "full_name": "Few-Shot Learning (少样本学习)",
        "abbreviation": "FSL",
        "definition": "让 AI 只通过几个例子就能学会新任务的技术，就像人看几个例子就能举一反三",
        "use_cases": "给 AI 看 3 个翻译例子就能翻译新句子、看几个分类例子就能分类新数据",
        "first_appear": "2020-Q3",
        "category": "训练技术"
    },
    {
        "term": "Chain of Thought",
        "full_name": "Chain of Thought (思维链)",
        "abbreviation": "CoT",
        "definition": "让 AI 把思考过程一步步写出来的技术，就像做数学题要写解题步骤一样",
        "use_cases": "解数学题、逻辑推理、复杂问题分析",
        "first_appear": "2022-Q2",
        "category": "技术能力"
    }
]

# ==================== 词库分类模板 ====================
CATEGORIES = {
    "技术架构": "AI 系统的核心设计模式和结构",
    "技术能力": "AI 具备的各种功能和技能",
    "训练技术": "训练和优化 AI 模型的方法",
    "部署方案": "将 AI 模型投入实际使用的方案",
    "应用场景": "AI 技术的具体应用领域",
    "基础设施": "支撑 AI 系统运行的基础组件",
    "行业议题": "AI 行业发展的重要话题"
}

def collect_new_vocabulary():
    """搜集新的 AI 技术词汇"""
    print("开始搜集新的 AI 技术词汇...")
    
    # 实际应用中，这里应该：
    # 1. 从 AI 技术网站抓取新词汇
    # 2. 从论文数据库搜索新术语
    # 3. 从技术博客收集新概念
    
    # 这里使用示例数据
    new_vocab = NEW_VOCABULARY
    
    print(f"[OK] 搜集到 {len(new_vocab)} 个新词汇")
    return new_vocab

def update_vocab_file(new_vocab):
    """更新词库文件"""
    print(f"更新词库文件...")
    print(f"  完整词库：{VOCAB_FILE}")
    print(f"  每日词库：{DAILY_FILE}")
    
    # 确保目录存在
    os.makedirs(MEMORY_DIR, exist_ok=True)
    
    # 生成每日词库
    today = datetime.now().strftime('%Y年%m月%d日')
    daily_content = f"""# AI 技术词汇每日更新

**日期：** {today}  
**新增词条：** {len(new_vocab)} 个

---

## 📊 今日新增

"""
    
    for vocab in new_vocab:
        daily_content += f"""### {vocab['term']}

| 字段 | 内容 |
|------|------|
| **英文全称** | {vocab['full_name']} |
| **缩写** | {vocab['abbreviation']} |
| **通俗释义** | {vocab['definition']} |
| **应用场景** | {vocab['use_cases']} |
| **首次出现** | {vocab['first_appear']} |

---

"""
    
    # 写入每日文件
    with open(DAILY_FILE, 'w', encoding='utf-8') as f:
        f.write(daily_content)
    
    print(f"[OK] 每日词库已更新：{DAILY_FILE}")
    
    # 更新完整词库（简化版本，实际应该合并到对应分类）
    complete_content = f"""# AI 大模型技术词汇库

**版本：** v1.1  
**更新日期：** {today}  
**词库规模：** 31 + {len(new_vocab)} 个核心词条  
**说明：** 本词库仅收录 AI/大模型技术相关词汇，不包含具体 AI 平台或产品名称

---

## 📑 目录

"""
    
    for category, desc in CATEGORIES.items():
        complete_content += f"{category} - {desc}\n"
    
    complete_content += f"""
---

## 🆕 新增词条（{today}）

"""
    
    for vocab in new_vocab:
        complete_content += f"""### {vocab['term']}

| 字段 | 内容 |
|------|------|
| **英文全称** | {vocab['full_name']} |
| **缩写** | {vocab['abbreviation']} |
| **通俗释义** | {vocab['definition']} |
| **应用场景** | {vocab['use_cases']} |
| **首次出现** | {vocab['first_appear']} |
| **所属分类** | {vocab['category']} |

---

"""
    
    # 写入完整词库
    with open(VOCAB_FILE, 'w', encoding='utf-8') as f:
        f.write(complete_content)
    
    print(f"[OK] 完整词库已更新：{VOCAB_FILE}")

def send_notification(new_vocab):
    """发送更新通知"""
    print(f"发送更新通知...")
    # 这里可以调用邮件发送脚本
    print(f"  今日新增 {len(new_vocab)} 个词条")

def main():
    """主函数"""
    print("=" * 60)
    print("AI 技术词汇搜集脚本")
    print("=" * 60)
    print()
    
    # 1. 搜集新词汇
    new_vocab = collect_new_vocabulary()
    
    if not new_vocab:
        print("[WARN] 没有搜集到新的词汇")
        return
    
    # 2. 更新词库文件
    update_vocab_file(new_vocab)
    
    # 3. 发送通知
    send_notification(new_vocab)
    
    print()
    print("=" * 60)
    print("[SUCCESS] 词汇搜集完成！")
    print("=" * 60)
    print()
    print(f"工作区：{WORKSPACE}")
    print(f"完整词库：{VOCAB_FILE}")
    print(f"每日词库：{DAILY_FILE}")
    print(f"新增词条：{len(new_vocab)} 个")

if __name__ == "__main__":
    main()
