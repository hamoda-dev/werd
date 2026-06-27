# Themeable Logo & Splash Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single raster logo with one theme-driven SVG `<Logo>` component (plus a themed JS splash) so every theme renders a matching logo automatically.

**Architecture:** Add a `logo` token block to the `Theme` type, filled per-theme (werd + pink). A new `src/components/logo.tsx` reads those tokens via `useTheme()` and draws a squircle tile + sunrise + «وِرْد» (Amiri), with sparkles gated on the existing `features.sprinkles` flag. A new `src/components/app-splash.tsx` reuses `<Logo>` full-screen and fades out after load. Wire both into `onboarding.tsx` and `_layout.tsx`.

**Tech Stack:** Expo SDK 55, React Native, `react-native-svg`, TypeScript, Jest.

**Hard constraint:** `src/theme/__tests__/no-raw-hex.test.ts` fails if any file in `src/app` or `src/components` contains a `#hex` or `rgba()`/`rgb()` literal. New components MUST take every color from theme tokens — no inline color literals.

---

### Task 1: Add the `logo` theme token block

**Files:**
- Modify: `src/theme/types.ts` (add `LogoTokens` interface + `logo` on `Theme`)
- Modify: `src/theme/themes/werd.ts` (add `logo` block)
- Modify: `src/theme/themes/pink.ts` (add `logo` block)
- Test: `src/theme/__tests__/tokens.test.ts` (extend)

- [ ] **Step 1: Write the failing tests**

In `src/theme/__tests__/tokens.test.ts`, inside the existing `describe.each(...)("theme: %s", (_id, theme) => { ... })` block, add this test after the existing `"defines the decorative tokens..."` test:

```ts
  it("defines logo tokens for the themed app logo", () => {
    const { logo } = theme;
    expect(logo.ground).toMatch(/gradient\(/);
    for (const k of ["sunFrom", "sunTo", "rays", "wordmark"] as const) {
      expect(typeof logo[k]).toBe("string");
    }
    expect(logo.spark === null || typeof logo.spark === "string").toBe(true);
  });
```

And inside the existing `describe("registry", () => { ... })` block, add:

```ts
  it("turns logo sparkles off for werd and on for pink", () => {
    expect(THEME_LIST.find((t) => t.id === "werd")!.logo.spark).toBeNull();
    expect(typeof THEME_LIST.find((t) => t.id === "pink")!.logo.spark).toBe("string");
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tokens`
Expected: FAIL — TypeScript/runtime error that `logo` does not exist on the theme objects.

- [ ] **Step 3: Add the `LogoTokens` interface and `logo` field to the Theme type**

In `src/theme/types.ts`, add this interface immediately after the `Gradients` interface (after its closing `}` near line 120):

```ts
/** Tokens for the themeable app logo (see components/logo.tsx). Every theme provides
 *  its own sunrise + «وِرْد» colors so the logo always matches the active theme. */
export interface LogoTokens {
  /** CSS gradient for the squircle tile background (experimental_backgroundImage). */
  ground: string;
  /** Sunrise dome fill — vertical gradient stops (top → bottom). */
  sunFrom: string;
  sunTo: string;
  /** Sunrise ray stroke color. */
  rays: string;
  /** «وِرْد» wordmark color. */
  wordmark: string;
  /** Sparkle fill. Sparkles render only when `features.sprinkles` is true; null = none. */
  spark: string | null;
}
```

Then add `logo` to the `Theme` interface, immediately after the `gradients: Gradients;` line:

```ts
  gradients: Gradients;
  logo: LogoTokens;
```

- [ ] **Step 4: Add the werd `logo` block**

In `src/theme/themes/werd.ts`, add this `const` after the `gradients` const (after its closing `};` near line 80):

```ts
const logo: Theme["logo"] = {
  ground: gradients.brandCard, // deep green squircle, matches the original logo ground
  sunFrom: colors.gold500,
  sunTo: colors.gold700,
  rays: colors.gold500,
  wordmark: colors.creamText,
  spark: null,
};
```

Then add `logo,` to the exported `werd` object, immediately after the `gradients,` line:

```ts
  gradients,
  logo,
```

- [ ] **Step 5: Add the pink `logo` block**

Do NOT modify the `colors` object or the `Colors` type. The warm-peach sunrise isn't in the existing pink palette, so keep those values as literals inside the `logo` block — theme files (`src/theme/**`) are exempt from the no-raw-hex guard, which only scans `src/app` and `src/components`.

In `src/theme/themes/pink.ts`, add this `const` after the `gradients` const (after its closing `};` near line 80):

```ts
const logo: Theme["logo"] = {
  ground: gradients.brandCard, // light blush squircle
  sunFrom: "#ffc78a", // warm peach (top)
  sunTo: "#ff9a7e",   // coral (bottom)
  rays: "#ffb07a",
  wordmark: colors.creamText, // plum #6e3b4a
  spark: "#ff9bb6",
};
```

Then add `logo,` to the exported `pink` object, immediately after the `gradients,` line:

```ts
  gradients,
  logo,
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- tokens`
Expected: PASS — all theme token tests including the two new ones.

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add src/theme/types.ts src/theme/themes/werd.ts src/theme/themes/pink.ts src/theme/__tests__/tokens.test.ts
git commit -m "feat(theme): add per-theme logo tokens"
```

---

### Task 2: Build the `<Logo>` component

**Files:**
- Create: `src/components/logo.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/logo.tsx` with this exact content:

```tsx
import { useId } from "react";
import { View } from "react-native";
import Svg, { Defs, G, Line, LinearGradient, Path, Stop } from "react-native-svg";
import { Txt } from "@/components/txt";
import { useTheme } from "@/theme/context";

// A soft 4-point sparkle, centered at the origin in a ~12px box.
const SPARKLE = "M0,-6 C0.7,-2 2,-0.7 6,0 C2,0.7 0.7,2 0,6 C-0.7,2 -2,0.7 -6,0 C-2,-0.7 -0.7,-2 0,-6Z";

interface Props {
  /** Square edge in px. Corner radius and every inner element scale from this. */
  size?: number;
}

/**
 * The app logo: a sunrise above the «وِرْد» wordmark on an app-icon squircle. Every
 * color comes from the active theme's `logo` tokens, so each theme renders its own
 * logo (werd = gold sunrise on green; pink = peach sunrise on blush + sparkles).
 * Sparkles appear only for themes with `features.sprinkles`. Hand-drawn SVG, no raster
 * — see DESIGN.md §7 and components/icon.tsx.
 */
export function Logo({ size = 104 }: Props) {
  const { logo, gradients, shadows, features } = useTheme();
  // Unique gradient id per instance (two Logos can be on screen during the splash fade).
  const sunId = `logoSun-${useId().replace(/:/g, "")}`;

  const sunW = Math.round(size * 0.5);
  const sunH = Math.round(size * 0.333);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.224),
        borderCurve: "continuous",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        experimental_backgroundImage: logo.ground,
        boxShadow: shadows.darkElevated,
      }}
    >
      {/* Halo behind the sun */}
      <View
        style={{
          position: "absolute",
          width: size * 0.8,
          height: size * 0.8,
          top: size * 0.04,
          experimental_backgroundImage: gradients.logoGlow,
        }}
      />

      {/* Sparkles — decorated themes only */}
      {features.sprinkles && logo.spark ? (
        <Svg width={size} height={size} viewBox="0 0 104 104" style={{ position: "absolute" }}>
          <G fill={logo.spark}>
            <G transform="translate(21,30) scale(1.25)"><Path d={SPARKLE} /></G>
            <G transform="translate(84,38) scale(0.85)"><Path d={SPARKLE} /></G>
            <G transform="translate(82,78) scale(0.95)"><Path d={SPARKLE} /></G>
          </G>
        </Svg>
      ) : null}

      {/* Sunrise */}
      <Svg width={sunW} height={sunH} viewBox="0 0 66 44">
        <Defs>
          <LinearGradient id={sunId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={logo.sunFrom} />
            <Stop offset="1" stopColor={logo.sunTo} />
          </LinearGradient>
        </Defs>
        <G stroke={logo.rays} strokeWidth={3} strokeLinecap="round">
          <Line x1="33" y1="16" x2="33" y2="7" />
          <Line x1="39.7" y1="17.3" x2="43.1" y2="9.0" />
          <Line x1="45.5" y1="21.1" x2="51.8" y2="14.6" />
          <Line x1="49.4" y1="26.7" x2="57.7" y2="23.0" />
          <Line x1="26.3" y1="17.3" x2="22.9" y2="9.0" />
          <Line x1="20.5" y1="21.1" x2="14.2" y2="14.6" />
          <Line x1="16.6" y1="26.7" x2="8.3" y2="23.0" />
        </G>
        <Path d="M20 34 A13 13 0 0 1 46 34 Z" fill={`url(#${sunId})`} />
      </Svg>

      {/* Wordmark */}
      <Txt naskh weight="bold" size={Math.round(size * 0.36)} color={logo.wordmark} style={{ marginTop: size * 0.02 }}>
        وِرْد
      </Txt>
    </View>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors. (If `experimental_backgroundImage` or `borderCurve` raise a type error, confirm you mirrored the exact usage already present in `src/components/theme-preview.tsx`, which compiles.)

- [ ] **Step 3: Run the hex-guard test on the new file**

Run: `npm test -- no-raw-hex`
Expected: PASS — `src/components/logo.tsx references tokens, not hex/rgba`. (If it fails, you left a color literal in the component; move it into a theme token.)

- [ ] **Step 4: Commit**

```bash
git add src/components/logo.tsx
git commit -m "feat(logo): add themeable Logo component"
```

---

### Task 3: Use `<Logo>` in onboarding

**Files:**
- Modify: `src/app/onboarding.tsx` (replace the `<Image>` logo block, lines ~107-117; add import)

- [ ] **Step 1: Add the import**

Near the top of `src/app/onboarding.tsx`, with the other `@/components` imports, add:

```ts
import { Logo } from "@/components/logo";
```

- [ ] **Step 2: Replace the Image block**

Find this block (around lines 107-117):

```tsx
              <View style={{ borderRadius: radii.card, boxShadow: shadows.darkElevated }}>
                <Image
                  source={require("@/assets/images/wird-logo.png")}
                  style={{
                    width: fullHero ? 104 : 64,
                    height: fullHero ? 104 : 64,
                    borderRadius: radii.card,
                  }}
                  contentFit="contain"
                />
              </View>
```

Replace it entirely with:

```tsx
              <Logo size={fullHero ? 104 : 64} />
```

(The `<Logo>` carries its own squircle, glow, and `shadows.darkElevated` shadow, so the wrapper `View` is no longer needed.)

- [ ] **Step 3: Remove the now-unused `Image` import if nothing else uses it**

Run: `grep -n "Image" src/app/onboarding.tsx`
If the only remaining matches are the `import { Image } from "expo-image";` line (or similar), delete that import line. If `Image` is used elsewhere in the file, leave it.

- [ ] **Step 4: Typecheck + lint + hex guard**

Run: `npx tsc --noEmit`
Expected: No errors (in particular, no "unused variable" or "cannot find name Image").

Run: `npm test -- no-raw-hex tokens`
Expected: PASS.

- [ ] **Step 5: Manual visual check**

Start the dev client (`npm run dev` or `npx expo start --dev-client`), open onboarding. Confirm:
- Werd theme: gold sunrise + cream «وِرْد» on the green squircle, no sparkles.
- Switch to the pink theme (Profile → المظهر), reopen onboarding: peach sunrise + plum «وِرْد» on blush, with sparkles.

- [ ] **Step 6: Commit**

```bash
git add src/app/onboarding.tsx
git commit -m "feat(onboarding): use themeable Logo in place of the PNG"
```

---

### Task 4: Themed JS splash + wire into `_layout`

**Files:**
- Create: `src/components/app-splash.tsx`
- Modify: `src/app/_layout.tsx` (render the splash overlay; add `useState`/import)

- [ ] **Step 1: Create the splash component**

Create `src/components/app-splash.tsx` with this exact content:

```tsx
import { useEffect, useRef } from "react";
import { Animated, useWindowDimensions } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { Logo } from "@/components/logo";
import { Txt } from "@/components/txt";
import { useTheme } from "@/theme/context";
import { spacing } from "@/theme/tokens";

const SPARKLE = "M0,-6 C0.7,-2 2,-0.7 6,0 C2,0.7 0.7,2 0,6 C-0.7,2 -2,0.7 -6,0 C-2,-0.7 -0.7,-2 0,-6Z";

/**
 * Full-screen themed splash, shown over the app for one beat after fonts/data load,
 * then fades out. Themed from the active theme (the persisted themeId resolved by
 * ThemeProvider), so a pink user sees the pink splash. The OS native splash (app.json)
 * still flashes first and cannot be themed — this bridges into the themed app.
 */
export function AppSplash({ onFinish }: { onFinish: () => void }) {
  const { gradients, semantic, logo, features } = useTheme();
  const { width, height } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }).start(
        ({ finished }) => {
          if (finished) onFinish();
        },
      );
    }, 500);
    return () => clearTimeout(t);
  }, [opacity, onFinish]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity,
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.lg,
        experimental_backgroundImage: gradients.onboardingGlow,
      }}
    >
      {features.sprinkles && logo.spark ? (
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute" }}>
          <G fill={logo.spark}>
            <G transform={`translate(${width * 0.18}, ${height * 0.3}) scale(2)`}><Path d={SPARKLE} /></G>
            <G transform={`translate(${width * 0.82}, ${height * 0.4}) scale(1.5)`}><Path d={SPARKLE} /></G>
            <G transform={`translate(${width * 0.78}, ${height * 0.66}) scale(1.7)`}><Path d={SPARKLE} /></G>
            <G transform={`translate(${width * 0.22}, ${height * 0.68}) scale(1.3)`}><Path d={SPARKLE} /></G>
          </G>
        </Svg>
      ) : null}

      <Logo size={118} />
      <Txt naskh size={18} color={semantic.textSecondary}>
        وِرْدُكَ اليوميّ
      </Txt>
    </Animated.View>
  );
}
```

- [ ] **Step 2: Wire it into `_layout.tsx`**

In `src/app/_layout.tsx`:

(a) Change the React import on line 1 to include `useState`:

```ts
import { useEffect, useState } from "react";
```

(b) Add the splash import with the other `@/` imports (after the `useTheme` import line):

```ts
import { AppSplash } from "@/components/app-splash";
```

(c) Inside `RootLayout`, add splash state right after the `useFonts` call:

```ts
  const [splashVisible, setSplashVisible] = useState(true);
```

(d) Replace the `return (...)` block (lines ~50-56) with:

```tsx
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemedStack />
        {splashVisible ? <AppSplash onFinish={() => setSplashVisible(false)} /> : null}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
```

(Leave `if (!loaded) return null;` as-is — the native splash covers that window; the themed `AppSplash` renders only once fonts are ready, then fades.)

- [ ] **Step 3: Typecheck + lint + hex guard**

Run: `npx tsc --noEmit`
Expected: No errors.

Run: `npm test -- no-raw-hex tokens`
Expected: PASS — including `src/components/app-splash.tsx references tokens, not hex/rgba`.

- [ ] **Step 4: Manual visual check**

Cold-start the app in the dev client on both themes:
- Werd: brief native green → green themed splash (gold sunrise, no sparkles) → fades into app.
- Pink: brief native green → pink themed splash (peach sunrise, plum «وِرْد», screen sparkles) → fades into app.

- [ ] **Step 5: Commit**

```bash
git add src/components/app-splash.tsx src/app/_layout.tsx
git commit -m "feat(splash): add themed JS splash that fades into the app"
```

---

### Task 5: Final verification & native-splash note

**Files:**
- (No code changes unless the lint/typecheck below surface something.)

- [ ] **Step 1: Full test + typecheck + lint**

Run: `npm test`
Expected: PASS — all suites, including the hex guard over every `src/components` and `src/app` file.

Run: `npx tsc --noEmit`
Expected: No errors.

Run: `npx expo lint`
Expected: No new errors.

- [ ] **Step 2: Confirm the PNG is no longer referenced in-app**

Run: `grep -rn "wird-logo" src/`
Expected: No matches. (If any remain, replace each with `<Logo>` and re-run Task 3's checks.) The PNG file itself stays in `assets/` because `app.json`'s native splash still uses it (next step).

- [ ] **Step 3: Native splash — decision point (no required change)**

The native splash in `app.json` (`expo-splash-screen`: `#0e2d22` + `wird-logo.png`) renders before JS and CANNOT be per-theme. It stays the green brand splash for all themes; this is expected and documented in the spec. No change required. (Optional, out of this plan's scope: regenerate `assets/images/wird-logo.png` artwork if a cleaner static splash mark is wanted later.)

- [ ] **Step 4: Final commit (only if Step 1 required fixes)**

```bash
git add -A
git commit -m "chore: lint/type fixes for themeable logo & splash"
```

---

## Self-Review

**Spec coverage:**
- Themeable `<Logo>` component → Task 2 ✓
- `logo` token block on `Theme` + both themes → Task 1 ✓
- Sparkles gated on `features.sprinkles` → Tasks 1 (token) + 2 (gating) ✓
- Wordmark in Amiri, plum for pink / cream for werd → Task 1 (`wordmark` token) + Task 2 (`<Txt naskh>`) ✓
- Replace in-app PNG usage → Task 3 + Task 5 Step 2 ✓
- Themed JS splash reading the active theme, fade-out → Task 4 ✓
- Native splash stays static (documented) → Task 5 Step 3 ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code. The tagline «وِرْدُكَ اليوميّ» is a deliberate, named string (confirm copy with the user before/after, but it is not a placeholder token).

**Type consistency:** `LogoTokens` keys (`ground`, `sunFrom`, `sunTo`, `rays`, `wordmark`, `spark`) are used identically in Task 1 (definition), Task 2 (`<Logo>`), and Task 4 (`<AppSplash>`). `features.sprinkles` matches the existing `ThemeFeatures` flag. `shadows.darkElevated`, `gradients.logoGlow`, `gradients.onboardingGlow`, `gradients.brandCard`, `semantic.textSecondary`, `colors.gold500/gold700/creamText` all exist in the current theme files.

**Hex-guard compliance:** `logo.tsx` and `app-splash.tsx` reference only token fields for color; literals live solely in `src/theme/themes/pink.ts` (exempt from the guard). `url(#${sunId})` does not match the guard regex (the char after `#` is the non-hex letter `l`).
