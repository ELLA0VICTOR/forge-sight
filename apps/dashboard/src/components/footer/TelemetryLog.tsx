"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import type { TelemetryEvent } from "@foresight/engine";
import { useForesightStore } from "../../store/useForesightStore";
import { cn } from "../../lib/cn";
import { telemetryFade } from "../../lib/motion";

function badgeClass(event: TelemetryEvent) {
  if (event.phase === "system") return "border-teal text-teal";
  if (event.phase === "INTERCEPT") return "border-amber text-amber";
  if (event.phase === "SIMULATING" || event.phase === "TRACING") return "border-text2 text-text2";
  if (event.level === "error") return "border-red text-red";
  if (event.level === "warn") return "border-amber text-amber";
  if (event.level === "ok") return "border-green text-green";
  return "border-teal text-teal";
}

function TelemetryLine({ event, index }: { event: TelemetryEvent; index: number }) {
  return (
    <motion.div
      variants={telemetryFade}
      initial="initial"
      animate="animate"
      transition={{ delay: Math.min(index * 0.02, 0.16) }}
      className={cn(
        "grid grid-cols-[90px_116px_1fr] items-center gap-3 border-b border-border px-6 py-1.5 font-mono text-[12px] font-normal tabular",
        event.level === "error" && "text-red",
        event.level === "warn" && "text-amber",
        event.level === "ok" && "text-green",
        event.level === "info" && "text-text2",
      )}
    >
      <span className="text-text4">[{event.t}ms]</span>
      <span className={cn("inline-flex w-fit rounded-full border px-2 py-0.5 text-[10px] font-normal uppercase tracking-[0.1em]", badgeClass(event))}>
        {event.phase}
      </span>
      <span className="truncate">{event.message}</span>
    </motion.div>
  );
}

export function TelemetryLog() {
  const telemetry = useForesightStore((state) => state.telemetryShown);
  const [expanded, setExpanded] = useState(false);
  const newestFirst = useMemo(() => [...telemetry].reverse(), [telemetry]);
  const latest = newestFirst.slice(0, 2);
  const Chevron = expanded ? RiArrowUpSLine : RiArrowDownSLine;

  return (
    <footer className={cn("relative z-10 border-t border-border bg-bgDeep/80 backdrop-blur transition-[height] duration-300 ease-out", expanded ? "h-[180px]" : "h-10")}>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mx-auto grid h-10 w-full max-w-[1536px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 text-left md:px-10"
      >
        <span className="font-sans text-[12px] font-semibold text-text2">Telemetry</span>
        <span className="flex min-w-0 items-center gap-5 overflow-hidden font-mono text-[12px] font-normal text-text3">
          {latest.map((event, index) => (
            <span key={`${event.t}-${event.message}-${index}`} className="truncate">
              [{event.t}ms] {event.phase}: {event.message}
            </span>
          ))}
        </span>
        <Chevron className="size-4 text-text3" />
      </button>
      {expanded ? (
        <div className="bench-scroll h-[140px] overflow-y-auto border-t border-border bg-bgDeep">
          <div className="mx-auto max-w-[1536px]">
            {newestFirst.map((event, index) => (
              <TelemetryLine key={`${event.t}-${event.message}-${index}`} event={event} index={index} />
            ))}
          </div>
        </div>
      ) : null}
    </footer>
  );
}
