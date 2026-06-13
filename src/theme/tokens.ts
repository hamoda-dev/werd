/**
 * نظام التصميم لتطبيق وِرْد — مُستخرَج من design_handoff_werd_app/.
 * الاتجاه المعتمد: ب (تحفيزي ومرِح) — خلفية خضراء داكنة.
 */

export const colors = {
  // الأخضر
  green900: "#0e2d22",
  green800: "#16352a",
  green700: "#1c4a3a",
  sage: "#3f8268",
  // الذهبي
  gold500: "#d8b46a",
  gold300: "#f4d68a",
  gold700: "#bf9648",
  // الطيني (السلسلة/الدافئ)
  terracotta500: "#c8784e",
  terracotta700: "#a85733",
  // الكريمي
  cream50: "#fffdf7",
  cream100: "#faf7f0",
  cream200: "#f6efe2",
  creamText: "#f4ede0",
  // نصوص خافتة وحدود
  muted1: "#6b7a72",
  muted2: "#8a9389",
  muted3: "#9fb3a8",
  borderWarm: "#e7e0d0",
  // شفافيات على الداكن
  whiteAlpha06: "rgba(255,255,255,0.06)",
  whiteAlpha08: "rgba(255,255,255,0.08)",
  whiteAlpha14: "rgba(255,255,255,0.14)",
  goldAlpha25: "rgba(216,180,106,0.25)",
} as const;

/** أسماء الخطوط كما تُحمّل في useFonts (انظر app/_layout.tsx). */
export const fonts = {
  sans: "IBMPlexSansArabic_400Regular",
  sansMedium: "IBMPlexSansArabic_500Medium",
  sansSemiBold: "IBMPlexSansArabic_600SemiBold",
  sansBold: "IBMPlexSansArabic_700Bold",
  naskh: "Amiri_400Regular",
  naskhBold: "Amiri_700Bold",
} as const;

export const radii = {
  tile: 18,
  card: 24,
  cardLg: 28,
  pill: 30,
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

/** ظلال عبر boxShadow (نمط Expo 55 — لا shadow/elevation القديمة). */
export const shadows = {
  cardOnCream: "0 8px 20px -12px rgba(20,57,46,0.3)",
  darkElevated: "0 18px 36px -16px rgba(14,45,34,0.6)",
  terracotta: "0 16px 32px -16px rgba(168,87,51,0.6)",
} as const;

/** تدرّجات الخلفية (للاستخدام مع expo-linear-gradient أو طبقات View). */
export const gradients = {
  darkScreen: ["#16352a", "#0e2d22"] as const,
  brandCard: ["#1c4a3a", "#0e2d22"] as const,
  streak: ["#c8784e", "#a85733"] as const,
  gold: ["#d8b46a", "#bf9648"] as const,
};
