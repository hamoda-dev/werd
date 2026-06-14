import Animated, { FadeInDown } from "react-native-reanimated";
import { colors, radii, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { toArabicNumerals } from "@/utils/numerals";

/** Streak hero card (terracotta). Text is passed in so usage matches home and achievements. */
export function StreakHero({
  current,
  size = 52,
  animated = false,
  subtitle,
  longestText,
}: {
  current: number;
  size?: number;
  animated?: boolean;
  subtitle: string;
  longestText?: string | null;
}) {
  return (
    <Animated.View
      entering={animated ? FadeInDown.duration(400) : undefined}
      style={{
        backgroundColor: colors.terracotta500,
        experimental_backgroundImage: "linear-gradient(150deg, #c8784e, #a85733)",
        borderRadius: radii.cardLg,
        borderCurve: "continuous",
        padding: spacing.xl,
        alignItems: "center",
        gap: 6,
        boxShadow: "0 16px 32px -16px rgba(168,87,51,0.6)",
      }}
    >
      <Txt size={size} weight="bold" color="#fff" align="center" style={{ fontVariant: ["tabular-nums"] }}>
        {toArabicNumerals(current)}
      </Txt>
      <Txt size={16} weight="semibold" color="#fff" align="center">{subtitle}</Txt>
      {longestText ? (
        <Txt size={12} color="rgba(255,255,255,0.85)" align="center">{longestText}</Txt>
      ) : null}
    </Animated.View>
  );
}
