import { cn } from "../../lib/cn";

export function StatusDot({ critical = false }: { critical?: boolean }) {
  return (
    <span
      className={cn("live-dot inline-block size-2 rounded-full", critical ? "bg-red" : "bg-green")}
      aria-hidden
    />
  );
}
