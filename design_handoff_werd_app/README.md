# Handoff: وِرْد (Wird) — Morning & Evening Adhkar App

## Overview
**Wird (وِرْد)** is a mobile app (iOS-first, RTL/Arabic) for morning and evening adhkar
(Islamic remembrances). It pairs a calm, spiritual aesthetic with light gamification —
an interactive digital tasbih (counter), a daily streak, badges, challenges, a monthly
calendar, and gentle motivational reminders — to help users keep their daily *wird*
without interruption.

This package contains everything needed to implement the UI in a real codebase.

## About the Design Files
The files under `designs/` are **design references created in HTML** — interactive
prototypes that show the intended look, layout, and behavior. They are **not production
code to copy directly**.

The task is to **recreate these designs in the target codebase's environment** using its
established patterns and libraries:
- If the app is **React / React Native** → build as components with the project's styling system.
- If **SwiftUI / native iOS** → build with native views; the design is iOS-oriented (Dynamic Island, status bar, bottom tab bar).
- If **Flutter** → build with widgets.
- If no codebase exists yet → choose the most appropriate framework (React Native or SwiftUI recommended for this mobile, RTL app) and implement there.

Everything is **right-to-left (RTL)**. Numbers are shown in **Eastern Arabic numerals**
(٠١٢٣٤٥٦٧٨٩).

### How to open the references
`designs/*.dc.html` are self-contained — open either file directly in a browser to see
the live prototype. The main app screens are in `وِرْد.dc.html`; the logo system is in
`شعار وِرْد.dc.html`. `support.js` is the runtime they depend on (no need to read it).
The **tasbih counter is interactive** — click the large gold circle to see the count,
ring fill, completion celebration, and auto-advance behavior.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are
specified. Recreate the UI pixel-accurately, then wire it to real data/persistence.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|-------|-----|-----|
| `green-900` | `#0e2d22` | Darkest backgrounds, gradient end |
| `green-800` | `#16352a` | Primary dark surface, headings text |
| `green-700` | `#1c4a3a` | Primary brand green, buttons, cards |
| `green-500` (sage) | `#3f8268` | Success / completed states, charts |
| `gold-500` | `#d8b46a` | Accent: progress, highlighted buttons, sun |
| `gold-300` | `#f4d68a` | Light gold accents, glow |
| `gold-700` | `#bf9648` | Gold gradient end |
| `terracotta-500` | `#c8784e` | Streak, warm alerts |
| `terracotta-700` | `#a85733` | Streak gradient end |
| `cream-50` | `#fffdf7` | Cards on light screens |
| `cream-100` | `#faf7f0` | Light screen background |
| `cream-200` | `#f6efe2` | Subtle fills, tiles |
| `cream-text` | `#f4ede0` | Text/icons on dark surfaces |
| `muted-1` | `#6b7a72` | Secondary text |
| `muted-2` | `#8a9389` | Tertiary text / captions |
| `muted-3` | `#9fb3a8` | Captions on dark surfaces |
| `border-warm` | `#e7e0d0` | Hairline borders on cream |

### Typography
- **UI / numbers:** `IBM Plex Sans Arabic` — weights 400, 500, 600, 700 (700 is the heaviest available).
- **Adhkar / Quran text & the wordmark:** `Amiri` (Naskh) — weights 400, 700.
- Both are on Google Fonts. Eastern Arabic numerals everywhere.

Representative sizes (px, mobile @ 380-wide frame):
- Screen title / greeting name: 26 / 800
- Section heading: 18–22 / 800
- Body: 14–16 / 400–600
- Caption: 11–13 / 400–600
- Tasbih big counter: 78 / 900
- Dhikr text (Amiri): 24–27 / 700

### Spacing & Radius
- Card padding: 16–26
- Gap between cards: 12–18
- Screen horizontal padding: 22–30
- Border radius: tiles/list 18, cards 20–28, big cards 28, pills/buttons 18–30, full circles 50%
- Phone frame: outer radius 46, bezel 11px solid `#161512`

### Shadows
- Card on cream: `0 8px 20px -12px rgba(20,57,46,.3)`
- Elevated dark card: `0 18px 36px -16px rgba(14,45,34,.6)`
- Streak (terracotta) card: `0 16px 32px -16px rgba(168,87,51,.6)`

---

## Screens / Views

> The main file presents **three home-screen directions** plus the core and supporting
> screens. Direction **A (Calm & Spiritual)** is the recommended primary.

### 1. Home — Direction A (Calm & Spiritual) ★ recommended
- **Purpose:** Daily landing; shows greeting, today's progress, entry to morning/evening adhkar, streak, and the daily challenge.
- **Layout:** Vertical stack on a warm radial cream background (`#f4ede0`→`#efe7d6`). Soft sun-glow at top.
  - Header row: greeting + name (right), streak chip (left, cream card showing `٧` + "يوم متتالٍ").
  - "Today's Wird" card: dark green gradient, left a circular progress ring (65%, gold on translucent track) with `٦٥٪` center; right title "أذكار الصباح" + gold pill button "أكمِل الوِرد ←".
  - Two tiles (grid 1fr/1fr): "الصباح" (cream card, gold sun, "١٢ ذكراً") and "المساء" (dark green card, moon, "١١ ذكراً").
  - Daily-challenge row: cream card, icon + "تحدي اليوم / سبِّح ١٠٠ مرة قبل الظهر" + "٤٠٪".
- **Bottom nav (all screens):** 4 items — الرئيسية / التسبيح / إنجازاتي / ملفي. Active = green dot + green label; inactive = muted geometric icon. Height ~78, translucent cream, blurred, top hairline.

### 2. Home — Direction B (Playful & Motivating)
- **Purpose:** Same goal, gamified emphasis. Dark green screen.
- **Components:** Large terracotta streak hero (gold sun badge with `٧`, "٧ أيام متتالية! 🎉", week dots row with ✓/today/upcoming states); big start buttons with progress bars ("ابدأ أذكار الصباح" 8/12; "أذكار المساء" locked until ʿAsr); XP/level bar ("المستوى ٤ · ذاكِر مُجتهِد", 320/500).

### 3. Home — Direction C (Elegant & Focused)
- **Purpose:** Minimal, single-action focus. Light cream screen.
- **Components:** Hijri date + small streak; centered "حان وقت / أذكار الصباح" (Amiri); large focus ring (230px, count `٨` of ١٢); primary "متابعة الوِرد" button; secondary text link to evening.

### 4. Tasbih (Digital Counter) — APP CORE ★ interactive
- **Purpose:** Recite/count a dhikr; auto-advance through the day's list.
- **Layout:** Dark green gradient screen. Top: back / title ("أذكار الصباح" + position "الذكر ٣ من ٦") / more. Below: a row of segment bars showing list progress (done = sage `#3f8268`, current = gold `#d8b46a`, upcoming = translucent white).
  - Dhikr card: translucent surface, gold hairline border, centered Amiri dhikr text + virtue caption.
  - **Counter:** 240px tappable circle; SVG ring (track translucent white, progress gold, radius 104, smooth `stroke-dashoffset` transition); center shows big count (`countAr`) + "من {target}". Tapping increments. On reaching target: a celebration ring animation (`wd-ring`, ~0.9s) then auto-advance to next dhikr after ~950ms, resetting count to 0.
  - Controls: "تصفير" (reset) and "الذكر التالي ←" (next).
- **Data:** Each dhikr = `{ text, target, virtue }`. Default list of 6 is in the logic class (see Files). Targets e.g. 1, 3, 33, 100, 10, 3.

### 5. Adhkar List
- **Purpose:** See/jump within a session's adhkar.
- **Components:** Header + "أكملت ٨ من ١٢ ذِكراً". List items each: status circle (done = sage ✓ / current = gold number / upcoming = outlined number), Amiri dhikr title, repetition caption. Current item is a dark green gradient card with a ▶ glyph; completed items are dimmed (opacity .7).

### 6. Achievements & Streak
- **Components:** Terracotta streak banner (big `٧`, "يوماً متتالياً 🔥", "أطول سلسلة لك: ٢١ يوماً"); 3 stat chips (إجمالي الأذكار ٤٢٠ / يوم نشِط ٣٨ / شارة ٩); badge grid (3-col) with unlocked (gold/sage/terracotta gradient tiles) and locked (muted `#ece6d8`) states + labels.

### 7. Challenges
- **Components:** Dark green screen. Featured weekly challenge (gold gradient card: "تحدي الأسبوع / لا تفوّت ذِكراً ٧ أيام", progress bar 5/7, "+٥٠ نقطة"). Daily challenge list rows with icon, title, progress/Done state, and point reward (+٢٠ / +١٥ / +٢٠). Completed row uses sage check + sage text.

### 8. Stats & Calendar
- **Components:** Month switcher ("‹ رمضان ١٤٤٧ ›"); calendar grid (7-col, weekday headers س ح ن ث ر خ ج) where each day cell is colored by state — complete `#1c4a3a`/white, partial `#bfd8c9`, today `#d8b46a`, future `#f3eee2`/muted; legend (مكتمل / جزئي / فائت). Weekly bar chart card ("هذا الأسبوع", "+١٢٪ عن السابق") with 7 bars of varying height; highest bar gold.

### 9. Notifications & Reminders
- **Components:** iOS lock-screen mock (dark slate gradient, large time `7:00`, date). Two notification cards (translucent blur): a morning greeting and a streak-risk warning, each with the app icon, title "وِرْد", timestamp, body copy. Reminder settings card: two rows (أذكار الصباح ٧:٠٠ صباحاً / أذكار المساء ٦:٣٠ مساءً) each with an iOS-style toggle (on = gold `#d8b46a` track, white knob).

---

## Interactions & Behavior
- **Tasbih tap:** increment count; update ring `stroke-dashoffset = circumference * (1 - count/target)` with `transition: stroke-dashoffset .35s cubic-bezier(.3,.8,.4,1)`. On `count >= target`: set count = target, show celebration ring, lock taps, then after ~950ms advance to next dhikr (wrap around) and reset.
- **Next / Reset:** "next" advances dhikr & resets count; "reset" zeroes the current count.
- **List progress bars** reflect done/current/upcoming as the index advances.
- **Evening adhkar** are gated until after ʿAsr (show lock state until then).
- **Streak logic (to implement):** increment on a day where the day's wird is completed; show a warning notification when the day is ending and the wird is incomplete ("لا تكسرها").
- **Animations** (defined as keyframes in the prototype): `wd-ring` (completion pulse), `wd-pulse` (streak badge breathing), `wd-rise`/`wd-pop` (entrance). Keep durations ~0.9–2.4s, gentle easing.

## State Management
- `count` (current dhikr count), `dhikrIdx` (active index), `celebrate` (bool, gates taps during celebration).
- Per-day: completion status for morning & evening sets, streak count, longest streak, points/XP, level, earned badges, challenge progress.
- Persistence: store daily completion + streak + counters locally (e.g. AsyncStorage / UserDefaults / local DB) and re-read on launch so progress and the calendar survive restarts.
- Data fetching: adhkar content can ship bundled (static JSON); no network required for core flow.

## Assets
- **App logo / icon:** `assets/wird-logo.png` (2048px, rising-sun mark over a hill with the Amiri wordmark "وِرْد"). The full logo system, color variants, lockups, and small-size guidance are in `designs/شعار وِرْد.dc.html`.
- **Fonts:** IBM Plex Sans Arabic + Amiri (Google Fonts).
- **Icons:** Bottom-nav and small UI icons are simple geometric shapes drawn inline — replace with your icon set, keeping the minimal geometric style. No third-party icon assets are required.

## Files
- `designs/وِرْد.dc.html` — all app screens (identity strip, 3 home directions, tasbih, list, achievements, challenges, stats, notifications). The **logic class** at the bottom of this file holds the default adhkar list, the Eastern-Arabic numeral helper (`toAr`), the calendar generation, and the tasbih tap/advance logic — read it for exact behavior and data shape.
- `designs/شعار وِرْد.dc.html` — logo/brand system.
- `designs/support.js` — prototype runtime (reference only; do not port).
- `assets/wird-logo.png` — exported app icon.

> Tip for Claude Code: open the two HTML files in a browser side-by-side with this README,
> implement screen-by-screen, and lift exact hex/spacing values from the token tables above.
