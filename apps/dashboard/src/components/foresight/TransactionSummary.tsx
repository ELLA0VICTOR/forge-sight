import { RiShieldCheckLine, RiShieldFlashLine } from "react-icons/ri";
import type { DiagnoseReport, SimReport } from "@foresight/engine";
import { txValueLabel } from "../../lib/format";
import { Address } from "../primitives/Address";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-text4">
      {children}
    </div>
  );
}

function SummarySkeleton() {
  return (
    <section className="border-b border-border py-4">
      <Label>Analysis summary</Label>
      <div className="mt-4 grid gap-3">
        <div className="skeleton-line w-full" />
        <div className="skeleton-line w-11/12" />
        <div className="skeleton-line w-2/3" />
      </div>
    </section>
  );
}

function VerifiedStatus({ verified }: { verified: boolean }) {
  const Icon = verified ? RiShieldCheckLine : RiShieldFlashLine;

  return (
    <span
      className={verified ? "inline-flex items-center gap-1 text-green" : "inline-flex items-center gap-1 text-amber"}
      title={verified ? "Verified ABI matched" : "Unverified contract"}
    >
      <Icon className="size-4" />
      <span>{verified ? "verified" : "unverified"}</span>
    </span>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-9 grid-cols-[78px_1fr] items-center border-b border-border font-mono text-[11px] tabular last:border-b-0">
      <span className="text-text4">{label}</span>
      <span className="min-w-0 text-text2">{children}</span>
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
      <section className="border-b border-border py-4">
        <Label>Analysis summary</Label>
        <p className="mt-3 font-sans text-[13px] font-normal leading-[1.65] text-text2">{diagnosis.rootCause}</p>
        <div className="mt-4 border-t border-border">
          <Fact label="tx"><Address value={diagnosis.txHash} label="hash" /></Fact>
          <Fact label="frame">{diagnosis.revertingFrame}</Fact>
          <Fact label="error"><span className="text-red">{diagnosis.errorName}</span></Fact>
        </div>
      </section>
    );
  }

  if (!report) return <SummarySkeleton />;

  return (
    <section className="border-b border-border py-4">
      <Label>Analysis summary</Label>
      <p className="mt-3 font-sans text-[13px] font-normal leading-[1.65] text-text2">{report.verdict.paragraph}</p>
      <div className="mt-4 border-t border-border">
        <Fact label="from"><Address value={report.tx.from} label="agent" /></Fact>
        <Fact label="to"><Address value={report.tx.to} label={report.decoded.contractName} /></Fact>
        <Fact label="abi"><VerifiedStatus verified={report.decoded.verified} /></Fact>
        <Fact label="function">{report.decoded.functionName}</Fact>
        <Fact label="value">{txValueLabel(report)}</Fact>
      </div>
    </section>
  );
}