import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import { colors, radii, spacing } from "@/theme/tokens";

/** Unified translucent dark-surface card (whiteAlpha06). */
export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.whiteAlpha06,
          borderRadius: radii.card,
          borderCurve: "continuous",
          padding: spacing.lg,
          gap: spacing.sm,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
