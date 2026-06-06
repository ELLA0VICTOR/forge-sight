import { motion } from "framer-motion";
import { RiArrowDownLine, RiArrowUpLine } from "react-icons/ri";
import type { BalanceDelta } from "@foresight/engine";
import { ledgerContainer, ledgerRow } from "../../lib/motion";
import { cn } from "../../lib/cn";

function DeltaAmount({ value }: { value: string }) {
  const positive = value.startsWith("+") || (!value.startsWith("-") && Number(value) >= 0);
  const Icon = positive ? RiArrowUpLine : RiArrowDownLine;
  const display = value.startsWith("+") || value.startsWith("-") ? value : positive ? `+${value}` : value;

  return (
    <span className={cn("inline-flex items-center justify-end gap-1 font-mono text-[12px] font-semibold tabular", positive ? "text-green" : "text-red")}>
      <Icon className="size-4" />
      {display}
    </span>
  );
}

function LedgerSkeleton() {
  return (
    <section className="border-b border-border py-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-text4">Balance changes</div>
      <div className="mt-4 grid gap-3">
        <div className="skeleton-line w-full" />
        <div className="skeleton-line w-4/5" />
      </div>
    </section>
  );
}

function LedgerRow({ delta }: { delta: BalanceDelta }) {
  return (
    <motion.div
      variants={ledgerRow}
      className="grid min-h-10 grid-cols-[minmax(96px,1fr)_minmax(120px,auto)_minmax(72px,120px)] items-center gap-3 border-b border-border font-mono tabular transition-colors hover:border-border2"
    >
      <span className="truncate text-[12px] font-semibold text-text1">{delta.symbol}</span>
      <DeltaAmount value={delta.delta} />
      <span className="justify-self-end text-[11px] font-normal text-text4">USD --</span>
    </motion.div>
  );
}

export function LedgerPanel({ deltas, visible }: { deltas: BalanceDelta[]; visible: boolean }) {
  if (!visible) return <LedgerSkeleton />;

  return (
    <section className="border-b border-border py-4">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text4">
        Balance changes
      </div>
      <motion.div variants={ledgerContainer} initial="initial" animate="animate">
        {deltas.map((delta) => (
          <LedgerRow key={`${delta.symbol}-${delta.delta}`} delta={delta} />
        ))}
      </motion.div>
    </section>
  );
}