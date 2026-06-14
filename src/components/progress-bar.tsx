import { View } from "react-native";
import { colors } from "@/theme/tokens";

/** Unified horizontal progress bar. */
export function ProgressBar({
  ratio,
  color = colors.gold500,
  track = colors.whiteAlpha14,
  height = 8,
}: {
  ratio: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  const r = height / 2;
  return (
    <View style={{ height, borderRadius: r, backgroundColor: track, overflow: "hidden" }}>
      <View
        style={{
          height,
          width: `${Math.min(100, Math.max(0, ratio * 100))}%`,
          backgroundColor: color,
          borderRadius: r,
        }}
      />
    </View>
  );
}
