import { View } from "react-native";
import { Txt } from "@/components/txt";
import type { Theme } from "@/theme/types";

/**
 * A small "home glance" thumbnail that represents a theme using its OWN tokens
 * (gradient surface, streak card, progress bar, button, and corner radius — so the
 * sharper «وِرْد» vs rounder «وِرْد بينك» difference shows). Used by the theme pickers
 * in Profile and onboarding. It renders another theme's look, so it reads `theme`
 * directly rather than the active `useTheme()`.
 */
export function ThemePreview({ theme }: { theme: Theme }) {
  const s = theme.semantic;
  const g = theme.gradients;
  return (
    <View
      style={{
        width: 64,
        height: 104,
        borderRadius: theme.radii.card,
        borderCurve: "continuous",
        padding: 7,
        gap: 5,
        overflow: "hidden",
        backgroundColor: s.screen,
        experimental_backgroundImage: g.darkScreen,
      }}
    >
      {/* Streak card (warm gradient) */}
      <View
        style={{
          height: 30,
          borderRadius: theme.radii.tile,
          borderCurve: "continuous",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: s.warm,
          experimental_backgroundImage: g.terracotta,
        }}
      >
        <Txt size={13} weight="bold" color={s.textOnColor}>٧</Txt>
      </View>

      {/* Progress bar */}
      <View style={{ height: 5, borderRadius: 3, backgroundColor: s.surfaceFaint, overflow: "hidden" }}>
        <View style={{ height: "100%", width: "58%", borderRadius: 3, backgroundColor: s.accent }} />
      </View>

      {/* Skeleton text lines */}
      <View style={{ height: 5, borderRadius: 3, backgroundColor: s.surfaceFaint }} />
      <View style={{ height: 5, borderRadius: 3, width: "70%", backgroundColor: s.surfaceFaint }} />

      {/* Primary button */}
      <View
        style={{
          marginTop: "auto",
          height: 13,
          borderRadius: 6,
          backgroundColor: s.accent,
          experimental_backgroundImage: g.gold,
        }}
      />
    </View>
  );
}
