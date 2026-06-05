import { motion } from "framer-motion";
import type { Verdict } from "@foresight/engine";
import { cn } from "../../lib/cn";
import { verdictStamp } from "../../lib/motion";

const decisionClass: Record<Verdict["decision"], string> = {
  SIGN: "text-risk-safe border-l-risk-safe",
  REVIEW: "text-risk-caution border-l-risk-caution",
  DO_NOT_SIGN: "text-risk-critical border-l-risk-critical shadow-critical",
};

export function VerdictCard({ verdict, visible }: { verdict?: Verdict | undefined; visible: boolean }) {
  if (!verdict || !visible) {
    return (
      <div className="h-full border-l-2 border-l-line-strong bg-inset p-5 text-ink-tertiary">
        Awaiting transaction.
      </div>
    );
  }

  return (
    <motion.div
      variants={verdictStamp}
      initial="initial"
      animate="animate"
      className={cn("h-full border-l-2 bg-inset p-5", decisionClass[verdict.decision])}
    >
      <div className="font-display text-[28px] font-bold">
        {verdict.decision === "DO_NOT_SIGN" ? "DO NOT SIGN" : verdict.decision}
      </div>
      <div className="mt-2 font-sans text-[15px] font-semibold text-ink-primary">{verdict.headline}</div>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-6 text-ink-secondary">{verdict.paragraph}</p>
    </motion.div>
  );
}
