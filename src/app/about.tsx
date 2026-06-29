import { Linking, Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import Constants from "expo-constants";
import { spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { SocialIcon } from "@/components/social-icon";
import { toArabicNumerals } from "@/utils/numerals";
import { adhkarData } from "@/data/adhkar";

/** Creator links — opened externally. */
const LINKS = [
  { label: "الموقع الشخصي", url: "https://hamoda.dev", icon: "website" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/hamoda-dev/", icon: "linkedin" },
  { label: "GitHub", url: "https://github.com/hamoda-dev/", icon: "github" },
  { label: "X", url: "https://x.com/hamoda_dev", icon: "x" },
] as const;

/** Full-page "عن وِرْد": what the app is + the creator and their links. */
export default function About() {
  const { semantic, gradients, radii } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const version = Constants.expoConfig?.version ?? "";

  const card = {
    backgroundColor: semantic.surface,
    borderRadius: radii.card,
    borderCurve: "continuous" as const,
    padding: spacing.lg,
    gap: spacing.sm,
  };

  function open(url: string) {
    Linking.openURL(url).catch(() => {});
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: semantic.screen,
        experimental_backgroundImage: gradients.darkScreen,
        paddingTop: insets.top + spacing.sm,
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
        <Txt size={17} weight="bold">عن وِرْد</Txt>
        <View style={{ width: 38, height: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + spacing.xxl,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* App hero */}
        <Animated.View
          entering={FadeInUp.duration(350)}
          style={{ alignItems: "center", gap: spacing.sm, paddingVertical: spacing.lg }}
        >
          <Logo size={96} />
          <Txt naskh size={14} color={semantic.accentLight}>أذكار الصباح والمساء</Txt>
          {version ? (
            <Txt size={12} color={semantic.textSecondary}>الإصدار {toArabicNumerals(version)}</Txt>
          ) : null}
        </Animated.View>

        {/* About the app */}
        <View style={card}>
          <Txt size={15} weight="bold">عن التطبيق</Txt>
          <Txt size={14} color={semantic.textSecondary} style={{ lineHeight: 26 }}>
            وِرْد رفيقٌ هادئ لأذكار الصباح والمساء؛ يُعينك على المداومة بالعدّ على أصابعك (سنّةً) أو بالمسبحة، مع متابعةٍ لطيفة لتقدّمك. يعمل دون اتصال، وكل بياناتك محفوظة على جهازك فقط.
          </Txt>
          <View style={{ height: 1, backgroundColor: semantic.border, marginVertical: spacing.xs }} />
          <Txt size={13} color={semantic.textSecondary} style={{ lineHeight: 24 }}>
            المصدر: {adhkarData.source}
          </Txt>
        </View>

        {/* Creator */}
        <View style={card}>
          <Txt size={13} weight="medium" color={semantic.textSecondary}>المطوِّر</Txt>
          <Txt size={17} weight="bold">محمد حامد حموده</Txt>
          <Txt size={14} color={semantic.textSecondary} style={{ lineHeight: 26 }}>
            مهندس برمجيات بخبرة +٥ سنة. يركّز على حلّ المشكلات وصناعة قيمةٍ تُسهّل حياة الناس.
          </Txt>

          <View style={{ flexDirection: "row", justifyContent: "center", gap: spacing.md, marginTop: spacing.sm }}>
            {LINKS.map((l) => (
              <Pressable
                key={l.url}
                onPress={() => open(l.url)}
                accessibilityRole="link"
                accessibilityLabel={l.label}
                hitSlop={6}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: semantic.surfaceStrong,
                  borderWidth: 1,
                  borderColor: semantic.border,
                }}
              >
                <SocialIcon name={l.icon} size={22} color={semantic.accentLight} />
              </Pressable>
            ))}
          </View>
        </View>

        <Txt size={12} color={semantic.textTertiary} align="center" style={{ lineHeight: 22 }}>
          صُنع بعنايةٍ لخدمة الذاكرين
        </Txt>
      </ScrollView>
    </View>
  );
}
