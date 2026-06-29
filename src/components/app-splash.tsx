import { useEffect, useRef } from "react";
import { Animated, useWindowDimensions } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { Logo } from "@/components/logo";
import { Txt } from "@/components/txt";
import { useTheme } from "@/theme/context";
import { spacing } from "@/theme/tokens";

const SPARKLE = "M0,-6 C0.7,-2 2,-0.7 6,0 C2,0.7 0.7,2 0,6 C-0.7,2 -2,0.7 -6,0 C-2,-0.7 -0.7,-2 0,-6Z";

/**
 * Full-screen themed splash, shown over the app on cold start and faded out once load
 * finishes. It's the brand moment that reflects the active theme (the native OS splash
 * before it can't be themed): the logo settles in, holds, then the whole cover fades to
 * reveal the app. Themed from the active theme via ThemeProvider, so a pink user sees
 * the pink splash, a werd user the green one.
 */
export function AppSplash({ onFinish }: { onFinish: () => void }) {
  const { gradients, semantic, logo, features } = useTheme();
  const { width, height } = useWindowDimensions();
  // `enter` drives the logo settling in; `cover` fades the whole splash out at the end.
  const enter = useRef(new Animated.Value(0)).current;
  const cover = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(enter, { toValue: 1, duration: 440, useNativeDriver: true }),
      Animated.delay(800),
      Animated.timing(cover, { toValue: 0, duration: 480, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onFinish();
    });
  }, [enter, cover, onFinish]);

  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: cover,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: semantic.screen,
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

      <Animated.View style={{ opacity: enter, transform: [{ scale }], alignItems: "center", gap: spacing.lg }}>
        <Logo size={128} />
        <Txt naskh size={18} color={semantic.textSecondary}>
          وِرْدُكَ اليوميّ
        </Txt>
      </Animated.View>
    </Animated.View>
  );
}
