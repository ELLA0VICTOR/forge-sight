import { LuArrowUpRight } from "react-icons/lu";
import type { ConsoleStep } from "@foresight/engine";
import { truncAddr } from "../../lib/format";
import { useForesightStore } from "../../store/useForesightStore";
import { cn } from "../../lib/cn";

export function ProposedTransaction({ tx }: { tx: NonNullable<ConsoleStep["tx"]> }) {
  const phase = useForesightStore((state) => state.phase);
  const scanning = phase === "SIMULATING" || phase === "TRACING";

  return (
    <div
      className={cn(
        "mt-2 space-y-1 border border-line-subtle bg-inset p-3 font-mono text-[12px] text-ink-secondary",
        scanning && "border-scan shadow-scan",
      )}
    >
      <div className="flex items-center justify-between text-ink-tertiary">
        <span>PROPOSED TX</span>
        <LuArrowUpRight className="size-4" />
      </div>
      <div>to: {tx.contractName} ({truncAddr(tx.to)})</div>
      <div>fn: {tx.functionName}(...)</div>
      <div>value: {tx.valueLabel}</div>
    </div>
  );
}
