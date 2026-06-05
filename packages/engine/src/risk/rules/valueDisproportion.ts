import type { Finding } from "../../types.js";

export function valueDisproportionRule(params: {
  valueAtRiskPct: number;
  warnPct: number;
}): Finding[] {
  if (params.valueAtRiskPct < params.warnPct) return [];

  return [
    {
      id: "value-disproportion",
      severity: "MEDIUM",
      title: "Large value exposure",
      detail: "The proposed transaction puts a large share of the wallet's tracked value at risk.",
      evidence: [`value at risk: ${params.valueAtRiskPct}%`],
    },
  ];
}
