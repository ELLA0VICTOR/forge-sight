import { LuShieldAlert, LuShieldCheck } from "react-icons/lu";
import type { SimReport } from "@foresight/engine";
import { Address } from "../primitives/Address";

export function TransactionSummary({ report }: { report?: SimReport | undefined }) {
  if (!report) {
    return <div className="border border-line-subtle bg-inset p-3 text-sm text-ink-tertiary">Awaiting transaction.</div>;
  }

  const verified = report.decoded.verified;

  return (
    <div className="flex flex-wrap items-center gap-2 border border-line-subtle bg-inset p-3 font-mono text-[12px] text-ink-secondary">
      <span>FROM</span>
      <Address value={report.tx.from} label="agent" />
      <span className="text-ink-tertiary">-&gt;</span>
      <span>TO</span>
      <Address value={report.tx.to} label={report.decoded.contractName} />
      <span className={verified ? "text-risk-safe" : "text-risk-caution"}>
        {verified ? <LuShieldCheck /> : <LuShieldAlert />}
      </span>
      <span>FN {report.decoded.functionName}</span>
      <span>VALUE {report.tx.value ?? "0"}</span>
    </div>
  );
}
