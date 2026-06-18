import { View } from "react-native";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { Card } from "@/components/card";
import { ProgressBar } from "@/components/progress-bar";
import { toArabicNumerals } from "@/utils/numerals";
import { levelInfo, levelTitle, POINTS_PER_LEVEL } from "@/store/store";
import type { Score } from "@/types";

/** Unified level card (home + achievements). */
export function LevelCard({ score, showToNext = false }: { score: Score; showToNext?: boolean }) {
  const { semantic } = useTheme();
  const lvl = levelInfo(score);
  return (
    <Card>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Txt size={15} weight="bold" color={semantic.textPrimary}>
          المستوى {toArabicNumerals(lvl.level)} · {levelTitle(lvl.level)}
        </Txt>
        <Txt size={12} weight="semibold" color={semantic.accentLight}>
          {toArabicNumerals(lvl.inLevel)}/{toArabicNumerals(POINTS_PER_LEVEL)}
        </Txt>
      </View>
      <ProgressBar ratio={lvl.ratio} />
      {showToNext ? (
        <Txt size={12} color={semantic.textSecondary}>
          باقٍ {toArabicNumerals(lvl.toNext)} نقطة للمستوى التالي
        </Txt>
      ) : null}
    </Card>
  );
}
