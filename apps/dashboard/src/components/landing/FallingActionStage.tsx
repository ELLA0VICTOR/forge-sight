"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RiArrowRightUpLine, RiRefreshLine } from "react-icons/ri";

const fallingActions = [
  {
    label: "Blind approval",
    className: "fall-chip--approval",
  },
  {
    label: "Skip simulation",
    className: "fall-chip--simulation",
  },
  {
    label: "Unknown contract",
    className: "fall-chip--contract",
  },
  {
    label: "Ape into $MOON",
    className: "fall-chip--moon",
  },
  {
    label: "Send tx anyway",
    className: "fall-chip--send",
  },
  {
    label: "Trust calldata",
    className: "fall-chip--calldata",
  },
  {
    label: "Ignore failed exit",
    className: "fall-chip--exit",
  },
];

export function FallingActionStage() {
  const stageRef = useRef<HTMLElement | null>(null);
  const [cycle, setCycle] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.38 && !hasPlayed) {
          setCycle((value) => value + 1);
          setIsActive(true);
          setHasPlayed(true);
        }
      },
      {
        threshold: [0, 0.24, 0.38, 0.62],
      },
    );

    observer.observe(stage);

    return () => observer.disconnect();
  }, [hasPlayed]);

  const replay = () => {
    setIsActive(false);
    window.setTimeout(() => {
      setCycle((value) => value + 1);
      setIsActive(true);
      setHasPlayed(true);
    }, 60);
  };

  return (
    <section ref={stageRef} className="relative z-10 mx-auto max-w-[1536px] px-6 pb-28 md:px-10">
      <div
        key={cycle}
        className={`fall-stage relative overflow-hidden rounded-[24px] border border-border bg-surface/30 ${
          isActive ? "fall-stage--active" : "fall-stage--idle"
        }`}
      >
        <button
          type="button"
          aria-label="Replay falling actions"
          onClick={replay}
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