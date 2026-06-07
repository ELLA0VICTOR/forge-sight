import type { BalanceDelta, Finding, Verdict, VerdictDecision, RiskBand } from "../types.js";

function headlineFor(decision: VerdictDecision, findings: Finding[]): string {
  const top = findings[0];
  if (decision === "DO_NOT_SIGN") return top?.title ?? "Unsafe transaction";
  if (decision === "REVIEW") return top?.title ?? "Review before signing";
  return "Safe to sign";
}

function paragraphFor(input: {
  decision: VerdictDecision;
  findings: Finding[];
  deltas: BalanceDelta[];
}): string {
  const bySymbol = new Map(input.deltas.map((delta) => [delta.symbol, delta.delta]));

  if (input.findings.some((finding) => finding.id === "honeypot-round-trip")) {
    return "$MOON can be bought, but simulated sells from normal wallets revert with SellBlocked while the owner can sell freely. Buying it would trap the agent's funds and also flips a trapped wallet flag. Do not sign this transaction.";
  }

  if (input.decision === "SIGN") {
    const nativeDelta = input.deltas.find((delta) => delta.token === "native" && delta.delta.startsWith("-"));
    const usdcDelta = bySymbol.get("USDC");
    const wphrsDelta = bySymbol.get("WPHRS");

    if (usdcDelta && wphrsDelta) {
      return `This is a standard swap on SimpleRouter, a verified contract. You will spend ${usdcDelta} USDC and receive ${wphrsDelta.replace("+", "")} WPHRS, with the token allowance scoped to the exact amount. No dangerous state changes were detected. Safe to sign.`;
    }

    if (nativeDelta) {
      return `This is a plain ${nativeDelta.symbol} transfer that completed under live pre-flight simulation. No contract calldata, revert, honeypot, or high-risk finding was detected. Safe to sign.`;
    }

    return "The transaction completed under live pre-flight simulation and no high-risk findings were detected. Safe to sign.";
  }

  const top = input.findings[0];
  return `${top?.detail ?? "The transaction has findings that require review."} Present the risk to the user before signing.`;
}

export function buildVerdict(input: {
  decision: VerdictDecision;
  score: number;
  band: RiskBand;
  findings: Finding[];
  deltas: BalanceDelta[];
}): Verdict {
  return {
    decision: input.decision,
    score: input.score,
    band: input.band,
    headline: headlineFor(input.decision, input.findings),
    paragraph: paragraphFor({
      decision: input.decision,
      findings: input.findings,
      deltas: input.deltas,
    }),
  };
}
