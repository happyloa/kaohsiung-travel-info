![高雄市旅遊資訊網預覽](https://raw.githubusercontent.com/happyloa/Kaohsiung-travel-info/refs/heads/master/static/thumb.webp)

# 高雄市旅遊資訊網

以 SvelteKit 3、Svelte 5、Tailwind CSS 4 製作，部署於 Cloudflare Pages。

- 行政區篩選、熱門區域按鈕、景點分頁。
- 顯示照片、開放時間、地址、電話及免費參觀標示。
- 深淺色模式、鍵盤操作與減少動態效果偏好。
- 伺服器渲染首屏內容，提供 SEO metadata、JSON-LD 與 sitemap。

## 開發與驗證

建議使用 `.node-version` 指定的 Node.js 24.22.2，以及 npm 12.2.2。

```bash
npm ci
npm run dev
npm run verify
```

`verify` 包含型別檢查、正式建置與安全檢查。型別檢查使用 TypeScript 7 與 `svelte-check --tsgo`；依工具鏈需求保留 TypeScript 6，相應的 Node 型別維持 24 系列。

`npm run audit` 僅排除官方已於 2026-11-02 [撤銷的 CVE-2026-93753](https://github.com/CVEProject/cvelistV5/blob/main/cves/2026/93xxx/CVE-2026-93753.json) 及其純相依鏈。原始 `npm audit` 暫仍列出 4 個 low 誤報；其他漏洞與檢查失敗仍會阻擋驗證。npm 資料庫同步後即可移除此例外。

## 資料與資源

資料由伺服器取得並驗證：[HexSchool 高雄旅遊資料集](https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json)。請求逾時為 10 秒，成功結果快取一小時；快取不可用時回源，失敗時顯示中文提示。資料原始更新時間為 2015 年，出發前請向景點確認資訊。

```bash
npm run assets:sync
```

此命令更新景點照片與字型分段，需一併提交 `src/lib/media.json`、`static/images/` 和 `src/lib/assets/`。正常建置使用已提交資源，不需下載圖片或字型。

- 景點照片提供 480／800 px WebP；首屏圖片提供 640／800／1280 px 版本。
- 已收錄照片使用本機檔案，新出現的照片網址保留原圖作為備援。
- 思源黑體依介面及分頁字元分段，保留 400–700 字重；未能及時載入時使用系統字型。
- 圖片與字型使用雜湊檔名及長效快取。字型授權見 `static/fonts/OFL.txt`。

## 效能

2026-11-08，Lighthouse 13.6.0，本機 Cloudflare 正式產物、預設模擬節流：

| 項目 | 手機 | 桌面 |
| --- | ---: | ---: |
| 效能 | 95 | 99 |
| 無障礙／最佳實務／SEO | 100 | 100 |
| LCP | 2.9 秒 | 0.8 秒 |
| TBT／CLS | 0 ms／0 | 0 ms／0 |

已驗證 320、390、768、1440 px 版面、卡片對齊、篩選、分頁、56 張照片、主題切換與無 JavaScript 首屏。這些為實驗室結果；手機 LCP 尚高於 2.5 秒目標，正式網站仍需依真實使用者數據持續觀察。

## 部署

- 建置指令：`npm run build`；輸出：`.svelte-kit/cloudflare`。
- 自訂 `_headers` 放在專案根目錄，靜態圖片以 `/images/*` 排除 Worker。
- CSP 使用每次請求的 nonce；首屏 CSS 小於 40 KB 時內嵌，主題腳本於繪製前執行。
- 篩選與頁碼保留於頁面狀態，重新整理或分享網址時回到全部景點第一頁。
