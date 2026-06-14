import type { ReactNode } from "react";
import { Pressable, type ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { gradients, radii, semantic, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";

export type ButtonVariant = "primary" | "ghost" | "link";

interface Props {
  children: ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: string;
  haptic?: boolean;
  disabled?: boolean;
  /** Extra tap area. Defaults to 10 for the padding-less `link` variant. */
  hitSlop?: number;
  style?: ViewStyle;
}

const FILL: Record<ButtonVariant, ViewStyle> = {
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

const TEXT_COLOR: Record<ButtonVariant, string> = {
  primary: semantic.textOnCream,
  ghost: semantic.textGhost,
  link: semantic.accentLight,
};

/** Unified button. Variants match the app's existing CTAs; text always renders through Txt. */
export function Button({ children, onPress, variant = "primary", icon, haptic = true, disabled = false, hitSlop, style }: Props) {
  function handlePress() {
    if (disabled) return;
    if (haptic && process.env.EXPO_OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  const color = TEXT_COLOR[variant];
  // `link` has no padding to absorb taps, so give it the same tap area the inline links had.
  const resolvedHitSlop = hitSlop ?? (variant === "link" ? 10 : undefined);

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={resolvedHitSlop}
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
