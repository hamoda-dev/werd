/**
 * Local key-value storage via the expo-sqlite polyfill (the recommended Expo 55 pattern).
 * All data is stored on the device only — no network connection whatsoever.
 *
 * We keep a cache of parsed values so that get() returns the same reference unless the
 * raw value changes — this is essential for useSyncExternalStore to work without infinite loops.
 */
import "./sqlite-install";

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    const raw = localStorage.getItem(key);
    const cached = cache.get(key);
    if (cached && cached.raw === raw) {
      return (cached.value === undefined ? defaultValue : cached.value) as T;
    }
    let value: unknown;
    if (raw == null) {
      value = undefined;
    } else {
      try {
        value = JSON.parse(raw);
      } catch {
        value = undefined;
      }
    }
    cache.set(key, { raw, value });
    return (value === undefined ? defaultValue : value) as T;
  },

  set<T>(key: string, value: T): void {
    const raw = JSON.stringify(value);
    localStorage.setItem(key, raw);
    cache.set(key, { raw, value });
    listeners.get(key)?.forEach((fn) => fn());
  },

  subscribe(key: string, listener: Listener): () => void {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(listener);
    return () => {
      listeners.get(key)?.delete(listener);
    };
  },
};

/** Unified storage keys. */
export const StorageKeys = {
  settings: "werd.settings",
  progress: "werd.progress",
  streak: "werd.streak",
  score: "werd.score",
  customAwrad: "werd.customAwrad",
  customCategories: "werd.customCategories",
  partialCounts: "werd.partialCounts",
  challenges: "werd.challenges",
} as const;
