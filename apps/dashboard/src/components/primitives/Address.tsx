"use client";

import { LuCopy } from "react-icons/lu";
import { truncAddr } from "../../lib/format";

export function Address({ value, label }: { value: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => void navigator.clipboard?.writeText(value)}
      className="inline-flex items-center gap-1 border border-line-subtle bg-inset px-1.5 py-0.5 font-mono text-[11px] text-ink-secondary hover:border-line-hot hover:text-ink-primary"
      title={value}
    >
      {label ? <span className="text-ink-primary">{label}</span> : null}
      <span>{truncAddr(value)}</span>
      <LuCopy className="size-3 text-ink-tertiary" />
    </button>
  );
}
