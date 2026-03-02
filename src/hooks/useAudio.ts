"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseAudioReturn {
  // Actions
  init: () => Promise<void>;
  playIntervalGong: () => void;
  playEndGong: () => void;
  cleanup: () => void;
  // Status
  isReady: boolean;
  error: string | null;
}

const INTERVAL_GONG_URL = "/sounds/gong-interval.mp3";
const END_GONG_URL = "/sounds/gong-end.mp3";
const AUDIO_DEBUG_PREFIX = "[meditation-audio-debug]";

async function loadBuffer(
  url: string,
  audioContext: AudioContext,
): Promise<AudioBuffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

export default function useAudio(): UseAudioReturn {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalBufferRef = useRef<AudioBuffer | null>(null);
  const endBufferRef = useRef<AudioBuffer | null>(null);
  const lastIntervalPlayRef = useRef(0);
  const MIN_INTERVAL_GAP_MS = 300;

  const init = useCallback(async () => {
    console.log(`${AUDIO_DEBUG_PREFIX} init called`, {
      hasAudioContext: Boolean(audioContextRef.current),
      isReady,
    });

    // Already initialized
    if (audioContextRef.current && isReady) {
      console.log(`${AUDIO_DEBUG_PREFIX} init skipped (already ready)`);
      return;
    }

    // Check browser support
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      console.log(`${AUDIO_DEBUG_PREFIX} AudioContext not supported`);
      setError("Votre navigateur ne supporte pas l'audio");
      return;
    }

    try {
      // Create AudioContext lazily (must be in user gesture for mobile)
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
        console.log(`${AUDIO_DEBUG_PREFIX} AudioContext created`, {
          state: audioContextRef.current.state,
        });
      }

      // Resume if suspended (iOS Safari autoplay policy)
      if (audioContextRef.current.state === "suspended") {
        console.log(`${AUDIO_DEBUG_PREFIX} resuming suspended AudioContext`);
        await audioContextRef.current.resume();
      }

      // Preload both buffers
      const [intervalBuffer, endBuffer] = await Promise.all([
        loadBuffer(INTERVAL_GONG_URL, audioContextRef.current),
        loadBuffer(END_GONG_URL, audioContextRef.current),
      ]);

      intervalBufferRef.current = intervalBuffer;
      endBufferRef.current = endBuffer;
      setIsReady(true);
      setError(null);
      console.log(`${AUDIO_DEBUG_PREFIX} buffers loaded`, {
        contextState: audioContextRef.current.state,
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Erreur de chargement audio";
      console.log(`${AUDIO_DEBUG_PREFIX} init failed`, { message });
      setError(message);
      setIsReady(false);
    }
  }, [isReady]);

  const playIntervalGong = useCallback(() => {
    if (!audioContextRef.current || !intervalBufferRef.current) {
      console.log(`${AUDIO_DEBUG_PREFIX} interval gong skipped (not ready)`, {
        hasAudioContext: Boolean(audioContextRef.current),
        hasIntervalBuffer: Boolean(intervalBufferRef.current),
      });
      return;
    }
    const now = performance.now();
    const gapMs = now - lastIntervalPlayRef.current;

    // Guard against duplicate triggers on certain mobile browsers.
    if (gapMs < MIN_INTERVAL_GAP_MS) {
      console.log(`${AUDIO_DEBUG_PREFIX} interval gong blocked by anti-duplicate guard`, {
        gapMs,
        minGapMs: MIN_INTERVAL_GAP_MS,
      });
      return;
    }
    lastIntervalPlayRef.current = now;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = intervalBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.start(audioContextRef.current.currentTime);
    console.log(`${AUDIO_DEBUG_PREFIX} interval gong started`, {
      audioTime: audioContextRef.current.currentTime,
      perfNow: now,
    });
  }, []);

  const playEndGong = useCallback(() => {
    if (!audioContextRef.current || !endBufferRef.current) {
      console.log(`${AUDIO_DEBUG_PREFIX} end gong skipped (not ready)`, {
        hasAudioContext: Boolean(audioContextRef.current),
        hasEndBuffer: Boolean(endBufferRef.current),
      });
      return;
    }
    const source = audioContextRef.current.createBufferSource();
    source.buffer = endBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.start(audioContextRef.current.currentTime);
    console.log(`${AUDIO_DEBUG_PREFIX} end gong started`, {
      audioTime: audioContextRef.current.currentTime,
      perfNow: performance.now(),
    });
  }, []);

  const cleanup = useCallback(() => {
    console.log(`${AUDIO_DEBUG_PREFIX} cleanup called`, {
      hasAudioContext: Boolean(audioContextRef.current),
    });
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    intervalBufferRef.current = null;
    endBufferRef.current = null;
    lastIntervalPlayRef.current = 0;
    setIsReady(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      intervalBufferRef.current = null;
      endBufferRef.current = null;
      lastIntervalPlayRef.current = 0;
    };
  }, []);

  return { init, playIntervalGong, playEndGong, cleanup, isReady, error };
}
