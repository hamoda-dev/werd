import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { TasbihCounter } from "@/components/tasbih-counter";
import { toArabicNumerals } from "@/utils/numerals";

const PRESETS = [33, 100, 1000];
const PHRASES = ["سُبْحَانَ الله", "الحَمْدُ لله", "اللهُ أَكْبَر", "لَا إِلَهَ إِلَّا الله"];

export default function TasbihTab() {
  const insets = useSafeAreaInsets();
  const [target, setTarget] = useState(33);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.green800,
        experimental_backgroundImage: "linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + spacing.lg,
          paddingBottom: spacing.xl,
          paddingHorizontal: spacing.xl,
          alignItems: "center",
          gap: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Txt size={22} weight="bold" align="center">التسبيح</Txt>

        {/* اختيار الذكر */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center" }}>
          {PHRASES.map((p, i) => (
            <Pressable
              key={p}
              onPress={() => { setPhraseIdx(i); setResetSignal((s) => s + 1); }}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: 8,
                borderRadius: radii.pill,
                borderCurve: "continuous",
                backgroundColor: phraseIdx === i ? colors.gold500 : colors.whiteAlpha08,
              }}
            >
              <Txt naskh size={16} color={phraseIdx === i ? colors.green800 : colors.creamText}>{p}</Txt>
            </Pressable>
          ))}
        </View>

        <View style={{ alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
          <TasbihCounter
            itemKey={`free-${phraseIdx}-${target}`}
            target={target}
            resetSignal={resetSignal}
          />
        </View>

        {/* اختيار العدد */}
        <View style={{ flexDirection: "row", gap: spacing.sm, justifyContent: "center" }}>
          {PRESETS.map((t) => (
            <Pressable
              key={t}
              onPress={() => { setTarget(t); setResetSignal((s) => s + 1); }}
              style={{
                paddingHorizontal: spacing.lg,
                paddingVertical: 10,
                borderRadius: radii.pill,
                borderCurve: "continuous",
                backgroundColor: target === t ? colors.green700 : colors.whiteAlpha08,
                borderWidth: target === t ? 1 : 0,
                borderColor: colors.gold500,
              }}
            >
              <Txt weight="semibold" color={colors.creamText}>{toArabicNumerals(t)}</Txt>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => setResetSignal((s) => s + 1)}
          style={{
            paddingHorizontal: spacing.xxl,
            paddingVertical: 14,
            borderRadius: radii.pill,
            borderCurve: "continuous",
            backgroundColor: colors.whiteAlpha08,
          }}
        >
          <Txt weight="semibold" color="#cfe0d6">تصفير</Txt>
        </Pressable>
      </ScrollView>
    </View>
  );
}
