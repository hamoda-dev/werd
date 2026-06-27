/**
 * "Werd" — the default theme. Dark green background + gold/terracotta accents.
 * Direction B (motivating and playful). This is the app's main identity; the cute
 * features are all OFF here.
 */
import type { Colors, Gradients, Radii, Semantic, Shadows, Theme } from "@/theme/types";

const colors: Colors = {
  // Green
  green900: "#0e2d22",
  green800: "#16352a",
  green700: "#1c4a3a",
  sage: "#3f8268",
  // Gold
  gold500: "#d8b46a",
  gold300: "#f4d68a",
  gold700: "#bf9648",
  // Terracotta (streak/warm)
  terracotta500: "#c8784e",
  terracotta700: "#a85733",
  // Cream
  cream50: "#fffdf7",
  cream100: "#faf7f0",
  cream200: "#f6efe2",
  creamText: "#f4ede0",
  // Muted text and borders
  muted1: "#6b7a72",
  muted2: "#8a9389",
  muted3: "#9fb3a8",
  borderWarm: "#e7e0d0",
  // Calendar cells and the locked-badge tile
  lockedTile: "#ece6d8",
  partialCell: "#bfd8c9",
  partialCellText: "#2a5444",
  futureCell: "#f3eee2",
  futureCellText: "#cdc6b5",
  missedCell: "#ece6d8",
  missedCellText: "#b3bcb4",
  // Transparencies over dark backgrounds
  whiteAlpha06: "rgba(255,255,255,0.06)",
  whiteAlpha08: "rgba(255,255,255,0.08)",
  whiteAlpha14: "rgba(255,255,255,0.14)",
  goldAlpha25: "rgba(216,180,106,0.25)",
  // Decorative extras — unused while the cute features are off, kept palette-coherent.
  mascotBody: "#fffdf7",
  mascotFace: "#16352a",
  mascotCheek: "#c8784e",
  blobPink: "#3f8268",
  blobPeach: "#d8b46a",
  blobLilac: "#1c4a3a",
  heartEmpty: "#e7e0d0",
};

const radii: Radii = {
  // Exploration: sharper corners (original was 18/24/28/30).
  tile: 10,
  card: 12,
  cardLg: 14,
  pill: 14,
};

const shadows: Shadows = {
  cardOnCream: "0 8px 20px -12px rgba(20,57,46,0.3)",
  darkElevated: "0 18px 36px -16px rgba(14,45,34,0.6)",
  terracotta: "0 16px 32px -16px rgba(168,87,51,0.6)",
  floatingButton: "0 12px 28px -12px rgba(0,0,0,0.5)",
  goldCard: "0 16px 32px -16px rgba(191,150,72,0.5)",
  sheet: "0 -12px 30px -16px rgba(14,45,34,0.5)",
};

const gradients: Gradients = {
  darkScreen: "linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
  brandCard:  "linear-gradient(150deg, #1c4a3a, #0e2d22)",
  gold:       "linear-gradient(150deg, #d8b46a, #bf9648)",
  sage:       "linear-gradient(150deg, #3f8268, #2c5e4a)",
  terracotta: "linear-gradient(150deg, #c8784e, #a85733)",
  onboardingGlow:
    "radial-gradient(circle at 50% 18%, rgba(216,180,106,0.28) 0%, transparent 55%), linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
  logoGlow: "radial-gradient(circle, rgba(216,180,106,0.30) 0%, transparent 62%)",
};

const logo: Theme["logo"] = {
  ground: gradients.brandCard, // deep green squircle, matches the original logo ground
  sunFrom: colors.gold500,
  sunTo: colors.gold700,
  rays: colors.gold500,
  wordmark: colors.creamText,
  spark: null,
};

const semantic: Semantic = {
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
  surfaceWhite:    "#fff",
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
  inkChip:  "rgba(14,45,34,0.15)",
  inkTrack: "rgba(14,45,34,0.18)",
  // Decorative extras.
  mascotBody:  colors.mascotBody,
  mascotFace:  colors.mascotFace,
  mascotCheek: colors.mascotCheek,
  blobPink:    colors.blobPink,
  blobPeach:   colors.blobPeach,
  blobLilac:   colors.blobLilac,
  heartEmpty:  colors.heartEmpty,
};

export const werd: Theme = {
  id: "werd",
  label: "وِرْد",
  colors,
  semantic,
  radii,
  shadows,
  gradients,
  logo,
  features: {
    mascot: false,
    confetti: false,
    heartProgress: false,
    blobs: false,
    sprinkles: false,
    emojiAccents: false,
    tabPill: false,
  },
  statusBarStyle: "light",
};
