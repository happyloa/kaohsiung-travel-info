![高雄市旅遊資訊網預覽](https://raw.githubusercontent.com/happyloa/Kaohsiung-travel-info/refs/heads/master/static/thumb.webp)

# 高雄市旅遊資訊網

高雄各行政區景點查詢網站，以 SvelteKit 3、Svelte 5、Tailwind CSS 4 製作，部署於 Cloudflare Pages。

- 行政區篩選、熱門區域按鈕、每頁 12 筆分頁，換頁後捲回列表頂端。
- 顯示照片、開放時間、地址、電話與免費參觀標示。
- 深淺色模式、鍵盤操作、減少動態效果偏好。
- 伺服器渲染首屏，含 SEO metadata、JSON-LD 與 sitemap。
- 篩選與頁碼不寫入網址，重新整理後回到全部景點第一頁。

## 開發

需要 Node.js 24 與 npm 12（確切版本見 `.node-version` 與 `package.json` 的 `packageManager`）。

```bash
npm ci
npm run dev      # 開發伺服器
npm run verify   # 型別檢查、正式建置、安全檢查
```

- 型別檢查由 `svelte-check --tsgo` 使用 TypeScript 7；`typescript` 套件維持 6.x，因 SvelteKit 3 的 peer dependency 仍要求 TypeScript 6。`@types/node` 對應 Node 24。
- `npm run audit` 只放行 deepmerge 的 [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) 及僅因它被標記的上游套件。對應的 [CVE-2026-93753](https://github.com/CVEProject/cvelistV5/blob/main/cves/2026/93xxx/CVE-2026-93753.json) 已於 2026-11-02 遭 CNA 撤銷，但 GitHub 尚未撤回公告，因此 `npm audit` 仍列出 4 個 low。其他漏洞一律讓驗證失敗；公告撤回後即可刪除 `scripts/audit.ts` 的例外。

## 資料

景點資料來自 [HexSchool 高雄旅遊資料集](https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json)（2015 年版，出發前請向景點確認）。由伺服器取得並驗證格式，逾時 10 秒，成功結果以 Cloudflare Cache API 快取 1 小時；快取不可用時直接回源，失敗時顯示中文錯誤訊息。

## 圖片與字型

```bash
npm run assets:sync
```

重新產生景點照片、首圖、圖示與字型分段，需一併提交 `src/lib/media.json`、`static/images/`、`src/lib/assets/`。正式建置直接使用已提交的檔案，不需下載。首圖、favicon、GitHub 圖示的原始檔在 `src/lib/assets/images/`，不會部署。

- 景點照片預先裁成卡片比例 20:9，輸出 480／800 px AVIF 並附 WebP 備援；首圖輸出 640／800／1280 px AVIF 與 WebP。資料集出現未收錄的照片時改用原圖網址。
- 思源黑體依介面文字及每 12 筆景點文字分段，保留 400–700 字重，未及時載入時使用系統字型。授權見 `static/fonts/OFL.txt`。
- 圖片與字型皆為雜湊檔名，快取一年。

## 效能

2026-11-11，Lighthouse 13.6.0，本機 `wrangler pages dev` 執行正式產物，預設模擬節流：

| 項目                  |       手機 |    桌面 |
| --------------------- | ---------: | ------: |
| 效能                  |      96–97 |     100 |
| 無障礙／最佳實務／SEO |        100 |     100 |
| LCP                   | 2.7–2.8 秒 |  0.7 秒 |
| TBT／CLS              | ≤ 20 ms／0 | 0 ms／0 |
| 傳輸量                |     457 KB |  325 KB |

手機 LCP 仍略高於 2.5 秒目標。首圖約 140 ms 即下載完成，但本機無頭 Chrome 以軟體光柵化，約 300 ms 才呈現畫面，模擬節流再放大此延遲；圖片傳輸量減半後 LCP 沒有明顯變化。正式網站請以真實使用者數據為準。

## 部署

- Cloudflare Pages 建置指令 `npm run build`，輸出目錄 `.svelte-kit/cloudflare`。
- 安全標頭由 `src/hooks.server.ts` 加入；CSP 使用每次請求的 nonce，主題腳本於繪製前執行。
- CSS 一律內嵌於 HTML，首屏不必等待外部樣式表（`vite.config.ts` 的 `inlineStyleThreshold`）。
- 靜態檔不經 Worker（`vite.config.ts` 的 `routes.exclude`），`/images/*` 的長效快取寫在根目錄 `_headers`。
