import { useCallback } from "react";
import { useSyncExternalStore } from "react";
import { storage } from "@/utils/storage";

/**
 * Hook تفاعلي للتخزين المحلي. يعيد القيمة ودالة لتحديثها،
 * ويُعيد التصيير تلقائياً عند تغيّر المفتاح من أي مكان في التطبيق.
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
