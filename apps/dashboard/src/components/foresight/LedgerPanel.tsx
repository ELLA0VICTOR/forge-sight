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
    <span className={cn("inline-flex items-center justify-end gap-1 font-mono text-[13px] font-semibold tabular", positive ? "text-green" : "text-red")}>
      <Icon className="size-4" />
      {display}
    </span>
  );
}

function LedgerSkeleton() {
  return (
    <section className="rounded-[16px] border border-border bg-bgDeep/30 p-5">
      <div className="font-sans text-[13px] font-semibold text-text2">Balance changes</div>
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
      className="grid min-h-12 grid-cols-[minmax(96px,1fr)_minmax(120px,auto)_minmax(72px,120px)] items-center gap-3 border-b border-border px-4 font-mono tabular transition-colors hover:border-border2"
    >
      <span className="truncate text-[13px] font-semibold text-text1">{delta.symbol}</span>
      <DeltaAmount value={delta.delta} />
      <span className="justify-self-end text-[12px] font-normal text-text4">USD --</span>
    </motion.div>
  );
}

export function LedgerPanel({ deltas, visible }: { deltas: BalanceDelta[]; visible: boolean }) {
  if (!visible) return <LedgerSkeleton />;

  return (
    <section className="overflow-hidden rounded-[16px] border border-border bg-bgDeep/30 transition-colors hover:border-border2">
      <div className="border-b border-border px-5 py-4 font-sans text-[13px] font-semibold text-text2">
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
