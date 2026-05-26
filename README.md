![](https://raw.githubusercontent.com/happyloa/Kaohsiung-travel-info/refs/heads/master/static/thumb.webp)

# 高雄市旅遊資訊網 (SvelteKit)

本專案將原始的 HTML/CSS/JS 版本重構為 [SvelteKit](https://svelte.dev/) 並整合 [Tailwind CSS](https://tailwindcss.com/)。

## 功能特色

- **深淺色模式**：支援一鍵切換淺色/深色主題，偏好設定會自動儲存。
- **滾動動畫**：使用 AOS (Animate On Scroll) 為頁面元素加入滾動動畫效果。
- **區域篩選**：可依行政區篩選高雄各區景點。
- **熱門景點快速按鈕**：快速查看苓雅、三民、新興、鼓山等熱門區域。
- **分頁瀏覽**：景點以分頁方式呈現，每頁顯示 12 筆。

## 使用技術

- [SvelteKit](https://svelte.dev/) 2.x (Svelte 5)
- [Tailwind CSS](https://tailwindcss.com/) 4.x
- [AOS](https://michalsnik.github.io/aos/) 2.x - 滾動動畫
- [Vite](https://vite.dev/) 8.x
- TypeScript

## 資料來源

景點資料在瀏覽器端載入，來源為 HexSchool 提供的高雄旅遊資料：

<https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json>

如果該資料來源無法連線、格式變更或被限流，頁面會顯示載入錯誤訊息。

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
├── app.html                # HTML 模板
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
    ├── +layout.svelte      # 全域佈局
    └── +page.svelte        # 主頁面
static/                     # 靜態資源
```

## 部署

目前專案使用 `@sveltejs/adapter-auto`。它會在支援的平台上自動選擇 adapter；如果部署目標是 GitHub Pages、一般靜態主機、Cloudflare Pages、Vercel 等固定平台，建議改用對應 adapter 並重新驗證 build 結果。

部署前請至少執行：

```bash
npm run check
npm run build
```

## 參考

- [SvelteKit Docs](https://svelte.dev/docs/kit)
- [Svelte 5 Docs](https://svelte.dev/docs/svelte)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
