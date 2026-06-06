import { motion } from "framer-motion";
import { RiArrowRightLine } from "react-icons/ri";
import type { StateChange } from "@foresight/engine";
import { cn } from "../../lib/cn";
import { ledgerContainer, ledgerRow } from "../../lib/motion";
import { SeverityChip } from "../primitives/SeverityChip";

function StateChangeRow({ change }: { change: StateChange }) {
  return (
    <motion.div
      variants={ledgerRow}
      className={cn(
        "border-b border-border px-5 py-4 transition-colors hover:border-border2",
        change.isCritical && "bg-red/10",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[13px] font-semibold tabular text-text1">{change.variable}</div>
        {change.isCritical ? <SeverityChip severity="CRITICAL" /> : null}
      </div>
      <div className="mt-2 flex items-center gap-2 font-mono text-[12px] font-normal tabular text-text2">
        <span>{change.humanBefore}</span>
        <RiArrowRightLine className={change.isCritical ? "text-red" : "text-text3"} />
        <span className={change.isCritical ? "text-red" : "text-text1"}>{change.humanAfter}</span>
      </div>
    </motion.div>
  );
}

export function StateChangesPanel({ changes, visible }: { changes: StateChange[]; visible: boolean }) {
  if (!visible) return null;

  return (
    <section className="overflow-hidden rounded-[16px] border border-border bg-bgDeep/30 transition-colors hover:border-border2">
      <div className="border-b border-border px-5 py-4 font-sans text-[13px] font-semibold text-text2">
        State changes
      </div>
      {changes.length === 0 ? (
        <div className="p-5 font-sans text-[14px] text-text2">No critical state changes detected.</div>
      ) : (
        <motion.div variants={ledgerContainer} initial="initial" animate="animate">
          {changes.map((change) => (
            <StateChangeRow key={change.slot} change={change} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
