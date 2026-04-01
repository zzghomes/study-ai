/**
 * 目标设定系统模块
 * 支持日/周/月目标设定和追踪
 */

class GoalManager {
  constructor(app) {
    this.app = app;
    this.goals = {
      daily: [],
      weekly: [],
      monthly: []
    };
    this.loadGoals();
  }

  // 加载目标
  loadGoals() {
    const saved = localStorage.getItem('aiExplorerGoals');
    if (saved) {
      try {
        this.goals = JSON.parse(saved);
      } catch (e) {
        console.error('加载目标失败:', e);
      }
    }
  }

  // 保存目标
  saveGoals() {
    localStorage.setItem('aiExplorerGoals', JSON.stringify(this.goals));
  }

  // 创建目标
  createGoal(type, title, target, icon = '🎯') {
    const goal = {
      id: Date.now().toString(),
      type, // 'daily', 'weekly', 'monthly'
      title,
      target,
      current: 0,
      icon,
      createdAt: new Date().toISOString(),
      completed: false,
      completedAt: null
    };
    
    this.goals[type].push(goal);
    this.saveGoals();
    return goal;
  }

  // 更新目标进度
  updateGoalProgress(goalId, value) {
    for (const type of ['daily', 'weekly', 'monthly']) {
      const goal = this.goals[type].find(g => g.id === goalId);
      if (goal) {
        goal.current = value;
        if (value >= goal.target && !goal.completed) {
          goal.completed = true;
          goal.completedAt = new Date().toISOString();
          this.app.showToast(`🎉 目标完成：${goal.title}`, 'success');
          this.app.confettiManager?.start(2000);
        }
        this.saveGoals();
        return goal;
      }
    }
    return null;
  }

  // 增加目标进度
  incrementGoal(goalId, amount = 1) {
    for (const type of ['daily', 'weekly', 'monthly']) {
      const goal = this.goals[type].find(g => g.id === goalId);
      if (goal) {
        return this.updateGoalProgress(goalId, goal.current + amount);
      }
    }
    return null;
  }

  // 删除目标
  deleteGoal(goalId) {
    for (const type of ['daily', 'weekly', 'monthly']) {
      const index = this.goals[type].findIndex(g => g.id === goalId);
      if (index !== -1) {
        this.goals[type].splice(index, 1);
        this.saveGoals();
        return true;
      }
    }
    return false;
  }

  // 获取目标
  getGoals(type = null) {
    if (type) {
      return this.goals[type] || [];
    }
    return this.goals;
  }

  // 获取完成率
  getCompletionRate(type = null) {
    const goals = type ? this.goals[type] : [...this.goals.daily, ...this.goals.weekly, ...this.goals.monthly];
    if (goals.length === 0) return 0;
    const completed = goals.filter(g => g.completed).length;
    return Math.round((completed / goals.length) * 100);
  }

  // 清理过期目标（每日目标每天重置）
  cleanupExpiredGoals() {
    const today = new Date().toDateString();
    const lastCleanup = localStorage.getItem('aiExplorerGoalsCleanup');
    
    if (lastCleanup !== today) {
      // 重置每日目标
      this.goals.daily.forEach(goal => {
        goal.current = 0;
        goal.completed = false;
        goal.completedAt = null;
      });
      localStorage.setItem('aiExplorerGoalsCleanup', today);
      this.saveGoals();
    }
  }

  // 显示目标管理界面
  showGoalsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-large">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <h3>🎯 目标管理</h3>
        </div>
        <div class="modal-body">
          <!-- 添加目标表单 -->
          <div class="add-goal-form" style="margin-bottom: 24px;">
            <h4 style="margin-bottom: 12px;">添加新目标</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 12px; align-items: end;">
              <div class="form-group" style="margin: 0;">
                <label>目标类型</label>
                <select id="goal-type">
                  <option value="daily">每日</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>
              <div class="form-group" style="margin: 0;">
                <label>目标名称</label>
                <input type="text" id="goal-title" placeholder="例如：完成 3 个任务">
              </div>
              <div class="form-group" style="margin: 0;">
                <label>目标值</label>
                <input type="number" id="goal-target" placeholder="10" min="1">
              </div>
              <button class="btn-primary" onclick="app.goals.addGoalFromForm()">➕ 添加</button>
            </div>
          </div>
          
          <!-- 目标完成率 -->
          <div style="margin-bottom: 24px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-size: 15px; font-weight: 600;">总体完成率</span>
              <span id="goal-completion-rate" style="font-size: 24px; font-weight: 700; color: var(--primary);">${this.getCompletionRate()}%</span>
            </div>
            <div style="height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden;">
              <div id="goal-overall-progress" style="height: 100%; width: ${this.getCompletionRate()}%; background: linear-gradient(90deg, var(--primary), var(--success)); border-radius: 5px; transition: width 0.5s;"></div>
            </div>
          </div>
          
          <!-- 目标列表 -->
          <div style="display: grid; gap: 20px;">
            <div>
              <h4 style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <span>📅</span> 每日目标
              </h4>
              <div id="daily-goals-list" class="goals-list"></div>
            </div>
            <div>
              <h4 style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <span>📆</span> 每周目标
              </h4>
              <div id="weekly-goals-list" class="goals-list"></div>
            </div>
            <div>
              <h4 style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <span>🗓️</span> 每月目标
              </h4>
              <div id="monthly-goals-list" class="goals-list"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    this.renderGoalsLists();
  }

  // 从表单添加目标
  addGoalFromForm() {
    const type = document.getElementById('goal-type').value;
    const title = document.getElementById('goal-title').value.trim();
    const target = parseInt(document.getElementById('goal-target').value);
    
    if (!title) {
      this.app.showToast('❌ 请输入目标名称', 'error');
      return;
    }
    if (!target || target <= 0) {
      this.app.showToast('❌ 目标值必须大于 0', 'error');
      return;
    }
    
    const icons = {
      daily: '📅',
      weekly: '📆',
      monthly: '🗓️'
    };
    
    this.createGoal(type, title, target, icons[type]);
    this.renderGoalsLists();
    
    // 清空表单
    document.getElementById('goal-title').value = '';
    document.getElementById('goal-target').value = '';
    
    this.app.showToast('✅ 目标已添加', 'success');
  }

  // 渲染目标列表
  renderGoalsLists() {
    ['daily', 'weekly', 'monthly'].forEach(type => {
      const container = document.getElementById(`${type}-goals-list`);
      if (!container) return;
      
      const goals = this.goals[type] || [];
      
      if (goals.length === 0) {
        container.innerHTML = '<p style="color: var(--secondary); font-size: 14px; padding: 20px; text-align: center;">暂无目标，添加一个吧！</p>';
        return;
      }
      
      container.innerHTML = goals.map(goal => {
        const progress = Math.min((goal.current / goal.target) * 100, 100);
        const isCompleted = goal.completed;
        
        return `
          <div class="goal-item ${isCompleted ? 'completed' : ''}" style="border-left-color: ${isCompleted ? 'var(--success)' : 'var(--primary)'}">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${goal.icon}</span>
                <div>
                  <div style="font-weight: 600; margin-bottom: 4px;">${goal.title}</div>
                  <div style="font-size: 12px; color: var(--secondary);">
                    ${isCompleted ? '✅ 已完成' : `进度：${goal.current}/${goal.target}`}
                  </div>
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                ${!isCompleted ? `<button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="app.goals.incrementGoal('${goal.id}')">➕</button>` : ''}
                <button class="btn-danger" style="padding: 6px 12px; font-size: 12px; background: var(--danger);" onclick="app.goals.deleteGoalWithConfirm('${goal.id}')">🗑️</button>
              </div>
            </div>
            <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
              <div style="height: 100%; width: ${progress}%; background: ${isCompleted ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), var(--success))'}; border-radius: 4px; transition: width 0.3s;"></div>
            </div>
          </div>
        `;
      }).join('');
    });
    
    // 更新完成率
    document.getElementById('goal-completion-rate').textContent = `${this.getCompletionRate()}%`;
    document.getElementById('goal-overall-progress').style.width = `${this.getCompletionRate()}%`;
  }

  // 确认删除目标
  deleteGoalWithConfirm(goalId) {
    if (confirm('确定要删除这个目标吗？')) {
      this.deleteGoal(goalId);
      this.renderGoalsLists();
      this.app.showToast('✅ 目标已删除', 'success');
    }
  }

  // 预设常用目标
  addPresetGoals() {
    const presets = [
      { type: 'daily', title: '完成每日任务', target: 1, icon: '📋' },
      { type: 'daily', title: '学习 30 分钟', target: 30, icon: '⏱️' },
      { type: 'weekly', title: '完成 5 个任务', target: 5, icon: '🎯' },
      { type: 'weekly', title: '获得 500 XP', target: 500, icon: '⭐' },
      { type: 'monthly', title: '完成 20 个任务', target: 20, icon: '🏆' },
      { type: 'monthly', title: '获得 2000 XP', target: 2000, icon: '🌟' }
    ];
    
    presets.forEach(preset => {
      // 检查是否已存在类似目标
      const exists = this.goals[preset.type].some(g => g.title === preset.title);
      if (!exists) {
        this.createGoal(preset.type, preset.title, preset.target, preset.icon);
      }
    });
  }
}

// 导出
window.GoalManager = GoalManager;