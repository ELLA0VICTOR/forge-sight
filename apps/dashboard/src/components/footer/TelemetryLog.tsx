"use client";

import { useEffect, useRef } from "react";
import { LuChevronDown } from "react-icons/lu";
import type { TelemetryEvent } from "@foresight/engine";
import { Panel } from "../primitives/Panel";
import { useForesightStore } from "../../store/useForesightStore";
import { cn } from "../../lib/cn";

function TelemetryLine({ event }: { event: TelemetryEvent }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[70px_110px_1fr] gap-3 border-b border-line-subtle/60 px-3 py-1 font-mono text-[12px]",
        event.level === "error" && "text-risk-critical",
        event.level === "warn" && "text-risk-caution",
        event.level === "ok" && "text-risk-safe",
        event.level === "info" && "text-ink-secondary",
      )}
    >
      <span className="text-ink-tertiary">+{event.t}ms</span>
      <span className="uppercase text-scan">{event.phase}</span>
      <span>{event.message}</span>
    </div>
  );
}

export function TelemetryLog() {
  const telemetry = useForesightStore((state) => state.telemetryShown);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [telemetry.length]);

  return (
    <Panel
      title="TELEMETRY"
      right={<LuChevronDown className="size-4 text-ink-tertiary" />}
      className="h-full rounded-none border-x-0 border-b-0"
    >
      <div className="h-[100px] overflow-y-auto bg-inset">
        {telemetry.map((event, index) => (
          <TelemetryLine key={`${event.t}-${event.message}-${index}`} event={event} />
        ))}
        <div ref={endRef} />
      </div>
    </Panel>
  );
}
