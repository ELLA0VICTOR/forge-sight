---
name: foresight
description: >
  REQUIRED before an agent signs Pharos write transactions. Foresight simulates a transaction on a fork,
  decodes token movements and storage changes, detects honeypots with differential round-trip simulation,
  scores risk, and returns SIGN / REVIEW / DO_NOT_SIGN. Use it before approvals, value transfers, swaps,
  unknown contract calls, and when diagnosing failed Pharos transactions.
version: 1.0.0
category: security
network: atlantic-testnet
chainId: 688689
requires:
  anyBins:
  - node
  - pnpm
---

# Foresight

Foresight is a pre-flight safety layer for autonomous agents on Pharos. Before you
sign any write transaction, Foresight simulates it on a fork of live Pharos state and
tells you exactly what will happen and whether it is safe.

## When to use this skill

- ALWAYS before signing any transaction that sends value, approves tokens, or calls a
  contract you did not deploy.
- When a transaction failed and you need to know why.
- When a token or router looks new, unverified, or too good to trust.

## Tools

- `foresight_simulate(from, to, data, value?)` returns verdict, risk score, balance
  and state changes, events, honeypot evidence, and agent text.
- `foresight_assess_risk(from, to, data, value?)` returns verdict and findings only.
- `foresight_explain(to, data)` returns a plain-English calldata decode.
- `foresight_diagnose(txHash)` returns the root cause of a failed transaction and a
  suggested fix.

## How to interpret the result

- `DECISION = DO_NOT_SIGN`: refuse and explain the top finding to the user.
- `DECISION = REVIEW`: present findings and ask the user to confirm.
- `DECISION = SIGN`: proceed.

## MCP install

From the repository root:

```bash
pnpm install
pnpm --filter @foresight/mcp build
```

MCP command:

```bash
node packages/mcp/dist/index.js
```

## Example

User: "Buy 1 PHRS of $MOON."

1. Construct the buy transaction.
2. Call `foresight_simulate`.
3. If `DECISION = DO_NOT_SIGN`, refuse and show the honeypot evidence.
