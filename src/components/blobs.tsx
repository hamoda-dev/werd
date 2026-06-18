import { View } from "react-native";
import { useTheme } from "@/theme/context";

/**
 * Dreamy background blobs — soft pastel circles drifting behind screen content.
 * Decorative only: absolutely positioned, low opacity, never intercepts touches.
 */
export function Blobs() {
  const { semantic } = useTheme();
  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
      <Blob color={semantic.blobPink} size={240} top={-70} right={-60} opacity={0.5} />
      <Blob color={semantic.blobPeach} size={200} top={180} left={-80} opacity={0.45} />
      <Blob color={semantic.blobLilac} size={170} bottom={120} right={-50} opacity={0.4} />
      <Blob color={semantic.blobPink} size={150} bottom={-50} left={20} opacity={0.4} />
    </View>
  );
}

function Blob({
  color,
  size,
  opacity,
  top,
  bottom,
  left,
  right,
}: {
  color: string;
  size: number;
  opacity: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}) {
  return (
    <View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        top,
        bottom,
        left,
        right,
      }}
    />
  );
}
