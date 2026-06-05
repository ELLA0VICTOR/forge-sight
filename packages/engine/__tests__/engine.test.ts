import { describe, expect, it } from "vitest";
import {
  diagnose,
  explainCalldata,
  happyPathTx,
  honeypotTx,
  simulate,
  unlimitedApprovalTx,
} from "../src/index.js";

describe("Foresight engine", () => {
  it("returns SIGN for the happy-path swap with exact deltas", async () => {
    const report = await simulate(happyPathTx());
    const usdc = report.balanceDeltas.find((delta) => delta.symbol === "USDC");
    const wphrs = report.balanceDeltas.find((delta) => delta.symbol === "WPHRS");

    expect(report.verdict.decision).toBe("SIGN");
    expect(report.verdict.score).toBe(12);
    expect(usdc?.delta).toBe("-100.0");
    expect(wphrs?.delta).toBe("+99.5");
  });

  it("detects a honeypot and refuses to sign", async () => {
    const report = await simulate(honeypotTx());

    expect(report.roundTrip?.tested).toBe(true);
    expect(report.roundTrip?.asymmetric).toBe(true);
    expect(report.findings.some((finding) => finding.severity === "CRITICAL")).toBe(true);
    expect(report.verdict.decision).toBe("DO_NOT_SIGN");
  });

  it("diagnoses the failing swap and returns a suggested transaction", async () => {
    const report = await diagnose(
      "0xfeed00000000000000000000000000000000000000000000000000000000cafe",
    );

    expect(report.errorName).toBe("InsufficientOutputAmount");
    expect(report.fix.suggestedTx.data.length).toBeGreaterThan(10);
  });

  it("decodes unlimited approvals and routes them to high risk", async () => {
    const tx = unlimitedApprovalTx();
    const decoded = explainCalldata({ to: tx.to, data: tx.data });
    const report = await simulate(tx);

    expect(decoded.humanReadable.toLowerCase()).toContain("unlimited");
    expect(report.findings.some((finding) => finding.id === "unlimited-approval")).toBe(true);
  });

  it("names the trapped state slot in the honeypot demo", async () => {
    const report = await simulate(honeypotTx());
    const trapped = report.stateChanges.find((change) => change.variable.startsWith("trapped["));

    expect(trapped?.isCritical).toBe(true);
  });
});
