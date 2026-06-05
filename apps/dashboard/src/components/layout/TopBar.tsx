import { BrandMark } from "../icons/BrandMark";
import { NetworkStatus } from "./NetworkStatus";
import { ScenarioControls } from "./ScenarioControls";

export function TopBar() {
  return (
    <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line-subtle bg-panel px-4">
      <div className="flex items-center gap-3">
        <BrandMark />
        <div>
          <div className="font-display text-base font-bold tracking-[0.14em] text-ink-primary">
            FORESIGHT
          </div>
          <div className="font-display text-[10px] uppercase tracking-[0.12em] text-ink-tertiary">
            PRE-FLIGHT SAFETY LAYER
          </div>
        </div>
      </div>
      <NetworkStatus />
      <ScenarioControls />
    </header>
  );
}
