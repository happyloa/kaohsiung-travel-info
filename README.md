![](https://raw.githubusercontent.com/happyloa/Kaohsiung-travel-info/refs/heads/master/static/thumb.webp)

# 高雄市旅遊資訊網 (SvelteKit)

本專案將原始的 HTML/CSS/JS 版本重構為 [SvelteKit](https://svelte.dev/) 並整合 [Tailwind CSS](https://tailwindcss.com/)。

## 功能特色

- **深淺色模式**：支援一鍵切換淺色/深色主題，偏好設定會自動儲存，並於繪製前套用以避免閃爍 (FOUC)。
- **滾動動畫**：使用 AOS (Animate On Scroll) 為頁面元素加入滾動動畫效果，並尊重「減少動態效果」偏好。
- **區域篩選**：可依行政區篩選高雄各區景點。
- **熱門景點快速按鈕**：快速查看苓雅、三民、新興、鼓山等熱門區域。
- **分頁瀏覽**：景點以分頁方式呈現，每頁顯示 12 筆。
- **串流式 SSR 載入**：資料於請求時在伺服器端抓取並串流至前端，載入期間顯示骨架動畫。
- **SEO 與社群分享**：內建 canonical、Open Graph、Twitter Card 與 WebSite JSON-LD。

## 使用技術

- [SvelteKit](https://svelte.dev/) 2.x (Svelte 5)
- [Tailwind CSS](https://tailwindcss.com/) 4.x
- [AOS](https://michalsnik.github.io/aos/) 2.x - 滾動動畫
- [Vite](https://vite.dev/) 8.x
- TypeScript

## 資料來源

景點資料透過 SvelteKit load function（`src/routes/+page.ts`）於請求時抓取並以串流方式送至前端，載入期間顯示骨架動畫；來源為 HexSchool 提供的高雄旅遊資料：

<https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json>

抓取設有 10 秒逾時與資料結構驗證，如果該資料來源無法連線、格式變更或被限流，頁面會顯示中文錯誤訊息。

## 開發環境

```bash
npm install
npm run dev
```

開啟 <http://localhost:5173> 便可預覽。

## 專案結構

```text
src/
├── app.css                 # 全域樣式與 Tailwind CSS 設定
├── app.html                # HTML 模板（含主題初始化腳本、resource hints）
├── hooks.server.ts         # 安全標頭與快取設定
├── lib/
│   ├── aos.ts              # AOS 動畫初始化模組
│   ├── types.ts            # 全域型別定義
│   └── components/         # 元件
│       ├── AreaCard.svelte       # 景點卡片
│       ├── AreaSelect.svelte     # 區域下拉選單
│       ├── HotButtons.svelte     # 熱門區域按鈕
│       ├── LoadingSkeleton.svelte # 載入骨架
│       └── ThemeToggle.svelte    # 深淺色模式切換
└── routes/
    ├── +layout.svelte      # 全域佈局（SEO / OG / JSON-LD meta）
    ├── +page.ts            # 景點資料載入（串流式 SSR load function）
    └── +page.svelte        # 主頁面
static/                     # 靜態資源
├── bg.webp                 # 首屏背景圖
├── favicon.webp            # 網站圖示
├── github.webp             # GitHub 連結圖示
├── thumb.webp              # 社群分享預覽圖 (og:image)
├── theme-init.js           # 繪製前套用主題，消除深色模式 FOUC
├── robots.txt              # 搜尋引擎索引規則
└── sitemap.xml             # 網站地圖
```

## 部署

專案部署於 Cloudflare Pages，使用 `@sveltejs/adapter-cloudflare`。本機 `npm run build` 即會輸出 Cloudflare 所需的 `_worker.js`、`_routes.json` 與 `_headers`。

安全性標頭（CSP、HSTS、Permissions-Policy 等）由 `src/hooks.server.ts` 與 `svelte.config.js` 的 `kit.csp` 設定，於 SSR 回應時套用。CSP 採 nonce 模式，調整外部資源來源時，記得同步更新 `svelte.config.js` 中的 CSP directives。

部署前請至少執行：

```bash
npm run check
npm run build
```

## 參考

- [SvelteKit Docs](https://svelte.dev/docs/kit)
- [Svelte 5 Docs](https://svelte.dev/docs/svelte)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
