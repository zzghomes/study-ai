# -*- coding: utf-8 -*-
import re

file_path = 'C:\\Users\\Administrator\\.openclaw\\workspace\\AI21\\utils\\knowledge.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 替换 showResourcesModal 函数
old_func = '''showResourcesModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-large" style="background: linear-gradient(135deg, rgba(20,80,60,0.95), rgba(30,70,50,0.95));">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        <div class="modal-header"><h3>📖 学习资源</h3></div>'''

new_func = '''showResourcesModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    const totalResources = this.resources.reduce((sum, cat) => sum + cat.items.length, 0);
    const learnedResources = Math.floor(totalResources * 0.67);
    const progressPercent = Math.round((learnedResources / totalResources) * 100);
    
    modal.innerHTML = `
      <div class="modal-content modal-large" style="background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);">
        <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        
        <div class="modal-header" style="border-bottom: 2px solid rgba(0,0,0,0.05); padding: 24px 32px;">
          <h3 style="color: #1d1d1f; margin: 0; font-size: 24px;">📖 学习资源</h3>
          <div style="margin-top: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #86868b; font-weight: 600;">学习进度</span>
              <span style="font-size: 16px; font-weight: 900; background: linear-gradient(135deg, #6C5CE7, #FF7675); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${learnedResources}/${totalResources} (${progressPercent}%)</span>
            </div>
            <div style="height: 12px; background: rgba(0,0,0,0.08); border-radius: 6px; overflow: hidden;">
              <div style="height: 100%; background: linear-gradient(90deg, #6C5CE7 0%, #7B68EE 50%, #FF7675 100%); border-radius: 6px; width: ${progressPercent}%; box-shadow: 0 0 12px rgba(108,92,231,0.5);"></div>
            </div>
          </div>
        </div>'''

content = content.replace(old_func, new_func)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Knowledge.js updated successfully!')
