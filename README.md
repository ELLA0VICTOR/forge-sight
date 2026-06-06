# Foresight - Transaction Safety & Simulation Layer

Live demo: add your Vercel URL here after deployment. The public dashboard includes replayable demo scenes, while the CLI, MCP server, and HTTP server run live RPC-backed pre-flight checks by default.

Foresight is a pre-flight safety layer for autonomous agents on Pharos. Before an agent signs a write transaction, it checks the target on the live Pharos RPC, runs `eth_call`, estimates gas when possible, decodes calldata and simulated reverts, applies deterministic risk rules, and returns a plain-English SIGN / REVIEW / DO_NOT_SIGN verdict. It also includes replayable honeypot and failed-transaction autopsy scenes for demos and tests.

## Why It Matters For Pharos Agent Center

Pharos Agent Center gives agents the ability to execute onchain actions. Foresight protects the write side: approvals, swaps, router calls, and unknown contracts are checked before value moves. On an RWA-focused chain, this safety layer helps agents act without walking into traps or costly reverts.

## Architecture

```text
AI Agent -> CLI / MCP / HTTP Skill -> @foresight/engine
                                      | live Pharos RPC pre-flight
                                      | semantic decoder
                                      | deterministic risk rules
                                      | fixture recordings for demos/tests
                                      | verdict / autopsy text
Dashboard <- replay fixtures or live API <- HTTP server
```

## Local Dev

```bash
corepack pnpm install
corepack pnpm gen:fixtures
corepack pnpm dev
```

The dashboard defaults to replay mode so the visual demo works without a backend. Open the printed local URL and use the three scenarios:

- Standard swap
- Honeypot detected
- Failure autopsy

## Terminal CLI

The CLI is the cleanest way to show the skill working from a terminal, without relying on the web UI:

```bash
corepack pnpm --filter @foresight/cli dev -- health
```

Generate a demo transaction:

```bash
corepack pnpm --filter @foresight/cli dev -- demo-tx --scenario honeypot --json
```

Run a real live RPC pre-flight check:

```bash
corepack pnpm --filter @foresight/cli dev -- simulate \
  --from 0xa1b2000000000000000000000000000000000001 \
  --to 0x00000000000000000000000000000000f0e51001 \
  --data 0xfe02915600000000000000000000000000000000000000000000000000000000bad0000200000000000000000000000000000000000000000000000000000000bad000010000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000056bc75e2d63100000 \
  --value 1000000000000000000 \
  --mode live
```

Run deterministic replay mode for the current demo recordings:

```bash
corepack pnpm --filter @foresight/cli dev -- simulate --scenario honeypot --mode fixture
```

Print or broadcast the demo contract deployment command:

```bash
corepack pnpm --filter @foresight/cli dev -- deploy-demo --print
```

PowerShell broadcast example:

```powershell
$env:DEPLOYER_PK="0x..."
corepack pnpm --filter @foresight/cli dev -- deploy-demo --broadcast
```

## Real Skill Mode

CLI, MCP, and HTTP server calls use `@foresight/engine` in live mode by default:

- connects to the configured Pharos RPC
- runs `eth_call` before signing
- estimates gas when possible
- decodes calldata and simulated reverts
- applies deterministic risk rules and returns SIGN / REVIEW / DO_NOT_SIGN

What is real today:

- live Pharos RPC connectivity
- live chain ID, block, and contract bytecode checks
- live `eth_call` and gas-estimation pre-flight checks
- calldata and revert decoding from the shared engine
- CLI, MCP server, HTTP server, and dashboard packages in one repo

What remains fixture-backed until demo contracts are broadcast:

- replayed dashboard scenes for honeypot round-trip evidence and failed transaction autopsy
- deterministic sample addresses used by the current public demo

## Tests

```bash
corepack pnpm test
```

## Generate Fixtures

```bash
corepack pnpm gen:fixtures
```

This writes canonical JSON to `fixtures/` and `apps/dashboard/src/fixtures/`.

## Run The HTTP Server

```bash
corepack pnpm server
```

Endpoints:

- `GET /api/health`
- `GET /api/network`
- `GET /api/scenarios`
- `GET /api/scenarios/:id`
- `POST /api/simulate`
- `GET /api/simulate/stream`
- `POST /api/diagnose`

Simulation mode:

```bash
FORESIGHT_SIM_MODE=live      # default for MCP/server
FORESIGHT_SIM_MODE=fixture   # only for deterministic demo recordings/tests
```

## Install As A Skill

Markdown skill bundle:

```text
packages/skill/SKILL.md
```

CLI:

```bash
corepack pnpm --filter @foresight/cli build
node packages/cli/dist/index.js health
```

MCP server:

```bash
corepack pnpm --filter @foresight/mcp build
node packages/mcp/dist/index.js
```

MCP tools:

- `foresight_simulate`
- `foresight_assess_risk`
- `foresight_explain`
- `foresight_diagnose`

## Network

Research found that the official Pharos Skill Engine now defaults to Atlantic Testnet:

- Chain ID: `688689`
- RPC: `https://atlantic.dplabs-internal.com`
- Explorer: `https://atlantic.pharosscan.xyz/`

Older docs and the original brief mention `688688`; see `RESEARCH_NOTES.md` for the source comparison.

## Submission Message Draft

```text
Skill: Foresight - Transaction Safety & Simulation Layer for autonomous agents

What it does: Before an agent signs any Pharos transaction, Foresight runs live RPC
pre-flight checks, decodes calldata and simulated reverts, applies deterministic risk
rules, and returns a plain-English verdict: SIGN / REVIEW / DO_NOT_SIGN. It includes
CLI, MCP, HTTP, and web demo paths, plus replayable honeypot and failed-transaction
autopsy demo scenes.

Why it matters: Pharos Agent Center puts autonomous agents on an RWA chain. The
write side is where the value and the danger live. Foresight is the safety layer that
lets agents act without walking into scams, malformed calls, or costly reverts.

Live demo: <VERCEL_URL>
Repo: <GITHUB_URL>
Skill install: see README "Install As A Skill"
Network: Pharos Atlantic testnet (chainId 688689)
Frameworks: MCP server compatible with Claude Code / Codex / OpenClaw
Built by: <NAME> - <CONTACT>
```
