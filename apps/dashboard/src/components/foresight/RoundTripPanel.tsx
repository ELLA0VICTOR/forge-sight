import { RiCheckLine, RiCloseLine } from "react-icons/ri";
import type { RoundTripResult } from "@foresight/engine";

function Row({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  const Icon = danger ? RiCloseLine : RiCheckLine;

  return (
    <div className="grid min-h-10 grid-cols-[1fr_auto] items-center border-b border-border font-mono text-[11px] font-normal tabular last:border-b-0">
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
    <section className="border-b border-border py-4">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text4">
        Round-trip sell test
      </div>
      <Row label={`BUY ${roundTrip.tokenSymbol}`} value="OK" />
      <Row label="SELL AS AGENT" value={`REVERTED ${roundTrip.errorName ?? ""}`.trim()} danger />
      <Row label="SELL AS FRESH WALLET" value="REVERTED" danger />
      <Row label="SELL AS TOKEN OWNER" value="OK / ASYMMETRIC" />
    </section>
  );
}