import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "@/theme/context";

const HEART = "M12 21 C12 21 3 14.6 3 8.8 C3 5.6 5.4 3.5 8 3.5 C9.9 3.5 11.3 4.6 12 5.9 C12.7 4.6 14.1 3.5 16 3.5 C18.6 3.5 21 5.6 21 8.8 C21 14.6 12 21 12 21 Z";

/** A row of little hearts that fill by ratio — the cute stand-in for a progress bar. */
export function HeartProgress({
  ratio,
  count = 5,
  size = 16,
  color,
  empty,
}: {
  ratio: number;
  count?: number;
  size?: number;
  color?: string;
  empty?: string;
}) {
  const { semantic } = useTheme();
  const fillColor = color ?? semantic.accent;
  const emptyColor = empty ?? semantic.heartEmpty;
  const filled = Math.round(Math.min(1, Math.max(0, ratio)) * count);
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {Array.from({ length: count }, (_, i) => (
        <Svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <Path d={HEART} fill={i < filled ? fillColor : emptyColor} />
        </Svg>
      ))}
    </View>
  );
}
