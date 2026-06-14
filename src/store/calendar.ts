/**
 * Calendar and weekly-stats logic — pure functions derived from the progress map.
 * The grid is Gregorian (YYYY-MM-DD keys matching progress); labels are Hijri (hijri.ts).
 */
import type { DayProgress, ProgressMap } from "@/types";

export type DayCellState = "today" | "future" | "complete" | "partial" | "missed";

/** Unified definition of an active day: morning, evening, or a custom ward. */
export function isActiveDay(d: DayProgress | undefined): boolean {
  return !!d && (d.morningDone || d.eveningDone || !!d.wardDone);
}

/** State of a day cell. "Today" takes precedence over completion (today is always gold). */
export function dayState(key: string, progress: ProgressMap, today: string): DayCellState {
  if (key === today) return "today";
  if (key > today) return "future"; // string comparison is valid for the zero-padded YYYY-MM-DD format
  const d = progress[key];
  if (d?.morningDone && d?.eveningDone) return "complete";
  if (isActiveDay(d)) return "partial"; // morning/evening/ward = partial activity (not "missed")
  return "missed";
}

export interface WeekBars {
  values: number[];
  /** Index of the tallest bar (first positive maximum), or -1 if all are zero. */
  maxIndex: number;
}

/** Weekly bar heights = number of adhkar completed each day. */
export function weeklyBars(keys: string[], progress: ProgressMap): WeekBars {
  const values = keys.map((k) => progress[k]?.completedIds.length ?? 0);
  let maxIndex = -1;
  let max = 0;
  values.forEach((v, i) => {
    if (v > max) {
      max = v;
      maxIndex = i;
    }
  });
  return { values, maxIndex };
}

function sumAdhkar(keys: string[], progress: ProgressMap): number {
  return keys.reduce((s, k) => s + (progress[k]?.completedIds.length ?? 0), 0);
}

/** Percent change between this week's adhkar and the previous week's; null if the previous week was zero. */
export function weekDelta(
  thisKeys: string[],
  prevKeys: string[],
  progress: ProgressMap,
): number | null {
  const prev = sumAdhkar(prevKeys, progress);
  if (prev === 0) return null;
  const cur = sumAdhkar(thisKeys, progress);
  return Math.round(((cur - prev) / prev) * 100);
}
