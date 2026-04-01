// AI 探险家 - 数据配置（增强版）

// AI 平台信息（15 个平台）
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
    icon: '🔍',
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
    icon: '🌙',
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
    icon: '🎨',
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
    icon: '🎓',
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
    icon: '💎',
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
    icon: '🤖',
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

// 7 天学习任务（增强版 - 带平台链接）
const LEARNING_TASKS = [
  {
    day: 1,
    title: '认识 AI 助手',
    platform: '全部体验',
    platformId: 'all',
    difficulty: 1,
    completed: false,
    xp: 100,
    platforms: ['doubao', 'qwen', 'kimi'], // 推荐使用的平台
    description: '今天是 AI 探险的第一天！我们要认识一下什么是 AI，它能做什么，不能做什么。通过向不同的 AI 提问，你会发现每个 AI 都有自己的特点。',
    cases: [
      {
        title: '🤔 什么是 AI？',
        prompt: '请用小学生能听懂的话解释什么是人工智能，举 3 个生活中的例子',
        tip: '试试问 2-3 个不同的 AI，比较它们的解释哪个更容易理解',
        xp: 30,
        platforms: ['doubao', 'qwen'] // 该小任务推荐的平台
      },
      {
        title: '💡 AI 能帮我做什么？',
        prompt: '我是一名 12 岁的小学生，AI 可以在哪些方面帮助我的学习？请列出 5 个具体的用途',
        tip: '把 AI 的回答记下来，后面几天我们会一一体验',
        xp: 30,
        platforms: ['qwen', 'kimi']
      },
      {
        title: '⚠️ AI 不能做什么？',
        prompt: 'AI 有哪些事情是做不到的？小学生使用 AI 需要注意什么？',
        tip: '这个问题很重要，了解 AI 的局限性，安全使用 AI',
        xp: 40,
        platforms: ['doubao', 'kimi']
      }
    ],
    tips: '今天的目标是建立对 AI 的基本认识。不要着急，多和几个 AI 聊聊天，感受一下它们的不同。记得把你的发现记录下来！',
    badge: 'explorer'
  },
  {
    day: 2,
    title: '豆包 - 创意伙伴',
    platform: '豆包',
    platformId: 'doubao',
    difficulty: 1,
    completed: false,
    xp: 150,
    platforms: ['doubao'],
    description: '豆包是个很有趣的 AI 朋友！它的语音功能特别棒，还能画画。今天我们来体验一下豆包的创意能力。',
    cases: [
      {
        title: '🎤 语音聊天',
        prompt: '（使用语音功能）跟豆包聊聊你今天在学校发生的有趣事情，听听它怎么回应',
        tip: '注意豆包的语音是否自然，它能不能理解你的话',
        xp: 50,
        platforms: ['doubao']
      },
      {
        title: '🎨 生成图片',
        prompt: '请画一只会飞的熊猫在竹林里吃竹子，背景是彩虹和白云',
        tip: '看看豆包能不能理解你的描述，生成的图片是否符合你的想象',
        xp: 50,
        platforms: ['doubao'],
        screenshot: true // 需要截图
      },
      {
        title: '📖 编故事',
        prompt: '帮我编一个关于勇敢小学生的冒险故事，500 字左右，要有魔法元素',
        tip: '读完故事后，可以让豆包继续写第二集',
        xp: 50,
        platforms: ['doubao'],
        screenshot: true
      }
    ],
    tips: '豆包最适合创意类任务。试试用语音和它交流，会有不一样的体验！生成的图片可以保存下来放到你的作品墙。',
    badge: 'creator'
  },
  {
    day: 3,
    title: 'DeepSeek - 编程小助手',
    platform: 'DeepSeek',
    platformId: 'deepseek',
    difficulty: 2,
    completed: false,
    xp: 200,
    platforms: ['deepseek'],
    description: 'DeepSeek 是编程和数学的高手！今天我们来体验一下它如何帮助我们学习编程和解决数学问题。',
    cases: [
      {
        title: '💻 学编程',
        prompt: '教我写一个 Python 程序，打印九九乘法表。请一步一步解释，让我能看懂',
        tip: '如果有电脑，可以试着运行一下代码；如果没有，让 DeepSeek 解释代码的作用',
        xp: 70,
        platforms: ['deepseek'],
        screenshot: true
      },
      {
        title: '🔢 解数学题',
        prompt: '小明有 15 个苹果，他想分给 3 个朋友，每人分到几个？如果小明自己也要留 2 个，该怎么分？请分步解释',
        tip: '注意看 DeepSeek 的解释是否清晰，能不能让你理解解题思路',
        xp: 70,
        platforms: ['deepseek']
      },
      {
        title: '✅ 检查作业',
        prompt: '我想检查一道数学题：一个长方形长 8 厘米，宽 5 厘米，周长是多少？我的答案是 26 厘米，对吗？',
        tip: '即使做对了，也让 AI 解释一下计算过程，确保你真正理解',
        xp: 60,
        platforms: ['deepseek']
      }
    ],
    tips: 'DeepSeek 的优势是逻辑清晰、解释详细。学习编程和数学时，不要只看答案，要理解过程。有问题可以追问！',
    badge: 'coder'
  },
  {
    day: 4,
    title: '通义千问/Kimi - 学习秘书',
    platform: '通义千问/Kimi',
    platformId: 'qwen',
    difficulty: 2,
    completed: false,
    xp: 200,
    platforms: ['qwen', 'kimi'],
    description: '通义千问和 Kimi 都擅长处理文字工作。今天我们来学习如何用它们帮助阅读和写作。',
    cases: [
      {
        title: '📄 文章总结',
        prompt: '（找一篇 1000 字左右的科普文章）请阅读这篇文章，用 3 句话总结主要内容，再列出 5 个关键知识点',
        tip: '对比 AI 的总结和你自己的理解，看看有没有遗漏重要内容',
        xp: 70,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '✍️ 作文大纲',
        prompt: '我要写一篇"我的暑假"作文，请帮我列一个大纲，包括开头、3 个段落的主要内容、结尾',
        tip: '大纲只是参考，具体内容要自己写，这样才有真情实感',
        xp: 70,
        platforms: ['qwen'],
        screenshot: true
      },
      {
        title: '📊 知识对比',
        prompt: '请用表格对比猫和狗的 10 个不同点，包括外形、习性、饲养等方面',
        tip: '表格形式让信息更清晰，这种格式很适合整理知识点',
        xp: 60,
        platforms: ['qwen', 'kimi']
      }
    ],
    tips: '这类 AI 适合处理文字任务。记住：AI 可以帮你整理思路，但真正的写作还是要靠自己，这样才有进步。',
    badge: 'scholar'
  },
  {
    day: 5,
    title: '文心一言/元宝 - 信息助手',
    platform: '文心一言/腾讯元宝',
    platformId: 'ernie',
    difficulty: 1,
    completed: false,
    xp: 150,
    platforms: ['ernie', 'yuanbao'],
    description: '文心一言和腾讯元宝可以连接互联网，获取最新信息。今天我们来学习如何用它们查找资料。',
    cases: [
      {
        title: '📰 查新闻',
        prompt: '最近有什么适合小学生看的科技新闻？请介绍 3 条，并简单说明为什么值得关注',
        tip: '注意信息的时效性，AI 提供的信息可能需要核实',
        xp: 50,
        platforms: ['ernie', 'yuanbao']
      },
      {
        title: '🔍 找资源',
        prompt: '推荐 5 个适合 12 岁孩子学习编程的网站或 APP，并说明每个的特点',
        tip: '可以让 AI 解释为什么推荐这些资源，帮助你做选择',
        xp: 50,
        platforms: ['ernie', 'yuanbao']
      },
      {
        title: '🗓️ 生活帮助',
        prompt: '周末北京（或你所在城市）有什么适合亲子活动的地方？请推荐 3 个并说明理由',
        tip: '这类信息建议再查一下官方网站确认开放时间和门票',
        xp: 50,
        platforms: ['ernie', 'yuanbao']
      }
    ],
    tips: '搜索类 AI 很方便，但要注意核实信息。特别是时间、地点、价格等，最好再查一下官方来源。',
    badge: 'researcher'
  },
  {
    day: 6,
    title: '综合挑战 - 项目实战',
    platform: '多平台组合',
    platformId: 'all',
    difficulty: 3,
    completed: false,
    xp: 300,
    platforms: ['doubao', 'qwen', 'deepseek'],
    description: '今天是挑战日！选择一个项目，综合运用这几天学到的技能，使用至少 2 个不同的 AI 平台来完成。',
    cases: [
      {
        title: '📘 制作 AI 使用手册',
        prompt: '（用通义千问）请帮我写一份"小学生 AI 使用指南"，包括：什么是 AI、常用 AI 平台介绍、使用注意事项、使用技巧',
        tip: '然后用豆包给手册画一个封面插图',
        xp: 100,
        platforms: ['qwen', 'doubao'],
        screenshot: true
      },
      {
        title: '🎉 设计班级活动',
        prompt: '（用 DeepSeek）我们要办一个班级 AI 主题班会，请帮我设计一个活动方案，包括流程、游戏、互动环节',
        tip: '可以用文心一言查找一些 AI 相关的趣味知识作为游戏内容',
        xp: 100,
        platforms: ['deepseek', 'ernie'],
        screenshot: true
      },
      {
        title: '📚 创作故事 + 插画',
        prompt: '（用豆包）请写一个关于 AI 小助手的短篇故事，800 字左右，适合小学生阅读',
        tip: '然后用另一个 AI 给故事中的角色画插图，制作成小绘本',
        xp: 100,
        platforms: ['doubao'],
        screenshot: true
      }
    ],
    tips: '综合挑战没有标准答案，发挥你的创意！关键是学会根据不同任务选择合适的 AI 工具。完成后记得把作品保存下来。',
    badge: 'master'
  },
  {
    day: 7,
    title: '成果展示 + 反思',
    platform: '回顾总结',
    platformId: 'review',
    difficulty: 1,
    completed: false,
    xp: 200,
    platforms: ['qwen'],
    description: '恭喜完成 7 天学习！今天我们来回顾一下这周的收获，制定今后的 AI 使用计划。',
    cases: [
      {
        title: '📊 学习回顾',
        prompt: '我完成了 7 天 AI 学习，请帮我设计一个自我评估表，包括：每个平台的掌握程度、最喜欢的平台、最大的收获、还需要改进的地方',
        tip: '诚实评估自己，这有助于制定后续学习计划',
        xp: 70,
        platforms: ['qwen', 'kimi']
      },
      {
        title: '📜 制定使用公约',
        prompt: '请帮我制定一份"我的 AI 使用公约"，包括可以做什么、不可以做什么、使用时间的规定、安全注意事项',
        tip: '可以和爸爸妈妈一起讨论，把公约打印出来贴在书桌前',
        xp: 70,
        platforms: ['qwen'],
        screenshot: true
      },
      {
        title: '🎯 后续计划',
        prompt: '我已经了解了主流 AI 平台，接下来想深入学习。请根据我的年龄（12 岁）推荐 3 个可以继续学习的方向',
        tip: 'AI 学习是长期的，保持好奇心，持续探索！',
        xp: 60,
        platforms: ['qwen', 'deepseek']
      }
    ],
    tips: '完成 7 天学习只是一个开始！保持对 AI 的好奇心，继续探索。记得把你的作品和感悟分享给家人朋友。',
    badge: 'graduate'
  }
];

// 徽章系统（12 个徽章）
const BADGES = [
  {
    id: 'explorer',
    name: 'AI 探险家',
    icon: '🧭',
    description: '完成第 1 天任务，开启 AI 探险之旅',
    requirement: '完成第 1 天学习',
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'creator',
    name: '创意大师',
    icon: '🎨',
    description: '完成第 2 天任务，展现创意天赋',
    requirement: '完成第 2 天学习',
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'coder',
    name: '编程小能手',
    icon: '💻',
    description: '完成第 3 天任务，掌握编程基础',
    requirement: '完成第 3 天学习',
    unlocked: false,
    rarity: 'uncommon'
  },
  {
    id: 'scholar',
    name: '学习达人',
    icon: '📚',
    description: '完成第 4 天任务，精通文字处理',
    requirement: '完成第 4 天学习',
    unlocked: false,
    rarity: 'uncommon'
  },
  {
    id: 'researcher',
    name: '信息侦探',
    icon: '🔍',
    description: '完成第 5 天任务，善于查找信息',
    requirement: '完成第 5 天学习',
    unlocked: false,
    rarity: 'uncommon'
  },
  {
    id: 'master',
    name: 'AI 大师',
    icon: '🏆',
    description: '完成第 6 天任务，综合运用 AI 技能',
    requirement: '完成第 6 天学习',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'graduate',
    name: '荣誉毕业',
    icon: '🎓',
    description: '完成全部 7 天学习，成为 AI 小达人',
    requirement: '完成全部任务',
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'speed',
    name: '闪电侠',
    icon: '⚡',
    description: '3 天内完成全部学习',
    requirement: '3 天内完成所有任务',
    unlocked: false,
    rarity: 'legendary'
  },
  {
    id: 'collector',
    name: '收藏家',
    icon: '📸',
    description: '上传 5 个作品到作品墙',
    requirement: '上传 5 个作品',
    unlocked: false,
    rarity: 'uncommon'
  },
  {
    id: 'explorer_pro',
    name: '平台探索者',
    icon: '🌟',
    description: '体验全部 15 个 AI 平台',
    requirement: '在作品中使用 15 个不同平台',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'perfect',
    name: '完美主义',
    icon: '💯',
    description: '完成所有任务的所有小案例',
    requirement: '完成所有 21 个小案例',
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'pioneer',
    name: '先行者',
    icon: '🚀',
    description: '第一天就开始学习',
    requirement: '在注册当天完成第 1 天任务',
    unlocked: false,
    rarity: 'legendary'
  }
];

// 奖励系统（6 个可解锁）
const REWARDS = [
  {
    id: 'reward1',
    name: '额外屏幕时间 30 分钟',
    icon: '📱',
    description: '获得 30 分钟额外的电子设备使用时间',
    requirement: '获得 3 个徽章',
    badges: 3,
    unlocked: false
  },
  {
    id: 'reward2',
    name: '选择周末活动',
    icon: '🎡',
    description: '可以决定周末全家去哪里玩',
    requirement: '获得 5 个徽章',
    badges: 5,
    unlocked: false
  },
  {
    id: 'reward3',
    name: '小礼物一份',
    icon: '🎁',
    description: '获得一份神秘小礼物',
    requirement: '获得全部 7 个基础徽章',
    badges: 7,
    unlocked: false
  },
  {
    id: 'reward4',
    name: 'AI 小专家证书',
    icon: '📜',
    description: '获得家长颁发的 AI 小专家证书',
    requirement: '完成全部学习并上传 3 个作品',
    badges: 7,
    works: 3,
    unlocked: false
  },
  {
    id: 'reward5',
    name: '朋友展示会',
    icon: '🎉',
    description: '邀请朋友来家里，展示你的 AI 作品',
    requirement: '获得 10 个徽章',
    badges: 10,
    unlocked: false
  },
  {
    id: 'reward6',
    name: '特别奖励',
    icon: '🌟',
    description: '由爸爸妈妈决定的特别奖励',
    requirement: '获得全部 12 个徽章',
    badges: 12,
    unlocked: false
  }
];

// 等级系统（新增）
const LEVELS = [
  { level: 1, title: 'AI 新手', xp: 0, icon: '🌱' },
  { level: 2, title: 'AI 学徒', xp: 300, icon: '🌿' },
  { level: 3, title: 'AI 探索者', xp: 700, icon: '🧭' },
  { level: 4, title: 'AI 冒险家', xp: 1200, icon: '⚔️' },
  { level: 5, title: 'AI 达人', xp: 1800, icon: '🌟' },
  { level: 6, title: 'AI 专家', xp: 2500, icon: '💫' },
  { level: 7, title: 'AI 大师', xp: 3300, icon: '🏆' },
  { level: 8, title: 'AI 传奇', xp: 4200, icon: '👑' }
];

// 应用数据（使用 var 避免重复声明）
var APP_DATA = {
  childName: '小探险家',
  startDate: null,
  completedDays: 0,
  completedTasks: 0,
  totalBadges: 0,
  totalXP: 0,
  currentLevel: 1,
  streak: 0,
  lastActiveDate: null,
  works: [],
  lastActive: null,
  visitedPlatforms: []
};
