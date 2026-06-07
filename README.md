# Foresight

Pre-flight transaction safety for autonomous Pharos agents.

Foresight is a Pharos Agent Center skill that checks a proposed write transaction before an AI agent signs it. It runs live RPC pre-flight simulation, decodes calldata and simulated reverts, performs deterministic risk scoring, and returns a simple verdict:

```text
SIGN / REVIEW / DO_NOT_SIGN
```

The project ships as a terminal CLI, MCP skill server, HTTP API, and web dashboard. The CLI/MCP/API path is the real skill path. The dashboard includes polished replay scenes for demos and can also be wired to the HTTP API.

## Status

- Network: Pharos Atlantic Testnet
- Chain ID: `688689`
- RPC: `https://atlantic.dplabs-internal.com`
- Explorer: `https://atlantic.pharosscan.xyz/`

For testing, Foresight already has real deployed demo contracts on Pharos Atlantic and a live honeypot round-trip probe:

| Contract | Address |
| --- | --- |
| USDC | `0x5420f2D7c9219FD6E7d44b571762D1aa4824cDFc` |
| WPHRS | `0x6C21fA4468d4bCd05FCb628addF187574C84fAAC` |
| MOON honeypot | `0xCE26F3e00AE932C420A30E52A93bb141C543ECdf` |
| SimpleRouter | `0x4d7C3EF2d8553F9502b7EcbAB056F1981C89BadA` |
| RoundTripProbe | `0x4d7c79F36EFD1E78f986B8E422312Be2e7D0Fc83` |

Deployment record: `packages/contracts/deployments/688689.json`.

## Why This Matters

Pharos Agent Center lets agents perform onchain actions. Foresight protects the moment before the write transaction is signed.

It is useful for:

- swaps and router calls
- token approvals
- unknown contracts
- new or unverified contracts
- honeypot-style token traps
- failed transaction autopsies
- agent workflows that need a clear refusal reason

Instead of only explaining blockchain actions, Foresight gives an agent a practical safety gate:

```text
Proposed tx -> simulate -> decode -> score risk -> return verdict -> sign or refuse
```

## What Is Real

The live skill path is real:

- connects to Pharos Atlantic RPC
- reads live chain ID and block number
- checks live bytecode at the target address
- runs `eth_call` before signing
- estimates gas when possible
- decodes calldata with local ABI knowledge
- decodes simulated revert data and custom errors
- runs deterministic risk rules
- runs a live round-trip honeypot exit probe using deployed contracts
- returns an agent-readable verdict and explanation

The replay path is intentionally separate:

- dashboard scenes can run from deterministic fixture JSON for smooth video/demo flow
- fixture mode is used for tests and visual replay
- live mode is the default for CLI, MCP, and HTTP server calls

## Architecture

```text
                         +--------------------+
                         |  Pharos Atlantic   |
                         |  RPC / contracts   |
                         +----------+---------+
                                    ^
                                    |
+-----------+      +----------------+----------------+
| AI Agent  | ---> | CLI / MCP / HTTP Skill Surface  |
+-----------+      +----------------+----------------+
                                    |
                                    v
                         +----------+---------+
                         | @foresight/engine |
                         +----------+---------+
                                    |
              +---------------------+---------------------+
              |                     |                     |
              v                     v                     v
      Live pre-flight        Semantic decoder       Risk engine
      eth_call / gas         calldata / revert      SIGN / REVIEW
      bytecode checks        custom errors          DO_NOT_SIGN
              |
              v
      RoundTripProbe
      honeypot exit test
```

Dashboard flow:

```text
Browser dashboard
  |
  +-- replay fixtures for polished demo scenes
  |
  +-- optional HTTP/SSE server path for live engine output
```

Live honeypot proof:

```text
1. Agent proposes: swap 1 PHRS into MOON through SimpleRouter
2. Foresight runs live eth_call against the deployed router
3. The buy simulation succeeds
4. Foresight calls RoundTripProbe with eth_call
5. RoundTripProbe mints the output token to itself inside the call
6. RoundTripProbe immediately attempts to transfer the token out
7. MOON reverts with SellBlocked
8. Foresight returns DO_NOT_SIGN
```

No user funds move during pre-flight checks. The live checks are simulations.

## Project Structure

```text
foresight/
  apps/
    dashboard/              Next.js landing page and demo dashboard

  packages/
    cli/                    Terminal skill interface and demo deployer
    contracts/              Solidity demo contracts and deployment record
    engine/                 Shared simulation, decoding, risk, verdict logic
    fixtures-cli/           Fixture generator for dashboard replay scenes
    mcp/                    MCP server for agent frameworks
    server/                 HTTP/SSE API wrapper around the engine
    skill/                  Markdown skill bundle and manifest

  fixtures/                 Canonical generated scenario JSON
  .env.example              Safe public config template
  README.md                 Main documentation
```

## Install

```bash
corepack pnpm install
```

Create a local environment file:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

`.env` is ignored by git. Keep private keys there only.

## Environment

The important public values are already in `.env.example`:

```env
PHAROS_NETWORK_NAME=atlantic-testnet
PHAROS_RPC_URL=https://atlantic.dplabs-internal.com
PHAROS_CHAIN_ID=688689
PHAROS_NATIVE_SYMBOL=PHRS

DEMO_AGENT_ADDRESS=0xa1b2000000000000000000000000000000000001
ADDR_USDC=0x5420f2D7c9219FD6E7d44b571762D1aa4824cDFc
ADDR_WPHRS=0x6C21fA4468d4bCd05FCb628addF187574C84fAAC
ADDR_MOON=0xCE26F3e00AE932C420A30E52A93bb141C543ECdf
ADDR_ROUTER=0x4d7C3EF2d8553F9502b7EcbAB056F1981C89BadA
ADDR_PROBE=0x4d7c79F36EFD1E78f986B8E422312Be2e7D0Fc83
```

`DEPLOYER_PK` is only needed if you want to redeploy the demo contracts. Use a fresh throwaway wallet funded with testnet PHRS.

```env
DEPLOYER_PK=0x...
```

Never use a main wallet private key.

## CLI Workflow

The CLI is the fastest way to show the skill working.

Health check:

```bash
corepack pnpm --filter @foresight/cli dev -- health
```

Show the local skill install banner:

```bash
corepack pnpm --filter @foresight/cli dev -- skill install
```

Generate a sample honeypot transaction:

```bash
corepack pnpm --filter @foresight/cli dev -- demo-tx --scenario honeypot --json
```

Run the real live honeypot pre-flight:

```bash
corepack pnpm --filter @foresight/cli dev -- skill demo honeypot --live
```

Expected result:

```text
FORESIGHT SKILL
Mode: live Pharos RPC
Target: SimpleRouter.swap

VERDICT  DO_NOT_SIGN
RISK     100 / CRITICAL

ROUND-TRIP EXIT PROOF
  buy MOON:       OK
  non-owner exit: REVERTED (SellBlocked)
  owner exit:     OK
```

Check any real proposed transaction:

```bash
corepack pnpm --filter @foresight/cli dev -- skill check --from <agent> --to <contract> --data <calldata> --value <wei> --mode live
```

Get the full JSON report:

```bash
corepack pnpm --filter @foresight/cli dev -- simulate --scenario honeypot --mode live --json
```

Run deterministic replay mode:

```bash
corepack pnpm --filter @foresight/cli dev -- simulate --scenario honeypot --mode fixture
```

Explain calldata:

```bash
corepack pnpm --filter @foresight/cli dev -- explain --to <target> --data <calldata>
```

Diagnose a failed transaction:

```bash
corepack pnpm --filter @foresight/cli dev -- skill diagnose --tx <txHash>
```

## Web Dashboard

Run the dashboard:

```bash
corepack pnpm dev
```

Routes:

```text
/       landing page
/try    real CLI/MCP skill instructions
/demo   dashboard replay experience
```

The dashboard includes:

- agent console
- analysis panel
- verdict section
- balance changes
- findings
- round-trip evidence
- telemetry strip

The visual demo can run without a backend because it reads generated fixtures. This keeps the public demo smooth and reliable. The real skill logic remains in `@foresight/engine` and is used by CLI, MCP, and HTTP server.

### Deploy The Dashboard On Vercel

Recommended Vercel project settings:

```text
Framework Preset: Next.js
Root Directory: apps/dashboard
Install Command: corepack pnpm install --frozen-lockfile
Build Command: corepack pnpm build
Output Directory: .next
```

The dashboard build script compiles `@foresight/engine` first so clean Vercel builds can resolve the workspace package types.

Environment variables to add in Vercel:

```env
PHAROS_NETWORK_NAME=atlantic-testnet
PHAROS_RPC_URL=https://atlantic.dplabs-internal.com
PHAROS_CHAIN_ID=688689
PHAROS_NATIVE_SYMBOL=PHRS
PHAROS_EXPLORER_URL=https://atlantic.pharosscan.xyz/

DEMO_AGENT_ADDRESS=0xa1b2000000000000000000000000000000000001
ADDR_USDC=0x5420f2D7c9219FD6E7d44b571762D1aa4824cDFc
ADDR_WPHRS=0x6C21fA4468d4bCd05FCb628addF187574C84fAAC
ADDR_MOON=0xCE26F3e00AE932C420A30E52A93bb141C543ECdf
ADDR_ROUTER=0x4d7C3EF2d8553F9502b7EcbAB056F1981C89BadA
ADDR_PROBE=0x4d7c79F36EFD1E78f986B8E422312Be2e7D0Fc83
```

Do not add `DEPLOYER_PK` to Vercel. It is only for local testnet contract redeploys.

## HTTP Server

Run the server:

```bash
corepack pnpm server
```

Endpoints:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Server health |
| `GET` | `/api/network` | Active network config |
| `GET` | `/api/scenarios` | Demo scenario list |
| `GET` | `/api/scenarios/:id` | Single scenario fixture |
| `POST` | `/api/simulate` | Live or fixture simulation |
| `GET` | `/api/simulate/stream` | Streaming telemetry |
| `POST` | `/api/diagnose` | Failed tx diagnosis |

Simulation mode:

```env
FORESIGHT_SIM_MODE=live
FORESIGHT_ALLOW_FIXTURE_FALLBACK=false
```

Use fixture mode only for deterministic replay:

```env
FORESIGHT_SIM_MODE=fixture
```

## MCP Skill

The MCP server exposes Foresight as structured tools for agent frameworks.

Build and run:

```bash
corepack pnpm --filter @foresight/mcp build
node packages/mcp/dist/index.js
```

Tools:

| Tool | Purpose |
| --- | --- |
| `foresight_simulate` | Full pre-sign simulation report |
| `foresight_assess_risk` | Verdict and findings only |
| `foresight_explain` | Plain-English calldata decode |
| `foresight_diagnose` | Failed transaction autopsy |

Markdown skill bundle:

```text
packages/skill/SKILL.md
```

Use this folder for Pharos-compatible markdown skill installation:

```text
packages/skill/
  SKILL.md
  README.md
  manifest.json
  MANIFEST_MAPPING.md
```

## Demo Contracts

Contracts live in `packages/contracts/src`.

| Contract | Purpose |
| --- | --- |
| `MockERC20.sol` | USDC and WPHRS test tokens |
| `HoneypotToken.sol` | MOON token that blocks non-owner exits after mint |
| `SimpleRouter.sol` | Demo router for standard and honeypot swaps |
| `RoundTripProbe.sol` | Live eth_call helper that detects exit failure |

Deploy or redeploy:

```bash
corepack pnpm --filter @foresight/cli dev -- deploy-demo --broadcast --write-env
```

Requirements:

- `DEPLOYER_PK` set in `.env`
- deployer wallet funded with Pharos Atlantic testnet PHRS

The deployer writes:

```text
packages/contracts/deployments/688689.json
```

With `--write-env`, it also updates local `.env` address fields.

## Engine Internals

The engine is package `@foresight/engine`.

Key modules:

```text
packages/engine/src/sim/live.ts       live RPC pre-flight and round-trip probe
packages/engine/src/sim/simulate.ts   live/fixture mode switch
packages/engine/src/decoder/          ABI and calldata decoding
packages/engine/src/risk/             deterministic risk rules
packages/engine/src/explain/          verdict and agent-facing text
packages/engine/src/diagnose/         failed transaction autopsy
```

Risk rules include:

- honeypot round-trip evidence
- unlimited approval
- predicted revert
- hidden critical state write
- new contract window
- unverified contract
- large value exposure

## Build And Test

Full build:

```bash
corepack pnpm build
```

Engine tests:

```bash
corepack pnpm test
```

Generate dashboard fixtures:

```bash
corepack pnpm gen:fixtures
```

The current test suite validates the deterministic engine scenarios. Live smoke checks are run through the CLI.

## Demo Script For Judges

Terminal demo:

```bash
corepack pnpm install
Copy-Item .env.example .env
corepack pnpm --filter @foresight/cli dev -- skill install
corepack pnpm --filter @foresight/cli dev -- skill demo honeypot --live
corepack pnpm --filter @foresight/cli dev -- simulate --scenario honeypot --mode live --json
```

Web demo:

```bash
corepack pnpm dev
```

Open:

```text
http://localhost:3000/
http://localhost:3000/try
```

If port `3000` is busy, Next.js may choose another port.

## Security Notes

- `.env` is ignored by git.
- `DEPLOYER_PK` must be a throwaway testnet wallet key.
- The skill does not broadcast user transactions.
- Live pre-flight uses `eth_call` and gas estimation.
- Demo deployment uses testnet PHRS only.
- The project does not include wallet drainers, phishing flows, or hidden signing logic.

## Pharos Campaign Fit

Foresight satisfies the Skill Builder requirements:

- original onchain AI-agent skill
- relevant to Pharos Agent Center
- useful for autonomous transaction signing
- works through CLI, MCP, HTTP, and web demo paths
- includes usage instructions
- includes public/reviewable code
- includes deployed Pharos Atlantic testnet contracts
- avoids malicious signing or wallet-draining behavior

## Submission Message Draft

```text
Skill name: Foresight

Short description:
Foresight is a pre-flight transaction safety skill for autonomous Pharos agents.
Before an agent signs a write transaction, it runs live RPC simulation, decodes
calldata and simulated reverts, checks deployed contract bytecode, runs a live
honeypot round-trip probe, scores risk, and returns SIGN / REVIEW / DO_NOT_SIGN.

GitHub:
https://github.com/ELLA0VICTOR/foresight

Demo:
Add the deployed Vercel /try URL after deployment.

How to use:
1. Install dependencies with corepack pnpm install.
2. Copy .env.example to .env.
3. Run corepack pnpm --filter @foresight/cli dev -- skill install.
4. Run corepack pnpm --filter @foresight/cli dev -- skill demo honeypot --live.
5. Optional: run the Try page with corepack pnpm dev and open /try.

Supported framework:
CLI, MCP server, HTTP API, markdown skill bundle. Compatible with agent workflows
such as Codex, Claude Code, OpenClaw, and other MCP-capable tools.

Network:
Pharos Atlantic Testnet, chainId 688689.

Notes:
The CLI/MCP/API path is live RPC-backed. Dashboard replay fixtures are included
for polished visual demos and deterministic tests.

Email:
Add your submission email.
```
