AURALIS 第三阶段第二个统一更新包：AI搜索抓取与引用基础 v1

核心目标
- 允许 ChatGPT Search、Perplexity、Claude Search、Bing/Google 搜索抓取
- 明确允许 search 和 ai-input，拒绝 ai-train
- 使用 IndexNow 通知 Bing 及参与搜索引擎已更新的URL
- 统一 Auralis 品牌实体 Schema
- 给商业页面增加可以被独立引用的 Direct Answer Blocks
- 建立跨 ChatGPT、Google AI、Bing Copilot、Perplexity、Claude 的测试表

上传顺序
1. public/assets/auralis-phase3-v2.css
2. public/assets/auralis-phase3-v2.js
3. public/robots.txt
4. public/llms.txt
5. public/024166fbd8937dee265822c7e903b3af.txt
6. public 目录中的所有 HTML 页面
7. public/sitemap.xml
8. scripts/submit-indexnow.mjs
9. .github/workflows/indexnow-submit.yml

注意
- snippets 中的首页与 About 模块是安全插入片段，不要用旧首页文件整页覆盖现在的网站。
- llms.txt 是辅助机器读取的可选文件，不是 Google、ChatGPT 或任何AI平台承诺的排名因素。
- IndexNow 只是通知搜索引擎URL已更新，不保证收录或AI引用。

上线测试
https://auralisgems.com/robots.txt
https://auralisgems.com/llms.txt
https://auralisgems.com/024166fbd8937dee265822c7e903b3af.txt
https://auralisgems.com/custom-bracelets?v=ai-search-v1
https://auralisgems.com/custom-bracelet-pricing-process-delivery?v=ai-search-v1
https://auralisgems.com/crystal-material-authenticity?v=ai-search-v1
https://auralisgems.com/wholesale-custom-crystal-bracelets?v=ai-search-v1
https://auralisgems.com/guides/how-to-choose-crystals-for-a-bracelet?v=ai-search-v1
