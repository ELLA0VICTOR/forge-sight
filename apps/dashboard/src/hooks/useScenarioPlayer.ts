"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ScenarioScript, SimPhase } from "@foresight/engine";
import { phaseDurations, revealByPhase } from "../lib/phases";
import { useForesightStore } from "../store/useForesightStore";

export function useScenarioPlayer(script?: ScenarioScript) {
  const timers = useRef<number[]>([]);
  const {
    loadScenario,
    setPhase,
    pushTelemetry,
    revealSection,
    pushConsole,
    setPlaybackState,
  } = useForesightStore();

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const timer = window.setTimeout(fn, delay);
    timers.current.push(timer);
  }, []);

  const play = useCallback(() => {
    if (!script) return;
    clearTimers();
    loadScenario(script);
    setPlaybackState("playing");

    let cursor = 0;
    const telemetry = script.telemetry;

    for (const phase of script.phaseOrder) {
      schedule(() => {
        setPhase(phase);

        for (const section of revealByPhase[phase] ?? []) {
          revealSection(section);
        }

        script.console
          .filter((step) => step.atPhase === phase)
          .forEach((step, index) => {
            schedule(() => pushConsole(step), index * 120);
          });

        telemetry
          .filter((event) => event.phase === phase)
          .forEach((event, index) => {
            schedule(() => pushTelemetry(event), index * 180);
          });

        if (phase === "DONE") setPlaybackState("done");
      }, cursor);

      cursor += phaseDurations[phase as SimPhase] ?? 500;
    }
  }, [
    clearTimers,
    loadScenario,
    pushConsole,
    pushTelemetry,
    revealSection,
    schedule,
    script,
    setPhase,
    setPlaybackState,
  ]);

  const pause = useCallback(() => {
    clearTimers();
    setPlaybackState("paused");
  }, [clearTimers, setPlaybackState]);

  const reset = useCallback(() => {
    if (!script) return;
    clearTimers();
    loadScenario(script);
  }, [clearTimers, loadScenario, script]);

  const skipToEnd = useCallback(() => {
    if (!script) return;
    clearTimers();
    loadScenario(script);
    for (const phase of script.phaseOrder) setPhase(phase);
    script.telemetry.forEach(pushTelemetry);
    script.console.forEach(pushConsole);
    revealSection("ledger");
    revealSection("state");
    revealSection("findings");
    revealSection("verdict");
    setPlaybackState("done");
  }, [
    clearTimers,
    loadScenario,
    pushConsole,
    pushTelemetry,
    revealSection,
    script,
    setPhase,
    setPlaybackState,
  ]);

  useEffect(() => clearTimers, [clearTimers]);

  return { play, pause, reset, skipToEnd };
}
