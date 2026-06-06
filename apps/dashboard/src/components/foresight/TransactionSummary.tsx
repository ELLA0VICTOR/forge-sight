import { RiShieldCheckLine, RiShieldFlashLine } from "react-icons/ri";
import type { DiagnoseReport, SimReport } from "@foresight/engine";
import { txValueLabel } from "../../lib/format";
import { Address } from "../primitives/Address";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans text-[13px] font-semibold text-text2">
      {children}
    </div>
  );
}

function SummarySkeleton() {
  return (
    <section className="rounded-[16px] border border-border bg-bgDeep/30 p-5">
      <Label>Analysis summary</Label>
      <div className="mt-4 grid gap-3">
        <div className="skeleton-line w-full" />
        <div className="skeleton-line w-11/12" />
        <div className="skeleton-line w-2/3" />
      </div>
    </section>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  const Icon = verified ? RiShieldCheckLine : RiShieldFlashLine;

  return (
    <span
      className={verified ? "inline-flex items-center gap-1 text-green" : "inline-flex items-center gap-1 text-amber"}
      title={verified ? "Verified ABI matched" : "Unverified contract"}
    >
      <Icon className="size-4" />
      <span className="font-sans text-[12px] font-semibold">{verified ? "Verified" : "Unverified"}</span>
    </span>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="font-sans text-[12px] font-semibold text-text3">{label}</span>
      <span className="min-w-0 font-mono text-[12px] font-normal tabular text-text2">{children}</span>
    </div>
  );
}

export function TransactionSummary({
  report,
  diagnosis,
  visible,
}: {
  report?: SimReport | undefined;
  diagnosis?: DiagnoseReport | undefined;
  visible: boolean;
}) {
  if (!visible || (!report && !diagnosis)) return <SummarySkeleton />;

  if (diagnosis && !report) {
    return (
      <section className="rounded-[16px] border border-border bg-bgDeep/30 p-5 transition-colors hover:border-border2">
        <Label>Analysis summary</Label>
        <p className="mt-3 font-sans text-[14px] font-normal leading-[1.65] text-text2">{diagnosis.rootCause}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4">
          <Fact label="Tx"><Address value={diagnosis.txHash} label="hash" /></Fact>
          <Fact label="Frame">{diagnosis.revertingFrame}</Fact>
          <Fact label="Error"><span className="text-red">{diagnosis.errorName}</span></Fact>
        </div>
      </section>
    );
  }

  if (!report) return <SummarySkeleton />;

  return (
    <section className="rounded-[16px] border border-border bg-bgDeep/30 p-5 transition-colors hover:border-border2">
      <Label>Analysis summary</Label>
      <p className="mt-3 font-sans text-[14px] font-normal leading-[1.65] text-text2">{report.verdict.paragraph}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4">
        <Fact label="From"><Address value={report.tx.from} label="agent" /></Fact>
        <Fact label="To"><Address value={report.tx.to} label={report.decoded.contractName} /></Fact>
        <VerifiedBadge verified={report.decoded.verified} />
        <Fact label="Fn">{report.decoded.functionName}</Fact>
        <Fact label="Value">{txValueLabel(report)}</Fact>
      </div>
    </section>
  );
}
