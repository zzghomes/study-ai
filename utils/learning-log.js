// AI 探险家 - 过程记录模块（基础版）
// 版本：2026-03-25
// 功能：记录学习过程中的提示词、感想、作品等

const LearningLog = {
  // 日志数据结构
  logs: [],
  
  // 初始化
  init() {
    this.loadFromStorage();
    console.log('✅ 学习日志模块已初始化');
  },
  
  // 从 localStorage 加载
  loadFromStorage() {
    const saved = localStorage.getItem('learningLogs');
    if (saved) {
      try {
        this.logs = JSON.parse(saved);
      } catch (e) {
        console.error('加载日志失败:', e);
        this.logs = [];
      }
    }
  },
  
  // 保存到 localStorage
  saveToStorage() {
    localStorage.setItem('learningLogs', JSON.stringify(this.logs));
  },
  
  // 添加日志记录
  addLog(entry) {
    const log = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      levelId: entry.levelId || null,      // 关卡 ID
      taskId: entry.taskId || null,        // 任务 ID
      type: entry.type || 'text',          // 类型：text/image/reflection
      content: entry.content || '',        // 内容
      prompt: entry.prompt || '',          // 使用的提示词
      platform: entry.platform || '',      // 使用的平台
      rating: entry.rating || 0,           // 评分 1-5
      tags: entry.tags || [],              // 标签
      screenshot: entry.screenshot || null // 截图（base64 或 URL）
    };
    
    this.logs.push(log);
    this.saveToStorage();
    console.log('✅ 日志已保存:', log.id);
    return log;
  },
  
  // 获取某关卡的所有日志
  getLogsByLevel(levelId) {
    return this.logs.filter(log => log.levelId === levelId);
  },
  
  // 获取某类型的日志
  getLogsByType(type) {
    return this.logs.filter(log => log.type === type);
  },
  
  // 获取最近的日志
  getRecentLogs(limit = 10) {
    return this.logs.slice(-limit).reverse();
  },
  
  // 删除日志
  deleteLog(logId) {
    const index = this.logs.findIndex(log => log.id === logId);
    if (index !== -1) {
      this.logs.splice(index, 1);
      this.saveToStorage();
      console.log('✅ 日志已删除:', logId);
      return true;
    }
    return false;
  },
  
  // 清空所有日志
  clearAll() {
    if (confirm('确定要清空所有学习日志吗？此操作不可恢复！')) {
      this.logs = [];
      this.saveToStorage();
      console.log('✅ 所有日志已清空');
      return true;
    }
    return false;
  },
  
  // 导出日志为 JSON
  exportLogs() {
    const data = {
      exportDate: new Date().toISOString(),
      totalLogs: this.logs.length,
      logs: this.logs
    };
    return JSON.stringify(data, null, 2);
  },
  
  // 导入日志
  importLogs(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.logs && Array.isArray(data.logs)) {
        this.logs = data.logs;
        this.saveToStorage();
        console.log('✅ 已导入', this.logs.length, '条日志');
        return true;
      }
    } catch (e) {
      console.error('导入日志失败:', e);
    }
    return false;
  },
  
  // 获取日志统计
  getStats() {
    return {
      total: this.logs.length,
      byType: {
        text: this.logs.filter(l => l.type === 'text').length,
        image: this.logs.filter(l => l.type === 'image').length,
        reflection: this.logs.filter(l => l.type === 'reflection').length
      },
      byLevel: this.logs.reduce((acc, log) => {
        if (log.levelId) {
          acc[log.levelId] = (acc[log.levelId] || 0) + 1;
        }
        return acc;
      }, {}),
      avgRating: this.logs.filter(l => l.rating > 0).reduce((sum, l) => sum + l.rating, 0) / 
                 (this.logs.filter(l => l.rating > 0).length || 1)
    };
  }
};

// 学习日志 UI 组件
const LearningLogUI = {
  // 渲染日志输入框
  renderLogInput(levelId, taskId, logPrompts = []) {
    const container = document.createElement('div');
    container.className = 'learning-log-input';
    
    let promptsHtml = '';
    if (logPrompts.length > 0) {
      promptsHtml = `
        <div class="log-prompts">
          <h4>💡 思考一下：</h4>
          <ul>
            ${logPrompts.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    container.innerHTML = `
      <div class="log-header">
        <h3>📝 过程记录</h3>
        <button class="btn-toggle-log">收起</button>
      </div>
      ${promptsHtml}
      <div class="log-form">
        <div class="form-group">
          <label>提示词记录：</label>
          <textarea class="log-prompt" placeholder="你使用了什么提示词？"></textarea>
        </div>
        <div class="form-group">
          <label>学习感想：</label>
          <textarea class="log-content" placeholder="你有什么收获或发现？"></textarea>
        </div>
        <div class="form-group">
          <label>满意度评分：</label>
          <div class="rating-input">
            ${[1,2,3,4,5].map(i => 
              `<span class="rating-star" data-rating="${i}">☆</span>`
            ).join('')}
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-save-log">💾 保存记录</button>
          <button class="btn-cancel-log">取消</button>
        </div>
      </div>
    `;
    
    // 绑定事件
    this.bindLogEvents(container, levelId, taskId);
    
    return container;
  },
  
  // 绑定日志输入事件
  bindLogEvents(container, levelId, taskId) {
    // 评分星星
    const stars = container.querySelectorAll('.rating-star');
    let currentRating = 0;
    
    stars.forEach(star => {
      star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.rating);
        stars.forEach((s, i) => {
          s.textContent = i < currentRating ? '★' : '☆';
        });
      });
    });
    
    // 保存按钮
    const saveBtn = container.querySelector('.btn-save-log');
    saveBtn.addEventListener('click', () => {
      const prompt = container.querySelector('.log-prompt').value.trim();
      const content = container.querySelector('.log-content').value.trim();
      
      if (!prompt && !content) {
        alert('请填写提示词或感想内容');
        return;
      }
      
      LearningLog.addLog({
        levelId,
        taskId,
        type: 'text',
        prompt,
        content,
        rating: currentRating
      });
      
      alert('✅ 记录已保存！');
      container.querySelector('.log-prompt').value = '';
      container.querySelector('.log-content').value = '';
      currentRating = 0;
      stars.forEach(s => s.textContent = '☆');
      
      // 刷新日志列表
      if (typeof LearningLogUI !== 'undefined') {
        LearningLogUI.renderLogList(levelId);
      }
    });
    
    // 收起按钮
    const toggleBtn = container.querySelector('.btn-toggle-log');
    toggleBtn.addEventListener('click', () => {
      const form = container.querySelector('.log-form');
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
      toggleBtn.textContent = form.style.display === 'none' ? '展开' : '收起';
    });
  },
  
  // 渲染日志列表
  renderLogList(levelId = null) {
    const logs = levelId ? LearningLog.getLogsByLevel(levelId) : LearningLog.getRecentLogs(20);
    
    const container = document.createElement('div');
    container.className = 'learning-log-list';
    
    if (logs.length === 0) {
      container.innerHTML = '<p class="no-logs">暂无记录</p>';
      return container;
    }
    
    container.innerHTML = `
      <div class="log-list-header">
        <h4>📋 我的记录 (${logs.length})</h4>
      </div>
      <div class="log-items">
        ${logs.map(log => `
          <div class="log-item" data-log-id="${log.id}">
            <div class="log-meta">
              <span class="log-date">${new Date(log.timestamp).toLocaleDateString('zh-CN')}</span>
              <span class="log-type">${this.getLogTypeIcon(log.type)}</span>
              ${log.rating > 0 ? `<span class="log-rating">${'★'.repeat(log.rating)}${'☆'.repeat(5-log.rating)}</span>` : ''}
            </div>
            ${log.prompt ? `<div class="log-prompt"><strong>提示词：</strong>${this.escapeHtml(log.prompt)}</div>` : ''}
            ${log.content ? `<div class="log-content">${this.escapeHtml(log.content)}</div>` : ''}
            <div class="log-actions">
              <button class="btn-delete-log" data-log-id="${log.id}">🗑️ 删除</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // 绑定删除事件
    container.querySelectorAll('.btn-delete-log').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const logId = e.target.dataset.logId;
        if (LearningLog.deleteLog(logId)) {
          btn.closest('.log-item').remove();
          container.querySelector('.log-list-header h4').textContent = 
            `📋 我的记录 (${LearningLog.getLogsByLevel(levelId).length})`;
        }
      });
    });
    
    return container;
  },
  
  // 获取类型图标
  getLogTypeIcon(type) {
    const icons = {
      text: '📝',
      image: '🖼️',
      reflection: '💭'
    };
    return icons[type] || '📝';
  },
  
  // HTML 转义
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// 初始化
if (typeof window !== 'undefined') {
  window.LearningLog = LearningLog;
  window.LearningLogUI = LearningLogUI;
  
  // DOM 加载完成后初始化
  document.addEventListener('DOMContentLoaded', () => {
    LearningLog.init();
  });
}

// 模块已注册到全局 window 对象
// 使用方式：window.LearningLog, window.LearningLogUI
