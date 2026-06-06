import Link from "next/link";
import {
  RiArrowRightUpLine,
  RiCheckboxCircleLine,
  RiDownloadLine,
  RiFileList3Line,
  RiGitBranchLine,
  RiInformationLine,
  RiSearchLine,
  RiShieldFlashLine,
  RiTeamLine,
} from "react-icons/ri";
import { BrandMark } from "../icons/BrandMark";
import { FallingActionStage } from "./FallingActionStage";

function LandingNav() {
  return (
    <header className="relative z-10 mx-auto flex h-[104px] w-full max-w-[1536px] items-center justify-between px-6 md:px-10">
      <BrandMark size={110} />
      <Link
        href="/demo?scenario=honeypot"
        className="inline-flex h-10 items-center gap-2 rounded-[13px] bg-button px-4 font-sans text-[14px] font-medium text-buttonText hover:opacity-90"
      >
        Demo
        <RiArrowRightUpLine className="size-4" />
      </Link>
    </header>
  );
}

function SeverityDot({ value, tone }: { value: string; tone: "red" | "amber" | "muted" }) {
  const color = tone === "red" ? "bg-red text-bgDeep" : tone === "amber" ? "bg-amber text-bgDeep" : "bg-surface3 text-text3";

  return <span className={`grid size-6 place-items-center rounded-full font-mono text-[11px] ${color}`}>{value}</span>;
}

function FindingPreview() {
  const groups = [
    { title: "Router swap can trap the agent balance", counts: ["4", "1"] },
    { title: "Sell path reverts for non-owner wallets", counts: ["4", "2", "1"], open: true },
  ];

  const findings = [
    ["H", "F-034", "SellBlocked triggers during round-trip exit", "Valid"],
    ["H", "F-035", "trapped[agent] changes from false to true", "Valid"],
    ["M", "F-036", "New token contract deployed inside review window", "Review"],
    ["M", "F-037", "Value at risk exceeds configured agent threshold", "Review"],
    ["L", "F-038", "Router ABI is locally recognized", "Valid"],
  ];

  return (
    <div className="landing-preview-mask mx-auto mt-16 max-w-[1260px] overflow-hidden rounded-[20px] border border-border bg-surface/70">
      <div className="grid min-h-[500px] lg:grid-cols-[76px_minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <aside className="hidden border-r border-border bg-bgDeep/30 px-3 py-5 lg:block">
          <BrandMark size={42} />
          <div className="mt-6 grid gap-3">
            <button className="grid size-10 place-items-center rounded-[12px] border border-border text-text3" type="button">+</button>
            <div className="grid gap-1 pt-8 text-center text-text3">
              <RiGitBranchLine className="mx-auto size-5" />
              <span className="font-sans text-[11px]">Runs</span>
            </div>
            <div className="grid gap-1 pt-4 text-center text-text4">
              <RiFileList3Line className="mx-auto size-5" />
              <span className="font-sans text-[11px]">Trace</span>
            </div>
          </div>
        </aside>

        <section className="border-r border-border">
          <div className="flex h-14 items-center justify-between border-b border-border px-5">
            <span className="font-sans text-[13px] text-text2">Runs / pre-flight</span>
            <div className="hidden items-center gap-2 text-text3 sm:flex">
              <RiInformationLine className="size-4" />
              <RiTeamLine className="size-4" />
              <span className="inline-flex items-center gap-1 rounded-[8px] border border-border px-2 py-1 font-sans text-[12px]">
                <RiDownloadLine className="size-3.5" />
                Export
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3">
            <span className="inline-flex h-8 items-center rounded-full border border-border px-3 font-sans text-[12px] text-text3">Severity</span>
            <span className="inline-flex h-8 items-center rounded-full border border-border px-3 font-sans text-[12px] text-text3">Validity</span>
            <span className="inline-flex h-8 min-w-[220px] items-center gap-2 rounded-full border border-border px-3 font-sans text-[12px] text-text3">
              <RiSearchLine className="size-4" />
              title, ID
            </span>
            <span className="inline-flex h-8 items-center rounded-full border border-border px-3 font-sans text-[12px] font-semibold text-text2">Most severe</span>
          </div>

          {groups.map((group) => (
            <div key={group.title} className={group.open ? "border-b border-border bg-surface3/45" : "border-b border-border"}>
              <div className="grid min-h-[52px] grid-cols-[22px_1fr_auto] items-center gap-3 px-5">
                <span className="size-4 rounded border border-border2" />
                <span className="truncate font-sans text-[14px] text-text2">{group.title}</span>
                <span className="flex items-center gap-1.5">
                  {group.counts.map((count, index) => (
                    <SeverityDot key={`${group.title}-${count}-${index}`} value={count} tone={index === 0 ? "red" : index === 1 ? "amber" : "muted"} />
                  ))}
                </span>
              </div>
            </div>
          ))}

          {findings.map(([level, id, title, status], index) => (
            <div
              key={title}
              className={index === 2 ? "grid min-h-[48px] grid-cols-[28px_48px_1fr_92px] items-center gap-3 border-b border-violet bg-violet/10 px-5" : "grid min-h-[48px] grid-cols-[28px_48px_1fr_92px] items-center gap-3 border-b border-border px-5"}
            >
              <span className={level === "H" ? "grid size-6 place-items-center rounded-full bg-red/80 font-sans text-[12px] text-bgDeep" : level === "M" ? "grid size-6 place-items-center rounded-full bg-amber/80 font-sans text-[12px] text-bgDeep" : "grid size-6 place-items-center rounded-full bg-surface3 font-sans text-[12px] text-text3"}>
                {level}
              </span>
              <span className="font-mono text-[11px] text-text4">{id}</span>
              <span className="truncate font-sans text-[13px] text-text2">{title}</span>
              <span className="text-right font-mono text-[11px] text-text3">{status}</span>
            </div>
          ))}
        </section>

        <section className="bg-bgDeep/28 p-5">
          <div className="grid grid-cols-2 rounded-[10px] border border-border p-1 font-mono text-[11px]">
            <span className="rounded-[8px] bg-surface3 py-2 text-center text-green">Valid</span>
            <span className="py-2 text-center text-red">Invalid</span>
          </div>
          <div className="mt-7">
            <h3 className="font-sans text-[18px] font-semibold leading-tight text-text1">SellBlocked triggers during round-trip exit</h3>
            <span className="mt-3 inline-flex rounded-full bg-red px-2.5 py-1 font-sans text-[12px] font-semibold text-bgDeep">High risk</span>
            <p className="mt-5 rounded-[10px] bg-surface3/55 p-3 font-sans text-[13px] leading-[1.55] text-text2">
              The token can be bought, but simulated sells from normal wallets revert while the owner can exit.
            </p>
          </div>
          <div className="mt-6 border-t border-border pt-5">
            <div className="font-sans text-[15px] font-semibold text-text2">Impact</div>
            <p className="mt-3 font-sans text-[13px] leading-[1.7] text-text3">
              Signing would move value into a position the agent cannot unwind.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProcessLabel({
  number,
  label,
  icon: Icon,
}: {
  number: string;
  label: string;
  icon: typeof RiShieldFlashLine;
}) {
  return (
    <div className="flex items-center gap-3 font-sans text-[13px] uppercase tracking-[0.02em] text-text3">
      <span className="grid size-7 place-items-center rounded-full bg-surface3 font-mono text-[12px] text-text2">{number}</span>
      <Icon className="size-5" />
      <span>{label}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] border-b border-border py-3 font-mono text-[12px] last:border-b-0">
      <span className="text-text3">{label}</span>
      <span className="text-text1">{value}</span>
    </div>
  );
}

function ScopeShowcase() {
  return (
    <section className="overflow-hidden rounded-[24px] border border-border bg-surface/40">
      <div className="grid gap-8 p-7 lg:grid-cols-[0.86fr_1.14fr] lg:p-10">
        <div>
          <ProcessLabel number="1" label="Intercept" icon={RiGitBranchLine} />
          <h3 className="mt-5 max-w-[12ch] font-display text-[36px] font-light leading-[0.98] text-text1">
            Intercept the intent.
          </h3>
          <p className="mt-5 max-w-[34ch] font-sans text-[18px] font-light leading-[1.45] tracking-[-0.025em] text-text2">
            The agent has a proposed write transaction. Foresight takes the raw calldata before signing.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-[0.72fr_1fr]">
          <div className="rounded-[14px] border border-border bg-bgDeep/35 p-5">
            <p className="font-sans text-[13px] leading-[1.6] text-text3">
              Pre-flight context is pinned before the agent commits.
            </p>
            <div className="mt-5">
              <MiniMetric label="Network" value="Pharos" />
              <MiniMetric label="Action" value="swap" />
              <MiniMetric label="Value" value="1 PHRS" />
            </div>
          </div>
          <div className="rounded-[16px] border border-border bg-surface2/55 p-4">
            <div className="mb-4 flex items-center gap-2 font-mono text-[12px] text-text2">
              <span className="text-text4">...</span>
              <span>/ transaction</span>
            </div>
            {[
              ['from', 'agent wallet'],
              ['to', 'SimpleRouter'],
              ['fn', 'swap(...)'],
              ['value', '1 PHRS'],
            ].map(([label, value]) => (
              <div key={label} className="grid min-h-11 grid-cols-[86px_1fr] items-center border-b border-border font-mono text-[12px] last:border-b-0">
                <span className="text-text4">{label}</span>
                <span className="text-text2">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewShowcase() {
  const rows = [
    ['High', 'Sell path reverts for normal wallets', 'Valid'],
    ['High', 'trapped[agent] storage flag flips', 'Valid'],
    ['Med', 'New token contract inside review window', 'Review'],
    ['Low', 'Router ABI recognized locally', 'Valid'],
  ];

  return (
    <section className="overflow-hidden rounded-[24px] border border-border bg-surface/40">
      <div className="px-7 pt-8 text-center lg:px-10">
        <ProcessLabel number="2" label="Review" icon={RiFileList3Line} />
        <h3 className="mx-auto mt-4 max-w-[620px] font-display text-[34px] font-light leading-none text-text1">
          Decode the impact.
        </h3>
        <p className="mx-auto mt-3 max-w-[620px] font-sans text-[17px] font-light leading-[1.5] tracking-[-0.025em] text-text2">
          Token movement, storage changes, call trace, and risk findings are reduced to the parts that matter.
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-[920px] px-5 pb-10">
        <div className="overflow-hidden rounded-[16px] border border-border bg-bgDeep/35">
          {rows.map(([severity, title, status], index) => (
            <div key={title} className={index === 1 ? 'grid min-h-14 grid-cols-[70px_1fr_90px] items-center gap-4 border-b border-violet bg-violet/10 px-4' : 'grid min-h-14 grid-cols-[70px_1fr_90px] items-center gap-4 border-b border-border px-4 last:border-b-0'}>
              <span className={severity === 'High' ? 'font-sans text-[13px] text-red' : severity === 'Med' ? 'font-sans text-[13px] text-amber' : 'font-sans text-[13px] text-text4'}>
                {severity}
              </span>
              <span className="truncate font-sans text-[14px] text-text2">{title}</span>
              <span className="text-right font-mono text-[11px] text-text3">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VerdictShowcase() {
  return (
    <section className="overflow-hidden rounded-[24px] border border-border bg-surface/40">
      <div className="grid gap-8 p-7 lg:grid-cols-[1.04fr_0.96fr] lg:p-10">
        <div className="grid gap-4">
          <div className="rounded-[16px] border border-border bg-bgDeep/35 p-5">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <span className="font-sans text-[15px] text-text2">Agent response</span>
              <span className="text-text4">x</span>
            </div>
            <p className="font-sans text-[14px] leading-[1.65] text-text2">
              I will not sign this transaction. The token can be bought, but simulated exits revert for normal wallets.
            </p>
          </div>
          <div className="rounded-[16px] border border-border bg-bgDeep/35 p-5">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <span className="font-sans text-[15px] text-text2">Verdict</span>
              <span className="font-mono text-[11px] text-red">risk 96</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-red" />
              <span className="font-sans text-[15px] text-text1">Do not sign</span>
            </div>
          </div>
        </div>
        <div className="self-center lg:text-right">
          <ProcessLabel number="3" label="Verdict" icon={RiCheckboxCircleLine} />
          <h3 className="mt-5 font-display text-[36px] font-light leading-[0.98] text-text1">
            Return a verdict.
          </h3>
          <p className="mt-5 font-sans text-[18px] font-light leading-[1.45] tracking-[-0.025em] text-text2">
            The skill gives the agent a simple answer: sign, review, or refuse.
          </p>
        </div>
      </div>
    </section>
  );
}
function LandingFooter() {
  return (
    <footer className="landing-footer relative z-10 overflow-hidden border-t border-border">
      <div className="landing-footer-links mx-auto grid max-w-[980px] grid-cols-1 gap-8 px-6 pt-16 font-sans text-[18px] leading-[1.75] text-text2 sm:grid-cols-[1fr_0.8fr_1fr] md:px-10">
        <div className="grid content-start gap-1">
          <span>Documentation</span>
          <span>Skill README</span>
          <span>Usage guide</span>
          <span>Pharos Agent Center</span>
        </div>
        <div className="grid content-start gap-1">
          <span>GitHub</span>
          <span>Discord</span>
          <span>Demo</span>
        </div>
        <div className="content-start text-left sm:text-center">
          <span>Foresight {"\u00a9"} 2026</span>
        </div>
      </div>

      <BrandMark size={1600} className="footer-mega-mark" />
      <span className="footer-spark footer-spark--left" aria-hidden />
      <span className="footer-spark footer-spark--middle" aria-hidden />
      <span className="footer-spark footer-spark--right" aria-hidden />
    </footer>
  );
}
export function LandingPage() {
  return (
    <main className="v12-shell h-screen overflow-y-auto text-text1">
      <LandingNav />
      <section className="relative z-10 mx-auto max-w-[1536px] px-6 pb-16 pt-8 text-center md:px-10">
        <h1 className="mx-auto max-w-[920px] text-balance text-center font-display text-3xl font-light leading-9 tracking-[-0.05rem] text-text1 sm:text-[2.25rem] sm:leading-10">
          Pre-flight security for autonomous agents.
          <br />
          Safe Pharos transactions before signing.
        </h1>
        <p className="mx-auto mt-5 max-w-[860px] text-balance text-center font-sans text-lg font-light leading-[1.375rem] tracking-[-0.025em] text-text2 sm:text-[1.2rem] sm:leading-[1.55rem]">
          Foresight simulates proposed onchain actions, decodes balance and state changes, and returns a plain verdict in seconds
          <span className="relative mx-1 inline-block select-none text-text3">
            after losses
            <span className="pointer-events-none absolute left-0 top-1/2 h-px w-full -rotate-6 bg-red" />
            <span className="pointer-events-none absolute left-0 top-[58%] h-px w-full rotate-3 bg-red" />
          </span>
          before value moves.
        </p>
        <div className="mt-8 flex flex-row items-center justify-center gap-2 max-[400px]:w-full max-[400px]:flex-col">
          <div className="relative inline-block w-fit select-none max-[400px]:w-full">
            <button
              type="button"
              disabled
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-5 py-3 font-sans text-base font-normal leading-5 tracking-[-0.025em] text-text3 disabled:cursor-not-allowed sm:min-h-12 sm:px-6 sm:text-lg sm:leading-[1.375rem]"
            >
              <span>Trust blindly</span>
              <RiArrowRightUpLine className="size-4" />
            </button>
            <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-px w-[72%] -translate-x-1/2 -translate-y-1/2 -rotate-6 bg-red" />
            <span className="pointer-events-none absolute left-1/2 top-[55%] z-10 h-px w-[72%] -translate-x-1/2 -translate-y-1/2 rotate-3 bg-red" />
          </div>
          <Link
            href="/demo?scenario=honeypot"
            className="flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg border border-button bg-button px-5 py-3 font-sans text-base font-normal leading-5 tracking-[-0.025em] text-buttonText hover:opacity-90 sm:min-h-12 sm:px-6 sm:text-lg sm:leading-[1.375rem] max-[400px]:w-full"
          >
            Run pre-flight
            <RiArrowRightUpLine className="size-4" />
          </Link>
        </div>
        <FindingPreview />
      </section>

      <section className="relative z-10 mx-auto -mt-8 max-w-[1536px] px-6 pb-24 pt-4 md:px-10">
        <p className="mx-auto max-w-[920px] text-center font-sans text-[clamp(22px,2.35vw,36px)] font-light leading-[1.18] tracking-[-0.035em] text-text1">
          Built for the moment before an agent signs: approvals, swaps, unknown contracts, and failed transaction autopsies.
        </p>
        <div className="mt-16 grid gap-6">
          <ScopeShowcase />
          <ReviewShowcase />
          <VerdictShowcase />
        </div>
      </section>

      <FallingActionStage />

      <LandingFooter />
    </main>
  );
}






