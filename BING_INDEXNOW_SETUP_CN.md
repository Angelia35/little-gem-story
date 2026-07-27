# Bing Webmaster Tools 与 IndexNow 设置

## 1. 添加网站
进入 Bing Webmaster Tools，添加 `https://auralisgems.com/`。可以从 Google Search Console 导入，也可以使用 DNS 验证。

## 2. 提交 Sitemap
提交：`https://auralisgems.com/sitemap.xml`

## 3. 上传 IndexNow Key
本包已经生成：

- Key：`024166fbd8937dee265822c7e903b3af`
- 文件：`public/024166fbd8937dee265822c7e903b3af.txt`
- 上线地址：`https://auralisgems.com/024166fbd8937dee265822c7e903b3af.txt`

上线后打开地址，页面只应该显示同一个 Key。

## 4. GitHub 自动提交
上传：

- `scripts/submit-indexnow.mjs`
- `.github/workflows/indexnow-submit.yml`

每次 main 分支的 `public/**` 文件变化后，工作流会把变化的 HTML 映射成规范 URL 并提交给 IndexNow。手动运行 workflow 时，会提交 sitemap 中的全部规范 URL。

## 5. 查看结果
在 Bing Webmaster Tools 的 IndexNow 报告中查看提交、抓取和索引状态。IndexNow 不能保证收录。
