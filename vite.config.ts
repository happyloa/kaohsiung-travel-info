import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  build: {
    rolldownOptions: {
      checks: {
        // 小型專案中，SvelteKit 編譯 hook 的正常耗時容易觸發誤判提示。
        pluginTimings: false,
      },
    },
  },
});
