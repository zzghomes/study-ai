// AI 探险家 - 多孩子管理模块（增强版 - 支持数据隔离）

class MultiChildManager {
  constructor(app) {
    this.app = app;
    this.children = [];
    this.currentChildId = null;
    this.onChildSwitch = null; // 切换回调
    this.loadChildren();
  }

  // 加载孩子数据
  loadChildren() {
    const saved = localStorage.getItem('multiChildData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.children = data.children || [];
        this.currentChildId = data.currentChildId || null;
      } catch (e) {
        console.error('加载孩子数据失败:', e);
        this.children = [];
        this.currentChildId = null;
      }
    }
  }

  // 保存孩子数据
  saveChildren() {
    const data = {
      children: this.children,
      currentChildId: this.currentChildId
    };
    localStorage.setItem('multiChildData', JSON.stringify(data));
  }

  // 获取当前孩子
  getCurrentChild() {
    if (!this.currentChildId && this.children.length > 0) {
      this.currentChildId = this.children[0].id;
    }
    return this.children.find(c => c.id === this.currentChildId);
  }

  // 添加孩子
  addChild(childData) {
    const id = 'child_' + Date.now();
    const child = {
      id: id,
      name: childData.name || '小探险家',
      avatar: childData.avatar || { type: 'emoji', emoji: '👦' },
      birthYear: childData.birthYear || new Date().getFullYear() - 10,
      createdAt: new Date().toISOString(),
      
      // ===== 独立学习数据 =====
      data: {
        startDate: null,
        lastActive: null,
        visitedPlatforms: [],
        totalXP: 0,
        streak: 0,
        works: [],
        currentAbilityScores: {},
        lastAbilityUpdate: null,
        learningDiary: [],
        collectedCards: []
      },
      
      // ===== 独立任务进度 =====
      tasks: this.createInitialTasks(),
      
      // ===== 独立徽章和奖励 =====
      badges: [],
      rewards: [],
      
      // ===== 独立学习目标 =====
      goals: {
        daily: [],
        weekly: [],
        monthly: []
      },
      
      // ===== 独立统计数据 =====
      statistics: {
        platformUsage: {},
        taskTypePreference: {},
        studyTimeSlots: {},
        weeklyReports: [],
        monthlyReports: []
      }
    };
    this.children.push(child);
    if (!this.currentChildId) {
      this.currentChildId = id;
    }
    this.saveChildren();
    return child;
  }

  // 创建初始任务数组（21 天任务）
  createInitialTasks() {
    const tasks = [];
    for (let day = 1; day <= 21; day++) {
      tasks.push({
        day: day,
        completed: false,
        completedCases: [],
        completedDate: null
      });
    }
    return tasks;
  }

  // 更新孩子信息
  updateChild(childId, updates) {
    const child = this.children.find(c => c.id === childId);
    if (child) {
      Object.assign(child, updates);
      this.saveChildren();
      return true;
    }
    return false;
  }

  // 删除孩子
  deleteChild(childId) {
    const index = this.children.findIndex(c => c.id === childId);
    if (index !== -1) {
      this.children.splice(index, 1);
      if (this.currentChildId === childId) {
        this.currentChildId = this.children.length > 0 ? this.children[0].id : null;
      }
      this.saveChildren();
      return true;
    }
    return false;
  }

  // 切换孩子（增强版）
  switchChild(childId) {
    const child = this.children.find(c => c.id === childId);
    if (!child) return false;
    
    console.log('🔄 开始切换孩子:', child.name);
    
    // 1. 保存当前孩子的数据到存储
    this.saveCurrentChildData();
    
    // 2. 保存当前任务状态
    this.saveCurrentTasksState();
    
    // 3. 切换孩子 ID
    this.currentChildId = childId;
    
    // 4. 从新孩子加载数据
    this.loadChildDataToApp();
    
    // 5. 恢复孩子的任务状态
    this.loadTasksStateToApp(child);
    
    // 6. 保存
    this.saveChildren();
    
    // 7. 通知应用刷新 UI
    if (this.onChildSwitch) {
      this.onChildSwitch(child);
    }
    
    console.log('✅ 孩子切换完成:', child.name);
    return true;
  }

  // 保存当前孩子的数据到 localStorage
  saveCurrentChildData() {
    if (!this.currentChildId) return;
    
    const currentChild = this.children.find(c => c.id === this.currentChildId);
    if (!currentChild) return;
    
    // 从 APP_DATA 同步数据到当前孩子
    currentChild.data.works = window.APP_DATA?.works || [];
    currentChild.data.streak = window.APP_DATA?.streak || 0;
    currentChild.data.totalXP = window.APP_DATA?.totalXP || 0;
    currentChild.data.visitedPlatforms = window.APP_DATA?.visitedPlatforms || [];
    currentChild.data.currentAbilityScores = window.APP_DATA?.currentAbilityScores || {};
    currentChild.data.collectedCards = window.APP_DATA?.collectedCards || [];
    currentChild.data.lastActiveDate = window.APP_DATA?.lastActiveDate || null;
    
    console.log('💾 已保存孩子数据:', currentChild.name);
  }

  // 保存当前任务状态到孩子数据
  saveCurrentTasksState() {
    if (!this.currentChildId) return;
    
    const currentChild = this.children.find(c => c.id === this.currentChildId);
    if (!currentChild) return;
    
    // 将全局任务状态同步到孩子
    if (typeof LEARNING_TASKS !== 'undefined') {
      currentChild.tasks = LEARNING_TASKS.map(task => ({
        day: task.day,
        completed: task.completed,
        completedCases: task.completedCases || [],
        completedDate: task.completedDate || null
      }));
    }
    
    console.log('💾 已保存任务状态:', currentChild.name);
  }

  // 从当前孩子加载数据到 APP_DATA
  loadChildDataToApp() {
    const currentChild = this.children.find(c => c.id === this.currentChildId);
    if (!currentChild) return;
    
    // 将孩子数据同步到 APP_DATA
    if (window.APP_DATA) {
      window.APP_DATA.works = currentChild.data.works || [];
      window.APP_DATA.streak = currentChild.data.streak || 0;
      window.APP_DATA.totalXP = currentChild.data.totalXP || 0;
      window.APP_DATA.visitedPlatforms = currentChild.data.visitedPlatforms || [];
      window.APP_DATA.currentAbilityScores = currentChild.data.currentAbilityScores || {};
      window.APP_DATA.collectedCards = currentChild.data.collectedCards || [];
      window.APP_DATA.lastActiveDate = currentChild.data.lastActiveDate || null;
      window.APP_DATA.childName = currentChild.name;
    }
    
    console.log('📥 已加载孩子数据:', currentChild.name);
  }

  // 从孩子数据恢复任务状态
  loadTasksStateToApp(child) {
    if (!child.tasks || typeof LEARNING_TASKS === 'undefined') return;
    
    child.tasks.forEach(childTask => {
      const globalTask = LEARNING_TASKS.find(t => t.day === childTask.day);
      if (globalTask) {
        globalTask.completed = childTask.completed;
        globalTask.completedCases = childTask.completedCases || [];
        globalTask.completedDate = childTask.completedDate;
      }
    });
    
    console.log('📥 已恢复任务状态:', child.name);
  }

  // 获取所有孩子列表
  getChildrenList() {
    return this.children.map(c => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar
    }));
  }

  // 从全局数据初始化第一个孩子（兼容旧数据）
  initFromLegacyData() {
    if (this.children.length > 0) return;
    
    console.log('📋 检测到旧数据，正在迁移...');
    
    const child = this.addChild({
      name: window.APP_DATA?.childName || '小探险家'
    });
    
    // 迁移现有数据
    child.data.works = window.APP_DATA?.works || [];
    child.data.streak = window.APP_DATA?.streak || 0;
    child.data.totalXP = window.APP_DATA?.totalXP || 0;
    child.data.visitedPlatforms = window.APP_DATA?.visitedPlatforms || [];
    
    // 迁移任务状态
    if (typeof LEARNING_TASKS !== 'undefined') {
      child.tasks = LEARNING_TASKS.map(task => ({
        day: task.day,
        completed: task.completed,
        completedCases: task.completedCases || [],
        completedDate: task.completedDate || null
      }));
    }
    
    this.saveChildren();
    console.log('✅ 旧数据迁移完成');
  }

  // 显示添加宝贝模态框
  showAddChildModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'add-child-modal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <h3>👶 添加新宝贝</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>孩子姓名</label>
            <input type="text" id="new-child-name" placeholder="输入孩子姓名" value="小探险家">
          </div>
          
          <div class="form-group">
            <label>选择头像</label>
            <div class="avatar-selector" id="avatar-selector">
              <div class="avatar-option selected" data-type="emoji" data-value="👦">
                <span class="avatar-emoji">👦</span>
              </div>
              <div class="avatar-option" data-type="emoji" data-value="👧">
                <span class="avatar-emoji">👧</span>
              </div>
              <div class="avatar-option" data-type="emoji" data-value="🧒">
                <span class="avatar-emoji">🧒</span>
              </div>
              <div class="avatar-option" data-type="emoji" data-value="👨‍🎓">
                <span class="avatar-emoji">👨‍🎓</span>
              </div>
              <div class="avatar-option" data-type="emoji" data-value="👩‍🎓">
                <span class="avatar-emoji">👩‍🎓</span>
              </div>
              <div class="avatar-option" data-type="emoji" data-value="🚀">
                <span class="avatar-emoji">🚀</span>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>或上传照片</label>
            <div class="avatar-upload" onclick="document.getElementById('avatar-input').click()">
              <div class="avatar-upload-preview" id="avatar-upload-preview">
                <span>📷</span>
                <span>点击上传照片</span>
              </div>
              <input type="file" id="avatar-input" accept="image/*" style="display: none;" onchange="window.app.multiChild.handleAvatarUpload(this)">
            </div>
          </div>
          
          <div class="form-group">
            <label>出生年份</label>
            <select id="new-child-birth-year">
              ${this.generateYearOptions()}
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="this.closest('.modal').remove()">取消</button>
          <button class="btn-primary" onclick="app.multiChild.addNewChild()">➕ 添加宝贝</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // 绑定头像选择事件
    setTimeout(() => {
      const options = modal.querySelectorAll('.avatar-option');
      options.forEach(opt => {
        opt.addEventListener('click', () => {
          options.forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
        });
      });
    }, 100);
  }

  // 生成年份选项
  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    let options = '';
    for (let year = currentYear - 4; year >= currentYear - 15; year--) {
      const selected = year === currentYear - 10 ? 'selected' : '';
      options += `<option value="${year}" ${selected}>${year}年 (${currentYear - year}岁)</option>`;
    }
    return options;
  }

  // 处理头像上传
  handleAvatarUpload(input) {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById('avatar-upload-preview');
        preview.innerHTML = `<img src="${e.target.result}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%;">`;
        preview.dataset.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // 添加新孩子
  addNewChild() {
    const name = document.getElementById('new-child-name').value.trim();
    const birthYear = parseInt(document.getElementById('new-child-birth-year').value);
    
    // 获取选中的头像
    const selectedAvatar = document.querySelector('#add-child-modal .avatar-option.selected');
    const avatar = selectedAvatar ? {
      type: 'emoji',
      emoji: selectedAvatar.dataset.value
    } : { type: 'emoji', emoji: '👦' };
    
    // 检查是否有上传的照片
    const uploadPreview = document.getElementById('avatar-upload-preview');
    if (uploadPreview.dataset.image) {
      avatar.type = 'image';
      avatar.data = uploadPreview.dataset.image;
    }
    
    if (!name) {
      this.app.showToast('❌ 请输入孩子姓名', 'error');
      return;
    }
    
    const child = this.addChild({ name, avatar, birthYear });
    
    // 关闭模态框
    document.getElementById('add-child-modal')?.remove();
    
    // 刷新孩子选择器
    this.renderChildSelector();
    
    // 切换到新孩子
    this.switchChild(child.id);
    this.app.navigateTo('home');
    
    this.app.showToast(`✅ 已添加 ${name}`, 'success');
  }

  // 渲染孩子选择器
  renderChildSelector() {
    const container = document.getElementById('child-selector');
    if (!container) return;
    
    container.innerHTML = '';
    
    this.children.forEach(child => {
      const isSelected = child.id === this.currentChildId;
      const card = document.createElement('div');
      card.className = `child-selector-card ${isSelected ? 'selected' : ''}`;
      card.onclick = () => this.switchChild(child.id);
      
      let avatarHtml;
      if (child.avatar.type === 'image' && child.avatar.data) {
        avatarHtml = `<img src="${child.avatar.data}" alt="${child.name}" class="child-avatar">`;
      } else {
        avatarHtml = `<span class="child-avatar-emoji">${child.avatar.emoji || '👦'}</span>`;
      }
      
      card.innerHTML = `
        <div class="child-avatar-container">${avatarHtml}</div>
        <span class="child-name">${child.name}</span>
        ${isSelected ? '<span class="child-selected-mark">✓</span>' : ''}
      `;
      
      container.appendChild(card);
    });
  }

  // 显示宝贝管理模态框
  showManageChildrenModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'manage-children-modal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 600px;">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <h3>👨‍👩‍👧‍👦 管理宝贝</h3>
        </div>
        <div class="modal-body">
          <div id="manage-children-list" style="max-height: 400px; overflow-y: auto;">
            ${this.renderManageList()}
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // 渲染管理列表
  renderManageList() {
    if (this.children.length === 0) {
      return '<div style="text-align: center; padding: 40px; color: var(--secondary);">还没有添加宝贝</div>';
    }
    
    return this.children.map((child, index) => {
      const isLastChild = this.children.length === 1;
      const completedTasks = child.tasks?.filter(t => t.completed).length || 0;
      return `
        <div class="manage-child-item">
          <div class="manage-child-info">
            ${child.avatar.type === 'image' && child.avatar.data 
              ? `<img src="${child.avatar.data}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">`
              : `<span style="width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; background: rgba(255, 255, 255, 0.1);">${child.avatar.emoji || '👦'}</span>`
            }
            <div class="manage-child-details">
              <div class="manage-child-name">${child.name}</div>
              <div class="manage-child-meta">
                <span>创建于 ${new Date(child.createdAt).toLocaleDateString('zh-CN')}</span>
                <span style="margin-left: 12px;">📚 已完成 ${completedTasks}/21 天</span>
              </div>
            </div>
          </div>
          <div class="manage-child-actions">
            <button class="btn-secondary" onclick="window.app.multiChild.editChild('${child.id}')" style="padding: 4px 12px; font-size: 12px;">编辑</button>
            <button class="btn-danger" onclick="window.app.multiChild.confirmDeleteChild('${child.id}', ${isLastChild})" style="padding: 4px 12px; font-size: 12px; margin-left: 8px;">🗑️ 删除</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 编辑孩子
  editChild(childId) {
    const child = this.children.find(c => c.id === childId);
    if (!child) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'edit-child-modal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <h3>✏️ 编辑孩子信息</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>孩子姓名</label>
            <input type="text" id="edit-child-name" value="${child.name}">
          </div>
          <div class="form-group">
            <label>出生年份</label>
            <select id="edit-child-birth-year">
              ${this.generateYearOptionsForEdit(child.birthYear)}
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="this.closest('.modal').remove()">取消</button>
          <button class="btn-primary" onclick="app.multiChild.saveEditChild('${child.id}')">💾 保存修改</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // 生成年份选项（编辑用）
  generateYearOptionsForEdit(selectedYear) {
    const currentYear = new Date().getFullYear();
    let options = '';
    for (let year = currentYear - 4; year >= currentYear - 15; year--) {
      const selected = year === selectedYear ? 'selected' : '';
      options += `<option value="${year}" ${selected}>${year}年 (${currentYear - year}岁)</option>`;
    }
    return options;
  }

  // 保存编辑
  saveEditChild(childId) {
    const name = document.getElementById('edit-child-name').value.trim();
    const birthYear = parseInt(document.getElementById('edit-child-birth-year').value);
    
    if (!name) {
      this.app.showToast('❌ 请输入孩子姓名', 'error');
      return;
    }
    
    this.updateChild(childId, { name, birthYear });
    document.getElementById('edit-child-modal')?.remove();
    this.showManageChildrenModal();
    this.renderChildSelector();
    this.app.updateWelcome();
    this.app.showToast('✅ 信息已更新', 'success');
  }

  // 确认删除孩子
  confirmDeleteChild(childId, isLastChild = false) {
    const child = this.children.find(c => c.id === childId);
    if (!child) return;
    
    const completedTasks = child.tasks?.filter(t => t.completed).length || 0;
    let message = `⚠️ 确定要删除"${child.name}"吗？\n\n这将删除该孩子的所有学习数据（已完成 ${completedTasks}/21 天），此操作不可恢复！`;
    if (isLastChild) {
      message = `⚠️ 这是最后一个宝贝！\n\n确定要删除"${child.name}"吗？\n\n删除后需要重新添加宝贝才能继续使用。`;
    }
    
    if (confirm(message)) {
      this.deleteChild(childId);
      document.getElementById('manage-children-modal')?.remove();
      this.renderChildSelector();
      this.app.navigateTo('home');
      this.app.showToast(`✅ 已删除 ${child.name}`, 'success');
    }
  }

  // ===== 数据查询辅助方法 =====

  // 获取孩子的完成任务数
  getChildCompletedTasks(child) {
    return child?.tasks?.filter(t => t.completed).length || 0;
  }

  // 获取孩子的总任务数
  getChildTotalTasks(child) {
    return child?.tasks?.length || 21;
  }

  // 获取孩子的完成率
  getChildCompletionRate(child) {
    const completed = this.getChildCompletedTasks(child);
    const total = this.getChildTotalTasks(child);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  // 获取孩子的学习天数
  getChildStudyDays(child) {
    return this.getChildCompletedTasks(child);
  }

  // 获取孩子的开始日期
  getChildStartDate(child) {
    const firstCompletedTask = child?.tasks?.find(t => t.completed);
    if (firstCompletedTask?.completedDate) {
      return firstCompletedTask.completedDate;
    }
    return child?.createdAt;
  }

  // 获取孩子的上次活跃日期
  getChildLastActiveDate(child) {
    return child?.data?.lastActiveDate || null;
  }
}

// 导出供全局使用
if (typeof window !== 'undefined') {
  window.MultiChildManager = MultiChildManager;
}