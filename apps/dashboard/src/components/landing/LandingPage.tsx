import Link from "next/link";
import {
  RiArrowRightUpLine,
  RiCheckboxCircleLine,
  RiFileList3Line,
  RiGitBranchLine,
  RiShieldFlashLine,
} from "react-icons/ri";
import { BrandMark } from "../icons/BrandMark";
import { FallingActionStage } from "./FallingActionStage";

function LandingNav() {
  return (
    <header className="relative z-10 mx-auto flex h-[104px] w-full max-w-[1536px] items-center justify-between px-6 md:px-10">
      <BrandMark size={110} />
      <Link
        href="/try"
        className="inline-flex h-10 items-center gap-2 rounded-[13px] bg-button px-4 font-sans text-[14px] font-medium text-buttonText hover:opacity-90"
      >
        Try now
        <RiArrowRightUpLine className="size-4" />
      </Link>
    </header>
  );
}

function FindingPreview() {
  return (
    <div
      className="landing-preview-mask mx-auto mt-14 w-full max-w-[860px] overflow-hidden rounded-[6px] border border-white/[0.07] bg-black text-left"
      style={{ fontFamily: "var(--font-mono), monospace" }}
    >
      <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
        <div className="size-2.5 rounded-full bg-[#FF5F57]" />
        <div className="size-2.5 rounded-full bg-[#FEBC2E]" />
        <div className="size-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-white/15">
          Foresight - Skill Demo
        </span>
      </div>

      <div className="px-5 py-[18px]">
        <div className="mb-3.5 font-mono text-[11px] leading-[1.7] text-white/30">
          <div>
            <span className="text-green">*</span> Skill(audit)
          </div>
          <div className="pl-3.5">└ Successfully loaded skill</div>
          <div>
            <span className="text-teal">$</span> foresight skill demo honeypot --live
          </div>
        </div>

        <div
          className="mb-3.5 whitespace-nowrap leading-none text-teal"
          style={{
            fontFamily: "var(--font-vt323), monospace",
            fontSize: "clamp(44px, 6.5vw, 76px)",
            letterSpacing: "0.04em",
          }}
        >
          FORESIGHT SKILL
        </div>

        <div className="font-mono text-[11px] leading-[1.7] text-white/30">
          <div>
            <span className="text-green">Mode:</span> live Pharos RPC · target SimpleRouter.swap
          </div>
          <div>
            <span className="text-green">Proof:</span> buy MOON ok · non-owner exit reverted SellBlocked · owner exit ok
          </div>
          <div>
            <span className="text-red">Verdict:</span> <span className="text-white/80">DO_NOT_SIGN</span> ·{" "}
            <span className="text-red">Risk:</span> <span className="text-white/80">100 / CRITICAL</span>
          </div>
        </div>
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
      <div className="landing-footer-links grid grid-cols-1 gap-x-10 gap-y-4 px-6 pt-12 font-sans text-[17px] leading-[1.65] text-text2 sm:grid-cols-[1fr_0.72fr_0.9fr] md:px-10">
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
        <div className="content-start text-left">
          <span>Foresight {"\u00a9"} 2026</span>
        </div>
      </div>

      <BrandMark size={1320} className="footer-mega-mark" />
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
            href="/try"
            className="flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg border border-button bg-button px-5 py-3 font-sans text-base font-normal leading-5 tracking-[-0.025em] text-buttonText hover:opacity-90 max-[400px]:w-full"
          >
            Try now
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






