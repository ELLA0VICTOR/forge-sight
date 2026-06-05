"use client";

import { useEffect, useMemo } from "react";
import { AgentConsole } from "../console/AgentConsole";
import { ForesightPanel } from "../foresight/ForesightPanel";
import { TelemetryLog } from "../footer/TelemetryLog";
import { ScanlineOverlay } from "../primitives/ScanlineOverlay";
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
    <main className="grid h-screen grid-rows-[56px_1fr_132px] bg-void text-ink-primary">
      <TopBar />
      <div className="grid min-h-0 grid-cols-1 gap-px bg-line-subtle lg:grid-cols-[minmax(380px,38%)_1fr]">
        <div className="min-h-0 bg-base p-3">
          <AgentConsole />
        </div>
        <ForesightPanel />
      </div>
      <TelemetryLog />
      <ScanlineOverlay />
    </main>
  );
}
