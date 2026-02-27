"use client";

import type { PointerEvent } from "react";
import { DURATION_OPTIONS } from "@/lib/constants";

interface PreStartDialProps {
  duration: number;
  interval: number;
  onDurationChange: (value: number) => void;
  onIntervalChange: (value: number) => void;
}

const RADIUS = 90;
const CENTER = 100;
const MAX_DURATION = Math.max(...DURATION_OPTIONS);

function polarToCartesian(radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  };
}

function dialAngle(minutes: number): number {
  return (minutes / MAX_DURATION) * 360;
}

function angleFromPoint(x: number, y: number) {
  const dx = x - CENTER;
  const dy = y - CENTER;
  const radians = Math.atan2(dy, dx);
  return ((radians * 180) / Math.PI + 90 + 360) % 360;
}

function minuteFromAngle(angle: number): number {
  const rawMinutes = Math.round((angle / 360) * MAX_DURATION);
  return Math.min(Math.max(rawMinutes, 1), MAX_DURATION);
}

export default function PreStartDial({
  duration,
  interval,
  onDurationChange,
  onIntervalChange,
}: PreStartDialProps) {
  const intervalMarks = Array.from(
    { length: Math.floor(duration / interval) },
    (_, i) => (i + 1) * interval,
  ).filter((m) => m < duration);

  const cursor = polarToCartesian(RADIUS, dialAngle(duration));
  const intervalCursor = polarToCartesian(RADIUS - 16, dialAngle(interval));

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!(event.buttons & 1) && event.pointerType !== "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 200;
    const y = ((event.clientY - rect.top) / rect.height) * 200;
    const radius = Math.hypot(x - CENTER, y - CENTER);
    const angle = angleFromPoint(x, y);
    const minutes = minuteFromAngle(angle);

    // Outer ring controls total duration, inner ring controls interval.
    if (radius >= RADIUS - 12) {
      const nearestDuration = DURATION_OPTIONS.reduce((best, option) =>
        Math.abs(option - minutes) < Math.abs(best - minutes) ? option : best,
      );
      onDurationChange(nearestDuration);
      return;
    }

    if (radius >= RADIUS - 32) {
      const safeMinutes = Math.min(minutes, duration);
      onIntervalChange(Math.max(safeMinutes, 1));
    }
  }

  return (
    <div className="flex items-center justify-center">
      <svg
        width="280"
        height="280"
        viewBox="0 0 200 200"
        className="max-w-[280px] touch-none"
        onPointerDown={handlePointerMove}
        onPointerMove={handlePointerMove}
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="var(--color-surface)"
          strokeWidth="2"
        />

        {Array.from({ length: MAX_DURATION }, (_, i) => {
          const minute = i + 1;
          const isFiveMinuteMark = minute % 5 === 0;
          const outer = polarToCartesian(RADIUS + (isFiveMinuteMark ? 1 : 0), dialAngle(minute));
          const inner = polarToCartesian(
            RADIUS - (isFiveMinuteMark ? 8 : 4),
            dialAngle(minute),
          );

          return (
            <line
              key={minute}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="var(--color-text-secondary)"
              strokeOpacity={isFiveMinuteMark ? "0.7" : "0.35"}
              strokeWidth={isFiveMinuteMark ? "1.5" : "1"}
            />
          );
        })}

        {intervalMarks.map((mark) => {
          const point = polarToCartesian(RADIUS - 14, dialAngle(mark));
          return (
            <circle
              key={mark}
              cx={point.x}
              cy={point.y}
              r="2.5"
              fill="var(--color-accent)"
              opacity="0.8"
            />
          );
        })}

        <circle cx={cursor.x} cy={cursor.y} r="6" fill="var(--color-accent)" />
        <circle
          cx={intervalCursor.x}
          cy={intervalCursor.y}
          r="4"
          fill="var(--color-text-secondary)"
          opacity="0.85"
        />

        <text
          x={CENTER}
          y={CENTER - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-text-primary font-serif font-light"
        >
          <tspan x={CENTER} dy="-9" className="text-[48px]">
            {duration}
          </tspan>
          <tspan x={CENTER} dy="38" className="text-[24px] fill-text-secondary">
            min
          </tspan>
        </text>
      </svg>
    </div>
  );
}
