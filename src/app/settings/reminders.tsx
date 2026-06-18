import { useState } from "react";
import { Pressable, ScrollView, Switch, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { toArabicNumerals } from "@/utils/numerals";
import {
  cancelReminders,
  ensureReminders,
  scheduleReminders,
} from "@/utils/notifications";
import { useSettings } from "@/store/store";

function timeToDate(t: string): Date {
  const [h, m] = t.split(":").map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}
function dateToTime(d: Date): string {
  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function Reminders() {
  const { semantic, radii, gradients } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, update } = useSettings();
  const [picking, setPicking] = useState<null | "morning" | "evening">(null);

  async function toggle(value: boolean) {
    if (value) {
      const ok = await ensureReminders(settings.morningTime, settings.eveningTime);
      update({ remindersEnabled: ok });
    } else {
      await cancelReminders();
      update({ remindersEnabled: false });
    }
  }

  async function onChange(which: "morning" | "evening", event: DateTimePickerEvent, date?: Date) {
    if (process.env.EXPO_OS !== "ios") setPicking(null);
    if (event.type === "dismissed" || !date) return;
    const t = dateToTime(date);
    const morning = which === "morning" ? t : settings.morningTime;
    const evening = which === "evening" ? t : settings.eveningTime;
    update(which === "morning" ? { morningTime: t } : { eveningTime: t });
    if (settings.remindersEnabled) await scheduleReminders(morning, evening);
  }

  function TimeRow({ which, label }: { which: "morning" | "evening"; label: string }) {
    const value = which === "morning" ? settings.morningTime : settings.eveningTime;
    return (
      <View>
        <Pressable
          onPress={() => setPicking(picking === which ? null : which)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: spacing.lg,
          }}
        >
          <Txt size={15} weight="medium">{label}</Txt>
          <Txt size={16} weight="semibold" color={semantic.accentLight} style={{ fontVariant: ["tabular-nums"] }}>
            {toArabicNumerals(value)}
          </Txt>
        </Pressable>
        {picking === which ? (
          <DateTimePicker
            value={timeToDate(value)}
            mode="time"
            display={process.env.EXPO_OS === "ios" ? "spinner" : "default"}
            onChange={(e, d) => onChange(which, e, d)}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: semantic.screen,
        experimental_backgroundImage: gradients.darkScreen,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: spacing.xl,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={{ width: 38, height: 38, alignItems: "center", justifyContent: "center" }}>
            <Icon name="chevron.backward" size={24} color={semantic.textPrimary} />
          </Pressable>
          <Txt size={18} weight="bold">أوقات التذكير</Txt>
          <View style={{ width: 38 }} />
        </View>

        <View style={{ backgroundColor: semantic.surface, borderRadius: radii.card, borderCurve: "continuous", padding: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
            <Icon name="bell.fill" size={20} color={semantic.accentLight} />
            <Txt size={15} weight="medium">تفعيل التذكير</Txt>
          </View>
          <Switch
            value={settings.remindersEnabled}
            onValueChange={toggle}
            trackColor={{ true: semantic.accent, false: semantic.surfaceFaint }}
            thumbColor={semantic.textOnColor}
          />
        </View>

        <View style={{ backgroundColor: semantic.surface, borderRadius: radii.card, borderCurve: "continuous", overflow: "hidden" }}>
          <TimeRow which="morning" label="تذكير الصباح" />
          <View style={{ height: 1, backgroundColor: semantic.surfaceStrong }} />
          <TimeRow which="evening" label="تذكير المساء" />
        </View>

        <Txt size={13} color={semantic.textSecondary} style={{ lineHeight: 22 }}>
          تصلك التنبيهات محلياً على جهازك في الوقت المحدّد — حتى دون اتصال بالإنترنت.
        </Txt>
      </ScrollView>
    </View>
  );
}
