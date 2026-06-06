export type {
  Address,
  BalanceDelta,
  CallNode,
  ConsoleStep,
  DecodedCall,
  DiagnoseReport,
  EventSummary,
  Finding,
  Hex,
  NetworkConfig,
  RiskBand,
  RoundTripResult,
  ScenarioScript,
  Severity,
  SimPhase,
  SimReport,
  StateChange,
  TelemetryEvent,
  TxRequest,
  Verdict,
  VerdictDecision,
} from "./types.js";

export { demoAddresses, networkConfig } from "./config.js";
export { explainCalldata } from "./decoder/calldata.js";
export { renderDiagnosisForAgent, renderReportForAgent } from "./explain/agentText.js";
export { diagnose, demoFailedTxHash } from "./diagnose/diagnose.js";
export {
  failingSwapTx,
  happyPathTx,
  honeypotTx,
  simulate,
  unlimitedApprovalTx,
} from "./sim/simulate.js";
export { makeScenarioScripts } from "./fixtures/scenarios.js";
