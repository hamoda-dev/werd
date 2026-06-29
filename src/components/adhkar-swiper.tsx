import { useEffect, useRef } from "react";
import { useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { RepeatGuidance } from "@/components/repeat-guidance";
import type { Dhikr } from "@/types";

interface Props {
  current: Dhikr;
  /** Whether a previous dhikr exists (the first dhikr can't go back). */
  canPrev: boolean;
  /** Move forward (advances, or finishes on the last dhikr). Triggered by a right swipe. */
  onNext: () => void;
  /** Move back. Triggered by a left swipe. */
  onPrev: () => void;
}

const SWIPE_THRESHOLD = 56;
const EXIT_MS = 170;
const ENTER_MS = 240;

/**
 * The "count on the fingers" reading view: the dhikr alone in the center with the
 * repetition shown only as guidance — no counter. Swipe right for the next dhikr,
 * left for the previous (the natural RTL page-turn).
 *
 * One continuous slide drives the transition on the UI thread: the card follows the
 * finger, flings off-screen on a committed swipe, the dhikr swaps while it's off-screen,
 * then the new card slides in from the opposite edge (see the `current.id` effect).
 * The card scrolls if a long du'a overflows.
 */
export function AdhkarSwiper({ current, canPrev, onNext, onPrev }: Props) {
  const { semantic } = useTheme();
  const { width } = useWindowDimensions();
  const tx = useSharedValue(0);
  // Remembers the swipe direction so the incoming dhikr enters from the correct edge.
  const lastDir = useRef<"next" | "prev">("next");

  function goNext() {
    lastDir.current = "next";
    onNext();
  }
  function goPrev() {
    lastDir.current = "prev";
    onPrev();
  }

  // After the dhikr swaps, slide the new card in from the edge opposite the exit.
  useEffect(() => {
    tx.value = lastDir.current === "next" ? -width : width;
    tx.value = withTiming(0, { duration: ENTER_MS });
  }, [current.id, width, tx]);

  const pan = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((e) => {
      tx.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX >= SWIPE_THRESHOLD) {
        // Swipe right → next: fling the card off to the right, then swap.
        tx.value = withTiming(width, { duration: EXIT_MS }, (finished) => {
          if (finished) scheduleOnRN(goNext);
        });
      } else if (e.translationX <= -SWIPE_THRESHOLD && canPrev) {
        // Swipe left → previous: fling off to the left, then swap.
        tx.value = withTiming(-width, { duration: EXIT_MS }, (finished) => {
          if (finished) scheduleOnRN(goPrev);
        });
      } else {
        // Not committed (below threshold, or no previous): rebound to center.
        tx.value = withTiming(0, { duration: 200 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }] }));

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[{ flex: 1 }, cardStyle]}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.xxl,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.lg,
            }}
            showsVerticalScrollIndicator={false}
          >
            {current.title ? (
              <Txt size={13} weight="semibold" color={semantic.accentLight} align="center">
                {current.title}
              </Txt>
            ) : null}
            <Txt naskh size={26} color={semantic.textPrimary} align="center" style={{ lineHeight: 46 }}>
              {current.text}
            </Txt>
            {current.note ? (
              <Txt size={12} color={semantic.textSecondary} align="center">
                {current.note}
              </Txt>
            ) : null}
            <RepeatGuidance count={current.count} />
          </ScrollView>
        </Animated.View>
      </GestureDetector>

      {/* Swipe hint — chevrons on the outer edge: «‹ التالي» (left) · اسحب للتنقّل · «السابق ›» (right). */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.lg,
          paddingTop: spacing.md,
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 4, opacity: canPrev ? 1 : 0.35 }}
        >
          <Icon name="chevron.backward" size={14} color={semantic.accentLight} />
          <Txt size={12} weight="semibold" color={semantic.accentLight}>السابق</Txt>
        </View>
        <Txt size={11} color={semantic.textSecondary}>اسحب للتنقّل</Txt>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Txt size={12} weight="semibold" color={semantic.accentLight}>التالي</Txt>
          <Icon name="chevron.forward" size={14} color={semantic.accentLight} />
        </View>
      </View>
    </View>
  );
}
