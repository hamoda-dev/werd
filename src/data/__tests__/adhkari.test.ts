import {
  BUILTIN_ADHKAR,
  DEFAULT_CATEGORIES,
  GENERAL_CATEGORY_ID,
  customToItem,
  getAdhkariItemById,
  groupByCategory,
  isFree,
  mergeAdhkariItems,
  mergeCategories,
} from "@/data/adhkari";
import type { AdhkarCategory, CustomWard } from "@/types";

const userWard: CustomWard = {
  id: "u1",
  title: "ذكري",
  text: "سبحان الله وبحمده",
  count: 33,
  category: "tasbihat",
  createdAt: 1,
};

const freeWard: CustomWard = {
  id: "u2",
  title: "صلاة حرة",
  text: "اللهم صل على محمد",
  count: null,
  category: GENERAL_CATEGORY_ID,
  createdAt: 2,
};

describe("default categories", () => {
  it("ships the 5 locked defaults including general", () => {
    expect(DEFAULT_CATEGORIES).toHaveLength(5);
    expect(DEFAULT_CATEGORIES.every((c) => c.builtin)).toBe(true);
    expect(DEFAULT_CATEGORIES.map((c) => c.id)).toContain(GENERAL_CATEGORY_ID);
  });
});

describe("built-in adhkar", () => {
  it("are all locked and carry a category + the 4 classic tasbihat", () => {
    expect(BUILTIN_ADHKAR.every((i) => i.locked)).toBe(true);
    expect(BUILTIN_ADHKAR.every((i) => i.category)).toBeTruthy();
    const tasbihat = BUILTIN_ADHKAR.filter((i) => i.category === "tasbihat");
    expect(tasbihat).toHaveLength(4);
  });
});

describe("customToItem", () => {
  it("maps a user ward to an unlocked item", () => {
    expect(customToItem(userWard)).toMatchObject({ id: "u1", category: "tasbihat", locked: false, count: 33 });
  });

  it("preserves a free (null) count", () => {
    expect(customToItem(freeWard).count).toBeNull();
  });

  it("normalizes a legacy item with no category to general", () => {
    const legacy = { id: "old", title: "x", text: "y", count: 3, createdAt: 0 } as unknown as CustomWard;
    expect(customToItem(legacy).category).toBe(GENERAL_CATEGORY_ID);
  });
});

describe("mergeAdhkariItems", () => {
  it("puts built-ins first, then user items", () => {
    const merged = mergeAdhkariItems([userWard]);
    expect(merged).toHaveLength(BUILTIN_ADHKAR.length + 1);
    expect(merged[0].locked).toBe(true);
    expect(merged[merged.length - 1].id).toBe("u1");
  });
});

describe("mergeCategories", () => {
  it("appends user categories after the locked defaults", () => {
    const mine: AdhkarCategory = { id: "c1", label: "السفر", builtin: false };
    const all = mergeCategories([mine]);
    expect(all).toHaveLength(DEFAULT_CATEGORIES.length + 1);
    expect(all[all.length - 1]).toEqual(mine);
  });
});

describe("groupByCategory", () => {
  it("groups in category order and drops empty groups", () => {
    const groups = groupByCategory(mergeAdhkariItems([userWard]), DEFAULT_CATEGORIES);
    const ids = groups.map((g) => g.category.id);
    expect(ids).toContain("tasbihat");
    expect(ids).not.toContain("adiya"); // no items
    expect(ids.indexOf("tasbihat")).toBeLessThan(ids.indexOf("istighfar"));
  });
});

describe("getAdhkariItemById", () => {
  it("resolves a built-in item", () => {
    expect(getAdhkariItemById("bi-subhanallah", [])?.locked).toBe(true);
  });
  it("resolves a custom item", () => {
    expect(getAdhkariItemById("u1", [userWard])?.text).toBe("سبحان الله وبحمده");
  });
  it("returns undefined for an unknown id", () => {
    expect(getAdhkariItemById("nope", [])).toBeUndefined();
  });
});

describe("isFree", () => {
  it("treats null and non-positive as free", () => {
    expect(isFree(null)).toBe(true);
    expect(isFree(0)).toBe(true);
    expect(isFree(33)).toBe(false);
  });
});
