import { motion } from "framer-motion";
import { LuChevronRight } from "react-icons/lu";
import type { Finding } from "@foresight/engine";
import { findingCard, ledgerContainer } from "../../lib/motion";
import { cn } from "../../lib/cn";
import { Panel } from "../primitives/Panel";
import { SeverityChip } from "../primitives/SeverityChip";

function FindingCard({ finding }: { finding: Finding }) {
  const hot = finding.severity === "CRITICAL" || finding.severity === "HIGH";

  return (
    <motion.details
      variants={findingCard}
      className={cn(
        "group border border-line-subtle bg-inset p-3",
        hot && "border-l-2",
        finding.severity === "CRITICAL" && "border-l-risk-critical shadow-critical",
        finding.severity === "HIGH" && "border-l-risk-danger",
      )}
    >
      <summary className="flex cursor-pointer list-none items-start gap-3">
        <SeverityChip severity={finding.severity} />
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-semibold text-ink-primary">{finding.title}</div>
          <div className="mt-1 text-sm leading-5 text-ink-secondary">{finding.detail}</div>
        </div>
        <LuChevronRight className="mt-1 size-4 text-ink-tertiary transition group-open:rotate-90" />
      </summary>
      <div className="mt-3 bg-inset p-2 font-mono text-[11px] text-ink-tertiary">
        {finding.evidence.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </motion.details>
  );
}

export function FindingsList({ findings, visible }: { findings: Finding[]; visible: boolean }) {
  return (
    <Panel title={`FINDINGS (${visible ? findings.length : 0})`}>
      {!visible ? (
        <div className="p-4 text-sm text-ink-tertiary">Awaiting transaction.</div>
      ) : (
        <motion.div variants={ledgerContainer} initial="initial" animate="animate" className="grid gap-2 p-3">
          {findings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </motion.div>
      )}
    </Panel>
  );
}
