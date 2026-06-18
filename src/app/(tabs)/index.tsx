import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { ProgressBar } from "@/components/progress-bar";
import { HeartProgress } from "@/components/heart-progress";
import { StreakHero } from "@/components/streak-hero";
import { LevelCard } from "@/components/level-card";
import { Screen } from "@/components/screen";
import { toArabicNumerals } from "@/utils/numerals";
import { getCategory } from "@/data/adhkar";
import { DAILY_CHALLENGES } from "@/data/challenges";
import { dailyDone } from "@/store/challenges";
import { isActiveDay } from "@/store/calendar";
import { last7DayKeys, todayKey, weekdayLetter } from "@/store/dates";
import {
  useProgressMap,
  useScore,
  useSettings,
  useStreak,
  useTodayProgress,
} from "@/store/store";
import type { CategoryId } from "@/types";

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "صباح الخير" : "مساء الخير";
}

export default function Home() {
  const { semantic, radii, shadows, features } = useTheme();
  const router = useRouter();
  const { settings } = useSettings();
  const streak = useStreak();
  const score = useScore();
  const today = useTodayProgress();
  const progress = useProgressMap();

  const week = last7DayKeys();
  const tKey = todayKey();
  const openDaily = DAILY_CHALLENGES.find((d) => !dailyDone(d.id, today));

  function catProgress(id: CategoryId) {
    const cat = getCategory(id)!;
    const done = cat.adhkar.filter((d) => today.completedIds.includes(d.id)).length;
    const isDone = id === "morning" ? today.morningDone : today.eveningDone;
    return { total: cat.adhkar.length, done, isDone };
  }

  const morning = catProgress("morning");
  const evening = catProgress("evening");
  const morningRatio = morning.total ? morning.done / morning.total : 0;
  const eveningRatio = evening.total ? evening.done / evening.total : 0;

  return (
    <Screen>
      {/* Greeting */}
      <View>
        <Txt size={14} color={semantic.textSecondary}>{greeting()}{features.emojiAccents ? " ✨" : ""}</Txt>
        <Txt size={26} weight="bold" color={semantic.textPrimary}>{settings.name} {features.emojiAccents ? "🎀" : "👋"}</Txt>
      </View>

      {/* Streak hero */}
      <StreakHero
        current={streak.current}
        size={52}
        animated
        subtitle={streak.current > 0 ? "أيام متتالية! 🎉" : "ابدأ سلسلتك اليوم 🔥"}
        longestText={streak.longest > 0 ? `أطول سلسلة: ${toArabicNumerals(streak.longest)} يوماً` : null}
      />

      {/* Week dots */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.xs }}>
        {week.map((key) => {
          const day = progress[key];
          const done = isActiveDay(day);
          const isToday = key === tKey;
          return (
            <View key={key} style={{ alignItems: "center", gap: 6 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: done ? semantic.accent : semantic.surfaceStrong,
                  borderWidth: isToday ? 2 : 0,
                  borderColor: semantic.accentLight,
                }}
              >
                {done ? (
                  <Icon name="checkmark" size={15} color={semantic.textOnCream} />
                ) : (
                  <Txt size={11} color={semantic.textSecondary}>{weekdayLetter(key)}</Txt>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Morning and evening cards */}
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <Pressable
          onPress={() => router.push("/session/morning")}
          style={{
            flex: 1,
            backgroundColor: semantic.surfaceCream,
            borderRadius: radii.card,
            borderCurve: "continuous",
            padding: spacing.lg,
            gap: spacing.sm,
            borderWidth: 1.5,
            borderColor: semantic.accent,
            boxShadow: shadows.cardOnCream,
          }}
        >
          <Icon name="sun.max.fill" size={30} color={semantic.accentDeep} />
          <Txt size={16} weight="bold" color={semantic.textOnCream}>أذكار الصباح</Txt>
          {features.heartProgress ? (
            <HeartProgress ratio={morningRatio} />
          ) : (
            <ProgressBar ratio={morningRatio} color={semantic.success} track={semantic.borderCream} />
          )}
          <Txt size={12} color={semantic.textMutedCream}>
            {morning.isDone ? "اكتمل ✓" : `${toArabicNumerals(morning.done)} من ${toArabicNumerals(morning.total)}`}
          </Txt>
        </Pressable>

        <Pressable
          onPress={() => router.push("/session/evening")}
          style={{
            flex: 1,
            backgroundColor: semantic.brandSurface,
            borderRadius: radii.card,
            borderCurve: "continuous",
            padding: spacing.lg,
            gap: spacing.sm,
            boxShadow: shadows.cardOnCream,
          }}
        >
          <Icon name="moon.fill" size={28} color={semantic.accentLight} />
          <Txt size={16} weight="bold" color={semantic.textPrimary}>أذكار المساء</Txt>
          {features.heartProgress ? (
            <HeartProgress ratio={eveningRatio} />
          ) : (
            <ProgressBar ratio={eveningRatio} color={semantic.accent} />
          )}
          <Txt size={12} color={semantic.textSecondary}>
            {evening.isDone ? "اكتمل ✓" : `${toArabicNumerals(evening.done)} من ${toArabicNumerals(evening.total)}`}
          </Txt>
        </Pressable>
      </View>

      {/* Daily challenge — only shown while there is an open daily challenge */}
      {openDaily ? (
        <Pressable
          onPress={() => router.push("/challenges")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            backgroundColor: semantic.surface,
            borderRadius: radii.card,
            borderCurve: "continuous",
            padding: spacing.lg,
          }}
        >
          <Icon name={openDaily.icon} size={24} color={semantic.accentLight} />
          <View style={{ flex: 1 }}>
            <Txt size={12} color={semantic.textSecondary}>تحدي اليوم</Txt>
            <Txt size={15} weight="bold" color={semantic.textPrimary} numberOfLines={1}>{openDaily.title}</Txt>
          </View>
          <Txt size={14} weight="bold" color={semantic.accentLight}>+{toArabicNumerals(openDaily.reward)}</Txt>
        </Pressable>
      ) : null}

      {/* Level card */}
      <LevelCard score={score} />
    </Screen>
  );
}
