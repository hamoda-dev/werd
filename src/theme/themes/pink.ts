/**
 * "Strawberry Milk" 🍓 — a cute, light, pink theme. Same token shape as the default
 * theme (only the values change), plus all the cute features turned ON. Read meaning
 * from the `semantic.*` layer; the legacy palette key names are kept on purpose.
 */
import type { Colors, Gradients, Radii, Semantic, Shadows, Theme } from "@/theme/types";

const colors: Colors = {
  // Pink "greens" — surfaces + deep accents (legacy key names, pink values)
  green900: "#ffe7ee",
  green800: "#fff1f4",
  green700: "#ffe4ee",
  sage: "#1fa98c",
  // Pink accent (legacy "gold")
  gold500: "#ff6f91",
  gold300: "#e35d8d",
  gold700: "#c23a72",
  // Rose (legacy "terracotta") — streak / warm
  terracotta500: "#ff7eb0",
  terracotta700: "#e0568f",
  // Whites / blush cards (legacy "cream")
  cream50: "#ffffff",
  cream100: "#fff1f4",
  cream200: "#fff6f8",
  creamText: "#6e3b4a",
  // Muted text and borders
  muted1: "#a8788a",
  muted2: "#c79bab",
  muted3: "#a86b80",
  borderWarm: "#ffd9e2",
  // Calendar cells and the locked-badge tile
  lockedTile: "#ffe1e8",
  partialCell: "#ffc8db",
  partialCellText: "#a03a63",
  futureCell: "#fff1f4",
  futureCellText: "#e0b8c6",
  missedCell: "#f3e3e8",
  missedCellText: "#cbb0ba",
  // Soft fills / hairlines over light backgrounds (legacy "whiteAlpha")
  whiteAlpha06: "#ffffff",
  whiteAlpha08: "#ffe1e8",
  whiteAlpha14: "#ffd9e2",
  goldAlpha25: "rgba(255,111,145,0.25)",
  // Cute extras
  mascotBody: "#ffffff",
  mascotFace: "#6e3b4a",
  mascotCheek: "#ffb3c4",
  blobPink: "#ffd1dc",
  blobPeach: "#ffe0c2",
  blobLilac: "#e7d0ff",
  heartEmpty: "#ffd9e2",
};

const radii: Radii = {
  // Pillowy / cute: rounder corners everywhere (was 10/12/14/14).
  tile: 16,
  card: 22,
  cardLg: 26,
  pill: 18,
};

const shadows: Shadows = {
  cardOnCream: "0 10px 24px -12px rgba(224,86,143,0.30)",
  darkElevated: "0 18px 36px -16px rgba(224,86,143,0.35)",
  terracotta: "0 16px 32px -16px rgba(255,111,145,0.55)",
  floatingButton: "0 12px 28px -12px rgba(224,86,143,0.45)",
  goldCard: "0 16px 32px -16px rgba(255,111,145,0.45)",
  sheet: "0 -12px 30px -16px rgba(224,86,143,0.25)",
};

const gradients: Gradients = {
  darkScreen: "linear-gradient(180deg, #fff1f4 0%, #ffe7ee 100%)",
  brandCard:  "linear-gradient(150deg, #ffe4ee, #ffd1e0)",
  gold:       "linear-gradient(150deg, #ff9bb6, #ff6f91)",
  sage:       "linear-gradient(150deg, #3fd0b4, #1fa98c)",
  terracotta: "linear-gradient(150deg, #ff9bb6, #ff6f91)",
  onboardingGlow:
    "radial-gradient(circle at 50% 18%, rgba(255,111,145,0.28) 0%, transparent 55%), linear-gradient(180deg, #fff1f4 0%, #ffe7ee 100%)",
  logoGlow: "radial-gradient(circle, rgba(255,111,145,0.30) 0%, transparent 62%)",
};

const semantic: Semantic = {
  // Surfaces — main (light)
  screen:        colors.green800,
  screenDeep:    colors.green900,
  surface:       colors.whiteAlpha06,
  surfaceStrong: colors.whiteAlpha08,
  surfaceFaint:  colors.whiteAlpha14,
  brandSurface:  colors.green700,
  // Surfaces — white / blush
  surfaceCream:    colors.cream50,
  surfaceCreamAlt: colors.cream200,
  screenCream:     colors.cream100,
  surfaceWhite:    "#fff",
  // Text (dark on light)
  textPrimary:      colors.creamText,
  textSecondary:    colors.muted3,
  textOnColor:      "#fff",
  textOnColorMuted: "rgba(255,255,255,0.85)",
  textOnCream:      colors.creamText,
  textMutedCream:   colors.muted1,
  textTertiary:     colors.muted2,
  textGhost:        "#a05572",
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
  tabBar:       "rgba(255,241,244,0.96)",
  inkChip:  "rgba(110,59,74,0.15)",
  inkTrack: "rgba(110,59,74,0.18)",
  // Cute extras
  mascotBody:  colors.mascotBody,
  mascotFace:  colors.mascotFace,
  mascotCheek: colors.mascotCheek,
  blobPink:    colors.blobPink,
  blobPeach:   colors.blobPeach,
  blobLilac:   colors.blobLilac,
  heartEmpty:  colors.heartEmpty,
};

export const pink: Theme = {
  id: "pink",
  label: "وِرْد بينك",
  colors,
  semantic,
  radii,
  shadows,
  gradients,
  features: {
    mascot: true,
    confetti: true,
    heartProgress: true,
    blobs: true,
    sprinkles: true,
    emojiAccents: true,
    tabPill: true,
  },
  statusBarStyle: "dark",
};
