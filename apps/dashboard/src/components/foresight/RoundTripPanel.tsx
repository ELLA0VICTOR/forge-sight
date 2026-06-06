import { RiCheckLine, RiCloseLine } from "react-icons/ri";
import type { RoundTripResult } from "@foresight/engine";

function Row({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  const Icon = danger ? RiCloseLine : RiCheckLine;

  return (
    <div className="grid min-h-11 grid-cols-[1fr_auto] items-center border-b border-border px-5 font-mono text-[12px] font-normal tabular last:border-b-0">
      <span className="text-text2">{label}</span>
      <span className={danger ? "inline-flex items-center gap-1 text-red" : "inline-flex items-center gap-1 text-green"}>
        <Icon className="size-4" />
        {value}
      </span>
    </div>
  );
}

export function RoundTripPanel({ roundTrip, visible }: { roundTrip?: RoundTripResult | undefined; visible: boolean }) {
  if (!roundTrip?.tested || !visible) return null;

  return (
    <section className="overflow-hidden rounded-[16px] border border-border bg-bgDeep/30 transition-colors hover:border-border2">
      <div className="border-b border-border px-5 py-4 font-sans text-[13px] font-semibold text-text2">
        Round-trip sell test
      </div>
      <Row label={`BUY ${roundTrip.tokenSymbol}`} value="OK" />
      <Row label="SELL AS AGENT" value={`REVERTED ${roundTrip.errorName ?? ""}`.trim()} danger />
      <Row label="SELL AS FRESH WALLET" value="REVERTED" danger />
      <Row label="SELL AS TOKEN OWNER" value="OK - ASYMMETRIC" />
    </section>
  );
}
