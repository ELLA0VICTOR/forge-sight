import { motion } from "framer-motion";
import { LuArrowRight } from "react-icons/lu";
import type { BalanceDelta } from "@foresight/engine";
import { ledgerContainer, ledgerRow } from "../../lib/motion";
import { cn } from "../../lib/cn";
import { Panel } from "../primitives/Panel";

function LedgerRow({ delta }: { delta: BalanceDelta }) {
  const positive = delta.delta.startsWith("+");

  return (
    <motion.div
      variants={ledgerRow}
      className="grid grid-cols-[80px_1fr_18px_1fr_90px] items-center gap-2 border-b border-line-subtle px-3 py-2 font-mono text-[12px]"
    >
      <span className="text-ink-primary">{delta.symbol}</span>
      <span className="text-right text-ink-tertiary">{delta.before}</span>
      <LuArrowRight className="text-ink-tertiary" />
      <span className="text-right text-ink-primary">{delta.after}</span>
      <span className={cn("text-right font-semibold", positive ? "text-pos" : "text-neg")}>{delta.delta}</span>
    </motion.div>
  );
}

export function LedgerPanel({ deltas, visible }: { deltas: BalanceDelta[]; visible: boolean }) {
  return (
    <Panel title="BALANCE CHANGES" className="min-h-[178px]">
      {!visible ? (
        <div className="p-4 text-sm text-ink-tertiary">Awaiting transaction.</div>
      ) : (
        <motion.div variants={ledgerContainer} initial="initial" animate="animate">
          {deltas.map((delta) => (
            <LedgerRow key={`${delta.symbol}-${delta.delta}`} delta={delta} />
          ))}
        </motion.div>
      )}
    </Panel>
  );
}
