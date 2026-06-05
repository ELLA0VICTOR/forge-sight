"use client";

import { LuRotateCcw } from "react-icons/lu";
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
      <div className="hidden items-center gap-px border border-line-subtle bg-inset xl:flex">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => loadScenario(getScenario(scenario.id))}
            className={cn(
              "relative h-8 px-3 font-display text-[10px] font-semibold text-ink-tertiary hover:text-ink-primary",
              scenarioId === scenario.id && "text-ink-primary after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-scan",
            )}
          >
            {labels[scenario.id]}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={player.play}
        className="grid size-8 place-items-center border border-line-subtle bg-inset text-ink-tertiary hover:border-line-hot hover:text-ink-primary"
        title="Replay"
      >
        <LuRotateCcw className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "demo" ? "live" : "demo")}
        className="h-8 border border-line-subtle bg-inset px-3 font-display text-[10px] font-semibold text-ink-secondary hover:border-line-hot"
      >
        {mode === "demo" ? "DEMO" : "LIVE"}
      </button>
    </div>
  );
}
