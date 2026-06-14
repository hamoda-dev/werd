import type { ReactNode } from "react";
import { Pressable, type ViewStyle } from "react-native";
import { radii, semantic, spacing } from "@/theme/tokens";
import { Icon } from "@/components/icon";

interface Props {
  children: ReactNode;
  onPress: () => void;
  onLongPress?: () => void;
  /** Trailing element; defaults to a forward chevron. */
  accessory?: ReactNode;
  style?: ViewStyle;
}

/** Translucent rounded pressable row (awrad items, category lists). */
export function ListRow({ children, onPress, onLongPress, accessory, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.sm,
          backgroundColor: semantic.surface,
          borderRadius: radii.tile,
          borderCurve: "continuous",
          padding: spacing.lg,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {children}
      {accessory ?? <Icon name="chevron.forward" size={18} color={semantic.textTertiary} />}
    </Pressable>
  );
}
