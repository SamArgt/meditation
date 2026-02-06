"use client";

import { INTERVAL_OPTIONS } from "@/lib/constants";

interface IntervalSelectorProps {
  value: number;
  maxInterval: number;
  onChange: (interval: number) => void;
}

export default function IntervalSelector({
  value,
  maxInterval,
  onChange,
}: IntervalSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-text-secondary">Intervalle</span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {INTERVAL_OPTIONS.map((option) => {
          const isDisabled = option > maxInterval;
          return (
            <button
              key={option}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(option)}
              className={`flex items-center justify-center min-w-[48px] min-h-[48px] px-3 rounded-full text-base transition-colors duration-150 ${
                isDisabled
                  ? "bg-surface text-text-secondary opacity-40 cursor-not-allowed"
                  : option === value
                    ? "bg-accent text-white"
                    : "bg-surface text-text-primary hover:bg-accent-hover hover:text-white"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <span className="text-xs text-text-secondary">minutes</span>
    </div>
  );
}
