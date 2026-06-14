import type { BadgeDef } from "@/types";

/** Static badge catalog. Unlock conditions live in store/badges.ts (deriveBadges). */
export const BADGES: BadgeDef[] = [
  { id: "first_morning", label: "أول صباح", icon: "sun.max.fill", gradient: "gold" },
  { id: "first_evening", label: "أول مساء", icon: "moon.fill", gradient: "sage" },
  { id: "streak_3", label: "٣ أيام", icon: "flame.fill", gradient: "terracotta" },
  { id: "streak_7", label: "أسبوع كامل", icon: "flame.fill", gradient: "terracotta" },
  { id: "streak_30", label: "شهر مواظبة", icon: "flame.fill", gradient: "terracotta" },
  { id: "active_30", label: "٣٠ يوماً نشطاً", icon: "checkmark.seal.fill", gradient: "sage" },
  { id: "adhkar_100", label: "١٠٠ ذِكر", icon: "star.fill", gradient: "gold" },
  { id: "adhkar_500", label: "٥٠٠ ذِكر", icon: "star.fill", gradient: "gold" },
  { id: "level_3", label: "ذاكِر", icon: "checkmark.seal.fill", gradient: "gold" },
];
