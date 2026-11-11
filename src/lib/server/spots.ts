import type { SpotInfo } from "#lib/types.ts";
import media from "#lib/media.json" with { type: "json" };
import { spotImageSrc } from "#lib/spot-image.ts";

const DATA_URL =
  "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
const REQUIRED_TEXT_FIELDS = [
  "Name",
  "Zone",
  "Picture1",
  "Opentime",
  "Add",
  "Tel",
  "Ticketinfo",
] as const satisfies readonly (keyof SpotInfo)[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSpotInfo(value: unknown): value is SpotInfo {
  if (!isRecord(value) || !Number.isInteger(value._id)) return false;

  return REQUIRED_TEXT_FIELDS.every(
    (field) => typeof value[field] === "string",
  );
}

async function fetchSpots(fetchFn: typeof fetch): Promise<SpotInfo[]> {
  let response: Response;

  try {
    response = await fetchFn(DATA_URL, {
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Error("無法取得旅遊資訊，請稍後再試。");
  }

  if (!response.ok) {
    throw new Error("無法取得旅遊資訊，請稍後再試。");
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new Error("旅遊資訊格式有誤，請稍後再試。");
  }

  const result = isRecord(payload) ? payload.result : undefined;
  const records = isRecord(result) ? result.records : undefined;

  if (!Array.isArray(records) || !records.every(isSpotInfo)) {
    throw new Error("旅遊資訊格式有誤，請稍後再試。");
  }

  // 只傳送畫面使用的欄位，避免把完整描述與其他上游資料序列化到 HTML。
  return records.map(
    ({ _id, Name, Zone, Picture1, Opentime, Add, Tel, Ticketinfo }) => ({
      _id,
      Name,
      Zone,
      Picture1,
      Opentime,
      Add,
      Tel,
      Ticketinfo,
    }),
  );
}

type DataCache = Pick<Cache, "match" | "put">;

export async function getSpots(
  fetchFn: typeof fetch,
  cache?: DataCache,
  key?: Request,
) {
  let spots: SpotInfo[] | undefined;
  if (cache && key) {
    try {
      const response = await cache.match(key);
      const cached: unknown = response ? await response.json() : undefined;
      if (Array.isArray(cached) && cached.every(isSpotInfo)) spots = cached;
    } catch {
      // Cache availability must not prevent an upstream request.
    }
  }
  if (!spots) {
    spots = await fetchSpots(fetchFn);
    if (cache && key) {
      try {
        await cache.put(
          key,
          Response.json(spots, {
            headers: { "Cache-Control": "public, max-age=3600" },
          }),
        );
      } catch {
        // A failed cache write must not discard valid data.
      }
    }
  }
  const images: Record<string, string> = media.spots;
  return spots.map((spot) => {
    const id = Object.hasOwn(images, spot.Picture1)
      ? images[spot.Picture1]
      : undefined;
    return id ? { ...spot, Picture1: spotImageSrc(id), PictureId: id } : spot;
  });
}
