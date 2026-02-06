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

  const init = useCallback(async () => {
    // Already initialized
    if (audioContextRef.current && isReady) return;

    // Check browser support
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      setError("Votre navigateur ne supporte pas l'audio");
      return;
    }

    try {
      // Create AudioContext lazily (must be in user gesture for mobile)
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      // Resume if suspended (iOS Safari autoplay policy)
      if (audioContextRef.current.state === "suspended") {
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
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Erreur de chargement audio";
      setError(message);
      setIsReady(false);
    }
  }, [isReady]);

  const playIntervalGong = useCallback(() => {
    if (!audioContextRef.current || !intervalBufferRef.current) return;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = intervalBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.start(audioContextRef.current.currentTime);
  }, []);

  const playEndGong = useCallback(() => {
    if (!audioContextRef.current || !endBufferRef.current) return;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = endBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.start(audioContextRef.current.currentTime);
  }, []);

  const cleanup = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    intervalBufferRef.current = null;
    endBufferRef.current = null;
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
    };
  }, []);

  return { init, playIntervalGong, playEndGong, cleanup, isReady, error };
}
