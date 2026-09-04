import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  build: {
    rolldownOptions: {
      checks: {
        // SvelteKit's compile hook normally dominates this small app's build time.
        pluginTimings: false,
      },
    },
  },
});
