"use client";

import { motion } from "framer-motion";
import type { RiskBand } from "@foresight/engine";
import { useCountUp } from "../../hooks/useCountUp";
import { cn } from "../../lib/cn";

const bandColor: Record<RiskBand, string> = {
  SAFE: "var(--risk-safe)",
  CAUTION: "var(--risk-caution)",
  DANGER: "var(--risk-danger)",
  CRITICAL: "var(--risk-critical)",
};

export function RiskGauge({
  score,
  band,
  state,
}: {
  score?: number | undefined;
  band?: RiskBand | undefined;
  state: "idle" | "scanning" | "result";
}) {
  const activeScore = score ?? 0;
  const activeBand = band ?? "SAFE";
  const display = useCountUp(activeScore, state === "result");
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const arc = circumference * 0.75;
  const fraction = Math.min(1, activeScore / 100);

  return (
    <div className={cn("relative grid min-h-[238px] place-items-center", activeBand === "CRITICAL" && state === "result" && "shadow-critical")}>
      <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-[225deg]">
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
          opacity="0.7"
        />
        {Array.from({ length: 28 }).map((_, index) => (
          <line
            key={index}
            x1="110"
            y1="20"
            x2="110"
            y2="28"
            stroke={index / 28 <= fraction ? bandColor[activeBand] : "var(--line-strong)"}
            strokeWidth="1.5"
            transform={`rotate(${index * (270 / 27)} 110 110)`}
            opacity={0.75}
          />
        ))}
        {state === "scanning" ? (
          <motion.line
            x1="110"
            y1="110"
            x2="110"
            y2="26"
            stroke="var(--scan)"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ rotate: [0, 270] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            style={{ originX: "110px", originY: "110px" }}
          />
        ) : null}
        {state === "result" ? (
          <motion.circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke={bandColor[activeBand]}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference}`}
            initial={{ strokeDashoffset: arc }}
            animate={{ strokeDashoffset: arc * (1 - fraction) }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${bandColor[activeBand]})` }}
          />
        ) : null}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {state === "scanning" ? (
          <div>
            <div className="font-display text-[13px] font-semibold uppercase tracking-[0.18em] text-scan">
              ANALYZING
            </div>
            <div className="mt-2 font-mono text-[11px] text-ink-tertiary">round-trip fork simulation</div>
          </div>
        ) : state === "result" ? (
          <div>
            <div className="font-display text-[clamp(40px,6vw,64px)] font-bold tabular-nums text-ink-primary">
              {display}
            </div>
            <div className="font-display text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: bandColor[activeBand] }}>
              {activeBand}
            </div>
            <div className="mt-1 font-display text-[10px] uppercase tracking-[0.14em] text-ink-tertiary">
              RISK SCORE
            </div>
          </div>
        ) : (
          <div className="font-display text-[13px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
            STANDBY
          </div>
        )}
      </div>
    </div>
  );
}
