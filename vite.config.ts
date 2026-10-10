import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter(),
      csp: {
        mode: "nonce",
        directives: {
          "default-src": ["self"],
          "script-src": ["self"],
          "style-src": ["self", "unsafe-inline", "https://fonts.googleapis.com"],
          "font-src": ["self", "https://fonts.gstatic.com", "data:"],
          "img-src": ["self", "https:", "data:"],
          "connect-src": ["self"],
          "frame-ancestors": ["none"],
          "base-uri": ["self"],
          "object-src": ["none"],
        },
      },
    }),
    tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      checks: {
        // 小型專案中，SvelteKit 編譯 hook 的正常耗時容易觸發誤判提示。
        pluginTimings: false,
      },
    },
  },
});
