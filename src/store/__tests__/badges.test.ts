import { aggregateStats, deriveBadges } from "@/store/badges";
import type { ProgressMap, DayProgress } from "@/types";

function day(p: Partial<DayProgress> = {}): DayProgress {
  return { morningDone: false, eveningDone: false, completedIds: [], ...p };
}

/** N active days each with `adhkar` completed ids, keyed 2026-01-01.. */
function progressWith(n: number, adhkarPerDay = 0): ProgressMap {
  const map: ProgressMap = {};
  for (let i = 1; i <= n; i++) {
    const key = `2026-01-${String(i).padStart(2, "0")}`;
    map[key] = day({
      morningDone: true,
      completedIds: Array.from({ length: adhkarPerDay }, (_, j) => `m${i}_${j}`),
    });
  }
  return map;
}

describe("aggregateStats", () => {
  it("returns zeros for an empty map", () => {
    expect(aggregateStats({})).toEqual({ activeDays: 0, totalAdhkar: 0 });
  });
  it("counts active days and total adhkar", () => {
    const map: ProgressMap = {
      "2026-01-01": day({ morningDone: true, completedIds: ["a", "b"] }),
      "2026-01-02": day({ eveningDone: true, completedIds: ["c"] }),
      "2026-01-03": day(), // not active
    };
    expect(aggregateStats(map)).toEqual({ activeDays: 2, totalAdhkar: 3 });
  });
  it("counts a wardDone-only day as active (engagement), with no adhkar count", () => {
    const map: ProgressMap = { "2026-01-01": day({ wardDone: true }) };
    expect(aggregateStats(map)).toEqual({ activeDays: 1, totalAdhkar: 0 });
  });
});

describe("deriveBadges", () => {
  it("returns no badges for a brand-new user", () => {
    expect(deriveBadges({}, 0, 1).size).toBe(0);
  });
  it("unlocks first_morning when any day has morningDone", () => {
    const map: ProgressMap = { "2026-01-01": day({ morningDone: true }) };
    expect(deriveBadges(map, 0, 1).has("first_morning")).toBe(true);
  });
  it("unlocks first_evening when any day has eveningDone", () => {
    const map: ProgressMap = { "2026-01-01": day({ eveningDone: true }) };
    expect(deriveBadges(map, 0, 1).has("first_evening")).toBe(true);
  });
  it("streak badges respect thresholds via longestStreak", () => {
    expect(deriveBadges({}, 2, 1).has("streak_3")).toBe(false);
    expect(deriveBadges({}, 3, 1).has("streak_3")).toBe(true);
    expect(deriveBadges({}, 6, 1).has("streak_7")).toBe(false);
    expect(deriveBadges({}, 7, 1).has("streak_7")).toBe(true);
    expect(deriveBadges({}, 29, 1).has("streak_30")).toBe(false);
    expect(deriveBadges({}, 30, 1).has("streak_30")).toBe(true);
  });
  it("unlocks active_30 at 30 active days", () => {
    expect(deriveBadges(progressWith(29), 0, 1).has("active_30")).toBe(false);
    expect(deriveBadges(progressWith(30), 0, 1).has("active_30")).toBe(true);
  });
  it("unlocks adhkar_100 and adhkar_500 at thresholds", () => {
    expect(deriveBadges(progressWith(10, 9), 0, 1).has("adhkar_100")).toBe(false); // 90
    expect(deriveBadges(progressWith(10, 10), 0, 1).has("adhkar_100")).toBe(true); // 100
    expect(deriveBadges(progressWith(10, 50), 0, 1).has("adhkar_500")).toBe(true); // 500
  });
  it("unlocks level_3 at level >= 3", () => {
    expect(deriveBadges({}, 0, 2).has("level_3")).toBe(false);
    expect(deriveBadges({}, 0, 3).has("level_3")).toBe(true);
  });
});
