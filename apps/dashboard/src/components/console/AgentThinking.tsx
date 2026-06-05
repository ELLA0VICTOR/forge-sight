import { motion } from "framer-motion";

export function AgentThinking({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-tertiary">
      <span className="flex gap-1">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="size-[3px] rounded-full bg-scan"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 0.9, delay: dot * 0.15, repeat: Infinity }}
          />
        ))}
      </span>
      <span className="italic">{text}</span>
    </div>
  );
}
