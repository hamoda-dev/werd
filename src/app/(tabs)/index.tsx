import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { ProgressBar } from "@/components/progress-bar";
import { StreakHero } from "@/components/streak-hero";
import { LevelCard } from "@/components/level-card";
import { toArabicNumerals } from "@/utils/numerals";
import { getCategory } from "@/data/adhkar";
import { DAILY_CHALLENGES } from "@/data/challenges";
import { dailyDone } from "@/store/challenges";
import { isActiveDay } from "@/store/calendar";
import { last7DayKeys, todayKey, weekdayLetter } from "@/store/dates";
import {
  useCustomAwrad,
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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const streak = useStreak();
  const score = useScore();
  const today = useTodayProgress();
  const progress = useProgressMap();
  const { list: awrad } = useCustomAwrad();

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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.green800,
        experimental_backgroundImage: "linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: spacing.xxl,
          paddingHorizontal: spacing.xl,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View>
          <Txt size={14} color={colors.muted3}>{greeting()}</Txt>
          <Txt size={26} weight="bold" color={colors.creamText}>{settings.name} 👋</Txt>
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
                    backgroundColor: done ? colors.gold500 : colors.whiteAlpha08,
                    borderWidth: isToday ? 2 : 0,
                    borderColor: colors.gold300,
                  }}
                >
                  {done ? (
                    <Icon name="checkmark" size={15} color={colors.green800} />
                  ) : (
                    <Txt size={11} color={colors.muted3}>{weekdayLetter(key)}</Txt>
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
              backgroundColor: colors.cream50,
              borderRadius: radii.card,
              borderCurve: "continuous",
              padding: spacing.lg,
              gap: spacing.sm,
              borderWidth: 1.5,
              borderColor: colors.gold500,
            }}
          >
            <Icon name="sun.max.fill" size={30} color={colors.gold700} />
            <Txt size={16} weight="bold" color={colors.green800}>أذكار الصباح</Txt>
            <ProgressBar
              ratio={morning.total ? morning.done / morning.total : 0}
              color={colors.sage}
              track={colors.borderWarm}
            />
            <Txt size={12} color={colors.muted1}>
              {morning.isDone ? "اكتمل ✓" : `${toArabicNumerals(morning.done)} من ${toArabicNumerals(morning.total)}`}
            </Txt>
          </Pressable>

          <Pressable
            onPress={() => router.push("/session/evening")}
            style={{
              flex: 1,
              backgroundColor: colors.green700,
              borderRadius: radii.card,
              borderCurve: "continuous",
              padding: spacing.lg,
              gap: spacing.sm,
            }}
          >
            <Icon name="moon.fill" size={28} color={colors.gold300} />
            <Txt size={16} weight="bold" color={colors.creamText}>أذكار المساء</Txt>
            <ProgressBar ratio={evening.total ? evening.done / evening.total : 0} color={colors.gold500} />
            <Txt size={12} color={colors.muted3}>
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
              backgroundColor: colors.whiteAlpha06,
              borderRadius: radii.card,
              borderCurve: "continuous",
              padding: spacing.lg,
            }}
          >
            <Icon name={openDaily.icon} size={24} color={colors.gold300} />
            <View style={{ flex: 1 }}>
              <Txt size={12} color={colors.muted3}>تحدي اليوم</Txt>
              <Txt size={15} weight="bold" color={colors.creamText} numberOfLines={1}>{openDaily.title}</Txt>
            </View>
            <Txt size={14} weight="bold" color={colors.gold300}>+{toArabicNumerals(openDaily.reward)}</Txt>
          </Pressable>
        ) : null}

        {/* Level card */}
        <LevelCard score={score} />

        {/* My awrad */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.xs }}>
          <Txt size={18} weight="bold" color={colors.creamText}>أورادي</Txt>
          <Pressable
            onPress={() => router.push("/awrad/new")}
            hitSlop={10}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <Icon name="plus" size={16} color={colors.gold300} />
            <Txt size={13} weight="semibold" color={colors.gold300}>إضافة وِرد</Txt>
          </Pressable>
        </View>

        {awrad.length === 0 ? (
          <Pressable
            onPress={() => router.push("/awrad/new")}
            style={{
              borderWidth: 1,
              borderColor: colors.whiteAlpha14,
              borderStyle: "dashed",
              borderRadius: radii.card,
              borderCurve: "continuous",
              padding: spacing.xl,
              alignItems: "center",
              gap: 6,
            }}
          >
            <Txt size={14} color={colors.muted3} align="center">أضِف وِردك الخاص لتبدأ تسبيحه يومياً</Txt>
          </Pressable>
        ) : (
          <View style={{ gap: spacing.sm }}>
            {awrad.map((w) => (
              <Pressable
                key={w.id}
                onPress={() => router.push({ pathname: "/session/[category]", params: { category: w.id } })}
                onLongPress={() => router.push({ pathname: "/awrad/[id]", params: { id: w.id } })}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: colors.whiteAlpha06,
                  borderRadius: radii.tile,
                  borderCurve: "continuous",
                  padding: spacing.lg,
                }}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt size={15} weight="semibold" color={colors.creamText} numberOfLines={1}>{w.title}</Txt>
                  <Txt size={12} color={colors.muted3}>التكرار: {toArabicNumerals(w.count)}</Txt>
                </View>
                <Icon name="chevron.forward" size={18} color={colors.muted2} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
