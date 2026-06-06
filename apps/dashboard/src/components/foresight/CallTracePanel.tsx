import { RiCloseLine, RiToolsLine } from "react-icons/ri";
import type { CallNode, DiagnoseReport } from "@foresight/engine";
import { cn } from "../../lib/cn";
import { gas, truncAddr } from "../../lib/format";

function CallTraceNode({ node }: { node: CallNode }) {
  return (
    <div>
      <div
        className={cn(
          "grid grid-cols-[1fr_auto] items-center border-b border-border py-2.5 pr-4 font-mono text-[12px] font-normal tabular transition-colors hover:border-border2",
          node.reverted && "bg-red/10 text-red",
        )}
        style={{ paddingLeft: `${node.depth * 18 + 16}px` }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-text3">{node.type}</span>
          {node.reverted ? <RiCloseLine className="size-4" /> : null}
          <span className="truncate">
            {node.contractName}.{node.functionName}({truncAddr(node.to)})
          </span>
          {node.errorName ? <span className="rounded-full bg-red px-2 py-0.5 text-[10px] text-bgDeep">{node.errorName}</span> : null}
        </div>
        <span className="text-text3">{gas(node.gasUsed)}</span>
      </div>
      {node.children.map((child) => (
        <CallTraceNode key={child.id} node={child} />
      ))}
    </div>
  );
}

export function CallTracePanel({ diagnosis, visible }: { diagnosis?: DiagnoseReport | undefined; visible: boolean }) {
  if (!diagnosis || !visible) return null;

  return (
    <section className="overflow-hidden rounded-[16px] border border-border bg-bgDeep/30 transition-colors hover:border-border2">
      <div className="border-b border-border px-5 py-4 font-sans text-[13px] font-semibold text-text2">
        Call trace
      </div>
      <div className="bench-scroll max-h-[300px] overflow-y-auto">
        <CallTraceNode node={diagnosis.callTree} />
      </div>
      <div className="grid gap-4 border-t border-border p-5">
        <div>
          <div className="font-sans text-[13px] font-semibold text-red">
            Root cause
          </div>
          <p className="mt-2 font-sans text-[14px] leading-[1.6] text-text2">{diagnosis.rootCause}</p>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 font-sans text-[13px] font-semibold text-teal">
            <RiToolsLine className="size-4" />
            Suggested fix
          </div>
          <div className="border-t border-border pt-3 font-mono text-[11px] font-normal tabular text-text2">
            <div>{diagnosis.fix.summary}</div>
            <div className="mt-2 break-all text-text3">{diagnosis.fix.suggestedTx.data}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
