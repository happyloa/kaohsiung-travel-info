<script lang="ts">
  import type { SpotInfo } from "$lib/types";
  import Icon from "$lib/components/Icon.svelte";

  let { info }: { info: SpotInfo } = $props();
</script>

<li data-aos="fade-up">
  <article
    class="flex h-full flex-col overflow-hidden rounded-2xl border border-blue-200/90 bg-white shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-blue-900/60 dark:bg-slate-900"
  >
    <div class="relative h-40">
      <img
        src={info.Picture1}
        alt="{info.Name} - {info.Zone}景點照片"
        loading="lazy"
        class="h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-blue-950/85 via-blue-950/15 to-transparent"
      ></div>
      {#if info.Ticketinfo === "免費參觀"}
        <span
          class="absolute left-3 top-3 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-medium text-white shadow"
        >
          <Icon name="tag" class="h-3.5 w-3.5" /> 免費
        </span>
      {/if}
      <div
        class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white"
      >
        <h4 class="text-lg font-semibold leading-tight text-shadow">
          {info.Name}
        </h4>
        <span
          class="rounded-full bg-blue-600/95 px-3 py-1 text-xs font-semibold shadow-sm"
          >{info.Zone}</span
        >
      </div>
    </div>
    <div
      class="flex-1 space-y-2 p-4 text-sm text-blue-950 dark:text-blue-100"
    >
      <p class="info-row">
        <Icon name="clock" class="info-icon h-4 w-4 shrink-0" />
        {info.Opentime || "未提供營業時間"}
      </p>
      <p class="info-row">
        <Icon name="map-pin" class="info-icon h-4 w-4 shrink-0" />
        {info.Add || "未提供地址"}
      </p>
      <p class="info-row">
        <Icon name="phone" class="info-icon h-4 w-4 shrink-0" />
        {info.Tel || "未提供電話"}
      </p>
    </div>
  </article>
</li>
