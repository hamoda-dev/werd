import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

/** Emoji that fly outward from the center. */
const PARTICLES = [
  { emoji: "✨", dx: -72, dy: -58 },
  { emoji: "💕", dx: 72, dy: -52 },
  { emoji: "🌸", dx: -96, dy: 14 },
  { emoji: "⭐️", dx: 96, dy: 18 },
  { emoji: "💖", dx: -42, dy: -96 },
  { emoji: "🎀", dx: 46, dy: -94 },
  { emoji: "🩷", dx: 0, dy: -116 },
];

/**
 * A one-shot sparkle/confetti burst. Bump `burstKey` (e.g. on completion) to play
 * it again. Renders a zero-size node, so drop it inside a centered container and
 * the particles emanate from that center. Never blocks touches.
 */
export function Confetti({ burstKey, size = 26 }: { burstKey: number; size?: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (burstKey === 0) return;
    progress.value = 0;
    progress.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [burstKey, progress]);

  return (
    <View pointerEvents="none" style={{ width: 0, height: 0, alignItems: "center", justifyContent: "center" }}>
      {PARTICLES.map((p, i) => (
        <Particle key={i} progress={progress} emoji={p.emoji} dx={p.dx} dy={p.dy} size={size} />
      ))}
    </View>
  );
}

function Particle({
  progress,
  emoji,
  dx,
  dy,
  size,
}: {
  progress: SharedValue<number>;
  emoji: string;
  dx: number;
  dy: number;
  size: number;
}) {
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [0, dx]) },
      { translateY: interpolate(progress.value, [0, 1], [0, dy]) },
      { scale: interpolate(progress.value, [0, 0.3, 1], [0.2, 1.15, 0.9]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, dx > 0 ? 40 : -40])}deg` },
    ],
    opacity: interpolate(progress.value, [0, 0.15, 0.7, 1], [0, 1, 1, 0]),
  }));
  return <Animated.Text style={[{ position: "absolute", fontSize: size }, style]}>{emoji}</Animated.Text>;
}
