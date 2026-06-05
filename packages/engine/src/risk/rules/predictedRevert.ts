import type { Finding } from "../../types.js";

export function predictedRevertRule(success: boolean, errorName?: string): Finding[] {
  if (success) return [];

  return [
    {
      id: "predicted-revert",
      severity: "HIGH",
      title: "Simulation predicts a revert",
      detail:
        "The forked transaction did not complete successfully, so signing would likely waste gas or fail.",
      evidence: [errorName ? `error: ${errorName}` : "error: unknown"],
    },
  ];
}
