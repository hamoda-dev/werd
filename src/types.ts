import type { ThemeId } from "@/theme/types";

export interface Dhikr {
  id: string;
  text: string;
  count: number;
  title?: string;
  note?: string;
}

export type CategoryId = "morning" | "evening";

export interface Category {
  id: CategoryId;
  title: string;
  timeWindow: string;
  adhkar: Dhikr[];
}

export interface AdhkarData {
  version: number;
  source: string;
  note?: string;
  categories: Category[];
}

/**
 * A user-created custom dhikr (ذِكر) in the أذكاري library.
 * `count` is the repetition target, or `null` for a free (open-ended) tasbih.
 * `category` is an AdhkarCategory id (defaults to "general" for legacy items).
 */
export interface CustomWard {
  id: string;
  title: string;
  text: string;
  count: number | null;
  category: string;
  createdAt: number;
}

/** A grouping for أذكاري items. The default set ships locked (`builtin`); users add their own. */
export interface AdhkarCategory {
  id: string;
  label: string;
  builtin: boolean;
}

/**
 * The unified row shape the أذكاري list and the single-dhikr counter render.
 * Built-in classics are `locked` (read-only); user items are not.
 */
export interface AdhkariItem {
  id: string;
  title?: string;
  text: string;
  count: number | null;
  category: string;
  locked: boolean;
}

export interface Settings {
  name: string;
  remindersEnabled: boolean;
  morningTime: string; // "HH:mm"
  eveningTime: string; // "HH:mm"
  /** Play the click sound on each tasbih tap. Undefined (legacy) is treated as enabled. */
  soundEnabled?: boolean;
  /**
   * How repetitions are counted in the adhkar screens:
   *  - "fingers": count on the fingers (the Sunnah), no on-screen counter; navigate by swipe.
   *  - "beads": the on-screen tap counter (المسبحة).
   * Undefined falls back to "fingers".
   */
  countMode?: "fingers" | "beads";
  /** Selected theme id. Undefined (legacy) falls back to the default theme. */
  themeId?: ThemeId;
}

export interface DayProgress {
  morningDone: boolean;
  eveningDone: boolean;
  completedIds: string[];
  /** A custom ward was completed today (flag for the "complete a ward" challenge) — not included in completedIds. */
  wardDone?: boolean;
}

export type ProgressMap = Record<string, DayProgress>;

export interface Streak {
  current: number;
  longest: number;
  lastCompletedDate: string | null;
}

/** The level is derived from points via levelInfo(), so it is not stored. */
export interface Score {
  points: number;
}

// ————— Badges (derived at read time, not stored) —————

export type BadgeId =
  | "first_morning"
  | "first_evening"
  | "streak_3"
  | "streak_7"
  | "streak_30"
  | "active_30"
  | "adhkar_100"
  | "adhkar_500"
  | "level_3";

export interface BadgeDef {
  id: BadgeId;
  label: string;
  icon: string;
  gradient: "gold" | "sage" | "terracotta";
}

// ————— Challenges —————

export type ChallengeId =
  | "weekly_no_miss"
  | "daily_morning"
  | "daily_evening"
  | "daily_both"
  | "daily_ward";

export interface DailyChallengeDef {
  id: ChallengeId;
  title: string;
  icon: string;
  reward: number;
}

/** Stored only: reward-claimed state (to prevent re-claiming) + the week window. Progress is derived. */
export interface ChallengeState {
  dailyClaimed: Record<string, ChallengeId[]>; // dateKey -> claimed ids
  weekStart: string | null; // key of the Saturday that started the current week
  weeklyClaimed: boolean;
}
