import type { ScenarioScript } from "@foresight/engine";
import happyPath from "./happy-path.json";
import honeypot from "./honeypot.json";
import autopsy from "./autopsy.json";

const happyPathScript = happyPath as unknown as ScenarioScript;
const honeypotScript = honeypot as unknown as ScenarioScript;
const autopsyScript = autopsy as unknown as ScenarioScript;

export const scenarios: ScenarioScript[] = [happyPathScript, honeypotScript, autopsyScript];

export function getScenario(id: string): ScenarioScript {
  return scenarios.find((scenario) => scenario.id === id) ?? honeypotScript;
}