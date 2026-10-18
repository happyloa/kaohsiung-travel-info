<script lang="ts">
  import "../app.css";
  import ThemeToggle from "#lib/components/ThemeToggle.svelte";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();

  const siteUrl = "https://kaohsiung-travel-info.worksbyaaron.com/";
  const siteName = "高雄市旅遊資訊網";
  const siteTitle = "高雄市旅遊資訊網 | Kaohsiung City Travel Info";
  const siteDescription =
    "提供高雄市各區景點資訊、開放時間、地址、電話及免費參觀標示，支援行政區篩選與分頁瀏覽。";
  const siteImage = `${siteUrl}thumb.webp`;

  // 保持為可信任的靜態字串，避免 hydration markers 破壞 JSON-LD。
  const jsonLd = `<` + `script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    alternateName: "Kaohsiung City Travel Info",
    url: siteUrl,
    inLanguage: "zh-Hant",
    description: siteDescription,
  })}</` + `script>`;

</script>

<svelte:head>
  <title>{siteTitle}</title>
  <meta name="description" content={siteDescription} />
  <link rel="canonical" href={siteUrl} />

  <!-- Open Graph（Facebook / LINE / Slack 等社群分享預覽） -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:title" content={siteTitle} />
  <meta property="og:description" content={siteDescription} />
  <meta property="og:url" content={siteUrl} />
  <meta property="og:image" content={siteImage} />
  <meta property="og:locale" content="zh_TW" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={siteTitle} />
  <meta name="twitter:description" content={siteDescription} />
  <meta name="twitter:image" content={siteImage} />

  {@html jsonLd}
</svelte:head>

{@render children()}

<ThemeToggle />
