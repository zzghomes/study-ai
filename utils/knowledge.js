/**
 * 知识库/学习资源模块
 * 提供 AI 学习资源、提示词模板、AI 术语解释、主流 AI 平台介绍
 */

class KnowledgeManager {
  constructor(app) {
    this.app = app;
    this.resources = this.getDefaultResources();
    this.templates = this.getDefaultTemplates();
    this.favorites = { templates: [], terms: [], platforms: [] };
    this.terms = this.getAITerms();
    this.platforms = this.getAIPlatforms();
    this.sortMode = 'time';
    this.searchQuery = { terms: '', platforms: '' };
    this.readTerms = [];
    this.readPlatforms = [];
    this.contributions = [];
    this.compareList = [];
    this.currentTemplateFilter = 'all'; // 当前选中的模板分类筛选器
    this.currentPlatformFilter = 'all'; // 当前选中的平台分类筛选器
    this.load();
    this.bindGlobalMethods();
  }

  bindGlobalMethods() {
    window.showResourcesModal = () => this.showResourcesModal();
    window.showTemplatesModal = () => this.showTemplatesModal();
    window.showFavoritesModal = () => this.showFavoritesModal();
    window.showTermsModal = () => this.showTermsModal();
    window.showPlatformsModal = () => this.showPlatformsModal();
    window.showKnowledgeBase = () => this.showKnowledgeBase();
    window.toggleSortMode = () => this.toggleSortMode();
    window.showTermDetail = (termKey) => this.showTermDetail(termKey);
    window.showPlatformDetail = (platformKey) => this.showPlatformDetail(platformKey);
    window.toggleTermFavorite = (termKey) => this.toggleTermFavorite(termKey);
    window.togglePlatformFavorite = (platformKey) => this.togglePlatformFavorite(platformKey);
    window.showCompareModal = () => this.showCompareModal();
    window.addToCompare = (platformKey) => this.addToCompare(platformKey);
    window.showQuizModal = (termKey) => this.showQuizModal(termKey);
    window.showContributeModal = (type) => this.showContributeModal(type);
    window.submitContribution = () => this.submitContribution();
    window.searchTerms = (query) => this.handleTermSearch(query);
    window.searchPlatforms = (query) => this.handlePlatformSearch(query);
    window.copyTemplate = (encodedPrompt) => this.copyTemplate(encodedPrompt);
    window.toggleFavoriteAndRefresh = (title) => this.toggleFavoriteAndRefresh(title);
    window.markTermAsRead = (termKey) => this.markTermAsRead(termKey);
    window.markPlatformAsRead = (platformKey) => this.markPlatformAsRead(platformKey);
    // checkQuizAnswer 使用动态获取 window.app.knowledge 的方式，避免 this 指向问题
    window.checkQuizAnswer = function(i, correct, key) {
      if (window.app && window.app.knowledge) {
        return window.app.knowledge.checkQuizAnswer(i, correct, key);
      } else {
        console.error('❌ knowledge 实例未找到');
      }
    };
    window.clearCompare = () => this.clearCompare();
    window.handleTermSearch = (q) => this.handleTermSearch(q);
    window.handlePlatformSearch = (q) => this.handlePlatformSearch(q);
    window.showResourceCategoryDetail = (category) => this.showResourceCategoryDetail(category);
    window.filterTemplatesByCategory = (category) => this.filterTemplatesByCategory(category);
    // 清除搜索并关闭模态框的方法（用于右上角❌按钮）
    window.closeTermsModalAndClearSearch = () => this.closeTermsModalAndClearSearch();
    window.closePlatformsModalAndClearSearch = () => this.closePlatformsModalAndClearSearch();
    // 清除搜索并刷新模态框的方法（用于搜索框旁的❌按钮，不关闭模态框）
    window.clearTermSearchAndRefresh = () => this.clearTermSearchAndRefresh();
    window.clearPlatformSearchAndRefresh = () => this.clearPlatformSearchAndRefresh();
    window.resetContributions = () => this.resetContributions();
    window.filterPlatformsByCategory = (category) => this.filterPlatformsByCategory(category);
    // 全局方法引用（用于事件监听）
    this.boundHandleTermSearch = this.handleTermSearch.bind(this);
    this.boundHandlePlatformSearch = this.handlePlatformSearch.bind(this);
  }

  load() {
    const saved = localStorage.getItem('aiExplorerKnowledge');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Array.isArray(data.favorites)) {
          this.favorites = { templates: data.favorites, terms: data.favoriteTerms || [], platforms: data.favoritePlatforms || [] };
        } else {
          this.favorites = data.favorites || { templates: [], terms: [], platforms: [] };
        }
        this.readTerms = data.readTerms || [];
        this.readPlatforms = data.readPlatforms || [];
        this.contributions = data.contributions || [];
        this.compareList = data.compareList || [];
      } catch (e) { console.error('加载知识库失败:', e); }
    }
  }

  // 重置贡献数据
  resetContributions() {
    if (confirm('⚠️ 确定要清空所有贡献数据吗？此操作不可恢复！')) {
      this.contributions = [];
      this.save();
      this.app.showToast('✅ 贡献数据已清空', 'success');
      this.showFavoritesModal();
      return true;
    }
    return false;
  }

  save() {
    localStorage.setItem('aiExplorerKnowledge', JSON.stringify({
      favorites: this.favorites, readTerms: this.readTerms, readPlatforms: this.readPlatforms,
      contributions: this.contributions, compareList: this.compareList
    }));
  }

  getDefaultResources() {
    return [
      { category: '入门指南', icon: '🚀', items: [
          { title: '什么是 AI 助手？', desc: '了解 AI 助手的基本概念和用途', level: 'beginner' },
          { title: '如何提出好问题', desc: '学习如何向 AI 提出清晰、有效的问题', level: 'beginner' },
          { title: 'AI 对话技巧', desc: '掌握与 AI 高效对话的技巧', level: 'beginner' }
        ]
      },
      { category: '写作辅助', icon: '✍️', items: [
          { title: '文章大纲生成', desc: '使用 AI 生成文章结构和大纲', level: 'intermediate' },
          { title: '润色与改写', desc: '让 AI 帮你优化文章表达', level: 'intermediate' },
          { title: '创意写作', desc: '用 AI 激发创作灵感', level: 'advanced' }
        ]
      },
      { category: '编程学习', icon: '💻', items: [
          { title: '代码解释', desc: '让 AI 解释复杂代码', level: 'beginner' },
          { title: '代码生成', desc: '使用 AI 生成代码片段', level: 'intermediate' },
          { title: '调试辅助', desc: '用 AI 帮助查找和修复 bug', level: 'advanced' }
        ]
      },
      { category: '学习研究', icon: '📚', items: [
          { title: '概念解释', desc: '快速获取概念解释', level: 'beginner' },
          { title: '资料整理', desc: '用 AI 整理学习笔记', level: 'intermediate' },
          { title: '论文辅助', desc: 'AI 辅助学术研究', level: 'advanced' }
        ]
      },
      { category: '生活应用', icon: '🌟', items: [
          { title: '日常问答', desc: '解决日常生活中的疑问', level: 'beginner' },
          { title: '计划制定', desc: '让 AI 帮你制定计划', level: 'intermediate' },
          { title: '创意灵感', desc: '获取创意和灵感', level: 'intermediate' }
        ]
      }
    ];
  }

  getDefaultTemplates() {
    return [
      { category: '✍️ 写作', templates: [
          { title: '📝 文章大纲', prompt: '请帮我为以下主题生成一个详细的文章大纲：[主题]\n\n要求：\n1. 包含引言、正文（至少 3 个要点）、结论\n2. 每个要点下要有 2-3 个支撑论据\n3. 适合 [目标读者] 阅读\n\n请按照以下格式输出：\n# [主题]\n## 引言\n- [引入话题]\n- [提出论点]\n## 正文\n### 要点 1\n- 论据 1\n- 论据 2\n### 要点 2\n...\n## 结论\n- [总结全文]\n- [呼吁行动]', usage: '替换 [主题] 和 [目标读者] 为你的具体内容' },
          { title: '✨ 文章润色', prompt: '请帮我润色以下段落，使其更加流畅、专业：\n\n[粘贴你的文字]\n\n要求：\n1. 保持原意不变\n2. 优化句子结构，使表达更加清晰\n3. 使用更精准、生动的词汇\n4. 修正语法和标点错误\n5. 如有多处需要修改，请逐条列出修改建议并说明原因', usage: '将你的原文替换 [粘贴你的文字]' },
          { title: '🎨 创意写作', prompt: '请帮我写一篇关于 [主题] 的 [文体类型]，要求：\n\n【基本信息】\n- 文体：[记叙文/议论文/说明文/散文/诗歌等]\n- 字数：约 [字数] 字\n- 风格：[风格描述，如幽默、严肃、温馨等]\n- 情感基调：[情感描述]\n\n【内容要求】\n- 必须包含的元素：[元素 1、元素 2...]\n- 避免的内容：[如有]\n- 特殊要求：[如有]\n\n【目标读者】[描述你的读者群体]', usage: '填写所有方括号中的内容，越详细越好' },
          { title: '📧 邮件写作', prompt: '请帮我写一封 [邮件类型] 的邮件：\n\n【收件人】[职位/关系]\n【目的】[写这封邮件的目的]\n【要点】\n1. [要传达的第一个信息]\n2. [要传达的第二个信息]\n3. [期望的回复或行动]\n\n【语气要求】[正式/半正式/非正式]\n【其他说明】[如有特殊要求请说明]', usage: '适用于工作邮件、申请信、感谢信等场景' },
          { title: '📱 新媒体文案', prompt: '请帮我写一篇 [平台类型] 的推文/文案：\n\n【主题】[产品/活动/内容介绍]\n【目标受众】[年龄、兴趣等]\n【核心信息】[最想传达的 1-2 个信息]\n【字数限制】[如：100 字以内]\n【风格要求】[如：活泼、专业、幽默等]\n【行动号召】[希望读者做什么：点赞、转发、购买等]\n\n请提供 3 个不同风格的版本供我选择。', usage: '适用于微信公众号、小红书、微博等平台' },
          { title: '📖 故事创作', prompt: '请帮我创作一个 [故事类型] 的故事：\n\n【故事背景】[时间、地点、世界观]\n【主角设定】[姓名、性格、目标]\n【故事冲突】[主角面临的挑战或问题]\n【故事长度】[短篇/中篇/详细大纲]\n【风格参考】[可选：类似某作品风格]\n\n要求：\n1. 情节引人入胜，有起承转合\n2. 人物形象鲜明\n3. 对话自然流畅\n4. 结局 [圆满/开放/悬念]', usage: '适合创作儿童故事、短篇小说等' }
        ]
      },
      { category: '💻 编程', templates: [
          { title: '🔍 代码解释', prompt: '请详细解释以下代码的功能和工作原理：\n\n```\n[编程语言]\n[粘贴代码]\n```\n\n请从以下方面解释：\n1. 这段代码的整体功能是什么\n2. 逐行或逐块解释关键代码的作用\n3. 使用了哪些重要的语法或技术\n4. 代码的输入和输出分别是什么\n5. 是否有可以优化的地方\n\n请用通俗易懂的语言，适合 [初学者/有一定基础] 的开发者理解。', usage: '将代码粘贴到代码块中，注明编程语言' },
          { title: '🛠️ 代码生成', prompt: '请帮我写一个 [编程语言] 函数/程序，实现以下功能：\n\n【功能描述】\n[详细描述你想要实现的功能]\n\n【输入要求】\n- 输入格式：[如：字符串、数字、数组等]\n- 输入示例：[给出 1-2 个例子]\n\n【输出要求】\n- 输出格式：[如：返回值、打印结果等]\n- 输出示例：[给出 1-2 个例子]\n\n【特殊要求】\n- 性能要求：[如：时间复杂度、空间复杂度]\n- 边界处理：[如：空值、异常情况等]\n- 代码风格：[如：简洁、详细注释等]\n\n请提供完整的代码实现，并附上必要的注释和使用示例。', usage: '填写所有方括号中的内容，描述越清晰，生成的代码越准确' },
          { title: '🐛 代码调试', prompt: '以下代码出现了问题，请帮我找出错误并修复：\n\n```[编程语言]\n[粘贴代码]\n```\n\n【问题描述】\n- 错误信息：[完整的错误提示]\n- 预期行为：[代码应该实现什么功能]\n- 实际行为：[实际发生了什么]\n- 触发条件：[什么情况下会出现这个问题]\n\n【已尝试的解决方法】\n[列出你已经尝试过的方法]\n\n请帮我：\n1. 分析错误原因\n2. 提供修复方案\n3. 解释如何避免类似问题', usage: '提供完整的代码和错误信息，有助于快速定位问题' },
          { title: '📚 代码审查', prompt: '请帮我审查以下代码，提出改进建议：\n\n```[编程语言]\n[粘贴代码]\n```\n\n【代码背景】\n- 项目类型：[如：Web 应用、数据处理等]\n- 使用场景：[代码的用途]\n- 技术栈：[使用的框架、库等]\n\n【审查重点】\n- [ ] 代码可读性\n- [ ] 性能优化\n- [ ] 安全性\n- [ ] 错误处理\n- [ ] 代码规范\n- [ ] 其他：[自定义要求]\n\n请逐条列出问题和改进建议，并提供修改后的代码示例。', usage: '适合代码优化、学习最佳实践' },
          { title: '📝 技术文档', prompt: '请帮我为以下代码编写技术文档：\n\n```[编程语言]\n[粘贴代码]\n```\n\n【文档要求】\n1. 功能说明：简要描述模块/函数的作用\n2. 参数说明：列出所有参数及其类型、默认值、说明\n3. 返回值说明：描述返回值类型和含义\n4. 使用示例：提供 2-3 个典型使用场景的代码示例\n5. 注意事项：列出使用时的注意事项和常见错误\n\n【文档格式】[Markdown/JSDoc/其他]\n【目标读者】[开发者/用户/其他]', usage: '适合编写 API 文档、模块说明等' }
        ]
      },
      { category: '📚 学习', templates: [
          { title: '🧠 概念解释', prompt: '请用通俗易懂的方式解释 [概念名称] 这个概念。\n\n【要求】\n1. 用简单的语言解释核心含义（1-2 句话）\n2. 提供 1-2 个生活中的例子，帮助理解\n3. 说明它与相关概念的区别和联系\n4. 如果有专业术语，请一并解释\n5. 适合 [年级/水平] 的学生理解\n\n【可选】\n- 这个概念是谁提出的？什么时候？\n- 它在实际中有什么应用？\n- 学习这个概念前需要掌握哪些前置知识？', usage: '替换概念名称和适用水平，可添加额外问题' },
          { title: '📋 知识点总结', prompt: '请帮我总结以下主题的核心知识点：[主题名称]\n\n【要求】\n1. 列出 5-10 个核心概念，按重要性排序\n2. 每个概念用 1-2 句话简洁解释\n3. 提供概念之间的联系图或说明\n4. 标注重点和难点\n5. 提供 2-3 个典型例题或应用场景\n\n【输出格式】\n# [主题名称] 知识点总结\n\n## 核心概念\n1. **概念 1**: 解释\n2. **概念 2**: 解释\n...\n\n## 概念联系\n[描述或图表]\n\n## 重点难点\n- ⭐ 重点：...\n- ⚠️ 难点：...\n\n## 应用示例\n[例题或场景]', usage: '适合复习备考、整理笔记' },
          { title: '🗓️ 学习计划', prompt: '我想学习 [技能/知识]，请帮我制定一个详细的学习计划。\n\n【我的情况】\n- 当前水平：[零基础/有一些了解/已经入门]\n- 可用时间：[每天/每周多少小时]\n- 学习目标：[想要达到什么水平，如：能独立做项目、通过考试等]\n- 学习期限：[多长时间，如：3 个月、半年]\n- 学习方式偏好：[视频教程/书籍/实践项目/课程]\n\n【请提供】\n1. 分阶段的学习目标和时间安排\n2. 每个阶段的具体学习内容\n3. 推荐的学习资源（书籍、课程、网站等）\n4. 实践项目建议\n5. 检查和评估方法\n\n请用表格形式呈现学习计划，清晰明了。', usage: '填写所有个人信息，越详细计划越个性化' },
          { title: '❓ 费曼学习法', prompt: '我想用费曼学习法来理解 [概念/主题]。\n\n请按以下步骤帮助我：\n\n1. **概念讲解**: 用最简单的话解释这个概念，就像一个完全不懂的人能听懂一样\n\n2. **类比说明**: 用一个生活中的例子来类比这个概念\n\n3. **简化复述**: 引导我用自己的话复述这个概念，如有不准确的地方请指出\n\n4. **查漏补缺**: 告诉我可能忽略的关键点，并解释为什么重要\n\n【我的背景】[你的专业/年级/基础]\n【概念/主题】[具体内容]', usage: '费曼学习法：通过教授他人来深入学习' },
          { title: '📝 记忆口诀', prompt: '请帮我为以下内容创建记忆口诀和记忆方法：\n\n【需要记忆的内容】\n[列出需要记忆的知识点、公式、单词等]\n\n【要求】\n1. 创建押韵的口诀或顺口溜\n2. 提供联想记忆法（如：首字母缩写、图像联想等）\n3. 设计记忆宫殿或故事链\n4. 提供复习间隔建议（艾宾浩斯遗忘曲线）\n\n【适用场景】[考试背诵/日常学习/兴趣学习]', usage: '适合需要大量记忆的学科，如历史、生物、英语等' }
        ]
      },
      { category: '📊 分析', templates: [
          { title: '📈 SWOT 分析', prompt: '请对以下对象进行 SWOT 分析：[分析对象]\n\n【背景信息】\n- 分析对象：[公司/产品/个人/项目等]\n- 分析目的：[如：制定战略、职业规划等]\n- 行业/领域：[相关背景]\n\n【分析要求】\n请从以下四个方面详细分析：\n\n💪 优势 (Strengths)\n- 内部优势因素\n- 核心竞争力\n- 资源优势\n\n💔 劣势 (Weaknesses)\n- 内部不足因素\n- 需要改进的地方\n- 资源限制\n\n🚀 机会 (Opportunities)\n- 外部有利因素\n- 市场趋势\n- 发展空间\n\n⚠️ 威胁 (Threats)\n- 外部不利因素\n- 竞争压力\n- 潜在风险\n\n【总结建议】\n基于以上分析，请提供 3-5 条具体的行动建议。', usage: '适用于战略规划、竞争分析、个人发展等' },
          { title: '⚖️ 对比分析', prompt: '请对比分析以下两个事物：\n- A: [事物 A]\n- B: [事物 B]\n\n【分析背景】[说明对比的目的和场景]\n\n【对比维度】\n请从以下维度进行对比：\n1. 基本特点（定义、起源、发展等）\n2. 核心功能/优势\n3. 局限性/劣势\n4. 适用场景\n5. 成本/投入\n6. 发展趋势\n\n【输出要求】\n1. 先用表格形式呈现对比概览\n2. 然后对每个维度进行详细分析\n3. 最后给出选择建议：在什么情况下选 A，什么情况下选 B', usage: '适用于产品选型、方案对比、决策分析等' },
          { title: '🎯 根因分析', prompt: '请帮我进行根因分析（5 Why 分析法）：\n\n【问题描述】\n[详细描述遇到的问题或现象]\n\n【已知信息】\n- 问题发生时间：[何时首次发现]\n- 问题发生频率：[偶尔/经常/持续]\n- 影响范围：[受影响的系统、人员等]\n- 已收集的数据：[相关日志、报告等]\n\n【分析要求】\n1. 使用 5 Why 方法，连续追问"为什么"，找到根本原因\n2. 绘制因果关系图\n3. 提供针对性的解决方案\n4. 列出预防措施，避免问题再次发生\n\n请用结构化的方式呈现分析过程和结果。', usage: '适用于问题解决、质量管理、事故分析等' },
          { title: '📊 数据分析报告', prompt: '请帮我分析以下数据并撰写报告：\n\n【数据背景】\n- 数据来源：[调查/实验/系统记录等]\n- 数据类型：[销售数据/用户行为/实验结果等]\n- 分析目的：[发现问题/验证假设/支持决策等]\n\n【数据内容】\n[粘贴数据或描述数据结构]\n\n【分析要求】\n1. 数据概览：总量、趋势、分布等\n2. 关键发现：数据中的亮点、异常点\n3. 深入分析：相关性、因果关系等\n4. 可视化建议：适合的图表类型\n5. 结论与建议：基于数据的行动建议\n\n请用专业的数据分析报告格式输出。', usage: '适用于业务分析、市场调研、学术研究等' }
        ]
      },
      { category: '🎨 创意', templates: [
          { title: '🧠 头脑风暴', prompt: '请帮我进行头脑风暴，生成关于 [主题] 的创意和想法。\n\n【背景信息】\n- 主题/问题：[具体描述]\n- 目标：[想要达到什么目的]\n- 限制条件：[预算、时间、资源等]\n- 目标受众：[谁会使用/受益]\n\n【要求】\n1. 生成至少 15 个不同的想法\n2. 想法要多样化，包括常规和创新的方案\n3. 每个想法用 1-2 句话简述\n4. 对每个想法进行简单评估（可行性、创新性、成本）\n5. 推荐 3 个最有潜力的想法并说明理由\n\n请自由发散思考，不要过早评判想法的可行性。', usage: '适用于创意策划、问题解决、产品创新等' },
          { title: '🎬 视频脚本', prompt: '请帮我写一个视频脚本：\n\n【视频信息】\n- 视频类型：[教程/评测/Vlog/广告/短剧等]\n- 主题：[视频内容主题]\n- 时长：[预计时长，如：3 分钟]\n- 发布平台：[抖音/B 站/YouTube 等]\n- 目标观众：[年龄、兴趣等]\n\n【内容要求】\n- 开场：[如何吸引观众注意]\n- 主要内容：[要传达的核心信息]\n- 结尾：[行动号召/总结]\n- 风格：[幽默/专业/温馨等]\n\n【格式要求】\n请按以下格式输出：\n【场景】场景描述\n【画面】画面内容\n【台词/旁白】具体台词\n【时长】预计时间', usage: '适用于短视频、教程视频、广告视频等' },
          { title: '🎮 游戏策划', prompt: '请帮我设计一个游戏的基本框架：\n\n【游戏信息】\n- 游戏类型：[RPG/解谜/动作/策略等]\n- 目标平台：[手机/PC/主机等]\n- 目标玩家：[年龄、偏好等]\n- 游戏风格：[像素/3D/手绘等]\n\n【设计要求】\n1. 游戏背景故事（世界观设定）\n2. 核心玩法机制\n3. 主要角色设定\n4. 关卡/任务设计思路\n5. 成长/奖励系统\n6. 商业化模式（如适用）\n\n请用游戏策划文档的格式输出，包含必要的细节说明。', usage: '适合独立游戏开发、游戏设计学习等' }
        ]
      },
      { category: '💼 职场', templates: [
          { title: '📄 简历优化', prompt: '请帮我优化以下简历内容：\n\n【原简历内容】\n[粘贴你的简历]\n\n【目标职位】[具体职位名称]\n【行业领域】[如：互联网、金融、教育等]\n【工作年限】[如：应届、3 年经验等]\n\n【优化要求】\n1. 优化个人简介/求职意向\n2. 重新组织工作经历，突出与目标职位相关的成就\n3. 使用 STAR 法则（情境 - 任务 - 行动 - 结果）描述成就\n4. 量化成果（用数字说话）\n5. 优化技能描述，匹配职位要求\n6. 指出简历中的问题和改进建议\n\n请提供优化后的完整简历版本。', usage: '适合求职、跳槽、晋升等场景' },
          { title: '📊 工作汇报', prompt: '请帮我准备一份工作汇报：\n\n【汇报信息】\n- 汇报类型：[周报/月报/季报/年报]\n- 汇报对象：[直属领导/高层/团队]\n- 汇报时长：[如：10 分钟]\n- 时间段：[汇报覆盖的时间范围]\n\n【工作内容】\n[列出本周期完成的主要工作]\n\n【要求】\n1. 工作完成情况（用数据说话）\n2. 亮点和成就\n3. 遇到的挑战和解决方案\n4. 下阶段工作计划\n5. 需要的支持和资源\n\n请按以下结构输出：\n## 工作概览\n## 完成情况\n## 亮点展示\n## 问题与反思\n## 下步计划', usage: '适用于定期汇报、项目总结、述职等' },
          { title: '🤝 面试准备', prompt: '请帮我准备 [职位名称] 的面试：\n\n【面试信息】\n- 目标公司：[公司名称/行业]\n- 职位名称：[具体职位]\n- 面试轮次：[初面/复面/终面]\n- 面试形式：[电话/视频/现场]\n\n【个人背景】\n- 相关专业/工作经验\n- 核心技能和优势\n\n【准备要求】\n1. 预测 10 个可能的面试问题（包括技术问题）\n2. 提供每个问题的回答思路和示例\n3. 自我介绍模板（1 分钟和 3 分钟版本）\n4. 向面试官提问的问题建议\n5. 面试注意事项\n\n请提供全面的面试准备指南。', usage: '适合求职面试、晋升面试等场景' }
        ]
      }
    ];
  }

  handleTermSearch(query) {
    this.searchQuery.terms = query;
    // 只在有搜索内容或从有内容变为空时刷新
    this.showTermsModal();
  }

  handlePlatformSearch(query) {
    this.searchQuery.platforms = query;
    // 只在有搜索内容或从有内容变为空时刷新
    this.showPlatformsModal();
  }

  // 关闭模态框并清除搜索状态（用于右上角❌按钮）
  closeTermsModalAndClearSearch() {
    this.searchQuery.terms = '';
    document.querySelectorAll('.modal.active').forEach(m => {
      const header = m.querySelector('.modal-header h3');
      if (header && header.textContent.includes('术语词典')) {
        m.remove();
      }
    });
  }

  closePlatformsModalAndClearSearch() {
    this.searchQuery.platforms = '';
    document.querySelectorAll('.modal.active').forEach(m => {
      const header = m.querySelector('.modal-header h3');
      if (header && header.textContent.includes('平台百科')) {
        m.remove();
      }
    });
  }

  // 清除搜索并刷新模态框（用于搜索框旁的❌按钮，不关闭模态框）
  clearTermSearchAndRefresh() {
    this.searchQuery.terms = '';
    this.showTermsModal();
  }

  clearPlatformSearchAndRefresh() {
    this.searchQuery.platforms = '';
    this.showPlatformsModal();
  }

  searchTerms(query) {
    if (!query || query.trim() === '') return [];
    const lowerQuery = query.toLowerCase();
    return this.terms.flatMap(cat => cat.terms).filter(term => 
      term.term.toLowerCase().includes(lowerQuery) || term.full_name.toLowerCase().includes(lowerQuery) ||
      term.explanation.toLowerCase().includes(lowerQuery) || term.example.toLowerCase().includes(lowerQuery)
    );
  }

  searchPlatforms(query) {
    if (!query || query.trim() === '') return [];
    const lowerQuery = query.toLowerCase();
    return this.platforms.flatMap(cat => cat.platforms).filter(p =>
      p.name.toLowerCase().includes(lowerQuery) || p.company.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) || p.strengths.some(s => s.toLowerCase().includes(lowerQuery))
    );
  }

  toggleFavorite(templateTitle) {
    const index = this.favorites.templates.indexOf(templateTitle);
    if (index !== -1) this.favorites.templates.splice(index, 1);
    else this.favorites.templates.push(templateTitle);
    this.save();
    return this.favorites.templates.includes(templateTitle);
  }

  isFavorite(templateTitle) { return this.favorites.templates.includes(templateTitle); }

  toggleTermFavorite(termKey) {
    const index = this.favorites.terms.indexOf(termKey);
    if (index !== -1) { this.favorites.terms.splice(index, 1); this.app.showToast('❌ 已取消收藏', 'success'); }
    else { this.favorites.terms.push(termKey); this.app.showToast('⭐ 已加入收藏', 'success'); }
    this.save(); this.showTermsModal();
  }

  togglePlatformFavorite(platformKey) {
    const index = this.favorites.platforms.indexOf(platformKey);
    if (index !== -1) { this.favorites.platforms.splice(index, 1); this.app.showToast('❌ 已取消收藏', 'success'); }
    else { this.favorites.platforms.push(platformKey); this.app.showToast('⭐ 已加入收藏', 'success'); }
    this.save(); this.showPlatformsModal();
  }

  isTermFavorite(termKey) { return this.favorites.terms.includes(termKey); }
  isPlatformFavorite(platformKey) { return this.favorites.platforms.includes(platformKey); }

  markTermAsRead(termKey) { if (!this.readTerms.includes(termKey)) { this.readTerms.push(termKey); this.save(); } }
  markPlatformAsRead(platformKey) { if (!this.readPlatforms.includes(platformKey)) { this.readPlatforms.push(platformKey); this.save(); } }
  isTermRead(termKey) { return this.readTerms.includes(termKey); }
  isPlatformRead(platformKey) { return this.readPlatforms.includes(platformKey); }

  getLearningProgress() {
    const totalTerms = this.terms.reduce((sum, cat) => sum + cat.terms.length, 0);
    const totalPlatforms = this.platforms.reduce((sum, cat) => sum + cat.platforms.length, 0);
    return {
      terms: { read: this.readTerms.length, total: totalTerms, percent: Math.round((this.readTerms.length / totalTerms) * 100) || 0 },
      platforms: { read: this.readPlatforms.length, total: totalPlatforms, percent: Math.round((this.readPlatforms.length / totalPlatforms) * 100) || 0 }
    };
  }

  // 更新知识库页面各卡片的进度显示
  updateKnowledgeCardsProgress() {
    // 更新术语进度
    const termsProgress = this.getLearningProgress();
    const termsProgressEl = document.getElementById('terms-progress');
    if (termsProgressEl) {
      termsProgressEl.textContent = `${termsProgress.terms.read}/${termsProgress.terms.total} 已学习`;
    }
    
    // 更新平台进度
    const platformsProgressEl = document.getElementById('platforms-progress');
    if (platformsProgressEl) {
      platformsProgressEl.textContent = `${termsProgress.platforms.read}/${termsProgress.platforms.total} 已学习`;
    }
    
    // 更新模板进度（收藏的模板数量）
    const totalTemplates = this.templates.reduce((sum, cat) => sum + cat.templates.length, 0);
    const favoriteTemplatesCount = this.favorites.templates.length;
    const templatesProgressEl = document.getElementById('templates-progress');
    if (templatesProgressEl) {
      templatesProgressEl.textContent = `${favoriteTemplatesCount}/${totalTemplates} 已收藏`;
    }
    
    // 更新我的收藏进度（所有收藏的总数）
    const allTerms = this.terms.flatMap(cat => cat.terms);
    const favoriteTermsCount = allTerms.filter(t => this.favorites.terms.includes(this.getTermKey(t))).length;
    const allPlatforms = this.platforms.flatMap(cat => cat.platforms);
    const favoritePlatformsCount = allPlatforms.filter(p => this.favorites.platforms.includes(this.getPlatformKey(p))).length;
    const totalFavorites = favoriteTemplatesCount + favoriteTermsCount + favoritePlatformsCount;
    const totalItems = totalTemplates + totalTerms + totalPlatforms;
    
    const favoritesProgressEl = document.getElementById('favorites-progress');
    if (favoritesProgressEl) {
      favoritesProgressEl.textContent = `${totalFavorites}/${totalItems} 已收藏`;
    }
  }

  getRelatedTerms(termKey) {
    const allTerms = this.terms.flatMap(cat => cat.terms);
    const currentTerm = allTerms.find(t => this.getTermKey(t) === termKey);
    if (!currentTerm) return [];
    const category = this.terms.find(cat => cat.terms.some(t => this.getTermKey(t) === termKey));
    if (!category) return [];
    return category.terms.filter(t => this.getTermKey(t) !== termKey && t.level === currentTerm.level).slice(0, 3);
  }

  getTermKey(term) { return `${term.category || ''}-${term.term}`; }
  getPlatformKey(platform) { return `${platform.name}-${platform.company}`; }

  addToCompare(platformKey) {
    if (this.compareList.includes(platformKey)) {
      this.compareList = this.compareList.filter(k => k !== platformKey);
      this.app.showToast('❌ 已移出对比', 'success');
    } else {
      if (this.compareList.length >= 4) { this.app.showToast('⚠️ 最多对比 4 个平台', 'error'); return; }
      this.compareList.push(platformKey);
      this.app.showToast('✅ 已添加到对比', 'success');
    }
    this.save(); this.updateCompareButton();
  }

  updateCompareButton() {
    const btn = document.getElementById('compare-btn');
    if (btn) { btn.textContent = `📊 对比 (${this.compareList.length})`; btn.style.opacity = this.compareList.length >= 2 ? '1' : '0.5'; }
  }

  showCompareModal() {
    if (this.compareList.length < 2) { this.app.showToast('⚠️ 请至少选择 2 个平台进行对比', 'error'); return; }
    const allPlatforms = this.platforms.flatMap(cat => cat.platforms);
    const platformsToCompare = allPlatforms.filter(p => this.compareList.includes(this.getPlatformKey(p)));
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-large knowledge-modal">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header"><h3>📊 平台对比</h3></div>
        <div class="modal-body">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
              <thead><tr style="background: var(--card-bg);">
                <th style="padding: 16px; text-align: left; border: var(--card-border); font-weight: 600; color: var(--text-primary); backdrop-filter: blur(10px);">特性</th>
                ${platformsToCompare.map(p => `<th style="padding: 16px; text-align: left; border: var(--card-border); font-weight: 600; color: var(--text-primary); backdrop-filter: blur(10px);"><div style="font-size: 16px; font-weight: 600; color: var(--text-primary);">${p.name}</div><div style="font-size: 12px; color: var(--text-secondary); font-weight: normal;">${p.company}</div></th>`).join('')}
              </tr></thead>
              <tbody>
                <tr><td style="padding: 12px; border: var(--card-border); font-weight: 600; color: var(--text-primary); background: rgba(0,0,0,0.02);">上线时间</td>${platformsToCompare.map(p => `<td style="padding: 12px; border: var(--card-border); color: var(--text-primary);">${p.launch_date}</td>`).join('')}</tr>
                <tr style="background: rgba(0,0,0,0.01);"><td style="padding: 12px; border: var(--card-border); font-weight: 600; color: var(--text-primary);">价格</td>${platformsToCompare.map(p => `<td style="padding: 12px; border: var(--card-border);">${p.free ? '<span style="color: var(--success); font-weight: 500;">✅ 免费</span>' : '<span style="color: var(--warning); font-weight: 500;">💰 付费</span>'}</td>`).join('')}</tr>
                <tr><td style="padding: 12px; border: var(--card-border); font-weight: 600; color: var(--text-primary); background: rgba(0,0,0,0.02);">推荐年龄</td>${platformsToCompare.map(p => `<td style="padding: 12px; border: var(--card-border); color: var(--text-primary);">${p.age_recommend}</td>`).join('')}</tr>
                <tr style="background: rgba(0,0,0,0.01);"><td style="padding: 12px; border: var(--card-border); font-weight: 600; color: var(--text-primary);">核心优势</td>${platformsToCompare.map(p => `<td style="padding: 12px; border: var(--card-border);"><div style="display: flex; flex-wrap: wrap; gap: 4px;">${p.strengths.map(s => `<span style="font-size: 11px; padding: 2px 6px; background: rgba(52,199,89,0.15); color: var(--success); border-radius: 4px; border: 1px solid rgba(52,199,89,0.2);">${s}</span>`).join('')}</div></td>`).join('')}</tr>
                <tr><td style="padding: 12px; border: var(--card-border); font-weight: 600; color: var(--text-primary); background: rgba(0,0,0,0.02);">适合场景</td>${platformsToCompare.map(p => `<td style="padding: 12px; border: var(--card-border); font-size: 13px; color: var(--text-primary);">${p.best_for.join('、')}</td>`).join('')}</tr>
                <tr style="background: rgba(0,0,0,0.01);"><td style="padding: 12px; border: var(--card-border); font-weight: 600; color: var(--text-primary);">描述</td>${platformsToCompare.map(p => `<td style="padding: 12px; border: var(--card-border); font-size: 12px; color: var(--text-secondary);">${p.description.substring(0, 80)}${p.description.length > 80 ? '...' : ''}</td>`).join('')}</tr>
              </tbody>
            </table>
          </div>
          <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: center;">
            ${platformsToCompare.map(p => `<button class="btn-primary" onclick="window.open('${p.url}', '_blank')">访问 ${p.name} →</button>`).join('')}
          </div>
          <div style="margin-top: 16px; text-align: center;">
            <button class="btn-secondary" onclick="clearCompare()">🗑️ 清空对比列表</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  clearCompare() {
    this.compareList = []; this.save(); this.updateCompareButton();
    document.querySelectorAll('.modal.active').forEach(m => m.remove());
    this.showPlatformsModal();
    this.app.showToast('✅ 已清空对比列表', 'success');
  }

  generateQuiz(termKey) {
    const allTerms = this.terms.flatMap(cat => cat.terms);
    const currentTerm = allTerms.find(t => this.getTermKey(t) === termKey);
    if (!currentTerm) return null;
    const otherTerms = allTerms.filter(t => this.getTermKey(t) !== termKey);
    const shuffled = otherTerms.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [{ text: currentTerm.explanation, correct: true }, ...shuffled.map(t => ({ text: t.explanation, correct: false }))].sort(() => Math.random() - 0.5);
    return { term: currentTerm.term, question: `"${currentTerm.term}" 是什么意思？`, options: options, correctAnswer: currentTerm.explanation };
  }

  showQuizModal(termKey) {
    const quiz = this.generateQuiz(termKey);
    if (!quiz) return;
    const modal = document.createElement('div');
    modal.className = 'modal active';
    const correctValue = opt => opt.correct ? 'true' : 'false';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header"><h3>📝 小测验</h3></div>
        <div class="modal-body">
          <div style="text-align: center; padding: 20px 0;">
            <div style="font-size: 48px; margin-bottom: 16px;">🤔</div>
            <h4 style="margin-bottom: 24px; font-size: 18px;">${quiz.question}</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${quiz.options.map((opt, i) => `<button class="btn-secondary" style="padding: 16px; text-align: left; white-space: normal; height: auto; font-size: 14px;" onclick="checkQuizAnswer(${i}, '${correctValue(opt)}', '${termKey}')">${String.fromCharCode(65 + i)}. ${opt.text}</button>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  checkQuizAnswer(optionIndex, isCorrect, termKey) {
    // 将字符串转换为布尔值
    const correct = isCorrect === 'true' || isCorrect === true;
    // 始终使用 window.app.knowledge 实例，而不是 this
    const knowledgeInstance = window.app && window.app.knowledge ? window.app.knowledge : null;
    const appInstance = knowledgeInstance ? knowledgeInstance.app : null;
    
    console.log('📝 checkQuizAnswer called:', { 
      optionIndex, 
      isCorrect, 
      correct, 
      termKey, 
      hasKnowledge: !!knowledgeInstance, 
      hasApp: !!appInstance 
    });
    
    if (correct) {
      if (appInstance && appInstance.showToast) {
        appInstance.showToast('✅ 回答正确！+10 XP', 'success');
      } else {
        console.log('✅ 回答正确！+10 XP');
      }
      if (window.soundManager) window.soundManager.playSuccess();
      setTimeout(() => { 
        document.querySelectorAll('.modal.active').forEach(m => m.remove()); 
        if (knowledgeInstance) {
          knowledgeInstance.markTermAsRead(termKey);
        }
      }, 1000);
    } else { 
      if (appInstance && appInstance.showToast) {
        appInstance.showToast('❌ 不对哦，再想想～', 'error');
      } else {
        console.log('❌ 不对哦，再想想～');
      }
    }
  }

  showContributeModal(type) {
    const isTerm = type === 'term';
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-large">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header"><h3>${isTerm ? '📖 提交新术语' : '🌐 提交新平台'}</h3></div>
        <div class="modal-body">
          <p style="color: var(--secondary); margin-bottom: 20px;">欢迎贡献！提交的内容将在审核后添加到知识库中</p>
          <div class="form-group"><label>${isTerm ? '术语名称' : '平台名称'} *</label><input type="text" id="contribute-name" placeholder="${isTerm ? '例如：机器学习' : '例如：ChatGPT'}"></div>
          ${isTerm ? '<div class="form-group"><label>完整名称/英文名 *</label><input type="text" id="contribute-fullname" placeholder="例如：Machine Learning"></div>' : ''}
          <div class="form-group"><label>${isTerm ? '解释说明' : '平台描述'} *</label><textarea id="contribute-description" rows="4" placeholder="请用通俗易懂的语言解释..."></textarea></div>
          <div class="form-group"><label>${isTerm ? '举例说明' : '核心优势'}</label><textarea id="contribute-example" rows="3" placeholder="${isTerm ? '举一个生活中的例子...' : '用逗号分隔多个优势'}"></textarea></div>
          <div class="form-group"><label>你的昵称</label><input type="text" id="contribute-author" placeholder="选填，显示在贡献者列表中"></div>
          <input type="hidden" id="contribute-type" value="${type}">
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="this.closest('.modal').remove()">取消</button>
          <button class="btn-primary" onclick="submitContribution()">📤 提交</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  submitContribution() {
    const type = document.getElementById('contribute-type').value;
    const name = document.getElementById('contribute-name').value.trim();
    const fullName = document.getElementById('contribute-fullname')?.value.trim() || '';
    const description = document.getElementById('contribute-description').value.trim();
    const example = document.getElementById('contribute-example').value.trim();
    const author = document.getElementById('contribute-author').value.trim();
    if (!name || !description) { this.app.showToast('⚠️ 请填写必填项', 'error'); return; }
    
    // 创建新的术语或平台并直接添加到列表中
    if (type === 'term') {
      const newTerm = {
        term: name,
        full_name: fullName || name,
        explanation: description,
        example: example || '暂无示例',
        level: 'beginner',
        first_appear: new Date().getFullYear().toString() + '年',
        origin: '用户贡献' + (author ? ` - ${author}` : ''),
        contributor: author || '匿名',
        submittedAt: new Date().toISOString()
      };
      // 添加到"基础概念"分类
      const baseCategory = this.terms.find(cat => cat.category === '基础概念');
      if (baseCategory) {
        baseCategory.terms.push(newTerm);
      } else {
        this.terms.push({ category: '基础概念', icon: '🌱', terms: [newTerm] });
      }
      this.app.showToast('✅ 术语已添加！感谢您的贡献', 'success');
    } else {
      const newPlatform = {
        name: name,
        company: '用户贡献',
        url: '#',
        icon: '🌟',
        launch_date: new Date().getFullYear().toString() + '年',
        strengths: example ? example.split(',').map(s => s.trim()) : ['用户贡献'],
        description: description,
        best_for: ['用户推荐'],
        age_recommend: '10 岁+',
        free: true,
        contributor: author || '匿名',
        submittedAt: new Date().toISOString()
      };
      // 添加到"国内平台"分类
      const domesticCategory = this.platforms.find(cat => cat.category === '国内平台');
      if (domesticCategory) {
        domesticCategory.platforms.push(newPlatform);
      } else {
        this.platforms.push({ category: '国内平台', icon: '🇨🇳', platforms: [newPlatform] });
      }
      this.app.showToast('✅ 平台已添加！感谢您的贡献', 'success');
    }
    
    // 保存贡献记录
    const contribution = { id: Date.now(), type, data: { name, full_name: fullName, description, example, author }, status: 'approved', submittedAt: new Date().toISOString() };
    this.contributions.push(contribution);
    this.save();
    
    // 关闭模态框并刷新显示
    document.querySelectorAll('.modal.active').forEach(m => m.remove());
    if (type === 'term') {
      this.showTermsModal();
    } else {
      this.showPlatformsModal();
    }
  }

  showKnowledgeBase() {
    const progress = this.getLearningProgress();
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-large" style="background: linear-gradient(135deg, rgba(20,60,100,0.95), rgba(40,30,80,0.95));">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header"><h3>📚 知识库</h3></div>
        <div class="modal-body">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
            <div style="padding: 20px; background: rgba(52,199,89,0.2); border-radius: 12px; border: 1px solid rgba(52,199,89,0.3);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 24px;">📖</span><span style="font-size: 20px; font-weight: 600; color: #34c759;">${progress.terms.percent}%</span>
              </div>
              <div style="font-size: 14px; color: #34c759;">术语学习进度</div>
              <div style="font-size: 12px; color: var(--secondary);">${progress.terms.read}/${progress.terms.total} 已读</div>
            </div>
            <div style="padding: 20px; background: rgba(0,113,227,0.2); border-radius: 12px; border: 1px solid rgba(0,113,227,0.3);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 24px;">🌐</span><span style="font-size: 20px; font-weight: 600; color: #0071e3;">${progress.platforms.percent}%</span>
              </div>
              <div style="font-size: 14px; color: #0071e3;">平台学习进度</div>
              <div style="font-size: 12px; color: var(--secondary);">${progress.platforms.read}/${progress.platforms.total} 已读</div>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
            ${this.resources.map(cat => `
              <div style="padding: 20px; background: rgba(255,255,255,0.1); border-radius: 12px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15);" onclick="showResourcesModal()">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                  <span style="font-size: 32px;">${cat.icon}</span>
                  <div><h4 style="font-weight: 600;">${cat.category}</h4><span style="font-size: 12px; color: var(--secondary);">${cat.items.length} 个主题</span></div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${cat.items.slice(0, 3).map(item => `
                    <div style="padding: 10px; background: rgba(255,255,255,0.08); border-radius: 8px; font-size: 13px;">
                      <div style="font-weight: 500; margin-bottom: 4px;">${item.title}</div>
                      <div style="font-size: 11px; color: var(--secondary);">${item.desc}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  showResourcesModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    const totalResources = this.resources.reduce((sum, cat) => sum + cat.items.length, 0);
    const learnedResources = Math.floor(totalResources * 0.67);
    const progressPercent = Math.round((learnedResources / totalResources) * 100);
    
    modal.innerHTML = `
      <div class="modal-content modal-large" style="background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        
        <div class="modal-header" style="border-bottom: 2px solid rgba(0,0,0,0.05); padding: 24px 32px;">
          <h3 style="color: #1d1d1f; margin: 0; font-size: 24px;">📖 学习资源</h3>
          <div style="margin-top: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #86868b; font-weight: 600;">学习进度</span>
              <span style="font-size: 16px; font-weight: 900; background: linear-gradient(135deg, #6C5CE7, #FF7675); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${learnedResources}/${totalResources} (${progressPercent}%)</span>
            </div>
            <div style="height: 12px; background: rgba(0,0,0,0.08); border-radius: 6px; overflow: hidden;">
              <div style="height: 100%; background: linear-gradient(90deg, #6C5CE7 0%, #7B68EE 50%, #FF7675 100%); border-radius: 6px; width: ${progressPercent}%; box-shadow: 0 0 12px rgba(108,92,231,0.5);"></div>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <div style="display: grid; gap: 24px;">
            ${this.resources.map(cat => `
              <div>
                <h4 style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 12px; border-radius: 8px; transition: all 0.2s ease; width: fit-content;" onmouseover="this.style.background='rgba(255,255,255,0.15)';this.style.transform='translateX(5px)'" onmouseout="this.style.background='transparent';this.style.transform='translateX(0)'" onclick="showResourceCategoryDetail('${cat.category}')">
                  <span style="font-size: 20px;">${cat.icon}</span> <span style="font-weight: 600; font-size: 16px;">${cat.category}</span> <span style="font-size: 12px; color: var(--secondary); margin-left: 8px;">(点击查看详情 →)</span>
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px;">
                  ${cat.items.map(item => `
                    <div style="padding: 16px; background: rgba(255,255,255,0.8); border-radius: 12px; border-left: 3px solid ${this.getLevelColor(item.level)}; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                      <div style="font-weight: 700; margin-bottom: 6px; font-size: 15px; color: #1d1d1f;">${item.title}</div>
                      <div style="font-size: 14px; color: #333333; margin-bottom: 8px; line-height: 1.5;">${item.desc}</div>
                      <span style="font-size: 11px; padding: 3px 8px; background: ${this.getLevelColor(item.level)}; color: white; border-radius: 10px; font-weight: 600;">${this.getLevelText(item.level)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  showResourceCategoryDetail(categoryName) {
    const category = this.resources.find(cat => cat.category === categoryName);
    if (!category) return;
    // 关闭当前所有 active 模态框
    document.querySelectorAll('.modal.active').forEach(m => m.remove());
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-large" style="background: linear-gradient(135deg, rgba(20,80,60,0.95), rgba(30,70,50,0.95));">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <h3>${category.icon} ${categoryName}</h3>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 20px; padding: 16px; background: rgba(255,255,255,0.1); border-radius: 12px;">
            <p style="font-size: 14px; color: var(--secondary); margin: 0;">
              本分类包含 ${category.items.length} 个学习主题，涵盖${this.getCategoryDescription(categoryName)}
            </p>
          </div>
          <div style="display: grid; gap: 20px;">
            ${category.items.map((item, index) => `
              <div style="padding: 20px; background: rgba(255,255,255,0.08); border-radius: 12px; border-left: 4px solid ${this.getLevelColor(item.level)};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                  <div>
                    <h4 style="font-weight: 600; margin-bottom: 8px; font-size: 18px;">${index + 1}. ${item.title}</h4>
                    <p style="font-size: 14px; color: var(--secondary); margin: 0;">${item.desc}</p>
                  </div>
                  <span style="font-size: 12px; padding: 4px 12px; background: rgba(255,255,255,0.15); border-radius: 12px;">${this.getLevelText(item.level)}</span>
                </div>
                <div style="padding: 12px; background: rgba(0,0,0,0.2); border-radius: 8px; margin-top: 12px;">
                  <div style="font-size: 12px; color: var(--secondary); margin-bottom: 6px;">💡 学习内容预览：</div>
                  <div style="font-size: 13px; line-height: 1.6; color: var(--text);">${this.getResourceContentPreview(categoryName, item)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  getCategoryDescription(categoryName) {
    const descriptions = {
      '入门指南': 'AI 基础概念和使用技巧，适合初学者快速上手',
      '写作辅助': '利用 AI 提升写作能力，包括文章生成、润色和创意写作',
      '编程学习': '通过 AI 辅助学习编程，包括代码解释、生成和调试',
      '学习研究': '使用 AI 辅助学术研究，包括概念解释和资料整理',
      '生活应用': 'AI 在日常生活中的实用应用场景'
    };
    return descriptions[categoryName] || '丰富的学习资源';
  }

  getResourceContentPreview(categoryName, item) {
    const previews = {
      '入门指南': {
        '什么是 AI 助手？': '你将了解：1. AI 助手的定义和发展历史 2. AI 助手能做什么 3. 如何与 AI 助手交流 4. AI 助手的局限性',
        '如何提出好问题': '你将学习：1. 清晰表达问题的技巧 2. 提供背景信息的重要性 3. 如何追问和细化问题 4. 避免常见提问错误',
        'AI 对话技巧': '你将掌握：1. 多轮对话的策略 2. 如何引导 AI 给出想要的答案 3. 上下文管理技巧 4. 高级对话模式'
      },
      '写作辅助': {
        '文章大纲生成': '你将学会：1. 如何让 AI 理解你的写作意图 2. 设计大纲结构 3. 调整和优化大纲 4. 从大纲到正文的过渡',
        '润色与改写': '你将掌握：1. 选择合适的润色风格 2. 给出有效的修改指令 3. 评估 AI 建议 4. 保持个人写作风格',
        '创意写作': '你将探索：1. 激发创意的提示词设计 2. 故事结构和角色塑造 3. 文风和语气控制 4. 协作创作技巧'
      },
      '编程学习': {
        '代码解释': '你将学习：1. 如何让 AI 解释代码逻辑 2. 理解复杂算法 3. 代码优化建议 4. 最佳实践学习',
        '代码生成': '你将掌握：1. 描述功能需求的技巧 2. 指定输入输出格式 3. 添加约束条件 4. 测试和验证生成的代码',
        '调试辅助': '你将学会：1. 描述错误现象 2. 提供错误信息 3. 理解 AI 的调试建议 4. 预防类似错误'
      },
      '学习研究': {
        '概念解释': '你将学习：1. 获取适合你水平的解释 2. 要求举例说明 3. 对比相关概念 4. 深入追问技巧',
        '资料整理': '你将掌握：1. 让 AI 总结笔记 2. 提取关键信息 3. 建立知识框架 4. 生成复习材料',
        '论文辅助': '你将探索：1. 文献检索策略 2. 论点构建 3. 引用格式 4. 论文结构优化'
      },
      '生活应用': {
        '日常问答': '你将了解：1. 生活常识查询 2. 实用信息查询 3. 快速计算转换 4. 决策辅助',
        '计划制定': '你将学习：1. 制定学习计划 2. 旅行规划 3. 时间管理 4. 目标设定和追踪',
        '创意灵感': '你将探索：1. 头脑风暴 2. 创意点子生成 3. 问题解决思路 4. 兴趣爱好拓展'
      }
    };
    return previews[categoryName]?.[item.title] || '丰富的学习内容和实践指导';
  }

  filterTemplatesByCategory(category) {
    this.currentTemplateFilter = category;
    // 先关闭所有已存在的提示词模板模态框
    document.querySelectorAll('.modal.active').forEach(m => {
      const header = m.querySelector('.modal-header h3');
      if (header && header.textContent.includes('提示词模板')) {
        m.remove();
      }
    });
    // 重新打开模态框
    this.showTemplatesModal();
  }

  showTemplatesModal() {
    // 先关闭已存在的提示词模板模态框（防止重复打开）
    document.querySelectorAll('.modal.active').forEach(m => {
      const header = m.querySelector('.modal-header h3');
      if (header && header.textContent.includes('提示词模板')) {
        m.remove();
      }
    });
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    // 卡片样式常量 - 浅色背景高对比度
    const cardBg = 'rgba(255,255,255,0.95)';
    const textColor = '#1a1a1a';
    const secondaryColor = '#666666';
    const borderColor = 'rgba(0,0,0,0.1)';
    const promptBg = 'rgba(245,245,247,0.8)';
    
    // 获取所有分类
    const categories = this.templates.map(cat => cat.category);
    
    // 根据筛选条件获取要显示的模板
    let templatesToShow = [];
    if (this.currentTemplateFilter === 'all') {
      // 默认显示所有分类
      templatesToShow = this.templates;
    } else {
      // 只显示选中分类的模板
      const selectedCategory = this.templates.find(cat => cat.category === this.currentTemplateFilter);
      if (selectedCategory) {
        templatesToShow = [selectedCategory];
      }
    }
    
    modal.innerHTML = `
      <div class="modal-content modal-large knowledge-modal">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3>📝 提示词模板</h3>
            <button class="btn-secondary" onclick="showContributeModal('template')" style="font-size: 12px;">➕ 贡献</button>
          </div>
        </div>
        <div class="modal-body">
          <!-- 分类筛选按钮 -->
          <div style="margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; padding: 4px; background: var(--card-bg); border-radius: 12px; max-width: fit-content; margin-left: auto; margin-right: auto; border: var(--card-border); backdrop-filter: blur(10px);">
            <button class="filter-btn ${this.currentTemplateFilter === 'all' ? 'active' : ''}" onclick="filterTemplatesByCategory('all')" style="padding: 8px 16px; border-radius: 10px; border: 1px solid ${this.currentTemplateFilter === 'all' ? 'var(--accent-primary)' : 'rgba(0,0,0,0.08)'}; background: ${this.currentTemplateFilter === 'all' ? 'var(--bg-gradient)' : 'var(--card-bg)'}; color: ${this.currentTemplateFilter === 'all' ? 'white' : 'var(--text-secondary)'}; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease; backdrop-filter: blur(10px);" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">📋 全部</button>
            ${categories.map(cat => `
              <button class="filter-btn ${this.currentTemplateFilter === cat ? 'active' : ''}" onclick="filterTemplatesByCategory('${cat}')" style="padding: 8px 16px; border-radius: 10px; border: 1px solid ${this.currentTemplateFilter === cat ? 'var(--accent-primary)' : 'rgba(0,0,0,0.08)'}; background: ${this.currentTemplateFilter === cat ? 'var(--bg-gradient)' : 'var(--card-bg)'}; color: ${this.currentTemplateFilter === cat ? 'white' : 'var(--text-secondary)'}; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease; backdrop-filter: blur(10px);" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">${cat}</button>
            `).join('')}
          </div>
          
          <div style="display: grid; gap: 16px;">
            ${templatesToShow.map(cat => `
              <div>
                <h4 style="margin-bottom: 16px; font-size: 18px; font-weight: 700; color: ${textColor};">${cat.category}</h4>
                <div style="display: grid; gap: 16px;">
                  ${cat.templates.map(tpl => `
                    <div class="knowledge-card" style="padding: 20px; background: ${cardBg}; border-radius: 16px; border: 1px solid ${borderColor}; position: relative; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.08);" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h5 style="font-weight: 700; font-size: 17px; color: ${textColor};">${tpl.title}</h5>
                        <div style="display: flex; gap: 8px;">
                          <button class="btn-secondary" style="padding: 8px 14px; font-size: 13px; font-weight: 600; background: rgba(0,0,0,0.04); color: ${textColor}; border: 1px solid ${borderColor}; border-radius: 10px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(0,0,0,0.08)'" onmouseout="this.style.background='rgba(0,0,0,0.04)'" onclick="copyTemplate('${encodeURIComponent(tpl.prompt)}')">📋 复制</button>
                          <button class="btn-secondary" style="padding: 8px 14px; font-size: 13px; font-weight: 600; background: ${this.isFavorite(tpl.title) ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' : 'rgba(0,0,0,0.04)'}; color: ${this.isFavorite(tpl.title) ? '#fff' : textColor}; border: 1px solid ${borderColor}; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; box-shadow: ${this.isFavorite(tpl.title) ? '0 2px 8px rgba(255,215,0,0.3)' : 'none'};" onmouseover="this.style.background='${this.isFavorite(tpl.title) ? 'linear-gradient(135deg, #ffed4e 0%, #ffd700 100%)' : 'rgba(0,0,0,0.08)'}'" onmouseout="this.style.background='${this.isFavorite(tpl.title) ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' : 'rgba(0,0,0,0.04)'}'" onclick="toggleFavoriteAndRefresh('${tpl.title.replace(/'/g, "\\'")}')">${this.isFavorite(tpl.title) ? '⭐' : '🤍'} 收藏</button>
                        </div>
                      </div>
                      <pre style="padding: 18px; background: ${promptBg}; border-radius: 12px; overflow-x: auto; font-size: 14px; line-height: 1.7; white-space: pre-wrap; word-break: break-word; color: ${textColor}; border: 1px solid ${borderColor}; font-weight: 400; margin: 0 0 12px 0; box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);">${tpl.prompt}</pre>
                      <div style="padding: 12px; background: rgba(255,191,0,0.08); border-radius: 10px; border: 1px solid rgba(255,191,0,0.2);"><div style="font-size: 13px; color: ${textColor}; margin-bottom: 4px; font-weight: 600;">💡 使用说明</div><div style="font-size: 13px; line-height: 1.6; color: ${secondaryColor};">${tpl.usage}</div></div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  showFavoritesModal() {
    const favoriteTemplates = this.templates.flatMap(cat => cat.templates.filter(tpl => this.isFavorite(tpl.title)));
    const allTerms = this.terms.flatMap(cat => cat.terms);
    const favoriteTerms = allTerms.filter(t => this.isTermFavorite(this.getTermKey(t)));
    const allPlatforms = this.platforms.flatMap(cat => cat.platforms);
    const favoritePlatforms = allPlatforms.filter(p => this.isPlatformFavorite(this.getPlatformKey(p)));
    
    // 获取贡献者列表（从 contributions 中提取）
    const contributors = {};
    this.contributions.forEach(c => {
      const author = c.data.author || '匿名';
      if (!contributors[author]) {
        contributors[author] = { name: author, count: 0, items: [] };
      }
      contributors[author].count++;
      contributors[author].items.push(c);
    });
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-large">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <h3>⭐ 我的收藏</h3>
        </div>
        <div class="modal-body">
          <!-- 标签页导航 -->
          <div style="display: flex; gap: 8px; margin-bottom: 24px; padding: 4px; background: rgba(255,255,255,0.5); border-radius: 12px; max-width: fit-content; margin-left: auto; margin-right: auto; border: 1px solid rgba(0,0,0,0.08);">
            <button onclick="this.parentElement.parentElement.querySelector('#favorites-tab').style.display='grid';this.parentElement.parentElement.querySelector('#contributors-tab').style.display='none';this.parentElement.querySelectorAll('button').forEach(b=>{b.style.background='transparent';b.style.color='var(--secondary)';b.style.boxShadow='none';b.style.transform='none';});this.style.background='var(--primary)';this.style.color='#fff';this.style.boxShadow='0 2px 8px rgba(0,113,227,0.3)';" style="padding: 8px 16px; border: none; border-radius: 10px; color: var(--secondary); cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s ease; background: transparent;">📌 收藏内容</button>
            <button onclick="this.parentElement.parentElement.querySelector('#favorites-tab').style.display='none';this.parentElement.parentElement.querySelector('#contributors-tab').style.display='block';this.parentElement.querySelectorAll('button').forEach(b=>{b.style.background='transparent';b.style.color='var(--secondary)';b.style.boxShadow='none';b.style.transform='none';});this.style.background='var(--primary)';this.style.color='#fff';this.style.boxShadow='0 2px 8px rgba(0,113,227,0.3)';" style="padding: 8px 16px; border: none; border-radius: 10px; color: var(--secondary); cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s ease; background: transparent;">🏆 贡献者榜单</button>
          </div>
          
          <!-- 收藏内容标签页 -->
          <div id="favorites-tab" style="display: grid; gap: 20px;">
            <!-- 收藏的术语 - 横栏卡片 -->
            <div>
              <h4 style="margin-bottom: 16px; font-size: 18px; font-weight: 700; color: var(--black); display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 24px;">📖</span> 收藏的术语 <span style="font-size: 14px; font-weight: 500; color: var(--secondary);">(${favoriteTerms.length})</span>
              </h4>
              ${favoriteTerms.length > 0 ? `<div style="display: flex; flex-direction: column; gap: 12px;">${favoriteTerms.map(term => `
                <div class="favorite-card" style="
                  position: relative;
                  display: flex;
                  align-items: center;
                  gap: 0;
                  padding: 0;
                  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
                  backdrop-filter: blur(30px);
                  -webkit-backdrop-filter: blur(30px);
                  border-radius: 20px;
                  border: 1px solid rgba(255,255,255,0.6);
                  box-shadow: 0 12px 48px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.2);
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                  overflow: hidden;
                  min-height: 80px;
                " onmouseover="this.style.transform='translateY(-4px) scale(1.01)'; this.style.boxShadow='0 20px 64px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.3)';" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 12px 48px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.2)';">
                  <div style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 6px; height: 80%; background: linear-gradient(180deg, #6C5CE7 0%, #7B68EE 50%, #AF52DE 100%); border-radius: 0 8px 8px 0; box-shadow: 0 0 20px rgba(108,92,231,0.5); transition: all 0.4s ease;"></div>
                  <div style="display: flex; align-items: center; gap: 20px; padding: 20px 24px; padding-left: 32px; flex: 1; width: 100%;">
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-size: 20px; font-weight: 900; color: rgba(0,0,0,0.9); letter-spacing: 1.5px; margin-bottom: 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${term.term}</div>
                      <div style="font-size: 13px; color: rgba(0,0,0,0.6); font-weight: 500;">${term.full_name}</div>
                    </div>
                    <button class="btn-danger" style="padding: 10px 18px; font-size: 13px; font-weight: 600; background: linear-gradient(135deg, #ff3b30 0%, #ff2d55 100%); color: white; border: none; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(255,59,48,0.3); white-space: nowrap;" onclick="toggleTermFavorite('${this.getTermKey(term)}')">取消收藏</button>
                  </div>
                </div>`).join('')}</div>` : '<p style="color: var(--secondary); padding: 30px; text-align: center; background: rgba(255,255,255,0.5); border-radius: 16px;">暂无收藏的术语</p>'}
            </div>
            
            <!-- 收藏的平台 - 横栏卡片 -->
            <div>
              <h4 style="margin-bottom: 16px; font-size: 18px; font-weight: 700; color: var(--black); display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 24px;">🌐</span> 收藏的平台 <span style="font-size: 14px; font-weight: 500; color: var(--secondary);">(${favoritePlatforms.length})</span>
              </h4>
              ${favoritePlatforms.length > 0 ? `<div style="display: flex; flex-direction: column; gap: 12px;">${favoritePlatforms.map(p => `
                <div class="favorite-card" style="
                  position: relative;
                  display: flex;
                  align-items: center;
                  gap: 0;
                  padding: 0;
                  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
                  backdrop-filter: blur(30px);
                  -webkit-backdrop-filter: blur(30px);
                  border-radius: 20px;
                  border: 1px solid rgba(255,255,255,0.6);
                  box-shadow: 0 12px 48px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.2);
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                  overflow: hidden;
                  min-height: 80px;
                " onmouseover="this.style.transform='translateY(-4px) scale(1.01)'; this.style.boxShadow='0 20px 64px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.3)';" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 12px 48px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.2)';">
                  <div style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 6px; height: 80%; background: linear-gradient(180deg, #0071e3 0%, #5ac8fa 100%); border-radius: 0 8px 8px 0; box-shadow: 0 0 20px rgba(0,113,227,0.5); transition: all 0.4s ease;"></div>
                  <div style="display: flex; align-items: center; gap: 20px; padding: 20px 24px; padding-left: 32px; flex: 1; width: 100%;">
                    <div style="flex: 1; display: flex; align-items: center; gap: 16px; min-width: 0;">
                      <div style="font-size: 36px; flex-shrink: 0;">${p.icon.startsWith('logos/') ? '🌐' : p.icon}</div>
                      <div style="min-width: 0;">
                        <div style="font-size: 20px; font-weight: 900; color: rgba(0,0,0,0.9); letter-spacing: 1.5px; margin-bottom: 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${p.name}</div>
                        <div style="font-size: 13px; color: rgba(0,0,0,0.6); font-weight: 500;">${p.company} · ${p.launch_date}</div>
                      </div>
                    </div>
                    <div style="display: flex; gap: 10px; flex-shrink: 0;">
                      <button class="btn-primary" style="padding: 10px 18px; font-size: 13px; font-weight: 600; background: linear-gradient(135deg, #0071e3 0%, #005bb5 100%); color: white; border: none; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0,113,227,0.3); white-space: nowrap;" onclick="window.open('${p.url}', '_blank')">访问</button>
                      <button class="btn-danger" style="padding: 10px 18px; font-size: 13px; font-weight: 600; background: linear-gradient(135deg, #ff3b30 0%, #ff2d55 100%); color: white; border: none; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(255,59,48,0.3); white-space: nowrap;" onclick="togglePlatformFavorite('${this.getPlatformKey(p)}')">取消收藏</button>
                    </div>
                  </div>
                </div>`).join('')}</div>` : '<p style="color: var(--secondary); padding: 30px; text-align: center; background: rgba(255,255,255,0.5); border-radius: 16px;">暂无收藏的平台</p>'}
            </div>
            
            <!-- 收藏的模板 - 横栏卡片 -->
            <div>
              <h4 style="margin-bottom: 16px; font-size: 18px; font-weight: 700; color: var(--black); display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 24px;">📝</span> 收藏的模板 <span style="font-size: 14px; font-weight: 500; color: var(--secondary);">(${favoriteTemplates.length})</span>
              </h4>
              ${favoriteTemplates.length > 0 ? `<div style="display: flex; flex-direction: column; gap: 12px;">${favoriteTemplates.map(tpl => `
                <div class="favorite-card" style="
                  position: relative;
                  display: flex;
                  align-items: stretch;
                  gap: 0;
                  padding: 0;
                  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
                  backdrop-filter: blur(30px);
                  -webkit-backdrop-filter: blur(30px);
                  border-radius: 20px;
                  border: 1px solid rgba(255,255,255,0.6);
                  box-shadow: 0 12px 48px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.2);
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                  overflow: hidden;
                  min-height: 100px;
                " onmouseover="this.style.transform='translateY(-4px) scale(1.01)'; this.style.boxShadow='0 20px 64px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.3)';" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 12px 48px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.2)';">
                  <div style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 6px; height: 80%; background: linear-gradient(180deg, #af52de 0%, #ff2d55 100%); border-radius: 0 8px 8px 0; box-shadow: 0 0 20px rgba(175,82,222,0.5); transition: all 0.4s ease;"></div>
                  <div style="display: flex; flex-direction: column; padding: 20px 24px; padding-left: 32px; flex: 1; width: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                      <div style="font-size: 20px; font-weight: 900; color: rgba(0,0,0,0.9); letter-spacing: 1.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">⭐ ${tpl.title}</div>
                      <div style="display: flex; gap: 10px;">
                        <button class="btn-secondary" style="padding: 10px 16px; font-size: 13px; font-weight: 600; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); color: var(--black); border: none; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.15); white-space: nowrap;" onclick="copyTemplate('${encodeURIComponent(tpl.prompt)}')">📋 复制</button>
                        <button class="btn-danger" style="padding: 10px 16px; font-size: 13px; font-weight: 600; background: linear-gradient(135deg, #ff3b30 0%, #ff2d55 100%); color: white; border: none; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(255,59,48,0.3); white-space: nowrap;" onclick="toggleFavoriteAndRefresh('${tpl.title.replace(/'/g, "\\'")}')">取消收藏</button>
                      </div>
                    </div>
                    <pre style="flex: 1; padding: 14px; background: rgba(0,0,0,0.04); border-radius: 12px; overflow-x: auto; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; color: var(--black); border: 1px solid rgba(0,0,0,0.08); margin: 0; max-height: 120px;">${tpl.prompt.substring(0, 300)}${tpl.prompt.length > 300 ? '...' : ''}</pre>
                  </div>
                </div>`).join('')}</div>` : '<p style="color: var(--secondary); padding: 30px; text-align: center; background: rgba(255,255,255,0.5); border-radius: 16px;">暂无收藏的模板</p>'}
            </div>
          </div>
          
          <!-- 贡献者榜单标签页 -->
          <div id="contributors-tab" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h4 style="margin: 0;">🏆 贡献者榜单 (${Object.keys(contributors).length}人)</h4>
              ${this.contributions.length > 0 ? `<button class="btn-danger" onclick="resetContributions()" style="padding: 6px 12px; font-size: 12px;">🗑️ 清空贡献数据</button>` : ''}
            </div>
            ${Object.keys(contributors).length > 0 ? `
              <div style="display: grid; gap: 12px;">
                ${Object.entries(contributors).sort((a, b) => b[1].count - a[1].count).map(([name, data], index) => `
                  <div style="padding: 16px; background: rgba(255,255,255,0.1); border-radius: 12px; display: flex; align-items: center; gap: 16px;">
                    <div style="font-size: 24px; font-weight: 900; width: 30px; text-align: center; color: ${index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--secondary)'};">${index + 1}</div>
                    <div style="font-size: 24px;">${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤'}</div>
                    <div style="flex: 1;">
                      <div style="font-weight: 600; font-size: 16px;">${name}</div>
                      <div style="font-size: 12px; color: var(--secondary);">贡献了 ${data.count} 个${data.count > 1 ? '条目' : '条目'}</div>
                    </div>
                    <div style="font-size: 24px;">🎖️</div>
                  </div>
                `).join('')}
              </div>
            ` : '<p style="color: var(--secondary); padding: 20px; text-align: center;">暂无贡献者</p>'}
            
            ${this.contributions.length > 0 ? `
              <h4 style="margin-bottom: 12px; margin-top: 24px;">📜 最近贡献</h4>
              <div style="display: grid; gap: 8px;">
                ${this.contributions.slice(-5).reverse().map(c => `
                  <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 13px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <span style="color: ${c.type === 'term' ? '#34c759' : '#0071e3'};">${c.type === 'term' ? '📖 术语' : '🌐 平台'}</span>
                        <span style="margin: 0 8px;">•</span>
                        <span>${c.data.name}</span>
                      </div>
                      <div style="font-size: 11px; color: var(--secondary);">${new Date(c.submittedAt).toLocaleDateString('zh-CN')}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  copyTemplate(encodedPrompt) {
    const prompt = decodeURIComponent(encodedPrompt);
    navigator.clipboard.writeText(prompt).then(() => this.app.showToast('✅ 已复制到剪贴板', 'success')).catch(() => this.app.showToast('❌ 复制失败', 'error'));
  }

  toggleFavoriteAndRefresh(title) { this.toggleFavorite(title); document.querySelectorAll('.modal.active').forEach(m => m.remove()); this.showFavoritesModal(); }
  getLevelColor(level) { const colors = { beginner: '#34c759', intermediate: '#0071e3', advanced: '#af52de' }; return colors[level] || colors.beginner; }
  getLevelText(level) { const texts = { beginner: '入门', intermediate: '进阶', advanced: '高级' }; return texts[level] || texts.beginner; }

  getAITerms() {
    return [
      { category: '基础概念', icon: '🌱', terms: [
          { term: 'AI', full_name: 'Artificial Intelligence（人工智能）', explanation: '让计算机像人一样思考和做事的技术。比如能和你聊天的机器人、能识别图片内容的程序、能自动驾驶的汽车等。', example: '就像你正在使用的这个 AI 探险家应用，它能根据你的学习情况给出建议，这就是 AI 的一种应用。', level: 'beginner', first_appear: '1956 年', origin: '美国达特茅斯会议首次提出' },
          { term: '提示词 (Prompt)', full_name: 'Prompt', explanation: '你向 AI 提问时说的话或写的文字。就像问老师问题一样，你问得越清楚，AI 给你的答案就越好。', example: '比如"请帮我写一篇关于春天的作文"就是一个提示词。如果改成"请帮我写一篇 300 字关于春天的小学生作文，要描写校园里的景色"，AI 就能给你更好的答案。', level: 'beginner', first_appear: '2020 年代', origin: '随着大语言模型兴起而流行' },
          { term: '大语言模型 (LLM)', full_name: 'Large Language Model', explanation: '一种非常"博学"的 AI，它读了很多很多的书和文章，学会了人类的语言。可以回答问题、写文章、翻译、写代码等。', example: '就像一个读过世界上几乎所有书的超级学霸，你可以问它各种问题，它都能给出回答。豆包、DeepSeek、通义千问等都是基于大语言模型的产品。', level: 'intermediate', first_appear: '2018 年', origin: 'Google 发布 BERT 模型' },
          { term: '对话 AI', full_name: 'Conversational AI', explanation: '能像朋友一样和你聊天的 AI。它可以理解你的话，记住你们之前聊过的内容，然后给出合适的回答。', example: '就像有一个随时在线的 AI 朋友，你可以问它问题、让它帮你写作文、或者只是闲聊。', level: 'beginner', first_appear: '2022 年', origin: 'ChatGPT 发布后广泛流行' },
          { term: '机器学习', full_name: 'Machine Learning (ML)', explanation: '让计算机通过数据学习而不是 explicit 编程来完成任务的技术。就像让小孩通过看很多猫的图片学会认猫一样。', example: '视频 APP 根据你的观看历史推荐你可能喜欢的视频，这就是机器学习的应用。', level: 'intermediate', first_appear: '1959 年', origin: 'IBM 工程师 Arthur Samuel 提出' },
          { term: '深度学习', full_name: 'Deep Learning', explanation: '机器学习的一种，使用类似人脑的神经网络结构，可以处理更复杂的任务。', example: '人脸识别、语音助手、自动驾驶汽车都使用深度学习技术。', level: 'advanced', first_appear: '1986 年', origin: '神经网络研究发展而来' },
          { term: '神经网络', full_name: 'Neural Network', explanation: '模仿人脑神经元连接方式的计算模型，是深度学习的基础。就像很多小计算单元连在一起工作。', example: '就像一个团队，每个成员（神经元）负责一小部分计算，合起来就能解决复杂问题。', level: 'advanced', first_appear: '1943 年', origin: '心理学家 McCulloch 和数学家 Pitts 提出' },
          { term: 'Token', full_name: 'Token（词元）', explanation: 'AI 处理文字时的基本单位，可以是一个字、一个词或一部分。AI 不是按整句话理解，而是拆成一个个 Token 来处理。', example: '比如"我喜欢 AI"可能被分成"我"、"喜欢"、"AI"三个 Token。', level: 'intermediate', first_appear: '2017 年', origin: 'Transformer 模型提出后流行' }
        ]
      },
      { category: '技术概念', icon: '⚙️', terms: [
          { term: 'Agent（智能体）', full_name: 'AI Agent', explanation: '一种能独立完成任务的 AI。它不仅能回答问题，还能主动使用工具、执行操作，就像一个能独立工作的小助手。', example: '比如一个旅行规划 Agent，你告诉它"帮我规划北京 5 日游"，它会自动查天气、找景点、订酒店、安排行程，而不需要你一步步告诉它做什么。', level: 'advanced', first_appear: '2023 年', origin: '随着大模型能力提升而兴起' },
          { term: 'MCP', full_name: 'Model Context Protocol（模型上下文协议）', explanation: '一种让 AI 能连接和使用各种工具、数据的"通用插座"标准。就像手机充电口一样，有了统一标准，不同厂家的设备都能连接。', example: '有了 MCP，AI 可以轻松读取你的 Google 日历、Notion 笔记、GitHub 代码等，而不需要为每个服务单独开发接口。', level: 'advanced', first_appear: '2024 年', origin: 'Anthropic 公司推出' },
          { term: 'RAG', full_name: 'Retrieval-Augmented Generation（检索增强生成）', explanation: '一种让 AI 更聪明的技术。AI 在回答问题前，会先去查阅相关资料，然后结合查到的信息给出更准确的答案。', example: '就像一个开卷考试的学生，答题前会先翻书找答案。比如问 AI"昨天发生了什么新闻"，它会先搜索新闻，然后总结给你。', level: 'advanced', first_appear: '2020 年', origin: 'Facebook AI Research 提出' },
          { term: '微调 (Fine-tuning)', full_name: 'Fine-tuning', explanation: '让已经学会很多知识的 AI，再专门学习某个特定领域的知识。就像一个通才再学习成为某个领域的专家。', example: '一个通用的 AI 学习了医学书籍后，就能成为"AI 医生助手"；学习了法律条文后，就能成为"AI 法律顾问"。', level: 'advanced', first_appear: '2018 年', origin: '随着预训练模型发展而流行' },
          { term: '提示工程', full_name: 'Prompt Engineering', explanation: '设计和优化给 AI 的提示词，让 AI 给出更好回答的技术。就像教学生如何提问一样，问题问得好，答案就更准确。', example: '写文章让 AI 帮忙润色时，说"请帮我润色这段话，让它更流畅"比"修改一下"能得到更好的结果。', level: 'intermediate', first_appear: '2022 年', origin: '随着大语言模型兴起而流行' },
          { term: '少样本学习', full_name: 'Few-Shot Learning (FSL)', explanation: '让 AI 只通过几个例子就能学会新任务的技术。就像人看几个例子就能举一反三。', example: '给 AI 看 3 个翻译例子（如"你好→Hello"、"谢谢→Thank you"、"再见→Goodbye"），它就能翻译新的句子。', level: 'advanced', first_appear: '2020 年', origin: 'OpenAI 在 GPT-3 中展示此能力' },
          { term: '思维链', full_name: 'Chain of Thought (CoT)', explanation: '让 AI 把思考过程一步步写出来的技术。就像做数学题要写解题步骤，而不是只写答案。', example: '问 AI"小明有 5 个苹果，给了小红 2 个，又买了 3 个，现在有几个？"CoT 会让 AI 写出：5-2=3，3+3=6，所以有 6 个苹果。', level: 'advanced', first_appear: '2022 年', origin: 'Google Research 提出' },
          { term: 'Transformer', full_name: 'Transformer 架构', explanation: '一种革命性的 AI 模型架构，是现代大语言模型的基础。它使用"注意力机制"来理解文字之间的关系。', example: '就像读书时用荧光笔标出重点句子，Transformer 能关注句子中最重要的部分。', level: 'advanced', first_appear: '2017 年', origin: 'Google 团队提出' },
          { term: '注意力机制', full_name: 'Attention Mechanism', explanation: '让 AI 在处理长文本时，能够关注重要部分、忽略次要部分的技术。', example: '就像你读书时会重点看关键句子，略过不重要的内容。', level: 'advanced', first_appear: '2014 年', origin: 'Bahdanau 等人提出' },
          { term: '预训练', full_name: 'Pre-training', explanation: '在 AI 学习特定任务之前，先让它大量阅读文本学习通用知识的过程。就像学生先学习基础知识再学专业课程。', example: 'AI 先阅读大量书籍文章学会语言和常识，然后再学习如何写诗或编程。', level: 'intermediate', first_appear: '2018 年', origin: '随着 BERT、GPT 等模型流行' },
          { term: '上下文窗口', full_name: 'Context Window', explanation: 'AI 一次性能记住和处理的文字长度。窗口越大，AI 能处理的文档越长。', example: '上下文窗口小的 AI 只能一次读几段话，窗口大的可以一次读完整本书。', level: 'intermediate', first_appear: '2020 年代', origin: '随着大模型发展而受关注' },
          { term: '温度 (Temperature)', full_name: 'Temperature', explanation: '控制 AI 回答随机性的参数。温度高时 AI 更有创意但也更不可预测，温度低时更稳定但可能更无聊。', example: '温度设为 0.8 时 AI 写的诗更有创意，设为 0.2 时回答数学题更准确。', level: 'intermediate', first_appear: '2020 年代', origin: '大语言模型常用参数' },
          { term: '幻觉', full_name: 'AI Hallucination', explanation: 'AI 有时会编造看似真实但实际错误的信息，就像"做梦"一样。这是当前 AI 的一个局限。', example: '问 AI"谁是美国第 50 任总统"，它可能会编造一个名字和故事，但实际上美国只有 46 任总统。', level: 'intermediate', first_appear: '2022 年', origin: '大语言模型普遍存在的问题' }
        ]
      },
      { category: '应用场景', icon: '🚀', terms: [
          { term: 'AIGC', full_name: 'AI Generated Content（人工智能生成内容）', explanation: '用 AI 来创造内容，比如写文章、画画、作曲、做视频等。', example: '用 AI 画一幅画、写一首诗、生成一段音乐，这些都是 AIGC 的应用。', level: 'intermediate', first_appear: '2022 年', origin: '随着 Midjourney、Stable Diffusion 等工具兴起' },
          { term: '多模态 AI', full_name: 'Multimodal AI', explanation: '能同时理解和处理多种类型信息的 AI，比如文字、图片、声音、视频等。', example: '你给 AI 看一张照片，它能描述照片里的内容；或者你给它一段文字，它能画出对应的图片。', level: 'intermediate', first_appear: '2021 年', origin: 'OpenAI 发布 DALL-E' },
          { term: 'AI 助手', full_name: 'AI Assistant', explanation: '用 AI 技术打造的个人助手，可以帮你回答问题、制定计划、提醒事项、学习辅导等。', example: '手机里的 Siri、小爱同学，以及正在使用的 AI 探险家都是 AI 助手。', level: 'beginner', first_appear: '2010 年代', origin: 'Apple Siri 发布' },
          { term: '文生图', full_name: 'Text-to-Image', explanation: '用文字描述让 AI 生成对应图片的技术。你说想要什么，AI 就画什么。', example: '输入"一只在彩虹下吃冰淇淋的熊猫"，AI 就能生成这样的图片。', level: 'intermediate', first_appear: '2022 年', origin: 'DALL-E 2、Midjourney 等推动普及' },
          { term: '文生视频', full_name: 'Text-to-Video', explanation: '用文字描述让 AI 生成对应视频的技术。是文生图技术的延伸。', example: '输入"海浪拍打沙滩，夕阳西下"，AI 就能生成一段这样的视频。', level: 'advanced', first_appear: '2023 年', origin: 'Runway、Pika、Sora 等推动发展' },
          { term: 'AI 编程助手', full_name: 'AI Coding Assistant', explanation: '帮助程序员写代码、查 bug、解释代码的 AI 工具。就像一个随时在线的编程老师。', example: '告诉 AI"帮我写一个计算斐波那契数列的函数"，它就能生成完整代码。', level: 'intermediate', first_appear: '2021 年', origin: 'GitHub Copilot 发布' }
        ]
      },
      { category: 'AI 平台', icon: '💼', terms: [
          { term: 'SaaS', full_name: 'Software as a Service（软件即服务）', explanation: '通过互联网提供软件服务的模式。用户不需要下载安装，直接在浏览器中使用。', example: '正在使用的 AI 探险家就是 SaaS 模式，打开网页就能用，不需要安装。', level: 'intermediate', first_appear: '2000 年代', origin: '云计算发展而来' },
          { term: '大模型', full_name: 'Large Model / Foundation Model', explanation: '参数规模非常大的 AI 模型，通常有数十亿到数万亿参数。因为"读"了很多数据，所以能完成多种任务。', example: '豆包、DeepSeek、通义千问等都是基于大模型的产品。', level: 'intermediate', first_appear: '2018 年', origin: '随着 Transformer 架构发展' }
        ]
      },
      { category: '平台工具', icon: '🛠️', terms: [
          { term: 'API', full_name: 'Application Programming Interface（应用程序接口）', explanation: '让不同软件之间能互相"对话"的桥梁。就像餐厅的服务员，你在菜单上点菜（发送请求），服务员把菜端给你（返回结果）。', example: '一个天气 APP 通过 API 向气象局发送请求，获取天气数据，然后显示给你看。', level: 'intermediate', first_appear: '1940 年代', origin: '计算机科学早期概念' },
          { term: 'SDK', full_name: 'Software Development Kit（软件开发工具包）', explanation: '一套帮助开发者快速构建应用的工具集合。就像一个工具箱，里面有各种现成的工具和零件。', example: '想用 AI 画画？使用某个 AI 平台的 SDK，开发者只需要写几行代码就能实现，而不需要从头开发 AI 模型。', level: 'advanced', first_appear: '1980 年代', origin: '软件开发工具标准化' },
          { term: '开源', full_name: 'Open Source', explanation: '把软件的源代码公开，让任何人都可以看、学习、修改和使用。就像公开菜谱，任何人都可以学着做菜。', example: '很多 AI 模型如 Llama、DeepSeek 都是开源的，开发者可以学习它们的工作原理，或者在此基础上改进。', level: 'intermediate', first_appear: '1998 年', origin: '开源促进会成立' },
          { term: 'Hugging Face', full_name: 'Hugging Face', explanation: '一个 AI 模型共享平台，开发者可以在上面发布、下载和使用各种 AI 模型。就像 AI 界的"GitHub"。', example: '想用一个翻译 AI 模型？去 Hugging Face 上找，下载后就能用。', level: 'intermediate', first_appear: '2016 年', origin: '从聊天机器人转型为 AI 平台' },
          { term: 'GitHub Copilot', full_name: 'GitHub Copilot', explanation: 'GitHub 推出的 AI 编程助手，能根据上下文自动补全代码、生成函数。就像一个智能的代码输入法。', example: '写代码时输入函数名和注释，Copilot 会自动生成完整的函数代码。', level: 'intermediate', first_appear: '2021 年', origin: 'GitHub 与 OpenAI 合作开发' }
        ]
      }
    ];
  }

  getAIPlatforms() {
    return [
      { category: '国内平台', icon: '🇨🇳', platforms: [
          { name: '豆包', company: '字节跳动', url: 'https://www.doubao.com', icon: 'logos/doubao.png', launch_date: '2023 年', strengths: ['创意写作', '多模态能力', '免费使用'], description: '字节跳动推出的 AI 助手，擅长创意写作、文案生成，支持文生图、文档分析等多种功能。完全免费，适合学生日常使用。', best_for: ['写作文', '创意灵感', '图片生成', '文档总结'], age_recommend: '8 岁+', free: true },
          { name: 'DeepSeek', company: '深度求索', url: 'https://www.deepseek.com', icon: '💻', launch_date: '2024 年', strengths: ['编程能力', '逻辑推理', '数学计算'], description: '专注于代码和逻辑推理的 AI 模型，在编程、数学、逻辑分析方面表现突出。适合学习编程和理科知识。', best_for: ['写代码', '数学题', '逻辑推理', '算法学习'], age_recommend: '12 岁+', free: true },
          { name: '通义千问', company: '阿里巴巴', url: 'https://tongyi.aliyun.com', icon: 'logos/tongyi.png', launch_date: '2023 年', strengths: ['综合能力', '文档处理', '企业服务'], description: '阿里巴巴推出的全能型 AI，在文档处理、数据分析、多语言翻译方面能力强。支持超长文档处理。', best_for: ['文档分析', '翻译', '数据处理', '学习辅导'], age_recommend: '10 岁+', free: true },
          { name: 'Kimi', company: '月之暗面', url: 'https://kimi.moonshot.cn', icon: 'logos/kimi.png', launch_date: '2023 年', strengths: ['长文本处理', '知识问答', '学习能力'], description: '以超长上下文窗口著称，可以处理几十万字的文档。在知识问答和学习辅导方面表现优秀。', best_for: ['长文档阅读', '知识问答', '学习辅导', '资料整理'], age_recommend: '10 岁+', free: true },
          { name: '文心一言', company: '百度', url: 'https://yiyan.baidu.com', icon: 'logos/wenxin.png', launch_date: '2023 年', strengths: ['中文理解', '搜索能力', '知识图谱'], description: '百度推出的大语言模型，依托百度搜索引擎，在信息检索和知识问答方面有优势。', best_for: ['信息查询', '知识问答', '中文写作', '资料搜索'], age_recommend: '10 岁+', free: true },
          { name: '腾讯元宝', company: '腾讯', url: 'https://yuanbao.tencent.com', icon: 'logos/yuanbao.png', launch_date: '2024 年', strengths: ['社交场景', '创意内容', '多模态'], description: '腾讯推出的 AI 助手，在社交场景应用、创意内容生成方面有特色，支持多种创意玩法。', best_for: ['创意写作', '社交内容', '图片生成', '视频脚本'], age_recommend: '8 岁+', free: true },
          { name: '智谱清言', company: '智谱 AI', url: 'https://chatglm.cn', icon: 'logos/qingyan.png', launch_date: '2023 年', strengths: ['学术研究', '专业问答', '代码能力'], description: '源自清华技术，在学术研究、专业领域问答方面表现优秀，也具备较强的代码能力。', best_for: ['学术问题', '专业知识', '代码编写', '论文辅助'], age_recommend: '12 岁+', free: true },
          { name: 'MiniMax', company: 'MiniMax（月暗科技）', url: 'https://www.minimaxi.com', icon: '🤖', launch_date: '2024 年', strengths: ['角色扮演', '情感交互', '语音合成'], description: '专注于情感化 AI 交互，在角色扮演、虚拟伴侣、语音合成方面有特色。适合创意写作和情感交流。', best_for: ['角色扮演', '情感陪伴', '语音合成', '创意故事'], age_recommend: '12 岁+', free: true },
          { name: '讯飞星火', company: '科大讯飞', url: 'https://xinghuo.xfyun.cn', icon: '🔥', launch_date: '2023 年', strengths: ['语音识别', '教育场景', '多语言'], description: '科大讯飞推出的大模型，依托讯飞在语音识别领域的技术积累，在语音交互、教育场景有优势。', best_for: ['语音交互', '学习辅导', '语言学习', '听写练习'], age_recommend: '8 岁+', free: true },
          { name: '360 智脑', company: '360 公司', url: 'https://brain.360.cn', icon: '🧠', launch_date: '2023 年', strengths: ['安全知识', '信息检索', '免费使用'], description: '360 公司推出的 AI 助手，在安全知识、信息检索方面有积累，完全免费使用。', best_for: ['知识问答', '信息查询', '安全咨询', '日常对话'], age_recommend: '10 岁+', free: true },
          { name: '天工 AI', company: '昆仑万维', url: 'https://www.tiangong.cn', icon: '⚡', launch_date: '2023 年', strengths: ['搜索增强', '信息整合', '多模态'], description: '昆仑万维推出的 AI 助手，结合搜索增强技术，在信息整合、多模态处理方面有特色。', best_for: ['信息检索', '资料整合', '多模态创作', '数据分析'], age_recommend: '12 岁+', free: true },
          { name: '商量 SenseChat', company: '商汤科技', url: 'https://chat.sensetime.com', icon: '💡', launch_date: '2023 年', strengths: ['视觉理解', '图像分析', '多模态'], description: '商汤科技推出的 AI 助手，依托商汤在计算机视觉领域的技术，在图像理解、视觉分析方面有优势。', best_for: ['图片分析', '视觉问答', '图像创作', '设计辅助'], age_recommend: '12 岁+', free: true }
        ]
      },
      { category: '国际平台', icon: '🌍', platforms: [
          { name: 'ChatGPT', company: 'OpenAI（美国）', url: 'https://chat.openai.com', icon: '🤖', launch_date: '2022 年 11 月', strengths: ['综合对话', '多语言', '生态丰富'], description: '掀起全球 AI 热潮的对话式 AI，在多种语言、多领域任务中表现均衡。有庞大的用户生态和插件系统。', best_for: ['多语言交流', '创意写作', '知识问答', '代码辅助'], age_recommend: '13 岁+', free: false, note: '需要付费订阅获得完整功能' },
          { name: 'Claude', company: 'Anthropic（美国）', url: 'https://claude.ai', icon: '📝', launch_date: '2023 年', strengths: ['长文本', '安全性', '写作质量'], description: '以安全性和高质量写作著称，在长文档处理、创意写作方面能力强。由前 OpenAI 研究人员创立。', best_for: ['长文写作', '文档分析', '创意创作', '安全对话'], age_recommend: '13 岁+', free: false, note: '部分地区可用' },
          { name: 'Gemini', company: 'Google（美国）', url: 'https://gemini.google.com', icon: '✨', launch_date: '2023 年', strengths: ['多模态', '谷歌生态', '免费使用'], description: '谷歌推出的多模态 AI，能同时处理文字、图片、音频。与谷歌服务深度整合。', best_for: ['多模态任务', '信息检索', '翻译', '学习辅助'], age_recommend: '13 岁+', free: true },
          { name: 'Midjourney', company: 'Midjourney（美国）', url: 'https://www.midjourney.com', icon: '🎨', launch_date: '2022 年', strengths: ['图像生成', '艺术风格', '创意表达'], description: '专注于 AI 绘画的工具，能根据文字描述生成高质量图片。在艺术创作领域非常流行。', best_for: ['AI 绘画', '创意设计', '概念艺术', '插画生成'], age_recommend: '10 岁+', free: false, note: '需要订阅' },
          { name: 'Copilot', company: 'Microsoft（美国）', url: 'https://copilot.microsoft.com', icon: '✈️', launch_date: '2023 年', strengths: ['搜索增强', 'Office 整合', '免费使用'], description: '微软推出的 AI 助手，整合了必应搜索和 Office 套件，在信息检索、办公场景有优势。', best_for: ['信息检索', '文档处理', '代码辅助', '办公自动化'], age_recommend: '13 岁+', free: true },
          { name: 'Grok', company: 'xAI（美国）', url: 'https://grok.x.ai', icon: '🚀', launch_date: '2023 年', strengths: ['实时信息', '幽默风格', 'X 平台整合'], description: '马斯克创立的 xAI 团队开发的 AI，以幽默风格和实时信息访问为特色，与 X 平台深度整合。', best_for: ['实时资讯', '幽默对话', '社交媒体', '科技话题'], age_recommend: '16 岁+', free: false, note: '需要 X 平台 Premium 订阅' },
          { name: 'Perplexity', company: 'Perplexity AI（美国）', url: 'https://www.perplexity.ai', icon: '🔍', launch_date: '2022 年', strengths: ['学术搜索', '引用来源', '研究辅助'], description: '专注于学术研究和事实核查的 AI 搜索引擎，所有回答都提供引用来源。', best_for: ['学术研究', '事实核查', '资料收集', '论文写作'], age_recommend: '14 岁+', free: true },
          { name: 'Leonardo.ai', company: 'Leonardo（澳大利亚）', url: 'https://leonardo.ai', icon: '🎭', launch_date: '2022 年', strengths: ['游戏美术', '3D 资产', '免费额度'], description: '专注于游戏和 3D 内容创作的 AI 绘画工具，提供每日免费额度。', best_for: ['游戏美术', '3D 建模', '角色设计', '概念艺术'], age_recommend: '12 岁+', free: true },
          { name: 'Stable Diffusion', company: 'Stability AI（英国）', url: 'https://stability.ai', icon: '🌊', launch_date: '2022 年', strengths: ['开源模型', '本地部署', '高度定制'], description: '开源的 AI 绘画模型，可以本地部署，有极高的自定义性和扩展性。', best_for: ['AI 绘画', '艺术创作', '模型训练', '研究学习'], age_recommend: '14 岁+', free: true, note: '开源模型，可本地部署' },
          { name: 'Runway', company: 'Runway ML（美国）', url: 'https://runwayml.com', icon: '🎬', launch_date: '2021 年', strengths: ['视频生成', '视频编辑', '创意工具'], description: '专注于 AI 视频生成和编辑的工具，支持文生视频、图生视频等功能。', best_for: ['视频创作', '视频编辑', '特效制作', '短片生成'], age_recommend: '14 岁+', free: false, note: '有免费试用额度' },
          { name: 'Suno', company: 'Suno AI（美国）', url: 'https://suno.ai', icon: '🎵', launch_date: '2023 年', strengths: ['音乐生成', '歌曲创作', '多风格'], description: 'AI 音乐生成工具，能根据文字描述生成完整歌曲，包括歌词、旋律和编曲。', best_for: ['音乐创作', '歌曲生成', '配乐制作', '创意表达'], age_recommend: '10 岁+', free: true },
          { name: 'ElevenLabs', company: 'ElevenLabs（美国）', url: 'https://elevenlabs.io', icon: '🔊', launch_date: '2022 年', strengths: ['语音合成', '声音克隆', '多语言'], description: '领先的 AI 语音合成平台，能生成逼真的语音，支持声音克隆和多语言。', best_for: ['语音合成', '有声书', '视频配音', '声音创作'], age_recommend: '14 岁+', free: true }
        ]
      },
      { category: '专业工具', icon: '🛠️', platforms: [
          { name: 'Cursor', company: 'Anysphere（美国）', url: 'https://cursor.com', icon: '💻', launch_date: '2023 年', strengths: ['AI 编程', '代码补全', '智能编辑'], description: '基于 VS Code 开发的 AI 编程编辑器，深度整合 AI 代码能力，支持代码生成、修改、调试。', best_for: ['编程学习', '代码编写', '项目开发', 'Bug 修复'], age_recommend: '14 岁+', free: true },
          { name: 'Replit', company: 'Replit（美国）', url: 'https://replit.com', icon: '⌨️', launch_date: '2016 年', strengths: ['在线编程', '协作开发', 'AI 辅助'], description: '在线编程平台，支持多种编程语言，内置 AI 编程助手，适合学习和协作。', best_for: ['编程学习', '在线编程', '项目托管', '团队协作'], age_recommend: '10 岁+', free: true },
          { name: 'Canva AI', company: 'Canva（澳大利亚）', url: 'https://www.canva.com', icon: '🎨', launch_date: '2023 年', strengths: ['设计模板', 'AI 修图', '易用性'], description: '在线设计平台，整合多种 AI 功能，如 AI 修图、文生图、设计建议等。', best_for: ['平面设计', '海报制作', '社交媒体', '演示文稿'], age_recommend: '10 岁+', free: true },
          { name: 'Gamma', company: 'Gamma（美国）', url: 'https://gamma.app', icon: '📊', launch_date: '2022 年', strengths: ['PPT 生成', '演示设计', 'AI 排版'], description: 'AI 驱动的演示文稿制作工具，能根据大纲自动生成完整 PPT。', best_for: ['PPT 制作', '演示设计', '报告生成', '演讲辅助'], age_recommend: '12 岁+', free: true },
          { name: 'Notion AI', company: 'Notion（美国）', url: 'https://www.notion.so', icon: '📝', launch_date: '2023 年', strengths: ['笔记管理', '知识整理', '写作辅助'], description: 'Notion 内置的 AI 功能，支持写作辅助、内容总结、翻译等。', best_for: ['笔记整理', '写作辅助', '知识管理', '任务规划'], age_recommend: '12 岁+', free: false, note: '需要付费订阅' },
          { name: 'Character.ai', company: 'Character.ai（美国）', url: 'https://character.ai', icon: '🎭', launch_date: '2022 年', strengths: ['角色扮演', '虚拟对话', '个性化'], description: '可以创建和对话各种虚拟角色的平台，支持自定义角色性格和背景。', best_for: ['角色扮演', '语言练习', '创意写作', '娱乐对话'], age_recommend: '13 岁+', free: true }
        ]
      }
    ];
  }

  toggleSortMode() { this.sortMode = this.sortMode === 'time' ? 'alphabetical' : 'time'; this.showTermsModal(); }

  showTermsModal() {
    // 先关闭已存在的术语词典模态框（防止重复打开导致多层叠加）
    document.querySelectorAll('.modal.active').forEach(m => {
      const header = m.querySelector('.modal-header h3');
      if (header && header.textContent.includes('术语词典')) {
        m.remove();
      }
    });
    
    const progress = this.getLearningProgress();
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    // 卡片样式常量 - 浅白色背景高对比度
    const cardBg = 'rgba(250, 250, 252, 0.98)';
    const textColor = '#1a1a1a';
    const secondaryColor = '#666666';
    const borderColor = 'rgba(0,0,0,0.08)';
    
    let displayTerms = [];
    if (this.searchQuery.terms) { 
      displayTerms = this.searchTerms(this.searchQuery.terms); 
    } else { 
      displayTerms = this.terms.flatMap(cat => { 
        let catTerms = [...cat.terms]; 
        if (this.sortMode === 'alphabetical') { 
          catTerms.sort((a, b) => a.term.localeCompare(b.term, 'zh-CN')); 
        } else { 
          catTerms.sort((a, b) => { 
            const yearA = parseInt(a.first_appear.match(/\d{4}/)?.[0] || '0'); 
            const yearB = parseInt(b.first_appear.match(/\d{4}/)?.[0] || '0'); 
            return yearA - yearB; 
          }); 
        } 
        return catTerms.map(term => ({ ...term, category: cat.category, icon: cat.icon })); 
      }); 
    }
    modal.innerHTML = `
      <div class="modal-content modal-large knowledge-modal">
        <button class="modal-close" onclick="closeTermsModalAndClearSearch()">×</button>
        <div class="modal-header">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3>📖 AI 术语词典</h3>
            <div style="display: flex; gap: 8px;">
              <button class="btn-secondary" onclick="toggleSortMode()" style="font-size: 12px;">${this.sortMode === 'time' ? '📅 按时间' : '🔤 按字母'}</button>
              <button class="btn-secondary" onclick="showContributeModal('term')" style="font-size: 12px;">➕ 贡献</button>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 20px; display: flex; gap: 12px; align-items: center;">
            <input type="text" id="term-search-input" placeholder="🔍 搜索术语..." value="${this.searchQuery.terms || ''}" data-last-search="${this.searchQuery.terms || ''}" style="flex: 1; padding: 12px 16px; border: var(--card-border); border-radius: 12px; background: var(--card-bg); color: var(--text-primary); font-size: 14px; backdrop-filter: blur(10px);">
            ${this.searchQuery.terms ? `<button onclick="clearTermSearchAndRefresh()" style="padding: 8px 12px; background: var(--card-bg); border: var(--card-border); border-radius: 8px; color: var(--text-secondary); cursor: pointer; font-size: 14px;" title="清除搜索">❌</button>` : ''}
          </div>
          <div style="margin-bottom: 20px; padding: 16px; background: var(--card-bg); border-radius: 12px; border: var(--card-border); backdrop-filter: blur(10px);">
            <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 14px; color: var(--text-secondary);">📚 学习进度</span><span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${progress.terms.read}/${progress.terms.total} 术语已读</span></div>
            <div style="margin-top: 8px; height: 6px; background: rgba(0,0,0,0.05); border-radius: 3px;"><div style="width: ${progress.terms.percent}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--purple)); border-radius: 3px;"></div></div>
          </div>
          <div style="display: grid; gap: 16px;">
            ${displayTerms.map(item => { const termKey = `${item.category}-${item.term}`; const isRead = this.isTermRead(termKey); const isFavorite = this.isTermFavorite(termKey); const relatedTerms = this.getRelatedTerms(termKey); return `
                <div class="knowledge-card" style="padding: 20px; background: ${cardBg}; border-radius: 16px; border-left: 4px solid ${this.getLevelColor(item.level)}; position: relative; border: 1px solid ${borderColor}; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.08);" onmouseover="this.style.transform='translateX(4px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateX(0)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
                  ${isRead ? '<span style="position: absolute; top: 12px; right: 12px; font-size: 12px; color: #34c759; font-weight: 600;">✅ 已读</span>' : ''}
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <div><h5 style="font-weight: 700; font-size: 18px; margin-bottom: 4px; color: ${textColor};">${item.term}</h5><div style="font-size: 12px; color: ${secondaryColor};">${item.full_name}</div></div>
                    <div style="text-align: right;"><div style="font-size: 11px; color: ${secondaryColor};">首次出现</div><div style="font-size: 13px; color: #0071e3; font-weight: 600;">${item.first_appear}</div></div>
                  </div>
                  <div style="margin-bottom: 12px;"><div style="font-size: 15px; line-height: 1.7; color: ${textColor}; font-weight: 400;">${item.explanation}</div></div>
                  <div style="padding: 14px; background: rgba(52,199,89,0.1); border-radius: 10px; margin-bottom: 12px; border: 1px solid rgba(52,199,89,0.25);"><div style="font-size: 13px; color: ${textColor}; margin-bottom: 6px; font-weight: 600;">💡 举个例子</div><div style="font-size: 14px; line-height: 1.6; color: ${textColor};">${item.example}</div></div>
                  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                    <span style="font-size: 11px; padding: 4px 10px; background: rgba(0,0,0,0.04); border-radius: 10px; color: ${textColor}; border: 1px solid ${borderColor}; font-weight: 500;">${this.getLevelText(item.level)}</span>
                    <span style="font-size: 11px; padding: 4px 10px; background: rgba(0,0,0,0.04); border-radius: 10px; color: ${textColor}; border: 1px solid ${borderColor}; font-weight: 500;">📍 ${item.origin}</span>
                    <div style="margin-left: auto; display: flex; gap: 8px;">
                      <button class="btn-secondary" style="padding: 6px 12px; font-size: 11px; font-weight: 500; background: rgba(0,0,0,0.04); color: ${textColor}; border: 1px solid ${borderColor}; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(0,0,0,0.08)'" onmouseout="this.style.background='rgba(0,0,0,0.04)'" onclick="markTermAsRead('${termKey}')">📖 已读</button>
                      <button class="btn-secondary" style="padding: 6px 12px; font-size: 11px; font-weight: 500; background: rgba(0,0,0,0.04); color: ${textColor}; border: 1px solid ${borderColor}; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(0,0,0,0.08)'" onmouseout="this.style.background='rgba(0,0,0,0.04)'" onclick="toggleTermFavorite('${termKey}')">${isFavorite ? '⭐' : '🤍'}</button>
                      <button class="btn-secondary" style="padding: 6px 12px; font-size: 11px; font-weight: 500; background: rgba(0,0,0,0.04); color: ${textColor}; border: 1px solid ${borderColor}; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(0,0,0,0.08)'" onmouseout="this.style.background='rgba(0,0,0,0.04)'" onclick="showQuizModal('${termKey}')">📝 测验</button>
                    </div>
                  </div>
                  ${relatedTerms.length > 0 ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid ${borderColor};"><div style="font-size: 12px; color: ${secondaryColor}; margin-bottom: 8px; font-weight: 500;">🔗 相关术语：</div><div style="display: flex; flex-wrap: wrap; gap: 6px;">${relatedTerms.map(rt => `<span style="font-size: 11px; padding: 4px 8px; background: rgba(0,0,0,0.04); border-radius: 8px; cursor: pointer; color: ${textColor}; border: 1px solid ${borderColor}; font-weight: 500; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(0,0,0,0.08)';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='rgba(0,0,0,0.04)';this.style.transform='translateY(0)'" onclick="searchTerms('${rt.term}')">${rt.term}</span>`).join('')}</div></div>` : ''}
                </div>`; }).join('')}
          </div>
          ${displayTerms.length === 0 ? '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">未找到相关术语</p>' : ''}
        </div>
      </div>`;
    document.body.appendChild(modal);
    // 添加搜索框事件监听（使用 change 事件而不是 input，避免每次输入都刷新）
    setTimeout(() => {
      const searchInput = document.getElementById('term-search-input');
      if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            this.handleTermSearch(e.target.value);
          }, 300);
        });
      }
    }, 10);
  }

  filterPlatformsByCategory(category) {
    this.currentPlatformFilter = category;
    // 先关闭所有已存在的平台百科模态框
    document.querySelectorAll('.modal.active').forEach(m => {
      const header = m.querySelector('.modal-header h3');
      if (header && header.textContent.includes('平台百科')) {
        m.remove();
      }
    });
    // 重新打开模态框
    this.showPlatformsModal();
  }

  showPlatformsModal() {
    // 先关闭已存在的平台百科模态框（防止重复打开导致多层叠加）
    document.querySelectorAll('.modal.active').forEach(m => {
      const header = m.querySelector('.modal-header h3');
      if (header && header.textContent.includes('平台百科')) {
        m.remove();
      }
    });
    
    const progress = this.getLearningProgress();
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    // 卡片样式常量 - 纯白色背景高对比度，加粗加大加黑字体
    const cardBg = '#ffffff';
    const textColor = '#000000';
    const secondaryColor = '#333333';
    const borderColor = 'rgba(0,0,0,0.15)';
    
    // 获取所有分类
    const categories = this.platforms.map(cat => ({ name: cat.category, icon: cat.icon }));
    
    // 根据筛选条件获取要显示的平台
    let displayPlatforms = [];
    if (this.searchQuery.platforms) { 
      displayPlatforms = this.searchPlatforms(this.searchQuery.platforms); 
    } else if (this.currentPlatformFilter === 'all') {
      // 默认显示所有分类
      displayPlatforms = this.platforms.flatMap(cat => { 
        let catPlatforms = [...cat.platforms]; 
        if (this.sortMode === 'alphabetical') { 
          catPlatforms.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')); 
        } else { 
          catPlatforms.sort((a, b) => { 
            const yearA = parseInt(a.launch_date.match(/\d{4}/)?.[0] || '0'); 
            const yearB = parseInt(b.launch_date.match(/\d{4}/)?.[0] || '0'); 
            return yearB - yearA; 
          }); 
        } 
        return catPlatforms; 
      });
    } else {
      // 只显示选中分类的平台
      const selectedCategory = this.platforms.find(cat => cat.category === this.currentPlatformFilter);
      if (selectedCategory) {
        let catPlatforms = [...selectedCategory.platforms];
        if (this.sortMode === 'alphabetical') {
          catPlatforms.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
        } else {
          catPlatforms.sort((a, b) => {
            const yearA = parseInt(a.launch_date.match(/\d{4}/)?.[0] || '0');
            const yearB = parseInt(b.launch_date.match(/\d{4}/)?.[0] || '0');
            return yearB - yearA;
          });
        }
        displayPlatforms = catPlatforms;
      }
    }
    modal.innerHTML = `
      <div class="modal-content modal-large knowledge-modal">
        <button class="modal-close" onclick="closePlatformsModalAndClearSearch()">×</button>
        <div class="modal-header">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3>🌐 AI 平台百科</h3>
            <div style="display: flex; gap: 8px;">
              <button class="btn-secondary" onclick="toggleSortMode()" style="font-size: 12px;">${this.sortMode === 'time' ? '📅 按时间' : '🔤 按字母'}</button>
              <button id="compare-btn" class="btn-secondary" onclick="showCompareModal()" style="font-size: 12px;">📊 对比 (${this.compareList.length})</button>
              <button class="btn-secondary" onclick="showContributeModal('platform')" style="font-size: 12px;">➕ 贡献</button>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <!-- 分类筛选按钮 -->
          <div style="margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; padding: 4px; background: var(--card-bg); border-radius: 12px; max-width: fit-content; margin-left: auto; margin-right: auto; border: var(--card-border); backdrop-filter: blur(10px);">
            <button class="filter-btn ${this.currentPlatformFilter === 'all' ? 'active' : ''}" onclick="filterPlatformsByCategory('all')" style="padding: 8px 16px; border-radius: 10px; border: 1px solid ${this.currentPlatformFilter === 'all' ? 'var(--accent-primary)' : 'rgba(0,0,0,0.08)'}; background: ${this.currentPlatformFilter === 'all' ? 'var(--bg-gradient)' : 'var(--card-bg)'}; color: ${this.currentPlatformFilter === 'all' ? 'white' : 'var(--text-secondary)'}; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease; backdrop-filter: blur(10px);" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">📋 全部</button>
            ${categories.map(cat => `
              <button class="filter-btn ${this.currentPlatformFilter === cat.name ? 'active' : ''}" onclick="filterPlatformsByCategory('${cat.name}')" style="padding: 8px 16px; border-radius: 10px; border: 1px solid ${this.currentPlatformFilter === cat.name ? 'var(--accent-primary)' : 'rgba(0,0,0,0.08)'}; background: ${this.currentPlatformFilter === cat.name ? 'var(--bg-gradient)' : 'var(--card-bg)'}; color: ${this.currentPlatformFilter === cat.name ? 'white' : 'var(--text-secondary)'}; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease; backdrop-filter: blur(10px);" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">${cat.icon} ${cat.name}</button>
            `).join('')}
          </div>
          
          <div style="margin-bottom: 20px; display: flex; gap: 12px; align-items: center;">
            <input type="text" id="platform-search-input" placeholder="🔍 搜索平台..." value="${this.searchQuery.platforms || ''}" data-last-search="${this.searchQuery.platforms || ''}" style="flex: 1; padding: 12px 16px; border: var(--card-border); border-radius: 12px; background: var(--card-bg); color: var(--text-primary); font-size: 14px; backdrop-filter: blur(10px);">
            ${this.searchQuery.platforms ? `<button onclick="clearPlatformSearchAndRefresh()" style="padding: 8px 12px; background: var(--card-bg); border: var(--card-border); border-radius: 8px; color: var(--text-secondary); cursor: pointer; font-size: 14px;" title="清除搜索">❌</button>` : ''}
          </div>
          <div style="margin-bottom: 20px; padding: 16px; background: var(--card-bg); border-radius: 12px; border: var(--card-border); backdrop-filter: blur(10px);">
            <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 14px; color: var(--text-secondary);">📚 学习进度</span><span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${progress.platforms.read}/${progress.platforms.total} 平台已读</span></div>
            <div style="margin-top: 8px; height: 6px; background: rgba(0,0,0,0.05); border-radius: 3px;"><div style="width: ${progress.platforms.percent}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--purple)); border-radius: 3px;"></div></div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px;">
            ${displayPlatforms.map(p => { const platformKey = this.getPlatformKey(p); const isRead = this.isPlatformRead(platformKey); const isFavorite = this.isPlatformFavorite(platformKey); const inCompare = this.compareList.includes(platformKey); return `
                <div class="knowledge-card platform-card" style="padding: 24px; background: ${cardBg}; border-radius: 16px; border: 2px solid ${borderColor}; position: relative; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0,0,0,0.12);" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,0.16)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.12)'">
                  ${isRead ? '<span style="position: absolute; top: 16px; right: 16px; font-size: 14px; color: #1d8a4a; font-weight: 700;">✅ 已读</span>' : ''}
                  <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <div style="width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.06); border-radius: 14px; font-size: 32px; flex-shrink: 0; border: 2px solid rgba(0,0,0,0.1);">${p.icon.startsWith('logos/') ? '🌐' : p.icon}</div>
                    <div style="flex: 1; min-width: 0;">
                      <h5 style="font-weight: 800; margin: 0 0 6px 0; color: #000000; font-size: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${p.name}</h5>
                      <div style="font-size: 14px; color: #000000; font-weight: 600;">${p.company} · ${p.launch_date}</div>
                    </div>
                  </div>
                  <p style="font-size: 16px; color: #000000; line-height: 1.8; margin-bottom: 16px; font-weight: 600;">${p.description}</p>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">${p.strengths.map(s => `<span style="font-size: 13px; padding: 6px 14px; background: rgba(0,0,0,0.06); color: #000000; border-radius: 10px; border: 1px solid rgba(0,0,0,0.12); font-weight: 700;">${s}</span>`).join('')}</div>
                  <div style="font-size: 14px; color: #000000; margin-bottom: 16px;"><strong style="font-weight: 800;">适合：</strong><span style="font-weight: 600;">${p.best_for.join('、')}</span></div>
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding-top: 16px; border-top: 2px solid ${borderColor};">
                    <div style="font-size: 13px; color: #000000; font-weight: 600;">${p.free ? '<span style="color: #1d8a4a; font-weight: 700;">✅ 免费</span>' : '<span style="color: #d97706; font-weight: 700;">💰 付费</span>'} · <span style="font-weight: 600;">推荐年龄：${p.age_recommend}</span></div>
                    <button class="btn-primary" style="padding: 10px 20px; font-size: 15px; font-weight: 700; background: linear-gradient(135deg, #0071e3 0%, #005bb5 100%); color: white; border: none; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,113,227,0.4);" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(0,113,227,0.5)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(0,113,227,0.4)'" onclick="window.open('${p.url}', '_blank')">访问 →</button>
                  </div>
                  <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid ${borderColor}; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn-secondary" style="padding: 8px 14px; font-size: 13px; font-weight: 700; background: rgba(0,0,0,0.06); color: #000000; border: 2px solid ${borderColor}; border-radius: 10px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(0,0,0,0.12)'" onmouseout="this.style.background='rgba(0,0,0,0.06)'" onclick="markPlatformAsRead('${platformKey}')">📖 已读</button>
                    <button class="btn-secondary" style="padding: 8px 14px; font-size: 13px; font-weight: 700; background: rgba(0,0,0,0.06); color: #000000; border: 2px solid ${borderColor}; border-radius: 10px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(0,0,0,0.12)'" onmouseout="this.style.background='rgba(0,0,0,0.06)'" onclick="togglePlatformFavorite('${platformKey}')">${isFavorite ? '⭐' : '🤍'} 收藏</button>
                    <button class="btn-secondary" style="padding: 8px 14px; font-size: 13px; font-weight: 700; background: ${inCompare ? 'linear-gradient(135deg, #0071e3 0%, #005bb5 100%)' : 'rgba(0,0,0,0.06)'}; color: ${inCompare ? 'white' : '#000000'}; border: 2px solid ${borderColor}; border-radius: 10px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='${inCompare ? 'linear-gradient(135deg, #005bb5 0%, #004499 100%)' : 'rgba(0,0,0,0.12)'}'" onmouseout="this.style.background='${inCompare ? 'linear-gradient(135deg, #0071e3 0%, #005bb5 100%)' : 'rgba(0,0,0,0.06)'}'" onclick="addToCompare('${platformKey}')">${inCompare ? '✓ 对比中' : '+ 对比'}</button>
                  </div>
                  ${p.note ? `<div style="margin-top: 12px; font-size: 13px; color: #000000; font-weight: 600; font-style: italic; padding: 10px; background: rgba(0,0,0,0.04); border-radius: 8px; border-left: 3px solid #0071e3;">ℹ️ ${p.note}</div>` : ''}
                </div>`; }).join('')}
          </div>
          ${displayPlatforms.length === 0 ? '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">未找到相关平台</p>' : ''}
        </div>
      </div>`;
    document.body.appendChild(modal);
    this.updateCompareButton();
    // 添加搜索框事件监听（使用 change 事件而不是 input，避免每次输入都刷新）
    setTimeout(() => {
      const searchInput = document.getElementById('platform-search-input');
      if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            this.handlePlatformSearch(e.target.value);
          }, 300);
        });
      }
    }, 10);
  }
}

window.KnowledgeManager = KnowledgeManager;

// 立即绑定全局方法（不依赖 app 初始化）
(function() {
  const virtualApp = { showToast: function(msg) { console.log('Toast:', msg); }, knowledge: null };
  const tempInstance = new KnowledgeManager(virtualApp);
  virtualApp.knowledge = tempInstance;
  console.log('📚 知识库全局方法已预绑定');
})();