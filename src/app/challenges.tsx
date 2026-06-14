import { useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { gradients, radii, semantic, shadows, spacing } from "@/theme/tokens";
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
        backgroundColor: semantic.screen,
        experimental_backgroundImage: gradients.darkScreen,
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
          <Icon name="chevron.backward" size={24} color={semantic.textPrimary} />
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
            backgroundColor: semantic.accentDeep,
            experimental_backgroundImage: gradients.gold,
            borderRadius: radii.cardLg,
            borderCurve: "continuous",
            padding: spacing.xl,
            gap: spacing.sm,
            boxShadow: shadows.goldCard,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Txt size={16} weight="bold" color={semantic.textOnCream}>{WEEKLY_CHALLENGE.title}</Txt>
            <View
              style={{
                backgroundColor: semantic.inkChip,
                borderRadius: radii.pill,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <Txt size={12} weight="bold" color={semantic.textOnCream}>
                +{toArabicNumerals(WEEKLY_CHALLENGE.reward)} نقطة
              </Txt>
            </View>
          </View>
          <Txt size={14} color={semantic.textOnCream}>{WEEKLY_CHALLENGE.subtitle}</Txt>
          <ProgressBar ratio={wDone / WEEKLY_TARGET} color={semantic.textOnCream} track={semantic.inkTrack} />
          <Txt size={12} weight="semibold" color={semantic.textOnCream}>
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
                  backgroundColor: semantic.surface,
                  borderRadius: radii.tile,
                  borderCurve: "continuous",
                  padding: spacing.lg,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 }}>
                  <Icon name={def.icon} size={22} color={done ? semantic.success : semantic.accentLight} />
                  <Txt size={15} weight="semibold" color={semantic.textPrimary} numberOfLines={1}>
                    {def.title}
                  </Txt>
                </View>
                {done ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Icon name="checkmark" size={16} color={semantic.success} />
                    <Txt size={13} weight="semibold" color={semantic.success}>تمّ</Txt>
                  </View>
                ) : (
                  <Txt size={14} weight="bold" color={semantic.accentLight}>+{toArabicNumerals(def.reward)}</Txt>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
