![高雄市旅遊資訊網預覽](https://raw.githubusercontent.com/happyloa/Kaohsiung-travel-info/refs/heads/master/static/thumb.webp)

# 高雄市旅遊資訊網

以 SvelteKit 與 Tailwind CSS 製作的高雄景點查詢網站，部署於 Cloudflare Pages。

## 功能

- 依行政區篩選景點，並提供熱門區域快速按鈕與分頁瀏覽。
- 顯示景點照片、開放時間、地址、電話與免費參觀標示。
- 支援深淺色模式，於頁面繪製前套用偏好以避免閃爍。
- 使用 AOS 呈現滾動動畫，並尊重 `prefers-reduced-motion`。
- 由伺服器端取得並驗證景點資料，讓初始 HTML 直接包含主要內容。
- 提供 canonical、Open Graph、Twitter Card、JSON-LD、robots.txt 與 sitemap。

## 技術

- SvelteKit 2、Svelte 5
- Tailwind CSS 4
- Vite 8、TypeScript
- AOS 2
- Cloudflare Pages、`@sveltejs/adapter-cloudflare`

## 資料來源

`src/routes/+page.server.ts` 會在伺服器端取得 HexSchool 提供的高雄旅遊資料：

<https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json>

請求設有 10 秒逾時，回傳內容也會逐筆檢查必要欄位。來源無法連線、HTTP 回應失敗或資料格式改變時，頁面會顯示中文錯誤訊息。

## 本機開發

需要 Node.js 22.12.0 以上版本；`.node-version` 記錄本專案驗證使用的版本，`package.json` 則記錄 npm 版本。

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
│   ├── aos.ts                  # AOS 初始化
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
```

## 驗證與部署

提交或部署前執行：

```bash
npm run check
npm run build
```

Cloudflare Pages 使用 `npm run build`，輸出目錄設為 `.svelte-kit/cloudflare`。SvelteKit adapter 會產生 `_worker.js`、`_routes.json` 與 `_headers`。

CSP 使用 per-request nonce；新增外部資源時，必須同步檢查 `svelte.config.js` 的 CSP directives。

## 參考文件

- [SvelteKit](https://svelte.dev/docs/kit)
- [Svelte](https://svelte.dev/docs/svelte)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
