"use client";

import { Panel } from "../primitives/Panel";
import { useForesightStore } from "../../store/useForesightStore";
import { CallTracePanel } from "./CallTracePanel";
import { FindingsList } from "./FindingsList";
import { LedgerPanel } from "./LedgerPanel";
import { RiskGauge } from "./RiskGauge";
import { RoundTripPanel } from "./RoundTripPanel";
import { StateChangesPanel } from "./StateChangesPanel";
import { TransactionSummary } from "./TransactionSummary";
import { VerdictCard } from "./VerdictCard";

export function ForesightPanel() {
  const { phase, report, diagnosis, revealed, script } = useForesightStore();
  const scanning = phase === "SIMULATING" || phase === "TRACING";
  const resultVisible = Boolean(report && ["RESULT", "LEDGER", "STATE", "FINDINGS", "VERDICT", "DONE"].includes(phase));
  const traceVisible = Boolean(diagnosis && ["TRACE", "REVERT", "DIAGNOSIS", "DONE"].includes(phase));

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-base p-3">
      <div className="grid gap-3">
        <Panel title={script?.title.toUpperCase() ?? "FORESIGHT"} accent={report?.verdict.band === "CRITICAL" && resultVisible ? "critical" : scanning ? "scan" : "none"}>
          <div className="grid gap-3 p-3 lg:grid-cols-[280px_1fr]">
            <RiskGauge
              score={report?.verdict.score}
              band={report?.verdict.band}
              state={scanning ? "scanning" : resultVisible ? "result" : "idle"}
            />
            <VerdictCard verdict={report?.verdict} visible={revealed.verdict} />
          </div>
        </Panel>
        <TransactionSummary report={report} />
        <div className="grid gap-3 xl:grid-cols-2">
          <LedgerPanel deltas={report?.balanceDeltas ?? []} visible={revealed.ledger} />
          <StateChangesPanel changes={report?.stateChanges ?? []} visible={revealed.state} />
        </div>
        <RoundTripPanel roundTrip={report?.roundTrip} visible={revealed.findings} />
        <FindingsList findings={report?.findings ?? []} visible={revealed.findings} />
        <CallTracePanel diagnosis={diagnosis} visible={traceVisible} />
      </div>
    </div>
  );
}
