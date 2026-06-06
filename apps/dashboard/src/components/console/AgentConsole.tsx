"use client";

import { RiRefreshLine } from "react-icons/ri";
import type { ScenarioScript } from "@foresight/engine";
import { Panel } from "../primitives/Panel";
import { getScenario, scenarios } from "../../fixtures";
import { cn } from "../../lib/cn";
import { useScenarioPlayer } from "../../hooks/useScenarioPlayer";
import { useForesightStore } from "../../store/useForesightStore";
import { ConsoleMessage } from "./ConsoleMessage";

const labels: Record<ScenarioScript["id"], string> = {
  "happy-path": "Standard",
  honeypot: "Honeypot",
  autopsy: "Autopsy",
};

export function AgentConsole() {
  const { consoleShown, scenarioId, loadScenario, script } = useForesightStore();
  const player = useScenarioPlayer(script);

  return (
    <Panel
      title="Agent flow"
      className="h-full border-r border-border bg-surface/70"
      right={
        <button
          type="button"
          onClick={player.play}
          className="inline-flex h-8 items-center gap-2 rounded-[10px] border border-border px-3 font-sans text-[12px] font-semibold text-text3 hover:border-border2 hover:text-text1"
        >
          <RiRefreshLine className="size-4" />
          Replay
        </button>
      }
    >
      <div className="grid grid-cols-3 border-b border-border">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => loadScenario(getScenario(scenario.id))}
            className={cn(
              "h-11 border-r border-border font-sans text-[13px] font-semibold last:border-r-0",
              scenarioId === scenario.id ? "bg-surface2 text-text1" : "text-text4 hover:text-text2",
            )}
          >
            {labels[scenario.id]}
          </button>
        ))}
      </div>
      <div className="bench-scroll h-[calc(100%-93px)] overflow-y-auto">
        {consoleShown.map((step, index) => (
          <ConsoleMessage key={step.id} step={step} index={index} />
        ))}
      </div>
    </Panel>
  );
}
