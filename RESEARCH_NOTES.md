# Foresight Research Notes

Research date: 2026-06-05

## Official Sources Read

- Pharos Agent Center: https://www.pharos.xyz/agent-center
- Pharos docs, network overview: https://docs.pharosnetwork.xyz/network-overview/pharos-networks
- Pharos docs, Hardhat deployment/verification guide: https://docs.pharosnetwork.xyz/developer-guide/hardhat/write-your-first-nft
- Pharos docs, JSON-RPC API methods: https://docs.pharosnetwork.xyz/api-and-sdk/json-rpc-api-methods
- Pharos docs, ZAN RPC: https://docs.pharosnetwork.xyz/zan-rpc
- Official Skill Engine repo: https://github.com/PharosNetwork/pharos-skill-engine
- Downloaded package: https://github.com/PharosNetwork/pharos-skill-engine/archive/refs/tags/v0.1.0.zip
- Blockscout contract ABI API reference: https://docs.blockscout.com/api-reference/contract/get-contract-abi-for-verified-contract
- Discord invite surfaced by Agent Center: https://discord.com/invite/pharos

## Network Parameters

### Atlantic Testnet (official default in Pharos Skill Engine)

- Name: `atlantic-testnet`
- Chain ID: `688689`
- Chain ID probe result: `eth_chainId = 0xa8231`, decimal `688689`
- RPC HTTP URL: `https://atlantic.dplabs-internal.com`
- WSS URL: `wss://atlantic.dplabs-internal.com`
- Native token: `PHRS`
- Explorer: `https://atlantic.pharosscan.xyz/`
- Explorer API base: `https://api.socialscan.io/pharos-atlantic-testnet`
- Verification command API endpoint: `https://api.socialscan.io/pharos-atlantic-testnet/v1/explorer/command_api/contract`
- Faucet: public Agent Center page did not expose a direct faucet URL. The JS testnet app is `https://testnet.pharosnetwork.xyz/`; mark faucet as `could not determine from static public source`.
- Current block probe during research: `0x1677be0` (`23559136`)

Notes: `CODEX_BRIEF.md` expected chain ID `688688`, but the official Agent Center package and current Pharos docs identify Atlantic Testnet as `688689`. Older Pharos examples also mention a previous testnet with chain ID `688688` at `https://testnet.dplabs-internal.com`. Foresight defaults to Atlantic (`688689`) and keeps legacy `688688` in notes only.

### Legacy Pharos Testnet Mentioned In Older Docs

- Name: `pharos-testnet`
- Chain ID: `688688`
- RPC HTTP URL: `https://testnet.dplabs-internal.com`
- Explorer: `https://testnet.pharosscan.xyz/`
- Explorer API base: `https://api.socialscan.io/pharos-testnet`
- Verification command API endpoint: `https://api.socialscan.io/pharos-testnet/v1/explorer/command_api/contract`
- Source: Pharos Hardhat guide.

### Mainnet (from Skill Engine package)

- Name: `mainnet`
- Chain ID: `1672`
- RPC HTTP URL: `https://rpc.pharos.xyz`
- Explorer: `https://www.pharosscan.xyz/`
- Explorer API base: `https://api.socialscan.io/pharos-mainnet`
- Native token: `PROS`

## Trace / Debug RPC Support

Atlantic RPC was probed directly during research.

- `debug_traceCall`: supported. Probe returned a structured result with `failed=false`, `gas`, `returnValue`, and `structLogs`.
- `debug_traceTransaction`: method is present. A `callTracer` shaped request returned a valid JSON-RPC response rather than `method not found`; an all-zero hash returned an empty result. Treat as supported but still prefer anvil fork tracing for deterministic demos.
- `trace_*`: not confirmed. Foresight does not depend on `trace_*`.

Implementation choice: use anvil fork as the default deterministic path, while live server code can attempt remote debug tracing and gracefully fall back.

## Explorer ABI / Source API

Pharos docs and the official Skill Engine package expose SocialScan / Blockscout-style explorer API bases. Verification uses:

```bash
forge verify-contract <address> <path>:<ContractName> \
  --chain-id 688689 \
  --verifier-url https://api.socialscan.io/pharos-atlantic-testnet/v1/explorer/command_api/contract \
  --verifier blockscout
```

ABI fetching is assumed Blockscout-compatible:

```text
GET https://api.socialscan.io/pharos-atlantic-testnet/api?module=contract&action=getabi&address=<address>
```

Expected response shape:

```json
{
  "status": "1",
  "message": "OK",
  "result": "[{\"type\":\"function\"}]"
}
```

If SocialScan serves ABI through the v2 Blockscout API instead, use:

```text
GET https://api.socialscan.io/pharos-atlantic-testnet/api/v2/smart-contracts/<address>
```

and read `abi`, `source_code`, `compiler_version`, and metadata if present. The engine never crashes when the explorer API is unavailable; it falls back to local ABIs plus selector-level decoding.

## Skill Engine Format Findings

The downloaded official package `pharos-skill-engine-0.1.0` contains:

- `SKILL.md`
- `assets/networks.json`
- `assets/tokens.json`
- Solidity helper assets under `assets/`
- Reference markdown under `references/`

No standalone JSON manifest was found in the package. The required skill definition is a markdown file with YAML frontmatter. Official frontmatter fields observed:

```yaml
---
name: pharos-skill-engine
description: >
  REQUIRED for any Pharos blockchain task...
version: 0.1.0
requires:
  anyBins:
  - cast
  - forge
---
```

Capabilities are declared narratively inside `SKILL.md` through a capability index mapping user needs to detailed reference files. Inputs and outputs are not declared as JSON Schema in the official package. Tools are not MCP-native in the package; the public Agent Center install path is:

```bash
npx skills add https://github.com/PharosNetwork/pharos-skill-engine
```

Skill storage paths shown by Agent Center:

- OpenClaw: `~/.openclaw/skills/`
- Claude Code: `~/.claude/skills/`
- Codex: `~/.codex/skills/`

Foresight ships both:

- a Pharos-compatible `packages/skill/SKILL.md` markdown skill bundle
- an MCP stdio server under `packages/mcp` so Claude Code / Codex / OpenClaw can call structured tools when MCP is available

`packages/skill/MANIFEST_MAPPING.md` records the mapping between the official markdown-skill format and the supplemental MCP manifest.

## Submission Requirements

The public Agent Center page links Discord but does not expose the private `#skill-submission` channel contents in static HTML. The campaign instructions provided by the builder specify one Discord message including:

- Skill name
- Short description
- GitHub/code link
- Email address
- Demo link, video, or screenshots if available
- Usage instructions
- Supported framework
- Additional notes/dependencies

Builder-provided campaign dates:

- Start: 2026-05-25
- End: 2026-06-08
- Winners: 2026-06-15
- Prize: USD 500 for exceptional skills

## Build Implications

- Default chain config uses Atlantic Testnet (`688689`) from official Pharos sources.
- `.env.example` includes both Atlantic and legacy notes but source code defaults to Atlantic.
- The skill package is a markdown `SKILL.md` with frontmatter plus a supplemental MCP manifest for structured reviewers.
- The dashboard demo does not depend on RPC, explorer, Foundry, or backend availability.
