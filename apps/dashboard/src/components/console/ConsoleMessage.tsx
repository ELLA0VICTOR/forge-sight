import { motion } from "framer-motion";
import { RiArrowRightSFill } from "react-icons/ri";
import type { ConsoleStep } from "@foresight/engine";
import { cn } from "../../lib/cn";
import { AgentDecision } from "./AgentDecision";
import { AgentThinking } from "./AgentThinking";
import { ProposedTransaction } from "./ProposedTransaction";

const roleLabel: Record<ConsoleStep["role"], string> = {
  user: "User",
  agent: "Foresight",
  system: "System",
};

export function ConsoleMessage({ step, index }: { step: ConsoleStep; index: number }) {
  const refused = step.kind === "decision" && step.decision === "refused";
  const agent = step.role === "agent";
  const system = step.role === "system";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16, delay: Math.min(index * 0.035, 0.22), ease: "easeOut" }}
      className={cn(
        "grid grid-cols-[28px_1fr_auto] gap-3 border-b border-border px-5 py-4",
        refused && "bg-red/10",
        system && "text-text3",
      )}
    >
      <div className={cn("mt-1 grid size-6 place-items-center rounded-full text-[11px] font-semibold", agent ? "bg-violet/25 text-text1" : "bg-surface3 text-text2")}>
        {agent ? "F" : step.role === "user" ? "U" : "S"}
      </div>
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-sans text-[13px] font-semibold text-text1">{roleLabel[step.role]}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text4">T+{String(index * 1400).padStart(4, "0")}MS</span>
          <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-text3">{step.atPhase}</span>
        </div>
        {step.kind === "thinking" ? <AgentThinking text={step.content} /> : null}
        {step.kind === "proposed-tx" && step.tx ? <ProposedTransaction tx={step.tx} /> : null}
        {step.kind === "decision" ? (
          <AgentDecision decision={step.decision ?? "n/a"} content={step.content} />
        ) : null}
        {step.kind === "text" ? <p className="font-sans text-[14px] leading-[1.6] text-text2">{step.content}</p> : null}
      </div>
      <RiArrowRightSFill className="mt-1 size-4 text-text4" />
    </motion.div>
  );
}
