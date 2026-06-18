/**
 * Invariant design tokens — the bits that DON'T change between themes (fonts, spacing,
 * type scale). Import these directly anywhere.
 *
 * Theme-varying tokens (colors, semantic, radii, shadows, gradients) live per-theme and
 * are read at runtime via `useTheme()` from "@/theme/context" — not from here.
 */

/** Font names as loaded in useFonts (see app/_layout.tsx). */
export const fonts = {
  sans: "IBMPlexSansArabic_400Regular",
  sansMedium: "IBMPlexSansArabic_500Medium",
  sansSemiBold: "IBMPlexSansArabic_600SemiBold",
  sansBold: "IBMPlexSansArabic_700Bold",
  naskh: "Amiri_400Regular",
  naskhBold: "Amiri_700Bold",
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
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
