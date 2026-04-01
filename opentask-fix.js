// AI 探险家 - openTask 函数修复补丁
// 使用方法：在 app.js 的 openTask 函数后添加此文件，或直接替换 openTask 函数

// 修复后的 openTask 函数
AIExplorerApp.prototype.openTaskFixed = function(index) {
  this.selectedTask = index;
  const task = LEARNING_TASKS[index];
  
  console.log('📋 打开任务:', task.day, task.title);
  
  // 检查元素是否存在
  const modalDay = document.getElementById('modal-day');
  const modalTitle = document.getElementById('modal-title');
  const modalPlatform = document.getElementById('modal-platform');
  const modalDifficulty = document.getElementById('modal-difficulty');
  const modalDescription = document.getElementById('modal-description');
  const modalCases = document.getElementById('modal-cases');
  const taskModal = document.getElementById('task-modal');
  
  // 安全设置元素内容
  if (modalDay) modalDay.textContent = `第 ${task.day} 天`;
  if (modalTitle) modalTitle.textContent = task.title;
  if (modalPlatform) modalPlatform.textContent = task.platform;
  if (modalDifficulty) modalDifficulty.textContent = `${'⭐'.repeat(task.difficulty)} ${['简单', '中等', '困难'][task.difficulty - 1]}`;
  if (modalDescription) modalDescription.textContent = task.description;
  
  // 渲染任务清单
  if (modalCases && task.cases) {
    const completedCases = task.completedCases || [];
    
    const casesHtml = task.cases.map((c, i) => {
      const isCompleted = completedCases.includes(i);
      const platforms = c.platforms || task.platforms || [];
      const screenshot = c.screenshot || false;
      
      const platformButtons = platforms.map(pid => {
        const platform = AI_PLATFORMS.find(p => p.id === pid);
        if (!platform) return '';
        return `<button class="btn-primary" style="margin-right: 8px; padding: 6px 12px; font-size: 12px;" onclick="app.openPlatform('${platform.id}')">${platform.icon} ${platform.name} →</button>`;
      }).join('');
      
      return `
        <div class="case-item" style="margin-bottom: 24px; padding: 16px; border-left: 4px solid ${isCompleted ? 'var(--success)' : 'var(--primary)'}; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <strong>${i + 1}. ${c.title}</strong>
            ${isCompleted ? '<span style="color: var(--success);">✅</span>' : `<span style="color: var(--primary);">+${c.xp} XP</span>`}
          </div>
          <p style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">${c.prompt}</p>
          <div style="margin-bottom: 12px;">${platformButtons}</div>
          ${screenshot ? '<div style="background: rgba(255,193,7,0.2); padding: 8px; border-radius: 6px; font-size: 12px; margin-bottom: 8px;">📸 记得截图哦</div>' : ''}
          <div style="font-size: 12px; opacity: 0.7;">💡 ${c.tip}</div>
          ${!isCompleted ? `<button class="btn-secondary" style="margin-top: 12px; font-size: 12px;" onclick="app.markCaseComplete(${index}, ${i})">✅ 标记完成</button>` : ''}
        </div>
      `;
    }).join('');
    
    modalCases.innerHTML = casesHtml;
  }
  
  // 显示模态框
  if (taskModal) {
    taskModal.classList.add('active');
    console.log('✅ 任务模态框已显示');
  } else {
    console.error('❌ 任务模态框不存在 (task-modal)');
  }
};

console.log('✅ openTask 修复补丁已加载');
