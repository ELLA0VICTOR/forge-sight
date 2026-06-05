import { StatusDot } from "./StatusDot";
import { useForesightStore } from "../../store/useForesightStore";

export function NetworkStatus() {
  const { mode, script } = useForesightStore();
  const block = script?.block ?? 23559136;

  return (
    <div className="hidden items-center gap-2 font-mono text-[11px] text-ink-secondary lg:flex">
      <StatusDot />
      <span>PHAROS ATLANTIC</span>
      <span className="text-ink-tertiary">.</span>
      <span>688689</span>
      <span className="text-ink-tertiary">.</span>
      <span>BLOCK {block}</span>
      <span className="border border-scan px-1.5 py-0.5 text-scan">{mode === "demo" ? "DEMO" : "LIVE"}</span>
    </div>
  );
}
