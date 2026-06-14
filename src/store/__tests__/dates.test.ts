import {
  shiftDayKey,
  startOfWeekKey,
  weekKeys,
  monthDayKeys,
  firstWeekdayOfMonth,
} from "@/store/dates";

describe("shiftDayKey", () => {
  it("moves back across a month boundary", () => {
    expect(shiftDayKey("2026-01-01", -1)).toBe("2025-12-31");
  });
  it("moves forward across a month boundary", () => {
    expect(shiftDayKey("2026-01-31", 1)).toBe("2026-02-01");
  });
  it("is identity for delta 0", () => {
    expect(shiftDayKey("2026-06-14", 0)).toBe("2026-06-14");
  });
});

describe("startOfWeekKey (Saturday-aligned)", () => {
  it("returns the same day when key is a Saturday", () => {
    expect(startOfWeekKey("2026-01-03")).toBe("2026-01-03"); // Sat
  });
  it("snaps Sunday back to the previous Saturday", () => {
    expect(startOfWeekKey("2026-01-04")).toBe("2026-01-03"); // Sun -> Sat
  });
  it("snaps Friday (end of week) back across a month/year boundary", () => {
    expect(startOfWeekKey("2026-01-02")).toBe("2025-12-27"); // Fri -> prev Sat
  });
});

describe("weekKeys", () => {
  it("returns 7 consecutive keys from the start", () => {
    expect(weekKeys("2026-01-03")).toEqual([
      "2026-01-03", "2026-01-04", "2026-01-05", "2026-01-06",
      "2026-01-07", "2026-01-08", "2026-01-09",
    ]);
  });
});

describe("monthDayKeys", () => {
  it("returns 31 keys for January, ordered", () => {
    const keys = monthDayKeys(2026, 1);
    expect(keys).toHaveLength(31);
    expect(keys[0]).toBe("2026-01-01");
    expect(keys[30]).toBe("2026-01-31");
  });
  it("returns 28 keys for a non-leap February", () => {
    expect(monthDayKeys(2026, 2)).toHaveLength(28);
  });
  it("returns 29 keys for a leap February", () => {
    expect(monthDayKeys(2024, 2)).toHaveLength(29);
  });
});

describe("firstWeekdayOfMonth", () => {
  it("returns getDay() of the 1st (Sun=0)", () => {
    expect(firstWeekdayOfMonth(2026, 1)).toBe(4); // 2026-01-01 is Thursday
  });
});
