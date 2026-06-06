import { RiArrowRightUpLine } from "react-icons/ri";
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
        "mt-2 rounded-[14px] border border-border bg-bgDeep/35 p-3 font-mono text-[12px] font-normal tabular text-text2",
        scanning && "border-violet bg-violet/10",
      )}
    >
      <div className="mb-2 flex items-center justify-between font-sans text-[12px] font-semibold text-text1">
        <span>Proposed transaction</span>
        <RiArrowRightUpLine className="size-4" />
      </div>
      <div className="grid gap-1">
        <div>to: {tx.contractName} ({truncAddr(tx.to)})</div>
        <div>fn: {tx.functionName}(...)</div>
        <div>value: {tx.valueLabel}</div>
      </div>
    </div>
  );
}
