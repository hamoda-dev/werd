# Design System Enhancement (Primitives + Semantic Tokens) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Encode the type scale, turn gradients into reusable CSS-string tokens, add an additive semantic color layer, ship four composition primitives (`Screen`, `Button`, `SectionHeader`, `ListRow`), migrate every screen/component onto them, and enforce "no raw hex" with a test — all visually identical to today.

**Architecture:** Layered bottom-up (approved spec approach A). Layer 1 extends `src/theme/tokens.ts` (purely additive — nothing breaks). Layer 2 adds primitives built on those tokens. Layer 3 migrates screens/components onto the primitives + `semantic.*` color names (visual-preserving). Layer 4 adds the hex-guard test. Layer 5 updates DESIGN.md.

**Tech Stack:** Expo SDK 55, React Native 0.83, TypeScript, expo-router, jest-expo. Styling via inline objects + `experimental_backgroundImage` (Expo 55 CSS-gradient idiom). `expo-haptics` already present.

**Spec:** [docs/superpowers/specs/2026-06-14-design-system-primitives-design.md](../specs/2026-06-14-design-system-primitives-design.md)

**Ground rules for every task:**
- **Visual-preserving.** Match current pixels exactly. A visual diff is a bug, not an improvement. Direction B is locked.
- **No raw `<Text>`** — always `<Txt>`. **RTL:** `textAlign: "auto"`, never `"right"` (see project memory *RTL convention*).
- Before writing any code, the worker MUST verify Expo-55 APIs (`experimental_backgroundImage`, `expo-haptics`) against https://docs.expo.dev/versions/v55.0.0/ per AGENTS.md.
- Tests live at `src/**/__tests__/**/*.test.ts` (the jest `testMatch` is `.test.ts` only — no `.tsx`). New tests are pure TypeScript; do NOT add render tests or new deps.
- Commit after each task. Conventional-commit messages. Co-author trailer as configured.

---

## The literal → token mapping (single source of truth for Layer 3)

Every migrated file replaces color/gradient/shadow **literals** with these tokens. This table is exhaustive for the codebase; if a worker finds a literal not covered here, tokenize it (add to `semantic`/`colors`) rather than leaving it.

| Current literal | Replace with |
|---|---|
| `colors.green800` (as screen/base bg or text-on-cream) | `semantic.screen` (bg) / `semantic.textOnCream` (text) |
| `colors.green700` (evening/brand card) | `semantic.brandSurface` |
| `colors.green900` | `semantic.screenDeep` |
| `colors.whiteAlpha06` | `semantic.surface` |
| `colors.whiteAlpha08` | `semantic.surfaceStrong` |
| `colors.whiteAlpha14` (track/border/fill) | `semantic.surfaceFaint` (fill/track) / `semantic.border` (dashed border) |
| `colors.cream50` | `semantic.surfaceCream` |
| `colors.cream100` | `semantic.screenCream` |
| `colors.cream200` | `semantic.surfaceCreamAlt` |
| `colors.creamText` | `semantic.textPrimary` |
| `colors.muted3` | `semantic.textSecondary` |
| `colors.muted2` | `semantic.textTertiary` |
| `colors.muted1` | `semantic.textMutedCream` |
| `colors.gold500` | `semantic.accent` |
| `colors.gold300` | `semantic.accentLight` |
| `colors.gold700` | `semantic.accentDeep` |
| `colors.sage` | `semantic.success` |
| `colors.terracotta500` | `semantic.warm` |
| `colors.terracotta700` | `semantic.warmDeep` |
| `colors.borderWarm` | `semantic.borderCream` |
| `colors.goldAlpha25` | `semantic.goldHairline` |
| `"#fff"` (text/icon on colored fills, switch thumbs) | `semantic.textOnColor` |
| `"rgba(255,255,255,0.85)"` | `semantic.textOnColorMuted` |
| `"#cfe0d6"` (تصفير label) | `semantic.textGhost` |
| `experimental_backgroundImage: "linear-gradient(180deg, #16352a 0%, #0e2d22 100%)"` | `<Screen>` (screens) or `experimental_backgroundImage: gradients.darkScreen` |
| `"linear-gradient(150deg, #c8784e, #a85733)"` | `gradients.terracotta` |
| `"linear-gradient(150deg, #d8b46a, #bf9648)"` | `gradients.gold` |
| `badgeGradientCss[def.gradient]` | `gradients[def.gradient]` |
| `"0 16px 32px -16px rgba(168,87,51,0.6)"` (boxShadow) | `shadows.terracotta` |
| `"rgba(14,45,34,0.96)"` (tab-bar fill) | `semantic.tabBar` |
| onboarding radial-glow string | `gradients.onboardingGlow` |

Cell tokens (`partialCell`, `futureCell`, `lockedTile`, …) and `fonts`/`radii`/`spacing` are **unchanged**.

---

## Layer 1 — Tokens

### Task 1: Type scale `text` + `Txt` variant

**Files:**
- Modify: `src/theme/tokens.ts`
- Modify: `src/components/txt.tsx`
- Test: `src/theme/__tests__/tokens.test.ts` (create)

- [ ] **Step 1: Write the failing test**

Create `src/theme/__tests__/tokens.test.ts`:

```ts
import { text } from "@/theme/tokens";

describe("text scale", () => {
  const variants = ["title", "heading", "subheading", "body", "label", "caption", "micro"] as const;
  it("defines every variant with numeric size + lineHeight and a valid weight", () => {
    for (const k of variants) {
      expect(typeof text[k].size).toBe("number");
      expect(typeof text[k].lineHeight).toBe("number");
      expect(["regular", "medium", "semibold", "bold"]).toContain(text[k].weight);
    }
  });
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `npx jest src/theme/__tests__/tokens.test.ts`
Expected: FAIL — `text` is not exported from tokens.

- [ ] **Step 3: Add the `text` scale to `src/theme/tokens.ts`**

Append after `spacing`:

```ts
/** Type scale — size + weight + lineHeight only. Color stays a separate, contextual prop. */
export const text = {
  title:      { size: 26, weight: "bold",    lineHeight: 34 },
  heading:    { size: 18, weight: "bold",    lineHeight: 26 },
  subheading: { size: 16, weight: "bold",    lineHeight: 24 },
  body:       { size: 15, weight: "regular", lineHeight: 24 },
  label:      { size: 14, weight: "medium",  lineHeight: 20 },
  caption:    { size: 12, weight: "regular", lineHeight: 18 },
  micro:      { size: 11, weight: "regular", lineHeight: 14 },
} as const;
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `npx jest src/theme/__tests__/tokens.test.ts`
Expected: PASS.

- [ ] **Step 5: Add the `variant` prop to `src/components/txt.tsx`**

Replace the whole file with:

```tsx
import { Text, type TextProps, type TextStyle } from "react-native";
import { colors, fonts, text as textScale } from "@/theme/tokens";

type Weight = "regular" | "medium" | "semibold" | "bold";
type Variant = keyof typeof textScale;

const SANS: Record<Weight, string> = {
  regular: fonts.sans,
  medium: fonts.sansMedium,
  semibold: fonts.sansSemiBold,
  bold: fonts.sansBold,
};

interface Props extends TextProps {
  /** Type-scale preset (size + weight + lineHeight). Explicit size/weight still override. */
  variant?: Variant;
  weight?: Weight;
  /** Use the Amiri font (for adhkar/Quran). */
  naskh?: boolean;
  size?: number;
  color?: string;
  align?: TextStyle["textAlign"];
}

/** Unified text: proper Arabic font + alignment that follows layout direction + light default color (dark theme). */
export function Txt({
  variant,
  weight,
  naskh = false,
  size,
  color = colors.creamText,
  align = "auto",
  style,
  ...rest
}: Props) {
  const preset = variant ? textScale[variant] : undefined;
  const resolvedWeight: Weight = weight ?? preset?.weight ?? "regular";
  const resolvedSize = size ?? preset?.size ?? 15;

  const fontFamily = naskh
    ? resolvedWeight === "bold"
      ? fonts.naskhBold
      : fonts.naskh
    : SANS[resolvedWeight];

  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily,
          fontSize: resolvedSize,
          color,
          textAlign: align,
          ...(preset ? { lineHeight: preset.lineHeight } : null),
        },
        style,
      ]}
    />
  );
}
```

- [ ] **Step 6: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors. (Existing `<Txt size={…} weight={…}>` calls are unchanged and still compile.)

- [ ] **Step 7: Commit**

```bash
git add src/theme/tokens.ts src/components/txt.tsx src/theme/__tests__/tokens.test.ts
git commit -m "feat(design): add type scale tokens and Txt variant prop"
```

---

### Task 2: Gradients → CSS strings

**Files:**
- Modify: `src/theme/tokens.ts`
- Modify: `src/components/badge-tile.tsx` (consumer of old `badgeGradientCss`)
- Modify: `src/app/onboarding.tsx:12` (consumer of old array `gradients.gold[0]`)
- Test: `src/theme/__tests__/tokens.test.ts`

- [ ] **Step 1: Extend the failing test**

Add to `src/theme/__tests__/tokens.test.ts`:

```ts
import { gradients } from "@/theme/tokens";

describe("gradients", () => {
  const keys = ["darkScreen", "brandCard", "gold", "sage", "terracotta", "onboardingGlow"] as const;
  it("are ready-to-use css gradient strings", () => {
    for (const k of keys) {
      expect(typeof gradients[k]).toBe("string");
      expect(gradients[k]).toMatch(/gradient\(/);
    }
  });
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `npx jest src/theme/__tests__/tokens.test.ts`
Expected: FAIL — `gradients.darkScreen` is currently an array, `toMatch` throws / `onboardingGlow` undefined.

- [ ] **Step 3: Replace `gradients` and delete `badgeGradientCss` in `src/theme/tokens.ts`**

Replace the existing `gradients` object AND the `badgeGradientCss` object with:

```ts
/** Background gradients as ready-to-use CSS strings (Expo 55 `experimental_backgroundImage`). */
export const gradients = {
  darkScreen: "linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
  brandCard:  "linear-gradient(150deg, #1c4a3a, #0e2d22)",
  gold:       "linear-gradient(150deg, #d8b46a, #bf9648)",
  sage:       "linear-gradient(150deg, #3f8268, #2c5e4a)",
  terracotta: "linear-gradient(150deg, #c8784e, #a85733)",
  onboardingGlow:
    "radial-gradient(circle at 50% 18%, rgba(216,180,106,0.28) 0%, transparent 55%), linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
} as const;
```

- [ ] **Step 4: Update the two old-shape consumers**

In `src/components/badge-tile.tsx`: change the import `badgeGradientCss, colors, radii` → `colors, gradients, radii`, and line 21 `experimental_backgroundImage: unlocked ? badgeGradientCss[def.gradient] : undefined,` → `experimental_backgroundImage: unlocked ? gradients[def.gradient] : undefined,`. (`def.gradient` is `"gold" | "sage" | "terracotta"` — all present.)

In `src/app/onboarding.tsx`: line 12 `const goldGradient = \`linear-gradient(150deg, ${gradients.gold[0]}, ${gradients.gold[1]})\`;` → delete this line and use `gradients.gold` directly where `goldGradient` was referenced.

- [ ] **Step 5: Run test + typecheck**

Run: `npx jest src/theme/__tests__/tokens.test.ts && npx tsc --noEmit`
Expected: PASS, no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/theme/tokens.ts src/components/badge-tile.tsx src/app/onboarding.tsx
git commit -m "feat(design): gradients as reusable CSS-string tokens"
```

---

### Task 3: Semantic color layer

**Files:**
- Modify: `src/theme/tokens.ts`
- Test: `src/theme/__tests__/tokens.test.ts`

- [ ] **Step 1: Extend the failing test**

Add to `src/theme/__tests__/tokens.test.ts`:

```ts
import { semantic, colors } from "@/theme/tokens";

describe("semantic colors alias the palette", () => {
  it("maps representative roles to the right palette values", () => {
    expect(semantic.screen).toBe(colors.green800);
    expect(semantic.surface).toBe(colors.whiteAlpha06);
    expect(semantic.brandSurface).toBe(colors.green700);
    expect(semantic.textPrimary).toBe(colors.creamText);
    expect(semantic.textSecondary).toBe(colors.muted3);
    expect(semantic.accent).toBe(colors.gold500);
    expect(semantic.accentLight).toBe(colors.gold300);
    expect(semantic.success).toBe(colors.sage);
    expect(semantic.border).toBe(colors.whiteAlpha14);
  });
  it("tokenizes the former literals", () => {
    expect(semantic.textOnColor).toBe("#fff");
    expect(semantic.textGhost).toBe("#cfe0d6");
    expect(semantic.tabBar).toBe("rgba(14,45,34,0.96)");
  });
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `npx jest src/theme/__tests__/tokens.test.ts`
Expected: FAIL — `semantic` not exported.

- [ ] **Step 3: Add the `semantic` map to `src/theme/tokens.ts`**

Append at the end of the file:

```ts
/** Semantic (role-based) color aliases. Additive — references the palette above. */
export const semantic = {
  // Surfaces — dark
  screen:        colors.green800,
  screenDeep:    colors.green900,
  surface:       colors.whiteAlpha06,
  surfaceStrong: colors.whiteAlpha08,
  surfaceFaint:  colors.whiteAlpha14,
  brandSurface:  colors.green700,
  // Surfaces — cream / light
  surfaceCream:    colors.cream50,
  surfaceCreamAlt: colors.cream200,
  screenCream:     colors.cream100,
  // Text
  textPrimary:      colors.creamText,
  textSecondary:    colors.muted3,
  textOnColor:      "#fff",
  textOnColorMuted: "rgba(255,255,255,0.85)",
  textOnCream:      colors.green800,
  textMutedCream:   colors.muted1,
  textTertiary:     colors.muted2,
  textGhost:        "#cfe0d6",
  // Accent / status
  accent:      colors.gold500,
  accentLight: colors.gold300,
  accentDeep:  colors.gold700,
  success:     colors.sage,
  warm:        colors.terracotta500,
  warmDeep:    colors.terracotta700,
  // Lines / chrome
  border:       colors.whiteAlpha14,
  borderCream:  colors.borderWarm,
  goldHairline: colors.goldAlpha25,
  tabBar:       "rgba(14,45,34,0.96)",
} as const;
```

- [ ] **Step 4: Run test + typecheck + full suite**

Run: `npx jest src/theme/__tests__/tokens.test.ts && npx tsc --noEmit && npm test`
Expected: all PASS (nothing consumes `semantic` yet — additive).

- [ ] **Step 5: Commit**

```bash
git add src/theme/tokens.ts src/theme/__tests__/tokens.test.ts
git commit -m "feat(design): add additive semantic color layer"
```

---

## Layer 2 — Primitives

### Task 4: `Screen`

**Files:**
- Create: `src/components/screen.tsx`

- [ ] **Step 1: Verify the Expo 55 background-image idiom**

Confirm `experimental_backgroundImage` is current at https://docs.expo.dev/versions/v55.0.0/ (it is already used across the app — sanity-check only).

- [ ] **Step 2: Write `src/components/screen.tsx`**

```tsx
import type { ReactNode } from "react";
import { ScrollView, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { gradients, semantic, spacing } from "@/theme/tokens";

interface Props {
  children: ReactNode;
  /** Which background gradient to paint. */
  gradient?: keyof typeof gradients;
  /** Scroll the content (default) or render a padded fixed View. */
  scroll?: boolean;
  /** Override/extend the content container padding (e.g. edge-to-edge headers). */
  contentStyle?: ViewStyle;
}

/** Screen scaffold: gradient background + safe-area + standard padding (scroll or fixed). */
export function Screen({ children, gradient = "darkScreen", scroll = true, contentStyle }: Props) {
  const insets = useSafeAreaInsets();
  const content: ViewStyle = {
    paddingTop: insets.top + spacing.lg,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: semantic.screen,
        experimental_backgroundImage: gradients[gradient],
      }}
    >
      {scroll ? (
        <ScrollView contentContainerStyle={[content, contentStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, content, contentStyle]}>{children}</View>
      )}
    </View>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/screen.tsx
git commit -m "feat(design): add Screen primitive"
```

---

### Task 5: `Button`

**Files:**
- Create: `src/components/button.tsx`

- [ ] **Step 1: Verify expo-haptics usage**

`expo-haptics` is already imported in `src/components/tasbih-counter.tsx`. Match that import style. Confirm `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` against https://docs.expo.dev/versions/v55.0.0/sdk/haptics/.

- [ ] **Step 2: Write `src/components/button.tsx`**

```tsx
import type { ReactNode } from "react";
import { Pressable, View, type ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { gradients, radii, semantic, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";

type Variant = "primary" | "ghost" | "link";

interface Props {
  children: ReactNode;
  onPress: () => void;
  variant?: Variant;
  icon?: string;
  haptic?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const FILL: Record<Variant, ViewStyle> = {
  primary: {
    experimental_backgroundImage: gradients.gold,
    backgroundColor: semantic.accent,
    borderRadius: radii.pill,
    borderCurve: "continuous",
    paddingVertical: 16,
    paddingHorizontal: spacing.xl,
  },
  ghost: {
    backgroundColor: semantic.surfaceStrong,
    borderRadius: radii.pill,
    borderCurve: "continuous",
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
  },
  link: {},
};

const TEXT_COLOR: Record<Variant, string> = {
  primary: semantic.textOnCream,
  ghost: semantic.textGhost,
  link: semantic.accentLight,
};

/** Unified button. Variants match the app's existing CTAs; text always renders through Txt. */
export function Button({ children, onPress, variant = "primary", icon, haptic = true, disabled = false, style }: Props) {
  function handlePress() {
    if (disabled) return;
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  const color = TEXT_COLOR[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        FILL[variant],
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={18} color={color} /> : null}
      <Txt variant="label" weight={variant === "link" ? "semibold" : "bold"} color={color}>
        {children}
      </Txt>
    </Pressable>
  );
}
```

> Note: `primary` paints both `backgroundColor` (fallback) and the gold gradient. Screens whose
> existing primary CTA is a flat cream fill (e.g. `list` "ابدأ المسبحة") keep that look by passing
> `style={{ backgroundColor: semantic.surfaceCream, experimental_backgroundImage: undefined }}`
> during their migration task — recorded per-screen below.

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/button.tsx
git commit -m "feat(design): add Button primitive with haptics"
```

---

### Task 6: `SectionHeader`

**Files:**
- Create: `src/components/section-header.tsx`

- [ ] **Step 1: Write `src/components/section-header.tsx`**

```tsx
import type { ReactNode } from "react";
import { View } from "react-native";
import { spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";

/** Section header: title on the leading edge, optional action (usually a link Button) trailing. */
export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: spacing.xs,
      }}
    >
      <Txt variant="heading">{title}</Txt>
      {action}
    </View>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/section-header.tsx
git commit -m "feat(design): add SectionHeader primitive"
```

---

### Task 7: `ListRow`

**Files:**
- Create: `src/components/list-row.tsx`

- [ ] **Step 1: Write `src/components/list-row.tsx`**

```tsx
import type { ReactNode } from "react";
import { Pressable, type ViewStyle } from "react-native";
import { radii, semantic, spacing } from "@/theme/tokens";
import { Icon } from "@/components/icon";

interface Props {
  children: ReactNode;
  onPress: () => void;
  onLongPress?: () => void;
  /** Trailing element; defaults to a forward chevron. */
  accessory?: ReactNode;
  style?: ViewStyle;
}

/** Translucent rounded pressable row (awrad items, category lists). */
export function ListRow({ children, onPress, onLongPress, accessory, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.sm,
          backgroundColor: semantic.surface,
          borderRadius: radii.tile,
          borderCurve: "continuous",
          padding: spacing.lg,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {children}
      {accessory ?? <Icon name="chevron.forward" size={18} color={semantic.textTertiary} />}
    </Pressable>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/list-row.tsx
git commit -m "feat(design): add ListRow primitive"
```

---

## Layer 3 — Migration (visual-preserving)

For each task: apply the **literal → token mapping** table, run `npx tsc --noEmit && npm run lint && npm test`, then commit. After Layer 3 the hex-guard (Layer 4) will confirm completeness.

### Task 8: Migrate shared sub-components to semantic + shadow tokens

**Files (Modify):** `src/components/streak-hero.tsx`, `badge-tile.tsx`, `card.tsx`, `progress-bar.tsx`, `level-card.tsx`, `stat-chip.tsx`, `tab-bar.tsx`

- [ ] **Step 1: `streak-hero.tsx`** — import `gradients, radii, semantic, shadows, spacing`; replace:
  - `backgroundColor: colors.terracotta500` → `backgroundColor: semantic.warm`
  - `experimental_backgroundImage: "linear-gradient(150deg, #c8784e, #a85733)"` → `experimental_backgroundImage: gradients.terracotta`
  - `boxShadow: "0 16px 32px -16px rgba(168,87,51,0.6)"` → `boxShadow: shadows.terracotta`
  - both `color="#fff"` → `color={semantic.textOnColor}`
  - `color="rgba(255,255,255,0.85)"` → `color={semantic.textOnColorMuted}`

- [ ] **Step 2: `badge-tile.tsx`** — import `colors, gradients, radii, semantic`; replace:
  - `backgroundColor: unlocked ? colors.gold700 : colors.lockedTile` → `backgroundColor: unlocked ? semantic.accentDeep : colors.lockedTile` (`lockedTile` stays — it's a cell token)
  - `color={unlocked ? "#fff" : colors.muted2}` → `color={unlocked ? semantic.textOnColor : semantic.textTertiary}`
  - `color={unlocked ? "#fff" : colors.muted1}` → `color={unlocked ? semantic.textOnColor : semantic.textMutedCream}`

- [ ] **Step 3: `card.tsx`** — `backgroundColor: colors.whiteAlpha06` → `semantic.surface` (import `radii, semantic, spacing`).

- [ ] **Step 4: `progress-bar.tsx`** — defaults `color = colors.gold500` → `semantic.accent`, `track = colors.whiteAlpha14` → `semantic.surfaceFaint` (import `semantic`).

- [ ] **Step 5: `level-card.tsx`** — replace `colors.creamText`→`semantic.textPrimary`, `colors.gold300`→`semantic.accentLight`, `colors.gold500`→`semantic.accent`, `colors.muted3`→`semantic.textSecondary` (import `semantic`).

- [ ] **Step 6: `stat-chip.tsx`** — `colors.whiteAlpha06`→`semantic.surface`, `colors.gold300`→`semantic.accentLight`, `colors.muted3`→`semantic.textSecondary` (import `radii, semantic, spacing`).

- [ ] **Step 7: `tab-bar.tsx`** — `backgroundColor: "rgba(14,45,34,0.96)"`→`semantic.tabBar`, `borderTopColor: colors.whiteAlpha08`→`semantic.surfaceStrong`, `colors.gold500`→`semantic.accent`, `colors.gold300`→`semantic.accentLight`, `colors.muted2`→`semantic.textTertiary`, `colors.creamText`→`semantic.textPrimary` (import `semantic, spacing`).

- [ ] **Step 8: Verify + commit**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: all pass.
```bash
git add src/components/streak-hero.tsx src/components/badge-tile.tsx src/components/card.tsx src/components/progress-bar.tsx src/components/level-card.tsx src/components/stat-chip.tsx src/components/tab-bar.tsx
git commit -m "refactor(design): migrate shared components to semantic + shadow tokens"
```

---

### Task 9: Migrate `WardForm` to `Screen` + `Button` + semantic

**Files (Modify):** `src/components/ward-form.tsx`

- [ ] **Step 1: Replace the root gradient `View` + `ScrollView`** with `<Screen scroll>` is **not** a fit here (WardForm needs `keyboardShouldPersistTaps` + bottom-inset padding). Instead keep its own `ScrollView` but tokenize the wrapper: root `View` style `backgroundColor: colors.green800` → `semantic.screen`, `experimental_backgroundImage: "linear-gradient(180deg, …)"` → `gradients.darkScreen`.

- [ ] **Step 2: Tokenize the rest** via the mapping: in `fieldStyle` `colors.whiteAlpha08`→`semantic.surfaceStrong`, `colors.creamText`→`semantic.textPrimary`; placeholder/icon `colors.muted2`→`semantic.textTertiary`; counter buttons `colors.whiteAlpha08`→`semantic.surfaceStrong`, `colors.creamText`→`semantic.textPrimary`; count `colors.gold300`→`semantic.accentLight`; delete label `colors.terracotta500`→`semantic.warm`.

- [ ] **Step 3: Replace the submit `Pressable`** with `Button`:

```tsx
<Button
  variant="primary"
  onPress={submit}
  disabled={!valid}
  style={{ marginTop: spacing.sm }}
>
  {submitLabel}
</Button>
```

(`Button` already paints the gold gradient and `textOnCream` label; disabled handling matches the old `!valid` opacity intent. Import `Button`, drop `radii.pill`/manual button styles. The delete link stays a plain `Pressable` — it's destructive, not a standard CTA.)

- [ ] **Step 4: Verify + commit**

Run: `npx tsc --noEmit && npm run lint && npm test`
```bash
git add src/components/ward-form.tsx
git commit -m "refactor(design): WardForm uses gradient token + Button"
```

---

### Task 10: Migrate the home screen (`index.tsx`)

**Files (Modify):** `src/app/(tabs)/index.tsx`

- [ ] **Step 1: Replace the root `View` + `ScrollView`** (lines 56–71) with `<Screen>`:

```tsx
return (
  <Screen>
    {/* Greeting */}
    …existing children, unindented one level…
  </Screen>
);
```

Remove `useSafeAreaInsets`/`insets` usage and the `ScrollView` import if now unused. The `Screen` padding contract matches the old `paddingTop: insets.top + lg`, `paddingBottom: xxl`, `paddingHorizontal: xl`, `gap: lg`.

- [ ] **Step 2: Replace the "أورادي" header block** (lines 192–202) with:

```tsx
<SectionHeader
  title="أورادي"
  action={
    <Button variant="link" icon="plus" onPress={() => router.push("/awrad/new")}>
      إضافة وِرد
    </Button>
  }
/>
```

- [ ] **Step 3: Replace each awrad `Pressable`** (lines 222–243) with `ListRow`:

```tsx
<ListRow
  key={w.id}
  onPress={() => router.push({ pathname: "/session/[category]", params: { category: w.id } })}
  onLongPress={() => router.push({ pathname: "/awrad/[id]", params: { id: w.id } })}
>
  <View style={{ flex: 1, gap: 2 }}>
    <Txt variant="body" weight="semibold" color={semantic.textPrimary} numberOfLines={1}>{w.title}</Txt>
    <Txt variant="caption" color={semantic.textSecondary}>التكرار: {toArabicNumerals(w.count)}</Txt>
  </View>
</ListRow>
```

- [ ] **Step 4: Apply the color mapping** to the remaining inline `colors.*` in this file (greeting, week dots, morning/evening cards, daily-challenge card, empty state): `creamText`→`textPrimary`, `muted3`→`textSecondary`, `muted1`→`textMutedCream`, `gold500`→`accent`, `gold300`→`accentLight`, `gold700`→`accentDeep`, `green800`→`textOnCream` (on cream card) / `screen` where bg, `green700`→`brandSurface`, `cream50`→`surfaceCream`, `sage`→`success`, `whiteAlpha06`→`surface`, `whiteAlpha08`→`surfaceStrong`, `whiteAlpha14`→`border` (dashed) / `surfaceFaint` (fills), `borderWarm`→`borderCream`, `"#fff"` checkmark → `textOnColor` where present. Update imports to pull `semantic` (drop now-unused `colors` if fully replaced — keep `radii`, `spacing`).

- [ ] **Step 5: Verify + commit**

Run: `npx tsc --noEmit && npm run lint && npm test`
```bash
git add src/app/(tabs)/index.tsx
git commit -m "refactor(design): home screen uses Screen/SectionHeader/ListRow + semantic"
```

---

### Task 11: Migrate tasbih + session screens

**Files (Modify):** `src/app/(tabs)/tasbih.tsx`, `src/app/session/[category].tsx`

- [ ] **Step 1: Wrap each in `<Screen>`.** Both currently use a root gradient `View` + `ScrollView`. tasbih scrolls → `<Screen>`. session scrolls → `<Screen>` but has an edge-to-edge header → pass `contentStyle={{ paddingHorizontal: 0 }}` and keep the header/body padding local, OR keep its current `ScrollView` and only tokenize the wrapper (`backgroundColor`→`semantic.screen`, gradient→`gradients.darkScreen`) if the header layout makes `Screen` awkward. Choose whichever yields **zero visual change**; record the choice in the commit message.

- [ ] **Step 2: Replace the "تصفير" reset `Pressable`** (tasbih:~97, session:~213) with:

```tsx
<Button variant="ghost" onPress={reset}>تصفير</Button>
```

(matches the current `whiteAlpha08` fill + `#cfe0d6` label, now `semantic.surfaceStrong` + `semantic.textGhost`).

- [ ] **Step 3: session "الذكر التالي / إنهاء ✓" button** (session:~227) — replace with `Button variant="ghost"` (or `primary` if it is currently a gold fill — inspect and match exactly). Keep the dynamic label.

- [ ] **Step 4: Apply the color mapping** to remaining `colors.*` in both files.

- [ ] **Step 5: Verify + commit**

Run: `npx tsc --noEmit && npm run lint && npm test`
```bash
git add "src/app/(tabs)/tasbih.tsx" "src/app/session/[category].tsx"
git commit -m "refactor(design): tasbih + session use Screen + Button + semantic"
```

---

### Task 12: Migrate the category list screen

**Files (Modify):** `src/app/list/[category].tsx`

- [ ] **Step 1: Wrap in `<Screen>`** (it has a header — use `contentStyle` to control horizontal padding so the header matches today; zero visual change).

- [ ] **Step 2: Replace the "ابدأ المسبحة" CTA** (line ~129) with `Button`. Inspect its current fill: if cream/flat with `green800` text, use:

```tsx
<Button
  variant="primary"
  onPress={start}
  style={{ backgroundColor: semantic.surfaceCream, experimental_backgroundImage: undefined }}
>
  ابدأ المسبحة
</Button>
```

else use plain `variant="primary"`. Match the current pixels.

- [ ] **Step 3: Replace dhikr/category item `Pressable`s** with `ListRow` where the shape matches (icon/title/chevron). The checkmark `color="#fff"` (line ~96) → `semantic.textOnColor`.

- [ ] **Step 4: Apply the color mapping** to remaining `colors.*`.

- [ ] **Step 5: Verify + commit**

Run: `npx tsc --noEmit && npm run lint && npm test`
```bash
git add "src/app/list/[category].tsx"
git commit -m "refactor(design): category list uses Screen + Button + ListRow + semantic"
```

---

### Task 13: Migrate the remaining tab/stack screens

**Files (Modify):** `src/app/(tabs)/achievements.tsx`, `src/app/(tabs)/profile.tsx`, `src/app/stats.tsx`, `src/app/challenges.tsx`, `src/app/settings/reminders.tsx`

- [ ] **Step 1: Wrap each in `<Screen>`** (all five scroll). For `challenges`/`stats` whose featured cards use `gradients.gold`/`gradients.darkScreen` literals, replace those `experimental_backgroundImage` strings with the gradient tokens (`gradients.gold` for the featured gold card; the screen background is handled by `<Screen>`).

- [ ] **Step 2: Tokenize switch thumbs** — `thumbColor="#fff"` in `reminders.tsx:120` and `profile.tsx:98` → `thumbColor={semantic.textOnColor}`.

- [ ] **Step 3: `stats.tsx`** — `complete: { bg: colors.green700, fg: "#fff" }` → `{ bg: semantic.brandSurface, fg: semantic.textOnColor }`; keep the calendar cell tokens (`partialCell`, etc.) as-is.

- [ ] **Step 4: Apply the color mapping** to all remaining `colors.*` in the five files.

- [ ] **Step 5: Verify + commit**

Run: `npx tsc --noEmit && npm run lint && npm test`
```bash
git add "src/app/(tabs)/achievements.tsx" "src/app/(tabs)/profile.tsx" src/app/stats.tsx src/app/challenges.tsx src/app/settings/reminders.tsx
git commit -m "refactor(design): remaining screens use Screen + semantic tokens"
```

---

### Task 14: Migrate onboarding

**Files (Modify):** `src/app/onboarding.tsx`

- [ ] **Step 1: Wrap in `<Screen gradient="onboardingGlow" scroll={false}>`** (onboarding is a fixed layout with the radial glow). This removes the inline radial+linear string (now `gradients.onboardingGlow`) and the manual safe-area handling. If the existing layout needs custom vertical distribution, pass `contentStyle` rather than reintroducing a raw gradient View.

- [ ] **Step 2: Replace the "ابدأ" CTA** (line ~157, currently `backgroundColor: "#fff"`) with:

```tsx
<Button
  variant="primary"
  onPress={start}
  style={{ backgroundColor: semantic.surfaceCream, experimental_backgroundImage: undefined }}
>
  ابدأ
</Button>
```

(matches the current white/cream fill). Remove the now-unused `goldGradient`/`#fff` literals.

- [ ] **Step 3: Apply the color mapping** to remaining `colors.*` and any `#fff` text on the button → `semantic.textOnCream`.

- [ ] **Step 4: Verify + commit**

Run: `npx tsc --noEmit && npm run lint && npm test`
```bash
git add src/app/onboarding.tsx
git commit -m "refactor(design): onboarding uses Screen (glow) + Button + semantic"
```

---

## Layer 4 — Enforcement

### Task 15: Hex-guard test

**Files:**
- Create: `src/theme/__tests__/no-raw-hex.test.ts`

- [ ] **Step 1: Write the guard test**

```ts
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const ROOTS = ["src/app", "src/components"];
/** Literals allowed to remain. Should be EMPTY after migration. */
const ALLOW: string[] = [];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const FILES = ROOTS
  .flatMap((r) => walk(join(process.cwd(), r)))
  .filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes("__tests__"));

const LITERAL = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g;

describe("no raw color literals outside tokens", () => {
  for (const file of FILES) {
    it(`${file.replace(process.cwd() + "/", "")} references tokens, not hex/rgba`, () => {
      const matches = (readFileSync(file, "utf8").match(LITERAL) ?? []).filter((m) => !ALLOW.includes(m));
      expect(matches).toEqual([]);
    });
  }
});
```

- [ ] **Step 2: Run it — expected PASS**

Run: `npx jest src/theme/__tests__/no-raw-hex.test.ts`
Expected: PASS (Layer 3 removed every literal). **If it fails**, the failure lists the offending file + literal — fix that file via the mapping table (do NOT expand `ALLOW`), then re-run.

- [ ] **Step 3: Prove the guard bites**

Temporarily add `const x = "#123456";` to any file under `src/components`, run the test, confirm it FAILS naming that file, then remove the line and confirm PASS again.

- [ ] **Step 4: Commit**

```bash
git add src/theme/__tests__/no-raw-hex.test.ts
git commit -m "test(design): guard against raw color literals in app/components"
```

---

## Layer 5 — Documentation

### Task 16: Update DESIGN.md

**Files (Modify):** `DESIGN.md`

- [ ] **Step 1: Document the new tokens** — add subsections for the `text` type scale (§3 Typography), the `gradients` CSS-string record (§2 Color → Gradients, replacing the array description), and the `semantic` color layer (new §2 subsection with the role→palette table).

- [ ] **Step 2: Document the primitives** — add a "Primitives" section covering `Screen` (gradient/scroll/contentStyle), `Button` (3 variants + haptic), `SectionHeader`, and `ListRow`, with one usage snippet each.

- [ ] **Step 3: Fix the stale `Txt` claim** — §3 currently states `Txt` defaults to `align="right"` and `writingDirection: "rtl"`. Change it to: defaults `align="auto"` (RN flips alignment under RTL — see project memory *RTL convention*), no `writingDirection` set, optional `variant` for the type scale.

- [ ] **Step 4: Update the "Intentional literals" note** — it now lists only token references; the former `#fff` / `#cfe0d6` / tab-bar literals are tokenized (`semantic.textOnColor` / `textGhost` / `tabBar`). State that the hex-guard test enforces this.

- [ ] **Step 5: Commit**

```bash
git add DESIGN.md
git commit -m "docs(design): document type scale, gradients, semantic layer, primitives"
```

---

## Final verification

- [ ] `npx tsc --noEmit` — clean.
- [ ] `npm run lint` — clean.
- [ ] `npm test` — green, including `tokens.test.ts` and `no-raw-hex.test.ts`.
- [ ] **Manual smoke on a dev build** (project memory *Dev build required* — `npx expo start --dev-client`, NOT Expo Go). Walk every screen — home, tasbih, session, list, achievements, profile, stats, challenges, reminders, onboarding, awrad new/edit — and confirm **no visual change** vs. `main`.
- [ ] Use `superpowers:finishing-a-development-branch` to open the PR.

---

## Self-review notes (author)

- **Spec coverage:** §3a→Task 1, §3b→Task 2, §3c→Task 3, §4a→Task 4, §4b→Task 5, §4c→Task 6, §4d→Task 7, migration (§2 visual-preserving)→Tasks 8–14, §5 guard→Task 15, §6 docs→Task 16. All spec sections mapped.
- **Improvement over spec:** the tab-bar fill (`rgba(14,45,34,0.96)`) and onboarding glow are tokenized (`semantic.tabBar`, `gradients.onboardingGlow`), so the hex-guard `ALLOW` list is empty rather than the spec's "one survivor".
- **Type consistency:** `text` variant keys, `gradients` keys (incl. `onboardingGlow`), and `semantic` keys used in Tasks 4–14 all match their Task 1–3 definitions. `Button` variant names (`primary`/`ghost`/`link`) are consistent across Tasks 5, 9–14.
- **Known judgement calls left to the worker (with explicit "match the pixels" instruction):** whether `session`/`list`/onboarding use `<Screen>` directly or only tokenize their wrapper (header-bleed layouts), and the exact `primary` fill (gold gradient vs. cream) per CTA. These depend on current per-screen rendering and are called out inline.
