import type { PageServerLoad } from "./$types";
import type { SpotInfo } from "$lib/types";

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

  return REQUIRED_TEXT_FIELDS.every((field) => typeof value[field] === "string");
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

  return records;
}

export const load = (async ({ fetch }) => {
  try {
    return {
      spots: await fetchSpots(fetch),
      errorMessage: null,
    };
  } catch (error) {
    return {
      spots: [],
      errorMessage:
        error instanceof Error ? error.message : "載入資料時發生未知錯誤。",
    };
  }
}) satisfies PageServerLoad;
