import { useState } from "react";
import { Pressable, ScrollView, Switch, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts, gradients, radii, semantic, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { toArabicNumerals } from "@/utils/numerals";
import { adhkarData } from "@/data/adhkar";
import { ensureReminders, cancelReminders } from "@/utils/notifications";
import { useSettings } from "@/store/store";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, update } = useSettings();
  const [name, setName] = useState(settings.name);

  function saveName() {
    const t = name.trim();
    if (t && t !== settings.name) update({ name: t });
  }

  async function toggleReminders(value: boolean) {
    if (value) {
      const ok = await ensureReminders(settings.morningTime, settings.eveningTime);
      update({ remindersEnabled: ok });
    } else {
      await cancelReminders();
      update({ remindersEnabled: false });
    }
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
          paddingTop: insets.top + spacing.lg,
          paddingBottom: spacing.xxl,
          paddingHorizontal: spacing.xl,
          gap: spacing.lg,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Txt size={22} weight="bold">ملفي</Txt>

        {/* Name */}
        <View style={{ gap: spacing.sm }}>
          <Txt size={14} weight="medium" color={semantic.textSecondary}>الاسم</Txt>
          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={saveName}
            onSubmitEditing={saveName}
            returnKeyType="done"
            placeholder="اكتب اسمك"
            placeholderTextColor={semantic.textTertiary}
            style={{
              backgroundColor: semantic.surfaceStrong,
              borderRadius: radii.tile,
              borderCurve: "continuous",
              paddingHorizontal: spacing.lg,
              paddingVertical: 14,
              fontFamily: fonts.sansMedium,
              fontSize: 18,
              color: semantic.textPrimary,
              textAlign: "auto",
              writingDirection: "auto",
            }}
          />
        </View>

        {/* Reminders */}
        <View
          style={{
            backgroundColor: semantic.surface,
            borderRadius: radii.card,
            borderCurve: "continuous",
            overflow: "hidden",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing.lg }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Icon name="bell.fill" size={20} color={semantic.accentLight} />
              <Txt size={15} weight="medium">تذكير الصباح والمساء</Txt>
            </View>
            <Switch
              value={settings.remindersEnabled}
              onValueChange={toggleReminders}
              trackColor={{ true: semantic.accent, false: semantic.surfaceFaint }}
              thumbColor={semantic.textOnColor}
            />
          </View>
          <Pressable
            onPress={() => router.push("/settings/reminders")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: spacing.lg,
              borderTopWidth: 1,
              borderTopColor: semantic.surfaceStrong,
            }}
          >
            <Txt size={15} weight="medium">أوقات التذكير</Txt>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Txt size={13} color={semantic.textSecondary}>
                {toArabicNumerals(settings.morningTime)} · {toArabicNumerals(settings.eveningTime)}
              </Txt>
              <Icon name="chevron.forward" size={16} color={semantic.textTertiary} />
            </View>
          </Pressable>
        </View>

        {/* About the app */}
        <View
          style={{
            backgroundColor: semantic.surface,
            borderRadius: radii.card,
            borderCurve: "continuous",
            padding: spacing.lg,
            gap: spacing.sm,
          }}
        >
          <Txt size={15} weight="bold">عن وِرْد</Txt>
          <Txt size={13} color={semantic.textSecondary} style={{ lineHeight: 24 }}>
            المصدر: {adhkarData.source}
          </Txt>
          <Txt size={13} color={semantic.textSecondary} style={{ lineHeight: 24 }}>
            كل بياناتك محفوظة على جهازك فقط — لا اتصال بالشبكة.
          </Txt>
        </View>
      </ScrollView>
    </View>
  );
}
