// AI 探险家 - 14 天学习任务（难度递进版）

const LEARNING_TASKS = [
  // ========== 第一周：基础入门 ==========
  {
    day: 1,
    title: '认识 AI 助手',
    platform: '全部体验',
    platformId: 'all',
    difficulty: 1,
    completed: false,
    xp: 100,
    platforms: ['doubao', 'qwen', 'kimi'],
    description: '今天是 AI 探险的第一天！我们要认识一下什么是 AI，它能做什么，不能做什么。通过向不同的 AI 提问，你会发现每个 AI 都有自己的特点。',
    cases: [
      {
        title: '🤔 什么是 AI？',
        prompt: '请用小学生能听懂的话解释什么是人工智能，举 3 个生活中的例子',
        tip: '试试问 2-3 个不同的 AI，比较它们的解释哪个更容易理解',
        xp: 30,
        platforms: ['doubao', 'qwen']
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
        screenshot: true
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
    description: '恭喜完成第一周学习！今天我们来回顾一下这周的收获，制定今后的 AI 使用计划。',
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
    tips: '完成第一周学习只是一个开始！保持对 AI 的好奇心，继续探索。记得把你的作品和感悟分享给家人朋友。',
    badge: 'graduate'
  },
  
  // ========== 第二周：进阶提升 ==========
  {
    day: 8,
    title: 'AI 绘画进阶',
    platform: '即梦 AI/豆包',
    platformId: 'doubao_pro',
    difficulty: 2,
    completed: false,
    xp: 250,
    platforms: ['doubao_pro', 'doubao'],
    description: '今天我们来深入学习 AI 绘画！学习如何写出好的提示词，让 AI 生成更精美的图片。',
    cases: [
      {
        title: '🎨 学习提示词技巧',
        prompt: '请告诉我 AI 绘画的提示词技巧，如何描述才能让 AI 生成更好的图片？举例说明',
        tip: '学习关键词、风格、构图等概念',
        xp: 80,
        platforms: ['doubao_pro']
      },
      {
        title: '🖼️ 创作系列画作',
        prompt: '请帮我设计 4 个不同季节的森林场景描述，每个场景都要有详细的画面元素',
        tip: '春夏秋冬，注意色彩和氛围的差异',
        xp: 90,
        platforms: ['doubao_pro'],
        screenshot: true
      },
      {
        title: '📸 对比优化',
        prompt: '对比简单描述和详细描述的生成效果，记录 3 个重要发现',
        tip: '细节决定成败！',
        xp: 80,
        platforms: ['doubao_pro', 'doubao'],
        screenshot: true
      }
    ],
    tips: 'AI 绘画需要耐心尝试，多调整提示词，每次都会有新发现！',
    badge: 'artist'
  },
  {
    day: 9,
    title: '数据分析入门',
    platform: 'DeepSeek/通义千问',
    platformId: 'deepseek',
    difficulty: 3,
    completed: false,
    xp: 300,
    platforms: ['deepseek', 'qwen'],
    description: '学习用 AI 分析数据！了解如何用 AI 处理表格、制作图表、发现数据规律。',
    cases: [
      {
        title: '📊 数据整理',
        prompt: '我有一周的学习时间记录（每天学习科目和时长），请帮我整理成表格格式',
        tip: '学习数据结构化',
        xp: 100,
        platforms: ['deepseek'],
        screenshot: true
      },
      {
        title: '📈 制作图表',
        prompt: '根据上面的数据，告诉我应该用什么图表展示最合适，并解释原因',
        tip: '柱状图？折线图？饼图？',
        xp: 100,
        platforms: ['deepseek']
      },
      {
        title: '🔍 发现规律',
        prompt: '分析我的学习时间分配，给出 3 个改进建议',
        tip: '让数据说话！',
        xp: 100,
        platforms: ['deepseek', 'qwen'],
        screenshot: true
      }
    ],
    tips: '数据分析是未来必备技能，AI 可以帮你快速入门！',
    badge: 'analyst'
  },
  {
    day: 10,
    title: '创意写作工作坊',
    platform: 'Kimi/通义千问',
    platformId: 'kimi',
    difficulty: 3,
    completed: false,
    xp: 300,
    platforms: ['kimi', 'qwen'],
    description: '深入学习创意写作！用 AI 辅助创作完整的故事、诗歌或剧本。',
    cases: [
      {
        title: '📝 故事构思',
        prompt: '帮我想 3 个不同的故事创意，每个创意包含：主角、冲突、结局',
        tip: '发挥想象力！',
        xp: 100,
        platforms: ['kimi']
      },
      {
        title: '✍️ 完整创作',
        prompt: '选择一个创意，帮我写出完整的故事，1500 字左右，注意情节起伏',
        tip: '起承转合很重要',
        xp: 100,
        platforms: ['kimi'],
        screenshot: true
      },
      {
        title: '🎭 改编剧本',
        prompt: '把这个故事改编成 5 幕短剧剧本，包含对话和舞台说明',
        tip: '学习剧本格式',
        xp: 100,
        platforms: ['kimi', 'qwen'],
        screenshot: true
      }
    ],
    tips: '写作是表达自我的方式，AI 是你的创作伙伴！',
    badge: 'writer'
  },
  {
    day: 11,
    title: '科学探索助手',
    platform: '智谱清言/DeepSeek',
    platformId: 'glm',
    difficulty: 3,
    completed: false,
    xp: 300,
    platforms: ['glm', 'deepseek'],
    description: '用 AI 探索科学世界！学习科学知识、设计实验、解答科学问题。',
    cases: [
      {
        title: '🔬 科学问题',
        prompt: '为什么天空是蓝色的？请用小学生能理解的方式解释，并设计一个小实验验证',
        tip: '科学就在身边',
        xp: 100,
        platforms: ['glm']
      },
      {
        title: '🧪 实验设计',
        prompt: '帮我设计一个家庭可做的科学实验，包括：材料、步骤、预期结果、安全提示',
        tip: '安全第一！',
        xp: 100,
        platforms: ['glm', 'deepseek'],
        screenshot: true
      },
      {
        title: '📚 科普阅读',
        prompt: '推荐 5 个适合小学生的科普主题，并为每个主题提供 3 个关键知识点',
        tip: '保持好奇心',
        xp: 100,
        platforms: ['glm']
      }
    ],
    tips: '科学探索需要严谨和好奇，AI 是你的科学顾问！',
    badge: 'scientist'
  },
  {
    day: 12,
    title: 'AI 工具创造者',
    platform: 'Coze',
    platformId: 'coze',
    difficulty: 4,
    completed: false,
    xp: 400,
    platforms: ['coze'],
    description: '今天我们来创建自己的 AI 工具！无需编程，用 Coze 平台打造专属 AI 助手。',
    cases: [
      {
        title: '🤖 了解 Coze',
        prompt: '请介绍 Coze 平台的功能和特点，它能帮我做什么？',
        tip: '了解工具能力',
        xp: 100,
        platforms: ['coze']
      },
      {
        title: '⚙️ 创建 Bot',
        prompt: '帮我设计一个"学习小助手"Bot，包括：人设、功能、回复风格',
        tip: '发挥创意!',
        xp: 150,
        platforms: ['coze'],
        screenshot: true
      },
      {
        title: '🧪 测试优化',
        prompt: '测试你的 Bot，记录 3 个需要改进的地方并优化',
        tip: '迭代改进',
        xp: 150,
        platforms: ['coze'],
        screenshot: true
      }
    ],
    tips: '从 AI 使用者到创造者，这是质的飞跃！',
    badge: 'creator_pro'
  },
  {
    day: 13,
    title: '多模态 AI 体验',
    platform: '腾讯混元/MiniMax',
    platformId: 'hunyuan',
    difficulty: 4,
    completed: false,
    xp: 400,
    platforms: ['hunyuan', 'minimax'],
    description: '体验多模态 AI！学习用 AI 处理图片、音频、视频等多种媒体形式。',
    cases: [
      {
        title: '🖼️ 图片理解',
        prompt: '上传一张图片，让 AI 描述图片内容，并基于图片编一个故事',
        tip: 'AI 能"看懂"图片吗？',
        xp: 130,
        platforms: ['hunyuan'],
        screenshot: true
      },
      {
        title: '🎵 语音合成',
        prompt: '用 AI 把一段文字转换成语音，尝试不同的声音和语调',
        tip: '听听 AI 的声音',
        xp: 130,
        platforms: ['minimax']
      },
      {
        title: '🎬 创意视频',
        prompt: '用 AI 工具设计一个 30 秒短视频的脚本和分镜',
        tip: '综合多种媒体',
        xp: 140,
        platforms: ['hunyuan', 'minimax'],
        screenshot: true
      }
    ],
    tips: '多模态 AI 是未来趋势，今天你先体验一步！',
    badge: 'multimodal'
  },
  {
    day: 14,
    title: '毕业项目 - AI 达人',
    platform: '综合运用',
    platformId: 'all',
    difficulty: 5,
    completed: false,
    xp: 500,
    platforms: ['qwen', 'deepseek', 'doubao', 'kimi'],
    description: '恭喜你来到最后一关！综合运用 14 天学到的所有技能，完成一个完整的 AI 项目，成为真正的 AI 达人！',
    cases: [
      {
        title: '🎯 项目规划',
        prompt: '我要完成一个 AI 毕业项目，请帮我规划：项目主题、使用工具、时间安排、预期成果',
        tip: '好的开始是成功的一半',
        xp: 150,
        platforms: ['qwen'],
        screenshot: true
      },
      {
        title: '🚀 项目实施',
        prompt: '根据规划，使用至少 4 个不同的 AI 平台完成你的项目',
        tip: '综合运用所有技能',
        xp: 200,
        platforms: ['qwen', 'deepseek', 'doubao', 'kimi'],
        screenshot: true
      },
      {
        title: '📊 成果展示',
        prompt: '整理你的项目成果，写一份展示报告，包括：过程、收获、反思',
        tip: '这是你的 AI 学习里程碑！',
        xp: 150,
        platforms: ['kimi'],
        screenshot: true
      }
    ],
    tips: '14 天的学习即将结束，但你的 AI 之旅才刚刚开始！用这个项目证明你的成长吧！',
    badge: 'ai_master'
  }
];

// 第二周新增徽章
const WEEK2_BADGES = [
  {
    id: 'artist',
    name: 'AI 艺术家',
    icon: '🎨',
    description: '完成第 8 天任务，掌握 AI 绘画技巧',
    requirement: '完成 AI 绘画进阶',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'analyst',
    name: '数据分析师',
    icon: '📊',
    description: '完成第 9 天任务，学会数据分析',
    requirement: '完成数据分析入门',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'writer',
    name: '创意作家',
    icon: '✍️',
    description: '完成第 10 天任务，精通创意写作',
    requirement: '完成创意写作工作坊',
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'scientist',
    name: '科学探索者',
    icon: '🔬',
    description: '完成第 11 天任务，探索科学世界',
    requirement: '完成科学探索助手',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'creator_pro',
    name: 'AI 创造者',
    icon: '🛠️',
    description: '完成第 12 天任务，创建自己的 AI 工具',
    requirement: '完成 AI 工具创造者',
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'multimodal',
    name: '多模态达人',
    icon: '🎬',
    description: '完成第 13 天任务，掌握多模态 AI',
    requirement: '完成多模态 AI 体验',
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'ai_master',
    name: 'AI 大师',
    icon: '👑',
    description: '完成 14 天全部学习，成为真正的 AI 达人',
    requirement: '完成全部 14 天学习',
    unlocked: false,
    rarity: 'legendary'
  }
];

// 扩展等级系统（14 天对应）
const LEVELS = [
  { level: 1, title: 'AI 新手', xp: 0, icon: '🌱' },
  { level: 2, title: 'AI 学徒', xp: 300, icon: '🌿' },
  { level: 3, title: 'AI 探索者', xp: 700, icon: '🧭' },
  { level: 4, title: 'AI 冒险家', xp: 1200, icon: '⚔️' },
  { level: 5, title: 'AI 达人', xp: 1800, icon: '🌟' },
  { level: 6, title: 'AI 专家', xp: 2500, icon: '💫' },
  { level: 7, title: 'AI 大师', xp: 3300, icon: '🏆' },
  { level: 8, title: 'AI 传奇', xp: 4200, icon: '👑' },
  { level: 9, title: 'AI 创造者', xp: 5200, icon: '🛠️' },
  { level: 10, title: 'AI 先知', xp: 6300, icon: '🔮' }
];

// 合并所有徽章
const BADGES = [
  {
    id: 'explorer',
    name: 'AI 探险家',
    icon: '🌟',
    description: '完成第 1 天任务，开始 AI 之旅',
    requirement: '完成认识 AI 助手',
    unlocked: false,
    rarity: 'common'
  },
  ...WEEK2_BADGES
];

// 奖励系统
const REWARDS = [
  {
    id: 'certificate',
    name: '毕业证书',
    icon: '📜',
    description: '完成 14 天学习后获得',
    requirement: '完成全部 14 天任务',
    unlocked: false,
    xp: 1000
  }
];

// AI 平台列表
const AI_PLATFORMS = [
  {
    id: 'doubao',
    name: '豆包',
    icon: 'logos/doubao.png',
    url: 'https://www.doubao.com',
    company: '字节跳动',
    free: true,
    ageRecommend: '6+',
    description: '豆包是字节跳动推出的 AI 助手，支持语音对话、绘画等多种功能。',
    strengths: ['语音对话', 'AI 绘画', '创意写作', '知识问答'],
    uses: '适合日常问答、创意写作、绘画创作等',
    bestFor: ['语音交互', '多模态体验']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: 'logos/deepseek.png',
    url: 'https://www.deepseek.com',
    company: '深度求索',
    free: true,
    ageRecommend: '10+',
    description: 'DeepSeek 是深度求索推出的 AI 助手，擅长编程和逻辑推理。',
    strengths: ['编程能力', '逻辑推理', '代码解释', '数学计算'],
    uses: '适合编程学习、数学题解答、逻辑训练',
    bestFor: ['编程学习', '逻辑思维']
  },
  {
    id: 'qwen',
    name: '通义千问',
    icon: 'logos/tongyi.png',
    url: 'https://tongyi.aliyun.com',
    company: '阿里巴巴',
    free: true,
    ageRecommend: '8+',
    description: '通义千问是阿里巴巴推出的超大规模语言模型。',
    strengths: ['逻辑推理', '代码生成', '文档分析', '多语言'],
    uses: '适合学习辅导、编程入门、文档处理等',
    bestFor: ['学习辅助', '编程学习']
  },
  {
    id: 'kimi',
    name: 'Kimi',
    icon: 'logos/kimi.png',
    url: 'https://kimi.moonshot.cn',
    company: '月之暗面',
    free: true,
    ageRecommend: '8+',
    description: 'Kimi 是月之暗面推出的 AI 助手，擅长长文本处理。',
    strengths: ['长文本分析', '资料整理', '阅读理解'],
    uses: '适合阅读长文章、整理笔记、资料分析',
    bestFor: ['长文本处理', '资料整理']
  },
  {
    id: 'ernie',
    name: '文心一言',
    icon: 'logos/wenxin.png',
    url: 'https://yiyan.baidu.com',
    company: '百度',
    free: true,
    ageRecommend: '8+',
    description: '文心一言是百度推出的 AI 大模型。',
    strengths: ['中文理解', '绘画生成', '知识问答'],
    uses: '适合中文写作、绘画创作、知识查询',
    bestFor: ['中文场景', 'AI 绘画']
  },
  {
    id: 'qingyan',
    name: '智谱清言',
    icon: 'logos/qingyan.png',
    url: 'https://chatglm.cn',
    company: '智谱 AI',
    free: true,
    ageRecommend: '10+',
    description: '智谱清言是智谱 AI 推出的对话模型。',
    strengths: ['逻辑推理', '学术问答', '专业领域'],
    uses: '适合深入学习、学术探讨',
    bestFor: ['学术场景', '深度对话']
  },
  {
    id: 'yuanbao',
    name: '腾讯元宝',
    icon: 'logos/yuanbao.png',
    url: 'https://yuanbao.tencent.com',
    company: '腾讯',
    free: true,
    ageRecommend: '8+',
    description: '腾讯元宝是腾讯推出的 AI 助手。',
    strengths: ['社交场景', '内容创作', '娱乐互动'],
    uses: '适合创意写作、社交互动',
    bestFor: ['创意写作', '互动娱乐']
  }
];
