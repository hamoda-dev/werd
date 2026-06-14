import { useState } from "react";
import { Pressable, View } from "react-native";
import { radii, semantic, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { TasbihCounter } from "@/components/tasbih-counter";
import { toArabicNumerals } from "@/utils/numerals";
import { Screen } from "@/components/screen";
import { Button } from "@/components/button";

const PRESETS = [33, 100, 1000];
const PHRASES = ["سُبْحَانَ الله", "الحَمْدُ لله", "اللهُ أَكْبَر", "لَا إِلَهَ إِلَّا الله"];

export default function TasbihTab() {
  const [target, setTarget] = useState(33);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);

  return (
    <Screen contentStyle={{ flexGrow: 1, alignItems: "center", gap: spacing.xl, paddingBottom: spacing.xl }}>
      <Txt size={22} weight="bold" align="center">التسبيح</Txt>

      {/* Phrase selection */}
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
              backgroundColor: phraseIdx === i ? semantic.accent : semantic.surfaceStrong,
            }}
          >
            <Txt naskh size={16} color={phraseIdx === i ? semantic.textOnCream : semantic.textPrimary}>{p}</Txt>
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

      {/* Count selection */}
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
              backgroundColor: target === t ? semantic.brandSurface : semantic.surfaceStrong,
              borderWidth: target === t ? 1 : 0,
              borderColor: semantic.accent,
            }}
          >
            <Txt weight="semibold" color={semantic.textPrimary}>{toArabicNumerals(t)}</Txt>
          </Pressable>
        ))}
      </View>

      <Button variant="ghost" style={{ paddingHorizontal: spacing.xxl }} onPress={() => setResetSignal((s) => s + 1)}>
        تصفير
      </Button>
    </Screen>
  );
}
