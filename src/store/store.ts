import { useCallback } from "react";
import { useStorage } from "@/hooks/use-storage";
import { storage, StorageKeys } from "@/utils/storage";
import { todayKey, previousDayKey } from "@/store/dates";
import type {
  CategoryId,
  CustomWard,
  DayProgress,
  ProgressMap,
  Score,
  Settings,
  Streak,
} from "@/types";

// قيم النقاط والمستويات
export const POINTS_PER_CATEGORY = 50;
export const POINTS_PER_WARD = 20;
export const POINTS_PER_LEVEL = 500;

// قيم افتراضية ثابتة المرجع (مهم لـ useSyncExternalStore)
export const DEFAULT_SETTINGS: Settings = {
  name: "",
  remindersEnabled: false,
  morningTime: "07:00",
  eveningTime: "18:30",
};
const DEFAULT_PROGRESS: ProgressMap = {};
const DEFAULT_STREAK: Streak = { current: 0, longest: 0, lastCompletedDate: null };
const DEFAULT_SCORE: Score = { points: 0, level: 1 };
const DEFAULT_AWRAD: CustomWard[] = [];
const EMPTY_DAY: DayProgress = {
  morningDone: false,
  eveningDone: false,
  completedIds: [],
};

// ————— حسابات مشتقّة —————

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

// ————— أفعال تُعدّل أكثر من مفتاح (تُخطر المشتركين تلقائياً) —————

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

/** معرّفات الأذكار المكتملة اليوم (لاستئناف الجلسة من حيث توقّف المستخدم). */
export function getTodayCompletedIds(): string[] {
  const progress = storage.get<ProgressMap>(StorageKeys.progress, DEFAULT_PROGRESS);
  return progress[todayKey()]?.completedIds ?? [];
}

// العدّ الجزئي للذكر الحالي — مفتاح منفصل لا تشترك فيه الرئيسية (تفادي إعادة
// التصيير مع كل ضغطة). يُربط بتاريخ اليوم فيُهمَل تلقائياً في يوم جديد.
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

/** تعليم ذكر واحد كمكتمل في يوم اليوم (لتتبّع التقدّم الجزئي). */
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

/** إكمال تصنيف (صباح/مساء): يضبط العلَم، ويمنح نقاطاً ويحدّث السلسلة أول مرة فقط في اليوم. */
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
  const points = score.points + POINTS_PER_CATEGORY;
  storage.set(StorageKeys.score, {
    points,
    level: Math.floor(points / POINTS_PER_LEVEL) + 1,
  });

  const streak = storage.get<Streak>(StorageKeys.streak, DEFAULT_STREAK);
  storage.set(StorageKeys.streak, applyStreakOnComplete(streak, today));
}

/** إكمال وِرد خاص: يمنح نقاطاً (دون التأثير على سلسلة الصباح/المساء). */
export function completeWard(): void {
  const score = storage.get<Score>(StorageKeys.score, DEFAULT_SCORE);
  const points = score.points + POINTS_PER_WARD;
  storage.set(StorageKeys.score, {
    points,
    level: Math.floor(points / POINTS_PER_LEVEL) + 1,
  });
}

// ————— Hooks تفاعلية —————

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
