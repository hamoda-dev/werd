import { useState } from "react";
import { KeyboardAvoidingView, Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors, fonts, radii, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { useSettings } from "@/store/store";

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { update } = useSettings();
  const [name, setName] = useState("");
  const trimmed = name.trim();

  function handleStart() {
    if (!trimmed) return;
    update({ name: trimmed });
    router.replace("/");
  }

  return (
    <KeyboardAvoidingView
      behavior={process.env.EXPO_OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        backgroundColor: colors.green800,
        experimental_backgroundImage:
          "radial-gradient(circle at 50% 18%, rgba(216,180,106,0.28) 0%, transparent 55%), linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.xxl,
          paddingTop: insets.top + 80,
          paddingBottom: insets.bottom + spacing.xl,
          justifyContent: "space-between",
        }}
      >
        <Animated.View entering={FadeInDown.duration(500)} style={{ alignItems: "center", gap: spacing.md }}>
          <Txt naskh weight="bold" size={64} color={colors.gold300} align="center">
            وِرْد
          </Txt>
          <Txt size={16} color={colors.muted3} align="center" style={{ lineHeight: 28 }}>
            رفيقك اليومي لأذكار الصباح والمساء.{"\n"}لِنبدأ بالتعرّف عليك.
          </Txt>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ gap: spacing.lg }}>
          <Txt size={15} weight="medium" color={colors.creamText}>ما اسمك؟</Txt>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="اكتب اسمك"
            placeholderTextColor={colors.muted2}
            returnKeyType="done"
            onSubmitEditing={handleStart}
            autoFocus
            style={{
              backgroundColor: colors.whiteAlpha08,
              borderRadius: radii.tile,
              borderCurve: "continuous",
              paddingHorizontal: spacing.lg,
              paddingVertical: 16,
              fontFamily: fonts.sansMedium,
              fontSize: 18,
              color: colors.creamText,
              textAlign: "right",
              writingDirection: "rtl",
            }}
          />
          <Pressable
            onPress={handleStart}
            disabled={!trimmed}
            style={{
              backgroundColor: trimmed ? colors.gold500 : colors.whiteAlpha14,
              borderRadius: radii.pill,
              borderCurve: "continuous",
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Txt weight="bold" size={16} color={trimmed ? colors.green800 : colors.muted2}>
              ابدأ
            </Txt>
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
