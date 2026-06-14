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

/** A user-created custom ward — same shape as Dhikr so the tasbih component can be reused. */
export interface CustomWard {
  id: string;
  title: string;
  text: string;
  count: number;
  createdAt: number;
}

export interface Settings {
  name: string;
  remindersEnabled: boolean;
  morningTime: string; // "HH:mm"
  eveningTime: string; // "HH:mm"
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
