# Wird — Design System Enhancement (Primitives + Semantic Tokens)

> Date: 2026-06-14
> Status: Design approved, pending spec review
> Scope: P1–P3 from the design-system assessment — encode the scale, add composition
> primitives, migrate components onto a semantic color layer, and enforce "no raw hex".

## 1. Goal

The app already has a real token layer ([src/theme/tokens.ts](../../../src/theme/tokens.ts))
and good text/surface primitives (`Txt`, `Card`, `Icon`). The gap is **composition and
enforcement**: every screen hand-assembles the same background/safe-area/scroll scaffolding,
CTAs are bespoke inline `Pressable`s, the documented type scale isn't encoded, and a handful
of hex literals are copy-pasted (the `darkScreen` gradient string appears in **10** screens).

This work closes that gap by:

1. Encoding the **type scale** and turning **gradients into ready-to-use CSS strings** in tokens.
2. Adding an **additive semantic color layer** and migrating components onto it.
3. Adding four composition primitives: **`Screen`, `Button`, `SectionHeader`, `ListRow`**.
4. Adding a **hex-guard test** so "reference a token, never hardcode" is enforced, not just convention.
5. Updating **DESIGN.md** to match (and fixing one stale claim in it).

### Guiding constraint: visual-preserving

This is a **refactor, not a redesign**. Every per-variant color/size is matched to what the
screens render today. The end state should be pixel-identical; the only intended change is
*fewer literals and less duplication*. Any visual diff during migration is a bug to fix, not
an improvement to keep. (Direction B is locked — see project memory *Werd key decisions*.)

### Non-goals (YAGNI)

- No new screens, features, or visual treatments.
- No generic `Tile`/`Stack`/`Box` layout kit — only the two patterns that are actually repeated.
- No light/dark theme switching now; the semantic layer merely *makes it possible later*.
- No `loading` state on `Button` (the app has no async CTAs).
- Calendar/stats **cell** tokens (`partialCell`, `futureCell`, …) stay as-is — they are already
  role-named. Migration only swaps the *generic* palette tokens.

## 2. Approach

**Layered, bottom-up (approved approach A).** Each layer compiles and is independently
verifiable before the next, so review is incremental and any regression is contained:

1. **Tokens** — type scale, gradients-as-CSS, semantic map (purely additive; nothing breaks).
2. **Primitives** — `Screen`, `Button`, `SectionHeader`, `ListRow`, built on the new tokens.
3. **Migration** — rewrite screens to use the primitives; rewrite components to use semantic
   color names instead of raw palette tokens.
4. **Guard** — the hex-literal test.
5. **Docs** — update DESIGN.md.

## 3. Token layer ([src/theme/tokens.ts](../../../src/theme/tokens.ts))

### 3a. Type scale — `text`

New preset record. Each variant carries **size + weight + lineHeight only**; color stays a
separate, contextual prop. Line heights are generous for Arabic.

```ts
export const text = {
  title:      { size: 26, weight: "bold",    lineHeight: 34 }, // page titles (greeting name)
  heading:    { size: 18, weight: "bold",    lineHeight: 26 }, // section headers (أورادي)
  subheading: { size: 16, weight: "bold",    lineHeight: 24 }, // card titles
  body:       { size: 15, weight: "regular", lineHeight: 24 }, // default
  label:      { size: 14, weight: "medium",  lineHeight: 20 }, // labels, button text
  caption:    { size: 12, weight: "regular", lineHeight: 18 }, // meta text
  micro:      { size: 11, weight: "regular", lineHeight: 14 }, // weekday letters
} as const;
```

`Txt` gains an optional `variant?: keyof typeof text`. When set, it supplies the
size/weight/lineHeight defaults; an explicit `size`/`weight`/`style.lineHeight` still wins.
This is **non-breaking** — every existing `<Txt size={…} weight={…}>` call keeps working
unchanged. Naskh/dhikr text keeps its explicit `lineHeight` (e.g. 46) and is **not** forced
into the scale.

### 3b. Gradients → CSS strings

Replace the array-form `gradients` and the separate `badgeGradientCss` with a single record of
the strings actually applied via `experimental_backgroundImage` (the Expo 55 idiom):

```ts
export const gradients = {
  darkScreen: "linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
  brandCard:  "linear-gradient(150deg, #1c4a3a, #0e2d22)",
  gold:       "linear-gradient(150deg, #d8b46a, #bf9648)",
  sage:       "linear-gradient(150deg, #3f8268, #2c5e4a)",
  terracotta: "linear-gradient(150deg, #c8784e, #a85733)",
} as const;
```

Consumers:
- Screens → `gradients.darkScreen` (removes 10 duplicated literals).
- `StreakHero` → `gradients.terracotta`.
- `BadgeTile` → `gradients[def.gradient]` where `def.gradient ∈ "gold" | "sage" | "terracotta"`.
  (The `BadgeDef.gradient` field's `terracotta` key already matches.)
- `onboarding` → composes its radial glow on top of `gradients.darkScreen` (the radial overlay
  string stays inline in onboarding as a one-off, but its linear base references the token).

### 3c. Semantic color layer — `semantic`

Additive. The literal palette (`colors`) is **unchanged**; `semantic` references it by role.
Multiple roles may point at the same palette value — that is intended aliasing.

```ts
export const semantic = {
  // Surfaces — dark
  screen:        colors.green800,     // base screen bg (under gradient)
  screenDeep:    colors.green900,     // gradient end / deepest bg
  surface:       colors.whiteAlpha06, // default raised card on dark
  surfaceStrong: colors.whiteAlpha08, // reset btn fill, ring track, tab hairline
  surfaceFaint:  colors.whiteAlpha14, // progress track, dashed-border fill, upcoming segs
  brandSurface:  colors.green700,     // evening / brand card

  // Surfaces — cream / light
  surfaceCream:    colors.cream50,    // cards on dark (morning card)
  surfaceCreamAlt: colors.cream200,   // subtle tiles
  screenCream:     colors.cream100,   // light screen bg

  // Text
  textPrimary:      colors.creamText,            // default text on dark (Txt default)
  textSecondary:    colors.muted3,               // captions on dark
  textOnColor:      "#fff",                       // text on terracotta/gold/colored fills
  textOnColorMuted: "rgba(255,255,255,0.85)",     // secondary text on the hero
  textOnCream:      colors.green800,             // text on cream/light cards
  textMutedCream:   colors.muted1,               // secondary text on cream
  textTertiary:     colors.muted2,               // tertiary / inactive tab icon+label
  textGhost:        "#cfe0d6",                     // the reset-button ("تصفير") label

  // Accent / status
  accent:      colors.gold500,
  accentLight: colors.gold300,
  accentDeep:  colors.gold700,
  success:     colors.sage,
  warm:        colors.terracotta500,
  warmDeep:    colors.terracotta700,

  // Lines / borders
  border:       colors.whiteAlpha14,  // dashed empty-state border on dark
  borderCream:  colors.borderWarm,    // hairline + progress track on cream
  goldHairline: colors.goldAlpha25,   // gold border on the dhikr card
} as const;
```

This absorbs today's "intentional literals": `#fff` → `semantic.textOnColor`,
`rgba(255,255,255,0.85)` → `semantic.textOnColorMuted`, `#cfe0d6` → `semantic.textGhost`.
After migration the only hex/rgba literal expected to remain in `src/app`/`src/components` is
the tab-bar translucent fill `rgba(14,45,34,0.96)` (see the hex-guard allowlist, §5).

**Migration rule:** components stop importing raw generic palette tokens (`green800`,
`gold500`, `whiteAlpha*`, `creamText`, `muted*`, `borderWarm`) and import `semantic.*` instead.
Cell tokens and gradient keys are unaffected.

## 4. Primitives ([src/components/](../../../src/components/))

### 4a. `Screen` — `src/components/screen.tsx`

Removes the duplicated background + safe-area + scroll scaffolding from every screen.

```tsx
<Screen scroll gradient="darkScreen">…</Screen>
```

| prop | type | default | behavior |
|------|------|---------|----------|
| `gradient` | `keyof typeof gradients` | `"darkScreen"` | applied via `experimental_backgroundImage`; `backgroundColor: semantic.screen` underneath |
| `scroll` | `boolean` | `true` | `true` → `ScrollView` with the standard padding contract; `false` → padded `View` (fixed layouts: tasbih/session counters) |
| `contentStyle` | `ViewStyle` | – | override/extend the content container (for header-bleed screens like list/session) |
| `children` | `ReactNode` | – | |

Standard padding contract (owned here so no screen touches insets directly):
`paddingTop: insets.top + spacing.lg`, `paddingBottom: spacing.xxl`,
`paddingHorizontal: spacing.xl`, `gap: spacing.lg`, `showsVerticalScrollIndicator={false}`.
Uses `useSafeAreaInsets()` internally.

Screens with a custom edge-to-edge header (list, session) pass `contentStyle` to drop the
horizontal padding where the header needs to bleed, keeping it for the body.

### 4b. `Button` — `src/components/button.tsx`

Three variants, each matched to existing CTAs (exact fill/text values lifted from the current
screens during migration — **no visual change**):

```tsx
<Button variant="primary" onPress={start}>ابدأ المسبحة</Button>
<Button variant="ghost" icon="arrow.left" onPress={next}>الذكر التالي</Button>
<Button variant="link" icon="plus" onPress={add}>إضافة وِرد</Button>
```

| variant | fill | text color | used for |
|---------|------|-----------|----------|
| `primary` | `gradients.gold` (or `surfaceCream` per current screen) | `semantic.textOnCream` | ابدأ / حفظ / ابدأ المسبحة |
| `ghost` | `semantic.surfaceStrong` | `semantic.textGhost` | تصفير reset, الذكر التالي |
| `link` | none | `semantic.accentLight` | إضافة وِرد (icon + text) |

| prop | type | default | notes |
|------|------|---------|-------|
| `variant` | `"primary" \| "ghost" \| "link"` | `"primary"` | |
| `onPress` | `() => void` | – | |
| `icon` | `IconName` | – | rendered via existing `<Icon>`, leading edge |
| `haptic` | `boolean` | `true` | `expo-haptics` light impact on press (dep already present) |
| `disabled` | `boolean` | `false` | reduces opacity, blocks press + haptic |
| `children` | `ReactNode` | – | the label (rendered through `Txt variant="label"`) |

Pressed feedback is uniform: `({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })`.
Text is always rendered through `Txt` (never raw `<Text>`), preserving RTL + font.

### 4c. `SectionHeader` — `src/components/section-header.tsx`

The repeated "title on one side, action on the other" row:

```tsx
<SectionHeader title="أورادي" action={<Button variant="link" icon="plus">إضافة وِرد</Button>} />
```

| prop | type | notes |
|------|------|-------|
| `title` | `string` | rendered `Txt variant="heading"` |
| `action` | `ReactNode?` | optional trailing node (usually a `link` Button) |

Lays out `flexDirection: "row"`, space-between, centered; `marginTop: spacing.xs` to match
current spacing.

### 4d. `ListRow` — `src/components/list-row.tsx`

The `surface` (whiteAlpha06) rounded pressable row used for awrad items and category lists:

```tsx
<ListRow onPress={open} onLongPress={edit}>
  <View style={{ flex: 1 }}>…title/subtitle…</View>
</ListRow>
```

| prop | type | default | notes |
|------|------|---------|-------|
| `onPress` | `() => void` | – | |
| `onLongPress` | `() => void` | – | optional |
| `accessory` | `ReactNode` | `<Icon name="chevron.forward" …/>` | trailing element |
| `children` | `ReactNode` | – | the row body |

Surface: `semantic.surface`, `radii.tile`, `borderCurve: "continuous"`, `padding: spacing.lg`,
row layout with the accessory pinned to the trailing edge. Deliberately **not** generalized
into a `Tile` — only this one pressable-row shape is repeated.

## 5. Hex-guard test — `src/theme/__tests__/no-raw-hex.test.ts`

A Jest test that reads every `.tsx`/`.ts` file under `src/app` and `src/components`, scans for
`#[0-9a-fA-F]{3,8}` and `rgba(` literals, and fails listing any match not in an allowlist.

Expected allowlist after migration:
- `rgba(14,45,34,0.96)` — the tab bar's translucent fill ([tab-bar.tsx](../../../src/components/tab-bar.tsx)).
- The radial-glow string in `onboarding.tsx` (one-off overlay; its linear base uses the token).

If the allowlist needs more than these two entries, that's a signal a literal was missed —
migrate it to a token rather than expanding the allowlist.

## 6. DESIGN.md updates

- Document the new `text` scale, `gradients` CSS strings, and `semantic` color layer.
- Document the `Screen`, `Button`, `SectionHeader`, `ListRow` primitives (when to use each).
- **Fix the stale claim**: §3 currently states `Txt` defaults to `align="right"` and
  `writingDirection: "rtl"`. The shipped component defaults to `align="auto"` and sets neither —
  which is correct per project memory *RTL convention* (RN swaps `right→left` under RTL). Update
  the doc to match the code.

## 7. Files touched (estimate)

- **Edit** `src/theme/tokens.ts` (add `text`, rewrite `gradients`, add `semantic`).
- **Edit** `src/components/txt.tsx` (add `variant`).
- **New** `src/components/screen.tsx`, `button.tsx`, `section-header.tsx`, `list-row.tsx`.
- **New** `src/theme/__tests__/no-raw-hex.test.ts`.
- **Edit (migrate)** ~10 screens under `src/app/**` + existing components
  (`streak-hero`, `badge-tile`, `level-card`, `stat-chip`, `card`, `progress-bar`,
  `tasbih-counter`, `tab-bar`, `ward-form`) onto primitives + `semantic.*`.
- **Edit** `DESIGN.md`.

## 8. Verification

- `npm run lint` clean.
- `npm test` green, including the new hex-guard test.
- Manual smoke on a dev build (per project memory *Dev build required* — dev-client, not Expo
  Go): home, session, tasbih, list, profile, achievements, stats, challenges, onboarding,
  reminders, awrad new/edit — confirm **no visual change**.
- Per AGENTS.md, verify any Expo-55-specific API (`experimental_backgroundImage`, `expo-haptics`)
  against https://docs.expo.dev/versions/v55.0.0/ before writing the code.

## 9. Risks

- **Visual drift during migration** — mitigated by the visual-preserving rule + manual smoke
  across all screens.
- **Semantic naming churn in DESIGN.md** — DESIGN.md documents palette roles extensively;
  it must be updated in lockstep (§6) or it goes stale.
- **`Screen` padding contract** doesn't fit every screen — escape hatch is `contentStyle`;
  header-bleed screens (list/session) are the known cases.
