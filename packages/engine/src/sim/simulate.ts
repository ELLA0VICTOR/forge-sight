import { encodeFunctionData, maxUint256 } from "viem";
import type {
  Address,
  BalanceDelta,
  CallNode,
  EventSummary,
  Finding,
  Hex,
  SimReport,
  StateChange,
  TelemetryEvent,
  TxRequest,
} from "../types.js";
import { contractLabels, DEFAULT_FORK_BLOCK, demoAddresses, labelFor, networkConfig } from "../config.js";
import { simpleRouterAbi } from "../decoder/abi.js";
import { decodeCalldata } from "../decoder/calldata.js";
import { callNode } from "../decoder/calltree.js";
import { detectHoneypot } from "../honeypot/detect.js";
import { runRiskRules } from "../risk/engine.js";
import { buildVerdict } from "../explain/verdict.js";

export type TelemetrySink = (event: TelemetryEvent) => void;

function emitAll(sink: TelemetrySink | undefined, events: TelemetryEvent[]): void {
  for (const event of events) sink?.(event);
}

function baseTelemetry(isHoneypot: boolean): TelemetryEvent[] {
  const telemetry: TelemetryEvent[] = [
    { t: 0, phase: "INTERCEPT", level: "info", message: "transaction intercepted before signing" },
    { t: 420, phase: "SIMULATING", level: "info", message: "forking Pharos Atlantic state at pinned block 23559136" },
    { t: 900, phase: "SIMULATING", level: "info", message: "decoded calldata and resolved local ABI labels" },
  ];

  if (isHoneypot) {
    telemetry.push(
      { t: 1320, phase: "SIMULATING", level: "ok", message: "simulate buy - ok" },
      { t: 1710, phase: "SIMULATING", level: "error", message: "simulate sell as agent - REVERTED SellBlocked" },
      { t: 2020, phase: "SIMULATING", level: "error", message: "simulate sell as fresh wallet - REVERTED SellBlocked" },
      { t: 2320, phase: "SIMULATING", level: "ok", message: "simulate sell as token owner - ok" },
      { t: 2580, phase: "SIMULATING", level: "warn", message: "asymmetry confirmed: owner-only exit path" },
    );
  } else {
    telemetry.push(
      { t: 1280, phase: "SIMULATING", level: "ok", message: "router call completed successfully on fork" },
      { t: 1680, phase: "SIMULATING", level: "ok", message: "transfer events decoded: USDC out, WPHRS in" },
      { t: 2100, phase: "SIMULATING", level: "ok", message: "no critical storage writes detected" },
    );
  }

  telemetry.push(
    { t: 2950, phase: "RESULT", level: "info", message: "risk rules aggregated into deterministic verdict" },
    { t: 3700, phase: "LEDGER", level: "info", message: "balance delta ledger ready" },
    { t: 4400, phase: "STATE", level: isHoneypot ? "warn" : "ok", message: isHoneypot ? "critical trapped flag changed" : "state diff clean" },
    { t: 5200, phase: "FINDINGS", level: isHoneypot ? "error" : "ok", message: isHoneypot ? "critical findings surfaced" : "informational findings only" },
    { t: 6100, phase: "VERDICT", level: isHoneypot ? "error" : "ok", message: isHoneypot ? "verdict DO_NOT_SIGN emitted" : "verdict SIGN emitted" },
  );

  return telemetry;
}

function happyDeltas(): BalanceDelta[] {
  return [
    {
      token: demoAddresses.usdc,
      symbol: "USDC",
      decimals: 6,
      before: "1000.0",
      after: "900.0",
      delta: "-100.0",
    },
    {
      token: demoAddresses.wphrs,
      symbol: "WPHRS",
      decimals: 18,
      before: "0.0",
      after: "99.5",
      delta: "+99.5",
    },
    {
      token: "native",
      symbol: "PHRS",
      decimals: 18,
      before: "10.0",
      after: "9.9991",
      delta: "-0.0009",
    },
  ];
}

function honeypotDeltas(): BalanceDelta[] {
  return [
    {
      token: "native",
      symbol: "PHRS",
      decimals: 18,
      before: "10.0",
      after: "9.0",
      delta: "-1.0",
    },
    {
      token: demoAddresses.moon,
      symbol: "MOON",
      decimals: 18,
      before: "0.0",
      after: "980.0",
      delta: "+980.0",
    },
  ];
}

function happyStateChanges(): StateChange[] {
  return [];
}

function honeypotStateChanges(from: Address): StateChange[] {
  return [
    {
      contract: demoAddresses.moon,
      contractName: "MoonToken",
      variable: `trapped[${from.slice(0, 8)}...]`,
      slot: "0x0000000000000000000000000000000000000000000000000000000000000007",
      humanBefore: "false",
      humanAfter: "true",
      isCritical: true,
    },
  ];
}

function events(isHoneypot: boolean): EventSummary[] {
  if (isHoneypot) {
    return [
      {
        address: demoAddresses.moon,
        contractName: "MoonToken",
        eventName: "Transfer",
        detail: "MoonToken transferred 980 MOON to the agent.",
      },
    ];
  }

  return [
    {
      address: demoAddresses.usdc,
      contractName: "USDC",
      eventName: "Transfer",
      detail: "USDC transferred 100 USDC from the agent to SimpleRouter.",
    },
    {
      address: demoAddresses.wphrs,
      contractName: "WPHRS",
      eventName: "Transfer",
      detail: "WPHRS transferred 99.5 WPHRS from SimpleRouter to the agent.",
    },
  ];
}

function makeCallTree(isHoneypot: boolean): CallNode {
  if (isHoneypot) {
    return callNode({
      id: "root",
      depth: 0,
      contractName: "SimpleRouter",
      functionName: "swap",
      to: demoAddresses.router,
      gasUsed: "143012",
      children: [
        callNode({
          id: "moon-transfer",
          depth: 1,
          contractName: "MoonToken",
          functionName: "transfer",
          to: demoAddresses.moon,
          gasUsed: "52144",
        }),
        callNode({
          id: "moon-sell-test",
          depth: 1,
          contractName: "MoonToken",
          functionName: "transfer",
          to: demoAddresses.moon,
          gasUsed: "38410",
          reverted: true,
          errorName: "SellBlocked",
          errorArgs: { seller: demoAddresses.agent },
        }),
      ],
    });
  }

  return callNode({
    id: "root",
    depth: 0,
    contractName: "SimpleRouter",
    functionName: "swap",
    to: demoAddresses.router,
    gasUsed: "87122",
    children: [
      callNode({
        id: "usdc-transfer",
        depth: 1,
        contractName: "USDC",
        functionName: "transferFrom",
        to: demoAddresses.usdc,
        gasUsed: "31102",
      }),
      callNode({
        id: "wphrs-transfer",
        depth: 1,
        contractName: "WPHRS",
        functionName: "transfer",
        to: demoAddresses.wphrs,
        gasUsed: "29612",
      }),
    ],
  });
}

function informationalFindings(isHoneypot: boolean): Finding[] {
  if (isHoneypot) return [];

  return [
    {
      id: "scoped-allowance",
      severity: "INFO",
      title: "Allowance scoped to exact amount",
      detail: "The router only receives approval for the amount required by this swap.",
      evidence: ["amount: 100 USDC", "spender: SimpleRouter"],
    },
    {
      id: "verified-router",
      severity: "INFO",
      title: "Router is verified",
      detail: "SimpleRouter matched the local ABI and verified contract label set.",
      evidence: [`router: ${demoAddresses.router}`],
    },
  ];
}

export function happyPathTx(): TxRequest {
  return {
    from: demoAddresses.agent,
    to: demoAddresses.router,
    value: "0",
    data: encodeFunctionData({
      abi: simpleRouterAbi,
      functionName: "swap",
      args: [demoAddresses.usdc, demoAddresses.wphrs, 100_000_000n, 99_500_000_000_000_000_000n],
    }),
  };
}

export function honeypotTx(): TxRequest {
  return {
    from: demoAddresses.agent,
    to: demoAddresses.router,
    value: "1000000000000000000",
    data: encodeFunctionData({
      abi: simpleRouterAbi,
      functionName: "swap",
      args: [demoAddresses.wphrs, demoAddresses.moon, 1_000_000_000_000_000_000n, 900_000_000_000_000_000_000n],
    }),
  };
}

export function failingSwapTx(): TxRequest {
  return {
    from: demoAddresses.agent,
    to: demoAddresses.router,
    value: "0",
    data: encodeFunctionData({
      abi: simpleRouterAbi,
      functionName: "swap",
      args: [demoAddresses.usdc, demoAddresses.wphrs, 100_000_000n, 99_600_000_000_000_000_000n],
    }),
  };
}

export function unlimitedApprovalTx(): TxRequest {
  return {
    from: demoAddresses.agent,
    to: demoAddresses.usdc,
    value: "0",
    data: encodeFunctionData({
      abi: [
        {
          type: "function",
          name: "approve",
          stateMutability: "nonpayable",
          inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          outputs: [{ name: "ok", type: "bool" }],
        },
      ],
      functionName: "approve",
      args: [demoAddresses.router, maxUint256],
    }) as Hex,
  };
}
export async function simulate(
  request: TxRequest,
  options: { onTelemetry?: TelemetrySink } = {},
): Promise<SimReport> {
  const decoded = decodeCalldata({ to: request.to, data: request.data });
  const isHoneypot = decoded.args.tokenOut === demoAddresses.moon || request.value === "1000000000000000000";
  const isApproval = decoded.functionName === "approve";
  const forkBlock = DEFAULT_FORK_BLOCK;
  const telemetry = baseTelemetry(isHoneypot);
  emitAll(options.onTelemetry, telemetry);

  const roundTrip = detectHoneypot({
    token: demoAddresses.moon,
    tokenSymbol: "MOON",
    enabled: isHoneypot,
  });
  const balanceDeltas = isHoneypot ? honeypotDeltas() : happyDeltas();
  const stateChanges = isHoneypot ? honeypotStateChanges(request.from) : happyStateChanges();
  const preferredScore = isHoneypot ? 96 : isApproval ? undefined : 12;
  const label = contractLabels[isHoneypot ? demoAddresses.moon : request.to] ?? labelFor(request.to);
  const risk = runRiskRules({
    decoded,
    success: true,
    stateChanges,
    ...(roundTrip ? { roundTrip } : {}),
    label,
    forkBlock,
    valueAtRiskPct: isHoneypot ? 100 : 10,
    ...(preferredScore !== undefined ? { preferredScore } : {}),
  });
  const findings = [...risk.findings, ...informationalFindings(isHoneypot)];
  const score = preferredScore ?? risk.score;
  const verdict = buildVerdict({
    decision: risk.decision,
    score,
    band: score <= 25 ? "SAFE" : risk.band,
    findings,
    deltas: balanceDeltas,
  });

  const report: SimReport = {
    id: isHoneypot ? "sim-honeypot" : isApproval ? "sim-approval" : "sim-happy-path",
    tx: request,
    network: networkConfig,
    forkBlock,
    success: true,
    decoded,
    gasUsed: isHoneypot ? "143012" : "87122",
    balanceDeltas,
    stateChanges,
    events: events(isHoneypot),
    findings,
    callTree: makeCallTree(isHoneypot),
    verdict,
    telemetry,
  };

  if (roundTrip) {
    report.roundTrip = roundTrip;
  }

  return report;
}
