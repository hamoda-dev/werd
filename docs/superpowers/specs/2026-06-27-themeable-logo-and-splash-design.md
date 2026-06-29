# Themeable Logo & Splash — Design

**Date:** 2026-06-27
**Status:** Approved (brainstorm) — ready for implementation plan

## Problem

The app logo is a single raster asset (`assets/images/wird-logo.png`) drawn for the **werd** (dark green / gold) theme only. When a user switches to the **pink** theme, the in-app logo and the launch experience still read as green — inconsistent with the rest of the themed UI. We need the logo (and the splash) to match whichever theme is active, and to stay consistent for any future theme.

## Goal

Replace the static logo with **one themeable SVG component** driven by theme tokens, so every present and future theme automatically gets a matching logo. Apply it in-app (onboarding today, plus a new themed splash). Fill in both existing themes: werd and pink.

This follows the codebase convention of hand-drawn, theme-driven SVG (see `src/components/icon.tsx`, DESIGN.md §7) — no per-theme raster assets.

## Approved visual direction

The mark is always **sunrise + «وِرْد»** (a half-sun with 7 rounded rays above the calligraphic wordmark). Color and decoration come from theme tokens:

- **Werd:** deep-green squircle ground, gold sunrise, cream «وِرْد», no sparkles. (Matches today's logo.)
- **Pink ("Strawberry Milk"):** light-pink ground, **warm peach** sunrise, **plum `#6e3b4a`** «وِرْد», plus soft pink 4-point **sparkles**.

Decoration is gated on the existing `features.sprinkles` flag (pink = true, werd = false), so the same component renders clean for minimal themes and playful for decorated ones.

Wordmark renders in the already-loaded **Amiri** font (`fonts.naskhBold`). The tile is an app-icon **squircle** (corner radius ≈ `size × 0.224`, `borderCurve: "continuous"`), independent of `radii.card`, so it always reads as a logo.

## Components & changes

### 1. New theme token block — `logo`

Add to `Theme` in `src/theme/types.ts`:

```ts
export interface LogoTokens {
  /** CSS gradient for the squircle tile background (experimental_backgroundImage). */
  ground: string;
  /** Sunrise dome fill — vertical gradient stops (SVG). */
  sunFrom: string;
  sunTo: string;
  /** Sunrise ray stroke color. */
  rays: string;
  /** «وِرْد» wordmark color. */
  wordmark: string;
  /** Sparkle fill. Sparkles render only when `features.sprinkles` is true; null = none. */
  spark: string | null;
}
// Theme interface gains:  logo: LogoTokens;
```

Values:

| token | werd | pink |
|---|---|---|
| `ground` | `linear-gradient(150deg, #1c4a3a, #0e2d22)` | `linear-gradient(150deg, #fff1f4, #ffd9e6)` |
| `sunFrom` | `#d8b46a` | `#ffc78a` |
| `sunTo` | `#bf9648` | `#ff9a7e` |
| `rays` | `#d8b46a` | `#ffb07a` |
| `wordmark` | `#f4ede0` | `#6e3b4a` |
| `spark` | `null` | `#ff9bb6` |

Add the corresponding block to `src/theme/themes/werd.ts` and `src/theme/themes/pink.ts`.

### 2. New component — `src/components/logo.tsx`

`<Logo size={number} />` (default `size = 104`). Reads `useTheme()` for `logo` tokens + `features.sprinkles`. Structure:

- Outer `View`: `width/height = size`, `borderRadius = Math.round(size * 0.224)`, `borderCurve: "continuous"`, `overflow: "hidden"`, `experimental_backgroundImage: logo.ground` (same pattern as `theme-preview.tsx`).
- **Glow:** absolutely-positioned `View` (~78% of size, centered upper third) with `experimental_backgroundImage: gradients.logoGlow` (reuse existing token).
- **Sparkles:** when `features.sprinkles && logo.spark`, an absolute `Svg` (viewBox = size) with three 4-point sparkle paths in `logo.spark`, scaled to size.
- **Sunrise:** an `Svg` (~`size*0.46 × size*0.30`) with `<Defs><LinearGradient>` (sunFrom→sunTo) for the dome `<Path>`, plus 7 ray `<Line>`s (`stroke = logo.rays`, `strokeWidth 3`, `strokeLinecap "round"`). Ray/dome geometry as prototyped (dome `M20 34 A13 13 0 0 1 46 34 Z` on a `0 0 66 44` viewBox).
- **Wordmark:** «وِرْد» via the app's text primitive (`<Txt>` with `naskh` + bold, or `Text` with `fontFamily: fonts.naskhBold`), `color = logo.wordmark`, `fontSize ≈ size * 0.36`, RTL.

The component re-renders on theme change (via `useTheme()`), so it re-themes live when the user switches themes.

### 3. New component — themed JS splash — `src/components/app-splash.tsx`

Full-screen themed splash shown while fonts/data load:

- Full-bleed background `experimental_backgroundImage: logo.ground` (with a soft radial glow).
- Centered `<Logo size={118}>`, the «وِرْد» name, and a tagline (placeholder «وِرْدُكَ اليوميّ» — confirm copy).
- Pink scatters a few larger screen-wide sparkles (gated on `features.sprinkles`).
- Resolves the theme from the **persisted** `themeId` (read from storage, as `_layout.tsx` already does for reminders) via `resolveTheme()`, so it themes correctly on cold start without depending on context ordering.

### 4. Wiring

- **`src/app/_layout.tsx`:** while `!loaded`, render `<AppSplash />` instead of `return null`. Once `loaded`, call `SplashScreen.hideAsync()` and cross-fade the splash out (`Animated.View` opacity from `react-native`) before showing the app.
- **`src/app/onboarding.tsx`:** replace the `<Image source={require("@/assets/images/wird-logo.png")}>` block (and its surrounding glow wrapper, now redundant) with `<Logo size={fullHero ? 104 : 64} />`.
- Replace any other in-app usage of `wird-logo.png` found during implementation.

### 5. Native splash (static, optional)

`app.json` `expo-splash-screen` stays a single static config (`#0e2d22` + sunrise mark) — it renders before JS and **cannot** be per-theme. Optionally regenerate the static splash art to the clean sunrise+wordmark, but it remains one green image for all themes.

## Launch experience

Brief green native frame → themed JS splash (green **or** pink) → app. Seamless for werd; one quick green→pink hand-off for pink users — an unavoidable platform constraint of the pre-JS native splash.

## Out of scope

- OS launcher / app icon (`icon.png`, Android adaptive icons) — single static assets, cannot theme at runtime.
- Re-skinning anything beyond the logo and splash.
- New themes beyond werd and pink (the token block makes adding them trivial later).

## Open detail

- Splash tagline copy «وِرْدُكَ اليوميّ» is a placeholder — confirm final text or omit.
