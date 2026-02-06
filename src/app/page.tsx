"use client";

import { useState, useEffect } from "react";
import CircularProgress from "@/components/CircularProgress";
import DurationSelector from "@/components/DurationSelector";
import IntervalSelector from "@/components/IntervalSelector";
import StartButton from "@/components/StartButton";
import StopButton from "@/components/StopButton";
import {
  DEFAULT_DURATION,
  DEFAULT_INTERVAL,
  INTERVAL_OPTIONS,
} from "@/lib/constants";

export default function Home() {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [interval, setInterval] = useState(DEFAULT_INTERVAL);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Basic timer with setInterval (will be replaced by useTimer in Story 1.4)
  useEffect(() => {
    if (!isRunning) return;

    const id = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [isRunning]);

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

  function handleStart() {
    setElapsedSeconds(0);
    setIsRunning(true);
  }

  function handleStop() {
    setIsRunning(false);
    setElapsedSeconds(0);
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <main className="flex w-full max-w-[480px] flex-col items-center gap-8">
        <CircularProgress
          duration={duration}
          elapsedSeconds={elapsedSeconds}
          isRunning={isRunning}
        />

        {!isRunning && (
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
        )}

        {isRunning ? (
          <StopButton onClick={handleStop} />
        ) : (
          <StartButton onClick={handleStart} />
        )}
      </main>
    </div>
  );
}
