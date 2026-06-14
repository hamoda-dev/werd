/**
 * Challenge logic — pure functions (no storage). Progress is derived from the progress map;
 * only the reward-claim state (idempotency) and the week window are stored.
 */
import { shiftDayKey, startOfWeekKey, weekKeys } from "@/store/dates";
import type { ChallengeId, ChallengeState, DayProgress, ProgressMap } from "@/types";

export const WEEKLY_TARGET = 7;

export const DEFAULT_CHALLENGES: ChallengeState = {
  dailyClaimed: {},
  weekStart: null,
  weeklyClaimed: false,
};

/** Has a daily challenge been completed based on today's progress? */
export function dailyDone(id: ChallengeId, today: DayProgress): boolean {
  switch (id) {
    case "daily_morning":
      return today.morningDone;
    case "daily_evening":
      return today.eveningDone;
    case "daily_both":
      return today.morningDone && today.eveningDone;
    case "daily_ward":
      return !!today.wardDone;
    default:
      return false;
  }
}

/**
 * Number of days in the week the ward was fully completed (both morning and evening) — done
 * at WEEKLY_TARGET. The "don't miss a dhikr" challenge means not missing either of the two sessions.
 */
export function weeklyProgress(progress: ProgressMap, weekStart: string): number {
  return weekKeys(weekStart).filter((k) => {
    const d = progress[k];
    return !!d && d.morningDone && d.eveningDone;
  }).length;
}

const PRUNE_DAYS = 14;

/** Reset the week window when a new week (Saturday) begins, pruning old claims. */
export function rolloverIfNeeded(state: ChallengeState, today: string): ChallengeState {
  const ws = startOfWeekKey(today);
  if (state.weekStart === ws) return state;
  const cutoff = shiftDayKey(today, -PRUNE_DAYS);
  const dailyClaimed: Record<string, ChallengeId[]> = {};
  for (const [k, v] of Object.entries(state.dailyClaimed)) {
    if (k >= cutoff) dailyClaimed[k] = v;
  }
  return { dailyClaimed, weekStart: ws, weeklyClaimed: false };
}

/** Claim a daily challenge once. Returns the new state and the points granted (0 if already claimed). */
export function claimDaily(
  state: ChallengeState,
  id: ChallengeId,
  today: string,
  reward: number,
): { next: ChallengeState; granted: number } {
  const claimed = state.dailyClaimed[today] ?? [];
  if (claimed.includes(id)) return { next: state, granted: 0 };
  return {
    next: { ...state, dailyClaimed: { ...state.dailyClaimed, [today]: [...claimed, id] } },
    granted: reward,
  };
}

/** Claim the weekly challenge once. */
export function claimWeekly(
  state: ChallengeState,
  reward: number,
): { next: ChallengeState; granted: number } {
  if (state.weeklyClaimed) return { next: state, granted: 0 };
  return { next: { ...state, weeklyClaimed: true }, granted: reward };
}
