# وِرْد v2 — Achievements/Badges, Challenges, Stats & Calendar

Implementation plan for the deferred v2 surfaces from [DESIGN.md](DESIGN.md) §11.
Status: **reviewed (plan-eng-review)** · Branch: `design-review-fixes` · Created: 2026-06-14

> Grounded against real code. The points/level/streak engine and the `achievements.tsx`
> shell already exist — this increment builds **on top** of that engine, deriving from the
> existing `werd.progress` map wherever possible rather than adding new storage.

## Locked decisions (from review)

| # | Decision | Choice |
|---|----------|--------|
| D1 | Delivery | **All three features in one PR** |
| D2 | Tests | **Set up `jest-expo` + unit-test all pure logic** |
| D3 | Hijri | **Add a Hijri library for the month *label*; grid stays Gregorian** |
| D4 | Reward UX | **Auto-claim on view** (calm, zero taps) |
| D5 | Ward signal | **Add `wardDone` to `DayProgress`** (not a `completedIds` sentinel) |
| D6 | Badges | **Derive unlocked set on read** (no badge storage, no write path) |
| D7 | Calendar | **Hijri label + Gregorian grid** (label via lib, cells keyed Gregorian) |
| D8 | Week start | **Saturday-aligned week** for the weekly challenge + bar chart |
| D9 | Level source | **Build now** — drop stored `Score.level`, derive via `levelInfo()` everywhere |
| D10 | Card dedup | **Build now** — also extract shared `StreakHero` + `LevelCard` (not just ProgressBar/StatChip/Card) |
| D11 | Home card | **Build now** — add a "تحدي اليوم" card on Home once Challenges lands |
| D12 | Outside voice | Skipped |

---

## Goal & Scope

Ship the three deferred gamification surfaces by **deriving from existing `werd.progress` /
`werd.score` / `werd.streak` data** and reusing the storage/hook pattern in
[src/store/store.ts](src/store/store.ts). Net-new persistence is added only for the
irreducible (challenge reward-claim flags + weekly window). Badges are derived, not stored.

Ships in this increment (one PR):
- **Achievements & Badges** — a 9-badge starter catalog, a pure `evaluateBadges()`, **derived on read** in `useBadges()`, and the locked/unlocked grid appended to the existing `achievements.tsx`.
- **Challenges** — one weekly featured challenge + 4 static daily challenges, progress *derived*, rewards **auto-claimed once** (in an effect), on a new route `app/challenges.tsx`.
- **Stats & Calendar** — a new route `app/stats.tsx`: month switcher with a **Hijri label** (Gregorian grid), 7-col calendar colored by per-day state, legend, Saturday-aligned "هذا الأسبوع" bar chart.
- **Shared component layer** — extract `ProgressBar`, `StatChip`, `Card`, `BadgeTile`, **`StreakHero`, `LevelCard`** (D10, refactor-first).
- **Unify `level`** — derive via `levelInfo()`, drop the stored `Score.level` field (D9).
- **Home "تحدي اليوم" card** — surface today's top open challenge on Home (D11).
- New design tokens for the calendar/locked hexes.
- **`jest-expo` test harness** + unit tests for every pure function.

---

## What already exists (reuse, don't rebuild)

| v2 sub-problem | Reuse | Notes |
|---|---|---|
| Points / level / rank | `POINTS_PER_CATEGORY=50`, `POINTS_PER_WARD=20`, `POINTS_PER_LEVEL=500`, `levelInfo()`, `levelTitle()` ([store.ts:16-53](src/store/store.ts)) | Challenge rewards award via the **same** `storage.set(StorageKeys.score)` path as `completeWard()`. No separate points pool. |
| Streak | `applyStreakOnComplete()` + `useStreak()` | Advances **only** via `completeCategory`; awrad don't move it. Badges read `streak.longest`. |
| Per-day completion (source of truth) | `ProgressMap` via `useProgressMap()`; `DayProgress` ([types.ts:41-47](src/types.ts)) | Calendar cells, active-days, total-adhkar, weekly bars, badges, challenge progress all **derive** from this map. |
| Aggregate stats | `activeDays`/`totalAdhkar` inline in `achievements.tsx:40-42` | Extract into pure `aggregateStats(progress)` shared by badges + chips + challenges. |
| Date math | `dateKey`, `todayKey`, `previousDayKey`, `last7DayKeys`, `weekdayLetter` ([dates.ts](src/store/dates.ts)) | `todayKey()` is the only day-boundary authority. Calendar + week-start need new helpers. |
| Storage + reactivity | `storage.get/set/subscribe`, `useStorage<T>`, `StorageKeys` (synchronous external store via `useSyncExternalStore`) | New key pattern: add to `StorageKeys` + frozen `DEFAULT_*` + a `useX()`. Corrupt JSON already falls back to default ([storage.ts:25-29](src/utils/storage.ts)). |
| Achievements shell | `achievements.tsx` (terracotta hero + 3 chips + level card, all real data) | Extend in place; append the grid. Don't fork. |
| `ProgressBar` | inline [index.tsx:28-42](src/app/(tabs)/index.tsx) — reused 3× + hand-rolled again in `achievements.tsx:106-108` | **Extract once** (refactor-first). |
| `StatChip` | inline `achievements.tsx:14-31` | Extract. |
| Icons | `<Icon>` + `FALLBACK` map ([icon.tsx](src/components/icon.tsx)) | All needed glyphs already mapped — no icon work. |

**Debt pulled into scope (D9/D10):** streak-hero/level-card duplication and the `Score.level` double-source are both fixed in this PR — extracted into shared components and derived via `levelInfo()` respectively.

---

## Data model changes

**Principle: derive first, persist only the irreducible.** After D5/D6 only **one** new key remains.

### New `StorageKeys` (append to [storage.ts:52-59](src/utils/storage.ts))
```ts
challenges: "werd.challenges",  // ChallengeState  (badges are NOT stored — derived)
```

### `DayProgress` gains one field ([types.ts:41-45](src/types.ts))
```ts
export interface DayProgress {
  morningDone: boolean;
  eveningDone: boolean;
  completedIds: string[];
  wardDone?: boolean;   // NEW (D5): a custom ward was completed this day. Keeps completedIds = "adhkar tapped".
}
```
`completeWard()` sets `wardDone = true` on today's entry (idempotent; no streak impact, preserving `store.ts:141`). `totalAdhkar = Σ completedIds.length` stays correct — the ward signal never enters `completedIds`.

**`Score` loses `level` (D9):** `Score = { points: number }`. `level` is derived everywhere via `levelInfo(points).level`; `completeCategory`/`completeWard` stop writing a `level` field. A one-time read-tolerant default ignores any stale stored `level`. This removes the stored-vs-computed drift the new badges depend on.

### New types ([src/types.ts](src/types.ts))
```ts
export type BadgeId =
  | "first_morning" | "first_evening" | "streak_3" | "streak_7"
  | "streak_30" | "active_30" | "adhkar_100" | "adhkar_500" | "level_3";
export interface BadgeDef { id: BadgeId; label: string; icon: string; gradient: "gold" | "sage" | "terracotta"; }
// No BadgeState — unlocked set is DERIVED on read (D6).

export type ChallengeId = "weekly_no_miss" | "daily_morning" | "daily_evening" | "daily_both" | "daily_ward";
export interface DailyChallengeDef { id: ChallengeId; title: string; icon: string; reward: number; }

/** Persisted ONLY: reward-claim idempotency + weekly window. Progress is DERIVED. */
export interface ChallengeState {
  dailyClaimed: Record<string, ChallengeId[]>; // dateKey -> claimed ids
  weekStart: string | null;                    // Saturday-aligned (D8)
  weeklyClaimed: boolean;
}
```

### Frozen default (store.ts)
```ts
const DEFAULT_CHALLENGES: ChallengeState = { dailyClaimed: {}, weekStart: null, weeklyClaimed: false };
```

### Data-flow (badges derived, rewards auto-claimed in an effect)
```
   user finishes a category session                  user finishes a custom ward
              │                                                  │
              ▼                                                  ▼
   completeCategory(categoryId)   ← store.ts:113        completeWard()          ← store.ts:142
   ├─ set(progress, …)                                  ├─ set(score, +20)
   ├─ first-of-day: set(score +50), set(streak …)       └─ set(progress, {…, wardDone:true})   ← D5
   └─ (NO new write path — D6 removed syncGamification)

   reactive reads (useSyncExternalStore):
     useBadges()    ─ derive evaluateBadges(progress, score, streak) on read     ← D6, no storage
     stats.tsx      ─ dayState / weeklyBars / weekDelta from progress            ← derived
     challenges.tsx ─ dailyDone / weeklyProgress from progress; auto-claim in useEffect (idempotent)
```
Reward claim is the **only** new write, and it happens in a `useEffect` (never during render — React Compiler/StrictMode safe), guarded by `dailyClaimed[today]` / `weeklyClaimed`.

---

## Feature 1 — Achievements & Badges (D6: derived)

**Catalog** (`src/data/badges.ts`, static): 9 badges.
```
first_morning(sun,gold) first_evening(moon,sage)
streak_3 / streak_7 / streak_30(flame,terracotta)   // use longestStreak, not current
active_30(checkmark.seal,sage)  adhkar_100 / adhkar_500(star,gold)  level_3(checkmark.seal,gold)
```
**Evaluation** (`src/store/badges.ts`, pure): `evaluateBadges(input): BadgeId[]` over `{morningEverDone, eveningEverDone, longestStreak, activeDays, totalAdhkar, level}`. `morningEverDone = Object.values(progress).some(d => d.morningDone)`.
**Hook**: `useBadges()` reads `useProgressMap()/useScore()/useStreak()`, runs `aggregateStats` + `evaluateBadges`, returns `Set<BadgeId>`. **No storage, no write path.**
**UI** (extend `achievements.tsx`): 3rd chip → badge count (`شارة`); 3-col `<BadgeTile>` grid — unlocked = gradient by `gradient` field, locked = `lockedTile` (`#ece6d8`) + `lock.fill`. `flexWrap`, `width:"31%"`.

New: `src/data/badges.ts`, `src/store/badges.ts`, `src/components/badge-tile.tsx`, `stat-chip.tsx`, `progress-bar.tsx`, `card.tsx`. Edit: `achievements.tsx`, `types.ts`, `tokens.ts`.

---

## Feature 2 — Challenges (D4 auto-claim, D8 week)

**Daily** (`src/data/challenges.ts`, 4 static defs): `daily_morning(+20)`, `daily_evening(+20)`, `daily_both(+15)`, `daily_ward(+15)`. Progress = pure `dailyDone(def, todayProgress)`; `daily_ward` reads `todayProgress.wardDone` (D5).
**Weekly featured**: `weekly_no_miss` — "لا تفوّت ذِكراً ٧ أيام", `+50`. Window anchored by Saturday-aligned `weekStart` (D8); `weeklyProgress = count(non-missed days since weekStart, cap 7)`.
**Claim (auto, idempotent)**: `challenges.tsx` runs a `useEffect` that, for each derived-complete & unclaimed challenge, adds the reward to `score` once and records it in `dailyClaimed[today]` / sets `weeklyClaimed`. Never in render. Week rollover (in the same effect) resets when `todayKey()` ≥ 7 days past `weekStart`, recomputing `weekStart = startOfWeekKey(todayKey())`.
**UI** (`src/app/challenges.tsx`, `darkScreen` gradient): gold-gradient featured card + `ProgressBar ٥/٧` + reward pill; daily rows (`whiteAlpha06`), completed → sage `checkmark` + sage text.
**Entry**: from the Achievements tab via `router.push("/challenges")`, **and a "تحدي اليوم" card on Home** (D11) showing today's top open daily challenge (title + progress), tapping into `/challenges`. The card reuses the shared `Card` + `ProgressBar`; it reads `useChallenges()` + `useTodayProgress()` and renders nothing if all daily challenges are done (keeps Home calm when there's nothing to nudge).

New: `src/data/challenges.ts`, `src/store/challenges.ts` (pure progress + claim actions + `useChallenges()`), `src/app/challenges.tsx`. Edit: `store.ts` (`completeWard` sets `wardDone`), `achievements.tsx` (nav link), `index.tsx` (Home card), `storage.ts`, `types.ts`.

---

## Feature 3 — Stats & Calendar (D3/D7 Hijri label + Gregorian grid, D8 week)

**New `dates.ts` helpers**: `monthDayKeys(year, month1)`, `firstWeekdayOfMonth(year, month1)`, **`startOfWeekKey(key)`** (Saturday-aligned), **`thisWeekKeys()`** (Sat→today, ≤7). Reuse `dateKey`/`weekdayLetter`.
**Calendar grid**: 7 cols, RTL headers **س ح ن ث ر خ ج**. Cell = pure `dayState(key, progress, todayKey)`:

| State | Condition | BG | Text |
|---|---|---|---|
| Today | `key === todayKey()` | `gold500 #d8b46a` | `green800 #16352a` |
| Future | `key > todayKey()` (string cmp) | `#f3eee2`* | `#cdc6b5`* |
| Complete | `morningDone && eveningDone` | `green700 #1c4a3a` | `#fff` |
| Partial | one of morning/evening | `#bfd8c9`* | `#2a5444`* |
| Empty/missed | past, neither | `#ece6d8`* | `#b3bcb4`* |

`*` = **new tokens** (`partialCell`, `partialCellText`, `futureCell`, `futureCellText`, `missedCell`, `missedCellText`, `lockedTile`). Today wins over complete/partial. Numbers via `toArabicNumerals`. Grid is **Gregorian-keyed** (matches `progress`).
**Month switcher**: `‹ <label> ›` (chevrons), `{year, month}` in `useState`, year rollover.
**Month label — Hijri (D3/D7)**: a Hijri library (candidate **`@umalqura/core`** — pure-JS umm-al-qura, TypeScript, no `Intl` dependence, works under Hermes) produces the label from the month's representative date. **Wrap conversion in try/catch → Gregorian fallback** (umalqura libs throw outside their supported year range). Label is approximate (one Gregorian grid ≈ two Hijri months); the **grid stays Gregorian**. Verify the lib on a real device build before merge.
**Weekly bar chart** ("هذا الأسبوع"): `thisWeekKeys()` (Sat-aligned, D8); bar height ∝ `completedIds.length`; highest bar `gold500`. Delta "+١٢٪ عن السابق" via `toArabicPercent` over the previous Sat-week; **hide the caption if the previous week is empty** (no `Infinity`).
**UI** (`src/app/stats.tsx`): `whiteAlpha06` cards on `darkScreen`; legend = 3 swatches (`مكتمل`/`جزئي`/`فائت`).

New: `src/app/stats.tsx`, `src/store/calendar.ts` (pure `dayState`, `weeklyBars`, `weekDelta`), Hijri label util. Edit: `dates.ts`, `tokens.ts`, `achievements.tsx`. Add dep: Hijri lib.

---

## Navigation & routes

Tab bar is **fixed at 4 tabs** (`tab-bar.tsx:8-13` + `(tabs)/_layout.tsx:13-16`). **Do NOT add tabs.** Add two stack routes reached from the Achievements tab:
- `src/app/challenges.tsx` → `/challenges`
- `src/app/stats.tsx` → `/stats`

Siblings of existing non-tab stack routes (`awrad/`, `session/`, `settings/`, `list/`), pushed over the tab bar like `settings/reminders.tsx` is from profile. Add a 2-row nav block in `achievements.tsx` (`التحديات` → `/challenges`, `الإحصائيات والتقويم` → `/stats`).

---

## Edge cases & failure modes

| Codepath | Realistic failure | Test? | Error handling? | User sees |
|---|---|---|---|---|
| `dayState` new user / empty month | all cells "missed" except today/future | ✅ unit | n/a (total func) | clean empty calendar |
| `weekDelta` empty previous week | `prev=0` → `Infinity%` | ✅ unit | hide caption | no caption (correct) |
| Reward auto-claim | double-fire under StrictMode/double-mount → double points | ✅ integration | `dailyClaimed`/`weeklyClaimed` guard + effect (not render) | points award once |
| Hijri label | lib throws outside supported range | ✅ unit | try/catch → Gregorian label | a valid (Gregorian) label |
| `completeWard` wardDone | n/a (idempotent boolean) | ✅ unit | set-once | daily_ward completes once |
| Component extraction | Home/Achievements visual regression | ⚠ manual + RNTL smoke | careful refactor-first | identical UI |
| `done/total` ratios | `0/0 → NaN` width | ✅ unit | clamp (cf. index.tsx:167) | empty bar |

**Critical-gap check:** no failure mode is both untested AND unhandled AND silent. The Hijri-throw and double-claim cases are the two that *would* be silent — both are explicitly handled + tested.

---

## Test plan (D2: jest-expo)

**Setup:** `npx expo install jest-expo jest @types/jest`; `package.json` → `"test": "jest"`; `jest.config` → `preset: "jest-expo"`. All pure logic in `src/store/*` + `src/data/*` is testable on plain objects (no native mocks).

Coverage diagram (target 13/13 pure paths):
```
badges.ts      evaluateBadges       → streak 2→3/6→7/29→30, adhkar 99→100/499→500, level 2→3, ever-flags
               aggregateStats       → empty→zeros, mixed days correct
calendar.ts    dayState             → 5 states + today-precedence + future string-cmp + partial/complete
               weeklyBars/weekDelta → heights, highest-bar, %, empty-prev→caption hidden (no Infinity)
challenges.ts  dailyDone (×4 defs)  → morning/evening/both/ward states
               weeklyProgress       → 0 / partial / 5-of-7 / 7-of-7 / missed-window
               claim idempotency    → [→integration] claim twice → +once
dates.ts       monthDayKeys/firstWeekdayOfMonth → 28/29/30/31, leap, rollover
               startOfWeekKey/thisWeekKeys      → Saturday alignment, rollover
hijri          hijriLabel           → known date + out-of-range → Gregorian fallback
REFACTOR       ProgressBar/StatChip/Card extraction → [→manual] Home + Achievements pixel-unchanged
```
Integration (RNTL, lower priority): seed `storage`, render the 3 screens, assert locked-vs-unlocked tiles, calendar colors, and that auto-claim awards once.

---

## NOT in scope

- **Push/server notifications** — local-only by design. Notification *mock* (§11d) = already-shipped `settings/reminders.tsx`.
- **Leaderboards/social** — no network, no accounts.
- **Animated badge reveals / "newly unlocked" UI** — "calm first"; also why badges are derived not timestamped (D6).
- **True Hijri-gridded calendar** — grid stays Gregorian (D7); only the label is Hijri.
- **Rotating/generated daily challenges** — fixed static set this round.
- **Per-ward analytics** — only a boolean `wardDone`; no per-ward history (D5).
- **Animated badge/level-up celebrations** — static gold reward only ("calm first").

---

## Worktree parallelization

| Workstream | Modules touched | Depends on |
|---|---|---|
| **Foundation** (refactor) | `components/`, `types.ts`, `storage.ts`, `tokens.ts`, `store/dates.ts`, jest setup | — |
| **Badges** | `data/`, `store/badges.ts`, `components/badge-tile`, `(tabs)/achievements.tsx` | Foundation |
| **Stats** | `app/stats.tsx`, `store/calendar.ts`, `store/dates.ts`, Hijri lib | Foundation |
| **Challenges** | `app/challenges.tsx`, `store/{challenges}.ts`, `store/store.ts` | Foundation |

- **Lane A (sequential, first):** Foundation — extract shared components (incl. `StreakHero`/`LevelCard`, D10) + add types/keys/tokens/date-helpers + jest + the `Score.level` drop (D9, touches `completeCategory`/`completeWard`). Verify Home/Achievements unchanged. Bigger now — land it whole before feature lanes branch.
- **Lanes B/C/D (after A):** Badges / Stats / Challenges. Their **new files** (`store/{badges,challenges,calendar}.ts`, `data/*`, `app/{stats,challenges}.tsx`) are independent and parallelizable in worktrees.
- **Conflict flags:** B and C and D all edit **`achievements.tsx`** (nav links + grid) and **`types.ts`**; C and Foundation both edit **`dates.ts`**; D edits **`store.ts`**. Serialize the shared-file edits or land Foundation's `dates.ts`/`types.ts`/`achievements.tsx` scaffolding first so the feature lanes only append. For a solo dev, sequential B→C→D is simplest; worktrees pay off only if splitting across agents.

---

## Implementation Tasks

Synthesized from this review. P1 blocks ship; P2 same-branch; P3 follow-up.

- [ ] **T1 (P1, human ~3h / CC ~20min)** — components — Refactor-first: extract `ProgressBar`, `StatChip`, `Card`, **`StreakHero`, `LevelCard`** (D10) to `src/components/`; switch `index.tsx` + `achievements.tsx` to them. No behavior change.
  - Surfaced by: Code Quality D10 — "never structural + behavioral changes simultaneously"; de-dup streak-hero/level-card
  - Files: `src/components/{progress-bar,stat-chip,card,streak-hero,level-card}.tsx`, `src/app/(tabs)/{index,achievements}.tsx`
  - Verify: Home + Achievements visually identical (manual) + RNTL smoke — larger regression surface now
- [ ] **T2 (P1, human ~1h / CC ~10min)** — tooling — Set up `jest-expo` + `npm test`.
  - Surfaced by: Test Review — repo has no test runner
  - Files: `package.json`, `jest.config.js`, `jest.setup.ts`
  - Verify: `npm test` runs an example pass
- [ ] **T3 (P1, human ~1.5h / CC ~12min)** — data-model — Add `wardDone?` to `DayProgress` (D5); `ChallengeState` type + `StorageKeys.challenges` + `DEFAULT_CHALLENGES`; 7 calendar/locked tokens in `tokens.ts`; `completeWard` sets `wardDone`. **Drop `Score.level` (D9):** remove the field, derive via `levelInfo()`, stop writing it in `completeCategory`/`completeWard`.
  - Surfaced by: Architecture D5 (sentinel corrupts `totalAdhkar`) + Code Quality D9 (level double-source)
  - Files: `src/types.ts`, `src/utils/storage.ts`, `src/store/store.ts`, `src/theme/tokens.ts`, `src/app/(tabs)/{index,achievements}.tsx` (level reads)
  - Verify: unit test `completeWard` sets `wardDone` + leaves `completedIds` untouched; `level` consistent after points change
- [ ] **T4 (P2, human ~3h / CC ~20min)** — badges — `data/badges.ts` catalog, pure `store/badges.ts` `evaluateBadges`/`aggregateStats`, `useBadges()` derive-on-read (D6), `badge-tile.tsx`, achievements grid + chip swap.
  - Surfaced by: Feature 1 + D6
  - Files: `src/data/badges.ts`, `src/store/badges.ts`, `src/components/badge-tile.tsx`, `src/app/(tabs)/achievements.tsx`
  - Verify: unit tests for all thresholds; grid renders locked/unlocked
- [ ] **T5 (P2, human ~4.5h / CC ~28min)** — challenges — `data/challenges.ts`, `store/challenges.ts` (derive + Sat-aligned weekly + auto-claim helpers), `app/challenges.tsx`, achievements nav link, **Home "تحدي اليوم" card (D11)** in `index.tsx`. Auto-claim in `useEffect`, idempotent.
  - Surfaced by: Feature 2 + D4 + D8 + D11
  - Files: `src/data/challenges.ts`, `src/store/challenges.ts`, `src/app/challenges.tsx`, `src/app/(tabs)/achievements.tsx`, `src/app/(tabs)/index.tsx`
  - Verify: unit `dailyDone`/`weeklyProgress`/claim-idempotency; integration claim-twice→+once; Home card hidden when all daily done
- [ ] **T6 (P2, human ~4h / CC ~25min)** — stats — `dates.ts` helpers (`monthDayKeys`, `firstWeekdayOfMonth`, `startOfWeekKey`, `thisWeekKeys`), `store/calendar.ts` (`dayState`/`weeklyBars`/`weekDelta`), Hijri label util (lib + try/catch fallback), `app/stats.tsx`, achievements nav link.
  - Surfaced by: Feature 3 + D3/D7/D8
  - Files: `src/store/dates.ts`, `src/store/calendar.ts`, `src/app/stats.tsx`, `src/theme/tokens.ts`, `package.json` (Hijri dep)
  - Verify: unit tests for cell states, week helpers, Hijri fallback; device check of the Hijri label

---

## TODOs (deferred)

_None deferred this round._ All three candidate TODOs (unify `level` source, de-dup streak-hero/level-card, Home "تحدي اليوم" card) were pulled into scope — see D9/D10/D11 and tasks T1/T3/T5.

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | not run |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | not run |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | **CLEAR** | 6 findings, 0 critical gaps, 0 unresolved |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | not run |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | not run |

- **Scope:** all three features in one PR (D1); 3 deferred TODOs pulled into scope (D9/D10/D11). Net change vs draft: derive-on-read badges removed a storage key + write path; `wardDone` flag replaced a stat-corrupting sentinel.
- **UNRESOLVED:** 0 — every finding (D5–D11) resolved with an explicit decision.
- **Critical gaps:** 0 — the two would-be-silent failure modes (Hijri throw, double-claim) are both handled + tested.
- **Outside voice:** skipped (D12).
- **VERDICT:** **ENG CLEARED — ready to implement.** Suggested next: `/plan-design-review` (3 new/changed screens) before building, then `/ship` per task.
