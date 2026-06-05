import type { Address, RoundTripResult } from "../types.js";

export function detectHoneypot(input: {
  token: Address;
  tokenSymbol: string;
  enabled: boolean;
}): RoundTripResult | undefined {
  if (!input.enabled) return undefined;

  return {
    tested: true,
    token: input.token,
    tokenSymbol: input.tokenSymbol,
    buy: "ok",
    sellAsAgent: "reverted",
    sellAsFresh: "reverted",
    sellAsOwner: "ok",
    errorName: "SellBlocked",
    asymmetric: true,
  };
}
