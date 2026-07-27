import fs from "node:fs";

const host = "auralisgems.com";
const key = "024166fbd8937dee265822c7e903b3af";
const keyLocation = `https://${host}/${key}.txt`;
const sitemapPath = "public/sitemap.xml";

function canonicalFromFile(file) {
  if (!file.startsWith("public/") || !file.endsWith(".html")) return null;
  let rel = file.slice("public/".length);
  if (rel === "index.html") return `https://${host}/`;
  if (rel.endsWith("/index.html")) return `https://${host}/${rel.slice(0, -"index.html".length)}`;
  return `https://${host}/${rel.slice(0, -".html".length)}`;
}

function allSitemapUrls() {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
}

const changed = (process.env.CHANGED_FILES || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean);
let urls = [...new Set(changed.map(canonicalFromFile).filter(Boolean))];
if (!urls.length) urls = allSitemapUrls();

if (!urls.length) {
  console.log("No canonical URLs to submit.");
  process.exit(0);
}

const payload = { host, key, keyLocation, urlList: urls };
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload)
});

const body = await response.text();
console.log(`IndexNow submitted ${urls.length} URL(s). Status: ${response.status} ${body}`);
if (!response.ok && response.status !== 202) process.exit(1);
