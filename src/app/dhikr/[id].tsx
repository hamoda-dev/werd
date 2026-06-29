import { Icon } from "@/components/icon";
import { RepeatGuidance } from "@/components/repeat-guidance";
import { TasbihCounter } from "@/components/tasbih-counter";
import { Txt } from "@/components/txt";
import { isFree } from "@/data/adhkari";
import { completeWard, getAdhkariItem, getPartialCount, setPartialCount, useSettings } from "@/store/store";
import { useTheme } from "@/theme/context";
import { spacing } from "@/theme/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Counts a single ذِكر (built-in or user-created). Target items award points on completion. */
export default function DhikrCounterScreen() {
  const { semantic, gradients, radii } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const item = id ? getAdhkariItem(id) : undefined;
  const [resetSignal, setResetSignal] = useState(0);
  const { settings } = useSettings();
  const mode = settings.countMode ?? "fingers";

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl }}>
        <Txt size={18} weight="semibold">لم يُعثر على هذا الذِكر</Txt>
        <Pressable onPress={() => router.back()} style={{ marginTop: spacing.lg }}>
          <Txt color={semantic.accent} weight="semibold">رجوع</Txt>
        </Pressable>
      </View>
    );
  }

  const free = isFree(item.count);

  function handleComplete() {
    // Ward points + the "complete your own ward" challenge apply to user items only,
    // not the read-only built-in classics.
    if (!item!.locked) completeWard();
    router.back();
  }

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
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.xl }}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={{ width: 38, height: 38, alignItems: "center", justifyContent: "center" }}>
          <Icon name="chevron.backward" size={24} color={semantic.textPrimary} />
        </Pressable>
        <Txt size={17} weight="bold" align="center" numberOfLines={1} style={{ flex: 1, marginHorizontal: spacing.sm }}>
          {item.title ?? item.text}
        </Txt>
        <View style={{ width: 38, height: 38 }} />
      </View>

      {mode === "fingers" ? (
        /* Count on the fingers — text + repetition guidance, mark «تمّ» when done. */
        <>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, alignItems: "center", justifyContent: "center", gap: spacing.xxl }}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View key={item.id} entering={FadeInUp.duration(350)} style={{ alignItems: "center", gap: spacing.xxl }}>
              {item.title ? (
                <Txt size={13} weight="semibold" color={semantic.accentLight} align="center">{item.title}</Txt>
              ) : null}
              <Txt naskh size={26} color={semantic.textPrimary} align="center" style={{ lineHeight: 46 }}>
                {item.text}
              </Txt>
              <RepeatGuidance count={item.count} />
            </Animated.View>
          </ScrollView>

          <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.sm }}>
            <Pressable
              onPress={handleComplete}
              style={{ backgroundColor: semantic.accent, borderRadius: radii.tile, borderCurve: "continuous", paddingVertical: 15, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center" }}
            >
              <Txt weight="bold" color={semantic.textOnCream}>تمّ</Txt>
              <Icon name="checkmark" size={16} color={semantic.textOnCream} />
            </Pressable>
          </View>
        </>
      ) : (
        /* المسبحة — the on-screen tap counter. */
        <>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, alignItems: "center", justifyContent: "center", gap: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            {/* Dhikr card */}
            <Animated.View
              key={item.id}
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
              {item.title ? (
                <Txt size={13} weight="semibold" color={semantic.accentLight} align="center">{item.title}</Txt>
              ) : null}
              <Txt naskh size={26} color={semantic.textPrimary} align="center" style={{ lineHeight: 46 }}>
                {item.text}
              </Txt>
            </Animated.View>

            {/* Counter */}
            <Animated.View entering={FadeIn.duration(300)}>
              <TasbihCounter
                itemKey={item.id}
                target={item.count}
                initialCount={getPartialCount(item.id)}
                resetSignal={resetSignal}
                onChange={(c) => setPartialCount(item.id, c)}
                onComplete={free ? undefined : handleComplete}
              />
            </Animated.View>

            <Txt size={13} color={semantic.textSecondary} align="center">اضغط الدائرة للعدّ</Txt>
          </ScrollView>

          {/* Reset */}
          <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.sm }}>
            <Pressable
              onPress={() => {
                setResetSignal((s) => s + 1);
                setPartialCount(item.id, 0);
              }}
              style={{ backgroundColor: semantic.surfaceStrong, borderRadius: radii.tile, borderCurve: "continuous", paddingVertical: 15, alignItems: "center" }}
            >
              <Txt weight="semibold" color={semantic.textGhost}>مسح العداد</Txt>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
