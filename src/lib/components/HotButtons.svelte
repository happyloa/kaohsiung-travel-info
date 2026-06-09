<script lang="ts">
  // 常用熱門區域與選擇事件處理器，使用 Svelte 5 的 $props 接收
  let {
    hotAreas = [],
    onSelect
  }: {
    hotAreas?: string[];
    onSelect?: (value: string) => void;
  } = $props();
</script>

<!-- 熱門區域快速按鈕 -->
<nav
  class="mx-auto my-4 grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4"
>
  {#each hotAreas as area, index}
    <button
      class="w-full rounded-full bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow transition hover:from-blue-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-white"
      onclick={() => onSelect?.(area)}
      data-aos="zoom-in"
      data-aos-delay={100 * (index + 1)}
      type="button"
    >
      {area}
    </button>
  {/each}
</nav>
