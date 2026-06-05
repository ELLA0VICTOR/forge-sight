export type Address = `0x${string}`;
export type Hex = `0x${string}`;

export type SimPhase =
  | "IDLE"
  | "INTERCEPT"
  | "SIMULATING"
  | "RESULT"
  | "LEDGER"
  | "STATE"
  | "FINDINGS"
  | "VERDICT"
  | "DONE"
  | "TRACING"
  | "TRACE"
  | "REVERT"
  | "DIAGNOSIS";

export type Severity = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RiskBand = "SAFE" | "CAUTION" | "DANGER" | "CRITICAL";
export type VerdictDecision = "SIGN" | "REVIEW" | "DO_NOT_SIGN";

export interface TxRequest {
  from: Address;
  to: Address;
  data: Hex;
  value?: string;
}

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  wsUrl?: string;
  nativeCurrency: string;
  explorerUrl: string;
  explorerApiUrl: string;
  explorerVerifyApiUrl: string;
  forkBlock?: number;
}

export interface ContractLabel {
  address: Address;
  name: string;
  verified: boolean;
  deployedBlock?: number;
}

export interface DecodedCall {
  to: Address;
  contractName: string;
  functionName: string;
  humanReadable: string;
  verified: boolean;
  args: Record<string, string>;
}

export interface BalanceDelta {
  token: Address | "native";
  symbol: string;
  decimals: number;
  before: string;
  after: string;
  delta: string;
}

export interface StateChange {
  contract: Address;
  contractName: string;
  variable: string;
  slot: Hex;
  humanBefore: string;
  humanAfter: string;
  isCritical: boolean;
}

export interface EventSummary {
  address: Address;
  contractName: string;
  eventName: string;
  detail: string;
}

export interface Finding {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  evidence: string[];
}

export interface RoundTripResult {
  tested: boolean;
  token: Address;
  tokenSymbol: string;
  buy: "ok" | "reverted";
  sellAsAgent: "ok" | "reverted";
  sellAsFresh: "ok" | "reverted";
  sellAsOwner: "ok" | "reverted";
  errorName?: string;
  asymmetric: boolean;
}

export interface CallNode {
  id: string;
  depth: number;
  type: "CALL" | "STATICCALL" | "DELEGATECALL" | "CREATE";
  contractName: string;
  functionName: string;
  to: Address;
  gasUsed: string;
  reverted: boolean;
  errorName?: string;
  errorArgs?: Record<string, string>;
  children: CallNode[];
}

export interface Verdict {
  decision: VerdictDecision;
  score: number;
  band: RiskBand;
  headline: string;
  paragraph: string;
}

export interface TelemetryEvent {
  t: number;
  phase: SimPhase | "system";
  level: "info" | "ok" | "warn" | "error";
  message: string;
}

export interface SimReport {
  id: string;
  tx: TxRequest;
  network: NetworkConfig;
  forkBlock: number;
  success: boolean;
  decoded: DecodedCall;
  gasUsed: string;
  balanceDeltas: BalanceDelta[];
  stateChanges: StateChange[];
  events: EventSummary[];
  findings: Finding[];
  roundTrip?: RoundTripResult;
  callTree: CallNode;
  verdict: Verdict;
  telemetry: TelemetryEvent[];
}

export interface SuggestedTx {
  to: Address;
  data: Hex;
  value: string;
  note: string;
}

export interface DiagnoseReport {
  id: string;
  txHash: Hex;
  network: NetworkConfig;
  callTree: CallNode;
  revertingFrame: string;
  errorName: string;
  errorArgs: Record<string, string>;
  rootCause: string;
  fix: {
    summary: string;
    suggestedTx: SuggestedTx;
  };
  telemetry: TelemetryEvent[];
}

export interface ConsoleStep {
  id: string;
  role: "user" | "agent" | "system";
  kind: "text" | "thinking" | "proposed-tx" | "decision";
  atPhase: SimPhase;
  content: string;
  tx?: {
    to: Address;
    contractName: string;
    functionName: string;
    valueLabel: string;
  };
  decision?: "signed" | "refused" | "n/a";
}

export interface ScenarioScript {
  id: "happy-path" | "honeypot" | "autopsy";
  title: string;
  subtitle: string;
  kind: "simulate" | "diagnose";
  network: NetworkConfig;
  block: number;
  transaction: TxRequest;
  txHash?: Hex;
  report?: SimReport;
  diagnosis?: DiagnoseReport;
  console: ConsoleStep[];
  telemetry: TelemetryEvent[];
  phaseOrder: SimPhase[];
}
