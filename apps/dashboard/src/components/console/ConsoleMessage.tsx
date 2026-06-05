import { motion } from "framer-motion";
import type { ConsoleStep } from "@foresight/engine";
import { cn } from "../../lib/cn";
import { AgentDecision } from "./AgentDecision";
import { AgentThinking } from "./AgentThinking";
import { ProposedTransaction } from "./ProposedTransaction";

const roleLabel: Record<ConsoleStep["role"], string> = {
  user: "USER",
  agent: "FORESIGHT AGENT",
  system: "SYSTEM",
};

export function ConsoleMessage({ step }: { step: ConsoleStep }) {
  const marker =
    step.role === "agent" ? "border-l-scan" : step.role === "user" ? "border-l-line-strong" : "border-l-ink-tertiary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("border-l-2 py-3 pl-4 pr-3", marker)}
    >
      <div className="mb-1 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-tertiary">
        {roleLabel[step.role]}
      </div>
      {step.kind === "thinking" ? <AgentThinking text={step.content} /> : null}
      {step.kind === "proposed-tx" && step.tx ? <ProposedTransaction tx={step.tx} /> : null}
      {step.kind === "decision" ? (
        <AgentDecision decision={step.decision ?? "n/a"} content={step.content} />
      ) : null}
      {step.kind === "text" ? <p className="text-sm leading-6 text-ink-secondary">{step.content}</p> : null}
    </motion.div>
  );
}
