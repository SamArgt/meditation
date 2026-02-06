"use client";

import { DURATION_OPTIONS } from "@/lib/constants";

interface DurationSelectorProps {
  value: number;
  onChange: (duration: number) => void;
}

export default function DurationSelector({
  value,
  onChange,
}: DurationSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-text-secondary">Durée</span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {DURATION_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex items-center justify-center min-w-[48px] min-h-[48px] px-3 rounded-full text-base transition-colors duration-150 ${
              option === value
                ? "bg-accent text-white"
                : "bg-surface text-text-primary hover:bg-accent-hover hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <span className="text-xs text-text-secondary">minutes</span>
    </div>
  );
}
