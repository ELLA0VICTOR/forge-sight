import type { ConsoleStep, ScenarioScript, SimPhase } from "../types.js";
import { DEFAULT_FORK_BLOCK, demoAddresses, networkConfig } from "../config.js";
import { demoFailedTxHash, diagnose } from "../diagnose/diagnose.js";
import { happyPathTx, honeypotTx } from "../sim/simulate.js";
import { simulate } from "../sim/simulate.js";

const simPhases: SimPhase[] = [
  "IDLE",
  "INTERCEPT",
  "SIMULATING",
  "RESULT",
  "LEDGER",
  "STATE",
  "FINDINGS",
  "VERDICT",
  "DONE",
];

const diagnosePhases: SimPhase[] = [
  "IDLE",
  "INTERCEPT",
  "TRACING",
  "TRACE",
  "REVERT",
  "DIAGNOSIS",
  "DONE",
];

function happyConsole(): ConsoleStep[] {
  return [
    {
      id: "happy-user",
      role: "user",
      kind: "text",
      atPhase: "INTERCEPT",
      content: "Swap 100 USDC for WPHRS using the SimpleRouter, max 0.5% slippage.",
    },
    {
      id: "happy-thinking",
      role: "agent",
      kind: "thinking",
      atPhase: "INTERCEPT",
      content: "Planning route and building the swap transaction...",
    },
    {
      id: "happy-tx",
      role: "agent",
      kind: "proposed-tx",
      atPhase: "INTERCEPT",
      content: "tx proposed",
      tx: {
        to: demoAddresses.router,
        contractName: "SimpleRouter",
        functionName: "swap",
        valueLabel: "0 PHRS",
      },
    },
    {
      id: "happy-run",
      role: "agent",
      kind: "text",
      atPhase: "SIMULATING",
      content: "Running Foresight pre-flight before signing.",
    },
    {
      id: "happy-decision",
      role: "agent",
      kind: "decision",
      atPhase: "VERDICT",
      decision: "signed",
      content:
        "Foresight verdict: SIGN (risk 12). Net result minus 100 USDC, plus 99.5 WPHRS. Allowance is scoped to the exact amount. Signing now.",
    },
  ];
}

function honeypotConsole(): ConsoleStep[] {
  return [
    {
      id: "honeypot-user",
      role: "user",
      kind: "text",
      atPhase: "INTERCEPT",
      content: "Ape 1 PHRS into $MOON, it's pumping.",
    },
    {
      id: "honeypot-thinking",
      role: "agent",
      kind: "thinking",
      atPhase: "INTERCEPT",
      content: "Building a buy for MOON through SimpleRouter...",
    },
    {
      id: "honeypot-tx",
      role: "agent",
      kind: "proposed-tx",
      atPhase: "INTERCEPT",
      content: "tx proposed",
      tx: {
        to: demoAddresses.router,
        contractName: "SimpleRouter",
        functionName: "swap",
        valueLabel: "1 WPHRS in",
      },
    },
    {
      id: "honeypot-run",
      role: "agent",
      kind: "text",
      atPhase: "SIMULATING",
      content: "Running Foresight pre-flight, including a round-trip sell test.",
    },
    {
      id: "honeypot-decision",
      role: "agent",
      kind: "decision",
      atPhase: "VERDICT",
      decision: "refused",
      content:
        "Foresight verdict: DO NOT SIGN (risk 96). $MOON is a honeypot - the sell reverts with SellBlocked from any non-owner address, while the owner can sell freely. Buying it would trap your funds. I will not sign this. Recommend avoiding $MOON.",
    },
  ];
}

function autopsyConsole(): ConsoleStep[] {
  return [
    {
      id: "autopsy-user",
      role: "user",
      kind: "text",
      atPhase: "INTERCEPT",
      content: `My swap failed earlier. Tx ${demoFailedTxHash} - what happened?`,
    },
    {
      id: "autopsy-tracing",
      role: "agent",
      kind: "text",
      atPhase: "TRACING",
      content: "Pulling the execution trace and locating the reverting frame.",
    },
    {
      id: "autopsy-diagnosis",
      role: "agent",
      kind: "decision",
      atPhase: "DIAGNOSIS",
      decision: "n/a",
      content:
        "It reverted in SimpleRouter.swap with InsufficientOutputAmount. The route returned 99.5 WPHRS but you required at least 99.6 (price moved ~0.1%). Here is a corrected transaction with minOut set to 98.0.",
    },
  ];
}

export async function makeScenarioScripts(): Promise<ScenarioScript[]> {
  const happyTx = happyPathTx();
  const moonTx = honeypotTx();
  const happy = await simulate(happyTx);
  const honeypot = await simulate(moonTx);
  const autopsy = await diagnose(demoFailedTxHash);

  return [
    {
      id: "happy-path",
      title: "Standard swap",
      subtitle: "USDC to WPHRS via SimpleRouter",
      kind: "simulate",
      network: networkConfig,
      block: DEFAULT_FORK_BLOCK,
      transaction: happyTx,
      report: happy,
      console: happyConsole(),
      telemetry: happy.telemetry,
      phaseOrder: simPhases,
    },
    {
      id: "honeypot",
      title: "Honeypot detected",
      subtitle: "$MOON cannot be sold",
      kind: "simulate",
      network: networkConfig,
      block: DEFAULT_FORK_BLOCK,
      transaction: moonTx,
      report: honeypot,
      console: honeypotConsole(),
      telemetry: honeypot.telemetry,
      phaseOrder: simPhases,
    },
    {
      id: "autopsy",
      title: "Failure autopsy",
      subtitle: "Why the swap reverted",
      kind: "diagnose",
      network: networkConfig,
      block: DEFAULT_FORK_BLOCK,
      transaction: happyTx,
      txHash: demoFailedTxHash,
      diagnosis: autopsy,
      console: autopsyConsole(),
      telemetry: autopsy.telemetry,
      phaseOrder: diagnosePhases,
    },
  ];
}
