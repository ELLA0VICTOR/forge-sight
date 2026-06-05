import type { Finding, RoundTripResult } from "../../types.js";

export function honeypotRule(roundTrip?: RoundTripResult): Finding[] {
  if (!roundTrip?.tested || !roundTrip.asymmetric) return [];

  return [
    {
      id: "honeypot-round-trip",
      severity: "CRITICAL",
      title: "Honeypot detected",
      detail:
        "The token can be bought, but sell attempts from normal wallets revert while the owner can exit.",
      evidence: [
        "Buy simulation succeeded.",
        `Sell as agent reverted with ${roundTrip.errorName ?? "unknown error"}.`,
        "Sell as owner succeeded.",
      ],
    },
  ];
}
