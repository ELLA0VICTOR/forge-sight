"use client";

import { useEffect, useMemo } from "react";
import { AgentConsole } from "../console/AgentConsole";
import { ForesightPanel } from "../foresight/ForesightPanel";
import { TelemetryLog } from "../footer/TelemetryLog";
import { TopBar } from "./TopBar";
import { getScenario } from "../../fixtures";
import { useScenarioPlayer } from "../../hooks/useScenarioPlayer";
import { useForesightStore } from "../../store/useForesightStore";

export function AppShell({
  initialScenario,
  initialMode,
}: {
  initialScenario: string;
  initialMode: "demo" | "live";
}) {
  const setMode = useForesightStore((state) => state.setMode);
  const loadScenario = useForesightStore((state) => state.loadScenario);
  const script = useMemo(() => getScenario(initialScenario), [initialScenario]);
  const player = useScenarioPlayer(script);

  useEffect(() => {
    setMode(initialMode);
    loadScenario(script);
    const timer = window.setTimeout(player.play, 600);
    return () => window.clearTimeout(timer);
  }, [initialMode, loadScenario, player.play, script, setMode]);

  return (
    <main className="v12-shell grid h-screen grid-rows-[76px_minmax(0,1fr)_auto] overflow-hidden text-text1">
      <TopBar />
      <section className="relative z-10 min-h-0 px-4 py-4 md:px-8">
        <div className="workbench-frame mx-auto grid h-full max-w-[1536px] overflow-hidden rounded-[18px] border border-border lg:grid-cols-[minmax(320px,34%)_minmax(0,1fr)]">
          <AgentConsole />
          <ForesightPanel />
        </div>
      </section>
      <TelemetryLog />
    </main>
  );
}
