import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp, FadeOut } from "react-native-reanimated";
import { Image } from "expo-image";
import { fonts, spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { useSettings } from "@/store/store";

export default function Onboarding() {
  const { colors, semantic, gradients, radii, shadows } = useTheme();
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
        backgroundColor: semantic.screen,
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
                experimental_backgroundImage: gradients.logoGlow,
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
              <Txt naskh size={14} color={semantic.accentLight} align="center" style={{ letterSpacing: 0.5, opacity: 0.92 }}>
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
          backgroundColor: semantic.surfaceCream,
          borderTopLeftRadius: radii.cardLg,
          borderTopRightRadius: radii.cardLg,
          borderCurve: "continuous",
          borderWidth: 1.5,
          borderBottomWidth: 0,
          borderColor: semantic.accent,
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.xxl,
          paddingBottom: insets.bottom + spacing.xl,
          gap: spacing.md,
          boxShadow: shadows.sheet,
        }}
      >
        <Txt naskh weight="bold" size={26} color={colors.green900}>
          أهلاً بك
        </Txt>
        <Txt size={14} color={semantic.textMutedCream} style={{ lineHeight: 24 }}>
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
            placeholderTextColor={semantic.textTertiary}
            returnKeyType="done"
            onSubmitEditing={handleStart}
            style={{
              backgroundColor: semantic.surfaceWhite,
              borderWidth: 1,
              borderColor: semantic.borderCream,
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
            backgroundColor: trimmed ? semantic.accent : semantic.borderCream,
            experimental_backgroundImage: trimmed ? gradients.gold : undefined,
          }}
        >
          <Txt weight="bold" size={16} color={trimmed ? semantic.textOnCream : semantic.textTertiary}>
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
          <Icon name="lock.fill" size={12} color={semantic.textMutedCream} />
          <Txt size={11} color={semantic.textMutedCream}>
            بياناتك تبقى على جهازك
          </Txt>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
