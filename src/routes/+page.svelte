<script lang="ts">
  import { tick } from "svelte";
  import AOS from "aos";
  import type { PageProps } from "./$types";
  import AreaSelect from "$lib/components/AreaSelect.svelte";
  import HotButtons from "$lib/components/HotButtons.svelte";
  import AreaCard from "$lib/components/AreaCard.svelte";

  let { data: pageData }: PageProps = $props();

  let selected = $state("");
  let currentPage = $state(1);

  const hotAreas = ["苓雅區", "三民區", "新興區", "鼓山區"];
  const pageSize = 12;

  let data = $derived(pageData.spots);
  let errorMessage = $derived(pageData.errorMessage);
  let areas = $derived(Array.from(new Set(data.map((spot) => spot.Zone))));
  let filtered = $derived(selected ? data.filter((d) => d.Zone === selected) : data);
  let totalPages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
  let pageItems = $derived.by(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  });

  // 當篩選結果變動，totalPages 縮小時，確保 currentPage 不會溢出
  $effect(() => {
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
  });

  // 當分頁內容 (pageItems) 更新時，等待 DOM 渲染完成並重新整理 AOS 動畫偵測
  $effect(() => {
    pageItems; // 建立與 pageItems 的相依性
    tick().then(() => {
      AOS.refresh();
    });
  });

  // 處理區域選擇
  function handleSelect(area: string) {
    selected = area;
    currentPage = 1;
  }

  // 切換頁碼
  function goToPage(page: number) {
    currentPage = page;
  }
</script>

<!-- 頁面頂部 -->
<header
  class="relative overflow-hidden bg-[url('/bg.webp')] bg-cover bg-center p-8 sm:p-12 text-center text-white"
  data-aos="fade-down"
>
  <div
    class="absolute inset-0 bg-gradient-to-b from-blue-950/85 via-sky-900/65 to-slate-900/75"
  ></div>
  <div class="relative mx-auto flex max-w-3xl flex-col items-center gap-3">
    <h1 class="text-shadow text-3xl sm:text-4xl font-bold tracking-wide">
      高雄市旅遊資訊網
    </h1>
    <p class="text-shadow text-2xl font-medium text-blue-100">
      Kaohsiung City Travel Info
    </p>
    <AreaSelect {areas} {selected} onChange={handleSelect} />
  </div>
</header>
<!-- 主要內容 -->
<main class="container mx-auto px-5 pb-12">
  <div
    class="-mt-10 rounded-3xl border border-blue-200 bg-white/95 py-5 px-6 text-center shadow-xl backdrop-blur transition-colors dark:border-blue-900/70 dark:bg-slate-900/95"
    data-aos="fade-up"
  >
    <h2
      class="mb-2 text-2xl font-semibold text-blue-700 dark:text-blue-300"
    >
      💯 熱門景點 💯
    </h2>
    <HotButtons {hotAreas} onSelect={handleSelect} />
  </div>
  <h3
    class="my-6 text-center text-2xl font-bold text-blue-900 transition-colors dark:text-blue-100"
    data-aos="fade-up"
    data-aos-delay="100"
  >
    {selected || "全部景點"}
  </h3>
  {#if errorMessage}
    <p
      class="my-4 text-center text-xl font-semibold text-rose-500"
      role="alert"
    >
      {errorMessage}
    </p>
  {:else if pageItems.length > 0}
    <ul
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      data-aos="fade-up"
      data-aos-delay="150"
    >
      {#each pageItems as item (item._id)}
        <AreaCard info={item} />
      {/each}
    </ul>
    {#if totalPages > 1}
      <nav
        class="mt-8 flex justify-center"
        aria-label="景點分頁"
        data-aos="fade-up"
      >
        <ul
          class="inline-flex items-stretch overflow-hidden rounded-full border border-blue-300 bg-white shadow-md transition-colors dark:border-blue-800 dark:bg-slate-900"
        >
          <li>
            <button
              class="page-btn"
              onclick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              type="button"
              aria-label="上一頁"
            >
              <span class="hidden sm:inline">上一頁</span>
              <span aria-hidden="true">«</span>
            </button>
          </li>
          {#each Array.from({ length: totalPages }) as _, index}
            {@const page = index + 1}
            <li>
              <button
                class={`px-4 py-2 text-sm font-semibold transition cursor-pointer focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-blue-500 ${
                    page === currentPage
                      ? "bg-blue-600 text-white shadow-inner"
                      : "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-700"
                  }`}
                type="button"
                aria-current={page === currentPage ? "page" : undefined}
                onclick={() => goToPage(page)}
              >
                {page}
              </button>
            </li>
          {/each}
          <li>
            <button
              class="page-btn"
              onclick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              type="button"
              aria-label="下一頁"
            >
              <span aria-hidden="true">»</span>
              <span class="hidden sm:inline">下一頁</span>
            </button>
          </li>
        </ul>
      </nav>
    {/if}
  {:else}
    <p class="my-4 text-center text-2xl text-slate-500 dark:text-slate-400">
      目前沒有任何景點
    </p>
  {/if}
</main>

<!-- 頁尾 -->
<footer
  class="border-t border-blue-200 bg-gradient-to-b from-white to-blue-50/50 py-8 text-center transition-colors dark:border-blue-900/50 dark:from-slate-900 dark:to-blue-950/30"
  data-aos="fade-up"
>
  <a
    href="https://github.com/happyloa/Kaohsiung-travel-info"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-3 rounded-full bg-blue-100/80 px-6 py-3 text-blue-700 shadow-sm transition-all hover:bg-blue-200 hover:shadow-md dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/70"
    aria-label="前往 GitHub 專案頁面"
  >
    <img src="/github.webp" alt="GitHub" class="h-6 w-6 dark:invert" />
    <span class="font-medium">View on GitHub</span>
  </a>
  <p class="mt-4 text-sm text-blue-600/70 dark:text-blue-400/60">
    © 2026 高雄市旅遊資訊網. All rights reserved.
  </p>
</footer>
