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
  },
};

export default config;
