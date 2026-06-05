import type {
  ContractLabel,
  DecodedCall,
  Finding,
  RiskBand,
  RoundTripResult,
  StateChange,
  VerdictDecision,
} from "../types.js";
import { hiddenStateWriteRule } from "./rules/hiddenStateWrite.js";
import { honeypotRule } from "./rules/honeypot.js";
import { newContractRule } from "./rules/newContract.js";
import { predictedRevertRule } from "./rules/predictedRevert.js";
import { unlimitedApprovalRule } from "./rules/unlimitedApproval.js";
import { unverifiedContractRule } from "./rules/unverifiedContract.js";
import { valueDisproportionRule } from "./rules/valueDisproportion.js";

const severityScore: Record<Finding["severity"], number> = {
  INFO: 0,
  LOW: 10,
  MEDIUM: 35,
  HIGH: 70,
  CRITICAL: 95,
};

export function bandForScore(score: number): RiskBand {
  if (score <= 25) return "SAFE";
  if (score <= 50) return "CAUTION";
  if (score <= 80) return "DANGER";
  return "CRITICAL";
}

export function decisionForFindings(findings: Finding[]): VerdictDecision {
  if (findings.some((finding) => finding.severity === "CRITICAL")) return "DO_NOT_SIGN";
  if (findings.some((finding) => finding.severity === "HIGH")) return "REVIEW";
  return "SIGN";
}

export function scoreFindings(findings: Finding[], preferredScore?: number): number {
  if (typeof preferredScore === "number") return preferredScore;
  const base = findings.reduce((max, finding) => Math.max(max, severityScore[finding.severity]), 0);
  const extras = Math.min(20, Math.max(0, findings.length - 1) * 5);
  return Math.min(100, base + extras);
}

export function runRiskRules(context: {
  decoded: DecodedCall;
  success: boolean;
  stateChanges: StateChange[];
  roundTrip?: RoundTripResult;
  label?: ContractLabel;
  forkBlock: number;
  valueAtRiskPct?: number;
  preferredScore?: number;
}): {
  findings: Finding[];
  score: number;
  band: RiskBand;
  decision: VerdictDecision;
} {
  const findings = [
    ...honeypotRule(context.roundTrip),
    ...unlimitedApprovalRule(context.decoded),
    ...unverifiedContractRule(context.decoded),
    ...hiddenStateWriteRule(context.stateChanges),
    ...predictedRevertRule(context.success),
    ...valueDisproportionRule({
      valueAtRiskPct: context.valueAtRiskPct ?? 0,
      warnPct: Number(process.env.VALUE_WARN_PCT ?? 90),
    }),
    ...newContractRule({
      deployedBlock: context.label?.deployedBlock,
      forkBlock: context.forkBlock,
      window: Number(process.env.NEW_CONTRACT_WINDOW ?? 5000),
    }),
  ];

  const score = scoreFindings(findings, context.preferredScore);
  const band = bandForScore(score);
  const decision = decisionForFindings(findings);

  return {
    findings,
    score,
    band,
    decision,
  };
}
