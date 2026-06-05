import cors from "cors";
import express from "express";
import pino from "pino";
import { networkConfig } from "@foresight/engine";
import { diagnoseRouter } from "./routes/diagnose.js";
import { networkRouter } from "./routes/network.js";
import { scenariosRouter } from "./routes/scenarios.js";
import { simulateRouter } from "./routes/simulate.js";

const app = express();
const logger = pino({ name: "foresight-server" });
const port = Number(process.env.PORT ?? 8787);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    anvil: process.env.FORESIGHT_SPAWN_ANVIL === "true",
    forkBlock: networkConfig.forkBlock,
  });
});

app.use("/api/network", networkRouter);
app.use("/api/scenarios", scenariosRouter);
app.use("/api/simulate", simulateRouter);
app.use("/api/diagnose", diagnoseRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ error }, "request failed");
  res.status(400).json({
    error: error instanceof Error ? error.message : "unknown error",
  });
});

app.listen(port, () => {
  logger.info({ port }, "Foresight server listening");
});
