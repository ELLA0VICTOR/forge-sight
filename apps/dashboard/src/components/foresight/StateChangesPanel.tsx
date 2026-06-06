import { motion } from "framer-motion";
import { RiArrowRightLine } from "react-icons/ri";
import type { StateChange } from "@foresight/engine";
import { cn } from "../../lib/cn";
import { ledgerContainer, ledgerRow } from "../../lib/motion";

function StateChangeRow({ change }: { change: StateChange }) {
  return (
    <motion.div
      variants={ledgerRow}
      className={cn(
        "border-b border-border py-3 transition-colors hover:border-border2",
        change.isCritical && "bg-red/10",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[12px] font-semibold tabular text-text1">{change.variable}</div>
        {change.isCritical ? <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-red">critical</span> : null}
      </div>
      <div className="mt-2 flex items-center gap-2 font-mono text-[11px] font-normal tabular text-text2">
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
    <section className="border-b border-border py-4">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text4">
        State changes
      </div>
      {changes.length === 0 ? (
        <div className="py-3 font-sans text-[13px] text-text2">No critical state changes detected.</div>
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