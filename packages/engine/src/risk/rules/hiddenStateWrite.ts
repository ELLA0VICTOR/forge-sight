import type { Finding, StateChange } from "../../types.js";

export function hiddenStateWriteRule(changes: StateChange[]): Finding[] {
  const critical = changes.filter((change) => change.isCritical);
  if (critical.length === 0) return [];

  return [
    {
      id: "critical-state-write",
      severity: "HIGH",
      title: "Suspicious critical state write",
      detail:
        "The transaction writes to a sensitive state variable that changes the user's exit conditions.",
      evidence: critical.map(
        (change) => `${change.variable}: ${change.humanBefore} -> ${change.humanAfter}`,
      ),
    },
  ];
}
