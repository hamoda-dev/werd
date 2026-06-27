/**
 * Theme system types. Each theme provides the same token shape (so components read
 * `useTheme().semantic.accent` regardless of theme) plus a small set of feature flags
 * that toggle theme-specific decorations (mascot, confetti, hearts, blobs, …).
 *
 * Invariant tokens that never change between themes (fonts, spacing, type scale) stay
 * as static exports in `tokens.ts` — they are intentionally NOT part of a Theme.
 */

/** Add a new id here when you register a new theme in `registry.ts`. */
export type ThemeId = "werd" | "pink";

/** Raw palette. Legacy key names (green / gold / cream …) are kept across themes on
 *  purpose so a recolor stays a one-file change — read meaning from `Semantic`. */
export interface Colors {
  green900: string;
  green800: string;
  green700: string;
  sage: string;
  gold500: string;
  gold300: string;
  gold700: string;
  terracotta500: string;
  terracotta700: string;
  cream50: string;
  cream100: string;
  cream200: string;
  creamText: string;
  muted1: string;
  muted2: string;
  muted3: string;
  borderWarm: string;
  lockedTile: string;
  partialCell: string;
  partialCellText: string;
  futureCell: string;
  futureCellText: string;
  missedCell: string;
  missedCellText: string;
  whiteAlpha06: string;
  whiteAlpha08: string;
  whiteAlpha14: string;
  goldAlpha25: string;
  // Decorative extras (used only by themes that enable the cute features).
  mascotBody: string;
  mascotFace: string;
  mascotCheek: string;
  blobPink: string;
  blobPeach: string;
  blobLilac: string;
  heartEmpty: string;
}

/** Role-based color aliases — what components actually consume. */
export interface Semantic {
  screen: string;
  screenDeep: string;
  surface: string;
  surfaceStrong: string;
  surfaceFaint: string;
  brandSurface: string;
  surfaceCream: string;
  surfaceCreamAlt: string;
  screenCream: string;
  surfaceWhite: string;
  textPrimary: string;
  textSecondary: string;
  textOnColor: string;
  textOnColorMuted: string;
  textOnCream: string;
  textMutedCream: string;
  textTertiary: string;
  textGhost: string;
  accent: string;
  accentLight: string;
  accentDeep: string;
  success: string;
  warm: string;
  warmDeep: string;
  border: string;
  borderCream: string;
  goldHairline: string;
  tabBar: string;
  inkChip: string;
  inkTrack: string;
  // Decorative extras.
  mascotBody: string;
  mascotFace: string;
  mascotCheek: string;
  blobPink: string;
  blobPeach: string;
  blobLilac: string;
  heartEmpty: string;
}

export interface Radii {
  tile: number;
  card: number;
  cardLg: number;
  pill: number;
}

export interface Shadows {
  cardOnCream: string;
  darkElevated: string;
  terracotta: string;
  floatingButton: string;
  goldCard: string;
  sheet: string;
}

export interface Gradients {
  darkScreen: string;
  brandCard: string;
  gold: string;
  sage: string;
  terracotta: string;
  onboardingGlow: string;
  logoGlow: string;
}

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

/** Theme-specific decorations. Off by default; the pink theme turns them all on. */
export interface ThemeFeatures {
  /** Blob mascot on the streak hero. */
  mascot: boolean;
  /** Sparkle burst when a tasbih completes. */
  confetti: boolean;
  /** Heart row instead of a bar for the home progress. */
  heartProgress: boolean;
  /** Dreamy pastel background blobs behind screen content. */
  blobs: boolean;
  /** Sparkle/heart emoji tucked into the streak hero corners. */
  sprinkles: boolean;
  /** Emoji in the home greeting / name. */
  emojiAccents: boolean;
  /** Gradient pill behind the active tab icon. */
  tabPill: boolean;
}

export interface Theme {
  id: ThemeId;
  /** Display name shown in the theme picker. */
  label: string;
  colors: Colors;
  semantic: Semantic;
  radii: Radii;
  shadows: Shadows;
  gradients: Gradients;
  logo: LogoTokens;
  features: ThemeFeatures;
  /** Native status-bar icon style appropriate for this theme's background. */
  statusBarStyle: "light" | "dark";
}
