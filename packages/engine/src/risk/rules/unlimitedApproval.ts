import type { DecodedCall, Finding } from "../../types.js";

export function unlimitedApprovalRule(decoded: DecodedCall): Finding[] {
  if (decoded.functionName !== "approve" || decoded.args.unlimited !== "true") {
    return [];
  }

  return [
    {
      id: "unlimited-approval",
      severity: "HIGH",
      title: "Unlimited token approval",
      detail:
        "The transaction grants an unlimited token allowance. A compromised spender could drain future balances.",
      evidence: [
        `spender: ${decoded.args.spender ?? "unknown"}`,
        "amount: MaxUint256",
      ],
    },
  ];
}
