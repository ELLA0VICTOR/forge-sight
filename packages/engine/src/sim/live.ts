import {
  decodeErrorResult,
  encodeFunctionData,
  formatEther,
  formatUnits,
  type Abi,
} from "viem";
import type {
  Address,
  BalanceDelta,
  CallNode,
  EventSummary,
  Finding,
  Hex,
  RoundTripResult,
  SimReport,
  StateChange,
  TelemetryEvent,
  TxRequest,
} from "../types.js";
import { DEFAULT_FORK_BLOCK, demoAddresses, labelFor, networkConfig } from "../config.js";
import { erc20Abi, honeypotAbi, resolveAbi, roundTripProbeAbi, simpleRouterAbi, symbolFor } from "../decoder/abi.js";
import { decodeCalldata } from "../decoder/calldata.js";
import { callNode } from "../decoder/calltree.js";
import { buildVerdict } from "../explain/verdict.js";
import { createForkPublicClient } from "../fork/clients.js";
import {
  bandForScore,
  decisionForFindings,
  runRiskRules,
  scoreFindings,
} from "../risk/engine.js";

export type LiveTelemetrySink = (event: TelemetryEvent) => void;

function makeTelemetry() {
  const events: TelemetryEvent[] = [];

  return {
    events,
    push(
      phase: TelemetryEvent["phase"],
      level: TelemetryEvent["level"],
      message: string,
      sink?: LiveTelemetrySink,
    ) {
      const event = {
        t: events.length * 380,
        phase,
        level,
        message,
      } satisfies TelemetryEvent;
      events.push(event);
      sink?.(event);
    },
  };
}

function asValue(value?: string): bigint {
  if (!value) return 0n;
  return BigInt(value);
}

function decimalsFor(token: Address | "native"): number {
  const symbol = symbolFor(token);
  if (symbol === "USDC" || symbol === "USDT") return 6;
  return 18;
}

function formatToken(token: Address | "native", raw: string): string {
  const amount = formatUnits(BigInt(raw), decimalsFor(token));
  return amount.replace(/\.0+$/, "");
}

function makePredictedDeltas(request: TxRequest): BalanceDelta[] {
  const decoded = decodeCalldata({ to: request.to, data: request.data });
  const value = asValue(request.value);
  const deltas: BalanceDelta[] = [];

  if (value > 0n) {
    deltas.push({
      token: "native",
      symbol: networkConfig.nativeCurrency,
      decimals: 18,
      before: "live",
      after: "simulated",
      delta: `-${formatEther(value)}`,
    });
  }

  if (decoded.functionName === "swap") {
    const tokenIn = decoded.args.tokenIn as Address | undefined;
    const tokenOut = decoded.args.tokenOut as Address | undefined;
    const amountIn = decoded.args.amountIn;
    const minOut = decoded.args.minOut;

    if (tokenIn && amountIn && value === 0n) {
      deltas.push({
        token: tokenIn,
        symbol: symbolFor(tokenIn),
        decimals: decimalsFor(tokenIn),
        before: "live",
        after: "simulated",
        delta: `-${formatToken(tokenIn, amountIn)}`,
      });
    }

    if (tokenOut && minOut) {
      deltas.push({
        token: tokenOut,
        symbol: symbolFor(tokenOut),
        decimals: decimalsFor(tokenOut),
        before: "live",
        after: "simulated",
        delta: `+>=${formatToken(tokenOut, minOut)}`,
      });
    }
  }

  return deltas;
}

function collectErrorData(value: unknown, seen = new Set<unknown>()): Hex | undefined {
  if (typeof value === "string" && /^0x[a-fA-F0-9]+$/.test(value)) {
    return value as Hex;
  }

  if (!value || typeof value !== "object" || seen.has(value)) {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  for (const key of ["data", "result", "output", "returnData"]) {
    const candidate = record[key];
    if (typeof candidate === "string" && /^0x[a-fA-F0-9]{8,}$/.test(candidate)) {
      return candidate as Hex;
    }
  }

  for (const key of ["cause", "error"]) {
    const data = collectErrorData(record[key], seen);
    if (data) return data;
  }

  seen.add(value);

  for (const [key, candidate] of Object.entries(record)) {
    if (key === "raw" || key === "request" || key === "body") {
      continue;
    }

    const data = collectErrorData(candidate, seen);
    if (data) return data;
  }

  if (typeof value === "string" && /^0x[a-fA-F0-9]{8,}$/.test(value)) {
    return value as Hex;
  }

  return undefined;
}

function decodeRevert(
  error: unknown,
  targetAbi: Abi,
): { errorName?: string; errorArgs?: Record<string, string> } {
  const data = collectErrorData(error);
  if (!data) return {};

  const knownAbis = [targetAbi, simpleRouterAbi, honeypotAbi, erc20Abi];

  for (const abi of knownAbis) {
    try {
      const decoded = decodeErrorResult({ abi, data });
      const errorArgs: Record<string, string> = {};

      decoded.args?.forEach((arg, index) => {
        errorArgs[`arg${index}`] = String(arg);
      });

      return Object.keys(errorArgs).length > 0
        ? { errorName: decoded.errorName, errorArgs }
        : { errorName: decoded.errorName };
    } catch {
      // Try the next ABI set.
    }
  }

  return { errorName: "Reverted" };
}

function makeCodeFinding(to: Address, hasCode: boolean): Finding[] {
  if (hasCode) return [];

  return [
    {
      id: "no-contract-code",
      severity: "CRITICAL",
      title: "Target has no contract code",
      detail:
        "The destination address has no bytecode on the live Pharos network. A write call to this target is almost certainly malformed or unsafe.",
      evidence: [`to: ${to}`],
    },
  ];
}

function makeCallTree(input: {
  request: TxRequest;
  contractName: string;
  functionName: string;
  gasUsed: string;
  success: boolean;
  errorName?: string;
  errorArgs?: Record<string, string>;
}): CallNode {
  const node = callNode({
    id: "root",
    depth: 0,
    contractName: input.contractName,
    functionName: input.functionName,
    to: input.request.to,
    gasUsed: input.gasUsed,
    reverted: !input.success,
  });

  if (input.errorName) {
    node.errorName = input.errorName;
  }

  if (input.errorArgs) {
    node.errorArgs = input.errorArgs;
  }

  return node;
}

function makeLiveInfoFindings(input: {
  blockNumber: bigint;
  chainId: number;
  gasUsed: string;
  success: boolean;
}): Finding[] {
  return [
    {
      id: "live-rpc-preflight",
      severity: "INFO",
      title: "Live RPC pre-flight completed",
      detail: input.success
        ? "The transaction completed under live Pharos eth_call simulation."
        : "The transaction was checked against the live Pharos RPC and returned a simulated failure.",
      evidence: [
        `chainId: ${input.chainId}`,
        `block: ${input.blockNumber.toString()}`,
        `gas: ${input.gasUsed}`,
      ],
    },
  ];
}

function amountOutForProbe(request: TxRequest, decoded: ReturnType<typeof decodeCalldata>): bigint {
  const value = asValue(request.value);
  if (value > 0n) return value * 980n;

  const minOut = decoded.args.minOut;
  if (minOut && /^\d+$/.test(minOut)) {
    return BigInt(minOut);
  }

  return 1n;
}

async function probeLiveRoundTrip(input: {
  client: ReturnType<typeof createForkPublicClient>;
  request: TxRequest;
  decoded: ReturnType<typeof decodeCalldata>;
  success: boolean;
  telemetry: ReturnType<typeof makeTelemetry>;
  sink: LiveTelemetrySink | undefined;
}): Promise<RoundTripResult | undefined> {
  if (!input.success || input.decoded.functionName !== "swap") return undefined;

  const tokenOut = input.decoded.args.tokenOut as Address | undefined;
  if (!tokenOut) return undefined;

  const supportedToken =
    tokenOut === demoAddresses.moon ||
    tokenOut === demoAddresses.wphrs ||
    tokenOut === demoAddresses.usdc;
  if (!supportedToken) return undefined;

  const probeCode = await input.client.getCode({ address: demoAddresses.probe }).catch(() => undefined);
  if (!probeCode || probeCode === "0x") {
    input.telemetry.push("SIMULATING", "warn", "round-trip probe contract is not deployed", input.sink);
    return undefined;
  }

  input.telemetry.push("SIMULATING", "info", "running live round-trip exit probe", input.sink);

  try {
    await input.client.call({
      account: input.request.from,
      to: demoAddresses.probe,
      data: encodeFunctionData({
        abi: roundTripProbeAbi,
        functionName: "probe",
        args: [tokenOut, amountOutForProbe(input.request, input.decoded)],
      }),
    });

    input.telemetry.push("SIMULATING", "ok", "round-trip probe exited cleanly", input.sink);
    return {
      tested: true,
      token: tokenOut,
      tokenSymbol: symbolFor(tokenOut),
      buy: "ok",
      sellAsAgent: "ok",
      sellAsFresh: "ok",
      sellAsOwner: "ok",
      asymmetric: false,
    };
  } catch (error) {
    const decodedError = decodeRevert(error, honeypotAbi);
    input.telemetry.push("SIMULATING", "error", `round-trip probe reverted${decodedError.errorName ? `: ${decodedError.errorName}` : ""}`, input.sink);
    return {
      tested: true,
      token: tokenOut,
      tokenSymbol: symbolFor(tokenOut),
      buy: "ok",
      sellAsAgent: "reverted",
      sellAsFresh: "reverted",
      sellAsOwner: "ok",
      errorName: decodedError.errorName ?? "Reverted",
      asymmetric: true,
    };
  }
}

export async function simulateLive(
  request: TxRequest,
  options: { onTelemetry?: LiveTelemetrySink } = {},
): Promise<SimReport> {
  const telemetry = makeTelemetry();
  const decoded = decodeCalldata({ to: request.to, data: request.data });
  const resolved = resolveAbi(request.to);
  const label = labelFor(request.to);
  const client = createForkPublicClient(networkConfig);
  const value = asValue(request.value);

  telemetry.push("INTERCEPT", "info", "transaction intercepted before signing", options.onTelemetry);

  const [chainId, blockNumber, code] = await Promise.all([
    client.getChainId(),
    client.getBlockNumber(),
    client.getCode({ address: request.to }),
  ]);
  const forkBlock = Number(blockNumber);
  const hasCode = Boolean(code && code !== "0x");

  telemetry.push(
    "SIMULATING",
    "info",
    `connected to ${networkConfig.name} at block ${blockNumber.toString()}`,
    options.onTelemetry,
  );
  telemetry.push("SIMULATING", "info", "decoded calldata with local ABI set", options.onTelemetry);

  let success = false;
  let gasUsed = "unknown";
  let errorName: string | undefined;
  let errorArgs: Record<string, string> | undefined;

  try {
    await client.call({
      account: request.from,
      to: request.to,
      data: request.data,
      value,
    });
    success = true;
    telemetry.push("SIMULATING", "ok", "live eth_call completed successfully", options.onTelemetry);
  } catch (error) {
    const decodedError = decodeRevert(error, resolved.abi);
    errorName = decodedError.errorName;
    errorArgs = decodedError.errorArgs;
    telemetry.push(
      "SIMULATING",
      "error",
      `live eth_call reverted${errorName ? `: ${errorName}` : ""}`,
      options.onTelemetry,
    );
  }

  try {
    const estimate = await client.estimateGas({
      account: request.from,
      to: request.to,
      data: request.data,
      value,
    });
    gasUsed = estimate.toString();
    telemetry.push("SIMULATING", "ok", `estimated gas ${gasUsed}`, options.onTelemetry);
  } catch {
    gasUsed = success ? "unknown" : "reverted";
    telemetry.push("SIMULATING", "warn", "gas estimate unavailable", options.onTelemetry);
  }

  const stateChanges: StateChange[] = [];
  const events: EventSummary[] = [];
  const balanceDeltas = makePredictedDeltas(request);
  const roundTrip = await probeLiveRoundTrip({
    client,
    request,
    decoded,
    success,
    telemetry,
    sink: options.onTelemetry,
  });
  const risk = runRiskRules({
    decoded,
    success,
    stateChanges,
    label,
    forkBlock,
    ...(roundTrip ? { roundTrip } : {}),
    ...(errorName ? { errorName } : {}),
    valueAtRiskPct: value > 0n ? 100 : 0,
  });
  const findings = [
    ...makeCodeFinding(request.to, hasCode),
    ...risk.findings,
    ...makeLiveInfoFindings({
      blockNumber,
      chainId,
      gasUsed,
      success,
    }),
  ];
  const score = scoreFindings(findings);
  const verdict = buildVerdict({
    decision: decisionForFindings(findings),
    score,
    band: bandForScore(score),
    findings,
    deltas: balanceDeltas,
  });

  telemetry.push("RESULT", "info", "risk rules aggregated into deterministic verdict", options.onTelemetry);
  telemetry.push("LEDGER", "info", "predicted balance movement summary ready", options.onTelemetry);
  telemetry.push("FINDINGS", findings.some((finding) => finding.severity === "CRITICAL") ? "error" : "ok", "findings surfaced", options.onTelemetry);
  telemetry.push("VERDICT", verdict.decision === "SIGN" ? "ok" : "warn", `verdict ${verdict.decision} emitted`, options.onTelemetry);

  return {
    id: `live-${Date.now().toString(36)}`,
    tx: request,
    network: { ...networkConfig, forkBlock },
    forkBlock: forkBlock || DEFAULT_FORK_BLOCK,
    success,
    decoded,
    gasUsed,
    balanceDeltas,
    stateChanges,
    events,
    findings,
    ...(roundTrip ? { roundTrip } : {}),
    callTree: makeCallTree({
      request,
      contractName: resolved.contractName,
      functionName: decoded.functionName,
      gasUsed,
      success,
      ...(errorName ? { errorName } : {}),
      ...(errorArgs ? { errorArgs } : {}),
    }),
    verdict,
    telemetry: telemetry.events,
  };
}