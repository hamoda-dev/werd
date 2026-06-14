import type { AdhkarCategory, AdhkariItem, CustomWard } from "@/types";

/**
 * أذكاري — the categorized tasbih library.
 *
 * Two sources merge into one list:
 *   1. BUILTIN_ADHKAR — read-only classics that ship with the app (locked).
 *   2. The user's CustomWard[] from storage (editable, swipeable).
 *
 * Categories likewise merge: DEFAULT_CATEGORIES (locked) + the user's own.
 * All helpers here are pure so they can be unit-tested without the store.
 */

/** Category every item falls back to when none is set (also the home for orphaned items). */
export const GENERAL_CATEGORY_ID = "general";

/** Locked default taxonomy. */
export const DEFAULT_CATEGORIES: AdhkarCategory[] = [
  { id: "tasbihat", label: "التسبيحات", builtin: true },
  { id: "istighfar", label: "الاستغفار", builtin: true },
  { id: "salat-nabi", label: "الصلاة على النبي", builtin: true },
  { id: "adiya", label: "أدعية", builtin: true },
  { id: GENERAL_CATEGORY_ID, label: "عامة", builtin: true },
];

/** Read-only seeded classics. Stable ids (`bi-*`) double as per-day count keys. */
export const BUILTIN_ADHKAR: AdhkariItem[] = [
  { id: "bi-subhanallah", text: "سُبْحَانَ الله", count: 33, category: "tasbihat", locked: true },
  { id: "bi-alhamdulillah", text: "الحَمْدُ لله", count: 33, category: "tasbihat", locked: true },
  { id: "bi-allahuakbar", text: "اللهُ أَكْبَر", count: 33, category: "tasbihat", locked: true },
  { id: "bi-lailahaillallah", text: "لَا إِلَهَ إِلَّا اللهُ وحدَه لا شريكَ له", count: 100, category: "tasbihat", locked: true },
  { id: "bi-istighfar", text: "أَسْتَغْفِرُ اللهَ وأتوبُ إليه", count: 100, category: "istighfar", locked: true },
  { id: "bi-salat-nabi", text: "اللّٰهُمَّ صَلِّ وسلِّم على نبيِّنا محمد", count: 10, category: "salat-nabi", locked: true },
];

/** Map a stored CustomWard to an AdhkariItem, normalizing legacy items (missing category). */
export function customToItem(w: CustomWard): AdhkariItem {
  return {
    id: w.id,
    title: w.title,
    text: w.text,
    count: w.count ?? null,
    category: w.category || GENERAL_CATEGORY_ID,
    locked: false,
  };
}

/** Built-in classics first, then the user's own items. */
export function mergeAdhkariItems(custom: CustomWard[]): AdhkariItem[] {
  return [...BUILTIN_ADHKAR, ...custom.map(customToItem)];
}

/** All categories: locked defaults followed by the user's own. */
export function mergeCategories(custom: AdhkarCategory[]): AdhkarCategory[] {
  return [...DEFAULT_CATEGORIES, ...custom];
}

export function getCategoryLabel(categories: AdhkarCategory[], id: string): string {
  return categories.find((c) => c.id === id)?.label ?? "عامة";
}

/** Group items by category id, preserving the order of `categories`. Empty groups are dropped. */
export function groupByCategory(
  items: AdhkariItem[],
  categories: AdhkarCategory[],
): { category: AdhkarCategory; items: AdhkariItem[] }[] {
  return categories
    .map((category) => ({
      category,
      items: items.filter((it) => it.category === category.id),
    }))
    .filter((g) => g.items.length > 0);
}

/** Resolve a single item (built-in or custom) by id — used by the counter route. */
export function getAdhkariItemById(id: string, custom: CustomWard[]): AdhkariItem | undefined {
  return mergeAdhkariItems(custom).find((it) => it.id === id);
}

/** True for an open-ended (free) tasbih — no target, no completion. */
export function isFree(count: number | null): boolean {
  return count == null || count <= 0;
}
