import { cn } from "../../lib/cn";

export function AgentDecision({
  decision,
  content,
}: {
  decision: "signed" | "refused" | "n/a";
  content: string;
}) {
  const refused = decision === "refused";

  return (
    <div
      className={cn(
        "mt-2 border-l-2 bg-inset p-3",
        refused ? "border-l-risk-critical shadow-critical" : "border-l-risk-safe",
      )}
    >
      <div className={cn("font-display text-[12px] font-semibold", refused ? "text-risk-critical" : "text-risk-safe")}>
        {refused ? "REFUSED" : decision === "signed" ? "SIGNED" : "DIAGNOSIS"}
      </div>
      <p className="mt-1 text-sm leading-6 text-ink-primary">{content}</p>
    </div>
  );
}
