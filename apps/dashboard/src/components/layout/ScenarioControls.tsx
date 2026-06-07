"use client";

import { RiRefreshLine } from "react-icons/ri";
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
  const { scenarioId, loadScenario, script, playbackState } = useForesightStore();
  const player = useScenarioPlayer(script);

  return (
    <div className="flex items-center gap-2">
      <nav className="hidden items-center gap-0 border border-border bg-surface/55 lg:flex" aria-label="Scenario">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => loadScenario(getScenario(scenario.id))}
            className={cn(
              "h-8 border-r border-border px-3 font-mono text-[10px] uppercase tracking-[0.08em] last:border-r-0",
              scenarioId === scenario.id ? "bg-surface3/70 text-text1" : "text-text4 hover:text-text2",
            )}
          >
            {labels[scenario.id]}
          </button>
        ))}
      </nav>
      <button
        type="button"
        onClick={player.play}
        className="grid size-9 place-items-center rounded-[10px] border border-border bg-surface text-text3 hover:border-border2 hover:text-text1"
        title="Replay scenario"
      >
        <RiRefreshLine className="size-4" />
      </button>
      <span className="hidden h-9 items-center border border-border px-3 font-mono text-[10px] uppercase tracking-[0.08em] text-text4 sm:inline-flex">
        {playbackState === "playing" ? "running replay" : "replay view"}
      </span>
    </div>
  );
}
