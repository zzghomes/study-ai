// AI 探险家 - 音效系统

class SoundManager {
  constructor() {
    this.enabled = true;
    this.audioContext = null;
    this.init();
  }

  // 初始化音频上下文
  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API 不支持');
      this.enabled = false;
    }
  }

  // 播放成功音效
  playSuccess() {
    if (!this.enabled) return;
    this.playTone(523.25, 'sine', 0.1, 0);
    this.playTone(659.25, 'sine', 0.1, 0.1);
    this.playTone(783.99, 'sine', 0.2, 0.2);
  }

  // 播放升级音效
  playLevelUp() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      this.playTone(freq, 'sine', 0.15, i * 0.1);
    });
  }

  // 播放徽章解锁音效
  playBadgeUnlock() {
    if (!this.enabled) return;
    const notes = [783.99, 987.77, 1174.66, 1318.51];
    notes.forEach((freq, i) => {
      this.playTone(freq, 'triangle', 0.2, i * 0.1);
    });
  }

  // 播放点击音效
  playClick() {
    if (!this.enabled) return;
    this.playTone(880, 'sine', 0.05, 0);
  }

  // 播放错误音效
  playError() {
    if (!this.enabled) return;
    this.playTone(150, 'sawtooth', 0.2, 0);
    this.playTone(100, 'sawtooth', 0.3, 0.15);
  }

  // 播放完成任务音效
  playTaskComplete() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
    notes.forEach((freq, i) => {
      this.playTone(freq, 'sine', 0.15, i * 0.08);
    });
  }

  // 播放单个音调
  playTone(frequency, type, duration, delay) {
    if (!this.audioContext) return;
    
    setTimeout(() => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    }, delay * 1000);
  }

  // 启用音效
  enable() {
    this.enabled = true;
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // 禁用音效
  disable() {
    this.enabled = false;
  }
}

// 创建全局音效管理器
const soundManager = new SoundManager();

// 彩带庆祝效果
class ConfettiManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
  }

  // 创建彩带画布
  createCanvas() {
    if (this.canvas) return;
    
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  // 调整画布大小
  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // 创建粒子
  createParticle() {
    const colors = ['#0071e3', '#af52de', '#ff2d55', '#ff9500', '#34c759', '#5ac8fa'];
    return {
      x: Math.random() * this.canvas.width,
      y: -20,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 4 - 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5
    };
  }

  // 启动彩带效果
  start(duration = 3000) {
    this.createCanvas();
    
    // 创建粒子
    for (let i = 0; i < 150; i++) {
      this.particles.push(this.createParticle());
    }
    
    this.animate();
    
    // 停止动画
    setTimeout(() => {
      this.stop();
    }, duration);
  }

  // 动画循环
  animate() {
    if (!this.ctx) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((p, index) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;
      
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
      
      // 移除超出屏幕的粒子
      if (p.y > this.canvas.height + 20) {
        this.particles.splice(index, 1);
      }
    });
    
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  // 停止彩带效果
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.particles = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// 创建全局彩带管理器
const confettiManager = new ConfettiManager();
