![高雄市旅遊資訊網預覽](https://raw.githubusercontent.com/happyloa/Kaohsiung-travel-info/refs/heads/master/static/thumb.webp)

# 高雄市旅遊資訊網

以 SvelteKit 與 Tailwind CSS 製作的高雄景點查詢網站，部署於 Cloudflare Pages。

## 功能

- 依行政區篩選景點，並提供熱門區域快速按鈕與分頁瀏覽。
- 顯示景點照片、開放時間、地址、電話與免費參觀標示。
- 支援深淺色模式，於頁面繪製前套用偏好以避免閃爍。
- 使用瀏覽器原生功能呈現滾動動畫，並尊重 `prefers-reduced-motion`。
- 由伺服器端取得並驗證景點資料，讓初始 HTML 直接包含主要內容。
- 動畫尚未初始化或停用 JavaScript 時，首批景點仍可閱讀；篩選、分頁與主題切換需要 JavaScript。
- 提供 canonical、Open Graph、Twitter Card、JSON-LD、robots.txt 與 sitemap。

## 技術

- SvelteKit 3、Svelte 5
- Tailwind CSS 4
- Vite 8、TypeScript
- IntersectionObserver、Web Animations API
- Cloudflare Pages、`@sveltejs/adapter-cloudflare`

## 資料來源

`src/routes/+page.server.ts` 會在伺服器端取得 HexSchool 提供的高雄旅遊資料：

<https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json>

請求設有 10 秒逾時，回傳內容也會逐筆檢查必要欄位。來源無法連線、HTTP 回應失敗或資料格式改變時，頁面會顯示中文錯誤訊息。

伺服器只回傳景點 ID、名稱、行政區、照片、開放時間、地址、電話與免費參觀資訊，供瀏覽器篩選與分頁。此來源為教學用資料集，抽查資料的更新時間為 2015 年；開放時間、電話及參觀資訊可能已變更，出發前請向景點確認。

## 本機開發

開發環境需使用 Node.js 22.22.2 以上的 22 系列、24.15.0 以上的 24 系列，或 26 以上版本，以符合 npm 12 的需求。`.node-version` 記錄本專案驗證使用的 Node.js 24.21.0，`package.json` 則指定 npm 12.2.0。

```bash
npm ci
npm run dev
```

開啟 <http://localhost:5173> 預覽。

## 專案結構

```text
src/
├── app.css                     # 全域樣式與 Tailwind CSS 設定
├── app.html                    # HTML 模板與資源提示
├── hooks.server.ts             # HTTP 安全標頭
├── lib/
│   ├── reveal.ts               # 原生滾動進場動畫
│   ├── types.ts                # 景點資料型別
│   └── components/
│       ├── AreaCard.svelte     # 景點卡片
│       ├── AreaSelect.svelte   # 行政區選單
│       ├── HotButtons.svelte   # 熱門行政區按鈕
│       ├── Icon.svelte         # 本地 SVG 圖示
│       └── ThemeToggle.svelte  # 深淺色切換
└── routes/
    ├── +layout.svelte          # 全域版面與 SEO metadata
    ├── +page.server.ts         # 景點資料載入與驗證
    └── +page.svelte            # 首頁

static/                         # 圖片、主題初始化、robots 與 sitemap
tests/                          # 資料載入、格式驗證與錯誤處理測試
vite.config.ts                  # SvelteKit、Cloudflare adapter、CSP 與 Tailwind
```

## 驗證與部署

提交或部署前執行：

```bash
npm run check
npm test
npm run build
npm audit
```

也可執行 `npm run verify`，依序完成上述四項檢查。測試使用 Node.js 內建的測試工具，涵蓋正常與空資料、網路失敗、逾時、HTTP 錯誤及格式異常。

型別檢查使用 `svelte-check` 與單一 TypeScript 6。依 [Svelte 官方說明](https://github.com/sveltejs/language-tools/tree/master/packages/svelte-check#typescript-7-supports)，工具鏈仍需 TypeScript 6 的編譯器 API，因此 `npm outdated` 仍會列出 `typescript`。

`@types/node` 維持在 24 系列，對應本專案驗證的 Node.js 24；`npm outdated` 列出的較新主版本型別不代表目前執行環境支援那些 API。

npm 12 預設封鎖未核准的依賴安裝腳本。`package.json` 的 `allowScripts` 僅核准目前鎖定版本的 esbuild 與 workerd；更新依賴後，先用 `npm install-scripts ls` 檢查，再核准確認可信的版本，並用 `npm install-scripts prune` 移除過期記錄。

Cloudflare Pages 使用 `npm run build`，輸出目錄設為 `.svelte-kit/cloudflare`。SvelteKit adapter 會產生 `_worker.js`、`_routes.json` 與 `_headers`。

CSP 使用 per-request nonce；新增外部資源時，必須同步檢查 `vite.config.ts` 的 CSP directives。SvelteKit 3 設定集中於 Vite plugin；本地模組透過 `package.json` 的 `#lib/*` subpath imports 引入，`tsconfig.json` 繼承 `$app/tsconfig`。

目前的 10 個直接依賴均用於開發、檢查或建置：

| 用途 | 套件 |
| --- | --- |
| SvelteKit 編譯與開發伺服器 | `svelte`、`@sveltejs/kit`、`@sveltejs/vite-plugin-svelte`、`vite` |
| 樣式編譯 | `@tailwindcss/vite` |
| Cloudflare 建置與本機模擬 | `@sveltejs/adapter-cloudflare`、`wrangler` |
| 型別檢查 | `svelte-check`、`typescript`、`@types/node` |

滾動動畫由 `src/lib/reveal.ts` 處理，不需額外套件。內容預設可見，動畫尚未啟動或 JavaScript 停用時仍可閱讀；元件卸載時會清理觀察器與動畫。Svelte 元件只使用可直接移除的 TypeScript 型別語法，不需額外的 script 預處理器。

## 效能與限制

2026-10-10 的本機檢查中，同一批 56 筆景點精簡欄位後，JSON 大小由約 126 KB 降至 21 KB，減少約 83%。正式建置的首頁 HTML、手機版面、篩選、分頁與主題切換另以本機瀏覽器驗證；這些結果不代表正式網站的 Core Web Vitals。

目前仍有幾項改善空間：

- 每次載入首頁都會向 GitHub 取得資料；尚未加入應用層資料快取或上游失敗時的備援。
- 首屏背景圖約 257 KB，景點照片由外部來源提供，尚未提供依螢幕尺寸選擇的圖片版本。
- 思源黑體子集涵蓋目前介面與景點資料；載入期間及未收錄字元使用系統字型。
- 篩選與頁碼保留於目前頁面狀態，未同步到網址；重新整理或分享網址時會回到全部景點的第一頁。

專案採用少量 Svelte 元件與 Tailwind，未引入額外 UI 框架。目前優先改善項目是資料時效與來源可靠性，再依正式網站量測結果調整圖片。

## 參考文件

- [SvelteKit](https://svelte.dev/docs/kit)
- [Svelte](https://svelte.dev/docs/svelte)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
