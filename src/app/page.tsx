"use client";

import { useState, useEffect, useRef } from "react";
import CircularProgress from "@/components/CircularProgress";
import DurationSelector from "@/components/DurationSelector";
import IntervalSelector from "@/components/IntervalSelector";
import StartButton from "@/components/StartButton";
import StopButton from "@/components/StopButton";
import useTimer from "@/hooks/useTimer";
import {
  DEFAULT_DURATION,
  DEFAULT_INTERVAL,
  INTERVAL_OPTIONS,
} from "@/lib/constants";

const SESSION_END_DELAY = 3000;

export default function Home() {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [interval, setInterval] = useState(DEFAULT_INTERVAL);
  const [showEndMessage, setShowEndMessage] = useState(false);

  function handleSessionEnd() {
    setShowEndMessage(true);
  }

  const timer = useTimer({ duration, onComplete: handleSessionEnd });
  const timerResetRef = useRef(timer.reset);

  useEffect(() => {
    timerResetRef.current = timer.reset;
  }, [timer.reset]);

  // Auto-return to rest after 3 seconds when session ends
  useEffect(() => {
    if (!showEndMessage) return;

    const id = window.setTimeout(() => {
      timerResetRef.current();
      setShowEndMessage(false);
    }, SESSION_END_DELAY);

    return () => window.clearTimeout(id);
  }, [showEndMessage]);

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
    timer.start();
  }

  function handleStop() {
    timer.stop();
    timer.reset();
  }

  const isActive = timer.isRunning || showEndMessage;

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <main className="flex w-full max-w-[480px] flex-col items-center gap-8">
        <CircularProgress
          duration={duration}
          elapsedSeconds={timer.elapsedTime}
          isRunning={timer.isRunning}
          isComplete={timer.isComplete}
        />

        {showEndMessage && (
          <p
            aria-live="polite"
            className="text-center text-lg text-text-secondary transition-opacity duration-300"
          >
            Session terminée
          </p>
        )}

        {!isActive && (
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

        {!showEndMessage &&
          (timer.isRunning ? (
            <StopButton onClick={handleStop} />
          ) : (
            <StartButton onClick={handleStart} />
          ))}
      </main>
    </div>
  );
}
