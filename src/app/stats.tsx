import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { Card } from "@/components/card";
import { toArabicNumerals } from "@/utils/numerals";
import {
  firstWeekdayOfMonth,
  monthDayKeys,
  shiftDayKey,
  startOfWeekKey,
  todayKey,
  weekKeys,
  weekdayLetter,
} from "@/store/dates";
import { dayState, weekDelta, weeklyBars, type DayCellState } from "@/store/calendar";
import { monthLabel } from "@/store/hijri";
import { useProgressMap } from "@/store/store";

const WEEKDAY_HEADERS = ["س", "ح", "ن", "ث", "ر", "خ", "ج"]; // Saturday first

const CELL: Record<DayCellState, { bg: string; fg: string }> = {
  today: { bg: colors.gold500, fg: colors.green800 },
  future: { bg: colors.futureCell, fg: colors.futureCellText },
  complete: { bg: colors.green700, fg: "#fff" },
  partial: { bg: colors.partialCell, fg: colors.partialCellText },
  missed: { bg: colors.missedCell, fg: colors.missedCellText },
};

function Legend({ state, label }: { state: DayCellState; label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: CELL[state].bg }} />
      <Txt size={12} color={colors.muted3}>{label}</Txt>
    </View>
  );
}

export default function Stats() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const progress = useProgressMap();
  const today = todayKey();

  const now = new Date();
  const [ym, setYm] = useState({ year: now.getFullYear(), month1: now.getMonth() + 1 });

  function shiftMonth(delta: number) {
    setYm(({ year, month1 }) => {
      let m = month1 + delta;
      let y = year;
      if (m < 1) {
        m = 12;
        y -= 1;
      } else if (m > 12) {
        m = 1;
        y += 1;
      }
      return { year: y, month1: m };
    });
  }

  const keys = monthDayKeys(ym.year, ym.month1);
  const leading = (firstWeekdayOfMonth(ym.year, ym.month1) + 1) % 7;
  const cells: (string | null)[] = [...Array(leading).fill(null), ...keys];

  // Weekly chart (Saturday-based week)
  const thisWeek = weekKeys(startOfWeekKey(today));
  const prevWeek = weekKeys(shiftDayKey(startOfWeekKey(today), -7));
  const bars = weeklyBars(thisWeek, progress);
  const delta = weekDelta(thisWeek, prevWeek, progress);
  const maxVal = Math.max(...bars.values, 1);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.green800,
        experimental_backgroundImage: "linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
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
          <Icon name="chevron.backward" size={24} color={colors.creamText} />
        </Pressable>
        <Txt size={17} weight="bold" align="center">الإحصائيات والتقويم</Txt>
        <View style={{ width: 38, height: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + spacing.xxl,
          paddingHorizontal: spacing.xl,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Month switcher */}
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Pressable onPress={() => shiftMonth(-1)} hitSlop={12} style={{ padding: 4 }}>
              <Icon name="chevron.backward" size={22} color={colors.gold300} />
            </Pressable>
            <Txt size={16} weight="bold">{monthLabel(ym.year, ym.month1)}</Txt>
            <Pressable onPress={() => shiftMonth(1)} hitSlop={12} style={{ padding: 4 }}>
              <Icon name="chevron.forward" size={22} color={colors.gold300} />
            </Pressable>
          </View>

          {/* Day headers */}
          <View style={{ flexDirection: "row", marginTop: spacing.sm }}>
            {WEEKDAY_HEADERS.map((h, i) => (
              <View key={i} style={{ width: `${100 / 7}%`, alignItems: "center" }}>
                <Txt size={11} color={colors.muted3}>{h}</Txt>
              </View>
            ))}
          </View>

          {/* Day cells */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {cells.map((key, i) => {
              if (!key) return <View key={`b${i}`} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />;
              const s = CELL[dayState(key, progress, today)];
              const dayNum = Number(key.split("-")[2]);
              return (
                <View key={key} style={{ width: `${100 / 7}%`, aspectRatio: 1, padding: 3 }}>
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      borderCurve: "continuous",
                      backgroundColor: s.bg,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Txt size={12} weight="semibold" color={s.fg}>{toArabicNumerals(dayNum)}</Txt>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Color legend */}
          <View style={{ flexDirection: "row", justifyContent: "center", gap: spacing.lg, marginTop: spacing.sm }}>
            <Legend state="complete" label="مكتمل" />
            <Legend state="partial" label="جزئي" />
            <Legend state="missed" label="فائت" />
          </View>
        </Card>

        {/* Weekly chart */}
        <Card>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Txt size={16} weight="bold">هذا الأسبوع</Txt>
            {delta !== null ? (
              <Txt size={12} weight="semibold" color={delta >= 0 ? colors.sage : colors.terracotta500}>
                {delta >= 0 ? "+" : "−"}{toArabicNumerals(Math.abs(delta))}٪ عن السابق
              </Txt>
            ) : null}
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end", height: 96, marginTop: spacing.sm }}>
            {thisWeek.map((key, i) => {
              const value = bars.values[i];
              const h = 16 + (value / maxVal) * 64;
              return (
                <View key={key} style={{ flex: 1, alignItems: "center", gap: 6 }}>
                  <View
                    style={{
                      width: "55%",
                      height: h,
                      borderRadius: 6,
                      backgroundColor: i === bars.maxIndex ? colors.gold500 : colors.whiteAlpha14,
                    }}
                  />
                  <Txt size={11} color={key === today ? colors.gold300 : colors.muted3}>
                    {weekdayLetter(key)}
                  </Txt>
                </View>
              );
            })}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
