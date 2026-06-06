#!/usr/bin/env node
import "dotenv/config";

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import solc from "solc";
import {
  createPublicClient,
  createWalletClient,
  formatEther,
  getAddress,
  http,
  parseUnits,
  type Abi,
  type Chain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
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

type ContractArtifact = {
  abi: Abi;
  bytecode: Hex;
};

type CompileResult = {
  usdc: ContractArtifact;
  wphrs: ContractArtifact;
  moon: ContractArtifact;
  router: ContractArtifact;
  probe: ContractArtifact;
};

type SolcContract = {
  abi: Abi;
  evm?: {
    bytecode?: {
      object?: string;
    };
  };
};

type SolcOutput = {
  contracts?: Record<string, Record<string, SolcContract>>;
  errors?: Array<{ severity: string; formattedMessage?: string; message?: string }>;
};

type DeploymentResult = {
  network: string;
  chainId: number;
  deployer: Address;
  contracts: {
    USDC: Address;
    WPHRS: Address;
    MOON: Address;
    SimpleRouter: Address;
    RoundTripProbe: Address;
  };
};

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
  foresight deploy-demo --broadcast [--write-env] [--json]
  foresight health

Examples:
  foresight demo-tx --scenario honeypot --json
  foresight simulate --scenario honeypot --mode fixture
  foresight simulate --from 0xabc... --to 0xdef... --data 0x --mode live
  foresight deploy-demo --broadcast --write-env
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

function contractsDir() {
  return fileURLToPath(new URL("../../contracts", import.meta.url));
}

function repoRoot() {
  return resolve(contractsDir(), "..", "..");
}

function readSoliditySource(path: string) {
  return readFileSync(path, "utf8").replace(/^\uFEFF/, "");
}

function resolveSolidityImport(importPath: string) {
  const candidates = [
    resolve(contractsDir(), importPath),
    resolve(contractsDir(), "src", importPath),
    resolve(repoRoot(), "packages", "cli", "node_modules", importPath),
    resolve(repoRoot(), "node_modules", importPath),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return { contents: readSoliditySource(candidate) };
    }
  }

  return { error: `File not found: ${importPath}` };
}

function getContract(output: SolcOutput, source: string, name: string): ContractArtifact {
  const contract = output.contracts?.[source]?.[name];
  const object = contract?.evm?.bytecode?.object;

  if (!contract || !object) {
    throw new Error(`Missing compiled artifact for ${source}:${name}`);
  }

  return {
    abi: contract.abi,
    bytecode: `0x${object}` as Hex,
  };
}

function compileDemoContracts(): CompileResult {
  const sources = {
    "src/MockERC20.sol": {
      content: readSoliditySource(resolve(contractsDir(), "src", "MockERC20.sol")),
    },
    "src/HoneypotToken.sol": {
      content: readSoliditySource(resolve(contractsDir(), "src", "HoneypotToken.sol")),
    },
    "src/SimpleRouter.sol": {
      content: readSoliditySource(resolve(contractsDir(), "src", "SimpleRouter.sol")),
    },
    "src/RoundTripProbe.sol": {
      content: readSoliditySource(resolve(contractsDir(), "src", "RoundTripProbe.sol")),
    },
  };

  const input = {
    language: "Solidity",
    sources,
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"],
        },
      },
    },
  };
  const output = JSON.parse(
    solc.compile(JSON.stringify(input), { import: resolveSolidityImport }),
  ) as SolcOutput;
  const errors = output.errors?.filter((error) => error.severity === "error") ?? [];

  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.formattedMessage ?? error.message).join("\n"));
  }

  return {
    usdc: getContract(output, "src/MockERC20.sol", "MockERC20"),
    wphrs: getContract(output, "src/MockERC20.sol", "MockERC20"),
    moon: getContract(output, "src/HoneypotToken.sol", "HoneypotToken"),
    router: getContract(output, "src/SimpleRouter.sol", "SimpleRouter"),
    probe: getContract(output, "src/RoundTripProbe.sol", "RoundTripProbe"),
  };
}

function pharosChain(): Chain {
  return {
    id: networkConfig.chainId,
    name: networkConfig.name,
    nativeCurrency: {
      name: networkConfig.nativeCurrency,
      symbol: networkConfig.nativeCurrency,
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [networkConfig.rpcUrl],
      },
    },
  };
}

function sleep(ms: number) {
  return new Promise((resolveSleep) => {
    setTimeout(resolveSleep, ms);
  });
}

function isRateLimitError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("cu limit exceeded") ||
    message.includes("Request too fast") ||
    message.includes("rate limit")
  );
}

async function withRpcRetry<T>(label: string, action: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (!isRateLimitError(error)) throw error;
      console.log(`${label}: RPC rate limited, retrying`);
      await sleep(12000 + attempt * 4000);
    }
  }

  throw lastError;
}

async function waitForReceipt(
  publicClient: ReturnType<typeof createPublicClient>,
  hash: Hex,
) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const receipt = await publicClient.getTransactionReceipt({ hash });
      if (receipt) return receipt;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const stillPending =
        message.includes("could not be found") ||
        message.includes("not found") ||
        isRateLimitError(error);
      if (!stillPending) throw error;
    }

    await sleep(6000);
  }

  throw new Error(`Timed out waiting for transaction receipt: ${hash}`);
}

async function deployContract(input: {
  label: string;
  wallet: ReturnType<typeof createWalletClient>;
  publicClient: ReturnType<typeof createPublicClient>;
  artifact: ContractArtifact;
  account: ReturnType<typeof privateKeyToAccount>;
  chain: Chain;
  args?: readonly unknown[];
}): Promise<Address> {
  console.log(`${input.label}: deploying`);
  const hash = await withRpcRetry(input.label, () => input.wallet.deployContract({
    abi: input.artifact.abi,
    bytecode: input.artifact.bytecode,
    args: input.args ?? [],
    account: input.account,
    chain: input.chain,
  }));
  console.log(`${input.label}: tx ${hash}`);
  const receipt = await withRpcRetry(`${input.label} receipt`, () => waitForReceipt(input.publicClient, hash));

  if (receipt.status !== "success" || !receipt.contractAddress) {
    throw new Error(`${input.label} deployment failed: ${hash}`);
  }

  const address = getAddress(receipt.contractAddress);
  console.log(`${input.label}: ${address}`);
  return address;
}

async function sendContractTx(input: {
  label: string;
  wallet: ReturnType<typeof createWalletClient>;
  publicClient: ReturnType<typeof createPublicClient>;
  address: Address;
  abi: Abi;
  functionName: string;
  account: ReturnType<typeof privateKeyToAccount>;
  chain: Chain;
  args: readonly unknown[];
}) {
  console.log(`${input.label}: sending`);
  const hash = await withRpcRetry(input.label, () => input.wallet.writeContract({
    address: input.address,
    abi: input.abi,
    functionName: input.functionName,
    args: input.args,
    account: input.account,
    chain: input.chain,
  }));
  console.log(`${input.label}: tx ${hash}`);
  const receipt = await withRpcRetry(`${input.label} receipt`, () => waitForReceipt(input.publicClient, hash));

  if (receipt.status !== "success") {
    throw new Error(`${input.label} failed: ${hash}`);
  }

  console.log(`${input.label}: ok`);
}

function deploymentPath() {
  return resolve(contractsDir(), "deployments", `${networkConfig.chainId}.json`);
}

function writeDeploymentJson(result: DeploymentResult) {
  const payload = {
    network: result.network,
    chainId: result.chainId,
    deployedAt: new Date().toISOString(),
    deployer: result.deployer,
    note: "Real Pharos Atlantic testnet demo deployment.",
    contracts: result.contracts,
  };

  writeFileSync(deploymentPath(), `${JSON.stringify(payload, null, 2)}\n`);
}

function upsertEnv(text: string, key: string, value: string) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  return pattern.test(text)
    ? text.replace(pattern, line)
    : `${text.trimEnd()}\n${line}\n`;
}

function writeEnvAddresses(result: DeploymentResult) {
  const envPath = resolve(repoRoot(), ".env");
  const current = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
  let next = current;

  next = upsertEnv(next, "ADDR_USDC", result.contracts.USDC);
  next = upsertEnv(next, "ADDR_WPHRS", result.contracts.WPHRS);
  next = upsertEnv(next, "ADDR_MOON", result.contracts.MOON);
  next = upsertEnv(next, "ADDR_ROUTER", result.contracts.SimpleRouter);
  next = upsertEnv(next, "ADDR_PROBE", result.contracts.RoundTripProbe);

  writeFileSync(envPath, next);
}

async function runDeployDemo(flags: Flags) {
  const broadcast = has(flags, "broadcast");

  if (has(flags, "print") || !broadcast) {
    console.log("Node deployer command:");
    console.log("corepack pnpm --filter @foresight/cli dev -- deploy-demo --broadcast --write-env");
    console.log("");
    console.log("Requires DEPLOYER_PK in .env funded with testnet PHRS.");
    return;
  }

  const privateKey = process.env.DEPLOYER_PK;
  if (!privateKey || privateKey === "0xREPLACE_WITH_THROWAWAY_TESTNET_PRIVATE_KEY") {
    throw new Error("DEPLOYER_PK is required for --broadcast");
  }

  if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error("DEPLOYER_PK must be a 32-byte hex private key");
  }

  const chain = pharosChain();
  const transport = http(networkConfig.rpcUrl);
  const account = privateKeyToAccount(privateKey as Hex);
  const publicClient = createPublicClient({ chain, transport, pollingInterval: 6000 });
  const wallet = createWalletClient({ account, chain, transport, pollingInterval: 6000 });
  const balance = await publicClient.getBalance({ address: account.address });

  console.log(`deployer: ${account.address}`);
  console.log(`balance: ${formatEther(balance)} ${networkConfig.nativeCurrency}`);

  if (balance === 0n) {
    throw new Error("Deployer balance is 0. Claim testnet PHRS before broadcasting.");
  }

  console.log("compiling demo contracts");
  const compiled = compileDemoContracts();

  const usdc = await deployContract({
    label: "USDC",
    wallet,
    publicClient,
    artifact: compiled.usdc,
    account,
    chain,
    args: ["USD Coin", "USDC", 6],
  });
  const wphrs = await deployContract({
    label: "WPHRS",
    wallet,
    publicClient,
    artifact: compiled.wphrs,
    account,
    chain,
    args: ["Wrapped PHRS", "WPHRS", 18],
  });
  const moon = await deployContract({
    label: "MOON",
    wallet,
    publicClient,
    artifact: compiled.moon,
    account,
    chain,
  });
  const router = await deployContract({
    label: "SimpleRouter",
    wallet,
    publicClient,
    artifact: compiled.router,
    account,
    chain,
  });
  const probe = await deployContract({
    label: "RoundTripProbe",
    wallet,
    publicClient,
    artifact: compiled.probe,
    account,
    chain,
  });

  await sendContractTx({
    label: "mint USDC to deployer",
    wallet,
    publicClient,
    address: usdc,
    abi: compiled.usdc.abi,
    functionName: "mint",
    account,
    chain,
    args: [account.address, parseUnits("1000000", 6)],
  });
  await sendContractTx({
    label: "seed router WPHRS",
    wallet,
    publicClient,
    address: wphrs,
    abi: compiled.wphrs.abi,
    functionName: "mint",
    account,
    chain,
    args: [router, parseUnits("1000000", 18)],
  });
  await sendContractTx({
    label: "seed router MOON",
    wallet,
    publicClient,
    address: moon,
    abi: compiled.moon.abi,
    functionName: "mint",
    account,
    chain,
    args: [router, parseUnits("1000000", 18)],
  });

  const result: DeploymentResult = {
    network: networkConfig.name,
    chainId: networkConfig.chainId,
    deployer: account.address,
    contracts: {
      USDC: usdc,
      WPHRS: wphrs,
      MOON: moon,
      SimpleRouter: router,
      RoundTripProbe: probe,
    },
  };

  writeDeploymentJson(result);
  if (has(flags, "write-env")) {
    writeEnvAddresses(result);
  }

  if (has(flags, "json")) {
    printJson(result);
    return;
  }

  console.log("");
  console.log("Deployment complete:");
  console.log(`USDC:         ${result.contracts.USDC}`);
  console.log(`WPHRS:        ${result.contracts.WPHRS}`);
  console.log(`MOON:         ${result.contracts.MOON}`);
  console.log(`SimpleRouter: ${result.contracts.SimpleRouter}`);
  console.log(`RoundTrip:    ${result.contracts.RoundTripProbe}`);
  console.log(`deployment:   ${deploymentPath()}`);
  if (has(flags, "write-env")) {
    console.log(".env updated with deployed addresses");
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
      await runDeployDemo(flags);
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
