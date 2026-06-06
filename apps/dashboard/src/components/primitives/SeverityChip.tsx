import type { Severity } from "@foresight/engine";
import { cn } from "../../lib/cn";

const classes: Record<Severity, string> = {
  INFO: "bg-teal/20 text-teal",
  LOW: "bg-green/20 text-green",
  MEDIUM: "bg-amber text-bgDeep",
  HIGH: "bg-red text-bgDeep",
  CRITICAL: "bg-red text-bgDeep",
};

export function SeverityChip({ severity }: { severity: Severity }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 font-sans text-[12px] font-semibold", classes[severity])}>
      {severity}
    </span>
  );
}
