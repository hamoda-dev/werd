import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import { spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";

/** Section header: title on the leading edge, optional action (usually a link Button) trailing. */
export function SectionHeader({ title, action, style }: { title: string; action?: ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: spacing.xs,
        },
        style,
      ]}
    >
      <Txt variant="heading">{title}</Txt>
      {action}
    </View>
  );
}
