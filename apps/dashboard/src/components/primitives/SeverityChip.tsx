import type { Severity } from "@foresight/engine";
import { cn } from "../../lib/cn";

const classes: Record<Severity, string> = {
  INFO: "border-scan text-scan bg-[color-mix(in_srgb,var(--scan)_12%,transparent)]",
  LOW: "border-risk-safe text-risk-safe bg-[color-mix(in_srgb,var(--risk-safe)_12%,transparent)]",
  MEDIUM: "border-risk-caution text-risk-caution bg-[color-mix(in_srgb,var(--risk-caution)_12%,transparent)]",
  HIGH: "border-risk-danger text-risk-danger bg-[color-mix(in_srgb,var(--risk-danger)_12%,transparent)]",
  CRITICAL: "border-risk-critical text-risk-critical bg-[color-mix(in_srgb,var(--risk-critical)_12%,transparent)]",
};

export function SeverityChip({ severity }: { severity: Severity }) {
  return (
    <span className={cn("inline-flex border px-1.5 py-0.5 font-display text-[10px] font-semibold uppercase tracking-[0.12em]", classes[severity])}>
      {severity}
    </span>
  );
}
