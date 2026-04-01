import urllib.request
import ssl

# 创建 SSL 上下文（不验证证书）
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

url = "https://xfy60f0qyq.feishu.cn/docx/Bxt7dXGBkoC990xthW2cC9eTnVQ"

try:
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    response = urllib.request.urlopen(req, context=ssl_context, timeout=30)
    html_content = response.read().decode('utf-8')
    
    with open('feishu_doc.txt', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("成功获取文档内容，已保存到 feishu_doc.txt")
except Exception as e:
    print(f"获取失败：{e}")
    with open('feishu_doc.txt', 'w', encoding='utf-8') as f:
        f.write(f"获取失败：{e}")