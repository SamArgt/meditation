import { DURATION_OPTIONS, INTERVAL_OPTIONS } from "./constants";

const STORAGE_KEY = "meditation-settings";

export interface StoredSettings {
  duration: number;
  interval: number;
}

export function loadSettings(): StoredSettings | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (
      typeof parsed.duration !== "number" ||
      typeof parsed.interval !== "number"
    ) {
      return null;
    }

    if (
      !(DURATION_OPTIONS as readonly number[]).includes(parsed.duration) ||
      !(INTERVAL_OPTIONS as readonly number[]).includes(parsed.interval)
    ) {
      return null;
    }

    return { duration: parsed.duration, interval: parsed.interval };
  } catch {
    return null;
  }
}

export function saveSettings(settings: StoredSettings): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Silently fail — NFR8: graceful fallback
  }
}
