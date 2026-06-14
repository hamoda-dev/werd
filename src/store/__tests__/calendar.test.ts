import { dayState, weeklyBars, weekDelta } from "@/store/calendar";
import type { ProgressMap, DayProgress } from "@/types";

function day(p: Partial<DayProgress> = {}): DayProgress {
  return { morningDone: false, eveningDone: false, completedIds: [], ...p };
}

const TODAY = "2026-06-14";

describe("dayState", () => {
  it("marks today regardless of progress", () => {
    expect(dayState(TODAY, {}, TODAY)).toBe("today");
    expect(dayState(TODAY, { [TODAY]: day({ morningDone: true, eveningDone: true }) }, TODAY)).toBe("today");
  });
  it("marks future days (string comparison)", () => {
    expect(dayState("2026-06-20", {}, TODAY)).toBe("future");
  });
  it("marks a fully complete past day", () => {
    const map: ProgressMap = { "2026-06-10": day({ morningDone: true, eveningDone: true }) };
    expect(dayState("2026-06-10", map, TODAY)).toBe("complete");
  });
  it("marks a partial past day", () => {
    const map: ProgressMap = { "2026-06-10": day({ morningDone: true }) };
    expect(dayState("2026-06-10", map, TODAY)).toBe("partial");
  });
  it("marks a ward-only past day as partial, not missed", () => {
    const map: ProgressMap = { "2026-06-10": day({ wardDone: true }) };
    expect(dayState("2026-06-10", map, TODAY)).toBe("partial");
  });
  it("marks an empty past day as missed", () => {
    expect(dayState("2026-06-10", {}, TODAY)).toBe("missed");
  });
});

describe("weeklyBars", () => {
  it("returns completed counts per key and the index of the highest", () => {
    const keys = ["2026-06-08", "2026-06-09", "2026-06-10"];
    const map: ProgressMap = {
      "2026-06-08": day({ completedIds: ["a"] }),
      "2026-06-09": day({ completedIds: ["a", "b", "c"] }),
      "2026-06-10": day({ completedIds: ["a", "b"] }),
    };
    expect(weeklyBars(keys, map)).toEqual({ values: [1, 3, 2], maxIndex: 1 });
  });
  it("returns -1 maxIndex when all bars are zero", () => {
    expect(weeklyBars(["2026-06-08", "2026-06-09"], {})).toEqual({ values: [0, 0], maxIndex: -1 });
  });
});

describe("weekDelta", () => {
  it("returns null when the previous week is empty (avoids Infinity)", () => {
    const map: ProgressMap = { "2026-06-08": day({ completedIds: ["a", "b"] }) };
    expect(weekDelta(["2026-06-08"], ["2026-06-01"], map)).toBeNull();
  });
  it("computes a rounded percentage delta", () => {
    const map: ProgressMap = {
      "2026-06-08": day({ completedIds: ["a", "b", "c"] }), // this week = 3
      "2026-06-01": day({ completedIds: ["a", "b"] }), // prev week = 2 -> +50%
    };
    expect(weekDelta(["2026-06-08"], ["2026-06-01"], map)).toBe(50);
  });
});
