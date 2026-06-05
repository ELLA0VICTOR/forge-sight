import { LuWrench, LuX } from "react-icons/lu";
import type { CallNode, DiagnoseReport } from "@foresight/engine";
import { cn } from "../../lib/cn";
import { gas, truncAddr } from "../../lib/format";
import { Panel } from "../primitives/Panel";

function CallTraceNode({ node }: { node: CallNode }) {
  return (
    <div>
      <div
        className={cn(
          "grid grid-cols-[1fr_auto] items-center border-b border-line-subtle py-2 pr-2 font-mono text-[12px]",
          node.reverted && "border-l-2 border-l-risk-critical bg-elevated pl-2 text-risk-critical",
        )}
        style={{ paddingLeft: node.reverted ? undefined : `${node.depth * 18 + 8}px` }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="border border-line-subtle px-1 text-[10px] text-ink-tertiary">{node.type}</span>
          {node.reverted ? <LuX className="size-3" /> : null}
          <span className="truncate">
            {node.contractName}.{node.functionName}({truncAddr(node.to)})
          </span>
          {node.errorName ? <span className="border border-risk-critical px-1 text-risk-critical">{node.errorName}</span> : null}
        </div>
        <span className="text-ink-tertiary">{gas(node.gasUsed)}</span>
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
    <Panel title="CALL TRACE" accent="critical">
      <div className="max-h-[360px] overflow-y-auto">
        <CallTraceNode node={diagnosis.callTree} />
      </div>
      <div className="grid gap-3 border-t border-line-subtle p-3">
        <div>
          <div className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-risk-critical">
            ROOT CAUSE
          </div>
          <p className="mt-1 text-sm leading-6 text-ink-secondary">{diagnosis.rootCause}</p>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-scan">
            <LuWrench className="size-4" />
            SUGGESTED FIX
          </div>
          <div className="bg-inset p-3 font-mono text-[11px] text-ink-secondary">
            <div>{diagnosis.fix.summary}</div>
            <div className="mt-2 break-all text-ink-tertiary">{diagnosis.fix.suggestedTx.data}</div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
