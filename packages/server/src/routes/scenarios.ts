import { Router, type Router as ExpressRouter } from "express";
import { makeScenarioScripts } from "@foresight/engine";

export const scenariosRouter: ExpressRouter = Router();

scenariosRouter.get("/", async (_req, res, next) => {
  try {
    const scripts = await makeScenarioScripts();
    res.json(
      scripts.map((script) => ({
        id: script.id,
        title: script.title,
        subtitle: script.subtitle,
        kind: script.kind,
      })),
    );
  } catch (error) {
    next(error);
  }
});

scenariosRouter.get("/:id", async (req, res, next) => {
  try {
    const scripts = await makeScenarioScripts();
    const script = scripts.find((item) => item.id === req.params.id);
    if (!script) {
      res.status(404).json({ error: "scenario not found" });
      return;
    }
    res.json(script);
  } catch (error) {
    next(error);
  }
});
