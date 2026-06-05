import { cn } from "../../lib/cn";

export function StatusDot({ critical = false }: { critical?: boolean }) {
  return (
    <span
      className={cn(
        "inline-block size-2 rounded-full",
        critical ? "bg-risk-critical shadow-critical" : "bg-scan shadow-scan",
      )}
    />
  );
}
