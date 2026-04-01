/**
 * 游戏化增强模块
 * 收集系统、排行榜、streak 挑战
 */

class GamificationManager {
  constructor(app) {
    this.app = app;
    this.collection = {
      cards: [], // AI 卡片收集
      stamps: [], // 印章收集
      achievements: [] // 特殊成就
    };
    this.challenges = {
      streak: [], // 连击挑战
      daily: [], // 每日挑战
      weekly: [] // 每周挑战
    };
    this.leaderboard = {
      records: [] // 学习记录
    };
    this.load();
  }

  // 加载数据
  load() {
    const saved = localStorage.getItem('aiExplorerGamification');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.collection = data.collection || this.collection;
        this.challenges = data.challenges || this.challenges;
        this.leaderboard = data.leaderboard || this.leaderboard;
      } catch (e) {
        console.error('加载游戏化数据失败:', e);
      }
    }
  }

  // 保存数据
  save() {
    localStorage.setItem('aiExplorerGamification', JSON.stringify({
      collection: this.collection,
      challenges: this.challenges,
      leaderboard: this.leaderboard
    }));
  }

  // ========== 收集系统 ==========

  // AI 卡片定义
  getAICards() {
    return [
      { id: 'doubao', name: '豆包', icon: '🎨', rarity: 'common', desc: '创意表达好帮手' },
      { id: 'deepseek', name: 'DeepSeek', icon: '💻', rarity: 'uncommon', desc: '编程小能手' },
      { id: 'tongyi', name: '通义千问', icon: '📝', rarity: 'common', desc: '写作小达人' },
      { id: 'kimi', name: 'Kimi', icon: '📚', rarity: 'uncommon', desc: '知识小百科' },
      { id: 'wenxin', name: '文心一言', icon: '🔍', rarity: 'common', desc: '搜索小能手' },
      { id: 'qingyan', name: '智谱清言', icon: '🎓', rarity: 'rare', desc: '学术小专家' },
      { id: 'yuanbao', name: '腾讯元宝', icon: '💎', rarity: 'rare', desc: '全能小助手' },
      { id: 'master', name: 'AI 大师', icon: '👑', rarity: 'legendary', desc: '集齐所有卡片解锁' }
    ];
  }

  // 添加卡片到收集
  addCard(cardId) {
    const cards = this.getAICards();
    const card = cards.find(c => c.id === cardId);
    
    if (!card) return false;
    if (this.collection.cards.find(c => c.id === cardId)) return false;
    
    this.collection.cards.push({
      ...card,
      collectedAt: new Date().toISOString()
    });
    
    this.save();
    
    // 检查是否集齐所有卡片
    this.checkMasterCard();
    
    return true;
  }

  // 检查大师卡片解锁
  checkMasterCard() {
    const cards = this.getAICards().filter(c => c.id !== 'master');
    const collectedIds = this.collection.cards.map(c => c.id);
    
    const allCollected = cards.every(c => collectedIds.includes(c.id));
    
    if (allCollected && !this.collection.cards.find(c => c.id === 'master')) {
      setTimeout(() => {
        this.addCard('master');
        this.app.showToast('🎉 恭喜！解锁传说卡片：AI 大师！', 'success');
        this.app.confettiManager?.start(5000);
      }, 1000);
    }
  }

  // 添加印章
  addStamp(stampId, name, icon) {
    if (this.collection.stamps.find(s => s.id === stampId)) return false;
    
    this.collection.stamps.push({
      id: stampId,
      name,
      icon,
      collectedAt: new Date().toISOString()
    });
    
    this.save();
    return true;
  }

  // 显示收集册
  showCollectionAlbum() {
    const cards = this.getAICards();
    const collectedIds = this.collection.cards.map(c => c.id);
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-large">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <h3>🃏 AI 卡片收集册</h3>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 24px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 15px; font-weight: 600;">收集进度</div>
                <div style="font-size: 13px; color: var(--secondary); margin-top: 4px;">
                  已收集 ${collectedIds.length}/${cards.length} 张卡片
                </div>
              </div>
              <div style="font-size: 32px; font-weight: 700; color: var(--primary);">
                ${Math.round((collectedIds.length / cards.length) * 100)}%
              </div>
            </div>
            <div style="margin-top: 16px; height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden;">
              <div style="height: 100%; width: ${(collectedIds.length / cards.length) * 100}%; background: linear-gradient(90deg, var(--primary), var(--success)); border-radius: 5px; transition: width 0.5s;"></div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px;">
            ${cards.map(card => {
              const collected = collectedIds.includes(card.id);
              const rarityColors = {
                common: '#86868b',
                uncommon: '#34c759',
                rare: '#0071e3',
                epic: '#af52de',
                legendary: '#ff9500'
              };
              
              return `
                <div class="card-item ${collected ? 'collected' : 'locked'}" 
                     style="padding: 20px; background: ${collected ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)'}; 
                            border-radius: 16px; text-align: center; border: 2px solid ${collected ? rarityColors[card.rarity] : 'transparent'};
                            ${!collected ? 'filter: grayscale(1); opacity: 0.5;' : ''}">
                  <div style="font-size: 48px; margin-bottom: 12px; ${!collected ? 'filter: blur(4px);' : ''}">${card.icon}</div>
                  <div style="font-weight: 600; margin-bottom: 4px;">${card.name}</div>
                  <div style="font-size: 12px; color: var(--secondary); margin-bottom: 8px;">${card.desc}</div>
                  <div style="font-size: 11px; padding: 4px 8px; background: ${rarityColors[card.rarity]}; color: white; border-radius: 10px; display: inline-block;">
                    ${card.rarity === 'common' ? '普通' : card.rarity === 'uncommon' ? '稀有' : card.rarity === 'rare' ? '史诗' : '传说'}
                  </div>
                  ${!collected ? '<div style="margin-top: 8px; font-size: 12px; color: var(--secondary);">🔒 未解锁</div>' : ''}
                </div>
              `;
            }).join('')}
          </div>
          
          <div style="margin-top: 32px;">
            <h4 style="margin-bottom: 12px;">🏅 印章收集</h4>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              ${this.collection.stamps.length > 0 ? this.collection.stamps.map(stamp => `
                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--purple)); 
                           display: flex; align-items: center; justify-content: center; font-size: 28px;
                           box-shadow: 0 4px 12px rgba(0,0,0,0.2);" title="${stamp.name}">
                  ${stamp.icon}
                </div>
              `).join('') : '<p style="color: var(--secondary);">暂无印章，完成任务获得吧！</p>'}
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // ========== 连击挑战 ==========

  // 创建连击挑战
  createStreakChallenge(days, reward) {
    const challenge = {
      id: Date.now().toString(),
      type: 'streak',
      targetDays: days,
      currentDays: 0,
      reward,
      startedAt: new Date().toISOString(),
      completed: false,
      failed: false
    };
    
    this.challenges.streak.push(challenge);
    this.save();
    return challenge;
  }

  // 更新连击进度
  updateStreakProgress(currentStreak) {
    this.challenges.streak.forEach(challenge => {
      if (!challenge.completed && !challenge.failed) {
        challenge.currentDays = currentStreak;
        
        if (challenge.currentDays >= challenge.targetDays) {
          challenge.completed = true;
          this.app.showToast(`🎉 连击挑战完成！获得：${challenge.reward}`, 'success');
        }
      }
    });
    this.save();
  }

  // ========== 每日/每周挑战 ==========

  // 创建每日挑战
  createDailyChallenge(title, target, reward) {
    const challenge = {
      id: Date.now().toString(),
      type: 'daily',
      title,
      target,
      current: 0,
      reward,
      date: new Date().toDateString(),
      completed: false
    };
    
    this.challenges.daily.push(challenge);
    this.save();
    return challenge;
  }

  // 创建每周挑战
  createWeeklyChallenge(title, target, reward) {
    const challenge = {
      id: Date.now().toString(),
      type: 'weekly',
      title,
      target,
      current: 0,
      reward,
      week: this.getWeekNumber(),
      completed: false
    };
    
    this.challenges.weekly.push(challenge);
    this.save();
    return challenge;
  }

  // 获取周数
  getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 604800000;
    return Math.ceil(diff / oneWeek);
  }

  // 更新挑战进度
  updateChallengeProgress(challengeId, value) {
    const allChallenges = [...this.challenges.daily, ...this.challenges.weekly, ...this.challenges.streak];
    const challenge = allChallenges.find(c => c.id === challengeId);
    
    if (challenge) {
      challenge.current = value;
      if (value >= challenge.target && !challenge.completed) {
        challenge.completed = true;
        this.app.showToast(`🎉 挑战完成！获得：${challenge.reward}`, 'success');
        this.app.confettiManager?.start(2000);
        this.addStamp(`challenge_${challengeId}`, challenge.title, '🏆');
      }
      this.save();
    }
  }

  // 清理过期挑战
  cleanupExpiredChallenges() {
    const today = new Date().toDateString();
    const currentWeek = this.getWeekNumber();
    
    // 清理过期每日挑战
    this.challenges.daily = this.challenges.daily.filter(c => {
      if (c.date !== today && !c.completed) {
        c.failed = true;
        return false;
      }
      return c.date === today || c.completed;
    });
    
    // 清理过期每周挑战
    this.challenges.weekly = this.challenges.weekly.filter(c => {
      if (c.week !== currentWeek && !c.completed) {
        c.failed = true;
        return false;
      }
      return c.week === currentWeek || c.completed;
    });
    
    this.save();
  }

  // ========== 排行榜 ==========

  // 添加学习记录
  addRecord(xp, tasksCompleted) {
    const record = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      xp,
      tasksCompleted,
      timestamp: Date.now()
    };
    
    this.leaderboard.records.push(record);
    this.leaderboard.records.sort((a, b) => b.xp - a.xp);
    this.leaderboard.records = this.leaderboard.records.slice(0, 100); // 保留前 100 名
    this.save();
  }

  // 显示排行榜
  showLeaderboard() {
    const records = this.leaderboard.records.slice(0, 10);
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-large">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <h3>🏆 学习排行榜</h3>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 24px;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
              ${records.length >= 2 ? `
                <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #c0c0c0, #e8e8e8); border-radius: 16px;">
                  <div style="font-size: 40px;">🥈</div>
                  <div style="font-weight: 700; font-size: 24px;">${records[1]?.xp || 0} XP</div>
                  <div style="font-size: 12px; opacity: 0.7;">${new Date(records[1]?.date).toLocaleDateString('zh-CN')}</div>
                </div>
              ` : ''}
              ${records.length >= 1 ? `
                <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #ffd700, #ffed4e); border-radius: 16px; transform: scale(1.1);">
                  <div style="font-size: 50px;">🥇</div>
                  <div style="font-weight: 700; font-size: 32px;">${records[0]?.xp || 0} XP</div>
                  <div style="font-size: 12px; opacity: 0.7;">${new Date(records[0]?.date).toLocaleDateString('zh-CN')}</div>
                </div>
              ` : ''}
              ${records.length >= 3 ? `
                <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #cd7f32, #e09856); border-radius: 16px;">
                  <div style="font-size: 40px;">🥉</div>
                  <div style="font-weight: 700; font-size: 24px;">${records[2]?.xp || 0} XP</div>
                  <div style="font-size: 12px; opacity: 0.7;">${new Date(records[2]?.date).toLocaleDateString('zh-CN')}</div>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${records.slice(3).map((record, index) => `
              <div style="display: flex; align-items: center; gap: 16px; padding: 12px 16px; background: rgba(255,255,255,0.05); border-radius: 12px;">
                <div style="width: 30px; height: 30px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">${index + 4}</div>
                <div style="flex: 1;">
                  <div style="font-weight: 600;">${record.xp} XP</div>
                  <div style="font-size: 12px; color: var(--secondary);">${new Date(record.date).toLocaleDateString('zh-CN')}</div>
                </div>
                <div style="font-size: 14px; color: var(--secondary);">${record.tasksCompleted} 任务</div>
              </div>
            `).join('')}
          </div>
          
          ${records.length === 0 ? '<p style="text-align: center; color: var(--secondary); padding: 40px;">暂无记录，开始学习吧！</p>' : ''}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // ========== 预设挑战 ==========

  // 添加预设挑战
  addPresetChallenges() {
    // 连击挑战
    if (this.challenges.streak.length === 0) {
      this.createStreakChallenge(7, '🏅 坚持之星印章');
      this.createStreakChallenge(21, '👑 学习达人印章');
      this.createStreakChallenge(30, '💎 传奇学者印章');
    }
    
    // 每日挑战
    const todayChallenges = this.challenges.daily.filter(c => c.date === new Date().toDateString());
    if (todayChallenges.length === 0) {
      this.createDailyChallenge('完成 1 个任务', 1, '10 XP');
      this.createDailyChallenge('学习 20 分钟', 20, '15 XP');
    }
    
    // 每周挑战
    const currentWeek = this.getWeekNumber();
    const weekChallenges = this.challenges.weekly.filter(c => c.week === currentWeek);
    if (weekChallenges.length === 0) {
      this.createWeeklyChallenge('完成 5 个任务', 5, '🎯 挑战者印章 + 50 XP');
      this.createWeeklyChallenge('获得 300 XP', 300, '⭐ 成就达人印章 + 30 XP');
    }
  }

  // 显示挑战界面
  showChallengesModal() {
    this.cleanupExpiredChallenges();
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-large">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <h3>🎮 挑战中心</h3>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 24px;">
            <h4 style="margin-bottom: 12px;">🔥 连击挑战</h4>
            <div style="display: grid; gap: 12px;">
              ${this.challenges.streak.filter(c => !c.completed && !c.failed).map(c => `
                <div style="padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid var(--warning);">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600;">连续学习 ${c.targetDays} 天</span>
                    <span style="color: var(--success);">${c.reward}</span>
                  </div>
                  <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; width: ${(c.currentDays / c.targetDays) * 100}%; background: linear-gradient(90deg, var(--warning), var(--success)); border-radius: 4px;"></div>
                  </div>
                  <div style="font-size: 12px; color: var(--secondary); margin-top: 8px;">当前：${c.currentDays}/${c.targetDays} 天</div>
                </div>
              `).join('')}
              ${this.challenges.streak.filter(c => !c.completed && !c.failed).length === 0 ? '<p style="color: var(--secondary);">暂无进行中的连击挑战</p>' : ''}
            </div>
          </div>
          
          <div style="margin-bottom: 24px;">
            <h4 style="margin-bottom: 12px;">📅 每日挑战</h4>
            <div style="display: grid; gap: 12px;">
              ${this.challenges.daily.filter(c => !c.completed && !c.failed).map(c => `
                <div style="padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid var(--primary);">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600;">${c.title}</span>
                    <span style="color: var(--success);">${c.reward}</span>
                  </div>
                  <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; width: ${(c.current / c.target) * 100}%; background: linear-gradient(90deg, var(--primary), var(--success)); border-radius: 4px;"></div>
                  </div>
                  <div style="font-size: 12px; color: var(--secondary); margin-top: 8px;">当前：${c.current}/${c.target}</div>
                </div>
              `).join('')}
              ${this.challenges.daily.filter(c => !c.completed && !c.failed).length === 0 ? '<p style="color: var(--secondary);">暂无进行中的每日挑战</p>' : ''}
            </div>
          </div>
          
          <div style="margin-bottom: 24px;">
            <h4 style="margin-bottom: 12px;">📆 每周挑战</h4>
            <div style="display: grid; gap: 12px;">
              ${this.challenges.weekly.filter(c => !c.completed && !c.failed).map(c => `
                <div style="padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid var(--purple);">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600;">${c.title}</span>
                    <span style="color: var(--success);">${c.reward}</span>
                  </div>
                  <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; width: ${(c.current / c.target) * 100}%; background: linear-gradient(90deg, var(--purple), var(--success)); border-radius: 4px;"></div>
                  </div>
                  <div style="font-size: 12px; color: var(--secondary); margin-top: 8px;">当前：${c.current}/${c.target}</div>
                </div>
              `).join('')}
              ${this.challenges.weekly.filter(c => !c.completed && !c.failed).length === 0 ? '<p style="color: var(--secondary);">暂无进行中的每周挑战</p>' : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

// 导出
window.GamificationManager = GamificationManager;