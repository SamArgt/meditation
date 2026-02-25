"use client";

import { DURATION_OPTIONS } from "@/lib/constants";

interface PreStartDialProps {
  duration: number;
  interval: number;
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

export default function PreStartDial({ duration, interval }: PreStartDialProps) {
  const intervalMarks = Array.from(
    { length: Math.floor(duration / interval) },
    (_, i) => (i + 1) * interval,
  ).filter((m) => m < duration);

  const cursor = polarToCartesian(RADIUS, dialAngle(duration));

  return (
    <div className="flex items-center justify-center">
      <svg width="280" height="280" viewBox="0 0 200 200" className="max-w-[280px]">
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

        <text
          x={CENTER}
          y={CENTER - 8}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-text-primary font-serif text-[42px] font-light"
        >
          {duration}
        </text>
        <text
          x={CENTER}
          y={CENTER + 20}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-text-secondary text-[14px]"
        >
          min • gong / {interval} min
        </text>
      </svg>
    </div>
  );
}
