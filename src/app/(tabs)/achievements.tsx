import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { toArabicNumerals } from "@/utils/numerals";
import {
  levelInfo,
  levelTitle,
  useProgressMap,
  useScore,
  useStreak,
} from "@/store/store";

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.whiteAlpha06,
        borderRadius: radii.tile,
        borderCurve: "continuous",
        paddingVertical: spacing.lg,
        alignItems: "center",
        gap: 4,
      }}
    >
      <Txt size={24} weight="bold" color={colors.gold300}>{value}</Txt>
      <Txt size={11} color={colors.muted3} align="center">{label}</Txt>
    </View>
  );
}

export default function Achievements() {
  const insets = useSafeAreaInsets();
  const streak = useStreak();
  const score = useScore();
  const progress = useProgressMap();
  const lvl = levelInfo(score);

  const days = Object.values(progress);
  const activeDays = days.filter((d) => d.morningDone || d.eveningDone).length;
  const totalAdhkar = days.reduce((s, d) => s + d.completedIds.length, 0);

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

        {/* بطل السلسلة */}
        <View
          style={{
            backgroundColor: colors.terracotta500,
            experimental_backgroundImage: "linear-gradient(150deg, #c8784e, #a85733)",
            borderRadius: radii.cardLg,
            borderCurve: "continuous",
            padding: spacing.xl,
            alignItems: "center",
            gap: 4,
            boxShadow: "0 16px 32px -16px rgba(168,87,51,0.6)",
          }}
        >
          <Txt size={72} weight="bold" color="#fff" style={{ fontVariant: ["tabular-nums"] }}>
            {toArabicNumerals(streak.current)}
          </Txt>
          <Txt size={16} weight="semibold" color="#fff">يوماً متتالياً 🔥</Txt>
          <Txt size={12} color="rgba(255,255,255,0.85)">
            أطول سلسلة: {toArabicNumerals(streak.longest)} يوماً
          </Txt>
        </View>

        {/* إحصائيات */}
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <StatChip value={toArabicNumerals(totalAdhkar)} label="مجموع الأذكار" />
          <StatChip value={toArabicNumerals(activeDays)} label="أيام نشطة" />
          <StatChip value={toArabicNumerals(score.points)} label="النقاط" />
        </View>

        {/* المستوى */}
        <View
          style={{
            backgroundColor: colors.whiteAlpha06,
            borderRadius: radii.card,
            borderCurve: "continuous",
            padding: spacing.lg,
            gap: spacing.sm,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Txt size={16} weight="bold">المستوى {toArabicNumerals(lvl.level)}</Txt>
            <Txt size={13} weight="semibold" color={colors.gold300}>{levelTitle(lvl.level)}</Txt>
          </View>
          <View style={{ height: 10, borderRadius: 5, backgroundColor: colors.whiteAlpha14, overflow: "hidden" }}>
            <View style={{ height: 10, width: `${lvl.ratio * 100}%`, backgroundColor: colors.gold500, borderRadius: 5 }} />
          </View>
          <Txt size={12} color={colors.muted3}>
            باقٍ {toArabicNumerals(lvl.toNext)} نقطة للمستوى التالي
          </Txt>
        </View>
      </ScrollView>
    </View>
  );
}
