import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { Mascot } from "@/components/mascot";
import { toArabicNumerals } from "@/utils/numerals";

/** A sprinkle of sparkle/heart emoji tucked into the hero corners. */
function Sprinkles() {
  const items: { e: string; size: number; top?: number; bottom?: number; left?: number; right?: number }[] = [
    { e: "✨", top: 10, right: 16, size: 15 },
    { e: "💕", top: 16, left: 18, size: 13 },
    { e: "⭐️", bottom: 12, right: 22, size: 12 },
    { e: "🩷", bottom: 14, left: 16, size: 13 },
  ];
  return (
    <>
      {items.map((it, i) => (
        <Txt
          key={i}
          size={it.size}
          style={{ position: "absolute", top: it.top, bottom: it.bottom, left: it.left, right: it.right }}
        >
          {it.e}
        </Txt>
      ))}
    </>
  );
}

/** Streak hero card (terracotta/strawberry). The mascot + sparkles are theme-gated. */
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
  const { semantic, gradients, radii, shadows, features } = useTheme();
  return (
    <Animated.View
      entering={animated ? FadeInDown.duration(400) : undefined}
      style={{
        position: "relative",
        backgroundColor: semantic.warm,
        experimental_backgroundImage: gradients.terracotta,
        borderRadius: radii.cardLg,
        borderCurve: "continuous",
        padding: spacing.xl,
        alignItems: "center",
        gap: 6,
        boxShadow: shadows.terracotta,
        overflow: "hidden",
      }}
    >
      {features.sprinkles ? <Sprinkles /> : null}
      {features.mascot ? <Mascot size={Math.round(size * 0.92)} /> : null}
      {features.mascot ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Txt size={size} weight="bold" color={semantic.textOnColor} align="center" style={{ fontVariant: ["tabular-nums"] }}>
            {toArabicNumerals(current)}
          </Txt>
          <Txt size={Math.round(size * 0.6)}>🔥</Txt>
        </View>
      ) : (
        <Txt size={size} weight="bold" color={semantic.textOnColor} align="center" style={{ fontVariant: ["tabular-nums"] }}>
          {toArabicNumerals(current)}
        </Txt>
      )}
      <Txt size={16} weight="semibold" color={semantic.textOnColor} align="center">{subtitle}</Txt>
      {longestText ? (
        <Txt size={12} color={semantic.textOnColorMuted} align="center">{longestText}</Txt>
      ) : null}
    </Animated.View>
  );
}
