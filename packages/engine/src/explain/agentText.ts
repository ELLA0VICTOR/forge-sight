import type { DiagnoseReport, SimReport } from "../types.js";

export function renderReportForAgent(report: SimReport): string {
  const findings = report.findings
    .map((finding) => `- [${finding.severity}] ${finding.title}: ${finding.detail}`)
    .join("\n");
  const deltas = report.balanceDeltas
    .map((delta) => `- ${delta.symbol}: ${delta.delta} (${delta.before} -> ${delta.after})`)
    .join("\n");
  const state = report.stateChanges.length
    ? report.stateChanges
        .map((change) => `- ${change.variable}: ${change.humanBefore} -> ${change.humanAfter}`)
        .join("\n")
    : "- No critical state changes detected.";

  return [
    `DECISION: ${report.verdict.decision} (risk ${report.verdict.score}, ${report.verdict.band})`,
    `Headline: ${report.verdict.headline}`,
    "",
    "Findings:",
    findings || "- [INFO] No material risks detected.",
    "",
    "Net balance deltas:",
    deltas,
    "",
    "Key state changes:",
    state,
    "",
    `Recommendation: ${report.verdict.paragraph}`,
  ].join("\n");
}

export function renderDiagnosisForAgent(report: DiagnoseReport): string {
  return [
    `DIAGNOSIS: ${report.errorName}`,
    `Reverting frame: ${report.revertingFrame}`,
    `Root cause: ${report.rootCause}`,
    `Fix: ${report.fix.summary}`,
    `Suggested tx: ${report.fix.suggestedTx.to} ${report.fix.suggestedTx.data}`,
  ].join("\n");
}
