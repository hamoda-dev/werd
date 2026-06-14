import raw from "./adhkar.json";
import type { AdhkarData, Category, CategoryId, Dhikr } from "@/types";

export const adhkarData = raw as AdhkarData;
export const categories: Category[] = adhkarData.categories;

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryTitle(id: CategoryId): string {
  return id === "morning" ? "أذكار الصباح" : "أذكار المساء";
}

export function totalCount(category: Category): number {
  return category.adhkar.length;
}

export function completedCount(category: Category, completedIds: string[]): number {
  return category.adhkar.filter((d) => completedIds.includes(d.id)).length;
}

/** Total repetition count within a category (for the "total adhkar" stat). */
export function totalRepetitions(category: Category): number {
  return category.adhkar.reduce((sum, d: Dhikr) => sum + d.count, 0);
}
