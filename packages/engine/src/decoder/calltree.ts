import type { Address, CallNode } from "../types.js";

export function callNode(params: {
  id: string;
  depth: number;
  type?: CallNode["type"];
  contractName: string;
  functionName: string;
  to: Address;
  gasUsed: string;
  reverted?: boolean;
  errorName?: string;
  errorArgs?: Record<string, string>;
  children?: CallNode[];
}): CallNode {
  return {
    type: "CALL",
    reverted: false,
    children: [],
    ...params,
  };
}

export function buildCallTree(root: CallNode): CallNode {
  return root;
}
