import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { colors, fonts } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { toArabicNumerals } from "@/utils/numerals";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 248;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;
const ADVANCE_DELAY = 950;

interface Props {
  /** Changes when switching dhikr; re-initializes the counter from initialCount. */
  itemKey: string;
  target: number;
  /** Saved count for the current dhikr (to resume the tasbih where it stopped). */
  initialCount?: number;
  resetSignal?: number;
  accent?: string;
  onChange?: (count: number) => void;
  onComplete?: () => void;
}

function hapticLight() {
  if (process.env.EXPO_OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}
function hapticSuccess() {
  if (process.env.EXPO_OS === "ios") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

export function TasbihCounter({
  itemKey,
  target,
  initialCount = 0,
  resetSignal = 0,
  accent = colors.gold500,
  onChange,
  onComplete,
}: Props) {
  const [count, setCount] = useState(initialCount);
  const progress = useSharedValue(target > 0 ? initialCount / target : 0);
  const celebrate = useSharedValue(0);
  const done = count >= target;

  // Keep the latest initialCount in a ref so we don't re-initialize on a mere value change
  // (we want to initialize only when switching dhikr via itemKey).
  const initialRef = useRef(initialCount);
  initialRef.current = initialCount;

  // When switching dhikr: start from the saved count for that dhikr.
  useEffect(() => {
    const init = initialRef.current;
    setCount(init);
    progress.value = target > 0 ? init / target : 0;
    celebrate.value = 0;
  }, [itemKey, target, progress, celebrate]);

  // Reset button: ignore the initial value (0) on first mount.
  useEffect(() => {
    if (resetSignal === 0) return;
    setCount(0);
    progress.value = 0;
    celebrate.value = 0;
  }, [resetSignal, progress, celebrate]);

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: C * (1 - progress.value),
  }));

  const celebrateStyle = useAnimatedStyle(() => ({
    opacity: interpolate(celebrate.value, [0, 1], [0.65, 0]),
    transform: [{ scale: interpolate(celebrate.value, [0, 1], [0.9, 1.5]) }],
  }));

  function handleTap() {
    if (done) return;
    const next = count + 1;
    setCount(next);
    onChange?.(next);
    progress.value = withTiming(next / target, { duration: 320 });
    hapticLight();
    if (next >= target) {
      hapticSuccess();
      celebrate.value = 0;
      celebrate.value = withTiming(1, { duration: 900 });
      setTimeout(() => onComplete?.(), ADVANCE_DELAY);
    }
  }

  return (
    <Pressable onPress={handleTap} disabled={done}>
      <View style={{ width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center" }}>
        {/* Celebration ring */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              borderWidth: 3,
              borderColor: accent,
            },
            celebrateStyle,
          ]}
        />

        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={colors.whiteAlpha08}
            strokeWidth={STROKE}
            fill="none"
          />
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={accent}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={C}
            strokeLinecap="round"
            animatedProps={ringProps}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>

        {/* Counter in the center */}
        <View style={{ position: "absolute", alignItems: "center" }}>
          <Txt
            style={{ fontFamily: fonts.sansBold, fontVariant: ["tabular-nums"] }}
            size={78}
            color={colors.creamText}
            align="center"
          >
            {toArabicNumerals(count)}
          </Txt>
          <Txt size={15} color={colors.muted3} align="center">
            من {toArabicNumerals(target)}
          </Txt>
        </View>
      </View>
    </Pressable>
  );
}
