"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseWakeLockReturn {
  // Actions
  request: () => Promise<void>;
  release: () => void;
  // Status
  isActive: boolean;
  isSupported: boolean;
  error: string | null;
}

export default function useWakeLock(): UseWakeLockReturn {
  const [isActive, setIsActive] = useState(false);
  const [isSupported] = useState(
    () => typeof window !== "undefined" && "wakeLock" in navigator,
  );
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const wantLockRef = useRef(false);

  const request = useCallback(async () => {
    if (!isSupported) return;

    wantLockRef.current = true;

    try {
      const sentinel = await navigator.wakeLock.request("screen");
      sentinelRef.current = sentinel;
      setIsActive(true);
      setError(null);

      sentinel.addEventListener("release", () => {
        sentinelRef.current = null;
        setIsActive(false);
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Erreur Wake Lock";
      setError(message);
      setIsActive(false);
    }
  }, [isSupported]);

  const release = useCallback(() => {
    wantLockRef.current = false;

    if (sentinelRef.current) {
      sentinelRef.current.release();
      sentinelRef.current = null;
      setIsActive(false);
    }
  }, []);

  // Re-acquire wake lock on visibility change
  useEffect(() => {
    if (!isSupported) return;

    function handleVisibilityChange() {
      if (
        document.visibilityState === "visible" &&
        wantLockRef.current &&
        !sentinelRef.current
      ) {
        navigator.wakeLock
          .request("screen")
          .then((sentinel) => {
            sentinelRef.current = sentinel;
            setIsActive(true);

            sentinel.addEventListener("release", () => {
              sentinelRef.current = null;
              setIsActive(false);
            });
          })
          .catch(() => {
            // Silent failure — progressive enhancement
          });
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wantLockRef.current = false;
      if (sentinelRef.current) {
        sentinelRef.current.release();
        sentinelRef.current = null;
      }
    };
  }, []);

  return { request, release, isActive, isSupported, error };
}
