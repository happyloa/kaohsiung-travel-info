<script lang="ts">
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

  function handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    onChange?.(target.value);
  }
</script>

<label class="sr-only" for="area-select">選擇行政區域</label>
<select
  id="area-select"
  class="mt-4 mb-5 w-full rounded-lg border border-blue-200 bg-white/80 p-2 text-slate-700 shadow-sm backdrop-blur-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:ring-blue-800"
  onchange={handleChange}
  value={selected}
>
  <option value="">全部景點</option>
  {#each areas as area}
    <option value={area}>{area}</option>
  {/each}
</select>
