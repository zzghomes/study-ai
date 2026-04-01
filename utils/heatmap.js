// AI 探险家 - 学习日历热力图模块（增强版 - 支持多孩子）

class LearningHeatmap {
  constructor(app) {
    this.app = app;
    this.container = null;
  }

  // 生成热力图数据（支持多孩子）
  generateHeatmapData() {
    const data = [];
    const daysToShow = 180; // 显示过去 180 天
    
    // 获取当前孩子
    const currentChild = this.app.multiChild?.getCurrentChild();
    
    if (currentChild) {
      // 从当前孩子的数据中获取学习历史
      return this.generateFromChildData(currentChild, daysToShow);
    } else {
      // 没有多孩子数据时，使用旧的兼容逻辑
      return this.generateFromLegacyData(daysToShow);
    }
  }

  // 从孩子数据生成热力图
  generateFromChildData(child, daysToShow) {
    const data = [];
    const learningDays = new Set();
    
    // 从孩子的任务完成日期获取学习日
    if (child.tasks && Array.isArray(child.tasks)) {
      child.tasks.forEach(task => {
        if (task.completed && task.completedDate) {
          const dateStr = task.completedDate.split('T')[0];
          learningDays.add(dateStr);
        }
      });
    }
    
    // 从孩子的学习日记获取额外学习日
    if (child.data?.learningDiary && Array.isArray(child.data.learningDiary)) {
      child.data.learningDiary.forEach(entry => {
        if (entry.date) {
          learningDays.add(entry.date);
        }
      });
    }
    
    // 生成热力图数据
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // 根据学习次数设置不同等级
      let count = learningDays.has(dateStr) ? 1 : 0;
      let level = 0;
      
      if (count > 0) {
        // 根据连续学习天数设置等级
        const consecutiveDays = this.countConsecutiveDays(learningDays, date);
        if (consecutiveDays >= 30) level = 4;
        else if (consecutiveDays >= 14) level = 3;
        else if (consecutiveDays >= 7) level = 2;
        else level = 1;
      }
      
      data.push({
        date: dateStr,
        count: count,
        level: level
      });
    }

    return data;
  }

  // 从旧数据生成热力图（兼容模式）
  generateFromLegacyData(daysToShow) {
    const data = [];
    const learningDays = new Set();
    
    // 获取学习记录
    const saved = localStorage.getItem('aiExplorerData');
    
    // 安全地加载学习历史
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 检查数据结构是否存在
        if (parsed.data) {
          // 优先使用 learningHistory
          if (Array.isArray(parsed.data.learningHistory) && parsed.data.learningHistory.length > 0) {
            parsed.data.learningHistory.forEach(date => {
              if (typeof date === 'string') {
                learningDays.add(date);
              }
            });
          }
          // 如果没有 learningHistory，尝试从 lastActiveDate 推算
          else if (parsed.data.lastActiveDate) {
            const lastDate = new Date(parsed.data.lastActiveDate);
            const streak = parsed.data.streak || 0;
            if (streak > 0) {
              for (let i = 0; i < streak; i++) {
                const date = new Date(lastDate);
                date.setDate(date.getDate() - i);
                learningDays.add(date.toISOString().split('T')[0]);
              }
            }
          }
        }
      } catch (e) {
        console.error('加载学习历史失败:', e);
      }
    }

    // 如果没有历史记录，使用 APP_DATA 的连击数据模拟
    if (learningDays.size === 0) {
      const streak = APP_DATA.streak || 0;
      if (streak > 0) {
        console.log('🔥 使用连击数据生成热力图，连击天数:', streak);
        for (let i = 0; i < streak; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          learningDays.add(date.toISOString().split('T')[0]);
        }
      } else {
        // 如果连击也为 0，使用任务完成数据
        if (typeof LEARNING_TASKS !== 'undefined') {
          LEARNING_TASKS.forEach(task => {
            if (task.completed && task.completedDate) {
              learningDays.add(task.completedDate.split('T')[0]);
            }
          });
        }
      }
    }

    // 生成热力图数据
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // 根据学习次数设置不同等级
      let count = learningDays.has(dateStr) ? 1 : 0;
      let level = 0;
      
      if (count > 0) {
        // 根据连续学习天数设置等级
        const consecutiveDays = this.countConsecutiveDays(learningDays, date);
        if (consecutiveDays >= 30) level = 4;
        else if (consecutiveDays >= 14) level = 3;
        else if (consecutiveDays >= 7) level = 2;
        else level = 1;
      }
      
      data.push({
        date: dateStr,
        count: count,
        level: level
      });
    }

    return data;
  }

  // 计算从给定日期往前的连续学习天数
  countConsecutiveDays(learningDays, fromDate) {
    let count = 0;
    const date = new Date(fromDate);
    
    while (learningDays.has(date.toISOString().split('T')[0])) {
      count++;
      date.setDate(date.getDate() - 1);
    }
    
    return count;
  }

  // 渲染热力图
  render(containerId) {
    console.log('🔥 开始渲染热力图，容器 ID:', containerId);
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('❌ 未找到容器元素:', containerId);
      return;
    }

    const data = this.generateHeatmapData();
    console.log('🔥 热力图数据:', data.length, '天');
    
    // 获取当前主题
    const isSpaceTheme = document.documentElement.getAttribute('data-theme') === 'space';
    const colors = isSpaceTheme 
      ? ['#1a1a2e', '#2d2d44', '#4a4a6a', '#6c5ce7', '#a29bfe']
      : ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

    // 直接渲染内容到容器
    this.container.innerHTML = `
      <div class="heatmap-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h4 style="margin: 0;">📅 学习热力图</h4>
        <div class="heatmap-legend" style="display: flex; align-items: center; gap: 4px; font-size: 12px;">
          <span>较少</span>
          <div class="legend-box" style="width: 12px; height: 12px; background: ${colors[0]}; border-radius: 2px;"></div>
          <div class="legend-box" style="width: 12px; height: 12px; background: ${colors[1]}; border-radius: 2px;"></div>
          <div class="legend-box" style="width: 12px; height: 12px; background: ${colors[2]}; border-radius: 2px;"></div>
          <div class="legend-box" style="width: 12px; height: 12px; background: ${colors[3]}; border-radius: 2px;"></div>
          <div class="legend-box" style="width: 12px; height: 12px; background: ${colors[4]}; border-radius: 2px;"></div>
          <span>较多</span>
        </div>
      </div>
      <div class="heatmap-grid" id="heatmap-grid" style="display: flex; gap: 4px; overflow-x: auto; padding: 8px 0;"></div>
    `;

    const grid = document.getElementById('heatmap-grid');
    if (!grid) {
      console.error('❌ 未找到 heatmap-grid 元素');
      return;
    }
    
    const weeks = this.groupDataByWeek(data);
    console.log('🔥 热力图周数:', weeks.length);

    // 渲染每周
    weeks.forEach((week, weekIndex) => {
      const weekEl = document.createElement('div');
      weekEl.className = 'heatmap-week';
      weekEl.style.display = 'flex';
      weekEl.style.flexDirection = 'column';
      weekEl.style.gap = '4px';
      
      week.forEach((day, dayIndex) => {
        const dayEl = document.createElement('div');
        dayEl.className = 'heatmap-day';
        dayEl.style.width = '12px';
        dayEl.style.height = '12px';
        dayEl.style.borderRadius = '2px';
        dayEl.style.background = colors[day.level];
        dayEl.title = `${day.date}: ${day.count > 0 ? '学习了' : '未学习'}`;
        dayEl.dataset.date = day.date;
        weekEl.appendChild(dayEl);
      });
      
      grid.appendChild(weekEl);
    });
    
    console.log('✅ 热力图渲染完成');
  }

  // 按周分组数据
  groupDataByWeek(data) {
    const weeks = [];
    let currentWeek = [];
    
    // 找到第一天是周几
    const firstDate = new Date(data[0].date);
    const startDay = firstDate.getDay();
    
    // 添加空白占位
    for (let i = 0; i < startDay; i++) {
      currentWeek.push({ date: '', count: 0, level: 0 });
    }
    
    data.forEach((day, index) => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7 || index === data.length - 1) {
        // 补齐最后一周
        while (currentWeek.length < 7) {
          currentWeek.push({ date: '', count: 0, level: 0 });
        }
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeks;
  }

  // 刷新热力图
  refresh() {
    if (this.container) {
      this.render(this.container.id);
    }
  }
}

// 导出供全局使用
if (typeof window !== 'undefined') {
  window.LearningHeatmap = LearningHeatmap;
}