import type { DecodedCall, Finding } from "../../types.js";

export function unverifiedContractRule(decoded: DecodedCall, options: { hasCode?: boolean } = {}): Finding[] {
  if (decoded.verified) return [];
  if (options.hasCode === false) return [];

  return [
    {
      id: "unverified-contract",
      severity: "HIGH",
      title: "Unverified contract",
      detail:
        "The target contract is not verified in the local or explorer ABI set, so the decoded surface is lower confidence.",
      evidence: [`contract: ${decoded.contractName}`, `address: ${decoded.to}`],
    },
  ];
}
