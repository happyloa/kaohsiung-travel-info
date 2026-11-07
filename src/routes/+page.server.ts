import type { PageServerLoad } from "./$types";
import { getSpots } from "#lib/server/spots.ts";

export const load = (async ({ fetch, url }) => {
  try {
    const cache = typeof caches !== "undefined" && "default" in caches
      ? caches.default as Cache : undefined;
    const key = cache ? new Request(new URL("/__cache/spots-v1", url)) : undefined;
    return { spots: await getSpots(fetch, cache, key), errorMessage: null };
  } catch (error) {
    return {
      spots: [],
      errorMessage: error instanceof Error ? error.message : "載入資料時發生未知錯誤。",
    };
  }
}) satisfies PageServerLoad;
