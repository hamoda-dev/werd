import { useId } from "react";
import { View } from "react-native";
import Svg, { Defs, G, Line, LinearGradient, Path, Stop } from "react-native-svg";
import { Txt } from "@/components/txt";
import { useTheme } from "@/theme/context";

// A soft 4-point sparkle, centered at the origin in a ~12px box.
const SPARKLE = "M0,-6 C0.7,-2 2,-0.7 6,0 C2,0.7 0.7,2 0,6 C-0.7,2 -2,0.7 -6,0 C-2,-0.7 -0.7,-2 0,-6Z";

interface Props {
  /** Square edge in px. Corner radius and every inner element scale from this. */
  size?: number;
}

/**
 * The app logo: a sunrise above the «وِرْد» wordmark on an app-icon squircle. Every
 * color comes from the active theme's `logo` tokens, so each theme renders its own
 * logo (werd = gold sunrise on green; pink = peach sunrise on blush + sparkles).
 * Sparkles appear only for themes with `features.sprinkles`. Hand-drawn SVG, no raster
 * — see DESIGN.md §7 and components/icon.tsx.
 */
export function Logo({ size = 104 }: Props) {
  const { logo, gradients, shadows, features } = useTheme();
  // Unique gradient id per instance (two Logos can be on screen during the splash fade).
  const sunId = `logoSun-${useId().replace(/:/g, "")}`;

  const sunW = Math.round(size * 0.5);
  const sunH = Math.round(size * 0.333);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.224),
        borderCurve: "continuous",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        experimental_backgroundImage: logo.ground,
        boxShadow: shadows.darkElevated,
      }}
    >
      {/* Halo behind the sun */}
      <View
        style={{
          position: "absolute",
          width: size * 0.8,
          height: size * 0.8,
          top: size * 0.04,
          experimental_backgroundImage: gradients.logoGlow,
        }}
      />

      {/* Sparkles — decorated themes only */}
      {features.sprinkles && logo.spark ? (
        <Svg width={size} height={size} viewBox="0 0 104 104" style={{ position: "absolute" }}>
          <G fill={logo.spark}>
            <G transform="translate(21,30) scale(1.25)"><Path d={SPARKLE} /></G>
            <G transform="translate(84,38) scale(0.85)"><Path d={SPARKLE} /></G>
            <G transform="translate(82,78) scale(0.95)"><Path d={SPARKLE} /></G>
          </G>
        </Svg>
      ) : null}

      {/* Sunrise */}
      <Svg width={sunW} height={sunH} viewBox="0 0 66 44">
        <Defs>
          <LinearGradient id={sunId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={logo.sunFrom} />
            <Stop offset="1" stopColor={logo.sunTo} />
          </LinearGradient>
        </Defs>
        <G stroke={logo.rays} strokeWidth={3} strokeLinecap="round">
          <Line x1="33" y1="16" x2="33" y2="7" />
          <Line x1="39.7" y1="17.3" x2="43.1" y2="9.0" />
          <Line x1="45.5" y1="21.1" x2="51.8" y2="14.6" />
          <Line x1="49.4" y1="26.7" x2="57.7" y2="23.0" />
          <Line x1="26.3" y1="17.3" x2="22.9" y2="9.0" />
          <Line x1="20.5" y1="21.1" x2="14.2" y2="14.6" />
          <Line x1="16.6" y1="26.7" x2="8.3" y2="23.0" />
        </G>
        <Path d="M20 34 A13 13 0 0 1 46 34 Z" fill={`url(#${sunId})`} />
      </Svg>

      {/* Wordmark */}
      <Txt naskh weight="bold" size={Math.round(size * 0.36)} color={logo.wordmark} style={{ marginTop: size * 0.02 }}>
        وِرْد
      </Txt>
    </View>
  );
}
