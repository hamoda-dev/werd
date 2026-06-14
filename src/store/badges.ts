/**
 * Badge logic — pure functions (no storage), unit-tested. Badges are derived at
 * read time from existing data (progress/streak/level); they are not stored (decision D6).
 */
import { isActiveDay } from "@/store/calendar";
import type { BadgeId, ProgressMap } from "@/types";

export interface Stats {
  activeDays: number;
  totalAdhkar: number;
}

/** Aggregate stats from the progress map (for stat cards and badge conditions). */
export function aggregateStats(progress: ProgressMap): Stats {
  const days = Object.values(progress);
  return {
    activeDays: days.filter(isActiveDay).length,
    totalAdhkar: days.reduce((s, d) => s + d.completedIds.length, 0),
  };
}

/** The set of unlocked badges derived from the current state. */
export function deriveBadges(
  progress: ProgressMap,
  longestStreak: number,
  level: number,
): Set<BadgeId> {
  const earned = new Set<BadgeId>();
  const days = Object.values(progress);

  if (days.some((d) => d.morningDone)) earned.add("first_morning");
  if (days.some((d) => d.eveningDone)) earned.add("first_evening");

  if (longestStreak >= 3) earned.add("streak_3");
  if (longestStreak >= 7) earned.add("streak_7");
  if (longestStreak >= 30) earned.add("streak_30");

  const { activeDays, totalAdhkar } = aggregateStats(progress);
  if (activeDays >= 30) earned.add("active_30");
  if (totalAdhkar >= 100) earned.add("adhkar_100");
  if (totalAdhkar >= 500) earned.add("adhkar_500");

  if (level >= 3) earned.add("level_3");

  return earned;
}
