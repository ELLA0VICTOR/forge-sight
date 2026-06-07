"use client";

import { useEffect, useMemo, useState } from "react";
import type { IconType } from "react-icons";
import { RiCheckLine, RiFileCopyLine, RiShieldCheckLine, RiTerminalBoxLine } from "react-icons/ri";
import type { ScenarioScript } from "@foresight/engine";
import { useLiveEngine } from "../../hooks/useLiveEngine";
import { cn } from "../../lib/cn";
import { useForesightStore } from "../../store/useForesightStore";

const scenarioNames: Record<ScenarioScript["id"], string> = {
  "happy-path": "Standard swap",
  honeypot: "Honeypot refusal",
  autopsy: "Failed tx autopsy",
};

function commandForScenario(scenarioId: ScenarioScript["id"]) {
  if (scenarioId === "autopsy") {
    return "corepack pnpm --filter @foresight/cli dev -- diagnose --tx <failed-tx-hash>";
  }

  return `corepack pnpm --filter @foresight/cli dev -- assess-risk --scenario ${scenarioId} --mode live`;
}

function ProofItem({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  icon: IconType;
  className?: string;
}) {
  return (
    <div className={cn("grid min-w-0 grid-cols-[18px_1fr] items-center gap-3 py-3", className)}>
      <Icon className="size-4 text-text3" />
      <div className="min-w-0">
        <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-text4">{label}</div>
        <div className="mt-1 truncate font-sans text-[12px] font-normal leading-none text-text2">{value}</div>
      </div>
    </div>
  );
}

export function ProofStrip() {
  const { scenarioId, phase } = useForesightStore();
  const liveEngine = useLiveEngine();
  const [copied, setCopied] = useState(false);
  const command = useMemo(() => commandForScenario(scenarioId), [scenarioId]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="relative z-10 border-b border-border bg-bgDeep/48">
      <div className="mx-auto grid min-h-[58px] max-w-[1536px] grid-cols-2 items-center px-6 md:px-10 lg:grid-cols-[0.82fr_0.92fr_minmax(340px,1.35fr)]">
        <ProofItem
          icon={RiShieldCheckLine}
          label="Web view"
          value={`${scenarioNames[scenarioId]} / ${phase.toLowerCase()}`}
          className="border-r border-border pr-4"
        />
        <ProofItem
          icon={RiTerminalBoxLine}
          label="Real skill"
          value={liveEngine.available ? "HTTP engine connected" : "CLI + MCP run live Pharos RPC"}
          className="pl-4 lg:border-r lg:border-border lg:pr-4"
        />
        <div className="col-span-2 hidden min-w-0 items-center gap-3 py-3 pl-0 lg:col-span-1 lg:flex lg:pl-4">
          <RiTerminalBoxLine className="size-4 shrink-0 text-text3" />
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-text4">Proof command</div>
            <code className="mt-1 block truncate font-mono text-[11px] leading-none text-text2">{command}</code>
          </div>
          <button
            type="button"
            onClick={copyCommand}
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-2 rounded-[9px] border border-border px-3 font-sans text-[12px] text-text3 hover:border-border2 hover:text-text1",
              copied && "border-green text-green",
            )}
          >
            {copied ? <RiCheckLine className="size-4" /> : <RiFileCopyLine className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </section>
  );
}
