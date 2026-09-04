<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "$lib/components/Icon.svelte";

  // 目前主題狀態，使用 Svelte 5 的 $state 聲明響應式狀態
  let theme: "light" | "dark" = $state("light");

  // 切換主題
  function toggleTheme() {
    theme = theme === "light" ? "dark" : "light";
    applyTheme();
  }

  // 套用主題至 DOM 並儲存偏好
  function applyTheme() {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }

  // 主題已由 app.html 的 theme-init.js 於繪製前套用至 <html>，
  // 此處僅讀回目前狀態讓按鈕圖示一致，避免重複判斷與二次閃爍。
  onMount(() => {
    theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  });
</script>

<!-- 主題切換按鈕 - 固定在右下角 -->
<button
  type="button"
  onclick={toggleTheme}
  class="fixed bottom-5 right-5 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full
    bg-white/90 text-blue-600 shadow-lg backdrop-blur-sm transition-all duration-300
    hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400
    dark:bg-slate-800/90 dark:text-amber-400 dark:hover:bg-slate-700"
  aria-label={theme === "light" ? "切換至深色模式" : "切換至淺色模式"}
>
  {#if theme === "light"}
    <Icon name="moon" class="h-5 w-5" />
  {:else}
    <Icon name="sun" class="h-5 w-5" />
  {/if}
</button>
