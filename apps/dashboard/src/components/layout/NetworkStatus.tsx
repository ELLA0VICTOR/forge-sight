"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StatusDot } from "./StatusDot";
import { useForesightStore } from "../../store/useForesightStore";

export function NetworkStatus() {
  const script = useForesightStore((state) => state.script);
  const baseBlock = script?.block ?? 23559136;
  const [block, setBlock] = useState(baseBlock);

  useEffect(() => {
    setBlock(baseBlock);
  }, [baseBlock]);

  useEffect(() => {
    const timer = window.setInterval(() => setBlock((value) => value + 1), 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hidden justify-center lg:flex">
      <div className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface/80 px-4 font-mono text-[11px] font-medium tabular text-text2 shadow-frame">
        <StatusDot />
        <span>PHAROS ATLANTIC</span>
        <span className="text-text4" aria-hidden>/</span>
        <span>688689</span>
        <span className="text-text4" aria-hidden>/</span>
        <motion.span
          key={block}
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          #{block.toLocaleString()}
        </motion.span>
      </div>
    </div>
  );
}
