"use client";

import { useState, useEffect, useRef } from "react";
import CircularProgress from "@/components/CircularProgress";
import PreStartDial from "@/components/PreStartDial";
import DurationSelector from "@/components/DurationSelector";
import IntervalSelector from "@/components/IntervalSelector";
import StartButton from "@/components/StartButton";
import StopButton from "@/components/StopButton";
import GongIndicators from "@/components/GongIndicators";
import useTimer from "@/hooks/useTimer";
import useAudio from "@/hooks/useAudio";
import useWakeLock from "@/hooks/useWakeLock";
import {
  DEFAULT_DURATION,
  DEFAULT_INTERVAL,
  INTERVAL_OPTIONS,
} from "@/lib/constants";
import { loadSettings, saveSettings } from "@/lib/storage";

const SESSION_END_DELAY = 3000;
const PREP_COUNTDOWN_SECONDS = 5;

export default function Home() {
  const [duration, setDuration] = useState(() => {
    const saved = loadSettings();
    return saved?.duration ?? DEFAULT_DURATION;
  });
  const [interval, setInterval] = useState(() => {
    const saved = loadSettings();
    if (!saved) return DEFAULT_INTERVAL;
    return Math.min(saved.interval, saved.duration);
  });
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [prepCountdown, setPrepCountdown] = useState<number | null>(null);

  // Auto-save settings on every change
  useEffect(() => {
    saveSettings({ duration, interval });
  }, [duration, interval]);

  function handleSessionEnd() {
    audio.playEndGong();
    setShowEndMessage(true);
  }

  const timer = useTimer({ duration, onComplete: handleSessionEnd });
  const audio = useAudio();
  const wakeLock = useWakeLock();
  const timerResetRef = useRef(timer.reset);
  const timerStartRef = useRef(timer.start);
  const playStartGongRef = useRef(audio.playIntervalGong);
  const lastGongIndexRef = useRef(-1);
  const progressRef = useRef<SVGCircleElement>(null);

  const totalGongs =
    duration % interval === 0
      ? duration / interval - 1
      : Math.floor(duration / interval);

  const completedGongs = Math.min(
    Math.floor(timer.elapsedTime / (interval * 60)),
    totalGongs,
  );

  const isPreparing = prepCountdown !== null;
  const isActive = timer.isRunning || showEndMessage || isPreparing;

  const audioUnavailable =
    audio.error !== null && !audio.isReady && (timer.isRunning || isPreparing);

  useEffect(() => {
    if (prepCountdown === null) return;

    const id = window.setTimeout(() => {
      setPrepCountdown((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          timerStartRef.current();
          playStartGongRef.current();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearTimeout(id);
  }, [prepCountdown]);

  useEffect(() => {
    timerResetRef.current = timer.reset;
  }, [timer.reset]);

  useEffect(() => {
    timerStartRef.current = timer.start;
  }, [timer.start]);

  useEffect(() => {
    playStartGongRef.current = audio.playIntervalGong;
  }, [audio.playIntervalGong]);

  // Interval gong triggering
  useEffect(() => {
    if (!timer.isRunning) return;

    const intervalSeconds = interval * 60;
    const durationSeconds = duration * 60;

    // Anti-double-gong: don't trigger interval gong at session end
    if (timer.elapsedTime >= durationSeconds) return;

    const currentGongIndex = Math.floor(timer.elapsedTime / intervalSeconds);

    if (
      currentGongIndex > lastGongIndexRef.current &&
      currentGongIndex > 0 &&
      currentGongIndex <= totalGongs
    ) {
      if (audio.isReady) {
        audio.playIntervalGong();
      } else if (audio.error !== null && progressRef.current) {
        // Visual flash fallback — imperative DOM manipulation (no setState)
        const circle = progressRef.current;
        circle.setAttribute("stroke-width", "6");
        circle.style.opacity = "0.7";
        setTimeout(() => {
          circle.setAttribute("stroke-width", "4");
          circle.style.opacity = "1";
        }, 500);
      }
      lastGongIndexRef.current = currentGongIndex;
    }
  }, [timer.elapsedTime, timer.isRunning, interval, duration, audio, totalGongs]);

  // Auto-return to rest after 3 seconds when session ends
  useEffect(() => {
    if (!showEndMessage) return;

    const id = window.setTimeout(() => {
      timerResetRef.current();
      setShowEndMessage(false);
      audio.cleanup();
      wakeLock.release();
    }, SESSION_END_DELAY);

    return () => window.clearTimeout(id);
  }, [showEndMessage, audio, wakeLock]);

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

  async function handleStart() {
    lastGongIndexRef.current = -1;
    await audio.init();
    wakeLock.request();
    setPrepCountdown(PREP_COUNTDOWN_SECONDS);
  }

  function handleStop() {
    lastGongIndexRef.current = -1;
    setPrepCountdown(null);
    timer.stop();
    timer.reset();
    audio.cleanup();
    wakeLock.release();
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <main className="flex w-full max-w-[480px] flex-col items-center gap-8">
        {isActive ? (
          <CircularProgress
            duration={duration}
            elapsedSeconds={timer.elapsedTime}
            isRunning={timer.isRunning}
            isComplete={timer.isComplete}
            progressRef={progressRef}
            prepSeconds={prepCountdown}
          />
        ) : (
          <PreStartDial duration={duration} interval={interval} />
        )}

        {isPreparing && (
          <p className="text-center text-sm text-text-secondary">Préparation…</p>
        )}

        {timer.isRunning && (
          <GongIndicators
            totalGongs={totalGongs}
            completedGongs={completedGongs}
          />
        )}

        {audioUnavailable && (
          <p className="text-center text-sm text-text-secondary">
            Son indisponible
          </p>
        )}

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
          (timer.isRunning || isPreparing ? (
            <StopButton onClick={handleStop} />
          ) : (
            <StartButton onClick={handleStart} />
          ))}
      </main>
    </div>
  );
}
