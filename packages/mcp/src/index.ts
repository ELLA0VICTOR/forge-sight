#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  diagnoseInputSchema,
  explainInputSchema,
  runAssessRisk,
  runDiagnose,
  runExplain,
  runSimulate,
  txInputSchema,
} from "./tools.js";

const server = new McpServer({
  name: "foresight",
  version: "1.0.0",
});

function structured(data: unknown): Record<string, unknown> {
  return JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
}

server.tool(
  "foresight_simulate",
  "Simulate a Pharos transaction before signing. ALWAYS call this before signing a write transaction.",
  txInputSchema,
  async (args) => {
    const result = await runSimulate(args);
    return {
      content: [{ type: "text", text: result.text }],
      structuredContent: structured(result.report),
    };
  },
);

server.tool(
  "foresight_assess_risk",
  "Return only the Foresight verdict and risk findings for a Pharos transaction.",
  txInputSchema,
  async (args) => {
    const result = await runAssessRisk(args);
    return {
      content: [{ type: "text", text: result.text }],
      structuredContent: structured(result.report),
    };
  },
);

server.tool(
  "foresight_explain",
  "Decode calldata into a plain-English transaction description.",
  explainInputSchema,
  async (args) => {
    const result = runExplain(args);
    return {
      content: [{ type: "text", text: result.text }],
      structuredContent: structured(result.decoded),
    };
  },
);

server.tool(
  "foresight_diagnose",
  "Autopsy a failed Pharos transaction and return the reverting frame, decoded error, root cause, and fix.",
  diagnoseInputSchema,
  async (args) => {
    const result = await runDiagnose(args);
    return {
      content: [{ type: "text", text: result.text }],
      structuredContent: structured(result.report),
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
