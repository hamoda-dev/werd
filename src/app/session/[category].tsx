import { AdhkarSwiper } from "@/components/adhkar-swiper";
import { Icon } from "@/components/icon";
import { TasbihCounter } from "@/components/tasbih-counter";
import { Txt } from "@/components/txt";
import { getCategory } from "@/data/adhkar";
import {
  completeCategory,
  getPartialCount,
  getTodayCompletedIds,
  markDhikrCompleted,
  setPartialCount,
  unmarkDhikrCompleted,
  useSettings,
} from "@/store/store";
import { useTheme } from "@/theme/context";
import { spacing } from "@/theme/tokens";
import { toArabicNumerals } from "@/utils/numerals";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SessionScreen() {
  const { semantic, gradients, radii } = useTheme();
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // The session serves the built-in morning/evening categories. Custom أذكار are
  // counted one-at-a-time via /dhikr/[id], so there is no custom-ward path here.
  const builtin = category ? getCategory(category) : undefined;
  const items = builtin?.adhkar ?? [];
  const title = builtin?.title ?? "";

  // Resume from the first dhikr not yet completed today (for built-in adhkar). Computed once on open.
  const [index, setIndex] = useState(() => {
    if (!builtin) return 0;
    const completed = getTodayCompletedIds();
    const firstIncomplete = builtin.adhkar.findIndex((d) => !completed.includes(d.id));
    return firstIncomplete === -1 ? 0 : firstIncomplete;
  });
  const [resetSignal, setResetSignal] = useState(0);
  const { settings } = useSettings();
  const mode = settings.countMode ?? "fingers";
  const current = items[index];

  if (!current) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl }}>
        <Txt size={18} weight="semibold">لم يُعثر على هذا الوِرد</Txt>
        <Pressable onPress={() => router.back()} style={{ marginTop: spacing.lg }}>
          <Txt color={semantic.accent} weight="semibold">رجوع</Txt>
        </Pressable>
      </View>
    );
  }

  function finish() {
    if (builtin) {
      completeCategory(builtin.id);
      // Clear the partial counts so a later repeat starts from zero.
      builtin.adhkar.forEach((d) => setPartialCount(d.id, 0));
    }
    router.back();
  }

  function advance() {
    markDhikrCompleted(current.id);
    if (index < items.length - 1) setIndex(index + 1);
    else finish();
  }

  function goPrev() {
    if (index > 0) {
      // Returning to an earlier dhikr un-completes it so the session resumes here next time.
      unmarkDhikrCompleted(items[index - 1].id);
      setIndex(index - 1);
    }
  }

  const isLast = index === items.length - 1;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: semantic.screen,
        experimental_backgroundImage: gradients.darkScreen,
        paddingTop: insets.top + spacing.sm,
        paddingBottom: insets.bottom + spacing.lg,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.xl,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={{ width: 38, height: 38, alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="chevron.backward" size={24} color={semantic.textPrimary} />
        </Pressable>
        <View style={{ alignItems: "center" }}>
          <Txt size={17} weight="bold" align="center">{title}</Txt>
          <Txt size={12} color={semantic.textSecondary} align="center">
            الذكر {toArabicNumerals(index + 1)} من {toArabicNumerals(items.length)}
          </Txt>
        </View>
        <View style={{ width: 38, height: 38 }} />
      </View>

      {/* Progress bars */}
      <View
        style={{ flexDirection: "row", gap: 5, paddingHorizontal: spacing.xl, marginTop: spacing.md }}
      >
        {items.map((it, i) => (
          <View
            key={it.id}
            style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              backgroundColor:
                i < index ? semantic.success : i === index ? semantic.accent : semantic.surfaceFaint,
            }}
          />
        ))}
      </View>

      {mode === "fingers" ? (
        /* Count on the fingers — swipe between adhkar, no counter. */
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.lg,
            paddingBottom: spacing.sm,
          }}
        >
          <AdhkarSwiper
            current={current}
            canPrev={index > 0}
            onNext={advance}
            onPrev={goPrev}
          />
        </View>
      ) : (
        /* المسبحة — the on-screen tap counter. */
        <>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: spacing.xl,
              paddingTop: spacing.lg,
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.xl,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Dhikr card */}
            <Animated.View
              key={current.id}
              entering={FadeInUp.duration(350)}
              style={{
                width: "100%",
                backgroundColor: semantic.surface,
                borderWidth: 1,
                borderColor: semantic.goldHairline,
                borderRadius: radii.card,
                borderCurve: "continuous",
                paddingVertical: spacing.xxl,
                paddingHorizontal: spacing.xl,
                minHeight: 150,
                alignItems: "center",
                justifyContent: "center",
                gap: spacing.sm,
              }}
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
                <Txt size={12} color={semantic.textSecondary} align="center">{current.note}</Txt>
              ) : null}
            </Animated.View>

            {/* Counter */}
            <Animated.View entering={FadeIn.duration(300)}>
              <TasbihCounter
                itemKey={current.id}
                target={current.count}
                initialCount={getPartialCount(current.id)}
                resetSignal={resetSignal}
                onChange={(c) => setPartialCount(current.id, c)}
                onComplete={advance}
              />
            </Animated.View>

            <Txt size={13} color={semantic.textSecondary} align="center">
              اضغط الدائرة للعدّ
            </Txt>
          </ScrollView>

          {/* Control buttons */}
          <View
            style={{ flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.xl, marginTop: spacing.sm }}
          >
            <Pressable
              onPress={goPrev}
              disabled={index === 0}
              style={{
                flex: 1.6,
                backgroundColor: semantic.accent,
                borderRadius: radii.tile,
                borderCurve: "continuous",
                paddingVertical: 15,
                flexDirection: "row",
                gap: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                name={isLast ? "checkmark" : "chevron.backward"}
                size={16}
                color={semantic.textOnCream}
              />
              <Txt weight="semibold" color={semantic.textOnCream}>السابق</Txt>
            </Pressable>
            <Pressable
              onPress={() => {
                setResetSignal((s) => s + 1);
                setPartialCount(current.id, 0);
              }}
              style={{
                flex: 1.6,
                backgroundColor: semantic.surfaceStrong,
                borderRadius: radii.tile,
                borderCurve: "continuous",
                paddingVertical: 15,
                flexDirection: "row",
                gap: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Txt weight="semibold" color={semantic.textGhost}>مسح العداد</Txt>
            </Pressable>
            <Pressable
              onPress={advance}
              style={{
                flex: 1.6,
                backgroundColor: semantic.accent,
                borderRadius: radii.tile,
                borderCurve: "continuous",
                paddingVertical: 15,
                flexDirection: "row",
                gap: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Txt weight="bold" color={semantic.textOnCream}>
                {isLast ? "إنهاء" : "التالي"}
              </Txt>
              <Icon
                name={isLast ? "checkmark" : "chevron.forward"}
                size={16}
                color={semantic.textOnCream}
              />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
