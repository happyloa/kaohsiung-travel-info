import assert from "node:assert/strict";
import { test } from "node:test";
import { load } from "../src/routes/+page.server.ts";

const spot = {
  _id: 1,
  Name: "測試景點",
  Zone: "三民區",
  Picture1: "https://example.com/spot.jpg",
  Opentime: "全天",
  Add: "高雄市三民區",
  Tel: "",
  Ticketinfo: "免費參觀",
};

function runLoad(fetchFn: typeof fetch) {
  return load({ fetch: fetchFn } as Parameters<typeof load>[0]);
}

test("loads display fields, keeps empty optional text and drops unused upstream fields", async () => {
  const result = await runLoad(async (_url, options) => {
    assert.ok(options?.signal instanceof AbortSignal);
    return Response.json({ result: { records: [{ ...spot, Description: "large unused text" }] } });
  });
  assert.equal(result.errorMessage, null);
  assert.deepEqual(result.spots, [spot]);
});

test("an empty dataset is a successful empty result", async () => {
  const result = await runLoad(async () => Response.json({ result: { records: [] } }));
  assert.deepEqual(result, { spots: [], errorMessage: null });
});

for (const [name, fetchFn] of [
  ["network failure", async () => { throw new Error("upstream network details"); }],
  ["timeout", async () => { throw new DOMException("Timeout", "TimeoutError"); }],
  ["HTTP failure", async () => new Response("unavailable", { status: 503 })],
] as const) {
  test(`${name} returns a safe Chinese error without upstream details`, async () => {
    const result = await runLoad(fetchFn);
    assert.deepEqual(result, { spots: [], errorMessage: "無法取得旅遊資訊，請稍後再試。" });
  });
}

for (const [name, response] of [
  ["invalid JSON", () => new Response("not json")],
  ["missing records", () => Response.json({ result: {} })],
  ["invalid record", () => Response.json({ result: { records: [spot, { ...spot, _id: "2" }] } })],
  ["missing text field", () => Response.json({ result: { records: [{ ...spot, Zone: null }] } })],
] as const) {
  test(`${name} returns a format error without rendering partial records`, async () => {
    const result = await runLoad(async () => response());
    assert.deepEqual(result, { spots: [], errorMessage: "旅遊資訊格式有誤，請稍後再試。" });
  });
}
