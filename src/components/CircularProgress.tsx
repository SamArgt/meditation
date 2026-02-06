"use client";

interface CircularProgressProps {
  duration: number;
  elapsedSeconds: number;
  isRunning: boolean;
  isComplete?: boolean;
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
}: CircularProgressProps) {
  const totalSeconds = duration * 60;
  const progress = isComplete ? 1 : isRunning ? elapsedSeconds / totalSeconds : 0;
  const offset = CIRCUMFERENCE * (1 - progress);

  const displayTime = isComplete
    ? formatTime(totalSeconds)
    : isRunning
      ? formatTime(elapsedSeconds)
      : formatTime(totalSeconds);

  return (
    <div className="flex items-center justify-center">
      <svg
        width="280"
        height="280"
        viewBox="0 0 200 200"
        className="max-w-[280px]"
      >
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="var(--color-surface)"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
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
          className="transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
        />
        {/* Time display */}
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
