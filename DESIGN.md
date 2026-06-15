# وِرْد — Design System

> The single, **self-contained** source of truth for how **Wird (وِرْد)** looks, feels, and moves.
> This document fully absorbs the original `design_handoff_werd_app/` package (its README, the HTML prototypes, the logo system, and the prototype logic) and reconciles it with the **shipped** implementation in [src/](src/). The handoff folder has been retired — **nothing here depends on it**.
> Code values below are real — lifted from the codebase, not the prototype. When the two disagree, **the code wins** and this file follows it.

**Wird** is a **cross-platform mobile app (Android + iOS)**, fully **offline**, for morning & evening *adhkar* (Islamic remembrances). It's built with **Expo SDK 55 / React Native / TypeScript / expo-router**. It pairs a calm, spiritual surface with light gamification — an interactive digital tasbih (counter), a daily streak, points/levels, and gentle reminders — to help users keep their daily *wird* without breaking the chain. Everything is Arabic, right‑to‑left, with Eastern‑Arabic numerals.

---

## 1. Design Direction

Three home directions were explored during design (A — Calm & Spiritual, B — Playful & Motivating, C — Elegant & Focused). **Direction B is the locked, shipped direction** and everything in this document assumes it.

> **B — Playful & Motivating.** A deep‑green night surface where the **streak is the hero**, progress is always visible, and every completed dhikr is rewarded with motion, haptics, points, and level‑up momentum.

This decision is final — do not re‑introduce A or C surfaces. See the recorded rationale in project memory (*Werd key decisions*).

### Principles

1. **Calm first, game second.** Gamification motivates; it never shouts. Warm gold rewards over a still green night, not confetti everywhere.
2. **The word is sacred.** Dhikr text is set in Amiri (Naskh) with generous line‑height and breathing room — never cramped, never decorated.
3. **Arabic‑native, not translated.** Hard RTL, Eastern‑Arabic numerals everywhere (٠١٢٣٤٥٦٧٨٩), Arabic‑first type. The layout was born right‑to‑left.
4. **One core, reused.** The tasbih counter is the heart. Built‑in adhkar and the user's own *awrad* run through the **same** [TasbihCounter](src/components/tasbih-counter.tsx) with identical behavior.
5. **Offline & instant.** No network in the core loop. Everything is local; the UI never waits on a request.
6. **One app, both platforms.** Identical UX on Android and iOS, with platform‑native touches that degrade gracefully: SF Symbols + haptics on iOS, readable Unicode/flat equivalents on Android. Nothing iOS‑only is load‑bearing.

---

## 2. Color

All colors live in [`src/theme/tokens.ts`](src/theme/tokens.ts) as `colors`. Reference them by token — never hard‑code a hex in a component (the few literal `#fff`/rgba values that remain are intentional one‑offs noted below).

### Greens — the surface
| Token | Hex | Role |
|-------|-----|------|
| `green900` | `#0e2d22` | Darkest background; gradient end; adaptive‑icon & splash background |
| `green800` | `#16352a` | Primary dark surface; default screen `backgroundColor`; gradient start |
| `green700` | `#1c4a3a` | Brand green; evening card; brand‑card gradient start |
| `sage` | `#3f8268` | Success / completed states; done segments & progress fills |

### Gold — the reward
| Token | Hex | Role |
|-------|-----|------|
| `gold500` | `#d8b46a` | Primary accent: progress rings, primary buttons, sun, active streak dots, notification accent |
| `gold300` | `#f4d68a` | Light gold: glow, active icons, secondary accent text on dark |
| `gold700` | `#bf9648` | Gold depth: morning sun glyph, gradient end |

### Terracotta — the streak / warmth
| Token | Hex | Role |
|-------|-----|------|
| `terracotta500` | `#c8784e` | Streak hero card; warm alerts; gradient start |
| `terracotta700` | `#a85733` | Streak gradient end; streak shadow tint |

### Cream — light surfaces & text on dark
| Token | Hex | Role |
|-------|-----|------|
| `cream50` | `#fffdf7` | Cards on dark (e.g. morning card) |
| `cream100` | `#faf7f0` | Light screen background (used on light surfaces) |
| `cream200` | `#f6efe2` | Subtle fills / tiles |
| `creamText` | `#f4ede0` | **Default text/icon color on the dark theme** (the `Txt` default) |

### Muted text & borders
| Token | Hex | Role |
|-------|-----|------|
| `muted1` | `#6b7a72` | Secondary text on cream |
| `muted2` | `#8a9389` | Tertiary text; inactive tab icon/label |
| `muted3` | `#9fb3a8` | Captions on dark surfaces |
| `borderWarm` | `#e7e0d0` | Hairline borders & progress tracks on cream |

### Translucent layers (on dark)
These build depth on the green night without new opaque colors:
| Token | Value | Role |
|-------|-------|------|
| `whiteAlpha06` | `rgba(255,255,255,0.06)` | Default raised card on dark (level card, awrad tiles, dhikr card) |
| `whiteAlpha08` | `rgba(255,255,255,0.08)` | Reset button; ring track; tab top hairline; empty‑day dots |
| `whiteAlpha14` | `rgba(255,255,255,0.14)` | Progress track on dark; dashed empty‑state border; upcoming segments |
| `goldAlpha25` | `rgba(216,180,106,0.25)` | Gold hairline border on the dhikr card |

**Intentional literals note (updated):** the former inline `#fff`, `rgba(255,255,255,0.85)`, `#cfe0d6`, and tab‑bar `rgba(14,45,34,0.96)` are now tokenized as `semantic.textOnColor`, `semantic.textOnColorMuted`, `semantic.textGhost`, and `semantic.tabBar` respectively. A Jest test at [`src/theme/__tests__/no-raw-hex.test.ts`](src/theme/__tests__/no-raw-hex.test.ts) **enforces** "no raw hex/rgba in `src/app` or `src/components`". The only deliberate remaining palette refs (not literals) are `colors.lockedTile` (badge-tile cell) and `colors.green900`/`colors.green700` used as text on the onboarding cream sheet (no semantic alias exists for these).

### Semantic colors
`tokens.semantic` is an **additive, role-based** alias layer over the palette. Components reference `semantic.*` — never raw palette tokens — so a future theme swap only touches `tokens.semantic`, not every component.

| Role | Alias | Palette / literal |
|------|-------|-------------------|
| `screen` | Dark screen bg | `green800` |
| `screenDeep` | Deepest bg / gradient end | `green900` |
| `surface` | Default raised card (translucent) | `whiteAlpha06` |
| `surfaceStrong` | Slightly brighter raised surface | `whiteAlpha08` |
| `surfaceFaint` | Subtle fill / progress track | `whiteAlpha14` |
| `brandSurface` | Brand-green surface | `green700` |
| `surfaceCream` | Light card on dark | `cream50` |
| `surfaceCreamAlt` | Subtle cream fill | `cream200` |
| `screenCream` | Light-mode screen bg | `cream100` |
| `surfaceWhite` | Pure-white input surface | `#fff` |
| `textPrimary` | Default text/icon on dark | `creamText` |
| `textSecondary` | Captions on dark | `muted3` |
| `textTertiary` | Inactive/meta | `muted2` |
| `textMutedCream` | Secondary text on cream | `muted1` |
| `textOnCream` | Body text on cream surfaces | `green800` |
| `textOnColor` | Text over saturated fills | `#fff` |
| `textOnColorMuted` | Softer text over saturated fills | `rgba(255,255,255,0.85)` |
| `textGhost` | Reset-button label | `#cfe0d6` |
| `accent` | Primary accent (rings, primary btn) | `gold500` |
| `accentLight` | Secondary accent / link text | `gold300` |
| `accentDeep` | Gold depth | `gold700` |
| `success` | Completed states | `sage` |
| `warm` | Streak / warm alerts | `terracotta500` |
| `warmDeep` | Streak gradient end | `terracotta700` |
| `border` | Hairline on dark | `whiteAlpha14` |
| `borderCream` | Hairline on cream | `borderWarm` |
| `goldHairline` | Dhikr card border | `goldAlpha25` |
| `tabBar` | Tab bar translucent fill | `rgba(14,45,34,0.96)` |
| `inkChip` | Translucent dark chip over gold | `rgba(14,45,34,0.15)` |
| `inkTrack` | Translucent dark track over gold | `rgba(14,45,34,0.18)` |

`textOnColor` / `textOnColorMuted` / `textGhost` / `tabBar` / `surfaceWhite` / `inkChip` / `inkTrack` hold literal string values — they tokenize what were previously scattered inline literals.

### Gradients
Defined in `tokens.gradients` as **ready-to-use CSS gradient strings**, applied directly via `experimental_backgroundImage` (the Expo 55 idiom — see §6). They are **not** stop arrays — use them as-is.

| Name | CSS string (abbreviated) | Where |
|------|--------------------------|-------|
| `darkScreen` | `linear-gradient(180deg, #16352a, #0e2d22)` | Home, achievements, tasbih screens |
| `brandCard` | `linear-gradient(150deg, #1c4a3a, #0e2d22)` | Brand / featured cards |
| `gold` | `linear-gradient(150deg, #d8b46a, #bf9648)` | Primary button, featured challenge |
| `sage` | `linear-gradient(150deg, #3f8268, #2c5e4a)` | Success/completion accents |
| `terracotta` | `linear-gradient(150deg, #c8784e, #a85733)` | Streak hero card |
| `onboardingGlow` | radial gold glow + `darkScreen` | Onboarding background |
| `logoGlow` | radial gold glow | Logo / splash accent |

---

## 3. Typography

Two families, loaded in [`app/_layout.tsx`](src/app/_layout.tsx) via `@expo-google-fonts/*` and named in `tokens.fonts`. **Never** render Arabic text with a raw `<Text>` — always use [`<Txt>`](src/components/txt.tsx), which guarantees the right family, RTL writing direction, and theme‑correct default color.

### Families
- **IBM Plex Sans Arabic** — UI, numbers, labels, buttons. Weights **400 / 500 / 600 / 700** (700 is the heaviest available).
- **Amiri (Naskh)** — dhikr / Qur'an text and the wordmark. Weights **400 / 700**. Opt in with `<Txt naskh>`.

```ts
fonts = {
  sans: "IBMPlexSansArabic_400Regular",
  sansMedium: "IBMPlexSansArabic_500Medium",
  sansSemiBold: "IBMPlexSansArabic_600SemiBold",
  sansBold: "IBMPlexSansArabic_700Bold",
  naskh: "Amiri_400Regular",
  naskhBold: "Amiri_700Bold",
}
```

### The `Txt` component — the only text primitive
```tsx
<Txt variant="title" color={colors.creamText}>{name} 👋</Txt>
<Txt naskh size={26} align="center" style={{ lineHeight: 46 }} selectable>{dhikr}</Txt>
<Txt variant="caption" color={colors.muted3}>٧ من ١٢</Txt>
```
Defaults: `weight="regular"`, `size={15}`, `color={colors.creamText}`, `align="auto"` (React Native flips alignment under RTL automatically — this matches the project RTL convention; no `writingDirection` is set). Weights map `regular→400, medium→500, semibold→600, bold→700`. With `naskh`, only `regular`/`bold` exist (other weights fall back to regular).

The optional `variant` prop accepts a key from `tokens.text` and sets `size`, `weight`, and `lineHeight` together. Explicit `size`/`weight` props still override the preset. Naskh/dhikr text that needs a custom `lineHeight` (e.g. 46) keeps its own explicit `style={{ lineHeight: 46 }}`.

### Type scale — `tokens.text`
| Variant | Size | Weight | LineHeight | Typical use |
|---------|------|--------|------------|-------------|
| `title` | 26 | bold | 34 | Screen title, greeting name |
| `heading` | 18 | bold | 26 | Section headings (أورادي, etc.) |
| `subheading` | 16 | bold | 24 | Card titles |
| `body` | 15 | regular | 24 | Default body / button text |
| `label` | 14 | medium | 20 | Button labels, row labels |
| `caption` | 12 | regular | 18 | Captions, progress sub-labels |
| `micro` | 11 | regular | 14 | Smallest labels, tab labels |

### Special/hero sizes (beyond the token scale)
Some one-off large sizes have no token variant and are set explicitly:

| Role | Size / Weight | Family | Example |
|------|---------------|--------|---------|
| Tasbih counter | **78 / bold**, tabular‑nums | Sans | `٣` |
| Streak hero number | 52 / bold, tabular‑nums | Sans | `٧` |
| Dhikr text | **26 / regular, line‑height 46** | **Naskh** | أذكار |
| Counter sub‑label | 15 / regular, `muted3` | Sans | `من ١٢` |

> Prototype reference sizing (380‑wide frame): dhikr text rendered at 24–27/700 Amiri with line‑height ~1.9; the shipped app settles on 26 / line‑height 46.

### Numerals — always Eastern Arabic
Every number a user sees passes through `toArabicNumerals()` ([src/utils/numerals.ts](src/utils/numerals.ts)) → ٠١٢٣٤٥٦٧٨٩ (the same `String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d])` mapping the prototype used). Counters and large numerals additionally set `fontVariant: ["tabular-nums"]` so digits don't jitter while counting. Never print a Western digit in the UI.

---

## 4. Spacing, Radius, Borders, Shadows

### Spacing — `tokens.spacing`
A 6‑step scale. Use tokens, not raw numbers, for padding/gap/margins.

| Token | px | Typical use |
|-------|----|-------------|
| `xs` | 6 | Tight inner gaps |
| `sm` | 10 | Card inner gaps, tab padding |
| `md` | 14 | Gaps between cards in a row |
| `lg` | 18 | Standard card padding; vertical rhythm between sections |
| `xl` | 22 | Screen horizontal padding; hero padding |
| `xxl` | 28 | Large card vertical padding; bottom scroll padding |

Conventions: **screen horizontal padding = `xl` (22)**; **vertical gap between stacked sections = `lg` (18)**; small inline gaps use raw `4`/`6` where below the scale. (Prototype source ranges: card padding 16–26, card gaps 12–18, screen padding 22–30 — the tokens above are the codified subset.)

### Radius — `tokens.radii`
`tile: 10` (list rows, buttons) · `card: 12` (standard cards) · `cardLg: 14` (hero cards) · `pill: 14` (pills). Full circles use `borderRadius: size/2` (independent of these tokens). _(Roundness was sharpened from the original 18/24/28/30 — adjust the single `radii` block in `tokens.ts` to retune.)_
**Always pair a radius with `borderCurve: "continuous"`** for iOS‑smooth (squircle) corners — applied on every rounded surface in the app.

### Borders
Hairlines carry hierarchy on the dark theme:
- Dhikr card: `1px` `goldAlpha25` (gold hairline — signals "this is the sacred text").
- Morning (cream) card: `1.5px` `gold500` (the only emphasized colored border).
- Empty‑state awrad: `1px` `whiteAlpha14`, **dashed**.
- Tab bar top: `1px` `whiteAlpha08`.

### Shadows / elevation — `tokens.shadows`
Expressed as **`boxShadow` strings** (Expo 55 idiom — no legacy `shadow*`/`elevation`).
| Token | Value | Use |
|-------|-------|-----|
| `cardOnCream` | `0 8px 20px -12px rgba(20,57,46,0.3)` | Cards on a light surface |
| `darkElevated` | `0 18px 36px -16px rgba(14,45,34,0.6)` | Raised dark cards |
| `terracotta` | `0 16px 32px -16px rgba(168,87,51,0.6)` | Streak hero (warm‑tinted shadow) |
| `floatingButton` | `0 12px 28px -12px rgba(0,0,0,0.5)` | Category-list floating CTA button |
| `goldCard` | `0 16px 32px -16px rgba(191,150,72,0.5)` | Challenges featured gold card |
| `sheet` | `0 -12px 30px -16px rgba(14,45,34,0.5)` | Onboarding cream sheet (upward shadow) |

Depth on the dark theme comes **primarily from translucent white layers**, not shadow. Reserve shadows for hero moments.

---

## 5. RTL & Internationalization

- **Hard RTL.** [`app/_layout.tsx`](src/app/_layout.tsx) calls `I18nManager.allowRTL(true)` + `forceRTL(true)` at module load. The whole layout mirrors; design and review everything right‑to‑left. (RN applies a forced‑RTL flip after the first relaunch — expected behavior.)
- **Directional glyphs flip meaning.** "Back" points **right** (toward the start edge in RTL), "forward/next" points **left**. The [Icon](src/components/icon.tsx) component draws chevrons as SVG and maps `chevron.backward`/`chevron.forward` to the right/left glyph per `I18nManager.isRTL` — deterministic, with none of the SF‑Symbol/bidi mirroring quirks the old font‑glyph approach had.
- **All copy is Arabic.** No i18n framework — strings are inline Arabic literals. There is no English UI surface to maintain.
- **Numerals** are Eastern‑Arabic everywhere (§3).

---

## 6. Platform Idioms (Expo SDK 55)

> Per [AGENTS.md](AGENTS.md): **read the exact Expo 55 docs (`https://docs.expo.dev/versions/v55.0.0/`) before writing any code.** Expo's styling story changed — these are the idioms this app standardizes on.

- **Gradients → `experimental_backgroundImage`.** Backgrounds use a CSS gradient string on the `View` style, e.g.
  ```tsx
  experimental_backgroundImage: "linear-gradient(180deg, #16352a 0%, #0e2d22 100%)"
  ```
  with a solid `backgroundColor` fallback underneath. We do **not** wrap screens in `<LinearGradient>`. (`tokens.gradients` holds the stop arrays for reference / future use.)
- **Shadows → `boxShadow`** string (see §4), never `shadowColor`/`elevation`.
- **Corners → `borderRadius` + `borderCurve: "continuous"`** on every rounded surface.
- **React Compiler is on** (`app.json` → `experiments.reactCompiler`). Don't hand‑add `useMemo`/`useCallback` for render perf unless profiling demands it; write straightforward components.
- **Typed routes are on** — navigate with typed `router.push("/session/morning")` paths.

---

## 7. Iconography

**Every icon is hand‑drawn SVG** (`react-native-svg`) on a 24×24 grid in one **"Rounded" style** — `2px` rounded strokes, round joins — so the whole app shares a single geometric language and renders **pixel‑identical on iOS and Android**. No SF Symbols, no Unicode/emoji fallbacks, **no third‑party icon set**. Two primitives, same style:

1. **General icons** → [`<Icon name size color />`](src/components/icon.tsx). The shared **stroke** set. `color` defaults to `textPrimary`; directional chevrons resolve per layout direction (`chevron.backward` → right under RTL — no SF‑Symbol/bidi mirroring quirks). Names keep their old SF‑Symbol‑style keys so call sites didn't change.

| Purpose | `name` | Purpose | `name` |
|---------|--------|---------|--------|
| Morning (sun) | `sun.max.fill` | Add | `plus` |
| Evening (moon) | `moon.fill` | Done | `checkmark` |
| Streak (flame) | `flame.fill` | Close | `xmark` |
| Reminders (bell) | `bell.fill` | Back / Forward | `chevron.backward` / `chevron.forward` |
| Settings (gear) | `gearshape.fill` | Edit / Delete | `pencil` / `trash` |
| Locked | `lock.fill` | Reset | `arrow.counterclockwise` |
| Star / Seal‑check | `star.fill` / `checkmark.seal.fill` | More | `ellipsis` |

2. **Tab bar** → [`<TabIcon name active color size />`](src/components/tab-icon.tsx). The four tab glyphs (House, **Misbaha**, **Trophy**, Person) in the same style but **two‑state**: `2px` outline when inactive, **solid fill** when active (gold). The only outline↔fill state the app uses.

Keep icons **minimal and geometric**. To add a general icon: add an SVG glyph to the `GLYPHS` map in [icon.tsx](src/components/icon.tsx) (stroke‑only, 24×24). To change a tab glyph: edit [tab-icon.tsx](src/components/tab-icon.tsx). Drawing our own in‑repo is **not** the same as importing a set. (`expo-symbols` is no longer used by the icon system.)

---

## 8. Motion

Animation is **purposeful and gentle** — entrance reveals and reward moments, nothing decorative. Powered by `react-native-reanimated`.

### Entrance
- Screens & cards reveal with `FadeInDown` / `FadeInUp` / `FadeIn`, **300–400 ms**. The streak hero uses `FadeInDown.duration(400)`; the dhikr card `FadeInUp.duration(350)`; the counter `FadeIn.duration(300)`.
- The dhikr card is **re‑keyed by `current.id`** so it re‑animates on every advance — each new remembrance "rises" in.

### Tasbih reward sequence (the signature interaction)
On each tap of the [TasbihCounter](src/components/tasbih-counter.tsx):
1. **Ring fills** — `strokeDashoffset = C × (1 − count/target)`, `withTiming(…, { duration: 320 })`.
2. **Haptic** — light impact (`Haptics.impactAsync(Light)`), iOS only.

On reaching the target:
3. **Success haptic** — `notificationAsync(Success)`.
4. **Celebration ring** — a stroked ring scales `0.9 → 1.5` while fading `0.65 → 0` over **900 ms**.
5. **Auto‑advance** — after `ADVANCE_DELAY = 950 ms`, advance to the next dhikr and reset the count. Taps are locked (`disabled`) while `done`.

Geometry (shipped): `SIZE 248`, `STROKE 12`, radius `(SIZE−STROKE)/2 = 118`, track `whiteAlpha08`, progress `accent` (default `gold500`), `strokeLinecap="round"`, ring rotated `-90°` to start at top. (The prototype used a 240px circle, `r=104`; the same offset math — `circ × (1 − count/target)` — drives both.)

**Timing vocabulary:** micro‑feedback ~320 ms · entrances 300–400 ms · celebration ~900 ms · advance ~950 ms. Easing is gentle (`withTiming` defaults). Don't exceed ~1 s for any single beat. The prototype also defined optional breathing/entrance keyframes (`wd-pulse`, `wd-rise`, `wd-pop`) at 0.9–2.4 s — reach for these tones only for ambient effects, not core feedback.

---

## 9. Component Catalog

| Component | File | Notes |
|-----------|------|-------|
| `Txt` | [txt.tsx](src/components/txt.tsx) | The only text primitive. Sans/Naskh, weights, variant scale, RTL, theme color. |
| `Icon` | [icon.tsx](src/components/icon.tsx) | The shared hand‑drawn SVG glyph set (rounded 2px stroke, 24×24); RTL‑aware chevrons. |
| `TasbihCounter` | [tasbih-counter.tsx](src/components/tasbih-counter.tsx) | The core. 248px tappable ring, count, celebration, auto‑advance, haptics. `target: number \| null` — `null` is a **free** tasbih (faint full ring, «تسبيح حر», no goal/celebration). Reused for built‑in adhkar, the session, and the single‑dhikr counter. |
| `AdhkarRow` | [adhkar-row.tsx](src/components/adhkar-row.tsx) | أذكاري list row. **Built-ins and user items render identically** — the dhikr text in Amiri/naskh (18/semibold). Gold count chip **only when the item has a target** (free items show no chip); a chevron only on the user's own items (built-ins have none). User items wrap `ReanimatedSwipeable` for تعديل (gold gradient, pencil icon) / حذف (terracotta gradient, trash icon). |
| `TabBar` | [tab-bar.tsx](src/components/tab-bar.tsx) | Custom 4‑tab bar. |
| `TabIcon` | [tab-icon.tsx](src/components/tab-icon.tsx) | Hand‑drawn SVG tab glyphs (house / misbaha / trophy / person); outline→fill on active. |
| `ProgressBar` | inline in [index.tsx](src/app/(tabs)/index.tsx) | 8px track, rounded, configurable color/track. |
| `WardForm` | [ward-form.tsx](src/components/ward-form.tsx) | Add/edit a ذِكر: title + text + category picker (inline‑create) + هدف محدد/تسبيح حر toggle + stepper. |
| `Screen` | [screen.tsx](src/components/screen.tsx) | Gradient scaffold + safe-area; see §10. |
| `Button` | [button.tsx](src/components/button.tsx) | Unified CTA: primary/ghost/link; see §10. |
| `SectionHeader` | [section-header.tsx](src/components/section-header.tsx) | Title + optional trailing action; see §10. |
| `ListRow` | [list-row.tsx](src/components/list-row.tsx) | Translucent rounded pressable row; see §10. |

### Card vocabulary
A small, consistent set of surface treatments — reuse these, don't invent new ones:

| Card | Fill | Border / Shadow | Used for |
|------|------|------------------|----------|
| **Streak hero** | `streak` gradient | `terracotta` boxShadow | The streak number — the loudest element on screen |
| **Morning (light)** | `cream50` | `1.5px gold500` border | Morning adhkar entry on dark home |
| **Evening (dark)** | `green700` | — | Evening adhkar entry |
| **Brand card** | `brandCard` gradient | `darkElevated` | Featured "Today's Wird"‑style cards |
| **Raised dark** | `whiteAlpha06` | — | Level card, awrad tiles |
| **Dhikr card** | `whiteAlpha06` | `1px goldAlpha25` border | The sacred text in a session |
| **Empty state** | transparent | `1px whiteAlpha14` dashed | "Add your first wird" |

### Buttons
- **Primary** — `gold500` fill, label `green800` bold, `radii.tile` (e.g. "الذكر التالي ←", `flex: 2`). Pills use `radii.pill`.
- **Secondary / neutral** — `whiteAlpha08` fill, light label `#cfe0d6` (e.g. "تصفير", `flex: 1`).
- **Text link** — gold label only (e.g. "+ إضافة وِرد" in `gold300`).
- All buttons are `Pressable`, ~15px vertical padding, continuous corners.

### Progress indicators
- **Linear bar** — 8px (4px radius) track + fill; `gold500`/`sage` on `whiteAlpha14` (dark) or `borderWarm` (cream).
- **Segmented session bars** — one 5px segment per dhikr: `sage` (done) · `gold500` (current) · `whiteAlpha14` (upcoming).
- **Circular ring** — the tasbih counter (§8).
- **Week dots** — 30px circles: `gold500` + `checkmark` (a day with progress) · `whiteAlpha08` + weekday letter (empty) · `2px gold300` ring marks today.

### iOS‑style toggle (reminders)
On = `gold500` track + white knob; off = muted track. Used on the reminder rows.

---

## 10. Primitives

Four shared scaffold/interaction components that landed with the design-system refactor. They live in `src/components/` alongside the existing catalog and are backed entirely by `tokens.*` — no inline hex/literal values.

### `Screen` — [src/components/screen.tsx](src/components/screen.tsx)
Gradient background + safe-area insets + scroll or fixed content scaffold. Eliminates per-screen boilerplate for the standard dark-gradient layout.

```tsx
<Screen gradient="darkScreen" scroll contentStyle={{ gap: spacing.xl }}>
  {/* page content */}
</Screen>
```

Props: `gradient` (`keyof typeof gradients`, default `"darkScreen"`), `scroll` (boolean, default `true`), `contentStyle` (`ViewStyle`, optional override/extension of the inner container padding).

Used by **home, achievements, tasbih**. Screens with a fixed header/footer or keyboard handling (session, list, stats, challenges, profile, reminders, ward-form, onboarding) intentionally keep their own root and just use `tokens.*` directly.

### `Button` — [src/components/button.tsx](src/components/button.tsx)
Unified CTA with three variants mapping to the app's existing button language. Exports `ButtonVariant`.

```tsx
<Button variant="primary" icon="plus" onPress={handleAdd}>إضافة وِرد</Button>
<Button variant="ghost" onPress={handleReset}>تصفير</Button>
<Button variant="link" onPress={handleNav}>المزيد ‹</Button>
```

Props: `variant` (`"primary" | "ghost" | "link"`, default `"primary"`), `icon` (SF Symbol name, optional), `haptic` (boolean, default `true` — fires iOS light impact), `disabled` (boolean), `style`. Sets `accessibilityRole="button"`. `primary` renders the gold gradient; `ghost` is translucent; `link` is icon + text with no background.

### `SectionHeader` — [src/components/section-header.tsx](src/components/section-header.tsx)
Title on the leading edge with an optional trailing action (typically a `link` Button).

```tsx
<SectionHeader title="أورادي" action={<Button variant="link" onPress={handleAdd}>+ إضافة وِرد</Button>} />
```

Props: `title` (string), `action` (ReactNode, optional), `style` (ViewStyle escape hatch).

### `ListRow` — [src/components/list-row.tsx](src/components/list-row.tsx)
Translucent rounded pressable row — the standard surface for awrad items and category lists.

```tsx
<ListRow onPress={() => router.push(`/session/${id}`)} onLongPress={handleEdit}>
  <Txt variant="subheading">{title}</Txt>
</ListRow>
```

Props: `onPress`, `onLongPress` (optional), `accessory` (ReactNode — replaces the default trailing chevron), `style`. Uses `semantic.surface` background, `radii.tile` corners with `borderCurve: "continuous"`.

---

## 11. Screens (v1 — shipped)

Routes use `expo-router`; the shell is custom (no default headers — `headerShown: false` globally, default `contentStyle` background `green800`).

### Navigation shell — [TabBar](src/components/tab-bar.tsx)
Four tabs, RTL order: **الرئيسية · أذكاري · إنجازاتي · ملفي** (the `tasbih` route keeps its name and misbaha glyph; only the label changed). Translucent fill `rgba(14,45,34,0.96)`, `1px whiteAlpha08` top hairline, safe‑area aware bottom padding. Each tab = a [`TabIcon`](src/components/tab-icon.tsx) glyph (filled `gold300` active / outline `muted2` inactive) + 11px label (`creamText`+semibold active / `muted2` regular inactive). The active state reads through the outline→fill flip plus the gold/cream colour shift — quiet, not a pill.

### Onboarding — [onboarding.tsx](src/app/onboarding.tsx)
First run only. Asks the name, nothing else; stored locally. The tabs layout redirects here while `settings.name` is empty ([(tabs)/_layout.tsx](src/app/(tabs)/_layout.tsx)).

### Home — [(tabs)/index.tsx](src/app/(tabs)/index.tsx)
`darkScreen` gradient, vertical scroll, `xl` horizontal padding, `lg` gaps. Top‑down:
1. **Greeting** — time‑aware (`صباح الخير` / `مساء الخير`) + name (26/bold).
2. **Streak hero** — terracotta gradient card, 52px tabular number, "أيام متتالية! 🎉" (or a start prompt at 0), longest‑streak caption. `FadeInDown`.
3. **Week dots** — last 7 days as completion dots, today ringed.
4. **Morning / Evening cards** — side‑by‑side; light gold‑bordered vs dark green; each shows a progress bar and "x من y" / "اكتمل ✓", taps into its session.
5. **Level card** — raised translucent: "المستوى N · {title}" + points `inLevel/500` + gold progress bar.

(The former **أورادي** home section was removed — its concept moved to the **أذكاري** tab.)

### أذكاري tab — [(tabs)/tasbih.tsx](src/app/(tabs)/tasbih.tsx)
The user's tasbih **library**: a categorized list of remembrances they count. Title + gold **+** add button → the create modal. A row of **filter chips** (`radii.pill`, gold‑fill active / `surfaceStrong` inactive): **الكل** + every category that has items. Under «الكل» the list is **grouped by category** (gold section labels); selecting a chip flattens to that category.

Each row is an [`AdhkarRow`](src/components/adhkar-row.tsx): a gold count chip **only when the item has a target** (`٣٣` — free items show no chip), and a trailing chevron **only on the user's own items**. **Tap → `/dhikr/[id]`** to count. The user's own items are **swipeable** (`ReanimatedSwipeable`) to reveal **تعديل** (gold gradient) / **حذف** (terracotta gradient); the read‑only built‑in classics don't swipe and show no chevron (no lock badge needed). The list seeds the four post‑prayer classics (سبحان الله / الحمد لله / الله أكبر / لا إله إلا الله) and a few more as **read‑only built‑ins** ([data/adhkari.ts](src/data/adhkari.ts)).

### Single‑dhikr counter — [dhikr/[id].tsx](src/app/dhikr/[id].tsx)
Resolves one item (built‑in or custom) by id → dhikr card (Amiri) + [TasbihCounter](src/components/tasbih-counter.tsx) + «تصفير». A **target** item fills the ring, celebrates at the goal, then calls `completeWard()` (points + the daily‑ward challenge) and returns. A **free** item (`count === null`) shows a faint full ring + «تسبيح حر», counts up with no ceiling and awards nothing.

### Manage categories — [settings/categories.tsx](src/app/settings/categories.tsx)
Reached from **Profile**. Lists categories: the five locked defaults (**🔒 أساسي**) and the user's own (inline‑rename ✎ / delete 🗑 — deleting reassigns its أذكار to «عامة»), plus «+ تصنيف جديد».

### Session (the core) — [session/[category].tsx](src/app/session/[category].tsx)
`darkScreen` gradient. **Header** (back ‹ / centered title + "الذكر i من n" / spacer) → **segmented progress bars** → centered **dhikr card** (gold‑hairline, Amiri 26/lh46, optional title in `gold300` + note in `muted3`) → **TasbihCounter** → hint "اضغط الدائرة للعدّ" → **controls** ("تصفير" neutral `flex:1` + "الذكر التالي ←" / "إنهاء ✓" primary `flex:2`). Resumes from the first incomplete dhikr; partial counts persist per‑dhikr so a tap‑count survives leaving the screen. Serves the **built‑in morning/evening categories** only — a single user ذِكر is counted via `/dhikr/[id]` instead.

### Adhkar list — [list/[category].tsx](src/app/list/[category].tsx)
Overview of a category: each row a status circle (sage ✓ done / gold number current / outlined upcoming) + Amiri title + repetition caption; current row emphasized (dark green gradient + ▶ glyph), completed rows dimmed (opacity ~0.7).

### Achievements — [(tabs)/achievements.tsx](src/app/(tabs)/achievements.tsx)
Streak banner + simple stat chips (v1). The full badge grid & calendar are deferred — see §12.

### Profile — [(tabs)/profile.tsx](src/app/(tabs)/profile.tsx)
Name, reminder access, awrad management, about.

### Create / edit a ذِكر — [awrad/new.tsx](src/app/awrad/new.tsx) · [awrad/[id].tsx](src/app/awrad/[id].tsx)
Presented as **modals** (`presentation: "modal"`). Add/edit/delete a personal ذِكر via [WardForm](src/components/ward-form.tsx): title + text + a **category picker** (chips + dashed «+ جديدة» inline‑create) + a **هدف محدد ⇆ تسبيح حر** toggle (free hides the stepper). It then runs through the shared `/dhikr/[id]` counter. (Route folder is still `awrad/` for continuity.)

### Reminders — [settings/reminders.tsx](src/app/settings/reminders.tsx)
Morning (default **07:00**) / evening (default **18:30**) local‑notification times with iOS‑style toggles (on = `gold500` track). Scheduled via `expo-notifications`; re‑scheduled on launch ([app/_layout.tsx](src/app/_layout.tsx)). No push/server — fully local.

---

## 12. Deferred Surfaces (v2 — specced, not yet built)

These were fully designed in the prototype and are preserved here so they can be built without the handoff. v1 deliberately ships the core (streak + morning/evening + tasbih + awrad + reminders); the following are next.

### Stats & Calendar
- **Month switcher** — `‹ رمضان ١٤٤٧ ›`.
- **Calendar grid** — 7 columns, weekday headers **س ح ن ث ر خ ج**. Each day cell colored by state:
  | State | Background | Text |
  |-------|-----------|------|
  | Complete | `#1c4a3a` | `#fff` |
  | Partial | `#bfd8c9` | `#2a5444` |
  | Today | `#d8b46a` | `#16352a` |
  | Future | `#f3eee2` | `#cdc6b5` |
  | Empty / missed | `#ece6d8` | `#b3bcb4` |
- **Legend** — مكتمل / جزئي / فائت.
- **Weekly bar chart card** — "هذا الأسبوع", delta caption "+١٢٪ عن السابق", 7 bars of varying height; the highest bar is gold.

### Challenges
- Dark green screen. **Featured weekly challenge** — `gold` gradient card: "تحدي الأسبوع / لا تفوّت ذِكراً ٧ أيام", progress bar 5/7, reward "+٥٠ نقطة".
- **Daily challenge rows** — icon + title + progress/Done state + point reward (e.g. +٢٠ / +١٥ / +٢٠). Completed row uses a `sage` check + `sage` text.

### Achievements & Badges (full)
- **Terracotta streak banner** — big `٧`, "يوماً متتالياً 🔥", "أطول سلسلة لك: ٢١ يوماً".
- **Stat chips** (3) — إجمالي الأذكار ٤٢٠ / يوم نشِط ٣٨ / شارة ٩.
- **Badge grid** (3‑col) — unlocked badges use gold/sage/terracotta gradient tiles; locked use muted `#ece6d8`, each with a label.

### Notifications & Reminders (design intent)
- iOS lock‑screen mock: dark slate gradient, large time `7:00`, date.
- Two notification cards (translucent): a morning greeting and a streak‑risk warning ("لا تكسرها") — each with the app icon, title "وِرْد", timestamp, body copy.
- Tone is gentle and motivating: e.g. «صباح النور 🌤 — لا تنسَ أذكار الصباح» / «لا تكسر سلسلتك 🔥».
- Reminder settings: rows for أذكار الصباح ٧:٠٠ صباحاً / أذكار المساء ٦:٣٠ مساءً with the gold iOS toggle (the v1 reminders screen already implements this).

---

## 13. Content Model & Data Shape

The app is local‑only; persistence keys (AsyncStorage / local DB) and their shapes:

```ts
settings        = { name: string, remindersEnabled: bool, morningTime: "07:00", eveningTime: "18:30" }
progress        = { [date: "YYYY-MM-DD"]: { morningDone: bool, eveningDone: bool, completedIds: string[], wardDone?: bool } }
streak          = { current: number, longest: number, lastCompletedDate: string }
score           = { points: number, level: number }   // level bar fills every 500 pts
customAwrad     = [ { id, title, text, count: number | null, category: string, createdAt } ]  // count null = free tasbih
customCategories= [ { id, label, builtin: false } ]   // user-created only; locked defaults live in data/adhkari.ts
```

### أذكاري library — [data/adhkari.ts](src/data/adhkari.ts)
The أذكاري tab merges two read sources into one `AdhkariItem = { id, title?, text, count: number|null, category, locked }` list:
- **`BUILTIN_ADHKAR`** — read‑only (`locked:true`) classics shipped in code (stable `bi-*` ids that double as per‑day count keys).
- The user's **`customAwrad`** (`locked:false`), legacy items missing `category` normalize to `general`.

Categories merge the same way: **`DEFAULT_CATEGORIES`** (5 locked: التسبيحات · الاستغفار · الصلاة على النبي · أدعية · عامة) + the user's `customCategories`. Pure helpers (`mergeAdhkariItems`, `groupByCategory`, `getAdhkariItemById`, `isFree`) are unit‑tested in [data/__tests__/adhkari.test.ts](src/data/__tests__/adhkari.test.ts).

### Dhikr shape — the unit every view renders
Built‑in adhkar and custom awrad normalize to the **same** shape so [TasbihCounter](src/components/tasbih-counter.tsx) and the session screen treat them identically:

```ts
Dhikr = { id, text, count, note?, title? }
```

- `count` is the repetition **target** (the ring's denominator). `note` is the virtue/benefit caption shown under the text. `title` is an optional label above it.
- **Built‑in content** ships bundled and read‑only in [src/data/adhkar.ts](src/data/adhkar.ts): morning (١٣) and evening (١٢), sourced from *الخلاصة الحسناء*. No network is required.
- **Deliberate count:** «أعوذ بكلمات الله التامات» (evening) is set to **1** as in the source PDF — this is intentional; do not "fix" it to the commonly‑cited 3 (see *Werd key decisions* in memory).

> **Prototype sample set** (illustrative, not the shipped content — the real list lives in `adhkar.ts`). It documents the `{ text, target, virtue }` shape and a representative target pattern `1, 3, 33, 100, 10, 3`:
>
> | Dhikr | Target | Virtue (note) |
> |-------|--------|---------------|
> | اللّٰهُ لَا إِلَٰهَ إِلَّا هُوَ الحَيُّ القَيُّوم | 1 | آية الكرسي · حِفظٌ إلى الصباح |
> | قُلْ هُوَ اللّٰهُ أَحَد | 3 | المعوّذات · حِرزٌ من كل شيء |
> | سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ | 33 | حُطَّت خطاياه وإن كانت مثل زبد البحر |
> | أَسْتَغْفِرُ اللّٰهَ وَأَتُوبُ إِلَيْه | 100 | مفتاحُ كل خير |
> | اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّد | 10 | صلّى اللهُ عليه بها عشراً |
> | رَضِيتُ بِاللّٰهِ رَبًّا | 3 | حقٌّ على اللهِ أن يُرضيه |

### Streak & scoring logic
- **Streak** increments on a day whose wird is completed; show a warning notification as the day ends if it's still incomplete ("لا تكسرها"). Track `current` + `longest`.
- **Evening adhkar** are conceptually gated until after ʿAsr (lock state) in the gamified design.
- **Points/level** accrue on completion; the home level bar fills per 500 points and shows a level title.

---

## 14. Logo & Brand System

The mark is a **rising sun (الفجر) over a hill**, with the wordmark **«وِرْد»** in Amiri 700. It says *dawn, beginning, the morning wird* — the app's whole reason for being.

### Mark construction
- **Sun:** a filled gold semicircle (`#d8b46a`) sitting on the horizon, with **5 radiating rays** (`stroke #d8b46a`, ~6–7px, rounded caps) — one vertical, two mid, two outer.
- **Horizon:** a single cream line (`#f4ede0`, ~6px, rounded) separating sun from wordmark; or a dark hill silhouette (`#0a241b`) for the scenic variants.
- **Wordmark:** «وِرْد» in **Amiri 700**, cream `#f4ede0`.
- **Field:** dark‑green gradient **`linear-gradient(155deg, #1c4a3a → #0e2d22)`** (the primary, and only, treatment) — app‑icon shape uses a `~38px` rounded square; the badge variant uses a full circle.
- **Tagline** (optional, in lockups): «أذكار الصباح والمساء».

### Lockups (6 configurations)
| # | Name | Description | Best for |
|---|------|-------------|----------|
| 1 | **مكدّس** (Stacked) | Sun on top, horizon line, name below. Balanced, classic. | **The app icon** — `wird-logo.png` is this dawn/hill composition |
| 2 | **الشروق خلف الاسم** (Sunrise behind name) | Sun rises behind the name as if it were the horizon. Scenic, warm. | Splash / hero |
| 3 | **الشمس زخرفةً فوق الاسم** (Sun as a crown) | Small sun crowning a large name; the name is the hero. | Wordmark‑forward contexts |
| 4 | **أفقي** (Horizontal) | Mark + name side‑by‑side, with tagline. | Headers, wide screens |
| 5 | **شارة دائرية** (Circular badge) | Elegant circular seal, double gold hairline ring, micro‑text «الصباح والمساء». | In‑app badges / streak medallions |
| 6 | **الاسم على التل** (Name on the hill) | Full dawn scene: sun top‑right, dark hill, name centered. Most narrative. | Storytelling / marketing |

> The shipped app icon corresponds to the stacked dawn‑over‑hill direction, exported as `assets/images/wird-logo.png`. All variants are presented on the dark green field (the primary treatment); for small sizes, drop the tagline and lean on the stacked or circular‑badge forms.

---

## 15. App Identity

From [`app.json`](app.json) and `assets/`:
- **Icon** — `wird-logo.png` (the dawn/hill mark above).
- **Adaptive icon (Android)** — foreground = logo on `green900` `#0e2d22` background; a monochrome variant is supplied.
- **Splash** — logo centered on `green900`, `imageWidth 140` (120 on Android).
- **Notification accent** — `gold500` `#d8b46a`.
- **Status bar** — `light` (the app is dark‑themed throughout).
- **Bundle id** — `com.hamodadev.werd` (Android); scheme `werd`.

---

## 16. Accessibility & Quality Notes

- **Contrast** — `creamText` on the green night and `green800` on gold buttons both clear AA for body text. Keep captions at `muted3` or lighter only for non‑essential text.
- **Tap targets** — interactive rows/buttons run full‑width or use `hitSlop` (10–12) for small controls; the counter is a 248px target.
- **Haptics are additive** — every important state change pairs visual + haptic (iOS), but the UI is fully legible and functional without them (Android).
- **Selectable scripture** — dhikr text is `selectable` so users can copy it.
- **Reduced motion** — animations are short and non‑essential; the app is fully usable if they're skipped. Honor the OS reduce‑motion setting if you extend motion.

---

## 17. Working With This System

**Source of truth:** [`src/theme/tokens.ts`](src/theme/tokens.ts). Change a value there, not in a component.

**Adding UI — the checklist:**
1. Text → `<Txt>` (never raw `<Text>`). Numbers → `toArabicNumerals()`. Icons → `<Icon>`.
2. Colors / spacing / radii / shadows → `tokens.*`. No new hex without a token.
3. Rounded surface → set `borderCurve: "continuous"`.
4. Background gradient → `experimental_backgroundImage` + solid fallback. Shadow → `boxShadow` string.
5. Reuse a card from §9 and a button from §9/§10 before inventing a new one.
6. Design and test **RTL on both platforms**; verify glyph direction for any new directional icon, and confirm the Unicode fallback for any new SF Symbol.
7. Read the **Expo 55** docs before adopting any new native/styling API ([AGENTS.md](AGENTS.md)).

*This document is the complete record of the Wird design system — the original `design_handoff_werd_app/` prototypes have been fully absorbed here. Keep it in sync with [`src/theme/tokens.ts`](src/theme/tokens.ts) and the planning record in [DESIGN_PLAN.md](DESIGN_PLAN.md).*
