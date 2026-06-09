<script lang="ts">
  // 使用 Svelte 5 的 $props 接收 count 屬性
  let { count = 12 }: { count?: number } = $props();

  // 將 placeholders 設為 $derived 以避免本地快照警告，確保響應式更新
  let placeholders = $derived(Array.from({ length: count }));
</script>

<ul
  class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
  aria-hidden="true"
>
  {#each placeholders as _, index (index)}
    <li class="card-gradient">
      <div class="card-inner">
        <div
          class="relative flex h-40 items-end overflow-hidden rounded-t-[1rem] bg-slate-200/80 dark:bg-slate-700/80"
        >
          <div
            class="absolute inset-0 animate-[shimmer_1.6s_infinite] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.6)_50%,rgba(255,255,255,0)_100%)] bg-[length:200%_100%] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)]"
          ></div>
          <div
            class="relative z-10 flex w-full items-end justify-between gap-2 px-3 pb-3"
          >
            <div
              class="h-4 w-2/3 rounded-full bg-slate-300/80 dark:bg-slate-600/80"
            ></div>
            <div
              class="h-6 w-16 rounded-full bg-slate-300/80 dark:bg-slate-600/80"
            ></div>
          </div>
        </div>
        <div
          class="space-y-3 border-t border-blue-50 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-800/90"
        >
          <div
            class="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-slate-600"
          ></div>
          <div
            class="h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-600"
          ></div>
          <div
            class="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-600"
          ></div>
        </div>
      </div>
    </li>
  {/each}
</ul>

<style>
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
</style>
