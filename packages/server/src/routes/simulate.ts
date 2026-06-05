import { Router, type Router as ExpressRouter } from "express";
import { simulate, type Address, type Hex } from "@foresight/engine";
import { z } from "zod";
import { openSse } from "../sse.js";

const TxSchema = z.object({
  from: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  data: z.string().regex(/^0x[a-fA-F0-9]*$/),
  value: z.string().optional(),
});

export const simulateRouter: ExpressRouter = Router();

simulateRouter.post("/", async (req, res, next) => {
  try {
    const body = TxSchema.parse(req.body);
    const report = await simulate({
      from: body.from as Address,
      to: body.to as Address,
      data: body.data as Hex,
      value: body.value ?? "0",
    });
    res.json(report);
  } catch (error) {
    next(error);
  }
});

simulateRouter.get("/stream", async (req, res, next) => {
  const sse = openSse(req, res);

  try {
    const body = TxSchema.parse({
      from: req.query.from,
      to: req.query.to,
      data: req.query.data,
      value: req.query.value,
    });

    const report = await simulate(
      {
        from: body.from as Address,
        to: body.to as Address,
        data: body.data as Hex,
        value: body.value ?? "0",
      },
      {
        onTelemetry(event) {
          sse.send("telemetry", event);
        },
      },
    );

    sse.send("report", report);
    sse.send("done", { ok: true });
    sse.close();
  } catch (error) {
    next(error);
  }
});
