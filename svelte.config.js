import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // 部署目標為 Cloudflare Pages，改用對應的官方 adapter
    // https://svelte.dev/docs/kit/adapter-cloudflare
    adapter: adapter(),

    // Content-Security-Policy：使用 nonce 模式，讓 SvelteKit 為它注入的所有
    // script（含 SSR 串流期間後續送出的資料區塊）標上同一組 per-request nonce，
    // 避免串流式 load 的後續 script 因雜湊未涵蓋而被擋下。各 directive 已涵蓋
    // 目前所有資源來源（Google Fonts、Font Awesome CDN、第三方 https 圖片、
    // GitHub 資料來源）；外部同源的 theme-init.js 由 'self' 允許。
    csp: {
      mode: "nonce",
      directives: {
        "default-src": ["self"],
        "script-src": ["self"],
        "style-src": [
          "self",
          "unsafe-inline",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
        ],
        "font-src": [
          "self",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "data:",
        ],
        "img-src": ["self", "https:", "data:"],
        "connect-src": ["self", "https://raw.githubusercontent.com"],
        "frame-ancestors": ["none"],
        "base-uri": ["self"],
        "object-src": ["none"],
      },
    },
  },
};

export default config;
