import Svg, { Ellipse, Path, Circle, G } from "react-native-svg";
import { useTheme } from "@/theme/context";

/**
 * "Milky" — a little blob mascot with rosy cheeks. Pure SVG so it's crisp on
 * both platforms and recolors from tokens (no third-party art; see DESIGN.md).
 * Drawn on a 100×100 grid.
 */
export function Mascot({ size = 56, sleeping = false }: { size?: number; sleeping?: boolean }) {
  const { semantic } = useTheme();
  const body = semantic.mascotBody;
  const face = semantic.mascotFace;
  const cheek = semantic.mascotCheek;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* little hair curl */}
      <Path d="M50 12 C50 6 56 4 58 9 C59 12 56 15 53 16" fill={body} />
      {/* soft round body */}
      <Ellipse cx={50} cy={56} rx={37} ry={34} fill={body} />
      {/* blush cheeks */}
      <Circle cx={31} cy={62} r={7} fill={cheek} />
      <Circle cx={69} cy={62} r={7} fill={cheek} />
      {sleeping ? (
        /* closed happy eyes */
        <G fill="none" stroke={face} strokeWidth={3.2} strokeLinecap="round">
          <Path d="M33 50 q5 5 10 0" />
          <Path d="M57 50 q5 5 10 0" />
        </G>
      ) : (
        <G fill={face}>
          <Ellipse cx={38} cy={50} rx={4} ry={5.5} />
          <Ellipse cx={62} cy={50} rx={4} ry={5.5} />
          {/* eye sparkles */}
          <Circle cx={39.5} cy={48} r={1.4} fill={body} />
          <Circle cx={63.5} cy={48} r={1.4} fill={body} />
        </G>
      )}
      {/* smile */}
      <Path d="M44 62 q6 6 12 0" fill="none" stroke={face} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}
