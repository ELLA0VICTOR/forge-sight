import { motion } from "framer-motion";
import { RiShieldFlashLine, RiShieldLine } from "react-icons/ri";
import type { Verdict } from "@foresight/engine";
import { useCountUp } from "../../hooks/useCountUp";
import { verdictContent, verdictRail } from "../../lib/motion";

const toneByDecision: Record<Verdict["decision"], { color: string; label: string; severity: string; icon: typeof RiShieldLine }> = {
  SIGN: {
    color: "var(--green)",
    label: "Safe to sign",
    severity: "Low",
    icon: RiShieldLine,
  },
  REVIEW: {
    color: "var(--amber)",
    label: "Review required",
    severity: "Medium",
    icon: RiShieldLine,
  },
  DO_NOT_SIGN: {
    color: "var(--red)",
    label: "Do not sign",
    severity: "Critical",
    icon: RiShieldFlashLine,
  },
};

function VerdictSkeleton() {
  return (
    <div className="border-b border-border py-4">
      <div className="flex h-10 items-center gap-4">
        <div className="skeleton-line w-7" />
        <div className="skeleton-line w-40" />
        <div className="ml-auto skeleton-line w-16" />
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
    <motion.div variants={verdictRail} initial="initial" animate="animate" className="border-b border-border py-4">
      <motion.div variants={verdictContent} initial="initial" animate="animate" className="grid grid-cols-[24px_1fr_auto] items-center gap-3">
        <Icon className="size-5" style={{ color: tone.color }} />
        <div className="min-w-0">
          <div className="font-sans text-[17px] font-normal leading-none text-text1">{tone.label}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: tone.color }}>
            {tone.severity}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-text4">risk</div>
          <div className="font-mono text-[18px] font-semibold leading-none tabular" style={{ color: tone.color }}>
            {displayScore}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}