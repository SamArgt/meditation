"use client";

import { type RefObject } from "react";

interface CircularProgressProps {
  duration: number;
  elapsedSeconds: number;
  isRunning: boolean;
  isComplete?: boolean;
  progressRef?: RefObject<SVGCircleElement | null>;
  prepSeconds?: number | null;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CircularProgress({
  duration,
  elapsedSeconds,
  isRunning,
  isComplete = false,
  progressRef,
  prepSeconds = null,
}: CircularProgressProps) {
  const totalSeconds = duration * 60;
  const progress = isComplete ? 1 : isRunning ? elapsedSeconds / totalSeconds : 0;
  const offset = CIRCUMFERENCE * progress;

  const remainingSeconds = Math.max(totalSeconds - elapsedSeconds, 0);
  const displayTime = prepSeconds !== null ? formatTime(prepSeconds) : formatTime(remainingSeconds);

  return (
    <div className="flex items-center justify-center">
      <svg
        width="280"
        height="280"
        viewBox="0 0 200 200"
        className="max-w-[280px]"
      >
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="var(--color-surface)"
          strokeWidth="4"
        />
        <circle
          ref={progressRef}
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          className="transition-all duration-300 ease-linear motion-reduce:transition-[stroke-dashoffset]"
        />
        <text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-text-primary font-serif text-[48px] font-light"
        >
          {displayTime}
        </text>
      </svg>
    </div>
  );
}
