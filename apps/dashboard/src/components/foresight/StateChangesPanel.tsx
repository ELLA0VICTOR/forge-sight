import { motion } from "framer-motion";
import type { StateChange } from "@foresight/engine";
import { cn } from "../../lib/cn";
import { ledgerContainer, ledgerRow } from "../../lib/motion";
import { Panel } from "../primitives/Panel";
import { SeverityChip } from "../primitives/SeverityChip";

function StateChangeRow({ change }: { change: StateChange }) {
  return (
    <motion.div
      variants={ledgerRow}
      className={cn(
        "border-b border-line-subtle px-3 py-2",
        change.isCritical && "critical-sweep border-l-2 border-l-risk-critical bg-elevated",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[12px] font-semibold text-ink-primary">{change.variable}</div>
        {change.isCritical ? <SeverityChip severity="CRITICAL" /> : null}
      </div>
      <div className="mt-1 font-mono text-[11px] text-ink-secondary">
        {change.humanBefore} -&gt; {change.humanAfter}
      </div>
    </motion.div>
  );
}

export function StateChangesPanel({ changes, visible }: { changes: StateChange[]; visible: boolean }) {
  return (
    <Panel title="STATE CHANGES" className="min-h-[178px]">
      {!visible ? (
        <div className="p-4 text-sm text-ink-tertiary">Awaiting transaction.</div>
      ) : changes.length === 0 ? (
        <div className="p-4 text-sm text-ink-tertiary">No critical state changes detected.</div>
      ) : (
        <motion.div variants={ledgerContainer} initial="initial" animate="animate">
          {changes.map((change) => (
            <StateChangeRow key={change.slot} change={change} />
          ))}
        </motion.div>
      )}
    </Panel>
  );
}
