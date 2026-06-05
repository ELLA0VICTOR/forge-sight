import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { makeScenarioScripts } from "@foresight/engine";

const rootFixtures = resolve(process.cwd(), "../../fixtures");
const dashboardFixtures = resolve(process.cwd(), "../../apps/dashboard/src/fixtures");

async function writeJson(dir: string, name: string, data: unknown) {
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, name), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

const scripts = await makeScenarioScripts();

for (const script of scripts) {
  const filename = `${script.id}.json`;
  await writeJson(rootFixtures, filename, script);
  await writeJson(dashboardFixtures, filename, script);
}

console.error(`Wrote ${scripts.length} Foresight fixtures.`);
