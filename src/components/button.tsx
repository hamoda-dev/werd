import type { ReactNode } from "react";
import { Pressable, type ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { gradients, radii, semantic, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";

type Variant = "primary" | "ghost" | "link";

interface Props {
  children: ReactNode;
  onPress: () => void;
  variant?: Variant;
  icon?: string;
  haptic?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const FILL: Record<Variant, ViewStyle> = {
  primary: {
    experimental_backgroundImage: gradients.gold,
    backgroundColor: semantic.accent,
    borderRadius: radii.pill,
    borderCurve: "continuous",
    paddingVertical: 16,
    paddingHorizontal: spacing.xl,
  },
  ghost: {
    backgroundColor: semantic.surfaceStrong,
    borderRadius: radii.pill,
    borderCurve: "continuous",
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
  },
  link: {},
};

const TEXT_COLOR: Record<Variant, string> = {
  primary: semantic.textOnCream,
  ghost: semantic.textGhost,
  link: semantic.accentLight,
};

/** Unified button. Variants match the app's existing CTAs; text always renders through Txt. */
export function Button({ children, onPress, variant = "primary", icon, haptic = true, disabled = false, style }: Props) {
  function handlePress() {
    if (disabled) return;
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  const color = TEXT_COLOR[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        FILL[variant],
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={18} color={color} /> : null}
      <Txt variant="label" weight={variant === "link" ? "semibold" : "bold"} color={color}>
        {children}
      </Txt>
    </Pressable>
  );
}
