"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  RiArrowLeftLine,
  RiBookOpenLine,
  RiCodeBoxLine,
  RiMoonLine,
  RiSearchLine,
  RiSparklingLine,
  RiSunLine,
} from "react-icons/ri";
import { BrandMark } from "../../components/icons/BrandMark";
import { CommandBlock } from "./CommandBlock";

const installCommand = "corepack pnpm install && corepack pnpm -r build";
const safeTransferCommand =
  "corepack pnpm --filter @foresight/cli dev -- skill check --from <wallet> --to <recipient> --data 0x --value <wei> --mode live";
const honeypotCommand = "corepack pnpm --filter @foresight/cli dev -- skill demo honeypot --live";
const happySwapCommand = "corepack pnpm --filter @foresight/cli dev -- skill demo happy-path --live";
const genericCheckCommand =
  "corepack pnpm --filter @foresight/cli dev -- skill check --from <wallet> --to <contract_or_recipient> --data <calldata> --value <wei> --mode live";
const windowsMcpConfig = `{
  "mcpServers": {
    "foresight": {
      "command": "cmd",
      "args": [
        "/c",
        "cd /d C:\\\\path\\\\to\\\\foresight && node packages\\\\mcp\\\\dist\\\\index.js"
      ]
    }
  }
}`;
const unixMcpConfig = `{
  "mcpServers": {
    "foresight": {
      "command": "sh",
      "args": [
        "-lc",
        "cd /path/to/foresight && node packages/mcp/dist/index.js"
      ]
    }
  }
}`;
const claudePrompt = `Use the Foresight MCP tool to assess this Pharos transaction before signing.

from: <wallet>
to: <contract_or_recipient>
data: <calldata>
value: <wei>`;

const sections = [
  {
    id: "overview",
    group: "Introduction",
    label: "Overview",
    title: "Pre-flight safety for Pharos agents",
    description: "What Foresight is and the verdict it returns before signing.",
  },
  {
    id: "paths",
    group: "Introduction",
    label: "Choose your path",
    title: "Use CLI for proof, MCP for agents",
    description: "When to use the terminal and when to connect an AI agent.",
  },
  {
    id: "live",
    group: "Introduction",
    label: "What is live",
    title: "What counts as real",
    description: "What is simulated, what is deployed, and what is never broadcast.",
  },
  {
    id: "install",
    group: "Getting Started",
    label: "Install",
    title: "Install and build the workspace",
    description: "The one-time setup command for a cloned repository.",
  },
  {
    id: "cli",
    group: "Getting Started",
    label: "CLI checks",
    title: "Run live Pharos checks from terminal",
    description: "Manual commands for safe transfers, swaps, and honeypot refusal.",
  },
  {
    id: "mcp",
    group: "Getting Started",
    label: "MCP for agents",
    title: "Connect Foresight to Claude Desktop",
    description: "Make Foresight available as an agent-callable MCP tool.",
  },
  {
    id: "transactions",
    group: "Getting Started",
    label: "Real transactions",
    title: "Check any wallet or dapp intent",
    description: "Fields to copy from a wallet or dapp before signing.",
  },
  {
    id: "tools",
    group: "Reference",
    label: "MCP tools",
    title: "MCP tools exposed",
    description: "The four tool names available to MCP clients.",
  },
  {
    id: "troubleshooting",
    group: "Reference",
    label: "Troubleshooting",
    title: "Common MCP setup issues",
    description: "Fix stdout JSON errors, missing tools, and path mistakes.",
  },
];

const sectionGroups = ["Introduction", "Getting Started", "Reference"];

const lightThemeVars = {
  "--bg": "#f7f5f9",
  "--bg-deep": "#ffffff",
  "--surface": "#f0edf4",
  "--surface-2": "#e8e4ed",
  "--surface-3": "#ded9e6",
  "--border": "#d7d1df",
  "--border-2": "#bfb6cd",
  "--text-1": "#17131d",
  "--text-2": "#4f485a",
  "--text-3": "#766f80",
  "--text-4": "#9a92a6",
  "--button": "#17131d",
  "--button-text": "#ffffff",
} as React.CSSProperties;

function DocSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border py-10 last:border-b-0">
      <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-violet">{eyebrow}</div>
      <h2 className="mt-3 text-[clamp(28px,4vw,46px)] font-semibold leading-[1.05] tracking-[-0.055em] text-text1">
        {title}
      </h2>
      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="max-w-[72ch] text-[17px] leading-8 tracking-[-0.025em] text-text2">{children}</p>;
}

function MiniCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[14px] border border-border bg-bgDeep/70 p-5">
      <h3 className="text-[14px] font-semibold text-text1">{title}</h3>
      <div className="mt-3 text-[14px] leading-7 text-text3">{children}</div>
    </div>
  );
}

function SideLink({ href, children, active = false }: { href: string; children: ReactNode; active?: boolean }) {
  return (
    <a
      href={href}
      className={`block py-2 text-[14px] leading-6 transition-colors ${
        active ? "font-semibold text-violet" : "text-text3 hover:text-text1"
      }`}
    >
      {children}
    </a>
  );
}

export default function TryPage() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("overview");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const searchRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLElement>(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return sections.filter((section) =>
      `${section.label} ${section.title} ${section.description} ${section.group}`.toLowerCase().includes(needle),
    );
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const root = shellRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { root, rootMargin: "-22% 0px -62% 0px", threshold: [0.08, 0.2, 0.45] },
    );
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  function jumpTo(id: string) {
    setActiveId(id);
    setQuery("");
    document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function onSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results[0]) jumpTo(results[0].id);
  }

  return (
    <main
      ref={shellRef}
      className="v12-shell h-screen overflow-y-auto text-text1"
      style={{
        ...(theme === "light" ? lightThemeVars : null),
        fontFamily: '"SUSE Mono", var(--font-mono), monospace',
      }}
    >
      <header className="sticky top-0 z-30 border-b border-border bg-bg/92 backdrop-blur">
        <div className="mx-auto flex h-[82px] max-w-[1320px] items-center gap-5 px-6">
          <Link href="/" className="flex items-center gap-4">
            <BrandMark size={74} />
            <span className="text-[20px] font-semibold tracking-[-0.04em] text-text1">Foresight Docs</span>
          </Link>

          <form onSubmit={onSearchSubmit} className="relative mx-auto hidden w-full max-w-[390px] md:block">
            <div className="flex h-10 items-center gap-3 rounded-[14px] border border-border bg-bgDeep/80 px-4 text-[13px] text-text4">
              <RiSearchLine className="size-4" />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search..."
                className="min-w-0 flex-1 bg-transparent text-text1 outline-none placeholder:text-text4"
              />
              <span className="text-[11px] text-text4">Ctrl K</span>
            </div>
            {query ? (
              <div className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-[14px] border border-border bg-bgDeep shadow-frame">
                {results.length ? (
                  results.slice(0, 5).map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => jumpTo(section.id)}
                      className="block w-full border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-surface"
                    >
                      <div className="text-[13px] font-semibold text-text1">{section.label}</div>
                      <div className="mt-1 text-[12px] leading-5 text-text3">{section.description}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-[13px] text-text3">No matching section.</div>
                )}
              </div>
            ) : null}
          </form>

          <nav className="ml-auto hidden items-center gap-5 text-[13px] text-text3 md:flex">
            <Link href="/" className="hover:text-text1">
              Back
            </Link>
            <a
              href="https://github.com/ELLA0VICTOR/foresight"
              target="_blank"
              rel="noreferrer"
              className="hover:text-text1"
            >
              GitHub
            </a>
            <button
              type="button"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              className="grid size-9 place-items-center rounded-[10px] border border-border hover:border-border2 hover:text-text1"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <RiMoonLine className="size-4" /> : <RiSunLine className="size-4" />}
            </button>
          </nav>
        </div>

        <div className="mx-auto flex h-14 max-w-[1320px] items-end gap-8 px-6">
          <button
            type="button"
            onClick={() => jumpTo("overview")}
            className={`flex h-full items-center gap-2 border-b-2 pr-2 text-[14px] font-semibold ${
              ["overview", "paths", "live"].includes(activeId)
                ? "border-violet text-violet"
                : "border-transparent text-text3 hover:text-text1"
            }`}
          >
            <RiBookOpenLine className="size-5" />
            Documentation
          </button>
          <button
            type="button"
            onClick={() => jumpTo("install")}
            className={`flex h-full items-center gap-2 border-b-2 pr-2 text-[14px] font-semibold ${
              ["install", "cli", "mcp", "transactions", "tools", "troubleshooting"].includes(activeId)
                ? "border-violet text-violet"
                : "border-transparent text-text3 hover:text-text1"
            }`}
          >
            <RiCodeBoxLine className="size-5" />
            Developers
          </button>
          <Link
            href="/"
            className="ml-auto mb-3 inline-flex h-8 items-center gap-2 border border-border px-3 text-[12px] text-text3 hover:border-border2 hover:text-text1 md:hidden"
          >
            <RiArrowLeftLine className="size-4" />
            Back
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1320px] gap-8 px-6 lg:grid-cols-[250px_minmax(0,1fr)_230px]">
        <aside className="hidden border-r border-border py-10 lg:block">
          <div className="sticky top-32 pr-8">
            {sectionGroups.map((group) => (
              <div key={group} className={group === "Introduction" ? "" : "mt-10"}>
                <div className="mb-5 text-[13px] font-semibold uppercase tracking-[-0.02em] text-text1">{group}</div>
                {sections
                  .filter((section) => section.group === group)
                  .map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => jumpTo(section.id)}
                      className={`block py-2 text-left text-[14px] leading-6 transition-colors ${
                        activeId === section.id ? "font-semibold text-violet" : "text-text3 hover:text-text1"
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </aside>

        <article className="min-w-0 py-10">
          <DocSection id="overview" eyebrow="Introduction" title="Pre-flight safety for Pharos agents">
            <Paragraph>
              Foresight is a Pharos Agent Center skill for checking transactions before an AI agent signs them. It accepts
              the same transaction fields a wallet would sign, simulates the intent on Pharos, and returns a clear verdict:
              <span className="text-text1"> SIGN</span>, <span className="text-text1">REVIEW</span>, or{" "}
              <span className="text-text1">DO_NOT_SIGN</span>.
            </Paragraph>
            <div className="grid gap-4 md:grid-cols-3">
              <MiniCard title="Decode">Reads calldata and identifies known Pharos demo contracts when ABI data exists.</MiniCard>
              <MiniCard title="Simulate">Runs live pre-flight checks through Pharos RPC without broadcasting funds.</MiniCard>
              <MiniCard title="Decide">Returns risk score, findings, and agent-readable safety guidance.</MiniCard>
            </div>
          </DocSection>

          <DocSection id="paths" eyebrow="Choose your path" title="Use CLI for proof, MCP for agents">
            <div className="grid gap-4 md:grid-cols-2">
              <MiniCard title="CLI">
                Manual checks and terminal demos.
              </MiniCard>
              <MiniCard title="MCP">
                Agent-callable tool for Claude, Cursor, Codex, and other MCP clients.
              </MiniCard>
            </div>
          </DocSection>

          <DocSection id="live" eyebrow="Reality check" title="What counts as real">
            <Paragraph>
              Foresight does not send transactions. That is intentional. It is a pre-sign guardrail. The real part is the
              live Pharos RPC simulation and the deployed Pharos Atlantic testnet contracts used for proof.
            </Paragraph>
            <div className="grid gap-px overflow-hidden rounded-[14px] border border-border bg-border">
              {[
                ["Real", "Live RPC calls, current blocks, deployed demo contracts, CLI checks, and MCP tool calls."],
                ["Not broadcast", "No funds move during a Foresight check. The skill tells the agent whether it should sign."],
                ["Replay", "The web replay viewer is presentation only. CLI and MCP are the actual skill paths."],
              ].map(([label, text]) => (
                <div key={label} className="grid gap-2 bg-bgDeep/85 p-4 sm:grid-cols-[130px_1fr]">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text2">{label}</div>
                  <div className="text-[14px] leading-7 text-text3">{text}</div>
                </div>
              ))}
            </div>
          </DocSection>

          <DocSection id="install" eyebrow="Setup" title="Install and build the workspace">
            <Paragraph>Run this once after cloning the repository.</Paragraph>
            <CommandBlock label="install" command={installCommand} />
          </DocSection>

          <DocSection id="cli" eyebrow="CLI" title="Run live Pharos checks from terminal">
            <CommandBlock
              label="safe native transfer"
              command={safeTransferCommand}
              output={["Expected: SIGN", "Risk: 0 / SAFE", "Proof: live Pharos RPC simulation completed"]}
            />
            <CommandBlock
              label="honeypot refusal"
              command={honeypotCommand}
              output={[
                "Expected: DO_NOT_SIGN",
                "Risk: 100 / CRITICAL",
                "Proof: buy succeeds, normal sell reverts, owner sell succeeds",
              ]}
            />
            <CommandBlock
              label="safe router swap"
              command={happySwapCommand}
              output={["Expected: SIGN", "Uses deployed SimpleRouter on Pharos Atlantic"]}
            />
          </DocSection>

          <DocSection id="mcp" eyebrow="MCP" title="Connect Foresight to Claude Desktop">
            <Paragraph>
              Build the workspace first, then add one config to your MCP client. Replace the path with the cloned repo.
            </Paragraph>
            <CommandBlock label="Claude Desktop config - Windows" command={windowsMcpConfig} />
            <CommandBlock label="Claude Desktop config - macOS / Linux" command={unixMcpConfig} />
            <CommandBlock label="Agent test prompt" command={claudePrompt} />
          </DocSection>

          <DocSection id="transactions" eyebrow="Real transactions" title="Check any wallet or dapp intent">
            <Paragraph>
              For a real dapp swap, approval, contract write, or native transfer, copy the wallet preview fields before
              signing. Foresight needs the transaction&apos;s <span className="text-text1">from</span>,{" "}
              <span className="text-text1">to</span>, <span className="text-text1">data</span>, and{" "}
              <span className="text-text1">value</span>.
            </Paragraph>
            <CommandBlock label="generic live check" command={genericCheckCommand} />
          </DocSection>

          <DocSection id="tools" eyebrow="Reference" title="MCP tools exposed">
            <div className="grid gap-3">
              {[
                ["foresight_assess_risk", "Short verdict and risk findings. Best default before signing."],
                ["foresight_simulate", "Full report with decoded intent, findings, telemetry, and explanation."],
                ["foresight_explain", "Plain-English calldata explanation when ABI support is available."],
                ["foresight_diagnose", "Failed transaction autopsy by transaction hash."],
              ].map(([name, text]) => (
                <div key={name} className="border-b border-border pb-3 last:border-b-0">
                  <div className="text-[14px] font-semibold text-text1">{name}</div>
                  <div className="mt-1 text-[14px] leading-7 text-text3">{text}</div>
                </div>
              ))}
            </div>
          </DocSection>

          <DocSection id="troubleshooting" eyebrow="Troubleshooting" title="Common MCP setup issues">
            <div className="grid gap-4">
              <MiniCard title="Unexpected token in JSON">
                Run the built server with <span className="text-text1">node packages/mcp/dist/index.js</span>. Avoid{" "}
                <span className="text-text1">pnpm dev</span> in Claude Desktop because package-manager logs can pollute
                MCP stdout.
              </MiniCard>
              <MiniCard title="Claude cannot find the tool">
                Fully quit Claude Desktop from the system tray after editing the config, then reopen a new chat.
              </MiniCard>
              <MiniCard title="Path does not work">
                Use an absolute path to the cloned repository. On Windows, keep backslashes escaped inside JSON.
              </MiniCard>
            </div>
          </DocSection>
        </article>

        <aside className="hidden py-10 xl:block">
          <div className="sticky top-32 pl-4">
            <div className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-text1">
              <RiSparklingLine className="size-4" />
              On this page
            </div>
            {sections.slice(0, 7).map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => jumpTo(section.id)}
                className={`block py-2 text-left text-[14px] leading-6 transition-colors ${
                  activeId === section.id ? "font-semibold text-violet" : "text-text3 hover:text-text1"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
