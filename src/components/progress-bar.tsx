import { View } from "react-native";
import { useTheme } from "@/theme/context";

/** Unified horizontal progress bar. */
export function ProgressBar({
  ratio,
  color,
  track,
  height = 8,
}: {
  ratio: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  const { semantic } = useTheme();
  const fillColor = color ?? semantic.accent;
  const trackColor = track ?? semantic.surfaceFaint;
  const r = height / 2;
  return (
    <View style={{ height, borderRadius: r, backgroundColor: trackColor, overflow: "hidden" }}>
      <View
        style={{
          height,
          width: `${Math.min(100, Math.max(0, ratio * 100))}%`,
          backgroundColor: fillColor,
          borderRadius: r,
        }}
      />
    </View>
  );
}
