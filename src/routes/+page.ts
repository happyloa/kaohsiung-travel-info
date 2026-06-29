import type { PageLoad } from "./$types";
import type { SpotInfo } from "$lib/types";

// 景點資料來源（HexSchool 提供的高雄旅遊開放資料）
const DATA_URL =
  "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";

// 取得並驗證景點資料；加入逾時與資料結構檢查，避免第三方來源異常時拋出未翻譯錯誤
async function fetchSpots(fetchFn: typeof fetch): Promise<SpotInfo[]> {
  const res = await fetchFn(DATA_URL, {
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    throw new Error("無法取得旅遊資訊，請稍後再試。");
  }
  const json = await res.json();
  const records = json?.result?.records;
  if (!Array.isArray(records)) {
    throw new Error("旅遊資訊格式有誤，請稍後再試。");
  }
  return records as SpotInfo[];
}

export const load: PageLoad = ({ fetch }) => {
  // 回傳「未 await」的 Promise 以啟用串流：伺服器先送出頁面外殼並提早發動抓取，
  // 資料就緒後再串流給前端；載入期間 +page.svelte 仍顯示原本的骨架動畫。
  return { spots: fetchSpots(fetch) };
};
