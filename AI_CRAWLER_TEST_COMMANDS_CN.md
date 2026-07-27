# AI爬虫上线测试命令

上传并部署后，可在终端逐条运行：

```bash
curl -I https://auralisgems.com/robots.txt
curl -I -A "OAI-SearchBot" https://auralisgems.com/custom-bracelets
curl -I -A "ChatGPT-User" https://auralisgems.com/custom-bracelets
curl -I -A "PerplexityBot" https://auralisgems.com/custom-bracelets
curl -I -A "Claude-SearchBot" https://auralisgems.com/custom-bracelets
curl -I -A "Bingbot" https://auralisgems.com/custom-bracelets
curl -I -A "Googlebot" https://auralisgems.com/custom-bracelets
```

期望：核心页面返回 `200`。如果出现 `403`、`429`、Cloudflare Challenge、CAPTCHA或登录页，需要在Cloudflare AI Crawl Control、Bots、WAF和Rate Limiting中检查拦截规则。

浏览器还需要检查：

- https://auralisgems.com/robots.txt
- https://auralisgems.com/llms.txt
- IndexNow Key地址（见UPLOAD_README_CN.txt）
