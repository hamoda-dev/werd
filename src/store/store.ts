import { useCallback } from "react";
import { useStorage } from "@/hooks/use-storage";
import { storage, StorageKeys } from "@/utils/storage";
import { todayKey, previousDayKey } from "@/store/dates";
import { deriveBadges } from "@/store/badges";
import {
  DEFAULT_CHALLENGES,
  WEEKLY_TARGET,
  claimDaily,
  claimWeekly,
  dailyDone,
  rolloverIfNeeded,
  weeklyProgress,
} from "@/store/challenges";
import { DAILY_CHALLENGES, WEEKLY_CHALLENGE } from "@/data/challenges";
import {
  GENERAL_CATEGORY_ID,
  getAdhkariItemById,
  mergeAdhkariItems,
  mergeCategories,
} from "@/data/adhkari";
import type {
  AdhkarCategory,
  AdhkariItem,
  BadgeId,
  CategoryId,
  ChallengeState,
  CustomWard,
  DayProgress,
  ProgressMap,
  Score,
  Settings,
  Streak,
} from "@/types";

// Points and level constants
export const POINTS_PER_CATEGORY = 50;
export const POINTS_PER_WARD = 20;
export const POINTS_PER_LEVEL = 500;

// Reference-stable default values (important for useSyncExternalStore)
export const DEFAULT_SETTINGS: Settings = {
  name: "",
  remindersEnabled: false,
  morningTime: "07:00",
  eveningTime: "18:30",
  soundEnabled: true,
  themeId: "werd",
};
const DEFAULT_PROGRESS: ProgressMap = {};
const DEFAULT_STREAK: Streak = { current: 0, longest: 0, lastCompletedDate: null };
const DEFAULT_SCORE: Score = { points: 0 };
const DEFAULT_AWRAD: CustomWard[] = [];
const DEFAULT_CUSTOM_CATEGORIES: AdhkarCategory[] = [];
const EMPTY_DAY: DayProgress = {
  morningDone: false,
  eveningDone: false,
  completedIds: [],
};

// ————— Derived computations —————

export function levelInfo(score: Score) {
  const level = Math.floor(score.points / POINTS_PER_LEVEL) + 1;
  const inLevel = score.points % POINTS_PER_LEVEL;
  return {
    level,
    inLevel,
    toNext: POINTS_PER_LEVEL - inLevel,
    ratio: inLevel / POINTS_PER_LEVEL,
  };
}

export function levelTitle(level: number): string {
  const titles = ["مُبتدئ", "مُواظِب", "ذاكِر", "ذاكِر مُجتهِد", "مُحسِن", "خاشِع"];
  return titles[Math.min(level - 1, titles.length - 1)] ?? "ذاكِر";
}

// ————— Actions that mutate more than one key (subscribers are notified automatically) —————

function getDay(progress: ProgressMap, key: string): DayProgress {
  return progress[key] ?? EMPTY_DAY;
}

function applyStreakOnComplete(streak: Streak, today: string): Streak {
  if (streak.lastCompletedDate === today) return streak;
  const current =
    streak.lastCompletedDate === previousDayKey(today) ? streak.current + 1 : 1;
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastCompletedDate: today,
  };
}

/** IDs of adhkar completed today (to resume the session where the user left off). */
export function getTodayCompletedIds(): string[] {
  const progress = storage.get<ProgressMap>(StorageKeys.progress, DEFAULT_PROGRESS);
  return progress[todayKey()]?.completedIds ?? [];
}

// Partial count for the current dhikr — a separate key that the main screen does not
// subscribe to (avoids re-rendering on every tap). Tied to today's date so it's auto-discarded on a new day.
interface PartialState {
  date: string;
  counts: Record<string, number>;
}
const DEFAULT_PARTIAL: PartialState = { date: "", counts: {} };

export function getPartialCount(dhikrId: string): number {
  const p = storage.get<PartialState>(StorageKeys.partialCounts, DEFAULT_PARTIAL);
  if (p.date !== todayKey()) return 0;
  return p.counts[dhikrId] ?? 0;
}

export function setPartialCount(dhikrId: string, count: number): void {
  const today = todayKey();
  const p = storage.get<PartialState>(StorageKeys.partialCounts, DEFAULT_PARTIAL);
  const counts = p.date === today ? { ...p.counts } : {};
  counts[dhikrId] = count;
  storage.set(StorageKeys.partialCounts, { date: today, counts });
}

/** Mark a single dhikr as completed for today (to track partial progress). */
export function markDhikrCompleted(dhikrId: string): void {
  const today = todayKey();
  const progress = storage.get<ProgressMap>(StorageKeys.progress, DEFAULT_PROGRESS);
  const day = getDay(progress, today);
  if (day.completedIds.includes(dhikrId)) return;
  storage.set(StorageKeys.progress, {
    ...progress,
    [today]: { ...day, completedIds: [...day.completedIds, dhikrId] },
  });
}

/** Complete a category (morning/evening): sets the flag, awards points, and updates the streak only the first time that day. */
export function completeCategory(categoryId: CategoryId): void {
  const today = todayKey();
  const progress = storage.get<ProgressMap>(StorageKeys.progress, DEFAULT_PROGRESS);
  const day = getDay(progress, today);
  const already = categoryId === "morning" ? day.morningDone : day.eveningDone;

  storage.set(StorageKeys.progress, {
    ...progress,
    [today]: {
      ...day,
      morningDone: categoryId === "morning" ? true : day.morningDone,
      eveningDone: categoryId === "evening" ? true : day.eveningDone,
    },
  });

  if (already) return;

  const score = storage.get<Score>(StorageKeys.score, DEFAULT_SCORE);
  storage.set(StorageKeys.score, { points: score.points + POINTS_PER_CATEGORY });

  const streak = storage.get<Streak>(StorageKeys.streak, DEFAULT_STREAK);
  storage.set(StorageKeys.streak, applyStreakOnComplete(streak, today));

  // Grant challenge rewards at completion time (not only when opening the challenges screen)
  // so a completed-week reward isn't lost if the week rolls over before the screen is visited.
  syncChallengeClaims();
}

/**
 * Complete a custom ward: awards points (without affecting the morning/evening streak), and marks
 * wardDone for today once (a signal for the "complete a ward" challenge).
 */
export function completeWard(): void {
  const today = todayKey();
  const progress = storage.get<ProgressMap>(StorageKeys.progress, DEFAULT_PROGRESS);
  const day = getDay(progress, today);
  if (!day.wardDone) {
    storage.set(StorageKeys.progress, {
      ...progress,
      [today]: { ...day, wardDone: true },
    });
  }

  const score = storage.get<Score>(StorageKeys.score, DEFAULT_SCORE);
  storage.set(StorageKeys.score, { points: score.points + POINTS_PER_WARD });

  syncChallengeClaims(); // grant the ward challenge reward at completion time
}

/**
 * Automatically claim rewards for completed challenges (idempotent). Called from the
 * challenges screen inside useEffect (not during render). Resets the week window when needed.
 */
export function syncChallengeClaims(): void {
  const today = todayKey();
  const progress = storage.get<ProgressMap>(StorageKeys.progress, DEFAULT_PROGRESS);
  const day = progress[today] ?? EMPTY_DAY;

  const original = storage.get<ChallengeState>(StorageKeys.challenges, DEFAULT_CHALLENGES);
  let state = rolloverIfNeeded(original, today);
  let granted = 0;

  for (const def of DAILY_CHALLENGES) {
    if (dailyDone(def.id, day)) {
      const r = claimDaily(state, def.id, today, def.reward);
      state = r.next;
      granted += r.granted;
    }
  }

  if (state.weekStart && weeklyProgress(progress, state.weekStart) >= WEEKLY_TARGET) {
    const r = claimWeekly(state, WEEKLY_CHALLENGE.reward);
    state = r.next;
    granted += r.granted;
  }

  if (state !== original) storage.set(StorageKeys.challenges, state);
  if (granted > 0) {
    const score = storage.get<Score>(StorageKeys.score, DEFAULT_SCORE);
    storage.set(StorageKeys.score, { points: score.points + granted });
  }
}

// ————— Reactive hooks —————

export function useSettings() {
  const [settings, setSettings] = useStorage<Settings>(
    StorageKeys.settings,
    DEFAULT_SETTINGS,
  );
  const update = useCallback(
    (patch: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [setSettings],
  );
  return { settings, setSettings, update };
}

export function useProgressMap(): ProgressMap {
  const [progress] = useStorage<ProgressMap>(StorageKeys.progress, DEFAULT_PROGRESS);
  return progress;
}

export function useTodayProgress(): DayProgress {
  const progress = useProgressMap();
  return progress[todayKey()] ?? EMPTY_DAY;
}

export function useStreak(): Streak {
  const [streak] = useStorage<Streak>(StorageKeys.streak, DEFAULT_STREAK);
  return streak;
}

export function useScore(): Score {
  const [score] = useStorage<Score>(StorageKeys.score, DEFAULT_SCORE);
  return score;
}

/** Unlocked badges — derived at read time from progress/streak/level (not stored). */
export function useBadges(): Set<BadgeId> {
  const progress = useProgressMap();
  const streak = useStreak();
  const score = useScore();
  return deriveBadges(progress, streak.longest, levelInfo(score).level);
}

export function useChallenges(): ChallengeState {
  const [state] = useStorage<ChallengeState>(StorageKeys.challenges, DEFAULT_CHALLENGES);
  return state;
}

export function useCustomAwrad() {
  const [list, setList] = useStorage<CustomWard[]>(
    StorageKeys.customAwrad,
    DEFAULT_AWRAD,
  );

  const add = useCallback(
    (ward: Omit<CustomWard, "id" | "createdAt">) => {
      const item: CustomWard = {
        ...ward,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
      };
      setList((prev) => [...prev, item]);
      return item;
    },
    [setList],
  );

  const update = useCallback(
    (id: string, patch: Partial<Omit<CustomWard, "id" | "createdAt">>) =>
      setList((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w))),
    [setList],
  );

  const remove = useCallback(
    (id: string) => setList((prev) => prev.filter((w) => w.id !== id)),
    [setList],
  );

  return { list, add, update, remove };
}

/** User-created categories (the locked defaults live in data/adhkari.ts, not storage). */
export function useCustomCategories() {
  const [list, setList] = useStorage<AdhkarCategory[]>(
    StorageKeys.customCategories,
    DEFAULT_CUSTOM_CATEGORIES,
  );

  const add = useCallback(
    (label: string): AdhkarCategory => {
      const item: AdhkarCategory = {
        id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        label: label.trim(),
        builtin: false,
      };
      setList((prev) => [...prev, item]);
      return item;
    },
    [setList],
  );

  const rename = useCallback(
    (id: string, label: string) =>
      setList((prev) => prev.map((c) => (c.id === id ? { ...c, label: label.trim() } : c))),
    [setList],
  );

  // Removing a category reassigns its أذكار to «عامة» so no item is orphaned.
  const remove = useCallback(
    (id: string) => {
      const awrad = storage.get<CustomWard[]>(StorageKeys.customAwrad, DEFAULT_AWRAD);
      const reassigned = awrad.map((w) =>
        w.category === id ? { ...w, category: GENERAL_CATEGORY_ID } : w,
      );
      if (reassigned.some((w, i) => w !== awrad[i])) {
        storage.set(StorageKeys.customAwrad, reassigned);
      }
      setList((prev) => prev.filter((c) => c.id !== id));
    },
    [setList],
  );

  return { list, add, rename, remove };
}

/** Locked default categories + the user's own (reactive). */
export function useAdhkariCategories(): AdhkarCategory[] {
  const { list } = useCustomCategories();
  return mergeCategories(list);
}

/** The merged أذكاري library: locked built-in classics + the user's own items (reactive). */
export function useAdhkariItems(): AdhkariItem[] {
  const { list } = useCustomAwrad();
  return mergeAdhkariItems(list);
}

/** Non-reactive lookup of one item (built-in or custom) by id — for the counter route. */
export function getAdhkariItem(id: string): AdhkariItem | undefined {
  const awrad = storage.get<CustomWard[]>(StorageKeys.customAwrad, DEFAULT_AWRAD);
  return getAdhkariItemById(id, awrad);
}
