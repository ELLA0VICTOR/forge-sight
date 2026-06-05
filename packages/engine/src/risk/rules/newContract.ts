import type { Finding } from "../../types.js";

export function newContractRule(params: { deployedBlock: number | undefined; forkBlock: number; window: number }): Finding[] {
  if (!params.deployedBlock) return [];

  const age = params.forkBlock - params.deployedBlock;
  if (age > params.window) return [];

  return [
    {
      id: "new-contract",
      severity: "MEDIUM",
      title: "Recently deployed contract",
      detail:
        "The contract is inside the new-contract window. Fresh contracts deserve extra review before signing.",
      evidence: [`age: ${age} blocks`, `window: ${params.window} blocks`],
    },
  ];
}
