import Animated, { FadeInDown } from "react-native-reanimated";
import { gradients, radii, semantic, shadows, spacing } from "@/theme/tokens";
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
        backgroundColor: semantic.warm,
        experimental_backgroundImage: gradients.terracotta,
        borderRadius: radii.cardLg,
        borderCurve: "continuous",
        padding: spacing.xl,
        alignItems: "center",
        gap: 6,
        boxShadow: shadows.terracotta,
      }}
    >
      <Txt size={size} weight="bold" color={semantic.textOnColor} align="center" style={{ fontVariant: ["tabular-nums"] }}>
        {toArabicNumerals(current)}
      </Txt>
      <Txt size={16} weight="semibold" color={semantic.textOnColor} align="center">{subtitle}</Txt>
      {longestText ? (
        <Txt size={12} color={semantic.textOnColorMuted} align="center">{longestText}</Txt>
      ) : null}
    </Animated.View>
  );
}
