# Foresight Skill Bundle

Install this folder as a Pharos-compatible markdown skill or run the MCP server for
structured tool calls.

## Markdown Skill

Copy or install `SKILL.md` according to the agent framework:

- Codex: `~/.codex/skills/foresight/SKILL.md`
- Claude Code: `~/.claude/skills/foresight/SKILL.md`
- OpenClaw: `~/.openclaw/skills/foresight/SKILL.md`

## MCP

```bash
pnpm install
pnpm --filter @foresight/mcp build
node packages/mcp/dist/index.js
```

Tools: `foresight_simulate`, `foresight_assess_risk`, `foresight_explain`,
`foresight_diagnose`.
