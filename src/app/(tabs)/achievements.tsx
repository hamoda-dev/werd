import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { radii, semantic, spacing } from "@/theme/tokens";
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
import { Screen } from "@/components/screen";

function NavRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
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
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
        <Icon name={icon} size={20} color={semantic.accentLight} />
        <Txt size={15} weight="semibold" color={semantic.textPrimary}>{label}</Txt>
      </View>
      <Icon name="chevron.forward" size={18} color={semantic.textTertiary} />
    </Pressable>
  );
}

export default function Achievements() {
  const router = useRouter();
  const streak = useStreak();
  const score = useScore();
  const progress = useProgressMap();
  const badges = useBadges();
  const { activeDays, totalAdhkar } = aggregateStats(progress);

  return (
    <Screen>
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
    </Screen>
  );
}
