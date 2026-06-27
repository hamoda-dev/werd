import { useEffect, useRef } from "react";
import { Animated, useWindowDimensions } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { Logo } from "@/components/logo";
import { Txt } from "@/components/txt";
import { useTheme } from "@/theme/context";
import { spacing } from "@/theme/tokens";

const SPARKLE = "M0,-6 C0.7,-2 2,-0.7 6,0 C2,0.7 0.7,2 0,6 C-0.7,2 -2,0.7 -6,0 C-2,-0.7 -0.7,-2 0,-6Z";

/**
 * Full-screen themed splash, shown over the app for one beat after fonts/data load,
 * then fades out. Themed from the active theme (the persisted themeId resolved by
 * ThemeProvider), so a pink user sees the pink splash. The OS native splash (app.json)
 * still flashes first and cannot be themed — this bridges into the themed app.
 */
export function AppSplash({ onFinish }: { onFinish: () => void }) {
  const { gradients, semantic, logo, features } = useTheme();
  const { width, height } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }).start(
        ({ finished }) => {
          if (finished) onFinish();
        },
      );
    }, 500);
    return () => clearTimeout(t);
  }, [opacity, onFinish]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity,
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.lg,
        experimental_backgroundImage: gradients.onboardingGlow,
      }}
    >
      {features.sprinkles && logo.spark ? (
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute" }}>
          <G fill={logo.spark}>
            <G transform={`translate(${width * 0.18}, ${height * 0.3}) scale(2)`}><Path d={SPARKLE} /></G>
            <G transform={`translate(${width * 0.82}, ${height * 0.4}) scale(1.5)`}><Path d={SPARKLE} /></G>
            <G transform={`translate(${width * 0.78}, ${height * 0.66}) scale(1.7)`}><Path d={SPARKLE} /></G>
            <G transform={`translate(${width * 0.22}, ${height * 0.68}) scale(1.3)`}><Path d={SPARKLE} /></G>
          </G>
        </Svg>
      ) : null}

      <Logo size={118} />
      <Txt naskh size={18} color={semantic.textSecondary}>
        وِرْدُكَ اليوميّ
      </Txt>
    </Animated.View>
  );
}
