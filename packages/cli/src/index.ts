#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  demoFailedTxHash,
  diagnose,
  explainCalldata,
  failingSwapTx,
  happyPathTx,
  honeypotTx,
  networkConfig,
  renderDiagnosisForAgent,
  renderReportForAgent,
  simulate,
  unlimitedApprovalTx,
  type Address,
  type Hex,
  type TxRequest,
} from "@foresight/engine";

type Flags = Record<string, string | boolean>;
type SimMode = "live" | "fixture";
type DemoScenario = "happy-path" | "honeypot" | "approval" | "autopsy";

function usage() {
  return `
Foresight CLI

Usage:
  foresight simulate --from 0x... --to 0x... --data 0x... [--value wei] [--mode live|fixture] [--json]
  foresight simulate --scenario honeypot [--mode fixture|live] [--json]
  foresight assess-risk --from 0x... --to 0x... --data 0x... [--value wei] [--mode live|fixture] [--json]
  foresight explain --to 0x... --data 0x... [--json]
  foresight diagnose --tx 0x... [--json]
  foresight demo-tx --scenario happy-path|honeypot|approval|autopsy [--json]
  foresight deploy-demo --print
  foresight deploy-demo --broadcast
  foresight health

Examples:
  foresight demo-tx --scenario honeypot --json
  foresight simulate --scenario honeypot --mode fixture
  foresight simulate --from 0xabc... --to 0xdef... --data 0x --mode live
`;
}

function parse(argv: string[]) {
  const [command, ...rest] = argv;
  const flags: Flags = {};

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (!arg?.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);
    const next = rest[index + 1];

    if (!next || next.startsWith("--")) {
      flags[key] = true;
      continue;
    }

    flags[key] = next;
    index += 1;
  }

  return { command, flags };
}

function flag(flags: Flags, name: string): string | undefined {
  const value = flags[name];
  return typeof value === "string" ? value : undefined;
}

function has(flags: Flags, name: string): boolean {
  return flags[name] === true;
}

function required(flags: Flags, name: string): string {
  const value = flag(flags, name);
  if (!value) {
    throw new Error(`Missing required --${name}`);
  }
  return value;
}

function parseMode(flags: Flags): SimMode | undefined {
  const mode = flag(flags, "mode");
  if (!mode) return undefined;
  if (mode !== "live" && mode !== "fixture") {
    throw new Error("--mode must be live or fixture");
  }
  return mode;
}

function scenarioTx(name: string): TxRequest {
  switch (name) {
    case "happy-path":
    case "standard":
    case "swap":
      return happyPathTx();
    case "honeypot":
      return honeypotTx();
    case "approval":
      return unlimitedApprovalTx();
    case "autopsy":
      return failingSwapTx();
    default:
      throw new Error(`Unknown scenario: ${name}`);
  }
}

function txFromFlags(flags: Flags): TxRequest {
  const scenario = flag(flags, "scenario");
  if (scenario) return scenarioTx(scenario);

  return {
    from: required(flags, "from") as Address,
    to: required(flags, "to") as Address,
    data: required(flags, "data") as Hex,
    value: flag(flags, "value") ?? "0",
  };
}

function printJson(value: unknown) {
  console.log(JSON.stringify(value, null, 2));
}

function printTx(tx: TxRequest, json: boolean) {
  if (json) {
    printJson(tx);
    return;
  }

  console.log(`from:  ${tx.from}`);
  console.log(`to:    ${tx.to}`);
  console.log(`value: ${tx.value ?? "0"}`);
  console.log(`data:  ${tx.data}`);
}

async function runSimulate(flags: Flags, assessOnly = false) {
  const tx = txFromFlags(flags);
  const mode = parseMode(flags);
  const options: { mode?: SimMode; allowFixtureFallback?: boolean } = {};

  if (mode) options.mode = mode;
  if (has(flags, "allow-fixture-fallback")) options.allowFixtureFallback = true;

  const report = await simulate(tx, options);

  if (has(flags, "json")) {
    printJson(assessOnly ? { verdict: report.verdict, findings: report.findings } : report);
    return;
  }

  if (assessOnly) {
    console.log(`DECISION: ${report.verdict.decision}`);
    console.log(`RISK: ${report.verdict.score} (${report.verdict.band})`);
    console.log("");
    console.log("Findings:");
    for (const finding of report.findings) {
      console.log(`- [${finding.severity}] ${finding.title}: ${finding.detail}`);
    }
    return;
  }

  console.log(renderReportForAgent(report));
}

function runExplain(flags: Flags) {
  const decoded = explainCalldata({
    to: required(flags, "to") as Address,
    data: required(flags, "data") as Hex,
  });

  if (has(flags, "json")) {
    printJson(decoded);
    return;
  }

  console.log(decoded.humanReadable);
  console.log(`contract: ${decoded.contractName}`);
  console.log(`function: ${decoded.functionName}`);
  console.log(`verified: ${decoded.verified ? "yes" : "no"}`);
}

async function runDiagnose(flags: Flags) {
  const report = await diagnose(required(flags, "tx") as Hex);

  if (has(flags, "json")) {
    printJson(report);
    return;
  }

  console.log(renderDiagnosisForAgent(report));
}

function runDemoTx(flags: Flags) {
  const scenario = (flag(flags, "scenario") ?? "honeypot") as DemoScenario;

  if (scenario === "autopsy") {
    if (has(flags, "json")) {
      printJson({ txHash: demoFailedTxHash, tx: failingSwapTx() });
      return;
    }

    console.log(`txHash: ${demoFailedTxHash}`);
    printTx(failingSwapTx(), false);
    return;
  }

  printTx(scenarioTx(scenario), has(flags, "json"));
}

function runHealth(flags: Flags) {
  const payload = {
    network: networkConfig.name,
    chainId: networkConfig.chainId,
    rpcUrl: networkConfig.rpcUrl,
    mode: process.env.FORESIGHT_SIM_MODE ?? "live",
  };

  if (has(flags, "json")) {
    printJson(payload);
    return;
  }

  console.log(`network: ${payload.network}`);
  console.log(`chainId: ${payload.chainId}`);
  console.log(`rpc: ${payload.rpcUrl}`);
  console.log(`default simulation mode: ${payload.mode}`);
}

function runDeployDemo(flags: Flags) {
  const contractsDir = fileURLToPath(new URL("../../contracts", import.meta.url));
  const rpcUrl = process.env.PHAROS_RPC_URL ?? networkConfig.rpcUrl;
  const privateKey = process.env.DEPLOYER_PK;
  const broadcast = has(flags, "broadcast");
  const args = [
    "script",
    "script/Deploy.s.sol:Deploy",
    "--rpc-url",
    rpcUrl,
  ];

  if (broadcast) {
    if (!privateKey) {
      throw new Error("DEPLOYER_PK is required for --broadcast");
    }
    args.push("--private-key", privateKey, "--broadcast");
  }

  if (has(flags, "print") || !broadcast) {
    console.log(`cd ${contractsDir}`);
    console.log(`forge ${args.join(" ")}`);
    if (!broadcast) {
      console.log("");
      console.log("Add --broadcast and DEPLOYER_PK to deploy real contracts.");
    }
    return;
  }

  const result = spawnSync("forge", args, {
    cwd: contractsDir,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    throw new Error(`forge exited with status ${result.status ?? "unknown"}`);
  }
}

async function main() {
  const argv = process.argv.slice(2).filter((arg, index) => !(index === 0 && arg === "--"));
  const { command, flags } = parse(argv);

  if (!command || command === "help" || command === "--help" || command === "-h") {
    console.log(usage());
    return;
  }

  switch (command) {
    case "simulate":
      await runSimulate(flags);
      return;
    case "assess-risk":
      await runSimulate(flags, true);
      return;
    case "explain":
      runExplain(flags);
      return;
    case "diagnose":
      await runDiagnose(flags);
      return;
    case "demo-tx":
      runDemoTx(flags);
      return;
    case "deploy-demo":
      runDeployDemo(flags);
      return;
    case "health":
      runHealth(flags);
      return;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});