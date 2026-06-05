import { LuCheck, LuX } from "react-icons/lu";
import type { RoundTripResult } from "@foresight/engine";
import { Panel } from "../primitives/Panel";

export function RoundTripPanel({ roundTrip, visible }: { roundTrip?: RoundTripResult | undefined; visible: boolean }) {
  if (!roundTrip?.tested || !visible) return null;

  return (
    <Panel title="ROUND-TRIP TEST" accent="critical">
      <div className="grid gap-3 p-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-risk-safe bg-inset p-4">
            <LuCheck className="mb-2 size-5 text-risk-safe" />
            <div className="font-display text-sm font-semibold text-risk-safe">BUY SIMULATED</div>
            <div className="mt-1 text-sm text-ink-secondary">Acquire MOON - succeeds</div>
          </div>
          <div className="border border-risk-critical bg-inset p-4 shadow-critical">
            <LuX className="mb-2 size-5 text-risk-critical" />
            <div className="font-display text-sm font-semibold text-risk-critical">SELL SIMULATED</div>
            <div className="mt-1 text-sm text-ink-secondary">Reverts: {roundTrip.errorName}()</div>
          </div>
        </div>
        <div className="grid gap-1 border border-line-subtle bg-inset p-3 font-mono text-[12px]">
          <div className="grid grid-cols-2 text-ink-secondary"><span>as agent</span><span className="text-risk-critical">REVERTED</span></div>
          <div className="grid grid-cols-2 text-ink-secondary"><span>as fresh wallet</span><span className="text-risk-critical">REVERTED</span></div>
          <div className="grid grid-cols-2 text-risk-critical"><span>as token owner</span><span>OK - ASYMMETRIC</span></div>
        </div>
      </div>
    </Panel>
  );
}
