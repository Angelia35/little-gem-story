# Cloudflare AI 爬虫检查

## 必查设置
1. 打开 Cloudflare → AI Crawl Control → Crawlers。
2. 确认以下搜索/用户请求爬虫为 Allow：
   - OAI-SearchBot
   - ChatGPT-User
   - PerplexityBot
   - Perplexity-User
   - Claude-SearchBot
   - Claude-User
   - Bingbot
   - Googlebot
3. GPTBot 与 ClaudeBot 可以保持 Block，因为它们用于模型开发/训练，不是实时搜索引用所必需。
4. 检查 Directives/robots.txt，确认 robots.txt 返回 200。
5. 检查状态码：不要让上述搜索爬虫收到 403、429、JS Challenge、CAPTCHA 或登录页。
6. Cloudflare → Cache/Configuration → 启用 Crawler Hints。它可以基于缓存变化向 IndexNow 发送提示。

## robots.txt 内容信号
本包使用：

`Content-Signal: search=yes, ai-input=yes, ai-train=no, use=reference`

含义：允许搜索索引和实时AI回答引用，不授权模型训练，并希望引用时保留来源。Google Search Console 可能对较新的 Content-Signal 指令显示“不理解语法”，Cloudflare说明这不影响正常抓取。
