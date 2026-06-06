"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RiArrowRightUpLine, RiRefreshLine } from "react-icons/ri";

const fallingActions = [
  { label: "Blind approval", className: "fall-chip--approval" },
  { label: "Skip simulation", className: "fall-chip--simulation" },
  { label: "Trust calldata", className: "fall-chip--calldata" },
  { label: "No calldata decode", className: "fall-chip--decode" },
  { label: "Unknown contract", className: "fall-chip--contract" },
  { label: "Ape into $MOON", className: "fall-chip--moon" },
  { label: "Send tx anyway", className: "fall-chip--send" },
  { label: "Ignore failed exit", className: "fall-chip--exit" },
  { label: "Sign before trace", className: "fall-chip--trace" },
];

function isStageInView(stage: HTMLElement) {
  const rect = stage.getBoundingClientRect();
  const viewport = window.innerHeight || document.documentElement.clientHeight;
  const visible = Math.min(rect.bottom, viewport) - Math.max(rect.top, 0);

  return visible / Math.max(rect.height, 1) >= 0.34;
}

export function FallingActionStage() {
  const stageRef = useRef<HTMLElement | null>(null);
  const armedRef = useRef(true);
  const replayTimerRef = useRef<number | null>(null);
  const [cycle, setCycle] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const play = () => {
    if (replayTimerRef.current) {
      window.clearTimeout(replayTimerRef.current);
    }

    setIsActive(false);
    replayTimerRef.current = window.setTimeout(() => {
      setCycle((value) => value + 1);
      setIsActive(true);
    }, 80);
  };

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.isIntersecting && entry.intersectionRatio >= 0.34 && armedRef.current) {
          armedRef.current = false;
          play();
        }

        if (!entry.isIntersecting || entry.intersectionRatio <= 0.04) {
          armedRef.current = true;
          setIsActive(false);
        }
      },
      {
        threshold: [0, 0.04, 0.18, 0.34, 0.58],
      },
    );

    const replayOnReturn = () => {
      if (document.visibilityState === "visible" && isStageInView(stage)) {
        armedRef.current = false;
        play();
      }
    };

    observer.observe(stage);
    document.addEventListener("visibilitychange", replayOnReturn);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", replayOnReturn);
      if (replayTimerRef.current) {
        window.clearTimeout(replayTimerRef.current);
      }
    };
  }, []);

  return (
    <section ref={stageRef} className="relative z-10 mx-auto max-w-[1536px] px-6 pb-24 md:px-10">
      <div
        key={cycle}
        className={`fall-stage relative overflow-hidden rounded-[22px] border border-border bg-surface/30 ${
          isActive ? "fall-stage--active" : "fall-stage--idle"
        }`}
      >
        <button
          type="button"
          aria-label="Replay falling actions"
          onClick={play}
          className="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-[12px] border border-border bg-bgDeep/20 text-text3 hover:border-border2 hover:text-text1"
        >
          <RiRefreshLine className="size-5" />
        </button>

        <Link href="/demo?scenario=honeypot" className="fall-main-button">
          Run pre-flight now
          <RiArrowRightUpLine className="size-4" />
        </Link>

        {fallingActions.map((action) => (
          <span key={action.label} className={`fall-chip ${action.className}`}>
            {action.label}
            <RiArrowRightUpLine className="size-4" />
          </span>
        ))}

        <div className="fall-floor" aria-hidden />
      </div>
    </section>
  );
}