<script lang="ts">
  // 選單屬性，使用 Svelte 5 的 $props 接收。
  // selected 為單向傳入、由父層透過 onChange 更新，故不需 $bindable。
  let {
    areas = [],
    selected = "",
    onChange
  }: {
    areas?: string[];
    selected?: string;
    onChange?: (value: string) => void;
  } = $props();

  // 下拉選單值改變時觸發，並將選取結果回傳給父層
  function handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    onChange?.(target.value);
  }
</script>

<!-- 區域選擇下拉選單 -->
<label class="sr-only" for="area-select">選擇行政區域</label>
<select
  id="area-select"
  class="w-full mt-4 mb-5 rounded-lg border border-blue-200 bg-white/80 p-2 text-slate-700 shadow-sm backdrop-blur-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:ring-blue-800"
  onchange={handleChange}
  value={selected}
>
  <option value="">全部景點</option>
  {#each areas as area}
    <option value={area}>{area}</option>
  {/each}
</select>
