# Foresight Skill Bundle

Install this folder as a Pharos-compatible markdown skill, run the MCP server for
structured agent tool calls, or use the CLI for terminal demos.

## CLI

From the repository root:

```bash
pnpm install
pnpm --filter @foresight/cli build
node packages/cli/dist/index.js health
node packages/cli/dist/index.js simulate --scenario honeypot --mode fixture
```

The CLI and MCP server both call the same `@foresight/engine` package.

## Markdown Skill

Copy or install `SKILL.md` according to the agent framework:

- Codex: `~/.codex/skills/foresight/SKILL.md`
- Claude Code: `~/.claude/skills/foresight/SKILL.md`
- OpenClaw: `~/.openclaw/skills/foresight/SKILL.md`

## MCP

```bash
pnpm install
pnpm --filter @foresight/engine build
pnpm --filter @foresight/mcp build
node packages/mcp/dist/index.js
```

Tools: `foresight_simulate`, `foresight_assess_risk`, `foresight_explain`,
`foresight_diagnose`.
