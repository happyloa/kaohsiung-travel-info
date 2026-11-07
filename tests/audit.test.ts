import assert from "node:assert/strict";
import { test } from "node:test";
import { assessAudit } from "../scripts/audit.ts";

const rejected = { name: "deepmerge", url: "https://github.com/advisories/GHSA-gcqx-w48m-w2h4" };

test("ignores only the rejected CVE and its dependent-only findings", () => {
  assert.deepEqual(assessAudit({ vulnerabilities: {
    deepmerge: { via: [rejected] },
    plugin: { via: ["deepmerge"] },
    kit: { via: ["plugin"] },
  } }), { actionable: [], rejected: ["deepmerge", "plugin", "kit"] });
});

test("a new advisory still fails, including on the same dependency chain", () => {
  const result = assessAudit({ vulnerabilities: {
    deepmerge: { via: [rejected, { name: "deepmerge", url: "https://github.com/advisories/new" }] },
    kit: { via: ["deepmerge"] },
  } });
  assert.deepEqual(result, { actionable: ["deepmerge", "kit"], rejected: [] });
});

test("accepts a clean report", () => {
  assert.deepEqual(assessAudit({ vulnerabilities: {} }), { actionable: [], rejected: [] });
});

test("fails closed for errors, malformed reports, missing findings and cycles", () => {
  for (const report of [null, {}, { error: { code: "EAUDIT" }, vulnerabilities: {} },
    { vulnerabilities: [] }, { vulnerabilities: { kit: { via: [] } } },
    { vulnerabilities: { kit: { via: ["missing"] } } }]) {
    assert.throws(() => assessAudit(report));
  }
  assert.deepEqual(assessAudit({ vulnerabilities: {
    a: { via: ["b"] }, b: { via: ["a"] },
  } }).actionable, ["a", "b"]);
});
