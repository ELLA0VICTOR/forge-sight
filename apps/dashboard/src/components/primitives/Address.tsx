"use client";

import { useEffect, useState } from "react";
import { RiCheckLine, RiFileCopyLine } from "react-icons/ri";
import { truncAddr } from "../../lib/format";

export function Address({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(value);
        setCopied(true);
      }}
      className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface2 px-2.5 font-mono text-[11px] font-normal tabular text-text2 hover:border-border2 hover:text-text1"
      title={copied ? "Copied" : value}
    >
      {label ? <span className="text-text1">{label}</span> : null}
      <span>{truncAddr(value)}</span>
      {copied ? <RiCheckLine className="size-3.5 text-green" /> : <RiFileCopyLine className="size-3.5 text-text3" />}
    </button>
  );
}
