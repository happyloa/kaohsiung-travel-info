<script lang="ts">
  import { onMount } from "svelte";

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

  // 初始化時讀取使用者偏好
  onMount(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      theme = savedTheme;
    } else {
      // 如果沒有儲存偏好，則使用系統偏好
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      theme = prefersDark ? "dark" : "light";
    }
    applyTheme();
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
    <!-- 月亮圖示 - 點擊切換至深色 -->
    <i class="fas fa-moon text-xl"></i>
  {:else}
    <!-- 太陽圖示 - 點擊切換至淺色 -->
    <i class="fas fa-sun text-xl"></i>
  {/if}
</button>
