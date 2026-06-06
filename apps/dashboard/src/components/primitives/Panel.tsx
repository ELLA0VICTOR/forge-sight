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
        "soft-panel min-h-0 overflow-hidden border-border transition-colors hover:border-border2",
        accent === "scan" && "border-l-2 border-l-teal",
        accent === "critical" && "border-l-2 border-l-red",
        className,
      )}
    >
      <div className="flex h-12 items-center justify-between border-b border-border px-5">
        <div className="font-sans text-[13px] font-semibold text-text2">{title}</div>
        {right}
      </div>
      {children}
    </section>
  );
}
