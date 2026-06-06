import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";
import { BrandMark } from "../icons/BrandMark";

export function TopBar() {
  return (
    <header className="relative z-10 h-[76px] border-b border-border bg-bg/90">
      <div className="mx-auto flex h-full max-w-[1536px] items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-4">
          <BrandMark size={98} />
          <div className="hidden border-l border-border pl-4 sm:block">
            <div className="font-sans text-[13px] font-semibold text-text2">Demo</div>
            <div className="mt-1 font-mono text-[11px] text-text4">fixture replay</div>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 rounded-[14px] border border-border bg-surface px-4 font-sans text-[14px] font-semibold text-text2 hover:border-border2 hover:text-text1"
        >
          <RiArrowLeftLine className="size-4" />
          Landing
        </Link>
      </div>
    </header>
  );
}
