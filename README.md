![](https://raw.githubusercontent.com/happyloa/Kaohsiung-travel-info/refs/heads/master/static/thumb.webp)

# 高雄市旅遊資訊網 (SvelteKit)

本專案將原始的 HTML/CSS/JS 版本重構為 [SvelteKit](https://svelte.dev/) 並整合 [Tailwind CSS](https://tailwindcss.com/)。

## 功能特色

- 🌙 **深淺色模式**：支援一鍵切換淺色/深色主題，偏好設定會自動儲存
- 🎬 **滾動動畫**：使用 AOS (Animate On Scroll) 為頁面元素加入流暢的滾動動畫效果
- 🔍 **區域篩選**：可依行政區篩選高雄各區景點
- ⚡ **熱門景點快速按鈕**：快速查看苓雅、三民、新興、鼓山等熱門區域
- 📄 **分頁瀏覽**：景點以分頁方式呈現，每頁顯示 12 筆

## 使用技術

- [SvelteKit](https://svelte.dev/) 2.x (Svelte 5)
- [Tailwind CSS](https://tailwindcss.com/) 4.x
- [AOS](https://michalsnik.github.io/aos/) 2.x - 滾動動畫
- [Vite](https://vite.dev/) 7.x
- TypeScript

## 開發環境

```bash
npm install
npm run dev
```

開啟 <http://localhost:5173> 便可預覽。

## 專案結構

```
src/
├── app.css                 # 全域樣式與 Tailwind CSS 設定
├── app.html                # HTML 模板
├── hooks.server.ts         # 安全標頭設定
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
static/                      # 靜態資源
```

## 部署

- 本專案使用 [SvelteKit](https://svelte.dev/) 的 `hooks.server.ts` 統一處理安全性標頭與快取設定，確保在所有部署環境（如 Cloudflare Pages）中都能正確執行。
- 部署時只需執行 `npm run build`，由 `@sveltejs/adapter-auto` 自動處理環境適配。

## 參考

- [SvelteKit Docs](https://svelte.dev/docs/kit)
- [Svelte 5 Docs](https://svelte.dev/docs/svelte)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
