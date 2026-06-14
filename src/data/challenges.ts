import type { DailyChallengeDef } from "@/types";

/** Static daily challenges — evaluated against the day's progress. */
export const DAILY_CHALLENGES: DailyChallengeDef[] = [
  { id: "daily_morning", title: "أكمل أذكار الصباح", icon: "sun.max.fill", reward: 20 },
  { id: "daily_evening", title: "أكمل أذكار المساء", icon: "moon.fill", reward: 20 },
  { id: "daily_both", title: "الصباح والمساء معاً", icon: "checkmark.seal.fill", reward: 15 },
  { id: "daily_ward", title: "سبّح وِرداً خاصاً", icon: "star.fill", reward: 15 },
];

/** The featured weekly challenge. */
export const WEEKLY_CHALLENGE = {
  id: "weekly_no_miss" as const,
  title: "تحدي الأسبوع",
  subtitle: "لا تفوّت ذِكراً ٧ أيام",
  reward: 50,
};
