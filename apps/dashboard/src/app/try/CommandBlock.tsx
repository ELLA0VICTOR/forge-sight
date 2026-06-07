"use client";

import { useEffect, useState } from "react";
import { RiCheckLine, RiFileCopyLine, RiTerminalBoxLine } from "react-icons/ri";

export function CommandBlock({
  label,
  command,
  output,
}: {
  label: string;
  command: string;
  output?: string[];
}) {
  const [copied, setCopied] = useState(false);

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
    <section className="overflow-hidden rounded-[14px] border border-border bg-bgDeep/80">
      <div className="flex min-h-11 items-center justify-between gap-3 border-b border-border px-4">
        <div className="flex min-w-0 items-center gap-2 text-[12px] text-text3">
          <RiTerminalBoxLine className="size-4 shrink-0" />
          <span className="truncate">{label}</span>
        </div>
        <button
          type="button"
          onClick={copyCommand}
          className="inline-flex h-8 shrink-0 items-center gap-2 border border-border px-3 text-[11px] text-text3 hover:border-border2 hover:text-text1"
        >
          {copied ? <RiCheckLine className="size-4 text-green" /> : <RiFileCopyLine className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
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
