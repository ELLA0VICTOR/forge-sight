import { Router, type Router as ExpressRouter } from "express";
import { diagnose, type Hex } from "@foresight/engine";
import { z } from "zod";

const DiagnoseSchema = z.object({
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
});

export const diagnoseRouter: ExpressRouter = Router();

diagnoseRouter.post("/", async (req, res, next) => {
  try {
    const body = DiagnoseSchema.parse(req.body);
    const report = await diagnose(body.txHash as Hex);
    res.json(report);
  } catch (error) {
    next(error);
  }
});
