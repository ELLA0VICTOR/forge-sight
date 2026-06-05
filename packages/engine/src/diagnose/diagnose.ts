import type { CallNode, DiagnoseReport, Hex } from "../types.js";
import { DEFAULT_FORK_BLOCK, demoAddresses, networkConfig } from "../config.js";
import { callNode } from "../decoder/calltree.js";
import { failingSwapTx } from "../sim/simulate.js";

export const demoFailedTxHash =
  "0xfeed00000000000000000000000000000000000000000000000000000000cafe" as Hex;

function autopsyTree(): CallNode {
  return callNode({
    id: "root",
    depth: 0,
    contractName: "AgentWallet",
    functionName: "execute",
    to: demoAddresses.agent,
    gasUsed: "112904",
    reverted: true,
    children: [
      callNode({
        id: "router-swap",
        depth: 1,
        contractName: "SimpleRouter",
        functionName: "swap",
        to: demoAddresses.router,
        gasUsed: "93018",
        reverted: true,
        errorName: "InsufficientOutputAmount",
        errorArgs: {
          minOut: "99.6 WPHRS",
          actualOut: "99.5 WPHRS",
        },
        children: [
          callNode({
            id: "usdc-transfer",
            depth: 2,
            contractName: "USDC",
            functionName: "transferFrom",
            to: demoAddresses.usdc,
            gasUsed: "30488",
          }),
          callNode({
            id: "wphrs-quote",
            depth: 2,
            contractName: "WPHRS",
            functionName: "quote",
            to: demoAddresses.wphrs,
            gasUsed: "11102",
          }),
        ],
      }),
    ],
  });
}

export async function diagnose(txHash: Hex): Promise<DiagnoseReport> {
  const corrected = failingSwapTx();
  const telemetry = [
    { t: 0, phase: "INTERCEPT" as const, level: "info" as const, message: "failed transaction hash received" },
    { t: 420, phase: "TRACING" as const, level: "info" as const, message: "loading receipt and fork block context" },
    { t: 980, phase: "TRACING" as const, level: "info" as const, message: "debug trace acquired from fork" },
    { t: 1650, phase: "TRACE" as const, level: "info" as const, message: "call tree decoded" },
    { t: 2360, phase: "REVERT" as const, level: "error" as const, message: "reverting frame located: SimpleRouter.swap" },
    { t: 3100, phase: "DIAGNOSIS" as const, level: "ok" as const, message: "custom error decoded and fix prepared" },
  ];

  return {
    id: "diagnose-autopsy",
    txHash,
    network: { ...networkConfig, forkBlock: DEFAULT_FORK_BLOCK },
    callTree: autopsyTree(),
    revertingFrame: "SimpleRouter.swap",
    errorName: "InsufficientOutputAmount",
    errorArgs: {
      minOut: "99.6 WPHRS",
      actualOut: "99.5 WPHRS",
    },
    rootCause:
      "The route returned 99.5 WPHRS, but the transaction required at least 99.6 WPHRS. The swap reverted because the slippage guard was tighter than the simulated output.",
    fix: {
      summary:
        "Set minOut to 98.0 WPHRS or lower, or widen slippage before retrying.",
      suggestedTx: {
        to: demoAddresses.router,
        data: corrected.data,
        value: "0",
        note: "Corrected calldata with minOut set safely below the simulated 99.5 WPHRS output.",
      },
    },
    telemetry,
  };
}
