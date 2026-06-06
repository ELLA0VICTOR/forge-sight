import { motion } from "framer-motion";
import type { Finding, Severity } from "@foresight/engine";
import { findingCard, ledgerContainer } from "../../lib/motion";
import { cn } from "../../lib/cn";

const severityClass: Record<Severity, { dot: string; text: string; label: string }> = {
  INFO: { dot: "bg-teal", text: "text-teal", label: "Info" },
  LOW: { dot: "bg-green", text: "text-green", label: "Low" },
  MEDIUM: { dot: "bg-amber", text: "text-amber", label: "Medium" },
  HIGH: { dot: "bg-red", text: "text-red", label: "High" },
  CRITICAL: { dot: "bg-red", text: "text-red", label: "Critical" },
};

function FindingsSkeleton() {
  return (
    <section className="rounded-[14px] border border-border bg-bgDeep/30 p-4">
      <div className="font-sans text-[13px] font-semibold text-text2">Findings</div>
      <div className="mt-4 grid gap-3">
        <div className="skeleton-line w-full" />
        <div className="skeleton-line w-10/12" />
      </div>
    </section>
  );
}

function FindingRow({ finding, index }: { finding: Finding; index: number }) {
  const tone = severityClass[finding.severity];

  return (
    <motion.details variants={findingCard} className="group border-b border-border transition-colors hover:border-border2">
      <summary className="grid min-h-[54px] cursor-pointer list-none grid-cols-[10px_72px_52px_1fr] items-center gap-3 px-4">
        <span className={cn("size-2 rounded-full", tone.dot)} />
        <span className={cn("font-sans text-[13px] font-semibold", tone.text)}>{tone.label}</span>
        <span className="font-mono text-[11px] text-text4">F-{String(index + 1).padStart(2, "0")}</span>
        <span className="min-w-0 truncate font-sans text-[14px] text-text2">
          <span className="text-text1">{finding.title}</span> - {finding.detail}
        </span>
      </summary>
      <div className="ml-[141px] grid gap-1 pb-4 pr-4 font-mono text-[11px] font-normal tabular text-text3">
        {finding.evidence.map((item) => (
          <div key={item}>- {item}</div>
        ))}
      </div>
    </motion.details>
  );
}

export function FindingsList({ findings, visible }: { findings: Finding[]; visible: boolean }) {
  if (!visible) return <FindingsSkeleton />;

  return (
    <section className="overflow-hidden rounded-[14px] border border-border bg-bgDeep/30 transition-colors hover:border-border2">
      <div className="border-b border-border px-4 py-3 font-sans text-[13px] font-semibold text-text2">
        Findings ({findings.length})
      </div>
      {findings.length === 0 ? (
        <div className="p-4 font-sans text-[14px] text-text2">No findings surfaced.</div>
      ) : (
        <motion.div variants={ledgerContainer} initial="initial" animate="animate">
          {findings.map((finding, index) => (
            <FindingRow key={finding.id} finding={finding} index={index} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
