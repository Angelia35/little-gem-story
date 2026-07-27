Auralis 第三阶段第三个统一更新包：AI Citation Competitiveness v1

本包目的：
让价格、预算推荐和定制流程信息更容易被客户、搜索引擎和 AI 作为完整答案理解和引用。
不能保证 ChatGPT、Copilot 或其他 AI 一定引用 Auralis。

上传顺序：
1. public/assets/auralis-phase3-v3.css -> public/assets/auralis-phase3-v3.css
2. public/assets/auralis-phase3-v3.js -> public/assets/auralis-phase3-v3.js
3. public/custom-bracelet-pricing-process-delivery.html -> public/custom-bracelet-pricing-process-delivery.html
4. public/custom-crystal-bracelet-specifications.html -> public/custom-crystal-bracelet-specifications.html
5. public/custom-bracelets.html -> public/custom-bracelets.html
6. public/llms.txt -> public/llms.txt
7. public/sitemap.xml -> public/sitemap.xml

不要上传 snippets/ 到 public。该目录只是后续真实案例模板。

测试：
https://auralisgems.com/custom-bracelet-pricing-process-delivery?v=citationv1
https://auralisgems.com/custom-crystal-bracelet-specifications?v=citationv1
https://auralisgems.com/custom-bracelets?v=citationv1
https://auralisgems.com/llms.txt
https://auralisgems.com/sitemap.xml

上线后：
- Bing Live URL 测试三个页面
- 每页 Request indexing 一次
- GSC 对三个页面请求重新抓取
- 不要重复运行 IndexNow；GitHub main 更新后会自动提交
- 7–14天后用临时聊天和无品牌问题复测 ChatGPT/Copilot/Perplexity
