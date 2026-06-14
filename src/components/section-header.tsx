import type { ReactNode } from "react";
import { View } from "react-native";
import { spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";

/** Section header: title on the leading edge, optional action (usually a link Button) trailing. */
export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: spacing.xs,
      }}
    >
      <Txt variant="heading">{title}</Txt>
      {action}
    </View>
  );
}
