import type { SimPhase } from "@foresight/engine";

export const revealByPhase: Partial<Record<SimPhase, Array<"ledger" | "state" | "findings" | "verdict">>> = {
  LEDGER: ["ledger"],
  STATE: ["state"],
  FINDINGS: ["findings"],
  VERDICT: ["verdict"],
  DIAGNOSIS: ["verdict"],
};

export const phaseDurations: Partial<Record<SimPhase, number>> = {
  IDLE: 600,
  INTERCEPT: 900,
  SIMULATING: 2200,
  RESULT: 1100,
  LEDGER: 700,
  STATE: 600,
  FINDINGS: 900,
  VERDICT: 700,
  TRACING: 1800,
  TRACE: 1000,
  REVERT: 700,
  DIAGNOSIS: 900,
  DONE: 0,
};
