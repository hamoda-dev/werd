import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp, FadeOut } from "react-native-reanimated";
import { Image } from "expo-image";
import { colors, fonts, gradients, radii, shadows, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { useSettings } from "@/store/store";

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { update } = useSettings();
  const [name, setName] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const trimmed = name.trim();

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  function handleStart() {
    if (!trimmed) return;
    update({ name: trimmed });
    router.replace("/");
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={0}
      style={{
        flex: 1,
        backgroundColor: colors.green800,
        experimental_backgroundImage: gradients.onboardingGlow,
      }}
    >
      {/* Top area: logo + tagline — hidden when the keyboard opens so the logo isn't clipped */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          paddingTop: insets.top,
        }}
      >
        {!keyboardVisible && (
          <>
            <View
              style={{
                position: "absolute",
                width: 230,
                height: 230,
                borderRadius: 115,
                experimental_backgroundImage:
                  "radial-gradient(circle, rgba(216,180,106,0.30) 0%, transparent 62%)",
              }}
            />
            <Animated.View
              entering={FadeInDown.duration(500)}
              exiting={FadeOut.duration(200)}
              style={{ alignItems: "center", gap: spacing.lg }}
            >
              <View style={{ borderRadius: radii.card, boxShadow: shadows.darkElevated }}>
                <Image
                  source={require("@/assets/images/wird-logo.png")}
                  style={{ width: 104, height: 104, borderRadius: radii.card }}
                  contentFit="contain"
                />
              </View>
              <Txt naskh size={14} color={colors.gold300} align="center" style={{ letterSpacing: 0.5, opacity: 0.92 }}>
                أذكار الصباح والمساء
              </Txt>
            </Animated.View>
          </>
        )}
      </View>

      {/* Cream sheet: rises from the bottom and stays above the keyboard */}
      <Animated.View
        entering={FadeInUp.duration(450)}
        style={{
          backgroundColor: colors.cream50,
          borderTopLeftRadius: radii.cardLg,
          borderTopRightRadius: radii.cardLg,
          borderCurve: "continuous",
          borderWidth: 1.5,
          borderBottomWidth: 0,
          borderColor: colors.gold500,
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.xxl,
          paddingBottom: insets.bottom + spacing.xl,
          gap: spacing.md,
          boxShadow: "0 -12px 30px -16px rgba(14,45,34,0.5)",
        }}
      >
        <Txt naskh weight="bold" size={26} color={colors.green900}>
          أهلاً بك
        </Txt>
        <Txt size={14} color={colors.muted1} style={{ lineHeight: 24 }}>
          لِنبدأ بالتعرّف عليك ونخصّص لك يومك.
        </Txt>

        <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
          <Txt weight="medium" size={13} color={colors.green700}>
            ما اسمك؟
          </Txt>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="اكتب اسمك"
            placeholderTextColor={colors.muted2}
            returnKeyType="done"
            onSubmitEditing={handleStart}
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: colors.borderWarm,
              borderRadius: radii.tile,
              borderCurve: "continuous",
              paddingHorizontal: spacing.lg,
              paddingVertical: 15,
              fontFamily: fonts.sansMedium,
              fontSize: 17,
              color: colors.green900,
              textAlign: "auto",
              writingDirection: "auto",
            }}
          />
        </View>

        <Pressable
          onPress={handleStart}
          disabled={!trimmed}
          style={{
            borderRadius: radii.tile,
            borderCurve: "continuous",
            paddingVertical: 16,
            alignItems: "center",
            marginTop: spacing.xs,
            backgroundColor: trimmed ? colors.gold500 : colors.borderWarm,
            experimental_backgroundImage: trimmed ? gradients.gold : undefined,
          }}
        >
          <Txt weight="bold" size={16} color={trimmed ? colors.green800 : colors.muted2}>
            ابدأ
          </Txt>
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: spacing.xs,
          }}
        >
          <Icon name="lock.fill" size={12} color={colors.muted1} />
          <Txt size={11} color={colors.muted1}>
            بياناتك تبقى على جهازك
          </Txt>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
