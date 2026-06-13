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

/** وِرد خاص أنشأه المستخدم — بنفس شكل Dhikr لإعادة استخدام مكوّن المسبحة. */
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
}

export type ProgressMap = Record<string, DayProgress>;

export interface Streak {
  current: number;
  longest: number;
  lastCompletedDate: string | null;
}

export interface Score {
  points: number;
  level: number;
}
