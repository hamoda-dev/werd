/**
 * Design system for the Werd app — extracted from design_handoff_werd_app/.
 * Approved direction: B (motivating and playful) — dark green background.
 */

export const colors = {
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
} as const;

/** Font names as loaded in useFonts (see app/_layout.tsx). */
export const fonts = {
  sans: "IBMPlexSansArabic_400Regular",
  sansMedium: "IBMPlexSansArabic_500Medium",
  sansSemiBold: "IBMPlexSansArabic_600SemiBold",
  sansBold: "IBMPlexSansArabic_700Bold",
  naskh: "Amiri_400Regular",
  naskhBold: "Amiri_700Bold",
} as const;

export const radii = {
  // Exploration: sharper corners (original was 18/24/28/30).
  // Every rounded surface references these, so this block is the app-wide roundness knob.
  tile: 10,
  card: 12,
  cardLg: 14,
  pill: 14,
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

/** Shadows via boxShadow (Expo 55 style — not the old shadow/elevation props). */
export const shadows = {
  cardOnCream: "0 8px 20px -12px rgba(20,57,46,0.3)",
  darkElevated: "0 18px 36px -16px rgba(14,45,34,0.6)",
  terracotta: "0 16px 32px -16px rgba(168,87,51,0.6)",
  floatingButton: "0 12px 28px -12px rgba(0,0,0,0.5)",
  goldCard: "0 16px 32px -16px rgba(191,150,72,0.5)",
  sheet: "0 -12px 30px -16px rgba(14,45,34,0.5)",
} as const;

/** Background gradients as ready-to-use CSS strings (Expo 55 `experimental_backgroundImage`). */
export const gradients = {
  darkScreen: "linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
  brandCard:  "linear-gradient(150deg, #1c4a3a, #0e2d22)",
  gold:       "linear-gradient(150deg, #d8b46a, #bf9648)",
  sage:       "linear-gradient(150deg, #3f8268, #2c5e4a)",
  terracotta: "linear-gradient(150deg, #c8784e, #a85733)",
  onboardingGlow:
    "radial-gradient(circle at 50% 18%, rgba(216,180,106,0.28) 0%, transparent 55%), linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
  logoGlow: "radial-gradient(circle, rgba(216,180,106,0.30) 0%, transparent 62%)",
} as const;

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

/** Semantic (role-based) color aliases. Additive — references the palette above. */
export const semantic = {
  // Surfaces — dark
  screen:        colors.green800,
  screenDeep:    colors.green900,
  surface:       colors.whiteAlpha06,
  surfaceStrong: colors.whiteAlpha08,
  surfaceFaint:  colors.whiteAlpha14, // subtle fill/track — same value as `border` by design
  brandSurface:  colors.green700,
  // Surfaces — cream / light
  surfaceCream:    colors.cream50,
  surfaceCreamAlt: colors.cream200,
  screenCream:     colors.cream100,
  surfaceWhite:    "#fff", // pure-white input surface (distinct from cream)
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
  border:       colors.whiteAlpha14, // hairline stroke — same value as `surfaceFaint` by design
  borderCream:  colors.borderWarm,
  goldHairline: colors.goldAlpha25,
  tabBar:       "rgba(14,45,34,0.96)", // green900 + 0.96 alpha for the blur-under tab bar
  // On the gold featured card (challenges)
  inkChip:  "rgba(14,45,34,0.15)", // translucent dark chip over gold
  inkTrack: "rgba(14,45,34,0.18)", // translucent dark progress track over gold
} as const;
