"use client";

import { motion } from "framer-motion";
import { useForesightStore } from "../../store/useForesightStore";
import { CallTracePanel } from "./CallTracePanel";
import { FindingsList } from "./FindingsList";
import { LedgerPanel } from "./LedgerPanel";
import { RoundTripPanel } from "./RoundTripPanel";
import { StateChangesPanel } from "./StateChangesPanel";
import { TransactionSummary } from "./TransactionSummary";
import { VerdictCard } from "./VerdictCard";
import { panelFade, panelSequence } from "../../lib/motion";

export function ForesightPanel() {
  const { phase, report, diagnosis, revealed, script } = useForesightStore();
  const resultVisible = Boolean(report && ["RESULT", "LEDGER", "STATE", "FINDINGS", "VERDICT", "DONE"].includes(phase));
  const traceVisible = Boolean(diagnosis && ["TRACE", "REVERT", "DIAGNOSIS", "DONE"].includes(phase));
  const verdictVisible = Boolean(report && revealed.verdict);
  const summaryVisible = resultVisible || traceVisible;

  return (
    <section className="bench-scroll min-h-0 overflow-y-auto bg-surface/55">
      <div className="grid gap-1 border-b border-border px-5 py-4">
        <div className="font-sans text-[13px] font-semibold text-text3">
          {script?.kind === "diagnose" ? "Failed transaction" : "Pre-sign simulation"} / {phase}
        </div>
        <h1 className="font-sans text-[22px] font-semibold leading-tight text-text1">{script?.subtitle ?? "Transaction report"}</h1>
      </div>
      <motion.div variants={panelSequence} initial="initial" animate="animate" className="grid gap-3 p-5">
        <motion.div variants={panelFade}>
          <VerdictCard verdict={report?.verdict} visible={verdictVisible} />
        </motion.div>
        <motion.div variants={panelFade}>
          <TransactionSummary report={report} diagnosis={diagnosis} visible={summaryVisible} />
        </motion.div>
        <motion.div variants={panelFade}>
          <FindingsList findings={report?.findings ?? []} visible={revealed.findings} />
        </motion.div>
        <motion.div variants={panelFade}>
          <LedgerPanel deltas={report?.balanceDeltas ?? []} visible={revealed.ledger} />
        </motion.div>
        <motion.div variants={panelFade}>
          <StateChangesPanel changes={report?.stateChanges ?? []} visible={revealed.state} />
        </motion.div>
        <motion.div variants={panelFade}>
          <RoundTripPanel roundTrip={report?.roundTrip} visible={revealed.findings} />
        </motion.div>
        <motion.div variants={panelFade}>
          <CallTracePanel diagnosis={diagnosis} visible={traceVisible} />
        </motion.div>
      </motion.div>
    </section>
  );
}
