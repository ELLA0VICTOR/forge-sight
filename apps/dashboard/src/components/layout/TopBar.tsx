import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";
import { BrandMark } from "../icons/BrandMark";
import { ScenarioControls } from "./ScenarioControls";

export function TopBar() {
  return (
    <header className="relative z-10 h-[68px] border-b border-border bg-bg/92">
      <div className="mx-auto flex h-full max-w-[1536px] items-center gap-4 px-6 md:px-10">
        <div className="flex min-w-0 items-center gap-4">
          <BrandMark size={82} />
          <div className="hidden border-l border-border pl-4 sm:block">
            <div className="font-sans text-[13px] font-normal leading-none text-text1">Foresight</div>
            <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-text4">
              Pharos pre-flight layer
            </div>
          </div>
        </div>
        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <div className="inline-flex h-8 items-center gap-2 border-x border-border px-4 font-mono text-[10px] uppercase tracking-[0.08em] text-text3">
            <span className="size-1.5 rounded-full bg-green" />
            Pharos Atlantic / live contracts deployed
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ScenarioControls />
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-2 border-l border-border pl-4 font-sans text-[13px] font-normal text-text3 hover:text-text1"
          >
            <RiArrowLeftLine className="size-4" />
            <span className="hidden sm:inline">Landing</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
