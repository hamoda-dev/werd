/**
 * Theme registry — the single place that knows every available theme.
 *
 * To add a future theme (e.g. a dark theme):
 *   1. add its id to `ThemeId` in `types.ts`,
 *   2. create `themes/<id>.ts` exporting a `Theme`,
 *   3. add it to the `THEMES` map below.
 * No component changes are needed.
 */
import type { Theme, ThemeId } from "@/theme/types";
import { werd } from "@/theme/themes/werd";
import { pink } from "@/theme/themes/pink";

export const THEMES: Record<ThemeId, Theme> = {
  werd,
  pink,
};

/** Ordered list for the theme picker. */
export const THEME_LIST: Theme[] = [werd, pink];

/** The default / main theme used on first launch and as a fallback. */
export const DEFAULT_THEME_ID: ThemeId = "werd";

export function resolveTheme(id: ThemeId | undefined): Theme {
  return (id && THEMES[id]) || THEMES[DEFAULT_THEME_ID];
}
