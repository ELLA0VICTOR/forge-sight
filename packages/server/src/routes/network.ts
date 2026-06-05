import { Router, type Router as ExpressRouter } from "express";
import { demoAddresses, networkConfig } from "@foresight/engine";

export const networkRouter: ExpressRouter = Router();

networkRouter.get("/", (_req, res) => {
  res.json({
    chainId: networkConfig.chainId,
    name: networkConfig.name,
    forkBlock: networkConfig.forkBlock,
    contracts: {
      router: demoAddresses.router,
      usdc: demoAddresses.usdc,
      wphrs: demoAddresses.wphrs,
      moon: demoAddresses.moon,
    },
  });
});
