import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp, FadeOut } from "react-native-reanimated";
import { fonts, spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { THEME_LIST } from "@/theme/registry";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { ThemePreview } from "@/components/theme-preview";
import { useSettings } from "@/store/store";

const STEPS = 3;

/** One-line descriptor per theme, shown under its swatch. */
const THEME_SUBS: Record<string, string> = {
  werd: "أخضر اللّيل · ذهبي هادئ",
  pink: "وردي فاتح · مرِح",
};

const COUNT_OPTIONS = [
  { id: "fingers", title: "العدّ على الأصابع", sub: "سحب بين الأذكار · موافق للسنّة" },
  { id: "beads", title: "المسبحة", sub: "عدّاد دائري بالنقر" },
] as const;

export default function Onboarding() {
  const theme = useTheme();
  const { colors, semantic, gradients, radii, shadows } = theme;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings, update } = useSettings();

  const [step, setStep] = useState(0);
  const [name, setName] = useState(settings.name);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const trimmed = name.trim();
  const themeId = settings.themeId ?? "werd";
  const countMode = settings.countMode ?? "fingers";

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  function next() {
    Keyboard.dismiss();
    if (step < STEPS - 1) setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }
  function finish() {
    if (!trimmed) {
      setStep(0);
      return;
    }
    update({ name: trimmed });
    router.replace("/");
  }

  const fullHero = step === 0;
  const showHero = !(step === 0 && keyboardVisible);

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
      {/* Hero: logo (full on welcome/ready, compact on the middle steps) */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          paddingTop: insets.top,
        }}
      >
        {showHero && (
          <>
            <View
              style={{
                position: "absolute",
                width: fullHero ? 230 : 150,
                height: fullHero ? 230 : 150,
                borderRadius: 115,
                experimental_backgroundImage: gradients.logoGlow,
              }}
            />
            <Animated.View
              key={fullHero ? "hero-full" : "hero-sm"}
              entering={FadeInDown.duration(450)}
              exiting={FadeOut.duration(150)}
              style={{ alignItems: "center", gap: spacing.md }}
            >
              <Logo size={fullHero ? 104 : 64} />

              {step === 0 ? (
                <Txt naskh size={14} color={semantic.accentLight} align="center" style={{ letterSpacing: 0.5, opacity: 0.92 }}>
                  أذكار الصباح والمساء
                </Txt>
              ) : null}
            </Animated.View>
          </>
        )}
      </View>

      {/* Cream sheet — content swaps per step (re-keyed so it re-animates) */}
      <Animated.View
        key={step}
        entering={FadeInUp.duration(380)}
        style={{
          backgroundColor: semantic.surfaceCream,
          borderTopLeftRadius: radii.cardLg,
          borderTopRightRadius: radii.cardLg,
          borderCurve: "continuous",
          borderWidth: 1.5,
          borderBottomWidth: 0,
          borderColor: semantic.accent,
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + spacing.xl,
          gap: spacing.md,
          boxShadow: shadows.sheet,
        }}
      >
        {/* Header: back + progress dots */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {step > 0 ? (
            <Pressable onPress={back} hitSlop={12} style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
              <Icon name="chevron.backward" size={22} color={colors.green700} />
            </Pressable>
          ) : (
            <View style={{ width: 24 }} />
          )}
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            {Array.from({ length: STEPS }).map((_, i) => (
              <View
                key={i}
                style={{
                  height: 7,
                  width: i === step ? 20 : 7,
                  borderRadius: 4,
                  backgroundColor: i === step ? semantic.accent : semantic.borderCream,
                }}
              />
            ))}
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* ===== Step 0: welcome + name ===== */}
        {step === 0 ? (
          <>
            <Txt naskh weight="bold" size={24} color={colors.green900}>أهلاً بك</Txt>
            <Txt size={14} color={semantic.textMutedCream} style={{ lineHeight: 24 }}>
              لِنبدأ بالتعرّف عليك ونخصّص لك يومك.
            </Txt>
            <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
              <Txt weight="medium" size={13} color={colors.green700}>ما اسمك؟</Txt>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="اكتب اسمك"
                placeholderTextColor={semantic.textTertiary}
                returnKeyType="next"
                onSubmitEditing={() => trimmed && next()}
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
            <PrimaryButton
              label="التالي"
              chevron
              disabled={!trimmed}
              onPress={next}
              semantic={semantic}
              gradients={gradients}
              radii={radii}
            />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Icon name="lock.fill" size={12} color={semantic.textMutedCream} />
              <Txt size={11} color={semantic.textMutedCream}>بياناتك تبقى على جهازك</Txt>
            </View>
          </>
        ) : null}

        {/* ===== Step 1: theme ===== */}
        {step === 1 ? (
          <>
            <Txt naskh weight="bold" size={24} color={colors.green900}>اختر مظهرك</Txt>
            <Txt size={14} color={semantic.textMutedCream} style={{ lineHeight: 24 }}>
              يمكنك تغييره لاحقًا من «ملفي».
            </Txt>
            <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs }}>
              {THEME_LIST.map((t) => {
                const active = themeId === t.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => update({ themeId: t.id })}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      gap: spacing.sm,
                      backgroundColor: semantic.surfaceWhite,
                      borderWidth: 1.5,
                      borderColor: active ? semantic.accent : semantic.borderCream,
                      borderRadius: radii.card,
                      borderCurve: "continuous",
                      paddingVertical: spacing.md,
                      paddingHorizontal: spacing.sm,
                    }}
                  >
                    <ThemePreview theme={t} />
                    <Txt weight="bold" size={13} color={semantic.textOnCream} align="center">
                      {t.label}
                    </Txt>
                    <Txt size={10} color={semantic.textMutedCream} align="center">
                      {THEME_SUBS[t.id] ?? ""}
                    </Txt>
                    <CheckCircle active={active} semantic={semantic} />
                  </Pressable>
                );
              })}
            </View>
            <PrimaryButton label="التالي" chevron onPress={next} semantic={semantic} gradients={gradients} radii={radii} />
          </>
        ) : null}

        {/* ===== Step 2: counting method ===== */}
        {step === 2 ? (
          <>
            <Txt naskh weight="bold" size={24} color={colors.green900}>طريقة العدّ</Txt>
            <Txt size={14} color={semantic.textMutedCream} style={{ lineHeight: 24 }}>
              كيف تُحبّ أن تعدّ تكرار الأذكار؟
            </Txt>
            <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
              {COUNT_OPTIONS.map((opt) => {
                const active = countMode === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => update({ countMode: opt.id })}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.md,
                      backgroundColor: semantic.surfaceWhite,
                      borderWidth: 1.5,
                      borderColor: active ? semantic.accent : semantic.borderCream,
                      borderRadius: radii.card,
                      borderCurve: "continuous",
                      padding: spacing.md,
                    }}
                  >
                    <View
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: radii.tile,
                        borderCurve: "continuous",
                        backgroundColor: semantic.surfaceCreamAlt,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {opt.id === "fingers" ? (
                        <View style={{ flexDirection: "row", gap: 4 }}>
                          {[0, 1, 2].map((i) => (
                            <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: semantic.accent }} />
                          ))}
                        </View>
                      ) : (
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            borderWidth: 2.5,
                            borderColor: semantic.accent,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Txt size={11} weight="bold" color={semantic.textOnCream}>٣٣</Txt>
                        </View>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt weight="bold" size={14} color={semantic.textOnCream}>{opt.title}</Txt>
                      <Txt size={11} color={semantic.textMutedCream}>{opt.sub}</Txt>
                    </View>
                    <CheckCircle active={active} semantic={semantic} />
                  </Pressable>
                );
              })}
            </View>
            <PrimaryButton label="ابدأ وِردك" onPress={finish} semantic={semantic} gradients={gradients} radii={radii} />
          </>
        ) : null}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

/** Selectable check indicator on a cream card. */
function CheckCircle({ active, semantic }: { active: boolean; semantic: ReturnType<typeof useTheme>["semantic"] }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: active ? 0 : 2,
        borderColor: semantic.borderCream,
        backgroundColor: active ? semantic.accent : "transparent",
      }}
    >
      {active ? <Icon name="checkmark" size={13} color={semantic.textOnCream} /> : null}
    </View>
  );
}

/** The gold primary CTA used on every step (optional forward chevron). */
function PrimaryButton({
  label,
  onPress,
  disabled = false,
  chevron = false,
  semantic,
  gradients,
  radii,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  chevron?: boolean;
  semantic: ReturnType<typeof useTheme>["semantic"];
  gradients: ReturnType<typeof useTheme>["gradients"];
  radii: ReturnType<typeof useTheme>["radii"];
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        flexDirection: "row",
        gap: 7,
        borderRadius: radii.tile,
        borderCurve: "continuous",
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.xs,
        backgroundColor: disabled ? semantic.borderCream : semantic.accent,
        experimental_backgroundImage: disabled ? undefined : gradients.gold,
      }}
    >
      <Txt weight="bold" size={16} color={disabled ? semantic.textTertiary : semantic.textOnCream}>
        {label}
      </Txt>
      {chevron && !disabled ? <Icon name="chevron.forward" size={16} color={semantic.textOnCream} /> : null}
    </Pressable>
  );
}
