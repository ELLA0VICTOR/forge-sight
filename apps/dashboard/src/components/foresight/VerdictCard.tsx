import { motion } from "framer-motion";
import { RiShieldFlashLine, RiShieldLine } from "react-icons/ri";
import type { Verdict } from "@foresight/engine";
import { useCountUp } from "../../hooks/useCountUp";
import { verdictContent, verdictRail } from "../../lib/motion";

const toneByDecision: Record<Verdict["decision"], { color: string; dim: string; label: string; severity: string; icon: typeof RiShieldLine }> = {
  SIGN: {
    color: "var(--green)",
    dim: "var(--green-dim)",
    label: "Safe to sign",
    severity: "Low",
    icon: RiShieldLine,
  },
  REVIEW: {
    color: "var(--amber)",
    dim: "var(--amber-dim)",
    label: "Review required",
    severity: "Medium",
    icon: RiShieldLine,
  },
  DO_NOT_SIGN: {
    color: "var(--red)",
    dim: "var(--red-dim)",
    label: "Do not sign",
    severity: "Critical",
    icon: RiShieldFlashLine,
  },
};

function VerdictSkeleton() {
  return (
    <div className="rounded-[14px] border border-border bg-bgDeep/30 p-4">
      <div className="flex h-12 items-center gap-4">
        <div className="skeleton-line w-7" />
        <div className="skeleton-line w-44" />
        <div className="ml-auto skeleton-line w-20" />
      </div>
    </div>
  );
}

export function VerdictCard({ verdict, visible }: { verdict?: Verdict | undefined; visible: boolean }) {
  const active = Boolean(verdict && visible);
  const displayScore = useCountUp(verdict?.score ?? 0, active, 800);

  if (!verdict || !visible) return <VerdictSkeleton />;

  const tone = toneByDecision[verdict.decision];
  const Icon = tone.icon;

  return (
    <motion.div variants={verdictRail} initial="initial" animate="animate" className="overflow-hidden rounded-[14px]">
      <div className="rounded-[14px] border border-border p-4" style={{ backgroundColor: tone.dim }}>
        <motion.div variants={verdictContent} initial="initial" animate="animate" className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-surface2">
            <Icon className="size-5" style={{ color: tone.color }} />
          </div>
          <div className="min-w-0">
            <div className="font-sans text-[22px] font-semibold leading-none text-text1">{tone.label}</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: tone.color }}>
              {tone.severity}
            </div>
          </div>
          <div className="ml-auto rounded-[12px] border border-border bg-bgDeep/35 px-4 py-2 text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-text4">risk</div>
            <div className="font-mono text-[24px] font-semibold leading-none tabular" style={{ color: tone.color }}>
              {displayScore}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
