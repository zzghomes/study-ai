// AI 探险家 - 21 天学习任务系统
// 版本：2026-03-25
// 说明：21 天完整版，包含 4 个阶段（青铜、白银、黄金、钻石）

// ==================== AI 平台数据（15 个平台）====================
const AI_PLATFORMS = [
  {
    id: 'doubao',
    name: '豆包',
    company: '字节跳动',
    icon: 'logos/doubao.png',
    color: '#6C5CE7',
    strengths: ['语音交互超棒', '多模态能力强', '对话有趣', '适合创意'],
    uses: '聊天、学习辅导、创意写作、图片生成、语音对话',
    url: 'https://www.doubao.com',
    ageRecommend: '8 岁+',
    free: true,
    description: '豆包是字节跳动推出的 AI 助手，最大的特点是语音交互非常好，可以像朋友一样聊天。它还能生成图片，帮助你实现创意想法。',
    bestFor: ['创意写作', '语音对话', '图片生成']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    company: '深度求索',
    icon: 'logos/deepseek.png',
    color: '#00CEC9',
    strengths: ['编程能力超强', '数学推理好', '逻辑清晰', '代码解释详细'],
    uses: '学习编程、解决数学题、逻辑训练、作业检查',
    url: 'https://www.deepseek.com',
    ageRecommend: '10 岁+',
    free: true,
    description: 'DeepSeek 是一个特别擅长编程和数学的 AI。如果你想学习写代码或者解决数学难题，它是非常好的选择。它会一步步解释，让你真正理解。',
    bestFor: ['编程学习', '数学题', '逻辑推理']
  },
  {
    id: 'qwen',
    name: '通义千问',
    company: '阿里巴巴',
    icon: 'logos/tongyi.png',
    color: '#FF7675',
    strengths: ['中文理解最好', '知识库超大', '写作能力强', '办公助手'],
    uses: '写作文、查知识、做总结、办公学习',
    url: 'https://tongyi.aliyun.com',
    ageRecommend: '8 岁+',
    free: true,
    description: '通义千问是阿里巴巴的 AI 助手，中文理解能力特别强。它读过很多书，可以帮你写作文、总结文章、解答各种问题。',
    bestFor: ['写作', '知识查询', '文档总结']
  },
  {
    id: 'kimi',
    name: 'Kimi',
    company: '月之暗面',
    icon: 'logos/kimi.png',
    color: '#A29BFE',
    strengths: ['长文本处理最强', '阅读理解好', '总结能力强', '分析深入'],
    uses: '读长文章、写读书笔记、分析报告、学习研究',
    url: 'https://kimi.moonshot.cn',
    ageRecommend: '10 岁+',
    free: true,
    description: 'Kimi 最厉害的地方是可以阅读超长的文章。如果你有一篇几千字的文章要理解，Kimi 可以帮你快速总结重点。',
    bestFor: ['长文阅读', '读书笔记', '内容总结']
  },
  {
    id: 'ernie',
    name: '文心一言',
    company: '百度',
    icon: 'logos/wenxin.png',
    color: '#00B894',
    strengths: ['搜索整合好', '实时信息', '中文内容多', '画图能力强'],
    uses: '查新闻、找资料、创作图片、信息查询',
    url: 'https://yiyan.baidu.com',
    ageRecommend: '8 岁+',
    free: true,
    description: '文心一言是百度的 AI，它可以连接互联网搜索最新信息。如果你想了解新闻或者找资料，它很有帮助。',
    bestFor: ['信息搜索', '新闻查询', '图片创作']
  },
  {
    id: 'glm',
    name: '智谱清言',
    company: '智谱 AI（清华）',
    icon: 'logos/qingyan.png',
    color: '#FDCB6E',
    strengths: ['学术研究强', '知识准确', '学习辅导好', '解释清晰'],
    uses: '学习研究、论文辅导、知识查询、学术问题',
    url: 'https://chatglm.cn',
    ageRecommend: '10 岁+',
    free: true,
    description: '智谱清言来自清华大学团队，学术能力很强。如果你有学习上的问题，它会给出准确、详细的解答。',
    bestFor: ['学术学习', '知识辅导', '问题解答']
  },
  {
    id: 'yuanbao',
    name: '腾讯元宝',
    company: '腾讯',
    icon: 'logos/yuanbao.png',
    color: '#74B9FF',
    strengths: ['微信生态整合', '日常助手', '社交功能', '便民服务'],
    uses: '日常问答、微信相关、生活服务、娱乐',
    url: 'https://yuanbao.tencent.com',
    ageRecommend: '8 岁+',
    free: true,
    description: '腾讯元宝可以和微信很好地配合。它可以帮你处理日常问题，是个生活小助手。',
    bestFor: ['日常问答', '生活服务', '微信集成']
  },
  {
    id: 'hunyuan',
    name: '腾讯混元',
    company: '腾讯',
    icon: '🌟',
    color: '#0984e3',
    strengths: ['多模态能力强', '游戏相关', '创意生成', '企业应用'],
    uses: '创意写作、图片生成、视频理解、游戏辅助',
    url: 'https://hunyuan.tencent.com',
    ageRecommend: '10 岁+',
    free: true,
    description: '混元是腾讯的多模态 AI 大模型，在图片生成和视频理解方面很强。',
    bestFor: ['图片生成', '视频理解', '创意内容']
  },
  {
    id: 'doubao_pro',
    name: '即梦 AI',
    company: '字节跳动',
    icon: '✨',
    color: '#fd79a8',
    strengths: ['AI 绘画专业', '创意工具多', '模板丰富', '易上手'],
    uses: 'AI 绘画、设计素材、创意图片、艺术创作',
    url: 'https://jimeng.jianying.com',
    ageRecommend: '8 岁+',
    free: true,
    description: '即梦是字节的专业 AI 绘画工具，有很多模板和风格可以选择，非常适合创作艺术图片。',
    bestFor: ['AI 绘画', '创意设计', '艺术创作']
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    company: 'MiniMax',
    icon: 'logos/deepseek.png',
    color: '#6c5ce7',
    strengths: ['对话自然', '角色扮演', '情感理解', '语音合成'],
    uses: '聊天对话、角色扮演、语音合成、情感陪伴',
    url: 'https://www.minimax.io',
    ageRecommend: '10 岁+',
    free: true,
    description: 'MiniMax 的对话非常自然，还能扮演不同角色，就像和真人聊天一样。',
    bestFor: ['自然对话', '角色扮演', '语音交互']
  },
  {
    id: 'baichuan',
    name: '百川大模型',
    company: '百川智能',
    icon: '🌊',
    color: '#00cec9',
    strengths: ['医疗咨询', '法律问答', '专业知识', '多语言'],
    uses: '专业咨询、知识问答、多语言翻译、学习辅导',
    url: 'https://www.baichuan-ai.com',
    ageRecommend: '12 岁+',
    free: true,
    description: '百川在医疗和法律等专业领域表现很好，适合查询专业知识。',
    bestFor: ['专业咨询', '知识问答', '翻译']
  },
  {
    id: 'sensechat',
    name: '商量 SenseChat',
    company: '商汤科技',
    icon: '💡',
    color: '#e17055',
    strengths: ['视觉识别强', '图像分析', '多模态', '科技创新'],
    uses: '图像识别、视觉问答、创意分析、科技探索',
    url: 'https://chat.sensetime.com',
    ageRecommend: '10 岁+',
    free: true,
    description: '商汤的 AI 在图像识别方面很强，可以分析图片内容并回答问题。',
    bestFor: ['图像分析', '视觉问答', '科技创新']
  },
  {
    id: 'coze',
    name: 'Coze',
    company: '字节跳动',
    icon: '🧩',
    color: '#a29bfe',
    strengths: ['Bot 创建', '插件丰富', '自动化', '无需编程'],
    uses: '创建 AI 机器人、自动化任务、集成工具、个性化助手',
    url: 'https://www.coze.com',
    ageRecommend: '12 岁+',
    free: true,
    description: 'Coze 让你无需编程就能创建自己的 AI 机器人，可以集成各种工具和服务。',
    bestFor: ['创建 Bot', '自动化', '工具集成']
  },
  {
    id: 'dify',
    name: 'Dify',
    company: 'Dify.AI',
    icon: '⚙️',
    color: '#fab1a0',
    strengths: ['应用开发', '工作流', '可视化', '部署简单'],
    uses: '开发 AI 应用、创建工作流、部署 AI 服务、团队协作',
    url: 'https://dify.ai',
    ageRecommend: '14 岁+',
    free: true,
    description: 'Dify 是一个可视化的 AI 应用开发平台，可以创建工作流并部署自己的 AI 服务。',
    bestFor: ['应用开发', '工作流', 'AI 部署']
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    company: 'OpenAI',
    icon: '💚',
    color: '#10b981',
    strengths: ['全球最强', '多语言', '知识广', '生态好'],
    uses: '全球通用、多语言交流、知识查询、创意写作',
    url: 'https://chat.openai.com',
    ageRecommend: '13 岁+',
    free: false,
    description: 'ChatGPT 是全球最知名的 AI 助手，能力全面，但需要特殊网络访问。',
    bestFor: ['全球使用', '多语言', '综合任务']
  }
];

// ==================== 21 天任务数据 ====================
const TASKS_21DAYS = [
  // ========== 第一阶段：青铜段位（基础入门）==========
  {
    day: 1,
    level: 1,
    stage: 'bronze',
    title: 'AI 初体验',
    platform: '多平台对比',
    platformId: 'all',
    difficulty: 1,
    completed: false,
    xp: 150,
    platforms: ['doubao', 'qwen', 'kimi'],
    description: '欢迎来到 AI 探险家！通过对比 3 个 AI 回答同一问题，你会发现每个 AI 都有自己的特点和风格。',
    cases: [
      {
        title: '🤖 自我介绍大比拼',
        prompt: '请帮我写一个适合 12 岁中学生的自我介绍，要有趣、有个性，100 字左右',
        tip: '分别问 3 个不同的 AI，对比它们的回答风格',
        xp: 50,
        platforms: ['doubao', 'qwen', 'kimi'],
        screenshot: true
      },
      {
        title: '📊 AI 风格分析',
        prompt: '刚才 3 个 AI 的回答各有什么特点？你更喜欢哪个？为什么？',
        tip: '记录你的发现，这是选择 AI 的第一步',
        xp: 50,
        platforms: ['doubao']
      },
      {
        title: '🎨 个性头像生成',
        prompt: '请画一个代表我个性的卡通头像，要酷酷的，适合中学生',
        tip: '描述你的个性特点，让 AI 帮你画出来',
        xp: 50,
        platforms: ['doubao'],
        screenshot: true
      }
    ],
    tips: '每个 AI 都有自己的"性格"，多尝试才能找到最适合你的那个！',
    badge: 'explorer',
    logRequired: true,
    logPrompts: ['你发现 3 个 AI 的回答有什么不同？', '你最喜欢哪个 AI 的回答？为什么？']
  },
  {
    day: 2,
    level: 2,
    stage: 'bronze',
    title: '提示词工程师入门',
    platform: '豆包/Kimi',
    platformId: 'doubao',
    difficulty: 2,
    completed: false,
    xp: 200,
    platforms: ['doubao', 'kimi'],
    description: '提示词是与 AI 沟通的"魔法咒语"。学习写好提示词，让 AI 更好地理解你的需求。',
    cases: [
      {
        title: '📝 坏提示词 vs 好提示词',
        prompt: '对比"画一只猫"和"画一只橘色的波斯猫，坐在窗台上，阳光洒在它身上，写实风格"的差异',
        tip: '体验详细描述的力量',
        xp: 60,
        platforms: ['doubao'],
        screenshot: true
      },
      {
        title: '🧙 提示词公式练习',
        prompt: '用"角色 + 任务 + 要求 + 示例"公式，让 AI 帮你写一篇 300 字的游记',
        tip: '公式：你是谁 + 要做什么 + 有什么要求 + 参考例子',
        xp: 70,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '🔄 多轮对话优化',
        prompt: '让 AI 写一个故事开头，然后提出修改意见让它改进，重复 3 次',
        tip: '记录每次的提示词和效果变化',
        xp: 70,
        platforms: ['doubao', 'kimi'],
        screenshot: true
      }
    ],
    tips: '好提示词 = 清晰的目标 + 具体的要求 + 必要的背景信息',
    badge: 'prompt_master',
    logRequired: true,
    logPrompts: ['你学到了什么提示词技巧？', '记录你最好的一个提示词']
  },
  {
    day: 3,
    level: 3,
    stage: 'bronze',
    title: '平台选择大师',
    platform: '全部体验',
    platformId: 'all',
    difficulty: 2,
    completed: false,
    xp: 250,
    platforms: ['doubao', 'qwen', 'kimi', 'ernie', 'yuanbao'],
    description: '不同的 AI 平台有不同的特长。学会根据任务选择合适的平台，是成为 AI 达人的关键。',
    cases: [
      {
        title: '🔬 同一问题问 5 个 AI',
        prompt: '请用简单的话解释"什么是人工智能"，举 2 个例子',
        tip: '记录每个 AI 的回答特点：准确度、易懂度、详细度',
        xp: 80,
        platforms: ['doubao', 'qwen', 'kimi', 'ernie', 'yuanbao'],
        screenshot: true
      },
      {
        title: '🎯 场景匹配练习',
        prompt: '以下场景选哪个 AI 最合适：①学编程 ②查资料 ③画画 ④写作文 ⑤聊天解闷',
        tip: '说明你的选择理由',
        xp: 80,
        platforms: ['qwen']
      },
      {
        title: '📋 制作 AI 选择指南',
        prompt: '根据你的体验，制作一份"AI 平台选择指南"，告诉别人什么情况下选哪个 AI',
        tip: '可以用表格或思维导图形式',
        xp: 90,
        platforms: ['qwen', 'kimi'],
        screenshot: true
      }
    ],
    tips: '没有最好的 AI，只有最合适的 AI。根据任务选平台，效率翻倍！',
    badge: 'platform_master',
    logRequired: true,
    logPrompts: ['你发现各平台的优势是什么？', '你最常用的是哪个平台？']
  },
  // ========== 第二阶段：白银段位（核心技能）==========
  {
    day: 4,
    level: 4,
    stage: 'silver',
    title: 'AI 写作高手',
    platform: 'Kimi/通义千问',
    platformId: 'kimi',
    difficulty: 3,
    completed: false,
    xp: 300,
    platforms: ['kimi', 'qwen'],
    description: '用 AI 辅助写作，从构思到成文，让你的文章更有文采、更有逻辑。',
    cases: [
      {
        title: '📝 文章大纲生成',
        prompt: '我要写一篇"我的 AI 学习之旅"作文，请帮我列一个详细大纲，包括开头、3-4 个段落、结尾',
        tip: '大纲是文章的骨架，好的大纲让写作更顺利',
        xp: 80,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '✍️ 段落扩写',
        prompt: '根据大纲的第一段，帮我扩写成 200 字的完整段落，要生动有趣',
        tip: '对比 AI 写的和你自己写的，学习写作技巧',
        xp: 100,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '🎨 文章润色',
        prompt: '请帮我修改这段文字，让它更生动、更有文采，但不要改变原意',
        tip: '学习 AI 是如何优化表达的',
        xp: 120,
        platforms: ['kimi', 'qwen'],
        screenshot: true
      }
    ],
    tips: 'AI 是写作助手，不是代写工具。用它学习写作技巧，而不是完全依赖它。',
    badge: 'writer',
    logRequired: true,
    logPrompts: ['AI 帮你改进了哪些表达？', '你学到了什么写作技巧？']
  },
  {
    day: 5,
    level: 5,
    stage: 'silver',
    title: 'AI 绘画大师',
    platform: '即梦 AI/豆包',
    platformId: 'doubao',
    difficulty: 3,
    completed: false,
    xp: 350,
    platforms: ['doubao'],
    description: '深入学习 AI 绘画，掌握提示词工程、风格控制、系列创作等高级技巧。',
    cases: [
      {
        title: '🎨 提示词进阶学习',
        prompt: '请告诉我 AI 绘画的高级提示词技巧，包括：构图、光影、风格、色彩等关键词',
        tip: '学习专业术语，让画面更精美',
        xp: 100,
        platforms: ['doubao']
      },
      {
        title: '🖼️ 四季系列创作',
        prompt: '设计春、夏、秋、冬四个森林场景，每个场景都要有独特的色彩和氛围',
        tip: '保持风格一致，形成系列作品',
        xp: 120,
        platforms: ['doubao'],
        screenshot: true
      },
      {
        title: '📸 前后对比分析',
        prompt: '对比你第一次和现在的 AI 绘画作品，总结 3 个最大的进步',
        tip: '反思是进步的关键',
        xp: 130,
        platforms: ['doubao'],
        screenshot: true
      }
    ],
    tips: 'AI 绘画需要耐心和想象力，多尝试不同的描述，会有惊喜！',
    badge: 'artist',
    logRequired: true,
    logPrompts: ['你的提示词有什么改进？', '最满意的作品是哪张？']
  },
  {
    day: 6,
    level: 6,
    stage: 'silver',
    title: '学习加速器',
    platform: 'DeepSeek/通义千问',
    platformId: 'deepseek',
    difficulty: 3,
    completed: false,
    xp: 350,
    platforms: ['deepseek', 'qwen'],
    description: '用 AI 辅助学科学习，整理错题、解析难题、制作复习资料。',
    cases: [
      {
        title: '📚 错题整理',
        prompt: '我有以下错题：[输入你的错题]，请帮我整理成错题本格式，包括：题目、错误答案、正确答案、解析',
        tip: '把平时的错题收集起来，让 AI 帮你整理',
        xp: 100,
        platforms: ['deepseek'],
        screenshot: true
      },
      {
        title: '🧮 难题解析',
        prompt: '这道题我不会做：[输入题目]，请一步一步详细讲解，让我能理解',
        tip: '不要只看答案，要理解解题思路',
        xp: 120,
        platforms: ['deepseek']
      },
      {
        title: '📖 知识点总结',
        prompt: '请帮我总结 [某学科章节] 的核心知识点，用思维导图或表格形式呈现',
        tip: '复习时用 AI 整理的资料，效率更高',
        xp: 130,
        platforms: ['deepseek', 'qwen'],
        screenshot: true
      }
    ],
    tips: 'AI 是最好的学习伙伴，但它不能代替你思考。理解过程最重要！',
    badge: 'scholar',
    logRequired: true,
    logPrompts: ['AI 如何帮助你学习？', '你最喜欢用 AI 做什么学科？']
  },
  {
    day: 7,
    level: 7,
    stage: 'silver',
    title: '研究小达人',
    platform: '文心一言/腾讯元宝',
    platformId: 'ernie',
    difficulty: 3,
    completed: false,
    xp: 350,
    platforms: ['ernie', 'yuanbao'],
    description: '学习用 AI 进行资料搜集、整理和分析，完成一份小型研究报告。',
    cases: [
      {
        title: '🔍 资料搜集',
        prompt: '我要研究 [某个主题，如"AI 在日常生活中的应用"]，请帮我列出需要查找的资料方向',
        tip: '好的研究从好的问题开始',
        xp: 100,
        platforms: ['ernie', 'yuanbao']
      },
      {
        title: '📊 资料整理',
        prompt: '请帮我把搜集到的这些资料整理成表格，包括：来源、主要内容、可信度',
        tip: '整理资料是研究的关键步骤',
        xp: 120,
        platforms: ['ernie'],
        screenshot: true
      },
      {
        title: '📝 研究报告',
        prompt: '根据整理的资料，帮我写一份 500 字左右的研究小结，包括：发现、结论、感想',
        tip: '用自己的话总结，AI 只是辅助',
        xp: 130,
        platforms: ['ernie', 'yuanbao'],
        screenshot: true
      }
    ],
    tips: '研究能力是未来的核心竞争力，AI 让你的研究更高效！',
    badge: 'researcher',
    logRequired: true,
    logPrompts: ['你研究的主题是什么？', '最大的发现是什么？']
  },
  {
    day: 8,
    level: 8,
    stage: 'silver',
    title: '编程好伙伴',
    platform: 'DeepSeek',
    platformId: 'deepseek',
    difficulty: 4,
    completed: false,
    xp: 400,
    platforms: ['deepseek'],
    description: '用 AI 学习编程基础，从理解代码到编写小程序，体验编程的乐趣。',
    cases: [
      {
        title: '💻 代码理解',
        prompt: '请解释这段代码的作用：[输入一段简单代码]，每一行都要解释清楚',
        tip: '理解是编程的第一步',
        xp: 120,
        platforms: ['deepseek']
      },
      {
        title: '🔧 代码修改',
        prompt: '这段代码有错误：[输入有 bug 的代码]，请帮我找出错误并解释原因',
        tip: 'debug 是编程的重要技能',
        xp: 130,
        platforms: ['deepseek'],
        screenshot: true
      },
      {
        title: '🎮 小程序创作',
        prompt: '我想做一个 [猜数字/石头剪刀布] 小游戏，请教我一步一步写出来',
        tip: '完成后试着修改游戏参数，看看效果',
        xp: 150,
        platforms: ['deepseek'],
        screenshot: true
      }
    ],
    tips: '编程是创造的技能，AI 是你的编程老师，有问题随时问！',
    badge: 'coder',
    logRequired: true,
    logPrompts: ['你学会了什么编程概念？', '你的小程序有什么功能？']
  },
  {
    day: 9,
    level: 9,
    stage: 'silver',
    title: '英语好帮手',
    platform: 'Kimi/通义千问',
    platformId: 'kimi',
    difficulty: 3,
    completed: false,
    xp: 350,
    platforms: ['kimi', 'qwen'],
    description: '用 AI 练习英语对话、修改作文、学习语法，让英语学习更有趣。',
    cases: [
      {
        title: '💬 英语对话练习',
        prompt: "Let's have a conversation in English. I want to talk about [topic]. Please correct my mistakes.",
        tip: '不要怕犯错，AI 会帮你纠正',
        xp: 100,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '✍️ 英语作文批改',
        prompt: 'Please check my English essay and correct the grammar mistakes. Also give me suggestions for improvement.',
        tip: '对比原文和修改版，学习地道表达',
        xp: 120,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '📚 语法学习',
        prompt: '我不理解 [某个语法点，如现在完成时]，请用简单的例子帮我理解',
        tip: '让 AI 用你懂的方式解释',
        xp: 130,
        platforms: ['kimi', 'qwen']
      }
    ],
    tips: 'AI 是最好的英语陪练，随时对话、随时纠正，大胆开口！',
    badge: 'english_master',
    logRequired: true,
    logPrompts: ['你的英语有什么进步？', 'AI 帮你纠正了什么错误？']
  },
  {
    day: 10,
    level: 10,
    stage: 'silver',
    title: '创意设计师',
    platform: '豆包/即梦 AI',
    platformId: 'doubao',
    difficulty: 3,
    completed: false,
    xp: 350,
    platforms: ['doubao'],
    description: '用 AI 设计海报、Logo、卡片等，发挥创意，制作有视觉冲击力的作品。',
    cases: [
      {
        title: '🎨 海报设计',
        prompt: '我要设计一个 [活动名称] 的海报，请帮我设计画面元素和文案',
        tip: '考虑受众、主题、色彩搭配',
        xp: 100,
        platforms: ['doubao'],
        screenshot: true
      },
      {
        title: '🏷️ Logo 设计',
        prompt: '帮我设计一个 [主题] 的 Logo，要简洁、有辨识度',
        tip: 'Logo 要简单但有特色',
        xp: 120,
        platforms: ['doubao'],
        screenshot: true
      },
      {
        title: '💌 贺卡设计',
        prompt: '我要做一张 [节日/场合] 贺卡，请帮我设计正面图案和祝福语',
        tip: '送给家人朋友，分享你的创意',
        xp: 130,
        platforms: ['doubao'],
        screenshot: true
      }
    ],
    tips: '设计是表达创意的方式，AI 让你的想法变成视觉作品！',
    badge: 'designer',
    logRequired: true,
    logPrompts: ['你最满意的设计是哪个？', '设计过程中有什么收获？']
  },
  // ========== 第三阶段：黄金段位（项目实战）==========
  {
    day: 11,
    level: 11,
    stage: 'gold',
    title: '制作个人 AI 助手',
    platform: 'Coze/扣子',
    platformId: 'coze',
    difficulty: 4,
    completed: false,
    xp: 450,
    platforms: ['coze'],
    description: '无需编程，用 Coze 平台创建专属你的 AI 助手，让它帮你解决特定问题。',
    cases: [
      {
        title: '🤖 了解 Coze 平台',
        prompt: '请介绍 Coze 平台的功能，它能帮我做什么？有什么特点？',
        tip: '了解工具是使用的开始',
        xp: 120,
        platforms: ['coze']
      },
      {
        title: '⚙️ 创建 Bot',
        prompt: '帮我设计一个"学习小助手"Bot，包括：人设、功能、回复风格、知识库',
        tip: '想清楚你的 Bot 要帮你做什么',
        xp: 150,
        platforms: ['coze'],
        screenshot: true
      },
      {
        title: '🧪 测试与优化',
        prompt: '测试你的 Bot，记录 5 个需要改进的地方并优化',
        tip: '好的 Bot 是迭代出来的',
        xp: 180,
        platforms: ['coze'],
        screenshot: true
      }
    ],
    tips: '从 AI 使用者到创造者，这是质的飞跃！你的 Bot 可以帮到更多人。',
    badge: 'bot_creator',
    logRequired: true,
    logPrompts: ['你的 Bot 有什么功能？', '创建过程中遇到什么挑战？']
  },
  {
    day: 12,
    level: 12,
    stage: 'gold',
    title: '创作 AI 绘本故事',
    platform: '豆包 + 即梦 AI',
    platformId: 'doubao',
    difficulty: 4,
    completed: false,
    xp: 450,
    platforms: ['doubao'],
    description: '结合 AI 写作和 AI 绘画，创作一本完整的绘本故事，成为真正的创作者。',
    cases: [
      {
        title: '📖 故事创作',
        prompt: '帮我写一个适合中学生阅读的短篇故事，800-1000 字，有教育意义',
        tip: '故事要有起承转合，角色要鲜明',
        xp: 120,
        platforms: ['doubao'],
        screenshot: true
      },
      {
        title: '🎨 插画绘制',
        prompt: '根据故事的每个场景，设计 4-6 张插画，保持风格一致',
        tip: '每张图都要配合故事情节',
        xp: 150,
        platforms: ['doubao'],
        screenshot: true
      },
      {
        title: '📚 绘本制作',
        prompt: '把故事和插画组合成绘本格式，设计封面和排版',
        tip: '可以打印出来或做成电子书',
        xp: 180,
        platforms: ['doubao'],
        screenshot: true
      }
    ],
    tips: '绘本是综合能力的体现，你既是作家也是画家！',
    badge: 'storyteller',
    logRequired: true,
    logPrompts: ['你的故事讲的是什么？', '创作过程有什么收获？']
  },
  {
    day: 13,
    level: 13,
    stage: 'gold',
    title: 'AI 辅助学科学习',
    platform: '多平台',
    platformId: 'all',
    difficulty: 4,
    completed: false,
    xp: 450,
    platforms: ['deepseek', 'qwen', 'kimi'],
    description: '综合运用 AI 辅助多学科学习，制作个性化的学科知识手册。',
    cases: [
      {
        title: '📚 学科选择',
        prompt: '我想深入学习 [某学科]，请帮我制定一个学习计划，包括重点知识点和学习方法',
        tip: '选择你感兴趣或需要提高的学科',
        xp: 120,
        platforms: ['qwen']
      },
      {
        title: '📖 知识整理',
        prompt: '请帮我整理 [某章节] 的知识框架，用思维导图或表格形式',
        tip: '系统化整理，形成知识网络',
        xp: 150,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '📝 知识手册',
        prompt: '根据整理的内容，制作一份学科知识手册，包括：核心概念、公式/定理、典型例题',
        tip: '这是你的专属复习资料',
        xp: 180,
        platforms: ['deepseek', 'qwen'],
        screenshot: true
      }
    ],
    tips: 'AI 让学科学习更高效，但理解记忆还是要靠自己！',
    badge: 'subject_master',
    logRequired: true,
    logPrompts: ['你学习的是什么学科？', '最大的收获是什么？']
  },
  {
    day: 14,
    level: 14,
    stage: 'gold',
    title: '设计 AI 主题班会',
    platform: '多平台组合',
    platformId: 'all',
    difficulty: 4,
    completed: false,
    xp: 450,
    platforms: ['qwen', 'deepseek', 'doubao'],
    description: '为班级设计一次 AI 主题班会，综合运用 AI 技能，分享给同学。',
    cases: [
      {
        title: '📋 班会策划',
        prompt: '帮我设计一个"AI 与生活"主题班会方案，包括：流程、互动环节、游戏',
        tip: '考虑同学们的参与度和兴趣',
        xp: 120,
        platforms: ['qwen'],
        screenshot: true
      },
      {
        title: '🎮 互动内容',
        prompt: '设计 3 个 AI 体验小游戏，让同学们亲身体验 AI 的神奇',
        tip: '游戏要简单有趣，又能展示 AI 能力',
        xp: 150,
        platforms: ['deepseek'],
        screenshot: true
      },
      {
        title: '📊 班会材料',
        prompt: '帮我制作班会 PPT 大纲和讲稿，包括：AI 知识、案例、互动问题',
        tip: '可以找老师帮忙，真的在班上办一次',
        xp: 180,
        platforms: ['qwen', 'doubao'],
        screenshot: true
      }
    ],
    tips: '分享是最好的学习，教别人的同时自己也收获更多！',
    badge: 'presenter',
    logRequired: true,
    logPrompts: ['你的班会主题是什么？', '同学们有什么反馈？']
  },
  {
    day: 15,
    level: 15,
    stage: 'gold',
    title: '制作学习视频脚本',
    platform: '多平台',
    platformId: 'all',
    difficulty: 4,
    completed: false,
    xp: 450,
    platforms: ['kimi', 'doubao'],
    description: '学习用 AI 创作视频脚本和分镜，为新媒体时代的内容创作做准备。',
    cases: [
      {
        title: '📝 视频选题',
        prompt: '我想做一个关于 [主题] 的 3 分钟科普视频，请帮我确定选题和角度',
        tip: '选题要有趣、有价值、适合短视频',
        xp: 120,
        platforms: ['kimi']
      },
      {
        title: '📜 脚本创作',
        prompt: '帮我写一个 3 分钟视频的完整脚本，包括：开场、正文、结尾、台词',
        tip: '脚本要口语化，适合朗读',
        xp: 150,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '🎬 分镜设计',
        prompt: '根据脚本，设计 6-8 个分镜画面，描述每个画面的内容和镜头',
        tip: '分镜是视频的蓝图',
        xp: 180,
        platforms: ['doubao'],
        screenshot: true
      }
    ],
    tips: '视频是未来的主流内容形式，AI 让你轻松创作！',
    badge: 'video_creator',
    logRequired: true,
    logPrompts: ['你的视频主题是什么？', '创作脚本有什么技巧？']
  },
  {
    day: 16,
    level: 16,
    stage: 'gold',
    title: '创建个人知识库',
    platform: 'Kimi+ 通义千问',
    platformId: 'kimi',
    difficulty: 4,
    completed: false,
    xp: 450,
    platforms: ['kimi', 'qwen'],
    description: '用 AI 整理你的学习笔记、错题、心得，创建个人知识库。',
    cases: [
      {
        title: '📚 知识收集',
        prompt: '帮我设计一个个人知识库的结构，包括分类、标签、检索方式',
        tip: '好的结构让知识更易查找',
        xp: 120,
        platforms: ['kimi']
      },
      {
        title: '📝 知识卡片',
        prompt: '把 [某个知识点] 整理成知识卡片格式：定义、要点、例子、易错点',
        tip: '卡片式学习，碎片时间也能复习',
        xp: 150,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '🔗 知识关联',
        prompt: '帮我找出这些知识点之间的联系，形成知识网络',
        tip: '知识互联，理解更深刻',
        xp: 180,
        platforms: ['qwen'],
        screenshot: true
      }
    ],
    tips: '知识库是你的第二大脑，积累越多，价值越大！',
    badge: 'knowledge_builder',
    logRequired: true,
    logPrompts: ['你整理了什么知识？', '知识库对你有什么帮助？']
  },
  {
    day: 17,
    level: 17,
    stage: 'gold',
    title: 'AI 解决实际问题',
    platform: '自选',
    platformId: 'all',
    difficulty: 5,
    completed: false,
    xp: 500,
    platforms: ['all'],
    description: '用 AI 解决一个你生活或学习中的实际问题，体验 AI 的真正价值。',
    cases: [
      {
        title: '🎯 问题定义',
        prompt: '我遇到的问题是：[描述问题]，请帮我分析问题并提供解决思路',
        tip: '问题要具体，不要太宽泛',
        xp: 150,
        platforms: ['qwen'],
        screenshot: true
      },
      {
        title: '🔧 方案实施',
        prompt: '根据这个方案，我具体应该怎么做？请给出详细步骤',
        tip: '边做边调整，灵活应对',
        xp: 170,
        platforms: ['qwen', 'deepseek'],
        screenshot: true
      },
      {
        title: '📊 效果评估',
        prompt: '帮我设计一个评估方案，看看问题有没有解决，效果如何',
        tip: '用数据和事实说话',
        xp: 180,
        platforms: ['kimi'],
        screenshot: true
      }
    ],
    tips: 'AI 的价值在于解决问题，你的问题越具体，AI 越能帮到你！',
    badge: 'problem_solver',
    logRequired: true,
    logPrompts: ['你解决了什么问题？', 'AI 起到了什么作用？']
  },
  // ========== 第四阶段：钻石段位（毕业展示）==========
  {
    day: 18,
    level: 18,
    stage: 'diamond',
    title: '毕业项目规划',
    platform: '通义千问',
    platformId: 'qwen',
    difficulty: 4,
    completed: false,
    xp: 400,
    platforms: ['qwen'],
    description: '规划你的 AI 毕业项目，综合运用 21 天学到的所有技能。',
    cases: [
      {
        title: '🎯 项目选题',
        prompt: '我想做一个 AI 毕业项目，请帮我 brainstorm 5 个选题，要能综合运用多种 AI 技能',
        tip: '选题要有趣、可行、有挑战性',
        xp: 120,
        platforms: ['qwen']
      },
      {
        title: '📋 项目方案',
        prompt: '帮我完善这个项目方案，包括：目标、步骤、时间安排、所需工具、预期成果',
        tip: '好的计划是成功的一半',
        xp: 140,
        platforms: ['qwen'],
        screenshot: true
      },
      {
        title: '📊 评估标准',
        prompt: '帮我设计项目评估标准，怎样算成功完成？',
        tip: '可衡量的目标更容易达成',
        xp: 140,
        platforms: ['qwen']
      }
    ],
    tips: '毕业项目是你 AI 学习的集大成者，用心设计！',
    badge: null,
    logRequired: true,
    logPrompts: ['你的项目主题是什么？', '为什么选择这个主题？']
  },
  {
    day: 19,
    level: 19,
    stage: 'diamond',
    title: '毕业项目实施 (上)',
    platform: '多平台',
    platformId: 'all',
    difficulty: 5,
    completed: false,
    xp: 500,
    platforms: ['all'],
    description: '开始实施你的毕业项目，记录过程和进展。',
    cases: [
      {
        title: '🚀 项目启动',
        prompt: '项目开始！记录第一阶段的进展和遇到的问题',
        tip: '每天记录进度，及时调整',
        xp: 150,
        platforms: ['all'],
        screenshot: true
      },
      {
        title: '🔧 问题解决',
        prompt: '遇到问题：[描述问题]，请帮我分析并提供解决方案',
        tip: '问题是成长的机会',
        xp: 170,
        platforms: ['qwen', 'deepseek']
      },
      {
        title: '📝 过程记录',
        prompt: '帮我整理项目过程记录，形成阶段性报告',
        tip: '过程比结果更重要',
        xp: 180,
        platforms: ['kimi'],
        screenshot: true
      }
    ],
    tips: '坚持就是胜利，遇到困难不要放弃！',
    badge: null,
    logRequired: true,
    logPrompts: ['今天完成了什么？', '遇到什么挑战？']
  },
  {
    day: 20,
    level: 20,
    stage: 'diamond',
    title: '毕业项目实施 (下)',
    platform: '多平台',
    platformId: 'all',
    difficulty: 5,
    completed: false,
    xp: 500,
    platforms: ['all'],
    description: '完成毕业项目的主体工作，准备成果展示。',
    cases: [
      {
        title: '✅ 项目收尾',
        prompt: '帮我检查项目是否完整，还有什么需要完善的',
        tip: '细节决定成败',
        xp: 150,
        platforms: ['qwen'],
        screenshot: true
      },
      {
        title: '📊 成果整理',
        prompt: '帮我整理项目成果，形成展示材料',
        tip: '成果要清晰、有说服力',
        xp: 170,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '🎬 展示准备',
        prompt: '帮我设计成果展示的结构和演讲要点',
        tip: '好的展示让人印象深刻',
        xp: 180,
        platforms: ['qwen'],
        screenshot: true
      }
    ],
    tips: '最后冲刺，让你的作品完美呈现！',
    badge: null,
    logRequired: true,
    logPrompts: ['项目完成了多少？', '最满意的部分是什么？']
  },
  {
    day: 21,
    level: 21,
    stage: 'diamond',
    title: '毕业成果展示',
    platform: '多平台',
    platformId: 'all',
    difficulty: 5,
    completed: false,
    xp: 600,
    platforms: ['all'],
    description: '展示你的毕业项目成果，分享学习收获，成为真正的 AI 达人！',
    cases: [
      {
        title: '🎤 成果展示',
        prompt: '帮我完善展示演讲，包括：开场、项目介绍、过程分享、收获感悟',
        tip: '自信展示，你做到了！',
        xp: 180,
        platforms: ['qwen'],
        screenshot: true
      },
      {
        title: '📚 学习总结',
        prompt: '帮我总结 21 天的学习收获，包括：学到的技能、最大的成长、未来计划',
        tip: '反思让学习更深刻',
        xp: 200,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '🏆 毕业典礼',
        prompt: '恭喜完成 21 天 AI 探险！给自己写一封毕业信，记录这段旅程',
        tip: '这是你成长的见证',
        xp: 220,
        platforms: ['qwen'],
        screenshot: true
      }
    ],
    tips: '21 天的结束是新的开始，继续用 AI 探索世界！',
    badge: 'ai_master',
    logRequired: true,
    logPrompts: ['21 天最大的收获是什么？', '未来想继续学习什么？']
  }
];

// ==================== 21 天徽章系统（18 个）====================
const BADGES = [
  // 青铜段位徽章
  { id: 'explorer', name: 'AI 探险家', icon: '🌟', description: '完成关卡 1，开始 AI 之旅', requirement: '完成 AI 初体验', unlocked: false, rarity: 'common', stage: 'bronze' },
  { id: 'prompt_master', name: '提示词大师', icon: '🧙', description: '完成关卡 2，掌握提示词技巧', requirement: '完成提示词工程师入门', unlocked: false, rarity: 'uncommon', stage: 'bronze' },
  { id: 'platform_master', name: '平台选择大师', icon: '🎯', description: '完成关卡 3，学会选择 AI 平台', requirement: '完成平台选择大师', unlocked: false, rarity: 'uncommon', stage: 'bronze' },
  // 白银段位徽章
  { id: 'writer', name: 'AI 作家', icon: '✍️', description: '完成关卡 4，精通 AI 辅助写作', requirement: '完成 AI 写作高手', unlocked: false, rarity: 'rare', stage: 'silver' },
  { id: 'artist', name: 'AI 艺术家', icon: '🎨', description: '完成关卡 5，掌握 AI 绘画', requirement: '完成 AI 绘画大师', unlocked: false, rarity: 'rare', stage: 'silver' },
  { id: 'scholar', name: '学习达人', icon: '📚', description: '完成关卡 6，用 AI 加速学习', requirement: '完成学习加速器', unlocked: false, rarity: 'rare', stage: 'silver' },
  { id: 'researcher', name: '研究小达人', icon: '🔬', description: '完成关卡 7，学会 AI 研究', requirement: '完成研究小达人', unlocked: false, rarity: 'rare', stage: 'silver' },
  { id: 'coder', name: '编程小能手', icon: '💻', description: '完成关卡 8，入门 AI 编程', requirement: '完成编程好伙伴', unlocked: false, rarity: 'rare', stage: 'silver' },
  { id: 'english_master', name: '英语达人', icon: '🔤', description: '完成关卡 9，AI 辅助英语', requirement: '完成英语好帮手', unlocked: false, rarity: 'rare', stage: 'silver' },
  { id: 'designer', name: '创意设计师', icon: '🎭', description: '完成关卡 10，AI 创意设计', requirement: '完成创意设计师', unlocked: false, rarity: 'rare', stage: 'silver' },
  // 黄金段位徽章
  { id: 'bot_creator', name: 'AI 创造者', icon: '🛠️', description: '完成关卡 11，创建 AI Bot', requirement: '完成个人 AI 助手', unlocked: false, rarity: 'epic', stage: 'gold' },
  { id: 'storyteller', name: '故事大王', icon: '📖', description: '完成关卡 12，创作 AI 绘本', requirement: '完成 AI 绘本故事', unlocked: false, rarity: 'epic', stage: 'gold' },
  { id: 'subject_master', name: '学科大师', icon: '📐', description: '完成关卡 13，AI 辅助学科', requirement: '完成学科学习', unlocked: false, rarity: 'epic', stage: 'gold' },
  { id: 'presenter', name: '演讲达人', icon: '🎤', description: '完成关卡 14，设计班会', requirement: '完成 AI 主题班会', unlocked: false, rarity: 'epic', stage: 'gold' },
  { id: 'video_creator', name: '视频创作者', icon: '🎬', description: '完成关卡 15，AI 视频脚本', requirement: '完成视频脚本', unlocked: false, rarity: 'epic', stage: 'gold' },
  { id: 'knowledge_builder', name: '知识建筑师', icon: '🏗️', description: '完成关卡 16，创建知识库', requirement: '完成知识库', unlocked: false, rarity: 'epic', stage: 'gold' },
  { id: 'problem_solver', name: '问题解决者', icon: '✅', description: '完成关卡 17，用 AI 解决问题', requirement: '完成实际问题', unlocked: false, rarity: 'epic', stage: 'gold' },
  // 钻石段位徽章
  { id: 'ai_master', name: 'AI 大师', icon: '👑', description: '完成 21 天全部学习，成为真正的 AI 达人', requirement: '完成全部 21 关', unlocked: false, rarity: 'legendary', stage: 'diamond' }
];

// ==================== 21 天等级系统（12 个等级）====================
const LEVELS = [
  { level: 1, title: 'AI 新手', xp: 0, icon: '🌱', stage: 'bronze' },
  { level: 2, title: 'AI 学徒', xp: 200, icon: '🌿', stage: 'bronze' },
  { level: 3, title: 'AI 探索者', xp: 500, icon: '🧭', stage: 'bronze' },
  { level: 4, title: 'AI 冒险家', xp: 900, icon: '⚔️', stage: 'silver' },
  { level: 5, title: 'AI 达人', xp: 1400, icon: '🌟', stage: 'silver' },
  { level: 6, title: 'AI 专家', xp: 2000, icon: '💫', stage: 'silver' },
  { level: 7, title: 'AI 高手', xp: 2700, icon: '🎯', stage: 'silver' },
  { level: 8, title: 'AI 大师', xp: 3500, icon: '🏆', stage: 'gold' },
  { level: 9, title: 'AI 宗师', xp: 4400, icon: '👑', stage: 'gold' },
  { level: 10, title: 'AI 传奇', xp: 5400, icon: '🌟', stage: 'gold' },
  { level: 11, title: 'AI 先知', xp: 6500, icon: '🔮', stage: 'gold' },
  { level: 12, title: 'AI 创造者', xp: 7700, icon: '🛠️', stage: 'diamond' }
];

// ==================== 奖励系统（5 个奖励）====================
const REWARDS = [
  { id: 'bronze_certificate', name: '青铜段位证书', icon: '📜', description: '完成第一阶段（关卡 1-3）', requirement: '完成青铜段位全部关卡', unlocked: false, xp: 200 },
  { id: 'silver_certificate', name: '白银段位证书', icon: '📜', description: '完成第二阶段（关卡 4-10）', requirement: '完成白银段位全部关卡', unlocked: false, xp: 500 },
  { id: 'gold_certificate', name: '黄金段位证书', icon: '📜', description: '完成第三阶段（关卡 11-17）', requirement: '完成黄金段位全部关卡', unlocked: false, xp: 800 },
  { id: 'diamond_certificate', name: '钻石段位证书', icon: '📜', description: '完成第四阶段（关卡 18-21）', requirement: '完成钻石段位全部关卡', unlocked: false, xp: 1000 },
  { id: 'master_certificate', name: 'AI 大师毕业证书', icon: '🎓', description: '完成全部 21 关', requirement: '完成全部 21 天学习', unlocked: false, xp: 2000 }
];

// ==================== 阶段定义 ====================
const STAGES = [
  { id: 'bronze', name: '青铜段位', description: '基础入门', levels: [1, 2, 3], color: '#CD7F32' },
  { id: 'silver', name: '白银段位', description: '核心技能', levels: [4, 5, 6, 7, 8, 9, 10], color: '#C0C0C0' },
  { id: 'gold', name: '黄金段位', description: '项目实战', levels: [11, 12, 13, 14, 15, 16, 17], color: '#FFD700' },
  { id: 'diamond', name: '钻石段位', description: '毕业展示', levels: [18, 19, 20, 21], color: '#B9F2FF' }
];

// ==================== 全局变量（直接使用 21 天数据）====================
let LEARNING_TASKS = TASKS_21DAYS;

// 导出供全局使用
if (typeof window !== 'undefined') {
  window.TASKS_21DAYS = TASKS_21DAYS;
  window.BADGES = BADGES;
  window.LEVELS = LEVELS;
  window.REWARDS = REWARDS;
  window.STAGES = STAGES;
  window.AI_PLATFORMS = AI_PLATFORMS;
}

