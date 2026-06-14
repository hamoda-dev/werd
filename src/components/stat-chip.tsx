import { View } from "react-native";
import { colors, radii, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";

/** Small stat chip (value + label). */
export function StatChip({ value, label }: { value: string; label: string }) {
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
