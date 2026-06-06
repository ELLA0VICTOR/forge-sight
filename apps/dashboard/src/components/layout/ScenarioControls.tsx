"use client";

import { RiArrowRightUpLine, RiRefreshLine } from "react-icons/ri";
import type { ScenarioScript } from "@foresight/engine";
import { getScenario, scenarios } from "../../fixtures";
import { cn } from "../../lib/cn";
import { useScenarioPlayer } from "../../hooks/useScenarioPlayer";
import { useForesightStore } from "../../store/useForesightStore";

const labels: Record<ScenarioScript["id"], string> = {
  "happy-path": "STANDARD SWAP",
  honeypot: "HONEYPOT",
  autopsy: "AUTOPSY",
};

export function ScenarioControls() {
  const { mode, scenarioId, setMode, loadScenario, script } = useForesightStore();
  const player = useScenarioPlayer(script);

  return (
    <div className="flex items-center gap-2">
      <nav className="hidden items-center gap-1 rounded-full border border-border bg-surface/70 p-1 xl:flex" aria-label="Scenario">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => loadScenario(getScenario(scenario.id))}
            className={cn(
              "h-8 rounded-full px-3 font-sans text-[12px] font-semibold text-text3",
              scenarioId === scenario.id ? "bg-surface3 text-text1" : "hover:text-text1",
            )}
          >
            {labels[scenario.id]}
          </button>
        ))}
      </nav>
      <button
        type="button"
        onClick={player.play}
        className="grid size-10 place-items-center rounded-[14px] border border-border bg-surface text-text2 hover:border-border2 hover:text-text1"
        title="Replay scenario"
      >
        <RiRefreshLine className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "demo" ? "live" : "demo")}
        className="inline-flex h-10 items-center gap-2 rounded-[14px] border border-button bg-button px-4 font-sans text-[14px] font-semibold text-buttonText hover:opacity-90"
      >
        {mode === "demo" ? "Demo" : "Live"}
        <RiArrowRightUpLine className="size-4" />
      </button>
    </div>
  );
}
