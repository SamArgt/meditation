"use client";

import { useState } from "react";
import DurationSelector from "@/components/DurationSelector";
import IntervalSelector from "@/components/IntervalSelector";
import {
  DEFAULT_DURATION,
  DEFAULT_INTERVAL,
  INTERVAL_OPTIONS,
} from "@/lib/constants";

export default function Home() {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [interval, setInterval] = useState(DEFAULT_INTERVAL);

  function handleDurationChange(newDuration: number) {
    setDuration(newDuration);
    if (interval > newDuration) {
      const validOptions = INTERVAL_OPTIONS.filter((o) => o <= newDuration);
      setInterval(validOptions[validOptions.length - 1]);
    }
  }

  function handleIntervalChange(newInterval: number) {
    if (newInterval <= duration) {
      setInterval(newInterval);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <main className="flex w-full max-w-[480px] flex-col items-center gap-8">
        <h1 className="font-serif text-5xl font-light text-text-primary">
          Meditation
        </h1>
        <p className="text-center text-text-secondary">
          Timer de méditation minimaliste
        </p>

        <div className="flex w-full flex-col items-center gap-8">
          <DurationSelector
            value={duration}
            onChange={handleDurationChange}
          />
          <IntervalSelector
            value={interval}
            maxInterval={duration}
            onChange={handleIntervalChange}
          />
        </div>
      </main>
    </div>
  );
}
