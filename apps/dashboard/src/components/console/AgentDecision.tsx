import { cn } from "../../lib/cn";

export function AgentDecision({
  decision,
  content,
}: {
  decision: "signed" | "refused" | "n/a";
  content: string;
}) {
  const refused = decision === "refused";
  const label = refused ? "Refused" : decision === "signed" ? "Signed" : "Diagnosis";

  return (
    <div>
      <span
        className={cn(
          "mb-2 inline-flex rounded-full px-2.5 py-1 font-sans text-[12px] font-semibold",
          refused ? "bg-red text-bgDeep" : decision === "signed" ? "bg-green text-bgDeep" : "bg-teal text-bgDeep",
        )}
      >
        {label}
      </span>
      <p className="font-sans text-[14px] leading-[1.6] text-text1">{content}</p>
    </div>
  );
}
