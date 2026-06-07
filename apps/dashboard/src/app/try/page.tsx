import Link from "next/link";
import type { ReactNode } from "react";
import { RiArrowLeftLine, RiArrowRightUpLine, RiCheckLine, RiTerminalBoxLine } from "react-icons/ri";
import { BrandMark } from "../../components/icons/BrandMark";

const installCommand = "corepack pnpm install && corepack pnpm --filter @foresight/cli build";
const liveDemoCommand = "corepack pnpm --filter @foresight/cli dev -- skill demo honeypot --live";
const checkCommand =
  "corepack pnpm --filter @foresight/cli dev -- skill check --from <agent> --to <contract> --data <calldata> --value <wei> --mode live";

function CommandBlock({
  label,
  command,
  output,
}: {
  label: string;
  command: string;
  output?: string[];
}) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-border bg-bgDeep/80">
      <div className="flex min-h-11 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2 text-[12px] text-text3">
          <RiTerminalBoxLine className="size-4" />
          <span>{label}</span>
        </div>
      </div>
      <div className="px-4 py-4">
        <pre className="overflow-x-auto text-[13px] leading-6 text-text2">
          <code>{command}</code>
        </pre>
        {output ? (
          <div className="mt-4 border-t border-border pt-4">
            {output.map((line) => (
              <div key={line} className="text-[12px] leading-6 text-text3">
                {line}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-border py-5 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="grid size-7 place-items-center rounded-full bg-surface3 text-[12px] text-text2">{number}</span>
        <h2 className="text-[15px] font-semibold text-text1">{title}</h2>
      </div>
      <div className="text-[13px] leading-6 text-text3">{children}</div>
    </div>
  );
}

export default function TryPage() {
  return (
    <main
      className="v12-shell h-screen overflow-y-auto text-text1"
      style={{ fontFamily: '"SUSE Mono", var(--font-mono), monospace' }}
    >
      <header className="relative z-10 mx-auto flex h-[92px] max-w-[1180px] items-center justify-between px-6">
        <BrandMark size={96} />
        <Link
          href="/"
          className="inline-flex h-9 items-center gap-2 border border-border px-3 text-[12px] text-text3 hover:border-border2 hover:text-text1"
        >
          <RiArrowLeftLine className="size-4" />
          Landing
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid max-w-[1180px] gap-8 px-6 pb-20 pt-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="text-[12px] uppercase tracking-[0.16em] text-text4">Real Pharos Skill Demo</div>
          <h1 className="mt-5 max-w-[11ch] text-[clamp(34px,5vw,68px)] font-semibold leading-[0.92] tracking-[-0.06em] text-text1">
            Run it before signing.
          </h1>
          <p className="mt-6 max-w-[46ch] text-[14px] leading-7 text-text2">
            Foresight is a CLI and MCP skill for pre-sign transaction checks. The web page explains the flow; the real proof is
            the live Pharos RPC command.
          </p>
          <Link
            href="/demo?scenario=honeypot"
            className="mt-7 inline-flex h-10 items-center gap-2 border border-border px-4 text-[13px] text-text3 hover:border-border2 hover:text-text1"
          >
            Optional replay viewer
            <RiArrowRightUpLine className="size-4" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-border bg-surface/48">
          <div className="border-b border-border px-5 py-4">
            <div className="text-[12px] text-text2">Foresight skill workflow</div>
            <div className="mt-1 text-[11px] text-text4">install / live demo / agent guardrail</div>
          </div>

          <div className="px-5">
            <Step number="1" title="Install the workspace skill">
              <CommandBlock label="install" command={installCommand} />
            </Step>

            <Step number="2" title="Run the real live honeypot refusal">
              <CommandBlock
                label="live Pharos RPC"
                command={liveDemoCommand}
                output={[
                  "FORESIGHT SKILL",
                  "Mode: live Pharos RPC",
                  "Verdict: DO_NOT_SIGN",
                  "Risk: 100 / CRITICAL",
                  "Proof: buy succeeds, non-owner exit reverts with SellBlocked",
                ]}
              />
            </Step>

            <Step number="3" title="Check any proposed transaction before signing">
              <CommandBlock label="manual check" command={checkCommand} />
            </Step>

            <Step number="4" title="Use it from an AI agent through MCP">
              <div className="grid gap-4">
                <CommandBlock
                  label="mcp server"
                  command={'corepack pnpm --filter @foresight/mcp dev'}
                  output={[
                    "Tool: foresight_assess_risk",
                    "Tool: foresight_simulate",
                    "Tool: foresight_explain",
                    "Tool: foresight_diagnose",
                  ]}
                />
                <div className="grid gap-2 rounded-[12px] border border-border bg-bgDeep/70 p-4 text-[12px] leading-6 text-text3">
                  <div className="flex items-center gap-2 text-text2">
                    <RiCheckLine className="size-4 text-green" />
                    Agent rule
                  </div>
                  <p>
                    Before signing a Pharos write transaction, call <span className="text-text1">foresight_assess_risk</span>.
                    Sign only when the returned verdict is <span className="text-green">SIGN</span>.
                  </p>
                </div>
              </div>
            </Step>
          </div>
        </div>
      </section>
    </main>
  );
}
