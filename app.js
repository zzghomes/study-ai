// AI 探险家 - 应用逻辑（21 天任务系统）
// 版本：2026-03-25
// 功能：21 天任务系统，过程记录，作品公开分享

// 全局数据对象（只在 window 上创建一次，避免重复声明）
if (!window.APP_DATA) {
  window.APP_DATA = {
  childName: '小探险家',
  startDate: null,
  lastActive: null,
  visitedPlatforms: [],
  totalXP: 0,
  streak: 0
  };
}
// 使用 var 而不是 const，允许重新声明（但值来自 window.APP_DATA 确保一致性）
var APP_DATA = window.APP_DATA;

class AIExplorerApp {
  constructor() {
    this.currentPage = 'home';
    this.selectedTask = null;
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  // 初始化
  init() {
    console.log('🤖 开始初始化 AI 探险家...');
    
    this.loadData();
    this.loadTheme();
    this.setupNavigation();
    this.setupTodayTaskButton(); // 设置今日任务按钮事件委托
    this.updateWelcome();
    this.updateProgress();
    this.updateLevel();
    this.updateStreak();
    this.renderTodayTask();
    this.renderPlatforms();
    this.renderTasks();
    this.checkStartDate();
    setTimeout(() => this.createStars(), 200);
    
    // 初始化休息提醒
    this.initRestReminder();
    
    // 初始化多孩子管理
    this.initMultiChild();
    
    // 初始化 PDF 导出
    this.initPDFExport();
    
    // 初始化热力图
    this.initHeatmap();
    
    // 初始化知识库
    this.initKnowledge();
    
    // 初始化成就页面事件
    this.initAchievementsEvents();
    
    // 初始化知识库进度
    setTimeout(() => this.initKnowledgeProgress(), 500);
    
    console.log('✅ AI 探险家初始化完成！');
  }

  // 初始化休息提醒
  initRestReminder() {
    // 将全局的 restReminderManager 赋值给 app.restReminder
    this.restReminder = window.restReminderManager;
    
    // 请求通知权限
    if (this.restReminder) {
      this.restReminder.requestNotificationPermission();
      // 启动休息提醒
      this.restReminder.start();
      console.log('⏰ 休息提醒已启动');
    }
  }

  // 初始化多孩子管理
  initMultiChild() {
    // 创建多孩子管理器实例
    this.multiChild = new MultiChildManager(this);
    
    // 设置切换回调
    this.multiChild.onChildSwitch = (child) => {
      this.onChildSwitched(child);
    };
    
    // 检查是否需要从旧数据迁移
    this.multiChild.initFromLegacyData();
    
    console.log('👨‍👩‍👧‍👦 多孩子管理已初始化');
  }

  // 孩子切换后的 UI 刷新
  onChildSwitched(child) {
    console.log('✅ 切换到孩子:', child.name);
    
    // 刷新所有依赖孩子数据的 UI
    this.updateWelcome();           // 欢迎信息
    this.updateProgress();          // 进度条
    this.updateLevel();             // 等级显示
    this.updateStreak();            // 连击显示
    this.renderTodayTask();         // 今日任务
    this.renderGallery();           // 作品墙
    
    // 如果在家长中心页面，刷新报告相关
    if (this.currentPage === 'parents') {
      this.renderParents();         // 学习报告
      setTimeout(() => {
        this.heatmap?.refresh();    // 热力图
        this.renderAbilityRadar();  // 能力雷达图
        this.generateAIComment();   // AI 评语
      }, 100);
    }
    
    this.showToast(`✅ 已切换到 ${child.name}`, 'success');
  }

  // 初始化 PDF 导出
  initPDFExport() {
    // 创建 PDF 导出管理器实例
    this.pdfExport = new PDFExportManager(this);
    console.log('📄 PDF 导出已初始化');
  }

  // 导出 PDF 报告
  exportPDFReport() {
    if (this.pdfExport) {
      this.pdfExport.exportReport();
    } else {
      this.showToast('❌ PDF 导出功能未初始化', 'error');
    }
  }

  // 初始化热力图
  initHeatmap() {
    this.heatmap = new LearningHeatmap(this);
    console.log('🔥 热力图已初始化');
  }

  // 初始化知识库
  initKnowledge() {
    this.knowledge = new KnowledgeManager(this);
    console.log('📚 知识库已初始化');
  }

  // 加载数据
  loadData() {
    // 清理旧的密码数据（不再需要密码功能）
    localStorage.removeItem('parentPassword');
    localStorage.removeItem('parentPasswordHash');
    
    const saved = localStorage.getItem('aiExplorerData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(APP_DATA, parsed.data);
        
        // 初始化 streak
        if (APP_DATA.streak === undefined || APP_DATA.streak === null) {
          APP_DATA.streak = 0;
        }
        
        // 初始化作品墙数据
        if (!APP_DATA.works) {
          APP_DATA.works = [];
        }
        
        // 初始化多孩子数据结构
        if (!APP_DATA.children) {
          APP_DATA.children = [];
        }
        if (!APP_DATA.currentChildId) {
          APP_DATA.currentChildId = null;
        }
        
        // 初始化全局设置
        if (!APP_DATA.globalSettings) {
          APP_DATA.globalSettings = {
            soundEnabled: true,
            theme: 'coral',
            notificationsEnabled: true
          };
        }
        
        if (parsed.tasks) {
          parsed.tasks.forEach((t, i) => {
            if (LEARNING_TASKS[i]) {
              LEARNING_TASKS[i].completed = t.completed;
              LEARNING_TASKS[i].completedCases = t.completedCases || [];
            }
          });
        }
        
        if (parsed.badges) {
          parsed.badges.forEach((b, i) => {
            if (BADGES[i]) {
              BADGES[i].unlocked = b.unlocked;
            }
          });
        }
        
        if (parsed.rewards) {
          parsed.rewards.forEach((r, i) => {
            if (REWARDS[i]) {
              REWARDS[i].unlocked = r.unlocked;
            }
          });
        }
      } catch (e) {
        console.error('加载数据失败:', e);
      }
    } else {
      APP_DATA.streak = 0;
      APP_DATA.works = [];
      APP_DATA.children = [];
      APP_DATA.currentChildId = null;
      APP_DATA.globalSettings = {
        soundEnabled: true,
        theme: 'coral',
        notificationsEnabled: true
      };
    }
  }

  // 保存数据
  saveData() {
    const data = {
      data: APP_DATA,
      tasks: LEARNING_TASKS.map(t => ({ 
        completed: t.completed,
        completedCases: t.completedCases || []
      })),
      badges: BADGES.map(b => ({ unlocked: b.unlocked })),
      rewards: REWARDS.map(r => ({ unlocked: r.unlocked }))
    };
    localStorage.setItem('aiExplorerData', JSON.stringify(data));
  }

  // 检查开始日期
  checkStartDate() {
    if (!APP_DATA.startDate) {
      APP_DATA.startDate = new Date().toISOString();
      this.saveData();
    }
  }

  // 设置导航
  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = e.currentTarget?.dataset?.page;
        if (!page) return;
        this.navigateTo(page);
      });
    });
  }

  // 切换页面
  navigateTo(page) {
    console.log('🔄 导航到页面:', page);
    this.currentPage = page;
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === page);
    });
    
    document.querySelectorAll('.page').forEach(p => {
      p.classList.toggle('active', p.id === page);
    });
    
    switch(page) {
      case 'home':
        console.log('🏠 渲染首页...');
        this.updateWelcome();
        this.updateProgress();
        this.updateLevel();
        this.renderTodayTask();
        break;
      case 'tasks':
        console.log('📋 渲染任务页面...');
        this.renderTasks();
        break;
      case 'achievements':
        console.log('🏆 渲染成就页面...');
        this.renderAchievements();
        break;
      case 'gallery':
        console.log('📸 渲染作品页面...');
        this.renderGallery();
        break;
      case 'knowledge':
        console.log('📚 渲染知识页面...');
        this.renderKnowledge();
        break;
      case 'parents':
        console.log('📈 渲染家长页面...');
        this.renderParents();
        break;
    }
    
    this.saveData();
  }

  // 更新欢迎信息
  updateWelcome() {
    // 优先使用当前孩子的名字
    let name = '小探险家';
    const currentChild = this.multiChild?.getCurrentChild();
    if (currentChild && currentChild.name) {
      name = currentChild.name;
    } else if (APP_DATA.childName) {
      name = APP_DATA.childName;
    }
    
    const hour = new Date().getHours();
    
    let greeting = '欢迎回来';
    if (hour < 12) greeting = '早上好';
    else if (hour < 18) greeting = '下午好';
    else greeting = '晚上好';
    
    document.getElementById('welcome-title').textContent = `${greeting}，${name}！`;
    
    const completedCount = LEARNING_TASKS.filter(t => t.completed).length;
    const totalDays = LEARNING_TASKS.length;
      if (completedCount === 0) {
        document.getElementById('welcome-message').textContent = '准备好今天的 AI 冒险了吗？';
      } else if (completedCount < totalDays) {
        document.getElementById('welcome-message').textContent = `已完成 ${completedCount}/${totalDays} 天，继续加油！`;
      } else {
        document.getElementById('welcome-message').textContent = '🎉 恭喜你完成全部 21 天学习！';
      }
  }

  // 更新进度
  updateProgress() {
    const completedDays = LEARNING_TASKS.filter(t => t.completed).length;
    const totalDays = LEARNING_TASKS.length;
    const percent = Math.round((completedDays / totalDays) * 100);
    
    document.getElementById('progress-percent').textContent = `${percent}%`;
    document.getElementById('progress-fill').style.width = `${percent}%`;
    document.getElementById('completed-days').textContent = completedDays;
    
    const completedTasks = LEARNING_TASKS.reduce((sum, task) => {
      return sum + (task.completedCases ? task.completedCases.length : 0);
    }, 0);
    document.getElementById('completed-tasks').textContent = completedTasks;
    
    const badges = BADGES.filter(b => b.unlocked).length;
    document.getElementById('total-badges').textContent = badges;
    
    APP_DATA.completedDays = completedDays;
    APP_DATA.completedTasks = completedTasks;
    APP_DATA.totalBadges = badges;
  }

  // 更新等级和 XP
  updateLevel() {
    const totalXP = LEARNING_TASKS.reduce((sum, task) => {
      if (task.completed) {
        const caseXP = (task.completedCases || []).reduce((s, idx) => {
          return s + (task.cases[idx] ? task.cases[idx].xp || 0 : 0);
        }, 0);
        return sum + (task.xp || 0);
      }
      return sum;
    }, 0);
    
    APP_DATA.totalXP = totalXP;
    
    let currentLevel = 1;
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVELS[i].xp) {
        currentLevel = LEVELS[i].level;
        break;
      }
    }
    APP_DATA.currentLevel = currentLevel;
    
    const levelInfo = LEVELS[currentLevel - 1] || LEVELS[LEVELS.length - 1];
    const nextLevel = LEVELS[currentLevel];
    
    // 更新等级显示
    const levelEl = document.getElementById('current-level');
    if (levelEl) {
      levelEl.innerHTML = `
        <span class="level-icon">${levelInfo.icon}</span>
        <span>LV.${currentLevel} ${levelInfo.title}</span>
      `;
    }
    
    // 更新 XP 进度条
    const xpFill = document.getElementById('xp-fill');
    const xpValue = document.getElementById('xp-value');
    
    if (xpFill && nextLevel) {
      const prevLevelXP = LEVELS[currentLevel - 2]?.xp || 0;
      const progress = ((totalXP - prevLevelXP) / (nextLevel.xp - prevLevelXP)) * 100;
      xpFill.style.width = `${Math.min(progress, 100)}%`;
    }
    
    if (xpValue) {
      xpValue.textContent = `${totalXP} XP`;
    }
  }

  // 更新连击
  updateStreak() {
    const today = new Date().toDateString();
    const lastActive = APP_DATA.lastActiveDate;
    
    // 确保 streak 有值
    if (APP_DATA.streak === undefined || APP_DATA.streak === null) {
      APP_DATA.streak = 0;
    }
    
    // 如果今天已经签到过，不需要更新
    if (lastActive === today) {
      this.updateStreakDisplay();
      return;
    }
    
    if (lastActive) {
      const lastDate = new Date(lastActive);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // 检查是否是连续的一天（昨天）
      if (lastDate.toDateString() === yesterday.toDateString()) {
        // 昨天签到了，今天连击 +1
        APP_DATA.streak++;
      } else if (lastDate.toDateString() === today) {
        // 同一天，不需要更新
        this.updateStreakDisplay();
        return;
      } else if (lastDate < yesterday) {
        // 超过一天没签到，连击重置为 1（当天首次签到）
        APP_DATA.streak = 1;
      } else {
        // 其他情况，连击 +1
        APP_DATA.streak++;
      }
    } else {
      // 第一次签到
      APP_DATA.streak = 1;
    }
    
    // 更新最后活跃日期
    APP_DATA.lastActiveDate = today;
    
    // 保存数据
    this.saveData();
    
    
    this.updateStreakDisplay();
  }

  // 更新连击显示
  updateStreakDisplay() {
    const streakEl = document.getElementById('streak-counter');
    if (streakEl) {
      streakEl.innerHTML = `
        <span class="streak-fire">🔥</span>
        <span>${APP_DATA.streak || 0} 天连击</span>
      `;
    }
  }

  // 设置今日任务按钮事件委托
  setupTodayTaskButton() {
    // 使用事件委托，在容器上监听点击事件
    const container = document.getElementById('today-task');
    if (container) {
      container.addEventListener('click', (e) => {
        const btn = e.target.closest('.start-task-btn');
        if (btn) {
          e.stopPropagation();
          const taskIndex = parseInt(btn.getAttribute('data-task-index'), 10);
          console.log('📋 点击开始任务按钮，打开任务:', taskIndex);
          this.openTask(taskIndex);
        }
      });
      console.log('✅ 今日任务按钮事件委托已设置');
    }
  }

  // 渲染今日任务
  renderTodayTask() {
    console.log('📋 渲染今日任务...');
    const today = LEARNING_TASKS.find(t => !t.completed) || LEARNING_TASKS[LEARNING_TASKS.length - 1];
    const container = document.getElementById('today-task');
    
    if (!container) {
      console.error('❌ 今日任务容器未找到');
      return;
    }
    
    console.log('今日任务:', today.day, today.title, '已完成:', today.completed);
    
    if (today.completed) {
      container.innerHTML = `
        <div class="task-header">
          <h3>🎉 所有任务已完成！</h3>
        </div>
        <p>太棒了！你已经完成了全部 21 天的学习。</p>
        <p style="margin-top: 1rem;">可以去成就页面查看你的徽章，或者在作品墙分享你的作品！</p>
      `;
      container.classList.add('completed');
    } else {
      const difficulty = '⭐'.repeat(today.difficulty);
      const taskIndex = LEARNING_TASKS.findIndex(t => t.day === today.day);
      
      container.innerHTML = `
        <div class="task-header">
          <h3>第 ${today.day} 天：${today.title}</h3>
          <span class="day-status pending">待完成</span>
        </div>
        <div style="margin-top: 1rem;">
          <span class="platform-tag">${today.platform}</span>
          <span class="task-difficulty">${difficulty}</span>
        </div>
        <p style="margin-top: 1rem; color: white; opacity: 0.9;">${today.description.substring(0, 100)}...</p>
        <div style="margin-top: 1rem; font-size: 14px; opacity: 0.8;">
          完成可获得 ${today.xp} XP
        </div>
        <button class="btn-primary start-task-btn" data-task-index="${taskIndex}" style="margin-top: 1rem; background: white; color: var(--black); cursor: pointer;">
          开始任务 →
        </button>
      `;
      container.classList.remove('completed');
    }
  }

  // 渲染任务列表（按段位分组）
  renderTasks() {
    const container = document.getElementById('days-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 段位配置
    const stages = {
      'bronze': { name: '🥉 青铜段位', desc: '基础入门', color: '#CD7F32', levels: [1, 2, 3] },
      'silver': { name: '🥈 白银段位', desc: '核心技能', color: '#C0C0C0', levels: [4, 5, 6, 7, 8, 9, 10] },
      'gold': { name: '🏆 黄金段位', desc: '项目实战', color: '#FFD700', levels: [11, 12, 13, 14, 15, 16, 17] },
      'diamond': { name: '💎 钻石段位', desc: '毕业展示', color: '#B9F2FF', levels: [18, 19, 20, 21] }
    };
    
    // 按段位分组渲染
    Object.keys(stages).forEach(stageKey => {
      const stage = stages[stageKey];
      const stageTasks = LEARNING_TASKS.filter(t => t.stage === stageKey);
      
      if (stageTasks.length === 0) return;
      
      // 创建段位分组容器
      const stageSection = document.createElement('div');
      stageSection.className = 'stage-section';
      stageSection.style.marginBottom = '32px';
      
      // 段位标题 - 高级艺术感设计
      const stageHeader = document.createElement('div');
      stageHeader.className = 'stage-header';
      stageHeader.setAttribute('data-stage', stageKey);
      
      stageHeader.innerHTML = `
        <div class="stage-decoration"></div>
        <div class="stage-info">
          <span class="stage-name" data-stage="${stageKey}">${stage.name}</span>
          <span class="stage-desc">${stage.desc}</span>
        </div>
        <span class="stage-progress">${stageTasks.filter(t => t.completed).length}/${stageTasks.length} 已完成</span>
      `;
      stageSection.appendChild(stageHeader);
      
      // 任务卡片容器
      const tasksGrid = document.createElement('div');
      tasksGrid.className = 'tasks-grid';
      tasksGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;';
      
      stageTasks.forEach((task, index) => {
        const globalIndex = LEARNING_TASKS.findIndex(t => t.day === task.day);
        const isLocked = globalIndex > 0 && !LEARNING_TASKS[globalIndex - 1].completed;
        const difficulty = '⭐'.repeat(task.difficulty);
        
        const card = document.createElement('div');
        card.className = `day-card ${task.completed ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
        card.style.cssText = `cursor: ${isLocked ? 'not-allowed' : 'pointer'}; border-top: 3px solid ${stage.color};`;
        
        if (!isLocked) {
          card.onclick = () => {
            console.log('📋 点击任务:', globalIndex, task.title);
            app.openTask(globalIndex);
          };
        }
        
        const completedCount = task.completedCases ? task.completedCases.length : 0;
        const totalCount = task.cases.length;
        
        // 段位徽章
        const stageBadge = stageKey === 'bronze' ? '🥉' : stageKey === 'silver' ? '🥈' : stageKey === 'gold' ? '🏆' : '💎';
        
        card.innerHTML = `
          <div class="day-info">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 16px;">${stageBadge}</span>
              <div class="day-title" style="font-size: 14px; font-weight: 600; color: var(--text-primary);">第 ${task.day} 天：${task.title}</div>
            </div>
            <div class="day-meta" style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span class="platform-badge">${task.platform}</span>
              <span class="difficulty-badge">${difficulty}</span>
              ${task.badge ? `<span style="font-size: 12px;">🏅 ${BADGES.find(b => b.id === task.badge)?.name || ''}</span>` : ''}
            </div>
            ${!task.completed ? `<div style="margin-top: 8px; font-size: 13px; color: var(--text-secondary);">📝 进度：${completedCount}/${totalCount}</div>` : ''}
            ${task.completed ? `<div style="margin-top: 8px; font-size: 13px; color: var(--success); font-weight: 600; color: var(--text-primary);">✅ +${task.xp} XP</div>` : ''}
          </div>
          <span class="day-status ${task.completed ? 'completed' : isLocked ? 'locked' : 'pending'}" style="margin-top: 12px;">
            ${task.completed ? '✅ 已完成' : isLocked ? '🔒 未解锁' : '⏳ 进行中'}
          </span>
        `;
        
        tasksGrid.appendChild(card);
      });
      
      stageSection.appendChild(tasksGrid);
      container.appendChild(stageSection);
    });
    
    console.log('✅ 任务列表已渲染（段位分组），共', LEARNING_TASKS.length, '个任务');
  }

  // 打开任务详情
  openTask(index) {
    this.selectedTask = index;
    const task = LEARNING_TASKS[index];
    
    console.log('🔍 openTask 开始执行，任务索引:', index);
    console.log('🔍 当前 DOM 中的模态框:', document.querySelectorAll('.modal').length);
    
    // 尝试多种方式查找模态框
    let taskModal = document.getElementById('task-modal');
    
    // 如果找不到，尝试用 querySelector
    if (!taskModal) {
      taskModal = document.querySelector('#task-modal');
      console.log('🔍 使用 querySelector 查找:', taskModal ? '找到' : '未找到');
    }
    
    // 如果还是找不到，创建模态框
    if (!taskModal) {
      console.log('🔨 创建任务模态框...');
      this.createTaskModal();
      taskModal = document.getElementById('task-modal');
    }
    
    if (!taskModal) {
      console.error('❌ 任务模态框创建失败');
      this.showToast('❌ 无法打开任务详情，请刷新页面', 'error');
      return;
    }
    
    console.log('✅ 找到任务模态框，继续填充内容');
    
    // 填充内容
    const modalDay = document.getElementById('modal-day');
    const modalTitle = document.getElementById('modal-title');
    const modalPlatform = document.getElementById('modal-platform');
    const modalDifficulty = document.getElementById('modal-difficulty');
    const modalDescription = document.getElementById('modal-description');
    const modalCases = document.getElementById('modal-cases');
    const modalTips = document.getElementById('modal-tips');
    
    if (modalDay) modalDay.textContent = `第 ${task.day} 天`;
    if (modalTitle) modalTitle.textContent = task.title;
    if (modalPlatform) modalPlatform.textContent = task.platform;
    if (modalDifficulty) modalDifficulty.textContent = `${'⭐'.repeat(task.difficulty)} ${['简单', '中等', '困难'][task.difficulty - 1]}`;
    if (modalDescription) modalDescription.textContent = task.description;
    
    const completedCases = task.completedCases || [];
    
    const casesHtml = task.cases.map((c, i) => {
      const isCompleted = completedCases.includes(i);
      const platforms = c.platforms || task.platforms || [];
      const screenshot = c.screenshot || false;
      
      // 生成平台按钮
      const platformButtons = platforms.map(pid => {
        const platform = AI_PLATFORMS.find(p => p.id === pid);
        if (!platform) return '';
        // 判断是图片路径还是 emoji
        const isImage = platform.icon.includes('.') && !platform.icon.startsWith('🎵');
        const iconHtml = isImage 
          ? `<img src="${platform.icon}" alt="${platform.name}" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px; border-radius: 3px;">`
          : platform.icon;
        return `<button class="btn-primary" style="margin-right: 8px; padding: 6px 12px; font-size: 12px;" onclick="app.openPlatform('${platform.id}')">${iconHtml} ${platform.name} →</button>`;
      }).join('');
      
      return `
        <div class="case-item" style="${isCompleted ? 'border-left-color: var(--success); opacity: 0.7;' : ''}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <strong>${i + 1}. ${c.title}</strong>
            ${isCompleted ? `<span style="color: var(--success); font-weight: 600; color: var(--text-primary);">✅ +${c.xp} XP</span>` : `<span style="color: var(--primary); font-weight: 600; color: var(--text-primary);">+${c.xp} XP</span>`}
          </div>
          <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">${c.prompt}</p>
          <div style="margin-top: 12px; margin-bottom: 12px;">
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;">🔗 推荐平台：</div>
            ${platformButtons}
          </div>
          ${screenshot ? '<div style="background: #fff3cd; border-left: 3px solid #ffc107; padding: 10px; border-radius: 6px; font-size: 13px; color: #856404; margin-bottom: 12px;">📸 提示：完成后请截图保存，可以上传到作品墙哦！</div>' : ''}
          <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--gray);">💡 ${c.tip}</p>
          ${!isCompleted ? `<button class="btn-primary" style="margin-top: 1rem; padding: 8px 16px; font-size: 14px;" onclick="app.completeCase(${i})">✅ 完成此任务</button>` : ''}
        </div>
      `;
    }).join('');
    
    document.getElementById('modal-cases').innerHTML = `
      <h4>📝 实践任务</h4>
      ${casesHtml}
    `;
    
    // 添加任务级别的平台链接
    const taskPlatforms = task.platforms || [];
    if (taskPlatforms.length > 0 && task.platformId === 'all') {
      const allPlatformButtons = taskPlatforms.map(pid => {
        const platform = AI_PLATFORMS.find(p => p.id === pid);
        if (!platform) return '';
        // 判断是图片路径还是 emoji
        const isImage = platform.icon.includes('.') && !platform.icon.startsWith('🎵');
        const iconHtml = isImage 
          ? `<img src="${platform.icon}" alt="${platform.name}" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 6px; border-radius: 4px;">`
          : platform.icon;
        return `<button class="btn-primary" style="margin: 4px; padding: 8px 16px;" onclick="app.openPlatform('${platform.id}')">${iconHtml} ${platform.name} →</button>`;
      }).join('');
      
      document.getElementById('modal-tips').innerHTML = `
        <h4>💡 小贴士</h4>
        <p>${task.tips}</p>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--light-gray);">
          <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">🚀 快速访问推荐平台：</div>
          ${allPlatformButtons}
        </div>
      `;
    } else {
      document.getElementById('modal-tips').innerHTML = `
        <h4>💡 小贴士</h4>
        <p>${task.tips}</p>
      `;
    }
    
    document.getElementById('task-modal').classList.add('active');
  }

  // 完成小案例
  completeCase(caseIndex) {
    if (this.selectedTask === null) return;
    
    const task = LEARNING_TASKS[this.selectedTask];
    if (!task.completedCases) {
      task.completedCases = [];
    }
    
    if (!task.completedCases.includes(caseIndex)) {
      task.completedCases.push(caseIndex);
      
      const caseXP = task.cases[caseIndex].xp || 0;
      const caseInfo = task.cases[caseIndex];
      
      // 播放音效
      soundManager.playSuccess();
      
      // 检查是否需要截图提示
      if (caseInfo.screenshot) {
        setTimeout(() => {
          this.showScreenshotReminder(caseIndex);
        }, 1000);
      }
      
      this.showToast(`✅ 完成任务！获得 ${caseXP} XP`, 'success');
      
      // 检查是否完成所有小任务
      if (task.completedCases.length === task.cases.length) {
        task.completed = true;
        task.completedDate = new Date().toISOString();
        
        if (task.badge) {
          const badge = BADGES.find(b => b.id === task.badge);
          if (badge && !badge.unlocked) {
            badge.unlocked = true;
            soundManager.playBadgeUnlock();
            confettiManager.start(2000);
            setTimeout(() => {
              this.showToast(`🎉 解锁新徽章：${badge.name} ${badge.icon}`, 'success');
            }, 500);
          }
        }
        
        // 检查升级
        const oldLevel = APP_DATA.currentLevel;
        this.updateLevel();
        if (APP_DATA.currentLevel > oldLevel) {
          soundManager.playLevelUp();
          confettiManager.start(3000);
          this.showToast(`🎊 升级到 LV.${APP_DATA.currentLevel}！`, 'success');
        }
        
        this.checkRewards();
        
        // 更新进度显示
        this.updateProgress();
        
        // 更新知识库进度
        if (this.knowledge) {
          this.updateKnowledgeProgress();
        }
        
        // 检查是否完成全部学习
        const allCompleted = LEARNING_TASKS.every(t => t.completed);
        if (allCompleted) {
          setTimeout(() => this.showCertificate(), 1000);
        }
      }
    }
    
    this.saveData();
    
    // 检查是否完成所有小任务
    if (task.completedCases.length === task.cases.length) {
      // 任务已全部完成，关闭所有模态框并返回首页
      setTimeout(() => {
        // 关闭所有模态框
        document.querySelectorAll('.modal').forEach(m => m.remove());
        this.selectedTask = null;
        this.navigateTo('home');
      }, 500);
    } else {
      // 还有未完成的小任务，重新渲染模态框
      this.openTask(this.selectedTask);
    }
    
    // 刷新首页今日任务卡片状态（确保按钮可点击）
    setTimeout(() => {
      this.renderTodayTask();
    }, 100);
  }

  // 显示截图提醒
  showScreenshotReminder(caseIndex) {
    const task = LEARNING_TASKS[this.selectedTask];
    const caseInfo = task.cases[caseIndex];
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <h3>📸 记得截图哦！</h3>
        </div>
        <div class="modal-body">
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 64px; margin-bottom: 16px;">📸</div>
            <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 20px;">
              你完成了 <strong>"${caseInfo.title}"</strong> 任务！
            </p>
            <div style="background: var(--light-gray); padding: 16px; border-radius: 20px; margin-bottom: 20px;">
              <p style="font-size: 14px; color: var(--text-secondary);">
                💡 建议截图保存你的 AI 对话和作品，然后上传到作品墙，让爸爸妈妈看到你的成果！
              </p>
            </div>
            <div style="display: flex; gap: 12px; justify-content: center;">
              <button class="btn-secondary" onclick="this.closest('.modal').remove()">稍后上传</button>
              <button class="btn-primary" onclick="app.closeScreenshotModalAndGoToGallery()">上传到作品墙 →</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // 关闭截图提醒并跳转到作品墙
  closeScreenshotModalAndGoToGallery() {
    console.log('📸 关闭截图模态框并跳转到作品墙');
    
    // 关闭所有模态框
    document.querySelectorAll('.modal').forEach(m => m.remove());
    
    // 导航到作品页面
    this.navigateTo('gallery');
    
    // 等待页面切换完成后打开添加作品模态框
    setTimeout(() => {
      console.log('🔍 查找作品模态框...');
      console.log('DOM 中的所有 ID:', Array.from(document.querySelectorAll('[id]')).map(el => el.id).filter(id => id.includes('work')));
      
      const workModal = document.getElementById('work-modal');
      console.log('模态框元素:', workModal);
      console.log('模态框 outerHTML:', workModal ? workModal.outerHTML.substring(0, 100) : 'null');
      
      if (workModal) {
        console.log('✅ 找到模态框');
        // 重置表单
        const titleInput = document.getElementById('work-title');
        const platformSelect = document.getElementById('work-platform');
        const descTextarea = document.getElementById('work-description');
        const taskSelect = document.getElementById('work-task');
        
        if (titleInput) titleInput.value = '';
        if (platformSelect) platformSelect.value = '豆包';
        if (descTextarea) descTextarea.value = '';
        if (taskSelect) taskSelect.value = '';
        
        this.currentWorkImage = null;
        this.hideWorkImagePreview();
        
        // 显示模态框 - 使用 style.display 确保显示
        workModal.style.display = 'flex';
        workModal.classList.add('active');
        console.log('✅ 作品模态框已打开，display:', workModal.style.display);
      } else {
        console.error('❌ 作品模态框未找到，尝试直接创建');
        this.createAndShowWorkModal();
      }
    }, 800);
  }

  // 显示下一个任务提示
  showNextTaskHint() {
    const nextTaskIndex = this.selectedTask + 1;
    if (nextTaskIndex < LEARNING_TASKS.length) {
      const nextTask = LEARNING_TASKS[nextTaskIndex];
      
      const modal = document.createElement('div');
      modal.className = 'modal active';
      modal.innerHTML = `
        <div class="modal-content">
          <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
          <div class="modal-header">
            <h3>🎉 太棒了！</h3>
          </div>
          <div class="modal-body">
            <div style="text-align: center; padding: 20px;">
              <div style="font-size: 64px; margin-bottom: 16px;">🏆</div>
              <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 20px;">
                你已完成第 ${LEARNING_TASKS[this.selectedTask].day} 天的所有任务！
              </p>
              <div style="background: linear-gradient(135deg, var(--primary), var(--purple)); padding: 20px; border-radius: 20px; color: white; margin-bottom: 20px;">
                <p style="font-size: 14px; opacity: 0.9;">下一个挑战：</p>
                <p style="font-size: 18px; font-weight: 600; margin-top: 8px;">第 ${nextTask.day} 天：${nextTask.title}</p>
              </div>
              <div style="display: flex; gap: 12px; justify-content: center;">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">休息一下</button>
                <button class="btn-primary" onclick="app.openTask(${nextTaskIndex}); this.closest('.modal').remove()">继续下一个任务 →</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
  }

  // 创建任务模态框
  createTaskModal() {
    console.log('🔨 创建任务模态框...');
    
    // 先检查是否已存在
    const existing = document.getElementById('task-modal');
    if (existing) {
      console.log('⚠️ 模态框已存在，直接使用');
      return existing;
    }
    
    const modal = document.createElement('div');
    modal.id = 'task-modal';
    modal.className = 'modal';
    modal.style.display = 'flex';  // 使用 flex 显示
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.zIndex = '1000';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 800px;">
        <button class="modal-close" onclick="app.closeTaskModal()">×</button>
        <div class="modal-header">
          <h3 id="modal-day">第 X 天</h3>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 24px;">
            <h2 id="modal-title" style="margin-bottom: 12px;">任务标题</h2>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px;">
              <span class="platform-badge" id="modal-platform">平台</span>
              <span class="difficulty-badge" id="modal-difficulty">难度</span>
            </div>
            <p id="modal-description" style="line-height: 1.6;">任务描述</p>
          </div>
          
          <h3 style="margin-bottom: 16px;">📝 任务清单</h3>
          <div id="modal-cases"></div>
          
          <div id="modal-tips" style="margin-top: 24px; padding: 16px; background: var(--card-bg); border-radius: 20px;"></div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="app.closeTaskModal()">关闭</button>
          <button class="btn-primary" onclick="app.completeTask()">✅ 完成任务</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    console.log('✅ 任务模态框已创建');
    return modal;
  }

  // 关闭任务模态框
  closeTaskModal() {
    const modal = document.getElementById('task-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      // 完全移除模态框，下次打开时重新创建
      modal.remove();
    }
    this.selectedTask = null;
  }

  // 关闭所有模态框（统一管理）
  closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      // 清理事件监听器
      const clones = modal.cloneNode(true);
      modal.parentNode.replaceChild(clones[0], modal);
      // 移除模态框
      setTimeout(() => {
        clones[0].remove();
      }, 100);
    });
  }

  // 完成任务（旧版兼容）
  completeTask() {
    if (this.selectedTask === null) return;
    
    const task = LEARNING_TASKS[this.selectedTask];
    task.completed = true;
    task.completedCases = task.cases.map((_, i) => i);
    
    // 播放音效
    soundManager.playTaskComplete();
    
    if (task.badge) {
      const badge = BADGES.find(b => b.id === task.badge);
      if (badge && !badge.unlocked) {
        badge.unlocked = true;
        soundManager.playBadgeUnlock();
        confettiManager.start(2000);
        this.showToast(`🎉 解锁新徽章：${badge.name}`, 'success');
      }
    }
    
    // 检查升级
    const oldLevel = APP_DATA.currentLevel;
    this.updateLevel();
    if (APP_DATA.currentLevel > oldLevel) {
      soundManager.playLevelUp();
      confettiManager.start(3000);
      this.showToast(`🎊 升级到 LV.${APP_DATA.currentLevel}！`, 'success');
    }
    
    this.checkRewards();
    this.saveData();
    this.closeTaskModal();
    this.updateProgress();
    this.updateLevel();
    
    // 检查是否完成全部学习
    const allCompleted = LEARNING_TASKS.every(t => t.completed);
    if (allCompleted) {
      this.showCertificate();
    }
    
    if (this.selectedTask < LEARNING_TASKS.length - 1) {
      this.showToast('✅ 任务完成！继续下一个挑战！', 'success');
    } else {
      this.showToast('🎊 恭喜你完成全部学习！成为 AI 小达人！', 'success');
    }
    
    this.navigateTo('home');
  }

  // 显示毕业证书
  showCertificate() {
    const completedDate = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const dataUrl = certificateGenerator.generateCertificate(
      APP_DATA.childName,
      completedDate,
      BADGES
    );
    
    certificateGenerator.showCertificate(dataUrl);
    
    // 播放庆祝音效
    soundManager.playLevelUp();
    confettiManager.start(5000);
  }

  // 下载证书
  downloadCertificate(dataUrl) {
    certificateGenerator.downloadCertificate(dataUrl);
  }

  // 打印证书
  printCertificate(dataUrl) {
    certificateGenerator.printCertificate(dataUrl);
  }

  // 当前筛选和排序状态
  currentFilter = 'all';
  currentSort = 'default';
  
  // 初始化成就页面事件
  initAchievementsEvents() {
    // 筛选按钮事件
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.renderBadgesGrid();
      });
    });
    
    // 排序选择器事件
    const sortSelect = document.getElementById('badge-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.renderBadgesGrid();
      });
    }
  }
  
  // 日历相关
  currentCalendarDate = new Date();
  
  // 初始化日历
  initCalendar() {
    this.renderCalendar();
  }
  
  // 初始化知识库进度
  initKnowledgeProgress() {
    // 知识库页面已简化，不再显示进度栏
  }
  
  // 更新知识库进度（已简化，不再使用）
  updateKnowledgeProgress() {
    // 知识库页面已简化，不再显示进度栏
  }
  
  // 渲染日历
  renderCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;
    
    calendarDays.innerHTML = '';
    
    const year = this.currentCalendarDate.getFullYear();
    const month = this.currentCalendarDate.getMonth();
    
    // 更新标题
    document.getElementById('calendar-title').textContent = 
      `📅 ${year}年${month + 1}月 学习日历`;
    
    // 计算第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 计算起始位置（周一为第一天）
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;
    
    // 添加空白格
    for (let i = 0; i < startDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendarDays.appendChild(emptyDay);
    }
    
    // 添加日期
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // 计算当前应该解锁到哪一天
    const getCurrentDay = () => {
      for (let i = 0; i < LEARNING_TASKS.length; i++) {
        if (!LEARNING_TASKS[i].completed) {
          return LEARNING_TASKS[i].day;
        }
      }
      return LEARNING_TASKS.length;
    };
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      
      // 检查是否完成
      const task = LEARNING_TASKS.find(t => t.day === day);
      const isCompleted = task && task.completed;
      const isLocked = day > getCurrentDay();
      const isCurrent = (day === currentDay && month === currentMonth && year === currentYear);
      
      if (isCompleted) dayEl.classList.add('completed');
      if (isLocked) dayEl.classList.add('locked');
      if (isCurrent) dayEl.classList.add('current');
      
      dayEl.innerHTML = `
        <span class="calendar-day-number">${day}</span>
        ${isCompleted ? '<span class="calendar-day-status"></span>' : ''}
      `;
      
      dayEl.onclick = () => this.showDayDetail(day);
      calendarDays.appendChild(dayEl);
    }
    
    // 更新统计
    this.updateCalendarStats();
  }
  
  // 更新日历统计
  updateCalendarStats() {
    const totalDays = LEARNING_TASKS.length;
    const completedDays = LEARNING_TASKS.filter(t => t.completed).length;
    const streak = this.calculateStreak();
    const rate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    
    document.getElementById('stat-completed').textContent = `${completedDays}/${totalDays}`;
    document.getElementById('stat-streak').textContent = `${streak}天`;
    document.getElementById('stat-rate').textContent = `${rate}%`;
  }
  
  // 计算连续打卡
  calculateStreak() {
    let streak = 0;
    for (let i = 0; i < LEARNING_TASKS.length; i++) {
      if (LEARNING_TASKS[i].completed) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
  
  // 切换月份
  changeMonth(delta) {
    this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + delta);
    this.renderCalendar();
  }
  
  // 显示某天详情
  showDayDetail(day) {
    const task = LEARNING_TASKS.find(t => t.day === day);
    if (!task) return;
    
    const globalIndex = LEARNING_TASKS.findIndex(t => t.day === day);
    this.openTask(globalIndex);
  }
  
  // 渲染成就
  renderAchievements() {
    // 更新统计数据
    this.updateAchievementsStats();
    
    // 渲染徽章
    this.renderBadgesGrid();
    
    // 渲染奖励
    this.renderRewardsList();
  }
  
  // 更新成就统计
  updateAchievementsStats() {
    const allBadges = [...BADGES, ...(typeof WEEK2_BADGES !== 'undefined' ? WEEK2_BADGES : [])];
    const unlockedBadges = allBadges.filter(b => b.unlocked).length;
    const totalBadges = allBadges.length;
    
    const unlockedRewards = REWARDS.filter(r => r.unlocked).length;
    const totalRewards = REWARDS.length;
    
    const completionRate = totalBadges > 0 ? Math.round((unlockedBadges / totalBadges) * 100) : 0;
    
    // 更新数字
    document.getElementById('badge-unlocked').textContent = unlockedBadges;
    document.getElementById('badge-total').textContent = totalBadges;
    document.getElementById('reward-unlocked').textContent = unlockedRewards;
    document.getElementById('reward-total').textContent = totalRewards;
    document.getElementById('completion-rate').textContent = completionRate;
    
    // 更新进度条
    const progressFill = document.getElementById('achievements-progress-fill');
    const progressText = document.getElementById('achievements-progress-text');
    progressFill.style.width = `${completionRate}%`;
    progressText.textContent = `已解锁 ${unlockedBadges}/${totalBadges}`;
  }
  
  // 渲染徽章网格
  renderBadgesGrid() {
    const container = document.getElementById('badges-grid');
    container.innerHTML = '';
    
    let allBadges = [...BADGES, ...(typeof WEEK2_BADGES !== 'undefined' ? WEEK2_BADGES : [])];
    
    // 筛选
    if (this.currentFilter === 'unlocked') {
      allBadges = allBadges.filter(b => b.unlocked);
    } else if (this.currentFilter === 'locked') {
      allBadges = allBadges.filter(b => !b.unlocked);
    }
    
    // 排序
    if (this.currentSort === 'rarity') {
      const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
      allBadges.sort((a, b) => (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0));
    } else if (this.currentSort === 'name') {
      allBadges.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    }
    
    allBadges.forEach(badge => {
      const card = this.createBadgeCard(badge);
      container.appendChild(card);
    });
  }
  
  // 创建徽章卡片
  createBadgeCard(badge) {
    const card = document.createElement('div');
    card.className = `badge-card ${badge.unlocked ? '' : 'locked'}`;
    card.setAttribute('data-rarity', badge.rarity || 'common');
    
    const rarityLabels = {
      common: '普通',
      uncommon: '稀有',
      rare: '史诗',
      epic: '传说',
      legendary: '神话'
    };
    
    const rarityStars = {
      common: '⭐',
      uncommon: '⭐⭐',
      rare: '⭐⭐⭐',
      epic: '⭐⭐⭐⭐',
      legendary: '⭐⭐⭐⭐⭐'
    };
    
    card.innerHTML = `
      <div class="badge-icon-wrapper">
        <div class="badge-icon">${badge.icon}</div>
        ${!badge.unlocked ? '<div class="badge-lock">🔒</div>' : ''}
      </div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-desc">${badge.description}</div>
      ${badge.unlocked ? `
        <div class="rarity-indicator">
          <span class="rarity-stars">${rarityStars[badge.rarity] || rarityStars.common}</span>
          <span class="rarity-label">${rarityLabels[badge.rarity] || badge.rarity}</span>
        </div>
      ` : `
        <div class="badge-progress-hint">完成更多任务来解锁</div>
      `}
    `;
    
    return card;
  }
  
  // 渲染奖励列表
  renderRewardsList() {
    const container = document.getElementById('rewards-list');
    container.innerHTML = '';
    
    REWARDS.forEach(reward => {
      const item = document.createElement('div');
      item.className = `reward-item ${reward.unlocked ? 'unlocked' : 'locked'}`;
      
      item.innerHTML = `
        <div class="reward-icon-wrapper">
          <div class="reward-icon">${reward.icon}</div>
        </div>
        <div class="reward-content">
          <h4 class="reward-name">${reward.name}</h4>
          <p class="reward-desc">${reward.description}</p>
          <div class="reward-requirement-badge">
            ${reward.unlocked ? '✅ 已解锁' : `🔒 ${reward.requirement}`}
          </div>
        </div>
        ${reward.unlocked ? '<div class="reward-checkmark">✓</div>' : ''}
      `;
      
      container.appendChild(item);
    });
  }

  // 检查奖励
  checkRewards() {
    // 检查各段位任务完成情况
    const bronzeCompleted = LEARNING_TASKS.filter(t => t.stage === 'bronze' && t.completed).length;
    const silverCompleted = LEARNING_TASKS.filter(t => t.stage === 'silver' && t.completed).length;
    const goldCompleted = LEARNING_TASKS.filter(t => t.stage === 'gold' && t.completed).length;
    const diamondCompleted = LEARNING_TASKS.filter(t => t.stage === 'diamond' && t.completed).length;
    
    REWARDS.forEach(reward => {
      if (!reward.unlocked) {
        let shouldUnlock = false;
        
        // 青铜证书：完成 3 个青铜任务
        if (reward.id === 'bronze_certificate' && bronzeCompleted >= 3) {
          shouldUnlock = true;
        }
        // 白银证书：完成 7 个白银任务
        else if (reward.id === 'silver_certificate' && silverCompleted >= 7) {
          shouldUnlock = true;
        }
        // 黄金证书：完成 7 个黄金任务
        else if (reward.id === 'gold_certificate' && goldCompleted >= 7) {
          shouldUnlock = true;
        }
        // 钻石证书：完成 4 个钻石任务
        else if (reward.id === 'diamond_certificate' && diamondCompleted >= 4) {
          shouldUnlock = true;
        }
        // 毕业证书：完成全部 21 个任务
        else if (reward.id === 'master_certificate' && LEARNING_TASKS.every(t => t.completed)) {
          shouldUnlock = true;
        }
        
        if (shouldUnlock) {
          reward.unlocked = true;
          this.showToast(`🎁 解锁新奖励：${reward.name}`, 'success');
        }
      }
    });
  }

  // 更新任务选择
  updateWorkTaskSelect() {
    const select = document.getElementById('work-task');
    if (!select) return;
    
    select.innerHTML = '<option value="">选择关联的任务（可选）</option>';
    
    LEARNING_TASKS.forEach(task => {
      const option = document.createElement('option');
      option.value = task.day;
      option.textContent = `第 ${task.day} 天：${task.title}`;
      select.appendChild(option);
    });
  }

  // 当前选中的作品图片（Base64）
  currentWorkImage = null;

  // 显示添加作品模态框
  showAddWorkModal() {
    console.log('📸 打开作品模态框...');
    console.log('DOM 中的所有 work 相关 ID:', Array.from(document.querySelectorAll('[id]')).map(el => el.id).filter(id => id.includes('work')));
    
    const workModal = document.getElementById('work-modal');
    console.log('模态框元素:', workModal);
    
    if (!workModal) {
      console.error('❌ 作品模态框不存在，创建新模态框');
      this.createAndShowWorkModal();
      return;
    }
    
    console.log('✅ 找到模态框');
    
    // 重置表单
    const titleInput = document.getElementById('work-title');
    const platformSelect = document.getElementById('work-platform');
    const descTextarea = document.getElementById('work-description');
    const taskSelect = document.getElementById('work-task');
    
    if (titleInput) titleInput.value = '';
    if (platformSelect) platformSelect.value = '豆包';
    if (descTextarea) descTextarea.value = '';
    if (taskSelect) {
      taskSelect.value = '';
      this.updateWorkTaskSelect();
    }
    
    this.currentWorkImage = null;
    this.hideWorkImagePreview();
    
    // 显示模态框 - 同时设置 display 和 class
    workModal.style.display = 'flex';
    workModal.classList.add('active');
    console.log('✅ 作品模态框已打开，display:', workModal.style.display);
  }
  
  // 创建作品模态框（备用方案）
  createAndShowWorkModal() {
    console.log('🔨 创建作品模态框...');
    const modal = document.createElement('div');
    modal.id = 'work-modal';
    modal.className = 'modal active';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="app.closeWorkModal()">×</button>
        <div class="modal-header">
          <h3>📸 添加新作品</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>作品标题</label>
            <input type="text" id="work-title" placeholder="给作品起个名字">
          </div>
          <div class="form-group">
            <label>使用的 AI 平台</label>
            <select id="work-platform">
              <option value="豆包">豆包</option>
              <option value="DeepSeek">DeepSeek</option>
              <option value="通义千问">通义千问</option>
              <option value="Kimi">Kimi</option>
              <option value="文心一言">文心一言</option>
              <option value="智谱清言">智谱清言</option>
              <option value="腾讯元宝">腾讯元宝</option>
            </select>
          </div>
          <div class="form-group">
            <label>关联任务（可选）</label>
            <select id="work-task">
              <option value="">选择关联的任务</option>
            </select>
          </div>
          <div class="form-group">
            <label>作品描述</label>
            <textarea id="work-description" placeholder="描述一下你的作品..." rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="app.closeWorkModal()">取消</button>
          <button class="btn-primary" onclick="app.saveWork()">💾 保存作品</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    console.log('✅ 作品模态框已创建并显示');
    this.updateWorkTaskSelect();
  }

  // 关闭作品模态框
  closeWorkModal() {
    const workModal = document.getElementById('work-modal');
    if (workModal) {
      workModal.style.display = 'none';
      workModal.classList.remove('active');
    }
    this.currentWorkImage = null;
    this.hideWorkImagePreview();
  }

  // 隐藏作品图片预览
  hideWorkImagePreview() {
    const preview = document.getElementById('work-image-preview');
    if (preview) {
      preview.style.display = 'none';
    }
  }

  // 显示作品图片预览
  showWorkImagePreview(imageSrc) {
    const preview = document.getElementById('work-image-preview');
    const previewImg = document.getElementById('work-image-preview-img');
    if (preview && previewImg) {
      previewImg.src = imageSrc;
      preview.style.display = 'block';
    }
  }

  // 处理作品图片选择
  handleWorkImageSelect(input) {
    const file = input.files[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      this.showToast('❌ 请选择图片文件', 'error');
      input.value = '';
      return;
    }
    
    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('❌ 图片大小不能超过 5MB', 'error');
      input.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentWorkImage = e.target.result;
      this.showWorkImagePreview(e.target.result);
    };
    reader.onerror = () => {
      this.showToast('❌ 读取图片失败', 'error');
    };
    reader.readAsDataURL(file);
  }

  // 移除作品图片
  removeWorkImage() {
    this.currentWorkImage = null;
    this.hideWorkImagePreview();
    document.getElementById('work-image-input').value = '';
  }

  // 保存作品
  saveWork() {
    const title = document.getElementById('work-title').value.trim();
    const platform = document.getElementById('work-platform').value;
    const description = document.getElementById('work-description').value.trim();
    const task = document.getElementById('work-task').value;
    
    // 输入验证
    if (!title) {
      this.showToast('❌ 请输入作品标题', 'error');
      return;
    }
    
    if (title.length > 50) {
      this.showToast('❌ 作品标题不能超过 50 个字符', 'error');
      return;
    }
    
    if (description && description.length > 200) {
      this.showToast('❌ 作品描述不能超过 200 个字符', 'error');
      return;
    }
    
    const workData = {
      title,
      platform,
      description,
      task,
      createdAt: new Date().toISOString()
    };
    
    // 添加图片数据（如果有）
    if (this.currentWorkImage) {
      workData.image = this.currentWorkImage;
    }
    
    APP_DATA.works.push(workData);
    
    if (!APP_DATA.visitedPlatforms.includes(platform)) {
      APP_DATA.visitedPlatforms.push(platform);
    }
    
    this.saveData();
    this.closeWorkModal();
    this.renderGallery();
    this.checkRewards();
    this.showToast('✅ 作品已保存！', 'success');
    
    // 跳转到首页（navigateTo 会自动调用 renderTodayTask）
    setTimeout(() => {
      this.navigateTo('home');
    }, 300);
  }

  // 渲染作品墙（支持图片显示）
  renderGallery() {
    const container = document.getElementById('gallery-grid');
    container.innerHTML = '';
    
    if (APP_DATA.works.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
          <div style="font-size: 64px; margin-bottom: 16px;">📸</div>
          <h3 style="color: var(--black);">还没有作品</h3>
          <p>完成任务后添加你的作品到这里吧！</p>
        </div>
      `;
      return;
    }
    
    APP_DATA.works.forEach((work, index) => {
      const card = document.createElement('div');
      card.className = 'work-card';
      
      const platformIcons = {
        '豆包': '🎨', 'DeepSeek': '💻', '通义千问': '📝', 'Kimi': '📚',
        '文心一言': '🔍', '智谱清言': '🎓', '腾讯元宝': '💎'
      };
      
      // 如果有图片，显示图片；否则显示平台图标
      const imageHtml = work.image 
        ? `<img src="${work.image}" alt="${work.title}" style="width: 100%; height: 100%; object-fit: cover;">`
        : `<div class="work-image">${platformIcons[work.platform] || '✨'}</div>`;
      
      card.innerHTML = `
        <div class="work-image-container" style="height: 200px; overflow: hidden; border-radius: 12px 12px 0 0; background: #f0f0f0;">
          ${imageHtml}
        </div>
        <div class="work-content" style="padding: 16px;">
          <div class="work-title">${work.title}</div>
          <div class="work-platform">${work.platform}</div>
          <div class="work-description">${work.description || ''}</div>
        </div>
        <div style="padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--light-gray);">
          <span style="font-size: 12px; color: var(--text-secondary);">${new Date(work.createdAt).toLocaleDateString('zh-CN')}</span>
          <button class="btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="app.deleteWork(${index})">🗑️ 删除</button>
        </div>
      `;
      container.appendChild(card);
    });
    
    this.updateWorkTaskSelect();
  }

  // 删除作品
  deleteWork(index) {
    if (confirm('确定要删除这个作品吗？')) {
      APP_DATA.works.splice(index, 1);
      this.saveData();
      this.renderGallery();
      this.showToast('✅ 作品已删除', 'success');
    }
  }

  // 渲染快捷入口（AI 平台）
  renderPlatforms() {
    const container = document.getElementById('platform-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 只显示前 6 个平台作为快捷入口
    const platformsToShow = AI_PLATFORMS.slice(0, 6);
    
    platformsToShow.forEach(platform => {
      const card = document.createElement('div');
      card.className = 'platform-card';
      card.style.cursor = 'pointer';
      card.onclick = () => this.openPlatform(platform.id);
      
      // 判断是图片路径还是 emoji
      const isImage = platform.icon.includes('.') && !platform.icon.startsWith('🎵');
      const iconVersion = '?v=' + Date.now(); // 添加时间戳防止缓存
      const iconHtml = isImage 
        ? `<img src="${platform.icon}${iconVersion}" alt="${platform.name}" style="width: 48px; height: 48px; object-fit: contain; margin-bottom: 8px; border-radius: 8px; background: #fff; padding: 4px;">`
        : `<div style="font-size: 32px; margin-bottom: 8px;">${platform.icon}</div>`;
      
      card.innerHTML = `
        ${iconHtml}
        <div style="font-weight: 600; margin-bottom: 4px;">${platform.name}</div>
        <div style="font-size: 12px; opacity: 0.7;">${platform.company}</div>
      `;
      
      container.appendChild(card);
    });
  }

  // 显示 AI 平台
  showAIPlatforms() {
    const container = document.getElementById('platforms-list');
    container.innerHTML = '';
    
    AI_PLATFORMS.forEach(platform => {
      const item = document.createElement('div');
      item.className = 'platform-item';
      item.style.borderLeftColor = platform.color;
      
      const strengthsHtml = platform.strengths.map(s => `<span>${s}</span>`).join('');
      const isVisited = APP_DATA.visitedPlatforms.includes(platform.name);
      
      // 判断是图片路径还是 emoji
      const isImage = platform.icon.includes('.') && !platform.icon.startsWith('🎵');
      const iconHtml = isImage
        ? `<img src="${platform.icon}" alt="${platform.name}" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px; border-radius: 4px; background: #fff; padding: 2px;">`
        : `${platform.icon} `;
      
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <h4 style="margin: 0;">${iconHtml}${platform.name} ${isVisited ? '<span style="font-size: 12px; color: var(--success); margin-left: 8px;">✅ 已体验</span>' : ''}</h4>
          <button class="btn-primary" style="padding: 6px 12px; font-size: 13px;" onclick="app.openPlatform('${platform.id}')">
            访问网站 →
          </button>
        </div>
        <div class="company" style="margin-top: 8px;">${platform.company} · ${platform.free ? '<span style="color: var(--success);">免费</span>' : '<span style="color: var(--warning);">付费</span>'} · 推荐年龄：${platform.ageRecommend}</div>
        <div class="strengths" style="margin-top: 12px;">${strengthsHtml}</div>
        <div class="uses" style="margin-top: 12px;"><strong>适用：</strong>${platform.uses}</div>
        <p style="margin-top: 16px; color: var(--text-secondary); line-height: 1.6;">${platform.description}</p>
        ${platform.bestFor ? `<div style="margin-top: 12px;"><strong>最擅长：</strong>${platform.bestFor.join('、')}</div>` : ''}
      `;
      container.appendChild(item);
    });
    
    document.getElementById('platform-modal').classList.add('active');
  }

  // 关闭平台模态框
  closePlatformModal() {
    document.getElementById('platform-modal').classList.remove('active');
  }

  // 渲染家长中心（支持多孩子数据隔离）
  renderParents() {
    // 获取当前孩子
    const currentChild = this.multiChild?.getCurrentChild();
    
    let startDate = '-';
    let lastActive = '-';
    let completedDays = 0;
    let completionRate = 0;
    
    if (currentChild) {
      // 使用当前孩子的数据
      const childStartDate = this.multiChild.getChildStartDate(currentChild);
      startDate = childStartDate ? new Date(childStartDate).toLocaleDateString('zh-CN') : '-';
      
      const childLastActive = this.multiChild.getChildLastActiveDate(currentChild);
      lastActive = childLastActive ? new Date(childLastActive).toLocaleString('zh-CN') : '-';
      
      completedDays = this.multiChild.getChildCompletedTasks(currentChild);
      completionRate = this.multiChild.getChildCompletionRate(currentChild);
    } else {
      // 兼容旧数据
      startDate = APP_DATA.startDate ? new Date(APP_DATA.startDate).toLocaleDateString('zh-CN') : '-';
      lastActive = APP_DATA.lastActiveDate ? new Date(APP_DATA.lastActiveDate).toLocaleString('zh-CN') : '-';
      completedDays = LEARNING_TASKS.filter(t => t.completed).length;
      completionRate = LEARNING_TASKS.length > 0 ? Math.round((completedDays / LEARNING_TASKS.length) * 100) : 0;
    }
    
    document.getElementById('parent-start-date').textContent = startDate;
    document.getElementById('parent-study-days').textContent = `${completedDays}天`;
    document.getElementById('parent-completion-rate').textContent = `${completionRate}%`;
    document.getElementById('parent-last-active').textContent = lastActive;
    
    // 渲染孩子选择器
    if (this.multiChild) {
      this.multiChild.renderChildSelector();
    }
    
    // 渲染能力雷达图（自动使用当前孩子数据）
    this.renderAbilityRadar();
    // 生成 AI 评语（自动使用当前孩子数据）
    this.generateAIComment();
  }

  // 切换热力图显示
  toggleHeatmap() {
    const container = document.getElementById('heatmap-container');
    if (!container) {
      console.error('❌ 未找到 heatmap-container 元素');
      this.showToast('❌ 热力图容器未找到', 'error');
      return;
    }
    
    if (container.style.display === 'none' || !container.style.display) {
      container.style.display = 'block';
      
      // 显示加载提示
      container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">🔥 热力图加载中...</div>';
      
      if (!this.heatmap) {
        this.initHeatmap();
      }
      
      // 延迟渲染以确保容器已显示
      setTimeout(() => {
        try {
          this.heatmap.render('heatmap-container');
          console.log('✅ 热力图渲染完成');
        } catch (e) {
          console.error('❌ 渲染热力图失败:', e);
          container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--error);">❌ 热力图渲染失败，请刷新页面重试</div>';
        }
      }, 200);
      
      this.showToast('🔥 热力图已加载', 'success');
    } else {
      container.style.display = 'none';
    }
  }

  // 切换孩子
  switchChild(childId) {
    if (this.multiChild) {
      this.multiChild.switchChild(childId);
      this.renderParents();
      this.updateWelcome();
      this.updateProgress();
      this.updateLevel();
      this.renderGallery();
      this.showToast('✅ 已切换孩子', 'success');
    }
  }

  // 重置进度
  resetProgress() {
    if (confirm('⚠️ 确定要重置所有进度吗？这个操作不可恢复！')) {
      localStorage.removeItem('aiExplorerData');
      location.reload();
    }
  }

  // 导出数据
  exportData() {
    try {
      const data = localStorage.getItem('aiExplorerData');
      if (!data) {
        this.showToast('❌ 暂无可导出数据', 'error');
        return;
      }
      
      // 格式化和美化 JSON
      const formattedData = JSON.stringify(JSON.parse(data), null, 2);
      const blob = new Blob([formattedData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = `ai-explorer-${new Date().toISOString().split('T')[0]}.json`;
      a.download = filename;
      document.body.appendChild(a);
      
      // 触发下载
      a.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('✅ 数据导出成功:', filename);
      this.showToast('✅ 数据已导出到 ' + filename, 'success');
    } catch (e) {
      console.error('❌ 导出数据失败:', e);
      this.showToast('❌ 导出失败：' + e.message, 'error');
    }
  }

  // 显示提示
  showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // 切换音效
  toggleSound() {
    soundManager.enabled = !soundManager.enabled;
    const btn = document.getElementById('sound-btn');
    if (btn) {
      btn.textContent = soundManager.enabled ? '🔊' : '🔇';
    }
    this.showToast(soundManager.enabled ? '音效已开启' : '音效已关闭');
  }

  // 切换主题
  switchTheme(themeName, { silent = false } = {}) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('aiExplorerTheme', themeName);
    
    // 更新按钮状态
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
    
    // 如果是星空主题，创建星星效果
    if (themeName === 'space') {
      setTimeout(() => this.createStars(), 100);
    } else {
      // 移除星星容器
      const existing = document.querySelector('.stars-container');
      if (existing) existing.remove();
    }
    
    if (!silent) {
      this.showToast(`已切换到${this.getThemeName(themeName)}主题`);
    }
  }

  // 获取主题名称
  getThemeName(theme) {
    const names = {
      'coral': '珊瑚橙',
      'mint': '薄荷绿',
      'lavender': '薰衣草紫',
      'sunset': '日落橙',
      'ocean': '海洋蓝',
      'space': '🌌 星空宇宙'
    };
    return names[theme] || theme;
  }

  // 加载保存的主题
  loadTheme() {
    const savedTheme = localStorage.getItem('aiExplorerTheme') || 'coral';
    this.switchTheme(savedTheme, { silent: true });
  }

  // 创建星空背景效果
  createStars() {
    // 移除已存在的星星容器
    const existing = document.querySelector('.stars-container');
    if (existing) existing.remove();

    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme !== 'space') return; // 只在星空主题下显示

    const container = document.createElement('div');
    container.className = 'stars-container';

    // 创建 100 颗星星
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      const size = Math.random() * 3 + 1;
      star.style.width = star.style.height = size + 'px';
      star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
      star.style.setProperty('--opacity-start', (Math.random() * 0.5 + 0.2));
      star.style.setProperty('--opacity-end', (Math.random() * 0.7 + 0.8));
      star.style.animationDelay = Math.random() * 3 + 's';
      container.appendChild(star);
    }

    // 创建 3 颗流星
    for (let i = 0; i < 3; i++) {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      shootingStar.style.left = (Math.random() * 50 + 25) + '%';
      shootingStar.style.top = (Math.random() * 30 + 10) + '%';
      shootingStar.style.animationDelay = (Math.random() * 8 + i * 3) + 's';
      container.appendChild(shootingStar);
    }

    document.body.appendChild(container);
  }

  // 打开 AI 平台网站
  openPlatform(platformId) {
    const platform = AI_PLATFORMS.find(p => p.id === platformId);
    if (platform && platform.url) {
      soundManager.playClick();
      window.open(platform.url, '_blank');
      
      // 记录访问
      if (!APP_DATA.visitedPlatforms.includes(platform.name)) {
        APP_DATA.visitedPlatforms.push(platform.name);
        this.saveData();
      }
    }
  }

  // ===== 能力成长雷达图功能 =====

  // 能力维度定义
  getAbilityDimensions() {
    return [
      { id: 'logic', name: '逻辑思维', icon: '🧠', color: '#6C5CE7', maxScore: 100 },
      { id: 'creativity', name: '创意表达', icon: '🎨', color: '#FF7675', maxScore: 100 },
      { id: 'research', name: '信息检索', icon: '🔍', color: '#00B894', maxScore: 100 },
      { id: 'safety', name: '安全认知', icon: '🛡️', color: '#FDCB6E', maxScore: 100 },
      { id: 'focus', name: '专注力', icon: '⏱️', color: '#74B9FF', maxScore: 100 }
    ];
  }

  // 计算各维度得分
  calculateAbilityScores() {
    const scores = {
      logic: 0,
      creativity: 0,
      research: 0,
      safety: 0,
      focus: 0
    };

    const completedTasks = LEARNING_TASKS.filter(t => t.completed);
    const totalTasks = LEARNING_TASKS.length;

    if (completedTasks.length === 0) {
      return scores;
    }

    // 辅助函数：计算任务完成度得分
    const calculateTaskScore = (taskIndex) => {
      const task = LEARNING_TASKS[taskIndex];
      if (!task || !task.completed) return 0;
      const completedCases = task.completedCases?.length || 0;
      const totalCases = task.cases?.length || 1;
      return Math.round((completedCases / totalCases) * 100);
    };

    // 辅助函数：计算多个任务的平均得分
    const calculateAverageScore = (taskIndices) => {
      let totalScore = 0;
      let count = 0;
      taskIndices.forEach(index => {
        const task = LEARNING_TASKS[index];
        if (task && task.completed) {
          const completedCases = task.completedCases?.length || 0;
          const totalCases = task.cases?.length || 1;
          totalScore += (completedCases / totalCases) * 100;
          count++;
        }
      });
      return count > 0 ? Math.round(totalScore / count) : 0;
    };

    // 逻辑思维 - 基于编程/数学类任务（第 3 天 DeepSeek、第 9 天数据分析）
    scores.logic = calculateAverageScore([2, 8]); // 索引 2=第 3 天，索引 8=第 9 天

    // 创意表达 - 基于创作类任务（第 2 天豆包、第 6 天综合挑战、第 8 天 AI 绘画、第 10 天创意写作）
    scores.creativity = calculateAverageScore([1, 5, 7, 9]);

    // 信息检索 - 基于搜索类任务（第 1 天认识 AI、第 5 天文心一言/元宝、第 11 天科学探索）
    scores.research = calculateAverageScore([0, 4, 10]);

    // 安全认知 - 基于伦理问答（第 1 天和第 7 天的安全相关内容）
    scores.safety = calculateAverageScore([0, 6]);

    // 专注力 - 基于任务完成情况和连击数据
    const completionRate = completedTasks.length / totalTasks;
    const streakBonus = Math.min(APP_DATA.streak || 0, 30); // 连击奖励最多 30 分
    scores.focus = Math.round(completionRate * 70 + streakBonus);

    return scores;
  }

  // 绘制雷达图
  drawRadarChart(canvasId, scores, showLabels = true) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dimensions = this.getAbilityDimensions();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 获取当前主题
    const isSpaceTheme = document.documentElement.getAttribute('data-theme') === 'space';
    const gridColor = isSpaceTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isSpaceTheme ? '#ffffff' : '#333333';

    // 绘制背景网格（5 个同心圆）
    for (let i = 1; i <= 5; i++) {
      const r = (radius / 5) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 绘制维度轴线和标签
    const angleStep = (Math.PI * 2) / dimensions.length;
    const points = [];

    dimensions.forEach((dim, index) => {
      const angle = angleStep * index - Math.PI / 2; // 从顶部开始
      const score = scores[dim.id] || 0;
      const pointRadius = (score / 100) * radius;

      const x = centerX + Math.cos(angle) * pointRadius;
      const y = centerY + Math.sin(angle) * pointRadius;
      points.push({ x, y, score, dim });

      // 绘制轴线
      const axisX = centerX + Math.cos(angle) * radius;
      const axisY = centerY + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(axisX, axisY);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 绘制维度标签
      const labelX = centerX + Math.cos(angle) * (radius + 25);
      const labelY = centerY + Math.sin(angle) * (radius + 25);
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "SF Pro Text"';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dim.icon + ' ' + dim.name, labelX, labelY);
    });

    // 绘制填充区域
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();

    // 创建渐变色
    const gradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    gradient.addColorStop(0, 'rgba(108, 92, 231, 0.3)');
    gradient.addColorStop(0.5, 'rgba(162, 155, 254, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 118, 117, 0.3)');

    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制边框
    ctx.strokeStyle = 'rgba(108, 92, 231, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制数据点
    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = point.dim.color;
      ctx.fill();
      ctx.strokeStyle = isSpaceTheme ? '#ffffff' : '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 显示分数
      if (showLabels) {
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "SF Pro Text"';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(point.score, point.x, point.y - 10);
      }
    });
  }

  // 渲染能力雷达图
  renderAbilityRadar() {
    const scores = this.calculateAbilityScores();
    this.drawRadarChart('radar-chart', scores);

    // 渲染各维度统计
    const dimensions = this.getAbilityDimensions();
    const statsContainer = document.getElementById('ability-stats');
    if (statsContainer) {
      statsContainer.innerHTML = dimensions.map(dim => {
        const score = scores[dim.id] || 0;
        const percentage = (score / dim.maxScore) * 100;
        return `
          <div class="ability-stat-item">
            <div class="ability-stat-icon">${dim.icon}</div>
            <div class="ability-stat-name">${dim.name}</div>
            <div class="ability-stat-value">${score}</div>
            <div class="ability-stat-bar">
              <div class="ability-stat-fill" style="width: ${percentage}%; background: ${dim.color}"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 保存当前能力数据用于对比
    APP_DATA.currentAbilityScores = scores;
    APP_DATA.lastAbilityUpdate = new Date().toISOString();
  }

  // 生成模拟的历史数据（用于月度对比）
  getPreviousMonthScores() {
    const currentScores = this.calculateAbilityScores();
    const previousScores = {};
    
    // 模拟上月数据（略低于当前）
    Object.keys(currentScores).forEach(key => {
      const current = currentScores[key];
      const decrease = Math.floor(Math.random() * 15) + 5; // 减少 5-20 分
      previousScores[key] = Math.max(0, current - decrease);
    });

    return previousScores;
  }

  // 切换月度对比视图
  toggleMonthComparison() {
    const panel = document.getElementById('month-comparison-panel');
    if (!panel) return;

    if (panel.style.display === 'none' || !panel.style.display) {
      panel.style.display = 'block';
      
      const currentScores = APP_DATA.currentAbilityScores || this.calculateAbilityScores();
      const previousScores = this.getPreviousMonthScores();
      
      // 绘制对比雷达图
      this.drawComparisonRadar(previousScores, currentScores);
      
      // 生成对比统计
      this.renderComparisonStats(previousScores, currentScores);
    } else {
      panel.style.display = 'none';
    }
  }

  // 绘制对比雷达图
  drawComparisonRadar(previousScores, currentScores) {
    const canvas = document.getElementById('comparison-radar-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dimensions = this.getAbilityDimensions();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isSpaceTheme = document.documentElement.getAttribute('data-theme') === 'space';
    const gridColor = isSpaceTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';

    // 绘制背景网格
    for (let i = 1; i <= 5; i++) {
      const r = (radius / 5) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const angleStep = (Math.PI * 2) / dimensions.length;

    // 绘制上月数据（灰色虚线）
    ctx.beginPath();
    dimensions.forEach((dim, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const score = previousScores[dim.id] || 0;
      const x = centerX + Math.cos(angle) * (score / 100) * radius;
      const y = centerY + Math.sin(angle) * (score / 100) * radius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 绘制本月数据（彩色实线）
    ctx.beginPath();
    dimensions.forEach((dim, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const score = currentScores[dim.id] || 0;
      const x = centerX + Math.cos(angle) * (score / 100) * radius;
      const y = centerY + Math.sin(angle) * (score / 100) * radius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(108, 92, 231, 0.9)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 填充本月区域
    ctx.fillStyle = 'rgba(108, 92, 231, 0.2)';
    ctx.fill();

    // 图例
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "SF Pro Text"';
    ctx.fillStyle = isSpaceTheme ? '#ffffff' : '#333333';
    ctx.textAlign = 'left';
    ctx.fillText('上月', 20, 25);
    ctx.fillStyle = 'rgba(108, 92, 231, 0.9)';
    ctx.fillText('本月', 70, 25);
  }

  // 渲染对比统计
  renderComparisonStats(previousScores, currentScores) {
    const container = document.getElementById('comparison-stats');
    if (!container) return;

    const dimensions = this.getAbilityDimensions();
    container.innerHTML = dimensions.map(dim => {
      const prev = previousScores[dim.id] || 0;
      const curr = currentScores[dim.id] || 0;
      const delta = curr - prev;
      const deltaClass = delta >= 0 ? 'positive' : 'negative';
      const deltaText = delta >= 0 ? `+${delta}` : delta;

      return `
        <div class="comparison-item">
          <span class="comparison-label">${dim.icon} ${dim.name}</span>
          <div class="comparison-values">
            <span class="comparison-old">${prev}</span>
            <span class="comparison-new">${curr}</span>
            <span class="comparison-delta ${deltaClass}">${deltaText}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // 显示个性化推荐
  showRecommendations() {
    console.log('🔍 点击个性化推荐按钮');
    const panel = document.getElementById('recommendation-panel');
    if (!panel) {
      console.error('❌ 未找到 recommendation-panel 元素');
      return;
    }

    console.log('当前面板显示状态:', panel.style.display);
    
    if (panel.style.display === 'none' || !panel.style.display) {
      console.log('显示推荐面板');
      panel.style.display = 'block';
      this.generateRecommendations();
      this.showToast('💡 已生成个性化推荐', 'success');
    } else {
      console.log('隐藏推荐面板');
      panel.style.display = 'none';
    }
  }

  // 生成个性化推荐
  generateRecommendations() {
    const scores = this.calculateAbilityScores();
    const dimensions = this.getAbilityDimensions();
    const container = document.getElementById('recommendation-list');
    if (!container) return;

    // 找出短板（得分低于 60 的维度）
    const weakAreas = dimensions
      .filter(dim => (scores[dim.id] || 0) < 60)
      .sort((a, b) => (scores[a.id] || 0) - (scores[b.id] || 0));

    const recommendations = {
      logic: {
        icon: '🧩',
        title: '逻辑思维训练',
        desc: '建议完成第 3 天 DeepSeek 编程任务，尝试解决更多数学推理问题',
        action: '开始编程练习'
      },
      creativity: {
        icon: '🎨',
        title: '创意表达提升',
        desc: '多使用豆包进行故事创作和图片生成，尝试不同的创意主题',
        action: '开始创意任务'
      },
      research: {
        icon: '🔍',
        title: '信息检索练习',
        desc: '完成第 5 天信息搜索任务，学习如何高效查找和验证信息',
        action: '开始搜索练习'
      },
      safety: {
        icon: '🛡️',
        title: '安全认知加强',
        desc: '复习第 1 天和第 7 天的 AI 安全内容，制定个人使用公约',
        action: '学习安全知识'
      },
      focus: {
        icon: '⏱️',
        title: '专注力培养',
        desc: '保持每日学习连击，每次任务专注完成所有小案例',
        action: '继续每日任务'
      }
    };

    if (weakAreas.length === 0) {
      // 没有明显短板，给出进阶建议
      container.innerHTML = `
        <div class="recommendation-item" style="border-left-color: #34c759;">
          <div class="recommendation-header">
            <span class="recommendation-icon">🌟</span>
            <span class="recommendation-title">表现优秀！</span>
          </div>
          <p class="recommendation-desc">
            孩子在各维度都表现不错！建议尝试第 6 天的综合挑战项目，
            进一步提升 AI 综合应用能力。也可以探索更多 AI 平台，拓宽视野。
          </p>
        </div>
      `;
    } else {
      container.innerHTML = weakAreas.slice(0, 3).map(area => {
        const rec = recommendations[area.id];
        return `
          <div class="recommendation-item">
            <div class="recommendation-header">
              <span class="recommendation-icon">${rec.icon}</span>
              <span class="recommendation-title">${rec.title}（当前得分：${scores[area.id]}）</span>
            </div>
            <p class="recommendation-desc">${rec.desc}</p>
            <button class="recommendation-action" onclick="app.navigateTo('tasks')">${rec.action}</button>
          </div>
        `;
      }).join('');
    }
  }

  // 渲染知识库页面
  renderKnowledge() {
    const container = document.getElementById('knowledge-preview');
    if (!container) return;
    
    // 更新知识库卡片进度显示
    if (this.knowledge && this.knowledge.updateKnowledgeCardsProgress) {
      setTimeout(() => this.knowledge.updateKnowledgeCardsProgress(), 100);
    }

    const resources = this.knowledge.resources;
    const terms = this.knowledge.terms;
    const platforms = this.knowledge.platforms;
    
    // 计算总数
    const totalTerms = terms.reduce((sum, cat) => sum + cat.terms.length, 0);
    const totalPlatforms = platforms.reduce((sum, cat) => sum + cat.platforms.length, 0);
    
    // 获取学习进度
    const progress = this.knowledge.getLearningProgress();
    
    container.innerHTML = `
      <!-- 快捷入口卡片 - 与任务页面卡片风格一致 -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px;">
        <div class="knowledge-card" style="padding: 24px; background: var(--card-bg); border-radius: 20px; border: var(--card-border); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--glow-effect), 0 12px 48px rgba(0,0,0,0.15)'" onmouseleave="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'" onclick="showKnowledgeBase()">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
            <div style="font-size: 48px;">📖</div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 18px; color: var(--text-primary); margin-bottom: 4px;">学习资源</div>
              <div style="font-size: 13px; color: var(--text-secondary);">提升 AI 技能</div>
            </div>
          </div>
          <div style="height: 4px; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); border-radius: 2px; margin-bottom: 12px;"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-secondary);">
            <span>完整知识库</span>
            <span>${progress.terms.read}/${progress.terms.total} 术语</span>
          </div>
        </div>
        
        <div class="knowledge-card" style="padding: 24px; background: var(--card-bg); border-radius: 20px; border: var(--card-border); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--glow-effect), 0 12px 48px rgba(0,0,0,0.15)'" onmouseleave="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'" onclick="showTemplatesModal()">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
            <div style="font-size: 48px;">📝</div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 18px; color: var(--text-primary); margin-bottom: 4px;">提示词模板</div>
              <div style="font-size: 13px; color: var(--text-secondary);">快速上手 AI</div>
            </div>
          </div>
          <div style="height: 4px; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); border-radius: 2px; margin-bottom: 12px;"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-secondary);">
            <span>精选模板</span>
            <span>${this.knowledge.templates.reduce((sum, cat) => sum + cat.templates.length, 0)}+ 可用</span>
          </div>
        </div>
        
        <div class="knowledge-card" style="padding: 24px; background: var(--card-bg); border-radius: 20px; border: var(--card-border); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--glow-effect), 0 12px 48px rgba(0,0,0,0.15)'" onmouseleave="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'" onclick="showTermsModal()">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
            <div style="font-size: 48px;">📖</div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 18px; color: var(--text-primary); margin-bottom: 4px;">AI 术语词典</div>
              <div style="font-size: 13px; color: var(--text-secondary);">掌握 AI 概念</div>
            </div>
          </div>
          <div style="height: 4px; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); border-radius: 2px; margin-bottom: 12px;"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-secondary);">
            <span>核心术语</span>
            <span>${progress.terms.percent}% 已读</span>
          </div>
        </div>
        
        <div class="knowledge-card" style="padding: 24px; background: var(--card-bg); border-radius: 20px; border: var(--card-border); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--glow-effect), 0 12px 48px rgba(0,0,0,0.15)'" onmouseleave="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'" onclick="showPlatformsModal()">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
            <div style="font-size: 48px;">🌐</div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 18px; color: var(--text-primary); margin-bottom: 4px;">AI 平台百科</div>
              <div style="font-size: 13px; color: var(--text-secondary);">主流平台介绍</div>
            </div>
          </div>
          <div style="height: 4px; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); border-radius: 2px; margin-bottom: 12px;"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-secondary);">
            <span>平台对比</span>
            <span>${progress.platforms.percent}% 已读</span>
          </div>
        </div>
      </div>
      
      <!-- 学习资源预览 -->
      <div style="margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0;">📖 学习资源</h3>
          <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="showResourcesModal()">查看全部 →</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
          ${resources.slice(0, 3).map(cat => `
            <div class="knowledge-category-card" style="padding: 20px; background: var(--card-bg); border-radius: 20px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--glow-effect), 0 12px 48px rgba(0,0,0,0.15)'" onmouseleave="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'" onclick="showResourcesModal()">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <span style="font-size: 32px;">${cat.icon}</span>
                <div>
                  <h4 style="font-weight: 600; color: var(--text-primary);">${cat.category}</h4>
                  <span style="font-size: 12px; color: var(--text-secondary);">${cat.items.length} 个主题</span>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${cat.items.slice(0, 2).map(item => `
                  <div style="padding: 10px; background: var(--card-bg); border-radius: 8px; font-size: 13px;">
                    <div style="font-weight: 500; margin-bottom: 4px;">${item.title}</div>
                    <div style="font-size: 11px; color: var(--text-secondary);">${item.desc.substring(0, 30)}...</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- AI 术语预览 -->
      <div style="margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0;">📖 AI 术语词典</h3>
          <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="showTermsModal()">查看全部 →</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
          ${terms.slice(0, 2).flatMap(cat => cat.terms.slice(0, 2)).map(term => `
            <div class="term-preview-card" style="padding: 16px; background: var(--card-bg); border-radius: 20px; border-left: 3px solid ${this.knowledge.getLevelColor(term.level)}; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--glow-effect), 0 12px 48px rgba(0,0,0,0.15)'" onmouseleave="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'" onclick="showTermsModal()">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <h5 style="font-weight: 600; margin: 0;">${term.term}</h5>
                <span style="font-size: 11px; padding: 2px 8px; background: rgba(255,255,255,0.1); border-radius: 8px;">${this.knowledge.getLevelText(term.level)}</span>
              </div>
              <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0;">
                ${term.explanation.substring(0, 80)}...
              </p>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- AI 平台预览 -->
      <div style="margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0;">🌐 AI 平台百科</h3>
          <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="showPlatformsModal()">查看全部 →</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
          ${platforms.flatMap(cat => cat.platforms.slice(0, 2)).slice(0, 4).map(p => `
            <div class="platform-preview-card" style="padding: 16px; background: var(--card-bg); border-radius: 20px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--glow-effect), 0 12px 48px rgba(0,0,0,0.15)'" onmouseleave="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'" onclick="showPlatformsModal()">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="font-size: 28px;">${p.icon.startsWith('logos/') ? '🌐' : p.icon}</div>
                <div>
                  <h5 style="font-weight: 600; margin: 0; font-size: 14px;">${p.name}</h5>
                  <div style="font-size: 11px; color: var(--text-secondary);">${p.company}</div>
                </div>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${p.strengths.slice(0, 2).map(s => `<span style="font-size: 10px; padding: 2px 6px; background: rgba(52,199,89,0.2); color: #34c759; border-radius: 6px;">${s}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- 提示词模板预览 -->
      <div style="margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0;">📝 热门提示词模板</h3>
          <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="showTemplatesModal()">查看全部 →</button>
        </div>
        <div style="display: grid; gap: 12px;">
          ${this.knowledge.templates.slice(0, 2).flatMap(cat => cat.templates.slice(0, 1)).map(tpl => `
            <div class="template-preview-card" style="padding: 16px; background: var(--card-bg); border-radius: 20px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--glow-effect), 0 12px 48px rgba(0,0,0,0.15)'" onmouseleave="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'" onclick="showTemplatesModal()">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h5 style="font-weight: 600; margin: 0;">${tpl.title}</h5>
                <span style="font-size: 12px; color: var(--text-secondary);">📝 复制使用</span>
              </div>
              <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0;">
                ${tpl.prompt.substring(0, 120)}...
              </p>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
        <button class="btn-primary" onclick="showKnowledgeBase()">📖 浏览全部资源</button>
        <button class="btn-secondary" onclick="showTemplatesModal()" style="margin-left: 12px;">📝 提示词模板</button>
        <button class="btn-secondary" onclick="showFavoritesModal()" style="margin-left: 12px;">⭐ 我的收藏</button>
        <button class="btn-secondary" onclick="showTermsModal()" style="margin-left: 12px;">📖 AI 术语词典</button>
        <button class="btn-secondary" onclick="showPlatformsModal()" style="margin-left: 12px;">🌐 AI 平台百科</button>
      </div>
    `;
  }

  // 生成 AI 评语
  generateAIComment() {
    const container = document.getElementById('ai-comment-content');
    if (!container) return;

    const scores = this.calculateAbilityScores();
    const completedTasks = LEARNING_TASKS.filter(t => t.completed).length;
    const totalTasks = LEARNING_TASKS.length;
    
    // 优先使用当前孩子的名字
    let childName = '小探险家';
    const currentChild = this.multiChild?.getCurrentChild();
    if (currentChild && currentChild.name) {
      childName = currentChild.name;
    } else if (APP_DATA.childName) {
      childName = APP_DATA.childName;
    }
    
    const streak = APP_DATA.streak || 0;

    // 找出最强和最弱维度
    const dimensions = this.getAbilityDimensions();
    let strongest = dimensions[0];
    let weakest = dimensions[0];
    let maxScore = -1;
    let minScore = 101;

    dimensions.forEach(dim => {
      const score = scores[dim.id] || 0;
      if (score > maxScore) {
        maxScore = score;
        strongest = dim;
      }
      if (score < minScore) {
        minScore = score;
        weakest = dim;
      }
    });

    // 生成评语模板
    const comments = [];

    // 开场白
    if (completedTasks === 0) {
      comments.push(`${childName}刚刚开始 AI 探险之旅，期待看到你的成长！`);
    } else if (completedTasks === totalTasks) {
      comments.push(`🎉 恭喜${childName}完成了全部 21 天学习，成为真正的 AI 小达人！`);
    } else {
      comments.push(`${childName}已经完成了${completedTasks}/${totalTasks}天的学习任务，继续加油！`);
    }

    // 优势表扬
    if (maxScore > 70) {
      comments.push(`${strongest.icon} 在${strongest.name}方面表现突出，得分${maxScore}分！`);
    }

    // 连击表扬
    if (streak >= 7) {
      comments.push(`🔥 连续学习${streak}天，展现了出色的坚持精神！`);
    } else if (streak >= 3) {
      comments.push(`🔥 保持${streak}天连击，学习习惯越来越好！`);
    }

    // 改进建议
    if (minScore < 50 && completedTasks > 0) {
      comments.push(`${weakest.icon} ${weakest.name}还有提升空间（${minScore}分），建议多练习相关任务。`);
    }

    // 具体进步描述（模拟）
    const progressExamples = [
      '本周主动提问次数明显增加',
      '跨文化话题表达更加流畅',
      '能够独立思考并验证 AI 的回答',
      '开始尝试用 AI 辅助解决实际问题',
      '对新技术的好奇心和探索欲增强',
      '学会了如何更好地向 AI 提问'
    ];

    if (completedTasks >= 3) {
      const randomExample = progressExamples[Math.floor(Math.random() * progressExamples.length)];
      comments.push(`📈 观察到：${randomExample}`);
    }

    // 鼓励结尾
    if (completedTasks < totalTasks) {
      comments.push(`继续探索，发现更多 AI 的奥秘！💪`);
    } else {
      comments.push(`期待你用 AI 创造更多精彩作品！🚀`);
    }

    container.innerHTML = `<p style="margin-bottom: 12px;">${comments.join('</p><p style="margin-bottom: 12px;">')}</p>`;
  }

  // ===== 证书展示功能 =====

}

// 启动应用（检查是否已存在，避免重复初始化）
if (!window.app) {
  const app = new AIExplorerApp();
  window.app = app;
}

// 页面加载完成后启用音效（需要用户交互）
document.addEventListener('click', () => {
  if (soundManager.audioContext && soundManager.audioContext.state === 'suspended') {
    soundManager.audioContext.resume();
  }
}, { once: true });

// ȫ���·��л�����
function changeMonth(delta) {
  if (window.app) {
    window.app.changeMonth(delta);
  }
}

// ȫ����������
function searchKnowledge(query) {
  console.log('����֪ʶ��:', query);
}

