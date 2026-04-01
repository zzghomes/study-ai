// AI 探险家 - 证书生成系统

class CertificateGenerator {
  constructor() {
    this.canvas = null;
    this.ctx = null;
  }

  // 生成证书
  generateCertificate(childName, completedDate, badges) {
    const width = 800;
    const height = 600;
    
    // 创建画布
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    
    // 绘制背景
    this.drawBackground(width, height);
    
    // 绘制边框
    this.drawBorder(width, height);
    
    // 绘制标题
    this.drawTitle(width);
    
    // 绘制副标题
    this.drawSubtitle(width);
    
    // 绘制孩子姓名
    this.drawName(childName, width);
    
    // 绘制完成日期
    this.drawDate(completedDate, width);
    
    // 绘制获得的徽章
    this.drawBadges(badges, width);
    
    // 绘制签名区域
    this.drawSignature(width);
    
    // 返回证书图片
    return this.canvas.toDataURL('image/png');
  }

  // 绘制背景
  drawBackground(width, height) {
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
  }

  // 绘制边框
  drawBorder(width, height) {
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 8;
    this.ctx.strokeRect(20, 20, width - 40, height - 40);
    
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(35, 35, width - 70, height - 70);
  }

  // 绘制标题
  drawTitle(width) {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🏆 AI 探险家毕业证书', width / 2, 120);
  }

  // 绘制副标题
  drawSubtitle(width) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.font = '24px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('圆满完成 21 天 AI 学习挑战', width / 2, 170);
  }

  // 绘制姓名
  drawName(childName, width) {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('授予:', width / 2, 240);
    
    this.ctx.font = 'bold 52px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.fillText(childName, width / 2, 300);
  }

  // 绘制日期
  drawDate(completedDate, width) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.font = '20px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`完成日期：${completedDate}`, width / 2, 360);
  }

  // 绘制徽章
  drawBadges(badges, width) {
    const unlockedBadges = badges.filter(b => b.unlocked);
    const startY = 400;
    const badgeSize = 50;
    const gap = 60;
    const totalWidth = unlockedBadges.length * gap;
    const startX = (width - totalWidth) / 2 + gap / 2;
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('获得的徽章:', width / 2, 390);
    
    unlockedBadges.forEach((badge, index) => {
      const x = startX + index * gap;
      const y = startY;
      
      // 绘制徽章背景
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(x, y, badgeSize / 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      // 绘制徽章图标
      this.ctx.font = '30px Arial, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillStyle = '#000000';
      this.ctx.fillText(badge.icon, x, y);
    });
  }

  // 绘制签名区域
  drawSignature(width) {
    const y = 520;
    
    // 家长签名
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('家长签名：________________', 80, y);
    
    // 日期
    this.ctx.textAlign = 'right';
    this.ctx.fillText('AI 探险家认证', width - 80, y);
  }

  // 显示证书
  showCertificate(dataUrl) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.zIndex = '10000';
    
    modal.innerHTML = `
      <div class="modal-content modal-large" style="max-width: 900px;">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header">
          <h3>🎉 毕业证书</h3>
        </div>
        <div class="modal-body" style="text-align: center;">
          <img src="${dataUrl}" alt="证书" style="max-width: 100%; border-radius: 12px; box-shadow: 0 8px 40px rgba(0,0,0,0.2);">
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="this.closest('.modal').remove()">关闭</button>
          <button class="btn-primary" onclick="app.downloadCertificate('${dataUrl}')">📥 下载证书</button>
          <button class="btn-primary" onclick="app.printCertificate('${dataUrl}')">🖨️ 打印证书</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  // 下载证书
  downloadCertificate(dataUrl) {
    const link = document.createElement('a');
    link.download = `AI 探险家证书-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    link.click();
  }

  // 打印证书
  printCertificate(dataUrl) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AI 探险家证书</title>
        <style>
          body { 
            margin: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh;
            background: #f5f5f7;
          }
          img { max-width: 100%; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" alt="证书">
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}

// 创建全局证书生成器
const certificateGenerator = new CertificateGenerator();
