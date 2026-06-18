import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import { spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";

/** Unified translucent surface card with a soft (theme-tinted) shadow. */
export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const { radii, semantic, shadows } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: semantic.surface,
          borderRadius: radii.card,
          borderCurve: "continuous",
          padding: spacing.lg,
          gap: spacing.sm,
          boxShadow: shadows.cardOnCream,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
