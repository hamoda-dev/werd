import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { StatChip } from "@/components/stat-chip";
import { StreakHero } from "@/components/streak-hero";
import { LevelCard } from "@/components/level-card";
import { BadgeTile } from "@/components/badge-tile";
import { toArabicNumerals } from "@/utils/numerals";
import { aggregateStats } from "@/store/badges";
import { BADGES } from "@/data/badges";
import { useBadges, useProgressMap, useScore, useStreak } from "@/store/store";

function NavRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
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
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
        <Icon name={icon} size={20} color={colors.gold300} />
        <Txt size={15} weight="semibold" color={colors.creamText}>{label}</Txt>
      </View>
      <Icon name="chevron.forward" size={18} color={colors.muted2} />
    </Pressable>
  );
}

export default function Achievements() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const streak = useStreak();
  const score = useScore();
  const progress = useProgressMap();
  const badges = useBadges();
  const { activeDays, totalAdhkar } = aggregateStats(progress);

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
        <Txt size={22} weight="bold">إنجازاتي</Txt>

        <StreakHero
          current={streak.current}
          size={72}
          subtitle="يوماً متتالياً 🔥"
          longestText={`أطول سلسلة: ${toArabicNumerals(streak.longest)} يوماً`}
        />

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <StatChip value={toArabicNumerals(totalAdhkar)} label="إجمالي الأذكار" />
          <StatChip value={toArabicNumerals(activeDays)} label="يوم نشِط" />
          <StatChip value={toArabicNumerals(badges.size)} label="شارة" />
        </View>

        <LevelCard score={score} showToNext />

        <View style={{ gap: spacing.sm }}>
          <NavRow icon="flame.fill" label="التحديات" onPress={() => router.push("/challenges")} />
          <NavRow icon="checkmark.seal.fill" label="الإحصائيات والتقويم" onPress={() => router.push("/stats")} />
        </View>

        <Txt size={18} weight="bold" style={{ marginTop: spacing.xs }}>الشارات</Txt>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {BADGES.map((def) => (
            <BadgeTile key={def.id} def={def} unlocked={badges.has(def.id)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
