"use client";

import { create } from "zustand";
import type {
  ConsoleStep,
  DiagnoseReport,
  ScenarioScript,
  SimPhase,
  SimReport,
  TelemetryEvent,
} from "@foresight/engine";

interface RevealedState {
  ledger: boolean;
  state: boolean;
  findings: boolean;
  verdict: boolean;
}

interface ForesightStore {
  mode: "demo" | "live";
  scenarioId: ScenarioScript["id"];
  script?: ScenarioScript | undefined;
  phase: SimPhase;
  report?: SimReport | undefined;
  diagnosis?: DiagnoseReport | undefined;
  telemetryShown: TelemetryEvent[];
  consoleShown: ConsoleStep[];
  revealed: RevealedState;
  playbackState: "idle" | "playing" | "paused" | "done";
  setMode: (mode: "demo" | "live") => void;
  loadScenario: (script: ScenarioScript) => void;
  setPhase: (phase: SimPhase) => void;
  pushTelemetry: (event: TelemetryEvent) => void;
  revealSection: (section: keyof RevealedState) => void;
  pushConsole: (step: ConsoleStep) => void;
  setPlaybackState: (state: ForesightStore["playbackState"]) => void;
  reset: () => void;
}

const emptyRevealed: RevealedState = {
  ledger: false,
  state: false,
  findings: false,
  verdict: false,
};

export const useForesightStore = create<ForesightStore>((set, get) => ({
  mode: "demo",
  scenarioId: "honeypot",
  phase: "IDLE",
  telemetryShown: [
    { t: 0, phase: "system", level: "info", message: "engine ready - fork pinned @ block 23559136" },
  ],
  consoleShown: [
    {
      id: "system-online",
      role: "system",
      kind: "text",
      atPhase: "IDLE",
      content: "Foresight online. Select a scenario or send a transaction.",
    },
  ],
  revealed: emptyRevealed,
  playbackState: "idle",
  setMode: (mode) => set({ mode }),
  loadScenario: (script) =>
    set({
      scenarioId: script.id,
      script,
      phase: "IDLE",
      report: script.report,
      diagnosis: script.diagnosis,
      telemetryShown: [
        { t: 0, phase: "system", level: "info", message: "engine ready - fork pinned @ block 23559136" },
      ],
      consoleShown: [],
      revealed: { ...emptyRevealed },
      playbackState: "idle",
    }),
  setPhase: (phase) => set({ phase }),
  pushTelemetry: (event) =>
    set((state) => ({
      telemetryShown: [...state.telemetryShown, event],
    })),
  revealSection: (section) =>
    set((state) => ({
      revealed: { ...state.revealed, [section]: true },
    })),
  pushConsole: (step) => {
    const exists = get().consoleShown.some((item) => item.id === step.id);
    if (!exists) {
      set((state) => ({ consoleShown: [...state.consoleShown, step] }));
    }
  },
  setPlaybackState: (playbackState) => set({ playbackState }),
  reset: () => {
    const script = get().script;
    if (script) get().loadScenario(script);
  },
}));
