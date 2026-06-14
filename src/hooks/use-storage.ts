import { useCallback, useSyncExternalStore } from "react";
import { storage } from "@/utils/storage";

/**
 * A reactive hook for local storage. Returns the value and a function to update it,
 * and re-renders automatically when the key changes from anywhere in the app.
 */
export function useStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    (cb) => storage.subscribe(key, cb),
    () => storage.get<T>(key, defaultValue),
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(storage.get<T>(key, defaultValue))
          : next;
      storage.set(key, resolved);
    },
    [key, defaultValue],
  );

  return [value, setValue];
}
