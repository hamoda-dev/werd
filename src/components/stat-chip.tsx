import { View } from "react-native";
import { spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";

/** Small stat chip (value + label). */
export function StatChip({ value, label }: { value: string; label: string }) {
  const { semantic, radii } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: semantic.surface,
        borderRadius: radii.tile,
        borderCurve: "continuous",
        paddingVertical: spacing.lg,
        alignItems: "center",
        gap: 4,
      }}
    >
      <Txt size={24} weight="bold" color={semantic.accentLight}>{value}</Txt>
      <Txt size={11} color={semantic.textSecondary} align="center">{label}</Txt>
    </View>
  );
}
