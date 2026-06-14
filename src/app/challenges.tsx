import { useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { ProgressBar } from "@/components/progress-bar";
import { toArabicNumerals } from "@/utils/numerals";
import { DAILY_CHALLENGES, WEEKLY_CHALLENGE } from "@/data/challenges";
import { WEEKLY_TARGET, dailyDone, weeklyProgress } from "@/store/challenges";
import { startOfWeekKey, todayKey } from "@/store/dates";
import {
  syncChallengeClaims,
  useChallenges,
  useProgressMap,
  useTodayProgress,
} from "@/store/store";

export default function Challenges() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const progress = useProgressMap();
  const today = useTodayProgress();
  useChallenges(); // Subscribe so we re-render when rewards are claimed

  // Auto-claim completed rewards — in an effect, not during render (D4).
  useEffect(() => {
    syncChallengeClaims();
  }, [progress]);

  const weekStart = startOfWeekKey(todayKey());
  const wDone = weeklyProgress(progress, weekStart);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.green800,
        experimental_backgroundImage: "linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
        paddingTop: insets.top + spacing.sm,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.xl,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={{ width: 38, height: 38, alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="chevron.backward" size={24} color={colors.creamText} />
        </Pressable>
        <Txt size={17} weight="bold" align="center">التحديات</Txt>
        <View style={{ width: 38, height: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + spacing.xxl,
          paddingHorizontal: spacing.xl,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured weekly challenge */}
        <View
          style={{
            backgroundColor: colors.gold700,
            experimental_backgroundImage: "linear-gradient(150deg, #d8b46a, #bf9648)",
            borderRadius: radii.cardLg,
            borderCurve: "continuous",
            padding: spacing.xl,
            gap: spacing.sm,
            boxShadow: "0 16px 32px -16px rgba(191,150,72,0.5)",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Txt size={16} weight="bold" color={colors.green800}>{WEEKLY_CHALLENGE.title}</Txt>
            <View
              style={{
                backgroundColor: "rgba(14,45,34,0.15)",
                borderRadius: radii.pill,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <Txt size={12} weight="bold" color={colors.green800}>
                +{toArabicNumerals(WEEKLY_CHALLENGE.reward)} نقطة
              </Txt>
            </View>
          </View>
          <Txt size={14} color={colors.green800}>{WEEKLY_CHALLENGE.subtitle}</Txt>
          <ProgressBar ratio={wDone / WEEKLY_TARGET} color={colors.green800} track="rgba(14,45,34,0.18)" />
          <Txt size={12} weight="semibold" color={colors.green800}>
            {toArabicNumerals(wDone)}/{toArabicNumerals(WEEKLY_TARGET)}
            {wDone >= WEEKLY_TARGET ? " · اكتمل ✓" : ""}
          </Txt>
        </View>

        {/* Daily challenges */}
        <Txt size={18} weight="bold">تحدّيات اليوم</Txt>
        <View style={{ gap: spacing.sm }}>
          {DAILY_CHALLENGES.map((def) => {
            const done = dailyDone(def.id, today);
            return (
              <View
                key={def.id}
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
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 }}>
                  <Icon name={def.icon} size={22} color={done ? colors.sage : colors.gold300} />
                  <Txt size={15} weight="semibold" color={colors.creamText} numberOfLines={1}>
                    {def.title}
                  </Txt>
                </View>
                {done ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Icon name="checkmark" size={16} color={colors.sage} />
                    <Txt size={13} weight="semibold" color={colors.sage}>تمّ</Txt>
                  </View>
                ) : (
                  <Txt size={14} weight="bold" color={colors.gold300}>+{toArabicNumerals(def.reward)}</Txt>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
