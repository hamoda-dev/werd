# أذكاري tab — design spec

**Date:** 2026-06-14
**Status:** Approved (visual companion review complete)

## Goal

Turn the current free-counter **التسبيح** tab into **أذكاري** — a categorized library of remembrances the user counts (يسبّح). It absorbs the old **أورادي** home block (which is deleted from home). The tab lists **locked built-in classics** plus the **user's own أذكار**, grouped and filterable by **category**.

## Decisions (from brainstorming)

1. **Seed the 4 classic phrases** (سبحان الله، الحمد لله، الله أكبر، لا إله إلا الله) — shipped as **read-only built-ins**, not editable/deletable.
2. **Count style is per-ذِكر:** each item is **target-based** (ring fills, celebrates, awards points once/day) **or free** (open tally, no goal, no points).
3. **Swipe-to-reveal** edit/delete on the user's own items only (locked items don't swipe).
4. **Categories: default set + user can add.** Defaults: التسبيحات · الاستغفار · الصلاة على النبي · أدعية · عامة (locked). Users create/rename/delete their own; deleting one reassigns its أذكار to «عامة».
5. **Scope boundary:** أذكاري = the tasbih library (locked classics + user items). The built-in **morning/evening sessions stay on home** — not folded in.

## Data model

### types.ts
- `AdhkarCategory = { id: string; label: string; builtin: boolean }`
- `CustomWard` gains `category: string` and `count` becomes `number | null` (`null` = free / no target).
- `WardValues` (form) = `{ title; text; count: number | null; category: string }`.
- `AdhkariItem = { id; title?; text; count: number | null; category: string; locked: boolean }` — the unified row shape the list + counter render.

### Built-in content — `src/data/adhkari.ts`
- `DEFAULT_CATEGORIES: AdhkarCategory[]` — the 5 locked defaults (ids: `tasbihat`, `istighfar`, `salat-nabi`, `adiya`, `general`).
- `BUILTIN_ADHKAR: AdhkariItem[]` — locked classics with stable ids (`bi-*`), each tagged with a category and a target count. Pure helpers: `mergeAdhkariItems(custom)`, `groupByCategory(items)`, `getAdhkariItemById(id, custom)`.

### Storage — `src/utils/storage.ts`
- New key `customCategories: "werd.customCategories"` → `AdhkarCategory[]` (user-created only; builtin defaults are not stored).

### Store — `src/store/store.ts`
- `useCustomCategories()` → `{ list, add(label), rename(id,label), remove(id) }`. `remove` also rewrites `customAwrad` items in that category to `general`.
- `useAdhkariCategories()` → `DEFAULT_CATEGORIES` + user categories (reactive).
- `useAdhkariItems()` → `BUILTIN_ADHKAR` + mapped `customAwrad` (reactive; legacy items missing `category` normalize to `general`).
- `useCustomAwrad().add/update` accept `category` + nullable `count` (type flows from `CustomWard`).
- Counting reuses `getPartialCount`/`setPartialCount` (per-id, per-day) and `completeWard()` (points + `wardDone` challenge) — fired only when a **target** item reaches its goal. Free items award nothing.

## Components

- **`TasbihCounter`** gains a **free mode**: `target: number | null`. When null → never `done`, faint full ring, subtitle «تسبيح حر», no celebration/auto-advance (light tap haptic stays). `onChange` still persists each tap.
- **`WardForm`** gains a **category picker** (chips from `useAdhkariCategories()` + dashed «+ جديدة» inline-create via `useCustomCategories().add`) and a **هدف محدد ⇆ تسبيح حر** toggle (free hides the stepper, sets `count: null`).
- **`AdhkarRow`** (new) — a list row: locked variant (count chip + 🔒, no swipe) vs user variant (`ReanimatedSwipeable` revealing تعديل/حذف, count chip + chevron). Tap → `/dhikr/[id]`.

## Screens / routes

- **`(tabs)/tasbih.tsx`** (route name stays `tasbih`, label → **أذكاري**) becomes the list: title + add button, horizontal **filter chips** (الكل + categories), **grouped-by-category** under «الكل» / flat when filtered. Built on `Screen`.
- **`dhikr/[id].tsx`** (new) — single-ذِكر counter. Resolves built-in or custom by id; dhikr card (Amiri) + `TasbihCounter` (target or free) + تصفير. Target complete → `completeWard()` then back. Free → no completion.
- **`settings/categories.tsx`** (new) — manage categories: defaults shown 🔒 locked; user ones rename (inline `TextInput`) / delete (`Alert` confirm, items → عامة); «+ تصنيف جديد». Linked from **Profile**.
- **`awrad/new.tsx` / `awrad/[id].tsx`** — unchanged routes (modals), now pass categories + nullable count through `WardForm`.
- **`(tabs)/index.tsx`** — delete the أورادي section (and now-unused `useCustomAwrad`/`SectionHeader`/`ListRow`/`Button` imports).
- **`tab-bar.tsx` + `(tabs)/_layout.tsx`** — tasbih label/title → **أذكاري**. Route name + misbaha glyph unchanged.
- **`_layout.tsx`** — register `dhikr/[id]` and `settings/categories`.

## RTL / design conformance
- All copy Arabic, `textAlign:"auto"`, Eastern-Arabic numerals via `toArabicNumerals()`.
- Chips use `radii.pill`, gold-fill active / `surfaceStrong` inactive (button language). Lock uses `🔒` (Icon `lock.fill`). Colors via `tokens.semantic` only — `no-raw-hex` test must stay green.
- `ReanimatedSwipeable` actions: `renderRightActions` (gesture-handler respects forced RTL); verify swipe direction on device.

## Testing
- `src/data/__tests__/adhkari.test.ts` — pure helpers: defaults present & locked; builtin items mapped with `locked:true` + category; `mergeAdhkariItems` normalizes legacy (missing category → general); free count (`null`) preserved; `groupByCategory`; `getAdhkariItemById` resolves builtin + custom.
- `tsc --noEmit` clean; full `jest` green (incl. `no-raw-hex`).

## Migration / safety
- Local-only; no destructive migration. Legacy `customAwrad` items (no `category`, numeric `count`) read fine — normalized to `general`, stay target-based. `/session/[wardId]` left intact (harmless) though the tab now routes to `/dhikr/[id]`.
