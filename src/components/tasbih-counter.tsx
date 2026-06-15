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
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { colors, fonts } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { toArabicNumerals } from "@/utils/numerals";
import { useSettings } from "@/store/store";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 248;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;
const ADVANCE_DELAY = 950;

interface Props {
  /** Changes when switching dhikr; re-initializes the counter from initialCount. */
  itemKey: string;
  /** Repetition target, or `null` for a free (open-ended) tasbih — no goal, no completion. */
  target: number | null;
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
  // Free (open-ended) tasbih: no goal, never "done", and a faint full ring.
  const free = target == null || target <= 0;
  const ringRatio = (n: number) => (free ? 1 : n / (target as number));

  const [count, setCount] = useState(initialCount);
  const progress = useSharedValue(ringRatio(initialCount));
  const celebrate = useSharedValue(0);
  const done = !free && count >= (target as number);

  // Tap sound (toggleable from Profile). Play even with the silent switch on,
  // since the click is the point. Legacy settings (undefined) count as enabled.
  const { settings } = useSettings();
  const soundOn = settings.soundEnabled !== false;
  const click = useAudioPlayer(require("../../assets/sounds/click.wav"));
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  // Keep the latest initialCount in a ref so we don't re-initialize on a mere value change
  // (we want to initialize only when switching dhikr via itemKey).
  const initialRef = useRef(initialCount);
  initialRef.current = initialCount;

  // When switching dhikr: start from the saved count for that dhikr.
  useEffect(() => {
    const init = initialRef.current;
    setCount(init);
    progress.value = ringRatio(init);
    celebrate.value = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemKey, target, progress, celebrate]);

  // Reset button: ignore the initial value (0) on first mount.
  useEffect(() => {
    if (resetSignal === 0) return;
    setCount(0);
    progress.value = ringRatio(0); // 1 (faint full ring) when free, else 0
    celebrate.value = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (soundOn) {
      click.seekTo(0);
      click.play();
    }
    const next = count + 1;
    setCount(next);
    onChange?.(next);
    hapticLight();
    if (free) return; // free tasbih: just tally, no ring fill or completion
    progress.value = withTiming(ringRatio(next), { duration: 320 });
    if (next >= (target as number)) {
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
            strokeOpacity={free ? 0.3 : 1}
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
            {free ? "تسبيح حر" : `من ${toArabicNumerals(target as number)}`}
          </Txt>
        </View>
      </View>
    </Pressable>
  );
}
