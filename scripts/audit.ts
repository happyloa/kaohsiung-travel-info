import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// CVE-2026-93753 was REJECTED by its CNA on 2026-11-02.
// https://github.com/CVEProject/cvelistV5/blob/main/cves/2026/93xxx/CVE-2026-93753.json
// Remove this exception once npm's advisory database catches up.
const rejectedAdvisory = "https://github.com/advisories/GHSA-gcqx-w48m-w2h4";

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function assessAudit(report: unknown) {
  if (!record(report) || report.error || !record(report.vulnerabilities)) {
    throw new Error("Invalid npm audit report; security verification failed.");
  }
  const vulnerabilities = report.vulnerabilities;

  function actionable(name: string, ancestors = new Set<string>()): boolean {
    if (ancestors.has(name)) return true;
    const vulnerability = vulnerabilities[name];
    if (!record(vulnerability) || !Array.isArray(vulnerability.via) || !vulnerability.via.length) {
      throw new Error(`Missing advisory details for ${name}.`);
    }
    const path = new Set([...ancestors, name]);
    return vulnerability.via.some((via: unknown) => {
      if (typeof via === "string") return actionable(via, path);
      return !record(via) || via.name !== "deepmerge" || via.url !== rejectedAdvisory;
    });
  }

  const result = { actionable: [] as string[], rejected: [] as string[] };
  for (const name of Object.keys(vulnerabilities)) {
    result[actionable(name) ? "actionable" : "rejected"].push(name);
  }
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (!process.env.npm_execpath) throw new Error("Run this check with npm run audit.");
    const audit = spawnSync(process.execPath, [process.env.npm_execpath, "audit", "--json"], {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
    if (audit.error) throw audit.error;
    if (audit.status !== 0 && audit.status !== 1) {
      throw new Error(audit.stderr || "npm audit could not complete.");
    }
    const result = assessAudit(JSON.parse(audit.stdout));
    if (result.rejected.length) {
      console.log(`CNA-rejected CVE-2026-93753: ${result.rejected.join(", ")} (npm database pending).`);
    }
    if (result.actionable.length) {
      console.error(`Actionable vulnerabilities: ${result.actionable.join(", ")}. Run npm audit for details.`);
      process.exitCode = 1;
    } else {
      console.log("No actionable vulnerabilities.");
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
