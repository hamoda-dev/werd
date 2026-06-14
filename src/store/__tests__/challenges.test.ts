import {
  dailyDone,
  weeklyProgress,
  rolloverIfNeeded,
  claimDaily,
  claimWeekly,
  WEEKLY_TARGET,
  DEFAULT_CHALLENGES,
} from "@/store/challenges";
import type { ProgressMap, DayProgress, ChallengeState } from "@/types";

function day(p: Partial<DayProgress> = {}): DayProgress {
  return { morningDone: false, eveningDone: false, completedIds: [], ...p };
}

describe("dailyDone", () => {
  it("daily_morning tracks morningDone", () => {
    expect(dailyDone("daily_morning", day({ morningDone: true }))).toBe(true);
    expect(dailyDone("daily_morning", day())).toBe(false);
  });
  it("daily_evening tracks eveningDone", () => {
    expect(dailyDone("daily_evening", day({ eveningDone: true }))).toBe(true);
  });
  it("daily_both needs both", () => {
    expect(dailyDone("daily_both", day({ morningDone: true }))).toBe(false);
    expect(dailyDone("daily_both", day({ morningDone: true, eveningDone: true }))).toBe(true);
  });
  it("daily_ward tracks wardDone", () => {
    expect(dailyDone("daily_ward", day({ wardDone: true }))).toBe(true);
    expect(dailyDone("daily_ward", day())).toBe(false);
  });
});

describe("weeklyProgress", () => {
  const weekStart = "2026-06-13"; // Saturday
  it("counts only days with BOTH morning and evening done (no miss)", () => {
    expect(weeklyProgress({}, weekStart)).toBe(0);
    const map: ProgressMap = {
      "2026-06-13": day({ morningDone: true, eveningDone: true }), // counts
      "2026-06-14": day({ morningDone: true }), // partial -> does NOT count
      "2026-06-16": day({ morningDone: true, eveningDone: true }), // counts
    };
    expect(weeklyProgress(map, weekStart)).toBe(2);
  });
  it("reaches the target only when all 7 days have both", () => {
    const map: ProgressMap = {};
    for (let i = 0; i < 7; i++) {
      map[`2026-06-${13 + i}`] = day({ morningDone: true, eveningDone: true });
    }
    expect(weeklyProgress(map, weekStart)).toBe(WEEKLY_TARGET);
  });
});

describe("rolloverIfNeeded", () => {
  it("is a no-op within the same Saturday-week", () => {
    const state: ChallengeState = { ...DEFAULT_CHALLENGES, weekStart: "2026-06-13" };
    expect(rolloverIfNeeded(state, "2026-06-14")).toBe(state);
  });
  it("resets the weekly window and prunes old daily claims on a new week", () => {
    const state: ChallengeState = {
      weekStart: "2026-06-06",
      weeklyClaimed: true,
      dailyClaimed: { "2026-01-01": ["daily_morning"], "2026-06-10": ["daily_evening"] },
    };
    const next = rolloverIfNeeded(state, "2026-06-14");
    expect(next.weekStart).toBe("2026-06-13");
    expect(next.weeklyClaimed).toBe(false);
    expect(next.dailyClaimed["2026-01-01"]).toBeUndefined(); // pruned (>14d old)
    expect(next.dailyClaimed["2026-06-10"]).toEqual(["daily_evening"]); // kept
  });
});

describe("claimDaily (idempotent)", () => {
  it("grants the reward once, then zero", () => {
    const today = "2026-06-14";
    const first = claimDaily(DEFAULT_CHALLENGES, "daily_morning", today, 20);
    expect(first.granted).toBe(20);
    expect(first.next.dailyClaimed[today]).toEqual(["daily_morning"]);
    const second = claimDaily(first.next, "daily_morning", today, 20);
    expect(second.granted).toBe(0);
    expect(second.next).toBe(first.next); // unchanged reference
  });
});

describe("claimWeekly (idempotent)", () => {
  it("grants once, then zero", () => {
    const first = claimWeekly(DEFAULT_CHALLENGES, 50);
    expect(first.granted).toBe(50);
    expect(first.next.weeklyClaimed).toBe(true);
    const second = claimWeekly(first.next, 50);
    expect(second.granted).toBe(0);
    expect(second.next).toBe(first.next);
  });
});
