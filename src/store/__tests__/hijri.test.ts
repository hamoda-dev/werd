import { monthLabel, hijriMonthLabel, gregorianMonthLabel } from "@/store/hijri";

describe("hijriMonthLabel (pure formatting)", () => {
  it("formats the design example exactly", () => {
    expect(hijriMonthLabel(1447, 9)).toBe("رمضان ١٤٤٧");
  });
});

describe("gregorianMonthLabel (fallback)", () => {
  it("formats an Arabic Gregorian label", () => {
    expect(gregorianMonthLabel(2026, 6)).toBe("يونيو ٢٠٢٦");
  });
});

describe("monthLabel", () => {
  it("returns the Hijri label for an in-range month", () => {
    // 2026-06-15 -> 1447-12 (Dhu al-Hijja) per umm al-qura data
    expect(monthLabel(2026, 6)).toBe("ذو الحجة ١٤٤٧");
  });
  it("falls back to a Gregorian label above the supported range", () => {
    expect(monthLabel(2100, 6)).toBe("يونيو ٢١٠٠");
  });
  it("falls back to a Gregorian label below the supported range", () => {
    // hijri-converter returns truthy-but-garbage {hy:1355,hm:12,hd:null} for pre-1937 years
    expect(monthLabel(1930, 6)).toBe("يونيو ١٩٣٠");
  });
});
