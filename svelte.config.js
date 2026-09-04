import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),

    // 使用 per-request nonce 保護 SvelteKit 產生的 inline scripts。
    // directives 僅開放目前實際使用的同源資源、字型與第三方圖片。
    csp: {
      mode: "nonce",
      directives: {
        "default-src": ["self"],
        "script-src": ["self"],
        "style-src": [
          "self",
          "unsafe-inline",
          "https://fonts.googleapis.com",
        ],
        "font-src": [
          "self",
          "https://fonts.gstatic.com",
          "data:",
        ],
        "img-src": ["self", "https:", "data:"],
        "connect-src": ["self"],
        "frame-ancestors": ["none"],
        "base-uri": ["self"],
        "object-src": ["none"],
      },
    },
  },
};

export default config;
