# Foresight - Transaction Safety & Simulation Layer

Live demo: add your Vercel URL here after deployment. The demo runs instantly in fixture mode with no backend dependency.

Foresight is a pre-flight safety layer for autonomous agents on Pharos. Before an agent signs a write transaction, it simulates the call, decodes token movements and storage changes, runs risk rules, catches honeypots with a round-trip sell test, and returns a plain-English SIGN / REVIEW / DO_NOT_SIGN verdict. It also autopsies failed transactions with a decoded reverting frame and a corrected transaction.

## Why It Matters For Pharos Agent Center

Pharos Agent Center gives agents the ability to execute onchain actions. Foresight protects the write side: approvals, swaps, router calls, and unknown contracts are checked before value moves. On an RWA-focused chain, this safety layer helps agents act without walking into traps or costly reverts.

## Architecture

```text
AI Agent -> MCP / Skill Bundle -> @foresight/engine
                                 | fork simulation
                                 | semantic decoder
                                 | risk rules
                                 | honeypot round trip
                                 | verdict / autopsy
Dashboard <- fixtures or SSE <- HTTP server
```

## Local Dev

```bash
corepack pnpm install
corepack corepack pnpm gen:fixtures
corepack pnpm dev
```

The dashboard defaults to demo mode. Open the printed local URL and use the three scenarios:

- Standard swap
- Honeypot detected
- Failure autopsy

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

## Install As A Skill

Markdown skill bundle:

```text
packages/skill/SKILL.md
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

What it does: Before an agent signs any Pharos transaction, Foresight forks live
chain state, simulates the transaction, decodes every token movement and storage
change, runs a differential round-trip test to catch honeypots, and returns a
plain-English verdict: SIGN / REVIEW / DO_NOT_SIGN. It also autopsies failed
transactions: full call trace, decoded custom error, root cause, and a corrected tx.

Why it matters: Pharos Agent Center puts autonomous agents on an RWA chain. The
write side is where the value and the danger live. Foresight is the trust layer that
lets agents act without walking into scams or costly reverts.

Live demo: <VERCEL_URL>
Repo: <GITHUB_URL>
Skill install: see README "Install As A Skill"
Network: Pharos Atlantic testnet (chainId 688689)
Frameworks: MCP server compatible with Claude Code / Codex / OpenClaw
Built by: <NAME> - <CONTACT>
```
