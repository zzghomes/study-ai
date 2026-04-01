

$url = "https://xfy60f0qyq.feishu.cn/docx/Bxt7dXGBkoC990xthW2cC9eTnVQ"

try {
    $req = [System.Net.HttpWebRequest]::Create($url)
    $req.Method = "GET"
    $req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    $req.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    $req.Headers.Add("Accept-Language", "zh-CN,zh;q=0.9")
    
    $response = $req.GetResponse()
    $reader = New-Object System.IO.StreamReader($response.GetResponseStream(), [System.Text.Encoding]::UTF8)
    $htmlContent = $reader.ReadToEnd()
    $reader.Close()
    $response.Close()
    
    $htmlContent | Out-File -FilePath "feishu_doc.txt" -Encoding UTF8
    Write-Host "成功获取文档内容，已保存到 feishu_doc.txt"
} catch {
    $errorMsg = "获取失败：$($_.Exception.Message)"
    Write-Host $errorMsg
    $errorMsg | Out-File -FilePath "feishu_doc.txt" -Encoding UTF8
}