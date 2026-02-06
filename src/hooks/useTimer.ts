import { useState, useEffect, useRef } from "react";

interface UseTimerOptions {
  duration: number; // Duration in minutes
  onComplete?: () => void;
}

interface UseTimerReturn {
  // Data
  elapsedTime: number; // Elapsed time in whole seconds
  // Status
  isRunning: boolean;
  isComplete: boolean;
  // Actions
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export default function useTimer({
  duration,
  onComplete,
}: UseTimerOptions): UseTimerReturn {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startTimeRef = useRef(0);
  const rafRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const durationSecondsRef = useRef(duration * 60);

  // Keep refs in sync with latest props via effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    durationSecondsRef.current = duration * 60;
  }, [duration]);

  // Main RAF loop + Page Visibility API
  useEffect(() => {
    if (!isRunning) return;

    function tick() {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const elapsedSeconds = Math.floor(elapsed);

      if (elapsedSeconds >= durationSecondsRef.current) {
        setElapsedTime(durationSecondsRef.current);
        setIsRunning(false);
        setIsComplete(true);
        rafRef.current = 0;
        onCompleteRef.current?.();
        return;
      }

      setElapsedTime(elapsedSeconds);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRunning]);

  function start() {
    setElapsedTime(0);
    setIsComplete(false);
    startTimeRef.current = performance.now();
    setIsRunning(true);
  }

  function stop() {
    setIsRunning(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }

  function reset() {
    setIsRunning(false);
    setIsComplete(false);
    setElapsedTime(0);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }

  return { elapsedTime, isRunning, isComplete, start, stop, reset };
}
