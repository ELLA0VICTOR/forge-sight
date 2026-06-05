import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface PanelProps {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  accent?: "scan" | "critical" | "none";
  className?: string;
}

export function Panel({ title, right, children, accent = "none", className }: PanelProps) {
  return (
    <section
      className={cn(
        "panel-edge min-h-0 overflow-hidden rounded border border-line-subtle bg-panel shadow-panel",
        accent === "scan" && "border-l-2 border-l-scan shadow-scan",
        accent === "critical" && "border-l-2 border-l-risk-critical shadow-critical",
        className,
      )}
    >
      <div className="flex h-8 items-center justify-between border-b border-line-subtle bg-elevated px-3">
        <div className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
          {title}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
